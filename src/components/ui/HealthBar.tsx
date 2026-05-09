/**
 * 血量条 · 气血槽
 */

type Props = {
  current: number;
  max: number;
  /** block = 护甲（气·御），显示在血条上方 */
  block?: number;
  width?: number;
  label?: boolean;
};

export function HealthBar({ current, max, block = 0, width = 220, label = true }: Props) {
  const pct = Math.max(0, Math.min(1, current / max));
  return (
    <div className="flex flex-col gap-1 no-select" style={{ width }}>
      <div className="relative h-4 rounded-sm bg-ink-soft border border-ink overflow-hidden shadow-paper">
        {/* 底层血 */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-vermillion-dark to-vermillion transition-[width] duration-300"
          style={{ width: `${pct * 100}%` }}
        />
        {/* 纸纹 */}
        <div className="absolute inset-0 texture-paper opacity-40 pointer-events-none" />
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
}
