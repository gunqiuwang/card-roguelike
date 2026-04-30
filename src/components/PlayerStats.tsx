import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

export function PlayerStats() {
  const player = useGameStore(state => state.player);
  const isPlayerTurn = useGameStore(state => state.isPlayerTurn);
  const turn = useGameStore(state => state.turn);
  const dispatch = useGameStore(state => state.dispatch);

  const hpPercent = Math.max(0, (player.hp / player.maxHp) * 100);

  const handleEndTurn = useCallback(() => {
    if (isPlayerTurn) {
      dispatch({ type: 'END_TURN' });
      setTimeout(() => {
        dispatch({ type: 'START_TURN' });
      }, 100);
    }
  }, [isPlayerTurn, dispatch]);

  return (
    <div
      className="w-full px-2 py-3"
      style={{ background: 'linear-gradient(180deg, rgba(45, 31, 66, 0.9) 0%, rgba(26, 17, 40, 0.8) 100%)' }}
    >
      {/* Top Bar - Game HUD style */}
      <div
        className="flex justify-between items-center px-4 py-2 rounded-xl"
        style={{
          background: 'rgba(30, 20, 46, 0.9)',
          border: '1px solid #3D2A55',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }}
      >
        {/* Turn Counter - Castle torch style */}
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #9B2D5A 0%, #6B1E3D 100%)',
            border: '1px solid #C4456E',
          }}
        >
          <span className="text-sm">🔥</span>
          <span className="text-sm font-bold text-[#F5E6D3]">回合 {turn}</span>
        </div>

        {/* Energy Orbs - Magical gems */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: player.maxEnergy }).map((_, i) => (
            <div
              key={i}
              className={`
                w-7 h-7 rounded-full
                flex items-center justify-center
                text-sm
                transition-all duration-300
              `}
              style={{
                background: i < player.energy
                  ? 'linear-gradient(135deg, #F5D76E 0%, #E9A84D 50%, #D4863D 100%)'
                  : 'linear-gradient(135deg, #2D1F42 0%, #1E142E 100%)',
                border: `2px solid ${i < player.energy ? '#A66A2E' : '#3D2A55'}`,
                boxShadow: i < player.energy
                  ? '0 0 10px rgba(212, 134, 61, 0.5), inset 0 2px 4px rgba(255,255,255,0.3)'
                  : 'inset 0 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {i < player.energy && (
                <span style={{ color: '#2D1F42' }}>⚡</span>
              )}
            </div>
          ))}
        </div>

        {/* Gold - Treasure */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #3D2A55 0%, #2D1F42 100%)',
            border: '1px solid #8B7355',
          }}
        >
          <span className="text-lg">💰</span>
          <span className="text-sm font-bold text-[#E9B872]">{player.gold}</span>
        </div>
      </div>

      {/* HP Bar - More game-like */}
      <div className="mt-3 px-2">
        <div
          className="flex justify-between items-center mb-1.5 px-2"
        >
          <span className="text-xs font-bold text-[#E74C3C] flex items-center gap-1">
            ❤️ <span style={{ color: '#F5E6D3' }}>生命</span>
          </span>
          <span
            className="text-sm font-mono font-bold"
            style={{ color: '#F5E6D3', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            {player.hp} / {player.maxHp}
          </span>
        </div>

        {/* HP Bar - Castle health bar style */}
        <div
          className="h-7 rounded-xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(180deg, #1E142E 0%, #2D1F42 100%)',
            border: '2px solid #3D2A55',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          {/* HP Fill */}
          <div
            className="h-full transition-all duration-500 ease-out relative"
            style={{
              width: `${hpPercent}%`,
              background: hpPercent > 50
                ? 'linear-gradient(180deg, #E74C3C 0%, #C0392B 50%, #A02A21 100%)'
                : hpPercent > 25
                ? 'linear-gradient(180deg, #E67E22 0%, #D35400 50%, #B03A00 100%)'
                : 'linear-gradient(180deg, #E74C3C 0%, #922B21 100%)',
              boxShadow: hpPercent > 50
                ? 'inset 0 2px 4px rgba(255,255,255,0.2), 0 0 10px rgba(231, 76, 60, 0.3)'
                : 'inset 0 2px 4px rgba(255,255,255,0.1)',
            }}
          >
            {/* HP shine effect */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
              }}
            />
          </div>

          {/* Block overlay */}
          {player.block > 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: 'linear-gradient(90deg, transparent 20%, rgba(92, 156, 236, 0.3) 50%, transparent 80%)',
              }}
            >
              <span
                className="text-sm font-bold flex items-center gap-1"
                style={{
                  color: '#fff',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 0 10px rgba(92, 156, 236, 0.8)',
                }}
              >
                🛡️ {player.block}
              </span>
            </div>
          )}

          {/* HP text (only show when low) */}
          {hpPercent <= 30 && hpPercent > 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-xs font-bold"
                style={{
                  color: '#fff',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                }}
              >
                {player.hp} / {player.maxHp}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* End Turn Button - Prominent Castle style */}
      <div className="flex justify-center mt-3">
        <button
          onClick={handleEndTurn}
          disabled={!isPlayerTurn}
          className={`
            min-h-[52px] min-w-[180px]
            px-8 py-3
            rounded-xl
            font-bold text-base
            transition-all duration-200
            select-none
            active:scale-95
          `}
          style={{
            touchAction: 'manipulation',
            ...(isPlayerTurn
              ? {
                  background: 'linear-gradient(135deg, #9B2D5A 0%, #6B1E3D 100%)',
                  border: '2px solid #C4456E',
                  color: '#F5E6D3',
                  boxShadow: '0 4px 15px rgba(155, 45, 90, 0.4), 0 0 30px rgba(155, 45, 90, 0.2)',
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                }
              : {
                  background: 'linear-gradient(135deg, #2D1F42 0%, #1E142E 100%)',
                  border: '2px solid #3D2A55',
                  color: '#8B7355',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                }),
          }}
        >
          {isPlayerTurn ? '⚔️ 结束回合' : '💀 敌方回合'}
        </button>
      </div>
    </div>
  );
}