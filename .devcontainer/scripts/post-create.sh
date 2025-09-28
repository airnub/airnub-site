#!/usr/bin/env bash
set -euo pipefail

if [[ "${DEBUG:-false}" == "true" ]]; then
  set -x
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "[post-create] pnpm is required but was not found on PATH" >&2
  exit 1
fi

echo "[post-create] Installing workspace dependencies with pnpm install..."
pnpm install

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -x "${SCRIPT_DIR}/install-supabase-cli.sh" ]]; then
  echo "[post-create] Installing Supabase CLI..."
  "${SCRIPT_DIR}/install-supabase-cli.sh"
else
  echo "[post-create] Skipping Supabase CLI installation; script not found or not executable." >&2
fi

if command -v npm >/dev/null 2>&1; then
  echo "[post-create] Installing @openai/codex CLI..."
  npm install -g @openai/codex@latest
else
  echo "[post-create] Skipping @openai/codex installation; npm not found on PATH." >&2
fi

