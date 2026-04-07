---
name: studio-onboard
description: Codex bridge for the legacy Claude Code Game Studios workflow `onboard`
---

# Studio Bridge: onboard

This wrapper ports the legacy workflow defined in `.claude/skills/onboard/SKILL.md` to Codex/OMX.

<Execution>
1. Read `.claude/skills/onboard/SKILL.md` in full before taking action.
2. Use its phases, required artifacts, dependencies, and completion criteria as the workflow contract.
3. Adapt Claude-specific constructs:
- `AskUserQuestion`: ask only when the needed information cannot be derived safely; otherwise inspect the repo and proceed autonomously.
- `Task`: use Codex native subagents or `/prompts:studio-<role>` wrappers for specialist delegation.
- `Write` and `Edit` approval gates: follow `AGENTS.md` instead of waiting for legacy approval language.
- Slash-command references like `/foo`: translate to `$studio-foo` when the bridge exists; otherwise read the legacy skill file directly.
- References to `.claude/settings.json` hooks or Claude runtime behavior: treat them as historical reference only. Codex runtime behavior comes from `.codex/config.toml`, `AGENTS.md`, and OMX.
4. Keep the legacy workflow's sequencing, artifacts, and verification rigor. Do not silently skip phases that materially protect correctness.
5. If the legacy workflow mainly produces docs, reports, or plans, create or update those repo artifacts instead of only summarizing them in chat.

<Completion>
The task is complete only when the requested workflow outcome exists in the repo or has been verified under Codex/OMX conventions.
