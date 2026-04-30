export type CardType = 'attack' | 'defense' | 'heal' | 'skill';
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

  // 符术派新增机制
  gainEnergy?: number; // 获得灵气
  reduceCost?: number; // 本回合下一张牌费用减少
  chainDraw?: number; // 本回合每出一张牌则抽牌

  // 斩妖派机制
  comboBonus?: boolean; // 斩击狂热加成，连续出斩妖攻击牌时伤害递增
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
  damageReduction?: number;
  lifesteal?: number;
  // 符术派状态
  pendingEnergyGain?: number; // 下回合开始时获得灵气
  pendingCostReduction?: number; // 本回合下一张牌费用减少
  cardsPlayedThisTurn?: number; // 本回合已出牌数
  // 斩妖派状态
  zhanyaoCombo?: number; // 斩妖连击计数，连续出斩妖攻击牌时递增
  // 御灵派状态
  shieldEcho?: number; // 护体回响值，本回合累计护盾值
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
  attackReduction?: number;
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