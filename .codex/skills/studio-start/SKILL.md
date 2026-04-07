---
name: studio-start
description: Codex-native onboarding for the game studio workflow
---

# Studio Start

Use this as the first workflow in a fresh or partially adopted project.

## Goal

Figure out where the project actually stands, set review mode if needed, and give the user one clear next step in Codex terms.

## Read First

1. `AGENTS.md`
2. `docs/codex-port.md`
3. `.claude/skills/start/SKILL.md`
4. `.claude/docs/technical-preferences.md`

## Detect Project State

Inspect, without writing:

- whether an engine is configured in `.claude/docs/technical-preferences.md`
- whether `design/gdd/game-concept.md` exists
- how many markdown files exist under `design/gdd/`
- whether there is code in `src/`
- whether there are prototypes in `prototypes/`
- whether there are sprint or milestone artifacts in `production/`

Summarize those findings briefly before recommending the next path.

## Review Mode

If `production/review-mode.txt` does not exist, create it with:

- `lean` by default
- `full` only if the user explicitly asks for thorough reviews at every stage
- `solo` only if the user explicitly asks for minimal review overhead

If you set it by assumption, say so in one short sentence.

## Routing Rules

Pick the closest path below and recommend exactly one next action first:

- No concept yet → recommend `$studio-brainstorm`
- Vague concept only → recommend `$studio-brainstorm`
- Clear concept but no systems decomposition → recommend `$studio-map-systems` or `$studio-setup-engine` depending on whether engine is configured
- Existing docs/code → recommend `$studio-project-stage-detect`

After the first action, list a short follow-on path of at most 5 steps using `$studio-*` names when available.

## Codex Adaptation Rules

- Do not mimic Claude `AskUserQuestion`; ask a concise plain-language question only when the answer materially changes the path and cannot be inferred.
- Do not wait for permission on low-risk repo inspection or on writing `production/review-mode.txt`.
- Prefer autonomous routing based on repo state.

## Completion

Complete when you have:

1. summarized the detected state,
2. ensured `production/review-mode.txt` exists,
3. recommended one primary next step plus a short follow-on path.
