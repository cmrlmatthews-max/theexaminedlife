#!/usr/bin/env python3
"""Phase 40A, agent C: people frames for the Sartre and Beauvoir short games (code-drawn pixel sprites).
Groups: sartre_s (waiter, outline waiter, café guests, desk writer, bronze masks, official),
        beauvoir_s (young woman, three townsfolk, kneeling Wanderer).
Output: art/people40/<group>/{people.png, people.json, _review.png}.  Rerunnable and deterministic."""
import sys, os, json, importlib.util
import numpy as np
from PIL import Image, ImageDraw

ROOT = "/home/claude/el"
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, "tools"))
import people as P

spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py")
mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)

OUT = P.OUT
OUTA = np.array(list(OUT) + [255], np.uint8)

# ---------------------------------------------------------------- Wanderer atlas
_s = open("work/index.html").read()
_i = _s.find("ATLAS.chars=") + 12
_j = _s.find(";", _i)
RECTS = json.loads(_s[_i:_j])["rects"]
ATLAS = np.array(Image.open("blobs/1092ba9bca54f8ddf104f6d02f4310e8.png").convert("RGBA"))

def wframe(name):
    x, y, w, h = RECTS[name]
    return ATLAS[y:y + h, x:x + w].copy()

TEAL, TEAL_L, TEAL_D = (47, 116, 112), (84, 156, 146), (31, 79, 76)
HAND = (58, 54, 66)
WHITE, WHITE_S, WHITE_H = (238, 236, 228), (192, 190, 192), (252, 252, 246)
LANTERN = {(58, 54, 66), (255, 238, 170), (255, 196, 92)}

# ---------------------------------------------------------------- generic pixel helpers
def to_img(a): return Image.fromarray(a.astype(np.uint8), "RGBA")

def put(a, x, y, c):
    if 0 <= y < a.shape[0] and 0 <= x < a.shape[1]:
        a[y, x] = list(c[:3]) + [255]

def pad(a, l=0, r=0, t=0, b=0):
    h, w = a.shape[:2]
    out = np.zeros((h + t + b, w + l + r, 4), np.uint8)
    out[t:t + h, l:l + w] = a
    return out

def is_out(a):
    return (a[..., 3] > 0) & np.all(a[..., :3] == np.array(OUT, np.uint8), -1)

def reoutline(a):
    """add a 1-px dark outline on empty pixels 4-adjacent to any non-outline opaque pixel"""
    fill = (a[..., 3] > 0) & ~is_out(a)
    p = np.pad(fill, 1)
    near = p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]
    ring = near & (a[..., 3] == 0)
    a[ring] = OUTA
    return a

def line_mask(shape, pts, th=2):
    m = np.zeros(shape, bool)
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        n = max(abs(x1 - x0), abs(y1 - y0), 1)
        for k in range(n + 1):
            x = round(x0 + (x1 - x0) * k / n); y = round(y0 + (y1 - y0) * k / n)
            m[max(0, y):y + th, max(0, x):x + th] = True
    return m

def limb2(a, pts, cloth, skin=None, hand=True, light=None):
    """a 2-px sleeve along pts with a dark outline all round (also over the body, so the arm reads as an arm);
    the last 2x2 block is the hand. Returns a."""
    m = line_mask(a.shape[:2], pts)
    hm = np.zeros_like(m)
    if hand and skin is not None:
        hx, hy = pts[-1]; hm[max(0, hy):hy + 2, max(0, hx):hx + 2] = True
    p = np.pad(m, 1)
    ring = (p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]) & ~m
    a[ring] = OUTA
    a[m] = list(cloth) + [255]
    if light is not None:   # upper-left highlight on the sleeve
        up = np.pad(m, 1)[:-2, 1:-1]; lf = np.pad(m, 1)[1:-1, :-2]
        a[m & ~up & ~hm] = list(light) + [255]
    if skin is not None:
        a[hm] = list(skin) + [255]
    return a

def silhouette(a): return a[..., 3] > 0

def ring_outline(mask):
    """1-px inner boundary of a boolean mask"""
    p = np.pad(mask, 1)
    inner = p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
    return mask & ~inner

def white_ring(mask):
    a = np.zeros(mask.shape + (4,), np.uint8)
    a[ring_outline(mask)] = [255, 255, 255, 255]
    return a

def grid_img(rows, pal, w=None):
    H = len(rows); W = w or max(len(r) for r in rows)
    a = np.zeros((H, W, 4), np.uint8)
    for y, r in enumerate(rows):
        assert len(r) == W, (y, len(r), r)
        for x, ch in enumerate(r):
            if ch != "." and ch in pal:
                a[y, x] = list(pal[ch]) + [255]
    return a

def shade(c, k): return P.shade(c, k)

# ---------------------------------------------------------------- Wanderer without the lantern, with apron
def delantern(a):
    a = a.copy()
    h, w = a.shape[:2]
    L = np.zeros((h, w), bool)
    for c in LANTERN:
        L |= np.all(a[..., :3] == np.array(c, np.uint8), -1) & (a[..., 3] > 0)
    ys, xs = np.where(L)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    right = x0 > w / 2
    e = x0 - 1 if right else x1 + 1                   # the cloak's edge column beside the lantern
    for y in range(y0 - 2, y1 + 2):
        if right: a[y, e + 1:] = 0
        else: a[y, :e] = 0
    for y in range(y0, y1 + 1):
        a[y, e] = list(TEAL_D) + [255]
    return reoutline(a)

def apron(a, view):
    """long white apron over the cloak front (rows 13..19); a bow at the back"""
    a = a.copy()
    fill = (a[..., 3] > 0) & ~is_out(a)
    band = (176, 172, 184)
    for y in range(13, 20):
        xs = np.where(fill[y, :14])[0]
        if len(xs) == 0: continue
        xl, xr = xs.min(), xs.max()
        if view == "down":
            cols = range(4, 10)
        elif view == "right":
            cols = range(xr - 3, xr + 1)
        elif view == "left":
            cols = range(xl, xl + 4)
        else:
            cols = []
        for i, x in enumerate(cols):
            c = WHITE
            if view == "down": c = WHITE_H if x == 4 else (WHITE_S if x == 9 else (WHITE_S if x == 6 and y > 14 else WHITE))
            elif view == "right": c = WHITE_S if x == cols[0] else (WHITE_H if x == cols[1] else WHITE)
            elif view == "left": c = WHITE_S if x == cols[-1] else (WHITE_H if x == cols[2] else WHITE)
            put(a, x, y, band if y == 13 else c)
        if y == 13 and view in ("down", "up"):
            for x in range(3, 11): put(a, x, 13, band)
        if y == 13 and view == "right":
            for x in range(xl, xr + 1): put(a, x, 13, band)
        if y == 13 and view == "left":
            for x in range(xl, xr + 1): put(a, x, 13, band)
    if view == "down":
        put(a, 3, 13, band); put(a, 10, 13, band)
    if view == "up":     # tied bow with two ends
        for (x, y) in ((7, 13), (8, 13), (6, 14), (9, 14), (7, 15), (8, 16)):
            put(a, x, y, WHITE)
        put(a, 7, 14, WHITE_S); put(a, 8, 14, WHITE_S)
    if view in ("right", "left"):   # bow ends at the back
        xs = np.where(fill[13, :14])[0]
        bx = xs.min() if view == "right" else xs.max()
        for (dx, y) in ((0, 14), (0, 15), (1 if view == "right" else -1, 15)):
            put(a, bx + dx, y, WHITE)
    return a

def waiter_frames():
    F = {}
    for d in ("down", "up", "left", "right"):
        for k in range(3):
            a = wframe("wanderer_%s_%d" % (d, k))
            F["wt_%s_%d" % (d, k)] = apron(delantern(a), d)
    # serve: facing down, the arm out at shoulder height setting down a cup and saucer
    a = pad(F["wt_down_0"].copy(), r=6)
    limb2(a, [(10, 9), (15, 9)], TEAL, HAND, hand=True, light=TEAL_L)
    cup = ["..AAAA..", ".AWkkWA.", ".AWWwWAA", "AwWWWWwA", ".AAAAAA."]
    cp = {"A": OUT, "W": WHITE, "w": WHITE_S, "k": (110, 74, 44)}
    for dy, row in enumerate(cup):
        for dx, ch in enumerate(row):
            if ch != ".": put(a, 13 + dx, 4 + dy, cp[ch])
    F["wt_serve"] = a
    return F

def outline_waiter(W):
    F = {}
    for d in ("down", "up", "left", "right"):
        for k in range(3):
            F["ow_%s_%d" % (d, k)] = to_img_arr(white_ring(silhouette(W["wt_%s_%d" % (d, k)])))
    F["ow_serve"] = white_ring(silhouette(W["wt_serve"]))
    # spin: side and back silhouettes blended row by row, an arm out
    def spans(m):
        r = []
        for y in range(m.shape[0]):
            xs = np.where(m[y])[0]
            r.append((xs.min(), xs.max()) if len(xs) else None)
        return r
    up = silhouette(W["wt_up_0"]); sides = {"r": silhouette(W["wt_right_0"]), "l": silhouette(W["wt_left_0"])}
    for k, key in enumerate(("r", "l")):
        s1, s2 = spans(sides[key]), spans(up)
        m = np.zeros((24, 16), bool)
        for y in range(21):
            if s1[y] and s2[y]:
                l = (s1[y][0] + s2[y][0]) // 2; r = (s1[y][1] + s2[y][1] + 1) // 2
                m[y, l:r + 1] = True
        m[21:] = up[21:]
        m = np.pad(m, ((0, 0), (5, 5)))
        if key == "r": m |= line_mask(m.shape, [(17, 10), (23, 7)])
        else: m |= line_mask(m.shape, [(8, 10), (2, 7)])
        F["ow_spin_%d" % k] = white_ring(m)
    # bow: the hood drops forward - the silhouette loses the face rows and the figure shortens
    m = silhouette(W["wt_down_0"])
    keep = [y for y in range(24) if y not in (4, 5, 6, 7, 8, 9)]
    nm = np.zeros((24, 16), bool)
    nm[24 - len(keep):] = m[keep]
    nm[7:10, :] |= np.pad(nm[7:10, 1:], ((0, 0), (0, 1)))    # shoulders a touch wider
    nm[7:10, :] |= np.pad(nm[7:10, :-1], ((0, 0), (1, 0)))
    F["ow_bow"] = white_ring(nm)
    return {k: (v if isinstance(v, np.ndarray) else np.array(v)) for k, v in F.items()}

def to_img_arr(a): return a

# ---------------------------------------------------------------- guests (seated, 16 x 18)
GUESTS = [
    dict(hair="short", hair_col=(44, 34, 30), skin="light", cloth=(96, 72, 60)),                  # man, brown jacket
    dict(hair="bun", hair_col=(70, 40, 30), skin="brown", cloth=(150, 54, 62)),                   # woman, maroon dress
    dict(hair="bald", hair_col=(60, 50, 44), skin="tan", cloth=(62, 86, 74)),                     # man, green jacket
    dict(hair="long", hair_col=(120, 66, 36), skin="medium", cloth=(66, 90, 136)),                # woman, blue
    dict(hair="cap", hair_col=(84, 78, 60), skin="dark", cloth=(110, 100, 70)),                   # man in a flat cap
    dict(hair="scarf", hair_col=(176, 128, 66), skin="light", cloth=(120, 120, 128)),             # woman, headscarf, grey
]

def guest(k, mode):
    kw = dict(GUESTS[k])
    pose = "cheer" if mode == "cheer" else ("wave" if False else "stand")
    img = P.person(pose=pose, frame=0 if mode == "cheer" else 0, **kw)
    a = np.array(img)[:18].copy()
    sk, sks = P.SKIN[kw["skin"]]
    mouth = shade(sks, .62)
    if mode == "wait":
        put(a, 7, 7, mouth); put(a, 8, 7, mouth)
        # hands resting on the table edge
        for x in (5, 6, 9, 10):
            put(a, x, 16, sk); put(a, x, 17, sks)
    else:
        put(a, 6, 7, mouth); put(a, 9, 7, mouth); put(a, 7, 8, mouth); put(a, 8, 8, mouth)
    return a

# ---------------------------------------------------------------- desk writer + bronze
def writer_frames():
    base = delantern(wframe("wanderer_down_0"))
    F = {}
    for k, (hx, hy) in enumerate(((5, 15), (9, 14))):
        a = base.copy()
        limb2(a, [(2, 10), (2, 13), (hx, hy)], TEAL, HAND, hand=True, light=TEAL_L)
        # pen: a thin light line from the hand, nib down-left
        for (dx, dy, c) in ((2, -1, (236, 226, 196)), (1, 0, (236, 226, 196)), (0, 1, (236, 226, 196)), (-1, 2, (40, 36, 44))):
            put(a, hx + 1 + dx, hy + dy, c)
        F["w_write_%d" % k] = a
    return F

BR, BR_H, BR_S = (154, 107, 58), (201, 154, 94), (107, 70, 38)

def bronze(a, stage):
    h = a.shape[0]
    rows = {1: 18, 2: 12, 3: 9, 4: 0}[stage]
    out = np.zeros_like(a)
    op = (a[..., 3] > 0) & ~is_out(a)
    lum = a[..., :3].astype(float).mean(-1)
    lo, hi = np.percentile(lum[op], 30), np.percentile(lum[op], 78)
    for y in range(rows, h):
        for x in range(a.shape[1]):
            if a[y, x, 3] == 0: continue
            if is_out(a)[y, x]:
                out[y, x] = list(shade(BR_S, .55)) + [255]       # the statue's own dark edge
                continue
            c = BR_H if lum[y, x] >= hi else (BR_S if lum[y, x] <= lo else BR)
            out[y, x] = list(c) + [255]
    return out

# ---------------------------------------------------------------- the official (left-facing)
HEAD_L = [
    ".....AAAAAA.....",
    "....AhhhhhhA....",
    "...AhhhhhhhhA...",
    "...AhhhhhhhhA...",
    "...ASSShhhhhA...",
    "...ASSSshhhhA...",
    "..ASSESSshhhA...",
    "...ASSSSsshhA...",
    "....ASSssssA....",
    ".....AssssA.....",
]
def official(bow=False):
    kw = dict(hair="short", hair_col=(120, 118, 120), skin="light", cloth=(120, 120, 128))
    base = np.array(P.person(**kw))
    sk, sks = P.SKIN["light"]
    hair = (58, 50, 54)
    pal = {"A": OUT, "h": hair, "S": sk, "s": sks, "E": P.EYE}
    a = base.copy()
    head = grid_img(HEAD_L, pal)
    a[:10] = head
    # collar and tie on the three-quarter body
    for y in (10, 11):
        for x in range(4, 8): put(a, x, y, WHITE)
    for y in range(11, 16): put(a, 5, y, (70, 56, 84))
    put(a, 5, 16, shade((70, 56, 84), .7))
    # feet point left
    a[23] = 0
    for x, c in ((4, OUT), (5, P.FEET), (6, P.FEET), (7, OUT), (9, OUT), (10, P.FEET), (11, P.FEET), (12, OUT)):
        put(a, x, 23, c)
    a[22] = 0
    if not bow:
        return a
    # a polite bow from the hips: the upper body shears forward (left) and loses a few rows to foreshortening
    return bow_shear(a, (11, 13, 15, 17), 7)

def bow_shear(a, drop, amt):
    b = a[[y for y in range(a.shape[0]) if y not in drop]]
    n = b.shape[0]; low = n - 5
    out = np.zeros((a.shape[0], 16 + amt + 1, 4), np.uint8)
    off = a.shape[0] - n
    for y in range(n):
        sh = 0 if y >= low else round(amt * ((low - y) / low) ** 1.3)
        out[y + off, amt - sh:amt - sh + 16] = b[y]
    return out

# ---------------------------------------------------------------- Beauvoir: the young woman
HAIR = (44, 34, 38); HAIR_H = (84, 68, 72); HAIR_S = (30, 22, 28)
COAT = (96, 112, 132)
SKIRT = (84, 70, 62)

def woman_pal(skin="light"):
    sk, sks = P.SKIN[skin]
    return {"A": OUT, "h": HAIR, "H": HAIR_H, "g": HAIR_S, "S": sk, "s": sks, "m": COAT, "d": shade(COAT, .66),
            "J": shade(COAT, 1.3), "k": SKIRT, "q": shade(SKIRT, .68), "Q": shade(SKIRT, 1.3), "K": P.FEET,
            "E": P.EYE, "u": shade(COAT, .5), "c": shade(COAT, 1.12)}

BACK_HEAD = [
    ".....AAAAAA.....",
    "....AHHhhhhA....",
    "...AHHhhhhhhA...",
    "...AHhhhhhhgA...",
    "...AHhhhhhhgA...",
    "...AhhAAAAAgA...",
    "...AhAHHhhAgA...",
    "...AhAHhhgAgA...",
    "....AhAAAAgA....",
    ".....AssssA.....",
]
SKIRT_ROWS = [
    "..AQkkkkkkkkqA..",
    ".AQkkkkkkkkkkqA.",
    ".AQkkkkkkkkkkqA.",
    ".AAAAAAAAAAAAAA.",
]
def coat_rows(back):
    r = [
        "..AAJccccccdAA..",
        ".AmJmmmmmmmmddA.",
        ".AmJmmmmmmmmddA.",
        ".AmJdmmmmmmmddA.",
        ".AmJdmmmmmmmddA.",
        ".AmJdmmmmmmddmA.",
        ".AmJdmmmmmmdmmA.",
    ]
    if back:
        r[1] = ".AmJmmmmddmmddA."
        for i in (2, 3, 4, 5, 6): r[i] = r[i][:7] + "d" + r[i][8:]
    else:
        r[0] = "..AAJcSSSScdAA.."
        r[1] = ".AmJmcmSSmcmddA."
        for i in (2, 4, 6): r[i] = r[i][:8] + "u" + r[i][9:]
    return r

def woman_back(frame):
    rows = BACK_HEAD + coat_rows(True) + SKIRT_ROWS
    legs = {0: (".....AsA.AsA....", ".....AsA.AsA....", ".....AKA.AKA...."),
            1: (".....AsA.AsA....", "..........AKA...", "......AKA.A.A..."),
            2: (".....AsA.AsA....", ".....AsA.AsA....", ".....AKA.AKA...."),
            3: (".....AsA.AsA....", ".....AKA........", ".........AKA...."),}[frame]
    f = {0: legs, 1: legs, 2: legs, 3: legs}[frame]
    if frame == 1:
        f = (".....AsA.AsA....", ".....AsA.AsA....", ".....AKA.AKA....")
        rows2 = None
    pal = woman_pal()
    a = grid_img(rows + list(f), pal)
    # frames 1 and 3: one foot lifts, its leg shortens and the body dips by nothing; the other leg stays planted
    if frame == 1:      # viewer-left leg lifts
        a[22, 5:8] = 0; a[23, 5:8] = 0
        for x, c in ((5, OUT), (6, P.FEET), (7, OUT)): put(a, x, 22, c)
        put(a, 6, 21, P.FEET) if False else None
    if frame == 3:      # viewer-right leg lifts
        a[22, 9:12] = 0; a[23, 9:12] = 0
        for x, c in ((9, OUT), (10, P.FEET), (11, OUT)): put(a, x, 22, c)
    # hands at the sides, swinging a pixel
    sk = P.SKIN["light"][0]
    hy = {0: (16, 16), 1: (15, 17), 2: (16, 16), 3: (17, 15)}[frame]
    put(a, 1, hy[0], sk); put(a, 14, hy[1], sk)
    return a

def woman_front_base():
    pal = woman_pal()
    head = np.array(P.person(hair="bun", hair_col=HAIR, skin="light"))[:10]
    rows = coat_rows(False) + SKIRT_ROWS + [".....AsA.AsA....", ".....AsA.AsA....", ".....AKA.AKA...."]
    body = grid_img(rows, pal)
    a = np.concatenate([head, body], 0)
    # soften the bun colours to the woman palette
    hm = np.all(a[..., :3] == np.array(HAIR, np.uint8), -1) & (a[..., 3] > 0)
    for (x, y) in ((6, 1), (7, 1), (5, 2), (4, 3), (4, 4)):
        if hm[y, x]: put(a, x, y, HAIR_H)
    sk = P.SKIN["light"][0]
    put(a, 1, 16, sk); put(a, 14, 16, sk)
    return a

def woman_lift():
    a = pad(woman_front_base(), r=5)
    # her right hand (screen right) lifted forward, open palm
    limb2(a, [(13, 11), (15, 12)], COAT, None, hand=False, light=shade(COAT, 1.3))
    sk, sks = P.SKIN["light"]
    hand = ["..A.A.", ".ASSSA", "ASSSSA", "ASSSSA", ".ASSsA", "..AAA."]
    for dy, row in enumerate(hand):
        for dx, ch in enumerate(row):
            x, y = 15 + dx, 8 + dy
            if ch == "A": put(a, x, y, OUT)
            elif ch == "S": put(a, x, y, sk)
            elif ch == "s": put(a, x, y, sks)
    for (x, y) in ((16, 9), (18, 9)): put(a, x, y, sk)
    put(a, 16, 9, OUT); put(a, 18, 9, OUT)     # gaps between fingers
    # cover the arm's skin joint with the sleeve cuff
    return a

# ---------------------------------------------------------------- Beauvoir: townsfolk
def walk_variant(a, f, kid=False):
    a = a.copy()
    if kid:
        if f == 0:
            a[15] = 0
            for x, c in ((4, OUT), (5, P.FEET), (6, P.FEET), (7, OUT), (9, OUT), (10, P.FEET), (11, P.FEET), (12, OUT)): put(a, x, 15, c)
        else:
            a[15] = 0
            for x, c in ((3, OUT), (4, P.FEET), (5, P.FEET), (6, OUT), (10, OUT), (11, P.FEET), (12, P.FEET), (13, OUT)): put(a, x, 15, c)
        return a
    a[22:24] = 0
    if f == 0:     # left planted, right foot lifted
        for x, c in ((5, OUT), (6, P.FEET), (7, OUT)): put(a, x, 23, c)
        for x, c in ((9, OUT), (10, P.FEET), (11, OUT)): put(a, x, 22, c)
    else:
        for x, c in ((9, OUT), (10, P.FEET), (11, OUT)): put(a, x, 23, c)
        for x, c in ((5, OUT), (6, P.FEET), (7, OUT)): put(a, x, 22, c)
    return a

def bag(a):
    """a leather tool bag on the left shoulder, with a wrench and hammer sticking out; a strap across the chest"""
    a = pad(a, l=0)
    leather, lh, ls = (122, 82, 46), (166, 118, 70), (84, 54, 30)
    rows = [
        "AggA.....",
        ".AgA.....",
        ".AgA.....",
        "AAAAAAA..",
        "ALllLLsA.",
        "ALLLLLLsA",
        "ALLBLLLsA",
        ".AsssssA.",
        "..AAAAA..",
    ]
    pal = {"A": OUT, "L": leather, "l": lh, "s": ls, "B": (214, 170, 70), "g": (160, 160, 172)}
    for dy, row in enumerate(rows):
        for dx, ch in enumerate(row):
            if ch == ".": continue
            put(a, dx, 6 + dy, pal[ch])
    # strap across the chest
    for i, (x, y) in enumerate(((5, 11), (6, 12), (7, 13), (8, 14), (9, 15), (10, 16))):
        put(a, x, y, ls); put(a, x + 1, y, ls)
    return a

def net_bundle(a):
    """a fishing net bundled over the left shoulder: a rolled mesh with a rope and loose strands hanging"""
    net, nd, nh = (150, 128, 84), (112, 92, 58), (190, 168, 112)
    rope = (80, 58, 40)
    m = np.zeros(a.shape[:2], bool)
    for y, (x0, x1) in zip(range(8, 16), [(1, 4), (0, 6), (0, 7), (0, 7), (0, 7), (0, 6), (1, 5), (2, 4)]):
        m[y, x0:x1 + 1] = True
    p = np.pad(m, 1)
    ring = (p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]) & ~m
    for y, x in zip(*np.where(ring)): put(a, x, y, OUT)
    for y, x in zip(*np.where(m)):
        c = net if (x + y) % 2 == 0 else nd
        if x + y <= 9: c = nh if (x + y) % 2 == 0 else net
        put(a, x, y, c)
    for (x, y) in ((1, 11), (3, 9), (5, 12), (4, 14)): put(a, x, y, rope)
    for (x, y) in ((0, 16), (0, 17), (2, 16), (2, 17), (3, 17)): put(a, x, y, nd)
    put(a, 0, 18, nd); put(a, 2, 18, net)
    return a

def townsfolk():
    F = {}
    sets = {
        "child": dict(kid=True, hair="short", hair_col=(122, 84, 50), skin="tan", cloth=(176, 128, 70)),
        "tooler": dict(hair="scarf", hair_col=(168, 78, 58), skin="medium", cloth=(82, 98, 72)),
        "netman": dict(hair="short", hair_col=(176, 174, 178), skin="light", cloth=(70, 88, 114)),
    }
    for who, kw in sets.items():
        kid = kw.get("kid", False)
        base = np.array(P.person(**kw))
        wave = np.array(P.person(pose="wave", frame=0, **kw))
        if kid:
            for arr in (base, wave):
                for x in range(3, 13):
                    if arr[13, x, 3] and not is_out(arr)[13, x]:
                        arr[13, x] = list(shade(kw["cloth"], .55)) + [255]
        if who == "netman":
            gb = (190, 188, 192)
            for arr in (base, wave):
                for x in (6, 7, 8, 9): put(arr, x, 7, gb)
                for x in range(5, 11): put(arr, x, 8, gb)
                for x in (6, 7, 8, 9): put(arr, x, 9, gb)
                for x in (5, 6, 9, 10): put(arr, x, 5, shade(gb, .8))   # grey brows
                put(arr, 6, 6, P.EYE); put(arr, 9, 6, P.EYE)
        deco = {"tooler": bag, "netman": net_bundle}.get(who, lambda z: z)
        for nm, arr in (("wait", base), ("wave", wave)):
            F["%s_%s" % (who, nm)] = deco(arr.copy())
        for f in (0, 1):
            F["%s_walk_%d" % (who, f)] = deco(walk_variant(base, f, kid))
    return F

# ---------------------------------------------------------------- kneeling Wanderer, facing right
def kneel():
    """the Wanderer kneeling on one knee, facing right: the free hand sets a small lit lamp on the ground, the other
    hand holds the lantern out behind. Canvas 30 x 19, ground = bottom row."""
    src = wframe("wanderer_right_0")
    body = delantern(src)
    keep = list(range(0, 16)) + [19, 20]            # drop the lower skirt rows: the figure sinks about six pixels
    b = body[keep]
    W, H = 30, 19
    a = np.zeros((H, W, 4), np.uint8)
    ox = 4
    a[:len(b), ox:ox + 16] = b
    # the raised front knee: the cloak bulges forward at the bottom, a dark shin and a flat foot beneath
    for y in (13, 14, 15):
        for x in range(17, 21):
            put(a, x, y, TEAL_L if (y == 13 and x < 19) else (TEAL_D if (x == 20 or y == 15) else TEAL))
    for y in (16, 17):
        for x in (19, 20): put(a, x, y, (52, 40, 40))
    for x in (19, 20, 21): put(a, x, 18, P.FEET)
    for x in (7, 8): put(a, x, 18, P.FEET)              # the back toe on the ground
    a = reoutline(a)
    # the lantern held out behind: a short sleeve with the hand, and the lantern from the Wanderer frame
    limb2(a, [(4, 9), (1, 9)], TEAL, HAND, hand=True, light=TEAL_L)
    LB = src[12:18, 12:16].copy()
    for dy in range(LB.shape[0]):
        for dx in range(LB.shape[1]):
            if LB[dy, dx, 3]: a[10 + dy, 0 + dx] = LB[dy, dx]
    for x in range(0, 4): put(a, x, 10, OUT)
    # the free hand reaches forward and down to set a small clay lamp on the ground
    limb2(a, [(17, 8), (21, 10), (24, 12)], TEAL, HAND, hand=True, light=TEAL_L)
    lamp = [".AAAAA.", "ALllLLA", "ALLLLLA", ".AAAAA."]
    pal = {"A": OUT, "L": (176, 124, 70), "l": (214, 170, 100)}
    for dy, row in enumerate(lamp):
        for dx, ch in enumerate(row):
            if ch != ".": put(a, 23 + dx, 15 + dy, pal[ch])
    for (x, y, c) in ((26, 14, (255, 196, 92)), (26, 13, (255, 238, 170)), (25, 14, OUT), (27, 14, OUT), (26, 12, OUT), (25, 13, OUT), (27, 13, OUT)):
        put(a, x, y, c)
    return a

# ---------------------------------------------------------------- packaging + review
PIV_X = {"wt_serve": 8, "ow_serve": 8, "yw_lift": 8, "w_kneel_set": 14, "official_bow": 15}
def add_pivot(piv, name, a):
    h, w = a.shape[:2]
    piv[name] = [PIV_X.get(name, w // 2), h]

def review(frames, out_path, bgfile, scene_names, bg_crop):
    names = list(frames)
    S = 6
    BG = (38, 34, 48, 255)
    font = None
    cells = []
    for n in names:
        a = frames[n]; im = to_img(a)
        cells.append((n, im))
    W = 1500; x = y = 8; rowh = 0; layout = []
    for n, im in cells:
        w, h = im.width * S, im.height * S
        cw = max(w, 70)
        if x + cw + 8 > W: x = 8; y += rowh + 8; rowh = 0
        layout.append((n, im, x, y)); x += cw + 8; rowh = max(rowh, h + 14)
    H1 = y + rowh + 8
    # scene crop at 2x over the game's backdrop
    bgim = Image.open(bgfile).convert("RGBA")
    crop = bgim.crop(bg_crop)
    sc = crop.copy()
    sx = 6
    scene = []
    for n in scene_names:
        scene.append(n)
    canvas = Image.new("RGBA", (W, H1 + crop.height * 2 + 20), BG)
    d = ImageDraw.Draw(canvas)
    for n, im, x, y in layout:
        d.text((x, y), n, fill=(210, 210, 220, 255))
        canvas.alpha_composite(im.resize((im.width * S, im.height * S), Image.NEAREST), (x, y + 12))
    # scene
    big = crop.resize((crop.width * 2, crop.height * 2), Image.NEAREST)
    px = 20
    for n in scene_names:
        a = frames[n]
        im = to_img(a)
        if n.startswith("ow_"):
            r, g, b, al = im.split(); al = al.point(lambda v: int(v * .7)); im = Image.merge("RGBA", (r, g, b, al))
        im2 = im.resize((im.width * 2, im.height * 2), Image.NEAREST)
        big.alpha_composite(im2, (px, big.height - 30 - im2.height))
        px += im2.width + 8
        if px > big.width - 40: break
    canvas.alpha_composite(big, (0, H1))
    canvas.convert("RGB").save(out_path)

def write_group(group, frames, notes, bgfile, scene_names, bg_crop):
    d = "art/people40/%s" % group
    os.makedirs(d, exist_ok=True)
    items = [(n, to_img(a)) for n, a in frames.items()]
    rects = mat.pack(items, d + "/people.png", width=256)
    piv = {}
    for n, a in frames.items(): add_pivot(piv, n, a)
    json.dump({"prects": rects, "pivots": piv, "notes": notes}, open(d + "/people.json", "w"), indent=1)
    review(frames, d + "/_review.png", bgfile, scene_names, bg_crop)
    print(group, len(frames), "frames")

def main():
    # ---- sartre_s
    W = waiter_frames()
    OW = outline_waiter(W)
    S = {}
    S.update(W); S.update(OW)
    for k in range(6):
        S["guest%d_wait" % k] = guest(k, "wait")
        S["guest%d_cheer" % k] = guest(k, "cheer")
    wr = writer_frames(); S.update(wr)
    for st in (1, 2, 3, 4): S["bronze_%d" % st] = bronze(wr["w_write_0"], st)
    S["official_stand"] = official(False)
    S["official_bow"] = official(True)
    notes = ("Pivot = [x, y] bottom-centre between the feet in each frame's own pixels (y = frame height). wt_serve is 22 wide "
             "(arm and cup to the right); ow_spin_* are 26 wide; official_bow is 24 wide (pivot x=15; head swings left). ow_* are 1-px white inner "
             "outlines of the wt_* silhouettes (draw at 70% alpha). guest* are 16 x 18 seated cuts (table hides the rest). "
             "bronze_1..4 share w_write_0's canvas, cumulative from the bottom: row cuts at y>=18, 12, 9, 0.")
    scene_s = ["wt_down_0", "wt_serve", "ow_down_0", "ow_spin_0", "guest0_wait", "guest1_cheer", "guest3_wait", "guest5_cheer",
               "w_write_0", "official_stand", "official_bow"]
    write_group("sartre_s", S, notes, "art/proc40/bg/sartre-sbg.png", scene_s, (0, 330, 384, 480))
    # ---- beauvoir_s
    B = {}
    for f in range(4): B["yw_walk_%d" % f] = woman_back(f)
    B["yw_lift"] = woman_lift()
    B.update(townsfolk())
    B["w_kneel_set"] = kneel()
    notes = ("Pivot = [x, y] bottom-centre between the feet (y = frame height). yw_lift is 21 wide (arm reaches right), "
             "w_kneel_set is 30 x 19 (pivot x=14 between the rear toe and the front foot; lantern held out behind at left, lamp at right). Townsfolk wave = right arm raised.")
    scene_b = ["yw_walk_0", "yw_walk_1", "yw_lift", "child_walk_0", "child_wave", "tooler_walk_0", "tooler_wave",
               "netman_walk_1", "netman_wait", "w_kneel_set"]
    write_group("beauvoir_s", B, notes, "art/proc40/bg/beauvoir-sbg.png", scene_b, (0, 440, 384, 640))

if __name__ == "__main__":
    main()
