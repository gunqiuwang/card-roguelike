/**
 * 全局类型定义
 *
 * v0.1 只定义视觉样机需要的最小类型集。战斗/节点等类型 v0.2 再补。
 */

// ============================================================================
// 卡牌
// ============================================================================
export type CardType = 'fu' | 'faqi' | 'yao';
// fu：符咒，faqi：法器（被动/触发），yao：妖卡（封妖得到）

/**
 * 稀有度（内部命名 → 玩家看到的别名）
 *   starter → 无徽章（起手基础卡）
 *   common  → R    · 暗岩纹铜
 *   rare    → SR   · 青纹古铜
 *   epic    → SSR  · 哑光金纹
 *   legend  → SP   · 苍玉玄纹
 *
 * 保留内部名防止 v0.2+ 战斗/掉落系统命名抖动。
 * 玩家展示始终使用 rarityTheme[x].label。
 */
export type CardRarity = 'starter' | 'common' | 'rare' | 'epic' | 'legend';

export type School = 'zhanyao' | 'yuling' | 'fushu' | 'neutral';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  school: School;
  cost: number; // 能量消耗（气）
  description: string; // 支持简单富文本（{damage}{block}{draw}）
  flavor?: string; // flavor text，引自山海经或原创
  /** 立绘路径，若为空则 fallback 到墨影 SVG */
  artSrc?: string;
  /** 无图时使用的剪影类型 */
  silhouette?: SilhouetteKind;
}

// ============================================================================
// 妖（敌人，可被封成卡）
// ============================================================================
export type YaoRank = 'C' | 'B' | 'S'; // 普通/精英/Boss

export interface Yao {
  id: string;
  name: string;
  rank: YaoRank;
  chapter: string;
  hp: number;
  flavor: string; // 击败前说的话（世界观）
  /** 被封后变成的那张卡 */
  sealedCard: Omit<Card, 'id'>;
  /** 封印符阵（v0.3 才用） */
  sealPattern?: string[];
  /** 立绘路径（Boss 级优先生图） */
  artSrc?: string;
  silhouette: SilhouetteKind;
}

// ============================================================================
// 墨影剪影类型（无立绘时的 fallback）
// ============================================================================
export type SilhouetteKind =
  | 'fox'      // 狐
  | 'serpent'  // 蛇
  | 'beast'    // 四足兽
  | 'bird'     // 鸟
  | 'fish'     // 鱼
  | 'humanoid' // 人形
  | 'talisman' // 符咒
  | 'relic'    // 法器
  | 'hero';    // 主角
