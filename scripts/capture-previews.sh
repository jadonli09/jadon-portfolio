#!/usr/bin/env bash
# Retake the menu's hover previews (public/img/previews/<id>.jpg, 1280×800)
# from a running server. Usage: scripts/capture-previews.sh [base-url] [only-id]
#   e.g. scripts/capture-previews.sh http://localhost:4173 lockedin
set -euo pipefail
BASE="${1:-http://localhost:3000}"
ONLY="${2:-}"
B="$HOME/.claude/skills/gstack/browse/dist/browse"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/img/previews"
TMP="$(mktemp -d /tmp/previews.XXXX)"
"$B" viewport 1280x800 >/dev/null
# Mark the intro as seen and open every lock (keys from src/lib/gate.ts) so
# neither the preloader nor a gate covers the shot.
"$B" goto "$BASE/" >/dev/null
"$B" js "sessionStorage.setItem('jl_intro','1'); ['jl_unlocked','jl_unlocked_tks'].forEach(k => localStorage.setItem(k,'1'))" >/dev/null
for pair in about:/about leadership:/leadership civic:/civic research:/research built:/built court:/court lockedin:/locked-in; do
  id="${pair%%:*}"; path="${pair#*:}"
  if [ -n "$ONLY" ] && [ "$ONLY" != "$id" ]; then continue; fi
  "$B" goto "$BASE$path" >/dev/null
  sleep 7
  "$B" screenshot --viewport "$TMP/$id.png" >/dev/null
  python3 -c "from PIL import Image; Image.open('$TMP/$id.png').convert('RGB').resize((1280,800)).save('$OUT/$id.jpg', quality=82, optimize=True)"
  echo "captured $id"
done
