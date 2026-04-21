import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const vercelConfigPath = resolve(projectRoot, 'vercel.json');
const storybookOutputPath = resolve(projectRoot, 'storybook-static', 'vercel.json');

if (!existsSync(vercelConfigPath)) {
  throw new Error('Missing vercel.json in project root.');
}

cpSync(vercelConfigPath, storybookOutputPath);
