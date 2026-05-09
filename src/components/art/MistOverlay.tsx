/**
 * 全局云雾 / 月光光斑漂移层
 *
 * 规范：docs/ART_BIBLE.md §八
 *   "永远有慢速云雾、月光光斑漂移，低强度、不干扰"
 *
 * 使用：在页面根容器顶部放一次，fixed 到 viewport，pointer-events-none。
 *   <MistOverlay />
 *
 * 强度可调：intensity 0.5（含蓄） / 1（默认） / 1.5（舞台/剧情页）
 */

type Props = {
  intensity?: number;
  /** 是否显示月光光斑（true 默认；战斗页可能想关） */
  withMoonSpot?: boolean;
  className?: string;
};

export function MistOverlay({
  intensity = 1,
  withMoonSpot = true,
  className = '',
}: Props) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[1] overflow-hidden ${className}`}
      aria-hidden
      style={{ opacity: intensity }}
    >
      {/* 雾层 1：低速大块云 */}
      <div
        className="absolute anim-mist-drift"
        style={{
          left: '-10%',
          top: '-8%',
          width: '60%',
          height: '45%',
          background:
            'radial-gradient(ellipse at center, rgba(201,184,144,0.08) 0%, transparent 65%)',
          filter: 'blur(24px)',
        }}
      />
      {/* 雾层 2：下方反向漂 */}
      <div
        className="absolute anim-mist-drift"
        style={{
          right: '-12%',
          bottom: '-10%',
          width: '65%',
          height: '50%',
          background:
            'radial-gradient(ellipse at center, rgba(107,98,89,0.1) 0%, transparent 65%)',
          filter: 'blur(28px)',
          animationDirection: 'reverse',
          animationDuration: '26s',
        }}
      />
      {/* 雾层 3：淡淡的墨晕 */}
      <div
        className="absolute anim-mist-drift"
        style={{
          left: '20%',
          top: '35%',
          width: '45%',
          height: '40%',
          background:
            'radial-gradient(ellipse at center, rgba(15,14,12,0.12) 0%, transparent 70%)',
          filter: 'blur(32px)',
          animationDuration: '30s',
          animationDelay: '-10s',
        }}
      />

      {/* 月光光斑（可关） */}
      {withMoonSpot && (
        <div
          className="absolute anim-moon-spot"
          style={{
            right: '12%',
            top: '8%',
            width: '28%',
            height: '28%',
            background:
              'radial-gradient(circle at center, rgba(224,210,171,0.14) 0%, rgba(224,210,171,0.04) 40%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
      )}
    </div>
  );
}
