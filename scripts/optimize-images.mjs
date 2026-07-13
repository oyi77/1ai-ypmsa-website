import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const dirs = [
  'public/images',
  'public/images/campaigns',
];

const MAX_WIDTH = 2000;
const QUALITY = 80;

async function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return null;

  const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  // Skip if already exists and newer than source
  try {
    const srcStat = fs.statSync(filePath);
    try {
      const webpStat = fs.statSync(webpPath);
      if (webpStat.mtimeMs > srcStat.mtimeMs) {
        return { file: filePath, webp: webpPath, size: (srcStat.size / 1024).toFixed(1), skipped: true };
      }
    } catch {}
  } catch {}

  let img = sharp(filePath);
  const metadata = await img.metadata();
  
  // Resize if over max width
  if (metadata.width > MAX_WIDTH) {
    img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  await img
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(webpPath);

  const origSize = fs.statSync(filePath).size;
  const newSize = fs.statSync(webpPath).size;
  
  return {
    file: filePath,
    webp: webpPath,
    origKB: (origSize / 1024).toFixed(1),
    newKB: (newSize / 1024).toFixed(1),
    savings: ((1 - newSize / origSize) * 100).toFixed(1),
  };
}

async function main() {
  const files = [];
  for (const dir of dirs) {
    const absDir = path.resolve(projectRoot, dir);
    if (!fs.existsSync(absDir)) continue;
    const entries = fs.readdirSync(absDir);
    for (const entry of entries) {
      files.push(path.join(absDir, entry));
    }
  }

  const results = [];
  for (const f of files) {
    try {
      const r = await processFile(f);
      if (r) results.push(r);
    } catch (err) {
      console.error(`FAILED: ${f}: ${err.message}`);
    }
  }

  // Summary
  const converted = results.filter(r => !r.skipped);
  const skipped = results.filter(r => r.skipped);
  console.log(`\nConverted: ${converted.length}, Skipped (up-to-date): ${skipped.length}\n`);
  
  if (converted.length > 0) {
    const totalOrig = converted.reduce((s, r) => s + parseFloat(r.origKB), 0);
    const totalNew = converted.reduce((s, r) => s + parseFloat(r.newKB), 0);
    const totalSavings = ((1 - totalNew / totalOrig) * 100).toFixed(1);
    console.log(`Total: ${totalOrig.toFixed(1)}KB → ${totalNew.toFixed(1)}KB (${totalSavings}% savings)\n`);
    
    for (const r of converted) {
      console.log(`  ${r.savings}% ${r.origKB.padStart(8)}KB → ${r.newKB.padStart(8)}KB  ${path.relative(projectRoot, r.file)}`);
    }
  }
}

main().catch(console.error);
