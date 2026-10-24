"""Phase 43A: write MINI_ART for Level IV into work/mini/s4.js (<who>_s). Safe to rerun."""
import json
ID = json.load(open("ids43.json")); GEO = json.load(open("art/proc43/geo43.json"))
def R(g): return json.load(open(f"art/out43/{g}/rects.json"))
def entry(key, bgs, top=(), extra=None):
    r = R(key); geo = dict(GEO[key])
    if extra: geo.update(extra(r))
    e = {"atlas": ID[f"{key}-atlas"], "people": ID[f"{key}-people"], "rects": r["rects"], "prects": r.get("prects", {}),
         "pivots": r.get("pivots", {}), "bg": [ID[b] for b in bgs], "geo": geo}
    for k in top: e[k] = geo[k]          # brief names such as MINI_ART.kant.walk (read as kant_s.walk, A4)
    return f"MINI_ART.{key}=" + json.dumps(e, separators=(",", ":"), ensure_ascii=False) + ";"
def measure(r):
    m = r["measure"]; k = .5                                   # 2 px = 1 unit
    x0 = 96 - m["px"][0] * k / 2; y0 = 43
    return {"measure": {"rect": [x0, y0, m["px"][0] * k, m["px"][1] * k], "px": m["px"],
                        "rungsTopDown": [y0 + v * k for v in m["rungsPx"]], "rungsBottomUp": [y0 + v * k for v in m["rungsPx"]][::-1],
                        "dial": [x0 + m["dialPx"][0] * k, y0 + m["dialPx"][1] * k], "railsX": [x0 + v * k for v in m["railsPx"]],
                        "note": "measure drawn at 1:1 (2 px = 1 unit) with its top-left at rect[0..1]; rung 1 = rungsBottomUp[0]; the pointer pivots at dial"}}
s4 = [entry("aquinas_s", ["aquinas-sbg"], ("gaps",)),
      entry("kant_s", ["kant-sbg"], ("walk", "walls")),
      entry("mill_s", ["mill-sbg"], ("nodes",)),
      entry("gilligan_s", ["gilligan-sbg"], (), measure)]
p = "work/mini/s4.js"; s = open(p).read(); a = s.index("/* MINI_ART:BEGIN */"); b = s.index("/* MINI_ART:END */")
head = "/* MINI_ART:BEGIN */\n/* written by tools/l4p5_mini_art.py (Phase 43A): asset ids, atlas rects, people rects and pivots, traced geometry (<who>_s) */\n"
s = s[:a] + head + "\n".join(s4) + "\n" + s[b:]
open(p, "w").write(s); print(p, len(s))
