import { mkdtempSync, mkdirSync, readdirSync, existsSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const repo = resolve(import.meta.dirname, '..');
const temporary = mkdtempSync(join(tmpdir(), 'fearless-install-'));
const run = destination => spawnSync(process.execPath, ['scripts/install-suite.mjs', destination], { cwd: repo, encoding: 'utf8' });
try {
  const destination = join(temporary, 'success');
  for (let i = 0; i < 2; i++) {
    const result = run(destination);
    assert.equal(result.status, 0, result.stderr);
  }
  assert.equal(readdirSync(destination).length, 15);
  for (const name of readdirSync(destination)) assert.ok(existsSync(join(destination, name, 'SKILL.md')));

  const conflict = join(temporary, 'conflict');
  const existing = join(conflict, readdirSync(join(repo, 'skills'))[0]);
  mkdirSync(existing, { recursive: true });
  writeFileSync(join(existing, 'sentinel'), 'preserve');
  assert.notEqual(run(conflict).status, 0);
  assert.equal(readdirSync(conflict).length, 1, 'Conflict must not partially install the suite');
  assert.equal(readFileSync(join(existing, 'sentinel'), 'utf8'), 'preserve');
  console.log('PASS: installation, repeat installation, conflict preservation');
} finally {
  rmSync(temporary, { recursive: true });
}
