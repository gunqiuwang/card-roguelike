import { useGameStore } from '../store/gameStore';

export function BattleArea() {
  const isPlayerTurn = useGameStore(state => state.isPlayerTurn);
  const phase = useGameStore(state => state.phase);

  if (phase !== 'battle') return null;

  return (
    <div className="mb-4 text-center">
      {/* Turn indicator - Castle banner style */}
      <div
        className={`
          inline-block px-6 py-2 rounded-full
          animate-turn-pulse
          text-sm font-bold
        `}
        style={{
          ...(isPlayerTurn
            ? {
                background: 'linear-gradient(135deg, rgba(74, 155, 92, 0.3) 0%, rgba(45, 31, 66, 0.9) 100%)',
                border: '2px solid #4A9B5C',
                color: '#4A9B5C',
                boxShadow: '0 0 20px rgba(74, 155, 92, 0.3)',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }
            : {
                background: 'linear-gradient(135deg, rgba(155, 45, 90, 0.3) 0%, rgba(45, 31, 66, 0.9) 100%)',
                border: '2px solid #9B2D5A',
                color: '#C4456E',
                boxShadow: '0 0 20px rgba(155, 45, 90, 0.3)',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }),
        }}
      >
        {isPlayerTurn ? '⚔️ 你的回合' : '💀 敌方回合'}
      </div>
    </div>
  );
}