#!/usr/bin/env bash
set -euo pipefail

if [[ "${DEBUG:-false}" == "true" ]]; then
  set -x
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
cd "${REPO_ROOT}"

supabase_ready=false

if command -v supabase >/dev/null 2>&1; then
  echo "[post-start] Checking Supabase local stack status..."
  status_file="$(mktemp)"
  if supabase status >"${status_file}" 2>&1; then
    if grep -qi 'api url' "${status_file}"; then
      echo "[post-start] Supabase services already running."
      supabase_ready=true
    else
      echo "[post-start] Supabase services not running; starting now..."
      supabase start
      supabase_ready=true
    fi
  else
    echo "[post-start] Supabase status check failed; attempting to start services..." >&2
    supabase start
    supabase_ready=true
  fi
  rm -f "${status_file}"
else
  echo "[post-start] Supabase CLI not found on PATH; skipping Supabase startup." >&2
fi

if command -v pnpm >/dev/null 2>&1; then
  if [[ "${supabase_ready}" == "true" ]]; then
    echo "[post-start] Syncing local environment files from Supabase status..."
    pnpm db:env:local
  else
    echo "[post-start] Skipping environment sync because Supabase CLI is unavailable." >&2
  fi
else
  echo "[post-start] pnpm not found; cannot run db:env:local." >&2
fi
