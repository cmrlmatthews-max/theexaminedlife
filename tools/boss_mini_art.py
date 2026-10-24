"""Write the MINI_ART block for the four boss rounds into work/mini/boss.js (between the MINI_ART markers), from ids5.json + up5/<game>-rects.json.
Units: rects are atlas PIXELS (a 20-px piece covers 10 units). geo is in stage UNITS (192 x 320), traced in Phase 35A.
Boss rounds have no plate and no people sheet. pivots (b3 spirit/arm, b4 engine/eyes/train) are in PIXELS of their pieces.
b1 also carries lights (the seven light rects in Level I thinker order) and geo.colors (one colour per light)."""
import json, re
ids = json.load(open("ids5.json"))
G = ["boss_b1", "boss_b2", "boss_b3", "boss_b4"]
def clean(d):
    if isinstance(d, dict): return {k: clean(v) for k, v in d.items() if not k.endswith("note")}
    if isinstance(d, list): return [clean(v) for v in d]
    return d
def entry(g):
    R = json.load(open(f"up5/{g}-rects.json"))
    A = {"atlas": ids[g + "_atlas"], "rects": R["rects"], "prects": {}, "bg": [ids[g + "_bg"]], "geo": clean(R["geo"])}
    if "pivots" in R: A["pivots"] = clean(R["pivots"])
    if "lights" in R: A["lights"] = R["lights"]
    return f"MINI_ART.{g}=" + json.dumps(A, separators=(",", ":")) + ";"
block = "/* MINI_ART:BEGIN (written by tools/boss_mini_art.py: asset ids, atlas rects, traced geometry, pivots; boss rounds have no plate) */\n" + \
        "\n".join(entry(g) for g in G) + "\n/* MINI_ART:END */"
p = "work/mini/boss.js"; s = open(p).read()
if "/* MINI_ART:BEGIN" in s: s = re.sub(r"/\* MINI_ART:BEGIN.*?/\* MINI_ART:END \*/", lambda m: block, s, flags=re.S)
else: h = s.split("\n", 1); s = h[0] + "\n" + block + "\n" + h[1]
open(p, "w").write(s); print(len(block), "chars")
