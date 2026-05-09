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
// 稀有度边框色（legacy - 仅老代码用；新代码用 rarityTheme）
// ============================================================================
export const rarityBorder = {
  starter: colors.boneGold,
  common: colors.jadeDim,
  rare: colors.vermillion,
  epic: colors.ember,
  legend: colorShades.emberGlow,
} as const;

// ============================================================================
// 稀有度主题 · 五阶汉字名：凡 / 珍 / 灵 / 玄 / 神
// 风格指南：低调高级、内敛史诗、暗黑洪荒、金属雕刻。
//           禁止浮夸流光和刺眼大金边。
//
// 内部代号 → 玩家看到的名字（彻底放弃 R/SR/SSR/SP 这种日系手游黑话）
//   starter  起手（无徽章）
//   common   凡      Mortal       陨岩铜     凡品，人间可得
//   rare     珍      Treasure     沉青铜     珍品，罕见
//   epic     灵      Numinous     鎏金哑纹   有灵，通晓
//   legend   玄      Mystic       玄玉血纹   玄品，近神
//   divine   神      Divine       神骸金    （预留，终章/限定用）
//
// 每档色值成组（金属质感必需）：
//   label         玩家看到的汉字名
//   nameCn        材质描述词
//   edge          主边色 · 金属带中段
//   edgeLight     缎面上光带（浅）
//   edgeDark      缎面下暗带（深）
//   edgeMuted     内缩亚边
//   highlight     顶部受光（极细）
//   shadow        底部暗槽（极细）
//   pattern       四角暗纹
//   glow          hover 弱柔光（≤ 0.3 alpha）
//   badgeRing     徽章环主色
//   badgeText     徽章中心字色
// ============================================================================
export const rarityTheme = {
  starter: {
    label: '',
    nameCn: '',
    edge: '#4E4638',
    edgeLight: '#6B5F47',
    edgeDark: '#2F2920',
    edgeMuted: '#3A3327',
    highlight: 'rgba(169,150,110,0.22)',
    shadow: 'rgba(0,0,0,0.55)',
    pattern: 'rgba(166,140,91,0.2)',
    glow: 'rgba(166,140,91,0.18)',
    badgeRing: '#6B6259',
    badgeText: '#6B6259',
  },
  common: {
    // 凡 · 陨岩铜
    label: '凡',
    nameCn: '陨岩铜',
    edge: '#7A5432',
    edgeLight: '#A57344',
    edgeDark: '#3E2611',
    edgeMuted: '#52371D',
    highlight: 'rgba(180,128,72,0.42)',
    shadow: 'rgba(10,6,3,0.82)',
    pattern: 'rgba(122,84,50,0.28)',
    glow: 'rgba(122,84,50,0.28)',
    badgeRing: '#7A5432',
    badgeText: '#3E2611',
  },
  rare: {
    // 珍 · 沉青铜
    label: '珍',
    nameCn: '沉青铜',
    edge: '#6B9282',
    edgeLight: '#95B9A8',
    edgeDark: '#2F4A3C',
    edgeMuted: '#3F5A4A',
    highlight: 'rgba(140,180,155,0.42)',
    shadow: 'rgba(5,12,9,0.85)',
    pattern: 'rgba(88,124,104,0.28)',
    glow: 'rgba(107,146,130,0.3)',
    badgeRing: '#6B9282',
    badgeText: '#2F4A3C',
  },
  epic: {
    // 灵 · 鎏金哑纹（哑光，非高光鎏金）
    label: '灵',
    nameCn: '鎏金哑纹',
    edge: '#B39154',
    edgeLight: '#DBB878',
    edgeDark: '#6A4F1F',
    edgeMuted: '#7E6226',
    highlight: 'rgba(220,190,120,0.48)',
    shadow: 'rgba(14,10,4,0.88)',
    pattern: 'rgba(179,145,84,0.3)',
    glow: 'rgba(179,145,84,0.32)',
    badgeRing: '#B39154',
    badgeText: '#6A4F1F',
  },
  legend: {
    // 玄 · 玄玉血纹（山海"玄"= 深青至黑 + 血红一点）
    label: '玄',
    nameCn: '玄玉血纹',
    edge: '#4A6E7A',
    edgeLight: '#7EA1AE',
    edgeDark: '#1E3840',
    edgeMuted: '#2E4A54',
    highlight: 'rgba(130,170,185,0.45)',
    shadow: 'rgba(2,6,8,0.92)',
    pattern: 'rgba(74,110,122,0.3)',
    glow: 'rgba(74,110,122,0.32)',
    badgeRing: '#4A6E7A',
    badgeText: '#1E3840',
  },
} as const;

export type RarityThemeKey = keyof typeof rarityTheme;

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
