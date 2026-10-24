"""Level IV art (plan 4, Phase 34A): backdrops, plates, sheet cuts. Mirrors tools/l3_proc.py.
Raw art: art/raw4/*.png (Gemini, 1536x2752 scenes and 2048x2048 sheets)."""
import importlib.util, os, json
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py"); mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
R = "art/raw4"
for n in ["lights-bg", "corner-bg", "web-bg", "rule-bg"]:
    im = mat.bg(f"{R}/{n}.png", f"art/proc4/bg/{n}.png")
    im.save(f"art/proc4/bg/{n}.webp", quality=92)
    mat.grid(f"art/proc4/bg/{n}.png", f"art/proc4/grid/{n}.png", step=16)
for n in ["lights-plate", "corner-plate", "web-plate", "rule-plate"]:
    im = mat.plate(f"{R}/{n}.png", f"art/proc4/plate/{n}.jpg")
    im.save(f"art/proc4/plate/{n}.webp", quality=82)
for s in ["lights-s1", "lights-s2", "corner-s1", "web-s1", "rule-s1"]:
    outs = mat.sheet(f"{R}/{s}.png", f"art/cut4/{s}")
    json.dump([[int(v) for v in o[1]] for o in outs], open(f"art/proc4/boxes-{s}.json", "w"))
    print(s, len(outs))
