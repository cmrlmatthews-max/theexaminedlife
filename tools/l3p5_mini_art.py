"""Phase 42A: write MINI_ART for Level III into work/mini/f3.js (shared) and work/mini/s3.js (<who>_s), and point
PLATE_THUMBS at the rebuilt thumbnail sheet (shared appended at slot 21)."""
import json
ID = json.load(open("ids42.json")); GEO = json.load(open("art/proc42/geo42.json"))
def R(g): return json.load(open(f"art/out42/{g}/rects.json"))
def entry(key, g, bgs, plate=None, geo=None, top=()):
    r = R(g); e = {"atlas": ID[f"{g}-atlas"], "people": ID[f"{g}-people"], "rects": r["rects"], "prects": r.get("prects", {}),
                   "pivots": r.get("pivots", {}), "bg": [ID[b] for b in bgs]}
    if plate: e["plate"] = ID[plate]
    if geo is not None: e["geo"] = geo
    for k in top: e[k] = geo[k]          # brief names such as MINI_ART.buddha.stream (read as buddha_s.stream, A4)
    return f"MINI_ART.{key}=" + json.dumps(e, separators=(",", ":"), ensure_ascii=False) + ";"
def g(k): return {kk: vv for kk, vv in GEO[k].items() if kk != "bg"}
f3 = [entry("shared", "shared", ["shared-bg", "shared-bg2"], "shared-plate", {"hall": g("shared"), "altar": g("shared2")})]
s3 = [entry("buddha_s", "buddha_s", ["buddha-sbg"], None, g("buddha_s"), ("stream",)),
      entry("laozi_s", "laozi_s", ["laozi-sbg"], None, g("laozi_s"), ("road",)),
      entry("zhuangzi_s", "zhuangzi_s", ["zhuangzi-sbg"], None, g("zhuangzi_s"), ("seams", "knots")),
      entry("confucius_s", "confucius_s", ["confucius-sbg"], None, g("confucius_s")),
      entry("dogen_s", "dogen_s", ["dogen-sbg"], None, g("dogen_s"))]
def put(path, lines, who):
    s = open(path).read(); a = s.index("/* MINI_ART:BEGIN */"); b = s.index("/* MINI_ART:END */")
    head = f"/* MINI_ART:BEGIN */\n/* written by tools/l3p5_mini_art.py (Phase 42A): asset ids, atlas rects, people rects and pivots, traced geometry ({who}) */\n"
    s = s[:a] + head + "\n".join(lines) + "\n" + s[b:]
    open(path, "w").write(s); print(path, len(s))
put("work/mini/f3.js", f3, "shared"); put("work/mini/s3.js", s3, "<who>_s")
p = "work/index.html"; s = open(p).read()
old = 'const PLATE_THUMBS={id:"b7d8ba523adb4af6c5b4cdfc750b2847",w:120,h:200,cols:6,order:["sisyphus","goalkeeper","idols","having","cages","mean","gadfly","yours","thieves","above","lute","water","kitchen","butterfly","lights","corner","web","rule","leap","doors","garden"]};'
if ID["plate-thumbs"] in s: print(p, "PLATE_THUMBS already set"); raise SystemExit
assert s.count(old) == 1
s = s.replace(old, old.replace("b7d8ba523adb4af6c5b4cdfc750b2847", ID["plate-thumbs"]).replace('"garden"]', '"garden","shared"]'))
open(p, "w").write(s); print(p, len(s))
