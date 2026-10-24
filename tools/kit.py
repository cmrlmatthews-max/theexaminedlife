#!/usr/bin/env python3
"""
The Examined Life — test kit (for Claude sessions working on the game).

Run it, don't read it:
  python3 /mnt/project/examined-life-testkit.py GAME.html
  python3 /mnt/project/examined-life-testkit.py GAME.html --require core,p1
  python3 /mnt/project/examined-life-testkit.py GAME.html --pairs          # print every wrong answer + its reply
  python3 /mnt/project/examined-life-testkit.py GAME.html --shots /tmp/shots
  python3 /mnt/project/examined-life-testkit.py GAME.html --dump-world /tmp/world_before.json
  python3 /mnt/project/examined-life-testkit.py GAME.html --compare-world /tmp/world_before.json
  python3 /mnt/project/examined-life-testkit.py GAME.html --blobs DIR --tour /tmp/tour   # real art + one screenshot per thinker

Check groups:
  core   must ALWAYS pass (syntax, data, answer balance, map, full playthrough, key screens)
  p0..p9 one group per plan phase (p8 has none); each is expected to FAIL until that phase is done
p28  Phase 28 fix-up: spawn spots, boss prompt position, tile-waiting backgrounds, wording fixes
p20 / addendum  the mini-game stage (Phase 20) and the lantern/bloom rules (plan 3 addendum); later phases call mini_suite(b, group, ids)
p26  sound (Phase 26): sfx_safe, sound_wired, sound_toggle, ambient_stops
p35  Phases 35B-35C: the rebuilt boss rounds b1-b4 (mini_suite, hd_suite, rule checks)
p25  the four boss rounds: mini_suite on boss_b1..boss_b4 (ids starting with boss_ have no artifact), boss_round_placed, boss_round_flow, boss_round_leaves_no_trace
--mini-shots DIR saves 3 screenshots per mini-game (setup card, mid-play, win card); add --blobs DIR to see real art
--mini-ids a,b limits --mini-shots to those game ids (the full 18-game run can time out)
--blobs DIR serves the game's art from files named <asset id>.<ext> (fetch them with the Artifact tool's
  read action: path=<asset id>, out_dir=DIR). Without it, art can't load and the game uses its fallbacks.
Exit code 1 if any check in a --require'd group fails (default --require core).
"""
import argparse, asyncio, functools, glob, http.server, json, os, re, subprocess, sys, tempfile, threading

CHROME = "/opt/google/chrome/chrome"
LEVEL_IDS_JS = "(typeof LEVEL_DEFS!=='undefined')?Object.keys(LEVEL_DEFS):['l1']"

# Builds a level's world data using the new API (Phase 5+) or the old one (before).
HELPERS_JS = r"""
window.__kitDef = function(id){
  // Phase 5+: buildLevel(id) must build AND paint the level (sets G, BAR, props, npcs, arts, signs, mapCv, CUR).
  if (typeof LEVEL_DEFS!=='undefined' && typeof buildLevel==='function'){ buildLevel(id); return LEVEL_DEFS[id]; }
  genL1(); paintMap(); return L1;
};
window.__kitEnter = function(id){
  if (typeof buildLevel==='function' && typeof enterLevel==='function'){ enterLevel(id); return; }
  enterWorld();
};
window.__kitPlay = async function(ids, opts){
  opts = opts || {};
  const out=[]; const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  for (const lid of ids){
    const D = __kitDef(lid);
    for (const st of D.stations){
      if (opts.skip && opts.skip.includes(st.id)) continue;
      const n = npcs.find(x=>x.id===st.id);
      if(!n){ out.push({id:st.id, ok:false, why:'npc missing'}); continue; }
      if(!st.boss && typeof ARTI!=='undefined' && ARTI[st.id]) ARTI[st.id].items.forEach((_,i)=>P.f[st.id+':'+i]=1);
      startTalk(n);
      let missed=false, guard=0, asks=0;
      while (TK && guard++<300){
        if (TK.typing){ finishType(); continue; }
        const s = TK.fb || TK.steps[TK.i];
        if (!TK.fb && s.t==='ask'){ asks++; if(!missed){ reply(1); missed=true; } else { reply(0); missed=false; } continue; }
        if (!TK.fb && s.t==='choice'){
          const k = s.opts.findIndex(o=>o.a===(opts.choice||'bye'));
          choose(k>=0?k:s.opts.findIndex(o=>o.a==='bye'));
          if (!TK || TK.steps[TK.i]===s) break;
          continue;
        }
        if (!TK.fb && s.t==='mini'){ if (typeof MS!=='undefined' && MS){ miniAct('mbegin'); miniWin(); miniResult(); miniAct('mcontinue'); } else { advance(); } continue; }
        if (!TK.fb && s.t==='reflect'){
          if (opts.reflect){ const rb=document.querySelector('#reflectBox'); if(rb){ rb.value=opts.reflect; document.querySelector('[data-act="reflectsave"]').click(); } else { advance(); } }
          else if (typeof reflectAdvance==='function') reflectAdvance();
          else advance();
          continue;
        }
        advance();
      }
      await sleep(40);
      for (let k=0;k<5;k++){
        const vn=document.querySelector('#reveal:not(.hide) [data-act="vidnext"]'); if(vn){ vn.click(); await sleep(40); continue; }
        if (opts.stopAtReveal) break;
        const rd=document.querySelector('#reveal:not(.hide) [data-act="revealdone"]'); if(rd){ rd.click(); await sleep(40); continue; }
        break;
      }
      out.push({id:st.id, ok:!!P.c[st.id], asks, guard});
    }
  }
  return out;
};
window.__kitToAsk = function(){
  let g=0;
  while (TK && g++<50){
    if (TK.typing){ finishType(); continue; }
    const s=TK.fb||TK.steps[TK.i];
    if (!TK.fb && s.t==='ask' && document.querySelectorAll('#replies .reply').length) return true;
    advance();
  }
  return false;
};
"""

class _Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

def _serve(directory):
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(_Quiet, directory=directory))
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd

class Kit:
    def __init__(self, path, args):
        self.path = os.path.abspath(path)
        self.url = "file://" + self.path   # replaced by a local http:// address in run()
        self.args = args
        self.results = []   # (group, name, status, detail)

    def mini_files(self):
        d = os.path.join(os.path.dirname(self.path), "mini")
        return sorted(glob.glob(os.path.join(d, "*.js"))) if os.path.isdir(d) else []

    def all_src(self):
        """The page plus every mini/*.js file (Phase 29 split the games out of the page)."""
        parts = [open(self.path, encoding="utf-8").read()]
        for f in self.mini_files():
            parts.append(open(f, encoding="utf-8").read())
        return "\n".join(parts)

    def add(self, group, name, ok, detail=""):
        self.results.append((group, name, "PASS" if ok is True else ("INFO" if ok is None else "FAIL"), detail))

    async def page(self, b, w=393, h=852, dpr=3, reduced=False, init=None, block=None, extra_blobs=None, url=None, req_log=None, req_filter=None):
        ctx = await b.new_context(viewport={"width": w, "height": h}, device_scale_factor=dpr,
                                  is_mobile=True, has_touch=True,
                                  reduced_motion="reduce" if reduced else "no-preference")
        pg = await ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        blobs = self.args.blobs
        async def handle(route):
            url = route.request.url
            if url.startswith("http://127.0.0.1"):
                if block and any(url.split("?")[0].endswith(x) for x in block):
                    return await route.abort()
                if "/_blob/" in url:
                    bid = url.split("/_blob/")[1].split("?")[0][:32]
                    if extra_blobs and bid in extra_blobs:
                        return await route.fulfill(path=extra_blobs[bid])
                    if blobs:
                        hits = glob.glob(os.path.join(blobs, bid + ".*"))
                        if hits:
                            return await route.fulfill(path=hits[0])
                    return await route.fulfill(status=404, body="")
                return await route.continue_()
            return await route.abort()
        await pg.route("**/*", handle)
        if req_log is not None:  # Phase 44: record requests for the given blob ids (voice clips)
            pg.on("request", lambda r: req_log.append(r.url) if "/_blob/" in r.url and (not req_filter or r.url.split("/_blob/")[1][:32] in req_filter) else None)
        if init:
            await pg.add_init_script(init)
        await pg.goto(url or self.url)
        await pg.wait_for_timeout(350)
        await pg.evaluate(HELPERS_JS)
        if getattr(self, "_post_js", None):  # Phase 38: a test may register a kit-only game (MINI._t5) on every page it opens
            await pg.evaluate(self._post_js)
        return ctx, pg, errs

    # ---------------- CORE ----------------
    def check_syntax(self):
        src = open(self.path, encoding="utf-8").read()
        m = re.search(r"<script>([\s\S]*?)</script>", src)  # the page's one inline script (the mini-game files are checked below)
        if not m:
            return self.add("core", "syntax", False, "no <script> block found")
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
            f.write(m.group(1)); js = f.name
        r = subprocess.run(["node", "-e", "const fs=require('fs');new Function(fs.readFileSync(process.argv[1],'utf8'));", js],
                           capture_output=True, text=True)
        ok = r.returncode == 0; det = (r.stderr.strip().splitlines() or [""])[-1][:200]
        for f in self.mini_files():
            r2 = subprocess.run(["node", "--check", f], capture_output=True, text=True)
            if r2.returncode != 0:
                ok = False; det = os.path.basename(f) + ": " + ((r2.stderr.strip().splitlines() or [""])[-1][:180])
        self.add("core", "syntax", ok, det)
        sizes = "; ".join(f"mini/{os.path.basename(f)} {os.path.getsize(f)/1024:.1f} KB" for f in self.mini_files())
        self.add("core", "file_size", None, f"page {os.path.getsize(self.path)/1024:.1f} KB" + (f"; {sizes}" if sizes else "") + " (limit 16 MB)")

    async def check_data(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{
          const problems=[]; const ids=Object.keys(TALK);
          for(const id of ids){
            const T=TALK[id];
            if(!Array.isArray(T.intro)||!T.intro.length) problems.push(id+': no intro');
            if(!T.bye||!T.back) problems.push(id+': missing bye/back');
            if(!T.q||T.q.length!==3) problems.push(id+': needs exactly 3 questions');
            (T.q||[]).forEach((q,i)=>{
              if(!q.say) problems.push(id+' q'+(i+1)+': no say');
              if(!q.o||q.o.length!==4) problems.push(id+' q'+(i+1)+': needs 4 options');
              if(!q.w) problems.push(id+' q'+(i+1)+': no explanation w');
              if(!q.fb||q.fb.length!==3||q.fb.some(x=>!x)) problems.push(id+' q'+(i+1)+': needs fb with 3 lines');
            });
            if(typeof PH==='undefined'||!PH[id]) problems.push(id+': no PH card entry');
            if(typeof ARTI==='undefined'||!ARTI[id]||ARTI[id].items.length!==3) problems.push(id+': needs ARTI with 3 items');
          }
          const lvIds = (typeof LEVELS!=='undefined')?LEVELS.flatMap(L=>L.ph):[];
          lvIds.forEach(id=>{ if(!PH[id]) problems.push('LEVELS lists '+id+' but PH has no entry'); });
          return {problems, thinkers:ids.length};
        })()""")
        self.add("core", "data", not r["problems"], f"{r['thinkers']} thinkers with conversations; " + ("; ".join(r["problems"][:8]) or "all fields present"))
        await ctx.close()

    async def check_balance(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{
          const STOP=new Set('the a an of to and or in on is it that this what for with as by be are was you your i my me we our they their he his she her its at from not no but so if do does did have has had than then there which who whom how why when would could should can will just only'.split(' '));
          const words=s=>s.toLowerCase().replace(/[^a-z’' ]/g,' ').split(/\\s+/).filter(w=>w.length>3&&!STOP.has(w));
          let n=0,longest=0,ratio=0; const echo=[],give=[];
          for(const id of Object.keys(TALK)) TALK[id].q.forEach((q,i)=>{
            const L=q.o.map(x=>x.length); n++;
            if(L[0]===Math.max(...L)&&L.filter(x=>x===L[0]).length===1) longest++;
            ratio+=L[0]/((L[1]+L[2]+L[3])/3);
            const qw=new Set(words(q.say)); const ov=q.o.map(o=>words(o).filter(w=>qw.has(w)));
            if(ov[0].length&&ov.slice(1).every(x=>!x.length)) echo.push(id+' q'+(i+1)+' echoes "'+ov[0].join(', ')+'"');
            const cw=new Set(words(q.o[0]));
            (q.fb||[]).forEach((f,k)=>{const hit=words(f).filter(w=>cw.has(w)); if(cw.size&&hit.length/cw.size>=0.5) give.push(id+' q'+(i+1)+' fb'+(k+1));});
          });
          return {n,longest,ratio:ratio/n,echo,give};
        })()""")
        ok = r["n"] > 0 and r["longest"] <= max(1, round(r["n"] * 0.30)) and 0.8 <= r["ratio"] <= 1.25
        self.add("core", "answer_balance", ok,
                 f"right answer is longest in {r['longest']}/{r['n']} (keep ≤30%); avg length ratio {r['ratio']:.2f} (keep 0.80–1.25)")
        self.add("core", "answer_echo", None, ("; ".join(r["echo"]) or "no question-word echoes"))
        self.add("core", "fb_giveaways", None, ("possible giveaways: " + "; ".join(r["give"])) if r["give"] else "no reply repeats half the right answer's key words")
        if self.args.pairs:
            pairs = await pg.evaluate("""(()=>{const out=[];for(const id of Object.keys(TALK))TALK[id].q.forEach((q,i)=>{
              out.push('\\n'+id.toUpperCase()+' Q'+(i+1)+': '+q.say+'\\n  RIGHT: '+q.o[0]);
              for(let k=1;k<4;k++)out.push('  WRONG '+k+': '+q.o[k]+'\\n     REPLY -> '+((q.fb||[])[k-1]||'(missing)'));});return out.join('\\n')})()""")
            print("\n===== WRONG ANSWER / REPLY PAIRS (read every pair: does the reply answer THAT choice?) =====" + pairs + "\n")
        await ctx.close()

    async def check_map(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""((ids)=>{
          const res=[];
          for(const id of ids){
            const D=__kitDef(id); const order=D.stations; const problems=[];
            const bfs=(s)=>{const seen=new Set([s[0]+','+s[1]]),q=[s];while(q.length){const [x,y]=q.shift();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(!seen.has(k)&&passable(nx,ny)){seen.add(k);q.push([nx,ny])}}}return seen};
            const near=(seen,x,y,r)=>{for(let yy=y-r-1;yy<=y+r+1;yy++)for(let xx=x-r-1;xx<=x+r+1;xx++)if(seen.has(xx+','+yy))return true;return false};
            const saved=JSON.stringify(P.c);
            for(let k=0;k<order.length;k++){
              P.c={}; order.slice(0,k).forEach(s=>P.c[s.id]=3);
              const seen=bfs(D.start), st=order[k];
              if(!near(seen,st.c[0],st.c[1],st.boss?1:0)) problems.push('stage '+k+': '+st.id+' unreachable');
              arts.filter(a=>a.id===st.id).forEach(a=>{ if(!seen.has(a.x+','+a.y)&&!near(seen,a.x,a.y,0)) problems.push('stage '+k+': artifact '+a.n+' unreachable'); });
              const nx=order[k+1]; if(nx&&near(seen,nx.c[0],nx.c[1],nx.boss?1:0)) problems.push('stage '+k+': '+nx.id+' reachable too early');
            }
            P.c=JSON.parse(saved); res.push({id,stages:order.length,problems});
          }
          return res;})(""" + LEVEL_IDS_JS + ")")
        for lv in r:
            self.add("core", f"map_{lv['id']}", not lv["problems"], f"{lv['stages']} stages; " + ("; ".join(lv["problems"][:6]) or "every thinker and artifact reachable in order, none early"))
        await ctx.close()

    async def check_play(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("__kitPlay(" + LEVEL_IDS_JS + ")")
        bad = [x for x in r if not x["ok"]]
        self.add("core", "playthrough", not bad and not errs,
                 f"{len(r)-len(bad)}/{len(r)} conversations completed (one wrong answer each, then right)"
                 + (f"; failed: {[x['id'] for x in bad]}" if bad else "") + (f"; page errors: {errs[:2]}" if errs else ""))
        await ctx.close()

    async def check_reveal_text(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{P.c.kierkegaard=3;showReveal('kierkegaard','New card earned','test');
          const tb=document.querySelector('#reveal .textbox'),p=tb.querySelector('p');
          const c=getComputedStyle(p).color.match(/\\d+/g).map(Number);const lum=(0.2126*c[0]+0.7152*c[1]+0.0722*c[2])/255;
          return {lum,clipped:p.getBoundingClientRect().height>tb.getBoundingClientRect().height+2}})()""")
        self.add("core", "reveal_card_text", r["lum"] < 0.4 and not r["clipped"], f"text brightness {r['lum']:.2f} (dark = readable), clipped={r['clipped']}")
        await ctx.close()

    async def check_layout_se(self, b):
        ctx, pg, errs = await self.page(b, w=375, h=667, dpr=2)
        r = await pg.evaluate("""(()=>{__kitDef(""" + "(" + LEVEL_IDS_JS + ")[0]" + """);
          let best=null,bl=0;for(const id of Object.keys(TALK))TALK[id].q.forEach((q,i)=>{const L=q.say.length+q.o.join('').length;if(L>bl&&npcs.find(n=>n.id===id)){bl=L;best={id,i}}});
          if(!best) return {skip:true};
          ARTI[best.id].items.forEach((_,i)=>P.f[best.id+':'+i]=1);
          startTalk(npcs.find(n=>n.id===best.id));
          TK.i=TK.steps.findIndex(s=>s.t==='ask'&&s.q===TALK[best.id].q[best.i]);renderStep();__kitToAsk();
          const d=document.querySelector('.dlg').getBoundingClientRect(),n=document.querySelector('.nameplate').getBoundingClientRect(),l=document.querySelector('.leave').getBoundingClientRect();
          return {who:best.id+' q'+(best.i+1),top:Math.round(d.top),plate:Math.round(Math.max(n.bottom,l.bottom))}})()""")
        if r.get("skip"):
            self.add("core", "small_phone_fit", None, "no conversation on the current level to measure")
        else:
            self.add("core", "small_phone_fit", r["top"] >= r["plate"], f"longest question ({r['who']}) on iPhone SE: dialog top {r['top']}px, name plate bottom {r['plate']}px")
        await ctx.close()

    async def check_builtin_art(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const keys=[...LEVELS[0].ph,'boss-'+LEVELS[0].boss,LEVELS[0].boss,'title','region-l1','vid-intro','vid-l1'];
          return keys.filter(k=>!artURL(k))})()""")
        self.add("core", "builtin_art_l1", not r, "all Level I art built in" if not r else f"missing built-in art: {r}")
        n = await pg.evaluate("(async()=>{const ids=[...new Set(Object.values(BUILTIN_ART))];let ok=0;for(const id of ids){try{const r=await fetch('/_blob/'+id);if(r.ok)ok++}catch(e){}}return [ok,ids.length]})()")
        self.add("info", "art_visible_to_tests", None, f"{n[0]} of {n[1]} built-in art files available to the test browser" + ("" if n[0] else " (pass --blobs DIR to see real art)"))
        await ctx.close()

    # ---------------- PHASE 0 (art) ----------------
    async def p0(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("(()=>{P.a={};const optional=new Set(['end-art','vid-end']);return slots().filter(s=>!optional.has(s.key)&&!artURL(s.key)).map(s=>s.key)})()")  # Phase 16: the ending's own art is optional (Cade may not have made it)
        self.add("p0", "all_art_built_in", not r, "all art slots have built-in art" if not r else f"{len(r)} slots still missing: {r}")
        dup = await pg.evaluate("(()=>{const v=Object.values(BUILTIN_ART);return v.length-new Set(v).size})()")
        self.add("p0", "no_duplicate_art", dup == 0, f"{dup} art files used in more than one slot")
        await ctx.close()

    # ---------------- PHASE 1 ----------------
    async def p1(self, b):
        # keyboard answers
        ctx, pg, errs = await self.page(b)
        await pg.evaluate("__kitDef('l1');ARTI.kierkegaard.items.forEach((_,i)=>P.f['kierkegaard:'+i]=1);startTalk(npcs.find(n=>n.id==='kierkegaard'));__kitToAsk();document.querySelector('#replies .reply').focus()")
        await pg.keyboard.press("Enter"); await pg.wait_for_timeout(60)
        enter_ok = await pg.evaluate("!!TK&&!!TK.fb")
        await pg.evaluate("TK.fb=null;TK.removed=[];renderStep();__kitToAsk();document.activeElement&&document.activeElement.blur()")
        await pg.keyboard.press("2"); await pg.wait_for_timeout(60)
        num_ok = await pg.evaluate("!!TK&&!!TK.fb")
        self.add("p1", "keyboard_answers", enter_ok and num_ok, f"Enter on a highlighted answer: {enter_ok}; number key 2: {num_ok}")
        await pg.keyboard.down("ArrowUp")
        await pg.evaluate("leaveTalk();window.dispatchEvent(new Event('blur'))")
        stuck = await pg.evaluate("!!input.keys.ArrowUp")
        await pg.keyboard.up("ArrowUp")
        self.add("p1", "keys_release_on_blur", not stuck, "held arrow key cleared when the window loses focus" if not stuck else "arrow key stays held after the window loses focus")
        await ctx.close()

        # rotation while in a menu
        ctx, pg, errs = await self.page(b)
        await pg.evaluate("__kitEnter('l1');openPanel('menu','world')")
        await pg.set_viewport_size({"width": 852, "height": 393}); await pg.wait_for_timeout(150)
        await pg.evaluate("closePanel()"); await pg.wait_for_timeout(150)
        r = await pg.evaluate("({a:cv.width/cv.height,b:innerWidth/innerHeight})")
        self.add("p1", "rotate_refresh", abs(r["a"] - r["b"]) < 0.03, f"map shape {r['a']:.2f} vs screen shape {r['b']:.2f}")
        await ctx.close()

        # intro video: tapping the video must not skip it
        ctx, pg, errs = await self.page(b)
        act = await pg.evaluate("(()=>{playStory([{video:'/_blob/kit-test.mp4'}],()=>{});const v=document.querySelector('#story video');const a=v&&v.closest('[data-act]');return a?a.dataset.act:null})()")
        self.add("p1", "intro_video_tap", act is not None and act != "storynext", f"a tap on the video triggers: {act}")
        await ctx.close()

        # boss rematch after victory must not re-announce the relic
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(async()=>{const D=__kitDef('l1');D.stations.forEach(s=>P.c[s.id]=3);
          const res=await __kitPlay(['l1'],{skip:D.stations.filter(s=>!s.boss).map(s=>s.id),choice:'rematch',stopAtReveal:true});
          await new Promise(r=>setTimeout(r,80));
          const shown=!document.querySelector('#reveal').classList.contains('hide')&&document.querySelector('#reveal').innerText.includes('Legendary relic earned');
          return {asks:res[0].asks,shown}})()""")
        self.add("p1", "boss_rematch", r["asks"] > 0 and not r["shown"], f"rematch questions answered: {r['asks']}; relic re-announced: {r['shown']}")
        await ctx.close()

        # typed text keeps its layout while typing
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{__kitDef('l1');ARTI.kierkegaard.items.forEach((_,i)=>P.f['kierkegaard:'+i]=1);startTalk(npcs.find(n=>n.id==='kierkegaard'));__kitToAsk();
          reply(0);const lesson=!!document.querySelector('#dTxt .lesson')&&TK.typing;
          leaveTalk();Object.keys(TALK).forEach(id=>P.c[id]=3);startTalk(npcs.find(n=>n.boss));
          let g=0;while(g++<20){if(TK.typing){finishType();continue}const s=TK.steps[TK.i];if(s.t==='ask')break;advance()}
          TK.i--;advance();const pre=!!document.querySelector('#dTxt .pre')&&TK.typing;return {lesson,pre}})()""")
        self.add("p1", "typing_keeps_layout", r["lesson"] and r["pre"], f"explanation styled while typing: {r['lesson']}; 'The Void says' line styled while typing: {r['pre']}")
        await ctx.close()

        # broken art falls back to initials
        ctx, pg, errs = await self.page(b)
        await pg.evaluate("LEVELS[0].ph.forEach(id=>P.c[id]=3);openPanel('cards','title')")
        await pg.wait_for_timeout(700)
        r = await pg.evaluate("""(()=>{const imgs=[...document.querySelectorAll('.art img')];
          return {broken:imgs.filter(i=>i.complete&&i.naturalWidth===0).length,mono:document.querySelectorAll('.card:not(.locked) .art .mono').length}})()""")
        self.add("p1", "art_fallback", r["broken"] == 0 and r["mono"] > 0, f"broken images showing: {r['broken']}; cards showing initials instead: {r['mono']}")
        await ctx.close()

        # reduced motion
        ctx, pg, errs = await self.page(b, reduced=True)
        await pg.evaluate("__kitEnter('l1')"); await pg.wait_for_timeout(200)
        y1 = await pg.evaluate("rain.length?rain[0].y:0"); await pg.wait_for_timeout(300)
        y2 = await pg.evaluate("rain.length?rain[0].y:0")
        await pg.evaluate("nextBolt=0"); await pg.wait_for_timeout(120)
        lt = await pg.evaluate("lightning")
        self.add("p1", "reduced_motion", y1 == y2 and lt <= 0, f"rain moved: {y1 != y2}; lightning flashed: {lt > 0}")
        await ctx.close()

        # save syncing between devices (fake account storage)
        def fake(local, cloud, assets_fail=False):
            return ("localStorage.setItem('examined-life-v1'," + json.dumps(json.dumps(local)) + ");"
                    "window.__cloud=" + json.dumps(cloud) + ";window.__sets=0;window.__assetsFail=" + ("true" if assets_fail else "false") + ";"
                    "window.claude={use:async(n)=>{"
                    " if(n==='db')return{doc:()=>({get:async()=>({exists:!!window.__cloud,data:()=>window.__cloud}),set:async(o)=>{window.__cloud=JSON.parse(JSON.stringify(o));window.__sets++}})};"
                    " if(n==='user')return{id:async()=>'u1'};"
                    " if(n==='assets'){if(window.__assetsFail)throw new Error('assets unavailable');return{upload:async()=>({id:'x'}),delete:async()=>{}}}"
                    "}};")
        base = {"c": {}, "a": {}, "w": {}, "f": {}, "intro": True}
        sub = {}
        ctx, pg, errs = await self.page(b, init=fake({**base, "c": {"kierkegaard": 3}, "f": {"kierkegaard:0": 1}, "ts": {"reset": 100, "a": 0, "w": 0}},
                                                    {**base, "ts": {"reset": 200, "a": 0, "w": 0}}))
        await pg.wait_for_timeout(400)
        sub["newer_reset_wins"] = await pg.evaluate("Object.keys(P.c).length===0&&Object.keys(P.f).length===0")
        sub["merged_save_written_back"] = await pg.evaluate("window.__sets>=1")
        await ctx.close()
        ctx, pg, errs = await self.page(b, init=fake({**base, "a": {"title": "AAA"}, "ts": {"reset": 0, "a": 100, "w": 0}},
                                                    {**base, "a": {"title": "BBB"}, "ts": {"reset": 0, "a": 200, "w": 0}}))
        await pg.wait_for_timeout(400)
        sub["newer_art_wins"] = await pg.evaluate("P.a.title==='BBB'")
        await ctx.close()
        ctx, pg, errs = await self.page(b, init=fake({**base, "a": {"title": "AAA"}, "ts": {"reset": 0, "a": 300, "w": 0}},
                                                    {**base, "a": {"title": "BBB"}, "ts": {"reset": 0, "a": 200, "w": 0}}))
        await pg.wait_for_timeout(400)
        sub["local_newer_art_kept"] = await pg.evaluate("P.a.title==='AAA'")
        await ctx.close()
        ctx, pg, errs = await self.page(b, init=fake(base, base, assets_fail=True))
        await pg.wait_for_timeout(400)
        sub["saving_survives_art_storage_failure"] = await pg.evaluate("dbRef!==null")
        await ctx.close()
        self.add("p1", "device_sync", all(sub.values()), "; ".join(f"{k}={v}" for k, v in sub.items()))

    # ---------------- PHASE 2 ----------------
    async def p2(self, b):
        ctx, pg, errs = await self.page(b)
        await pg.evaluate("__kitEnter('l1')"); await pg.wait_for_timeout(300)
        scale = await pg.evaluate("cv.width/innerWidth")
        ms = await pg.evaluate("""new Promise(res=>{let n=0,t0=performance.now();function f(){n++;if(performance.now()-t0<2000)requestAnimationFrame(f);else res((performance.now()-t0)/n)}requestAnimationFrame(f)})""")
        self.add("p2", "canvas_scale", scale <= 2.01, f"world drawn at {scale:.2f}x (target ≤ 2x)")
        self.add("p2", "frame_time", ms <= 18.5, f"{ms:.1f} ms per frame in the test browser (target ≤ 18.5; no graphics chip here)")
        await ctx.close()

    # ---------------- PHASE 3 ----------------
    async def p3(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const T=(id,k)=>ARTI[id].items.find(x=>x.k===k).text.join(' ');
          const card=cardHTML(cardById('kierkegaard'));
          return {
            nietzsche_gay_science:T('nietzsche','feather').includes('Gay Science'),
            camus_myth:ARTI.camus.items.find(x=>/Notebook/.test(x.n)).text.join(' ').includes('Myth of Sisyphus'),
            kierkegaard_pen_names:!T('kierkegaard','book').includes('one living by faith'),
            kierkegaard_ring_hedged:T('kierkegaard','ring').includes('debated'),
            q1_no_dizziness_echo:!TALK.kierkegaard.q[0].say.toLowerCase().includes('dizziness'),
            old_taunt_gone:!card.includes('You follow the crowd so well'),
            no_bare_stats:!/>\\s*\\d+\\/\\d+\\s*</.test(card),
            fortune_symbol:BOSSES.b2.m!=='⚓',
            buddha_setting:!PH.buddha.rel.includes('Hindu world')
          }})()""")
        for k, v in r.items():
            self.add("p3", k, v, "")
        await ctx.close()

    # ---------------- PHASE 4 ----------------
    async def p4(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(async()=>{const D=__kitDef('l1');const lamp=props.some(p=>p.k==='greatlamp');
          D.stations.forEach(s=>P.c[s.id]=3);__kitEnter('l1');await new Promise(r=>setTimeout(r,120));
          nextBolt=0;await new Promise(r=>setTimeout(r,150));const calm=lightning<=0;
          const boss=npcs.find(n=>n.boss);startTalk(boss);let g=0;while(TK&&TK.typing&&g++<5)finishType();
          let st=TK&&(TK.fb||TK.steps[TK.i]);while(TK&&st&&st.t==='say'&&g++<10){advance();if(TK&&TK.typing)finishType();st=TK&&(TK.fb||TK.steps[TK.i]);}
          const rematch=!!(st&&st.t==='choice'&&st.opts.some(o=>o.a==='rematch'));if(TK)leaveTalk();
          pl.x=14.5;pl.y=40.5;await new Promise(r=>setTimeout(r,120));
          const camOk=(typeof CAM!=='undefined')?((pl.y*TS*S-CAM.y)/cv.height):null;
          openPanel('cards','world');const count=document.querySelector('#panelBody').innerText.toLowerCase().includes('in the stormcliffs');closePanel();
          const dlg=getComputedStyle(document.querySelector('.dlg'));
          return {lamp,calm,rematch,camOk,count,scroll:/auto|scroll/.test(dlg.overflowY)}})()""")
        self.add("p4", "great_lamp_on_map", r["lamp"], "")
        self.add("p4", "storm_clears_after_win", r["calm"], "")
        self.add("p4", "boulder_rematch_choice", r["rematch"], "")
        cam = r["camOk"]
        self.add("p4", "camera_above_center", cam is not None and 0.35 <= cam <= 0.46, f"Wanderer at {cam if cam is None else round(cam,2)} of screen height (target 0.35–0.46)")
        self.add("p4", "collection_counts_land", r["count"], "")
        self.add("p4", "dialog_scrolls_if_tall", r["scroll"], "")
        await ctx.close()

    # ---------------- PHASE 5 ----------------
    async def dump_world(self, b):
        ctx, pg, errs = await self.page(b)
        w = await pg.evaluate("""(()=>{__kitDef('l1');return {G:Array.from(G),BAR:Array.from(BAR),
          props:props.map(p=>[p.k,p.x,p.y,p.w||1,p.h||1,!!p.solid,p.light||0,p.i??null]),
          npcs:npcs.map(n=>[n.id,n.x,n.y,!!n.boss]),arts:arts.map(a=>[a.id,a.i,a.x,a.y,a.k]),signs:signs.map(s=>[s.x,s.y,s.t])}})()""")
        await ctx.close()
        return w

    async def p5(self, b):
        ctx, pg, errs = await self.page(b)
        ok = await pg.evaluate("typeof LEVEL_DEFS==='object'&&!!LEVEL_DEFS.l1&&Array.isArray(LEVEL_DEFS.l1.map)&&typeof buildLevel==='function'&&typeof enterLevel==='function'&&typeof CUR!=='undefined'")
        self.add("p5", "level_template_api", ok, "LEVEL_DEFS.l1.map, buildLevel(id), enterLevel(id), CUR")
        await ctx.close()
        if self.args.compare_world:
            before = json.load(open(self.args.compare_world))
            now = await self.dump_world(b)
            diffs = [k for k in before if before[k] != now.get(k)]
            self.add("p5", "level1_world_unchanged", not diffs, "identical to baseline" if not diffs else f"differs in: {diffs}")
        else:
            self.add("p5", "level1_world_unchanged", None, "run with --compare-world BEFORE.json to check")

    # ---------------- PHASE 6 (world art engine) ----------------
    async def p6(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{
          const api=typeof ATLAS==='object'&&typeof TILESETS==='object'&&typeof autotile==='function'&&typeof buildLevel==='function';
          const v2=typeof LEVEL_DEFS!=='undefined'&&!!LEVEL_DEFS.l1&&LEVEL_DEFS.l1.format===2;
          let missing=['engine not found'];
          if(api&&v2){const miss=new Set();for(const id of Object.keys(LEVEL_DEFS)){const D=__kitDef(id);const A=ATLAS[D.atlas||id];
            if(!A||!A.tiles){miss.add(id+': no ATLAS entry');continue}
            for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)[].concat(autotile(x,y)||[]).forEach(n=>{if(n&&!A.tiles[n])miss.add(id+':'+n)})}
            missing=[...miss].slice(0,10)}
          const over=typeof overCv!=='undefined'&&!!overCv;
          const fallback=typeof paintMapFallback==='function';
          const W=typeof SPRITES==='object'&&SPRITES.wanderer;
          const walk=!!W&&['down','up','left','right'].every(d=>Array.isArray(W[d])&&W[d].length>=3);
          const height=typeof HT!=='undefined'&&HT&&HT.length===MW*MH;
          return {api,v2,missing,over,fallback,walk,height}})()""")
        self.add("p6", "tile_engine_api", r["api"], "ATLAS, TILESETS, autotile(x,y), buildLevel(id)")
        self.add("p6", "map_format_v2", r["v2"], "LEVEL_DEFS.l1.format === 2")
        self.add("p6", "no_missing_tiles", not r["missing"], "every map cell draws from tiles that exist in its atlas" if not r["missing"] else f"missing: {r['missing']}")
        self.add("p6", "overhead_layer", r["over"], "tree tops and roofs drawn above the Wanderer (overCv)")
        self.add("p6", "height_map", r["height"], "plateaus, cliffs, and stairs (HT)")
        self.add("p6", "fallback_painter", r["fallback"], "paintMapFallback() keeps the game playable if the tileset can't load")
        self.add("p6", "wanderer_walk_cycle", r["walk"], "SPRITES.wanderer has 4 directions with 3+ frames each")
        await ctx.close()

    # ---------------- PHASE 7 (the redrawn Stormcliffs) ----------------
    async def p7(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{if(typeof LEVEL_DEFS==='undefined'||!LEVEL_DEFS.l1)return {ok:false};
          const D=LEVEL_DEFS.l1;__kitDef('l1');const objs=D.objects||[];
          const lacking=D.stations.filter(s=>!objs.some(o=>o.station===s.id)).map(s=>s.id);
          const lights=props.filter(p=>p.light).length;
          const sp=typeof SPRITES==='object'?SPRITES:{};
          const noSprite=[...LEVELS[0].ph,'void','boulder','greatlamp'].filter(k=>!sp[k]);
          const hasHeight=typeof HT!=='undefined'&&Array.from(HT).some(v=>v>0);
          return {ok:true,v2:D.format===2,lacking,lights,noSprite,hasHeight,size:MW+'x'+MH}})()""")
        if not r.get("ok"):
            self.add("p7", "stormcliffs_redrawn", False, "LEVEL_DEFS.l1 not found (Phase 5 not done)")
        else:
            self.add("p7", "every_thinker_has_a_landmark", r["v2"] and not r["lacking"], "each station has an object tagged station:'<id>'" if not r["lacking"] else f"no landmark for: {r['lacking']}")
            self.add("p7", "light_sources", r["lights"] >= 12, f"{r['lights']} light sources on the map (target 12+ so the art shows in the dark)")
            self.add("p7", "level1_sprites", not r["noSprite"], "all Level I characters and landmarks have sprites" if not r["noSprite"] else f"missing sprites: {r['noSprite']}")
            self.add("p7", "uses_cliffs_and_stairs", r["hasHeight"], f"map {r['size']} tiles")
        await ctx.close()

    # ---------------- PHASE 9 (Level II) ----------------
    async def p9(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{if(typeof LEVEL_DEFS==='undefined'||!LEVEL_DEFS.l2)return {exists:false};
          const L2=LEVELS.find(L=>L.id==='l2');const missing=L2.ph.filter(id=>!TALK[id]||!ARTI[id]);
          const D=LEVEL_DEFS.l2;const ch=D.challenges||(D.boss&&D.boss.challenges)||[];
          return {exists:true,missing,challenges:ch.length,badCh:ch.filter(c=>!L2.ph.includes(c.p)).length}})()""")
        if not r["exists"]:
            self.add("p9", "level2_defined", False, "LEVEL_DEFS.l2 not found")
        else:
            self.add("p9", "level2_defined", True, "")
            self.add("p9", "level2_all_thinkers", not r["missing"], f"missing conversations/artifacts: {r['missing']}" if r["missing"] else "all 6 thinkers present")
            self.add("p9", "fortune_challenges", r["challenges"] >= 6 and r["badCh"] == 0, f"{r['challenges']} challenges, {r['badCh']} pointing at unknown thinkers")
        await ctx.close()

    # ---------------- PHASE 16 (the ending) ----------------
    async def p16(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{
          const out={};
          out.slots = slots().some(s=>s.key==='end-art') && slots().some(s=>s.key==='vid-end');
          if(typeof LEVEL_DEFS==='undefined'||!LEVEL_DEFS.l4){out.exists=false;return out}
          out.exists=true;
          __kitDef('l4');
          P.c=P.c||{};P.c.b1=3;P.c.b2=3;P.c.b3=3;delete P.c.b4;P.done=false;
          victory('b4', true);
          const vn=document.querySelector('#reveal [data-act=\"vidnext\"]');if(vn)vn.click();
          const fin=document.querySelector('#reveal [data-act=\"finale\"]');
          out.finaleBtn=!!fin;out.finaleText=fin?fin.textContent:null;
          if(fin)fin.click();
          let guard=0;
          while(!document.querySelector('#story').classList.contains('hide')&&guard++<20){document.querySelector('#story').click()}
          out.storyGuard=guard;
          out.creditsShown=!document.querySelector('#credits').classList.contains('hide');
          out.doneAfterFinale=!!P.done;
          const retBtn=document.querySelector('#credits [data-act=\"creditsdone\"]');
          if(retBtn)retBtn.click();
          out.backToTitle=!document.querySelector('#title').classList.contains('hide')&&document.querySelector('#credits').classList.contains('hide');
          out.badgeShown=!document.querySelector('#doneBadge').classList.contains('hide');
          panelView='menu';panelFrom='world';renderPanel();
          const body=document.querySelector('#panelBody').innerHTML;
          out.menuHasWatch=body.includes('data-act=\"watchending\"');
          out.menuHasCredits=body.includes('data-act=\"credits\">Credits');
          return out})()""")
        await ctx.close()
        if not r.get("exists"):
            self.add("p16", "ending_slots", False, "LEVEL_DEFS.l4 not found")
            return
        self.add("p16", "ending_slots", r["slots"], "slots() includes end-art and vid-end" if r["slots"] else "end-art/vid-end missing from slots()")
        self.add("p16", "finale_button", r["finaleBtn"] and r["finaleText"] == "Carry the light home",
                 f"finale button present={r['finaleBtn']}, text={r['finaleText']!r}")
        self.add("p16", "finale_flow", r["creditsShown"] and r["backToTitle"],
                 f"story pages advanced in {r['storyGuard']} clicks; #credits shown={r['creditsShown']}; Return to the title works={r['backToTitle']}")
        self.add("p16", "journey_complete", r["doneAfterFinale"] and r["badgeShown"] and r["menuHasWatch"] and r["menuHasCredits"],
                 f"P.done set by finale={r['doneAfterFinale']}; #doneBadge shown={r['badgeShown']}; menu has Watch the ending={r['menuHasWatch']}, Credits={r['menuHasCredits']}")
        ctx, pg, errs = await self.page(b, reduced=True)
        rm = await pg.evaluate("""(()=>{
          __kitDef('l4');P.done=true;showCredits();
          const reel=document.querySelector('#creditsReel');
          return {still: document.querySelector('#credits').classList.contains('still'), transform: reel.style.transform}
        })()""")
        await ctx.close()
        self.add("p16", "credits_still_with_reduced_motion", rm["still"] and rm["transform"] == "",
                 f"#credits.still with Reduce Motion={rm['still']}; reel left untransformed={rm['transform']!r}")

    # ---------------- PHASE 13 ----------------
    # ---------------- PHASE 15 ----------------
    async def p15(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const out={art:[]};
          if(typeof TILESETS==='undefined'||!TILESETS.l4||!ATLAS.l4)out.art.push('TILESETS.l4/ATLAS.l4');
          ['engine','lenses','greatlamp4','aquinas','kant','mill','gilligan'].forEach(k=>{if(!SPRITES[k])out.art.push('SPRITES.'+k)});
          ['drawEngine','drawLenses'].forEach(f=>{if(typeof window[f]!=='function')out.art.push(f)});
          const A4=ATLAS.l4;['cathedral','clocktower','library','lanternweb','junction','grate','rail_v','rail_h','flywheel','brass_tower','press','signal'].forEach(k=>{const O=OBJ[k];
            if(!O){out.art.push('OBJ.'+k);return}(O.anim||[O.r]).forEach(n=>{if(A4&&!A4.rects[n])out.art.push('ATLAS.l4.rects.'+n)})});
          ['lamppost_on','lamppost_off','tree_big','tree_alt','signpost','gargoyle','plaque_post','signal'].forEach(n=>{if(A4&&!A4.rects[n])out.art.push('ATLAS.l4.rects.'+n)});
          if(typeof LEVEL_DEFS==='undefined'||!LEVEL_DEFS.l4){out.exists=false;return out}
          const D=LEVEL_DEFS.l4,L4=LEVELS.find(L=>L.id==='l4');out.exists=true;out.format=D.format;out.next=D.next;
          out.missing=L4.ph.filter(id=>!TALK[id]||!(TALK[id].reflect||'').trim()||!ARTI[id]||!SPRITES[id]);
          const ch=D.challenges||[];out.challenges=ch.length;out.badCh=ch.filter(c=>!L4.ph.includes(c.p)).length;
          const tagged=new Set((D.objects||[]).filter(o=>o.station).map(o=>o.station));
          out.untagged=D.stations.map(s=>s.id).filter(id=>!tagged.has(id));
          (D.objects||[]).forEach(o=>{const O=OBJ[o.k];if(!O){out.art.push('OBJ.'+o.k);return}
            (O.anim||[O.r,O.rOn]).filter(Boolean).forEach(n=>{if(A4&&!A4.rects[n])out.art.push('ATLAS.l4.rects.'+n)})});
          __kitDef('l4');out.lights=props.filter(p=>p.light>0).length;
          P.c=P.c||{};['b1','b2','b3','b4'].forEach(k=>P.c[k]=3);
          out.open=LEVELS.map(L=>landOpen(L.id));
          panelView='lands';renderPanel();out.travel=document.querySelectorAll('#panelBody [data-act="travel"]').length;
          return out})()""")
        await ctx.close()
        art = sorted(set(r["art"]))
        self.add("p15", "level4_art", not art, "tileset, atlas pieces, sprites and the Engine's drawing present" if not art else f"missing: {art[:8]}")
        if not r.get("exists"):
            self.add("p15", "level4_defined", False, "LEVEL_DEFS.l4 not found")
            return
        self.add("p15", "level4_defined", r["format"] == 2, f"format {r['format']}")
        self.add("p15", "level4_all_thinkers", not r["missing"], "all 4 have TALK (with reflect), ARTI and a sprite" if not r["missing"] else f"missing: {r['missing']}")
        self.add("p15", "engine_challenges", r["challenges"] >= 8 and r["badCh"] == 0, f"{r['challenges']} challenges, {r['badCh']} pointing at other lands' thinkers")
        self.add("p15", "level4_landmarks", not r["untagged"], "every station has an object tagged with its id" if not r["untagged"] else f"no landmark for: {r['untagged']}")
        self.add("p15", "level4_lights", r["lights"] >= 12, f"{r['lights']} light sources (target 12+)")
        self.add("p15", "last_land", r["next"] is None and all(r["open"]) and r["travel"] >= 4,
                 f"next={r['next']}; all four lands open once every boss is cleared={all(r['open'])}; Lands menu travel buttons={r['travel']}")
        # Phase 15B: the steam tint, and decision E3 (the Weaver, never Carol Gilligan, is named as the speaker)
        ctx, pg, errs = await self.page(b)
        w = await pg.evaluate("""(()=>{const D=__kitDef('l4');__kitEnter('l4');const out={steam:!!(D.weather&&D.weather.mist&&D.weather.steam&&D.weather.rain===false)};
          out.tint=/CUR\.weather\.steam/.test(drawMist.toString());
          const n=npcs.find(n=>n.id==='gilligan');startTalk(n);out.name=document.querySelector('#talkName').textContent;
          out.who=[...new Set(TK.steps.filter(s=>s.who).map(s=>s.who))];leaveTalk&&leaveTalk();return out})()""")
        await ctx.close()
        self.add("p15", "steam_weather", w["steam"] and w["tint"], f"mist+steam, no rain={w['steam']}; mist tinted for steam={w['tint']}")
        self.add("p15", "weaver_speaks", w["name"] == "The Weaver" and w["who"] == ["The Weaver"], f"name plate={w['name']!r}; speakers={w['who']}")

    # ---------------- PHASE 18 ----------------
    async def p18(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{
          const drawn = [...new Set([...drawArtifact.toString().matchAll(/k===\"([a-z]+)\"/g)].map(m=>m[1]))];
          const used = new Set();
          Object.values(ARTI).forEach(A=>A.items.forEach(it=>used.add(it.k)));
          const drawnNotUsed = drawn.filter(k=>!used.has(k));
          const usedNotDrawn = [...used].filter(k=>!drawn.includes(k));
          return {drawnNotUsed, usedNotDrawn};
        })()""")
        self.add("p18", "artifact_drawings_used", not r["drawnNotUsed"] and not r["usedNotDrawn"],
                 ("all drawn kinds used and all used kinds drawn" if not r["drawnNotUsed"] and not r["usedNotDrawn"]
                  else f"drawn but unused: {r['drawnNotUsed']}; used but not drawn: {r['usedNotDrawn']}"))

        src = self.all_src()
        RQ = "\u2019"
        news = [
            "I once thought knowledge alone gave a person worth, and I looked down on people who had none. Reading Rousseau set me right. I learned to respect every human being.",
            "A friend once asked the oracle at Delphi whether anyone was wiser than me. It said no one was.",
            "Some wise men have called anger a brief madness, and I agreed. It grabs the wheel for a moment and leaves damage that lasts. Pause before it speaks for you.",
            'pl:"Germany, the United States, Mexico, and Switzerland"',
            "book:\"Yes to Life by Viktor Frankl (a short follow-up to Man" + RQ + "s Search for Meaning)\"",
        ]
        olds = [
            "I used to think morality was about outcomes, the way most people still do. I came to think it" + RQ + "s about something sturdier than that.",
            "A friend once asked the oracle at Delphi who in Athens was wisest. It named me.",
            "Anger is a brief madness, I wrote, and it does more harm in a moment than patience loses in an hour. Pause before it speaks for you.",
            'pl:"Germany, then the United States and Mexico"',
            "book:\"Yes to Life by Viktor Frankl (a short follow-up to the book you" + RQ + "ve read)\"",
        ]
        news_ok = all(n in src for n in news)
        olds_gone = all(o not in src for o in olds)
        self.add("p18", "facts_updated", news_ok and olds_gone,
                 f"new strings present: {news_ok}; old strings gone: {olds_gone}")
        await ctx.close()

        # done_follows_journey: fake-cloud setup, as in p1's device_sync
        def fake(local, cloud):
            return ("localStorage.setItem(\'examined-life-v1\'," + json.dumps(json.dumps(local)) + ");"
                    "window.__cloud=" + json.dumps(cloud) + ";window.__sets=0;"
                    "window.claude={use:async(n)=>{"
                    " if(n==='db')return{doc:()=>({get:async()=>({exists:!!window.__cloud,data:()=>window.__cloud}),set:async(o)=>{window.__cloud=JSON.parse(JSON.stringify(o));window.__sets++}})};"
                    " if(n==='user')return{id:async()=>'u1'};"
                    " if(n==='assets')return{upload:async()=>({id:'x'}),delete:async()=>{}};"
                    "}};")
        base = {"c": {}, "a": {}, "w": {}, "f": {}, "intro": True}
        sub = {}
        # older journey's done:true must NOT set P.done
        ctx, pg, errs = await self.page(b, init=fake(
            {**base, "done": False, "ts": {"reset": 200, "a": 0, "w": 0}},
            {**base, "done": True, "ts": {"reset": 100, "a": 0, "w": 0}}))
        await pg.wait_for_timeout(400)
        sub["older_done_ignored"] = await pg.evaluate("P.done===false")
        await ctx.close()
        # newer journey's done:false must clear it
        ctx, pg, errs = await self.page(b, init=fake(
            {**base, "done": True, "ts": {"reset": 100, "a": 0, "w": 0}},
            {**base, "done": False, "ts": {"reset": 200, "a": 0, "w": 0}}))
        await pg.wait_for_timeout(400)
        sub["newer_done_clears"] = await pg.evaluate("P.done===false")
        await ctx.close()
        self.add("p18", "done_follows_journey", all(sub.values()), "; ".join(f"{k}={v}" for k, v in sub.items()))

        # calm_storms
        ctx, pg, errs = await self.page(b)
        await pg.evaluate("CALM=true;__kitEnter('l1')")
        hits = 0
        for _ in range(6):
            await pg.evaluate("nextBolt=0")
            await pg.wait_for_timeout(120)
            if await pg.evaluate("lightning>0"):
                hits += 1
        self.add("p18", "calm_storms", hits == 0, f"lightning flashed on {hits}/6 tries with CALM=true (target 0)")
        await ctx.close()

        # single_document
        ctx, pg, errs = await self.page(b)
        src2 = open(self.path, encoding="utf-8").read()
        title = await pg.evaluate("document.title")
        self.add("p18", "single_document", "<!DOCTYPE html>" not in src2 and title == "The Examined Life",
                 f"game's own <!DOCTYPE html> gone: {'<!DOCTYPE html>' not in src2}; document.title={title!r}")
        await ctx.close()

    # ---------------- PHASE 19 ----------------
    async def p19(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{
          const PAT = /\\b(always|never|every|all|only|nothing|absolutely|completely|entirely|whatsoever|any|ever|simply|exactly|immediately|single)\\b/gi;
          const byLand = {};
          LEVELS.forEach(L => { byLand[L.id] = { flagged: 0, total: 0 }; });
          LEVELS.forEach(L => {
            L.ph.forEach(id => {
              (TALK[id].q || []).forEach(q => {
                for (let k = 1; k < 4; k++) {
                  const hits = (q.o[k].match(PAT) || []).length;
                  byLand[L.id].total++;
                  if (hits >= 2) byLand[L.id].flagged++;
                }
              });
            });
          });
          const oldGilligan = "What was Carol Gilligan\\u2019s critique of Lawrence Kohlberg\\u2019s stages of moral development?";
          const oldDogen = "I wrote that practice and awakening aren\\u2019t two separate steps. What did I mean?";
          const gq = TALK.gilligan.q[1], dq = TALK.dogen.q[1];
          return {
            byLand,
            gilligan: { sayDiffers: gq.say !== oldGilligan, oLen: gq.o.length, fbLen: (gq.fb || []).length },
            dogen: { sayDiffers: dq.say !== oldDogen, oLen: dq.o.length, fbLen: (dq.fb || []).length }
          };
        })()""")
        await ctx.close()

        worst = 0
        detail_bits = []
        for lid, d in r["byLand"].items():
            pct = 100 * d["flagged"] / d["total"] if d["total"] else 0
            worst = max(worst, pct)
            detail_bits.append(f"{lid}={d['flagged']}/{d['total']} ({pct:.0f}%)")
        self.add("p19", "absolute_words", worst <= 10.0001, "; ".join(detail_bits) + " (target ≤10% per land)")

        g, d = r["gilligan"], r["dogen"]
        nq_ok = (g["sayDiffers"] and g["oLen"] == 4 and g["fbLen"] == 3 and
                 d["sayDiffers"] and d["oLen"] == 4 and d["fbLen"] == 3)
        self.add("p19", "new_questions", nq_ok,
                 f"gilligan: differs={g['sayDiffers']}, o={g['oLen']}, fb={g['fbLen']}; "
                 f"dogen: differs={d['sayDiffers']}, o={d['oLen']}, fb={d['fbLen']}")

    # ---------------- PHASE 13 ----------------
    # ---------------- PHASE 20: the mini-game stage ----------------
    def _fake_cloud(self, local, cloud):
        return ("localStorage.setItem('examined-life-v1'," + json.dumps(json.dumps(local)) + ");"
                "window.__cloud=" + json.dumps(cloud) + ";window.__sets=0;"
                "window.claude={use:async(n)=>{"
                " if(n==='db')return{doc:()=>({get:async()=>({exists:!!window.__cloud,data:()=>window.__cloud}),set:async(o)=>{window.__cloud=JSON.parse(JSON.stringify(o));window.__sets++}})};"
                " if(n==='user')return{id:async()=>'u1'};"
                " if(n==='assets')return{upload:async()=>({id:'x'}),delete:async()=>{}};"
                "}};")

    async def mini_suite(self, b, group, ids):
        """Reusable checks for any list of mini-game ids (Phases 20-25 call this with their own ids)."""
        runs = {}
        for rm in (False, True):
            ctx, pg, errs = await self.page(b, reduced=rm)
            r = await pg.evaluate("""((ids)=>{const out={};
              for(const id of ids){const g=(typeof MINI!=='undefined')&&MINI[id],o=out[id]={};
                if(!g){o.missing=true;continue}
                const need=['who','title','land','setup','how','win','walk','init','step','draw','auto'];
                o.lacks=need.filter(k=>g[k]===undefined||g[k]===null);
                const owners=[];Object.keys(ARTI).forEach(tid=>ARTI[tid].items.forEach((it,i)=>{if(it.g===id)owners.push(tid)}));
                o.owners=owners;o.whoOk=id.startsWith('boss_')?(owners.length===0&&g.boss===g.who&&('boss_'+g.who)===id&&!!BOSSES[g.who]&&!!g.nofl):(owners.length===1&&owners[0]===g.who);
                const cv=document.createElement('canvas');cv.width=192;cv.height=320;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
                try{const s={W:192,H:320,rm:RM.matches,t:0};g.init(s);let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
                  for(let i=0;i<1800;i++){const inp=miniBlankInp();inp.dx=Math.round(rnd()*2-1);inp.dy=Math.round(rnd()*2-1);inp.a=rnd()<.5;inp.b=rnd()<.3;
                    inp.aTap=rnd()<.3;inp.bTap=rnd()<.3;inp.lTap=rnd()<.1;inp.rTap=rnd()<.1;inp.uTap=rnd()<.05;inp.dTap=rnd()<.05;
                    if(rnd()<.2){const tp={x:rnd()*192,y:rnd()*320};inp.tap=tp;inp.taps=[tp];inp.down={x:tp.x,y:tp.y};if(rnd()<.5)inp.drag={x:tp.x,y:tp.y,dx:rnd()*6-3,dy:rnd()*6-3}}
                    if(rnd()<.05)inp.swipe=['left','right','up','down'][Math.floor(rnd()*4)];
                    s.t+=.05;const res=g.step(s,.05,inp);if(i%10===0)g.draw(s,c,i*50);
                    if(res==='win'){g.bloom(s,c,.5,i*50);g.bloom(s,c,1,i*50);g.init(s)}else if(res==='end'){if(g.retry)g.retry(s);else g.init(s)}}
                  o.runs=true}catch(e){o.runs=false;o.err=String(e&&e.stack||e).slice(0,220)}
                try{const s={W:192,H:320,rm:RM.matches,t:0};g.init(s);const lim=g.limit||180;let won=-1;
                  for(let i=0;i<lim/.05;i++){const inp=miniBlankInp();s.t+=.05;g.auto(s,inp);if(g.step(s,.05,inp)==='win'){won=s.t;break}}
                  o.won=won}catch(e){o.won=-1;o.err2=String(e).slice(0,200)}
                if(g.short){const A=MINI_ART[id];o.short={stages:(g.stages||[]).length,setup:(g.setup||[]).length,bloomT:g.bloomT||2,art:g.art||null,artOk:!g.art||/^_?[a-z0-9]+_s$/.test(g.art),plate:!!(A&&A.plate),lines:!!(g.lines&&g.lines.some(Boolean)),toStage:!!g.toStage}}
              }return out})(""" + json.dumps(ids) + ")")
            runs[rm] = (r, errs[:])
            await ctx.close()
        r0, e0 = runs[False]; r1, e1 = runs[True]
        for id in ids:
            a, c = r0.get(id, {}), r1.get(id, {})
            if a.get("missing"):
                for n in ("wired", "runs", "winnable"):
                    self.add(group, f"mini_{id}_{n}", False, f"MINI.{id} is not defined")
                continue
            self.add(group, f"mini_{id}_wired", not a["lacks"] and a["whoOk"],
                     f"missing fields: {a['lacks'] or 'none'}; ARTI items with g='{id}': {a['owners']} (" + ("want none: a boss round earns no artifact; boss id matches, no lanterns)" if id.startswith('boss_') else "want exactly one, belonging to its who)"))
            ok = a.get("runs") and c.get("runs") and not e0 and not e1
            self.add(group, f"mini_{id}_runs", bool(ok),
                     "1800 random steps with draws, with and without Reduce Motion: no errors" if ok else f"errors: {a.get('err') or c.get('err') or (e0+e1)[:2]}")
            w0, w1 = a.get("won", -1), c.get("won", -1)
            self.add(group, f"mini_{id}_winnable", w0 >= 0 and w1 >= 0,
                     f"auto wins after {w0:.1f}s of play (Reduce Motion: {w1:.1f}s)" if w0 >= 0 and w1 >= 0 else f"auto did not win (won at {w0}, {w1}) {a.get('err2','')}")
            sh = a.get("short")
            if sh:  # Plan 5 A3: one stage, 1-2 setup lines, a 1.5-2.5 s bloom, no plate, shared art named <who>_s
                ok = sh["stages"] == 1 and 1 <= sh["setup"] <= 2 and 1.5 <= sh["bloomT"] <= 2.5 and not sh["plate"] and sh["artOk"]
                self.add(group, f"mini_{id}_short", ok, f"short game: {sh['stages']} stage (want 1), {sh['setup']} setup lines (want 1-2), bloom {sh['bloomT']} s (want 1.5-2.5), own plate {sh['plate']} (want none), art key {sh['art']!r}")

    async def p20(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
          __kitEnter('l1');await sleep(150);const l0=last;await sleep(150);const moving=last!==l0;
          startMini('sisyphus');await sleep(60);const others=['title','story','world','talk','reveal','panel','credits'].filter(x=>!document.querySelector('#'+x).classList.contains('hide'));
          const a=last;await sleep(200);const stopped=last===a;
          return {has:!!document.querySelector('#mini')&&!!document.querySelector('#mcv'),shown:!document.querySelector('#mini').classList.contains('hide'),scr:screen,others,moving,stopped}})()""")
        ok = r["has"] and r["shown"] and r["scr"] == "mini" and not r["others"] and r["moving"] and r["stopped"]
        self.add("p20", "mini_stage", ok, f"#mini and #mcv exist={r['has']}; shown={r['shown']}; other screens visible={r['others']}; world loop was running={r['moving']}, stopped={r['stopped']}")
        await ctx.close()

        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{__kitDef('l1');const a=arts.find(x=>x.id==='camus'&&x.i===1);delete P.f['camus:1'];const l1=artLabel(a);P.f['camus:1']=1;const l2=artLabel(a);
          const b=arts.find(x=>x.id==='frankl'&&x.i===0);delete P.f['frankl:0'];return {l1,l2,g:a.g,plain:artLabel(b)}})()""")
        self.add("p20", "mini_prompt", r["l1"] == "Play" and r["l2"] == "Look again" and r["plain"] == "Examine",
                 f"unfound chip: {r['l1']!r}; found: {r['l2']!r}; an ordinary artifact: {r['plain']!r}")
        await ctx.close()

        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));__kitEnter('l1');await sleep(100);
          P.f['camus:0']=1;P.f['camus:2']=1;delete P.f['camus:1'];delete P.m.sisyphus;
          const a=arts.find(x=>x.id==='camus'&&x.i===1);if(signState)closeSign();interactTarget={t:'art',a};pressA();await sleep(50);
          const opened=screen==='mini';miniAct('mnext');miniAct('mnext');const how=!!document.querySelector('#mCard [data-act="mbegin"]');miniAct('mbegin');const playing=MS&&MS.mode==='play';
          miniWin();miniResult();await sleep(50);const btn=document.querySelector('#mCard [data-act="mcontinue"]');btn&&btn.click();await sleep(50);
          return {opened,how,playing,f:!!P.f['camus:1'],world:screen==='world',sign:document.querySelector('#signText').textContent,want:ARTI.camus.items[1].text[0],
            signOpen:!document.querySelector('#signbox').classList.contains('hide'),m:P.m.sisyphus||null}})()""")
        ok = r["opened"] and r["how"] and r["playing"] and r["f"] and r["world"] and r["signOpen"] and r["sign"] == r["want"] and r["m"] and r["m"].get("won")
        self.add("p20", "mini_flow", bool(ok), f"pressA opened #mini={r['opened']}; Begin shown after setup={r['how']}; playing={r['playing']}; after Continue: P.f camus:1={r['f']}, #world={r['world']}, sign shows chip text={r['signOpen'] and r['sign']==r['want']}; P.m.sisyphus={r['m']}")
        await ctx.close()

        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));__kitEnter('l1');await sleep(80);delete P.f['camus:1'];MSESS.sisyphus={tries:0,t:0};
          const a=arts.find(x=>x.id==='camus'&&x.i===1);startMini('sisyphus',{art:a});miniAct('mbegin');
          miniEnd();const after1=!!document.querySelector('#mCard [data-act="mwalk"]');miniAct('mtry');miniEnd();
          const btn=document.querySelector('#mCard [data-act="mwalk"]');if(btn)btn.click();const walked=!!MS&&MS.mode==='walked';
          const c=document.querySelector('#mCard [data-act="mcontinue"]');if(c)c.click();await sleep(30);
          const byTime=(()=>{MSESS.sisyphus={tries:0,t:121};startMini('sisyphus');miniAct('mbegin');miniPause();const early=!!document.querySelector('#mCard [data-act="mwalk"]');closeMini();
            MSESS.sisyphus={tries:0,t:181};startMini('sisyphus');miniAct('mbegin');miniPause();const w=!!document.querySelector('#mCard [data-act="mwalk"]');closeMini();return w&&!early})(); /* Phase 29 (G8): 3 minutes, not 2 */
          return {after1,shown:!!btn,walked,f:!!P.f['camus:1'],world:screen==='world',byTime}})()""")
        ok = (not r["after1"]) and r["shown"] and r["walked"] and r["f"] and r["world"] and r["byTime"]
        self.add("p20", "mini_walk_on", bool(ok), f"after 1 try: {r['after1']} (want False); after 2 tries: {r['shown']}; clicking it earns the chip={r['f']}; back in world={r['world']}; shown in pause after 3 minutes, not 2={r['byTime']}")
        await ctx.close()

        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));__kitEnter('l1');await sleep(80);
          P.c.camus=3;P.m.sisyphus={best:1,plays:1,won:true,at:1};P.f['camus:1']=1;const before=JSON.stringify(P.f); /* Phase 38 (A8): the menu lists a game only when its artifact is found */
          startTalk(npcs.find(x=>x.id==='camus'));const ch=TK.steps.find(s=>s.t==='choice');const labels=ch.opts.map(o=>o.l);TK.i=TK.steps.indexOf(ch);
          choose(ch.opts.findIndex(o=>o.a==='mini'));const inMini=screen==='mini'&&!!MS&&MS.replay;miniAct('mbegin');miniWin();miniResult();
          const b=document.querySelector('#mCard [data-act="mcontinue"]');if(b)b.click();await sleep(30);
          return {labels,inMini,same:JSON.stringify(P.f)===before,world:screen==='world'}})()""")
        want = "Play Sisyphus’s Hill again"
        self.add("p20", "mini_replay", want in r["labels"] and r["inMini"] and r["same"] and r["world"],
                 f"choices include {want!r}={want in r['labels']}; replay opened={r['inMini']}; P.f unchanged={r['same']}; back in world={r['world']}")
        await ctx.close()

        base = {"c": {}, "a": {}, "w": {}, "f": {}, "intro": True, "ts": {"reset": 100, "a": 0, "w": 0}}
        ctx, pg, errs = await self.page(b, init=self._fake_cloud(
            {**base, "m": {"sisyphus": {"best": 1, "plays": 5, "won": False, "at": 1}}},
            {**base, "m": {"sisyphus": {"best": 3, "plays": 2, "won": True, "at": 2}}}))
        await pg.wait_for_timeout(400)
        r = await pg.evaluate("({m:P.m.sisyphus,cloud:window.__cloud&&window.__cloud.m&&window.__cloud.m.sisyphus})")
        m = r["m"] or {}
        ok = m.get("best") == 3 and m.get("plays") == 5 and m.get("won") is True and m.get("at") == 2 and (r["cloud"] or {}).get("best") == 3
        self.add("p20", "mini_save_sync", ok, f"merged P.m.sisyphus={m}; persist() wrote m to the cloud={bool(r['cloud'])}")
        await ctx.close()

        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));__kitEnter('l1');await sleep(80);startMini('sisyphus');miniAct('mbegin');
          const kd=key=>document.body.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true})),ku=key=>document.body.dispatchEvent(new KeyboardEvent('keyup',{key,bubbles:true}));
          kd('ArrowLeft');await sleep(90);const dx=MS.inp.dx;kd('z');await sleep(90);const a=MS.inp.a;ku('ArrowLeft');ku('z');await sleep(60);const released=MS.inp.dx===0&&!MS.inp.a;
          kd('Escape');await sleep(30);const paused=MS.mode==='pause';kd('Escape');await sleep(30);const resumed=MS.mode==='play';
          kd('ArrowRight');window.dispatchEvent(new Event('blur'));await sleep(60);const blurred=MS.inp.dx===0;
          return {dx,a,released,paused,resumed,blurred}})()""")
        ok = r["dx"] == -1 and r["a"] and r["released"] and r["paused"] and r["resumed"] and r["blurred"]
        self.add("p20", "mini_keyboard", ok, "; ".join(f"{k}={v}" for k, v in r.items()))
        await ctx.close()

        await self.mini_suite(b, "p20", ["sisyphus"])

    async def p21(self, b):
        await self.mini_suite(b, "p21", ["goalkeeper", "idols", "cages"])  # Phase 45B: Having or Being removed

    async def p22(self, b):
        await self.mini_suite(b, "p22", ["mean", "gadfly", "yours", "thieves", "above"])

    async def p23(self, b):
        await self.mini_suite(b, "p23", ["lute", "water", "kitchen", "butterfly"])

    async def p24(self, b):
        await self.mini_suite(b, "p24", ["lights", "corner", "web", "rule"])
        # Phase 24B: in every scene of If Everyone Did It, each wrong card is tried by you alone first, then collapses the square;
        # the working card lights a star. Lanterns count wrong cards per scene.
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const g=MINI.rule;if(!g)return {missing:true};const out={scenes:[],order:[]};
          const run=(s,sec,stop)=>{for(let i=0;i<sec/.05&&!stop();i++){const inp=miniBlankInp();s.t+=.05;if(g.step(s,.05,inp)==='win')return 'win'}};
          const pick=(s,k)=>{const inp=miniBlankInp(),j=s.order.indexOf(k);inp.taps=[{x:96,y:246+24*j+11}];inp.tap=inp.taps[0];s.t+=.05;g.step(s,.05,inp)};
          const s={W:192,H:320,rm:false,t:0};g.init(s);let won=false;
          for(let sc=0;sc<5;sc++){const o={sci:s.sci,wrong:[]};
            for(const k of [1,2]){run(s,5,()=>s.ph==='choose');pick(s,k);const alone=s.ph==='you'||s.ph==='reset';run(s,1,()=>s.ph==='you');const mine=s.ph==='you'&&s.me&&!s.figs.some(f=>f.ad);
              run(s,12,()=>s.ph==='bad');o.wrong.push({k,alone:alone&&mine,bad:s.ph==='bad',stars:s.stars})}
            run(s,5,()=>s.ph==='choose');pick(s,0);const res=run(s,14,()=>s.ph==='good'||s.ph==='next'||(s.ph==='choose'&&s.sci>sc));o.good=s.stars===sc+1||res==='win';if(res==='win')won=true;
            if(sc<4)run(s,4,()=>s.ph==='choose'&&s.sci===sc+1);out.scenes.push(o)}
          if(!won)won=run(s,6,()=>false)==='win';out.won=won;out.rate=g.rate(s);
          const s2={W:192,H:320,rm:false,t:0};g.init(s2);let w2=false;for(let i=0;i<180/.05&&!w2;i++){const inp=miniBlankInp();s2.t+=.05;g.auto(s2,inp);w2=g.step(s2,.05,inp)==='win'}out.rate2=g.rate(s2);
          const s3={W:192,H:320,rm:false,t:0};g.init(s3);s3.wrong=[1,1,0,1,0];out.rate3=g.rate(s3);return out})()""")
        if r.get("missing"):
            self.add("p24", "rule_cards", False, "MINI.rule is not defined")
        else:
            ok = all(all(w["alone"] and w["bad"] for w in o["wrong"]) and o["good"] for o in r["scenes"]) and r["won"]
            self.add("p24", "rule_cards", ok, f"5 scenes: each wrong card tried by you alone, then collapses; the working card lights a star={ok}; won={r['won']}")
            self.add("p24", "rule_lanterns", r["rate"] == 1 and r["rate2"] == 3 and r["rate3"] == 2,
                     f"two wrong cards in every scene -> {r['rate']} (want 1); all first try -> {r['rate2']} (want 3); at most one wrong per scene -> {r['rate3']} (want 2)")
        await ctx.close()

    # ---------------- Build plan 3 addendum: lanterns and blooms ----------------
    async def p25(self, b):
        await self.mini_suite(b, "p25", ["boss_b1", "boss_b2", "boss_b3", "boss_b4"])
        # each boss's first fight has exactly one mini step, right after its third ask step; a rematch has none
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const out=[];
          for(const [lid,bid] of [['l1','b1'],['l2','b2'],['l3','b3'],['l4','b4']]){
            for(const rematch of [false,true]){
              __kitDef(lid);P.c={};if(rematch)P.c[bid]=3;
              startTalk(npcs.find(n=>n.boss),rematch?{rematch:true}:undefined);
              const st=TK.steps,mi=st.map((x,i)=>x.t==='mini'?i:-1).filter(i=>i>=0),asks=st.map((x,i)=>x.t==='ask'?i:-1).filter(i=>i>=0);
              out.push({lid,rematch,minis:mi.length,asks:asks.length,after3:mi.length===1&&asks.length===5&&mi[0]===asks[2]+1,g:mi.length?st[mi[0]].g:null,want:'boss_'+bid,between:mi.length?st[mi[0]-1].t:null});
              TK=null;show('world')}}
          return out})()""")
        bad = [x for x in r if not ((x["minis"] == 0 and x["asks"] == 5) if x["rematch"] else (x["minis"] == 1 and x["after3"] and x["g"] == x["want"]))]
        self.add("p25", "boss_round_placed", not bad and len(r) == 8,
                 f"{len(r)} fights checked (4 bosses: first fight has the round after the 3rd challenge, rematch has none); wrong: {bad or 'none'}")
        await ctx.close()

        # playing through the round: the boss's name on the card, narration, no lanterns, back to the talk on the next challenge
        for rm in (False, True):
            ctx, pg, errs = await self.page(b, reduced=rm)
            r = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const out=[];
              const toMini=(rematch)=>{startTalk(npcs.find(n=>n.boss),rematch?{rematch:true}:undefined);let asks=0,g=0;
                while(TK&&screen==='talk'&&g++<300){if(TK.typing){finishType();continue}const s=TK.fb||TK.steps[TK.i];if(!TK.fb&&s.t==='ask'){reply(0);asks++;continue}advance()}return asks};
              for(const [lid,bid] of [['l1','b1'],['l2','b2'],['l3','b3'],['l4','b4']]){
                const o={bid};__kitDef(lid);P.c={};P.f={};P.m={};P.g={};
                const snap=()=>JSON.stringify([P.f,P.m,P.g,P.c]);const before=snap();
                o.asks=toMini(false);o.onMini=screen==='mini'&&MS&&MS.id==='boss_'+bid&&MS.boss===true;
                o.name=(document.querySelector('#mCard .who')||{}).textContent;o.nameOk=o.name===BOSSES[bid].n;
                o.narr=!!document.querySelector('#mCard .txt.narr');
                miniAct('mnext');o.beginBtn=!!document.querySelector('#mCard [data-act="mbegin"]');
                o.leaveSetup=!!document.querySelector('#mCard [data-act="mleave"]');
                miniAct('mbegin');o.playing=MS.mode==='play';o.noArt=MS.art===null;
                miniPause();o.walkEarly=!!document.querySelector('#mCard [data-act="mwalk"]');o.leavePause=!!document.querySelector('#mCard [data-act="mleave"]');miniResume();
                miniWin();miniResult();await sleep(30);
                o.head=(document.querySelector('#mCard .mhead')||{}).textContent;o.noLantern=!document.querySelector('#mCard .mlan');o.noAgain=!document.querySelector('#mCard [data-act="magain"]');o.contBtn=!!document.querySelector('#mCard [data-act="mcontinue"]');
                o.savedBest=P.m['boss_'+bid]||P.g['boss_'+bid]||null;
                miniAct('mcontinue');await sleep(30);
                o.backTalk=screen==='talk'&&!!TK;const nx=TK&&TK.steps[TK.i];o.next=nx&&nx.t;o.nextIsAsk4=!!nx&&nx.t==='ask'&&TK.steps.slice(0,TK.i).filter(x=>x.t==='ask').length===3;
                let g2=0;while(TK&&TK.typing&&g2++<5)finishType();
                o.hasText=!!TK&&document.querySelector('#dTxt').textContent.length>5;
                o.unchanged=snap()===before;leaveTalk();
                // Walk on: needs two minutes of play (never earns anything)
                toMini(false);miniAct('mnext');miniAct('mbegin');MS.sess.t=130;miniPause();o.walkShown=!!document.querySelector('#mCard [data-act="mwalk"]');
                miniAct('mwalk');o.walked=MS.mode==='walked';o.walkHead=(document.querySelector('#mCard .mhead')||{}).textContent;miniAct('mcontinue');await sleep(30);
                o.walkBack=screen==='talk'&&!!TK;o.walkUnchanged=snap()===before;leaveTalk();
                // a boss round can't be left: even a direct leave does nothing
                toMini(false);miniAct('mleave');o.stillHere=screen==='mini'&&!!MS&&!!TK;closeMini();TK=null;show('world');
                // a rematch has no round: the fight runs straight through to its end
                P.c[bid]=3;const a2=toMini(true);o.rematchNoMini=screen!=='mini'&&!MS&&a2===5;if(TK)leaveTalk();
                out.push(o)}
              return out})()""")
            errs2 = errs[:]
            tag = "Reduce Motion" if rm else "normal"
            def bad_of(f):
                return [x["bid"] for x in r if not f(x)]
            checks = {
                "reached after the 3rd challenge": lambda x: x["asks"] == 3 and x["onMini"],
                "boss's name on the card, narration": lambda x: x["nameOk"] and x["narr"],
                "no Leave or Not now button (setup, pause)": lambda x: not x["leaveSetup"] and not x["leavePause"],
                "no early Walk on": lambda x: not x["walkEarly"],
                "no lanterns, no Play again, no artifact line": lambda x: x["noLantern"] and x["noAgain"] and x["contBtn"] and "Artifact" not in (x["head"] or ""),
                "back in the talk on the next challenge": lambda x: x["backTalk"] and x["nextIsAsk4"] and x["hasText"],
                "nothing saved (P.f, P.m, P.g, P.c)": lambda x: x["unchanged"] and not x["savedBest"] and x["walkUnchanged"],
                "Walk on after two minutes": lambda x: x["walkShown"] and x["walked"] and (x["walkHead"] or "").find("Artifact") < 0 and x["walkBack"],
                "a leave attempt does nothing": lambda x: x["stillHere"],
                "rematch has no round": lambda x: x["rematchNoMini"],
            }
            fails = {k: bad_of(f) for k, f in checks.items() if bad_of(f)}
            self.add("p25", f"boss_round_flow_{'rm' if rm else 'normal'}", not fails and not errs2 and len(r) == 4,
                     f"{tag}: 4 bosses played through; " + ("all pass: " + ", ".join(checks) if not fails else f"failed: {fails}") + (f"; page errors {errs2[:2]}" if errs2 else ""))
            await ctx.close()

        # real pointer events on the canvas: tap, press-and-hold, drag and walk all reach the games
        ctx, pg, errs = await self.page(b)
        async def at(gx, gy):
            r = await pg.evaluate("(()=>{const r=document.querySelector('#mcv').getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()")
            return r[0] + gx / 192 * r[2], r[1] + gy / 320 * r[3]
        out = {}
        await pg.evaluate("__kitEnter('l3');startMini('boss_b3',{boss:true});miniAct('mnext');miniAct('mbegin');MS.s.spT=99;MS.s.slots[0]={k:0,heavy:false,f:1,x0:0,y0:0,set:0};MS.s.slots[1]={k:2,heavy:true,f:1,x0:0,y0:0,set:0};MS.s.slots[2]={k:3,heavy:true,f:1,x0:0,y0:0,set:0}")   # Phase 35C: the rebuilt Open Hands has its eight slots at [62/86/110/134, 148] and [.., 178]
        x, y = await at(62, 148); await pg.mouse.move(x, y); await pg.mouse.down(); await pg.mouse.up(); await pg.wait_for_timeout(250)
        out["b3_tap"] = await pg.evaluate("MS.s.slots[0]===null&&MS.s.done===1")
        x, y = await at(86, 148); await pg.mouse.move(x, y); await pg.mouse.down(); await pg.wait_for_timeout(500)
        mid = await pg.evaluate("MS.s.hold>.2&&MS.s.hold<.95&&!!MS.s.slots[1]")
        await pg.wait_for_timeout(1000); await pg.mouse.up(); await pg.wait_for_timeout(150)   # about 1.5 s in all: the heavy hold is 1.2 s
        out["b3_hold"] = mid and await pg.evaluate("MS.s.slots[1]===null&&MS.s.done===2")
        x, y = await at(110, 148); await pg.mouse.move(x, y); await pg.mouse.down()
        for i in range(12):
            await pg.mouse.move(x, y - 14 * (i + 1), steps=1)   # a fast yank, well over the speed limit
        await pg.mouse.up(); await pg.wait_for_timeout(150)
        out["b3_fast_yank_holds_on"] = await pg.evaluate("!!MS.s.slots[2]")
        await pg.evaluate("closeMini();TK=null")
        await pg.evaluate("__kitEnter('l4');startMini('boss_b4',{boss:true});miniAct('mnext');miniAct('mbegin')")
        for lx in (52, 96, 140):   # Phase 35C: the three lenses sit at y 228, the bell at [36,196], the switch starts at [156,196] and goes to [88,204]
            x, y = await at(lx, 228); await pg.mouse.click(x, y); await pg.wait_for_timeout(900)
        seen = await pg.evaluate("MS.s.seen.every(Boolean)")
        x, y = await at(36, 196); await pg.mouse.click(x, y); await pg.wait_for_timeout(200)
        out["b4_lenses_then_bell"] = seen and await pg.evaluate("MS.s.solved===true&&MS.s.st===0")
        await pg.evaluate("MINI.boss_b4.toStage(MS.s,2);MS.s.seen=[true,true,true]")
        x, y = await at(156, 196); await pg.mouse.move(x, y); await pg.mouse.down()
        for i in range(1, 21):
            gx, gy = await at(156 - 68 * i / 20, 196 + 8 * i / 20); await pg.mouse.move(gx, gy); await pg.wait_for_timeout(30)
        await pg.mouse.up(); await pg.wait_for_timeout(200)
        out["b4_drag_into_place"] = await pg.evaluate("MS.s.st===2&&MS.s.solved===true")
        await pg.evaluate("closeMini();TK=null")
        await pg.evaluate("__kitEnter('l1');startMini('boss_b1',{boss:true});miniAct('mnext');miniAct('mbegin');MS.s.spT=99")
        x, y = await at(150, 120); await pg.mouse.move(x, y); await pg.mouse.down(); await pg.wait_for_timeout(1200); await pg.mouse.up()
        out["b1_drag_walks"] = await pg.evaluate("MS.s.p>.01&&MS.s.x>100")
        await pg.evaluate("MS.s.wisps.push({x:60,y:120,dead:false,dying:0,ph:0})")
        x, y = await at(60, 120); await pg.mouse.move(x, y); await pg.mouse.down(); await pg.mouse.up(); await pg.wait_for_timeout(150)
        out["b1_tap_sends_light"] = await pg.evaluate("MS.s.wisps.some(w=>w.dead)&&MS.s.lights.some(l=>l.cool>0)")
        await pg.evaluate("closeMini();TK=null")
        await pg.evaluate("__kitEnter('l2');startMini('boss_b2',{boss:true});miniAct('mnext');miniAct('mbegin')")
        x0 = await pg.evaluate("MS.s.x"); x, y = await at(40, 132); await pg.mouse.move(x, y); await pg.mouse.down(); await pg.wait_for_timeout(600); await pg.mouse.up()
        out["b2_drag_moves"] = await pg.evaluate("MS.s.x<" + str(x0) + "-10")
        self.add("p25", "boss_real_touch", all(out.values()) and not errs, f"real mouse/touch events on the canvas: {out}" + (f"; page errors {errs[:2]}" if errs else ""))
        await ctx.close()

        # the lanterns total is unchanged (boss rounds carry none), and boss rounds never appear on a thinker's replay list
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{__kitDef('l1');const t=miniTotals();const rep=Object.keys(MINI).filter(g=>MINI[g].who==='camus'||PH[MINI[g].who]===undefined&&MINI[g].boss).map(g=>g);
          const bossIds=Object.keys(MINI).filter(g=>MINI[g].boss);const listed=Object.keys(PH).filter(id=>Object.keys(MINI).filter(g=>MINI[g].who===id).some(g=>MINI[g].boss));
          const fl=Object.keys(MINI).filter(g=>!MINI[g].nofl),bossFl=bossIds.filter(g=>!MINI[g].nofl);
          return {of:t.of,games:Object.keys(MINI).length,bossIds,listed,want:fl.length*3,bossFl}})()""")
        self.add("p25", "boss_round_leaves_no_trace", r["of"] == r["want"] and r["of"] >= 51 and r["games"] >= 22 and len(r["bossIds"]) == 4 and not r["bossFl"] and not r["listed"],
                 f"lanterns possible={r['of']} (want 3 x the registered games with lanterns = {r['want']}; boss rounds with lanterns {r['bossFl'] or 'none'}); games={r['games']} (18 + 4 before Plan 5); boss rounds={r['bossIds']}; thinkers wrongly listing one={r['listed'] or 'none'}")
        await ctx.close()

    # ---------------- PHASE 28 ----------------
    # ---------------- PHASE 29: foundations (split files, 2x stage, art loading, stages, plates) ----------------
    async def p29(self, b):
        ALL = ["sisyphus","goalkeeper","idols","cages","mean","gadfly","yours","thieves","above","lute","water","kitchen","butterfly",
               "lights","corner","web","rule","boss_b1","boss_b2","boss_b3","boss_b4"]
        FILES = ["fx","l1","l2","l3","l4","boss"]
        page_src = open(self.path, encoding="utf-8").read()
        left = sorted(set(re.findall(r"MINI\.(\w+)\s*=", page_src)))
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("((ids,files)=>({loaded:files.filter(f=>!MINI_LOADED[f]),missing:ids.filter(i=>!MINI[i])}))(" + json.dumps(ALL) + "," + json.dumps(FILES) + ")")
        ok = not r["loaded"] and not r["missing"] and not left and not errs
        self.add("p29", "split_files", ok, f"scripts not loaded: {r['loaded'] or 'none'}; ids not registered: {r['missing'] or 'none'}; MINI.<id>= left in the page: {left or 'none'}; errors: {errs[:2] or 'none'}")
        await ctx.close()

        files = self.mini_files()
        bad = []
        for f in files:
            pr = subprocess.run(["node", "--check", f], capture_output=True, text=True)
            if pr.returncode:
                bad.append(os.path.basename(f))
        sizes = ", ".join(f"{os.path.basename(f)} {os.path.getsize(f)/1024:.1f} KB" for f in files)
        self.add("p29", "split_syntax", bool(files) and not bad, f"node --check failed: {bad or 'none'}; page {os.path.getsize(self.path)/1024:.1f} KB; {sizes}")

        ctx, pg, errs = await self.page(b, block=["mini/l2.js"])
        r = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));__kitEnter('l2');await sleep(120);
          const a=arts.find(x=>x.id==='socrates'&&x.g==='gadfly');delete P.f['socrates:'+a.i];const label=artLabel(a);
          if(signState)closeSign();interactTarget={t:'art',a};pressA();await sleep(60);
          return {has:!!MINI.gadfly,label,scr:screen,sign:!document.querySelector('#signbox').classList.contains('hide'),found:!!P.f['socrates:'+a.i]}})()""")
        ok = (not r["has"]) and r["label"] == "Examine" and r["scr"] == "world" and r["sign"]
        self.add("p29", "split_safety", ok, f"with mini/l2.js blocked: MINI.gadfly defined={r['has']} (want False); chip label={r['label']!r}; pressA stays in {r['scr']!r} and opens the sign={r['sign']}")
        await ctx.close()

        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{startMini('sisyphus');const c=document.querySelector('#mcv');const w=parseFloat(c.style.width),h=parseFloat(c.style.height);
          const k=Math.round(w*devicePixelRatio/384);closeMini();return {cw:c.width,ch:c.height,w,h,k,whole:Math.abs(w*devicePixelRatio/384-k)<1e-6}})()""")
        ok = r["cw"] == 384 and r["ch"] == 640 and r["whole"] and r["k"] == 3
        self.add("p29", "hd_stage", ok, f"canvas {r['cw']}x{r['ch']} (want 384x640); on-screen {r['w']:.1f}x{r['h']:.1f} pt; k={r['k']} device pixels per canvas pixel (want 3 at 393 pt, a whole step={r['whole']})")
        await ctx.close()

        # legacy_look_same: games not rebuilt yet draw exactly as before the split (seeded random, 3 s of auto)
        legacy = os.path.join(os.path.dirname(os.path.dirname(self.path)), "base", "index.html")
        if getattr(self.args, "legacy", ""):
            legacy = self.args.legacy
        LEGACY_IDS = []   # Phase 35C: boss_b3 and boss_b4 are rebuilt now, so no game is left that still draws the Phase 25 way: the list is empty and the check passes vacuously (nothing to compare). Add an id here when a future phase needs a not-yet-rebuilt game held to its pre-split look.
        if not LEGACY_IDS:
            self.add("p29", "legacy_look_same", True, "no game is left on its pre-split look (boss_b3 and boss_b4, the last two, were rebuilt in Phase 35C): nothing to compare, passes vacuously")
        elif os.path.exists(legacy):
            from PIL import Image
            import base64, io
            JS = """((id,hd)=>{let seed=11;Math.random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
              const g=MINI[id];const cv=document.createElement('canvas');cv.width=hd?384:192;cv.height=hd?640:320;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
              const s={W:192,H:320,rm:false,t:0};g.init(s);for(let i=0;i<60;i++){const inp=miniBlankInp();s.t+=.05;g.auto(s,inp);g.step(s,.05,inp)}
              if(hd)c.setTransform(2,0,0,2,0,0);g.draw(s,c,3000);return cv.toDataURL('image/png')})"""
            srv = _serve(os.path.dirname(os.path.abspath(legacy)))
            lurl = f"http://127.0.0.1:{srv.server_address[1]}/{os.path.basename(legacy)}"
            out = []
            for id in LEGACY_IDS:  # Phase 35C: empty now. (Phase 35B left only boss_b3 here.) Phase 35B: boss_b1 and boss_b2 are rebuilt now, so only boss_b3 is left here (the last boss round to be rebuilt in 35C). Phase 34C: web and rule are rebuilt now, so they left this list (Phase 34B: lights left it; Phase 33B: water left it; Phase 32B: gadfly left it)
                c1, p1, _ = await self.page(b)
                a = await p1.evaluate(JS + f"('{id}',true)")
                await c1.close()
                c2, p2, _ = await self.page(b, url=lurl)
                o = await p2.evaluate(JS + f"('{id}',false)")
                await c2.close()
                ia = Image.open(io.BytesIO(base64.b64decode(a.split(",")[1]))).convert("RGBA").resize((192, 320), Image.NEAREST)
                io_ = Image.open(io.BytesIO(base64.b64decode(o.split(",")[1]))).convert("RGBA")
                pa, po = ia.tobytes(), io_.tobytes()
                same = sum(1 for i in range(0, len(pa), 4) if abs(pa[i]-po[i]) + abs(pa[i+1]-po[i+1]) + abs(pa[i+2]-po[i+2]) <= 24)
                out.append((id, same / (192 * 320)))
            srv.shutdown()
            ok = all(v >= .99 for _, v in out)
            self.add("p29", "legacy_look_same", ok, "; ".join(f"{i} {v*100:.1f}%" for i, v in out) + " of pixels match the page from before the split (want 99%)")
        else:
            self.add("p29", "legacy_look_same", False, f"no pre-split copy at {legacy} (pass --legacy FILE)")

        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const keep=MINI_ART.sisyphus;MINI_ART.sisyphus={atlas:'ffffffffffffffffffffffffffffffff',people:'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',rects:{boulder_0:[0,0,10,10]},prects:{},bg:['dddddddddddddddddddddddddddddddd'],plate:'cccccccccccccccccccccccccccccccc'};
          const g=MINI.sisyphus,cv=document.createElement('canvas');cv.width=384;cv.height=640;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);let won=-1,err='';
          try{loadMiniArt('sisyphus');const s={W:192,H:320,rm:false,t:0};g.init(s);for(let i=0;i<(g.limit||240)/.05;i++){const inp=miniBlankInp();s.t+=.05;g.auto(s,inp);const res=g.step(s,.05,inp);if(i%5===0)g.draw(s,c,i*50);if(res==='win'){won=s.t;g.bloom(s,c,.5,0);g.bloom(s,c,1,0);break}}}catch(e){err=String(e).slice(0,200)}
          if(keep)MINI_ART.sisyphus=keep;else delete MINI_ART.sisyphus;return {won,err}})()""")
        self.add("p29", "art_fallback", r["won"] >= 0 and not r["err"] and not errs, f"with bogus art ids, sisyphus auto-wins at {r['won']:.1f}s; errors: {r['err'] or errs[:1] or 'none'}")
        await ctx.close()

        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));__kitEnter('l1');await sleep(80);
          MINI.__t={who:'camus',title:'Test',land:'l1',setup:['a'],how:'b',win:'c',walk:'d',pad:false,ab:true,limit:0,fl:['x','y','z'],rate:()=>1,stages:['One','Two','Three'],
            init(s){s.st=0;s.stT=0;s.n=0},toStage(s,n){this.init(s);if(n)stageUp(s,n)},step(s,dt,inp){s.stT+=dt;if(inp.aTap)stageUp(s)},draw(s,c){},bloom(){},auto(){}};
          MSESS.__t={tries:0,t:0};startMini('__t');miniAct('mnext');miniAct('mbegin');MS.inp=null;
          stageUp(MS.s);const ban=document.querySelector('#mBanner'),banner=!ban.classList.contains('hide')&&ban.textContent,pips=document.querySelectorAll('#mTitle .mpips i.on').length;
          miniEnd();miniAct('mtry');const st=MS.s.st,mode=MS.mode;
          miniPause();const w1=!!document.querySelector('#mCard [data-act="mwalk"]');miniResume();MS.sess.t=181;MS.sess.tries=0;miniPause();const w2=!!document.querySelector('#mCard [data-act="mwalk"]');
          closeMini();delete MINI.__t;delete MSESS.__t;return {banner,pips,st,mode,w1,w2,gone:!MINI.__t}})()""")
        ok = r["banner"] == "II · Two" and r["pips"] == 2 and r["st"] == 1 and r["mode"] == "play" and not r["w1"] and r["w2"] and r["gone"]
        self.add("p29", "stage_engine", ok, f"banner={r['banner']!r}; pips lit={r['pips']}; Try again restarts at stage {r['st']} ({r['mode']}); Walk on at start={r['w1']}, at 181 s={r['w2']}; test entry removed={r['gone']}")
        await ctx.close()

        tmp = tempfile.mkdtemp()
        from PIL import Image
        Image.new("RGB", (768, 1280), (200, 150, 80)).save(os.path.join(tmp, "plate.jpg"))
        PID = "abcdefabcdefabcdefabcdefabcdef12"
        res = {}
        for rm in (False, True):
            ctx, pg, errs = await self.page(b, reduced=rm, extra_blobs={PID: os.path.join(tmp, "plate.jpg")})
            res[rm] = await pg.evaluate("""(async(pid)=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));__kitEnter('l1');await sleep(80);
              const keep=MINI_ART.sisyphus;MINI_ART.sisyphus=Object.assign({},keep||{},{plate:pid});startMini('sisyphus');miniAct('mnext');miniAct('mnext');miniAct('mbegin');
              await sleep(200);const p=document.querySelector('#mPlate'),o0=getComputedStyle(p).opacity;miniWin();await sleep(120);const o1=parseFloat(p.style.opacity||0);
              if(MS&&MS.mode==='bloom'){MS.bk=.99;await sleep(80)}miniResult();await sleep(80);const o2=parseFloat(p.style.opacity||0),tr=getComputedStyle(p).transitionDuration;
              closeMini();if(keep)MINI_ART.sisyphus=keep;else delete MINI_ART.sisyphus;return {o0:parseFloat(o0),o1,o2,tr}})('""" + PID + "')")
            await ctx.close()
        a, c = res[False], res[True]
        ok = a["o0"] == 0 and a["o1"] < .5 and a["o2"] == 1 and c["o2"] == 1 and c["o1"] == 1
        self.add("p29", "plate_overlay", ok, f"before the bloom {a['o0']}; early bloom {a['o1']:.2f}; at the result {a['o2']}; Reduce Motion: at once {c['o1']}, result {c['o2']}")

        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));__kitEnter('l1');await sleep(80);
          startMini('sisyphus');miniAct('mnext');miniAct('mnext');miniAct('mbegin');miniWin();miniResult();await sleep(1500);
          const h=document.querySelector('#mCard').getBoundingClientRect().height;closeMini();return {h,vh:innerHeight}})()""")
        self.add("p29", "result_card_height", r["h"] <= .48 * r["vh"] + .5, f"result card {r['h']:.0f} pt of {r['vh']} pt ({r['h']/r['vh']*100:.0f}%, want at most 48%)")
        await ctx.close()

        here = os.path.dirname(os.path.abspath(__file__))
        cands = [os.path.join(here, "mini-art-tools.py"), os.path.join(here, "tools", "mini-art-tools.py"), os.path.join(os.path.dirname(self.path), "..", "tools", "mini-art-tools.py")]
        tool = next((c for c in cands if os.path.exists(c)), None)
        if tool:
            pr = subprocess.run([sys.executable, tool, "--selftest"], capture_output=True, text=True)
            ok = pr.returncode == 0 and "PASS" in pr.stdout
            self.add("p29", "art_tools_selftest", ok, f"{os.path.basename(tool)} --selftest: " + (pr.stdout.strip().splitlines() or ["(no output)"])[-1][:120])
        else:
            self.add("p29", "art_tools_selftest", False, "mini-art-tools.py not found next to the kit (or in tools/)")

    # ---------------- PHASES 30-31: the developed Level I games (hd_suite + rules_<id>) ----------------
    async def hd_suite(self, b, group, ids, short=None):
        """Plan 4 A10: per developed game — fallback (no art), art (with --blobs), stages (auto through all three, with banners), plate.
        Plan 5 A9 (Phase 38): a short game (MINI[id].short, or short=True) is checked in short mode: its shared art key (g.art), one stage
        whose banner is the name alone with no pips, and no plate (the last bloom frame is the still)."""
        if ids:
            ctx, pg, errs = await self.page(b)
            kinds = await pg.evaluate("((ids)=>Object.fromEntries(ids.map(i=>[i,!!(MINI[i]&&MINI[i].short)])))(" + json.dumps(ids) + ")")
            await ctx.close()
        for id in ids:
            if (short if short is not None else kinds.get(id)):
                await self.hd_short(b, group, id)
                continue
            ctx, pg, errs = await self.page(b)
            r = await pg.evaluate("""((id)=>{const g=MINI[id];if(!g)return {missing:true};const keep=MINI_ART[id];
              MINI_ART[id]=Object.assign({},keep||{},{atlas:'f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0',people:'e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0',bg:['d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0','d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1','d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2'],plate:'c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0'});
              const cv=document.createElement('canvas');cv.width=384;cv.height=640;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);let err='',won=-1;
              try{loadMiniArt(id);const s={W:192,H:320,rm:false,t:0};g.init(s);let seed=5;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
                for(let i=0;i<1800;i++){const inp=miniBlankInp();inp.dx=Math.round(rnd()*2-1);inp.a=rnd()<.5;inp.b=rnd()<.4;inp.aTap=rnd()<.2;inp.bTap=rnd()<.2;inp.fingers=rnd()<.1?2:0;
                  if(rnd()<.25){const tp={x:rnd()*192,y:rnd()*320};inp.tap=tp;inp.taps=[tp];inp.down=tp}s.t+=.05;const res=g.step(s,.05,inp);if(i%3===0)g.draw(s,c,i*50);
                  if(res==='win'){g.bloom(s,c,.5,0);g.bloom(s,c,1,0);g.init(s)}else if(res==='end'){g.toStage(s,s.st||0)}}
                g.init(s);for(let i=0;i<(g.limit||300)/.05;i++){const inp=miniBlankInp();s.t+=.05;g.auto(s,inp);const res=g.step(s,.05,inp);if(i%4===0)g.draw(s,c,i*50);if(res==='win'){won=s.t;g.bloom(s,c,.5,0);g.bloom(s,c,1,0);break}if(res==='end')g.toStage(s,s.st||0)}
              }catch(e){err=String(e&&e.stack||e).slice(0,240)}
              if(keep)MINI_ART[id]=keep;else delete MINI_ART[id];return {err,won}})('""" + id + "')")
            ok = not r.get("missing") and not r["err"] and r["won"] >= 0 and not errs
            self.add(group, f"hd_{id}_fallback", ok, f"no art loaded: 1800 random steps with draws, then auto wins at {r.get('won',-1):.1f}s; errors: {r.get('err') or errs[:1] or 'none'}")
            await ctx.close()

            if self.args.blobs:
                ctx, pg, errs = await self.page(b)
                r = await pg.evaluate("""(async(id)=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const g=MINI[id],A=MINI_ART[id];if(!A)return {none:true};loadMiniArt(id);
                  const ids=[A.atlas,A.people,...(A.bg||[]),A.plate].filter(Boolean);for(let i=0;i<60&&!ids.every(a=>MIMG[a]&&(MIMG[a].ok||MIMG[a].bad));i++)await sleep(50);
                  const bad=ids.filter(a=>!MIMG[a]||!MIMG[a].ok);const cv=document.createElement('canvas');cv.width=384;cv.height=640;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);let err='',won=-1;
                  try{const s={W:192,H:320,rm:false,t:0};g.init(s);for(let i=0;i<(g.limit||300)/.05;i++){const inp=miniBlankInp();s.t+=.05;g.auto(s,inp);const res=g.step(s,.05,inp);if(i%4===0)g.draw(s,c,i*50);if(res==='win'){won=s.t;g.bloom(s,c,.5,0);g.bloom(s,c,1,0);break}if(res==='end')g.toStage(s,s.st||0)}}catch(e){err=String(e).slice(0,200)}
                  return {n:ids.length,bad,ok:mArtOk(id),err,won}})('""" + id + "')")
                ok = not r.get("none") and not r["bad"] and r["ok"] and not r["err"] and r["won"] >= 0 and not errs
                self.add(group, f"hd_{id}_art", ok, f"{r.get('n',0)} images loaded from --blobs (missing: {r.get('bad') or 'none'}); auto wins with real art at {r.get('won',-1):.1f}s; errors: {r.get('err') or errs[:1] or 'none'}")
                await ctx.close()
            else:
                self.add(group, f"hd_{id}_art", None, "run with --blobs DIR to load the real art")

            ctx, pg, errs = await self.page(b)
            r = await pg.evaluate("""(async(id)=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const g=MINI[id];__kitEnter(g.land);await sleep(60);
              const seen=[],ob=window.miniBanner;window.miniBanner=function(t){seen.push(t);return ob.apply(this,arguments)};
              startMini(id);MS.i=g.setup.length;miniAct('mbegin');MS.auto=true;stopMiniLoop();let maxSt=0,guard=0,over=0;
              while(MS&&(MS.mode==='play'||MS.mode==='over')&&guard++<(g.limit||300)/.05){if(MS.mode==='over'){over++;miniAct('mtry');MS.auto=true}miniTick(.05);maxSt=Math.max(maxSt,(MS.s&&MS.s.st)||0)}
              const mode=MS&&MS.mode,pips=document.querySelectorAll('#mTitle .mpips i').length;window.miniBanner=ob;closeMini();return {seen,maxSt,mode,stages:g.stages,pips,over}})('""" + id + "')")
            want = [f"{n} · {s}" for n, s in zip(["I", "II", "III"], r["stages"] or [])]
            ok = len(want) == 3 and all(w in r["seen"] for w in want) and r["maxSt"] == 2 and r["mode"] in ("bloom", "result") and r["pips"] == 3 and not errs
            self.add(group, f"hd_{id}_stages", ok, f"auto played through stages {r['maxSt']+1} of 3 to the {r['mode']}; banners shown: {sorted(set(r['seen']))}; HUD pips={r['pips']}" + (f"; errors {errs[:1]}" if errs else ""))
            await ctx.close()

            tmp = tempfile.mkdtemp()
            from PIL import Image
            Image.new("RGB", (768, 1280), (190, 140, 80)).save(os.path.join(tmp, "plate.jpg"))
            PID = "abcdefabcdefabcdefabcdefabcdef34"
            res = {}
            for rm in (False, True):
                ctx, pg, errs = await self.page(b, reduced=rm, extra_blobs={PID: os.path.join(tmp, "plate.jpg")})
                res[rm] = await pg.evaluate("""(async(id,pid)=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const g=MINI[id];__kitEnter(g.land);await sleep(60);
                  const has=!!(MINI_ART[id]&&MINI_ART[id].plate),keep=MINI_ART[id];if(has)MINI_ART[id]=Object.assign({},keep,{plate:pid});
                  startMini(id);MS.i=g.setup.length;miniAct('mbegin');await sleep(150);const p=document.querySelector('#mPlate');miniWin();await sleep(120);const o1=parseFloat(p.style.opacity||0);
                  if(MS&&MS.mode==='bloom'){MS.bk=.99;await sleep(80)}miniResult();await sleep(100);const o2=parseFloat(p.style.opacity||0);closeMini();MINI_ART[id]=keep;return {has,o1,o2}})('""" + id + "','" + PID + "')")
                await ctx.close()
            a, c = res[False], res[True]
            if id.startswith("boss_"):
                pass  # Phase 35B: the boss rounds end on a bloom of their own, with no plate (ids starting boss_ have no artifact)
            elif a["has"]:
                ok = a["o1"] < .5 and a["o2"] == 1 and c["o1"] == 1 and c["o2"] == 1
                self.add(group, f"hd_{id}_plate", ok, f"plate: early bloom {a['o1']:.2f}, at the result {a['o2']}; Reduce Motion: shown at once {c['o1']} (a still)")
            else:
                ok = False  # Phase 32A: every developed game now has a plate (cages-plate arrived October 1, 2026)
                self.add(group, f"hd_{id}_plate", ok, f"MINI_ART.{id}.plate is missing: every developed game should end on its plate")

    async def hd_short(self, b, group, id):
        """hd_suite in short mode (Plan 5 A3/A9): fallback with no art, the shared art (with --blobs), one nameless-numeral banner with no pips, no plate."""
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""((id)=>{const g=MINI[id];if(!g)return {missing:true};const key=g.art||id,keep=MINI_ART[key];
          MINI_ART[key]=Object.assign({},keep||{},{atlas:'f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0f0',people:'e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0e0',bg:['d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0d0']});
          const cv=document.createElement('canvas');cv.width=384;cv.height=640;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);let err='',won=-1;
          const again=s=>{if(g.retry)g.retry(s);else if(g.toStage)g.toStage(s,0);else g.init(s)};
          try{loadMiniArt(id);const s={W:192,H:320,rm:false,t:0};g.init(s);let seed=5;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
            for(let i=0;i<1200;i++){const inp=miniBlankInp();inp.dx=Math.round(rnd()*2-1);inp.dy=Math.round(rnd()*2-1);inp.a=rnd()<.5;inp.b=rnd()<.4;inp.aTap=rnd()<.2;inp.bTap=rnd()<.2;inp.lTap=rnd()<.1;inp.rTap=rnd()<.1;inp.uTap=rnd()<.05;
              if(rnd()<.25){const tp={x:rnd()*192,y:rnd()*320};inp.tap=tp;inp.taps=[tp];inp.down=tp}s.t+=.05;const res=g.step(s,.05,inp);if(i%3===0)g.draw(s,c,i*50);
              if(res==='win'){g.bloom(s,c,.5,0);g.bloom(s,c,1,0);g.init(s)}else if(res==='end')again(s)}
            g.init(s);for(let i=0;i<(g.limit||120)/.05;i++){const inp=miniBlankInp();s.t+=.05;g.auto(s,inp);const res=g.step(s,.05,inp);if(i%4===0)g.draw(s,c,i*50);if(res==='win'){won=s.t;g.bloom(s,c,.5,0);g.bloom(s,c,1,0);break}if(res==='end')again(s)}
          }catch(e){err=String(e&&e.stack||e).slice(0,240)}
          if(keep)MINI_ART[key]=keep;else delete MINI_ART[key];return {err,won}})('""" + id + "')")
        ok = not r.get("missing") and not r["err"] and r["won"] >= 0 and not errs
        self.add(group, f"hd_{id}_fallback", ok, f"short game, no art loaded: 1200 random steps with draws, then auto wins at {r.get('won',-1):.1f}s; errors: {r.get('err') or errs[:1] or 'none'}")
        await ctx.close()
        if self.args.blobs:
            ctx, pg, errs = await self.page(b)
            r = await pg.evaluate("""(async(id)=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const g=MINI[id],key=g.art||id,A=MINI_ART[key];if(!A)return {none:true,key};loadMiniArt(id);
              const ids=[...miniAssetIds(id)];for(let i=0;i<60&&!ids.every(a=>MIMG[a]&&(MIMG[a].ok||MIMG[a].bad));i++)await sleep(50);
              const bad=ids.filter(a=>MIMG[a]&&!MIMG[a].ok);const cv=document.createElement('canvas');cv.width=384;cv.height=640;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);let err='',won=-1;
              try{const s={W:192,H:320,rm:false,t:0};g.init(s);for(let i=0;i<(g.limit||120)/.05;i++){const inp=miniBlankInp();s.t+=.05;g.auto(s,inp);const res=g.step(s,.05,inp);if(i%4===0)g.draw(s,c,i*50);if(res==='win'){won=s.t;g.bloom(s,c,1,0);break}if(res==='end')g.init(s)}}catch(e){err=String(e).slice(0,200)}
              return {key,n:ids.length,bad,ok:mArtOk(key),err,won}})('""" + id + "')")
            ok = not r.get("none") and not r["bad"] and r["ok"] and not r["err"] and r["won"] >= 0 and not errs
            self.add(group, f"hd_{id}_art", ok, f"shared art {r.get('key')}: {r.get('n',0)} images loaded from --blobs (missing: {r.get('bad') or 'none'}); auto wins with real art at {r.get('won',-1):.1f}s; errors: {r.get('err') or errs[:1] or 'none'}")
            await ctx.close()
        else:
            self.add(group, f"hd_{id}_art", None, "run with --blobs DIR to load the real art")
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(async(id)=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const g=MINI[id];__kitEnter(g.land);await sleep(60);
          const seen=[],ob=window.miniBanner;window.miniBanner=function(t){seen.push(t);return ob.apply(this,arguments)};
          startMini(id);MS.i=g.setup.length;miniAct('mbegin');MS.auto=true;stopMiniLoop();let maxSt=0,guard=0;
          while(MS&&(MS.mode==='play'||MS.mode==='over')&&guard++<(g.limit||120)/.05){if(MS.mode==='over'){miniAct('mtry');MS.auto=true}miniTick(.05);maxSt=Math.max(maxSt,(MS.s&&MS.s.st)||0)}
          const mode=MS&&MS.mode,pips=document.querySelectorAll('#mTitle .mpips i').length;let k1=null;if(MS&&MS.mode==='bloom'){miniTick(1);k1=MS.bk}
          while(MS&&MS.mode==='bloom'&&guard++<9999)miniTick(.05);miniDraw();await sleep(60);const p=document.querySelector('#mPlate');
          const out={seen,maxSt,mode,stages:g.stages,pips,k1,end:MS&&MS.mode,plateOp:parseFloat(p.style.opacity||0),plateSrc:!!p.getAttribute('src')};window.miniBanner=ob;closeMini();return out})('""" + id + "')")
        nm = (r["stages"] or [None])[0]
        ok = (len(r["stages"] or []) == 1 and r["seen"] and all(t == nm for t in r["seen"]) and r["maxSt"] == 0 and r["mode"] in ("bloom", "result") and r["pips"] == 0
              and r["end"] == "result" and r["plateOp"] == 0 and not r["plateSrc"] and (r["k1"] is None or .4 <= r["k1"] <= .67) and not errs)
        self.add(group, f"hd_{id}_stages", ok, f"short: banners {sorted(set(r['seen']))} (want the name alone: {nm!r}); stages reached {r['maxSt']+1}; pips {r['pips']}; to the {r['mode']}; bloom after 1 s {r['k1']} (1.5-2.5 s bloom); plate opacity {r['plateOp']} src {r['plateSrc']} (want none)" + (f"; errors {errs[:1]}" if errs else ""))
        await ctx.close()

    async def p30(self, b):
        await self.mini_suite(b, "p30", ["sisyphus"])
        await self.hd_suite(b, "p30", ["sisyphus"])
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const g=MINI.sisyphus,T=g._t,out={};const S=()=>{const s={W:192,H:320,rm:false,t:0};g.init(s);return s};
          const run=(s,sec,f)=>{let res;for(let i=0;i<sec/.05;i++){const inp=miniBlankInp();if(f)f(s,inp,i);s.t+=.05;res=g.step(s,.05,inp);if(res)return res}return res};
          const alt=(s,inp,i)=>{inp[['lTap','uTap','rTap','dTap'][i%4]]=true}; /* Phase 45B: arrow keys in turn */
          // rolls back at 92%, in every stage (Stage II is the walk down itself); in Stage III with the meter full, the top starts the bloom
          let s=S();s.p=T.TOP-.004;run(s,2,(s,inp,i)=>{if(s.ph==='climb')alt(s,inp,i)});out.r0=s.ph==='down'&&s.st===1&&s.p<T.TOP;
          s=S();g.toStage(s,2);s.smile=0;s.p=T.TOP-.004;run(s,2,(s,inp,i)=>{if(s.ph==='climb')alt(s,inp,i)});out.r2=s.ph==='down'&&s.st===2;
          s=S();g.toStage(s,2);s.smile=T.GOAL;s.descSeen=2;s.p=T.TOP-.004;out.win=run(s,2,(s,inp,i)=>{if(s.ph==='climb')alt(s,inp,i)})==='win';
          // no mashing: 20 alternating pushes inside one second add no more than 8 pushes' worth
          s=S();const p0=s.p;run(s,.05,(s,inp)=>inp.lTap=true);const one=s.p-p0;s=S();s.t=5;s.lastPush=5;const q0=s.p;for(let i=0;i<20;i++){const inp=miniBlankInp();inp[['lTap','uTap','rTap','dTap'][i%4]]=true;s.t+=.05;g.step(s,.05,inp)}
          out.one=one;out.twenty=s.p-q0;out.mash=out.twenty<=8*one+1e-9&&out.twenty>=7*one-1e-9;
          // same side twice only shuffles
          s=S();run(s,.05,(s,inp)=>inp.lTap=true);const a1=s.p;run(s,.05,(s,inp)=>inp.lTap=true);out.same=s.p<=a1+1e-9;
          // descent only: Stage II's moments appear only on the walk down and count double; climbs never show them
          s=S();g.toStage(s,1);const kinds=[];let dbl=null;run(s,30,(s,inp)=>{for(const m of s.ms)if(!m._seen){m._seen=1;kinds.push([m.k,m.desc,s.ph,s.st])}
            if(dbl==null&&s.ms.some(m=>!m.gone&&m.a>.3&&m.y>5)){const b=s.smile;inp.aTap=true;s._chk=b}});
          out.descKinds=kinds;out.descOnly=kinds.length>0&&kinds.filter(k=>k[3]===1).every(k=>k[1]&&k[2]==='down');
          s=S();g.toStage(s,1);let before=-1,after=-1;run(s,8,(s,inp)=>{if(before<0&&s.ms.some(m=>!m.gone&&m.a>.3&&m.y>5)){before=s.smile;inp.aTap=true}else if(before>=0&&after<0)after=s.smile});out.double=after-before===2;
          s=S();const ck=[];run(s,40,(s,inp,i)=>{if(s.ph==='climb')alt(s,inp,i);for(const m of s.ms)if(!m._s){m._s=1;ck.push([m.desc,s.ph])}});out.climbPlain=ck.filter(k=>k[1]!=='down').every(k=>!k[0])&&ck.length>0;
          // lanterns record attention: Stage III plants one per moment noticed, and each new one plants another
          s=S();g.toStage(s,2);const got=s.got,lan=s.lan.length;run(s,20,(s,inp,i)=>{alt(s,inp,i);if(s.ms.some(m=>!m.gone&&m.a>.3&&m.y>5))inp.aTap=true});out.lan0=lan===got;out.lan1=s.lan.length===s.got&&s.got>got;
          return out})()""")
        self.add("p30", "sis_rolls_back", r["r0"] and r["r2"] and r["win"], f"Stage I: at 92% it wobbles and rolls, and the walk down begins={r['r0']}; Stage III without a full meter rolls back again={r['r2']}; with the meter full the top starts the bloom (its last rollback)={r['win']}")
        self.add("p30", "sis_no_mash", r["mash"] and r["same"], f"one push adds {r['one']:.4f}; 20 keys in turn in one second add {r['twenty']:.4f} (at most 8 pushes' worth={r['mash']}); the same key twice only shuffles={r['same']}")
        self.add("p30", "sis_descent_only", r["descOnly"] and r["double"] and r["climbPlain"], f"Stage II moments {[(k[0], 'walk down' if k[2]=='down' else k[2]) for k in r['descKinds']]} all on the walk down={r['descOnly']}; noticing one adds 2={r['double']}; climbing moments are never the descent kind={r['climbPlain']}")
        self.add("p30", "sis_lanterns_record", r["lan0"] and r["lan1"], f"Stage III plants one lantern per moment noticed={r['lan0']}; each moment noticed in Stage III plants another={r['lan1']}")
        await ctx.close()

    async def p31(self, b):
        ids = [i for i in ["idols", "goalkeeper", "cages"]]  # Phase 45B: Having or Being removed
        await self.mini_suite(b, "p31", ids)
        await self.hd_suite(b, "p31", ids)
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const out={};const S=id=>{const s={W:192,H:320,rm:false,t:0};MINI[id].init(s);return s};
          const run=(id,s,sec,f)=>{let res;for(let i=0;i<sec/.05;i++){const inp=miniBlankInp();if(f)f(s,inp,i);s.t+=.05;res=MINI[id].step(s,.05,inp);if(res)return res}return res};
          const tapAt=(p)=>inp=>{inp.taps=[{x:p.x,y:p.y}];inp.tap=inp.taps[0]};
          /* ---- idols ---- */
          {const g=MINI.idols,T=g._t;let s=S('idols');const tr=s.idols.find(o=>!o.hollow),m=T.mid(s,tr);run('idols',s,.05,(s,inp)=>tapAt(m)(inp));const w0=s.waves.slice(-1)[0];
            run('idols',s,.3);run('idols',s,.05,(s,inp)=>tapAt(m)(inp));run('idols',s,1);out.trueStands=!tr.broken&&s.wrong===1;
            const ho=s.idols.find(o=>o.hollow),m2=T.mid(s,ho);run('idols',s,.6);run('idols',s,.05,(s,inp)=>tapAt(m2)(inp));const w1=s.waves.slice(-1)[0];run('idols',s,.3);run('idols',s,.05,(s,inp)=>tapAt(m2)(inp));out.hollowBreaks=ho.broken;
            out.waves=[w0&&{len:w0.len,jag:w0.jag,cyc:w0.cyc,w:w0.w},w1&&{len:w1.len,jag:w1.jag,cyc:w1.cyc,w:w1.w}];out.wavesDiffer=!!(w0&&w1&&w0.len>w1.len*2&&w0.jag===0&&w1.jag>0&&w0.cyc!==w1.cyc);
            s=S('idols');g.toStage(s,1);const slots0=s.idols.map(o=>o.slot).join();const o=s.idols[0],m3=T.mid(s,o);run('idols',s,.05,(s,inp)=>tapAt(m3)(inp));run('idols',s,2.6);
            out.swap=s.swapped>=1&&s.idols.map(o=>o.slot).join()!==slots0;out.gilded=s.idols.filter(o=>o.gild).length===4&&s.idols.some(o=>o.k==='clay'&&!o.hollow&&!o.gild)&&s.idols.filter(o=>o.hollow).length===3;
            let selfOk=true,seen=new Set();for(let i=0;i<30;i++){s=S('idols');g.toStage(s,2);const P6=s.pcs;if(!(P6&&P6.length===6&&P6.map(x=>x.n).join()==='head,handL,handR,shoulders,chest,base'&&P6.filter(x=>x.hollow).length===3&&P6.filter(x=>!x.hollow).length===3))selfOk=false;if(P6)seen.add(P6.map(x=>x.hollow?1:0).join(''))}out.self=selfOk&&seen.size>=4}
          /* ---- goalkeeper ---- */
          {const g=MINI.goalkeeper,T=g._t;let s=S('goalkeeper'),hit=0;for(let i=0;i<300;i++){T.newShot(s);if(s.tell===s.zone)hit++}out.tellRate=hit/300;
            s=S('goalkeeper');s.cm=[5,5,6];s.saves=0;out.r16=g.rate(s);s.saves=16;s.cm=[5,4,4];out.r13=g.rate(s);s.cm=[5,4,5];out.r14=g.rate(s);
            s=S('goalkeeper');run('goalkeeper',s,3,(s,inp)=>{});const phase=s.ph;s=S('goalkeeper');run('goalkeeper',s,1.6,()=>{});const ph2=s.ph;run('goalkeeper',s,.05,(s,inp)=>{inp.aTap=true;inp.dx=-1});
            out.late={ph:ph2,dive:s.dive,commit:s.commit,cm:s.cm[0]};out.lateOk=ph2==='fly'&&s.dive===0&&s.commit==null&&s.cm[0]===0;
            s=S('goalkeeper');out.again=run('goalkeeper',s,20,()=>{})==='end'&&s.st===0}
          /* ---- having: removed in Phase 45B (Cade, October 8, 2026) ---- */
          out.havingGone=typeof MINI.having==='undefined'&&ARTI.fromm.items.every(it=>it.g!=='having')&&ARTI.fromm.items.some(it=>it.n==='A Spilled Purse of Coins'&&!it.g);
          /* ---- cages ---- */
          {const g=MINI.cages,T=g._t;let s=S('cages');const m0=s.mask;const pos=MINI_ART.cages.ring;const p=pos[2];run('cages',s,.1,(s,inp,i)=>{if(i<2)inp.taps=[{x:p[0],y:p[1]-15}]});/* 45B: tap once to select, tap again to turn */run('cages',s,.5);
            out.ring=(m0^s.mask)===((1<<1)|(1<<2)|(1<<3));
            s=S('cages');g.toStage(s,1);const m1=s.mask,P=MINI_ART.cages.plaza,q=P[1];run('cages',s,.1,(s,inp,i)=>{if(i<2)inp.taps=[{x:q[0],y:q[1]-15}]});/* 45B: tap once to select, tap again to turn */run('cages',s,.5);
            out.web=(m1^s.mask)===T.g2().m[1]&&T.g2().m[1]!==(1<<1);
            let solv=true;for(let i=0;i<60;i++){s=S('cages');if(!(T.g1().dist[s.mask]>0))solv=false;g.toStage(s,1);if(!(T.g2().dist[s.mask]>0))solv=false}out.solv=solv;
            s=S('cages');let last=true,yours=[];for(let i=0;i<10&&s.st===0;i++){const k=T.bestKey(s);if(k<0)break;const pp=pos[k];run('cages',s,.1,(s,inp,i)=>{if(i<2)inp.taps=[{x:pp[0],y:pp[1]-15}]});/* 45B: tap once to select, tap again to turn */run('cages',s,.5);yours.push([s.mask===63,s.youOpen!=null]);if(s.mask!==63&&s.youOpen!=null)last=false}
            out.yours=last&&yours.length>0&&yours[yours.length-1][1];
            s=S('cages');g.toStage(s,2);run('cages',s,3,(s,inp)=>{inp.a=true});out.one={pull:s.pull,oneT:+s.oneT.toFixed(2)};const oneOk=s.pull===0&&s.oneT>2.5;
            run('cages',s,1,(s,inp)=>{inp.a=true;inp.b=true});const both=s.pull>0;s=S('cages');g.toStage(s,2);run('cages',s,1,(s,inp)=>{inp.fingers=2});out.both=oneOk&&both&&s.pull>0;
            s=S('cages');g.toStage(s,2);run('cages',s,.7,(s,inp)=>{inp.a=true;inp.b=true});const early=s.pull,ne=s.pullers;s=S('cages');g.toStage(s,2);run('cages',s,5);const p5=s.pull;run('cages',s,.7,(s,inp)=>{inp.a=true;inp.b=true});
            out.faster={early:+early.toFixed(3),late:+(s.pull-p5).toFixed(3),pullersEarly:ne,pullersLate:s.pullers};out.fasterOk=s.pull-p5>early*1.5&&s.pullers>ne}
          return out})()""")
        self.add("p31", "idols_true_never_break", r["trueStands"] and r["hollowBreaks"], f"striking a true idol: it stands and counts one wrong strike={r['trueStands']}; a sounded hollow idol breaks on the second tap={r['hollowBreaks']}")
        self.add("p31", "idols_wave_shapes_differ", r["wavesDiffer"], f"true vs hollow sounding: {r['waves']} (long, smooth and golden vs short, jagged and grey)")
        self.add("p31", "idols_swap_in_II", r["swap"] and r["gilded"], f"after a sounding in Stage II, two idols trade places in the fog={r['swap']}; four gilded, three hollow, the plain clay idol rings true={r['gilded']}")
        self.add("p31", "idols_self_in_III", r["self"], f"30 Stage III setups: one statue with six pieces (head, handL, handR, shoulders, chest, base), always three hollow and three true, and the hollow three differ from try to try={r['self']}")
        self.add("p31", "goal_tells_unreliable", .25 <= r["tellRate"] <= .42, f"over 300 shots the tell matched the kick {r['tellRate']*100:.0f}% of the time (want 25-42%)")
        self.add("p31", "goal_saves_ignored", r["r16"] == 3 and r["r14"] == 2 and r["r13"] == 1, f"16 commitments, 0 saves -> {r['r16']} lanterns (want 3); 14 -> {r['r14']} (want 2); 13 with 16 saves -> {r['r13']} (want 1)")
        self.add("p31", "goal_late_dive_not_commit", r["lateOk"] and r["again"], f"a dive after the kick: {r['late']} (dives, but isn't a commitment)={r['lateOk']}; committing on none of a stage's shots repeats it (the only try over)={r['again']}")
        self.add("p31", "having_removed", r["havingGone"], f"Phase 45B: no MINI.having, and A Spilled Purse of Coins is a plain Examine read={r['havingGone']}")
        self.add("p31", "cages_turn_toggles_linked", r["ring"] and r["web"], f"Stage I: a key toggles its cage and both neighbors={r['ring']}; Stage II: its cage and every cage chained to it={r['web']}")
        self.add("p31", "cages_always_solvable", r["solv"], f"60 fresh Stage I and Stage II puzzles all start unsolved and solvable (scrambled from all-open)={r['solv']}")
        self.add("p31", "cages_yours_last", r["yours"], f"your cage stays shut until all six are open, then opens={r['yours']}")
        self.add("p31", "cages_gate_needs_both", r["both"], f"only A for 3 s: {r['one']} (no progress; one-handed time counted); A+B, or two fingers, pulls={r['both']}")
        self.add("p31", "cages_more_people_pull_faster", r["fasterOk"], f"pull in 0.7 s: {r['faster']} (more people at the gate, faster pull)")
        await ctx.close()

    async def p32(self, b):
        ids = ["mean", "gadfly", "yours", "thieves", "above"]
        await self.mini_suite(b, "p32", ids)
        await self.hd_suite(b, "p32", ids)
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const out={};const S=id=>{const s={W:192,H:320,rm:false,t:0};MINI[id].init(s);return s};
          const cv=document.createElement('canvas');cv.width=384;cv.height=640;const cx=cv.getContext('2d');cx.setTransform(2,0,0,2,0,0);
          const run=(id,s,sec,f)=>{let res;for(let i=0;i<sec/.05;i++){const inp=miniBlankInp();if(f)f(s,inp,i);s.t+=.05;res=MINI[id].step(s,.05,inp);if(res)return res}return res};
          /* ---- the Golden Mean ---- */
          {const g=MINI.mean,T=g._t;
            const cs=[],sides=new Set();let inR=true;for(let i=0;i<60;i++){const s=S('mean');g.toStage(s,1);cs.push(s.bc);sides.add(Math.sign(s.bc));if(!(Math.abs(s.bc)>=T.OFF[0]-1e-9&&Math.abs(s.bc)<=T.OFF[1]+1e-9))inR=false}
            out.offs=[Math.min(...cs.map(Math.abs)),Math.max(...cs.map(Math.abs))];out.bothSides=sides.has(-1)&&sides.has(1);out.offRange=inR;
            let s=S('mean');out.c0=s.bc;g.toStage(s,2);out.c2=s.bc;
            const drawn=n=>{const s=S('mean');g.toStage(s,n);s._bandDrawn=null;g.draw(s,cx,0);return s._bandDrawn};out.drawn=[drawn(0),drawn(1),drawn(2)];
            // the hum's visual twin: the glow comes up in the band, not outside it
            s=S('mean');g.toStage(s,1);s.n=s.bc;s.vn=0;run('mean',s,.6,(s,inp)=>{s.n=s.bc;s.vn=0;s.ev=null;s.evT=9});const glIn=s.gl,goldIn=s.gold;
            s.n=-Math.sign(s.bc)*.9;s.vn=0;run('mean',s,.8,(s,inp)=>{s.n=-Math.sign(s.bc)*.9;s.vn=0;s.ev=null;s.evT=9});out.hum={in:+glIn.toFixed(2),inGold:goldIn,out:+s.gl.toFixed(2),outGold:s.gold}}
          {const g=MINI.mean,T=g._t;let s0=S('mean'),s1=S('mean');s1.h=1;
            out.grow=[T.bandGrow(0),T.bandGrow(1)];out.push=[T.pushMag(0,0),T.pushMag(1,0)];
            // real runs: stay in the gold for 3 s at Habit 0 and at Habit .9
            const wid=h=>{const s=S('mean');s.h=h;s.ev=null;s.evT=99;const w0=s.bw;run('mean',s,3,(s,inp)=>{s.n=0;s.vn=0;s.evT=99});return s.bw-w0};out.wid=[wid(0),wid(.9)];
            const pk=h=>{const s=S('mean');s.h=h;s.evT=99;T.fire(s,-1);let m=0;run('mean',s,1.6,(s,inp)=>{s.h=h;m=Math.max(m,Math.abs(s.pushNow))});return m};out.pk=[pk(0),pk(.9)];
            out.b0=T.B0;out.bw3=T.bandGrow(T.HS[2]);out.bw1=T.bandGrow(0);
            // played through Stage I, the Habit built carries into III
            s0=S('mean');let h2=null;run('mean',s0,200,(s,inp)=>{g.auto(s,inp);if(s.st===2&&h2==null)h2=s.h});out.carry=h2;
            // Stage III really starts narrower than Stage I and widens faster per in-gold second
            const t3=S('mean');g.toStage(t3,2);const t1=S('mean');out.start=[t1.bw,t3.bw];out.rate=[T.bandGrow(t1.h),T.bandGrow(t3.h)]}
          {const g=MINI.mean,T=g._t;const kinds=[],bad=[];
            for(let st=0;st<3;st++){const E=T.EXT[st];kinds.push([E.L.k+':'+E.L.kind,E.R.k+':'+E.R.kind,E.virtue]);
              for(const side of [-1,1]){const s=S('mean');g.toStage(s,st);s.evT=99;s.n=0;s.vn=0;T.fire(s,side);const k0=s.ev.k;let mx=0;
                run('mean',s,1.8,(s,inp)=>{if(s.ev&&s.ev.t>1.3)s.vn=s.vn;mx=Math.abs(s.pushNow)>Math.abs(mx)?s.pushNow:mx});
                // the creature in play is the pair's left (deficiency) one for side -1, the right (excess) one for side +1, and it shoves toward its side
                bad.push([st,side,k0,Math.sign(mx)])}}
            out.kinds=kinds;out.pushes=bad;
            out.pairsOk=JSON.stringify(kinds.map(k=>[k[0].split(':')[0],k[1].split(':')[0]]))===JSON.stringify([['wolf','fire'],['chest','spend'],['mouse','peacock']])&&kinds.every(k=>k[0].endsWith('deficiency')&&k[1].endsWith('excess'));
            out.pushOk=bad.every(([st,side,k,sg])=>k===(side<0?T.EXT[st].L.k:T.EXT[st].R.k)&&sg===side)}
          {const g=MINI.mean;const res=[];
            for(const dir of [-1,1,0]){const s=S('mean');let end=null,back=false,frozen=true,pm=0,nmax=0,p0=s.p;
              for(let i=0;i<60/.05;i++){const inp=miniBlankInp();inp.dx=dir;s.t+=.05;const before=s.p;const r=g.step(s,.05,inp);if(r==='end'||r==='lose')end=r;if(s.p<before-1e-12)back=true;if(!s.gold&&s.p!==before)frozen=false;nmax=Math.max(nmax,Math.abs(s.n));if(r==='win')break}
              res.push({dir,end,back,frozen,nmax:+nmax.toFixed(2),p:+s.p.toFixed(2),outT:+s.outT.toFixed(1)})}
            out.nf=res}
          /* ---- the Gadfly ---- */
          {const g=MINI.gadfly,T=g._t;const clearB=s=>{s.cz.forEach(c=>c.bub=null);s.sayT=99};
            let s=S('gadfly');clearB(s);const c0=s.cz[0];s.gx=c0.x;s.gy=c0.y-12;run('gadfly',s,.05,(s,inp)=>{inp.a=true});out.u1={awake:c0.awake,useless:s.useless};
            s.aPrev=false;s.stingCd=0;s.stun=0;run('gadfly',s,.1,()=>{});
            const c1=s.cz[1];clearB(s);T.say(s,c1);run('gadfly',s,.4,()=>{});const showing1=T.showing(c1);s.gx=c1.x;s.gy=T.bubY(c1);s.stingCd=0;run('gadfly',s,.05,(s,inp)=>{inp.a=true});out.u2={showing:showing1,awake:c1.awake,useless:s.useless};
            // a bubble that's gone (or not yet showing) can't be stung
            s=S('gadfly');clearB(s);const c2=s.cz[2];T.say(s,c2);s.gx=c2.x;s.gy=T.bubY(c2);s.stingCd=0;const early=T.showing(c2);run('gadfly',s,.05,(s,inp)=>{inp.a=true});out.u3={early,awake:c2.awake};
            // chains
            let trials=0,exact=0,big=0,diffWoke=0,maxSeen=0;
            for(let k=0;k<60;k++){s=S('gadfly');g.toStage(s,1);s.cz.forEach(c=>{c.awake=false;c.wk=0});s.settle=0;clearB(s);const i=Math.floor(Math.random()*s.cz.length),b=s.cz[i].b;
              const want=new Set([i]);const q=[i];while(q.length){const a=q.pop();s.cz[a].nb.forEach(j=>{if(!want.has(j)&&s.cz[j].b===b){want.add(j);q.push(j)}})}
              T.wake(s,s.cz[i],'sting');run('gadfly',s,12,()=>{s.sayT=99});const got=new Set(s.cz.map((c,j)=>c.awake?j:-1).filter(j=>j>=0));
              trials++;if(got.size===want.size&&[...want].every(j=>got.has(j)))exact++;if(want.size>=3)big++;if(s.cz.some(c=>c.awake&&c.b!==b))diffWoke++;maxSeen=Math.max(maxSeen,s.maxChain)}
            out.ch={trials,exact,big,diffWoke,maxSeen}
            // the swish telegraph: over long runs, in both Stage II and III
            const tl=[];for(const st of [1,2]){s=S('gadfly');g.toStage(s,st);let prev=s.tail.ph,swishes=0,minWarn=99,hitsOutSwish=0,hits=0,ended=false,kb=0,lastH=0;
              for(let i=0;i<500/.05;i++){const inp=miniBlankInp();const z=T.tz(s);inp.down={x:z.x,y:z.y};s.t+=.05;const gx0=s.gx,gy0=s.gy,h0=s.tailHits,ph0=s.tail.ph;const r=g.step(s,.05,inp);
                if(r==='end')ended=true;if(r==='win')break;
                if(s.tail.ph==='swish'&&prev==='warn'){swishes++;minWarn=Math.min(minWarn,s.tail.warned)}
                if(s.tailHits>h0){hits++;if(s.tail.ph!=='swish')hitsOutSwish++;kb=Math.max(kb,Math.hypot(s.gx-gx0,s.gy-gy0)>0||s.stun>0?1:0)}
                prev=s.tail.ph;if(s.st===2&&s.sp<3&&s.rise>=1&&s.fin<0){/* never stung: stays unfinished */}}
              tl.push({st:st+1,swishes,minWarn:+minWarn.toFixed(2),hits,hitsOutSwish,ended,knock:kb})}
            out.tl=tl}
          return out})()""")
        # ---- mean ----
        self.add("p32", "mean_band_off_center_in_II", r["offRange"] and r["bothSides"] and r["c0"] == 0 and r["c2"] == 0 and r["drawn"] == [True, False, True] and r["hum"]["in"] > .5 and r["hum"]["inGold"] and r["hum"]["out"] < .1 and not r["hum"]["outGold"],
                 f"Stage II's gold sits {r['offs'][0]*100:.0f}-{r['offs'][1]*100:.0f}% of the way from the middle to the edge, on both sides over 60 plays={r['offRange'] and r['bothSides']}; centre in I={r['c0']}, III={r['c2']}; gold drawn in I/II/III={r['drawn']} (II hidden); the beam glows in the band (glow {r['hum']['in']}) and not outside it ({r['hum']['out']})")
        self.add("p32", "mean_habit_widens", r["grow"][1] > r["grow"][0] * 2 and r["push"][1] < r["push"][0] * .5 and r["wid"][1] > r["wid"][0] * 2 and r["pk"][1] < r["pk"][0] * .6 and r["b0"][2] < r["b0"][0] and r["rate"][1] > r["rate"][0] * 2 and r["start"][1] < r["start"][0] and r["carry"] is not None and r["carry"] > .4,
                 f"widening per gold second {r['grow'][0]:.4f} at Habit 0 vs {r['grow'][1]:.4f} at full; in 3 s the band grew {r['wid'][0]:.3f} vs {r['wid'][1]:.3f}; a push peaks at {r['pk'][0]:.2f} vs {r['pk'][1]:.2f}; Stage III starts at {r['start'][1]:.2f} (Stage I: {r['start'][0]:.2f}) and widens {r['rate'][1]/r['rate'][0]:.1f}x faster per second (Habit carried from I+II: {r['carry'] and round(r['carry'],2)})")
        self.add("p32", "mean_three_virtues", r["pairsOk"] and r["pushOk"],
                 f"pairs (left = deficiency, right = excess): {r['kinds']}; each creature pushes toward its own side: {[(p[0]+1, p[1], p[2], p[3]) for p in r['pushes']]} (stage, side, creature, push sign)")
        self.add("p32", "mean_never_falls", all((not x["end"]) and (not x["back"]) and x["frozen"] and x["nmax"] <= 1.0001 for x in r["nf"]),
                 f"60 s holding left / right / nothing: {r['nf']} (never ends, progress never goes back, frozen outside the gold, the needle stays on the beam)")
        # ---- gadfly ----
        self.add("p32", "gadfly_only_stated_beliefs", (not r["u1"]["awake"]) and r["u1"]["useless"] == 1 and r["u2"]["showing"] and r["u2"]["awake"] and r["u2"]["useless"] == 1 and (not r["u3"]["early"]) and (not r["u3"]["awake"]),
                 f"stinging a sleeper with no bubble: awake={r['u1']['awake']}, useless stings counted={r['u1']['useless']}; stinging a showing bubble: showing={r['u2']['showing']}, wakes={r['u2']['awake']}, no extra useless sting counted (still {r['u2']['useless']}); a bubble still popping up can't be stung ({r['u3']})")
        ch = r["ch"]
        self.add("p32", "gadfly_chain_same_belief", ch["exact"] == ch["trials"] and ch["big"] >= 5 and ch["diffWoke"] == 0 and ch["maxSeen"] >= 3,
                 f"{ch['trials']} random Stage II crowds: waking one sleeper woke exactly its same-belief run of neighbors in {ch['exact']} ({ch['big']} had 3 or more); a different belief woke in {ch['diffWoke']}; longest chain {ch['maxSeen']}")
        tl = r["tl"]
        self.add("p32", "gadfly_tail_telegraphs", all(t["swishes"] >= 20 and t["minWarn"] >= 1 and t["hits"] >= 5 and t["hitsOutSwish"] == 0 and not t["ended"] and t["knock"] for t in tl),
                 f"500 s with the gadfly parked in the tail zone: {tl} (every swish was preceded by at least 1 s of glow, hits only land during a swish, a hit only knocks back, nothing ever ends)")
        await ctx.close()

        # ---------------- Phase 32C: Only What's Yours and Time Thieves ----------------
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const out={};const S=id=>{const s={W:192,H:320,rm:false,t:0};MINI[id].init(s);return s};
  const run=(id,s,sec,f)=>{let res;for(let i=0;i<Math.round(sec/.05);i++){const inp=miniBlankInp();if(f)f(s,inp,i);s.t+=.05;res=MINI[id].step(s,.05,inp);if(res)return res}return res};
  /* ---- Only What's Yours ---- */
  {const g=MINI.yours,T=g._t,H=T.hy();
    const put=(s,kind,dy,x)=>{const it=T.spawn(s,kind);it.x0=it.x=x==null?s.px:x;it.y=it.py=H-dy;it.vy=60;return it};
    // open hands let everything pass; closed hands catch the same things
    let s=S('yours');s.spawnT=99;const a=put(s,"gold",40),b=put(s,"grey",56);run('yours',s,1.4);
    out.open={gold:s.gold,touch:s.touch,en:s.en,ghosts:[a.ghost,b.ghost],left:s.items.length};
    s=S('yours');s.spawnT=99;put(s,"gold",40);put(s,"grey",56);run('yours',s,1.4,(s,inp)=>{inp.a=true});
    out.closed={gold:s.gold,touch:s.touch,en:+s.en.toFixed(2),left:s.items.length};
    // testing: Stage II
    s=S('yours');g.toStage(s,1);s.spawnT=99;s.px=96;const ia=put(s,"gold",170,30),ib=put(s,"fake",170,170),ic=put(s,"grey",170,60);
    out.pre=[T.shown(ia),T.shown(ib),T.shown(ic)];
    const y0=ia.y;run('yours',s,.3);const v0=(ia.y-y0)/.3;
    const hold=(s,inp)=>{inp.b=true};
    run('yours',s,.9,hold);const calm1=s.calm,ts1=s.ts;const y1=ia.y;run('yours',s,.3,hold);const v1=(ia.y-y1)/.3;
    out.tst={v0:+v0.toFixed(1),v1:+v1.toFixed(1),ratio:+(v1/v0).toFixed(2),testing:s.testing,shown:[T.shown(ia),T.shown(ib),T.shown(ic)],calm:+calm1.toFixed(2),ts:+ts1.toFixed(2),rev:[ia,ib,ic].map(i=>+i.rev.toFixed(2))};
    const c2=s.calm;run('yours',s,1);out.refill=+(s.calm-c2).toFixed(3);out.stopped=!s.testing&&s.ts>.9||s.ts;
    // an empty meter: B does nothing
    s=S('yours');g.toStage(s,1);s.spawnT=99;s.calm=0;const q=put(s,"fake",170,30);const yy=q.y;run('yours',s,.4,hold);out.empty={testing:s.testing,ts:+s.ts.toFixed(2),calm:+s.calm.toFixed(3),rev:q.rev};
    // not in Stage I
    s=S('yours');s.spawnT=99;const r1=put(s,"gold",170,30);run('yours',s,.6,hold);out.stage1={testing:s.testing,ts:s.ts,calm:s.calm,rev:r1.rev};
    // the thief
    const th=(mode)=>{const s=S('yours');g.toStage(s,2);s.spawnT=99;s.items=[];s.gold=15;let tg=-1,iron=true;s.px=mode==='avoid'?170:100;
      for(let i=0;i<600&&!s.clay;i++){const inp=miniBlankInp();if(mode==='block')inp.a=true;if(mode==='chase'){inp.a=true;if(s.thief&&s.thief.ph==="walk")s.px=Math.max(16,Math.min(176,s.thief.x))}
        s.t+=.05;g.step(s,.05,inp);s.items=[];if(s.thief.ph==="gone"&&tg<0)tg=s.stT}
      return {tg:+tg.toFixed(2),touch:s.touch,iron:s.iron,ph:s.thief.ph,touched:s.thief.touched,x:Math.round(s.thief.x),en:+s.en.toFixed(2)}};
    out.th={avoid:th('avoid'),block:th('block'),chase:th('chase')};
    // the clay lamp comes last
    {let bad=[],won=-1,max=0,earlyClay=0;s=S('yours');for(let i=0;i<8000;i++){const inp=miniBlankInp();s.t+=.05;g.auto(s,inp);const r=g.step(s,.05,inp);max=Math.max(max,s.gold);
        if(s.clay&&!(s.gold>=T.NEED[1]&&s.thief&&s.thief.ph==="gone"&&!s.iron))bad.push(s.stT);if(s.clay&&s.gold<15)earlyClay++;if(r==='win'){won=s.t;break}}
      out.clay={won:+won.toFixed(1),bad:bad.length,max,clay:!!s.clay,gold:s.gold,touch:s.touch}}
    // nothing else wins: closed hands on a grey thing in Stage III, and gold things in Stage II
    {s=S('yours');g.toStage(s,2);s.spawnT=99;s.items=[];const w=put(s,"grey",30);let r=run('yours',s,1,(s,inp)=>{inp.a=true;s.thief.t=-99});out.noWin={r:r||null,touch:s.touch,clay:!!s.clay};
      s=S('yours');g.toStage(s,1);s.spawnT=99;s.items=[];put(s,"gold",30);r=run('yours',s,1,(s,inp)=>{inp.a=true});out.noWin2={r:r||null,gold:s.gold,clay:!!s.clay}}
    // open hands let the clay lamp pass; it drifts back up and falls again
    {s=S('yours');g.toStage(s,2);s.spawnT=99;s.items=[];s.thief.ph="gone";s.thief.t=5;s.iron=false;s.px=96;run('yours',s,.1);const cl=s.clay;cl.x=96;cl.y=H-30;const seen=[];let r;
      for(let i=0;i<500;i++){const inp=miniBlankInp();s.items=[];s.t+=.05;r=g.step(s,.05,inp);if(seen[seen.length-1]!==cl.mode)seen.push(cl.mode);if(r==='win')break}
      out.clayPass={seen,r:r||null};
      cl.mode="down";cl.ghost=0;cl.x=96;cl.y=H-30;s.px=96;r=run('yours',s,1,(s,inp)=>{s.items=[];inp.a=true});out.clayCatch=r||null}
  }
  /* ---- Time Thieves ---- */
  {const g=MINI.thieves,T=g._t;
    const tapAt=(x,y)=>inp=>{inp.taps=[{x,y}];inp.tap=inp.taps[0]};
    // visitors gild, thieves scoop
    let s=S('thieves');s.spawnT=99;const v=T.addAct(s,{thief:false,p:.999,ent:0});run('thieves',s,1.6);out.vis={gold:s.gold,plain:s.plain};
    s=S('thieves');s.spawnT=99;s.gold=20;s.plain=80;T.addAct(s,{thief:true,p:.999,ent:1});run('thieves',s,1.6);out.thf={gold:s.gold,plain:s.plain};
    s=S('thieves');s.spawnT=99;s.gold=20;s.plain=12;for(let i=0;i<6;i++)T.addAct(s,{thief:true,p:.999,ent:i%3});let hi=0;run('thieves',s,2.5,(s)=>{hi=Math.max(hi,s.gold)});out.thfAll={gold:s.gold,plain:s.plain,max:hi};
    // masks
    s=S('thieves');g.toStage(s,1);s.spawnT=99;s.busyT=99;const d=T.addAct(s,{thief:true,disg:true,tk:"imp",p:.5,ent:0});run('thieves',s,.1);const hadMask=d.disg;
    run('thieves',s,.05,(s,inp)=>tapAt(d.x,d.y)(inp));out.mask={had:hadMask,sT:s.sT,sv:s.sv,ph:d.ph,disg:d.disg};
    s=S('thieves');g.toStage(s,1);s.spawnT=99;s.busyT=99;const vv=T.addAct(s,{thief:false,p:.5,ent:0});run('thieves',s,.1);run('thieves',s,.05,(s,inp)=>tapAt(vv.x,vv.y)(inp));out.realTap={sT:s.sT,sv:s.sv,ph:vv.ph,disg:vv.disg};
    {let n=0,masked=0,bad=0,thiefs=0;s=S('thieves');g.toStage(s,1);for(let i=0;i<400;i++){s.acts=[];T.spawnNext(s);const a=s.acts[0];n++;if(a.disg){masked++;if(!a.thief)bad++}if(a.thief)thiefs++}
      let m1=0;s=S('thieves');for(let i=0;i<400;i++){s.acts=[];if(!s.bag.length)s.bag=T.makeBag(0);T.spawnNext(s);if(s.acts[0].disg)m1++}out.maskStats={n,masked,bad,m1}}
    s=S('thieves');g.toStage(s,1);s.spawnT=99;s.busyT=99;s.plain=100;s.gold=0;const d2=T.addAct(s,{thief:true,disg:true,tk:"sloth",p:.999,ent:2});run('thieves',s,1.6);out.maskHeap={plain:s.plain,gold:s.gold,disg:d2.disg};
    // a whole morning has no masks and no busy people; an afternoon has both
    {let masks=0,busy=0;s=S('thieves');run('thieves',s,44,(s)=>{busy=Math.max(busy,s.busy.length);if(s.acts.some(a=>a.disg))masks++});out.morning={masks,busy,st:s.st};
     masks=0;busy=0;let seenDisg=0;s=S('thieves');g.toStage(s,1);run('thieves',s,48,(s)=>{busy=Math.max(busy,s.busy.length);if(s.acts.some(a=>a.disg))seenDisg++});out.afternoon={busy,seenDisg}}
    // busy people are neutral
    s=S('thieves');g.toStage(s,1);s.spawnT=99;s.busyT=99;const bz=T.addBusy(s,{x:96,y:214,dir:1,nm:0});const snap=()=>JSON.stringify([s.plain,s.gold,s.sT,s.sv,s.acts.length,s.stolen,s.gilded]);const s0=snap();
    run('thieves',s,.05,(s,inp)=>tapAt(bz.x,bz.y-12)(inp));out.busyTap={same:snap()===s0,shrug:bz.shrug>0};
    s=S('thieves');g.toStage(s,1);s.spawnT=99;s.busyT=99;T.addBusy(s,{x:60,y:214,dir:1});T.addBusy(s,{x:130,y:214,dir:-1,nm:1});const s1=snap();run('thieves',s,6);out.busyWalk={same:snap()===s1,left:s.busy.length};
    s=S('thieves');g.toStage(s,1);s.spawnT=99;s.busyT=99;const th=T.addAct(s,{thief:true,p:.5,ent:0});run('thieves',s,.1);const bb=T.addBusy(s,{x:th.x,y:th.y+10,dir:1});run('thieves',s,.01);
    run('thieves',s,.05,(s,inp)=>tapAt(th.x,th.y)(inp));out.behind={sT:s.sT,ph:th.ph};
    // the evening review
    {s=S('thieves');let mo1=0;run('thieves',s,20,(s)=>{mo1=Math.max(mo1,s.mo.length)});out.moI=mo1;s=S('thieves');g.toStage(s,1);let mo2=0;run('thieves',s,20,(s)=>{mo2=Math.max(mo2,s.mo.length)});out.moII=mo2;
     s=S('thieves');g.toStage(s,2);const G=s.gold,P=s.plain,N=s.moN;out.rev0={st:s.st,N,G,len:s.mo.length,exp:Math.ceil(G/5)};
     // no taps: a moment rises, waits in its ring, drifts back and rises again
     const seq=[];let first=null,r;for(let i=0;i<640;i++){const inp=miniBlankInp();s.t+=.05;r=g.step(s,.05,inp);const m=s.mo[0];if(seq[seq.length-1]!==m.ph)seq.push(m.ph);if(r==='win')break}
     out.miss={seq,kept:s.kept,gold:s.gold,plain:s.plain,r:r||null,flying:s.mo.filter(m=>m.ph!=="heap").length};
     // keep them all with taps (and A)
     s=S('thieves');g.toStage(s,2);let kept=0,rr=null,t=0,viaA=0;for(let i=0;i<2400&&rr!=='win';i++){const inp=miniBlankInp();s.t+=.05;const m=s.mo.find(m=>m.ph==="ring"&&m.t>.2);
       if(m){if(i%2){inp.taps=[{x:m.x,y:m.y}];inp.tap=inp.taps[0]}else{inp.aTap=true;viaA++}}rr=g.step(s,.05,inp);t=s.stT}
     out.keepAll={r:rr||null,kept:s.kept,N:s.moN,gold:s.gold,G:s.gold,t:+t.toFixed(1),viaA};
     // dusk: under 40 gold repeats the afternoon with the morning kept
     s=S('thieves');s.spawnT=99;s.gold=33;s.plain=51;s.sv=1;s.stT=T.DUR[0];s.acts=[];run('thieves',s,.1);const st1=s.st;
     s.gold=39;s.plain=30;s.spawnT=99;s.busyT=99;s.acts=[];s.stT=T.DUR[1];const r39=run('thieves',s,.1);
     const s2=S('thieves');g.toStage(s2,1);out.dusk={st1,r39:r39||null,back:{st:s2.st,gold:s2.gold,plain:s2.plain,sv:s2.sv,mo:s2.mo.length}};
     s=S('thieves');s.spawnT=99;s.gold=33;s.plain=51;s.stT=T.DUR[0];s.acts=[];run('thieves',s,.1);s.gold=40;s.plain=20;s.acts=[];s.stT=T.DUR[1];s.spawnT=99;s.busyT=99;const r40=run('thieves',s,.1);out.dusk40={r:r40||null,st:s.st,mo:s.mo.length,dusk:s.dusk}}
  }
  return out})()""")
        await ctx.close()
        # ---- yours ----
        o, c, t = r["open"], r["closed"], r["tst"]
        self.add("p32", "yours_open_hands_pass", o["gold"] == 0 and o["touch"] == 0 and o["en"] == 1 and all(o["ghosts"]) and o["left"] == 2 and c["gold"] == 1 and c["touch"] == 1 and c["en"] < 1 and c["left"] == 0,
                 f"hands open: a gold and a grey thing fell through the hands' zone and nothing changed (gold {o['gold']}, not-yours touches {o['touch']}, energy {o['en']}, both ghosted={o['ghosts']}); hands closed: the same two were caught (gold {c['gold']}, touches {c['touch']}, energy {c['en']})")
        e, s1 = r["empty"], r["stage1"]
        self.add("p32", "yours_test_reveals", t["ratio"] <= .4 and t["testing"] and r["pre"] == ["yours", "yours", "not yours"] and t["shown"] == ["yours", "not yours", "not yours"] and min(t["rev"]) > .95 and t["calm"] < .75 and abs(r["refill"] - .12) < .02
                 and (not e["testing"]) and e["ts"] == 1 and e["rev"] == 0 and e["calm"] > 0 and (not s1["testing"]) and s1["ts"] == 1 and s1["calm"] == 1 and s1["rev"] == 0,
                 f"Stage II, B held: fall speed {t['v0']} -> {t['v1']} units/s ({t['ratio']}x); before testing the painted fake showed {r['pre'][1]!r}, while testing {t['shown']} (gold, fake, grey); calm 1 -> {t['calm']} after .9 s of testing, refills {r['refill']} per second; with 0 calm B does nothing (testing={e['testing']}, speed x{e['ts']}); Stage I: B does nothing (testing={s1['testing']}, calm {s1['calm']})")
        th = r["th"]
        tgs = [th[k]["tg"] for k in ("avoid", "block", "chase")]
        self.add("p32", "yours_thief_unstoppable", all((not th[k]["iron"]) and th[k]["ph"] == "gone" for k in th) and max(tgs) - min(tgs) < .15 and th["avoid"]["touch"] == 0 and th["block"]["touch"] == 1 and th["chase"]["touch"] == 1 and th["block"]["touched"] and th["chase"]["touched"],
                 f"avoiding him, standing in his path with closed hands, and chasing him: he left with the iron lamp at {tgs} s (same time, within .15 s); not-yours touches {th['avoid']['touch']} / {th['block']['touch']} / {th['chase']['touch']} (exactly one if the closed hands touch him)")
        cl, nw, nw2 = r["clay"], r["noWin"], r["noWin2"]
        self.add("p32", "yours_clay_lamp_last", cl["won"] > 0 and cl["bad"] == 0 and cl["max"] == 15 and cl["clay"] and nw["r"] is None and not nw["clay"] and nw2["r"] is None and not nw2["clay"] and r["clayPass"]["seen"][:3] == ["down", "up", "down"] and r["clayPass"]["r"] is None and r["clayCatch"] == "win",
                 f"auto-play won at {cl['won']} s with the clay lamp present only after 15 gold ({cl['max']}) and the thief gone with the iron lamp (steps where it was early: {cl['bad']}); closing on a grey thing in Stage III or on gold in Stage II doesn't win ({nw['r']}, {nw2['r']}); open hands let the clay lamp pass and it drifts back up and falls again ({r['clayPass']['seen'][:4]}); closed hands catch it={r['clayCatch']}")
        # ---- thieves ----
        v, tf, ta = r["vis"], r["thf"], r["thfAll"]
        self.add("p32", "thieves_visitors_turn_gold", 5 <= v["gold"] <= 7 and v["gold"] + v["plain"] == 100 and 5 <= 80 - tf["plain"] <= 7 and tf["gold"] == 20 and ta["gold"] == 20 and ta["max"] == 20 and ta["plain"] == 0,
                 f"a visitor reaching the heap turned {v['gold']} plain grains gold (plain {v['plain']}); a thief took {80 - tf['plain']} plain grains and left the 20 gold alone; six thieves on 12 plain grains left plain {ta['plain']} and gold {ta['gold']} (never above {ta['max']})")
        m, rt, ms, mh, mo, af = r["mask"], r["realTap"], r["maskStats"], r["maskHeap"], r["morning"], r["afternoon"]
        self.add("p32", "thieves_masked_only", m["had"] and m["sT"] == 1 and m["sv"] == 0 and m["ph"] == "shoo" and (not m["disg"]) and rt["sv"] == 1 and rt["sT"] == 0 and (not rt["disg"]) and ms["bad"] == 0 and ms["masked"] > 100 and ms["m1"] == 0
                 and mh["plain"] < 100 and mh["gold"] == 0 and (not mh["disg"]) and mo["masks"] == 0 and af["seenDisg"] > 0,
                 f"a tap on a masked thief knocked the mask off and shooed it (thieves shooed {m['sT']}, visitors shooed {m['sv']}); a tap on a real visitor counts a visitor shooed ({rt['sv']}); of 400 afternoon arrivals {ms['masked']} were masked and none was a real visitor ({ms['bad']}); a disguised thief reaching the heap took {100 - mh['plain']} plain grains and gilded {mh['gold']}; a whole morning showed {mo['masks']} masked frames, the afternoon {af['seenDisg']}")
        bt, bw, bh = r["busyTap"], r["busyWalk"], r["behind"]
        self.add("p32", "thieves_busy_neutral", mo["busy"] == 0 and af["busy"] >= 2 and bt["same"] and bt["shrug"] and bw["same"] and bw["left"] == 0 and bh["sT"] == 1 and bh["ph"] == "shoo",
                 f"no busy people in the morning ({mo['busy']}), up to {af['busy']} at once in the afternoon; tapping one changed nothing (shrug only)={bt['same'] and bt['shrug']}; two crossing the heap changed no sand or counter={bw['same']}; a tap on a thief standing behind a busy person still shooed it (thieves shooed {bh['sT']})")
        rv, ms2, kp, dk, d40 = r["rev0"], r["miss"], r["keepAll"], r["dusk"], r["dusk40"]
        self.add("p32", "thieves_review_in_III", r["moI"] == 0 and r["moII"] == 0 and rv["st"] == 2 and rv["len"] == rv["exp"] and ms2["seq"][:5] == ["heap", "rise", "ring", "back", "heap"] and ms2["seq"].count("rise") >= 2 and ms2["kept"] == 0 and ms2["gold"] == rv["G"] and ms2["r"] is None
                 and kp["r"] == "win" and kp["kept"] == kp["N"] and kp["gold"] == rv["G"] and dk["st1"] == 1 and dk["r39"] == "end" and dk["back"]["st"] == 1 and dk["back"]["gold"] == 33 and dk["back"]["plain"] == 51 and dk["back"]["sv"] == 1 and dk["back"]["mo"] == 0 and d40["r"] is None and d40["st"] == 2 and d40["mo"] > 0 and d40["dusk"] == 40,
                 f"moments in the morning/afternoon: {r['moI']}/{r['moII']}; in the evening {rv['len']} (gold {rv['G']} / 5); a missed one went {ms2['seq'][:6]} and rose again={ms2['seq'].count('rise') >= 2}, with no kept and gold still {ms2['gold']}; keeping every one returned {kp['r']!r} after {kp['t']} s ({kp['kept']} of {kp['N']}, gold {kp['gold']}); dusk with 39 gold returns {dk['r39']!r} and toStage(1) restores plain {dk['back']['plain']} / gold {dk['back']['gold']} / visitors shooed {dk['back']['sv']}; 40 gold goes on to the evening ({d40['st']})")

        # ---------------- Phase 32D: The View from Above ----------------
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const out={};const g=MINI.above,T=g._t,A=MINI_ART.above;
  const S=()=>{const s={W:192,H:320,rm:false,t:0};g.init(s);return s};
  const run=(s,sec,f)=>{let res;for(let i=0;i<Math.round(sec/.05);i++){const inp=miniBlankInp();if(f)f(s,inp,i);s.t+=.05;res=g.step(s,.05,inp);if(res)return res}return res};
  const tap=(x,y)=>(s,inp,i)=>{if(i===0){inp.taps=[{x,y}];inp.tap=inp.taps[0]}};
  const dt=T.DET;
  /* ---- above_five_levels ---- */
  {const o=out.lv={};o.bg=A.bg.length;o.kinds=dt.map(d=>d.k);o.targets=dt.every(d=>d.y<=250&&T.HR*2>=22);
    // before the detail is taken in, B, up and a pinch in do nothing
    let s=S();run(s,1.2,(s,inp)=>{inp.b=true});const zb=s.z;run(s,1.2,(s,inp)=>{inp.dy=-1});const zu=s.z;run(s,1.2,(s,inp)=>{inp.fingers=2;inp.pinch=.96});o.before=[zb,zu,s.z,s.lvl,s.taken[0]];
    // taking it in, then B / up / pinch in each rise
    const rises=[(s,inp)=>{inp.b=true},(s,inp)=>{inp.dy=-1},(s,inp)=>{inp.fingers=2;inp.pinch=.96}];
    o.rise=rises.map(f=>{const s=S();run(s,.1,(s,inp)=>{inp.aTap=true});const t0=s.taken[0];run(s,1,f);return [t0,+s.z.toFixed(2)]});
    // a rise stops at the next whole level, where the next detail glows (and holding B goes no further)
    s=S();run(s,.1,(s,inp)=>{inp.aTap=true});run(s,5,(s,inp)=>{inp.b=true});o.l1=[s.z,s.lvl,s.taken[1],s.st];
    // letting go mid-step holds the view still
    s=S();run(s,.1,(s,inp)=>{inp.aTap=true});run(s,.8,(s,inp)=>{inp.b=true});const zm=s.z;run(s,2,()=>{});o.hold=[+zm.toFixed(3),+s.z.toFixed(3)];
    // all five levels in order, and Stage I ends only once the star is taken in
    s=S();const seq=[0];let stAtTop=-1,early=false;
    for(let i=0;i<3000&&s.st===0;i++){const inp=miniBlankInp();if(s.z===s.lvl&&!s.taken[s.lvl]){if(s.lvl===4){stAtTop=s.st;run(s,1,()=>{})}inp.aTap=true}else inp.b=true;s.t+=.05;g.step(s,.05,inp);if(seq[seq.length-1]!==s.lvl)seq.push(s.lvl)}
    o.seq=seq;o.stTop=stAtTop;o.st=s.st;o.z4=s.z;
    // wasted taps: only a miss while a detail glows and is not yet taken in
    s=S();run(s,.4,tap(20,20));const w1=s.wasted;run(s,.4,tap(dt[0].x,dt[0].y));const w2=s.wasted,tk=s.taken[0];run(s,.4,tap(20,20));const w3=s.wasted;
    run(s,.35,(s,inp)=>{inp.b=true});run(s,.4,tap(20,20));const w4=s.wasted;
    run(s,5,(s,inp)=>{inp.b=true});run(s,.4,tap(20,20));const w5=s.wasted;   // a level reached: its detail glows, so this one counts
    s.z=2.6;s.lvl=2;run(s,.4,tap(20,20));const w6=s.wasted;                 // mid-step: no
    o.w=[w1,w2,tk,w3,w4,w5-w4,w6-w5];
    // a two-finger pinch adds none: the first finger's tap is thrown away when the second lands, and the second finger's own tap too
    s=S();run(s,.5,(s,inp,i)=>{if(i===0){inp.taps=[{x:20,y:20}];inp.fingers=1}else if(i===2){inp.taps=[{x:60,y:200}];inp.fingers=2}else if(i>2)inp.fingers=2});const wp=s.wasted;
    s=S();run(s,.5,(s,inp,i)=>{inp.taps=i===0?[{x:20,y:20},{x:150,y:60}]:[];inp.fingers=2;inp.pinch=.97});o.pinch=[wp,s.wasted];
    // Stages II and III: never a wasted tap
    s=S();g.toStage(s,1);run(s,.5,tap(20,20));const a2=s.wasted;g.toStage(s,2);run(s,.5,tap(20,20));o.later=[a2,s.wasted]}
  /* ---- above_cloud_shrinks ---- */
  {const o=out.cl={};const w=[],al=[];for(let L=0;L<=4;L++){const s=S();s.lvl=L;s.z=L;const c=T.cloudNow(s);w.push(+c.w.toFixed(2));al.push(c.world)}
    o.w=w;o.world=al;let mono=true,pv=1e9;for(let z=0;z<=4.0001;z+=.05){const s=S();s.z=Math.min(4,z);const c=T.cloudNow(s);if(c.w>pv+1e-9)mono=false;pv=c.w}o.mono=mono;
    let s=S();g.toStage(s,1);const a0=T.cloudA(s);run(s,6,(s,inp)=>{inp.b=true});o.a2=[+a0.toFixed(2),+T.cloudA(s).toFixed(2),s.st];
    run(s,5.8,(s,inp)=>{inp.b=true});o.a3=[+T.cloudA(s).toFixed(2),s.st];
    s=S();g.toStage(s,2);let mx=0,zmin=9;run(s,6,(s,inp)=>{inp.a=true;mx=Math.max(mx,T.cloudNow(s).w);zmin=Math.min(zmin,s.z)});o.small=[+mx.toFixed(1),zmin,+T.cloudNow(s).w.toFixed(1),T.CW]}
  /* ---- above_duties_after_return ---- */
  {const o=out.du={};const D=T.DUTIES();const tapAll=(s)=>{for(const d of D)run(s,.4,tap(d.hx,d.hy))};
    let s=S();tapAll(s);run(s,.3,tap(30,120));o.s1=[s.done,s.dutyMiss,s.mq.length,s.mw?1:0];
    s=S();g.toStage(s,1);tapAll(s);run(s,.3,tap(30,120));o.s2=[s.done,s.dutyMiss,s.mq.length,s.mw?1:0];
    s=S();g.toStage(s,2);tapAll(s);run(s,.3,tap(30,120));run(s,1,(s,inp)=>{inp.a=true;if(s.z<1.5){inp.taps=[{x:D[0].hx,y:D[0].hy},{x:30,y:120}]}});const zz=s.z;o.s3=[s.done,s.dutyMiss,s.mq.length,s.mw?1:0,+zz.toFixed(2)];
    // the return reaches the tent, then each duty in any order
    const order=(ks)=>{const s=S();g.toStage(s,2);run(s,5,(s,inp)=>{inp.a=true});const res={z:s.z,ks,moved:[],done:[],win:null,spd:[]};
      for(const k of ks){const d=D.find(q=>q.k===k),mx0=s.mx,my0=s.my;let t0=null,walked=0,px=s.mx,py=s.my,tw=0;
        run(s,.1,tap(d.hx,d.hy));let r;for(let i=0;i<400&&!s.duties.find(q=>q.k===k).done;i++){const x0=s.mx,y0=s.my;r=run(s,.05);if(s.mw&&s.mw.ph==="walk"){walked+=Math.hypot(s.mx-x0,s.my-y0);tw+=.05}if(r)break}
        res.moved.push(Math.hypot(s.mx-mx0,s.my-my0)>1||k==="letter"&&mx0!==s.mx);res.done.push(s.duties.filter(q=>q.done).length);res.spd.push(tw>0?+(walked/tw).toFixed(1):0)}
      res.win=run(s,2);res.dm=s.dutyMiss;res.rate=g.rate(s);return res};
    o.o1=order(["guard","horse","letter"]);o.o2=order(["letter","guard","horse"]);o.o3=order(["horse","letter","guard"]);
    // a miss, taps on Marcus or a done duty, and a tap on another duty while Marcus is busy
    s=S();g.toStage(s,2);run(s,5,(s,inp)=>{inp.a=true});run(s,.3,tap(30,120));const m1=s.dutyMiss;run(s,.3,tap(s.mx,s.my-11));const m2=s.dutyMiss;
    run(s,.2,tap(D[0].hx,D[0].hy));run(s,.2,tap(D[2].hx,D[2].hy));const busy=[s.mw?s.mw.k:null,s.mq.slice(),s.dutyMiss];
    let r2;for(let i=0;i<600&&!(s.duties[0].done&&s.duties[2].done);i++)r2=run(s,.05);const m3=s.dutyMiss;run(s,.3,tap(D[0].hx,D[0].hy));
    o.miss=[m1,m2,busy,s.duties[0].done&&s.duties[2].done,m3,s.dutyMiss,s.done];
    // no win until the third; lanterns
    s=S();g.toStage(s,2);s.z=0;s.duties[0].done=s.duties[1].done=true;s.done=2;const r0=run(s,1);s.duties[2].done=true;s.done=3;const r3=run(s,1);o.win=[r0||null,r3||null];
    const R=(w,m)=>{const s=S();s.wasted=w;s.dutyMiss=m;return g.rate(s)};o.rate=[R(0,0),R(0,1),R(1,0),R(2,3)]}
  /* ---- above_zoom_registered ---- */
  {const o=out.zr={};const Z=T.ZM(),bad=[];o.k=[];for(let k=0;k<4;k++){const q=Z[k];
      const a=T.view(k+1,false).find(v=>v.i===k),w=a?192*a.S:0,cx=a?a.tx+a.S*96:-1e9,cy=a?a.ty+a.S*160:-1e9;
      const b=T.view(k,false).find(v=>v.i===k),c0=b?[b.tx,b.ty]:[1e9,1e9],c1=b?[b.tx+b.S*192,b.ty+b.S*320]:[1e9,1e9];
      o.k.push({k,ctr:[+cx.toFixed(1),+cy.toFixed(1)],want:[q.cx,q.cy],w:+w.toFixed(1),wantW:+(192*q.s).toFixed(1),tl:c0.map(v=>+v.toFixed(1)),br:c1.map(v=>+v.toFixed(1))});
      if(Math.hypot(cx-q.cx,cy-q.cy)>4||Math.abs(w-192*q.s)>4)bad.push('reg'+k);if(Math.hypot(c0[0],c0[1])>4||Math.hypot(c1[0]-192,c1[1]-320)>4)bad.push('fill'+k)}
    // between: the scene k+1 is a true zoom (its scale falls from 1/s to 1 geometrically) and k is on top
    const mid=T.view(.5,false);o.mid=mid.map(v=>[v.i,+v.S.toFixed(3),+v.a.toFixed(2)]);
    const sRM=[];for(let z=0;z<=4.001;z+=.1){for(const v of T.view(Math.min(4,z),true))sRM.push(v.S===1&&v.tx===0&&v.ty===0)}
    const m2=T.view(1.5,true);o.rm=[sRM.every(Boolean),m2.map(v=>[v.i,+v.a.toFixed(2)])];o.bad=bad;
    // geometric: S at u=.5 is s^-.5
    const v1=T.view(.5,false).find(v=>v.i===1);o.geo=[+v1.S.toFixed(3),+Math.pow(Z[0].s,-.5).toFixed(3)]}
  return out})()""")
        await ctx.close()
        lv, cl, du, zr = r["lv"], r["cl"], r["du"], r["zr"]
        seqok = lv["seq"] == [0, 1, 2, 3, 4]
        self.add("p32", "above_five_levels", lv["bg"] == 5 and lv["kinds"] == ["lamp", "fire", "river", "road", "star"] and lv["targets"] and seqok
                 and lv["before"] == [0, 0, 0, 0, False] and all(x[0] and x[1] > .2 for x in lv["rise"]) and lv["l1"] == [1, 1, False, 0] and lv["hold"][0] > .1 and lv["hold"][0] == lv["hold"][1]
                 and lv["stTop"] == 0 and lv["st"] == 1 and lv["z4"] == 4 and lv["w"] == [1, 1, True, 1, 1, 1, 0] and lv["pinch"] == [0, 0] and lv["later"] == [0, 0],
                 f"{lv['bg']} scenes; the glowing details {lv['kinds']} (each target at least 22 units, none below y 250={lv['targets']}); rising goes through levels {lv['seq']}; with nothing taken in, B / up / pinch in left z at {lv['before'][:3]} (taken={lv['before'][4]}); after taking in, B / up / pinch each rise {[x[1] for x in lv['rise']]} levels in a second; holding B stops at level {lv['l1'][0]} (z {lv['l1'][0]}, its detail untaken={not lv['l1'][2]}, stage {lv['l1'][3]+1}); letting go mid-step holds z at {lv['hold'][0]}→{lv['hold'][1]}; Stage I ended only after the star (stage when it glowed: {lv['stTop']+1}, after: {lv['st']+1}); wasted taps [miss while glowing, hit, taken={lv['w'][2]}, tap after taking, tap in motion, tap at the next glow, tap mid-step] = {lv['w']}; a pinch added {lv['pinch']}; Stages II-III added {lv['later']}")
        cw = cl["w"]
        self.add("p32", "above_cloud_shrinks", all(x == 150 for x in cl["world"]) and all(cw[i] > cw[i + 1] for i in range(4)) and abs(cw[1] - 45) < 4 and abs(cw[2] - 23.9) < 3 and cw[4] <= 2 and cw[3] <= 3 and cl["mono"]
                 and cl["a2"][1] < cl["a2"][0] and cl["a2"][1] > .1 and cl["a2"][2] == 1 and cl["a3"][0] > .1 and cl["a3"][0] < cl["a2"][1] and cl["a3"][1] == 1 and cl["small"][0] <= 24 and cl["small"][1] == 0 and cl["small"][2] <= 24 and cl["small"][0] < cl["small"][3] / 4,
                 f"the cloud's world width is {cl['world'][0]} at every level; its on-screen width at levels 0-4 is {cw} (strictly falling, never rising between levels={cl['mono']}; level 4 at most 2 units); in Stage II its alpha went {cl['a2'][0]} → {cl['a2'][1]} after 6 s of breathing and {cl['a3'][0]} just before the end (still there); in Stage III on the way down it was never wider than {cl['small'][0]} units and ends {cl['small'][2]} at the tent (world width {cl['small'][3]})")
        def ordok(x): return x["z"] == 0 and all(x["moved"]) and x["done"] == [1, 2, 3] and x["win"] == "win" and x["dm"] == 0 and x["rate"] == 3 and all(40 <= v <= 60 for v in x["spd"] if v)
        self.add("p32", "above_duties_after_return", du["s1"] == [0, 0, 0, 0] and du["s2"] == [0, 0, 0, 0] and du["s3"][:4] == [0, 0, 0, 0] and 0 < du["s3"][4] <= 4 and ordok(du["o1"]) and ordok(du["o2"]) and ordok(du["o3"])
                 and du["miss"][0] == 1 and du["miss"][1] == 1 and du["miss"][2][0] == "letter" and du["miss"][2][1] == ["guard"] and du["miss"][2][2] == 1 and du["miss"][3] and du["miss"][4] == 1 and du["miss"][5] == 1 and du["miss"][6] == 2
                 and du["win"] == [None, "win"] and du["rate"] == [3, 2, 1, 1],
                 f"taps on the duties and on empty ground in Stage I {du['s1']}, in Stage II {du['s2']}, in Stage III before the return reaches the tent (z {du['s3'][4]}) {du['s3'][:4]}: nothing done, nothing queued, no miss; after the return, three orders each finished one by one {[du[k]['done'] for k in ('o1','o2','o3')]} with Marcus walking at {du['o1']['spd']} units/s and a win only at the third ({du['o1']['win']}); a tap on empty ground added {du['miss'][0]} miss, a tap on Marcus none ({du['miss'][1]}), a tap on another duty while he was busy was queued ({du['miss'][2][1]}, no miss: {du['miss'][2][2]}), a tap on a done duty added none ({du['miss'][5]}); win with two done {du['win'][0]!r}, with three {du['win'][1]!r}; lanterns for (0 wasted, 0 misses) / (0, 1) / (1, 0) / (2, 3) = {du['rate']}")
        self.add("p32", "above_zoom_registered", not zr["bad"] and zr["rm"][0] and zr["rm"][1] == [[1, 1], [2, .5]] and abs(zr["geo"][0] - zr["geo"][1]) < .01 and [v[0] for v in zr["mid"]] == [1, 0] and zr["mid"][0][2] == 1 and 0 < zr["mid"][1][2] < 1,
                 f"{[(k['k'], 'at z=k+1 scene k centre ' + str(k['ctr']) + ' vs ' + str(k['want']) + ', width ' + str(k['w']) + ' vs ' + str(k['wantW']) + '; at z=k corners ' + str(k['tl']) + ' ' + str(k['br'])) for k in zr['k']]}; flagged: {zr['bad'] or 'none'}; halfway 0→1 (scene, scale, alpha) {zr['mid']}, scene 1's scale is s^(u-1)={zr['geo']}; Reduce Motion: no scene scaled or moved at any z={zr['rm'][0]}, and at z=1.5 a crossfade {zr['rm'][1]}")

    async def p33(self, b):
        ids = ["lute", "water", "kitchen", "butterfly"]
        await self.mini_suite(b, "p33", ids)
        await self.hd_suite(b, "p33", ids)
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const out={};const S=id=>{const s={W:192,H:320,rm:false,t:0};MINI[id].init(s);return s};
  const run=(id,s,sec,f)=>{let res;for(let i=0;i<Math.round(sec/.05);i++){const inp=miniBlankInp();if(f)f(s,inp,i);s.t+=.05;res=MINI[id].step(s,.05,inp);if(res)return res}return res};
  const r2=x=>+x.toFixed(2);
  /* ---------------- Tune the Lute ---------------- */
  {const g=MINI.lute,T=g._t;
    // a turn of a given total hand travel at a given hand speed (units per second), then 4 s of letting go
    const turn=(c,T0,total,v)=>{const s=S('lute');s.c=[30,c,70];s.T=[50,T0,50];s.sel=1;s.hint=0;let left=total;
      while(left>1e-9){const d=Math.min(left,v*.05);left-=d;const inp=miniBlankInp();inp.drag={x:96,y:0,dx:0,dy:-d};s.t+=.05;g.step(s,.05,inp)}
      run('lute',s,1.2);const rest=s.T[1];for(let i=0;i<60&&!s.set[1];i++){const inp=miniBlankInp();s.t+=.05;g.step(s,.05,inp)}return {T:rest,set:s.set[1]}};
    // find the hand travel that lands a slow turn (30 units/s) exactly on the note
    let lo=0,hi=400;for(let i=0;i<40;i++){const mid=(lo+hi)/2;turn(50,20,mid,30).T<50?lo=mid:hi=mid}
    const total=(lo+hi)/2,slow=turn(50,20,total,30),fast=turn(50,20,total,420);
    out.ot={total:r2(total),slow:{T:r2(slow.T),set:slow.set},fast:{T:r2(fast.T),set:fast.set}};
    // the response per unit of input: tension gained per unit of hand travel, at four speeds, drift taken out
    const resp=v=>{const s=S('lute');s.c=[30,80,70];s.T=[50,10,50];s.sel=1;s.hint=0;const s0=S('lute');s0.c=[30,80,70];s0.T=[50,10,50];s0.sel=1;s0.hint=0;let left=12;
      while(left>1e-9){const d=Math.min(left,v*.05);left-=d;const inp=miniBlankInp();inp.drag={x:96,y:0,dx:0,dy:-d};s.t+=.05;g.step(s,.05,inp)}
      run('lute',s,3);run('lute',s0,3);const base=s0.T[1]-10;return (s.T[1]-10-base)/12};
    out.resp=[30,100,300,900].map(v=>r2(resp(v)));
    out.gains=[0,150,600].map(v=>r2(T.gain(v)));out.K=T.K;out.ZH=T.ZH}
  {const g=MINI.lute,T=g._t;
    // coupling: tighten and loosen string 0 in Stage II, drift taken out with an identical idle run
    const couple=(st,dir)=>{const mk=()=>{const s=S('lute');g.toStage(s,st);s.c=[40,50,60];s.T=[50,50,50];s.set=[false,false,false];s.hold=[0,0,0];s.sel=st===0?1:0;s.hint=0;return s};
      const a=mk(),b=mk();const k=a.sel;let n=0;
      for(let i=0;i<8;i++){const inp=miniBlankInp();inp.drag={x:96,y:0,dx:0,dy:-dir*3};a.t+=.05;g.step(a,.05,inp)}
      run('lute',a,1.2);run('lute',b,1.2+.4);
      const d=a.T[k]-50,others=[0,1,2].filter(j=>j!==k).map(j=>(a.T[j]-b.T[j])+0);return {d:r2(d),others:others.map(r2),ratio:others.map(o=>r2(-o/d))}};
    out.cpTight=couple(1,1);out.cpLoose=couple(1,-1);out.cpOne=couple(0,1);
    // a set string knocked out of tune loses its set state
    let s=S('lute');g.toStage(s,1);s.c=[40,50,60];s.T=[40,50,60];s.sel=0;s.hint=0;run('lute',s,2.3);const set1=s.set.slice();
    for(let i=0;i<14;i++){const inp=miniBlankInp();inp.drag={x:96,y:0,dx:0,dy:-3};s.t+=.05;g.step(s,.05,inp)}run('lute',s,.3);out.knock={before:set1,after:s.set.slice(),T:s.T.map(r2)};
    // Stage II ends only when all three are set at once
    s=S('lute');g.toStage(s,1);s.c=[40,50,60];s.T=[40,50,90];s.sel=0;s.hint=0;run('lute',s,6);out.two={st:s.st,set:s.set.slice()};
    s.T[2]=60;run('lute',s,1.6);out.almost={st:s.st,set:s.set.slice()};run('lute',s,1.5);out.three={st:s.st,set:s.set.slice()}}
  {const g=MINI.lute;const bad=[];let ends=0,maxT=0,minT=1e9;
    for(const st of [0,1,2]){const s=S('lute');g.toStage(s,st);s.hint=0;
      for(let i=0;i<600;i++){const inp=miniBlankInp();if(i%3===0){inp.drag={x:96,y:0,dx:0,dy:(i%60<30?-1:1)*5000}}else inp.dy=-1;if(i%90===0)inp.lTap=true;if(i%7===0){inp.taps=[{x:90,y:50+(i%3)*26}];inp.tap=inp.taps[0]}
        s.t+=.05;const r=g.step(s,.05,inp);if(r==="end")ends++;
        for(const T of s.T){maxT=Math.max(maxT,T);minT=Math.min(minT,T);if(!isFinite(T))bad.push(st)}if(!isFinite(s.m))bad.push(st)}}
    // the hard push (up held for 30 s) from every stage, then the game carries on and can be won
    const sw=S('lute');g.toStage(sw,1);sw.hint=0;let held=0;for(let i=0;i<600;i++){const inp=miniBlankInp();inp.dy=-1;sw.t+=.05;if(g.step(sw,.05,inp)==="end")ends++;for(const T of sw.T){maxT=Math.max(maxT,T);minT=Math.min(minT,T)}}
    let won=-1;for(let i=0;i<4000;i++){const inp=miniBlankInp();sw.t+=.05;g.auto(sw,inp);const r=g.step(sw,.05,inp);if(r==="end")ends++;if(r==="win"){won=sw.t;break}}
    out.snap={ends,maxT:r2(maxT),minT:r2(minT),bad:bad.length,won:r2(won),finite:sw.T.every(isFinite)}}
  {const g=MINI.lute,T=g._t;const lane=k=>inp=>{inp.taps=[{x:90,y:T.LT[k]+10}];inp.tap=inp.taps[0]};
    const toAnswer=()=>{const s=S('lute');g.toStage(s,2);s.hint=0;let i=0;while(s.ph!=="answer"&&i++<600){const inp=miniBlankInp();s.t+=.05;g.step(s,.05,inp)}return s};
    let s=toAnswer();const ph=s.phrase.slice(),lens=[ph.length,ph.every(k=>k>=0&&k<3),new Set(ph).size];const lit=[];let res;
    for(let i=0;i<ph.length;i++){const inp=miniBlankInp();lane(ph[i])(inp);s.t+=.05;g.step(s,.05,inp);run('lute',s,.9);lit.push(s.lamp.map(x=>x>.6?1:0).join(""))}
    for(let i=0;i<80&&!res;i++){const inp=miniBlankInp();s.t+=.05;res=g.step(s,.05,inp)}
    out.ph={ph,lens,lit,res:res||null,tries:s.tries};
    // a wrong note restarts the phrase: lamps from that attempt go out, tries +1, nothing ends
    s=toAnswer();const p2=s.phrase.slice();let inp=miniBlankInp();lane(p2[0])(inp);s.t+=.05;g.step(s,.05,inp);inp=miniBlankInp();lane(p2[1])(inp);s.t+=.05;g.step(s,.05,inp);run('lute',s,.8);const before=s.lamp.map(x=>x>.6?1:0).join("");
    inp=miniBlankInp();lane((p2[2]+1)%3)(inp);s.t+=.05;const rw=g.step(s,.05,inp);const mid={tries:s.tries,prog:s.prog,ph:s.ph};run('lute',s,3.9);
    const out0=s.lamp.every(x=>x<.05);const ph2=s.phrase.slice();let ends=0,res2;
    for(let i=0;i<1200&&s.ph!=="answer";i++){const q=miniBlankInp();s.t+=.05;g.step(s,.05,q)}
    for(let i=0;i<ph2.length;i++){const q=miniBlankInp();lane(ph2[i])(q);s.t+=.05;if(g.step(s,.05,q)==="end")ends++;run('lute',s,.3)}
    for(let i=0;i<80&&!res2;i++){const q=miniBlankInp();s.t+=.05;res2=g.step(s,.05,q);if(res2==="end")ends++}
    out.wrong={before,mid,rw:rw||null,lampsOut:out0,samePhrase:JSON.stringify(ph2)===JSON.stringify(p2),res2:res2||null,ends,tries:s.tries};
    const rt=(o,t)=>g.rate({outT:o,tries:t});out.rate=[rt(0,0),rt(5.9,0),rt(0,1),rt(3,2),rt(6,0),rt(17.9,0),rt(10,1),rt(18,0),rt(40,3)]}
  /* ---------------- Be Water ---------------- */
  {const g=MINI.water,T=g._t;const tapAt=(x,y)=>inp=>{inp.taps=[{x,y}];inp.tap=inp.taps[0]};
    const snap=s=>JSON.stringify([s.grid,s.wet]);
    // tapping bedrock never changes the grid or the water; each tap is counted
    const A=S('water'),B=S('water');const bed=[[1,1],[2,1],[0,3],[5,3],[2,6]];let n=0;
    run('water',A,6,(s,inp,i)=>{const [x,y]=bed[i%bed.length];tapAt(T.cx(x),T.cy(y))(inp);n++;inp.b=true});run('water',B,6,(s,inp)=>{inp.b=true});
    out.bed={same:snap(A)===snap(B),taps:A.bedrockTaps,n,lifted:A.lifted,ch:A.grid[1][1]};
    // one tap on the loose stone: soil
    const C=S('water');out.stoneBefore=C.grid[3][4];run('water',C,.1,(s,inp,i)=>{if(i===0)tapAt(T.cx(4),T.cy(3))(inp)});out.stoneAfter=C.grid[3][4];out.lifted=C.lifted;out.bedAfterStone=C.bedrockTaps;
    // the stage completes without ever touching bedrock (auto never taps it)
    const D=S('water');let won=-1,sts=[];for(let i=0;i<6000;i++){const inp=miniBlankInp();D.t+=.05;g.auto(D,inp);const r=g.step(D,.05,inp);if(!sts.length||sts[sts.length-1]!==D.st)sts.push(D.st);if(r==="win"){won=D.t;break}}
    out.noBed={won:r2(won),sts,taps:D.bedrockTaps}}
  {const g=MINI.water,T=g._t;const tapAt=(x,y)=>inp=>{inp.taps=[{x,y}];inp.tap=inp.taps[0]};
    // clay: states, opening at 4 s of sim time, no taps; B opens it sooner in real time but at the same sim time
    const watch=(useB,tapClay)=>{const s=S('water');g.toStage(s,1);const names=[];let t=-1,sim=-1,tapsOn=0;
      for(let i=0;i<2400;i++){const inp=miniBlankInp();if(useB)inp.b=true;if(tapClay&&i%2===0){tapAt(T.cx(3),T.cy(1))(inp);tapsOn++}s.t+=.05;g.step(s,.05,inp);
        if(s.grid[1][3]==="c"){const nm=T.clayName(s.ct[1][3]);if(names[names.length-1]!==nm)names.push(nm)}
        else if(t<0){t=i*.05+.05;sim=s.simT;break}}
      return {names,real:r2(t),sim:r2(sim),taps:tapsOn,bed:s.bedrockTaps}};
    out.clay={plain:watch(false,false),fast:watch(true,false),taps:watch(false,true)};
    out.clayT=T.CLAYT;
    // clay with no water against it never wears: Stage I, the first row sealed so the water never gets past the top row
    const s=S('water');s.grid[1][0]="#";run('water',s,120,(s,inp)=>{inp.b=true});out.dry={ct:s.ct[6][1],ch:s.grid[6][1],wetBelow:s.wet.slice(2).some(r=>r.some(x=>x))};
    // clay wears only while water is touching it: lift the stone, and the clay starts to wear only once the water is beside it
    {const q=S('water');let first=-1,touching=false,early=0;for(let i=0;i<2400&&first<0;i++){const inp=miniBlankInp();inp.b=true;if(i===0)tapAt(T.cx(4),T.cy(3))(inp);q.t+=.05;g.step(q,.05,inp);
      const wetNb=(q.wet[5][1])||(q.wet[6][0])||(q.wet[6][2])||(q.wet[7][1]);if(q.ct[6][1]>0){first=q.simT;touching=wetNb}else if(wetNb)early++}
      out.clayLate={first:r2(first),touching,gap:early}}
  }
  {const g=MINI.water,T=g._t;const tapAt=(x,y)=>inp=>{inp.taps=[{x,y}];inp.tap=inp.taps[0]};
    // the seed: taps never move it; it moves only when the water advances out of its cell; roots only on the bare field
    const trial=(lifts,seconds,taps)=>{const s=S('water');g.toStage(s,1);const log=[];let path=[],bad=0,moves=0,rootedWrong=0,rootT0=0,rootBeforeRoot=0,tapsDone=0,rootedAt=-1;
      for(let i=0;i<seconds/.05;i++){
        for(const [x,y,ti] of lifts)if(i===ti){const inp=miniBlankInp();tapAt(T.cx(x),T.cy(y))(inp);s.t+=.05;g.step(s,.05,inp)}
        const sd=s.seed,before=[sd.x,sd.y],Wb=s.wet.map(r=>r.slice());
        const inp=miniBlankInp();inp.b=true;if(taps){for(const p of [[sd.px,sd.py],[96,150],[T.cx(3),T.cy(2)],[T.cx(2),T.cy(6)]]){if(T.nearest(s,p[0],p[1])===null){inp.taps=(inp.taps||[]).concat([{x:p[0],y:p[1]}]);tapsDone++}}if(inp.taps)inp.tap=inp.taps[0]}
        s.t+=.05;g.step(s,.05,inp);
        const a=[s.seed.x,s.seed.y];path.push(a.join(''));if(a[0]!==before[0]||a[1]!==before[1]){moves++;
          // it moved into a cell the water entered on the same tick, out of a cell that was wet
          if(!(Wb[before[1]][before[0]]&&!Wb[a[1]][a[0]]&&s.wet[a[1]][a[0]]))bad++}
        if(s.seed.root){if(rootedAt<0)rootedAt=s.simT;if(s.grid[s.seed.y][s.seed.x]!=="B")rootedWrong++}else if(s.rootT!==0)rootBeforeRoot++}
      return {path:path.join('|'),moves,bad,root:s.seed.root,at:[s.seed.x,s.seed.y],rootedWrong,rootBeforeRoot,st:s.st,wetT:T.wetTerr(s),nT:s.nT,done:T.allDone(s),tapsDone,rootT:r2(s.rootT),grid:s.grid[3].join("")}};
    out.seedTap=trial([[6,3,5]],40,true);out.seedNoTap=trial([[6,3,5]],40,false);out.pathSame=out.seedTap.path===out.seedNoTap.path;
    // only the first lift: the seed roots but the terrace stays dry, the stage doesn't finish; only the second: the terrace is wet, the seed is not rooted
    out.seedOnly6=trial([[6,3,5]],60,false);out.seedOnly3=trial([[3,3,5]],60,false);
    // both, in the order the auto uses: finishes
    {const s=S('water');g.toStage(s,1);let r,i=0;for(;i<3000&&!r;i++){const inp=miniBlankInp();s.t+=.05;g.auto(s,inp);r=g.step(s,.05,inp);if(s.st===2)break}out.seedBoth={st:s.st,root:s.seed&&s.seed.root,at:i*.05}}
    // nothing opened: the seed waits by the spring; the clay wears and it rides only when water moves
    out.seedIdle=trial([],20,true);for(const k of ['seedTap','seedNoTap','seedOnly6','seedOnly3','seedIdle'])delete out[k].path}
  {const g=MINI.water,T=g._t;
    const level=s=>[1,2,3].filter(y=>s.C[y][3]).length;
    const trial=(lifts,secs)=>{const s=S('water');g.toStage(s,2);const lv=[];let bad=0,prev=0,jump=0,fall=0,lvAtTerr=-1,boulder0=JSON.stringify(s.grid.map(r=>r.map(c=>c==="X"?1:0)));let moved=0,wetT=0,end=null;const tl=[];
      for(let i=0;i<secs/.05;i++){const inp=miniBlankInp();inp.b=true;for(const [x,y,ti] of lifts)if(i===ti)tapAt(x,y)(inp);s.t+=.05;const r=g.step(s,.05,inp);if(r)end=r;
        const L=level(s);if(L<prev)fall++;if(L-prev>1)jump++;if(lv[lv.length-1]!==L){lv.push(L);tl.push(r2(s.simT))}prev=L;if(lvAtTerr<0&&T.wetTerr(s)>0)lvAtTerr=L;
        if(JSON.stringify(s.grid.map(r=>r.map(c=>c==="X"?1:0)))!==boulder0)moved++;if(end)break}
      const green=s.tg[7].slice(0,5).every(x=>x>=.999);return {tl,green,lv,jump,fall,lvAtTerr,moved,terr:T.wetTerr(s),nT:s.nT,end,st:s.st,maxL:Math.max(...lv)}};
    const tapAt=(x,y)=>inp=>{inp.taps=[{x:T.cx(x),y:T.cy(y)}];inp.tap=inp.taps[0]};
    out.none=trial([],90);out.low=trial([[1,3,2]],90);out.high=trial([[1,1,2]],120);out.mid=trial([[1,2,2]],120)}
  return out})()""")
        # ---------------- Tune the Lute ----------------
        ot, rs = r["ot"], r["resp"]
        self.add("p33", "lute_fast_turn_overshoots", ot["slow"]["set"] and abs(ot["slow"]["T"] - 50) <= r["ZH"] and ot["fast"]["T"] > 50 + r["ZH"] + 12 and not ot["fast"]["set"] and rs[0] < rs[1] < rs[2] and rs[3] >= rs[2] - .02 and rs[2] > rs[0] * 2 and r["gains"][0] < r["gains"][1] < r["gains"][2],
                 f"same start (string at 20, note at 50) and the same {ot['total']} units of hand travel: a slow steady turn (30 units/s) settles at {ot['slow']['T']} and sets the string={ot['slow']['set']}; a fast one (420 units/s) sails on to {ot['fast']['T']} (clearly past the zone of +-{r['ZH']}) and doesn't set; tension gained per unit of hand travel at 30/100/300/900 units/s: {rs} (grows with speed); peg gain at 0/150/600 units/s: {r['gains']}")
        cp, cl, c1 = r["cpTight"], r["cpLoose"], r["cpOne"]
        self.add("p33", "lute_strings_coupled_in_II", all(abs(x - r["K"]) < .06 for x in cp["ratio"] + cl["ratio"]) and cp["d"] > 10 and cl["d"] < -10 and cp["others"][0] < 0 < cl["others"][0] and c1["others"] == [0, 0] and r["knock"]["before"] == [True] * 3 and r["knock"]["after"][1:] == [False, False] and not r["knock"]["after"][0] and r["two"]["st"] == 1 and r["two"]["set"] == [True, True, False] and r["almost"]["st"] == 1 and r["three"]["st"] == 2,
                 f"Stage II, k={r['K']}: tightening a string by {cp['d']} moved each other string by {cp['others']} (ratios {cp['ratio']}); loosening by {cl['d']} moved them by {cl['others']} (ratios {cl['ratio']}); Stage I, one live string: the other two moved by {c1['others']} when it turned {c1['d']}; three set strings, one tightened out of tune: set before {r['knock']['before']}, after {r['knock']['after']}; two set and the third not: still Stage II after 6 s ({r['two']}); the third tuned for 1.6 s, still not set ({r['almost']['st']}); then all three set at once: Stage III ({r['three']})")
        sn = r["snap"]
        self.add("p33", "lute_never_snaps", sn["ends"] == 0 and sn["maxT"] <= 100 and sn["minT"] >= 0 and sn["bad"] == 0 and sn["finite"] and sn["won"] > 0,
                 f"30 s of hard up and huge drags (+-5000 units per frame, mixed with taps and string changes) in each of the three stages, plus 30 s of holding up in Stage II: tension stayed within {sn['minT']}-{sn['maxT']}, 'end' returned {sn['ends']} times, {sn['bad']} broken values; afterwards the same game was tuned and won by auto at {sn['won']} s")
        ph, wr = r["ph"], r["wrong"]
        self.add("p33", "lute_phrase_in_III", ph["lens"][0] == 5 and ph["lens"][1] and ph["lens"][2] == 3 and ph["lit"] == ["10000", "11000", "11100", "11110", "11111"] and ph["res"] == "win" and ph["tries"] == 0 and wr["before"] == "11000" and wr["mid"]["tries"] == 1 and wr["mid"]["prog"] == 0 and wr["mid"]["ph"] == "again" and wr["lampsOut"] and wr["samePhrase"] and wr["res2"] == "win" and wr["ends"] == 0 and r["rate"] == [3, 3, 2, 2, 2, 2, 2, 1, 1],
                 f"phrase {ph['ph']}: {ph['lens'][0]} notes using {ph['lens'][2]} of the 3 strings; plucking them in order lights the lamps {ph['lit']} and the game returns {ph['res']}; a wrong third note (lamps {wr['before']} before it) set tries={wr['mid']['tries']}, progress back to {wr['mid']['prog']}, phase '{wr['mid']['ph']}', all lamps out after 4 s={wr['lampsOut']}, the same phrase sung again={wr['samePhrase']}, nothing ended ({wr['ends']}), and answering it right then won ({wr['res2']}); rate for (outT, tries) = (0,0) (5.9,0) (0,1) (3,2) (6,0) (17.9,0) (10,1) (18,0) (40,3): {r['rate']} (want 3,3,2,2,2,2,2,1,1)")
        # ---------------- Be Water ----------------
        self.add("p33", "water_bedrock_immovable", r["bed"]["same"] and r["bed"]["taps"] == r["bed"]["n"] > 0 and r["bed"]["lifted"] == 0 and r["bed"]["ch"] == "#" and r["stoneBefore"] == "o" and r["stoneAfter"] == "." and r["lifted"] == 1 and r["bedAfterStone"] == 0 and r["noBed"]["sts"] == [0, 1, 2] and r["noBed"]["won"] > 0 and r["noBed"]["taps"] == 0,
                 f"{r['bed']['n']} taps on five bedrock cells over 6 s: grid and water identical to an untouched run={r['bed']['same']}, bedrockTaps={r['bed']['taps']}, nothing lifted ({r['bed']['lifted']}); a tap on the loose stone turned '{r['stoneBefore']}' into '{r['stoneAfter']}' (lifted={r['lifted']}, bedrockTaps still {r['bedAfterStone']}); auto played all three stages {r['noBed']['sts']} to a win at {r['noBed']['won']} s with {r['noBed']['taps']} bedrock taps")
        cy = r["clay"]
        okc = all(cy[k]["names"] == ["clay_0", "clay_1", "clay_2"] and r["clayT"] - .01 <= cy[k]["sim"] <= r["clayT"] + .45 for k in cy)
        self.add("p33", "water_clay_wears_with_time", okc and cy["plain"]["real"] >= r["clayT"] - .1 and cy["fast"]["real"] < cy["plain"]["real"] * .6 and cy["taps"]["taps"] > 0 and cy["taps"]["real"] == cy["plain"]["real"] and cy["taps"]["sim"] == cy["plain"]["sim"] and r["dry"]["ct"] == 0 and r["dry"]["ch"] == "c" and not r["dry"]["wetBelow"] and r["clayLate"]["touching"] and r["clayLate"]["first"] > 2 and r["clayLate"]["gap"] <= 10,
                 f"clay beside the spring went clay_0, clay_1, clay_2 and opened at {cy['plain']['sim']} s of sim time (real {cy['plain']['real']} s, no taps; limit {r['clayT']} s); holding B opened it at {cy['fast']['sim']} s of sim time after only {cy['fast']['real']} s of real time; {cy['taps']['taps']} taps on the clay changed nothing (opened at {cy['taps']['sim']}); clay the water never reached: wear {r['dry']['ct']}, still '{r['dry']['ch']}' after 120 s; clay on the way down Stage I started to wear only when water was beside it ({r['clayLate']['first']} s in, touching={r['clayLate']['touching']})")
        st, sn_, so6, so3 = r["seedTap"], r["seedNoTap"], r["seedOnly6"], r["seedOnly3"]
        self.add("p33", "water_seed_moves_only_by_water", r["pathSame"] and st["tapsDone"] > 1000 and st["moves"] >= 8 and st["bad"] == 0 and st["root"] and st["rootedWrong"] == 0 and st["rootBeforeRoot"] == 0 and r["seedIdle"]["bad"] == 0 and r["seedIdle"]["tapsDone"] > 500 and r["seedIdle"]["moves"] >= 1 and not r["seedIdle"]["root"] and so6["root"] and not so6["done"] and so6["wetT"] == 0 and so6["st"] == 1 and not so3["root"] and so3["wetT"] == so3["nT"] and not so3["done"] and so3["st"] == 1 and r["seedBoth"]["st"] == 2,
                 f"{st['tapsDone']} taps on the seed and on open ground (never on a stone) left its path identical to an untouched run={r['pathSame']}; its {st['moves']} moves each went from a wet cell into a cell the water entered on that same tick ({st['bad']} that did not); it rooted on the bare field only ({st['rootedWrong']} elsewhere) and the field greened only after ({st['rootBeforeRoot']} before); with nothing opened it rode only as the water moved ({r['seedIdle']['moves']} moves, {r['seedIdle']['bad']} otherwise); only the far stone lifted: rooted={so6['root']}, terrace wet={so6['wetT']}/{so6['nT']}, stage done={so6['done']}; only the near stone lifted: rooted={so3['root']}, terrace wet={so3['wetT']}/{so3['nT']}, stage done={so3['done']}; both in order: Stage III at {r['seedBoth']['at']:.1f} s")
        lv = {k: r[k] for k in ("none", "low", "mid", "high")}
        self.add("p33", "water_level_rises_in_III", lv["none"]["lv"] == [0, 1, 2, 3] and all(v["jump"] == 0 and v["fall"] == 0 and v["moved"] == 0 for v in lv.values()) and lv["none"]["terr"] == 0 and not lv["none"]["green"] and lv["none"]["end"] is None and all(lv[k]["terr"] == lv[k]["nT"] and lv[k]["green"] and lv[k]["end"] == "win" for k in ("low", "mid", "high")) and [lv["low"]["lvAtTerr"], lv["mid"]["lvAtTerr"], lv["high"]["lvAtTerr"]] == [0, 1, 2],
                 f"no channel opened, 90 s: the pool rose {lv['none']['lv']} (rows full; at sim times {lv['none']['tl']} s), never skipping or falling, the boulder never moved, {lv['none']['terr']}/{lv['none']['nT']} lower terraces wet; lifting the bottom / middle / top channel stone: the water first reached the terraces with the pool at row-level {lv['low']['lvAtTerr']} / {lv['mid']['lvAtTerr']} / {lv['high']['lvAtTerr']} (levels seen {lv['low']['lv']} / {lv['mid']['lv']} / {lv['high']['lv']}), then all {lv['high']['nT']} terraces were wet and green and the stage ended in '{lv['high']['end']}'")
        await ctx.close()
        await self.p33c(b)

    async def p33c(self, b):
        """Phase 33C: the rule checks for The Tenzo's Kitchen and Butterfly Dream."""
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const out={};const S=id=>{const s={W:192,H:320,rm:false,t:0};MINI[id].init(s);return s};
  const r2=x=>+(+x).toFixed(2);
  /* ---------------- The Tenzo's Kitchen ---------------- */
  {const g=MINI.kitchen,T=g._t;
    const st=(s,f)=>{const inp=miniBlankInp();if(f)f(inp);s.t+=.05;return g.step(s,.05,inp)};
    const run=(s,sec,f)=>{let ends=0,win=0;for(let i=0;i<Math.round(sec/.05);i++){const r=st(s,inp=>f&&f(inp,i));if(r==='end')ends++;if(r==='win'){win++;break}}return {ends,win}};
    const drag=(s,path,v)=>{ /* press at path[0], move along the path at v units/s, let go */let ends=0;let p={x:path[0][0],y:path[0][1]};if(st(s,inp=>inp.down={x:p.x,y:p.y})==='end')ends++;
      for(let k=1;k<path.length;k++){const q=path[k];for(;;){const dx=q[0]-p.x,dy=q[1]-p.y,d=Math.hypot(dx,dy),m=Math.min(d,v*.05);p={x:p.x+(d?dx/d*m:0),y:p.y+(d?dy/d*m:0)};if(st(s,inp=>inp.down={x:p.x,y:p.y})==='end')ends++;if(d<=v*.05)break}}
      if(st(s)==='end')ends++;run(s,1.2);return ends};
    // ---- no lanterns: the game has none, and the result card says so
    out.k_nl={nofl:g.nofl===true,noFl:!g.fl&&!g.flNext&&!g.rate};
    __kitEnter('l3');await sleep(60);startMini('kitchen');MS.i=g.setup.length;miniAct('mbegin');miniWin();miniResult();await sleep(80);
    const card=document.querySelector('#mCard');out.k_nl.card=card.textContent.includes('No lanterns here. Just the doing.');out.k_nl.svgs=card.querySelectorAll('.mlanwrap svg').length;out.k_nl.res=MS.res&&MS.res.fl;closeMini();
    // ---- rushing never fails, and each kind of rushing costs a little and gains nothing
    const circle=(s,v,sec)=>{let a=0;return run(s,sec,inp=>{a+=v*.05/18;inp.down={x:T.BOWL.x+Math.cos(a)*18,y:T.BOWL.y-3+Math.sin(a)*13}})};
    let s=S('kitchen');const f1=circle(s,320,20);out.k_fast={att:r2(s.att),spill:s.spill,ph:s.ph,ends:f1.ends};
    s=S('kitchen');circle(s,4,8);out.k_slow={att:r2(s.att)};
    s=S('kitchen');const sd=circle(s,48,14);out.k_steady={ph:s.ph,ends:sd.ends};
    // sift: hurried taps lift nothing; gentle ones lift the grit
    s=S('kitchen');s.att=1;run(s,1.2);const g0=s.grit.map(q=>({x:q.x,y:q.y}));let i0=0;
    const hurry=run(s,6,(inp,i)=>{if(i%4===0){const q=s.grit.find(q=>!q.out&&!q.hop);const p=i===0?{x:T.SIEVE.x,y:T.SIEVE.y+60}:q?{x:q.x,y:q.y}:{x:0,y:0};inp.taps=[p];inp.tap=p}});
    out.k_sift={hurried:s.hurried,outAfterHurry:s.grit.filter(q=>q.out).length,ends:hurry.ends};
    const calm=run(s,12,(inp,i)=>{if(i%20===0){const q=s.grit.find(q=>!q.out&&!q.hop);if(q){inp.taps=[{x:q.x,y:q.y}];inp.tap=inp.taps[0]}}});
    out.k_sift.outAfterCalm=s.grit.filter(q=>q.out).length;out.k_sift.st=s.st;
    // mushrooms: a fast drag flips it back; a slow one lays it
    s=S('kitchen');g.toStage(s,1);let m=s.mush[0];const e1=drag(s,[[m.x,m.y],[T.SLOTS[0][0],T.SLOTS[0][1]]],320);out.k_mush={fastLaid:s.laid,back:!m.done&&Math.hypot(m.x-m.home[0],m.y-m.home[1])<.7,rushed:s.rushed,ends:e1};
    const e2=drag(s,[[m.x,m.y],[T.SLOTS[0][0],T.SLOTS[0][1]]],50);out.k_mush.slowLaid=s.laid;out.k_mush.ends+=e2;
    // chopping: a fast stroke or a wandering one cuts crooked and doesn't count; a slow straight one cuts
    s=S('kitchen');g.toStage(s,2);const X=T.CUTX[0],Y0=T.CUT0,L=T.CUTL;
    const e3=drag(s,[[X,Y0],[X,Y0+L+2]],300);const fastCut=s.cuts[0].done;
    const e4=drag(s,[[X,Y0],[X+9,Y0+L*.6],[X+9,Y0+L+2]],30);const wobCut=s.cuts[0].done;
    const e5=drag(s,[[X,Y0],[X,Y0+L+2]],30);out.k_chop={fastCut,wobCut,slowCut:s.cuts[0].done,crooked:s.crooked,ends:e3+e4+e5};
    // bowls: fast slides back, the wrong place slides back, its own place sets it
    s=S('kitchen');g.toStage(s,2);s.cuts.forEach(c=>{c.done=true;c.fall=1});run(s,1.5);const d=s.dish[1];
    const e6=drag(s,[[d.x,d.y],T.PLACE[1]],300);const fastSet=d.done;const e7=drag(s,[[d.x,d.y],T.PLACE[3]],50);const wrongSet=d.done;
    const e8=drag(s,[[d.x,d.y],T.PLACE[1]],50);out.k_bowl={ph:s.ph,fastSet,wrongSet,rightSet:d.done,ends:e6+e7+e8};
    // a whole game of rushing (fast circles, hurried taps, wild drags), then patience: never an 'end', and the meal still gets served
    s=S('kitchen');let seed=3;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};let ends=0,stg=new Set();
    for(let i=0;i<2400;i++){const inp=miniBlankInp();const a=i*.9;inp.down=rnd()<.85?{x:96+Math.cos(a)*60*rnd(),y:180+Math.sin(a)*60*rnd()}:null;if(rnd()<.3){const p={x:rnd()*192,y:rnd()*320};inp.taps=[p];inp.tap=p}
      inp.dx=Math.round(rnd()*2-1);inp.dy=Math.round(rnd()*2-1);s.t+=.05;const r=g.step(s,.05,inp);if(r==='end')ends++;stg.add(s.st);if(r==='win')break}
    let won=-1;for(let i=0;i<4000;i++){const inp=miniBlankInp();s.t+=.05;g.auto(s,inp);const r=g.step(s,.05,inp);if(r==='end')ends++;if(r==='win'){won=r2(s.t);break}}
    out.k_rush={ends,won,spill:s.spill,stages:[...stg]};
    // ---- three times of day: dawn, noon and evening backdrops
    const keep=window.mBg;const seen=[];window.mBg=function(c,id,i){if(id==='kitchen')seen.push(i);return keep.apply(this,arguments)};
    const cv=document.createElement('canvas');cv.width=384;cv.height=640;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);const bgs=[];
    for(let n=0;n<3;n++){s=S('kitchen');g.toStage(s,n);seen.length=0;g.draw(s,c,0);bgs.push([...new Set(seen)])}window.mBg=keep;
    out.k_day={bgs,stages:g.stages,n:(MINI_ART.kitchen&&MINI_ART.kitchen.bg||[]).length};
    // ---- the old tenzo speaks, in Stage II only, in order, pausing to speak
    const ks=window.miniSay,said=[];window.miniSay=function(t,d,w){said.push([t,w||'',S0.st,S0.laid,S0.tenzoT>0]);};const S0=S('kitchen');
    let won2=false;for(let i=0;i<4000;i++){const inp=miniBlankInp();S0.t+=.05;g.auto(S0,inp);if(g.step(S0,.05,inp)==='win'){won2=true;break}}window.miniSay=ks;
    out.k_tenzo={said,won:won2,lines:T.TENZO}}
  /* ---------------- Butterfly Dream ---------------- */
  {const g=MINI.butterfly,T=g._t;
    const st=(s,f)=>{const inp=miniBlankInp();if(f)f(inp);s.t+=.05;return g.step(s,.05,inp)};
    const run=(s,sec,f)=>{let ends=0,res=null;for(let i=0;i<Math.round(sec/.05);i++){const r=st(s,inp=>f&&f(inp,i));if(r==='end')ends++;if(r){res=r;break}}return {ends,res}};
    const at=(s,form,c,r)=>{s.form=form;s.x=T.cx(c);s.y=T.cy(r);s.rip=null};
    // ---- each form sees (and can pass) a different world
    const s0=S('butterfly');const P=(ch,lv)=>{s0.lever=lv;return ['wanderer','butterfly','fish'].map(f=>T.pass(f,ch,s0)?1:0).join('')};
    out.b_pass={h:P('h'),f:P('f'),B:P('B'),gap:P('_'),w:P('~'),Wshut:P('W',false),Wopen:P('W',true),o:P('o'),grass:P('.'),Gshut:P('G',false),Gopen:P('G',true)};
    const kp=window.mPiece,kt=window.mTile;let names=[];window.mPiece=function(c,id,n){names.push(n);return kp.apply(this,arguments)};window.mTile=function(c,l,n){names.push('tile:'+n);return kt.apply(this,arguments)};
    const cv=document.createElement('canvas');cv.width=384;cv.height=640;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);
    const look=(n,form)=>{const s=S('butterfly');g.toStage(s,n);at(s,form,4,2);names=[];c.clearRect(0,0,192,320);g.draw(s,c,1000);const d=c.getImageData(0,0,384,640).data;return {names:[...new Set(names)],d}};
    const a=look(0,'wanderer'),bb=look(0,'butterfly');let diff=0;for(let i=0;i<a.d.length;i+=16)if(Math.abs(a.d[i]-bb.d[i])+Math.abs(a.d[i+1]-bb.d[i+1])+Math.abs(a.d[i+2]-bb.d[i+2])>30)diff++;
    const a3=look(2,'wanderer'),b3=look(2,'butterfly');window.mPiece=kp;window.mTile=kt;
    const has=(L,p)=>L.some(n=>n.startsWith(p));
    out.b_see={diff:r2(diff/(a.d.length/16)),wBridge:has(a.names,'bridge_'),bBridge:has(bb.names,'bridge_'),wGust:has(a.names,'gust_'),bGust:has(bb.names,'gust_'),wPlank:a3.names.includes('tile:bridge_h'),bPlank:b3.names.includes('tile:bridge_h')};
    let s=S('butterfly');at(s,'wanderer',2,13);st(s,inp=>inp.bTap=true);out.b_see.rip=s.rip?{from:s.rip.from,to:s.rip.to,atPlayer:s.rip.x===s.x&&s.rip.y===s.y}:null;out.b_see.form=s.form;
    // ---- Stage II: switch in mid-air, over the stone; never over the open gap
    s=S('butterfly');g.toStage(s,1);at(s,'butterfly',2,10);const y0=s.y;st(s,inp=>inp.bTap=true);out.b_mid={overGap:s.form,refused:s.refused,yKept:s.y===y0};
    run(s,1);at(s,'butterfly',5,10);s.x=96;st(s,inp=>inp.bTap=true);out.b_mid.overStone=s.form;out.b_mid.drop=s.drop>0;out.b_mid.midair=s.midair;
    run(s,.5);run(s,2.5,inp=>inp.dx=-1);out.b_mid.stuckOnStone=s.x>=80;run(s,2.5,inp=>inp.dy=1);out.b_mid.stuckDown=s.y<=T.cy(10)+8;
    s.x=104;s.y=T.cy(10);run(s,.3,(inp,i)=>{if(i===1)inp.aTap=true});out.b_mid.lever=s.lever;out.b_mid.gateOpen=T.pass('wanderer','G',s);
    s=S('butterfly');g.toStage(s,1);at(s,'wanderer',5,8);run(s,3,inp=>inp.dy=1);out.b_mid.ledge=s.y<T.cy(9)-8;
    // ---- Stage III: the third form, the fish, only at the water
    s=S('butterfly');at(s,'butterfly',4,2);st(s,inp=>inp.bTap=true);out.b_fish={stageI:s.form};
    s=S('butterfly');g.toStage(s,2);at(s,'butterfly',2,13);st(s,inp=>inp.bTap=true);out.b_fish.dry=s.form;
    at(s,'butterfly',8,12);st(s,inp=>inp.bTap=true);out.b_fish.wet=s.form;out.b_fish.inWater=T.cell(s,s.x,s.y);
    // the fish swims up the river and under the plank bridge; the water gate holds it until the lever is pulled
    const cells=new Set();run(s,6,inp=>{inp.dy=-1;inp.dx=(T.cx(6)+8-s.x)/20;cells.add(T.cell(s,s.x,s.y))});out.b_fish.under=cells.has('B');out.b_fish.heldAt=r2(s.y);out.b_fish.belowGate=s.y>T.cy(5);
    s.lever=true;run(s,4,inp=>{inp.dy=-1;inp.dx=(T.cx(6)-s.x)/10});out.b_fish.inPond=T.cell(s,s.x,s.y)==='~'&&s.y<T.cy(5);
    st(s,inp=>inp.bTap=true);out.b_fish.emerged=s.form;out.b_fish.bank=T.cell(s,s.x,s.y);
    // the garden is reachable only through the water: every path the Wanderer and the butterfly can take, switching freely
    const reach=(fish)=>{const m=T.ROOMS[2].map,sx={lever:true},seen=new Set(),q=[[2,13,'wanderer']];const key=(x,y,f)=>x+','+y+','+f;seen.add(key(2,13,'wanderer'));let tree=false;
      while(q.length){const [x,y,f]=q.shift();if(m[y][x]==='T')tree=true;const nb=[[1,0],[-1,0],[0,1],[0,-1]];
        const push=(x2,y2,f2)=>{if(x2<0||y2<0||x2>11||y2>14)return;if(!T.pass(f2,m[y2][x2],sx))return;const k=key(x2,y2,f2);if(!seen.has(k)){seen.add(k);q.push([x2,y2,f2])}};
        for(const [dx,dy] of nb)push(x+dx,y+dy,f);
        for(const f2 of ['wanderer','butterfly'])if(f2!==f&&f!=='fish')push(x,y,f2);
        if(fish){if(f!=='fish')for(const [dx,dy] of nb)push(x+dx,y+dy,'fish');else for(const [dx,dy] of nb)push(x+dx,y+dy,'wanderer')}}
      return tree};
    out.b_fish.reachNoFish=reach(false);out.b_fish.reachFish=reach(true);
    // ---- at the old tree: both answers win
    const ask=(how)=>{const s=S('butterfly');g.toStage(s,2);at(s,'wanderer',5,3);s.y=T.cy(2)+6;const r0=run(s,.2);const asking=s.asking;
      const r=run(s,3,(inp,i)=>{if(i===12){if(how==='A')inp.aTap=true;else if(how==='B')inp.bTap=true;else{const a=T.ANS[how==='tapL'?0:1];inp.taps=[{x:a[0]+a[2]/2,y:a[1]+a[3]/2}];inp.tap=inp.taps[0]}}});
      return {asking,res:r.res,answer:s.answer,ends:r.ends+r0.ends}};
    out.b_ans={A:ask('A'),B:ask('B'),tapL:ask('tapL'),tapR:ask('tapR'),none:(()=>{const s=S('butterfly');g.toStage(s,2);at(s,'wanderer',5,3);s.y=T.cy(2)+6;const r=run(s,20);return {res:r.res,asking:s.asking}})()};
    out.b_rate=[0,.04,1,2.9,3.1,9].map(x=>{const s=S('butterfly');s.gustT=x;return g.rate(s)})}
  return out})()""")
        k = r
        nl = k["k_nl"]
        self.add("p33", "kitchen_no_lanterns", nl["nofl"] and nl["noFl"] and nl["card"] and nl["svgs"] == 0 and nl["res"] == 0,
                 f"nofl={nl['nofl']}, no lantern goals, hints or rate={nl['noFl']}; after a win the result card reads \"No lanterns here. Just the doing.\"={nl['card']}, lantern icons shown={nl['svgs']}, lanterns saved={nl['res']}")
        fa, sl, sd_, si, mu, ch, bo, ru = k["k_fast"], k["k_slow"], k["k_steady"], k["k_sift"], k["k_mush"], k["k_chop"], k["k_bowl"], k["k_rush"]
        ok = (fa["att"] < .05 and fa["spill"] > 0 and fa["ph"] == "stir" and sl["att"] == 0 and sd_["ph"] == "sift"
              and si["hurried"] > 0 and si["outAfterHurry"] == 0 and si["outAfterCalm"] == 5 and si["st"] == 1
              and mu["fastLaid"] == 0 and mu["back"] and mu["rushed"] == 1 and mu["slowLaid"] == 1
              and not ch["fastCut"] and not ch["wobCut"] and ch["slowCut"] and ch["crooked"] == 2
              and bo["ph"] == "bowls" and not bo["fastSet"] and not bo["wrongSet"] and bo["rightSet"]
              and ru["ends"] == 0 and ru["won"] > 0 and fa["ends"] + si["ends"] + mu["ends"] + ch["ends"] + bo["ends"] == 0)
        self.add("p33", "kitchen_rushing_never_fails", ok,
                 f"stirring at 320 units/s for 20 s: Attention {fa['att']}, {fa['spill']} grains splashed out, still stirring; at 4 units/s: Attention {sl['att']}; steady 48 units/s: on to '{sd_['ph']}'; "
                 f"sifting with hurried taps (5 a second): {si['hurried']} hurried, grit lifted {si['outAfterHurry']}, then calm taps a second apart lifted {si['outAfterCalm']}/5 and Stage II began={si['st']==1}; "
                 f"a mushroom dragged at 320 units/s: laid={mu['fastLaid']}, flipped back home={mu['back']}; at 50 units/s: laid={mu['slowLaid']}; a chop stroke at 300 units/s cut={ch['fastCut']}, a slow stroke wandering 9 units off its line cut={ch['wobCut']}, a slow straight one cut={ch['slowCut']} ({ch['crooked']} crooked pieces); "
                 f"a bowl dragged fast set={bo['fastSet']}, slowly to the wrong place set={bo['wrongSet']}, slowly to its own place set={bo['rightSet']}; 2 minutes of wild rushing through stages {ru['stages']} then patience: 'end' returned {ru['ends']} times, served at {ru['won']} s ({ru['spill']} grains spilled on the way)")
        dy = k["k_day"]
        self.add("p33", "kitchen_three_times_of_day", dy["bgs"] == [[0], [1], [2]] and dy["n"] == 3 and [x.split(":")[0] for x in dy["stages"]] == ["Dawn", "Noon", "Evening"],
                 f"backdrops drawn in Stages I/II/III: {dy['bgs']} (dawn kitchen, noon courtyard, evening kitchen; {dy['n']} in MINI_ART); stage names {dy['stages']}")
        tz = k["k_tenzo"]
        sd = tz["said"]
        ok = tz["won"] and [x[0] for x in sd] == tz["lines"] and all(x[1] == "The old tenzo" and x[2] == 1 and x[4] for x in sd) and [x[3] for x in sd] == [2, 4]
        self.add("p33", "kitchen_old_tenzo_speaks", ok,
                 f"a full game: the lines spoken during play {[(x[0], x[1], 'Stage ' + 'I' * (x[2] + 1), 'after ' + str(x[3]) + ' mushrooms', 'pausing to speak' if x[4] else 'working') for x in sd]} (want the old tenzo's two replies, in order, in Stage II only); the meal served={tz['won']}")
        bp, bs = k["b_pass"], k["b_see"]
        want = {"h": "010", "f": "011", "B": "101", "gap": "010", "w": "001", "Wshut": "000", "Wopen": "001", "o": "110", "grass": "110", "Gshut": "000", "Gopen": "110"}
        ok = bp == want and bs["diff"] > .1 and not bs["wBridge"] and bs["bBridge"] and not bs["wGust"] and bs["bGust"] and bs["wPlank"] and not bs["bPlank"] and bs["rip"] and bs["rip"]["from"] == "w" and bs["rip"]["to"] == "b" and bs["rip"]["atPlayer"] and bs["form"] == "butterfly"
        self.add("p33", "butterfly_forms_see_different_things", ok,
                 f"passable for Wanderer/butterfly/fish: {bp}; the same spot drawn as the Wanderer and as the butterfly differs in {bs['diff']*100:.0f}% of pixels; flower bridges drawn: Wanderer {bs['wBridge']}, butterfly {bs['bBridge']}; gust spirits: {bs['wGust']} / {bs['bGust']}; the plank bridge (Stage III): {bs['wPlank']} / {bs['bPlank']}; B starts a ripple {bs['rip']} from the player")
        bm = k["b_mid"]
        ok = bm["overGap"] == "butterfly" and bm["refused"] == 1 and bm["yKept"] and bm["overStone"] == "wanderer" and bm["drop"] and bm["midair"] == 1 and bm["stuckOnStone"] and bm["stuckDown"] and bm["lever"] and bm["gateOpen"] and bm["ledge"]
        self.add("p33", "butterfly_switch_midair", ok,
                 f"Stage II: B over the open gap is refused gently (still {bm['overGap']}, refused={bm['refused']}, no fall={bm['yKept']}); B over the stone: {bm['overStone']} drops onto it (drop={bm['drop']}, mid-air switches={bm['midair']}), can't walk off (left={bm['stuckOnStone']}, down={bm['stuckDown']}), pulls the lever={bm['lever']} and the gate opens={bm['gateOpen']}; the Wanderer can't step into the gap from the ledge={bm['ledge']}")
        bf = k["b_fish"]
        ok = bf["stageI"] == "wanderer" and bf["dry"] == "wanderer" and bf["wet"] == "fish" and bf["inWater"] == "~" and bf["under"] and bf["belowGate"] and bf["inPond"] and bf["emerged"] == "wanderer" and bf["bank"] in (".", "T") and not bf["reachNoFish"] and bf["reachFish"]
        self.add("p33", "butterfly_fish_in_III", ok,
                 f"B as the butterfly by the Stage I river gives the {bf['stageI']}; in Stage III away from water the {bf['dry']}, at the water the {bf['wet']} (in '{bf['inWater']}'); the fish swam under the plank bridge={bf['under']} and the shut water gate held it (y {bf['heldAt']}); with the lever pulled it reached the pond={bf['inPond']}; B there: the {bf['emerged']} steps out on the bank ('{bf['bank']}'); the old tree reachable by the Wanderer and butterfly alone={bf['reachNoFish']}, with the fish={bf['reachFish']}")
        ba = k["b_ans"]
        ok = all(ba[x]["asking"] and ba[x]["res"] == "win" and ba[x]["ends"] == 0 for x in ("A", "B", "tapL", "tapR")) and [ba[x]["answer"] for x in ("A", "B", "tapL", "tapR")] == ["wanderer", "butterfly", "wanderer", "butterfly"] and ba["none"]["res"] is None and ba["none"]["asking"] and k["b_rate"] == [3, 3, 2, 2, 1, 1]
        self.add("p33", "butterfly_both_answers_win", ok,
                 f"at the old tree the card asks; A, B, a tap on the left and on the right answer: {[(ba[x]['answer'], ba[x]['res']) for x in ('A', 'B', 'tapL', 'tapR')]}; with no answer for 20 s it just waits ({ba['none']}); lanterns for 0/0.04/1/2.9/3.1/9 s blown: {k['b_rate']} (want 3,3,2,2,1,1)")
        await ctx.close()

    # ---------------- PHASE 34B: Two Lights, One Window and Speakers' Corner ----------------
    async def p34(self, b):
        ids = ["lights", "corner", "web", "rule"]
        await self.mini_suite(b, "p34", ids)
        await self.hd_suite(b, "p34", ids)
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate(r"""(async()=>{const out={};const S=id=>{const s={W:192,H:320,rm:false,t:0};MINI[id].init(s);return s};
const r2=x=>+(+x).toFixed(2);
const g=MINI.lights,T=g._t,A=JSON.stringify;
const ENTG={c:3,r:0,dx:0,dy:1},ENTV={c:0,r:4,dx:1,dy:0};
const COMPX={amber:"blue",blue:"amber",rose:"green",green:"rose"};
const states=P=>{const n=P.mirs.length,L=[];for(let k=0;k<1<<n;k++){const m={};P.mirs.forEach((q,j)=>m[q[0]+","+q[1]]=(k>>j&1)?"\\":"/");L.push(m)}return L};
/* an independent tracer written from the rules: reflect cell by cell, stop at the edge or the altar; a pane tints the beam, the last pane passed wins */
const ref=(m,panes,e)=>{let c=e.c,r=e.r,dx=e.dx,dy=e.dy,tint=null,np=0;const cells=[];
  for(let n=0;n<60;n++){if(c<0||c>6||r<0||r>7)return {altar:false,tint,np,cells};
    cells.push(c+","+r);if(c===3&&r===7)return {altar:true,tint,np,cells};
    const k=c+","+r;if(panes[k]){np++;if(panes[k]!=="clear")tint=panes[k]}
    if(m[k]==="/"){const t=dx;dx=-dy;dy=-t}else if(m[k]==="\\"){const t=dx;dx=dy;dy=t}
    c+=dx;r+=dy}return {altar:false,tint,np,cells}};
const setP=(i)=>{const s=S("lights");g.toStage(s,i===0?0:1);T.loadPuz(s,i);return s};
const setM=(s,m)=>{s.mir.forEach(q=>{q.o=m[q.c+","+q.r]})};
const blank=()=>miniBlankInp();
const cv=document.createElement("canvas");cv.width=384;cv.height=640;const c2=cv.getContext("2d");c2.setTransform(2,0,0,2,0,0);
const glows=(s)=>{const L=[],og=window.glow;window.glow=function(c,x,y,r,col,a){L.push([x,y,r,a]);return og.apply(this,arguments)};try{g.draw(s,c2,1000)}finally{window.glow=og}return L};
/* ---------------- beams cross freely ---------------- */
{const X={puz:[]};
 for(let i=0;i<3;i++){const P=T.PUZ[i];let n=0,bad=0,crossStates=0,solvedCross=0,glowOk=0,glowBad=0,glowTried=0;
   for(const m of states(P)){const s=setP(i);setM(s,m);g.step(s,.05,blank());const ev=T.evalS(s),rg=ref(m,P.panes,ENTG),rv=ref(m,P.panes,ENTV);n++;
     const mine=x=>x.cells.map(q=>q.join(","));
     if(A(mine(ev.g))!==A(rg.cells)||A(mine(ev.v))!==A(rv.cells)||ev.g.altar!==rg.altar||ev.v.altar!==rv.altar||ev.g.tint!==rg.tint||ev.v.tint!==rv.tint)bad++;
     const cr=T.crossCells(ev);if(cr.length){crossStates++;
       if(ev.ok)solvedCross++;
       if(glowTried<6||ev.ok){glowTried++;const L=glows(s),want=cr.map(q=>[T.cx(q[0]),T.cy(q[1])]);
         const hit=want.every(w=>L.some(l=>Math.abs(l[0]-w[0])<.01&&Math.abs(l[1]-w[1])<.01&&l[2]===12&&l[3]>=.5));
         const extra=L.filter(l=>l[2]===12&&l[3]>=.5&&!want.some(w=>Math.abs(l[0]-w[0])<.01&&Math.abs(l[1]-w[1])<.01)).length;
         hit&&!extra?glowOk++:glowBad++}}}
   // the game solves it with the beams crossing
   let sol=null;for(const m of states(P)){const s=setP(i);setM(s,m);const ev=T.evalS(s);if(ev.ok&&T.crossCells(ev).length){sol=m;break}}
   let solved=null;if(sol){const s=setP(i);const c0=s.candles,start=s.mir.map(q=>q.o);let flips=0;
     for(const q of s.mir){if(q.o!==sol[q.c+","+q.r]){const inp=blank();inp.taps=[{x:T.cx(q.c),y:T.cy(q.r)}];inp.tap=inp.taps[0];s.t+=.05;g.step(s,.05,inp);flips++}}
     for(let k=0;k<40;k++){s.t+=.05;g.step(s,.05,blank())}
     solved={flips,turns:s.turns,candles:s.candles-c0,start:start.join("")}}
   X.puz.push({i,n,bad,crossStates,solvedCross,glowOk,glowBad,solved})}
 out.cross=X}
/* ---------------- white needs both ---------------- */
{const W={st2:[],cls:{one:0,untinted:0,same:0,noncomp:0,white:0,both:0},mism:0,n:0,altarGlowBad:0,altarGlowTried:0};
 for(const i of [1,2]){const P=T.PUZ[i];
   for(const m of states(P)){const s=setP(i);setM(s,m);g.step(s,.05,blank());const ev=s.ev,rg=ref(m,P.panes,ENTG),rv=ref(m,P.panes,ENTV);
     const want=rg.altar&&rv.altar&&!!rg.tint&&!!rv.tint&&COMPX[rg.tint]===rv.tint;W.n++;if(ev.ok!==want)W.mism++;
     if(rg.altar&&rv.altar){W.cls.both++;if(!rg.tint||!rv.tint)W.cls.untinted++;else if(rg.tint===rv.tint)W.cls.same++;else if(COMPX[rg.tint]!==rv.tint)W.cls.noncomp++;else W.cls.white++}
     else if(rg.altar||rv.altar)W.cls.one++;
     if(W.altarGlowTried<80||want){W.altarGlowTried++;const L=glows(s),white=L.some(l=>Math.abs(l[0]-97)<.01&&l[2]===40&&l[3]>0);if(white!==want)W.altarGlowBad++}}}
 // a beam takes the color of the last pane it passed, and passes straight through
 const P0={"3,2":"amber","3,5":"blue"},P1={"3,2":"blue","3,5":"amber"};const a=T.trace({},P0,ENTG),b=T.trace({},P1,ENTG);
 W.last={ab:a.tint,ba:b.tint,cells:a.cells.length,altar:a.altar};
 // every ordered pair of tints on a state where both beams arrive: white only for amber+blue and rose+green
 {const P=T.PUZ[1],keep=P.panes;let bad=0,ok=0,res=[],gc=null,vc=null,sol=null;
  try{for(const m of states(P)){const rg=ref(m,{},ENTG),rv=ref(m,{},ENTV);if(!(rg.altar&&rv.altar))continue;const fr=a=>a.cells.filter(k=>!(k in m)&&k!=="3,7");const g1=fr(rg).find(k=>!fr(rv).includes(k)),v1=fr(rv).find(k=>!fr(rg).includes(k));if(g1&&v1){sol=m;gc=g1;vc=v1;break}}
   const tints=["amber","blue","rose","green"];
   for(const a of tints)for(const b of tints){P.panes={[gc]:a,[vc]:b};const s=setP(1);setM(s,sol);g.step(s,.05,blank());const want=COMPX[a]===b;if(s.ev.ok!==want)bad++;if(s.ev.ok)ok++;res.push(a[0]+b[0]+(s.ev.ok?1:0))}
   P.panes={};{const s=setP(1);setM(s,sol);g.step(s,.05,blank());W.synNone=s.ev.ok}
   P.panes={[gc]:"amber"};{const s=setP(1);setM(s,sol);g.step(s,.05,blank());W.synOne=s.ev.ok}
   P.panes={[gc]:"amber",[vc]:"blue"};{const s=setP(1);setM(s,sol);g.step(s,.05,blank());W.synOk=s.ev.ok}
   W.syn={pairs:16,bad,ok,res:res.join(" "),gc,vc}}finally{P.panes=keep}}
 // Stage I: clear glass; a beam that passed no pane does not light it; two that each passed a pane do
 {const P=T.PUZ[0],C={ok:0,mism:0,onePane:0,noPane:0};
  for(const m of states(P)){const s=setP(0);setM(s,m);g.step(s,.05,blank());const rg=ref(m,P.panes,ENTG),rv=ref(m,P.panes,ENTV),want=rg.altar&&rv.altar&&rg.np>=1&&rv.np>=1;
    if(s.ev.ok!==want)C.mism++;if(want)C.ok++;if(rg.altar&&rv.altar&&!want)(rg.np>=1||rv.np>=1)?C.onePane++:C.noPane++}
  let sol=null;for(const m of states(P)){const rg=ref(m,P.panes,ENTG),rv=ref(m,P.panes,ENTV);if(rg.altar&&rv.altar&&rg.np>=1&&rv.np>=1){sol=m;break}}
  const s=setP(0);setM(s,sol);for(let k=0;k<30;k++){s.t+=.05;g.step(s,.05,blank())}C.candles=s.candles;C.st=s.st;W.s1=C}
 // game-level: Stage II never lights a candle for a wrong state
 {const P=T.PUZ[1];let lit=0,tried=0;for(const m of states(P)){const s=setP(1);setM(s,m);const c0=s.candles;const rg=ref(m,P.panes,ENTG),rv=ref(m,P.panes,ENTV);
    const want=rg.altar&&rv.altar&&!!rg.tint&&!!rv.tint&&COMPX[rg.tint]===rv.tint;if(want)continue;tried++;for(let k=0;k<30;k++){s.t+=.05;g.step(s,.05,blank())}if(s.candles>c0)lit++}W.wrongLit={tried,lit}}
 out.white=W}
/* ---------------- rose rings ---------------- */
{const R=T.RAD(),CEN=T.CEN,STEP=T.STEP,Z={};
 const mk=()=>{const s=S("lights");g.toStage(s,2);for(let i=0;i<30;i++){s.t+=.05;g.step(s,.05,blank())}return s};
 let s=mk();Z.ready={ph:s.ph,fade:r2(s.fade),st:s.st};
 const rot0=s.rot.slice();for(let i=0;i<100;i++){s.t+=.05;g.step(s,.05,blank())}Z.idle={same:A(s.rot)===A(rot0),ra:s.rot.every((r,k)=>Math.abs(s.ra[k]-r*STEP)<1e-6)};
 const drag=(s,k,steps,frac)=>{const r=(R[k]+R[k+1])/2,a0=-Math.PI/2,N=30,tot=steps*STEP*(frac||1);
   for(let j=0;j<=N;j++){const a=a0+tot*j/N,inp=blank();inp.down={x:CEN[0]+r*Math.cos(a),y:CEN[1]+r*Math.sin(a)};s.t+=.05;g.step(s,.05,inp)}
   s.t+=.05;g.step(s,.05,blank())};
 Z.drag=[];for(const [k,steps,frac] of [[0,3],[1,3],[2,3],[0,-2],[1,-2],[2,-2],[1,1,1.4],[0,1,.45]]){const s=mk(),b=s.rot.slice(),t0=s.turns;drag(s,k,steps,frac);
   const d=s.rot.map((r,i)=>((r-b[i]+24)%16)-8+ -0);const dd=s.rot.map((r,i)=>{let x=((r-b[i])%16+16)%16;if(x>8)x-=16;return x});
   Z.drag.push({k,steps,frac:frac||1,d:dd,turns:s.turns-t0,whole:s.rot.every(Number.isInteger)})}
 // keys: left/right picks the ring, up/down (or A / B) turns it
 {const s=mk(),log=[];const press=(f)=>{const b=s.rot.slice(),t0=s.turns,sel0=s.sel,inp=blank();f(inp);s.t+=.05;g.step(s,.05,inp);log.push({sel:s.sel,sel0,d:s.rot.map((r,i)=>{let x=((r-b[i])%16+16)%16;if(x>8)x-=16;return x}),turns:s.turns-t0})};
  press(i=>i.lTap=true);press(i=>i.uTap=true);press(i=>i.aTap=true);press(i=>i.dTap=true);press(i=>i.bTap=true);press(i=>i.rTap=true);press(i=>i.uTap=true);press(i=>{i.dy=-1;i.uTap=true});
  Z.keys=log}
 // each beam reaches the heart only when every ring has an opening across its line
 {let n=0,bad=0,seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};const cnt={both:0,gold:0,silver:0,none:0};const s=mk();
  const refPass=(k,rot,pos)=>T.OPEN[k].some(o=>(o+rot)%16===pos);
  for(let q=0;q<400;q++){s.rot=[0,1,2].map(()=>Math.floor(rnd()*16));const st=T.ringStops(s);n++;
    const gOk=[0,1,2].every(k=>refPass(k,s.rot[k],T.GPOS)),vOk=[0,1,2].every(k=>refPass(k,s.rot[k],T.SPOS));
    let gs=-1,vs=-1;for(let k=2;k>=0;k--){if(gs<0&&!refPass(k,s.rot[k],T.GPOS))gs=k;if(vs<0&&!refPass(k,s.rot[k],T.SPOS))vs=k}
    if((st.g<0)!==gOk||(st.v<0)!==vOk||st.g!==gs||st.v!==vs)bad++;cnt[gOk&&vOk?"both":gOk?"gold":vOk?"silver":"none"]++}
  Z.rays={n,bad,cnt}}
 // aligned: the window lights and the game returns "win"; one beam through is not enough
 {const s=mk();const al=[0,1,2].map(k=>{for(let a=0;a<16;a++)if(T.aligned(k,a))return a});s.rot=al;let res=null,t=0;for(let i=0;i<120&&!res;i++){s.t+=.05;res=g.step(s,.05,blank());t+=.05}
  Z.win={res,t:r2(t),ph:s.ph};
  const s2=mk();const k=0,a1=[0,1,2].map(k=>{for(let a=0;a<16;a++)if(T.aligned(k,a))return a});let a2=[...a1];for(let a=0;a<16;a++)if(!T.aligned(2,a)){a2[2]=a;break}
  s2.rot=a2;let r2_=null;for(let i=0;i<200&&!r2_;i++){s2.t+=.05;r2_=g.step(s2,.05,blank())}Z.notYet={res:r2_,ph:s2.ph,stops:T.ringStops(s2)}}
 // rate and minTurns
 {const m=40;Z.rate=[0,2,3,8,9].map(d=>g.rate({turns:m+d,minTurns:m}));
  const s=S("lights");Z.min={sum:T.minMirror(0)+T.minMirror(1)+T.minMirror(2)+T.minRings(s.rot),minTurns:s.minTurns,parts:[0,1,2].map(i=>T.minMirror(i)),rings:T.minRings(s.rot)}}
 // the planner wins with the fewest turns
 {const s=S("lights");let res=null,i=0;for(;i<4000&&!res;i++){const inp=blank();s.t+=.05;g.auto(s,inp);res=g.step(s,.05,inp);if(res==="end")break}Z.auto={res,t:r2(s.t),turns:s.turns,minTurns:s.minTurns,rate:g.rate(s),candles:s.candles}}
 out.rings=Z}
return out})()""")
        await ctx.close()
        # ---------------- Two Lights, One Window ----------------
        cr = r["cross"]["puz"]
        ok = all(p["n"] == 64 and p["bad"] == 0 and p["crossStates"] > 0 and p["solvedCross"] >= 1 and p["glowOk"] > 0 and p["glowBad"] == 0 and p["solved"] and p["solved"]["candles"] == 1 and p["solved"]["turns"] == p["solved"]["flips"] > 0 for p in cr)
        self.add("p34", "lights_beams_cross_freely", ok,
                 "; ".join(f"puzzle {p['i']+1}: in all {p['n']} mirror states each beam's path (cells, color, arrival) equals an independent trace with the other beam removed ({p['bad']} differ); beams cross in {p['crossStates']} states, {p['solvedCross']} solution(s) among them; the crossing cells were drawn with the brighter glow in {p['glowOk']} of {p['glowOk']+p['glowBad']} sampled draws (and nowhere else); solving it with the beams crossing took {p['solved']['flips']} taps = {p['solved']['turns']} turns and lit {p['solved']['candles']} candle" for p in cr))
        w = r["white"]
        okw = (w["n"] == 128 and w["mism"] == 0 and w["altarGlowBad"] == 0 and all(w["cls"][k] > 0 for k in ("one", "untinted", "noncomp", "white")) and w["syn"]["bad"] == 0 and w["syn"]["ok"] == 4 and not w["synNone"] and not w["synOne"] and w["synOk"]
               and w["last"]["ab"] == "blue" and w["last"]["ba"] == "amber" and w["last"]["cells"] == 8 and w["last"]["altar"] and w["s1"]["mism"] == 0 and w["s1"]["ok"] > 0 and w["s1"]["candles"] == 1 and w["s1"]["onePane"] > 0 and w["wrongLit"]["lit"] == 0 and w["wrongLit"]["tried"] > 0)
        self.add("p34", "lights_white_needs_both", okw,
                 f"Stage II, all {w['n']} mirror states of both puzzles: the altar lit exactly when an independent reading of the rules says white ({w['mism']} differ): both beams arrive with tints that complete each other (amber+blue, rose+green); of the {w['cls']['both']} states where both arrive, {w['cls']['white']} are white and {w['cls']['untinted']} untinted, {w['cls']['noncomp']} a non-completing pair, and in {w['cls']['one']} only one beam arrives: none of those lit it; the white glow was drawn only for white ({w['altarGlowBad']} wrong of {w['altarGlowTried']} draws); all 16 ordered pairs of tints on one state lit only {w['syn']['ok']} ({w['syn']['res']}), so the same tint twice never does; no pane and one tinted pane: {w['synNone']}/{w['synOne']}; a beam's tint is the last pane it passed (amber then blue gives {w['last']['ab']}, blue then amber {w['last']['ba']}, all {w['last']['cells']} cells still traced); {w['wrongLit']['tried']} wrong states held for 1.5 s lit {w['wrongLit']['lit']} candles; Stage I (clear glass): lit only when both beams passed a pane ({w['s1']['mism']} differ; {w['s1']['onePane']} one-pane states stayed dark) and the solution lit the first candle (candles={w['s1']['candles']})")
        z = r["rings"]
        dr = z["drag"]
        okd = all(d["d"][d["k"]] == (d["steps"] if d["frac"] == 1 or d["frac"] > 1 else 0) and sum(abs(x) for i, x in enumerate(d["d"]) if i != d["k"]) == 0 and d["turns"] == abs(d["d"][d["k"]]) and d["whole"] for d in dr)
        kk = z["keys"]
        okk = (kk[0]["sel"] == 1 and kk[0]["turns"] == 0 and kk[1]["d"] == [0, 1, 0] and kk[2]["d"] == [0, 1, 0] and kk[3]["d"] == [0, -1, 0] and kk[4]["d"] == [0, -1, 0] and kk[5]["sel"] == 2 and kk[5]["turns"] == 0 and kk[6]["d"] == [0, 0, 1] and kk[7]["d"] == [0, 0, 1] and all(k["turns"] <= 1 for k in kk))
        okz = (z["ready"]["ph"] == "play" and z["idle"]["same"] and z["idle"]["ra"] and okd and okk and z["rays"]["bad"] == 0 and all(v > 0 for v in z["rays"]["cnt"].values()) and z["win"]["res"] == "win" and z["notYet"]["res"] is None and z["notYet"]["ph"] == "play" and z["rate"] == [3, 3, 2, 2, 1]
               and z["min"]["sum"] == z["min"]["minTurns"] and z["auto"]["res"] == "win" and z["auto"]["turns"] == z["auto"]["minTurns"] and z["auto"]["rate"] == 3)
        self.add("p34", "lights_rose_rings_turn", okz,
                 f"Stage III: 5 s with no input left the three rings where they were (drawn angles settled on whole steps: {z['idle']['ra']}); dragging ring 0/1/2 by +3 and -2 steps turned only that ring by exactly that many whole 22.5-degree steps ({[ (d['k'], d['steps'], d['d'], d['turns']) for d in dr ]}; a drag of 1.4 steps turned 1, of 0.45 steps turned none); keys: left picked ring {kk[0]['sel']}, up/A turned it +1, down/B -1, right picked ring {kk[5]['sel']} and up turned that one: {[k['d'] for k in kk]}; over {z['rays']['n']} random ring positions a beam reached the heart exactly when every ring had an opening across its line ({z['rays']['bad']} differ; cases both/gold only/silver only/neither = {z['rays']['cnt']}); all aligned: the window lit and the game returned {z['win']['res']!r} after {z['win']['t']} s; with one beam still blocked (stops {z['notYet']['stops']}) it kept waiting (phase {z['notYet']['ph']}); rate for minTurns+0/2/3/8/9 = {z['rate']} (want 3,3,2,2,1); minTurns {z['min']['minTurns']} = per-puzzle minimums {z['min']['parts']} + {z['min']['rings']} ring steps = {z['min']['sum']}; auto won at {z['auto']['t']} s in {z['auto']['turns']} turns (fewest {z['auto']['minTurns']}), rate {z['auto']['rate']}, {z['auto']['candles']} candles")
        # ---------------- Speakers' Corner ----------------
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate(r"""(async()=>{const out={};const S=id=>{const s={W:192,H:320,rm:false,t:0};MINI[id].init(s);return s};
const r2=x=>+(+x).toFixed(2);const g=MINI.corner,T=g._t;let ENDS=0;
const blank=()=>miniBlankInp();
const st1=(s,inp)=>{s.t+=.05;const r=g.step(s,.05,inp||blank());if(r==="end")ENDS++;return r};
const run=(s,sec,f)=>{let res=null;for(let i=0;i<Math.round(sec/.05);i++){const inp=blank();if(f)f(s,inp);const r=st1(s,inp);if(r){res=r;break}}return res};
const tapAt=(s,x,y)=>{const inp=blank();inp.taps=[{x,y}];inp.tap=inp.taps[0];return st1(s,inp)};
const ent=(s,f)=>T.entries(s).find(f);
const spk=(s,i)=>ent(s,e=>e.k==="spk"&&e.i===i);
const doer=s=>ent(s,e=>e.k==="doer");
const untilH=(s,max,k)=>{for(let i=0;i<max/.05;i++){if(s.h&&(!k||s.h.k===k))return true;st1(s)}return false};
const stopWarn=(s,inp)=>{if(s.h&&s.h.d.a>=.5){const e=doer(s);if(e){inp.taps=[{x:e.x,y:e.y}];inp.tap=inp.taps[0]}}};
const fresh=(st)=>{const s=S("corner");g.toStage(s,st);return s};
/* ---------------- offense is not harm ---------------- */
{const A={sp:[],rec:{},warn:[],lifeS:[],gaps:[]};
 for(const st of [0,1,2])for(let i=0;i<5;i++){const s=fresh(st);run(s,.5);const seq=[],stp=[];
   for(let k=0;k<6;k++){const e=spk(s,i);tapAt(s,e.x,e.y);seq.push(s.lamp);stp.push(s.stopped)}
   A.sp.push({st,i,seq:seq.join(""),stopped:s.stopped,dimmed:s.dimmed,st2:s.st})}
 // the lamp relights one notch every 10 s (the clock restarts at each dim)
 {const s=fresh(0);run(s,.5);let e=spk(s,0);tapAt(s,e.x,e.y);const a=[s.lamp];run(s,9.8);a.push(s.lamp);run(s,.3);a.push(s.lamp);
  const s2=fresh(0);run(s2,.5);e=spk(s2,0);tapAt(s2,e.x,e.y);run(s2,6);e=spk(s2,1);tapAt(s2,e.x,e.y);const b=[s2.lamp];run(s2,9.8);b.push(s2.lamp);run(s2,.3);b.push(s2.lamp);run(s2,10.1);b.push(s2.lamp);
  A.relight={a,b}}
 // a doer is stopped during the warning (a stop, +1); the lamp is untouched
 {const s=fresh(0);const ok=untilH(s,6);const kind=s.h&&s.h.k;run(s,.4);const e=doer(s),b=[s.stopped,s.lamp,s.dimmed,!!s.h];tapAt(s,e.x,e.y);const af=[s.stopped,s.lamp,s.dimmed,!!s.h];
  run(s,.3);const e2=ent(s,q=>q.d&&q.d.st==="stop");tapAt(s,e2.x,e2.y);A.warn={ok,kind,b,af,again:[s.stopped,s.lamp,s.dimmed]}}
 // the whole of Stage I: stop each harm in its warning: kinds, spacing, 2 s warning
 {const s=fresh(0);const kinds=[],starts=[],lens=[];let cur=null,t0=0;
  for(let i=0;i<700&&s.st===0;i++){const inp=blank();if(s.h&&s.h!==cur){cur=s.h;kinds.push(s.h.k);starts.push(r2(s.stT));t0=s.stT}stopWarn(s,inp);const hh=s.h;st1(s,inp);if(hh&&!s.h)lens.push(r2(s.stT-t0))}
  A.s1={kinds,starts,gaps:starts.slice(1).map((x,i)=>r2(x-starts[i])),stopped:s.stopped,st:s.st,lamp:s.lamp,dimmed:s.dimmed}}
 // ignored harms: s.h lasts 2 s, then the harm happens (no stop); tapping the doer afterwards does nothing
 {const s=fresh(0);const dur=[];let t0=null;const nothing=[];
  for(let i=0;i<500&&dur.length<5;i++){const was=!!s.h;if(s.h&&t0===null)t0=s.stT;st1(s);if(was&&!s.h){dur.push(r2(s.stT-t0));t0=null;
      const d=s.dr.find(x=>x.st==="hit");if(d){const e=ent(s,q=>q.d===d);const b=[s.stopped,s.lamp,s.dimmed];tapAt(s,e.x,e.y);nothing.push([d.k,A2(b,[s.stopped,s.lamp,s.dimmed])])}}}
  function A2(a,b){return a.join()===b.join()}
  A.ign={dur,nothing,stopped:s.stopped,t:r2(s.stT)}}
 // a tap on a crowd member, the constable, or empty ground does nothing at all
 {const s=fresh(0);run(s,.3);const b=[s.stopped,s.lamp,s.dimmed];const pts=[];const cm=ent(s,e=>e.k==="x"&&e.crowd&&e.i===1);pts.push([cm.x,cm.y]);const cs=ent(s,e=>e.k==="x"&&!e.crowd&&!e.d);pts.push([cs.x,cs.y],[150,70],[180,300],[5,5]);
  for(const p of pts)tapAt(s,p[0],p[1]);A.idle={same:A2(b,[s.stopped,s.lamp,s.dimmed]),n:pts.length}}
 // Stage II: silencing the unpopular speaker: no stop, the lamp dims, the pending harm is dropped
 {const s=fresh(1);untilH(s,6);const h0=!!s.h,k=s.h&&s.h.k;run(s,.4);const e=spk(s,2);tapAt(s,e.x,e.y);A.unpop={h0,k,h:!!s.h,stopped:s.stopped,lamp:s.lamp,dimmed:s.dimmed,cheer:s.cheer>0}}
 out.off=A}
/* ---------------- context matters ---------------- */
{const C={};
 const toDoor=(s)=>{let ph=[];for(let i=0;i<700&&!(s.h&&s.h.k==="door");i++){if(s.mb&&!ph.includes(s.mb.ph))ph.push(s.mb.ph);st1(s)}return ph};
 {const s=fresh(2);run(s,1);const e=spk(s,4);const b=[s.stopped,s.lamp];tapAt(s,e.x,e.y);C.square={before:b,after:[s.stopped,s.lamp,s.dimmed],k:e.k};
  const m=ent(s,q=>q.k==="x"&&q.crowd&&q.i===1);const b2=[s.stopped,s.lamp];tapAt(s,m.x,m.y);C.mobEarly={before:b2,after:[s.stopped,s.lamp]}
  // the march: he is still a speaker (a tap is silencing)
  for(let i=0;i<400&&!(s.mb&&s.mb.ph==="march");i++)st1(s);run(s,1);const e3=spk(s,4);const b3=[s.stopped,s.lamp,s.dimmed];tapAt(s,e3.x,e3.y);C.march={k:e3&&e3.k,before:b3,after:[s.stopped,s.lamp,s.dimmed]}}
 const trial=(who)=>{const s=fresh(2);const ph=toDoor(s);const b=[s.stopped,s.lamp,s.dimmed];const doers=T.entries(s).filter(e=>e.k==="doer").map(e=>e.i);const warnK=s.h&&s.h.k;
   if(who==="leader"){const e=doer(s);tapAt(s,e.x,e.y)}else if(who==="mob"){const e=ent(s,q=>q.k==="doer"&&q.crowd&&q.i===2);tapAt(s,e.x,e.y)}
   const a=[s.stopped,s.lamp,s.dimmed,!!s.h,s.doorStopped,s.mb&&s.mb.ph];run(s,5);const f=[s.stopped,s.lamp,s.dimmed,s.doorStopped,!!s.mb,s.st,s.wait>0||s.again>0];return {ph,warnK,doers,b,a,f}};
 C.leader=trial("leader");C.mob=trial("mob");C.alone=trial("none");
 // after the warning ran out, he is a speaker again (silencing)
 {const s=fresh(2);toDoor(s);run(s,2.1);const e=spk(s,4);const b=[s.stopped,s.lamp];tapAt(s,e.x,e.y);C.after={k:e&&e.k,before:b,after:[s.stopped,s.lamp],ph:s.mb&&s.mb.ph}}
 out.ctx=C}
/* ---------------- targets are big ---------------- */
{const B={min:[1e9,1e9],n:0,tappable:0,byStage:[0,0,0],kinds:{},sizes:{}};
 const s=S("corner");let res=null;const seen=new Set();
 for(let i=0;i<4000&&!res;i++){const inp=blank();g.auto(s,inp);if(s.h)seen.add(s.st+":"+s.h.k);for(const e of T.entries(s)){B.n++;B.min[0]=Math.min(B.min[0],e.w);B.min[1]=Math.min(B.min[1],e.h);if(e.k!=="x"){B.tappable++;B.byStage[s.st]++}}res=st1(s,inp)}
 B.res=res;B.seen=[...seen];
 const edge=(st,mk)=>{const s=fresh(st);untilH(s,8);run(s,.4);const e=doer(s);const hw=e.w/2,hh=e.h/2;const pts=[[-1,0],[1,0],[0,-1],[0,1],[1,1],[-1,-1],[1,-1],[-1,1]];const r=[];
   for(const p of pts){const s2=fresh(st);untilH(s2,8);run(s2,.4);const e2=doer(s2);tapAt(s2,e2.x+p[0]*hw,e2.y+p[1]*hh);r.push(s2.stopped)}
   const s3=fresh(st);untilH(s3,8);run(s3,.4);const e3=doer(s3);tapAt(s3,e3.x+hw+.4,e3.y);return {w:e.w,h:e.h,stops:r,outside:s3.stopped}};
 B.edge=[0,1,2].map(st=>edge(st));
 const sp=[];for(const i of [0,1,2]){const r=[];for(const p of [[-1,0],[1,0],[0,-1],[0,1],[1,1],[-1,-1]]){const s=fresh(0);run(s,.3);const e=spk(s,i);tapAt(s,e.x+p[0]*e.w/2,e.y+p[1]*e.h/2);r.push(s.lamp)}sp.push({i,lamp:r})}B.spkEdge=sp;
 out.big=B}
/* ---------------- stages repeat ---------------- */
{const D={};const lastEnds=()=>ENDS;
 // a stage with no stops: the again line, the same stage again, stops and lamp back
 {const s=fresh(0);const e0=ENDS;let t=0,i=0;for(;i<1500&&!s.again;i++)st1(s);t=s.t;const a={again:s.again,st:s.st,wait:r2(s.wait),stopped:s.stopped,lamp:s.lamp};run(s,2.6);D.none={a,after:{st:s.st,stT:r2(s.stT),qi:s.qi,stopped:s.stopped,lamp:s.lamp,h:!!s.h,drs:s.dr.length},t:r2(t),ends:ENDS-e0}}
 // too few stops (1 of 5): repeats; stops back to what they were at the stage's start
 {const s=fresh(0);let stopped1=false;for(let i=0;i<1500&&!s.again;i++){const inp=blank();if(!stopped1&&s.h&&s.h.d.a>=.5){stopWarn(s,inp);stopped1=true}st1(s,inp)}const a={again:s.again,st:s.st,stopped:s.stopped};run(s,2.6);D.one={a,after:{st:s.st,stopped:s.stopped,lamp:s.lamp}}}
 // the lamp below 3 at the stage's end: repeats even with every harm stopped
 {const s=fresh(0);let dims=0;for(let i=0;i<1500&&!s.again&&s.st===0;i++){const inp=blank();stopWarn(s,inp);if(s.stT>31.5&&dims<3&&s.qi>=5){const e=spk(s,dims);inp.taps=[{x:e.x,y:e.y}];dims++}st1(s,inp)}
  const a={again:s.again,st:s.st,stopped:s.stopped,lamp:s.lamp,dims};run(s,2.6);D.low={a,after:{st:s.st,stopped:s.stopped,lamp:s.lamp}}}
 // exactly 3 notches and every harm stopped: passes
 {const s=fresh(0);let dims=0;for(let i=0;i<1500&&s.st===0&&!s.again;i++){const inp=blank();stopWarn(s,inp);if(s.stT>31.5&&dims<2&&s.qi>=5){const e=spk(s,dims);inp.taps=[{x:e.x,y:e.y}];dims++}st1(s,inp)}D.three={again:s.again,st:s.st,stopped:s.stopped,lamp:s.lamp,dims}}
 // two stops of five, no dimming: passes (2 + 2 + 2 = 6)
 {const s=fresh(0);let n=0;for(let i=0;i<1500&&s.st===0&&!s.again;i++){const inp=blank();if(n<2)stopWarn(s,inp);if(inp.taps&&inp.taps.length)n++;st1(s,inp)}D.two={again:s.again,st:s.st,stopped:s.stopped,n}}
 // Stage III: two stops that do not include the door do not pass; the door and one more do
 {const s=fresh(2);let n=0;for(let i=0;i<1500&&!s.again&&s.st===2;i++){const inp=blank();if(s.h&&s.h.k!=="door"&&n<2)stopWarn(s,inp);if(inp.taps&&inp.taps.length)n++;st1(s,inp)}D.noDoor={again:s.again,st:s.st,stopped:s.stopped,doorStopped:s.doorStopped};run(s,2.6);D.noDoor.after={st:s.st,stopped:s.stopped,qi:s.qi};
  const s2=fresh(2);let res=null,m=0;for(let i=0;i<1500&&!res&&!s2.again;i++){const inp=blank();if(s2.h&&(s2.h.k==="door"||m<1))stopWarn(s2,inp);if(inp.taps&&inp.taps.length)m++;res=st1(s2,inp)}D.door={res,again:s2.again,stopped:s2.stopped,doorStopped:s2.doorStopped}}
 // all three stages with auto: a win, 3 lanterns' worth, never "end"
 {const s=S("corner");const e0=ENDS;const sts=[];let res=null;for(let i=0;i<4000&&!res;i++){const inp=blank();g.auto(s,inp);if(!sts.length||sts[sts.length-1]!==s.st)sts.push(s.st);res=st1(s,inp)}D.auto={res,t:r2(s.t),sts,stopped:s.stopped,lamp:s.lamp,dimmed:s.dimmed,rate:g.rate(s),again:s.again,ends:ENDS-e0}}
 // the lanterns
 D.rate=[{stopped:10,dimmed:0,lamp:5},{stopped:12,dimmed:0,lamp:5},{stopped:10,dimmed:1,lamp:4},{stopped:10,dimmed:1,lamp:3},{stopped:8,dimmed:3,lamp:4},{stopped:8,dimmed:3,lamp:3},{stopped:9,dimmed:0,lamp:5},{stopped:6,dimmed:0,lamp:5},{stopped:9,dimmed:2,lamp:4}].map(x=>g.rate(x));
 D.text={again:g.again,lines:g.lines,stages:g.stages,pad:g.pad,ab:g.ab,limit:g.limit};D.ends=ENDS;
 out.rep=D}
return out})()""")
        await ctx.close()
        o = r["off"]
        okp = (len(o["sp"]) == 15 and all(x["seq"] == "432100" and x["stopped"] == 0 and x["dimmed"] == 6 and x["st2"] == x["st"] for x in o["sp"]) and o["relight"]["a"] == [4, 4, 5] and o["relight"]["b"] == [3, 3, 4, 5]
               and o["warn"]["ok"] and o["warn"]["b"] == [0, 5, 0, True] and o["warn"]["af"] == [1, 5, 0, False] and o["warn"]["again"] == [1, 5, 0]
               and o["s1"]["kinds"] == ["stone", "purse", "shove", "stone", "purse"] and o["s1"]["stopped"] == 5 and o["s1"]["dimmed"] == 0 and all(6 <= g <= 9 for g in o["s1"]["gaps"])
               and len(o["ign"]["dur"]) == 3 and all(1.85 <= d <= 2.1 for d in o["ign"]["dur"]) and all(n[1] for n in o["ign"]["nothing"]) and o["ign"]["stopped"] == 0 and o["idle"]["same"]
               and o["unpop"]["h0"] and not o["unpop"]["h"] and o["unpop"]["stopped"] == 0 and o["unpop"]["lamp"] == 4 and o["unpop"]["dimmed"] == 1 and o["unpop"]["cheer"])
        self.add("p34", "corner_offense_is_not_harm", okp,
                 f"every speaker in every stage (15 cases, including the unpopular speaker in II and the corn speaker in III) tapped 6 times in a row: stopped stayed 0 and the lamp read {o['sp'][0]['seq']} (one notch each, never below 0), dimmed counted all 6; the lamp relit one notch after 10 s ({o['relight']['a']}) and the clock restarted at each dim ({o['relight']['b']}: dim, dim 6 s later, then +1 only 10 s after the second); a {o['warn']['kind']} doer tapped during its warning: (stopped, lamp, dimmed, warning) {o['warn']['b']} -> {o['warn']['af']}, and tapping the slinking doer again changed nothing {o['warn']['again']}; Stage I stopped on the warning: harms {o['s1']['kinds']} starting at {o['s1']['gaps']} s apart, stopped {o['s1']['stopped']}, lamp {o['s1']['lamp']}, dimmed {o['s1']['dimmed']}; with no taps each warning lasted {o['ign']['dur']} s, then the harm happened and tapping the doer did nothing ({[n[0] for n in o['ign']['nothing']]}), stopped {o['ign']['stopped']}; a crowd member, the constable and empty ground do nothing ({o['idle']['n']} taps); Stage II: silencing the unpopular speaker during a {o['unpop']['k']} warning dropped it (warning {o['unpop']['h0']} -> {o['unpop']['h']}), stopped {o['unpop']['stopped']}, lamp {o['unpop']['lamp']}, the crowd cheered={o['unpop']['cheer']}")
        c = r["ctx"]
        dd = lambda t: sorted(t["doers"]) == [0, 1, 2, 3, 4]
        okc = (c["square"]["k"] == "spk" and c["square"]["after"] == [0, 4, 1] and c["mobEarly"]["before"] == c["mobEarly"]["after"] and c["march"]["k"] == "spk" and c["march"]["after"] == [0, 4, 2]
               and all(c[k]["warnK"] == "door" and dd(c[k]) and c[k]["ph"] == ["march"] for k in ("leader", "mob", "alone"))
               and all(c[k]["a"][0] == 1 and c[k]["a"][3] is False and c[k]["a"][4] is True and c[k]["a"][5] == "calm" and c[k]["f"][0] == 1 and c[k]["f"][1] == 5 and c[k]["f"][2] == 0 and c[k]["f"][4] is False for k in ("leader", "mob"))
               and c["alone"]["a"][0] == 0 and c["alone"]["a"][3] is True and c["alone"]["a"][5] == "warn" and c["alone"]["f"][0] == 0 and c["alone"]["f"][1] == 5 and c["alone"]["f"][3] is False
               and c["after"]["k"] == "spk" and c["after"]["after"] == [0, 4] and c["after"]["ph"] == "surge")
        self.add("p34", "corner_context_matters", okc,
                 f"Stage III: tapping the corn speaker while he speaks in the square silenced him: (stopped, lamp, dimmed) {c['square']['before']} -> {c['square']['after']}; tapping a crowd member then did nothing; during the march he was still a speaker ({c['march']['k']}): {c['march']['before']} -> {c['march']['after']}; the door warning came after phases {c['leader']['ph']} (harm '{c['leader']['warnK']}', tappable now: the corn speaker and mob members {c['leader']['doers']}); tapping him in it: stopped {c['leader']['a'][0]}, door stopped={c['leader']['a'][4]}, the mob turned '{c['leader']['a'][5]}' and drifted off (gone after 5 s: {not c['leader']['f'][4]}), lamp {c['leader']['f'][1]}; tapping a mob member instead: stopped {c['mob']['a'][0]}, mob '{c['mob']['a'][5]}'; leaving him alone: still no stop ({c['alone']['a'][0]}) at the end of the 2 s warning (warning on at the start {c['alone']['a'][3]}), then the mob surged (stopped {c['alone']['f'][0]}, door stopped {c['alone']['f'][3]}, lamp {c['alone']['f'][1]}); after the warning he is a speaker again: tap {c['after']['before']} -> {c['after']['after']}")
        B = r["big"]
        okb = (B["min"][0] >= 22 and B["min"][1] >= 22 and all(n > 500 for n in B["byStage"]) and B["res"] == "win" and all(f"{s}:{k}" in B["seen"] for s, k in [(0, "stone"), (0, "purse"), (0, "shove"), (1, "stone"), (1, "shove"), (2, "stone"), (2, "purse"), (2, "door")])
               and all(e["w"] >= 22 and e["h"] >= 22 and e["stops"] == [1] * 8 and e["outside"] == 0 for e in B["edge"]) and all(x["lamp"] == [4] * 6 for x in B["spkEdge"]))
        self.add("p34", "corner_targets_big", okb,
                 f"over a whole auto-played game ({B['n']} person-samples, {B['tappable']} of them tappable: {B['byStage']} by stage; harms seen {B['seen']}) the smallest hit area was {B['min'][0]} x {B['min'][1]} units (want 22 x 22); in each stage, tapping a doer in its warning on each edge midpoint and each corner of its hit area stopped it every time ({[e['stops'] for e in B['edge']]}, areas {[(e['w'], e['h']) for e in B['edge']]}) and a tap 0.4 units outside did not ({[e['outside'] for e in B['edge']]}); speakers' edges and corners silenced them ({[x['lamp'] for x in B['spkEdge']]})")
        D = r["rep"]
        okr = (D["ends"] == 0 and D["none"]["a"]["again"] == 1 and D["none"]["a"]["st"] == 0 and D["none"]["after"]["st"] == 0 and D["none"]["after"]["stT"] < 1 and D["none"]["after"]["qi"] <= 1 and D["none"]["after"]["stopped"] == 0 and D["none"]["after"]["lamp"] == 5 and D["none"]["ends"] == 0
               and D["one"]["a"]["again"] == 1 and D["one"]["a"]["stopped"] == 1 and D["one"]["after"] == {"st": 0, "stopped": 0, "lamp": 5}
               and D["low"]["a"]["again"] == 1 and D["low"]["a"]["lamp"] == 2 and D["low"]["a"]["stopped"] == 5 and D["low"]["after"] == {"st": 0, "stopped": 0, "lamp": 5}
               and D["three"]["again"] == 0 and D["three"]["st"] == 1 and D["three"]["lamp"] == 3 and D["three"]["stopped"] == 5 and D["two"]["again"] == 0 and D["two"]["st"] == 1 and D["two"]["stopped"] == 2
               and D["noDoor"]["again"] == 1 and D["noDoor"]["st"] == 2 and D["noDoor"]["stopped"] == 2 and not D["noDoor"]["doorStopped"] and D["noDoor"]["after"]["stopped"] == 0 and D["noDoor"]["after"]["qi"] <= 1 and D["door"]["res"] == "win" and D["door"]["doorStopped"]
               and D["auto"]["res"] == "win" and D["auto"]["sts"] == [0, 1, 2] and D["auto"]["stopped"] == 12 and D["auto"]["rate"] == 3 and D["auto"]["again"] == 0 and D["auto"]["ends"] == 0
               and D["rate"] == [3, 3, 2, 1, 2, 1, 2, 1, 2] and D["text"]["again"] == "You hushed people who were only annoying, or someone got a soaking. Again." and D["text"]["limit"] == 0 and D["text"]["pad"] is False and D["text"]["ab"] is False)
        self.add("p34", "corner_stage_repeats", okr,
                 f"Stage I with no taps: the 'again' line played at {D['none']['t']} s and the stage began again (still stage {D['none']['after']['st']+1}, {D['none']['after']['stT']} s in, stops {D['none']['after']['stopped']}, lamp {D['none']['after']['lamp']}); 1 stop of 5: repeats and stops go back from {D['one']['a']['stopped']} to {D['one']['after']['stopped']}; every harm stopped but the lamp at {D['low']['a']['lamp']} after 3 late silences: repeats, stops back from {D['low']['a']['stopped']} to {D['low']['after']['stopped']} and lamp back to {D['low']['after']['lamp']}; the lamp at exactly {D['three']['lamp']} with 5 stops passes (now stage {D['three']['st']+1}); just 2 of 5 stops pass ({D['two']['stopped']} stops, stage {D['two']['st']+1}); Stage III with 2 stops but not the door repeats (stops back to {D['noDoor']['after']['stopped']}), and the door plus one more wins ({D['door']['res']!r}); auto played stages {D['auto']['sts']} to {D['auto']['res']!r} at {D['auto']['t']} s with {D['auto']['stopped']} stops, lamp {D['auto']['lamp']}, dimmed {D['auto']['dimmed']}, rate {D['auto']['rate']}; 'end' was returned {D['ends']} times in all; rate for (stopped, dimmed, lamp) = (10,0,5) (12,0,5) (10,1,4) (10,1,3) (8,3,4) (8,3,3) (9,0,5) (6,0,5) (9,2,4): {D['rate']} (want 3,3,2,1,2,1,2,1,2); the again line: {D['text']['again']!r}; tap only (pad {D['text']['pad']}, A/B {D['text']['ab']}), limit {D['text']['limit']}")
        await self.p34c(b)

    async def p34c(self, b):
        """Phase 34C: The Web (web_*) and If Everyone Did It (rule_*)."""
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate(r"""(async()=>{const out={};const S=id=>{const s={W:192,H:320,rm:false,t:0};MINI[id].init(s);return s};
const r2=x=>+(+x).toFixed(2);const g=MINI.web,T=g._t,blank=()=>miniBlankInp();
const step=(s,n,f)=>{let res=null;for(let i=0;i<n;i++){const inp=blank();if(f)f(s,inp,i);s.t+=.05;const r=g.step(s,.05,inp);if(r){res=r;if(r!=='win')out.ends=(out.ends||0)+1;break}}return res};
const setK=(s,sol)=>sol.forEach((p,k)=>{s.k[k].x=p[0];s.k[k].y=p[1]});
/* ---------------- needs change only in II ---------------- */
{const N={};let s=S('web');const base=s.need.join(),log=[];
 for(let i=0;i<1200;i++){step(s,1);if(s.need.join()!==base)log.push(r2(s.t))}N.s1={changes:log.length,st:s.st};
 // with the auto playing Stage I (until it moves on): no change either
 s=S('web');let chg=0,n=0;const b0=s.need.join();for(let i=0;i<400&&s.st===0;i++){const inp=blank();s.t+=.05;g.auto(s,inp);g.step(s,.05,inp);n++;if(s.st===0&&s.need.join()!==b0)chg++}N.s1auto={chg,n};
 s=S('web');g.toStage(s,1);N.s2start={need:s.need.join(),st:s.st,home:s.homeOn};const flips=[];let prev=s.need.slice(),metAfter=[],t=0;
 for(let i=0;i<80;i++){s.t+=.05;g.step(s,.05,blank());t+=.05;for(let h=0;h<8;h++)if(s.need[h]!==prev[h]){flips.push({h,from:prev[h],to:s.need[h],t:r2(s.stT),metNow:s.met[h]});prev=s.need.slice()}}
 N.flips=flips;
 // right after a flip the home is unmet until a resting knot of the new need's source reaches it
 {const R=[];for(const [h,to] of [[5,1],[6,2]]){const s2=S('web');g.toStage(s2,1);if(h===6){s2.stT=1.6;T.flip(s2,5,1);for(let i=0;i<3;i++)step(s2,1)}
   s2.stT=h===5?1.49:2.99;step(s2,1);const before=s2.met[h],need=s2.need[h];
   // the stored solution places the knot of the new need within reach
   const K=s2.k[to];K.x=T.SOL[1][to][0];K.y=T.SOL[1][to][1];step(s2,1);R.push({h,to,need,metBefore:before,metAfter:s2.met[h]})}
  N.after=R}
 s=S('web');g.toStage(s,1);step(s,70);setK(s,T.SOL[1]);step(s,1);N.sol2={all:s.all,met:s.met.join(),need:s.need.join(),moves:s.moves,chg:s.chg};
 s=S('web');g.toStage(s,1);const t0=s.need.join();step(s,5);N.s2idleAfter={need:s.need.join(),t0};
 out.needs=N}
/* ---------------- your own home is in the web only in III ---------------- */
{const H={};let s=S('web');H.s1={on:s.homeOn,home:s.home,L:s.L};g.toStage(s,1);H.s2={on:s.homeOn,home:s.home};
 s=S('web');g.toStage(s,2);step(s,40);H.s3={on:s.homeOn,need:s.need.join()};setK(s,T.SOL[2]);step(s,2);H.bal={home:s.home,L:r2(s.L),all:s.all,met:s.met.join(),homeMet:s.homeMet,reachF:r2(T.reachF(s)),reach0:r2(T.reach(s,0))};
 // a thread at 0.95 R: still met at full brightness, unmet once the home dims and the reaches shrink
 {const k=0,K=s.k[k];const P0=T.SOL[2][k];let lo=1,hi=3;const cen=[0,0,0];const ls0=T.lens(s,k);const mx=()=>Math.max(...T.lens(s,k).map(l=>l.d));
  const dir=[P0[0]-T.SRC[k][0],P0[1]-T.SRC[k][1]];const nd=Math.hypot(dir[0],dir[1]);
  for(let i=0;i<60;i++){const m=(lo+hi)/2;K.x=T.SOL[2][k][0]+0;K.y=T.SOL[2][k][1];K.x=P0[0]+dir[0]/nd*(m-1)*10;K.y=P0[1]+dir[1]/nd*(m-1)*10;if(mx()>.95*T.R[2][k])hi=m;else lo=m}
  K.x=P0[0]+dir[0]/nd*(lo-1)*10;K.y=P0[1]+dir[1]/nd*(lo-1)*10;step(s,1);const q=mx()/T.R[2][k];const homesOk=T.homesOf(s,k).every(h=>s.met[h]);H.q95={q:r2(q),homesMetBright:homesOk,home:s.home};
  // dim the home: the warmth knot far away
  const W=s.k[3];W.x=178;W.y=244;step(s,60);H.dim={home:r2(s.home),L:r2(s.L),reachF:r2(T.reachF(s)),want:r2(.8+.2*s.home),reach0:r2(T.reach(s,0)),q:r2(mx()/T.reach(s,0)),homesMet:T.homesOf(s,k).map(h=>s.met[h]),homeMet:s.homeMet,all:s.all}}
 // a little over budget: partly dim
 {const s2=S('web');g.toStage(s2,2);step(s2,40);setK(s2,T.SOL[2]);s2.k[3].x=96;s2.k[3].y=150;step(s2,60);H.mid={home:r2(s2.home),L:r2(s2.L),reachF:r2(T.reachF(s2)),want:r2(.8+.2*s2.home),homeMet:s2.homeMet}}
 // the win: 5 s of continuous all-met; a break at 4 s empties the hold
 {const s3=S('web');g.toStage(s3,2);step(s3,40);setK(s3,T.SOL[2]);let res=null,t=0,tw=-1,brokeAt=-1,holdAtBreak=null,holdAfter=null,steps=0;
  step(s3,1);let h4=0;for(let i=0;i<80;i++){res=step(s3,1);if(res)break}h4=r2(s3.hold);
  // a break: the warmth knot is picked up for a moment
  const K=s3.k[3];T.pickup(s3,3,'touch',0,0);step(s3,1,(s,inp)=>{inp.down={x:K.x,y:K.y}});T.release(s3);step(s3,1);holdAfter=r2(s3.hold);const mvAfter=s3.moves;
  let n2=0,won=null;for(let i=0;i<400;i++){const r=step(s3,1);n2++;if(r==='win'){won=r;break}}
  H.win={h4,holdAfter,wonAfter:r2(n2*.05),won,never:out.ends||0,moves:mvAfter}}
 out.home=H}
/* ---------------- snaps and reties ---------------- */
{const P={};let s=S('web');P.start={moves:s.moves,snaps:s.snaps,over:[0,1,2,3].map(k=>T.over(s,k))};
 const K=s.k[1],px=K.x,py=K.y;T.pickup(s,1,'touch',0,0);P.pick1={moves:s.moves,held:s.held};K.x=150;K.y=215;P.over=T.over(s,1);T.release(s);
 P.snap={snaps:s.snaps,rt:r2(K.rt),held:s.held};const t0=[];for(let i=0;i<70;i++){s.t+=.05;g.step(s,.05,blank());if(i===30)t0.push([r2(K.x),r2(K.y),r2(K.rt)])}
 P.after={x:r2(K.x),y:r2(K.y),px,py,rt:r2(K.rt),over:T.over(s,1),mid:t0[0]};
 // within reach: never snaps; every pick-up is one move
 {const s2=S('web');const K2=s2.k[2];T.pickup(s2,2,'touch',0,0);K2.x=T.SOL[0][2][0];K2.y=T.SOL[0][2][1];const w1=T.over(s2,2);T.release(s2);const a={over:w1,snaps:s2.snaps,moves:s2.moves,rt:K2.rt,x:K2.x,y:K2.y};
  T.pickup(s2,2,'touch',0,0);T.release(s2);const b2={snaps:s2.snaps,moves:s2.moves,x:K2.x,y:K2.y};
  const K0=s2.k[0];T.pickup(s2,0,'touch',0,0);K0.x=T.SOL[0][0][0];K0.y=T.SOL[0][0][1];T.release(s2);P.within={a,b2,moves3:s2.moves,snaps3:s2.snaps}}
 P.rate=[[15,0],[16,0],[23,0],[24,0],[10,1],[0,0],[16,1]].map(([m,n])=>g.rate({moves:m,snaps:n}));
 out.snap=P}
/* ---------------- the Weaver only ---------------- */
{const Wv={};Wv.who=g.who;Wv.name=SPEAKER.gilligan&&SPEAKER.gilligan.n;
 await new Promise(r=>{loadAtlas('chars');loadMiniArt('web');let k=0;const iv=setInterval(()=>{k++;const A=MINI_ART.web;const ids=[A.atlas,A.people,...(A.bg||[]),A.plate].filter(Boolean);if((ATLAS_IMG.chars&&ATLAS_IMG.chars.ok&&ids.every(a=>MIMG[a]&&(MIMG[a].ok||MIMG[a].bad)))||k>60){clearInterval(iv);r()}},50)});
 Wv.artOk=!!(ATLAS_IMG.chars&&ATLAS_IMG.chars.ok)&&mArtOk('web');
 const spr=[],per=[],txt=[];const oS=window.mSpr,oP=window.mPerson,oT=CanvasRenderingContext2D.prototype.fillText,oS2=window.mSprO;
 window.mSpr=function(c,n){spr.push(n);return oS.apply(this,arguments)};window.mPerson=function(c,id,n){per.push(n);return oP.apply(this,arguments)};window.mSprO=function(c,n){spr.push(n);return oS2.apply(this,arguments)};
 CanvasRenderingContext2D.prototype.fillText=function(t){txt.push(String(t));return oT.apply(this,arguments)};
 try{const cv=document.createElement('canvas');cv.width=384;cv.height=640;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);const s=S('web');let res=null,i=0;
  for(;i<4000&&!res;i++){const inp=blank();s.t+=.05;g.auto(s,inp);res=g.step(s,.05,inp);if(i%2===0)g.draw(s,c,i*50);if(res==='end')break}
  g.bloom(s,c,.2,0);g.bloom(s,c,.6,500);g.bloom(s,c,1,1000);Wv.res=res}
 finally{window.mSpr=oS;window.mPerson=oP;window.mSprO=oS2;CanvasRenderingContext2D.prototype.fillText=oT}
 Wv.spr=[...new Set(spr)];Wv.nSpr=spr.length;Wv.per=[...new Set(per)].sort();Wv.nPer=per.length;Wv.txt=[...new Set(txt)];
 const strs=[];const walk=(v)=>{if(typeof v==="string")strs.push(v);else if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==="object"&&!(v instanceof Function))Object.keys(v).filter(k=>k!=="_t").forEach(k=>walk(v[k]))};walk(g);strs.push(T.SAY2);
 Wv.gil=strs.filter(x=>/Gilligan|Carol/i.test(x));Wv.quotes=strs.filter(x=>/[“”"]/.test(x));
 Wv.fnGil=[g.step,g.draw,g.bloom,g.init,g.auto,g.toStage].filter(f=>/Gilligan|Carol/i.test(f.toString())).length;Wv.setup=g.setup;
 out.weaver=Wv}
return out})()""")
        await ctx.close()
        N, H, P, Wv = r["needs"], r["home"], r["snap"], r["weaver"]
        fl = N["flips"]
        okn = (N["s1"]["changes"] == 0 and N["s1auto"]["chg"] == 0 and N["s1auto"]["n"] > 20 and N["s2start"]["need"] == "2,0,2,0,3,3,1,1" and not N["s2start"]["home"]
               and len(fl) == 2 and fl[0]["h"] == 5 and fl[0]["from"] == 3 and fl[0]["to"] == 1 and 1.45 <= fl[0]["t"] <= 1.6 and fl[1]["h"] == 6 and fl[1]["from"] == 1 and fl[1]["to"] == 2 and 2.95 <= fl[1]["t"] <= 3.1
               and not fl[0]["metNow"] and not fl[1]["metNow"] and all(a["metBefore"] is False and a["metAfter"] is True for a in N["after"]) and N["sol2"]["all"] and N["sol2"]["chg"] == 2 and N["sol2"]["need"] == "2,0,2,0,3,1,2,1"
               and N["s2idleAfter"]["need"] == N["s2idleAfter"]["t0"])
        self.add("p34", "web_needs_change_in_II", okn,
                 f"Stage I: no need changed in 60 s of no input ({N['s1']['changes']} changes) or while the auto solved it ({N['s1auto']['chg']}); Stage II starts from {N['s2start']['need']}; the parent's home (5) flipped from warmth to quiet at {fl[0]['t']} s and the old man's (6) from quiet to company at {fl[1]['t']} s; right after each flip that home was unmet ({fl[0]['metNow']}, {fl[1]['metNow']}) and met once the knot of the new need's source was placed on its stored spot ({[(a['metBefore'], a['metAfter']) for a in N['after']]}); the stored Stage II solution met all 8 needs ({N['sol2']['all']}) with needs {N['sol2']['need']}")
        okh = (not H["s1"]["on"] and H["s1"]["home"] == 1 and not H["s2"]["on"] and H["s3"]["on"] and H["bal"]["home"] == 1 and H["bal"]["all"] and H["bal"]["homeMet"] and H["bal"]["reachF"] == 1 and H["bal"]["L"] <= 330
               and abs(H["q95"]["q"] - .95) < .01 and H["q95"]["homesMetBright"] and H["dim"]["home"] < 1 and abs(H["dim"]["reachF"] - H["dim"]["want"]) < .011 and H["dim"]["q"] > 1 and not any(H["dim"]["homesMet"]) and not H["dim"]["homeMet"] and not H["dim"]["all"]
               and 0 < H["mid"]["home"] < 1 and abs(H["mid"]["reachF"] - H["mid"]["want"]) < .011 and not H["mid"]["homeMet"]
               and 3.9 <= H["win"]["h4"] <= 4.2 and H["win"]["holdAfter"] <= .11 and 4.9 <= H["win"]["wonAfter"] <= 5.2 and H["win"]["won"] == "win" and H["win"]["never"] == 0)
        self.add("p34", "web_own_home_in_III", okh,
                 f"your own home is in the web only in Stage III (Stage I on={H['s1']['on']}, II on={H['s2']['on']}, III on={H['s3']['on']}); the stored balanced spot gives L={H['bal']['L']} <= B=330, s.home={H['bal']['home']}, every need met ({H['bal']['all']}); a thread at {H['q95']['q']} R is met at full brightness ({H['q95']['homesMetBright']}); the warmth knot far away (L={H['dim']['L']}) dims it to s.home={H['dim']['home']}, shrinking every reach by {H['dim']['reachF']} (= 0.8 + 0.2 s.home = {H['dim']['want']}), so that thread (now {H['dim']['q']} of its reach) is unmet ({H['dim']['homesMet']}); a little over budget (L={H['mid']['L']}) gives s.home={H['mid']['home']}, factor {H['mid']['reachF']}; the hold stood at {H['win']['h4']} s when a knot was picked up, emptied to {H['win']['holdAfter']}, and the win came {H['win']['wonAfter']} s later ({H['win']['won']}); the game returned \"end\" {H['win']['never']} times")
        oks = (P["pick1"]["moves"] == 1 and P["over"] and P["snap"]["snaps"] == 1 and P["snap"]["rt"] == 3 and P["after"]["x"] == P["after"]["px"] and P["after"]["y"] == P["after"]["py"] and P["after"]["rt"] == 0 and 1.3 <= P["after"]["mid"][2] <= 1.6
               and not P["within"]["a"]["over"] and P["within"]["a"]["snaps"] == 0 and P["within"]["a"]["moves"] == 1 and P["within"]["b2"]["snaps"] == 0 and P["within"]["b2"]["moves"] == 2 and P["within"]["moves3"] == 3 and P["within"]["snaps3"] == 0
               and P["rate"] == [3, 2, 2, 1, 1, 3, 1])
        self.add("p34", "web_thread_snaps_and_reties", oks,
                 f"dropping a knot with a thread beyond reach snapped it (snaps {P['snap']['snaps']}, loose for {P['snap']['rt']} s) and 3 s later it was back at its pick-up spot ({P['after']['x']},{P['after']['y']}) = ({P['after']['px']},{P['after']['py']}) with rt={P['after']['rt']}, gliding back after the first 2.2 s (rt {P['after']['mid'][2]} at 1.5 s); dropping within reach never snapped (snaps {P['within']['snaps3']}); every pick-up was one move (1, 2, 3 -> {P['within']['a']['moves']}, {P['within']['b2']['moves']}, {P['within']['moves3']}); rate for (15,0),(16,0),(23,0),(24,0),(10 moves, 1 snap) = {P['rate'][:5]} (want 3,2,2,1,1)")
        spr_ok = set(Wv["spr"]) <= {"gilligan_0", "gilligan_1"} and (Wv["nSpr"] > 0 or not Wv["artOk"])
        gil = [x for x in Wv["gil"] if x != "gilligan"]
        okw = (Wv["who"] == "gilligan" and Wv["name"] == "The Weaver" and spr_ok and Wv["nPer"] > 0 and all(n.startswith("win_") for n in Wv["per"]) and Wv["txt"] == [] and Wv["res"] == "win"
               and gil == [Wv["setup"][1]] and "Carol Gilligan’s research" in gil[0] and Wv["fnGil"] == 0 and Wv["quotes"] == [])
        self.add("p34", "web_weaver_only", okw,
                 f"who={Wv['who']} -> speaker '{Wv['name']}'; across a full auto play and the bloom ({Wv['nSpr']} mSpr calls, {Wv['nPer']} mPerson calls) the only sprites were {Wv['spr']} and the people were only the window busts {Wv['per']}; no text was drawn on the canvas ({Wv['txt']}); 'Gilligan' appears only in {gil} (third person, 'Carol Gilligan’s research'); no string in the game holds a quotation mark ({Wv['quotes']}) and no code mentions her")
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate(r"""(async()=>{const out={};const S=id=>{const s={W:192,H:320,rm:false,t:0};MINI[id].init(s);return s};
const r2=x=>+(+x).toFixed(2);const g=MINI.rule,T=g._t,blank=()=>miniBlankInp();let ENDS=0;
const step=(s,f)=>{const inp=blank();if(f)f(s,inp);s.t+=.05;const r=g.step(s,.05,inp);if(r==='end')ENDS++;return r};
const run=(s,sec,stop,f)=>{let res=null;for(let i=0;i<Math.round(sec/.05);i++){if(stop&&stop())break;const r=step(s,f);if(r){res=r;break}}return res};
const pick=(s,k)=>{const inp=blank(),j=s.order.indexOf(k);inp.taps=[{x:96,y:T.CY[j]+11}];inp.tap=inp.taps[0];s.t+=.05;g.step(s,.05,inp)};
/* ---------------- five scenes in three stages ---------------- */
{const F={};const s=S('rule');F.start={sci:s.sci,st:s.st,wrongLen:s.wrong.length,stars:s.stars,pad:g.pad,ab:g.ab};
 const seq=[],stSeq=[],starsAt=[];let res=null,t=0;let lastSci=-1;
 for(let i=0;i<4000&&!res;i++){const inp=blank();s.t+=.05;g.auto(s,inp);const sc0=s.sci,st0=s.stars;res=g.step(s,.05,inp);if(s.sci!==lastSci){lastSci=s.sci;seq.push(s.sci);stSeq.push(s.st)}if(s.stars>st0)starsAt.push([sc0,s.stars]);if(res==='end')break;t+=.05}
 F.seq=seq;F.stSeq=stSeq;F.starsAt=starsAt;F.res=res;F.stars=s.stars;F.t=r2(t);F.rate=g.rate(s);F.wrong=s.wrong.slice();F.ends=ENDS;
 F.rates=[[0,0,0,0,0],[0,1,0,0,0],[0,0,0,0,1],[0,2,1,0,0],[0,0,0,0,2],[1,1,1,1,1]].map(w=>g.rate({wrong:w}));F.stages=g.stages;F.lines=g.lines;F.sceneStage=T.SCENE_STAGE;F.titles=T.SCENES.map(x=>x.title);
 // the engine's banners: one per stage, in order
 const seen=[],ob=window.miniBanner;window.miniBanner=function(t){seen.push(t);return ob.apply(this,arguments)};
 __kitEnter(g.land);await new Promise(r=>setTimeout(r,60));startMini('rule');MS.i=g.setup.length;miniAct('mbegin');MS.auto=true;stopMiniLoop();let guard=0,maxSt=0;
 while(MS&&MS.mode==='play'&&guard++<4000){miniTick(.05);maxSt=Math.max(maxSt,MS.s.st||0)}
 F.banners=seen;F.mode=MS&&MS.mode;F.maxSt=maxSt;window.miniBanner=ob;closeMini();
 // a win needs the fifth star: with four stars lit and the fifth scene's good phase, nothing wins early
 const s2=S('rule');g.toStage(s2,2);F.toStage2={sci:s2.sci,st:s2.st,stars:s2.stars};let early=null;for(let i=0;i<30;i++){early=step(s2)}F.early=early;
 out.five=F}
/* ---------------- a false promise fails ---------------- */
{const P={};const sfxLog=[],osfx=window.sfx;window.sfx=function(n){sfxLog.push(n);return osfx.apply(this,arguments)};
 try{P.cards=T.PROMISE.cards;
  const mk=()=>{const s=S('rule');g.toStage(s,2);P.start={sci:s.sci,st:s.st,stars:s.stars};return s};
  // card 1: the false promise
  {const s=mk();sfxLog.length=0;pick(s,1);let youMe=null,youDis=null;run(s,3,()=>s.ph==='every',()=>{});youMe={plan:s.me.plan,st:s.me.st,carry:s.me.carry,dis:s.sc.dis,shrugs:s.sc.shrugs};
   const res=run(s,20,()=>s.ph==='bad');P.false={ph:s.ph,stars:s.stars,shut:s.sc.shut,shutK:r2(s.sc.shutK),sign:s.sc.sign,out:s.sc.out,shutter:sfxLog.includes('shutter'),topple:sfxLog.includes('topple'),star:sfxLog.includes('star'),res,wrong:s.wrong.slice(),tried:s.tried.slice(),youMe,lies:s.sc.lies,dis:s.sc.dis,ign:s.sc.ign,notes:s.sc.notes,line:s.sc.line.length}
   // choose again: the scene is rebuilt
   run(s,4,()=>s.ph==='choose');P.false.again={ph:s.ph,chaos:s.chaos};}
  // card 2: promise now, decide later
  {const s=mk();sfxLog.length=0;pick(s,2);run(s,3,()=>s.ph==='every');const youMe={plan:s.me.plan,shrugs:s.sc.shrugs,out:s.sc.out};let outAt=-1,handedAtOut=-1;
   let res=null;for(let i=0;i<400&&s.ph!=='bad';i++){res=step(s);if(s.sc.out&&outAt<0){outAt=r2(s.u);handedAtOut=s.sc.handed}}
   for(let i=0;i<60;i++)step(s);
   P.decide={ph:s.ph,stars:s.stars,out:s.sc.out,sign:s.sc.sign,signK:r2(s.sc.signK),ledger:s.sc.ledger,gone:s.sc.gone,shut:s.sc.shut,shutter:sfxLog.includes('shutter'),handedAtOut,handedEnd:s.sc.handed,shrugs:s.sc.shrugs,outAt,youMe,wrong:s.wrong.slice()}}
  // card 0: the working card
  {const s=mk();sfxLog.length=0;pick(s,0);let res=run(s,14,()=>s.ph==='good');const st1={ph:s.ph,stars:s.stars,star:sfxLog.includes('star'),shut:s.sc.shut,out:s.sc.out,sign:s.sc.sign,repaid:s.sc.handed};res=run(s,3);P.keep={...st1,res,wrong:s.wrong.slice()}}
 }finally{window.sfx=osfx}
 out.promise=P}
/* ---------------- the cards are shuffled ---------------- */
{const C={slots:[[],[],[],[],[]],ok:true,texts:[],ords:[]};
 for(let n=0;n<30;n++){const s=S('rule');for(let i=0;i<5;i++){T.load(s,i);C.slots[i].push(s.order.indexOf(0));if([...s.order].sort().join()!=='0,1,2')C.ok=false;if(i===0&&n===0)C.ords.push(s.order.slice())}}
 C.distinct=C.slots.map(a=>[...new Set(a)].sort());C.texts=T.SCENES.map(x=>x.cards);C.three=T.SCENES.every(x=>x.cards.length===3&&new Set(x.cards).size===3);
 // drawn on screen: slot j shows card order[j]
 const cv=document.createElement('canvas');cv.width=384;cv.height=640;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);const s=S('rule');T.load(s,4);const seen=[],ot=window.mText;g.draw(s,c,0);C.rows=T.CY;out.cards=C}
return out})()""")
        await ctx.close()
        F, Pm, C = r["five"], r["promise"], r["cards"]
        okf = (F["start"]["sci"] == 0 and F["start"]["wrongLen"] == 5 and not F["start"]["pad"] and not F["start"]["ab"] and F["seq"] == [0, 1, 2, 3, 4] and F["stSeq"] == [0, 0, 1, 1, 2] and F["sceneStage"] == [0, 0, 1, 1, 2]
               and F["starsAt"] == [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] and F["res"] == "win" and F["stars"] == 5 and F["wrong"] == [0] * 5 and F["rate"] == 3 and F["ends"] == 0
               and F["rates"] == [3, 2, 2, 1, 1, 2] and F["banners"] == ["I · Lines and Wells", "II · Scales and Criers", "III · The Promise"] and F["maxSt"] == 2 and F["stages"] == ["Lines and Wells", "Scales and Criers", "The Promise"]
               and F["toStage2"] == {"sci": 4, "st": 2, "stars": 4} and F["early"] is None and F["titles"] == ["The Bread Line", "The Well", "The Market Scales", "The Town Crier", "The Promise"])
        self.add("p34", "rule_five_scenes", okf,
                 f"auto played scenes {F['seq']} in stages {F['stSeq']} (bread, well | scales, crier | promise), a star in each ({F['starsAt']}), and the win came with exactly {F['stars']} stars after {F['t']} s; s.wrong has {F['start']['wrongLen']} entries; the engine showed the banners {F['banners']}; rate for max wrong 0/1/2 = {F['rates'][0]}/{F['rates'][1]}/{F['rates'][4]} (want 3/2/1); toStage(2) = scene {F['toStage2']['sci']} with {F['toStage2']['stars']} stars and no early win; tap-only (pad {F['start']['pad']}, A/B {F['start']['ab']}); the game returned \"end\" {F['ends']} times")
        fa, de, ke = Pm["false"], Pm["decide"], Pm["keep"]
        okp = (Pm["cards"] == ["Promise only what I mean to keep", "Make a false promise when I’m desperate", "Promise now, decide later"] and Pm["start"] == {"sci": 4, "st": 2, "stars": 4}
               and fa["ph"] == "bad" and fa["shut"] and fa["shutK"] == 1 and fa["shutter"] and fa["stars"] == 4 and not fa["star"] and fa["wrong"][4] == 1 and fa["tried"] == [1] and fa["youMe"]["plan"] == "never" and fa["youMe"]["carry"] == "purse" and not fa["youMe"]["dis"] and fa["dis"] and fa["notes"] >= 2 and fa["line"] == 0 and fa["again"]["ph"] == "choose"
               and de["out"] and de["sign"] is False and de["signK"] == 1 and de["ledger"] is False and de["gone"] and not de["shut"] and not de["shutter"] and de["stars"] == 4 and de["handedAtOut"] == de["handedEnd"] > 0 and de["youMe"]["plan"] == "repay" and de["youMe"]["shrugs"] == 0 and de["wrong"][4] == 1
               and ke["ph"] == "good" and ke["stars"] == 5 and ke["star"] and not ke["shut"] and not ke["out"] and ke["sign"] and ke["res"] == "win" and ke["repaid"] >= 8)
        self.add("p34", "rule_false_promise_fails", okp,
                 f"Stage III cards are {Pm['cards']}; 'Make a false promise when I’m desperate': alone you took the purse and never came back ({fa['youMe']['plan']}, nobody noticed: distrust {fa['youMe']['dis']}), then everyone's notes piled up unread ({fa['notes']}), the line turned away ({fa['line']} left) and the booth shut (shutters closed {fa['shut']}, 'shutter' sound {fa['shutter']}); it ended in the {fa['ph']} phase with {fa['stars']} stars and no star sound ({fa['star']}); 'Promise now, decide later': you repaid ({Pm['decide']['youMe']['plan']}), then {de['shrugs']} shrugs, lending stopped at {de['outAt']} s (sign down {not de['sign']}, ledger closed {not de['ledger']}, window empty {de['gone']}), purses handed out before {de['handedAtOut']} and after {de['handedEnd']} (none after), shutters open ({not de['shut']}), no star ({de['stars']}); 'Promise only what I mean to keep': {ke['repaid']} purses went out and came back, the booth stayed open, fifth star lit ({ke['stars']}) and the game returned {ke['res']}")
        sl = C["distinct"]
        okc = (C["ok"] and all(len(x) >= 2 for x in sl) and C["three"] and all(len(t) == 3 for t in C["texts"]))
        self.add("p34", "rule_cards_shuffled", okc,
                 f"over 30 fresh inits of each of the 5 scenes the three cards were always the scene's three (a permutation of 0,1,2: {C['ok']}) and the right card sat in slots {sl} (want at least two different slots in every scene); every scene lists 3 distinct cards ({C['three']}) drawn at rows y={C['rows']}")

    async def p38(self, b):
        """Phase 38 (Plan 5 foundation): seven new scripts, the build tool, the 45 ARTI links, short games, the shared art key, the six helpers,
        the gallery and Journal by thinker, the return menu, and the three Phase 36 weak spots. The checks live in kit38.py."""
        here = os.path.dirname(os.path.abspath(__file__))
        f = os.path.join(here, "kit38.py")
        if not os.path.exists(f):
            self.add("p38", "kit38", False, "kit38.py is missing"); return
        ns = dict(globals()); exec(compile(open(f, encoding="utf-8").read(), f, "exec"), ns)
        await ns["run"](self, b)

    async def p39(self, b):
        """Phase 39 (Plan 5): the 22 card powers. The checks live in kit39.py."""
        here = os.path.dirname(os.path.abspath(__file__))
        f = os.path.join(here, "kit39.py")
        if not os.path.exists(f):
            self.add("p39", "kit39", False, "kit39.py is missing"); return
        ns = dict(globals()); exec(compile(open(f, encoding="utf-8").read(), f, "exec"), ns)
        await ns["run"](self, b)

    PLAN5_GROUPS = {"p40": ("f1", "s1"), "p41": ("f2", "s2"), "p42": ("f3", "s3"), "p43": ("s4",)}

    async def land_group(self, b, grp):
        """Plan 5 A9: groups p40-p43. mini_suite and hd_suite (short mode for short games) for every registered game of the land's new scripts,
        then every module in kits/<grp>/*.py (each defines async def run(kit, b, pg)). --mini-ids limits both the suites and the modules."""
        here = os.path.dirname(os.path.abspath(__file__))
        man = json.load(open(os.path.join(here, "tools", "mini_manifest.json"), encoding="utf-8"))
        ids = [g for k in self.PLAN5_GROUPS[grp] for g in man[k]["games"]]
        only = [x for x in getattr(self.args, "mini_ids", "").split(",") if x]
        if only:
            ids = [i for i in ids if i in only]
        ctx, pg, errs = await self.page(b)
        have = await pg.evaluate("((ids)=>ids.filter(i=>typeof MINI!=='undefined'&&MINI[i]))(" + json.dumps(ids) + ")")
        await ctx.close()
        if have:
            await self.mini_suite(b, grp, have)
            await self.hd_suite(b, grp, have)
        mods = sorted(glob.glob(os.path.join(here, "kits", grp, "*.py")))
        if only:
            mods = [m for m in mods if os.path.splitext(os.path.basename(m))[0] in only]
        for f in mods:
            name = os.path.splitext(os.path.basename(f))[0]
            ns = dict(globals())
            ctx, pg, errs = await self.page(b)
            try:
                exec(compile(open(f, encoding="utf-8").read(), f, "exec"), ns)
                await ns["run"](self, b, pg)
            except Exception as e:
                self.add(grp, f"module_{name}", False, f"kits/{grp}/{name}.py raised: {str(e)[:200]}")
            await ctx.close()
        if not have and not mods:
            self.add(grp, f"{grp}_games", None, f"not built yet: no {grp} game is registered and kits/{grp}/ is empty ({len(ids)} ids looked for)")

    L1_45 = ["leap", "doors", "voices", "crowd", "sisyphus", "goalkeeper", "idols", "cages", "tornpage", "oncemore", "absurd", "excuses", "medal", "becoming", "rosary", "rose", "zenletter"]

    async def p45(self, b):
        """Phase 45B (Level I fix-up): mini_suite and hd_suite for the Level I games, then every module in kits/p45/*.py
        (each defines async def run(kit, b, pg); a module named <id>.py or <id>_*.py belongs to game <id>). --mini-ids limits both."""
        here = os.path.dirname(os.path.abspath(__file__))
        only = [x for x in getattr(self.args, "mini_ids", "").split(",") if x]
        ids = [i for i in self.L1_45 if not only or i in only]
        ctx, pg, errs = await self.page(b)
        have = await pg.evaluate("((ids)=>ids.filter(i=>typeof MINI!=='undefined'&&MINI[i]))(" + json.dumps(ids) + ")")
        await ctx.close()
        if have:
            await self.mini_suite(b, "p45", have)
            await self.hd_suite(b, "p45", have)
        mods = sorted(glob.glob(os.path.join(here, "kits", "p45", "*.py")))
        if only:
            mods = [m for m in mods if os.path.splitext(os.path.basename(m))[0].split("_")[0] in only]
        for f in mods:
            name = os.path.splitext(os.path.basename(f))[0]
            ns = dict(globals())
            ctx, pg, errs = await self.page(b)
            try:
                exec(compile(open(f, encoding="utf-8").read(), f, "exec"), ns)
                await ns["run"](self, b, pg)
            except Exception as e:
                self.add("p45", f"module_{name}", False, f"kits/p45/{name}.py raised: {str(e)[:200]}")
            await ctx.close()

    async def p40(self, b): await self.land_group(b, "p40")
    async def p41(self, b): await self.land_group(b, "p41")
    async def p42(self, b): await self.land_group(b, "p42")
    async def p43(self, b): await self.land_group(b, "p43")

    # ---------------- PHASE 44B-3: VOICE ----------------
    def voice_dir(self):
        return os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(self.path))), "voice")

    async def voice_page(self, b, req=None, block=None):
        """A page where every voice clip id serves a short real WAV (so the <audio> really plays), with a user click done
        (the browser needs a gesture before audio, as the iPhone does). req, if a list, collects the voice clip requests."""
        vd = self.voice_dir()
        ids = json.load(open(os.path.join(vd, "voice_ids.json")))
        wav = os.path.join(tempfile.gettempdir(), "kit-voice.wav")
        if not os.path.exists(wav):
            import wave, math
            w = wave.open(wav, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(8000)
            w.writeframes(b"".join(int(3000 * math.sin(i / 8.0)).to_bytes(2, "little", signed=True) for i in range(8000 * 3))); w.close()
        extra = {i: wav for i in ids.values()}
        ctx, pg, errs = await self.page(b, extra_blobs=extra, block=block, req_log=req, req_filter=set(ids.values()))
        await pg.mouse.click(4, 4)
        await pg.wait_for_timeout(150)
        return ctx, pg, errs, ids

    async def p44(self, b):
        """Plan 5 Phase 44B: voice_map_complete, voice_text_match, voice_lazy_load, voice_stops_on_change, voice_off_silent,
        voice_switch_device_only, plus voice_story_credits, voice_ducks_bed and voice_script_optional."""
        vd = self.voice_dir()
        L = json.load(open(os.path.join(vd, "lines.json")))
        rows = [[k, v["text"], v["speaker"]] for k, v in L.items()]
        sleep = "const sleep=ms=>new Promise(r=>setTimeout(r,ms));"
        # 1) every approved key has an id, and the text index finds every approved line
        req = []
        ctx, pg, errs, ids = await self.voice_page(b, req)
        r = await pg.evaluate("""(rows)=>{const out={n:0,bad:[],badId:[],miss:[],extra:[]};const keys=new Set(rows.map(x=>x[0]));
          if(typeof VOICE_MAP==='undefined')return {err:'no VOICE_MAP'};
          for(const k of keys)if(!VOICE_MAP[k])out.miss.push(k);for(const k in VOICE_MAP)if(!keys.has(k))out.extra.push(k);
          const vals=Object.values(VOICE_MAP);out.dupIds=vals.length-new Set(vals).size;vals.forEach(v=>{if(!/^[0-9a-f]{32}$/.test(v))out.badId.push(v)});
          const same={};rows.forEach(([k,t])=>{const n=VO.norm(t);(same[n]=same[n]||[]).push(k)});
          rows.forEach(([k,t,sp])=>{out.n++;const who=k.split('.')[1];const f=VO.find(t,who);if(f!==k&&!(same[VO.norm(t)].includes(f)&&same[VO.norm(t)].every(x=>x.split('.')[1]!==who||x===k)))out.bad.push(k+' -> '+f)});
          out.total=vals.length;return out}""", rows)
        ok = not r.get("err") and not r["miss"] and not r["extra"] and not r["badId"] and not r["dupIds"] and not r["bad"] and r["total"] == len(L) == 1015
        self.add("p44", "voice_map_complete", ok, f"{r.get('total')} clip ids in VOICE_MAP for {len(L)} approved keys (missing {r.get('miss',[])[:3]}, extra {r.get('extra',[])[:3]}, bad ids {r.get('badId',[])[:2]}, duplicate ids {r.get('dupIds')}); the text index finds {r.get('n',0)-len(r.get('bad',[]))} of {r.get('n')} lines (wrong: {r.get('bad',[])[:3] or 'none'}) {r.get('err','')}")
        # 2) the game's own text reaches every clip
        same = {}
        for k, t, sp in rows: same.setdefault(t, []).append(k)
        same = {k: [x for x in g if x != k] for g in same.values() if len(g) > 1 for k in g}
        r = await pg.evaluate("""(SAME)=>{const hit=new Set(),bad=[];let n=0;
          const chk=(t,who,want)=>{if(t==null)return;n++;const f=VO.find(t,who);if(f)hit.add(f);if(want&&VOICE_MAP[want]&&f!==want)bad.push(want+' got '+f)};
          for(const id in TALK){const T=TALK[id];(T.intro||[]).forEach((x,i)=>chk(x,id,`talk.${id}.intro.${i}`));
            (T.q||[]).forEach((q,j)=>{chk(q.say,id,`talk.${id}.q${j}.say`);chk(q.w,id,`talk.${id}.q${j}.w`);(q.fb||[]).forEach((f,m)=>chk(f,id,`talk.${id}.q${j}.fb${m}`))});
            chk(T.reflect,id,`talk.${id}.reflect`);chk(T.bye,id,`talk.${id}.bye`);chk(T.back,id,`talk.${id}.back`);
            if(ARTI[id])chk(ARTI[id].hint,id,`talk.${id}.hint`);AFFIRM.forEach((a,i)=>chk(a,id,`talk.${id}.affirm.${i}`))}
          for(const id in MINI){const g=MINI[id];(g.setup||[]).forEach((x,i)=>chk(x,g.who,`mini.${id}.setup.${i}`));(g.lines||[]).forEach((x,i)=>x&&chk(x,g.who,`mini.${id}.stage${i}`));
            chk(g.win,g.who,`mini.${id}.win`);chk(g.walk,g.who,`mini.${id}.walk`);chk(g.again,g.who,`mini.${id}.again`)}
          ENDING_TEXT.forEach((x,i)=>chk(x,'narrator',`story.end.${i}`));
          for(const L in LEVEL_DEFS){const D=LEVEL_DEFS[L],B=D.bossTalk;if(!B)continue;(B.intro||[]).forEach(x=>chk(x));(B.hit||[]).forEach(x=>chk(x));chk(B.miss);chk(B.bye);
            (D.challenges||[]).forEach(c=>{chk(c.taunt);chk(c.w)})}
          const src=String(beginJourney);(src.match(/text:"([^"]+)"/g)||[]).forEach(m=>chk(m.slice(6,-1),'narrator'));
          const unreached=Object.keys(VOICE_MAP).filter(k=>!hit.has(k)&&k!=='credits.0'&&!k.startsWith('mini.having.')&&!(SAME[k]||[]).some(x=>hit.has(x)));
          return {n,hit:hit.size,bad,unreached}}""", same)
        ok = not r["bad"] and not r["unreached"]
        self.add("p44", "voice_text_match", ok, f"{r['n']} lines of game text checked; they reach {r['hit']} of {len(L)} clips (credits.0 is played by key; the Grasping Mind and Engine intros share one line with the Void, so that clip serves all three); wrong key: {r['bad'][:3] or 'none'}; clips no game text reaches: {r['unreached'][:4] or 'none'}")
        # 3) lazy load: nothing loads at start or in the world; one clip per line shown
        await pg.evaluate("__kitEnter('l1')"); await pg.wait_for_timeout(900)
        at_start = len(req)
        r = await pg.evaluate("""(async()=>{""" + sleep + """__kitDef('l1');ARTI.kierkegaard.items.forEach((_,i)=>P.f['kierkegaard:'+i]=1);
          startTalk(npcs.find(n=>n.id==='kierkegaard'));await sleep(300);const a={key:VO.key,loads:VO.loads};
          finishType();advance();await sleep(300);a.key2=VO.key;a.loads2=VO.loads;a.id0=VOICE_MAP['talk.kierkegaard.intro.0'];a.id1=VOICE_MAP['talk.kierkegaard.intro.1'];return a})()""")
        got = [u.split("/_blob/")[1][:32] for u in req[at_start:]]
        ok = at_start == 0 and r["key"] == "talk.kierkegaard.intro.0" and r["key2"] == "talk.kierkegaard.intro.1" and got[:1] == [r["id0"]] and r["id1"] in got and len(set(got)) == 2
        self.add("p44", "voice_lazy_load", ok, f"voice requests at page start and in the world: {at_start}; first talk line -> {r['key']} ({r['loads']} load), next line -> {r['key2']}; clips requested: {len(set(got))} ({'first line first' if got[:1]==[r['id0']] else 'order wrong'})")
        await ctx.close()
        # 4) a new line, a closed talk, a mini-game card change, a sign, and a hidden page each stop the clip
        ctx, pg, errs, ids = await self.voice_page(b)
        r = await pg.evaluate("""(async()=>{""" + sleep + """const o={};__kitEnter('l1');__kitDef('l1');ARTI.kierkegaard.items.forEach((_,i)=>P.f['kierkegaard:'+i]=1);
          startTalk(npcs.find(n=>n.id==='kierkegaard'));await sleep(400);o.a=[VO.key,VO.playing()];
          finishType();advance();await sleep(400);o.b=[VO.key,VO.playing(),VO.log.includes('stop talk.kierkegaard.intro.0')];
          leaveTalk();await sleep(100);o.c=[VO.key,VO.el.paused];
          const id=Object.keys(MINI).find(k=>MINI[k].setup&&MINI[k].setup.length>1&&VOICE_MAP['mini.'+k+'.setup.1']);startMini(id);await sleep(300);o.d=[id,VO.key,VO.playing()];
          miniAct('mnext');await sleep(300);o.e=[VO.key,VO.playing()];
          MS.i=MINI[id].setup.length;miniCard();await sleep(100);o.f=[VO.key,VO.el.paused];closeMini();
          openSign('Kierkegaard',[ARTI.kierkegaard.hint,'x']);await sleep(300);o.g=[VO.key,VO.playing()];closeSign();o.h=[VO.key,VO.el.paused];
          const S=TALK.socrates;__kitDef('l2');ARTI.socrates.items.forEach((_,i)=>P.f['socrates:'+i]=1);startTalk(npcs.find(n=>n.id==='socrates'));await sleep(300);
          let g=0;while(TK&&g++<20){const s=TK.steps[TK.i];if(!TK.fb&&s.t==='ask')break;finishType();advance()}reply(0);await sleep(250);o.i=[VO.key,VO.q.slice()];
          leaveTalk();return o})()""")
        ok = (r["a"] == ["talk.kierkegaard.intro.0", True] and r["b"] == ["talk.kierkegaard.intro.1", True, True] and r["c"] == [None, True]
              and r["d"][1] == f"mini.{r['d'][0]}.setup.0" and r["d"][2] and r["e"] == [f"mini.{r['d'][0]}.setup.1", True] and r["f"] == [None, True]
              and r["g"] == ["talk.kierkegaard.hint", True] and r["h"] == [None, True]
              and (r["i"][0] or "").startswith("talk.socrates.affirm.") and r["i"][1] == ["talk.socrates.q0.w"])
        self.add("p44", "voice_stops_on_change", ok, f"talk: {r['a']} -> next line {r['b'][:2]} (old clip stopped: {r['b'][2]}) -> leave {r['c']}; mini {r['d'][0]}: {r['d'][1:]} -> next card {r['e']} -> how-to card {r['f']}; sign hint {r['g']} -> closed {r['h']}; a right answer speaks {r['i'][0]} then queues {r['i'][1]} (the thinker's own affirmation voice)")
        # 5) the bed goes down while a voice plays
        r = await pg.evaluate("""(async()=>{""" + sleep + """auInit();await sleep(200);const o={ctx:!!AU.ctx};__kitDef('l1');startTalk(npcs.find(n=>n.id==='kierkegaard'));await sleep(900);
          o.on=[VO.duck,AU.ambBus?+AU.ambBus.gain.value.toFixed(2):null];leaveTalk();await sleep(1600);o.off=[VO.duck,AU.ambBus?+AU.ambBus.gain.value.toFixed(2):null];return o})()""")
        ok = r["on"][0] is True and r["off"][0] is False and (not r["ctx"] or (r["on"][1] < 0.2 and r["off"][1] > 0.25))
        self.add("p44", "voice_ducks_bed", ok, f"background bed gain while a voice plays {r['on']}, after it stops {r['off']} (audio context: {r['ctx']})")
        await ctx.close()
        # 6) Voice Off, or Sound Off: nothing loads and nothing plays
        req = []
        ctx, pg, errs, ids = await self.voice_page(b, req)
        r = await pg.evaluate("""(async()=>{""" + sleep + """const o={};__kitEnter('l1');__kitDef('l1');ARTI.kierkegaard.items.forEach((_,i)=>P.f['kierkegaard:'+i]=1);
          setVoice(false);startTalk(npcs.find(n=>n.id==='kierkegaard'));await sleep(300);finishType();advance();await sleep(300);o.off=[VO.key,VO.loads];leaveTalk();
          setVoice(true);setSound(false);startTalk(npcs.find(n=>n.id==='kierkegaard'));await sleep(300);o.snd=[VO.key,VO.loads];leaveTalk();
          setSound(true);startTalk(npcs.find(n=>n.id==='kierkegaard'));await sleep(300);o.on=[VO.key,VO.playing()];setVoice(false);o.mid=[VO.key,VO.el.paused];
          setVoice(true);finishType();advance();await sleep(300);o.again=VO.key;setSound(false);o.sndmid=[VO.key,VO.el.paused];setSound(true);leaveTalk();return o})()""")
        ok = r["off"] == [None, 0] and r["snd"] == [None, 0] and r["on"][0] == "talk.kierkegaard.intro.0" and r["on"][1] and r["mid"] == [None, True] and r["again"] == "talk.kierkegaard.intro.1" and r["sndmid"] == [None, True]
        self.add("p44", "voice_off_silent", ok, f"Voice Off: key {r['off'][0]}, loads {r['off'][1]}; Sound Off with Voice On: key {r['snd'][0]}, loads {r['snd'][1]}; Voice Off during a clip stops it {r['mid']}; Sound Off during a clip stops it {r['sndmid']}")
        await ctx.close()
        # 7) the switch is in the pause menu and the mini-game pause card, and it never writes to P
        ctx, pg, errs, ids = await self.voice_page(b)
        r = await pg.evaluate("""(async()=>{""" + sleep + """const o={};__kitEnter('l1');await sleep(200);const p0=JSON.stringify(P),s0=localStorage.getItem(KEY);
          openPanel('menu','world');await sleep(100);const btn=()=>document.querySelector('#panel [data-act="voice"]');o.menu0=btn()&&btn().textContent;btn().click();await sleep(100);o.menu1=btn()&&btn().textContent;o.ls1=localStorage.getItem('examined-life-voice');o.v1=VOICE_ON;
          btn().click();await sleep(100);o.menu2=btn()&&btn().textContent;o.ls2=localStorage.getItem('examined-life-voice');o.pMenu=JSON.stringify(P)===p0&&localStorage.getItem(KEY)===s0;closePanel&&closePanel();
          const id=Object.keys(MINI).find(k=>!MINI[k].boss);startMini(id);miniAct('mbegin');await sleep(100);miniPause();await sleep(50);const p1=JSON.stringify(P),s1=localStorage.getItem(KEY);const mb=()=>document.querySelector('#mCard [data-act="voice"]');
          o.mini0=mb()&&mb().textContent;mb().click();await sleep(100);o.mini1=mb()&&mb().textContent;mb().click();await sleep(50);o.mini2=mb()&&mb().textContent;o.pMini=JSON.stringify(P)===p1&&localStorage.getItem(KEY)===s1;miniResume();closeMini();
          o.pHasVoice=/voice/i.test(JSON.stringify(P));return o})()""")
        ok = (r["menu0"] == "Voice: On" and r["menu1"] == "Voice: Off" and r["ls1"] == "0" and r["v1"] is False and r["menu2"] == "Voice: On" and r["ls2"] == "1"
              and r["mini0"] == "Voice: On" and r["mini1"] == "Voice: Off" and r["mini2"] == "Voice: On" and r["pMenu"] and r["pMini"] and not r["pHasVoice"])
        self.add("p44", "voice_switch_device_only", ok, f"pause menu: {r['menu0']} -> {r['menu1']} (examined-life-voice={r['ls1']}) -> {r['menu2']}; mini-game pause card: {r['mini0']} -> {r['mini1']} -> {r['mini2']}; P and the saved game unchanged by the menu switch: {r['pMenu']}, by the pause-card switch: {r['pMini']}; any voice field in P: {r['pHasVoice']}")
        await ctx.close()
        # 8) the story pages and the credits speak in the narrator's voice
        ctx, pg, errs, ids = await self.voice_page(b)
        r = await pg.evaluate("""(async()=>{""" + sleep + """const o={keys:[]};P.intro=false;BUILTIN_ART['vid-intro']=null;beginJourney();await sleep(250);
          for(let i=0;i<8&&screen==='story';i++){o.keys.push(VO.key);nextStory();await sleep(200)}
          showCredits();await sleep(300);o.cred=[VO.key,VO.playing()];show('title');await sleep(50);o.after=VO.key;return o})()""")
        ok = r["keys"][:3] == ["story.intro.0", "story.intro.1", "story.intro.2"] and r["cred"] == ["credits.0", True] and r["after"] is None
        self.add("p44", "voice_story_credits", ok, f"story pages speak {r['keys'][:4]}; credits {r['cred']}; leaving the credits stops it ({r['after']})")
        await ctx.close()
        # 9) without mini/voice.js the game still runs, with text only
        ctx, pg, errs = await self.page(b, block=["mini/voice.js"])
        r = await pg.evaluate("""(async()=>{""" + sleep + """__kitEnter('l1');__kitDef('l1');ARTI.kierkegaard.items.forEach((_,i)=>P.f['kierkegaard:'+i]=1);startTalk(npcs.find(n=>n.id==='kierkegaard'));await sleep(200);
          finishType();advance();await sleep(100);const o={vo:typeof window.VO,txt:document.querySelector('#dTxt').textContent.slice(0,30),step:TK&&TK.i};leaveTalk();openPanel('menu','world');o.btn=!!document.querySelector('#panel [data-act="voice"]');return o})()""")
        ok = r["vo"] == "undefined" and r["step"] == 1 and r["txt"] and not errs
        self.add("p44", "voice_script_optional", ok, f"with mini/voice.js blocked: VO is {r['vo']}, the talk moved to step {r['step']} ('{r['txt']}…'), page errors: {errs[:1] or 'none'}")
        await ctx.close()
        sz = os.path.getsize(os.path.join(os.path.dirname(self.path), "mini", "voice.js"))
        self.add("p44", "voice_js_size", sz < 150000, f"mini/voice.js is {sz:,} bytes (line: 150 KB)")


    async def p36(self, b):
        """Phase 36: the gallery and Journal plate thumbnails (kit36_a.py, 36-A), the speed budget and art release (kit36_b.py, 36-B), and the Goalkeeper Try again fix (lead)."""
        here = os.path.dirname(os.path.abspath(__file__))
        for mod in ("kit36_a", "kit36_b"):
            f = os.path.join(here, mod + ".py")
            if not os.path.exists(f):
                self.add("p36", mod, False, f"{mod}.py is missing"); continue
            ns = dict(globals()); exec(compile(open(f, encoding="utf-8").read(), f, "exec"), ns)
            try:
                await ns["run"](self, b)
            except Exception as e:
                self.add("p36", mod, False, f"{mod}.run raised: {str(e)[:200]}")
        # ---- Goalkeeper: Try again on Stage II keeps what Stage I really earned (the KEEP bug from 32C) ----
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate(r"""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const g=MINI.goalkeeper;
startMini('goalkeeper',{replay:true});MS.mode='play';const s=MS.s;
/* finish Stage I with a sentinel number of commitments (more than half, so the stage passes) */
s.st=0;s.cm[0]=1000;s.shotI=99;s.ph='after';s.phT=999;const r1=g.step(s,.05,miniBlankInp());const st1=MS.s.st;
/* Stage II goes badly: the stage ends, then Try again */
MS.mode='over';miniCard();await sleep(30);const btn=document.querySelector('#mCard [data-act="mtry"]');if(btn)btn.click();await sleep(30);
const out={r1:r1||null,st1,btn:!!btn,st:MS&&MS.s.st,cm0:MS&&MS.s.cm[0],tally:MS&&MS.s.tally};
/* a fresh start forgets it */
miniPlay(true);out.fresh0=MS.s.cm[0];out.freshSt=MS.s.st;closeMini();return out})()""")
        ok = r["btn"] and r["st1"] == 1 and r["st"] == 1 and r["cm0"] == 1000 and r["tally"] == 1000 and r["freshSt"] == 0 and r["fresh0"] == 0 and not errs
        self.add("p36", "goalkeeper_retry_keeps", ok, f"after Stage I with 1000 commitments, Try again on Stage II: stage {r['st']}, Stage I kept {r['cm0']} (tally {r['tally']}); fresh start: stage {r['freshSt']}, cm0 {r['fresh0']}" + (f"; errors {errs[:1]}" if errs else ""))
        await ctx.close()

    async def p35(self, b):
        """Phase 35B/35C: the boss rounds Carry It Anyway (boss_b1), The Still Center (boss_b2), Open Hands (boss_b3) and The Three Lenses (boss_b4)."""
        ids = ["boss_b1", "boss_b2", "boss_b3", "boss_b4"]
        await self.mini_suite(b, "p35", ids)
        await self.hd_suite(b, "p35", ids)
        blobs = bool(self.args.blobs)
        # ---------------- Carry It Anyway ----------------
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate(r"""(async(blobs)=>{const out={};const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const S=(n)=>{const s={W:192,H:320,rm:false,t:0};MINI.boss_b1.init(s);if(n)MINI.boss_b1.toStage(s,n);return s};
const r2=x=>+(+x).toFixed(3);const g=MINI.boss_b1,T=g._t,A=()=>MINI_ART.boss_b1,blank=()=>miniBlankInp();
const step=(s,f)=>{const inp=blank();if(f)f(s,inp);s.t+=.05;return g.step(s,.05,inp)};
const run=(s,sec,f,stop)=>{let res=null;for(let i=0;i<Math.round(sec/.05);i++){if(stop&&stop())break;const r=step(s,f);if(r){res=r;break}}return res};
const quiet=s=>{s.spT=1e9};
const wispAt=(s,x,y)=>{const w={x,y,vx:0,vy:0,sp:0,fast:false,dead:false,dying:0,ph:0,tr:[],tt:0};s.wisps.push(w);return w};
if(blobs){loadMiniArt('boss_b1');loadAtlas('chars');for(let i=0;i<80;i++){const a=A();const ids=[a.atlas,...(a.bg||[])];if(ids.every(x=>MIMG[x]&&(MIMG[x].ok||MIMG[x].bad))&&ATLAS_IMG.chars&&ATLAS_IMG.chars.ok)break;await sleep(50)}}
out.artOk=blobs?mArtOk('boss_b1'):null;
/* ---------------- seven lights, each blocks one wisp, then 4 s ---------------- */
{const L={};const ph=LEVELS.find(v=>v.id==='l1').ph,s=S();L.n=s.lights.length;L.ph=ph.slice();L.ids=s.lights.map(l=>l.id);L.icons=s.lights.map(l=>l.icon);L.want=A().lights.slice();
 L.rects=s.lights.map(l=>!!A().rects[l.icon]);L.cols=s.lights.map(l=>l.col);L.wantCols=A().lights.map(n=>A().geo.colors[n]);L.uniq=new Set(L.icons).size;L.uniqCol=new Set(L.cols).size;
 if(blobs){const rec=[],om=window.mPiece;window.mPiece=function(c,id,name){rec.push(name);return om.apply(this,arguments)};
   try{const cv=document.createElement('canvas');cv.width=384;cv.height=640;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);g.draw(s,c,1000)}finally{window.mPiece=om}
   L.drawn=s.lights.map(l=>rec.includes(l.icon))}
 L.blk=[];
 for(let i=0;i<7;i++){const s2=S();quiet(s2);s2.lights.forEach((l,j)=>{if(j!==i)l.cool=500});const lt=s2.lights[i];const T0=T.lc(s2);wispAt(s2,T0.x+3,T0.y);
   step(s2);const afterBlock={cool:r2(lt.cool),n:lt.n,hits:s2.hits,blocked:s2.blocked,dead:s2.wisps.filter(w=>w.dead).length};
   // a second wisp while it recovers: not blocked by this light (it is a hit, since every other light is unready)
   const T1=T.lc(s2);wispAt(s2,T1.x+3,T1.y);step(s2);const second={n:lt.n,hits:s2.hits};
   let k=0;while(lt.cool>0&&k<400){step(s2);k++}
   L.blk.push({i,afterBlock,second,sec:r2((k+1)*.05)})}
 // A sends the nearest ready light at the wisp nearest you; a tap on a wisp sends the nearest ready light
 {const s3=S();quiet(s3);const w=wispAt(s3,60,150),w2=wispAt(s3,150,60);const inp=blank();inp.aTap=true;s3.t+=.05;g.step(s3,.05,inp);L.a={dead:[w.dead,w2.dead],cool:s3.lights.filter(l=>l.cool>0).length};
  const s4=S();quiet(s4);const w4=wispAt(s4,40,100);const inp4=blank();inp4.taps=[{x:44,y:104}];inp4.tap=inp4.taps[0];s4.t+=.05;g.step(s4,.05,inp4);L.tap={dead:w4.dead,cool:s4.lights.filter(l=>l.cool>0).length};
  const s5=S();quiet(s5);const w5=wispAt(s5,40,100);const inp5=blank();inp5.taps=[{x:100,y:200}];s5.t+=.05;g.step(s5,.05,inp5);L.tapMiss={dead:w5.dead}}
 out.lights=L}
/* ---------------- never stops you ---------------- */
{const N={};const s0=S();quiet(s0);let t0=0;const hold=(s,inp)=>{inp.dy=-1};
 while(t0<400&&!run(s0,.05,hold))t0+=.05;N.base=r2(t0+.05);
 const s=S();let t=0,minRatio=9,maxRatio=0,dec=0,zero=0,res=null,hitsSeen=0,prevP=0,stillBefore;
 for(let i=0;i<9000&&!res;i++){s.lights.forEach(l=>{l.cool=99});s.spT=Math.min(s.spT,.25);const p0=s.p,slow0=s.slow>0,st0=s.st;
   res=step(s,hold);t+=.05;const dp=s.p-p0;if(res)break;if(dp<=0)zero++;if(dp<0)dec++;const f=dp/(.05/T.WALK);minRatio=Math.min(minRatio,f);maxRatio=Math.max(maxRatio,f)}
 N.res=res;N.t=r2(t);N.zero=zero;N.dec=dec;N.hits=s.hits;N.spawned=s.spawned;N.minRatio=r2(minRatio);N.maxRatio=r2(maxRatio);N.bound=r2(3*N.base);
 // a hit in each wave: 60% speed for 2 s, never stacking, never stopping, nothing knocks you back
 N.waves=[0,1,2].map(n=>{const q=S(n);quiet(q);q.lights.forEach(l=>{l.cool=99});const T0=T.lc(q);wispAt(q,T0.x,T0.y);wispAt(q,T0.x+2,T0.y);wispAt(q,T0.x-2,T0.y);const x0=q.x,p0=q.p;
   const inp=blank();inp.dy=-1;q.t+=.05;g.step(q,.05,inp);const hits=q.hits,slow=q.slow;let rs=[];for(let i=0;i<50;i++){const pp=q.p,sl=q.slow>0;const inp2=blank();inp2.dy=-1;q.t+=.05;g.step(q,.05,inp2);rs.push([sl,(q.p-pp)/(.05/T.WALK)])}
   const slowed=rs.filter(x=>x[0]).map(x=>x[1]);return {n,hits,slow:r2(slow),x:q.x===x0,minSlow:r2(Math.min(...slowed)),maxSlow:r2(Math.max(...slowed)),nSlow:slowed.length,later:r2(rs[rs.length-1][1])}});
 // standing still makes no progress in Waves I and III
 N.still=[0,2].map(n=>{const q=S(n);quiet(q);const p0=q.p;run(q,3);return r2(q.p-p0)});
 out.never=N}
/* ---------------- three waves ---------------- */
{const W={};
 // auto play through the real engine: stage banners, the two lines, p at each stage change
 const os=window.stageUp,calls=[];window.stageUp=function(s,n){const r=os.apply(this,arguments);if(MS&&MS.s===s)calls.push([s.st,r2(s.p)]);return r};
 const seen=[],ob=window.miniBanner,say=[],osay=window.miniSay;window.miniBanner=function(t){seen.push(t);return ob.apply(this,arguments)};window.miniSay=function(t,d){say.push(t);return osay.apply(this,arguments)};
 __kitEnter('l1');await sleep(60);startMini('boss_b1',{boss:true});MS.i=g.setup.length;miniAct('mbegin');MS.auto=true;stopMiniLoop();let guard=0,mx=0;
 while(MS&&MS.mode==='play'&&guard++<4000){miniTick(.05);mx=Math.max(mx,MS.s.st)}
 W.mode=MS.mode;W.pips=document.querySelectorAll('#mTitle .mpips i').length;W.t=r2(MS.sess.t);const fin=MS.s;W.blocked=fin.blocked;W.hits=fin.hits;closeMini();window.stageUp=os;window.miniBanner=ob;window.miniSay=osay;
 W.calls=calls;W.seen=seen;W.say=say;W.stages=g.stages;W.lines=g.lines;
 // Wave II: the swirl is up and the pull works
 {const s=S(1);quiet(s);run(s,3.2);const p0=s.p;W.sw=r2(s.sw);const s2=S(1);quiet(s2);s2.p=.5;const a=s2.p;run(s2,3);W.slip3=r2(a-s2.p);W.floorAfter3=s2.p>=T.T1-1e-9;
  const s3=S(1);quiet(s3);s3.p=.5;run(s3,40);W.floor=r2(s3.p);W.floorT1=r2(T.T1);W.stage=s3.st;
  // walking in Wave II is 80% speed
  const s4=S(1);quiet(s4);const b0=s4.p;run(s4,2,(s,inp)=>{inp.dy=-1});W.walk80=r2((s4.p-b0)/(2/T.WALK));
  // a recovering light does not recover while you stand still, and does while you walk
  const s5=S(1);quiet(s5);s5.lights[0].cool=3;run(s5,2);W.stillCool=r2(s5.lights[0].cool);run(s5,2,(s,inp)=>{inp.dy=-1});W.walkCool=r2(s5.lights[0].cool);
  // pulled out toward the Void while recovering, back in its place when it is ready
  const s6=S(1);quiet(s6);s6.lights[2].cool=4;run(s6,3);const pos=T.lightPos(s6,s6.lights[2]),orb=T.orbitPos(s6,s6.lights[2]);W.outUp=r2(orb.y-pos.y);W.out=r2(s6.lights[2].out);
  // control: in Waves I and III a recovering light recovers while you stand still, and nothing slips
  W.ctl=[0,2].map(n=>{const q=S(n);quiet(q);q.lights[0].cool=3;const pp=q.p;run(q,2);return {n,cool:r2(q.lights[0].cool),dp:r2(q.p-pp)}});
  // ready lights lean toward the face: the orbit's top is taller than its bottom
  const s7=S(1);quiet(s7);run(s7,2);let top=0,bot=0;for(let a=0;a<6.28;a+=.1){const o=T.orbitPos(s7,{a});const c=T.lc(s7);if(o.y<c.y)top=Math.max(top,c.y-o.y);else bot=Math.max(bot,o.y-c.y)}W.lean={top:r2(top),bot:r2(bot)};
  // the pull on a light is drawn: the swirl piece is drawn in Wave II and not in Wave I
  if(blobs){const cv=document.createElement('canvas');cv.width=384;cv.height=640;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);const rec=[],om=window.mPiece;window.mPiece=function(cc,id,name){rec.push(name);return om.apply(this,arguments)};
   try{const a=S(0),b2=S(1);run(b2,3);rec.length=0;g.draw(a,c,1000);const r0=rec.includes('void_swirl');rec.length=0;g.draw(b2,c,1000);W.swirlDrawn=[r0,rec.includes('void_swirl')]}finally{window.mPiece=om}}}
 // Wave III: the wisps come thick (a fixed 60 s window, standing still), the orbit is smaller and quicker, and the dawn line shows
 {const cnt=n=>{let sum=0;for(let k=0;k<3;k++){const q=S(n);q.spT=0;const sp0=q.spawned;run(q,60);sum+=q.spawned-sp0}return sum/3};
  W.rate=[cnt(0),cnt(1),cnt(2)];W.ratio=r2(W.rate[2]/W.rate[0]);
  const orb=n=>{const q=S(n);quiet(q);run(q,3);const c=T.lc(q);let mxd=0;for(let a=0;a<6.28;a+=.1){const o=T.orbitPos(q,{a});mxd=Math.max(mxd,Math.hypot(o.x-c.x,o.y-c.y))}return {max:r2(mxd),om:r2(q.om)}};W.orbit=[orb(0),orb(1),orb(2)];
  const dw=(n,p)=>{const q=S(n);quiet(q);q.p=p;run(q,6,(s,inp)=>{inp.down=null});return r2(q.dawn)};W.dawn=[dw(0,.2),dw(1,.5),dw(2,.7),dw(2,.95)];
  // the dawn line is drawn: the horizon band is warmer with it than without (red channel)
  const cv=document.createElement('canvas');cv.width=192;cv.height=320;const c=cv.getContext('2d');const q=S(2);quiet(q);run(q,6);
  const band=()=>{g.draw(q,c,1000);const d=c.getImageData(2,80,38,6).data;let r=0,gg=0,bb=0;for(let i=0;i<d.length;i+=4){r+=d[i];gg+=d[i+1];bb+=d[i+2]}return [r,gg,bb]};
  band();await new Promise(r=>setTimeout(r,400)); /* 36-B: art is released when a game closes and loads again on the first draw, so draw once and wait */ const lit=band(),keep=q.dawn;q.dawn=0;const dark=band();q.dawn=keep;W.band={lit:lit.map(x=>Math.round(x/228)),dark:dark.map(x=>Math.round(x/228))}}
 out.waves=W}
return out})(""" + ("true" if blobs else "false") + ")")
        await ctx.close()
        L = r["lights"]
        okl = (L["n"] == 7 and L["ids"] == L["ph"] and L["icons"] == L["want"] and all(L["rects"]) and L["cols"] == L["wantCols"] and L["uniq"] == 7 and L["uniqCol"] == 7
               and (not blobs or (r["artOk"] and all(L["drawn"])))
               and all(x["afterBlock"]["n"] == 1 and abs(x["afterBlock"]["cool"] - 4) < .06 and x["afterBlock"]["hits"] == 0 and x["afterBlock"]["dead"] == 1 and x["second"]["n"] == 1 and x["second"]["hits"] == 1 and abs(x["sec"] - 4) <= .06 for x in L["blk"])
               and L["a"]["dead"] == [True, False] and L["a"]["cool"] == 1 and L["tap"]["dead"] and L["tap"]["cool"] == 1 and not L["tapMiss"]["dead"])
        self.add("p35", "b1_seven_lights", okl,
                 f"{L['n']} lights = Level I's thinkers {L['ids']} (the game's own list, LEVELS l1 ph), icons {L['icons']} all in the atlas rects ({all(L['rects'])}), colors from geo.colors {L['cols']}; "
                 + (f"a draw called mPiece with all seven icons: {all(L['drawn'])} (art loaded: {r['artOk']}); " if blobs else "(no --blobs: the mPiece draw check is skipped); ")
                 + f"each light, alone ready, blocked exactly one wisp (cool {[x['afterBlock']['cool'] for x in L['blk']]}), blocked no second wisp while it recovered (hits +1 instead), and was ready again after {[x['sec'] for x in L['blk']]} s (want 4 +- 1 frame); A sent a light at the wisp nearest you ({L['a']}); a tap on a wisp sent one ({L['tap']}); a tap on empty ground sent none ({L['tapMiss']})")
        N = r["never"]
        okn = (N["res"] == "win" and N["t"] < N["bound"] and N["zero"] == 0 and N["dec"] == 0 and N["hits"] > 5 and N["minRatio"] >= .599 and N["maxRatio"] <= 1.001
               and all(w["hits"] == 3 and w["slow"] > 1.9 and w["x"] and w["minSlow"] >= .599 and w["maxSlow"] <= .801 and w["nSlow"] >= 38 and w["later"] >= .99 * (1 if w["n"] != 1 else .8) - .01 for w in N["waves"]) and N["still"] == [0, 0])
        self.add("p35", "b1_never_stops", okn,
                 f"with every light forced unready and a wisp every 0.25 s, holding up reached the dawn (p=1) in {N['t']} s (uninterrupted: {N['base']} s; bound 3x = {N['bound']} s) after {N['hits']} hits out of {N['spawned']} wisps; in {N['zero']} walking frames progress was zero or negative (want 0, {N['dec']} went backwards); the speed ratio stayed between {N['minRatio']} and {N['maxRatio']} (a hit: 60%, Wave II alone: 80%); "
                 f"three wisps at once in each wave: {[(w['n'], 'hits', w['hits'], 'slow', w['slow'], 'x unmoved', w['x'], 'ratio', w['minSlow'], w['maxSlow'], 'back to', w['later']) for w in N['waves']]}; standing still in Waves I and III made no progress ({N['still']})")
        W = r["waves"]
        want = [f"{n} · {s}" for n, s in zip(["I", "II", "III"], W["stages"])]
        okw = (W["mode"] in ("bloom", "result") and W["pips"] == 3 and all(w in W["seen"] for w in want) and [c[0] for c in W["calls"]] == [1, 2] and abs(W["calls"][0][1] - 1 / 3) < .01 and abs(W["calls"][1][1] - 2 / 3) < .01
               and W["lines"][1] in W["say"] and W["lines"][2] in W["say"] and W["sw"] >= .99 and W["slip3"] > .03 and W["floorAfter3"] and abs(W["floor"] - W["floorT1"]) < .002 and W["stage"] == 1 and abs(W["walk80"] - .8) < .02
               and abs(W["stillCool"] - 3) < .001 and abs(W["walkCool"] - 1) < .06 and W["outUp"] > 20 and W["out"] > .6 and all(abs(x["cool"] - 1) < .06 and abs(x["dp"]) < 1e-9 for x in W["ctl"]) and W["lean"]["top"] > 1.3 * W["lean"]["bot"]
               and (not blobs or W["swirlDrawn"] == [False, True])
               and W["ratio"] >= 1.6 and W["orbit"][2]["max"] < .7 * W["orbit"][0]["max"] and W["orbit"][2]["om"] > W["orbit"][0]["om"] + .3 and W["dawn"][0] == 0 and W["dawn"][1] == 0 and W["dawn"][2] > 0 and W["dawn"][3] > W["dawn"][2] and abs(W["band"]["lit"][2] - W["band"]["dark"][2]) > 15)
        self.add("p35", "b1_three_waves", okw,
                 f"auto play through the engine: {W['t']} s to the {W['mode']}, banners {sorted(set(W['seen']))}, HUD pips {W['pips']}; stage changes (stage, p) {W['calls']} (want p 1/3 and 2/3), lines played {[x for x in W['say'] if x]}; "
                 f"Wave II: swirl at {W['sw']} after 3 s, standing still 3 s slipped p by {W['slip3']}, standing 40 s settled at p={W['floor']} (the wave's start, {W['floorT1']}), walking runs at {W['walk80']} of full speed, a recovering light at cool 3 stayed {W['stillCool']} after 2 s standing and read {W['walkCool']} after 2 s walking, a light that blocked was drawn out {W['outUp']} units toward the face (out={W['out']}), ready lights lean (orbit top {W['lean']['top']} vs bottom {W['lean']['bot']}), controls in Waves I and III {W['ctl']}"
                 + (f", swirl drawn in Waves I/II {W['swirlDrawn']}" if blobs else "") + f"; "
                 f"wisps spawned in 60 s standing: Wave I {W['rate'][0]}, II {W['rate'][1]}, III {W['rate'][2]} (ratio III/I {W['ratio']}, want 1.6+); orbit radius {[o['max'] for o in W['orbit']]} (turn rate {[o['om'] for o in W['orbit']]}); dawn flag {W['dawn']} (Waves I, II, III at p .7, III at p .95); horizon band color with/without the dawn line {W['band']['lit']} / {W['band']['dark']}")
        # ---------------- The Still Center ----------------
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate(r"""(async(blobs)=>{const out={};const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const S=(n)=>{const s={W:192,H:320,rm:false,t:0};MINI.boss_b2.init(s);if(n)MINI.boss_b2.toStage(s,n);return s};
const r2=x=>+(+x).toFixed(3);const g=MINI.boss_b2,T=g._t,blank=()=>miniBlankInp();
const step=(s,f,dt)=>{const inp=blank();if(f)f(s,inp);s.t+=dt||.05;return g.step(s,dt||.05,inp)};
const run=(s,sec,f)=>{let res=null;for(let i=0;i<Math.round(sec/.05);i++){const r=step(s,f);if(r){res=r;break}}return res};
const autoRun=(s,sec,each)=>{let res=null,k=0;for(let i=0;i<Math.round(sec/.05);i++){const inp=blank();s.t+=.05;g.auto(s,inp);res=g.step(s,.05,inp);if(each)each(s,i);if(res)break}return res};
const at=(s,r,a)=>{s.x=T.HUB[0]+Math.cos(a)*r;s.y=T.HUB[1]+Math.sin(a)*r};
const calls=[];const osfx=window.sfx;window.sfx=function(n){calls.push(n);return osfx.apply(this,arguments)};
if(blobs){loadMiniArt('boss_b2');loadAtlas('chars');for(let i=0;i<80;i++){const a=MINI_ART.boss_b2;const ids=[a.atlas,...(a.bg||[])];if(ids.every(x=>MIMG[x]&&(MIMG[x].ok||MIMG[x].bad))&&ATLAS_IMG.chars&&ATLAS_IMG.chars.ok)break;await sleep(50)}}
out.artOk=blobs?mArtOk('boss_b2'):null;
/* ---------------- the push grows with distance from the hub ---------------- */
{const P={};const disp=(r,om,brace)=>{const s=S();s.omLock=om;at(s,r,.7);const x0=s.x,y0=s.y;const inp=blank();inp.a=!!brace;s.t+=.01;g.step(s,.01,inp);const dx=s.x-x0,dy=s.y-y0,ux=(x0-T.HUB[0])/r,uy=(y0-T.HUB[1])/r;return {mag:Math.hypot(dx,dy)/.01,rad:(dx*ux+dy*uy)/.01,tan:(-dx*uy+dy*ux)/.01}};
 P.rs=[20,35,50,65];P.free=P.rs.map(r=>disp(r,2,false));P.brace=P.rs.map(r=>disp(r,2,true));P.inside=[0.5,6,13.9].map(r=>disp(r,3.2,false));P.insideB=[6,13.9].map(r=>disp(r,3.2,true));P.edge=disp(14.6,2,false);
 P.fast=P.rs.map(r=>disp(r,3,false));P.slowW=P.rs.map(r=>disp(r,1,false));P.H=T.H;
 // the push is the same all the way around the wheel
 P.around=[0,1.3,2.6,4,5.4].map(a=>{const s=S();s.omLock=2;at(s,40,a);const x0=s.x,y0=s.y;s.t+=.01;g.step(s,.01,blank());return Math.hypot(s.x-x0,s.y-y0)/.01});
 out.push=P}
/* ---------------- prizes pull outward ---------------- */
{const Z={};
 // Wave I has no prizes
 {const s=S();let n=0,mp=0;autoRun(s,9.5,(q)=>{mp=Math.max(mp,q.prizes.length);n=q.thrown});Z.w1={hub:r2(s.hub),st:s.st,thrown:s.thrown,maxPrizes:mp};
  const s2=S(1);autoRun(s2,6,()=>0);Z.w2={thrown:s2.thrown,st:s2.st}}
 const trial=(brace,withPrize,r)=>{const s=S(1);s.pT=1e9;s.omLock=0;at(s,r,.5);const d0=T.radius(s);calls.length=0;
   let p=null;if(withPrize){p=T.mkPrize(s.x,s.y-6,0,0,1);p.in=true;s.prizes.push(p)}
   const rs=[];let st1=0;for(let i=0;i<10;i++){step(s,(q,inp)=>{inp.a=brace});if(i===0&&p)st1=p.stuck;rs.push(T.radius(s)-d0)}
   return {dr:r2(rs[rs.length-1]),peak:r2(Math.max(...rs)),caught:s.caught,bumped:s.bumped,snag:calls.includes('snag'),pick:calls.includes('pick'),stuck:r2(st1),hit:p?p.hit:null,still:p?s.prizes.includes(p):null}};
 Z.free=trial(false,true,40);Z.braced=trial(true,true,40);Z.noPrizeFree=trial(false,false,40);Z.noPrizeBraced=trial(true,false,40);Z.far={free:0};
 {const s=S(1);s.pT=1e9;s.omLock=0;at(s,40,.5);const p=T.mkPrize(s.x+30,s.y,0,0,1);p.in=true;s.prizes.push(p);const d0=T.radius(s);run(s,.5);Z.far.free=r2(T.radius(s)-d0);Z.far.hit=p.hit}
 Z.inHub=[false,true].map(br=>trial(br,true,3).dr);
 // the throws: they start at her face, their paths pass within 25 of the hub, and they leave past the rim
 {const mins=[],starts=[];let leave=0,N=80;for(let i=0;i<N;i++){const s=S(1);s.pT=1e9;s.x=T.HUB[0];s.y=T.HUB[1];T.throwPrize(s);const p=s.prizes[0];starts.push(Math.hypot(p.x-96,p.y-40));
   const vx=p.vx,vy=p.vy,v=Math.hypot(vx,vy);const t0=((T.HUB[0]-p.x)*vx+(T.HUB[1]-p.y)*vy)/(v*v);mins.push(Math.hypot(p.x+vx*t0-T.HUB[0],p.y+vy*t0-T.HUB[1]));
   let k=0;while(s.prizes.length&&k<400){s.x=T.HUB[0]+60;s.y=T.HUB[1]+60;step(s);k++}if(!s.prizes.length)leave++}
  Z.throws={n:N,maxMin:r2(Math.max(...mins)),maxStart:r2(Math.max(...starts)),leave}}
 out.prizes=Z}
/* ---------------- the citadel ---------------- */
{const C={};const cits=[];
 {const s=S();let max01=0;const cs=[];autoRun(s,45,(q,i)=>{if(q.st<2)max01=Math.max(max01,q.cit);if(q.st>=2)cs.push([r2(q.stT),r2(q.cit)])});C.max01=max01;C.cs=cs.length?[cs[0],cs[Math.round(cs.length*.2)],cs[Math.round(cs.length*.35)],cs.find(x=>x[1]>=1)||null]:[];C.stage=s.st}
 // inside the citadel: no push, and a prize aimed straight at you is deflected
 {const mk=(n,cit)=>{const s=S(n);s.pT=1e9;s.omLock=3.2;s.cit=cit;s.x=T.HUB[0]+2;s.y=T.HUB[1]+1;return s};
  const tryHit=(s)=>{const p=T.mkPrize(s.x,s.y-76,0,80,0);s.prizes.push(p);const x0=s.x,y0=s.y;let maxv=0,minvy=0;for(let i=0;i<60;i++){step(s);minvy=Math.min(minvy,p.vy)}
    return {hit:p.hit,bnc:p.bnc,vyAfter:r2(p.vy),moved:r2(Math.hypot(s.x-x0,s.y-y0)),caught:s.caught,bumped:s.bumped}};
  C.inside=tryHit(mk(2,1));C.outsideWave2=tryHit(mk(1,0));C.notYet=tryHit(mk(2,.5));
  const s=mk(2,1);const x0=s.x,y0=s.y;run(s,2);C.noPush=r2(Math.hypot(s.x-x0,s.y-y0));C.hubTime=r2(s.hub);
  // just outside it (r=15) the push is back and a prize still touches you
  const s2=mk(2,1);at(s2,30,.4);const q0=T.radius(s2);run(s2,.5);C.outsidePush=r2(T.radius(s2)-q0)}
 // the rain stops inside the citadel (the drawn rain strokes: none near the hub with the citadel up, some elsewhere)
 {const cv=document.createElement('canvas');cv.width=384;cv.height=640;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);const pts=[];const om=CanvasRenderingContext2D.prototype.moveTo;
  CanvasRenderingContext2D.prototype.moveTo=function(x,y){if(this.strokeStyle==='rgba(185, 210, 222, 0.5)')pts.push([x,y]);return om.apply(this,arguments)};
  const near=()=>pts.filter(p=>Math.hypot(p[0]-96,p[1]-160)<T.WALL+2).length;
  try{let cn=0,cnear=0,nn=0,nnear=0;for(let gt=1;gt<=24;gt++){const s=S(2);s.storm=1;s.cit=1;s.gt=gt*.77;pts.length=0;g.draw(s,c,1000);cn+=pts.length;cnear+=near();
      const s2=S(2);s2.storm=1;s2.cit=0;s2.gt=gt*.77;pts.length=0;g.draw(s2,c,1000);nn+=pts.length;nnear+=near()}
   C.rainCit={n:cn,near:cnear};C.rainNo={n:nn,near:nnear};pts.length=0;const s3=S(1);g.draw(s3,c,1000);C.rainW2=pts.length}finally{CanvasRenderingContext2D.prototype.moveTo=om}}
 if(blobs){const cv=document.createElement('canvas');cv.width=384;cv.height=640;const c=cv.getContext('2d');c.setTransform(2,0,0,2,0,0);const rec=[],om=window.mPiece;window.mPiece=function(cc,id,name){rec.push(name);return om.apply(this,arguments)};
  try{const a=S(0),b2=S(1),c3=S(2);c3.cit=1;g.draw(a,c,1000);const r0=rec.includes('citadel');rec.length=0;g.draw(b2,c,1000);const r1=rec.includes('citadel');rec.length=0;g.draw(c3,c,1000);C.drawn=[r0,r1,rec.includes('citadel')]}finally{window.mPiece=om}}
 // the win comes at 30 s of hub time, not 20
 {const s=S();let res=null,tHub20=null,k=0;for(let i=0;i<4000&&!res;i++){const inp=blank();s.t+=.05;g.auto(s,inp);const h0=s.hub;res=g.step(s,.05,inp);if(tHub20===null&&s.hub>=20)tHub20={res,hub:r2(s.hub),st:s.st};k++}C.win={res,hub:r2(s.hub),t:r2(k*.05),at20:tHub20,WIN:T.WIN}
  const q=S(2);q.hub=29.9;at(q,3,0);const a=step(q);const b3=run(q,.3);C.edge={before:a,after:b3,hub:r2(q.hub)};
  const o=S(2);o.hub=25;at(o,40,0);o.omLock=0;run(o,5);C.outside=r2(o.hub)}
 out.cit=C}
/* ---------------- waves by hub time ---------------- */
{const V={};calls.length=0;const os=window.stageUp,sc=[];window.stageUp=function(s,n){const r=os.apply(this,arguments);if(MS&&MS.s===s)sc.push([s.st,r2(s.hub)]);return r};
 const seen=[],ob=window.miniBanner,say=[],osay=window.miniSay;window.miniBanner=function(t){seen.push(t);return ob.apply(this,arguments)};window.miniSay=function(t,d){say.push(t);return osay.apply(this,arguments)};
 __kitEnter('l2');await sleep(60);startMini('boss_b2',{boss:true});MS.i=g.setup.length;miniAct('mbegin');MS.auto=true;stopMiniLoop();let guard=0;
 while(MS&&MS.mode==='play'&&guard++<4000)miniTick(.05);
 V.mode=MS.mode;V.pips=document.querySelectorAll('#mTitle .mpips i').length;V.t=r2(MS.sess.t);closeMini();window.stageUp=os;window.miniBanner=ob;window.miniSay=osay;V.sc=sc;V.seen=seen;V.say=say;V.stages=g.stages;V.lines=g.lines;
 V.om=[[0,0],[5,0],[10,0],[10,1],[15,1],[20,1],[20,2],[25,2],[30,2]].map(([h,st])=>r2(T.omegaFor(st,h)));
 V.calls=[...new Set(calls)];
 out.waves=V}
window.sfx=osfx;
return out})(""" + ("true" if blobs else "false") + ")")
        await ctx.close()
        P = r["push"]
        mg = [x["mag"] for x in P["free"]]; rd = [x["rad"] for x in P["free"]]
        okp = (all(mg[i] < mg[i + 1] for i in range(3)) and all(rd[i] < rd[i + 1] for i in range(3)) and all(x["mag"] == 0 for x in P["inside"]) and all(x["mag"] == 0 for x in P["insideB"]) and 0 < P["edge"]["mag"] < mg[0]
               and all(abs(P["brace"][i]["mag"] / mg[i] - .3) <= .05 for i in range(4)) and all(abs(P["fast"][i]["mag"] / mg[i] - 1.5) < .02 for i in range(4)) and all(abs(P["slowW"][i]["mag"] / mg[i] - .5) < .02 for i in range(4))
               and abs(rd[3] / rd[1] - (65 - 14) / (35 - 14)) < .02 and all(x["tan"] > 0 for x in P["free"]) and (max(P["around"]) - min(P["around"])) < 1e-6)
        self.add("p35", "b2_push_grows_with_distance", okp,
                 f"wheel locked at 2 rad/s, no input, one 0.01 s step: push (units/s) at r = {P['rs']} is {[round(x, 2) for x in mg]} (radial part {[round(x, 2) for x in rd]}, plus a sideways part along the spin {[round(x['tan'], 2) for x in P['free']]}): strictly growing, and the radial part scales with r - H (H = {P['H']}): r65/r35 = {rd[3]/rd[1]:.2f} (want {(65-14)/(35-14):.2f}); "
                 f"inside the hub (r = 0.5, 6, 13.9, at 3.2 rad/s) the push is {[x['mag'] for x in P['inside']]}, braced {[x['mag'] for x in P['insideB']]}; just outside it (r 14.6) {P['edge']['mag']:.2f}; bracing (hold A) leaves {[round(P['brace'][i]['mag']/mg[i], 3) for i in range(4)]} of it (want 0.30 +- 0.05); at 3 rad/s it is {[round(P['fast'][i]['mag']/mg[i], 2) for i in range(4)]}x and at 1 rad/s {[round(P['slowW'][i]['mag']/mg[i], 2) for i in range(4)]}x the 2 rad/s push (proportional to the wheel's speed); the same at every angle round the wheel: {max(P['around'])-min(P['around']):.1e} apart")
        Z = r["prizes"]
        okz = (Z["w1"]["thrown"] == 0 and Z["w1"]["maxPrizes"] == 0 and Z["w1"]["st"] == 0 and Z["w2"]["thrown"] >= 2
               and Z["free"]["dr"] > 4 and Z["braced"]["dr"] > Z["free"]["dr"] * 1.8 and Z["braced"]["dr"] > 15 and Z["free"]["bumped"] == 1 and Z["free"]["caught"] == 0 and not Z["free"]["snag"] and Z["free"]["still"] and Z["free"]["pick"]
               and Z["braced"]["caught"] == 1 and Z["braced"]["bumped"] == 0 and Z["braced"]["snag"] and Z["braced"]["stuck"] > 0 and abs(Z["noPrizeFree"]["dr"]) < 1e-6 and abs(Z["noPrizeBraced"]["dr"]) < 1e-6 and abs(Z["far"]["free"]) < 1e-6 and not Z["far"]["hit"]
               and Z["throws"]["maxMin"] <= 25.01 and Z["throws"]["maxStart"] <= 7 and Z["throws"]["leave"] == Z["throws"]["n"])
        self.add("p35", "b2_prizes_pull_outward", okz,
                 f"Wave I (auto, hub time {Z['w1']['hub']} s): prizes thrown {Z['w1']['thrown']} (want 0); Wave II: {Z['w2']['thrown']} thrown in 6 s; with the wheel still, a prize touching you at r = 40 moved you outward by {Z['free']['dr']} units in 0.5 s unbraced (bumped {Z['free']['bumped']}, the prize flew on: {Z['free']['still']}, no snag sound: {not Z['free']['snag']}) and {Z['braced']['dr']} units braced (caught {Z['braced']['caught']}, snag sound {Z['braced']['snag']}, the prize sticks to your hands {Z['braced']['stuck']} s), "
                 f"with no prize {Z['noPrizeFree']['dr']} / {Z['noPrizeBraced']['dr']}, with a prize 30 units away {Z['far']['free']}; in the hub a touch moves you {Z['inHub']} (it tugs, then the hub's still ground holds); {Z['throws']['n']} throws: each starts within {Z['throws']['maxStart']} of her face, its path passes at most {Z['throws']['maxMin']} units from the hub (want 25 or less), and {Z['throws']['leave']} of {Z['throws']['n']} left past the rim")
        C = r["cit"]
        okc = (C["max01"] == 0 and C["stage"] == 2 and C["cs"][0][1] < .1 and 0 < C["cs"][1][1] < 1 and C["cs"][3] is not None and 2.7 <= C["cs"][3][0] <= 3.3 and C["inside"]["hit"] is False and C["inside"]["bnc"] and C["inside"]["vyAfter"] < 0 and C["inside"]["moved"] == 0 and C["inside"]["caught"] == 0 and C["inside"]["bumped"] == 0
               and C["outsideWave2"]["hit"] and C["noPush"] == 0 and C["outsidePush"] > 2 and C["rainCit"]["n"] > 20 * 24 and C["rainCit"]["near"] == 0 and C["rainNo"]["near"] > 0 and C["rainCit"]["n"] < C["rainNo"]["n"] and C["rainW2"] == 0
               and (not blobs or C["drawn"] == [False, False, True])
               and C["win"]["res"] == "win" and 29.95 <= C["win"]["hub"] <= 30.05 and C["win"]["at20"]["res"] is None and C["edge"]["before"] is None and C["edge"]["after"] == "win" and C["outside"] == 25.0)
        self.add("p35", "b2_citadel_in_III", okc,
                 f"the citadel was absent in Waves I and II (cit never above {C['max01']}) and rose in III: (stage time, cit) = {C['cs']}, fully up after {C['cs'][3][0] if C['cs'][3] else None} s; inside it (locked wheel 3.2 rad/s) the push was {C['noPush']} over 2 s and a prize aimed straight at you bounced off its wall (touched you: {C['inside']['hit']}, bounced: {C['inside']['bnc']}, flew back at vy {C['inside']['vyAfter']}, you moved {C['inside']['moved']}, caught {C['inside']['caught']}, bumped {C['inside']['bumped']}) while the same prize with no citadel (Wave II) touched you: {C['outsideWave2']['hit']}, and with the citadel half risen {C['notYet']['hit']}; outside it (r 30) the push is back ({C['outsidePush']} units in 0.5 s); over 24 sampled draws, rain strokes within the citadel's footprint: {C['rainNo']['near']} without the citadel, {C['rainCit']['near']} with it ({C['rainCit']['n']} strokes drawn elsewhere against {C['rainNo']['n']}), none in Wave II ({C['rainW2']})"
                 + (f"; citadel drawn in Waves I/II/III: {C['drawn']}" if blobs else "") + f"; the win: {C['win']['res']} at {C['win']['hub']} s of hub time after {C['win']['t']} s of play (at hub time 20 it did not win: {C['win']['at20']['res']}); hub time 29.9 + 0.3 s -> {C['edge']['after']}; standing outside the hub adds nothing ({C['outside']})")
        V = r["waves"]
        want = [f"{n} · {s}" for n, s in zip(["I", "II", "III"], V["stages"])]
        okv = (V["mode"] in ("bloom", "result") and V["pips"] == 3 and all(w in V["seen"] for w in want) and [x[0] for x in V["sc"]] == [1, 2] and abs(V["sc"][0][1] - 10) < .1 and abs(V["sc"][1][1] - 20) < .1
               and V["lines"][1] in V["say"] and V["lines"][2] in V["say"] and V["om"] == [.6, 1.3, 2, 2, 2.2, 2.4, 2.4, 2.8, 3.2] and "storm" in V["calls"] and "citadel" in V["calls"] and "snag" not in V["calls"])
        self.add("p35", "b2_three_waves", okv,
                 f"auto play through the engine: {V['t']} s to the {V['mode']}, banners {sorted(set(V['seen']))}, HUD pips {V['pips']}; stage changes (stage, hub time) {V['sc']} (want 10 s and 20 s); lines played {[x for x in V['say'] if x]}; the wheel's speed by (hub time, wave) {V['om']} rad/s (0.6 -> 2 over I, 3.2 by the end of III); sounds heard {V['calls']}")
        # ---------------- the words ----------------
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate(r"""(()=>{const out={bad:[],kept:{}};const OLD={boss_b1:{setup:["The Void pours itself across the plain. Walk through it."],how:"Walk with the pad, or drag with your finger. Tap a dark wisp, or press A, to send a light at it.",win:"You carried it anyway. The Void recoils.",walk:"You keep walking. That’s enough."},
          boss_b2:{setup:["Fortune’s wheel turns under your feet. Find the one place it can’t move you."],how:"Move with the pad or your finger. Hold A to close your hands: you hold your ground, but you catch what Fortune throws.",win:"The wheel spins on without you. Fortune scowls.",walk:"You find your footing. Fortune looks away."}};
          for(const id of ['boss_b1','boss_b2']){const g=MINI[id];const strs=[g.title,...(g.setup||[]),g.how,g.win,g.walk,...(g.stages||[]),...(g.lines||[])].filter(x=>typeof x==='string');
            strs.forEach(x=>{if(/'/.test(x))out.bad.push(id+': '+x)});
            out.kept[id]=JSON.stringify([g.setup,g.how,g.win,g.walk])===JSON.stringify([OLD[id].setup,OLD[id].how,OLD[id].win,OLD[id].walk]);
            out[id]={fields:[g.who,g.boss,g.title,g.land,g.nofl,g.limit,g.long,g.pad,g.ab,g.bloomT],hasFl:'fl' in g||'rate' in g||'flNext' in g,toStage:typeof g.toStage,stages:g.stages,lines:g.lines}}
          return out})()""")
        await ctx.close()
        okk = (not r["bad"] and all(r["kept"].values()) and r["boss_b1"]["fields"] == ["b1", "b1", "Carry It Anyway", "l1", True, 0, False, True, True, 4.5] and r["boss_b2"]["fields"] == ["b2", "b2", "The Still Center", "l2", True, 0, False, True, True, 4.5]
               and not r["boss_b1"]["hasFl"] and not r["boss_b2"]["hasFl"] and r["boss_b1"]["toStage"] == "function" and r["boss_b2"]["toStage"] == "function")
        self.add("p35", "boss_words_kept", okk, f"straight apostrophes in player-facing text: {r['bad'] or 'none'}; setup/how/win/walk unchanged from the Phase 25 rounds: {r['kept']}; who/boss/title/land/nofl/limit/long/pad/ab/bloomT {r['boss_b1']['fields']} and {r['boss_b2']['fields']}; lanterns fields (fl/rate/flNext) absent: {not r['boss_b1']['hasFl'] and not r['boss_b2']['hasFl']}; stages {r['boss_b1']['stages']} and {r['boss_b2']['stages']}")

        # ---------------- Open Hands (Phase 35C) ----------------
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate(r"""(async()=>{const out={};const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const g=MINI.boss_b3,T=g._t,blank=()=>miniBlankInp(),r2=x=>+(+x).toFixed(3);
const S=(n)=>{const s={W:192,H:320,rm:false,t:0};g.init(s);if(n)g.toStage(s,n);s.spT=1e9;return s};
const step=(s,f)=>{const inp=blank();if(f)f(s,inp);s.t+=.05;return g.step(s,.05,inp)};
const run=(s,sec,f)=>{let res=null;for(let i=0;i<Math.round(sec/.05);i++){const r=step(s,f);if(r){res=r;break}}return res};
const osfx=window.sfx,sounds=[];window.sfx=function(n){sounds.push(n);return osfx.apply(this,arguments)};
const press=(s,i,sec,drag)=>{const q=T.slotXY(i);let n=0;const r=run(s,sec,(s2,inp)=>{if(n++===0){inp.taps=[{x:q[0],y:q[1]}];inp.tap=inp.taps[0]}inp.down={x:q[0],y:q[1]};if(drag)inp.drag={dx:drag*.05,dy:0}});return r};
const tap=(s,i)=>{const q=T.slotXY(i);return step(s,(s2,inp)=>{inp.taps=[{x:q[0],y:q[1]}];inp.tap=inp.taps[0]})};
/* ---------------- heavy needs a slow, steady hold ---------------- */
{const H={};
 const mk=()=>{const s=S();T.put(s,1,2);return s};
 let s=mk();tap(s,1);run(s,.3);H.tapOnly=[!!s.slots[1],s.done];
 s=mk();press(s,1,.5);run(s,.5);H.short=[!!s.slots[1],s.done];                      /* a 0.5 s hold, then let go */
 s=mk();press(s,1,1.1);H.below=[!!s.slots[1],s.done];                               /* 1.1 s held, still not */
 s=mk();let n=0;const q=T.slotXY(1);while(n<60&&s.slots[1]){step(s,(s2,inp)=>{if(n===0){inp.taps=[{x:q[0],y:q[1]}];inp.tap=inp.taps[0]}inp.down={x:q[0],y:q[1]}});n++}H.steady=[!s.slots[1],s.done,r2(n*.05)];
 s=mk();press(s,1,3,200);H.fastAlways=[!!s.slots[1],s.done,r2(s.hold)];              /* 3 s of moving at 200 units/s */
 s=mk();let rel=null;n=0;while(n<80&&s.slots[1]){step(s,(s2,inp)=>{if(n===0){inp.taps=[{x:q[0],y:q[1]}];inp.tap=inp.taps[0]}inp.down={x:q[0],y:q[1]};if(n===16)inp.drag={dx:10,dy:0}});n++}  /* one fast frame at 0.8 s resets the hold */
 H.reset=[!s.slots[1],r2(n*.05)];
 s=mk();n=0;while(n<80&&s.slots[1]){step(s,(s2,inp)=>{if(n===0){inp.taps=[{x:q[0],y:q[1]}];inp.tap=inp.taps[0]}inp.down={x:q[0],y:q[1]};inp.drag={dx:2.5,dy:0}});n++}   /* a slow drift of 50 units/s is still steady */
 H.slow=[!s.slots[1],r2(n*.05)];
 s=mk();step(s,(s2,inp)=>{inp.aTap=true});run(s,.3);H.keyTapHeavy=[!!s.slots[1],s.done];  /* keys: Z tapped does not release a heavy one */
 s=mk();n=0;while(n<80&&s.slots[1]){step(s,(s2,inp)=>{inp.a=true});n++}H.keyHold=[!s.slots[1],r2(n*.05),s.done];
 s=mk();run(s,.9,(s2,inp)=>{inp.a=true});run(s,.3);H.keyShort=[!!s.slots[1],s.done];
 s=S();T.put(s,2,0);tap(s,2);H.light=[!s.slots[2],s.done];                              /* a light one: one tap */
 s=S();T.put(s,2,1);step(s,(s2,inp)=>{inp.aTap=true});H.lightKey=[!s.slots[2],s.done];
 s=S();T.put(s,5,0);const q5=T.slotXY(5);step(s,(s2,inp)=>{inp.taps=[{x:q5[0]+40,y:q5[1]}];inp.tap=inp.taps[0]});H.miss=[!!s.slots[5],s.done];
 out.heavy=H}
/* ---------------- every release makes exactly one firefly; 25 releases win ---------------- */
{const F={};sounds.length=0;const s=S();let ok=true,res=null,last=0,kinds=[0,0],n=0;
 for(let i=0;i<25;i++){const heavy=i%3===2,slot=i%8,way=i%3;T.put(s,slot,heavy?2+i%2:i%2);const ff0=s.ffN,d0=s.done,q=T.slotXY(slot);
   if(!heavy){if(way===1){res=step(s,(s2,inp)=>{inp.aTap=true})}else res=tap(s,slot)}
   else if(i%2){res=press(s,slot,1.4)}else{let m=0;while(m<60&&s.slots[slot]){res=step(s,(s2,inp)=>{inp.a=true});m++;if(res)break}}
   if(!res&&s.slots[slot])ok=false;
   if(s.ffN-ff0!==1||s.done-d0!==1)ok=false;kinds[heavy?1:0]++;last=i;
   if(i<24){if(s.done!==i+1||res)ok=false;res=null}
   s.slots.fill(null);s.grip=-1;s.hold=0;s.kh=false}
 F.ok=ok;F.res=res;F.done=s.done;F.ffN=s.ffN;F.kinds=kinds;F.ffShown=s.ff.length;
 /* touch and keys both: the sound is the same quiet letgo each time */
 F.letgo=sounds.filter(x=>x==='letgo').length;out.ff=F}
/* ---------------- full slots slow the arms, the timer and the falling to 55%, never your hands ---------------- */
{const Z={};const full=()=>{const s=S();for(let i=0;i<8;i++)T.put(s,i,0);return s},free=()=>{const s=full();s.slots[7]=null;return s};
 const timer=s=>{s.spT=1000;run(s,2);return (1000-s.spT)/2};
 Z.timerFull=r2(timer(full()));Z.timerFree=r2(timer(free()));
 const armU=s=>{const a=s.arms[0];a.ph='b';a.u=1;a.tx=96;a.ty=100;s.spT=1e9;run(s,.2);return 1-a.u};
 Z.armFull=r2(armU(full()));Z.armFree=r2(armU(free()));
 const fall=s=>{s.slots[0]={k:0,heavy:false,f:.1,x0:90,y0:100,set:0};run(s,.3);return s.slots[0].f-.1};
 Z.fallFull=r2(fall(full()));Z.fallFree=r2(fall(free()));
 Z.ratioTimer=r2(Z.timerFull/Z.timerFree);Z.ratioArm=r2(Z.armFull/Z.armFree);Z.ratioFall=r2(Z.fallFull/Z.fallFree);
 {const s=full();step(s);Z.fullFlag=s.full;Z.sp=s.sp;const f=free();step(f);Z.spFree=f.sp}
 /* a tap still releases at once, and the next one still counts */
 {const s=full();step(s);const d0=s.done;tap(s,0);Z.tap1=[s.done-d0,s.slots[0]===null];tap(s,1);Z.tap2=[s.done-d0,s.slots[1]===null,s.full]}
 /* a heavy hold while full is not slowed: it lets go after the same 1.2 s */
 {const s=full();s.slots[3]={k:2,heavy:true,f:1,x0:0,y0:0,set:0};const q=T.slotXY(3);let n=0;while(n<80&&s.slots[3]){step(s,(s2,inp)=>{if(n===0){inp.taps=[{x:q[0],y:q[1]}];inp.tap=inp.taps[0]}inp.down={x:q[0],y:q[1]}});n++}Z.heavyFull=[!s.slots[3],r2(n*.05)]}
 /* drops per 30 s while hands are kept empty (slots cleared as they land): Wave I vs Wave III; Wave I light only; Wave II about one in three, never two in a row */
 const drops=(n,sec)=>{const s=S(n);s.spT=0;const seen=new Set(),kinds=[];let cnt=0;for(let i=0;i<Math.round(sec/.05);i++){step(s);s.slots.forEach((v,j)=>{if(v&&!seen.has(v)){seen.add(v);kinds.push(v.heavy?1:0)}if(v&&v.f>=1)s.slots[j]=null});}return {drops:s.drops,heavy:s.hdrops,kinds}};
 const w1=drops(0,60),w2=drops(1,120),w3=drops(2,60);
 Z.w1=[w1.drops,w1.heavy];Z.w3=[w3.drops,w3.heavy];Z.rate1=r2(w1.drops/60);Z.rate3=r2(w3.drops/60);Z.rateRatio=r2(Z.rate3/Z.rate1);
 let rows=0;for(let i=1;i<w2.kinds.length;i++)if(w2.kinds[i]&&w2.kinds[i-1])rows++;
 Z.w2=[w2.drops,w2.heavy,r2(w2.heavy/Math.max(1,w2.drops)),rows,r2(w2.drops/120)];Z.w3frac=r2(w3.heavy/Math.max(1,w3.drops));
 out.full=Z}
window.sfx=osfx;
return out})()""")
        await ctx.close()
        H = r["heavy"]
        okh = (H["tapOnly"] == [True, 0] and H["short"] == [True, 0] and H["below"] == [True, 0] and H["steady"][0] and H["steady"][1] == 1 and 1.15 <= H["steady"][2] <= 1.3 and H["fastAlways"][0] and H["fastAlways"][1] == 0 and H["fastAlways"][2] == 0
               and H["reset"][0] and H["reset"][1] >= 2.0 and H["slow"][0] and 1.15 <= H["slow"][1] <= 1.3 and H["keyTapHeavy"] == [True, 0] and H["keyHold"][0] and 1.15 <= H["keyHold"][1] <= 1.3 and H["keyHold"][2] == 1 and H["keyShort"] == [True, 0]
               and H["light"] == [True, 1] and H["lightKey"] == [True, 1] and H["miss"] == [True, 0])
        self.add("p35", "b3_heavy_needs_slow_hold", okh,
                 f"a landed heavy treasure: a tap {H['tapOnly']}, a 0.5 s hold then let go {H['short']}, 1.1 s held {H['below']} (each = still there, 0 set down); a steady hold let go after {H['steady'][2]} s (want 1.2; set down {H['steady'][1]}); 3 s of moving at 200 units/s left it there (still there {H['fastAlways'][0]}, hold {H['fastAlways'][2]}); one fast frame at 0.8 s reset the hold (let go only after {H['reset'][1]} s, want 2.0 or more); a slow drift of 50 units/s still counts as steady ({H['slow'][1]} s); "
                 f"keys: Z tapped {H['keyTapHeavy']}, Z held 0.9 s {H['keyShort']}, Z held let go after {H['keyHold'][1]} s; a light treasure goes with one tap {H['light']} or one Z {H['lightKey']}; a tap beside the slot did nothing {H['miss']}")
        F = r["ff"]
        okf = (F["ok"] and F["res"] == "win" and F["done"] == 25 and F["ffN"] == 25 and F["kinds"] == [17, 8] and F["letgo"] == 25 and F["ffShown"] <= 28)
        self.add("p35", "b3_release_makes_firefly", okf,
                 f"25 releases ({F['kinds'][0]} light by tap or Z, {F['kinds'][1]} heavy by a steady touch hold or a held Z): each added exactly one firefly and one to the count (all {F['ok']}), 24 releases did not win, the 25th did ({F['res']}); fireflies made {F['ffN']}, shown {F['ffShown']} (the oldest fade past 28); letgo heard {F['letgo']} times")
        Z = r["full"]
        okz = (Z["fullFlag"] and abs(Z["sp"] - .55) < 1e-9 and Z["spFree"] == 1 and .5 <= Z["ratioTimer"] <= .6 and .5 <= Z["ratioArm"] <= .6 and .5 <= Z["ratioFall"] <= .6 and abs(Z["timerFree"] - 1) < .01
               and Z["tap1"] == [1, True] and Z["tap2"] == [2, True, False] and Z["heavyFull"][0] and 1.15 <= Z["heavyFull"][1] <= 1.3
               and Z["w1"][1] == 0 and Z["w1"][0] >= 20 and Z["rateRatio"] >= 2 and Z["w2"][3] == 0 and .2 <= Z["w2"][2] <= .45 and 1.2 <= 1 / Z["w2"][4] <= 2.0 and .2 <= Z["w3frac"] <= .45)
        self.add("p35", "b3_full_slots_slow_not_stop", okz,
                 f"all 8 slots full: the drop timer ran at {Z['ratioTimer']} of its free speed (over 2 s: {Z['timerFull']} vs {Z['timerFree']}), the returning arm at {Z['ratioArm']}, a falling treasure at {Z['ratioFall']} (want 0.50-0.60; sp {Z['sp']}, back to {Z['spFree']} with one slot free); a tap still released at once {Z['tap1']} and the next one counted {Z['tap2']}; a heavy hold while full let go after {Z['heavyFull'][1]} s (the same 1.2 s); "
                 f"hands kept empty: Wave I dropped {Z['w1'][0]} treasures in 60 s ({Z['w1'][1]} heavy; want 0), Wave III {Z['w3'][0]} in 60 s (x{Z['rateRatio']} Wave I's rate, want 2 or more; {Z['w3frac']} heavy), Wave II {Z['w2'][0]} in 120 s ({Z['w2'][2]} heavy, never two in a row: {Z['w2'][3]} pairs, one every {round(1 / Z['w2'][4], 2)} s)")
        # ---------------- The Three Lenses (Phase 35C) ----------------
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate(r"""(async(blobs)=>{const out={};const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const g=MINI.boss_b4,T=g._t,blank=()=>miniBlankInp(),r2=x=>+(+x).toFixed(3);
const S=(n)=>{const s={W:192,H:320,rm:false,t:0};g.init(s);if(n)g.toStage(s,n);return s};
const step=(s,f)=>{const inp=blank();if(f)f(s,inp);s.t+=.05;return g.step(s,.05,inp)};
const run=(s,sec,f)=>{let res=null;for(let i=0;i<Math.round(sec/.05);i++){const r=step(s,f);if(r){res=r;break}}return res};
const tapAt=(s,x,y)=>step(s,(s2,inp)=>{inp.taps=[{x,y}];inp.tap=inp.taps[0]});
const look=(s,i)=>{tapAt(s,T.LENS[i][0],T.LENS[i][1]);run(s,.8)};
const osfx=window.sfx,sounds=[];window.sfx=function(n){sounds.push(n);return osfx.apply(this,arguments)};
const rec=[],om=window.mPiece;window.mPiece=function(c,id,name){rec.push(name);return om.apply(this,arguments)};
const cv=document.createElement('canvas');cv.width=192;cv.height=320;const c=cv.getContext('2d');
const drawn=(s,nm)=>{rec.length=0;g.draw(s,c,1000);return rec.includes(nm)};
/* ---------------- the third way comes only after all three lenses ---------------- */
{const W=[];const NM=["bell","signal_lamp","switch"],SPOT=[T.BELL,T.LAMP,T.SWST];
 for(let n=0;n<3;n++){const w={n};let s=S(n);const sp=SPOT[n];
   w.drawnBefore=drawn(s,NM[n]);tapAt(s,sp[0],sp[1]);run(s,.2);w.tapBefore=s.solved;
   if(n===2){step(s,(s2,inp)=>{inp.taps=[{x:sp[0],y:sp[1]}];inp.tap=inp.taps[0];inp.down={x:sp[0],y:sp[1]}});w.dragBefore=!!s.hold;run(s,.1)}
   look(s,0);look(s,1);w.two=s.seen.slice();w.drawnTwo=drawn(s,NM[n]);tapAt(s,sp[0],sp[1]);run(s,.2);w.tapTwo=s.solved;           /* two lenses seen: still absent */
   look(s,2);w.three=s.seen.slice();w.drawnAfter=drawn(s,NM[n]);
   if(n===0){tapAt(s,T.LAMP[0],T.LAMP[1]);w.otherWay=s.solved;tapAt(s,T.BELL[0],T.BELL[1]);w.solved=s.solved}                    /* the lamp's spot does nothing in scene I; the bell does */
   else if(n===1){tapAt(s,T.BELL[0],T.BELL[1]);w.otherWay=s.solved;tapAt(s,T.LAMP[0],T.LAMP[1]);w.solved=s.solved}
   else{
     const grab=()=>step(s,(s2,inp)=>{inp.taps=[{x:T.SWST[0],y:T.SWST[1]}];inp.tap=inp.taps[0];inp.down={x:T.SWST[0],y:T.SWST[1]}});
     const dragTo=(x,y)=>{for(let i=1;i<=12;i++){const qx=T.SWST[0]+(x-T.SWST[0])*i/12,qy=T.SWST[1]+(y-T.SWST[1])*i/12;step(s,(s2,inp)=>{inp.down={x:qx,y:qy}})}};
     tapAt(s,T.BELL[0],T.BELL[1]);tapAt(s,T.LAMP[0],T.LAMP[1]);w.otherWay=s.solved;
     grab();w.grabbed=!!s.hold;dragTo(T.SWSPOT[0],T.SWSPOT[1]+25);step(s);                                                    /* let go 25 units from the spot: it slides back */
     w.farSolved=s.solved;w.slid=[!!s.sl,s.ox,s.oy,!!s.hold];run(s,.5);w.backAt=[s.ox,s.oy,!!s.sl];
     grab();dragTo(T.SWSPOT[0]+10,T.SWSPOT[1]+8);w.near=r2(Math.hypot(s.ox-T.SWSPOT[0],s.oy-T.SWSPOT[1]));step(s);w.solved=s.solved;
     /* keys: pick it up with Z, walk the cursor, put it down with Z */
     let s2=S(2);look(s2,0);look(s2,1);look(s2,2);
     for(let i=0;i<30&&Math.hypot(s2.cx-T.SWST[0],s2.cy-T.SWST[1])>6;i++)step(s2,(x,inp)=>{inp.dx=s2.cx<T.SWST[0]-3?1:s2.cx>T.SWST[0]+3?-1:0;inp.dy=s2.cy<T.SWST[1]-3?1:s2.cy>T.SWST[1]+3?-1:0});
     step(s2,(x,inp)=>{inp.aTap=true});w.kPick=s2.hold&&s2.hold.m;
     for(let i=0;i<60&&Math.hypot(s2.cx-T.SWSPOT[0],s2.cy-T.SWSPOT[1])>5;i++)step(s2,(x,inp)=>{inp.dx=s2.cx<T.SWSPOT[0]-3?1:s2.cx>T.SWSPOT[0]+3?-1:0;inp.dy=s2.cy<T.SWSPOT[1]-3?1:s2.cy>T.SWSPOT[1]+3?-1:0});
     step(s2,(x,inp)=>{inp.aTap=true});w.kSolved=s2.solved}
   /* solving advances the scene (banner by stageUp) after its time */
   const res=run(s,T.SOLVET[n]+.3);w.res=res;w.next=s.st;w.nextSeen=s.seen.slice();w.nextSolved=s.solved;
   W.push(w)}
 out.third=W}
/* ---------------- the train stops politely ---------------- */
{const P={};const s=S();look(s,0);P.seen0=s.seen.slice();
 sounds.length=0;let maxTp=0,tStop=null,tBack=null,tRun2=null,res=null,t=s.tt;P.stops=0;let prev=s.mode;P.modes=[];
 for(let i=0;i<Math.round(45/.05)&&!res;i++){res=step(s);t+=.05;maxTp=Math.max(maxTp,s.tp);if(s.mode!==prev){P.modes.push([s.mode,r2(t),r2(s.tp)]);if(s.mode==='stop')tStop=t;if(s.mode==='back')tBack=t;if(s.mode==='run'&&tBack!=null&&tRun2==null)tRun2=t;prev=s.mode}}
 P.res=res;P.maxTp=r2(maxTp);P.tStop=r2(tStop);P.tBack=r2(tBack);P.tRun2=r2(tRun2);P.tpNow=r2(s.tp);P.tt=r2(s.tt);P.seenAfter=s.seen.slice();P.st=s.st;P.solved=s.solved;P.done=s.done;P.junc=T.JUNC[1];P.stopSound=sounds.filter(x=>x==='stop').length;
 {const q=S();q.tt=T.TRAVEL-.1;q.tp=T.STOP-.03;run(q,.3);P.modeStop=q.mode;P.stopY=r2(q.tp);P.stopStillRuns=(()=>{const y0=q.tp;run(q,.5);return r2(q.tp-y0)})()}
 out.polite=P}
/* ---------------- three scenes by auto, through the engine ---------------- */
{const V={};const os=window.stageUp,calls=[];window.stageUp=function(s,n){const r=os.apply(this,arguments);if(MS&&MS.s===s)calls.push([s.st,s.done]);return r};
 const seen=[],ob=window.miniBanner,say=[],osay=window.miniSay;window.miniBanner=function(t){seen.push(t);return ob.apply(this,arguments)};window.miniSay=function(t,d){say.push(t);return osay.apply(this,arguments)};
 __kitEnter('l4');await sleep(60);startMini('boss_b4',{boss:true});MS.i=g.setup.length;miniAct('mbegin');MS.auto=true;stopMiniLoop();let guard=0,ends=0;
 while(MS&&MS.mode==='play'&&guard++<8000)miniTick(.05);
 V.mode=MS.mode;V.pips=document.querySelectorAll('#mTitle .mpips i').length;V.t=r2(MS.sess.t);V.done=MS.s.done;closeMini();window.stageUp=os;window.miniBanner=ob;window.miniSay=osay;
 V.solve=T.SOLVE;V.calls=calls;V.seen=seen;V.say=say;V.stages=g.stages;V.lines=g.lines;
 out.scenes=V}
/* ---------------- nobody on or near the tracks, in any scene or the bloom ---------------- */
{const N={};const calls=[],o1=window.mSpr,o2=window.mSprO;window.mSpr=function(cc,nm,x,y){calls.push([nm,x,y]);return o1.apply(this,arguments)};if(o2)window.mSprO=function(cc,nm,x,y){calls.push([nm,x,y]);return o2.apply(this,arguments)};
 const cv2=document.createElement('canvas');cv2.width=384;cv2.height=640;const c2=cv2.getContext('2d');c2.setTransform(2,0,0,2,0,0);
 const s=S();let res=null,k=0;
 for(let i=0;i<6000&&!res;i++){const inp=blank();g.auto(s,inp);s.t+=.05;res=g.step(s,.05,inp);if(i%4===0){if(s.act>=0||s.solved||i%12===0)g.draw(s,c2,i*50)}}
 /* every lens in every scene, with the reveal on, and every sweep of the bloom */
 for(let n=0;n<3;n++){const q=S(n);for(let l=0;l<3;l++){q.act=l;q.actT=1;g.draw(q,c2,1000);g.draw(Object.assign(q,{rm:true}),c2,1000);q.rm=false}}
 const b=S(2);b.done=3;for(let j=0;j<=20;j++)g.bloom(b,c2,j/20,j*220);const br=S(2);br.done=3;br.rm=true;g.bloom(br,c2,1,0);
 window.mSpr=o1;if(o2)window.mSprO=o2;
 const tr=T.tracks(),segs=[];for(const kk in tr){const P=tr[kk];for(let i=1;i<P.length;i++){const[a,b2]=[P[i-1],P[i]],L=Math.hypot(b2[0]-a[0],b2[1]-a[1]),n=Math.max(1,Math.ceil(L));for(let j=0;j<=n;j++)segs.push([a[0]+(b2[0]-a[0])*j/n,a[1]+(b2[1]-a[1])*j/n,kk])}}
 let md=1e9,at=null;const names=new Set();
 for(const[nm,x,y]of calls){names.add(nm);/* the sprite is a 16 x 24 map sprite drawn at (x, y): feet at (x+8, y+24) */for(const[px_,py_]of segs){const dx=Math.max(x-px_,0,px_-(x+16)),dy=Math.max(y-py_,0,py_-(y+24)),d=Math.hypot(dx,dy);if(d<md){md=d;at=[nm,r2(x),r2(y),px_,py_]}}}
 N.n=calls.length;N.names=[...names];N.min=r2(md);N.at=at;N.tracks=Object.keys(tr);N.segPts=segs.length;N.res=res;
 out.people=N}
window.sfx=osfx;window.mPiece=om;
return out})(""" + ("true" if blobs else "false") + ")")
        await ctx.close()
        W = r["third"]
        okt = (len(W) == 3 and all(not w["drawnBefore"] and not w["tapBefore"] and not w["drawnTwo"] and not w["tapTwo"] and w["two"] == [True, True, False] and w["three"] == [True, True, True] and w["drawnAfter"] and not w["otherWay"] and w["solved"]
                                   and w["next"] == (w["n"] + 1 if w["n"] < 2 else 2) and (w["res"] == "win" if w["n"] == 2 else w["res"] is None) and (w["n"] == 2 or (w["nextSeen"] == [False, False, False] and not w["nextSolved"])) for w in W)
               and not W[2]["dragBefore"] and W[2]["grabbed"] and not W[2]["farSolved"] and W[2]["slid"][0] and abs(W[2]["slid"][1] - 156) < .01 and W[2]["slid"][2] == 196 and not W[2]["slid"][3] and abs(W[2]["backAt"][0] - 156) < .01 and abs(W[2]["backAt"][1] - 196) < .01 and not W[2]["backAt"][2] and W[2]["near"] <= 18 and W[2]["kPick"] == "k" and W[2]["kSolved"])
        self.add("p35", "b4_third_way_after_all_lenses", okt,
                 "; ".join(f"scene {['I', 'II', 'III'][w['n']]} ({['the bell', 'the signal lamp', 'the switch'][w['n']]}): before any lens it was drawn {w['drawnBefore']} and a tap on its spot solved {w['tapBefore']}, with two of three seen drawn {w['drawnTwo']} / solved {w['tapTwo']}, with all three seen drawn {w['drawnAfter']}; another scene's spot did nothing ({not w['otherWay']}), its own solved it ({w['solved']}), and after {[2.4, 2.4, 3.8][w['n']]} s {'it won' if w['n'] == 2 else 'scene ' + ['I', 'II', 'III'][w['n'] + 1] + ' began (stage ' + str(w['next']) + ', lenses reset ' + str(w['nextSeen']) + ')'}" for w in W)
                 + f"; the switch (scene III): a press on its spot before all three lenses did not pick it up ({not W[2]['dragBefore']}), after them it did ({W[2]['grabbed']}); let go 25 units from the target it slid back to {W[2]['backAt'][:2]} unsolved ({not W[2]['farSolved']}); dropped {W[2]['near']} units from the spot (within 18) it solved ({W[2]['solved']}); with keys Z picked it up ({W[2]['kPick']}) and Z again at the spot solved it ({W[2]['kSolved']})")
        P = r["polite"]
        okp = (P["res"] is None and P["seen0"] == [True, False, False] and P["seenAfter"] == [True, False, False] and abs(P["tStop"] - 30) < .1 and P["maxTp"] <= 170.01 and P["maxTp"] < P["junc"] - 5 and P["modeStop"] == "stop" and abs(P["stopY"] - 170) < .5 and abs(P["stopStillRuns"]) < 1e-9
               and abs(P["tBack"] - P["tStop"] - 2.4) < .1 and P["tRun2"] is not None and P["tRun2"] > P["tBack"] + 1 and P["tt"] < 14 and P["st"] == 0 and not P["solved"] and P["done"] == 0 and P["stopSound"] == 1 and P["modes"][0][0] == "stop")
        self.add("p35", "b4_train_stops_politely", okp,
                 f"with no input after looking through the gold lens, the train reached its stop at {P['tStop']} s (want 30), the highest it ever got was y {P['maxTp']} (the junction is y {P['junc']}; it stopped short, {P['stopY']} when stopped, and did not move while stopped: {P['stopStillRuns']}); no 'end' or any result came back ({P['res']}); the soft brake sound played {P['stopSound']} time; it waited 2.4 s ({P['tBack']} - {P['tStop']}), then backed up and ran again from {P['tRun2']} s (timer now {P['tt']} s into the new run); the scene repeated (stage {P['st']}, not solved, scenes done {P['done']}) and the seen lenses stayed seen {P['seenAfter']}; modes {P['modes']}")
        V = r["scenes"]
        want = [f"{n} · {s}" for n, s in zip(["I", "II", "III"], V["stages"])]
        okv = (V["mode"] in ("bloom", "result") and V["pips"] == 3 and all(w in V["seen"] for w in want) and [x[0] for x in V["calls"]] == [1, 2] and [x[1] for x in V["calls"]] == [1, 2]
               and all(l in V["say"] for l in V["lines"]) and all(l in V["say"] for l in V["solve"]) and V["done"] == 3 and V["t"] > 8.6)
        self.add("p35", "b4_three_scenes", okv,
                 f"auto play through the engine: {V['t']} s to the {V['mode']}, banners {sorted(set(V['seen']))}, HUD pips {V['pips']}; stage changes (stage, scenes done) {V['calls']} (want two); lines played {[x for x in V['say'] if x]} (the three scene lines and the three solve lines all among them: {all(l in V['say'] for l in V['lines']) and all(l in V['say'] for l in V['solve'])})")
        N = r["people"]
        okn = (N["n"] > 40 and N["min"] >= 8 and N["res"] == "win" and len(N["tracks"]) >= 3)
        self.add("p35", "b4_no_one_on_the_tracks", okn,
                 f"{N['n']} people-sprite draws recorded ({N['names']}) across a full auto play (every scene, every lens's reveal on, Reduce Motion too) and 21 frames of the bloom; the nearest any came to a traced track path ({N['tracks']}, {N['segPts']} sample points, sprite rectangles 16 x 24) was {N['min']} units (want 8 or more; at {N['at']})")
        # ---------------- the words of Open Hands and The Three Lenses ----------------
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate(r"""(()=>{const out={bad:[],kept:{}};const OLD={boss_b3:{setup:["It fills your hands faster than you can empty them. Keep letting go."],how:"Tap a treasure to set it down. For a heavy one, press and hold, slowly and steadily. With keys: ← → to choose, Z to set down, hold Z for a heavy one.",win:"Its arms fall open. Fireflies drift up where the treasure was.",walk:"You set the last of it down. The mist thins."},
          boss_b4:{setup:["The Engine offers two tracks and calls it a choice. Look through every lens first."],how:"Tap each lens to look through it. Then a third way appears: tap it, or drag it into place. With keys: arrows to move, Z to tap or to pick up and put down.",win:"Three lenses, one clear view. The Engine’s gears grind and slow.",walk:"You look again, and a third way appears."}};
          for(const id of ['boss_b3','boss_b4']){const g=MINI[id];const strs=[g.title,...(g.setup||[]),g.how,g.win,g.walk,...(g.stages||[]),...(g.lines||[]),...(g._t.SOLVE||[])].filter(x=>typeof x==='string');
            strs.forEach(x=>{if(/'/.test(x))out.bad.push(id+': '+x)});
            out.kept[id]=JSON.stringify([g.setup,g.how,g.win,g.walk])===JSON.stringify([OLD[id].setup,OLD[id].how,OLD[id].win,OLD[id].walk]);
            out[id]={fields:[g.who,g.boss,g.title,g.land,g.nofl,g.limit,g.long,g.pad,g.ab,g.bloomT],hasFl:'fl' in g||'rate' in g||'flNext' in g,toStage:typeof g.toStage,auto:typeof g.auto,stages:g.stages,lines:g.lines,t:typeof g._t}}
          return out})()""")
        await ctx.close()
        okw = (not r["bad"] and all(r["kept"].values()) and r["boss_b3"]["fields"] == ["b3", "b3", "Open Hands", "l3", True, 0, False, True, True, 4.5] and r["boss_b4"]["fields"] == ["b4", "b4", "The Three Lenses", "l4", True, 0, False, True, True, 4.5]
               and not r["boss_b3"]["hasFl"] and not r["boss_b4"]["hasFl"] and r["boss_b3"]["toStage"] == "function" and r["boss_b4"]["toStage"] == "function" and r["boss_b3"]["auto"] == "function" and r["boss_b4"]["auto"] == "function"
               and r["boss_b3"]["stages"] == ["Full Hands", "Heavy Things", "Open"] and r["boss_b4"]["stages"] == ["The Late Delivery", "The Broken Promise", "Waiting for Each Other"]
               and r["boss_b3"]["lines"][0] is None and all(r["boss_b3"]["lines"][1:]) and len(r["boss_b4"]["lines"]) == 3 and all(r["boss_b4"]["lines"]))
        self.add("p35", "boss_b3_b4_words_kept", okw, f"straight apostrophes in player-facing text: {r['bad'] or 'none'}; setup/how/win/walk unchanged from the Phase 25 rounds: {r['kept']}; who/boss/title/land/nofl/limit/long/pad/ab/bloomT {r['boss_b3']['fields']} and {r['boss_b4']['fields']}; lanterns fields (fl/rate/flNext) absent: {not r['boss_b3']['hasFl'] and not r['boss_b4']['hasFl']}; stages {r['boss_b3']['stages']} and {r['boss_b4']['stages']}; lines {r['boss_b3']['lines']} and {r['boss_b4']['lines']}; toStage, auto, _t present")

    async def p28(self, b):
        # 1) every station's spawn spot ("sp") is a tile you can stand on, in every land
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const bad=[];
          for(const lid of Object.keys(LEVEL_DEFS)){__kitDef(lid);
            CUR.stations.forEach(st=>{P.c=P.c||{};P.c[st.id]=3});
            CUR.stations.forEach(st=>{if(st.sp&&!passable(st.sp[0],st.sp[1]))bad.push(lid+' '+st.id+' '+st.sp)})}
          return bad})()""")
        self.add("p28", "spawn_spots_walkable", not r, "every station's sp is walkable in every land" if not r else f"not walkable: {r}")
        await ctx.close()

        # 2) the stuck spot: no saved position after the Grasping Mind is beaten, and even a bad sp falls back safely
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const out={};
          __kitDef('l3');CUR.stations.forEach(st=>{P.c=P.c||{};P.c[st.id]=3});delete P.w.l3;
          enterLevel('l3');
          out.tile=[Math.floor(pl.x),Math.floor(pl.y)];out.here=passable(out.tile[0],out.tile[1]);
          out.free=[[1,0],[-1,0],[0,1],[0,-1]].filter(d=>passable(out.tile[0]+d[0],out.tile[1]+d[1])).length;
          const b3=CUR.stations.find(s=>s.id==='b3');const keep=b3.sp;b3.sp=[17,4];delete P.w.l3;enterLevel('l3');
          out.guardTile=[Math.floor(pl.x),Math.floor(pl.y)];out.guardHere=passable(out.guardTile[0],out.guardTile[1]);b3.sp=keep;
          return out})()""")
        ok = r["here"] and r["free"] >= 1 and r["guardHere"]
        self.add("p28", "no_stuck_spot", ok,
                 f"after clearing Level III with no saved spot: stands on {r['tile']} (walkable: {r['here']}, open neighbours: {r['free']}); with the old bad spot [17,4] forced: falls back to {r['guardTile']} (walkable: {r['guardHere']})")
        await ctx.close()

        # 3) the world's "A ·" prompt never draws under the top bar (Grasping Mind, top of Level III)
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
          __kitEnter('l3');CUR.stations.forEach(st=>{if(st.id!=='b3'){P.c=P.c||{};P.c[st.id]=3}});delete P.c.b3;
          pl.x=16.5;pl.y=4.5;await sleep(150);
          const ys=[];const f=ctx.fillText.bind(ctx);ctx.fillText=function(t,x,y){if(String(t).startsWith('A \\u00B7'))ys.push({t:String(t),y});return f(t,x,y)};
          await sleep(400);ctx.fillText=f;
          const hud=document.querySelector('.hud').getBoundingClientRect().bottom*Math.min(2,devicePixelRatio||1);
          return {ys:ys.slice(0,3),hud,S,target:!!interactTarget}})()""")
        drawn = r["ys"]
        ok = bool(drawn) and all(d["y"] - r["S"] * 5.5 >= r["hud"] - 1 for d in drawn)
        self.add("p28", "boss_prompt_clear_of_top_bar", ok,
                 f"label text at y={[round(d['y']) for d in drawn]}, its box top = y-{r['S']*5.5:.0f}, top bar bottom = {r['hud']:.0f}; label {drawn[0]['t'] if drawn else '(not drawn)'}")
        await ctx.close()

        # 4) mini-game backgrounds that use land tiles are redrawn once the tiles arrive
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const res={};
          const red=document.createElement('canvas');red.width=2048;red.height=2048;const rc=red.getContext('2d');rc.fillStyle='#ff0000';rc.fillRect(0,0,2048,2048);
          const count=cv=>{const d=cv.getContext('2d').getImageData(0,0,192,320).data;let n=0;for(let i=0;i<d.length;i+=4)if(d[i]>240&&d[i+1]<20&&d[i+2]<20&&d[i+3]>200)n++;return n};
          const mk=()=>{const c=document.createElement('canvas');c.width=192;c.height=320;c.getContext('2d').imageSmoothingEnabled=false;return c};
          for(const id of Object.keys(MINI)){const g=MINI[id];if(!g.land||g.land==='l1'||id.startsWith('boss_'))continue;
            const land=g.land,saved=ATLAS_IMG[land];
            try{
              ATLAS_IMG[land]={ok:false,img:null};
              const s=newMiniState(g);const c1=mk();g.draw(s,c1.getContext('2d'),0);
              ATLAS_IMG[land]={ok:true,img:red};
              const c2=mk();g.draw(s,c2.getContext('2d'),0);
              const sf=newMiniState(g);const c3=mk();g.draw(sf,c3.getContext('2d'),0);
              res[id]={before:count(c1),same:count(c2),fresh:count(c3)};
            }finally{ATLAS_IMG[land]=saved}}
          return res})()""")
        bad = [f"{k}: tiles drawn {v['same']} after loading vs {v['fresh']} in a fresh play" for k, v in r.items() if v["fresh"] > 0 and v["same"] < v["fresh"] * 0.9]
        used = [k for k, v in r.items() if v["fresh"] > 0]
        self.add("p28", "mini_bg_waits_for_tiles", not bad and bool(used),
                 (f"{len(used)} land-tile backgrounds checked ({', '.join(used)}): each one redraws when its tileset arrives" if not bad else "stuck plain backgrounds: " + "; ".join(bad)))
        await ctx.close()

        # 5) wording fixes are in, and old wording is gone
        src = self.all_src()
        RQ = "’"
        chk = {}
        chk["no_egoism_called_Mills"] = ("closer to Mill" + RQ + "s question" not in src and "closer to Mill" + RQ + "s calculation" not in src)
        chk["lute_order"] = ("living too loose, and then too tight" in src and "living too tight, and then too loose" not in src)
        chk["greetings_not_repeated"] = all(x not in src.split("MINI.lights={")[1][:1500] or True for x in [""]) and \
            ('setup:["Faith and reason come from one source' in src) and ('setup:["Let them say what the crowd hates. Being offended' in src) and ('setup:["Each knot holds threads to homes that need it' in src)
        chk["aristotle_exact"] = ("before we can do them, we learn by doing them." in src)
        self.add("p28", "wording_fixes", all(chk.values()), "; ".join(f"{k}={v}" for k, v in chk.items()))

        # 6) the three greetings are not repeated as the first line of their games
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const out=[];const greet={lights:'aquinas',corner:'mill',web:'gilligan'};
          for(const [gid,tid] of Object.entries(greet)){const first=MINI[gid].setup[0].slice(0,24);
            const said=TALK[tid].intro.some(l=>l.startsWith(first));if(said)out.push(gid)}
          return out})()""")
        self.add("p28", "greetings_not_repeated", not r, "no game opens with its thinker's own greeting" if not r else f"repeats the greeting: {r}")
        await ctx.close()

        # 7) curly apostrophes in the seven games
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const bad=[];
          for(const id of ['mean','gadfly','yours','above','lights','corner','web']){const g=MINI[id];
            const strs=[g.title,...(g.setup||[]),g.how,g.win,g.walk,g.again,...(g.fl||[]),...(g.flNext||[])].filter(x=>typeof x==='string');
            strs.forEach(x=>{if(/[A-Za-z]'[A-Za-z]/.test(x))bad.push(id+': '+x.slice(0,50))})}
          return bad})()""")
        self.add("p28", "curly_apostrophes", not r, "no straight apostrophes in the seven games' text" if not r else f"straight apostrophes left: {r}")
        await ctx.close()

        # 8) the five 'X, not Y'-style answers no longer stand alone
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const bad=[];
          const shape=[/, not /,/n[\u2019']t\\b[^;]*;/,/\\?\\s+If /];
          const qs={kant:2,mill:2,gilligan:[0,1]};
          for(const [id,ix] of Object.entries(qs)){for(const i of [].concat(ix)){const q=TALK[id].q[i];
            const has=q.o.map(o=>shape.some(re=>re.test(o)));const wrong=has.slice(1).some(x=>x);
            if(!has[0]||!wrong)bad.push(id+' q'+(i+1)+' right='+has[0]+' someWrong='+wrong)}}
          const e=TALK.epicurus.q[1];if(/drop/i.test(e.say)&&/drop/i.test(e.o[0]))bad.push('epicurus q2 still echoes drop');
          return bad})()""")
        self.add("p28", "answer_shapes", not r, "Kant Q3, Mill Q3, Gilligan Q1/Q2 have a matching wrong answer; Epicurus Q2 no longer echoes 'drop'" if not r else f"still stand out: {r}")
        await ctx.close()

    async def addendum(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const ids=Object.keys(MINI),bad=ids.filter(id=>!MINI[id].nofl&&!(Array.isArray(MINI[id].fl)&&MINI[id].fl.length===3&&typeof MINI[id].rate==='function'));
          return {ids,bad}})()""")
        self.add("addendum", "lanterns_defined", r["ids"] and not r["bad"], f"{len(r['ids'])} game(s); without 3 lantern levels and a rate(): {r['bad'] or 'none'}")
        r = await pg.evaluate("""(()=>{__kitEnter('l1');delete P.f['camus:1'];P.g={};const a=arts.find(x=>x.id==='camus'&&x.i===1);startMini('sisyphus',{art:a});miniAct('mbegin');
          const keep=MINI.sisyphus.rate;MINI.sisyphus.rate=()=>1;miniWin();MINI.sisyphus.rate=keep;const out={f:!!P.f['camus:1'],fl:P.g.sisyphus&&P.g.sisyphus.fl};closeMini();return out})()""")
        self.add("addendum", "finish_awards_artifact", r["f"] and r["fl"] == 1, f"finishing with 1 lantern: artifact earned={r['f']}, lanterns saved={r['fl']}")
        r = await pg.evaluate("""(()=>{P.g={};P.m={};saveMiniResult('sisyphus',3,true);saveMiniResult('sisyphus',1,true);saveMiniResult('sisyphus',0,false);return {fl:P.g.sisyphus.fl,best:P.m.sisyphus.best}})()""")
        self.add("addendum", "best_rating_kept", r["fl"] == 3 and r["best"] == 3, f"after 3, then 1, then a Walk on: lanterns={r['fl']}, best={r['best']} (want 3 and 3)")
        await ctx.close()

        sub = {}
        base = {"c": {}, "a": {}, "w": {}, "f": {}, "intro": True}
        for name, loc, cld, want in (
            ("cloud_brighter", {"g": {"sisyphus": {"fl": 1, "at": 1}}, "ts": {"reset": 100, "a": 0, "w": 0}}, {"g": {"sisyphus": {"fl": 3, "at": 2}}, "ts": {"reset": 100, "a": 0, "w": 0}}, 3),
            ("device_brighter", {"g": {"sisyphus": {"fl": 3, "at": 1}}, "ts": {"reset": 100, "a": 0, "w": 0}}, {"g": {"sisyphus": {"fl": 1, "at": 2}}, "ts": {"reset": 100, "a": 0, "w": 0}}, 3),
            ("newer_journey_elsewhere", {"g": {"sisyphus": {"fl": 3, "at": 1}}, "ts": {"reset": 100, "a": 0, "w": 0}}, {"g": {}, "ts": {"reset": 200, "a": 0, "w": 0}}, None)):
            ctx, pg, errs = await self.page(b, init=self._fake_cloud({**base, **loc}, {**base, **cld}))
            await pg.wait_for_timeout(400)
            got = await pg.evaluate("P.g.sisyphus?P.g.sisyphus.fl:null")
            sub[name] = got == want
            await ctx.close()
        self.add("addendum", "lantern_sync", all(sub.values()), "; ".join(f"{k}={v}" for k, v in sub.items()))

        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));P.intro=true;P.c.camus=3;P.g={sisyphus:{fl:2,at:1}};P.a={title:P.a.title||'kit'};const art=P.a.title;
          P.r={camus:{t:'kit reflection',at:1}};P.m={sisyphus:{best:2,plays:1,won:true,at:1}};openPanel('resetask','title');await sleep(20);
          document.querySelector('[data-act="resetyes"]').click();await sleep(30);
          return {g:Object.keys(P.g).length,a:P.a.title===art,r:!!(P.r.camus&&P.r.camus.t==='kit reflection'),m:!!(P.m.sisyphus&&P.m.sisyphus.best===2),c:Object.keys(P.c).length}})()""")
        self.add("addendum", "new_journey_clears_lanterns", r["g"] == 0 and r["a"] and r["r"] and r["m"] and r["c"] == 0,
                 f"lanterns left={r['g']} (want 0); art kept={r['a']}; reflections kept={r['r']}; best results kept={r['m']}; cards left={r['c']}")
        await ctx.close()

        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));__kitEnter('l1');await sleep(60);P.g={sisyphus:{fl:2,at:1}};P.f['camus:1']=1;openPanel('journal','world');await sleep(30);
          const b=document.querySelector('#panelBody'),t=b.innerText;const sr=[...b.querySelectorAll('.sr')].map(x=>x.textContent);
          return {line:t.includes('Mini-game: Sisyphus\\u2019s Hill'),sr,head:t.includes('Lanterns: 2 of '+(Object.keys(MINI).filter(k=>!MINI[k].nofl).length*3)),won:t.includes('Won in Sisyphus\\u2019s Hill.'),lit:b.querySelectorAll('.mlan svg.on').length}})()""")
        self.add("addendum", "journal_shows_lanterns", r["line"] and "2 of 3 lanterns" in r["sr"] and r["head"] and r["won"] and r["lit"] == 2,
                 f"'Mini-game: Sisyphus’s Hill' line={r['line']}; screen-reader labels={r['sr']}; header total={r['head']}; 'Won in' line={r['won']}; lit lanterns={r['lit']}")
        await ctx.close()

        res = {}
        for rm in (True, False):
            ctx, pg, errs = await self.page(b, reduced=rm)
            r = await pg.evaluate("""(()=>{__kitEnter('l1');const out={};for(const id of Object.keys(MINI)){const g=MINI[id];if(typeof g.bloom!=='function'){out[id]='no bloom';continue}
              try{startMini(id);miniAct('mbegin');miniWin();out[id]=RM.matches?(MS.mode==='result'&&MS.bk===1?'still':'mode '+MS.mode+' k '+MS.bk):(MS.mode==='bloom'?'plays':'mode '+MS.mode);miniDraw();closeMini()}catch(e){out[id]='error '+e}}return out})()""")
            res[rm] = (r, errs[:])
            await ctx.close()
        ok = all(v == "still" for v in res[True][0].values()) and all(v == "plays" for v in res[False][0].values()) and not res[True][1] and not res[False][1]
        self.add("addendum", "bloom_every_game", ok, f"Reduce Motion: {res[True][0]}; normal: {res[False][0]}" + (f"; errors {res[True][1][:1]+res[False][1][:1]}" if res[True][1] or res[False][1] else ""))

    async def mini_shots(self, b, out):
        os.makedirs(out, exist_ok=True)
        ctx, pg, errs = await self.page(b)
        ids = await pg.evaluate("Object.keys(MINI)")
        if getattr(self.args, "mini_ids", ""):
            ids = [i for i in ids if i in self.args.mini_ids.split(",")]
        for id in ids:
            await pg.evaluate(f"""(()=>{{const g=MINI['{id}'];if(g.boss){{__kitEnter(g.land);startMini('{id}',{{boss:true}});return}}const lid=Object.keys(LEVEL_DEFS).find(k=>LEVEL_DEFS[k].stations.some(s=>s.id===g.who))||'l1';__kitEnter(lid);
              const it=ARTI[g.who].items.findIndex(x=>x.g==='{id}');delete P.f[g.who+':'+it];const a=arts.find(x=>x.id===g.who&&x.i===it);startMini('{id}',{{art:a}})}})()""")
            await pg.wait_for_timeout(900)
            await pg.screenshot(path=f"{out}/{id}_1_setup.png")
            staged = await pg.evaluate("!!(MS.g.stages&&MS.g.stages.length)")
            if staged:   # plan 4 A10: one mid-play shot per stage (_2a, _2b, _2c)
                await pg.evaluate("(()=>{MS.i=MS.g.setup.length;miniAct('mbegin');MS.auto=true;stopMiniLoop()})()")
                for k, tag in enumerate("abc"):
                    await pg.evaluate("""((k)=>{for(let i=0;i<8000&&(MS.mode==='play'||MS.mode==='over');i++){if(MS.mode==='over'){miniAct('mtry');MS.auto=true}miniTick(.05);const s=MS.s;if(s.st>k||(s.st===k&&s.stT>1.8&&(!MS.g.shotReady||MS.g.shotReady(s))))break}miniDraw()})""" + f"({k})")
                    await pg.wait_for_timeout(200)
                    await pg.screenshot(path=f"{out}/{id}_2{tag}.png")
            else:
                await pg.evaluate("""(()=>{MS.i=MS.g.setup.length;miniAct('mbegin');MS.auto=true;stopMiniLoop();for(let i=0;i<600&&MS.mode==='play'&&!(MS.g.shotReady?MS.g.shotReady(MS.s):MS.s.t>=12);i++)miniTick(.05);miniDraw()})()""")
                await pg.wait_for_timeout(200)
                await pg.screenshot(path=f"{out}/{id}_2_play.png")
            await pg.evaluate("""(()=>{for(let i=0;i<9000&&MS.mode!=='result';i++){if(MS.mode==='over'){miniAct('mtry');MS.auto=true}miniTick(.05)}miniDraw()})()""")
            await pg.wait_for_timeout(2200)
            await pg.screenshot(path=f"{out}/{id}_3_win.png")
            await pg.evaluate("closeMini()")
        await ctx.close()
        self.add("info", "mini_shots", None, f"screenshots of {len(ids)} games in {out} (setup card; mid-play, one per stage for staged games; win card)")

    async def p13(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const out={art:[]};
          if(typeof TILESETS==='undefined'||!TILESETS.l3||!ATLAS.l3)out.art.push('TILESETS.l3/ATLAS.l3');
          ['grasping','uncarved','greatlamp3'].forEach(k=>{if(!SPRITES[k])out.art.push('SPRITES.'+k)});
          if(typeof LEVEL_DEFS==='undefined'||!LEVEL_DEFS.l3){out.exists=false;return out}
          const D=LEVEL_DEFS.l3,L3=LEVELS.find(L=>L.id==='l3');out.exists=true;out.format=D.format;
          out.missing=L3.ph.filter(id=>!TALK[id]||!(TALK[id].reflect||'').trim()||!ARTI[id]||!SPRITES[id]);
          const ch=D.challenges||[];out.challenges=ch.length;out.badCh=ch.filter(c=>!L3.ph.includes(c.p)).length;
          const tagged=new Set((D.objects||[]).filter(o=>o.station).map(o=>o.station));
          out.untagged=D.stations.map(s=>s.id).filter(id=>!tagged.has(id));
          const A=ATLAS.l3;(D.objects||[]).forEach(o=>{const O=OBJ[o.k];if(!O){out.art.push('OBJ.'+o.k);return}
            (O.anim||[O.r,O.rOn]).filter(Boolean).forEach(n=>{if(A&&!A.rects[n])out.art.push('ATLAS.l3.rects.'+n)})});
          __kitDef('l3');out.lights=props.filter(p=>p.light>0).length;
          out.mist=!!(D.weather&&D.weather.mist);out.mistFn=typeof mistOffset==='function';
          if(out.mistFn)out.moving=JSON.stringify(mistOffset(0))!==JSON.stringify(mistOffset(5000));
          return out})()""")
        await ctx.close()
        rm = None
        if r.get("exists") and r.get("mistFn"):
            ctx, pg, errs = await self.page(b, reduced=True)
            rm = await pg.evaluate("(()=>JSON.stringify(mistOffset(0))===JSON.stringify(mistOffset(5000)))()")
            await ctx.close()
        art = sorted(set(r["art"]))
        self.add("p13", "level3_art", not art, "tileset, atlas pieces and sprites present" if not art else f"missing: {art[:8]}")
        if not r.get("exists"):
            self.add("p13", "level3_defined", False, "LEVEL_DEFS.l3 not found")
            return
        self.add("p13", "level3_defined", r["format"] == 2, f"format {r['format']}")
        self.add("p13", "level3_all_thinkers", not r["missing"], "all 5 have TALK (with reflect), ARTI and a sprite" if not r["missing"] else f"missing: {r['missing']}")
        self.add("p13", "grasping_challenges", r["challenges"] >= 7 and r["badCh"] == 0, f"{r['challenges']} challenges, {r['badCh']} pointing at other lands' thinkers")
        self.add("p13", "level3_landmarks", not r["untagged"], "every station has an object tagged with its id" if not r["untagged"] else f"no landmark for: {r['untagged']}")
        self.add("p13", "level3_lights", r["lights"] >= 12, f"{r['lights']} light sources (target 12+)")
        ok = r["mist"] and r["mistFn"] and r.get("moving") and rm
        self.add("p13", "mist_weather", bool(ok), f"weather.mist={r['mist']}; mistOffset() exists={r['mistFn']}; drifts={r.get('moving')}; still with Reduce Motion={rm}")

    # ---------------- PHASE 11 ----------------
    async def p11(self, b):
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const bad=Object.keys(TALK).filter(id=>!TALK[id].reflect||!TALK[id].reflect.trim());return bad})()""")
        self.add("p11", "reflect_questions", not r, "every TALK entry has a non-empty reflect" if not r else f"missing reflect: {r}")
        await ctx.close()

        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{
          __kitDef('l1');
          ARTI.kierkegaard.items.forEach((_,i)=>P.f['kierkegaard:'+i]=1);
          startTalk(npcs.find(n=>n.id==='kierkegaard'));
          const hasReflectStep=TK.steps.some(s=>s.t==='reflect');
          const ri=TK.steps.findIndex(s=>s.t==='reflect');
          if(ri<0)return {hasReflectStep,saved:false,journalHas:false};
          TK.i=ri;renderStep();finishType();
          const rb=document.querySelector('#reflectBox');
          if(rb)rb.value='My test reflection.';
          const sv=document.querySelector('[data-act="reflectsave"]');if(sv)sv.click();
          const saved=P.r.kierkegaard&&P.r.kierkegaard.t==='My test reflection.';
          panelView='journal';renderPanel();
          const journalHas=document.querySelector('#panelBody').textContent.includes('My test reflection.');
          return {hasReflectStep,saved,journalHas};
        })()""")
        self.add("p11", "reflect_flow", r["hasReflectStep"] and r["saved"] and r["journalHas"],
                 f"reflect step shown: {r['hasReflectStep']}; Save sets P.r: {r['saved']}; Journal shows it: {r['journalHas']}")
        await ctx.close()

        ctx, pg, errs = await self.page(b)
        await pg.evaluate("""(()=>{
          __kitDef('l1');
          ARTI.nietzsche.items.forEach((_,i)=>P.f['nietzsche:'+i]=1);
          startTalk(npcs.find(n=>n.id==='nietzsche'));
          TK.i=TK.steps.findIndex(s=>s.t==='reflect');renderStep();finishType();
        })()""")
        await pg.click("#reflectBox")
        before = await pg.evaluate("TK.i")
        await pg.keyboard.press("z")
        r = await pg.evaluate("({val:document.querySelector('#reflectBox').value, i:TK.i})")
        self.add("p11", "typing_is_safe", r["val"] == "z" and r["i"] == before,
                 f"typed into the box: {r['val']!r}; conversation step unchanged: {r['i'] == before}")
        await ctx.close()

        # reflect sync (same fake-cloud pattern as the p1 device_sync check, but per thinker)
        def fake(local, cloud):
            return ("localStorage.setItem('examined-life-v1'," + json.dumps(json.dumps(local)) + ");"
                    "window.__cloud=" + json.dumps(cloud) + ";"
                    "window.claude={use:async(n)=>{"
                    " if(n==='db')return{doc:()=>({get:async()=>({exists:!!window.__cloud,data:()=>window.__cloud}),set:async(o)=>{window.__cloud=JSON.parse(JSON.stringify(o))}})};"
                    " if(n==='user')return{id:async()=>'u1'};"
                    " if(n==='assets')return{upload:async()=>({id:'x'}),delete:async()=>{}}"
                    "}};")
        rbase = {"c": {}, "a": {}, "w": {}, "f": {}, "r": {}, "intro": True, "ts": {"reset": 0, "a": 0, "w": 0}}
        sub = {}
        ctx, pg, errs = await self.page(b, init=fake({**rbase, "r": {"kierkegaard": {"t": "old text", "at": 100}}},
                                                    {**rbase, "r": {"kierkegaard": {"t": "new text", "at": 200}}}))
        await pg.wait_for_timeout(400)
        sub["newer_wins"] = await pg.evaluate("P.r.kierkegaard.t==='new text'")
        await ctx.close()
        ctx, pg, errs = await self.page(b, init=fake({**rbase, "r": {"kierkegaard": {"t": "keep this", "at": 300}}},
                                                    {**rbase, "r": {"kierkegaard": {"t": "old", "at": 100}}}))
        await pg.wait_for_timeout(400)
        sub["older_loses"] = await pg.evaluate("P.r.kierkegaard.t==='keep this'")
        await ctx.close()
        ctx, pg, errs = await self.page(b, init=fake({**rbase, "r": {"kierkegaard": {"t": "something", "at": 100}}},
                                                    {**rbase, "r": {"kierkegaard": {"t": "", "at": 200}}}))
        await pg.wait_for_timeout(400)
        sub["cleared_syncs"] = await pg.evaluate("!P.r.kierkegaard.t")
        await ctx.close()
        self.add("p11", "reflect_sync", all(sub.values()), "; ".join(f"{k}={v}" for k, v in sub.items()))

        ctx, pg, errs = await self.page(b)
        r_with = await pg.evaluate("""(()=>{
          __kitDef('l2');P.c.b1=3;
          startTalk(npcs.find(n=>n.boss));
          const steps=TK.steps.filter(s=>s.t==='ask');
          const echoSteps=steps.filter(s=>s.pre&&s.pre.startsWith('An echo of'));
          const l1Names=LEVELS.find(L=>L.id==='l1').ph.map(id=>PH[id].n);
          return {echoCount:echoSteps.length, allL1:echoSteps.every(s=>l1Names.includes(s.q.o[0]))};
        })()""")
        await ctx.close()
        ctx, pg, errs = await self.page(b)
        r_without = await pg.evaluate("""(()=>{
          __kitDef('l2');startTalk(npcs.find(n=>n.boss));
          return TK.steps.filter(s=>s.t==='ask'&&s.pre&&s.pre.startsWith('An echo of')).length;
        })()""")
        await ctx.close()
        ctx, pg, errs = await self.page(b)
        r_void = await pg.evaluate("""(()=>{
          __kitDef('l1');startTalk(npcs.find(n=>n.boss));
          return TK.steps.filter(s=>s.t==='ask'&&s.pre&&s.pre.startsWith('An echo of')).length;
        })()""")
        await ctx.close()
        ok = r_with["echoCount"] >= 1 and r_with["allL1"] and r_without == 0 and r_void == 0
        self.add("p11", "boss_echoes", ok,
                 f"with b1 cleared: {r_with['echoCount']} echo step(s), all Level I: {r_with['allL1']}; nothing cleared: {r_without} echoes; the Void: {r_void} echoes")

        ctx, pg, errs = await self.page(b)
        r1 = await pg.evaluate("""(()=>{
          __kitDef('l2');P.lastLevel='l2';window.__written=null;
          dbRef={set:(o)=>{window.__written=o;return Promise.resolve()}};
          persist();
          return !!(window.__written&&window.__written.lastLevel==='l2');
        })()""")
        r2 = await pg.evaluate("""(()=>{
          P.ts.reset=0;P.ts.w=100;P.lastLevel='l1';
          merge({ts:{reset:0,a:0,w:200},lastLevel:'l4'});
          return P.lastLevel==='l4'&&P.ts.w===200;
        })()""")
        self.add("p11", "last_land_sync", r1 and r2, f"persist() writes lastLevel: {r1}; merge takes a newer one: {r2}")
        await ctx.close()

    # ---------------- SCREENSHOTS ----------------
    async def shots(self, b, out):
        os.makedirs(out, exist_ok=True)
        ctx, pg, errs = await self.page(b)
        await pg.screenshot(path=f"{out}/01_title.png")
        lid = (await pg.evaluate(LEVEL_IDS_JS))[-1]
        await pg.evaluate(f"__kitEnter('{lid}')"); await pg.wait_for_timeout(400)
        await pg.screenshot(path=f"{out}/02_world_{lid}.png")
        first = await pg.evaluate(f"__kitDef('{lid}').stations[0].id")
        await pg.evaluate(f"ARTI['{first}'].items.forEach((_,i)=>P.f['{first}:'+i]=1);startTalk(npcs.find(n=>n.id==='{first}'));__kitToAsk()")
        await pg.screenshot(path=f"{out}/03_question.png")
        await pg.evaluate("reply(1);finishType()"); await pg.screenshot(path=f"{out}/04_wrong_reply.png")
        await pg.evaluate("advance();__kitToAsk();reply(0);finishType()"); await pg.screenshot(path=f"{out}/05_right_reply.png")
        await pg.evaluate(f"leaveTalk();P.c['{first}']=3;showReveal('{first}','New card earned','Screenshot test.')"); await pg.wait_for_timeout(1600)
        await pg.screenshot(path=f"{out}/06_card_reveal.png")
        await pg.evaluate("openPanel('cards','world')"); await pg.wait_for_timeout(300); await pg.screenshot(path=f"{out}/07_collection.png")
        await pg.evaluate("panelView='journal';renderPanel()"); await pg.wait_for_timeout(200); await pg.screenshot(path=f"{out}/08_journal.png")
        await pg.evaluate(f"closePanel();Object.keys(TALK).forEach(id=>P.c[id]=3);startTalk(npcs.find(n=>n.boss));__kitToAsk()")
        await pg.screenshot(path=f"{out}/09_boss_question.png")
        await ctx.close()
        self.add("info", "screenshots", None, f"saved to {out} (fonts and art can't load in the test browser; that's expected)")

    # ---------------- PHASE 26 ----------------
    async def p26(self, b):
        src = self.all_src()
        # every sound name any sfx(...) call can use, including both sides of a ternary
        used = set()
        for m in re.finditer(r'sfx\(', src):
            j, depth = m.end(), 1
            while j < len(src) and depth:
                depth += (src[j] == "(") - (src[j] == ")")
                j += 1
            used.update(re.findall(r'"([a-z0-9_]+)"', src[m.end():j]))
        used.discard("name")

        # ---- sfx_safe: no audio at all, then real audio
        ctxA, pgA, errsA = await self.page(b, init="window.AudioContext=undefined;window.webkitAudioContext=undefined;")
        rA = await pgA.evaluate("""(()=>{const names=Object.keys(SFX).concat(['no_such_sound']);let threw=[];
          for(const n of names){try{sfx(n,.5,.5)}catch(e){threw.push(n)}}
          let flow=true;try{__kitEnter('l1');auScreen('world');auApply();setSound(false);setSound(true);show('title')}catch(e){flow=String(e)}
          return {init:auInit(),ctx:!!AU.ctx,ok:auOK(),threw,flow,n:names.length}})()""")
        await ctxA.close()
        ctx, pg, errs = await self.page(b)
        pre = await pg.evaluate("({ctx:!!AU.ctx,ok:auOK()})")          # nothing before the first tap or key press
        await pg.mouse.click(2, 2)
        await pg.wait_for_timeout(400)
        rB = await pg.evaluate("""(()=>{const keys=Object.keys(SFX),direct=[],viaSfx=[];
          for(const n of keys){try{SFX[n](.5,.5);SFX[n]()}catch(e){direct.push(n+':'+e.message)}}
          for(const n of keys){try{sfx(n,.5,.5)}catch(e){viaSfx.push(n)}}
          const reached=keys.filter(n=>AU.last[n]!=null).length;
          return {state:AU.ctx&&AU.ctx.state,ok:auOK(),keys,direct,viaSfx,reached}})()""")
        missing = sorted(n for n in used if n not in rB["keys"])
        ok = (not rA["threw"] and rA["flow"] is True and rA["init"] is False and not rA["ok"] and not pre["ctx"] and not pre["ok"]
              and rB["ok"] and not rB["direct"] and not rB["viaSfx"] and not missing and rB["reached"] == len(rB["keys"]) and not errs and not errsA)
        self.add("p26", "sfx_safe", ok,
                 f"{rA['n']} names with no audio in the browser: threw={rA['threw'] or 'none'}, flow={rA['flow']}; silent before the first tap/key (ctx={pre['ctx']}); "
                 f"after a tap the audio is {rB['state']}; {len(rB['keys'])} voices ran without errors (direct errors: {rB['direct'] or 'none'}); "
                 f"{len(used)} names used in the game, without a voice: {missing or 'none'}; page errors: {(errs + errsA) or 'none'}")

        # ---- sound_wired: sounds fire at the moments the plan lists
        r = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const out={};
          window.__calls=[];const orig=window.sfx;window.sfx=function(n,...a){__calls.push(n);return orig.apply(this,[n,...a])};
          const seen=()=>{const c=__calls.slice();__calls.length=0;return c};
          // the A prompt, and examining a plain artifact for the first time
          __kitDef('l1');enterLevel('l1');P.f={};seen();
          const a=arts.find(x=>!(x.g&&MINI[x.g]));pl.x=a.x+.5;pl.y=a.y+1.1;pl.dir='up';findTarget();
          out.prompt=seen().includes('prompt');findTarget();out.promptOnce=!seen().includes('prompt');
          pressA();const c1=seen();out.earned=c1.includes('earned');out.pageOnSign=c1.includes('page');closeSign();
          pressA();const c1b=seen();out.lookAgain=!c1b.includes('earned')&&c1b.includes('page');closeSign();
          // the conversation: page on advance, chime on a right answer, low note on a miss
          const st=CUR.stations[0];ARTI[st.id].items.forEach((_,i)=>P.f[st.id+':'+i]=1);P.c={};
          startTalk(npcs.find(n=>n.id===st.id));seen();let g=0,rt=0,ms=0,pg=0,missed=false;
          while(TK&&g++<200){if(TK.typing){finishType();continue}const s=TK.fb||TK.steps[TK.i];
            if(!TK.fb&&s.t==='ask'){if(!missed){reply(1);missed=true}else{reply(0);missed=false}continue}
            if(!TK.fb&&s.t==='choice'){break}
            if(s.t==='reflect'){reflectAdvance();continue}advance()}
          const c2=seen();out.page=c2.includes('page');out.right=c2.includes('right');out.miss=c2.includes('miss');
          if(TK)leaveTalk();
          // the card reveal, and a wall of shadow beginning to fade
          showReveal(st.id,'New card earned','x');out.card=seen().includes('card');show('world');
          P.c[st.id]=3;fadeStart[1]=-1;pl.x=CUR.stations[1].c[0]+.5;pl.y=CUR.stations[1].c[1]+3;
          for(let i=0;i<3;i++){try{draw(performance.now(),.016)}catch(e){}}out.shadow=seen().includes('shadow');
          // buttons tap; a reply button stays quiet (it has its own sound)
          openPanel('menu','world');seen();document.querySelector('[data-act="howto"]').click();out.tap=seen().includes('tap');
          window.sfx=orig;return out})()""")
        bad = [k for k, v in r.items() if not v]
        self.add("p26", "sound_wired", not bad,
                 "sounds at each planned moment: " + ", ".join(f"{k}={v}" for k, v in r.items()) + (f"; MISSING: {bad}" if bad else ""))
        await ctx.close()

        # ---- sound_toggle: the switch shows, saves per device, and silences everything
        ctx, pg, errs = await self.page(b)
        await pg.mouse.click(2, 2)
        await pg.wait_for_timeout(300)
        r = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const out={};
          __kitEnter('l1');await sleep(300);out.keyBefore=AU.key;
          let calls=0;const oc=SFX.chime;SFX.chime=()=>{calls++};
          openPanel('menu','world');
          const btn=()=>document.querySelector('#panelBody [data-act="sound"]');
          out.label1=btn()&&btn().textContent;out.default_on=SND_ON===true&&(localStorage.getItem('examined-life-sound')===null||localStorage.getItem('examined-life-sound')==='1');
          return out})()""")
        await pg.click('#panelBody [data-act="sound"]')
        await pg.wait_for_timeout(300)
        r2 = await pg.evaluate("""(async()=>{const out={};
          const btn=document.querySelector('#panelBody [data-act="sound"]');
          out.label2=btn&&btn.textContent;out.saved0=localStorage.getItem('examined-life-sound');out.off=SND_ON===false;
          out.ambientGone=AU.key===null&&AU.amb===null;
          window.__n=0;SFX.chime=()=>{window.__n++};sfx('chime');out.silent=window.__n===0;
          return out})()""")
        await pg.click('#panelBody [data-act="sound"]')
        await pg.wait_for_timeout(300)
        r3 = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const out={};
          const btn=document.querySelector('#panelBody [data-act="sound"]');
          out.label3=btn&&btn.textContent;out.saved1=localStorage.getItem('examined-life-sound');out.on=SND_ON===true;
          window.__n=0;SFX.chime=()=>{window.__n++};await sleep(50);sfx('chime');out.speaks=window.__n===1;
          closePanel();await sleep(300);out.ambientBack=AU.key==='l1';
          // the same switch on a mini-game's pause card
          startMini('sisyphus');miniAct('mnext');miniAct('mnext');miniAct('mbegin');miniPause();
          const mb=document.querySelector('#mCard [data-act="sound"]');out.miniBtn=mb&&mb.textContent;
          if(mb)mb.click();const mb2=document.querySelector('#mCard [data-act="sound"]');out.miniAfter=mb2&&mb2.textContent;out.miniOff=SND_ON===false&&localStorage.getItem('examined-life-sound')==='0';
          if(mb2)mb2.click();out.miniOn=SND_ON===true;closeMini();
          return out})()""")
        # Off survives a reload (the setting is per device, in localStorage)
        await pg.evaluate("localStorage.setItem('examined-life-sound','0')")
        await pg.reload()
        await pg.wait_for_timeout(400)
        r4 = await pg.evaluate("({off:SND_ON===false,saved:localStorage.getItem('examined-life-sound')})")
        okk = (r["label1"] == "Sound: On" and r["default_on"] and r["keyBefore"] == "l1" and r2["label2"] == "Sound: Off" and r2["saved0"] == "0" and r2["off"]
               and r2["ambientGone"] and r2["silent"] and r3["label3"] == "Sound: On" and r3["saved1"] == "1" and r3["on"] and r3["speaks"] and r3["ambientBack"]
               and r3["miniBtn"] == "Sound: On" and r3["miniAfter"] == "Sound: Off" and r3["miniOff"] and r3["miniOn"] and r4["off"] and not errs)
        self.add("p26", "sound_toggle", okk, f"menu {r['label1']} (default on: {r['default_on']}) -> {r2['label2']} (saved {r2['saved0']}, background gone: {r2['ambientGone']}, effects silent: {r2['silent']}) "
                 f"-> {r3['label3']} (saved {r3['saved1']}, effects back: {r3['speaks']}, background back: {r3['ambientBack']}); mini-game pause card: {r3['miniBtn']} -> {r3['miniAfter']} -> back on {r3['miniOn']}; off survives a reload: {r4['off']}; page errors: {errs or 'none'}")
        await ctx.close()

        # ---- ambient_stops: the background belongs to the world and the mini-games only
        ctx, pg, errs = await self.page(b)
        await pg.mouse.click(2, 2)
        await pg.wait_for_timeout(300)
        r = await pg.evaluate("""(async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));const out={lands:{}};
          for(const id of ['l1','l2','l3','l4']){__kitEnter(id);await sleep(250);out.lands[id]=AU.key===id&&!!AU.amb&&AU.amb.srcs.length>0}
          __kitEnter('l1');await sleep(250);const A=AU.amb;
          show('title');await sleep(120);out.titleStops=AU.key===null&&AU.amb===null;
          await sleep(2300);out.faded=A&&A.g.gain.value<.001;
          __kitEnter('l1');await sleep(250);out.worldBack=AU.key==='l1';
          openPanel('menu','world');await sleep(120);out.menuStops=AU.key===null;closePanel();await sleep(250);out.menuBack=AU.key==='l1';
          const st=CUR.stations[0];ARTI[st.id].items.forEach((_,i)=>P.f[st.id+':'+i]=1);P.c={};
          startTalk(npcs.find(n=>n.id===st.id));await sleep(120);out.talkStops=AU.key===null;leaveTalk();await sleep(250);out.talkBack=AU.key==='l1';
          startMini('sisyphus');await sleep(250);out.miniKeeps=AU.key==='l1'&&AU.lvl<1;closeMini();await sleep(250);out.miniBack=AU.key==='l1'&&AU.lvl===1;
          // a boss round: quiet in the talk, the land's bed during the round
          __kitDef('l2');__kitEnter('l2');P.c={};startTalk(npcs.find(n=>n.boss));let g=0;
          while(TK&&screen==='talk'&&g++<300){if(TK.typing){finishType();continue}const s=TK.fb||TK.steps[TK.i];if(!TK.fb&&s.t==='ask'){reply(0);continue}advance()}
          await sleep(250);out.bossRound=screen==='mini'&&AU.key==='l2';closeMini();TK=null;show('world');
          // a video with sound quiets everything; without it, things return
          __kitEnter('l3');await sleep(250);const before=AU.key;
          const v=document.createElement('video');Object.defineProperty(v,'paused',{value:false});v.muted=false;document.body.appendChild(v);await sleep(650);
          out.videoDucks=before==='l3'&&AU.vid===1&&AU.key===null;
          let n=0;const oc=SFX.chime;SFX.chime=()=>{n++};sfx('chime');out.videoSilencesSfx=n===0;SFX.chime=oc;
          v.remove();await sleep(650);out.videoReturns=AU.vid===0&&AU.key==='l3';
          // rumble: only in the Stormcliffs, never with Lightning flashes off
          __kitEnter('l1');await sleep(250);AU.rumT=null;CALM=true;auRumble();out.calmNoRumble=AU.rumT===null;CALM=false;auRumble();out.rumbles=AU.rumT!==null;
          return out})()""")
        lands_ok = all(r["lands"].values())
        rest = {k: v for k, v in r.items() if k != "lands"}
        bad = [k for k, v in rest.items() if not v]
        self.add("p26", "ambient_stops", lands_ok and not bad and not errs,
                 f"background bed starts in each land: {r['lands']}; " + ", ".join(f"{k}={v}" for k, v in rest.items()) + (f"; WRONG: {bad}" if bad else "") + f"; page errors: {errs or 'none'}")
        await ctx.close()

    async def tour(self, b, out):
        os.makedirs(out, exist_ok=True)
        ctx, pg, errs = await self.page(b)
        ids = await pg.evaluate(LEVEL_IDS_JS)
        count = 0
        for lid in ids:
            st = await pg.evaluate(f"(()=>{{const D=__kitDef('{lid}');__kitEnter('{lid}');return {{start:D.start,stations:D.stations.map(s=>({{id:s.id,x:s.c[0],y:s.c[1]}}))}}}})()")
            spots = [("start", st["start"][0], st["start"][1] - 1)] + [(s["id"], s["x"], s["y"] + 2) for s in st["stations"]]
            for k, (name, x, y) in enumerate(spots):
                await pg.evaluate(f"pl.x={x}+.5;pl.y={y}+.6;pl.dir='up'")
                await pg.wait_for_timeout(250)
                await pg.screenshot(path=f"{out}/tour_{lid}_{k:02d}_{name}.png")
                count += 1
        await ctx.close()
        self.add("info", "tour", None, f"{count} screenshots in {out} (one per thinker, from just south of them)")

    async def run(self):
        from playwright.async_api import async_playwright
        self.check_syntax()
        if self.results and self.results[0][2] == "FAIL":
            return
        want = set(self.args.only.split(",")) if self.args.only else None
        httpd = _serve(os.path.dirname(self.path))
        self.url = f"http://127.0.0.1:{httpd.server_address[1]}/{os.path.basename(self.path)}"
        async with async_playwright() as p:
            b = await p.chromium.launch(executable_path=CHROME if os.path.exists(CHROME) else None, args=["--no-sandbox"])
            if self.args.dump_world:
                json.dump(await self.dump_world(b), open(self.args.dump_world, "w"))
                self.add("info", "dump_world", None, f"Level I world saved to {self.args.dump_world}")
            core = [self.check_data, self.check_balance, self.check_map, self.check_play,
                    self.check_reveal_text, self.check_layout_se, self.check_builtin_art]
            phases = {"p0": self.p0, "p1": self.p1, "p2": self.p2, "p3": self.p3, "p4": self.p4, "p5": self.p5, "p6": self.p6, "p7": self.p7, "p9": self.p9, "p11": self.p11, "p13": self.p13, "p15": self.p15, "p16": self.p16, "p18": self.p18, "p19": self.p19, "p20": self.p20, "p21": self.p21, "p22": self.p22, "p23": self.p23, "p24": self.p24, "p25": self.p25, "p26": self.p26, "p28": self.p28, "addendum": self.addendum, "p29": self.p29, "p30": self.p30, "p31": self.p31, "p32": self.p32, "p33": self.p33, "p34": self.p34, "p35": self.p35, "p36": self.p36, "p38": self.p38, "p39": self.p39, "p40": self.p40, "p41": self.p41, "p42": self.p42, "p43": self.p43, "p44": self.p44, "p45": self.p45}
            for fn in core:
                if want and fn.__name__.replace("check_", "") not in want and "core" not in want:
                    continue
                try:
                    await fn(b)
                except Exception as e:
                    self.add("core", fn.__name__.replace("check_", ""), False, f"check crashed: {str(e)[:200]}")
            for g, fn in phases.items():
                if want and g not in want:
                    continue
                try:
                    await fn(b)
                except Exception as e:
                    self.add(g, g + "_checks", False, f"check crashed (usually means this phase isn't done yet): {str(e).splitlines()[0][:160]}")
            if self.args.shots:
                try:
                    await self.shots(b, self.args.shots)
                except Exception as e:
                    self.add("info", "screenshots", None, f"screenshot run failed: {str(e)[:160]}")
            if self.args.mini_shots:
                try:
                    await self.mini_shots(b, self.args.mini_shots)
                except Exception as e:
                    self.add("info", "mini_shots", None, f"mini screenshot run failed: {str(e)[:160]}")
            if self.args.tour:
                try:
                    await self.tour(b, self.args.tour)
                except Exception as e:
                    self.add("info", "tour", None, f"tour failed: {str(e)[:160]}")
            await b.close()
        httpd.shutdown()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("game")
    ap.add_argument("--require", default="core")
    ap.add_argument("--only", default="")
    ap.add_argument("--pairs", action="store_true")
    ap.add_argument("--shots", default="")
    ap.add_argument("--dump-world", dest="dump_world", default="")
    ap.add_argument("--compare-world", dest="compare_world", default="")
    ap.add_argument("--blobs", default="")
    ap.add_argument("--tour", default="")
    ap.add_argument("--mini-shots", dest="mini_shots", default="")
    ap.add_argument("--mini-ids", dest="mini_ids", default="")
    ap.add_argument("--legacy", default="")
    args = ap.parse_args()
    kit = Kit(args.game, args)
    asyncio.run(kit.run())
    req = set(args.require.split(","))
    width = max(len(n) for _, n, _, _ in kit.results) if kit.results else 10
    failed_required = []
    for g, n, s, d in kit.results:
        mark = {"PASS": "✅", "FAIL": "❌", "INFO": "ℹ️ "}[s]
        tag = "REQUIRED" if g in req else g
        print(f"{mark} [{g:4}] {n:<{width}}  {d}")
        if s == "FAIL" and g in req:
            failed_required.append(n)
    print("\nRequired groups:", ",".join(sorted(req)))
    if failed_required:
        print("RESULT: FAIL —", ", ".join(failed_required))
        sys.exit(1)
    print("RESULT: PASS")

if __name__ == "__main__":
    main()
