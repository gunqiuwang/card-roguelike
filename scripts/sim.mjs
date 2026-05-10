#!/usr/bin/env node
/**
 * 仿真器 CLI · esbuild bundle + node 直接跑
 *
 * 用法：
 *   node scripts/sim.mjs            # 默认 200 局
 *   node scripts/sim.mjs 1000       # 1000 局
 *   node scripts/sim.mjs 1000 123   # 1000 局，seed=123
 */

import { build } from 'esbuild';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const tmpDir = resolve(root, 'node_modules/.sim-cache');
mkdirSync(tmpDir, { recursive: true });
const outFile = resolve(tmpDir, 'runBaseline.mjs');

const entry = resolve(tmpDir, 'entry.ts');
writeFileSync(
  entry,
  `import { runBaseline } from '${resolve(root, 'src/sim/runBaseline.ts').replace(/\\/g, '/')}';
const count = Number(process.argv[2] ?? 200);
const seed = Number(process.argv[3] ?? 42);
const r = runBaseline(count, seed);
const pct = (n) => (n * 100).toFixed(1) + '%';
console.log([
  'Runs        : ' + r.runs,
  'Wins        : ' + r.wins + ' (' + pct(r.winRate) + ')',
  'Avg turns   : ' + r.avgTurns.toFixed(2),
  'Winner HP % : ' + pct(r.avgWinnerHpPct),
  'Avg seals   : ' + r.avgSeals.toFixed(2),
  'Avg kills   : ' + r.avgKills.toFixed(2),
  'Cards added : ' + r.avgCardsAdded.toFixed(2),
  'Reached boss: ' + r.boss.reached + ' / wins ' + r.boss.winsAtBoss,
].join('\\n'));
`,
);

try {
  await build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node18',
    outfile: outFile,
    logLevel: 'error',
  });
  const { spawn } = await import('node:child_process');
  const [, , ...rest] = process.argv;
  const child = spawn(process.execPath, [outFile, ...rest], { stdio: 'inherit' });
  child.on('exit', (code) => {
    try {
      rmSync(entry);
      rmSync(outFile);
    } catch {
      /* ignore */
    }
    process.exit(code ?? 0);
  });
} catch (err) {
  console.error(err);
  process.exit(1);
}
