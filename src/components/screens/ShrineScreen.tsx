/**
 * 祭坛屏 · 升卡 / 删卡 / 静修 / 离去
 */

import { useState } from 'react';
import { useGame } from '../../store/GameStore';
import { Button } from '../ui/Button';
import { Card } from '../card/Card';
import { MistOverlay } from '../art/MistOverlay';
import { CornerFlourish } from '../art/CornerFlourish';
import { balance } from '../../config/balance';
import { cardToInstance } from '../../engine';

type Mode = 'menu' | 'upgrade' | 'remove';

export function ShrineScreen() {
  const { run, shrineAct, advanceFromShrine, shrineMessage } = useGame();
  const [mode, setMode] = useState<Mode>('menu');
  if (!run) return null;

  const costUpgrade = balance.shrine.upgradeCardCost;
  const costRemove = balance.shrine.removeCardCost;
  const canUpgrade = run.currency >= costUpgrade && run.deck.length > 0;
  const canRemove = run.currency >= costRemove && run.deck.length > 1;

  return (
    <div className="relative min-h-screen bg-ink text-parchment flex items-center justify-center px-6 py-10">
      <MistOverlay intensity={0.6} />

      <div
        className="relative max-w-3xl w-full bg-ink-soft border border-bone/50 rounded p-8 shadow-card"
      >
        <CornerFlourish corner="tl" className="absolute top-2 left-2" />
        <CornerFlourish corner="tr" className="absolute top-2 right-2" />
        <CornerFlourish corner="bl" className="absolute bottom-2 left-2" />
        <CornerFlourish corner="br" className="absolute bottom-2 right-2" />

        <div className="text-bone/70 text-xs font-heading tracking-widest text-center mb-1">
          祭 坛
        </div>
        <h1 className="font-heading text-parchment-light text-3xl tracking-widest text-center mb-3">
          瞽 人 · 祝
        </h1>
        <p className="text-mist italic text-center mb-6">
          "你要修，还是要舍？或者，只是坐一会儿。"
        </p>

        <div className="flex justify-center gap-5 mb-6 font-numeric text-sm">
          <span>
            灵气 <span className="text-ember-glow">{run.currency}</span>
          </span>
          <span>
            气血 <span className="text-parchment-light">{run.hp}</span>/{run.maxHp}
          </span>
          <span>牌组 {run.deck.length}</span>
        </div>

        {mode === 'menu' && (
          <div className="flex flex-col gap-3 max-w-md mx-auto">
            <Button
              onClick={() => setMode('upgrade')}
              disabled={!canUpgrade}
            >
              升 阶 一 张 卡 · {costUpgrade} 灵气
            </Button>
            <Button
              onClick={() => setMode('remove')}
              disabled={!canRemove}
            >
              删 除 一 张 卡 · {costRemove} 灵气
            </Button>
            <Button
              variant="secondary"
              onClick={() => shrineAct({ kind: 'rest' })}
              disabled={run.hp >= run.maxHp}
            >
              静 修 · + 10 气血
            </Button>
            <Button variant="ghost" onClick={advanceFromShrine}>
              · 离 去 ·
            </Button>
          </div>
        )}

        {(mode === 'upgrade' || mode === 'remove') && (
          <div>
            <div className="text-center text-mist text-sm mb-4 font-heading tracking-widest">
              选 一 张 卡 {mode === 'upgrade' ? '升 阶' : '删 除'}
            </div>
            <div className="flex flex-wrap gap-4 justify-center max-h-[50vh] overflow-auto">
              {run.deck.map((c, i) => (
                <div key={`${c.id}-${i}`} className="flex flex-col items-center gap-2">
                  <Card card={cardToInstance(c)} width={140} interactive />
                  <Button
                    size="sm"
                    variant={mode === 'remove' ? 'danger' : 'primary'}
                    onClick={() => {
                      shrineAct(
                        mode === 'upgrade'
                          ? { kind: 'upgrade', cardIdx: i }
                          : { kind: 'remove', cardIdx: i },
                      );
                      setMode('menu');
                    }}
                  >
                    {mode === 'upgrade' ? '升' : '删'}
                  </Button>
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
              <Button variant="ghost" size="sm" onClick={() => setMode('menu')}>
                ← 返回
              </Button>
            </div>
          </div>
        )}

        {shrineMessage && (
          <div className="mt-5 text-center text-ember-glow text-sm font-heading tracking-widest">
            {shrineMessage}
          </div>
        )}
      </div>
    </div>
  );
}
