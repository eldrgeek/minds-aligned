# FACTCHECK — Hananel Hazan, Ph.D.

_Compiled 2026-07-29 from 68 OpenAlex records in `sites/hananel-hazan/papers/` + the Tufts Allen Discovery Center bio page. Publishing same-day; the subject will read it._

## 1. Verified claims

**Biography — source: https://allencenter.tufts.edu/hananel-hazan-ph-d/ (the ONLY source for all biography; the corpus contains no biographical metadata at all)**

- Interdisciplinary computer scientist at the Allen Discovery Center at Tufts University, joined 2019, in Michael Levin's lab.
- B.A. Exact Sciences (2002), Ashkelon College; M.Sc. CS (2007), University of Haifa; Ph.D. CS (2013), University of Haifa.
- Prior: postdoc at Network Biology Research Laboratories, Technion; postdoc at UMass Amherst CICS.
- Quotable, exact: his primary interest is **"understanding how biological cells interact and cooperate to achieve shared goals through modeling."**
- Led BindsNET, exact: **"a state-of-the-art framework designed for rapid constructions of rich simulations of spiking networks."**
- Built a closed-loop experimental platform for cortical neuronal network interactions at the Technion.

**Corpus-level facts**

- 68 OpenAlex records; **all 68 list him as an author** (verified by grep across every file).
- **15 of the 68 records list Michael Levin as co-author** — the largest single collaborator signal. (Fewer distinct *works*; several are preprint+journal or dataset duplicates. Do NOT publish a "distinct works with Levin" count.)
- Other recurring co-authors, verified in-record: Larry M. Manevitz (Haifa era), Hava T. Siegelmann, Róbert Kozma, Daniel J. Saunders, Devdhar Patel (UMass era), Samuel A. Neymotin, Christopher Earl.

**Papers safe to cite, titles exactly as they appear in the corpus JSON:**

| Title (verbatim) | Year | Venue (as recorded) | Author position |
|---|---|---|---|
| Topological constraints and robustness in liquid state machines | 2011 | Expert Systems with Applications | 1st (w/ Manevitz) |
| Stability and Topology in Reservoir Computing | 2010 | Lecture notes in computer science | in author list |
| Non-parametric temporal modeling of the hemodynamic response function via a liquid state machine | 2015 | Neural Networks | 2nd |
| Closed Loop Experiment Manager (CLEM)—An Open and Inexpensive Solution for Multichannel Electrophysiological Recordings and Closed Loop Experiments | 2017 | Frontiers in Neuroscience | **1st** (w/ Noam Ziv) |
| Locally connected spiking neural networks for unsupervised feature learning | 2019 | Neural Networks | 3rd |
| Improved robustness of reinforcement learning policies upon conversion to spiking neuronal network platforms applied to Atari Breakout game | 2019 | Neural Networks | 2nd |
| Memory via Temporal Delays in weightless Spiking Neural Network | 2022 | arXiv | **1st** (Hazan, Caby, Earl, Siegelmann, Levin) |
| Exploring the Behavior of Bioelectric Circuits Using Evolution Heuristic Search | 2022 | Bioelectricity | **1st, two-author paper with Michael Levin** |
| Control Flow in Active Inference Systems—Part I | 2023 | IEEE TMBMC | 5th (Fields, Fabrocini, Friston, Glazebrook, Hazan, Levin, Marcianò) |
| Control Flow in Active Inference Systems—Part II: Tensor Networks as General Models of Control Flow | 2023 | IEEE TMBMC | same author set |
| Diffusion Models are Evolutionary Algorithms | 2024 | arXiv | 3rd (Zhang, Hartl, Hazan, Levin) |
| Reservoir Computation with Networks of Differentiating Neuron Ring Oscillators | 2025 | Analytics | **last** (senior position) |
| Quantifying Misalignment Between Agents: Towards a Sociotechnical Understanding of Alignment | 2025 | AAAI | 3rd |
| Stop treating \`AGI' as the north-star goal of AI research | 2025 | arXiv | 4th of 16 |
| Training Ecosystems: A Computational Approach to Uncovering Learning Behavior in Unconventional Contexts | 2026 | arXiv | 2nd (Samanta, Hazan, Levin) |
| A Little Rank Goes a Long Way: Random Scaffolds with LoRA Adapters Are All You Need | 2026 | arXiv | **1st** (Hazan, Zhang, Hartl, Levin) |
| DeltaQ: Value-Guided Hebbian Learning in Spiking Neuronal Networks for Multi-Goal Navigation | 2026 | bioRxiv | 3rd |
| Heuristically Adaptive Diffusion-Model Evolutionary Strategy | 2026 | Advanced Science | in author list w/ Levin |
| Creating Free Will in Artificial Intelligence | 2013 | (no venue in record) | 2nd (Krausová, Hazan) |

**BindsNET, precisely:** the corpus contains a software release record, **"BindsNET/bindsnet: 0.3.4"** (2026, Zenodo, DOI `10.5281/zenodo.20695115`), on which **Hazan is listed first** among 28 contributors. Safe to state: he is the lead maintainer of the BindsNET open-source project, and the Tufts page states he led it. See §4 for what you may NOT say.

## 2. The through-line (grounded — use this as the page's spine)

Hazan's career runs one idea through three substrates. At Haifa he worked on **reservoir computing and liquid state machines** — "Topological constraints and robustness in liquid state machines" (2011), "Stability and Topology in Reservoir Computing" (2010) — where computation is a property of a network's *dynamics and topology* rather than a set of tuned weights. At UMass Amherst that became spiking-network engineering and the BindsNET toolchain ("Locally connected spiking neural networks for unsupervised feature learning," 2019). In Levin's lab the same commitment turns biological: **"Memory via Temporal Delays in weightless Spiking Neural Network"** (2022, with Levin) opens by rejecting the premise that "memory is encoded in the connection strength between neurons" and stores memory in *timing* instead; **"Exploring the Behavior of Bioelectric Circuits Using Evolution Heuristic Search"** (2022, Hazan & Levin, two authors) searches the parameter space of bioelectric circuits for patterning behavior; and **"Training Ecosystems"** (2026, with Levin) locates habituation, sensitization, and number learning in a predator-prey model, explicitly placing itself "at the intersection of ecology, basal cognition, and mathematics."

The line is still live in his newest work: **"A Little Rank Goes a Long Way"** (2026, Hazan first author, with Levin) states in its own abstract that its construction "is formally analogous to Reservoir Computing unfolded along the depth axis of a feedforward network" — a 2010 Haifa idea reappearing as a claim about frozen-backbone LLM training.

That is the story: *the same question — how much competence is already latent in a system's structure, before you train it — asked of reservoirs, then spiking networks, then cells, then ecosystems, then transformers.*

## 3. His AGI position — CONFIRMED

**Paper:** "Stop treating \`AGI' as the north-star goal of AI research" (2025, arXiv, DOI `10.48550/arxiv.2502.03689`).

**Authorship: CONFIRMED.** Listed 4th of 16 authors: Borhane Blili-Hamelin, Christopher Graziul, Leif Hancox-Li, **Hananel Hazan**, El-Mhamdi El-Mahdi, Avijit Ghosh, Katherine Heller, Metcalf Jacob, Fabrício Murai, Eryk Salvaggio, Andrew Smart, Todd Snider, Mariame Tighanimine, Talia Ringer, Margaret Mitchell, Shiri Dori-Hacohen.

**The record contains a full abstract.** Its argument, in the paper's own words: it is a **"position paper"** arguing that "focusing on the highly contested topic of \`artificial general intelligence' (\`AGI') undermines our ability to choose effective goals." It names **"six key traps — obstacles to productive goal setting — that are aggravated by AGI discourse: Illusion of Consensus, Supercharging Bad Science, Presuming Value-Neutrality, Goal Lottery, Generality Debt, and Normalized Exclusion."** Three prescriptions, quoted: the community needs to "(1) prioritize specificity in engineering and societal goals, (2) center pluralism about multiple worthwhile approaches to multiple valuable goals, and (3) foster innovation through greater inclusion of disciplines and communities."

**Framing rule — do not overreach:** he is *a co-author of* a 16-author position paper. Do NOT write "Hazan argues" or "his position is." Correct constructions: "he co-signed" / "he is one of sixteen authors of."

Related and safe: 3rd author on "Quantifying Misalignment Between Agents" (AAAI 2025), overlapping author set (Ghosh, Dori-Hacohen) — same sociotechnical-alignment community.

Also germane: 2nd author on **"Creating Free Will in Artificial Intelligence"** (2013, Krausová & Hazan), whose abstract concludes "that a mechanism of free will shall form a necessary part of AGI." That is a *2013* position and is not obviously the same as the 2025 one — if you use both, present them as dated, not as a current synthesis.

## 4. DO NOT PUBLISH — could not verify

- **The canonical BindsNET paper is NOT in this corpus.** Hazan et al., "BindsNET: A Machine Learning-Oriented Spiking Neural Networks Library in Python" (Frontiers in Neuroinformatics, 2018) does not appear in any of the 68 records. Do not cite it, its venue, year, or citation count from this corpus. Cite the Tufts sentence and/or the Zenodo 0.3.4 software record only.
- **Any job title beyond what Tufts prints.** Not "Senior Research Scientist," "Research Scientist," "Research Associate," "Principal Investigator," "Professor," "co-director," "Levin's deputy." Tufts says **"interdisciplinary computer scientist."** Use that phrase.
- **Any award, prize, grant, fellowship, or honor.** Zero evidence in either source.
- **Any publication or citation count** ("author of 68 papers," "70+ publications," h-index). The corpus contains duplicate records — preprint + journal pairs, two separate records for the same BindsNET 0.3.4 release — plus a dataset record. 68 records ≠ 68 papers.
- **His Ph.D. advisor.** Manevitz co-authors his 2010–2015 Haifa work, which makes advisorship plausible — that is *inference, not verified*. Do not print it.
- **Dates or duration of the Technion and UMass postdocs.** Tufts gives neither.
- **That he invented or originated liquid state machines or reservoir computing.** He works on them. Maass et al. originated LSMs. Do not blur this.
- **"BindsNET's journal is Open MIND."** One Zenodo record carries `"journal": "Open MIND"` — corrupt OpenAlex metadata for a software deposit. Ignore it.
- **Institutional affiliation for the two law-journal papers** (with Alžběta Krausová, The Lawyer Quarterly). His authorship is citable; his affiliation at the time is not. Do not describe him as working in law.
- **Anything about his AGI-26 talk title, abstract, session, or that he is "presenting with" Michael Levin as co-presenters.** Neither source contains conference programming. Do not print this on the page.
- **Attributing the six traps to him personally,** or implying he leads the AGI position paper. He is 4th of 16.
- **Clinical/fMRI papers as a claimed research program.** The hemisphere/ambiguous-word and Parkinson's-speech records are in the corpus and consistent with his Haifa background, but OpenAlex author disambiguation is imperfect and none are corroborated by the Tufts bio. Safe to list; do not build a narrative paragraph on them.
- **Any claim that his work "proves" cells or ecosystems are conscious/cognitive.** "Training Ecosystems" describes learning-like dynamics in a simulation and says nothing stronger. Quote the abstract or say nothing.

## Sources

- `sites/hananel-hazan/papers/*.json` (68 records)
- https://allencenter.tufts.edu/hananel-hazan-ph-d/ (sole source for all biography, degrees, prior posts, and the two direct quotes)
- Cross-reference: `~/Projects/Levinese/src/pages/collaborators.astro` and `~/Projects/Levinese/src/content/papers/10-1002-advs-202511537.json` already list Hazan on the Levin site — worth linking the two properties bidirectionally.
