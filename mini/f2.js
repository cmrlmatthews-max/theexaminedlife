/* The Examined Life: Level II full game (the Marble Coast). Plan 5. Loaded after l1.js-l4.js (fx.js first, boss.js last).
   Source: work_src/f2/<id>.js, one file per game, assembled by tools/build_mini.py f2. Do not edit the GAME blocks here. */
/* MINI_ART:BEGIN */
/* written by tools/l2p5_mini_art.py (Phase 41A): asset ids, atlas rects, people rects and pivots, traced geometry (garden) */
MINI_ART.garden={"atlas":"0b303b0a65f1341af62485a0f205a51b","people":"8aa2f1e2a29946ec2b7892db806bf706","rects":{"e_goblet":[1,1,48,84],"e_pie":[50,1,48,64],"e_cake":[99,1,48,64],"n_water":[148,1,36,45],"cloud_l":[185,1,64,44],"v_grape":[250,1,36,43],"lamp":[287,1,38,40],"jug":[326,1,25,36],"n_figs":[352,1,36,31],"n_bread":[389,1,36,28],"n_olives":[426,1,36,28],"cloud_s":[463,1,40,27],"v_honeycake":[504,1,36,25],"raft":[541,1,48,24],"v_fish":[590,1,36,19],"plate":[627,1,44,19]},"prects":{"friend0_walk_0":[1,1,14,24],"friend0_walk_1":[16,1,14,24],"friend1_walk_0":[31,1,18,24],"friend1_walk_1":[50,1,18,24],"g2_cup":[69,1,18,22],"epi_cup":[88,1,17,21],"g0_cup":[106,1,17,21],"g1_cup":[124,1,17,21],"g3_cup":[142,1,17,21],"g4_cup":[160,1,17,21],"g5_cup":[178,1,17,21],"g0_idle_0":[196,1,14,20],"g0_eat":[211,1,14,20],"g0_shake":[226,1,14,20],"g1_idle_0":[241,1,14,20],"g1_eat":[256,1,14,20],"g1_shake":[271,1,14,20],"g2_idle_0":[286,1,18,20],"g2_idle_1":[305,1,18,20],"g2_eat":[324,1,18,20],"g2_shake":[343,1,18,20],"g3_idle_0":[362,1,14,20],"g3_eat":[377,1,14,20],"g3_shake":[392,1,14,20],"g4_idle_0":[407,1,14,20],"g4_eat":[422,1,14,20],"g4_shake":[437,1,14,20],"g5_idle_0":[452,1,14,20],"g5_eat":[467,1,14,20],"g5_shake":[482,1,14,20],"friend0_sit":[497,1,14,20],"friend1_sit":[1,26,18,20],"g0_idle_1":[20,26,14,19],"g1_idle_1":[35,26,14,19],"g3_idle_1":[50,26,14,19],"g4_idle_1":[65,26,14,19],"g5_idle_1":[80,26,14,19],"epi_idle_0":[95,26,14,18],"epi_eat":[110,26,14,18],"epi_setaside":[125,26,19,18],"epi_idle_1":[145,26,14,17]},"pivots":{"epi_idle_0":[8,18],"epi_idle_1":[8,17],"epi_eat":[8,18],"epi_setaside":[8,18],"epi_cup":[10,21],"g0_idle_0":[8,20],"g0_idle_1":[8,19],"g0_eat":[8,20],"g0_shake":[8,20],"g0_cup":[10,21],"g1_idle_0":[8,20],"g1_idle_1":[8,19],"g1_eat":[8,20],"g1_shake":[8,20],"g1_cup":[10,21],"g2_idle_0":[10,20],"g2_idle_1":[10,20],"g2_eat":[10,20],"g2_shake":[10,20],"g2_cup":[10,22],"g3_idle_0":[8,20],"g3_idle_1":[8,19],"g3_eat":[8,20],"g3_shake":[8,20],"g3_cup":[10,21],"g4_idle_0":[8,20],"g4_idle_1":[8,19],"g4_eat":[8,20],"g4_shake":[8,20],"g4_cup":[10,21],"g5_idle_0":[8,20],"g5_idle_1":[8,19],"g5_eat":[8,20],"g5_shake":[8,20],"g5_cup":[10,21],"friend0_walk_0":[8,24],"friend0_walk_1":[8,24],"friend0_sit":[8,20],"friend1_walk_0":[10,24],"friend1_walk_1":[10,24],"friend1_sit":[10,20]},"bg":["c60dd28cf633f40dc09d54c0c0df1fc9"],"plate":"ba52ada0a8e3653c1eb7002942423b3f","geo":{"crop":"bottom of the 9:16 image","rill":{"y":110,"band":[102,118]},"table":[18,162,166,188],"tableTop":164,"plateY":176,"seats":[32,64,96,128,160],"bench":[22,136,160,152],"gate":[30,228],"gateOpening":[14,212,48,240],"waitSpots":[[14,214],[28,214],[42,214]],"lamp":[96,168],"paintedLamps":[[14,140],[176,140],[80,214]],"wallBottom":242,"darkBandFrom":250}};
/* MINI_ART:END */
/* GAME:garden:BEGIN */
(function(){
{ /* The Garden Table (Epicurus). Plan 5, Phase 41B. Helpers: mFlow (rafts), mDrag (touch drags); keys and pad use their own row model. Art: MINI_ART.garden */
const ID="garden",LD="#100B15",RY=110,PY=176,FY=160,BY=134,LP=[96,168],WT=[[14,214],[28,214],[42,214]],GT=[30,236];
const SEATS=[[56,96,136],[36,76,116,156],[32,64,96,128,160]],IV=[1.3,1.2,1.0],WG=[[55,15,30],[55,15,30],[50,10,40]];
const DK={bread:["N","f","n_bread",18,"#C98A4B"],water:["N","d","n_water",18,"#9FC4D8"],figs:["N","f","n_figs",18,"#6A3A6E"],olives:["N","f","n_olives",18,"#2A2438"],
  honey:["V","f","v_honeycake",18,"#E0B050"],fish:["V","f","v_fish",18,"#B8A890"],grape:["V","d","v_grape",18,"#7A3A90"],
  pie:["E","f","e_pie",24,"#D9A93A"],goblet:["E","d","e_goblet",24,"#F5C66A"],cake:["E","f","e_cake",24,"#F0D890"]};
const NF=["bread","figs","olives"],VS=["honey","fish","grape"],ES=["pie","goblet","cake"];
const FC={epi:"#E8E0D0",g0:"#8A6A48",g1:"#5A3A7A",g2:"#3A6A44",g3:"#3A5A8A",friend0:"#7A6A58",friend1:"#4A6A4A"};
if(typeof SFX!=="undefined"&&typeof aTone==="function"&&!SFX.garden_serve){Object.assign(SFX,{
  garden_serve:()=>{aTone(AN(12),.09,{type:"triangle",v:.06,lp:2400,to:AN(10)});aTone(AN(19),.07,{v:.03,at:.025})},
  garden_cloud:()=>aNoise(.28,{type:"lowpass",f:520,to:180,q:.5,a:.05,v:.07}),
  garden_more:()=>{aTone(AN(24),.32,{v:.025,a:.05,to:AN(36)});aTone(AN(31),.28,{v:.015,at:.07,a:.05,to:AN(41)})},
  garden_friend:()=>{aTone(AN(5),.2,{type:"triangle",v:.06,lp:1400});aTone(AN(12),.26,{type:"triangle",v:.06,lp:1400,at:.14})},
  garden_gust:()=>aNoise(1.4,{f:600,to:2200,q:.4,a:.6,v:.04}),
  garden_still:()=>{aTone(AN(31),.32,{v:.05,a:.004});aTone(AN(36),.38,{v:.03,at:.08,a:.004})}})}
const A=()=>MINI_ART[ID];
function rng(a){return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const zone=(x,y,X)=>{for(let i=0;i<X.length;i++)if(Math.abs(x-X[i])<=15&&y>=120&&y<=190)return i;return -1};
/* ---- dishes: weights per stage, a seeded random, and the fairness rule ---- */
function mkDish(s,k,d){const q=DK[k],o={k,g:q[0],ty:q[1],w:26,h:26,y:RY,d,sp:q[0]==="E"?20/24:1,ph:s.rng()*6.28,gl:s.rng()*.5};
  s.F.spawn(o);if(q[0]==="N")s.lastN[q[1]]=s.ck;return o}
function rk(s){const w=WG[s.st],r=s.rng()*100,q=s.rng;
  if(r<w[0])return q()<.6?NF[(q()*3)|0]:"water";return r<w[0]+w[1]?VS[(q()*3)|0]:ES[(q()*3)|0]}
function spawn(s){let k=null,best=-1;
  for(const g of s.gs)if(g&&g.st==="need"&&!g.lonely){const ty=g.need==="h"?"f":"d",age=s.ck-s.lastN[ty];if(age>=4&&age>best){best=age;k=ty==="f"?NF[(s.rng()*3)|0]:"water"}}
  mkDish(s,k||rk(s),0)}
/* ---- guests ---- */
function mkG(s,i,w,epi,fr){return{i,x:s.X[i],w,epi:!!epi,fr:!!fr,st:"idle",need:null,tm:2+s.rng()*1.5,eatT:0,dish:null,lonely:false,lonT:0,shk:0,pop:0,sa:0,ms:1,ph:s.rng()*4}}
function setup(s,n){const X=SEATS[n];s.st=n;s.stT=0;s.X=X;s.gs=X.map(()=>null);s.res=X.map(()=>null);s.fr=[];s.cl=[];s.calm=0;s.lastN={f:-99,d:-99};s.gc=0;s.gk=0;s.tel=false;s.ln=0;s.lean=0;s.na=0;
  s.carry=null;s.selF=null;s.hiD=null;s.spT=IV[n];s._bm=0;
  const put=(i,w,e)=>{s.gs[i]=mkG(s,i,w,e)};
  if(n===0){put(0,"g1");put(1,"epi",1);put(2,"g2")}else if(n===1){put(1,"epi",1);put(3,"g3")}else{put(0,"g0");put(1,"g1");put(2,"epi",1);put(3,"g2");put(4,"g3")}
  s.F=mFlow({path:[[-14,RY],[200,RY]],speed:24});s.D=mDrag({pieces:[],spots:X.map((x,i)=>({id:i,x,y:155,r:18})),snap:false,back:false});
  for(let i=0;i<6;i++)mkDish(s,rk(s),(i+.5)*32)}
function clouds(s,g,n){for(let i=0;i<n;i++){
  if(s.cl.length>=8){let b=s.cl[0];for(const c of s.cl)if(c.m>b.m||(c.m===b.m&&c.life-c.t>b.life-b.t))b=c;b.life+=4;b.m++}
  else s.cl.push({x:g.x,x0:g.x,y:130,t:0,life:10,m:0,ph:s.rng()*6.28,sw:0})}
  sfx("garden_cloud");if(!s.rm)pDust(s.P,g.x,128,4,"rgba(190,190,205,.7)")}
function take(s,g,d){s.F.remove(d);g.dish=d.k;g.eatT=2.5;sfx("garden_serve")}
function ret(s,d){if(!d.ret)d.ret={t:0,x0:d.x,y0:d.y,x1:clamp(d.x,2,188)};d.stop=true}
/* drop dish d on seat i; true when the guest took it, false when it goes back to the rill */
function drop(s,d,i){const g=s.gs[i];if(!g)return false;const E_=d.g==="E";
  if(g.epi&&E_){g.sa=1.2;return false} /* Epicurus never takes an empty dish: no cloud, no count */
  if(g.lonely){take(s,g,d);s.bought++;if(E_){clouds(s,g,2);s.empties++}return true} /* food does not answer loneliness: calm +0, the bubble stays */
  if(g.st==="more"){if(E_){take(s,g,d);g.tm=12;g.ms*=1.3;clouds(s,g,2);s.empties++;g.pop=.35;sfx("garden_more");return true}g.shk=1;return false}
  if(g.st==="need"&&d.ty===(g.need==="h"?"f":"d")){take(s,g,d);s.calm=Math.min(100,s.calm+10);g.need=null;g.pop=.35;
    if(E_){clouds(s,g,1);g.st="more";g.tm=8;g.ms=1;s.empties++;sfx("garden_more")}else{g.st="idle";g.tm=2+s.rng()*1.5}return true}
  return false}
function seat(s,f,i){if(s.gs[i]||s.res[i]||f.st!=="wait")return false;const y1=Math.min(f.y+12,200);
  f.st="walk";f.t=0;f.si=i;s.res[i]=f;s.selF=s.selF===f?null:s.selF;f.P=mPath({pts:[[f.x,f.y+12],[8,y1],[8,FY],[s.X[i],FY]]});return true}
function sit(s,f){const i=f.si;s.gs[i]=mkG(s,i,"friend"+f.k,0,1);s.res[i]=null;f.st="gone";s.calm=Math.min(100,s.calm+15);sfx("garden_friend");
  for(const j of[i-1,i+1]){const g=s.gs[j];if(g&&g.lonely){g.lonely=false;g.lonT=0;g.pop=.35;s.calm=Math.min(100,s.calm+5)}}if(!s.rm)pSparks(s.P,s.X[i],150,6,"#FFE9A8",24)}
function friends(s,dt){if(s.st===1)while(s.na<2&&s.gc>=[2,9][s.na]){const sl=[0,1,2].find(q=>!s.fr.some(f=>f.slot===q)),k=s.na++;
    s.fr.push({k,slot:sl,x:GT[0],y:GT[1]-12,hx:WT[sl][0],hy:WT[sl][1]-12,w:16,h:26,st:"in",t:0,fl:0})}
  for(const f of s.fr){f.t+=dt;
    if(f.st==="in"){const k=Math.min(1,f.t);f.x=lerp(GT[0],f.hx,k);f.y=lerp(GT[1]-12,f.hy,k);if(k>=1){f.st="wait";f.x=f.hx;f.y=f.hy}}
    else if(f.st==="walk"){const k=Math.min(1,f.t/1.2),q=f.P.at(k*f.P.len);f.fl=q.x<f.x-.01?1:q.x>f.x+.01?0:f.fl;f.x=q.x;f.y=q.y-12;if(k>=1)sit(s,f)}}
  s.fr=s.fr.filter(f=>f.st!=="gone")}
function guests(s,dt){for(const g of s.gs){if(!g)continue;g.ph+=dt;g.shk=Math.max(0,g.shk-dt);g.pop=Math.max(0,g.pop-dt);g.sa=Math.max(0,g.sa-dt);if(g.eatT>0)g.eatT-=dt;
    if(s.gs[g.i-1]||s.gs[g.i+1])g.lonT=0;else g.lonT+=dt; /* lonely: no seated neighbor for 4 s */
    if(!g.lonely&&g.lonT>=4&&(g.st==="idle"||g.st==="need")){g.lonely=true;g.st="idle";g.need=null;g.pop=.35}
    if(g.st==="more"){g.tm-=dt;if(g.tm<=0){g.st="idle";g.ms=1;g.tm=2+s.rng()*1.5}}
    else if(g.st==="idle"&&!g.lonely&&g.eatT<=0){g.tm-=dt;if(g.tm<=0){g.st="need";g.need=s.rng()<.6?"h":"t";g.pop=.35}}}}
/* ---- input: touch (mDrag) and keys or pad (a row model: rill, table, gate) ---- */
function valid(s){const c=s.carry,o=[];s.X.forEach((x,i)=>{if(c.f?(!s.gs[i]&&!s.res[i]):s.gs[i])o.push(i)});return o}
function cancel(s){const c=s.carry;if(!c)return;if(c.f){c.o.x=c.o.hx;c.o.y=c.o.hy}else ret(s,c.o);s.carry=null}
const vis=s=>s.F.list.filter(d=>!d.ret&&d.x>=0&&d.x<=192);
function hi(s){let b=null;for(const d of vis(s))if(!b||Math.abs(d.x-s.hx)<Math.abs(b.x-s.hx))b=d;s.hiD=b}
function input(s,dt,inp){const X=s.X,gs=s.gs,F=s.F,D=s.D,wt=s.fr.filter(f=>f.st==="wait"),tch=!!(inp.down||inp.taps.length);
  D.pieces=F.list.filter(d=>!d.ret&&!(s.carry&&s.carry.o===d)).concat(wt.filter(f=>!(s.carry&&s.carry.o===f)));
  if(tch){s.kb=false;if(s.carry)cancel(s)}
  if(s.row===2&&!wt.length)s.row=1;
  const ev=D.step(dt,Object.assign({},inp,{dx:0,dy:0,aTap:false}));
  for(const tp of inp.taps){const f=wt.find(q=>Math.abs(tp.x-q.x)<=11&&Math.abs(tp.y-q.y)<=15);if(f){s.selF=f;continue}
    if(s.selF&&s.selF.st==="wait"){const i=zone(tp.x,tp.y,X);if(i>=0)seat(s,s.selF,i)}}
  if(ev){const p=ev.piece,i=zone(p.x,p.y,X);
    if(p.g){if(i<0||!drop(s,p,i))ret(s,p)}
    else{if(i>=0&&seat(s,p,i));else{if(Math.hypot(p.x-p.hx,p.y-p.hy)<6)s.selF=p;p.x=p.hx;p.y=p.hy}}}
  /* keys and pad: arrows or the pad give up/down/left/right edges, A picks up and places, B cancels */
  const q=[inp.dx<=-.5,inp.dx>=.5,inp.dy<=-.5,inp.dy>=.5],L=inp.lTap||(q[0]&&!s.pk[0]),R=inp.rTap||(q[1]&&!s.pk[1]),U=inp.uTap||(q[2]&&!s.pk[2]),Dn=inp.dTap||(q[3]&&!s.pk[3]);s.pk=q;
  if(D.held||!(L||R||U||Dn||inp.aTap||inp.bTap))return;
  const dir=(R?1:0)-(L?1:0),c=s.carry;
  if(!s.kb){s.kb=true;hi(s);return}
  if(c){if(inp.bTap)cancel(s);else if(dir){const v=valid(s);if(v.length)s.cs=v[(v.indexOf(s.cs)+dir+v.length)%v.length]}
    else if(inp.aTap){const i=s.cs,o=c.o;s.carry=null;if(c.f){if(!seat(s,o,i)){o.x=o.hx;o.y=o.hy}}else if(!drop(s,o,i))ret(s,o);s.hiD=null}return}
  if(U)s.row=0;else if(Dn&&s.row<(s.st===1&&wt.length?2:1))s.row++;
  if(s.row===0){const Ls=vis(s);
    if(!s.hiD||!Ls.includes(s.hiD))hi(s);
    else if(dir){let b=null;for(const d of Ls)if(dir>0?d.x>s.hiD.x:d.x<s.hiD.x)if(!b||Math.abs(d.x-s.hiD.x)<Math.abs(b.x-s.hiD.x))b=d;if(b)s.hiD=b}
    if(s.hiD)s.hx=s.hiD.x;
    if(inp.aTap&&s.hiD&&!U&&!Dn){s.carry={o:s.hiD};const v=[];X.forEach((x,i)=>{if(gs[i])v.push(i)});s.cs=v.reduce((a,i)=>a==null||Math.abs(X[i]-s.hiD.x)<Math.abs(X[a]-s.hiD.x)?i:a,null)}}
  else if(s.row===1){s.hs=clamp((s.hs||0)+dir,0,X.length-1)}
  else{s.hf=clamp((s.hf||0)+dir,0,Math.max(0,wt.length-1));
    if(inp.aTap&&!Dn&&wt[s.hf]){s.carry={o:wt[s.hf],f:1};if(valid(s).length)s.cs=valid(s)[0];else s.carry=null}}}
/* ---- one frame ---- */
function frame(s,dt,inp){s.stT+=dt;s.gc+=dt;s.ck+=dt;const F=s.F;
  s.spT-=dt;if(s.spT<=0){s.spT+=IV[s.st];spawn(s)}
  F.speed=24*(s.kb&&s.row===0?.6:1);
  for(const d of F.list){d.stop=!!(d.ret||s.D.held===d||(s.carry&&s.carry.o===d));if(d.g==="E"&&!s.rm&&d.x>0&&d.x<192){d.gl-=dt;if(d.gl<=0){d.gl=.5;pSparks(s.P,d.x+(s.rng()-.5)*14,d.y-14,1,"#FFF1C8",14)}}
    if(d.ret){const r=d.ret;r.t+=dt;const k=Math.min(1,r.t/.45);d.x=lerp(r.x0,r.x1,k);d.y=lerp(r.y0,RY,E.out(k))-16*Math.sin(Math.PI*k);if(k>=1){d.d=r.x1+14;d.x=r.x1;d.y=RY;d.ret=null;d.stop=false}}
    else if(s.carry&&s.carry.o===d){d.x=lerp(d.x,s.X[s.cs],Math.min(1,dt*14));d.y=lerp(d.y,150,Math.min(1,dt*14))}}
  if(s.carry&&s.carry.f){const f=s.carry.o;f.x=lerp(f.x,s.X[s.cs],Math.min(1,dt*14));f.y=lerp(f.y,150,Math.min(1,dt*14))}
  F.step(dt);input(s,dt,inp);if(s.kb&&s.row===0&&!s.carry&&!(s.hiD&&vis(s).includes(s.hiD)))hi(s);guests(s,dt);friends(s,dt);
  for(let i=s.cl.length-1;i>=0;i--){const c=s.cl[i];c.t+=dt;c.sw=Math.max(0,c.sw-dt);const k=Math.min(1,c.t/10);c.y=lerp(130,60,k);c.x=c.x0+(96-c.x0)*.25*k;if(c.t>=c.life)s.cl.splice(i,1)}
  let pr=0;for(let i=0;i<s.X.length-1;i++)if(s.gs[i]&&s.gs[i+1])pr++;
  s.calm=clamp(s.calm-1.2*s.cl.length*dt+(s.st>=1?.25*pr*dt:0),0,100);
  if(s.st===2){const ht=6+9*s.gk;
    if(!s.tel&&s.gc>=ht-1.5){s.tel=true;sfx("garden_gust")}
    if(s.tel&&!s.rm&&((s.gc*30)|0)!==(((s.gc-dt)*30)|0))pAdd(s.P,{x:198,y:30+Math.random()*170,vx:-120-Math.random()*50,vy:Math.random()*16-4,life:1.5,col:Math.random()<.5?"#8FB468":"#C4D48A",s:3,fade:false});
    if(s.gc>=ht){s.tel=false;s.gk++;const n=s.cl.length;s.ln=.9;
      if(n){s.calm=Math.max(0,s.calm-4*n);for(const c of s.cl)c.sw=.6}
      else{s.calm=Math.min(100,s.calm+2);sfx("garden_still");pSparks(s.P,LP[0],160,s.rm?3:10,"#FFF1C8",26)}
      s.lg={n,d:n?-4*n:2}}
    s.ln=Math.max(0,s.ln-dt);s.lean=s.tel?E.out(clamp((s.gc-(ht-1.5))/1.5,0,1)):E.out(s.ln/.9)}
  pStep(s.P,dt,s.rm);
  if(s.calm>=100){s.calm=100;if(s.st<2){stageUp(s);setup(s,s.st)}else return "win"}
  return null}
/* ---- drawing ---- */
function rr(c,x,y,w,h,r){c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function pp(c,n,x,y,o){const a=A(),r=a&&a.prects&&a.prects[n],pv=a&&a.pivots&&a.pivots[n];if(!r||!pv)return false;o=o||{};o.ax=pv[0]/r[2];o.ay=pv[1]/r[3];return mPerson(c,ID,n,x,y,o)}
function back(c,s,calm){if(!mBg(c,ID,0)){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#14243A");g.addColorStop(1,"#0C1A22");c.fillStyle=g;c.fillRect(0,0,192,320);
    c.fillStyle="#1B3A34";c.fillRect(3,50,186,192);c.fillStyle="#EAF4F0";c.beginPath();c.arc(97,2,10,0,7);c.fill();
    c.fillStyle="#1A5A6A";c.fillRect(0,102,192,16);c.fillStyle="#7FB8C4";c.fillRect(0,102,192,1);c.fillRect(0,117,192,1);
    c.fillStyle="#5C3E26";c.fillRect(22,136,138,16);c.fillRect(18,162,148,26);c.fillStyle="#7A5535";c.fillRect(18,162,148,3);
    c.fillStyle="#2A3B50";c.fillRect(0,228,192,92);c.fillStyle="#3A2A1A";c.fillRect(14,212,34,28)}}
function rill(c,s,t,still){c.save();for(let i=0;i<3;i++)wave(c,4,105+i*5,184,still?.4:1.2,4+i,s.rm||still?i:t/700+i*1.7,0,"rgba(200,235,240,.28)",1);
  if(still){c.fillStyle="rgba(255,252,225,.35)";for(let i=0;i<5;i++)c.fillRect(hs(97-9+i*1.5),104+i*2.5,18-i*3,.8)}c.restore()}
function dsh(c,k,x,y,ay,a){const q=DK[k],w=q[3];if(mPiece(c,ID,q[2],x,y,{ax:.5,ay,a}))return;
  const h=k==="goblet"?30:12;c.save();if(a!=null)c.globalAlpha=a;c.fillStyle=q[4];c.strokeStyle=LD;c.beginPath();c.ellipse(hs(x),hs(y-ay*h+h/2),w/2,h/2,0,0,7);c.fill();c.stroke();c.restore()}
function raft(c,x,y){if(!mPiece(c,ID,"raft",x,y,{ax:.5,ay:.5})){c.fillStyle="#6A4A2A";c.fillRect(hs(x-12),hs(y-3),24,6);c.fillStyle="#8A6A3A";c.fillRect(hs(x-12),hs(y-3),24,2)}}
function person(c,s,g,t,cup){const x=g.x;let n;mShadow(c,x,FY,12,.3);
  if(g.fr)n=g.w+"_sit";else n=cup?g.w+"_cup":g.sa>0?"epi_setaside":g.shk>0?g.w+"_shake":g.eatT>0?g.w+"_eat":g.w+"_idle_"+(s.rm?0:((t/700+g.ph)|0)%2);
  const ox=g.fr&&g.shk>0&&!s.rm?Math.sin(t/60):0;
  if(!pp(c,n,x+ox,FY)){const col=FC[g.w]||"#8A6A48";c.fillStyle=LD;c.fillRect(x-6,FY-14,12,14);c.fillRect(x-4,FY-20,8,8);c.fillStyle=col;c.fillRect(x-5,FY-13,10,12);c.fillStyle="#E8C8A0";c.fillRect(x-3,FY-19,6,6)}
  if(cup&&g.fr){c.fillStyle="#C98A4B";c.fillRect(x+6,FY-17,3,3)}}
function cloud(c,s,cl,al,dy){const k=cl.t/cl.life,a=Math.min(1,cl.t/.5)*Math.min(1,(cl.life-cl.t)/1.5)*(al==null?1:al),sw=cl.sw>0?1+.3*Math.sin(Math.PI*(1-cl.sw/.6)):1,pop=s.rm?1:E.out(Math.min(1,cl.t/.4)),
  wb=s.rm?0:Math.sin(cl.t*2+cl.ph)*2,x=cl.x+wb,y=cl.y+(dy||0);
  if(!mPiece(c,ID,cl.m?"cloud_l":"cloud_s",x,y,{ax:.5,ay:.5,a,sc:sw*pop})){c.save();c.globalAlpha=a;c.fillStyle="#8E909E";const r=(cl.m?9:6)*sw*pop;
    for(const q of[[-.7,.2],[0,-.3],[.7,.2]]){c.beginPath();c.ellipse(x+q[0]*r,y+q[1]*r,r*.8,r*.6,0,0,7);c.fill()}c.restore()}}
function bub(c,g,s){const k=g.lonely?"l":g.st==="need"?g.need:g.st==="more"?"m":null;if(!k)return;
  const pr=g.pop>0?1-g.pop/.35:1,sc=(k==="m"?Math.min(g.ms,2.2):1)*(s.rm?1:.6+.4*E.out(pr));
  c.save();c.translate(g.x,BY-(k==="m"?(sc-1)*6:0));c.scale(sc,sc);c.fillStyle="rgba(255,244,216,.94)";c.strokeStyle=LD;c.lineWidth=1;c.beginPath();
  if(k==="h")c.arc(0,0,10,0,7);else if(k==="t")rr(c,-9,-9,18,18,4);
  else if(k==="m"){for(let i=0;i<16;i++){const a=i*Math.PI/8-Math.PI/2,q=i%2?7:11;c[i?"lineTo":"moveTo"](Math.cos(a)*q,Math.sin(a)*q)}c.closePath()}
  if(k!=="l"){c.fill();c.stroke()}
  else{const cl=[[-5,1,5],[0,-2,6],[5,1,5],[0,3,5]];c.fillStyle=LD;for(const q of cl){c.beginPath();c.arc(q[0],q[1],q[2]+1,0,7);c.fill()}c.fillStyle="rgba(255,244,216,.94)";for(const q of cl){c.beginPath();c.arc(q[0],q[1],q[2],0,7);c.fill()}}
  c.strokeStyle="#7A4A22";c.lineWidth=.9;c.beginPath();
  if(k==="h"){c.ellipse(0,1,5.5,3.4,0,0,7);c.moveTo(-2,-1.5);c.lineTo(-.5,.5);c.moveTo(1,-2);c.lineTo(2.5,0)}
  else if(k==="t"){c.moveTo(-3.5,-4.5);c.lineTo(3.5,-4.5);c.lineTo(2.5,4.5);c.lineTo(-2.5,4.5);c.closePath();c.moveTo(3.5,-2.5);c.arc(4.5,-.5,2,-1.5,1.5)}
  else if(k==="m"){c.moveTo(-3,-1);c.lineTo(3,-1);c.lineTo(1.6,3);c.lineTo(-1.6,3);c.closePath();c.moveTo(0,3);c.lineTo(0,6);c.moveTo(-2.4,6);c.lineTo(2.4,6);c.moveTo(-8,-3);c.lineTo(-6,-5.5);c.lineTo(-4,-3);c.moveTo(4,-3);c.lineTo(6,-5.5);c.lineTo(8,-3)}
  else for(const x of[-3,3]){c.moveTo(x+1.4,-3.5);c.arc(x,-3.5,1.4,0,7);c.moveTo(x,-2);c.lineTo(x,2.5);c.moveTo(x-2,.5);c.lineTo(x+2,.5)}
  c.stroke();c.restore();
  if(g.pop>0&&!s.rm){c.save();c.globalAlpha=g.pop/.35*.7;ring(c,g.x,BY,10+8*pr,1,"#FFE9B8",1);c.restore()}}
function lamp(c,s,t){const n=s.cl.length,r=(14+.5*s.calm)*Math.max(.4,1-.08*n);
  if(!mPiece(c,ID,"lamp",LP[0],LP[1],{ax:.5,ay:.5})){c.fillStyle="#8A6A3A";c.fillRect(92,166,8,10);c.fillStyle="#FFD27A";c.fillRect(95,161,2,5)}
  glow(c,LP[0],LP[1]-3,r,"#FFD27A",.35+.004*s.calm);glow(c,LP[0],LP[1]-3,Math.max(5,r*.35),"#FFF1C8",.4);
  if(s.lean>.02){c.save();c.translate(LP[0],LP[1]-1);c.rotate(-s.lean*.6);c.fillStyle="#FFE08A";c.beginPath();c.ellipse(0,-5,1.5,4.2,0,0,7);c.fill();c.restore()}}
function hud(c,s){c.save();c.fillStyle="rgba(16,11,21,.55)";c.beginPath();c.arc(172,22,13,0,7);c.fill();c.strokeStyle="rgba(255,233,184,.25)";c.lineWidth=3;c.beginPath();c.arc(172,22,11,0,7);c.stroke();c.restore();
  ring(c,172,22,11,s.calm/100,"#F5C66A",3);glow(c,172,22,10,"#FFD27A",.15+.5*s.calm/100)}
function tableTop(c,s){for(const x of s.X)if(!mPiece(c,ID,"plate",x,PY,{ax:.5,ay:.5})){c.fillStyle="#B8764A";c.beginPath();c.ellipse(x,PY,11,4.5,0,0,7);c.fill()}}
function mark(c,x,y,col){c.save();c.strokeStyle=col||"#F5C66A";c.lineWidth=1.5;c.beginPath();c.moveTo(x-4,y-4);c.lineTo(x,y);c.lineTo(x+4,y-4);c.stroke();c.restore()}
function walker(c,f,t,k){const n=(f.k?"friend1":"friend0")+"_walk_"+(((t/160)|0)%2);mShadow(c,f.x,f.y+12,12,.3);
  if(!pp(c,n,f.x,f.y+12,{flip:!!f.fl}))mkF(c,f.x,f.y+12,k)}
function mkF(c,x,y,k){c.fillStyle=LD;c.fillRect(x-6,y-22,12,22);c.fillStyle=FC["friend"+k];c.fillRect(x-5,y-21,10,18);c.fillStyle="#E8C8A0";c.fillRect(x-3,y-21,6,6)}
const G={
  who:"epicurus",land:"l2",title:"The Garden Table",
  setup:["Everything floating by is on offer. Not all of it is worth having.","Bread and water fill you up. The fancy stuff just makes you want more."],
  how:"Drag a dish onto a guest who needs it. Keep the table calm.",
  win:"The calmest table, not the fullest. That’s the whole secret.",
  walk:"Take the bread and water. They’re still the best meal I know.",
  stages:["Bread and Water","Good Company","Fortune’s Wind"],
  lines:[null,"No dish can fill an empty chair. Bring your friends to the table.","Here comes Fortune’s wind. It can only grab your worries."],
  pad:true,ab:true,limit:240,long:false,bloomT:3,
  fl:["The table found its calm","Few worries at the table","Simple food, good friends, no worries"],
  flNext:["Let the grand dishes float by.","Serve only simple food, and answer loneliness with a friend."],
  rate:s=>s.empties===0&&s.bought===0?3:s.empties<=2?2:1,
  init(s){s.rng=rng(7);s.ck=0;s.empties=0;s.bought=0;s.P=pfx();s.pk=[0,0,0,0];s.kb=false;s.row=0;s.hs=0;s.hf=0;s.hx=96;s.lg=null;setup(s,0)},
  toStage(s,n){G.init(s);if(n>=1)setup(s,n)},
  step(s,dt,inp){return frame(s,dt,inp)},
  put(s,k,x){const d=mkDish(s,k,x+14);d.x=x;return d}, /* kit hook: a dish of kind k on the rill at x */
  auto(s,inp){if(s.carry)return;
    for(const g of s.gs){if(!g||g.lonely||g.st!=="need")continue;const ty=g.need==="h"?"f":"d";let b=null;
      for(const d of s.F.list)if(d.g!=="E"&&d.ty===ty&&!d.ret&&d.x>=20&&d.x<=172&&s.D.held!==d&&(!b||d.x>b.x))b=d;
      if(b)drop(s,b,g.i)}
    if(s.st===1)for(const f of s.fr)if(f.st==="wait"){const i=s.X.findIndex((x,j)=>!s.gs[j]&&!s.res[j]);if(i>=0)seat(s,f,i)}},
  shotReady:s=>s.st===0?s.calm>=25:s.st===1?s.gs.some(g=>g&&g.lonely):s.tel,
  draw(s,c,t){back(c,s);rill(c,s,t);
    const hd=s.D.held;
    for(const d of s.F.list){if(d===hd||d.ret||(s.carry&&s.carry.o===d)||d.x<-12||d.x>204)continue;const b=s.rm?0:Math.sin(s.ck*7.54+d.ph);raft(c,d.x,d.y+b);dsh(c,d.k,d.x,d.y+b+1,1)}
    tableTop(c,s);
    for(const g of s.gs)if(g){person(c,s,g,t,false);if(g.eatT>0)dsh(c,g.dish,g.x,PY+1,1)}
    for(const f of s.fr){if(f.st==="walk"||f.st==="in")walker(c,f,t,f.k);else if(!(s.carry&&s.carry.o===f)&&!(hd===f)){mShadow(c,f.x,f.y+12,12,.3);if(!pp(c,"friend"+f.k+"_walk_0",f.x,f.y+12))mkF(c,f.x,f.y+12,f.k)}}
    if(s.st===2)gradeN(c,"storm",.4);
    lamp(c,s,t);
    for(const cl of s.cl)cloud(c,s,cl);
    for(const g of s.gs)if(g)bub(c,g,s);
    /* what is lifted: shadow and dish, or the friend */
    const lift=[];for(const d of s.F.list)if(d===hd||d.ret||(s.carry&&s.carry.o===d))lift.push(d);
    for(const d of lift){mShadow(c,d.x,d.y+(d.ret?12:13),d.g==="E"?18:14,.35);dsh(c,d.k,d.x,d.y,.5)}
    for(const f of s.fr)if(f===hd||(s.carry&&s.carry.o===f)){mShadow(c,f.x,f.y+12,12,.35);if(!pp(c,"friend"+f.k+"_walk_0",f.x,f.y+12))mkF(c,f.x,f.y+12,f.k)}
    if(s.selF&&s.selF.st==="wait")mark(c,s.selF.x,s.selF.y-16);
    if(s.kb&&!hd){const cr=s.carry;
      if(cr)mark(c,s.X[s.cs],122);
      else if(s.row===0&&s.hiD){c.save();c.strokeStyle="#F5C66A";c.lineWidth=1.5;c.beginPath();c.arc(hs(s.hiD.x),hs(s.hiD.y),14,0,7);c.stroke();c.restore()}
      else if(s.row===1)mark(c,s.X[s.hs],122,"#FFE9B8");
      else if(s.row===2){const f=s.fr.filter(q=>q.st==="wait")[s.hf];if(f)mark(c,f.x,f.y-16)}}
    if(s.tel&&s.rm){c.save();c.globalAlpha=.5;c.fillStyle="#A8C47A";for(let i=0;i<9;i++)c.fillRect(100+i*9,70+i*11,4,2);c.restore()}
    pDraw(c,s.P,ID);hud(c,s);vignette(c,.2)},
  bloom(s,c,k,t){const L=s._fl||1,rm=s.rm;
    if(!s._bm){s._bm=1;s.PB=pfx();s._bt=t;s._ff=0}const dt=clamp((t-s._bt)/1000,0,.05);s._bt=t;
    back(c,s);rill(c,s,t,1);tableTop(c,s);
    if(!mPiece(c,ID,"jug",112,184,{ax:.5,ay:1})){c.fillStyle="#B8764A";c.fillRect(109,172,6,12)}
    for(const g of s.gs)if(g)person(c,s,g,t,true);
    for(const cl of s.cl)cloud(c,s,cl,1-k,-k*34);
    lamp(c,{cl:[],calm:100,lean:0},t);
    if(L>=2){const gk=clamp((k-.1)/.2,0,1);glow(c,31,226,22*gk+4,"#FFD27A",.5*gk);
      [[0,.35,66,226],[1,.5,110,230]].forEach(q=>{const u=rm?1:E.inOut(clamp((k-q[1])/.35,0,1)),f={k:q[0],x:lerp(GT[0],q[2],u),y:lerp(GT[1],q[3],u)-12,fl:0};
        if(u>0&&u<1)walker(c,f,t,q[0]);else if(u>=1){mShadow(c,f.x,f.y+12,12,.3);if(!pp(c,"friend"+q[0]+"_walk_0",f.x,f.y+12))mkF(c,f.x,f.y+12,q[0])}})}
    const N=[20,40,70][L-1];
    if(rm){for(let i=0;i<Math.min(N,24);i++){const a=i*2.399;glow(c,50+(i%2)*35+Math.cos(a)*14,70-i*1.5+Math.sin(a)*8,4,"rgba(255,214,110,.9)",.7)}}
    else{const want=Math.round(N*clamp((k-.05)/.8,0,1));while(s._ff<want){pFireflies(s.PB,s._ff%2?85:50,78,1,14);s._ff++}pStep(s.PB,dt,false);pDraw(c,s.PB,ID)}
    vignette(c,.2)}
};
MINI.garden=G;
}
})();
/* GAME:garden:END */
MINI_LOADED.f2=true;
