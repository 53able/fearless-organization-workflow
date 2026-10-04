import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve(import.meta.dirname, '..');
const skills = join(root, 'skills');
const names = readdirSync(skills);
assert.equal(names.length, 15, 'Expected router and 14 specialists');
const fields = ['観測事実', '解釈・仮説', '不足情報', '必要な人の判断', '次の担当', '未解消事項', '再確認条件', '共有範囲'];
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]);
}
for (const name of names) {
  const dir = join(skills, name);
  for (const file of ['SKILL.md', 'references/principles.md', 'assets/template.md', 'agents/openai.yaml']) {
    if (name === 'fearless-organization-workflow' && file === 'references/principles.md') continue;
    assert.ok(existsSync(join(dir, file)), `${name}: missing ${file}`);
  }
  const md = readFileSync(join(dir, 'SKILL.md'), 'utf8');
  assert.match(md, new RegExp(`^---\\nname: ${name}\\n`));
  assert.ok(name.length < 64);
  const ui = readFileSync(join(dir, 'agents/openai.yaml'), 'utf8');
  assert.ok(ui.includes(`$${name}`), `${name}: prompt must invoke its skill`);
  assert.ok(!ui.includes('allow_implicit_invocation: false'));
  const template = readFileSync(join(dir, 'assets/template.md'), 'utf8');
  for (const field of fields) assert.ok(template.includes(field), `${name}: missing handoff ${field}`);
  for (const file of files(dir).filter(f => f.endsWith('.md'))) {
    const text = readFileSync(file, 'utf8');
    assert.ok(!/https?:\/\/|\[TODO|\/Users\//.test(text), `${file}: source URL, absolute dependency or scaffold`);
    for (const link of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      assert.ok(existsSync(resolve(dirname(file), link[1].split('#')[0])), `${file}: broken link ${link[1]}`);
    }
  }
}
const scenarios = JSON.parse(readFileSync(join(root, 'tests/scenarios.json'), 'utf8'));
assert.equal(scenarios.length, 14);
for (const s of scenarios) {
  assert.ok(names.includes(s.skill));
  assert.deepEqual(new Set(s.cases.map(c => c.kind)), new Set(['regression', 'normal', 'missing-information', 'outside-authority', 'sensitive']));
}
assert.equal(JSON.parse(readFileSync(join(root, 'tests/router-scenarios.json'), 'utf8')).length, 6);
console.log('PASS: 15 skills, local references, UI invocation, handoff fields, 76 scenario definitions');
