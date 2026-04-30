import { Card, CardRarity } from '../types';

// 流派定义
export type School = '斩妖' | '御灵' | '符术';

// 斩妖派：近战斩击，高伤害
// 御灵派：召唤御灵，防守反击
// 符术派：符咒治病，灵活多变

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

// 符术派卡牌 - 治疗，辅助
export const FUSHU_CARDS: Card[] = [
  {
    id: 'zhiyu',
    name: '治愈符',
    type: 'heal',
    cost: 2,
    description: '符纸化药，治疗6点生命',
    value: 6,
    rarity: 'common',
    school: '符术',
  },
  {
    id: 'qiangzhi-yu',
    name: '强治愈符',
    type: 'heal',
    cost: 3,
    description: '灵力催动，治疗12点生命',
    value: 12,
    rarity: 'rare',
    school: '符术',
  },
  {
    id: 'huanyuan-fu',
    name: '还原符',
    type: 'heal',
    cost: 2,
    description: '回复生命值，并额外治疗5点',
    value: 5,
    rarity: 'common',
    school: '符术',
  },
  {
    id: 'tupo-fu',
    name: '突破符',
    type: 'heal',
    cost: 1,
    description: '激发潜能，治疗4点并抽1张牌',
    value: 4,
    rarity: 'common',
    school: '符术',
    drawCards: 1,
  },
  {
    id: 'jieshu-fu',
    name: '结界符',
    type: 'defense',
    cost: 2,
    description: '布下结界，所有伤害-3',
    value: 8,
    rarity: 'rare',
    school: '符术',
    damageReduction: 3,
  },
  {
    id: 'poisonshui',
    name: '毒水符',
    type: 'attack',
    cost: 2,
    description: '毒符蚀骨，造成10点伤害并使敌人下回合伤害-3',
    value: 10,
    rarity: 'common',
    school: '符术',
    debuffDamage: 3,
  },
];

// 奖励卡池 - 三派混合
export const REWARD_CARDS: Card[] = [
  // 斩妖派
  ...ZHANYAO_CARDS,
  // 御灵派
  ...YULING_CARDS,
  // 符术派
  ...FUSHU_CARDS,
];

export const ALL_CARDS: Card[] = [
  ...STARTER_DECK,
  ...REWARD_CARDS,
];

// 获取某流派的卡牌
export const getCardsBySchool = (school: School): Card[] => {
  return ALL_CARDS.filter(card => card.school === school);
};

// 获取某稀有度的卡牌
export const getCardsByRarity = (rarity: CardRarity): Card[] => {
  return ALL_CARDS.filter(card => card.rarity === rarity);
};