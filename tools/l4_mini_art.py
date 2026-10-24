"""Write the MINI_ART block for Level IV into work/mini/l4.js (between the MINI_ART markers), from ids4.json + up4/<game>-rects.json.
Units: rects/prects are atlas PIXELS (a 24-px piece covers 12 units); people (prects) are map-scale, shown at 2x.
geo is in stage UNITS (192 x 320), traced in Phase 34A. lights also carries mirror (8 turn frames, 22.5 deg apart, pivot [12,12] px)
and rose (200-px ring canvases, pivot [100,100], cut radii in px; draw at scale 0.65 to sit on the painted window).
Games not yet rebuilt keep their old ending: their plate id waits under platePending (34C moves web and rule)."""
import json, re
ids = json.load(open("ids4.json"))
G = ["lights", "corner", "web", "rule"]
PENDING = set()
def clean(d):
    if isinstance(d, dict): return {k: clean(v) for k, v in d.items() if not k.endswith("note")}
    return d
def entry(g):
    R = json.load(open(f"up4/{g}-rects.json"))
    A = {"atlas": ids[g+"_atlas"]}
    if g+"_people" in ids: A["people"] = ids[g+"_people"]
    A["rects"] = R["rects"]; A["prects"] = R.get("prects", {})
    A["bg"] = [ids[g+"_bg"]]
    A["platePending" if g in PENDING else "plate"] = ids[g+"_plate"]
    A["geo"] = clean(R["geo"])
    if g == "lights": A["mirror"] = R["mirror"]; A["rose"] = R["rose"]
    return f"MINI_ART.{g}=" + json.dumps(A, separators=(",", ":")) + ";"
block = "/* MINI_ART:BEGIN (written by tools/l4_mini_art.py: asset ids, atlas rects, map-scale people, traced geometry, the mirror frames and rose rings) */\n" + \
        "\n".join(entry(g) for g in G) + "\n/* MINI_ART:END */"
p = "work/mini/l4.js"; s = open(p).read()
if "/* MINI_ART:BEGIN" in s: s = re.sub(r"/\* MINI_ART:BEGIN.*?/\* MINI_ART:END \*/", lambda m: block, s, flags=re.S)
else: h = s.split("\n", 1); s = h[0] + "\n" + block + "\n" + h[1]
open(p, "w").write(s); print(len(block), "chars")
