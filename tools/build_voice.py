#!/usr/bin/env python3
"""Phase 44B-3: build work/mini/voice.js from voice/voice_ids.json (key -> asset id), voice/lines.json (the approved lines)
and work_src/voice/player.js. VOICE_MAP: key -> id. VOICE_IX: FNV-1a hash of the normalized line text -> key (or a list
of keys when two speakers share the text, such as the five affirmations). Fails if two different texts share a hash."""
import json, re, sys, unicodedata, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ids = json.load(open(os.path.join(R, "voice/voice_ids.json")))
L = json.load(open(os.path.join(R, "voice/lines.json")))
assert set(ids) == set(L), "ids and lines differ"
def norm(t): return re.sub(r"[^a-z0-9]", "", unicodedata.normalize("NFKD", t).lower())
def fnv(s):
    h = 0x811c9dc5
    for ch in s: h = ((h ^ ord(ch)) * 0x01000193) & 0xffffffff
    n, out = h, ""
    while True:
        n, r = divmod(n, 36); out = "0123456789abcdefghijklmnopqrstuvwxyz"[r] + out
        if not n: return out
ix, seen = {}, {}
for k, v in L.items():
    n = norm(v["text"]); h = fnv(n)
    if h in seen and seen[h] != n: sys.exit(f"hash collision: {k}")
    seen[h] = n; ix.setdefault(h, []).append(k)
ix = {h: (ks[0] if len(ks) == 1 else ks) for h, ks in ix.items()}
for k, i in ids.items(): assert re.fullmatch(r"[0-9a-f]{32}", i), k
assert len(set(ids.values())) == len(ids)
order = list(L)
vm = "{" + ",".join(f'"{k}":"{ids[k]}"' for k in order) + "}"
vi = json.dumps(ix, separators=(",", ":"))
player = open(os.path.join(R, "work_src/voice/player.js"), encoding="utf-8").read()
src = ("/* The Examined Life — voice clips (Phase 44B-3). Built by tools/build_voice.py; do not edit by hand.\n"
       f"   {len(ids)} clips (AAC 48 kbps mono in .mp4, in the game's asset store). If this file does not load, the game runs with text only. */\n"
       f"const VOICE_MAP={vm};\nconst VOICE_IX={vi};\n" + player)
out = os.path.join(R, "work/mini/voice.js")
open(out, "w", encoding="utf-8").write(src)
print(out, len(src.encode()), "bytes;", len(ids), "keys;", len(ix), "texts")
