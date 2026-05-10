/**
 * 全局类型定义 · v0.2 封妖 MVP
 *
 * 组织：
 *   §1  卡牌 · Card / CardInstance / Effect
 *   §2  妖 / 敌人 · Yao / Enemy / Intent / Status
 *   §3  战斗 · BattleState / BattlePhase
 *   §4  Run · RunState / MapNode / NodeKind
 *   §5  事件 · EventDef / EventChoice / EventOutcome
 *   §6  存档 / Meta · SaveData / MetaProgress
 *   §7  杂项 · SilhouetteKind
 *
 * 所有字段对齐 docs/DESIGN_v0.2.md §3 / §4 / §5 / §6。
 * 视觉样机 Card.tsx 只使用 §1 的 Card 基础字段，因此本文件向前兼容。
 */

// ============================================================================
// §7 · 杂项
// ============================================================================
export type SilhouetteKind =
  | 'fox'
  | 'serpent'
  | 'beast'
  | 'bird'
  | 'fish'
  | 'humanoid'
  | 'talisman'
  | 'relic'
  | 'hero';

// ============================================================================
// §1 · 卡牌
// ============================================================================
export type CardType = 'fu' | 'faqi' | 'yao';
export type CardRarity = 'starter' | 'common' | 'rare' | 'epic' | 'legend';
export type School = 'zhanyao' | 'yuling' | 'fushu' | 'neutral';

export type StatusKind =
  | 'poison'       // 每回合开始 -1 HP / 层
  | 'weak'         // 攻击伤害 ×0.75
  | 'vulnerable'   // 受到伤害 ×1.25
  | 'strength'     // 攻击伤害 +1 / 层（永久）
  | 'intentSealed'; // 下回合意图空过

/** 原子效果（DESIGN §4.1） */
export type Effect =
  | { kind: 'damage'; amount: number }
  | { kind: 'block'; amount: number }
  | { kind: 'draw'; count: number }
  | { kind: 'gainEnergy'; amount: number }
  | { kind: 'applyStatus'; status: StatusKind; stack: number; target: 'enemy' | 'self' }
  | { kind: 'execute'; hpPercent: number; bonusDamage: number }
  | { kind: 'sealIntent'; turns: number }
  | { kind: 'discardEnemyBlock' };

/** 卡牌"模板"（一份数据 → 可复制多份） */
export interface Card {
  id: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  school: School;
  cost: number;
  description: string;
  flavor?: string;
  /** 原子效果列表，按序执行 */
  effects?: Effect[];
  /** 打出即入消耗堆 */
  exhaust?: boolean;
  /** 回合结束未打出则消耗（v0.2 预留） */
  ethereal?: boolean;
  /** 立绘路径（public/images/...） */
  artSrc?: string;
  /** 无图时 fallback 剪影 */
  silhouette?: SilhouetteKind;
  /** 妖卡专属（v0.4 才会用来反噬） */
  yaoxing?: number;
}

/** 战斗中的卡牌实例 · 带运行时 uid，同模板多份可分辨 */
export interface CardInstance extends Card {
  /** 运行时唯一 ID。形如 `${cardId}#${seq}` */
  uid: string;
  /** 当前妖性（只对 type='yao' 有意义；持久化在 run.deck 上） */
  yaoxing?: number;
}

// ============================================================================
// §1.5 · 笔画（拼符封印用）
// ============================================================================
export type StrokeKind = 'dot' | 'horizontal' | 'vertical' | 'slash' | 'hook' | 'loop';

export const STROKE_GLYPHS: Record<StrokeKind, string> = {
  dot: '丶',
  horizontal: '一',
  vertical: '丨',
  slash: '丿',
  hook: '乛',
  loop: '囗',
};

export const STROKE_NAMES: Record<StrokeKind, string> = {
  dot: '点',
  horizontal: '横',
  vertical: '竖',
  slash: '撇',
  hook: '钩',
  loop: '回',
};

/** 拼符 · 正在进行中的封印挑战 */
export interface SealChallenge {
  /** 妖 id（对应 EnemyState.yaoId） */
  enemyIdx: number;
  /** 正确顺序 */
  sequence: StrokeKind[];
  /** 玩家已经点的下标 */
  progress: number;
  /** 失败次数（v0.2.1 一次失败即 fail） */
  failed: boolean;
}

// ============================================================================
// §1.6 · 秘卷（被动 buff）
// ============================================================================
export type ScrollEffectKind =
  | 'extraEnergy'      // 每回合 +1 气
  | 'extraDraw'        // 每回合多抽 1 张
  | 'startBlock'       // 战斗起手 +N 气·御
  | 'lowHpDamage'      // 自身 HP ≤ 30% 时打出 damage +30%
  | 'yaoxingResist'    // 所有妖卡妖性涨幅 ×0.5
  | 'firstHitBonus';   // 每战第一张伤害卡 +50%

export interface Scroll {
  id: string;
  name: string;
  description: string;
  flavor: string;
  effect: ScrollEffectKind;
  /** effect 辅参（比如 startBlock 的层数） */
  magnitude?: number;
  cost: number;
}

// ============================================================================
// §2 · 妖 / 敌人
// ============================================================================
export type YaoRank = 'C' | 'B' | 'S';
export type ChapterId = 'qingqiu' | 'taotie' | 'guixu' | 'kunlun' | 'hundun';

export interface Intent {
  kind: 'attack' | 'defend' | 'charge' | 'cast';
  damage?: number;
  block?: number;
  status?: { kind: StatusKind; stack: number };
  /** UI 显示文案（如 "⚔ 6"、"🛡 4"、"🌀 蓄力中"） */
  label: string;
}

/** 妖数据模板（敌人数据 + 封后卡） */
export interface Yao {
  id: string;
  name: string;
  rank: YaoRank;
  chapter: ChapterId | string;
  hp: number;
  /** 意图脚本，按回合循环 */
  intents: Intent[];
  /** 被封后成为的卡（不包含运行时 id） */
  sealedCard: Omit<Card, 'id'>;
  /** 击败前的旁白 */
  flavor: string;
  artSrc?: string;
  silhouette: SilhouetteKind;
  /** 灵气奖励区间（斩） */
  rewardCurrency: [number, number];
  /** 封印符阵 · 笔画序列（v0.2.1 拼符用；未指定则按 rank 动态生成） */
  sealPattern?: StrokeKind[];
  /** Boss 战蓄力大招的意图下标（可被打断清空） */
  chargeClimaxIndex?: number;
  /** Boss 被打到此血量百分比 → 打断当前蓄力 */
  interruptHpPercent?: number;
}

/** 状态栏实例（挂在 player / enemy 上） */
export interface StatusBag {
  poison: number;
  weak: number;
  vulnerable: number;
  strength: number;
  intentSealed: number;
}

/** 战场上的敌人运行时实例 */
export interface EnemyState {
  /** 引用的 Yao.id */
  yaoId: string;
  /** 战斗中可能与 Yao 不同（多只同型号时 'qinghu#0','qinghu#1'） */
  instanceId: string;
  name: string;
  rank: YaoRank;
  hp: number;
  maxHp: number;
  block: number;
  status: StatusBag;
  /** 当前意图下标（循环） */
  intentIndex: number;
  intents: Intent[];
  silhouette: SilhouetteKind;
  artSrc?: string;
  sealedCard: Omit<Card, 'id'>;
  /** 是否已经触发过本场 SEAL_CHOICE（锁死，避免反复弹） */
  sealChoiceTriggered: boolean;
  /** 是否已被封（进入 BATTLE_WIN 前标记，决定奖励分支） */
  sealed: boolean;
  /** 封印完美（拼符全对） → 封后妖卡升阶 */
  sealedPerfect?: boolean;
  /** 封印笔画序列（从 Yao.sealPattern 复制，拼符挑战用） */
  sealPattern?: StrokeKind[];
  /** Boss 蓄力被打断（跳过大招） */
  chargeInterrupted?: boolean;
  flavor: string;
  rewardCurrency: [number, number];
}

// ============================================================================
// §3 · 战斗
// ============================================================================
export type BattlePhase =
  | 'battleStart'
  | 'playerTurn'
  | 'playerAction'
  | 'sealChoice'
  | 'sealMiniGame'
  | 'enemyTurn'
  | 'won'
  | 'lost';

/** 单场战斗的完整状态 */
export interface BattleState {
  phase: BattlePhase;
  turn: number;
  // 玩家
  playerHp: number;
  playerMaxHp: number;
  playerBlock: number;
  playerStatus: StatusBag;
  energy: number;
  energyMax: number;
  // 牌堆
  drawPile: CardInstance[];
  hand: CardInstance[];
  discardPile: CardInstance[];
  exhaustPile: CardInstance[];
  /** 敌人（v0.2 大多是 1 个，战斗 3 是 2 个） */
  enemies: EnemyState[];
  /** UI 日志，新的在末尾 */
  log: string[];
  /** 结算动画的浮动数字队列（UI 消费后清空） */
  fx: BattleFx[];
  /** 本场结算结果（进入 won/lost 后填） */
  outcome?: BattleOutcome;
  /** 战斗类型（用于奖励计算） */
  kind: 'normal' | 'elite' | 'boss';
  /** 拼符封印挑战中（玩家选了"封"后） */
  sealChallenge?: SealChallenge | null;
  /** 本场已打出的第一张伤害卡（秘卷 firstHitBonus 用） */
  firstDamageCardUsed?: boolean;
  /** 活跃秘卷 id 列表（从 RunState.scrolls 复制到这里，避免战斗中变化） */
  activeScrolls?: string[];
}

export interface BattleFx {
  id: string;
  target: 'player' | 'enemy';
  enemyIdx?: number;
  kind: 'damage' | 'crit' | 'heal' | 'block' | 'poison' | 'seal';
  value: number | string;
}

export interface BattleOutcome {
  /** 胜利方式 */
  result: 'win' | 'lose';
  /** 如果 win：'kill' | 'seal' | 'mixed'（混编中 seal 任一只） */
  resolution?: 'kill' | 'seal' | 'mixed';
  currencyGained: number;
  /** 封妖产生的卡（加到 run 牌组） */
  sealedCards: Card[];
  /** 是否该给卡牌奖励（全封则 false） */
  shouldOfferReward: boolean;
}

// ============================================================================
// §4 · Run · 地图与运行状态
// ============================================================================
export type NodeKind =
  | 'battle'
  | 'elite'
  | 'event'
  | 'shrine'
  | 'boss'
  | 'start';

export interface MapNode {
  id: string;
  kind: NodeKind;
  /** 显示名（如 "青狐小妖"、"荒坟"） */
  label: string;
  /** 仅 battle/elite/boss 有 */
  enemyYaoIds?: string[];
  /** 仅 event 有 */
  eventId?: string;
  /** 是否已完成 */
  done: boolean;
}

/** 一次 run 的完整状态 */
export interface RunState {
  /** 初始 seed（仿真 / 存档可复现） */
  seed: number;
  /** 玩家当前 HP / 最大 HP */
  hp: number;
  maxHp: number;
  /** 灵气货币 */
  currency: number;
  /** 牌组（静态，不含战斗堆） */
  deck: Card[];
  /** 地图节点（线性 8 个） */
  map: MapNode[];
  /** 当前节点下标（已完成的就 +1） */
  nodeIndex: number;
  /** 章节 */
  chapter: ChapterId | string;
  /** 本场正在进行的战斗（无战斗时 null） */
  battle: BattleState | null;
  /** 本场奖励待处理（战斗结算后弹奖励屏幕） */
  pendingReward: RewardState | null;
  /** 事件待处理 */
  pendingEvent: PendingEventState | null;
  /** 需要删除一张卡（超上限） */
  pendingOverflow: OverflowState | null;
  /** run 统计 */
  stats: RunStats;
  /** 已持有的秘卷 id */
  scrolls: string[];
  /** 每张妖卡的当前妖性（按 card.id 索引；兼容：老存档字段缺失时懒初始化） */
  yaoxing?: Record<string, number>;
  /** 夜间反噬事件是否已触发过（防止连续触发） */
  nightBacklashTriggered?: boolean;
}

export interface RunStats {
  turnsPlayed: number;
  kills: number;
  seals: number;
  damageDealt: number;
  damageTaken: number;
}

export interface RewardState {
  currency: number;
  /** 3 选 1 的卡牌候选；空数组表示不给卡（全封情况） */
  cardChoices: Card[];
  /** 已领取标志，UI 用 */
  done: boolean;
}

export interface PendingEventState {
  eventId: string;
  /** 玩家做出选择后的结果文案（确认屏） */
  chosenOutcome?: {
    description: string;
    appliedLog: string[];
  };
}

export interface OverflowState {
  /** 当前牌组（从里面选一张删） */
  deckSnapshot: Card[];
  /** 是从哪里来的触发（用于提示文案） */
  reason: 'reward' | 'seal' | 'event';
}

// ============================================================================
// §5 · 事件系统
// ============================================================================
/** 事件结果：应用于 RunState 的变更（函数式） */
export interface EventChoice {
  label: string;
  /** UI 描述（玩家看到） */
  description: string;
  /** 结果执行函数（副作用：修改 run；返回人类可读的结算文案） */
  apply: (run: RunState, rng: () => number) => string;
}

export interface EventDef {
  id: string;
  title: string;
  body: string;
  chapter?: ChapterId | string;
  choices: EventChoice[];
}

// ============================================================================
// §6 · 存档 · Meta 长线
// ============================================================================
export const SAVE_SCHEMA_VERSION = 1 as const;
export const CONTENT_VERSION = '0.2.0' as const;

export interface MetaProgress {
  /** 完成过的 run 数 */
  runs: number;
  /** 胜利过的 run 数（到达 Boss 后胜） */
  victories: number;
  /** 累计封妖数 */
  seals: number;
  /** 曾抵达的最深章节（排序值：1=青丘…5=混沌） */
  deepestChapter: number;
  /** 图鉴：已封印过的妖 id */
  unlockedYao: string[];
  /** 新手教程已完成（完成后不再自动弹教程） */
  tutorialDone: boolean;
}

export interface SaveData {
  version: typeof SAVE_SCHEMA_VERSION;
  contentVersion: typeof CONTENT_VERSION;
  runInProgress: RunState | null;
  meta: MetaProgress;
}
