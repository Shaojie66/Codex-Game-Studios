---
name: studio-architecture-decision
description: Codex-native workflow for creating or retrofitting ADRs with engine-aware traceability
---

# Studio Architecture Decision

Use this to create or retrofit an ADR in `docs/architecture/` for a significant technical decision.

## Read First

1. `AGENTS.md`
2. `docs/codex-port.md`
3. `.claude/skills/architecture-decision/SKILL.md`
4. `docs/registry/architecture.yaml` if present
5. Existing ADRs under `docs/architecture/`
6. In-scope GDDs under `design/gdd/`
7. Engine reference docs under `docs/engine-reference/<engine>/`

## Goal

Create a numbered ADR or retrofit a legacy ADR so the decision records context, alternatives, consequences, engine compatibility, dependencies, and GDD traceability.

## Workflow

1. Resolve mode:
   - `new <title>`
   - `retrofit <path>`
2. Detect the configured engine and decision domain, then load the matching engine reference docs plus breaking/deprecated API notes.
3. Determine the next ADR number for new records, or audit missing required sections for retrofit work.
4. Gather context from:
   - related GDD systems and formulas
   - architecture blueprint sections
   - existing ADRs
   - architecture registry constraints
5. Surface conflicts with accepted architectural stances before drafting.
6. Write or update the ADR with:
   - status and date
   - engine compatibility
   - ADR dependencies
   - context, decision, interfaces, and consequences
   - alternatives considered
   - GDD requirements addressed
   - performance implications and verification needs
7. If the decision exposes follow-up work, name the blocked or enabled epics/stories explicitly.

## Codex Adaptation Rules

- Ask only confirm-or-correct questions when a decision cannot be inferred safely from the repo context.
- For retrofit mode, append or fill missing sections without rewriting accepted historical content unless the task explicitly requests broader edits.
- Use the architecture registry as a blocking constraint source, not a suggestion.
- Flag post-cutoff or deprecated APIs directly in the ADR instead of burying the warning in chat.
- Keep ADRs implementation-guiding and specific enough to unblock stories.

## Handoff

Recommend the next step, usually `$studio-create-architecture`, `$studio-create-epics`, or another `$studio-architecture-decision` for newly uncovered gaps.

## Completion

Complete when the target ADR exists or is retrofitted in `docs/architecture/`, records engine-aware constraints, and clearly states dependency and traceability status.
