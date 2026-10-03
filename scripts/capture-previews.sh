#!/usr/bin/env bash
# Retake the menu's hover previews (public/img/previews/<id>.jpg, 1280×800)
# from a running dev server. Usage: scripts/capture-previews.sh [base-url]
set -euo pipefail
BASE="${1:-http://localhost:3000}"
B="$HOME/.claude/skills/gstack/browse/dist/browse"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/img/previews"
TMP="$(mktemp -d /tmp/previews.XXXX)"
"$B" viewport 1280x800 >/dev/null
# Mark the intro as seen so the preloader never covers the shot.
"$B" goto "$BASE/" >/dev/null
"$B" js "sessionStorage.setItem('jl_intro','1')" >/dev/null
for pair in about:/about leadership:/leadership civic:/civic research:/research built:/built court:/court lockedin:/locked-in; do
  id="${pair%%:*}"; path="${pair#*:}"
  "$B" goto "$BASE$path" >/dev/null
  sleep 7
  "$B" screenshot --viewport "$TMP/$id.png" >/dev/null
  python3 -c "from PIL import Image; Image.open('$TMP/$id.png').convert('RGB').resize((1280,800)).save('$OUT/$id.jpg', quality=82, optimize=True)"
  echo "captured $id"
done
