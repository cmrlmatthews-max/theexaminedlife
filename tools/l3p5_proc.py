"""Plan 5, Phase 42A: Level III backdrops, plates and sheet cuts. Mirrors tools/boss_proc.py.
Raw art: art/raw42/*.png (Gemini downloads: 1536x2752 scenes and plates, 1024x1024 sheets; saved as JPEG, converted)."""
import importlib.util, os, json, sys
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py"); mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
R = "art/raw42"; P = "art/proc42"
only = sys.argv[1:]
BGS = ["shared-bg", "shared-bg2"] + [f"{w}-sbg" for w in ["buddha", "laozi", "zhuangzi", "confucius", "dogen"]]
SHEETS = {"shared-s1": "magenta", "shared-s2": "green", "buddha-ss": "magenta", "laozi-ss": "magenta", "zhuangzi-ss": "magenta", "confucius-ss": "magenta", "dogen-ss": "magenta", "laozi-ss2": "magenta", "buddha-ss2": "magenta", "dogen-ss2": "magenta"}
PLATES = ["shared-plate"]
# shared-bg2-v2c = shared-bg2-v2 with a band of plain wall (24-36%) removed and the floor stretched (altar top raised to ~31%)
# the 9:16 -> 3:5 crop takes the top (vshift -1) or the bottom (+1)
SRC = {"shared-bg2": ("shared-bg2-v2c", 0), "dogen-sbg": ("dogen-sbg-v3", 0), "confucius-sbg": ("confucius-sbg-v2", 0)}  # code -> (raw stem, vshift: -1 top, 0 centre, +1 bottom)
from PIL import Image
def vcrop(src, vs):
    im = Image.open(src).convert("RGB"); w, h = im.size; th = int(round(w * 5 / 3))
    y0 = {-1: 0, 0: (h - th) // 2, 1: h - th}[vs]; out = f"/tmp/_vc_{os.path.basename(src)}"
    im.crop((0, y0, w, y0 + th)).save(out); return out
for n in BGS:
    stem = SRC.get(n, (n, 0))[0]
    if only and n not in only or not os.path.exists(f"{R}/{stem}.png"): continue
    src = f"{R}/{n}.png"
    if n in SRC: src = vcrop(f"{R}/{SRC[n][0]}.png", SRC[n][1])
    im = mat.bg(src, f"{P}/bg/{n}.png")
    im.save(f"{P}/bg/{n}.webp", quality=92)
    mat.grid(f"{P}/bg/{n}.png", f"{P}/grid/{n}.png", step=16)
    print(n, im.size)
for n in PLATES:
    if only and n not in only or not os.path.exists(f"{R}/{n}.png"): continue
    im = mat.plate(f"{R}/{n}.png", f"{P}/plate/{n}.jpg"); im.save(f"{P}/plate/{n}.webp", quality=82); print(n, im.size)
for s, key in SHEETS.items():
    if only and s not in only or not os.path.exists(f"{R}/{s}.png"): continue
    outs = mat.sheet(f"{R}/{s}.png", f"art/cut42/{s}", key=key, min_area=150)
    json.dump([[int(v) for v in o[1]] for o in outs], open(f"{P}/boxes-{s}.json", "w"))
    print(s, len(outs), [o[1] for o in outs])
