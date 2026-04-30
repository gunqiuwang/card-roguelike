import { useGameStore } from '../store/gameStore';
import { Card, CardRarity } from '../types';

const RARITY_COLORS: Record<CardRarity, { bg: string; text: string; label: string }> = {
  starter: { bg: 'bg-gray-600', text: 'text-gray-200', label: '初始' },
  common: { bg: 'bg-blue-600', text: 'text-blue-200', label: '普通' },
  rare: { bg: 'bg-purple-600', text: 'text-purple-200', label: '稀有' },
};

function RewardCard({ card, onSelect }: { card: Card; onSelect: () => void }) {
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

  const rarity = RARITY_COLORS[card.rarity] || RARITY_COLORS.common;

  return (
    <button
      onClick={onSelect}
      className={`
        relative w-40 h-52
        bg-gradient-to-b ${typeColors[card.type]}
        rounded-xl border-2 shadow-lg
        flex flex-col items-center justify-between p-3
        cursor-pointer hover:scale-105 hover:shadow-xl
        transition-all duration-200
        text-white
        animate-fade-in
      `}
    >
      {/* Cost */}
      <div className="
        absolute -top-3 -left-3 w-9 h-9
        bg-yellow-500 rounded-full border-2 border-yellow-300
        flex items-center justify-center
        text-lg font-bold text-yellow-900
        shadow-md
        z-10
      ">
        {card.cost}
      </div>

      {/* Rarity Badge */}
      <div className={`
        absolute -top-2 -right-2 px-2 py-0.5
        ${rarity.bg} ${rarity.text}
        text-xs font-bold rounded-full
        z-10
      `}>
        {rarity.label}
      </div>

      <div className="text-4xl mt-3">{typeIcons[card.type]}</div>

      <div className="text-sm font-bold text-center">{card.name}</div>

      <div className="
        w-16 h-16 bg-black/30 rounded-lg
        flex items-center justify-center text-4xl
      ">
        {typeIcons[card.type]}
      </div>

      <div className="text-xs text-center opacity-90">
        {card.description}
      </div>

      {card.multiHit && (
        <div className="absolute bottom-2 right-2 text-xs bg-black/50 px-1 rounded">
          ×{card.multiHit}
        </div>
      )}
    </button>
  );
}

export function RewardSelection() {
  const rewardOptions = useGameStore(state => state.rewardOptions);
  const dispatch = useGameStore(state => state.dispatch);
  const phase = useGameStore(state => state.phase);

  if (phase !== 'victory' || rewardOptions.length === 0) return null;

  return (
    <div className="
      fixed inset-0
      bg-black/85 backdrop-blur-md
      flex flex-col items-center justify-center
      z-50
      gap-8
      p-4
    ">
      {/* Victory Header */}
      <div className="text-center">
        <div className="text-4xl mb-2">🏆</div>
        <div className="text-2xl font-bold text-yellow-400">
          胜利!
        </div>
        <div className="text-white/70 text-sm mt-1">
          选择一张卡牌加入牌库
        </div>
      </div>

      {/* Card Options */}
      <div className="flex gap-6 flex-wrap justify-center">
        {rewardOptions.map((card, index) => (
          <div
            key={card.id}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <RewardCard
              card={card}
              onSelect={() => dispatch({ type: 'SELECT_REWARD', payload: card })}
            />
          </div>
        ))}
      </div>

      {/* Hint */}
      <div className="text-white/50 text-sm">
        点击卡牌以选择
      </div>
    </div>
  );
}