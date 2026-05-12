/**
 * 拼符封印小游戏 · v0.3
 *
 * 增强版：
 *   - 倒计时条（每笔 3s，Boss/精英 1.5s）
 *   - 符阵 SVG 背景（渐进绘制）
 *   - 笔画正确/错误反馈动画
 *   - 提示笔画金色脉冲
 *   - 完美/成功/失败结果动画
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../../../store/GameStore';
import type { StrokeKind, StrokeFeedback } from '../../../types';
import { STROKE_GLYPHS, STROKE_NAMES } from '../../../types';
import { SEAL_FORMATION_PATHS, SEAL_FORMATION_NAMES } from '../../../data/sealFormations';
import { balance } from '../../../config/balance';
import type { SealFormationKind } from '../../../types';

const ALL_STROKES: StrokeKind[] = [
  'dot',
  'horizontal',
  'vertical',
  'slash',
  'hook',
  'loop',
];

/** 可见笔画（按章节解锁，v0.3 全开） */
function getAvailableStrokes(_chapter: string): StrokeKind[] {
  return ALL_STROKES;
}

interface OutcomeState {
  type: 'success' | 'perfect' | 'fail';
  shown: boolean;
}

export function SealMiniGame() {
  const { run, submitStroke } = useGame();
  const ch = run?.battle?.sealChallenge;
  const enemy = run?.battle?.enemies[ch?.enemyIdx ?? -1];

  const [timerMs, setTimerMs] = useState(3000);
  const [timerWidth, setTimerWidth] = useState(100);
  const [feedback, setFeedback] = useState<StrokeFeedback>('idle');
  const [feedbackClass, setFeedbackClass] = useState('');
  const [outcome, setOutcome] = useState<OutcomeState | null>(null);
  const [drawnPaths, setDrawnPaths] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Determine time limit per stroke
  const isPerfectChallenge = enemy?.rank === 'B' || enemy?.rank === 'S';
  const timePerStroke = isPerfectChallenge
    ? balance.seal.timePerStrokePerfect
    : balance.seal.timePerStroke;

  // Reset timer when moving to next stroke
  useEffect(() => {
    if (!ch) return;
    setTimerMs(timePerStroke);
    setTimerWidth(100);
    setFeedback('idle');
    setFeedbackClass('');
    setDrawnPaths(ch.progress);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimerMs((prev) => {
        const next = prev - 50;
        if (next <= 0) {
          // Timeout — treat as wrong
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        setTimerWidth(Math.max(0, (next / timePerStroke) * 100));
        return next;
      });
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ch?.activeStrokeIdx, ch?.progress]);

  const handleTimeout = useCallback(() => {
    setFeedback('wrong');
    setFeedbackClass('anim-wrong');
    setOutcome({ type: 'fail', shown: true });
    setTimeout(() => {
      setOutcome(null);
      submitStroke('dot'); // dummy — engine will handle fail
    }, 800);
  }, [submitStroke]);

  const handleStrokeClick = useCallback((stroke: StrokeKind) => {
    if (!ch || feedback !== 'idle') return;

    const expected = ch.sequence[ch.progress];
    if (stroke === expected) {
      setFeedback('correct');
      setFeedbackClass('anim-correct');
      // Update drawn paths
      setDrawnPaths(ch.progress + 1);

      setTimeout(() => {
        setFeedback('idle');
        setFeedbackClass('');
        submitStroke(stroke);
        // After submit, phase may change (won / back to playerAction / next stroke)
      }, 350);
    } else {
      setFeedback('wrong');
      setFeedbackClass('anim-wrong');
      setOutcome({ type: 'fail', shown: true });
      setTimeout(() => {
        setOutcome(null);
        setFeedback('idle');
        setFeedbackClass('');
        submitStroke(stroke);
      }, 800);
    }
  }, [ch, feedback, submitStroke]);

  // Outcome overlay
  if (outcome?.shown) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-deep/90 backdrop-blur p-4">
        <div className={`text-center ${outcome.type === 'fail' ? 'vignette-fail' : ''}`}>
          {outcome.type === 'success' && (
            <div className="anim-seal-stamp">
              <div className="text-6xl text-ember-glow font-heading">封</div>
              <div className="text-parchment-light font-heading text-2xl mt-2">封印成功</div>
              <div className="text-mist text-sm mt-1">妖卡已入牌组</div>
            </div>
          )}
          {outcome.type === 'perfect' && (
            <div className="anim-seal-stamp">
              <div className="text-6xl text-bone-light font-heading anim-perfect-pulse">封</div>
              <div className="text-bone-light font-heading text-2xl mt-2">完美封印</div>
              <div className="text-parchment/80 text-sm mt-1">升阶妖卡 · 全在时限内</div>
            </div>
          )}
          {outcome.type === 'fail' && (
            <div className="anim-wrong">
              <div className="text-6xl text-vermillion-light font-heading">×</div>
              <div className="text-vermillion-light font-heading text-2xl mt-2">封印失败</div>
              <div className="text-mist text-sm mt-1">笔画错乱，妖逃回</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!run?.battle || !ch || !enemy) return null;

  const expected = ch.sequence[ch.progress];
  const progress = ch.progress;
  const formation = (enemy as { sealFormation?: SealFormationKind }).sealFormation ?? 'ling';
  const paths = SEAL_FORMATION_PATHS[formation] ?? SEAL_FORMATION_PATHS['ling'];
  const formationName = SEAL_FORMATION_NAMES[formation] ?? '灵';
  const availableStrokes = getAvailableStrokes(run.chapter ?? 'qingqiu');

  // Timer color: green → yellow → red
  const timerColor = timerWidth > 50 ? '#4ade80' : timerWidth > 25 ? '#facc15' : '#ef4444';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-deep/90 backdrop-blur p-4">
      {/* 符阵 SVG 背景 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <svg viewBox="0 0 100 100" className="w-72 h-72">
          {paths.map((d: string, i: number) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="#C4551B"
              strokeWidth="1.5"
              strokeDasharray="1000"
              strokeDashoffset={i < drawnPaths ? '0' : '1000'}
              style={{
                animation: i < drawnPaths ? 'strokeDraw 600ms ease-out forwards' : undefined,
              }}
            />
          ))}
        </svg>
      </div>

      <div className={`w-full max-w-lg p-6 bg-ink-soft border-2 border-ember/60 rounded shadow-seal relative ${feedbackClass}`}>
        {/* 符阵名 */}
        <div className="absolute top-2 right-3 text-xs text-mist font-heading tracking-widest opacity-60">
          {formationName}阵
        </div>

        {/* 计时条 */}
        <div className="mb-4">
          <div className="h-2 bg-ink rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-50"
              style={{
                width: `${timerWidth}%`,
                backgroundColor: timerColor,
              }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-mist font-heading">
            <span>{isPerfectChallenge ? '完美挑战' : '普通'}</span>
            <span>{Math.ceil(timerMs / 1000)}s</span>
          </div>
        </div>

        {/* 标题 */}
        <div className="text-center mb-3">
          <div className="text-ember-glow font-heading tracking-widest text-sm mb-1">
            拼 符 封 印
          </div>
          <h2 className="font-heading text-parchment-light text-lg tracking-widest">
            按 顺 序 落 笔
          </h2>
        </div>

        {/* 符阵序列 */}
        <div className="flex gap-2 justify-center mb-4 flex-wrap">
          {ch.sequence.map((s, i) => (
            <div
              key={i}
              className={[
                'w-12 h-12 flex items-center justify-center rounded border-2 text-xl font-heading transition-all',
                i < progress
                  ? 'bg-ember/30 border-ember text-ember-glow'
                  : i === progress
                    ? feedback === 'correct'
                      ? 'bg-jade/30 border-jade text-jade'
                      : 'bg-vermillion/20 border-vermillion-light text-parchment-light animate-pulse'
                    : 'bg-ink border-bone/30 text-bone/50',
              ].join(' ')}
            >
              {i < progress
                ? STROKE_GLYPHS[s]
                : i === progress
                  ? <span className={feedback === 'wrong' ? 'text-vermillion-light' : ''}>{STROKE_GLYPHS[s]}</span>
                  : '？'}
            </div>
          ))}
        </div>

        {/* 下一笔画提示 */}
        <div className="text-center mb-4 text-parchment/85 text-sm">
          下一笔 ·{' '}
          <span className="font-heading text-ember-glow text-base tracking-widest">
            {STROKE_GLYPHS[expected]} {STROKE_NAMES[expected]}
          </span>
        </div>

        {/* 笔画按钮 */}
        <div className="grid grid-cols-3 gap-2">
          {ALL_STROKES.map((s) => {
            const isAvailable = availableStrokes.includes(s);
            return (
              <button
                key={s}
                onClick={() => isAvailable && handleStrokeClick(s)}
                disabled={!isAvailable || feedback !== 'idle'}
                className={[
                  'py-3 rounded border-2 transition-all font-heading relative',
                  !isAvailable
                    ? 'bg-ink border-bone/10 text-bone/20 cursor-not-allowed'
                    : s === expected && feedback === 'idle'
                      ? 'bg-ember/10 border-ember/50 hover:bg-ember/20 hover:border-ember anim-hint-glow'
                      : feedback === 'correct'
                        ? 'bg-jade/20 border-jade'
                        : feedback === 'wrong'
                          ? 'bg-vermillion/10 border-vermillion/40'
                          : 'bg-ink border-bone/30 hover:bg-ink-soft hover:border-bone/60',
                ].join(' ')}
              >
                <div className="text-2xl text-parchment-light">{STROKE_GLYPHS[s]}</div>
                <div className="text-[10px] text-mist mt-0.5 tracking-widest">{STROKE_NAMES[s]}</div>
                {!isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-mist/50">🔒</div>
                )}
              </button>
            );
          })}
        </div>

        {/* 底部提示 */}
        <div className="mt-3 text-center text-mist text-[11px] font-heading tracking-widest italic">
          成功封印 → 妖卡入组 · 完美无错 → 升阶妖卡
        </div>
      </div>
    </div>
  );
}