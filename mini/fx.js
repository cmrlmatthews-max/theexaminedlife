/* The Examined Life: mini-game toolkit (Phase 29). Loaded after the page's main script, before the land files.
   The stage canvas is 384 x 640 pixels, drawn with a 2x transform, so games work in 192 x 320 units (1 unit = 2 pixels).
   Art (MINI_ART[id]) loads lazily; every draw helper returns false until its image has loaded, so games can draw a fallback.

   Art      mBg(c,id,i,a) · mPiece(c,id,name,x,y,o) · mPerson(c,id,name,x,y,o) · mArtOk(id) · hs(v) · mTint(id,name,col,a,op) + mCanvas(c,cv,x,y,o)
            o: {ax,ay (anchor 0..1, default 0,0), flip, a (alpha), sc (scale), rot (radians), comp, sm (smooth when scaling or rotating)}
   Light    glow(c,x,y,r,col,a) · shaft(c,x,y,len,w,ang,col,a) · grade(c,col,a,op) · vignette(c,a)
   Motion   E.out/inOut/back/sine · lerp · clamp · shakeSet(s,amt) · shakeApply(c,s) · hitstop(s,sec)
   Particles pfx() · pAdd(P,p) · pStep(P,dt) · pDraw(c,P,id) · pRain · pSparks · pDust · pMotes · pFireflies · shatter(P,id,name,x,y,n)
   Drawing  wave(c,x,y,w,amp,cyc,ph,jag,col,lw) · rope(c,x1,y1,x2,y2,sag,col,lw) · ring(c,x,y,r,k,col,lw) · meter(c,x,y,w,h,k,col) · mShadow(c,x,y,w,a) · mText(c,t,x,y,px,col,al)
   Reduce Motion: games check s.rm. shakeApply does nothing, particles thin out (pStep keeps at most 24), glow still works (it isn't motion). */

const hs=v=>Math.round(v*2)/2;
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const E={out:t=>1-(1-t)*(1-t),in:t=>t*t,inOut:t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,sine:t=>.5-.5*Math.cos(Math.PI*t),
  back:t=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)},
  bounce:t=>{const n=7.5625,d=2.75;if(t<1/d)return n*t*t;if(t<2/d)return n*(t-=1.5/d)*t+.75;if(t<2.5/d)return n*(t-=2.25/d)*t+.9375;return n*(t-=2.625/d)*t+.984375}};

/* ---- art ---- */
function mArtOk(id){const A=MINI_ART[id];if(!A)return false;const e=mImgE(A.atlas);return !!(e&&e.ok)}
function mBg(c,id,i,a){const A=MINI_ART[id];if(!A||!A.bg||!A.bg[i])return false;const e=mImgE(A.bg[i]);if(!e||!e.ok)return false;
  if(a!=null&&a<=0)return true;const ga=c.globalAlpha;if(a!=null)c.globalAlpha=ga*a;c.drawImage(e.img,0,0,192,320);c.globalAlpha=ga;return true}
function mDraw(c,img,r,x,y,w,h,o){o=o||{};const ax=o.ax||0,ay=o.ay||0,sc=o.sc==null?1:o.sc;
  if(o.a!=null&&o.a<=0)return;const ga=c.globalAlpha,gc=c.globalCompositeOperation;
  if(!o.rot&&!o.flip&&sc===1){if(o.a!=null)c.globalAlpha=ga*o.a;if(o.comp)c.globalCompositeOperation=o.comp;c.drawImage(img,r[0],r[1],r[2],r[3],hs(x-ax*w),hs(y-ay*h),w,h);c.globalAlpha=ga;c.globalCompositeOperation=gc;return}
  c.save();if(o.sm){c.imageSmoothingEnabled=true;c.imageSmoothingQuality="high"}if(o.a!=null)c.globalAlpha=ga*o.a;if(o.comp)c.globalCompositeOperation=o.comp;c.translate(x,y);if(o.rot)c.rotate(o.rot);c.scale(sc*(o.flip?-1:1),sc);
  c.drawImage(img,r[0],r[1],r[2],r[3],-ax*w,-ay*h,w,h);c.restore()}
/* a piece of the game's own atlas, at native detail: a 64-pixel sprite covers 32 units */
function mPiece(c,id,name,x,y,o){const A=MINI_ART[id];if(!A||!A.rects)return false;const r=A.rects[name];if(!r)return false;const e=mImgE(A.atlas);if(!e||!e.ok)return false;
  mDraw(c,e.img,r,x,y,r[2]/2,r[3]/2,o);return true}
/* a tinted copy of a piece (gilding, a warm wash), cached per piece and color; null until the atlas has loaded. mCanvas draws it like mPiece. */
const MTINT={};
function mTint(id,name,col,a,op){const A=MINI_ART[id],r=A&&A.rects&&A.rects[name];if(!r)return null;const e=mImgE(A.atlas);if(!e||!e.ok)return null;
  const k=A.atlas+"|"+name+"|"+col+"|"+a+"|"+(op||"");if(MTINT[k])return MTINT[k];const cv=document.createElement("canvas");cv.width=r[2];cv.height=r[3];const c=cv.getContext("2d");
  c.drawImage(e.img,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);c.globalCompositeOperation=op||"source-atop";c.globalAlpha=a;c.fillStyle=col;c.fillRect(0,0,r[2],r[3]);
  if(op&&op!=="source-atop"){c.globalCompositeOperation="destination-in";c.globalAlpha=1;c.drawImage(e.img,r[0],r[1],r[2],r[3],0,0,r[2],r[3])}return MTINT[k]=cv}
function mCanvas(c,cv,x,y,o){if(!cv)return false;mDraw(c,cv,[0,0,cv.width,cv.height],x,y,cv.width/2,cv.height/2,o);return true}
function mPieceSize(id,name){const A=MINI_ART[id],r=A&&A.rects&&A.rects[name];return r?[r[2]/2,r[3]/2]:[0,0]}
/* a map-scale person (A8): 1 sprite pixel = 1 unit, like the map's own characters */
function mPerson(c,id,name,x,y,o){const A=MINI_ART[id];if(!A||!A.prects)return false;const r=A.prects[name];if(!r)return false;const e=mImgE(A.people);if(!e||!e.ok)return false;
  mDraw(c,e.img,r,x,y,r[2],r[3],o);return true}
function mSprO(c,name,x,y,o){const e=ATLAS_IMG.chars,A=ATLAS.chars;if(!e||!e.ok||!A)return false;const r=A.rects[name];if(!r)return false;mDraw(c,e.img,r,x,y,r[2],r[3],o);return true}

/* ---- light ---- */
function glow(c,x,y,r,col,a){if(!(a>0)||r<=0)return;c.save();c.globalCompositeOperation="lighter";c.globalAlpha=Math.min(1,a);
  const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.restore()}
function shaft(c,x,y,len,w,ang,col,a){if(!(a>0))return;c.save();c.globalCompositeOperation="lighter";c.globalAlpha=Math.min(1,a);c.translate(x,y);c.rotate(ang);
  const g=c.createLinearGradient(0,0,0,len);g.addColorStop(0,col);g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;
  c.beginPath();c.moveTo(-w*.25,0);c.lineTo(w*.25,0);c.lineTo(w*.5,len);c.lineTo(-w*.5,len);c.closePath();c.fill();c.restore()}
function grade(c,col,a,op){if(!(a>0))return;c.save();c.globalAlpha=Math.min(1,a);c.globalCompositeOperation=op||"source-over";c.fillStyle=col;c.fillRect(0,0,192,320);c.restore()}
function vignette(c,a){if(!(a>0))return;c.save();const g=c.createRadialGradient(96,150,60,96,160,210);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,`rgba(8,5,14,${a})`);c.fillStyle=g;c.fillRect(0,0,192,320);c.restore()}

/* ---- motion ---- */
function shakeSet(s,amt){if(!s.rm)s.shk=Math.max(s.shk||0,amt)}
function shakeApply(c,s,dt){if(s.rm||!(s.shk>0.05)){s.shk=0;return}c.translate((Math.random()-.5)*s.shk,(Math.random()-.5)*s.shk);s.shk*=.86}
function hitstop(s,sec){s.hs=Math.max(s.hs||0,sec)}

/* ---- particles ---- */
function pfx(){return {list:[]}}
function pAdd(P,p){if(P.list.length<300){p.t=0;p.life=p.life||1;P.list.push(p)}return p}
function pStep(P,dt,rm){const L=P.list;for(let i=L.length-1;i>=0;i--){const p=L[i];p.t+=dt;if(p.t>=p.life){L.splice(i,1);continue}
    if(p.g)p.vy+=p.g*dt;if(p.drag){const k=Math.pow(p.drag,dt*60);p.vx*=k;p.vy*=k}p.x+=(p.vx||0)*dt;p.y+=(p.vy||0)*dt;if(p.vr)p.r=(p.r||0)+p.vr*dt;
    if(p.wob){p.x+=Math.sin((p.t+(p.ph||0))*p.wob)*.2}}
  if(rm&&L.length>24)L.splice(0,L.length-24)}
function pDraw(c,P,id){for(const p of P.list){const k=p.t/p.life,a=(p.fade===false?1:p.fin?Math.min(1,p.t/p.fin)*(1-Math.max(0,(k-.7)/.3)):1-k)*(p.a==null?1:p.a);if(a<=0)continue;
    if(p.k==="glow"){glow(c,p.x,p.y,p.s,p.col,a);continue}
    c.globalAlpha=a;
    if(p.k==="line"){c.strokeStyle=p.col;c.lineWidth=p.w||.5;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x-(p.vx||0)*.02,p.y-(p.vy||0)*.03);c.stroke()}
    else if(p.k==="chunk"){const e=mImgE(p.img);if(e&&e.ok){c.save();c.translate(p.x,p.y);c.rotate(p.r||0);c.drawImage(e.img,p.sx,p.sy,p.sw,p.sh,-p.sw/4,-p.sh/4,p.sw/2,p.sh/2);c.restore()}}
    else if(p.k==="piece"){mPiece(c,id,p.name,p.x,p.y,{ax:.5,ay:.5,rot:p.r||0,sc:p.sc||1})}
    else{c.fillStyle=p.col;const s=p.s||1;c.fillRect(hs(p.x-s/2),hs(p.y-s/2),s,s)}}
  c.globalAlpha=1}
function pRain(P,n,col,wind){for(let i=0;i<n;i++)pAdd(P,{k:"line",x:Math.random()*220-14,y:-10-Math.random()*40,vx:(wind||-40),vy:260+Math.random()*80,life:1.6,col:col||"rgba(180,170,210,.55)",w:.5,fade:false})}
function pSparks(P,x,y,n,col,sp){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=(sp||40)*(.4+Math.random());pAdd(P,{x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-10,g:60,drag:.94,life:.5+Math.random()*.5,col:col||"#F5C66A",s:1+Math.random()})}}
function pDust(P,x,y,n,col){for(let i=0;i<n;i++)pAdd(P,{x:x+(Math.random()-.5)*8,y,vx:(Math.random()-.5)*30,vy:-Math.random()*16,g:10,drag:.96,life:.8+Math.random()*.6,col:col||"rgba(200,190,180,.7)",s:1.5+Math.random()*1.5})}
function pMotes(P,n,col,box){box=box||[0,0,192,320];for(let i=0;i<n;i++)pAdd(P,{x:box[0]+Math.random()*box[2],y:box[1]+Math.random()*box[3],vx:(Math.random()-.5)*4,vy:-3-Math.random()*6,life:2+Math.random()*2,fin:.5,col:col||"#FFE3A0",s:1,wob:2,ph:Math.random()*9})}
function pFireflies(P,x,y,n,sp){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=(sp||14)*(.3+Math.random());pAdd(P,{k:"glow",x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-6,drag:.985,life:2.2+Math.random()*1.6,fin:.3,col:"rgba(255,214,110,.9)",s:3+Math.random()*2,wob:3,ph:Math.random()*9})}}
/* break an atlas piece into falling chunks (hollow idols, cage bars) */
function shatter(P,id,name,x,y,n,rm){const A=MINI_ART[id],r=A&&A.rects&&A.rects[name];if(!r)return;const cols=Math.max(2,Math.round(Math.sqrt(n||9))),rows=cols;
  const w=r[2]/cols,h=r[3]/rows;for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const cx=x-r[2]/4+(i+.5)*w/2,cy=y-r[3]/2+(j+.5)*h/2;
    pAdd(P,{k:"chunk",img:A.atlas,sx:r[0]+i*w,sy:r[1]+j*h,sw:w,sh:h,x:cx,y:cy,vx:(cx-x)*(rm?0:2.2)+(Math.random()-.5)*10,vy:rm?30:-20-Math.random()*30,g:rm?0:260,vr:rm?0:(Math.random()-.5)*6,life:rm?.6:1.1,fade:true})}}

/* ---- drawing ---- */
function wave(c,x,y,w,amp,cyc,ph,jag,col,lw){c.save();c.strokeStyle=col;c.lineWidth=lw||1;c.beginPath();const n=Math.max(12,Math.round(w));
  for(let i=0;i<=n;i++){const u=i/n,env=Math.sin(Math.PI*u),j=jag?((Math.sin(i*12.9898+ph*3.1)*43758.5453)%1)*jag:0;const yy=y+Math.sin(u*cyc*Math.PI*2+ph)*amp*env+j*env;if(i)c.lineTo(x+u*w,yy);else c.moveTo(x,yy)}
  c.stroke();c.restore()}
function rope(c,x1,y1,x2,y2,sag,col,lw){c.save();c.strokeStyle=col;c.lineWidth=lw||1;c.beginPath();c.moveTo(x1,y1);c.quadraticCurveTo((x1+x2)/2,(y1+y2)/2+sag,x2,y2);c.stroke();c.restore()}
function ring(c,x,y,r,k,col,lw){if(k<=0)return;c.save();c.strokeStyle=col;c.lineWidth=lw||1.5;c.beginPath();c.arc(x,y,r,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,k));c.stroke();c.restore()}
function meter(c,x,y,w,h,k,col){c.save();c.fillStyle="#100B15";c.fillRect(x-1,y-1,w+2,h+2);c.fillStyle="#2A2036";c.fillRect(x,y,w,h);
  const fw=Math.round(w*clamp(k,0,1)*2)/2;if(fw>0){const g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#FFE9A8");g.addColorStop(1,col||"#D9A93A");c.fillStyle=g;c.fillRect(x,y,fw,h)}
  c.fillStyle="rgba(255,255,255,.18)";c.fillRect(x,y,w,.5);c.restore()}
function mShadow(c,x,y,w,a){c.save();c.globalAlpha=a==null?.35:a;c.fillStyle="#05030A";c.beginPath();c.ellipse(x,y,w/2,w/6,0,0,Math.PI*2);c.fill();c.restore()}
function mText(c,t,x,y,px,col,al){c.save();c.font=`${px||8}px "IM Fell English SC",Georgia,serif`;c.textAlign=al||"center";c.textBaseline="middle";c.fillStyle="rgba(8,5,14,.7)";c.fillText(t,x+.5,y+.5);c.fillStyle=col||"#FFE9B8";c.fillText(t,x,y);c.restore()}
/* ---- Plan 5 (Phase 38): named grades, artifact icons, and six input helpers for the short games ----
   gradeN(c,name,a)                 a named wash: GRADES = dawn, day, dusk, night, storm, grey, warm, cool
   mArtIcon(c,k,x,y,scale,o)        an artifact's map sprite (ARTI item k) at a whole scale; x,y = top-left in units; 16 x 16 units at scale 1 (1 sprite pixel = 1 unit, like the map).
                                    o: {sil:'#col' (a flat silhouette), rim:'#col' (a 1-pixel rim around it), a (alpha)}. mArtIconCanvas(k,scale,o) gives the cached canvas.
   Every helper is a small state object: make it in init, call its step in step. Each works with touch, the pad and the keys, and does nothing with no input.
   mDrag({pieces:[{id,x,y,w,h}], spots:[{id,x,y,r}], onDrop(piece,spot|null), speed=70, back=true, snap=true})
        → {step(dt,inp) → {piece,spot}|null, held, over, cur:{x,y}, pieces, spots, drawCursor(c)}   piece x,y = centre; A picks up the piece under the cursor and drops it
   mHold({dur, onFull(), onRelease(k), drain=0})  → {step(dt,inp,active) → 'full'|'release'|null, k, held, draw(c,x,y,r,col)}   active defaults to A held or a finger down
   mLanes({xs, hitY, speed, win, keys})  → {add(lane,t,kind), step(dt,inp) → {hits:[{note,lane,err}], misses:[note], wrong:[lane]}, draw(c,fnNote), t, notes}
        t = the lanes' own clock (seconds); a note reaches hitY at its t. Lanes map to ←,↑,→ (two lanes: ←,→); a tap picks the nearest lane; A hits the nearest note in any lane.
   mPath({pts:[[x,y],…], tol, speed=60})  → {step(dt,inp) → {u, off, pace, done}, drawGuide(c,col), drawDone(c,col), pen, len}
        u = 0..1 traced; off = the pen is farther than tol from the path; pace = units per second along the path in this frame. A finger leads the pen; the pad or A walks it along the path.
   mFlow({path:[[x,y],…] | dir:[dx,dy], speed, onExit(obj), bounds:[x,y,w,h]}) → {spawn(obj), step(dt), each(fn), remove(obj), list}   obj.d = distance travelled; obj.sp scales its speed
   mPick({items:[{x,y,w,h}], sel=0})  → {step(dt,inp) → index|-1, draw(c,fnItem(c,item,i,isSel)), sel}   ←/→ (and ↑/↓) move, A chooses, a tap chooses */
const GRADES={dawn:["#F2A86B","soft-light"],day:["#FFF1C8","soft-light"],dusk:["#7A3F6A","multiply"],night:["#1A2246","multiply"],storm:["#2A3340","multiply"],grey:["#80808A","saturation"],warm:["#F5C66A","overlay"],cool:["#5F8FB8","overlay"]};
function gradeN(c,name,a){const g=GRADES[name];if(!g)return false;grade(c,g[0],a==null?.35:a,g[1]);return true}
const MICON={};
function mArtIconCanvas(k,scale,o){o=o||{};scale=Math.max(1,Math.round(scale||1));const key=k+"|"+scale+"|"+(o.sil||"")+"|"+(o.rim||"");if(MICON[key])return MICON[key];
  if(typeof mArt!=="function")return null;const pad=o.rim?1:0,b=document.createElement("canvas");b.width=b.height=16;const bc=b.getContext("2d");
  try{mArt(bc,k,0,0,0)}catch(e){return null}
  const cv=document.createElement("canvas");cv.width=cv.height=16*scale+pad*2;const c=cv.getContext("2d");c.imageSmoothingEnabled=false;
  if(o.rim){const r=document.createElement("canvas");r.width=r.height=16*scale;const rc=r.getContext("2d");rc.imageSmoothingEnabled=false;rc.drawImage(b,0,0,16*scale,16*scale);rc.globalCompositeOperation="source-in";rc.fillStyle=o.rim;rc.fillRect(0,0,r.width,r.height);
    for(const[dx,dy]of[[0,1],[2,1],[1,0],[1,2]])c.drawImage(r,dx,dy)}
  if(o.sil){const r=document.createElement("canvas");r.width=r.height=16*scale;const rc=r.getContext("2d");rc.imageSmoothingEnabled=false;rc.drawImage(b,0,0,16*scale,16*scale);rc.globalCompositeOperation="source-in";rc.fillStyle=o.sil;rc.fillRect(0,0,r.width,r.height);c.drawImage(r,pad,pad)}
  else c.drawImage(b,0,0,16,16,pad,pad,16*scale,16*scale);
  return MICON[key]=cv}
function mArtIcon(c,k,x,y,scale,o){const cv=mArtIconCanvas(k,scale,o);if(!cv)return false;const ga=c.globalAlpha,sm=c.imageSmoothingEnabled;c.imageSmoothingEnabled=false;if(o&&o.a!=null)c.globalAlpha=ga*o.a;
  const pad=o&&o.rim?1:0;c.drawImage(cv,hs(x)-pad,hs(y)-pad,cv.width,cv.height);c.globalAlpha=ga;c.imageSmoothingEnabled=sm;return true}
/* where a finger is now (a held pointer, else this frame's tap), or null */
function mFinger(inp){return inp.down?{x:inp.down.x,y:inp.down.y}:(inp.tap?{x:inp.tap.x,y:inp.tap.y}:null)}
function mDrag(o){const D={pieces:o.pieces||[],spots:o.spots||[],held:null,over:null,cur:{x:96,y:200},touch:false,speed:o.speed||70};
  D.pieces.forEach(p=>{if(p.x0==null){p.x0=p.x;p.y0=p.y}});
  const inside=(p,x,y,m)=>Math.abs(x-p.x)<=p.w/2+(m||0)&&Math.abs(y-p.y)<=p.h/2+(m||0);
  const pieceAt=(x,y,m)=>{let best=null,bd=1e9;for(const p of D.pieces){if(p.fixed)continue;if(inside(p,x,y,m)){const d=Math.hypot(p.x-x,p.y-y);if(d<bd){bd=d;best=p}}}return best};
  const spotAt=(x,y)=>{let best=null,bd=1e9;for(const s of D.spots){const d=Math.hypot(s.x-x,s.y-y);if(d<=s.r&&d<bd){bd=d;best=s}}return best};
  const drop=()=>{const p=D.held,sp=spotAt(p.x,p.y);D.held=null;D.over=null;
    if(sp&&o.snap!==false){p.x=sp.x;p.y=sp.y}else if(!sp&&o.back!==false){p.x=p.x0;p.y=p.y0}
    if(o.onDrop)o.onDrop(p,sp||null);return {piece:p,spot:sp||null}};
  D.step=(dt,inp)=>{let ev=null;const f=inp.down;
    if(inp.dx||inp.dy){D.cur.x=clamp(D.cur.x+inp.dx*D.speed*dt,0,192);D.cur.y=clamp(D.cur.y+inp.dy*D.speed*dt,0,320);if(D.held&&!D.touch){D.held.x=D.cur.x;D.held.y=D.cur.y}}
    if(f){if(!D.held&&!D._was){const p=pieceAt(f.x,f.y,4);if(p){D.held=p;D.touch=true;D.offx=p.x-f.x;D.offy=p.y-f.y}} /* only a touch that starts on a piece picks it up */
      if(D.held&&D.touch){D.held.x=clamp(f.x+D.offx,0,192);D.held.y=clamp(f.y+D.offy,0,320);D.cur.x=D.held.x;D.cur.y=D.held.y}}
    else if(D.held&&D.touch){D.touch=false;ev=drop()}
    D._was=!!f;
    if(inp.aTap&&!D.touch){if(D.held)ev=drop();else{const p=pieceAt(D.cur.x,D.cur.y,8);if(p){D.held=p;D.touch=false;p.x=D.cur.x;p.y=D.cur.y}}}
    D.over=D.held?spotAt(D.held.x,D.held.y):null;return ev};
  D.drawCursor=(c,col)=>{if(D.touch)return;c.save();c.strokeStyle=col||"#F5C66A";c.lineWidth=1;const x=hs(D.cur.x),y=hs(D.cur.y);c.beginPath();c.moveTo(x-5,y);c.lineTo(x-2,y);c.moveTo(x+2,y);c.lineTo(x+5,y);c.moveTo(x,y-5);c.lineTo(x,y-2);c.moveTo(x,y+2);c.lineTo(x,y+5);c.stroke();c.restore()};
  return D}
function mHold(o){const H={k:0,held:false,full:false,dur:o.dur||1};
  H.step=(dt,inp,active)=>{const on=active==null?!!(inp.a||inp.down):!!active;let ev=null;
    if(on){H.held=true;if(!H.full){H.k=Math.min(1,H.k+dt/H.dur);if(H.k>=1){H.full=true;ev="full";if(o.onFull)o.onFull()}}}
    else{if(H.held){H.held=false;ev="release";if(o.onRelease)o.onRelease(H.k);H.full=false;if(!o.drain)H.k=0}
      if(o.drain&&H.k>0)H.k=Math.max(0,H.k-dt*o.drain)}
    return ev};
  H.draw=(c,x,y,r,col)=>{c.save();c.globalAlpha=.35;c.strokeStyle="#100B15";c.lineWidth=2.5;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.stroke();c.restore();ring(c,x,y,r,H.k,col||"#F5C66A",2)};
  return H}
function mLanes(o){const L={xs:o.xs||[56,96,136],hitY:o.hitY||250,speed:o.speed||80,win:o.win||.18,notes:[],t:0};
  const n=L.xs.length,keys=o.keys||(n===2?["l","r"]:n===3?["l","u","r"]:["l","u","r","d"].slice(0,n));
  L.add=(lane,t,kind)=>{const no={lane,t,kind:kind||0,hit:false,miss:false};L.notes.push(no);return no};
  L.yOf=no=>L.hitY-(no.t-L.t)*L.speed;
  const near=(lane)=>{let best=null,be=1e9;for(const no of L.notes){if(no.hit||no.miss||(lane!=null&&no.lane!==lane))continue;const e=Math.abs(no.t-L.t);if(e<=L.win&&e<be){be=e;best=no}}return best};
  L.step=(dt,inp)=>{L.t+=dt;const out={hits:[],misses:[],wrong:[]};const press=[];
    const k={l:inp.lTap,r:inp.rTap,u:inp.uTap,d:inp.dTap};keys.forEach((q,i)=>{if(k[q])press.push(i)});
    for(const tp of inp.taps||[]){let bi=0,bd=1e9;L.xs.forEach((x,i)=>{const d=Math.abs(tp.x-x);if(d<bd){bd=d;bi=i}});press.push(bi)}
    if(inp.aTap){const no=near(null);if(no)press.push(no.lane);else out.wrong.push(-1)}
    for(const ln of press){const no=near(ln);if(no){no.hit=true;out.hits.push({note:no,lane:ln,err:no.t-L.t})}else out.wrong.push(ln)}
    for(const no of L.notes)if(!no.hit&&!no.miss&&L.t-no.t>L.win){no.miss=true;out.misses.push(no)}
    L.notes=L.notes.filter(no=>!(no.hit||no.miss)||L.t-no.t<1);return out};
  L.draw=(c,fn)=>{c.save();c.strokeStyle="rgba(255,233,184,.18)";c.lineWidth=1;for(const x of L.xs){c.beginPath();c.moveTo(x,0);c.lineTo(x,320);c.stroke()}
    c.strokeStyle="rgba(245,198,106,.7)";c.beginPath();c.moveTo(L.xs[0]-16,L.hitY);c.lineTo(L.xs[n-1]+16,L.hitY);c.stroke();c.restore();
    for(const no of L.notes){if(no.hit||no.miss)continue;const y=L.yOf(no);if(y<-12||y>332)continue;const x=L.xs[no.lane];if(fn){fn(c,no,x,y);continue}
      c.save();c.fillStyle=no.kind?"#9FE0FF":"#F5C66A";c.strokeStyle="#100B15";c.beginPath();if(no.kind){c.moveTo(x,y-5);c.lineTo(x+5,y);c.lineTo(x,y+5);c.lineTo(x-5,y);c.closePath()}else c.arc(x,y,4.5,0,Math.PI*2);c.fill();c.stroke();c.restore()}};
  return L}
function mPath(o){const P={pts:o.pts||[[20,160],[172,160]],tol:o.tol||10,speed:o.speed||60,d:0,off:false,pen:null,seg:[]};let tot=0;
  for(let i=1;i<P.pts.length;i++){const a=P.pts[i-1],b=P.pts[i],l=Math.hypot(b[0]-a[0],b[1]-a[1]);P.seg.push({a,b,l,d0:tot});tot+=l}P.len=tot||1;
  P.at=d=>{d=clamp(d,0,P.len);for(const s of P.seg)if(d<=s.d0+s.l||s===P.seg[P.seg.length-1]){const k=s.l?(d-s.d0)/s.l:0;return {x:s.a[0]+(s.b[0]-s.a[0])*k,y:s.a[1]+(s.b[1]-s.a[1])*k,tx:(s.b[0]-s.a[0])/(s.l||1),ty:(s.b[1]-s.a[1])/(s.l||1)}}return {x:P.pts[0][0],y:P.pts[0][1],tx:1,ty:0}};
  P.pen={x:P.pts[0][0],y:P.pts[0][1]};
  /* the nearest point of the path to (x,y) within [lo,hi] of distance along it */
  const proj=(x,y,lo,hi)=>{let best=null;for(const s of P.seg){if(s.d0>hi||s.d0+s.l<lo)continue;const vx=s.b[0]-s.a[0],vy=s.b[1]-s.a[1],L2=vx*vx+vy*vy||1;let k=((x-s.a[0])*vx+(y-s.a[1])*vy)/L2;k=clamp(k,0,1);let d=s.d0+k*s.l;d=clamp(d,lo,hi);const q=P.at(d),e=Math.hypot(q.x-x,q.y-y);if(!best||e<best.e)best={d,e}}return best};
  P.step=(dt,inp)=>{const d0=P.d,f=inp.down;
    if(f){P.pen={x:f.x,y:f.y};const pr=proj(f.x,f.y,Math.max(0,P.d-6),Math.min(P.len,P.d+24));P.off=!pr||pr.e>P.tol;if(!P.off&&pr.d>P.d)P.d=pr.d}
    else if(inp.dx||inp.dy||inp.a){const q=P.at(P.d),dot=inp.a&&!(inp.dx||inp.dy)?1:(inp.dx*q.tx+inp.dy*q.ty)/(Math.hypot(inp.dx,inp.dy)||1);if(dot>.2){P.d=Math.min(P.len,P.d+P.speed*dot*dt)}P.off=false;const q2=P.at(P.d);P.pen={x:q2.x,y:q2.y}}
    const pace=dt>0?(P.d-d0)/dt:0;return {u:P.d/P.len,off:P.off,pace,done:P.d>=P.len-.01}};
  const line=(c,a,b,col,w,dash)=>{c.save();c.strokeStyle=col;c.lineWidth=w;c.lineCap="round";c.lineJoin="round";if(dash)c.setLineDash(dash);c.beginPath();let first=true;
    for(let d=a;d<=b+.001;d+=Math.min(4,Math.max(.5,b-a))){const q=P.at(Math.min(d,b));if(first){c.moveTo(q.x,q.y);first=false}else c.lineTo(q.x,q.y)}c.stroke();c.restore()};
  P.drawGuide=(c,col)=>line(c,0,P.len,col||"rgba(255,233,184,.45)",1.5,[2,3]);
  P.drawDone=(c,col)=>{if(P.d>0)line(c,0,P.d,col||"#F5C66A",2.5)};
  return P}
function mFlow(o){const F={list:[],speed:o.speed||30};let pl=null;
  if(o.path){pl=mPath({pts:o.path})}
  const B=o.bounds||[-40,-40,272,400];
  F.spawn=ob=>{ob.d=ob.d||0;if(pl){const q=pl.at(ob.d);ob.x=q.x;ob.y=q.y}F.list.push(ob);return ob};
  F.remove=ob=>{const i=F.list.indexOf(ob);if(i>=0)F.list.splice(i,1)};
  F.step=dt=>{for(let i=F.list.length-1;i>=0;i--){const ob=F.list[i];if(ob.stop)continue;const v=F.speed*(ob.sp==null?1:ob.sp)*dt;ob.d+=v;let gone=false;
      if(pl){if(ob.d>=pl.len)gone=true;else{const q=pl.at(ob.d);ob.x=q.x;ob.y=q.y}}
      else{const dir=o.dir||[0,1],l=Math.hypot(dir[0],dir[1])||1;ob.x+=dir[0]/l*v;ob.y+=dir[1]/l*v;if(ob.x<B[0]||ob.y<B[1]||ob.x>B[0]+B[2]||ob.y>B[1]+B[3])gone=true}
      if(gone){F.list.splice(i,1);if(o.onExit)o.onExit(ob)}}};
  F.each=fn=>{F.list.slice().forEach(fn)};F.len=pl?pl.len:0;
  return F}
function mPick(o){const K={items:o.items||[],sel:o.sel||0};
  K.step=(dt,inp)=>{const n=K.items.length;if(!n)return -1;if(inp.lTap||inp.uTap)K.sel=(K.sel+n-1)%n;if(inp.rTap||inp.dTap)K.sel=(K.sel+1)%n;
    for(const tp of inp.taps||[]){const i=K.items.findIndex(it=>!it.off&&Math.abs(tp.x-it.x-it.w/2)<=Math.max(11,it.w/2)&&Math.abs(tp.y-it.y-it.h/2)<=Math.max(11,it.h/2));if(i>=0){K.sel=i;return i}}
    if(inp.aTap&&!(K.items[K.sel]||{}).off)return K.sel;return -1};
  K.draw=(c,fn)=>{K.items.forEach((it,i)=>{if(fn){fn(c,it,i,i===K.sel);return}c.save();c.fillStyle=i===K.sel?"rgba(245,198,106,.35)":"rgba(16,11,21,.55)";c.fillRect(it.x,it.y,it.w,it.h);c.strokeStyle=i===K.sel?"#F5C66A":"rgba(255,233,184,.35)";c.lineWidth=i===K.sel?1.5:1;c.strokeRect(it.x+.5,it.y+.5,it.w-1,it.h-1);c.restore()})};
  return K}
MINI_LOADED.fx=true;
