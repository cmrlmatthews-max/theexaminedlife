#!/usr/bin/env python3
"""Level III art build (plan 4, Phase 33A): Gemini sheets -> per-game atlas, people, rects, review sheets.
Run tools/l3_proc.py first (backdrops, plates, sheet cuts), then tools/l3_vina.py (the vina rig)."""
import json, os, sys, importlib.util
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, "tools")
import people as P
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py")
mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
CUT, OUT = "art/cut3", "art/out3"
os.makedirs(OUT, exist_ok=True)
def cut(sheet, i): return Image.open(f"{CUT}/{sheet}/{i:02d}.png").convert("RGBA")
def trim(im): return im.crop(im.getbbox())
def scaled(im, s):
    """resize a cutout by factor s (premultiplied), hard alpha edge"""
    im = trim(im); w, h = max(1, round(im.width * s)), max(1, round(im.height * s))
    arr = mat.premul_resize(im, (w, h)); a = (arr[..., 3] >= .5).astype(np.uint8)
    return Image.fromarray(np.dstack([(arr[..., :3] * 255).astype(np.uint8), a * 255]), "RGBA")
def H(im, h): im = trim(im); return scaled(im, h / im.height)          # height h
def L(im, n): im = trim(im); return scaled(im, n / max(im.size))      # longest side n
def Wd(im, w): im = trim(im); return scaled(im, w / im.width)         # width w
def pair(a, b, mode, n):
    """two frames of one thing at one shared scale (so the animation doesn't jump)"""
    a, b = trim(a), trim(b)
    base = {"h": a.height, "l": max(a.size), "w": a.width}[mode]
    s = n / base; return scaled(a, s), scaled(b, s)
def defringe(img, thr=28):
    """Gemini paints glows as pink on the magenta key: drop pink-tinted pixels on the edge, warm up the rest"""
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
def tile(im, n):
    """a square game tile: squash the cutout to exactly n x n"""
    im = trim(im); arr = mat.premul_resize(im, (n, n)); a = (arr[..., 3] >= .5).astype(np.uint8)
    return Image.fromarray(np.dstack([(arr[..., :3] * 255).astype(np.uint8), a * 255]), "RGBA")

src = open("base/index.html", encoding="utf-8").read()
i = src.find("ATLAS.chars=") + len("ATLAS.chars="); j = src.find(";", i)
CH = json.loads(src[i:j])["rects"]
CA = Image.open("blobs/1092ba9bca54f8ddf104f6d02f4310e8.png").convert("RGBA")
def chf(n): r = CH[n]; return CA.crop((r[0], r[1], r[0] + r[2], r[1] + r[3]))

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
        if abs(im.width / im.height - .6) < .02: return im.resize((192, 320))
        k = min(386 / im.width, 320 / im.height); return im.resize((int(im.width * k), int(im.height * k)))
    thumbs = [thumb(p) for p in extra]
    rows = (len(thumbs) + 6) // 7
    tx = []; xx = 10
    for k, t in enumerate(thumbs):
        if k % 7 == 0: xx = 10
        tx.append(xx); xx += t.width + 6
    Hh = H1 + rows * 340 + 20 * len(notes) + 10
    cs = Image.new("RGBA", (W, Hh), (38, 34, 48, 255)); d = ImageDraw.Draw(cs)
    for n, t, x, y in pos:
        cs.alpha_composite(t, (x, y + 14)); d.text((x, y), n[:24], fill=(255, 226, 160, 255))
    for k, t in enumerate(thumbs):
        cs.alpha_composite(t, (tx[k], H1 + (k // 7) * 340))
        d.text((tx[k] + 2, H1 + (k // 7) * 340 + 322), os.path.basename(extra[k]), fill=(200, 200, 220, 255))
    for k, s in enumerate(notes):
        d.text((10, H1 + rows * 340 + 20 * k), s, fill=(255, 226, 160, 255))
    cs.save(f"{OUT}/{game}/_review.png")

def build(game, items, peo, extra=(), notes=(), meta=None):
    os.makedirs(f"{OUT}/{game}", exist_ok=True)
    rects = mat.pack(items, f"{OUT}/{game}/atlas.png", width=1024) if items else {}
    prects = mat.pack(peo, f"{OUT}/{game}/people.png", width=256) if peo else {}
    data = {"rects": rects, "prects": prects}
    if meta: data.update(meta)
    json.dump(data, open(f"{OUT}/{game}/rects.json", "w"))
    geo = sorted(f"art/proc3/geo/{f}" for f in os.listdir("art/proc3/geo") if f.startswith(game) and f.endswith(".png"))
    review(game, items, peo, list(extra) + geo, notes)
    print(game, Image.open(f"{OUT}/{game}/atlas.png").size, os.path.getsize(f"{OUT}/{game}/atlas.png"), "people", len(peo))

BG = lambda n: f"art/proc3/bg/{n}.png"; PL = lambda n: f"art/proc3/plate/{n}.jpg"
GEO = json.load(open(f"{OUT}/geo3.json"))

def geo_overlay(name, bgname, draw):
    im = Image.open(BG(bgname)).convert("RGBA"); d = ImageDraw.Draw(im); draw(d); im.save(f"art/proc3/geo/{name}.png")
def U(v): return v * 2  # units -> backdrop pixels

# ================= Tune the Lute =================
V = json.load(open(f"{OUT}/lute_vina.json"))
items = [("vina", largest(Image.open(f"{OUT}/lute/_vina.png")))] + [(n, Image.open(f"{OUT}/lute/_{n}.png")) for n in ("peg0", "peg1", "peg2")]
items += [("bell", H(cut("lute-s1", 2), 32))]
items += [(f"petal_{k}", L(cut("lute-s1", 3 + k), 8)) for k in range(3)]
b0, b1 = pair(cut("lute-s1", 6), cut("lute-s1", 7), "l", 16)
items += [("bird_0", b0), ("bird_1", b1)]
lit = trim(cut("lute-s1", 9))
# the unlit lamp: Gemini's "unlit" lamp (item 8) is a different, roofless lamp with a pink haze, so the unlit
# frame is made from the lit one by darkening its flame window to cold stone
a = np.array(lit).astype(np.int32); r, g, b = a[..., 0], a[..., 1], a[..., 2]
warm = (a[..., 3] > 0) & (r > 150) & (r > b + 40)
a[warm, 0], a[warm, 1], a[warm, 2] = 46, 42, 48
unlit = Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")
lo, ln = pair(unlit, lit, "h", 20)
items += [("lamp_off", lo), ("lamp_on", ln)]
lamps = GEO["lute"]["lamps"]
def dl(d):
    for k, L_ in enumerate(lamps):
        x, y = U(L_[0]), U(L_[1]); col = (120, 255, 120, 255) if L_[2] == "painted" else (255, 120, 255, 255)
        d.ellipse((x - 6, y - 6, x + 6, y + 6), outline=col, width=2); d.text((x + 8, y - 6), str(k), fill=col)
geo_overlay("lute-lamps", "lute-bg", dl)
# the vina composed with its strings, for the review
vv = largest(Image.open(f"{OUT}/lute/_vina.png"))
for n, p in V["pegs"].items(): vv.alpha_composite(Image.open(f"{OUT}/lute/_{n}.png"), tuple(p["at"]))
vv = vv.resize((vv.width * 3, vv.height * 3), Image.Resampling.NEAREST); d = ImageDraw.Draw(vv)
for s_ in V["strings"]: d.line([(s_[0][0] * 3, s_[0][1] * 3), (s_[1][0] * 3, s_[1][1] * 3)], fill=(245, 198, 106, 255), width=2)
for n, p in V["pegs"].items():
    x, y = (p["at"][0] + p["pivot"][0]) * 3, (p["at"][1] + p["pivot"][1]) * 3; d.ellipse((x - 4, y - 4, x + 4, y + 4), outline=(120, 255, 120, 255), width=2)
bgv = Image.new("RGBA", (vv.width, vv.height), (38, 34, 48, 255)); bgv.alpha_composite(vv); bgv.save("art/proc3/geo/lute-vina-rig.png")
build("lute", items, [], [BG("lute-bg"), PL("lute-plate")],
      ["vina turned horizontal (73.2 deg clockwise), 300 x 107 px; Gemini drew a 4th peg on the far side: erased",
       "pegs peg0..2 are rig parts: 'at' = offset in the vina, 'pivot' = in the peg's own pixels (rects.json vina)",
       "strings: 3 anchor pairs nut -> bridge in vina pixels; lamps: 4 painted + 1 to draw (pink)",
       "lamp_off made from lamp_on (Gemini's unlit lamp was a different, roofless lamp)"],
      {"vina": V, "lamps": lamps})

# ================= Be Water =================
TS = GEO["water"]["tile_px"]
names = ["soil", "stone", "bedrock", "clay_0", "clay_1", "clay_2", "terrace_0", "terrace_1", "terrace_2", "terrace_3", "spring"]
items = [(n, tile(cut("water-s1", k + 1), TS)) for k, n in enumerate(names)]
items += [("boulder", Wd(cut("water-s1", 15), 2 * TS)), ("seed", L(cut("water-s1", 13), 14)), ("sprout", H(cut("water-s1", 14), 16))]
f0, f1 = pair(cut("water-s1", 16), cut("water-s1", 17), "h", 48)
items += [("buffalo_0", largest(defringe(f0))), ("buffalo_1", largest(defringe(f1)))]
gw = GEO["water"]
def dw(d):
    x0, y0, x1, y1 = [U(v) for v in gw["slope"]]; d.rectangle((x0, y0, x1, y1), outline=(120, 255, 120, 255), width=2)
    sx, sy = U(gw["spring"][0]), U(gw["spring"][1]); d.ellipse((sx - 8, sy - 8, sx + 8, sy + 8), outline=(120, 200, 255, 255), width=2)
    bx, by = U(gw["buffalo"][0]), U(gw["buffalo"][1]); d.rectangle((bx - 40, by - 46, bx + 40, by), outline=(255, 200, 120, 255), width=2)
geo_overlay("water-areas", "water-bg", dw)
build("water", items, [], [BG("water-bg"), PL("water-plate")],
      [f"tiles squashed to {TS} x {TS} px = the game's 18-unit cell (TS=18 in Phase 23's Be Water)",
       "boulder = 2 x 2 cells wide; the painted spring and the open slope are traced in rects.json geo (units)",
       "Gemini drew two boulders: the larger, more detailed one (item 15) is used"],
      {"geo": gw})

# ================= The Tenzo's Kitchen =================
K1, K2 = "kitchen-s1", "kitchen-s2"
items = [("rice_bowl", H(cut(K1, 1), 64)), ("sieve", Wd(cut(K1, 2), 56))]
m0, m1 = pair(cut(K2, 3), cut(K2, 2), "l", 20)          # fresh and dried, one scale: the dried one is smaller
items += [("mush_fresh", m0), ("mush_dried", m1), ("drying_tray", Wd(cut(K2, 1), 96)), ("greens", H(cut(K2, 4), 40)),
          ("knife", H(cut(K2, 5), 40)), ("board", H(cut(K2, 6), 56))]
items += [("dish_rice", H(cut(K2, 7), 24)), ("dish_soup", H(cut(K2, 8), 24)), ("dish_pickles", Wd(cut(K2, 9), 28)),
          ("dish_greens", Wd(cut(K2, 10), 28)), ("dish_tea", H(cut(K2, 11), 24)), ("tray", Wd(cut(K2, 12), 128)),
          ("ladle", H(cut(K2, 16), 40))]
# people: the old tenzo (bent with age, bare-headed: Dogen met him drying mushrooms in the sun with no hat)
old = dict(hair="bald", hair_col=(214, 212, 204), skin="tan", cloth=(112, 98, 80), collar=(196, 186, 164))
def stoop(img, drop):
    a = np.array(img); out = np.zeros_like(a); out[drop:11 + drop] = a[0:11]; out[11 + drop:] = a[11 + drop:]
    return Image.fromarray(out, "RGBA")
ten0 = P.lean(stoop(P.person(**old), 2), 4)                    # working: stooped over the tray
ten1 = P.lean(P.person(**old, pose="wave", frame=1), 2)        # pausing to speak: straightens a little, hand up
def bow(img):
    """Dogen bowing: the head dips three pixels (eyes hidden: we see the crown), hands together at the chest"""
    a = np.array(img); out = a.copy(); head = a[0:10].copy()
    eye = np.all(head[..., :3] == P.EYE, -1) & (head[..., 3] > 0); head[eye, :3] = P.SKIN["light"][0]
    out[0:3] = 0; m = head[..., 3] > 0; seg = out[3:13]; seg[m] = head[m]; out[3:13] = seg
    for (x, y, c) in ((7, 14, P.OUT), (8, 14, P.OUT), (7, 15, P.SKIN["light"][0]), (8, 15, P.SKIN["light"][1]),
                      (7, 16, P.SKIN["light"][0]), (8, 16, P.SKIN["light"][1]), (7, 17, P.OUT), (8, 17, P.OUT)):
        out[y, x] = list(c) + [255]
    return Image.fromarray(out, "RGBA")
peo = [("tenzo_0", ten0), ("tenzo_1", ten1), ("dogen_bow", bow(chf("dogen_0"))), ("dogen_0", chf("dogen_0"))]
build("kitchen", items, peo, [BG("kitchen-bg"), BG("kitchen-bg2"), BG("kitchen-bg3"), PL("kitchen-plate")],
      ["kitchen-bg3 (evening) was made, so evening needs no grade(); kitchen-s2 re-made the sheet with the drying tray empty",
       "mushrooms: fresh and dried at one shared scale (the dried one is ~15% smaller); dishes ~24 px; tray 128 px wide",
       "people: tenzo_0 working (stooped), tenzo_1 pausing to speak; dogen_bow is new (dogen_0 shown for comparison)"])

# ================= Butterfly Dream =================
B = "butterfly-s1"
items = [("tree", H(cut(B, 1), 120))]
br = [trim(cut(B, k)) for k in (2, 3, 4)]; s = 48 / br[0].width
items += [(f"bridge_{k}", scaled(im, s)) for k, im in enumerate(br)]
g0, g1 = pair(cut(B, 5), cut(B, 10), "h", 32); items += [("gust_0", g0), ("gust_1", g1)]
l0, l1 = pair(cut(B, 6), cut(B, 9), "h", 24); items += [("lever_up", l0), ("lever_down", l1)]
f0, f1 = pair(cut(B, 7), cut(B, 8), "l", 16); items += [("fish_0", f0), ("fish_1", f1)]
o0, o1 = pair(cut(B, 11), cut(B, 12), "l", 16); items += [("bfly_open", o0), ("bfly_closed", o1)]
items += [("lilypads", Wd(cut(B, 13), 48))]
items = [(n, defringe(im)) for n, im in items]
build("butterfly", items, [], [PL("butterfly-plate")],
      ["bridge_0 closed, _1 opening, _2 glowing (one shared scale, 48 px wide); gusts and levers 2 frames each",
       "fish and butterfly 16 px on the longest side (in-between wing frames are made in code); no backdrop: the map rooms use the Level III tileset",
       "butterfly-s1 came out of Gemini at 1024 x 1024 (the others 2048): fine at these sizes"])
print("done")
