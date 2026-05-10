/**
 * 能量（气）水晶 · 符火造型
 */

import { memo } from 'react';

type Props = {
  current: number;
  max: number;
  size?: number;
};

export const EnergyOrb = memo(function EnergyOrb({ current, max, size = 64 }: Props) {
  return (
    <div
      className="relative no-select"
      style={{ width: size, height: size }}
      aria-label={`能量 ${current}/${max}`}
    >
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <defs>
          <radialGradient id="ember-core" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#E08A48" />
            <stop offset="55%" stopColor="#C4551B" />
            <stop offset="100%" stopColor="#6B2410" />
          </radialGradient>
          <radialGradient id="ember-out" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="rgba(196,85,27,0)" />
            <stop offset="100%" stopColor="rgba(196,85,27,0.35)" />
          </radialGradient>
        </defs>
        {/* 外辉光 */}
        <circle cx="32" cy="32" r="30" fill="url(#ember-out)" />
        {/* 主体 */}
        <circle
          cx="32"
          cy="32"
          r="22"
          fill="url(#ember-core)"
          stroke="#0F0E0C"
          strokeWidth="2"
        />
        {/* 高光 */}
        <ellipse cx="27" cy="25" rx="5" ry="3" fill="#E8B77C" opacity="0.55" />
      </svg>
      {/* 数字 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-numeric font-bold text-parchment-light leading-none drop-shadow-[0_2px_0_rgba(0,0,0,0.8)]"
          style={{ fontSize: size * 0.42 }}
        >
          {current}
        </span>
        <span
          className="font-numeric text-parchment/60 leading-none"
          style={{ fontSize: size * 0.18, marginTop: 2 }}
        >
          / {max}
        </span>
      </div>
    </div>
  );
});
