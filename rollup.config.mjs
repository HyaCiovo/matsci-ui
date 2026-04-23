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

export default [
  buildThemeConfig('src/themes/default.ts', 'dist/themes/default.js', 'default.css'),
  buildThemeConfig('src/themes/alt.ts', 'dist/themes/alt.js', 'alt.css'),
  {
    input: 'src/index.ts',
    output: {
      file: pkg.main,
      format: 'esm',
      sourcemap: true,
    },
    external: isExternal,
    plugins: [
      resolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
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
        extract: 'index.css',
        minimize: true,
        use: ['less'],
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
    onwarn(warning, warn) {
      if (warning.code === 'EMPTY_BUNDLE' || warning.message?.includes('Generated an empty chunk')) {
        return;
      }

      warn(warning);
    },
    external: isExternal,
    plugins: [
      resolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
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
        minimize: true,
        use: ['less'],
      }),
    ],
  };
}
