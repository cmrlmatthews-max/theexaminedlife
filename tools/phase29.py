#!/usr/bin/env python3
"""Phase 29 transform: split the mini-games out of the page, and add the sharper stage.
Reads base/index.html (the stored live page, version 41), writes work/index.html + work/mini/*.js.
Every replacement asserts it matched exactly once."""
import os, re, sys

BASE = sys.argv[1] if len(sys.argv) > 1 else "base/index.html"
OUT = sys.argv[2] if len(sys.argv) > 2 else "work"
src = open(BASE, encoding="utf-8").read()
L = src.split("\n")

def rep(s, old, new, n=1):
    c = s.count(old)
    assert c == n, f"expected {n} of {old[:80]!r}, found {c}"
    return s.replace(old, new)

# ---------- 1. split the games out ----------
def find_line(prefix, start=0):
    for i in range(start, len(L)):
        if L[i].startswith(prefix):
            return i
    raise AssertionError("line not found: " + prefix)

a1 = find_line("/* ---- Pilot (Phase 20): Sisyphus's Hill")
a2 = find_line("/* ---- Level II (Phase 22): The Golden Mean")
a3 = find_line("/* ---- Level III (Phase 23A): Tune the Lute")
a4 = find_line("/* ---- Level IV (Phase 24A): Two Lights, One Window")
a5 = find_line("/* ============ BOSS ROUNDS (Phase 25) ============")
a6 = find_line("/* ============ CARDS & PANELS ============ */")
regions = {"l1": (a1, a2), "l2": (a2, a3), "l3": (a3, a4), "l4": (a4, a5), "boss": (a5, a6)}
head = {
    "l1": "/* The Examined Life: Level I mini-games (the Stormcliffs). Loaded after the page's main script (Phase 29). */",
    "l2": "/* The Examined Life: Level II mini-games (the Marble Coast). Loaded after the page's main script (Phase 29). */",
    "l3": "/* The Examined Life: Level III mini-games (the Misty Valleys). Loaded after the page's main script (Phase 29). */",
    "l4": "/* The Examined Life: Level IV mini-games (the Clockwork City). Loaded after the page's main script (Phase 29). */",
    "boss": "/* The Examined Life: the four boss rounds (Phase 25). Loaded after the page's main script (Phase 29). */",
}
os.makedirs(os.path.join(OUT, "mini"), exist_ok=True)
for k, (a, b) in regions.items():
    body = "\n".join(L[a:b]).rstrip() + "\n"
    open(os.path.join(OUT, "mini", k + ".js"), "w", encoding="utf-8").write(head[k] + "\n" + body + f"MINI_LOADED.{k}=true;\n")
keep = L[:a1] + ["/* Phase 29: the thinker games and boss rounds now live in mini/l1.js … mini/l4.js and mini/boss.js, loaded after this script. */", ""] + L[a6:]
page = "\n".join(keep)

# ---------- 2. load the scripts after the main one ----------
tags = "\n".join(f'<script src="mini/{k}.js"></script>' for k in ["fx", "l1", "l2", "l3", "l4", "boss"])
page = rep(page, "</script>\n\n</body></html>", "</script>\n" + tags + "\n\n</body></html>")

# ---------- 3. the sharper stage (384 x 640, game units stay 192 x 320) ----------
page = rep(page, '<div id="mFrame"><canvas id="mcv" width="192" height="320"></canvas></div>',
           '<div id="mFrame"><canvas id="mcv" width="384" height="640"></canvas><img id="mPlate" alt="" aria-hidden="true"><div id="mBanner" class="hide" aria-live="polite"></div></div>')
page = rep(page, "#mcv{display:block;image-rendering:pixelated;image-rendering:crisp-edges;background:#0E0B1A;border-radius:3px}",
           "#mcv{display:block;image-rendering:pixelated;image-rendering:crisp-edges;background:#0E0B1A;border-radius:3px}\n"
           "#mPlate{position:absolute;left:3px;top:3px;right:3px;bottom:3px;width:calc(100% - 6px);height:calc(100% - 6px);object-fit:cover;border-radius:3px;opacity:0;pointer-events:none;transform-origin:50% 35%}\n"
           "#mPlate.on{animation:mplatein 7s ease-out forwards}\n"
           "@keyframes mplatein{from{transform:scale(1)}to{transform:scale(1.045)}}\n"
           "#mBanner{position:absolute;left:50%;top:30%;transform:translate(-50%,-50%);white-space:nowrap;font-family:var(--f-head);font-size:19px;letter-spacing:.08em;color:#FFE9B8;padding:8px 18px;border:4px solid transparent;border-radius:12px;"
           "background:linear-gradient(180deg,rgba(40,26,16,.94),rgba(20,13,8,.96)) padding-box,var(--bandgold) border-box;box-shadow:0 0 0 1.5px var(--lead),0 0 26px rgba(232,169,58,.35);line-height:1.2;pointer-events:none;animation:mbanner 1.6s ease forwards}\n"
           "@keyframes mbanner{0%{opacity:0;transform:translate(-50%,-40%) scale(.96)}15%{opacity:1;transform:translate(-50%,-50%) scale(1)}80%{opacity:1}100%{opacity:0}}\n"
           ".mpips{display:inline-flex;gap:4px;margin-left:8px;vertical-align:middle}.mpips i{width:7px;height:7px;border-radius:50%;background:#3A2E4A;box-shadow:0 0 0 1px var(--lead)}.mpips i.on{background:#F5C66A;box-shadow:0 0 0 1px var(--lead),0 0 6px rgba(245,198,106,.8)}\n"
           "@media (prefers-reduced-motion:reduce){#mPlate.on{animation:none}#mBanner{animation:mbannerrm 1.6s linear forwards}@keyframes mbannerrm{0%{opacity:0}12%{opacity:1}85%{opacity:1}100%{opacity:0}}}")
# a compact result card, so the top half of the stage (and its plate) stays in view
page = rep(page, "#mCard .mbtns{display:grid;gap:10px;margin-top:12px}",
           "#mCard .mbtns{display:grid;gap:10px;margin-top:12px}\n"
           "#mCard.res{max-height:48%}#mCard.res .mhead{margin-bottom:8px;font-size:16px}#mCard.res .dbox{padding:10px 14px 12px}#mCard.res .dbox .txt{font-size:18px;line-height:1.35}"
           "#mCard.res .mres{margin-top:6px;padding:6px 10px 8px}#mCard.res .mlanwrap{margin:4px 0 0}#mCard.res .mlan.big svg{width:24px;height:32px}#mCard.res .mbtns{grid-template-columns:1fr 1fr;margin-top:8px}#mCard.res .mbtns .reply{padding:9px 12px}")

# ---------- 4. the art registry (entries are added by the land files) ----------
page = rep(page, "const MINI={};\n",
           "const MINI={};\n"
           "/* Phase 29: art for the developed games. MINI_ART[id]={atlas:'<asset id>',rects:{name:[x,y,w,h]},bg:['<asset id>',…],plate:'<asset id>',plateVideo?,…traced data}.\n"
           "   Everything loads lazily when a game opens; every draw helper returns false until its image has loaded, so games draw a fallback. */\n"
           "const MINI_ART={},MIMG={},MINI_LOADED={};\n"
           "function mImgE(aid){if(!aid)return null;let e=MIMG[aid];if(!e){const img=new Image();e=MIMG[aid]={img,ok:false,bad:false};img.onload=()=>{e.ok=true};img.onerror=()=>{e.bad=true};img.src=\"/_blob/\"+aid}return e}\n"
           "function loadMiniArt(id){const A=MINI_ART[id];if(!A)return;[A.atlas,A.people,...(A.bg||[]),A.plate].forEach(a=>{if(a)mImgE(a)})}\n")

# ---------- 5. stage: transform, plates, stages, walk on, fingers ----------
page = rep(page, "function miniDraw(){if(!MS||!MCTX)return;const c=MCTX,g=MS.g,s=MS.s,t=performance.now();c.imageSmoothingEnabled=false;c.setTransform(1,0,0,1,0,0);",
           "function miniDraw(){if(!MS||!MCTX)return;const c=MCTX,g=MS.g,s=MS.s,t=performance.now();c.imageSmoothingEnabled=false;c.setTransform(2,0,0,2,0,0);miniPlateTick();")
page = rep(page, "function miniBlankInp(){return {dx:0,dy:0,a:false,b:false,aTap:false,bTap:false,lTap:false,rTap:false,uTap:false,dTap:false,tap:null,taps:[],down:null,drag:null,swipe:null}}",
           "function miniBlankInp(){return {dx:0,dy:0,a:false,b:false,aTap:false,bTap:false,lTap:false,rTap:false,uTap:false,dTap:false,tap:null,taps:[],down:null,drag:null,swipe:null,fingers:0,ups:[]}}\n"
           "/* Phase 29: plates (the closing painting), stage banners, and stage pips */\n"
           "function miniPlateSrc(id){const A=MINI_ART[id];return A&&A.plate?\"/_blob/\"+A.plate:null}\n"
           "function miniPlateReset(){const p=$(\"#mPlate\");if(!p)return;p.classList.remove(\"on\");p.style.opacity=0;p.removeAttribute(\"src\");p.dataset.id=\"\"}\n"
           "function miniPlateTick(){const p=$(\"#mPlate\");if(!p||!MS)return;const src=miniPlateSrc(MS.id);\n"
           "  const want=!!(src&&MS.res&&MS.res.win&&(MS.mode===\"bloom\"||MS.mode===\"result\"));\n"
           "  if(!want){if(p.style.opacity!==\"0\"){p.style.opacity=0;p.classList.remove(\"on\")}return}\n"
           "  if(p.dataset.id!==MS.id){p.dataset.id=MS.id;p.src=src}\n"
           "  const e=mImgE(MINI_ART[MS.id].plate);if(!e||!e.ok)return;\n"
           "  const k=MS.mode===\"result\"||MS.s.rm?1:Math.max(0,Math.min(1,(MS.bk-.62)/.38));p.style.opacity=k;if(k>=1&&!p.classList.contains(\"on\")&&!MS.s.rm)p.classList.add(\"on\")}\n"
           "const ROMAN=[\"I\",\"II\",\"III\",\"IV\",\"V\"];\n"
           "function miniPips(){const el=$(\"#mTitle\");if(!el||!MS)return;const g=MS.g,n=(g.stages||[]).length;el.textContent=g.title;if(!n)return;\n"
           "  const st=(MS.s&&MS.s.st)||0,sp=document.createElement(\"span\");sp.className=\"mpips\";sp.setAttribute(\"aria-label\",`Stage ${st+1} of ${n}`);\n"
           "  for(let i=0;i<n;i++){const d=document.createElement(\"i\");if(i<=st)d.className=\"on\";sp.appendChild(d)}el.appendChild(sp)}\n"
           "function miniBanner(txt){const b=$(\"#mBanner\");if(!b)return;b.classList.add(\"hide\");void b.offsetWidth;b.textContent=txt;b.classList.remove(\"hide\");clearTimeout(miniBanner.t);miniBanner.t=setTimeout(()=>b.classList.add(\"hide\"),1650)}\n"
           "/* A game calls stageUp(s) to move to its next stage (or stageUp(s,n) to jump). Safe to call from tests, where no stage is open. */\n"
           "function stageUp(s,n){s.st=n==null?(s.st||0)+1:n;s.stT=0;if(!MS||MS.s!==s)return;const g=MS.g;MS.sess.st=Math.max(MS.sess.st||0,s.st);\n"
           "  const nm=(g.stages||[])[s.st];if(nm&&MS.mode===\"play\"){miniBanner(ROMAN[s.st]+\" · \"+nm);sfx(\"stage\")}miniPips()}\n")
page = rep(page, "  $(\"#mTitle\").textContent=g.title;$(\"#mini\").style.setProperty(",
           "  loadMiniArt(id);miniPlateReset();$(\"#mBanner\").classList.add(\"hide\");$(\"#mTitle\").textContent=g.title;$(\"#mini\").style.setProperty(")
page = rep(page, "  show(\"mini\");fitMini();miniCard();startMiniLoop()}",
           "  show(\"mini\");fitMini();miniPips();miniCard();startMiniLoop()}")
page = rep(page, "const canWalk=()=>!!MS&&!MS.replay&&(MS.sess.tries>=2||MS.sess.t>=(MS.g.long?180:120));",
           "const canWalk=()=>!!MS&&!MS.replay&&(MS.sess.tries>=2||MS.sess.t>=(MS.boss?120:MS.g.long?240:180)); /* Phase 29 (G8): 3 minutes, 4 for the long games; boss rounds keep 2 */")
page = rep(page, "  else if(a===\"mtry\"){if(MS.g.retry)MS.g.retry(MS.s);else MS.s=newMiniState(MS.g);miniPlay(false)}",
           "  else if(a===\"mtry\"){if(MS.g.toStage){const n=Math.max((MS.s&&MS.s.st)||0,0);MS.s=newMiniState(MS.g);MS.g.toStage(MS.s,n)}else if(MS.g.retry)MS.g.retry(MS.s);else MS.s=newMiniState(MS.g);miniPlay(false);miniPips()} /* Phase 29 (G9): try again restarts the current stage */")
page = rep(page, "function closeMini(){stopMiniLoop();for(const t of lanTimers)clearTimeout(t);lanTimers=[];miniClearInput();MS=null;",
           "function closeMini(){stopMiniLoop();for(const t of lanTimers)clearTimeout(t);lanTimers=[];miniClearInput();miniPlateReset();$(\"#mBanner\").classList.add(\"hide\");MS=null;")
page = rep(page, "function bossRoundDone(){stopMiniLoop();for(const t of lanTimers)clearTimeout(t);lanTimers=[];miniClearInput();MS=null;",
           "function bossRoundDone(){stopMiniLoop();for(const t of lanTimers)clearTimeout(t);lanTimers=[];miniClearInput();miniPlateReset();$(\"#mBanner\").classList.add(\"hide\");MS=null;")
# fingers: count pointers down on the stage (two-finger holds)
page = rep(page, "const MK={},MT={},MP={taps:[],down:null,drag:null,swipe:null,aH:false,bH:false,aT:false,bT:false,pdx:0,pdy:0,padId:null};",
           "const MK={},MT={},MP={taps:[],down:null,drag:null,swipe:null,aH:false,bH:false,aT:false,bT:false,pdx:0,pdy:0,padId:null,ptrs:new Set(),ups:[]};")
page = rep(page, "taps:MP.taps.slice(),tap:MP.taps[0]||null,down:MP.down?{x:MP.down.x,y:MP.down.y}:null,drag:MP.drag,swipe:MP.swipe};\n  MP.taps=[];",
           "taps:MP.taps.slice(),tap:MP.taps[0]||null,down:MP.down?{x:MP.down.x,y:MP.down.y}:null,drag:MP.drag,swipe:MP.swipe,fingers:MP.ptrs.size,ups:MP.ups.slice()};\n  MP.taps=[];MP.ups=[];")
page = rep(page, "Object.assign(MP,{taps:[],down:null,drag:null,swipe:null,aH:false,bH:false,aT:false,bT:false,pdx:0,pdy:0,padId:null});",
           "Object.assign(MP,{taps:[],down:null,drag:null,swipe:null,aH:false,bH:false,aT:false,bT:false,pdx:0,pdy:0,padId:null,ups:[]});MP.ptrs.clear();")
page = rep(page, "e.preventDefault();const p=mPt(e);MP.taps.push(p);MP.down={x:p.x,y:p.y,x0:p.x,y0:p.y,id:e.pointerId,t0:performance.now()}});",
           "e.preventDefault();const p=mPt(e);MP.taps.push(p);MP.ptrs.add(e.pointerId);if(!MP.down)MP.down={x:p.x,y:p.y,x0:p.x,y0:p.y,id:e.pointerId,t0:performance.now()}});")
page = rep(page, "const mUp=e=>{const d=MP.down;if(!d||d.id!==e.pointerId)return;const p=mPt(e),dx=p.x-d.x0,dy=p.y-d.y0;",
           "const mUp=e=>{MP.ptrs.delete(e.pointerId);const d=MP.down;if(!d||d.id!==e.pointerId)return;const p=mPt(e),dx=p.x-d.x0,dy=p.y-d.y0;MP.ups.push({x:p.x,y:p.y,t:performance.now()-d.t0});")

# ---------- 6. result card uses the compact layout ----------
page = rep(page, "function miniCard(){const el=$(\"#mCard\");if(!MS){el.classList.add(\"hide\");return}",
           "function miniCard(){const el=$(\"#mCard\");if(!MS){el.classList.add(\"hide\");el.classList.remove(\"res\");return}el.classList.toggle(\"res\",MS.mode===\"result\"||MS.mode===\"walked\");")

# ---------- 7. a game artifact tapped before its script has loaded waits instead of being examined ----------
page = rep(page, "  else if(it.t===\"art\"&&it.a.g&&MINI[it.a.g]&&!isFound(it.a))startMini(it.a.g,{art:it.a});",
           "  else if(it.t===\"art\"&&it.a.g&&MINI[it.a.g]&&!isFound(it.a))startMini(it.a.g,{art:it.a});\n"
           "  else if(it.t===\"art\"&&it.a.g&&!MINI[it.a.g]&&!isFound(it.a)&&document.readyState!==\"complete\")wtoast(\"One moment…\"); /* Phase 29: its game is still loading */")

# ---------- 8. a sound for a new stage ----------
page = rep(page, " catch:()=>aTone(AN(3),.09,{v:.12,type:\"triangle\",to:AN(8)}),\n",
           " catch:()=>aTone(AN(3),.09,{v:.12,type:\"triangle\",to:AN(8)}),\n"
           " stage:()=>{aArp([3,7,10],.09,{d:1.1,v:.06,lp:2600});aNoise(.5,{f:3200,to:1800,q:.4,a:.08,v:.02})},\n")

open(os.path.join(OUT, "index.html"), "w", encoding="utf-8").write(page)
print("page", len(page.encode()) / 1024, "KB")
for k in ["l1", "l2", "l3", "l4", "boss"]:
    print(k, os.path.getsize(os.path.join(OUT, "mini", k + ".js")) / 1024, "KB")
