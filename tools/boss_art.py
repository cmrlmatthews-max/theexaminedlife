#!/usr/bin/env python3
"""Boss art build (plan 4, Phase 35A): Gemini sheets -> per-game atlas, people, rects, traced geometry,
review sheets. Run tools/boss_proc.py first (backdrops, plates, sheet cuts). Mirrors tools/level4_art.py."""
import json, math, os, sys, importlib.util
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, "tools")
import people as P
import people4 as Q
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py")
mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
CUT, OUT = "art/cut5", "art/out5"
os.makedirs(OUT, exist_ok=True); os.makedirs("art/proc5/geo", exist_ok=True)

def cut(sheet, i): return Image.open(f"{CUT}/{sheet}/{i:02d}.png").convert("RGBA")
def trim(im): return im.crop(im.getbbox())
def scaled(im, s):
    im = trim(im); w, h = max(1, round(im.width * s)), max(1, round(im.height * s))
    arr = mat.premul_resize(im, (w, h)); a = (arr[..., 3] >= .5).astype(np.uint8)
    return Image.fromarray(np.dstack([(arr[..., :3] * 255).astype(np.uint8), a * 255]), "RGBA")
def H(im, h): im = trim(im); return scaled(im, h / im.height)
def L(im, n): im = trim(im); return scaled(im, n / max(im.size))
def Wd(im, w): im = trim(im); return scaled(im, w / im.width)
def pair(a, b, mode, n):
    a, b = trim(a), trim(b)
    base = {"h": a.height, "l": max(a.size), "w": a.width}[mode]
    s = n / base; return scaled(a, s), scaled(b, s)
def defringe(img, thr=28):
    a = np.array(img).astype(np.int32); r, g, b, al = a[..., 0], a[..., 1], a[..., 2], a[..., 3] > 0
    pink = al & ((np.minimum(r, b) - g) > thr)
    p = np.pad(al, 2); near = np.zeros_like(al)
    for dy in range(-2, 3):
        for dx in range(-2, 3):
            near |= ~p[2 + dy:2 + dy + al.shape[0], 2 + dx:2 + dx + al.shape[1]]
    a[pink & near, 3] = 0
    inner = pink & ~near
    a[..., 2] = np.where(inner, (g * .8).astype(np.int32), b); a[..., 0] = np.where(inner, np.minimum(255, r * .95).astype(np.int32), r)
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")
def largest(img):
    a = np.array(img); m = a[..., 3] > 0; lab, n = mat.label(m)
    if n > 1:
        sizes = [(lab == i).sum() for i in range(1, n + 1)]; a[lab != 1 + int(np.argmax(sizes)), 3] = 0
    return Image.fromarray(a, "RGBA")
def merge(sheet, ids):
    """several cut pieces that belong to one item (a torch's sparks, a scatter of leaves), re-assembled at
    their places on the sheet"""
    outs = mat_boxes[sheet]
    x0 = min(outs[i - 1][0] for i in ids); y0 = min(outs[i - 1][1] for i in ids)
    x1 = max(outs[i - 1][2] for i in ids); y1 = max(outs[i - 1][3] for i in ids)
    c = Image.new("RGBA", (x1 - x0, y1 - y0), (0, 0, 0, 0))
    for i in ids:
        b = outs[i - 1]; c.alpha_composite(cut(sheet, i), (b[0] - x0, b[1] - y0))
    return c
mat_boxes = {}
for s in os.listdir(CUT):
    p = f"art/proc5/boxes-{s}.json"
    if os.path.exists(p): mat_boxes[s] = json.load(open(p))

src = open("base/index.html", encoding="utf-8").read()
i = src.find("ATLAS.chars=") + len("ATLAS.chars="); j = src.find(";", i)
CH = json.loads(src[i:j])["rects"]
CA = Image.open("blobs/1092ba9bca54f8ddf104f6d02f4310e8.png").convert("RGBA")
def chf(n): r = CH[n]; return CA.crop((r[0], r[1], r[0] + r[2], r[1] + r[3]))

BG = lambda n: f"art/proc5/bg/{n}.png"; PL = lambda n: f"art/proc5/plate/{n}.jpg"
def U(v): return v * 2

def review(game, items, people_items, extra=(), notes=()):
    def zz(n, im):
        k = 4 if max(im.size) <= 24 else 2
        return (n + (" x4" if k == 4 else ""), im.resize((im.width * k, im.height * k), Image.Resampling.NEAREST))
    tiles = [zz(n, im) for n, im in items]
    tiles += [(n, im.resize((im.width * 4, im.height * 4), Image.Resampling.NEAREST)) for n, im in people_items]
    W = 1400; x = y = 10; rh = 0; pos = []
    for n, t in tiles:
        if t.width > W - 20: t = t.resize((W - 20, int(t.height * (W - 20) / t.width)))
        if x + t.width + 10 > W: x = 10; y += rh + 26; rh = 0
        pos.append((n, t, x, y)); x += max(t.width, 62) + 10; rh = max(rh, t.height)
    H1 = y + rh + 30
    def thumb(p):
        im = Image.open(p).convert("RGBA")
        if abs(im.width / im.height - .6) < .02: return im.resize((192 * 2, 320 * 2)) if im.width >= 384 else im
        k = min(386 / im.width, 640 / im.height); return im.resize((int(im.width * k), int(im.height * k)))
    thumbs = [thumb(p) for p in extra]
    per = 3; rows = (len(thumbs) + per - 1) // per
    Hh = H1 + rows * 670 + 22 * len(notes) + 16
    cs = Image.new("RGBA", (W, Hh), (38, 34, 48, 255)); d = ImageDraw.Draw(cs)
    for n, t, x, y in pos:
        cs.alpha_composite(t, (x, y + 14)); d.text((x, y), n[:26], fill=(255, 226, 160, 255))
    for k, t in enumerate(thumbs):
        tx = 10 + (k % per) * 400; ty = H1 + (k // per) * 670
        cs.alpha_composite(t, (tx, ty))
        d.text((tx + 2, ty + t.height + 2), os.path.basename(extra[k]), fill=(200, 200, 220, 255))
    for k, s in enumerate(notes):
        d.text((10, H1 + rows * 670 + 22 * k), s, fill=(255, 226, 160, 255))
    cs.save(f"{OUT}/{game}/_review.png")

def build(game, items, peo, extra=(), notes=(), meta=None):
    os.makedirs(f"{OUT}/{game}", exist_ok=True)
    rects = mat.pack(items, f"{OUT}/{game}/atlas.png", width=1024) if items else {}
    prects = mat.pack(peo, f"{OUT}/{game}/people.png", width=256) if peo else {}
    data = {"rects": rects, "prects": prects}
    if meta: data.update(meta)
    json.dump(data, open(f"{OUT}/{game}/rects.json", "w"))
    geo = sorted(f"art/proc5/geo/{f}" for f in os.listdir("art/proc5/geo") if f.startswith(game) and f.endswith(".png"))
    review(game, items, peo, list(extra) + geo, notes)
    print(game, Image.open(f"{OUT}/{game}/atlas.png").size, os.path.getsize(f"{OUT}/{game}/atlas.png"),
          "people", len(peo), os.path.getsize(f"{OUT}/{game}/people.png") if peo else 0)

def geo_overlay(name, bgname, draw):
    im = Image.open(BG(bgname)).convert("RGBA"); d = ImageDraw.Draw(im); draw(d); im.save(f"art/proc5/geo/{name}.png")
GEO = {}
GREEN, PINK, CYAN, ORANGE = (120, 255, 120, 255), (255, 120, 255, 255), (120, 220, 255, 255), (255, 190, 90, 255)
def dot(d, x, y, col, r=5, label=None):
    X, Y = U(x), U(y); d.ellipse((X - r, Y - r, X + r, Y + r), outline=col, width=2)
    if label is not None: d.text((X + r + 2, Y - 6), str(label), fill=col)
def box(d, b, col, label=None):
    d.rectangle((U(b[0]), U(b[1]), U(b[2]), U(b[3])), outline=col, width=2)
    if label: d.text((U(b[0]) + 3, U(b[1]) + 2), label, fill=col)


ONLY = sys.argv[1:]
def want(g): return not ONLY or g in ONLY
GEO = json.load(open(f"{OUT}/geo5.json")) if os.path.exists(f"{OUT}/geo5.json") else {}
def crop(im, b): return im.crop(b)

def dehalo(img, iters=60, blue=True):
    """peel the violet/blue glow that the magenta key leaves around glowing items, from the outside in"""
    a = np.array(img).astype(np.int32)
    for _ in range(iters):
        al = a[..., 3] > 0; r, g, b = a[..., 0], a[..., 1], a[..., 2]
        bad = al & (((np.minimum(r, b) - g) > 14) | (((b - g) > 12) if blue else False))
        p = np.pad(~al, 1, constant_values=True)
        edge = p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]
        kill = bad & edge
        if not kill.any(): break
        a[kill, 3] = 0
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")
def despeck(img, minpx=400):
    a = np.array(img); lab, n = mat.label(a[..., 3] > 0)
    for i in range(1, n + 1):
        if (lab == i).sum() < minpx: a[lab == i, 3] = 0
    return Image.fromarray(a, "RGBA")


# ======================================================================================
# Carry It Anyway (the Void) — boss_b1
# ======================================================================================
if want("boss_b1"):
    S = "boss_b1-s1"
    w0, w1 = pair(cut(S, 1), cut(S, 2), "h", 20)
    items = [("wisp_0", w0), ("wisp_1", w1), ("void_swirl", L(cut(S, 3), 160))]
    lantern = defringe(crop(cut(S, 12), (176, 36, 294, 280)))
    LIGHTS = [("light_kierkegaard", cut(S, 5), "a shard of the stained-glass bridge (plum)"),
              ("light_nietzsche", cut(S, 8), "a stone hammer (crimson)"),
              ("light_camus", cut(S, 9), "the boulder (gold)"),
              ("light_sartre", cut(S, 10), "an open door (amber)"),
              ("light_beauvoir", cut(S, 11), "a key (rose-gold)"),
              ("light_frankl", lantern, "a lantern (warm gold)"),
              ("light_fromm", cut(S, 13), "a flower (green)")]
    items += [(n, L(im, 16)) for n, im, _ in LIGHTS]
    # traced on boss_b1-bg (units; stage 192 x 320). The pale dawn band is the horizon line, y 80-86 (brightest
    # at 84-85); the Void's robe hides it between x 43 and 149.
    g = {"dawn": {"y": 85, "band": [80, 86], "visible": [[0, 43], [149, 192]], "behind_void": [43, 149],
                  "note": "the painted horizon glows pale along y 80-86; the dawn line the player walks to"},
         "void": {"hood_top": [96, 2], "face_center": [96, 30], "face_r": 14, "robe_base": [43, 149, 88],
                  "note": "the painted face is a dark swirl r ~14; void_swirl (160 px = 80 units) is drawn over it, turned, when the face rises in wave II"},
         "glimmer": [96, 87], "plain": [12, 96, 180, 236], "dark_band_from": 240,
         "colors": {"light_kierkegaard": "#7A3E6E", "light_nietzsche": "#B0283A", "light_camus": "#D9A93A", "light_sartre": "#E08A2E",
                    "light_beauvoir": "#E8A59A", "light_frankl": "#F5C66A", "light_fromm": "#5FBF5A"}}
    GEO["boss_b1"] = g
    def db1(d):
        y = g["dawn"]["y"]; d.line((0, U(y), U(192), U(y)), fill=ORANGE, width=2); d.text((4, U(y) - 14), "dawn line y 85", fill=ORANGE)
        f = g["void"]["face_center"]; dot(d, *f, PINK, U(g["void"]["face_r"]), "face")
        box(d, g["plain"], CYAN, "open plain"); d.line((0, U(240), U(192), U(240)), fill=GREEN, width=1); d.text((4, U(240) + 2), "dark band (pad / A-B)", fill=GREEN)
        dot(d, *g["glimmer"], (255, 214, 100, 255), 3)
    geo_overlay("boss_b1-geo", "boss_b1-bg", db1)
    # scale mock: the Wanderer (map sprite, 2x) on the plain with the seven lights circling and two wisps
    im = Image.open(BG("boss_b1-bg")).convert("RGBA"); it = dict(items)
    me = chf("wanderer_up_0")
    cx, cy = 96, 200
    if me is not None:
        m2 = me.resize((me.width * 2, me.height * 2), Image.Resampling.NEAREST); im.alpha_composite(m2, (U(cx) - m2.width // 2, U(cy) - m2.height))
    for k, (n, _, _) in enumerate(LIGHTS):
        a = k / 7 * 2 * math.pi; p = it[n]; im.alpha_composite(p, (int(U(cx + math.cos(a) * 17)) - p.width // 2, int(U(cy - 14 + math.sin(a) * 12)) - p.height // 2))
    for (x, y, n) in [(60, 150, "wisp_0"), (130, 168, "wisp_1")]:
        p = it[n]; im.alpha_composite(p, (U(x) - p.width // 2, U(y) - p.height // 2))
    sw = it["void_swirl"]; im.alpha_composite(sw, (U(96) - sw.width // 2, U(30) - sw.height // 2))
    im.save("art/proc5/geo/boss_b1-mock.png")
    build("boss_b1", items, [], [BG("boss_b1-bg")],
          ["wisp_0 / wisp_1: two frames at one scale (round 20 px tall; the stretched one is the moving frame)",
           "void_swirl: 160 px, pivot at its centre; turned in code. It is bigger than the painted face (r 14 units) by design: it rises in wave II",
           "seven lights, 16 px, one per Level I thinker: " + "; ".join(f"{n[6:]} = {s}" for n, _, s in LIGHTS),
           "Frankl's lantern is cut from Gemini's lantern-on-a-post; the post is left out so it reads at 16 px",
           "boss_b1-geo: the dawn line (y 85), the face, the open plain; boss_b1-mock: the Wanderer at 2x with the seven lights, two wisps, and the swirl over the face"],
          {"geo": g, "lights": [n for n, _, _ in LIGHTS]})

# ======================================================================================
# The Still Center (Fortune) — boss_b2
# ======================================================================================
if want("boss_b2"):
    S = "boss_b2-s1"
    items = [("wheel", L(defringe(cut(S, 1)), 300)), ("citadel", L(cut(S, 2), 48)),
             ("prize_coins", L(merge(S, [3, 4, 5]), 20)), ("prize_laurel", L(cut(S, 6), 20)),
             ("prize_mask", L(defringe(cut(S, 7)), 20)), ("prize_crown", L(cut(S, 8), 20))]
    g = {"hub": [96, 160], "pool": {"center": [96, 160], "rx": 54, "ry": 45, "note": "the calm open water inside the storm ring"},
         "face": {"center": [96, 40], "box": [72, 8, 120, 72], "note": "Fortune's blindfolded face in the clouds"},
         "wheel": {"size_px": 300, "draw_scale": 1.0, "note": "300 px = 150 units across, centred on the hub; it overhangs the pool onto the storm ring"},
         "lanterns_painted": [[40, 128], [146, 120], [136, 200]], "dark_band_from": 240}
    GEO["boss_b2"] = g
    def db2(d):
        c = g["pool"]["center"]; d.ellipse((U(c[0] - 54), U(c[1] - 45), U(c[0] + 54), U(c[1] + 45)), outline=CYAN, width=2)
        dot(d, *g["hub"], ORANGE, 4, "hub"); d.ellipse((U(96 - 75), U(160 - 75), U(96 + 75), U(160 + 75)), outline=ORANGE, width=1)
        box(d, g["face"]["box"], PINK, "face")
        d.line((0, U(240), U(192), U(240)), fill=GREEN, width=1)
    geo_overlay("boss_b2-geo", "boss_b2-bg", db2)
    im = Image.open(BG("boss_b2-bg")).convert("RGBA"); it = dict(items)
    w = it["wheel"].rotate(20, resample=Image.Resampling.NEAREST); im.alpha_composite(w, (U(96) - w.width // 2, U(160) - w.height // 2))
    c = it["citadel"]; im.alpha_composite(c, (U(96) - c.width // 2, U(160) - c.height // 2 - 8))
    for (x, y, n) in [(50, 130, "prize_coins"), (140, 150, "prize_laurel"), (70, 205, "prize_mask"), (128, 196, "prize_crown")]:
        p = it[n]; im.alpha_composite(p, (U(x) - p.width // 2, U(y) - p.height // 2))
    me = chf("wanderer_down_0")
    if me is not None:
        m2 = me.resize((me.width * 2, me.height * 2), Image.Resampling.NEAREST); im.alpha_composite(m2, (U(112) - m2.width // 2, U(176) - m2.height))
    im.save("art/proc5/geo/boss_b2-mock.png")
    build("boss_b2", items, [], [BG("boss_b2-bg")],
          ["wheel: 300 px (150 units), pivot at its centre, turned in code; the eight figures cling to the spokes. Gemini drew it front-on (a spoked wheel) rather than as a top-down platform; the gaps show the sea",
           "citadel: 48 px (Gemini's is a 3/4 view, not straight down), rises at the hub in wave III",
           "prizes 20 px: coins (a scatter, merged from three cuts), laurel, mask, crown",
           "the sheet came back at 1024 px (not 2048), still above every target size",
           "boss_b2-geo: the calm pool (cyan), the hub, the wheel's reach (orange), the face; boss_b2-mock: wheel, citadel, prizes and the Wanderer at game scale"],
          {"geo": g})


# ======================================================================================
# Open Hands (the Grasping Mind) — boss_b3
# ======================================================================================
if want("boss_b3"):
    S = "boss_b3-s1"
    body = H(dehalo(cut(S, 1), blue=False), 200)
    arm = L(dehalo(cut(S, 2), blue=False), 120)
    items = [("spirit", body), ("arm", arm),
             ("treasure_coins", L(despeck(dehalo(cut(S, 3), blue=False)), 20)),
             ("treasure_jewel", L(dehalo(cut(S, 4)), 20)),
             ("treasure_tablet", L(dehalo(cut(S, 5)), 20)),
             ("treasure_food", L(despeck(dehalo(cut(S, 6)), 200), 20))]
    # pivots, measured on the cuts (px in the scaled piece)
    bw, bh = body.size
    a2 = np.array(arm)[..., 3] > 0; ys = np.where(a2[:, :6])[0]; arm_piv = [3, int(round(ys.mean()))]
    piv = {"spirit": {"size": [bw, bh], "shoulders": [[round(bw * .18), round(bh * .27)], [round(bw * .80), round(bh * .27)]],
                      "belly": [round(bw * .62), round(bh * .40)], "belly_r": round(bw * .25),
                      "note": "px in the 200 px piece; draw it with its feet at geo.spirit_feet"},
           "arm": {"size": list(arm.size), "pivot": arm_piv,
                   "note": "the shoulder end is at the left; the clawed hand points right and a little up. Rotate about the pivot; flip for the left side"}}
    # traced on boss_b3-bg (units). Lantern lights measured from the lit windows.
    g = {"altar": {"center": [97, 84], "box": [80, 74, 116, 94], "note": "the glowing jade altar on the shrine steps"},
         "shrine_door": [74, 50, 118, 74], "steps": [80, 94, 116, 118],
         "lanterns": [[52, 103], [142, 112], [43, 191], [144, 190]],
         "lantern_bases": [[51, 116], [143, 138], [42, 222], [145, 222]],
         "spirit_feet": [96, 120], "spirit_note": "200 px = 100 units tall: it stands from y 20 to 120, in front of the shrine",
         "open_ground": [44, 122, 150, 226],
         "slots_suggested": [[62, 148], [86, 148], [110, 148], [134, 148], [62, 178], [86, 178], [110, 178], [134, 178]],
         "slot_size": 24, "dark_band_from": 236}
    GEO["boss_b3"] = g
    def db3(d):
        box(d, g["altar"]["box"], ORANGE, "altar"); box(d, g["shrine_door"], PINK, "door")
        for k, p in enumerate(g["lanterns"]): dot(d, *p, (255, 214, 100, 255), 4, k)
        box(d, g["open_ground"], CYAN, "open ground")
        for p in g["slots_suggested"]:
            h = g["slot_size"] / 2; box(d, [p[0] - h, p[1] - h, p[0] + h, p[1] + h], GREEN)
        dot(d, *g["spirit_feet"], PINK, 4, "feet")
        d.line((0, U(g["dark_band_from"]), U(192), U(g["dark_band_from"])), fill=GREEN, width=1)
    geo_overlay("boss_b3-geo", "boss_b3-bg", db3)
    im = Image.open(BG("boss_b3-bg")).convert("RGBA"); it = dict(items)
    fx, fy = g["spirit_feet"]; bx, by = U(fx) - bw // 2, U(fy) - bh
    # four arms behind the body, two from each shoulder, rotated about the shoulder
    for side, (sx, sy) in enumerate(piv["spirit"]["shoulders"]):
        for ang in ([20, -25] if side else [160, 205]):
            a = it["arm"]; P_ = arm_piv
            # pad so the pivot is the centre, then rotate
            R_ = int(math.hypot(*a.size)) + 4; c = Image.new("RGBA", (2 * R_, 2 * R_), (0, 0, 0, 0)); c.alpha_composite(a, (R_ - P_[0], R_ - P_[1]))
            c = c.rotate(-ang, resample=Image.Resampling.NEAREST)
            im.alpha_composite(c, (bx + sx - R_, by + sy - R_))
    im.alpha_composite(body, (bx, by))
    for (p, n) in zip(g["slots_suggested"], ["treasure_coins", "treasure_jewel", "treasure_tablet", "treasure_food", "treasure_food", "treasure_coins"]):
        t = it[n]; im.alpha_composite(t, (U(p[0]) - t.width // 2, U(p[1]) - t.height // 2))
    me = chf("wanderer_up_0")
    if me is not None:
        m2 = me.resize((me.width * 2, me.height * 2), Image.Resampling.NEAREST); im.alpha_composite(m2, (U(96) - m2.width // 2, U(232) - m2.height))
    im.save("art/proc5/geo/boss_b3-mock.png")
    build("boss_b3", items, [], [BG("boss_b3-bg")],
          ["spirit: 200 px tall, front view, no arms (the revised sheet: a smoke spirit with a tiny mouth and a glowing hollow belly)",
           f"arm: 120 px long, pivot {arm_piv} (the shoulder end); reused and turned for every arm, flipped for the left side",
           "treasures 20 px: coins, jewel, tablet, a bowl of food. The violet glow the magenta key left was peeled off; add glow in code",
           "boss_b3-geo: altar, door, the four lit lanterns, the open ground, eight suggested 24-unit slots; boss_b3-mock: the spirit with four arms, treasures in slots, the Wanderer"],
          {"geo": g, "pivots": piv})


# ======================================================================================
# The Three Lenses (the Dilemma Engine) — boss_b4
# ======================================================================================
if want("boss_b4"):
    S = "boss_b4-s1"
    eng_raw = cut(S, 1); es = 200 / trim(eng_raw).height
    engine = H(eng_raw, 200)
    eyes = scaled(dehalo(merge(S, [2, 3]), blue=False), es * 143.4 / 215.5)   # eye spacing matched to the engine's sockets
    # pupils on the engine cut at (478.6, 360.4) and (622.0, 360.3) px; eye centres on the merged pair are 215.5 px apart
    eyes_at = [round(550.3 * es), round(360.4 * es)]
    loco, car = pair(cut(S, 9), cut(S, 10), "h", 48)
    items = [("engine", engine), ("engine_eyes", eyes),
             ("lens_gold", L(cut(S, 4), 40)), ("lens_silver", L(cut(S, 5), 40)), ("lens_bronze", L(cut(S, 6), 40)),
             ("train_engine", loco), ("train_car", car),
             ("signal_lamp", L(dehalo(cut(S, 11)), 32)), ("bell", L(cut(S, 12), 32)), ("switch", L(cut(S, 13), 32))]
    piv = {"engine": {"size": list(engine.size), "eyes_center": eyes_at,
                      "note": "px in the 200 px piece; draw engine_eyes centred here (it is the glow layer for the dark eyes)"},
           "engine_eyes": {"size": list(eyes.size), "pivot": [eyes.width // 2, eyes.height // 2]},
           "train": {"note": "seen from above, front (red cowcatcher) at the BOTTOM: it comes down out of the fog toward the junction. 48 px long; the car is at the same scale. Couple the car behind (above) the engine"}}
    # traced on boss_b4-bg (units). Paths run from the bottom of the stage upward.
    g = {"tracks": {"main": [[96, 320], [96, 262], [96, 215], [96, 175], [96, 128]],
                    "branch_up_right": [[97, 178], [110, 162], [127, 147], [150, 135], [176, 128]],
                    "branch_down_right": [[103, 178], [120, 190], [136, 208], [146, 228], [150, 244]],
                    "siding": [[93, 206], [78, 220], [62, 234], [46, 250]],
                    "note": "the main line runs straight up the middle into the fog at y 128; it splits at y ~178 (one branch curves up and right behind the signal post, one curves down and right); the siding leaves the main line at y ~206 and runs down-left to a buffer stop"},
         "junction": [98, 178], "siding_switch": [88, 204], "buffer": {"box": [18, 246, 58, 282], "center": [38, 262]},
         "fog_line": 128, "signal_post": {"base": [128, 176], "arms": [128, 88], "lamp": [118, 108]},
         "lamps": [[56, 172], [68, 138], [154, 150]],
         "engine_feet": [92, 122], "engine_note": "200 px = 100 units tall: standing at the fog line it rises from y 22 to 122, overlapping the painted signal post's top; draw it behind a fog wash, or at 0.8 scale",
         "lenses_suggested": [[52, 228], [96, 228], [140, 228]],
         "third_ways_suggested": {"bell": [36, 196], "signal_lamp": [118, 108], "switch": [88, 204]},
         "dark_band_from": 246}
    GEO["boss_b4"] = g
    def db4(d):
        cols = {"main": ORANGE, "branch_up_right": GREEN, "branch_down_right": CYAN, "siding": PINK}
        for k, pts in g["tracks"].items():
            if k == "note": continue
            d.line([(U(x), U(y)) for x, y in pts], fill=cols[k], width=3); d.text((U(pts[-1][0]) + 4, U(pts[-1][1]) - 12), k, fill=cols[k])
        box(d, g["buffer"]["box"], (255, 90, 90, 255), "buffer"); dot(d, *g["junction"], ORANGE, 5, "junction")
        dot(d, *g["siding_switch"], PINK, 5, "switch"); dot(d, *g["signal_post"]["lamp"], (255, 214, 100, 255), 5, "signal lamp")
        for p in g["lamps"]: dot(d, *p, (255, 214, 100, 255), 3)
        for p in g["lenses_suggested"]: dot(d, *p, (230, 230, 255, 255), 20)
        d.line((0, U(g["fog_line"]), U(192), U(g["fog_line"])), fill=(200, 200, 255, 255), width=1); d.text((4, U(g["fog_line"]) - 14), "fog line", fill=(200, 200, 255, 255))
        d.line((0, U(g["dark_band_from"]), U(192), U(g["dark_band_from"])), fill=GREEN, width=1)
    geo_overlay("boss_b4-geo", "boss_b4-bg", db4)
    im = Image.open(BG("boss_b4-bg")).convert("RGBA"); it = dict(items)
    fx, fy = g["engine_feet"]; ex, ey = U(fx) - engine.width // 2, U(fy) - engine.height
    im.alpha_composite(engine, (ex, ey)); e = it["engine_eyes"]; im.alpha_composite(e, (ex + eyes_at[0] - e.width // 2, ey + eyes_at[1] - e.height // 2))
    for p, n in zip(g["lenses_suggested"], ["lens_gold", "lens_silver", "lens_bronze"]):
        t = it[n]; im.alpha_composite(t, (U(p[0]) - t.width // 2, U(p[1]) - t.height // 2))
    tl, tc = it["train_engine"], it["train_car"]   # coming down the up-right branch's straight part: shown on the main line here
    im.alpha_composite(tc, (U(96) - tc.width // 2, U(138) - tc.height // 2)); im.alpha_composite(tl, (U(96) - tl.width // 2, U(138) + tc.height // 2 - 2))
    for n, p in g["third_ways_suggested"].items():
        t = it[n]; im.alpha_composite(t, (U(p[0]) - t.width // 2, U(p[1]) - t.height // 2))
    im.save("art/proc5/geo/boss_b4-mock.png")
    build("boss_b4", items, [], [BG("boss_b4-bg")],
          ["engine: 200 px tall, front view, eyes dark; engine_eyes is the separate furnace-eye glow, scaled so its two eyes sit on the engine's sockets (centre " + str(eyes_at) + " px in the engine)",
           "Gemini's left scale pan touched the sheet edge, so its outer rim is clipped by a pixel or two at 200 px",
           "lenses 40 px: gold, silver, bronze (Gemini drew two extra lenses; unused)",
           "train: engine and car, top view, 48 px long, same scale; '2 frames' read as the two pieces (a chuff is a steam puff in code)",
           "third ways 32 px: signal lamp (a message sent ahead), bell (a warning bell), switch (the siding); the switch is extra to the art prompt, which listed 9 items",
           "boss_b4-bg is the second version, asked for with a clear siding and buffer stop (the first had none; kept as boss_b4-bg_v1)",
           "boss_b4-geo: the four track paths, junction, switch, buffer, signal lamp, fog line; boss_b4-mock: engine with eyes lit, lenses, train, third ways"],
          {"geo": g, "pivots": piv})

json.dump(GEO, open(f"{OUT}/geo5.json", "w"), indent=1)
print("done", list(GEO))
