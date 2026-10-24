import sys, glob, os
from PIL import Image, ImageDraw
s=sys.argv[1]; fs=sorted(glob.glob(f"art/cut43/{s}/[0-9][0-9].png"))
ims=[Image.open(f).convert("RGBA") for f in fs]
W=900; x=y=10; rh=0; pos=[]
for i,im in enumerate(ims):
    k=min(1, 160/max(im.size)); t=im.resize((max(1,int(im.width*k)),max(1,int(im.height*k))))
    if x+t.width>W: x=10; y+=rh+24; rh=0
    pos.append((i+1,t,x,y)); x+=max(t.width,60)+12; rh=max(rh,t.height)
out=Image.new("RGBA",(W,y+rh+30),(60,60,70,255)); d=ImageDraw.Draw(out)
for n,t,x,y in pos: out.alpha_composite(t,(x,y+14)); d.text((x,y),f"{n} {ims[n-1].size}",fill=(255,255,0,255))
out.convert("RGB").save(f"/tmp/cuts-{s}.jpg",quality=85)
