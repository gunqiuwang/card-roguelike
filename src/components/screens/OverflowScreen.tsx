/**
 * 牌组溢出屏 · 牌组 > 20 时强制删一张
 */

import { useGame } from '../../store/GameStore';
import { Button } from '../ui/Button';
import { Card } from '../card/Card';
import { MistOverlay } from '../art/MistOverlay';
import { cardToInstance } from '../../engine';
import { balance } from '../../config/balance';

export function OverflowScreen() {
  const { run, resolveOverflow } = useGame();
  if (!run?.pendingOverflow) return null;
  const max = balance.player.deckSizeMax;

  return (
    <div className="relative min-h-screen bg-ink text-parchment flex flex-col items-center justify-start px-6 py-10">
      <MistOverlay intensity={0.5} />
      <div className="relative z-10 max-w-5xl w-full">
        <div className="text-center mb-6">
          <div className="text-vermillion-light text-xs font-heading tracking-widest mb-1">
            牌 组 已 满
          </div>
          <h1 className="font-heading text-parchment-light text-2xl tracking-widest mb-2">
            舍 去 一 张
          </h1>
          <p className="text-mist text-sm">
            牌组上限 {max} 张，当前 {run.deck.length}。请选一张删除。
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          {run.deck.map((c, i) => (
            <div key={`${c.id}-${i}`} className="flex flex-col items-center gap-2">
              <Card card={cardToInstance(c)} width={140} interactive />
              <Button
                size="sm"
                variant="danger"
                onClick={() => resolveOverflow(i)}
              >
                舍
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
