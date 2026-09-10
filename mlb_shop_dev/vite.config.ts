import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rolldownOptions: {
      input: { store: 'index.html', footwear: 'footwear-preview.html' },
    },
  },
});
