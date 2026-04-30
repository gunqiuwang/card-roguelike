import { Card } from '../types';

export const STARTER_DECK: Card[] = [
  { id: 'strike-1', name: '打击', type: 'attack', cost: 1, description: '造成6点伤害', value: 6 },
  { id: 'strike-2', name: '打击', type: 'attack', cost: 1, description: '造成6点伤害', value: 6 },
  { id: 'strike-3', name: '打击', type: 'attack', cost: 1, description: '造成6点伤害', value: 6 },
  { id: 'strike-4', name: '打击', type: 'attack', cost: 1, description: '造成6点伤害', value: 6 },
  { id: 'defend-1', name: '格挡', type: 'defense', cost: 1, description: '获得5点格挡', value: 5 },
  { id: 'defend-2', name: '格挡', type: 'defense', cost: 1, description: '获得5点格挡', value: 5 },
  { id: 'defend-3', name: '格挡', type: 'defense', cost: 1, description: '获得5点格挡', value: 5 },
  { id: 'defend-4', name: '格挡', type: 'defense', cost: 1, description: '获得5点格挡', value: 5 },
];

export const REWARD_CARDS: Card[] = [
  { id: 'heal-1', name: '治疗', type: 'heal', cost: 2, description: '恢复5点生命', value: 5 },
  { id: 'fireball-1', name: '火球术', type: 'attack', cost: 2, description: '造成12点伤害', value: 12 },
  { id: 'strike-5', name: '打击', type: 'attack', cost: 1, description: '造成6点伤害', value: 6 },
  { id: 'defend-5', name: '格挡', type: 'defense', cost: 1, description: '获得5点格挡', value: 5 },
  { id: 'fireball-2', name: '火球术', type: 'attack', cost: 2, description: '造成12点伤害', value: 12 },
];