/**
 * 战斗浮动数字 · 伤害 / 治疗 / 护甲 / 中毒
 *
 * 规范（docs/ART_BIBLE.md）：
 *   "金色/青色古风字体，缓慢上浮淡出，不蹦大字、不花哨震屏"
 *
 * 使用：战斗系统算完结算后，在被打者/治疗者位置挂一个 <FloatingNumber />，
 *       1.4s 后自动消失（由 CSS animation 驱动）。
 *
 * 颜色：
 *   damage  暗朱 → 血色（自残/受伤）
 *   crit    朱砂 + 金边（暴击）
 *   heal    古青（回气血）
 *   block   鎏金（获得气·御）
 *   poison  暗绿（中毒持续）
 *   seal    朱砂 + "封"字（封印提示）
 */

type Kind = 'damage' | 'crit' | 'heal' | 'block' | 'poison' | 'seal';

type Props = {
  value: number | string;
  kind?: Kind;
  /** 前缀符号（默认无）：-/+/★ 等 */
  prefix?: string;
  /** 文字大小，默认 26px，暴击自动放大 */
  size?: number;
  /** 相对容器位置 (百分比)，默认居中 */
  offsetX?: number;
  offsetY?: number;
  className?: string;
};

type StyleSpec = {
  color: string;
  shadow: string;
  prefix: string;
  scale: number;
};

const specMap: Record<Kind, StyleSpec> = {
  damage: {
    color: '#D15040',
    shadow: '0 0 6px rgba(0,0,0,0.8), 0 1px 0 #4A0F08',
    prefix: '-',
    scale: 1,
  },
  crit: {
    color: '#E87722',
    shadow: '0 0 8px rgba(0,0,0,0.9), 0 0 14px rgba(224,138,72,0.6), 0 1px 0 #4A0F08',
    prefix: '-',
    scale: 1.35,
  },
  heal: {
    color: '#6B8A6B',
    shadow: '0 0 6px rgba(0,0,0,0.8), 0 1px 0 #1A2E1A',
    prefix: '+',
    scale: 1,
  },
  block: {
    color: '#D4B87A',
    shadow: '0 0 6px rgba(0,0,0,0.85), 0 1px 0 #4A3E24',
    prefix: '+',
    scale: 1,
  },
  poison: {
    color: '#4A6B4A',
    shadow: '0 0 6px rgba(0,0,0,0.8), 0 0 10px rgba(74,107,74,0.5)',
    prefix: '',
    scale: 0.9,
  },
  seal: {
    color: '#C9B890',
    shadow: '0 0 8px rgba(0,0,0,0.9), 0 0 12px rgba(178,58,42,0.5)',
    prefix: '',
    scale: 1.1,
  },
};

export function FloatingNumber({
  value,
  kind = 'damage',
  prefix,
  size = 26,
  offsetX = 50,
  offsetY = 50,
  className = '',
}: Props) {
  const spec = specMap[kind];
  const shownPrefix = prefix ?? spec.prefix;

  return (
    <span
      className={`absolute pointer-events-none select-none anim-number-float ${className}`}
      style={{
        left: `${offsetX}%`,
        top: `${offsetY}%`,
        transform: 'translate(-50%, -50%)',
        fontFamily: 'var(--font-numeric)',
        fontWeight: 700,
        fontSize: size * spec.scale,
        color: spec.color,
        textShadow: spec.shadow,
        letterSpacing: '0.02em',
        zIndex: 30,
        whiteSpace: 'nowrap',
      }}
      aria-live="polite"
    >
      {shownPrefix}
      {value}
    </span>
  );
}
