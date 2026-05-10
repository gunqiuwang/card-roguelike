/**
 * 牌组查看浮层 · 玩家在任何非战斗/战斗页都能看到自己的整副牌
 */

import { useState } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../card/Card';
import { useGame } from '../../../store/GameStore';
import { cardToInstance } from '../../../engine';

export function DeckViewButton() {
  const { run } = useGame();
  const [open, setOpen] = useState(false);
  if (!run) return null;

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
            className="bg-ink-soft border border-bone/40 rounded max-w-4xl w-full max-h-[85vh] overflow-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-parchment-light text-xl tracking-widest">
                当 前 牌 组（{run.deck.length}/20）
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                × 关闭
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {run.deck.map((c, i) => (
                <Card key={`${c.id}-${i}`} card={cardToInstance(c)} width={150} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
