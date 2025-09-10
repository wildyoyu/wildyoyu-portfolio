import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wildyoyu.net', // o tu URL de Netlify si aún no tienes dominio
  scopedStyleStrategy: 'where',
  integrations: [sitemap()],
});
