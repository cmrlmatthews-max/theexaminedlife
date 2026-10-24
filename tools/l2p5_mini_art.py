"""Phase 41A: write MINI_ART for Level II into work/mini/f2.js (garden) and work/mini/s2.js (<who>_s), and point
PLATE_THUMBS at the rebuilt thumbnail sheet (garden appended)."""
import json
ID = json.load(open("ids41.json")); GEO = json.load(open("art/proc41/geo41.json"))
def R(g): return json.load(open(f"art/out41/{g}/rects.json"))
def entry(key, g, bgs, plate=None, geo=None):
    r = R(g); e = {"atlas": ID[f"{g}-atlas"], "people": ID[f"{g}-people"], "rects": r["rects"], "prects": r.get("prects", {}),
                   "pivots": r.get("pivots", {}), "bg": [ID[b] for b in bgs]}
    if plate: e["plate"] = ID[plate]
    if geo is not None: e["geo"] = {k: v for k, v in geo.items() if k not in ("bg",)}
    return f"MINI_ART.{key}=" + json.dumps(e, separators=(",", ":"), ensure_ascii=False) + ";"
f2 = [entry("garden", "garden", ["garden-bg"], "garden-plate", GEO["garden"])]
s2 = [entry(f"{w}_s", f"{w}_s", [f"{w}-sbg"], None, GEO[f"{w}_s"]) for w in ["socrates", "aristotle", "epicurus", "seneca", "epictetus", "marcus"]]
def put(path, lines, who):
    s = open(path).read(); a = s.index("/* MINI_ART:BEGIN */"); b = s.index("/* MINI_ART:END */")
    head = f"/* MINI_ART:BEGIN */\n/* written by tools/l2p5_mini_art.py (Phase 41A): asset ids, atlas rects, people rects and pivots, traced geometry ({who}) */\n"
    s = s[:a] + head + "\n".join(lines) + "\n" + s[b:]
    open(path, "w").write(s); print(path, len(s))
put("work/mini/f2.js", f2, "garden"); put("work/mini/s2.js", s2, "<who>_s")
p = "work/index.html"; s = open(p).read()
old = 'const PLATE_THUMBS={id:"cca81df9cc107d1b5ebb0bda62d100ac",w:120,h:200,cols:6,order:["sisyphus","goalkeeper","idols","having","cages","mean","gadfly","yours","thieves","above","lute","water","kitchen","butterfly","lights","corner","web","rule","leap","doors"]};'
assert s.count(old) == 1
s = s.replace(old, old.replace("cca81df9cc107d1b5ebb0bda62d100ac", ID["plate-thumbs"]).replace('"doors"]', '"doors","garden"]'))
open(p, "w").write(s); print(p, len(s))
