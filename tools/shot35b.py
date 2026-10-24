"""python3 tools/shot35b.py [name ...] : Phase 35B screenshots (real art) into shots35b/, for the boss rounds Carry It Anyway (boss_b1) and The Still Center (boss_b2).
One mid-play shot per wave per round, a bloom frame (normal) and a Reduce Motion still, plus two contact sheets (boss-b1.jpg, boss-b2.jpg: three waves + the bloom side by side).
Each job sets up a state in the page (JS below; MS = the mini session, s = its state, g = the game) and takes a screenshot of the page (the stage, the HUD, the pad)."""
import asyncio, sys, os, glob, functools, http.server, threading
from playwright.async_api import async_playwright
OUT = "shots35b"
HELP = """
const tick=(n,dt)=>{for(let i=0;i<n;i++)miniTick(dt||.05)};
const until=(f,max)=>{for(let i=0;i<(max||4000)&&!f()&&MS.mode==='play';i++)miniTick(.05)};
const bloomTo=(k)=>{for(let i=0;i<600&&MS.mode!=='bloom'&&MS.mode!=='result';i++)miniTick(.05);for(let i=0;i<600&&MS.mode==='bloom'&&MS.bk<k;i++)miniTick(.05)};
"""
JOBS = {
 # --- boss_b1: Carry It Anyway ---
 "b1_w1": ("boss_b1", False, "MS.auto=true;g.init(s);until(()=>s.st===0&&s.p>.2&&s.wisps.filter(w=>!w.dead).length>=1||s.st>0,4000);MS.auto=false;"),
 "b1_w2": ("boss_b1", False, "MS.auto=true;g.toStage(s,1);until(()=>s.st===1&&s.stT>5&&s.lights.filter(l=>l.cool>0).length>=1||s.st>1,4000);MS.auto=false;"),
 "b1_w3": ("boss_b1", False, "MS.auto=true;g.toStage(s,2);until(()=>s.st===2&&s.p>.8&&s.wisps.filter(w=>!w.dead).length>=2,6000);MS.auto=false;"),
 "b1_bloom_a": ("boss_b1", False, "MS.auto=true;g.toStage(s,2);s.p=.97;bloomTo(.22);"),
 "b1_bloom": ("boss_b1", False, "MS.auto=true;g.toStage(s,2);s.p=.97;bloomTo(.5);"),
 "b1_bloom_c": ("boss_b1", False, "MS.auto=true;g.toStage(s,2);s.p=.97;bloomTo(.85);"),
 "b1_rm": ("boss_b1", True, "MS.auto=true;g.toStage(s,2);s.p=.97;until(()=>false,300);document.querySelector('#mCard').style.display='none';"),
 "b1_down": ("boss_b1", False, "MS.auto=true;g.toStage(s,1);until(()=>s.st===1&&s.stT>2,3000);MS.auto=false;s.wisps=[];s.slow=0;const L=s.lights;for(let i=0;i<3;i++){L[i].cool=3.5-i;}tick(30);"),
 # --- boss_b2: The Still Center ---
 "b2_w1": ("boss_b2", False, "MS.auto=false;g.init(s);s.x=128;s.y=198;s.hub=5;tick(3);"),
 "b2_w2": ("boss_b2", False, "MS.auto=true;g.toStage(s,1);until(()=>s.st===1&&s.stT>4&&s.prizes.length>=2,4000);MS.auto=false;s.x=122;s.y=196;s.brace=false;tick(2);"),
 "b2_w2b": ("boss_b2", False, "MS.auto=false;g.toStage(s,1);s.x=100;s.y=180;s.prizes.push(g._t.mkPrize(s.x+2,s.y-6,0,10,2));s.brace=true;MS.inp=miniBlankInp();tick(1);"),
 "b2_w3": ("boss_b2", False, "MS.auto=true;g.toStage(s,2);until(()=>s.st===2&&s.stT>4.4,4000);MS.auto=false;"),
 "b2_w3b": ("boss_b2", False, "MS.auto=false;g.toStage(s,2);s.x=122;s.y=190;tick(40);"),
 "b2_bloom_a": ("boss_b2", False, "MS.auto=true;g.toStage(s,2);s.hub=29.97;bloomTo(.2);"),
 "b2_bloom": ("boss_b2", False, "MS.auto=true;g.toStage(s,2);s.hub=29.97;bloomTo(.5);"),
 "b2_bloom_c": ("boss_b2", False, "MS.auto=true;g.toStage(s,2);s.hub=29.97;bloomTo(.9);"),
 "b2_rm": ("boss_b2", True, "MS.auto=true;g.toStage(s,2);s.hub=29.97;until(()=>false,300);document.querySelector('#mCard').style.display='none';"),
}
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
async def main(names):
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Q, directory="work")); threading.Thread(target=srv.serve_forever, daemon=True).start()
    os.makedirs(OUT, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for rm in (False, True):
            todo = [n for n in names if JOBS[n][1] == rm]
            if not todo: continue
            ctx = await b.new_context(viewport={"width": 393, "height": 852}, device_scale_factor=2, is_mobile=True, has_touch=True, reduced_motion="reduce" if rm else "no-preference")
            pg = await ctx.new_page(); errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
            async def route(r):
                u = r.request.url
                if "/_blob/" in u:
                    h = glob.glob("blobs/" + u.split("/_blob/")[1][:32] + ".*")
                    return await r.fulfill(path=h[0]) if h else await r.fulfill(status=404, body="")
                if u.startswith("http://127.0.0.1"): return await r.continue_()
                return await r.abort()
            await pg.route("**/*", route)
            await pg.goto(f"http://127.0.0.1:{srv.server_address[1]}/index.html"); await pg.wait_for_timeout(500)
            for n in todo:
                gid, _, js = JOBS[n]
                await pg.evaluate("""(id)=>{const g=MINI[id];enterLevel(g.land);startMini(id,{boss:true});MS.i=g.setup.length;miniAct('mbegin');MS.auto=false;stopMiniLoop();const c=document.querySelector('#mCard');if(c)c.style.display=''}""", gid)
                await pg.wait_for_timeout(1000)
                try:
                    r = await pg.evaluate("(id)=>{const g=MINI[id],s=MS.s;" + HELP + js + ";miniDraw();return [MS.mode,s.st,+(s.p||s.hub||0).toFixed(2),+(s.stT||0).toFixed(2),+(MS.bk||0).toFixed(2)]}", gid)
                except Exception as e:
                    r = "ERR " + str(e)[:300]
                await pg.wait_for_timeout(300)
                await pg.evaluate("()=>{const b=document.querySelector('#mBanner');if(b)b.classList.add('hide');if(typeof miniSayClear==='function')miniSayClear()}"); await pg.wait_for_timeout(200)
                await pg.screenshot(path=f"{OUT}/{n}.png"); print(n, r, errs[-2:])
            await ctx.close()
        await b.close()
    srv.shutdown()
    from PIL import Image
    for rid, parts in (("b1", ["b1_w1", "b1_w2", "b1_w3", "b1_bloom"]), ("b2", ["b2_w1", "b2_w2", "b2_w3", "b2_bloom"])):
        fs = [f"{OUT}/{q}.png" for q in parts]
        if not all(os.path.exists(f) for f in fs): continue
        ims = [Image.open(f).convert("RGB") for f in fs]; w, h = ims[0].size; sc = .5
        sheet = Image.new("RGB", (int(w * sc) * 4 + 30, int(h * sc) + 20), (20, 16, 28))
        for i, im in enumerate(ims): sheet.paste(im.resize((int(w * sc), int(h * sc))), (10 + i * (int(w * sc) + 3), 10))
        sheet.save(f"{OUT}/boss-{rid.replace('b', 'b')}.jpg".replace("boss-b1", "boss-b1").replace("boss-b2", "boss-b2"), quality=88)
names = sys.argv[1:] or list(JOBS)
asyncio.run(main(names))
