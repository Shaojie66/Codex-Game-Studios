#!/usr/bin/env node

import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

function resolvePackageRoot() {
  const candidates = [];

  if (process.env.OMX_PACKAGE_ROOT) {
    candidates.push(process.env.OMX_PACKAGE_ROOT);
  }

  candidates.push(path.resolve("node_modules", "oh-my-codex", "dist"));

  try {
    const npmGlobalRoot = execSync("npm root -g", { encoding: "utf8" }).trim();
    if (npmGlobalRoot) {
      candidates.push(path.join(npmGlobalRoot, "oh-my-codex", "dist"));
    }
  } catch {
    // Ignore global npm lookup failures and fall through to the next candidate.
  }

  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    "Unable to resolve oh-my-codex dist root. Set OMX_PACKAGE_ROOT or install oh-my-codex locally/globally."
  );
}

const [relativeEntry, ...passthroughArgs] = process.argv.slice(2);

if (!relativeEntry) {
  throw new Error("Usage: node scripts/omx-installed-entry.mjs <dist-relative-entry> [...args]");
}

const packageRoot = resolvePackageRoot();
const target = path.join(packageRoot, relativeEntry);

if (!fs.existsSync(target)) {
  throw new Error(`Resolved OMX entry does not exist: ${target}`);
}

const child = spawn(process.execPath, [target, ...passthroughArgs], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
