"""Level III art (plan 4, Phase 33A): backdrops, plates, sheet cuts. Mirrors tools/l2_proc.py."""
import importlib.util, os
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py"); mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
R = "art/raw3"
for n in ["lute-bg", "water-bg", "kitchen-bg", "kitchen-bg2", "kitchen-bg3"]:
    im = mat.bg(f"{R}/{n}.jpeg", f"art/proc3/bg/{n}.png")
    im.save(f"art/proc3/bg/{n}.webp", quality=92)
    mat.grid(f"art/proc3/bg/{n}.png", f"art/proc3/grid/{n}.png", step=16)
for n in ["lute-plate", "water-plate", "kitchen-plate", "butterfly-plate"]:
    im = mat.plate(f"{R}/{n}.jpeg", f"art/proc3/plate/{n}.jpg")
    im.save(f"art/proc3/plate/{n}.webp", quality=82)
for s in ["lute-s1", "water-s1", "kitchen-s1", "kitchen-s2", "butterfly-s1"]:
    outs = mat.sheet(f"{R}/{s}.jpeg", f"art/cut3/{s}")
    print(s, len(outs), [o[1] for o in outs])
