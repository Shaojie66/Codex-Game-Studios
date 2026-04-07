---
name: studio-dev-story
description: Codex-native implementation workflow for a story file
---

# Studio Dev Story

Use this to implement a planned story with the studio workflow constraints.

## Read First

1. `AGENTS.md`
2. `docs/codex-port.md`
3. `.claude/skills/dev-story/SKILL.md`

Then load the story and its required context before editing anything.

## Required Context

Read and validate:

- target story file
- `docs/architecture/tr-registry.yaml`
- governing ADR referenced by the story
- `docs/architecture/control-manifest.md` if present
- `.claude/docs/technical-preferences.md`

If the story path is omitted, try `production/session-state/active.md` first.

## Execution Rules

- Implement directly in Codex unless a specialist subagent would materially improve quality.
- Use generated `/prompts:studio-*` roles for engine or domain specialization when helpful.
- For Logic and Integration work, add or update tests in `tests/`.
- Respect story scope. If implementation clearly spills out of scope, call that out before widening the change.
- Update `production/session-state/active.md` with a short session extract after implementation.

## Expected Output

At the end, provide:

- files changed
- acceptance criteria coverage
- test coverage or manual-evidence gap
- blockers or deviations
- explicit next command recommendation: usually `$studio-code-review` then `$studio-story-done`

## Codex Adaptation Rules

- Do not preserve the upstream “wait for write approval” rule.
- Replace Claude Task orchestration with Codex-native work and bounded subagents.
- Prefer finishing the implementation loop, including tests and session-state update, before yielding.

## Completion

Complete when code and tests are written, session state is updated, and the user has a clean handoff to review/closure.
