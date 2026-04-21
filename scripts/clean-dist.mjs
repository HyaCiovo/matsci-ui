import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const distPath = resolve(process.cwd(), 'dist');

await rm(distPath, { recursive: true, force: true });
