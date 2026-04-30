import { useGameStore } from '../store/gameStore';

export function TitleScreen() {
  const dispatch = useGameStore(state => state.dispatch);

  const handleStartGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  return (
    <div
      className="
        min-h-screen
        flex flex-col
        items-center justify-center
        px-4
        relative
        overflow-hidden
      "
      style={{
        background: 'linear-gradient(180deg, #1A1128 0%, #0D0915 100%)',
      }}
    >
      {/* Background decoration - castle towers silhouette */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: `
            radial-gradient(ellipse at 20% 100%, rgba(155, 45, 90, 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 100%, rgba(212, 134, 61, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(155, 45, 90, 0.2) 0%, transparent 40%)
          `,
        }}
      />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-float-up"
            style={{
              left: `${10 + (i * 8)}%`,
              top: `${60 + (i % 3) * 15}%`,
              background: i % 3 === 0 ? '#D4863D' : i % 3 === 1 ? '#9B2D5A' : '#4A9B5C',
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 3)}s`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Title Card - Castle Crest Style */}
        <div
          className="
            flex flex-col items-center
            p-8 rounded-3xl
            animate-fade-in
          "
          style={{
            background: 'linear-gradient(180deg, rgba(45, 31, 66, 0.95) 0%, rgba(26, 17, 40, 0.98) 100%)',
            border: '3px solid #3D2A55',
            boxShadow: '0 0 60px rgba(155, 45, 90, 0.3), 0 0 120px rgba(212, 134, 61, 0.1)',
          }}
        >
          {/* Game Title */}
          <div
            className="text-center mb-2"
            style={{
              fontFamily: 'Georgia, serif',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            <div
              className="text-sm tracking-[0.3em] mb-2"
              style={{ color: '#8B7355' }}
            >
              DUNGEON CARD
            </div>
            <h1
              className="text-5xl md:text-6xl font-bold"
              style={{
                background: 'linear-gradient(180deg, #E9B872 0%, #D4863D 50%, #A66A2E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none',
              }}
            >
              卡牌地城
            </h1>
            <div
              className="text-sm tracking-widest mt-2"
              style={{ color: '#9B2D5A' }}
            >
              DUNGEON CARDS
            </div>
          </div>

          {/* Decorative line */}
          <div
            className="w-32 h-px my-4"
            style={{
              background: 'linear-gradient(90deg, transparent, #D4863D, transparent)',
            }}
          />

          {/* Subtitle */}
          <div
            className="text-center text-sm"
            style={{ color: '#A89B8C', fontFamily: 'Georgia, serif' }}
          >
            <p>魔王城堡的卡牌挑战</p>
            <p className="mt-1 text-xs">建立你的牌组，击败黑暗势力</p>
          </div>

          {/* Card icons decoration */}
          <div className="flex gap-4 mt-6 text-3xl">
            <span>⚔️</span>
            <span>🛡️</span>
            <span>💚</span>
            <span>🔥</span>
          </div>
        </div>

        {/* Start Button - Castle Gate style */}
        <button
          onClick={handleStartGame}
          className="
            min-h-[56px] min-w-[200px]
            px-10 py-4
            rounded-xl
            font-bold text-lg
            transition-all duration-300
            active:scale-95
            animate-pulse-once
          "
          style={{
            background: 'linear-gradient(180deg, #9B2D5A 0%, #6B1E3D 100%)',
            border: '3px solid #C4456E',
            color: '#F5E6D3',
            boxShadow: '0 4px 20px rgba(155, 45, 90, 0.5), 0 0 40px rgba(155, 45, 90, 0.2)',
            fontFamily: 'Georgia, serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 30px rgba(155, 45, 90, 0.7), 0 0 60px rgba(155, 45, 90, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(155, 45, 90, 0.5), 0 0 40px rgba(155, 45, 90, 0.2)';
          }}
        >
          ⚔️ 开始冒险
        </button>

        {/* Version/credit */}
        <div
          className="text-xs mt-8"
          style={{ color: '#5C4A3D' }}
        >
          v0.2 - UI Redesign
        </div>
      </div>

      {/* Bottom decorative border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(45, 31, 66, 0.5))',
        }}
      />
    </div>
  );
}