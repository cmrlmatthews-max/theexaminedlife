#!/usr/bin/env python3
"""Phase 40A, agent A, group `doors` (The Hall of Doors, Sartre).

Builds, deterministically, from the Wanderer frames in the characters atlas:
  * 12 pale base frames  pale_{down,up,left,right}_{0,1,2}   (canvas 16 x 28, figure at the bottom, rows 4..27)
  * 4 idle poses         pale_idle_{wave,heart,lantern,down}
  * ~310 overlays        ov_<slot>_<option>_<dir>_<frame>    (same 16 x 28 canvas, transparent, aligned to the base)
  * companions           comp_bird_0/1, comp_cat_0/1, comp_moth_0/1
  * sartre_glint         (16 x 24, sartre_0 with a glint on the spectacles)
Output: art/people40/doors/{people.png,people.json,_review.png}.
Region masks are read from the BASE frame by colour (body tones, head tones, feet tones, lantern glow pixels), so every
overlay lines up with the frame it belongs to by construction.
"""
import sys, os, json, importlib.util
import numpy as np
from PIL import Image, ImageDraw

ROOT = "/home/claude/el"
os.chdir(ROOT)
sys.path.insert(0, "tools")
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py")
mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)

OUTDIR = "art/people40/doors"
os.makedirs(OUTDIR, exist_ok=True)

# ---------------------------------------------------------------- atlas
s = open("work/index.html").read(); i = s.find("ATLAS.chars=") + 12; j = s.find(";", i)
RECTS = json.loads(s[i:j])["rects"]
ATLAS = Image.open("blobs/1092ba9bca54f8ddf104f6d02f4310e8.png").convert("RGBA")

def atlas_frame(n):
    x, y, w, h = RECTS[n]
    return np.array(ATLAS.crop((x, y, x + w, y + h)))

W, H, OY = 16, 28, 4          # canvas; the 24-row figure sits at rows 4..27
PIVOT = [8, 28]

# ---------------------------------------------------------------- palette
OUT = (24, 18, 30)
FILL, HI, SH = (232, 224, 208), (244, 238, 226), (200, 192, 178)           # pale cloak tones
HEAD, HEADHI, HEADSH, EAR = (240, 232, 218), (250, 246, 238), (212, 204, 190), (190, 182, 168)
EYE = (36, 22, 18)
FOOT, FOOT2 = (214, 206, 190), (176, 168, 154)
LF, LD = (58, 54, 66), (30, 26, 38)                                         # empty lantern: frame and dark interior
SKIN = (236, 210, 184)
ORIG = {0: OUT, 1: FILL, 2: HI, 3: SH, 6: LF, 7: LD, 8: LD, 9: FOOT, 10: FOOT2}

BODY_T = {FILL: 0, HI: 1, SH: 2}      # tone index -> (main, hi, sh)
HEAD_C = {HEAD, HEADHI, HEADSH, EAR}
FEET_C = {FOOT, FOOT2}

def blank(): return np.zeros((H, W, 4), np.uint8)
def put(a, x, y, c):
    if 0 <= x < a.shape[1] and 0 <= y < a.shape[0]:
        a[y, x] = list(c[:3]) + [255]
def im(a): return Image.fromarray(a, "RGBA")

def art(a, rows, x0, y0, pal, flip=False):
    """draw a string sprite; '.' is transparent; flip mirrors it inside its own width"""
    for dy, r in enumerate(rows):
        if flip: r = r[::-1]
        for dx, ch in enumerate(r):
            if ch != "." and ch in pal:
                put(a, x0 + dx, y0 + dy, pal[ch])
    return a

def match(a, colors):
    m = np.zeros(a.shape[:2], bool)
    for c in colors:
        m |= (a[..., :3] == np.array(c, np.uint8)).all(-1) & (a[..., 3] > 0)
    return m

# ---------------------------------------------------------------- base frames
EYES = {"down": (6, 9), "left": (5, 7), "right": (8, 10), "up": ()}

def draw_head(a, d):
    """a simple round bare head, figure rows 0..7 (canvas + OY); eyes only when not seen from behind"""
    rows = {0: (6, 9), 1: (5, 10)}
    for y in range(2, 8): rows[y] = (4, 11)
    for y, (x0, x1) in rows.items():
        put(a, x0, y + OY, OUT); put(a, x1, y + OY, OUT)
        for x in range(x0 + 1, x1):
            put(a, x, y + OY, HEAD)
    for x in range(6, 10): put(a, x, 0 + OY, OUT)
    for (x, y) in ((6, 1), (7, 1), (5, 2), (6, 2), (5, 3)): put(a, x, y + OY, HEADHI)
    for y in range(2, 7): put(a, 10, y + OY, HEADSH)
    put(a, 9, 1 + OY, HEADSH)
    for x in range(5, 11): put(a, x, 7 + OY, HEADSH)
    for x in EYES[d]: put(a, x, 5 + OY, EYE)
    if d == "left":
        put(a, 9, 4 + OY, EAR); put(a, 9, 5 + OY, EAR)
    elif d == "right":
        put(a, 6, 4 + OY, EAR); put(a, 6, 5 + OY, EAR)
    elif d == "up":
        for x in (5, 6, 7, 8, 9): put(a, x, 6 + OY, HEADSH)
        put(a, 5, 5 + OY, HEADSH); put(a, 10, 5 + OY, HEADSH)

def build_base(d, k):
    o = atlas_frame(f"wanderer_{d}_{k}")
    out = blank()
    cols = {}
    for y in range(9, 24):
        for x in range(16):
            if o[y, x, 3] == 0: continue
            c = tuple(int(v) for v in o[y, x, :3])
            cl = {(24, 18, 30): 0, (47, 116, 112): 1, (84, 156, 146): 2, (31, 79, 76): 3, (58, 54, 66): 6,
                  (255, 238, 170): 7, (255, 196, 92): 8, (52, 40, 40): 9, (34, 26, 28): 10}.get(c)
            if cl is None: cl = 1
            put(out, x, y + OY, ORIG[cl])
    for x in range(16):                     # shoulder / chin line: the old hood's bottom row, all outline
        if o[8, x, 3]: put(out, x, 8 + OY, OUT)
    draw_head(out, d)
    return out

DIRS = ("down", "up", "left", "right")
BASE = {(d, k): build_base(d, k) for d in DIRS for k in range(3)}

# ---------------------------------------------------------------- masks (read from the base)
def masks(a):
    body = match(a, (FILL, HI, SH)); head = match(a, HEAD_C); feet = match(a, FEET_C); glow = match(a, (LD,))
    return body, head, feet, glow

def tone_of(a, x, y):
    c = tuple(int(v) for v in a[y, x, :3])
    return BODY_T.get(c, 0)

def lantern_side(a):
    g = match(a, (LD,)); xs = np.nonzero(g.any(0))[0]
    return "left" if xs.mean() < 8 else "right"

# ---------------------------------------------------------------- overlays
def tones(main, hi, sh): return (main, hi, sh)
CLOAK = {"crimson": ((163, 58, 58), (196, 92, 86), (112, 36, 42)),
         "slate": ((74, 95, 122), (110, 134, 162), (48, 62, 84)),
         "grey": ((138, 138, 138), (176, 176, 176), (96, 96, 100))}
HEMC = {"gold": ((245, 198, 106), (255, 226, 160), (196, 148, 66)),
        "crimson": CLOAK["crimson"],
        "teal": ((79, 179, 169), (130, 215, 205), (48, 120, 116)),
        "grey": CLOAK["grey"]}
SCARF = {"gold": HEMC["gold"],
         "rose": ((212, 106, 140), (238, 152, 178), (160, 64, 98)),
         "green": ((94, 158, 90), (138, 196, 126), (58, 104, 58)),
         "grey": CLOAK["grey"]}
BOOTS = {"brown": ((110, 72, 44), (70, 46, 30)), "black": ((52, 48, 60), (26, 22, 30)),
         "red": ((170, 52, 52), (108, 32, 38)), "grey": ((140, 140, 144), (92, 92, 98))}
FLAME = {"gold": ((245, 198, 106), (255, 240, 180)), "teal": ((79, 179, 169), (170, 235, 226)),
         "dim": ((119, 117, 122), (160, 158, 162))}

def ov_recolor(a, tn):
    o = blank(); body, *_ = masks(a)
    for y, x in zip(*np.nonzero(body)):
        put(o, x, y, tn[tone_of(a, x, y)])
    return o

def ov_hem(a, tn):
    o = blank(); body, *_ = masks(a)
    ys = np.nonzero(body.any(1))[0]; ymax = ys.max()
    for y, x in zip(*np.nonzero(body)):
        if y >= ymax - 1: put(o, x, y, tn[tone_of(a, x, y)])
    return o

def ov_boots(a, cols):
    o = blank(); _, _, feet, _ = masks(a)
    for y, x in zip(*np.nonzero(feet)):
        c = tuple(int(v) for v in a[y, x, :3])
        put(o, x, y, cols[0] if c == FOOT else cols[1])
    return o

def ov_flame(a, cols, raised=None):
    o = blank(); _, _, _, glow = masks(a)
    pts = sorted(zip(*np.nonzero(glow)))
    for n, (y, x) in enumerate(pts):
        put(o, x, y, cols[1] if n == 0 else cols[0])
    return o

FELT = ((66, 56, 68), (98, 86, 100), (42, 34, 46))
def ov_hat_wide(a):
    o = blank(); f, fh, fs = FELT; band = (112, 56, 52)
    for x in range(6, 10): put(o, x, -4 + OY, OUT)
    put(o, 5, -3 + OY, OUT); put(o, 10, -3 + OY, OUT)
    for x in range(6, 10): put(o, x, -3 + OY, f)
    for y in (-2, -1, 0):
        put(o, 4, y + OY, OUT); put(o, 11, y + OY, OUT)
        for x in range(5, 11): put(o, x, y + OY, band if y == 0 else f)
    for y in (-3, -2, -1):
        put(o, 6, y + OY, fh)
    for y in (-2, -1): put(o, 10, y + OY, fs)
    # the brim: two rows, two pixels wider than the head on each side
    for y, base in ((1, f), (2, fs)):
        put(o, 2, y + OY, OUT); put(o, 13, y + OY, OUT)
        for x in range(3, 13): put(o, x, y + OY, base)
    for x in (3, 4, 5): put(o, x, 1 + OY, fh)
    for x in range(3, 13): put(o, x, 3 + OY, OUT) if x in (3, 12) else None
    for x in range(5, 11): put(o, x, 3 + OY, HEADSH)     # the brim's shadow on the forehead
    return o

HOODC = ((98, 70, 50), (132, 100, 74), (62, 44, 34), (44, 30, 24))
OPEN = {"down": (4, 7, 5, 10), "up": None, "left": (4, 7, 5, 8), "right": (4, 7, 7, 10)}   # y0,y1,x0,x1 (figure rows)
def ov_hood(a, d, k):
    """the Wanderer's own hood silhouette (rows 0..8), neutral dark brown, with a face opening where the base head shows"""
    o = blank(); orig = atlas_frame(f"wanderer_{d}_{k}")
    fill, hi, sh, inner = HOODC
    op = OPEN[d]
    for y in range(0, 9):
        for x in range(16):
            if orig[y, x, 3] == 0: continue
            c = tuple(int(v) for v in orig[y, x, :3])
            inside = op and op[0] <= y <= op[1] and op[2] <= x <= op[3] and y < 8
            if c in ((12, 20, 24), (255, 214, 140)):
                if inside: continue
                put(o, x, y + OY, inner); continue
            if inside: continue
            if c == (24, 18, 30): col = OUT
            elif c == (84, 156, 146): col = hi
            elif c == (31, 79, 76): col = sh
            else: col = fill
            put(o, x, y + OY, col)
    return o

# hand items -------------------------------------------------------------------
def free_side(a):
    return "right" if lantern_side(a) == "left" else "left"

BOOK = ["oooo",
        "oCHP",
        "oCCs",
        "oCCP",
        "oooo"]
BOOKP = {"o": OUT, "C": (146, 58, 54), "H": (190, 94, 82), "P": (238, 230, 208), "s": SKIN}
def ov_book(a):
    o = blank(); side = free_side(a)
    if side == "left": art(o, BOOK, 0, 13 + OY, BOOKP)
    else:              art(o, BOOK, 12, 13 + OY, BOOKP, flip=True)
    return o

def ov_staff(a):
    o = blank(); side = free_side(a)
    sx = 0 if side == "left" else 15
    hx = 1 if side == "left" else 14
    for y in range(1, H):
        put(o, sx, y, (112, 76, 44) if y % 5 == 0 else (150, 106, 62))
    put(o, sx, 0, (190, 150, 90))
    for y in (13, 14):
        put(o, hx, y + OY, SKIN)
    put(o, sx, 13 + OY, SKIN); put(o, sx, 14 + OY, SKIN)
    return o

# scarf ------------------------------------------------------------------------
TAIL_X = {"down": 9, "up": 5, "left": 10, "right": 4}
def ov_scarf(a, d, tn):
    o = blank(); main, hi, sh = tn
    body, *_ = masks(a)
    row8 = [x for x in range(16) if tuple(a[8 + OY, x, :3]) == OUT and a[8 + OY, x, 3]]
    x0, x1 = min(row8), max(row8)
    for x in range(x0 + 1, x1):
        put(o, x, 8 + OY, hi if x < (x0 + x1) / 2 else main)
    for x in range(16):
        if body[9 + OY, x]:
            put(o, x, 9 + OY, main if x < 8 else sh)
    tx = TAIL_X[d]
    for y in (10, 11, 12, 13):
        put(o, tx, y + OY, main); put(o, tx + 1, y + OY, sh)
    put(o, tx, 14 + OY, sh); put(o, tx + 1, 14 + OY, OUT); put(o, tx, 15 + OY, OUT) if False else None
    for y in (10, 11, 12, 13, 14):
        pass
    return o

# chest emblem (front only) -------------------------------------------------------
GOLD, GOLDH, GOLDS = (245, 198, 106), (255, 236, 170), (196, 148, 66)
EMB = {"star": ([".X.", "XXX", ".X."], 5), "leaf": (["..X", ".XX", "XX."], 5), "wave": ([".X.X.", "X.X.X"], 4)}
def ov_emblem(a, name):
    o = blank(); rows, x0 = EMB[name]
    for dy, r in enumerate(rows):
        for dx, ch in enumerate(r):
            if ch == "X":
                c = GOLD
                if name == "star" and (dx, dy) == (1, 1): c = GOLDH
                if name == "leaf" and (dx, dy) == (2, 0): c = GOLDS
                if name == "wave" and dy == 1: c = GOLDS
                put(o, x0 + dx, 12 + OY + dy, c)
    if name == "leaf": put(o, 5, 15 + OY, GOLDS)
    return o

# packs --------------------------------------------------------------------------
PP = {"o": OUT, "L": (130, 88, 52), "H": (170, 124, 78), "S": (88, 58, 36), "G": GOLD,
      "P": (238, 228, 204), "p": (204, 192, 164), "R": (190, 60, 56),
      "W": (182, 138, 76), "w": (122, 86, 46), "B": (214, 150, 70), "b": (244, 196, 106), "c": (160, 100, 46)}
SAT_BACK = ["oooooooo", "oHHHHHLo", "oHLLLLSo", "oLLGGLSo", "oooooooo", "oLLLLLSo", "oSSSSSSo", "oooooooo"]
SAT_SIDE = ["ooooooo", "oHHHHSo", "oHLLLSo", "oLLGLSo", "ooooooo", "oLLLLSo", "oSSSSSo", "ooooooo"]
BUN_BACK = ["oooooo", "oPPRPo", "oPpRpo", "oRRRRo", "oPpRpo", "oPPRPo", "oooooo"]
BUN_SIDE = ["oooooo", "oPPRPo", "oPpRpo", "oRRRRo", "oPpRpo", "oPPRPo", "oooooo"]
BAS_BACK = ["...oooo.", ".oobbBBo", "obbBBcco", "oooooooo", "oWWwWWwo", "owWWwWWo", "oWwWWwWo", "oooooooo"]
BAS_SIDE = ["...oooo.", ".oobbBBo", "obbBBcco", "oooooooo", "oWWwWWwo", "owWWwWWo", "oWwWWwWo", "oooooooo"]
SAT_FRONT = ["oooo", "oHGo", "oLSo", "oooo"]
BUN_FRONT = ["oooo", "oPPo", "oRRo", "oPPo", "oooo"]
BAS_FRONT = [".oooo.", "obBBco", "oooooo", "oWwWWo", "owWwWo", "oooooo"]

def strap(o, pts, dark=False):
    for (x, y) in pts:
        put(o, x, y + OY, OUT if dark else (88, 58, 36))

def ov_pack(a, d, name):
    o = blank()
    if d == "up":
        if name == "satchel":
            for (x, y) in ((4, 9), (4, 10), (9, 9), (9, 10)): put(o, x, y + OY, PP["S"])
            art(o, SAT_BACK, 3, 11 + OY, PP)
        elif name == "letters":
            for (x, y) in ((5, 9), (5, 10), (8, 9), (8, 10)): put(o, x, y + OY, PP["S"])
            art(o, BUN_BACK, 4, 11 + OY, PP)
        else:
            for (x, y) in ((4, 9), (4, 10), (9, 9), (9, 10)): put(o, x, y + OY, PP["S"])
            art(o, BAS_BACK, 3, 10 + OY, PP)
    elif d in ("left", "right"):
        fl = d == "right"
        def A(rows, x0, y0):
            w = len(rows[0]); art(o, rows, (W - x0 - w) if fl else x0, y0 + OY, PP, flip=fl)
        def P(x, y): put(o, (W - 1 - x) if fl else x, y + OY, PP["S"])
        if name == "satchel":
            P(10, 9); P(10, 10); A(SAT_SIDE, 9, 11)
        elif name == "letters":
            P(11, 9); P(11, 10); A(BUN_SIDE, 10, 11)
        else:
            P(10, 9); P(10, 10); A(BAS_SIDE, 8, 10)
    else:  # seen from the front: the pack shows as a hip item on the free side
        if name == "satchel":
            for n, (x, y) in enumerate(((4, 9), (4, 10), (3, 11), (3, 12), (2, 13), (2, 14))): put(o, x, y + OY, PP["S"] if n % 2 else PP["L"])
            art(o, SAT_FRONT, 0, 15 + OY, PP)
        elif name == "letters":
            art(o, BUN_FRONT, 0, 14 + OY, PP)
        else:
            art(o, BAS_FRONT, 0, 13 + OY, PP)
    return o

# ---------------------------------------------------------------- idle gestures (whole pale frames, facing down)
def full_limb(a, pts, cloth, skin, hand=True):
    """a 2-px sleeve along pts with a dark outline all round (it may lie over the body), hand = last 2x2 in skin"""
    m = np.zeros(a.shape[:2], bool); hm = np.zeros_like(m)
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        n = max(abs(x1 - x0), abs(y1 - y0), 1)
        for t in range(n + 1):
            x = round(x0 + (x1 - x0) * t / n); y = round(y0 + (y1 - y0) * t / n)
            m[y:y + 2, x:x + 2] = True
    if hand:
        hx, hy = pts[-1]; hm[hy:hy + 2, hx:hx + 2] = True
    p = np.pad(m, 1)
    ring = (p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]) & ~m
    a[ring] = list(OUT) + [255]
    a[m] = list(cloth) + [255]
    a[m & hm] = list(skin) + [255]
    return a

def idle_frames():
    base = BASE[("down", 0)]
    fr = {}
    # arms down: the free hand shows at the hip, the lantern hand is the sleeve bump
    a = base.copy()
    for (x, y) in ((1, 16), (2, 16), (1, 17), (2, 17)): put(a, x, y + OY, SKIN)
    fr["pale_idle_down"] = a
    # wave: the free arm up beside the head
    a = base.copy()
    full_limb(a, [(2, 10 + OY), (1, 5 + OY), (1, 2 + OY)], HI, SKIN)
    put(a, 3, 10 + OY, HI)
    fr["pale_idle_wave"] = a
    # hand on heart: the free arm lies across the chest, the hand rests on the far side
    a = base.copy()
    m = np.zeros(a.shape[:2], bool); hm = np.zeros_like(m)
    m[13 + OY:15 + OY, 2:8] = True; hm[12 + OY:14 + OY, 6:8] = True; m |= hm
    p_ = np.pad(m, 1)
    ring = (p_[:-2, 1:-1] | p_[2:, 1:-1] | p_[1:-1, :-2] | p_[1:-1, 2:]) & ~m
    ring[:, :2] = False
    a[ring] = list(OUT) + [255]; a[m] = list(HI) + [255]; a[hm] = list(SKIN) + [255]
    a[14 + OY, 3:6] = list(SH) + [255]
    fr["pale_idle_heart"] = a
    # lantern raised: the lantern lifts beside the head, resting on the cuff
    a = base.copy()
    for y in range(11 + OY, 18 + OY):
        for x in range(13, 16): a[y, x] = 0
    # the lantern: interior x12..13 (the head's outline is its left wall), outline x14, figure rows 3..8, resting on the shoulder line
    for dy, r in enumerate(["ooo", "LLo", "DDo", "DDo", "LLo", "ooo"]):
        for dx, ch in enumerate(r):
            put(a, 12 + dx, 3 + dy + OY, {"o": OUT, "L": LF, "D": LD}[ch])
    put(a, 12, 2 + OY, OUT); put(a, 13, 2 + OY, OUT)
    fr["pale_idle_lantern"] = a
    return fr

IDLE = idle_frames()

def ov_idle_flame(a, cols):
    o = blank()
    for n, (x, y) in enumerate(((12, 5), (13, 5), (12, 6), (13, 6))):
        put(o, x, y + OY, cols[1] if n == 0 else cols[0])
    return o

# ---------------------------------------------------------------- build everything
frames = {}      # name -> RGBA image
for (d, k), a in BASE.items():
    frames[f"pale_{d}_{k}"] = im(a)
for n, a in IDLE.items():
    frames[n] = im(a)

overlay_names = []
def add(name, a):
    frames[name] = im(a); overlay_names.append(name)

for (d, k), a in BASE.items():
    tag = f"{d}_{k}"
    for c, tn in CLOAK.items(): add(f"ov_cloak_{c}_{tag}", ov_recolor(a, tn))
    add(f"ov_hat_wide_{tag}", ov_hat_wide(a))
    add(f"ov_hat_hood_{tag}", ov_hood(a, d, k))
    for c, cols in FLAME.items(): add(f"ov_flame_{c}_{tag}", ov_flame(a, cols))
    add(f"ov_hand_book_{tag}", ov_book(a))
    add(f"ov_hand_staff_{tag}", ov_staff(a))
    for c, tn in SCARF.items(): add(f"ov_scarf_{c}_{tag}", ov_scarf(a, d, tn))
    if d == "down":
        for e in EMB: add(f"ov_emblem_{e}_{tag}", ov_emblem(a, e))
    for c, cols in BOOTS.items(): add(f"ov_boots_{c}_{tag}", ov_boots(a, cols))
    for p in ("satchel", "letters", "basket"): add(f"ov_pack_{p}_{tag}", ov_pack(a, d, p))
    for c, tn in HEMC.items(): add(f"ov_hem_{c}_{tag}", ov_hem(a, tn))
for c, cols in FLAME.items():       # the flame for the raised lantern
    add(f"ov_flame_{c}_idle_lantern", ov_idle_flame(None, cols))

# ---------------------------------------------------------------- companions (separate small sprites)
def sprite(rows, pal):
    h, w = len(rows), len(rows[0]); a = np.zeros((h, w, 4), np.uint8)
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch in pal: a[y, x] = list(pal[ch]) + [255]
    return Image.fromarray(a, "RGBA")

BIRD_P = {"o": OUT, "b": (112, 108, 140), "h": (150, 146, 178), "w": (78, 74, 104), "c": (236, 172, 124), "y": GOLD, "e": (250, 250, 250), "k": (24, 18, 30)}
BIRD = [["..oo...",
         ".ohhoy.",
         "obbkboo",
         "owwbcco",
         ".ooooo."],
        ["..oo...",
         ".ohhoy.",
         "owwkboo",
         "obbbcco",
         ".ooooo."]]
for n, r in enumerate(BIRD): frames[f"comp_bird_{n}"] = sprite(r, BIRD_P)

CAT_P = {"o": OUT, "m": (206, 142, 78), "h": (240, 186, 112), "s": (150, 92, 50), "p": (232, 150, 150), "e": (130, 220, 130), "w": (244, 232, 214)}
CAT = [["..........",
        ".o......oo",
        "ooo....omm",
        "oso.oooommm"[:10],
        ".omhmmmmeo.",
        ".ommsmmmmo.",
        "..owo.owo.."],
       ["..........",
        ".o......oo",
        "ooo....omm",
        "oso.oooommm"[:10],
        ".omhmmmmeo.",
        ".ommsmmmmo.",
        "..ow.o..ow."]]
# rebuild the cat cleanly (10 x 7, facing right, tail up behind)
CAT = [[".o........",
        "oso...oo..",
        "oso..ommoo",
        ".ommmmmmmo",
        ".ommhmmmeo",
        ".ommsmmmpo",
        "..ow.o.wo."],
       [".o........",
        "oso...oo..",
        "oso..ommoo",
        ".ommmmmmmo",
        ".ommhmmmeo",
        ".ommsmmmpo",
        "..o.wo.ow."]]
for n, r in enumerate(CAT):
    r = [x[:10].ljust(10, ".") for x in r]
    frames[f"comp_cat_{n}"] = sprite(r, CAT_P)

MOTH_P = {"o": (150, 100, 40), "w": (255, 238, 170), "g": (255, 210, 110), "b": (60, 44, 40), "h": (255, 252, 226)}
MOTH = [["wg.gw",
         "wwbww",
         ".gbg.",
         "..b.."],
        ["..b..",
         ".wbw.",
         "gwbwg",
         ".g.g."]]
for n, r in enumerate(MOTH): frames[f"comp_moth_{n}"] = sprite(r, MOTH_P)

# ---------------------------------------------------------------- sartre glint
sa = atlas_frame("sartre_0").copy()
for (x, y) in ((5, 6), (8, 6)): sa[y, x] = [255, 255, 255, 255]
frames["sartre_glint"] = Image.fromarray(sa, "RGBA")

# ---------------------------------------------------------------- pack + json
items = list(frames.items())
prects = mat.pack(items, f"{OUTDIR}/people.png", pad=1, width=512)
pivots = {}
for n, imx in frames.items():
    pivots[n] = [imx.width // 2, imx.height]
for n in frames:
    if n.startswith("pale_") or n.startswith("ov_"): pivots[n] = list(PIVOT)
pivots["sartre_glint"] = [8, 24]
notes = ("Canvas change: ALL pale bases, idle poses and overlays are 16 x 28 (the Wanderer's 16 x 24 figure sits at rows 4..27, "
         "feet on the bottom row, pivot [8,28]) so the walking staff and the wide hat can rise above the head; draw every overlay at "
         "the same x,y as its base. sartre_glint stays 16 x 24. Lantern: the pale base keeps a small EMPTY dark lantern frame in the "
         "hand (4 dark interior pixels); the flame overlays paint exactly those 4 pixels (top-left brighter). Region-mask method: each "
         "overlay is generated from its own base frame by colour class: body = the three pale cloak tones (fill/highlight/shade -> "
         "recoloured main/hi/sh), head = head tones, feet = foot tones, glow = lantern interior pixels, hem = body pixels in the bottom "
         "two body rows, scarf = chin line + row 9 body pixels + a tail, hands = the side opposite the lantern. The three walk frames "
         "of a direction share one body, only the feet differ. Emblems exist for the three down frames only (none for up/left/right). "
         "Hood overlay = the Wanderer's own hood silhouette in dark brown with a face opening. Pale idle poses (wave, heart, lantern, "
         "down) share down_0's head and body, so all down_0 overlays fit them; flame for the raised lantern is ov_flame_<c>_idle_lantern. "
         "Hand overlays (book/staff) and pack hip items use the free (non-lantern) side, so they will overlap a raised arm in idle_wave.")
json.dump({"prects": prects, "pivots": pivots, "notes": notes}, open(f"{OUTDIR}/people.json", "w"), indent=1)

# ---------------------------------------------------------------- review sheet
BG = (38, 34, 48, 255)
def review():
    S = 6
    def tile(names, cols, title_h=14, comp=None):
        get = (lambda n: comp(n)) if comp else (lambda n: frames[n])
        cw = max(get(n).width for n in names) * S + 12
        chh = max(get(n).height for n in names) * S + title_h + 6
        rows_ = (len(names) + cols - 1) // cols
        sh = Image.new("RGBA", (cols * cw, rows_ * chh), BG)
        d = ImageDraw.Draw(sh)
        for n_, nm in enumerate(names):
            cx, cy = (n_ % cols) * cw, (n_ // cols) * chh
            d.text((cx + 3, cy + 2), nm[-22:], fill=(200, 196, 210, 255))
            f = comp(nm) if comp else frames[nm]
            sh.alpha_composite(f.resize((f.width * S, f.height * S), Image.NEAREST), (cx + 6, cy + title_h))
        return sh
    def stack(nm):
        # base + overlay drawn on top
        parts = nm.split("_"); tag = "_".join(parts[-2:])
        b = frames[f"pale_{tag}"].copy(); b.alpha_composite(frames[nm]); return b
    secs = []
    bases = [f"pale_{d}_{k}" for d in DIRS for k in range(3)] + list(IDLE)
    secs.append(tile(bases, 8))
    comps = ["comp_bird_0", "comp_bird_1", "comp_cat_0", "comp_cat_1", "comp_moth_0", "comp_moth_1", "sartre_glint"]
    secs.append(tile(comps, 7))
    # a "dressed" Wanderer per direction: stack the overlays
    def dressed(d, k, opts):
        b = frames[f"pale_{d}_{k}"].copy()
        for o in opts:
            nm = f"ov_{o}_{d}_{k}"
            if nm in frames: b.alpha_composite(frames[nm])
        return b
    fulls = []
    optsets = [["cloak_crimson", "hat_wide", "flame_gold", "hand_staff", "scarf_gold", "emblem_star", "boots_brown", "pack_satchel", "hem_gold"],
               ["cloak_slate", "hat_hood", "flame_teal", "hand_book", "scarf_rose", "emblem_leaf", "boots_black", "pack_letters", "hem_teal"],
               ["cloak_grey", "hat_wide", "flame_dim", "hand_staff", "scarf_green", "emblem_wave", "boots_red", "pack_basket", "hem_crimson"]]
    names = []; cache = {}
    for oi, opts in enumerate(optsets):
        for d in DIRS:
            nm = f"dressed{oi}_{d}"; names.append(nm); cache[nm] = dressed(d, 1, opts)
    for ii in IDLE:
        nm = f"dressed_{ii}"; names.append(nm)
        b = frames[ii].copy()
        for o in ("cloak_crimson", "hat_wide", "scarf_gold", "boots_brown", "hem_gold"):
            b.alpha_composite(frames[f"ov_{o}_down_0"])
        b.alpha_composite(frames["ov_flame_gold_idle_lantern"] if ii == "pale_idle_lantern" else frames["ov_flame_gold_down_0"])
        cache[nm] = b
    secs.append(tile(names, 8, comp=lambda n: cache[n]))
    # one-slot galleries (every option, every direction, frame 0)
    slots = {}
    for n in overlay_names:
        p = n.split("_"); slot_opt = "_".join(p[1:-2]); slots.setdefault(slot_opt, []).append(n)
    gl = []
    for so, ns in slots.items():
        ns0 = [n for n in ns if n.endswith("_0") or "idle" in n]
        gl += ns0
    secs.append(tile(gl, 12, comp=lambda n: (stack(n) if "idle" not in n else frames[n])))
    # backdrop composites at 2x
    bg = Image.open("art/proc40/bg/doors-bg.png").convert("RGBA")
    crop = bg.crop((96, 460, 288, 640))
    strip = Image.new("RGBA", (crop.width * 2, crop.height * 2), BG)
    strip.alpha_composite(crop.resize((crop.width * 2, crop.height * 2), Image.NEAREST))
    x = 20
    for d in DIRS:
        f = cache[f"dressed0_{d}"]; f2 = f.resize((f.width * 2, f.height * 2), Image.NEAREST)
        strip.alpha_composite(f2, (x, strip.height - f2.height - 10)); x += f2.width + 24
    for nm in ("comp_bird_0", "comp_cat_0", "comp_moth_0"):
        f = frames[nm]; f2 = f.resize((f.width * 2, f.height * 2), Image.NEAREST)
        strip.alpha_composite(f2, (x, strip.height - f2.height - 14)); x += f2.width + 14
    secs.append(strip)
    Wd = max(s_.width for s_ in secs); Ht = sum(s_.height for s_ in secs) + 10 * len(secs)
    sheet = Image.new("RGBA", (Wd, Ht), BG); y = 0
    for s_ in secs:
        sheet.alpha_composite(s_, (0, y)); y += s_.height + 10
    sheet.save(f"{OUTDIR}/_review.png")
    return sheet.size
print("frames", len(frames), "overlays", len(overlay_names), "review", review(), "sheet", Image.open(f"{OUTDIR}/people.png").size)
