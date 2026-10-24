"""Plan 5, Phase 41A: Level II backdrops, plates and sheet cuts. Mirrors tools/boss_proc.py.
Raw art: art/raw41/*.png (Gemini downloads: 1536x2752 scenes and plates, 1024x1024 sheets; saved as JPEG, converted)."""
import importlib.util, os, json, sys
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py"); mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
R = "art/raw41"; P = "art/proc41"
only = sys.argv[1:]
BGS = ["garden-bg", "epictetus-sbg-v2"] + [f"{w}-sbg" for w in ["socrates", "aristotle", "epicurus", "seneca", "epictetus", "marcus"]]
SHEETS = {"garden-s1": "green", "garden-s2": "magenta", "socrates-ss": "green", "aristotle-ss": "magenta", "epicurus-ss": "green",
          "seneca-ss": "magenta", "epictetus-ss": "magenta", "marcus-ss": "magenta"}
PLATES = ["garden-plate-v1", "garden-plate-v3"]
# approved layout redos (Oct 6, 2026): v3 backdrops; the 9:16 -> 3:5 crop takes the top (vshift -1) or the bottom (+1)
SRC = {"garden-bg": ("garden-bg", 1), "seneca-sbg": ("seneca-sbg", -1)}  # code -> (raw stem, vshift: -1 top, 0 centre, +1 bottom)
from PIL import Image
def vcrop(src, vs):
    im = Image.open(src).convert("RGB"); w, h = im.size; th = int(round(w * 5 / 3))
    y0 = {-1: 0, 0: (h - th) // 2, 1: h - th}[vs]; out = f"/tmp/_vc_{os.path.basename(src)}"
    im.crop((0, y0, w, y0 + th)).save(out); return out
for n in BGS:
    if only and n not in only or not os.path.exists(f"{R}/{n}.png"): continue
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
    outs = mat.sheet(f"{R}/{s}.png", f"art/cut41/{s}", key=key, min_area=150)
    json.dump([[int(v) for v in o[1]] for o in outs], open(f"{P}/boxes-{s}.json", "w"))
    print(s, len(outs), [o[1] for o in outs])
