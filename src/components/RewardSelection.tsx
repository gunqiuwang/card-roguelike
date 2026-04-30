import { useGameStore } from '../store/gameStore';
import { Card as CardType } from '../types';

function RewardCard({ card, onSelect }: { card: CardType; onSelect: () => void }) {
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
      onClick={onSelect}
      className={`
        w-36 h-48
        bg-gradient-to-b ${typeColors[card.type]}
        rounded-xl border-2 shadow-lg
        flex flex-col items-center justify-between p-3
        cursor-pointer hover:scale-105 hover:shadow-xl
        transition-all duration-200
        text-white
      `}
    >
      {/* Cost */}
      <div className="
        absolute -top-3 -left-3 w-8 h-8
        bg-yellow-500 rounded-full border-2 border-yellow-300
        flex items-center justify-center
        text-lg font-bold text-yellow-900
        shadow-md
      ">
        {card.cost}
      </div>

      <div className="text-4xl mt-2">{typeIcons[card.type]}</div>

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
      bg-black/80 backdrop-blur-sm
      flex flex-col items-center justify-center
      z-50
      gap-6
    ">
      <div className="text-2xl font-bold text-yellow-400">
        选择一张卡牌加入牌库
      </div>

      <div className="flex gap-6 flex-wrap justify-center px-4">
        {rewardOptions.map(card => (
          <div key={card.id} className="relative">
            <RewardCard
              card={card}
              onSelect={() => dispatch({ type: 'SELECT_REWARD', payload: card })}
            />
          </div>
        ))}
      </div>

      <div className="text-white/60 text-sm">
        点击卡牌以选择
      </div>
    </div>
  );
}