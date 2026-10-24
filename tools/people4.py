#!/usr/bin/env python3
"""Level IV people (plan 4, Phase 34A, rule A8): map-scale sprites in the style of the game's SPRITES and
tools/people.py. Adds limbs drawn as 2-pixel sleeves with a dark outline (for throws, reaches, shoves, torches
and pointing), Victorian hats, head-and-shoulders busts for The Web's windows, and the 12 x 18 townsfolk for
If Everyone Did It (rebuilt from the game's 8 x 12 figures)."""
import numpy as np
from PIL import Image
import people as P

OUT = P.OUT
GOLD, GOLD2 = (245, 198, 106), (217, 169, 58)

def arr(img): return np.array(img.convert("RGBA")).copy()
def img(a): return Image.fromarray(a.astype(np.uint8), "RGBA")

def pad(a, l=0, r=0, t=0, b=0):
    h, w = a.shape[:2]
    out = np.zeros((h + t + b, w + l + r, 4), np.uint8)
    out[t:t + h, l:l + w] = a
    return out

def put(a, x, y, c):
    if 0 <= y < a.shape[0] and 0 <= x < a.shape[1]:
        a[y, x] = list(c[:3]) + [255]

def limb(a, pts, cloth, skin, hand=True):
    """a 2-pixel-wide sleeve along the polyline pts (in a's pixel coords), the last 2x2 block skin, outlined
    only where it borders empty pixels (so it never cuts into the body)."""
    m = np.zeros(a.shape[:2], bool); hand_m = np.zeros_like(m)
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        n = max(abs(x1 - x0), abs(y1 - y0), 1)
        for k in range(n + 1):
            x = round(x0 + (x1 - x0) * k / n); y = round(y0 + (y1 - y0) * k / n)
            m[max(0, y):y + 2, max(0, x):x + 2] = True
    if hand:
        hx, hy = pts[-1]; hand_m[max(0, hy):hy + 2, max(0, hx):hx + 2] = True
    empty = a[..., 3] == 0
    ring = np.zeros_like(m)
    p = np.pad(m, 1)
    ring |= p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]
    ring &= ~m & empty
    a[ring] = list(OUT) + [255]
    a[m] = list(cloth) + [255]
    a[m & hand_m] = list(skin) + [255]
    return a

def hide_hand(a, side, cloth):
    """the resting hand at the hip becomes sleeve when that arm is raised (P.person's hand row is 18)"""
    x = 2 if side == 0 else 13
    if a[18, x, 3]: a[18, x] = list(cloth) + [255]
    return a

def kw_cols(kw):
    sk = P.SKIN[kw.get("skin", "light")]
    return kw.get("cloth", (90, 60, 110)), sk[0]

# ---------- hats on a 16-wide P.person (head rows 0..9) ----------
def tophat(a, col=(34, 30, 40), band=(120, 40, 40), tall=5):
    a = pad(a, t=tall)
    for y in range(0, tall + 2):
        for x in range(5, 11):
            a[y, x] = list(col if y else OUT) + [255]
        a[y, 4] = list(OUT) + [255]; a[y, 11] = list(OUT) + [255]
    for x in range(3, 13):                         # the brim
        a[tall + 1, x] = list(col) + [255]; a[tall + 2, x] = list(OUT) + [255]
    a[tall + 1, 3] = list(OUT) + [255]; a[tall + 1, 12] = list(OUT) + [255]
    for x in range(5, 11): a[tall, x] = list(band) + [255]
    for y in range(1, tall): a[y, 6] = list(tuple(min(255, v + 30) for v in col)) + [255]
    return a

def bowler(a, col=(40, 32, 30)):
    a = pad(a, t=2)
    for y, (x0, x1) in enumerate([(5, 11), (4, 12), (4, 12), (3, 13)]):
        for x in range(x0, x1): a[y, x] = list(col) + [255]
        a[y, x0 - 1] = list(OUT) + [255]; a[y, x1] = list(OUT) + [255]
    for x in range(4, 12): a[0, x] = list(OUT) + [255]
    a[1, 6] = list(tuple(v + 30 for v in col)) + [255]
    return a

def brows(a, dy=0):
    """angry brows and a set mouth on a standard P.person head"""
    for (x, y) in ((5, 5), (6, 5), (9, 5), (10, 5)):
        if a[y + dy, x, 3]: a[y + dy, x] = list(OUT) + [255]
    for x in (7, 8):
        a[8 + dy, x] = list(OUT) + [255]
    return a

def torch(a, hx, hy, frame):
    """a torch held in the hand at (hx, hy): a stick down from the hand and a flickering flame above"""
    for y in range(hy - 1, hy + 4): put(a, hx, y, (110, 74, 44))
    fl = [(0, -2, (255, 238, 170)), (0, -3, (255, 196, 92)), (-1, -3, (240, 120, 40)), (1, -3, (255, 196, 92)),
          (0, -4, (240, 120, 40)), (-1 if frame else 1, -5, (240, 120, 40)), (0, -5, (255, 196, 92)) if frame else (0, -5, (200, 70, 30))]
    for dx, dy, c in fl: put(a, hx + dx, hy + dy, c)
    return a

# ---------- 12 x 18 townsfolk (If Everyone Did It) ----------
TOWN = [
    "....AAAA....",
    "...AhhhhA...",
    "..AhhhhhhA..",
    "..AhSSSShA..",
    "..ASESSESA..",
    "..ASSSSSsA..",
    "...AsSSsA...",
    "..AAmCCmAA..",
    ".AmJmmmmmdA.",
    "AmmJmmmmmddA",
    "AsmJmmmmmdsA",
    "AAmJmmmmmdAA",
    ".AmJmmmmmdA.",
    ".AmdmmmmddA.",
    ".AmmddmmddA.",
    "..AAAAAAAA..",
    "...AKA.AKA..",
    "...AKA.AKA..",
]
def town(coat, skin, hat=None, hair=(58, 36, 24), frame=0, apron=False, me=False):
    """one townsperson, 12 x 18 (plus a hat), walk frame 0 or 1 (legs and arms swing)"""
    g = [list(r) for r in TOWN]
    if frame:
        g[16] = list("..AKA..AKA..")
        g[17] = list("..AA....AKA.")
        g[10] = list("AmmJmmmmmdsA"); g[11] = list("AsmJmmmmmdAA")
    if apron:
        for y in range(9, 15):
            for x in range(4, 8):
                if g[y][x] in "md": g[y][x] = "C"
    sk = tuple(int(skin[i:i + 2], 16) for i in (1, 3, 5)) if isinstance(skin, str) else skin
    co = tuple(int(coat[i:i + 2], 16) for i in (1, 3, 5)) if isinstance(coat, str) else coat
    pal = {"A": OUT, "E": P.EYE, "K": P.FEET, "S": sk, "s": P.shade(sk, .8), "h": hair, "m": co, "d": P.shade(co, .65),
           "J": P.shade(co, 1.3), "C": (236, 230, 218)}
    if me:   # the Wanderer: a teal hood with glowing eyes, no face
        pal.update({"h": (47, 116, 112), "S": (12, 20, 24), "s": (12, 20, 24), "E": (255, 214, 140), "m": (47, 116, 112),
                    "d": (31, 79, 76), "J": (84, 156, 146), "C": (47, 116, 112)})
        g[0] = list("....AAAA...."); g[3] = list("..AhSSSShA..")
        for y in (3, 4, 5): g[y][2] = "A"; g[y][3] = "h"; g[y][8] = "h"; g[y][9] = "A"
        g[6] = list("..AhhhhhhA..")
    a = np.zeros((18, 12, 4), np.uint8)
    for y, row in enumerate(g):
        for x, ch in enumerate(row):
            if ch == ".": continue
            a[y, x] = list(pal[ch]) + [255]
    if hat is None or me:
        return img(a)
    hc = tuple(int(hat[i:i + 2], 16) for i in (1, 3, 5)) if isinstance(hat, str) else hat
    if hat == "#B8A8C8" or hat == (184, 168, 200):   # a bonnet
        a = pad(a, t=1)
        for y, (x0, x1) in enumerate([(3, 9), (2, 10), (1, 11), (1, 3)]):
            for x in range(x0, x1): a[y, x] = list(hc) + [255]
        a[3, 9] = list(hc) + [255]; a[4, 9] = list(hc) + [255]
        a[0, 2] = list(OUT) + [255]; a[0, 9] = list(OUT) + [255]
        return img(a)
    a = pad(a, t=3)   # a tall hat or cap
    for y in range(0, 4):
        for x in range(3, 9): a[y, x] = list(hc if y else OUT) + [255]
        a[y, 2] = list(OUT) + [255]; a[y, 9] = list(OUT) + [255]
    for x in range(1, 11): a[4, x] = list(hc) + [255]
    a[4, 0] = list(OUT) + [255]; a[4, 11] = list(OUT) + [255]
    a[2, 4] = list(P.shade(hc, 1.4)) + [255]
    return img(a)

# ---------- busts for The Web's windows (head and shoulders) ----------
def bust(full, rows=15):
    a = arr(full); a = a[:rows].copy()
    # close the bottom with a sill-coloured outline so the bust sits in a window
    a[rows - 1][a[rows - 1, :, 3] > 0] = list(OUT) + [255]
    return img(a)
