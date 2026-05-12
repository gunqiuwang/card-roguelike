/**
 * 卡牌库 · v0.2
 *
 * 对齐 docs/BALANCE.md §2 (起手 10 张) + §3 (12 张奖励池)。
 * 所有卡都是"模板"（Card）。战斗中通过 cardToInstance() 拷贝成 CardInstance（带 uid）。
 *
 * 如需新增卡：
 *   1. 在 BALANCE.md §3 登记
 *   2. 这里加一条（effects 数组）
 *   3. 若要生图 → docs/IMAGE_WORKLIST.md 登记
 */

import type { Card } from '../../types';

// ============================================================================
// 起手卡（4 种，合计 10 张）
// ============================================================================
export const CARD_FIRE_STRIKE: Card = {
  id: 'fu_fire_strike',
  name: '烈焰符',
  type: 'fu',
  rarity: 'starter',
  school: 'fushu',
  cost: 1,
  description: '造成 6 点伤害。',
  flavor: '——以朱砂书丹，以心念焚之。',
  effects: [{ kind: 'damage', amount: 6 }],
  silhouette: 'talisman',
};

export const CARD_SOUL_SEAL: Card = {
  id: 'fu_soul_seal',
  name: '镇魂符',
  type: 'fu',
  rarity: 'starter',
  school: 'fushu',
  cost: 1,
  description: '获得 5 气·御。',
  flavor: '——封魂于纸，封念于心。',
  effects: [{ kind: 'block', amount: 5 }],
  silhouette: 'talisman',
};

export const CARD_TAO_SWORD: Card = {
  id: 'zhan_tao_sword',
  name: '桃木斩',
  type: 'faqi',
  rarity: 'starter',
  school: 'zhanyao',
  cost: 2,
  description: '造成 8 点伤害。若敌 HP ≤ 30%，额外 4 点。',
  flavor: '——桃木避邪，非为杀，为镇。',
  effects: [
    { kind: 'damage', amount: 8 },
    { kind: 'execute', hpPercent: 0.3, bonusDamage: 4 },
  ],
  silhouette: 'relic',
};

export const CARD_DRAW: Card = {
  id: 'fu_draw',
  name: '抽符',
  type: 'fu',
  rarity: 'starter',
  school: 'fushu',
  cost: 1,
  description: '抽 2 张牌。',
  flavor: '——手中有符，心中有路。',
  effects: [{ kind: 'draw', count: 2 }],
  silhouette: 'talisman',
};

// ============================================================================
// 奖励池（DESIGN §9.3 / BALANCE §3）· 12 张
// ============================================================================

// ── 凡 · common ───────────────────────────────────────────────
export const CARD_BURN: Card = {
  id: 'fu_burn',
  name: '灼焰箓',
  type: 'fu',
  rarity: 'common',
  school: 'fushu',
  cost: 2,
  description: '造成 12 点伤害。',
  flavor: '——火在纸上，也在心上。',
  effects: [{ kind: 'damage', amount: 12 }],
  silhouette: 'talisman',
};

export const CARD_TRIPLE_SHIELD: Card = {
  id: 'fu_triple_shield',
  name: '三才御符',
  type: 'fu',
  rarity: 'common',
  school: 'yuling',
  cost: 1,
  description: '获得 8 气·御。',
  flavor: '——天地人三才，共御万邪。',
  effects: [{ kind: 'block', amount: 8 }],
  silhouette: 'talisman',
};

// ── 珍 · rare ─────────────────────────────────────────────────
export const CARD_CHAIN: Card = {
  id: 'fu_chain',
  name: '连环符',
  type: 'fu',
  rarity: 'rare',
  school: 'fushu',
  cost: 0,
  description: '造成 3 点伤害，两次。',
  flavor: '——一符牵一符，一念牵一念。',
  effects: [
    { kind: 'damage', amount: 3 },
    { kind: 'damage', amount: 3 },
  ],
  silhouette: 'talisman',
};

export const CARD_PEARL: Card = {
  id: 'faqi_pearl',
  name: '聚灵珠',
  type: 'faqi',
  rarity: 'rare',
  school: 'yuling',
  cost: 1,
  description: '获得 2 点气。',
  flavor: '——玉珠含灵，一吐三分。',
  effects: [{ kind: 'gainEnergy', amount: 2 }],
  silhouette: 'relic',
};

export const CARD_POISON: Card = {
  id: 'fu_soul_eat',
  name: '噬魂咒',
  type: 'fu',
  rarity: 'rare',
  school: 'fushu',
  cost: 1,
  description: '使敌中毒 3 层。',
  flavor: '——咒在肉里，毒在骨里。',
  effects: [{ kind: 'applyStatus', status: 'poison', stack: 3, target: 'enemy' }],
  silhouette: 'talisman',
};

export const CARD_EXORCISE: Card = {
  id: 'fu_exorcise',
  name: '驱邪符',
  type: 'fu',
  rarity: 'rare',
  school: 'fushu',
  cost: 1,
  description: '清除敌人气·御；造成 8 点伤害。',
  flavor: '——邪气散去，真身自现。',
  effects: [
    { kind: 'discardEnemyBlock' },
    { kind: 'damage', amount: 8 },
  ],
  silhouette: 'talisman',
};

// ── 灵 · epic ─────────────────────────────────────────────────
export const CARD_SKY_SEAL: Card = {
  id: 'fu_seal_sky',
  name: '镌天符',
  type: 'fu',
  rarity: 'epic',
  school: 'fushu',
  cost: 2,
  description: '造成 14 点伤害，使敌易伤 2 层。',
  flavor: '——镌字于天，万象皆伤。',
  effects: [
    { kind: 'damage', amount: 14 },
    { kind: 'applyStatus', status: 'vulnerable', stack: 2, target: 'enemy' },
  ],
  silhouette: 'talisman',
};

export const CARD_AXE: Card = {
  id: 'faqi_axe',
  name: '斩妖钺',
  type: 'faqi',
  rarity: 'epic',
  school: 'zhanyao',
  cost: 3,
  description: '造成 20 点伤害。',
  flavor: '——钺者，巨斧也。一斧定天地。',
  effects: [{ kind: 'damage', amount: 20 }],
  silhouette: 'relic',
};

// ── 玄 · legend ───────────────────────────────────────────────
export const CARD_HEAVEN_FIRE: Card = {
  id: 'fu_heaven_fire',
  name: '焚天箓',
  type: 'fu',
  rarity: 'legend',
  school: 'fushu',
  cost: 3,
  description: '造成 18 点伤害，使敌易伤 1 层，再抽 1 张。',
  flavor: '——一焚天，二焚地，三焚此身。',
  effects: [
    { kind: 'damage', amount: 18 },
    { kind: 'applyStatus', status: 'vulnerable', stack: 1, target: 'enemy' },
    { kind: 'draw', count: 1 },
  ],
  silhouette: 'talisman',
};

export const CARD_TAIJI_MIRROR: Card = {
  id: 'faqi_taiji',
  name: '太极镜',
  type: 'faqi',
  rarity: 'legend',
  school: 'yuling',
  cost: 2,
  description: '获得 10 气·御，再抽 2 张，获得 1 点气。',
  flavor: '——阴阳不二，镜中无我。',
  effects: [
    { kind: 'block', amount: 10 },
    { kind: 'draw', count: 2 },
    { kind: 'gainEnergy', amount: 1 },
  ],
  silhouette: 'relic',
};

/** v0.5 太极归一 · 终极技能（阴阳平衡归零时可用） */
export const CARD_TAIJI_ULTIMATE: Card = {
  id: 'ult_taiji',
  name: '太极归一',
  type: 'yao',
  rarity: 'legend',
  school: 'neutral',
  cost: 0,
  description: '消耗所有阴阳积蓄。对全体敌人造成 30 点伤害，回复 10 气血，清空所有积蓄。',
  flavor: '——阴阳合一，万化定基。',
  effects: [
    { kind: 'damage', amount: 30 },
    { kind: 'heal', amount: 10 },
  ],
  exhaust: true,
  silhouette: 'talisman',
};

// ============================================================================
// 导出集合
// ============================================================================
export const STARTER_CARDS: readonly Card[] = [
  CARD_FIRE_STRIKE,
  CARD_SOUL_SEAL,
  CARD_TAO_SWORD,
  CARD_DRAW,
];

export const COMMON_CARDS: readonly Card[] = [CARD_BURN, CARD_TRIPLE_SHIELD];

export const RARE_CARDS: readonly Card[] = [
  CARD_CHAIN,
  CARD_PEARL,
  CARD_POISON,
  CARD_EXORCISE,
];

export const EPIC_CARDS: readonly Card[] = [CARD_SKY_SEAL, CARD_AXE];

export const LEGEND_CARDS: readonly Card[] = [CARD_HEAVEN_FIRE, CARD_TAIJI_MIRROR];

export const ALL_REWARD_CARDS: readonly Card[] = [
  ...COMMON_CARDS,
  ...RARE_CARDS,
  ...EPIC_CARDS,
  ...LEGEND_CARDS,
];

export const ALL_CARDS: readonly Card[] = [
  ...STARTER_CARDS,
  ...ALL_REWARD_CARDS,
];

/** 起手固定牌组（10 张）· DESIGN §2.4 */
export function buildStarterDeck(): Card[] {
  const deck: Card[] = [];
  for (let i = 0; i < 4; i++) deck.push(CARD_FIRE_STRIKE);
  for (let i = 0; i < 4; i++) deck.push(CARD_SOUL_SEAL);
  deck.push(CARD_TAO_SWORD);
  deck.push(CARD_DRAW);
  return deck;
}

/** Styleguide 旧的示例卡（保留命名以不破坏旧调用） */
export const sampleCards: readonly Card[] = [
  CARD_FIRE_STRIKE,
  CARD_SOUL_SEAL,
  CARD_TAO_SWORD,
  CARD_SKY_SEAL,
];
