import { useGameStore } from '../store/gameStore';
import { Card } from './Card';

export function Hand() {
  const player = useGameStore(state => state.player);
  const isPlayerTurn = useGameStore(state => state.isPlayerTurn);
  const phase = useGameStore(state => state.phase);

  const canPlayCard = (cardCost: number) => {
    return isPlayerTurn && phase === 'battle' && player.energy >= cardCost;
  };

  if (phase !== 'battle') return null;

  return (
    <div
      className="
        w-full
        bg-gradient-to-t
        from-[#E8DFD0] via-[#F5EDE0] to-transparent
        pb-4 pt-3
      "
      style={{ borderTop: '2px solid #D4C4A8' }}
    >
      {/* 牌堆信息 - 卷轴风格 */}
      <div className="flex justify-center gap-6 mb-3">
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{
            background: 'rgba(212, 196, 168, 0.8)',
            border: '1px solid #B8A88C',
          }}
        >
          <span className="text-lg">📜</span>
          <span className="text-sm font-medium text-[#4A4541]">
            {player.drawPile.length}
          </span>
          <span className="text-xs text-[#7A746D]">抽</span>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{
            background: 'rgba(212, 196, 168, 0.8)',
            border: '1px solid #B8A88C',
          }}
        >
          <span className="text-lg">📋</span>
          <span className="text-sm font-medium text-[#4A4541]">
            {player.discardPile.length}
          </span>
          <span className="text-xs text-[#7A746D]">弃</span>
        </div>
      </div>

      {/* 手牌区域 */}
      <div
        className="
          flex justify-center
          gap-2 px-2
          overflow-x-auto
          pb-3
          snap-x snap-mandatory
        "
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(45, 41, 38, 0.2) transparent',
        }}
      >
        {player.hand.map((card, index) => (
          <div
            key={card.id}
            className="snap-center shrink-0"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Card
              card={card}
              index={index}
              canPlay={canPlayCard(card.cost)}
            />
          </div>
        ))}
      </div>

      {/* 空手牌提示 */}
      {player.hand.length === 0 && (
        <div
          className="text-center py-4 text-sm text-[#7A746D]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          符纸耗尽...
        </div>
      )}
    </div>
  );
}