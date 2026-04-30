import { useState } from 'react';
import { audioManager } from '../store/audio';

export function SoundToggle() {
  const [muted, setMuted] = useState(audioManager.isMuted());

  const handleToggle = () => {
    const newMuted = audioManager.toggleMute();
    setMuted(newMuted);
  };

  return (
    <button
      onClick={handleToggle}
      className="fixed top-16 left-2 px-3 py-1.5 text-sm bg-gray-800/80 text-white/70 rounded-lg hover:bg-gray-700 z-40"
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}