"""python3 tools/shot34c.py [name ...] : Phase 34C screenshots (real art) into shots34c/, for The Web and If Everyone Did It.
Each job sets up a state in the page (JS below; MS = the mini session, s = its state, g = the game) and takes a screenshot of the page (the stage with the HUD, the pad, and the result card where it applies)."""
import asyncio, sys, os, glob, functools, http.server, threading
from playwright.async_api import async_playwright
OUT = "shots34c"
HELP = """
const tick=(n,dt)=>{for(let i=0;i<n;i++)miniTick(dt||.05)};
const until=(f,max)=>{for(let i=0;i<(max||4000)&&!f();i++)miniTick(.05)};
const T=g._t;
"""
RULE_TO = lambda sc, extra="": f"""MS.auto=false;g.init(s);T.load(s,{sc});s.stars=({sc}>=4?4:{sc}>=2?2:0);s.st={{0:0,1:0,2:1,3:1,4:2}}[{sc}];{extra}"""
# a wrong card on purpose: pick the first wrong card in the slot order, then run to the end of the "everyone" phase minus a little
def wrong(sc, kk, until):
    return f"""MS.auto=false;g.init(s);T.load(s,{sc});s.st={{0:0,1:0,2:1,3:1,4:2}}[{sc}];s.stars={sc};MS.mode='play';
      const j=s.order.indexOf({kk});T.pickCard(s,j);until(()=>s.ph==='every'&&s.u>={until},3000);"""
JOBS = {
 # --- web ---
 "web_taut": ("web", False, """MS.auto=false;const t=g._t;g.init(s);t.setStage(s,0);const K=s.k[1];t.pickup(s,1,'touch',0,0);K.x=96;K.y=190;s.dn=true;MS.inp=miniBlankInp();for(let i=0;i<6;i++){const inp=miniBlankInp();inp.down={x:K.x,y:K.y};g.step(s,.05,inp)}s.t=1;"""),
 "web_snap": ("web", False, """MS.auto=false;const t=g._t;g.init(s);t.setStage(s,0);t.pickup(s,1,'touch',0,0);const K=s.k[1];K.x=150;K.y=215;t.release(s);for(let i=0;i<5;i++)g.step(s,.05,miniBlankInp());"""),
 "web_change": ("web", False, """MS.auto=false;g.init(s);g.toStage(s,1);for(let i=0;i<31;i++)g.step(s,.05,miniBlankInp());"""),
 "web_home_dim": ("web", False, """MS.auto=false;g.init(s);g.toStage(s,2);for(let i=0;i<40;i++)g.step(s,.05,miniBlankInp());const K=s.k[3];K.x=96;K.y=150;for(let i=0;i<40;i++)g.step(s,.05,miniBlankInp());"""),
 "web_hold": ("web", False, """MS.auto=true;g.toStage(s,2);until(()=>s.st===2&&s.hold>2.6,4000);MS.auto=false;"""),
 "web_rm": ("web", True, """MS.auto=true;g.toStage(s,1);until(()=>s.st===1&&s.stT>3.6,4000);MS.auto=false;"""),
 # --- rule ---
 "rule_bread": ("rule", False, wrong(0, 1, 3.4)),
 "rule_well": ("rule", False, wrong(1, 1, 4.9)),
 "rule_scales": ("rule", False, wrong(2, 1, 3.4)),
 "rule_crier": ("rule", False, wrong(3, 1, 4.2)),
 "rule_promise_shut": ("rule", False, wrong(4, 1, 5.3)),
 "rule_promise_stop": ("rule", False, wrong(4, 2, 5.3)),
 "rule_stars": ("rule", False, """MS.auto=true;g.toStage(s,2);until(()=>s.st===2&&s.ph==='good'&&s.stars>=5&&s.u>1.2,5000);MS.auto=false;"""),
 "rule_rm": ("rule", True, wrong(0, 1, 3.4)),
 "rule_choose": ("rule", False, RULE_TO(0)),
 "rule_choose_well": ("rule", False, RULE_TO(1)),
 "rule_choose_promise": ("rule", False, RULE_TO(4)),
 "rule_you": ("rule", False, """MS.auto=false;g.init(s);T.load(s,0);T.pickCard(s,s.order.indexOf(1));until(()=>s.ph==='you'&&s.u>1.4,500);"""),
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
                await pg.evaluate("""(id)=>{const g=MINI[id];enterLevel(g.land);startMini(id);MS.i=g.setup.length;miniAct('mbegin');MS.auto=false;stopMiniLoop()}""", gid)
                await pg.wait_for_timeout(900)
                r = await pg.evaluate("(id)=>{const g=MINI[id],s=MS.s;" + HELP + "return 0}", gid)
                try:
                    r = await pg.evaluate("(id)=>{const g=MINI[id],s=MS.s;" + HELP + js + ";miniDraw();return [MS.mode,s.st,s.ph||'',+(s.u||s.stT||0).toFixed(2)]}", gid)
                except Exception as e:
                    r = "ERR " + str(e)[:300]
                await pg.wait_for_timeout(300)
                await pg.evaluate("()=>{const b=document.querySelector('#mBanner');if(b)b.classList.add('hide');if(typeof miniSayClear==='function')miniSayClear()}"); await pg.wait_for_timeout(200)
                await pg.screenshot(path=f"{OUT}/{n}.png"); print(n, r, errs[-2:])
            await ctx.close()
        await b.close()
    srv.shutdown()
names = sys.argv[1:] or list(JOBS)
asyncio.run(main(names))
