/**
 * 四角极简云纹 · 对应 docs/ART_BIBLE.md §卡面
 *
 * 放在卡片/面板四角作为点缀。不繁复，只是一条卷云+一小珠。
 * 参考百闻牌的"角花"风格：视觉密度低、在金线基础上轻点缀。
 */

type Corner = 'tl' | 'tr' | 'bl' | 'br';

type Props = {
  corner: Corner;
  /** 云纹颜色，默认鎏金 */
  color?: string;
  /** 大小（px），默认 18 */
  size?: number;
  /** 不透明度，默认 0.75 */
  opacity?: number;
  className?: string;
};

/** 云纹 path（单一"如意卷云"造型，配一颗露珠） */
const CLOUD_PATH =
  'M 2 14 Q 2 8 8 8 Q 8 4 13 4 Q 18 4 18 9 Q 22 9 22 13 L 22 14';
const DOT_CX = 6;
const DOT_CY = 11;

const transformMap: Record<Corner, string> = {
  tl: 'matrix(1 0 0 1 0 0)',     // 左上 · 原样
  tr: 'matrix(-1 0 0 1 24 0)',   // 右上 · 水平翻
  bl: 'matrix(1 0 0 -1 0 24)',   // 左下 · 垂直翻
  br: 'matrix(-1 0 0 -1 24 24)', // 右下 · 双翻
};

export function CornerFlourish({
  corner,
  color = '#D4B87A',
  size = 18,
  opacity = 0.75,
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
      <g transform={transformMap[corner]} fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" opacity={opacity}>
        <path d={CLOUD_PATH} />
        <circle cx={DOT_CX} cy={DOT_CY} r="0.8" fill={color} stroke="none" />
      </g>
    </svg>
  );
}
