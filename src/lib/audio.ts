/**
 * 音频系统 · v1.0
 *
 * 支持 BGM（背景音乐）+ SFX（音效）
 * 使用 Web Audio API，可多人同时播放
 * 音效文件放 public/audio/sfx/
 * BGM 文件放 public/audio/bgm/
 */

type SoundId = 'card_play' | 'card_draw' | 'damage' | 'heal' | 'seal' | 'seal_fail' | 'seal_success' | 'victory' | 'defeat' | 'click' | 'block' | 'yaoxing';
type BgmId = 'title' | 'battle' | 'event' | 'victory';

const sfxCache: Partial<Record<SoundId, AudioBuffer>> = {};
let audioCtx: AudioContext | null = null;
let bgmGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let bgmSource: AudioBufferSourceNode | null = null;
let bgmBuffer: AudioBuffer | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    bgmGain = audioCtx.createGain();
    sfxGain = audioCtx.createGain();
    bgmGain.connect(audioCtx.destination);
    sfxGain.connect(audioCtx.destination);
    bgmGain.gain.value = 0.4;
    sfxGain.gain.value = 0.8;
  }
  return audioCtx;
}

async function loadAudioBuffer(path: string): Promise<AudioBuffer | null> {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    const ab = await res.arrayBuffer();
    const ctx = getCtx();
    return await ctx.decodeAudioData(ab);
  } catch {
    return null;
  }
}

function playBuffer(buf: AudioBuffer, gain: GainNode, loop = false): void {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = loop;
  src.connect(gain);
  src.start();
}

/** 播放音效 */
export async function playSfx(id: SoundId): Promise<void> {
  if (sfxCache[id]) {
    playBuffer(sfxCache[id]!, sfxGain!, false);
    return;
  }
  const buf = await loadAudioBuffer(`/audio/sfx/${id}.mp3`);
  if (buf) {
    sfxCache[id] = buf;
    playBuffer(buf, sfxGain!, false);
  }
}

/** 播放背景音乐 */
export async function playBgm(id: BgmId): Promise<void> {
  const path = `/audio/bgm/${id}.mp3`;
  if (!bgmBuffer) {
    bgmBuffer = await loadAudioBuffer(path);
    if (bgmBuffer) {
      if (bgmSource) bgmSource.stop();
      playBuffer(bgmBuffer, bgmGain!, true);
    }
  } else {
    // 切换曲目
    if (bgmSource) bgmSource.stop();
    const buf = await loadAudioBuffer(path);
    if (buf) {
      bgmBuffer = buf;
      playBuffer(buf, bgmGain!, true);
    }
  }
}

/** 停止 BGM */
export function stopBgm(): void {
  if (bgmSource) {
    bgmSource.stop();
    bgmSource = null;
  }
  bgmBuffer = null;
}

/** 设置 BGM 音量（0~1） */
export function setBgmVolume(v: number): void {
  if (bgmGain) bgmGain.gain.value = Math.max(0, Math.min(1, v)) * 0.4;
}

/** 设置 SFX 音量（0~1） */
export function setSfxVolume(v: number): void {
  if (sfxGain) sfxGain.gain.value = Math.max(0, Math.min(1, v)) * 0.8;
}

/** 静音切换 */
export function setMasterMute(muted: boolean): void {
  if (bgmGain) bgmGain.gain.value = muted ? 0 : 0.4;
  if (sfxGain) sfxGain.gain.value = muted ? 0 : 0.8;
}