"""Phase 36: rebuild work/mini/l1.js from work_src/l1/*.js and KEEP its existing MINI_ART block
(tools/build_l1.py regenerates MINI_ART from art/out/, which is not in the workspace snapshot)."""
import os, re, subprocess
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
P = "work/mini/l1.js"
s = open(P).read()
m = re.search(r"/\* MINI_ART:BEGIN.*?/\* MINI_ART:END \*/", s, re.S)
parts = ["sisyphus","goalkeeper","idols","cages"]  # Phase 45B: Having or Being removed (its source stays in work_src/l1/having.js)
head = s[:m.start()].rstrip("\n")
out = [head, m.group(0)]
for p in parts:
    out.append(open(f"work_src/l1/{p}.js").read().rstrip())
out.append("MINI_LOADED.l1=true;\n")
open(P, "w").write("\n".join(out))
r = subprocess.run(["node", "--check", P], capture_output=True, text=True)
print("l1.js", os.path.getsize(P), "B", "syntax OK" if r.returncode == 0 else r.stderr[:800])
