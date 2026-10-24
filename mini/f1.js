/* The Examined Life: Level I full games (the Stormcliffs). Plan 5. Loaded after l1.js-l4.js (fx.js first, boss.js last).
   Source: work_src/f1/<id>.js, one file per game, assembled by tools/build_mini.py f1. Do not edit the GAME blocks here. */
/* MINI_ART:BEGIN */
/* written by tools/l1p5_mini_art.py (Phase 40A): asset ids, atlas rects, people rects and pivots, traced geometry (leap, doors) */
MINI_ART.leap={"atlas":"eb865a9c104c1820eb3f74b6ce7c8653","people":"2c8341ebbbfa9f7ef52d45b67470e660","rects":{"head":[1,1,240,173],"stack":[242,1,96,160],"shelf":[339,1,200,104],"ledge_n":[540,1,96,57],"ledge_w":[637,1,112,49],"puff":[750,1,64,30],"ring":[815,1,32,22]},"prects":{"w_leap":[1,1,23,26],"w_nudged":[25,1,22,26],"crowd_walk_1":[48,1,13,25],"w_gather_0":[62,1,15,24],"w_land":[78,1,23,24],"crowd_walk_0":[102,1,14,24],"crowd_stand":[117,1,13,24],"crowd_chat_0":[131,1,13,24],"crowd_chat_1":[145,1,17,24],"kier_nod":[163,1,14,23],"w_gather_1":[178,1,20,22],"w_cushion":[199,1,18,19]},"pivots":{"w_gather_0":[7,24],"w_gather_1":[12,22],"w_leap":[9,26],"w_land":[12,24],"w_nudged":[13,26],"w_cushion":[7,19],"crowd_walk_0":[7,24],"crowd_walk_1":[7,25],"crowd_stand":[7,24],"crowd_chat_0":[7,24],"crowd_chat_1":[8,24],"kier_nod":[7,23]},"bg":["4287c416b46fe8ea4c452ea069304843","9e8adc3e9ccee0c9c4e38db94127e0ae"],"plate":"a794946d5d71bc2fa14f40a192adef4d","geo":{"stackTop":1.0,"headTop":16.5,"topsPx":{"ledge_n":2,"ledge_w":1,"shelf":23,"stack":2,"head":33},"bg1":{"cliffLeft":[0,0,30,320],"cliffRight":[160,0,192,320],"openFog":[30,0,160,260],"lamps":[[40,205],[145,245],[174,100]]},"bg2":{"cliffLeft":[0,0,28,320],"cliffRight":[160,0,192,320],"headlandLight":[116,76],"openSea":[30,90,160,260]}}};
MINI_ART.doors={"atlas":"6c4541db0c1f09f389f303b797c65c86","people":"c72f319eb52ca72808e2023a212d355d","rects":{"mirror":[1,1,54,96],"mirror_on":[56,1,54,96],"door_open":[111,1,68,72],"door_half":[180,1,68,70],"door_shut":[249,1,68,70],"grey_open":[318,1,75,64],"grey_shut":[394,1,42,62],"wall":[437,1,64,33],"bar":[502,1,64,10]},"prects":{"pale_down_0":[1,1,16,28],"pale_down_1":[18,1,16,28],"pale_down_2":[35,1,16,28],"pale_up_0":[52,1,16,28],"pale_up_1":[69,1,16,28],"pale_up_2":[86,1,16,28],"pale_left_0":[103,1,16,28],"pale_left_1":[120,1,16,28],"pale_left_2":[137,1,16,28],"pale_right_0":[154,1,16,28],"pale_right_1":[171,1,16,28],"pale_right_2":[188,1,16,28],"pale_idle_down":[205,1,16,28],"pale_idle_wave":[222,1,16,28],"pale_idle_heart":[239,1,16,28],"pale_idle_lantern":[256,1,16,28],"ov_flame_gold_idle_lantern":[273,1,16,28],"ov_flame_teal_idle_lantern":[290,1,16,28],"ov_flame_dim_idle_lantern":[307,1,16,28],"sartre_glint":[324,1,16,24],"comp_cat_0":[341,1,10,7],"comp_cat_1":[352,1,10,7],"comp_bird_0":[363,1,7,5],"comp_bird_1":[371,1,7,5],"comp_moth_0":[1,30,5,4],"comp_moth_1":[7,30,5,4]},"pivots":{"pale_down_0":[8,28],"pale_down_1":[8,28],"pale_down_2":[8,28],"pale_up_0":[8,28],"pale_up_1":[8,28],"pale_up_2":[8,28],"pale_left_0":[8,28],"pale_left_1":[8,28],"pale_left_2":[8,28],"pale_right_0":[8,28],"pale_right_1":[8,28],"pale_right_2":[8,28],"pale_idle_down":[8,28],"pale_idle_wave":[8,28],"pale_idle_heart":[8,28],"pale_idle_lantern":[8,28],"ov_flame_gold_idle_lantern":[8,28],"ov_flame_teal_idle_lantern":[8,28],"ov_flame_dim_idle_lantern":[8,28],"comp_bird_0":[3,5],"comp_bird_1":[3,5],"comp_cat_0":[5,7],"comp_cat_1":[5,7],"comp_moth_0":[2,4],"comp_moth_1":[2,4],"sartre_glint":[8,24]},"bg":["2291b8c2838946d9d656be892bc10292"],"plate":"57c7ba3b948fa28e3b310fc85efd5e2d","geo":{"wallsInner":[26,165],"carpet":[76,116],"sconces":[[33,172],[158,172]],"tilePeriodPx":640,"fixedBackdrop":true},"ov":{"x0":0,"y0":38,"w":16,"h":28,"cols":24,"pivot":[8,28],"dirs":["down","up","left","right"],"frames":3,"slots":[["cloak",["crimson","slate","grey"]],["hat",["wide","hood"]],["flame",["gold","teal","dim"]],["hand",["book","staff"]],["scarf",["gold","rose","green","grey"]],["emblem",["star","leaf","wave"]],["boots",["brown","black","red","grey"]],["pack",["satchel","letters","basket"]],["hem",["gold","crimson","teal","grey"]]],"off":{"cloak":0,"hat":36,"flame":60,"hand":96,"scarf":120,"emblem":168,"boots":204,"pack":252,"hem":288},"note":"i = off[slot] + optIndex*12 + dirIndex*3 + frame; emblem exists for down only"}};
MINI_ART.leap.wood={"atlas":"cbadd3149b3ef6ac9be4e296e4973cfc","rects":{"ledge_n":[315,1,96,79],"ledge_w":[202,1,112,89],"shelf":[1,1,200,177],"ledge_s":[412,1,80,67]},"surfPx":{"ledge_n":35,"ledge_w":53,"shelf":69,"ledge_s":36},"bottomPx":{"ledge_n":78,"ledge_w":88,"shelf":155,"ledge_s":66},"shelfFeetPx":80,"shelfRailPx":[42,60],"note":"Phase 45A: wooden platforms for Stages I-II (Stage III keeps stack/head from the old atlas). surfPx = top of the planks from the top of the piece, +-2 px. Ropes go up past the top edge."}; /* Phase 45B */
MINI_ART.doors.round={"bg":"bbeb3d5c2e9ffa96310c208a225354f7","atlas":"babb86417cb69ec4488e44ad926b4cb3","rects":{"door_open":[711,1,44,66],"door_shut":[756,1,44,66],"door_grey":[801,1,44,66],"mirror":[1,1,46,67],"mirror_on":[48,1,46,67],"pane_0":[95,1,76,67],"pane_1":[172,1,76,67],"pane_2":[249,1,76,67],"pane_3":[326,1,76,67],"pane_4":[403,1,76,67],"pane_5":[480,1,76,67],"pane_6":[557,1,76,67],"pane_7":[634,1,76,67]},"geo":{"centerPx":[192,320],"outerRPx":192,"floorRPx":160,"doorRPx":170,"wallPx":[24,32],"window":{"x":116,"y":186,"w":152,"h":268,"cols":2,"rows":4,"dimAlpha":0.28},"mirrorDeg":22.5,"candles":["NE","NW","SE","SW"]},"note":"Phase 45A: the Round Room. Pixels. Door at angle th (0=N, clockwise): (192+r*sin th, 320-r*cos th), rotated by th, r=170. Panes row-major 0 1 / 2 3 / 4 5 / 6 7."}; /* Phase 45B */
/* MINI_ART:END */
/* GAME:leap:BEGIN */
(function(){
{ /* The Leap (Kierkegaard). Plan 5, Phase 40B. Helper: none (its own input). Art: MINI_ART.leap */
const ID="leap",D2R=Math.PI/180;
/* TP: feet line below the top of each piece, in units (wood: surface y + about 14 px, shelf feet line y 80 px). WD: pieces from the wood atlas. */
const TP={n:26,w:31.5,k:1,h:16.5,sh:40},NM={n:"ledge_n",w:"ledge_w",k:"stack",h:"head",sh:"shelf"},WD={n:1,w:1,sh:1};
/* the marker: sweep seconds (one end of the arc to the other) and the gold share of the arc, for each stage; MR is the arc radius */
const SW=[1.4,1.2,1.0],ZW=[.3,.24,.2],MR=22;
const GR=[1.5,1.2,1.0],GSH=1.0,FOGA=[.55,.9,.9];
const L1=[[44,0,56,"w"],[132,-58],[56,-116],[140,-176],[92,-236]];
const KS=[[40,0],[120,-30],[52,-62],[136,-96],[64,-128],[128,-160]],HEAD=[96,-230];
const mk=(x,y,w,k,o)=>Object.assign({x,y,w,k},o||{});
const gy=s=>s.onShelf?s.led.y+30:s.led.y;
const A=()=>MINI_ART[ID];
const IMG=id=>{const e=id&&mImgE(id);return e&&e.ok?e.img:null};
let FG=null;const SIL={};
/* ---- sounds: soft code voices (tick = the marker enters the gold; leap = a full leap; hop = a short, soft hop; stage and done mark the start of a stage and the finish) ---- */
if(typeof SFX!=="undefined"&&typeof aTone==="function"&&!SFX.leap_tick){Object.assign(SFX,{
  leap_tick:()=>aTone(AN(19),.07,{v:.05,type:"triangle",lp:2400}),
  leap_leap:()=>{aTone(AN(12),.16,{to:AN(24),v:.07,type:"triangle",lp:2200});aNoise(.3,{f:500,to:2400,q:.5,a:.06,v:.07})},
  leap_hop:()=>{aTone(AN(-5),.14,{to:AN(-11),v:.06,lp:900});aNoise(.15,{type:"lowpass",f:700,to:300,q:.4,v:.05})},
  leap_stage:()=>aArp([0,4,7],.09,{d:.14,v:.05,lp:2200}),
  leap_done:()=>aArp([0,4,7,12,16],.13,{d:.35,v:.06,lp:2600}),
  leap_jump:()=>aNoise(.3,{f:500,to:2400,q:.5,a:.06,v:.07}),
  leap_land:()=>{aTone(AN(-12),.14,{to:AN(-18),v:.1,type:"triangle",lp:800});aNoise(.07,{f:900,q:.8,v:.05})},
  leap_cushion:()=>aNoise(.45,{type:"lowpass",f:900,to:350,q:.4,a:.08,v:.08}),
  leap_nudge:()=>{aTone(AN(-14),.14,{v:.1,type:"triangle",lp:420});aNoise(.08,{type:"lowpass",f:500,v:.05})},
  leap_wave:()=>aNoise(.55,{f:1800,to:600,q:.4,a:.12,v:.06})});
  if(typeof GAP!=="undefined"){GAP.leap_tick=.08;GAP.leap_stage=.5;GAP.leap_done=1}}
/* ---- art helpers ---- */
const pcs=function(c,n,x,y,o){o=o||{};const a=A(),W=o.wd?a&&a.wood:a,r=W&&W.rects&&W.rects[n],im=W&&IMG(W.atlas);if(!r||!im)return false;
  const w=r[2]/2*(o.sx||1),h=r[3]/2*(o.sy||1),ga=c.globalAlpha;if(o.a!=null)c.globalAlpha=ga*o.a;
  c.drawImage(im,r[0],r[1],r[2],r[3],hs(x-(o.ax==null?.5:o.ax)*w),hs(y-(o.ay||0)*h),w,h);c.globalAlpha=ga;return true}
const ppl=function(c,n,x,y,o){const a=A(),r=a&&a.prects&&a.prects[n],pv=a&&a.pivots&&a.pivots[n],im=a&&IMG(a.people);if(!r||!pv||!im)return false;o=o||{};
  const ga=c.globalAlpha;if(o.a!=null)c.globalAlpha=ga*o.a;let src=im,sx=r[0],sy=r[1];
  if(o.sil){const k=n,cv=SIL[k]||(SIL[k]=(()=>{const q=document.createElement("canvas");q.width=r[2];q.height=r[3];const x2=q.getContext("2d");x2.drawImage(im,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);x2.globalCompositeOperation="source-in";x2.fillStyle="#0d0814";x2.fillRect(0,0,r[2],r[3]);return q})());src=cv;sx=0;sy=0}
  if(o.flip){c.save();c.translate(hs(x),hs(y));c.scale(-1,1);c.drawImage(src,sx,sy,r[2],r[3],-pv[0],-pv[1],r[2],r[3]);c.restore()}
  else c.drawImage(src,sx,sy,r[2],r[3],hs(x)-pv[0],hs(y)-pv[1],r[2],r[3]);
  c.globalAlpha=ga;return true}
const fbFig=function(c,x,y,col,flip,a,sil){c.save();c.globalAlpha=a==null?1:a;c.fillStyle=sil?"#0d0814":col;c.fillRect(hs(x-4),hs(y-13),8,13);c.fillRect(hs(x-3),hs(y-18),6,6);
  if(!sil){c.fillStyle="#100B15";c.fillRect(hs(x+(flip?-3:1)),hs(y-16),2,2)}c.restore()}
/* ---- one ledge (a wooden hanging platform, a sea stack, the headland, the crowd's wooden pier); with no art: plain boards with the lead line ---- */
const drawLedge=function(c,L,a){const k=L.k;
  if(pcs(c,NM[k],L.x,L.y-TP[k],{ax:.5,a,wd:WD[k]}))return;
  c.save();c.globalAlpha=a==null?1:a;
  if(WD[k]){const w=L.w,sh=k==="sh",x0=hs(L.x-w/2),y0=hs(L.y-(sh?6:8)),h=sh?24:16;
    c.fillStyle="#5a3f35";c.fillRect(x0,y0,w,h);c.fillStyle="#7a5646";c.fillRect(x0,y0,w,3);
    c.fillStyle="#100B15";for(let x=x0+8;x<x0+w-2;x+=8)c.fillRect(x,y0,1,h);c.fillRect(x0,y0+h-2,w,2);
    if(sh){c.fillRect(x0+2,y0-14,2,14);c.fillRect(x0+w-4,y0-14,2,14);c.fillRect(x0+2,y0-10,w-4,1)}else for(const x of[x0+3,x0+w-4])c.fillRect(x,y0-14,1,14);
    c.strokeStyle="#100B15";c.lineWidth=1;c.strokeRect(x0+.5,y0+.5,w-1,h-1)}
  else{const w=k==="k"?26:110;
    c.fillStyle="#3a3046";c.fillRect(hs(L.x-w/2),hs(L.y),w,k==="k"?60:26);c.fillStyle="#6a5a78";c.fillRect(hs(L.x-w/2),hs(L.y),w,2);
    if(k==="h"){c.fillStyle="#4F7E3E";c.fillRect(hs(L.x-w/2),hs(L.y-1),w,3)}}
  c.restore()}
/* ---- fog: one cached full-size layer, three drifting bands, holes where a ledge appears ---- */
const fogInit=function(){if(FG)return;const mkc=(w,h)=>{const q=document.createElement("canvas");q.width=w;q.height=h;return q};FG={fc:mkc(192,320),band:[]};
  for(let i=0;i<3;i++){const b=mkc(384,110),x=b.getContext("2d");for(let k=0;k<9;k++){const px=(k*47+i*83)%384,py=48+((k*29+i*11)%16),r=30+((k*13+i*7)%20);
      for(const o of[-384,0,384]){const g=x.createRadialGradient(px+o,py,0,px+o,py,r);g.addColorStop(0,"rgba(200,196,222,.6)");g.addColorStop(1,"rgba(200,196,222,0)");x.fillStyle=g;x.fillRect(px+o-r,py-r,r*2,r*2)}}FG.band.push(b)}}
const fogDraw=function(c,s,A0,holes,full,dp){fogInit();const f=FG.fc,x=f.getContext("2d");x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation="source-over";x.globalAlpha=1;x.clearRect(0,0,192,320);
  const g=x.createLinearGradient(0,0,0,150);g.addColorStop(0,`rgba(112,108,136,${A0})`);g.addColorStop(.78,`rgba(112,108,136,${A0})`);g.addColorStop(1,"rgba(112,108,136,0)");x.fillStyle=g;x.fillRect(0,0,192,150);
  for(let i=0;i<3;i++){const off=s.rm?i*97:((s.t*6*(i%2?-1:1)+i*131)%384+384)%384;x.globalAlpha=Math.min(1,A0*.7);for(const o of[0,384])x.drawImage(FG.band[i],hs(-off+o),hs(-20+i*45))}
  x.globalAlpha=1;if(full>0){x.fillStyle=`rgba(116,112,142,${full})`;x.fillRect(0,0,192,320)}
  x.globalCompositeOperation="destination-out";
  for(const h of holes){const q=x.createRadialGradient(h.x,h.y,0,h.x,h.y,h.r);q.addColorStop(0,`rgba(0,0,0,${h.a})`);q.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=q;x.fillRect(h.x-h.r,h.y-h.r,h.r*2,h.r*2)}
  if(dp>0){const ch=dp*360,q=x.createLinearGradient(0,ch-60,0,ch);q.addColorStop(0,"rgba(0,0,0,1)");q.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=q;x.fillRect(0,0,192,ch)}
  c.drawImage(f,0,0)}
/* ---- backdrop at 1.1 scale with a slow parallax ---- */
const bgImg=function(c,i,sh,a){const b=A()&&A().bg,im=b&&IMG(b[i]);if(!im)return false;const ga=c.globalAlpha;c.globalAlpha=ga*a;c.imageSmoothingEnabled=true;c.drawImage(im,-9.6,-sh,211.2,352);c.imageSmoothingEnabled=false;c.globalAlpha=ga;return true}
const bgDraw=function(c,s,k2){const sh=clamp(.12*(s.cam0-s.cam),0,32);let ok=bgImg(c,0,sh,1);
  if(!ok){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#3a2038");g.addColorStop(.6,"#1c1626");g.addColorStop(1,"#0e0a14");c.fillStyle=g;c.fillRect(-10,-10,212,340);c.fillStyle="#1a1422";c.fillRect(-10,-10,40,340);c.fillRect(160,-10,40,340)}
  if(k2>0){if(!bgImg(c,1,sh,k2)){c.globalAlpha=k2;const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#2a2030");g.addColorStop(.5,"#142238");g.addColorStop(1,"#0a1020");c.fillStyle=g;c.fillRect(-10,-10,212,340);c.fillStyle="#1a1422";c.fillRect(-10,-10,38,340);c.fillRect(160,-10,40,340);c.globalAlpha=1}}}
/* ---- state ---- */
const build=function(s,n){s.ph="ground";s.lp=null;s.nud=null;s.nudA=0;s.hop=null;s.fl=null;s.figs=[];s.shf=null;s.figCd=0;s.side=0;s.onShelf=false;s.landT=0;s.tgA=0;s.tg=null;s.d=0;s.e=0;s.mu=0;s.md=1;s.inZ=false;s.zp=0;s.fm=null;s.tDown=false;s.sinkT=0;s.fz=0;s.ff=0;s.dp=0;s.dawn=0;s.hA=0;
  if(n===0){s.leds=L1.map((q,i)=>mk(q[0],q[1],q[2]||48,q[3]||"n",{i}));s.idx=0;s.led=s.leds[0];s.hist=[s.led];s.bgK=0}
  else if(n===1){s.led=mk(92,-236,48,"n",{lvl:0});s.hist=[s.led];s.bgK=0;if(s.cam0==null||s.cam0>-226)s.cam0=-226}
  else{s.ks=KS.map((q,i)=>mk(q[0],q[1],26,"k",{i,y0:q[1]}));s.ki=0;s.led=s.ks[0];s.hist=[s.led];s.bgK=0;s.sunk=0;s.head=mk(HEAD[0],HEAD[1],110,"h")}
  s.x=s.px=s.led.x;s.py=s.led.y;s.face=1;s.cam=s.camFrom=s.camTo=s.led.y-226;s.camT=1;if(n!==1)s.cam0=s.cam}
const setup=function(s,n){s.st=n;s.stT=0;build(s,n)}
const tgtX=function(s){if(s.st===0)return s.leds[s.idx+1]&&s.leds[s.idx+1].x;if(s.st===1)return s.onShelf?s.led.x:s.side?clamp(s.led.x+s.side*72,28,164):null;
  return s.ki<5?s.ks[s.ki+1].x:s.head.x}
const getTarget=function(s,short){if(s.st===0)return s.leds[s.idx+1]||null;
  if(s.st===1){if(s.onShelf)return s.led;let sd=s.side;if(!sd){if(!short)return null;sd=clamp(s.led.x+72,28,164)-s.led.x>=s.led.x-clamp(s.led.x-72,28,164)?1:-1}
    return mk(clamp(s.led.x+sd*72,28,164),s.led.y-58,48,"n",{lvl:s.led.lvl+1})}
  return s.ki<5?s.ks[s.ki+1]:s.head}
const env=function(s,dt){s.rA+=dt*55;while(s.rA>=1){s.rA--;pRain(s.R,1,"rgba(180,175,215,.5)",-40)}pStep(s.R,dt,s.rm);pStep(s.P,dt,s.rm);
  s.ltT-=dt;if(s.ltT<=0){s.ltT=6+Math.random()*6;s.lt=.5}s.lt=Math.max(0,s.lt-dt);s.zp=Math.max(0,s.zp-dt);if(s.fm){s.fm.t+=dt;if(s.fm.t>.6)s.fm=null}
  if(s.st===2&&s.bgK<1)s.bgK=Math.min(1,s.bgK+dt/1.5);
  if(s.camT<1){s.camT=Math.min(1,s.camT+dt/.8);s.cam=lerp(s.camFrom,s.camTo,E.out(s.camT))}
  if(s.st===2&&s.led&&s.led.k==="k"&&s.ph!=="leap"){const L=s.led;s.sinkT+=dt;
    if(s.sinkT>1.5&&s.sunk<11.999){const m=Math.min(4*dt,12-s.sunk);s.sunk+=m;L.y+=m;if(s.sunk>11.999){s.sunk=12;L.y=L.y0+12;spray(s,L,10);sfx("leap_wave")}}
    else if(s.sunk>=12&&((s.sinkT*3)|0)!==(((s.sinkT-dt)*3)|0))spray(s,L,s.rm?1:3)}
  const d=s.d;s.rot=s.rm?0:3*D2R*d*Math.sin(2.2*s.t);s.swx=s.rm?0:2*d*Math.sin(1.3*s.t)}
const spray=function(s,L,n){pSparks(s.P,L.x+(Math.random()-.5)*16,L.y,s.rm?Math.min(n,2):n,"rgba(215,230,245,.9)",34)}
const crowdOn=function(s){return (s.st===0&&s.idx>=2)||s.st===1}
const span=function(s){return s.onShelf?[54,138]:[s.led.x-s.led.w/2,s.led.x+s.led.w/2]}
const figs=function(s,dt){s.figCd=Math.max(0,s.figCd-dt);
  for(const f of s.figs){f.t+=dt;if(f.fade)f.a-=dt/.4;else if(f.a<1)f.a=Math.min(1,f.a+dt/.3);
    if(f.m==="walk"&&!f.fade){f.dir=Math.sign(s.x-f.x)||1;f.x+=f.dir*18*dt;if(Math.abs(s.x-f.x)<8&&!s.nud&&s.ph==="ground")nudge(s,f)}
    else if(f.m==="go"){const k=clamp(f.t/.3,0,1);f.x=lerp(f.x0,f.gx,E.out(k));if(k>=1)f.m="stand"}}
  s.figs=s.figs.filter(f=>f.a>0);
  if(crowdOn(s)&&s.ph==="ground"&&!s.nud&&s.d>=.6&&s.figCd<=0&&s.figs.filter(f=>!f.fade).length<2&&!s.figs.some(f=>f.m==="walk")){
    const[lo,hi]=span(s),tx=tgtX(s),ref=tx==null?s.x:tx,fromLo=Math.abs(lo-ref)>=Math.abs(hi-ref);
    s.figs.push({x:fromLo?lo:hi,y:gy(s),m:"walk",a:0,t:0,dir:fromLo?1:-1,face:1});s.figCd=2.5}}
const nudge=function(s,f){const tx=tgtX(s);let away=tx==null||tx===s.x?Math.sign(f.x-s.x)||1:-Math.sign(tx-s.x);const[lo,hi]=span(s);
  const x1=clamp(s.x+away*10,lo+3,hi-3);s.nud={t:0,x0:s.x,x1};s.nudA=.45;s.face=-away;
  f.m="go";f.t=0;f.x0=f.x;f.gx=clamp(x1+away*10,lo-4,hi+4);f.face=-away;
  s.mu=0;s.md=1;s.inZ=false;s.nudges++;s.e=0;s.d=0;s.figCd=2.5;sfx("leap_nudge");pDust(s.P,s.x,gy(s),3,"rgba(160,160,175,.6)")}
const takeoff=function(s,tg,short,c0){const fin=!short&&s.st===2&&s.ki===5&&!s.onShelf,T=fin?1.8:.9;
  s.lp={x0:s.x,y0:gy(s),dx:tg.x-s.x,dy:tg.y-gy(s),t:0,T,h:fin?50:34,tg,fin,short:!!short,c:c0,back:s.onShelf};
  s.face=Math.sign(tg.x-s.x)||s.face;s.ph=short?"short":"leap";s.hop=null;s.nud=null;if(fin)s.fz=0;
  for(const f of s.figs)f.fade=true;if(!s.rm)pDust(s.P,s.x,gy(s),4);sfx(short?"leap_hop":"leap_leap")}
const lpos=function(lp,u,h){return{x:lp.x0+lp.dx*u,y:lp.y0+lp.dy*u-h*4*u*(1-u)}}
/* a tap froze the marker at m (0 = left end, 1 = right end): in the gold = a full leap; outside = the short, soft hop (c = how close, 0.15 .. 0.9) */
const inZ=(s,m)=>Math.abs(m-.5)<=ZW[s.st]/2+1e-9;
const tapGo=function(s,m){const z=inZ(s,m);s.fm={m,t:0,full:z};
  if(z){const tg=getTarget(s,false);if(!tg){s.hop={t:0};sfx("leap_hop");return}s.leaps++;takeoff(s,tg,false,1)}
  else{const tg=getTarget(s,true);if(!tg)return;s.shorts++;takeoff(s,tg,true,.9-.75*Math.min(1,(Math.abs(m-.5)-ZW[s.st]/2)/(.5-ZW[s.st]/2)));if(typeof miniTry==="function")miniTry()}}
const land=function(s,tg,fin){const back=tg===s.led;s.led=tg;s.x=s.px=tg.x;s.py=tg.y;s.onShelf=false;s.ph="ground";s.d=0;s.e=0;s.side=0;s.landT=.22;s.lp=null;s.tg=null;s.tgA=0;s.hop=null;s.mu=0;s.md=1;s.inZ=false;s.fm=null;
  sfx("leap_land");if(!s.rm||1)pDust(s.P,s.x,tg.y,4);
  if(!back){s.hist.push(tg);s.nl++;if(tg.k==="k"){tg.y0=tg.y;s.sunk=0;s.sinkT=0}}
  s.camFrom=s.cam;s.camTo=(tg.k==="k"&&tg.y0!=null?tg.y0:tg.y)-226;s.camT=0;
  if(back)return null;
  if(s.st===0){s.idx++;if(s.idx===4){stageUp(s);sfx("leap_stage");s.led.lvl=0;s.led.k="n"}}
  else if(s.st===1){if(tg.lvl>=5){stageUp(s);sfx("leap_stage");s.tr={t:0,mid:false}}}
  else{if(tg.k==="k")s.ki=tg.i;if(fin){sfx("leap_done");return "win"}}
  return null}
const trans=function(s,dt){const r=s.tr;r.t+=dt;if(!r.mid&&r.t>=.35){r.mid=true;build(s,2);s.nl++}if(r.t>=.7)s.tr=null;return null}
const ground=function(s,dt,inp,dn){const G=s.onShelf?GSH:GR[s.st],sd=s.st===1&&!s.onShelf;s.e+=dt;s.landT=Math.max(0,s.landT-dt);s.nudA=Math.max(0,s.nudA-dt);
  if(s.nud){s.nud.t+=dt;s.x=lerp(s.nud.x0,s.nud.x1,E.out(clamp(s.nud.t/.3,0,1)));if(s.nud.t>=.3)s.nud=null}
  if(s.hop){s.hop.t+=dt;if(s.hop.t>=.4)s.hop=null}
  /* Either/Or: a side by left/right input or a 12-unit slide; a tap on the shelf (or B) steps down */
  if(sd){let want=0;if(inp.dx<=-.5||inp.lTap)want=-1;else if(inp.dx>=.5||inp.rTap)want=1;
    if(dn&&s.tDown&&Math.abs(dn.x-s.fx0)>=12){want=dn.x<s.fx0?-1:1;s.slid=true}
    if(want&&want!==s.side){if(s.side)s.d=Math.min(1,s.d+.15);s.side=want;s.face=want}
    const tapSh=(inp.taps||[]).some(q=>typeof q.x==="number"&&shelfHit(s,q));
    if((inp.bTap||tapSh)&&!s.nud){s.downs++;for(const f of s.figs)f.fade=true;s.ph="step";s.lp={x0:s.x,y0:s.led.y,x1:clamp(s.x,84,108),y1:s.led.y+30,t:0,T:.5};s.hop=null;s.tDown=false;sfx("leap_jump");return}}
  /* the tap: A, Space, Z, Enter, or a finger above y 250. In Stage II a finger counts on release (a slide of 12 units picks a side instead); the marker it froze is the one seen at the press */
  let tm=null;if(inp.aTap)tm=s.mu;
  for(const q of inp.taps||[])if(typeof q.x==="number"&&q.y<250&&!shelfHit(s,q)){if(sd){if(!s.tDown){s.tDown=true;s.fx0=q.x;s.tM=s.mu;s.slid=false}}else if(tm==null)tm=s.mu}
  const up=(inp.ups||[])[0];
  if(s.tDown&&up){if(!s.slid&&Math.abs(up.x-s.fx0)<12)tm=s.tM;s.tDown=false}else if(s.tDown&&!dn)s.tDown=false;
  if(tm!=null&&!s.nud){tapGo(s,tm);if(s.ph!=="ground")return}
  /* dizziness: waiting on a ledge raises it after the grace time; it speeds the marker up */
  if(s.e>=G&&!s.nud)s.d=Math.min(1,s.d+.25*dt);
  if(s.nud){s.mu=0;s.md=1}else{s.mu+=s.md*dt*(1+.6*s.d)/SW[s.st];if(s.mu>=1){s.mu=2-s.mu;s.md=-1}else if(s.mu<=0){s.mu=-s.mu;s.md=1}s.mu=clamp(s.mu,0,1)}
  const iz=inZ(s,s.mu);if(iz&&!s.inZ){s.zp=.25;sfx("leap_tick")}s.inZ=iz;
  s.tgA=s.st===0&&iz&&s.leds[s.idx+1]?0.3:0}
const shelfHit=function(s,q){if(s.st!==1||s.onShelf||s.ph!=="ground")return false;const y=s.led.y+30-s.cam;return q.x>=46&&q.x<=146&&Math.abs(q.y-y)<=11}
const air=function(s,dt){const lp=s.lp;lp.t+=dt;const u=Math.min(1,lp.t/lp.T);s.d=Math.max(0,s.d-dt);s.e=0;
  if(s.ph==="step"){const p=lpos({x0:lp.x0,y0:lp.y0,dx:lp.x1-lp.x0,dy:lp.y1-lp.y0},u,10);s.px=p.x;s.py=p.y;
    if(u>=1){s.ph="ground";s.onShelf=true;s.x=lp.x1;s.px=s.x;s.e=0;s.d=0;s.lp=null;s.landT=.2;s.mu=0;s.md=1;s.inZ=false;s.fm=null;sfx("leap_land");pDust(s.P,s.x,s.led.y+30,3)}return null}
  if(s.ph==="leap"){const p=lpos(lp,u,lp.h);s.px=p.x;s.py=p.y;s.x=p.x;
    const tg=lp.tg;let a;
    if(lp.fin){const t=lp.t,T=lp.T;s.fz=t;a=clamp((t-.7*T)/(.3*T),0,1);s.ff=clamp((t-.3*T)/.12,0,1)*.95*(t<.7*T?1:1-a);s.dp=a;s.dawn=a;s.hA=a}
    else if(s.st===0||lp.back)a=lp.back?1:Math.max(lp.c>=1?.3:0,clamp(u/.3,0,1));
    else a=clamp((lp.t-.45*lp.T)/.15,0,1);
    s.tgA=a;s.tg=tg;
    if(u>=1)return land(s,tg,lp.fin);return null}
  if(s.ph==="short"){const p=lpos(lp,Math.min(u,.55),34*lp.c);s.px=p.x;s.py=p.y;
    s.tgA=s.st===0?clamp(u/.3,0,1):clamp((lp.t-.45*lp.T)/.15,0,1);s.tg=lp.tg;
    if(u>=.55){s.ph="float";s.fl={t:0,x1:p.x,y1:p.y,k:0};pSparks(s.P,p.x,p.y+2,s.rm?3:9,"rgba(235,235,245,.9)",30);sfx("leap_cushion");s.tg=null;s.tgA=0}return null}
  if(s.ph==="float"){const f=s.fl;f.t+=dt;const k=Math.min(1,f.t/1.2);f.k=k;const e=E.sine(k),ty=gy(s),tx=lp.x0;
    s.px=lerp(f.x1,tx,e)+Math.sin(Math.PI*k)*8*(Math.sign(lp.dx)||1);s.py=Math.min(ty,lerp(f.y1,ty,e));
    if(k>=1){s.ph="ground";s.x=s.px=tx;s.py=ty;s.fl=null;s.lp=null;s.e=0;s.d=0;s.landT=.2;s.mu=0;s.md=1;s.inZ=false;s.fm=null;sfx("leap_land");pDust(s.P,tx,ty,3)}}
  return null}
const G={
  who:"kierkegaard",title:"The Leap",land:"l1",
  setup:["Stand at an edge long enough and you get dizzy. In The Concept of Anxiety I called that ‘the dizziness of freedom.’","You won’t see where you land before you jump. No one does. Gather your courage, and go."],
  how:"Tap when the marker is in the gold.",
  goal:"Leap from ledge to ledge, across the fog, to the far light.",
  ctl:"Tap when the marker is in the gold; slide to pick a side (A or Space to leap, arrows to pick).",
  win:"You leapt without seeing. That’s the only way anyone really commits.",
  walk:"Take the ring. Choosing one life with your whole heart means letting another go.",
  stages:["The Edge","Either/Or","Over Deep Water"],
  lines:[null,"Two ways, both hidden. The crowd’s ledge is easy to see. That isn’t a reason.","Nothing holds still out here. Faith isn’t one leap. You make it again and again."],
  geo:{TP,SW,ZW,MR,WD},
  pad:true,ab:true,limit:150,long:false,bloomT:3.5,
  fl:["You made it across.","You leapt more than you waited.","Every leap whole-hearted, and no one had to hold you back."],
  flNext:["Tap while the marker is in the gold.","Leap before the crowd comes, and stay off their shelf."],
  rate:s=>s.shorts<=1&&s.nudges===0&&s.downs===0?3:s.shorts<=3&&s.nudges<=2?2:1,
  init(s){Object.assign(s,{st:0,stT:0,shorts:0,nudges:0,downs:0,leaps:0,nl:1,P:pfx(),R:pfx(),rA:0,ltT:5+Math.random()*4,lt:0,slid:false,tM:0,fx0:0,tr:null,rot:0,swx:0,cam0:null,sunk:0});
    {const w=A()&&A().wood;if(w)IMG(w.atlas)}build(s,0);for(let i=0;i<40;i++){s.rA+=2;while(s.rA>=1){s.rA--;pRain(s.R,1,"rgba(180,175,215,.5)",-40)}pStep(s.R,.05,false)}},
  toStage(s,n){G.init(s);if(n>=1){s.nl=5;setup(s,1)}if(n>=2){s.nl=11;setup(s,2)}},
  step(s,dt,inp){s.stT+=dt;env(s,dt);if(s.tr)return trans(s,dt);
    const dn=inp.down&&typeof inp.down.x==="number"?inp.down:null;let r=null;
    if(s.ph==="ground"){ground(s,dt,inp,dn);if(s.ph==="ground"){figs(s,dt);s.px=s.x;const k=s.hop?s.hop.t/.4:0;s.py=gy(s)-(s.hop?5*4*k*(1-k):0)}}
    else{figs(s,dt);r=air(s,dt)}
    if(s.st===0&&s.ph==="ground"&&s.tgA===0)s.tg=null;
    return r},
  draw(s,c,t){fogInit();c.fillStyle="#120c1a";c.fillRect(0,0,192,320);
    const wx=s.px,wy=s.py-s.cam,fin=s.lp&&s.lp.fin&&s.ph==="leap";
    c.save();if(!s.rm&&s.d>0){c.translate(wx+s.swx,wy);c.rotate(s.rot);c.translate(-wx,-wy)}
    bgDraw(c,s,s.st===2?s.bgK:0);c.translate(0,-s.cam);world(c,s,t);c.restore();
    pDraw(c,s.R,ID);
    if(s.lt>0&&!s.rm&&!(typeof CALM!=="undefined"&&CALM))glow(c,150,24,170,"rgba(235,215,255,.9)",.16*Math.sin(Math.PI*(1-s.lt/.5)));
    const holes=[];if(s.tg&&s.tgA>0&&!fin)holes.push({x:s.tg.x,y:s.tg.y-s.cam,r:30,a:s.tgA});
    fogDraw(c,s,Math.min(1,FOGA[s.st]*(1-.75*s.dawn)+(s.rm?.2*s.d:0)),holes,s.ff,s.dp);
    if(s.st===0&&s.ph==="ground"&&s.tgA>0){const q=s.leds[s.idx+1];if(q){drawLedge(c,mk(q.x,q.y-s.cam,q.w,q.k),.3)}}
    if(fin&&s.ff>0){const k=s.ff/.95;c.save();c.globalAlpha=Math.min(1,k*1.5)*(1-s.dp*.8);c.translate(0,-s.cam);drawW(c,s,t,true);c.restore();ringDraw(c,s,t,s.px,s.py-s.cam-9,1,1,true)}
    if(s.tr){grade(c,"#0b0710",s.tr.t<.35?s.tr.t/.35:1-(s.tr.t-.35)/.35)}
    if(s.dawn>0)gradeN(c,"dawn",.32*s.dawn);
    vignette(c,.22);if(s.rm&&s.d>0)vignette(c,.4*s.d)},
  bloom(s,c,k,t){bloom(s,c,k,t)},
  auto(s,inp){if(s.tr||s.ph!=="ground"||s.nud)return;if(s.st===1&&!s.onShelf)inp.dx=1;if(Math.abs(s.mu-.5)<=ZW[s.st]/2-.03)inp.aTap=true},
  shotReady:s=>(s.ph==="leap"&&s.lp&&s.lp.t>.5)||(s.ph==="ground"&&s.inZ),
  release(){for(const k in SIL)delete SIL[k];FG=null}
};
MINI.leap=G;
/* ---- the Wanderer, the others, the ring ---- */
const drawW=function(c,s,t,sil){const x=s.px,y=s.py,fl=s.face<0,ph=s.ph;let n=null;
  if(ph==="leap"||ph==="short"||ph==="step")n="w_leap";else if(ph==="float")n="w_cushion";
  else if(s.nudA>0)n="w_nudged";else if(s.landT>0)n="w_land";
  if(!sil&&ph==="ground"&&!n){if(mSprO(c,"wanderer_down_0",hs(x)-8,hs(y)-24))return}
  if(!n){if(sil){fbFig(c,x,y,"",fl,1,1);return}if(ppl(c,"w_land",x,y,{flip:fl}))return;fbFig(c,x,y,"#2F7470",fl);return}
  if(ppl(c,n,x,y,{flip:fl,sil}))return;fbFig(c,x,y-(ph==="ground"?0:0),"#2F7470",fl,1,sil)}
const ringDraw=function(c,s,t,x,y,a,k,fin){c.save();c.globalAlpha=a==null?1:a;
  const full=k>=1,pul=full&&!s.rm?1+.05*(1-Math.cos(2*Math.PI*t/500)):1,rr=12*pul;
  c.strokeStyle="rgba(16,11,21,.45)";c.lineWidth=2.6;c.beginPath();c.arc(x,y,rr,0,Math.PI*2);c.stroke();
  if(fin){ring(c,x,y,12,Math.min(1,k*2),"#F5C66A",2);if(k>.5){c.strokeStyle="rgba(16,11,21,.45)";c.beginPath();c.arc(x,y,16,0,Math.PI*2);c.stroke();ring(c,x,y,16,Math.min(1,k*2-1),"#FFE9A8",2)}}
  else ring(c,x,y,rr,k,"#F5C66A",2);
  if(full){glow(c,x,y,s.rm?16+4*Math.sin(t/700):16,"rgba(245,198,106,.9)",s.rm?.35+.15*Math.sin(t/700):.3);
    c.strokeStyle="#FFF4C8";c.lineWidth=1;c.beginPath();const gx=x,gy2=y-rr;c.moveTo(gx-3,gy2);c.lineTo(gx+3,gy2);c.moveTo(gx,gy2-3);c.lineTo(gx,gy2+3);c.stroke()}
  c.restore()}
/* the marker: a half-ring arc over the Wanderer's head with a gold zone at its middle and a bright bead that swings along it; a tap freezes the bead (it fades while he leaps) */
const markDraw=function(c,s,t){const fm=s.fm,on=s.ph==="ground";if(!on&&!fm)return;const a=on?1:1-clamp(fm.t/.6,0,1);if(a<=0)return;
  const m=on?s.mu:fm.m,z=ZW[s.st],u0=.5-z/2,u1=.5+z/2,cx=hs(clamp(s.px,MR+6,186-MR)),cy=hs(s.py-16),pa=u=>Math.PI*(u-1),pop=on&&s.inZ;
  c.save();c.globalAlpha=a;c.translate(cx,cy);if(!s.rm)c.rotate(s.rot*3);
  const arc=(w,col,a0,a1)=>{c.lineWidth=w;c.strokeStyle=col;c.beginPath();c.arc(0,0,MR,pa(a0),pa(a1));c.stroke()};
  arc(9,"#100B15",0,1);arc(5,"#4a3a5c",0,1);
  if(s.zp>0&&!s.rm)glow(c,0,-MR,16,"rgba(245,198,106,.9)",.5*s.zp/.25);
  arc(11,"#100B15",u0,u1);arc(8,"#D9A93A",u0,u1);arc(4,"#F5C66A",u0,u1);
  const bx=MR*Math.cos(pa(m)),by=MR*Math.sin(pa(m)),r=pop?5.5:4.5;
  if(pop)glow(c,bx,by,14,"rgba(245,198,106,.9)",.55);
  c.fillStyle="#100B15";c.beginPath();c.arc(bx,by,r+1.5,0,Math.PI*2);c.fill();
  c.fillStyle=pop?"#FFE9A8":"#F2EAF8";c.beginPath();c.arc(bx,by,r,0,Math.PI*2);c.fill();
  if(pop){c.strokeStyle="#FFF4C8";c.lineWidth=1;c.beginPath();c.moveTo(bx-8,by);c.lineTo(bx+8,by);c.moveTo(bx,by-8);c.lineTo(bx,by+8);c.stroke()}
  if(!on&&fm.full&&!s.rm){c.strokeStyle="#FFF4C8";c.lineWidth=1.5;c.beginPath();c.arc(bx,by,6+fm.t*24,0,Math.PI*2);c.stroke()}
  c.restore()}
const drawFig=function(c,f,t,sh){const a=.85*clamp(f.a,0,1);let n=f.m==="walk"||f.m==="go"?"crowd_walk_"+(((f.t*4)|0)%2):f.m==="chat"?"crowd_chat_"+(((t/900+f.ph)|0)%2):"crowd_stand";
  const flip=f.m==="walk"?f.dir<0:f.face<0;c.save();if(!ppl(c,n,f.x,f.y,{flip,a})){mShadow(c,f.x,f.y,10,.3);fbFig(c,f.x,f.y,"#6B6F7A",flip,a)}c.restore()}
const kier=function(c,x,y,t,nod,a){c.save();if(a!=null)c.globalAlpha=a;mShadow(c,x,y,10,.35);
  if(nod&&ppl(c,"kier_nod",x,y,{}));else if(!mSprO(c,"kierkegaard_"+(((t/900)|0)%2),hs(x)-8,hs(y)-24))fbFig(c,x,y,"#2a2438",false);c.restore()}
const world=function(c,s,t){
  if(s.st===1){const sy=s.led.y+30;drawLedge(c,mk(96,sy,100,"sh"));
    glow(c,117,sy-24,28,"rgba(255,190,100,.9)",.35);
    if(!s.shf)s.shf=[58,72,120,132].map((x,i)=>({x,y:sy,m:"chat",a:1,t:0,ph:i*.5,face:i<2?1:-1}));for(const f of s.shf){f.y=sy;drawFig(c,f,t)}}
  const H=s.hist,vis=y=>y-s.cam>-50&&y-s.cam<370;
  for(const L of H)if(vis(L.y))drawLedge(c,L);
  if(s.st===2){if(s.hA>0)drawLedge(c,s.head,s.hA);
    const sy=260+s.cam;c.save();{const g=c.createLinearGradient(0,sy-10,0,sy+6);g.addColorStop(0,"rgba(8,16,36,0)");g.addColorStop(1,"rgba(8,16,36,.55)");c.fillStyle=g;c.fillRect(-10,sy-10,212,16);c.fillStyle="rgba(8,16,36,.55)";c.fillRect(-10,sy+6,212,120)}
    for(let i=0;i<3;i++)wave(c,0,sy+3+i*9,192,2+i,3+i,(s.rm?0:t/900*(1+i*.3))+i,1.2,i?"rgba(150,170,205,.35)":"rgba(215,230,245,.5)",1);c.restore()}
  if(s.st===0)kier(c,17,L1[0][1],t,false);
  if(s.st===2&&s.hA>0){glow(c,s.head.x-44,s.head.y-18,30,"rgba(255,190,100,.9)",.4*s.hA);kier(c,s.head.x-30,s.head.y,t,false,s.hA)}
  if(s.tg&&s.tgA>0&&s.ph!=="ground")drawLedge(c,s.tg,s.tgA);
  for(const f of s.figs)if(f.m!=="walk"||true)drawFig(c,f,t);
  if(s.st===1&&!s.onShelf&&s.ph==="ground")chev(c,s,t);
  const X=s.px,Y=s.py;
  if(s.ph==="float")puff(c,s);
  if(s.ph==="ground"||s.ph==="float")mShadow(c,X,s.ph==="ground"?Y:gy(s),10,.35);
  drawW(c,s,t,false);
  markDraw(c,s,t);
  if(s.lp&&(s.ph==="leap"||s.ph==="short")&&(s.lp.fin||s.lp.t<.5)){const a=s.lp.fin?1:1-s.lp.t/.5;ringDraw(c,s,t,X,Y-9,a,s.lp.fin?1:(s.lp.c||1),s.lp.fin)}
  pDraw(c,s.P,ID)}
const puff=function(c,s){const f=s.fl;if(!f)return;const k=Math.min(1,f.t/1.2),sq=f.t<.2?.55+.45*f.t/.2:1,x=s.px,y=s.py+3,a=1-clamp((k-.6)/.4,0,1);
  if(!pcs(c,"puff",x,y,{ax:.5,ay:.7,sy:sq,sx:2-sq,a})){c.save();c.globalAlpha=a*.8;c.fillStyle="#E8E8F2";c.beginPath();c.ellipse(x,y,14*(2-sq),6*sq,0,0,Math.PI*2);c.fill();c.restore()}}
const chev=function(c,s,t){const L=s.led,y=L.y-7;c.save();c.lineCap="round";
  for(const sd of[-1,1]){const on=s.side===sd,x=L.x+sd*(L.w/2+8),p=on&&!s.rm?1+.12*Math.sin(t/180):1;
    c.strokeStyle=on?"#F5C66A":"rgba(255,233,184,.5)";c.lineWidth=on?2:1;if(on)glow(c,x,y,10,"rgba(245,198,106,.9)",.5);
    c.beginPath();c.moveTo(x-sd*3*p,y-5*p);c.lineTo(x+sd*3*p,y);c.lineTo(x-sd*3*p,y+5*p);c.stroke()}c.restore()}
/* ---- the bloom: fog drains, the landings light a zigzag stair, the ring rises to (96, 70), Kierkegaard nods ---- */
const bloom=function(s,c,k,t){const L=s._fl||1,tA=k*3.5,rm=s.rm;fogInit();
  if(!s._bm){s._bm=1;s.PB=pfx();s._bt=t}const dt=clamp((t-s._bt)/1000,0,.05);s._bt=t;
  c.fillStyle="#120c1a";c.fillRect(0,0,192,320);bgDraw(c,{cam0:0,cam:0},1);
  gradeN(c,"dawn",.32);glow(c,116,76,26,"rgba(255,190,100,.9)",.35);
  const hy=226,hx=96,off=rm?0:-70*(1-E.out(clamp(tA/.8,0,1)));c.save();c.translate(0,off);drawLedge(c,mk(hx,hy,110,"h"));glow(c,hx-44,hy-18,30,"rgba(255,190,100,.9)",.4);
  const N=clamp(s.nl||6,6,18),nod=tA>1.4&&tA<2.6;kier(c,hx-30,hy,t,nod);
  const px=hx;mShadow(c,px,hy,10,.35);if(!mSprO(c,"wanderer_down_0",hs(px)-8,hy-24))fbFig(c,px,hy,"#2F7470",false);
  for(let i=0;i<N;i++){const f=i/(N-1),y=hy-12-f*138,x=96+(i%2?1:-1)*(20-9*f),at=i*.08,a=rm?1:clamp((tA-at)/.25,0,1);if(a<=0)continue;
    const dim=L===1?.45:L===2?.8:1,tn=mTint(ID,"ledge_n","#F5C66A",.65);c.save();c.globalAlpha=a*(.55+.45*dim);
    if(!(tn&&mCanvas(c,tn,x,y,{ax:.5,ay:0,sc:.4}))){c.fillStyle="#D9A93A";c.fillRect(hs(x-9),hs(y),18,3)}c.restore();
    glow(c,x,y,13,"rgba(245,198,106,.9)",.28*dim*a)}
  c.restore();
  const p=rm?1:E.out(clamp((tA-1.2)/1.3,0,1)),rx=96,ry=lerp(hy-9+off,70,p),rr=lerp(12,24,p);
  if(L>=2&&p>0)for(let i=-2;i<=2;i++)shaft(c,rx,ry,190,34,i*.22,"rgba(255,225,160,.9)",.1*p*(L===3?1.3:1));
  glow(c,rx,ry,rr+10,"rgba(245,198,106,.9)",.35*p+.15);c.save();c.strokeStyle="#F5C66A";c.lineWidth=lerp(2,3,p);c.beginPath();c.arc(rx,ry,rr,0,Math.PI*2);c.stroke();c.restore();pcs(c,"ring",rx,ry,{ax:.5,ay:.5,sx:.6+.5*p,sy:.6+.5*p,a:.8*p});
  if(L>=3&&!rm){if(s.PB.list.length<30&&Math.random()<.5)pMotes(s.PB,1,"#FFE3A0",[40,60,112,180]);pStep(s.PB,dt,false);pDraw(c,s.PB,ID)}
  else if(L>=3&&rm&&!s.PB.list.length)pMotes(s.PB,12,"#FFE3A0",[40,60,112,180]);
  if(L>=3&&rm)pDraw(c,s.PB,ID);
  const dr=rm?1:E.out(clamp(tA/1.2,0,1));if(dr<1){c.save();c.translate(0,dr*330);fogDraw(c,{rm:1,t:0},.225*(1-dr),[],0,0);c.restore()}
  vignette(c,.22)}
}
})();
/* GAME:leap:END */
/* GAME:doors:BEGIN */
(function(){
/* ---- Phase 45B: The Round Room, Sartre's "Round Spectacles" (a rebuild of the Hall of Doors, full game) ----
   Idea check: playing this, you feel the light round each open door running out while you decide, that waiting still lands you somewhere
   (the last door to shut turns grey and your pane goes grey), and that each door you walk through lights one pane of a window
   until the whole window shows the person you made. That is Sartre's idea that existence precedes essence: you show up first and then
   define yourself by your choices, you cannot avoid choosing (not choosing is also a choice), and in choosing you show others what a person can be.
   Stages: I Nothing Yet (2 choices, 2 doors, 10 s) / II Choosing for All (3 choices, 3 doors, 7 s, six townsfolk follow you, the mirror glows)
   / III No Way Back (3 choices, 3 doors, 5 s, one door far across the room, every door you used is barred) -> the mirror lights and the window shows the person you made.
   Helper: none (own input). Art: MINI_ART.doors.round (the room backdrop and atlas, drawn in place) and MINI_ART.doors.people (the townsfolk). */
{
  const SPD=44,CX=96,CY=160,FR=78,DR=85,PI=Math.PI,LEAD="#100B15",GREY="#8A8A8A",SKIN="#E9D8B8",DIRS=["down","up","left","right"];
  const STG=[0,0,1,1,1,2,2,2],NOP=[2,3,3],TOP=[10,7,5],ROW=[0,1,4,7,9,8,10,11],PRE=[2,6,0,4,1],BT=3.2;
  const GA=[67.5,112.5,157.5,202.5,247.5,292.5].map(d=>d*PI/180);
  const CND=[[59,93],[135,92],[58,229],[134,230]],PW=38,PH=33.5,WX=58,WY=93;
  const PCOL=["#C9607E","#8E3B5A","#F5C66A","#E89AB4","#4A5F7A","#A33A3A","#7FB7E8","#D9A93A"],FBC={door_open:"#C8883A",door_shut:"#4A3224",door_grey:"#8A8A90",mirror:"#9FB8C0",mirror_on:"#FFE9A8"};
  /* colors of each row's options (R1..R12); index 3 is the grey result */
  const COL=[["#A33A3A","#4A5F7A",0,GREY],["#2B2430","#7A5030"],["#F5C66A","#4FB3A9"],["#A33A3A","#8A5A2A"],["#F5C66A","#D46A8C","#5E9E5A",GREY],[SKIN,"#D46A8C","#F5C66A"],
    ["#F5C66A","#7FB7E8","#E89AB4"],["#F5C66A","#5E9E5A","#4FB3A9"],["#7A4A2A","#2A2A30","#B03030",GREY],["#7A5030","#E8DCC0","#C8963C"],["#6A8AAA","#D98A3A","#A890D0"],["#F5C66A","#A33A3A","#4FB3A9",GREY]];
  const rng=a=>()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  /* ---- small drawing helpers ---- */
  const poly=(c,p,f)=>{c.beginPath();p.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.closePath();if(f){c.fillStyle=f;c.fill()}c.strokeStyle=LEAD;c.lineWidth=1;c.stroke()};
  const ell=(c,x,y,rx,ry,f,r)=>{c.beginPath();c.ellipse(x,y,rx,ry,r||0,0,6.3);c.fillStyle=f;c.fill();c.strokeStyle=LEAD;c.lineWidth=.8;c.stroke()};
  const starP=(c,x,y,r,r2)=>{for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r2:r;i?c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q):c.moveTo(x+Math.cos(a)*q,y+Math.sin(a)*q)}c.closePath()};
  /* the item in a doorway: 14 units, code-drawn (row = 0..11, o = option, g = the grey result) */
  function icon(c,row,o,x,y,g){
    c.save();c.translate(hs(x),hs(y));c.lineJoin="round";c.strokeStyle=LEAD;c.lineWidth=1;const f=g?GREY:COL[row][o];
    if(g){ell(c,0,0,6,5,GREY);c.restore();return}
    switch(row){
      case 0:poly(c,[[-3,-7],[3,-7],[7,6],[-7,6]],f);poly(c,[[-3,-7],[0,-4],[3,-7]],LEAD);break;
      case 1:if(o===0){ell(c,0,1,8,2.2,f);c.beginPath();c.arc(0,0,4.5,Math.PI,0);c.fillStyle=f;c.fill();c.stroke();c.fillStyle="#A33A3A";c.fillRect(-4,-1,8,1)}
        else{c.beginPath();c.moveTo(-5,6);c.quadraticCurveTo(-7,-7,0,-7);c.quadraticCurveTo(7,-7,5,6);c.quadraticCurveTo(0,1,-5,6);c.fillStyle=f;c.fill();c.stroke()}break;
      case 2:c.beginPath();c.moveTo(0,-7);c.quadraticCurveTo(6,1,0,6);c.quadraticCurveTo(-6,1,0,-7);c.fillStyle=f;c.fill();c.stroke();ell(c,0,2,1.6,2.4,"#FFF4D0");break;
      case 3:if(o===0){poly(c,[[-5,-4],[5,-4],[5,5],[-5,5]],f);c.fillStyle="#F2E8D0";c.fillRect(-4,-3,3.5,7);c.fillRect(.5,-3,3.5,7)}
        else{c.strokeStyle=LEAD;c.lineWidth=3.4;c.beginPath();c.moveTo(3,-7);c.lineTo(-3,7);c.stroke();c.strokeStyle=f;c.lineWidth=2;c.stroke();dot(c,3,-7,1.6,f)}break;
      case 4:poly(c,[[-7,-3],[-2,-5],[3,-3],[7,-5],[7,-1],[3,1],[-2,-1],[-7,1]],f);poly(c,[[2,1],[6,1],[5,7],[2,6]],f);break;
      case 5:if(o===0){ell(c,0,2,3.5,3,f);c.strokeStyle=f;c.lineWidth=1.4;c.beginPath();c.moveTo(-2,0);c.lineTo(-3,-6);c.moveTo(0,-1);c.lineTo(0,-7);c.moveTo(2,0);c.lineTo(3,-6);c.stroke()}
        else if(o===1){c.beginPath();c.moveTo(0,6);c.bezierCurveTo(-9,-1,-4,-8,0,-3);c.bezierCurveTo(4,-8,9,-1,0,6);c.fillStyle=f;c.fill();c.stroke()}
        else{poly(c,[[-3,-3],[3,-3],[3,5],[-3,5]],"#3A2E44");c.strokeStyle=f;c.lineWidth=1;c.beginPath();c.arc(0,-4,2.5,Math.PI,0);c.stroke();ell(c,0,1,1.6,2.4,f)}break;
      case 6:for(let i=0;i<3;i++){const px=-4+i*4,py=-3+(i%2)*6;if(o===0){c.fillStyle=f;c.fillRect(px-.5,py-3,1,6);c.fillRect(px-3,py-.5,6,1)}else if(o===1)dot(c,px,py,1.8,f);else ell(c,px,py,3,1.6,f,i)}break;
      case 7:if(o===0){c.beginPath();starP(c,0,0,7,3);c.fillStyle=f;c.fill();c.stroke()}
        else if(o===1){c.beginPath();c.moveTo(0,-7);c.quadraticCurveTo(8,0,0,7);c.quadraticCurveTo(-8,0,0,-7);c.fillStyle=f;c.fill();c.stroke();c.beginPath();c.moveTo(0,-5);c.lineTo(0,6);c.stroke()}
        else{c.strokeStyle=LEAD;c.lineWidth=4;c.beginPath();c.moveTo(-7,0);c.quadraticCurveTo(-3.5,-6,0,0);c.quadraticCurveTo(3.5,6,7,0);c.stroke();c.strokeStyle=f;c.lineWidth=2.2;c.stroke()}break;
      case 8:poly(c,[[-4,-7],[1,-7],[1,1],[7,3],[7,7],[-4,7]],f);break;
      case 9:if(o===0){poly(c,[[-6,-3],[6,-3],[7,6],[-6,6]],f);poly(c,[[-6,-3],[6,-3],[3,1],[-3,1]],"#5A3A20")}
        else if(o===1){poly(c,[[-6,-4],[5,-5],[5,0],[-6,0]],f);poly(c,[[-5,1],[6,0],[6,5],[-5,6]],f);c.fillStyle="#A33A3A";c.fillRect(-1,-5,2,11)}
        else{poly(c,[[-7,-2],[7,-2],[5,6],[-5,6]],f);c.strokeStyle=LEAD;c.lineWidth=1;c.beginPath();c.arc(0,-2,5,Math.PI,0);c.stroke()}break;
      case 10:if(o===0){ell(c,0,1,5,3.4,f);poly(c,[[4,-1],[8,0],[4,1]],"#E8B84A")}
        else if(o===1){ell(c,0,2,6,3.6,f);poly(c,[[-5,-1],[-5,-5],[-2,-2]],f);poly(c,[[2,-2],[5,-5],[5,-1]],f)}
        else{ell(c,-3,0,4,2.6,f,-.5);ell(c,3,0,4,2.6,f,.5)}break;
      default:poly(c,[[-7,-2],[7,-2],[8,3],[-8,3]],f);c.fillStyle=LEAD;c.fillRect(-4,0,2,1);c.fillRect(1,0,2,1)}
    c.restore()}
  const dot=(c,x,y,r,f)=>{c.beginPath();c.arc(x,y,r,0,6.3);c.fillStyle=f;c.fill();c.strokeStyle=LEAD;c.lineWidth=.8;c.stroke()};
  /* ---- the sounds (visual cues: leaf swinging, dust puff, pane sparkle, door sliding to grey, mirror glow, steps, bar dropping, Wanderer returning) ---- */
  if(typeof SFX!=="undefined"){
    SFX.doors_creak=()=>{aNoise(.32,{f:420,to:260,q:2,a:.1,v:.045});aTone(AN(-12),.28,{type:"triangle",v:.025,to:AN(-9),lp:900})};
    SFX.doors_shut=()=>{aTone(100,.18,{v:.11,to:58,type:"triangle",lp:700});aNoise(.07,{type:"lowpass",f:380,v:.07})};
    SFX.doors_choose=()=>{aTone(AN(15),.4,{v:.08,type:"triangle"});aTone(AN(22),.6,{v:.08,type:"triangle",at:.09})};
    SFX.doors_grey=()=>aTone(AN(-5),.7,{v:.07,type:"triangle",lp:650,to:AN(-6)});
    SFX.doors_mirror=()=>{aArp([24,28,31,36],.07,{d:.8,v:.04,lp:4200});aNoise(.6,{f:5000,to:2500,q:.4,a:.2,v:.015})};
    SFX.doors_step=()=>aTone(130,.07,{type:"sine",v:.07,to:85,lp:500});
    SFX.doors_steps=()=>{aTone(140,.06,{type:"sine",v:.05,to:90,lp:520});aTone(120,.06,{type:"sine",v:.05,to:80,lp:520,at:.15});aTone(150,.06,{type:"sine",v:.04,to:95,lp:520,at:.3})};
    SFX.doors_bar=()=>{aTone(90,.2,{type:"triangle",v:.1,to:48,lp:600});aNoise(.09,{type:"lowpass",f:700,v:.06})};
    SFX.doors_back=()=>aArp([12,16,19],.06,{d:.35,v:.05,lp:3000});
    if(typeof GAP!=="undefined"){GAP.doors_creak=.2;GAP.doors_shut=.2;GAP.doors_step=.25;GAP.doors_steps=.4;GAP.doors_bar=.3;GAP.doors_back=.4}
  }
  /* ---- the art: the room backdrop and atlas live in MINI_ART.doors.round (pixels; a door is drawn once and rotated to its angle) ---- */
  const R=()=>{const A=MINI_ART.doors;return A&&A.round||null};
  const IMG=k=>{const r=R(),id=r&&r[k];if(!id)return null;const e=mImgE(id);return e&&e.ok?e.img:null};
  const RC=n=>{const r=R();return r&&r.rects?r.rects[n]:null};
  const P=(th,r)=>[CX+r*Math.sin(th),CY-r*Math.cos(th)],TH=i=>i*PI/4,MTH=PI/8;
  const nrm=a=>{a%=PI*2;return a<0?a+PI*2:a},adist=(a,b)=>{const d=Math.abs(nrm(a)-nrm(b));return Math.min(d,PI*2-d)};
  const pcen=k=>[WX+(k&1)*PW+PW/2,WY+(k>>1)*PH+PH/2];
  const GCH={};
  function greyPane(k){let g=GCH[k];if(g)return g;const im=IMG("atlas"),r=RC("pane_"+k);if(!im||!r||typeof document==="undefined")return null;
    g=document.createElement("canvas");g.width=r[2];g.height=r[3];const x=g.getContext("2d");x.drawImage(im,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);
    x.globalCompositeOperation="saturation";x.fillStyle="#808080";x.fillRect(0,0,r[2],r[3]);x.globalCompositeOperation="source-over";x.fillStyle="rgba(40,40,48,.3)";x.fillRect(0,0,r[2],r[3]);return GCH[k]=g}
  /* a piece of the atlas centered at (x,y), rotated by rot; o: a alpha, sx leaf width (hinged on the left), clip (fraction shown from the left) */
  function pc(c,n,x,y,rot,o){o=o||{};const a=o.a==null?1:o.a;if(!(a>0))return;const im=IMG("atlas"),r=RC(n),w=r?r[2]/2:22,h=r?r[3]/2:33;
    c.save();c.globalAlpha*=a;c.translate(x,y);c.rotate(rot);if(o.clip!=null){c.beginPath();c.rect(-w/2,-h/2,w*o.clip,h);c.clip()}
    c.translate(-w/2,0);c.scale(o.sx==null?1:o.sx,1);
    if(im&&r){c.imageSmoothingEnabled=true;c.imageSmoothingQuality="high";c.drawImage(im,r[0],r[1],r[2],r[3],0,-h/2,w,h)}
    else{c.beginPath();c.moveTo(1,h/2);c.lineTo(1,-h/2+8);c.quadraticCurveTo(1,-h/2,w/2,-h/2);c.quadraticCurveTo(w-1,-h/2,w-1,-h/2+8);c.lineTo(w-1,h/2);c.closePath();c.fillStyle=FBC[n]||"#9FB8C0";c.fill();c.strokeStyle=LEAD;c.lineWidth=1;c.stroke()}
    c.restore()}
  /* how a door leaf looks at opening amount o: the leaf swings (width) with the art, or crossfades with Reduce Motion */
  const look=(rm,o)=>rm?{sx:1,sa:1-o,oa:o}:{sx:Math.max(.1,1-o*.9),sa:o<.97?1:0,oa:Math.min(1,o*3)};
  function fbBg(c){c.fillStyle="#0A0610";c.fillRect(0,0,192,320);c.beginPath();c.arc(CX,CY,96,0,6.3);c.fillStyle="#4A3048";c.fill();c.beginPath();c.arc(CX,CY,82,0,6.3);c.fillStyle="#3A2838";c.fill();
    c.strokeStyle="#8A5A3A";c.lineWidth=1;c.beginPath();for(let i=0;i<8;i++){const a=TH(i);c.moveTo(CX,CY);c.lineTo(CX+Math.sin(a)*40,CY-Math.cos(a)*40)}c.stroke()}
  function bgDraw(c){const im=IMG("bg");if(!im)return false;c.drawImage(im,0,0,192,320);return true}
  /* ---- the window (8 panes on the floor) ---- */
  function paneDraw(c,s,k,b){const p=s.pane[k],a=p?p.a:0,g=!!(p&&p.g),x=WX+(k&1)*PW,y=WY+(k>>1)*PH,im=IMG("atlas"),r=RC("pane_"+k);
    c.save();c.globalAlpha=.28+(g?.3:.72)*a;
    if(im&&r){const gc=g?greyPane(k):null;if(gc)c.drawImage(gc,x,y,PW,PH);else c.drawImage(im,r[0],r[1],r[2],r[3],x,y,PW,PH)}
    else{c.fillStyle=g?"#6A6A70":PCOL[k];c.fillRect(x,y,PW,PH);c.strokeStyle=LEAD;c.lineWidth=1;c.strokeRect(x+.5,y+.5,PW-1,PH-1)}
    c.restore();
    if(p&&!g&&a>0)glow(c,x+PW/2,y+PH/2,24,COL[p.row][p.o]||"#F5C66A",.22*a*(1+(b||0)*.6));
    if(p&&p.ic>0){c.save();c.globalAlpha=p.ic;c.translate(x+PW/2,y+PH/2);c.scale(1.35,1.35);c.fillStyle="rgba(16,11,21,.5)";c.beginPath();c.arc(0,0,9,0,6.3);c.fill();icon(c,p.row,p.o,0,0,g);c.restore()}}
  /* ---- the doors and the mirror ---- */
  function doorDraw(c,s,i){const d=s.doors[i],th=TH(i),q=P(th,DR),x=q[0],y=q[1],o=d.o;
    if(d.gA>=1)pc(c,"door_grey",x,y,th);
    else{const l=look(s.rm,o);if(o>0)pc(c,"door_open",x,y,th,{a:l.oa});if(l.sa>0)pc(c,"door_shut",x,y,th,{a:l.sa,sx:l.sx});if(d.gA>0)pc(c,"door_grey",x,y,th,s.rm?{a:d.gA}:{clip:d.gA})}
    if(d.bar>0){const b=d.bar,by=s.rm?3:lerp(-18,3,E.bounce(Math.min(1,b)));c.save();c.translate(x,y);c.rotate(th);c.globalAlpha*=s.rm?b:Math.min(1,b*3);
      c.fillStyle="#3A3A44";c.fillRect(-13,by-2,26,4);c.strokeStyle=LEAD;c.lineWidth=.8;c.strokeRect(-13,by-2,26,4);c.fillStyle="#D9A93A";c.fillRect(-10.5,by-.7,1.4,1.4);c.fillRect(9.1,by-.7,1.4,1.4);c.restore()}}
  function mirrorDraw(c,s){const q=P(MTH,DR),m=Math.max(s.mon,s.mg);pc(c,"mirror",q[0],q[1],MTH);if(m>0){pc(c,"mirror_on",q[0],q[1],MTH,{a:m});glow(c,q[0],q[1],28,"rgba(255,220,150,.9)",.45*m)}}
  /* ---- people ---- */
  function wander(c,s,x,y,fa,mv,t,al){if(!(al>0))return;mShadow(c,x,y,12,.4*al);const f=mv&&!s.rm?1+((t/140)|0)%2:0,ga=c.globalAlpha;c.globalAlpha=ga*al;
    if(!mSprO(c,"wanderer_"+DIRS[fa]+"_"+f,x-8,y-24)){c.fillStyle="#2F7470";c.fillRect(x-5,y-20,10,20);c.fillStyle="#E2BE98";c.fillRect(x-3,y-24,6,5)}c.globalAlpha=ga}
  function folk(c,s,f,t){const a=f.a;if(!(a>0))return;mShadow(c,f.x,f.y,12,.4*a);const fr=f.mv&&!s.rm?1+((t/140)|0)%2:0;
    if(mPerson(c,"doors","pale_"+DIRS[f.fa]+"_"+fr,f.x-8,f.y-28,{a}))return;
    c.save();c.globalAlpha=a;c.fillStyle="#E8E0D0";c.fillRect(f.x-4,f.y-18,8,14);c.beginPath();c.arc(f.x,f.y-21,4,0,6.3);c.fill();c.strokeStyle=LEAD;c.lineWidth=.8;c.strokeRect(f.x-4,f.y-18,8,14);c.restore()}
  /* ---- the world ---- */
  const inDoor=(x,y,i)=>{const th=TH(i),ux=Math.sin(th),uy=-Math.cos(th),vx=x-CX,vy=y-CY;return vx*ux+vy*uy>=68&&Math.abs(-vx*uy+vy*ux)<=10};
  /* where the player stands, as an angle round the wall: the angle of the spot, or (back at the center) of the door last walked through */
  const refAng=s=>{const dx=s.x-CX,dy=s.y-CY;if(Math.hypot(dx,dy)>14)return Math.atan2(dx,-dy);return s.last>=0?TH(s.last):0};
  function setup(s,n){s.st=n;s.stT=0;s.tm=0;s.rn=rng(s.seed!=null?s.seed:(Math.random()*4294967296)|0);
    s.doors=[];for(let i=0;i<8;i++)s.doors.push({o:0,want:0,gA:0,grey:false,used:false,barred:false,bar:0});
    s.pane=Array(8).fill(null);s.k=[0,2,5][n];s.greys=0;s.last=-1;
    for(let k=0;k<s.k;k++){const i=PRE[k];s.doors[i].used=true;s.pane[k]={o:0,row:ROW[k],a:1,ic:1,land:1,g:false};s.last=i}
    if(n===2)s.doors.forEach(d=>{if(d.used){d.barred=true;d.bar=1}});
    s.x=CX;s.y=CY;s.fa=0;s.mv=false;s.pa=1;s.tg=null;s.stp=.2;s.fly=[];s.P=pfx();s.ch=null;s.ph="gap";s.gt=n?.8:1.2;s.pt=0;s.mon=0;s.mg=0;s.mgOn=0;s.mgt=0;s.fT=0;s.fm=0;
    s.fol=GA.map(a=>{const q=P(a,72);return {hx:q[0],hy:q[1],x:q[0],y:q[1],a:n===1?1:0,fa:q[0]<CX?3:2,mv:false}});s.fv=n===1?1:0;
    for(const k in GCH)delete GCH[k];const r=R();if(r){mImgE(r.bg);mImgE(r.atlas)}}
  /* a new choice: the doors that will open, the item each shows, and how long each stays open */
  function begin(s){const k=s.k,n=STG[k],free=[];for(let i=0;i<8;i++){const d=s.doors[i];if(!d.grey&&!(n===2&&d.used))free.push(i)}
    const sh=a=>{for(let i=a.length-1;i>0;i--){const j=(s.rn()*(i+1))|0,q=a[i];a[i]=a[j];a[j]=q}return a};sh(free);let ds=[];
    if(n===2){const ref=refAng(s),far=free.filter(i=>adist(TH(i),ref)>=PI*.75-1e-6);if(far.length)ds.push(far[0]);for(const i of free)if(ds.length<NOP[n]&&ds.indexOf(i)<0)ds.push(i)}
    else ds=free.slice(0,NOP[n]);
    sh(ds);const op=sh([...Array(NOP[n]).keys()]);
    s.ch={k,row:ROW[k],T:TOP[n],t:0,last:null,chosen:null,ds:ds.map((i,j)=>({i,op:op[j],at:j*.25,opened:false,shut:false,left:TOP[n]}))};s.ph="open";
    if(!ds.length)goGrey(s,null)}
  /* waiting: the last door to shut turns grey, and so does this choice's pane. The game goes on without the player. */
  function goGrey(s,cd){if(cd){const d=s.doors[cd.i];d.grey=true;d.want=0}
    s.pane[s.k]={o:0,row:ROW[s.k],a:0,ic:0,land:1,g:true};s.greys++;sfx("doors_grey");if(typeof miniTry==="function")miniTry();s.ph="grey";s.gt=.8}
  function openStep(s,dt){const ch=s.ch;ch.t+=dt;
    for(const cd of ch.ds)if(cd.opened&&!cd.shut&&s.doors[cd.i].o>=.5&&s.pa>=1&&inDoor(s.x,s.y,cd.i)){commit(s,cd);return}
    for(const cd of ch.ds){const d=s.doors[cd.i];
      if(!cd.opened&&ch.t>=cd.at){cd.opened=true;d.want=1;sfx("doors_creak")}
      if(cd.opened&&!cd.shut){cd.left=Math.max(0,ch.T-(ch.t-cd.at));if(cd.left<=0){cd.shut=true;d.want=0;sfx("doors_shut");const q=P(TH(cd.i),70);pDust(s.P,q[0],q[1],s.rm?2:5);ch.last=cd}}}
    if(ch.ds.every(cd=>cd.shut))goGrey(s,ch.last)}
  /* walking through an open door: its item lights this choice's pane, the other doors shut, the Wanderer goes back to the center */
  function commit(s,cd){const ch=s.ch,d=s.doors[cd.i],k=s.k;d.used=true;let any=false;
    for(const o of ch.ds)if(o!==cd&&!o.shut){o.shut=true;if(o.opened){s.doors[o.i].want=0;any=true}}
    if(any)sfx("doors_shut");
    s.pane[k]={o:cd.op,row:ch.row,a:0,ic:0,land:0,g:false};const q=P(TH(cd.i),DR);s.fly.push({k,row:ch.row,op:cd.op,x:q[0],y:q[1],t:0});
    sfx("doors_choose");pSparks(s.P,q[0],q[1],s.rm?3:10,COL[ch.row][cd.op]||"#F5C66A",40);
    ch.chosen=cd;s.ph="post";s.pt=0;s.last=cd.i;s.tg=null;s.pe=s.pb=s.pc=s.pd=s.pm=s.pf=0}
  function postStep(s,dt){const pt=s.pt+=dt,cd=s.ch.chosen,d=s.doors[cd.i],th=TH(cd.i),st2=s.st===1,dc=st2?1.45:.3;
    s.pa=pt<.05?1:pt<.3?1-(pt-.05)/.25:pt<.55?0:pt<.85?(pt-.55)/.3:1;
    if(pt>=.4&&!s.pe){s.pe=1;s.x=CX;s.y=CY;s.fa=0;s.mv=false}
    if(pt>=.55&&!s.pb){s.pb=1;sfx("doors_back");pSparks(s.P,CX,CY-10,s.rm?3:8,"#F5C66A",30)}
    if(pt>=dc&&!s.pc){s.pc=1;d.want=0;sfx("doors_shut");const q=P(th,70);pDust(s.P,q[0],q[1],s.rm?2:5)}
    if(s.st===2&&pt>=dc+.2&&!s.pd){s.pd=1;d.barred=true;sfx("doors_bar")}
    if(st2){const q=P(th,84);
      s.fol.forEach((f,i)=>{const st=.2+.04*i,u=clamp(pt-st,0,1),fo=clamp(pt-st-1,0,.25)/.25;
        if(pt<1.7){const ox=f.x,oy=f.y;f.x=lerp(f.hx,q[0],u);f.y=lerp(f.hy,q[1],u);f.a=1-fo;f.mv=u>0&&u<1;if(f.mv){const mx=f.x-ox,my=f.y-oy;f.fa=Math.abs(mx)>Math.abs(my)?(mx<0?2:3):(my<0?1:0)}}
        else{f.x=f.hx;f.y=f.hy;f.a=clamp((pt-1.7-.03*i)/.4,0,1);f.mv=false;f.fa=f.hx<CX?3:2}});
      for(let b=0;b<3;b++)if(pt>=[.2,.55,.9][b]&&!(s.pf&(1<<b))){s.pf|=1<<b;sfx("doors_steps")}
      if(pt>=1.3&&!s.pm){s.pm=1;s.mgOn=1;s.mgt=0;sfx("doors_mirror")}}
    if(pt>=(st2?2.3:1.0))afterChoice(s)}
  function afterChoice(s,w){s.k++;if(s.k>=8){s.ph="fin";s.fT=0;s.fm=0;return}
    const n=STG[s.k];s.ph="gap";s.gt=w==null?.3:w;
    if(n!==s.st){stageUp(s);s.gt=1.9;if(n===2){let b=0;s.doors.forEach(d=>{if(d.used&&!d.barred){d.barred=true;b=1}});if(b)sfx("doors_bar")}}}
  function finStep(s,dt){s.fT+=dt;if(s.fT>=.4&&!s.fm){s.fm=1;sfx("doors_mirror")}s.mon=s.fm?Math.min(1,(s.fT-.4)/.8):0;return s.fT>=1.8?"win":null}
  /* a spot to walk to: a tap on an open door goes to its doorway; anything else is held inside the floor circle */
  function tgt(s,x,y){if(s.ph==="open"&&s.ch)for(const cd of s.ch.ds)if(cd.opened&&!cd.shut){const q=P(TH(cd.i),DR);if(Math.hypot(x-q[0],y-q[1])<=14)return P(TH(cd.i),FR)}
    const dx=x-CX,dy=y-CY,r=Math.hypot(dx,dy);return r>FR?[CX+dx*FR/r,CY+dy*FR/r]:[x,y]}
  function walk(s,dt,inp){let vx=0,vy=0;const taps=inp.taps&&inp.taps.length?inp.taps:(inp.tap?[inp.tap]:[]),m=Math.hypot(inp.dx,inp.dy);
    if(taps.length){const q=taps[taps.length-1];s.tg=tgt(s,q.x,q.y)}
    if(m>.05){const k=Math.min(1,m)/m;vx=inp.dx*k*SPD;vy=inp.dy*k*SPD;s.tg=null}
    else{if(inp.down)s.tg=tgt(s,inp.down.x,inp.down.y);
      if(s.tg){const dx=s.tg[0]-s.x,dy=s.tg[1]-s.y,d=Math.hypot(dx,dy);if(d<1.2)s.tg=null;else if(dt>0){const sp=Math.min(SPD,d/dt);vx=dx/d*sp;vy=dy/d*sp}}}
    const ox=s.x,oy=s.y;let nx=ox+vx*dt,ny=oy+vy*dt;const r=Math.hypot(nx-CX,ny-CY);if(r>FR){nx=CX+(nx-CX)*FR/r;ny=CY+(ny-CY)*FR/r}
    s.x=nx;s.y=ny;const mx=nx-ox,my=ny-oy;s.mv=Math.hypot(mx,my)>.05;
    if(s.mv){s.fa=Math.abs(mx)>Math.abs(my)?(mx<0?2:3):(my<0?1:0);s.stp+=dt;if(s.stp>.3){s.stp=0;sfx("doors_step")}}else s.stp=.2}
  /* animation that runs in every phase: door leaves, bars, grey slides, panes, items in flight, the six townsfolk, the mirror, particles */
  function anim(s,dt){const dd=dt/(s.rm?.5:.35);
    for(const d of s.doors){d.o=clamp(d.o+(d.want?dd:-dd),0,1);if(d.barred&&d.bar<1)d.bar=Math.min(1,d.bar+dt/.35);if(d.grey&&d.gA<1)d.gA=Math.min(1,d.gA+dt/.5)}
    for(const p of s.pane)if(p){p.a=Math.min(1,p.a+dt/(p.g?.6:.5));if(p.land&&p.ic<1)p.ic=Math.min(1,p.ic+dt/.15)}
    for(const f of s.fly){f.t+=dt;if(f.t>=.5){f.done=1;const p=s.pane[f.k];if(p)p.land=1;const q=pcen(f.k);pSparks(s.P,q[0],q[1],s.rm?3:8,COL[f.row][f.op]||"#F5C66A",34)}}
    s.fly=s.fly.filter(f=>!f.done);
    const tv=s.st===1?1:0;s.fv=tv>s.fv?Math.min(tv,s.fv+dt/.6):Math.max(tv,s.fv-dt/.6);
    if(!(s.ph==="post"&&s.st===1))for(const f of s.fol){f.x=f.hx;f.y=f.hy;f.a=s.fv;f.mv=false}
    if(s.mgOn){s.mgt+=dt;s.mg=Math.sin(PI*Math.min(1,s.mgt/1.4));if(s.mgt>=1.4){s.mgOn=0;s.mg=0}}
    pStep(s.P,dt,s.rm)}
  /* ---- drawing ---- */
  function scene(s,c,t,bl){if(!bgDraw(c))fbBg(c);
    for(const q of CND)glow(c,q[0],q[1],s.rm?13:13+1.2*Math.sin(t/170+q[0]),"rgba(255,190,100,.9)",.2+(s.rm?0:.06*Math.sin(t/130+q[1])));
    for(let k=0;k<8;k++)paneDraw(c,s,k,bl?bl.b:0);
    for(let i=0;i<8;i++)doorDraw(c,s,i);mirrorDraw(c,s);
    const ch=s.ch;
    if(ch&&(s.ph==="open"||s.ph==="post"))for(const cd of ch.ds){if(!cd.opened)continue;const d=s.doors[cd.i],th=TH(cd.i),q=P(th,DR),rc=P(th,74),col=COL[ch.row][cd.op]||"#F5C66A",mine=ch.chosen===cd;
      if(!cd.shut){const fr=clamp(cd.left/ch.T,0,1),rr=4+15*fr;glow(c,rc[0],rc[1],rr+8,col,.16+.14*fr);
        c.save();c.strokeStyle="#F5C66A";c.globalAlpha=.55+.4*fr;c.lineWidth=1.4;if(fr<.25)c.setLineDash([2,2]);c.beginPath();c.arc(rc[0],rc[1],rr,0,6.3);c.stroke();c.restore()}
      if(mine)glow(c,q[0],q[1],14,"#F5C66A",.3*d.o);
      else if(d.o>.05){const a=clamp(d.o*1.4,0,1);glow(c,q[0],q[1],13,col,.3*a);c.save();c.globalAlpha=a;icon(c,ch.row,cd.op,q[0],q[1]+(s.rm?0:Math.sin(t/400+cd.i)*.6),false);c.restore()}}
    const ppl=[];if(s.fv>0||bl)for(const f of s.fol)if(f.a>0)ppl.push({y:f.y,f:()=>folk(c,s,f,t)});
    ppl.push({y:s.y,f:()=>wander(c,s,s.x,s.y,s.fa,s.mv,t,s.pa)});ppl.sort((a,b)=>a.y-b.y).forEach(p=>p.f());
    for(const f of s.fly){const p=E.inOut(clamp(f.t/.5,0,1)),q=pcen(f.k),x=lerp(f.x,q[0],p),y=lerp(f.y,q[1],p)-Math.sin(PI*p)*8,col=COL[f.row][f.op]||"#F5C66A";
      glow(c,x,y,9,col,.5);c.save();c.translate(x,y);c.scale(lerp(1,1.35,p),lerp(1,1.35,p));icon(c,f.row,f.op,0,0,false);c.restore()}
    pDraw(c,s.P,"doors")}
  MINI.doors={who:"sartre",land:"l1",title:"The Round Room",stages:["Nothing Yet","Choosing for All","No Way Back"],
    setup:["A paper knife is made to a plan. You weren’t. You show up first, then you make yourself.","Every door is open. They won’t stay that way."],
    how:"Walk through an open door before its light runs out. Waiting turns it grey.",
    goal:"Walk through an open door before its ring of light runs out.",
    ctl:"Drag or tap to walk; walk into an open door to choose it (arrow keys to walk).",
    lines:[null,"Look behind you. When you choose, you show them what a person can be.","The hall moves on, and no door opens twice. What you’ve done is who you are."],
    win:"There. Nobody designed that figure. You did, one door at a time.",
    walk:"Take the spectacles. I don’t believe anyone drew up a plan for you in advance. So the plan is yours.",
    pad:true,ab:false,bloomT:BT,limit:150,
    fl:["The room chose for you more than once.","You chose almost every door yourself.","Every door was your own choice."],
    flNext:["Waiting picks the grey door for you.","Walk through a door before its ring of light is gone."],
    rate:s=>s.greys===0?3:s.greys<=2?2:1,
    shotReady:s=>s.ph==="open"&&!!s.ch&&s.ch.t>.8&&s.k===[1,3,6][s.st],
    init(s){setup(s,0)},
    toStage(s,n){setup(s,clamp(n|0,0,2))},
    step(s,dt,inp){s.stT+=dt;s.tm+=dt;let res=null;
      if(s.ph==="post"&&s.pt<.9){s.mv=false;s.tg=null}else walk(s,dt,inp);
      anim(s,dt);
      if(s.ph==="gap"){s.gt-=dt;if(s.gt<=0)begin(s)}
      else if(s.ph==="open")openStep(s,dt);
      else if(s.ph==="post")postStep(s,dt);
      else if(s.ph==="grey"){s.gt-=dt;if(s.gt<=0)afterChoice(s,0)}
      else if(s.ph==="fin")res=finStep(s,dt);
      return res},
    draw(s,c,t){scene(s,c,t,null)},
    bloom(s,c,k,t){const rm=s.rm,tk=rm?BT:k*BT,fl=s._fl||1,w=rm?1:E.out(clamp(tk/1.4,0,1));s.mon=1;s.pa=1;
      if(fl>=3){const SP=[[42,CY-44],[42,CY+4],[42,CY+52],[150,CY-44],[150,CY+4],[150,CY+52]],u=rm?1:E.inOut(clamp((tk-1)/1.2,0,1));
        s.fol.forEach((f,i)=>{f.x=lerp(f.hx,SP[i][0],u);f.y=lerp(f.hy,SP[i][1],u);f.a=rm?1:clamp((tk-.8)/.4,0,1);f.mv=!rm&&u>0&&u<1;f.fa=SP[i][0]<CX?3:2})}
      else s.fol.forEach(f=>{f.a=0});
      scene(s,c,t,{b:w});
      for(let q=0;q<8;q++){const p=s.pane[q];if(!p)continue;const f=rm?0:Math.max(0,1-Math.abs(tk-(.25+.2*q))/.45);if(f<=0)continue;const im=IMG("atlas"),r=RC("pane_"+q),x=WX+(q&1)*PW,y=WY+(q>>1)*PH,m=p.g?.3:1;
        if(im&&r){c.save();c.globalCompositeOperation="lighter";c.globalAlpha=.5*f*m;c.drawImage(im,r[0],r[1],r[2],r[3],x,y,PW,PH);c.restore()}
        glow(c,x+PW/2,y+PH/2,26,"rgba(255,226,160,.9)",.4*f*m)}
      glow(c,CX,CY,80,"rgba(255,214,140,.9)",(fl>=2?.34:.22)*w);
      if(fl>=3)s.fol.forEach(f=>{if(f.a>0)glow(c,f.x,f.y-14,13,"#F5C66A",.3*f.a)});
      if(fl>=2&&!rm&&tk>=1.2){const d2=Math.min(.05,Math.max(0,(t-(s._bt||t))/1000));s._bt=t;if(!s._bP)s._bP=pfx();s._ba=(s._ba||0)+d2;
        if(s._ba>.2&&tk<3&&s._bP.list.length<30){s._ba=0;pMotes(s._bP,3,"#FFE3A0",[56,100,80,120])}pStep(s._bP,d2,false);pDraw(c,s._bP,"doors")}},
    auto(s,inp){if(s.ph!=="open"||!s.ch||s.pa<1)return;let bx=null,by=0,bd=1e9;
      for(const cd of s.ch.ds){if(!cd.opened||cd.shut)continue;const q=P(TH(cd.i),FR),d=Math.hypot(q[0]-s.x,q[1]-s.y);if(d<bd){bd=d;bx=q[0];by=q[1]}}
      if(bx!=null&&bd>.5){inp.dx=(bx-s.x)/bd;inp.dy=(by-s.y)/bd}},
    _t:{P,TH,inDoor,refAng,pcen,adist,look,FR,CX,CY,PRE,ROW,GA}
  };
}
})();
/* GAME:doors:END */
MINI_LOADED.f1=true;
