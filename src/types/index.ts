export type CardType = 'attack' | 'defense' | 'heal';
export type CardRarity = 'starter' | 'common' | 'rare';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  description: string;
  value: number; // damage, block, or heal amount
  rarity: CardRarity;
  multiHit?: number; // for double-hit type attacks
  counterDamage?: number; // for counter attacks
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
}

export type GamePhase = 'battle' | 'victory' | 'defeat' | 'reward';

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