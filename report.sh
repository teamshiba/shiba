#!/usr/bin/env bash
# Usage:
#
# 1. First run this script with "initial" as argument to obtain the initial result
# 2. Then fix the errors illustrated in the report
# 3. Finally re-run this script with "fixed" as argument to obtain the result after fixing

SCRIPT_DIR="$(readlink -f "$(dirname "$0")")"
REPORT_DIRECTORY="$SCRIPT_DIR/reports"

SUFFIX="$1"
shift

if [[ -z "$SUFFIX" ]]; then
  echo "Please specify a suffix for report result"
  exit 1
fi

report() {
  output="$REPORT_DIRECTORY/$1-$SUFFIX.txt"
  shift

  if [[ -f "$output" ]]; then
    echo "$output already exists, overwrite? (y/n)"
    read -r choice
    if [[ "$choice" != "y" ]]; then
      return
    fi
  fi

  mkdir -p "$(dirname "$output")"
  "$@" >"$output" 2>&1
}

# Frontend reports
cd webapp || exit 1
report frontend-unittest npm run test-all
report frontend-style-cheker-and-bug-finder npx eslint .

cd ..

# Backend reports
cd service || exit 1
# ...
