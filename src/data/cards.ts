import { Card } from '../types';

export type CardRarity = 'starter' | 'common' | 'rare';

export const STARTER_DECK: Card[] = [
  { id: 'strike-1', name: '打击', type: 'attack', cost: 1, description: '造成8点伤害', value: 8, rarity: 'starter' },
  { id: 'strike-2', name: '打击', type: 'attack', cost: 1, description: '造成8点伤害', value: 8, rarity: 'starter' },
  { id: 'strike-3', name: '打击', type: 'attack', cost: 1, description: '造成8点伤害', value: 8, rarity: 'starter' },
  { id: 'strike-4', name: '打击', type: 'attack', cost: 1, description: '造成8点伤害', value: 8, rarity: 'starter' },
  { id: 'defend-1', name: '格挡', type: 'defense', cost: 1, description: '获得5点格挡', value: 5, rarity: 'starter' },
  { id: 'defend-2', name: '格挡', type: 'defense', cost: 1, description: '获得5点格挡', value: 5, rarity: 'starter' },
  { id: 'defend-3', name: '格挡', type: 'defense', cost: 1, description: '获得5点格挡', value: 5, rarity: 'starter' },
  { id: 'defend-4', name: '格挡', type: 'defense', cost: 1, description: '获得5点格挡', value: 5, rarity: 'starter' },
];

export const REWARD_CARDS: Card[] = [
  // Heal cards
  { id: 'heal-1', name: '治疗', type: 'heal', cost: 2, description: '恢复5点生命', value: 5, rarity: 'common' },
  { id: 'heal-2', name: '强效治疗', type: 'heal', cost: 3, description: '恢复10点生命', value: 10, rarity: 'rare' },
  // Attack cards
  { id: 'fireball-1', name: '火球术', type: 'attack', cost: 2, description: '造成12点伤害', value: 12, rarity: 'common' },
  { id: 'fireball-2', name: '火球术', type: 'attack', cost: 2, description: '造成12点伤害', value: 12, rarity: 'common' },
  { id: 'heavy-strike', name: '重击', type: 'attack', cost: 2, description: '造成15点伤害', value: 15, rarity: 'rare' },
  { id: 'double-hit', name: '双重打击', type: 'attack', cost: 1, description: '造成4点伤害2次', value: 4, multiHit: 2, rarity: 'rare' },
  // Defense cards
  { id: 'defend-5', name: '格挡', type: 'defense', cost: 1, description: '获得5点格挡', value: 5, rarity: 'common' },
  { id: 'iron-wall', name: '铁壁', type: 'defense', cost: 2, description: '获得12点格挡', value: 12, rarity: 'rare' },
  { id: 'counter', name: '反击姿态', type: 'defense', cost: 1, description: '获得5点格挡，回合结束反击6点', value: 5, counterDamage: 6, rarity: 'rare' },
];

export const ALL_CARDS: Card[] = [
  ...STARTER_DECK,
  ...REWARD_CARDS,
];