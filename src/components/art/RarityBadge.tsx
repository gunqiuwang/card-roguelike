/**
 * 稀有度徽章 · 小而雅，右下角一粒章子
 *
 * 设计原则（百闻牌同款）：角落小徽章，鎏金/青玉纹章，不靠大闪光大特效。
 *
 * 五档：
 *   starter  无徽章（基础符/起手卡）
 *   common   青玉单环          ·
 *   rare     青玉双环 + 小印    ✦
 *   epic     鎏金双环 + 小朱印  ❖
 *   legend   鎏金三环 + 符篆    ✷
 */

import type { CardRarity } from '../../types';

type Props = {
  rarity: CardRarity;
  /** 徽章直径（px） */
  size?: number;
  className?: string;
};

type Style = {
  outer: string;
  inner: string;
  dot: string;
  mark: string;   // 中心符号
  glyph: string;  // '' | '·' | '珍' | '灵' | '绝'
  rings: 0 | 1 | 2 | 3;
};

const styleMap: Record<CardRarity, Style> = {
  starter: {
    outer: '#A68C5B',
    inner: '#A68C5B',
    dot: '#6B6259',
    mark: '',
    glyph: '',
    rings: 0,
  },
  common: {
    outer: '#4A5D4A',
    inner: '#6B7C6B',
    dot: '#4A5D4A',
    mark: '·',
    glyph: '凡',
    rings: 1,
  },
  rare: {
    outer: '#4A5D4A',
    inner: '#A68C5B',
    dot: '#B23A2A',
    mark: '',
    glyph: '珍',
    rings: 2,
  },
  epic: {
    outer: '#A68C5B',
    inner: '#D4B87A',
    dot: '#B23A2A',
    mark: '',
    glyph: '灵',
    rings: 2,
  },
  legend: {
    outer: '#D4B87A',
    inner: '#A68C5B',
    dot: '#C4551B',
    mark: '',
    glyph: '绝',
    rings: 3,
  },
};

export function RarityBadge({ rarity, size = 28, className = '' }: Props) {
  const s = styleMap[rarity];
  if (rarity === 'starter') return null; // 起手卡不显示徽章

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={`pointer-events-none ${className}`}
      aria-label={`稀有度 ${rarity}`}
    >
      {/* 外环 */}
      <circle cx="16" cy="16" r="14" fill="none" stroke={s.outer} strokeWidth="1" opacity="0.9" />
      {/* 第二环 */}
      {s.rings >= 2 && (
        <circle cx="16" cy="16" r="11.5" fill="none" stroke={s.inner} strokeWidth="0.7" opacity="0.8" />
      )}
      {/* 第三环 */}
      {s.rings >= 3 && (
        <circle cx="16" cy="16" r="9" fill="none" stroke={s.outer} strokeWidth="0.5" opacity="0.6" strokeDasharray="1 1.4" />
      )}
      {/* 内填 · 玉石/鎏金面 */}
      <circle cx="16" cy="16" r="7.5" fill={s.inner} opacity="0.28" />
      {/* 中心符 */}
      <text
        x="16"
        y="20.5"
        fontSize="11"
        fontFamily='"Ma Shan Zheng", "STKaiti", serif'
        fill={s.dot}
        textAnchor="middle"
        fontWeight="600"
      >
        {s.glyph}
      </text>
    </svg>
  );
}
