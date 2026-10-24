#!/usr/bin/env python3
"""Plan 5, Phase 41A: Level II people frames (map scale, 1 px = half a unit; shown at 2x by the game).
Run from /home/claude/el:  python3 tools/people41.py [group ...]
Output: art/people41/<group>/<frame>.png  and  art/people41/<group>/pivots.json  ({name: [px, py]}).
Pivot = [x between the feet, y = bottom row + 1] (the ground line), the 40A convention.
Thinkers come from the characters atlas (front idle 0/1); poses are derived by pixel edits.
Other people come from tools/people.py person() (4 base bodies x clothing palettes)."""
import sys, os, json
import numpy as np
from PIL import Image
sys.path.insert(0, "tools")
import people as P

os.chdir("/home/claude/el")
OUT = (24, 18, 30)
_s = open("work/index.html").read(); _i = _s.find("ATLAS.chars=") + 12; _j = _s.find(";", _i)
RECTS = json.loads(_s[_i:_j])["rects"]
ATLAS = Image.open("blobs/1092ba9bca54f8ddf104f6d02f4310e8.png").convert("RGBA")

def atlas(name):
    x, y, w, h = RECTS[name]
    return np.array(ATLAS.crop((x, y, x + w, y + h))).copy()

# ------------------------------------------------------------------ helpers on RGBA arrays (h, w, 4)
def A(img): return np.array(img).copy() if not isinstance(img, np.ndarray) else img.copy()
def opaque(a): return a[..., 3] > 0
def px(a, x, y, c):
    if 0 <= y < a.shape[0] and 0 <= x < a.shape[1]: a[y, x] = list(c[:3]) + [255]
def get(a, x, y): return tuple(int(v) for v in a[y, x, :3]) if a[y, x, 3] else None

def pad(a, l=0, r=0, t=0, b=0):
    h, w = a.shape[:2]
    o = np.zeros((h + t + b, w + l + r, 4), np.uint8); o[t:t + h, l:l + w] = a; return o

def trim(a):
    ys, xs = np.nonzero(a[..., 3])
    return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1], xs.min(), ys.min()

def outline(a):
    """add the 1 px dark outline around every opaque pixel that has an empty 4-neighbour"""
    m = opaque(a); p = np.pad(m, 1)
    ring = (p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]) & ~m
    a[ring] = list(OUT) + [255]; return a

def shift_rows(a, y0, y1, dy, dx=0):
    """move rows y0..y1-1 by (dx, dy); the vacated pixels become empty"""
    h, w = a.shape[:2]
    blk = a[y0:y1].copy(); a[y0:y1] = 0
    for y in range(y1 - y0):
        ty = y0 + y + dy
        if 0 <= ty < h:
            row = np.roll(blk[y], dx, axis=0)
            if dx > 0: row[:dx] = 0
            if dx < 0: row[dx:] = 0
            m = row[..., 3] > 0
            a[ty][m] = row[m]
    return a

def flip(a): return a[:, ::-1].copy()

def colors(a, rows):
    from collections import Counter
    c = Counter()
    for y in rows:
        for x in range(a.shape[1]):
            v = get(a, x, y)
            if v and v != OUT: c[v] += 1
    return c

# ------------------------------------------------------------------ a figure = 16 x 24 front sprite + its named colors
class Fig:
    def __init__(s, a, skin, cloth, hair=None, beard=None, foot=(34, 26, 28)):
        s.a = A(a); s.skin = skin; s.cloth = cloth; s.hair = hair; s.beard = beard; s.foot = foot
        s.dark = P.shade(cloth, .62); s.lite = P.shade(cloth, 1.3)
    def copy(s):
        f = Fig(s.a, s.skin, s.cloth, s.hair, s.beard, s.foot); f.dark, f.lite = s.dark, s.lite; return f

def feet_rows(a):
    """rows that hold feet (below the robe): the last 2-3 rows"""
    h = a.shape[0]; return [y for y in range(h - 3, h)]

def walk_front(f, k):
    """frame k (0/1): one foot lifted by a pixel, the body bobs up a pixel on frame 1"""
    a = f.a.copy(); h, w = a.shape[:2]
    rows = feet_rows(a)
    cols = [x for x in range(w) if any(a[y, x, 3] and get(a, x, y) not in (None,) for y in rows[-1:])]
    if not cols: return a
    mid = (min(cols) + max(cols)) / 2
    side = (lambda x: x < mid) if k == 0 else (lambda x: x >= mid)
    for y in rows[-1:]:
        for x in range(w):
            if side(x) and a[y, x, 3]: a[y, x] = 0
    if k == 1: a = shift_rows(a, 0, h - 3, -1) if a[0].any() == False else a
    return a

def side_view(f, k, face=+1):
    """walk right (face=+1): eyes and nose pushed toward the right edge of the face, a stride on the feet"""
    a = f.a.copy(); h, w = a.shape[:2]
    # push the face pixels (rows 3..9) one px toward the facing side, keeping the head outline
    for y in range(3, 10):
        row = a[y].copy()
        xs = [x for x in range(w) if row[x, 3] and tuple(row[x, :3]) != OUT]
        if not xs: continue
        x0, x1 = min(xs), max(xs)
        seg = row[x0:x1 + 1].copy()
        if face > 0:
            new = np.concatenate([seg[:1], seg[:-1]]) ; new[0] = seg[0]
        else:
            new = np.concatenate([seg[1:], seg[-1:]])
        a[y, x0:x1 + 1] = new
    # profile: keep only the leading eye (one pixel further forward), the trailing eye becomes skin
    EYE = (36, 22, 18)
    eyes = [(x, y) for y in range(3, 10) for x in range(w) if a[y, x, 3] and tuple(a[y, x, :3]) == EYE]
    if len(eyes) >= 2:
        eyes.sort(key=lambda e: e[0] * face)
        tx, ty = eyes[0]; px(a, tx, ty, f.skin)
    # back of the head: paint the skin pixels at the trailing edge with hair (or keep skin for bald)
    hc = f.hair
    if hc:
        for y in range(3, 8):
            xs = [x for x in range(w) if a[y, x, 3] and tuple(a[y, x, :3]) != OUT]
            if xs:
                x = min(xs) if face > 0 else max(xs)
                px(a, x, y, hc)
    # stride: feet apart / together
    rows = feet_rows(a)
    yb = h - 1
    xs = [x for x in range(w) if a[yb, x, 3]]
    if xs:
        a[yb] = 0
        cx = (min(xs) + max(xs)) // 2
        if k == 0:
            for x in (cx - 4, cx - 3, cx + 3, cx + 4): px(a, x, yb, f.foot)
            for x in (cx - 5, cx + 5): px(a, x, yb, OUT)
        else:
            for x in (cx - 1, cx, cx + 1): px(a, x, yb, f.foot)
            for x in (cx - 2, cx + 2): px(a, x, yb, OUT)
    return a

def back_view(f):
    """walking away (up): the face becomes hair (or bare scalp), the beard is hidden by the robe"""
    a = f.a.copy(); h, w = a.shape[:2]
    hc = f.hair or P.shade(f.skin, .85)
    for y in range(2, 11):
        for x in range(w):
            c = get(a, x, y)
            if c is None or c == OUT: continue
            if c == f.skin or c == P.shade(f.skin, 1) or (f.beard and c == f.beard) or sum(c) < 120 and y < 10:
                px(a, x, y, hc if y < 9 else f.cloth)
            elif c not in (f.cloth, f.dark, f.lite) and y >= 4:
                px(a, x, y, hc if y < 9 else f.cloth)
    for y in range(10, 18):
        for x in range(w):
            c = get(a, x, y)
            if c is not None and c != OUT and f.beard and c == f.beard: px(a, x, y, f.cloth)
    return a

def sit_front(f):
    """seated, seen from the front (behind a table or on a bench): the lower robe is shortened, knees forward"""
    a = f.a.copy(); h, w = a.shape[:2]
    keep = list(range(0, 15)) + list(range(19, h))
    b = a[keep]
    o = np.zeros((h - 4 + 0, w, 4), np.uint8); o[:] = b
    return o

def sit_side(f, face=+1):
    a = side_view(f, 1, face)
    img = Image.fromarray(a, "RGBA")
    s = np.array(P.sit(img))
    return s if face > 0 else flip(s)

def arm_up(a, side, hand, cloth, y_hand, x_hand=None, length=4, item=None):
    """draw a raised arm: a 2 px sleeve from the shoulder (row 11) up to the hand at y_hand; side 0 = figure's left (image right)"""
    h, w = a.shape[:2]
    a = pad(a, 3, 3, 3, 0)
    xs = [x for x in range(a.shape[1]) if a[14, x, 3]]
    xL, xR = min(xs), max(xs)
    if side == 0:
        x = (x_hand if x_hand is not None else xR + 1)
    else:
        x = (x_hand if x_hand is not None else xL - 2)
    for y in range(y_hand + 3, 14 + 3):
        px(a, x, y, cloth); px(a, x + 1, y, P.shade(cloth, .8))
    px(a, x, y_hand + 3 - 1, hand); px(a, x + 1, y_hand + 3 - 1, hand)
    px(a, x, y_hand + 3 - 2, hand); px(a, x + 1, y_hand + 3 - 2, hand)
    if item:
        for (dx, dy, c) in item: px(a, x + dx, y_hand + 3 - 2 + dy, c)
    a = outline_new(a)
    a, _, _ = trim_keep_bottom(a)
    return a

def outline_new(a):
    """outline only empty pixels next to opaque non-outline pixels"""
    m = opaque(a) & ~np.all(a[..., :3] == np.array(OUT), -1)
    p = np.pad(m, 1)
    ring = (p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]) & ~opaque(a)
    a[ring] = list(OUT) + [255]; return a

def trim_keep_bottom(a):
    ys, xs = np.nonzero(a[..., 3])
    return a[ys.min():, xs.min():xs.max() + 1], xs.min(), ys.min()

# ------------------------------------------------------------------ saving
class Group:
    def __init__(s, name):
        s.name = name; s.dir = f"art/people41/{name}"; os.makedirs(s.dir, exist_ok=True); s.piv = {}
    def add(s, fname, a, pivot_x=None):
        a, x0, y0 = trim_keep_bottom(A(a)) if a[..., 3].any() else (a, 0, 0)
        ys, xs = np.nonzero(a[..., 3])
        h = a.shape[0]
        if pivot_x is None:
            bot = [x for x in range(a.shape[1]) if a[h - 1, x, 3]] or list(range(a.shape[1]))
            pivot_x = int(round((min(bot) + max(bot) + 1) / 2))
        Image.fromarray(a, "RGBA").save(f"{s.dir}/{fname}.png")
        s.piv[fname] = [int(pivot_x), int(h)]
    def done(s):
        json.dump(s.piv, open(f"{s.dir}/pivots.json", "w"), indent=0)
        print(s.name, len(s.piv), "frames")

# ------------------------------------------------------------------ thinkers (from the atlas)
SK, SKD = (222, 182, 150), (182, 138, 112)
THINK = {  # name: (cloth, hair, beard)
    "socrates": ((122, 94, 60), None, (206, 200, 186)),
    "aristotle": ((88, 106, 126), (70, 54, 40), (70, 54, 40)),
    "epicurus": ((232, 226, 210), (176, 164, 140), (176, 164, 140)),
    "seneca": ((236, 232, 222), (120, 104, 90), None),
    "epictetus": ((140, 124, 96), (58, 46, 38), (58, 46, 38)),
    "marcus": ((47, 116, 112), (92, 66, 44), (92, 66, 44)),
}
def thinker(name, f=0):
    c, h, b = THINK[name]
    return Fig(atlas(f"{name}_{f}"), SK, c, h, b, foot=(86, 58, 34))

# ------------------------------------------------------------------ generic people
BODIES = {
    "man": dict(hair="short", hair_col=(58, 40, 28), skin="tan", beard=(58, 40, 28)),
    "woman": dict(hair="long", hair_col=(44, 30, 22), skin="medium", beard=None),
    "oldman": dict(hair="bald", hair_col=(204, 200, 190), skin="light", beard=(204, 200, 190)),
    "oldwoman": dict(hair="bun", hair_col=(196, 192, 186), skin="tan", beard=None),
}
CLOTHES = {
    "plain": dict(cloth=(150, 130, 100)),                             # an undyed work tunic
    "fine": dict(cloth=(112, 62, 124), collar=(232, 196, 96)),        # a fine cloak with a gold border
    "hat": dict(cloth=(96, 122, 92), hat=(206, 170, 96)),             # a traveler with a wide straw hat
    "satchel": dict(cloth=(70, 100, 140), acc="books"),               # a scroll satchel
}
def generic(body, clothes, k=0, kid=False):
    b = BODIES[body]; c = CLOTHES[clothes]
    img = P.person(hair=b["hair"], hair_col=b["hair_col"], skin=b["skin"], cloth=c["cloth"], collar=c.get("collar"),
                   acc=c.get("acc"), kid=kid, frame=k)
    a = np.array(img)
    sk = P.SKIN[b["skin"]][0]
    if b["beard"] and not kid:
        for (x, y) in [(5, 8), (10, 8), (5, 9), (6, 9), (9, 9), (10, 9), (6, 10), (7, 10), (8, 10), (9, 10), (7, 11), (8, 11)]:
            if a[y, x, 3] and tuple(a[y, x, :3]) != OUT: px(a, x, y, b["beard"])
    if body in ("woman", "oldwoman") and not kid:
        for (x, y) in [(4, 10), (11, 10), (4, 11), (11, 11)]: px(a, x, y, b["hair_col"])
    if c.get("hat"):
        hc = c["hat"]; hd = P.shade(hc, .75)
        a = pad(a, 2, 2, 1, 0)
        for x in range(2, 18): px(a, x, 4, hc if 3 < x < 16 else hd)
        for x in range(1, 19): px(a, x, 5, OUT) if x in (1, 18) else None
        for x in range(5, 15): px(a, x, 2, hc); px(a, x, 3, hc)
        for x in (5, 14): px(a, x, 2, hd)
        a = outline_new(a)
    return Fig(a, sk, c["cloth"], b["hair_col"], b["beard"])

# ------------------------------------------------------------------ poses for any Fig (front view)
HANDC = lambda f: f.skin
def pose_raise(f, side=1, y=4, item=None):           # one arm raised high (wave, point up, cup)
    return arm_up(f.a.copy(), side, HANDC(f), f.cloth, y, item=item)
def pose_point(f, side=0):                            # arm out sideways at shoulder height (point, offer)
    a = pad(f.a.copy(), 4, 4, 0, 0)
    xs = [x for x in range(a.shape[1]) if a[13, x, 3]]
    x0 = (max(xs) + 1) if side == 0 else (min(xs) - 4)
    for x in range(x0, x0 + 4):
        px(a, x, 12, f.cloth); px(a, x, 13, P.shade(f.cloth, .8))
    hx = x0 + 3 if side == 0 else x0
    px(a, hx, 12, f.skin); px(a, hx, 13, f.skin)
    return trim_keep_bottom(outline_new(a))[0]
def pose_eat(f):                                      # hand to mouth with a bit of bread
    a = f.a.copy()
    for (x, y) in [(9, 9), (10, 9), (9, 10), (10, 10)]: px(a, x, y, (176, 120, 64))
    for (x, y) in [(10, 11), (11, 11), (11, 12), (12, 12)]: px(a, x, y, f.cloth)
    px(a, 11, 10, f.skin)
    return a
def pose_cup(f):                                      # raise a clay cup
    return pose_raise(f, 1, 5, item=[(0, -2, (150, 84, 54)), (1, -2, (150, 84, 54)), (0, -3, (190, 214, 220)), (1, -3, (150, 84, 54))])
def pose_shake(f):                                    # head turned a pixel aside (a polite 'no thank you')
    a = f.a.copy(); return shift_rows(a, 0, 10, 0, -1)
def pose_setaside(f):                                 # a smile and a hand pushing a dish aside
    return pose_point(f, 0)
def pose_bow(f):                                      # head and shoulders lowered two pixels
    a = pad(f.a.copy(), 0, 0, 0, 0)
    h = a.shape[0]; b = np.zeros_like(a)
    top = 12
    b[2:top + 2] = a[0:top]; b[top + 2:] = a[top + 2:] if False else a[top + 2:]
    b[top:top + 2] = a[top:top + 2]
    return b
def pose_breathe(f):                                  # chest up a pixel, arms a little out
    a = pad(f.a.copy(), 1, 1, 1, 0)
    a = shift_rows(a, 0, 14, -1)
    return trim_keep_bottom(outline_new(a))[0]
def pose_soft(f):                                     # head lowered a pixel, shoulders down
    a = f.a.copy(); return shift_rows(a, 0, 10, 1)
def pose_carry(f, k):                                 # both arms forward at the waist (the game draws the load), a step
    a = walk_front(f, k)
    for x in range(4, 12): px(a, x, 13, OUT)
    for x in range(4, 12): px(a, x, 14, P.shade(f.cloth, 1.2)); px(a, x, 15, P.shade(f.cloth, .7))
    for x in (5, 6, 9, 10): px(a, x, 14, f.skin)
    return a
KINDS = ["busybody", "ungrateful", "arrogant", "deceitful", "envious", "unsocial"]
def provoke(f, i):
    k = KINDS[i % 6]; EYE = (36, 22, 18)
    if k == "busybody":                               # a wagging finger, raised high
        return pose_raise(f, 0, 3)
    if k == "ungrateful":                             # back half turned
        return flip(side_view(Fig(back_view(f), f.skin, f.cloth, f.hair, f.beard, f.foot), 0))
    if k == "arrogant":                               # chin up: the head rises a pixel and the eyes look up
        a = shift_rows(pad(f.a.copy(), 0, 0, 1, 0), 0, 11, -1)
        return a
    if k == "deceitful":                              # turning two ways: half the face in profile
        a = side_view(f, 1, -1); b = side_view(f, 1, +1)
        a[:, 8:] = b[:, 8:a.shape[1]] if b.shape[1] >= a.shape[1] else a[:, 8:]
        return a
    if k == "envious":                                # a side glance: both eyes a pixel to the side
        a = f.a.copy()
        eyes = [(x, y) for y in range(3, 10) for x in range(a.shape[1]) if a[y, x, 3] and tuple(a[y, x, :3]) == EYE]
        for x, y in eyes: px(a, x, y, f.skin)
        for x, y in eyes: px(a, x + 1, y, EYE)
        return a
    a = f.a.copy()                                    # unsocial: arms crossed over the chest
    for x in range(4, 12):
        px(a, x, 13, P.shade(f.cloth, 1.2)); px(a, x, 14, P.shade(f.cloth, .8))
    px(a, 4, 13, f.skin); px(a, 11, 14, f.skin)
    return a

def pose_write(f):                                    # seated, writing in a small notebook on the knee
    a = sit_front(f)
    for (x, y) in [(6, 15), (7, 15), (8, 15), (9, 15)]: px(a, x, y, (120, 84, 50))
    for (x, y) in [(6, 14), (7, 14), (8, 14), (9, 14)]: px(a, x, y, (236, 226, 196))
    px(a, 10, 14, f.skin)
    return a
def talk(f, k):                                       # a seated talker: mouth/hand alternates
    a = sit_front(f)
    if k == 1:
        a = pose_point(Fig(a, f.skin, f.cloth, f.hair, f.beard), 0 if hash(f.cloth) % 2 else 1)
    return a

# ------------------------------------------------------------------ groups
def g_garden():
    g = Group("garden")
    e0, e1 = thinker("epicurus", 0), thinker("epicurus", 1)
    g.add("epi_idle_0", sit_front(e0)); g.add("epi_idle_1", sit_front(e1))
    es = Fig(sit_front(e0), e0.skin, e0.cloth, e0.hair, e0.beard)
    g.add("epi_eat", pose_eat(es)); g.add("epi_setaside", pose_setaside(es)); g.add("epi_cup", pose_cup(es))
    guests = [("man", "plain"), ("woman", "fine"), ("oldman", "hat"), ("oldwoman", "satchel"), ("woman", "plain"), ("man", "fine")]
    for i, (b, c) in enumerate(guests):
        f0, f1 = generic(b, c, 0), generic(b, c, 1)
        s0 = Fig(sit_front(f0), f0.skin, f0.cloth, f0.hair, f0.beard)
        g.add(f"g{i}_idle_0", sit_front(f0)); g.add(f"g{i}_idle_1", sit_front(f1))
        g.add(f"g{i}_eat", pose_eat(s0)); g.add(f"g{i}_shake", pose_shake(s0)); g.add(f"g{i}_cup", pose_cup(s0))
    for i, (b, c) in enumerate([("oldwoman", "plain"), ("man", "hat")]):
        f = generic(b, c, 0)
        g.add(f"friend{i}_walk_0", side_view(f, 0)); g.add(f"friend{i}_walk_1", side_view(f, 1))
        g.add(f"friend{i}_sit", sit_front(f))
    g.done()

def walkset(g, pre, f, dirs=("left", "right", "up"), frames=2):
    for d in dirs:
        for k in range(frames):
            if d == "right": a = side_view(f, k, +1)
            elif d == "left": a = flip(side_view(f, k, +1))
            elif d == "up": a = walk_front(Fig(back_view(f), f.skin, f.cloth, f.hair, f.beard, f.foot), k)
            else: a = walk_front(f, k)
            g.add(f"{pre}_{d}_{k}", a)

def g_socrates():
    g = Group("socrates_s")
    s = thinker("socrates")
    walkset(g, "soc_walk", s)
    g.add("soc_sit", sit_front(s)); g.add("soc_idle_0", thinker("socrates", 0).a); g.add("soc_idle_1", thinker("socrates", 1).a)
    for i, (b, c) in enumerate([("man", "plain"), ("oldman", "satchel")]):
        f = generic(b, c)
        g.add(f"friend{i}_talk_0", talk(f, 0)); g.add(f"friend{i}_talk_1", talk(f, 1))
    rich = generic("man", "fine")
    rich.cloth = (196, 160, 70); rich.a = recolor_cloth(rich.a, CLOTHES["fine"]["cloth"], (196, 160, 70))
    g.add("rich_walk_0", side_view(rich, 0)); g.add("rich_walk_1", side_view(rich, 1)); g.add("rich_place", pose_point(rich, 0))
    youths = [("man", "plain"), ("woman", "satchel"), ("man", "hat"), ("woman", "plain")]
    for i, (b, c) in enumerate(youths):
        f = generic(b, c, kid=False)
        f.a = youthify(f.a, f.beard)
        g.add(f"youth{i}_talk_0", talk(f, 0)); g.add(f"youth{i}_talk_1", talk(f, 1))
    g.done()

def recolor_cloth(a, src, dst):
    a = a.copy()
    for k in (1.0, .62, 1.35):
        s, d = P.shade(src, k), P.shade(dst, k)
        m = opaque(a) & np.all(a[..., :3] == np.array(s), -1); a[m] = list(d) + [255]
    return a
def youthify(a, beard):
    """no beard: put the face skin back"""
    if not beard: return a
    a = a.copy(); sk = None
    for y in range(5, 8):
        for x in range(4, 12):
            c = get(a, x, y)
            if c and c != OUT and c != beard: sk = sk or c
    m = opaque(a) & np.all(a[..., :3] == np.array(beard), -1)
    m[:8] = False
    a[m] = list(sk) + [255]
    return a

def g_aristotle():
    g = Group("aristotle_s")
    ar = thinker("aristotle")
    TAB, WAX = (150, 106, 62), (60, 44, 34)
    def tablet(a, dy=0):
        a = a.copy()
        for x in range(4, 10):
            for y in range(13 + dy, 17 + dy): px(a, x, y, TAB if y in (13 + dy, 16 + dy) or x in (4, 9) else WAX)
        return a
    g.add("ari_tab_0", tablet(thinker("aristotle", 0).a)); g.add("ari_tab_1", tablet(thinker("aristotle", 1).a))
    w = tablet(ar.a); px(w, 10, 14, ar.skin); px(w, 9, 15, (230, 220, 200)); g.add("ari_write", w)
    sm = tablet(ar.a); [px(sm, x, 14, ar.skin) for x in (6, 7)]; g.add("ari_smooth", sm)
    g.add("ari_walk_0", side_view(ar, 0)); g.add("ari_walk_1", side_view(ar, 1))
    pt = pose_point(Fig(side_view(ar, 1), ar.skin, ar.cloth, ar.hair, ar.beard), 0); g.add("ari_point", pt)
    g.add("ari_sit", sit_front(ar))
    # the student, seen from behind, with a bow
    st = generic("man", "plain"); st.a = youthify(st.a, st.beard)
    bk = back_view(st)
    BOW, STR = (120, 78, 40), (230, 220, 200)
    def bow(a, drawn):
        a = pad(a.copy(), 4, 4, 0, 0)
        cx = 12
        for y in range(6, 20):
            px(a, cx - 6 + (1 if y in range(9, 17) else 0) - (0 if not drawn else 1), y, BOW)
        for y in range(7, 19):
            px(a, cx - 4 + (2 if drawn and 10 <= y <= 15 else 0), y, STR)
        if drawn:
            for x in range(cx - 4, cx + 5): px(a, x, 13, (170, 130, 80))
            px(a, cx + 4, 12, st.skin); px(a, cx + 4, 13, st.skin)
        return trim_keep_bottom(outline_new(a))[0]
    g.add("stu_idle", bow(bk, False)); g.add("stu_draw", bow(bk, True))
    lo = bow(bk, False); g.add("stu_loose", pose_point(Fig(lo, st.skin, st.cloth), 0))
    studs = [("man", "plain"), ("woman", "satchel"), ("man", "fine"), ("woman", "hat"), ("man", "satchel")]
    for i, (b, c) in enumerate(studs):
        f = generic(b, c); f.a = youthify(f.a, f.beard)
        g.add(f"stud{i}_walk_0", side_view(f, 0)); g.add(f"stud{i}_walk_1", side_view(f, 1)); g.add(f"stud{i}_sit", sit_front(f))
    g.done()

def g_epicurus():
    g = Group("epicurus_s")
    e = thinker("epicurus")
    g.add("epi_walk_0", side_view(e, 0)); g.add("epi_walk_1", side_view(e, 1))
    i = 0
    for b in ("man", "woman", "oldman", "oldwoman"):
        for c in ("plain", "fine", "hat", "satchel"):
            if i >= 16: break
            f0, f1 = generic(b, c, 0), generic(b, c, 1)
            pre = f"{b}_{c}"
            g.add(f"{pre}_stand_0", f0.a); g.add(f"{pre}_stand_1", f1.a); g.add(f"{pre}_bow", pose_bow(f0))
            g.add(f"{pre}_walk_0", side_view(f0, 0)); g.add(f"{pre}_walk_1", side_view(f0, 1))
            g.add(f"{pre}_talk_0", talk(f0, 0)); g.add(f"{pre}_talk_1", talk(f0, 1))
            i += 1
    g.done()

def g_seneca():
    g = Group("seneca_s")
    s0, s1 = thinker("seneca", 0), thinker("seneca", 1)
    g.add("sen_idle_0", s0.a); g.add("sen_idle_1", s1.a)
    calm = s0.a.copy()
    for x in range(4, 12):
        for y in (14, 15): px(calm, x, y, P.shade(s0.cloth, .85) if y == 15 else s0.cloth)
    px(calm, 4, 14, s0.skin); px(calm, 11, 15, s0.skin)
    for (x, y) in [(6, 6), (9, 6)]:  # eyes closed: a short dark line
        if get(calm, x, y) == (36, 22, 18): pass
    for y in range(4, 9):
        for x in range(3, 13):
            if get(calm, x, y) == (36, 22, 18): px(calm, x, y, SKD)
    g.add("sen_calm", calm)
    fr = generic("man", "hat"); fr.a = youthify(fr.a, fr.beard)
    LANT = [(dx, dy, c) for dx in (-1, 0, 1, 2) for dy, c in ((-1, (58, 54, 66)), (-2, (255, 210, 120)), (-3, (255, 196, 92)), (-4, (255, 210, 120)), (-5, (58, 54, 66)))
            if not (dx in (-1, 2) and dy in (-1, -5))]
    g.add("friend_wave_0", pose_raise(fr, 1, 2, item=LANT)); g.add("friend_wave_1", pose_raise(fr, 1, 5, item=LANT))
    g.done()

def g_epictetus():
    g = Group("epictetus_s")
    ep = thinker("epictetus")
    nocr = ep.a.copy()
    CR = (150, 106, 62)
    m = opaque(nocr) & np.all(nocr[..., :3] == np.array(CR), -1); nocr[m] = 0      # the atlas sprite's staff/crutch
    nocr = clean_outline(nocr)
    base = Fig(nocr, ep.skin, ep.cloth, ep.hair, ep.beard, ep.foot)
    CH = (150, 150, 160)
    def chain(a):
        a = a.copy(); h = a.shape[0]
        xs = [x for x in range(a.shape[1]) if a[h - 1, x, 3]]
        if xs:
            for x in range(min(xs) - 1, max(xs) + 2, 2): px(a, x, h - 2, CH)
        return a
    for d in ("down", "up", "left", "right"):
        for k in (0, 1):
            if d == "right": a = side_view(base, k)
            elif d == "left": a = flip(side_view(base, k))
            elif d == "up": a = walk_front(Fig(back_view(base), base.skin, base.cloth, base.hair, base.beard, base.foot), k)
            else: a = walk_front(base, k)
            g.add(f"epc_{d}_{k}", chain(a))
    # with the crutch (the atlas sprite carries it on its right side)
    c0, c1 = thinker("epictetus", 0), thinker("epictetus", 1)
    g.add("epc_cr_idle_0", c0.a); g.add("epc_cr_idle_1", c1.a)
    up = shift_rows(pad(c0.a.copy(), 0, 0, 2, 0), 0, 24, -2); g.add("epc_cr_step", up)
    g.add("epc_cr_walk_0", side_view(c0, 0)); g.add("epc_cr_walk_1", side_view(c0, 1))
    g.add("epc_cr_sit", sit_front(c0))
    for i, (b, c) in enumerate([("man", "satchel"), ("woman", "plain")]):
        f0, f1 = generic(b, c, 0), generic(b, c, 1)
        if b == "man": f0.a, f1.a = youthify(f0.a, f0.beard), youthify(f1.a, f1.beard)
        g.add(f"stud{i}_0", f0.a); g.add(f"stud{i}_1", f1.a)
    g.done()

def clean_outline(a):
    """remove outline pixels that no longer touch a colored pixel"""
    col = opaque(a) & ~np.all(a[..., :3] == np.array(OUT), -1)
    p = np.pad(col, 1)
    near = p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:] | p[:-2, :-2] | p[:-2, 2:] | p[2:, :-2] | p[2:, 2:]
    out = opaque(a) & ~col
    a = a.copy(); a[out & ~near] = 0; return a

def g_marcus():
    g = Group("marcus_s")
    m0, m1 = thinker("marcus", 0), thinker("marcus", 1)
    ms = Fig(sit_front(m0), m0.skin, m0.cloth, m0.hair, m0.beard)
    g.add("mar_sit_0", sit_front(m0)); g.add("mar_sit_1", sit_front(m1))
    g.add("mar_breathe", pose_breathe(ms)); g.add("mar_answer", pose_point(ms, 0)); g.add("mar_write", pose_write(m0))
    g.add("mar_idle_0", m0.a); g.add("mar_idle_1", m1.a)
    g.add("mar_meet", pose_point(m0, 0))
    g.add("mar_walk_0", side_view(m0, 0)); g.add("mar_walk_1", side_view(m0, 1))
    st = shift_rows(pad(m0.a.copy(), 0, 0, 0, 0), 0, 14, 3, 1); g.add("mar_stoop", st)
    vis = [("man", "plain"), ("woman", "fine"), ("oldman", "satchel"), ("oldwoman", "hat"), ("man", "fine"), ("woman", "plain")]
    for i, (b, c) in enumerate(vis):
        f = generic(b, c)
        g.add(f"v{i}_walk_0", flip(side_view(f, 0))); g.add(f"v{i}_walk_1", flip(side_view(f, 1)))
        g.add(f"v{i}_provoke", provoke(f, i)); g.add(f"v{i}_soft", pose_soft(f))
        g.add(f"v{i}_carry_0", pose_carry(f, 0)); g.add(f"v{i}_carry_1", pose_carry(f, 1))
    g.done()

GROUPS = {"garden": g_garden, "socrates_s": g_socrates, "aristotle_s": g_aristotle, "epicurus_s": g_epicurus,
          "seneca_s": g_seneca, "epictetus_s": g_epictetus, "marcus_s": g_marcus}

def pack_group(name):
    """art/people41/<g>/*.png -> people.png + people.json {prects, pivots} + _review.png (6x)"""
    import importlib.util
    mat = importlib.util.module_from_spec(importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py"))
    mat.__spec__.loader.exec_module(mat)
    d = f"art/people41/{name}"; piv = json.load(open(f"{d}/pivots.json"))
    items = [(n, Image.open(f"{d}/{n}.png").convert("RGBA")) for n in piv]
    rects = mat.pack(items, f"{d}/people.png", width=512)
    json.dump({"prects": rects, "pivots": piv}, open(f"{d}/people.json", "w"))
    # review strip: every frame at 6x on a ground line
    S = 6; cols = 14; cw, ch = 36 * S, 40 * S
    rows = (len(items) + cols - 1) // cols
    from PIL import ImageDraw
    im = Image.new("RGBA", (cols * cw, rows * (ch + 14)), (52, 70, 72, 255)); dr = ImageDraw.Draw(im)
    for i, (n, f) in enumerate(items):
        x0 = (i % cols) * cw; y0 = (i // cols) * (ch + 14); pxv, pyv = piv[n]
        im.alpha_composite(f.resize((f.width * S, f.height * S), Image.NEAREST), (x0 + cw // 2 - pxv * S, y0 + ch - 6 - pyv * S))
        dr.text((x0 + 3, y0 + ch - 2), n[:30], fill=(255, 255, 255, 255))
    im.save(f"{d}/_review.png")

if __name__ == "__main__":
    for n in (sys.argv[1:] or GROUPS):
        GROUPS[n](); pack_group(n)
