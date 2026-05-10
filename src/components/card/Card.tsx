/**
 * 卡牌组件 · 暗黑百闻牌结构（用户方案 1:1 实现）
 *
 * 由外到内：
 *   .card-shell           外壳 · 18px 圆角 · 厚度阴影
 *   .card-gold-frame      1.5px 鎏金缎面边（5-stop 对角渐变）
 *   .card-abyss           深渊暗底 + 多层 inset 深
 *   .card-corner-mark × 4 L 形角花（opacity 0.16）
 *
 * 五阶 · 凡/珍/灵/玄 —— 色值全走 rarityTheme。
 *
 * 关键决策：
 *   · 卡面暗底（非亚麻纸）→ 文字用浅鎏金/米白，对比度天然够
 *   · hover 上浮 6px + 弱柔光，不加任何流光
 *   · 能量水晶改浅金描边（暗底上更干净）
 */

import type { CSSProperties } from 'react';
import { Portrait } from '../art/Portrait';
import { RarityBadge } from '../art/RarityBadge';
import { rarityTheme } from '../../config/visual';
import type { Card as CardModel, SilhouetteKind } from '../../types';

type Props = {
  card: CardModel;
  width?: number;
  interactive?: boolean;
  sealed?: boolean;
  onClick?: () => void;
};

const schoolLabel: Record<CardModel['school'], string> = {
  zhanyao: '斩妖',
  yuling: '御灵',
  fushu: '符术',
  neutral: '',
};

const schoolColorClass: Record<CardModel['school'], string> = {
  zhanyao: 'text-vermillion-light',
  yuling: 'text-[#95B9A8]',
  fushu: 'text-[#E08A48]',
  neutral: 'text-mist',
};

const typeLabel: Record<CardModel['type'], string> = {
  fu: '符',
  faqi: '器',
  yao: '妖',
};

export function Card({
  card,
  width = 220,
  interactive = false,
  sealed = false,
  onClick,
}: Props) {
  const height = width * (4 / 3);
  const theme = rarityTheme[card.rarity];

  const fallbackKind: SilhouetteKind =
    card.silhouette ??
    (card.type === 'fu' ? 'talisman' : card.type === 'faqi' ? 'relic' : 'beast');

  // CSS 变量注入
  const shellStyle: CSSProperties = {
    width,
    height,
    fontFamily: 'var(--font-body)',
    ['--edge-stop-0' as string]: theme.edgeStop0,
    ['--edge-stop-1' as string]: theme.edgeStop1,
    ['--edge-stop-2' as string]: theme.edgeStop2,
    ['--edge-stop-3' as string]: theme.edgeStop3,
    ['--edge-stop-4' as string]: theme.edgeStop4,
    ['--edge-muted' as string]: theme.edgeMuted,
    ['--body-top' as string]: theme.bodyTop,
    ['--body-bot' as string]: theme.bodyBot,
    ['--glow' as string]: theme.glow,
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={[
        'card-shell group no-select',
        interactive ? 'cursor-pointer is-interactive' : 'cursor-default',
      ].join(' ')}
      style={shellStyle}
      aria-label={card.name}
    >
      {/* Layer 1 · 深渊暗底（最底层） */}
      <div className="card-abyss">
        {/* 极淡的暗纹（给暗底一点肌理，否则太平） */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='9'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.4 0 0 0 0 0.28 0 0 0 0.06 0'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")",
            mixBlendMode: 'overlay',
          }}
        />

        {/* 内容区域 */}
        <div className="relative w-full h-full flex flex-col" style={{ padding: '10px 12px' }}>
          {/* ── 顶栏：能量 + 类型 ── */}
          <div className="relative flex justify-between items-start" style={{ height: '8%' }}>
            {/* 能量水晶 · 朱砂 + 浅金环 */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, #C95040 0%, #8B2A1E 55%, #3E1008 100%)',
                border: `1px solid ${theme.edgeStop2}`,
                boxShadow: [
                  '0 1px 3px rgba(0,0,0,0.8)',
                  'inset 0 1px 0 rgba(255,200,180,0.18)',
                  '0 0 6px rgba(139,42,30,0.4)',
                ].join(', '),
                marginLeft: -10,
                marginTop: -8,
              }}
            >
              <span
                className="font-bold leading-none"
                style={{
                  fontFamily: 'var(--font-numeric)',
                  fontSize: '16px',
                  color: '#F5E8C8',
                  textShadow: '0 1px 0 rgba(0,0,0,0.8)',
                }}
              >
                {card.cost}
              </span>
            </div>

            {/* 类型字（右上 · 鎏金小字） */}
            <span
              className="font-heading tracking-widest"
              style={{
                color: theme.edgeStop1,
                fontSize: '11px',
                marginRight: -2,
                marginTop: -2,
                letterSpacing: '0.2em',
              }}
            >
              {typeLabel[card.type]}
            </span>
          </div>

          {/* ── 立绘区 · 暗边框 ── */}
          <div
            className="relative mt-1 rounded-[5px] overflow-hidden"
            style={{
              height: '52%',
              boxShadow: [
                `inset 0 0 0 1px ${theme.edgeStop0}`,
                'inset 0 1px 0 rgba(255,255,255,0.04)',
                'inset 0 -1px 0 rgba(0,0,0,0.6)',
                '0 2px 4px rgba(0,0,0,0.5)',
              ].join(', '),
            }}
          >
            <Portrait
              src={card.artSrc}
              fallbackKind={fallbackKind}
              sealed={sealed}
              silhouetteVariant="onDark"
              className="w-full h-full"
              alt={card.name}
            />
            {/* 立绘底部渐隐到暗底 */}
            <div
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                height: '30%',
                background: `linear-gradient(to top, ${theme.bodyTop} 0%, transparent 100%)`,
              }}
            />
          </div>

          {/* ── 卡名 · 鎏金色 · 暗底天然清晰 ── */}
          <div
            className="relative mt-2 flex items-center justify-center"
            style={{ height: '11%' }}
          >
            <div
              className="absolute top-0 left-6 right-6 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${theme.edgeStop2}, transparent)`,
                opacity: 0.7,
              }}
            />
            <h3
              className="font-heading leading-none"
              style={{
                fontSize: '19px',
                fontWeight: 600,
                color: '#E0C486',
                letterSpacing: '0.16em',
                textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.6)',
              }}
            >
              {card.name}
            </h3>
            <div
              className="absolute bottom-0 left-6 right-6 h-px"
              style={{
                background: `linear-gradient(to right, transparent, ${theme.edgeStop2}, transparent)`,
                opacity: 0.7,
              }}
            />
          </div>

          {/* ── 描述 · 米白色 ── */}
          <div
            className="relative mt-2 flex items-center justify-center px-1"
            style={{ height: '16%' }}
          >
            <p
              className="text-center leading-snug"
              style={{
                fontSize: '12px',
                color: '#D4C9A8',
                fontWeight: 400,
                textShadow: '0 1px 2px rgba(0,0,0,0.9)',
              }}
            >
              {card.description}
            </p>
          </div>

          {/* ── flavor · 灰字 italic ── */}
          {card.flavor && (
            <div
              className="relative mt-1 flex items-center justify-center px-2"
              style={{ height: '5%' }}
            >
              <p
                className="text-center italic leading-none"
                style={{
                  fontSize: '10px',
                  color: '#8A7E66',
                  textShadow: '0 1px 1px rgba(0,0,0,0.8)',
                }}
              >
                {card.flavor}
              </p>
            </div>
          )}

          {/* ── 底栏：派别 + 徽章 ── */}
          <div
            className="mt-auto relative flex justify-between items-end"
            style={{ height: '7%' }}
          >
            <span
              className={[
                'font-heading tracking-wider',
                schoolColorClass[card.school],
              ].join(' ')}
              style={{
                fontSize: '10px',
                marginBottom: -2,
                marginLeft: -2,
                letterSpacing: '0.2em',
                textShadow: '0 1px 1px rgba(0,0,0,0.8)',
              }}
            >
              {schoolLabel[card.school] || ''}
            </span>
            <div style={{ marginBottom: -4, marginRight: -4 }}>
              <RarityBadge rarity={card.rarity} size={26} />
            </div>
          </div>
        </div>
      </div>

      {/* Layer 2 · 四角 L 形角花 */}
      <div className="card-corner-mark tl" />
      <div className="card-corner-mark tr" />
      <div className="card-corner-mark bl" />
      <div className="card-corner-mark br" />

      {/* Layer 3 · 鎏金缎面边（最上层，压在角花之上） */}
      <div className="card-gold-frame" />

      {/* Layer ∞ · 已封朱砂印 */}
      {sealed && (
        <div
          className="absolute pointer-events-none"
          style={{ top: '38%', right: '12%', transform: 'rotate(-8deg)', zIndex: 4 }}
        >
          <div
            className="px-2 py-0.5 bg-vermillion/85 text-parchment-light font-heading tracking-widest shadow-seal"
            style={{ fontSize: '14px' }}
          >
            封
          </div>
        </div>
      )}

      {/* 妖性条（只对 yao 类型的卡显示） */}
      {card.type === 'yao' && card.yaoxing !== undefined && (
        <YaoxingStrip value={card.yaoxing} />
      )}
    </button>
  );
}

function YaoxingStrip({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  const color =
    pct >= 90
      ? '#8B2A1E'
      : pct >= 60
        ? '#C4551B'
        : pct >= 30
          ? '#A68C5B'
          : '#6B7A5E';
  const label =
    pct >= 90 ? '噬主' : pct >= 60 ? '狂乱' : pct >= 30 ? '躁动' : '温顺';
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        bottom: 3,
        left: 6,
        right: 6,
        zIndex: 5,
      }}
    >
      <div
        className="flex items-center gap-1 mb-0.5 font-heading tracking-widest"
        style={{ fontSize: 8, color, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
      >
        <span>妖</span>
        <span className="ml-auto font-numeric">{pct}</span>
        <span>·</span>
        <span>{label}</span>
      </div>
      <div
        className="relative h-1 rounded-sm overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div
          className="absolute inset-y-0 left-0 transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
