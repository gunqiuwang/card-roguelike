/**
 * 地图屏 · 线性 8 节点 · 对应 DESIGN §8.1
 *
 * v0.2.1 改进：
 *   · 顶栏：HP 条 + 灵气 + 牌组 全部可视化（不只是数字）
 *   · 当前节点：大号"开始→"按钮 + 视觉扎眼
 *   · 第一次进入（教程中）：节点卡片带箭头提示
 */

import { useGame } from '../../store/GameStore';
import { Button } from '../ui/Button';
import { HealthBar } from '../ui/HealthBar';
import { MistOverlay } from '../art/MistOverlay';
import { chapterName } from '../../config/game';
import { DeckViewButton } from './partials/DeckView';
import type { NodeKind } from '../../types';

const kindMeta: Record<NodeKind, { label: string; desc: string; color: string }> = {
  battle: { label: '战', desc: '普通战', color: 'bg-ink-soft border-bone/40' },
  elite: { label: '精', desc: '精英战', color: 'bg-vermillion-dark/40 border-vermillion/70' },
  event: { label: '遇', desc: '奇遇', color: 'bg-jade/20 border-jade/60' },
  shrine: { label: '祭', desc: '祭坛 · 升卡 / 删卡 / 静修', color: 'bg-ember/20 border-ember/60' },
  boss: { label: 'Boss', desc: 'Boss 战', color: 'bg-vermillion text-parchment-light border-bone-light' },
  start: { label: '启', desc: '起点', color: 'bg-ink-soft border-bone/40' },
};

export function MapScreen() {
  const { run, enterNode, returnToTitle, meta } = useGame();
  if (!run) return null;
  const cur = run.nodeIndex;
  const isFirstRun = !meta.tutorialDone && cur === 0;

  return (
    <div className="relative min-h-screen bg-ink text-parchment">
      <MistOverlay intensity={0.5} />

      {/* ════════ 顶栏 ════════ */}
      <header className="sticky top-0 z-20 bg-ink-soft/95 border-b border-bone/30 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div>
              <div className="text-bone/70 text-[10px] font-heading tracking-[0.3em]">山 海 志</div>
              <h1 className="font-heading text-parchment-light text-lg tracking-widest">
                {chapterName(String(run.chapter))}
              </h1>
            </div>
            <div className="flex gap-2">
              <DeckViewButton />
              <Button variant="ghost" size="sm" onClick={returnToTitle}>
                ← 返回
              </Button>
            </div>
          </div>

          {/* 玩家状态 */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex-1 min-w-[120px]">
              <div className="flex items-center justify-between mb-1 text-[10px] text-mist font-heading tracking-widest">
                <span>气 血</span>
                <span className="font-numeric text-parchment-light">
                  {run.hp}/{run.maxHp}
                </span>
              </div>
              <HealthBar current={run.hp} max={run.maxHp} />
            </div>
            <div className="text-right">
              <div className="text-[10px] text-mist font-heading tracking-widest mb-1">灵 气</div>
              <div className="font-numeric text-ember-glow text-lg">{run.currency}</div>
            </div>
          </div>
        </div>
      </header>

      {/* ════════ 节点列表 ════════ */}
      <main className="relative z-10 max-w-md mx-auto px-4 py-8">
        {/* 背景云雾纹理 */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 30% 20%, rgba(196,85,27,0.05) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(107,98,89,0.08) 0%, transparent 50%)',
          }}
        />
        <div className="relative">
          {/* 纵向脊线 - 渐变发光 */}
          <div className="absolute left-8 top-0 bottom-0 w-px"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(166,140,91,0.3) 10%, rgba(166,140,91,0.3) 90%, transparent)',
            }}
          />
          {/* 当前节点发光标记 */}
          <div className="absolute left-8 top-0 w-2 h-2 -translate-x-1/2 rounded-full bg-ember-glow shadow-[0_0_8px_rgba(224,138,72,0.8)]"
            style={{ top: `${cur * 96 + 32}px` }}
          />

          {run.map.map((node, i) => {
            const isCur = i === cur;
            const isDone = node.done;
            const meta = kindMeta[node.kind];
            const isFuture = i > cur;
            return (
              <div
                key={node.id}
                className={[
                  'relative mb-5 flex items-center gap-4 transition-all',
                  isCur ? 'scale-[1.01]' : '',
                ].join(' ')}
              >
                {/* 圆形节点编号 */}
                <div
                  className={[
                    'relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center font-heading tracking-widest bg-ink border-2 rounded-full shrink-0 z-10 transition-all',
                    isCur
                      ? 'border-ember-glow ring-4 ring-ember/30 shadow-seal'
                      : isDone
                        ? 'border-bone/20 opacity-40'
                        : 'border-bone/40 hover:border-bone/60',
                  ].join(' ')}
                >
                  {isCur && (
                    <div className="absolute inset-0 rounded-full bg-ember/10 animate-pulse" />
                  )}
                  <div className="text-center relative">
                    <div className={[
                      'text-[9px] leading-none',
                      isCur ? 'text-ember-glow' : 'text-mist',
                    ].join(' ')}>第 {i + 1} 关</div>
                    <div className={[
                      'text-lg leading-tight mt-0.5',
                      isCur ? 'text-ember-glow' : 'text-parchment',
                    ].join(' ')}>{meta.label}</div>
                  </div>
                </div>

                {/* 节点卡片 */}
                <div
                  className={[
                    'flex-1 flex items-center gap-3 px-3 py-2.5 border rounded-lg transition-all',
                    meta.color,
                    isDone ? 'opacity-40' : '',
                    isCur ? 'ring-2 ring-ember-glow shadow-seal' : 'shadow-card',
                    isFuture ? 'opacity-50' : '',
                  ].join(' ')}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-heading tracking-wider text-parchment-light text-sm truncate">
                      {node.label}
                    </div>
                    <div className="text-mist text-[10px] truncate">
                      {meta.desc}
                    </div>
                  </div>
                  {isCur && !isDone && (
                    <Button size="sm" onClick={enterNode} className="whitespace-nowrap">
                      {isFirstRun ? '踏入 →' : '进 入 →'}
                    </Button>
                  )}
                  {isDone && (
                    <span className="text-mist text-[10px] font-heading tracking-widest">
                      已 过
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 首战指引 */}
        {isFirstRun && (
          <div className="mt-6 p-3 bg-ember/10 border border-ember/40 rounded text-center">
            <div className="text-ember-glow font-heading tracking-widest text-sm mb-1">
              ✦ 第 一 战 准 备 ✦
            </div>
            <p className="text-parchment/80 text-xs leading-relaxed">
              点击上方"踏入"开始第一场战斗。
              <br />
              我会在战斗中一步步教你。
            </p>
          </div>
        )}

        {/* 运行统计 */}
        <div className="mt-8 text-mist text-[10px] font-heading tracking-widest text-center">
          回合 {run.stats.turnsPlayed} · 斩 {run.stats.kills} · 封 {run.stats.seals}
        </div>
      </main>
    </div>
  );
}
