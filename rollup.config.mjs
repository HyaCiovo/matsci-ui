import { createRequire } from 'node:module';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import swc from '@rollup/plugin-swc';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');
const entryPoints = {
  index: 'src/index.ts',
  'crystal-toolkit': 'src/crystal-toolkit.ts',
  markdown: 'src/markdown.ts',
  'periodic-table': 'src/periodic-table.ts',
  publications: 'src/publications.ts',
  'search-ui': 'src/search-ui.ts',
};
const isReleaseBuild = process.env.MATSCI_UI_RELEASE === '1';

const externalPackages = [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {}),
];

const isStyleRequest = (id) => /\.(css|less)$/.test(id);
const isExternal = (id) =>
  !isStyleRequest(id) &&
  externalPackages.some((packageName) => id === packageName || id.startsWith(`${packageName}/`));
const extensions = ['.ts', '.tsx', '.js', '.jsx'];
const treeshake = {
  preset: 'recommended',
  moduleSideEffects: (id) => isStyleRequest(id),
};

export default [
  buildThemeConfig('src/themes/entries/bulma.ts', 'dist/themes/bulma.js', 'bulma.css'),
  buildThemeConfig('src/themes/entries/gnosys.ts', 'dist/themes/gnosys.js', 'gnosys.css'),
  buildThemeConfig('src/themes/entries/markdown.ts', 'dist/themes/markdown.js', 'markdown.css'),
  {
    input: entryPoints,
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].js',
      chunkFileNames: 'chunks/[name]-[hash].js',
      preserveModules: true,
      preserveModulesRoot: 'src',
      sourcemap: !isReleaseBuild,
    },
    external: isExternal,
    treeshake,
    plugins: [
      resolve({ extensions }),
      commonjs(),
      swc({
        exclude: /\.?(css|less)$/,
        swc: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
          },
        },
      }),
    ],
  },
  ...Object.entries(entryPoints).map(([name, input]) => buildDtsConfig(input, `dist/${name}.d.ts`)),
];

function buildThemeConfig(input, outputFile, extractedCssFile) {
  return {
    input,
    output: {
      file: outputFile,
      format: 'esm',
      sourcemap: !isReleaseBuild,
    },
    treeshake,
    onwarn(warning, warn) {
      if (warning.code === 'EMPTY_BUNDLE' || warning.message?.includes('Generated an empty chunk')) {
        return;
      }

      warn(warning);
    },
    external: isExternal,
    plugins: [
      resolve({ extensions }),
      commonjs(),
      swc({
        exclude: /\.?(css|less)$/,
        swc: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
          },
        },
      }),
      postcss({
        extract: extractedCssFile,
        minimize: {
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        },
        use: ['less'],
      }),
    ],
  };
}

function buildDtsConfig(input, outputFile) {
  return {
    input,
    output: [{ file: outputFile, format: 'es' }],
    external: [/\.css$/, /\.less$/],
    plugins: [dts()],
  };
}
