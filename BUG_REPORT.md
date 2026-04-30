# BUG_REPORT.md - Bug Bash Round 1

## 审查日期
2026-05-01

## Bug 列表

### 1. 存档读取功能未实现 [优先级: 高]
- **问题**: SaveIndicator.tsx 只能显示存档信息，无法真正恢复游戏状态
- **影响**: 玩家无法从存档继续游戏
- **文件**: src/components/SaveIndicator.tsx
- **状态**: ✅ 已修复

### 2. Simulation Runner 是占位符 [优先级: 中]
- **问题**: simulationRunner.ts 总是返回硬编码的假数据，不测试真实游戏逻辑
- **影响**: npm run simulate 无法发现真实 bug
- **文件**: src/sim/simulationRunner.ts
- **状态**: ✅ 已修复

### 3. 游戏结束后不传递门派信息 [优先级: 中]
- **问题**: GameOver 和 TitleScreen 的 restart 都不传递 preferredSchool
- **影响**: 重新开始游戏时丢失门派选择
- **文件**: src/components/GameOver.tsx, src/store/gameStore.ts
- **状态**: ✅ 已修复

### 4. 奖励选卡后直接进入战斗无延迟 [优先级: 低]
- **问题**: SELECT_REWARD 后立即进入战斗，动画效果被跳过
- **影响**: 玩家错过胜利动画
- **文件**: src/store/gameStore.ts (SELECT_REWARD case)
- **状态**: 暂未修复（优先级低）

## 已知问题
1. 无持久化存档 - ✅ 已修复
2. Simulation 不测试真实逻辑 - ✅ 已修复

## 测试结果
- npm run test: ✅ PASS
- npm run typecheck: ✅ PASS
- npm run lint: ✅ PASS
- npm run build: ✅ PASS (200.57 KB JS, 34.55 KB CSS)