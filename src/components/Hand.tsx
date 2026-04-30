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
        from-[#1A1128] via-[#251A38] to-transparent
        pb-4 pt-3
        border-t border-[#3D2A55]
      "
      style={{ boxShadow: '0 -10px 30px rgba(26, 17, 40, 0.8)' }}
    >
      {/* Deck/Discard Info - Fantasy style */}
      <div className="flex justify-center gap-6 mb-3">
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{ background: 'rgba(45, 31, 66, 0.8)', border: '1px solid #3D2A55' }}
        >
          <span className="text-lg">🎴</span>
          <span className="text-sm font-medium text-[#A89B8C]">
            {player.drawPile.length}
          </span>
          <span className="text-xs text-[#8B7355]">抽牌堆</span>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{ background: 'rgba(45, 31, 66, 0.8)', border: '1px solid #3D2A55' }}
        >
          <span className="text-lg">🗑️</span>
          <span className="text-sm font-medium text-[#A89B8C]">
            {player.discardPile.length}
          </span>
          <span className="text-xs text-[#8B7355]">弃牌堆</span>
        </div>
      </div>

      {/* Cards - Fantasy card table feel */}
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
          scrollbarColor: 'rgba(212, 134, 61, 0.3) transparent',
        }}
      >
        {player.hand.map((card, index) => (
          <div
            key={card.id}
            className="snap-center shrink-0"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <Card
              card={card}
              index={index}
              canPlay={canPlayCard(card.cost)}
            />
          </div>
        ))}
      </div>

      {/* Empty hand message */}
      {player.hand.length === 0 && (
        <div
          className="text-center py-4 text-sm text-[#8B7355]"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          抽牌堆中没有卡牌...
        </div>
      )}
    </div>
  );
}