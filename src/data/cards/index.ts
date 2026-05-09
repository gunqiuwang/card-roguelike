/**
 * 卡牌数据 · v0.1 示例卡
 *
 * 每张卡一个对象。v0.2 开始每张卡单文件（data/cards/fu_xxx.ts）。
 * 新增卡时：
 *  1. 先在 docs/GAMEPLAY.md 或 LORE.md 注册（如果有特殊机制）
 *  2. 在这里加条目
 *  3. 如果要生图，在 docs/IMAGE_WORKLIST.md 增加条目
 */

import type { Card } from '../../types';

export const sampleCards: Card[] = [
  {
    id: 'fu_fire_strike',
    name: '烈焰符',
    type: 'fu',
    rarity: 'starter',
    school: 'fushu',
    cost: 1,
    description: '符火出鞘，造成 6 点伤害。',
    flavor: '——以朱砂书丹，以心念焚之。',
    artSrc: '/images/fu/fu_fire_strike.webp',
    silhouette: 'talisman',
  },
  {
    id: 'fu_soul_seal',
    name: '镇魂符',
    type: 'fu',
    rarity: 'starter',
    school: 'fushu',
    cost: 1,
    description: '获得 5 点气·御。抽 1 张牌。',
    flavor: '——封魂于纸，封念于心。',
    artSrc: '/images/fu/fu_soul_seal.webp',
    silhouette: 'talisman',
  },
  {
    id: 'zhan_tao_sword',
    name: '桃木斩',
    type: 'faqi',
    rarity: 'common',
    school: 'zhanyao',
    cost: 2,
    description: '一斩 8 点。若敌人 HP ≤ 30%，额外 4 点。',
    flavor: '——桃木避邪，非为杀，为镇。',
    silhouette: 'relic',
  },
  {
    id: 'yao_jiuwei_illusion',
    name: '九尾幻术',
    type: 'yao',
    rarity: 'rare',
    school: 'yuling',
    cost: 1,
    description: '敌人下回合意图变为【空过】。妖性 +5。',
    flavor: '——她说：你看见的从来不是我。',
    artSrc: '/images/yao/S_jiuweihu.webp',
    silhouette: 'fox',
  },
];
