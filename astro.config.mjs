import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/astro';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/lib/constants';

export default defineConfig({
  site: SITE_URL,
  integrations: [
    react(),
    tailwindcss(),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
    remotePatterns: [
      { protocol: 'https' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
