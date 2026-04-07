---
name: studio-gate-check
description: Codex-native phase-gate validation for advancing between studio workflow stages
---

# Studio Gate Check

Use this to decide whether the project is actually ready to move into the next development phase.

## Read First

1. `AGENTS.md`
2. `docs/codex-port.md`
3. `.claude/skills/gate-check/SKILL.md`
4. `production/stage.txt` if present
5. In-scope design, architecture, production, QA, and release artifacts for the target gate

## Goal

Produce a clear `PASS`, `CONCERNS`, or `FAIL` gate verdict backed by required artifacts, quality checks, and explicit blockers for the target phase transition.

## Workflow

1. Resolve the target gate:
   - `systems-design`
   - `technical-setup`
   - `pre-production`
   - `production`
   - `polish`
   - `release`
   - or infer the next gate from current project state
2. Load the artifact checklist and quality criteria relevant to that transition.
3. Verify required artifacts directly:
   - file existence
   - meaningful content
   - linked evidence consistency
4. Run or inspect supporting validation where possible:
   - tests
   - smoke/QA evidence
   - review artifacts
   - build or release-readiness outputs
5. Mark items that cannot be verified automatically as manual checks instead of assuming success.
6. Write a gate report with:
   - passing items
   - concerns
   - blockers
   - final verdict
   - next required actions
7. When the gate truly passes, update the phase-tracking artifact used by the project.

## Codex Adaptation Rules

- Prefer direct evidence over ceremony; the verdict must be grounded in repo artifacts and runnable checks.
- Distinguish stage detection from gate approval: this workflow decides readiness, not just current status.
- Never treat unverifiable items as passed.
- Keep manual-check questions narrow and only for facts the repo cannot reveal safely.
- Recommend the exact next skill needed to clear blockers.

## Handoff

Recommend the next step, usually a blocker-fixing workflow, `$studio-team-qa`, `$studio-release-checklist`, or the next phase’s setup workflow after a pass.

## Completion

Complete when the gate report exists or is clearly reported and the user has an explicit pass/fail-style readiness verdict.
