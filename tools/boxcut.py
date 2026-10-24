import importlib.util, os, numpy as np
from PIL import Image
spec=importlib.util.spec_from_file_location('mat','tools/mini-art-tools.py');mat=importlib.util.module_from_spec(spec);spec.loader.exec_module(mat)
def boxcut(src, outdir, boxes, key="magenta"):
    os.makedirs(outdir, exist_ok=True)
    arr=np.array(Image.open(src).convert("RGB")); rgb,al=mat.key_alpha(arr,key)
    rgba=np.dstack([rgb,al*255]).clip(0,255).astype(np.uint8)
    for k,(x0,y0,x1,y1) in enumerate(boxes,1):
        sub=Image.fromarray(rgba[y0:y1,x0:x1],"RGBA"); bb=sub.getchannel("A").point(lambda v:255 if v>40 else 0).getbbox()
        sub.crop(bb).save(f"{outdir}/{k:02d}.png")
if __name__=="__main__":
    import shutil; shutil.rmtree("art/cut2/thieves-s1",ignore_errors=True)
    boxcut("art/raw2/thieves-s1.jpeg","art/cut2/thieves-s1",[(150,70,680,910),(1160,90,2000,920),(650,720,1420,1100),(50,1080,780,1980),(740,1410,1400,1990),(1340,1120,2000,1980)])
