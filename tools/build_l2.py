"""Splice the rebuilt Level II games from work_src/l2/<id>.js into work/mini/l2.js, in place of their old (Phase 22) blocks.
Everything else in l2.js (the MINI_ART block, the games not yet rebuilt) stays byte-for-byte as it is.
Each rebuilt game sits between  /* GAME:<id>:BEGIN */  and  /* GAME:<id>:END */  markers, so the builder can be run again and again.
The first run finds a game's old block by its Phase 22 header comment. 32C and 32D add "yours", "thieves" and "above" to PARTS."""
import os, re, subprocess, sys
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
# id -> the title in the Phase 22 header comment ("/* ---- Level II (Phase 22): <title>")
PARTS = {"mean": "The Golden Mean", "gadfly": "The Gadfly", "yours": "Only What's Yours", "thieves": "Time Thieves", "above": "The View from Above"}
OLD_HDR = "/* ---- Level II (Phase 22): "
P = "work/mini/l2.js"
s = open(P).read()
for gid, title in PARTS.items():
    f = f"work_src/l2/{gid}.js"
    if not os.path.exists(f):
        continue
    new = open(f).read().rstrip() + "\n"
    blk = f"/* GAME:{gid}:BEGIN */\n{new}/* GAME:{gid}:END */"
    mk = re.compile(r"/\* GAME:%s:BEGIN \*/.*?/\* GAME:%s:END \*/" % (gid, gid), re.S)
    if mk.search(s):
        s = mk.sub(lambda m: blk, s, count=1)
    else:
        a = s.index(OLD_HDR + title)
        nxt = s.find(OLD_HDR, a + 10)               # the next old game's header (or the closing line)
        b = nxt if nxt >= 0 else s.index("MINI_LOADED.l2=true;")
        s = s[:a] + blk + "\n\n" + s[b:]
open(P, "w").write(s)
r = subprocess.run(["node", "--check", P], capture_output=True, text=True)
print("l2.js", os.path.getsize(P) // 1024, "KB", "syntax OK" if r.returncode == 0 else r.stderr[:800])
sys.exit(r.returncode)
