"""Splice the rebuilt Level III games from work_src/l3/<id>.js into work/mini/l3.js, in place of their old (Phase 23) blocks.
Everything else in l3.js (the MINI_ART block, the games not yet rebuilt) stays byte-for-byte as it is.
Each rebuilt game sits between  /* GAME:<id>:BEGIN */  and  /* GAME:<id>:END */  markers, so the builder can be run again and again.
The first run finds a game's old block by its Phase 23 header comment. 33C adds "kitchen" and "butterfly" to PARTS."""
import os, re, subprocess, sys
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
# id -> the title in the Phase 23 header comment ("/* ---- Level III (Phase 23A): <title>" or "(Phase 23B): <title>")
PARTS = {"lute": "Tune the Lute", "water": "Be Water", "kitchen": "The Tenzo's Kitchen", "butterfly": "Butterfly Dream"}
OLD = re.compile(r"/\* ---- Level III \(Phase 23[AB]\): ")
P = "work/mini/l3.js"
s = open(P).read()
for gid, title in PARTS.items():
    f = f"work_src/l3/{gid}.js"
    if not os.path.exists(f):
        continue
    new = open(f).read().rstrip() + "\n"
    blk = f"/* GAME:{gid}:BEGIN */\n{new}/* GAME:{gid}:END */"
    mk = re.compile(r"/\* GAME:%s:BEGIN \*/.*?/\* GAME:%s:END \*/" % (gid, gid), re.S)
    if mk.search(s):
        s = mk.sub(lambda m: blk, s, count=1)
    else:
        m = re.search(OLD.pattern + re.escape(title), s)
        a = m.start()
        nx = OLD.search(s, a + 10)
        b = nx.start() if nx else s.index("MINI_LOADED.l3=true;")
        s = s[:a] + blk + "\n\n" + s[b:]
open(P, "w").write(s)
r = subprocess.run(["node", "--check", P], capture_output=True, text=True)
print("l3.js", os.path.getsize(P) // 1024, "KB", "syntax OK" if r.returncode == 0 else r.stderr[:800])
sys.exit(r.returncode)
