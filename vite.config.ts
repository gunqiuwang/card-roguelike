/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite config
 *
 * 部署策略：
 * - GitHub Pages: 子路径 /card-roguelike/（由环境变量 VITE_BASE 注入）
 * - Vercel / 根域名: base '/'
 *
 * 开发时 VITE_BASE 未设置 → 使用 '/'。
 */
const base = process.env.VITE_BASE ?? '/';

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  test: {
    // jsdom 提供 window/document；globals 让 describe/it/expect 无需显式 import
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    // Tailwind v4 CSS 不参与单测：我们断言的都是内联样式，跳过 CSS 转换更快
    css: false,
  },
});
