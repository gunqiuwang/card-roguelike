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
      className="fixed top-14 left-2 px-3 py-2 text-sm rounded-lg transition-all duration-200 z-40"
      style={{
        background: 'rgba(45, 31, 66, 0.9)',
        border: '1px solid #3D2A55',
        color: '#A89B8C',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = 'rgba(61, 42, 85, 0.9)';
        e.currentTarget.style.color = '#F5E6D3';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'rgba(45, 31, 66, 0.9)';
        e.currentTarget.style.color = '#A89B8C';
      }}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}