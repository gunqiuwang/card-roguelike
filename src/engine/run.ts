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
} from '../types';
import { balance } from '../config/balance';
import { buildStarterDeck, ALL_REWARD_CARDS } from '../data/cards';
import { ALL_EVENTS, getEvent } from '../data/events';
import { getYao } from '../data/yao';
import { createRng, type RNG } from './rng';
import { startBattle } from './battle';

// ============================================================================
// 地图生成
// ============================================================================
/**
 * 第一章「青丘残岭」线性 8 节点（DESIGN §8.1）
 *   battle  战1 · 青狐 ×1
 *   battle  战2 · 青狐 ×2
 *   event   奇遇
 *   battle  战3 · 青狐 + 夜狐
 *   shrine  祭坛
 *   elite   精英 · 九尾（B）
 *   battle  战4 · 夜狐 ×2
 *   boss    Boss · 九尾真身
 */
export function generateChapter1Map(rng: RNG): MapNode[] {
  const events = ALL_EVENTS;
  const eventId = events[rng.int(0, events.length - 1)].id;

  const nodes: MapNode[] = [
    { id: 'n1', kind: 'battle', label: '青狐·迎客', enemyYaoIds: ['qinghu'], done: false },
    {
      id: 'n2',
      kind: 'battle',
      label: '狐踪·双袭',
      enemyYaoIds: ['qinghu', 'qinghu'],
      done: false,
    },
    { id: 'n3', kind: 'event', label: '荒野·奇遇', eventId, done: false },
    {
      id: 'n4',
      kind: 'battle',
      label: '夜狐·混踪',
      enemyYaoIds: ['qinghu', 'yehu'],
      done: false,
    },
    { id: 'n5', kind: 'shrine', label: '瞽人·祭坛', done: false },
    {
      id: 'n6',
      kind: 'elite',
      label: '九尾·绯（精英）',
      enemyYaoIds: ['jiuweihu_elite'],
      done: false,
    },
    {
      id: 'n7',
      kind: 'battle',
      label: '夜狐·夜袭',
      enemyYaoIds: ['yehu', 'yehu'],
      done: false,
    },
    {
      id: 'n8',
      kind: 'boss',
      label: '绯·九尾真身',
      enemyYaoIds: ['jiuweihu_boss'],
      done: false,
    },
  ];
  return nodes;
}

// ============================================================================
// 新建 Run
// ============================================================================
export function createRun(seed: number): RunState {
  const rng = createRng(seed);
  const deck = buildStarterDeck();
  return {
    seed,
    hp: balance.player.maxHp,
    maxHp: balance.player.maxHp,
    currency: 0,
    deck,
    map: generateChapter1Map(rng),
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
      run.deck,
      rng,
      battleKindOfNode(node.kind),
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
export function resolveBattle(run: RunState, rng: RNG): void {
  const battle = run.battle;
  if (!battle) return;
  if (battle.phase !== 'won' && battle.phase !== 'lost') return;
  const outcome = battle.outcome;
  if (!outcome) return;

  // 同步玩家 HP（输：hp=0；赢：带当前 hp 出来）
  run.hp = battle.playerHp;
  run.stats.turnsPlayed += battle.turn;

  if (outcome.result === 'lose') {
    // 清战斗，由上层调用 gameOver 屏幕
    run.battle = null;
    return;
  }

  // 记录统计
  for (const e of battle.enemies) {
    if (e.sealed) run.stats.seals += 1;
    else run.stats.kills += 1;
  }

  // 加灵气
  run.currency += outcome.currencyGained;

  // 封妖：妖卡进牌组
  for (const yaoCard of outcome.sealedCards) {
    run.deck.push(yaoCard);
  }

  // 战后回血
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

  // Boss 战：永久 maxHp +5
  if (battle.kind === 'boss') {
    run.maxHp += balance.heal.bossMaxHpGain;
    run.hp += balance.heal.bossMaxHpGain; // 同步给当前 hp
  }

  // 生成 3 选 1 卡牌奖励（仅当至少一只被斩）
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
  advanceNode(run);
}

// ============================================================================
// 祭坛
// ============================================================================
export type ShrineAction =
  | { kind: 'remove'; cardIdx: number }
  | { kind: 'upgrade'; cardIdx: number }
  | { kind: 'rest' }
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
    case 'rest': {
      // 静修：免费 +10 HP
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
  advanceNode(run);
}

// ============================================================================
// 节点推进
// ============================================================================
export function advanceNode(run: RunState): void {
  const node = currentNode(run);
  if (node) node.done = true;
  run.nodeIndex += 1;
}

export function runFinished(run: RunState): 'victory' | 'defeated' | null {
  if (run.hp <= 0) return 'defeated';
  if (run.nodeIndex >= run.map.length) return 'victory';
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
