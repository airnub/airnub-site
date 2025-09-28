#!/bin/sh
set -eu

COMMIT_MSG_FILE="$1"

if [ ! -f "$COMMIT_MSG_FILE" ]; then
  echo "Commit message file not found: $COMMIT_MSG_FILE" >&2
  exit 1
fi

# Read first line of commit message
FIRST_LINE=$(sed -n '1p' "$COMMIT_MSG_FILE" | tr -d '\r')

if [ -z "$FIRST_LINE" ]; then
  echo "Commit message is empty." >&2
  exit 1
fi

# Conventional commit types we allow
TYPES="build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test"

if printf '%s' "$FIRST_LINE" | grep -Eq "^(${TYPES})(\\([a-z0-9-]+\\))?: .+"; then
  HEADER_LENGTH=${#FIRST_LINE}
  if [ "$HEADER_LENGTH" -le 72 ]; then
    exit 0
  else
    echo "Commit message header must be 72 characters or less (currently $HEADER_LENGTH)." >&2
    exit 1
  fi
fi

echo "Commit message must follow Conventional Commits (e.g. 'feat: add new feature')." >&2
exit 1
