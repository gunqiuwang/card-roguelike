import { useGameStore } from '../store/gameStore';
import { useAnimationStore } from '../store/animationStore';
import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  index: number;
  canPlay: boolean;
}

export function Card({ card, index, canPlay }: CardProps) {
  const cardPlayIndex = useAnimationStore(state => state.cardPlayIndex);
  const triggerCardPlay = useAnimationStore(state => state.triggerCardPlay);
  const dispatch = useGameStore(state => state.dispatch);
  const player = useGameStore(state => state.player);
  const isPlayerTurn = useGameStore(state => state.isPlayerTurn);
  const phase = useGameStore(state => state.phase);

  const canPlayCard = isPlayerTurn && phase === 'battle' && player.energy >= card.cost;

  const handlePlay = () => {
    if (!canPlayCard) return;
    triggerCardPlay(index);
    setTimeout(() => {
      dispatch({ type: 'PLAY_CARD', payload: { card, cardIndex: index } });
    }, 200);
  };

  const typeColors = {
    attack: 'from-red-600 to-red-800 border-red-700',
    defense: 'from-blue-600 to-blue-800 border-blue-700',
    heal: 'from-green-600 to-green-800 border-green-700',
  };

  const typeIcons = {
    attack: '⚔️',
    defense: '🛡️',
    heal: '💚',
  };

  const isPlaying = cardPlayIndex === index;

  return (
    <button
      onClick={handlePlay}
      disabled={!canPlay}
      className={`
        relative min-w-[120px] min-h-[160px] sm:min-w-[128px] sm:min-h-[176px]
        w-28 h-40 sm:w-32 sm:h-44
        bg-gradient-to-b ${typeColors[card.type]}
        rounded-xl border-2 shadow-lg
        flex flex-col items-center justify-between p-2
        transition-all duration-200
        select-none
        ${isPlaying ? 'card-play-animation' : ''}
        ${canPlayCard
          ? 'cursor-pointer active:scale-95 active:shadow-xl'
          : 'opacity-60 cursor-not-allowed'
        }
        text-white
      `}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Cost */}
      <div className="
        absolute -top-3 -left-3 w-10 h-10 sm:w-8 sm:h-8
        bg-yellow-500 rounded-full border-2 border-yellow-300
        flex items-center justify-center
        text-lg font-bold text-yellow-900
        shadow-md
        z-10
      ">
        {card.cost}
      </div>

      {/* Card Type Icon */}
      <div className="text-3xl sm:text-4xl mt-3">
        {typeIcons[card.type]}
      </div>

      {/* Card Name */}
      <div className="text-sm font-bold text-center leading-tight">
        {card.name}
      </div>

      {/* Card Art Placeholder */}
      <div className="
        w-16 h-16 sm:w-20 sm:h-20
        bg-black/30 rounded-lg
        flex items-center justify-center
        text-4xl
      ">
        {typeIcons[card.type]}
      </div>

      {/* Card Description */}
      <div className="text-xs text-center opacity-90">
        {card.description}
      </div>
    </button>
  );
}