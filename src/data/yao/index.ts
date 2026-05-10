/**
 * 妖怪库 · v0.2 第一章「青丘残岭」
 *
 * 对齐 docs/BALANCE.md §4。
 * 每只妖：敌人数据 + 封后卡（从能力派生，保留故事感）。
 *
 * 关键：意图脚本是**固定循环**，玩家可预测。v0.3+ 再加反应式 AI。
 */

import type { Yao } from '../../types';

// ============================================================================
// 青狐小妖（C · 普通）
// ============================================================================
export const YAO_QINGHU: Yao = {
  id: 'qinghu',
  name: '青狐小妖',
  rank: 'C',
  chapter: 'qingqiu',
  hp: 42,
  intents: [
    { kind: 'attack', damage: 7, label: '⚔ 7' },
    { kind: 'attack', damage: 5, label: '⚔ 5' },
    { kind: 'defend', block: 5, label: '🛡 5' },
  ],
  sealPattern: ['dot', 'horizontal', 'dot'],
  sealedCard: {
    name: '狐媚',
    type: 'yao',
    rarity: 'common',
    school: 'yuling',
    cost: 1,
    description: '抽 1 张牌，使敌中毒 1 层。',
    flavor: '——三只眼里，最亮那只是饿的。',
    effects: [
      { kind: 'draw', count: 1 },
      { kind: 'applyStatus', status: 'poison', stack: 1, target: 'enemy' },
    ],
    silhouette: 'fox',
  },
  flavor: '她三只眼，最亮的那只，是饿的。',
  silhouette: 'fox',
  rewardCurrency: [10, 15],
};

// ============================================================================
// 夜狐（C · 普通）
// ============================================================================
export const YAO_YEHU: Yao = {
  id: 'yehu',
  name: '夜狐',
  rank: 'C',
  chapter: 'qingqiu',
  hp: 48,
  intents: [
    { kind: 'attack', damage: 6, label: '⚔ 6' },
    { kind: 'attack', damage: 6, label: '⚔ 6' },
    { kind: 'cast', status: { kind: 'weak', stack: 1 }, label: '✨ 虚弱 1' },
  ],
  sealPattern: ['vertical', 'dot', 'slash'],
  sealedCard: {
    name: '夜袭',
    type: 'yao',
    rarity: 'common',
    school: 'zhanyao',
    cost: 1,
    description: '造成 5 点伤害，使敌易伤 1 层。',
    flavor: '——夜里不要回头。它跟着你的影子吃。',
    effects: [
      { kind: 'damage', amount: 5 },
      { kind: 'applyStatus', status: 'vulnerable', stack: 1, target: 'enemy' },
    ],
    silhouette: 'fox',
  },
  flavor: '夜里不要回头。它跟着你的影子吃。',
  silhouette: 'fox',
  rewardCurrency: [12, 18],
};

// ============================================================================
// 九尾狐·绯（B · 精英）
// ============================================================================
export const YAO_JIUWEI_ELITE: Yao = {
  id: 'jiuweihu_elite',
  name: '九尾狐·绯',
  rank: 'B',
  chapter: 'qingqiu',
  hp: 88,
  intents: [
    { kind: 'attack', damage: 9, label: '⚔ 9' },
    { kind: 'defend', block: 7, label: '🛡 7' },
    { kind: 'charge', label: '🌀 蓄力中' },
    { kind: 'charge', label: '🌀🌀 蓄力更强' },
    { kind: 'attack', damage: 16, label: '⚔ 16 (释)' },
  ],
  sealPattern: ['loop', 'dot', 'horizontal', 'slash', 'hook'],
  chargeClimaxIndex: 4,
  interruptHpPercent: 0.5,
  sealedCard: {
    name: '九尾幻术',
    type: 'yao',
    rarity: 'rare',
    school: 'yuling',
    cost: 1,
    description: '使敌下回合意图空过。',
    flavor: '——她说：你看见的从来不是我。',
    effects: [{ kind: 'sealIntent', turns: 1 }],
    artSrc: '/images/yao/S_jiuweihu.webp',
    silhouette: 'fox',
  },
  flavor: '她说：你看见的从来不是我。',
  silhouette: 'fox',
  rewardCurrency: [30, 40],
};

// ============================================================================
// 绯·九尾真身（S · Boss）
// ============================================================================
export const YAO_JIUWEI_BOSS: Yao = {
  id: 'jiuweihu_boss',
  name: '绯·九尾真身',
  rank: 'S',
  chapter: 'qingqiu',
  hp: 140,
  intents: [
    { kind: 'attack', damage: 11, label: '⚔ 11' },
    { kind: 'defend', block: 9, label: '🛡 9' },
    { kind: 'charge', label: '🌀 蓄力' },
    { kind: 'charge', label: '🌀🌀 蓄力更强' },
    { kind: 'attack', damage: 20, status: { kind: 'weak', stack: 2 }, label: '⚔ 20 + 虚 2' },
  ],
  sealPattern: ['loop', 'dot', 'horizontal', 'vertical', 'slash', 'hook', 'dot'],
  chargeClimaxIndex: 4,
  interruptHpPercent: 0.4,
  sealedCard: {
    name: '幻狐之瞳',
    type: 'yao',
    rarity: 'epic',
    school: 'yuling',
    cost: 2,
    description: '造成 12 点伤害，抽 1 张牌。',
    flavor: '——我活了很久。你封了我，我便住你身里。',
    effects: [
      { kind: 'damage', amount: 12 },
      { kind: 'draw', count: 1 },
    ],
    artSrc: '/images/yao/S_jiuweihu.webp',
    silhouette: 'fox',
  },
  flavor: '我活了很久了。你封了我，我就住在你身体里。',
  silhouette: 'fox',
  rewardCurrency: [55, 65],
};

// ============================================================================
// 鸮首（C · 普通 · 鸟类，替代一只狐）
// ============================================================================
export const YAO_XIAOSHOU: Yao = {
  id: 'xiaoshou',
  name: '鸮首',
  rank: 'C',
  chapter: 'qingqiu',
  hp: 36,
  intents: [
    { kind: 'attack', damage: 4, label: '⚔ 4' },
    { kind: 'cast', status: { kind: 'vulnerable', stack: 1 }, label: '✨ 易伤 1' },
    { kind: 'attack', damage: 8, label: '⚔ 8' },
  ],
  sealPattern: ['horizontal', 'slash', 'dot'],
  sealedCard: {
    name: '鸮啼',
    type: 'yao',
    rarity: 'common',
    school: 'zhanyao',
    cost: 1,
    description: '造成 4 点伤害，使敌易伤 1 层。',
    flavor: '——夜半一声啼，山半都醒了。',
    effects: [
      { kind: 'damage', amount: 4 },
      { kind: 'applyStatus', status: 'vulnerable', stack: 1, target: 'enemy' },
    ],
    silhouette: 'bird',
  },
  flavor: '鸟形人面，闻其啼者，病。',
  silhouette: 'bird',
  rewardCurrency: [10, 14],
};

// ============================================================================
// 草头蛇（C · 普通 · 蛇类，中毒流）
// ============================================================================
export const YAO_CAOTOU_SHE: Yao = {
  id: 'caotou_she',
  name: '草头蛇',
  rank: 'C',
  chapter: 'qingqiu',
  hp: 40,
  intents: [
    { kind: 'cast', status: { kind: 'poison', stack: 2 }, label: '🩸 毒 2' },
    { kind: 'attack', damage: 4, label: '⚔ 4' },
    { kind: 'defend', block: 4, label: '🛡 4' },
  ],
  sealPattern: ['vertical', 'hook', 'dot'],
  sealedCard: {
    name: '蛇毒',
    type: 'yao',
    rarity: 'common',
    school: 'fushu',
    cost: 1,
    description: '使敌中毒 2 层。',
    flavor: '——草中藏牙，一口即亡。',
    effects: [{ kind: 'applyStatus', status: 'poison', stack: 2, target: 'enemy' }],
    silhouette: 'serpent',
  },
  flavor: '青草中三点白。那是牙。',
  silhouette: 'serpent',
  rewardCurrency: [10, 15],
};

// ============================================================================
// 导出集合 + 查询
// ============================================================================
export const ALL_YAO: readonly Yao[] = [
  YAO_QINGHU,
  YAO_YEHU,
  YAO_XIAOSHOU,
  YAO_CAOTOU_SHE,
  YAO_JIUWEI_ELITE,
  YAO_JIUWEI_BOSS,
];

const yaoIndex: Record<string, Yao> = Object.fromEntries(
  ALL_YAO.map((y) => [y.id, y]),
);

export function getYao(id: string): Yao {
  const y = yaoIndex[id];
  if (!y) throw new Error(`Unknown yao id: ${id}`);
  return y;
}

/** 按章节 + 等级筛选（仿真 / 地图生成用） */
export function yaoOfRank(rank: Yao['rank'], chapter = 'qingqiu'): readonly Yao[] {
  return ALL_YAO.filter((y) => y.rank === rank && y.chapter === chapter);
}
