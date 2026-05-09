# 《山海志·封妖录》视觉系统 · Art Bible

> 版本：v0.1 · 2026.05
> 所有立绘、UI、图标的视觉决策都必须对齐本文档。风格统一 >> 单点好看。

---

## 一、风格定位

**参考基准**：《黑神话·悟空》的**厚重写实国风**

- ✅ 是：Unreal Engine 5 级别的写实质感、厚重光影、山海神话氛围
- ❌ 不是：二次元、Q 版、可爱、萌系、赛博朋克、修真玄幻

**氛围三词**：**苍、冷、锐**
- **苍**：年代感、沧桑、风化
- **冷**：阴森、克制、不热血
- **锐**：棱角、强对比、不圆润柔和

---

## 二、色板（锁定七色）

所有 UI、插画、图标**只用**这七个主色及其衍生阶。禁止擅自引入新色。

```
--ink-black:     #0F0E0C   主背景、深夜、墨色
--parchment:     #C9B890   符纸底、卡面底、主文字背景
--vermillion:    #B23A2A   朱砂红、印章、关键按钮、封印
--ember:         #E87722   符火、高亮、能量溢出
--jade-dim:      #4A5D4A   法器、次要信息、祭坛
--bone-gold:     #A68C5B   金线、稀有边框、Boss 名称
--mist-grey:     #6B6259   次要文字、禁用态、雾
```

### 衍生阶（tailwind 里会自动生成 50-900 色阶）

主要使用方式：
- **背景**：`ink-black` 为主，`mist-grey` 辅
- **面板**：`parchment` 带 0.85 透明度，压在深背景上
- **文字**：`parchment` on dark, `ink-black` on parchment
- **强调**：`vermillion` 主 CTA，`ember` 次 CTA，`bone-gold` 稀有态

### 禁用色
- ❌ 纯白 `#FFFFFF`（改用 `parchment`）
- ❌ 纯黑 `#000000`（改用 `ink-black`）
- ❌ 任何鲜艳绿/蓝/紫
- ❌ pastel 色、糖果色

---

## 三、字体

### 中文
- **标题**：**"汉仪尚巍手书"** 风格（手写碑刻感）。Web fallback: `"Ma Shan Zheng", "STKaiti", serif`
- **正文**：**思源宋体**。Web fallback: `"Noto Serif SC", "Source Han Serif SC", "STSong", serif`
- **数字/能量**：**思源宋体 Heavy**，加粗显眼

### 英文/数字
- **标题**：`Cinzel, Georgia, serif`（罗马碑刻感，和东方碑刻呼应）
- **数字**：`"Cinzel", Georgia, serif`

### 字号规范

| 用途 | 字号 | 字重 |
|---|---|---|
| 游戏标题 | 48-64px | 手书 |
| 章节名 | 32px | 手书 |
| 卡名 | 20px | 宋体 bold |
| 卡牌描述 | 14px | 宋体 regular |
| 能量/血量数字 | 28px | 宋体 heavy |
| 正文 | 16px | 宋体 regular |
| 次要信息 | 12px | 宋体 light |

---

## 四、卡牌版式规范（3:4 比例）

```
┌─────────────────────────┐ <- 卡顶
│ [能量]      [稀有度]    │ <- 顶栏 8%
├─────────────────────────┤
│                         │
│                         │
│       立绘区域          │ <- 立绘 55%（3:4 底图）
│      (image2 生成)      │
│                         │
│                         │
├─────────────────────────┤
│      卡 名 (大)         │ <- 卡名 10%
├─────────────────────────┤
│                         │
│     卡牌描述文字        │ <- 描述 22%
│                         │
├─────────────────────────┤
│  [类型标签]  [派别标签] │ <- 底栏 5%
└─────────────────────────┘ <- 卡底
```

**固定参数**：
- 卡面宽:高 = **3:4**（和立绘比例一致）
- 圆角 `12px`
- 边框 `2px solid bone-gold`（稀有度升级改色）
- 底色 `parchment` + 纸质噪点纹理（CSS filter）

---

## 五、立绘生成 Prompt 模板

### 风格锚定（所有图通用前缀）

```
[STYLE_ANCHOR]:
Black Myth Wukong art style, Unreal Engine 5 photorealistic 
oriental dark fantasy. Chinese Shan Hai Jing mythology aesthetic. 
Cinematic chiaroscuro lighting, volumetric fog, god rays through 
mist, dust particles in air. Weathered textures, PBR materials, 
cracked surfaces, aged parchment, tarnished bronze. 

Color palette: deep ink black #0F0E0C, aged parchment #C9B890, 
vermillion red #B23A2A, ember orange #E87722, jade green #4A5D4A, 
bone gold #A68C5B. 

Ultra-detailed 8K key art, oil painting depth, dramatic composition,
masterpiece quality, vertical composition, negative space at bottom 
for text overlay.

Negative: anime, chibi, bright saturated colors, cute, modern 
elements, western fantasy, cartoon, pastel, watermark, text, 
deformed anatomy, extra limbs, blurry, low quality.
```

**image2 设置**：宽高比 **3:4（竖版）**

### 对象模板

#### A. 方士主角（已生成）
前缀 + 见主 Prompt，已锁定。

#### B. 妖怪卡（C级/普通）
```
[STYLE_ANCHOR] + 
[妖怪名及形态] + 
[姿态：lurking / stalking / roaring] + 
[场景：matching chapter biome] + 
"single creature centered, intimidating presence, 
muted natural palette, fog shroud"
```

#### C. 妖怪卡（B级/精英）
```
[STYLE_ANCHOR] + 
[妖怪名及形态 with mythic detail] + 
[强烈姿态] + 
"hero shot, low angle, glowing eyes, aura of corruption, 
partial silhouette with dramatic rim light"
```

#### D. Boss 妖怪（S级）
```
[STYLE_ANCHOR] + 
[妖怪名 epic form] + 
"colossal scale, environment-dominating, 
biblical composition, shattered landscape around it, 
multiple light sources, godlike but corrupted"
```

#### E. 符咒卡（无人物）
```
[STYLE_ANCHOR except character specifics] + 
"ancient Chinese talisman, glowing calligraphy on weathered 
yellow parchment, floating in dark void, embers and sparks, 
magical circuit of ink runes, no humans or creatures"
```

#### F. 场景/章节插画（横版 4:3）
```
[STYLE_ANCHOR] + 
[章节地貌：see LORE.md §二] + 
"wide environment shot, cinematic, no foreground character, 
establishing shot, sense of isolation and ancient danger"
```

---

## 六、命名与目录规范

### 文件命名
```
public/images/
├── hero/
│   └── fangshi_main.webp          # 方士主立绘
├── yao/                            # 妖怪立绘
│   ├── C_yaoguai_{id}.webp        # 普通
│   ├── B_elite_{id}.webp          # 精英
│   └── S_boss_{id}.webp           # Boss
├── fu/                             # 符咒
│   └── fu_{id}.webp
├── bg/                             # 场景背景
│   ├── ch1_qingqiu.webp
│   ├── ch2_taotie.webp
│   └── ...
└── ui/                             # UI 素材
    └── ...
```

### ID 命名
- 只用小写英文 + 下划线
- 妖怪：汉语拼音首选 `jiuweihu`, `xiangliu`, `taotie`
- 符咒：语义化 `fu_fire_strike`, `fu_iron_skin`

### 格式
- 所有图片**转为 WebP**（质量 85，大幅减小体积）
- 原始分辨率保留 **768×1024** 或更高
- 加载时按需缩放

---

## 七、降级与无图回退

**原则**：**任何时候无图都不崩**。

每张卡/每只妖都有两级回退：
```
L1: 有立绘 webp 文件     → 显示立绘
L2: 无文件              → 显示 SVG 墨影剪影 + 妖名
L3: 完全异常            → 灰色占位 + 文字
```

SVG 墨影规范：
- 用 `parchment` 底 + `ink-black` 剪影 + `vermillion` 点缀
- 每类妖有一个剪影模板（狐、蛇、兽、鸟、鱼、人形）
- 详见 `src/components/art/InkSilhouette.tsx`

---

## 八、动效语言（克制）

**原则**：**少而准**。不是炫技，是节奏。

所有动画 timing：
- **快**：`150ms cubic-bezier(0.4, 0, 0.2, 1)` —— 悬停、按钮
- **中**：`300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)` —— 卡牌、切换
- **慢**：`600ms ease-out` —— 章节转场、封印完成

**绝对禁止**：
- 反弹（spring）效果 —— 和"苍冷锐"气质冲突
- 彩虹/闪烁/霓虹效果
- 多重同时动画（超过 2 个层同时动）

**允许**：
- 墨水晕开（ink spread）
- 符火飘散（ember drift）
- 印章盖下（seal stamp）
- 风化/沙粒飘动（dust particles）

---

## 九、生图工作清单（随 IMAGE_WORKLIST.md 同步）

见 `docs/IMAGE_WORKLIST.md`。

---

## 十、变更流程

**新增/修改视觉元素流程**：
1. 先改本文档（Art Bible）
2. 改代码里的 `src/config/visual.ts`
3. 刷 `/styleguide` 页确认
4. 才能用到玩法里

> **不准绕过 Art Bible 直接写 UI 代码**。否则一个月后就乱了。
