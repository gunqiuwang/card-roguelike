import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  onPlay: () => void;
  canPlay: boolean;
}

export function Card({ card, onPlay, canPlay }: CardProps) {
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

  return (
    <button
      onClick={onPlay}
      disabled={!canPlay}
      className={`
        relative w-28 h-40 sm:w-32 sm:h-44
        bg-gradient-to-b ${typeColors[card.type]}
        rounded-xl border-2 shadow-lg
        flex flex-col items-center justify-between p-2
        transition-all duration-200
        ${canPlay
          ? 'cursor-pointer hover:scale-105 hover:shadow-xl active:scale-95'
          : 'opacity-60 cursor-not-allowed'
        }
        text-white
      `}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Cost */}
      <div className="
        absolute -top-2 -left-2 w-8 h-8
        bg-yellow-500 rounded-full border-2 border-yellow-300
        flex items-center justify-center
        text-lg font-bold text-yellow-900
        shadow-md
      ">
        {card.cost}
      </div>

      {/* Card Type Icon */}
      <div className="text-3xl mt-2">
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