"""Splice the rebuilt Level IV games from work_src/l4/<id>.js into work/mini/l4.js, in place of their old (Phase 24) blocks.
Everything else in l4.js (the MINI_ART block, written by tools/l4_mini_art.py) stays byte-for-byte as it is. Phase 34B rebuilt lights and corner, Phase 34C web and rule.
Each rebuilt game sits between  /* GAME:<id>:BEGIN */  and  /* GAME:<id>:END */  markers, so the builder can be run again and again.
The first run finds a game's old block by its Phase 24 header comment (the last one, `rule`, ends at MINI_LOADED.l4=true;)."""
import os, re, subprocess, sys
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
# id -> the title in the Phase 24 header comment ("/* ---- Level IV (Phase 24A): <title>" or "(Phase 24B): <title>")
PARTS = {"lights": "Two Lights, One Window", "corner": "Speakers' Corner", "web": "The Web", "rule": "If Everyone Did It"}
OLD = re.compile(r"/\* ---- Level IV \(Phase 24[AB]\): ")
P = "work/mini/l4.js"
s = open(P).read()
for gid, title in PARTS.items():
    f = f"work_src/l4/{gid}.js"
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
        b = nx.start() if nx else s.index("MINI_LOADED.l4=true;")
        s = s[:a] + blk + "\n\n" + s[b:]
open(P, "w").write(s)
r = subprocess.run(["node", "--check", P], capture_output=True, text=True)
print("l4.js", round(os.path.getsize(P) / 1024, 1), "KB", "syntax OK" if r.returncode == 0 else r.stderr[:800])
sys.exit(r.returncode)
