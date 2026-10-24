#!/usr/bin/env python3
"""Plan 5, Phase 42A: Level III people frames (map scale, 1 px = half a unit; shown at 2x by the game).
Run from /home/claude/el:  python3 tools/people42.py [group ...]
Output: art/people42/<group>/<frame>.png, pivots.json, people.png, people.json {prects, pivots}, _review.png.
Pivot = [x between the feet, y = frame height] (the ground line). Seated "upper body" frames (shared) are cut
at the table edge: their pivot y is the bottom row (the table edge line).
Reuses the Level II helpers in tools/people41.py (thinkers from the characters atlas, generic bodies, poses)."""
import sys, os, json
import numpy as np
from PIL import Image
sys.path.insert(0, "tools")
import people as P
import people41 as Q
from people41 import Fig, pad, px, get, shift_rows, flip, outline_new, trim_keep_bottom, sit_front, side_view, back_view
from people41 import walk_front, pose_bow as _pose_bow41, pose_point, pose_raise, generic, OUT

os.chdir("/home/claude/el")
EYE = (36, 22, 18)

CANE = (120, 84, 50)
class Group(Q.Group):
    def __init__(s, name):
        s.name = name; s.dir = f"art/people42/{name}"; os.makedirs(s.dir, exist_ok=True); s.piv = {}
    def add(s, fname, a, pivot_x=None):
        """as Level II, but a cane (Grandmother) does not pull the pivot off the feet"""
        if pivot_x is None and a[..., 3].any():
            b, _, _ = trim_keep_bottom(A_(a)); h = b.shape[0]
            cols = [x for x in range(b.shape[1]) if b[h - 1, x, 3] and tuple(b[h - 1, x, :3]) not in (OUT, CANE)]
            if cols and any(tuple(b[y, x, :3]) == CANE for y in range(h) for x in range(b.shape[1]) if b[y, x, 3]):
                pivot_x = int(round((min(cols) + max(cols) + 1) / 2))
        Q.Group.add(s, fname, a, pivot_x)
def A_(a): return np.array(a).copy()

SK = (222, 182, 150)
THINK3 = {  # name: (cloth, hair, beard)
    "buddha": ((214, 128, 44), (44, 34, 30), None),
    "laozi": ((170, 160, 140), (236, 232, 222), (236, 232, 222)),
    "zhuangzi": ((126, 158, 116), (46, 36, 30), None),
    "confucius": ((66, 64, 104), (34, 28, 26), (34, 28, 26)),
    "dogen": ((34, 32, 38), None, None),
}
def thinker(name, f=0):
    c, h, b = THINK3[name]
    return Fig(Q.atlas(f"{name}_{f}"), SK, c, h, b, foot=(86, 58, 34))
def wand(d, k=0):
    return Fig(Q.atlas(f"wanderer_{d}_{k}"), (12, 20, 24), (47, 116, 112), None, None, foot=(52, 40, 40))

def upper(a, rows=12):
    """the upper body only (the table hides the rest): rows 0..rows-1, closed with an outline row"""
    b = a[:rows].copy()
    b = np.concatenate([b, np.zeros((1, b.shape[1], 4), np.uint8)], 0)
    for x in range(b.shape[1]):
        if b[rows - 1, x, 3]: px(b, x, rows, OUT)
    return b

def recolor(a, mapping):
    a = a.copy()
    for s_, d_ in mapping.items():
        m = (a[..., 3] > 0) & np.all(a[..., :3] == np.array(s_), -1); a[m] = list(d_) + [255]
    return a
def recloth(f, new):
    """change a Fig's robe color (main, shadow, highlight)"""
    a = f.a.copy()
    for k in (1.0, .62, 1.35, .8, 1.2, .85, .7):
        a = recolor(a, {P.shade(f.cloth, k): P.shade(new, k)})
    g = Fig(a, f.skin, new, f.hair, f.beard, f.foot); return g

def pose_bow(f):
    """a clear bow: head and shoulders drop three pixels and the eyes look down"""
    a = f.a.copy(); h = a.shape[0]
    top = min(12, h - 6)
    a = shift_rows(a, 0, top, 3)
    hc = f.hair or P.shade(f.skin, .85)
    for y in range(h):
        for x in range(a.shape[1]):
            if get(a, x, y) == EYE: px(a, x, y, P.shade(f.skin, .8))
    return outline_new(a)

def nod(f):
    a = pad(f.a.copy(), 0, 0, 1, 0); return shift_rows(a, 0, 11, 1)

def bow_seated(a):
    """seated upper body bowing: the head drops two pixels into the shoulders"""
    a = pad(a.copy(), 0, 0, 0, 0); return shift_rows(a, 0, 10, 2)

def arm_forward(a, cloth, hand, y=10, side=0, n=4, item=None):
    """an arm held forward at row y (pour, offer, hold out): a 2-row sleeve with a hand at the end"""
    a = pad(a.copy(), n + 2, n + 2, 0, 0)
    xs = [x for x in range(a.shape[1]) if a[y, x, 3]]
    x0 = (max(xs) + 1) if side == 0 else (min(xs) - n)
    for x in range(x0, x0 + n):
        px(a, x, y, cloth); px(a, x, y + 1, P.shade(cloth, .8))
    hx = x0 + n - 1 if side == 0 else x0
    px(a, hx, y, hand); px(a, hx, y + 1, hand)
    if item:
        for dx, dy, c in item: px(a, hx + (dx if side == 0 else -dx), y + dy, c)
    return trim_keep_bottom(outline_new(a))[0]

TEAPOT = [(1, -1, (150, 84, 54)), (2, -1, (150, 84, 54)), (1, 0, (130, 70, 44)), (2, 0, (130, 70, 44)), (3, 0, (110, 60, 40))]
BOWL = [(0, -1, (240, 240, 232)), (1, -1, (240, 240, 232)), (-1, 0, (84, 120, 140)), (0, 0, (84, 120, 140)), (1, 0, (84, 120, 140)), (2, 0, (84, 120, 140))]
DBOWL = [(0, -1, (240, 240, 232)), (1, -1, (240, 240, 232)), (-1, 0, (44, 42, 46)), (0, 0, (44, 42, 46)), (1, 0, (44, 42, 46)), (2, 0, (44, 42, 46))]

def cane(a, x=None):
    """a walking cane at the figure's right side (image left)"""
    a = pad(a.copy(), 2, 0, 0, 0); h = a.shape[0]
    xs = [x_ for x_ in range(a.shape[1]) if a[15, x_, 3]]
    cx = min(xs) - 1 if x is None else x
    for y in range(12, h): px(a, cx, y, (120, 84, 50))
    px(a, cx + 1, 12, (120, 84, 50))
    return outline_new(a)

# ------------------------------------------------------------------ The Shared Table
def g_shared():
    g = Group("shared")
    fam = {  # name: (body, clothes, cloth color, kid)
        "gm": ("oldwoman", "plain", (110, 60, 74), False),   # Grandmother: plum robe, white bun, cane
        "gf": ("oldman", "plain", (70, 96, 84), False),      # Grandfather: deep jade robe, white beard
        "fa": ("man", "plain", (60, 82, 118), False),        # Father: slate blue
        "mo": ("woman", "plain", (150, 70, 62), False),      # Mother: brick red
        "ch": ("man", "plain", (214, 160, 70), True),        # Child: saffron jacket
        "gu": ("man", "plain", (124, 124, 128), False),      # Guest: grey cloak, small bundle
    }
    for k, (b, c, col, kid) in fam.items():
        f0, f1 = generic(b, c, 0, kid=kid), generic(b, c, 1, kid=kid)
        f0, f1 = recloth(f0, col), recloth(f1, col)
        if k in ("fa", "ch", "gu"): f0.a, f1.a = Q.youthify(f0.a, f0.beard), Q.youthify(f1.a, f1.beard)
        if k == "gm": f0.a, f1.a = cane(f0.a), cane(f1.a)
        if k == "gu":  # a small bundle on the back (a knot over the shoulder)
            for a_ in (f0.a, f1.a):
                for (x, y) in [(12, 10), (13, 10), (12, 11), (13, 11), (13, 12)]: px(a_, x, y, (176, 150, 104))
        g.add(f"{k}_stand_0", f0.a); g.add(f"{k}_stand_1", f1.a)
        g.add(f"{k}_walk_0", side_view(f0, 0)); g.add(f"{k}_walk_1", side_view(f0, 1))
        rows = 9 if kid else 12
        sf = f0.a.copy() if kid else sit_front(f0); g.add(f"{k}_sf", upper(sf, rows))
        if kid:
            h0 = f0.a.shape[0]; tmp = Fig(pad(f0.a, 0, 0, 0, 24 - h0), f0.skin, f0.cloth, f0.hair, f0.beard); sb = back_view(tmp)[:h0]
        else: sb = back_view(f0)
        g.add(f"{k}_sb", upper(sb, rows))
        if k != "gu": g.add(f"{k}_bow", pose_bow(f0))
        if k in ("gm", "gu"):
            pr = arm_forward(upper(sf, rows + 2) if True else sf, f0.cloth, f0.skin, y=10, side=0, item=TEAPOT)
            g.add(f"{k}_pour", pr)
        if k == "ch":
            g.add("ch_carry", arm_forward(f0.a, f0.cloth, f0.skin, y=8, side=0, n=3, item=BOWL))
    # the Wanderer: seated front / back (upper body), seated bow, huddle (cold), wave smoke away
    wd, wu = wand("down", 0), wand("up", 0)
    g.add("w_sf", upper(wd.a, 12)); g.add("w_sb", upper(wu.a, 12))
    g.add("w_bow", bow_seated(upper(wd.a, 12)))
    hud = shift_rows(pad(upper(wd.a, 12), 0, 0, 0, 0), 0, 9, 1)
    for x in range(4, 12): px(hud, x, 10, (31, 79, 76))                    # arms wrapped in front
    for (x, y) in [(3, 10), (12, 10)]: px(hud, x, y, (92, 84, 100))
    g.add("w_huddle", hud)
    wv = arm_forward(upper(wd.a, 12), (47, 116, 112), (92, 84, 100), y=3, side=1, n=3)
    g.add("w_wave", wv)
    # Confucius: the atlas sprite plus a bow and a nod
    c0, c1 = thinker("confucius", 0), thinker("confucius", 1)
    g.add("con_idle_0", c0.a); g.add("con_idle_1", c1.a); g.add("con_bow", pose_bow(c0)); g.add("con_nod", nod(c0))
    g.done()
    faces(g.dir)

def faces(d):
    """the Wanderer's inset face (14 x 14 px, shown 2x): neutral, shiver, squint, smile. A hood with a dark opening."""
    H, Hd, Hl, DK = (47, 116, 112), (31, 79, 76), (84, 156, 146), (12, 20, 24)
    GOLD, GL2 = (255, 214, 140), (255, 196, 92)
    rows = [  # o outline, h hood, d hood shadow, l hood light, k face dark
        "....oooooo....",
        "..oollhhhhoo..",
        ".olhhhhhhhhdo.",
        ".lhhhhhhhhhhdo",
        "olhhkkkkkkhhdo",
        "ohhkkkkkkkkhdo",
        "ohhkkkkkkkkhdo",
        "ohhkkkkkkkkhdo",
        "ohhkkkkkkkkhdo",
        "ohhhkkkkkkhhdo",
        "ohhhhkkkkhhhdo",
        ".ohhhhhhhhhdo.",
        ".odhhhhhhhddo.",
        "..oooooooooo..",
    ]
    col = {"o": OUT, "h": H, "d": Hd, "l": Hl, "k": DK}
    base = np.zeros((14, 14, 4), np.uint8)
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch in col: base[y, x] = list(col[ch]) + [255]
    def f(eyes):
        a = base.copy()
        for x, y, c in eyes: a[y, x] = list(c) + [255]
        return a
    out = {
        "face_neutral": f([(5, 6, GOLD), (6, 6, GOLD), (5, 7, GL2), (6, 7, GL2), (8, 6, GOLD), (9, 6, GOLD), (8, 7, GL2), (9, 7, GL2)]),
        "face_shiver": f([(5, 6, (200, 220, 240)), (6, 6, (200, 220, 240)), (8, 6, (200, 220, 240)), (9, 6, (200, 220, 240)),
                          (6, 9, (200, 220, 240)), (7, 9, (120, 140, 160)), (8, 9, (200, 220, 240))]),   # pale eyes, chattering mouth
        "face_squint": f([(4, 7, GOLD), (5, 7, GOLD), (6, 6, GL2), (8, 6, GL2), (9, 7, GOLD), (10, 7, GOLD)]),    # eyes pressed to lines
        "face_smile": f([(5, 7, GOLD), (6, 6, GOLD), (7, 7, GOLD), (8, 7, GOLD), (9, 6, GOLD), (10, 7, GOLD), (6, 9, GL2), (7, 10, GL2), (8, 9, GL2)]),
    }
    piv = json.load(open(f"{d}/pivots.json"))
    for n, a in out.items():
        Image.fromarray(a, "RGBA").save(f"{d}/{n}.png"); piv[n] = [7, 14]
    json.dump(piv, open(f"{d}/pivots.json", "w"), indent=0)

# ------------------------------------------------------------------ the Buddha (bodhi, alms)
def g_buddha():
    g = Group("buddha_s")
    b0, b1 = thinker("buddha", 0), thinker("buddha", 1)
    g.add("bud_sit", sit_front(b0)); g.add("bud_sit_1", sit_front(b1))
    # villagers offering (two palette variants): stand, arms forward (offer), bow
    vil = [("woman", "plain", (150, 104, 66)), ("man", "plain", (96, 120, 92))]
    for i, (b, c, col) in enumerate(vil):
        f = recloth(generic(b, c, 0), col)
        g.add(f"vil{i}_stand", f.a); g.add(f"vil{i}_offer", arm_forward(f.a, f.cloth, f.skin, y=12, side=0, n=3))
        g.add(f"vil{i}_bow", pose_bow(f))
    host = recloth(generic("oldman", "fine", 0), (128, 40, 44))
    g.add("host_stand", host.a); g.add("host_offer", arm_forward(host.a, host.cloth, host.skin, y=12, side=0, n=3))
    g.add("host_bow", pose_bow(host))
    # the Wanderer with the alms bowl: walk up (2), hold out (to the right; flip for left), bow (to the right)
    for k in (0, 1):
        a = Q.atlas(f"wanderer_up_{k + 1}")
        g.add(f"wb_walk_{k}", a)
    wr = Q.atlas("wanderer_right_0")
    hold = arm_forward(wr, (47, 116, 112), (92, 84, 100), y=12, side=0, n=3, item=DBOWL)
    g.add("wb_hold", hold)
    bw = shift_rows(pad(wr.copy(), 0, 0, 0, 0), 0, 12, 2, 1); g.add("wb_bow", bw)
    g.add("wb_stand", Q.atlas("wanderer_down_0"))
    # three monks in the grove: seated, pour (rice from their bowls)
    for i, col in enumerate([(176, 110, 54), (160, 96, 50), (190, 124, 64)]):
        f = recloth(generic("oldman" if i == 1 else "man", "plain", 0), col)
        f.a = Q.youthify(f.a, f.beard) if i != 1 else f.a
        # shaved heads: hair rows become skin
        a = f.a.copy()
        for y in range(1, 5):
            for x in range(a.shape[1]):
                c = get(a, x, y)
                if c and c != OUT and c != f.skin and c not in (EYE,): px(a, x, y, P.shade(f.skin, .95))
        m = Fig(a, f.skin, col, None, None)
        s = sit_front(m); g.add(f"monk{i}_sit", s)
        g.add(f"monk{i}_pour", arm_forward(s, col, f.skin, y=11, side=0, n=3, item=DBOWL))
    g.done()

# ------------------------------------------------------------------ Laozi (slips, buffalo)
def g_laozi():
    g = Group("laozi_s")
    l0 = thinker("laozi", 0)
    s = sit_front(l0)
    BR = (40, 30, 26)
    for k, dy in ((0, -2), (1, 0)):                                      # brush up / brush down
        a = arm_forward(s, l0.cloth, l0.skin, y=12, side=0, n=3)
        h = a.shape[0]; xs = [x for x in range(a.shape[1]) if a[12, x, 3]]
        bx = max(xs) - 1
        for y in range(12 + dy - 3, 12 + dy): px(a, bx, y, BR)
        g.add(f"lao_write_{k}", outline_new(pad(a, 0, 0, 3, 0)))
    g.add("lao_sit", s)
    # riding the buffalo, seen from behind: the upper body and the robe over the back; two frames sway the hem
    bk = back_view(l0)
    for k in (0, 1):
        a = upper(bk, 17)
        if k == 1: a = shift_rows(a, 13, 17, 0, 1)
        g.add(f"lao_ride_{k}", a)
    # Yinxi, a gatekeeper with a simple official's cap: stand, bow, hold the bundle
    y0 = recloth(generic("man", "plain", 0), (84, 78, 112)); y0.a = Q.youthify(y0.a, y0.beard)
    a = pad(y0.a.copy(), 0, 0, 2, 0)
    CAP = (30, 26, 30)
    for x in range(5, 11): px(a, x, 1, CAP); px(a, x, 0, CAP)
    for x in (4, 11): px(a, x, 2, CAP)
    a = outline_new(a); yin = Fig(a, y0.skin, y0.cloth, None, None)
    g.add("yin_stand", a); g.add("yin_bow", pose_bow(yin))
    SLIP = [(dx, dy, (196, 170, 104) if dx % 2 else (170, 140, 80)) for dx in range(0, 4) for dy in (-2, -1, 0)]
    g.add("yin_hold", arm_forward(a, yin.cloth, yin.skin, y=13, side=0, n=2, item=SLIP))
    g.done()

# ------------------------------------------------------------------ Zhuangzi (ding, claypot)
def g_zhuangzi():
    g = Group("zhuangzi_s")
    z0 = thinker("zhuangzi", 0)
    s = sit_front(z0)
    up = arm_forward(s, z0.cloth, z0.skin, y=6, side=0, n=3)             # hand raised (mallet up)
    dn = arm_forward(s, z0.cloth, z0.skin, y=12, side=0, n=4)            # hand down on the pot
    g.add("zz_drum_up", up); g.add("zz_drum_down", dn); g.add("zz_relax", s)
    # Cook Ding: a cook in a plain apron and a white head cloth: stand, hold the knife, a small bow
    c = recloth(generic("man", "plain", 0), (96, 92, 84)); c.a = Q.youthify(c.a, c.beard)
    a = c.a.copy()
    for x in range(5, 11):
        for y in (1, 2): px(a, x, y, (230, 226, 214))                     # head cloth
    for y in range(13, 21):
        for x in range(5, 11):
            if a[y, x, 3] and get(a, x, y) != OUT: px(a, x, y, (226, 220, 204))   # apron
    cook = Fig(a, c.skin, c.cloth, None, None)
    g.add("ding_stand", a)
    KN = [(0, -1, (200, 206, 214)), (1, -1, (200, 206, 214)), (2, -1, (230, 234, 240)), (1, -2, (200, 206, 214)), (2, -2, (200, 206, 214)), (-1, 0, (110, 76, 46))]
    g.add("ding_knife", arm_forward(a, c.cloth, c.skin, y=13, side=0, n=3, item=KN))
    g.add("ding_bow", pose_bow(cook))
    g.done()

# ------------------------------------------------------------------ Confucius (analects, zither)
def g_confucius():
    g = Group("confucius_s")
    bodies = [("man", "plain"), ("woman", "plain"), ("man", "satchel"), ("woman", "fine")]
    pals = [[(70, 96, 84), (120, 92, 70), (84, 90, 130), (150, 110, 70)], [(110, 70, 80), (90, 110, 120), (130, 120, 80), (70, 70, 96)]]
    i = 0
    for p in range(2):
        for v, (b, c) in enumerate(bodies):
            f = recloth(generic(b, c, 0), pals[p][v]); f.a = Q.youthify(f.a, f.beard)
            g.add(f"stu{i}_sit", sit_front(f)); g.add(f"stu{i}_stand", f.a); g.add(f"stu{i}_bow", pose_bow(f))
            i += 1
    # the flute player (seated, 2 frames) and the chime player (seated, 2 frames: mallet up, down)
    fl = recloth(generic("woman", "plain", 0), (84, 126, 104)); sfl = sit_front(fl)
    FLUTE = [(dx, 0, (196, 170, 104)) for dx in range(0, 5)]
    g.add("flute_0", arm_forward(sfl, fl.cloth, fl.skin, y=9, side=0, n=2, item=FLUTE))
    g.add("flute_1", shift_rows(arm_forward(sfl, fl.cloth, fl.skin, y=9, side=0, n=2, item=FLUTE), 0, 8, 0, 0))
    ch = recloth(generic("oldman", "plain", 0), (120, 100, 70)); sch = sit_front(ch)
    MAL = [(0, -1, (110, 76, 46)), (0, -2, (110, 76, 46)), (0, -3, (150, 110, 70))]
    g.add("chime_up", arm_forward(sch, ch.cloth, ch.skin, y=7, side=1, n=3, item=MAL))
    g.add("chime_down", arm_forward(sch, ch.cloth, ch.skin, y=12, side=1, n=3, item=MAL))
    # the Wanderer seated behind the zither (seen from the front): hand up, pluck
    wd = Q.atlas("wanderer_down_0")
    ws = upper(wd, 14)
    g.add("wz_up", arm_forward(ws, (47, 116, 112), (92, 84, 100), y=9, side=0, n=3))
    g.add("wz_pluck", arm_forward(ws, (47, 116, 112), (92, 84, 100), y=12, side=0, n=3))
    g.add("wz_sit", ws)
    g.done()

# ------------------------------------------------------------------ Dogen (sitting, sandal)
def g_dogen():
    g = Group("dogen_s")
    wd = Q.atlas("wanderer_down_0")
    # seated in meditation (front): the robe spreads over crossed legs; still, head turned, breath (shoulders up 1 px)
    s = wd.copy(); s = np.concatenate([s[:15], s[19:20], s[19:21]], 0)
    s = pad(s, 2, 2, 0, 0)
    h = s.shape[0]
    for x in range(1, s.shape[1] - 1):
        if s[h - 3, x, 3] or x in range(2, s.shape[1] - 2): px(s, x, h - 2, (31, 79, 76))
    for x in range(1, s.shape[1] - 1): px(s, x, h - 1, OUT)
    s = outline_new(trim_keep_bottom(s)[0])
    # eyes lowered: the gold eyes become a dim line
    for y in range(4, 10):
        for x in range(s.shape[1]):
            if get(s, x, y) in ((255, 214, 140), (255, 196, 92), (255, 238, 170)): px(s, x, y, (150, 120, 80))
    g.add("wm_still", s)
    g.add("wm_breath", shift_rows(pad(s.copy(), 0, 0, 1, 0), 0, 12, -1))
    t = shift_rows(s.copy(), 0, 10, 0, 1)
    g.add("wm_turn", t)
    for k in (1, 2):
        g.add(f"ww_up_{k - 1}", Q.atlas(f"wanderer_up_{k}")); g.add(f"ww_down_{k - 1}", Q.atlas(f"wanderer_down_{k}"))
    g.add("ww_stand", wd)
    g.done()

GROUPS = {"shared": g_shared, "buddha_s": g_buddha, "laozi_s": g_laozi, "zhuangzi_s": g_zhuangzi,
          "confucius_s": g_confucius, "dogen_s": g_dogen}

def pack_group(name):
    import importlib.util
    from PIL import ImageDraw
    mat = importlib.util.module_from_spec(importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py"))
    mat.__spec__.loader.exec_module(mat)
    d = f"art/people42/{name}"; piv = json.load(open(f"{d}/pivots.json"))
    items = [(n, Image.open(f"{d}/{n}.png").convert("RGBA")) for n in piv]
    rects = mat.pack(items, f"{d}/people.png", width=512)
    json.dump({"prects": rects, "pivots": piv}, open(f"{d}/people.json", "w"))
    S = 6; cols = 12; cw, ch = 36 * S, 40 * S
    rows = (len(items) + cols - 1) // cols
    im = Image.new("RGBA", (cols * cw, rows * (ch + 14)), (52, 70, 72, 255)); dr = ImageDraw.Draw(im)
    for i, (n, f) in enumerate(items):
        x0 = (i % cols) * cw; y0 = (i // cols) * (ch + 14); pxv, pyv = piv[n]
        im.alpha_composite(f.resize((f.width * S, f.height * S), Image.NEAREST), (x0 + cw // 2 - pxv * S, y0 + ch - 6 - pyv * S))
        dr.text((x0 + 3, y0 + ch - 2), n[:30], fill=(255, 255, 255, 255))
    im.save(f"{d}/_review.png")

if __name__ == "__main__":
    for n in (sys.argv[1:] or GROUPS):
        GROUPS[n](); pack_group(n)
