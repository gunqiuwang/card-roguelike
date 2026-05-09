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
  inkBlack: '#0F0E0C',
  parchment: '#C9B890',
  vermillion: '#B23A2A',
  ember: '#C4551B',
  jadeDim: '#4A5D4A',
  boneGold: '#A68C5B',
  mistGrey: '#6B6259',
} as const;

export const colorShades = {
  inkBlackSoft: '#1A1815',
  inkBlackDeep: '#050504',
  parchmentLight: '#E0D2AB',
  parchmentDark: '#9D8F6F',
  vermillionLight: '#D15040',
  vermillionDark: '#8B2A1E',
  emberGlow: '#E08A48',
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
  borderRadius: '18px',
  borderWidth: '1.5px',
  defaultWidth: 220,
  header: { height: '8%' },
  portrait: { height: '55%' },
  name: { height: '10%' },
  description: { height: '22%' },
  footer: { height: '5%' },
} as const;

// legacy 稀有度边框色
export const rarityBorder = {
  starter: colors.boneGold,
  common: colors.jadeDim,
  rare: colors.vermillion,
  epic: colors.ember,
  legend: colorShades.emberGlow,
} as const;

// ============================================================================
// 稀有度主题 · 五阶汉字名：凡 / 珍 / 灵 / 玄（+ 神预留）
//
// 结构（用户的暗黑百闻牌方案）：
//   · 卡面深渊暗底（body-top → body-bot 线性）
//   · 1.5px 细鎏金缎面边（5-stop 对角渐变）
//   · 角花 opacity ≤ 0.2
//
// 每档字段：
//   label / nameCn        玩家可见
//   edgeStop0..4          5-stop 缎面渐变（135deg 对角）
//   edgeMuted             角花色（带透明度）
//   bodyTop / bodyBot     卡面暗底两色
//   highlight / shadow    文字描边用（若需要）
//   pattern               暗纹色
//   glow                  hover 柔光 (≤ 0.3 alpha)
//   badgeRing / badgeText 徽章配色
//   edge / edgeLight      兼容旧代码（= stop2 / stop1）
// ============================================================================
export const rarityTheme = {
  starter: {
    label: '',
    nameCn: '',
    // 铅灰 · 无名
    edgeStop0: '#1d1a15',
    edgeStop1: '#3a342a',
    edgeStop2: '#4a4336',
    edgeStop3: '#3a342a',
    edgeStop4: '#1d1a15',
    edgeMuted: 'rgba(110, 90, 60, 0.12)',
    bodyTop: '#0c0a08',
    bodyBot: '#050403',
    edge: '#4a4336',
    edgeLight: '#3a342a',
    edgeDark: '#1d1a15',
    highlight: 'rgba(169,150,110,0.22)',
    shadow: 'rgba(0,0,0,0.55)',
    pattern: 'rgba(166,140,91,0.15)',
    glow: 'rgba(166,140,91,0.18)',
    badgeRing: '#6B6259',
    badgeText: '#6B6259',
  },
  common: {
    // 凡 · 陨岩铜 —— 你原版的标准缎面
    label: '凡',
    nameCn: '陨岩铜',
    edgeStop0: '#3a2e1f',
    edgeStop1: '#7a6240',
    edgeStop2: '#947850',
    edgeStop3: '#7a6240',
    edgeStop4: '#3a2e1f',
    edgeMuted: 'rgba(110, 90, 60, 0.16)',
    bodyTop: '#0c0a08',
    bodyBot: '#050403',
    edge: '#947850',
    edgeLight: '#7a6240',
    edgeDark: '#3a2e1f',
    highlight: 'rgba(180,128,72,0.42)',
    shadow: 'rgba(10,6,3,0.82)',
    pattern: 'rgba(122,84,50,0.22)',
    glow: 'rgba(148,120,80,0.24)',
    badgeRing: '#947850',
    badgeText: '#7a6240',
  },
  rare: {
    // 珍 · 沉青铜 —— 青带锈
    label: '珍',
    nameCn: '沉青铜',
    edgeStop0: '#1f3026',
    edgeStop1: '#4a6e5c',
    edgeStop2: '#608878',
    edgeStop3: '#4a6e5c',
    edgeStop4: '#1f3026',
    edgeMuted: 'rgba(95, 135, 115, 0.16)',
    bodyTop: '#0a0c0a',
    bodyBot: '#040605',
    edge: '#608878',
    edgeLight: '#4a6e5c',
    edgeDark: '#1f3026',
    highlight: 'rgba(120,155,130,0.4)',
    shadow: 'rgba(5,12,9,0.85)',
    pattern: 'rgba(88,124,104,0.22)',
    glow: 'rgba(96,136,120,0.26)',
    badgeRing: '#608878',
    badgeText: '#4a6e5c',
  },
  epic: {
    // 灵 · 鎏金哑纹
    label: '灵',
    nameCn: '鎏金哑纹',
    edgeStop0: '#3a2810',
    edgeStop1: '#8a6a2c',
    edgeStop2: '#b08848',
    edgeStop3: '#8a6a2c',
    edgeStop4: '#3a2810',
    edgeMuted: 'rgba(176, 136, 72, 0.18)',
    bodyTop: '#0d0b08',
    bodyBot: '#060503',
    edge: '#b08848',
    edgeLight: '#8a6a2c',
    edgeDark: '#3a2810',
    highlight: 'rgba(220,190,120,0.42)',
    shadow: 'rgba(14,10,4,0.88)',
    pattern: 'rgba(176,136,72,0.24)',
    glow: 'rgba(176,136,72,0.3)',
    badgeRing: '#b08848',
    badgeText: '#8a6a2c',
  },
  legend: {
    // 玄 · 玄玉血纹 —— 你的 SSR 血红同款
    label: '玄',
    nameCn: '玄玉血纹',
    edgeStop0: '#2a0e0a',
    edgeStop1: '#4a1a12',
    edgeStop2: '#922b1a',
    edgeStop3: '#4a1a12',
    edgeStop4: '#2a0e0a',
    edgeMuted: 'rgba(146, 43, 26, 0.18)',
    bodyTop: '#0a0605',
    bodyBot: '#040302',
    edge: '#922b1a',
    edgeLight: '#4a1a12',
    edgeDark: '#2a0e0a',
    highlight: 'rgba(200,80,60,0.4)',
    shadow: 'rgba(2,6,8,0.92)',
    pattern: 'rgba(146,43,26,0.24)',
    glow: 'rgba(146,43,26,0.3)',
    badgeRing: '#922b1a',
    badgeText: '#4a1a12',
  },
} as const;

export type RarityThemeKey = keyof typeof rarityTheme;

// ============================================================================
// 派别色
// ============================================================================
export const schoolColors = {
  zhanyao: colors.vermillion,
  yuling: colors.jadeDim,
  fushu: colors.ember,
  neutral: colors.mistGrey,
} as const;

// ============================================================================
// 动效
// ============================================================================
export const motion = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  medium: '300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  slow: '600ms ease-out',
} as const;

export const shadows = {
  paper: '0 2px 8px rgba(0, 0, 0, 0.4)',
  card: '0 4px 16px rgba(0, 0, 0, 0.5)',
  cardHover: '0 12px 32px rgba(0, 0, 0, 0.7), 0 0 20px rgba(196, 85, 27, 0.2)',
  seal: '0 0 12px rgba(178, 58, 42, 0.5)',
} as const;

// ============================================================================
// 纸纹（非卡牌用）
// ============================================================================
export const textures = {
  paperNoise: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")`,
  inkWash: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='w'><feTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='3' seed='7'/><feColorMatrix values='0 0 0 0 0.06 0 0 0 0 0.05 0 0 0 0 0.05 0 0 0 0.3 0'/></filter><rect width='400' height='400' filter='url(%23w)'/></svg>")`,
} as const;
