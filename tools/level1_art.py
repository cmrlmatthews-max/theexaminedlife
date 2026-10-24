#!/usr/bin/env python3
"""Level I art build (plan 4, Phases 30 + 31A): Cade's Gemini images -> per-game atlases, backdrops, plates, people.
Run from /home/claude/el. Writes art/out/<game>/{atlas.png,people.png,rects.json,_review.png} (backdrops and plates
were already processed into art/proc/bg and art/proc/plate)."""
import json, os, sys, importlib.util
import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, "tools")
import people as P
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py")
mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)

CUT = "art/cut"
OUT = "art/out"
os.makedirs(OUT, exist_ok=True)

def cut(sheet, i):
    return Image.open(f"{CUT}/{sheet}/{i:02d}.png").convert("RGBA")

def erode_alpha(img, n=1):
    a = np.array(img)
    m = a[..., 3] > 0
    for _ in range(n):
        p = np.pad(m, 1)
        m = m & p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
    a[..., 3] = np.where(m, a[..., 3], 0)
    return Image.fromarray(a, "RGBA")

def sp(img, h, colors=0, outline=False, erode=0):
    if erode: img = erode_alpha(img, erode)
    return mat.sprite(img, None, h, colors=colors, outline=outline)

def frames_of(img, n, h, name):
    import tempfile
    d = tempfile.mkdtemp()
    paths = mat.frames(img, d, n, h)
    return [(f"{name}_{i}", Image.open(p).convert("RGBA")) for i, p in enumerate(paths)]

def review(game, items, people_items, extra_imgs=()):
    """contact sheet: every piece at game size (x2 for readability), people at x4, plus backdrops/plate thumbnails"""
    tiles = [(n, im.resize((im.width * 2, im.height * 2), Image.Resampling.NEAREST)) for n, im in items]
    tiles += [(n, im.resize((im.width * 4, im.height * 4), Image.Resampling.NEAREST)) for n, im in people_items]
    W = 1400; x = y = 10; row_h = 0; pos = []
    for n, t in tiles:
        if x + t.width + 10 > W:
            x = 10; y += row_h + 26; row_h = 0
        pos.append((n, t, x, y)); x += t.width + 10; row_h = max(row_h, t.height)
    H1 = y + row_h + 30
    thumbs = [Image.open(p).convert("RGBA").resize((192, 320)) for p in extra_imgs]
    H = H1 + (340 if thumbs else 0)
    cs = Image.new("RGBA", (W, H), (38, 34, 48, 255)); d = ImageDraw.Draw(cs)
    for n, t, x, y in pos:
        cs.alpha_composite(t, (x, y + 14)); d.text((x, y), n[:22], fill=(255, 226, 160, 255))
    for i, t in enumerate(thumbs):
        cs.alpha_composite(t, (10 + i * 200, H1))
    cs.save(f"{OUT}/{game}/_review.png")

def build(game, items, people_items, extra=()):
    os.makedirs(f"{OUT}/{game}", exist_ok=True)
    rects = mat.pack(items, f"{OUT}/{game}/atlas.png", width=1024) if items else {}
    prects = mat.pack(people_items, f"{OUT}/{game}/people.png", width=256) if people_items else {}
    json.dump({"rects": rects, "prects": prects}, open(f"{OUT}/{game}/rects.json", "w"))
    review(game, items, people_items, extra)
    a = Image.open(f"{OUT}/{game}/atlas.png") if items else None
    print(game, "atlas", a.size if a else None, os.path.getsize(f"{OUT}/{game}/atlas.png") if items else 0,
          "people", len(people_items))
    return rects, prects

# ---------- characters atlas (the Wanderer's existing frames) ----------
src = open("base/index.html", encoding="utf-8").read()
i = src.find("ATLAS.chars=") + len("ATLAS.chars="); j = src.find(";", i)
CH = json.loads(src[i:j])["rects"]
CA = Image.open("blobs/1092ba9bca54f8ddf104f6d02f4310e8.png").convert("RGBA")
def chf(name):
    r = CH[name]; return CA.crop((r[0], r[1], r[0] + r[2], r[1] + r[3]))

# ================= Sisyphus's Hill =================
grey = Image.open(f"{CUT}/boulder_grey_clean.png").convert("RGBA")
gold = Image.open(f"{CUT}/boulder_gold2.png").convert("RGBA")
items = frames_of(grey, 16, 72, "boulder") + frames_of(gold, 16, 72, "gold")
names = ["bud", "flower", "gull_up", "gull_stand", "lizard", "boat", "lantern_off", "lantern_on"]
hts = [28, 34, 34, 30, 26, 28, 28, 28]
for k, (n, h) in enumerate(zip(names, hts), 1):
    items.append((n, sp(cut("sisyphus-s2", k), h, erode=1 if n in ("flower", "boat") else 0)))
wr = [chf(f"wanderer_right_{k}") for k in range(3)]
peo = [("push_0", P.lean(wr[0], 3)), ("push_1", P.lean(wr[1], 3)), ("push_2", P.lean(wr[0], 3)), ("push_3", P.lean(wr[2], 3)),
       ("sit", P.sit(chf("wanderer_down_0"))),
       ("friend_0", P.person("long", (120, 70, 40), "medium", (70, 110, 120), pose="wave", frame=0)),
       ("friend_1", P.person("long", (120, 70, 40), "medium", (70, 110, 120), pose="wave", frame=1))]
build("sisyphus", items, peo, ["art/proc/bg/sisyphus-bg.png", "art/proc/bg/sisyphus-bg2.png", "art/proc/plate/sisyphus-plate.jpg"])

# ================= Goalkeeper =================
items = [("striker_0", sp(cut("goalkeeper-s1", 1), 112)), ("striker_1", sp(cut("goalkeeper-s1", 2), 112)),
         ("striker_2", sp(cut("goalkeeper-s1", 3), 112))]
items += frames_of(cut("goalkeeper-s1", 4), 12, 28, "ball")
wd = chf("wanderer_down_0")
kid = lambda hair, hc, skin, cl, f: P.person(hair, hc, skin, cl, kid=True, pose="cheer" if f < 2 else "stand", frame=f % 2)
peo = [("keep_set", wd), ("keep_set1", chf("wanderer_down_1")), ("keep_dl", P.rot90(wd, cw=False)), ("keep_dr", P.rot90(wd, cw=True)),
       ("keep_lie", P.rot90(wd, cw=True))]
kids = [("short", (130, 80, 40), "light", (150, 120, 60)), ("long", (40, 30, 20), "brown", (170, 70, 60)), ("cap", (70, 60, 50), "tan", (80, 110, 150))]
for n, (hair, hc, skin, cl) in enumerate(kids):
    peo += [(f"kid{n}_0", kid(hair, hc, skin, cl, 0)), (f"kid{n}_1", kid(hair, hc, skin, cl, 1)),
            (f"kid{n}_2", kid(hair, hc, skin, cl, 2))]
build("goalkeeper", items, peo, ["art/proc/bg/goalkeeper-bg.png", "art/proc/plate/goalkeeper-plate.jpg"])

# ================= Sounding the Idols =================
idn = {1: "idol_wealth", 2: "idol_fame", 3: "idol_comfort", 6: "idol_crowd", 7: "idol_duty", 8: "idol_progress", 9: "idol_clay", 10: "idol_self"}
ih = {"idol_comfort": 58, "idol_progress": 80}
items = [(n, sp(cut("idols-s1", k), ih.get(n, 96), erode=1 if n == "idol_self" else 0)) for k, n in idn.items()]
items += frames_of(cut("idols-s1", 11), 8, 40, "hammer")
for g in range(3):
    big = sp(cut("idols-s2", g + 1), 236)
    h = big.height; cuts = [0, int(h * .30), int(h * .62), h]
    items.append((f"giant{g}", big))
    for s in range(3):
        items.append((f"giant{g}_{s}", big.crop((0, cuts[s], big.width, cuts[s + 1]))))
build("idols", items, [], ["art/proc/bg/idols-bg.png", "art/proc/plate/idols-plate.jpg"])

# ================= Having or Being =================
hv = {1: ("coins", 26), 2: ("crown", 26), 3: ("gem", 26), 4: ("chest", 28), 5: ("frame", 32), 6: ("trophy", 30)}
items = [(n, sp(cut("having-s1", k), h)) for k, (n, h) in hv.items()]
b2 = {3: ("note_a", 22), 7: ("note_b", 24), 4: ("note_c", 22), 5: ("paperlamp", 30), 11: ("flower_closed", 28), 12: ("flower_open", 32),
      13: ("basket_0", 34), 14: ("basket_1", 34), 15: ("basket_2", 40)}
items += [(n, sp(cut("having-s2", k), h, erode=1 if n in ("paperlamp", "flower_open", "note_a", "note_b", "note_c") else 0)) for k, (n, h) in b2.items()]
# the frame's trophy: a grey, drained copy of each moment (made here so the frame can "keep" any moment)
def drained(img):
    a = np.array(img).astype(np.float32); g = a[..., :3].mean(-1, keepdims=True)
    a[..., :3] = g * .8 + np.array([30, 28, 34]) * .2
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")
items += [(n + "_grey", drained(im)) for n, im in list(items) if n in ("note_b", "paperlamp", "flower_open")]
gate = [("child", dict(hair="short", hair_col=(90, 60, 40), skin="tan", cloth=(90, 120, 150), kid=True)),
        ("elder", dict(hair="bun", hair_col=(212, 210, 216), skin="light", cloth=(120, 70, 90))),
        ("stranger", dict(hair="cap", hair_col=(70, 60, 50), skin="dark", cloth=(100, 110, 80)))]
peo = []
for n, kw in gate:
    peo += [(f"{n}_wait", P.dim(P.person(**kw))), (f"{n}_lit", P.person(**kw, pose="cheer"))]
dancers = [dict(hair="long", hair_col=(150, 90, 40), skin="medium", cloth=(170, 60, 70)),
           dict(hair="short", hair_col=(40, 30, 20), skin="brown", cloth=(60, 90, 140)),
           dict(hair="scarf", hair_col=(200, 150, 60), skin="tan", cloth=(90, 60, 110)),
           dict(hair="short", hair_col=(200, 190, 170), skin="light", cloth=(80, 120, 90))]
for n, kw in enumerate(dancers):
    peo += [(f"dancer{n}_0", P.person(**kw, pose="wave", frame=0)), (f"dancer{n}_1", P.person(**kw, pose="cheer", frame=1))]
build("having", items, peo, ["art/proc/bg/having-bg.png", "art/proc/bg/having-bg2.png", "art/proc/bg/having-bg3.png", "art/proc/plate/having-plate.jpg"])

# ================= Open Together =================
items = [("cage", sp(cut("cages-s1", 1), 64)), ("cage_open", sp(cut("cages-s1", 2), 64))]
key = sp(cut("cages-s1", 3), 30)
items.append(("key", key))
items += [(f"key_{i}", key.rotate(-30 * i, expand=True, resample=Image.Resampling.NEAREST)) for i in (1, 2, 3)]
items += [("gate", sp(cut("cages-s1", 4), 118)), ("gate_l", sp(cut("cages-s1", 6), 118)), ("gate_r", sp(cut("cages-s1", 7), 118)),
          ("bird_0", sp(cut("cages-s1", 8), 24)), ("bird_1", sp(cut("cages-s1", 9), 22))]
caged = [("oldwoman", dict(hair="bun", hair_col=(214, 212, 218), skin="light", cloth=(110, 80, 110))),
         ("child", dict(hair="short", hair_col=(60, 40, 30), skin="brown", cloth=(160, 110, 50), kid=True)),
         ("scholar", dict(hair="short", hair_col=(50, 40, 30), skin="light", cloth=(60, 70, 110), acc="books")),
         ("laborer", dict(hair="cap", hair_col=(90, 70, 50), skin="tan", cloth=(110, 90, 70), acc="apron")),
         ("youngwoman", dict(hair="scarf", hair_col=(60, 110, 120), skin="medium", cloth=(140, 60, 70))),
         ("oldman", dict(hair="bald", hair_col=(200, 200, 206), skin="dark", cloth=(90, 90, 80), acc="cane"))]
peo = []
for n, kw in caged:
    peo += [(f"{n}_0", P.person(**kw)), (f"{n}_1", P.person(**kw, frame=1)), (f"{n}_free", P.person(**kw, pose="thread")),
            (f"{n}_cheer", P.person(**kw, pose="cheer"))]
build("cages", items, peo, ["art/proc/bg/cages-bg.png"])
print("done")
