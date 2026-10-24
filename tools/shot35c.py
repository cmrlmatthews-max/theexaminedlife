"""python3 tools/shot35c.py [name ...] : Phase 35C screenshots (real art) into shots35c/, for the boss rounds Open Hands (boss_b3) and The Three Lenses (boss_b4).
One mid-play shot per wave per round (for b4 also a lens active and the third way showing), bloom frames (normal) and a Reduce Motion still, plus two contact sheets (boss-b3.jpg, boss-b4.jpg: three waves + the bloom side by side).
Each job sets up a state in the page (JS below; MS = the mini session, s = its state, g = the game) and takes a screenshot of the page (the stage, the HUD, the pad)."""
import asyncio, sys, os, glob, functools, http.server, threading
from playwright.async_api import async_playwright
OUT = "shots35c"
HELP = """
const tick=(n,dt)=>{for(let i=0;i<n;i++)miniTick(dt||.05)};
const until=(f,max)=>{for(let i=0;i<(max||4000)&&!f()&&MS.mode==='play';i++)miniTick(.05)};
const bloomTo=(k)=>{for(let i=0;i<3000&&MS.mode!=='bloom'&&MS.mode!=='result';i++)miniTick(.05);for(let i=0;i<600&&MS.mode==='bloom'&&MS.bk<k;i++)miniTick(.05)};
"""
JOBS = {
 # --- boss_b3: Open Hands ---
 "b3_w1": ("boss_b3", False, "MS.auto=false;g.init(s);until(()=>s.drops>=2&&s.arms.some(a=>a.ph==='r'&&a.u>.55),800);"),
 "b3_w2": ("boss_b3", False, "MS.auto=false;g.toStage(s,1);tick(100);for(const i of [1,5,6]){if(!s.slots[i])g._t.put(s,i,2+i%2)}s.slots[3]=s.slots[3]||g._t.put(s,3,0);s.slots[4]=s.slots[4]||g._t.put(s,4,1);s.grip=5;s.hold=.62;s.slots[5].heavy=true;"),
 "b3_w3": ("boss_b3", False, "MS.auto=false;g.toStage(s,2);tick(260);"),
 "b3_w3b": ("boss_b3", False, "MS.auto=true;g.toStage(s,2);until(()=>s.st===2&&s.done>=20,4000);MS.auto=false;tick(4);"),
 "b3_bloom_a": ("boss_b3", False, "MS.auto=true;bloomTo(.15);"),
 "b3_bloom": ("boss_b3", False, "MS.auto=true;bloomTo(.4);"),
 "b3_bloom_c": ("boss_b3", False, "MS.auto=true;bloomTo(.7);"),
 "b3_bloom_z": ("boss_b3", False, "MS.auto=true;bloomTo(.98);"),
 "b3_rm": ("boss_b3", True, "MS.auto=true;until(()=>false,6000);document.querySelector('#mCard').style.display='none';"),
 # --- boss_b4: The Three Lenses ---
 "b4_w1": ("boss_b4", False, "MS.auto=false;g.init(s);s.tt=9;s.tp=g._t.START+(g._t.STOP-g._t.START)*.3;tick(3);"),
 "b4_w1g": ("boss_b4", False, "MS.auto=false;g.init(s);s.tt=12;s.tp=g._t.START+(g._t.STOP-g._t.START)*.4;s.act=0;s.actT=.8;s.seen[0]=true;tick(20);"),
 "b4_w1s": ("boss_b4", False, "MS.auto=false;g.init(s);s.tt=12;s.tp=g._t.START+(g._t.STOP-g._t.START)*.4;s.act=1;s.actT=.8;s.seen=[true,true,false];tick(20);"),
 "b4_w1b": ("boss_b4", False, "MS.auto=false;g.init(s);s.tt=14;s.tp=g._t.START+(g._t.STOP-g._t.START)*.47;s.seen=[true,true,true];s.act=2;s.actT=1;tick(12);s.act=-1;tick(25);"),
 "b4_w1c": ("boss_b4", False, "MS.auto=false;g.init(s);s.tt=14;s.tp=g._t.START+(g._t.STOP-g._t.START)*.47;s.seen=[true,true,false];s.act=2;s.actT=.8;tick(25);"),
 "b4_w2c": ("boss_b4", False, "MS.auto=false;g.toStage(s,1);s.tt=10;s.tp=g._t.START+(g._t.STOP-g._t.START)*.33;s.act=2;s.actT=1;s.seen=[true,true,false];tick(25);"),
 "b4_w2": ("boss_b4", False, "MS.auto=false;g.toStage(s,1);s.tt=10;s.tp=g._t.START+(g._t.STOP-g._t.START)*.33;s.act=0;s.actT=1;s.seen=[true,false,false];tick(20);"),
 "b4_w2s": ("boss_b4", False, "MS.auto=false;g.toStage(s,1);s.tt=10;s.tp=g._t.START+(g._t.STOP-g._t.START)*.33;s.act=1;s.actT=1;s.seen=[true,true,false];tick(20);"),
 "b4_w2b": ("boss_b4", False, "MS.auto=false;g.toStage(s,1);s.tt=10;s.tp=g._t.START+(g._t.STOP-g._t.START)*.33;s.act=2;s.actT=1;s.seen=[true,true,true];tick(20);s.act=-1;tick(25);"),
 "b4_w2m": ("boss_b4", False, "MS.auto=false;g.toStage(s,1);s.seen=[true,true,true];tick(5);s.solved=true;s.ok=2.4;s.sv=0;s.tp0=s.tp;sfx('click');tick(14);"),
 "b4_w3": ("boss_b4", False, "MS.auto=false;g.toStage(s,2);s.tt=10;s.tp=g._t.START+(g._t.STOP-g._t.START)*.33;s.act=2;s.actT=1;s.seen=[true,true,false];tick(25);"),
 "b4_w3g": ("boss_b4", False, "MS.auto=false;g.toStage(s,2);s.tt=10;s.tp=g._t.START+(g._t.STOP-g._t.START)*.33;s.act=0;s.actT=1;s.seen=[true,true,false];tick(25);"),
 "b4_w3b": ("boss_b4", False, "MS.auto=false;g.toStage(s,2);s.tt=10;s.tp=g._t.START+(g._t.STOP-g._t.START)*.33;s.seen=[true,true,true];tick(25);s.hold={m:'p'};s.ox=112;s.oy=200;"),
 "b4_w3c": ("boss_b4", False, "MS.auto=false;g.toStage(s,2);s.tt=10;s.tp=g._t.START+(g._t.STOP-g._t.START)*.33;s.seen=[true,true,true];tick(5);s.ox=88;s.oy=204;s.solved=true;s.ok=3.8;s.sv=0;s.tp0=s.tp;tick(40);"),
 "b4_stop": ("boss_b4", False, "MS.auto=false;g.init(s);s.seen=[true,false,false];s.tt=29.9;s.tp=g._t.STOP-.05;tick(30);"),
 "b4_bloom_a": ("boss_b4", False, "MS.auto=true;g.toStage(s,2);s.done=2;s.seen=[true,true,true];s.solved=true;s.ok=.02;s.tp0=s.tp;bloomTo(.15);"),
 "b4_bloom": ("boss_b4", False, "MS.auto=true;g.toStage(s,2);s.done=2;s.seen=[true,true,true];s.solved=true;s.ok=.02;s.tp0=s.tp;bloomTo(.4);"),
 "b4_bloom_c": ("boss_b4", False, "MS.auto=true;g.toStage(s,2);s.done=2;s.seen=[true,true,true];s.solved=true;s.ok=.02;s.tp0=s.tp;bloomTo(.7);"),
 "b4_bloom_z": ("boss_b4", False, "MS.auto=true;g.toStage(s,2);s.done=2;s.seen=[true,true,true];s.solved=true;s.ok=.02;s.tp0=s.tp;bloomTo(.98);"),
 "b4_rm": ("boss_b4", True, "MS.auto=true;g.toStage(s,2);s.done=2;s.seen=[true,true,true];s.solved=true;s.ok=.02;s.tp0=s.tp;until(()=>false,300);document.querySelector('#mCard').style.display='none';"),
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
    for rid, parts in (("b3", ["b3_w1", "b3_w2", "b3_w3", "b3_bloom_z"]), ("b4", ["b4_w1g", "b4_w2s", "b4_w3b", "b4_bloom_z"])):
        fs = [f"{OUT}/{q}.png" for q in parts]
        if not all(os.path.exists(f) for f in fs): continue
        ims = [Image.open(f).convert("RGB") for f in fs]; w, h = ims[0].size; sc = .5
        sheet = Image.new("RGB", (int(w * sc) * 4 + 30, int(h * sc) + 20), (20, 16, 28))
        for i, im in enumerate(ims): sheet.paste(im.resize((int(w * sc), int(h * sc))), (10 + i * (int(w * sc) + 3), 10))
        sheet.save(f"{OUT}/boss-{rid}.jpg", quality=88)
names = sys.argv[1:] or list(JOBS)
asyncio.run(main(names))
