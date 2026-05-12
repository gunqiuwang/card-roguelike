/**
 * 全局游戏状态 Store · v0.2
 *
 * 设计要点：
 *   · 引擎是**原地修改**的（battleState / runState 会被 battle.ts 直接 mutate）
 *   · 用 useReducer 会每 tick 强制全量 clone，浪费且易漏（意图 index、uid 抖动）
 *   · 方案：把 run/meta 放在 ref 里，UI 通过 `version` 触发 re-render；
 *     所有 engine 动作在 store 的方法里调用，调用完后 bump version
 *
 * 暴露：
 *   useGame() → {
 *     run, meta,
 *     screen,                 // 当前屏幕
 *     newRun(), continueRun(), quitRun(),
 *     enterNode(), playCard(), endTurn(), chooseSeal(),
 *     takeReward(), resolveOverflow(),
 *     resolveEventChoice(), dismissEvent(),
 *     shrineAct(), leaveShrine(),
 *     returnToTitle(),
 *   }
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { MetaProgress, RunState, Scroll } from '../types';
import {
  advanceNode,
  chooseSeal as engineChooseSeal,
  submitStroke as engineSubmitStroke,
  cancelSealChoice as engineCancelSealChoice,
  createDefaultRng,
  createRun,
  currentNode,
  dismissEvent as engineDismissEvent,
  endTurn as engineEndTurn,
  enterNode as engineEnterNode,
  leaveShrine as engineLeaveShrine,
  playCard as enginePlayCard,
  persistMeta,
  persistRun,
  resolveBattle as engineResolveBattle,
  resolveEventChoice as engineResolveEventChoice,
  resolveOverflow as engineResolveOverflow,
  runFinished,
  type RNG,
  type ShrineAction,
  shrineAct as engineShrineAct,
  shrineScrollOffers,
  checkBacklash,
  takeReward as engineTakeReward,
  loadSave,
} from '../engine';
import type { StrokeKind } from '../types';

// ============================================================================
// 屏幕枚举
// ============================================================================
export type Screen =
  | 'title'
  | 'map'
  | 'battle'
  | 'reward'
  | 'event'
  | 'shrine'
  | 'victory'
  | 'gameOver'
  | 'codex'
  | 'styleguide'
  | 'overflow';

// ============================================================================
// 教程 · 新手指引 · 步骤 ID
// ============================================================================
export type TutorialStep =
  | 'none'           // 不在教程（老玩家 / 已跳过）
  | 'welcome'        // 欢迎 · 介绍"这是第一战"
  | 'showHand'       // 介绍手牌
  | 'showEnergy'     // 介绍能量
  | 'showIntent'    // 介绍敌人意图
  | 'tryPlay'       // 引导打一张卡
  | 'tryEndTurn'    // 引导结束回合
  | 'sealHint'      // 敌血低时介绍封妖
  | 'done';         // 完成（写入 meta.tutorialDone）

// ============================================================================
// Store interface
// ============================================================================
export interface GameStore {
  run: RunState | null;
  meta: MetaProgress;
  screen: Screen;
  hasSavedRun: boolean;
  shrineMessage: string;
  tutorialStep: TutorialStep;

  // run 生命周期
  newRun: () => void;
  continueRun: () => void;
  quitRun: () => void;
  returnToTitle: () => void;
  gotoScreen: (s: Screen) => void;

  // 节点
  enterNode: () => void;
  advanceFromShrine: () => void;

  // 战斗
  playCard: (handIdx: number, targetIdx?: number) => void;
  endTurn: () => void;
  chooseSeal: (enemyIdx: number, choice: 'kill' | 'seal') => void;
  submitStroke: (stroke: StrokeKind) => void;
  cancelSealChoice: () => void;
  triggerTaiji: () => void;

  // 奖励 / 事件 / 祭坛 / 溢出
  takeReward: (cardIdx: number | 'skip') => void;
  resolveOverflow: (removeIdx: number) => void;
  resolveEventChoice: (idx: number) => void;
  dismissEvent: () => void;
  shrineAct: (action: ShrineAction) => void;
  /** 祭坛当前可购买的秘卷（进入祭坛时由 store 滚一次） */
  shrineScrolls: Scroll[];
  /** 夜间反噬提示 · 非 null 时 UI 弹出；玩家点确认后置 null */
  backlashMessage: string | null;
  acknowledgeBacklash: () => void;

  // 自动战斗
  autoMode: boolean;
  toggleAutoMode: () => void;

  // 教程
  advanceTutorial: () => void;
  skipTutorial: () => void;
}

const GameCtx = createContext<GameStore | null>(null);

// ============================================================================
// Provider
// ============================================================================
export function GameProvider({
  children,
  initialScreen = 'title',
}: {
  children: ReactNode;
  initialScreen?: Screen;
}) {
  const runRef = useRef<RunState | null>(null);
  const metaRef = useRef<MetaProgress>({
    runs: 0,
    victories: 0,
    seals: 0,
    deepestChapter: 0,
    unlockedYao: [],
    tutorialDone: false,
  });
  const rngRef = useRef<RNG>(createDefaultRng());
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [, setVersion] = useState(0);
  const [shrineMessage, setShrineMessage] = useState('');
  const [hasSavedRun, setHasSavedRun] = useState(false);
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>('none');
  const [shrineScrolls, setShrineScrolls] = useState<Scroll[]>([]);
  const [backlashMessage, setBacklashMessage] = useState<string | null>(null);
  const [autoMode, setAutoMode] = useState(false);

  const bump = useCallback(() => setVersion((v) => v + 1), []);

  // 首次挂载：读存档
  useEffect(() => {
    const save = loadSave();
    metaRef.current = save.meta;
    if (save.runInProgress && runFinished(save.runInProgress) == null) {
      setHasSavedRun(true);
    }
    bump();
  }, [bump]);

  // 持久化工具
  const persist = useCallback(() => {
    persistRun(runRef.current);
    persistMeta(metaRef.current);
  }, []);

  // ==========================================================================
  // run 生命周期
  // ==========================================================================
  const newRun = useCallback((playerClass: 'fangshi' | 'yinyang' = 'fangshi') => {
    const seed = (Math.random() * 2 ** 31) | 0;
    rngRef.current = createDefaultRng();
    const run = createRun(seed, playerClass);
    runRef.current = run;
    metaRef.current.runs += 1;
    setScreen('map');
    setHasSavedRun(true);
    // 若之前没完成教程 → 起手从 'welcome' 开始
    if (!metaRef.current.tutorialDone) {
      setTutorialStep('welcome');
    } else {
      setTutorialStep('none');
    }
    persist();
    bump();
  }, [bump, persist]);

  const continueRun = useCallback(() => {
    const save = loadSave();
    metaRef.current = save.meta;
    if (save.runInProgress && runFinished(save.runInProgress) == null) {
      runRef.current = save.runInProgress;
      // 恢复正在进行的屏幕
      const run = runRef.current;
      if (run.battle) setScreen('battle');
      else if (run.pendingReward) setScreen('reward');
      else if (run.pendingEvent) setScreen('event');
      else if (run.pendingOverflow) setScreen('overflow');
      else {
        const node = currentNode(run);
        if (node?.kind === 'shrine' && !node.done) setScreen('shrine');
        else setScreen('map');
      }
      setHasSavedRun(true);
      bump();
    } else {
      newRun();
    }
  }, [bump, newRun]);

  const quitRun = useCallback(() => {
    runRef.current = null;
    persistRun(null);
    setHasSavedRun(false);
    setScreen('title');
    bump();
  }, [bump]);

  const returnToTitle = useCallback(() => {
    setScreen('title');
    bump();
  }, [bump]);

  const gotoScreen = useCallback(
    (s: Screen) => {
      setScreen(s);
      bump();
    },
    [bump],
  );

  // ==========================================================================
  // 内部：战斗结算的路由
  // ==========================================================================
  const postBattleRoute = useCallback(() => {
    const run = runRef.current;
    if (!run) return;
    if (!run.battle) {
      // 已被 resolveBattle 清掉
      return;
    }
    if (run.battle.phase === 'won') {
      engineResolveBattle(run, rngRef.current);
      if (run.pendingOverflow) setScreen('overflow');
      else if (run.pendingReward) {
        if (run.pendingReward.cardChoices.length === 0) {
          // 全封 → 无卡奖励，直接推进
          run.pendingReward = null;
          advanceNode(run);
          routeToNextNode();
        } else {
          setScreen('reward');
        }
      }
    } else if (run.battle.phase === 'lost') {
      engineResolveBattle(run, rngRef.current);
      setScreen('gameOver');
    }
    persist();
  }, [persist]);

  // ==========================================================================
  // 路由到下个节点（map / shrine / victory）
  // ==========================================================================
  const routeToNextNode = useCallback(() => {
    const run = runRef.current;
    if (!run) return;
    // 夜间反噬（节点完成后触发一次）
    const bl = checkBacklash(run);
    if (bl) {
      setBacklashMessage(bl.message);
      persist();
      bump();
      // 伤害已经应用；玩家关闭提示后由 acknowledgeBacklash 继续推进
      return;
    }
    const fin = runFinished(run);
    if (fin === 'victory') {
      metaRef.current.victories += 1;
      metaRef.current.seals += run.stats.seals;
      for (const n of run.map) {
        for (const id of n.enemyYaoIds ?? []) {
          if (!metaRef.current.unlockedYao.includes(id))
            metaRef.current.unlockedYao.push(id);
        }
      }
      metaRef.current.deepestChapter = Math.max(metaRef.current.deepestChapter, 1);
      runRef.current = null;
      setHasSavedRun(false);
      persistRun(null);
      persistMeta(metaRef.current);
      setScreen('victory');
      bump();
      return;
    }
    if (fin === 'defeated') {
      metaRef.current.seals += run.stats.seals;
      runRef.current = null;
      setHasSavedRun(false);
      persistRun(null);
      persistMeta(metaRef.current);
      setScreen('gameOver');
      bump();
      return;
    }
    // 未结束 → 根据当前节点种类选屏
    const node = currentNode(run);
    if (!node) return;
    if (node.kind === 'shrine') setScreen('shrine');
    else setScreen('map');
    persist();
    bump();
  }, [bump, persist]);

  // ==========================================================================
  // 节点进入
  // ==========================================================================
  const enterNode = useCallback(() => {
    const run = runRef.current;
    if (!run) return;
    engineEnterNode(run, rngRef.current);
    if (run.battle) setScreen('battle');
    else if (run.pendingEvent) setScreen('event');
    else {
      const n = currentNode(run);
      if (n?.kind === 'shrine') {
        // 祭坛：滚一次可购买的秘卷
        setShrineScrolls(shrineScrollOffers(run, rngRef.current));
        setScreen('shrine');
      }
    }
    persist();
    bump();
  }, [bump, persist]);

  // ==========================================================================
  // 战斗动作
  // ==========================================================================
  const playCard = useCallback(
    (handIdx: number, targetIdx?: number) => {
      const run = runRef.current;
      if (!run?.battle) return;
      enginePlayCard(run.battle, handIdx, rngRef.current, targetIdx);
      // 教程：首次出牌 → 进入 tryEndTurn
      if (tutorialStep === 'tryPlay') setTutorialStep('tryEndTurn');
      if (run.battle.phase === 'won' || run.battle.phase === 'lost') postBattleRoute();
      bump();
    },
    [bump, postBattleRoute, tutorialStep],
  );

  const endTurn = useCallback(() => {
    const run = runRef.current;
    if (!run?.battle) return;
    engineEndTurn(run.battle, rngRef.current);
    // 教程：首次结束回合 → 教程完成
    if (tutorialStep === 'tryEndTurn') {
      setTutorialStep('done');
      metaRef.current = { ...metaRef.current, tutorialDone: true };
      persist();
    }
    if (run.battle.phase === 'won' || run.battle.phase === 'lost') postBattleRoute();
    bump();
  }, [bump, postBattleRoute, tutorialStep, persist]);

  const chooseSeal = useCallback(
    (enemyIdx: number, choice: 'kill' | 'seal') => {
      const run = runRef.current;
      if (!run?.battle) return;
      engineChooseSeal(run.battle, enemyIdx, choice);
      // 教程：封妖提示也算完结
      if (tutorialStep === 'sealHint') {
        setTutorialStep('done');
        metaRef.current = { ...metaRef.current, tutorialDone: true };
        persist();
      }
      if (run.battle.phase === 'won' || run.battle.phase === 'lost') postBattleRoute();
      bump();
    },
    [bump, postBattleRoute, tutorialStep, persist],
  );

  const submitStroke = useCallback(
    (stroke: StrokeKind) => {
      const run = runRef.current;
      if (!run?.battle) return;
      engineSubmitStroke(run.battle, stroke);
      if (run.battle.phase === 'won' || run.battle.phase === 'lost') postBattleRoute();
      bump();
    },
    [bump, postBattleRoute],
  );

  const cancelSealChoice = useCallback(() => {
    const run = runRef.current;
    if (!run?.battle) return;
    engineCancelSealChoice(run.battle);
    bump();
  }, [bump]);

  const triggerTaiji = useCallback(() => {
    const run = runRef.current;
    if (!run?.battle) return;
    const battle = run.battle;
    if (!battle.taijiReady) return;
    const taijiCard = battle.hand.find((c) => c.id === 'ult_taiji');
    if (!taijiCard) return;
    const handIdx = battle.hand.indexOf(taijiCard);
    if (handIdx < 0) return;
    // 太极归一目标是全体，找第一个活敌
    const targetIdx = battle.enemies.findIndex((e) => e.hp > 0);
    if (targetIdx < 0) return;
    enginePlayCard(battle, handIdx, rngRef.current, targetIdx);
    // 清零阴阳积蓄
    battle.yinBalance = 0;
    battle.yangBalance = 0;
    battle.taijiReady = false;
    if (battle.phase === 'won' || battle.phase === 'lost') postBattleRoute();
    bump();
  }, [bump, postBattleRoute]);

  const toggleAutoMode = useCallback(() => {
    setAutoMode((prev) => !prev);
  }, []);

  // ==========================================================================
  // 奖励 / 事件 / 祭坛 / 溢出
  // ==========================================================================
  const takeReward = useCallback(
    (cardIdx: number | 'skip') => {
      const run = runRef.current;
      if (!run) return;
      engineTakeReward(run, cardIdx);
      if (run.pendingOverflow) setScreen('overflow');
      else routeToNextNode();
      persist();
      bump();
    },
    [bump, persist, routeToNextNode],
  );

  const resolveOverflow = useCallback(
    (removeIdx: number) => {
      const run = runRef.current;
      if (!run) return;
      engineResolveOverflow(run, removeIdx);
      routeToNextNode();
      persist();
      bump();
    },
    [bump, persist, routeToNextNode],
  );

  const resolveEventChoice = useCallback(
    (idx: number) => {
      const run = runRef.current;
      if (!run?.pendingEvent) return;
      engineResolveEventChoice(run, idx, rngRef.current);
      persist();
      bump();
    },
    [bump, persist],
  );

  const dismissEvent = useCallback(() => {
    const run = runRef.current;
    if (!run) return;
    engineDismissEvent(run);
    if (run.pendingOverflow) setScreen('overflow');
    else routeToNextNode();
    persist();
    bump();
  }, [bump, persist, routeToNextNode]);

  const shrineAct = useCallback(
    (action: ShrineAction) => {
      const run = runRef.current;
      if (!run) return;
      const msg = engineShrineAct(run, action);
      setShrineMessage(msg);
      persist();
      bump();
    },
    [bump, persist],
  );

  const advanceFromShrine = useCallback(() => {
    const run = runRef.current;
    if (!run) return;
    engineLeaveShrine(run);
    setShrineMessage('');
    setShrineScrolls([]);
    routeToNextNode();
    persist();
    bump();
  }, [bump, persist, routeToNextNode]);

  const acknowledgeBacklash = useCallback(() => {
    setBacklashMessage(null);
    // 关闭后继续正常路由
    const run = runRef.current;
    if (!run) return;
    const fin = runFinished(run);
    if (fin === 'defeated') {
      runRef.current = null;
      setHasSavedRun(false);
      persistRun(null);
      persistMeta(metaRef.current);
      setScreen('gameOver');
      bump();
      return;
    }
    const node = currentNode(run);
    if (!node) return;
    if (node.kind === 'shrine') setScreen('shrine');
    else setScreen('map');
    persist();
    bump();
  }, [bump, persist]);

  // ==========================================================================
  // 教程控制
  // ==========================================================================
  const advanceTutorial = useCallback(() => {
    setTutorialStep((cur) => {
      switch (cur) {
        case 'welcome': return 'showHand';
        case 'showHand': return 'showEnergy';
        case 'showEnergy': return 'showIntent';
        case 'showIntent': return 'tryPlay';
        case 'tryPlay': return 'tryPlay';     // 等玩家真打一张
        case 'tryEndTurn': return 'tryEndTurn';  // 等玩家真结束回合
        case 'sealHint': return 'sealHint';   // 等玩家做封/斩
        case 'done':
        case 'none':
        default:
          return 'none';
      }
    });
  }, []);

  const skipTutorial = useCallback(() => {
    setTutorialStep('none');
    metaRef.current = { ...metaRef.current, tutorialDone: true };
    persist();
    bump();
  }, [bump, persist]);

  // 在战斗中：当敌人血量首次低于 30% 时，若还在教程里，自动打开 sealHint
  useEffect(() => {
    const run = runRef.current;
    if (!run?.battle) return;
    if (metaRef.current.tutorialDone) return;
    // 只在 tryPlay / tryEndTurn 阶段升格到 sealHint
    if (tutorialStep !== 'tryPlay' && tutorialStep !== 'tryEndTurn') return;
    const anyLow = run.battle.enemies.some(
      (e) => e.hp > 0 && e.hp <= e.maxHp * 0.3 && !e.sealChoiceTriggered && !e.sealed,
    );
    if (run.battle.phase === 'sealChoice' || anyLow) {
      setTutorialStep('sealHint');
    }
  });

  // ==========================================================================
  // store 对象 · 每次 render 直接构造一个新对象
  //
  // 为什么不 useMemo：我们的引擎是"原地修改"语义（battle / run 都是
  // ref.current 指向的同一对象，mutate 不换引用）。useMemo 的 deps
  // 没法可靠声明"ref 内部任意字段是否变了"，漏写就会 UI 卡死点不动。
  // 每次 render 生成新对象成本 = 一次浅拷贝的方法表，微不足道。
  // ==========================================================================
  const value: GameStore = {
    run: runRef.current,
    meta: metaRef.current,
    screen,
    hasSavedRun,
    shrineMessage,
    tutorialStep,
    shrineScrolls,
    backlashMessage,
    newRun,
    continueRun,
    quitRun,
    returnToTitle,
    gotoScreen,
    enterNode,
    advanceFromShrine,
    playCard,
    endTurn,
    chooseSeal,
    submitStroke,
    cancelSealChoice,
    triggerTaiji,
    takeReward,
    resolveOverflow,
    resolveEventChoice,
    dismissEvent,
    shrineAct,
    advanceTutorial,
    skipTutorial,
    acknowledgeBacklash,
    autoMode,
    toggleAutoMode,
  };

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export function useGame(): GameStore {
  const ctx = useContext(GameCtx);
  if (!ctx) throw new Error('useGame() must be used within <GameProvider>');
  return ctx;
}
