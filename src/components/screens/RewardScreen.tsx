/**
 * 奖励屏 · 战后 3 选 1
 */

import { useGame } from '../../store/GameStore';
import { Button } from '../ui/Button';
import { Card } from '../card/Card';
import { MistOverlay } from '../art/MistOverlay';
import { cardToInstance } from '../../engine';
import { useResponsiveCardWidth } from '../../lib/responsive';

export function RewardScreen() {
  const { run, takeReward } = useGame();
  const cardWidth = useResponsiveCardWidth('reward');
  if (!run?.pendingReward) return null;
  const rew = run.pendingReward;

  return (
    <div className="relative min-h-screen bg-ink text-parchment flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-10">
      <MistOverlay intensity={0.6} />

      <div className="relative z-10 max-w-3xl w-full text-center">
        <div className="text-bone/70 text-xs font-heading tracking-widest mb-1">
          战 后 所 得
        </div>
        <h1 className="font-heading text-parchment-light text-2xl sm:text-3xl tracking-widest mb-6">
          三 取 其 一
        </h1>
        <div className="mb-6 text-ember-glow font-numeric">
          + {rew.currency} 灵气
        </div>

        <div className="flex gap-3 sm:gap-6 justify-center flex-wrap mb-8 sm:mb-10">
          {rew.cardChoices.map((c, i) => (
            <div key={`${c.id}-${i}`} className="flex flex-col items-center gap-3">
              <Card card={cardToInstance(c)} width={cardWidth} interactive />
              <Button size="sm" onClick={() => takeReward(i)}>
                取 此
              </Button>
            </div>
          ))}
        </div>

        <Button variant="ghost" onClick={() => takeReward('skip')}>
          · 跳 过 ·
        </Button>
      </div>
    </div>
  );
}
