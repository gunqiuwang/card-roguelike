/**
 * 存档层 · v0.2
 *
 * 存档到 localStorage，key: `shanhai.v0.2`
 *
 * 策略：
 *   · 加字段 → 向前兼容（默认填充）
 *   · 删字段 → 忽略
 *   · SCHEMA_VERSION / CONTENT_VERSION 不匹配 → 只保留 meta
 *
 * 仿真器 / Node 环境下无 localStorage → 内存存档 fallback。
 */

import type { MetaProgress, RunState, SaveData } from '../types';
import { CONTENT_VERSION, SAVE_SCHEMA_VERSION } from '../types';

const KEY = 'shanhai.v0.2';

function emptyMeta(): MetaProgress {
  return {
    runs: 0,
    victories: 0,
    seals: 0,
    deepestChapter: 0,
    unlockedYao: [],
    tutorialDone: false,
  };
}

function emptySave(): SaveData {
  return {
    version: SAVE_SCHEMA_VERSION,
    contentVersion: CONTENT_VERSION,
    runInProgress: null,
    meta: emptyMeta(),
  };
}

// ============================================================================
// 内存 fallback
// ============================================================================
let memoryStore: string | null = null;
function hasLocalStorage(): boolean {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}
function rawRead(): string | null {
  if (hasLocalStorage()) return localStorage.getItem(KEY);
  return memoryStore;
}
function rawWrite(v: string | null): void {
  if (hasLocalStorage()) {
    if (v === null) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, v);
  } else {
    memoryStore = v;
  }
}

// ============================================================================
// 加载 / 保存
// ============================================================================
export function loadSave(): SaveData {
  const raw = rawRead();
  if (!raw) return emptySave();
  try {
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    if (parsed.version !== SAVE_SCHEMA_VERSION) {
      // schema 不兼容 → 只保留 meta（若存在则迁移，否则空）
      const meta = migrateMeta(parsed.meta);
      return { ...emptySave(), meta };
    }
    if (parsed.contentVersion !== CONTENT_VERSION) {
      // 内容不兼容 → 清空 runInProgress，保留 meta
      return {
        version: SAVE_SCHEMA_VERSION,
        contentVersion: CONTENT_VERSION,
        runInProgress: null,
        meta: { ...emptyMeta(), ...(parsed.meta as MetaProgress | undefined) },
      };
    }
    return {
      version: SAVE_SCHEMA_VERSION,
      contentVersion: CONTENT_VERSION,
      runInProgress: parsed.runInProgress ?? null,
      meta: { ...emptyMeta(), ...(parsed.meta as MetaProgress | undefined) },
    };
  } catch {
    // 损坏的存档，清空
    rawWrite(null);
    return emptySave();
  }
}

export function saveSave(data: SaveData): void {
  try {
    rawWrite(JSON.stringify(data));
  } catch {
    // 配额不足 / 私有模式 — 忽略
  }
}

export function clearSave(): void {
  rawWrite(null);
}

// ============================================================================
// 辅助
// ============================================================================
function migrateMeta(m: Partial<MetaProgress> | undefined): MetaProgress {
  if (!m) return emptyMeta();
  return {
    runs: m.runs ?? 0,
    victories: m.victories ?? 0,
    seals: m.seals ?? 0,
    deepestChapter: m.deepestChapter ?? 0,
    unlockedYao: m.unlockedYao ?? [],
    tutorialDone: m.tutorialDone ?? false,
  };
}

// ============================================================================
// 便利 API：单独写 run / meta
// ============================================================================
export function persistRun(run: RunState | null): void {
  const cur = loadSave();
  cur.runInProgress = run;
  saveSave(cur);
}

export function persistMeta(meta: MetaProgress): void {
  const cur = loadSave();
  cur.meta = meta;
  saveSave(cur);
}

export function updateMeta(patch: (meta: MetaProgress) => void): MetaProgress {
  const cur = loadSave();
  patch(cur.meta);
  saveSave(cur);
  return cur.meta;
}
