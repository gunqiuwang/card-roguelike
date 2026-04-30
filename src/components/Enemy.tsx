import { useGameStore } from '../store/gameStore';
import { useAnimationStore } from '../store/animationStore';
import { EnemyIntent } from '../types';

export function Enemy() {
  const enemy = useGameStore(state => state.enemy);
  const enemyShake = useAnimationStore(state => state.enemyShake);

  if (!enemy) return null;

  const getIntentIcon = (intent: EnemyIntent) => {
    switch (intent) {
      case 'attack':
        return { icon: '⚔️', color: 'text-red-400', label: '攻击' };
      case 'charge':
        return { icon: '💀', color: 'text-purple-400', label: '蓄力' };
    }
  };

  const intentInfo = getIntentIcon(enemy.intent);
  const hpPercent = (enemy.hp / enemy.maxHp) * 100;

  return (
    <div className={`flex flex-col items-center gap-3 ${enemyShake ? 'animate-shake' : ''}`}>
      {/* Enemy Name */}
      <div className="text-lg font-bold text-white">
        {enemy.name}
      </div>

      {/* Enemy Sprite */}
      <div className="
        w-32 h-32
        bg-gradient-to-b from-gray-700 to-gray-900
        rounded-2xl border-4 border-gray-600
        flex items-center justify-center
        text-6xl shadow-lg
        transition-transform duration-200
      ">
        👹
      </div>

      {/* HP Bar */}
      <div className="w-40 h-4 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
        <div
          className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300"
          style={{ width: `${hpPercent}%` }}
        />
      </div>

      {/* HP Text */}
      <div className="text-sm text-white/80">
        HP: {enemy.hp} / {enemy.maxHp}
      </div>

      {/* Intent */}
      <div className={`
        flex items-center gap-2 px-4 py-2 rounded-full
        bg-gray-800/80 border border-gray-600
        ${intentInfo.color}
      `}>
        <span className="text-2xl">{intentInfo.icon}</span>
        <span className="font-bold">{intentInfo.label}</span>
        {enemy.intent === 'attack' && (
          <span className="text-sm">-{enemy.attack}</span>
        )}
      </div>
    </div>
  );
}