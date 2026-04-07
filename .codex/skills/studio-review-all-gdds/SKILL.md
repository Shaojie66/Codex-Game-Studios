---
name: studio-review-all-gdds
description: Codex-native holistic review for cross-GDD consistency and design integrity
---

# Studio Review All GDDs

Use this after multiple GDDs exist to review them as a coherent game instead of as isolated documents.

## Read First

1. `AGENTS.md`
2. `docs/codex-port.md`
3. `.claude/skills/review-all-gdds/SKILL.md`
4. `design/gdd/game-concept.md`
5. `design/gdd/game-pillars.md` if present
6. `design/gdd/systems-index.md`
7. In-scope system GDDs under `design/gdd/`
8. Relevant registries under `design/registry/` if present

## Goal

Produce a holistic design review report that catches cross-GDD contradictions, stale references, ownership conflicts, formula mismatches, and game-design-level issues before architecture or production proceeds.

## Workflow

1. Resolve scope from:
   - `full`
   - `consistency`
   - `design-theory`
   - `since-last-review`
2. Load all in-scope GDDs plus concept, pillars, and systems index context.
3. Run the consistency pass across documents:
   - dependency asymmetry
   - rule contradictions
   - stale references
   - tuning or data ownership conflicts
   - formula compatibility issues
4. Run the holistic design pass across the same scope:
   - competing progression loops
   - attention-budget overload
   - pillar drift
   - economy or balance risks visible only across systems
5. Write a review report under `design/reviews/` or the nearest existing review location with findings grouped by severity.
6. End with a clear gate recommendation for whether the GDD set is ready for architecture work.

## Codex Adaptation Rules

- Prefer a written review artifact with evidence and concrete fixes over interactive phase-by-phase approval ceremony.
- When fewer than two system GDDs exist, stop and explain why holistic review is not meaningful yet.
- Use registries or prior review artifacts when present, but do not trust them over the current GDD text.
- Distinguish document inconsistency issues from design-theory concerns; they lead to different fixes.
- Recommend `$studio-create-architecture` only when the GDD set is sufficiently coherent.

## Handoff

Recommend the next step, usually `$studio-create-architecture`, `$studio-propagate-design-change`, or a focused GDD revision pass.

## Completion

Complete when the holistic review artifact exists and the user has a clear go/no-go assessment for moving into architecture.
