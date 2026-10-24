"""Phase 45A: Round Room (Sartre) art. Inputs in /home/claude/a45/round: bg-v1.png, doors-v1.png (cut/01..05), glass-v1.png.
Outputs: sprites at final px (canvas 384x640 px; 1 unit = 2 px)."""
import importlib.util, json, math, numpy as np
from PIL import Image
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py"); mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
D = "/home/claude/a45/round"; O = f"{D}/out"
import os; os.makedirs(O, exist_ok=True)
DH = 66                                   # door height in px
names = ["door_open", "door_shut", "door_grey", "mirror", "mirror_on"]
items = []
sc = DH / 456
for k, n in enumerate(names, 1):
    im = Image.open(f"{D}/cut/{k:02d}.png").convert("RGBA")
    w = int(round(im.width * sc)); h = int(round(im.height * sc))
    arr = mat.premul_resize(im, (w, h)); a = (arr[..., 3] >= .5)
    out = Image.fromarray(np.dstack([(arr[..., :3] * 255).astype(np.uint8), (a * 255).astype(np.uint8)]), "RGBA")
    out.save(f"{O}/{n}.png"); items.append((n, out))
# glass panes: 2 cols x 4 rows, cut at the lead bars, final window 152x268 (pane 76x67)
g = Image.open(f"{D}/glass-v1.png").convert("RGB"); W, H = g.size
a = np.array(g).astype(int); lum = a.sum(2)
def bars(axis, expect):
    prof = (lum.mean(axis=axis))
    res = []
    for e in expect:
        lo = int(e - 14); hi = int(e + 14); res.append(lo + int(np.argmin(prof[lo:hi])))
    return res
rows = bars(1, [H * .25, H * .5, H * .75]); cols = bars(0, [W * .5])
print("bars rows", rows, "cols", cols)
xs = [0] + cols + [W]; ys = [0] + rows + [H]
PW, PH = 76, 67
panes = []
for r in range(4):
    for c in range(2):
        p = g.crop((xs[c], ys[r], xs[c + 1], ys[r + 1])).resize((PW, PH), Image.Resampling.LANCZOS).convert("RGBA")
        n = f"pane_{r * 2 + c}"; p.save(f"{O}/{n}.png"); items.append((n, p)); panes.append(p)
rects = mat.pack(items, f"{O}/round-atlas.png", pad=1, width=1024)
print(json.dumps(rects)); print(Image.open(f"{O}/round-atlas.png").size)
json.dump({"rects": rects, "bars": {"rows": rows, "cols": cols}}, open(f"{O}/round-rects.json", "w"), indent=1)
