# Worker progress convention

Every long-running worker MUST publish heartbeat files at the repository root so a
resuming operator (human or agent) can see fleet status in one command.

## Files

| File | Writer | Reader |
|------|--------|--------|
| `<task>-progress.json` | worker (periodic) | `ops/check_workers.sh`, `ops/cadence.py` |
| `<task>-run.log` | worker (append) | `ops/check_workers.sh` — look for `W_DONE` |

`<task>` is a short slug (`index`, `subsites`, `room`, …).

## `<task>-progress.json` schema

```json
{
  "task": "index",
  "pct": 42,
  "step": "Embedding karl-friston chunks",
  "est_total_sec": 3600,
  "elapsed_sec": 900,
  "ts": "2026-06-21T12:34:56.000Z"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `task` | string | yes | Must match `<task>` slug and `<task>-run.log` prefix |
| `pct` | number | yes | 0–100 inclusive; monotonic non-decreasing while running |
| `step` | string | yes | One-line human status (current action) |
| `est_total_sec` | number | yes | Best estimate of total wall time for this job |
| `elapsed_sec` | number | yes | Wall seconds since worker start |
| `ts` | string | yes | ISO-8601 UTC timestamp of this heartbeat |

### Writer rules

1. **Update often** — at least every major step; more often near the end.
2. **Overwrite** the same path (`<task>-progress.json`); do not version filenames.
3. **Be honest on `est_total_sec`** — cadence assumes estimates may be ~10× off and adapts.
4. Set `pct` to `100` when finished; still write `W_DONE` to the run log (belt + suspenders).
5. On completion, append a final line `W_DONE` to `<task>-run.log`.

### Reader rules

- **In-flight** — progress exists, `pct < 100`, and run log lacks `W_DONE`.
- **Done** — `W_DONE` in run log OR `pct >= 100`.
- **Stale** — `ts` older than `2 × next_check_interval` (from cadence) warrants a poke.

## Cadence integration

On each check-in, `ops/cadence.py`:

1. Loads all `*-progress.json` files.
2. Skips tasks marked done via `W_DONE`.
3. Computes `pace = (pct/100) / (elapsed_sec/est_total_sec)` per in-flight task.
4. Updates per-task `N` and a global `N` (persisted in `ops/cadence-state.json`).
5. Returns `next_check_interval_sec = min(remaining_secᵢ / Nᵢ)`.

See `ops/cadence.py` docstrings for the exact `N` update formula and worked examples.

## Quick start for resuming instances

```bash
~/Projects/agi-2026/ops/check_workers.sh
```

Run this first after resume. It prints one status line per task and the recommended
sleep until the next check-in.