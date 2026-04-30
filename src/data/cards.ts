import { Card, CardRarity } from '../types';

export type School = '斩妖' | '御灵' | '符术';

export const STARTER_DECK: Card[] = [
  // 初始斩符 x4
  {
    id: 'zhanshu-1',
    name: '斩符',
    type: 'attack',
    cost: 1,
    description: '以符纸化剑，造成8点伤害',
    value: 8,
    rarity: 'starter',
    school: '斩妖',
  },
  {
    id: 'zhanshu-2',
    name: '斩符',
    type: 'attack',
    cost: 1,
    description: '以符纸化剑，造成8点伤害',
    value: 8,
    rarity: 'starter',
    school: '斩妖',
  },
  {
    id: 'zhanshu-3',
    name: '斩符',
    type: 'attack',
    cost: 1,
    description: '以符纸化剑，造成8点伤害',
    value: 8,
    rarity: 'starter',
    school: '斩妖',
  },
  {
    id: 'zhanshu-4',
    name: '斩符',
    type: 'attack',
    cost: 1,
    description: '以符纸化剑，造成8点伤害',
    value: 8,
    rarity: 'starter',
    school: '斩妖',
  },
  // 初始护符 x4
  {
    id: 'hufu-1',
    name: '护符',
    type: 'defense',
    cost: 1,
    description: '灵力护体，获得5点护盾',
    value: 5,
    rarity: 'starter',
    school: '御灵',
  },
  {
    id: 'hufu-2',
    name: '护符',
    type: 'defense',
    cost: 1,
    description: '灵力护体，获得5点护盾',
    value: 5,
    rarity: 'starter',
    school: '御灵',
  },
  {
    id: 'hufu-3',
    name: '护符',
    type: 'defense',
    cost: 1,
    description: '灵力护体，获得5点护盾',
    value: 5,
    rarity: 'starter',
    school: '御灵',
  },
  {
    id: 'hufu-4',
    name: '护符',
    type: 'defense',
    cost: 1,
    description: '灵力护体，获得5点护盾',
    value: 5,
    rarity: 'starter',
    school: '御灵',
  },
];

// 斩妖派卡牌 - 高攻击，低消耗
// 核心机制: 斩击狂热 - 连续出斩妖攻击牌，伤害递增
export const ZHANYAO_CARDS: Card[] = [
  {
    id: 'juemen-zhang',
    name: '绝焰斩',
    type: 'attack',
    cost: 2,
    description: '符火凝聚，斩出烈焰，造成12点伤害',
    value: 12,
    rarity: 'common',
    school: '斩妖',
    comboBonus: true, // 斩击狂热加成
  },
  {
    id: 'lei-zhang',
    name: '雷亟斩',
    type: 'attack',
    cost: 2,
    description: '引雷入符，斩击带有雷罚，造成12点伤害',
    value: 12,
    rarity: 'common',
    school: '斩妖',
    comboBonus: true,
  },
  {
    id: 'po-tian-zhang',
    name: '破天斩',
    type: 'attack',
    cost: 3,
    description: '倾尽全力的一击，造成18点伤害',
    value: 18,
    rarity: 'rare',
    school: '斩妖',
    comboBonus: true,
  },
  {
    id: 'shuangjian',
    name: '双剑符',
    type: 'attack',
    cost: 1,
    description: '双符齐出，斩击两次，各造成6点伤害',
    value: 6,
    rarity: 'rare',
    school: '斩妖',
    multiHit: 2,
    comboBonus: true,
  },
  {
    id: 'xulian-zhang',
    name: '虚灵斩',
    type: 'attack',
    cost: 1,
    description: '斩击虚体，造成10点伤害，忽略护盾',
    value: 10,
    rarity: 'common',
    school: '斩妖',
    ignoreBlock: true,
    comboBonus: true,
  },
];

// 御灵派卡牌 - 防守反击，召唤
export const YULING_CARDS: Card[] = [
  {
    id: 'ling-hu',
    name: '灵护',
    type: 'defense',
    cost: 2,
    description: '御灵护体，获得10点护盾',
    value: 10,
    rarity: 'common',
    school: '御灵',
  },
  {
    id: 'tie-hufu',
    name: '铁壁符',
    type: 'defense',
    cost: 2,
    description: '御灵化作铁壁，获得12点护盾',
    value: 12,
    rarity: 'rare',
    school: '御灵',
  },
  {
    id: 'fanji-zhen',
    name: '反击阵',
    type: 'defense',
    cost: 1,
    description: '布下反击阵，获得5点护盾，下回合反击8点',
    value: 5,
    rarity: 'rare',
    school: '御灵',
    counterDamage: 8,
  },
  {
    id: 'yuling-sheng',
    name: '御灵升',
    type: 'defense',
    cost: 3,
    description: '召唤御灵，获得15点护盾并治疗8点',
    value: 15,
    rarity: 'rare',
    school: '御灵',
    healValue: 8,
  },
  {
    id: 'jinshen',
    name: '金身符',
    type: 'defense',
    cost: 2,
    description: '御灵附身，获得8点护盾，受伤时反弹4点',
    value: 8,
    rarity: 'common',
    school: '御灵',
    reflectDamage: 4,
  },
  {
    id: 'tunshi',
    name: '吞噬符',
    type: 'defense',
    cost: 2,
    description: '御灵吞噬攻击，获得10点护盾并将一半转化为治疗',
    value: 10,
    rarity: 'rare',
    school: '御灵',
    lifesteal: 0.5,
  },
];

// 符术派卡牌 - 抽牌连击流
// 核心机制: 抽牌、回灵气、降低费用、连锁出牌
export const FUSHU_CARDS: Card[] = [
  // 抽牌引擎
  {
    id: 'ling-yin',
    name: '灵引',
    type: 'skill',
    cost: 0,
    description: '引导灵气，抽1张牌',
    value: 0,
    rarity: 'common',
    school: '符术',
    drawCards: 1,
  },
  {
    id: 'shuang-yin',
    name: '双引',
    type: 'skill',
    cost: 1,
    description: '双重引导，抽2张牌',
    value: 0,
    rarity: 'common',
    school: '符术',
    drawCards: 2,
  },
  // 回灵气
  {
    id: 'gui-yuan',
    name: '归元',
    type: 'skill',
    cost: 0,
    description: '回归元点，获得1点灵气',
    value: 0,
    rarity: 'common',
    school: '符术',
    gainEnergy: 1,
  },
  // 降费连击
  {
    id: 'lian-fu',
    name: '连符',
    type: 'skill',
    cost: 1,
    description: '符箓连锁，本回合下一张牌费用-1',
    value: 0,
    rarity: 'common',
    school: '符术',
    reduceCost: 1,
  },
  // 攻击+抽牌
  {
    id: 'yin-lei-fu',
    name: '引雷符',
    type: 'attack',
    cost: 1,
    description: '引雷入符，造成5点伤害并抽1张牌',
    value: 5,
    rarity: 'common',
    school: '符术',
    drawCards: 1,
  },
  // 终极连锁
  {
    id: 'wu-jin-fu',
    name: '无尽符',
    type: 'skill',
    cost: 3,
    description: '符无穷，本回合每出一张牌，抽1张',
    value: 0,
    rarity: 'rare',
    school: '符术',
    chainDraw: 1,
  },
  // 保留少量治疗 (2张)
  {
    id: 'zhi-yu',
    name: '治愈符',
    type: 'heal',
    cost: 2,
    description: '符纸化药，治疗6点生命',
    value: 6,
    rarity: 'common',
    school: '符术',
  },
  {
    id: 'qiàng-zhi-yu',
    name: '强愈符',
    type: 'heal',
    cost: 3,
    description: '灵力催动，治疗12点生命',
    value: 12,
    rarity: 'rare',
    school: '符术',
  },
];

// 奖励卡池 - 三派混合
export const REWARD_CARDS: Card[] = [
  ...ZHANYAO_CARDS,
  ...YULING_CARDS,
  ...FUSHU_CARDS,
];

export const ALL_CARDS: Card[] = [
  ...STARTER_DECK,
  ...REWARD_CARDS,
];

export const getCardsBySchool = (school: School): Card[] => {
  return ALL_CARDS.filter(card => card.school === school);
};

export const getCardsByRarity = (rarity: CardRarity): Card[] => {
  return ALL_CARDS.filter(card => card.rarity === rarity);
};