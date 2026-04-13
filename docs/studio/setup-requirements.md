# Setup Requirements

This template requires a few tools to be installed for full functionality.
All hooks fail gracefully if tools are missing — nothing will break, but
you'll lose validation features.

## Required

| Tool | Purpose | Install |
| ---- | ---- | ---- |
| **Git** | Version control, branch management | [git-scm.com](https://git-scm.com/) |
| **Codex CLI** | Primary AI agent CLI | Install and configure Codex for local workspace access |
| **OMX** | Coordination layer and runtime helpers | Install `omx` and run `omx setup` in the project |

## Recommended

| Tool | Used By | Purpose | Install |
| ---- | ---- | ---- | ---- |
| **jq** | Hooks (4 of 8) | JSON parsing in commit/push/asset/agent hooks | See below |
| **Python 3** | Hooks (2 of 8) | JSON validation for data files | [python.org](https://www.python.org/) |
| **Bash** | All hooks | Shell script execution | Included with Git for Windows |

### Installing jq

**Windows** (any of these):
```
winget install jqlang.jq
choco install jq
scoop install jq
```

**macOS**:
```
brew install jq
```

**Linux**:
```
sudo apt install jq     # Debian/Ubuntu
sudo dnf install jq     # Fedora
sudo pacman -S jq       # Arch
```

## Platform Notes

### Windows
- Git for Windows includes **Git Bash**, which provides the `bash` command
  used by shell-based repo utilities
- Ensure Git Bash is on your PATH (default if installed via the Git installer)
- Shell helpers use `bash ...` — this works on Windows because
  Codex and OMX invoke commands through a shell that can find `bash.exe`

### macOS / Linux
- Bash is available natively
- Install `jq` via your package manager for full hook support

## Verifying Your Setup

Run these commands to check prerequisites:

```bash
git --version          # Should show git version
bash --version         # Should show bash version
jq --version           # Should show jq version (optional)
python3 --version      # Should show python version (optional)
```

## What Happens Without Optional Tools

| Missing Tool | Effect |
| ---- | ---- |
| **jq** | Commit validation, push protection, asset validation, and agent audit hooks silently skip their checks. Commits and pushes still work. |
| **Python 3** | JSON data file validation in commit and asset hooks is skipped. Invalid JSON can be committed without warning. |
| **Both** | All hooks still execute without error (exit 0) but provide no validation. You're flying without safety nets. |

## Recommended IDE

Codex/OMX works with any editor, but the template is optimized for:
- **VS Code**
- **Cursor**
- Terminal-based Codex CLI
