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
