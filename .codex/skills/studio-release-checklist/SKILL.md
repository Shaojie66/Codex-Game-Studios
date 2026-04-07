---
name: studio-release-checklist
description: Codex-native pre-release checklist generation for PC, console, mobile, or all targets
---

# Studio Release Checklist

Use this to generate a release-readiness checklist before launch or submission.

## Read First

1. `AGENTS.md`
2. `docs/codex-port.md`
3. `.claude/skills/release-checklist/SKILL.md`
4. `CLAUDE.md`
5. Current milestone and release context under `production/milestones/` and `production/releases/` if present
6. QA outputs, bug lists, and test artifacts relevant to the pending release

## Goal

Write a release checklist under `production/releases/` that combines codebase health, quality gates, platform-specific requirements, store readiness, and a clear go/no-go recommendation.

## Workflow

1. Resolve target platform:
   - `pc`
   - `console`
   - `mobile`
   - `all`
2. Read project context, current milestone scope, and any release-version hints already present in the repo.
3. Scan the codebase for release blockers or warnings:
   - `TODO`
   - `FIXME`
   - `HACK`
   - known QA or bug outputs when available
4. Build a checklist covering:
   - codebase health
   - build verification
   - quality gates
   - content completeness
   - store and distribution readiness
   - launch operations readiness
5. Append platform-specific sections for the requested target platforms.
6. Produce a final `READY` or `NOT READY` recommendation with blocking items called out explicitly.

## Codex Adaptation Rules

- This workflow stays explicit-invocation friendly, but when the user directly asks for release prep, proceed without extra ceremony.
- Prefer repo-grounded blocker counts and artifact references over generic shipping advice.
- If build or certification evidence is missing, mark the checklist item unresolved rather than treating it as passed.
- Keep the output as a reusable release artifact under `production/releases/`.
- Do not invent milestone, version, or platform facts that are absent from the repo.

## Handoff

Recommend the next step, usually `$studio-team-qa`, a fix pass, or release sign-off coordination after blockers are cleared.

## Completion

Complete when the release checklist file exists, lists known blockers and unresolved evidence honestly, and gives the team a clear go/no-go status.
