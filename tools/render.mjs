// Renders page/ to day.png with a local Chrome, plus a 300-pixel preview for the legibility check.
// Usage: node tools/render.mjs [preview-directory]
import { readFileSync, writeFileSync, mkdtempSync, existsSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sheet } from '../page/sheet.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const chrome = ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(existsSync);
if (!chrome) throw new Error('no Chrome found');

const work = mkdtempSync(join(tmpdir(), 'day-'));

function shoot(html, size, out) {
  const page = join(work, 'page.html');
  writeFileSync(page, html);
  const run = spawnSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    `--user-data-dir=${join(work, 'profile')}`, `--window-size=${size},${size}`, '--virtual-time-budget=3000',
    '--enable-logging=stderr', '--v=0', `--screenshot=${out}`, pathToFileURL(page).href], { encoding: 'utf8' });
  if (run.status !== 0) throw new Error(`Chrome exited with ${run.status}`);
  // The page reports anything that overflows its box as one LAYOUT line.
  const report = /LAYOUT (\{.*?\})(?:"|,)/.exec(run.stderr ?? '');
  if (report) console.log('layout', report[1].replaceAll('\\"', '"'));
}

// The two faces are embedded, because Chrome does not find these Windows families by name.
const FACES = { DayBold: 'FRADMCN.TTF', DayText: 'FRAMDCN.TTF' };
const faces = Object.entries(FACES).map(([name, file]) => {
  const data = readFileSync(join('C:/Windows/Fonts', file)).toString('base64');
  return `@font-face { font-family: ${name}; src: url(data:font/ttf;base64,${data}); }`;
}).join('\n');

const css = faces + readFileSync(join(root, 'page', 'sheet.css'), 'utf8');
const target = join(root, 'day.png');
shoot(sheet(css), 1024, target);

const previews = process.argv[2];
if (previews) {
  const small = `<!doctype html><body style="margin:0;background:#fff"><img src="${pathToFileURL(target).href}" width="300" height="300" style="display:block">`;
  shoot(small, 600, join(previews, 'small-raw.png'));
  const twice = `<!doctype html><body style="margin:0;background:#fff"><img src="${pathToFileURL(join(previews, 'small-raw.png')).href}" style="display:block;width:1800px;height:1800px;image-rendering:pixelated">`;
  shoot(twice, 900, join(previews, 'small-x3.png'));
}
rmSync(work, { recursive: true, force: true });
const png = readFileSync(target);
console.log('day.png', png.length, 'bytes', png.readUInt32BE(16), 'x', png.readUInt32BE(20));
