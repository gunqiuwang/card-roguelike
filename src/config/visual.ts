/**
 * 视觉系统配置 · 对应 docs/ART_BIBLE.md
 *
 * 所有 UI 视觉参数的单一来源。任何"视觉微调"都改这个文件。
 * 修改前请先同步 docs/ART_BIBLE.md。
 */

// ============================================================================
// 色板（锁定七色，不准扩展）
// ============================================================================
export const colors = {
  inkBlack: '#0F0E0C',      // 主背景、深夜、墨色
  parchment: '#C9B890',     // 符纸底、卡面底
  vermillion: '#B23A2A',    // 朱砂红、印章、关键按钮
  ember: '#C4551B',         // 符火、高亮、能量（烧焦朱红橙，比原 #E87722 更沉）
  jadeDim: '#4A5D4A',       // 法器、次要
  boneGold: '#A68C5B',      // 金线、稀有边框
  mistGrey: '#6B6259',      // 次要文字、禁用
} as const;

// 衍生色阶（亮/暗）
export const colorShades = {
  inkBlackSoft: '#1A1815',      // 面板背景
  inkBlackDeep: '#050504',      // 纯深
  parchmentLight: '#E0D2AB',    // 高亮纸
  parchmentDark: '#9D8F6F',     // 阴影纸
  vermillionLight: '#D15040',
  vermillionDark: '#8B2A1E',
  emberGlow: '#E08A48',         // 发光态（比原 #FFB268 更沉，避免刺眼）
  boneGoldLight: '#D4B87A',
} as const;

// ============================================================================
// 字体
// ============================================================================
export const fonts = {
  heading: `"Ma Shan Zheng", "STKaiti", "KaiTi", "楷体", cursive`,
  body: `"Noto Serif SC", "Source Han Serif SC", "STSong", "宋体", serif`,
  numeric: `"Cinzel", Georgia, "Noto Serif SC", serif`,
} as const;

export const fontSize = {
  gameTitle: '56px',
  sectionTitle: '32px',
  cardName: '20px',
  cardDesc: '14px',
  numberLarge: '28px',
  body: '16px',
  caption: '12px',
} as const;

// ============================================================================
// 卡面版式（3:4 比例）
// ============================================================================
export const cardLayout = {
  aspectRatio: '3 / 4',
  borderRadius: '12px',
  borderWidth: '2px',
  defaultWidth: 220, // px

  // 内部分区（百分比）
  header: { height: '8%' },
  portrait: { height: '55%' },
  name: { height: '10%' },
  description: { height: '22%' },
  footer: { height: '5%' },
} as const;

// ============================================================================
// 稀有度边框色
// ============================================================================
export const rarityBorder = {
  starter: colors.boneGold,
  common: colors.jadeDim,
  rare: colors.vermillion,
  epic: colors.ember,
  legend: colorShades.emberGlow,
} as const;

// ============================================================================
// 派别色（斩妖/御灵/符术）
// ============================================================================
export const schoolColors = {
  zhanyao: colors.vermillion,   // 斩妖·朱砂
  yuling: colors.jadeDim,       // 御灵·石青
  fushu: colors.ember,          // 符术·符火
  neutral: colors.mistGrey,
} as const;

// ============================================================================
// 动效 timing
// ============================================================================
export const motion = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  medium: '300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  slow: '600ms ease-out',
} as const;

// ============================================================================
// 阴影
// ============================================================================
export const shadows = {
  paper: '0 2px 8px rgba(0, 0, 0, 0.4)',
  card: '0 4px 16px rgba(0, 0, 0, 0.5)',
  cardHover: '0 12px 32px rgba(0, 0, 0, 0.7), 0 0 20px rgba(196, 85, 27, 0.2)',
  seal: '0 0 12px rgba(178, 58, 42, 0.5)',
} as const;

// ============================================================================
// 纸张噪点纹理（CSS filter 合成）
// ============================================================================
export const textures = {
  paperNoise: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")`,
  inkWash: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='w'><feTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='3' seed='7'/><feColorMatrix values='0 0 0 0 0.06 0 0 0 0 0.05 0 0 0 0 0.05 0 0 0 0.3 0'/></filter><rect width='400' height='400' filter='url(%23w)'/></svg>")`,
} as const;
