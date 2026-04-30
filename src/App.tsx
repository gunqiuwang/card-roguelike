import { useState, useEffect } from 'react';
import { Game } from './components/Game';
import { TitleScreen } from './components/TitleScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useGameStore } from './store/gameStore';
import './index.css';

function App() {
  const [showTitle, setShowTitle] = useState(true);
  const phase = useGameStore(state => state.phase);

  // Auto-hide title when game starts
  useEffect(() => {
    if (phase !== 'idle') {
      setShowTitle(false);
    }
  }, [phase]);

  return (
    <ErrorBoundary>
      {showTitle && phase === 'idle' ? (
        <TitleScreen />
      ) : (
        <Game />
      )}
    </ErrorBoundary>
  );
}

export default App;