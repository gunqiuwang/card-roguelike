# Card Roguelike 🃏

卡牌Roguelike游戏，类似Slay the Spire的轻量玩法。

**版本**: RC-1 (Release Candidate)

## 游戏特性

- 🎴 **卡牌战斗** - 多种卡牌类型：攻击、防御、治疗
- ⚔️ **敌人变体** - 普通、精英、Boss 敌人
- 📊 **数值平衡** - 精心调整的游戏体验
- 🎨 **精美UI** - 暗黑童话风格，触屏优化
- 💾 **存档系统** - 自动保存游戏进度
- 🏆 **成就系统** - 追踪你的游戏统计
- 🔊 **音效反馈** - 战斗音效和震动反馈

## 技术栈

- React 18 + Vite + TypeScript
- Tailwind CSS 4.0
- Zustand (状态管理)
- Vitest (测试)

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
npm run preview
```

## 自动化测试

```bash
npm run test          # 单元测试
npm run typecheck     # TypeScript 类型检查
npm run lint          # ESLint 代码检查
npm run simulate      # 模拟运行
npm run build         # 生产构建
```

## 部署

已配置 Vercel 自动部署，推送到 main 分支自动部署。

- **GitHub**: https://github.com/gunqiuwang/card-roguelike
- **线上地址**: https://card-roguelike-six.vercel.app/

## 游戏说明

### 卡牌类型
- **Strike (打击)** - 消耗1能量，造成6点伤害
- **Defend (格挡)** - 消耗1能量，获得5点格挡
- **Fireball (火球术)** - 消耗2能量，造成12点伤害
- **Heal (治疗)** - 消耗2能量，恢复5点生命

### 战斗机制
- 每回合开始抽5张牌，恢复3点能量
- 点击卡牌出牌，消耗对应能量
- 点击"结束回合"结束你的回合
- 敌人会显示下一个意图（攻击或蓄力）
- 格挡值在本回合结束时清零

### 胜利条件
- 击败所有敌人获得胜利
- 击败敌人后可选择一张卡牌加入牌库

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 运行测试
npm run test
```

## 项目结构

```
src/
  components/     # React 组件
  store/          # Zustand 状态管理
  data/           # 游戏数据（卡牌、敌人）
  types/          # TypeScript 类型定义
  tests/          # 单元测试
  sim/            # 模拟器
```

## License

MIT
