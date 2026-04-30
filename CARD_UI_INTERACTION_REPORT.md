# 卡牌UI交互升级报告

## 概述
升级卡牌交互体验，提升"抽牌连击流"的爽感。包括：手牌弧形排列、悬停上浮、出牌飞向敌人、伤害弹字、敌人受击抖动。

## 手牌弧形排列

### 实现
```typescript
// Hand.tsx
const totalCards = player.hand.length;
const centerIndex = (totalCards - 1) / 2;
const offsetFromCenter = index - centerIndex;
const maxOffset = Math.max(1, totalCards / 2);
const normalizedOffset = offsetFromCenter / maxOffset;

// 两侧微微下沉
const baseTranslateY = normalizedOffset * 8;
```

### 效果
- 手牌呈弧形排列，中间高两边低
- 悬停时该牌上浮并放大
- 其他牌略微下沉，保持层次感

## 手牌悬停效果

### Card.tsx
```typescript
// 悬停样式
style={{
  transform: isHovered ? 'translateY(-16px) scale(1.06)' : 'translateY(0) scale(1)',
  zIndex: isHovered ? 100 : 10,
  boxShadow: isHovered
    ? '0 12px 30px rgba(45, 41, 38, 0.35), 0 0 25px rgba(196, 72, 62, 0.25)'
    : '0 4px 12px rgba(45, 41, 38, 0.15)',
}}
```

### 交互
- 鼠标悬停：卡牌上浮16px，放大1.06倍
- 阴影加深，增强立体感
- z-index提升到100，位于其他卡牌之上

## 出牌飞向敌人动画

### index.css
```css
@keyframes cardFlyToEnemy {
  0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
  50% { transform: translateY(-100px) scale(0.8) rotate(-10deg); opacity: 0.8; }
  100% { transform: translateY(-200px) scale(0.5) rotate(-20deg); opacity: 0; }
}

.card-fly-animation {
  animation: cardFlyToEnemy 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

### 效果
- 卡牌向上飞出并逐渐缩小
- 轻微旋转，增加动感
- 0.5秒完成，opacity渐变到0

## 伤害弹字

### Enemy.tsx - FloatingDamage组件
```typescript
function FloatingDamage({ value, type }: FloatingDamageProps) {
  return (
    <div className={type === 'damage' ? 'animate-damage-pop' : 'animate-heal-pop'}>
      {type === 'damage' ? `-${value}` : `+${value}`}
    </div>
  );
}
```

### 动画效果
```css
@keyframes damagePop {
  0% { transform: translateY(0) scale(0.3); opacity: 0; }
  20% { transform: translateY(-15px) scale(1.4); opacity: 1; } /* 弹起放大 */
  40% { transform: translateY(-30px) scale(1.1); opacity: 1; }
  100% { transform: translateY(-80px) scale(0.9); opacity: 0; }
}
```

### 显示机制
- 监听 `enemy.hp` 变化
- 当HP下降时，计算差值并显示伤害数字
- 0.8秒后自动移除

## 敌人受击抖动

### index.css
```css
@keyframes enemyHitShake {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  10% { transform: translateX(-8px) rotate(-3deg); }
  20% { transform: translateX(8px) rotate(3deg); }
  30% { transform: translateX(-6px) rotate(-2deg); }
  40% { transform: translateX(6px) rotate(2deg); }
  50% { transform: translateX(-4px) rotate(-1deg); }
  60% { transform: translateX(4px) rotate(1deg); }
  70% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
}

.animate-enemy-hit {
  animation: enemyHitShake 0.4s ease-out;
}
```

### 触发
- 当 `enemyShake` state 为 true 时应用
- 通过 `animationStore.triggerEnemyShake()` 触发
- 自动在0.4秒后重置

## 状态提示UI

### Hand.tsx - 状态指示器
```tsx
{/* 降费指示 */}
{pendingCostReduction > 0 && (
  <div className="animate-cost-reduce" style={{ background: 'rgba(74, 90, 45, 0.3)' }}>
    <span>⛓️</span>
    <span>费用-1</span>
  </div>
)}

{/* 连锁提示 */}
{cardsPlayedThisTurn > 1 && (
  <div className="animate-chain-pulse">
    <span>🔥</span>
    <span>x{cardsPlayedThisTurn}</span>
  </div>
)}
```

### 动画
- `animate-cost-reduce`: 费用降低指示，脉冲闪烁
- `animate-chain-pulse`: 连锁combo提示，光晕效果

## 新增动画列表

| 动画名 | 用途 | 时长 |
|--------|------|------|
| card-fly-animation | 出牌飞向敌人 | 0.5s |
| animate-damage-pop | 伤害数字弹出 | 0.8s |
| animate-heal-pop | 治疗数字弹出 | 0.7s |
| animate-enemy-hit | 敌人受击抖动 | 0.4s |
| animate-cost-reduce | 降费状态脉冲 | 循环1s |
| animate-chain-pulse | 连锁combo提示 | 循环0.8s |
| animate-draw-glow | 抽牌光效 | 0.5s |
| animate-energy-gain | 灵气获得闪烁 | 0.4s |
| animate-shield-shimmer | 护盾闪烁 | 循环1s |

## 验证结果
```
npm run build  ✅ PASS (190KB JS, 31KB CSS)
npm run test   ✅ PASS (2 tests)
```

## 文件变更
- `src/components/Hand.tsx` - 弧形排列、悬停效果、状态提示
- `src/components/Card.tsx` - hover上浮、出牌动画
- `src/components/Enemy.tsx` - 伤害弹字、受击抖动
- `src/index.css` - 新增8个动画