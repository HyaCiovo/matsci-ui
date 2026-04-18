import { createRequire } from 'node:module';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import swc from '@rollup/plugin-swc';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const external = [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {}),
];

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    external,
    plugins: [
      resolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
      commonjs(),
      swc({
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
