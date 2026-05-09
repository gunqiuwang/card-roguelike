# 山海志·封妖录

> 上古已亡，人间已失。你拾起一卷残破的封妖录，走进那片被遗忘的山海。

一款融合 **收服系 Roguelike 卡牌**（山海经宝可梦 × 杀戮尖塔）+ **拼符封印玩法**（Balatro 式组合） + **阴阳双道流派**（高玩构筑）的独立游戏。

---

## 状态

**当前版本：v0.1 · 视觉骨架**

这是一个**重建项目**。v0.1 仅包含：
- 项目骨架与目录结构
- 核心设计文档（世界观 / 玩法 / 视觉）
- 视觉样机页面 `/styleguide`
- 带立绘槽位的标题页

玩法从 **v0.2 封妖 MVP** 开始实现。

---

## 快速开始

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 产出到 dist/
npm run typecheck  # TS 检查
```

进入浏览器后：
- `/` —— 标题页
- `/styleguide` —— 视觉样机（所有 UI 元素平铺）

---

## 核心文档（按开发顺序阅读）

| 文档 | 内容 |
|---|---|
| [`docs/LORE.md`](docs/LORE.md) | 世界观、主角、五境地图、哲学基调 |
| [`docs/GAMEPLAY.md`](docs/GAMEPLAY.md) | 核心循环、战斗规则、封妖/拼符/妖性三层系统 |
| [`docs/ART_BIBLE.md`](docs/ART_BIBLE.md) | 视觉锚定、色板、字体、Prompt 模板 |
| [`docs/IMAGE_WORKLIST.md`](docs/IMAGE_WORKLIST.md) | 生图任务清单（给美术协作者） |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | 版本路线图 v0.1 → v1.0 |

---

## 技术栈

- **React 18** + **TypeScript 5** + **Vite 6**
- **Tailwind CSS v4** —— 视觉系统
- **Zustand** —— 状态管理
- **Vitest** —— 单元测试
- **TSX** —— 仿真器运行时

---

## 目录结构

```
src/
├── config/          # 视觉 / 数值 / 游戏参数（策划可调）
│   ├── visual.ts      # 色板、字号、卡面版式
│   ├── balance.ts     # 数值参数（伤害、费用、掉落）
│   └── game.ts        # 规则常量（手牌上限、抽卡数等）
├── data/            # 游戏内容（数据驱动）
│   ├── cards/         # 符咒卡
│   └── yao/           # 妖怪（每只 1 文件）
├── components/
│   ├── art/           # 艺术组件（立绘、墨影 fallback）
│   ├── card/          # 卡牌组件
│   ├── ui/            # 通用 UI
│   └── screens/       # 页面（标题、战斗、地图...）
├── lore/            # flavor text / 剧情文本
├── types/           # 全局类型
├── App.tsx          # 路由
└── main.tsx         # 入口

docs/                # 设计文档（不含实现）
public/
└── images/          # image2 生成的立绘 webp 放这里
```

---

## 贡献 / 协作流程

详见 [`docs/ART_BIBLE.md`](docs/ART_BIBLE.md) §十 变更流程。**原则**：先改文档，再改代码。
