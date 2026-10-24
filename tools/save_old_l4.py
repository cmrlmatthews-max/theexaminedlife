"""One-off (Phase 34B): save the Phase 24A lights and corner blocks of work/mini/l4.js as work_src/l4/_old_<id>.js."""
import os, re
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
s = open("work/mini/l4.js").read()
H = re.compile(r"/\* ---- Level IV \(Phase 24[AB]\): ")
idx = [m.start() for m in H.finditer(s)]
end = s.index("MINI_LOADED.l4=true;")
b = idx + [end]
for i, n in enumerate(["lights", "corner"]):
    f = f"work_src/l4/_old_{n}.js"
    if not os.path.exists(f):
        open(f, "w").write(s[b[i]:b[i + 1]].rstrip() + "\n")
    print(n, os.path.getsize(f))
