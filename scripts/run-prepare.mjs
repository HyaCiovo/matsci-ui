import { spawnSync } from 'node:child_process';

const npmCommand = (process.env.npm_command ?? '').trim();
const shouldSkip = npmCommand === 'pack' || npmCommand === 'publish';

if (shouldSkip) {
  process.stdout.write(`Skipping lefthook install during npm ${npmCommand}.\n`);
  process.exit(0);
}

const result = spawnSync('lefthook', ['install'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
