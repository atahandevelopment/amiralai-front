import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

function loadDistDir(nodeEnv: 'development' | 'production') {
  return execFileSync(
    process.execPath,
    ['--input-type=module', '--eval', "import config from './next.config.mjs'; console.log(config.distDir)"],
    { cwd: process.cwd(), encoding: 'utf8', env: { ...process.env, NODE_ENV: nodeEnv } },
  ).trim();
}

describe('Next.js build output', () => {
  it('isolates development artifacts from production artifacts', () => {
    expect(loadDistDir('development')).toBe('.next-dev');
    expect(loadDistDir('production')).toBe('.next');
  });
});
