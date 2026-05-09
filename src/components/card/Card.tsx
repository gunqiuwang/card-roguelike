/**
 * 卡牌组件 · 对应 docs/ART_BIBLE.md §四 卡面版式规范
 *
 * 3:4 竖版，内部五层：能量条 / 立绘 / 卡名 / 描述 / 底标签
 */

import { Portrait } from '../art/Portrait';
import type { Card as CardModel, SilhouetteKind } from '../../types';

type Props = {
  card: CardModel;
  /** 渲染尺寸（宽度 px），高度按 3:4 自动算 */
  width?: number;
  /** 是否可交互（悬停上浮） */
  interactive?: boolean;
  /** 是否是已封印的妖卡（加朱砂印） */
  sealed?: boolean;
  onClick?: () => void;
};

const rarityBorderClass: Record<CardModel['rarity'], string> = {
  starter: 'border-bone/60',
  common: 'border-jade',
  rare: 'border-vermillion',
  epic: 'border-ember',
  legend: 'border-ember-glow shadow-[0_0_20px_rgba(255,178,104,0.5)]',
};

const rarityLabel: Record<CardModel['rarity'], string> = {
  starter: '·',
  common: '凡',
  rare: '珍',
  epic: '灵',
  legend: '绝',
};

const schoolLabel: Record<CardModel['school'], string> = {
  zhanyao: '斩妖',
  yuling: '御灵',
  fushu: '符术',
  neutral: '',
};

const schoolBgClass: Record<CardModel['school'], string> = {
  zhanyao: 'bg-vermillion',
  yuling: 'bg-jade',
  fushu: 'bg-ember',
  neutral: 'bg-mist',
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

  const fallbackKind: SilhouetteKind =
    card.silhouette ??
    (card.type === 'fu' ? 'talisman' : card.type === 'faqi' ? 'relic' : 'beast');

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={[
        'group relative flex flex-col rounded-card overflow-hidden',
        'border-2 bg-parchment text-ink',
        'shadow-card transition-transform duration-300 ease-snap',
        rarityBorderClass[card.rarity],
        interactive ? 'cursor-pointer hover:-translate-y-3 hover:shadow-card-hover' : 'cursor-default',
        'no-select',
      ].join(' ')}
      style={{ width, height, fontFamily: 'var(--font-body)' }}
      aria-label={card.name}
    >
      {/* 纸质纹理层 */}
      <div className="absolute inset-0 texture-paper pointer-events-none opacity-70" />

      {/* ── 顶栏 8%：能量 + 稀有 ── */}
      <div
        className="relative flex justify-between items-center px-2"
        style={{ height: '8%' }}
      >
        {/* 能量 */}
        <div
          className="w-7 h-7 rounded-full bg-vermillion border-2 border-ink flex items-center justify-center shadow-seal"
          style={{ marginLeft: -6, marginTop: -4 }}
        >
          <span
            className="text-parchment-light font-bold leading-none"
            style={{ fontFamily: 'var(--font-numeric)', fontSize: '15px' }}
          >
            {card.cost}
          </span>
        </div>
        {/* 稀有度字 */}
        <span
          className="font-heading text-ink/50 text-sm tracking-widest"
          style={{ marginRight: 2 }}
        >
          {rarityLabel[card.rarity]}
        </span>
      </div>

      {/* ── 立绘 55% ── */}
      <div
        className="relative mx-2 rounded overflow-hidden border border-ink/20"
        style={{ height: '52%' }}
      >
        <Portrait
          src={card.artSrc}
          fallbackKind={fallbackKind}
          sealed={sealed}
          className="w-full h-full"
          alt={card.name}
        />
        {/* 顶底渐变蒙版，方便文字叠压 */}
        <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-parchment/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-parchment/40 to-transparent pointer-events-none" />
      </div>

      {/* ── 卡名 10% ── */}
      <div
        className="relative px-2 flex items-center justify-center"
        style={{ height: '10%' }}
      >
        <h3
          className="font-heading text-ink tracking-wider"
          style={{ fontSize: '18px', fontWeight: 600 }}
        >
          {card.name}
        </h3>
      </div>

      {/* ── 描述 22% ── */}
      <div
        className="relative px-3 flex items-center justify-center"
        style={{ height: '22%' }}
      >
        <p
          className="text-center text-ink/80 leading-snug"
          style={{ fontSize: '12px' }}
        >
          {card.description}
        </p>
      </div>

      {/* ── 底标签 5% ── */}
      <div
        className="relative flex justify-between items-center px-2 pb-1"
        style={{ height: '5%' }}
      >
        <span
          className={[
            'px-1.5 py-0.5 rounded text-[10px] font-heading text-parchment-light tracking-wide',
            schoolBgClass[card.school],
          ].join(' ')}
        >
          {schoolLabel[card.school] || ' '}
        </span>
        <span className="text-[10px] text-ink/40 font-heading tracking-widest">
          {typeLabel[card.type]}
        </span>
      </div>
    </button>
  );
}
