/**
 * 四角暗纹 · 对应 docs/ART_BIBLE.md
 *
 * 两种 variant：
 *   cloud  如意卷云 + 露珠（轻盈，面板/对话框用）
 *   relic  山海器物暗纹：回纹 + 云雷折线（沉重，卡牌卡角用，默认）
 *
 * 原则：不繁复。opacity ≤ 0.35。只在凑近看时可见。
 */

type Corner = 'tl' | 'tr' | 'bl' | 'br';
type Variant = 'relic' | 'cloud';

type Props = {
  corner: Corner;
  /** 主色（默认按稀有度主题传入） */
  color?: string;
  /** 大小（px），默认 20 */
  size?: number;
  /** 不透明度，默认 0.3 */
  opacity?: number;
  /** 风格 · relic=山海暗纹（默认卡牌用），cloud=如意卷云（面板用） */
  variant?: Variant;
  className?: string;
};

// ──────────────────────────────────────────────────────────────────────
// 路径定义（viewBox 24×24；corner 通过 transform 翻转复用）
// ──────────────────────────────────────────────────────────────────────

/** 如意卷云（原版）—— 轻盈场景用 */
const CLOUD_PATH =
  'M 2 14 Q 2 8 8 8 Q 8 4 13 4 Q 18 4 18 9 Q 22 9 22 13 L 22 14';
const CLOUD_DOT = { cx: 6, cy: 11 };

/**
 * 山海器物暗纹：
 *   · 外缘一段边线
 *   · 回纹（商周青铜器"回"字形折线）
 *   · 内侧一粒小方块（铜器乳钉元素）
 */
const RELIC_BORDER = 'M 0 14 L 0 0 L 14 0';
const RELIC_HUI =
  // 回纹（左上开口向内的方形卷）
  'M 3 10 L 3 3 L 10 3 L 10 7 L 6 7 L 6 5 L 8 5';
const RELIC_NUB = { x: 1.5, y: 12.5, w: 1.6, h: 1.6 };

const transformMap: Record<Corner, string> = {
  tl: 'matrix(1 0 0 1 0 0)',
  tr: 'matrix(-1 0 0 1 24 0)',
  bl: 'matrix(1 0 0 -1 0 24)',
  br: 'matrix(-1 0 0 -1 24 24)',
};

export function CornerFlourish({
  corner,
  color = '#A68C5B',
  size = 20,
  opacity = 0.3,
  variant = 'relic',
  className = '',
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`pointer-events-none ${className}`}
      aria-hidden
    >
      <g
        transform={transformMap[corner]}
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="square"
        strokeLinejoin="miter"
        opacity={opacity}
      >
        {variant === 'cloud' ? (
          <>
            <path d={CLOUD_PATH} strokeLinecap="round" />
            <circle cx={CLOUD_DOT.cx} cy={CLOUD_DOT.cy} r="0.8" fill={color} stroke="none" />
          </>
        ) : (
          <>
            {/* 外缘边（雕刻槽） */}
            <path d={RELIC_BORDER} strokeWidth="0.8" opacity="0.9" />
            {/* 回纹 */}
            <path d={RELIC_HUI} strokeWidth="0.7" />
            {/* 乳钉 */}
            <rect
              x={RELIC_NUB.x}
              y={RELIC_NUB.y}
              width={RELIC_NUB.w}
              height={RELIC_NUB.h}
              fill={color}
              stroke="none"
              opacity="0.7"
            />
          </>
        )}
      </g>
    </svg>
  );
}
