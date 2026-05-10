/**
 * 根组件 · 通过 GameStore 分发屏幕
 *
 * 保留 /styleguide hash 路由作为独立视觉样机页（不走 store）。
 */

import { useEffect, useState } from 'react';
import { TitleScreen } from './components/screens/TitleScreen';
import { Styleguide } from './components/screens/Styleguide';
import { MapScreen } from './components/screens/MapScreen';
import { BattleScreen } from './components/screens/BattleScreen';
import { RewardScreen } from './components/screens/RewardScreen';
import { EventScreen } from './components/screens/EventScreen';
import { ShrineScreen } from './components/screens/ShrineScreen';
import { OverflowScreen } from './components/screens/OverflowScreen';
import { VictoryScreen, GameOverScreen } from './components/screens/EndScreens';
import { CodexScreen } from './components/screens/CodexScreen';
import { GameProvider, useGame } from './store/GameStore';

function isStyleguideHash(): boolean {
  return window.location.hash.replace('#', '').trim() === 'styleguide';
}

function Router() {
  const { screen } = useGame();
  switch (screen) {
    case 'title':
      return (
        <TitleScreen
          onGotoStyleguide={() => {
            window.location.hash = 'styleguide';
          }}
        />
      );
    case 'map':
      return <MapScreen />;
    case 'battle':
      return <BattleScreen />;
    case 'reward':
      return <RewardScreen />;
    case 'event':
      return <EventScreen />;
    case 'shrine':
      return <ShrineScreen />;
    case 'overflow':
      return <OverflowScreen />;
    case 'victory':
      return <VictoryScreen />;
    case 'gameOver':
      return <GameOverScreen />;
    case 'codex':
      return <CodexScreen />;
    case 'styleguide':
      return null; // 由外部 hash 路由控制
  }
}

export default function App() {
  const [styleguide, setStyleguide] = useState(isStyleguideHash);

  useEffect(() => {
    const onHash = () => setStyleguide(isStyleguideHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (styleguide) {
    return (
      <Styleguide
        onBack={() => {
          window.location.hash = '';
          setStyleguide(false);
        }}
      />
    );
  }

  return (
    <GameProvider>
      <Router />
    </GameProvider>
  );
}
