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
      style={{
        background: 'linear-gradient(180deg, rgba(232, 223, 208, 0.95) 0%, rgba(245, 237, 224, 0.9) 100%)',
        borderTop: '2px solid #D4C4A8',
      }}
    >
      {/* 顶部状态条 - 卷轴风格 */}
      <div
        className="flex justify-between items-center px-4 py-2 rounded-lg"
        style={{
          background: 'rgba(212, 196, 168, 0.6)',
          border: '1px solid #B8A88C',
        }}
      >
        {/* 回合计数 */}
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #C4483E 0%, #8B3029 100%)',
            border: '1px solid #8B3029',
          }}
        >
          <span className="text-sm">🔥</span>
          <span className="text-sm font-bold text-[#FDF8F0]">第{turn}回</span>
        </div>

        {/* 能量条 - 灵力珠 */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: player.maxEnergy }).map((_, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all duration-300"
              style={{
                background: i < player.energy
                  ? 'linear-gradient(135deg, #4A7C9B 0%, #2D4A5C 100%)'
                  : 'linear-gradient(135deg, #D4C4A8 0%, #B8A88C 100%)',
                border: `2px solid ${i < player.energy ? '#2D4A5C' : '#B8A88C'}`,
                boxShadow: i < player.energy ? '0 0 8px rgba(74, 124, 155, 0.4)' : 'inset 0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {i < player.energy && <span style={{ color: '#FDF8F0' }}>☯️</span>}
            </div>
          ))}
        </div>

        {/* 金币 */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #C9A227 0%, #A88B20 100%)',
            border: '1px solid #8B7355',
          }}
        >
          <span className="text-lg">💰</span>
          <span className="text-sm font-bold text-[#FDF8F0]">{player.gold}</span>
        </div>
      </div>

      {/* 生命条 - 血条风格 */}
      <div className="mt-3 px-2">
        <div className="flex justify-between items-center mb-1.5 px-2">
          <span className="text-xs font-bold text-[#C45C4A] flex items-center gap-1">
            ❤️ <span style={{ color: '#2D2926' }}>生命</span>
          </span>
          <span
            className="text-sm font-mono font-bold"
            style={{ color: '#2D2926' }}
          >
            {player.hp} / {player.maxHp}
          </span>
        </div>

        <div
          className="h-7 rounded-lg overflow-hidden relative"
          style={{
            background: 'linear-gradient(180deg, #D4C4A8 0%, #B8A88C 100%)',
            border: '2px solid #8B7355',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div
            className="h-full transition-all duration-500 ease-out relative"
            style={{
              width: `${hpPercent}%`,
              background: hpPercent > 50
                ? 'linear-gradient(180deg, #C45C4A 0%, #8B3029 100%)'
                : hpPercent > 25
                ? 'linear-gradient(180deg, #E06B5A 0%, #C4483E 100%)'
                : 'linear-gradient(180deg, #D66B5A 0%, #8B3029 100%)',
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%)' }}
            />
          </div>

          {/* 护盾显示 */}
          {player.block > 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(90deg, transparent 20%, rgba(92, 138, 74, 0.4) 50%, transparent 80%)' }}
            >
              <span
                className="text-sm font-bold flex items-center gap-1"
                style={{
                  color: '#FDF8F0',
                  textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                }}
              >
                🛡️ {player.block}
              </span>
            </div>
          )}

          {/* 低血量时显示数字 */}
          {hpPercent <= 30 && hpPercent > 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold" style={{ color: '#FDF8F0', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                {player.hp} / {player.maxHp}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 结束回合按钮 - 印章风格 */}
      <div className="flex justify-center mt-3">
        <button
          onClick={handleEndTurn}
          disabled={!isPlayerTurn}
          className={`
            min-h-[52px] min-w-[180px]
            px-8 py-3
            rounded-lg
            font-bold text-base
            transition-all duration-200
            select-none
            active:scale-95
          `}
          style={{
            touchAction: 'manipulation',
            ...(isPlayerTurn
              ? {
                  background: 'linear-gradient(180deg, #C4483E 0%, #8B3029 100%)',
                  border: '3px solid #8B3029',
                  color: '#FDF8F0',
                  boxShadow: '0 4px 12px rgba(196, 72, 62, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                  fontFamily: 'Georgia, serif',
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                }
              : {
                  background: 'linear-gradient(180deg, #D4C4A8 0%, #B8A88C 100%)',
                  border: '2px solid #B8A88C',
                  color: '#7A746D',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                }),
          }}
        >
          {isPlayerTurn ? '⚔️ 结束回合' : '💀 敌方回合'}
        </button>
      </div>
    </div>
  );
}