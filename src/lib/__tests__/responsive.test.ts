/**
 * 响应式模块边界测试。
 *
 * `bucketOf` 直接走 4 档（<640 / 640-767 / 768-1023 / >=1024），
 * 分界点落在 640 / 768 / 1024；这里逐点验证。
 *
 * 同时附带一个 `useResponsiveCardWidth` 的渲染 smoke：通过 jsdom 的 window.innerWidth
 * 注入假视口，渲染一个轻量消费组件，读回 TABLE['hand'][bucket] 对应的数值。
 */

import { render } from '@testing-library/react';
import React from 'react';
import { bucketOf, useResponsiveCardWidth } from '../responsive';

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

describe('useResponsiveCardWidth (hand)', () => {
  // 渲染一个极小的消费组件，hook 的返回值直接写到 textContent。
  function Probe() {
    const w = useResponsiveCardWidth('hand');
    return React.createElement('div', { 'data-testid': 'probe' }, String(w));
  }

  function setInnerWidth(px: number) {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: px,
    });
  }

  it('narrow 视口（375）返回 110', () => {
    setInnerWidth(375);
    const { getByTestId } = render(React.createElement(Probe));
    expect(getByTestId('probe').textContent).toBe('110');
  });

  it('tablet 视口（700）返回 125', () => {
    setInnerWidth(700);
    const { getByTestId } = render(React.createElement(Probe));
    expect(getByTestId('probe').textContent).toBe('125');
  });

  it('tabletWide 视口（768 = iPad 竖屏下界）返回 135', () => {
    setInnerWidth(768);
    const { getByTestId } = render(React.createElement(Probe));
    expect(getByTestId('probe').textContent).toBe('135');
  });

  it('wide 视口（1024 = 桌面下界）返回 140', () => {
    setInnerWidth(1024);
    const { getByTestId } = render(React.createElement(Probe));
    expect(getByTestId('probe').textContent).toBe('140');
  });
});
