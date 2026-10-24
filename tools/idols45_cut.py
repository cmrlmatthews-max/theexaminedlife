"""Phase 45A: cut the Wanderer statue (Stage III of Sounding the Idols) into 6 non-overlapping pieces.
Input: raw 572x1024 magenta sheet. Output: statue.png (whole), piece_<name>.png, JSON of offsets in the whole-statue frame."""
import importlib.util, json, sys, numpy as np
from PIL import Image
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py"); mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
SRC = sys.argv[1]; OUT = sys.argv[2]; H = int(sys.argv[3]) if len(sys.argv) > 3 else 420
im = np.array(Image.open(SRC).convert("RGB"))
rgb, alpha = mat.key_alpha(im, "magenta")
a = (alpha >= .5)
ys, xs = np.nonzero(a); x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
# label map in source pixels (priority order)
Hs, Ws = a.shape; Y, X = np.mgrid[0:Hs, 0:Ws]
names = ["head", "handL", "handR", "shoulders", "chest", "base"]
lab = np.full(a.shape, 4, np.uint8)               # default chest
lab[Y >= 692] = 5                                  # base (plinth + feet)
lab[(Y < 305)] = 3                                 # shoulders (cowl)
lab[(Y < 200) & (X > 200) & (X < 360)] = 0         # head (hood)
lab[(X < 138) & (Y > 235) & (Y < 425)] = 1         # lantern hand
lab[(X > 438) & (Y < 365)] = 2                     # staff hand
whole = np.dstack([np.clip(rgb, 0, 255).astype(np.uint8), (a * 255).astype(np.uint8)])
crop = Image.fromarray(whole, "RGBA").crop((x0, y0, x1, y1)); L = Image.fromarray(lab).crop((x0, y0, x1, y1))
W = int(round(crop.width * H / crop.height))
arr = mat.premul_resize(crop, (W, H))
al = (arr[..., 3] >= .5)
res = np.dstack([(arr[..., :3] * 255).astype(np.uint8), (al * 255).astype(np.uint8)])
Image.fromarray(res, "RGBA").save(f"{OUT}/statue.png")
Ln = np.array(L.resize((W, H), Image.Resampling.NEAREST))
info = {"size": [W, H], "pieces": {}}
for i, n in enumerate(names):
    m = al & (Ln == i)
    ys2, xs2 = np.nonzero(m)
    if not len(ys2): print("EMPTY", n); continue
    bx0, bx1, by0, by1 = xs2.min(), xs2.max() + 1, ys2.min(), ys2.max() + 1
    p = np.dstack([res[..., :3], (m * 255).astype(np.uint8)])[by0:by1, bx0:bx1]
    Image.fromarray(p, "RGBA").save(f"{OUT}/piece_{n}.png")
    info["pieces"][n] = {"rect": [int(bx0), int(by0), int(bx1 - bx0), int(by1 - by0)], "px": int(m.sum())}
json.dump(info, open(f"{OUT}/statue.json", "w"), indent=1); print(json.dumps(info))
