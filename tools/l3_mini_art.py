"""Write the MINI_ART block for Level III into work/mini/l3.js (between the MINI_ART markers), from ids3.json + up3/<game>-rects.json + up3/geo3.json.
Units: rects/prects are atlas PIXELS (a 64-px piece covers 32 units); MINI_ART.lute.vina is in vina PIXELS (draw the vina at half scale);
lamps and water geometry are in stage UNITS (192 x 320). Games not yet rebuilt keep their old ending: their plate id waits under platePending (33C moves it)."""
import json, re
ids = json.load(open("ids3.json")); geo = json.load(open("up3/geo3.json"))
G = ["lute", "water", "kitchen", "butterfly"]
PENDING = set()
def entry(g):
    R = json.load(open(f"up3/{g}-rects.json"))
    A = {"atlas": ids[g+"_atlas"]}
    if g+"_people" in ids: A["people"] = ids[g+"_people"]
    A["rects"] = R["rects"]; A["prects"] = R.get("prects", {})
    A["bg"] = [ids[k] for k in (g+"_bg", g+"_bg2", g+"_bg3") if k in ids]
    A["platePending" if g in PENDING else "plate"] = ids[g+"_plate"]
    if g == "lute":
        A["vina"] = R["vina"]; A["lamps"] = R["lamps"]
    if g == "water":
        A["geo"] = {k: v for k, v in geo["water"].items() if k != "note"}
    return f"MINI_ART.{g}=" + json.dumps(A, separators=(",", ":")) + ";"
block = "/* MINI_ART:BEGIN (written by tools/l3_mini_art.py: asset ids, atlas rects, map-scale people, the vina rig and lamps, water geometry) */\n" + \
        "\n".join(entry(g) for g in G) + "\n/* MINI_ART:END */"
p = "work/mini/l3.js"; s = open(p).read()
if "/* MINI_ART:BEGIN" in s: s = re.sub(r"/\* MINI_ART:BEGIN.*?/\* MINI_ART:END \*/", lambda m: block, s, flags=re.S)
else: h = s.split("\n", 1); s = h[0] + "\n" + block + "\n" + h[1]
open(p, "w").write(s); print(len(block), "chars")
