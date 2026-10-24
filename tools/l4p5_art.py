#!/usr/bin/env python3
"""Plan 5, Phase 43A: Level IV art build. Gemini sheet cuts -> per-game atlas (rects), people sheets (from
art/people43/<group>), traced geometry, contact sheets. Run tools/l2p5_proc.py and tools/people42.py first. Mirrors tools/boss_art.py."""
import json, os, sys, importlib.util
import numpy as np
from PIL import Image, ImageDraw
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py")
mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
CUT, OUT, P = "art/cut43", "art/out43", "art/proc43"
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
        pj = json.load(open(f"art/people43/{people}/people.json"))
        Image.open(f"art/people43/{people}/people.png").save(f"{OUT}/{game}/people.png", optimize=True)
        data["prects"] = pj["prects"]; data["pivots"] = pj.get("pivots", {})
    if meta: data.update(meta)
    json.dump(data, open(f"{OUT}/{game}/rects.json", "w"))
    review(game, items, f"art/people43/{people}/_review.png" if people else None, extra, notes, title=game)
    print(game, Image.open(f"{OUT}/{game}/atlas.png").size, os.path.getsize(f"{OUT}/{game}/atlas.png"), "people" if people else "")
BG = lambda n: f"{P}/bg/{n}.png"; PL = lambda n: f"{P}/plate/{n}.jpg"
def region(sheet, box, key):
    """key out a raw-sheet region (for an item the cutter split into pieces)"""
    im = Image.open(f"art/raw43/{sheet}.png").convert("RGB").crop(box)
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


def killpink(im):
    """drop the soft pink glow ring the key left around a glowing item (keeps the item's own warm light)"""
    a = np.array(im).astype(np.int32); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    bad = (a[..., 3] > 0) & (b > 95) & (r > 140) & (g < r - 45) & (b > g - 15)
    a[..., 3] = np.where(bad, 0, a[..., 3]); return largest(Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA"))

def peel(im, iters=3):
    """peel the outer peach glow pixels (key blended into a light) off a glowing item"""
    a = np.array(im).astype(np.int32)
    for _ in range(iters):
        al = a[..., 3] > 0; r, g, b = a[..., 0], a[..., 1], a[..., 2]
        p = np.pad(~al, 1, constant_values=True); edge = p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]
        kill = al & edge & (r > 225) & (b > 100) & (g < r - 40)
        if not kill.any(): break
        a[kill, 3] = 0
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")

def rotate_frames(im, n=8, step=45 / 8, size=40):
    """turn frames of a gear: rotate the high-res cut, then scale (an 8-tooth gear repeats every 45 degrees)"""
    im = trim(im); S = max(im.size); base = Image.new("RGBA", (S + 8, S + 8)); base.alpha_composite(im, ((S + 8 - im.width) // 2, (S + 8 - im.height) // 2))
    out = []
    for k in range(n):
        r = base.rotate(-k * step, resample=Image.Resampling.BICUBIC)
        a = np.array(r); a[..., 3] = np.where(a[..., 3] >= 128, 255, 0); r = Image.fromarray(a, "RGBA")
        out.append(scaled(r, size / (S + 8)))
    return out

def measure(im):
    """the Measure: the painted ladder had 7 rungs; erase them and draw 6 evenly spaced (copies of one painted rung).
    The dial's painted needle is painted out (the game draws its own pointer)."""
    a = np.array(trim(im)).astype(np.int32)
    tpl = a[95:112, 98:158].copy()
    a[32:411, 98:158, 3] = 0
    starts = [int(round(32 + 378 * (k + .5) / 6)) - 8 for k in range(6)]
    for y0 in starts: a[y0:y0 + 17, 98:158] = tpl
    cx, cy = 47, 204; r, g, b = a[..., 0], a[..., 1], a[..., 2]
    yy, xx = np.mgrid[:a.shape[0], :a.shape[1]]; d = np.hypot(xx - cx, yy - cy)
    needle = (d < 23) & (d > 3) & (a[..., 3] > 0) & (r + g + b < 380)
    for c, v in ((0, 236), (1, 220), (2, 184)): a[..., c] = np.where(needle, v, a[..., c])
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA"), starts, (cx, cy)

# ---------------- Aquinas (summa, ox)
if want("aquinas"):
    S = "aquinas-ss"
    lect = trim(cut(S, 4)); la = np.array(lect)
    # the open book alone: the rows above the lectern's top board
    book = trim(Image.fromarray(la[:int(lect.height * .47)], "RGBA"))
    it = [("dart", depink(fitL(cut(S, 1), 32, 16))), ("crumpled", depink(L(cut(S, 2), 28))), ("sheet", depink(L(cut(S, 3), 40))),
          ("book_lectern", depink(W(lect, 128))), ("book", depink(W(book, 128))), ("scroll", depink(L(cut(S, 5), 32))),
          ("desk", depink(W(cut(S, 6), 96))), ("quill", depink(L(cut(S, 7), 24))), ("ox", depink(L(cut(S, 8), 40))),
          ("lantern", warmglow(depink(H(cut(S, 9), 32))))]
    build("aquinas_s", it, None, "aquinas_s", [BG("aquinas-sbg"), f"{P}/geo/aquinas_s-geo.png"],
          ["aquinas-sbg = v3 (a new chat): v1/v2 put one large three-light window in the middle of the wall (y 26-55%).",
           "book = the open book alone (the top of item 4); book_lectern = book and carved lectern (128 px wide).",
           "dart fitted to 32 x 16 (drawn at an angle). lantern's pink key glow recolored warm gold."])

# ---------------- Kant (kantwalk, citymap)
if want("kant"):
    S = "kant-ss"
    church = largest(raw_region(S, (530, 255, 750, 520)))
    compass = largest(raw_region(S, (549, 540, 745, 742)))
    linden = largest(raw_region(S, (768, 512, 1020, 770)))
    shop = largest(raw_region(S, (258, 512, 506, 772)))
    it = [("watch", depink(L(cut(S, 1), 80))), ("clock", depink(L(cut(S, 2), 28))),
          ("door_closed", depink(H(cut(S, 3), 28))), ("door_open", warmglow(depink(H(cut(S, 4), 28)))),
          ("knot", depink(L(cut(S, 5), 24))), ("university", depink(L(cut(S, 6), 56))), ("church", depink(L(church, 64))),
          ("castle", depink(L(cut(S, 8), 56))), ("ship", depink(L(cut(S, 11), 48))), ("bookshop", depink(L(shop, 48))),
          ("compass", depink(L(compass, 120))), ("linden", depink(L(linden, 32)))]
    build("kant_s", it, None, "kant_s", [BG("kant-sbg"), f"{P}/geo/kant_s-geo.png"],
          ["The sheet drew a second row of variants: ship = the top-down ship (map icon); bookshop = the first (front-on) bookshop.",
           "compass: the sheet painted N/E/S/W letters around the rose; they are cut away (no text). Doors: 28 px tall (14 x 28).",
           "kant-sbg: river with an island and two side quays; see geo (walls, water, landmarks, loop, walk)."])

# ---------------- Mill (poems, petition)
if want("mill"):
    S = "mill-ss"
    gears = rotate_frames(cut(S, 2), 8, 45 / 8, 40)
    cot_d, cot_l = same([cut(S, 6), cut(S, 7)], "h", 24)
    th_d, th_l = same([cut(S, 8), cut(S, 9)], "h", 40)
    lp_d, lp_l = same([cut(S, 4), cut(S, 5)], "h", 24)
    it = [("book", depink(L(cut(S, 1), 40)))] + [(f"gear_{k}", depink(g_)) for k, g_ in enumerate(gears)] + [
          ("flowers", depink(L(cut(S, 3), 24))), ("lamp_off", depink(lp_d)), ("lamp_on", warmglow(depink(lp_l))),
          ("cottage_dark", depink(cot_d)), ("cottage_lit", warmglow(depink(cot_l))),
          ("town_dark", depink(th_d)), ("town_lit", warmglow(depink(th_l))), ("oilcan", depink(L(cut(S, 10), 32))),
          ("scroll", depink(W(cut(S, 11), 120)))]
    build("mill_s", it, None, "mill_s", [BG("mill-sbg"), f"{P}/geo/mill_s-geo.png"],
          ["gear_0..gear_7: one 8-tooth gear turned 0, 5.6, 11.25 ... 39.4 degrees (the 8 frames loop, since the gear repeats every 45 degrees).",
           "Lamps, cottages and townhouses: each dark/lit pair at one scale (lamps 24 px tall, cottages 24, townhouses 40).",
           "mill-sbg = the town rows squashed into y 40-250 so all 30 corners stay out of the pad zone (geo: nodes)."])

# ---------------- the Weaver (different, tellmore)
if want("gilligan"):
    S = "gilligan-ss"
    ms, starts, dial = measure(cut(S, 1))
    k = 140 / ms.width
    mimg = scaled(ms, k)
    meta = {"measure": {"px": [mimg.width, mimg.height], "rungsPx": [round((y0 + 8.5) * k) for y0 in starts],
                        "dialPx": [round(dial[0] * k), round(dial[1] * k)], "railsPx": [round(98 * k), round(158 * k)]}}
    it = [("measure", depink(mimg)), ("tok_square", depink(L(cut(S, 2), 44))), ("tok_round", depink(L(cut(S, 3), 44))),
          ("toolbox", depink(L(cut(S, 4), 40))), ("lamp", warmglow(depink(L(cut(S, 5), 40)))), ("tea", depink(L(cut(S, 6), 40))),
          ("paper", depink(L(cut(S, 7), 40))), ("firewood", depink(L(cut(S, 8), 40))), ("blanket", depink(L(cut(S, 9), 40))),
          ("parcel", depink(L(cut(S, 10), 40))), ("spool", peel(killpink(L(killpink(cut(S, 11)), 48)))), ("notebook", depink(L(cut(S, 12), 64))),
          ("book", depink(L(cut(S, 13), 48)))]
    build("gilligan_s", it, meta, "gilligan_s", [BG("gilligan-sbg"), f"{P}/geo/gilligan_s-geo.png"],
          ["measure: the sheet painted 7 rungs; they are redrawn as 6 evenly spaced rungs (copies of a painted rung). The dial's painted",
           "needle is painted out (the game draws the pointer). Scaled uniformly to 140 px wide (312 tall; brief 140 x 340).",
           "lamp and spool: the pink key glow recolored warm gold. paper: the scribbles are wavy lines, not letters."])
