import sys, os, json
from PIL import Image, ImageDraw
g = sys.argv[1]; d = f"art/people41/{g}"; piv = json.load(open(f"{d}/pivots.json"))
names = list(piv); S = 4; cols = 12
cw, ch = 34 * S, 40 * S
rows = (len(names) + cols - 1) // cols
im = Image.new("RGBA", (cols * cw, rows * (ch + 12)), (60, 80, 80, 255)); dr = ImageDraw.Draw(im)
for i, n in enumerate(names):
    f = Image.open(f"{d}/{n}.png"); x0 = (i % cols) * cw; y0 = (i // cols) * (ch + 12)
    px, py = piv[n]
    ox = x0 + cw // 2 - px * S; oy = y0 + ch - 4 - py * S
    im.alpha_composite(f.resize((f.width * S, f.height * S), Image.NEAREST), (ox, oy))
    dr.line((x0 + 4, y0 + ch - 4, x0 + cw - 4, y0 + ch - 4), fill=(255, 220, 120, 255))
    dr.text((x0 + 2, y0 + ch), n[:22], fill=(255, 255, 255, 255))
im.save(f"/tmp/p41_{g}.png")
