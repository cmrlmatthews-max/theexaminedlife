"""python3 tools/at32.py <id> <stage> <seconds> <out.png> [--rm] [--crop x,y,w,h] : auto-plays until stage K has run <seconds>, then a screenshot."""
import asyncio, sys, os, glob, functools, http.server, threading
from playwright.async_api import async_playwright
ID,K,SEC,OUT=sys.argv[1],int(sys.argv[2]),float(sys.argv[3]),sys.argv[4]; RMODE="--rm" in sys.argv
CROP=[float(v) for v in sys.argv[sys.argv.index("--crop")+1].split(",")] if "--crop" in sys.argv else None
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
        await pg.evaluate("""(id)=>{const g=MINI[id];enterLevel(g.land);startMini(id);MS.i=g.setup.length;miniAct('mbegin');MS.auto=true;stopMiniLoop()}""",ID)
        await pg.wait_for_timeout(1200)
        r=await pg.evaluate("""([k,sec])=>{for(let i=0;i<9000&&MS.mode==='play';i++){miniTick(.05);if(MS.s.st>k||(MS.s.st===k&&MS.s.stT>=sec))break}miniDraw();return [MS.mode,MS.s.st,+MS.s.stT.toFixed(1),MS.g._dbg?MS.g._dbg(MS.s):0]}""",[K,SEC])
        print(r); await pg.wait_for_timeout(300)
        if "--banner" not in sys.argv:   # the fast-forward leaves the stage banner and strip showing; hide them for a clean shot
            await pg.evaluate("()=>{const b=document.querySelector('#mBanner');if(b)b.classList.add('hide');if(typeof miniSayClear==='function')miniSayClear()}"); await pg.wait_for_timeout(200)
        kw={"path":OUT}
        if CROP: kw["clip"]={"x":CROP[0],"y":CROP[1],"width":CROP[2],"height":CROP[3]}
        await pg.screenshot(**kw); print("errors",errs[:5]); await b.close()
    srv.shutdown()
asyncio.run(main())
