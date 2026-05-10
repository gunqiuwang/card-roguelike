/**
 * Card 组件回归测试 · jsdom
 *
 * 四个主题：
 *   1. 宽度缩放：内部尺寸随 width 线性缩放 + 字号可读性下限
 *   2. 妖卡底栏：RarityBadge 与 YaoxingStrip 同时渲染（不再互相遮挡）
 *   3. 描述行 line-clamp：防止描述被压没
 *   4. 窄卡结构阈值：能量水晶走 <160 分支、极窄（s<0.6）隐藏 flavor
 *
 * 只读 inline style / getByTestId / getByText —— 不依赖布局（jsdom 的
 * getBoundingClientRect / getComputedStyle 几乎都是 0 或空串）。
 */

import { render, screen } from '@testing-library/react';
import { Card } from '../Card';
import { CARD_FIRE_STRIKE } from '../../../data/cards';
import type { Card as CardModel } from '../../../types';

// ---------------------------------------------------------------------------
// 1. 宽度缩放回归
// ---------------------------------------------------------------------------
describe('Card · 宽度缩放', () => {
  const widths = [110, 140, 180, 220, 260];

  it.each(widths)('width=%i 时 root 宽高与 4:3 比例一致', (w) => {
    const { getByTestId, unmount } = render(
      <Card card={CARD_FIRE_STRIKE} width={w} />,
    );
    const root = getByTestId('card-root') as HTMLElement;
    expect(root.style.width).toBe(`${w}px`);
    // height 可能不是整数（如 220*4/3=293.333…），只比对数值近似
    expect(parseFloat(root.style.height)).toBeCloseTo((w * 4) / 3, 2);
    unmount();
  });

  it.each(widths)(
    'width=%i 时 description fontSize >= 9px 且为有限正值',
    (w) => {
      const { getByTestId, unmount } = render(
        <Card card={CARD_FIRE_STRIKE} width={w} />,
      );
      const desc = getByTestId('card-description') as HTMLElement;
      const px = parseFloat(desc.style.fontSize);
      expect(Number.isFinite(px)).toBe(true);
      expect(px).toBeGreaterThanOrEqual(9);
      unmount();
    },
  );

  it('s >= 0.6 时 flavor 渲染且 fontSize >= 9px', () => {
    // 140/220 ≈ 0.636 → flavor 可见（阈值 s>=0.6，见 Card.tsx showFlavor）
    const { getByTestId } = render(
      <Card card={CARD_FIRE_STRIKE} width={140} />,
    );
    const flavor = getByTestId('card-flavor') as HTMLElement;
    const px = parseFloat(flavor.style.fontSize);
    expect(px).toBeGreaterThanOrEqual(9);
  });

  it.each(widths)('width=%i 时 energy orb 内部字号为正整数', (w) => {
    const { getByTestId, unmount } = render(
      <Card card={CARD_FIRE_STRIKE} width={w} />,
    );
    const orb = getByTestId('card-energy-orb') as HTMLElement;
    const span = orb.querySelector('span');
    expect(span).not.toBeNull();
    const px = parseFloat(span!.style.fontSize);
    expect(Number.isFinite(px)).toBe(true);
    expect(px).toBeGreaterThanOrEqual(1);
    // round() 的结果必然是整数
    expect(Math.round(px)).toBe(px);
    unmount();
  });

  it('sealed=true 时封印戳 fontSize >= 10px（最窄 width=110）', () => {
    // 封印戳有独立 floor: Math.max(10, sc(14))；窄卡里 sc(14) 仍 < 10，
    // 此时 floor 生效。确保戳记不会缩成糊。
    const { getByTestId } = render(
      <Card card={CARD_FIRE_STRIKE} width={110} sealed />,
    );
    const stamp = getByTestId('card-seal-stamp') as HTMLElement;
    const px = parseFloat(stamp.style.fontSize);
    expect(px).toBeGreaterThanOrEqual(10);
  });
});

// ---------------------------------------------------------------------------
// 2. 妖卡底栏：RarityBadge + YaoxingStrip 同时存在
// ---------------------------------------------------------------------------
describe('Card · 妖卡底栏', () => {
  const yaoFixture: CardModel = {
    id: 'test_yao',
    name: '测试妖',
    type: 'yao',
    rarity: 'rare',
    school: 'yuling',
    cost: 1,
    description: '妖力示例描述以供测试。',
    flavor: '测试注释文案。',
    yaoxing: 55,
    silhouette: 'fox',
  };

  it('同时渲染稀有度徽章 SVG 与 YaoxingStrip，并显示对应档位文案', () => {
    const { container } = render(<Card card={yaoFixture} width={180} />);

    // RarityBadge 以 <svg aria-label="稀有度 ..."> 呈现
    const badge = container.querySelector('svg[aria-label^="稀有度"]');
    expect(badge).not.toBeNull();

    // 妖性条根节点存在
    expect(screen.getByTestId('yaoxing-strip')).toBeInTheDocument();

    // yaoxing=55 落在 [30, 60) → "躁动"
    expect(screen.getByText('躁动')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. 描述行 line-clamp
// ---------------------------------------------------------------------------
describe('Card · 描述行 line-clamp', () => {
  it('width=110 时 description 走 -webkit-box + line-clamp:3', () => {
    const { getByTestId } = render(
      <Card card={CARD_FIRE_STRIKE} width={110} />,
    );
    const desc = getByTestId('card-description') as HTMLElement;
    expect(desc.style.display).toBe('-webkit-box');
    expect(desc.style.webkitLineClamp).toBe('3');
  });
});

// ---------------------------------------------------------------------------
// 4. 窄卡结构阈值
// ---------------------------------------------------------------------------
describe('Card · 窄卡结构阈值', () => {
  // Card.tsx:
  //   orbSize = sc(width < 160 ? 26 : 32)
  //   showFlavor = Boolean(card.flavor) && s >= 0.6   (即 width >= 132)
  it('width=130 时能量水晶命中 <160 分支（base=26）', () => {
    // 在测试里复现 sc：Math.max(1, Math.round(base * width/220))
    const sc = (base: number) => Math.max(1, Math.round((base * 130) / 220));
    const expectedOrbPx = sc(26); // => 15
    // 反向参考：如果走了 >=160 分支，expected 会是 sc(32)=19，与 15 明显不同
    expect(expectedOrbPx).not.toBe(sc(32));

    const { getByTestId } = render(
      <Card card={CARD_FIRE_STRIKE} width={130} />,
    );
    const orb = getByTestId('card-energy-orb') as HTMLElement;
    expect(orb.style.width).toBe(`${expectedOrbPx}px`);
  });

  it('width=120（s≈0.545 < 0.6）时 flavor 被隐藏', () => {
    // Card.tsx: showFlavor = Boolean(card.flavor) && s >= 0.6；
    // s = 120/220 ≈ 0.545，低于 0.6 阈值 → flavor DOM 不渲染。
    const { queryByTestId } = render(
      <Card card={CARD_FIRE_STRIKE} width={120} />,
    );
    expect(queryByTestId('card-flavor')).toBeNull();
  });
});
