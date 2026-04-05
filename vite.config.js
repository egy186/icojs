// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vite';

const config = defineConfig({
  build: {
    lib: {
      entry: 'src/browser/index.js',
      formats: ['umd'],
      name: 'ICO'
    },
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'ico.js',
        exports: 'named'
      }
    },
    sourcemap: true
  }
});

export default config;
