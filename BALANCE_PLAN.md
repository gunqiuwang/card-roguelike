# BALANCE_PLAN.md - 第四轮

## 本轮目标：Boss 战蓄力阶段机制

### 背景
- 三派核心机制已完成（斩妖爆发、御灵反击、符术共鸣）
- 当前 Boss 只是血量更厚，缺乏独特机制
- 需要让 Boss 战有"压迫感"和"记忆点"

### 设计理念
Boss 核心：**"蓄力大招，玩家应对"**
- Boss 每 3 回合蓄力
- 蓄力后释放"大妖神通"
- 玩家可打断 or 硬抗

### 必须实现的功能

#### 1. Boss 蓄力机制
- `bossChargeTurns`: Boss 蓄力剩余回合
- 每 3 回合进入蓄力状态（intent = 'charge'）
- 蓄力状态持续 1 回合
- 下一回合攻击变为"大妖神通"（普通攻击 × 2）

#### 2. 打断机制
- 蓄力期间，玩家单回合造成 ≥ 25 伤害，打断 Boss
- 打断后：大招取消，显示"打断神通"
- 使用 `interruptCharging` 字段标记

#### 3. 防御应对
- 未打断时，大妖神通伤害 × 2
- 玩家可用护盾抵挡（御灵派护体回响）

#### 4. 视觉反馈
- Boss 蓄势时：敌人区域变暗红
- 显示"神通蓄势"文案
- 大招前警告："大妖神通！"
- 打断时：金色破阵特效

### 平衡约束
- 只应用于 Boss 类型敌人
- 不影响 normal/elite 敌人
- 不新增复杂系统
- 不破坏三派机制

### 实现文件
- `types/index.ts`: Enemy 新增 `chargeTurns`, `isCharging`, `interruptCharging`
- `enemies.ts`: Boss 敌人设置 chargeTurns
- `gameStore.ts`: 蓄力逻辑和打断检测
- `Enemy.tsx`: 蓄力状态 UI
- `animationStore.ts`: 新增打断动画
- `index.css`: 蓄力视觉效果

### 预期效果
- 玩家看到 Boss"蓄力中"有压迫感
- 玩家有动力快速击杀 or 打断
- 御灵派护盾在高伤害时有价值
