/**
 * 视觉样机页 /styleguide
 *
 * 目的：在一个页面里平铺所有 UI 元素，供用户验收"风格对不对"。
 * 不涉及任何玩法。
 */

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Card } from '../card/Card';
import { Button } from '../ui/Button';
import { HealthBar } from '../ui/HealthBar';
import { EnergyOrb } from '../ui/EnergyOrb';
import { FloatingNumber } from '../ui/FloatingNumber';
import { InkSilhouette } from '../art/InkSilhouette';
import { RarityBadge } from '../art/RarityBadge';
import { CornerFlourish } from '../art/CornerFlourish';
import { MistOverlay } from '../art/MistOverlay';
import { sampleCards } from '../../data/cards';
import { rarityTheme } from '../../config/visual';
import { colors, colorShades } from '../../config/visual';
import type { CardRarity, SilhouetteKind } from '../../types';

type Props = { onBack?: () => void };

export function Styleguide({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-ink text-parchment">
      {/* 全局云雾/月光漂移层 · 低强度 */}
      <MistOverlay intensity={0.7} />
      {/* 顶栏 */}
      <header className="sticky top-0 z-20 bg-ink-soft/95 backdrop-blur border-b border-bone/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-bone/70 text-xs font-heading tracking-widest">山海志·封妖录</div>
            <h1 className="font-heading text-parchment-light text-2xl tracking-wider">视 觉 样 机</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack}>
            ← 返回
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-20">
        {/* Section 1: 色板 */}
        <Section title="一 · 锁定七色" subtitle="所有 UI 只用这些颜色（衍生阶允许）">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(colors).map(([name, hex]) => (
              <Swatch key={name} name={name} hex={hex} />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-80">
            {Object.entries(colorShades).map(([name, hex]) => (
              <Swatch key={name} name={name} hex={hex} small />
            ))}
          </div>
        </Section>

        {/* Section 2: 字体 */}
        <Section title="二 · 字体系统" subtitle="标题手书 · 正文宋体 · 数字罗马碑刻">
          <div className="space-y-6">
            <TypeSample
              label="标题字（手书）"
              example="封妖录"
              className="font-heading text-parchment-light"
              size="64px"
            />
            <TypeSample
              label="章节名"
              example="青丘残岭"
              className="font-heading text-bone-light"
              size="32px"
            />
            <TypeSample
              label="卡名"
              example="九尾幻术"
              className="font-body text-parchment-light font-semibold"
              size="20px"
            />
            <TypeSample
              label="正文 / flavor"
              example="她说：你看见的从来不是我。"
              className="font-body text-parchment/80"
              size="16px"
            />
            <TypeSample
              label="数字 / 能量"
              example="128 / 236"
              className="font-numeric font-bold text-ember"
              size="28px"
            />
            <TypeSample
              label="caption / 次要"
              example="钦天监·封妖司"
              className="font-body text-mist"
              size="12px"
            />
          </div>
        </Section>

        {/* Section 3: 卡牌 */}
        <Section title="三 · 卡 牌" subtitle="3:4 版式 · 雕刻分层 · 内敛史诗">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {sampleCards.map((card) => (
              <Card key={card.id} card={card} interactive />
            ))}
            {/* 已封妖示意 */}
            <Card
              card={{ ...sampleCards[3], name: '绯 · 九尾（已封）', rarity: 'epic' }}
              interactive
              sealed
            />
          </div>
          <p className="mt-4 text-mist text-sm">
            鼠标悬停/移动端 tap 可看<span className="text-parchment-light">弱柔光上浮</span>。
            稀有度分档：
            <span style={{ color: rarityTheme.common.edge }}> R·暗岩纹铜</span> ·
            <span style={{ color: rarityTheme.rare.edge }}> SR·青纹古铜</span> ·
            <span style={{ color: rarityTheme.epic.edge }}> SSR·哑光金纹</span> ·
            <span style={{ color: rarityTheme.legend.edge }}> SP·苍玉玄纹</span>
          </p>
        </Section>

        {/* Section 3b: 稀有度同款对比 */}
        <Section
          title="三·甲 · 稀有度同款对比"
          subtitle="同一张底卡，只换边框主题 · 验证雕刻分层与弱柔光"
        >
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {(['common', 'rare', 'epic', 'legend'] as CardRarity[]).map((r) => {
              const theme = rarityTheme[r];
              return (
                <div key={r} className="flex flex-col items-center gap-3">
                  <Card
                    card={{
                      ...sampleCards[2],
                      id: `demo_${r}`,
                      name: '桃木斩',
                      rarity: r,
                    }}
                    interactive
                  />
                  <div className="text-center">
                    <div
                      className="font-heading text-sm tracking-widest"
                      style={{ color: theme.edge }}
                    >
                      {theme.label}
                    </div>
                    <div className="text-mist text-xs mt-0.5 font-heading tracking-wider">
                      {theme.nameCn}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-mist text-sm">
            同一张卡，四档边框对比。注意：
            <span className="text-parchment-light">双层边 + 顶受光 + 底暗槽</span>
            形成内凹浮雕感；<span className="text-parchment-light">四角暗纹 opacity ≤ 0.3</span>，
            凑近才看得见；悬浮仅 <span className="text-parchment-light">上浮 4px + 12px 弱柔光</span>，
            禁止大金边流光。
          </p>
        </Section>

        {/* Section 4: 按钮 */}
        <Section title="四 · 按 钮" subtitle="主/次/幽/危 四态">
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="primary" size="lg">踏 入 山 海</Button>
            <Button variant="primary">封 印</Button>
            <Button variant="secondary">继续</Button>
            <Button variant="ghost">跳过</Button>
            <Button variant="danger">斩</Button>
            <Button disabled>未达成</Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <Button size="sm">sm</Button>
            <Button size="md">md</Button>
            <Button size="lg">lg</Button>
          </div>
        </Section>

        {/* Section 5: 血条 + 能量 */}
        <Section title="五 · 状态槽" subtitle="气血 · 气御 · 能量">
          <div className="space-y-5 max-w-md">
            <div>
              <div className="text-xs text-mist mb-2 font-heading tracking-widest">气 血</div>
              <HealthBar current={48} max={80} />
            </div>
            <div>
              <div className="text-xs text-mist mb-2 font-heading tracking-widest">带 气·御</div>
              <HealthBar current={62} max={80} block={12} />
            </div>
            <div>
              <div className="text-xs text-mist mb-2 font-heading tracking-widest">残 血</div>
              <HealthBar current={14} max={80} />
            </div>
          </div>
          <div className="mt-8 flex items-end gap-6">
            <div className="text-center">
              <EnergyOrb current={3} max={3} size={72} />
              <div className="text-xs text-mist mt-2 font-heading tracking-widest">气</div>
            </div>
            <div className="text-center">
              <EnergyOrb current={1} max={3} size={72} />
              <div className="text-xs text-mist mt-2 font-heading tracking-widest">用 过 2</div>
            </div>
            <div className="text-center">
              <EnergyOrb current={0} max={3} size={72} />
              <div className="text-xs text-mist mt-2 font-heading tracking-widest">耗 尽</div>
            </div>
          </div>
        </Section>

        {/* Section 6: 墨影剪影 */}
        <Section title="六 · 墨影剪影" subtitle="无立绘时的 fallback 方案。真正好看的是生的立绘，但这是兜底。">
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {(
              ['fox', 'serpent', 'beast', 'bird', 'fish', 'humanoid', 'talisman', 'relic', 'hero'] as SilhouetteKind[]
            ).map((kind) => (
              <div key={kind} className="flex flex-col items-center gap-2">
                <div className="w-24 h-32 border border-bone/30 rounded-sm overflow-hidden">
                  <InkSilhouette kind={kind} className="w-full h-full" />
                </div>
                <span className="text-mist text-xs font-heading tracking-widest">{kind}</span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-32 border border-bone/30 rounded-sm overflow-hidden">
                <InkSilhouette kind="fox" className="w-full h-full" withSeal />
              </div>
              <span className="text-vermillion text-xs font-heading tracking-widest">已封（带印）</span>
            </div>
          </div>
        </Section>

        {/* Section 7: 稀有度徽章全系 */}
        <Section title="七 · 稀有度徽章" subtitle="R / SR / SSR / SP · 角落小徽章 · 不抢戏">
          <div className="flex flex-wrap gap-6 items-end">
            {(['common', 'rare', 'epic', 'legend'] as CardRarity[]).map((r) => {
              const theme = rarityTheme[r];
              return (
                <div key={r} className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-parchment rounded border border-bone/30 shadow-paper">
                    <RarityBadge rarity={r} size={44} />
                  </div>
                  <div
                    className="text-xs font-heading tracking-widest"
                    style={{ color: theme.edge }}
                  >
                    {theme.label}
                  </div>
                  <div className="text-mist text-[11px] font-heading tracking-wider">
                    {theme.nameCn}
                  </div>
                </div>
              );
            })}
            <div className="flex flex-col items-center gap-2 opacity-60">
              <div
                className="p-4 bg-parchment rounded border border-bone/30 shadow-paper flex items-center justify-center"
                style={{ width: 76, height: 76 }}
              >
                <span className="text-ink/30 text-xs font-heading">无</span>
              </div>
              <div className="text-xs text-mist font-heading tracking-widest">starter</div>
              <div className="text-mist text-[11px] font-heading tracking-wider">起手</div>
            </div>
          </div>
          <p className="mt-4 text-mist text-sm">
            起手卡无徽章 · R 单环 · SR 双环 · SSR 双环加红点 · SP 三环加虚线。
            所有环色从稀有度主题色派生，不使用亮金。
          </p>
        </Section>

        {/* Section 8: 四角云纹 */}
        <Section title="八 · 四角云纹" subtitle="卡框、面板、场景口角的极简雕饰">
          <div className="relative bg-parchment rounded p-8 max-w-md" style={{ border: '1px solid #A68C5B', boxShadow: 'inset 0 0 0 1px rgba(166,140,91,0.3), 0 2px 8px rgba(0,0,0,0.4)' }}>
            <CornerFlourish corner="tl" color="#A68C5B" size={22} className="absolute top-2 left-2" />
            <CornerFlourish corner="tr" color="#A68C5B" size={22} className="absolute top-2 right-2" />
            <CornerFlourish corner="bl" color="#A68C5B" size={22} className="absolute bottom-2 left-2" />
            <CornerFlourish corner="br" color="#A68C5B" size={22} className="absolute bottom-2 right-2" />
            <div className="text-center text-ink font-heading tracking-widest py-4">
              "一叶障目，不见泰山。"
            </div>
            <div className="text-center text-ink/60 text-xs">—— 面板 / 对话框 / 事件卡片通用装饰</div>
          </div>
          <p className="mt-4 text-mist text-sm">
            单条如意卷云 + 一颗露珠；四角用 CSS transform 翻转，每张卡用 1 个组件 4 次调用。
          </p>
        </Section>

        {/* Section 9: 战斗浮动数字 · demo 循环播放 */}
        <Section title="九 · 战斗浮动数字" subtitle="缓慢上浮淡出，不蹦大字、不震屏">
          <FloatingNumberDemo />
        </Section>

        {/* Section 10: 反馈清单 */}
        <Section title="十 · 反馈清单" subtitle="按『低调高级 · 内敛史诗』规范逐条打分">
          <div className="space-y-2 bg-ink-soft/60 border border-bone/20 rounded p-5 font-body text-sm">
            <Checkitem label="整体气质：暗黑洪荒 · 不浮夸" />
            <Checkitem label="色板：ember 已调沉 · 整体暗调" />
            <Checkitem label="字体：有文化厚度 · 非廉价" />
            <Checkitem label="卡牌 · 边框雕刻分层感（双层 + 顶受光 + 底暗槽）" />
            <Checkitem label="卡牌 · 四档主题色正确：R 暗岩铜 / SR 青纹古铜 / SSR 哑光金 / SP 苍玉玄" />
            <Checkitem label="卡牌 · 四角暗纹是否『凑近才见』" />
            <Checkitem label="卡牌 · 悬浮仅 4px 上浮 + 弱柔光（无大金边流光）" />
            <Checkitem label="卡牌 · 稀有度徽章『小而雅』不抢戏" />
            <Checkitem label="按钮 · 气质对（非卡通、非中二）" />
            <Checkitem label="全局云雾『低强度 · 不干扰』" />
            <Checkitem label="浮动数字『缓慢优雅』不花哨" />
            <Checkitem label="墨影 fallback 能接受（至少不丑）" />
          </div>
          <p className="mt-4 text-mist text-sm">
            有任何一条不对，告诉我哪里、想改成什么样。我改到对为止。
          </p>
        </Section>
      </main>

      <footer className="border-t border-bone/20 mt-20 py-6 text-center text-mist text-xs font-heading tracking-widest">
        山 海 志 · 封 妖 录 · v0.1
      </footer>
    </div>
  );
}

// ============================================================
// 子组件
// ============================================================

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="font-heading text-parchment-light text-2xl tracking-widest">{title}</h2>
        {subtitle && <p className="text-mist text-sm mt-1">{subtitle}</p>}
        <div className="mt-3 h-px bg-gradient-to-r from-bone/40 via-bone/10 to-transparent" />
      </div>
      {children}
    </section>
  );
}

function Swatch({ name, hex, small = false }: { name: string; hex: string; small?: boolean }) {
  return (
    <div
      className="rounded border border-bone/20 overflow-hidden shadow-paper"
      style={{ height: small ? 72 : 100 }}
    >
      <div style={{ height: '60%', background: hex }} />
      <div className="px-3 py-2 bg-ink-soft">
        <div className="text-parchment-light text-xs font-heading tracking-wider">{name}</div>
        <div className="text-mist text-[10px] font-numeric mt-0.5">{hex}</div>
      </div>
    </div>
  );
}

function TypeSample({
  label,
  example,
  className,
  size,
}: {
  label: string;
  example: string;
  className: string;
  size: string;
}) {
  return (
    <div className="flex items-baseline gap-5 border-b border-bone/10 pb-3">
      <div className="w-40 shrink-0 text-mist text-xs font-heading tracking-widest">{label}</div>
      <div className={className} style={{ fontSize: size }}>
        {example}
      </div>
    </div>
  );
}

function Checkitem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-block w-4 h-4 border border-bone/60 rounded-sm" />
      <span className="text-parchment/90">{label}</span>
    </div>
  );
}

/**
 * 浮动数字 Demo · 每 2.2s 循环播放一组（6 种），永不停歇。
 * 用 key 强制重挂来重放 CSS 动画。
 */
type FxKind = 'damage' | 'crit' | 'heal' | 'block' | 'poison' | 'seal';
type FxSample = {
  kind: FxKind;
  value: number | string;
  label: string;
  left: number; // %
};
const fxSamples: FxSample[] = [
  { kind: 'damage', value: 8, label: '受击', left: 14 },
  { kind: 'crit', value: 16, label: '暴击', left: 30 },
  { kind: 'heal', value: 6, label: '回气血', left: 46 },
  { kind: 'block', value: 5, label: '气·御', left: 62 },
  { kind: 'poison', value: 3, label: '中毒', left: 78 },
  { kind: 'seal', value: '封', label: '封印', left: 92 },
];

function FloatingNumberDemo() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div>
      <div
        className="relative w-full max-w-2xl mx-auto rounded overflow-hidden"
        style={{
          height: 160,
          background:
            'radial-gradient(ellipse at 50% 70%, rgba(178,58,42,0.08) 0%, transparent 60%), #1A1815',
          border: '1px solid rgba(166,140,91,0.25)',
        }}
      >
        {/* 标签行 */}
        <div className="absolute inset-x-0 bottom-2 flex justify-around">
          {fxSamples.map((s) => (
            <span key={s.kind} className="text-mist text-xs font-heading tracking-widest">
              {s.label}
            </span>
          ))}
        </div>
        {/* 每次 tick 重挂一次，CSS 动画自动从头播 */}
        {fxSamples.map((s) => (
          <FloatingNumber
            key={`${s.kind}-${tick}`}
            value={s.value}
            kind={s.kind}
            offsetX={s.left}
            offsetY={68}
          />
        ))}
      </div>
      <p className="mt-3 text-mist text-sm">
        每 2.2 秒自动重播一轮。所有数字 1.4s 内缓慢上浮 44px 并淡出。
      </p>
    </div>
  );
}
