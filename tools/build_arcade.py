"""Build the arcade test page from work/: arcade/index.html + arcade/mini/*.js (every script in work/mini/, so the seven Plan 5 scripts f1-f3 and s1-s4 too; Phase 38).
The Arcade lists every registered game by land; a short game shows one Play button.
Usage: python3 tools/build_arcade.py [idmap.json]   (idmap: {live_asset_id: arcade_asset_id})"""
import json, os, re, shutil, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, OUT = os.path.join(ROOT, "work"), os.path.join(ROOT, "arcade")
idmap = json.load(open(sys.argv[1])) if len(sys.argv) > 1 and os.path.exists(sys.argv[1]) else {}
def remap(s):
    for a, b in idmap.items(): s = s.replace(a, b)
    return s
os.makedirs(os.path.join(OUT, "mini"), exist_ok=True)
page = open(os.path.join(W, "index.html"), encoding="utf8").read()
assert page.count("<title>The Examined Life</title>") == 1
page = page.replace("<title>The Examined Life</title>", "<title>Examined Life Arcade</title>")
inj = open(os.path.join(ROOT, "tools", "arcade_inject.html"), encoding="utf8").read()
page = page.rstrip() + "\n" + inj
open(os.path.join(OUT, "index.html"), "w", encoding="utf8").write(remap(page))
for f in os.listdir(os.path.join(W, "mini")):
    s = open(os.path.join(W, "mini", f), encoding="utf8").read()
    open(os.path.join(OUT, "mini", f), "w", encoding="utf8").write(remap(s))
# every inline script must parse
scripts = re.findall(r"<script>(.*?)</script>", page, re.S)
open("/tmp/arc_last.js", "w").write(scripts[-1])
subprocess.run(["node", "--check", "/tmp/arc_last.js"], check=True)
print("built", len(page.encode()), "bytes; remapped", len(idmap), "ids")
