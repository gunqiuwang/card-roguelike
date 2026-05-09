/**
 * 墨影剪影 · 无立绘时的 fallback
 *
 * 原则：用纯 SVG 画一个粗粝的墨水剪影 + 符纸底 + 朱砂点缀。
 * 风格锚定在 docs/ART_BIBLE.md §七。
 */

import type { SilhouetteKind } from '../../types';

type Props = {
  kind: SilhouetteKind;
  className?: string;
  /** 是否显示符咒红印（标记稀有/封印） */
  withSeal?: boolean;
};

/** 每种剪影的极简 path 数据 */
const shapes: Record<SilhouetteKind, string> = {
  // 狐：三角耳 + 尖脸 + 一条尾
  fox: 'M 60 30 L 50 10 L 60 20 L 80 10 L 90 20 L 100 10 L 90 35 Q 110 55 95 80 Q 120 70 125 100 L 115 105 Q 90 105 70 95 Q 55 110 35 95 Q 45 75 55 60 Q 45 45 60 30 Z',
  // 蛇：S 形蜿蜒
  serpent: 'M 40 20 Q 100 40 80 80 Q 30 100 60 140 Q 110 150 80 170 Q 30 160 50 180 L 130 180 Q 100 140 130 110 Q 90 80 130 40 Q 90 10 40 20 Z',
  // 兽：四足蹲姿
  beast: 'M 50 80 Q 40 60 60 45 Q 75 30 100 40 Q 125 30 140 45 Q 160 60 150 80 Q 170 100 160 140 L 150 150 L 140 130 L 120 140 L 100 130 L 80 140 L 60 130 L 50 150 L 40 140 Q 30 100 50 80 Z',
  // 鸟：展翅
  bird: 'M 100 50 L 90 35 L 100 20 L 110 35 Z M 100 50 Q 40 60 20 100 Q 60 85 100 90 Q 140 85 180 100 Q 160 60 100 50 Z M 100 90 Q 95 140 100 160 Q 105 140 100 90 Z',
  // 鱼：鱼形
  fish: 'M 30 100 L 50 80 L 55 85 Q 90 70 140 95 L 170 75 L 165 100 L 170 125 L 140 105 Q 90 130 55 115 L 50 120 Z M 60 95 a 5 5 0 1 0 1 0',
  // 人形：披袍站姿
  humanoid: 'M 100 25 Q 115 25 115 45 Q 115 60 100 65 Q 85 60 85 45 Q 85 25 100 25 Z M 75 70 L 125 70 L 140 120 L 135 170 L 110 170 L 105 130 L 95 130 L 90 170 L 65 170 L 60 120 Z',
  // 符咒：方形带印
  talisman: 'M 50 30 L 150 30 L 150 180 L 100 190 L 50 180 Z',
  // 法器：八卦镜
  relic: 'M 100 30 A 70 70 0 1 1 99.99 30 Z M 100 50 A 50 50 0 1 1 99.99 50 Z',
  // 主角：方士（披袍、手持符）
  hero: 'M 100 20 Q 118 20 118 40 Q 118 58 100 62 Q 82 58 82 40 Q 82 20 100 20 Z M 70 68 L 130 68 L 148 130 L 155 185 L 120 185 L 114 135 L 100 135 L 95 140 L 90 185 L 55 185 L 52 130 Z M 55 95 L 40 115 L 45 122 L 60 102 Z M 145 95 L 160 115 L 155 122 L 140 102 Z',
};

export function InkSilhouette({ kind, className = '', withSeal = false }: Props) {
  const path = shapes[kind];
  const uid = `silhouette-${kind}`;

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`墨影剪影 · ${kind}`}
    >
      <defs>
        {/* 纸质底色 + 污渍 */}
        <filter id={`${uid}-paper`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" seed="7" />
          <feColorMatrix values="0 0 0 0 0.1 0 0 0 0 0.09 0 0 0 0 0.08 0 0 0 0.12 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>

        {/* 墨晕（让剪影边缘不那么硬） */}
        <filter id={`${uid}-ink`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.8" />
        </filter>

        {/* 符纸渐变 */}
        <radialGradient id={`${uid}-bg`} cx="50%" cy="50%" r="75%">
          <stop offset="0%" stopColor="#C9B890" />
          <stop offset="70%" stopColor="#9D8F6F" />
          <stop offset="100%" stopColor="#7A6D4F" />
        </radialGradient>
      </defs>

      {/* 背景层（符纸质感） */}
      <rect width="200" height="200" fill={`url(#${uid}-bg)`} />
      <rect width="200" height="200" filter={`url(#${uid}-paper)`} opacity="0.6" />

      {/* 四角折痕（增加年代感） */}
      <path d="M 0 0 L 20 0 L 15 15 L 0 20 Z" fill="#0F0E0C" opacity="0.15" />
      <path d="M 200 0 L 180 0 L 185 15 L 200 20 Z" fill="#0F0E0C" opacity="0.15" />
      <path d="M 0 200 L 20 200 L 15 185 L 0 180 Z" fill="#0F0E0C" opacity="0.15" />
      <path d="M 200 200 L 180 200 L 185 185 L 200 180 Z" fill="#0F0E0C" opacity="0.15" />

      {/* 主剪影 */}
      <g filter={`url(#${uid}-ink)`}>
        <path d={path} fill="#0F0E0C" opacity="0.88" />
      </g>

      {/* 朱砂印章（可选） */}
      {withSeal && (
        <g transform="translate(150, 150)">
          <rect
            x="0"
            y="0"
            width="32"
            height="32"
            fill="#B23A2A"
            opacity="0.85"
            transform="rotate(-6)"
            rx="2"
          />
          <text
            x="16"
            y="22"
            fill="#C9B890"
            fontSize="16"
            fontFamily='"Ma Shan Zheng", serif'
            textAnchor="middle"
            transform="rotate(-6, 16, 16)"
          >
            封
          </text>
        </g>
      )}
    </svg>
  );
}
