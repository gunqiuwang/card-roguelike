import { useGameStore } from '../store/gameStore';

export function BattleArea() {
  const isPlayerTurn = useGameStore(state => state.isPlayerTurn);
  const phase = useGameStore(state => state.phase);

  if (phase !== 'battle') return null;

  return (
    <div className="mb-4 text-center">
      <div className={`
        inline-block px-4 py-1 rounded-full text-sm font-bold
        ${isPlayerTurn
          ? 'bg-green-600/80 text-green-200'
          : 'bg-red-600/80 text-red-200'
        }
      `}>
        {isPlayerTurn ? '⚔️ 你的回合' : '💀 敌方回合'}
      </div>
    </div>
  );
}