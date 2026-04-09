#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";

const execFileAsync = promisify(execFile);

const DEFAULT_ACTIVE_SCOPE = [
  ".codex",
  "scripts",
  "tools",
  "docs",
  "templates",
  "README.md",
  "AGENTS.md",
];

const DEFAULT_ARCHIVE_SCOPE = "archive/claude";

const DEFAULTS = {
  root: process.cwd(),
  activeScope: DEFAULT_ACTIVE_SCOPE,
  archiveScope: DEFAULT_ARCHIVE_SCOPE,
  expectedPromptSources: 49,
  expectedPrompts: 49,
  expectedSkills: 72,
  format: "summary",
  includeMatches: true,
  generatorCommand: null,
  generatorCandidates: null,
};

const TEXT_GLOBS_TO_SKIP = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".pdf",
  ".zip",
  ".gz",
  ".tgz",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
]);

const ACTIVE_REFERENCE_PATTERNS = [
  { id: "legacy-dot-claude", pattern: /\.claude\b/g, message: "references `.claude`" },
  {
    id: "legacy-read-instruction",
    pattern: /\bread\s+[`'"]?\.claude\b/gi,
    message: "instructs readers to use `.claude`",
  },
  {
    id: "legacy-archive-instruction",
    pattern: /\barchive\/claude\b/g,
    message: "references the archive path from active scope",
  },
];

const PROMPT_SEMANTIC_PATTERNS = [
  { id: "legacy-dot-claude", pattern: /\.claude\b/g, message: "contains `.claude`" },
  {
    id: "ask-user-question",
    pattern: /\bAskUserQuestion\b/g,
    message: "still references the Claude-specific `AskUserQuestion` tool",
  },
  {
    id: "claude-branding",
    pattern: /\bClaude Code Game Studios\b/g,
    message: "still brands the prompt as Claude-specific",
  },
  {
    id: "claude-runtime",
    pattern: /\bClaude(?:-only|\s+runtime|\s+Task|\s+specific)\b/gi,
    message: "still contains Claude-specific runtime wording",
  },
];

const SKILL_SEMANTIC_PATTERNS = [
  { id: "legacy-dot-claude", pattern: /\.claude\b/g, message: "contains `.claude`" },
  {
    id: "legacy-read-instruction",
    pattern: /\bread\s+[`'"]?\.claude\b/gi,
    message: "still instructs the workflow to read `.claude` files",
  },
  {
    id: "claude-runtime",
    pattern: /\bClaude(?:\s+runtime|\s+specific|\s+approval|\s+Task)\b/gi,
    message: "still contains Claude-specific workflow wording",
  },
];

const DOC_SEMANTIC_PATTERNS = [
  { id: "legacy-dot-claude", pattern: /\.claude\b/g, message: "contains `.claude`" },
  {
    id: "claude-runtime",
    pattern: /\b(?:Ask Claude|Claude Code session|Claude runtime|Claude hook|Claude compatibility layer)\b/gi,
    message: "still presents active workflow as Claude-driven",
  },
];

function parseArgs(argv) {
  const options = { ...DEFAULTS };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    switch (arg) {
      case "--root":
        options.root = next;
        index += 1;
        break;
      case "--format":
        options.format = next;
        index += 1;
        break;
      case "--artifact":
        options.artifact = next;
        index += 1;
        break;
      case "--expected-prompt-sources":
        options.expectedPromptSources = Number(next);
        index += 1;
        break;
      case "--expected-prompts":
        options.expectedPrompts = Number(next);
        index += 1;
        break;
      case "--expected-skills":
        options.expectedSkills = Number(next);
        index += 1;
        break;
      case "--generator-command":
        options.generatorCommand = next;
        index += 1;
        break;
      case "--generator-candidates":
        options.generatorCandidates = next.split(",").filter(Boolean);
        index += 1;
        break;
      case "--hide-matches":
        options.includeMatches = false;
        break;
      case "--help":
        printHelp();
        process.exit(0);
        break;
      default:
        if (arg.startsWith("--")) {
          throw new Error(`Unknown argument: ${arg}`);
        }
    }
  }

  return {
    ...options,
    root: path.resolve(options.root),
  };
}

function printHelp() {
  console.log(`Usage: node tools/verify-pure-codex-detach.mjs [options]

Options:
  --root <dir>                    Repository root to verify (default: cwd)
  --format <summary|json>         Output format (default: summary)
  --artifact <path>               Optional path to write JSON results
  --expected-prompt-sources <n>   Expected prompt source count (default: 49)
  --expected-prompts <n>          Expected generated prompt count (default: 49)
  --expected-skills <n>           Expected skill count (default: 72)
  --generator-command <command>   Optional shell command to execute for the generator gate
  --generator-candidates <csv>    Optional comma-separated generator files to inspect
  --hide-matches                  Suppress per-file match details in JSON output
  --help                          Show this help text
`);
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function ensureParentDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function collectFiles(root, scopeEntries) {
  const files = [];

  async function visit(relativePath) {
    const absolutePath = path.join(root, relativePath);
    const stat = await fs.stat(absolutePath);

    if (stat.isDirectory()) {
      const children = await fs.readdir(absolutePath);
      for (const child of children.sort()) {
        await visit(path.join(relativePath, child));
      }
      return;
    }

    const extension = path.extname(relativePath).toLowerCase();
    if (!TEXT_GLOBS_TO_SKIP.has(extension)) {
      files.push(relativePath.split(path.sep).join("/"));
    }
  }

  for (const scopeEntry of scopeEntries) {
    const relativePath = scopeEntry.replace(/\/+$/, "");
    const absolutePath = path.join(root, relativePath);
    if (!(await pathExists(absolutePath))) {
      continue;
    }
    await visit(relativePath);
  }

  return files.sort();
}

async function readText(root, relativePath) {
  return fs.readFile(path.join(root, relativePath), "utf8");
}

function gatherPatternMatches(text, patterns) {
  const matches = [];

  for (const definition of patterns) {
    const regex = new RegExp(definition.pattern.source, definition.pattern.flags);
    for (const match of text.matchAll(regex)) {
      matches.push({
        id: definition.id,
        match: match[0],
        index: match.index ?? 0,
        message: definition.message,
      });
    }
  }

  return matches;
}

async function evaluateFileSet(root, files, patterns, includeMatches) {
  const hits = [];

  for (const relativePath of files) {
    const text = await readText(root, relativePath);
    const matches = gatherPatternMatches(text, patterns);

    if (matches.length > 0) {
      hits.push({
        file: relativePath,
        count: matches.length,
        matches: includeMatches ? matches : undefined,
      });
    }
  }

  return hits;
}

async function listPromptSources(root) {
  const directory = path.join(root, ".codex", "prompt-sources", "studio");
  if (!(await pathExists(directory))) {
    return [];
  }

  return (await fs.readdir(directory))
    .filter((name) => name.endsWith(".md"))
    .sort()
    .map((name) => `.codex/prompt-sources/studio/${name}`);
}

async function listGeneratedPrompts(root) {
  const directory = path.join(root, ".codex", "prompts");
  if (!(await pathExists(directory))) {
    return [];
  }

  return (await fs.readdir(directory))
    .filter((name) => /^studio-.*\.md$/.test(name))
    .sort()
    .map((name) => `.codex/prompts/${name}`);
}

async function listSkills(root) {
  const skillsDir = path.join(root, ".codex", "skills");
  if (!(await pathExists(skillsDir))) {
    return [];
  }

  const entries = await fs.readdir(skillsDir);
  const skillFiles = [];

  for (const entry of entries.sort()) {
    if (!entry.startsWith("studio-")) {
      continue;
    }

    const relativePath = `.codex/skills/${entry}/SKILL.md`;
    if (await pathExists(path.join(root, relativePath))) {
      skillFiles.push(relativePath);
    }
  }

  return skillFiles;
}

function mapPromptPairs(promptSources, generatedPrompts) {
  const sourceNames = new Set(
    promptSources.map((file) => path.basename(file, ".md"))
  );
  const generatedNames = new Set(
    generatedPrompts.map((file) =>
      path.basename(file, ".md").replace(/^studio-/, "")
    )
  );

  const missingGenerated = [...sourceNames]
    .filter((name) => !generatedNames.has(name))
    .sort();
  const missingSources = [...generatedNames]
    .filter((name) => !sourceNames.has(name))
    .sort();

  return {
    missingGenerated,
    missingSources,
    complete: missingGenerated.length === 0 && missingSources.length === 0,
  };
}

function summarizeHits(hits) {
  return hits.map((entry) => {
    const first = entry.matches?.[0];
    return first
      ? `${entry.file} (${entry.count}): ${first.message}`
      : `${entry.file} (${entry.count})`;
  });
}

async function detectGeneratorFiles(root, explicitCandidates) {
  const selected = explicitCandidates?.map((item) => item.trim()).filter(Boolean);
  if (selected?.length) {
    return selected.filter(async (candidate) => await pathExists(path.join(root, candidate)));
  }

  const candidateFiles = await collectFiles(root, ["scripts", "tools"]);
  return candidateFiles.filter((relativePath) =>
    /(sync|generate|import|bridge)/i.test(path.basename(relativePath))
  );
}

async function runGeneratorCommand(root, generatorCommand) {
  if (!generatorCommand) {
    return null;
  }

  try {
    const { stdout, stderr } = await execFileAsync("sh", ["-lc", generatorCommand], {
      cwd: root,
      maxBuffer: 10 * 1024 * 1024,
    });

    return {
      ok: true,
      command: generatorCommand,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      exitCode: 0,
    };
  } catch (error) {
    return {
      ok: false,
      command: generatorCommand,
      stdout: error.stdout?.trim() ?? "",
      stderr: error.stderr?.trim() ?? error.message,
      exitCode: error.code ?? 1,
    };
  }
}

function buildGate(name, passed, details = {}) {
  return {
    name,
    passed,
    ...details,
  };
}

export async function runVerification(customOptions = {}) {
  const options = {
    ...DEFAULTS,
    ...customOptions,
    root: path.resolve(customOptions.root ?? DEFAULTS.root),
  };

  const activeFiles = await collectFiles(options.root, options.activeScope);
  const activeReferenceHits = await evaluateFileSet(
    options.root,
    activeFiles,
    ACTIVE_REFERENCE_PATTERNS,
    options.includeMatches
  );

  const promptSources = await listPromptSources(options.root);
  const generatedPrompts = await listGeneratedPrompts(options.root);
  const promptPairs = mapPromptPairs(promptSources, generatedPrompts);
  const promptHits = await evaluateFileSet(
    options.root,
    generatedPrompts,
    PROMPT_SEMANTIC_PATTERNS,
    options.includeMatches
  );

  const skills = await listSkills(options.root);
  const skillHits = await evaluateFileSet(
    options.root,
    skills,
    SKILL_SEMANTIC_PATTERNS,
    options.includeMatches
  );

  const docFiles = activeFiles.filter((file) => {
    const topLevel = file.split("/")[0];
    return (
      topLevel === "docs" ||
      topLevel === "templates" ||
      file === "README.md" ||
      file === "AGENTS.md"
    );
  });
  const docHits = await evaluateFileSet(
    options.root,
    docFiles,
    DOC_SEMANTIC_PATTERNS,
    options.includeMatches
  );

  const generatorFiles = await detectGeneratorFiles(
    options.root,
    options.generatorCandidates
  );
  const generatorHits = await evaluateFileSet(
    options.root,
    generatorFiles,
    ACTIVE_REFERENCE_PATTERNS,
    options.includeMatches
  );
  const generatorRun = await runGeneratorCommand(options.root, options.generatorCommand);

  const gates = [
    buildGate("active-reference-static-gate", activeReferenceHits.length === 0, {
      filesScanned: activeFiles.length,
      failures: summarizeHits(activeReferenceHits),
      hits: activeReferenceHits,
    }),
    buildGate(
      "prompt-coverage-gate",
      promptSources.length === options.expectedPromptSources &&
        generatedPrompts.length === options.expectedPrompts &&
        promptPairs.complete,
      {
        expectedPromptSources: options.expectedPromptSources,
        actualPromptSources: promptSources.length,
        expectedPrompts: options.expectedPrompts,
        actualPrompts: generatedPrompts.length,
        missingGenerated: promptPairs.missingGenerated,
        missingSources: promptPairs.missingSources,
      }
    ),
    buildGate("prompt-semantic-gate", promptHits.length === 0, {
      filesScanned: generatedPrompts.length,
      failures: summarizeHits(promptHits),
      hits: promptHits,
    }),
    buildGate("skill-coverage-gate", skills.length === options.expectedSkills, {
      expectedSkills: options.expectedSkills,
      actualSkills: skills.length,
    }),
    buildGate("skill-semantic-gate", skillHits.length === 0, {
      filesScanned: skills.length,
      failures: summarizeHits(skillHits),
      hits: skillHits,
    }),
    buildGate("doc-template-gate", docHits.length === 0, {
      filesScanned: docFiles.length,
      failures: summarizeHits(docHits),
      hits: docHits,
    }),
    buildGate(
      "generator-gate",
      generatorHits.length === 0 && (generatorRun ? generatorRun.ok : true),
      {
        filesScanned: generatorFiles.length,
        inspectedFiles: generatorFiles,
        failures: summarizeHits(generatorHits),
        hits: generatorHits,
        generatorRun,
      }
    ),
  ];

  const result = {
    ok: gates.every((gate) => gate.passed),
    root: options.root,
    activeScope: options.activeScope,
    archiveScope: options.archiveScope,
    counts: {
      promptSources: promptSources.length,
      prompts: generatedPrompts.length,
      skills: skills.length,
    },
    gates,
  };

  return result;
}

function renderSummary(result) {
  const lines = [
    `Pure Codex detach verification: ${result.ok ? "PASS" : "FAIL"}`,
    `Root: ${result.root}`,
    `Counts: prompt-sources=${result.counts.promptSources}, prompts=${result.counts.prompts}, skills=${result.counts.skills}`,
    "",
  ];

  for (const gate of result.gates) {
    lines.push(`${gate.passed ? "PASS" : "FAIL"} ${gate.name}`);
    for (const failure of gate.failures ?? []) {
      lines.push(`  - ${failure}`);
    }
    if (!gate.failures?.length) {
      if (typeof gate.filesScanned === "number") {
        lines.push(`  - files scanned: ${gate.filesScanned}`);
      } else if (typeof gate.actualSkills === "number") {
        lines.push(`  - actual skills: ${gate.actualSkills}`);
      } else if (typeof gate.actualPrompts === "number") {
        lines.push(
          `  - prompt sources/prompts: ${gate.actualPromptSources}/${gate.actualPrompts}`
        );
      }
    }
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const result = await runVerification(options);

  if (options.artifact) {
    const artifactPath = path.resolve(options.root, options.artifact);
    await ensureParentDir(artifactPath);
    await fs.writeFile(artifactPath, JSON.stringify(result, null, 2));
  }

  if (options.format === "json") {
    console.log(JSON.stringify(result, null, 2));
  } else {
    process.stdout.write(renderSummary(result));
  }

  process.exitCode = result.ok ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
