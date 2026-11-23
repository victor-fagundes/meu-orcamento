import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const raizPacote = path.dirname(fileURLToPath(import.meta.url));
const raizApp = path.resolve(raizPacote, '../..');
const react = path.join(raizApp, 'node_modules/react');
const reactDom = path.join(raizApp, 'node_modules/react-dom');

export default defineConfig({
  test: {
    setupFiles: ['tests/setup.ts'],
  },
  resolve: {
    alias: [
      { find: /^react$/, replacement: react },
      { find: /^react\/jsx-runtime$/, replacement: path.join(react, 'jsx-runtime.js') },
      { find: /^react\/jsx-dev-runtime$/, replacement: path.join(react, 'jsx-dev-runtime.js') },
      { find: /^react-dom$/, replacement: reactDom },
      { find: /^react-dom\/client$/, replacement: path.join(reactDom, 'client.js') },
    ],
  },
});
