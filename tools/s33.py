"""python3 tools/s33.py <id> <out.png> "<js body using s (state), g (game), tick(sec,fn)>" [--rm] [--stage N] : start the game with real art, run JS against the state, screenshot the stage.
tick(sec,fn) steps the game (dt .05) with miniTick-free direct g.step; fn(inp,i) may edit the input each step. The result screen is not used."""
import asyncio, sys, os, glob, functools, http.server, threading
from playwright.async_api import async_playwright
ID,OUT,JS=sys.argv[1],sys.argv[2],sys.argv[3]; RMODE="--rm" in sys.argv
ST=int(sys.argv[sys.argv.index("--stage")+1]) if "--stage" in sys.argv else 0
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
        await pg.evaluate("""([id,st])=>{const g=MINI[id];enterLevel(g.land);startMini(id);MS.i=g.setup.length;miniAct('mbegin');stopMiniLoop();if(st>0){MS.s=newMiniState(g);g.toStage(MS.s,st)}}""",[ID,ST])
        await pg.wait_for_timeout(1500)
        r=await pg.evaluate("""(js)=>{const s=MS.s,g=MS.g;const tick=(sec,fn)=>{for(let i=0;i<sec/.05;i++){const inp=miniBlankInp();if(fn)fn(inp,i);s.t+=.05;const r=g.step(s,.05,inp);if(r)return r}};
          let out;try{out=eval(js)}catch(e){out='ERR '+e.stack}miniDraw();return out}""",JS)
        print(r); await pg.wait_for_timeout(500)
        # hide the banner/say for clean shots
        await pg.evaluate("()=>{const b=document.querySelector('#mBanner');if(b)b.classList.add('hide');if(typeof miniSayClear==='function')miniSayClear()}")
        await pg.wait_for_timeout(100)
        await pg.screenshot(path=OUT); print("errors",errs[:5]); await b.close()
    srv.shutdown()
asyncio.run(main())
