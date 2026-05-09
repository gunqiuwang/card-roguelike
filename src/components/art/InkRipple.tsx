/**
 * 水墨波纹 · 按钮按压反馈 / 卡牌选中扩散
 *
 * 用 CSS 伪元素也行，但抽成组件便于复用 + 动画时间统一。
 * 外部触发：给父元素加类 `group-active:ink-ripple-play` 即可。
 *
 * 本组件默认是"常驻、静止"的装饰波纹（很淡），
 * 真正"点击扩散"走 CSS `@keyframes inkRipple`（详见 index.css）。
 */

type Props = {
  /** 相对父的圆心 (0-1, 0-1) */
  cx?: number;
  cy?: number;
  /** 颜色（建议鎏金或水墨） */
  color?: string;
  className?: string;
};

export function InkRipple({
  cx = 0.5,
  cy = 0.5,
  color = 'rgba(212, 184, 122, 0.35)',
  className = '',
}: Props) {
  return (
    <span
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <span
        className="absolute rounded-full ink-ripple-dot"
        style={{
          left: `${cx * 100}%`,
          top: `${cy * 100}%`,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
      />
    </span>
  );
}
