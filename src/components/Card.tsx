import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAnimationStore } from '../store/animationStore';
import { Card as CardType, CardRarity } from '../types';

interface CardProps {
  card: CardType;
  index: number;
  canPlay: boolean;
}

// Rarity border colors
const RARITY_BORDERS: Record<CardRarity, string> = {
  starter: '#8B7355',
  common: '#4A7C9B',
  rare: '#9B4DCA',
};

// Type-based gradient presets (dark fantasy style)
const TYPE_STYLES: Record<string, { gradient: string; border: string; glow: string }> = {
  attack: {
    gradient: 'from-[#3D1A1A] via-[#5C2626] to-[#2D1212]',
    border: '#C44536',
    glow: 'rgba(196, 69, 54, 0.4)',
  },
  defense: {
    gradient: 'from-[#1A2D3D] via-[#264C5C] to-[#122D3D]',
    border: '#4A7C9B',
    glow: 'rgba(74, 124, 155, 0.4)',
  },
  heal: {
    gradient: 'from-[#1A3D2D] via-[#265C3D] to-[#122D1A]',
    border: '#4A9B5C',
    glow: 'rgba(74, 155, 92, 0.4)',
  },
};

export function Card({ card, index, canPlay }: CardProps) {
  const cardPlayIndex = useAnimationStore(state => state.cardPlayIndex);
  const triggerCardPlay = useAnimationStore(state => state.triggerCardPlay);
  const dispatch = useGameStore(state => state.dispatch);

  const handlePlay = useCallback(() => {
    if (!canPlay) return;
    triggerCardPlay(index);
    setTimeout(() => {
      dispatch({ type: 'PLAY_CARD', payload: { card, cardIndex: index } });
    }, 200);
  }, [canPlay, card, index, dispatch, triggerCardPlay]);

  const rarityBorder = RARITY_BORDERS[card.rarity] || RARITY_BORDERS.starter;
  const typeStyle = TYPE_STYLES[card.type] || TYPE_STYLES.attack;
  const isPlaying = cardPlayIndex === index;

  return (
    <button
      onClick={handlePlay}
      disabled={!canPlay}
      className={`
        relative
        w-28 h-40 sm:w-32 sm:h-44 md:w-36 md:h-48
        min-w-[112px] min-h-[160px]
        rounded-xl
        transition-all duration-200
        select-none
        ${isPlaying ? 'card-play-animation' : ''}
        ${canPlay
          ? 'cursor-pointer active:scale-95 active:shadow-lg'
          : 'opacity-60 cursor-not-allowed'
        }
        text-white
      `}
      style={{
        background: `linear-gradient(180deg, ${typeStyle.gradient})`,
        border: `3px solid ${typeStyle.border}`,
        boxShadow: canPlay
          ? `0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset`
          : '0 2px 8px rgba(0,0,0,0.3)',
        touchAction: 'manipulation',
      }}
    >
      {/* Rarity indicator - gem in corner */}
      <div
        className="absolute top-2 right-2 w-4 h-4 rounded-full"
        style={{
          background: rarityBorder,
          boxShadow: `0 0 8px ${rarityBorder}`,
        }}
      />

      {/* Cost Gem - magical orb */}
      <div
        className="
          absolute -top-3 -left-3
          w-10 h-10 sm:w-9 sm:h-9
          rounded-full
          flex items-center justify-center
          text-lg sm:text-base font-bold
          shadow-lg
        "
        style={{
          background: 'linear-gradient(135deg, #F5D76E 0%, #E9A84D 50%, #D4863D 100%)',
          border: '2px solid #A66A2E',
          boxShadow: '0 2px 8px rgba(212, 134, 61, 0.5), 0 0 15px rgba(212, 134, 61, 0.3)',
          color: '#2D1F42',
        }}
      >
        {card.cost}
      </div>

      {/* Card Art Area - magical seal */}
      <div
        className="
          mx-2 mt-6 sm:mt-7 md:mt-8
          w-[calc(100%-1rem)] aspect-square
          rounded-lg
          flex items-center justify-center
          text-4xl sm:text-5xl md:text-6xl
        "
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
          border: '2px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Type-based icon */}
        {card.type === 'attack' && '⚔️'}
        {card.type === 'defense' && '🛡️'}
        {card.type === 'heal' && '💚'}
      </div>

      {/* Card Name - scroll banner style */}
      <div
        className="
          mx-1 mt-1 sm:mt-2
          px-2 py-0.5
          text-center
          text-xs sm:text-sm font-bold
          rounded
          text-[#F5E6D3]
        "
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(139,115,85,0.3), transparent)',
          fontFamily: 'Georgia, serif',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        {card.name}
      </div>

      {/* Card Description - ancient text style */}
      <div
        className="
          mx-1 mb-1 sm:mb-2
          px-1.5 py-0.5
          text-center text-[10px] sm:text-xs
          text-[#A89B8C]
        "
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {card.description}
      </div>

      {/* Type badge */}
      <div
        className="
          absolute bottom-1 left-1/2 -translate-x-1/2
          px-2 py-0.5
          text-[8px] sm:text-[10px]
          font-bold
          rounded-full
          uppercase tracking-wider
        "
        style={{
          background: typeStyle.border,
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        {card.type === 'attack' ? '攻击' : card.type === 'defense' ? '防御' : '治疗'}
      </div>
    </button>
  );
}