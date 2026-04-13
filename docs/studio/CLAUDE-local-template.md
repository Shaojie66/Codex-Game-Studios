# CLAUDE.local.md Template

Copy this file to the project root as `CLAUDE.local.md` for personal overrides.
This file is gitignored and will not be committed.

This template is preserved for legacy compatibility only. In the active Codex
runtime, prefer repository-level configuration and `AGENTS.md` over Claude-era
model nicknames or command shortcuts.

```markdown
# Personal Preferences

## Model Preferences
- Prefer the leadership or thorough lanes for complex design tasks
- Prefer fast lanes for quick lookups and simple edits

## Workflow Preferences
- Always run tests after code changes
- Compact context proactively at 60% usage
- Use /clear between unrelated tasks

## Local Environment
- Python command: python (or py / python3)
- Shell: Git Bash on Windows
- IDE: VS Code with Codex/OMX-compatible tooling

## Communication Style
- Keep responses concise
- Show file paths in all code references
- Explain architectural decisions briefly

## Personal Shortcuts
- When I say "review", run `$studio-code-review` on the last changed files
- When I say "status", show git status + sprint progress
```

## Setup

1. Copy this template to your project root: `cp docs/studio/CLAUDE-local-template.md CLAUDE.local.md`
2. Edit to match your preferences
3. Verify `CLAUDE.local.md` is in `.gitignore` (kept only for legacy compatibility in this fork)
