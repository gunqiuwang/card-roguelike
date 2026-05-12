# 山海志·封妖录

> 上古已亡，人间已失。你拾起一卷残破的封妖录，走进那片被遗忘的山海。

一款融合 **收服系 Roguelike 卡牌**（山海经宝可梦 × 杀戮尖塔）+ **拼符封印玩法**（Balatro 式组合） + **阴阳双道流派**（高玩构筑）的独立游戏。

---

## 状态

**当前版本：v0.4 · 妖性系统** ✅ 已上线

v0.4 新增：
- 妖卡妖性 0-100（打出 +5，闲置 -1/战）
- 躁动（≥60 10%自残）/ 狂乱（≥90 必自残+可能丢牌）
- 祭坛「驯妖」消耗灵气降低妖性
- 夜间反噬（平均妖性≥50 时扣 10% maxHP）
- 战斗中 yao 手牌显示躁/狂警告徽章

开发中：v0.5 阴阳双道 → v1.0 发布

---

## 快速开始

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 产出到 dist/
npm run typecheck  # TS 检查
npm test           # 引擎 smoke 测试
```

---

## 部署

| 环境 | 说明 |
|---|---|
| **Vercel** | `main` 分支自动部署 → https://card-roguelike.vercel.app |
| **GitHub Pages** | `gh-pages` 分支静态产物 |

发布流程：PR 合并 `main` → 自动部署 Vercel → 打 GitHub Release

---

## 技术栈

- **React 18** + **TypeScript 5** + **Vite 6**
- **Tailwind CSS v4** —— 视觉系统
- **Zustand** —— 状态管理
- **Vitest** —— 单元测试
