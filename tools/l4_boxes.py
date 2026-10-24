"""draw each sheet's cut boxes and numbers over the raw sheet, for matching items"""
import sys, os
from PIL import Image, ImageDraw
import importlib.util
spec = importlib.util.spec_from_file_location("mat", "tools/mini-art-tools.py"); mat = importlib.util.module_from_spec(spec); spec.loader.exec_module(mat)
for s in sys.argv[1:]:
    im = Image.open(f"art/raw4/{s}.png").convert("RGB"); d = ImageDraw.Draw(im)
    k = 1
    while os.path.exists(f"art/cut4/{s}/{k:02d}.png"):
        k += 1
    # recompute boxes from the sheet call is costly; store via cut sizes instead: re-run sheet quickly
    outs = mat.sheet(f"art/raw4/{s}.png", f"/tmp/cutv/{s}")
    for n, (p, (x0, y0, x1, y1)) in enumerate(outs, 1):
        d.rectangle((x0, y0, x1, y1), outline=(0, 255, 0), width=8); d.text((x0 + 10, y0 + 10), str(n), fill=(0, 255, 0), font_size=90)
    im.resize((700, 700)).save(f"/tmp/box_{s}.png")
