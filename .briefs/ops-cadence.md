# Worker brief: the adaptive check-in cadence algorithm + progress convention

Engineering worker on Mike's Mac. Read `~/Projects/agi-2026/IDEAS.md` ("Ops / autonomy").
Work ONLY in `~/Projects/agi-2026/ops`. HARD RULES: no git push, no deploy. Append ideas to
`IDEAS.md`. Write `ops-REPORT.md`.

## Build the cadence algorithm Mike specified
`ops/cadence.py` implementing: next_check_interval = (shortest in-flight task's ESTIMATED
time-to-completion) / N, with a GLOBAL N (starts 10, because estimates are assumed ~10x off)
AND a PER-TASK N. On each check-in, read each task's progress and UPDATE N:
- If far MORE work done than expected for the elapsed fraction (e.g. divided by 10 but 1/2
  done) → RAISE N (e.g. toward 20) so we check SOONER (task is finishing fast).
- If work done ≈ elapsed fraction (e.g. divided by 10, 1/10 done) → LOWER N (toward <5) so we
  wait longer.
Define the update rule precisely (e.g. N_new = clamp(k * (work_done_fraction / elapsed_fraction))),
document the reasoning, and include a worked example matching Mike's two cases.

## Progress convention (define + document for all workers)
Standardize `~/Projects/agi-2026/<task>-progress.json` =
`{"task","pct":0-100,"step","est_total_sec","elapsed_sec","ts"}`. Write `ops/PROGRESS.md`
specifying it, and a helper `ops/check_workers.sh` that reads all `*-progress.json` +
`*-run.log` (W_DONE marker) and prints a one-line status per task plus the recommended
next-check interval from cadence.py. This is the tool a resuming instance runs first.
Test cadence.py on a couple of synthetic progress files. Report the chosen formula + examples.
