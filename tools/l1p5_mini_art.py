"""Phase 40A: write MINI_ART for Level I into work/mini/f1.js (leap, doors) and work/mini/s1.js (<who>_s), and point
PLATE_THUMBS at the rebuilt thumbnail sheet (leap, doors appended)."""
import json, re
ID = json.load(open("ids40.json")); GEO = json.load(open("art/proc40/geo40.json"))
def R(g): return json.load(open(f"art/out40/{g}/rects.json"))
def entry(key, g, bgs, plate=None, geo=None, extra=None):
    r = R(g); e = {"atlas": ID[f"{g}-atlas"], "people": ID[f"{g}-people"], "rects": r["rects"], "prects": r.get("prects", {}),
                   "pivots": r.get("pivots", {}), "bg": [ID[b] for b in bgs]}
    if plate: e["plate"] = ID[plate]
    if geo is not None: e["geo"] = geo
    if "ov" in r: e["ov"] = r["ov"]
    if extra: e.update(extra)
    return f"MINI_ART.{key}=" + json.dumps(e, separators=(",", ":")) + ";"
lr = R("leap")
f1 = [entry("leap", "leap", ["leap-bg", "leap-bg2"], "leap-plate",
            {"stackTop": lr["stackTop"], "headTop": lr["headTop"], "topsPx": lr["topsPx"], "bg1": GEO["leap"], "bg2": GEO["leap2"]}),
      entry("doors", "doors", ["doors-bg"], "doors-plate", dict(GEO["doors"], fixedBackdrop=True))]
s1 = [entry(f"{w}_s", f"{w}_s", [f"{w}-sbg"], None, GEO[f"{w}_s"]) for w in ["kierkegaard", "nietzsche", "camus", "sartre", "beauvoir", "fromm"]]
def put(path, lines, who):
    s = open(path).read(); a = s.index("/* MINI_ART:BEGIN */"); b = s.index("/* MINI_ART:END */")
    head = f"/* MINI_ART:BEGIN */\n/* written by tools/l1p5_mini_art.py (Phase 40A): asset ids, atlas rects, people rects and pivots, traced geometry ({who}) */\n"
    s = s[:a] + head + "\n".join(lines) + "\n" + s[b:]
    open(path, "w").write(s); print(path, len(s))
put("work/mini/f1.js", f1, "leap, doors"); put("work/mini/s1.js", s1, "<who>_s")
p = "work/index.html"; s = open(p).read()
old = 'const PLATE_THUMBS={id:"c32343e2c13d7c59572b0b9b402917cf",w:120,h:200,cols:6,order:["sisyphus","goalkeeper","idols","having","cages","mean","gadfly","yours","thieves","above","lute","water","kitchen","butterfly","lights","corner","web","rule"]};'
assert s.count(old) == 1
s = s.replace(old, old.replace("c32343e2c13d7c59572b0b9b402917cf", ID["plate-thumbs"]).replace('"rule"]', '"rule","leap","doors"]'))
open(p, "w").write(s); print(p, len(s))
