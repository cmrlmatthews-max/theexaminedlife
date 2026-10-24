#!/usr/bin/env python3
"""Plan 5, Phase 40A: Level I art build. Gemini sheet cuts -> per-game atlas (rects), people sheets (from
art/people40/<group>), traced geometry, contact sheets. Run tools/l1p5_proc.py first. Mirrors tools/boss_art.py."""
import json, os, sys, importlib.util
import numpy as np
from PIL import Image, ImageDraw
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py")
mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
CUT, OUT, P = "art/cut40", "art/out40", "art/proc40"
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
        pj = json.load(open(f"art/people40/{people}/people.json"))
        Image.open(f"art/people40/{people}/people.png").save(f"{OUT}/{game}/people.png", optimize=True)
        data["prects"] = pj["prects"]; data["pivots"] = pj.get("pivots", {})
    if meta: data.update(meta)
    json.dump(data, open(f"{OUT}/{game}/rects.json", "w"))
    review(game, items, f"art/people40/{people}/_review.png" if people else None, extra, notes, title=game)
    print(game, Image.open(f"{OUT}/{game}/atlas.png").size, os.path.getsize(f"{OUT}/{game}/atlas.png"), "people" if people else "")
BG = lambda n: f"{P}/bg/{n}.png"; PL = lambda n: f"{P}/plate/{n}.jpg"

# ---------------- The Leap ----------------
if want("leap"):
    S = "leap-s1"
    it = [("ledge_n", depink(W(cut(S, 1), 96))), ("ledge_w", depink(W(cut(S, 3), 112))), ("shelf", depink(dehalo(W(cut(S, 4), 200), thr=45))),
          ("stack", depink(H(cut(S, 5), 160), thr=15, ring=6)), ("head", warmglow(depink(dehalo(W(largest(cut("leap-s1b", 1)), 240), thr=45)))),
          ("puff", depink(W(cut(S, 7), 64))), ("ring", dehalo(L(cut(S, 8), 32)))]
    d = dict(it); tops = {n: surface_top(d[n]) for n in ("ledge_n", "ledge_w", "shelf", "stack")}
    tops["head"] = surface_top(d["head"], (.35, .95))
    meta = {"stackTop": tops["stack"] / 2, "headTop": tops["head"] / 2, "topsPx": tops}
    build("leap", it, meta, "leap", [BG("leap-bg"), BG("leap-bg2"), PL("leap-plate"), "art/raw40/leap-plate-v2.png"],
          [f"surface tops (px from the sprite top): {tops}", "stackTop / headTop in units = px / 2",
           "Plates: v3 (used, a ring of gold light) and v2 (a rose window in the sky). v1 could not be downloaded.",
           "head = a second, wider headland made in the same chat (the first was tall and narrow)"])

# ---------------- The Hall of Doors ----------------
if want("doors"):
    S = "doors-s1"
    do, dh, ds = same([cut(S, 1), cut(S, 2), cut(S, 3)], "h", 72)
    go, gs = same([cut(S, 5), cut(S, 4)], "h", 64)
    mi, mo = same([cut(S, 6), cut(S, 7)], "h", 96)
    wl = trim(cut(S, 8)); wl = wl.crop((int(wl.width * .2), int(wl.height * .12), int(wl.width * .8), int(wl.height * .9)))
    it = [("door_open", do), ("door_half", dh), ("door_shut", ds), ("grey_shut", gs), ("grey_open", go),
          ("mirror", mi), ("mirror_on", dehalo(mo)), ("wall", W(wl, 64)), ("bar", W(cut(S, 9), 64))]
    # tile test strip for the backdrop
    b = Image.open(BG("doors-bg")); strip = Image.new("RGB", (384, 640 * 3))
    for k in range(3): strip.paste(b, (0, 640 * k))
    strip.resize((192, 960)).save(f"{P}/geo/doors-tile3.png")
    build("doors", it, None, "doors", [BG("doors-bg"), f"{P}/geo/doors-tile3.png", f"{P}/geo/doors-bandtile3.png", PL("doors-plate"), "art/raw40/doors-plate-v2.png"],
          ["doors-bg is a perspective hall and does not tile (strip 1). Strip 2: a tile cut from its lower band (carpet zigzags).",
           "Recommended: keep the hall fixed on screen and scroll only the code-drawn cross-walls and doors over it.",
           "Plates: v1 (used) and v2 (Sartre larger, lower).", "wall = the middle brick run of the sheet's wall piece"])

# ---------------- Kierkegaard (voices, crowd) ----------------
if want("kierkegaard"):
    S = "kierkegaard-ss"
    ma, me, mr = [H(cut(S, i), 48) for i in (1, 2, 3)]
    ba, be, br = same([cut(S, 9), cut(S, 10), cut(S, 11)], "h", 48)
    bl, bc = same([cut(S, 12), cut(S, 14)], "h", 64)
    dsh, dop = same([cut(S, 15), cut(S, 16)], "h", 72)
    it = [("mask_a", ma), ("mask_e", me), ("mask_r", mr), ("note_a", dehalo(L(cut(S, 4), 24))), ("note_e", dehalo(L(cut(S, 5), 24))),
          ("note_r", dehalo(L(cut(S, 6), 28))), ("stone", dehalo(W(cut(S, 7), 24))), ("book_a", ba), ("book_e", be), ("book_r", br),
          ("bell", bl), ("bell_cracked", bc), ("door_shut", dsh), ("door_open", dehalo(dop))]
    build("kierkegaard_s", it, None, "kierkegaard_s", [BG("kierkegaard-sbg"), f"{P}/geo/kierkegaard_s-geo.png", f"{P}/geo/kierkegaard_s-voices.png"])

# ---------------- Nietzsche (tornpage, oncemore) ----------------
if want("nietzsche"):
    S = "nietzsche-ss"
    vs = ["v_flame", "v_peak", "v_music", "v_seed", "v_sun", "v_cups", "v_wave", "v_ribbon"]
    it = [("page", L(cut(S, 1), 40))] + [(n, dehalo(L(cut(S, 2 + k), 28))) for k, n in enumerate(vs)] + [
          ("tablet", W(cut(S, 10), 160)), ("wisp", W(cut(S, 11), 32)), ("eagle_a", L(cut(S, 13), 64)), ("eagle_b", L(cut(S, 12), 64)),
          ("serpent", L(cut(S, 14), 40)), ("rock", W(cut(S, 15), 28)), ("glint", dehalo(L(cut(S, 16), 16))), ("hat", W(cut(S, 17), 24))]
    build("nietzsche_s", it, None, "nietzsche_s", [BG("nietzsche-sbg"), f"{P}/geo/nietzsche_s-geo.png"])

# ---------------- Camus (absurd) ----------------
if want("camus"):
    S = "camus-ss"
    sk = ["sk_sun", "sk_wave", "sk_fig", "sk_column", "sk_ball", "sk_boat"]
    ga, gb = L(cut("camus-ss2", 1), 32), L(cut("camus-ss2", 4), 32)
    it = [("kite", H(cut(S, 1), 56)), ("reel", L(cut(S, 2), 24)), ("notebook", W(cut(S, 3), 96))] + \
         [(n, L(cut(S, 4 + k), 24)) for k, n in enumerate(sk)] + [("gull_a", ga), ("gull_b", gb)]
    build("camus_s", it, None, "camus_s", [BG("camus-sbg"), f"{P}/geo/camus_s-geo.png"], ["gulls from a second generation in the same chat (wings up / wings down, both flying)"])

# ---------------- Sartre (excuses, medal) ----------------
if want("sartre"):
    S = "sartre-ss"
    tray = W(cut(S, 2), 40); tray = Image.fromarray(np.array(tray.resize((40, 10), Image.Resampling.NEAREST)), "RGBA")
    door = H(cut(S, 15), 80); a = np.array(door)
    # paint out the word on the door glass: replace light text pixels in the upper glass panel by the glass tone
    # the glass panel carries a word: copy its clean lower rows up over the word
    Hd, Wd2 = door.height, door.width; x0, x1 = int(Wd2 * .33), int(Wd2 * .74)
    src = a[int(Hd * .50):int(Hd * .675), x0:x1].copy(); y = int(Hd * .24)
    while y < int(Hd * .50):
        n = min(src.shape[0], int(Hd * .50) - y); a[y:y + n, x0:x1] = src[:n]; y += n
    door = Image.fromarray(a, "RGBA")
    names = ["table", None, "cup", "medal", "laurel", "sash", "bust", "plate_name", "prize_box", "pages", "letter", None, "book", "desk", None]
    size = {"table": ("w", 64), "cup": ("l", 12), "medal": ("h", 36), "laurel": ("w", 32), "sash": ("l", 32), "bust": ("h", 40),
            "plate_name": ("w", 36), "prize_box": ("l", 36), "pages": ("l", 28), "letter": ("w", 28), "pen": ("w", 28),
            "book": ("h", 28), "desk": ("w", 96)}
    pen = trim(cut(S, 12)); a2 = np.array(pen)[..., 3] > 0; ys, xs = np.nonzero(a2)
    ang = np.degrees(np.arctan2(-(ys - ys.mean()) @ (xs - xs.mean()), ((xs - xs.mean()) ** 2).sum()))
    pen = W(trim(pen.rotate(-ang, expand=True, resample=Image.Resampling.NEAREST)), 28)
    it = [("tray", tray), ("cafe_door", door), ("pen", pen)]
    for k, n in enumerate(names):
        if not n: continue
        m, v = size[n]; im = cut(S, k + 1)
        it.append((n, (warmglow if n == "desk" else (lambda x: x))(depink({"w": W, "h": H, "l": L}[m](im, v), thr=40))))
    build("sartre_s", it, None, "sartre_s", [BG("sartre-sbg"), f"{P}/geo/sartre_s-geo.png"], ["tray squashed to a side view 40x10", "the word on the cafe door glass is painted out"])

# ---------------- de Beauvoir (becoming, rosary) ----------------
if want("beauvoir"):
    S = "beauvoir-ss"
    # the tag: Gemini drew it tall with a string. Turn it wide, crop to the paper body, scale to 28 px tall,
    # then stretch only the plain middle columns to 120 px (a 3-slice), so the hole end keeps its shape.
    tg = trim(cut(S, 1).rotate(90, expand=True)); a = np.array(tg).astype(int)
    cream = (a[..., 3] > 0) & (a[..., :3].mean(-1) > 170); ys, xs = np.nonzero(cream)
    body = tg.crop((xs.min() - 2, ys.min() - 2, xs.max() + 3, ys.max() + 3))
    body = H(body, 28); bw = body.width; l, r = int(bw * .42), int(bw * .80)
    mid = body.crop((l, 0, r, 28)).resize((120 - l - (bw - r), 28), Image.Resampling.NEAREST)
    t1 = Image.new("RGBA", (120, 28)); t1.alpha_composite(body.crop((0, 0, l, 28)), (0, 0)); t1.alpha_composite(mid, (l, 0))
    t1.alpha_composite(body.crop((r, 0, bw, 28)), (120 - (bw - r), 0))
    # torn: the same tag split by a jagged tear at x 64, the halves 6 px apart
    ta = np.array(t1); t2a = np.zeros((28, 126, 4), np.uint8)
    zig = [64 + (2 if (y // 3) % 2 else -2) for y in range(28)]
    for y in range(28):
        t2a[y, :zig[y]] = ta[y, :zig[y]]; t2a[y, zig[y] + 6:] = ta[y, zig[y]:]
        for x in (zig[y] - 1, zig[y] + 6):
            if t2a[y, x, 3]: t2a[y, x, :3] = (120, 100, 80)
    t2 = Image.fromarray(t2a, "RGBA")
    tl = {3: "t_brush", 4: "t_plane", 5: "t_book", 6: "t_peak", 7: "t_flask", 9: "t_violin", 10: "t_hammer", 11: "t_scope"}
    lo, ln = same([cut(S, 14), cut(S, 15)], "h", 32)
    it = [("tag", t1), ("tag_torn", t2)] + [(n, dehalo(L(cut(S, k), 28))) for k, n in tl.items()] + [
          ("rosary", W(cut(S, 12), 40)), ("waystone", H(cut(S, 13), 40)), ("lamp_off", lo), ("lamp_on", dehalo(ln)),
          ("school", W(cut(S, 16), 48)), ("workshop", dehalo(W(cut(S, 17), 48))), ("shore", W(cut(S, 18), 48))]
    build("beauvoir_s", it, None, "beauvoir_s", [BG("beauvoir-sbg"), f"{P}/geo/beauvoir_s-geo.png"], ["tag rebuilt 120x28 from the sheet tag (turned wide, string cropped, middle stretched); tag_torn is that tag split in code", "two flask emblems were drawn; the first is used"])

# ---------------- Fromm (rose, zenletter) ----------------
if want("fromm"):
    S = "fromm-ss"
    r1, r2, r3, rd = same([cut(S, 2), cut(S, 3), cut(S, 4), cut(S, 5)], "h", 48)
    brush = trim(cut(S, 13)); a = np.array(brush)[..., 3] > 0; ys, xs = np.nonzero(a)
    ang = np.degrees(np.arctan2(-(ys - ys.mean()) @ (xs - xs.mean()), ((xs - xs.mean()) ** 2).sum()))
    brush = trim(brush.rotate(-ang, expand=True, resample=Image.Resampling.NEAREST))
    it = [("r0", L(cut(S, 1), 24)), ("r1", r1), ("r2", r2), ("r3", r3), ("r_droop", rd), ("can", W(cut(S, 6), 28)),
          ("shade", W(cut(S, 7), 32)), ("shears", L(cut(S, 8), 24)), ("stool", W(cut(S, 9), 24)), ("urn", H(cut(S, 10), 64)),
          ("leaf_dead", L(cut(S, 11), 12)), ("letter", W(cut(S, 12), 40)), ("brush", W(brush, 40)), ("inkstone", W(cut(S, 14), 24)),
          ("bell", H(cut(S, 15), 28)), ("leaf_maple", L(cut(S, 16), 12)), ("sparrow", W(cut(S, 17), 16))]
    it = [(n, degreen(im)) for n, im in it]
    build("fromm_s", it, None, "fromm_s", [BG("fromm-sbg"), f"{P}/geo/fromm_s-geo.png"], ["rose stages r1, r2, r3, r_droop share one scale (r1 = 48 px tall)"])
