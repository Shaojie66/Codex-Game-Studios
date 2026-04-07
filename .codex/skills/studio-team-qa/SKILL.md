---
name: studio-team-qa
description: Codex-native team QA cycle for sprint or feature validation
---

# Studio Team QA

Use this to run a structured QA cycle across a sprint or feature scope and produce a sign-off verdict.

## Read First

1. `AGENTS.md`
2. `docs/codex-port.md`
3. `.claude/skills/team-qa/SKILL.md`
4. In-scope stories under `production/sprints/` or feature scope files
5. Current QA plans and smoke reports under `production/qa/`
6. `production/stage.txt` and session-state files if present

## Goal

Produce a concrete QA package for the selected scope: strategy, test-plan expectations, manual QA coverage, bug records when needed, and a final sign-off verdict.

## Workflow

1. Resolve scope from:
   - `sprint`
   - `feature:<name>`
   - active sprint or feature context from repo state
2. Read all in-scope stories and classify them by test type:
   - `Logic`
   - `Integration`
   - `Visual/Feel`
   - `UI`
   - `Config/Data`
3. Check smoke status first using existing smoke artifacts or by routing to `$studio-smoke-check` when the scope has no trustworthy smoke evidence.
4. Build or refresh a QA plan under `production/qa/` covering:
   - automated evidence required
   - manual QA scope
   - blockers and out-of-scope items
   - entry and exit criteria
5. Generate manual QA test cases for the stories that need them, batching parallel work when the scope is large.
6. Record QA outcomes with explicit statuses:
   - `PASS`
   - `PASS WITH NOTES`
   - `FAIL`
   - `BLOCKED`
7. Write bugs under `production/qa/bugs/` for failed results and produce a sign-off report with an approval verdict.

## Codex Adaptation Rules

- Replace Claude approval-heavy choreography with evidence-backed checkpoints at phase boundaries.
- Do not proceed into broader QA when smoke status is failed or unknown for a critical path.
- Prefer writing QA artifacts into `production/qa/` over summarizing them only in chat.
- Surface missing acceptance criteria, missing test evidence, and ADR blockers instead of guessing.
- Use Codex-native subagents only for bounded parallel test-case or report-writing work.

## Handoff

Recommend the next step, usually `$studio-story-done`, `$studio-release-checklist`, or a fix pass followed by another `$studio-team-qa`.

## Completion

Complete when the QA artifacts exist for the selected scope and the user has an explicit `APPROVED`, `APPROVED WITH CONDITIONS`, or `NOT APPROVED` verdict.
