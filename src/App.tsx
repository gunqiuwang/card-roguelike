/**
 * 根组件 · 极简路由（无 react-router，v0.1 够用）
 *
 * / → TitleScreen
 * /styleguide → Styleguide
 *
 * 使用 hash 路由，避免刷新丢失。
 */

import { useEffect, useState } from 'react';
import { TitleScreen } from './components/screens/TitleScreen';
import { Styleguide } from './components/screens/Styleguide';

type Route = 'title' | 'styleguide' | 'game';

function parseHash(): Route {
  const h = window.location.hash.replace('#', '').trim();
  if (h === 'styleguide') return 'styleguide';
  if (h === 'game') return 'game';
  return 'title';
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const go = (r: Route) => {
    window.location.hash = r === 'title' ? '' : r;
    setRoute(r);
  };

  if (route === 'styleguide') {
    return <Styleguide onBack={() => go('title')} />;
  }

  if (route === 'game') {
    return (
      <div className="min-h-screen bg-ink text-parchment flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="font-heading text-parchment-light text-3xl tracking-widest mb-4">
            山 海 未 启
          </div>
          <p className="text-mist mb-8 leading-relaxed">
            v0.1 仅含视觉骨架，战斗系统将于 v0.2 封妖 MVP 实装。
            <br />
            请前往样机页审阅视觉。
          </p>
          <div className="flex gap-3 justify-center">
            <button
              className="px-5 py-2 bg-vermillion text-parchment-light rounded font-heading tracking-widest"
              onClick={() => go('title')}
            >
              ← 返回
            </button>
            <button
              className="px-5 py-2 bg-ink-soft border border-bone/40 rounded font-heading text-bone tracking-widest"
              onClick={() => go('styleguide')}
            >
              视觉样机
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TitleScreen
      onStart={() => go('game')}
      onGotoStyleguide={() => go('styleguide')}
    />
  );
}
