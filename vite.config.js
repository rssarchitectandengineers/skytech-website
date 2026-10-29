import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    cors: true,
    allowedHosts: true,
    watch: {
      ignored: ['**/video for error/**', '**/*.mp4', '**/*.exe']
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        services: resolve(__dirname, 'services.html'),
        projects: resolve(__dirname, 'projects.html'),
        blog: resolve(__dirname, 'blog.html'),
        contact: resolve(__dirname, 'contact.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
        sitemap: resolve(__dirname, 'sitemap.html'),
        dpdp: resolve(__dirname, 'dpdp.html'),
      },
    },
  },
});
