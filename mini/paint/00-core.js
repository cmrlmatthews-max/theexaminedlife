/* PAINT — the painted-2D toolkit (Plan 6, Phase 47). Part 00: core.
   Design space: 360 × 780 units (iPhone vertical, 9 : 19.5). Safe area: keep play out of the top 44 and the bottom 34 units.
   One shared PIXI.Application, made on first use. The page drives it: PAINT.frame(dt) each frame, then PAINT.render().
   All parts attach to window.PAINT. A part never replaces a name that another part owns (see CONTRACT.md). */
(function(){
const P=window.PAINT=window.PAINT||{};
P.VERSION="p47";P.W=360;P.H=780;P.SAFE={top:44,bottom:34};
P.app=null;P.rm=false;P.t=0;P.ticks=[];P.tx={};P.art={};P.gen={};P.stats={draws:0,ms:0};
const clamp=(v,a,b)=>v<a?a:v>b?b:v;P.clamp=clamp;P.lerp=(a,b,k)=>a+(b-a)*k;
P.ease={inOut:k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2,out:k=>1-Math.pow(1-k,3),in:k=>k*k*k,back:k=>{const c=1.70158;return 1+(c+1)*Math.pow(k-1,3)+c*Math.pow(k-1,2)}};
/* seeded random: const r=PAINT.rng(7); r() -> 0..1 */
P.rng=seed=>{let a=(seed>>>0)||1;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
P.hex=c=>typeof c==="number"?c:parseInt(String(c).replace("#",""),16);

/* ---- the application ---- */
P.init=async function(host){
  if(P.app)return P.app;
  const app=new PIXI.Application();
  await app.init({width:P.W,height:P.H,preference:"webgl",antialias:true,autoDensity:true,resolution:Math.min(2,window.devicePixelRatio||1),background:0x0E0B1A,autoStart:false,powerPreference:"high-performance"});
  app.ticker.stop();app.canvas.id="mpx";app.canvas.setAttribute("aria-hidden","true");
  if(host)host.appendChild(app.canvas);
  P.app=app;P.root=app.stage;P.ready=true;return app};

/* ---- one game session: begin -> (load) -> frames -> end ---- */
/* Layer order (bottom to top): world (moved by the camera: scene layers, actors, world effects), fx (camera too, additive light),
   over (camera too: foreground and weather), ui (no camera: banners, glass, prompts). post: filters on P.view (grade, vignette). */
P.begin=function(art){P.end();P.art=Object.assign({},art||{});return P.fresh()};
/* PAINT.fresh(): new empty display layers and camera, same loaded art (used for "Try again" and a stage restart) */
P.fresh=function(){P.clearView();const C=PIXI.Container;
  P.view=new C();P.world=new C();P.fx=new C();P.over=new C();P.ui=new C();
  P.world.sortableChildren=true;P.over.sortableChildren=true;P.ui.sortableChildren=true;P.view.addChild(P.world,P.fx,P.over);P.root.addChild(P.view,P.ui);
  P.cam={x:P.W/2,y:P.H/2,zoom:1,rot:0,shake:0,tx:P.W/2,ty:P.H/2,tz:1,k:4}; /* Part 10 owns the camera logic; the core only applies it */
  P.t=0;return P};
P.clearView=function(){for(const f of P.ticks)if(f&&f.dispose)try{f.dispose()}catch(e){}
  P.ticks=[];if(P.view){P.view.destroy({children:true});P.view=null}if(P.ui){P.ui.destroy({children:true});P.ui=null}
  if(P.root)P.root.filters=null;P.world=P.fx=P.over=null};
/* PAINT.end(): clear the display and unload this game's art */
P.end=function(){P.clearView();const ids=Object.keys(P.tx).map(k=>P.art[k]).filter(Boolean);P.tx={};
  for(const id of ids)try{PIXI.Assets.unload(P.url(id))}catch(e){}
  P.art={}};
/* per-frame work: PAINT.on(fn) -> fn(dt,t) every frame until PAINT.end(); returns fn (call PAINT.off(fn) to stop early) */
P.on=fn=>{P.ticks.push(fn);return fn};P.off=fn=>{const i=P.ticks.indexOf(fn);if(i>=0)P.ticks.splice(i,1)};
P.frame=function(dt){const t0=performance.now();P.t+=dt;P.rm=!!(window.RM&&RM.matches);
  for(const f of P.ticks.slice())try{f(dt,P.t)}catch(e){console.error(e)}
  P.applyCam&&P.applyCam();P.stats.ms=performance.now()-t0};
P.render=function(){if(P.app&&P.view)P.app.render()};

/* ---- art ---- */
/* art map: {key: assetId}. PAINT.url(id) -> "a/<id>.<ext>". PAINT.load() loads every key; a missing file leaves null (the game draws its code fallback). */
/* an art value is an asset id ("a/<id>.<ext>" through the page's BLOB) or "<id>.<ext>" for Plan 6 art, which needs no BLOB_EXT entry */
P.url=id=>/\./.test(id)?"a/"+id:(typeof BLOB==="function"?BLOB(id):"a/"+id+".png");
P.load=async function(keys){keys=keys||Object.keys(P.art);
  await Promise.all(keys.map(async k=>{const id=P.art[k];if(!id){P.tx[k]=null;return}
    try{P.tx[k]=await PIXI.Assets.load({src:P.url(id),parser:"loadTextures"})}catch(e){P.tx[k]=null}}));
  return P.tx};
P.tex=k=>P.tx[k]||null;
/* atlas frames: PAINT.frameTex(key,[x,y,w,h]) -> Texture from part of a loaded sheet, or null */
P.frameTex=(k,r)=>{const T=P.tex(k);if(!T||!r)return null;return new PIXI.Texture({source:T.source,frame:new PIXI.Rectangle(r[0],r[1],r[2],r[3])})};

/* ---- generated textures (drawn once with Canvas 2D, cached until the page closes) ----
   PAINT.make(key,w,h,draw) -> Texture; draw(ctx2d,w,h). Use for radial lights, brush masks, soft shadows, paper grain. */
P.make=function(key,w,h,draw){if(P.gen[key])return P.gen[key];const c=document.createElement("canvas");c.width=w;c.height=h;draw(c.getContext("2d"),w,h);
  const T=PIXI.Texture.from(c);P.gen[key]=T;return T};
P.radial=(key,size,stops)=>P.make(key||"radial",size||128,size||128,(c,w)=>{const g=c.createRadialGradient(w/2,w/2,0,w/2,w/2,w/2);
  (stops||[[0,"rgba(255,255,255,1)"],[.35,"rgba(255,255,255,.55)"],[1,"rgba(255,255,255,0)"]]).forEach(s=>g.addColorStop(s[0],s[1]));c.fillStyle=g;c.fillRect(0,0,w,w)});

/* ---- input helpers shared by all parts ---- */
/* units from a client point (the page maps pointers with this for paint games) */
P.toUnits=(cx,cy)=>{const cv=P.app&&P.app.canvas;if(!cv)return{x:0,y:0};const r=cv.getBoundingClientRect();return{x:(cx-r.left)/r.width*P.W,y:(cy-r.top)/r.height*P.H}};
P.sprite=(tex,o)=>{const s=new PIXI.Sprite(tex||PIXI.Texture.WHITE);o=o||{};s.anchor.set(o.ax!=null?o.ax:.5,o.ay!=null?o.ay:.5);if(o.x!=null)s.x=o.x;if(o.y!=null)s.y=o.y;if(o.w)s.width=o.w;if(o.h)s.height=o.h;if(o.tint!=null)s.tint=P.hex(o.tint);if(o.alpha!=null)s.alpha=o.alpha;if(o.blend)s.blendMode=o.blend;if(o.z!=null)s.zIndex=o.z;if(o.parent)o.parent.addChild(s);return s};

/* ---- a painted game registers itself: PAINT.game(def) -> the MINI entry (def needs id; see the pilot pattern in the style guide) ----
   def: {id, who, land, title, setup[], how, goal, ctl, stages[3], lines[], win, walk, art:{key:assetId},
         init(s), build(s), step(s,dt,inp)->"win"|"end"|undefined, view(s,t), bloom(s,k,t), rate(s)->1..3, auto(s,inp), toStage(s,n), release()} */
P.game=function(def){const M=typeof MINI!=="undefined"?MINI:(window.MINI=window.MINI||{}); /* the page declares MINI with const, so it is not on window */const g=M[def.id]&&M[def.id].engine==="paint"?M[def.id]:{};Object.assign(g,def,{engine:"paint",ready:true});M[def.id]=g;return g};
})();
