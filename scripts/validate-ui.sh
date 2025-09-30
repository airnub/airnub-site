#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

TARGETS=(
  "apps/airnub/app"
  "apps/airnub/components"
  "apps/speckit/app"
  "apps/speckit/components"
  "packages/ui/providers"
  "packages/ui/src"
)

EXCLUDE_DIRS=(
  --exclude-dir=node_modules
  --exclude-dir=.next
  --exclude-dir=dist
  --exclude-dir=build
  --exclude-dir=coverage
)

INLINE_COLOR_PATTERN='#[0-9a-fA-F]\{3,\}'

print_matches() {
  local header="$1"
  local matches="$2"

  printf '\n%s\n' "$header"
  printf '%s\n' "$matches"
}

run_grep() {
  local pattern="$1"
  shift
  grep -R --line-number --color=never \
    "${EXCLUDE_DIRS[@]}" \
    --include='*.tsx' \
    --include='*.ts' \
    --include='*.jsx' \
    --include='*.js' \
    --include='*.css' \
    -E "$pattern" \
    "$@" 2>/dev/null || true
}

inline_color_matches=$(run_grep "$INLINE_COLOR_PATTERN" "${TARGETS[@]}")
if [[ -n "$inline_color_matches" ]]; then
  print_matches "Inline color references detected:" "$inline_color_matches"
  echo
  echo "❌ Inline hex colors found. Use CSS variables from @airnub/brand instead."
  exit 1
else
  echo "✅ No inline hex colors found."
fi

DARK_CLASS_PATTERN='class(Name)?=.*dark:'

dark_class_matches=$(run_grep "$DARK_CLASS_PATTERN" "${TARGETS[@]}")
if [[ -n "$dark_class_matches" ]]; then
  print_matches "Tailwind dark: classes detected:" "$dark_class_matches"
  echo
  echo "❌ Remove Tailwind dark: variants and rely on the shared theme tokens."
  exit 1
else
  echo "✅ No rogue dark: classes found."
fi
