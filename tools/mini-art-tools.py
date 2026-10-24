#!/usr/bin/env python3
"""
The Examined Life: mini-game art tools (Phase 29 of build plan 4).

Turns Cade's Gemini images into game-ready pieces. Pillow and numpy only.

  python3 mini-art-tools.py bg IN.jpg OUT.png [--shift X] [--colors N] [--key KEY.jpg]
      Crop a 2:3 painting to 3:5 (X = -1..1 shifts the crop left/right), resize to 384 x 640 with area
      averaging, and (optionally) quantize to N colors nudged toward a style key's palette.
  python3 mini-art-tools.py sheet IN.jpg OUTDIR [--key magenta|green] [--min 400]
      Key out the flat background, split the items into numbered cutouts (reading order), and write
      OUTDIR/_numbers.png, a contact sheet with each cutout's number.
  python3 mini-art-tools.py sprite IN.png OUT.png --h H [--colors N] [--outline]
      Resize a cutout to H pixels tall (premultiplied), harden its edge, and quantize it.
  python3 mini-art-tools.py frames IN.png OUTDIR --n N --h H
      Pre-render N rotation frames of one cutout (rotate at full size, then shrink).
  python3 mini-art-tools.py pack DIR OUT.png OUT.json
      Pack every PNG in DIR into one atlas; the JSON maps file stems to [x,y,w,h].
  python3 mini-art-tools.py plate IN.jpg OUT.jpg [--shift X]
      Crop a painting to 3:5 and export it at 768 x 1280 (JPEG quality 82).
  python3 mini-art-tools.py grid IN.png OUT.png
      Overlay a labeled grid in game units (192 x 320) for reading positions.
  python3 mini-art-tools.py --selftest
"""
import json, math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W3, H5 = 384, 640  # the stage in pixels (game units x 2)

# ---------------- backdrops and plates ----------------
def crop35(im, shift=0.0):
    w, h = im.size
    tw = int(round(h * 3 / 5))
    if tw <= w:
        spare = w - tw
        x0 = int(round(spare / 2 * (1 + max(-1, min(1, shift)))))
        return im.crop((x0, 0, x0 + tw, h))
    th = int(round(w * 5 / 3))
    y0 = (h - th) // 2
    return im.crop((0, y0, w, y0 + th))

def palette_of(img, n=64):
    q = img.convert("RGB").quantize(colors=n, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()[: n * 3]
    return [tuple(pal[i:i + 3]) for i in range(0, len(pal), 3)]

def bg(inp, out, shift=0.0, colors=0, key=None, sharpen=True):
    im = Image.open(inp).convert("RGB")
    im = crop35(im, shift).resize((W3, H5), Image.Resampling.BOX)
    if sharpen:
        im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    if colors:
        if key:
            kp = palette_of(Image.open(key).resize((256, 384)), 48)
            own = palette_of(im, colors)
            # nudge each of the image's colors 25% toward its nearest style-key color
            pal = []
            for c in own:
                k = min(kp, key=lambda p: sum((a - b) ** 2 for a, b in zip(c, p)))
                pal += [int(a * .75 + b * .25) for a, b in zip(c, k)]
            pal += [0] * (768 - len(pal))
            pimg = Image.new("P", (1, 1)); pimg.putpalette(pal)
            im = im.quantize(palette=pimg, dither=Image.Dither.NONE).convert("RGB")
        else:
            im = im.quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert("RGB")
    im.save(out, optimize=True)
    return im

def plate(inp, out, shift=0.0):
    im = Image.open(inp).convert("RGB")
    im = crop35(im, shift).resize((768, 1280), Image.Resampling.LANCZOS)
    im.save(out, quality=82, optimize=True, progressive=True)
    return im

# ---------------- sprite sheets ----------------
def key_alpha(arr, key="magenta"):
    """alpha 0..1 from how strongly each pixel is the background color, plus a despill"""
    a = arr.astype(np.float32)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    if key == "green":
        m = g - np.maximum(r, b)
        alpha = 1 - np.clip((m - 70) / 80, 0, 1)
    else:
        m = np.minimum(r, b) - g
        # m ~ 255 on pure background; items are low. Soft ramp between 70 and 150 ...
        alpha = 1 - np.clip((m - 70) / 80, 0, 1)
        # ... and bright pink glow halos (Gemini paints glows as pink on magenta) count as background too,
        # while deep reds and purples inside the items survive.
        halo = np.clip((m - 35) / 50, 0, 1) * np.clip((np.minimum(r, b) - 165) / 50, 0, 1)
        alpha = np.minimum(alpha, 1 - halo)
    out = a.copy()
    # despill: pull leftover background tint out of the edge pixels
    if key == "green":
        lim = np.maximum(r, b)
        out[..., 1] = np.where(g > lim, lim + (g - lim) * .2, g)
    else:
        lim = g + 40
        out[..., 0] = np.where((r > lim) & (b > lim) & (alpha < 1), np.minimum(r, lim + (r - lim) * .3), r)
        out[..., 2] = np.where((r > lim) & (b > lim) & (alpha < 1), np.minimum(b, lim + (b - lim) * .3), b)
    return out, alpha

def label(mask):
    """4-connected components of a boolean mask (numpy only). Returns (labels, n)."""
    h, w = mask.shape
    lab = np.zeros((h, w), np.int32)
    n = 0
    parent = [0]
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    for y in range(h):
        row = mask[y]
        if not row.any():
            continue
        prev = lab[y - 1] if y else None
        xs = np.nonzero(row)[0]
        start = xs[0]; last = xs[0]
        runs = []
        for x in xs[1:]:
            if x != last + 1:
                runs.append((start, last)); start = x
            last = x
        runs.append((start, last))
        for s, e in runs:
            ids = set()
            if prev is not None:
                seg = prev[s:e + 1]
                ids = set(int(v) for v in np.unique(seg) if v)
            if not ids:
                n += 1; parent.append(n); lab[y, s:e + 1] = n
            else:
                roots = sorted(set(find(i) for i in ids))
                r0 = roots[0]
                for rr in roots[1:]:
                    parent[rr] = r0
                lab[y, s:e + 1] = r0
    # flatten
    remap = {}
    k = 0
    flat = np.zeros_like(lab)
    for v in np.unique(lab):
        if v == 0:
            continue
        rt = find(int(v))
        if rt not in remap:
            k += 1; remap[rt] = k
        flat[lab == v] = remap[rt]
    return flat, k

def sheet(inp, outdir, key="magenta", min_area=400, join=6):
    os.makedirs(outdir, exist_ok=True)
    im = Image.open(inp).convert("RGB")
    arr = np.array(im)
    rgb, alpha = key_alpha(arr, key)
    mask = alpha > .5
    # join nearby specks (sparkles, detached bits) into their item before labelling
    grown = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(2 * join + 1))
    lab, n = label(np.array(grown) > 127)
    items = []
    for i in range(1, n + 1):
        ys, xs = np.nonzero((lab == i) & mask)
        if len(xs) < min_area:
            continue
        x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
        items.append((x0, y0, x1, y1, i))
    # reading order: rows by vertical center, then left to right
    items.sort(key=lambda t: ((t[1] + t[3]) / 2, t[0]))
    rows = []
    for t in items:
        cy = (t[1] + t[3]) / 2
        for rw in rows:
            if abs(rw[0] - cy) < (t[3] - t[1]) * .5:
                rw[1].append(t); break
        else:
            rows.append([cy, [t]])
    ordered = [t for _, rw in sorted(rows, key=lambda r: r[0]) for t in sorted(rw, key=lambda t: t[0])]
    rgba = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    outs = []
    for k, (x0, y0, x1, y1, i) in enumerate(ordered, 1):
        sub = rgba[y0:y1, x0:x1].copy()
        keep = (lab[y0:y1, x0:x1] == i)
        sub[..., 3] = np.where(keep, sub[..., 3], 0)
        p = os.path.join(outdir, f"{k:02d}.png")
        Image.fromarray(sub, "RGBA").save(p)
        outs.append((p, (x0, y0, x1, y1)))
    # numbered contact sheet
    th = 160
    tiles = []
    for p, _ in outs:
        t = Image.open(p)
        s = th / t.height
        tiles.append(t.resize((max(1, int(t.width * s)), th), Image.Resampling.LANCZOS))
    W = sum(t.width + 12 for t in tiles) + 12
    cs = Image.new("RGBA", (max(W, 64), th + 40), (40, 40, 48, 255))
    d = ImageDraw.Draw(cs)
    x = 12
    for k, t in enumerate(tiles, 1):
        cs.alpha_composite(t, (x, 30))
        d.text((x, 8), str(k), fill=(255, 230, 160, 255))
        x += t.width + 12
    cs.save(os.path.join(outdir, "_numbers.png"))
    return outs

def premul_resize(im, size):
    a = np.array(im.convert("RGBA")).astype(np.float32) / 255
    pm = a[..., :3] * a[..., 3:4]
    big = np.dstack([pm, a[..., 3:4]])
    chans = [Image.fromarray((big[..., c] * 255).astype(np.uint8)).resize(size, Image.Resampling.LANCZOS) for c in range(4)]
    out = np.dstack([np.array(c).astype(np.float32) / 255 for c in chans])
    al = np.clip(out[..., 3:4], 1e-6, 1)
    rgb = np.clip(out[..., :3] / al, 0, 1)
    return np.dstack([rgb, out[..., 3:4]])

def sprite(inp, out, h, colors=0, outline=False, alpha_cut=.5, trim=True):
    im = Image.open(inp).convert("RGBA") if isinstance(inp, str) else inp.convert("RGBA")
    if trim:
        bb = im.getbbox()
        if bb:
            im = im.crop(bb)
    w = max(1, int(round(im.width * h / im.height)))
    arr = premul_resize(im, (w, h))
    a = (arr[..., 3] >= alpha_cut).astype(np.uint8)
    rgb = (arr[..., :3] * 255).astype(np.uint8)
    res = Image.fromarray(np.dstack([rgb, a * 255]), "RGBA")
    if colors:
        q = res.convert("RGB").quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert("RGB")
        res = Image.fromarray(np.dstack([np.array(q), a * 255]), "RGBA")
    if outline:
        res = add_outline(res)
    if out:
        res.save(out)
    return res

def add_outline(im, col=(16, 11, 21, 255)):
    a = np.array(im)
    m = a[..., 3] > 0
    pad = np.pad(m, 1)
    ring = (pad[:-2, 1:-1] | pad[2:, 1:-1] | pad[1:-1, :-2] | pad[1:-1, 2:]) & ~m
    a[ring] = col
    return Image.fromarray(a, "RGBA")

def frames(inp, outdir, n, h, colors=0):
    os.makedirs(outdir, exist_ok=True)
    im = Image.open(inp).convert("RGBA") if isinstance(inp, str) else inp.convert("RGBA")
    bb = im.getbbox(); im = im.crop(bb)
    side = int(math.ceil(math.hypot(im.width, im.height)))
    base = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    base.alpha_composite(im, ((side - im.width) // 2, (side - im.height) // 2))
    outs = []
    for i in range(n):
        r = base.rotate(-360 * i / n, resample=Image.Resampling.BICUBIC)
        f = sprite(r, None, int(round(h * side / im.height)), colors=colors, trim=False)
        p = os.path.join(outdir, f"{i:02d}.png"); f.save(p); outs.append(p)
    return outs

def pack(items, out_png, pad=1, width=1024):
    """items: list of (name, PIL RGBA image). Shelf packing, tallest first."""
    items = sorted(items, key=lambda t: -t[1].height)
    x = y = pad; shelf = 0; rects = {}
    for name, im in items:
        if x + im.width + pad > width:
            x = pad; y += shelf + pad; shelf = 0
        rects[name] = [x, y, im.width, im.height]
        x += im.width + pad; shelf = max(shelf, im.height)
    H = y + shelf + pad
    H = int(math.ceil(H / 4) * 4)
    atlas = Image.new("RGBA", (width, H), (0, 0, 0, 0))
    for name, im in items:
        r = rects[name]; atlas.alpha_composite(im, (r[0], r[1]))
    # trim unused width
    bb = atlas.getbbox()
    if bb:
        atlas = atlas.crop((0, 0, min(width, bb[2] + pad), H))
    atlas.save(out_png, optimize=True)
    return rects

def grid(inp, out, step=16):
    im = Image.open(inp).convert("RGBA")
    sx, sy = im.width / 192, im.height / 320
    d = ImageDraw.Draw(im)
    for u in range(0, 193, step):
        d.line([(u * sx, 0), (u * sx, im.height)], fill=(255, 255, 0, 110), width=1)
        d.text((u * sx + 2, 2), str(u), fill=(255, 255, 0, 255))
    for v in range(0, 321, step):
        d.line([(0, v * sy), (im.width, v * sy)], fill=(0, 255, 255, 110), width=1)
        d.text((2, v * sy + 2), str(v), fill=(0, 255, 255, 255))
    im.save(out)

# ---------------- self test ----------------
def selftest():
    import tempfile
    t = tempfile.mkdtemp()
    im = Image.new("RGB", (600, 400), (255, 0, 255))
    d = ImageDraw.Draw(im)
    d.ellipse((40, 40, 160, 160), fill=(120, 110, 100)); d.rectangle((250, 60, 330, 200), fill=(200, 160, 40)); d.polygon([(450, 300), (560, 380), (420, 390)], fill=(40, 90, 160))
    im.save(os.path.join(t, "s.jpg"), quality=92)
    outs = sheet(os.path.join(t, "s.jpg"), os.path.join(t, "cut"))
    assert len(outs) == 3, f"expected 3 cutouts, got {len(outs)}"
    sp = sprite(outs[0][0], os.path.join(t, "sp.png"), 32, colors=16, outline=True)
    assert sp.height == 32
    fr = frames(outs[0][0], os.path.join(t, "fr"), 8, 24)
    assert len(fr) == 8
    g = Image.new("RGB", (1696, 2528)); ImageDraw.Draw(g).rectangle((0, 0, 1696, 1264), fill=(90, 40, 80)); g.save(os.path.join(t, "g.jpg"))
    b = bg(os.path.join(t, "g.jpg"), os.path.join(t, "bg.png"), colors=32)
    assert b.size == (384, 640)
    p = plate(os.path.join(t, "g.jpg"), os.path.join(t, "pl.jpg"))
    assert p.size == (768, 1280)
    rects = pack([("a", sp), ("b", Image.open(fr[0]))], os.path.join(t, "at.png"))
    assert set(rects) == {"a", "b"}
    grid(os.path.join(t, "bg.png"), os.path.join(t, "grid.png"))
    print("mini-art-tools selftest: PASS")
    return True

if __name__ == "__main__":
    a = sys.argv[1:]
    if not a or a[0] in ("-h", "--help"):
        print(__doc__); sys.exit(0)
    if a[0] == "--selftest":
        selftest(); sys.exit(0)
    def opt(name, default=None, cast=str):
        return cast(a[a.index(name) + 1]) if name in a else default
    cmd = a[0]
    if cmd == "bg":
        bg(a[1], a[2], shift=opt("--shift", 0.0, float), colors=opt("--colors", 0, int), key=opt("--key"))
    elif cmd == "plate":
        plate(a[1], a[2], shift=opt("--shift", 0.0, float))
    elif cmd == "sheet":
        for p, box in sheet(a[1], a[2], key=opt("--key", "magenta"), min_area=opt("--min", 400, int)):
            print(p, box)
    elif cmd == "sprite":
        sprite(a[1], a[2], opt("--h", 32, int), colors=opt("--colors", 0, int), outline="--outline" in a)
    elif cmd == "frames":
        frames(a[1], a[2], opt("--n", 8, int), opt("--h", 32, int))
    elif cmd == "pack":
        items = [(os.path.splitext(f)[0], Image.open(os.path.join(a[1], f)).convert("RGBA")) for f in sorted(os.listdir(a[1])) if f.endswith(".png")]
        json.dump(pack(items, a[2]), open(a[3], "w"))
    elif cmd == "grid":
        grid(a[1], a[2])
    else:
        print(__doc__); sys.exit(1)
