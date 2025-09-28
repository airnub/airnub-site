#!/usr/bin/env bash
set -euo pipefail

if [[ "${DEBUG:-false}" == "true" ]]; then
  set -x
fi

log() {
  echo "[post-start] $*"
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

if ! command -v supabase >/dev/null 2>&1; then
  log "Supabase CLI not installed; skipping local start and env sync."
  exit 0
fi

if ! command -v pnpm >/dev/null 2>&1; then
  log "pnpm not available; skipping Supabase env sync."
  exit 0
fi

if ! command -v docker >/dev/null 2>&1; then
  log "Docker not available; skipping Supabase local start."
  exit 0
fi

cd "${REPO_ROOT}"

if supabase status >/dev/null 2>&1; then
  log "Supabase local stack already running."
else
  log "Starting Supabase local stack..."
  if ! supabase start; then
    log "Supabase CLI failed to start the local stack."
    exit 1
  fi
fi

log "Syncing Supabase environment variables via pnpm db:env:local..."
if ! pnpm db:env:local; then
  log "Failed to sync Supabase environment variables."
  exit 1
fi

log "Post-start tasks completed."
