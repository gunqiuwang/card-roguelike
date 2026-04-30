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
  const baseEnemy = {
    id: `enemy-${Date.now()}-${Math.random()}`,
    name,
    hp,
    maxHp: hp,
    attack,
    intent: getRandomIntent(),
    type,
  };

  // Boss enemies have charging mechanism
  if (type === 'boss') {
    return {
      ...baseEnemy,
      isCharging: false,
      chargeTurnsLeft: 2, // First charge after 2 turns
      willUseUltimate: false,
    };
  }

  return baseEnemy;
}

export function getNextIntent(enemy: Enemy): EnemyIntent {
  // Boss has special charge cycle
  if (enemy.type === 'boss') {
    if (enemy.isCharging) {
      return 'attack'; // After charging, attack
    }
    if (enemy.chargeTurnsLeft !== undefined && enemy.chargeTurnsLeft <= 0) {
      return 'charge'; // Time to charge
    }
  }
  // Simple AI: 70% attack, 30% charge
  return Math.random() < 0.7 ? 'attack' : 'charge';
}

// Boss 每3回合进行一次蓄力循环
export function updateBossCharge(enemy: Enemy): Enemy {
  if (enemy.type !== 'boss') return enemy;

  const newEnemy = { ...enemy };

  // 如果正在蓄力，下一回合释放大招
  if (newEnemy.isCharging) {
    newEnemy.isCharging = false;
    newEnemy.willUseUltimate = true;
    newEnemy.chargeTurnsLeft = 3; // 重置计数
    return newEnemy;
  }

  // 如果蓄力计数已到，进入蓄力
  if (newEnemy.chargeTurnsLeft !== undefined) {
    newEnemy.chargeTurnsLeft -= 1;
    if (newEnemy.chargeTurnsLeft <= 0) {
      newEnemy.isCharging = true;
      newEnemy.intent = 'charge';
    }
  }

  return newEnemy;
}

// 计算Boss大招伤害
export function getBossUltimateDamage(baseAttack: number): number {
  return baseAttack * 2; // 大招伤害翻倍
}

export interface EnemyData {
  name: string;
  hp: number;
  attack: number;
  type: EnemyType;
  description: string;
  sprite: string; // Emoji representation
}

// 山海经精怪图鉴
export const ENEMIES: EnemyData[] = [
  // 普通精怪
  {
    name: '九尾狐',
    hp: 28,
    attack: 7,
    type: 'normal',
    description: '九尾灵狐，狡黠多变',
    sprite: '🦊',
  },
  {
    name: '化蛇',
    hp: 35,
    attack: 6,
    type: 'normal',
    description: '蛇身鸟翼，能喷毒雾',
    sprite: '🐍',
  },
  {
    name: '穷奇',
    hp: 30,
    attack: 9,
    type: 'normal',
    description: '虎背生翼，食人为乐',
    sprite: '🐯',
  },
  {
    name: '姑获鸟',
    hp: 25,
    attack: 8,
    type: 'normal',
    description: '鬼鸟夜行，掠人婴孩',
    sprite: '🐦',
  },
  {
    name: '何罗鱼',
    hp: 40,
    attack: 5,
    type: 'normal',
    description: '一首十身，声音如吠',
    sprite: '🐟',
  },
  {
    name: '鄂名鱼',
    hp: 32,
    attack: 7,
    type: 'normal',
    description: '赤目赤足，鸣声如鸲',
    sprite: '🦈',
  },
  // 精英精怪
  {
    name: '混沌',
    hp: 55,
    attack: 11,
    type: 'elite',
    description: '无形无相，吞噬万物',
    sprite: '👻',
  },
  {
    name: '梼杌',
    hp: 60,
    attack: 10,
    type: 'elite',
    description: '状如老虎，食人首目',
    sprite: '🐺',
  },
  {
    name: '凿齿',
    hp: 50,
    attack: 12,
    type: 'elite',
    description: '獠牙外露，铠甲坚厚',
    sprite: '🦴',
  },
  // BOSS级神怪
  {
    name: '烛九阴',
    hp: 100,
    attack: 14,
    type: 'boss',
    description: '人面蛇身，睁眼为昼',
    sprite: '🐉',
  },
  {
    name: '相柳',
    hp: 110,
    attack: 12,
    type: 'boss',
    description: '九首人面，毒涎漫地',
    sprite: '🐍',
  },
  {
    name: '饕餮',
    hp: 95,
    attack: 15,
    type: 'boss',
    description: '羊身人面，贪得无厌',
    sprite: '🦑',
  },
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