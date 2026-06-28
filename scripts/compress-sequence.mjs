import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import path from 'path';

const INPUT = './public/sequence';
const OUTPUT = './public/sequence-webp';
const WIDTH = 600;
const QUALITY = 80;

async function getFileSize(filePath) {
  const s = await stat(filePath);
  return s.size;
}

const files = (await readdir(INPUT))
  .filter((f) => /\.(png|jpe?g)$/i.test(f))
  .sort();

if (files.length === 0) {
  console.error(`No PNG/JPEG files found in ${INPUT}`);
  process.exit(1);
}

await mkdir(OUTPUT, { recursive: true });

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const inPath = path.join(INPUT, file);
  const match = file.match(/frame_(\d+)/i);
  const pad = match ? match[1].padStart(3, '0') : file.replace(/\.(png|jpe?g)$/i, '');
  const outName = `frame_${pad}.webp`;
  const outPath = path.join(OUTPUT, outName);

  const before = await getFileSize(inPath);
  await sharp(inPath).resize({ width: WIDTH }).webp({ quality: QUALITY }).toFile(outPath);
  const after = await getFileSize(outPath);

  totalBefore += before;
  totalAfter += after;
  console.log(`${file} → ${outName} (${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB)`);
}

console.log(
  `\nDone: ${files.length} frames, ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB`
);
