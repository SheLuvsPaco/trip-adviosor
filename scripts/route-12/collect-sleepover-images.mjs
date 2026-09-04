#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = process.cwd();
const enrichmentPath = path.join(root, 'scripts/route-12/sleepover-enrichment.json');
const enrichment = JSON.parse(await readFile(enrichmentPath, 'utf8'));
const images = [...new Map(
  Object.values(enrichment.entries)
    .map((entry) => entry.image)
    .filter(Boolean)
    .map((image) => [image.local_path, image]),
).values()];

async function collect(image, index) {
  const response = await fetch(image.source_file_url, {
    headers: {
      'User-Agent': 'DetourAtlas/1.0 private-planning-image-collector',
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${image.source_file_url}`);
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) throw new Error(`Expected image but received ${contentType || 'unknown content type'} from ${image.source_file_url}`);

  const temporaryDirectory = path.join(root, 'tmp', 'route-12-sleepover-images');
  await mkdir(temporaryDirectory, { recursive: true });
  const temporaryPath = path.join(temporaryDirectory, `${String(index + 1).padStart(2, '0')}.source`);
  const outputPath = path.join(root, image.local_path);
  const thumbnailPath = outputPath.replace(/\.webp$/, '-thumb.webp');
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(temporaryPath, Buffer.from(await response.arrayBuffer()));

  await run('magick', [
    temporaryPath,
    '-auto-orient',
    '-strip',
    '-resize', '1600x1100>',
    '-quality', '82',
    outputPath,
  ]);
  await run('magick', [
    outputPath,
    '-strip',
    '-resize', '720x520^',
    '-gravity', 'center',
    '-extent', '720x520',
    '-quality', '78',
    thumbnailPath,
  ]);

  const [display, thumb] = await Promise.all([stat(outputPath), stat(thumbnailPath)]);
  if (display.size < 512 || thumb.size < 512) throw new Error(`Generated image is unexpectedly small: ${image.local_path}`);
  console.log(`${path.basename(outputPath)} (${Math.round(display.size / 1024)} KB, thumb ${Math.round(thumb.size / 1024)} KB)`);
}

for (let index = 0; index < images.length; index += 1) {
  await collect(images[index], index);
}

console.log(`Collected ${images.length} unique lodging reference images.`);
