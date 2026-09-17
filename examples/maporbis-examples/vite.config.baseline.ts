import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, existsSync } from 'fs';

function scanExamples(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

const coreExamples = scanExamples(resolve(__dirname, 'core/src'));
const proExamples = scanExamples(resolve(__dirname, 'pro/src'));

const input: Record<string, string> = {
  main: resolve(__dirname, 'index.html'),
  ...Object.fromEntries(
    coreExamples.map(name => [`core/${name}`, resolve(__dirname, `core/src/${name}/index.html`)])
  ),
  ...Object.fromEntries(
    proExamples.map(name => [`pro/${name}`, resolve(__dirname, `pro/src/${name}/index.html`)])
  )
};

// A/B baseline: MapOrbis at 052fc76 (feel + flat transform, pre responsibility split)
export default defineConfig({
  root: __dirname,
  base: './',
  publicDir: resolve(__dirname, 'shared'),
  resolve: {
    alias: {
      '@shared': resolve(__dirname, 'shared'),
      'maporbis': resolve(__dirname, '../../packages/maporbis/dist-052fc76/index.js')
    }
  },
  optimizeDeps: {
    include: ['three', 'three-stdlib', '@pmndrs/vanilla', 'uuid', 'lodash', 'd3-quadtree', 'earcut', 'fflate', 'potpack']
  },
  server: {
    port: 5174,
    host: '127.0.0.1',
    strictPort: true,
    fs: {
      allow: ['..']
    }
  },
  build: {
    outDir: 'dist-baseline',
    rollupOptions: {
      input
    }
  }
});
