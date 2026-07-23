#!/usr/bin/env bash
# verify-all.sh — prove every AGI-26 property actually works, live.
#
#   bash sites/_shared/host/verify-all.sh
#
# Four checks per property, all against production:
#   HTTP   page returns 200
#   HOST   the AI host widget is mounted (soma-guide.js + <slug>-host.js in the markup)
#   ASK    POST /api/ask returns a real grounded answer. Distinguishes:
#            ok     — grounded answer with passages retrieved
#            FALLBK — inference upstream down (widget wired, no answer)
#            THIN   — 200 with prose but retrieved=0 or the host pleads ignorance of its
#                     own corpus (the silent retrieval miss that used to pass as ok)
#            EMPTY  — nothing came back
#   CHIP   the soma-feedback widget is mounted
#   SOMA   the SocietyBar links to the SOMA 2026 page
#   JOIN   the SOMA-onboard affordance is mounted (JoinBar → hub /join/)
#
# ASK is the expensive one — each call spends ~10s of real inference. That is the point:
# a mounted widget that cannot answer is exactly the failure this sweep exists to catch.

set -uo pipefail

PROPS=(
  "hub|https://agi2026.netlify.app|minds-aligned-hub|Chora|What is this constellation?"
  "gary-marcus|https://agi26-gary-marcus.netlify.app|gary-marcus|Scaffold|What does the archive say about deep learning?"
  "karl-friston|https://agi26-karl-friston.netlify.app|karl-friston|Markov|What is the free energy principle?"
  "ben-goertzel|https://agi26-ben-goertzel.netlify.app|ben-goertzel|Atom|What is OpenCog?"
  "alison-gopnik|https://agi26-alison-gopnik.netlify.app|alison-gopnik|Lantern|How do children learn causal structure?"
  "anil-seth|https://agi26-anil-seth.netlify.app|anil-seth|Ember|What is controlled hallucination?"
  "christof-koch|https://agi26-christof-koch.netlify.app|christof-koch|Phi|What are the neural correlates of consciousness?"
  "david-eagleman|https://agi26-david-eagleman.netlify.app|david-eagleman|Umwelt|What is sensory substitution?"
  "david-spivak|https://agi26-david-spivak.netlify.app|david-spivak|Olog|What is an olog?"
  "chris-fields|https://agi26-chris-fields.netlify.app|chris-fields|Holo|What is a holographic screen?"
  "alexander-ororbia|https://agi26-alexander-ororbia.netlify.app|alexander-ororbia|Synapse|What is predictive coding?"
  "levinese|https://levinese-preview.netlify.app|levinese|Morph|What is bioelectricity's role in morphogenesis?"
  "joschese|https://joschese.netlify.app|joscha|Animus|What is cyber-animism?"
)

printf '%-20s %-6s %-6s %-6s %-6s %-6s %-6s  %s\n' PROPERTY HTTP HOST CHIP SOMA JOIN ASK NOTE
pass=0; fail=0

for row in "${PROPS[@]}"; do
  IFS='|' read -r slug url cfgslug host question <<< "$row"

  html=$(curl -s -m 20 "$url/")
  code=$(curl -s -o /dev/null -w '%{http_code}' -m 20 "$url/")

  grep -q "soma-guide.js" <<< "$html" && grep -q "$cfgslug-host.js" <<< "$html" && HOST=ok || HOST=MISS
  grep -q "soma-feedback" <<< "$html" && CHIP=ok || CHIP=MISS
  grep -q "soma2026" <<< "$html" && SOMA=ok || SOMA=MISS
  grep -q "join-bar__cta" <<< "$html" && JOIN=ok || JOIN=MISS

  resp=$(curl -s -m 60 -X POST "$url/api/ask" \
    -H 'Content-Type: application/json' \
    -d "{\"question\":$(printf '%s' "$question" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))'),\"persona\":\"$host\"}")

  answer=$(printf '%s' "$resp" | python3 -c '
import json, sys
try: print(((json.load(sys.stdin).get("answer") or "")[:400]).replace("\n"," "))
except Exception: print("")' 2>/dev/null)
  # The retrieval count is the tell that a "200 with prose" is actually a retrieval miss —
  # the failure mode that slipped through before: joschese returned a fluent "I don't see
  # that in the archive" with retrieved=0 while the archive held the answer, and a checker
  # that only looked at HTTP + fallback-string passed it.
  retrieved=$(printf '%s' "$resp" | python3 -c '
import json, sys
try:
    r = json.load(sys.stdin).get("retrieved")
    print("-" if r is None else r)
except Exception: print("-")' 2>/dev/null)

  if [ -z "$answer" ]; then
    ASK=EMPTY                                          # widget wired, nothing came back
  elif grep -qE "can't reach the knowledge|couldn't complete that just now" <<< "$answer"; then
    ASK=FALLBK                                         # inference upstream down
  elif [ "$retrieved" = "0" ]; then
    ASK=THIN                                           # answered, but retrieved NOTHING — retrieval miss
  elif grep -qiE "don't see|do not see|don't have (any|a )|no (relevant )?passages|not in the archive|isn't in (this|the) archive" <<< "$answer"; then
    ASK=THIN                                           # host is pleading ignorance about its own corpus
  else
    ASK=ok
  fi

  note=$(printf '%s' "$answer" | cut -c1-70)
  printf '%-20s %-6s %-6s %-6s %-6s %-6s %-6s  %s\n' "$slug" "$code" "$HOST" "$CHIP" "$SOMA" "$JOIN" "$ASK" "$note"

  if [ "$code" = "200" ] && [ "$HOST" = ok ] && [ "$CHIP" = ok ] && [ "$SOMA" = ok ] && [ "$JOIN" = ok ] && [ "$ASK" = ok ]; then
    pass=$((pass+1))
  else
    fail=$((fail+1))
  fi
done

printf '\n%d fully green, %d with a defect\n' "$pass" "$fail"
[ "$fail" -eq 0 ]
