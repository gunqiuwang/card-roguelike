/**
 * 按钮 · 对应 docs/ART_BIBLE.md
 *
 * 规范：
 *   · 鎏金边亮线（hover 亮起）
 *   · 淡水墨波纹扩散（active 按压反馈）
 *   · 轻微上浮 + 阴影加深
 *   · 四种变体：primary/secondary/ghost/danger
 *
 * 鎏金边 + 波纹由 CSS `.btn-gold-glow` 提供（index.css）
 */

import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  className?: string;
};

const variantClass: Record<Variant, string> = {
  // 主按钮 · 朱砂底 + 鎏金边亮线（CTA）
  primary:
    'bg-vermillion text-parchment-light hover:bg-vermillion-light border border-bone/70 shadow-card',
  // 次按钮 · 墨底 + 鎏金边
  secondary:
    'bg-ink-soft text-parchment border border-bone/50 hover:border-bone shadow-paper',
  // 幽影按钮（跳过、取消）
  ghost:
    'bg-transparent text-parchment/80 border border-mist/40 hover:text-parchment hover:border-mist',
  // 危险/斩（只有斩妖那种"舍弃奖励"场景用）
  danger:
    'bg-ink text-vermillion-light border border-vermillion/70 hover:border-vermillion',
};

const sizeClass: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'btn-gold-glow font-heading tracking-widest rounded-sm no-select',
        'transition-all duration-200 ease-snap',
        'hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]',
        variantClass[variant],
        sizeClass[size],
        className,
      ].join(' ')}
    >
      {/* 按钮内部文字 & 子内容 */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}
