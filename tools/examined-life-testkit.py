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

    async def page(self, b, w=393, h=852, dpr=3, reduced=False, init=None, block=None, extra_blobs=None, url=None):
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
        if init:
            await pg.add_init_script(init)
        await pg.goto(url or self.url)
        await pg.wait_for_timeout(350)
        await pg.evaluate(HELPERS_JS)
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
          const b=arts.find(x=>x.id==='camus'&&x.i===0);delete P.f['camus:0'];return {l1,l2,g:a.g,plain:artLabel(b)}})()""")
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
          P.c.camus=3;P.m.sisyphus={best:1,plays:1,won:true,at:1};delete P.f['camus:1'];const before=JSON.stringify(P.f);
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
        await self.mini_suite(b, "p21", ["goalkeeper", "idols", "having", "cages"])

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
          for(let sc=0;sc<4;sc++){const o={sci:s.sci,wrong:[]};
            for(const k of [1,2]){run(s,5,()=>s.ph==='choose');pick(s,k);const alone=s.ph==='you'||s.ph==='reset';run(s,1,()=>s.ph==='you');const mine=s.ph==='you'&&s.me&&!s.figs.some(f=>f.ad);
              run(s,12,()=>s.ph==='bad');o.wrong.push({k,alone:alone&&mine,bad:s.ph==='bad',stars:s.stars})}
            run(s,5,()=>s.ph==='choose');pick(s,0);const res=run(s,14,()=>s.ph==='good'||s.ph==='next'||(s.ph==='choose'&&s.sci>sc));o.good=s.stars===sc+1||res==='win';if(res==='win')won=true;
            if(sc<3)run(s,4,()=>s.ph==='choose'&&s.sci===sc+1);out.scenes.push(o)}
          if(!won)won=run(s,6,()=>false)==='win';out.won=won;out.rate=g.rate(s);
          const s2={W:192,H:320,rm:false,t:0};g.init(s2);let w2=false;for(let i=0;i<180/.05&&!w2;i++){const inp=miniBlankInp();s2.t+=.05;g.auto(s2,inp);w2=g.step(s2,.05,inp)==='win'}out.rate2=g.rate(s2);
          const s3={W:192,H:320,rm:false,t:0};g.init(s3);s3.wrong=[1,1,0,1];out.rate3=g.rate(s3);return out})()""")
        if r.get("missing"):
            self.add("p24", "rule_cards", False, "MINI.rule is not defined")
        else:
            ok = all(all(w["alone"] and w["bad"] for w in o["wrong"]) and o["good"] for o in r["scenes"]) and r["won"]
            self.add("p24", "rule_cards", ok, f"4 scenes: each wrong card tried by you alone, then collapses; the working card lights a star={ok}; won={r['won']}")
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
        await pg.evaluate("__kitEnter('l3');startMini('boss_b3',{boss:true});miniAct('mnext');miniAct('mbegin');MS.s.spT=99;MS.s.slots[0]={k:0,heavy:false,f:1};MS.s.slots[1]={k:6,heavy:true,f:1};MS.s.slots[2]={k:7,heavy:true,f:1}")
        x, y = await at(9 + 10, 172 + 14); await pg.mouse.move(x, y); await pg.mouse.down(); await pg.mouse.up(); await pg.wait_for_timeout(250)
        out["b3_tap"] = await pg.evaluate("MS.s.slots[0]===null&&MS.s.done===1")
        x, y = await at(9 + 22 + 10, 172 + 14); await pg.mouse.move(x, y); await pg.mouse.down(); await pg.wait_for_timeout(500)
        mid = await pg.evaluate("MS.s.hold>.2&&MS.s.hold<.95&&!!MS.s.slots[1]")
        await pg.wait_for_timeout(700); await pg.mouse.up(); await pg.wait_for_timeout(150)
        out["b3_hold"] = mid and await pg.evaluate("MS.s.slots[1]===null&&MS.s.done===2")
        x, y = await at(9 + 44 + 10, 172 + 14); await pg.mouse.move(x, y); await pg.mouse.down()
        for i in range(12):
            await pg.mouse.move(x, y - 14 * (i + 1), steps=1)   # a fast yank, well over the speed limit
        await pg.mouse.up(); await pg.wait_for_timeout(150)
        out["b3_fast_yank_holds_on"] = await pg.evaluate("!!MS.s.slots[2]")
        await pg.evaluate("closeMini();TK=null")
        await pg.evaluate("__kitEnter('l4');startMini('boss_b4',{boss:true});miniAct('mnext');miniAct('mbegin')")
        for lx in (40, 96, 152):
            x, y = await at(lx, 200); await pg.mouse.click(x, y); await pg.wait_for_timeout(900)
        seen = await pg.evaluate("MS.s.seen.every(Boolean)")
        x, y = await at(98, 60); await pg.mouse.click(x, y); await pg.wait_for_timeout(200)
        out["b4_lenses_then_bell"] = seen and await pg.evaluate("MS.s.solved===true")
        await pg.wait_for_timeout(2100)
        await pg.evaluate("MS.s.seen=[true,true,true]")
        x, y = await at(40, 132); await pg.mouse.move(x, y); await pg.mouse.down()
        for i in range(1, 21):
            gx, gy = await at(40 + 110 * i / 20, 132 + 18 * i / 20); await pg.mouse.move(gx, gy); await pg.wait_for_timeout(30)
        await pg.mouse.up(); await pg.wait_for_timeout(200)
        out["b4_drag_into_place"] = await pg.evaluate("MS.s.st===1&&MS.s.solved===true")
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
          return {of:t.of,games:Object.keys(MINI).length,bossIds,listed}})()""")
        self.add("p25", "boss_round_leaves_no_trace", r["of"] == 51 and r["games"] == 22 and len(r["bossIds"]) == 4 and not r["listed"],
                 f"lanterns possible={r['of']} (want 51); games={r['games']} (want 18 + 4); boss rounds={r['bossIds']}; thinkers wrongly listing one={r['listed'] or 'none'}")
        await ctx.close()

    # ---------------- PHASE 28 ----------------
    # ---------------- PHASE 29: foundations (split files, 2x stage, art loading, stages, plates) ----------------
    async def p29(self, b):
        ALL = ["sisyphus","goalkeeper","idols","having","cages","mean","gadfly","yours","thieves","above","lute","water","kitchen","butterfly",
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
        if os.path.exists(legacy):
            from PIL import Image
            import base64, io
            JS = """((id,hd)=>{let seed=11;Math.random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
              const g=MINI[id];const cv=document.createElement('canvas');cv.width=hd?384:192;cv.height=hd?640:320;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
              const s={W:192,H:320,rm:false,t:0};g.init(s);for(let i=0;i<60;i++){const inp=miniBlankInp();s.t+=.05;g.auto(s,inp);g.step(s,.05,inp)}
              if(hd)c.setTransform(2,0,0,2,0,0);g.draw(s,c,3000);return cv.toDataURL('image/png')})"""
            srv = _serve(os.path.dirname(os.path.abspath(legacy)))
            lurl = f"http://127.0.0.1:{srv.server_address[1]}/{os.path.basename(legacy)}"
            out = []
            for id in ["gadfly", "water", "rule", "boss_b1"]:
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
    async def hd_suite(self, b, group, ids):
        """Plan 4 A10: per developed game — fallback (no art), art (with --blobs), stages (auto through all three, with banners), plate."""
        for id in ids:
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
            if a["has"]:
                ok = a["o1"] < .5 and a["o2"] == 1 and c["o1"] == 1 and c["o2"] == 1
                self.add(group, f"hd_{id}_plate", ok, f"plate: early bloom {a['o1']:.2f}, at the result {a['o2']}; Reduce Motion: shown at once {c['o1']} (a still)")
            else:
                ok = a["o2"] == 0 and c["o2"] == 0
                self.add(group, f"hd_{id}_plate", ok, f"no plate yet (skipped by Cade): the bloom's last frame holds and #mPlate stays hidden (opacity {a['o2']}, Reduce Motion {c['o2']})")

    async def p30(self, b):
        await self.mini_suite(b, "p30", ["sisyphus"])
        await self.hd_suite(b, "p30", ["sisyphus"])
        ctx, pg, errs = await self.page(b)
        r = await pg.evaluate("""(()=>{const g=MINI.sisyphus,T=g._t,out={};const S=()=>{const s={W:192,H:320,rm:false,t:0};g.init(s);return s};
          const run=(s,sec,f)=>{let res;for(let i=0;i<sec/.05;i++){const inp=miniBlankInp();if(f)f(s,inp,i);s.t+=.05;res=g.step(s,.05,inp);if(res)return res}return res};
          const alt=(s,inp,i)=>{if(i%2)inp.bTap=true;else inp.aTap=true};
          // rolls back at 92%, in every stage (Stage II is the walk down itself); in Stage III with the meter full, the top starts the bloom
          let s=S();s.p=T.TOP-.004;run(s,2,(s,inp,i)=>{if(s.ph==='climb')alt(s,inp,i)});out.r0=s.ph==='down'&&s.st===1&&s.p<T.TOP;
          s=S();g.toStage(s,2);s.smile=0;s.p=T.TOP-.004;run(s,2,(s,inp,i)=>{if(s.ph==='climb')alt(s,inp,i)});out.r2=s.ph==='down'&&s.st===2;
          s=S();g.toStage(s,2);s.smile=T.GOAL;s.descSeen=2;s.p=T.TOP-.004;out.win=run(s,2,(s,inp,i)=>{if(s.ph==='climb')alt(s,inp,i)})==='win';
          // no mashing: 20 alternating pushes inside one second add no more than 8 pushes' worth
          s=S();const p0=s.p;run(s,.05,(s,inp)=>inp.aTap=true);const one=s.p-p0;s=S();s.t=5;s.lastPush=5;const q0=s.p;for(let i=0;i<20;i++){const inp=miniBlankInp();if(i%2)inp.bTap=true;else inp.aTap=true;s.t+=.05;g.step(s,.05,inp)}
          out.one=one;out.twenty=s.p-q0;out.mash=out.twenty<=8*one+1e-9&&out.twenty>=7*one-1e-9;
          // same side twice only shuffles
          s=S();run(s,.05,(s,inp)=>inp.aTap=true);const a1=s.p;run(s,.05,(s,inp)=>inp.aTap=true);out.same=s.p<=a1+1e-9;
          // descent only: Stage II's moments appear only on the walk down and count double; climbs never show them
          s=S();g.toStage(s,1);const kinds=[];let dbl=null;run(s,30,(s,inp)=>{if(s.mo&&!s.mo._seen){s.mo._seen=1;kinds.push([s.mo.k,s.mo.desc,s.ph,s.st])}
            if(dbl==null&&s.mo&&!s.mo.gone&&s.mo.a>.3){const b=s.smile;inp.uTap=true;s._chk=b}});
          out.descKinds=kinds;out.descOnly=kinds.length>0&&kinds.filter(k=>k[3]===1).every(k=>k[1]&&k[2]==='down');
          s=S();g.toStage(s,1);let before=-1,after=-1;run(s,8,(s,inp)=>{if(before<0&&s.mo&&!s.mo.gone&&s.mo.a>.3){before=s.smile;inp.uTap=true}else if(before>=0&&after<0)after=s.smile});out.double=after-before===2;
          s=S();const ck=[];run(s,40,(s,inp,i)=>{if(s.ph==='climb')alt(s,inp,i);if(s.mo&&!s.mo._s){s.mo._s=1;ck.push([s.mo.desc,s.ph])}});out.climbPlain=ck.filter(k=>k[1]!=='down').every(k=>!k[0])&&ck.length>0;
          // lanterns record attention: Stage III plants one per moment noticed, and each new one plants another
          s=S();g.toStage(s,2);const got=s.got,lan=s.lan.length;run(s,20,(s,inp,i)=>{alt(s,inp,i);if(s.mo&&!s.mo.gone&&s.mo.a>.3)inp.uTap=true});out.lan0=lan===got;out.lan1=s.lan.length===s.got&&s.got>got;
          return out})()""")
        self.add("p30", "sis_rolls_back", r["r0"] and r["r2"] and r["win"], f"Stage I: at 92% it wobbles and rolls, and the walk down begins={r['r0']}; Stage III without a full meter rolls back again={r['r2']}; with the meter full the top starts the bloom (its last rollback)={r['win']}")
        self.add("p30", "sis_no_mash", r["mash"] and r["same"], f"one push adds {r['one']:.4f}; 20 alternating pushes in one second add {r['twenty']:.4f} (at most 8 pushes' worth={r['mash']}); the same side twice only shuffles={r['same']}")
        self.add("p30", "sis_descent_only", r["descOnly"] and r["double"] and r["climbPlain"], f"Stage II moments {[(k[0], 'walk down' if k[2]=='down' else k[2]) for k in r['descKinds']]} all on the walk down={r['descOnly']}; noticing one adds 2={r['double']}; climbing moments are never the descent kind={r['climbPlain']}")
        self.add("p30", "sis_lanterns_record", r["lan0"] and r["lan1"], f"Stage III plants one lantern per moment noticed={r['lan0']}; each moment noticed in Stage III plants another={r['lan1']}")
        await ctx.close()

    async def p31(self, b):
        ids = [i for i in ["idols", "goalkeeper", "having", "cages"]]
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
            let selfOk=true;for(let i=0;i<30;i++){s=S('idols');g.toStage(s,2);const G=s.giants[2];if(!(G&&G.g===2&&G.secs.some(x=>x.hollow)&&G.secs.some(x=>!x.hollow)&&s.giants.every(Q=>Q.secs.some(x=>x.hollow))))selfOk=false}out.self=selfOk}
          /* ---- goalkeeper ---- */
          {const g=MINI.goalkeeper,T=g._t;let s=S('goalkeeper'),hit=0;for(let i=0;i<300;i++){T.newShot(s);if(s.tell===s.zone)hit++}out.tellRate=hit/300;
            s=S('goalkeeper');s.cm=[5,5,6];s.saves=0;out.r16=g.rate(s);s.saves=16;s.cm=[5,4,4];out.r13=g.rate(s);s.cm=[5,4,5];out.r14=g.rate(s);
            s=S('goalkeeper');run('goalkeeper',s,3,(s,inp)=>{});const phase=s.ph;s=S('goalkeeper');run('goalkeeper',s,1.6,()=>{});const ph2=s.ph;run('goalkeeper',s,.05,(s,inp)=>{inp.aTap=true;inp.dx=-1});
            out.late={ph:ph2,dive:s.dive,commit:s.commit,cm:s.cm[0]};out.lateOk=ph2==='fly'&&s.dive===0&&s.commit==null&&s.cm[0]===0;
            s=S('goalkeeper');out.again=run('goalkeeper',s,20,()=>{})==='end'&&s.st===0}
          /* ---- having ---- */
          {const g=MINI.having,T=g._t;let s=S('having');s.iT=99;s.mT=99;const m=T.spawnMoment(s,'lamp',96,T.HOVER);m.y=T.WALK()-10;m.hy=T.WALK()-10;run('having',s,.5,(s,inp)=>{inp.dx=.2});
            const bl=s.basket.length;s.items.push({k:'coins',w:1,x:s.x,y:T.WALK()-14,vy:50,ph:0,sw:0});run('having',s,.3,()=>{});out.uncatch=bl===0&&s.basket.length===1;
            s=S('having');const v0=T.speed(s),r0=T.reach(s);s.w=3;out.slow=T.speed(s)<v0&&T.reach(s)<r0;out.sp=[v0,T.speed(s)];
            s=S('having');g.toStage(s,1);s.iT=99;s.mT=99;s.fT=99;s.basket=[{k:'crown',w:2}];s.w=2;run('having',s,.05,(s,inp)=>inp.bTap=true);const inAir=s.gifts.length===1&&s.w===0;run('having',s,1.2,()=>{});
            out.give=inAir&&s.gate.some(p=>p.lit)&&s.moms.some(m=>m.kind==='firefly'&&m.to!==undefined);
            s=S('having');g.toStage(s,1);s.iT=99;s.mT=99;s.fT=99;const mm=T.spawnMoment(s,'flower',s.x+30,T.HOVER);mm.y=mm.hy;s.items.push({k:'frame',w:2,x:s.x,y:T.WALK()-14,vy:50,ph:0,sw:0});run('having',s,.3,()=>{});
            out.frame=mm.trapped&&s.basket.some(b=>b.k==='trophy'&&b.w===2)&&s.frames===1;
            // standing still under a moment for a second is being with it
            s=S('having');s.iT=99;s.mT=99;const m4=T.spawnMoment(s,'note',s.x,T.HOVER);m4.y=m4.hy;run('having',s,1.2,()=>{});out.still=m4.bloomed&&s.pts===1}
          /* ---- cages ---- */
          {const g=MINI.cages,T=g._t;let s=S('cages');const m0=s.mask;const pos=MINI_ART.cages.ring;const p=pos[2];run('cages',s,.05,(s,inp)=>{inp.taps=[{x:p[0],y:p[1]-15}]});run('cages',s,.5);
            out.ring=(m0^s.mask)===((1<<1)|(1<<2)|(1<<3));
            s=S('cages');g.toStage(s,1);const m1=s.mask,P=MINI_ART.cages.plaza,q=P[1];run('cages',s,.05,(s,inp)=>{inp.taps=[{x:q[0],y:q[1]-15}]});run('cages',s,.5);
            out.web=(m1^s.mask)===T.g2().m[1]&&T.g2().m[1]!==(1<<1);
            let solv=true;for(let i=0;i<60;i++){s=S('cages');if(!(T.g1().dist[s.mask]>0))solv=false;g.toStage(s,1);if(!(T.g2().dist[s.mask]>0))solv=false}out.solv=solv;
            s=S('cages');let last=true,yours=[];for(let i=0;i<10&&s.st===0;i++){const k=T.bestKey(s);if(k<0)break;const pp=pos[k];run('cages',s,.05,(s,inp)=>{inp.taps=[{x:pp[0],y:pp[1]-15}]});run('cages',s,.5);yours.push([s.mask===63,s.youOpen!=null]);if(s.mask!==63&&s.youOpen!=null)last=false}
            out.yours=last&&yours.length>0&&yours[yours.length-1][1];
            s=S('cages');g.toStage(s,2);run('cages',s,3,(s,inp)=>{inp.a=true});out.one={pull:s.pull,oneT:+s.oneT.toFixed(2)};const oneOk=s.pull===0&&s.oneT>2.5;
            run('cages',s,1,(s,inp)=>{inp.a=true;inp.b=true});const both=s.pull>0;s=S('cages');g.toStage(s,2);run('cages',s,1,(s,inp)=>{inp.fingers=2});out.both=oneOk&&both&&s.pull>0;
            s=S('cages');g.toStage(s,2);run('cages',s,.7,(s,inp)=>{inp.a=true;inp.b=true});const early=s.pull,ne=s.pullers;s=S('cages');g.toStage(s,2);run('cages',s,5);const p5=s.pull;run('cages',s,.7,(s,inp)=>{inp.a=true;inp.b=true});
            out.faster={early:+early.toFixed(3),late:+(s.pull-p5).toFixed(3),pullersEarly:ne,pullersLate:s.pullers};out.fasterOk=s.pull-p5>early*1.5&&s.pullers>ne}
          return out})()""")
        self.add("p31", "idols_true_never_break", r["trueStands"] and r["hollowBreaks"], f"striking a true idol: it stands and counts one wrong strike={r['trueStands']}; a sounded hollow idol breaks on the second tap={r['hollowBreaks']}")
        self.add("p31", "idols_wave_shapes_differ", r["wavesDiffer"], f"true vs hollow sounding: {r['waves']} (long, smooth and golden vs short, jagged and grey)")
        self.add("p31", "idols_swap_in_II", r["swap"] and r["gilded"], f"after a sounding in Stage II, two idols trade places in the fog={r['swap']}; four gilded, three hollow, the plain clay idol rings true={r['gilded']}")
        self.add("p31", "idols_self_in_III", r["self"], f"30 Stage III setups: the Wanderer-shaped giant always has a hollow and a true section, and every giant has something hollow={r['self']}")
        self.add("p31", "goal_tells_unreliable", .25 <= r["tellRate"] <= .42, f"over 300 shots the tell matched the kick {r['tellRate']*100:.0f}% of the time (want 25-42%)")
        self.add("p31", "goal_saves_ignored", r["r16"] == 3 and r["r14"] == 2 and r["r13"] == 1, f"16 commitments, 0 saves -> {r['r16']} lanterns (want 3); 14 -> {r['r14']} (want 2); 13 with 16 saves -> {r['r13']} (want 1)")
        self.add("p31", "goal_late_dive_not_commit", r["lateOk"] and r["again"], f"a dive after the kick: {r['late']} (dives, but isn't a commitment)={r['lateOk']}; committing on none of a stage's shots repeats it (the only try over)={r['again']}")
        self.add("p31", "having_moments_uncatchable", r["uncatch"] and r["still"], f"a moment inside the basket isn't caught, a coin is={r['uncatch']}; standing still under a moment for a second is being with it={r['still']}")
        self.add("p31", "having_weight_slows_and_dims", r["slow"], f"speed {r['sp'][0]:.0f} -> {r['sp'][1]:.0f} units/s with 3 weight, and the lantern's reach shrinks={r['slow']}")
        self.add("p31", "having_giving_frees_firefly", r["give"], f"B gives the heaviest thing away; it arcs to the gate, the person lights up, and a firefly drifts back toward you={r['give']}")
        self.add("p31", "having_frame_makes_trophy", r["frame"], f"catching the golden frame traps the nearest moment as a grey trophy of weight 2={r['frame']}")
        self.add("p31", "cages_turn_toggles_linked", r["ring"] and r["web"], f"Stage I: a key toggles its cage and both neighbors={r['ring']}; Stage II: its cage and every cage chained to it={r['web']}")
        self.add("p31", "cages_always_solvable", r["solv"], f"60 fresh Stage I and Stage II puzzles all start unsolved and solvable (scrambled from all-open)={r['solv']}")
        self.add("p31", "cages_yours_last", r["yours"], f"your cage stays shut until all six are open, then opens={r['yours']}")
        self.add("p31", "cages_gate_needs_both", r["both"], f"only A for 3 s: {r['one']} (no progress; one-handed time counted); A+B, or two fingers, pulls={r['both']}")
        self.add("p31", "cages_more_people_pull_faster", r["fasterOk"], f"pull in 0.7 s: {r['faster']} (more people at the gate, faster pull)")
        await ctx.close()

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
            phases = {"p0": self.p0, "p1": self.p1, "p2": self.p2, "p3": self.p3, "p4": self.p4, "p5": self.p5, "p6": self.p6, "p7": self.p7, "p9": self.p9, "p11": self.p11, "p13": self.p13, "p15": self.p15, "p16": self.p16, "p18": self.p18, "p19": self.p19, "p20": self.p20, "p21": self.p21, "p22": self.p22, "p23": self.p23, "p24": self.p24, "p25": self.p25, "p26": self.p26, "p28": self.p28, "addendum": self.addendum, "p29": self.p29, "p30": self.p30, "p31": self.p31}
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
