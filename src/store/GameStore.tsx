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
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { MetaProgress, RunState } from '../types';
import {
  advanceNode,
  chooseSeal as engineChooseSeal,
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
  takeReward as engineTakeReward,
  loadSave,
} from '../engine';

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
// Store interface
// ============================================================================
export interface GameStore {
  run: RunState | null;
  meta: MetaProgress;
  screen: Screen;
  hasSavedRun: boolean;
  shrineMessage: string;

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

  // 奖励 / 事件 / 祭坛 / 溢出
  takeReward: (cardIdx: number | 'skip') => void;
  resolveOverflow: (removeIdx: number) => void;
  resolveEventChoice: (idx: number) => void;
  dismissEvent: () => void;
  shrineAct: (action: ShrineAction) => void;
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
  });
  const rngRef = useRef<RNG>(createDefaultRng());
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [, setVersion] = useState(0);
  const [shrineMessage, setShrineMessage] = useState('');
  const [hasSavedRun, setHasSavedRun] = useState(false);

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
  const newRun = useCallback(() => {
    const seed = (Math.random() * 2 ** 31) | 0;
    rngRef.current = createDefaultRng();
    const run = createRun(seed);
    runRef.current = run;
    metaRef.current.runs += 1;
    setScreen('map');
    setHasSavedRun(true);
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
      if (n?.kind === 'shrine') setScreen('shrine');
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
      if (run.battle.phase === 'won' || run.battle.phase === 'lost') postBattleRoute();
      bump();
    },
    [bump, postBattleRoute],
  );

  const endTurn = useCallback(() => {
    const run = runRef.current;
    if (!run?.battle) return;
    engineEndTurn(run.battle, rngRef.current);
    if (run.battle.phase === 'won' || run.battle.phase === 'lost') postBattleRoute();
    bump();
  }, [bump, postBattleRoute]);

  const chooseSeal = useCallback(
    (enemyIdx: number, choice: 'kill' | 'seal') => {
      const run = runRef.current;
      if (!run?.battle) return;
      engineChooseSeal(run.battle, enemyIdx, choice);
      if (run.battle.phase === 'won' || run.battle.phase === 'lost') postBattleRoute();
      bump();
    },
    [bump, postBattleRoute],
  );

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
    routeToNextNode();
    persist();
    bump();
  }, [bump, persist, routeToNextNode]);

  // ==========================================================================
  // store 对象（memo：避免子组件不必要 re-render 时能跳过）
  // ==========================================================================
  const value = useMemo<GameStore>(
    () => ({
      run: runRef.current,
      meta: metaRef.current,
      screen,
      hasSavedRun,
      shrineMessage,
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
      takeReward,
      resolveOverflow,
      resolveEventChoice,
      dismissEvent,
      shrineAct,
    }),
    // 注意：这里 depend on `screen + version` 就够了，其余都是 stable ref/callback
    // 但 useState 的 version 通过 `bump` 已驱动 re-render，
    // 所以 run / meta / hasSavedRun / shrineMessage 每次 render 都取最新。
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      screen,
      hasSavedRun,
      shrineMessage,
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
      takeReward,
      resolveOverflow,
      resolveEventChoice,
      dismissEvent,
      shrineAct,
    ],
  );

  return <GameCtx.Provider value={value}>{children}</GameCtx.Provider>;
}

export function useGame(): GameStore {
  const ctx = useContext(GameCtx);
  if (!ctx) throw new Error('useGame() must be used within <GameProvider>');
  return ctx;
}
