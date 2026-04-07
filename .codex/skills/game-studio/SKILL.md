---
name: game-studio
description: Codex-native router for the game-studio workflow assets in this repository
---

# Game Studio Router

Use this skill when the user wants to work with the studio framework in this repository from Codex instead of Claude Code.

## Intent

This repository keeps the original upstream knowledge base in `.claude/`.
Those files are still valuable, but they are not native Codex entrypoints.
Your job is to translate the user's request into the Codex/OMX surfaces that now exist in this fork.

## Sources Of Truth

Read these files as needed:

1. `AGENTS.md` for the top-level Codex operating contract
2. `docs/codex-port.md` for the fork-specific compatibility rules
3. `docs/codex-agent-catalog.md` for the upstream-agent to Codex-prompt mapping
4. `.claude/docs/skills-reference.md` for the original workflow catalog
5. `.claude/skills/<name>/SKILL.md` only when the user needs the details of a specific original workflow

## How To Route Work

1. Prefer Codex-native execution.
2. Use `/prompts:studio-...` when the task benefits from a specific studio role.
3. Treat `.claude/skills/*` as reference playbooks, not as directly executable Codex slash commands.
4. When an upstream skill depends on `AskUserQuestion`, replace it with concise plain-text questions or proceed autonomously when the answer is obvious and low-risk.
5. Preserve upstream docs and assets unless the task specifically requires changing them.

## Quick Mapping

- Strategic direction or creative conflicts: use `/prompts:studio-creative-director`
- Technical planning or architecture: use `/prompts:studio-technical-director` or `/prompts:studio-lead-programmer`
- Feature implementation: use Codex directly, optionally with `/prompts:studio-gameplay-programmer`, `/prompts:studio-ui-programmer`, or engine specialists
- QA, release, and readiness checks: use `/prompts:studio-qa-lead`, `/prompts:studio-qa-tester`, or `/prompts:studio-release-manager`

## Deliverable Standard

When you rely on upstream `.claude` workflow docs, say which doc you used and translate the result into Codex actions, file changes, or a concise plan. Do not tell the user to switch back to Claude Code unless they explicitly ask for Claude-only behavior.
