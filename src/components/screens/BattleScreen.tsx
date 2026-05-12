/**
 * 战斗屏 · v0.2.1 · 清晰分区重排
 *
 * 布局（手机优先，桌面居中 640px）：
 *   ┌──────────────────────────────────────────┐
 *   │ ← 返回  ·  方士 · 青丘残岭 · [牌组 12]   │ ← 顶栏（固定）
 *   │ 气血 65/70 ▓▓▓▓░░  气 3/3  ·  回合 2    │
 *   ├──────────────────────────────────────────┤
 *   │                                          │
 *   │            ⚔ 6   ← 意图                  │
 *   │         ┌────────┐                       │
 *   │         │ 青狐   │  ← 敌人立绘（大，居中）│
 *   │         │        │                       │
 *   │         └────────┘                       │
 *   │         HP 18/30  🩸 毒2                  │
 *   │                                          │
 *   │ ─────── 最近一条日志 ────────             │
 *   ├──────────────────────────────────────────┤
 *   │ 抽 8 · 弃 2 · [牌组]       [结束回合]    │ ← 底栏（固定）
 *   │ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐                │
 *   │ │烈│ │镇│ │桃│ │抽│ │烈│  ← 手牌         │
 *   │ └──┘ └──┘ └──┘ └──┘ └──┘                │
 *   └──────────────────────────────────────────┘
 *
 * 关键：
 *   · 顶/底栏 position:sticky，内容区独立滚动
 *   · 敌人可点击 = 多敌切 target
 *   · 出牌 = 点卡片（卡本身就是 <button>）
 *   · 未激活时 data-zone 给 TutorialOverlay 定位用
 */

import { useEffect, useState } from 'react';
import { useGame } from '../../store/GameStore';
import { Button } from '../ui/Button';
import { HealthBar } from '../ui/HealthBar';
import { EnergyOrb } from '../ui/EnergyOrb';
import { FloatingNumber } from '../ui/FloatingNumber';
import { Card } from '../card/Card';
import { Portrait } from '../art/Portrait';
import { intentOf } from '../../engine';
import { YinYangBar } from '../ui/YinYangBar';
import type { EnemyState } from '../../types';
import { DeckViewButton } from './partials/DeckView';
import { TutorialOverlay } from './partials/TutorialOverlay';
import { SealMiniGame } from './partials/SealMiniGame';
import { useResponsiveCardWidth } from '../../lib/responsive';

function StatusBadges({ enemy }: { enemy: EnemyState }) {
  const s = enemy.status;
  return (
    <div className="flex gap-1 flex-wrap justify-center mt-1">
      {s.poison > 0 && <Badge color="jade">毒 {s.poison}</Badge>}
      {s.weak > 0 && <Badge color="mist">虚 {s.weak}</Badge>}
      {s.vulnerable > 0 && <Badge color="vermillion">易 {s.vulnerable}</Badge>}
      {s.intentSealed > 0 && <Badge color="ember">意封</Badge>}
    </div>
  );
}

function PlayerStatusBadges() {
  const { run } = useGame();
  if (!run?.battle) return null;
  const s = run.battle.playerStatus;
  if (s.poison === 0 && s.weak === 0 && s.vulnerable === 0) return null;
  return (
    <div className="flex gap-1 flex-wrap">
      {s.poison > 0 && <Badge color="jade">毒 {s.poison}</Badge>}
      {s.weak > 0 && <Badge color="mist">虚 {s.weak}</Badge>}
      {s.vulnerable > 0 && <Badge color="vermillion">易 {s.vulnerable}</Badge>}
    </div>
  );
}

function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: 'jade' | 'mist' | 'vermillion' | 'ember';
}) {
  const cls = {
    jade: 'bg-jade/30 border-jade/60 text-jade',
    mist: 'bg-mist/30 border-mist text-mist',
    vermillion: 'bg-vermillion/30 border-vermillion/60 text-vermillion-light',
    ember: 'bg-ember/30 border-ember/60 text-ember-glow',
  }[color];
  return (
    <span
      className={[
        'text-[10px] px-1.5 py-0.5 border rounded-sm font-numeric',
        cls,
      ].join(' ')}
    >
      {children}
    </span>
  );
}

export function BattleScreen() {
  const { run, playCard, endTurn, chooseSeal, returnToTitle, triggerTaiji } = useGame();
  const [targetIdx, setTargetIdx] = useState(0);
  const handCardWidth = useResponsiveCardWidth('hand');

  const battle = run?.battle;

  // 当当前 target 已死 → 自动切活的
  useEffect(() => {
    if (!battle) return;
    const cur = battle.enemies[targetIdx];
    if (!cur || cur.hp <= 0) {
      const alive = battle.enemies.findIndex((e) => e.hp > 0);
      if (alive >= 0 && alive !== targetIdx) setTargetIdx(alive);
    }
  }, [battle, targetIdx]);

  if (!run || !battle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink text-mist">
        战斗已结束。
      </div>
    );
  }

  const isSealChoice = battle.phase === 'sealChoice';
  const sealTargetIdx = battle.enemies.findIndex(
    (e) => e.sealChoiceTriggered && !e.sealed && e.hp > 0,
  );
  const sealTarget = sealTargetIdx >= 0 ? battle.enemies[sealTargetIdx] : null;

  // 最近一条玩家/敌人相关日志
  const lastLog = battle.log[battle.log.length - 1] ?? '';

  return (
    <div className="relative min-h-screen bg-ink text-parchment flex flex-col">
      {/* ═══════════════════════════════════════
           ① 顶栏 · 玩家状态 + 回合 + 牌组入口
         ═══════════════════════════════════════ */}
      <header
        className="sticky top-0 z-30 bg-ink-soft/95 border-b border-bone/30 backdrop-blur"
        data-zone="top-bar"
      >
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-2">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <button
              className="text-[11px] sm:text-[13px] text-parchment/80 hover:text-parchment font-heading tracking-widest px-1 sm:px-2 py-1 transition-colors"
              onClick={returnToTitle}
            >
              ← 返回
            </button>
            <div className="text-[10px] sm:text-xs text-mist font-heading tracking-widest text-center min-w-0 truncate">
              <span className="hidden sm:inline">第一章 · 青丘残岭 · </span>
              回合 {battle.turn}
            </div>
            <DeckViewButton />
          </div>

          <div className="mt-2 flex items-center gap-2 sm:gap-3" data-zone="player-stats">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[12px] sm:text-[13px] text-mist font-heading tracking-widest mb-1">
                <span>气 血</span>
                <span className="font-numeric text-parchment-light">
                  {battle.playerHp}/{battle.playerMaxHp}
                  {battle.playerBlock > 0 && (
                    <span className="text-bone-light ml-2">🛡 {battle.playerBlock}</span>
                  )}
                </span>
              </div>
              <HealthBar
                current={battle.playerHp}
                max={battle.playerMaxHp}
                block={battle.playerBlock}
                width={undefined}
              />
              <div className="mt-1">
                <PlayerStatusBadges />
              </div>
            </div>
            <div data-zone="energy" className="shrink-0">
              {battle.yinEnergyMax !== undefined ? (
                <YinYangBar state={battle} onTaiji={triggerTaiji} />
              ) : (
                <EnergyOrb current={battle.energy} max={battle.energyMax} size={52} />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════
           ② 中部 · 敌人区（大、居中、显眼）
         ═══════════════════════════════════════ */}
      <section
        className="flex-1 relative flex flex-col items-center justify-center px-3 sm:px-4 py-4 sm:py-6"
        data-zone="enemies"
      >
        <div className="flex justify-center gap-4 sm:gap-6 flex-wrap w-full max-w-2xl">
          {battle.enemies.map((e, idx) => {
            const intent = intentOf(e);
            const isDead = e.hp <= 0;
            const isTarget = idx === targetIdx;
            const isMulti = battle.enemies.length > 1;
            const isLowHP = !isDead && e.hp <= e.maxHp * 0.3;

            return (
              <button
                key={e.instanceId}
                onClick={() => !isDead && setTargetIdx(idx)}
                disabled={isDead}
                data-zone={idx === 0 ? 'enemy-first' : undefined}
                className={[
                  'relative flex flex-col items-center transition-all p-2 rounded no-select',
                  isDead ? 'opacity-25' : '',
                  isMulti && isTarget && !isDead
                    ? 'ring-2 ring-ember-glow bg-ember/5'
                    : '',
                  isMulti && !isTarget && !isDead ? 'hover:bg-ink-soft/50' : '',
                ].join(' ')}
              >
                {/* 意图徽章（大、醒目） */}
                {!isDead && intent && (
                  <div
                    data-zone={idx === 0 ? 'intent' : undefined}
                    className={[
                      'mb-2 px-3 py-1 rounded border font-heading tracking-widest',
                      intent.kind === 'attack'
                        ? 'bg-vermillion/20 border-vermillion/60 text-vermillion-light'
                        : intent.kind === 'defend'
                          ? 'bg-jade/20 border-jade/60 text-jade'
                          : 'bg-ember/20 border-ember/60 text-ember-glow',
                    ].join(' ')}
                    style={{ fontSize: 'clamp(12px, 3.5vw, 15px)' }}
                  >
                    {intent.label}
                  </div>
                )}

                {/* 立绘（大） */}
                <div
                  className="relative rounded overflow-hidden border-2 border-bone/40 shadow-card w-24 h-30 sm:w-28 sm:h-36 md:w-32 md:h-40 lg:w-36 lg:h-48"
                >
                  <Portrait
                    src={e.artSrc}
                    fallbackKind={e.silhouette}
                    sealed={e.sealed}
                    silhouetteVariant="onDark"
                    className="w-full h-full"
                    alt={e.name}
                  />
                  {/* 低血警告 */}
                  {isLowHP && (
                    <div className="absolute top-1 right-1 text-vermillion-light text-2xl font-heading animate-pulse leading-none">
                      印
                    </div>
                  )}
                  {/* 浮动数字覆盖敌人立绘 */}
                  {battle.fx
                    .filter((f) => f.target === 'enemy' && f.enemyIdx === idx)
                    .slice(-3)
                    .map((f) => (
                      <FloatingNumber
                        key={f.id}
                        value={f.value}
                        kind={f.kind}
                        offsetX={50}
                        offsetY={60}
                      />
                    ))}
                </div>

                {/* 名 + 血 + 状态 */}
                <div className="mt-2 text-center">
                  <div className="font-heading tracking-widest text-parchment-light"
                    style={{ fontSize: 'clamp(13px, 3.5vw, 17px)' }}
                  >
                    {e.name}
                    <span className="text-[10px] sm:text-[11px] text-mist ml-1 sm:ml-2 font-numeric">
                      [{e.rank}]
                    </span>
                  </div>
                  <div className="mt-1 text-[10px] sm:text-[11px] font-numeric text-mist">
                    HP {e.hp}/{e.maxHp}
                    {e.block > 0 && (
                      <span className="text-bone-light ml-2">🛡 {e.block}</span>
                    )}
                  </div>
                  <div className="mt-1 w-24 sm:w-28 md:w-32">
                    <HealthBar current={e.hp} max={e.maxHp} block={e.block} width={undefined} />
                  </div>
                  <StatusBadges enemy={e} />
                </div>
              </button>
            );
          })}
        </div>

        {/* 最近日志 */}
        {lastLog && (
          <div className="mt-4 text-center text-mist text-xs font-heading tracking-widest max-w-md px-4">
            {lastLog}
          </div>
        )}

        {/* 玩家浮动数字 */}
        <div className="relative">
          {battle.fx
            .filter((f) => f.target === 'player')
            .slice(-3)
            .map((f) => (
              <FloatingNumber
                key={f.id}
                value={f.value}
                kind={f.kind}
                offsetX={0}
                offsetY={0}
              />
            ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
           ③ 底栏 · 手牌 + 结束回合
         ═══════════════════════════════════════ */}
      <footer
        className="sticky bottom-0 z-30 bg-ink-soft/95 border-t border-bone/30 backdrop-blur pt-2 pb-3"
        data-zone="bottom-bar"
      >
        <div className="max-w-3xl mx-auto px-2">
          {/* 第一行：牌堆信息 + 结束回合 */}
          <div className="flex items-center justify-between mb-2 px-2 text-[11px] font-heading tracking-widest text-mist">
            <span>
              抽 <span className="text-parchment-light font-numeric">{battle.drawPile.length}</span>
              <span className="mx-2">·</span>
              弃 <span className="text-parchment-light font-numeric">{battle.discardPile.length}</span>
            </span>
            <Button
              onClick={endTurn}
              disabled={battle.phase !== 'playerAction'}
              size="sm"
              data-zone="end-turn"
            >
              结 束 回 合 →
            </Button>
          </div>

          {/* 第二行：手牌（横向滚动，移动端友好） */}
          <div
            data-zone="hand"
            className="flex gap-2 justify-center overflow-x-auto pb-2 min-h-[170px] sm:min-h-[200px] md:min-h-[210px]"
            style={{ scrollbarWidth: 'thin' }}
          >
            {battle.hand.length === 0 ? (
              <div className="flex items-center text-mist text-sm font-heading tracking-widest">
                · 手 牌 已 尽 · 请结束回合
              </div>
            ) : (
              battle.hand.map((c, i) => {
                const energyForCard =
                  c.pathKind === 'yin'
                    ? battle.yinEnergy ?? 0
                    : c.pathKind === 'yang'
                      ? battle.yangEnergy ?? 0
                      : battle.energy;
                const canPay = energyForCard >= c.cost;
                const canPlay = canPay && battle.phase === 'playerAction';
                const yaoYx = c.type === 'yao' ? (c.yaoxing ?? 0) : 0;
                const isRestless = yaoYx >= 60;
                const isFrenzy = yaoYx >= 90;
                return (
                  <div
                    key={c.uid}
                    className={[
                      'shrink-0 transition-transform relative',
                      canPlay ? 'hover:-translate-y-1' : '',
                      !canPay ? 'opacity-40 grayscale' : '',
                    ].join(' ')}
                    data-zone={i === 0 ? 'hand-first-card' : undefined}
                  >
                    <Card
                      card={c}
                      width={handCardWidth}
                      interactive={canPlay}
                      onClick={canPlay ? () => playCard(i, targetIdx) : undefined}
                    />
                    {/* 妖性警告 */}
                    {c.type === 'yao' && yaoYx > 0 && (
                      <div
                        className={[
                          'absolute top-0 right-0 text-[10px] px-1 rounded-bl rounded-tr font-heading tracking-widest shadow-sm',
                          isFrenzy
                            ? 'bg-vermillion text-parchment-light animate-pulse'
                            : isRestless
                              ? 'bg-ember/80 text-parchment-light'
                              : '',
                        ].join(' ')}
                        style={{ pointerEvents: 'none' }}
                      >
                        {isFrenzy ? '狂' : isRestless ? '躁' : ''}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════
           SEAL_CHOICE 浮层
         ═══════════════════════════════════════ */}
      {isSealChoice && sealTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-deep/85 backdrop-blur p-6">
          <div className="max-w-md w-full p-6 bg-ink-soft border border-bone/60 rounded shadow-card text-center">
            <div className="text-vermillion-light font-heading text-sm tracking-widest mb-2">
              镇 妖 印 现
            </div>
            <h2 className="font-heading text-parchment-light text-2xl tracking-widest mb-3">
              斩 ，抑 或 封 ？
            </h2>
            <p className="text-mist text-sm italic mb-6 leading-loose">
              "{sealTarget.flavor}"
            </p>
            <div className="flex gap-3 justify-center mb-3">
              <Button
                variant="danger"
                size="md"
                onClick={() => chooseSeal(sealTargetIdx, 'kill')}
              >
                斩
              </Button>
              <Button size="md" onClick={() => chooseSeal(sealTargetIdx, 'seal')}>
                封
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[11px] text-mist text-left">
              <div className="p-2 bg-ink border border-bone/20 rounded">
                <div className="text-vermillion-light font-heading tracking-widest mb-1">
                  斩
                </div>
                灵气 + 卡牌奖励
              </div>
              <div className="p-2 bg-ink border border-bone/20 rounded">
                <div className="text-ember-glow font-heading tracking-widest mb-1">
                  封
                </div>
                妖卡入组 · 少量灵气
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
           教程浮层（TutorialOverlay 会 self-gate）
         ═══════════════════════════════════════ */}
      <TutorialOverlay />

      {/* ═══════════════════════════════════════
           拼符封印小游戏 · phase 'sealMiniGame'
         ═══════════════════════════════════════ */}
      {battle.phase === 'sealMiniGame' && <SealMiniGame />}
    </div>
  );
}
