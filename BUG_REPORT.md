# BUG_REPORT.md - Bug Bash Round 2

## 审查日期
2026-05-01

## Bug 列表

### 1. 存档读取功能未实现 [优先级: 高]
- **状态**: ✅ 已修复 (Round 1)

### 2. Simulation Runner 是占位符 [优先级: 中]
- **状态**: ✅ 已修复 (Round 1)

### 3. 游戏结束后不传递门派信息 [优先级: 中]
- **状态**: ✅ 已修复 (Round 1)

### 4. 奖励选卡后直接进入战斗无延迟 [优先级: 低]
- **状态**: 暂未修复（优先级低）

### 5. Boss `willUseUltimate` 标志未重置 [优先级: 中]
- **问题**: updateBossCharge 设置 `willUseUltimate = true` 后从未重置为 false
- **影响**: 多次蓄力循环后标志累积，可能导致UI显示异常
- **文件**: src/data/enemies.ts (updateBossCharge 函数)
- **验证中**: 实际影响需要真人测试

### 6. PlayerState 浅拷贝潜在问题 [优先级: 低]
- **问题**: gameStore 中 `{ ...state.player }` 只做浅拷贝，数组引用未隔离
- **当前状态**: 看起来已正确使用，因为 drawCards 等函数都返回新数组
- **风险**: 低，但如果有问题会导致状态污染

## 测试结果 (Round 2)
- npm run test: ✅ PASS
- npm run typecheck: ✅ PASS
- npm run lint: ✅ PASS
- npm run build: ✅ PASS (200.57 KB JS, 34.55 KB CSS)
- npm run simulate: ✅ PASS (斩符 造成伤害)