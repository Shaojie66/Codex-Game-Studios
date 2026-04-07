---
name: studio-project-stage-detect
description: Codex-native project audit for the game studio workflow
---

# Studio Project Stage Detect

Use this for a fuller audit than `$studio-help`.

## Read First

1. `AGENTS.md`
2. `docs/codex-port.md`
3. `.claude/skills/project-stage-detect/SKILL.md`
4. `.claude/docs/templates/project-stage-report.md` if present

## Audit Scope

Inspect these areas:

- `design/`
- `src/`
- `production/`
- `prototypes/`
- `docs/architecture/`
- `tests/`

Prefer direct evidence over heuristic claims. If `production/stage.txt` exists, treat it as authoritative.

## Deliverable

Write `production/project-stage-report.md` with:

- detected stage
- confidence level
- completeness snapshot across design, code, architecture, production, and tests
- top gaps
- priority-ordered next steps

Also summarize the result to the user in 5-8 bullets.

## Codex Adaptation Rules

- Do not stop to ask for permission before writing the stage report; writing the report is the point of this workflow.
- Replace upstream “clarifying question” behavior with concise evidence-backed caveats.
- If the user supplied a role focus such as programmer or designer, bias the recommendations accordingly.

## Completion

Complete when `production/project-stage-report.md` exists and the user has a concise summary of what to do next.
