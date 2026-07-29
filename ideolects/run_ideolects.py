#!/usr/bin/env python3
"""Build ideolects (corpus dictionaries) for AGI-26 speakers using grok.

Grok cannot write ~28 term files in a single turn -- it exceeds the per-turn
output budget and dies after narrating its plan, exiting 0 with nothing written.
So each thinker is built in sequential batches of BATCH terms; each batch is told
which slugs already exist so it doesn't repeat itself. Thinkers run in parallel.

Every citation is verified against the thinker's own papers.json afterwards.
"""
import json, os, pathlib, re, shutil, subprocess, sys
from concurrent.futures import ThreadPoolExecutor, as_completed

SCRATCH = pathlib.Path(__file__).resolve().parent
OUT = SCRATCH / "ideolects"
SITES = pathlib.Path.home() / "Projects/agi-2026/sites"
GROK = str(pathlib.Path.home() / ".grok/bin/grok")
LEVINESE = pathlib.Path.home() / "Projects/Levinese/src/content/terms"

BATCH = 6
BATCHES = 5           # 5 x 6 = 30 terms target
PER_BATCH_TIMEOUT = 900
THINKER_PARALLEL = 4

THINKERS = {
 "karl-friston":      ("Karl Friston", "free energy principle, active inference, predictive coding, Markov blankets, Bayesian mechanics"),
 "christof-koch":     ("Christof Koch", "consciousness, integrated information theory, neural correlates of consciousness, the claustrum"),
 "alison-gopnik":     ("Alison Gopnik", "child development, causal learning, the theory theory, explore vs exploit, the child as scientist"),
 "anil-seth":         ("Anil Seth", "consciousness, predictive perception, interoception, the beast machine, controlled hallucination"),
 "ben-goertzel":      ("Ben Goertzel", "AGI, OpenCog, Hyperon, cognitive synergy, probabilistic logic networks"),
 "gary-marcus":       ("Gary Marcus", "cognitive science, nativism, symbol manipulation, hybrid AI, critique of deep learning"),
 "david-eagleman":    ("David Eagleman", "neuroscience, sensory substitution, brain plasticity, time perception, the unconscious brain"),
 "chris-fields":      ("Chris Fields", "quantum information, cognition, observers, Markov blankets, scale-free biology"),
 "david-spivak":      ("David Spivak", "applied category theory, operads, polynomial functors, databases as categories, compositionality"),
 "alexander-ororbia": ("Alexander Ororbia", "neuromorphic computing, predictive coding networks, biologically plausible credit assignment"),
}

DENY = ["Bash(git push*)", "Bash(netlify*)", "Bash(vercel*)",
        "Bash(firebase deploy*)", "Bash(ssh*)", "Bash(sendmail*)"]

LENS = "<" + "strong" + ">{name}'s lens:" + "</" + "strong" + ">"


def prompt_for(slug, name, topics, existing, n_papers, batch_i):
    done = ", ".join(sorted(existing)) if existing else "(none yet -- this is the first batch)"
    return f"""You are building part of an "ideolect": a corpus dictionary of {name}'s
characteristic working vocabulary, defined the way {name} actually uses each term.
Subject areas: {topics}.

In the current directory is `papers.json` -- {n_papers} REAL {name} papers, each with
title, year, journal, authors, abstract, doi. This is your only citation source.

Terms already written in earlier batches (DO NOT repeat any of these):
{done}

Write EXACTLY {BATCH} NEW term files now, one file per term, named `<term-slug>.md`.
Choose terms that are genuinely central to {name}'s vocabulary and not already listed.

Each file must be exactly:

---
slug: "the-term-slug"
letter: "T"
title: "The Term"
subtitle: "one line on how THIS thinker uses it"
authored_by: "Grok (xAI) - unverified draft"
source: "Authors (YEAR) \\"Exact Title From papers.json.\\" Journal. DOI 10.xxxx/yyyy."
provenance:
  - "ideolect-draft-2026-07-28"
  - "doi-slug-with-hyphens"
related:
  - "a-related-term-slug"
tags:
  - "topic"
is_new: true
---

First paragraph: a precise plain-prose definition of the term in {name}'s usage.

Second paragraph, opening literally with {LENS.format(name=name)} -- what is
distinctive in how {name} uses it: the work it does in their framework, what it rules
out, where it departs from the standard reading of the term.

HARD RULES:
- Every `source:` must cite a paper that is really in papers.json. Copy the title,
  year, journal and DOI directly from that file. NEVER invent a DOI, title or year --
  every DOI you write will be checked against papers.json automatically.
- `letter` is the uppercase first letter of `title`.
- If you cannot ground a term in this corpus, pick a different term you can ground.
- Do not modify papers.json. Do not create any file other than the {BATCH} term files.
- Write the files one at a time. Do not try to emit them all in one giant response --
  that is what fails.

When done, print only the list of filenames you created."""


def run_batch(workdir, prompt):
    cmd = [GROK, "-p", prompt, "--output-format", "plain",
           "--permission-mode", "auto", "--cwd", str(workdir),
           "--no-subagents", "--max-turns", "60"]
    for d in DENY:
        cmd += ["--deny", d]
    try:
        subprocess.run(cmd, cwd=str(workdir), capture_output=True, text=True,
                       timeout=PER_BATCH_TIMEOUT)
    except subprocess.TimeoutExpired:
        pass


def slugs_in(workdir):
    return {p.stem for p in workdir.glob("*.md") if p.name != "INDEX.md"}


def build(slug):
    name, topics = THINKERS[slug]
    wd = OUT / slug
    wd.mkdir(parents=True, exist_ok=True)
    papers_src = SITES / slug / "src/data/papers.json"
    shutil.copy(papers_src, wd / "papers.json")
    n_papers = len(json.loads(papers_src.read_text()))

    for i in range(BATCHES):
        existing = slugs_in(wd)
        if len(existing) >= BATCH * BATCHES:
            break
        run_batch(wd, prompt_for(slug, name, topics, existing, n_papers, i))

    # ---- verify every DOI against the corpus -------------------------------
    papers = json.loads((wd / "papers.json").read_text())
    dois = {(p.get("doi") or "").lower().strip().rstrip(".") for p in papers if p.get("doi")}
    grounded = ungrounded = nociite = 0
    bad = []
    for f in sorted(wd.glob("*.md")):
        if f.name == "INDEX.md":
            continue
        found = [d.rstrip('.').lower() for d in
                 re.findall(r'10\.\d{4,9}/[^\s"\'`)\]]+', f.read_text())]
        if not found:
            nociite += 1
            bad.append((f.name, "NO CITATION"))
            continue
        if all(d in dois for d in found):
            grounded += 1
        else:
            ungrounded += 1
            for d in found:
                if d not in dois:
                    bad.append((f.name, d))
    (wd / "papers.json").unlink()      # don't ship the corpus copy
    return {"slug": slug, "name": name, "terms": len(slugs_in(wd)),
            "grounded": grounded, "ungrounded": ungrounded,
            "no_citation": nociite, "bad": bad[:8]}


def main():
    targets = sys.argv[1:] or list(THINKERS)
    OUT.mkdir(exist_ok=True)
    results = []
    with ThreadPoolExecutor(max_workers=THINKER_PARALLEL) as ex:
        futs = {ex.submit(build, s): s for s in targets}
        for fut in as_completed(futs):
            s = futs[fut]
            try:
                r = fut.result()
            except Exception as e:
                r = {"slug": s, "name": THINKERS[s][0], "terms": 0, "grounded": 0,
                     "ungrounded": 0, "no_citation": 0, "bad": [("ERROR", str(e)[:120])]}
            results.append(r)
            print(f"  done {r['slug']:20} terms={r['terms']:<3} "
                  f"grounded={r['grounded']:<3} ungrounded={r['ungrounded']:<3} "
                  f"no-cite={r['no_citation']}", flush=True)

    print("\n===== SUMMARY =====")
    tot = sum(r["terms"] for r in results)
    tg = sum(r["grounded"] for r in results)
    print(f"  thinkers: {len(results)}   terms: {tot}   fully grounded: {tg}")
    for r in sorted(results, key=lambda x: x["slug"]):
        print(f"  {r['name']:20} {r['terms']:>3} terms  {r['grounded']:>3} grounded"
              f"  {r['ungrounded']:>2} ungrounded  {r['no_citation']:>2} uncited")
        for fn, d in r["bad"]:
            print(f"       ! {fn}: {d}")
    (OUT / "_report.json").write_text(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
