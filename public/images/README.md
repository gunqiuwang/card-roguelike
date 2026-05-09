# 图片资源目录

**此目录用于存放 image2 生成的立绘 webp 文件。**

详见 [`docs/IMAGE_WORKLIST.md`](../../docs/IMAGE_WORKLIST.md)。

## 目录结构

```
public/images/
├── hero/          ← 主角立绘
│   └── fangshi_main.webp
├── yao/           ← 妖怪立绘
│   ├── C_*.webp   ← 普通妖
│   ├── B_*.webp   ← 精英妖
│   └── S_*.webp   ← Boss 妖
├── fu/            ← 符咒卡
├── bg/            ← 场景背景
└── ui/            ← UI 素材
```

## 命名规范

- 全小写英文 + 下划线
- 妖怪：汉语拼音 `jiuweihu`, `xiangliu`
- 前缀：`C_` / `B_` / `S_` 表示等级

**没有图的时候代码会自动使用 SVG 墨影剪影兜底**，所以你可以按自己节奏逐批生图。
