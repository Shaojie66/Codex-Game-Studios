---
name: studio-smoke-check
description: Codex-native smoke-test gate before QA handoff
---

# Studio Smoke Check

Use this after implementation and before QA handoff to decide whether the build is fit for broader testing.

## Read First

1. `AGENTS.md`
2. `docs/codex-port.md`
3. `.claude/skills/smoke-check/SKILL.md`
4. Current `tests/`, latest QA plan, and sprint context

## Goal

Produce a PASS/FAIL/WARN smoke-check report grounded in actual test execution and critical-path verification.

## Workflow

1. Detect test setup, engine, CI hints, smoke list, and latest QA plan.
2. Run the most appropriate automated tests or parse the latest local/CI artifacts when direct execution is not possible.
3. Check story/test coverage gaps for the current sprint or requested scope.
4. Record manual critical-path checks and platform-specific checks when requested.
5. Write a smoke report under `production/qa/`.

## Codex Adaptation Rules

- Prefer actual command output over narrative confidence.
- When engine tooling is unavailable, mark status as `NOT RUN` or warning instead of pretending the tests passed.
- Keep the report actionable for the next gate decision.

## Handoff

Recommend the next step, usually `$studio-qa-plan`, `$studio-team-qa`, `$studio-story-done`, or a fix pass if smoke fails.

## Completion

Complete when the smoke report exists and the user has a clear release-to-QA verdict.
