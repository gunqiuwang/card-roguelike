/**
 * 游戏规则常量 · 对应 docs/GAMEPLAY.md
 *
 * 这里放不经常改的"规则"常量。经常调的数值请放 balance.ts。
 */

export const game = {
  // 手牌
  handSizePerTurn: 5,
  handSizeMax: 10,

  // 能量
  energyPerTurn: 3,

  // 牌组
  deckSizeMax: 20,
  deckSizeStart: 10,

  // 封妖触发
  sealThresholdHpPercent: 0.3, // 敌人 HP ≤ 30% 可封

  // 妖性 (v0.4)
  yaoxingCalm: 30,
  yaoxingRestless: 60,
  yaoxingFrenzy: 90,
  yaoxingMax: 100,
} as const;

// 章节名（对应 LORE.md §二）
export const chapters = [
  { id: 'qingqiu', name: '青丘残岭', order: 1 },
  { id: 'taotie', name: '饕餮旧墟', order: 2 },
  { id: 'guixu', name: '归墟海涘', order: 3 },
  { id: 'kunlun', name: '昆仑神骸', order: 4 },
  { id: 'hundun', name: '混沌天垣', order: 5 },
] as const;

export type ChapterId = typeof chapters[number]['id'];
