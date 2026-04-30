import { useGameStore } from '../store/gameStore';
import { Card as CardType, CardRarity } from '../types';

const RARITY_COLORS: Record<CardRarity, { bg: string; border: string; glow: string }> = {
  starter: { bg: 'rgba(139, 115, 85, 0.3)', border: '#8B7355', glow: 'rgba(139, 115, 85, 0.3)' },
  common: { bg: 'rgba(74, 124, 155, 0.3)', border: '#4A7C9B', glow: 'rgba(74, 124, 155, 0.4)' },
  rare: { bg: 'rgba(155, 77, 202, 0.3)', border: '#9B4DCA', glow: 'rgba(155, 77, 202, 0.5)' },
};

const TYPE_STYLES: Record<string, { gradient: string; border: string }> = {
  attack: { gradient: 'from-[#3D1A1A] via-[#5C2626] to-[#2D1212]', border: '#C44536' },
  defense: { gradient: 'from-[#1A2D3D] via-[#264C5C] to-[#122D3D]', border: '#4A7C9B' },
  heal: { gradient: 'from-[#1A3D2D] via-[#265C3D] to-[#122D1A]', border: '#4A9B5C' },
};

function RewardCard({ card, onSelect, delayIndex }: { card: CardType; onSelect: () => void; delayIndex: number }) {
  const rarity = RARITY_COLORS[card.rarity] || RARITY_COLORS.common;
  const typeStyle = TYPE_STYLES[card.type] || TYPE_STYLES.attack;

  return (
    <button
      onClick={onSelect}
      className="
        relative
        w-36 h-48 sm:w-40 sm:h-52
        rounded-xl
        cursor-pointer
        transition-all duration-300
        animate-fade-in
      "
      style={{
        animationDelay: `${delayIndex * 100}ms`,
        background: `linear-gradient(180deg, ${typeStyle.gradient})`,
        border: `3px solid ${typeStyle.border}`,
        boxShadow: `0 4px 15px rgba(0,0,0,0.4), 0 0 30px ${rarity.glow}`,
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.08) translateY(-8px)';
        e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.5), 0 0 50px ${rarity.glow}`;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1) translateY(0)';
        e.currentTarget.style.boxShadow = `0 4px 15px rgba(0,0,0,0.4), 0 0 30px ${rarity.glow}`;
      }}
    >
      {/* Cost Gem - magical orb */}
      <div
        className="
          absolute -top-4 -left-4
          w-11 h-11
          rounded-full
          flex items-center justify-center
          text-xl font-bold
          shadow-lg
        "
        style={{
          background: 'linear-gradient(135deg, #F5D76E 0%, #E9A84D 50%, #D4863D 100%)',
          border: '2px solid #A66A2E',
          boxShadow: '0 2px 10px rgba(212, 134, 61, 0.6), 0 0 20px rgba(212, 134, 61, 0.3)',
          color: '#2D1F42',
        }}
      >
        {card.cost}
      </div>

      {/* Rarity badge */}
      <div
        className="
          absolute -top-3 -right-3
          px-2.5 py-1
          text-xs font-bold
          rounded-full
        "
        style={{
          background: rarity.bg,
          border: `2px solid ${rarity.border}`,
          color: '#F5E6D3',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        {card.rarity === 'starter' ? '初始' : card.rarity === 'common' ? '普通' : '稀有'}
      </div>

      {/* Card Art Area - magical seal */}
      <div
        className="
          mx-3 mt-6
          w-[calc(100%-1.5rem)] aspect-square
          rounded-lg
          flex items-center justify-center
          text-5xl sm:text-6xl
        "
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
          border: '2px solid rgba(255,255,255,0.1)',
        }}
      >
        {card.type === 'attack' && '⚔️'}
        {card.type === 'defense' && '🛡️'}
        {card.type === 'heal' && '💚'}
      </div>

      {/* Card Name - scroll banner style */}
      <div
        className="
          mx-2 mt-2
          px-2 py-0.5
          text-center text-sm font-bold
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

      {/* Card Description */}
      <div
        className="
          mx-2 mb-2
          px-1 py-0.5
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
          text-[9px] sm:text-[10px]
          font-bold
          rounded-full
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
        background: 'radial-gradient(ellipse at center, rgba(26, 17, 40, 0.98) 0%, rgba(13, 9, 21, 0.99) 100%)',
      }}
    >
      {/* Decorative glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(212, 134, 61, 0.15) 0%, transparent 50%)',
        }}
      />

      {/* Victory Header - Castle banner */}
      <div
        className="
          flex flex-col items-center
          p-6 rounded-2xl
          animate-fade-in
        "
        style={{
          background: 'linear-gradient(180deg, rgba(45, 31, 66, 0.95) 0%, rgba(30, 20, 46, 0.98) 100%)',
          border: '2px solid #D4863D',
          boxShadow: '0 0 40px rgba(212, 134, 61, 0.3)',
        }}
      >
        {/* Trophy icon */}
        <div
          className="text-5xl mb-2"
          style={{ filter: 'drop-shadow(0 0 15px rgba(212, 134, 61, 0.6))' }}
        >
          🏆
        </div>

        {/* Title */}
        <div
          className="text-2xl font-bold"
          style={{
            fontFamily: 'Georgia, serif',
            color: '#E9B872',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          选择你的奖励
        </div>

        {/* Subtitle */}
        <div
          className="text-sm mt-1"
          style={{ color: '#A89B8C', fontFamily: 'Georgia, serif' }}
        >
          选择一张卡牌加入你的牌库
        </div>
      </div>

      {/* Card Options - Magical scroll style */}
      <div
        className="
          flex gap-5 sm:gap-6
          flex-wrap justify-center
        "
        style={{
          background: 'rgba(26, 17, 40, 0.5)',
          padding: '20px',
          borderRadius: '20px',
          border: '1px solid #3D2A55',
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

      {/* Hint */}
      <div
        className="text-sm"
        style={{ color: '#8B7355', fontFamily: 'Georgia, serif' }}
      >
        点击卡牌以选择
      </div>
    </div>
  );
}