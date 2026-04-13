#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

node "$ROOT_DIR/tools/sync-codex-studio-prompts.mjs" --root "$ROOT_DIR" "$@"

echo "Generated studio prompts and catalog from Codex-native prompt sources."
