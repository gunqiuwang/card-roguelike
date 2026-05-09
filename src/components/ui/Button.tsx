/**
 * 按钮（主/次/危险）· 对应 docs/ART_BIBLE.md
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
  primary:
    'bg-vermillion text-parchment-light hover:bg-vermillion-light border-2 border-ink/40 shadow-card',
  secondary:
    'bg-ink-soft text-parchment border-2 border-bone/40 hover:border-bone shadow-paper',
  ghost:
    'bg-transparent text-parchment/80 border border-mist/40 hover:text-parchment hover:border-mist',
  danger:
    'bg-ink text-vermillion border-2 border-vermillion/60 hover:border-vermillion',
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
        'font-heading tracking-widest rounded no-select',
        'transition-all duration-150 ease-snap',
        'active:scale-95',
        variantClass[variant],
        sizeClass[size],
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}
