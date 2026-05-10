/**
 * 祭坛屏 · v0.2.1
 *   菜单：升阶 / 删卡 / 驯妖 / 买秘卷 / 静修 / 离去
 */

import { useState } from 'react';
import { useGame } from '../../store/GameStore';
import { Button } from '../ui/Button';
import { Card } from '../card/Card';
import { MistOverlay } from '../art/MistOverlay';
import { CornerFlourish } from '../art/CornerFlourish';
import { balance } from '../../config/balance';
import { cardToInstance } from '../../engine';
import type { CardInstance } from '../../types';
import { useResponsiveCardWidth } from '../../lib/responsive';

type Mode = 'menu' | 'upgrade' | 'remove' | 'tame' | 'scrolls';

export function ShrineScreen() {
  const { run, shrineAct, advanceFromShrine, shrineMessage, shrineScrolls } = useGame();
  const [mode, setMode] = useState<Mode>('menu');
  const shrineCardWidth = useResponsiveCardWidth('shrine');
  if (!run) return null;

  const costUpgrade = balance.shrine.upgradeCardCost;
  const costRemove = balance.shrine.removeCardCost;
  const costTame = balance.shrine.tameCardCost;

  const yaoCards = run.deck
    .map((c, i) => ({ c, i }))
    .filter(({ c }) => c.type === 'yao');
  const hasYaoCards = yaoCards.length > 0;
  const anyRestless = yaoCards.some(({ c }) => (run.yaoxing?.[c.id] ?? 0) > 0);

  const canUpgrade = run.currency >= costUpgrade && run.deck.length > 0;
  const canRemove = run.currency >= costRemove && run.deck.length > 1;
  const canTame = run.currency >= costTame && hasYaoCards && anyRestless;

  /** 把 run.deck[idx] 包装成带最新 yaoxing 的实例（显示用） */
  const withYx = (cardIdx: number): CardInstance => {
    const c = run.deck[cardIdx];
    const yx = run.yaoxing?.[c.id];
    return cardToInstance(yx !== undefined ? { ...c, yaoxing: yx } : c);
  };

  return (
    <div className="relative min-h-screen bg-ink text-parchment flex items-center justify-center px-4 py-8">
      <MistOverlay intensity={0.6} />

      <div className="relative max-w-3xl w-full bg-ink-soft border border-bone/50 rounded p-4 sm:p-6 shadow-card">
        <CornerFlourish corner="tl" className="absolute top-2 left-2" />
        <CornerFlourish corner="tr" className="absolute top-2 right-2" />
        <CornerFlourish corner="bl" className="absolute bottom-2 left-2" />
        <CornerFlourish corner="br" className="absolute bottom-2 right-2" />

        <div className="text-bone/70 text-xs font-heading tracking-widest text-center mb-1">
          祭 坛
        </div>
        <h1 className="font-heading text-parchment-light text-2xl tracking-widest text-center mb-3">
          瞽 人 · 祝
        </h1>
        <p className="text-mist italic text-center mb-5 text-sm">
          "你要修，还是要舍？或只是坐一会儿，听听妖在牌里哭什么。"
        </p>

        <div className="flex justify-center flex-wrap gap-3 mb-5 font-numeric text-sm">
          <span className="px-2 py-1 bg-ink rounded border border-bone/20">
            灵气 <span className="text-ember-glow">{run.currency}</span>
          </span>
          <span className="px-2 py-1 bg-ink rounded border border-bone/20">
            气血 <span className="text-parchment-light">{run.hp}</span>/{run.maxHp}
          </span>
          <span className="px-2 py-1 bg-ink rounded border border-bone/20">
            牌组 {run.deck.length}
          </span>
          {run.scrolls.length > 0 && (
            <span className="px-2 py-1 bg-ember/10 rounded border border-ember/40 text-ember-glow">
              秘卷 {run.scrolls.length}
            </span>
          )}
        </div>

        {mode === 'menu' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
            <Button onClick={() => setMode('upgrade')} disabled={!canUpgrade}>
              升 阶 · {costUpgrade}
            </Button>
            <Button onClick={() => setMode('remove')} disabled={!canRemove}>
              删 卡 · {costRemove}
            </Button>
            <Button onClick={() => setMode('tame')} disabled={!canTame}>
              驯 妖 · {costTame}
            </Button>
            <Button
              onClick={() => setMode('scrolls')}
              disabled={shrineScrolls.length === 0}
            >
              买 秘 卷
            </Button>
            <Button
              variant="secondary"
              onClick={() => shrineAct({ kind: 'rest' })}
              disabled={run.hp >= run.maxHp}
            >
              静 修 · +10 气血
            </Button>
            <Button variant="ghost" onClick={advanceFromShrine}>
              · 离 去 ·
            </Button>
          </div>
        )}

        {(mode === 'upgrade' || mode === 'remove') && (
          <div>
            <div className="text-center text-mist text-sm mb-3 font-heading tracking-widest">
              选 一 张 卡 {mode === 'upgrade' ? '升 阶' : '删 除'}
            </div>
            <div className="flex flex-wrap gap-3 justify-center max-h-[48vh] overflow-auto">
              {run.deck.map((c, i) => (
                <div key={`${c.id}-${i}`} className="flex flex-col items-center gap-2">
                  <Card card={withYx(i)} width={shrineCardWidth} />
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
            <div className="text-center mt-4">
              <Button variant="ghost" size="sm" onClick={() => setMode('menu')}>
                ← 返回
              </Button>
            </div>
          </div>
        )}

        {mode === 'tame' && (
          <div>
            <div className="text-center text-mist text-sm mb-3 font-heading tracking-widest">
              选 一 张 妖 卡 降 妖 性
            </div>
            <div className="flex flex-wrap gap-3 justify-center max-h-[48vh] overflow-auto">
              {yaoCards.map(({ i }) => {
                const c = run.deck[i];
                const yx = run.yaoxing?.[c.id] ?? 0;
                return (
                  <div key={`${c.id}-${i}`} className="flex flex-col items-center gap-2">
                    <Card card={withYx(i)} width={shrineCardWidth} />
                    <Button
                      size="sm"
                      onClick={() => {
                        shrineAct({ kind: 'tame', cardIdx: i });
                        setMode('menu');
                      }}
                      disabled={yx === 0}
                    >
                      驯（-{balance.shrine.tameAmount}）
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-4">
              <Button variant="ghost" size="sm" onClick={() => setMode('menu')}>
                ← 返回
              </Button>
            </div>
          </div>
        )}

        {mode === 'scrolls' && (
          <div>
            <div className="text-center text-mist text-sm mb-3 font-heading tracking-widest">
              秘 卷 · 被 动 buff · 永 久 生 效
            </div>
            <div className="flex flex-col gap-3 max-w-lg mx-auto">
              {shrineScrolls.map((s) => {
                const owned = run.scrolls.includes(s.id);
                return (
                  <div
                    key={s.id}
                    className="p-3 bg-ink border border-bone/30 rounded"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-heading text-parchment-light tracking-widest">
                        {s.name}
                      </div>
                      <div className="text-ember-glow font-numeric text-sm">
                        {owned ? '已持' : `${s.cost} 灵`}
                      </div>
                    </div>
                    <div className="text-parchment/85 text-xs mb-1">{s.description}</div>
                    <div className="text-mist text-[11px] italic mb-2">{s.flavor}</div>
                    <Button
                      size="sm"
                      variant={owned ? 'secondary' : 'primary'}
                      onClick={() => {
                        shrineAct({ kind: 'buyScroll', scrollId: s.id });
                      }}
                      disabled={owned || run.currency < s.cost}
                    >
                      {owned ? '已持有' : '购买'}
                    </Button>
                  </div>
                );
              })}
              {shrineScrolls.length === 0 && (
                <div className="text-mist italic text-center">· 秘卷已空 ·</div>
              )}
            </div>
            <div className="text-center mt-4">
              <Button variant="ghost" size="sm" onClick={() => setMode('menu')}>
                ← 返回
              </Button>
            </div>
          </div>
        )}

        {shrineMessage && (
          <div className="mt-4 text-center text-ember-glow text-sm font-heading tracking-widest">
            {shrineMessage}
          </div>
        )}
      </div>
    </div>
  );
}
