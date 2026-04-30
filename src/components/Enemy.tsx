import { useGameStore } from '../store/gameStore';
import { useAnimationStore } from '../store/animationStore';
import { EnemyIntent } from '../types';

// 精怪边框颜色
const ENEMY_BORDER_COLORS: Record<string, { border: string; glow: string }> = {
  normal: { border: '#8B7355', glow: 'rgba(139, 115, 85, 0.3)' },
  elite: { border: '#C9A227', glow: 'rgba(201, 162, 39, 0.5)' },
  boss: { border: '#C4483E', glow: 'rgba(196, 72, 62, 0.5)' },
};

export function Enemy() {
  const enemy = useGameStore(state => state.enemy);
  const enemyShake = useAnimationStore(state => state.enemyShake);

  if (!enemy) return null;

  const getIntentIcon = (intent: EnemyIntent) => {
    switch (intent) {
      case 'attack':
        return { icon: '⚔️', color: '#8B3029', label: '妖袭', bg: 'rgba(139, 48, 41, 0.2)' };
      case 'charge':
        return { icon: '💀', color: '#4A4541', label: '蓄势', bg: 'rgba(74, 69, 65, 0.2)' };
    }
  };

  const intentInfo = getIntentIcon(enemy.intent);
  const hpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  const borderStyle = ENEMY_BORDER_COLORS[enemy.type] || ENEMY_BORDER_COLORS.normal;

  return (
    <div
      className={`flex flex-col items-center gap-4 ${enemyShake ? 'animate-shake' : ''}`}
      style={{ filter: 'drop-shadow(0 4px 8px rgba(45, 41, 38, 0.2))' }}
    >
      {/* 精怪名称牌 */}
      <div
        className="flex items-center gap-3 px-5 py-2 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(212, 196, 168, 0.95) 0%, rgba(232, 223, 208, 0.95) 100%)',
          border: `2px solid ${borderStyle.border}`,
          boxShadow: `0 2px 10px rgba(0,0,0,0.15), 0 0 20px ${borderStyle.glow}`,
        }}
      >
        <div
          className="text-lg font-bold"
          style={{
            color: '#2D2926',
            fontFamily: 'Georgia, serif',
          }}
        >
          {enemy.name}
        </div>
        {enemy.type !== 'normal' && (
          <span
            className="px-3 py-0.5 text-xs font-bold rounded-full"
            style={{
              background: enemy.type === 'elite'
                ? 'linear-gradient(135deg, #C9A227 0%, #A88B20 100%)'
                : 'linear-gradient(135deg, #C4483E 0%, #8B3029 100%)',
              color: '#FDF8F0',
            }}
          >
            {enemy.type === 'elite' ? '妖精英' : '妖王'}
          </span>
        )}
      </div>

      {/* 精怪画像 - 卷轴框 */}
      <div
        className="
          w-36 h-36 sm:w-40 sm:h-40
          rounded-xl
          flex items-center justify-center
          text-7xl sm:text-8xl
          transition-all duration-300
        "
        style={{
          background: 'linear-gradient(180deg, #FDF8F0 0%, #E8DFD0 100%)',
          border: `4px solid ${borderStyle.border}`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.15), 0 0 30px ${borderStyle.glow}`,
        }}
      >
        <div style={{ filter: 'drop-shadow(0 2px 4px rgba(45,41,38,0.3))' }}>
          {/* 使用emoji作为精怪图腾 */}
          {enemy.name === '九尾狐' && '🦊'}
          {enemy.name === '化蛇' && '🐍'}
          {enemy.name === '穷奇' && '🐯'}
          {enemy.name === '姑获鸟' && '🐦‍⬛'}
          {enemy.name === '何罗鱼' && '🐟'}
          {enemy.name === '鄂名鱼' && '🦈'}
          {enemy.name === '混沌' && '👻'}
          {enemy.name === '梼杌' && '🐺'}
          {enemy.name === '凿齿' && '🦴'}
          {enemy.name === '烛九阴' && '🐉'}
          {enemy.name === '相柳' && '🐍'}
          {enemy.name === '饕餮' && '🦑'}
          {!['九尾狐','化蛇','穷奇','姑获鸟','何罗鱼','鄂名鱼','混沌','梼杌','凿齿','烛九阴','相柳','饕餮'].includes(enemy.name) && '👹'}
        </div>
      </div>

      {/* 精怪血条 */}
      <div className="w-48 sm:w-52">
        <div
          className="flex justify-between text-xs mb-2 px-1"
          style={{ color: '#7A746D' }}
        >
          <span className="font-bold" style={{ color: '#C45C4A' }}>妖气</span>
          <span className="font-mono font-bold" style={{ color: '#2D2926' }}>
            {Math.max(0, enemy.hp)} / {enemy.maxHp}
          </span>
        </div>

        <div
          className="h-6 rounded-xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(180deg, #D4C4A8 0%, #B8A88C 100%)',
            border: '2px solid #8B7355',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div
            className="h-full transition-all duration-500 ease-out relative"
            style={{
              width: `${hpPercent}%`,
              background: hpPercent > 50
                ? 'linear-gradient(180deg, #C45C4A 0%, #8B3029 100%)'
                : hpPercent > 25
                ? 'linear-gradient(180deg, #E06B5A 0%, #C4483E 100%)'
                : 'linear-gradient(180deg, #D66B5A 0%, #8B3029 100%)',
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)' }}
            />
          </div>

          {hpPercent <= 50 && hpPercent > 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold" style={{ color: '#FDF8F0', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                {enemy.hp} / {enemy.maxHp}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 意图显示 - 符咒风格 */}
      <div
        className="flex items-center gap-3 px-6 py-3 rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${intentInfo.bg} 0%, rgba(245, 237, 224, 0.95) 100%)`,
          border: `2px solid ${intentInfo.color}`,
          boxShadow: `0 4px 15px rgba(0,0,0,0.1), 0 0 20px ${intentInfo.color}30`,
        }}
      >
        <span className="text-4xl">{intentInfo.icon}</span>
        <div className="flex flex-col">
          <span
            className="font-bold text-sm"
            style={{ color: intentInfo.color, fontFamily: 'Georgia, serif' }}
          >
            {intentInfo.label}
          </span>
          {enemy.intent === 'attack' && (
            <span className="text-xs" style={{ color: '#7A746D' }}>
              伤害: {enemy.attack}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}