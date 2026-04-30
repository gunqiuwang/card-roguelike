export type CardType = 'attack' | 'defense' | 'heal';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  description: string;
  value: number; // damage, block, or heal amount
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
}

export type EnemyIntent = 'attack' | 'charge';

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  intent: EnemyIntent;
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