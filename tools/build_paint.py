"""Plan 6 (Phase 47): join the PAINT toolkit parts mini/paint/NN-*.js in name order into mini/paint.js.
Usage: python3 tools/build_paint.py   (run from the repo root). Prints the size of each part and of the result."""
import glob, os, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
parts = sorted(glob.glob(os.path.join(root, "mini", "paint", "[0-9][0-9]-*.js")))
out = ["/* mini/paint.js — the PAINT toolkit for painted games (Plan 6). Built by tools/build_paint.py from mini/paint/*.js; do not edit by hand. */"]
for p in parts:
    src = open(p, encoding="utf-8").read()
    out.append(f"/* ==== {os.path.basename(p)} ==== */\n" + src.rstrip() + "\n")
    print(f"{os.path.basename(p):24s} {len(src.encode()):>8,} B")
txt = "\n".join(out)
open(os.path.join(root, "mini", "paint.js"), "w", encoding="utf-8").write(txt)
print(f"{'mini/paint.js':24s} {len(txt.encode()):>8,} B")
