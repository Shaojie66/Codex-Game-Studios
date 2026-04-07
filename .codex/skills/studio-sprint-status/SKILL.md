---
name: studio-sprint-status
description: Codex-native fast status check for the current or selected sprint
---

# Studio Sprint Status

Use this for a quick, read-only snapshot of sprint progress.

## Read First

1. `AGENTS.md`
2. `docs/codex-port.md`
3. `.claude/skills/sprint-status/SKILL.md`
4. Current sprint files and `production/sprint-status.yaml` when present

## Goal

Produce a short progress snapshot with one concrete recommendation at most.

## Workflow

1. Resolve the target sprint from an explicit number or the latest sprint file.
2. Prefer `production/sprint-status.yaml` as the authoritative source.
3. Fall back to sprint markdown plus story-file status scanning only when YAML is missing.
4. Compute:
   - days remaining
   - completion percentage
   - blocked or stale work
   - must-haves at risk
5. Return a concise progress report without editing files.

## Codex Adaptation Rules

- Keep this workflow read-only.
- Prefer the machine-readable sprint status file over markdown inference.
- Make at most one concrete recommendation.

## Handoff

Recommend the next step only when the sprint is at risk, usually `$studio-sprint-plan update` or `$studio-story-readiness`.

## Completion

Complete when the user has a concise, evidence-backed sprint snapshot.
