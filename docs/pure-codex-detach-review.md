# Pure Codex Detach Review

This review complements `docs/pure-codex-detach-audit.md` with a human-readable summary of the highest-risk migration gaps.

## Current Readiness Snapshot

As of the current branch state:

- The Codex prompt surface is complete in count (`49` generated `studio-*` prompts), but there is no canonical prompt-source tree under `.codex/prompt-sources/studio/`.
- The studio skill surface is complete in count (`72` `studio-*` skills), but most skills still act as bridge wrappers instead of Codex-native workflow definitions.
- The active regeneration flow still points at the legacy source tree through `scripts/sync_codex_bridge.sh` and `tools/sync-claude-agents-to-codex.mjs`.
- User-facing docs still describe the repository as a compatibility layer rather than a self-contained Codex-native workspace.

## Highest-Risk Blocker Families

### 1. Prompt authority is missing

The migration target requires a one-to-one mapping between generated prompts and canonical prompt sources. Right now the generated prompts exist, but the canonical source directory does not. That blocks the detach gate even before semantic cleanup starts.

### 2. Skill wrappers still depend on legacy runtime assumptions

The studio skill surface is mostly thin bridge content. The remaining work is not just string replacement: each workflow needs Codex-native instructions, asset references, and update paths so the skills remain executable after the legacy source tree becomes inert.

### 3. Generator ownership is still legacy-first

`scripts/sync_codex_bridge.sh` still rebuilds the active Codex surface from legacy prompts and skills. Until that flow is replaced or retired, the repository cannot claim a Codex-only maintenance model.

### 4. Active docs still teach the wrong operating model

`README.md`, `docs/codex-port.md`, `docs/codex-agent-catalog.md`, and `docs/WORKFLOW-GUIDE.md` still tell contributors to treat the repository as a bridge over an upstream runtime. Those docs need to switch from compatibility language to Codex-native maintenance guidance.

## Recommended Lane Order

1. **Inventory gate** — keep `docs/pure-codex-detach-audit.md` current so the migration can be measured instead of guessed.
2. **Prompt-source migration** — create `.codex/prompt-sources/studio/`, move the `49` role definitions there, and regenerate the `studio-*` prompt surface from those sources only.
3. **Skill/doc migration** — convert the `72` studio skills plus game-studio guidance docs from bridge wrappers to Codex-native workflow assets.
4. **Generator replacement** — retarget or retire the current bridge scripts so active generation no longer consumes legacy inputs.
5. **Detach proof** — rerun the audit, then add semantic verification for prompts, skills, and active docs in one integrated pass.

## Suggested Exit Evidence

A credible detach proof should include all of the following in the same branch state:

- `49` prompt sources under `.codex/prompt-sources/studio/`
- `49` generated `studio-*` prompts sourced only from the prompt-source tree
- `72` Codex-native studio skills (or an explicit approved consolidation record)
- Zero legacy-marker hits in active docs, prompts, skills, scripts, and tools
- A documented regeneration flow that consumes only Codex-native inputs
