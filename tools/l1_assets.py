"""Level I art files -> placeholder asset ids (local), blobs/<id>.<ext>. After upload, ids.json is rewritten with real ids."""
import hashlib, json, os, shutil, sys
FILES = {
 "sisyphus_atlas":"art/out/sisyphus/atlas.png","sisyphus_people":"art/out/sisyphus/people.png",
 "sisyphus_bg":"art/proc/bg/sisyphus-bg.webp","sisyphus_bg2":"art/proc/bg/sisyphus-bg2.webp","sisyphus_plate":"art/proc/plate/sisyphus-plate.webp",
 "goalkeeper_atlas":"art/out/goalkeeper/atlas.png","goalkeeper_people":"art/out/goalkeeper/people.png",
 "goalkeeper_bg":"art/proc/bg/goalkeeper-bg.webp","goalkeeper_plate":"art/proc/plate/goalkeeper-plate.webp",
 "idols_atlas":"art/out/idols/atlas.png","idols_bg":"art/proc/bg/idols-bg.webp","idols_plate":"art/proc/plate/idols-plate.webp",
 "having_atlas":"art/out/having/atlas.png","having_people":"art/out/having/people.png",
 "having_bg":"art/proc/bg/having-bg.webp","having_bg2":"art/proc/bg/having-bg2.webp","having_bg3":"art/proc/bg/having-bg3.webp","having_plate":"art/proc/plate/having-plate.webp",
 "cages_atlas":"art/out/cages/atlas.png","cages_people":"art/out/cages/people.png","cages_bg":"art/proc/bg/cages-bg.webp",
}
if __name__=="__main__":
    ids = {k: hashlib.md5(("el-l1-"+k).encode()).hexdigest() for k in FILES}
    if os.path.exists("ids.json") and "--fresh" not in sys.argv: ids.update(json.load(open("ids.json")))
    for k,p in FILES.items():
        ext=os.path.splitext(p)[1]; shutil.copy(p, f"blobs/{ids[k]}{ext}")
    json.dump(ids, open("ids.json","w"), indent=1)
    print(json.dumps(ids))
