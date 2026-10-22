import { spawnSync } from 'node:child_process';

const dockerInfo = spawnSync('docker', ['info'], { stdio: 'ignore' });

if (dockerInfo.error !== undefined || dockerInfo.status !== 0) {
  throw new Error('Docker is not running. Start Docker Desktop and run the command again.');
}
