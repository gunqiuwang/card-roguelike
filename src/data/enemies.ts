import { Enemy, EnemyIntent } from '../types';

export type EnemyType = 'normal' | 'elite' | 'boss';

const INTENTS: EnemyIntent[] = ['attack', 'charge'];

function getRandomIntent(): EnemyIntent {
  return INTENTS[Math.floor(Math.random() * INTENTS.length)];
}

export function createEnemy(
  name: string,
  hp: number,
  attack: number,
  type: EnemyType = 'normal'
): Enemy {
  return {
    id: `enemy-${Date.now()}-${Math.random()}`,
    name,
    hp,
    maxHp: hp,
    attack,
    intent: getRandomIntent(),
    type,
  };
}

export function getNextIntent(_enemy: Enemy): EnemyIntent {
  // Simple AI: 70% attack, 30% charge
  return Math.random() < 0.7 ? 'attack' : 'charge';
}

export interface EnemyData {
  name: string;
  hp: number;
  attack: number;
  type: EnemyType;
  description: string;
}

export const ENEMIES: EnemyData[] = [
  // Normal enemies
  { name: '哥布林', hp: 30, attack: 6, type: 'normal', description: '普通敌人' },
  { name: '骷髅战士', hp: 40, attack: 8, type: 'normal', description: '高防敌人' },
  { name: '暗影', hp: 25, attack: 10, type: 'normal', description: '高攻脆皮' },
  { name: '狼人', hp: 35, attack: 7, type: 'normal', description: '平衡型' },
  // Elite enemies
  { name: '精英骷髅', hp: 60, attack: 10, type: 'elite', description: '精英敌人' },
  { name: '暗影刺客', hp: 45, attack: 14, type: 'elite', description: '高攻精英' },
  // Boss
  { name: '巨石魔像', hp: 100, attack: 12, type: 'boss', description: 'BOSS' },
];

export const getRandomEnemyByDifficulty = (difficulty: number = 1): Enemy => {
  // Higher difficulty = more likely to get elite/boss enemies
  let pool = ENEMIES.filter(e => e.type === 'normal');

  if (difficulty >= 2) {
    pool = [...pool, ...ENEMIES.filter(e => e.type === 'elite')];
  }
  if (difficulty >= 3) {
    pool = [...pool, ...ENEMIES.filter(e => e.type === 'boss')];
  }

  const enemyData = pool[Math.floor(Math.random() * pool.length)];
  return createEnemy(enemyData.name, enemyData.hp, enemyData.attack, enemyData.type);
};