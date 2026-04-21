import { cp, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const srcDir = resolve(process.cwd(), 'src/theme/themes');
const outDir = resolve(process.cwd(), 'dist/themes');

await mkdir(outDir, { recursive: true });
await cp(srcDir, outDir, { recursive: true });

