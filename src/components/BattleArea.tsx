import { useGameStore } from '../store/gameStore';

export function BattleArea() {
  const isPlayerTurn = useGameStore(state => state.isPlayerTurn);
  const phase = useGameStore(state => state.phase);

  if (phase !== 'battle') return null;

  return (
    <div className="mb-4 text-center">
      <div
        className={`
          inline-block px-6 py-2 rounded-full
          animate-turn-pulse
          text-sm font-bold
        `}
        style={{
          ...(isPlayerTurn
            ? {
                background: 'linear-gradient(135deg, rgba(92, 138, 74, 0.3) 0%, rgba(212, 196, 168, 0.9) 100%)',
                border: '2px solid #5C8A4A',
                color: '#4A5C2D',
                boxShadow: '0 0 20px rgba(92, 138, 74, 0.3)',
              }
            : {
                background: 'linear-gradient(135deg, rgba(196, 72, 62, 0.3) 0%, rgba(212, 196, 168, 0.9) 100%)',
                border: '2px solid #C4483E',
                color: '#8B3029',
                boxShadow: '0 0 20px rgba(196, 72, 62, 0.3)',
              }),
          fontFamily: 'Georgia, serif',
        }}
      >
        {isPlayerTurn ? '⚔️ 你的回合' : '💀 妖物回合'}
      </div>
    </div>
  );
}