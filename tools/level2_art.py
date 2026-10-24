#!/usr/bin/env python3
"""Level II art build (plan 4, Phase 32A): Gemini sheets -> per-game atlas, people, rects, review sheets."""
import json, os, sys, importlib.util
import numpy as np
from PIL import Image, ImageDraw
sys.path.insert(0, "tools")
import people as P
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py")
mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
CUT, OUT = "art/cut2", "art/out2"
os.makedirs(OUT, exist_ok=True)
def cut(sheet, i): return Image.open(f"{CUT}/{sheet}/{i:02d}.png").convert("RGBA")
def erode_alpha(img, n=1):
    a = np.array(img); m = a[..., 3] > 0
    for _ in range(n):
        p = np.pad(m, 1); m = m & p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
    a[..., 3] = np.where(m, a[..., 3], 0); return Image.fromarray(a, "RGBA")
def sp(img, h, erode=0, outline=False):
    if erode: img = erode_alpha(img, erode)
    return mat.sprite(img, None, h, outline=outline)
def largest(img):
    """keep only the largest connected blob (drops stray bits that rode along in a box cut)"""
    a = np.array(img); m = a[..., 3] > 0
    lab, n = mat.label(m)
    if n > 1:
        sizes = [(lab == i).sum() for i in range(1, n + 1)]; keep = 1 + int(np.argmax(sizes)); a[lab != keep, 3] = 0
    im = Image.fromarray(a, "RGBA"); return im.crop(im.getbbox())
def unpink(img):
    """undo magenta haze baked into an item: pull pink-tinted pixels back to warm brown"""
    a = np.array(img).astype(np.float32); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    pink = (b > g + 15) & (r > g + 15)
    a[..., 2] = np.where(pink, g * .75, b); a[..., 0] = np.where(pink, np.minimum(255, r * .92), r)
    return Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGBA")
def strict_cut(src, box, thr=28):
    """cut one item with a strict key: anything even faintly magenta-tinted (Gemini's haze) is background"""
    a = np.array(Image.open(src).convert("RGB"))[box[1]:box[3], box[0]:box[2]].astype(np.int32)
    m = np.minimum(a[..., 0], a[..., 2]) - a[..., 1]
    al = (m < thr).astype(np.uint8) * 255
    im = Image.fromarray(np.dstack([a.astype(np.uint8), al]), "RGBA")
    return largest(im)
def flip(img): return img.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
def mirror_lean(img, amt): return flip(P.lean(flip(img), amt))

src = open("base/index.html", encoding="utf-8").read()
i = src.find("ATLAS.chars=") + len("ATLAS.chars="); j = src.find(";", i)
CH = json.loads(src[i:j])["rects"]
CA = Image.open("blobs/1092ba9bca54f8ddf104f6d02f4310e8.png").convert("RGBA")
def chf(n): r = CH[n]; return CA.crop((r[0], r[1], r[0] + r[2], r[1] + r[3]))

def review(game, items, people_items, extra=(), notes=()):
    tiles = [(n, im.resize((im.width * 2, im.height * 2), Image.Resampling.NEAREST)) for n, im in items]
    tiles += [(n, im.resize((im.width * 4, im.height * 4), Image.Resampling.NEAREST)) for n, im in people_items]
    W = 1400; x = y = 10; rh = 0; pos = []
    for n, t in tiles:
        if t.width > W - 20: t = t.resize((W - 20, int(t.height * (W - 20) / t.width)))
        if x + t.width + 10 > W: x = 10; y += rh + 26; rh = 0
        pos.append((n, t, x, y)); x += t.width + 10; rh = max(rh, t.height)
    H1 = y + rh + 30
    thumbs = [Image.open(p).convert("RGBA").resize((192, 320)) for p in extra]
    rows = (len(thumbs) + 6) // 7
    H = H1 + rows * 340 + 20 * len(notes) + 10
    cs = Image.new("RGBA", (W, H), (38, 34, 48, 255)); d = ImageDraw.Draw(cs)
    for n, t, x, y in pos:
        cs.alpha_composite(t, (x, y + 14)); d.text((x, y), n[:24], fill=(255, 226, 160, 255))
    for k, t in enumerate(thumbs):
        cs.alpha_composite(t, (10 + (k % 7) * 198, H1 + (k // 7) * 340))
        d.text((12 + (k % 7) * 198, H1 + (k // 7) * 340 + 322), os.path.basename(extra[k]), fill=(200, 200, 220, 255))
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
    extra = list(extra) + sorted(f"art/proc2/geo/{f}" for f in os.listdir("art/proc2/geo") if f.startswith(game) and f.endswith(".png")) if os.path.isdir("art/proc2/geo") else extra
    review(game, items, peo, extra, notes)
    print(game, Image.open(f"{OUT}/{game}/atlas.png").size, os.path.getsize(f"{OUT}/{game}/atlas.png"), "people", len(peo))

BG = lambda n: f"art/proc2/bg/{n}.png"; PL = lambda n: f"art/proc2/plate/{n}.jpg"

# ---------------- people helpers ----------------
def doze(kw):
    """dozing: eyes shut (skin-shadow line), head dropped one pixel"""
    im = P.person(**kw); a = np.array(im)
    eye = np.all(a[..., :3] == P.EYE, -1) & (a[..., 3] > 0)
    a[eye, :3] = P.SKIN[kw.get("skin", "light")][1]
    b = np.zeros_like(a); b[1:11] = a[0:10]; b[11:] = a[11:]
    return P.dim(Image.fromarray(b, "RGBA"), .8)
def hands_open(img):
    """the Wanderer (front) with both palms out at the sides"""
    a = np.array(img); h, w = a.shape[:2]
    out = np.zeros((h, w + 4, 4), np.uint8); out[:, 2:2 + w] = a
    pal = np.array([214, 168, 132, 255], np.uint8); edge = np.array([24, 18, 30, 255], np.uint8)
    for x in (0, 1, w + 2, w + 3):
        out[13, x] = edge; out[14, x] = pal; out[15, x] = pal; out[16, x] = edge
    return Image.fromarray(out, "RGBA")
def add_quill(img):
    """Marcus writing: a small white quill and a hand at his right side"""
    a = np.array(img).copy(); h, w = a.shape[:2]
    out = np.zeros((h, w + 3, 4), np.uint8); out[:, :w] = a
    for (x, y, c) in ((w, 14, (214, 168, 132)), (w + 1, 13, (236, 232, 222)), (w + 2, 12, (236, 232, 222)), (w + 2, 11, (236, 232, 222)), (w, 15, (24, 18, 30))):
        out[y, x] = list(c) + [255]
    return Image.fromarray(out, "RGBA")

# ================= The Golden Mean =================
m = {1: ("wolf_0", 64), 2: ("wolf_1", 64), 3: ("fire_0", 64), 4: ("fire_1", 64), 5: ("chest_shut", 48), 6: ("chest_open", 48),
     7: ("peacock_0", 72), 8: ("peacock_1", 72), 9: ("mouse", 24)}
items = [(n, sp(cut("mean-s1", k), h, erode=1 if n.startswith("fire") else 0)) for k, (n, h) in m.items()]
wu = chf("wanderer_up_0")
spend = dict(hair="long", hair_col=(120, 70, 40), skin="tan", cloth=(150, 90, 40), collar=(220, 180, 80))
peo = [("bal_l", mirror_lean(wu, 3)), ("bal_c", wu), ("bal_c1", chf("wanderer_up_1")), ("bal_r", P.lean(wu, 3)),
       ("spend_0", P.person(**spend, pose="wave", frame=0)), ("spend_1", P.person(**spend, pose="wave", frame=1))]
build("mean", items, peo, [BG("mean-bg"), PL("mean-plate")], ["beam traced: see rects.json beam"])

# ================= The Gadfly =================
asleep = cut("gadfly-s1", 1); stand = flip(cut("gadfly-s2", 1))  # standing faced left: flipped to face right like the sleeper
S = 200 / asleep.width
def scaled(im): return mat.sprite(im, None, int(round(im.height * S)))
A = scaled(asleep); B = scaled(stand)
def rigcut(img, parts):
    """parts: name -> function(x,y,w,h)->bool over the scaled image; each pixel goes to the first part that claims it"""
    a = np.array(img); h, w = a.shape[:2]; yy, xx = np.mgrid[0:h, 0:w]; taken = np.zeros((h, w), bool); res = {}
    for name, f in parts:
        sel = f(xx / w, yy / h) & (a[..., 3] > 0) & ~taken; taken |= sel
        b = a.copy(); b[~sel, 3] = 0
        im = Image.fromarray(b, "RGBA"); bb = im.getbbox(); res[name] = (im.crop(bb), bb)
    return res
ra = rigcut(A, [("tail", lambda x, y: ((x < .11) & (y > .40)) | ((x < .30) & (y > .86))), ("head", lambda x, y: x > .80), ("body", lambda x, y: x >= 0)])
rb = rigcut(B, [("tail", lambda x, y: (x < .195) & (y < .68)), ("head", lambda x, y: (x > .55) & (y < .55) & (y < .30 + (x - .58))), ("body", lambda x, y: x >= 0)])
items = [("horse_sleep", A), ("horse_stand", B)]
rig = {}
for tag, r, src_img in (("sleep", ra, A), ("stand", rb, B)):
    for part, (im, bb) in r.items():
        items.append((f"{tag}_{part}", im)); rig[f"{tag}_{part}"] = [int(bb[0]), int(bb[1])]
rig["sleep_size"] = list(A.size); rig["stand_size"] = list(B.size)
icons = ["b_crown", "b_coin", "b_laurel", "b_scroll", "b_sword", "b_mask"]
items += [(n, sp(cut("gadfly-s3", k + 1), 20)) for k, n in enumerate(icons)]
items += [("fly_0", sp(cut("gadfly-s3", 7), 12, erode=1)), ("fly_1", sp(cut("gadfly-s3", 8), 12)),
          ("lamp_off", sp(cut("gadfly-s3", 9), 24)), ("lamp_on", sp(cut("gadfly-s3", 10), 24))]
cit = [dict(hair="short", hair_col=(60, 40, 30), skin="medium", cloth=(200, 196, 186)),
       dict(hair="bald", hair_col=(210, 210, 214), skin="tan", cloth=(150, 70, 60)),
       dict(hair="long", hair_col=(40, 30, 24), skin="light", cloth=(70, 110, 120)),
       dict(hair="short", hair_col=(200, 196, 190), skin="light", cloth=(170, 140, 90)),
       dict(hair="scarf", hair_col=(120, 60, 90), skin="brown", cloth=(210, 200, 180)),
       dict(hair="short", hair_col=(110, 70, 40), skin="dark", cloth=(90, 90, 130))]
peo = []
for n, kw in enumerate(cit):
    peo += [(f"cit{n}_doze", doze(kw)), (f"cit{n}_sit", P.sit(P.person(**kw))), (f"cit{n}_talk0", P.person(**kw, pose="wave", frame=0)),
            (f"cit{n}_talk1", P.person(**kw, pose="wave", frame=1))]
# rig pivots in atlas-piece pixels (relative to each part's own top-left): neck base and tail root
def piv(part, whole, fx, fy):
    """pivot given as a fraction of the whole horse, returned in the part's own pixels"""
    W, H = rig[whole + "_size"]; ox, oy = rig[part]; return [round(W * fx - ox), round(H * fy - oy)]
rig["pivots"] = {"sleep_head": piv("sleep_head", "sleep", .80, .45), "sleep_tail": piv("sleep_tail", "sleep", .11, .45),
                 "stand_head": piv("stand_head", "stand", .70, .44), "stand_tail": piv("stand_tail", "stand", .20, .30)}
build("gadfly", items, peo, [BG("gadfly-bg"), BG("gadfly-bg2"), PL("gadfly-plate")],
      ["standing horse was drawn facing left; flipped to face right like the sleeper", "rig: part offsets + pivots in rects.json rig"], {"rig": rig})

# ================= Only What's Yours =================
mine = ["key", "hammer", "scroll", "bread", "flame"]
items = [(n, sp(unpink(strict_cut("art/raw2/yours-s1.jpeg", (717, 858, 1257, 1466), thr=22)) if n == "bread" else cut("yours-s1", k + 1), 24, erode=1 if n in ("flame", "bread") else 0)) for k, n in enumerate(mine)]
items += [("lamp_clay", sp(cut("yours-s1", 6), 24)), ("lamp_iron", sp(unpink(cut("yours-s1", 7)), 30))]
nots = ["cloud", "laurel", "wisp", "dice", "purse", "crown", "laurel_gilt", "purse_gilt", "crown_gilt"]
nh = {"cloud": 22, "wisp": 28, "dice": 22}
items += [(n, sp(cut("yours-s2", k + 1), nh.get(n, 26))) for k, n in enumerate(nots)]
wd = chf("wanderer_down_0")
thief = dict(hair="cap", hair_col=(40, 36, 44), skin="tan", cloth=(56, 50, 66), collar=(80, 70, 90))
peo = [("hands_shut", wd), ("hands_shut1", chf("wanderer_down_1")), ("hands_open", hands_open(wd)),
       ("thief_sneak", P.lean(P.person(**thief), 3)), ("thief_sneak1", P.lean(P.person(**thief, frame=1), 3)),
       ("thief_grab", P.person(**thief, pose="wave", frame=0))]
build("yours", items, peo, [BG("yours-bg"), PL("yours-plate")], ["laurel/purse/crown_gilt: the painted fakes (grey shows at the chips)"])

# ================= Time Thieves =================
hg = mat.sprite(cut("thieves-s1", 1), None, 96)
a = np.array(hg); al = a[..., 3] > 0
# the sand region: transparent pixels enclosed by the frame (not reachable from the border)
h, w = al.shape; reach = np.zeros_like(al); stack = [(y, x) for y in range(h) for x in (0, w - 1)] + [(y, x) for x in range(w) for y in (0, h - 1)]
while stack:
    y, x = stack.pop()
    if 0 <= y < h and 0 <= x < w and not reach[y, x] and not al[y, x]:
        reach[y, x] = True; stack += [(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)]
sand = (~al) & (~reach)
glass = np.array(cut("thieves-s1", 1).resize(hg.size, Image.Resampling.BOX))
inner = Image.fromarray(np.dstack([np.full((h, w, 3), 255, np.uint8), (sand * 255).astype(np.uint8)]), "RGBA")
items = [("hourglass", hg), ("sand_mask", inner)]
th = [("imp", 2, 36), ("moth", 3, 30), ("glutton", 4, 38), ("sloth", 5, 32), ("flatter", 6, 36)]
items += [(n, sp(largest(cut("thieves-s1", k)) if n == "imp" else cut("thieves-s1", k), hh)) for n, k, hh in th]
vis = [("v_book", 28), ("v_letter", 24), ("v_staff", 28), ("v_lyre", 26)]
items += [(n, sp(cut("thieves-s2", k + 1), hh, erode=1)) for k, (n, hh) in enumerate(vis)]
b1 = dict(hair="short", hair_col=(50, 40, 30), skin="medium", cloth=(150, 60, 50)); b2 = dict(hair="bun", hair_col=(90, 60, 40), skin="light", cloth=(60, 100, 120))
peo = [("busy0_0", P.lean(P.person(**b1, pose="wave", frame=0), 3)), ("busy0_1", P.lean(P.person(**b1, frame=1), 3)),
       ("busy1_0", P.lean(P.person(**b2, pose="wave", frame=1), 3)), ("busy1_1", P.lean(P.person(**b2), 3))]
build("thieves", items, peo, [BG("thieves-bg"), BG("thieves-bg2"), BG("thieves-bg3"), PL("thieves-plate")],
      [f"hourglass sand mask: {int(sand.sum())} px enclosed by the frame (white = where sand can show)"])

# ================= The View from Above =================
items = [("worry", sp(cut("above-s1", 1), 160)), ("letter", sp(cut("above-s1", 2), 26)), ("oats", sp(cut("above-s1", 3), 24))]
guard = dict(hair="cap", hair_col=(176, 140, 60), skin="tan", cloth=(150, 50, 46), collar=(200, 170, 90))
peo = [("marcus_write", add_quill(chf("marcus_0"))), ("marcus_0", chf("marcus_0")), ("marcus_1", chf("marcus_1")),
       ("guard_0", P.person(**guard)), ("guard_1", P.person(**guard, frame=1))]
build("above", items, peo, [BG(f"above-bg{i}") for i in range(1, 6)] + [PL("above-plate")])
print("done")
