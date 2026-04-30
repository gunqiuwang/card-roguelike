export type CardType = 'attack' | 'defense' | 'heal';
export type CardRarity = 'starter' | 'common' | 'rare';
export type School = '斩妖' | '御灵' | '符术';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  description: string;
  value: number; // damage, block, or heal amount
  rarity: CardRarity;
  school: School;

  // Optional mechanics
  multiHit?: number; // for multi-hit attacks
  ignoreBlock?: boolean; // for ignoring defense
  counterDamage?: number; // for counter attacks
  healValue?: number; // additional heal
  reflectDamage?: number; // damage reflection
  lifesteal?: number; // percentage of damage converted to healing
  drawCards?: number; // cards to draw
  damageReduction?: number; // reduce incoming damage
  debuffDamage?: number; // reduce enemy attack
}

export interface PlayerState {
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  block: number;
  gold: number;
  deck: Card[];
  discardPile: Card[];
  drawPile: Card[];
  hand: Card[];
  pendingCounterDamage?: number;
  damageReduction?: number; // 回合内受到伤害减少
  lifesteal?: number; // 回合内伤害转化治疗
}

export type EnemyIntent = 'attack' | 'charge';
export type EnemyType = 'normal' | 'elite' | 'boss';

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  intent: EnemyIntent;
  type: EnemyType;
  attackReduction?: number; // 攻击力降低（毒/debuff）
}

export type GamePhase = 'idle' | 'battle' | 'victory' | 'defeat' | 'reward';

export interface GameState {
  player: PlayerState;
  enemy: Enemy | null;
  phase: GamePhase;
  isPlayerTurn: boolean;
  turn: number;
  rewardOptions: Card[];
}

export type GameAction =
  | { type: 'DRAW_CARDS'; payload: number }
  | { type: 'PLAY_CARD'; payload: { card: Card; cardIndex: number } }
  | { type: 'END_TURN' }
  | { type: 'START_TURN' }
  | { type: 'SELECT_REWARD'; payload: Card }
  | { type: 'RESET_GAME' }
  | { type: 'SET_INTENT' };