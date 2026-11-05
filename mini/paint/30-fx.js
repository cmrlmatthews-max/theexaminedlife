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
