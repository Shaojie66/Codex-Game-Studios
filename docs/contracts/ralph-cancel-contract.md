# Ralph Cancel Contract

This document defines the required post-conditions for cancelling Ralph in the
current OMX session-aware state model.

## Required Post-conditions

When cancellation targets Ralph in a given scope:

1. Ralph state becomes terminal in that same scope:
   - `active=false`
   - `current_phase='cancelled'`
   - `completed_at` is set to an ISO timestamp
2. Any linked `ultrawork` or `ecomode` state in the same scope is also made
   terminal or inactive.
3. Unrelated sessions are not mutated.
4. Legacy compatibility files may be cleared only in `--force` / `--all` mode
   after session-scoped state has been handled.

## Implementation Guidance

- Prefer `state_list_active`, `state_get_status`, `state_write`, and `state_clear`
  over direct file deletion.
- Treat legacy `.omx/state/*.json` files as compatibility fallbacks, not the
  primary source of truth.
- If cleanup requires a best-effort fallback outside the state tools, preserve
  the same terminal-state semantics whenever possible.
