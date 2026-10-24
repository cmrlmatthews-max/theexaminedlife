"""Boss art (plan 4, Phase 35A): backdrops and sheet cuts. Mirrors tools/l4_proc.py.
Raw art: art/raw5/*.png (Gemini downloads, 1536x2752 scenes and 2048x2048 sheets; saved as JPEG, converted)."""
import importlib.util, os, json, sys
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py"); mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
R = "art/raw5"
only = sys.argv[1:]
for n in ["boss_b1-bg", "boss_b2-bg", "boss_b3-bg", "boss_b4-bg"]:
    if only and n not in only or not os.path.exists(f"{R}/{n}.png"): continue
    im = mat.bg(f"{R}/{n}.png", f"art/proc5/bg/{n}.png")
    im.save(f"art/proc5/bg/{n}.webp", quality=92)
    mat.grid(f"art/proc5/bg/{n}.png", f"art/proc5/grid/{n}.png", step=16)
    print(n, im.size)
for s in ["boss_b1-s1", "boss_b2-s1", "boss_b3-s1", "boss_b4-s1"]:
    if only and s not in only or not os.path.exists(f"{R}/{s}.png"): continue
    outs = mat.sheet(f"{R}/{s}.png", f"art/cut5/{s}")
    json.dump([[int(v) for v in o[1]] for o in outs], open(f"art/proc5/boxes-{s}.json", "w"))
    print(s, len(outs), [o[1] for o in outs])
