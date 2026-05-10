/**
 * 图鉴屏 · Meta 长线
 *
 * 展示：
 *   · 封印过的妖（立绘 + 名 + flavor）
 *   · 未解锁的妖（?? + 银灰剪影）
 */

import { useGame } from '../../store/GameStore';
import { Button } from '../ui/Button';
import { MistOverlay } from '../art/MistOverlay';
import { Portrait } from '../art/Portrait';
import { ALL_YAO } from '../../data/yao';

export function CodexScreen() {
  const { meta, returnToTitle } = useGame();
  const unlocked = new Set(meta.unlockedYao);

  return (
    <div className="relative min-h-screen bg-ink text-parchment">
      <MistOverlay intensity={0.7} />
      <header className="sticky top-0 z-20 bg-ink-soft/95 border-b border-bone/20 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-bone/70 text-xs font-heading tracking-widest">封 妖 录</div>
            <h1 className="font-heading text-parchment-light text-xl tracking-wider">图 鉴</h1>
          </div>
          <div className="hidden sm:block text-mist text-xs font-heading tracking-widest text-center">
            通关 {meta.victories} · 封 {meta.seals} · 已录 {unlocked.size}/{ALL_YAO.length}
          </div>
          <Button variant="ghost" size="sm" onClick={returnToTitle}>
            ← 返 回
          </Button>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="sm:hidden text-mist text-xs font-heading tracking-widest text-center mb-4">
          通关 {meta.victories} · 封 {meta.seals} · 已录 {unlocked.size}/{ALL_YAO.length}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {ALL_YAO.map((y) => {
            const known = unlocked.has(y.id);
            return (
              <div
                key={y.id}
                className={[
                  'relative flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 border rounded',
                  known
                    ? 'bg-ink-soft border-bone/40'
                    : 'bg-ink-deep border-bone/15 opacity-70',
                ].join(' ')}
              >
                <div
                  className="rounded-sm overflow-hidden border border-bone/30 shrink-0 self-center sm:self-auto"
                  style={{ width: 96, height: 128 }}
                >
                  <Portrait
                    src={known ? y.artSrc : undefined}
                    fallbackKind={y.silhouette}
                    silhouetteVariant="onDark"
                    className="w-full h-full"
                    alt={y.name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-parchment-light text-lg tracking-widest">
                      {known ? y.name : '？？？'}
                    </span>
                    <span
                      className={[
                        'text-[11px] px-1.5 py-0.5 border rounded-sm font-heading tracking-widest',
                        y.rank === 'C' && 'border-bone/50 text-bone',
                        y.rank === 'B' && 'border-ember/60 text-ember-glow',
                        y.rank === 'S' && 'border-vermillion/60 text-vermillion-light',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {y.rank}
                    </span>
                  </div>
                  <div className="text-mist text-xs font-heading tracking-widest mt-1">
                    {y.chapter}
                  </div>
                  <p className="mt-2 text-parchment/85 text-sm italic leading-relaxed">
                    {known ? y.flavor : '封印之后，方可得闻。'}
                  </p>
                  {known && (
                    <div className="mt-2 text-mist text-xs">
                      封后卡 · 《{y.sealedCard.name}》
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
