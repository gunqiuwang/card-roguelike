import { useGameStore } from '../store/gameStore';
import { useAnimationStore } from '../store/animationStore';
import { EnemyIntent } from '../types';

const ENEMY_BORDER_COLORS: Record<string, { border: string; glow: string }> = {
  normal: { border: '#5C4A3D', glow: 'rgba(139, 115, 85, 0.3)' },
  elite: { border: '#E9B872', glow: 'rgba(233, 184, 114, 0.5)' },
  boss: { border: '#9B2D5A', glow: 'rgba(155, 45, 90, 0.5)' },
};

const ENEMY_SPRITES: Record<string, string> = {
  normal: '👹',
  elite: '👺',
  boss: '👿',
};

export function Enemy() {
  const enemy = useGameStore(state => state.enemy);
  const enemyShake = useAnimationStore(state => state.enemyShake);

  if (!enemy) return null;

  const getIntentIcon = (intent: EnemyIntent) => {
    switch (intent) {
      case 'attack':
        return { icon: '⚔️', color: '#E74C3C', label: '攻击', bg: 'rgba(196, 69, 54, 0.2)' };
      case 'charge':
        return { icon: '💀', color: '#9B59B6', label: '蓄力', bg: 'rgba(155, 89, 182, 0.2)' };
    }
  };

  const intentInfo = getIntentIcon(enemy.intent);
  const hpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  const sprite = ENEMY_SPRITES[enemy.type] || '👹';
  const borderStyle = ENEMY_BORDER_COLORS[enemy.type] || ENEMY_BORDER_COLORS.normal;

  return (
    <div
      className={`flex flex-col items-center gap-4 ${enemyShake ? 'animate-shake' : ''}`}
      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))' }}
    >
      {/* Enemy Name Banner */}
      <div
        className="flex items-center gap-3 px-5 py-2 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(45, 31, 66, 0.95) 0%, rgba(30, 20, 46, 0.95) 100%)',
          border: `2px solid ${borderStyle.border}`,
          boxShadow: `0 2px 10px rgba(0,0,0,0.4), 0 0 20px ${borderStyle.glow}`,
        }}
      >
        <div
          className="text-lg font-bold"
          style={{
            color: '#F5E6D3',
            fontFamily: 'Georgia, serif',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
          }}
        >
          {enemy.name}
        </div>
        {enemy.type !== 'normal' && (
          <span
            className="px-3 py-0.5 text-xs font-bold rounded-full"
            style={{
              background: enemy.type === 'elite'
                ? 'linear-gradient(135deg, #E9B872 0%, #D4863D 100%)'
                : 'linear-gradient(135deg, #9B2D5A 0%, #6B1E3D 100%)',
              color: '#1A1128',
            }}
          >
            {enemy.type === 'elite' ? '精英' : 'BOSS'}
          </span>
        )}
      </div>

      {/* Enemy Sprite - Castle monster portrait */}
      <div
        className="
          w-36 h-36 sm:w-40 sm:h-40
          rounded-2xl
          flex items-center justify-center
          text-7xl sm:text-8xl
          transition-all duration-300
        "
        style={{
          background: 'linear-gradient(180deg, #2D1F42 0%, #1E142E 100%)',
          border: `4px solid ${borderStyle.border}`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 30px ${borderStyle.glow}, inset 0 -10px 30px rgba(0,0,0,0.3)`,
        }}
      >
        {/* Monster with subtle animation */}
        <div style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
          {sprite}
        </div>
      </div>

      {/* HP Bar - Castle style */}
      <div className="w-48 sm:w-52">
        <div
          className="flex justify-between text-xs mb-2 px-1"
          style={{ color: '#A89B8C' }}
        >
          <span className="font-bold" style={{ color: '#E74C3C' }}>HP</span>
          <span
            className="font-mono font-bold"
            style={{ color: '#F5E6D3', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            {Math.max(0, enemy.hp)} / {enemy.maxHp}
          </span>
        </div>

        <div
          className="h-6 rounded-xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(180deg, #1E142E 0%, #2D1F42 100%)',
            border: '2px solid #3D2A55',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {/* HP Fill */}
          <div
            className="h-full transition-all duration-500 ease-out relative"
            style={{
              width: `${hpPercent}%`,
              background: hpPercent > 50
                ? 'linear-gradient(180deg, #C44536 0%, #922B21 100%)'
                : hpPercent > 25
                ? 'linear-gradient(180deg, #E67E22 0%, #B03A00 100%)'
                : 'linear-gradient(180deg, #9B2D5A 0%, #6B1E3D 100%)',
              boxShadow: hpPercent > 50 ? 'inset 0 2px 4px rgba(255,255,255,0.2)' : 'none',
            }}
          >
            {/* HP shine */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)' }}
            />
          </div>

          {/* HP text overlay when damaged */}
          {hpPercent <= 50 && hpPercent > 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-xs font-bold"
                style={{ color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
              >
                {enemy.hp} / {enemy.maxHp}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Intent Display - Magical crystal ball style */}
      <div
        className="flex items-center gap-3 px-6 py-3 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${intentInfo.bg} 0%, rgba(26, 17, 40, 0.9) 100%)`,
          border: `2px solid ${intentInfo.color}`,
          boxShadow: `0 4px 15px rgba(0,0,0,0.4), 0 0 20px ${intentInfo.color}40`,
        }}
      >
        <span className="text-4xl">{intentInfo.icon}</span>
        <div className="flex flex-col">
          <span
            className="font-bold text-sm"
            style={{ color: intentInfo.color, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            {intentInfo.label}
          </span>
          {enemy.intent === 'attack' && (
            <span
              className="text-xs"
              style={{ color: '#A89B8C' }}
            >
              伤害: {enemy.attack}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}