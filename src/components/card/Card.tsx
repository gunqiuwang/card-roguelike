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
 * 响应式：所有内部尺寸（字号/内边距/能量水晶/角花/徽章）按
 * scale = width / 220 比例缩放（220 = 设计参考宽），确保在
 * 110-260 的卡宽区间文字不重叠、不溢出。
 */

import type { CSSProperties } from 'react';
import { Portrait } from '../art/Portrait';
import { RarityBadge } from '../art/RarityBadge';
import { rarityTheme } from '../../config/visual';
import type { Card as CardModel, SilhouetteKind } from '../../types';

const DESIGN_WIDTH = 220;

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
  width = DESIGN_WIDTH,
  interactive = false,
  sealed = false,
  onClick,
}: Props) {
  const height = width * (4 / 3);
  const theme = rarityTheme[card.rarity];

  // 单一缩放因子：所有内部 px 值按此比例取整
  const s = width / DESIGN_WIDTH;
  const sc = (base: number): number => Math.max(1, Math.round(base * s));

  const fallbackKind: SilhouetteKind =
    card.silhouette ??
    (card.type === 'fu' ? 'talisman' : card.type === 'faqi' ? 'relic' : 'beast');

  // 缩放后的内部尺寸
  const padY = sc(10);
  const padX = sc(12);
  const orbSize = sc(32);
  const orbFont = sc(16);
  const typeFont = sc(11);
  const nameFont = sc(19);
  const descFont = sc(12);
  const flavorFont = sc(10);
  const schoolFont = sc(10);
  const badgeSize = sc(26);
  const cornerSize = sc(36);
  const cornerInset = sc(10);

  // 卡面内可用高度（.card-abyss 内收 5px 上下 → -10，再减上下 padding）
  const innerH = height - 10;
  const contentH = innerH - padY * 2;
  // 立绘固定高度：约 50% 内容高，保证缩放后比例一致
  const portraitH = Math.max(40, Math.round(contentH * 0.5));

  // 卡名字距在窄卡上收紧，避免拥挤（但保持鎏金味）
  const nameLetterSpacing = width < 160 ? '0.08em' : '0.14em';

  const isYao = card.type === 'yao' && card.yaoxing !== undefined;

  // CSS 变量注入（包含角花尺寸变量，供 .card-corner-mark 读取）
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
    ['--corner-size' as string]: `${cornerSize}px`,
    ['--corner-inset' as string]: `${cornerInset}px`,
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

        {/* 内容区域 · flex 布局，描述行 flex-grow 吸收剩余空间 */}
        <div
          className="relative w-full h-full flex flex-col"
          style={{ padding: `${padY}px ${padX}px` }}
        >
          {/* ── 顶栏：能量 + 类型 ── */}
          <div
            className="relative flex justify-between items-start"
            style={{ flex: '0 0 auto', minHeight: orbSize }}
          >
            {/* 能量水晶 · 朱砂 + 浅金环（负边距移除：窄卡时不再溢出遮挡卡名） */}
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: orbSize,
                height: orbSize,
                background:
                  'radial-gradient(circle at 30% 30%, #C95040 0%, #8B2A1E 55%, #3E1008 100%)',
                border: `1px solid ${theme.edgeStop2}`,
                boxShadow: [
                  '0 1px 3px rgba(0,0,0,0.8)',
                  'inset 0 1px 0 rgba(255,200,180,0.18)',
                  '0 0 6px rgba(139,42,30,0.4)',
                ].join(', '),
              }}
            >
              <span
                className="font-bold leading-none"
                style={{
                  fontFamily: 'var(--font-numeric)',
                  fontSize: orbFont,
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
                fontSize: typeFont,
                letterSpacing: '0.2em',
                lineHeight: 1,
              }}
            >
              {typeLabel[card.type]}
            </span>
          </div>

          {/* ── 立绘区 · 暗边框 ── */}
          <div
            className="relative rounded-[5px] overflow-hidden"
            style={{
              flex: `0 0 ${portraitH}px`,
              marginTop: sc(4),
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
            className="relative flex items-center justify-center"
            style={{
              flex: '0 0 auto',
              marginTop: sc(8),
              paddingTop: sc(4),
              paddingBottom: sc(4),
            }}
          >
            <div
              className="absolute top-0 h-px"
              style={{
                left: sc(20),
                right: sc(20),
                background: `linear-gradient(to right, transparent, ${theme.edgeStop2}, transparent)`,
                opacity: 0.7,
              }}
            />
            <h3
              className="font-heading leading-none"
              style={{
                fontSize: nameFont,
                fontWeight: 600,
                color: '#E0C486',
                letterSpacing: nameLetterSpacing,
                textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,0.6)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}
            >
              {card.name}
            </h3>
            <div
              className="absolute bottom-0 h-px"
              style={{
                left: sc(20),
                right: sc(20),
                background: `linear-gradient(to right, transparent, ${theme.edgeStop2}, transparent)`,
                opacity: 0.7,
              }}
            />
          </div>

          {/* ── 描述 · 自适应空间 · 超长时 line-clamp 截断 ── */}
          <div
            className="relative flex items-center justify-center"
            style={{
              flex: '1 1 0%',
              minHeight: 0,
              marginTop: sc(6),
              paddingLeft: sc(2),
              paddingRight: sc(2),
            }}
          >
            <p
              className="text-center leading-snug"
              style={{
                fontSize: descFont,
                color: '#D4C9A8',
                fontWeight: 400,
                textShadow: '0 1px 2px rgba(0,0,0,0.9)',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {card.description}
            </p>
          </div>

          {/* ── flavor · 灰字 italic · 单行截断 ── */}
          {card.flavor && (
            <div
              className="relative flex items-center justify-center"
              style={{
                flex: '0 0 auto',
                marginTop: sc(2),
                paddingLeft: sc(4),
                paddingRight: sc(4),
              }}
            >
              <p
                className="text-center italic leading-none"
                style={{
                  fontSize: flavorFont,
                  color: '#8A7E66',
                  textShadow: '0 1px 1px rgba(0,0,0,0.8)',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  maxWidth: '100%',
                }}
              >
                {card.flavor}
              </p>
            </div>
          )}

          {/* ── 底栏 · 妖卡用妖性条直接替代派别+徽章 ── */}
          <div
            className="relative"
            style={{ flex: '0 0 auto', marginTop: sc(4) }}
          >
            {isYao ? (
              <YaoxingStrip value={card.yaoxing!} scale={s} />
            ) : (
              <div className="flex justify-between items-end">
                <span
                  className={[
                    'font-heading tracking-wider',
                    schoolColorClass[card.school],
                  ].join(' ')}
                  style={{
                    fontSize: schoolFont,
                    letterSpacing: '0.2em',
                    textShadow: '0 1px 1px rgba(0,0,0,0.8)',
                    lineHeight: 1,
                  }}
                >
                  {schoolLabel[card.school] || ''}
                </span>
                <RarityBadge rarity={card.rarity} size={badgeSize} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Layer 2 · 四角 L 形角花（尺寸/偏移走 CSS 变量，窄卡不再拥挤） */}
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
            className="bg-vermillion/85 text-parchment-light font-heading tracking-widest shadow-seal"
            style={{
              fontSize: sc(14),
              padding: `${sc(2)}px ${sc(8)}px`,
            }}
          >
            封
          </div>
        </div>
      )}
    </button>
  );
}

/**
 * 妖性条 · 妖卡专属底栏
 * 直接坐在卡底（in-flow），取代普通派别+徽章底栏，不再 absolute 覆盖。
 */
function YaoxingStrip({ value, scale }: { value: number; scale: number }) {
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
  const sc = (n: number) => Math.max(1, Math.round(n * scale));
  return (
    <div className="w-full">
      <div
        className="flex items-center font-heading tracking-widest"
        style={{
          fontSize: sc(9),
          color,
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          marginBottom: sc(2),
          lineHeight: 1,
          gap: sc(3),
        }}
      >
        <span>妖</span>
        <span className="ml-auto font-numeric">{pct}</span>
        <span>·</span>
        <span>{label}</span>
      </div>
      <div
        className="relative rounded-sm overflow-hidden"
        style={{
          height: sc(4),
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          className="absolute inset-y-0 left-0 transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
