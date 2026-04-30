import { Enemy, EnemyIntent } from '../types';

const INTENTS: EnemyIntent[] = ['attack', 'charge'];

function getRandomIntent(): EnemyIntent {
  return INTENTS[Math.floor(Math.random() * INTENTS.length)];
}

export function createEnemy(name: string, hp: number, attack: number): Enemy {
  return {
    id: `enemy-${Date.now()}`,
    name,
    hp,
    maxHp: hp,
    attack,
    intent: getRandomIntent(),
  };
}

export function getNextIntent(_enemy: Enemy): EnemyIntent {
  // Simple AI: 70% attack, 30% charge
  return Math.random() < 0.7 ? 'attack' : 'charge';
}

export const ENEMIES = [
  { name: '哥布林', hp: 30, attack: 6 },
  { name: '骷髅战士', hp: 40, attack: 8 },
  { name: '暗影', hp: 25, attack: 10 },
];