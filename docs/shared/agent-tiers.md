# Agent Tiers

This guide is the lightweight tier reference for skills that need to choose
between low-cost lookup work and heavier implementation or review lanes.

## Tier Mapping

| Tier | When to use it | Typical roles |
| --- | --- | --- |
| `LOW` | Fast lookups, simple read-only checks, bounded summaries | `explore`, `writer` |
| `STANDARD` | Normal implementation, tests, debugging, focused review | `executor`, `debugger`, `test-engineer`, `verifier` |
| `THOROUGH` | Architecture, security, broad refactors, high-risk analysis | `architect`, `critic`, `security-reviewer`, `code-reviewer` |

## Selection Rules

1. Choose `LOW` when the task is read-only, narrow, and unlikely to affect behavior.
2. Choose `STANDARD` for most code changes, bug fixes, and verification work.
3. Choose `THOROUGH` when the task changes contracts, spans many files, or carries security or architectural risk.
4. Prefer the lightest tier that preserves correctness; do not pay for `THOROUGH` when `STANDARD` is enough.
