// Writes the picture of Tuesday 24 November 2026 to <output>/entry.png.
// day.png is drawn by tools/render.mjs from page/; this program proves the file is whole and within the rules, then copies it.
import { readFileSync, writeFileSync, mkdirSync, chmodSync } from 'node:fs';
import { crc32 } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_BYTES = 1_048_576;
const MAX_SIDE = 1024;
const SIGNATURE = '89504e470d0a1a0a';

function verify(png: Buffer): { width: number; height: number } {
  if (png.length > MAX_BYTES) throw new Error(`picture is ${png.length} bytes, over ${MAX_BYTES}`);
  if (png.subarray(0, 8).toString('hex') !== SIGNATURE) throw new Error('not a PNG');
  let width = 0;
  let height = 0;
  let last = '';
  for (let at = 8; at < png.length;) {
    const size = png.readUInt32BE(at);
    const kind = png.toString('latin1', at + 4, at + 8);
    const body = png.subarray(at + 4, at + 8 + size);
    if (crc32(body) !== png.readUInt32BE(at + 8 + size)) throw new Error(`chunk ${kind} at ${at} fails its checksum`);
    if (kind === 'IHDR') {
      width = png.readUInt32BE(at + 8);
      height = png.readUInt32BE(at + 12);
    }
    last = kind;
    at += 12 + size;
  }
  if (last !== 'IEND') throw new Error('the PNG has no end marker');
  if (!width || !height || width > MAX_SIDE || height > MAX_SIDE) throw new Error(`bad size ${width} x ${height}`);
  return { width, height };
}

const here = dirname(fileURLToPath(import.meta.url));
const picture = readFileSync(join(here, 'day.png'));
const { width, height } = verify(picture);

const folder = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(folder, { recursive: true });
const target = join(folder, 'entry.png');
writeFileSync(target, picture);
chmodSync(target, 0o644);
console.log(`${target}: ${width} x ${height}, ${picture.length} bytes`);
