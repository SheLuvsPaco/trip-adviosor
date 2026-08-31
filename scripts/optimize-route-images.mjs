#!/usr/bin/env node

import { access, mkdir, readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = process.cwd();
const routeSlug = process.argv[2];
const maxWidth = Number(process.argv[3] || 1280);
const concurrency = Math.max(1, Math.min(Number(process.env.IMAGE_CONCURRENCY || 4), 8));

if (!routeSlug) {
  console.error('Usage: node scripts/optimize-route-images.mjs <route-slug> [max-width]');
  process.exit(1);
}

const routeDirectory = path.join(ROOT, 'dataset', 'routes', routeSlug);
const imagesPath = path.join(routeDirectory, 'images.json');
const outputDirectory = path.join(ROOT, 'assets', 'optimized', 'routes', routeSlug);

function runMagick(source, destination, width, quality) {
  return new Promise((resolve, reject) => {
    const child = spawn('magick', [
      source,
      '-auto-orient',
      '-resize', `${width}x${width}>`,
      '-strip',
      '-define', 'webp:method=6',
      '-quality', String(quality),
      destination,
    ], { stdio: ['ignore', 'ignore', 'pipe'] });
    let errorOutput = '';
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, 90000);
    child.stderr.on('data', (chunk) => { errorOutput += chunk; });
    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else if (timedOut) reject(new Error('ImageMagick timed out while waiting for the source file'));
      else reject(new Error(errorOutput.trim() || `ImageMagick exited with ${code}`));
    });
  });
}

function materializeFile(filePath) {
  return new Promise((resolve, reject) => {
    const stream = createReadStream(filePath, { highWaterMark: 1024 * 1024 });
    const timer = setTimeout(() => stream.destroy(new Error('file materialization timed out')), 90000);
    stream.on('data', () => {});
    stream.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });
    stream.on('end', () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

async function materializeFiles(filePaths) {
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < filePaths.length) {
      const filePath = filePaths[nextIndex];
      nextIndex += 1;
      await materializeFile(filePath);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
}

async function outputIsCurrent(source, destination) {
  try {
    const [sourceStat, destinationStat] = await Promise.all([stat(source), stat(destination)]);
    return destinationStat.size > 512 && destinationStat.mtimeMs >= sourceStat.mtimeMs;
  } catch {
    return false;
  }
}

async function main() {
  await access(imagesPath);
  await mkdir(outputDirectory, { recursive: true });
  const imageData = JSON.parse(await readFile(imagesPath, 'utf8'));
  const localPaths = [...new Set(imageData.images.map((image) => image.local_path).filter(Boolean))];
  console.log(`Preparing ${localPaths.length} source images…`);
  await materializeFiles(localPaths.map((localPath) => path.join(ROOT, localPath)));
  let cursor = 0;
  let generated = 0;
  let skipped = 0;
  const failures = [];

  async function worker() {
    while (cursor < localPaths.length) {
      const localPath = localPaths[cursor];
      cursor += 1;
      const source = path.join(ROOT, localPath);
      const stem = path.basename(localPath, path.extname(localPath));
      const variants = [
        { destination: path.join(outputDirectory, `${stem}.webp`), width: maxWidth, quality: 80 },
        { destination: path.join(outputDirectory, `${stem}-thumb.webp`), width: 480, quality: 72 },
      ];
      try {
        for (const variant of variants) {
          if (await outputIsCurrent(source, variant.destination)) skipped += 1;
          else {
            await runMagick(source, variant.destination, variant.width, variant.quality);
            generated += 1;
          }
        }
      } catch (error) {
        failures.push(`${localPath}: ${error.message}`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  const optimizedPaths = localPaths.flatMap((localPath) => {
    const stem = path.basename(localPath, path.extname(localPath));
    return [path.join(outputDirectory, `${stem}.webp`), path.join(outputDirectory, `${stem}-thumb.webp`)];
  });
  const existingOptimizedPaths = [];
  for (const optimizedPath of optimizedPaths) {
    try {
      await access(optimizedPath);
      existingOptimizedPaths.push(optimizedPath);
    } catch {
      // The failed rendition is already reported below.
    }
  }
  await materializeFiles(existingOptimizedPaths);
  let sourceBytes = 0;
  for (const localPath of localPaths) sourceBytes += (await stat(path.join(ROOT, localPath))).size;
  let outputBytes = 0;
  for (const optimizedPath of existingOptimizedPaths) outputBytes += (await stat(optimizedPath)).size;
  console.log(`Route: ${routeSlug}`);
  console.log(`Images: ${localPaths.length} (${generated} renditions generated, ${skipped} current)`);
  console.log(`Source: ${(sourceBytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Optimized: ${(outputBytes / 1024 / 1024).toFixed(1)} MB`);
  if (failures.length) {
    console.error(`Failures: ${failures.length}`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
