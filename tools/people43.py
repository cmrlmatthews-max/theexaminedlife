#!/usr/bin/env python3
"""Plan 5, Phase 43A: Level IV people frames (map scale, 1 px = half a unit; shown at 2x by the game).
Run from /home/claude/el:  python3 tools/people43.py [group ...]
Output: art/people43/<group>/<frame>.png, pivots.json, people.png, people.json {prects, pivots}, _review.png.
Pivot = [x between the feet, y = frame height] (the ground line). Seated frames: the pivot is the seat line (bottom row).
Upper-body frames (nb_wave_*: a neighbor at a window) are cut at the sill: the pivot y is the bottom row.
Reuses tools/people41.py and tools/people42.py helpers."""
import sys, os, json
import numpy as np
from PIL import Image
sys.path.insert(0, "tools")
import people as P
import people41 as Q
import people42 as R
from people41 import Fig, pad, px, get, shift_rows, flip, outline_new, trim_keep_bottom, sit_front, side_view, back_view
from people41 import walk_front, pose_point, generic, arm_up, OUT
from people42 import recloth, recolor, arm_forward, upper, pose_bow, nod

os.chdir("/home/claude/el")
EYE = (36, 22, 18)
SK = (222, 182, 150)


class Group(Q.Group):
    def __init__(s, name):
        s.name = name; s.dir = f"art/people43/{name}"; os.makedirs(s.dir, exist_ok=True); s.piv = {}


def fig_atlas(name, cloth, hair=None, beard=None, skin=SK):
    return Fig(Q.atlas(name), skin, cloth, hair, beard, foot=(34, 26, 28))


def mouth_open(a, y=9):
    """a talking mouth: one dark pixel under the eyes, centered"""
    a = a.copy(); xs = [x for x in range(a.shape[1]) if a[y, x, 3] and get(a, x, y) != OUT]
    if xs:
        cx = (min(xs) + max(xs)) // 2; px(a, cx, y, (110, 50, 44)); px(a, cx + 1, y, (110, 50, 44))
    return a


def turn_head(a, dx, rows=10):
    """the head (rows 0..rows-1) turned a pixel toward dx (+1 = image right)"""
    return shift_rows(pad(a.copy(), 1, 1, 0, 0), 0, rows, 0, dx)


def head_up(a, rows=10):
    """looking up: the head rises a pixel and the eyes move up a row"""
    b = shift_rows(pad(a.copy(), 0, 0, 1, 0), 0, rows + 1, -1)
    return b


QUILL = [(0, -1, (240, 236, 224)), (1, -2, (240, 236, 224)), (1, -3, (220, 214, 200)), (2, -4, (220, 214, 200))]
BOOK_BLUE = [(dx, dy, (40, 52, 96) if dx in (0, 3) or dy == -3 else (58, 74, 128)) for dx in range(0, 4) for dy in (-3, -2, -1)]
SPOOL = [(0, -2, (120, 84, 50)), (1, -2, (120, 84, 50)), (2, -2, (120, 84, 50)), (0, -1, (250, 210, 110)), (1, -1, (255, 236, 160)), (2, -1, (250, 210, 110)),
         (0, 0, (120, 84, 50)), (1, 0, (120, 84, 50)), (2, 0, (120, 84, 50))]
HAT = [(-1, -1, (30, 28, 34)), (0, -1, (30, 28, 34)), (1, -1, (30, 28, 34)), (2, -1, (30, 28, 34)), (0, -2, (40, 38, 46)), (1, -2, (40, 38, 46))]
POLE = [(0, -k, (70, 60, 52)) for k in range(1, 9)] + [(0, -9, (250, 200, 100)), (1, -9, (255, 236, 160))]
DRUM = [(dx, dy, (150, 60, 50) if dy == 0 else (230, 220, 200)) for dx in range(0, 4) for dy in (-1, 0)]
FIDDLE = [(0, 0, (150, 96, 50)), (1, 0, (170, 110, 60)), (1, -1, (150, 96, 50)), (2, -1, (150, 96, 50)), (2, -2, (110, 70, 40)), (3, -3, (110, 70, 40))]
STRING_END = [(0, -1, (255, 226, 150)), (1, -1, (255, 240, 190)), (1, -2, (255, 226, 150))]
SEATED_BOOK = [(5, 15), (6, 15), (7, 15), (8, 15), (9, 15), (10, 15)]


def book_on_lap(a, up=False):
    """an open book held at the waist (seated): cream pages with a dark spine"""
    a = a.copy(); y = 13 if up else 14
    for x in range(5, 11): px(a, x, y, (236, 226, 196))
    px(a, 7, y, (150, 120, 80)); px(a, 8, y, (150, 120, 80))
    for x in range(5, 11): px(a, x, y + 1, (110, 70, 50))
    return a


def book_held(a, y):
    """an open book (cream pages, dark spine, brown cover) held across the body at row y"""
    a = pad(a.copy(), 1, 1, 0, 0)
    for x in range(4, 14): px(a, x, y, (240, 230, 200)); px(a, x, y + 1, (226, 214, 184))
    px(a, 8, y, (130, 100, 70)); px(a, 9, y, (130, 100, 70)); px(a, 8, y + 1, (130, 100, 70)); px(a, 9, y + 1, (130, 100, 70))
    for x in range(4, 14): px(a, x, y + 2, (110, 64, 44))
    return outline_new(a)


def eyes_down(a, skin):
    a = a.copy()
    for y in range(3, 10):
        for x in range(a.shape[1]):
            if get(a, x, y) == EYE:
                px(a, x, y, P.shade(skin, .8))
                if y + 1 < a.shape[0]: px(a, x, y + 1, EYE)
    return a


# ------------------------------------------------------------------ Aquinas (summa, ox)
def g_aquinas():
    g = Group("aquinas_s")
    HABIT = (238, 234, 222)
    a0 = fig_atlas("aquinas_0", HABIT, (40, 30, 24))
    g.add("aq_stand", a0.a)
    g.add("aq_reach", arm_up(a0.a.copy(), 0, SK, HABIT, 2))                                   # reaching up to catch
    for k, dy in ((0, -1), (1, 1)):                                                            # writing at the lectern
        w = arm_forward(a0.a, HABIT, SK, y=13 + dy, side=0, n=3, item=QUILL)
        g.add(f"aq_write_{k}", w)
    # young Aquinas, seated behind the desk: writing (quill up / down) and still
    ya = Fig(Q.youthify(a0.a, None), SK, HABIT, (40, 30, 24))
    s = sit_front(ya)
    g.add("yaq_write_0", arm_forward(s, HABIT, SK, y=11, side=0, n=3, item=QUILL))
    g.add("yaq_write_1", arm_forward(s, HABIT, SK, y=12, side=0, n=3, item=QUILL))
    g.add("yaq_still", s)
    # four classmates on the benches: chatter (2), turned to watch the desk (1). cls0/cls1 sit left (watch right), cls2/cls3 right.
    pals = [("man", "plain", (120, 96, 70)), ("man", "satchel", (84, 90, 110)), ("man", "plain", (110, 80, 84)), ("man", "satchel", (96, 104, 80))]
    for i, (b, c, col) in enumerate(pals):
        f = recloth(generic(b, c, 0), col); f.a = Q.youthify(f.a, f.beard)
        st = sit_front(f)
        g.add(f"cls{i}_chat_0", mouth_open(st))
        g.add(f"cls{i}_chat_1", pose_point(Fig(st, f.skin, f.cloth, f.hair, f.beard), 0 if i < 2 else 1))
        g.add(f"cls{i}_watch", turn_head(st, 1 if i < 2 else -1))
    # Albert the Great: an elder Dominican (white habit, black cloak), white hair and beard: stand, nod
    al = recolor(a0.a, {(40, 30, 24): (210, 206, 196), (40, 30, 26): (196, 192, 184)})
    for (x, y) in [(6, 9), (7, 9), (8, 9), (9, 9), (6, 10), (7, 10), (8, 10), (9, 10), (7, 11), (8, 11)]:
        if al[y, x, 3] and get(al, x, y) != OUT: px(al, x, y, (226, 222, 212))
    g.add("alb_stand", al); g.add("alb_nod", nod(Fig(al, SK, HABIT)))
    g.done()


# ------------------------------------------------------------------ Kant (kantwalk, citymap)
def g_kant():
    g = Group("kant_s")
    KC = (44, 42, 52)
    k0 = fig_atlas("kant_0", KC, (226, 222, 212))
    g.add("kant_stand", k0.a)
    g.add("kant_walk_0", side_view(k0, 0)); g.add("kant_walk_1", side_view(k0, 1))          # facing right; flip for left
    bk = Fig(back_view(k0), SK, KC, (226, 222, 212))
    g.add("kant_up_0", walk_front(bk, 0)); g.add("kant_up_1", walk_front(bk, 1))            # extra: walking up the screen
    g.add("kant_down_0", walk_front(k0, 0)); g.add("kant_down_1", walk_front(k0, 1))        # extra: walking down
    g.add("kant_hat", arm_up(k0.a.copy(), 0, SK, KC, 3, item=HAT))                          # tipping his hat
    # two band musicians: a drummer and a fiddler (2 frames each)
    d = recloth(generic("man", "plain", 0), (120, 60, 56)); d.a = Q.youthify(d.a, d.beard)
    g.add("band0_0", arm_forward(d.a, d.cloth, d.skin, y=12, side=0, n=2, item=DRUM))
    g.add("band0_1", arm_forward(d.a, d.cloth, d.skin, y=13, side=0, n=2, item=DRUM))
    fd = recloth(generic("woman", "fine", 0), (70, 96, 120))
    g.add("band1_0", arm_forward(fd.a, fd.cloth, fd.skin, y=10, side=0, n=2, item=FIDDLE))
    g.add("band1_1", arm_forward(shift_rows(fd.a.copy(), 0, 10, 0, 1), fd.cloth, fd.skin, y=10, side=0, n=2, item=FIDDLE))
    # a neighbor at a window (upper body, cut at the sill), waving: arm up / arm out
    nb = recloth(generic("oldwoman", "plain", 0), (150, 110, 70))
    up_ = upper(nb.a, 14)
    g.add("nb_wave_0", arm_up(up_.copy(), 0, nb.skin, nb.cloth, 1))
    g.add("nb_wave_1", arm_up(up_.copy(), 0, nb.skin, nb.cloth, 3, x_hand=up_.shape[1] + 2))
    # the Wanderer sitting after a stumble (front, legs out, a dust-shaken look)
    wd = Q.atlas("wanderer_down_0")
    s = np.concatenate([wd[:15], wd[18:]], 0)
    s = pad(s, 2, 2, 0, 0); h = s.shape[0]
    for x in range(2, s.shape[1] - 2): px(s, x, h - 2, (31, 79, 76))
    for x in (3, 4, s.shape[1] - 5, s.shape[1] - 4): px(s, x, h - 1, (52, 40, 40))
    g.add("w_sit", outline_new(trim_keep_bottom(s)[0]))
    # two cloaked guardians: walking (2) and holding out a string end (1)
    for i, col in enumerate([(92, 70, 60), (70, 76, 96)]):
        f = recloth(generic("man" if i == 0 else "woman", "plain", 0), col); f.a = Q.youthify(f.a, f.beard)
        a = f.a.copy()
        HC = P.shade(col, .8)
        for y in range(0, 4):                                                                # a hood over the hair
            for x in range(a.shape[1]):
                c = get(a, x, y)
                if c and c != OUT and c != f.skin: px(a, x, y, HC)
        for y in range(4, 10):
            for xx in (3, 4, 11, 12):
                c = get(a, xx, y)
                if c and c != OUT and c != f.skin and c != EYE: px(a, xx, y, HC)
        gf = Fig(a, f.skin, col, HC, None)
        g.add(f"grd{i}_walk_0", walk_front(gf, 0)); g.add(f"grd{i}_walk_1", walk_front(gf, 1))
        g.add(f"grd{i}_offer", arm_forward(a, col, f.skin, y=12, side=0, n=3, item=STRING_END))
    g.done()


# ------------------------------------------------------------------ Mill (poems, petition)
def g_mill():
    g = Group("mill_s")
    MC = (34, 32, 40)
    m0 = fig_atlas("mill_0", MC, (34, 26, 28))
    s = sit_front(m0)
    g.add("mill_read", book_held(s, 11))                                                      # reading: the book held up before him
    g.add("mill_up", head_up(book_held(s, 13)))                                               # looking up: the book lowered to the lap
    g.add("mill_stand", m0.a)
    # the lamplighter, with a long pole: walking (side view, 2) and lighting (pole raised high)
    lp = recloth(generic("man", "plain", 0), (84, 70, 56)); lp.a = Q.youthify(lp.a, lp.beard)
    for (x, y) in [(x, y) for y in (1, 2) for x in range(4, 12)] + [(12, 2), (13, 2)]:       # a flat work cap with a short brim
        if y < lp.a.shape[0]: px(lp.a, x, y, (52, 48, 46))
    lp.a = outline_new(pad(lp.a, 0, 1, 0, 0))
    for k in (0, 1):
        a = side_view(lp, k)
        a = arm_forward(a, lp.cloth, lp.skin, y=13, side=0, n=2, item=[(0, -kk, (70, 60, 52)) for kk in range(1, 7)] + [(0, -7, (200, 160, 90))])
        g.add(f"lamp_walk_{k}", a)
    g.add("lamp_light", arm_up(lp.a.copy(), 0, lp.skin, lp.cloth, 2, item=POLE))
    g.done()


# ------------------------------------------------------------------ the Weaver (different, tellmore)
def g_gilligan():
    g = Group("gilligan_s")
    WC = (74, 62, 102)
    w0 = fig_atlas("gilligan_0", WC)
    g.add("wv_stand", w0.a)
    g.add("wv_book", arm_up(w0.a.copy(), 0, WC, WC, 3, item=BOOK_BLUE))                      # lifting the closed book
    g.add("wv_hand", arm_forward(w0.a, WC, WC, y=12, side=0, n=4))                           # handing across the counter
    g.add("wv_spool", arm_up(w0.a.copy(), 0, WC, WC, 3, item=SPOOL))                          # extra: lifting the spool (tellmore bloom)
    # four seated townsfolk talking (2 frames each)
    tfs = [("woman", "plain", (120, 84, 70)), ("man", "hat", (84, 100, 84)), ("oldman", "plain", (96, 90, 120)), ("oldwoman", "fine", (130, 96, 60))]
    for i, (b, c, col) in enumerate(tfs):
        f = recloth(generic(b, c, 0), col)
        st = sit_front(f)
        g.add(f"tf{i}_talk_0", mouth_open(st))
        g.add(f"tf{i}_talk_1", pose_point(Fig(st, f.skin, f.cloth, f.hair, f.beard), i % 2))
    # six visitors walking (toward the viewer, 2 frames each): a young worker, a parent, an old woman, a student, an old man, a laborer
    vis = [("man", "plain", (110, 96, 76), True), ("woman", "fine", (120, 70, 80), False), ("oldwoman", "plain", (100, 92, 110), False),
           ("man", "satchel", (70, 100, 140), True), ("oldman", "plain", (96, 84, 70), False), ("man", "hat", (90, 80, 60), False)]
    for i, (b, c, col, young) in enumerate(vis):
        f = recloth(generic(b, c, 0), col)
        if young: f.a = Q.youthify(f.a, f.beard)
        g.add(f"vis{i}_walk_0", walk_front(f, 0)); g.add(f"vis{i}_walk_1", walk_front(f, 1))
    g.done()


GROUPS = {"aquinas_s": g_aquinas, "kant_s": g_kant, "mill_s": g_mill, "gilligan_s": g_gilligan}


def pack_group(name):
    import importlib.util
    from PIL import ImageDraw
    mat = importlib.util.module_from_spec(importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py"))
    mat.__spec__.loader.exec_module(mat)
    d = f"art/people43/{name}"; piv = json.load(open(f"{d}/pivots.json"))
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
