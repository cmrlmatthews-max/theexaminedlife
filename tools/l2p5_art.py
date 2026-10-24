#!/usr/bin/env python3
"""Plan 5, Phase 41A: Level II art build. Gemini sheet cuts -> per-game atlas (rects), people sheets (from
art/people41/<group>), traced geometry, contact sheets. Run tools/l2p5_proc.py and tools/people41.py first. Mirrors tools/boss_art.py."""
import json, os, sys, importlib.util
import numpy as np
from PIL import Image, ImageDraw
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py")
mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
CUT, OUT, P = "art/cut41", "art/out41", "art/proc41"
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
        pj = json.load(open(f"art/people41/{people}/people.json"))
        Image.open(f"art/people41/{people}/people.png").save(f"{OUT}/{game}/people.png", optimize=True)
        data["prects"] = pj["prects"]; data["pivots"] = pj.get("pivots", {})
    if meta: data.update(meta)
    json.dump(data, open(f"{OUT}/{game}/rects.json", "w"))
    review(game, items, f"art/people41/{people}/_review.png" if people else None, extra, notes, title=game)
    print(game, Image.open(f"{OUT}/{game}/atlas.png").size, os.path.getsize(f"{OUT}/{game}/atlas.png"), "people" if people else "")
BG = lambda n: f"{P}/bg/{n}.png"; PL = lambda n: f"{P}/plate/{n}.jpg"
def region(sheet, box, key):
    """key out a raw-sheet region (for an item the cutter split into pieces)"""
    im = Image.open(f"art/raw41/{sheet}.png").convert("RGB").crop(box)
    out, al = mat.key_alpha(np.array(im), key)
    rgba = np.dstack([out.clip(0, 255).astype(np.uint8), ((al >= .5) * 255).astype(np.uint8)])
    return trim(Image.fromarray(rgba, "RGBA"))
def fit(im, w, h):
    return Image.fromarray(np.array(im.resize((w, h), Image.Resampling.NEAREST)), "RGBA")
G = lambda im, **k: degreen(im, **k)

# ---------------- The Garden Table ----------------
if want("garden"):
    S1, S2 = "garden-s1", "garden-s2"
    names = {1: "n_bread", 2: "n_water", 3: "n_figs", 4: "n_olives", 6: "v_honeycake", 7: "v_fish", 8: "v_grape", 9: "e_pie", 10: "e_goblet", 11: "e_cake"}
    it = [(n, G(W(cut(S1, k), 48 if n[0] == "e" else 36))) for k, n in names.items()]
    it += [("raft", depink(W(cut(S2, 1), 48))), ("plate", depink(W(cut(S2, 2), 44))), ("cloud_s", depink(W(cut(S2, 3), 40))),
           ("cloud_l", depink(W(cut(S2, 4), 64))), ("lamp", warmglow(dehalo(H(cut(S2, 5), 40), thr=30))), ("jug", depink(H(cut(S2, 6), 36)))]
    build("garden", it, None, "garden", [BG("garden-bg"), f"{P}/geo/garden-geo.png", PL("garden-plate-v1"), PL("garden-plate-v3")],
          ["Plates: v1 (the table centered, philosopher's face at 53%) and v3 (scene raised: face at 40%, open gate behind). v2 was a broken collage.",
           "garden-s1 made 11 foods; the extra plain cake (cut 5) is not used. N/V 36 px wide, E 48 px wide.",
           "garden-bg: v3 of one chat (v1 short table; v2 closed gate)."])

# ---------------- Socrates (hemlock, cloak) ----------------
if want("socrates"):
    S = "socrates-ss"
    spec = [("house", "l", 40), ("lyre", "l", 36), ("shield", "l", 36), ("lampstand", "h", 40), ("scales", "l", 36), ("stele", "h", 56),
            ("gate", "h", 40), ("coins", "l", 28), ("robe", "l", 28), ("sandals", "l", 28), ("mirror", "l", 28), ("ring", "l", 24),
            ("laurel", "l", 28), ("hands", "l", 28), ("bowl", "l", 28), ("cloak", "l", 48)]
    it = [(n, G({"w": W, "h": H, "l": L}[m](cut(S, k + 1), v))) for k, (n, m, v) in enumerate(spec)]
    it = [(n, warmglow(im)) if n == "lampstand" else (n, im) for n, im in it]
    build("socrates_s", it, None, "socrates_s", [BG("socrates-sbg"), f"{P}/geo/socrates_s-geo.png"],
          ["socrates-sbg vs gadfly-bg: a top-down street square (gadfly is a low view of a colonnade)."])

# ---------------- Aristotle (waxtablet, peripatos) ----------------
if want("aristotle"):
    S = "aristotle-ss"
    spec = {1: ("target", "l", 80), 2: ("arrow", "l", 24), 3: ("tablet", "l", 56), 4: ("column", "h", 140), 5: ("swallow", "l", 24),
            6: ("nest", "l", 24), 7: ("spider", "l", 16), 8: ("web", "l", 32), 9: ("bee", "l", 16), 10: ("honeycomb", "l", 28),
            11: ("figtree", "l", 40), 12: ("figs", "l", 24), 14: ("snail", "l", 20), 15: ("frog", "l", 20), 16: ("lizard", "l", 24)}
    it = []
    for k, (n, m, v) in spec.items():
        im = {"w": W, "h": H, "l": L}[m](cut(S, k), v)
        if n == "web":
            a = np.array(im).astype(np.int32); al = a[..., 3] > 0
            v2 = a[..., :3].mean(-1); a[..., 0] = a[..., 1] = a[..., 2] = np.where(al, np.clip(v2 * 1.15 + 20, 0, 255), 0).astype(np.int32)
            im = Image.fromarray(a.astype(np.uint8), "RGBA")
        it.append((n, depink(im, thr=30)))
    build("aristotle_s", it, None, "aristotle_s", [BG("aristotle-sbg"), f"{P}/geo/aristotle_s-geo.png"],
          ["Gemini drew two fig trees; cut 11 is used (cut 13 is a spare). The web is re-toned to grey-white (the key tinted it)."])

# ---------------- Epicurus (gate, cure) ----------------
if want("epicurus"):
    S = "epicurus-ss"
    moths = ["moth_gods", "moth_death", "moth_want", "moth_pain"]; lants = ["lant_cloud", "lant_moon", "lant_bowl", "lant_star"]
    it = [(n, G(L(cut(S, k + 1), 32))) for k, n in enumerate(moths)]
    it += [(n, G(H(cut(S, k + 5), 40))) for k, n in enumerate(lants)]
    it += [(n, G(L(cut(S, k + 9), 24))) for k, n in enumerate(["st_ring", "st_jar", "st_hat", "st_brooch"])]
    stars = region(S, (20, 780, 262, 1005), "green")
    it += [("in_stars", G(L(stars, 24))), ("in_lyre", G(L(cut(S, 15), 24))), ("in_scroll", G(L(cut(S, 16), 24))), ("in_figs", G(L(cut(S, 17), 24)))]
    build("epicurus_s", it, None, "epicurus_s", [BG("epicurus-sbg"), f"{P}/geo/epicurus_s-geo.png"],
          ["The three stars were cut as separate pieces; in_stars is keyed from their region as one icon."])

# ---------------- Seneca (letters, sealring) ----------------
if want("seneca"):
    S = "seneca-ss"
    par = trim(cut(S, 5)).rotate(90, expand=True, resample=Image.Resampling.NEAREST)
    it = [("boat", depink(L(cut(S, 1), 40))), ("rock_a", depink(L(cut(S, 2), 32))), ("rock_b", depink(L(cut(S, 3), 40))),
          ("squall", depink(L(cut(S, 4), 48))), ("letter", depink(fit(W(par, 160), 160, 200))), ("ring", depink(L(cut(S, 6), 64))),
          ("document", depink(L(cut(S, 8), 96))), ("seal", depink(L(cut(S, 9), 40))), ("chair", depink(H(cut(S, 10), 96), thr=40)),
          ("lamp", warmglow(dehalo(L(cut(S, 11), 24), thr=30)))]
    build("seneca_s", it, None, "seneca_s", [BG("seneca-sbg"), f"{P}/geo/seneca_s-geo.png"],
          ["letter: the landscape parchment turned upright and fitted to 160 x 200 px. Two documents were drawn; cut 8 (the larger) is used."])

# ---------------- Epictetus (chain, crutch) ----------------
if want("epictetus"):
    S = "epictetus-ss"
    it = [("wall", depink(L(cut(S, 1), 48))), ("gate_shut", depink(L(cut(S, 2), 48))), ("gate_open", depink(L(cut(S, 3), 48))),
          ("lever_up", depink(L(cut(S, 4), 32))), ("lever_down", depink(L(cut(S, 5), 32))), ("chain", depink(L(cut(S, 6), 48))),
          ("crutch", depink(H(cut(S, 7), 48))), ("block", depink(fit(trim(cut(S, 8)), 48, 48))), ("slab", depink(fit(trim(cut(S, 9)), 96, 48)))]
    build("epictetus_s", it, None, "epictetus_s", [BG("epictetus-sbg"), BG("epictetus-sbg-v2"), f"{P}/geo/epictetus_s-geo.png"],
          ["Backdrop v1 and v2 (same chat; v2 asked for a narrower cliff). Neither matches the brief columns exactly: the code columns stand in front of the cliff face."])

# ---------------- Marcus Aurelius (morning, danube) ----------------
if want("marcus"):
    S = "marcus-ss"
    spec = [("firewood", 32), ("bucket", 24), ("rope", 24), ("laurel", 28), ("pouch", 24), ("letter", 24), ("ice", 36), ("branch", 40), ("cloud", 36), ("notebook", 28)]
    it = [(n, depink(L(cut(S, k + 1), v))) for k, (n, v) in enumerate(spec)]
    build("marcus_s", it, None, "marcus_s", [BG("marcus-sbg"), f"{P}/geo/marcus_s-geo.png"])
