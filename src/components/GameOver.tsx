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
        background: 'radial-gradient(ellipse at center, rgba(26, 17, 40, 0.95) 0%, rgba(13, 9, 21, 0.98) 100%)',
      }}
    >
      {/* Decorative background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isVictory
            ? 'radial-gradient(ellipse at center, rgba(212, 134, 61, 0.15) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at center, rgba(155, 45, 90, 0.15) 0%, transparent 60%)',
        }}
      />

      {/* Main content card */}
      <div
        className="
          flex flex-col items-center
          p-8 md:p-10
          rounded-3xl
          animate-fade-in
          max-w-sm w-full mx-4
        "
        style={{
          background: 'linear-gradient(180deg, rgba(45, 31, 66, 0.98) 0%, rgba(26, 17, 40, 0.99) 100%)',
          border: `3px solid ${isVictory ? '#D4863D' : '#9B2D5A'}`,
          boxShadow: isVictory
            ? '0 0 80px rgba(212, 134, 61, 0.4), 0 0 160px rgba(212, 134, 61, 0.1)'
            : '0 0 80px rgba(155, 45, 90, 0.4), 0 0 160px rgba(155, 45, 90, 0.1)',
        }}
      >
        {/* Result icon - Large and dramatic */}
        <div
          className="text-7xl mb-4"
          style={{
            filter: 'drop-shadow(0 0 20px rgba(212, 134, 61, 0.5))',
          }}
        >
          {isVictory ? '🏆' : '💀'}
        </div>

        {/* Title - Castle banner style */}
        <div
          className="
            px-8 py-3
            rounded-full
            mb-4
          "
          style={{
            background: isVictory
              ? 'linear-gradient(135deg, rgba(212, 134, 61, 0.3) 0%, rgba(166, 106, 46, 0.2) 100%)'
              : 'linear-gradient(135deg, rgba(155, 45, 90, 0.3) 0%, rgba(107, 30, 61, 0.2) 100%)',
            border: `2px solid ${isVictory ? '#D4863D' : '#9B2D5A'}`,
          }}
        >
          <span
            className="text-3xl font-bold"
            style={{
              fontFamily: 'Georgia, serif',
              color: isVictory ? '#E9B872' : '#C4456E',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {isVictory ? '胜利!' : '失败'}
          </span>
        </div>

        {/* Stats summary */}
        <div
          className="
            w-full
            grid grid-cols-2 gap-3
            mb-6 p-4
            rounded-xl
          "
          style={{
            background: 'rgba(30, 20, 46, 0.8)',
            border: '1px solid #3D2A55',
          }}
        >
          <div className="text-center">
            <div
              className="text-lg font-bold"
              style={{ color: '#E9B872' }}
            >
              {player.deck.length}
            </div>
            <div
              className="text-xs"
              style={{ color: '#8B7355' }}
            >
              卡牌数
            </div>
          </div>
          <div className="text-center">
            <div
              className="text-lg font-bold"
              style={{ color: '#E74C3C' }}
            >
              {player.hp}
            </div>
            <div
              className="text-xs"
              style={{ color: '#8B7355' }}
            >
              剩余HP
            </div>
          </div>
        </div>

        {/* Description */}
        <div
          className="text-center mb-6"
          style={{ color: '#A89B8C', fontFamily: 'Georgia, serif' }}
        >
          {isVictory
            ? '魔王被你击败了!'
            : '你倒在了魔王城堡...'}
        </div>

        {/* Restart Button - Castle gate style */}
        <button
          onClick={handleRestart}
          className="
            min-h-[52px] min-w-[180px]
            px-8 py-3
            rounded-xl
            font-bold text-base
            transition-all duration-300
            active:scale-95
          "
          style={{
            background: isVictory
              ? 'linear-gradient(180deg, #D4863D 0%, #A66A2E 100%)'
              : 'linear-gradient(180deg, #9B2D5A 0%, #6B1E3D 100%)',
            border: `2px solid ${isVictory ? '#E9B872' : '#C4456E'}`,
            color: '#F5E6D3',
            boxShadow: isVictory
              ? '0 4px 20px rgba(212, 134, 61, 0.4)'
              : '0 4px 20px rgba(155, 45, 90, 0.4)',
            fontFamily: 'Georgia, serif',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ⚔️ 再次挑战
        </button>
      </div>
    </div>
  );
}