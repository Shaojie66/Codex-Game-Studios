---
name: studio-map-systems
description: Codex-native workflow for decomposing a concept into systems, dependencies, and design order
---

# Studio Map Systems

Use this after concept definition to turn the game idea into a systems index with dependencies, priorities, and design order.

## Read First

1. `AGENTS.md`
2. `docs/codex-port.md`
3. `.claude/skills/map-systems/SKILL.md`
4. `design/gdd/game-concept.md`
5. `design/gdd/game-pillars.md` if present
6. Existing `design/gdd/systems-index.md` if present
7. Existing GDDs under `design/gdd/`

## Goal

Write or refresh `design/gdd/systems-index.md` so the project has an explicit map of required systems, dependency layers, milestone priorities, and recommended GDD authoring order.

## Workflow

1. Resolve mode:
   - full systems decomposition
   - `next` for the next undesigned system handoff
2. Read the concept and extract both explicit and implied systems.
3. Group systems by category and note whether each is explicit or inferred.
4. Build a dependency map and layer ordering:
   - `Foundation`
   - `Core`
   - `Feature`
   - `Presentation`
   - `Polish`
5. Assign priority tiers based on concept scope and MVP needs.
6. Write or update `design/gdd/systems-index.md` with:
   - systems table
   - dependency ordering
   - milestone tiers
   - recommended design order
   - progress state
7. In `next` mode, recommend the next system for `$studio-design-system`.

## Codex Adaptation Rules

- Prefer direct repo-backed decomposition over long approval trees.
- Reuse and update an existing systems index instead of recreating it when possible.
- Surface circular dependencies and bottleneck systems explicitly rather than hand-waving them away.
- Keep player-experience reasoning in priority choices, not just technical ordering.
- Treat missing `game-concept.md` as a real blocker and route to `$studio-brainstorm`.

## Handoff

Recommend the next step, usually `$studio-design-system`, `$studio-review-all-gdds`, or `$studio-map-systems next`.

## Completion

Complete when `design/gdd/systems-index.md` exists or is refreshed and gives the team a concrete design-order map.
