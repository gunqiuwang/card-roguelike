/**
 * 拼符封印小游戏 · 按笔画顺序点按钮
 *
 * 显示：
 *   目标序列（一排 6 个可能笔画）
 *   当前进度：已完成部分高亮
 *   提示：下一笔画闪烁
 *   失败：扣血并退出
 */

import { useGame } from '../../../store/GameStore';
import type { StrokeKind } from '../../../types';
import { STROKE_GLYPHS, STROKE_NAMES } from '../../../types';

const ALL_STROKES: StrokeKind[] = [
  'dot',
  'horizontal',
  'vertical',
  'slash',
  'hook',
  'loop',
];

export function SealMiniGame() {
  const { run, submitStroke } = useGame();
  const ch = run?.battle?.sealChallenge;
  if (!run?.battle || !ch) return null;

  const expected = ch.sequence[ch.progress];
  const progress = ch.progress;
  const total = ch.sequence.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-deep/90 backdrop-blur p-4">
      <div className="w-full max-w-lg p-6 bg-ink-soft border-2 border-ember/60 rounded shadow-seal">
        <div className="text-center mb-4">
          <div className="text-ember-glow font-heading tracking-widest text-sm mb-1">
            拼 符 封 印
          </div>
          <h2 className="font-heading text-parchment-light text-xl tracking-widest">
            按 顺 序 落 笔
          </h2>
          <div className="mt-1 text-mist text-xs font-heading tracking-widest">
            进度 {progress}/{total} · 错一笔则功亏一篑
          </div>
        </div>

        {/* 符阵序列 */}
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {ch.sequence.map((s, i) => (
            <div
              key={i}
              className={[
                'w-14 h-14 flex items-center justify-center rounded border-2 text-2xl font-heading transition-all',
                i < progress
                  ? 'bg-ember/30 border-ember text-ember-glow'
                  : i === progress
                    ? 'bg-vermillion/20 border-vermillion-light text-parchment-light animate-pulse'
                    : 'bg-ink border-bone/30 text-bone/50',
              ].join(' ')}
            >
              {i < progress || i === progress ? STROKE_GLYPHS[s] : '？'}
            </div>
          ))}
        </div>

        {/* 下一笔画提示 */}
        <div className="text-center mb-4 text-parchment/85 text-sm">
          下一笔 ·{' '}
          <span className="font-heading text-ember-glow text-lg tracking-widest">
            {STROKE_GLYPHS[expected]} {STROKE_NAMES[expected]}
          </span>
        </div>

        {/* 笔画按钮 */}
        <div className="grid grid-cols-3 gap-2">
          {ALL_STROKES.map((s) => (
            <button
              key={s}
              onClick={() => submitStroke(s)}
              className={[
                'py-3 rounded border-2 transition-all font-heading',
                s === expected
                  ? 'bg-ember/10 border-ember/50 hover:bg-ember/20 hover:border-ember'
                  : 'bg-ink border-bone/30 hover:bg-ink-soft hover:border-bone/60',
              ].join(' ')}
            >
              <div className="text-2xl text-parchment-light">{STROKE_GLYPHS[s]}</div>
              <div className="text-[10px] text-mist mt-1 tracking-widest">{STROKE_NAMES[s]}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 text-center text-mist text-[11px] font-heading tracking-widest italic">
          成功封印 → 妖卡入组 · 完美无错 → 升阶妖卡
        </div>
      </div>
    </div>
  );
}
