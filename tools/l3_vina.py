"""Tune the Lute: the vina, turned horizontal, with its three left-hand pegs cut out as rig parts.
Source: art/cut3/lute-s1/01.png (881 x 1700 cutout, the neck rising up-right). The fourth peg Gemini drew on the
right side of the neck is erased (the brief asked for three; the game has three strings)."""
import json, math, importlib.util
import numpy as np
from PIL import Image
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py"); mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
src = np.array(Image.open("art/cut3/lute-s1/01.png").convert("RGBA"))
H, W = src.shape[:2]
yy, xx = np.mgrid[0:H, 0:W]
solid = src[..., 3] > 0
# erase the fourth (right-hand) peg
right = (xx > 652) & (yy >= 246) & (yy <= 334)
src[right] = 0
neck_left = lambda y: 560 - (y - 210) * 0.28
pegs = {"peg0": (455, 160, 250, (566, 210)), "peg1": (408, 280, 365, (531, 325)), "peg2": (375, 420, 505, (492, 460))}
layers = {}
body = src.copy()
for n, (x0, y0, y1, piv) in pegs.items():
    m = (xx >= x0) & (yy >= y0) & (yy <= y1) & (xx < neck_left(yy) + 3) & (src[..., 3] > 0)
    a = np.zeros_like(src); a[m] = src[m]; layers[n] = a; body[m] = 0
layers["vina"] = body
# string anchors (nut -> bridge) and peg pivots, in source pixels
nut_c, br_c = np.array([550., 380.]), np.array([232., 1430.])
axis = (nut_c - br_c) / np.linalg.norm(nut_c - br_c); perp = np.array([-axis[1], axis[0]])
if perp[0] < 0: perp = -perp
strings = [[(nut_c + perp * o).tolist(), (br_c + perp * ob).tolist()] for o, ob in ((-30, -55), (0, 0), (30, 55))]
phi = math.atan2(-axis[1], axis[0])  # angle above +x; rotate clockwise by this
deg = math.degrees(phi)
def rot(img):
    return Image.fromarray(img, "RGBA").rotate(-deg, resample=Image.Resampling.BICUBIC, expand=True)
R = {n: rot(a) for n, a in layers.items()}
W2, H2 = R["vina"].size
c0, c1 = np.array([W / 2, H / 2]), np.array([W2 / 2, H2 / 2])
cs, sn = math.cos(phi), math.sin(phi)
def tp(p):
    d = np.array(p) - c0
    return np.array([d[0] * cs - d[1] * sn, d[0] * sn + d[1] * cs]) + c1
# union bbox, then scale so the whole instrument is 300 px wide
union = Image.new("RGBA", (W2, H2)); [union.alpha_composite(im) for im in R.values()]
bb = union.getbbox(); s = 300 / (bb[2] - bb[0]); Hf = int(round((bb[3] - bb[1]) * s))
out = {}
for n, im in R.items():
    arr = mat.premul_resize(im.crop(bb), (300, Hf))
    a = (arr[..., 3] >= .5).astype(np.uint8)
    out[n] = Image.fromarray(np.dstack([(arr[..., :3] * 255).astype(np.uint8), a * 255]), "RGBA")
def fp(p):
    q = tp(p); return [round((q[0] - bb[0]) * s, 1), round((q[1] - bb[1]) * s, 1)]
geo = {"size": [300, Hf], "rotated_deg_clockwise": round(deg, 1), "pegs": {}, "strings": []}
pieces = {"vina": out["vina"]}
for n, (x0, y0, y1, piv) in pegs.items():
    pbb = out[n].getbbox(); pieces[n] = out[n].crop(pbb)
    P = fp(piv)
    geo["pegs"][n] = {"at": [pbb[0], pbb[1]], "size": [pbb[2] - pbb[0], pbb[3] - pbb[1]], "pivot": [round(P[0] - pbb[0], 1), round(P[1] - pbb[1], 1)]}
geo["strings"] = [[fp(a), fp(b)] for a, b in strings]
json.dump(geo, open("art/out3/lute_vina.json", "w"), indent=1)
for n, im in pieces.items(): im.save(f"art/out3/lute/_{n}.png")
print(json.dumps(geo))
