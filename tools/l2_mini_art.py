"""Write the MINI_ART block for Level II into work/mini/l2.js (between the MINI_ART markers), from ids2.json + art/out2/<game>/rects.json + art/out2/geo.json.
Units: rects/prects/rig offsets are atlas PIXELS (a 64-px piece covers 32 units); traced geometry is in stage UNITS (192 x 320)."""
import json, re
ids = json.load(open("ids2.json")); geo = json.load(open("art/out2/geo.json"))
G = ["mean", "gadfly", "yours", "thieves", "above"]
# games not yet rebuilt keep their old ending: their plate id waits under platePending until 32C/32D moves it to plate
PENDING = set()
def entry(g):
    R = json.load(open(f"art/out2/{g}/rects.json"))
    A = {"atlas": ids[g+"_atlas"], "people": ids[g+"_people"], "rects": R["rects"], "prects": R["prects"]}
    A["bg"] = [ids[k] for k in (g+"_bg", g+"_bg1", g+"_bg2", g+"_bg3", g+"_bg4", g+"_bg5") if k in ids]
    A["platePending" if g in PENDING else "plate"] = ids[g+"_plate"]
    if "rig" in R: A["rig"] = R["rig"]
    for k, v in geo.get(g, {}).items():
        if k != "note": A[k] = v
    return f"MINI_ART.{g}=" + json.dumps(A, separators=(",", ":")) + ";"
block = "/* MINI_ART:BEGIN (written by tools/l2_mini_art.py: asset ids, atlas rects, map-scale people, gadfly rig, traced geometry in stage units) */\n" + \
        "\n".join(entry(g) for g in G) + "\n/* MINI_ART:END */"
p = "work/mini/l2.js"; s = open(p).read()
if "/* MINI_ART:BEGIN" in s: s = re.sub(r"/\* MINI_ART:BEGIN.*?/\* MINI_ART:END \*/", lambda m: block, s, flags=re.S)
else: h = s.split("\n", 1); s = h[0] + "\n" + block + "\n" + h[1]
open(p, "w").write(s); print(len(block), "chars")
