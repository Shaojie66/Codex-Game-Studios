---
name: cancel
description: Cancel any active OMX mode (autopilot, ralph, ultrawork, ecomode, ultraqa, swarm, ultrapilot, pipeline, team)
---

# Cancel Skill

Intelligent cancellation that detects and cancels the active OMX mode.

**The cancel skill is the standard way to complete and exit any OMX mode.**
When the stop hook detects work is complete, it instructs the LLM to invoke
this skill for proper state cleanup. If cancel fails or is interrupted,
retry with `--force` flag, or wait for the 2-hour staleness timeout as
a last resort.

## What It Does

Automatically detects which mode is active and cancels it:
- **Autopilot**: Stops workflow, preserves progress for resume
- **Ralph**: Stops persistence loop, clears linked ultrawork if applicable
- **Ultrawork**: Stops parallel execution (standalone or linked)
- **Ecomode**: Stops token-efficient parallel execution (standalone or linked to ralph)
- **UltraQA**: Stops QA cycling workflow
- **Swarm**: Stops coordinated agent swarm, releases claimed tasks
- **Ultrapilot**: Stops parallel autopilot workers
- **Pipeline**: Stops sequential agent pipeline
- **Team**: Sends shutdown inbox to all workers, waits for exit, kills tmux session, and clears team state

## Usage

```
/cancel
```

Or say: "cancelomc", "stopomc"

## Auto-Detection

`/cancel` follows the session-aware state contract:
- By default the command inspects the current session via `state_list_active` and `state_get_status`, navigating `.omx/state/sessions/{sessionId}/…` to discover which mode is active.
- When a session id is provided or already known, that session-scoped path is authoritative. Legacy files in `.omx/state/*.json` are consulted only as a compatibility fallback if the session id is missing or empty.
- Swarm is a shared SQLite/marker mode (`.omx/state/swarm.db` / `.omx/state/swarm-active.marker`) and is not session-scoped.
- The default cleanup flow calls `state_clear` with the session id to remove only the matching session files; modes stay bound to their originating session.

## Normative Ralph cancellation post-conditions (MUST)

For Ralph-targeted cancellation (standalone or linked), completion is defined by post-conditions:

1. Target Ralph state is terminalized, not silently removed:
   - `active=false`
   - `current_phase='cancelled'`
   - `completed_at` is set (ISO timestamp)
2. If Ralph is linked to Ultrawork or Ecomode in the same scope, that linked mode is also terminalized/non-active.
4. Cancellation MUST remain scope-safe: no mutation of unrelated sessions.

See: `docs/contracts/ralph-cancel-contract.md`.

Active modes are still cancelled in dependency order:
1. Autopilot (includes linked ralph/ultraqa/ecomode cleanup)
2. Ralph (cleans its linked ultrawork or ecomode)
3. Ultrawork (standalone)
4. Ecomode (standalone)
5. UltraQA (standalone)
6. Swarm (standalone)
7. Ultrapilot (standalone)
8. Pipeline (standalone)
9. Team (tmux-based)
10. Plan Consensus (standalone)

## Normative Ralph post-conditions (MUST)

When cancellation targets Ralph state in a scope, completion requires all of the following:

1. Ralph state is terminal in that same scope: `active=false`, `current_phase='cancelled'` (or linked terminal phase), and `completed_at` is set.
2. Linked Ultrawork/Ecomode in the same scope is also terminal/non-active.
4. Unrelated sessions are untouched.

## Force Clear All

Use `--force` or `--all` when you need to erase every session plus legacy artifacts, e.g., to reset the workspace entirely.

```
/cancel --force
```

```
/cancel --all
```

Steps under the hood:
1. `state_list_active` enumerates `.omx/state/sessions/{sessionId}/…` to find every known session.
2. `state_clear` runs once per session to drop that session’s files.
3. A global `state_clear` without `session_id` removes legacy files under `.omx/state/*.json`, `.omx/state/swarm*.db`, and compatibility artifacts (see list).
4. Team artifacts (`.omx/state/team/*/`, tmux sessions matching `omx-team-*`) are best-effort cleared as part of the legacy fallback.

Every `state_clear` command honors the `session_id` argument, so even force mode still uses the session-aware paths first before deleting legacy files.

Legacy compatibility list (removed only under `--force`/`--all`):
- `.omx/state/autopilot-state.json`
- `.omx/state/ralph-state.json`
- `.omx/state/ralph-plan-state.json`
- `.omx/state/ralph-verification.json`
- `.omx/state/ultrawork-state.json`
- `.omx/state/ecomode-state.json`
- `.omx/state/ultraqa-state.json`
- `.omx/state/swarm.db`
- `.omx/state/swarm.db-wal`
- `.omx/state/swarm.db-shm`
- `.omx/state/swarm-active.marker`
- `.omx/state/swarm-tasks.db`
- `.omx/state/ultrapilot-state.json`
- `.omx/state/ultrapilot-ownership.json`
- `.omx/state/pipeline-state.json`
- `.omx/state/plan-consensus.json`
- `.omx/state/ralplan-state.json`
- `.omx/state/boulder.json`
- `.omx/state/hud-state.json`
- `.omx/state/subagent-tracking.json`
- `.omx/state/subagent-tracker.lock`
- `.omx/state/rate-limit-daemon.pid`
- `.omx/state/rate-limit-daemon.log`
- `.omx/state/checkpoints/` (directory)
- `.omx/state/sessions/` (empty directory cleanup after clearing sessions)

## Implementation Steps

When you invoke this skill:

### 1. Parse Arguments

```bash
# Check for --force or --all flags
FORCE_MODE=false
if [[ "$*" == *"--force"* ]] || [[ "$*" == *"--all"* ]]; then
  FORCE_MODE=true
fi
```

### 2. Detect Active Modes

The skill now relies on the session-aware state contract rather than hard-coded file paths:
1. Call `state_list_active` to enumerate `.omx/state/sessions/{sessionId}/…` and discover every active session.
2. For each session id, call `state_get_status` to learn which mode is running (`autopilot`, `ralph`, `ultrawork`, etc.) and whether dependent modes exist.
3. If a `session_id` was supplied to `/cancel`, skip legacy fallback entirely and operate solely within that session path; otherwise, consult legacy files in `.omx/state/*.json` only if the state tools report no active session. Swarm remains a shared SQLite/marker mode outside session scoping.
4. Any cancellation logic in this doc mirrors the dependency order discovered via state tools (autopilot → ralph → …).

### 3A. Force Mode (if --force or --all)

Use force mode to clear every session plus legacy artifacts via `state_clear`. Direct file removal is reserved for legacy cleanup when the state tools report no active sessions.

### 3B. Smart Cancellation (default)

#### If Team Active (tmux-based)

Teams are detected by checking for config files in `.omx/state/team/`:

```bash
# Check for active teams
ls .omx/state/team/*/config.json 2>/dev/null
```

**Two-pass cancellation protocol:**

**Pass 1: Graceful Shutdown**
```
For each team found in .omx/state/team/:
  1. Read config.json to get team_name and workers list
  2. For each worker:
     a. Write shutdown inbox to .omx/state/team/{name}/workers/{worker}/inbox.md
     b. Send short trigger via tmux send-keys
     c. Wait up to 15 seconds for worker tmux pane to exit
     d. If still alive: mark as unresponsive
```

**Pass 2: Force Kill**
```
After graceful pass:
  1. For each remaining alive worker:
     a. Send C-c via tmux send-keys
     b. Wait 2 seconds
     c. Kill the tmux window if still alive
  2. Destroy the tmux session: tmux kill-session -t omx-team-{name}
```

**Cleanup:**
```
  1. Strip AGENTS.md team worker overlay (<!-- OMX:TEAM:WORKER:START/END -->)
  2. Remove team state directory: rm -rf .omx/state/team/{name}/
  3. Clear team mode state: state_clear(mode="team")
  4. Emit structured cancel report
```

**Structured Cancel Report:**
```
Team "{team_name}" cancelled:
  - Workers signaled: N
  - Graceful exits: M
  - Force killed: K
  - tmux session destroyed: yes/no
  - State cleaned up: yes/no
```

**Implementation note:** The cancel skill is executed by the LLM, not as a bash script. When you detect an active team:
1. Check `.omx/state/team/*/config.json` for active teams
2. For each worker in config.workers, write shutdown inbox and send trigger
3. Wait briefly for workers to exit (15s timeout)
4. Force kill remaining workers via tmux
5. Destroy tmux session: `tmux kill-session -t omx-team-{name}`
6. Strip AGENTS.md overlay
7. Remove state: `rm -rf .omx/state/team/{name}/`
8. `state_clear(mode="team")`
9. Report structured summary to user

#### If Autopilot Active

1. Use `state_get_status(mode="autopilot")` for the current session.
2. Terminalize autopilot state in that session with `state_write`:
   - `active=false`
   - `current_phase='cancelled'`
   - `completed_at=<now>`
3. If the autopilot state reports linked `ralph`, `ultrawork`, `ecomode`, or `ultraqa`
   lanes in the same scope, terminalize those linked modes before exiting.
4. Preserve resumable metadata when the state model supports it.

#### If Ralph Active (but not Autopilot)

1. Use `state_get_status(mode="ralph")` for the target session.
2. If linked `ultrawork` or `ecomode` is active in that same scope, terminalize it first.
3. Terminalize Ralph with `state_write` so the post-conditions in
   `docs/contracts/ralph-cancel-contract.md` are satisfied:
   - `active=false`
   - `current_phase='cancelled'`
   - `completed_at=<now>`
4. Use `state_clear` only for compatibility-only legacy files or in force mode.

#### If Ultrawork Active (standalone, not linked)

1. Use `state_get_status(mode="ultrawork")`.
2. If the mode is linked to Ralph in the same scope, cancel Ralph instead of
   trying to clear Ultrawork independently.
3. Otherwise terminalize or clear Ultrawork through `state_write` / `state_clear`
   for the current session.

#### If UltraQA Active (standalone)

Use `state_get_status(mode="ultraqa")` and then clear or terminalize the mode
within the current session via `state_write` / `state_clear`.

#### No Active Modes

```bash
echo "No active OMX modes detected."
echo ""
echo "Checked for:"
echo "  - Autopilot (.omx/state/autopilot-state.json)"
echo "  - Ralph (session-aware state or legacy compatibility files)"
echo "  - Ultrawork (session-aware state or legacy compatibility files)"
echo "  - UltraQA (session-aware state or legacy compatibility files)"
echo ""
echo "Use --force to clear all state files anyway."
```

## Implementation Notes

The cancel skill runs as follows:
1. Parse the `--force` / `--all` flags, tracking whether cleanup should span every session or stay scoped to the current session id.
2. Use `state_list_active` to enumerate known session ids and `state_get_status` to learn the active mode (`autopilot`, `ralph`, `ultrawork`, etc.) for each session.
3. When operating in default mode, call `state_clear` with that session_id to remove only the session’s files, then run mode-specific cleanup (autopilot → ralph → …) based on the state tool signals.
4. In force mode, iterate every active session, call `state_clear` per session, then run a global `state_clear` without `session_id` to drop legacy files (`.omx/state/*.json`, compatibility artifacts) and report success. Swarm remains a shared SQLite/marker mode outside session scoping.
5. Team artifacts (`.omx/state/team/*/`, tmux sessions matching `omx-team-*`) remain best-effort cleanup items invoked during the legacy/global pass.

State tools always honor the `session_id` argument, so even force mode still clears the session-scoped paths before deleting compatibility-only legacy state.

Mode-specific subsections below describe what extra cleanup each handler performs after the state-wide operations finish.
## Messages Reference

| Mode | Success Message |
|------|-----------------|
| Autopilot | "Autopilot cancelled at phase: {phase}. Progress preserved for resume." |
| Ralph | "Ralph cancelled. Persistent mode deactivated." |
| Ultrawork | "Ultrawork cancelled. Parallel execution mode deactivated." |
| Ecomode | "Ecomode cancelled. Token-efficient execution mode deactivated." |
| UltraQA | "UltraQA cancelled. QA cycling workflow stopped." |
| Swarm | "Swarm cancelled. Coordinated agents stopped." |
| Ultrapilot | "Ultrapilot cancelled. Parallel autopilot workers stopped." |
| Pipeline | "Pipeline cancelled. Sequential agent chain stopped." |
| Team | "Team cancelled. Teammates shut down and cleaned up." |
| Plan Consensus | "Plan Consensus cancelled. Planning session ended." |
| Force | "All OMX modes cleared. You are free to start fresh." |
| None | "No active OMX modes detected." |

## What Gets Preserved

| Mode | State Preserved | Resume Command |
|------|-----------------|----------------|
| Autopilot | Yes (phase, files, spec, plan, verdicts) | `/autopilot` |
| Ralph | No | N/A |
| Ultrawork | No | N/A |
| UltraQA | No | N/A |
| Swarm | No | N/A |
| Ultrapilot | No | N/A |
| Pipeline | No | N/A |
| Plan Consensus | Yes (plan file path preserved) | N/A |

## Notes

- **Dependency-aware**: Autopilot cancellation cleans up Ralph and UltraQA
- **Link-aware**: Ralph cancellation cleans up linked Ultrawork or Ecomode
- **Safe**: Only clears linked Ultrawork, preserves standalone Ultrawork
- **Local-only**: Clears state files in `.omx/state/` directory
- **Resume-friendly**: Autopilot state is preserved for seamless resume
- **Team-aware**: Detects tmux-based teams and performs graceful shutdown with force-kill fallback

## Tmux Team Cleanup

When cancelling team mode, the cancel skill should:

1. **Kill all team tmux sessions**: `tmux list-sessions -F '#{session_name}' 2>/dev/null | grep '^omx-team-'` and kill each
2. **Remove team state directories**: `rm -rf .omx/state/team/*/`
3. **Strip AGENTS.md overlay**: Remove content between `<!-- OMX:TEAM:WORKER:START -->` and `<!-- OMX:TEAM:WORKER:END -->`

### Force Clear Addition

When `--force` is used, also clean up:
```bash
rm -rf .omx/state/team/                  # All team state
# Kill all omx-team-* tmux sessions
tmux list-sessions -F '#{session_name}' 2>/dev/null | grep '^omx-team-' | while read s; do tmux kill-session -t "$s" 2>/dev/null; done
```
