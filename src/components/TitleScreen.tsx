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
        background: 'linear-gradient(180deg, #F5EDE0 0%, #E8DFD0 50%, #F5EDE0 100%)',
      }}
    >
      {/* 宣纸纹理 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 山水云雾背景效果 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 80%, rgba(139, 115, 85, 0.15) 0%, transparent 40%),
            radial-gradient(ellipse at 80% 70%, rgba(196, 72, 62, 0.1) 0%, transparent 35%),
            radial-gradient(ellipse at 50% 50%, rgba(212, 196, 168, 0.3) 0%, transparent 50%)
          `,
        }}
      />

      {/* 主内容 */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* 标题卷轴 */}
        <div
          className="
            flex flex-col items-center
            p-8 rounded-xl
            animate-fade-in
          "
          style={{
            background: 'linear-gradient(180deg, rgba(253, 248, 240, 0.98) 0%, rgba(232, 223, 208, 0.98) 100%)',
            border: '4px solid #8B7355',
            boxShadow: '0 8px 40px rgba(45, 41, 38, 0.2), 0 0 60px rgba(139, 115, 85, 0.1)',
          }}
        >
          {/* 印章标记 */}
          <div
            className="text-4xl mb-4 animate-seal-stamp"
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(196, 72, 62, 0.3))',
            }}
          >
            🏯
          </div>

          {/* 游戏标题 */}
          <div
            className="text-center mb-2"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            <div
              className="text-xs tracking-[0.3em] mb-2"
              style={{ color: '#7A746D' }}
            >
              神怪卡牌
            </div>
            <h1
              className="text-5xl md:text-6xl font-bold"
              style={{
                background: 'linear-gradient(180deg, #C4483E 0%, #8B3029 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: '#C4483E',
              }}
            >
              山海符箓
            </h1>
            <div
              className="text-sm tracking-widest mt-2"
              style={{ color: '#4A4541' }}
            >
              SHAN HAI talisman
            </div>
          </div>

          {/* 装饰线 */}
          <div
            className="w-40 h-px my-4"
            style={{
              background: 'linear-gradient(90deg, transparent, #8B7355, transparent)',
            }}
          />

          {/* 副标题 */}
          <div
            className="text-center text-sm"
            style={{ color: '#4A4541', fontFamily: 'Georgia, serif' }}
          >
            <p>斩杀妖魔 · 御灵护体 · 符术疗心</p>
            <p className="mt-1 text-xs" style={{ color: '#7A746D' }}>
              三派合一，化解山海凶兽
            </p>
          </div>

          {/* 派系图标 */}
          <div className="flex gap-6 mt-6 text-3xl">
            <div className="flex flex-col items-center">
              <span>⚔️</span>
              <span className="text-xs mt-1" style={{ color: '#8B3029' }}>斩妖</span>
            </div>
            <div className="flex flex-col items-center">
              <span>🛡️</span>
              <span className="text-xs mt-1" style={{ color: '#2D4A5C' }}>御灵</span>
            </div>
            <div className="flex flex-col items-center">
              <span>☯️</span>
              <span className="text-xs mt-1" style={{ color: '#4A5C2D' }}>符术</span>
            </div>
          </div>
        </div>

        {/* 开始按钮 - 印章风格 */}
        <button
          onClick={handleStartGame}
          className="
            min-h-[56px] min-w-[200px]
            px-10 py-4
            rounded-lg
            font-bold text-lg
            transition-all duration-300
            active:scale-95
          "
          style={{
            background: 'linear-gradient(180deg, #C4483E 0%, #8B3029 100%)',
            border: '4px solid #8B3029',
            color: '#FDF8F0',
            boxShadow: '0 4px 20px rgba(196, 72, 62, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
            fontFamily: 'Georgia, serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 30px rgba(196, 72, 62, 0.6), inset 0 1px 0 rgba(255,255,255,0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(196, 72, 62, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
          }}
        >
          🏯 进入山海
        </button>

        {/* 版本信息 */}
        <div
          className="text-xs mt-8"
          style={{ color: '#B8A88C' }}
        >
          v0.3 - 山海经神怪世界观
        </div>
      </div>

      {/* 底部装饰 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(212, 196, 168, 0.5))',
        }}
      />
    </div>
  );
}