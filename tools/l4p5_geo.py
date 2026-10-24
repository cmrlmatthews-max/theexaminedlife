"""Plan 5, Phase 43A: traced geometry for Level IV (units, 192 x 320) -> art/proc43/geo43.json + overlays art/proc43/geo/*.png"""
import json
from PIL import Image, ImageDraw
P = "art/proc43"
G = {}
# ---------------- Aquinas (aquinas-sbg = v3, a new chat)
G["aquinas_s"] = {
    "gaps": [[21, 20, 30, 48], [81, 20, 30, 48], [141, 20, 30, 48]], "gapCenters": [[36, 44], [96, 44], [156, 44]],
    "windows": [[22, 12, 28, 56], [82, 12, 28, 56], [142, 12, 28, 56]],
    "wallLamps": [[63, 46], [127, 46]], "backWall": [0, 0, 192, 92],
    "benchesLeft": [[4, 115, 12, 55], [4, 175, 12, 55]], "benchesRight": [[176, 115, 12, 55], [176, 175, 12, 55]],
    "floor": [20, 92, 152, 164], "floorPanel": [48, 125, 96, 100], "darkBandFrom": 268,
    "suggest": {"classmates": [[10, 150], [10, 206], [182, 150], [182, 206]], "lectern": [96, 196], "aquinas": [96, 178],
                "desk": [96, 176], "albert": [128, 180]},
    "note": "the three arches are the painted windows of the back wall; their centers are x 36 / 96 / 156 (brief 44 / 96 / 148), y 44 as briefed. "
            "Classmates sit on the painted side benches (x 10 and 182; brief x 26 and 166)."}
# ---------------- Kant
kant_walls = [  # buildings and the church (blocked), [x, y, w, h]
    [0, 0, 84, 76], [108, 0, 84, 76], [82, 70, 32, 76], [0, 128, 10, 50],
    [40, 180, 46, 34], [40, 222, 46, 40], [106, 180, 42, 34], [106, 222, 42, 40],
    [162, 136, 30, 22], [158, 240, 34, 22]]
kant_water = [  # the river and the harbor (blocked; the river edge stumbles too)
    [0, 96, 10, 32], [30, 96, 32, 28], [62, 96, 66, 4], [128, 96, 34, 28], [184, 96, 8, 32],
    [30, 138, 32, 38], [62, 162, 26, 14], [104, 162, 46, 14], [128, 138, 22, 24], [150, 138, 12, 44], [162, 158, 30, 82]]
G["kant_s"] = {
    "walls": kant_walls, "water": kant_water,
    "bridges": {"leftQuay": [10, 96, 20, 82], "leftBridge": [30, 124, 32, 14], "rightBridge": [128, 124, 34, 14],
                "rightQuay": [162, 96, 22, 40], "southBridge": [88, 162, 16, 14]},
    "island": [62, 100, 66, 62],
    "landmarks": {"university": [44, 82], "castle": [148, 80], "church": [96, 152], "bookshop": [22, 156], "harbor": [155, 205]},
    "icons": {"bookshop": [8, 150], "note": "the university, castle, church, harbor and ships are painted; draw only their gold rings. The bookshop is not painted: draw kant-ss bookshop at icons.bookshop (over the small houses at the left edge)."},
    "loop": [38, 175, 96, 218], "loopLap": 202, "loopStart": [67, 218],
    "walk": [[44, 86], [20, 86], [20, 131], [72, 131], [72, 152], [96, 152], [96, 176], [36, 176], [36, 236]],
    "autoPath": [[67, 218], [38, 218], [38, 176], [20, 176], [20, 156], [20, 96], [20, 86], [44, 86], [20, 86], [20, 131], [70, 131],
                 [70, 152], [96, 152], [122, 152], [122, 131], [172, 131], [172, 88], [148, 86], [172, 88], [172, 131], [122, 131],
                 [122, 152], [96, 152], [96, 176], [96, 218], [152, 218], [155, 205]],
    "streets": {"north": [0, 78, 192, 18], "centerNorth": [86, 0, 20, 80], "southBank": [10, 174, 152, 6], "avenue": [86, 176, 20, 86],
                "square": [80, 205, 30, 17], "cross": [36, 214, 114, 8], "leftLane": [36, 176, 4, 86], "quayStreet": [148, 182, 14, 80],
                "lindens": [0, 178, 36, 80], "bottom": [0, 262, 192, 10]},
    "darkBandFrom": 274,
    "note": "kant-sbg: the river is a north channel (y 96-124) and a south channel (y 138-176) around the island (x 62-128, y 100-162); "
            "the north channel is crossed by the two stone quays at the edges, the south channel by the center bridge and the left quay. "
            "The walk route goes north to south and ends in the linden avenue."}
# ---------------- Mill
xs = [22, 57, 96, 135, 169]; ys = [47, 87, 139, 172, 207, 246]
G["mill_s"] = {"nodes": [[x, y] for y in ys for x in xs], "nodeOrder": "row-major r0c0..r0c4, r1c0.., i.e. index = r*5 + c (c0-c4 = x, r0-r5 = y)",
               "cols": xs, "rows": ys, "depot": [96, 246], "square": [96, 139],
               "hills": [0, 0, 192, 40], "lake": [52, 14, 134, 30], "town": [0, 40, 192, 250],
               "note": "mill-sbg-sq: the town rows of the Gemini art (y 40-292) are squashed into y 40-250 so corner row r5 stays out of the pad zone. "
                       "The plan's grid order 'c0r0...c4r5' is given here as cols/rows; nodes[] is row-major."}
# ---------------- Gilligan (the Weaver)
G["gilligan_s"] = {
    "loom": [66, 32, 62, 80], "loomCenter": [96, 72], "backWall": [0, 0, 192, 98], "floor": [0, 98, 192, 84],
    "tables": [[16, 133], [176, 133]], "tableTops": [[2, 125, 28, 17], [162, 125, 30, 17]],
    "chairs": {"left": [[16, 116], [16, 152]], "right": [[178, 116], [178, 152]]},
    "counterTop": [5, 183, 155, 14], "counterFront": [5, 197, 155, 16], "counterTopY": 186,
    "shelves": [33, 222, 125, 38], "shelfBays": [[33, 222, 31, 38], [64, 222, 32, 38], [96, 222, 31, 38], [127, 222, 31, 38]],
    "hangingLantern": [180, 196], "darkBandFrom": 264,
    "suggest": {"weaver": [96, 220], "visitorStop": [96, 176], "bubbles": [[60, 134], [96, 118], [132, 134]], "spool": [150, 160],
                "shelfY": 236, "townsfolk": [[16, 116], [16, 152], [178, 116], [178, 152]], "measure": [61, 36, 70, 170]},
    "note": "the counter runs across y 183-213 with the shelves behind it (nearer the viewer, y 222-260): the Weaver stands between them, "
            "facing up; visitors come down the open floor from the top left and stop above the counter (brief: Weaver (96,196), visitor (96,112)). "
            "The two tables are at the sides of the floor (y 133), not at the bottom (brief (26,280), (166,280))."}
json.dump(G, open(f"{P}/geo43.json", "w"), indent=1)

def overlay(name, bg, fn):
    im = Image.open(f"{P}/bg/{bg}.png").convert("RGBA").resize((768, 1280), Image.NEAREST)
    ov = Image.new("RGBA", im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    fn(d, lambda v: v * 4); im.alpha_composite(ov); im.convert("RGB").save(f"{P}/geo/{name}.png")

def kant(d, s):
    k = G["kant_s"]
    for x, y, w, h in k["walls"]: d.rectangle([s(x), s(y), s(x + w), s(y + h)], fill=(255, 60, 60, 70), outline=(255, 60, 60, 220))
    for x, y, w, h in k["water"]: d.rectangle([s(x), s(y), s(x + w), s(y + h)], fill=(60, 120, 255, 70), outline=(60, 160, 255, 220))
    for n, (x, y) in k["landmarks"].items(): d.ellipse([s(x - 14), s(y - 14), s(x + 14), s(y + 14)], outline=(255, 215, 0, 255), width=3); d.text((s(x) - 20, s(y)), n, fill=(255, 255, 0, 255))
    x0, y0, x1, y1 = k["loop"]; d.rectangle([s(x0), s(y0), s(x1), s(y1)], outline=(255, 120, 255, 255), width=3)
    d.line([(s(x), s(y)) for x, y in k["walk"]], fill=(0, 255, 120, 255), width=4)
    d.line([(s(x), s(y)) for x, y in k["autoPath"]], fill=(255, 255, 255, 160), width=2)
overlay("kant_s-geo", "kant-sbg", kant)

def aq(d, s):
    a = G["aquinas_s"]
    for x, y, w, h in a["gaps"]: d.rectangle([s(x), s(y), s(x + w), s(y + h)], outline=(255, 215, 0, 255), width=3)
    for x, y in a["suggest"]["classmates"]: d.ellipse([s(x) - 6, s(y) - 6, s(x) + 6, s(y) + 6], fill=(255, 80, 80, 220))
    for k in ("lectern", "aquinas", "albert"):
        x, y = a["suggest"][k]; d.ellipse([s(x) - 6, s(y) - 6, s(x) + 6, s(y) + 6], fill=(80, 255, 120, 220)); d.text((s(x) + 8, s(y)), k, fill=(255, 255, 255, 255))
    d.ellipse([s(96 - 54), s(190 - 54), s(96 + 54), s(190 + 54)], outline=(160, 200, 255, 200), width=2)
overlay("aquinas_s-geo", "aquinas-sbg", aq)

def gil(d, s):
    g = G["gilligan_s"]
    for k in ("counterTop", "counterFront", "shelves", "loom"):
        x, y, w, h = g[k]; d.rectangle([s(x), s(y), s(x + w), s(y + h)], outline=(255, 215, 0, 255), width=2)
    for x, y in g["tables"]: d.ellipse([s(x) - 8, s(y) - 8, s(x) + 8, s(y) + 8], outline=(0, 255, 255, 255), width=3)
    sg = g["suggest"]
    for k in ("weaver", "visitorStop", "spool"):
        x, y = sg[k]; d.ellipse([s(x) - 7, s(y) - 7, s(x) + 7, s(y) + 7], fill=(80, 255, 120, 220)); d.text((s(x) + 9, s(y)), k, fill=(255, 255, 255, 255))
    for x, y in sg["townsfolk"]: d.ellipse([s(x) - 6, s(y) - 6, s(x) + 6, s(y) + 6], fill=(255, 80, 80, 220))
    for x in (18, 44, 70, 96, 122, 148, 174): d.rectangle([s(x - 12), s(sg["shelfY"] - 12), s(x + 12), s(sg["shelfY"] + 12)], outline=(255, 150, 60, 255), width=2)
    x, y, w, h = sg["measure"]; d.rectangle([s(x), s(y), s(x + w), s(y + h)], outline=(200, 160, 255, 200), width=2)
overlay("gilligan_s-geo", "gilligan-sbg", gil)

def mill(d, s):
    m = G["mill_s"]
    for i, (x, y) in enumerate(m["nodes"]): d.ellipse([s(x) - 8, s(y) - 8, s(x) + 8, s(y) + 8], outline=(255, 230, 0, 255), width=3); d.text((s(x) + 10, s(y) - 6), f"c{i % 5}r{i // 5}", fill=(255, 255, 0, 255))
    d.line([(0, s(250)), (768, s(250))], fill=(255, 0, 0, 255), width=2)
overlay("mill_s-geo", "mill-sbg", mill)
print("ok")
