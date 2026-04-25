import { createRequire } from 'node:module';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import swc from '@rollup/plugin-swc';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

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
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: '[name].js',
      chunkFileNames: 'chunks/[name]-[hash].js',
      preserveModules: true,
      preserveModulesRoot: 'src',
      sourcemap: true,
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
  {
    input: 'src/index.ts',
    output: [{ file: pkg.types, format: 'es' }],
    external: [/\.css$/, /\.less$/],
    plugins: [dts()],
  },
];

function buildThemeConfig(input, outputFile, extractedCssFile) {
  return {
    input,
    output: {
      file: outputFile,
      format: 'esm',
      sourcemap: true,
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
