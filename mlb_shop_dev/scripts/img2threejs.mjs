import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dev = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skill = process.env.IMG2THREEJS_SKILL_ROOT || path.join(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'), 'skills/img2threejs');
const [script = 'next.py', ...args] = process.argv.slice(2);
const forge = path.join(skill, 'forge');
const target = path.resolve(forge, script);
if (!target.startsWith(forge + path.sep) || !target.endsWith('.py') || !existsSync(target)) {
  console.error(`Unknown forge script: ${script}. Install the img2threejs Codex skill first.`);
  process.exit(1);
}
const candidates = process.env.IMG2_PYTHON ? [process.env.IMG2_PYTHON] : ['python3.12', 'python3', '/opt/homebrew/bin/python3.12'];
const python = candidates.find((command) => spawnSync(command, ['-c', 'import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)']).status === 0);
if (!python) {
  console.error('Python 3.10+ required. Set IMG2_PYTHON to a compatible interpreter.');
  process.exit(1);
}
const result = spawnSync(python, [target, ...args], {
  cwd: dev,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  stdio: 'inherit',
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
