"""Plan 5, Phase 42A: traced geometry of the Level III backdrops (units 192 x 320, 1 unit = 2 px), read from
art/proc42/bg/*.png at 4x with an 8-unit grid (tools/gridview42.py). Writes art/proc42/geo42.json and overlays art/proc42/geo/*.png."""
import json, os
from PIL import Image, ImageDraw
P = "art/proc42"; os.makedirs(f"{P}/geo", exist_ok=True)
OX = [16, 70]   # the ox scroll's top-left in units when drawn 160 x 120 centered at (96,130) (the brief's place)
SEAMS_LOCAL = {  # scroll-local units (the 320 x 240 px piece at 2 px per unit)
    "neck": [[56, 26], [54, 40], [46, 56]],
    "shoulder": [[58, 30], [64, 46], [62, 66]],
    "back": [[62, 32], [80, 34], [100, 34], [116, 36]],
    "hip": [[116, 36], [110, 52], [112, 68]],
    "foreleg": [[62, 66], [60, 80], [60, 98]],
    "hindleg": [[112, 68], [108, 82], [112, 98]],
}
KNOTS_LOCAL = [[58, 29], [62, 66], [116, 36], [112, 68]]
def world(p): return [p[0] + OX[0], p[1] + OX[1]]
GEO = {
 "shared": {"bg": "shared-bg", "crop": "centre",
    "backWall": [0, 0, 192, 60], "cabinetsLeft": [30, 0, 64, 60], "screen": [68, 6, 142, 62], "cabinetsRight": [146, 0, 192, 60],
    "window": [12, 62], "windowBox": [0, 20, 18, 110], "lamp": [174, 50], "lampBox": [166, 40, 182, 98],
    "plumPot": [20, 212], "plumBox": [0, 150, 58, 226], "floor": [18, 60, 192, 228],
    "door": [96, 236], "doorFrame": [60, 200, 132, 256], "doorOpening": [78, 212, 114, 256], "wallBottom": [0, 228, 192, 256],
    "darkBandFrom": 256,
    "note": "the brief's places fit: table (96,128), seats, bench y 212, side table y 36 (in front of the cabinets), door (96,238), window (24,60), lamp (170,52)"},
 "shared2": {"bg": "shared-bg2", "crop": "centre (after the band cut, see the handoff)",
    "niche": [76, 16, 116, 62], "nicheOpening": [82, 22, 110, 56], "tabletBase": [96, 56],
    "lanterns": [[48, 42], [144, 42]], "altar": [10, 98, 182, 170], "altarTop": 99, "altarFront": [96, 104],
    "floor": [0, 162, 192, 320], "floorFrom": 162,
    "suggest": {"outlinesY": 99, "outlinesX": [44, 76, 116, 148], "incense": [96, 102], "bowRows": [184, 210, 236], "rowX": [76, 116], "tray": [96, 200], "trayNote": "the empty tray fades out after the incense, before the bow line", "confucius": [170, 200]},
    "note": "the altar top is at y 99 (brief 90); the floor starts at y 162, so the brief's bow rows (136/164/192) would stand under the altar"},
 "buddha_s": {"bg": "buddha-sbg", "crop": "centre",
    "tree": [40, 0, 152, 64], "seat": [96, 88], "seatBox": [84, 84, 110, 94], "island": [40, 76, 152, 104],
    "stream": [[150, 92], [128, 104], [104, 112], [84, 124], [80, 138], [96, 148], [118, 160], [125, 176], [118, 188], [100, 200],
               [88, 214], [88, 232], [88, 256], [88, 300]],
    "streamWidth": 44, "path": [[60, 108], [46, 132], [44, 160], [40, 190], [30, 220], [26, 260]],
    "villageRoofs": [[10, 44], [182, 40]], "rocksLeft": [0, 160, 40, 240],
    "suggest": {"buddha": [96, 86], "leafRest": [104, 114], "grove": [70, 92], "grandGate": [150, 58]},
    "darkBandFrom": 250,
    "note": "the tree fills the top (y 0-64); the stream starts at the pond ring right of the island (y ~92), not at y 22"},
 "laozi_s": {"bg": "laozi-sbg", "crop": "centre",
    "gateTower": [72, 30, 120, 88], "gate": [96, 80], "gateOpening": [90, 70, 103, 84],
    "road": [[96, 300], [96, 256], [97, 240], [104, 224], [117, 208], [126, 196], [116, 184], [98, 172], [72, 164], [56, 156],
             [49, 148], [50, 140], [62, 130], [76, 125], [90, 118], [94, 104], [96, 88]],
    "roadWidth": 20, "gatehouse": [146, 136, 192, 200], "writingTable": [166, 182], "stoneLantern": [112, 88],
    "postLantern": [84, 92], "pineLeft": [16, 156, 76, 236], "pineRight": [112, 100, 168, 150],
    "suggest": {"laozi": [160, 196], "yinxi": [180, 186], "bundle": [176, 100]},
    "darkBandFrom": 252, "note": "the road is about 18-24 units wide (brief 30)"},
 "zhuangzi_s": {"bg": "zhuangzi-sbg", "crop": "centre",
    "pavilion": [32, 30, 160, 148], "pavilionFloor": [50, 100, 144, 148], "table": [96, 124], "tableBox": [70, 114, 122, 136],
    "steps": [96, 154], "ground": [0, 158, 150, 250], "pond": [150, 112, 192, 260], "bridge": [176, 200], "willow": [0, 0, 70, 130],
    "lanterns": [[40, 106], [150, 106], [18, 160], [176, 86], [148, 236]],
    "scroll": [96, 130], "scrollBox": [16, 70, 176, 190],
    "seams": {k: [world(p) for p in v] for k, v in SEAMS_LOCAL.items()}, "knots": [world(p) for p in KNOTS_LOCAL], "knotR": 8,
    "seamsLocal": SEAMS_LOCAL, "knotsLocal": KNOTS_LOCAL,
    "suggest": {"cookDing": [24, 176], "zhuangzi": [64, 178], "pot": [104, 172], "emblems": [96, 54]},
    "darkBandFrom": 252},
 "confucius_s": {"bg": "confucius-sbg", "crop": "centre",
    "veranda": [0, 0, 192, 84], "verandaEdge": 80, "steps": [96, 84], "lanterns": [[32, 30], [74, 30], [117, 30], [159, 30]],
    "verandaTables": [[46, 60], [96, 60], [144, 60]], "apricot": [0, 30, 56, 110], "courtyard": [4, 90, 158, 222],
    "buildingRight": [158, 100, 192, 222], "sideLantern": [160, 130], "plants": [[156, 92], [164, 180], [186, 200]],
    "darkBandFrom": 224, "note": "the brief's places fit: students rows y 104/156 at x 36-156, slip table (96,214), zither (96,206)"},
 "dogen_s": {"bg": "dogen-sbg", "crop": "centre",
    "roof": [0, 0, 192, 18], "view": [0, 18, 192, 150], "harbor": [100, 62], "mountainPath": [[100, 68], [96, 90], [106, 112], [120, 136]],
    "railing": [0, 148, 192, 170], "railTop": 150, "lanterns": [[28, 140], [164, 140]], "floor": [0, 170, 192, 320], "floorFrom": 170,
    "suggest": {"cushion": [96, 196], "incense": [132, 198], "sitZone": [140, 270]},
    "note": "dogen-sbg v3: the railing is at y 148-170 and the floor starts at y 170, so the brief's cushion (96,176) sits on the floor edge"},
}
json.dump(GEO, open(f"{P}/geo42.json", "w"), indent=1)
def box(d, r, c): d.rectangle([r[0] * 2, r[1] * 2, r[2] * 2, r[3] * 2], outline=c, width=2)
def dot(d, p, c, r=5): d.ellipse([p[0] * 2 - r, p[1] * 2 - r, p[0] * 2 + r, p[1] * 2 + r], outline=c, width=3)
def line(d, pts, c, w=3): d.line([(p[0] * 2, p[1] * 2) for p in pts], fill=c, width=w)
def draw(g, d):
    for k, v in g.items():
        if k in ("bg", "crop", "note", "seamsLocal", "knotsLocal"): continue
        if k in ("stream", "road", "path", "mountainPath"): line(d, v, (80, 220, 255, 255)); continue
        if k == "seams":
            for pts in v.values(): line(d, pts, (255, 200, 40, 255))
            continue
        if k == "knots":
            for p in v: dot(d, p, (255, 80, 80, 255), 16)
            continue
        if k == "suggest":
            for kk, vv in v.items():
                if isinstance(vv, list) and len(vv) == 2 and all(isinstance(t, (int, float)) for t in vv): dot(d, vv, (120, 255, 120, 255), 7)
            continue
        if isinstance(v, list) and len(v) == 4 and all(isinstance(t, (int, float)) for t in v): box(d, v, (255, 220, 80, 255))
        elif isinstance(v, list) and len(v) == 2 and all(isinstance(t, (int, float)) for t in v): dot(d, v, (90, 255, 220, 255))
        elif isinstance(v, list) and v and isinstance(v[0], list):
            for p in v: dot(d, p, (255, 140, 200, 255))
        elif isinstance(v, (int, float)) and k not in ("darkBandFrom", "streamWidth", "roadWidth", "knotR"):
            d.line([0, v * 2, 384, v * 2], fill=(255, 255, 255, 200), width=1)
    if "darkBandFrom" in g: d.line([0, g["darkBandFrom"] * 2, 384, g["darkBandFrom"] * 2], fill=(255, 80, 80, 255), width=2)
for key, g in GEO.items():
    im = Image.open(f"{P}/bg/{g['bg']}.png").convert("RGBA"); draw(g, ImageDraw.Draw(im))
    im.save(f"{P}/geo/{key}-geo.png")
# the seams on the ox scroll alone (4x)
r = json.load(open("art/out42/zhuangzi_s/rects.json"))["rects"]["ox_scroll"]
sc = Image.open("art/out42/zhuangzi_s/atlas.png").convert("RGBA").crop((r[0], r[1], r[0] + r[2], r[1] + r[3])).resize((r[2] * 2, r[3] * 2), Image.NEAREST)
d = ImageDraw.Draw(sc)
for pts in SEAMS_LOCAL.values(): d.line([(p[0] * 4, p[1] * 4) for p in pts], fill=(230, 170, 30, 255), width=4)
for p in KNOTS_LOCAL: d.ellipse([p[0] * 4 - 32, p[1] * 4 - 32, p[0] * 4 + 32, p[1] * 4 + 32], outline=(220, 60, 60, 255), width=3)
sc.save(f"{P}/geo/zhuangzi-seams.png")
print("geo", list(GEO))
