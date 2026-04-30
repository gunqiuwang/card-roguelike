# UI Redesign Report - Phase 1

## Overview
对卡牌Roguelike游戏进行了第一轮UI重构，采用"Q版暗黑童话 + 魔王卡牌 + 移动端友好"视觉风格。本轮只优化UI，不新增玩法系统。

## 视觉方向
- **风格**: Q版暗黑童话，魔王城堡，温暖但有一点神秘
- **不使用**: 写实恐怖、赛博朋克、廉价网页按钮风、大面积纯黑
- **主色调**: 深紫 #1A1128、酒红 #9B2D5A、暖金 #D4863D、羊皮纸色 #F5E6D3

## 已完成的重构

### 1. 色彩系统重构
- 创建了完整的设计令牌系统 (`src/theme.ts`)
- 更新 Tailwind 配置，包含新的颜色变量
- 更新 `index.css`，包含新的动画和主题变量

**新配色方案**:
| 用途 | 颜色 |
|------|------|
| 背景 | #1A1128 (深紫黑) |
| 表面层 | #2D1F42 (暗紫) |
| 主色调 | #D4863D (暖金) |
| 强调色 | #9B2D5A (酒红) |
| 卡牌底色 | #F5E6D3 (羊皮纸) |
| 攻击卡 | #C44536 (红) |
| 防御卡 | #4A7C9B (蓝) |
| 治疗卡 | #4A9B5C (绿) |

### 2. 战斗主界面重构

#### Game.tsx
- 添加了城堡石砖纹理背景装饰
- 敌人区域添加了聚光灯效果
- 整体布局保持不变但视觉更有层次感

#### BattleArea.tsx
- 回合指示器改为酒红/绿色渐变风格
- 添加了脉冲动画效果
- 更像城堡旗帜/横幅

### 3. 卡牌组件重构

#### Card.tsx - 全新设计
- **卡牌边框**: 根据稀有度显示不同颜色宝石（starter=灰褐，common=蓝，rare=紫）
- **费用宝石**: 魔法水晶球风格，金色渐变
- **卡牌背景**: 深色系渐变（攻击红、防御蓝、治疗绿）
- **卡牌图片区**: 魔法封印风格显示类型图标
- **卡名**: 卷轴横幅风格
- **描述文字**: 古典字体风格
- **类型标签**: 底部圆角标签

#### Hand.tsx
- 卡组/弃牌堆显示改为中世纪道具风格
- 使用"抽牌堆/弃牌堆"中文标签
- 手牌区域有微妙的阴影和边框

### 4. 玩家状态栏重构

#### PlayerStats.tsx
- **顶部HUD条**: 回合计数器、能量宝石、金币
  - 回合: 火焰风格徽章
  - 能量: 魔法宝石球体，有发光效果
  - 金币: 宝藏风格
- **HP条**: 城堡血条风格
  - 深色背景配渐变填充
  - 低血量时颜色变化（红/橙/深红）
  - 格挡时显示水晶蓝光
- **结束回合按钮**: 酒红色渐变，魔法边框风格

### 5. 敌人区域重构

#### Enemy.tsx
- **名称横幅**: 精英/BOSS显示不同边框颜色
- **敌人画像**: 城堡怪物肖像风格
  - 根据类型: 普通(灰褐)/精英(金)/BOSS(酒红) 不同边框
- **HP条**: 与玩家HP条风格一致
- **意图显示**: 水晶球风格
  - 攻击: 红色剑图标
  - 蓄力: 紫色骷髅图标

### 6. 动画增强

新增动画 (`index.css`):
- `cardPlayAnimation`: 卡牌打出时缩放+旋转+上升
- `cardDrawAnimation`: 抽卡时从右侧滑入
- `healGlow`: 治疗时绿色发光
- `blockFlash`: 格挡时蓝色闪烁
- `buttonPress`: 按钮按下效果
- `energyUse`: 能量使用时的闪光
- `turnPulse`: 回合指示器脉冲

### 7. 按钮样式统一
- SoundToggle: 暗紫色背景，悬停变亮
- 所有按钮使用圆角边框和阴影

## 保持不变的内容
- 战斗逻辑完全未修改
- 存档系统正常工作
- 所有测试通过 (2/2)
- 构建成功 (177KB JS, 37KB CSS)
- 响应式布局保持

## 验证结果
```
npm run build  ✅ PASS (177KB JS, 37KB CSS)
npm run test   ✅ PASS (2 tests)
npm run typecheck ✅ PASS
npm run lint   ✅ PASS
```

## 下一步建议（未执行）
- GameOver.tsx 重构（失败/胜利界面）
- RewardSelection.tsx 重构（奖励选择界面）
- StatsDisplay.tsx 重构（统计面板）
- 敌人emoji替换为可爱的小魔王怪物图片/SVG
- 添加更多卡牌插画风格元素
- 治愈/伤害数字弹出动画优化

## 文件变更列表
- `src/index.css` - 重写，包含完整主题和动画
- `tailwind.config.js` - 更新颜色和字体配置
- `src/theme.ts` - 新增设计令牌文件
- `src/components/Game.tsx` - 背景装饰和布局
- `src/components/BattleArea.tsx` - 回合指示器
- `src/components/Card.tsx` - 全新卡牌设计
- `src/components/Hand.tsx` - 卡组信息显示
- `src/components/PlayerStats.tsx` - HUD风格状态栏
- `src/components/Enemy.tsx` - 城堡怪物风格
- `src/components/SoundToggle.tsx` - 统一样式