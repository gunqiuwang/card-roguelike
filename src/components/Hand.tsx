import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAnimationStore } from '../store/animationStore';
import { Card } from './Card';

export function Hand() {
  const player = useGameStore(state => state.player);
  const isPlayerTurn = useGameStore(state => state.isPlayerTurn);
  const phase = useGameStore(state => state.phase);
  const pendingCostReduction = useGameStore(state => state.player.pendingCostReduction);
  const cardsPlayedThisTurn = useGameStore(state => state.player.cardsPlayedThisTurn);
  const zhanyaoCombo = useGameStore(state => state.player.zhanyaoCombo);
  const comboLevel = useAnimationStore(state => state.zhanyaoCombo);

  const canPlayCard = (cardCost: number) => {
    return isPlayerTurn && phase === 'battle' && player.energy >= cardCost;
  };

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (phase !== 'battle') return null;

  return (
    <div
      className="w-full"
      style={{
        background: 'linear-gradient(to top, rgba(232, 223, 208, 0.98), rgba(245, 237, 224, 0.9) 70%, transparent)',
        borderTop: '2px solid #D4C4A8',
      }}
    >
      {/* 状态提示条 */}
      <div className="flex justify-center gap-4 py-1.5 px-2">
        {/* 抽牌堆 */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
          style={{
            background: 'rgba(212, 196, 168, 0.8)',
            border: '1px solid #B8A88C',
          }}
        >
          <span>📜</span>
          <span style={{ color: '#4A4541', fontWeight: 600 }}>{player.drawPile.length}</span>
          <span style={{ color: '#7A746D' }}>抽</span>
        </div>

        {/* 弃牌堆 */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
          style={{
            background: 'rgba(212, 196, 168, 0.8)',
            border: '1px solid #B8A88C',
          }}
        >
          <span>📋</span>
          <span style={{ color: '#4A4541', fontWeight: 600 }}>{player.discardPile.length}</span>
          <span style={{ color: '#7A746D' }}>弃</span>
        </div>

        {/* 降费指示 */}
        {pendingCostReduction && pendingCostReduction > 0 && (
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs animate-cost-reduce"
            style={{
              background: 'rgba(74, 90, 45, 0.3)',
              border: '1px solid #4A5C2D',
            }}
          >
            <span>⛓️</span>
            <span style={{ color: '#4A5C2D', fontWeight: 600 }}>费用-1</span>
          </div>
        )}

        {/* 连锁提示 */}
        {cardsPlayedThisTurn && cardsPlayedThisTurn > 1 && (
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs animate-chain-pulse"
            style={{
              background: 'rgba(74, 90, 45, 0.3)',
              border: '1px solid #4A5C2D',
            }}
          >
            <span>🔥</span>
            <span style={{ color: '#4A5C2D', fontWeight: 600 }}>x{cardsPlayedThisTurn}</span>
          </div>
        )}

        {/* 斩妖连击提示 */}
        {zhanyaoCombo && zhanyaoCombo > 0 && (
          <div
            className={comboLevel > 0 ? 'animate-zhanyao-rage' : ''}
            style={{
              background: 'rgba(139, 48, 41, 0.3)',
              border: '1px solid #8B3029',
            }}
          >
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs">
              <span>⚔️</span>
              <span style={{ color: '#8B3029', fontWeight: 600 }}>斩+{zhanyaoCombo}</span>
              <span style={{ color: '#8B3029' }}>+{(zhanyaoCombo - 1) * 3}伤</span>
            </div>
          </div>
        )}
      </div>

      {/* 手牌区域 - 弧形排列 */}
      <div
        className="flex justify-center items-end gap-1 px-1 pb-3"
        style={{ minHeight: '180px' }}
      >
        {player.hand.map((card, index) => {
          // 计算弧形偏移
          const totalCards = player.hand.length;
          const centerIndex = (totalCards - 1) / 2;
          const offsetFromCenter = index - centerIndex;
          const maxOffset = Math.max(1, totalCards / 2);
          const normalizedOffset = offsetFromCenter / maxOffset;

          // 悬停时放大
          const isHovered = hoveredIndex === index;
          const baseTranslateY = normalizedOffset * 8; // 两侧微微下沉
          const hoverTranslateY = isHovered ? -20 : baseTranslateY;
          const hoverScale = isHovered ? 1.08 : 1;
          const hoverZIndex = isHovered ? 100 : Math.floor(50 - Math.abs(normalizedOffset) * 10);

          return (
            <div
              key={card.id}
              className="hand-card"
              style={{
                transform: `translateY(${hoverTranslateY}px) scale(${hoverScale})`,
                zIndex: hoverZIndex,
                transformOrigin: 'center bottom',
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Card
                card={card}
                index={index}
                canPlay={canPlayCard(card.cost)}
                isHovered={isHovered}
              />
            </div>
          );
        })}
      </div>

      {/* 空手牌提示 */}
      {player.hand.length === 0 && (
        <div
          className="text-center py-6 text-sm"
          style={{ color: '#7A746D', fontFamily: 'Georgia, serif' }}
        >
          符纸耗尽...
        </div>
      )}
    </div>
  );
}