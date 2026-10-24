import sys
from PIL import Image, ImageDraw
n=sys.argv[1]; im=Image.open(f"art/proc42/bg/{n}.png").convert("RGB").resize((768,1280),Image.NEAREST)
d=ImageDraw.Draw(im)
for u in range(0,193,8):
    c=(255,255,0) if u%32==0 else (120,120,120); d.line([(u*4,0),(u*4,1280)],fill=c,width=1)
    if u%32==0: d.text((u*4+2,2),str(u),fill=(255,255,0))
for u in range(0,321,8):
    c=(255,255,0) if u%32==0 else (120,120,120); d.line([(0,u*4),(768,u*4)],fill=c,width=1)
    if u%32==0: d.text((2,u*4+2),str(u),fill=(255,255,0))
im.save(f"/tmp/grid-{n}.jpg",quality=80)
