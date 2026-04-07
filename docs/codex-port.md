# Codex Port Guide

This repository started as a Claude Code template. It now includes a Codex/OMX compatibility layer so the studio roles and workflows remain usable without rewriting the original source material by hand.

## What Changed

- Project-level OMX scaffolding now lives in `.codex/`, `.omx/`, and `AGENTS.md`.
- Legacy role briefs under `.claude/agents/` are exposed to Codex as `/prompts:studio-<role>`.
- Legacy workflow skills under `.claude/skills/` are exposed to Codex as `$studio-<workflow>`.
- `docs/codex-agent-catalog.md` maps upstream role names to the generated Codex prompt names.
- The generated bridge layer is intentionally thin: it reads the legacy source file at runtime and adapts Claude-specific concepts to Codex conventions.

## Recommended Entry Points

- Run `codex` from the repository root.
- Use `$studio-start` for first-time onboarding.
- Use `/prompts:studio-creative-director` or another `studio-*` prompt when you want a specific game-studio specialist.
- Use `$studio-dev-story`, `$studio-team-ui`, `$studio-code-review`, and the other `studio-*` skills to execute the legacy workflows under Codex.

## Runtime Rules

- `AGENTS.md` is the top-level authority.
- `.codex/config.toml` and OMX control Codex runtime behavior.
- `.claude/settings.json` and `.claude/hooks/` are kept for upstream parity and documentation, but they are not the active runtime for Codex.

## Regenerating the Bridge

When you pull upstream changes from the original Claude template, regenerate the Codex wrappers:

```bash
bash scripts/sync_codex_bridge.sh
```

This script rebuilds:

- `.codex/prompts/studio-*.md`
- `.codex/skills/studio-*/SKILL.md`

The bridge is safe to rerun because the generated files are deterministic wrappers over the legacy `.claude` sources.
