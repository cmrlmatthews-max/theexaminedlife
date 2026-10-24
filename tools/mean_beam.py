"""Phase 32A finish: trace MINI_ART.mean.beam on mean-bg, draw the overlay, rebuild the mean review sheet."""
import json, os
from PIL import Image, ImageDraw
# beam centre line from the near end (bottom centre) to the far cliff, units (192x320); third value = full width in units
BEAM = [[96,238,21],[96,206,16],[96,175,11],[89,160,7],[82,145,5],[76,132,4],[69,114,2]]
g = json.load(open("art/out2/geo.json")); g["mean"] = {"beam": BEAM, "note": "beam = centre line [x,y,width] in units, near end (bottom centre) to the far cliff; it runs straight up to y175, then bends up-LEFT to the far cliff. Below y~240 the backdrop is dark (pad zone)."}
json.dump(g, open("art/out2/geo.json", "w"), indent=1)
r = json.load(open("art/out2/mean/rects.json")); r["beam"] = BEAM; json.dump(r, open("art/out2/mean/rects.json", "w"))
# overlay
im = Image.open("art/proc2/bg/mean-bg.png").convert("RGBA"); d = ImageDraw.Draw(im)
pts = [(x*2, y*2) for x, y, w in BEAM]
d.line(pts, fill=(0,255,255,255), width=2)
for x, y, w in BEAM:
    d.line([(x*2-w, y*2), (x*2+w, y*2)], fill=(255,0,255,255), width=2); d.ellipse([x*2-3,y*2-3,x*2+3,y*2+3], outline=(0,255,255,255))
im.save("art/proc2/geo/mean.png")
# review sheet from the packed atlas
A = Image.open("art/out2/mean/atlas.png").convert("RGBA"); Pp = Image.open("art/out2/mean/people.png").convert("RGBA")
items = [(n, A.crop((x,y,x+w,y+h))) for n,(x,y,w,h) in r["rects"].items()]
peo = [(n, Pp.crop((x,y,x+w,y+h))) for n,(x,y,w,h) in r["prects"].items()]
import sys; sys.argv=["x"]
src = open("tools/level2_art.py").read(); head = src[:src.find("# ================= The Golden Mean")]
ns = {}; exec(head, ns)
ns["review"]("mean", items, peo, ["art/proc2/bg/mean-bg.png", "art/proc2/geo/mean.png", "art/proc2/plate/mean-plate.jpg"],
             ["mean-bg: the real beam image (Oct 1). Beam traced: cyan = centre line, magenta = width. Near end (96,238) -> far cliff (69,114).",
              "The beam bends up-LEFT toward the far cliff (not right). Bottom 80 units are dark: the pad sits there."])
print("ok", os.path.getsize("art/out2/mean/_review.png"))
