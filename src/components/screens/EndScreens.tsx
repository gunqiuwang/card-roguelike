/**
 * 胜利 / 失败 屏
 */

import { useGame } from '../../store/GameStore';
import { Button } from '../ui/Button';
import { MistOverlay } from '../art/MistOverlay';
import { CornerFlourish } from '../art/CornerFlourish';

export function VictoryScreen() {
  const { meta, returnToTitle, newRun } = useGame();
  return (
    <div className="relative min-h-screen bg-ink text-parchment flex items-center justify-center px-6">
      <MistOverlay intensity={0.9} />
      <div className="relative z-10 max-w-md w-full text-center bg-ink-soft/80 border border-bone/40 rounded p-10">
        <CornerFlourish corner="tl" className="absolute top-2 left-2" />
        <CornerFlourish corner="tr" className="absolute top-2 right-2" />
        <CornerFlourish corner="bl" className="absolute bottom-2 left-2" />
        <CornerFlourish corner="br" className="absolute bottom-2 right-2" />
        <div className="text-ember-glow text-xs font-heading tracking-widest mb-2">
          封 妖 录 · 第 一 卷
        </div>
        <h1 className="font-heading text-parchment-light text-4xl tracking-widest mb-4">
          胜
        </h1>
        <p className="text-parchment italic leading-loose mb-6">
          九尾真身落下。山海的一页，终于被你翻了过去。
          <br />
          更深处，还有更久的沉睡。
        </p>
        <div className="text-mist text-sm mb-6">
          累计通关 {meta.victories} 次 · 累计封妖 {meta.seals} · 图鉴 {meta.unlockedYao.length} 只
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={newRun}>再 启 一 局</Button>
          <Button variant="secondary" onClick={returnToTitle}>
            返 回 标 题
          </Button>
        </div>
      </div>
    </div>
  );
}

export function GameOverScreen() {
  const { run, returnToTitle, newRun } = useGame();
  return (
    <div className="relative min-h-screen bg-ink text-parchment flex items-center justify-center px-6">
      <MistOverlay intensity={1.2} withMoonSpot={false} />
      <div className="relative z-10 max-w-md w-full text-center bg-ink-soft/80 border border-vermillion/50 rounded p-10">
        <CornerFlourish corner="tl" className="absolute top-2 left-2" color="#8B2A1E" />
        <CornerFlourish corner="tr" className="absolute top-2 right-2" color="#8B2A1E" />
        <CornerFlourish corner="bl" className="absolute bottom-2 left-2" color="#8B2A1E" />
        <CornerFlourish corner="br" className="absolute bottom-2 right-2" color="#8B2A1E" />
        <div className="text-vermillion-light text-xs font-heading tracking-widest mb-2">
          气 数 已 尽
        </div>
        <h1 className="font-heading text-parchment-light text-4xl tracking-widest mb-4">
          殁
        </h1>
        <p className="text-parchment italic leading-loose mb-6">
          你倒在荒野之中。风把符纸吹走。
          <br />
          山海不问归处。
        </p>
        {run && (
          <div className="text-mist text-sm mb-6">
            本 局 · 斩 {run.stats.kills} · 封 {run.stats.seals} · 回合 {run.stats.turnsPlayed}
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={newRun}>重 启</Button>
          <Button variant="secondary" onClick={returnToTitle}>
            返 回
          </Button>
        </div>
      </div>
    </div>
  );
}
