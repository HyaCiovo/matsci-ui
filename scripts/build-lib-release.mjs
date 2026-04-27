import { spawnSync } from 'node:child_process';

const result = spawnSync('rollup', ['-c'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: {
    ...process.env,
    MATSCI_UI_RELEASE: '1',
  },
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
