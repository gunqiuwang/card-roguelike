/**
 * Game Cover · SVG-based ink wash style
 * No external images needed - pure SVG art
 */

const fs = require('fs');
const path = require('path');

const coverSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
  <defs>
    <!-- 墨韵渐变背景 -->
    <radialGradient id="inkBg" cx="50%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#1a1209"/>
      <stop offset="60%" stop-color="#0d0a06"/>
      <stop offset="100%" stop-color="#050402"/>
    </radialGradient>
    <!-- 符火橙光 -->
    <radialGradient id="emberGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#E08A48" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="#C4551B" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#8B3A0F" stop-opacity="0"/>
    </radialGradient>
    <!-- 狐狸幻光 -->
    <radialGradient id="foxGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF6B35" stop-opacity="0.7"/>
      <stop offset="50%" stop-color="#E84A2F" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#B83A1F" stop-opacity="0"/>
    </radialGradient>
    <!-- 水墨纹理 -->
    <filter id="inkTexture">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 0.15 0" in="noise" result="dark"/>
      <feBlend in="SourceGraphic" in2="dark" mode="multiply"/>
    </filter>
    <!-- 模糊 (for glow) -->
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <!-- 符阵路径 -->
    <symbol id="sealSymbol" viewBox="0 0 60 60">
      <circle cx="30" cy="30" r="26" fill="none" stroke="#C4551B" stroke-width="1.5" stroke-dasharray="4 2"/>
      <circle cx="30" cy="30" r="18" fill="none" stroke="#C4551B" stroke-width="1" opacity="0.6"/>
      <circle cx="30" cy="30" r="8" fill="none" stroke="#E08A48" stroke-width="1.5" opacity="0.8"/>
      <path d="M30 4 L33 20 L30 30 L27 20 Z" fill="#C4551B" opacity="0.5"/>
      <path d="M56 30 L40 33 L30 30 L40 27 Z" fill="#C4551B" opacity="0.5"/>
      <path d="M30 56 L27 40 L30 30 L33 40 Z" fill="#C4551B" opacity="0.5"/>
      <path d="M4 30 L20 27 L30 30 L20 33 Z" fill="#C4551B" opacity="0.5"/>
    </symbol>
  </defs>

  <!-- 背景 -->
  <rect width="400" height="600" fill="url(#inkBg)"/>

  <!-- 远山剪影 (background) -->
  <path d="M0 400 Q50 350 100 380 Q150 340 200 360 Q250 320 300 350 Q350 310 400 340 L400 600 L0 600 Z" fill="#0a0806" opacity="0.7"/>
  <path d="M0 450 Q80 400 160 430 Q220 380 300 410 Q350 370 400 390 L400 600 L0 600 Z" fill="#0d0a07" opacity="0.8"/>

  <!-- 符阵装饰 (左上) -->
  <use href="#sealSymbol" x="20" y="30" width="80" height="80" opacity="0.3"/>

  <!-- 符阵装饰 (右下) -->
  <use href="#sealSymbol" x="300" y="490" width="80" height="80" opacity="0.3"/>

  <!-- 中央符阵大图 -->
  <g transform="translate(200, 280)" filter="url(#glow)">
    <use href="#sealSymbol" x="-60" y="-60" width="120" height="120" opacity="0.5"/>
  </g>

  <!-- 狐狸幻身 (九尾狐剪影) -->
  <g transform="translate(200, 220)" filter="url(#glow)">
    <!-- 狐狸身体 -->
    <ellipse cx="0" cy="0" rx="40" ry="30" fill="#1a0f0a" opacity="0.8"/>
    <!-- 九尾 -->
    <path d="M-30 -10 Q-80 -60 -60 -100" stroke="#FF6B35" stroke-width="4" fill="none" opacity="0.4" stroke-linecap="round"/>
    <path d="M-20 -5 Q-70 -40 -55 -85" stroke="#FF6B35" stroke-width="4" fill="none" opacity="0.35" stroke-linecap="round"/>
    <path d="M-10 0 Q-55 -25 -45 -65" stroke="#FF6B35" stroke-width="4" fill="none" opacity="0.3" stroke-linecap="round"/>
    <path d="M10 0 Q55 -25 45 -65" stroke="#FF6B35" stroke-width="4" fill="none" opacity="0.3" stroke-linecap="round"/>
    <path d="M20 -5 Q70 -40 55 -85" stroke="#FF6B35" stroke-width="4" fill="none" opacity="0.35" stroke-linecap="round"/>
    <path d="M30 -10 Q80 -60 60 -100" stroke="#FF6B35" stroke-width="4" fill="none" opacity="0.4" stroke-linecap="round"/>
    <path d="M0 10 Q0 50 0 90" stroke="#FF6B35" stroke-width="3" fill="none" opacity="0.25" stroke-linecap="round"/>
    <!-- 狐狸头 -->
    <ellipse cx="0" cy="-15" rx="22" ry="18" fill="#1a0f0a" opacity="0.9"/>
    <!-- 耳朵 -->
    <path d="M-15 -28 L-22 -45 L-8 -32 Z" fill="#1a0f0a" opacity="0.8"/>
    <path d="M15 -28 L22 -45 L8 -32 Z" fill="#1a0f0a" opacity="0.8"/>
    <!-- 三只眼 (狐媚) -->
    <circle cx="-8" cy="-18" r="3" fill="#FF6B35" opacity="0.9"/>
    <circle cx="8" cy="-18" r="3" fill="#FF6B35" opacity="0.9"/>
    <circle cx="0" cy="-10" r="2" fill="#E08A48" opacity="0.7"/>
  </g>

  <!-- 封妖印符号 (右上角) -->
  <g transform="translate(340, 80)" opacity="0.6">
    <circle cx="0" cy="0" r="30" fill="none" stroke="#C4551B" stroke-width="2"/>
    <text x="0" y="7" font-size="24" text-anchor="middle" fill="#E08A48" font-family="serif">印</text>
  </g>

  <!-- 游戏标题 -->
  <text x="200" y="420" font-size="42" text-anchor="middle" fill="#E08A48"
        font-family="serif" font-weight="bold" letter-spacing="8"
        style="text-shadow: 0 0 20px #C4551B, 0 0 40px #8B3A0F;">
    山海志
  </text>
  <text x="200" y="460" font-size="20" text-anchor="middle" fill="#C9B890"
        font-family="serif" letter-spacing="12" opacity="0.9">
    封 妖 录
  </text>

  <!-- 分隔线 -->
  <line x1="100" y1="480" x2="300" y2="480" stroke="#C4551B" stroke-width="0.5" opacity="0.4"/>

  <!-- 副标题 -->
  <text x="200" y="510" font-size="11" text-anchor="middle" fill="#8B7355"
        font-family="sans-serif" letter-spacing="4" opacity="0.7">
    roguelike · 封妖 · 符咒 · 阴阳
  </text>

  <!-- 版本标识 -->
  <text x="200" y="570" font-size="9" text-anchor="middle" fill="#5a4a3a"
        font-family="monospace" letter-spacing="2" opacity="0.5">
    v1.0 · 2026
  </text>

  <!-- 角落墨点装饰 -->
  <circle cx="30" cy="570" r="3" fill="#C4551B" opacity="0.3"/>
  <circle cx="370" cy="570" r="3" fill="#C4551B" opacity="0.3"/>
  <circle cx="30" cy="30" r="2" fill="#E08A48" opacity="0.2"/>
  <circle cx="370" cy="30" r="2" fill="#E08A48" opacity="0.2"/>
</svg>`;

const outputPath = path.join(__dirname, '..', 'public', 'images', 'cover.svg');
fs.writeFileSync(outputPath, coverSvg.trim());
console.log('Cover saved to public/images/cover.svg');