<p align="center">
  <h1 align="center">Codex Game Studios</h1>
  <p align="center">
    A Codex-native game studio workspace for Codex and OMX.
    <br />
    Keep the upstream studio playbooks, but run them from Codex.
  </p>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"></a>
  <a href=".codex/prompt-sources/studio"><img src="https://img.shields.io/badge/agents-49-blueviolet" alt="49 Agents"></a>
  <a href=".codex/skills"><img src="https://img.shields.io/badge/skills-72-green" alt="72 Skills"></a>
  <a href="scripts"><img src="https://img.shields.io/badge/hooks-12-orange" alt="12 Hooks"></a>
  <a href="docs/studio/rules"><img src="https://img.shields.io/badge/rules-11-red" alt="11 Rules"></a>
  <a href="./AGENTS.md"><img src="https://img.shields.io/badge/runtime-Codex%20%2B%20OMX-1f6feb" alt="Runtime: Codex + OMX"></a>
  <a href="https://www.buymeacoffee.com/donchitos3"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20this%20project-FFDD00?logo=buymeacoffee&logoColor=black" alt="Buy Me a Coffee"></a>
  <a href="https://github.com/sponsors/Donchitos"><img src="https://img.shields.io/badge/GitHub%20Sponsors-Support%20this%20project-ea4aaa?logo=githubsponsors&logoColor=white" alt="GitHub Sponsors"></a>
</p>

---

## Why This Exists

Building a game solo with AI is powerful — but a single chat session has no structure. No one stops you from hardcoding magic numbers, skipping design docs, or writing spaghetti code. There's no QA pass, no design review, no one asking "does this actually fit the game's vision?"

**Codex Game Studios** keeps the upstream studio knowledge base, but runs it through Codex-native surfaces. The active runtime and maintenance model live in `.codex/`, `.omx/`, and `AGENTS.md`, with upstream material retained only as archived or reference content when needed.

The result: you still make every decision, but now you have a team that asks the right questions, catches mistakes early, and keeps your project organized from first brainstorm to launch.

## Codex Adaptation

This fork intentionally separates upstream content from Codex runtime surfaces:

- `.codex/prompt-sources/studio/` and `.codex/skills/studio-*/` are the source material
- `.codex/prompts/studio-*.md` are generated Codex prompts built from `.codex/prompt-sources/studio/`
- `AGENTS.md` is the Codex top-level contract
- `$game-studio` is the Codex-native router skill for this repository

Read [docs/codex-port.md](docs/codex-port.md) for the current Codex-native maintenance model.

---

## Table of Contents

- [What's Included](#whats-included)
- [Studio Hierarchy](#studio-hierarchy)
- [Codex Workflows](#codex-workflows)
- [Getting Started](#getting-started)
- [Upgrading](#upgrading)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Design Philosophy](#design-philosophy)
- [Customization](#customization)
- [Platform Support](#platform-support)
- [Community](#community)
- [Supporting This Project](#supporting-this-project)
- [License](#license)

---

## What's Included

| Category | Count | Description |
|----------|-------|-------------|
| **Agents** | 49 | Specialized subagents across design, programming, art, audio, narrative, QA, and production |
| **Skills** | 72 | Slash commands for every workflow phase (`/start`, `/design-system`, `/create-epics`, `/create-stories`, `/dev-story`, `/story-done`, etc.) |
| **Hooks** | 12 | Automated validation on commits, pushes, asset changes, session lifecycle, agent audit trail, and gap detection |
| **Rules** | 11 | Path-scoped coding standards enforced when editing gameplay, engine, AI, UI, network code, and more |
| **Templates** | 39 | Document templates for GDDs, UX specs, ADRs, sprint plans, HUD design, accessibility, and more |

## Studio Hierarchy

Agents are organized into three tiers, matching how real studios operate:

```
Tier 1 — Directors (Opus)
  creative-director    technical-director    producer

Tier 2 — Department Leads (Sonnet)
  game-designer        lead-programmer       art-director
  audio-director       narrative-director    qa-lead
  release-manager      localization-lead

Tier 3 — Specialists (Sonnet/Haiku)
  gameplay-programmer  engine-programmer     ai-programmer
  network-programmer   tools-programmer      ui-programmer
  systems-designer     level-designer        economy-designer
  technical-artist     sound-designer        writer
  world-builder        ux-designer           prototyper
  performance-analyst  devops-engineer       analytics-engineer
  security-engineer    qa-tester             accessibility-specialist
  live-ops-designer    community-manager
```

### Engine Specialists

The template includes agent sets for all three major engines. Use the set that matches your project:

| Engine | Lead Agent | Sub-Specialists |
|--------|-----------|-----------------|
| **Godot 4** | `godot-specialist` | GDScript, Shaders, GDExtension |
| **Unity** | `unity-specialist` | DOTS/ECS, Shaders/VFX, Addressables, UI Toolkit |
| **Unreal Engine 5** | `unreal-specialist` | GAS, Blueprints, Replication, UMG/CommonUI |

## Codex Workflows

Use curated Codex-native workflows first:

**Core path**
- `$studio-start`
- `$studio-help`
- `$studio-project-stage-detect`
- `$studio-brainstorm`
- `$studio-setup-engine`
- `$studio-map-systems`
- `$studio-design-system`
- `$studio-design-review`
- `$studio-review-all-gdds`
- `$studio-propagate-design-change`
- `$studio-create-architecture`
- `$studio-architecture-decision`
- `$studio-architecture-review`
- `$studio-create-control-manifest`
- `$studio-create-epics`
- `$studio-create-stories`
- `$studio-sprint-plan`
- `$studio-sprint-status`
- `$studio-qa-plan`
- `$studio-story-readiness`
- `$studio-smoke-check`
- `$studio-team-qa`
- `$studio-gate-check`
- `$studio-regression-suite`
- `$studio-test-evidence-review`
- `$studio-test-flakiness`
- `$studio-test-helpers`
- `$studio-test-setup`
- `$studio-dev-story`
- `$studio-code-review`
- `$studio-story-done`
- `$studio-release-checklist`
- `$studio-launch-checklist`

The remaining `$studio-*` workflows are also active Codex-native skills. Prompts are generated from `.codex/prompt-sources/studio/`; skill files under `.codex/skills/studio-*/SKILL.md` are the maintained workflow definitions.

## Upstream Workflow Catalog

The upstream template still defines the original workflow inventory. Treat it as reference source material that this workspace now exposes through Codex-native prompts and skills:

**Onboarding & Navigation**
`/start` `/help` `/project-stage-detect` `/setup-engine` `/adopt`

**Game Design**
`/brainstorm` `/map-systems` `/design-system` `/quick-design` `/review-all-gdds` `/propagate-design-change`

**Art & Assets**
`/art-bible` `/asset-spec` `/asset-audit`

**UX & Interface Design**
`/ux-design` `/ux-review`

**Architecture**
`/create-architecture` `/architecture-decision` `/architecture-review` `/create-control-manifest`

**Stories & Sprints**
`/create-epics` `/create-stories` `/dev-story` `/sprint-plan` `/sprint-status` `/story-readiness` `/story-done` `/estimate`

**Reviews & Analysis**
`/design-review` `/code-review` `/balance-check` `/content-audit` `/scope-check` `/perf-profile` `/tech-debt` `/gate-check` `/consistency-check`

**QA & Testing**
`/qa-plan` `/smoke-check` `/soak-test` `/regression-suite` `/test-setup` `/test-helpers` `/test-evidence-review` `/test-flakiness` `/skill-test` `/skill-improve`

**Production**
`/milestone-review` `/retrospective` `/bug-report` `/bug-triage` `/reverse-document` `/playtest-report`

**Release**
`/release-checklist` `/launch-checklist` `/changelog` `/patch-notes` `/hotfix`

**Creative & Content**
`/prototype` `/onboard` `/localize`

**Team Orchestration** (coordinate multiple agents on a single feature)
`/team-combat` `/team-narrative` `/team-ui` `/team-release` `/team-polish` `/team-audio` `/team-level` `/team-live-ops` `/team-qa`

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Codex CLI](https://platform.openai.com/docs) with local project access
- [oh-my-codex](https://github.com) available as `omx`
- [Node.js](https://nodejs.org/) for the prompt sync script
- **Recommended**: [jq](https://jqlang.github.io/jq/) (for hook validation) and Python 3 (for JSON validation)

All hooks fail gracefully if optional tools are missing — nothing breaks, you just lose validation.

### Setup

1. **Clone your fork**:
   ```bash
   git clone <your-fork-url> my-game
   cd my-game
   ```

2. **Install project-level OMX scaffolding**:
   ```bash
   omx setup --force --scope project
   ```

3. **Generate the Codex prompt/catalog surfaces**:
   ```bash
   bash scripts/sync_codex_bridge.sh
   ```

4. **Open Codex in the project root** and use the Codex surfaces:
   - `$game-studio` — route a task through the upstream studio workflow docs
   - `/prompts:studio-creative-director` — creative direction
   - `/prompts:studio-lead-programmer` — code architecture and implementation review
   - `/prompts:studio-godot-specialist` / `/prompts:studio-unity-specialist` / `/prompts:studio-unreal-specialist` — engine-specific work

5. **Use the Codex-native workflows directly**:
   - `$studio-start` — onboarding
   - `$studio-help` — “what next?” routing
   - `$studio-project-stage-detect` — project audit
   - `$studio-dev-story` — implementation workflow
   - `$studio-design-system` — GDD authoring workflow
   - `$studio-test-setup` — test scaffolding workflow
   - `.codex/skills/studio-*/SKILL.md` — maintained workflow definitions when you need the exact contract

6. **Use the upstream skill docs as reference playbooks**:
   - `.codex/skills/studio-start/SKILL.md` — onboarding flow logic
   - `.codex/skills/studio-brainstorm/SKILL.md` — ideation workflow
   - `.codex/skills/studio-design-system/SKILL.md` — GDD authoring flow
   - `.codex/skills/studio-dev-story/SKILL.md` — implementation workflow

## Upgrading

Already using an older version of this template? See [UPGRADING.md](UPGRADING.md)
for step-by-step migration instructions, a breakdown of what changed between
versions, and which files are safe to overwrite vs. which need a manual merge.

## Project Structure

```
AGENTS.md                           # Codex/OMX master configuration
.codex/
  prompt-sources/studio/            # Canonical studio role source material
  prompts/                          # Generated Codex studio prompts
  skills/                           # Codex-native skills for this fork
.omx/                               # Project-local OMX state, plans, logs, and HUD config
docs/
  codex-port.md                     # Codex migration and maintenance guide
  studio/
    quick-start.md                  # Studio workflow orientation
    workflow-catalog.yaml           # Studio workflow catalog
    templates/                      # Document templates
    hooks-reference/                # Hook reference docs
src/                                # Game source code
assets/                             # Art, audio, VFX, shaders, data files
design/                             # GDDs, narrative docs, level designs
docs/                               # Technical documentation and ADRs
tests/                              # Test suites (unit, integration, performance, playtest)
tools/                              # Build and pipeline tools
prototypes/                         # Throwaway prototypes (isolated from src/)
production/                         # Sprint plans, milestones, release tracking
```

## How It Works

### Agent Coordination

Agents follow a structured delegation model:

1. **Vertical delegation** — directors delegate to leads, leads delegate to specialists
2. **Horizontal consultation** — same-tier agents can consult each other but can't make binding cross-domain decisions
3. **Conflict resolution** — disagreements escalate up to the shared parent (`creative-director` for design, `technical-director` for technical)
4. **Change propagation** — cross-department changes are coordinated by `producer`
5. **Domain boundaries** — agents don't modify files outside their domain without explicit delegation

In this fork, those studio roles are invoked from Codex via `/prompts:studio-*`, generated from the upstream `.codex/prompt-sources/studio/*.md` files.

### Collaborative, Not Autonomous

This is **not** an auto-pilot system. Every agent follows a strict collaboration protocol:

1. **Ask** — agents ask questions before proposing solutions
2. **Present options** — agents show 2-4 options with pros/cons
3. **You decide** — the user always makes the call
4. **Draft** — agents show work before finalizing
5. **Approve** — nothing gets written without your sign-off

You stay in control. The agents provide structure and expertise, not autonomy.

### Automated Safety

**Hooks** run automatically on every session:

| Hook | Trigger | What It Does |
|------|---------|--------------|
| `validate-commit.sh` | PreToolUse (Bash) | Checks for hardcoded values, TODO format, JSON validity, design doc sections — exits early if the command is not `git commit` |
| `validate-push.sh` | PreToolUse (Bash) | Warns on pushes to protected branches — exits early if the command is not `git push` |
| `validate-assets.sh` | PostToolUse (Write/Edit) | Validates naming conventions and JSON structure — exits early if the file is not in `assets/` |
| `session-start.sh` | Session open | Shows current branch and recent commits for orientation |
| `detect-gaps.sh` | Session open | Detects fresh projects (suggests `/start`) and missing design docs when code or prototypes exist |
| `pre-compact.sh` | Before compaction | Preserves session progress notes |
| `post-compact.sh` | After compaction | Reminds the next Codex turn to restore session state from `active.md` |
| `notify.sh` | Notification event | Shows Windows toast notification via PowerShell |
| `session-stop.sh` | Session close | Archives `active.md` to session log and records git activity |
| `log-agent.sh` | Agent spawned | Audit trail start — logs subagent invocation |
| `log-agent-stop.sh` | Agent stops | Audit trail stop — completes subagent record |
| `validate-skill-change.sh` | PostToolUse (Write/Edit) | Advises running `/skill-test` after any `.codex/skills/studio-*/` change |

> **Note**: `validate-commit.sh`, `validate-assets.sh`, and `validate-skill-change.sh` fire on every Bash/Write tool call and exit immediately (exit 0) when the command or file path is not relevant. This is normal hook behavior — not a performance concern.

**Permission rules** in `settings.json` auto-allow safe operations (git status, test runs) and block dangerous ones (force push, `rm -rf`, reading `.env` files).

### Path-Scoped Rules

Coding standards are automatically enforced based on file location:

| Path | Enforces |
|------|----------|
| `src/gameplay/**` | Data-driven values, delta time usage, no UI references |
| `src/core/**` | Zero allocations in hot paths, thread safety, API stability |
| `src/ai/**` | Performance budgets, debuggability, data-driven parameters |
| `src/networking/**` | Server-authoritative, versioned messages, security |
| `src/ui/**` | No game state ownership, localization-ready, accessibility |
| `design/gdd/**` | Required 8 sections, formula format, edge cases |
| `tests/**` | Test naming, coverage requirements, fixture patterns |
| `prototypes/**` | Relaxed standards, README required, hypothesis documented |

## Design Philosophy

This template is grounded in professional game development practices:

- **MDA Framework** — Mechanics, Dynamics, Aesthetics analysis for game design
- **Self-Determination Theory** — Autonomy, Competence, Relatedness for player motivation
- **Flow State Design** — Challenge-skill balance for player engagement
- **Bartle Player Types** — Audience targeting and validation
- **Verification-Driven Development** — Tests first, then implementation

## Customization

This is a **template**, not a locked framework. Everything is meant to be customized:

- **Add/remove agents** — delete agent files you don't need, add new ones for your domains
- **Edit agent prompts** — tune agent behavior, add project-specific knowledge
- **Modify skills** — adjust workflows to match your team's process
- **Add rules** — create new path-scoped rules for your project's directory structure
- **Tune hooks** — adjust validation strictness, add new checks
- **Pick your engine** — use the Godot, Unity, or Unreal agent set (or none)
- **Set review intensity** — `full` (all director gates), `lean` (phase gates only), or `solo` (none). Set during `/start` or edit `production/review-mode.txt`. Override per-run with `--review solo` on any skill.

## Platform Support

Tested on **Windows 10** with Git Bash. All hooks use POSIX-compatible patterns (`grep -E`, not `grep -P`) and include fallbacks for missing tools. Works on macOS and Linux without modification.

## Community

- **Discussions** — use this repository's Discussions tab for questions, ideas, and showcases
- **Issues** — use this repository's Issues tab for bug reports and feature requests

---

## Supporting This Project

Codex Game Studios is free and open source. If it saves you time or helps you ship your game, consider supporting continued development:

<p>
  <a href="https://www.buymeacoffee.com/donchitos3"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me a Coffee"></a>
  &nbsp;
  <a href="https://github.com/sponsors/Donchitos"><img src="https://img.shields.io/badge/GitHub%20Sponsors-ea4aaa?style=for-the-badge&logo=githubsponsors&logoColor=white" alt="GitHub Sponsors"></a>
</p>

- **[Buy Me a Coffee](https://www.buymeacoffee.com/donchitos3)** — one-time support
- **[GitHub Sponsors](https://github.com/sponsors/Donchitos)** — recurring support through GitHub

Sponsorships help fund time spent maintaining skills, adding new agents, keeping up with Codex/OMX and engine API changes, and responding to community issues.

---

*Built for Codex and OMX. Maintained and extended — contributions welcome through this repository's Discussions tab.*

## License

MIT License. See [LICENSE](LICENSE) for details.
