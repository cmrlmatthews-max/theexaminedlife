"""python3 tools/shot32.py <id> <outdir> [--rm] : auto-plays to the win, then shots of the bloom at several points and the result (plate) screen."""
import asyncio, sys, os, glob, functools, http.server, threading
from playwright.async_api import async_playwright
ID=sys.argv[1]; OUT=sys.argv[2]; RMODE="--rm" in sys.argv
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
async def main():
    srv=http.server.ThreadingHTTPServer(("127.0.0.1",0),functools.partial(Q,directory="work")); threading.Thread(target=srv.serve_forever,daemon=True).start()
    async with async_playwright() as p:
        b=await p.chromium.launch()
        ctx=await b.new_context(viewport={"width":393,"height":852},device_scale_factor=2,is_mobile=True,has_touch=True,reduced_motion="reduce" if RMODE else "no-preference")
        pg=await ctx.new_page(); errs=[]; pg.on("pageerror",lambda e:errs.append(str(e)))
        async def route(r):
            u=r.request.url
            if "/_blob/" in u:
                h=glob.glob("blobs/"+u.split("/_blob/")[1][:32]+".*")
                return await r.fulfill(path=h[0]) if h else await r.fulfill(status=404,body="")
            if u.startswith("http://127.0.0.1"): return await r.continue_()
            return await r.abort()
        await pg.route("**/*",route)
        await pg.goto(f"http://127.0.0.1:{srv.server_address[1]}/index.html"); await pg.wait_for_timeout(500)
        os.makedirs(OUT,exist_ok=True)
        await pg.evaluate("""(id)=>{const g=MINI[id];enterLevel(g.land);startMini(id);MS.i=g.setup.length;miniAct('mbegin');MS.auto=true;stopMiniLoop()}""",ID)
        await pg.wait_for_timeout(1200)
        await pg.evaluate("""()=>{for(let i=0;i<9000&&MS.mode==='play';i++)miniTick(.05)}""")
        for k in [.15,.35,.55,.8]:
            await pg.evaluate("(k)=>{MS.mode='bloom';MS.bk=k;miniDraw()}",k); await pg.wait_for_timeout(250)
            await pg.screenshot(path=f"{OUT}/{ID}_bloom{int(k*100)}.png")
        await pg.evaluate("""()=>{for(let i=0;i<400&&MS.mode==='bloom';i++)miniTick(.05);miniResult();miniDraw()}"""); await pg.wait_for_timeout(2500)
        await pg.screenshot(path=f"{OUT}/{ID}_plate.png"); print("errors",errs[:5]); await b.close()
    srv.shutdown()
asyncio.run(main())
