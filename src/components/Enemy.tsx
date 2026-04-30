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
  const hpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);

  return (
    <div className={`flex flex-col items-center gap-3 ${enemyShake ? 'animate-shake' : ''}`}>
      {/* Enemy Name */}
      <div className="text-lg font-bold text-white animate-fade-in">
        {enemy.name}
      </div>

      {/* Enemy Sprite with glow effect */}
      <div className="
        w-32 h-32
        bg-gradient-to-b from-gray-700 to-gray-900
        rounded-2xl border-4 border-gray-600
        flex items-center justify-center
        text-6xl shadow-lg
        transition-all duration-300
        hover:shadow-2xl hover:scale-105
      ">
        👹
      </div>

      {/* HP Bar - Improved animation */}
      <div className="w-44">
        <div className="flex justify-between text-xs text-white/80 mb-1.5">
          <span>HP</span>
          <span className="font-mono">{Math.max(0, enemy.hp)} / {enemy.maxHp}</span>
        </div>
        <div className="h-5 bg-gray-800 rounded-lg overflow-hidden border border-gray-700 relative">
          <div
            className="
              h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400
              transition-all duration-500 ease-out
              relative
            "
            style={{ width: `${hpPercent}%` }}
          >
            {/* HP shine effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
          </div>
          {/* HP text overlay */}
          {hpPercent > 30 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-lg">
                {enemy.hp} / {enemy.maxHp}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Intent - clearer visual */}
      <div className={`
        flex items-center gap-3 px-5 py-2.5 rounded-full
        bg-gray-800/90 border-2 border-gray-600
        ${intentInfo.color}
        transition-all duration-300
        shadow-lg
      `}>
        <span className="text-3xl">{intentInfo.icon}</span>
        <div className="flex flex-col">
          <span className="font-bold text-sm">{intentInfo.label}</span>
          {enemy.intent === 'attack' && (
            <span className="text-xs opacity-80">伤害: {enemy.attack}</span>
          )}
        </div>
      </div>
    </div>
  );
}