/**
 * 阴阳能量条 · v0.5
 * 左侧阴（蓝）、右侧阳（金），中间显示太极归一按钮
 */

import { memo } from 'react';
import type { BattleState } from '../../types';

type Props = {
  state: BattleState;
  onTaiji?: () => void;
};

export const YinYangBar = memo(function YinYangBar({ state, onTaiji }: Props) {
  const yin = state.yinEnergy ?? 0;
  const yinMax = state.yinEnergyMax ?? 0;
  const yang = state.yangEnergy ?? 0;
  const yangMax = state.yangEnergyMax ?? 0;
  const taijiReady = state.taijiReady ?? false;

  return (
    <div className="flex items-center justify-center gap-2">
      {/* 阴能量 */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[9px] text-[#6B8CAE] font-heading tracking-widest">阴</span>
        <div className="relative w-6 h-14 rounded-full overflow-hidden border border-[#6B8CAE]/40"
          style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#3A5F7C] to-[#6B8CAE] transition-all"
            style={{ height: `${Math.max(2, (yin / yinMax) * 100)}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-numeric text-[#B8D4E8] font-bold">
            {yin}
          </span>
        </div>
      </div>

      {/* 太极归一按钮 */}
      <button
        onClick={onTaiji}
        disabled={!taijiReady}
        className={[
          'relative w-10 h-10 rounded-full flex items-center justify-center transition-all',
          taijiReady
            ? 'bg-gradient-to-br from-[#2A2A2A] to-[#0F0E0C] border border-[#D4A843]/60 shadow-[0_0_12px_rgba(212,168,67,0.4)] cursor-pointer hover:scale-105'
            : 'bg-[#1A1A18] border border-[#4A4A48]/30 opacity-40 cursor-not-allowed',
        ].join(' ')}
        title={taijiReady ? '太极归一 · 点击释放' : '太极归一 · 需阴阳平衡归零'}
      >
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <circle cx="20" cy="20" r="16" fill="none" stroke={taijiReady ? '#D4A843' : '#4A4A48'} strokeWidth="1.5" />
          <path
            d="M20 8 A12 12 0 0 1 20 32 A12 12 0 0 1 20 8Z"
            fill={taijiReady ? '#6B8CAE' : '#3A3A38'}
          />
          <path
            d="M20 32 A12 12 0 0 1 20 8 A12 12 0 0 1 20 32Z"
            fill={taijiReady ? '#D4A843' : '#4A4A48'}
          />
          <circle cx="17" cy="16" r="2" fill={taijiReady ? '#D4A843' : '#4A4A48'} />
          <circle cx="23" cy="24" r="2" fill={taijiReady ? '#6B8CAE' : '#3A3A38'} />
        </svg>
      </button>

      {/* 阳能量 */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[9px] text-[#D4A843] font-heading tracking-widest">阳</span>
        <div className="relative w-6 h-14 rounded-full overflow-hidden border border-[#D4A843]/40"
          style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#8A6A20] to-[#D4A843] transition-all"
            style={{ height: `${Math.max(2, (yang / yangMax) * 100)}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-numeric text-[#F5E8C8] font-bold">
            {yang}
          </span>
        </div>
      </div>
    </div>
  );
});