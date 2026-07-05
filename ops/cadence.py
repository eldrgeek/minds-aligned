#!/usr/bin/env python3
"""Adaptive check-in cadence for autonomous worker fleets.

next_check_interval_sec = min(remaining_sec_i) / N_effective

where N_effective comes from per-task N values (and a persisted global N).
See ops/PROGRESS.md and ops-REPORT.md for the full convention.
"""

from __future__ import annotations

import argparse
import json
import math
import sys
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
STATE_PATH = Path(__file__).resolve().parent / "cadence-state.json"

N_DEFAULT = 10.0
N_MIN = 3.0
N_MAX = 20.0
N_ON_PACE = 4.0
PACE_BAND_LOW = 0.75
PACE_BAND_HIGH = 1.33
MIN_ELAPSED_FRAC = 0.01
GLOBAL_EMA_ALPHA = 0.5


@dataclass
class TaskProgress:
    task: str
    pct: float
    step: str = ""
    est_total_sec: float = 0.0
    elapsed_sec: float = 0.0
    ts: str = ""
    path: Path = field(default_factory=Path)
    done: bool = False

    @property
    def work_done_fraction(self) -> float:
        return max(0.0, min(1.0, self.pct / 100.0))

    @property
    def elapsed_fraction(self) -> float:
        if self.est_total_sec <= 0:
            return MIN_ELAPSED_FRAC
        return max(MIN_ELAPSED_FRAC, min(1.0, self.elapsed_sec / self.est_total_sec))

    @property
    def remaining_sec(self) -> float:
        if self.done or self.pct >= 100:
            return 0.0
        if self.est_total_sec <= 0:
            return float("inf")
        by_time = max(0.0, self.est_total_sec - self.elapsed_sec)
        by_pct = max(0.0, self.est_total_sec * (1.0 - self.work_done_fraction))
        return min(by_time, by_pct)

    @classmethod
    def from_json(cls, path: Path, payload: dict[str, Any], done: bool = False) -> TaskProgress:
        return cls(
            task=str(payload.get("task", path.stem.replace("-progress", ""))),
            pct=float(payload.get("pct", 0)),
            step=str(payload.get("step", "")),
            est_total_sec=float(payload.get("est_total_sec", 0)),
            elapsed_sec=float(payload.get("elapsed_sec", 0)),
            ts=str(payload.get("ts", "")),
            path=path,
            done=done,
        )


def pace_ratio(work_done_fraction: float, elapsed_fraction: float) -> float:
    return work_done_fraction / max(elapsed_fraction, MIN_ELAPSED_FRAC)


def update_n(n_old: float, work_done_fraction: float, elapsed_fraction: float) -> float:
    """Update per-task (or global) N from observed pace.

    Rule (Mike's two cases):

      pace = work_done_fraction / elapsed_fraction

      N_proposed = n_old * pace

    When pace ≈ 1 the estimate is trustworthy, so we damp toward N_ON_PACE (<5)
    instead of holding N at the initial ~10x-off assumption.

      if PACE_BAND_LOW <= pace <= PACE_BAND_HIGH:
          N_proposed = min(n_old, N_ON_PACE)

      N_new = clamp(N_MIN, N_MAX, N_proposed)

    Higher N → shorter interval → check sooner.
    Lower N → longer interval → wait longer.

    Worked example (n_old = 10, elapsed_fraction = 0.1):

      Ahead:  work_done = 0.5 → pace = 5  → N = clamp(50) = 20 (check soon)
      On pace: work_done = 0.1 → pace = 1  → N = min(10, 4) = 4 (wait longer)
    """
    pace = pace_ratio(work_done_fraction, elapsed_fraction)
    n_proposed = n_old * pace
    if PACE_BAND_LOW <= pace <= PACE_BAND_HIGH:
        n_proposed = min(n_old, N_ON_PACE)
    return max(N_MIN, min(N_MAX, n_proposed))


def load_state() -> dict[str, Any]:
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text())
    return {"global_n": N_DEFAULT, "task_n": {}, "updated_at": None}


def save_state(state: dict[str, Any]) -> None:
    state["updated_at"] = datetime.now(timezone.utc).isoformat()
    STATE_PATH.write_text(json.dumps(state, indent=2) + "\n")


def run_log_done(run_log: Path) -> bool:
    if not run_log.exists():
        return False
    try:
        text = run_log.read_text(errors="replace")
    except OSError:
        return False
    return "W_DONE" in text


def discover_tasks(repo_root: Path = REPO_ROOT) -> list[TaskProgress]:
    tasks: list[TaskProgress] = []
    for path in sorted(repo_root.glob("*-progress.json")):
        try:
            payload = json.loads(path.read_text())
        except (OSError, json.JSONDecodeError):
            continue
        task_name = str(payload.get("task", path.stem.replace("-progress", "")))
        run_log = repo_root / f"{task_name}-run.log"
        done = run_log_done(run_log)
        tasks.append(TaskProgress.from_json(path, payload, done=done))
    return tasks


def apply_checkin(tasks: list[TaskProgress], state: dict[str, Any] | None = None) -> dict[str, Any]:
    state = dict(state or load_state())
    task_n: dict[str, float] = {k: float(v) for k, v in state.get("task_n", {}).items()}
    global_n = float(state.get("global_n", N_DEFAULT))

    inflight = [t for t in tasks if not t.done and t.remaining_sec > 0 and t.remaining_sec != float("inf")]

    updated_ns: list[float] = []
    per_task: dict[str, dict[str, Any]] = {}

    for task in inflight:
        n_old = task_n.get(task.task, global_n)
        n_new = update_n(n_old, task.work_done_fraction, task.elapsed_fraction)
        task_n[task.task] = n_new
        updated_ns.append(n_new)
        per_task[task.task] = {
            "n_old": round(n_old, 2),
            "n_new": round(n_new, 2),
            "pace": round(pace_ratio(task.work_done_fraction, task.elapsed_fraction), 3),
            "remaining_sec": round(task.remaining_sec, 1),
            "interval_sec": round(task.remaining_sec / n_new, 1) if n_new > 0 else None,
        }

    if updated_ns:
        mean_n = sum(updated_ns) / len(updated_ns)
        global_n = (1.0 - GLOBAL_EMA_ALPHA) * global_n + GLOBAL_EMA_ALPHA * mean_n
        global_n = max(N_MIN, min(N_MAX, global_n))

    state["global_n"] = round(global_n, 3)
    state["task_n"] = {k: round(v, 3) for k, v in task_n.items()}

    intervals = [
        t.remaining_sec / task_n.get(t.task, global_n)
        for t in inflight
        if task_n.get(t.task, global_n) > 0
    ]
    next_interval = min(intervals) if intervals else None

    return {
        "state": state,
        "inflight": [t.task for t in inflight],
        "per_task": per_task,
        "next_check_interval_sec": round(next_interval, 1) if next_interval is not None else None,
        "global_n": round(global_n, 2),
    }


def format_duration(sec: float | None) -> str:
    if sec is None:
        return "—"
    if sec < 60:
        return f"{sec:.0f}s"
    if sec < 3600:
        return f"{sec / 60:.1f}m"
    return f"{sec / 3600:.1f}h"


def status_line(task: TaskProgress, per_task: dict[str, Any] | None = None) -> str:
    status = "DONE" if task.done or task.pct >= 100 else "RUN"
    step = task.step[:60] + ("…" if len(task.step) > 60 else "")
    extra = ""
    if per_task and task.task in per_task:
        info = per_task[task.task]
        extra = f" N={info['n_new']:.1f} pace={info['pace']:.2f} rem={format_duration(info['remaining_sec'])}"
    return f"{task.task:12} {status:4} {task.pct:5.1f}% {step}{extra}"


def run_self_test() -> int:
    """Synthetic cases matching Mike's two examples."""
    cases = [
        {
            "name": "ahead (1/2 done at 1/10 elapsed)",
            "n_old": 10.0,
            "work_done": 0.5,
            "elapsed": 0.1,
            "expect_n": 20.0,
        },
        {
            "name": "on pace (1/10 done at 1/10 elapsed)",
            "n_old": 10.0,
            "work_done": 0.1,
            "elapsed": 0.1,
            "expect_n": 4.0,
        },
    ]
    failures = 0
    for case in cases:
        got = update_n(case["n_old"], case["work_done"], case["elapsed"])
        ok = abs(got - case["expect_n"]) < 0.01
        print(f"{'PASS' if ok else 'FAIL'} {case['name']}: N {case['n_old']} -> {got} (expect {case['expect_n']})")
        if not ok:
            failures += 1

    fixture_a = Path(__file__).parent / "fixtures" / "fast-task-progress.json"
    fixture_b = Path(__file__).parent / "fixtures" / "steady-task-progress.json"
    tasks = [
        TaskProgress.from_json(fixture_a, json.loads(fixture_a.read_text())),
        TaskProgress.from_json(fixture_b, json.loads(fixture_b.read_text())),
    ]
    result = apply_checkin(tasks, {"global_n": N_DEFAULT, "task_n": {}})
    print(f"\nFixture check-in: next_interval={result['next_check_interval_sec']}s global_N={result['global_n']}")
    for task in tasks:
        print(status_line(task, result["per_task"]))
    return failures


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Adaptive worker check-in cadence")
    parser.add_argument("--repo", type=Path, default=REPO_ROOT, help="Repository root")
    parser.add_argument("--test", action="store_true", help="Run built-in synthetic tests")
    parser.add_argument("--no-save", action="store_true", help="Do not persist cadence state")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON")
    args = parser.parse_args(argv)

    if args.test:
        return run_self_test()

    tasks = discover_tasks(args.repo)
    state = load_state()
    result = apply_checkin(tasks, state)

    if not args.no_save:
        save_state(result["state"])

    if args.json:
        print(json.dumps(result, indent=2))
        return 0

    print(f"global_N={result['global_n']}  next_check={format_duration(result['next_check_interval_sec'])}")
    for task in tasks:
        print(status_line(task, result["per_task"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())