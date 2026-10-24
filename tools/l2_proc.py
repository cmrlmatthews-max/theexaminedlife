import importlib.util, os
from PIL import Image
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py"); mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
R="art/raw2"
bgs=["mean-bg.png","gadfly-bg.jpeg","gadfly-bg2.jpeg","yours-bg.jpeg","thieves-bg.jpeg","thieves-bg2.jpeg","thieves-bg3.jpeg"]+[f"above-bg{i}.jpeg" for i in range(1,6)]
for f in bgs:
    n=f.split('.')[0]
    im=mat.bg(f"{R}/{f}", f"art/proc2/bg/{n}.png")
    im.save(f"art/proc2/bg/{n}.webp", quality=92)
    mat.grid(f"art/proc2/bg/{n}.png", f"art/proc2/grid/{n}.png", step=16)
for f in ["mean-plate.jpeg","gadfly-plate.jpeg","yours-plate.jpeg","thieves-plate.jpeg","above-plate.jpeg","cages-plate.jpeg"]:
    n=f.split('.')[0]
    im=mat.plate(f"{R}/{f}", f"art/proc2/plate/{n}.jpg")
    im.save(f"art/proc2/plate/{n}.webp", quality=82)
for s in ["mean-s1","gadfly-s1","gadfly-s2","gadfly-s3","yours-s1","yours-s2","thieves-s1","thieves-s2","above-s1"]:
    ext = "jpeg"
    outs=mat.sheet(f"{R}/{s}.{ext}", f"art/cut2/{s}")
    print(s, len(outs), [o[1] for o in outs])
