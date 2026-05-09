/**
 * 稀有度徽章 · 小而雅，右下角一粒章子
 *
 * 设计原则：角落小徽章，不靠大闪光大特效。
 * 颜色从 rarityTheme 派生（R 暗岩铜 / SR 青纹古铜 / SSR 哑光金 / SP 苍玉玄）。
 *
 * 四档环数递增：
 *   R    单环
 *   SR   双环 + 红点
 *   SSR  双环 + 红点 + 内填色块
 *   SP   三环（含虚线）+ 红点 + 内填色块
 */

import { rarityTheme } from '../../config/visual';
import type { CardRarity } from '../../types';

type Props = {
  rarity: CardRarity;
  /** 徽章直径（px） */
  size?: number;
  className?: string;
};

type Shape = {
  rings: 0 | 1 | 2 | 3;
  withDot: boolean;
  dashed: boolean;
};

const shapeMap: Record<CardRarity, Shape> = {
  starter: { rings: 0, withDot: false, dashed: false },
  common: { rings: 1, withDot: false, dashed: false }, // R
  rare: { rings: 2, withDot: true, dashed: false }, //   SR
  epic: { rings: 2, withDot: true, dashed: false }, //   SSR
  legend: { rings: 3, withDot: true, dashed: true }, //  SP
};

const labelMap: Record<CardRarity, string> = {
  starter: '',
  common: '凡',
  rare: '珍',
  epic: '灵',
  legend: '绝',
};

export function RarityBadge({ rarity, size = 28, className = '' }: Props) {
  if (rarity === 'starter') return null;

  const shape = shapeMap[rarity];
  const theme = rarityTheme[rarity];
  const fillTint = rarity === 'epic' || rarity === 'legend' ? 0.18 : 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={`pointer-events-none ${className}`}
      aria-label={`稀有度 ${theme.label}`}
    >
      {/* 外环 */}
      <circle
        cx="16"
        cy="16"
        r="14"
        fill="none"
        stroke={theme.badgeRing}
        strokeWidth="1"
        opacity="0.95"
      />
      {/* 第二环 */}
      {shape.rings >= 2 && (
        <circle
          cx="16"
          cy="16"
          r="11.5"
          fill="none"
          stroke={theme.badgeRing}
          strokeWidth="0.7"
          opacity="0.8"
        />
      )}
      {/* 第三环 · SP 独享虚线 */}
      {shape.rings >= 3 && (
        <circle
          cx="16"
          cy="16"
          r="9"
          fill="none"
          stroke={theme.badgeRing}
          strokeWidth="0.5"
          opacity="0.65"
          strokeDasharray={shape.dashed ? '1.2 1.4' : undefined}
        />
      )}
      {/* 内填玉石/金属面（SSR/SP 显色更明显） */}
      {fillTint > 0 && (
        <circle cx="16" cy="16" r="7.5" fill={theme.badgeRing} opacity={fillTint} />
      )}
      {/* 中心字 · 凡/珍/灵/绝 */}
      <text
        x="16"
        y="20.5"
        fontSize="11"
        fontFamily='"Ma Shan Zheng", "STKaiti", serif'
        fill={theme.badgeText}
        textAnchor="middle"
        fontWeight="600"
      >
        {labelMap[rarity]}
      </text>
      {/* 红点（SR 及以上） · 放右下角 */}
      {shape.withDot && (
        <circle cx="24.5" cy="23" r="1.3" fill="#8B2A1E" opacity="0.85" />
      )}
    </svg>
  );
}
