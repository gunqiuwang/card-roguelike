# FIX_REPORT.md - Bug Bash Round 2

## 修复日期
2026-05-01

## 修复的问题

### 1. Boss `willUseUltimate` 标志未重置 [优先级: 中]
- **问题**: updateBossCharge 设置 `willUseUltimate = true` 后，在 END_TURN 触发大招但未清除标志
- **影响**: 多次蓄力循环后标志累积，可能导致UI显示异常
- **文件**: src/store/gameStore.ts (END_TURN case 中的 Boss 蓄力检测)
- **修复**: 在触发 bossInterrupt 或 bossUltimate 后，清除 willUseUltimate 标志

## 验证结果
- npm run test: ✅ PASS
- npm run typecheck: ✅ PASS
- npm run lint: ✅ PASS
- npm run build: ✅ PASS (200.62 KB JS, 34.55 KB CSS)
- npm run simulate: ✅ PASS (斩符 造成伤害，enemyHp: 32)

## 遗留问题
- 奖励选卡后直接进入战斗无延迟（优先级低，暂未修复）