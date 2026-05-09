/**
 * 统一资源路径解析
 *
 * 在 GitHub Pages 上项目部署在子路径（如 /card-roguelike/），
 * 直接写 '/images/xxx.png' 会 404。
 * 所有 public/ 下的静态资源都应通过 asset() 包一层。
 */
const BASE = import.meta.env.BASE_URL ?? '/';

export function asset(path: string): string {
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  const baseNormalized = BASE.endsWith('/') ? BASE : `${BASE}/`;
  return `${baseNormalized}${normalized}`;
}
