import { useGameStore } from '../store/gameStore';

export function GameOver() {
  const phase = useGameStore(state => state.phase);
  const dispatch = useGameStore(state => state.dispatch);

  if (phase !== 'victory' && phase !== 'defeat') return null;

  const isVictory = phase === 'victory';

  return (
    <div className="
      fixed inset-0
      bg-black/80 backdrop-blur-sm
      flex items-center justify-center
      z-50
    ">
      <div className="
        flex flex-col items-center gap-6 p-8
        bg-gradient-to-b from-gray-800 to-gray-900
        rounded-3xl border-4 border-gray-600
        shadow-2xl
      ">
        {/* Title */}
        <div className={`
          text-4xl font-bold
          ${isVictory ? 'text-yellow-400' : 'text-red-500'}
        `}>
          {isVictory ? '🏆 胜利!' : '💀 失败'}
        </div>

        {/* Subtitle */}
        <div className="text-white/80 text-lg">
          {isVictory ? '你击败了敌人!' : '你被击败了...'}
        </div>

        {/* Restart Button */}
        <button
          onClick={() => dispatch({ type: 'RESET_GAME' })}
          className="
            px-8 py-3 rounded-full
            bg-primary text-white font-bold
            text-lg
            hover:scale-105 active:scale-95
            transition-all duration-200
            shadow-lg
          "
        >
          重新开始
        </button>
      </div>
    </div>
  );
}