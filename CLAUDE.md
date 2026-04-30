# Card Roguelike Demo

## 项目概述
独立游戏全栈工程师视角开发的卡牌Roguelike战斗Demo，致敬Slay the Spire轻量玩法。

## 技术栈
- React 18 + Vite + TypeScript
- Tailwind CSS 4.0
- Zustand (状态管理)
- 适配 iPad 和手机浏览器

## 核心功能

### 战斗系统
- 玩家HP、能量、金币、牌库、弃牌堆、抽牌堆、手牌
- 每回合抽5张牌，恢复3点能量
- 格挡系统：格挡值在回合开始时清零

### 卡牌系统
- Strike：消耗1能量，造成6点伤害
- Defend：消耗1能量，获得5点格挡
- Heal：消耗2能量，恢复5点生命
- Fireball：消耗2能量，造成12点伤害

### 敌人系统
- 敌人HP、意图、攻击力
- 敌人意图在每个回合开始时随机决定（攻击/蓄力）
- 玩家结束回合后，敌人执行意图

### 胜负判定
- 敌人HP归零：显示胜利界面 + 三选一卡牌奖励
- 玩家HP归零：显示失败界面

## 代码结构
```
src/
  components/     # UI组件
  store/         # Zustand状态管理
  data/          # 卡牌数据、敌人数据
  types/         # TypeScript类型定义
```

## 命名规范
- 组件：PascalCase
- 函数/变量：camelCase
- 类型：PascalCase