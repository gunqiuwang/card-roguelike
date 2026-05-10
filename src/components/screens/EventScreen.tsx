/**
 * 奇遇事件屏 · 文字 + 3 选 1
 */

import { useGame } from '../../store/GameStore';
import { Button } from '../ui/Button';
import { MistOverlay } from '../art/MistOverlay';
import { CornerFlourish } from '../art/CornerFlourish';
import { getEvent } from '../../data/events';

export function EventScreen() {
  const { run, resolveEventChoice, dismissEvent } = useGame();
  if (!run?.pendingEvent) return null;
  const pe = run.pendingEvent;
  const def = getEvent(pe.eventId);

  return (
    <div className="relative min-h-screen bg-ink text-parchment flex items-center justify-center px-6 py-10">
      <MistOverlay intensity={0.7} />

      <div
        className="relative max-w-xl w-full bg-ink-soft border border-bone/50 rounded p-8 shadow-card"
        style={{ boxShadow: '0 0 0 1px rgba(166,140,91,0.2), 0 4px 16px rgba(0,0,0,0.6)' }}
      >
        <CornerFlourish corner="tl" className="absolute top-2 left-2" />
        <CornerFlourish corner="tr" className="absolute top-2 right-2" />
        <CornerFlourish corner="bl" className="absolute bottom-2 left-2" />
        <CornerFlourish corner="br" className="absolute bottom-2 right-2" />

        <div className="text-bone/70 text-xs font-heading tracking-widest text-center mb-1">
          奇 遇
        </div>
        <h1 className="font-heading text-parchment-light text-3xl tracking-widest text-center mb-5">
          {def.title}
        </h1>
        <p className="text-parchment/85 leading-loose whitespace-pre-line text-center mb-6">
          {def.body}
        </p>

        {!pe.chosenOutcome ? (
          <div className="flex flex-col gap-3">
            {def.choices.map((c, i) => (
              <button
                key={i}
                onClick={() => resolveEventChoice(i)}
                className="text-left p-4 bg-ink border border-bone/30 hover:border-bone rounded transition-colors"
              >
                <div className="font-heading text-parchment-light tracking-widest mb-1">
                  【{c.label}】
                </div>
                <div className="text-mist text-sm">{c.description}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-parchment italic leading-loose mb-6">
              {pe.chosenOutcome.description}
            </p>
            <Button onClick={dismissEvent}>继 续</Button>
          </div>
        )}
      </div>
    </div>
  );
}
