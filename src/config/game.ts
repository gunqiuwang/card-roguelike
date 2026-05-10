/**
 * 游戏规则常量 · v0.2
 *
 * 这里放"规则层"的常量——不会因为调数值而改变的东西。
 * 经常调的数字请放 balance.ts。
 */

import { balance } from './balance';

// ============================================================================
// 玩家 / 战斗基础规则（冻结 = 由 balance.player 镜像）
// ============================================================================
export const game = {
  handSizePerTurn: balance.player.handSizePerTurn,
  handSizeMax: 10,
  energyPerTurn: balance.player.energyPerTurn,
  deckSizeMax: balance.player.deckSizeMax,
  deckSizeStart: balance.player.deckSizeStart,
  maxHpStart: balance.player.maxHp,
  sealThresholdHpPercent: balance.seal.thresholdHpPercent,

  // v0.4 妖性阈值（预留）
  yaoxingCalm: 30,
  yaoxingRestless: 60,
  yaoxingFrenzy: 90,
  yaoxingMax: 100,
} as const;

// ============================================================================
// 章节元数据（对齐 LORE.md §二）
// ============================================================================
export const chapters = [
  { id: 'qingqiu', name: '青丘残岭', order: 1 },
  { id: 'taotie', name: '饕餮旧墟', order: 2 },
  { id: 'guixu', name: '归墟海涘', order: 3 },
  { id: 'kunlun', name: '昆仑神骸', order: 4 },
  { id: 'hundun', name: '混沌天垣', order: 5 },
] as const;

export type ChapterId = typeof chapters[number]['id'];

export function chapterName(id: string): string {
  return chapters.find((c) => c.id === id)?.name ?? id;
}

export function chapterOrder(id: string): number {
  return chapters.find((c) => c.id === id)?.order ?? 0;
}
