---
name: studio-create-architecture
description: Codex-native workflow for producing the game's master architecture blueprint before sprint planning
---

# Studio Create Architecture

Use this to turn approved GDD material into `docs/architecture/architecture.md`, the system blueprint that sits between design and implementation.

## Read First

1. `AGENTS.md`
2. `docs/codex-port.md`
3. `.claude/skills/create-architecture/SKILL.md`
4. `.claude/docs/technical-preferences.md`
5. `design/gdd/systems-index.md`
6. In-scope GDDs under `design/gdd/`
7. Existing files under `docs/architecture/`
8. Engine reference docs under `docs/engine-reference/<engine>/`

## Goal

Produce or refresh `docs/architecture/architecture.md` so epic, story, and sprint planning have an explicit technical blueprint with layer boundaries, ownership, data flow, API contracts, and ADR follow-up gaps.

## Workflow

1. Resolve scope from the requested focus:
   - `full`
   - `layers`
   - `data-flow`
   - `api-boundaries`
   - `adr-audit`
2. Detect the configured engine from project docs. If no engine is configured, stop and direct the user to `$studio-setup-engine`.
3. Build a technical requirements baseline from the in-scope GDDs:
   - game pillars and core loop
   - system dependencies and priority tiers
   - implied data structures
   - persistence, timing, and cross-system communication needs
4. Read engine reference material for the configured engine and surface high-risk or post-cutoff domains before making architectural claims.
5. Author the in-scope sections of `docs/architecture/architecture.md`:
   - system layers
   - module ownership and boundaries
   - data flow and initialization order
   - public interfaces and invariants
   - ADR audit and traceability gaps
6. List architecture gaps that require new ADRs, prioritizing foundation-layer decisions first.

## Codex Adaptation Rules

- Replace long Claude approval choreography with concise checkpoints only when a missing choice materially changes the architecture.
- Prefer writing the architecture file directly over narrating the plan in chat.
- Treat engine-reference documents as the authority for post-cutoff API behavior.
- Do not invent traceability coverage; flag missing GDD links or ADR gaps explicitly.
- Keep architecture scope distinct from epic or story creation.

## Handoff

Recommend the next step, usually `$studio-architecture-decision` for uncovered decisions or `$studio-create-epics` once the blueprint is stable.

## Completion

Complete when `docs/architecture/architecture.md` exists or is updated for the selected scope, includes concrete architectural decisions, and names any required follow-up ADRs.
