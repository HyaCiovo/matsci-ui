import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const cssPaths = [
  resolve(distDir, 'themes/default.css'),
  resolve(distDir, 'themes/alt.css'),
  resolve(distDir, 'index.css'),
];

const srcNetworkAssetsDir = resolve(process.cwd(), 'src/assets/img/network');
const distNetworkAssetsDir = resolve(distDir, 'assets/img/network');

await mkdir(distNetworkAssetsDir, { recursive: true });
await cp(srcNetworkAssetsDir, distNetworkAssetsDir, { recursive: true });

for (const cssPath of cssPaths) {
  try {
    const css = await readFile(cssPath, 'utf8');
    const updatedCss = css.replaceAll('../../assets/img/network/', './assets/img/network/');

    await mkdir(dirname(cssPath), { recursive: true });
    await writeFile(cssPath, updatedCss, 'utf8');
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      continue;
    }

    throw error;
  }
}
