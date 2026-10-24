"""Assemble work/mini/l1.js: header, MINI_ART block (tools/l1_mini_art.py), then each developed game from work_src/l1/."""
import os, subprocess
parts = ["sisyphus","goalkeeper","idols","cages"]  # Phase 45B: Having or Being removed (its source stays in work_src/l1/having.js)
out = ["/* The Examined Life: Level I mini-games (the Stormcliffs). Loaded after the page's main script (Phase 29).\n   Phases 30-31 rebuilt all five in the lantern-lit diorama look: three stages each, art from MINI_ART, and a painted plate after the bloom.\n   Source: work_src/l1/*.js, assembled by tools/build_l1.py. */",
       "/* MINI_ART:BEGIN */\n/* MINI_ART:END */"]
for p in parts:   # a game not yet rebuilt keeps its Phase 21 code
    f = f"work_src/l1/{p}.js" if os.path.exists(f"work_src/l1/{p}.js") else f"work_src/l1/_old_{p}.js"
    out.append(open(f).read().rstrip())
out.append("MINI_LOADED.l1=true;\n")
open("work/mini/l1.js","w").write("\n".join(out))
subprocess.run(["python3","tools/l1_mini_art.py"],check=True)
r = subprocess.run(["node","--check","work/mini/l1.js"],capture_output=True,text=True)
print("l1.js", os.path.getsize("work/mini/l1.js")//1024, "KB", "syntax OK" if r.returncode==0 else r.stderr[:800])
