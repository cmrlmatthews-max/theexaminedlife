"""Plan 5, Phase 41A: traced geometry of the Level II backdrops (units: 192 x 320, 1 unit = 2 px), read from
art/proc41/grid/*.png. Writes art/proc41/geo41.json and overlay images art/proc41/geo/<key>-geo.png."""
import json, os
from PIL import Image, ImageDraw
P = "art/proc41"; os.makedirs(f"{P}/geo", exist_ok=True)
GEO = {
 "garden": {"bg": "garden-bg", "crop": "bottom of the 9:16 image",
    "rill": {"y": 110, "band": [102, 118]}, "table": [18, 162, 166, 188], "tableTop": 164, "plateY": 176,
    "seats": [32, 64, 96, 128, 160], "bench": [22, 136, 160, 152], "gate": [30, 228], "gateOpening": [14, 212, 48, 240],
    "waitSpots": [[14, 214], [28, 214], [42, 214]], "lamp": [96, 168], "paintedLamps": [[14, 140], [176, 140], [80, 214]],
    "wallBottom": 242, "darkBandFrom": 250},
 "socrates_s": {"bg": "socrates-sbg", "crop": "centre",
    "gate": [26, 86], "gateOpening": [14, 72, 40, 98], "colonnade": [56, 40, 192, 78], "acropolis": [140, 4, 192, 38],
    "square": [64, 98, 160, 250], "housesLeft": [0, 100, 64, 300], "housesRight": [160, 100, 192, 290],
    "paintedLamps": [[72, 120], [140, 120], [60, 148], [144, 148], [52, 198], [150, 198]], "darkBandFrom": 252},
 "aristotle_s": {"bg": "aristotle-sbg", "crop": "centre",
    "colonnade": [0, 0, 192, 52], "colonnadeFloor": 50, "lawn": [20, 52, 168, 260], "path": [86, 52, 106, 270],
    "grotto": [132, 76, 192, 128], "grottoMouth": [166, 110], "treesLeft": [0, 52, 22, 260], "treesRight": [168, 52, 192, 260],
    "target": [96, 104], "darkBandFrom": 262},
 "epicurus_s": {"bg": "epicurus-sbg", "crop": "centre",
    "gate": [18, 212], "gateOpening": [10, 200, 26, 224], "wallLeft": [0, 0, 10, 320], "lamp": [96, 146], "lampFlame": [96, 136],
    "benches": [16, 78, 192, 96], "benchY": 88, "beds": [20, 0, 192, 30], "trees": [20, 34, 192, 70], "gravel": [20, 100, 192, 256],
    "darkBandFrom": 256},
 "seneca_s": {"bg": "seneca-sbg", "crop": "top",
    "bay": [0, 0, 192, 224], "openWater": [40, 30, 152, 224], "rocksLeft": [0, 60, 40, 172], "rocksRight": [152, 66, 192, 182],
    "harborLight": [96, 8], "balustrade": [0, 226, 192, 270], "table": [30, 272, 160, 320], "tableLamp": [66, 270],
    "note": "the brief's voyage boat at y 222 sits on the balustrade top (y 226); the bay ends at y 224"},
 "epictetus_s": {"bg": "epictetus-sbg-v2", "crop": "centre",
    "cliffFace": [122, 80, 192, 270], "cliffTop": 80, "school": [136, 22, 192, 80], "door": [150, 66], "doorBox": [144, 56, 156, 78],
    "ledgeLeft": [0, 192, 52, 270], "ledgeTop": 192, "gapAir": [52, 0, 122, 236], "rubble": [52, 236, 192, 272], "moon": [64, 38],
    "darkBandFrom": 276},
 "marcus_s": {"bg": "marcus-sbg", "crop": "centre",
    "tent": [10, 58, 96, 132], "tentMouth": [64, 118], "clearing": [0, 100, 192, 160], "bankEdge": 162,
    "river": {"band": [164, 256], "lanes": [172, 196, 220]}, "stone": [140, 224], "stoneBox": [124, 216, 156, 232],
    "forest": [0, 0, 192, 58], "nearBank": [0, 258, 192, 320], "paintedLamp": [184, 138]},
}
json.dump(GEO, open(f"{P}/geo41.json", "w"), indent=1)
def box(d, r, c): d.rectangle([r[0] * 2, r[1] * 2, r[2] * 2, r[3] * 2], outline=c, width=2)
def dot(d, p, c): d.ellipse([p[0] * 2 - 5, p[1] * 2 - 5, p[0] * 2 + 5, p[1] * 2 + 5], outline=c, width=3)
for key, g in GEO.items():
    im = Image.open(f"{P}/bg/{g['bg']}.png").convert("RGBA"); d = ImageDraw.Draw(im)
    for k, v in g.items():
        if k in ("bg", "crop", "note"): continue
        if isinstance(v, list) and len(v) == 4 and all(isinstance(t, (int, float)) for t in v): box(d, v, (255, 220, 80, 255))
        elif isinstance(v, list) and len(v) == 2 and all(isinstance(t, (int, float)) for t in v): dot(d, v, (90, 255, 220, 255))
        elif isinstance(v, list) and v and isinstance(v[0], list):
            for p in v: dot(d, p, (255, 140, 200, 255))
        elif isinstance(v, (int, float)) and k not in ("darkBandFrom",): d.line([0, v * 2, 384, v * 2], fill=(255, 255, 255, 200), width=1)
        elif isinstance(v, dict):
            for kk, vv in v.items():
                if kk == "y": d.line([0, vv * 2, 384, vv * 2], fill=(80, 200, 255, 255), width=2)
                if kk == "band": d.rectangle([0, vv[0] * 2, 383, vv[1] * 2], outline=(80, 200, 255, 255), width=2)
                if kk == "lanes":
                    for y in vv: d.line([0, y * 2, 384, y * 2], fill=(255, 255, 255, 255), width=1)
    if "darkBandFrom" in g: d.line([0, g["darkBandFrom"] * 2, 384, g["darkBandFrom"] * 2], fill=(255, 80, 80, 255), width=2)
    im.save(f"{P}/geo/{key}-geo.png")
print("geo", list(GEO))
