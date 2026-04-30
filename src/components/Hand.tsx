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
      w-full
      bg-gradient-to-t from-black/95 via-black/80 to-transparent
      pb-4 pt-4
    ">
      {/* Card Count Info */}
      <div className="flex justify-center gap-4 mb-2 text-xs text-white/60">
        <span>🎴 {player.drawPile.length}</span>
        <span>🗑️ {player.discardPile.length}</span>
      </div>

      {/* Cards - Scrollable on small screens */}
      <div className="flex justify-start gap-2 px-2 overflow-x-auto pb-2 snap-x snap-mandatory">
        {player.hand.map((card, index) => (
          <div key={card.id} className="snap-center shrink-0">
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