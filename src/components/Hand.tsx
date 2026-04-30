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
    <div className="
      fixed bottom-0 left-0 right-0
      bg-gradient-to-t from-black/90 via-black/60 to-transparent
      pb-4 sm:pb-6 pt-12 sm:pt-8
      z-40
    ">
      {/* Card Count Info */}
      <div className="flex justify-center gap-6 mb-3 text-sm text-white/70">
        <span>🎴 抽牌堆: {player.drawPile.length}</span>
        <span>🗑️ 弃牌堆: {player.discardPile.length}</span>
      </div>

      {/* Cards - Scrollable on small screens */}
      <div className="flex justify-start sm:justify-center gap-3 px-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {player.hand.map((card, index) => (
          <div key={card.id} className="snap-center shrink-0 card-draw-animation">
            <Card
              card={card}
              index={index}
              canPlay={canPlayCard(card.cost)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}