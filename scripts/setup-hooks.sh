#!/usr/bin/env bash
set -euo pipefail

HOOKS_DIR="$(git rev-parse --git-dir)/hooks"

install_hook() {
  local name="$1"
  local content="$2"
  local path="$HOOKS_DIR/$name"
  printf '%s\n' "$content" > "$path"
  chmod +x "$path"
  echo "Installed $name hook"
}

install_hook "commit-msg" '#!/usr/bin/env bash
msg=$(cat "$1")
pattern="^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .{1,100}"
if ! echo "$msg" | grep -qE "$pattern"; then
  echo "ERROR: Commit message does not follow Conventional Commits format."
  echo "Expected: <type>(<scope>): <description>"
  echo "Types: feat fix docs style refactor perf test build ci chore revert"
  echo "Got: $msg"
  exit 1
fi'

install_hook "pre-commit" '#!/usr/bin/env bash
if git diff --cached --name-only | grep -qE "\.(env|key|pem|p12|pfx)$"; then
  echo "ERROR: Attempt to commit sensitive file types (.env .key .pem .p12 .pfx)"
  exit 1
fi
if git diff --cached | grep -qiE "(password|secret|api_key|token)\s*=\s*[\"'"'"'][^\"'"'"']+[\"'"'"']"; then
  echo "WARNING: Possible secret detected in staged changes. Review before committing."
  exit 1
fi'

install_hook "pre-push" '#!/usr/bin/env bash
protected="main master"
branch=$(git symbolic-ref HEAD 2>/dev/null | sed "s|refs/heads/||")
for b in $protected; do
  if [ "$branch" = "$b" ]; then
    echo "ERROR: Direct push to $b is not allowed. Use a pull request."
    exit 1
  fi
done'

echo "All hooks installed successfully."
