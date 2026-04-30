import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useAnimationStore } from '../store/animationStore';
import { EnemyIntent } from '../types';

const ENEMY_BORDER_COLORS: Record<string, { border: string; glow: string }> = {
  normal: { border: '#8B7355', glow: 'rgba(139, 115, 85, 0.3)' },
  elite: { border: '#C9A227', glow: 'rgba(201, 162, 39, 0.5)' },
  boss: { border: '#C4483E', glow: 'rgba(196, 72, 62, 0.5)' },
};

// 精怪emoji图腾
const ENEMY_SPRITES: Record<string, string> = {
  '九尾狐': '🦊',
  '化蛇': '🐍',
  '穷奇': '🐯',
  '姑获鸟': '🐦‍⬛',
  '何罗鱼': '🐟',
  '鄂名鱼': '🦈',
  '混沌': '👻',
  '梼杌': '🐺',
  '凿齿': '🦴',
  '烛九阴': '🐉',
  '相柳': '🐍',
  '饕餮': '🦑',
};

interface FloatingDamageProps {
  value: number;
  type: 'damage' | 'heal';
  key: string;
}

function FloatingDamage({ value, type }: FloatingDamageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={type === 'damage' ? 'animate-damage-pop' : 'animate-heal-pop'}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '2rem',
        fontWeight: 'bold',
        color: type === 'damage' ? '#C4483E' : '#4A7C9B',
        textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 0 10px rgba(196, 72, 62, 0.5)',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      {type === 'damage' ? `-${value}` : `+${value}`}
    </div>
  );
}

// 护盾阻挡提示组件
function BlockFlash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="animate-block-flash"
      style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#5C8A4A',
        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
        pointerEvents: 'none',
        zIndex: 101,
      }}
    >
      🛡️ 挡住
    </div>
  );
}

// 斩妖连击特效组件
function ZhanyaoComboFlash({ combo }: { combo: number }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || combo < 2) return null;

  const intensity = Math.min(combo - 1, 5); // 最高5级特效
  const colors = ['#8B3029', '#A83229', '#C4483E', '#D66B5A', '#E08868'];

  return (
    <div
      className="animate-zhanyao-rage"
      style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: `${1.2 + intensity * 0.15}rem`,
        fontWeight: 'bold',
        color: colors[intensity - 1] || colors[4],
        textShadow: `0 0 ${10 + intensity * 5}px ${colors[intensity - 1] || colors[4]}80`,
        pointerEvents: 'none',
        zIndex: 102,
        fontFamily: 'Georgia, serif',
      }}
    >
      ⚔️ 斩 {combo}
    </div>
  );
}

// 御灵护体回响反击特效组件
function ShieldEchoFlash({ damage }: { damage: number }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || damage <= 0) return null;

  return (
    <div
      className="animate-shield-echo"
      style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#E5C04D',
        textShadow: '0 0 15px #2D4A5C, 0 0 30px rgba(45, 74, 92, 0.8)',
        pointerEvents: 'none',
        zIndex: 103,
        fontFamily: 'Georgia, serif',
      }}
    >
      ⚡ 回响反击 +{damage}
    </div>
  );
}

// 符链共鸣特效组件
function FuchainFlash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="animate-fuchain-pop"
      style={{
        position: 'absolute',
        top: '5%',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#E5C04D',
        textShadow: '0 0 15px #4A5C2D, 0 0 30px rgba(74, 90, 45, 0.8)',
        pointerEvents: 'none',
        zIndex: 104,
        fontFamily: 'Georgia, serif',
      }}
    >
      ✨ 符链共鸣：抽1 + 灵气1
    </div>
  );
}

export function Enemy() {
  const enemy = useGameStore(state => state.enemy);
  const enemyShake = useAnimationStore(state => state.enemyShake);
  const zhanyaoCombo = useAnimationStore(state => state.zhanyaoCombo);
  const shieldEcho = useAnimationStore(state => state.shieldEcho);
  const fuchain = useAnimationStore(state => state.fuchain);
  const [displayEnemy, setDisplayEnemy] = useState(enemy);
  const [floatingDamages, setFloatingDamages] = useState<FloatingDamageProps[]>([]);
  const [showBlockFlash, setShowBlockFlash] = useState(false);
  const [showZhanyaoFlash, setShowZhanyaoFlash] = useState(0);
  const [showShieldEchoFlash, setShowShieldEchoFlash] = useState(0);
  const [showFuchainFlash, setShowFuchainFlash] = useState(false);

  // 斩妖连击特效触发
  useEffect(() => {
    if (zhanyaoCombo > 0) {
      setShowZhanyaoFlash(zhanyaoCombo);
    }
  }, [zhanyaoCombo]);

  // 御灵护体回响特效触发
  useEffect(() => {
    if (shieldEcho > 0) {
      setShowShieldEchoFlash(shieldEcho);
    }
  }, [shieldEcho]);

  // 符链共鸣特效触发
  useEffect(() => {
    if (fuchain) {
      setShowFuchainFlash(true);
    }
  }, [fuchain]);

  // 当敌人HP变化时显示伤害数字
  useEffect(() => {
    if (enemy && displayEnemy && enemy.hp !== displayEnemy.hp) {
      const damage = displayEnemy.hp - enemy.hp;
      if (damage > 0) {
        setFloatingDamages(prev => [...prev, { value: damage, type: 'damage', key: Date.now().toString() }]);
        setTimeout(() => {
          setFloatingDamages(prev => prev.slice(1));
        }, 800);
      }
    }
    setDisplayEnemy(enemy);
  }, [enemy?.hp]);

  // 监听敌人被阻挡（通过displayEnemy.block变化）
  useEffect(() => {
    if (displayEnemy && enemy && enemy.hp < displayEnemy.hp) {
      // 有伤害但敌人血量没怎么掉，说明被挡住了
      const damage = displayEnemy.hp - enemy.hp;
      if (damage > 0 && enemy.hp >= displayEnemy.hp - 5) {
        // 说明有格挡
        setShowBlockFlash(true);
        setTimeout(() => setShowBlockFlash(false), 600);
      }
    }
    setDisplayEnemy(enemy);
  }, [enemy?.hp]);

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
  const sprite = ENEMY_SPRITES[enemy.name] || '👹';
  const borderStyle = ENEMY_BORDER_COLORS[enemy.type] || ENEMY_BORDER_COLORS.normal;

  return (
    <div
      className={`flex flex-col items-center gap-3 ${enemyShake ? 'animate-enemy-hit' : ''}`}
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
          className="text-base sm:text-lg font-bold"
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

      {/* 精怪画像 - 带伤害显示 */}
      <div
        className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-xl flex items-center justify-center text-6xl sm:text-7xl transition-all duration-300"
        style={{
          background: 'linear-gradient(180deg, #FDF8F0 0%, #E8DFD0 100%)',
          border: `4px solid ${borderStyle.border}`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.15), 0 0 30px ${borderStyle.glow}`,
        }}
      >
        {/* 浮动伤害数字 */}
        {floatingDamages.map(d => (
          <FloatingDamage key={d.key} value={d.value} type={d.type} />
        ))}

        {/* 护盾阻挡提示 */}
        {showBlockFlash && <BlockFlash />}

        {/* 斩妖连击特效 */}
        {showZhanyaoFlash >= 2 && <ZhanyaoComboFlash combo={showZhanyaoFlash} />}

        {/* 御灵护体回响反击特效 */}
        {showShieldEchoFlash > 0 && <ShieldEchoFlash damage={showShieldEchoFlash} />}

        {/* 符链共鸣特效 */}
        {showFuchainFlash && <FuchainFlash />}

        <div style={{ filter: 'drop-shadow(0 2px 4px rgba(45,41,38,0.3))' }}>
          {sprite}
        </div>
      </div>

      {/* 精怪血条 */}
      <div className="w-44 sm:w-48">
        <div
          className="flex justify-between text-xs mb-1.5 px-1"
          style={{ color: '#7A746D' }}
        >
          <span className="font-bold" style={{ color: '#C45C4A' }}>妖气</span>
          <span className="font-mono font-bold" style={{ color: '#2D2926' }}>
            {Math.max(0, enemy.hp)} / {enemy.maxHp}
          </span>
        </div>

        <div
          className="h-5 sm:h-6 rounded-xl overflow-hidden relative"
          style={{
            background: 'linear-gradient(180deg, #D4C4A8 0%, #B8A88C 100%)',
            border: '2px solid #8B7355',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <div
            className="h-full transition-all duration-300 ease-out relative"
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
                {enemy.hp}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 意图显示 */}
      <div
        className="flex items-center gap-3 px-5 py-2.5 rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${intentInfo.bg} 0%, rgba(245, 237, 224, 0.95) 100%)`,
          border: `2px solid ${intentInfo.color}`,
          boxShadow: `0 4px 15px rgba(0,0,0,0.1), 0 0 20px ${intentInfo.color}30`,
        }}
      >
        <span className="text-3xl">{intentInfo.icon}</span>
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