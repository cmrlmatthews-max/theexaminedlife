"""Quick iteration: python3 tools/try.py <id> [--shots DIR] [--rm]. Plays auto to a win (logging stages), then screenshots each stage with real art."""
import asyncio, sys, os, glob, json, functools, http.server, threading
from playwright.async_api import async_playwright
ID = sys.argv[1]; SHOTS = sys.argv[sys.argv.index("--shots")+1] if "--shots" in sys.argv else None; RMODE = "--rm" in sys.argv
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
async def main():
    srv = http.server.ThreadingHTTPServer(("127.0.0.1",0), functools.partial(Q, directory="work")); threading.Thread(target=srv.serve_forever,daemon=True).start()
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(viewport={"width":393,"height":852},device_scale_factor=2,is_mobile=True,has_touch=True,reduced_motion="reduce" if RMODE else "no-preference")
        pg = await ctx.new_page(); errs=[]; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: errs.append("console: "+m.text) if m.type=="error" else None)
        async def route(r):
            u=r.request.url
            if "/_blob/" in u:
                h=glob.glob("blobs/"+u.split("/_blob/")[1][:32]+".*")
                return await r.fulfill(path=h[0]) if h else await r.fulfill(status=404,body="")
            if u.startswith("http://127.0.0.1"): return await r.continue_()
            return await r.abort()
        await pg.route("**/*", route)
        await pg.goto(f"http://127.0.0.1:{srv.server_address[1]}/index.html"); await pg.wait_for_timeout(500)
        r = await pg.evaluate("""(id)=>{const g=MINI[id];const cv=document.createElement('canvas');cv.width=384;cv.height=640;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);
          const s={W:192,H:320,rm:RM.matches,t:0};g.init(s);const log=[];let last=-1,won=-1,err='';
          try{for(let i=0;i<(g.limit||300)/.05;i++){const inp=miniBlankInp();s.t+=.05;g.auto(s,inp);const res=g.step(s,.05,inp);if(i%4===0)g.draw(s,c,i*50);
            if(s.st!==last){log.push([+s.t.toFixed(1),s.st]);last=s.st}if(res==='win'){won=s.t;g.bloom(s,c,.5,0);g.bloom(s,c,1,0);break}if(res==='end'){log.push([+s.t.toFixed(1),'end']);if(g.toStage){const n=s.st;g.toStage(s,n)}else g.init(s)}}}catch(e){err=String(e.stack||e).slice(0,400)}
          return {log,won,err,rate:g.rate?g.rate(s):null,dbg:g._dbg?g._dbg(s):null}}""", ID)
        print(json.dumps(r)); 
        if SHOTS:
            os.makedirs(SHOTS,exist_ok=True)
            await pg.evaluate("""(id)=>{const g=MINI[id];enterLevel(g.land);startMini(id);MS.i=g.setup.length;miniAct('mbegin');MS.auto=true;stopMiniLoop()}""", ID)
            await pg.wait_for_timeout(1200)
            for k in range(3):
                ok = await pg.evaluate("""(k)=>{for(let i=0;i<7000&&MS.mode==='play';i++){miniTick(.05);if(MS.s.st>k||(MS.s.st===k&&MS.s.stT>0.8&&(!MS.g.shotReady||MS.g.shotReady(MS.s))))break}miniDraw();return [MS.mode,MS.s.st,+MS.s.stT.toFixed(1)]}""", k)
                print('shot',k,ok); await pg.wait_for_timeout(250); await pg.screenshot(path=f"{SHOTS}/{ID}_{k}.png")
            await pg.evaluate("""()=>{for(let i=0;i<9000&&MS.mode==='play';i++)miniTick(.05);for(let i=0;i<60&&MS.mode==='bloom';i++)miniTick(.05);miniDraw()}""")
            await pg.wait_for_timeout(700); await pg.screenshot(path=f"{SHOTS}/{ID}_bloom.png")
            await pg.evaluate("""()=>{for(let i=0;i<400&&MS.mode==='bloom';i++)miniTick(.05);miniDraw()}"""); await pg.wait_for_timeout(2500)
            await pg.screenshot(path=f"{SHOTS}/{ID}_result.png")
        print("errors:", errs[:6]); await b.close()
    srv.shutdown()
asyncio.run(main())
