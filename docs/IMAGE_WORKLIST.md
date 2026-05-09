# 生图工作清单

> 所有生图任务清单。你用 image2 生图，生完把文件按 ID 命名放到对应目录。代码自动识别。
>
> **生图前必读**：`docs/ART_BIBLE.md` §五 Prompt 模板

---

## 操作流程

1. 复制下方 Prompt（已包含风格锚定前缀）
2. 打开 image2
3. **宽高比**：选 **"竖版 3:4"**（立绘/卡牌）或 **"横版 4:3"**（场景）
4. 生成 → 挑你最喜欢的 1 张
5. **下载、重命名、放到指定路径**（见每条下方）
6. 生完在清单上把 ⬜ 改成 ✅，告诉我就行

---

## 🎨 风格锚定前缀（每条 Prompt 都已包含）

```
[STYLE_ANCHOR]:
Black Myth Wukong art style, Unreal Engine 5 photorealistic 
oriental dark fantasy. Chinese Shan Hai Jing mythology aesthetic. 
Cinematic chiaroscuro lighting, volumetric fog, god rays through 
mist, dust particles in air. Weathered textures, PBR materials, 
cracked surfaces, aged parchment, tarnished bronze. 

Color palette: deep ink black #0F0E0C, aged parchment #C9B890, 
vermillion red #B23A2A, ember orange #C4551B, jade green #4A5D4A, 
bone gold #A68C5B. 

Ultra-detailed 8K key art, oil painting depth, dramatic composition,
masterpiece quality, vertical composition, negative space at bottom 
for text overlay.

Negative: anime, chibi, bright saturated colors, cute, modern 
elements, western fantasy, cartoon, pastel, watermark, text, 
deformed anatomy, extra limbs, blurry, low quality.
```

---

## v0.1 优先级：只生 **1 张**

我们先只生 **1 张** 方士主角图，验证 image2 的实际输出风格，再扩展。

### ✅ 任务 #1 · 方士主角立绘（**高优先级**）

- **文件名**：`fangshi_main.webp`
- **路径**：`public/images/hero/fangshi_main.webp`
- **宽高比**：**竖版 3:4**
- **Prompt**：

```
[STYLE_ANCHOR]

Subject: A weathered Chinese Taoist exorcist in his early 30s, 
standing alone on a cracked stone altar at dusk. Ancient Shan Hai 
Jing mountains loom in the background, swallowed by mist. Dead 
withered trees flank him.

Costume: Tattered dark-grey Taoist robe with faded crimson trim at 
collar and sleeves, worn rope belt with bronze rings, straw sandals. 
Long black hair tied in a loose topknot pierced by a jade hairpin. 
A deep vertical scar running through his left eye. Solemn expression, 
eyes with quiet resolve.

Props: In his right hand, a yellow paper talisman ignites with cold 
blue flame between two fingers held in a mudra. In his left, a 
tarnished bronze bagua mirror reflects something unseen. A worn 
leather scroll case strapped across his back. A small gourd and 
brass bell on his rope belt. Faint glowing ink runes float around 
him like embers.

Composition: Low angle hero shot, vertical framing, character 
occupying upper 60% of frame, empty misty space at bottom for text 
overlay. Volumetric god rays through fog, rim light from a blood-red 
setting sun behind him.
```

- **生完告诉我**（请附文字描述，因为我看不到图）：
  1. 年龄感觉如何（30 左右？更老？更年轻？）
  2. 气质是"冷峻 / 沧桑 / 英武 / 神秘"中的哪种
  3. 最抢眼的 3 个颜色
  4. 哪里喜欢 / 哪里想调
- **状态**：⬜ 待生

---

## 🔜 v0.2 将要用到的清单（**等方士图验收通过后再生**）

### 章节一：青丘残岭

#### 任务 #2 · 场景背景 · 青丘残岭（横版 4:3）
- 文件：`public/images/bg/ch1_qingqiu.webp`
- Prompt：

```
[STYLE_ANCHOR]

Environment establishing shot: Ancient Chinese wilderness at dusk, 
rolling misty hills covered in dead withered trees with twisted black 
branches. Abandoned fox dens visible as dark holes in the hillsides. 
Blood-red sunset bleeding through low clouds. No characters. Wide 
cinematic composition, horizontal framing.

Atmosphere: Eerie quiet, sense of isolation, something watching from 
the mist, ancient and cursed. Negative space in upper 40% for UI 
elements.
```

- 状态：⬜ 待生

#### 任务 #3 · 青狐小妖（C 级妖）
- 文件：`public/images/yao/C_qinghu.webp`
- Prompt：

```
[STYLE_ANCHOR]

Subject: A small fox spirit with tattered grey-red fur, standing 
alone in misty withered woods. Unnaturally elongated limbs, three 
slitted glowing amber eyes, charred patches on its coat, a single 
crimson tail tipped with ember-glow. Hunched predatory stance.

Mood: Lurking, cunning, pitiable but dangerous. Not cute. Not a 
pet. A starving ghost-thing.

Composition: Centered creature, low angle, heavy fog, single spear 
of sunset light catching its eyes. Vertical framing.
```

- 状态：⬜ 待生

#### 任务 #4 · 九尾狐·绯（B 级精英 / 章节 Boss）
- 文件：`public/images/yao/S_jiuweihu.webp`
- Prompt：

```
[STYLE_ANCHOR]

Subject: A majestic nine-tailed fox spirit in her half-woman form, 
hovering above a cliff edge at midnight. Pale porcelain skin, white 
hair flowing like smoke, wearing torn red silk robes trailing into 
ash. Nine ethereal tails spread behind her like a halo of fox spirits, 
each tail emitting cold blue flame. Amber slit eyes with ancient 
sorrow.

Mood: Divine but fallen, seductive but tragic, not to be loved but 
to be feared.

Composition: Hero shot, rule of thirds, her floating in upper center, 
moon as backlight creating silhouette with rim light on edges of 
tails. Blood moon behind her. Vertical framing.
```

- 状态：⬜ 待生

---

## 🔜 v0.2 示例符咒卡（2 张占位即可）

#### 任务 #5 · 《烈焰符》
- 文件：`public/images/fu/fu_fire_strike.webp`
- Prompt：

```
[STYLE_ANCHOR]

Subject: An ancient yellow parchment talisman unfurled in the void, 
its Chinese calligraphy written in crimson cinnabar ink now burning 
with ember-orange flame. Sparks and embers floating around it, 
smoke curling upward. No humans, no creatures.

Composition: Talisman centered, flames breathing outward, dark void 
background with faint floating ink particles. Vertical framing.
```

- 状态：⬜ 待生

#### 任务 #6 · 《镇魂符》
- 文件：`public/images/fu/fu_soul_seal.webp`
- Prompt：

```
[STYLE_ANCHOR]

Subject: A weathered yellow parchment talisman with dense black ink 
calligraphy, a crimson circular seal stamped dead-center over the 
writing. Chains of golden ink runes coil around it like shackles. 
No flame, only quiet weight.

Composition: Centered, hanging in cold blue void, chains stretching 
into darkness. Sense of finality and binding. Vertical framing.
```

- 状态：⬜ 待生

---

## 命名核对（代码会读的路径）

生完放这些位置，代码自动读：

```
public/images/
├── hero/
│   └── fangshi_main.webp            ← 任务 #1
├── bg/
│   └── ch1_qingqiu.webp             ← 任务 #2
├── yao/
│   ├── C_qinghu.webp                ← 任务 #3
│   └── S_jiuweihu.webp              ← 任务 #4
└── fu/
    ├── fu_fire_strike.webp          ← 任务 #5
    └── fu_soul_seal.webp            ← 任务 #6
```

**没有图**也不影响 demo 跑起来——代码会自动用 SVG 墨影剪影占位。
