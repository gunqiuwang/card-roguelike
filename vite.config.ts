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
});
