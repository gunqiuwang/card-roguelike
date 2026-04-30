import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

export function GameOver() {
  const phase = useGameStore(state => state.phase);
  const dispatch = useGameStore(state => state.dispatch);
  const player = useGameStore(state => state.player);

  const handleRestart = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, [dispatch]);

  if (phase !== 'victory' && phase !== 'defeat') return null;

  const isVictory = phase === 'victory';

  return (
    <div
      className="
        fixed inset-0
        flex items-center justify-center
        z-50
      "
      style={{
        background: 'radial-gradient(ellipse at center, rgba(245, 237, 224, 0.95) 0%, rgba(232, 223, 208, 0.98) 100%)',
      }}
    >
      {/* 装饰光晕 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isVictory
            ? 'radial-gradient(ellipse at center, rgba(201, 162, 39, 0.15) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at center, rgba(196, 72, 62, 0.15) 0%, transparent 60%)',
        }}
      />

      {/* 结果卡片 */}
      <div
        className="
          flex flex-col items-center
          p-8 md:p-10
          rounded-xl
          animate-fade-in
          max-w-sm w-full mx-4
        "
        style={{
          background: 'linear-gradient(180deg, rgba(253, 248, 240, 0.98) 0%, rgba(232, 223, 208, 0.98) 100%)',
          border: `4px solid ${isVictory ? '#C9A227' : '#C4483E'}`,
          boxShadow: isVictory
            ? '0 0 60px rgba(201, 162, 39, 0.3), 0 8px 40px rgba(0,0,0,0.15)'
            : '0 0 60px rgba(196, 72, 62, 0.3), 0 8px 40px rgba(0,0,0,0.15)',
        }}
      >
        {/* 结果图标 */}
        <div
          className="text-7xl mb-4"
          style={{
            filter: isVictory
              ? 'drop-shadow(0 0 15px rgba(201, 162, 39, 0.5))'
              : 'drop-shadow(0 0 15px rgba(196, 72, 62, 0.5))',
          }}
        >
          {isVictory ? '🏆' : '💀'}
        </div>

        {/* 标题 */}
        <div
          className="
            px-8 py-3
            rounded-full
            mb-4
          "
          style={{
            background: isVictory
              ? 'linear-gradient(135deg, rgba(201, 162, 39, 0.3) 0%, rgba(201, 162, 39, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(196, 72, 62, 0.3) 0%, rgba(196, 72, 62, 0.1) 100%)',
            border: `2px solid ${isVictory ? '#C9A227' : '#C4483E'}`,
          }}
        >
          <span
            className="text-3xl font-bold"
            style={{
              fontFamily: 'Georgia, serif',
              color: isVictory ? '#C9A227' : '#C4483E',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            {isVictory ? '大获全胜' : '败北'}
          </span>
        </div>

        {/* 统计摘要 */}
        <div
          className="
            w-full
            grid grid-cols-2 gap-3
            mb-6 p-4
            rounded-lg
          "
          style={{
            background: 'rgba(212, 196, 168, 0.5)',
            border: '1px solid #B8A88C',
          }}
        >
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: '#4A4541' }}>
              {player.deck.length}
            </div>
            <div className="text-xs" style={{ color: '#7A746D' }}>
              符箓数
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: '#C45C4A' }}>
              {player.hp}
            </div>
            <div className="text-xs" style={{ color: '#7A746D' }}>
              剩余生命
            </div>
          </div>
        </div>

        {/* 描述 */}
        <div
          className="text-center mb-6"
          style={{ color: '#4A4541', fontFamily: 'Georgia, serif' }}
        >
          {isVictory
            ? '妖魔伏诛，山海太平'
            : '妖物反噬，符箓散尽'}
        </div>

        {/* 重新开始按钮 */}
        <button
          onClick={handleRestart}
          className="
            min-h-[52px] min-w-[180px]
            px-8 py-3
            rounded-lg
            font-bold text-base
            transition-all duration-300
            active:scale-95
          "
          style={{
            background: isVictory
              ? 'linear-gradient(180deg, #C9A227 0%, #A88B20 100%)'
              : 'linear-gradient(180deg, #C4483E 0%, #8B3029 100%)',
            border: `2px solid ${isVictory ? '#C9A227' : '#C4483E'}`,
            color: '#FDF8F0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            fontFamily: 'Georgia, serif',
            textShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ⚔️ 再战山海
        </button>
      </div>
    </div>
  );
}