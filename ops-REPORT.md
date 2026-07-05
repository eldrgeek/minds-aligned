# ops-REPORT — adaptive check-in cadence + progress convention

**Track:** `ops/` (Ops / autonomy)  
**Date:** 2026-06-21  
**Status:** Done — algorithm implemented, convention documented, helper tested

## What was built

| File | Purpose |
|------|---------|
| `ops/cadence.py` | Adaptive N update + `next_check_interval_sec` computation |
| `ops/PROGRESS.md` | Canonical `<task>-progress.json` + `<task>-run.log` spec |
| `ops/check_workers.sh` | First-run-on-resume fleet status (wraps `cadence.py`) |
| `ops/cadence-state.json` | Persisted global + per-task N (created on first check-in) |
| `ops/fixtures/` | Synthetic progress files for self-test |

## Cadence formula

### Next check interval

```
remainingᵢ = min(est_total_secᵢ − elapsed_secᵢ, est_total_secᵢ × (1 − pctᵢ/100))
next_check_interval_sec = minᵢ (remainingᵢ / Nᵢ)   # in-flight tasks only
```

Higher **N** → **shorter** interval (poll sooner). Lower **N** → wait longer.

### N update (per task, each check-in)

```
pace = work_done_fraction / max(elapsed_fraction, 0.01)
      where work_done_fraction = pct/100
            elapsed_fraction   = elapsed_sec / est_total_sec

N_proposed = N_old × pace

# On-pace band: estimate is trustworthy → damp toward N_ON_PACE
if 0.75 ≤ pace ≤ 1.33:
    N_proposed = min(N_old, N_ON_PACE)    # N_ON_PACE = 4

N_new = clamp(N_MIN, N_MAX, N_proposed)   # N_MIN=3, N_MAX=20
```

**Global N** — EMA (α=0.5) of the mean per-task N after each check-in. Starts at **10**
(estimates assumed ~10× off).

### Worked examples (Mike's two cases)

Initial `N_old = 10`, `elapsed_fraction = 0.1` (100s of 1000s):

| Case | work_done | pace | N_proposed | N_new | Effect |
|------|-----------|------|------------|-------|--------|
| Ahead | 50% (½ done) | 5.0 | 50 | **20** (cap) | Check **sooner** |
| On pace | 10% (¹⁄₁₀ done) | 1.0 | min(10, 4) | **4** | Wait **longer** |

### Synthetic fixture run

```bash
python3 ops/cadence.py --test
```

```
PASS ahead (1/2 done at 1/10 elapsed): N 10.0 -> 20.0 (expect 20.0)
PASS on pace (1/10 done at 1/10 elapsed): N 10.0 -> 4.0 (expect 4.0)

Fixture check-in: next_interval=25.0s global_N=11.0
fast-task    RUN   50.0% … N=20.0 pace=5.00 rem=8.3m
steady-task  RUN   10.0% … N=4.0 pace=1.00 rem=15.0m
```

`next_interval=25s` = min(500/20, 900/4) = min(25, 225).

## Progress convention

Workers publish `~/Projects/agi-2026/<task>-progress.json`:

```json
{"task","pct":0-100,"step","est_total_sec","elapsed_sec","ts"}
```

Completion: `pct=100` **and** `W_DONE` in `<task>-run.log`. See `ops/PROGRESS.md`.

**Migration note:** existing `room-progress.json` / `dashboard-progress.json` lack
`est_total_sec` / `elapsed_sec`; cadence skips interval math until workers adopt the
full schema.

## Usage

```bash
# First command after resume
~/Projects/agi-2026/ops/check_workers.sh

# Machine-readable
~/Projects/agi-2026/ops/check_workers.sh --json

# Self-test only (no state write)
python3 ops/cadence.py --test
```

## Ideas appended

See `IDEAS.md` § Ops / autonomy (2026-06-21 entries).