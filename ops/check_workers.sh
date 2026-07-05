#!/usr/bin/env bash
# Fleet status + adaptive next-check interval. Run this first on resume.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OPS="$(cd "$(dirname "$0")" && pwd)"
PY="${PYTHON:-python3}"

if [[ ! -f "$OPS/cadence.py" ]]; then
  echo "error: missing $OPS/cadence.py" >&2
  exit 1
fi

cd "$ROOT"

# One-line status per task + cadence recommendation
exec "$PY" "$OPS/cadence.py" --repo "$ROOT" "$@"