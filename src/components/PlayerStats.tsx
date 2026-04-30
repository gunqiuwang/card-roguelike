import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

export function PlayerStats() {
  const player = useGameStore(state => state.player);
  const isPlayerTurn = useGameStore(state => state.isPlayerTurn);
  const turn = useGameStore(state => state.turn);
  const dispatch = useGameStore(state => state.dispatch);

  const hpPercent = (player.hp / player.maxHp) * 100;

  const handleEndTurn = useCallback(() => {
    if (isPlayerTurn) {
      dispatch({ type: 'END_TURN' });
      setTimeout(() => {
        dispatch({ type: 'START_TURN' });
      }, 100);
    }
  }, [isPlayerTurn, dispatch]);

  return (
    <div className="w-full py-2">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-2">
        {/* Turn Info */}
        <div className="text-white/70 text-sm font-medium">
          回合 {turn}
        </div>

        {/* Energy */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: player.maxEnergy }).map((_, i) => (
            <div
              key={i}
              className={`
                w-6 h-6 rounded-full
                ${i < player.energy
                  ? 'bg-yellow-400 border-2 border-yellow-300'
                  : 'bg-gray-700 border-2 border-gray-600'
                }
                flex items-center justify-center
                text-xs font-bold
              `}
            >
              ⚡
            </div>
          ))}
        </div>

        {/* Gold */}
        <div className="flex items-center gap-1 text-yellow-400">
          <span>💰</span>
          <span className="text-sm font-medium">{player.gold}</span>
        </div>
      </div>

      {/* HP Bar */}
      <div className="mt-2 px-2">
        <div className="flex justify-between text-xs text-white/80 mb-1">
          <span>❤️ HP</span>
          <span>{player.hp} / {player.maxHp}</span>
        </div>
        <div className="h-6 bg-gray-800 rounded-full overflow-hidden border border-gray-600 relative">
          <div
            className="h-full bg-gradient-to-r from-green-600 to-green-500 transition-all duration-300"
            style={{ width: `${hpPercent}%` }}
          />
          {player.block > 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-lg">
                🛡️ {player.block}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Turn Indicator - Larger touch target */}
      <div className="flex justify-center mt-2">
        <button
          onClick={handleEndTurn}
          disabled={!isPlayerTurn}
          className={`
            min-h-[48px] min-w-[160px] px-6 py-2 rounded-full font-bold text-sm
            transition-all duration-200
            select-none
            active:scale-95
            ${isPlayerTurn
              ? 'bg-primary text-white cursor-pointer shadow-lg shadow-primary/30'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }
          `}
          style={{ touchAction: 'manipulation' }}
        >
          {isPlayerTurn ? '⚔️ 结束回合' : '💀 敌方回合'}
        </button>
      </div>
    </div>
  );
}