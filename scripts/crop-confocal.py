# scripts/crop-confocal.py — one-shot asset prep, safe to re-run
from PIL import Image
import os

SRC = "public/img/umass-confocal.jpg"
OUT = "public/img/confocal"
ROWS = {"neg": (22, 226), "fo47": (230, 428), "t8996": (436, 640)}
COLS = {"bf": (170, 385), "rfp": (385, 590), "merge": (590, 815)}

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
