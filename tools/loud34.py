"""Design-time: peak level (dBFS) of sounds through the page's synth, rendered offline. python3 tools/loud34.py name1 name2 ..."""
import asyncio, sys, functools, http.server, threading, json
from playwright.async_api import async_playwright
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
async def main():
    srv=http.server.ThreadingHTTPServer(("127.0.0.1",0),functools.partial(Q,directory="work")); threading.Thread(target=srv.serve_forever,daemon=True).start()
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await (await b.new_context()).new_page()
        await pg.route("**/*", lambda r: r.continue_() if r.request.url.startswith("http://127.0.0.1") else r.abort())
        await pg.goto(f"http://127.0.0.1:{srv.server_address[1]}/index.html"); await pg.wait_for_timeout(500)
        r=await pg.evaluate("""async(names)=>{const out={};for(const n of names){const oc=new OfflineAudioContext(1,44100*3,44100);AU.ctx=oc;const g=oc.createGain();g.gain.value=.9;const m=oc.createGain();m.gain.value=.8;g.connect(m);m.connect(oc.destination);AU.sfx=g;AU.noise=null;
          AU.trim=TRIM[n]||1;try{SFX[n](n==='chop'?0:1)}finally{AU.trim=1}const buf=await oc.startRendering();const d=buf.getChannelData(0);let pk=0,sq=0;for(let i=0;i<d.length;i++){const v=Math.abs(d[i]);if(v>pk)pk=v;sq+=d[i]*d[i]}
          out[n]=[+(20*Math.log10(pk||1e-9)).toFixed(1),+(10*Math.log10(sq/d.length+1e-12)).toFixed(1),TRIM[n]||1]}return out}""", sys.argv[1:])
        for k,v in r.items(): print(f"{k:12} peak {v[0]:6} dBFS  rms {v[1]:6}  trim {v[2]}")
        await b.close()
    srv.shutdown()
asyncio.run(main())
