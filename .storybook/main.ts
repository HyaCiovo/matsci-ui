import type { StorybookConfig } from '@storybook/react-vite';
import https from 'node:https';
import { loadEnv } from 'vite';

const httpsAgent = new https.Agent({ keepAlive: true });

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.mdx', '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs', '@storybook/addon-vitest'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },

  viteFinal: async (viteConfig, options) => {
    const envDir = new URL('..', import.meta.url).pathname;
    const mode = options.configType === 'PRODUCTION' ? 'production' : 'development';
    const env = loadEnv(mode, envDir, '');

    viteConfig.envDir = envDir;
    viteConfig.define = {
      ...viteConfig.define,
      'import.meta.env.VITE_MP_API_KEY': JSON.stringify(env.VITE_MP_API_KEY ?? ''),
    };
    viteConfig.server = {
      ...viteConfig.server,
      proxy: {
        ...(viteConfig.server?.proxy ?? {}),
        '/mp-api': {
          target: 'https://api.materialsproject.org',
          changeOrigin: true,
          secure: true,
          agent: httpsAgent,
          timeout: 120_000,
          proxyTimeout: 120_000,
          rewrite: (p) => p.replace(/^\/mp-api/, ''),
        },
        '/mp-contribs-api': {
          target: 'https://contribs-api.materialsproject.org',
          changeOrigin: true,
          secure: true,
          agent: httpsAgent,
          timeout: 120_000,
          proxyTimeout: 120_000,
          rewrite: (p) => p.replace(/^\/mp-contribs-api/, ''),
        },
        '/matscholar-api': {
          target: 'https://www.matscholar.com',
          changeOrigin: true,
          secure: true,
          agent: httpsAgent,
          timeout: 120_000,
          proxyTimeout: 120_000,
          rewrite: (p) => p.replace(/^\/matscholar-api/, ''),
        },
      },
    };
    viteConfig.build = {
      ...viteConfig.build,
      chunkSizeWarningLimit: 2500,
    };

    return viteConfig;
  }
};
export default config;
