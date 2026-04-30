import { useGameStore } from '../store/gameStore';
import { Card as CardType, School, CardRarity } from '../types';

const RARITY_COLORS: Record<CardRarity, { bg: string; border: string }> = {
  starter: { bg: 'rgba(139, 115, 85, 0.3)', border: '#8B7355' },
  common: { bg: 'rgba(74, 124, 155, 0.3)', border: '#4A7C9B' },
  rare: { bg: 'rgba(155, 77, 202, 0.3)', border: '#9B4DCA' },
};

const SCHOOL_STYLES: Record<School, { gradient: string; border: string }> = {
  '斩妖': { gradient: 'from-[#FDF8F0] via-[#F8E8E6] to-[#F5DDD9]', border: '#8B3029' },
  '御灵': { gradient: 'from-[#FDF8F0] via-[#E8EEF2] to-[#D9E4EA]', border: '#2D4A5C' },
  '符术': { gradient: 'from-[#FDF8F0] via-[#EEF0E6] to-[#E2E7D9]', border: '#4A5C2D' },
};

function RewardCard({ card, onSelect, delayIndex }: { card: CardType; onSelect: () => void; delayIndex: number }) {
  const rarity = RARITY_COLORS[card.rarity] || RARITY_COLORS.common;
  const school = SCHOOL_STYLES[card.school] || SCHOOL_STYLES['斩妖'];

  return (
    <button
      onClick={onSelect}
      className="
        relative
        w-36 h-48 sm:w-40 sm:h-52
        rounded-lg
        cursor-pointer
        transition-all duration-300
        animate-fade-in
      "
      style={{
        animationDelay: `${delayIndex * 100}ms`,
        background: `linear-gradient(180deg, ${school.gradient})`,
        border: `3px solid ${school.border}`,
        boxShadow: `0 4px 15px rgba(45, 41, 38, 0.2), 0 0 30px ${rarity.bg}`,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.08) translateY(-8px)';
        e.currentTarget.style.boxShadow = `0 12px 30px rgba(45, 41, 38, 0.3), 0 0 40px ${rarity.bg}`;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
        e.currentTarget.style.boxShadow = `0 4px 15px rgba(45, 41, 38, 0.2), 0 0 30px ${rarity.bg}`;
      }}
    >
      {/* 费用印章 */}
      <div
        className="
          absolute -top-4 -left-4
          w-10 h-10
          rounded-full
          flex items-center justify-center
          text-xl font-bold
        "
        style={{
          background: 'linear-gradient(135deg, #C4483E 0%, #8B3029 100%)',
          border: '2px solid #FDF8F0',
          boxShadow: '0 2px 8px rgba(196, 72, 62, 0.4)',
          color: '#FDF8F0',
        }}
      >
        {card.cost}
      </div>

      {/* 流派标签 */}
      <div
        className="
          absolute top-1 right-1
          px-1.5 py-0.5
          text-[8px] font-bold
          rounded
        "
        style={{
          background: school.border,
          color: '#FDF8F0',
        }}
      >
        {card.school}
      </div>

      {/* 稀有度标记 */}
      <div
        className="absolute bottom-1 right-1 w-3 h-3 rounded-full"
        style={{ background: rarity.border }}
      />

      {/* 卡牌图腾 */}
      <div
        className="
          mx-3 mt-5
          w-[calc(100%-1.5rem)] aspect-square
          rounded-lg
          flex items-center justify-center
          text-5xl sm:text-6xl
        "
        style={{
          background: school.border + '15',
          border: `2px dashed ${school.border}40`,
        }}
      >
        {card.school === '斩妖' && '⚔️'}
        {card.school === '御灵' && '🛡️'}
        {card.school === '符术' && '☯️'}
      </div>

      {/* 卡牌名称 */}
      <div
        className="
          mx-2 mt-2
          text-center text-sm font-bold
          truncate
        "
        style={{
          color: '#2D2926',
          fontFamily: 'Georgia, serif',
        }}
      >
        {card.name}
      </div>

      {/* 卡牌描述 */}
      <div
        className="
          mx-2 mb-2
          text-center text-[10px] sm:text-xs
          text-[#4A4541]
          line-clamp-2
        "
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {card.description}
      </div>
    </button>
  );
}

export function RewardSelection() {
  const rewardOptions = useGameStore(state => state.rewardOptions);
  const dispatch = useGameStore(state => state.dispatch);
  const phase = useGameStore(state => state.phase);

  if (phase !== 'victory' || rewardOptions.length === 0) return null;

  return (
    <div
      className="
        fixed inset-0
        flex flex-col items-center justify-center
        z-50
        gap-6
        p-4
      "
      style={{
        background: 'radial-gradient(ellipse at center, rgba(245, 237, 224, 0.98) 0%, rgba(232, 223, 208, 0.99) 100%)',
      }}
    >
      {/* 胜利横幅 */}
      <div
        className="
          flex flex-col items-center
          p-6 rounded-xl
          animate-fade-in
        "
        style={{
          background: 'linear-gradient(180deg, rgba(253, 248, 240, 0.98) 0%, rgba(212, 196, 168, 0.98) 100%)',
          border: '3px solid #C9A227',
          boxShadow: '0 0 40px rgba(201, 162, 39, 0.3)',
        }}
      >
        <div
          className="text-5xl mb-2"
          style={{ filter: 'drop-shadow(0 2px 8px rgba(201, 162, 39, 0.5))' }}
        >
          🏆
        </div>
        <div
          className="text-2xl font-bold"
          style={{
            fontFamily: 'Georgia, serif',
            color: '#C9A227',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          斩妖成功!
        </div>
        <div
          className="text-sm mt-1"
          style={{ color: '#7A746D', fontFamily: 'Georgia, serif' }}
        >
          选择一张符箓加入牌库
        </div>
      </div>

      {/* 卡牌选项 - 卷轴风格 */}
      <div
        className="
          flex gap-5 sm:gap-6
          flex-wrap justify-center
        "
        style={{
          background: 'rgba(212, 196, 168, 0.5)',
          padding: '20px',
          borderRadius: '12px',
          border: '2px solid #B8A88C',
        }}
      >
        {rewardOptions.map((card, index) => (
          <RewardCard
            key={card.id}
            card={card}
            onSelect={() => dispatch({ type: 'SELECT_REWARD', payload: card })}
            delayIndex={index}
          />
        ))}
      </div>

      {/* 提示文字 */}
      <div
        className="text-sm"
        style={{ color: '#8B7355', fontFamily: 'Georgia, serif' }}
      >
        点击符箓以选择
      </div>
    </div>
  );
}