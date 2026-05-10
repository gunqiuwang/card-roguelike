/**
 * 牌组查看浮层 · 玩家在任何非战斗/战斗页都能看到自己的整副牌
 *
 * · 非战斗：展示 run.deck
 * · 战斗中：展示 drawPile / hand / discardPile 三堆（tab 切换）
 */

import { useState, type ReactNode } from 'react';
import { Button } from '../../ui/Button';
import { Card as CardView } from '../../card/Card';
import { useGame } from '../../../store/GameStore';
import { cardToInstance } from '../../../engine';
import type { Card, CardInstance } from '../../../types';

type Pile = 'deck' | 'draw' | 'hand' | 'discard';

export function DeckViewButton() {
  const { run } = useGame();
  const [open, setOpen] = useState(false);
  const inBattle = !!run?.battle;
  const [pile, setPile] = useState<Pile>(inBattle ? 'draw' : 'deck');

  if (!run) return null;

  let cards: (Card | CardInstance)[] = run.deck;
  let title = '当 前 牌 组';
  if (inBattle && run.battle) {
    if (pile === 'draw') {
      cards = [...run.battle.drawPile];
      title = '抽 牌 堆';
    } else if (pile === 'hand') {
      cards = run.battle.hand;
      title = '手 牌';
    } else if (pile === 'discard') {
      cards = run.battle.discardPile;
      title = '弃 牌 堆';
    } else if (pile === 'deck') {
      cards = run.deck;
      title = '当 前 牌 组';
    }
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        牌组 {run.deck.length}
      </Button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-deep/90 backdrop-blur p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-ink-soft border border-bone/40 rounded max-w-5xl w-full max-h-[85vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-parchment-light text-xl tracking-widest">
                {title}
                <span className="text-mist text-sm ml-2">{cards.length}</span>
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                × 关闭
              </Button>
            </div>

            {inBattle && (
              <div className="flex gap-2 mb-4 flex-wrap">
                <PileTab label="抽牌" active={pile === 'draw'} onClick={() => setPile('draw')}>
                  {run.battle!.drawPile.length}
                </PileTab>
                <PileTab label="手牌" active={pile === 'hand'} onClick={() => setPile('hand')}>
                  {run.battle!.hand.length}
                </PileTab>
                <PileTab label="弃牌" active={pile === 'discard'} onClick={() => setPile('discard')}>
                  {run.battle!.discardPile.length}
                </PileTab>
                <PileTab label="牌组" active={pile === 'deck'} onClick={() => setPile('deck')}>
                  {run.deck.length}
                </PileTab>
              </div>
            )}

            <div className="flex flex-wrap gap-4 justify-center">
              {cards.length === 0 ? (
                <div className="text-mist py-8 text-center w-full font-heading tracking-widest">
                  · 空 ·
                </div>
              ) : (
                cards.map((c, i) => (
                  <CardView
                    key={(c as CardInstance).uid ?? `${c.id}-${i}`}
                    card={'uid' in c ? c : cardToInstance(c)}
                    width={140}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function PileTab({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-3 py-1.5 text-xs rounded border font-heading tracking-widest transition-colors',
        active
          ? 'bg-vermillion/30 border-vermillion text-parchment-light'
          : 'bg-ink border-bone/30 text-mist hover:border-bone/60',
      ].join(' ')}
    >
      {label}
      <span className="ml-1.5 font-numeric text-ember-glow">{children}</span>
    </button>
  );
}
