import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 3000,
  },
  plugins: [
    react(),
    svgr(),
    tsconfigPaths(),
    nodePolyfills(),
    VitePWA({
      manifest: {
        name: 'Voice To Pay',
        short_name: 'Voice To Pay',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
          {
            src: './logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
});
