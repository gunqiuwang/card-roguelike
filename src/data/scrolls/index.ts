/**
 * 秘卷库 · v0.2.1
 *
 * 被动 buff，祭坛购买，跨战斗永久生效。
 * 对应 docs/DESIGN_v0.2.md §11（v0.3 预留，v0.2.1 提前实装）。
 */

import type { Scroll } from '../../types';

export const SCROLL_CONCENTRATION: Scroll = {
  id: 'scroll_concentration',
  name: '聚灵卷',
  description: '每回合 +1 气（能量 +1）。',
  flavor: '——气聚则符成，符成则妖退。',
  effect: 'extraEnergy',
  magnitude: 1,
  cost: 60,
};

export const SCROLL_INSIGHT: Scroll = {
  id: 'scroll_insight',
  name: '明目卷',
  description: '每回合多抽 1 张。',
  flavor: '——睁一只眼看命，睁两只眼看劫。',
  effect: 'extraDraw',
  magnitude: 1,
  cost: 50,
};

export const SCROLL_SHIELD: Scroll = {
  id: 'scroll_shield',
  name: '铜皮卷',
  description: '每场战斗起手 +6 气·御。',
  flavor: '——皮不及铁，念及铁。',
  effect: 'startBlock',
  magnitude: 6,
  cost: 40,
};

export const SCROLL_DESPERATE: Scroll = {
  id: 'scroll_desperate',
  name: '奋血卷',
  description: '气血 ≤ 30% 时，伤害 +30%。',
  flavor: '——我命未尽，剑未停。',
  effect: 'lowHpDamage',
  cost: 50,
};

export const SCROLL_CALM: Scroll = {
  id: 'scroll_calm',
  name: '定神卷',
  description: '妖卡打出时妖性增长减半。',
  flavor: '——心定了，妖也就定了。',
  effect: 'yaoxingResist',
  cost: 60,
};

export const SCROLL_FIRSTSTRIKE: Scroll = {
  id: 'scroll_firststrike',
  name: '先手卷',
  description: '每场战斗第一张伤害卡 +50% 伤害。',
  flavor: '——先下手者，不为强，为活。',
  effect: 'firstHitBonus',
  cost: 45,
};

export const ALL_SCROLLS: readonly Scroll[] = [
  SCROLL_CONCENTRATION,
  SCROLL_INSIGHT,
  SCROLL_SHIELD,
  SCROLL_DESPERATE,
  SCROLL_CALM,
  SCROLL_FIRSTSTRIKE,
];

export function getScroll(id: string): Scroll | null {
  return ALL_SCROLLS.find((s) => s.id === id) ?? null;
}

/**
 * 祭坛根据当前已持有的秘卷，随机返回 2 张可购买的（不重复）。
 */
export function rollShrineScrolls(
  owned: string[],
  rng: { int: (lo: number, hi: number) => number },
): Scroll[] {
  const available = ALL_SCROLLS.filter((s) => !owned.includes(s.id));
  if (available.length === 0) return [];
  const shuffled = [...available];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(2, shuffled.length));
}
