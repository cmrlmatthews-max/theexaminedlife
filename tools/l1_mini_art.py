"""Write the MINI_ART block for Level I into work/mini/l1.js (between the MINI_ART markers), from ids.json + art/out/<game>/rects.json + traced data."""
import json, re
ids = json.load(open("ids.json"))
R = {g: json.load(open(f"art/out/{g}/rects.json")) for g in ["sisyphus","goalkeeper","idols","having","cages"]}
TRACED = {
 "sisyphus": {"path": [[16,222],[24,190],[34,160],[46,134],[62,112],[82,94],[104,82]]},   # bottom-left up to the summit plateau
 "goalkeeper": {"goal": [66,133,90,49]},                                                  # the goal mouth: posts x 66..156, crossbar y 133, grass line y 182
 "idols": {"plinths": [[32,178],[65,171],[98,174],[133,181],[169,187]]},                  # where an idol's feet rest on each plinth top
 "having": {"gate": [[16,146],[33,145],[50,144]], "dance": [[78,152],[92,152],[112,150],[126,150]], "walk": 234},
 "cages": {"ring": [[96,178],[140,194],[140,226],[96,242],[52,226],[52,194]], "you": [96,210],
           "plaza": [[44,180],[96,174],[148,180],[70,208],[122,208],[44,238],[148,238]],
           "chains": [[0,1],[1,2],[0,3],[1,3],[1,4],[2,4],[3,5],[4,6],[5,6]], "gate": [102,150,.78]},
}
def entry(g, extra):
    A = {"atlas": ids[g+"_atlas"]}
    if g+"_people" in ids: A["people"] = ids[g+"_people"]
    A["rects"] = R[g]["rects"]; A["prects"] = R[g]["prects"]
    A["bg"] = [ids[k] for k in (g+"_bg", g+"_bg2", g+"_bg3") if k in ids]
    if g+"_plate" in ids: A["plate"] = ids[g+"_plate"]
    A.update(extra)
    return f"MINI_ART.{g}=" + json.dumps(A, separators=(",",":")) + ";"
block = "/* MINI_ART:BEGIN (written by tools/l1_mini_art.py: asset ids, atlas rects, map-scale people, and traced geometry in stage units) */\n" + \
        "\n".join(entry(g, TRACED[g]) for g in TRACED) + "\n/* MINI_ART:END */"
p = "work/mini/l1.js"; s = open(p).read()
if "/* MINI_ART:BEGIN" in s:
    s = re.sub(r"/\* MINI_ART:BEGIN.*?/\* MINI_ART:END \*/", lambda m: block, s, flags=re.S)
else:
    head = s.split("\n",1)
    s = head[0] + "\n" + block + "\n" + head[1]
open(p,"w").write(s); print(len(block), "chars")
