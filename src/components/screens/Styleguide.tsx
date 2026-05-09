/**
 * 视觉样机页 /styleguide
 *
 * 目的：在一个页面里平铺所有 UI 元素，供用户验收"风格对不对"。
 * 不涉及任何玩法。
 */

import type { ReactNode } from 'react';
import { Card } from '../card/Card';
import { Button } from '../ui/Button';
import { HealthBar } from '../ui/HealthBar';
import { EnergyOrb } from '../ui/EnergyOrb';
import { InkSilhouette } from '../art/InkSilhouette';
import { sampleCards } from '../../data/cards';
import { colors, colorShades } from '../../config/visual';
import type { SilhouetteKind } from '../../types';

type Props = { onBack?: () => void };

export function Styleguide({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-ink text-parchment">
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
        <Section title="三 · 卡 牌" subtitle="3:4 版式 · 稀有度边框差异 · 无图时自动墨影 fallback">
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
            鼠标悬停/移动端 tap 可看上浮交互。稀有度由低到高：
            <span className="text-bone"> 凡 </span>·
            <span className="text-jade"> 珍 </span>·
            <span className="text-vermillion-light"> 灵 </span>·
            <span className="text-ember"> 绝 </span>
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

        {/* Section 7: 反馈清单 */}
        <Section title="七 · 反馈清单" subtitle="看完后请对照打分。我看不到图，你来做审美裁判。">
          <div className="space-y-2 bg-ink-soft/60 border border-bone/20 rounded p-5 font-body text-sm">
            <Checkitem label="整体气质是否对味（苍、冷、锐）" />
            <Checkitem label="色板是否够沉稳（没有糖果色感）" />
            <Checkitem label="字体组合是否有文化厚度（非廉价）" />
            <Checkitem label="卡牌版式是否清晰（一眼看到能量/卡名/效果）" />
            <Checkitem label="稀有度边框差异是否够明显（凡/珍/灵/绝）" />
            <Checkitem label="按钮气质是否对（不卡通、不中二）" />
            <Checkitem label="血条/能量晶是否「有材质」（不塑料）" />
            <Checkitem label="墨影 fallback 是否能接受（至少不丑）" />
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
