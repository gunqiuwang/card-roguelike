/**
 * 血量条 · 气血槽
 */

import { memo } from 'react';

type Props = {
  current: number;
  max: number;
  /** block = 护甲（气·御），显示在血条上方 */
  block?: number;
  width?: number;
  label?: boolean;
};

export const HealthBar = memo(function HealthBar({ current, max, block = 0, width, label = true }: Props) {
  const pct = Math.max(0, Math.min(1, current / max));
  const style: React.CSSProperties =
    width !== undefined ? { width } : { width: '100%' };

  // 血量颜色：正常→预警→危险
  const barColor = pct > 0.5
    ? 'from-vermillion-dark to-vermillion'
    : pct > 0.25
      ? 'from-ember-dark to-ember'
      : 'from-[#8B1A1A] to-vermillion-dark';

  // 低血量时背景脉动
  const isLow = pct <= 0.25;

  return (
    <div className="flex flex-col gap-1 no-select" style={style}>
      <div
        className={[
          'relative h-3 sm:h-4 rounded-sm bg-ink-soft border border-ink overflow-hidden shadow-paper',
          isLow ? 'animate-pulse' : '',
        ].join(' ')}
        style={{ boxShadow: isLow ? '0 0 8px rgba(139,26,26,0.4)' : undefined }}
      >
        {/* 底层血（渐变） */}
        <div
          className={[
            'absolute inset-y-0 left-0 bg-gradient-to-r transition-[width] duration-300',
            barColor,
          ].join(' ')}
          style={{ width: `${pct * 100}%` }}
        />
        {/* 血量纹理 */}
        <div className="absolute inset-0 texture-paper opacity-30 pointer-events-none" />
        {/* 数字 */}
        {label && (
          <div
            className="absolute inset-0 flex items-center justify-center text-[11px] font-numeric text-parchment-light drop-shadow-[0_1px_0_rgba(0,0,0,0.9)]"
          >
            {current} / {max}
          </div>
        )}
      </div>
      {block > 0 && (
        <div className="flex items-center gap-1 text-[11px] text-jade">
          <span className="inline-block w-3 h-3 rounded-sm bg-jade/60 border border-jade" />
          <span className="font-numeric">气·御 {block}</span>
        </div>
      )}
    </div>
  );
});
