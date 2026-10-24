"""Phase 40A: repack The Hall of Doors people as (a) a small packed block of named frames and (b) a regular grid of the
312 slot overlays, so MINI_ART stores a formula instead of 312 rects. Cell index:
  i = OFF[slot] + opt*12 + dir*3 + frame, dir in (down, up, left, right); cell (i % cols, i // cols) at ov.x0, ov.y0, 16 x 28.
Cells that do not exist (emblem from behind or the side) are empty."""
import json, importlib.util
from PIL import Image
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py"); mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
src = Image.open("art/people40/doors/people.png").convert("RGBA"); pj = json.load(open("art/people40/doors/people.json"))
P = pj["prects"]; piv = pj.get("pivots", {})
SLOTS = [["cloak", ["crimson", "slate", "grey"]], ["hat", ["wide", "hood"]], ["flame", ["gold", "teal", "dim"]], ["hand", ["book", "staff"]],
         ["scarf", ["gold", "rose", "green", "grey"]], ["emblem", ["star", "leaf", "wave"]], ["boots", ["brown", "black", "red", "grey"]],
         ["pack", ["satchel", "letters", "basket"]], ["hem", ["gold", "crimson", "teal", "grey"]]]
DIRS = ["down", "up", "left", "right"]
def crop(n): x, y, w, h = P[n]; return src.crop((x, y, x + w, y + h))
named = [(n, crop(n)) for n in P if not (n.startswith("ov_") and not n.endswith("idle_lantern"))]
top = "art/out40/doors/_named.png"; rects = mat.pack(named, top, width=384); T = Image.open(top)
cols = 24; cells = sum(len(o) for _, o in SLOTS) * 12; rows = (cells + cols - 1) // cols
y0 = T.height + 2; sheet = Image.new("RGBA", (384, y0 + rows * 28)); sheet.alpha_composite(T.convert("RGBA"), (0, 0))
off = {}; i = 0; missing = 0
for slot, opts in SLOTS:
    off[slot] = i
    for o in opts:
        for d in DIRS:
            for f in range(3):
                n = f"ov_{slot}_{o}_{d}_{f}"
                if n in P: sheet.alpha_composite(crop(n), ((i % cols) * 16, y0 + (i // cols) * 28))
                else: missing += 1
                i += 1
sheet.save("art/out40/doors/people.png", optimize=True)
r = json.load(open("art/out40/doors/rects.json"))
r["prects"] = rects; r["pivots"] = {k: v for k, v in piv.items() if k in rects}
r["ov"] = {"x0": 0, "y0": y0, "w": 16, "h": 28, "cols": cols, "pivot": [8, 28], "dirs": DIRS, "frames": 3,
           "slots": SLOTS, "off": off, "note": "i = off[slot] + optIndex*12 + dirIndex*3 + frame; emblem exists for down only"}
json.dump(r, open("art/out40/doors/rects.json", "w"))
print(sheet.size, "named", len(rects), "cells", i, "empty", missing)
