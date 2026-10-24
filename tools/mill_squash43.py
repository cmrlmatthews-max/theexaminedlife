"""Phase 43A: art/raw43/mill-sbg.png -> art/raw43/mill-sbg-sq.png (unit rows 40-292 squashed into 40-250; 292-320 stretched into 250-320).
Units map to raw rows as 96 + u*8 (the 3:5 centre crop of a 1536 x 2752 image)."""
from PIL import Image
im = Image.open('art/raw43/mill-sbg.png').convert('RGB'); W, H = im.size
U = lambda u: int(96 + u * 8)
def band(y0, y1, t0, t1): return im.crop((0, y0, W, y1)).resize((W, t1 - t0), Image.Resampling.LANCZOS)
out = Image.new('RGB', (W, H)); out.paste(im.crop((0, 0, W, U(40))), (0, 0))
out.paste(band(U(40), U(292), U(40), U(250)), (0, U(40))); out.paste(band(U(292), H, U(250), H), (0, U(250)))
out.save('art/raw43/mill-sbg-sq.png'); print(out.size)
