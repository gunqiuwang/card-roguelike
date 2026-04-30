import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAnimationStore } from '../store/animationStore';
import { Card as CardType, School } from '../types';

interface CardProps {
  card: CardType;
  index: number;
  canPlay: boolean;
  isHovered?: boolean;
}

// 流派边框颜色
const SCHOOL_COLORS: Record<School, { border: string; gradient: string; icon: string }> = {
  '斩妖': {
    border: '#8B3029',
    gradient: 'from-[#FDF8F0] via-[#F8E8E6] to-[#F5DDD9]',
    icon: '⚔️',
  },
  '御灵': {
    border: '#2D4A5C',
    gradient: 'from-[#FDF8F0] via-[#E8EEF2] to-[#D9E4EA]',
    icon: '🛡️',
  },
  '符术': {
    border: '#4A5C2D',
    gradient: 'from-[#FDF8F0] via-[#EEF0E6] to-[#E2E7D9]',
    icon: '☯️',
  },
};

// 稀有度边框
const RARITY_BORDERS: Record<string, string> = {
  starter: '#8B7355',
  common: '#4A7C9B',
  rare: '#9B4DCA',
};

export function Card({ card, index, canPlay, isHovered }: CardProps) {
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

  const schoolStyle = SCHOOL_COLORS[card.school] || SCHOOL_COLORS['斩妖'];
  const isPlaying = cardPlayIndex === index;

  return (
    <button
      onClick={handlePlay}
      disabled={!canPlay}
      className={`
        relative
        w-24 h-36 sm:w-28 sm:h-40 md:w-32 md:h-44
        min-w-[96px] min-h-[144px]
        rounded-lg
        select-none
        transition-all duration-200
        ${isPlaying ? 'card-fly-animation' : ''}
        ${canPlay ? 'cursor-pointer' : 'cursor-not-allowed'}
      `}
      style={{
        background: `linear-gradient(180deg, ${schoolStyle.gradient})`,
        border: `3px solid ${schoolStyle.border}`,
        boxShadow: canPlay
          ? isHovered
            ? '0 12px 30px rgba(45, 41, 38, 0.35), 0 0 25px rgba(196, 72, 62, 0.25)'
            : '0 4px 12px rgba(45, 41, 38, 0.15), inset 0 1px 0 rgba(255,255,255,0.5)'
          : '0 2px 8px rgba(45, 41, 38, 0.1)',
        touchAction: 'manipulation',
        transform: isHovered ? 'translateY(-16px) scale(1.06)' : 'translateY(0) scale(1)',
        zIndex: isHovered ? 100 : 10,
      }}
    >
      {/* 费用印章 */}
      <div
        className="
          absolute -top-3 -right-3
          w-8 h-8 sm:w-7 sm:h-7
          rounded-full
          flex items-center justify-center
          text-sm sm:text-xs font-bold
        "
        style={{
          background: 'linear-gradient(135deg, #C4483E 0%, #8B3029 100%)',
          border: '2px solid #FDF8F0',
          boxShadow: '0 2px 6px rgba(196, 72, 62, 0.4)',
          color: '#FDF8F0',
        }}
      >
        {card.cost}
      </div>

      {/* 流派徽章 */}
      <div
        className="
          absolute top-1 left-1
          px-1.5 py-0.5
          text-[8px] sm:text-[9px]
          font-bold
          rounded
        "
        style={{
          background: schoolStyle.border,
          color: '#FDF8F0',
        }}
      >
        {card.school}
      </div>

      {/* 稀有度标记 */}
      <div
        className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full"
        style={{ background: RARITY_BORDERS[card.rarity] || RARITY_BORDERS.starter }}
      />

      {/* 卡牌图腾区域 */}
      <div
        className="
          mx-2 mt-5 sm:mt-6
          w-[calc(100%-1rem)] aspect-square
          rounded-lg
          flex items-center justify-center
          text-3xl sm:text-4xl
        "
        style={{
          background: schoolStyle.border + '15',
          border: `2px dashed ${schoolStyle.border}40`,
        }}
      >
        <span style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}>
          {schoolStyle.icon}
        </span>
      </div>

      {/* 卡牌名称 */}
      <div
        className="
          mx-1 mt-1 sm:mt-2
          text-center text-xs sm:text-sm font-bold
          truncate
        "
        style={{
          color: '#2D2926',
          fontFamily: 'Georgia, serif',
          textShadow: '0 1px 0 rgba(255,255,255,0.5)',
        }}
      >
        {card.name}
      </div>

      {/* 卡牌描述 */}
      <div
        className="
          mx-1 mb-1 sm:mb-2
          px-1 py-0.5
          text-center text-[9px] sm:text-[10px]
          text-[#4A4541]
          line-clamp-2
        "
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {card.description}
      </div>

      {/* 类型标签 */}
      <div
        className="absolute bottom-0 left-0 right-0 py-0.5 text-center text-[8px] rounded-b"
        style={{
          background: card.type === 'attack' ? '#8B3029' : card.type === 'defense' ? '#2D4A5C' : card.type === 'skill' ? '#4A5C2D' : '#4A7C9B',
          color: '#FDF8F0',
        }}
      >
        {card.type === 'attack' ? '斩' : card.type === 'defense' ? '护' : card.type === 'skill' ? '术' : '愈'}
      </div>
    </button>
  );
}