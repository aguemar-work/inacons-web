// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://inacons.com.pe',
  integrations: [
    sitemap({
      // /recursos es un brand hub interno (noindex) — no debe aparecer en el sitemap público.
      filter: (page) => !/\/recursos\/?$/i.test(page),
    }),
  ],
});
