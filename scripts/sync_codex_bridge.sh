#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CLAUDE_AGENTS_DIR="$ROOT_DIR/.claude/agents"
CLAUDE_SKILLS_DIR="$ROOT_DIR/.claude/skills"
CODEX_SKILLS_DIR="$ROOT_DIR/.codex/skills"
CURATED_SKILLS=(
  "studio-dev-story"
  "studio-help"
  "studio-project-stage-detect"
  "studio-start"
)

mkdir -p "$CODEX_SKILLS_DIR"

is_curated_skill() {
  local candidate="$1"

  for curated in "${CURATED_SKILLS[@]}"; do
    if [[ "$curated" == "$candidate" ]]; then
      return 0
    fi
  done

  return 1
}

generate_skill_bridge() {
  local name="$1"
  local skill_dir="$CODEX_SKILLS_DIR/studio-${name}"
  local target="$skill_dir/SKILL.md"

  mkdir -p "$skill_dir"

  cat >"$target" <<EOF
---
name: studio-${name}
description: Codex bridge for the legacy Claude Code Game Studios workflow \`${name}\`
---

# Studio Bridge: ${name}

This wrapper ports the legacy workflow defined in \`.claude/skills/${name}/SKILL.md\` to Codex/OMX.

<Execution>
1. Read \`.claude/skills/${name}/SKILL.md\` in full before taking action.
2. Use its phases, required artifacts, dependencies, and completion criteria as the workflow contract.
3. Adapt Claude-specific constructs:
- \`AskUserQuestion\`: ask only when the needed information cannot be derived safely; otherwise inspect the repo and proceed autonomously.
- \`Task\`: use Codex native subagents or \`/prompts:studio-<role>\` wrappers for specialist delegation.
- \`Write\` and \`Edit\` approval gates: follow \`AGENTS.md\` instead of waiting for legacy approval language.
- Slash-command references like \`/foo\`: translate to \`\$studio-foo\` when the bridge exists; otherwise read the legacy skill file directly.
- References to \`.claude/settings.json\` hooks or Claude runtime behavior: treat them as historical reference only. Codex runtime behavior comes from \`.codex/config.toml\`, \`AGENTS.md\`, and OMX.
4. Keep the legacy workflow's sequencing, artifacts, and verification rigor. Do not silently skip phases that materially protect correctness.
5. If the legacy workflow mainly produces docs, reports, or plans, create or update those repo artifacts instead of only summarizing them in chat.

<Completion>
The task is complete only when the requested workflow outcome exists in the repo or has been verified under Codex/OMX conventions.
EOF
}

node "$ROOT_DIR/tools/sync-claude-agents-to-codex.mjs"

while IFS= read -r skill_dir; do
  skill_name="$(basename "$skill_dir")"
  if is_curated_skill "studio-${skill_name}"; then
    continue
  fi
  generate_skill_bridge "$skill_name"
done < <(find "$CLAUDE_SKILLS_DIR" -mindepth 1 -maxdepth 1 -type d | sort)

echo "Generated Codex bridge prompts and skills from .claude assets."
