#!/usr/bin/env python3
"""Level IV art build (plan 4, Phase 34A): Gemini sheets -> per-game atlas, people, rects, traced geometry,
review sheets. Run tools/l4_proc.py first (backdrops, plates, sheet cuts). Mirrors tools/level3_art.py."""
import json, math, os, sys, importlib.util
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, "tools")
import people as P
import people4 as Q
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py")
mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
CUT, OUT = "art/cut4", "art/out4"
os.makedirs(OUT, exist_ok=True); os.makedirs("art/proc4/geo", exist_ok=True)

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
    p = f"art/proc4/boxes-{s}.json"
    if os.path.exists(p): mat_boxes[s] = json.load(open(p))

src = open("base/index.html", encoding="utf-8").read()
i = src.find("ATLAS.chars=") + len("ATLAS.chars="); j = src.find(";", i)
CH = json.loads(src[i:j])["rects"]
CA = Image.open("blobs/1092ba9bca54f8ddf104f6d02f4310e8.png").convert("RGBA")
def chf(n): r = CH[n]; return CA.crop((r[0], r[1], r[0] + r[2], r[1] + r[3]))

BG = lambda n: f"art/proc4/bg/{n}.png"; PL = lambda n: f"art/proc4/plate/{n}.jpg"
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
    geo = sorted(f"art/proc4/geo/{f}" for f in os.listdir("art/proc4/geo") if f.startswith(game) and f.endswith(".png"))
    review(game, items, peo, list(extra) + geo, notes)
    print(game, Image.open(f"{OUT}/{game}/atlas.png").size, os.path.getsize(f"{OUT}/{game}/atlas.png"),
          "people", len(peo), os.path.getsize(f"{OUT}/{game}/people.png") if peo else 0)

def geo_overlay(name, bgname, draw):
    im = Image.open(BG(bgname)).convert("RGBA"); d = ImageDraw.Draw(im); draw(d); im.save(f"art/proc4/geo/{name}.png")
GEO = {}
GREEN, PINK, CYAN, ORANGE = (120, 255, 120, 255), (255, 120, 255, 255), (120, 220, 255, 255), (255, 190, 90, 255)
def dot(d, x, y, col, r=5, label=None):
    X, Y = U(x), U(y); d.ellipse((X - r, Y - r, X + r, Y + r), outline=col, width=2)
    if label is not None: d.text((X + r + 2, Y - 6), str(label), fill=col)
def box(d, b, col, label=None):
    d.rectangle((U(b[0]), U(b[1]), U(b[2]), U(b[3])), outline=col, width=2)
    if label: d.text((U(b[0]) + 3, U(b[1]) + 2), label, fill=col)

# ======================================================================================
# Two Lights, One Window
# ======================================================================================
S1, S2 = "lights-s1", "lights-s2"
items = []
# the bronze mirror: 8 turn frames. Its long axis is found by PCA, the cutout is turned flat, then frame k is the
# mirror line at k x 22.5 degrees (screen angle, counterclockwise): 0 = "-", 2 = "/", 4 = "|", 6 = "\".
mir = trim(cut(S1, 1)); m = np.array(mir)[..., 3] > 128; ys, xs = np.nonzero(m)
w_, v_ = np.linalg.eigh(np.cov(np.stack([xs - xs.mean(), ys - ys.mean()]))); vx, vy = v_[0, 1], v_[1, 1]
if vx < 0: vx, vy = -vx, -vy
ang = math.degrees(math.atan2(-vy, vx))
flat = trim(mir.rotate(-ang, resample=Image.Resampling.BICUBIC, expand=True))
# slim it to a 3:1 plate seen edge-on from above, so "/" and "\\" read at a glance at 24 px
flat = flat.resize((flat.width, max(1, flat.width // 3)), Image.Resampling.LANCZOS)
side = int(math.ceil(math.hypot(*flat.size))) + 4
base = Image.new("RGBA", (side, side)); base.alpha_composite(flat, ((side - flat.width) // 2, (side - flat.height) // 2))
for k in range(8):
    r = base.rotate(22.5 * k, resample=Image.Resampling.BICUBIC)
    arr = mat.premul_resize(r, (24, 24)); a = (arr[..., 3] >= .5).astype(np.uint8)
    items.append((f"mirror_{k}", Image.fromarray(np.dstack([(arr[..., :3] * 255).astype(np.uint8), a * 255]), "RGBA")))
MIRROR_TILT = round(ang, 1)
panes = {"pane_amber": 2, "pane_blue": 3, "pane_rose": 6, "pane_green": 7}
items += [(n, L(cut(S1, i), 16)) for n, i in panes.items()]
# the lit candle is taller (its flame): match the wax by the bottom, so scale both by the unlit candle's width
c0, c1 = trim(cut(S1, 10)), trim(defringe(cut(S1, 11))); s = 20 / c0.height
items += [("candle_off", scaled(c0, s)), ("candle_on", largest(scaled(c1, s)))]
# the rose window: three rings and a centre, cut at the middle of the stone rings between them (measured from the
# radial profile of lights-s2: stone at r ~ 80-100, 288-345, 512-590 and the outer frame 880-1010, of 1024)
rw = np.array(Image.open(f"{CUT}/{S2}/01.png").convert("RGBA")); hh, ww = rw.shape[:2]
yy, xx = np.mgrid[0:hh, 0:ww]; rr = np.hypot(xx - (ww - 1) / 2, yy - (hh - 1) / 2)
CUTS = [0, 92, 320, 552, 1030]
ROSE_PX = 200
for k, nm in enumerate(["rose_center", "rose_ring1", "rose_ring2", "rose_ring3"]):
    a = rw.copy(); a[(rr < CUTS[k]) | (rr >= CUTS[k + 1]), 3] = 0
    if k == 3: a[rr >= 1022, 3] = 0
    arr = mat.premul_resize(Image.fromarray(a, "RGBA"), (ROSE_PX, ROSE_PX)); al = (arr[..., 3] >= .5).astype(np.uint8)
    items.append((nm, Image.fromarray(np.dstack([(arr[..., :3] * 255).astype(np.uint8), al * 255]), "RGBA")))
RADII = [round(c * ROSE_PX / 2 / 1024, 1) for c in CUTS[1:4]] + [100.0]
# traced on lights-bg (units; the stage is 192 x 320)
g = {"rose": {"center": [97, 36], "r": 32, "note": "painted rose window; the 200 px rings drawn at scale 0.65 sit exactly on it"},
     "altar": [81, 226, 111, 240], "altar_center": [96, 232],
     "candles": [[85.5, 225], [96, 225], [106.5, 225]], "flames": [[85.5, 209], [96, 209], [106.5, 209]],
     "gold_entry": {"at": [97, 68], "dir": "down", "note": "from the foot of the rose window"},
     "silver_entry": {"at": [12, 172], "dir": "right", "note": "suggested: the dark left aisle arch; no lantern is painted, draw candle_on or a lantern glow there"},
     "nave": [40, 120, 152, 222], "nave_note": "the open nave between the pillars (x 40-152) above the altar: room for the mirror grid"}
GEO["lights"] = g
def dlights(d):
    c = g["rose"]["center"]; R = g["rose"]["r"]
    d.ellipse((U(c[0] - R), U(c[1] - R), U(c[0] + R), U(c[1] + R)), outline=GREEN, width=2); dot(d, *c, GREEN, 3, "rose")
    box(d, g["altar"], ORANGE, "altar")
    for k, f in enumerate(g["flames"]): dot(d, *f, ORANGE, 3)
    dot(d, *g["gold_entry"]["at"], (255, 214, 100, 255), 6, "gold in"); dot(d, *g["silver_entry"]["at"], (220, 230, 255, 255), 6, "silver in")
    box(d, g["nave"], CYAN, "open nave")
geo_overlay("lights-geo", "lights-bg", dlights)
# the rings composed with their cut lines, for the review
comp = Image.new("RGBA", (ROSE_PX * 2, ROSE_PX * 2), (38, 34, 48, 255))
for n, im in items:
    if n.startswith("rose_"): comp.alpha_composite(im.resize((ROSE_PX * 2, ROSE_PX * 2), Image.Resampling.NEAREST))
dd = ImageDraw.Draw(comp)
for rad in RADII[:3]: dd.ellipse((ROSE_PX - rad * 2, ROSE_PX - rad * 2, ROSE_PX + rad * 2, ROSE_PX + rad * 2), outline=GREEN, width=1)
comp.save("art/proc4/geo/lights-rose-rings.png")
# mirror frames laid out in a strip, for the review
build("lights", items, [], [BG("lights-bg"), PL("lights-plate")],
      [f"mirror_0..7: the mirror line at k x 22.5 deg (0 '-', 2 '/', 4 '|', 6 '\\'), 24 x 24 px, pivot at the centre (12,12); Gemini drew it tilted {MIRROR_TILT} deg",
       "panes 16 px: amber, blue, rose (Gemini's ruby), green. Gemini also drew a violet pane and a second green: not used",
       f"rose window: rose_center + rose_ring1..3, each a 200 x 200 px canvas, pivot (100,100); cut radii {RADII[:3]} px; outer frame turns with ring 3",
       "the rings have no openings in the art: the build marks each ring's opening (one clear petal) in code",
       "candle_off / candle_on 20 px at one scale (the flame makes the lit one taller); the lit candle's pink glow removed"],
      {"geo": g, "mirror": {"frames": 8, "step_deg": 22.5, "pivot": [12, 12]},
       "rose": {"size": ROSE_PX, "pivot": [100, 100], "radii": RADII}})

# ======================================================================================
# Speakers' Corner
# ======================================================================================
C1 = "corner-s1"
names = ["bub_clock", "bub_poem", "bub_catdog", "bub_pigeon", "bub_teacup", "bub_corn"]
items = [(n, L(cut(C1, k + 1), 24)) for k, n in enumerate(names)]
items += [("crate", Wd(cut(C1, 7), 36)), ("stone", L(cut(C1, 8), 8)), ("cabbage", L(cut(C1, 12), 10)),
          ("purse", L(cut(C1, 13), 10)), ("torch", H(defringe(merge(C1, [9, 10])), 16)), ("corn", H(cut(C1, 11), 16)),
          ("liberty_lamp", H(cut(C1, 14), 20)), ("whistle", L(cut(C1, 15), 10))]
# people (map scale, 16 px wide; feet at the bottom row)
def pw(kw, pose="stand", frame=0): return Q.arr(P.person(**kw, pose=pose, frame=frame))
SPK = [dict(hair="short", hair_col=(60, 44, 34), skin="light", cloth=(70, 62, 92), collar=(236, 230, 218)),      # clock tower
       dict(hair="scarf", hair_col=(120, 48, 60), skin="medium", cloth=(96, 58, 78)),                               # crossed-out poem
       dict(hair="bun", hair_col=(150, 96, 52), skin="light", cloth=(64, 96, 84)),                                  # cat above dog
       dict(hair="cap", hair_col=(88, 72, 52), skin="tan", cloth=(110, 84, 52)),                                    # pigeon with a ballot
       dict(hair="bald", hair_col=(200, 196, 190), skin="brown", cloth=(52, 66, 96), collar=(220, 214, 200))]        # frowning teacup
HATS = {0: lambda a: Q.tophat(a, (40, 34, 44), (110, 40, 40)), 3: None}
def speaker(n, frame):
    kw = SPK[n]; cl, sk = Q.kw_cols(kw)
    if frame == 0:
        a = pw(kw, "wave", 0)                        # arm raised high, mid-sentence
    else:
        a = Q.pad(pw(kw), r=5); Q.hide_hand(a, 1, cl)  # arm out to the side, palm open
        a = Q.limb(a, [(13, 11), (16, 11), (19, 10)], cl, sk)
    if n == 0: a = Q.tophat(a, (40, 34, 44), (110, 40, 40))
    return Q.img(a)
peo = []
for n in range(5):
    peo += [(f"spk{n}_0", speaker(n, 0)), (f"spk{n}_1", speaker(n, 1))]
# the corn speaker (Stage III) reuses speaker 4's body with a third frame: pointing hard at the door (to the left)
kw = SPK[4]; cl, sk = Q.kw_cols(kw); a = Q.pad(pw(kw), l=7)
a[18, 2 + 7] = list(cl) + [255]                     # the resting left hand becomes sleeve
a = Q.limb(a, [(2 + 7, 11), (-0 + 4, 10), (0, 9)], cl, sk); a = Q.brows(a)
peo.append(("spk4_point", Q.img(a)))
CROWD = [dict(hair="short", hair_col=(40, 30, 26), skin="light", cloth=(84, 70, 60)),
         dict(hair="long", hair_col=(180, 130, 70), skin="light", cloth=(110, 60, 70)),
         dict(hair="cap", hair_col=(70, 60, 50), skin="dark", cloth=(60, 80, 70)),
         dict(hair="bun", hair_col=(60, 40, 30), skin="medium", cloth=(90, 90, 120)),
         dict(hair="short", hair_col=(150, 110, 70), skin="tan", cloth=(120, 96, 64)),
         dict(hair="scarf", hair_col=(70, 90, 110), skin="brown", cloth=(70, 56, 86))]
for n, kw in enumerate(CROWD):
    calm = pw(kw); ang = Q.brows(pw(kw, "cheer", 1))
    if n == 0: calm = Q.bowler(calm); ang = Q.bowler(ang)
    peo += [(f"crowd{n}_calm", Q.img(calm)), (f"crowd{n}_angry", Q.img(ang))]
# the stone thrower: stand with the stone, wind up (arm far back over the head, leaning back), let fly
thr = dict(hair="short", hair_col=(90, 50, 30), skin="medium", cloth=(120, 52, 40))
cl, sk = Q.kw_cols(thr); STONE = (150, 150, 160)
a = Q.pad(pw(thr), l=2, r=2); Q.put(a, 2 + 13, 19, STONE); Q.put(a, 2 + 14, 19, STONE); Q.put(a, 2 + 14, 20, (110, 110, 120))
t0 = Q.brows(a)
a = Q.pad(Q.brows(pw(thr)), r=2, t=5)
a[5 + 18, 13] = list(cl) + [255]                     # the resting right hand becomes sleeve
a = Q.limb(a, [(13, 5 + 11), (13, 5 + 3), (9, 1)], cl, sk)
Q.put(a, 8, 0, STONE); Q.put(a, 9, 0, STONE); Q.put(a, 8, 1, (110, 110, 120))
t1 = a
a = Q.pad(Q.brows(pw(thr)), l=1, r=8, t=2)
a[2 + 18, 1 + 13] = list(cl) + [255]
a = Q.limb(a, [(1 + 13, 2 + 11), (1 + 17, 2 + 7), (1 + 21, 2 + 4)], cl, sk)
t2 = np.array(P.lean(Q.img(a), 2))
peo += [("thrower_0", Q.img(t0)), ("thrower_1", Q.img(t1)), ("thrower_2", Q.img(t2))]
# the pickpocket: a hunched sneak, then the reach
pk = dict(hair="cap", hair_col=(44, 40, 46), skin="light", cloth=(52, 50, 60))
cl, sk = Q.kw_cols(pk)
peo.append(("pickpocket_0", P.lean(P.person(**pk), 3)))
a = Q.pad(pw(pk), r=7); a[18, 13] = list(cl) + [255]
a = Q.limb(a, [(13, 12), (17, 15), (21, 16)], cl, sk)
peo.append(("pickpocket_1", P.lean(Q.img(a), 3)))
# the shover: both arms forward at the chest, then fully out
sh = dict(hair="short", hair_col=(30, 26, 24), skin="tan", cloth=(90, 46, 46))
cl, sk = Q.kw_cols(sh)
def shove(reach):
    a = Q.pad(Q.brows(pw(sh)), r=reach + 2); a[18, 13] = list(cl) + [255]
    a = Q.limb(a, [(12, 12), (13 + reach, 13)], cl, sk)
    a = Q.limb(a, [(12, 14), (13 + reach, 15)], cl, sk)
    return P.lean(Q.img(a), 3 if reach < 5 else 5)
peo += [("shover_0", shove(3)), ("shover_1", shove(7))]
# the mob of four, each with a raised torch (2 frames: the flame flickers and the arm bobs)
MOB = [dict(hair="short", hair_col=(50, 34, 26), skin="light", cloth=(96, 70, 52)),
       dict(hair="cap", hair_col=(80, 60, 40), skin="tan", cloth=(70, 62, 50)),
       dict(hair="long", hair_col=(40, 30, 24), skin="medium", cloth=(100, 56, 50)),
       dict(hair="short", hair_col=(120, 90, 60), skin="dark", cloth=(64, 70, 84))]
for n, kw in enumerate(MOB):
    cl, sk = Q.kw_cols(kw)
    for f in range(2):
        a = Q.pad(Q.brows(pw(kw)), t=7, r=2); a[7 + 18, 13] = list(cl) + [255]
        hy = 7 + (3 if f == 0 else 4)
        a = Q.limb(a, [(13, 7 + 11), (14, hy)], cl, sk)
        a = Q.torch(a, 14, hy - 1, f)
        peo.append((f"mob{n}_{f}", Q.img(a)))
# the Wanderer as constable: the tall hat, and the whistle raised to the mouth in frame 1
NAVY = (30, 34, 60)
for f in range(2):
    a = Q.arr(chf(f"wanderer_down_{f}"))
    a = Q.pad(a, t=5)
    for y in range(0, 6):
        for x in range(5, 11): a[y, x] = list(NAVY if y else Q.OUT) + [255]
        a[y, 4] = list(Q.OUT) + [255]; a[y, 11] = list(Q.OUT) + [255]
    for x in range(3, 13): a[6, x] = list(NAVY) + [255]
    a[6, 2] = list(Q.OUT) + [255]; a[6, 13] = list(Q.OUT) + [255]
    for y in range(1, 5): a[y, 6] = list((60, 66, 104)) + [255]
    a[3, 8] = list((200, 204, 214)) + [255]                     # the badge
    if f == 1:
        a = Q.limb(a, [(3, 5 + 12), (5, 5 + 9)], (47, 116, 112), (47, 116, 112), hand=False)
        Q.put(a, 7, 5 + 8, Q.GOLD); Q.put(a, 8, 5 + 8, Q.GOLD2); Q.put(a, 6, 5 + 8, Q.GOLD2)
    peo.append((f"constable_{f}", Q.img(a)))
# traced on corner-bg (units)
g = {"door": {"box": [27, 54, 64, 106], "spot": [45, 112], "note": "the corn-dealer's door (the wheat-sheaf sign hangs at [55,40]); the mob gathers on 'spot'"},
     "crates": [[28, 150], [62, 128], [100, 142], [46, 198], [94, 204]],
     "crates_note": "suggested crate spots (the crate's bottom centre); all on open cobbles, clear of the railing and the door",
     "canal_edge": [[96, 48], [141, 76], [176, 110], [149, 165], [126, 177], [150, 200], [192, 248]],
     "canal_note": "the railing's inner edge: the canal is to the right of this line; a shove carries a speaker toward it",
     "square": [16, 112, 124, 236], "lamps": [[19, 46], [136, 108], [155, 66], [107, 34]]}
GEO["corner"] = g
def dcorner(d):
    box(d, g["door"]["box"], ORANGE, "door"); dot(d, *g["door"]["spot"], ORANGE, 5, "mob")
    for k, c in enumerate(g["crates"]):
        d.rectangle((U(c[0] - 11), U(c[1] - 12), U(c[0] + 11), U(c[1])), outline=GREEN, width=2); d.text((U(c[0]) - 3, U(c[1]) - 18), str(k), fill=GREEN)
    d.line([(U(x), U(y)) for x, y in g["canal_edge"]], fill=CYAN, width=3)
    box(d, g["square"], (255, 255, 255, 160), "open square")
geo_overlay("corner-geo", "corner-bg", dcorner)
# a readability check: the five speakers on crates with their bubbles, at 2x on the backdrop
im = Image.open(BG("corner-bg")).convert("RGBA")
rects = dict(items); pe = dict(peo)
for k, c in enumerate(g["crates"]):
    cr = rects["crate"]; X, Y = U(c[0]) - cr.width // 2 * 1, U(c[1]) - cr.height
    cr2 = cr.resize((cr.width, cr.height)); im.alpha_composite(cr2, (X, Y))
    sp = pe[f"spk{k}_{k % 2}"]; sp2 = sp.resize((sp.width * 2, sp.height * 2), Image.Resampling.NEAREST)
    im.alpha_composite(sp2, (U(c[0]) - sp2.width // 2, Y - sp2.height + 2))
    b2 = rects[names[k]]                      # props and bubbles draw at native detail (1 px = half a unit)
    im.alpha_composite(b2, (U(c[0]) + 6, Y - sp2.height - b2.height + 8))
im.save("art/proc4/geo/corner-mock.png")
build("corner", items, peo, [BG("corner-bg"), PL("corner-plate")],
      ["bubbles 24 px (the 6th, bub_corn, is the Stage III speech); crate 36 px wide; torch 16 px; liberty_lamp 20 px (its 5 notches are drawn in code)",
       "people at map scale (show at 2x): spk0..4 (2 gesture frames) + spk4_point (the corn speaker points at the door), crowd0..5 calm/angry,",
       "thrower_0..2 (hold, wind up, throw), pickpocket_0/1, shover_0/1, mob0..3 with torches (2 frames), constable_0/1 (the Wanderer: tall hat; whistle in 1)",
       "corner-mock.png: the five speakers on their crates with bubbles at 2x, as a readability check"],
      {"geo": g})

# ======================================================================================
# The Web
# ======================================================================================
W1 = "web-s1"
i_l, i_m, i_c, i_k, i_kh = 1, 2, 3, 5, 6
fl = merge(W1, [4, 7])
def depink(im, thr=18):
    """Gemini let the magenta key show through glass and steam: turn what's left of that tint warm cream"""
    a = np.array(im).astype(np.int32); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    m = (a[..., 3] > 0) & ((np.minimum(r, b) - g) > thr)
    v = (r + g + b) // 3 + 30
    a[m, 0] = np.minimum(255, v[m] + 20); a[m, 1] = np.minimum(255, v[m] + 4); a[m, 2] = np.minimum(255, v[m] - 30)
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")
items = [("need_lamp", L(defringe(depink(cut(W1, i_l))), 16)), ("need_moon", L(defringe(depink(cut(W1, i_m), 10)), 16)),
         ("need_cup", L(defringe(depink(cut(W1, i_c), 10)), 16)), ("need_flame", L(defringe(fl), 16))]
k0, k1 = pair(defringe(cut(W1, i_k)), defringe(depink(cut(W1, i_kh))), "l", 20)
items += [("knot", k0), ("knot_held", k1)]
# the eight window figures: head-and-shoulders busts at map scale (16 px wide; the family 24)
def fbust(kw, rows=15, edit=None, top=0):
    a = Q.arr(P.person(**kw));
    if edit: a = edit(a)
    return Q.bust(Q.img(a), rows + top)
child = Q.bust(P.person(hair="short", hair_col=(150, 96, 52), skin="light", cloth=(200, 120, 60), kid=True), 14)
elder = fbust(dict(hair="long", hair_col=(210, 208, 204), skin="light", cloth=(110, 80, 110)))
worker = fbust(dict(hair="cap", hair_col=(80, 70, 56), skin="tan", cloth=(90, 100, 120), acc="apron"))
def fiddle(a):
    for (x, y, c) in ((11, 11, (150, 80, 40)), (12, 11, (170, 96, 50)), (12, 12, (150, 80, 40)), (11, 12, (120, 64, 34)),
                      (13, 12, (170, 96, 50)), (12, 13, (120, 64, 34)), (10, 10, (60, 40, 30)), (9, 9, (60, 40, 30)), (8, 8, (60, 40, 30))):
        Q.put(a, x, y, c)
    return a
musician = fbust(dict(hair="short", hair_col=(40, 30, 26), skin="brown", cloth=(130, 50, 60)), edit=fiddle)
def baby(a):
    for y in range(11, 15):
        for x in range(9, 14): Q.put(a, x, y, (236, 230, 218))
    for (x, y) in ((9, 11), (13, 11), (9, 14), (13, 14)): Q.put(a, x, y, Q.OUT)
    for (x, y, c) in ((10, 11, (222, 182, 150)), (11, 11, (222, 182, 150)), (10, 10, (222, 182, 150)), (11, 10, (182, 138, 112))):
        Q.put(a, x, y, c)
    return a
parent = fbust(dict(hair="bun", hair_col=(90, 56, 36), skin="medium", cloth=(70, 110, 96)), edit=baby)
def books(a):
    for y in range(11, 15):
        for x in range(1, 5): Q.put(a, x, y, (150, 58, 48) if y % 2 else (230, 214, 180))
    for x in range(1, 5): Q.put(a, x, 10, Q.OUT)
    # spectacles
    for x in (5, 6, 9, 10): Q.put(a, x, 6, (200, 200, 210))
    return a
student = fbust(dict(hair="short", hair_col=(60, 40, 28), skin="light", cloth=(60, 70, 110)), edit=books)
oldman = Q.img(Q.arr(P.dim(fbust(dict(hair="bald", hair_col=(200, 196, 190), skin="light", cloth=(90, 84, 80))), .8)))
adult2 = Q.arr(Q.bust(P.person(hair="short", hair_col=(50, 36, 26), skin="tan", cloth=(110, 70, 50)), 15))
mom = Q.arr(Q.bust(P.person(hair="long", hair_col=(30, 22, 20), skin="tan", cloth=(90, 60, 100)), 15))
kid = Q.arr(Q.bust(P.person(hair="short", hair_col=(30, 22, 20), skin="tan", cloth=(200, 160, 60), kid=True), 14))
fam = np.zeros((15, 26, 4), np.uint8)
fam[:, 0:16][adult2[..., 3] > 0] = adult2[adult2[..., 3] > 0]
sub = fam[:, 10:26]; sub[mom[..., 3] > 0] = mom[mom[..., 3] > 0]
kk = np.zeros((15, 16, 4), np.uint8); kk[1:15] = kid; sub = fam[:, 5:21]; sub[kk[..., 3] > 0] = kk[kk[..., 3] > 0]
family = Q.img(fam)
peo = [("win_child", child), ("win_elder", elder), ("win_worker", worker), ("win_musician", musician),
       ("win_parent", parent), ("win_student", student), ("win_oldman", oldman), ("win_family", family)]
# the Weaver is the existing map sprite (gilligan_0/1): shown for comparison only, not packed
# traced on web-bg (units): each home's window centre; the thread anchor is the sill just below it
HOMES = [[61, 11], [126, 36], [178, 38], [172, 139], [20, 187], [40, 211], [77, 211], [117, 211]]
SPARE = [[152, 211], [54, 38], [142, 44]]
g = {"homes": [{"window": h, "anchor": [h[0], h[1] + 6]} for h in HOMES],
     "spare_windows": SPARE,
     "sources": {"lampmaker": {"sign": [51, 90], "anchor": [51, 103]}, "library": {"sign": [128, 58], "anchor": [128, 72]},
                 "teahouse": {"sign": [153, 120], "anchor": [148, 133]}},
     "own_home": {"door": [96, 64], "window": [96, 52], "anchor": [96, 76], "note": "suggested: the central house (fanlit door, lamp post at [82,55])"},
     "courtyard": [52, 84, 144, 176], "note": "homes 0-7 are lit or dark windows around the ring; spare windows are alternates"}
GEO["web"] = g
def dweb(d):
    for k, h in enumerate(g["homes"]):
        dot(d, *h["window"], GREEN, 6, k); d.line([(U(h["window"][0]), U(h["window"][1]) + 6), (U(h["anchor"][0]), U(h["anchor"][1]))], fill=GREEN, width=2)
    for s_ in g["spare_windows"]: dot(d, *s_, (150, 150, 150, 255), 5, "spare")
    for n, s_ in g["sources"].items(): dot(d, *s_["sign"], ORANGE, 8, n); dot(d, *s_["anchor"], ORANGE, 3)
    dot(d, *g["own_home"]["window"], PINK, 7, "own home"); dot(d, *g["own_home"]["anchor"], PINK, 3)
    box(d, g["courtyard"], CYAN, "courtyard")
geo_overlay("web-geo", "web-bg", dweb)
build("web", items, peo + [("weaver_0 (existing)", chf("gilligan_0"))], [BG("web-bg"), PL("web-plate")],
      ["need icons 16 px: need_lamp (light), need_moon (quiet), need_cup (company), need_flame (warmth); knot / knot_held 20 px at one scale",
       "window figures are head-and-shoulders busts at map scale (show at 2x in a lit window card): child, elder, worker, musician,",
       "parent with a baby, student (books, spectacles), old man alone (dimmed), family (26 px wide). The Weaver is the existing sprite (not packed).",
       "the lamp's glass chimney was painted see-through pink on the key: it comes out clear. The held knot's centre glow is keyed out (it's a ring)."],
      {"geo": g})
# drop the comparison sprite from the packed people
d_ = json.load(open(f"{OUT}/web/rects.json"));
peo_only = [p for p in peo]
d_["prects"] = mat.pack(peo_only, f"{OUT}/web/people.png", width=256); json.dump(d_, open(f"{OUT}/web/rects.json", "w"))

# ======================================================================================
# If Everyone Did It
# ======================================================================================
R1 = "rule-s1"
leaves = merge(R1, [10, 11, 14, 15, 16])
card = trim(cut(R1, 13))
def nine(im, w, h, b):
    """9-slice a framed card to w x h (border b px in the source scaled to the target)"""
    im = trim(im)
    src_ = scaled(im, 92 / im.height)                      # a 92 px tall copy, border ~ 12 px
    bb = 12; sw, sh = src_.size; out = Image.new("RGBA", (w, h))
    xs_ = [(0, bb, 0, bb), (bb, sw - bb, bb, w - bb), (sw - bb, sw, w - bb, w)]
    ys_ = [(0, bb, 0, bb), (bb, sh - bb, bb, h - bb), (sh - bb, sh, h - bb, h)]
    for (sx0, sx1, dx0, dx1) in xs_:
        for (sy0, sy1, dy0, dy1) in ys_:
            piece = src_.crop((sx0, sy0, sx1, sy1)).resize((max(1, dx1 - dx0), max(1, dy1 - dy0)), Image.Resampling.NEAREST)
            out.alpha_composite(piece, (dx0, dy0))
    return out
items = [("bread", Wd(cut(R1, 1), 20)), ("bucket", H(cut(R1, 2), 12)), ("well_lid", Wd(cut(R1, 3), 48)),
         ("bell_hand", H(cut(R1, 6), 12)), ("bell_fire", H(cut(R1, 7), 32)), ("purse", L(cut(R1, 8), 12)),
         ("note", L(cut(R1, 9), 14)), ("leaves", L(leaves, 18)), ("coin_sign", Wd(cut(R1, 12), 24)),
         ("card_frame", H(card, 64)), ("card", nine(card, 360, 46, 12))]
sc0, sc1 = pair(cut(R1, 4), cut(R1, 5), "w", 40); items += [("scales_level", sc0), ("scales_tipped", sc1)]
s0, s1 = pair(cut(R1, 17), cut(R1, 18), "h", 48); items += [("shutter_closed", s0), ("shutter_open", s1)]
# the townsfolk at 12 x 18 (from the game's 8 x 12 figures: the same coat, skin and hat lists), 2 walk frames each
COATS = ["#7A3A3A", "#3A4A6A", "#5A6A3A", "#6A4A2A", "#4A3E66", "#8A7A5A", "#2E4E5A", "#8A4E3A"]
SKINS = ["#E8C8A0", "#D8B090", "#B88A68", "#8A5A3A"]
HATS = [None, "#2A2430", "#B8A8C8", "#6A5A4A", None, "#3A2A20", "#7A2A2A", "#B8A8C8"]
HAIR = [(58, 36, 24), (106, 74, 42), (26, 20, 24), (160, 128, 88)]
peo = []
for n in range(8):
    for f in range(2):
        peo.append((f"folk{n}_{f}", Q.town(COATS[n], SKINS[(n * 3 + 1) % 4], HATS[n], HAIR[n % 4], f)))
for f in range(2):
    peo.append((f"me_{f}", Q.town("#2F7470", "#D8B090", None, None, f, me=True)))
# the crier: a tricorn, a red coat, ringing a hand bell (frame 1 raised)
def crier(f):
    a = Q.arr(Q.town("#8A2A2A", "#E8C8A0", "#2A2430", (90, 60, 40), 0, apron=False))
    a = Q.pad(a, r=3, t=2)
    if f:
        a = Q.limb(a, [(10, 2 + 3 + 9), (12, 2 + 3 + 4)], (138, 42, 42), (232, 200, 160))
        for (x, y, c) in ((12, 3, Q.GOLD), (13, 3, Q.GOLD2), (12, 2, Q.GOLD), (13, 4, Q.GOLD2), (12, 4, Q.GOLD2), (14, 1, (255, 241, 200))):
            Q.put(a, x, y + 0, c)
    else:
        for (x, y, c) in ((11, 15, Q.GOLD), (12, 15, Q.GOLD2), (11, 16, Q.GOLD2), (12, 16, Q.GOLD)):
            Q.put(a, x, y, c)
    return Q.img(a)
peo += [("crier_0", crier(0)), ("crier_1", crier(1))]
# the lender: a green eyeshade, spectacles, a ledger
def lender(f):
    a = Q.arr(Q.town("#3A4A3A", "#D8B090", None, (190, 186, 180), f))
    for x in range(2, 10): Q.put(a, x, 2, (70, 140, 90))
    for x in range(1, 11): Q.put(a, x, 3, (50, 110, 70))
    for x in (3, 4, 7, 8): Q.put(a, x, 4, (220, 220, 230))
    for y in range(10, 14):
        for x in range(0, 4): Q.put(a, x, y, (120, 40, 40) if y < 13 else (230, 214, 180))
    return Q.img(a)
peo += [("lender_0", lender(0)), ("lender_1", lender(1))]
# traced on rule-bg (units)
BLOCK = [[0, 0, 192, 80, "buildings and the clock tower"], [0, 80, 12, 250, "left wall"], [180, 80, 192, 250, "right wall"],
         [36, 84, 94, 148, "bakery stall"], [108, 76, 154, 124, "lending booth"], [132, 126, 166, 162, "crier's platform"],
         [30, 172, 88, 228, "scales stall"], [110, 184, 154, 238, "well"], [18, 60, 30, 112, "lamp"], [158, 60, 170, 112, "lamp"],
         [18, 196, 32, 250, "lamp"], [160, 196, 174, 250, "lamp"], [0, 242, 192, 320, "the card area (the bottom 78 units)"]]
CELL = 8
grid = []
for gy in range(320 // CELL):
    row = ""
    for gx in range(192 // CELL):
        cx, cy = gx * CELL + CELL / 2, gy * CELL + CELL / 2
        row += "#" if any(b[0] <= cx < b[2] and b[1] <= cy < b[3] for b in BLOCK) else "."
    grid.append(row)
g = {"bakery": {"box": [36, 84, 94, 148], "counter": [64, 148], "awning": [38, 85, 92, 112]},
     "well": {"center": [132, 214], "r": 18, "opening": [133, 212], "roof": [132, 190]},
     "scales": {"box": [30, 172, 88, 228], "scales": [60, 184], "front": [60, 230]},
     "crier": {"platform": [132, 126, 166, 162], "bell": [147, 135], "stand": [149, 156]},
     "lending": {"box": [108, 76, 154, 124], "window": [136, 100], "shutters": [124, 88, 148, 112], "front": [131, 128]},
     "clock_tower": {"door": [96, 74], "face_center": [96, 6], "balcony_note": "the clock face is cut off at the top edge"},
     "lamps": [[24, 70], [164, 70], [24, 205], [167, 205]],
     "walk": {"cell": CELL, "rows": grid, "note": "'.' open cobbles, '#' blocked; 24 x 40 cells of 8 units"}}
GEO["rule"] = g
def drule(d):
    for b in BLOCK[:-1]: box(d, b[:4], (255, 120, 120, 200))
    for gy, row in enumerate(grid):
        for gx, ch in enumerate(row):
            if ch == ".": d.point((U(gx * CELL + 4), U(gy * CELL + 4)), fill=GREEN)
    box(d, g["bakery"]["box"], ORANGE, "bakery"); dot(d, *g["well"]["center"], CYAN, U(g["well"]["r"]), "well")
    box(d, g["scales"]["box"], ORANGE, "scales"); box(d, g["crier"]["platform"], ORANGE, "crier"); box(d, g["lending"]["box"], ORANGE, "lending")
    box(d, g["lending"]["shutters"], PINK)
geo_overlay("rule-geo", "rule-bg", drule)
# a scale check: townsfolk walking on the square at 2x
im = Image.open(BG("rule-bg")).convert("RGBA"); pe = dict(peo)
for k, (x, y) in enumerate([(30, 160), (50, 162), (70, 164), (100, 150), (110, 166), (124, 150), (96, 236), (170, 170), (60, 240), (110, 132)]):
    nm = [f"folk{k % 8}_{k % 2}", "crier_1", "lender_0"][0 if k < 8 else k - 7]
    sp = pe[nm]; sp2 = sp.resize((sp.width * 2, sp.height * 2), Image.Resampling.NEAREST)
    im.alpha_composite(sp2, (U(x) - sp2.width // 2, U(y) - sp2.height))
im.save("art/proc4/geo/rule-mock.png")
build("rule", items, peo, [BG("rule-bg"), PL("rule-plate")],
      ["props: bread 20, bucket 12 tall, well_lid 48 wide, scales level/tipped 40 wide (one scale; Gemini's tipped pan is subtle, the build can add a tilt),",
       "hand bell 12, fire bell 32, purse 12, note 14, leaves 18, coin_sign 24, shutter closed/open 48 tall (one scale), card_frame 64 tall,",
       "card = the frame 9-sliced to 360 x 46 px (180 x 23 units, today's card row). Everything is drawn front-on, not straight down (Gemini's choice).",
       "townsfolk 12 x 18 (+ hat) at 2x: folk0..7 x 2 walk frames (the game's COATS / SKINS / HATS), me_0/1 (the Wanderer), crier_0/1 (bell rung in 1), lender_0/1",
       "rule-geo: the walkable grid (green dots), blocked areas (red); rule-mock: figures on the square at game scale"],
      {"geo": g})
json.dump(GEO, open(f"{OUT}/geo4.json", "w"), indent=1)
print("done")
