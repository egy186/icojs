import { defineConfig } from 'vite';

const config = defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/browser/index.ts',
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
