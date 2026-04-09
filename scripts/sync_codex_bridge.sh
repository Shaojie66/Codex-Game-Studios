#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

node "$ROOT_DIR/tools/sync-claude-agents-to-codex.mjs" "$@"

echo "Generated studio prompts and catalog from .codex/prompt-sources/studio."
