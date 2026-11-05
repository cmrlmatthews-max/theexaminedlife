/* PAINT part 50: input helpers (drag, hold, lanes, path, flow, pick, finger), tweens, auto-play helpers, motion.
   Ported from mini/fx.js (mDrag, mHold, mLanes, mPath, mFlow, mPick, mFinger). Old space 192x320 -> new 360x780.
   Scale rules: x-bound values x1.875, y-bound values x2.4375, values that are not axis-bound (tolerances, speeds, sizes) x2.
   Logic works with no view; every helper has view(parent[,opts]) -> {c, update(), destroy()} for a default painted look. */
(function(){
const P=window.PAINT;const clamp=P.clamp;
const GOLD=0xF5C66A,LEAD=0x100B15,CREAM=0xFFE9B8,ICE=0x9FE0FF;
const W=P.W,H=P.H;
const hs=o=>o||{};

/* where a finger is now (a held pointer, else this frame's tap) -> {x,y} or null (units) */
P.finger=inp=>inp.down?{x:inp.down.x,y:inp.down.y}:(inp.tap?{x:inp.tap.x,y:inp.tap.y}:null);

/* small view helper: root container + handle */
const mkView=(parent,upd,extra)=>{const c=new PIXI.Container();if(parent)parent.addChild(c);
  const h=Object.assign({c,update:upd||(()=>{}),destroy(){if(c.parent)c.parent.removeChild(c);c.destroy({children:true})}},extra||{});return h};

/* ---------- drag ----------
   PAINT.drag({pieces:[{x,y,w,h,fixed?}],spots:[{x,y,r}],speed,snap,back,onDrop}) -> D
   speed default 70 -> 140 units/s (cursor, non-axis: x2). cursor start (96,200) -> (180,487). pick margin 4 -> 8 (touch), 8 -> 16 (cursor).
   Hit areas are at least 44 x 44 units (tap target minimum). D.step(dt,inp) -> drop event {piece,spot} or null. */
P.drag=function(o){o=hs(o);
  const D={pieces:o.pieces||[],spots:o.spots||[],held:null,over:null,cur:{x:180,y:487},touch:false,speed:o.speed||140};
  D.pieces.forEach(p=>{if(p.x0==null){p.x0=p.x;p.y0=p.y}});
  const inside=(p,x,y,m)=>Math.abs(x-p.x)<=Math.max(22,p.w/2)+(m||0)&&Math.abs(y-p.y)<=Math.max(22,p.h/2)+(m||0);
  const pieceAt=(x,y,m)=>{let best=null,bd=1e9;for(const p of D.pieces){if(p.fixed)continue;if(inside(p,x,y,m)){const d=Math.hypot(p.x-x,p.y-y);if(d<bd){bd=d;best=p}}}return best};
  const spotAt=(x,y)=>{let best=null,bd=1e9;for(const s of D.spots){const d=Math.hypot(s.x-x,s.y-y);if(d<=s.r&&d<bd){bd=d;best=s}}return best};
  const drop=()=>{const p=D.held,sp=spotAt(p.x,p.y);D.held=null;D.over=null;
    if(sp&&o.snap!==false){p.x=sp.x;p.y=sp.y}else if(!sp&&o.back!==false){p.x=p.x0;p.y=p.y0}
    if(o.onDrop)o.onDrop(p,sp||null);return {piece:p,spot:sp||null}};
  D.step=(dt,inp)=>{let ev=null;const f=inp.down;
    if(inp.dx||inp.dy){D.cur.x=clamp(D.cur.x+inp.dx*D.speed*dt,0,W);D.cur.y=clamp(D.cur.y+inp.dy*D.speed*dt,0,H);if(D.held&&!D.touch){D.held.x=D.cur.x;D.held.y=D.cur.y}}
    if(f){if(!D.held&&!D._was){const p=pieceAt(f.x,f.y,8);if(p){D.held=p;D.touch=true;D.offx=p.x-f.x;D.offy=p.y-f.y}} /* only a touch that starts on a piece picks it up */
      if(D.held&&D.touch){D.held.x=clamp(f.x+D.offx,0,W);D.held.y=clamp(f.y+D.offy,0,H);D.cur.x=D.held.x;D.cur.y=D.held.y}}
    else if(D.held&&D.touch){D.touch=false;ev=drop()}
    D._was=!!f;
    if(inp.aTap&&!D.touch){if(D.held)ev=drop();else{const p=pieceAt(D.cur.x,D.cur.y,16);if(p){D.held=p;D.touch=false;p.x=D.cur.x;p.y=D.cur.y}}}
    D.over=D.held?spotAt(D.held.x,D.held.y):null;return ev};
  /* view(parent) -> {c,update}: spot rings, piece plates, key-cursor crosshair (hidden while a finger drags) */
  D.view=parent=>{const sp=new PIXI.Graphics(),pg=new PIXI.Graphics(),cu=new PIXI.Graphics();
    const h=mkView(parent,()=>{sp.clear();for(const s of D.spots){const on=D.over===s;sp.circle(s.x,s.y,s.r).fill({color:on?GOLD:LEAD,alpha:on?.3:.25}).stroke({width:3,color:GOLD,alpha:on?1:.55})}
      pg.clear();for(const p of D.pieces){const hl=D.held===p;pg.roundRect(p.x-p.w/2,p.y-p.h/2,p.w,p.h,8).fill({color:hl?GOLD:0x2A2036,alpha:.92}).stroke({width:3,color:hl?CREAM:GOLD,alpha:1})}
      cu.visible=!D.touch;if(cu.visible){const x=D.cur.x,y=D.cur.y;cu.clear();for(const [w,col] of [[5,LEAD],[2.5,GOLD]])cu.moveTo(x-18,y).lineTo(x-6,y).moveTo(x+6,y).lineTo(x+18,y).moveTo(x,y-18).lineTo(x,y-6).moveTo(x,y+6).lineTo(x,y+18).stroke({width:w,color:col,cap:"round"})}});
    h.c.addChild(sp,pg,cu);h.update();return h};
  return D};

/* ---------- hold ----------
   PAINT.hold({dur,drain,onFull,onRelease}) -> H; dur default 1 s (unchanged). H.step(dt,inp,active) -> "full" | "release" | null.
   view(parent,{x:180,y:600,r:40,col}) -> ring drawn as an arc that fills with H.k */
P.hold=function(o){o=hs(o);const H_={k:0,held:false,full:false,dur:o.dur||1};
  H_.step=(dt,inp,active)=>{const on=active==null?!!(inp.a||inp.down):!!active;let ev=null;
    if(on){H_.held=true;if(!H_.full){H_.k=Math.min(1,H_.k+dt/H_.dur);if(H_.k>=1){H_.full=true;ev="full";if(o.onFull)o.onFull()}}}
    else{if(H_.held){H_.held=false;ev="release";if(o.onRelease)o.onRelease(H_.k);H_.full=false;if(!o.drain)H_.k=0}
      if(o.drain&&H_.k>0)H_.k=Math.max(0,H_.k-dt*o.drain)}
    return ev};
  H_.view=(parent,v)=>{v=hs(v);const x=v.x==null?180:v.x,y=v.y==null?600:v.y,r=v.r||40,col=v.col!=null?P.hex(v.col):GOLD;const g=new PIXI.Graphics();let last=-1;
    const h=mkView(parent,()=>{if(H_.k===last)return;last=H_.k;g.clear();g.circle(x,y,r).stroke({width:7,color:LEAD,alpha:.45});
      if(H_.k>0){const a0=-Math.PI/2,a1=a0+Math.PI*2*Math.min(.9999,H_.k);g.moveTo(x+Math.cos(a0)*r,y+Math.sin(a0)*r).arc(x,y,r,a0,a1).stroke({width:9,color:LEAD,cap:"round"});
        g.moveTo(x+Math.cos(a0)*r,y+Math.sin(a0)*r).arc(x,y,r,a0,a1).stroke({width:5,color:col,cap:"round"})}});
    h.c.addChild(g);last=-1;h.update();return h};
  return H_};

/* ---------- lanes ----------
   PAINT.lanes({xs,hitY,speed,win,keys}) -> L. xs default [56,96,136] -> [105,180,255] (x1.875); hitY 250 -> 609 (x2.4375);
   speed 80 -> 195 units/s (vertical, x2.4375); win .18 s unchanged (time). L.add(lane,t,kind); L.step(dt,inp) -> {hits,misses,wrong}.
   Taps pick the nearest lane by x. view(parent,fn?) draws lane lines, hit-line and notes (fn(g,note,x,y) overrides a note). */
P.lanes=function(o){o=hs(o);const L={xs:o.xs||[105,180,255],hitY:o.hitY||609,speed:o.speed||195,win:o.win||.18,notes:[],t:0};
  const n=L.xs.length,keys=o.keys||(n===2?["l","r"]:n===3?["l","u","r"]:["l","u","r","d"].slice(0,n));
  L.add=(lane,t,kind)=>{const no={lane,t,kind:kind||0,hit:false,miss:false};L.notes.push(no);return no};
  L.yOf=no=>L.hitY-(no.t-L.t)*L.speed;
  const near=lane=>{let best=null,be=1e9;for(const no of L.notes){if(no.hit||no.miss||(lane!=null&&no.lane!==lane))continue;const e=Math.abs(no.t-L.t);if(e<=L.win&&e<be){be=e;best=no}}return best};
  L.step=(dt,inp)=>{L.t+=dt;const out={hits:[],misses:[],wrong:[]};const press=[];
    const k={l:inp.lTap,r:inp.rTap,u:inp.uTap,d:inp.dTap};keys.forEach((q,i)=>{if(k[q])press.push(i)});
    for(const tp of inp.taps||[]){let bi=0,bd=1e9;L.xs.forEach((x,i)=>{const d=Math.abs(tp.x-x);if(d<bd){bd=d;bi=i}});press.push(bi)}
    if(inp.aTap){const no=near(null);if(no)press.push(no.lane);else out.wrong.push(-1)}
    for(const ln of press){const no=near(ln);if(no){no.hit=true;out.hits.push({note:no,lane:ln,err:no.t-L.t})}else out.wrong.push(ln)}
    for(const no of L.notes)if(!no.hit&&!no.miss&&L.t-no.t>L.win){no.miss=true;out.misses.push(no)}
    L.notes=L.notes.filter(no=>!(no.hit||no.miss)||L.t-no.t<1);return out};
  L.view=(parent,fn)=>{const bg=new PIXI.Graphics(),g=new PIXI.Graphics();
    bg.moveTo(0,0);for(const x of L.xs)bg.moveTo(x,0).lineTo(x,H);bg.stroke({width:2,color:CREAM,alpha:.18});
    bg.moveTo(L.xs[0]-34,L.hitY).lineTo(L.xs[n-1]+34,L.hitY).stroke({width:7,color:LEAD,alpha:.6});bg.moveTo(L.xs[0]-34,L.hitY).lineTo(L.xs[n-1]+34,L.hitY).stroke({width:3,color:GOLD,alpha:.85});
    const h=mkView(parent,()=>{g.clear();for(const no of L.notes){if(no.hit||no.miss)continue;const y=L.yOf(no);if(y<-24||y>H+24)continue;const x=L.xs[no.lane];if(fn){fn(g,no,x,y);continue}
      if(no.kind)g.poly([x,y-12,x+12,y,x,y+12,x-12,y]).fill(ICE).stroke({width:2.5,color:LEAD});else g.circle(x,y,10).fill(GOLD).stroke({width:2.5,color:LEAD})}});
    h.c.addChild(bg,g);return h};
  return L};

/* ---------- path ----------
   PAINT.path({pts:[[x,y]...],tol,speed}) -> Pa. pts default [[20,160],[172,160]] -> [[38,390],[322,390]]; tol 10 -> 20 and speed 60 -> 120 (x2, non-axis);
   look-behind/ahead window along the path 6/24 -> 12/48. Pa.step(dt,inp) -> {u,off,pace,done}; Pa.at(d) -> {x,y,tx,ty}. */
P.path=function(o){o=hs(o);const Pa={pts:o.pts||[[38,390],[322,390]],tol:o.tol||20,speed:o.speed||120,d:0,off:false,pen:null,seg:[]};let tot=0;
  for(let i=1;i<Pa.pts.length;i++){const a=Pa.pts[i-1],b=Pa.pts[i],l=Math.hypot(b[0]-a[0],b[1]-a[1]);Pa.seg.push({a,b,l,d0:tot});tot+=l}Pa.len=tot||1;
  Pa.at=d=>{d=clamp(d,0,Pa.len);for(const s of Pa.seg)if(d<=s.d0+s.l||s===Pa.seg[Pa.seg.length-1]){const k=s.l?(d-s.d0)/s.l:0;return {x:s.a[0]+(s.b[0]-s.a[0])*k,y:s.a[1]+(s.b[1]-s.a[1])*k,tx:(s.b[0]-s.a[0])/(s.l||1),ty:(s.b[1]-s.a[1])/(s.l||1)}}return {x:Pa.pts[0][0],y:Pa.pts[0][1],tx:1,ty:0}};
  Pa.pen={x:Pa.pts[0][0],y:Pa.pts[0][1]};
  const proj=(x,y,lo,hi)=>{let best=null;for(const s of Pa.seg){if(s.d0>hi||s.d0+s.l<lo)continue;const vx=s.b[0]-s.a[0],vy=s.b[1]-s.a[1],L2=vx*vx+vy*vy||1;let k=((x-s.a[0])*vx+(y-s.a[1])*vy)/L2;k=clamp(k,0,1);let d=s.d0+k*s.l;d=clamp(d,lo,hi);const q=Pa.at(d),e=Math.hypot(q.x-x,q.y-y);if(!best||e<best.e)best={d,e}}return best};
  Pa.step=(dt,inp)=>{const d0=Pa.d,f=inp.down;
    if(f){Pa.pen={x:f.x,y:f.y};const pr=proj(f.x,f.y,Math.max(0,Pa.d-12),Math.min(Pa.len,Pa.d+48));Pa.off=!pr||pr.e>Pa.tol;if(!Pa.off&&pr.d>Pa.d)Pa.d=pr.d}
    else if(inp.dx||inp.dy||inp.a){const q=Pa.at(Pa.d),dot=inp.a&&!(inp.dx||inp.dy)?1:(inp.dx*q.tx+inp.dy*q.ty)/(Math.hypot(inp.dx,inp.dy)||1);if(dot>.2){Pa.d=Math.min(Pa.len,Pa.d+Pa.speed*dot*dt)}Pa.off=false;const q2=Pa.at(Pa.d);Pa.pen={x:q2.x,y:q2.y}}
    const pace=dt>0?(Pa.d-d0)/dt:0;return {u:Pa.d/Pa.len,off:Pa.off,pace,done:Pa.d>=Pa.len-.01}};
  /* view(parent) -> {c,update}: dotted guide, gold progress line, pen dot (red-tinted ring when off the path) */
  Pa.view=parent=>{const gd=new PIXI.Graphics(),pr=new PIXI.Graphics();
    for(let d=0;d<Pa.len;d+=14){const a=Pa.at(d),b=Pa.at(Math.min(Pa.len,d+7));gd.moveTo(a.x,a.y).lineTo(b.x,b.y)}gd.stroke({width:4,color:CREAM,alpha:.45,cap:"round"});
    let last=-1,lo=null;
    const h=mkView(parent,()=>{if(last!==Pa.d||lo!==Pa.off||true){last=Pa.d;lo=Pa.off;pr.clear();
      if(Pa.d>0){const p0=Pa.at(0);pr.moveTo(p0.x,p0.y);for(let d=0;d<Pa.d;d+=8){const q=Pa.at(d);pr.lineTo(q.x,q.y)}const q=Pa.at(Pa.d);pr.lineTo(q.x,q.y);pr.stroke({width:12,color:LEAD,cap:"round",join:"round"});
        pr.moveTo(p0.x,p0.y);for(let d=0;d<Pa.d;d+=8){const q2=Pa.at(d);pr.lineTo(q2.x,q2.y)}pr.lineTo(q.x,q.y);pr.stroke({width:6,color:GOLD,cap:"round",join:"round"})}
      pr.circle(Pa.pen.x,Pa.pen.y,11).fill(Pa.off?0xB23A48:GOLD).stroke({width:3,color:LEAD})}});
    h.c.addChild(gd,pr);h.update();return h};
  return Pa};

/* ---------- flow ----------
   PAINT.flow({speed,path,dir,bounds,onExit}) -> F. speed 30 -> 60 units/s (x2, non-axis: it follows paths or any dir);
   bounds [-40,-40,272,400] -> [-75,-98,510,975] ([x,y,w,h]; x x1.875, y x2.4375). path is in 360x780 units already (not rescaled).
   F.spawn(ob) (ob gets d,x,y; ob.sp speed multiplier, ob.stop); F.step(dt); F.each(fn); F.remove(ob).
   view(parent,fn?) draws each item as a gold dot (fn(g,ob) overrides). */
P.flow=function(o){o=hs(o);const F={list:[],speed:o.speed||60};let pl=null;
  if(o.path)pl=P.path({pts:o.path});
  const B=o.bounds||[-75,-98,510,975];
  F.spawn=ob=>{ob.d=ob.d||0;if(pl){const q=pl.at(ob.d);ob.x=q.x;ob.y=q.y}F.list.push(ob);return ob};
  F.remove=ob=>{const i=F.list.indexOf(ob);if(i>=0)F.list.splice(i,1)};
  F.step=dt=>{for(let i=F.list.length-1;i>=0;i--){const ob=F.list[i];if(ob.stop)continue;const v=F.speed*(ob.sp==null?1:ob.sp)*dt;ob.d+=v;let gone=false;
      if(pl){if(ob.d>=pl.len)gone=true;else{const q=pl.at(ob.d);ob.x=q.x;ob.y=q.y}}
      else{const dir=o.dir||[0,1],l=Math.hypot(dir[0],dir[1])||1;ob.x+=dir[0]/l*v;ob.y+=dir[1]/l*v;if(ob.x<B[0]||ob.y<B[1]||ob.x>B[0]+B[2]||ob.y>B[1]+B[3])gone=true}
      if(gone){F.list.splice(i,1);if(o.onExit)o.onExit(ob)}}};
  F.each=fn=>{F.list.slice().forEach(fn)};F.len=pl?pl.len:0;
  F.view=(parent,fn)=>{const g=new PIXI.Graphics();
    const h=mkView(parent,()=>{g.clear();for(const ob of F.list){if(fn){fn(g,ob);continue}g.circle(ob.x,ob.y,ob.r||14).fill(GOLD).stroke({width:3,color:LEAD})}});
    h.c.addChild(g);if(pl){const gd=new PIXI.Graphics();for(let d=0;d<pl.len;d+=14){const a=pl.at(d),b=pl.at(Math.min(pl.len,d+7));gd.moveTo(a.x,a.y).lineTo(b.x,b.y)}gd.stroke({width:3,color:CREAM,alpha:.3});h.c.addChildAt(gd,0)}
    return h};
  return F};

/* ---------- pick ----------
   PAINT.pick({items:[{x,y,w,h,off?}],sel}) -> K. K.step(dt,inp) -> index chosen this frame or -1. l/u move back, r/d move forward (wraps).
   Tap hit area is at least 44 x 44 units (old minimum half-extent 11 -> 22). Items are top-left x,y plus w,h (as before).
   view(parent,fn?) draws a plate per item, selected one in gold (fn(g,item,i,sel) overrides). */
P.pick=function(o){o=hs(o);const K={items:o.items||[],sel:o.sel||0};
  K.step=(dt,inp)=>{const n=K.items.length;if(!n)return -1;if(inp.lTap||inp.uTap)K.sel=(K.sel+n-1)%n;if(inp.rTap||inp.dTap)K.sel=(K.sel+1)%n;
    for(const tp of inp.taps||[]){const i=K.items.findIndex(it=>!it.off&&Math.abs(tp.x-it.x-it.w/2)<=Math.max(22,it.w/2)&&Math.abs(tp.y-it.y-it.h/2)<=Math.max(22,it.h/2));if(i>=0){K.sel=i;return i}}
    if(inp.aTap&&!(K.items[K.sel]||{}).off)return K.sel;return -1};
  K.view=(parent,fn)=>{const g=new PIXI.Graphics();
    const h=mkView(parent,()=>{g.clear();K.items.forEach((it,i)=>{const s=i===K.sel;if(fn){fn(g,it,i,s);return}
      g.roundRect(it.x,it.y,it.w,it.h,8).fill({color:s?GOLD:LEAD,alpha:s?.35:.55}).stroke({width:s?4:2,color:s?GOLD:CREAM,alpha:s?1:.35})})});
    h.c.addChild(g);h.update();return h};
  return K};

/* ---------- tweens ----------
   PAINT.tween(obj,props,dur,{ease,delay,onDone}) -> handle {stop(),finish(),done}. props: {x:200,alpha:0,"scale.x":2,scale:1.5,rotation:1}.
   dur in seconds. ease: function or a key of PAINT.ease (default "inOut"; "linear" ok). Records and their arrays are pooled.
   Reduce Motion: every prop except alpha jumps to its end value at once (delay ignored) unless {keepRM:true}; alpha tweens keep running. */
const TW=[],POOL=[];let ticking=false;
const resolve=(obj,key)=>{const i=key.indexOf(".");if(i<0)return [obj,key];const a=key.slice(0,i);return [obj[a],key.slice(i+1)]};
const isAlpha=k=>k==="alpha";
const tick=dt=>{
  for(let i=TW.length-1;i>=0;i--){const r=TW[i];
    if(r.dead){TW.splice(i,1);rel(r);continue}
    const rm=P.rm&&!r.keepRM;
    if(rm&&r.n>0){ /* move jump props to end now */
      for(let j=0;j<r.n;j++)if(!r.isA[j]&&!r.jumped[j]){r.tg[j][r.fl[j]]=r.to[j];r.jumped[j]=1}}
    if(r.delay>0){r.delay-=dt;if(!(rm&&!r.hasAlpha)){continue}}
    if(rm&&!r.hasAlpha)r.t=r.dur; else r.t+=dt;
    const k=r.dur>0?Math.min(1,r.t/r.dur):1,e=r.ease(k);
    for(let j=0;j<r.n;j++){if(r.jumped[j])continue;r.tg[j][r.fl[j]]=r.from[j]+(r.to[j]-r.from[j])*e}
    if(k>=1){TW.splice(i,1);const cb=r.onDone;r.done=true;rel(r);if(cb)cb()}}};
tick.dispose=()=>{TW.length=0;ticking=false};
function rel(r){r.obj=null;r.onDone=null;r.n=0;for(let j=0;j<r.tg.length;j++)r.tg[j]=null;POOL.push(r)}
const lin=k=>k;
P.tween=function(obj,props,dur,opt){opt=opt||{};
  if(!ticking||P.ticks.indexOf(tick)<0){P.on(tick);ticking=true}
  const r=POOL.pop()||{tg:[],fl:[],from:[],to:[],isA:[],jumped:[]};
  r.obj=obj;r.n=0;r.dead=false;r.done=false;r.t=0;r.dur=Math.max(0,dur||0);r.delay=opt.delay||0;r.keepRM=!!opt.keepRM;r.onDone=opt.onDone||null;r.hasAlpha=false;
  r.ease=typeof opt.ease==="function"?opt.ease:(opt.ease==="linear"?lin:(P.ease[opt.ease||"inOut"]||P.ease.inOut));
  const add=(key,v)=>{const [tg,f]=resolve(obj,key);if(!tg)return;const j=r.n++;r.tg[j]=tg;r.fl[j]=f;r.from[j]=tg[f];r.to[j]=v;r.isA[j]=isAlpha(key);r.jumped[j]=0;if(r.isA[j])r.hasAlpha=true};
  for(const key in props){const v=props[key];
    if(key==="scale"&&obj.scale&&typeof obj.scale==="object"){add("scale.x",v);add("scale.y",v)}else add(key,v)}
  TW.push(r);
  const h={get done(){return r.obj===null||r.done},stop(){if(r.obj&&!r.done)r.dead=true},
    finish(){if(!r.obj||r.done)return;for(let j=0;j<r.n;j++)r.tg[j][r.fl[j]]=r.to[j];r.dead=true;const cb=r.onDone;r.onDone=null;r.done=true;if(cb)cb()}};
  /* the handle keeps a ref to its record: guard against pooled reuse with a stamp */
  const stamp=r.stamp=(r.stamp||0)+1;
  const ok=()=>r.stamp===stamp;
  return {get done(){return !ok()||r.done||r.dead},stop(){if(ok())h.stop()},finish(){if(ok())h.finish()}}};
/* PAINT.tweens: manager. count() live tweens, kill(obj) stops those on obj, clear() stops all (end() also clears them). */
P.tweens={count:()=>TW.length,kill(obj){for(const r of TW)if(r.obj===obj)r.dead=true},clear(){for(const r of TW)r.dead=true},tick};

/* ---------- auto helpers (test bot writes into inp) ----------
   PAINT.autoTap(inp,x,y) -> inp: this frame a tap at (x,y) (sets tap, taps, ups; down = null).
   PAINT.autoDrag(inp,from,to,k) -> inp: k<1 finger down at lerp(from,to,k) with drag{x,y,dx,dy}; k===1 down exactly at `to`; k>1 finger released at `to`.
   from/to are {x,y} or [x,y]. */
const xy=p=>Array.isArray(p)?{x:p[0],y:p[1]}:p;
P.autoTap=function(inp,x,y){inp.tap={x,y};inp.taps=[{x,y}];inp.down=null;inp.drag=null;inp.ups=[{x,y,t:P.t}];inp.fingers=0;return inp};
P.autoDrag=function(inp,from,to,k){const a=xy(from),b=xy(to);k=k==null?0:k;
  if(k>1){inp.down=null;inp.drag=null;inp.fingers=0;inp.ups=[{x:b.x,y:b.y,t:P.t}];return inp}
  const kk=clamp(k,0,1),x=a.x+(b.x-a.x)*kk,y=a.y+(b.y-a.y)*kk;
  inp.down={x,y};inp.drag={x,y,dx:x-a.x,dy:y-a.y};inp.fingers=1;return inp};

/* ---------- motion ----------
   PAINT.motion.rm() -> bool (Reduce Motion on); PAINT.motion.k(normalVal, rmVal) -> rmVal when Reduce Motion is on, else normalVal. */
P.motion={rm:()=>P.rm,k:(n,r)=>P.rm?r:n};
})();
