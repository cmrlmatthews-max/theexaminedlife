"""Splice the rebuilt boss rounds from work_src/boss/<b1|b2|b3|b4>.js into work/mini/boss.js, in place of their old (Phase 25) block.
Everything else in boss.js (the MINI_ART block, written by tools/boss_mini_art.py, and the Phase 25 comment) stays byte-for-byte as it is.
Phase 35B rebuilt boss_b1 and boss_b2; Phase 35C rebuilt boss_b3 and boss_b4 the same way.
Each rebuilt round sits between  /* GAME:<id>:BEGIN */  and  /* GAME:<id>:END */  markers, so the builder can be run again and again.
The first 35B run replaced the old first IIFE (b1, b2 and their shared helpers) with the two marked blocks; the first 35C run replaced the old second IIFE (b3, b4 and their copies of the helpers) with the two marked blocks.
The old rounds are kept in work_src/boss/_old_b1..b4.js."""
import os, re, subprocess, sys
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
PARTS = {"boss_b1": "b1", "boss_b2": "b2", "boss_b3": "b3", "boss_b4": "b4"}     # game id -> work_src/boss/<file>.js
P = "work/mini/boss.js"
s = open(P).read()
for gid, f in PARTS.items():
    src = f"work_src/boss/{f}.js"
    if not os.path.exists(src):
        continue
    new = open(src).read().rstrip() + "\n"
    blk = f"/* GAME:{gid}:BEGIN */\n{new}/* GAME:{gid}:END */"
    mk = re.compile(r"/\* GAME:%s:BEGIN \*/.*?/\* GAME:%s:END \*/" % (gid, gid), re.S)
    if mk.search(s):
        s = mk.sub(lambda m: blk, s, count=1)
    elif gid == "boss_b1":
        # first run: the old Phase 25 IIFE (helpers + b1 + b2) starts right after the "BOSS ROUNDS (Phase 25)" comment and ends at the first "})();"
        c = s.index("/* ============ BOSS ROUNDS (Phase 25)")
        a = s.index("(function(){", c)
        e = s.index("\n})();\n", a) + len("\n})();\n")
        old = s[a:e]
        assert "MINI.boss_b1" in old and "MINI.boss_b2" in old and "boss_b3" not in old, "the old IIFE is not the one expected"
        s = s[:a] + blk + "\n\n/* GAME:boss_b2:BEGIN */\n/* GAME:boss_b2:END */\n" + s[e:]
    elif gid == "boss_b3":
        # first 35C run: the old Phase 25 second IIFE (b3 and b4 with their own helpers) follows the boss_b2 block and ends just before MINI_LOADED.boss=true;
        if not os.path.exists("work_src/boss/b4.js"):
            raise SystemExit("write work_src/boss/b4.js first (the first run replaces the old b3/b4 IIFE as a whole)")
        c = s.index("/* GAME:boss_b2:END */") + len("/* GAME:boss_b2:END */")
        a = s.index("(function(){", c)
        e = s.index("\n})();\n", a) + len("\n})();\n")
        old = s[a:e]
        assert "MINI.boss_b3" in old and "MINI.boss_b4" in old and "MINI.boss_b2" not in old and s[e:].lstrip().startswith("MINI_LOADED.boss=true;"), "the old IIFE is not the one expected"
        new4 = open("work_src/boss/b4.js").read().rstrip() + "\n"
        s = s[:a] + blk + "\n\n/* GAME:boss_b4:BEGIN */\n" + new4 + "/* GAME:boss_b4:END */\n" + s[e:]
    else:
        raise SystemExit(f"no marker for {gid} (boss_b4 is spliced in together with boss_b3 on the first run)")
open(P, "w").write(s)
r = subprocess.run(["node", "--check", P], capture_output=True, text=True)
print("boss.js", round(os.path.getsize(P) / 1024, 1), "KB", "syntax OK" if r.returncode == 0 else r.stderr[:800])
sys.exit(r.returncode)
