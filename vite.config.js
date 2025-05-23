import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: './', // point de départ
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        legal: resolve(__dirname, 'legal-informations.html'),
        profile: resolve(__dirname, 'profile.html'),
        error: resolve(__dirname, '404.html')
      }
    },
  },
  server: {
    proxy: {
      '/contact': 'http://localhost:3000'
    },
    // host: "penelopebourg.fr"
  }
});

