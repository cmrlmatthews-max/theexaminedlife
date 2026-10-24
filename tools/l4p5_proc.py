"""Plan 5, Phase 43A: Level IV backdrops and sheet cuts (copy of l3p5_proc.py).
Raw art: art/raw43/*.png (Gemini downloads: 1536x2752 scenes, 1024x1024 sheets; saved as JPEG, converted by tools/raw43.sh)."""
import importlib.util, os, json, sys
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py"); mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
R = "art/raw43"; P = "art/proc43"
only = sys.argv[1:]
BGS = [f"{w}-sbg" for w in ["aquinas", "kant", "mill", "gilligan"]]
SHEETS = {f"{w}-ss": "magenta" for w in ["aquinas", "kant", "mill", "gilligan"]}
SRC = {"mill-sbg": ("mill-sbg-sq", 0), "aquinas-sbg": ("aquinas-sbg-v3", 0)}  # mill-sbg-sq: town rows y 40-292 squashed into 40-250 (corner row r5 out of the pad zone); code -> (raw stem, vshift: -1 top, 0 centre, +1 bottom)
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
for s, key in SHEETS.items():
    if only and s not in only or not os.path.exists(f"{R}/{s}.png"): continue
    outs = mat.sheet(f"{R}/{s}.png", f"art/cut43/{s}", key=key, min_area=150)
    json.dump([[int(v) for v in o[1]] for o in outs], open(f"{P}/boxes-{s}.json", "w"))
    print(s, len(outs), [o[1] for o in outs])
