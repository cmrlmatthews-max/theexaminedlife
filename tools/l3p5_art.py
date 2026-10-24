#!/usr/bin/env python3
"""Plan 5, Phase 42A: Level III art build. Gemini sheet cuts -> per-game atlas (rects), people sheets (from
art/people42/<group>), traced geometry, contact sheets. Run tools/l2p5_proc.py and tools/people42.py first. Mirrors tools/boss_art.py."""
import json, os, sys, importlib.util
import numpy as np
from PIL import Image, ImageDraw
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py")
mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
CUT, OUT, P = "art/cut42", "art/out42", "art/proc42"
only = sys.argv[1:]
def want(g): return not only or g in only
def cut(sheet, i): return Image.open(f"{CUT}/{sheet}/{i:02d}.png").convert("RGBA")
def trim(im): return im.crop(im.getbbox())
def scaled(im, s):
    im = trim(im); w, h = max(1, round(im.width * s)), max(1, round(im.height * s))
    arr = mat.premul_resize(im, (w, h)); a = (arr[..., 3] >= .5).astype(np.uint8)
    return Image.fromarray(np.dstack([(arr[..., :3] * 255).astype(np.uint8), a * 255]), "RGBA")
def H(im, h): im = trim(im); return scaled(im, h / im.height)
def W(im, w): im = trim(im); return scaled(im, w / im.width)
def L(im, n): im = trim(im); return scaled(im, n / max(im.size))
def same(ims, mode, n):
    """several cuts at one scale, set by the first"""
    ims = [trim(i) for i in ims]; b = {"h": ims[0].height, "w": ims[0].width, "l": max(ims[0].size)}[mode]
    return [scaled(i, n / b) for i in ims]
def dehalo(img, iters=60, blue=False, thr=14):
    a = np.array(img).astype(np.int32)
    for _ in range(iters):
        al = a[..., 3] > 0; r, g, b = a[..., 0], a[..., 1], a[..., 2]
        bad = al & (((np.minimum(r, b) - g) > thr) | (((b - g) > 12) if blue else False))
        p = np.pad(~al, 1, constant_values=True)
        edge = p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]
        kill = bad & edge
        if not kill.any(): break
        a[kill, 3] = 0
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")
def depink(img, thr=25, ring=2):
    """recolor magenta-tinted pixels near the edge (key spill) to a neutral tone; interior plum shading stays"""
    a = np.array(img).astype(np.int32); al = a[..., 3] > 0
    near = np.zeros_like(al); p = np.pad(~al, ring, constant_values=True)
    for dy in range(-ring, ring + 1):
        for dx in range(-ring, ring + 1):
            near |= p[ring + dy:ring + dy + al.shape[0], ring + dx:ring + dx + al.shape[1]]
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    bad = al & near & ((np.minimum(r, b) - g) > thr)
    v = (r + g + b) / 3
    for c, k in ((0, .92), (1, .95), (2, 1.04)): a[..., c] = np.where(bad, (v * k).astype(np.int32), a[..., c])
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")
def warmglow(img):
    """pink glow pixels (the magenta key bleeding into a warm light) -> warm gold"""
    a = np.array(img).astype(np.int32); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    bad = (a[..., 3] > 0) & (r > 150) & (b > 110) & (g < np.minimum(r, b) - 25)
    for c, v in ((0, 245), (1, 190), (2, 110)): a[..., c] = np.where(bad, (a[..., c] * .3 + v * .7).astype(np.int32), a[..., c])
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")
def degreen(img, iters=40):
    a = np.array(img).astype(np.int32)
    for _ in range(iters):
        al = a[..., 3] > 0; r, g, b = a[..., 0], a[..., 1], a[..., 2]
        bad = al & (((g - np.maximum(r, b)) > 30) | ((g > b + 70) & (g > r - 15)))
        p = np.pad(~al, 1, constant_values=True)
        edge = p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]
        kill = bad & edge
        if not kill.any(): break
        a[kill, 3] = 0
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")
def largest(img):
    a = np.array(img); m = a[..., 3] > 0; lab, n = mat.label(m)
    if n > 1:
        sizes = [(lab == i).sum() for i in range(1, n + 1)]; a[lab != 1 + int(np.argmax(sizes)), 3] = 0
    return Image.fromarray(a, "RGBA")
def surface_top(im, frac=(.3, .7)):
    """the y (px) of a piece's flat top: the median first opaque row over the middle columns"""
    a = np.array(im)[..., 3] > 0; w = a.shape[1]; ys = []
    for x in range(int(w * frac[0]), int(w * frac[1])):
        col = np.nonzero(a[:, x])[0]
        if len(col): ys.append(col[0])
    return int(np.median(ys))

def review(game, items, people, extra=(), notes=(), title=""):
    tiles = []
    for n, im in items:
        k = 4 if max(im.size) <= 24 else (2 if max(im.size) <= 160 else 1)
        tiles.append((f"{n} {im.width}x{im.height}", im.resize((im.width * k, im.height * k), Image.Resampling.NEAREST)))
    Wd = 1500; x = y = 10; rh = 0; pos = []
    for n, t in tiles:
        if x + t.width + 10 > Wd: x = 10; y += rh + 26; rh = 0
        pos.append((n, t, x, y)); x += max(t.width, 90) + 10; rh = max(rh, t.height)
    H1 = y + rh + 34
    ppl = Image.open(people) if people and os.path.exists(people) else None
    if ppl and ppl.width > Wd: ppl = ppl.resize((Wd, int(ppl.height * Wd / ppl.width)))
    H2 = H1 + (ppl.height + 20 if ppl else 0)
    def thumb(p):
        im = Image.open(p).convert("RGBA")
        k = min(384 / im.width, 640 / im.height); return im.resize((int(im.width * k), int(im.height * k)))
    extra = [p for p in extra if os.path.exists(p) and os.path.getsize(p) > 0]
    th = [thumb(p) for p in extra]
    per = 3; rows = (len(th) + per - 1) // per
    Ht = H2 + rows * 670 + 22 * len(notes) + 40
    cs = Image.new("RGBA", (Wd, Ht), (38, 34, 48, 255)); d = ImageDraw.Draw(cs)
    d.text((10, Ht - 22 * len(notes) - 30), title, fill=(255, 255, 255, 255))
    for n, t, x, y in pos:
        cs.alpha_composite(t, (x, y + 14)); d.text((x, y), n[:30], fill=(255, 226, 160, 255))
    if ppl: d.text((10, H1 - 14), "PEOPLE (code-drawn, shown 6x)", fill=(160, 220, 255, 255)); cs.alpha_composite(ppl.convert("RGBA"), (0, H1))
    for k, t in enumerate(th):
        tx = 10 + (k % per) * 500; ty = H2 + (k // per) * 670
        cs.alpha_composite(t, (tx, ty)); d.text((tx + 2, ty + t.height + 2), os.path.basename(extra[k]), fill=(200, 200, 220, 255))
    for k, s in enumerate(notes):
        d.text((10, Ht - 22 * len(notes) - 8 + 22 * k), s, fill=(255, 226, 160, 255))
    os.makedirs(f"{OUT}/_review", exist_ok=True)
    cs.convert("RGB").save(f"{OUT}/_review/_review-{game}.png")

def build(game, items, meta=None, people=None, extra=(), notes=()):
    os.makedirs(f"{OUT}/{game}", exist_ok=True)
    rects = mat.pack(items, f"{OUT}/{game}/atlas.png", width=1024)
    data = {"rects": rects}
    if people:
        pj = json.load(open(f"art/people42/{people}/people.json"))
        Image.open(f"art/people42/{people}/people.png").save(f"{OUT}/{game}/people.png", optimize=True)
        data["prects"] = pj["prects"]; data["pivots"] = pj.get("pivots", {})
    if meta: data.update(meta)
    json.dump(data, open(f"{OUT}/{game}/rects.json", "w"))
    review(game, items, f"art/people42/{people}/_review.png" if people else None, extra, notes, title=game)
    print(game, Image.open(f"{OUT}/{game}/atlas.png").size, os.path.getsize(f"{OUT}/{game}/atlas.png"), "people" if people else "")
BG = lambda n: f"{P}/bg/{n}.png"; PL = lambda n: f"{P}/plate/{n}.jpg"
def region(sheet, box, key):
    """key out a raw-sheet region (for an item the cutter split into pieces)"""
    im = Image.open(f"art/raw42/{sheet}.png").convert("RGB").crop(box)
    out, al = mat.key_alpha(np.array(im), key)
    rgba = np.dstack([out.clip(0, 255).astype(np.uint8), ((al >= .5) * 255).astype(np.uint8)])
    return trim(Image.fromarray(rgba, "RGBA"))
def fit(im, w, h):
    return Image.fromarray(np.array(im.resize((w, h), Image.Resampling.NEAREST)), "RGBA")
G = lambda im, **k: degreen(im, **k)

def raw_region(sheet, box, key="magenta"):
    return region(sheet, box, key)
def fitL(im, w, h):
    """scale to fit inside w x h, keeping the aspect"""
    im = trim(im); s = min(w / im.width, h / im.height); return scaled(im, s)
def upright(im):
    """rotate a lying piece 90 degrees so it stands"""
    return trim(im).rotate(90, expand=True, resample=Image.Resampling.NEAREST)
def keep_bottom(im, rows):
    im = trim(im); return trim(im.crop((0, max(0, im.height - rows), im.width, im.height)))
def repaint(im, fn):
    a = np.array(im).astype(np.int32); a = fn(a); return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")
def slip_px(w=8, h=56):
    """a plain blank bamboo slip, drawn in code (the sheets drew it lying at an angle)"""
    a = np.zeros((h, w, 4), np.uint8)
    BODY, LITE, DARK, OUTL = (206, 178, 112), (232, 208, 146), (160, 128, 72), (70, 50, 30)
    for y in range(h):
        for x in range(w):
            edge = x in (0, w - 1) or y in (0, h - 1)
            c = OUTL if edge else (LITE if x == 1 else DARK if x == w - 2 else BODY)
            if y in (h // 3, 2 * h // 3) and not edge: c = DARK
            a[y, x] = list(c) + [255]
    return Image.fromarray(a, "RGBA")

def goldglow(im):
    """the key's magenta mixed into a warm glow: any pink pixel becomes warm gold"""
    a = np.array(im).astype(np.int32); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    bad = (a[..., 3] > 0) & (r > 120) & (b > 80) & (g < np.minimum(r, b) - 8)
    for c, v in ((0, 246), (1, 196), (2, 112)): a[..., c] = np.where(bad, (a[..., c] * .25 + v * .75).astype(np.int32), a[..., c])
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")

# ---------------- The Shared Table ----------------
if want("shared"):
    S1, S2 = "shared-s1", "shared-s2"
    cupfull = L(cut(S1, 3), 12)
    def empty_cup(a):
        r, g, b = a[..., 0], a[..., 1], a[..., 2]; tea = (a[..., 3] > 0) & (r > g + 18) & (r > b + 18) & (r < 230)
        for c, v in ((0, 96), (1, 140), (2, 124)): a[..., c] = np.where(tea, v, a[..., c])
        return a
    it = [("table", depink(W(cut(S1, 1), 176))), ("teapot", depink(H(cut(S1, 2), 28))), ("cup_full", depink(cupfull)),
          ("cup_empty", depink(repaint(L(cut(S1, 3), 12), empty_cup))), ("bowl_empty", depink(W(cut(S1, 4), 16))),
          ("bowl_full", depink(W(keep_bottom(cut(S1, 5), 150), 16))), ("tub", depink(L(cut(S1, 6), 32))),
          ("cushion", depink(fit(trim(cut(S1, 7)), 32, 18))), ("cushion_gold", depink(fit(trim(cut(S1, 8)), 32, 18))),
          ("brazier", warmglow(depink(L(cut(S1, 9), 32)))), ("door_open", depink(H(cut(S1, 10), 64))),
          ("door_closed", depink(fit(trim(cut(S1, 11)), 48, 64))), ("fish", depink(L(cut(S1, 12), 32))), ("dumplings", depink(L(cut(S1, 13), 28)))]
    it += [("tablet", G(fit(trim(cut(S2, 1)), 32, 56))), ("incense", G(L(cut(S2, 2), 32))), ("candles", warmglow(G(H(cut(S2, 3), 32)))),
           ("tea_tray", G(W(cut(S2, 4), 36))), ("oranges", G(L(cut(S2, 5), 32))), ("rice_heap", G(L(cut(S2, 6), 24))),
           ("lantern", warmglow(G(H(cut(S2, 7), 32)))), ("offer_tray", G(W(cut(S2, 8), 64)))]
    build("shared", it, None, "shared", [BG("shared-bg"), BG("shared-bg2"), f"{P}/geo/shared-geo.png", f"{P}/geo/shared2-geo.png", PL("shared-plate")],
          ["shared-s1 drew 13 of 14 items: the empty tea cup is the full cup with the tea recolored to the glaze (code).",
           "bowl_full: the pink steam above the rice is cut off (code draws steam). door_open is drawn ajar at an angle (64 px tall).",
           "shared-bg2 = v2 of its chat with a band of plain wall cut out, so the altar top sits at y ~100 (brief 90); the floor is stretched.",
           "shared-s2 used a green key (red candles and lantern)."])

# ---------------- the Buddha (bodhi, alms) ----------------
if want("buddha"):
    S = "buddha-ss"
    houses = trim(cut(S, 6)); hw = [(0, 246), (247, 502), (503, houses.width)]
    hs = [trim(houses.crop((x0, 0, x1, houses.height))) for x0, x1 in hw]
    gate = trim(largest(cut("buddha-ss2", 1)))
    ga = np.array(gate); gh, gw = ga.shape[:2]; ga[int(gh * .8):, int(gw * .84):, 3] = 0; gate = trim(Image.fromarray(ga, "RGBA"))
    it = [("boat", depink(fitL(cut(S, 1), 40, 28))), ("leaf", G(L(cut(S, 2), 24))), ("petal", depink(L(cut(S, 3), 8))),
          ("bowl_empty", depink(W(cut(S, 4), 24))), ("bowl_full", depink(W(cut(S, 5), 24))),
          ("house_humble", depink(fit(hs[0], 48, 56))), ("house_fine", warmglow(depink(fit(hs[1], 48, 56)))), ("house_shut", depink(fit(hs[2], 48, 56))),
          ("gate_grand", warmglow(depink(fitL(gate, 72, 64)))),
          ("o_riceball", depink(L(cut(S, 8), 12))), ("o_banana", depink(L(cut(S, 9), 12))), ("o_greens", depink(L(cut(S, 10), 12))),
          ("o_cake", depink(L(cut(S, 12), 12))), ("o_honey", depink(L(cut(S, 13), 12))), ("o_fruit", depink(L(cut(S, 14), 16)))]
    build("buddha_s", it, None, "buddha_s", [BG("buddha-sbg"), f"{P}/geo/buddha_s-geo.png"],
          ["The three house fronts were drawn touching; they are split at their seams. Item 9 (a torii-like gate) is replaced by",
           "buddha-ss2 (a grand house gateway with a feast table; same chat). Cut 11 (rice cakes on a leaf) is a spare."])

# ---------------- Laozi (slips, buffalo) ----------------
if want("laozi"):
    S = "laozi-ss"
    bl = raw_region("laozi-ss2", (77, 175, 655, 1500)); bl = largest(bl)
    bm = raw_region("laozi-ss2", (630, 313, 1264, 1530)); bm = largest(bm)
    def nostraw(a):
        r, g, b = a[..., 0], a[..., 1], a[..., 2]
        straw = (a[..., 3] > 0) & (r > b + 40) & (g > b + 20)
        a[..., 3] = np.where(straw, 0, a[..., 3]); return a
    bm = largest(repaint(bm, nostraw))
    b_left, b_mid = same([bl, bm], "h", 56)
    b_right = b_left.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    hut = trim(cut(S, 12))
    def fill_door(a):
        """paint the dark doorway with the mud-brick wall color (the brief's hut has no door)"""
        r, g, b = a[..., 0], a[..., 1], a[..., 2]
        h, w = a.shape[:2]; yy, xx = np.mgrid[:h, :w]
        dark = (a[..., 3] > 0) & (r + g + b < 150) & (yy > h * .55) & (xx > w * .35) & (xx < w * .75)
        ys, xs = np.nonzero(dark)
        if len(xs):
            dw = xs.max() - xs.min() + 3
            for y_, x_ in zip(ys, xs): a[y_, x_, :3] = a[y_, max(0, x_ + dw), :3] if x_ + dw < w else a[y_, x_ - dw, :3]
        return a
    it = [("buf_left", depink(b_left)), ("buf_mid", depink(b_mid)), ("buf_right", depink(b_right)), ("bell", depink(L(cut(S, 4), 10))),
          ("bundle", depink(L(cut(S, 5), 48))), ("slip", slip_px()),
          ("wheel_solid", depink(L(cut(S, 8), 64))), ("wheel_axle", depink(L(cut(S, 9), 64))),
          ("clay", depink(L(cut(S, 10), 64))), ("bowl", depink(L(cut(S, 11), 64))),
          ("hut_closed", depink(L(repaint(hut, fill_door), 64))), ("hut_open", warmglow(depink(L(cut(S, 13), 64))))]
    build("laozi_s", it, None, "laozi_s", [BG("laozi-sbg"), f"{P}/geo/laozi_s-geo.png"],
          ["Buffalo: laozi-ss drew side views; laozi-ss2 (same chat) redrew them from above and behind. buf_right = buf_left mirrored",
           "(its own right frame stood on a leftover hut). The slip is drawn in code (the sheet drew it lying at an angle).",
           "hut_closed: the sheet's doorway is painted over with the wall color (the brief's hut has no door or window)."])

# ---------------- Zhuangzi (ding, claypot) ----------------
if want("zhuangzi"):
    S = "zhuangzi-ss"
    it = [("ox_scroll", depink(fit(trim(cut(S, 1)), 320, 240))), ("knife", depink(H(cut(S, 2), 40))), ("pot", depink(L(cut(S, 3), 64))),
          ("petal", depink(L(cut(S, 4), 8))), ("maple", depink(L(cut(S, 5), 10))), ("snow", depink(L(cut(S, 6), 8))), ("cicada", depink(L(cut(S, 7), 12))),
          ("em_blossom", depink(L(cut(S, 8), 20))), ("em_lotus", depink(L(cut(S, 9), 20))), ("em_maple", depink(L(cut(S, 10), 20))), ("em_pine", depink(L(cut(S, 11), 20)))]
    build("zhuangzi_s", it, None, "zhuangzi_s", [BG("zhuangzi-sbg"), f"{P}/geo/zhuangzi_s-geo.png", f"{P}/geo/zhuangzi-seams.png"],
          ["ox_scroll fitted to 320 x 240 px (the drawing is 4% wider). Seams and knots are traced on it (geo.seams, geo.knots)."])

# ---------------- Confucius (analects, zither) ----------------
if want("confucius"):
    S = "confucius-ss"
    it = [("zither", depink(W(cut(S, 1), 192))), ("chime", depink(L(cut(S, 2), 24))), ("flute", depink(W(cut(S, 3), 32))),
          ("bundle", depink(L(cut(S, 4), 48))), ("slip", depink(H(upright(cut(S, 6)), 56))), ("petal", depink(L(cut(S, 7), 8))),
          ("table", depink(W(cut(S, 8), 64))), ("inkstone", depink(L(cut(S, 9), 24)))]
    build("confucius_s", it, None, "confucius_s", [BG("confucius-sbg"), f"{P}/geo/confucius_s-geo.png"],
          ["zither is drawn at a slight angle: 192 px wide keeps its aspect (85 px tall, brief 40). table 64 px wide (36 tall, brief 24).",
           "confucius-sbg = v2 of its chat (the two desks in the courtyard removed). Cut 5 (a whole blossom) is a spare."])

# ---------------- Dogen (sitting, sandal) ----------------
if want("dogen"):
    S = "dogen-ss"
    gate = raw_region("dogen-ss2", (100, 100, 1960, 1420))
    def nogreen_low(a):
        """drop the leftover small gate's green roof that overlaps the right post (raw y > 1200)"""
        h = a.shape[0]; r, g, b = a[..., 0], a[..., 1], a[..., 2]
        yy = np.mgrid[:h, :a.shape[1]][0]
        bad = (a[..., 3] > 0) & (yy > 1100) & ((g > r + 10) | ((b > r) & (g > r)))
        a[..., 3] = np.where(bad, 0, a[..., 3]); return a
    gate = largest(repaint(gate, nogreen_low))
    it = [("cushion", depink(L(cut(S, 1), 40))), ("incense", depink(H(cut(S, 2), 40))), ("sparrow_sit", depink(L(cut(S, 3), 14))),
          ("sparrow_fly", depink(L(cut(S, 4), 16))), ("chime", depink(H(cut(S, 5), 28))), ("maple", depink(L(cut(S, 6), 10))),
          ("stone", depink(fit(trim(cut(S, 7)), 24, 16))), ("stone_lit", goldglow(fit(trim(cut(S, 8)), 24, 16))),
          ("sandals", depink(L(cut(S, 9), 20))), ("ship", depink(L(cut(S, 10), 64))), ("gate", depink(L(gate, 56)))]
    build("dogen_s", it, None, "dogen_s", [BG("dogen-sbg"), f"{P}/geo/dogen_s-geo.png"],
          ["dogen-sbg = v3 (a new chat; v1/v2 put the railing at 70%). The temple gate comes from dogen-ss2 (the sheet's gate looked like a torii);",
           "its post bottoms are cut where the leftover sheet overlaps them."])
