#!/usr/bin/env python3
"""Phase 40A, agent B: Wanderer / crowd / Kierkegaard pose frames for the new mini-games
(leap, kierkegaard_s, nietzsche_s, camus_s, fromm_s).  Deterministic; run from /home/claude/el:  python3 tools/people40_b.py
Frames are derived from the characters atlas (copy pixels, shift rows, add limbs).  Pivot = [x, y] with y = the bottom edge
of the frame (the ground line under the feet) and x = between the feet."""
import sys, os, json, importlib.util
import numpy as np
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, "tools")
import people as P

ROOT = "/home/claude/el"
os.chdir(ROOT)
mat = importlib.util.module_from_spec(importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py"))
mat.__spec__.loader.exec_module(mat)

OUT = (24, 18, 30)
TEAL = {"b": (47, 116, 112), "c": (84, 156, 146), "d": (31, 79, 76)}
LEG, SHOE = (52, 40, 40), (34, 26, 28)
HAND = (92, 84, 100)           # the Wanderer's hands: a dull lilac-grey, readable against the outline and the teal
LANT = [[(58, 54, 66)] * 2, [(255, 238, 170), (255, 196, 92)], [(255, 196, 92)] * 2, [(58, 54, 66)] * 2]
SLATE = {"b": (107, 111, 122), "c": (140, 145, 158), "d": (72, 76, 88)}
EYE_DIM = (176, 180, 192)

# ---------------------------------------------------------------- atlas
_s = open("work/index.html").read(); _i = _s.find("ATLAS.chars=") + 12; _j = _s.find(";", _i)
RECTS = json.loads(_s[_i:_j])["rects"]
ATLAS = Image.open("blobs/1092ba9bca54f8ddf104f6d02f4310e8.png").convert("RGBA")

def W(name):
    x, y, w, h = RECTS[name]
    return np.array(ATLAS.crop((x, y, x + w, y + h))).copy()

def same(a, c): return a[..., 3] > 0 and tuple(a[..., :3]) == c

def recolor(a, mapping):
    a = a.copy()
    for src, dst in mapping.items():
        m = (a[..., 3] > 0) & np.all(a[..., :3] == np.array(src), -1)
        a[m] = list(dst) + [255]
    return a

TEAL_TO_SLATE = {TEAL[k]: SLATE[k] for k in "bcd"}

def ramp(base):
    return {"b": base, "c": P.shade(base, 1.3), "d": P.shade(base, .66)}

def teal_to(base):
    r = ramp(base)
    return {TEAL[k]: r[k] for k in "bcd"}

# ---------------------------------------------------------------- canvas
class Cv:
    """a big transparent canvas; frame coordinates (fx, fy) map to canvas (FX+fx, FY+fy)."""
    FX, FY, GY = 30, 30, 30 + 23
    def __init__(s, w=96, h=84): s.a = np.zeros((h, w, 4), np.uint8)
    def blit(s, src, fx, fy):
        x0, y0 = s.FX + fx, s.FY + fy
        h, w = src.shape[:2]
        sub = s.a[y0:y0 + h, x0:x0 + w]
        m = src[..., 3] > 0
        sub[m] = src[m]
    def put(s, fx, fy, c):
        s.a[s.FY + fy, s.FX + fx] = list(c[:3]) + [255]
    def ring(s, mask, skip=None, only_empty=False):
        p = np.pad(mask, 1)
        r = (p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]) & ~mask
        if skip is not None: r &= ~skip
        if only_empty: r &= s.a[..., 3] == 0
        s.a[r] = list(OUT) + [255]
    def mask(s, pts, t=2):
        m = np.zeros(s.a.shape[:2], bool)
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            n = max(abs(x1 - x0), abs(y1 - y0), 1)
            for k in range(n + 1):
                x = s.FX + round(x0 + (x1 - x0) * k / n); y = s.FY + round(y0 + (y1 - y0) * k / n)
                m[y:y + t, x:x + t] = True
        return m
    def crop(s, pivot_dx=8, min_pad=0):
        ys, xs = np.nonzero(s.a[..., 3])
        x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
        im = Image.fromarray(s.a[y0:y1, x0:x1], "RGBA")
        return im, [int(s.FX + pivot_dx - x0), int(y1 - y0)]

    # ---- limbs
    def leg(s, pts, toe=1, shoe_h=1):
        """a 2-px leg along pts (frame coords, last point = the top-left of the foot), shoe row at the end, toe px forward."""
        m = s.mask(pts)
        fx, fy = pts[-1]
        fm = np.zeros_like(m)
        for dy in range(shoe_h):
            for dx in range(2 + abs(toe)):
                x = fx + dx + (toe if toe < 0 else 0)
                fm[s.FY + fy + dy, s.FX + x] = True
        fm &= True
        s.ring(m | fm)
        s.a[m] = list(LEG) + [255]
        s.a[fm] = list(SHOE) + [255]
    def arm(s, pts, pal=TEAL, skipr=3, hand=HAND, hand_size=2, shade_top=True):
        m = s.mask(pts)
        hx, hy = pts[-1]
        hm = np.zeros_like(m); hm[s.FY + hy:s.FY + hy + hand_size, s.FX + hx:s.FX + hx + hand_size] = True
        sx, sy = pts[0]
        skip = np.zeros_like(m)
        yy, xx = np.mgrid[:m.shape[0], :m.shape[1]]
        skip |= ((xx - (s.FX + sx)) ** 2 + (yy - (s.FY + sy)) ** 2) <= skipr * skipr
        s.ring(m, skip=skip)
        s.a[m] = list(pal["b"]) + [255]
        p = np.pad(m, 1)
        top = m & ~p[:-2, 1:-1]; bot = m & ~p[2:, 1:-1]
        s.a[top] = list(pal["c"]) + [255]
        s.a[bot & ~top] = list(pal["d"]) + [255]
        s.a[m & hm] = list(hand) + [255]
    def lantern(s, fx, fy):
        """outline box with the 2x4 lantern inside; (fx, fy) = top-left of the outline box"""
        m = np.zeros(s.a.shape[:2], bool)
        m[s.FY + fy + 1:s.FY + fy + 5, s.FX + fx + 1:s.FX + fx + 3] = True
        s.ring(m)
        # corners of the box
        for dx in (0, 3):
            for dy in (0, 5):
                s.a[s.FY + fy + dy, s.FX + fx + dx] = list(OUT) + [255]
        for r in range(4):
            for c in range(2):
                s.a[s.FY + fy + 1 + r, s.FX + fx + 1 + c] = list(LANT[r][c]) + [255]

# ---------------------------------------------------------------- base bodies
def cap_right(a, y, fm):
    """end row y's fill at column fm and put the outline right after it (copies the neighbour colour if fm is empty)"""
    if a[y, fm, 3] == 0 or tuple(a[y, fm, :3]) == OUT:
        a[y, fm] = a[y, fm - 1]
    a[y, fm + 1:] = 0
    a[y, fm + 1] = list(OUT) + [255]

def cap_left(a, y, fm):
    if a[y, fm, 3] == 0 or tuple(a[y, fm, :3]) == OUT:
        a[y, fm] = a[y, fm + 1]
    a[y, :fm] = 0
    a[y, fm - 1] = list(OUT) + [255]

CAPS_R = {9: 10, 10: 10, 11: 11, 12: 11, 13: 11, 14: 11, 15: 11, 16: 11, 17: 12, 18: 12, 19: 12}
CAPS_DOWN = dict(CAPS_R)

def strip(name, side="R", caps=None):
    """frame rows 0..20 (hood, cloak, hem outline) with the lantern and the arm nub removed and the edge re-outlined.
    side 'R' = arm on the right (right / down frames); 'L' = left frame (mirrored caps)."""
    a = W(name)[:21].copy()
    caps = caps or CAPS_R
    for y, fm in caps.items():
        if side == "R":
            if y in (9, 10):
                a[y, fm + 2:] = 0
            else:
                cap_right(a, y, fm)
        else:
            mfm = 15 - fm
            if y in (9, 10):
                a[y, :mfm - 1] = 0
            else:
                cap_left(a, y, mfm)
    return a

def strip_up(name):
    a = W(name)[:21].copy()
    for y in range(9, 20):
        cap_right(a, y, 12)
    # the up frame's left side is already clean
    return a

def delete_rows(a, rows):
    keep = [y for y in range(a.shape[0]) if y not in rows]
    return a[keep]

def shear(a, fn):
    """shift row y by fn(y) px (positive = right); returns (array, offset) with offset = leftmost pad in px"""
    h, w = a.shape[:2]
    sh = [int(fn(y)) for y in range(h)]
    lo, hi = min(sh), max(sh)
    out = np.zeros((h, w + hi - lo, 4), np.uint8)
    for y in range(h):
        out[y, sh[y] - lo:sh[y] - lo + w] = a[y]
    return out, lo

def lean_fn(amount, h=21):
    """top shifts right by `amount` relative to the bottom (negative = lean back)"""
    return lambda y: round(amount * (h - 1 - y) / (h - 1))

def flare(a, rows, amt, mid=6):
    """widen the hem: rows 'rows' (list) get the left half moved left and the right half right by a growing amount"""
    h, w = a.shape[:2]
    out = np.zeros((h, w + 2 * amt, 4), np.uint8)
    out[:, amt:amt + w] = a
    for k, y in enumerate(rows):
        d = round(amt * (k + 1) / len(rows))
        row = a[y]
        out[y] = 0
        out[y, amt - d:amt - d + mid + 1] = row[:mid + 1]
        out[y, amt + mid + 1 + d:amt + w + d] = row[mid + 1:]
        # fill the seam
        for x in range(amt - d + mid + 1, amt + mid + 1 + d):
            out[y, x] = row[mid]
    return out, amt

FRAMES = {}   # group -> list of (name, img, pivot)

def emit(group, name, cv, pivot_dx=8, pivot=None):
    im, pv = cv.crop(pivot_dx)
    if pivot is not None: pv = pivot
    FRAMES.setdefault(group, []).append((name, im, pv))

def place_upper(cv, up, off, fx, fy):
    """blit upper body array (with shear offset) so that its original column 0 sits at frame x=fx"""
    cv.blit(up, fx + off, fy)

# ================================================================== GROUP: leap
def carry(cv, pts, pal=TEAL, lantern=True, skipr=3):
    """an arm along pts whose last point is the hand, with the lantern hanging from it"""
    cv.arm(pts, pal=pal, skipr=skipr)
    if lantern:
        hx, hy = pts[-1]
        cv.lantern(hx - 1, hy + 2)

def leap_group():
    g = "leap"
    base = strip("wanderer_right_0")        # 21 rows

    def crouch(D, L):
        c = D + L - 3
        a = delete_rows(base, [12, 14, 16, 18][:c])
        top = 23 - L - (a.shape[0] - 1)    # frame y of the upper's first row so that the hem sits L rows above the bottom
        hemy = top + a.shape[0] - 1
        cv = Cv()
        cv.leg([(5, hemy - 1), (4, 22 if L > 1 else 23), (3, 23)], toe=1)
        cv.leg([(9, hemy - 1), (13, hemy + (1 if L > 1 else 0)), (11, 23)], toe=1)
        return cv, a, top

    # ---- gather_0: body 2 px lower, knees bent, lantern arm hanging
    cv, a, top = crouch(2, 2)
    cv.blit(a, 0, top)
    carry(cv, [(10, top + 10), (12, top + 11)])
    emit(g, "w_gather_0", cv)
    # ---- gather_1: 4 px lower, both arms swung back ready to spring
    cv, a, top = crouch(4, 1)
    cv.arm([(4, top + 11), (0, top + 11), (-3, top + 13)])                # far arm, behind the body
    cv.blit(a, 0, top)
    carry(cv, [(6, top + 11), (3, top + 13), (0, top + 14)])             # near arm swung back, lantern low behind
    emit(g, "w_gather_1", cv)

    # ---- leap: lean forward, both arms forward, legs tucked
    up, off = shear(base, lean_fn(4))
    cv = Cv()
    cv.leg([(5, 20), (3, 22), (1, 22)], toe=-1)          # trailing, tucked leg
    cv.arm([(8 + off + 4, 9), (15, 5), (19, 3)])             # far arm, forward and up
    cv.blit(up, off, 0)
    cv.leg([(9, 20), (12, 22), (10, 23)], toe=1)         # near knee drawn up and forward
    carry(cv, [(11, 10), (15, 9), (19, 8)])                  # near arm with the lantern swinging below the hand
    emit(g, "w_leap", cv)

    # ---- land: knees bent, cloak flared a little, arms out for balance
    a = delete_rows(base, [14])
    a, foff = flare(a, [16, 17, 18, 19], 2)
    cv = Cv()
    top = 23 - 2 - (a.shape[0] - 1)
    hemy = top + a.shape[0] - 1
    cv.leg([(6, hemy - 1), (5, 22), (4, 23)], toe=1)
    cv.leg([(11, hemy - 1), (14, hemy), (13, 23)], toe=1)
    cv.arm([(5, top + 11), (1, top + 10), (-3, top + 11)])           # far arm out behind
    cv.blit(a, -foff, top)
    carry(cv, [(10, top + 10), (13, top + 12), (16, top + 12)])
    emit(g, "w_land", cv)

    # ---- nudged: leaning back, one arm out for balance
    up, off = shear(base, lean_fn(-3))
    cv = Cv()
    cv.leg([(4, 21), (3, 22), (1, 23)], toe=1)
    cv.leg([(9, 21), (9, 22), (8, 23)], toe=1)
    cv.arm([(3, 11), (-1, 8), (-4, 5)])                      # far arm thrown out behind and up
    cv.blit(up, off + 3, 0)
    carry(cv, [(9, 10), (12, 12), (12, 13)])
    emit(g, "w_nudged", cv)

    # ---- cushion: sitting in the air (people.sit)
    seat = P.sit(Image.fromarray(W("wanderer_right_0"), "RGBA"))
    cv = Cv(); cv.blit(np.array(seat), 0, 0)
    emit(g, "w_cushion", cv)

    # ---- crowd (slate, no lantern, facing right)
    cb = recolor(strip("wanderer_right_0"), TEAL_TO_SLATE)
    cb = recolor(cb, {(255, 214, 140): EYE_DIM})

    def crowd(name, legs_from, up_dy=0, fn=None, head_flip=False, arm=None):
        a = cb.copy()
        if head_flip:
            hd = a[:9, :13].copy()
            a[:9, :13] = 0
            a[:9, :13] = hd[:, ::-1]
        if fn:
            a, off = shear(a, fn)
        else:
            off = 0
        cv = Cv()
        l = W(legs_from)[21:24]
        cv.blit(l, 0, 21)
        cv.blit(a, off, up_dy)
        if arm: arm(cv)
        emit(g, name, cv)
    crowd("crowd_walk_0", "wanderer_right_1")
    crowd("crowd_walk_1", "wanderer_right_2", up_dy=-1)
    crowd("crowd_stand", "wanderer_right_0")
    crowd("crowd_chat_0", "wanderer_right_0", fn=lean_fn(1))
    crowd("crowd_chat_1", "wanderer_right_0", head_flip=True,
          arm=lambda cv: cv.arm([(10, 11), (13, 9), (14, 7)], pal=SLATE))

    # ---- kier_nod
    k = W("kierkegaard_0")
    n = k.copy()
    head = k[:10].copy()
    n[:11] = k[:11]
    n[0] = 0
    n[1:11][head[:, :, 3] > 0] = head[head[:, :, 3] > 0]
    # the row that held the chin now holds the collar: restore the shoulder row beneath the head
    cv = Cv(); cv.blit(n, 0, 0)
    emit(g, "kier_nod", cv)

# ================================================================== GROUP: kierkegaard_s
def slate_ramp(base):
    return teal_to(base)

def bow_head(a):
    """a: 21-row stripped 'down' body in any colour: hide the face under the hood and drop the head 1 px (a bowed head)"""
    a = a.copy()
    E, F = (12, 20, 24), (255, 214, 140)
    main = tuple(a[3, 7, :3])                     # a hood-main pixel
    for y in range(4, 8):
        for x in range(16):
            if a[y, x, 3] and tuple(a[y, x, :3]) in (E, F, (176, 180, 192)):
                a[y, x] = list(main) + [255]
    hi = tuple(a[3, 5, :3])
    out = a.copy()
    head = a[:9]
    m = head[..., 3] > 0
    out[0] = 0
    sub = out[1:10]
    sub[m] = head[m]
    return out

def kierkegaard_group():
    g = "kierkegaard_s"
    for nm, fr in (("cr_walk_0", "wanderer_down_1"), ("cr_walk_1", "wanderer_down_2")):
        a = recolor(strip(fr, "R", CAPS_DOWN), TEAL_TO_SLATE)
        a = bow_head(a)
        cv = Cv()
        cv.blit(W(fr)[21:24], 0, 21)
        cv.blit(a, 0, 0)
        emit(g, nm, cv)
    for nm, col in (("cr_look_ochre", (200, 146, 58)), ("cr_look_teal", (79, 179, 169)), ("cr_look_rose", (212, 106, 140)),
                    ("cr_look_green", (94, 158, 90))):
        a = recolor(strip("wanderer_down_0", "R", CAPS_DOWN), teal_to(col))
        a = recolor(a, {(255, 214, 140): (236, 232, 220)})
        cv = Cv()
        cv.blit(W("wanderer_down_0")[21:24], 0, 21)
        cv.blit(a, 0, 0)
        emit(g, nm, cv)

# ================================================================== GROUP: nietzsche_s
def nietzsche_group():
    g = "nietzsche_s"
    # ---- New Tablets: both arms up, lantern high
    a = strip("wanderer_down_0", "R", CAPS_DOWN)
    cv = Cv()
    cv.blit(W("wanderer_down_0")[21:24], 0, 21)
    cv.blit(a, 0, 0)
    cv.arm([(3, 10), (0, 6), (1, 0), (4, -5)], skipr=2)
    cv.arm([(12, 10), (15, 6), (14, 0), (10, -5)], skipr=2)
    cv.lantern(6, -9)
    emit(g, "w_lift", cv)

    # ---- Once More!: side view, facing right
    base = strip("wanderer_right_0")
    def run(name, dy, lean, front, back, near_arm, far_arm, pdx=8, near_first=True):
        """front / back = leg specs [(pts, toe)], near_arm / far_arm = pts or None"""
        up, off = shear(base, lean_fn(lean)) if lean else (base, 0)
        cv = Cv()
        legs = [back, front] if near_first else [front, back]
        for pts, toe in legs[:1]: cv.leg(pts, toe=toe)
        if far_arm: cv.arm(far_arm)
        for pts, toe in legs[1:]: cv.leg(pts, toe=toe)
        cv.blit(up, off, dy)
        if near_arm: carry(cv, near_arm)
        emit(g, name, cv, pivot_dx=pdx + (lean_fn(lean)(20) if lean else 0))
    # contact, near leg forward (long stride)
    run("w_run_0", 1, 2, front=([(9, 20), (12, 23)], 1), back=([(5, 20), (2, 22)], -1),
        near_arm=[(10, 11), (14, 12), (15, 13)], far_arm=[(5, 11), (2, 12), (0, 13)])
    # passing, body up 1: one leg under the body, the other swinging through bent
    run("w_run_1", -1, 2, front=([(8, 19), (8, 23)], 1), back=([(7, 19), (10, 21), (7, 22)], -1),
        near_arm=[(10, 9), (12, 11), (12, 13)], far_arm=None)
    # contact, the other leg forward (a touch longer, far leg drawn under)
    run("w_run_2", 1, 2, front=([(8, 20), (13, 23)], 1), back=([(5, 20), (1, 21)], -1),
        near_arm=[(8, 11), (5, 13), (3, 14)], far_arm=[(10, 10), (14, 10), (17, 11)], near_first=False)
    run("w_run_3", -1, 2, front=([(8, 19), (8, 23)], 1), back=([(6, 19), (3, 21), (5, 22)], -1),
        near_arm=[(10, 9), (12, 11), (12, 13)], far_arm=None, near_first=False)

    # hop: both feet off the ground, knees up, lantern arm lifted
    cv = Cv()
    cv.leg([(6, 19), (9, 21), (5, 23)], toe=-1)
    cv.arm([(4, 8), (2, 5), (1, 2)])
    cv.blit(base, 0, -2)
    cv.leg([(9, 19), (13, 21), (11, 23)], toe=1)
    carry(cv, [(10, 8), (13, 5), (14, 3)])
    emit(g, "w_hop", cv)

    # trip: pitched forward, one foot caught behind (not a fall)
    up, off = shear(base, lean_fn(5))
    cv = Cv()
    cv.leg([(5, 20), (0, 19), (-3, 16)], toe=0, shoe_h=2)          # the caught foot, hooked up behind
    cv.arm([(8 + 3, 9), (15, 8), (19, 7)])                   # far arm reaching forward for balance
    cv.blit(up, off, 0)
    cv.leg([(9, 21), (11, 22), (11, 23)], toe=1)         # the planted foot ahead
    carry(cv, [(10, 11), (15, 11), (19, 12)])
    emit(g, "w_trip", cv, pivot_dx=8)

    # stagger: leaning back, arms flailing a little
    up, off = shear(base, lean_fn(-3))
    cv = Cv()
    cv.leg([(5, 21), (4, 22), (2, 23)], toe=-1)
    cv.arm([(3, 11), (-1, 13), (-4, 11)])
    cv.blit(up, off + 3, 0)
    cv.leg([(9, 21), (12, 22), (13, 23)], toe=1)
    carry(cv, [(9, 10), (13, 7), (15, 4)])
    emit(g, "w_stagger", cv)

    # glide: arms spread wide like wings, cloak streaming back
    fn = lambda y: round(3 - 6 * max(0, y - 6) / 14) if y > 6 else 3
    up, off = shear(base, fn)
    cv = Cv()
    cv.leg([(4, 20), (-2, 21), (-5, 22)], toe=-1)
    cv.arm([(2, 10), (-3, 6), (-8, 3)])                      # far wing, back
    cv.blit(up, off, 0)
    carry(cv, [(8, 10), (14, 6), (20, 3)])                    # near wing, forward, the lantern swinging from the hand
    emit(g, "w_glide", cv, pivot_dx=8 + fn(20))

# ================================================================== GROUP: camus_s
def reel(cv, x, y, spin=0):
    """a small kite reel (5 x 5, a spool on its side): wooden flanges, gold thread, a crank pixel; (x, y) = top-left"""
    WOOD, WOOD_D, THR, THR_D, THR_L = (122, 82, 50), (86, 56, 34), (245, 198, 106), (217, 169, 58), (255, 238, 170)
    m = np.zeros(cv.a.shape[:2], bool)
    m[cv.FY + y:cv.FY + y + 5, cv.FX + x:cv.FX + x + 5] = True
    cv.ring(m)
    for yy in range(5):
        for xx in range(5):
            if xx in (0, 4): c = WOOD_D if xx == 4 else WOOD
            else: c = THR_L if (xx == 1 and yy == 1) else (THR_D if yy >= 3 or xx == 3 else THR)
            cv.put(x + xx, y + yy, c)
    cv.put(x + 2, y + 2 + spin, (58, 54, 66))                  # the axle / crank

def camus_group():
    g = "camus_s"
    base = strip_up("wanderer_up_0")
    legs = W("wanderer_up_0")[21:24]
    def pose(name, spin, rx, ry, left, right):
        cv = Cv()
        cv.blit(legs, 0, 21)
        cv.blit(base, 0, 0)
        cv.arm(left, skipr=2); cv.arm(right, skipr=2)
        reel(cv, rx, ry, spin)
        cv.lantern(12, 15)                                       # hung from the belt at the right hip
        emit(g, name, cv)
    # pull: elbows in and back, the reel drawn close to the belly, hands low
    pose("w_reel_pull", 0, 5, 14, [(2, 10), (1, 13), (3, 15)], [(11, 10), (12, 13), (10, 15)])
    # give: arms lifted and out in front, the reel high and forward
    pose("w_reel_give", 1, 5, 5, [(2, 10), (0, 8), (3, 6)], [(11, 10), (13, 8), (10, 6)])

# ================================================================== GROUP: fromm_s
def fromm_group():
    g = "fromm_s"
    WOOD, WOOD_D, WOOD_L = (122, 82, 50), (86, 56, 34), (160, 112, 70)
    # ---- sit: on a low stool, facing down; the lantern held in the lap
    a = strip("wanderer_down_0", "R", CAPS_DOWN)
    a = delete_rows(a, [12, 14, 16])               # 18 rows
    top = 2
    cv = Cv()
    sy = top + 14                                   # the seat's top row
    seat = np.zeros(cv.a.shape[:2], bool)
    seat[cv.FY + sy:cv.FY + sy + 4, cv.FX - 2:cv.FX + 16] = True
    legm = np.zeros_like(seat)
    for lx in (-1, 14):
        legm[cv.FY + sy + 4:cv.FY + 24, cv.FX + lx:cv.FX + lx + 2] = True
    cv.ring(seat | legm)
    cv.a[legm] = list(WOOD_D) + [255]
    for lx in (-1, 14):
        cv.a[cv.FY + sy + 4:cv.FY + 24, cv.FX + lx] = list(WOOD) + [255]
    cv.a[seat] = list(WOOD) + [255]
    cv.a[cv.FY + sy, cv.FX - 2:cv.FX + 16] = list(WOOD_L) + [255]
    cv.a[cv.FY + sy + 3, cv.FX - 2:cv.FX + 16] = list(WOOD_D) + [255]
    cv.leg([(4, 20), (4, 22)], toe=0, shoe_h=2)
    cv.leg([(9, 20), (9, 22)], toe=0, shoe_h=2)
    cv.blit(a, 0, top)
    # one hand on the knee, the other holding the lantern in the lap
    hm = np.zeros(cv.a.shape[:2], bool); hm[cv.FY + top + 12:cv.FY + top + 14, cv.FX + 2:cv.FX + 4] = True
    cv.ring(hm); cv.a[hm] = list(HAND) + [255]
    carry(cv, [(10, top + 9), (11, top + 11), (10, top + 12)])
    emit(g, "w_sit", cv)

    # ---- water / prune: standing, facing left, lantern hung at the back of the belt
    base = strip("wanderer_left_0", "L")
    legs = W("wanderer_left_0")[21:24]
    def stand(name, fn, far, near, lant=(12, 13)):
        up, off = shear(base, fn) if fn else (base, 0)
        cv = Cv()
        cv.blit(legs, 0, 21)
        if far: cv.arm(far, skipr=2)
        cv.blit(up, off, 0)
        cv.lantern(*lant)
        if near: cv.arm(near, skipr=3)
        emit(g, name, cv)
    stand("w_water", None, [(6, 9), (1, 11), (-4, 11)], [(6, 11), (1, 13), (-3, 14)])
    stand("w_prune", lean_fn(-3), [(4, 12), (0, 14), (-4, 15)], [(5, 13), (1, 15), (-3, 17)])

# ================================================================== output
BG = {"leap": ("leap-bg", (190, 420)), "kierkegaard_s": ("kierkegaard-sbg", (190, 500)), "nietzsche_s": ("nietzsche-sbg", (200, 400)),
      "camus_s": ("camus-sbg", (200, 470)), "fromm_s": ("fromm-sbg", (240, 420))}

def font(sz=11):
    for f in ("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf", "/usr/share/fonts/dejavu/DejaVuSansMono.ttf"):
        if os.path.exists(f): return ImageFont.truetype(f, sz)
    return ImageFont.load_default()

def write_group(g):
    items = FRAMES[g]
    os.makedirs(f"art/people40/{g}", exist_ok=True)
    rects = mat.pack([(n, im) for n, im, pv in items], f"art/people40/{g}/people.png", width=256)
    pivots = {n: pv for n, im, pv in items}
    json.dump({"prects": rects, "pivots": pivots, "notes": NOTES.get(g, "")}, open(f"art/people40/{g}/people.json", "w"), indent=1)
    # review sheet: every frame at 6x on (38,34,48), name above
    S, cellw, pad = 6, 0, 14
    maxw = max(im.width for n, im, pv in items); maxh = max(im.height for n, im, pv in items)
    cw, ch = maxw * S + 16, maxh * S + 34
    cols = min(len(items), max(1, 1100 // cw))
    rows = (len(items) + cols - 1) // cols
    sheet = Image.new("RGBA", (cols * cw, rows * ch), (38, 34, 48, 255))
    d = ImageDraw.Draw(sheet); f = font(11)
    for k, (n, im, pv) in enumerate(items):
        x0, y0 = (k % cols) * cw, (k // cols) * ch
        d.text((x0 + 6, y0 + 4), n, fill=(230, 226, 214), font=f)
        big = im.resize((im.width * S, im.height * S), Image.NEAREST)
        ox, oy = x0 + 8, y0 + 22 + (maxh * S - big.height)
        sheet.alpha_composite(big, (ox, oy))
        px, py = ox + pv[0] * S, oy + pv[1] * S - 1
        d.line([(px - 5, py), (px + 5, py)], fill=(255, 80, 80)); d.line([(px, py - 5), (px, py + 5)], fill=(255, 80, 80))
    # in-game composites at 2x on the backdrop
    bgname, (cx, cy) = BG[g]
    bg = Image.open(f"art/proc40/bg/{bgname}.png").convert("RGBA")
    n = len(items)
    per = 8
    cw2, ch2 = 130, 170
    brow = Image.new("RGBA", (max(cols * cw, per * cw2), ((n + per - 1) // per) * ch2), (0, 0, 0, 255))
    for k, (nm, im, pv) in enumerate(items):
        bx, by = (k % per) * cw2, (k // per) * ch2
        x0 = max(0, min(bg.width - cw2, cx - cw2 // 2)); y0 = max(0, min(bg.height - ch2, cy - ch2 + 30))
        tile = bg.crop((x0, y0, x0 + cw2, y0 + ch2))
        big = im.resize((im.width * 2, im.height * 2), Image.NEAREST)
        tile.alpha_composite(big, (cx - x0 - pv[0] * 2, cy - y0 - pv[1] * 2))
        brow.alpha_composite(tile, (bx, by))
    W_ = max(sheet.width, brow.width)
    full = Image.new("RGBA", (W_, sheet.height + brow.height + 4), (0, 0, 0, 255))
    full.alpha_composite(sheet, (0, 0)); full.alpha_composite(brow, (0, sheet.height + 4))
    full.convert("RGB").save(f"art/people40/{g}/_review.png")

NOTES = {
    "leap": "Wanderer facing right (w_*), grey crowd figure (crowd_*, slate #6B6F7A, opaque, no lantern, dim eye), kier_nod = kierkegaard_0 head down 1 px. Pivot y = bottom edge of the frame; x = between the feet / hem centre.",
    "kierkegaard_s": "Townsperson facing down, slate cloak (cr_walk_*, head bowed 1 px with the face hidden) and lifted-head looks in ochre/teal/rose/green (face visible, pale eyes). 16x24 (walk 16x23 trimmed). Pivot y = bottom edge.",
    "nietzsche_s": "w_lift faces down (lantern held overhead between both hands); run/hop/trip/stagger/glide face right. Airborne frames: pivot = hem centre at the frame bottom (the feet), the game adds the height.",
    "camus_s": "Wanderer from behind (wanderer_up_0 body); the reel is drawn in front of the torso so it reads from behind. Lantern hung at the right hip.",
    "fromm_s": "w_sit faces down on a low stool, lantern in the lap. w_water / w_prune face left; hands only (the can is a separate piece: hands at about x=-4..-3, y=11 and 14 in w_water), lantern hung at the back of the belt.",
}

GROUPS = {"leap": leap_group, "kierkegaard_s": kierkegaard_group, "nietzsche_s": nietzsche_group, "camus_s": camus_group,
          "fromm_s": fromm_group}

def build_one(g):
    FRAMES.pop(g, None)
    GROUPS[g]()

def build():
    for g in GROUPS:
        build_one(g)
        write_group(g)

if __name__ == "__main__":
    build()
