"""python3 tools/shotc.py <id> <stage> <seconds> <out.png> [--rm] [--pre JS] [--post JS] [--auto-until SEC] [--crop x,y,w,h]
Auto-plays to the start of <stage>, then (auto OFF) steps the game to <seconds> into the stage with an optional JS run first (--pre, with s = state, g = game)
and again after (--post), and takes a screenshot. For looking at a harm's warning, a silenced speaker, the door, and so on."""
import asyncio, sys, os, glob, functools, http.server, threading
from playwright.async_api import async_playwright
ID,K,SEC,OUT=sys.argv[1],int(sys.argv[2]),float(sys.argv[3]),sys.argv[4]; RMODE="--rm" in sys.argv
arg=lambda n,d="": sys.argv[sys.argv.index(n)+1] if n in sys.argv else d
PRE,POST=arg("--pre"),arg("--post");AU=float(arg("--auto-until","0")); CROP=[float(v) for v in arg("--crop").split(",")] if "--crop" in sys.argv else None
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
        r=await pg.evaluate("""([k,sec,pre,post,au])=>{const g=MS.g,s=MS.s;
          for(let i=0;i<9000&&MS.mode==='play'&&!(s.st===k&&s.stT>0.05);i++)miniTick(.05);
          MS.auto=au>0;if(pre)eval(pre);
          for(let i=0;i<9000&&MS.mode==='play'&&s.stT<sec;i++){if(au>0&&s.stT>=au)MS.auto=false;miniTick(.05)}
          if(post)eval(post);miniDraw();return [MS.mode,s.st,+s.stT.toFixed(2),s.lamp,s.stopped,!!s.h]}""",[K,SEC,PRE,POST,AU])
        print(r); await pg.wait_for_timeout(300)
        await pg.evaluate("()=>{const b=document.querySelector('#mBanner');if(b)b.classList.add('hide');if(typeof miniSayClear==='function')miniSayClear()}"); await pg.wait_for_timeout(200)
        kw={"path":OUT}
        if CROP: kw["clip"]={"x":CROP[0],"y":CROP[1],"width":CROP[2],"height":CROP[3]}
        await pg.screenshot(**kw); print("errors",errs[:5]); await b.close()
    srv.shutdown()
asyncio.run(main())
