#!/usr/bin/env bash
# deploy-all.sh — build and ship every AGI-26 property.
#
#   bash sites/_shared/host/deploy-all.sh            # everything
#   bash sites/_shared/host/deploy-all.sh gary-marcus karl-friston
#
# These sites are NOT git-connected on Netlify (`repo=None` in `netlify sites:list`),
# so a push does not deploy them — this script is the deploy lane. Two traps it exists
# to avoid, both of which cost real time on 2026-07-22:
#
#   1. `--dir dist` is resolved against the GIT ROOT, not the cwd. Always pass an
#      absolute path, or the deploy dies with "deploy directory has not been found".
#   2. Without `--no-build`, the CLI walks up to the monorepo netlify.toml and tries to
#      build the hub instead. Every site now carries its own netlify.toml, but keep the
#      flag — we build explicitly above.
#
# Levinese and Joscha ARE git-connected (eldrgeek/levinese, eldrgeek/joschese). We CLI
# deploy them for immediacy; their host files must also be committed, or the next push
# rebuilds them without an AI host.

set -uo pipefail
cd "$(dirname "$0")/../../.." || exit 1
ROOT="$PWD"

# slug | netlify site id | npm workspace | site dir
SITES=(
  "hub|8899e138-cbb4-49ab-aa17-4f3e7264f5e5|hub|$ROOT/hub"
  "gary-marcus|155a6987-ae0f-4552-a790-ae728fede52c|gary-marcus|$ROOT/sites/gary-marcus"
  "karl-friston|6d43c945-2d7c-4619-9ce1-c589245f5e1d|@soma/karl-friston|$ROOT/sites/karl-friston"
  "ben-goertzel|87dd3dfc-f492-4498-a492-fcd8ab82e2d9|@soma/ben-goertzel|$ROOT/sites/ben-goertzel"
  "alison-gopnik|5f036c06-aba1-4fca-935a-85a6efa41e2f|alison-gopnik|$ROOT/sites/alison-gopnik"
  "anil-seth|d9c27c32-f9c7-4cf1-abb3-104caccb1be5|anil-seth|$ROOT/sites/anil-seth"
  "christof-koch|57afd1aa-b249-4159-be9b-b411a754dd73|christof-koch|$ROOT/sites/christof-koch"
  "david-eagleman|118a7115-e242-4f95-9c73-65bb39b8a546|david-eagleman|$ROOT/sites/david-eagleman"
  "david-spivak|9c4a2a7f-dedd-4e00-9dd0-471f9e92ba36|david-spivak|$ROOT/sites/david-spivak"
  "chris-fields|a8447ec3-b842-4a17-99b3-1e622edbad57|chris-fields|$ROOT/sites/chris-fields"
  "alexander-ororbia|f64adb2f-1381-4fd6-9945-0a909c3ab2de|alexander-ororbia|$ROOT/sites/alexander-ororbia"
  "levinese|2ab17854-9e22-436b-b916-9f78d1335a54|-|$HOME/Projects/Levinese"
  "joschese|e8b5868e-4dc2-4993-822e-dd97a9c09ac6|-|$HOME/Projects/Joscha"
)

WANT=("$@")
want() {
  [ ${#WANT[@]} -eq 0 ] && return 0
  for w in "${WANT[@]}"; do [ "$w" = "$1" ] && return 0; done
  return 1
}

ok=0; fail=0
for row in "${SITES[@]}"; do
  IFS='|' read -r slug site ws dir <<< "$row"
  want "$slug" || continue

  printf '\n=== %s ===\n' "$slug"

  if [ "$ws" = "-" ]; then
    ( cd "$dir" && npm run build ) > "/tmp/deploy-$slug.log" 2>&1
  else
    ( cd "$ROOT" && npm run build --workspace="$ws" ) > "/tmp/deploy-$slug.log" 2>&1
  fi
  if [ $? -ne 0 ]; then
    echo "BUILD FAILED — see /tmp/deploy-$slug.log"; tail -5 "/tmp/deploy-$slug.log"; fail=$((fail+1)); continue
  fi

  # Every property, hub included, deploys from its OWN directory. Deploying the hub from
  # the repo root silently skipped its edge function — a root [[edge_functions]] block is
  # not discovered on a `--filter hub` deploy, and the ask endpoint 404'd in production
  # while the deploy reported success. The function has to live under the directory the
  # deploy runs from, which is why hub/netlify/ exists.
  ( cd "$dir" && netlify deploy --prod --no-build --dir "$dir/dist" --site "$site" ) \
    >> "/tmp/deploy-$slug.log" 2>&1

  if [ $? -eq 0 ]; then
    echo "deployed"; ok=$((ok+1))
  else
    echo "DEPLOY FAILED — see /tmp/deploy-$slug.log"; tail -8 "/tmp/deploy-$slug.log"; fail=$((fail+1))
  fi
done

printf '\n%d deployed, %d failed\n' "$ok" "$fail"
