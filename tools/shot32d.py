"""python3 tools/shot32d.py <outdir> : Phase 32D screenshots for The View from Above (levels, mid-zoom, duties, Reduce Motion, plate)."""
import asyncio, sys, os, glob, functools, http.server, threading
from playwright.async_api import async_playwright
OUT = sys.argv[1]
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
async def run(p, srv, rm):
    b = await p.chromium.launch()
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
    await pg.evaluate("""()=>{const g=MINI.above;enterLevel(g.land);startMini('above');MS.i=g.setup.length;miniAct('mbegin');stopMiniLoop();$("#mBanner").classList.add("hide")}""")
    await pg.wait_for_timeout(1500)
    return b, pg, errs
async def shot(pg, name, js):
    await pg.evaluate("(js)=>{const g=MS.g;const s=MS.s=newMiniState(g);$('#mBanner').classList.add('hide');miniSayClear();const T=g._t;" + "%s" % "" + "(new Function('s','g','T','MS',js))(s,g,T,MS);$('#mBanner').classList.add('hide');miniDraw()}", js)
    await pg.wait_for_timeout(300)
    await pg.screenshot(path=f"{OUT}/{name}.png")
async def main():
    os.makedirs(OUT, exist_ok=True)
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Q, directory="work")); threading.Thread(target=srv.serve_forever, daemon=True).start()
    async with async_playwright() as p:
        b, pg, errs = await run(p, srv, False)
        up = lambda z, lvl: f"s.lvl={lvl};for(let i=0;i<{lvl};i++)s.taken[i]=true;s.z={z};if({z}>{lvl})s.taken[{lvl}]=true;"
        await shot(pg, "above_l0", "s.stT=2;")
        await shot(pg, "above_zoom01", up(.5, 0))
        await shot(pg, "above_zoom12", up(1.5, 1))
        await shot(pg, "above_zoom23", up(2.5, 2))
        await shot(pg, "above_zoom34", up(3.5, 3))
        await shot(pg, "above_zoom34b", up(3.8, 3))
        await shot(pg, "above_2a", up(2, 2))
        await shot(pg, "above_2a3", up(3, 3))
        await shot(pg, "above_2a4", up(4, 4))
        await shot(pg, "above_2b", "g.toStage(s,1);s.bt=1.5;s.hold=true;s.sa=.05;")
        await shot(pg, "above_2b2", "g.toStage(s,1);s.bt=9;s.hold=true;")
        await shot(pg, "above_desc", "g.toStage(s,2);s.z=2.2;s.cp=T.cloudAt(s,2.2,0);s.mv=1;s.desc=true;")
        await shot(pg, "above_2c", "g.toStage(s,2);s.z=0;s.cp={x:95,y:172};s.mq=[];s.desc=true;")
        await shot(pg, "above_duty", "g.toStage(s,2);s.z=0;s.cp={x:130,y:190};s.mw={k:'horse',ph:'walk',t:0};s.mx=112;s.my=224;s.mfx=1;s.duties[0].done=true;s.done=1;s.desc=true;")
        await shot(pg, "above_duty2", "g.toStage(s,2);s.z=0;s.cp={x:100,y:172};s.mw={k:'letter',ph:'act',t:.5};s.mx=92;s.my=214;s.desc=true;")
        await shot(pg, "above_duty3", "g.toStage(s,2);s.z=0;s.cp={x:150,y:200};s.mw={k:'guard',ph:'act',t:.4};const G=g._t.STAND.guard;s.mx=G[0];s.my=G[1];s.duties[0].done=true;s.duties[1].done=true;s.done=2;s.desc=true;")
        print("errors", errs[:5]); await b.close()
        b, pg, errs = await run(p, srv, True)
        await shot(pg, "above_rm", "s.lvl=1;s.taken[0]=true;s.z=.5;")
        await shot(pg, "above_rm2", "g.toStage(s,2);s.z=2.4;s.cp=T.cloudAt(s,2.4,0);s.mv=1;")
        print("errors rm", errs[:5]); await b.close()
    srv.shutdown()
asyncio.run(main())
