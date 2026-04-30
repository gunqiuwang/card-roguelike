import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAnimationStore } from '../store/animationStore';
import { Card as CardType, School } from '../types';

interface CardProps {
  card: CardType;
  index: number;
  canPlay: boolean;
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

  const schoolStyle = SCHOOL_COLORS[card.school] || SCHOOL_COLORS['斩妖'];
  const isPlaying = cardPlayIndex === index;

  return (
    <button
      onClick={handlePlay}
      disabled={!canPlay}
      className={`
        relative
        w-28 h-40 sm:w-32 sm:h-44 md:w-36 md:h-48
        min-w-[112px] min-h-[160px]
        rounded-lg
        transition-all duration-200
        select-none
        ${isPlaying ? 'card-play-animation' : ''}
        ${canPlay ? 'cursor-pointer active:scale-95' : 'opacity-50 cursor-not-allowed'}
      `}
      style={{
        background: `linear-gradient(180deg, ${schoolStyle.gradient})`,
        border: `3px solid ${schoolStyle.border}`,
        boxShadow: canPlay
          ? '0 4px 12px rgba(45, 41, 38, 0.15), inset 0 1px 0 rgba(255,255,255,0.5)'
          : '0 2px 8px rgba(45, 41, 38, 0.1)',
        touchAction: 'manipulation',
      }}
    >
      {/* 费用印章 - 右上角圆形印章 */}
      <div
        className="
          absolute -top-3 -right-3
          w-9 h-9 sm:w-8 sm:h-8
          rounded-full
          flex items-center justify-center
          text-base sm:text-sm font-bold
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

      {/* 流派徽章 - 左上角 */}
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

      {/* 稀有度标记 - 右下角墨点 */}
      <div
        className="absolute bottom-1 right-1 w-3 h-3 rounded-full"
        style={{ background: RARITY_BORDERS[card.rarity] || RARITY_BORDERS.starter }}
      />

      {/* 卡牌图腾区域 - 符咒风格 */}
      <div
        className="
          mx-2 mt-5 sm:mt-6
          w-[calc(100%-1rem)] aspect-square
          rounded-lg
          flex items-center justify-center
          text-4xl sm:text-5xl
        "
        style={{
          background: schoolStyle.border + '15',
          border: `2px dashed ${schoolStyle.border}40`,
        }}
      >
        {/* 流派图标 */}
        <span style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }}>
          {schoolStyle.icon}
        </span>
      </div>

      {/* 卡牌名称 - 墨书风格 */}
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

      {/* 卡牌描述 - 墨色小字 */}
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

      {/* 类型标签 - 底部 */}
      <div
        className="
          absolute bottom-0 left-0 right-0
          py-0.5
          text-center text-[8px]
          rounded-b
        "
        style={{
          background: card.type === 'attack' ? '#8B3029' : card.type === 'defense' ? '#2D4A5C' : '#4A5C2D',
          color: '#FDF8F0',
        }}
      >
        {card.type === 'attack' ? '斩' : card.type === 'defense' ? '护' : '愈'}
      </div>
    </button>
  );
}