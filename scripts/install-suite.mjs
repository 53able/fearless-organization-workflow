import { existsSync, lstatSync, readlinkSync, readdirSync, mkdirSync, symlinkSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve, join } from 'node:path';

const source = resolve(import.meta.dirname, '..', 'skills');
const target = resolve(process.argv[2] || join(process.env.CODEX_HOME || join(homedir(), '.codex'), 'skills'));
const plans = readdirSync(source).map(name => ({ from: join(source, name), to: join(target, name) }));
if (plans.length !== 15) throw new Error(`Incomplete suite: expected 15 skills, found ${plans.length}`);
// Check every destination before changing any of them. Preserve existing skills.
for (const { from, to } of plans) {
  let stat;
  try { stat = lstatSync(to); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (stat && !(stat.isSymbolicLink() && resolve(target, readlinkSync(to)) === from)) {
    throw new Error(`Existing skill preserved; choose another installation directory: ${to}`);
  }
  if (!existsSync(join(from, 'SKILL.md'))) throw new Error(`Missing SKILL.md: ${from}`);
}
mkdirSync(target, { recursive: true });
for (const { from, to } of plans) {
  if (!existsSync(to)) symlinkSync(from, to, 'dir');
}
console.log(`Installed ${plans.length} skills in ${target}`);
