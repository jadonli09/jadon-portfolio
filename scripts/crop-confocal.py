# scripts/crop-confocal.py — one-shot asset prep, safe to re-run
from PIL import Image
import os

SRC = "public/img/umass-confocal.jpg"
OUT = "public/img/confocal"
# Verified by gutter detection + visual contact sheet. Panels are butted with no
# gutters: content spans x 5-800 as three uniform 210px columns. Cells are inset
# 1-2px so no neighbouring column or page frame bleeds in.
ROWS = {"neg": (21, 227), "fo47": (229, 434), "t8996": (436, 641)}
COLS = {"bf": (171, 379), "rfp": (381, 589), "merge": (591, 799)}

os.makedirs(OUT, exist_ok=True)
im = Image.open(SRC).convert("RGB")
assert im.size == (828, 643), f"unexpected source size {im.size}"

for rk, (y0, y1) in ROWS.items():
    for ck, (x0, x1) in COLS.items():
        w = 700
        h = round(w * (y1 - y0) / (x1 - x0))
        panel = im.crop((x0, y0, x1, y1)).resize((w, h), Image.LANCZOS)
        path = f"{OUT}/{rk}-{ck}.jpg"
        panel.save(path, "JPEG", quality=82, optimize=True, progressive=True)
        print(f"{path}  {w}x{h}  {os.path.getsize(path) // 1024} KB")
