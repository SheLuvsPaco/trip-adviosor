import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { access, cp, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const builtRouteDirectories = [
  'route-01-gilded-coast-capital-loop',
  'route-02-falls-fire-clockwork-loop',
  'route-03-wild-shore-rockets-folklore-loop',
  'route-04-trolls-moon-rocks-curiosity-coast-loop',
  'route-05-coal-veins-caverns-blue-ridge-secrets-loop',
  'route-06-mothman-steel-cathedrals-cabinet-of-evidence-loop',
  'route-07-kazoos-rock-mechanical-dreams-loop',
  'route-08-lemurs-stone-bridges-mechanical-dreams-loop',
  'route-09-kaleidoscopes-scripture-stones-secret-machines-loop',
  'route-10-temples-follies-working-machines-loop',
  'route-11-hidden-halls-brass-nights-moonshot-run',
];

async function routeHeroPreloads() {
  const heroes = {};
  for (const routeDirectory of builtRouteDirectories) {
    const packageDirectory = path.join('dataset/routes', routeDirectory);
    const [route, placesData, imagesData] = await Promise.all([
      readFile(path.join(packageDirectory, 'route.json'), 'utf8').then(JSON.parse),
      readFile(path.join(packageDirectory, 'places.json'), 'utf8').then(JSON.parse),
      readFile(path.join(packageDirectory, 'images.json'), 'utf8').then(JSON.parse),
    ]);
    const firstPlaceId = route.days[0]?.schedule[0]?.place_id;
    const place = placesData.places.find((entry) => entry.id === firstPlaceId);
    const candidates = (place?.image_ids || []).map((id) => imagesData.images.find((image) => image.id === id)).filter(Boolean);
    const image = candidates.find((candidate) => candidate.production_usable) || candidates[0];
    if (!image) continue;
    const stem = path.basename(image.local_path, path.extname(image.local_path));
    const base = `/assets/optimized/routes/${routeDirectory}/${stem}`;
    heroes[routeDirectory.slice(0, 8)] = { display: `${base}.webp`, thumb: `${base}-thumb.webp` };
  }
  return heroes;
}

function copyRouteAssets() {
  return {
    name: 'copy-route-assets',
    apply: 'build',
    async buildStart() {
      const missing = [];
      for (const routeDirectory of builtRouteDirectories) {
        const images = JSON.parse(await readFile(path.join('dataset/routes', routeDirectory, 'images.json'), 'utf8')).images;
        for (const image of images) {
          const stem = path.basename(image.local_path, path.extname(image.local_path));
          for (const suffix of ['.webp', '-thumb.webp']) {
            const optimizedPath = path.join('assets/optimized/routes', routeDirectory, `${stem}${suffix}`);
            try {
              if ((await stat(optimizedPath)).size < 512) missing.push(optimizedPath);
            } catch {
              missing.push(optimizedPath);
            }
          }
        }
      }
      if (missing.length) {
        throw new Error(`Missing ${missing.length} optimized route images. Run npm run optimize:images -- <route-directory>. First missing file: ${missing[0]}`);
      }
    },
    async closeBundle() {
      const copies = [['assets/optimized', 'dist/assets/optimized']];
      for (const [source, destination] of copies) {
        try {
          await access(source);
          await cp(source, destination, { recursive: true, force: true });
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
        }
      }
    },
    async transformIndexHtml(html) {
      const heroes = await routeHeroPreloads();
      const preloadScript = `<script>(function(){var h=${JSON.stringify(heroes)};var r=new URLSearchParams(location.search).get('route')||'route-01';var i=h[r];if(!i)return;var l=document.createElement('link');l.rel='preload';l.as='image';l.fetchPriority='high';l.href=i.display;l.imageSrcset=i.thumb+' 480w, '+i.display+' 1280w';l.imageSizes='(max-width: 860px) 100vw, 50vw';document.head.appendChild(l)}())</script>`;
      return html.replace('    <title>', `    ${preloadScript}\n    <title>`);
    },
  };
}

export default defineConfig({
  plugins: [react(), copyRouteAssets()],
  server: {
    watch: {
      // Route collectors rewrite large packages and image directories in bursts.
      // They are data-build inputs, not UI source; restarting Vite after a route
      // build is cheaper and much less disruptive than remounting the map for
      // every generated file.
      ignored: [
        path.resolve('assets/routes/**'),
        path.resolve('assets/optimized/**'),
        path.resolve('dataset/routes/**'),
        path.resolve('tmp/**'),
      ],
    },
  },
});
