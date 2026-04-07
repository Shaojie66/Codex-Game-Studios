---
name: studio-launch-checklist
description: Codex-native launch-readiness checklist spanning code, content, operations, and go/no-go signoff
---

# Studio Launch Checklist

Use this near launch to generate the comprehensive cross-discipline readiness checklist.

## Read First

1. `AGENTS.md`
2. `docs/codex-port.md`
3. `.claude/skills/launch-checklist/SKILL.md`
4. `CLAUDE.md`
5. Current milestone and release context under `production/`
6. Existing QA, release, and launch artifacts if present

## Goal

Write a launch checklist under `production/releases/` that covers code health, content readiness, certification/store prep, operations, community, and final go/no-go status.

## Workflow

1. Resolve launch mode:
   - specific launch date
   - `dry-run`
2. Read the current project and release context:
   - target platforms
   - milestone scope
   - prior release or launch artifacts
3. Scan the repo for late-stage risks:
   - `TODO`
   - `FIXME`
   - `HACK`
   - debug output
   - placeholder assets
   - hardcoded dev/test values
4. Build the launch checklist across major domains:
   - code readiness
   - content readiness
   - quality assurance
   - store and distribution
   - infrastructure
   - community and marketing
   - operations and launch-day readiness
5. Summarize:
   - blocking items
   - conditional items
   - missing sign-offs
   - overall readiness
6. In non-dry-run mode, write the checklist artifact under `production/releases/`.

## Codex Adaptation Rules

- Keep the checklist repo-grounded; unresolved evidence stays unresolved rather than being assumed complete.
- Preserve dry-run behavior as a no-write planning mode.
- Treat launch readiness as broader than release packaging: include operations, support, and community surfaces.
- Keep the final status explicit: `READY`, `NOT READY`, or `CONDITIONAL`.
- Recommend `$studio-gate-check` or follow-up release workflows when blockers remain.

## Handoff

Recommend the next step, usually `$studio-gate-check`, `$studio-release-checklist`, or a blocker-specific fix/verification pass.

## Completion

Complete when the launch checklist exists or is clearly reported and the team has an explicit go/no-go readiness summary.
