#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { runVerification } from "./verify-pure-codex-detach.mjs";

async function writeFile(root, relativePath, content) {
  const targetPath = path.join(root, relativePath);
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, content);
}

async function createFixture(root, options = {}) {
  const promptCount = options.promptCount ?? 2;
  const skillCount = options.skillCount ?? 3;

  await writeFile(root, "README.md", "# Pure Codex Fixture\n");
  await writeFile(root, "AGENTS.md", "# Fixture Instructions\n");
  await writeFile(root, "docs/guide.md", "# Guide\n");
  await writeFile(root, "tools/sync-prompts.mjs", "console.log('sync');\n");

  for (let index = 1; index <= promptCount; index += 1) {
    await writeFile(
      root,
      `.codex/prompt-sources/studio/role-${index}.md`,
      `# role-${index}\n\nCodex-native source ${index}\n`
    );
    await writeFile(
      root,
      `.codex/prompts/studio-role-${index}.md`,
      `# studio-role-${index}\n\nCodex-native prompt ${index}\n`
    );
  }

  for (let index = 1; index <= skillCount; index += 1) {
    await writeFile(
      root,
      `.codex/skills/studio-skill-${index}/SKILL.md`,
      `---\nname: studio-skill-${index}\ndescription: Codex-native test skill ${index}\n---\n\n# Skill ${index}\n`
    );
  }
}

async function withTempDir(callback) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "pure-codex-detach-"));
  try {
    await callback(directory);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
}

async function testPassingFixture() {
  await withTempDir(async (root) => {
    await createFixture(root);

    const result = await runVerification({
      root,
      expectedPromptSources: 2,
      expectedPrompts: 2,
      expectedSkills: 3,
      includeMatches: true,
    });

    assert.equal(result.ok, true, "expected the clean fixture to pass");
    assert.equal(
      result.gates.every((gate) => gate.passed),
      true,
      "expected every gate to pass for the clean fixture"
    );
  });
}

async function testLegacyReferenceFixture() {
  await withTempDir(async (root) => {
    await createFixture(root);
    await writeFile(root, "README.md", "# Broken Fixture\n\nRead `.claude/skills/foo/SKILL.md`.\n");

    const result = await runVerification({
      root,
      expectedPromptSources: 2,
      expectedPrompts: 2,
      expectedSkills: 3,
      includeMatches: true,
    });

    assert.equal(result.ok, false, "expected the legacy fixture to fail");
    const activeGate = result.gates.find(
      (gate) => gate.name === "active-reference-static-gate"
    );
    assert.equal(activeGate?.passed, false, "expected active reference gate failure");
  });
}

async function testPromptSemanticFixture() {
  await withTempDir(async (root) => {
    await createFixture(root);
    await writeFile(
      root,
      ".codex/prompts/studio-role-2.md",
      "# studio-role-2\n\nUse AskUserQuestion before every reply.\n"
    );

    const result = await runVerification({
      root,
      expectedPromptSources: 2,
      expectedPrompts: 2,
      expectedSkills: 3,
      includeMatches: true,
    });

    assert.equal(result.ok, false, "expected the semantic fixture to fail");
    const promptGate = result.gates.find(
      (gate) => gate.name === "prompt-semantic-gate"
    );
    assert.equal(promptGate?.passed, false, "expected prompt semantic gate failure");
  });
}

await testPassingFixture();
await testLegacyReferenceFixture();
await testPromptSemanticFixture();

console.log("verify-pure-codex-detach tests: PASS");
