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
