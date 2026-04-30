import { useEffect, useState } from 'react';

interface FloatingTextProps {
  value: number;
  type: 'damage' | 'heal' | 'block';
  position: { x: number; y: number };
  onComplete: () => void;
}

export function FloatingText({ value, type, position, onComplete }: FloatingTextProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  const colors = {
    damage: 'text-red-500',
    heal: 'text-green-400',
    block: 'text-blue-400',
  };

  const prefixes = {
    damage: '-',
    heal: '+',
    block: '🛡️',
  };

  return (
    <div
      className={`
        absolute font-bold text-2xl pointer-events-none
        ${colors[type]} animate-float-up
        drop-shadow-lg
      `}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {prefixes[type]}{type === 'block' ? '' : value}
    </div>
  );
}