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
  python3 mini-art-tools.py key IN OUT [--color green|magenta|auto|#RRGGBB] [--tol N] [--soft N] [--despill] [--trim] [--island N]
      Chroma key to a transparent PNG/WebP: soft matte, spill suppression, tiny-island removal. auto = sample the border.
  python3 mini-art-tools.py layers IN_DIR OUT_DIR [--size 1080x2340]
      Key + cover-crop (bottom anchored) every <n>-<name>.png to WebP and write layers.json.
  python3 mini-art-tools.py parts IN OUT_DIR [--color auto] [--min-area N] [--names a,b,c]
      Cut a character parts sheet into an atlas + rig.json (rect, pivot) + _parts-review.png.
  python3 mini-art-tools.py vframes IN.mp4 OUT_DIR [--n 16] [--start s] [--end s] [--color auto] [--h PX]
      Evenly spaced video frames -> keyed, baseline/centre aligned, shared box -> frames.png + frames.json.
  python3 mini-art-tools.py webp IN OUT [--q 86] [--max W]
      Convert/resize to WebP keeping alpha.
  python3 mini-art-tools.py atlas OUT_PREFIX IN_FILES... [--page 2048] [--pad 2]
      Pack sprites into pages <= page x page: <prefix>-0.webp ... and <prefix>.json.
  python3 mini-art-tools.py --selftest
"""
import json, math, os, re, shutil, subprocess, sys
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
    lut = np.zeros(int(lab.max()) + 1, np.int32)
    for v in np.unique(lab):
        if v == 0:
            continue
        rt = find(int(v))
        if rt not in remap:
            k += 1; remap[rt] = k
        lut[v] = remap[rt]
    flat = lut[lab]
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

# ---------------- v6: chroma key, layers, parts, video frames, webp, atlas ----------------
def _win(a, r, fn):
    """separable square window max/min (fn = np.maximum / np.minimum) on a 2-D array"""
    if r <= 0:
        return a
    h, w = a.shape
    p = np.pad(a, r, mode="edge")
    m = p[:, 0:w]
    for i in range(1, 2 * r + 1):
        m = fn(m, p[:, i:i + w])
    o = m[0:h]
    for i in range(1, 2 * r + 1):
        o = fn(o, m[i:i + h])
    return o

def _dil(mask, r):
    return _win(mask.astype(np.uint8), r, np.maximum).astype(bool)

def _ero(mask, r):
    return _win(mask.astype(np.uint8), r, np.minimum).astype(bool)

def _box1(a, r, axis):
    k = 2 * r + 1
    n = a.shape[axis]
    pad = [(0, 0)] * a.ndim; pad[axis] = (r, r)
    cs = np.cumsum(np.pad(a, pad), axis=axis, dtype=np.float64)
    zs = list(cs.shape); zs[axis] = 1
    cs = np.concatenate([np.zeros(zs), cs], axis=axis)
    hi = [slice(None)] * a.ndim; hi[axis] = slice(k, k + n)
    lo = [slice(None)] * a.ndim; lo[axis] = slice(0, n)
    return ((cs[tuple(hi)] - cs[tuple(lo)]) / k).astype(np.float32)

def _box(a, r, passes=2):
    """box blur (zero padded, so divide a weighted blur by the blurred weights for a normalised one)"""
    for _ in range(passes):
        a = _box1(_box1(a, r, 0), r, 1)
    return a

def _cc(mask):
    """8-connected components (scipy if it is installed, else the numpy-only label())"""
    try:
        from scipy import ndimage
        return ndimage.label(mask, structure=np.ones((3, 3), int))
    except Exception:
        return label(mask)

def _hex(c):
    c = str(c).lstrip("#")
    if len(c) == 3:
        c = "".join(ch * 2 for ch in c)
    return np.array([int(c[i:i + 2], 16) for i in (0, 2, 4)], np.float32)

def _border(arr):
    h, w = arr.shape[:2]
    t = max(1, min(max(2, int(round(min(h, w) * 0.015))), h // 2, w // 2))
    m = np.zeros((h, w), bool); m[:t] = 1; m[-t:] = 1; m[:, :t] = 1; m[:, -t:] = 1
    return arr[m][:, :3].astype(np.float32)

def find_key(arr, color="auto"):
    """-> (key colour float[3], stats). auto samples the image border; green/magenta refine the preset from the border."""
    px = _border(arr)
    forced = True
    if isinstance(color, (tuple, list, np.ndarray)):
        K = np.array(color, np.float32)
    elif str(color).startswith("#") or re.fullmatch(r"[0-9a-fA-F]{6}", str(color)):
        K = _hex(color)
    elif color in ("green", "magenta"):
        r, g, b = px.T
        sel = (g - np.maximum(r, b) > 60) if color == "green" else (np.minimum(r, b) - g > 60)
        K = np.median(px[sel], 0) if sel.sum() >= max(8, 0.02 * len(px)) else np.array((0, 255, 0) if color == "green" else (255, 0, 255), np.float32)
    elif color == "auto":
        forced = False
        q = px.astype(np.int32) >> 4
        idx = (q[:, 0] << 8) | (q[:, 1] << 4) | q[:, 2]
        c0 = px[idx == np.bincount(idx).argmax()].mean(0)
        near = np.linalg.norm(px - c0, axis=1) < 60
        K = np.median(px[near], 0)
    else:
        raise ValueError(f"bad --color {color!r}")
    K = K.astype(np.float32)
    kn = float(np.linalg.norm(K)) + 1e-6
    kh = K / kn
    s = px @ kh
    res = np.linalg.norm(px - s[:, None] * kh, axis=1)
    near = res < 70
    cov = float(near.mean())
    if near.sum() >= 8 and cov >= 0.15:
        lo, hi = 0.75 * float(np.percentile(s[near], 1)), 1.25 * float(np.percentile(s[near], 99))
        tol1 = float(np.clip(1.5 * np.percentile(res[near], 98) + 10, 30, 80))
    else:
        lo, hi, tol1 = 0.45 * kn, 1.3 * kn, 45.0
    chroma = True if forced else (float(K.max() - K.min()) >= 90 and cov >= 0.5)
    return K, dict(lo=lo, hi=hi, tol1=tol1, cov=cov, chroma=chroma)

def _despill(F, K, zone):
    """clip the key's dominant channel(s) down to the others, only inside zone"""
    hi = [i for i in range(3) if K[i] > K.mean() + 20]
    lo = [i for i in range(3) if i not in hi]
    if not hi or not lo:
        return F
    lim = F[..., lo].max(-1)
    base = F[..., hi].min(-1)
    ex = np.where(zone, np.maximum(0, base - lim), 0) * 0.92
    out = F.copy()
    for i in hi:
        out[..., i] = F[..., i] - ex
    return out

def key_rgba(arr, color="auto", tol=None, soft=60.0, despill=False, island=None, trim=False):
    """Chroma key an RGB array -> (RGBA uint8 array, info).
    1. coarse pass: luminance-tolerant distance to the key finds definite background;
    2. a smooth local background field (handles gradients/vignettes) is fitted from it;
    3. alpha = ramp on distance to that field (tol = noise floor, soft = max ramp width);
    4. edge band: alpha re-estimated against the nearby opaque colour (proper matte for anti-aliased edges),
       colour un-mixed from the key, spill clipped, tiny islands dropped, colour bled under transparency."""
    arr = np.asarray(arr)[..., :3]
    h, w = arr.shape[:2]
    a = arr.astype(np.float32)
    K, st = find_key(arr, color)
    info = {"key": [int(round(float(v))) for v in K], "keyed": bool(st["chroma"])}
    if not st["chroma"]:
        info["note"] = "no chroma border found; left opaque (pass --color to force)"
        return np.dstack([arr.astype(np.uint8), np.full((h, w), 255, np.uint8)]), info
    kn = float(np.linalg.norm(K)) + 1e-6
    kh = K / kn
    s = a @ kh
    r1 = np.linalg.norm(a - s[..., None] * kh, axis=-1)
    pen = np.maximum(0, np.maximum(st["lo"] - s, s - st["hi"]))
    d1 = np.hypot(r1, pen)
    bgdef = _ero(d1 <= st["tol1"], 2)
    R = max(6, min(h, w) // 40)
    wt = bgdef.astype(np.float32)
    num = _box(a * wt[..., None], R)
    den = _box(wt, R)
    K2 = np.where((den > 0.01)[..., None], num / np.maximum(den, 1e-6)[..., None], K[None, None, :]).astype(np.float32)
    d2 = np.linalg.norm(a - K2, axis=-1)
    if tol is None:
        tol2 = float(np.clip(1.3 * np.percentile(d2[bgdef], 98) + 3, 8, 60)) if bgdef.any() else 30.0
    else:
        tol2 = float(tol)
    soft = max(1.0, float(soft))
    if soft > 14:
        dfg = _win(np.minimum(d2, 255).astype(np.uint8), 4, np.maximum).astype(np.float32)
        width = np.clip(dfg - tol2, 14.0, soft)
    else:
        width = soft
    alpha = np.clip((d2 - tol2) / width, 0, 1)
    # --- edge band: re-estimate alpha against the local opaque colour
    core = _ero(alpha >= 0.999, 2)
    band = _dil((alpha > 0) & (alpha < 1), 2) & ~core
    wc = core.astype(np.float32)
    fn = _box(a * wc[..., None], 6)
    fd = _box(wc, 6)
    fok = fd > 0.01
    Fc = np.where(fok[..., None], fn / np.maximum(fd, 1e-6)[..., None], a)
    fmag = np.linalg.norm(Fc - K2, axis=-1)
    nz = 0.6 * tol2
    am = np.clip((d2 - nz) / np.maximum(fmag - nz, 1.0), 0, 1)
    am = np.where((alpha >= 0.999) & (am > 0.75), 1.0, am)
    al = np.where(band & fok & (fmag > 50), am, alpha)
    # screen-difference matte (key-dominant channel(s) minus the rest): recovers veils/mist that have no opaque core
    hi_c = [i for i in range(3) if K[i] > K.mean() + 20]
    lo_c = [i for i in range(3) if i not in hi_c]
    if hi_c and lo_c:
        mK = K2[..., hi_c].min(-1) - K2[..., lo_c].max(-1)
        mC = a[..., hi_c].min(-1) - a[..., lo_c].max(-1)
        asd = np.clip((1 - mC / np.maximum(mK, 40.0)) * 1.05, 0, 1)
        al = np.minimum(al, asd)
    al = np.where(al < 0.05, 0.0, np.where(al > 0.97, 1.0, al))
    # --- colour: un-mix the key, then clip leftover spill near the edge
    A = al[..., None]
    Fu = (a - (1 - A) * K2) / np.maximum(A, 0.02)
    mix = np.clip(al / 0.35, 0, 1)[..., None]
    Fm = np.where(fok[..., None], mix * Fu + (1 - mix) * Fc, Fu)
    F = np.where(((al > 0) & (al < 1))[..., None], Fm, a)
    F = np.clip(F, 0, 255)
    F = _despill(F, K, _dil(al < 0.98, 4 if despill else 2) & (al > 0))
    # --- tiny islands
    if island is None:
        island = max(24, int(h * w * 2e-5))
    if island > 0:
        lab, n = _cc(al > 0)
        if n:
            areas = np.bincount(lab.ravel(), minlength=n + 1)
            small = areas < island; small[0] = False
            rem = small[lab]
            if rem.any():
                keep = (al > 0) & ~rem
                al = np.where(_dil(rem, 2) & ~keep, 0.0, al)
    F = np.where((al == 0)[..., None], np.where(fok[..., None], Fc, 0), F)
    rgba = np.dstack([np.clip(F + 0.5, 0, 255).astype(np.uint8), np.clip(al * 255 + 0.5, 0, 255).astype(np.uint8)])
    info.update(tol=round(tol2, 1), soft=soft)
    if trim:
        ys, xs = np.nonzero(rgba[..., 3] > 5)
        if len(xs):
            rgba = rgba[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    return rgba, info

def _save(im, path, q=86):
    ext = os.path.splitext(path)[1].lower()
    d = os.path.dirname(path)
    if d:
        os.makedirs(d, exist_ok=True)
    if ext == ".webp":
        im.save(path, "WEBP", quality=q, method=4, alpha_quality=100)
    elif ext in (".jpg", ".jpeg"):
        im.convert("RGB").save(path, quality=q)
    else:
        im.save(path, optimize=True)

def key_image(inp, out, color="auto", tol=None, soft=60.0, despill=False, trim=False, island=None):
    arr = np.array(Image.open(inp).convert("RGB"))
    rgba, info = key_rgba(arr, color, tol, soft, despill, island, trim)
    _save(Image.fromarray(rgba, "RGBA"), out)
    info["size"] = [rgba.shape[1], rgba.shape[0]]
    return info

def fit_cover(im, W, H):
    """scale to cover W x H, centre horizontally, keep the BOTTOM anchored (crop from the top)"""
    sc = max(W / im.width, H / im.height)
    nw, nh = max(W, int(round(im.width * sc))), max(H, int(round(im.height * sc)))
    arr = premul_resize(im, (nw, nh))
    x0, y0 = (nw - W) // 2, nh - H
    arr = arr[y0:y0 + H, x0:x0 + W]
    return Image.fromarray(np.clip(arr * 255 + 0.5, 0, 255).astype(np.uint8), "RGBA")

def layers(indir, outdir, size=(1080, 2340), q=86):
    os.makedirs(outdir, exist_ok=True)
    W, H = size
    pat = re.compile(r"^(\d+)-(.+)\.(png|jpg|jpeg|webp)$", re.I)
    found = []
    for f in os.listdir(indir):
        m = pat.match(f)
        if m:
            found.append((int(m.group(1)), m.group(1), m.group(2), f))
    found.sort()
    entries = []
    for depth, nstr, name, f in found:
        src = Image.open(os.path.join(indir, f))
        rgba = np.array(src.convert("RGBA"))
        if rgba[..., 3].min() >= 250:   # no real alpha: key it (auto leaves non-chroma painted backdrops opaque)
            rgba, _ = key_rgba(rgba[..., :3], "auto", despill=True)
        im = fit_cover(Image.fromarray(rgba, "RGBA"), W, H)
        if np.array(im)[..., 3].min() == 255:
            im = im.convert("RGB")
        fn = f"{nstr}-{name}.webp"
        _save(im, os.path.join(outdir, fn), q)
        entries.append({"key": name, "file": fn, "w": W, "h": H, "depth": depth})
    with open(os.path.join(outdir, "layers.json"), "w") as fh:
        json.dump(entries, fh, indent=2)
    return entries

def _reading_order(items):
    """items: (x0, y0, x1, y1, id). Rows by vertical centre, then left to right (same rule as sheet())."""
    items = sorted(items, key=lambda t: ((t[1] + t[3]) / 2, t[0]))
    rows = []
    for t in items:
        cy = (t[1] + t[3]) / 2
        for rw in rows:
            if abs(rw[0] - cy) < (t[3] - t[1]) * .5:
                rw[1].append(t); break
        else:
            rows.append([cy, [t]])
    return [t for _, rw in sorted(rows, key=lambda r: r[0]) for t in sorted(rw, key=lambda t: t[0])]

_LIMB = re.compile(r"(arm|leg|thigh|shin|calf|forearm|limb|hand|foot|wing|tail|sleeve)", re.I)

def default_pivot(name, w, h):
    """top-centre for limbs (by name or a tall thin shape), centre for everything else; pixels inside the part"""
    if _LIMB.search(name) or h >= 1.6 * w:
        return [round(w / 2, 1), 0]
    return [round(w / 2, 1), round(h / 2, 1)]

def _checker(w, h, cell=12):
    yy, xx = np.mgrid[0:h, 0:w]
    v = np.where(((yy // cell) + (xx // cell)) % 2 == 0, 200, 150).astype(np.uint8)
    return Image.fromarray(np.dstack([v, v, v, np.full_like(v, 255)]), "RGBA")

def _on_checker(im, scale=1):
    if scale > 1:
        im = im.resize((im.width * scale, im.height * scale), Image.Resampling.NEAREST)
    bgc = _checker(im.width, im.height)
    bgc.alpha_composite(im.convert("RGBA"))
    return bgc

def parts(inp, outdir, color="auto", min_area=400, names=None, join=6):
    os.makedirs(outdir, exist_ok=True)
    rgba, info = key_rgba(np.array(Image.open(inp).convert("RGB")), color, despill=True)
    alpha = rgba[..., 3]
    mask = alpha > 127
    lab, n = _cc(_dil(mask, join))
    areas = np.bincount(lab[mask].ravel(), minlength=n + 1)
    items = []
    for i in range(1, n + 1):
        if areas[i] < min_area:
            continue
        ys, xs = np.nonzero((lab == i) & mask)
        items.append((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1, i))
    items = _reading_order(items)
    H0, W0 = alpha.shape
    ims = []
    for k, (x0, y0, x1, y1, i) in enumerate(items):
        x0, y0, x1, y1 = max(0, x0 - 3), max(0, y0 - 3), min(W0, x1 + 3), min(H0, y1 + 3)
        sub = rgba[y0:y1, x0:x1].copy()
        sub[..., 3] = np.where(lab[y0:y1, x0:x1] == i, sub[..., 3], 0)
        ys, xs = np.nonzero(sub[..., 3] > 0)
        sub = sub[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        nm = names[k] if names and k < len(names) else f"part{k + 1:02d}"
        ims.append((nm, Image.fromarray(sub, "RGBA")))
    if not ims:
        raise ValueError("no parts found (lower --min-area or check --color)")
    order = [nm for nm, _ in ims]
    width = max(1024, max(im.width for _, im in ims) + 4)
    atlas_png = os.path.join(outdir, "atlas.png")
    rects = pack(ims, atlas_png, pad=2, width=width)
    atlas = Image.open(atlas_png).convert("RGBA")
    atlas.save(os.path.join(outdir, "atlas.webp"), "WEBP", quality=90, method=4, alpha_quality=100)
    rig = {"image": "atlas.png", "size": [atlas.width, atlas.height], "parts": {}}
    for nm in order:
        x, y, w, h = [int(v) for v in rects[nm]]
        rig["parts"][nm] = {"rect": [x, y, w, h], "pivot": default_pivot(nm, w, h)}
    with open(os.path.join(outdir, "rig.json"), "w") as fh:
        json.dump(rig, fh, indent=2)
    # review: atlas on a checkerboard with boxes, names and pivot dots
    sc = max(1, min(3, 700 // max(atlas.width, atlas.height)))
    rv = _on_checker(atlas, sc)
    d = ImageDraw.Draw(rv)
    pal = [(255, 80, 80), (60, 200, 255), (255, 210, 60), (120, 255, 120), (255, 120, 255), (255, 160, 60)]
    for j, nm in enumerate(order):
        p = rig["parts"][nm]; x, y, w, h = p["rect"]; px, py = p["pivot"]
        c = pal[j % len(pal)]
        d.rectangle((x * sc - 1, y * sc - 1, (x + w) * sc, (y + h) * sc), outline=c + (255,), width=1)
        d.text((x * sc + 3, y * sc + 2), nm, fill=(0, 0, 0, 255))
        cx, cy = (x + px) * sc, (y + py) * sc
        d.ellipse((cx - 4, cy - 4, cx + 4, cy + 4), fill=(255, 0, 0, 255), outline=(255, 255, 255, 255))
    rv.save(os.path.join(outdir, "_parts-review.png"))
    return rig

def _ffmpeg():
    p = shutil.which("ffmpeg")
    if p:
        return p
    try:
        import imageio_ffmpeg
    except ImportError:
        subprocess.run([sys.executable, "-m", "pip", "install", "--break-system-packages", "-q", "imageio-ffmpeg"], check=True)
        import imageio_ffmpeg
    return imageio_ffmpeg.get_ffmpeg_exe()

def _duration(ff, inp):
    r = subprocess.run([ff, "-i", inp], capture_output=True, text=True)
    m = re.search(r"Duration:\s*(\d+):(\d+):([\d.]+)", r.stderr)
    if not m:
        raise RuntimeError("could not read the video duration")
    return int(m.group(1)) * 3600 + int(m.group(2)) * 60 + float(m.group(3))

def _grid_for(n, w, h):
    best = None
    for c in range(1, n + 1):
        r = int(math.ceil(n / c))
        sc = abs(math.log((c * w) / (r * h))) + 0.02 * (c * r - n)
        if best is None or sc < best[0]:
            best = (sc, c, r)
    return best[1], best[2]

def vframes(inp, outdir, n=16, start=0.0, end=None, color="auto", h=None):
    os.makedirs(outdir, exist_ok=True)
    ff = _ffmpeg()
    dur = _duration(ff, inp)
    end = dur if end is None else min(float(end), dur)
    start = max(0.0, float(start))
    if end <= start:
        raise ValueError("--end must be after --start")
    tmp = os.path.join(outdir, "_raw")
    os.makedirs(tmp, exist_ok=True)
    keyed = []
    K = color
    tmax = max(0.0, dur - 0.05)
    for i in range(n):
        t = min(start + (end - start) * i / n, tmax)
        fp = os.path.join(tmp, f"{i:03d}.png")
        for tt in (t, max(0.0, t - 0.1), max(0.0, t - 0.3)):
            subprocess.run([ff, "-v", "error", "-y", "-ss", f"{tt:.3f}", "-i", inp, "-frames:v", "1", fp], check=True)
            if os.path.exists(fp) and os.path.getsize(fp) > 0:
                break
        else:
            raise RuntimeError(f"ffmpeg produced no frame at {t:.2f}s")
        rgba, info = key_rgba(np.array(Image.open(fp).convert("RGB")), K, despill=True)
        if not info["keyed"]:
            raise RuntimeError("no chroma background found in the video (pass --color)")
        K = tuple(info["key"])      # one key colour for the whole clip
        keyed.append(rgba)
    shutil.rmtree(tmp, ignore_errors=True)
    ext = []
    for rgba in keyed:
        al = rgba[..., 3].astype(np.float32)
        ys, xs = np.nonzero(al > 25)
        if not len(xs):
            ext.append(None); continue
        cx = float((np.arange(al.shape[1])[None, :] * al).sum() / al.sum())
        ext.append((cx, int(xs.min()), int(xs.max()) + 1, int(ys.min()), int(ys.max()) + 1))
    ok = [e for e in ext if e]
    if not ok:
        raise RuntimeError("every frame is empty after keying")
    pad = 2
    halfw = max(max(e[0] - e[1], e[2] - e[0]) for e in ok)
    W0 = 2 * int(math.ceil(halfw)) + 2 * pad
    H0 = int(math.ceil(max(e[4] - e[3] for e in ok))) + pad
    sc = (h / H0) if h else 1.0
    Wf, Hf = (max(1, int(round(W0 * sc))), int(h)) if h else (W0, H0)
    cells = []
    for rgba, e in zip(keyed, ext):
        cv = np.zeros((H0, W0, 4), np.uint8)
        if e:
            dx, dy = int(round(W0 / 2 - e[0])), H0 - e[4]
            sh, sw = rgba.shape[:2]
            x0, y0 = max(0, dx), max(0, dy)
            x1, y1 = min(W0, dx + sw), min(H0, dy + sh)
            cv[y0:y1, x0:x1] = rgba[y0 - dy:y1 - dy, x0 - dx:x1 - dx]
        im = Image.fromarray(cv, "RGBA")
        if (Wf, Hf) != (W0, H0):
            im = Image.fromarray(np.clip(premul_resize(im, (Wf, Hf)) * 255 + 0.5, 0, 255).astype(np.uint8), "RGBA")
        cells.append(im)
    cols, rows = _grid_for(n, Wf, Hf)
    sheet_im = Image.new("RGBA", (cols * Wf, rows * Hf), (0, 0, 0, 0))
    for i, im in enumerate(cells):
        sheet_im.paste(im, ((i % cols) * Wf, (i // cols) * Hf))
    sheet_im.save(os.path.join(outdir, "frames.png"), optimize=True)
    sheet_im.save(os.path.join(outdir, "frames.webp"), "WEBP", quality=86, method=4, alpha_quality=100)
    meta = {"cols": cols, "rows": rows, "count": n, "w": Wf, "h": Hf, "anchor": [0.5, 1],
            "image": "frames.png", "sheet": [sheet_im.width, sheet_im.height]}
    with open(os.path.join(outdir, "frames.json"), "w") as fh:
        json.dump(meta, fh, indent=2)
    rv = _on_checker(sheet_im)
    d = ImageDraw.Draw(rv)
    for i in range(n):
        x, y = (i % cols) * Wf, (i // cols) * Hf
        d.rectangle((x, y, x + Wf - 1, y + Hf - 1), outline=(255, 80, 80, 255))
        d.line((x + Wf // 2, y + Hf - 1 - 6, x + Wf // 2, y + Hf - 1), fill=(0, 0, 255, 255))
        d.text((x + 3, y + 2), str(i), fill=(0, 0, 0, 255))
    rv.save(os.path.join(outdir, "_frames-review.png"))
    if sheet_im.width > 2048 or sheet_im.height > 2048:
        print(f"warning: sheet {sheet_im.width}x{sheet_im.height} exceeds 2048; use a smaller --h or --n", file=sys.stderr)
    return meta

def webp(inp, out, q=86, maxw=None):
    im = Image.open(inp)
    has_a = im.mode in ("RGBA", "LA", "PA") or "transparency" in im.info
    im = im.convert("RGBA" if has_a else "RGB")
    if maxw and im.width > maxw:
        size = (int(maxw), max(1, int(round(im.height * maxw / im.width))))
        if has_a:
            im = Image.fromarray(np.clip(premul_resize(im, size) * 255 + 0.5, 0, 255).astype(np.uint8), "RGBA")
        else:
            im = im.resize(size, Image.Resampling.LANCZOS)
    _save(im, out if out.lower().endswith(".webp") else out + ".webp", q)
    return im.size

def atlas(prefix, files, page=2048, pad=2, q=86):
    """shelf-pack sprites (tallest first) into pages <= page x page"""
    d = os.path.dirname(prefix)
    if d:
        os.makedirs(d, exist_ok=True)
    sprites, used = [], set()
    for f in files:
        base = os.path.splitext(os.path.basename(f))[0]
        nm, k = base, 2
        while nm in used:
            nm = f"{base}_{k}"; k += 1
        used.add(nm)
        im = Image.open(f).convert("RGBA")
        if im.width + 2 * pad > page or im.height + 2 * pad > page:
            raise ValueError(f"{f} ({im.width}x{im.height}) does not fit a {page} page with pad {pad}")
        sprites.append((nm, im))
    sprites.sort(key=lambda t: (-t[1].height, -t[1].width, t[0]))
    pgs, placed = [], {}
    for nm, im in sprites:
        w, h = im.width, im.height
        spot = None
        for pi, pg in enumerate(pgs):
            for sh in pg["shelves"]:
                if h <= sh[1] and sh[2] + w <= page - pad:
                    spot = (pi, sh[2], sh[0]); sh[2] += w + pad; break
            if spot:
                break
            if pg["y"] + h <= page - pad:
                pg["shelves"].append([pg["y"], h, pad + w + pad]); spot = (pi, pad, pg["y"]); pg["y"] += h + pad
                break
        if not spot:
            pgs.append({"shelves": [[pad, h, pad + w + pad]], "y": pad + h + pad, "items": []})
            spot = (len(pgs) - 1, pad, pad)
        pgs[spot[0]]["items"].append((nm, im, spot[1], spot[2]))
        placed[nm] = {"page": spot[0], "rect": [spot[1], spot[2], w, h]}
    pages = []
    for i, pg in enumerate(pgs):
        Wp = min(page, int(math.ceil((max(x + im.width for _, im, x, y in pg["items"]) + pad) / 4) * 4))
        Hp = min(page, int(math.ceil((max(y + im.height for _, im, x, y in pg["items"]) + pad) / 4) * 4))
        sh_im = Image.new("RGBA", (Wp, Hp), (0, 0, 0, 0))
        for _, im, x, y in pg["items"]:
            sh_im.alpha_composite(im, (x, y))
        fn = f"{prefix}-{i}.webp"
        _save(sh_im, fn, q)
        pages.append({"file": os.path.basename(fn), "w": Wp, "h": Hp})
    with open(prefix + ".json", "w") as fh:
        json.dump({"pages": pages, "frames": placed}, fh, indent=2)
    return placed, pages

HELP = {
    "key": "python3 mini-art-tools.py key IN OUT [--color green|magenta|auto|#RRGGBB] [--tol N] [--soft N] [--despill] [--trim] [--island N]\n"
           "  Chroma key to a transparent PNG/WebP (by OUT extension). --color auto samples the border for the key colour and tolerance.\n"
           "  --tol N   noise floor, RGB distance from the local background (default: measured from the border)\n"
           "  --soft N  widest matte ramp in RGB distance (default 60; the ramp narrows by itself on low-contrast edges)\n"
           "  --despill wider spill-suppression band (4px instead of 2px) around edges\n"
           "  --trim    crop to the visible pixels      --island N  drop blobs smaller than N px (default ~2e-5 of the image)",
    "layers": "python3 mini-art-tools.py layers IN_DIR OUT_DIR [--size 1080x2340]\n"
              "  For each <n>-<name>.png|jpg|webp: key (auto; opaque painted backdrops are left alone), cover-crop to the size keeping the\n"
              "  bottom anchored, save <n>-<name>.webp (q86, alpha kept) and write layers.json [{key,file,w,h,depth}].",
    "parts": "python3 mini-art-tools.py parts IN OUT_DIR [--color auto] [--min-area N] [--names a,b,c]\n"
             "  Cut a parts sheet (parts painted apart on chroma) into OUT_DIR/atlas.png+.webp, rig.json {parts:{name:{rect:[x,y,w,h],pivot:[px,py]}}}\n"
             "  (pivot in pixels inside the part: top-centre for limbs, centre otherwise; edit it by hand) and _parts-review.png.\n"
             "  --names are applied in reading order (rows top to bottom, left to right); --min-area default 400.",
    "vframes": "python3 mini-art-tools.py vframes IN.mp4 OUT_DIR [--n 16] [--start s] [--end s] [--color auto] [--h PX]\n"
               "  N evenly spaced frames (ffmpeg), keyed, aligned on a common baseline (bottom of alpha) and centre-x, cropped to one shared box,\n"
               "  scaled to height PX, packed into frames.png/.webp + frames.json {cols,rows,count,w,h,anchor:[0.5,1]} + _frames-review.png.",
    "webp": "python3 mini-art-tools.py webp IN OUT [--q 86] [--max W]\n  Convert/resize to WebP keeping alpha (--max = maximum width).",
    "atlas": "python3 mini-art-tools.py atlas OUT_PREFIX IN_FILES... [--page 2048] [--pad 2] [--q 86]\n"
             "  Pack sprites into pages <= page x page: OUT_PREFIX-0.webp, -1.webp ... and OUT_PREFIX.json {pages:[...],frames:{name:{page,rect:[x,y,w,h]}}}.",
}

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

def _edge_spill(rgba, kind="green"):
    """mean key-colour excess over the edge pixels (0.04 < alpha < 0.96) of an RGBA array"""
    a = rgba[..., 3] / 255.0
    m = (a > 0.04) & (a < 0.96)
    if not m.any():
        return 0.0, 0
    r, g, b = [rgba[..., i].astype(np.float32)[m] for i in range(3)]
    ex = np.maximum(0, g - np.maximum(r, b)) if kind == "green" else np.maximum(0, np.minimum(r, b) - g)
    return float(ex.mean()), int(m.sum())

def _aa_draw(size, fn, ss=3):
    im = Image.new("RGB", (size[0] * ss, size[1] * ss)); d = ImageDraw.Draw(im); fn(d, ss)
    return im

def selftest6():
    import tempfile
    here = os.path.abspath(__file__)
    t = tempfile.mkdtemp()
    def cli(*args):
        r = subprocess.run([sys.executable, here] + [str(x) for x in args], capture_output=True, text=True)
        assert r.returncode == 0, f"CLI {args[0]} failed: {r.stderr[-600:]}"
        return r.stdout
    rng = np.random.RandomState(7)
    # --- 1. painted-looking blob with soft edges, hair strands and mist on noisy, graded green, then JPEG
    w, h = 540, 960
    m = Image.new("L", (w, h), 0); d = ImageDraw.Draw(m)
    d.ellipse((190, 160, 350, 330), fill=255); d.polygon([(270, 300), (80, 860), (460, 860)], fill=255); d.rectangle((120, 860, 420, h), fill=255)
    for k in range(16):
        x = 195 + k * 10; d.line([(x, 175), (x + (k - 8) * 3, 120 - (k % 4) * 8)], fill=255, width=2)
    sh = np.array(m.filter(ImageFilter.GaussianBlur(1.6)), np.float32) / 255
    mist = Image.new("L", (w, h), 0); ImageDraw.Draw(mist).ellipse((340, 480, 520, 690), fill=95)
    mist = np.array(mist.filter(ImageFilter.GaussianBlur(14)), np.float32) / 255
    alpha = np.maximum(sh, mist)
    Fim = Image.new("RGB", (w, h), (230, 230, 240)); fd = ImageDraw.Draw(Fim)
    fd.polygon([(270, 300), (80, 860), (460, 860)], fill=(70, 40, 90)); fd.rectangle((120, 860, 420, h), fill=(120, 80, 50))
    fd.ellipse((190, 160, 350, 330), fill=(200, 150, 120))
    for k in range(16):
        x = 195 + k * 10; fd.line([(x, 175), (x + (k - 8) * 3, 120 - (k % 4) * 8)], fill=(30, 25, 20), width=2)
    fd.pieslice((190, 150, 350, 300), 180, 360, fill=(30, 25, 20))
    F = np.array(Fim, np.float32) + rng.normal(0, 7, (h, w, 3))
    yy, xx = np.mgrid[0:h, 0:w]
    gk = (0.82 + 0.25 * yy / h + 0.06 * xx / w)[..., None]
    B = np.array([5, 242, 19], np.float32) * gk + rng.normal(0, 5, (h, w, 3))
    C = np.clip(alpha[..., None] * F + (1 - alpha[..., None]) * B, 0, 255).astype(np.uint8)
    Image.fromarray(C).save(os.path.join(t, "blob.jpg"), quality=78)
    raw_spill, _ = _edge_spill(np.dstack([C, (alpha * 255).astype(np.uint8)]), "green")
    res = {}
    # `key` via the CLI, all colour modes
    for tag, extra in (("auto", ["--color", "auto"]), ("green", ["--color", "green"]), ("hex", ["--color", "#05f213"]), ("despill", ["--despill"])):
        outp = os.path.join(t, f"key-{tag}.png")
        cli("key", os.path.join(t, "blob.jpg"), outp, *extra)
        o = Image.open(outp); assert o.mode == "RGBA" and o.size == (w, h), (tag, o.mode, o.size)
        ar = np.array(o)
        assert ar[0, 0, 3] == 0 and ar[-1, 0, 3] == 0 and ar[240, 270, 3] == 255, f"{tag}: corners/centre alpha wrong"
        sp, ne = _edge_spill(ar, "green")
        mae = float(np.abs(ar[..., 3] / 255.0 - alpha).mean())
        assert sp < 4, f"{tag}: edge spill {sp:.2f} too high"
        assert mae < 0.02, f"{tag}: alpha MAE {mae:.4f} too high"
        assert 0.15 < (ar[(mist > 0.2) & (sh < 0.01), 3] / 255.0).mean() < 0.6, f"{tag}: mist alpha lost"
        res[tag] = (sp, mae, ne)
    outw = os.path.join(t, "key.webp"); cli("key", os.path.join(t, "blob.jpg"), outw, "--trim")
    ow = Image.open(outw); assert ow.mode == "RGBA" and ow.width < w and ow.height < h and np.array(ow)[..., 3].min() == 0 and ow.getbbox() is not None
    # --- 2. layers
    ld = os.path.join(t, "lay_in"); os.makedirs(ld)
    Image.open(os.path.join(t, "blob.jpg")).save(os.path.join(ld, "2-mid.png"))
    sky = np.dstack([np.linspace(40, 200, h)[:, None].repeat(w, 1), np.linspace(60, 120, h)[:, None].repeat(w, 1), np.full((h, w), 170)]).astype(np.uint8)
    Image.fromarray(sky).save(os.path.join(ld, "1-sky.png"))
    Image.fromarray(np.dstack([sky, np.zeros((h, w), np.uint8)]), "RGBA").save(os.path.join(ld, "3-fore.png"))
    open(os.path.join(ld, "notes.txt"), "w").write("ignored")
    lo = os.path.join(t, "lay_out")
    cli("layers", ld, lo, "--size", "1080x2340")
    lj = json.load(open(os.path.join(lo, "layers.json")))
    assert [e["key"] for e in lj] == ["sky", "mid", "fore"] and [e["depth"] for e in lj] == [1, 2, 3], lj
    for e in lj:
        im = Image.open(os.path.join(lo, e["file"])); assert im.format == "WEBP" and im.size == (1080, 2340) == (e["w"], e["h"]), e
    sk = Image.open(os.path.join(lo, "1-sky.webp")); assert np.array(sk.convert("RGBA"))[..., 3].min() == 255, "painted sky must stay opaque"
    mid = np.array(Image.open(os.path.join(lo, "2-mid.webp"))); assert Image.open(os.path.join(lo, "2-mid.webp")).mode == "RGBA"
    assert mid[5, 5, 3] == 0 and mid[-1, 540, 3] > 250, "mid layer: transparent top corner + bottom anchored ground"
    assert np.array(Image.open(os.path.join(lo, "3-fore.webp")).convert("RGBA"))[..., 3].max() == 0, "real alpha must be kept"
    # --- 3. parts sheet on magenta
    pw, ph = 640, 520
    spec = [("head", "e", (270, 40, 370, 140), (205, 155, 125)), ("arm_l", "r", (60, 170, 110, 330), (170, 40, 50)),
            ("torso", "r", (230, 170, 410, 330), (50, 80, 170)), ("arm_r", "r", (530, 170, 580, 330), (170, 40, 50)),
            ("leg_l", "r", (250, 380, 310, 500), (60, 60, 80)), ("leg_r", "r", (330, 380, 390, 500), (60, 60, 80))]
    def dr(dd, s):
        for nm, kind, bb, col in spec:
            bb = tuple(v * s for v in bb)
            (dd.ellipse if kind == "e" else (lambda b, fill: dd.rounded_rectangle(b, radius=8 * s, fill=fill)))(bb, fill=col)
    big = _aa_draw((pw, ph), lambda dd, s: (dd.rectangle((0, 0, pw * s, ph * s), fill=(255, 0, 255)), dr(dd, s)))
    sm = np.array(big.resize((pw, ph), Image.Resampling.LANCZOS), np.float32) + rng.normal(0, 4, (ph, pw, 3))
    Image.fromarray(np.clip(sm, 0, 255).astype(np.uint8)).save(os.path.join(t, "parts.jpg"), quality=80)
    po = os.path.join(t, "parts_out")
    cli("parts", os.path.join(t, "parts.jpg"), po, "--color", "auto", "--min-area", "300", "--names", "head,arm_l,torso,arm_r,leg_l,leg_r")
    rig = json.load(open(os.path.join(po, "rig.json")))
    assert list(rig["parts"]) == ["head", "arm_l", "torso", "arm_r", "leg_l", "leg_r"] or set(rig["parts"]) == {s_[0] for s_ in spec}
    atl = Image.open(os.path.join(po, "atlas.png")); assert atl.mode == "RGBA"
    aa = np.array(atl)
    for nm, kind, bb, col in spec:
        p = rig["parts"][nm]; x, y, ww, hh = p["rect"]
        assert abs(ww - (bb[2] - bb[0])) <= 6 and abs(hh - (bb[3] - bb[1])) <= 6, (nm, p["rect"], bb)
        assert x >= 0 and y >= 0 and x + ww <= atl.width and y + hh <= atl.height
        cx, cy = x + ww // 2, y + hh // 2
        assert aa[cy, cx, 3] == 255 and np.abs(aa[cy, cx, :3].astype(int) - np.array(col)).max() < 25, (nm, aa[cy, cx])
        if nm.startswith(("arm", "leg")):
            assert p["pivot"] == [round(ww / 2, 1), 0], (nm, p["pivot"])
        else:
            assert p["pivot"] == [round(ww / 2, 1), round(hh / 2, 1)], (nm, p["pivot"])
    assert len(rig["parts"]) == 6
    psp, _ = _edge_spill(aa, "magenta"); assert psp < 8, f"parts edge spill {psp:.2f}"
    assert os.path.exists(os.path.join(po, "_parts-review.png")) and os.path.exists(os.path.join(po, "atlas.webp"))
    # --- 4. video: a bobbing figure moving across noisy green, encoded as MP4
    vw, vh, nf = 256, 192, 24
    fdir = os.path.join(t, "vf"); os.makedirs(fdir)
    for i in range(nf):
        u = i / (nf - 1); cx = 55 + 146 * u; bob = 22 * abs(math.sin(u * math.pi * 3)); bot = 176 - bob
        def fr(dd, s):
            dd.rectangle((0, 0, vw * s, vh * s), fill=(0, 0, 0))
            dd.ellipse(((cx - 24) * s, (bot - 80) * s, (cx + 24) * s, bot * s), fill=(230, 120, 40))
            dd.ellipse(((cx - 14) * s, (bot - 112) * s, (cx + 14) * s, (bot - 84) * s), fill=(210, 160, 130))
            ax = cx + 40 * math.sin(u * 20); dd.line([(cx * s, (bot - 60) * s), (ax * s, (bot - 20) * s)], fill=(90, 50, 30), width=5 * s)
        fm = np.array(_aa_draw((vw, vh), fr).resize((vw, vh), Image.Resampling.LANCZOS), np.float32)
        ma = fm.sum(-1) > 0
        # alpha from the (anti-aliased) figure mask: re-draw as mask
        mk = _aa_draw((vw, vh), lambda dd, s: (dd.rectangle((0, 0, vw * s, vh * s), fill=(0, 0, 0)), dd.ellipse(((cx - 24) * s, (bot - 80) * s, (cx + 24) * s, bot * s), fill=(255,) * 3),
                                                dd.ellipse(((cx - 14) * s, (bot - 112) * s, (cx + 14) * s, (bot - 84) * s), fill=(255,) * 3),
                                                dd.line([(cx * s, (bot - 60) * s), ((cx + 40 * math.sin(u * 20)) * s, (bot - 20) * s)], fill=(255,) * 3, width=5 * s)))
        al = (np.array(mk.resize((vw, vh), Image.Resampling.LANCZOS), np.float32)[..., 0] / 255)[..., None]
        bgv = np.array([5, 242, 19], np.float32) + rng.normal(0, 5, (vh, vw, 3))
        # fm already holds F*alpha (black elsewhere) -> straight colour = fm/al where al>0
        Fv = np.where(al > 0.01, fm / np.maximum(al, 0.01), 0)
        Image.fromarray(np.clip(al * Fv + (1 - al) * bgv, 0, 255).astype(np.uint8)).save(os.path.join(fdir, f"f{i:03d}.png"))
    mp4 = os.path.join(t, "clip.mp4")
    ff = _ffmpeg()
    for codec in (["-c:v", "libx264", "-crf", "18"], ["-c:v", "mpeg4", "-q:v", "3"]):
        r = subprocess.run([ff, "-v", "error", "-y", "-framerate", "12", "-i", os.path.join(fdir, "f%03d.png"), *codec, "-pix_fmt", "yuv420p", mp4], capture_output=True, text=True)
        if r.returncode == 0:
            break
    assert os.path.exists(mp4) and os.path.getsize(mp4) > 1000, "ffmpeg could not make the test mp4"
    vo = os.path.join(t, "vout")
    cli("vframes", mp4, vo, "--n", "8", "--start", "0.1", "--end", "1.8", "--color", "auto", "--h", "96")
    fj = json.load(open(os.path.join(vo, "frames.json")))
    assert fj["count"] == 8 and fj["anchor"] == [0.5, 1] and fj["h"] == 96 and fj["cols"] * fj["rows"] >= 8, fj
    sheet_im = np.array(Image.open(os.path.join(vo, "frames.png"))); assert sheet_im.shape[:2] == (fj["rows"] * fj["h"], fj["cols"] * fj["w"])
    bots, cxs = [], []
    for i in range(8):
        c = sheet_im[(i // fj["cols"]) * fj["h"]:(i // fj["cols"] + 1) * fj["h"], (i % fj["cols"]) * fj["w"]:(i % fj["cols"] + 1) * fj["w"]]
        a_ = c[..., 3].astype(np.float32); ys, xs = np.nonzero(a_ > 25); assert len(xs) > 200, f"frame {i} empty"
        bots.append(ys.max()); cxs.append((np.arange(a_.shape[1])[None] * a_).sum() / a_.sum())
    assert max(bots) - min(bots) <= 2 and bots[0] >= fj["h"] - 4, f"baseline not aligned: {bots}"
    assert max(cxs) - min(cxs) <= 3 and abs(np.mean(cxs) - fj["w"] / 2) <= 3, f"centre-x not aligned: {cxs}"
    vsp, _ = _edge_spill(sheet_im, "green"); assert vsp < 10, f"video edge spill {vsp:.2f}"
    assert os.path.exists(os.path.join(vo, "_frames-review.png"))
    # --- 5. webp
    wo = os.path.join(t, "small.webp"); cli("webp", os.path.join(t, "key-auto.png"), wo, "--q", "80", "--max", "270")
    wi = Image.open(wo); assert wi.format == "WEBP" and wi.size == (270, 480) and wi.mode == "RGBA" and np.array(wi)[..., 3].min() == 0
    # --- 6. atlas: one page, then many pages
    sp = []
    for i in range(10):
        p_ = os.path.join(t, f"sp{i}.png"); Image.new("RGBA", (100, 100), (25 * i, 255 - 25 * i, 90, 255)).save(p_); sp.append(p_)
    cli("atlas", os.path.join(t, "at1"), *sp, *[os.path.join(po, "atlas.png")])
    j1 = json.load(open(os.path.join(t, "at1.json"))); assert len(j1["frames"]) == 11 and len(j1["pages"]) == 1 and os.path.exists(os.path.join(t, "at1-0.webp"))
    cli("atlas", os.path.join(t, "at2"), *sp, "--page", "256", "--pad", "2")
    j2 = json.load(open(os.path.join(t, "at2.json"))); assert len(j2["pages"]) == 3 and len(j2["frames"]) == 10, j2["pages"]
    pages = [np.array(Image.open(os.path.join(t, f"at2-{i}.webp"))) for i in range(3)]
    for nm, fr_ in j2["frames"].items():
        x, y, ww, hh = fr_["rect"]; pg = pages[fr_["page"]]; k = int(nm[2:])
        assert pg.shape[0] <= 256 and pg.shape[1] <= 256 and x + ww <= pg.shape[1] and y + hh <= pg.shape[0]
        assert np.abs(pg[y + 50, x + 50, :3].astype(int) - np.array([25 * k, 255 - 25 * k, 90])).max() < 12, nm
    # --- 7. help for every new subcommand, and bad input
    for c in ("key", "layers", "parts", "vframes", "webp", "atlas"):
        assert c in cli(c, "--help"), c
    print(f"mini-art-tools selftest6: PASS  (raw edge spill {raw_spill:.1f} -> " + ", ".join(f"{k} {v[0]:.2f}/mae {v[1]:.3f}" for k, v in res.items()) + f"; parts {psp:.2f}; video {vsp:.2f})")
    print("  scratch:", t)
    return t

if __name__ == "__main__":
    a = sys.argv[1:]
    if not a or a[0] in ("-h", "--help"):
        print(__doc__); sys.exit(0)
    if a[0] == "--selftest":
        selftest(); selftest6(); sys.exit(0)
    if a[0] == "--selftest6":
        selftest6(); sys.exit(0)
    def opt(name, default=None, cast=str):
        return cast(a[a.index(name) + 1]) if name in a else default
    cmd = a[0]
    if len(a) > 1 and a[1] in ("-h", "--help"):
        print(HELP.get(cmd, __doc__)); sys.exit(0)
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
    elif cmd == "key":
        print(json.dumps(key_image(a[1], a[2], color=opt("--color", "auto"), tol=opt("--tol", None, float), soft=opt("--soft", 60.0, float),
                                   despill="--despill" in a, trim="--trim" in a, island=opt("--island", None, int))))
    elif cmd == "layers":
        sz = opt("--size", "1080x2340").lower().split("x")
        for e in layers(a[1], a[2], (int(sz[0]), int(sz[1]))):
            print(e["file"], e["depth"])
    elif cmd == "parts":
        nm = opt("--names")
        rig = parts(a[1], a[2], color=opt("--color", "auto"), min_area=opt("--min-area", 400, int), names=nm.split(",") if nm else None)
        print(len(rig["parts"]), "parts:", ", ".join(rig["parts"]))
    elif cmd == "vframes":
        print(json.dumps(vframes(a[1], a[2], n=opt("--n", 16, int), start=opt("--start", 0.0, float), end=opt("--end", None, float),
                                 color=opt("--color", "auto"), h=opt("--h", None, int))))
    elif cmd == "webp":
        print(webp(a[1], a[2], q=opt("--q", 86, int), maxw=opt("--max", None, int)))
    elif cmd == "atlas":
        fl, skip = [], False
        for x in a[2:]:
            if skip:
                skip = False
            elif x in ("--page", "--pad", "--q"):
                skip = True
            else:
                fl.append(x)
        pl, pgs = atlas(a[1], fl, page=opt("--page", 2048, int), pad=opt("--pad", 2, int), q=opt("--q", 86, int))
        print(len(pl), "sprites,", len(pgs), "page(s)")
    else:
        print(__doc__); sys.exit(1)
