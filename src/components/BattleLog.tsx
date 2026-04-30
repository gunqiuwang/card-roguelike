import { useState } from 'react';

interface BattleLogProps {
  messages: string[];
}

export function BattleLog({ messages }: BattleLogProps) {
  const [visible, setVisible] = useState(true);

  if (messages.length === 0 || !visible) return null;

  return (
    <div className="
      fixed top-32 right-2 sm:right-4
      bg-black/70 backdrop-blur-sm
      rounded-lg p-3
      max-w-[200px] sm:max-w-[250px]
      z-30
      animate-fade-in
    ">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-white/60 font-medium">战斗日志</span>
        <button
          onClick={() => setVisible(false)}
          className="text-white/40 hover:text-white text-lg leading-none"
        >
          ×
        </button>
      </div>
      <div className="space-y-1.5">
        {messages.slice(-4).map((msg, i) => (
          <div
            key={i}
            className="text-xs text-white/90 animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}