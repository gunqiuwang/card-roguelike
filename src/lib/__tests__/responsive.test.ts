/**
 * 响应式模块边界测试。
 *
 * `bucketOf` 直接走 4 档（<640 / 640-767 / 768-1023 / >=1024），
 * 分界点落在 640 / 768 / 1024；这里逐点验证。
 *
 * `useResponsiveCardWidth` 在挂载时通过 jsdom 的 window.innerWidth 注入假视口，
 * 渲染一个轻量消费组件并读回 TABLE[mode][bucket]。覆盖：
 *   · hand 模式的四档边界（110/125/135/140）
 *   · 其余 4 个模式在 tabletWide=768 的返回值（防止表行打字错过 CI）
 *   · orientationchange 事件触发重新读取视口宽度（iOS Safari 旋转兜底）
 */

import { act, render } from '@testing-library/react';
import React from 'react';
import {
  bucketOf,
  useResponsiveCardWidth,
  type ResponsiveMode,
} from '../responsive';

// 每个测试后把 window.innerWidth 归位到 jsdom 默认值（1024），
// 避免上一个用例写入的值泄漏到下一个用例。
afterEach(() => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: 1024,
  });
});

function setInnerWidth(px: number) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: px,
  });
}

// 渲染一个极小的消费组件，hook 的返回值直接写到 textContent。
function Probe({ mode }: { mode: ResponsiveMode }) {
  const w = useResponsiveCardWidth(mode);
  return React.createElement('div', { 'data-testid': 'probe' }, String(w));
}

describe('bucketOf', () => {
  it('<640 → narrow', () => {
    expect(bucketOf(0)).toBe('narrow');
    expect(bucketOf(320)).toBe('narrow');
    expect(bucketOf(639)).toBe('narrow');
  });

  it('[640, 768) → tablet', () => {
    expect(bucketOf(640)).toBe('tablet');
    expect(bucketOf(767)).toBe('tablet');
  });

  it('[768, 1024) → tabletWide', () => {
    expect(bucketOf(768)).toBe('tabletWide');
    expect(bucketOf(1023)).toBe('tabletWide');
  });

  it('>=1024 → wide', () => {
    expect(bucketOf(1024)).toBe('wide');
    expect(bucketOf(1440)).toBe('wide');
  });
});

describe('useResponsiveCardWidth (hand · 四档边界)', () => {
  it('narrow 视口（375）返回 110', () => {
    setInnerWidth(375);
    const { getByTestId } = render(
      React.createElement(Probe, { mode: 'hand' }),
    );
    expect(getByTestId('probe').textContent).toBe('110');
  });

  it('tablet 视口（700）返回 125', () => {
    setInnerWidth(700);
    const { getByTestId } = render(
      React.createElement(Probe, { mode: 'hand' }),
    );
    expect(getByTestId('probe').textContent).toBe('125');
  });

  it('tabletWide 视口（768 = iPad 竖屏下界）返回 135', () => {
    setInnerWidth(768);
    const { getByTestId } = render(
      React.createElement(Probe, { mode: 'hand' }),
    );
    expect(getByTestId('probe').textContent).toBe('135');
  });

  it('wide 视口（1024 = 桌面下界）返回 140', () => {
    setInnerWidth(1024);
    const { getByTestId } = render(
      React.createElement(Probe, { mode: 'hand' }),
    );
    expect(getByTestId('probe').textContent).toBe('140');
  });
});

describe('useResponsiveCardWidth (全模式 · tabletWide=768)', () => {
  // iPad 竖屏（768px）各模式应落到 tabletWide 行；这里逐模式钉死返回值，
  // 防止 TABLE 某行打字错时 hand 之外的模式不被 CI 捕获。
  // 期望值来自 src/lib/responsive.ts 的 TABLE[mode].tabletWide：
  //   hand=135, reward=170, deck=138, shrine=136, overflow=142
  const cases: ReadonlyArray<[ResponsiveMode, string]> = [
    ['hand', '135'],
    ['reward', '170'],
    ['deck', '138'],
    ['shrine', '136'],
    ['overflow', '142'],
  ];

  it.each(cases)('mode=%s 在 768 视口返回 %s', (mode, expected) => {
    setInnerWidth(768);
    const { getByTestId } = render(React.createElement(Probe, { mode }));
    expect(getByTestId('probe').textContent).toBe(expected);
  });
});

describe('useResponsiveCardWidth · resize / orientationchange', () => {
  it('orientationchange 从 narrow(375) 切到 tabletWide(768) 后值从 110 升到 135', () => {
    // 1. 窄视口挂载 → narrow 档，hand=110
    setInnerWidth(375);
    const { getByTestId } = render(
      React.createElement(Probe, { mode: 'hand' }),
    );
    expect(getByTestId('probe').textContent).toBe('110');

    // 2. 模拟 iOS Safari 的旋转事件：先改 innerWidth，再派发 orientationchange
    // act() 包裹以确保 React 冲刷监听器里的 setState。
    act(() => {
      setInnerWidth(768);
      window.dispatchEvent(new Event('orientationchange'));
    });

    // 3. 重新读取 → tabletWide 档，hand=135
    expect(getByTestId('probe').textContent).toBe('135');
  });
});
