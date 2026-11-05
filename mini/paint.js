/* mini/paint.js — the PAINT toolkit for painted games (Plan 6). Built by tools/build_paint.py from mini/paint/*.js; do not edit by hand. */
/* ==== 00-core.js ==== */
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

/* ==== 10-scene.js ==== */
/* PAINT part 10: scene layers (parallax + painted code fallbacks), camera, paper grain.
   Owns: scene, applyCam, camTo, camFollow, shake, parallaxOf, paperGrain. */
(function(){
const P=window.PAINT;
const MX=140,MY=160,CS=2.5,CVW=P.W+2*MX,CVH=P.H+2*MY,CW=CVW/CS,CH=CVH/CS; /* cover rect 640x1100 units, fallback canvases 256x440 (1 px = 2.5 units, soft by design) */
const X=x=>(x+MX)/CS,Y=y=>(y+MY)/CS;
const rgb=c=>Array.isArray(c)?c:(c=P.hex(c),[c>>16&255,c>>8&255,c&255]);
const mix=(a,b,t)=>{a=rgb(a);b=rgb(b);return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t]};
const css=(c,a)=>{c=rgb(c);return"rgba("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+","+(a==null?1:a)+")"};
const lerp=P.lerp,clamp=P.clamp;

/* ---- land palettes for the code fallbacks ---- */
const PAL={
 l1:{style:"cliff",sky:[[0,"#0a0715"],[150,"#1d0e2a"],[290,"#4a1c3e"],[365,"#8E3B5A"],[425,"#c4443f"],[480,"#f0a858"],[550,"#8a3a48"],[780,"#1c0e1e"]],
  sun:[250,440,230,"#F5C66A",.6],haze:"#b04a5a",far:"#4e3660",near:"#110918",rim:"#F5C66A",rimA:.38,hy:[455,650],fg:"#0c0710",
  clouds:[["#221c33",18,20,340,.6,1.1],["#5a2a4c",12,180,420,.34,1],["#f0904c",9,360,470,.34,.6]]},
 l2:{style:"round",sky:[[0,"#1d5658"],[170,"#3f8a88"],[330,"#a5cfc4"],[430,"#EDE6DA"],[520,"#e7d6b4"],[780,"#9cb8a8"]],
  sun:[95,330,200,"#fff4d6",.75],haze:"#d8e8de",far:"#8fc0b4",near:"#1a4c4a",rim:"#fff0c8",rimA:.6,hy:[450,640],fg:"#162a2b",
  clouds:[["#ffffff",14,60,380,.4,1],["#cfe8e2",10,200,480,.3,1.1]]},
 l3:{style:"peak",sky:[[0,"#5f7c6b"],[170,"#9fb39a"],[330,"#d6d9b6"],[440,"#E8C873"],[540,"#cdd2a8"],[780,"#60806a"]],
  sun:[200,390,190,"#fff0b8",.6],haze:"#d8dcc0",far:"#a9bea0",near:"#15171A",rim:"#E8C873",rimA:.4,hy:[440,640],fg:"#101315",
  clouds:[["#eef0d6",12,100,420,.34,1.2],["#9bb39c",10,40,300,.3,1]],mist:"#e8ecd2"},
 l4:{style:"city",sky:[[0,"#080d26"],[180,"#162450"],[330,"#1E2E55"],[420,"#6a4a58"],[485,"#E0A040"],[570,"#8a5a30"],[780,"#1a1426"]],
  sun:[180,490,240,"#E0A040",.6],haze:"#a8703a",far:"#394068",near:"#120d12",rim:"#E0A040",rimA:.5,hy:[450,650],fg:"#0c080c",gears:1,
  clouds:[["#1a2748",12,60,330,.4,1],["#8a5a6a",8,380,520,.28,.9]]}
};

/* ---- canvas painting helpers ---- */
function blob(c,x,y,rx,ry,col,a,tile){ /* soft elliptical dab, design units; wraps horizontally when tile */
 for(const o of tile?[-CW,0,CW]:[0]){c.save();c.translate(X(x)+o,Y(y));c.scale(1,ry/rx);const r=rx/CS,g=c.createRadialGradient(0,0,0,0,0,r);
  g.addColorStop(0,css(col,a));g.addColorStop(.55,css(col,a*.45));g.addColorStop(1,css(col,0));c.fillStyle=g;c.fillRect(-r,-r,r*2,r*2);c.restore()}}
function grain(c,rand,n,dark,light){ /* brush dabs and speckle over existing paint only */
 c.save();c.globalCompositeOperation="source-atop";
 for(let i=0;i<n;i++){const x=rand()*CW,y=rand()*CH,w=2+rand()*14,h=.6+rand()*1.4,d=rand()<.5;c.fillStyle=d?css(dark,.05+rand()*.06):css(light,.04+rand()*.05);c.fillRect(x,y,w,h)}
 for(let i=0;i<n*.8;i++){c.fillStyle=rand()<.5?css(dark,.07):css(light,.06);c.fillRect(rand()*CW,rand()*CH,1,1)}
 c.restore()}
function newCanvas(w,h){const c=document.createElement("canvas");c.width=w;c.height=h;return c}

function drawSky(c,pal,rand,sky,tile){
 const g=c.createLinearGradient(0,0,0,CH);for(const s of sky)g.addColorStop(clamp(Y(s[0])/CH,0,1),css(s[1]));
 c.fillStyle=g;c.fillRect(0,0,CW,CH);
 const sn=pal.sun;blob(c,sn[0],sn[1],sn[2],sn[2]*.8,sn[3],sn[4],false);blob(c,sn[0],sn[1],sn[2]*.4,sn[2]*.32,"#ffffff",sn[4]*.35,false);
 if(pal.gears){c.save();c.strokeStyle=css("#0a1030",.22);c.lineWidth=2.4;
  for(const [gx,gy,gr,teeth] of [[90,230,120,22],[300,140,80,16],[250,360,60,14]]){const cx=X(gx),cy=Y(gy),r=gr/CS;c.beginPath();c.arc(cx,cy,r,0,7);c.stroke();c.beginPath();c.arc(cx,cy,r*.62,0,7);c.stroke();
   for(let i=0;i<teeth;i++){const a=i/teeth*6.283;c.beginPath();c.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);c.lineTo(cx+Math.cos(a)*(r+7),cy+Math.sin(a)*(r+7));c.lineWidth=4;c.stroke()}c.lineWidth=2.4}c.restore()}
 for(const [col,n,y0,y1,a,sz] of pal.clouds){for(let i=0;i<n;i++){ /* each cloud = a lumpy cluster of dabs */
  const cx=rand()*CVW-MX,cy=lerp(y0,y1,rand()),bw=(60+rand()*90)*sz,k=3+(rand()*4|0);
  for(let j=0;j<k;j++)blob(c,cx+(rand()-.5)*bw,cy+(rand()-.5)*bw*.14,bw*(.35+rand()*.35),bw*(.07+rand()*.09),col,a*(.6+rand()*.6),tile)}}
 grain(c,rand,900,sky[0][1],pal.haze)}

function profile(style,rand,base,amp,t){ /* returns polyline [[x,y]...] of the ridge top, design units */
 const pts=[],s1=rand()*9,s2=rand()*9,x0=-MX,x1=P.W+MX;
 if(style==="round"){for(let x=x0;x<=x1;x+=6)pts.push([x,base-amp*(.5+.26*Math.sin(x*.011+s1)+.16*Math.sin(x*.027+s2)+.08*Math.sin(x*.06+s1*2))])}
 else if(style==="peak"){for(let x=x0;x<=x1;x+=5){const f=Math.sin(x*.012+s1)*.55+Math.sin(x*.031+s2)*.3+Math.sin(x*.075+s1)*.15;pts.push([x,base-amp*(1.05-Math.abs(f))])}}
 else if(style==="city"){let x=x0;pts.b=[];while(x<x1){const w=10+rand()*26,h=amp*(.12+.88*Math.pow(rand(),1.6)),y=base-h;
  pts.push([x,base-4],[x,y]);
  if(rand()<.13){const r=w*.55,cx=x+w/2;for(let a=Math.PI;a<=Math.PI*2+.01;a+=.4)pts.push([cx+Math.cos(a)*r,y+Math.sin(a)*r*.9])}
  else pts.push([x+w*.5,y]); /* flat roof */
  if(rand()<.2){pts.push([x+w*.45,y],[x+w*.5,y-amp*.2],[x+w*.55,y])}
  pts.push([x+w,y],[x+w,base-4]);pts.b.push([x,y,w,base-y]);x+=w+rand()*5}}
 else{const s3=rand()*9;let x=x0,y=base-amp*.5; /* cliff: terraced mesas, sheer faces, spires */
  while(x<x1){const env=.55+.28*Math.sin(x*.0085+s1)+.2*Math.sin(x*.021+s2)+.12*Math.sin(x*.06+s3),q=Math.round(env*5)/5,ny=base-amp*clamp(q+(rand()<.2?.12:0),.1,1.05);
   if(ny!==y){pts.push([x,y],[x+2+rand()*3,ny]);y=ny}else pts.push([x,y]);
   if(rand()<.1){const sh=amp*(.18+rand()*.3);pts.push([x+1,y],[x+6,y-sh],[x+13,y])}
   x+=7+rand()*9}
  pts.push([x1,y])}
 return pts}
function path(c,pts){c.beginPath();c.moveTo(X(pts[0][0]),Y(pts[0][1]));for(let i=1;i<pts.length;i++)c.lineTo(X(pts[i][0]),Y(pts[i][1]));c.lineTo(X(P.W+MX),CH+8);c.lineTo(X(-MX),CH+8);c.closePath()}

function drawHills(c,pal,rand,i,n,over){
 const t=n>1?i/(n-1):.55,base=lerp(pal.hy[0],pal.hy[1],t),amp=lerp(110,175,t);
 let top=over?rgb(over[i%over.length]):mix(pal.far,pal.near,Math.pow(t,.9));
 top=mix(top,pal.haze,(1-t)*.12);
 const pts=profile(pal.style,rand,base,amp,t);
 const g=c.createLinearGradient(0,Y(base-amp),0,Y(base+170));g.addColorStop(0,css(mix(top,pal.rim,.12)));g.addColorStop(.35,css(top));
 g.addColorStop(1,css(t<.5?mix(top,pal.haze,.3):mix(top,[0,0,0],.5)));
 c.fillStyle=g;for(const k of [6,3.6,2]){c.save();c.translate(0,-k);c.globalAlpha=.17;path(c,pts);c.fill();c.restore()}
 c.save();c.globalAlpha=.94;path(c,pts);c.fill();c.restore();
 if(pal.style==="city"&&t>.25){c.fillStyle=css("#F5B85A",.55+.3*t);for(const b of pts.b){if(b[3]<30)continue;const cols=Math.max(1,(b[2]/5)|0);
  for(let k=0;k<(b[3]/12)|0;k++)for(let j=0;j<cols;j++)if(rand()<.2)c.fillRect(X(b[0]+2+j*4.5),Y(b[1]+5+k*9),1,1.2)}}
 /* soft mist at the base, then warm rim light along the ridge */
 c.save();c.globalCompositeOperation="source-atop";const m=c.createLinearGradient(0,Y(base-amp*.2),0,Y(base+160));m.addColorStop(0,css(pal.haze,0));m.addColorStop(.55,css(pal.haze,0));m.addColorStop(1,css(pal.haze,.42*(1-t)+.05));c.fillStyle=m;c.fillRect(0,0,CW,CH);c.restore();
 const sx=X(pal.sun[0]),rg=c.createLinearGradient(0,0,CW,0);rg.addColorStop(0,css(pal.rim,.03));rg.addColorStop(clamp(sx/CW,0,1),css(pal.rim,pal.rimA*(1-t*.35)));rg.addColorStop(1,css(pal.rim,.03));
 c.strokeStyle=rg;c.lineJoin="round";for(const [lw,al] of [[2.4,.16],[.8,.55]]){c.globalAlpha=al;c.lineWidth=lw;c.beginPath();c.moveTo(X(pts[0][0]),Y(pts[0][1]-.5));for(let k=1;k<pts.length;k++)c.lineTo(X(pts[k][0]),Y(pts[k][1]-.5));c.stroke()}c.globalAlpha=1;
 grain(c,rand,1100,pal.near,pal.rim)}

function drawNear(c,pal,rand){ /* dark soft foreground at the bottom and side edges only; centre stays clear */
 const fg=pal.fg,st=pal.style;
 const g=c.createLinearGradient(0,Y(620),0,CH);g.addColorStop(0,css(fg,0));g.addColorStop(.55,css(fg,.7));g.addColorStop(1,css(fg,.97));c.fillStyle=g;c.fillRect(0,Y(620),CW,CH);
 for(const side of [-1,1]){const ex=side<0?-30:P.W+30;
  for(let i=0;i<7;i++)blob(c,ex+side*-rand()*26,lerp(610,790,rand()),50+rand()*50,70+rand()*60,fg,.8,false);
  if(st==="cliff"||st==="city"){ /* jagged rock / pipework masses */
   c.fillStyle=css(fg,.95);for(const k of [3,1.5,0]){c.save();c.translate(0,-k);c.globalAlpha=k?.2:.95;c.beginPath();c.moveTo(X(ex+side*70),CH+9);
    let y=790;const top=520+rand()*70,steps=6;for(let s=0;s<=steps;s++){const f=s/steps;c.lineTo(X(ex-side*(40-rand()*30+f*0)+side*(1-f)*60-side*f*0),Y(lerp(790,top,f)+(rand()-.5)*24))}
    c.lineTo(X(ex-side*80),Y(top-30));c.lineTo(X(ex-side*90),CH+9);c.closePath();c.fill();c.restore()}
   if(st==="city"&&side<0){const cx=X(10),cy=Y(740),r=95/CS;c.strokeStyle=css(fg,.95);c.lineWidth=9;c.beginPath();c.arc(cx,cy,r,0,7);c.stroke();
    for(let i=0;i<14;i++){const a=i/14*6.283;c.beginPath();c.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);c.lineTo(cx+Math.cos(a)*(r+13),cy+Math.sin(a)*(r+13));c.lineWidth=11;c.stroke()}}}
  else if(st==="peak"){c.strokeStyle=css(fg,.95);c.lineCap="round"; /* bamboo / grass blades curving in from the edges */
   for(let i=0;i<14;i++){const bx=ex+side*(-rand()*40),by=800,ty=lerp(560,720,rand()),tx=bx-side*(10+rand()*40);c.lineWidth=1.5+rand()*2.5;c.beginPath();c.moveTo(X(bx),Y(by));c.quadraticCurveTo(X(bx+side*10),Y((by+ty)/2),X(tx),Y(ty));c.stroke()}}
  else{c.fillStyle=css(fg,.95);const px=side<0?-10:P.W-18; /* round: a broken column and rock */
   c.fillRect(X(px),Y(560+rand()*40),28/CS,CH);c.fillRect(X(px-6),Y(556),40/CS,9/CS);for(let i=0;i<4;i++)blob(c,px+14+side*10,lerp(660,780,rand()),40,36,fg,.9,false)}}
 grain(c,rand,500,"#000000",pal.rim)}

function drawMist(c,pal,rand){for(let i=0;i<12;i++)blob(c,rand()*CVW-MX,lerp(380,640,rand()),90+rand()*90,14+rand()*20,pal.mist||pal.haze,.2+rand()*.14,true)}
function drawGround(c,pal,rand){const g=c.createLinearGradient(0,Y(640),0,CH);g.addColorStop(0,css(pal.near,0));g.addColorStop(.4,css(pal.near,.5));g.addColorStop(1,css(pal.fg,.8));c.fillStyle=g;c.fillRect(0,Y(640),CW,CH);grain(c,rand,500,"#000",pal.haze)}

/* makeFallback(land,kind,idx,n,fb) -> cached Texture (kinds: sky, hills, near, mist, ground) */
function fallbackTex(land,kind,i,n,fb){
 const pal=PAL[land]||PAL.l1,key="ps:"+land+":"+kind+":"+i+"/"+n+":"+(fb?JSON.stringify(fb):"");
 return P.make(key,CW|0,CH|0,(c)=>{const seed=(land.charCodeAt(1)*97+i*31+kind.length*7)|0,rand=P.rng(seed+13);
  if(kind==="sky"){let sky=pal.sky;if(fb&&fb.sky)sky=[[0,fb.sky[0]],[520,fb.sky[1]],[780,mix(fb.sky[1],fb.sky[0],.6)]];drawSky(c,pal,rand,sky,true)}
  else if(kind==="hills")drawHills(c,pal,rand,i,n,fb&&fb.hills&&fb.hills.length?fb.hills:null);
  else if(kind==="near")drawNear(c,pal,rand);
  else if(kind==="mist")drawMist(c,pal,rand);
  else drawGround(c,pal,rand)})}
function kindOf(L,drift){const d=L.depth;if(d>1)return"near";if(d>=1)return"ground";if(drift&&d>=.3)return"mist";return d<.3?"sky":"hills"}

/* ---- scene ---- */
/* PAINT.scene({land,layers:[{key,depth,y,h,tint,alpha,drift}],fallback:{sky:[top,bottom],hills:[colors]}}) -> {c,over,layers,setLayer(key,tex),destroy()} ; layer sizes in units (cover = 640x1100 centred on the screen) */
P.scene=function(cfg){
 cfg=cfg||{};const land=PAL[cfg.land]?cfg.land:"l1",ls=(cfg.layers||[]).map(o=>Object.assign({},o));
 if(!ls.length)ls.push({key:"sky",depth:0},{key:"hills_a",depth:.4},{key:"hills_b",depth:.7},{key:"near",depth:1.35}); /* default stack when none is given */
 const root=new PIXI.Container(),over=new PIXI.Container();root.sortableChildren=over.sortableChildren=true;root.pScene=over.pScene=true;root.zIndex=-1000;
 P.world.addChild(root);P.over.sortableChildren=true;P.over.addChild(over);
 const hillsN=ls.filter(L=>L.depth>=.3&&L.depth<1&&!L.drift).length;let hi=0;
 const h={c:root,over,layers:[],setLayer(key,tex){for(const L of h.layers)if(L.key===key)build(L,tex===undefined?P.tex(key):tex)},destroy};
 function build(L,tex){
  if(L.node){L.c.removeChild(L.node);L.node.destroy()}
  const fb=!tex;if(fb)tex=fallbackTex(land,L.kind,L.hi,hillsN,cfg.fallback);
  const w=CVW,hh=L.h||CVH,y=L.y!=null?L.y:-MY;let n;
  if(L.drift){n=new PIXI.TilingSprite({texture:tex,width:w,height:hh});n.tileScale.set(w/tex.width,hh/tex.height);n.tilePosition.x=L.tp||0}
  else{n=new PIXI.Sprite(tex);n.width=w;n.height=hh}
  n.x=-MX;n.y=y;if(L.tint!=null)n.tint=P.hex(L.tint);if(L.alpha!=null)n.alpha=L.alpha;L.node=n;L.fallback=fb;L.c.addChild(n)}
 for(const o of ls){const L=o;L.depth=L.depth==null?1:L.depth;L.kind=kindOf(L,L.drift);L.hi=L.kind==="hills"?hi++:0;
  L.c=new PIXI.Container();L.c.pDepth=L.depth;L.c.pBx=L.c.pBy=0;L.c.zIndex=L.depth*100;(L.depth>1?over:root).addChild(L.c);build(L,P.tex(L.key));h.layers.push(L)}
 const tick=(dt)=>{if(P.rm)return;for(const L of h.layers)if(L.drift&&L.node&&L.node.tilePosition){L.tp=(L.tp||0)+L.drift*dt;L.node.tilePosition.x=L.tp}};
 tick.dispose=destroy;P.on(tick);
 function destroy(){if(h.dead)return;h.dead=true;P.off(tick);try{root.destroy({children:true});over.destroy({children:true})}catch(e){}h.layers=[]}
 return h};

/* ---- camera ---- */
let _cam=null,_lt=0,sh={a:0,d:0,t:0,x:0,y:0,r:0},follow=null;
/* PAINT.parallaxOf(depth) -> number — how far a layer moves on screen per unit of camera travel (0 = fixed sky, 1 = play plane, >1 = foreground) */
P.parallaxOf=d=>d==null?1:d;
/* PAINT.camTo(x,y,zoom?,k?) — set camera target in world units; k = ease rate per second (default keeps current) */
P.camTo=function(x,y,zoom,k){const c=P.cam;if(!c)return;c.tx=x;c.ty=y;if(zoom!=null)c.tz=zoom;if(k!=null)c.k=k};
/* PAINT.shake(amount,dur) — screen shake of amount units, decaying over dur seconds; ignored under Reduce Motion */
P.shake=function(a,d){if(P.rm)return;if(a>=sh.a*(1-(sh.d?sh.t/sh.d:1))){sh.a=a;sh.d=Math.max(.05,d||.3);sh.t=0}};
/* PAINT.camFollow(obj,{lead?,box?}) -> tick fn — target obj.x/obj.y with a dead-zone box {w,h} (units); lead = seconds of look-ahead along its velocity; PAINT.off(fn) or fn.stop() ends it */
P.camFollow=function(obj,o){o=o||{};if(follow)P.off(follow);if(!obj){follow=null;return null}
 const bw=(o.box&&o.box.w!=null?o.box.w:60)/2,bh=(o.box&&o.box.h!=null?o.box.h:90)/2,lead=o.lead||0;let px=obj.x,py=obj.y,vx=0,vy=0;
 const f=function(dt){const c=P.cam;if(!c||!dt)return;vx=lerp(vx,(obj.x-px)/dt,.15);vy=lerp(vy,(obj.y-py)/dt,.15);px=obj.x;py=obj.y;
  const ox=obj.x+vx*lead,oy=obj.y+vy*lead;let dx=ox-c.tx,dy=oy-c.ty;
  if(dx>bw)c.tx+=dx-bw;else if(dx<-bw)c.tx+=dx+bw;if(dy>bh)c.ty+=dy-bh;else if(dy<-bh)c.ty+=dy+bh};
 f.stop=()=>{P.off(f);if(follow===f)follow=null};f.dispose=()=>{if(follow===f)follow=null};follow=f;P.on(f);return f};

function par(list,cx,cy){for(const ch of list){if(ch.pDepth!==undefined){const f=1-ch.pDepth;ch.position.set((ch.pBx||0)+cx*f,(ch.pBy||0)+cy*f)}
 else if(ch.pScene)for(const g of ch.children)if(g.pDepth!==undefined){const f=1-g.pDepth;g.position.set((g.pBx||0)+cx*f,(g.pBy||0)+cy*f)}}}
/* PAINT.applyCam() — core calls it each frame: eases cam toward target, shakes, sets transforms on world/fx/over, applies layer parallax */
P.applyCam=function(){const c=P.cam;if(!c||!P.world)return;
 if(_cam!==c){_cam=c;_lt=P.t;sh.a=sh.d=sh.t=0;follow=null}
 const dt=clamp(P.t-_lt,0,.1);_lt=P.t;const rm=P.rm;
 let k=c.k==null?4:c.k;if(rm)k=Math.min(k,3); /* Reduce Motion: slow glide for position, snap zoom */
 const a=1-Math.exp(-k*dt);c.x+=(c.tx-c.x)*a;c.y+=(c.ty-c.y)*a;
 if(rm)c.zoom=c.tz;else c.zoom+=(c.tz-c.zoom)*(1-Math.exp(-k*dt));
 let sx=0,sy=0,sr=0;
 if(sh.a>0&&!rm){sh.t+=dt;const u=1-sh.t/sh.d;if(u<=0){sh.a=0;c.shake=0}else{const m=sh.a*u*u;c.shake=m;sx=(Math.random()-.5)*2*m;sy=(Math.random()-.5)*2*m;sr=(Math.random()-.5)*m*.0008}}else c.shake=0;
 const cx=c.x-P.W/2,cy=c.y-P.H/2;
 for(const C of [P.world,P.fx,P.over]){C.pivot.set(c.x,c.y);C.position.set(P.W/2+sx,P.H/2+sy);C.scale.set(c.zoom);C.rotation=c.rot+sr}
 par(P.world.children,cx,cy);par(P.over.children,cx,cy)};

/* ---- paper grain ---- */
/* PAINT.paperGrain(alpha=.12) -> {c,set(alpha),destroy()} — full-screen multiply paper/canvas texture at the bottom of P.ui, so everything reads as painted */
P.paperGrain=function(alpha){
 const T=P.make("paper_grain",256,256,(c,w,h)=>{const r=P.rng(4242),im=c.createImageData(w,h),d=im.data;
  for(let i=0;i<w*h;i++){const v=214+((r()+r()+r())/3-.5)*70+(r()<.04?-30:0);d[i*4]=v+4;d[i*4+1]=v;d[i*4+2]=v-8;d[i*4+3]=255}
  c.putImageData(im,0,0);c.lineCap="round";
  for(let i=0;i<260;i++){const x=12+r()*(w-24),y=12+r()*(h-24),a=r()*6.283,l=4+r()*10;c.strokeStyle=r()<.5?"rgba(120,100,80,.12)":"rgba(255,250,240,.16)";c.lineWidth=.6;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);c.stroke()}});
 try{T.source.style.addressMode="repeat"}catch(e){}
 const s=new PIXI.TilingSprite({texture:T,width:P.W,height:P.H});s.blendMode="multiply";s.alpha=alpha==null?.12:alpha;s.eventMode="none";P.ui.addChildAt(s,0);
 const h={c:s,set(a){s.alpha=a},destroy(){if(!s.destroyed){s.parent&&s.parent.removeChild(s);s.destroy()}}};return h};
})();

/* ==== 20-light.js ==== */
/* PAINT part 20: light, shadow, rim, shafts, bloom, grade, vignette, LANDS.
   Lights/shadows/shafts are batched sprites (one shared texture each, additive for light). Bloom + grade (LUT) + vignette
   share ONE filter on P.view (one composite pass, plus a half-res bright/blur pre-pass only while bloom is on).
   Reduce Motion (PAINT.rm): no flicker, no sway, no pulse. No art needed anywhere. */
(function(){
const P=window.PAINT;if(!P)return;
const clamp=P.clamp,hex=P.hex;
const rgb=c=>{const h=hex(c);return[(h>>16&255)/255,(h>>8&255)/255,(h&255)/255]};
let warned=false;const warn=m=>{if(!warned){warned=true;console.warn("[PAINT.light] "+m)}};

/* ---- land palettes: key colours (contract), cool ambient, warm key light, and the grade tone settings ---- */
P.LANDS={
  l1:{name:"Stormcliffs",key:[0x8E3B5A,0xB23A48,0x4A5568,0xF5C66A],ambient:0x1B2142,keyLight:0xF2B866,
      grade:{lift:.42,warm:.30,contrast:.30,sat:.84,exposure:.96,gamma:1.04,vig:.55,vigColor:0x07050E}},
  l2:{name:"Marble Coast",key:[0x2F7470,0xEDE6DA,0xA8743A,0xFFD79A],ambient:0x3C6A86,keyLight:0xFFD08C,
      grade:{lift:.26,warm:.42,contrast:.20,sat:1.04,exposure:1.04,gamma:.98,vig:.38,vigColor:0x10202E}},
  l3:{name:"Misty Valleys",key:[0x4F7E3E,0x15171A,0xE8C873,0xF3E4B2],ambient:0x7E9AA2,keyLight:0xEBCB7A,
      grade:{lift:.50,warm:.30,contrast:.14,sat:.80,exposure:1.04,gamma:1.0,vig:.34,vigColor:0x1B262B}},
  l4:{name:"Clockwork City",key:[0xA0612E,0xE0A040,0x1E2E55,0xFFC866],ambient:0x1C2C58,keyLight:0xE8A444,
      grade:{lift:.40,warm:.44,contrast:.32,sat:.96,exposure:.98,gamma:1.02,vig:.52,vigColor:0x080A18}}
};
const landOf=v=>typeof v==="string"?P.LANDS[v]:(v&&v.ambient!=null?v:null);

/* ---- shared per-session registries and one tick ---- */
const R={lights:new Set(),shadows:new Set(),shafts:new Set()};
function tick(dt,t){
  const rm=P.rm;
  for(const h of R.lights){const s=h.c;if(s.destroyed){R.lights.delete(h);continue}
    let m=1,sc=1;
    if(h.flick>0&&!rm){const p=h.ph,f=h.flick;m=1+f*(.09*Math.sin(t*7.1+p)+.06*Math.sin(t*13.7+p*2.3)+.05*Math.sin(t*23.9+p*3.1));sc=1+f*.025*Math.sin(t*9.3+p*1.7)}
    s.alpha=clamp(h.intensity*m,0,1);const k=h.r*2*sc/s.texture.width;s.scale.set(k)}
  for(const h of R.shadows){const s=h.c,T=h.target;
    if(s.destroyed){R.shadows.delete(h);continue}
    if(!T||T.destroyed){h.destroy();continue}
    const p=T.parent;
    if(p&&s.parent!==p){p.addChildAt(s,Math.max(0,p.getChildIndex(T)))}
    s.zIndex=(T.zIndex||0)-.01;
    const sx=Math.abs(T.scale.x),sy=Math.abs(T.scale.y);
    s.x=T.x;s.y=T.y+h.offsetY*sy;s.width=h.w*sx;s.height=h.h*sy;s.alpha=h.alpha*T.alpha;s.visible=T.visible}
  for(const h of R.shafts){const c=h.c;if(c.destroyed){R.shafts.delete(h);continue}
    const a=h.o.alpha;
    for(const s of h.list){
      const sw=rm?0:Math.sin(t*.35+s.ph);
      s.rotation=s.rot0+sw*.035;
      s.alpha=a*s.a0*(rm?1:1+.18*Math.sin(t*.5+s.ph*2.1))}}}
tick.dispose=()=>{R.lights.clear();R.shadows.clear();R.shafts.clear();S=null};
function ensure(){if(!P.ticks.includes(tick)){R.lights.clear();R.shadows.clear();R.shafts.clear();P.on(tick)}}

/* ---- generated textures ---- */
const lightTex=()=>P.radial("paint.light",128,[[0,"rgba(255,255,255,1)"],[.12,"rgba(255,255,255,.72)"],[.3,"rgba(255,255,255,.33)"],[.55,"rgba(255,255,255,.11)"],[.8,"rgba(255,255,255,.025)"],[1,"rgba(255,255,255,0)"]]);
const shadowTex=()=>P.radial("paint.shadow",64,[[0,"rgba(255,255,255,.95)"],[.45,"rgba(255,255,255,.55)"],[.8,"rgba(255,255,255,.14)"],[1,"rgba(255,255,255,0)"]]);
const shaftTex=()=>P.make("paint.shaft",64,256,(c,w,h)=>{
  const g=c.createLinearGradient(0,0,w,0);[[0,0],[.28,.35],[.5,1],[.72,.35],[1,0]].forEach(s=>g.addColorStop(s[0],"rgba(255,255,255,"+s[1]+")"));
  c.fillStyle=g;c.fillRect(0,0,w,h);c.globalCompositeOperation="destination-in";
  const v=c.createLinearGradient(0,0,0,h);[[0,.0],[.06,.8],[.35,.5],[.7,.16],[1,0]].forEach(s=>v.addColorStop(s[0],"rgba(0,0,0,"+s[1]+")"));
  c.fillStyle=v;c.fillRect(0,0,w,h)});

/* PAINT.light({x,y,r,color,intensity,flicker,parent}) -> {c,x,y,set(o),destroy()}; r = radius in units, intensity 0..1, flicker 0..1 (true = 1) */
P.light=function(o){
  o=o||{};ensure();
  const s=new PIXI.Sprite(lightTex());s.anchor.set(.5);s.blendMode="add";
  const h={c:s,r:60,intensity:.8,flick:0,ph:Math.random()*40,
    get x(){return s.x},set x(v){s.x=v},get y(){return s.y},set y(v){s.y=v},
    set(q){q=q||{};if(q.x!=null)s.x=q.x;if(q.y!=null)s.y=q.y;if(q.r!=null)h.r=q.r;if(q.color!=null)s.tint=hex(q.color);
      if(q.intensity!=null)h.intensity=q.intensity;if(q.flicker!=null)h.flick=q.flicker===true?1:+q.flicker||0;
      s.alpha=clamp(h.intensity,0,1);s.scale.set(h.r*2/s.texture.width);return h},
    destroy(){R.lights.delete(h);if(!s.destroyed)s.destroy()}};
  h.set(Object.assign({color:0xF5C66A},o));
  (o.parent||P.fx||P.world||P.root).addChild(s);R.lights.add(h);return h};

/* PAINT.shadow(target,{w,h,alpha,offsetY}) -> {c,set(o),destroy()}; w,h = ellipse size at target scale 1; offsetY below target origin (feet) */
P.shadow=function(target,o){
  o=o||{};ensure();
  const s=new PIXI.Sprite(shadowTex());s.anchor.set(.5);s.tint=0x06040E;
  const h={c:s,target,w:60,h:17,alpha:.4,offsetY:0,
    set(q){q=q||{};if(q.w!=null){h.w=q.w;if(q.h==null&&o.h==null)h.h=q.w*.28}if(q.h!=null)h.h=q.h;if(q.alpha!=null)h.alpha=q.alpha;if(q.offsetY!=null)h.offsetY=q.offsetY;if(q.color!=null)s.tint=hex(q.color);return h},
    destroy(){R.shadows.delete(h);if(!s.destroyed)s.destroy()}};
  h.set(o);
  const p=target&&target.parent;if(p)p.addChildAt(s,Math.max(0,p.getChildIndex(target)));
  R.shadows.add(h);return h};

/* ---- shader plumbing ---- */
const VERT=`in vec2 aPosition;out vec2 vTextureCoord;out vec2 vScreen;out vec2 vTexel;
uniform vec4 uInputSize;uniform vec4 uOutputFrame;uniform vec4 uOutputTexture;
vec4 filterVertexPosition(void){vec2 position=aPosition*uOutputFrame.zw+uOutputFrame.xy;
position.x=position.x*(2.0/uOutputTexture.x)-1.0;position.y=position.y*(2.0*uOutputTexture.z/uOutputTexture.y)-uOutputTexture.z;return vec4(position,0.0,1.0);}
void main(void){gl_Position=filterVertexPosition();vTextureCoord=aPosition*(uOutputFrame.zw*uInputSize.zw);vScreen=aPosition;vTexel=uInputSize.zw;}`;
const FRAG_POST=`precision highp float;
in vec2 vTextureCoord;in vec2 vScreen;in vec2 vTexel;out vec4 finalColor;
uniform sampler2D uTexture;uniform sampler2D uLut;uniform sampler2D uBloomTex;
uniform float uAmount;uniform float uLutOn;uniform float uBloom;uniform float uVig;uniform vec3 uVigColor;uniform vec2 uBloomScale;
vec3 lut(vec3 c){c=clamp(c,0.0,1.0);float b=c.b*15.0;float b0=floor(b);float b1=min(b0+1.0,15.0);float f=b-b0;float y=(c.g*15.0+0.5)/16.0;float rx=c.r*15.0+0.5;
vec3 a=texture(uLut,vec2((b0*16.0+rx)/256.0,y)).rgb;vec3 d=texture(uLut,vec2((b1*16.0+rx)/256.0,y)).rgb;return mix(a,d,f);}
void main(void){vec4 c=texture(uTexture,vTextureCoord);vec3 rgb=c.a>0.001?c.rgb/c.a:c.rgb;
if(uBloom>0.0){vec3 b=texture(uBloomTex,vTextureCoord*uBloomScale).rgb;rgb=1.0-(1.0-rgb)*(1.0-clamp(b*uBloom,0.0,1.0));}
if(uLutOn>0.5)rgb=mix(rgb,lut(rgb),uAmount);
vec2 q=(vScreen-0.5)*2.0;float d=length(q*vec2(0.82,0.9));float v=smoothstep(0.5,1.3,d);rgb=mix(rgb,uVigColor,v*uVig);
rgb+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-0.5)/255.0;
finalColor=vec4(clamp(rgb,0.0,1.0)*c.a,c.a);}`;
const FRAG_BRIGHT=`precision highp float;
in vec2 vTextureCoord;out vec4 finalColor;uniform sampler2D uTexture;uniform float uThr;
void main(void){vec4 c=texture(uTexture,vTextureCoord);vec3 rgb=c.a>0.001?c.rgb/c.a:c.rgb;float l=max(rgb.r,max(rgb.g,rgb.b));float k=smoothstep(uThr,uThr+0.3,l);finalColor=vec4(rgb*k,1.0);}`;
const FRAG_RIM=`precision highp float;
in vec2 vTextureCoord;in vec2 vTexel;out vec4 finalColor;
uniform sampler2D uTexture;uniform vec3 uColor;uniform float uWidth;uniform float uAlpha;uniform vec2 uDir;
void main(void){vec4 c=texture(uTexture,vTextureCoord);if(c.a<0.002){finalColor=c;return;}
vec2 st=uDir*uWidth*vTexel;float o=0.0;
for(int i=1;i<=4;i++){o+=texture(uTexture,vTextureCoord+st*(float(i)*0.25)).a;}
o*=0.25;float rim=c.a*(1.0-o);rim=rim*rim*(3.0-2.0*rim);
finalColor=vec4(c.rgb+uColor*rim*uAlpha,c.a);}`;

let lastLog="";
/* compile + link test on the raw GL context so a bad shader falls back instead of throwing at render time */
function glOK(gp){
  try{const gl=P.app&&P.app.renderer&&P.app.renderer.gl;if(!gl)return true;
    const mk=(t,src)=>{const sh=gl.createShader(t);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){lastLog=gl.getShaderInfoLog(sh)||"compile error";gl.deleteShader(sh);return null}return sh};
    const v=mk(gl.VERTEX_SHADER,gp.vertex),f=mk(gl.FRAGMENT_SHADER,gp.fragment);if(!v||!f)return false;
    const pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);
    const ok=gl.getProgramParameter(pr,gl.LINK_STATUS);if(!ok)lastLog=gl.getProgramInfoLog(pr)||"link error";
    gl.deleteProgram(pr);gl.deleteShader(v);gl.deleteShader(f);return ok}catch(e){lastLog=String(e);return false}}
function mkFilter(name,frag,resources,opt){
  try{const gp=PIXI.GlProgram.from({vertex:VERT,fragment:frag,name});
    if(!glOK(gp)){warn(name+" shader failed ("+lastLog+"), using fallback");return null}
    return new PIXI.Filter(Object.assign({glProgram:gp,resources,resolution:"inherit",antialias:"inherit"},opt||{}))}
  catch(e){warn(name+" filter failed ("+e+"), using fallback");return null}}
const V=(n,a)=>({value:new Float32Array(a),type:n});

/* ---- the one post filter on P.view: bloom + LUT grade + vignette ---- */
const lutCanvas=document.createElement("canvas");lutCanvas.width=256;lutCanvas.height=16;
let lutTex=null;
const getLut=()=>lutTex||(lutTex=PIXI.Texture.from(lutCanvas));
const smooth=v=>v*v*(3-2*v),luma=c=>.2126*c[0]+.7152*c[1]+.0722*c[2];
/* tone function for a land: exposure/gamma, slight S-curve, desaturation, shadows lifted toward ambient, highlights warmed toward key light */
function toneOf(L){
  const g=L.grade||{},A=rgb(L.ambient),K=rgb(L.keyLight),ex=g.exposure||1,ga=g.gamma||1,ct=g.contrast!=null?g.contrast:.2,sa=g.sat!=null?g.sat:.9,li=g.lift||0,wa=g.warm||0;
  return(r,gg,b)=>{
    let c=[r,gg,b].map(v=>clamp(Math.pow(v,ga)*ex,0,1));
    c=c.map(v=>v+(smooth(v)-v)*ct);
    let l=luma(c);c=c.map(v=>l+(v-l)*sa);l=luma(c);
    const sh=Math.pow(1-clamp(l,0,1),2.2)*li;c=c.map((v,i)=>v+(A[i]*.75-v)*sh);
    const hl=Math.pow(clamp(l,0,1),1.6)*wa;c=c.map((v,i)=>v+(v*K[i]*1.4-v)*hl);
    return c.map(v=>clamp(v,0,1))}}
const matrixTone=m=>(r,g,b)=>[0,1,2].map(i=>clamp(m[i*5]*r+m[i*5+1]*g+m[i*5+2]*b+m[i*5+4],0,1));
function fillLut(tone){
  const ctx=lutCanvas.getContext("2d"),id=ctx.createImageData(256,16),d=id.data;
  for(let b=0;b<16;b++)for(let g=0;g<16;g++)for(let r=0;r<16;r++){
    const o=tone(r/15,g/15,b/15),i=(g*256+b*16+r)*4;d[i]=o[0]*255+.5;d[i+1]=o[1]*255+.5;d[i+2]=o[2]*255+.5;d[i+3]=255}
  ctx.putImageData(id,0,0);if(lutTex)lutTex.source.update()}

let S=null; /* per-session post state */
function post(){
  if(S&&S.view===P.view&&P.view&&!S.view.destroyed)return S;
  ensure();
  const st=S={view:P.view,filter:null,fallback:false,amount:1,lutOn:0,vig:0,vigColor:rgb(0x0E0B1A),bloom:{on:false,thr:.62,strength:.6,radius:10},users:{grade:false,vig:false,bloom:false},bright:null,blur:null,cm:null,sc:new Float32Array(2)};
  const u={uAmount:{value:1,type:"f32"},uLutOn:{value:0,type:"f32"},uBloom:{value:0,type:"f32"},uVig:{value:0,type:"f32"},uVigColor:V("vec3<f32>",[.05,.04,.08]),uBloomScale:V("vec2<f32>",[1,1])};
  const f=mkFilter("paint-post",FRAG_POST,{post:u,uLut:getLut().source,uBloomTex:PIXI.Texture.WHITE.source});
  if(f){
    st.filter=f;st.u=f.resources.post.uniforms;
    st.bright=mkFilter("paint-bright",FRAG_BRIGHT,{b:{uThr:{value:.62,type:"f32"}}});
    try{st.blur=new PIXI.BlurFilter({strength:10,quality:2,kernelSize:7})}catch(e){st.blur=null}
    st.bloomOK=!!(st.bright&&st.blur);
    const base=PIXI.Filter.prototype.apply;
    f.apply=function(fm,input,output,clear){
      const B=st.bloom,TP=PIXI.TexturePool;
      if(B.on&&B.strength>0&&st.bloomOK){
        const w=input.frame.width,h=input.frame.height,rs=input.source.resolution*.5;
        const t1=TP.getOptimalTexture(w,h,rs,false),t2=TP.getOptimalTexture(w,h,rs,false);
        st.bright.resources.b.uniforms.uThr=B.thr;st.bright.apply(fm,input,t1,true);
        st.blur.strength=B.radius;st.blur.apply(fm,t1,t2,true);
        const sc=st.u.uBloomScale;
        sc[0]=(t2.frame.width/t2.source.width)/(input.frame.width/input.source.width);
        sc[1]=(t2.frame.height/t2.source.height)/(input.frame.height/input.source.height);
        st.u.uBloom=B.strength;this.resources.uBloomTex=t2.source;
        base.call(this,fm,input,output,clear);
        TP.returnTexture(t1);TP.returnTexture(t2)}
      else{st.u.uBloom=0;base.call(this,fm,input,output,clear)}};
  }else{
    st.fallback=true;
    try{st.cm=new PIXI.ColorMatrixFilter();st.filter=st.cm}catch(e){st.filter=null}}
  return st}
/* fallback tint when the shader is unavailable: a ColorMatrixFilter built from the land key/ambient */
function fbMatrix(L){
  const g=L.grade||{},A=rgb(L.ambient),K=rgb(L.keyLight),m=[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0],mix=.18+(g.warm||0)*.2;
  for(let i=0;i<3;i++){m[i*6]=1-mix+mix*K[i]*1.25;m[i*5+4]=A[i]*(g.lift||0)*.3}
  return m}
function refresh(st){
  if(S!==st||!st.view||st.view.destroyed)return;
  const f=st.filter;if(!f)return;
  const on=st.users.grade||st.users.vig||st.users.bloom;
  const cur=st.view.filters?(Array.isArray(st.view.filters)?st.view.filters.slice():[st.view.filters]):[];
  const has=cur.indexOf(f)>=0;
  if(on&&!has){cur.push(f);st.view.filters=cur;st.view.filterArea=new PIXI.Rectangle(0,0,P.W,P.H)}
  else if(!on&&has){cur.splice(cur.indexOf(f),1);st.view.filters=cur}
  if(!st.fallback){const u=st.u;u.uAmount=st.amount;u.uLutOn=st.lutOn;u.uVig=st.vig;u.uVigColor.set(st.vigColor)}}
function setLut(st,arg){
  if(arg==null){st.lutOn=0;return}
  if(st.fallback){const L=landOf(arg);if(L&&st.cm){st.cm.matrix=fbMatrix(L)}else if(arg.matrix&&st.cm)st.cm.matrix=arg.matrix.slice(0,20);st.lutOn=1;return}
  const L=landOf(arg);
  if(L){fillLut(toneOf(L));st.lutOn=1;if(L.grade&&L.grade.vig!=null&&!st.users.vig){st.vig=L.grade.vig;st.vigColor=rgb(L.grade.vigColor!=null?L.grade.vigColor:0x0E0B1A)}return}
  if(arg.lut){const src=arg.lut.source||arg.lut,res=src&&src.resource;
    try{const cx=lutCanvas.getContext("2d");cx.clearRect(0,0,256,16);cx.drawImage(res,0,0,256,16);if(lutTex)lutTex.source.update();st.lutOn=1}
    catch(e){warn("LUT image not drawable, grade skipped");st.lutOn=0}return}
  if(arg.matrix){fillLut(matrixTone(arg.matrix));st.lutOn=1;return}
  warn("grade(): unknown land or lut");st.lutOn=0}

/* PAINT.grade(land | {lut:texture(256x16 strip), matrix:[20]}) -> {set(landOrLut), amount(0..1), destroy()} */
P.grade=function(arg){
  const st=post();st.users.grade=true;if(!st.fallback)getLut();
  const h={
    set(a){if(S!==st)return h;setLut(st,a);refresh(st);return h},
    amount(v){if(v===undefined)return st.amount;st.amount=clamp(v,0,1);if(st.fallback&&st.cm)st.cm.alpha=st.amount;refresh(st);return h},
    destroy(){st.users.grade=false;st.lutOn=0;refresh(st)}};
  h.set(arg==null?"l1":arg);return h};

/* PAINT.vignette({strength,color}) -> {set({strength,color}),destroy()}; folded into the grade pass */
P.vignette=function(o){
  const st=post();st.users.vig=true;
  const h={set(q){q=q||{};if(S!==st)return h;if(q.strength!=null)st.vig=clamp(q.strength,0,1);if(q.color!=null)st.vigColor=rgb(q.color);refresh(st);return h},
    destroy(){st.users.vig=false;st.vig=0;refresh(st)}};
  h.set(Object.assign({strength:.5,color:0x0E0B1A},o||{}));return h};

/* PAINT.bloom({threshold,strength,radius}) -> {setStrength(v),set(o),destroy()}; half-res bright-pass + blur added over the view; radius in units */
P.bloom=function(o){
  const st=post();o=o||{};st.users.bloom=true;const B=st.bloom;B.on=true;
  const h={set(q){q=q||{};if(S!==st)return h;if(q.threshold!=null)B.thr=q.threshold;if(q.strength!=null)B.strength=q.strength;if(q.radius!=null)B.radius=q.radius;refresh(st);return h},
    setStrength(v){return h.set({strength:v})},
    destroy(){B.on=false;st.users.bloom=false;refresh(st)}};
  h.set({threshold:o.threshold!=null?o.threshold:.62,strength:o.strength!=null?o.strength:.6,radius:o.radius!=null?o.radius:10});return h};

/* PAINT.rim(sprite,{color,width,alpha,dir}) -> {c,filter,set(o),destroy()}; dir = degrees toward the key light (0 right, -90 up, 180 left); width in units */
P.rim=function(target,o){
  o=o||{};
  const u={uColor:V("vec3<f32>",[1,.78,.42]),uWidth:{value:3,type:"f32"},uAlpha:{value:.8,type:"f32"},uDir:V("vec2<f32>",[-.7,-.7])};
  const f=mkFilter("paint-rim",FRAG_RIM,{rim:u});
  const h={c:target,filter:f,
    set(q){q=q||{};if(!f)return h;const un=f.resources.rim.uniforms;
      if(q.color!=null){const c=rgb(q.color);un.uColor.set(c)}
      if(q.width!=null){un.uWidth=q.width;f.padding=Math.ceil(q.width)+2}
      if(q.alpha!=null)un.uAlpha=q.alpha;
      if(q.dir!=null){let a=q.dir;if(typeof a==="object")a=Math.atan2(a.y,a.x);else a=a*Math.PI/180;un.uDir.set([Math.cos(a),Math.sin(a)])}
      return h},
    destroy(){if(!f||!target||target.destroyed)return;const cur=Array.isArray(target.filters)?target.filters.slice():target.filters?[target.filters]:[];
      const i=cur.indexOf(f);if(i>=0){cur.splice(i,1);target.filters=cur}}};
  if(f){h.set(Object.assign({color:P.LANDS.l1.keyLight,width:3,alpha:.8,dir:-135},o));
    const cur=Array.isArray(target.filters)?target.filters.slice():target.filters?[target.filters]:[];cur.push(f);target.filters=cur}
  return h};

/* PAINT.shafts({x,y,angle,count,length,width,color,alpha,parent}) -> {c,set({alpha,color}),destroy()}; angle = degrees from straight down (positive leans left), x,y = top origin; additive, slow sway */
P.shafts=function(o){
  o=Object.assign({x:260,y:-20,angle:18,count:5,length:620,width:70,color:0xF2C27A,alpha:.18},o||{});ensure();
  const c=new PIXI.Container(),r=P.rng(Math.round(o.x*7+o.angle*13+o.count)),tex=shaftTex();
  const h={c,o,list:[],
    set(q){q=q||{};if(q.alpha!=null)o.alpha=q.alpha;if(q.color!=null)for(const s of h.list)s.tint=hex(q.color);return h},
    destroy(){R.shafts.delete(h);if(!c.destroyed)c.destroy({children:true})}};
  const base=o.angle*Math.PI/180;
  for(let i=0;i<o.count;i++){
    const s=new PIXI.Sprite(tex);s.anchor.set(.5,0);s.blendMode="add";s.tint=hex(o.color);
    const wv=.55+r()*.9,spread=(i-(o.count-1)/2)*o.width*.85+(r()-.5)*o.width*.4;
    s.x=o.x+spread*Math.cos(base);s.y=o.y+spread*Math.sin(base);
    s.width=o.width*wv;s.height=o.length*(.7+r()*.4);
    s.rot0=base+(r()-.5)*.09+(i-(o.count-1)/2)*.03;s.rotation=s.rot0;s.a0=.45+r()*.55;s.ph=r()*6.28;s.alpha=o.alpha*s.a0;
    c.addChild(s);h.list.push(s)}
  (o.parent||P.fx||P.world||P.root).addChild(c);R.shafts.add(h);return h};
})();

/* ==== 30-fx.js ==== */
/* PAINT part 30 — particles, presets, burst, pulse, wash, glass, banner. Owns: particles PRESETS burst wash glass banner pulse.
   One shared generated atlas -> every emitter in a parent+blend shares one ParticleContainer (so ~2 draw calls for all weather).
   dt is in seconds. Reduce Motion (P.rm): weather falls at half speed with no flicker/blink, bursts are half size and half speed,
   pulses fade without growing, wash is a crossfade, banner does not slide. */
(function(){
const P=window.PAINT;
const TAU=Math.PI*2,DEG=Math.PI/180,{sin,cos,abs,max,min,pow,atan2,sqrt,random}=Math;
const FONT="Georgia, 'Times New Roman', serif",CAP=2000,GOLD=0xF5C66A,GOLD2=0xD9A93A,LEAD=0x100B15,NIGHT=0x0E0B1A;
const bgr=c=>((c&255)<<16)|(c&0xFF00)|((c>>16)&255);
const mix=(a,b,k)=>{const r=((a>>16)&255)*(1-k)+((b>>16)&255)*k,g=((a>>8)&255)*(1-k)+((b>>8)&255)*k,bl=(a&255)*(1-k)+(b&255)*k;return(r<<16)|(g<<8)|bl|0};
const mul=(a,k)=>{const f=v=>min(255,max(0,v*k))|0;return(f((a>>16)&255)<<16)|(f((a>>8)&255)<<8)|f(a&255)};
const rr=a=>a[0]+(a[1]-a[0])*random();
const R2=a=>typeof a==="number"?[a,a]:a;
const LAND={l1:0x8E3B5A,l2:0x2F7470,l3:0x4F7E3E,l4:0xA0612E};

/* ---------- generated atlas: soft painterly dabs, streaks, petals, leaves, sparks, glows ---------- */
const CELLS={mist0:[0,0,192,192],mist1:[192,0,192,192],spark:[384,0,64,64],glow:[448,0,64,64],ember:[384,64,48,48],
 dab0:[0,192,96,96],dab1:[96,192,96,96],petal0:[192,192,64,96],petal1:[256,192,64,96],leaf0:[320,192,64,96],leaf1:[384,192,64,96],streak0:[448,192,16,128],streak1:[464,192,16,128]};
const rgba=(l,a)=>`rgba(${l},${l},${l},${a})`;
function blob(c,w,h,rnd,n,rmin,rmax,a,lo){const R=min(w,h)/2;for(let i=0;i<n;i++){const r=R*(rmin+rnd()*(rmax-rmin)),an=rnd()*TAU,d=rnd()*max(0,R*.96-r),x=w/2+cos(an)*d,y=h/2+sin(an)*d,l=(lo+(255-lo)*rnd())|0;
  const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,rgba(l,a));g.addColorStop(.55,rgba(l,a*.55));g.addColorStop(1,rgba(l,0));c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2)}}
function fade(c,w,h,p){c.globalCompositeOperation="destination-in";const R=min(w,h)/2,g=c.createRadialGradient(w/2,h/2,0,w/2,h/2,R);g.addColorStop(0,"#000");g.addColorStop(p,"#000");g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(0,0,w,h);c.globalCompositeOperation="source-over"}
function leafPath(c,w,h,wd,skew){const m=w/2,t=5,b=h-6;c.beginPath();c.moveTo(m,t);c.bezierCurveTo(m+wd+skew,h*.28,m+wd,h*.72,m,b);c.bezierCurveTo(m-wd,h*.72,m-wd+skew,h*.28,m,t);c.closePath()}
const DRAW={
 dab(c,w,h,rnd,v){blob(c,w,h,rnd,8,.25,.55,.5,190);blob(c,w,h,rnd,3,.2,.35,.6,230);c.lineCap="round";for(let i=0;i<6;i++){const an=rnd()*TAU,r0=w*.1,r1=w*(.28+rnd()*.14);c.strokeStyle=rgba(235,.16);c.lineWidth=1+rnd()*2;c.beginPath();c.moveTo(w/2+cos(an)*r0,h/2+sin(an)*r0);c.lineTo(w/2+cos(an)*r1,h/2+sin(an)*r1);c.stroke()}fade(c,w,h,.55)},
 mist(c,w,h,rnd,v){blob(c,w,h,rnd,26,.22,.5,.1,215);fade(c,w,h,.2)},
 petal(c,w,h,rnd,v){const m=w/2,t=6,b=h-8,wd=v?17:22,sk=v?5:0;
  c.beginPath();c.moveTo(m,t);c.bezierCurveTo(m+wd+sk+10,h*.3,m+wd+4,h*.72,m,b);c.bezierCurveTo(m-wd-4,h*.72,m-wd+sk-10,h*.3,m,t);c.closePath();
  const g=c.createLinearGradient(0,t,0,b);g.addColorStop(0,rgba(255,1));g.addColorStop(.6,rgba(238,1));g.addColorStop(1,rgba(205,1));
  c.strokeStyle=rgba(255,.22);c.lineWidth=5;c.stroke();c.strokeStyle=rgba(255,.35);c.lineWidth=2.5;c.stroke();c.fillStyle=g;c.fill();
  if(v){c.fillStyle=rgba(255,1);c.beginPath();c.arc(m,t+2,2.5,0,TAU);c.fill()}
  blob(c,w,h,rnd,4,.2,.4,.18,160);c.strokeStyle=rgba(150,.35);c.lineWidth=1.2;c.beginPath();c.moveTo(m,t+10);c.quadraticCurveTo(m+sk*.4,h*.5,m,b-6);c.stroke()},
 leaf(c,w,h,rnd,v){const m=w/2,wd=v?17:23;leafPath(c,w,h,wd,v?4:0);
  const g=c.createLinearGradient(m-wd,0,m+wd,0);g.addColorStop(0,rgba(255,1));g.addColorStop(.5,rgba(215,1));g.addColorStop(1,rgba(170,1));
  c.strokeStyle=rgba(255,.3);c.lineWidth=4;c.stroke();c.fillStyle=g;c.fill();
  c.strokeStyle=rgba(110,.7);c.lineWidth=1.6;c.beginPath();c.moveTo(m,h-2);c.lineTo(m,10);c.stroke();c.lineWidth=1;c.strokeStyle=rgba(130,.5);
  for(let i=0;i<5;i++){const y=h-14-i*14;c.beginPath();c.moveTo(m,y);c.lineTo(m-wd*.7+i*1.5,y-12);c.moveTo(m,y);c.lineTo(m+wd*.7-i*1.5,y-12);c.stroke()}
  blob(c,w,h,rnd,3,.2,.35,.14,150)},
 streak(c,w,h,rnd,v){let g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(.5,"rgba(255,255,255,.95)");g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.fillRect(0,0,w,h);
  c.globalCompositeOperation="destination-in";g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(.12,"rgba(0,0,0,.35)");g.addColorStop(.7,"#000");g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(0,0,w,h);c.globalCompositeOperation="source-over"},
 spark(c,w,h){const m=w/2;let g=c.createRadialGradient(m,m,0,m,m,m);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(.12,"rgba(255,255,255,.8)");g.addColorStop(.35,"rgba(255,255,255,.18)");g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.fillRect(0,0,w,h);
  for(const [an,r,a] of [[0,30,.9],[Math.PI/2,30,.9],[Math.PI/4,17,.45],[-Math.PI/4,17,.45]]){c.save();c.translate(m,m);c.rotate(an);c.scale(1,.07);g=c.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,`rgba(255,255,255,${a})`);g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.beginPath();c.arc(0,0,r,0,TAU);c.fill();c.restore()}},
 glow(c,w,h){const m=w/2,g=c.createRadialGradient(m,m,0,m,m,m);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(.1,"rgba(255,255,255,.85)");g.addColorStop(.3,"rgba(255,255,255,.28)");g.addColorStop(.65,"rgba(255,255,255,.07)");g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.fillRect(0,0,w,h)},
 ember(c,w,h,rnd){const m=w/2;let g=c.createRadialGradient(m,m,0,m,m,m);g.addColorStop(0,"rgba(255,255,255,.55)");g.addColorStop(.4,"rgba(200,200,200,.2)");g.addColorStop(1,"rgba(200,200,200,0)");c.fillStyle=g;c.fillRect(0,0,w,h);blob(c,w,h,rnd,4,.14,.26,.95,215)}};
let A=null;
function atlas(){if(A)return A;const T=P.make("fx.atlas",512,512,c=>{for(const k in CELLS){const r=CELLS[k],v=/\d$/.test(k)?+k.slice(-1):0;c.save();c.translate(r[0],r[1]);c.beginPath();c.rect(0,0,r[2],r[3]);c.clip();DRAW[k.replace(/\d$/,"")](c,r[2],r[3],P.rng(97+k.charCodeAt(0)*13+v*101),v);c.restore()}});
  A={T,f:{}};for(const k in CELLS){const r=CELLS[k];A.f[k]=new PIXI.Texture({source:T.source,frame:new PIXI.Rectangle(r[0],r[1],r[2],r[3])})}return A}

/* ---------- presets ----------
   cfg: tex[names] life[s] speed[u/s] angle[deg, 90=down] gravity[u/s^2] wind[u/s^2] drag[1/s] wander[u/s^2 sway] wf[sway Hz*2pi] spin[rad/s] flip[tumble rad/s]
   scale[x native cell size] grow[end size mult] stretch[y scale mult] alpha[curve knots over life] amul colors blend flicker fr blink bf align spawn(area|top|bottom|point) rate[/s]
   puff = overrides used by PAINT.burst. */
P.PRESETS={
 dust:{tex:["dab0","dab1"],life:[6,11],speed:[3,12],angle:[0,360],gravity:-1,wander:7,wf:.6,scale:[.07,.17],alpha:[0,.5,.5,0],colors:[0xF5E6B8,0xF5C66A,0xFFF4D6],blend:"add",flicker:.35,fr:2.2,spawn:"area",rate:7},
 embers:{tex:["ember"],life:[2.5,5],speed:[25,60],angle:[-115,-65],gravity:-12,wind:7,drag:.25,wander:34,wf:2.6,spin:[-2,2],scale:[.16,.34],grow:.35,alpha:[0,1,.75,0],colors:[0xFFB347,0xFF7A2F,0xF5C66A,0xFFD98A],blend:"add",flicker:.5,fr:17,spawn:"bottom",rate:30,puff:{n:14,speed:[40,120],angle:[-150,-30],life:[.8,1.8],gravity:-10}},
 rain:{tex:["streak0","streak1"],life:[.8,1.05],speed:[620,780],angle:[102,108],scale:[.28,.5],alpha:[0,.55,.55,.1],amul:.9,colors:[0xBFD0E6,0x9FB4D4,0xD6E2F2],blend:"normal",align:true,spawn:"top",rate:330},
 mist:{tex:["mist0","mist1"],life:[12,20],speed:[4,10],angle:[-12,12],wander:1.6,wf:.4,scale:[1.2,2.4],grow:1.25,alpha:[0,.26,.26,0],colors:[0xAFC0D8,0xC9D2E0,0x9AA9C4],blend:"normal",spawn:"area",rate:1.4},
 petals:{tex:["petal0","petal1"],life:[7,11],speed:[14,30],angle:[60,120],gravity:7,wind:10,drag:.5,wander:24,wf:1.4,spin:[-1.2,1.2],flip:2.6,scale:[.22,.42],alpha:[0,1,1,0],colors:[0xF2B6C6,0xF7D0D9,0xE88AA6,0xFFE3E8],blend:"normal",spawn:"top",rate:3.2,puff:{n:14,speed:[60,170],angle:[0,360],life:[.9,1.7],gravity:130,drag:2,wander:30,flip:7}},
 sparks:{tex:["spark"],life:[.4,.9],speed:[0,0],angle:[-100,-80],gravity:240,drag:1.8,spin:[-3,3],scale:[.2,.5],grow:.15,alpha:[1,1,0],colors:[0xFFE9A8,GOLD,0xFFFFFF],blend:"add",flicker:.3,fr:30,spawn:"area",rate:10,puff:{n:14,speed:[90,260],angle:[0,360]}},
 fireflies:{tex:["glow"],life:[5,9],speed:[4,14],angle:[0,360],drag:.8,wander:24,wf:1.1,scale:[.26,.5],alpha:[0,1,1,0],colors:[0xE8F58A,0xF5E26A,0xFFD98A],blend:"add",blink:1,bf:[1.4,3],spawn:"area",rate:3.6},
 leaves:{tex:["leaf0","leaf1"],life:[6,10],speed:[14,32],angle:[60,120],gravity:8,wind:12,drag:.5,wander:26,wf:1.2,spin:[-2.2,2.2],flip:2.2,scale:[.25,.46],alpha:[0,1,1,0],colors:[0xC9892F,0xA6481F,GOLD2,0x7E8F3B,0x8B5A2B],blend:"normal",spawn:"top",rate:2.6,puff:{n:10,speed:[60,150],angle:[0,360],life:[.9,1.6],gravity:120,drag:2,flip:6}},
 snow:{tex:["dab0","dab1"],life:[8,12],speed:[20,40],angle:[70,110],wander:10,wf:.9,scale:[.05,.14],alpha:[0,.9,.9,0],colors:[0xFFFFFF,0xDDE8F5],blend:"normal",spawn:"top",rate:24}};

/* ---------- session state (reset when PAINT.begin makes a new view) ---------- */
let S=null,pidN=0;
function ens(){if(!P.view)throw new Error("PAINT.begin() first");if(S&&S.v===P.view)return S;
  S={v:P.view,em:[],layers:new Map(),bursts:{},anims:[],live:0,top:new PIXI.Container(),pp:null,pi:0,cover:null,ms:0};P.ui.addChild(S.top);atlas();
  const tick=dt=>{const t0=performance.now();dt=min(dt,1/20);const rm=P.rm;
    for(let i=S.em.length-1;i>=0;i--){const e=S.em[i];if(e.dead){S.em.splice(i,1);continue}step(e,dt,rm)}
    for(let i=S.anims.length-1;i>=0;i--){const a=S.anims[i];if(a.u(dt,rm)){S.anims.splice(i,1);a.d()}}
    if(S.pp)pulses(dt,rm);S.ms=P.stats.fx=performance.now()-t0};
  const me=S;tick.dispose=()=>{for(const a of me.anims)try{a.d()}catch(e){}me.anims.length=0};P.on(tick);return S}

/* ---------- emitters ---------- */
function layerFor(s,parent,blend){if(parent.__pid==null)parent.__pid=++pidN;const k=parent.__pid+"|"+blend;let L=s.layers.get(k);
  if(!L||L.c.destroyed){const c=new PIXI.ParticleContainer({texture:atlas().f.dab0,dynamicProperties:{position:true,vertex:true,rotation:true,color:true,uvs:false},blendMode:blend});parent.addChild(c);L={c,n:0};s.layers.set(k,L)}return L}
function compile(cfg){const d={tex:["dab0"],life:[2,4],speed:[0,0],angle:[0,360],gravity:0,wind:0,drag:0,wander:0,wf:1,spin:[0,0],flip:0,scale:[.2,.2],grow:1,stretch:1,alpha:[0,1,1,0],amul:1,colors:[0xFFFFFF],blend:"normal",flicker:0,fr:12,blink:0,bf:[1.5,3],align:false,spawn:"area",rate:10},c=Object.assign(d,cfg);
  c.life=R2(c.life);c.speed=R2(c.speed);c.angle=R2(c.angle);c.spin=R2(c.spin);c.scale=R2(c.scale);c.bf=R2(c.bf);c.cols=c.colors.map(x=>bgr(P.hex(x)));return c}
/* PAINT.particles(preset|cfg,{x,y,w,h,parent,rate,max}) -> emitter {c,rate,set(o),burst(n,x,y[,color]),stop(),destroy(),live}; area default = whole screen; parent default P.over */
P.particles=function(preset,o){const s=ens();o=o||{};const cfg=typeof preset==="string"?P.PRESETS[preset]:preset;if(!cfg)throw new Error("unknown preset "+preset);return mk(s,compile(cfg),o,"ambient")};
function mk(s,c,o,kind){const rate=o.rate!=null?o.rate:c.rate,avg=(c.life[0]+c.life[1])/2,n=o.max||max(8,min(CAP,Math.ceil(rate*avg*1.25)+8));
  const parent=o.parent||(kind==="burst"?s.top:P.over),L=layerFor(s,parent,c.blend),A=atlas(),ps=[],names=c.tex;
  const e={cfg:c,kind,x:o.x!=null?o.x:0,y:o.y!=null?o.y:0,w:o.w!=null?o.w:P.W,h:o.h!=null?o.h:P.H,rate,acc:0,n,live:0,dead:false,L,c:L.c,
   alive:new Uint8Array(n),age:new Float32Array(n),life:new Float32Array(n),vx:new Float32Array(n),vy:new Float32Array(n),ph:new Float32Array(n),sp:new Float32Array(n),sc:new Float32Array(n),am:new Float32Array(n),col:new Int32Array(n),free:new Int32Array(n),nfree:n,ps};
  for(let i=0;i<n;i++){const p=new PIXI.Particle({texture:A.f[names[i%names.length]],anchorX:.5,anchorY:.5});p.color=0;p.scaleX=p.scaleY=0;ps.push(p);e.free[i]=n-1-i}
  L.c.addParticle(...ps);s.em.push(e);
  e.set=function(q){q=q||{};for(const k of["x","y","w","h","rate"])if(q[k]!=null)e[k]=q[k];if(q.cfg)Object.assign(e.cfg,compile(Object.assign({},e.cfg,q.cfg)));return e};
  e.burst=function(cnt,x,y,color){const rm=P.rm;cnt=rm?Math.ceil(cnt*.5):cnt;for(let i=0;i<cnt;i++)spawn(s,e,x,y,0,0,true,color,rm,0);return e};
  e.stop=function(){e.rate=0;return e};
  e.destroy=function(){if(e.dead)return;e.dead=true;s.live-=e.live;e.live=0;const set=new Set(ps),keep=L.c.particleChildren.filter(p=>!set.has(p));L.c.removeParticles(0,L.c.particleChildren.length);if(keep.length)L.c.addParticle(...keep);
    if(!keep.length&&!L.c.destroyed){L.c.destroy();for(const[k,v]of s.layers)if(v===L)s.layers.delete(k)}};
  if(kind==="ambient"&&o.prewarm!==false&&rate>0){const k=min(n,Math.floor(rate*avg*.9));for(let i=0;i<k;i++)spawn(s,e,e.x,e.y,e.w,e.h,false,null,false,1)}
  return e}
/* spawn one particle; pre=1 means "already in flight": random age and position anywhere in the area */
function spawn(s,e,x,y,w,h,isBurst,color,rm,pre){if(!e.nfree||s.live>=CAP)return;const c=e.cfg,i=e.free[--e.nfree];e.alive[i]=1;e.live++;s.live++;
  const sp=rr(c.speed)*(isBurst&&rm?.5:1),an=rr(c.angle)*DEG,vx=cos(an)*sp,vy=sin(an)*sp;let px,py;
  if(isBurst||c.spawn==="point"){px=x+(random()-.5)*6;py=y+(random()-.5)*6}
  else if(pre||c.spawn==="area"){px=x+random()*w;py=y+random()*h}
  else if(c.spawn==="top"){const dx=vy>20?vx/vy*e.h:vx*3,ad=abs(dx);px=x+(dx>0?-ad:0)+random()*(w+ad);py=y-14-random()*24}
  else{px=x+random()*w;py=y+h-random()*h*.1}
  const life=rr(c.life);e.life[i]=life;e.age[i]=pre?random()*life*.95:0;e.vx[i]=vx;e.vy[i]=vy;e.ph[i]=random()*TAU;e.sp[i]=rr(c.spin);e.sc[i]=rr(c.scale);e.am[i]=.72+random()*.28;
  e.col[i]=color!=null?bgr(P.hex(color)):c.cols[(random()*c.cols.length)|0];const p=e.ps[i];p.x=px;p.y=py;p.rotation=c.align?0:random()*TAU;p.scaleX=p.scaleY=0}
function curve(k,a){const n=a.length-1,f=k*n,i=f|0;return i>=n?a[n]:a[i]+(a[i+1]-a[i])*(f-i)}
function step(e,dt,rm){const c=e.cfg,s=S;if(e.kind==="ambient"){if(rm)dt*=.5;
    if(e.rate>0&&!e.dead){e.acc+=e.rate*dt;while(e.acc>=1){e.acc-=1;spawn(s,e,e.x,e.y,e.w,e.h,false,null,false,0)}}}
  if(!e.live)return;const A=c.alpha,g=c.gravity,wd=c.wander,wf=c.wf,dr=c.drag>0?max(0,1-c.drag*dt):1,fl=!rm&&c.flicker,bl=c.blink,gr=c.grow-1,fp=c.flip,st=c.stretch,al=c.align,wi=c.wind,am=c.amul;
  for(let i=0;i<e.n;i++){if(!e.alive[i])continue;const p=e.ps[i],age=e.age[i]+dt,life=e.life[i];
    if(age>=life){e.alive[i]=0;e.live--;s.live--;e.free[e.nfree++]=i;p.color=0;p.scaleX=p.scaleY=0;continue}e.age[i]=age;const k=age/life,ph=e.ph[i];
    let vx=e.vx[i],vy=e.vy[i];vx+=(wi+(wd?wd*sin(age*wf+ph):0))*dt;vy+=(g+(wd?wd*.6*cos(age*wf*.83+ph*1.7):0))*dt;if(dr<1){vx*=dr;vy*=dr}e.vx[i]=vx;e.vy[i]=vy;p.x+=vx*dt;p.y+=vy*dt;
    p.rotation=al?atan2(vy,vx)-1.5708:p.rotation+e.sp[i]*dt;
    const sz=e.sc[i]*(1+gr*k);let sx=sz;if(fp)sx*=.12+.88*abs(cos(age*fp*(.7+(ph%1)*.6)+ph));p.scaleX=sx;p.scaleY=sz*st;
    let a=curve(k,A)*e.am[i]*am;if(fl)a*=1-c.flicker*(.5+.5*sin(age*c.fr+ph));
    if(bl){if(rm)a*=.6;else{const b=.5+.5*sin(age*(c.bf[0]+(c.bf[1]-c.bf[0])*((ph*.159)%1))+ph);a*=b*b}}
    p.color=e.col[i]+(((a*255)|0)<<24)}}

/* PAINT.burst(x,y,{preset:"sparks"|"petals"|...,n,color,parent}) -> one-shot puff for input feedback (screen units, drawn in the top UI layer) */
P.burst=function(x,y,o){const s=ens();o=o||{};const name=o.preset||"sparks",base=P.PRESETS[name];if(!base)return null;const key=name+"|"+(o.parent?o.parent.__pid||(o.parent.__pid=++pidN):"top");let e=s.bursts[key];
  if(!e||e.dead){const cfg=Object.assign({},base,base.puff||{});delete cfg.rate;e=mk(s,compile(cfg),{parent:o.parent,max:180,prewarm:false,rate:0},"burst");e.defN=(base.puff&&base.puff.n)||12;s.bursts[key]=e}
  e.burst(o.n||e.defN,x,y,o.color);return e};

/* ---------- pulse: expanding soft ring of light (additive), pooled ---------- */
const PN=14;
function ringTex(){return P.make("fx.ring",128,128,(c,w)=>{const m=w/2,g=c.createRadialGradient(m,m,0,m,m,m);[[0,.05],[.5,.1],[.66,.35],[.74,.85],[.8,1],[.87,.4],[.94,.08],[1,0]].forEach(s=>g.addColorStop(s[0],`rgba(255,255,255,${s[1]})`));c.fillStyle=g;c.fillRect(0,0,w,w);
  const r=P.rng(5);c.globalCompositeOperation="destination-out";c.lineCap="round";for(let i=0;i<14;i++){const an=r()*TAU,sp=.12+r()*.2;c.strokeStyle=`rgba(0,0,0,${.2+r()*.3})`;c.lineWidth=2+r()*3;c.beginPath();c.arc(m,m,m*(.7+r()*.12),an,an+sp);c.stroke()}c.globalCompositeOperation="source-over"})}
/* PAINT.pulse(x,y,{color,r,dur}) -> void; x,y,r in units, dur in seconds */
P.pulse=function(x,y,o){const s=ens();o=o||{};if(!s.pp){const T=ringTex();s.pp=[];for(let i=0;i<PN;i++){const sp=new PIXI.Sprite(T);sp.anchor.set(.5);sp.blendMode="add";sp.visible=false;sp.t=0;sp.dur=1;sp.r=30;s.top.addChild(sp);s.pp.push(sp)}}
  const sp=s.pp[s.pi=(s.pi+1)%PN];sp.x=x;sp.y=y;sp.tint=P.hex(o.color!=null?o.color:GOLD);sp.t=0;sp.dur=o.dur||.5;sp.r=o.r||38;sp.visible=true;sp.alpha=0};
function pulses(dt,rm){for(const sp of S.pp){if(!sp.visible)continue;sp.t+=dt;const k=sp.t/sp.dur;if(k>=1){sp.visible=false;continue}
  if(rm){sp.scale.set(sp.r*.8/64);sp.alpha=.5*sin(Math.PI*k)}else{sp.scale.set(sp.r*2*(.15+.85*P.ease.out(k))/128);sp.alpha=pow(1-k,1.4)*.95}}}

/* ---------- wash: paint-brush wipe over the whole screen ---------- */
function edgeTex(key,seed){return P.make(key,260,1024,(c,w,h)=>{const r=P.rng(seed);c.fillStyle="#fff";c.fillRect(0,0,100,h);let y=0;
  while(y<h){const th=2.5+r()*6.5,wave=24*sin(y/90+seed)+14*sin(y/31+seed*2)+8*sin(y/11),L=max(70,70+pow(r(),1.3)*80+wave+20),a=.7+r()*.3,x1=95+L,g=c.createLinearGradient(95,0,x1,0);
    g.addColorStop(0,`rgba(255,255,255,${a})`);g.addColorStop(.7,`rgba(255,255,255,${a*.9})`);g.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=g;c.fillRect(95,y,L,th*.9+.5);
    if(r()<.12){c.fillStyle=`rgba(255,255,255,${a*.5})`;c.fillRect(95+L*.8,y+th*.25,L*.35,1.2)}y+=th*.55+r()*th*.6}})}
/* PAINT.wash("in"|"out",{dur,color,onDone}) -> Promise; "out" covers the screen and stays until the next wash, "in" reveals it */
P.wash=function(dir,o){const s=ens();o=o||{};dir=dir==="in"?"in":"out";const dur=max(.2,o.dur||.9),col=P.hex(o.color!=null?o.color:NIGHT),out=dir==="out";
  const old=s.cover;const wc=new PIXI.Container();P.ui.addChild(wc);s.cover=wc;
  return new Promise(res=>{let t=0,done=false;const fin=()=>{if(done)return;done=true;if(!out&&s.cover===wc){s.cover=null}if(!out&&!wc.destroyed)wc.destroy({children:true});try{o.onDone&&o.onDone()}catch(e){}res()};
   let upd;
   if(P.rm){const r=new PIXI.Sprite(PIXI.Texture.WHITE);r.width=P.W;r.height=P.H;r.tint=col;wc.addChild(r);const d=max(.3,dur*.6);r.alpha=out?0:1;upd=dt=>{t+=dt;const k=min(1,t/d);r.alpha=out?k:1-k;return k>=1}}
   else{const th=-.36,hx=abs(cos(th))*P.W/2+abs(sin(th))*P.H/2,exA=-hx-270,exB=hx+20,T1=edgeTex("fx.edge1",11),T2=edgeTex("fx.edge2",23);
    wc.x=P.W/2;wc.y=P.H/2;wc.rotation=th;if(!out)wc.scale.x=-1;
    const mk2=(tex,tint,al)=>{const sp=new PIXI.Sprite(tex);sp.y=-700;sp.height=1400;sp.tint=tint;sp.alpha=al;wc.addChild(sp);return sp};
    const rim=mk2(T2,mix(col,0xFFFFFF,.28),.55),body=new PIXI.Sprite(PIXI.Texture.WHITE),main=mk2(T1,col,1);body.tint=col;body.y=-700;body.height=1400;body.width=5000;wc.addChildAt(body,0);
    const place=e=>{main.x=e;rim.x=e+15;body.x=e-4999};place(out?exA:exB);
    upd=dt=>{t+=dt;const k=min(1,t/dur),e=P.ease.inOut(k);place(out?exA+(exB-exA)*e:exB+(exA-exB)*e);return k>=1}}
   s.anims.push({u:upd,d:fin});if(old&&!old.destroyed)old.destroy({children:true})})};

/* ---------- glass: painted stained-glass panel ---------- */
const area=p=>{let a=0;for(let i=0;i<p.length;i+=2){const j=(i+2)%p.length;a+=p[i]*p[j+1]-p[j]*p[i+1]}return a/2};
const cent=p=>{let x=0,y=0;const n=p.length/2;for(let i=0;i<p.length;i+=2){x+=p[i];y+=p[i+1]}return[x/n,y/n]};
function clip(p,nx,ny,d){const o=[];for(let i=0;i<p.length;i+=2){const ax=p[i],ay=p[i+1],bx=p[(i+2)%p.length],by=p[(i+3)%p.length],da=nx*ax+ny*ay-d,db=nx*bx+ny*by-d;if(da<=0)o.push(ax,ay);if((da<0&&db>0)||(da>0&&db<0)){const t=da/(da-db);o.push(ax+(bx-ax)*t,ay+(by-ay)*t)}}return o}
function oct(w,h,ins,ch){const a=ins,b=w-ins,c=ins,d=h-ins;return[a+ch,c,b-ch,c,b,c+ch,b,d-ch,b-ch,d,a+ch,d,a,d-ch,a,c+ch]}
/* PAINT.glass({x,y,w,h,color,glow,parent,seed}) -> {c,setText(str,font,size,color),setLight(k 0..1),destroy}; x,y = top-left corner in units of the parent */
P.glass=function(o){const s=ens();o=o||{};const w=o.w||200,h=o.h||70,col=P.hex(o.color!=null?o.color:GOLD),glowK=o.glow!=null?o.glow:1,parent=o.parent||P.ui,rnd=P.rng(o.seed||((w*31+h*17+col)|0));
  const c=new PIXI.Container();c.x=o.x||0;c.y=o.y||0;
  const gt=P.radial("fx.glowsoft",128,[[0,"rgba(255,255,255,.95)"],[.35,"rgba(255,255,255,.4)"],[.7,"rgba(255,255,255,.1)"],[1,"rgba(255,255,255,0)"]]);
  const glow=new PIXI.Sprite(gt);glow.anchor.set(.5);glow.x=w/2;glow.y=h/2;glow.width=w*1.7+60;glow.height=h*2.2+50;glow.tint=mix(col,0xFFFFFF,.15);glow.blendMode="add";c.addChild(glow);
  const baseG=new PIXI.Graphics(),lightG=new PIXI.Graphics(),leadG=new PIXI.Graphics(),plate=new PIXI.Sprite(P.radial("fx.plate",64,[[0,"rgba(16,11,21,.62)"],[.6,"rgba(16,11,21,.4)"],[1,"rgba(16,11,21,0)"]]));plate.anchor.set(.5);plate.x=w/2;plate.y=h/2;plate.visible=false;c.addChild(baseG,lightG,leadG,plate);
  const ch=min(10,h*.2),shape=oct(w,h,0,ch);let fac=[shape],tot=abs(area(shape));
  for(let it=0;it<(w*h>9000?6:4);it++){let bi=0,ba=0;fac.forEach((f,i)=>{const a=abs(area(f));if(a>ba){ba=a;bi=i}});const f=fac[bi],[cx,cy]=cent(f);
    for(let tr=0;tr<8;tr++){const an=rnd()*Math.PI,nx=cos(an),ny=sin(an),d=nx*(cx+(rnd()-.5)*w*.25)+ny*(cy+(rnd()-.5)*h*.25),a1=clip(f,nx,ny,d),a2=clip(f,-nx,-ny,-d);
      if(a1.length>=6&&a2.length>=6&&abs(area(a1))>tot*.07&&abs(area(a2))>tot*.07){fac.splice(bi,1,a1,a2);break}}}
  const tg=[GOLD,0xFFFFFF,LEAD];
  for(const f of fac){const cl=mix(col,tg[(rnd()*2.4)|0],.08+rnd()*.22),b=.8+rnd()*.4,fc=mul(cl,b);const[cx,cy]=cent(f);
    baseG.poly(f).fill({color:mul(fc,.62)});
    [[.92,.2,.3],[.74,.34,.34],[.52,.5,.38],[.3,.7,.4]].forEach(q=>{const pts=[];for(let i=0;i<f.length;i+=2){pts.push(cx-3+(f[i]-cx)*q[0],cy-4+(f[i+1]-cy)*q[0])}lightG.poly(pts).fill({color:mix(fc,0xFFFFFF,q[1]),alpha:q[2]})});
    if(rnd()<.7){const an=rnd()*TAU,l=6+rnd()*14;lightG.moveTo(cx+cos(an)*3,cy+sin(an)*3).lineTo(cx+cos(an)*l,cy+sin(an)*l).stroke({width:1.1,color:0xFFFFFF,alpha:.22+rnd()*.15,cap:"round"})}
    if(rnd()<.5){lightG.circle(cx+(rnd()-.5)*10,cy+(rnd()-.5)*8,.8+rnd()*1.2).fill({color:0xFFFFFF,alpha:.35})}}
  for(const f of fac)leadG.poly(f).stroke({width:3.2,color:LEAD,join:"round",cap:"round"});
  leadG.poly(shape).stroke({width:7,color:LEAD,join:"round"});
  leadG.poly(oct(w,h,5.5,max(2,ch-3))).stroke({width:1.5,color:GOLD2,alpha:.9,join:"round"});
  leadG.poly(oct(w,h,-1.5,ch+1)).stroke({width:1.2,color:GOLD,alpha:.55,join:"round"});
  let txt=null,light=.85;const setLight=k=>{light=P.clamp(k,0,1);lightG.alpha=.25+.75*light;glow.alpha=.8*light*glowK;return h2};
  const h2={c,setLight,
   setText(str,font,size,color){size=size||20;const base={fontFamily:font||FONT,fontSize:size,letterSpacing:1};let fill=color!=null?P.hex(color):null;
    if(fill==null){try{fill=new PIXI.FillGradient({type:"linear",start:{x:0,y:0},end:{x:0,y:1},colorStops:[{offset:0,color:"#FFEFB8"},{offset:1,color:"#E3B34A"}]})}catch(e){fill=GOLD}}
    const sf=Object.assign({fill},base),so=Object.assign({fill:LEAD,stroke:{color:LEAD,width:max(3,size*.26),join:"round"}},base);
    if(!txt){txt=new PIXI.Container();txt.o=new PIXI.Text({text:str,style:so});txt.f=new PIXI.Text({text:str,style:sf});for(const t of[txt.o,txt.f]){t.anchor.set(.5);t.resolution=2}txt.addChild(txt.o,txt.f);txt.x=w/2;txt.y=h/2+1;c.addChild(txt)}
    else{txt.o.text=txt.f.text=str;txt.o.style=so;txt.f.style=sf}
    txt.scale.set(1);const tw=txt.f.width,th=txt.f.height,mw=w-30;if(tw>mw)txt.scale.set(mw/tw);plate.visible=true;plate.width=tw*txt.scale.x+44;plate.height=th+26;return h2},
   destroy(){if(!c.destroyed)c.destroy({children:true})}};
  setLight(.85);parent.addChild(c);if(parent===P.ui)P.ui.addChild(s.top);return h2};

/* PAINT.banner(text,{land:"l1".."l4",dur,font,color}) -> Promise (resolves when it has faded out); 300x58 glass at y~150, text 22 units */
P.banner=function(text,o){const s=ens();o=o||{};const dur=o.dur||2.8,W=300,H=58,y0=150-H/2,g=P.glass({x:(P.W-W)/2,y:y0,w:W,h:H,color:o.color!=null?o.color:(LAND[o.land]||LAND.l1),glow:1.1,seed:o.seed||(text.length*7+3)});
  g.setText(text,o.font,22);g.c.alpha=0;g.setLight(.5);
  return new Promise(res=>{let t=0,fired=false;const IN=.45,OUT=.5;
   s.anims.push({u:(dt,rm)=>{t+=dt;const a=t<IN?P.ease.out(t/IN):t>dur-OUT?max(0,(dur-t)/OUT):1;g.c.alpha=a;g.c.y=y0+(rm?0:(1-a)*(t<dur/2?26:-14));
     g.setLight(rm?.8:.6+.4*sin(t*3.2)*min(1,t/IN));if(!fired&&t>IN*.6&&!rm){fired=true;P.burst(P.W/2-W/2+4,150,{preset:"sparks",n:8});P.burst(P.W/2+W/2-4,150,{preset:"sparks",n:8})}return t>=dur},d:()=>{g.destroy();res()}})})};
})();

/* ==== 40-actor.js ==== */
/* PAINT part 40: characters. Names owned: actor, puppet, frames, figure.
   RIG FORMAT (puppet): rig={parts:{name:{rect:[x,y,w,h] (sheet px; omit for a pure bone), pivot:[px,py] (px inside the part rect, = the joint),
     parent:"name"|null, at:[x,y] (attach point: pixel in the PARENT's rect, same space as the parent's pivot; for a root part: offset from the feet origin),
     z (sibling order; the parent's own sprite is 0, so negative = behind the parent), rot0 (rest angle, radians, +clockwise), tint, hidden,
     spring:true (+ k,d,gain,inertia)}}, scale (optional unit scale), clips (optional {name:fn(t,o,ix,K)})}.
   Rig faces RIGHT with its origin at the feet. Clips write absolute offsets per part (rot, dx, dy, sx, sy).
   Positive rotation is clockwise: a hanging arm swings BACK with +, forward/up with -. */
(function(){
const P=window.PAINT;
const RES=2,NOM=192,PAD=5,BLEND=.15;
const sin=Math.sin,cos=Math.cos,abs=Math.abs,max=Math.max,min=Math.min,TAU=Math.PI*2;
const clamp=P.clamp,eo=P.ease.out,eio=P.ease.inOut,lerp=P.lerp;
const NAMES=["hip","torso","head","cloak","scarf","armFront","armBack","legFront","legBack","lantern","staff"];

/* ---------- pose scratch + clip helpers (no allocation per frame) ---------- */
let PA=null;
const K={R:(i,v)=>{PA[i*5]=v},DX:(i,v)=>{PA[i*5+1]=v},DY:(i,v)=>{PA[i*5+2]=v},SX:(i,v)=>{PA[i*5+3]=v},SY:(i,v)=>{PA[i*5+4]=v}};
const R=K.R,DX=K.DX,DY=K.DY,SX=K.SX,SY=K.SY;
/* clip(t seconds, o{amp,sq,lantern,staff}, ix index map, K) -> writes PA. Slot "body" = squash container (sx,sy), slot "wind" = cloak drive (rot) */
const CL={
idle:{dur:1,f(t,o,ix){const a=o.amp,w=TAU/3.4,b=sin(t*w);
  SY(ix.torso,1+.02*a*b);SX(ix.torso,1-.007*a*b);DY(ix.head,-1.5*a*b);R(ix.head,.035*a*sin(t*.9));R(ix.torso,.012*a*sin(t*.6));
  R(ix.armFront,.03+.05*a*b);R(ix.armBack,-.03-.05*a*b);R(ix.legFront,-.015);R(ix.legBack,.02);R(ix.wind,.025*a*sin(t*1.3)+.01);DY(ix.hip,.5*a*b)}},
walk:{dur:1,f(t,o,ix){const a=o.amp,ph=t*TAU*1.5,s=sin(ph),c=cos(ph),bob=o.rm?.45:1;
  R(ix.legFront,-.62*s);R(ix.legBack,.62*s);DY(ix.legFront,-3.6*max(0,c));DY(ix.legBack,-3.6*max(0,-c));
  DY(ix.hip,(2.8*abs(s)-1.4)*bob);R(ix.torso,.07+.025*s);DY(ix.head,-.9*cos(ph*2)*bob);R(ix.head,-.045-.02*sin(ph+.5));
  R(ix.armFront,.55*s);R(ix.armBack,-.55*s+.1);R(ix.wind,.2+.08*sin(ph*2+1));SY(ix.torso,1+.008*cos(ph*2))}},
jump:{dur:.5,loop:false,f(t,o,ix){const T1=.18,T2=.3;
  if(t<T1){const e=eio(t/T1);SY(ix.body,1-.2*e);SX(ix.body,1+.12*e);R(ix.armFront,.8*e);R(ix.armBack,.7*e);R(ix.legFront,-.35*e);R(ix.legBack,.35*e);R(ix.torso,.13*e);R(ix.head,-.05*e);DY(ix.hip,3*e);R(ix.wind,-.1*e)}
  else if(t<T2){const e=eo((t-T1)/(T2-T1));SY(ix.body,lerp(.8,1.14,e));SX(ix.body,lerp(1.12,.9,e));R(ix.armFront,lerp(.8,-2.2,e));R(ix.armBack,lerp(.7,-1.6,e));R(ix.legFront,lerp(-.35,-.05,e));R(ix.legBack,lerp(.35,.1,e));R(ix.torso,lerp(.13,.04,e));DY(ix.hip,lerp(3,-2,e));R(ix.wind,lerp(-.1,-.25,e))}
  else{const e=eo(min(1,(t-T2)/.25));SY(ix.body,lerp(1.14,1,e));SX(ix.body,lerp(.9,1,e));R(ix.armFront,lerp(-2.2,-1.25,e));R(ix.armBack,lerp(-1.6,-.6,e));R(ix.legFront,lerp(-.05,-.75,e));R(ix.legBack,lerp(.1,.45,e));R(ix.torso,.05);R(ix.head,-.06);DY(ix.hip,-2);R(ix.wind,-.25);SY(ix.cloak,lerp(1,.9,e))}}},
fall:{dur:1,f(t,o,ix){const s=sin(t*9),s2=sin(t*7);R(ix.armFront,-2.15+.2*s);R(ix.armBack,1.95+.2*sin(t*9+1));R(ix.legFront,-.35+.15*s2);R(ix.legBack,.3+.15*sin(t*7+2));
  R(ix.torso,.02);DY(ix.head,-2);R(ix.head,-.05);R(ix.wind,-.5);SY(ix.cloak,.86+.04*sin(t*11));SX(ix.cloak,1.1)}},
reach:{dur:.3,loop:false,f(t,o,ix){const e=eo(min(1,t/.25));R(ix.armFront,(-1.75+.05*sin(t*3))*e);R(ix.armBack,.25*e);R(ix.torso,.1*e);R(ix.head,-.06*e);R(ix.legFront,-.25*e);R(ix.legBack,.3*e);DY(ix.hip,1.5*e);SY(ix.torso,1+.01*sin(t*TAU/3.4)*o.amp)}},
cheer:{dur:1,f(t,o,ix){const ph=t*TAU*2.2,s=sin(ph);R(ix.armFront,-2.7+.25*s);R(ix.armBack,2.6-.25*s);R(ix.legFront,-.14);R(ix.legBack,.16);DY(ix.hip,-5*abs(s));
  R(ix.head,.06*s);R(ix.torso,.02*s);SY(ix.body,1+.03*cos(ph*2));SX(ix.body,1-.02*cos(ph*2));R(ix.wind,.05*s)}},
kneel:{dur:.35,loop:false,f(t,o,ix){const e=eo(min(1,t/.3)),b=sin(t*TAU/3.4)*o.amp;DY(ix.hip,30*e);R(ix.legBack,1.3*e);R(ix.legFront,-.9*e);R(ix.torso,.12*e);R(ix.head,-.16*e);
  R(ix.armFront,-.55*e);R(ix.armBack,.15*e);SY(ix.torso,1+.015*b);SY(ix.cloak,1-.1*e);SX(ix.cloak,1+.1*e)}}
};

/* ---------- the puppet core ---------- */
/* PAINT.puppet(rig,{tex,x,y,scale,parent,dir,lantern,staff,unit}) -> handle {c,x,y,play,face,set,squash,land,seek,destroy,kind,parts,rig}
   tex = Texture or loaded-art key; with no tex it falls back to PAINT.figure("wanderer"). */
P.puppet=function(rig,opts){opts=opts||{};const T=typeof opts.tex==="string"?P.tex(opts.tex):opts.tex;
  if(!T||!rig||!rig.parts)return P.figure(opts.style||{kind:"wanderer"},opts);
  return core(rig,T,opts,"puppet")};

function core(rig,T,opts,kind){
  const C=PIXI.Container,pn=Object.keys(rig.parts),n=pn.length;
  const c=new C(),flip=new C(),body=new C();c.addChild(flip);flip.addChild(body);
  const unit=opts.unit||rig.scale||1,UK=opts.unitScale!=null?opts.unitScale:unit;
  const order=[],seen={};let guard=0;
  while(order.length<n&&guard++<n+2)for(const k of pn){if(seen[k])continue;const p=rig.parts[k].parent;if(!p||seen[p]||!rig.parts[p]){seen[k]=1;order.push(k)}}
  for(const k of pn)if(!seen[k]){seen[k]=1;order.push(k)}
  const idx={};order.forEach((k,i)=>idx[k]=i);
  const bones=[],par=[],bx=[],by=[],rot0=[],spr=new Uint8Array(n),sa=new Float32Array(n),sv=new Float32Array(n),pr=new Float32Array(n);
  const ks=[],ds=[],gn=[],inr=[],bmap={},texs=[];
  const ox=T.frame?T.frame.x:0,oy=T.frame?T.frame.y:0;
  order.forEach((k,i)=>{const d=rig.parts[k],b=new C();b.sortableChildren=true;b.zIndex=d.z||0;
    const p=d.parent&&idx[d.parent]!=null?idx[d.parent]:-1;par.push(p);
    const pd=p>=0?rig.parts[order[p]]:null,pp=pd&&pd.pivot?pd.pivot:[0,0],at=d.at||[0,0];
    bx.push(at[0]-(p>=0?pp[0]:0));by.push(at[1]-(p>=0?pp[1]:0));b.x=bx[i];b.y=by[i];rot0.push(d.rot0||0);
    if(d.rect){const r=d.rect,pv=d.pivot||[r[2]/2,r[3]/2];
      const tx=new PIXI.Texture({source:T.source,frame:new PIXI.Rectangle(ox+r[0],oy+r[1],r[2],r[3])});texs.push(tx);
      const s=new PIXI.Sprite(tx);s.anchor.set(pv[0]/r[2],pv[1]/r[3]);if(d.tint!=null)s.tint=P.hex(d.tint);b.addChild(s);b._spr=s}
    if(d.hidden)b.visible=false;
    spr[i]=d.spring?1:0;ks.push(d.k||60);ds.push(d.d||5.5);gn.push(d.gain!=null?d.gain:1);inr.push(d.inertia!=null?d.inertia:.5);
    bones.push(b);bmap[k]=b;(p>=0?bones[p]:body).addChild(b);
    if(p<0)b.rotation=rot0[i];else b.rotation=rot0[i];sa[i]=rot0[i]});
  body.sortableChildren=true;
  const ix={body:0,wind:1};const DUM=n+2;for(const k of NAMES)ix[k]=DUM;order.forEach((k,i)=>ix[k]=i+2);
  const SL=(n+3)*5,A=new Float32Array(SL),B=new Float32Array(SL),O=new Float32Array(SL);
  const clips=Object.assign({},CL);if(rig.clips)for(const k in rig.clips){const f=rig.clips[k];clips[k]=typeof f==="function"?{dur:1,f}:f}
  const o={amp:1,sq:1,rm:false,lantern:false,staff:false};
  /* order index -> pose slot is i+2 */
  const reset=a=>{for(let i=0;i<SL;i+=5){a[i]=0;a[i+1]=0;a[i+2]=0;a[i+3]=1;a[i+4]=1}};
  let cur="idle",prev=null,tCur=0,tPrev=0,spCur=1,spPrev=1,blend=1,loop=true,done=false,onend=null,dead=false;
  let flipT=opts.dir<0?-1:1,flipC=flipT,sqS=0,sqV=0,px=NaN,py=0,vxs=0,vys=0,axs=0,kscale=UK,wind=0;
  const base={x:opts.x||0,y:opts.y||0};c.x=base.x;c.y=base.y;c.scale.set(opts.scale||1);
  const hooks=[];
  const apply=(k)=>{kscale=k;body.scale.set(k,k)};apply(UK);
  function setVis(name,v){const b=bmap[name];if(b)b.visible=!!v}
  function tick(dt){if(dead||c.destroyed)return;dt=min(dt,1/20);if(dt<=0)return;
    const rm=P.rm;o.rm=rm;o.amp=rm?.25:1;o.sq=rm?.15:1;
    /* motion of the handle -> wind and spring kicks */
    if(px!==px){px=c.x;py=c.y}
    const vx=(c.x-px)/dt,vy=(c.y-py)/dt;px=c.x;py=c.y;const ox0=vxs;
    vxs+=(vx-vxs)*min(1,dt*8);vys+=(vy-vys)*min(1,dt*8);axs=(vxs-ox0)/dt;
    const dsg=flipT;
    /* clips */
    const cl=clips[cur]||clips.idle;
    tCur+=dt*spCur;if(!loop&&tCur>=cl.dur){tCur=cl.dur;if(!done){done=true;if(onend){const f=onend;onend=null;try{f(h)}catch(e){console.error(e)}}}}
    if(loop&&tCur>3600)tCur-=3600;
    PA=B;reset(B);cl.f(tCur,o,ix,K);let W=B;
    if(blend<1&&prev){blend=min(1,blend+dt/BLEND);tPrev+=dt*spPrev;const pc=clips[prev]||clips.idle;PA=A;reset(A);pc.f(tPrev,o,ix,K);
      const k=eio(blend);for(let i=0;i<SL;i++)O[i]=A[i]+(B[i]-A[i])*k;W=O}
    /* holding items */
    const af=ix.armFront*5;
    if(o.lantern&&ix.armFront!==DUM)W[af]=W[af]*.3-.55;
    if(o.staff&&ix.staff!==DUM&&ix.armFront!==DUM){if(!o.lantern)W[af]=W[af]*.25-.05;W[ix.staff*5]=-W[af]*.9}
    /* wind: clip + movement along the facing direction */
    wind=W[5]+clamp(vxs*dsg/180,-1,1)*.32;
    const wk=rm?.3:1,vst=rm?0:clamp(vys/650,-.2,.2);
    /* body squash spring */
    sqV+=(-220*sqS-11*sqV)*dt;sqS+=sqV*dt;
    const qk=o.sq;
    body.scale.x=kscale*(1+(W[3]-1)*qk+sqS*.2*qk);body.scale.y=kscale*(1+(W[4]-1)*qk-sqS*.28*qk);
    /* flip (turn) */
    if(flipC!==flipT){if(rm)flipC=flipT;else{const d=flipT-flipC,st=14*dt;flipC=abs(d)<=st?flipT:flipC+(d>0?st:-st)}flip.scale.x=flipC}
    for(let i=0;i<n;i++){const q=(i+2)*5,b=bones[i];let r=rot0[i]+W[q];
      if(spr[i]){const p=par[i];const g=gn[i];
        if(p>=0){const pr1=bones[p].rotation,d=pr1-pr[i];pr[i]=pr1;if(!rm)sa[i]-=d*inr[i]}
        if(!rm)sv[i]-=axs*dsg*.0011*g;
        const tg=r+wind*g*wk,a=sa[i],v=sv[i]+(-ks[i]*(a-tg)-ds[i]*sv[i])*dt;let na=a+v*dt;
        if(na>1.9)na=1.9;else if(na<-1.9)na=-1.9;sa[i]=na;sv[i]=v;r=na;
        b.scale.y=W[q+4]*(1-vst*g)}
      else b.scale.y=W[q+4];
      b.rotation=r;b.x=bx[i]+W[q+1];b.y=by[i]+W[q+2];b.scale.x=W[q+3]}
    for(let i=0;i<hooks.length;i++)hooks[i](dt,tCur)}
  const h={c,kind,rig,parts:bmap,get clip(){return cur},
    get x(){return c.x},set x(v){c.x=v},get y(){return c.y},set y(v){c.y=v}};
  /* play(name,{speed,loop,onend,restart}) -> h : blend to a clip over 0.15 s; non-looping clips hold their last pose */
  h.play=function(name,op){op=op||{};const cl=clips[name]||clips.idle;
    if(name===cur&&!op.restart){if(op.speed)spCur=op.speed;if(op.loop!=null)loop=!!op.loop;if(op.onend)onend=op.onend;return h}
    prev=cur;tPrev=tCur;spPrev=spCur;cur=name;tCur=0;spCur=op.speed||1;loop=op.loop!=null?!!op.loop:cl.loop!==false;done=false;onend=op.onend||null;blend=0;return h};
  /* face(dir -1|1) -> h : turn to face left or right (eases through a quick paper-turn; instant under Reduce Motion) */
  h.face=function(d){flipT=d<0?-1:1;if(P.rm){flipC=flipT;flip.scale.x=flipC}return h};
  /* squash(k -1..1) -> h : impulse on the squash spring; k>0 squashes (lands), k<0 stretches; it springs back with a small wobble */
  h.squash=function(k){sqS=clamp(k,-1,1);sqV=0;return h};
  h.land=function(){h.squash(.8);return h};
  /* seek(t) -> h : jump the current clip to t seconds with no blend (tools, tests) */
  h.seek=function(t){tCur=t;blend=1;prev=null;done=false;return h};
  /* set({x,y,scale,dir,speed,lantern,staff,alpha,visible,tint}) -> h */
  h.set=function(s){if(!s)return h;if(s.x!=null)c.x=s.x;if(s.y!=null)c.y=s.y;if(s.scale!=null)c.scale.set(s.scale);if(s.dir!=null)h.face(s.dir);
    if(s.speed!=null)spCur=s.speed;if(s.alpha!=null)c.alpha=s.alpha;if(s.visible!=null)c.visible=!!s.visible;
    if(s.lantern!=null){o.lantern=!!s.lantern;setVis("lantern",o.lantern)}if(s.staff!=null){o.staff=!!s.staff;setVis("staff",o.staff)}
    if(s.tint!=null)for(const b of bones)if(b._spr)b._spr.tint=P.hex(s.tint);return h};
  h.hooks=hooks;
  h.destroy=function(){if(dead)return;dead=true;P.off(tick);if(!c.destroyed)c.destroy({children:true});for(const t of texs)try{t.destroy(false)}catch(e){}};
  tick.dispose=()=>{dead=true};P.on(tick);
  if(opts.parent)opts.parent.addChild(c);
  if(opts.dir<0){flip.scale.x=-1}
  if(opts.lantern)h.set({lantern:true});if(opts.staff)h.set({staff:true});
  /* settle the first pose */
  tick(1/60);
  return h}

/* ---------- FRAMES ---------- */
/* PAINT.frames({tex,cols,rows,count,fps,anchor:[ax,ay],clips:{name:[from,to]},loop},{x,y,scale,parent,dir}) -> handle (same API as puppet) */
P.frames=function(def,opts){def=def||{};opts=opts||{};const T=typeof def.tex==="string"?P.tex(def.tex):def.tex;
  if(!T)return P.figure(def.style||{kind:"wanderer"},opts);
  const cols=def.cols||1,rows=def.rows||1,count=def.count||cols*rows,fps=def.fps||10,an=def.anchor||[.5,1];
  const fr=T.frame,cw=fr.width/cols,ch=fr.height/rows,texs=[];
  for(let i=0;i<count;i++){const cx=i%cols,cy=(i/cols)|0;texs.push(new PIXI.Texture({source:T.source,frame:new PIXI.Rectangle(fr.x+cx*cw,fr.y+cy*ch,cw,ch)}))}
  const clips=Object.assign({idle:[0,count-1]},def.clips||{});
  const c=new PIXI.Container(),flip=new PIXI.Container(),s=new PIXI.Sprite(texs[0]);s.anchor.set(an[0],an[1]);c.addChild(flip);flip.addChild(s);
  c.x=opts.x||0;c.y=opts.y||0;c.scale.set(opts.scale||1);
  let cur="idle",fi=0,speed=1,loop=true,done=false,onend=null,flipT=opts.dir<0?-1:1,flipC=flipT,sqS=0,sqV=0,dead=false,bt=0;flip.scale.x=flipC;
  const h={c,kind:"frames",get clip(){return cur},get x(){return c.x},set x(v){c.x=v},get y(){return c.y},set y(v){c.y=v}};
  function tick(dt){if(dead||c.destroyed)return;dt=min(dt,1/20);const rm=P.rm,cl=clips[cur]||clips.idle,a=cl[0],b=cl[1],len=b-a+1;
    fi+=dt*fps*speed;let k;if(loop)k=((fi%len)+len)%len|0;else{k=min(len-1,fi|0);if(fi>=len-.001&&!done){done=true;if(onend){const f=onend;onend=null;try{f(h)}catch(e){console.error(e)}}}}
    s.texture=texs[a+k];
    bt+=dt;sqV+=(-220*sqS-11*sqV)*dt;sqS+=sqV*dt;const q=rm?.15:1;
    const br=cur==="idle"?(rm?.003:.012)*sin(bt*TAU/3.4):0;
    s.scale.x=1+sqS*.2*q-br*.4;s.scale.y=1-sqS*.28*q+br;
    if(flipC!==flipT){if(rm)flipC=flipT;else{const d=flipT-flipC,st=14*dt;flipC=abs(d)<=st?flipT:flipC+(d>0?st:-st)}flip.scale.x=flipC}}
  h.play=function(name,op){op=op||{};const cl=clips[name]||clips.idle;if(name===cur&&!op.restart){if(op.speed)speed=op.speed;if(op.onend)onend=op.onend;return h}
    cur=name;fi=0;speed=op.speed||1;loop=op.loop!=null?!!op.loop:(name!=="jump"&&name!=="reach"&&name!=="kneel");done=false;onend=op.onend||null;
    if(name==="jump")h.squash(.5);return h};
  h.face=function(d){flipT=d<0?-1:1;if(P.rm){flipC=flipT;flip.scale.x=flipC}return h};
  h.squash=function(k){sqS=clamp(k,-1,1);sqV=0;return h};h.land=function(){return h.squash(.8)};
  h.seek=function(t){fi=t*fps;return h};
  h.set=function(o){if(!o)return h;if(o.x!=null)c.x=o.x;if(o.y!=null)c.y=o.y;if(o.scale!=null)c.scale.set(o.scale);if(o.dir!=null)h.face(o.dir);if(o.speed!=null)speed=o.speed;
    if(o.alpha!=null)c.alpha=o.alpha;if(o.visible!=null)c.visible=!!o.visible;if(o.tint!=null)s.tint=P.hex(o.tint);return h};
  h.destroy=function(){if(dead)return;dead=true;P.off(tick);if(!c.destroyed)c.destroy({children:true});for(const t of texs)try{t.destroy(false)}catch(e){}};
  tick.dispose=()=>{dead=true};P.on(tick);if(opts.parent)opts.parent.addChild(c);return h};

/* ---------- ACTOR ---------- */
/* PAINT.actor({kind:"puppet"|"frames",tex,rig,cols,rows,count,fps,anchor,clips,style},{x,y,scale,parent,dir,lantern,staff}) -> handle; no texture -> code figure */
P.actor=function(def,opts){def=def||{};opts=opts||{};const T=typeof def.tex==="string"?P.tex(def.tex):def.tex;
  if(!T)return P.figure(def.style||def.figure||{kind:"wanderer"},opts);
  if(def.kind==="frames")return P.frames(Object.assign({},def,{tex:T}),opts);
  return P.puppet(def.rig,Object.assign({},opts,{tex:T}))};

/* ---------- FIGURE: code-painted character, same rig/clips as the puppet ---------- */
const rgb=h=>{h=P.hex(h);return[(h>>16)&255,(h>>8)&255,h&255]};
const mix=(a,b,k)=>[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];
const css=(c,a)=>"rgba("+(c[0]|0)+","+(c[1]|0)+","+(c[2]|0)+","+(a==null?1:a)+")";
const INK=[16,9,28],CREAM=[255,242,212];
/* paint a soft-edged, lit, shaded shape. box=[x0,y0,x1,y1] for the gradient; path(g) builds the outline; after(g) runs clipped inside. */
function paintShape(g,box,path,col,o){o=o||{};const x0=box[0],y0=box[1],x1=box[2],y1=box[3],w=x1-x0,h=y1-y0;
  const lit=mix(col,CREAM,.3),dark=mix(col,INK,.5),deep=mix(col,INK,.75);
  g.save();g.shadowColor=css(col,.55);g.shadowBlur=3;path(g);g.fillStyle=css(col);g.fill();g.shadowBlur=0;g.restore();
  g.save();path(g);g.clip();
  let gr=g.createLinearGradient(x0,y0,x1,y0+h*.35);gr.addColorStop(0,css(lit));gr.addColorStop(.4,css(col));gr.addColorStop(1,css(dark));g.fillStyle=gr;g.fillRect(x0-2,y0-2,w+4,h+4);
  gr=g.createLinearGradient(0,y0,0,y1);gr.addColorStop(0,"rgba(255,236,200,.10)");gr.addColorStop(.55,"rgba(0,0,0,0)");gr.addColorStop(1,css(deep,o.bottom!=null?o.bottom:.38));g.fillStyle=gr;g.fillRect(x0-2,y0-2,w+4,h+4);
  const r=P.rng(o.seed||7),nn=o.noise!=null?o.noise:Math.min(220,w*h/60|0);g.lineCap="round";
  for(let i=0;i<nn;i++){const x=x0+r()*w,y=y0+r()*h,l=4+r()*13,a=(o.brush||1.25)+(r()-.5)*.5,dk=r()<.5;
    g.strokeStyle=dk?"rgba(10,4,24,"+(.035+r()*.06)+")":"rgba(255,238,205,"+(.03+r()*.05)+")";g.lineWidth=1+r()*2.6;g.beginPath();g.moveTo(x,y);g.lineTo(x+cos(a)*l,y+sin(a)*l);g.stroke()}
  if(o.after)o.after(g);
  const rim=o.rim||min(10,w*.2);
  gr=g.createLinearGradient(x0+w*.3,0,x1,0);gr.addColorStop(0,css(deep,0));gr.addColorStop(1,css(deep,.8));g.lineWidth=rim;g.strokeStyle=gr;g.lineJoin="round";path(g);g.stroke();
  gr=g.createLinearGradient(x0,0,x0+w*.55,0);gr.addColorStop(0,css(mix(col,CREAM,.62),.8));gr.addColorStop(1,css(CREAM,0));g.lineWidth=3.4;g.strokeStyle=gr;path(g);g.stroke();
  g.restore()}
const stroke=(g,pts,col,a,w)=>{g.beginPath();g.moveTo(pts[0],pts[1]);g.bezierCurveTo(pts[2],pts[3],pts[4],pts[5],pts[6],pts[7]);g.strokeStyle=css(col,a);g.lineWidth=w;g.lineCap="round";g.stroke()};

const FIG={};
const KINDS={
 wanderer:{cloak:"#9B3A52",skin:"#E2B48C",trim:"#F5C66A",head:"hood"},
 thinker:{cloak:"#CDBF9E",skin:"#E0B590",trim:"#8A6A3A",head:"bare"},
 statue:{cloak:"#9A9892",skin:"#A9A59D",trim:"#BDB6A2",head:"hood",rigid:true,noise:420},
 creature:{cloak:"#3E5D4C",skin:"#BFD39A",trim:"#E9C46A",head:"ears"}};

function buildFig(style){
  const kd=KINDS[style.kind]||KINDS.wanderer,pal=Object.assign({},kd,style.palette||{});
  const key="fig|"+(style.kind||"wanderer")+"|"+pal.cloak+"|"+pal.skin+"|"+pal.trim;
  if(FIG[key])return FIG[key];
  const cc=rgb(pal.cloak),sk=rgb(pal.skin),tr=rgb(pal.trim),lining=mix(cc,INK,.4),trimD=mix(tr,INK,.2),leg=mix(cc,INK,.78),boot=mix(cc,INK,.62);
  const nz=kd.noise||0,N=o=>nz?Object.assign({noise:nz},o):o;
  const kind=style.kind||"wanderer",bare=pal.head==="bare",ears=pal.head==="ears";
  const specs=[];
  const S=(name,bw,bh,px,py,draw)=>specs.push({name,bw,bh,px,py,w:bw+PAD*2,h:bh+PAD*2,draw});
  /* torso: robe from shoulders to hem; pivot at hip (38,82) */
  S("torso",76,120,38,82,g=>{const path=g=>{g.beginPath();g.moveTo(28,5);g.bezierCurveTo(30,0,46,0,48,5);g.bezierCurveTo(52,11,66,13,70,25);g.bezierCurveTo(75,52,72,92,76,114);
      g.bezierCurveTo(62,121,52,112,38,119);g.bezierCurveTo(24,124,14,112,0,115);g.bezierCurveTo(4,92,1,52,6,25);g.bezierCurveTo(10,13,24,11,28,5);g.closePath()};
    paintShape(g,[0,0,76,120],path,cc,N({seed:3,after(g){
      stroke(g,[30,34,26,62,22,92,18,116],INK,.28,4.5);stroke(g,[48,36,52,66,58,92,62,116],INK,.3,4);stroke(g,[38,26,37,60,36,90,38,116],CREAM,.1,5);
      stroke(g,[6,60,22,68,54,68,70,60],INK,.62,6);stroke(g,[6,58,22,66,54,66,70,58],CREAM,.1,1.5);
      g.beginPath();g.arc(38,66,3.6,0,TAU);g.fillStyle=css(tr,.95);g.fill();
      stroke(g,[1,113,14,110,24,121,38,116],tr,.9,3.6);stroke(g,[38,116,52,109,62,119,76,112],tr,.9,3.6);
      stroke(g,[24,10,32,18,44,18,52,10],tr,.8,2.6)}}))});
  /* cloak (back piece): pivot at the shoulders (52,8) */
  S("cloak",104,132,52,8,g=>{const path=g=>{g.beginPath();g.moveTo(36,3);g.lineTo(68,3);g.bezierCurveTo(74,40,98,90,104,126);g.bezierCurveTo(88,122,72,134,52,129);g.bezierCurveTo(30,122,18,132,0,126);g.bezierCurveTo(6,90,30,40,36,3);g.closePath()};
    paintShape(g,[0,0,104,132],path,lining,N({seed:5,bottom:.5,after(g){stroke(g,[44,10,34,50,22,90,14,122],INK,.3,5);stroke(g,[60,10,66,50,80,92,88,124],INK,.3,5);stroke(g,[52,12,52,50,52,90,50,126],CREAM,.07,6)}}))});
  /* head: pivot at the neck (28,62) with 8 px of headroom for ears */
  S("head",56,72,28,62,g=>{g.translate(0,8);
    if(bare){const path=g=>{g.beginPath();g.ellipse(28,34,19,22,0,0,TAU)};
      g.save();paintShape(g,[8,12,48,58],g2=>{g2.beginPath();g2.rect(22,48,12,14)},mix(sk,INK,.2),{noise:30});g.restore();
      paintShape(g,[9,12,47,56],path,sk,{seed:9,noise:60,after(g){const r=g.createRadialGradient(40,36,2,40,36,22);r.addColorStop(0,"rgba(30,14,30,.38)");r.addColorStop(1,"rgba(30,14,30,0)");g.fillStyle=r;g.fillRect(0,0,56,70);
        g.beginPath();g.moveTo(6,30);g.bezierCurveTo(6,2,50,0,50,28);g.bezierCurveTo(40,16,20,18,6,30);g.fillStyle=css(mix(tr,INK,.35),.95);g.fill()}})}
    else{const path=g=>{g.beginPath();g.moveTo(46,62);g.bezierCurveTo(55,52,57,31,47,16);g.bezierCurveTo(40,4,24,-1,6,3);g.bezierCurveTo(14,10,10,24,7,40);g.bezierCurveTo(5,50,5,58,3,63);g.bezierCurveTo(18,67,34,67,46,62);g.closePath()};
      if(ears)paintShape(g,[4,-8,52,20],g=>{g.beginPath();g.moveTo(12,12);g.lineTo(6,-8);g.lineTo(26,4);g.moveTo(40,10);g.lineTo(46,-8);g.lineTo(30,4);g.closePath()},cc,{noise:20,rim:4});
      paintShape(g,[2,0,56,66],path,cc,N({seed:11,after(g){stroke(g,[10,20,8,34,8,48,6,62],INK,.3,4)}}));
      g.save();path(g);g.clip();
      let r=g.createRadialGradient(40,38,1,38,36,17);r.addColorStop(0,"rgba(18,9,24,1)");r.addColorStop(.7,"rgba(24,12,30,.96)");r.addColorStop(1,"rgba(24,12,30,.55)");
      g.beginPath();g.ellipse(38,35,11.5,16.5,.08,0,TAU);g.fillStyle=r;g.fill();
      r=g.createRadialGradient(40,46,0,40,46,10);r.addColorStop(0,css(sk,.38));r.addColorStop(1,css(sk,0));g.fillStyle=r;g.fillRect(24,30,28,26);
      g.beginPath();g.ellipse(38,35,11.5,16.5,.08,0,TAU);const lg=g.createLinearGradient(24,0,50,0);lg.addColorStop(0,css(mix(cc,CREAM,.55),.55));lg.addColorStop(.6,css(CREAM,0));g.lineWidth=2.4;g.strokeStyle=lg;g.stroke();
      if(ears){for(const ex of[34,43]){r=g.createRadialGradient(ex,37,0,ex,37,5);r.addColorStop(0,css(mix(tr,CREAM,.5),1));r.addColorStop(1,css(tr,0));g.fillStyle=r;g.fillRect(ex-6,31,12,12)}}
      g.restore()}});
  S("arm",24,64,12,8,g=>{const path=g=>{g.beginPath();g.moveTo(4,8);g.bezierCurveTo(4,0,19,0,19,8);g.bezierCurveTo(20,24,21,36,23,48);g.bezierCurveTo(14,53,8,53,0,48);g.bezierCurveTo(2,36,3,24,4,8);g.closePath()};
    paintShape(g,[0,0,24,56],path,mix(cc,CREAM,.04),N({seed:13,brush:1.5,after(g){stroke(g,[1,46,8,49,16,49,23,46],tr,.95,3.2)}}));
    paintShape(g,[6,50,17,62],g=>{g.beginPath();g.ellipse(11.5,55.5,4.6,5.6,0,0,TAU)},sk,{noise:6,rim:3,seed:2})});
  S("leg",26,64,11,4,g=>{const path=g=>{g.beginPath();g.moveTo(5,0);g.lineTo(18,0);g.bezierCurveTo(18,16,17,30,16.5,43);g.bezierCurveTo(19,46,20,50,26,59);g.bezierCurveTo(26,63,24,64,20,64);g.lineTo(3,64);g.bezierCurveTo(3,56,4,50,5,44);g.bezierCurveTo(6,30,5,16,5,0);g.closePath()};
    paintShape(g,[0,0,26,64],path,leg,N({seed:17,noise:50,after(g){g.fillStyle=css(boot,.95);g.fillRect(0,45,30,22);stroke(g,[3,45,9,48,14,48,19,44],tr,.8,2.2);stroke(g,[3,62,10,62,18,62,24,62],INK,.7,2.4)}}))});
  S("lantern",22,40,11,2,g=>{g.beginPath();g.moveTo(11,0);g.lineTo(11,10);g.strokeStyle=css(trimD,.95);g.lineWidth=1.4;g.stroke();
    let r=g.createRadialGradient(11,22,0,11,22,13);r.addColorStop(0,"rgba(255,246,200,1)");r.addColorStop(.45,"rgba(255,206,110,.95)");r.addColorStop(1,"rgba(235,150,50,.85)");
    g.beginPath();g.roundRect?g.roundRect(4.5,11,13,22,3):g.rect(4.5,11,13,22);g.fillStyle=r;g.fill();g.strokeStyle=css(trimD,1);g.lineWidth=2;g.stroke();
    g.beginPath();g.moveTo(11,6);g.lineTo(4,12);g.lineTo(18,12);g.closePath();g.fillStyle=css(trimD,1);g.fill();
    g.beginPath();g.rect(5.5,32,11,3);g.fill();g.beginPath();g.moveTo(11,11);g.lineTo(11,33);g.lineWidth=1.2;g.strokeStyle=css(trimD,.8);g.stroke()});
  S("scarf",54,26,50,10,g=>{const path=g=>{g.beginPath();g.moveTo(52,4);g.bezierCurveTo(38,2,20,8,3,12);g.lineTo(10,17);g.lineTo(2,24);g.bezierCurveTo(20,23,38,19,52,18);g.closePath()};
    paintShape(g,[0,0,54,26],path,tr,{seed:19,noise:40,rim:5,after(g){stroke(g,[48,10,34,10,18,14,6,18],INK,.2,3)}})});
  S("staff",12,164,6,102,g=>{paintShape(g,[2,0,10,164],g=>{g.beginPath();g.moveTo(4,4);g.lineTo(8,4);g.lineTo(8.8,162);g.lineTo(3.2,162);g.closePath()},[104,72,46],{seed:23,noise:60,rim:4});
    g.beginPath();g.arc(6,5,4.2,0,TAU);g.fillStyle=css(tr,1);g.fill();g.strokeStyle=css(trimD,1);g.lineWidth=1.2;g.stroke()});
  /* pack */
  let x=0,y=0,rowH=0;const maxW=440;
  for(const s of specs){if(x+s.w>maxW){x=0;y+=rowH+2;rowH=0}s.x=x;s.y=y;x+=s.w+2;rowH=max(rowH,s.h)}
  const SW=maxW,SH=y+rowH+2;
  const tex=P.make(key,SW*RES,SH*RES,(g)=>{for(const s of specs){g.save();g.beginPath();g.rect(s.x*RES,s.y*RES,s.w*RES,s.h*RES);g.clip();g.translate((s.x+PAD)*RES,(s.y+PAD)*RES);g.scale(RES,RES);s.draw(g);g.restore()}});
  const M={};for(const s of specs)M[s.name]=s;
  const rect=n=>{const s=M[n];return[s.x*RES,s.y*RES,s.w*RES,s.h*RES]},pv=n=>{const s=M[n];return[(s.px+PAD)*RES,(s.py+PAD)*RES]},at=(n,ax,ay)=>[(ax+PAD)*RES,(ay+PAD)*RES];
  const sp=!kd.rigid,hp=bare?4:0;
  const parts={
    hip:{parent:null,at:[0,-60*RES]},
    legBack:{rect:rect("leg"),pivot:pv("leg"),parent:"hip",at:[-9*RES,0],z:0,tint:0xB0A0B8},
    legFront:{rect:rect("leg"),pivot:pv("leg"),parent:"hip",at:[9*RES,0],z:0},
    torso:{rect:rect("torso"),pivot:pv("torso"),parent:"hip",at:[0,0],z:1},
    cloak:{rect:rect("cloak"),pivot:pv("cloak"),parent:"torso",at:at("torso",38,14),z:-3,spring:sp,k:55,d:6,gain:kind==="thinker"?.5:1,inertia:.55},
    armBack:{rect:rect("arm"),pivot:pv("arm"),parent:"torso",at:at("torso",9,24),z:-1,tint:0xBBAAC4,spring:false},
    head:{rect:rect("head"),pivot:pv("head"),parent:"torso",at:at("torso",38,8),z:1},
    scarf:{rect:rect("scarf"),pivot:pv("scarf"),parent:"head",at:at("head",21,52+8),z:-1,rot0:-.3,spring:sp&&!bare,k:60,d:5,gain:1.5,inertia:.4},
    armFront:{rect:rect("arm"),pivot:pv("arm"),parent:"torso",at:at("torso",65,24),z:2},
    lantern:{rect:rect("lantern"),pivot:pv("lantern"),parent:"armFront",at:at("arm",11.5,56),z:1,hidden:true,spring:sp,k:48,d:3.2,gain:.18,inertia:.9},
    staff:{rect:rect("staff"),pivot:pv("staff"),parent:"armFront",at:at("arm",11.5,55),z:2,hidden:true}};
  if(kind==="creature"){parts.scarf.hidden=true}
  const out=FIG[key]={tex,rig:{parts,scale:1},pal};return out}

/* PAINT.figure({kind:"wanderer"|"thinker"|"statue"|"creature",palette:{cloak,skin,trim},height},{x,y,scale,parent,dir,lantern,staff}) -> handle (puppet API) painted by code.
   Fallback Wanderer parts: hip(bone) legBack legFront torso cloak armBack head scarf armFront lantern staff. Default height 90 units. */
P.figure=function(style,opts){style=style||{};opts=opts||{};const f=buildFig(style),ht=style.height||90;
  const h=core(f.rig,f.tex,Object.assign({},opts,{unitScale:ht/NOM/RES}),"figure");
  h.style=style;
  const lb=h.parts.lantern;
  if(lb){const gt=P.radial("pt-glow",128,[[0,"rgba(255,226,150,.85)"],[.35,"rgba(255,190,90,.34)"],[1,"rgba(255,170,60,0)"]]);
    const gs=new PIXI.Sprite(gt);gs.anchor.set(.5);gs.blendMode="add";gs.width=gs.height=300;gs.y=22*RES;gs.zIndex=3;lb.addChild(gs);
    h.hooks.push((dt,t)=>{const k=P.rm?.02:.1;gs.alpha=.85+k*sin(t*7.3)+k*.6*sin(t*13.1+1);const s=300*(1+.03*sin(t*5.1)*(P.rm?.2:1));gs.width=gs.height=s})}
  return h};
})();

/* ==== 50-input.js ==== */
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
