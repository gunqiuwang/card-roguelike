import { useGameStore } from '../store/gameStore';
import { Card } from './Card';

export function Hand() {
  const player = useGameStore(state => state.player);
  const isPlayerTurn = useGameStore(state => state.isPlayerTurn);
  const dispatch = useGameStore(state => state.dispatch);
  const phase = useGameStore(state => state.phase);

  const canPlayCard = (cardCost: number) => {
    return isPlayerTurn && phase === 'battle' && player.energy >= cardCost;
  };

  const handlePlayCard = (cardIndex: number) => {
    const card = player.hand[cardIndex];
    dispatch({ type: 'PLAY_CARD', payload: { card, cardIndex } });
  };

  if (phase !== 'battle') return null;

  return (
    <div className="
      fixed bottom-0 left-0 right-0
      bg-gradient-to-t from-black/80 to-transparent
      pb-4 pt-8
    ">
      {/* Card Count Info */}
      <div className="flex justify-center gap-4 mb-2 text-xs text-white/60">
        <span>抽牌堆: {player.drawPile.length}</span>
        <span>弃牌堆: {player.discardPile.length}</span>
      </div>

      {/* Cards */}
      <div className="flex justify-center gap-2 px-2 overflow-x-auto">
        {player.hand.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            onPlay={() => handlePlayCard(index)}
            canPlay={canPlayCard(card.cost)}
          />
        ))}
      </div>
    </div>
  );
}