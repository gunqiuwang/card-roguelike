/**
 * Run 引擎 · v0.2
 *
 * 串联：地图 → 战斗 → 奖励 → 事件 → 祭坛 → 下个节点
 *
 * 暴露 API（供 store / UI 调用）：
 *   · createRun(seed)                    → 新开一局
 *   · currentNode(run)                   → 当前节点（NodeKind 分派）
 *   · enterNode(run, rng)                → 进入节点（创建 battle / pendingEvent）
 *   · resolveBattle(run, rng)            → 战斗结束后收尾 → pendingReward
 *   · takeReward(run, cardIdxOrSkip)     → 领取卡牌奖励（含牌组上限检查）
 *   · resolveEventChoice(run, idx, rng)  → 事件选择
 *   · shrinePurchase(run, action)        → 祭坛操作
 *   · advanceNode(run)                   → 标记当前节点完成并前进
 *   · resolveOverflow(run, removeIdx)    → 处理牌组超 20 张
 *
 * 副作用：全部直接修改 run。
 */

import type {
  Card,
  CardRarity,
  MapNode,
  RunState,
  NodeKind,
  Scroll,
  ChapterId,
} from '../types';
import { balance } from '../config/balance';
import { buildStarterDeck, ALL_REWARD_CARDS } from '../data/cards';
import { ALL_EVENTS, getEvent } from '../data/events';
import { getYao, yaoOfChapter } from '../data/yao';
import { rollShrineScrolls, getScroll } from '../data/scrolls';
import { createRng, type RNG } from './rng';
import { startBattle } from './battle';

/** 章节顺序 */
export const CHAPTER_ORDER: ChapterId[] = ['qingqiu', 'taotie', 'guixu', 'kunlun'];

export const CHAPTER_NAMES: Record<string, string> = {
  qingqiu: '青丘残岭',
  taotie: '饕餮古镇',
  guixu: '归墟冥海',
  kunlun: '昆仑仙境',
};

function getChapterConfig(chapter: ChapterId): {
  normalCount: number;
  eliteCount: number;
  bossId: string;
  eventCount: number;
} {
  switch (chapter) {
    case 'qingqiu':
      return { normalCount: 4, eliteCount: 1, bossId: 'jiuweihu_boss', eventCount: 1 };
    case 'taotie':
      return { normalCount: 4, eliteCount: 1, bossId: 'taotie_lord', eventCount: 1 };
    case 'guixu':
      return { normalCount: 4, eliteCount: 1, bossId: 'sea_emperor', eventCount: 1 };
    case 'kunlun':
      return { normalCount: 4, eliteCount: 1, bossId: 'kunlun_guardian', eventCount: 1 };
    default:
      return { normalCount: 4, eliteCount: 1, bossId: 'jiuweihu_boss', eventCount: 1 };
  }
}

// ============================================================================
// 地图生成
// ============================================================================
/**
 * 通用章节地图生成器
 * 每章 8 节点：battle×4 / event×1 / shrine×1 / elite×1 / boss×1
 */
export function generateChapterMap(chapter: ChapterId, rng: RNG, chapterIndex: number): MapNode[] {
  const cfg = getChapterConfig(chapter);
  const events = ALL_EVENTS.filter((e) => e.chapter === chapter || !e.chapter);
  const eventId = events.length > 0 ? events[rng.int(0, events.length - 1)].id : 'grave';

  const yaoPool = yaoOfChapter(chapter);
  const normalYao = yaoPool.filter((y) => y.rank === 'C');
  const eliteYao = yaoPool.filter((y) => y.rank === 'B');
  const boss = getYao(cfg.bossId);

  const chapterPrefix = `${chapterIndex + 1}`;

  const nodes: MapNode[] = [
    // 战斗1
    {
      id: `${chapterPrefix}_1`, kind: 'battle',
      label: `迎客·${normalYao[0]?.name ?? '妖'}`,
      enemyYaoIds: [normalYao[0]?.id ?? 'qinghu'],
      done: false,
    },
    // 战斗2
    {
      id: `${chapterPrefix}_2`, kind: 'battle',
      label: `双妖·${normalYao[1]?.name ?? '妖'}`,
      enemyYaoIds: [normalYao[1]?.id ?? 'qinghu', normalYao[2]?.id ?? 'yehu'],
      done: false,
    },
    // 奇遇
    {
      id: `${chapterPrefix}_3`, kind: 'event',
      label: '荒野·奇遇',
      eventId,
      done: false,
    },
    // 战斗3
    {
      id: `${chapterPrefix}_4`, kind: 'battle',
      label: `乱战·${normalYao[2]?.name ?? '妖'}`,
      enemyYaoIds: [normalYao[2]?.id ?? 'yehu', normalYao[0]?.id ?? 'qinghu'],
      done: false,
    },
    // 祭坛
    {
      id: `${chapterPrefix}_5`, kind: 'shrine',
      label: '瞽人·祭坛',
      done: false,
    },
    // 精英
    {
      id: `${chapterPrefix}_6`, kind: 'elite',
      label: `${eliteYao[0]?.name ?? '精英'}（精英）`,
      enemyYaoIds: eliteYao[0] ? [eliteYao[0].id] : [cfg.bossId],
      done: false,
    },
    // 战斗4
    {
      id: `${chapterPrefix}_7`, kind: 'battle',
      label: `终战·${normalYao[3]?.name ?? '妖'}`,
      enemyYaoIds: [normalYao[3]?.id ?? 'yehu', normalYao[1]?.id ?? 'qinghu'],
      done: false,
    },
    // Boss
    {
      id: `${chapterPrefix}_8`, kind: 'boss',
      label: boss.name,
      enemyYaoIds: [boss.id],
      done: false,
    },
  ];
  return nodes;
}

// ============================================================================
// 新建 Run
// ============================================================================
export function createRun(seed: number, playerClass: 'fangshi' | 'yinyang' = 'fangshi'): RunState {
  const rng = createRng(seed);
  const deck = buildStarterDeck();
  return {
    seed,
    hp: balance.player.maxHp,
    maxHp: balance.player.maxHp,
    currency: 0,
    deck,
    map: generateChapterMap('qingqiu', rng, 0),
    nodeIndex: 0,
    chapter: 'qingqiu',
    battle: null,
    pendingReward: null,
    pendingEvent: null,
    pendingOverflow: null,
    stats: {
      turnsPlayed: 0,
      kills: 0,
      seals: 0,
      damageDealt: 0,
      damageTaken: 0,
    },
    scrolls: [],
    yaoxing: {},
    nightBacklashTriggered: false,
    playerClass,
    dualPath: playerClass === 'yinyang'
      ? {
          yinEnergy: balance.dualPath.energyPerTurn,
          yangEnergy: balance.dualPath.energyPerTurn,
          yinBalance: 0,
          yangBalance: 0,
          taijiReady: false,
        }
      : undefined,
  };
}

// ============================================================================
// 节点查询
// ============================================================================
export function currentNode(run: RunState): MapNode | null {
  return run.map[run.nodeIndex] ?? null;
}

function battleKindOfNode(kind: NodeKind): 'normal' | 'elite' | 'boss' {
  if (kind === 'elite') return 'elite';
  if (kind === 'boss') return 'boss';
  return 'normal';
}

// ============================================================================
// 进入节点（根据 kind 分派）
// ============================================================================
export function enterNode(run: RunState, rng: RNG): void {
  const node = currentNode(run);
  if (!node || node.done) return;
  if (run.battle || run.pendingReward || run.pendingEvent) return;

  if (node.kind === 'battle' || node.kind === 'elite' || node.kind === 'boss') {
    if (!node.enemyYaoIds || node.enemyYaoIds.length === 0) return;
    run.battle = startBattle(
      [...node.enemyYaoIds],
      run.hp,
      run.maxHp,
      deckWithYaoxing(run),
      rng,
      battleKindOfNode(node.kind),
      run.scrolls ?? [],
      run.playerClass ?? 'fangshi',
    );
  } else if (node.kind === 'event') {
    if (!node.eventId) return;
    run.pendingEvent = { eventId: node.eventId };
  }
  // shrine 节点：不创建 battle / event；UI 直接渲染 ShrineScreen
}

// ============================================================================
// 战斗收尾 → pendingReward
// ============================================================================
/**
 * 在进入战斗前，给 deck 注入每张妖卡的当前妖性。
 * 这样战斗里 card.yaoxing 读到的是全局最新值。
 */
function deckWithYaoxing(run: RunState): Card[] {
  const map = run.yaoxing ?? {};
  return run.deck.map((c) => {
    if (c.type !== 'yao') return c;
    const yx = map[c.id];
    if (yx === undefined) return c;
    return { ...c, yaoxing: yx };
  });
}

export function resolveBattle(run: RunState, rng: RNG): void {
  const battle = run.battle;
  if (!battle) return;
  if (battle.phase !== 'won' && battle.phase !== 'lost') return;
  const outcome = battle.outcome;
  if (!outcome) return;

  run.hp = battle.playerHp;
  run.stats.turnsPlayed += battle.turn;

  if (outcome.result === 'lose') {
    run.battle = null;
    return;
  }

  // 战斗中妖性可能变化 → 同步回 run.yaoxing（战斗里的 drawPile/hand/discardPile 里的妖卡）
  if (!run.yaoxing) run.yaoxing = {};
  const allBattleCards = [
    ...battle.drawPile,
    ...battle.hand,
    ...battle.discardPile,
    ...battle.exhaustPile,
  ];
  for (const c of allBattleCards) {
    if (c.type === 'yao' && c.yaoxing !== undefined) {
      run.yaoxing[c.id] = c.yaoxing;
    }
  }

  // 战后闲置妖卡妖性衰减 1
  for (const id of Object.keys(run.yaoxing)) {
    run.yaoxing[id] = Math.max(0, run.yaoxing[id] - balance.yaoxing.decayPerBattle);
  }

  for (const e of battle.enemies) {
    if (e.sealed) run.stats.seals += 1;
    else run.stats.kills += 1;
  }

  run.currency += outcome.currencyGained;

  // 封妖：妖卡进牌组 + 注册妖性
  for (const yaoCard of outcome.sealedCards) {
    run.deck.push(yaoCard);
    if (yaoCard.yaoxing !== undefined) {
      run.yaoxing[yaoCard.id] = yaoCard.yaoxing;
    }
  }

  const healPct =
    battle.kind === 'boss'
      ? balance.heal.boss
      : battle.kind === 'elite'
        ? balance.heal.elite
        : balance.heal.normal;
  const anySealed = outcome.resolution === 'seal' || outcome.resolution === 'mixed';
  const healMult = anySealed ? balance.seal.healOnSealMultiplier : 1;
  const healed = Math.round(run.maxHp * healPct * healMult);
  run.hp = Math.min(run.maxHp, run.hp + healed);

  if (battle.kind === 'boss') {
    run.maxHp += balance.heal.bossMaxHpGain;
    run.hp += balance.heal.bossMaxHpGain;
    // Boss 战胜后，检查是否需要开启新章节
    const nextChapter = advanceChapter(run);
    if (nextChapter) {
      // 新章节开始，重置节点，保留玩家进度
      run.map = generateChapterMap(nextChapter, rng, CHAPTER_ORDER.indexOf(nextChapter));
      run.nodeIndex = 0;
      run.chapter = nextChapter;
    }
  }

  let cardChoices: Card[] = [];
  if (outcome.shouldOfferReward) {
    cardChoices = rollCardChoices(battle.kind, rng);
  }

  run.pendingReward = {
    currency: outcome.currencyGained,
    cardChoices,
    done: false,
  };

  run.battle = null;
}

// ============================================================================
// 奖励：稀有度加权抽 3 张
// ============================================================================
function rollCardChoices(
  kind: 'normal' | 'elite' | 'boss',
  rng: RNG,
): Card[] {
  const weights = balance.rewardRarityWeights[kind];
  const out: Card[] = [];
  const tries = 30;
  let t = 0;
  while (out.length < 3 && t++ < tries) {
    const rarity = rng.weightedPick(weights as unknown as Record<CardRarity, number>);
    const pool = ALL_REWARD_CARDS.filter((c) => c.rarity === rarity);
    if (pool.length === 0) continue;
    const pick = pool[rng.int(0, pool.length - 1)];
    // 避免同一个奖励里重复出现同一张
    if (!out.some((c) => c.id === pick.id)) out.push(pick);
  }
  // 兜底：不足 3 张就塞 common
  while (out.length < 3) {
    const pool = ALL_REWARD_CARDS.filter((c) => c.rarity === 'common');
    const pick = pool[rng.int(0, pool.length - 1)];
    if (!out.some((c) => c.id === pick.id)) out.push(pick);
    else break;
  }
  return out;
}

// ============================================================================
// 领取奖励（选卡 or 跳过）
// ============================================================================
export function takeReward(run: RunState, cardIdx: number | 'skip'): void {
  const rew = run.pendingReward;
  if (!rew) return;
  if (cardIdx !== 'skip') {
    const c = rew.cardChoices[cardIdx];
    if (c) {
      run.deck.push(c);
      if (run.deck.length > balance.player.deckSizeMax) {
        run.pendingOverflow = {
          deckSnapshot: [...run.deck],
          reason: 'reward',
        };
      }
    }
  }
  rew.done = true;
  run.pendingReward = null;
  advanceNode(run);
}

// ============================================================================
// 牌组溢出处理
// ============================================================================
export function resolveOverflow(run: RunState, removeIdx: number): void {
  if (!run.pendingOverflow) return;
  if (removeIdx < 0 || removeIdx >= run.deck.length) return;
  run.deck.splice(removeIdx, 1);
  run.pendingOverflow = null;
}

// ============================================================================
// 事件选择
// ============================================================================
export function resolveEventChoice(run: RunState, idx: number, rng: RNG): void {
  const pe = run.pendingEvent;
  if (!pe) return;
  const def = getEvent(pe.eventId);
  const choice = def.choices[idx];
  if (!choice) return;
  const outcomeText = choice.apply(run, rng.next);
  pe.chosenOutcome = {
    description: outcomeText,
    appliedLog: [outcomeText],
  };
  // 玩家点"继续" → dismissEvent → advance
}

export function dismissEvent(run: RunState): void {
  if (!run.pendingEvent) return;
  run.pendingEvent = null;
  // 牌组上限检查
  if (run.deck.length > balance.player.deckSizeMax) {
    run.pendingOverflow = {
      deckSnapshot: [...run.deck],
      reason: 'event',
    };
  }
  // 重置夜间反噬标记（下个节点后可重新触发）
  run.nightBacklashTriggered = false;
  advanceNode(run);
}

// ============================================================================
// 祭坛
// ============================================================================
export type ShrineAction =
  | { kind: 'remove'; cardIdx: number }
  | { kind: 'upgrade'; cardIdx: number }
  | { kind: 'rest' }
  | { kind: 'tame'; cardIdx: number }
  | { kind: 'buyScroll'; scrollId: string }
  | { kind: 'leave' };

export function shrineAct(run: RunState, action: ShrineAction): string {
  const node = currentNode(run);
  if (!node || node.kind !== 'shrine') return '此处并非祭坛。';
  switch (action.kind) {
    case 'remove': {
      if (run.currency < balance.shrine.removeCardCost) return '灵气不足。';
      const card = run.deck[action.cardIdx];
      if (!card) return '未选中牌。';
      run.currency -= balance.shrine.removeCardCost;
      run.deck.splice(action.cardIdx, 1);
      // 清 yaoxing
      if (card.type === 'yao' && run.yaoxing) delete run.yaoxing[card.id];
      return `已删【${card.name}】。（-${balance.shrine.removeCardCost} 灵气）`;
    }
    case 'upgrade': {
      if (run.currency < balance.shrine.upgradeCardCost) return '灵气不足。';
      const card = run.deck[action.cardIdx];
      if (!card) return '未选中牌。';
      run.currency -= balance.shrine.upgradeCardCost;
      run.deck[action.cardIdx] = upgradeCard(card);
      return `【${card.name}】得以升阶。`;
    }
    case 'tame': {
      if (run.currency < balance.shrine.tameCardCost) return '灵气不足。';
      const card = run.deck[action.cardIdx];
      if (!card || card.type !== 'yao') return '只能驯化妖卡。';
      if (!run.yaoxing) run.yaoxing = {};
      const cur = run.yaoxing[card.id] ?? (card.yaoxing ?? 0);
      if (cur <= 0) return '此妖已温顺。';
      run.currency -= balance.shrine.tameCardCost;
      const reduced = Math.max(0, cur - balance.shrine.tameAmount);
      run.yaoxing[card.id] = reduced;
      return `你对【${card.name}】低声念咒。妖性 ${cur} → ${reduced}。`;
    }
    case 'buyScroll': {
      const scroll = getScroll(action.scrollId);
      if (!scroll) return '未知秘卷。';
      if (run.scrolls.includes(scroll.id)) return '此卷已在身。';
      if (run.currency < scroll.cost) return '灵气不足。';
      run.currency -= scroll.cost;
      run.scrolls.push(scroll.id);
      return `你得【${scroll.name}】。${scroll.flavor}`;
    }
    case 'rest': {
      const healed = Math.min(run.maxHp - run.hp, 10);
      run.hp += healed;
      return `你静坐片刻。气血回复 ${healed}。`;
    }
    case 'leave':
      return '你起身离去。';
  }
}

function upgradeCard(c: Card): Card {
  const bonus = balance.shrine.upgradeBonus;
  const upgraded: Card = { ...c, name: `${c.name}+`, effects: [...(c.effects ?? [])] };
  upgraded.effects = upgraded.effects!.map((ef) => {
    if (ef.kind === 'damage') return { ...ef, amount: ef.amount + bonus };
    if (ef.kind === 'block') return { ...ef, amount: ef.amount + bonus };
    return ef;
  });
  upgraded.description = `${c.description}（已升阶 +${bonus}）`;
  return upgraded;
}

export function leaveShrine(run: RunState): void {
  // 重置夜间反噬标记
  run.nightBacklashTriggered = false;
  advanceNode(run);
}

// ============================================================================
// 祭坛 · 每次进入时随机的秘卷清单（2 张）
// ============================================================================
export function shrineScrollOffers(run: RunState, rng: RNG): Scroll[] {
  return rollShrineScrolls(run.scrolls, rng);
}

// ============================================================================
// 夜间反噬：牌组妖卡平均妖性 ≥ 50 → 非战斗节点后触发
// 返回是否触发（以及相关文案，由 UI 读取 run.pendingBacklash）
// ============================================================================
export interface BacklashState {
  hpLost: number;
  message: string;
}

export function checkBacklash(run: RunState): BacklashState | null {
  if (!run.yaoxing) return null;
  const yaoIds = run.deck.filter((c) => c.type === 'yao').map((c) => c.id);
  if (yaoIds.length === 0) return null;
  const total = yaoIds.reduce((s, id) => s + (run.yaoxing![id] ?? 0), 0);
  const avg = total / yaoIds.length;
  if (avg < balance.backlash.threshold) return null;
  const hpLost = Math.round(run.maxHp * balance.backlash.damagePercent);
  run.hp = Math.max(1, run.hp - hpLost);
  return {
    hpLost,
    message: `夜深。牌组中的妖卡低声哀鸣。你从梦中惊醒，口有血腥。（-${hpLost} 气血）`,
  };
}

// ============================================================================
// 章节推进
// ============================================================================
/**
 * Boss 战胜后调用，检查并推进到下个章节。
 * 返回新的 ChapterId 或 null（已通关全部章节 → 触发结局）。
 */
export function advanceChapter(run: RunState): ChapterId | null {
  const idx = CHAPTER_ORDER.indexOf(run.chapter as ChapterId);
  if (idx < 0 || idx >= CHAPTER_ORDER.length - 1) return null; // 已是最末章节
  return CHAPTER_ORDER[idx + 1];
}

export function isLastChapter(run: RunState): boolean {
  const idx = CHAPTER_ORDER.indexOf(run.chapter as ChapterId);
  return idx >= CHAPTER_ORDER.length - 1;
}

export function getCurrentChapterIndex(run: RunState): number {
  return CHAPTER_ORDER.indexOf(run.chapter as ChapterId);
}

// ============================================================================
// 节点推进
// ============================================================================
export function advanceNode(run: RunState): void {
  const node = currentNode(run);
  if (node) node.done = true;
  run.nodeIndex += 1;
}

export function runFinished(run: RunState): 'victory' | 'defeated' | 'ending' | null {
  if (run.hp <= 0) return 'defeated';
  if (run.nodeIndex >= run.map.length) {
    // 检查是否已通关全部章节
    if (isLastChapter(run)) return 'ending';
    return null; // 章节未完，等待推进
  }
  return null;
}

// ============================================================================
// 提取敌人引用（UI / Codex 用）
// ============================================================================
export function yaoOfNode(node: MapNode) {
  return (node.enemyYaoIds ?? []).map((id) => getYao(id));
}

// ============================================================================
// 便利导出
// ============================================================================
export type { RNG };
