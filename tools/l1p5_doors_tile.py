"""doors-bg: make the hall backdrop tile vertically. The lower part of Gemini's hall is near-orthographic (walls at
x 26 and 165 units), so take a 160-unit band of it, flatten its row brightness, blend its last rows into the rows above
the band (seamless period), and stack it twice into 384 x 640 (the period is 320 px = 160 units)."""
import numpy as np
from PIL import Image
src = np.array(Image.open("art/raw40/doors-bg.png").convert("RGB")).astype(float)
h, w = src.shape[:2]; tw = int(round(h * 3 / 5))
th = int(round(w * 5 / 3)); y0 = (h - th) // 2; src = src[y0:y0 + th]          # 3:5 crop, 8 px per unit
U = src.shape[0] / 320
A, P, K = int(150 * U), int(160 * U), int(28 * U)
band = src[A:A + P].copy()
for i in range(K):
    wgt = (i + 1) / K
    band[P - K + i] = (1 - wgt) * src[A + P - K + i] + wgt * src[A - K + i]
lum = band.mean(axis=(1, 2)); k = np.convolve(lum, np.ones(int(12 * U)) / int(12 * U), mode="same")
k = np.concatenate([k, k]); kk = np.convolve(k, np.ones(9) / 9, mode="same")[:P]
band *= (kk.mean() / np.maximum(kk, 1))[:, None, None]
tile = np.concatenate([band, band], 0).clip(0, 255).astype(np.uint8)
im = Image.fromarray(tile).resize((384, 640), Image.Resampling.BOX)
im.save("art/proc40/bg/doors-bg.png"); im.save("art/proc40/bg/doors-bg.webp", quality=92)
strip = Image.new("RGB", (384, 1920))
for j in range(3): strip.paste(im, (0, 640 * j))
strip.resize((192, 960)).save("art/proc40/geo/doors-tile3.png")
print("ok", im.size)
