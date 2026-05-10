/**
 * 地图屏 · 线性 8 节点 · 对应 DESIGN §8.1
 */

import { useGame } from '../../store/GameStore';
import { Button } from '../ui/Button';
import { MistOverlay } from '../art/MistOverlay';
import { chapterName } from '../../config/game';
import { DeckViewButton } from './partials/DeckView';
import type { NodeKind } from '../../types';

const kindLabel: Record<NodeKind, string> = {
  battle: '战',
  elite: '精',
  event: '遇',
  shrine: '祭',
  boss: 'Boss',
  start: '启',
};

const kindColor: Record<NodeKind, string> = {
  battle: 'bg-ink-soft border-bone/40',
  elite: 'bg-vermillion-dark/40 border-vermillion/70',
  event: 'bg-jade/20 border-jade/60',
  shrine: 'bg-ember/20 border-ember/60',
  boss: 'bg-vermillion text-parchment-light border-bone-light',
  start: 'bg-ink-soft border-bone/40',
};

export function MapScreen() {
  const { run, enterNode, returnToTitle } = useGame();
  if (!run) return null;
  const cur = run.nodeIndex;

  return (
    <div className="relative min-h-screen bg-ink text-parchment">
      <MistOverlay intensity={0.7} />

      {/* 顶栏 · HP / 灵气 / 章节 */}
      <header className="sticky top-0 z-20 bg-ink-soft/95 border-b border-bone/20">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <div>
            <div className="text-bone/70 text-xs font-heading tracking-widest">山 海 志</div>
            <h1 className="font-heading text-parchment-light text-xl tracking-wider">
              {chapterName(String(run.chapter))}
            </h1>
          </div>
          <div className="flex items-center gap-5 font-numeric text-sm">
            <span>
              气血 <span className="text-parchment-light">{run.hp}</span>/{run.maxHp}
            </span>
            <span>
              灵气 <span className="text-ember-glow">{run.currency}</span>
            </span>
          </div>
          <div className="flex gap-2">
            <DeckViewButton />
            <Button variant="ghost" size="sm" onClick={returnToTitle}>
              返回
            </Button>
          </div>
        </div>
      </header>

      {/* 节点列表 */}
      <main className="relative z-10 max-w-md mx-auto px-6 py-10">
        <div className="relative">
          {/* 纵向脊线 */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-bone/20 -translate-x-1/2" />

          {run.map.map((node, i) => {
            const isCur = i === cur;
            const isDone = node.done;
            return (
              <div
                key={node.id}
                className="relative mb-6 flex items-center justify-center"
              >
                <div
                  className={[
                    'relative flex items-center gap-3 px-4 py-3 border rounded w-full',
                    kindColor[node.kind],
                    isDone ? 'opacity-40' : '',
                    isCur ? 'ring-2 ring-ember-glow shadow-seal' : '',
                  ].join(' ')}
                >
                  <div className="w-10 h-10 flex items-center justify-center font-heading tracking-widest text-sm bg-ink border border-bone/30 rounded-full shrink-0">
                    {kindLabel[node.kind]}
                  </div>
                  <div className="flex-1">
                    <div className="font-heading tracking-wider text-parchment-light">
                      {node.label}
                    </div>
                    <div className="text-mist text-xs">
                      {node.kind === 'battle' && `普通战`}
                      {node.kind === 'elite' && `精英战`}
                      {node.kind === 'boss' && `Boss 战`}
                      {node.kind === 'event' && `奇遇`}
                      {node.kind === 'shrine' && `祭坛`}
                    </div>
                  </div>
                  {isCur && !isDone && (
                    <Button size="sm" onClick={enterNode}>
                      进 入
                    </Button>
                  )}
                  {isDone && (
                    <span className="text-mist text-xs font-heading tracking-widest">
                      已 过
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 运行统计 */}
        <div className="mt-8 text-mist text-xs font-heading tracking-widest text-center">
          回合 {run.stats.turnsPlayed} · 斩 {run.stats.kills} · 封 {run.stats.seals}
        </div>
      </main>
    </div>
  );
}
