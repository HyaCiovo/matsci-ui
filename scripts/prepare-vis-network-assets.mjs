import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const cssPath = resolve(distDir, 'index.css');

const srcNetworkAssetsDir = resolve(process.cwd(), 'src/assets/img/network');
const distNetworkAssetsDir = resolve(distDir, 'assets/img/network');

await mkdir(distNetworkAssetsDir, { recursive: true });
await cp(srcNetworkAssetsDir, distNetworkAssetsDir, { recursive: true });

const css = await readFile(cssPath, 'utf8');
const updatedCss = css.replaceAll('../../assets/img/network/', './assets/img/network/');

await mkdir(dirname(cssPath), { recursive: true });
await writeFile(cssPath, updatedCss, 'utf8');
