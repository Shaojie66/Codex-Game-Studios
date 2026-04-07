---
name: studio-help
description: Codex-native next-step helper for the game studio workflow
---

# Studio Help

Use this when the user asks what to do next, says they are stuck, or needs quick orientation.

## Read First

1. `AGENTS.md`
2. `docs/codex-port.md`
3. `.claude/skills/help/SKILL.md`
4. `.claude/docs/workflow-catalog.yaml`

## Lightweight Checks

Read, if present:

- `production/stage.txt`
- `production/session-state/active.md`
- `production/sprint-status.yaml`

Inspect these areas to infer progress:

- `design/gdd/`
- `docs/architecture/`
- `production/`
- `src/`
- `tests/`

## Output Contract

Keep the response short and action-oriented with:

- current phase
- one primary next step
- up to two optional side steps
- one gate warning only if relevant

Use `$studio-*` names when a matching bridge exists; otherwise mention the upstream `.claude/skills/<name>/SKILL.md` playbook.

## Codex Adaptation Rules

- Do not auto-run the next workflow.
- If completion is ambiguous, say what you observed and what assumption you made.
- Prefer one recommendation, not a long menu.

## Completion

Complete when the user can leave with one unambiguous next action.
