/* The Leap (leap): Kierkegaard, Level I. Plan 6 pilot (Phase 49B), brief C.1 of examined-life-build-plan-6.md.
   One painted game = this one file (PAINT.game). Art: Phase 49A, in a/ (numbers in claude/examined-life-49a-leap-art.md).
   Pattern (style guide section 15): constants and art map, then the rules (init, setStage, step with input, actions, stage parts),
   then the view (build makes the display objects once, view and bloom draw only from the state), then auto and rate.
   World units: 360 x 780 design space; layers are 640 x 1100 units (cover) and the camera only moves in y (230..550).
   Rules: tap with the bead in the gold = full leap; outside = short hop (shorts++). Dizziness d rises after a grace time and speeds the bead.
   Stage I: 4 leaps up wooden ledges; a grey figure nudges you when you wait (from ledge 3, d >= .6). Ring.
   Stage II: 5 leaps up a fog wall; lean left or right (either side works); changing your lean costs (waver); the crowd's shelf below (downs). Books.
   Stage III: 5 sea stacks that sink, a bell whose tolls add dizziness, then the last leap: no gold, any tap leaps, a bridge of light. Bell. */
(function(){const P=window.PAINT,W=360,H=780;
const ART={far:"34867c0173109d1bd6b130ade5ebcd82.webp",mid:"70ad1fdea14d8507bc42dce35fde9d31.webp",pa:"3e68d40960a5ce81cc357e7180c9e5e6.webp",pb:"644f938143c597f7b9654f1d459ec6a8.webp",
  near:"17d7930ca0b9c86476fbbaaacde127fe.webp",atl:"2df0fa4ae497884a0c94fb0bfd068b8d.webp",plate:"738dbc4636abffbb24054e54c4afeee6.webp",walk:"722a3398001272ffef27395bfcc9f0e9.webp",
  pose:"9d7451870644829abfc1aa5584cea2de.webp",kidle:"3db249cbbfec255da5b810e93124c857.webp",knod:"3378954410b09121718e5a2eb1df4b06.webp",man:"87715277a01b7d4ee9bd9562ca9a933c.webp",woman:"d0be94205802ee707210f09e44e45928.webp"};
/* atlas rects [x,y,w,h] in px; drawn at scale .5 (game size = half) */
const R={"ledge-narrow":[980,428,220,103],"ledge-wide":[1324,428,360,102],shelf:[2,428,600,264],"sea-stack":[2,2,260,424],"book-crimson":[1942,2,80,65],"book-plum":[1930,428,80,65],
  "book-slate":[2,694,80,65],ring:[84,694,64,53],bell:[604,428,120,160],"fog-strip":[264,2,1280,312],"splash-1":[1808,428,120,90],"splash-2":[1202,428,120,103],"splash-3":[858,428,120,109],
  "splash-4":[1686,428,120,100],"wisp-1":[1810,2,130,170],"wisp-2":[726,428,130,154],"wisp-3":[1546,2,130,194],"wisp-4":[1678,2,130,176]};
const ST=[{sw:1.4,gz:.30,gr:1.5},{sw:1.2,gz:.24,gr:1.2},{sw:1.0,gz:.20,gr:1.0}]; /* sweep s (one pass end to end), gold share, grace s */
const S1=[[180,660],[262,555],[118,450],[255,345],[150,240]]; /* Stage I ledges: feet x,y (world units) */
const S2Y=[560,465,370,275,180,85],S2X=[110,250],SHELF=115; /* Stage II levels; two hidden ledges per level; shelf surface below the ledge */
const S3=[[165,700,1],[262,630,.93],[170,560,.86],[268,490,.79],[178,420,.72],[260,350,.66]],HEAD=[285,38],KX=325,KY=36; /* Stage III stacks x,y,scale; headland; Kierkegaard */
const OFS=[80,40,80],CAM=[230,550],THUMB=660; /* camera: focus y minus OFS; taps below y 660 (screen) are the thumb zone */
const GOLD=0xF5C66A,LEAD=0x100B15,GREY=0xA9A8B6,VIOLET=0x6E4AA8;
const cl=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,k)=>a+(b-a)*k,eo=k=>1-Math.pow(1-k,3),eio=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
const snd=n=>{if(typeof sfx==="function")try{sfx("lp6_"+n)}catch(e){}};
/* sounds (code synth, short and soft; each has a visual cue in view) */
if(typeof SFX!=="undefined"&&typeof aTone==="function"&&!SFX.lp6_tick){Object.assign(SFX,{
  lp6_tick:()=>aTone(AN(19),.06,{v:.035,type:"triangle",lp:2400}),
  lp6_gold:()=>{aArp([0,4,7,12],.05,{d:.5,v:.055,lp:2600});aNoise(.3,{f:500,to:2400,q:.5,a:.06,v:.045})},
  lp6_hop:()=>{aTone(AN(-8),.12,{to:AN(-13),v:.06,lp:700});aNoise(.12,{type:"lowpass",f:600,to:250,q:.4,v:.05})},
  lp6_land:()=>{aTone(AN(-12),.14,{to:AN(-18),v:.08,type:"triangle",lp:800});aNoise(.07,{f:900,q:.8,v:.04})},
  lp6_nudge:()=>{aNoise(.5,{type:"bandpass",f:320,to:220,q:1.2,a:.1,v:.06});aTone(AN(-16),.3,{v:.05,type:"triangle",lp:420})},
  lp6_book:()=>aNoise(.35,{type:"highpass",f:2600,to:4200,q:.5,a:.08,v:.025}),
  lp6_lean:()=>aTone(AN(7),.08,{v:.03,type:"triangle",lp:1800}),
  lp6_fog:()=>{aNoise(.7,{type:"lowpass",f:700,to:1600,q:.3,a:.25,v:.05});aTone(AN(7),.5,{v:.03,type:"triangle",lp:1600,at:.15})},
  lp6_down:()=>aTone(AN(-5),.18,{to:AN(-12),v:.05,lp:900}),
  lp6_splash:()=>aNoise(.45,{f:1600,to:500,q:.4,a:.06,v:.045}),
  lp6_bell:()=>{aTone(AN(-17),2,{v:.07,type:"triangle",lp:900});aTone(AN(-16.6),1.6,{v:.04,type:"triangle",lp:700});aTone(AN(-17)*2.37,1.1,{v:.025,lp:1400})},
  lp6_ring:()=>aArp([12,19,24],.08,{d:.5,v:.05,lp:3400}),
  lp6_last:()=>aArp([0,7,12,16,19],.12,{d:1.6,v:.055,lp:2800})});
  if(typeof GAP!=="undefined"){GAP.lp6_tick=.08;GAP.lp6_bell=1}}

/* ---------- rules ---------- */
function spotOf(s,i){if(s.st===0)return{x:S1[i][0],y:S1[i][1]};
  if(s.st===1)return{x:i===0?180:S2X[s.ch[i]<0?0:1],y:S2Y[i]};
  return i>5?{x:HEAD[0],y:HEAD[1]}:{x:S3[i][0],y:topY(s,i)}}
/* leap height: a straight line plus a hop of h; a tall leap (the last one) rises onto the target without overshooting */
function arcY(a,k){return lerp(a.y0,a.y1,k)-4*a.h*k*(1-k)}
function topY(s,i){return S3[i][1]+12*eo(cl(s.sinkT[i]/.6,0,1))}
function setStage(s,n){s.st=n;s.stT=0;s.ci=0;s.d=0;s.onT=0;s.q=0;s.passI=-1;s.stShorts=0;s.lean=0;s.leanSet=false;s.onShelf=false;s.crowd=null;s.out=null;s.pend=null;s.sl=0;
  s.ch=[0,0,0,0,0,0];s.form=[1,0,0,0,0,0];s.sinkT=[0,0,0,0,0,0];s.stackT=0;s.bellT=1.5;s.bellSw=0;s.gust=null;s.spl=[];s.lastMode=false;s.goldK=1;s.dawn=0;s.bridge=0;
  s.bk={i:0,t:0,side:1};s.ring=0;s.books=0;s.glint=0;s.path=[0];
  const p=spotOf(s,0);s.w={x:p.x,y:p.y,face:1,pose:"idle",a:null,sq:0};s.shelfY=s.st===1?S2Y[0]+SHELF:0}
function goStage(s,n){if(typeof stageUp==="function")stageUp(s,n);setStage(s,n)} /* stageUp (page) gives the cleared stage's artifact and shows the banner */
const rnd=s=>{s.seed=(s.seed*16807)%2147483647;return s.seed/2147483647};
function bead(s){const q=s.q%2;return q<1?q:2-q} /* 0 = left end, 1 = right end */
function inGold(s){return Math.abs(bead(s)-.5)<=ST[s.st].gz/2}
const ready=s=>!s.w.a&&!s.out&&!(s.crowd&&s.crowd.push);

/* a press of the leap control: tp = screen point, or null for A / Z / Space */
function press(s,tp){if(s.st===1&&tp&&ready(s)){s.pend={t:s.t,q:s.q};return} /* Stage II: a touch waits for its release, so a slide can lean instead */
  commit(s,s.t,s.q)}
/* the tap counts at the moment of the press (t, bead phase q). Mash guard: within .25 s of the last tap, or a 3rd tap in one sweep = a short */
function commit(s,t,q){const lm=s.lastMode;let short=false;s.pend=null;
  if(!lm){if(t-s.lastTap<.25)short=true;const pi=q|0;if(pi!==s.passI){s.passI=pi;s.passTaps=0}if(ready(s)&&++s.passTaps>2)short=true}
  s.lastTap=t;if(!ready(s))return;
  const b=q%2<1?q%2:2-q%2,ok=lm||(!short&&Math.abs(b-.5)<=ST[s.st].gz/2);
  if(ok)leap(s);else hop(s)}
function leap(s){const w=s.w;let to,k="leap",air=.55,h=40;
  if(s.st===1&&s.onShelf){to=spotOf(s,s.ci);k="up"}
  else if(s.st===1){const side=s.leanSet?s.lean:(w.face||1);s.ch[s.ci+1]=side;to=spotOf(s,s.ci+1);snd("fog")}
  else if(s.st===2&&s.lastMode){to={x:HEAD[0],y:HEAD[1]};air=1.35;h=60;k="last";snd("last")}
  else to=spotOf(s,s.ci+1);
  w.face=to.x>=w.x?1:-1;w.a={k,t:0,g:.15,air,l:.12,x0:w.x,y0:w.y,x1:to.x,y1:to.y,h};s.d=0;s.leaps++;s.crowd=s.crowd&&!s.crowd.push?null:s.crowd;
  if(k!=="last")snd("gold");s.fx.push(["gold",w.x,w.y])}
function hop(s){s.shorts++;s.stShorts++;if(s.stShorts%3===0&&typeof miniTry==="function")miniTry();
  s.w.a={k:"hop",t:0,d:.25,x0:s.w.x,y0:s.w.y};snd("hop");s.fx.push(["dust",s.w.x,s.w.y])}
function stepDown(s){if(s.st!==1||s.onShelf||!ready(s))return;s.downs++;s.onShelf=true;s.pend=null;
  const w=s.w;w.face=-1;w.a={k:"down",t:0,d:.45,x0:w.x,y0:w.y,x1:105,y1:S2Y[s.ci]+SHELF,h:14};snd("down")}
function setLean(s,v){if(s.st!==1||s.onShelf||!v||s.lean===v&&s.leanSet)return;
  if(s.leanSet){s.waver++;s.d=Math.min(1,s.d+.3)}s.lean=v;s.leanSet=true;if(!s.w.a)s.w.face=v;snd("lean")}
function landed(s,a){const w=s.w;w.x=a.x1;w.y=a.y1;w.a={k:"land",t:0,d:a.l||.12};s.q=0;s.passI=-1;s.onT=0;snd("land");s.fx.push(["land",w.x,w.y]);
  if(a.k==="up"){s.onShelf=false;s.leanSet=false;s.lean=0;return}
  if(a.k==="last"){s.ci=6;s.out={k:"dawn",t:0};return}
  s.ci++;s.form[s.ci]=1;s.path.push(s.ci);s.leanSet=false;s.lean=0;s.stackT=0;
  if(s.st===0&&s.ci>=4)s.out={k:"ring",t:0};
  if(s.st===1&&s.ci>=5)s.out={k:"books",t:0};
  if(s.st===2&&s.ci>=5)s.lastMode=true}
/* one action at a time on the Wanderer: leap/up/last (gather, air, land), hop, down, nudge, land */
function stepAct(s,dt){const w=s.w,a=w.a;if(!a){w.pose="idle";w.sq=0;return}a.t+=dt;
  if(a.k==="leap"||a.k==="up"||a.k==="last"){const tg=a.g,ta=a.air;
    if(a.t<tg){w.pose="gather";w.sq=.12*Math.sin(Math.PI*a.t/tg)}
    else if(a.t<tg+ta){const k=(a.t-tg)/ta,e=eio(k);w.pose="leap";w.sq=0;w.x=lerp(a.x0,a.x1,e);w.y=arcY(a,k);
      if(s.st===1&&a.k==="leap")s.form[s.ci+1]=cl((k-.45)/.55,0,1);
      if(a.k==="last"){s.bridge=k;s.dawn=Math.max(s.dawn,.5*k)}}
    else landed(s,a);return}
  if(a.k==="hop"){const k=a.t/a.d;w.pose="hop";w.y=a.y0-12*4*k*(1-k);if(k>=1){w.y=a.y0;w.a=null}return}
  if(a.k==="down"){const k=Math.min(1,a.t/a.d),top=Math.min(a.y0,a.y1)-a.h;w.pose=k<.8?"hop":"land";w.x=lerp(a.x0,a.x1,eio(k));w.y=(1-k)*(1-k)*a.y0+2*(1-k)*k*top+k*k*a.y1;
    if(k>=1){w.x=a.x1;w.y=a.y1;w.a={k:"land",t:0,d:.12};s.q=0;s.passI=-1}return}
  if(a.k==="nudge"){const sp=spotOf(s,s.ci),k=a.t;w.pose=k<.3?"nudged":"idle";w.x=sp.x+a.dir*10*(k<.3?eo(k/.3):1-eio(cl((k-.3)/.5,0,1)));if(k>=.8){w.x=sp.x;w.a=null}return}
  if(a.k==="land"){w.pose="land";w.sq=-.1*(1-a.t/a.d);if(a.t>=a.d){w.a=null;w.pose="idle";w.sq=0}return}}
/* Stage I: the grey crowd figure steps onto your ledge and nudges you if you wait (from the 3rd ledge, d >= .6) */
function stepCrowd(s,dt){const c=s.crowd;
  if(!c){if(ready(s)&&s.ci>=2&&s.ci<4&&s.d>=.6){const nx=S1[s.ci+1][0];s.crowd={t:0,side:nx>S1[s.ci][0]?-1:1,push:false,done:false}}return}
  c.t+=dt;if(c.t>=.5&&!c.done){c.done=true;c.push=true;s.nudges++;s.q=0;s.passI=-1;s.d=0;s.onT=0;s.w.a={k:"nudge",t:0,dir:-c.side};snd("nudge");s.fx.push(["nudge",s.w.x,s.w.y])}
  if(c.push&&!s.w.a)c.push=false;if(c.t>=1.9)s.crowd=null}
/* Stage II: three books glow in turn, each lighting one side for 1 s: voices, not answers */
function stepBooks(s,dt){const b=s.bk;b.t+=dt;if(b.t>=1.5){b.t-=1.5;b.i=(b.i+1)%3;b.side=rnd(s)<.5?-1:1;if(!s.out)snd("book")}
  s.shelfY+=((S2Y[s.ci]+SHELF)-s.shelfY)*Math.min(1,dt*5)}
/* Stage III: stacks sink 12 units after 1.5 s; the bell tolls every 4 s and its gust adds .2 dizziness */
function stepSea(s,dt){if(s.ci<=5&&!s.w.a){s.stackT+=dt;if(s.stackT>=1.5&&!s.sinkT[s.ci]){s.sinkT[s.ci]=1e-4;snd("splash");s.spl.push({x:S3[s.ci][0],y:S3[s.ci][1]+18,t:0})}}
  for(let i=0;i<6;i++)if(s.sinkT[i]>0&&s.sinkT[i]<.6)s.sinkT[i]+=dt;
  if(s.ci<=5&&!s.w.a)s.w.y=topY(s,s.ci);
  for(const p of s.spl)p.t+=dt;s.spl=s.spl.filter(p=>p.t<.8);
  if(s.bellSw>0)s.bellSw=Math.max(0,s.bellSw-dt/2.4);
  if(s.gust){s.gust.t+=dt;if(s.gust.t>=1.8)s.gust=null}
  if(s.ci<=5&&!s.out){s.bellT+=dt;if(s.bellT>=4){s.bellT-=4;s.tolls++;s.bellSw=1;snd("bell");s.gust={t:0,y:s.w.y-70};if(!s.lastMode)s.d=Math.min(1,s.d+.2)}}
  if(s.lastMode)s.goldK=Math.max(0,s.goldK-dt)}
function stepOut(s,dt){const o=s.out;o.t+=dt;
  if(o.k==="ring"){s.ring=o.t;if(o.t>=.6&&!o.snd){o.snd=1;snd("ring")}if(o.t>=1.8){goStage(s,1);return}}
  else if(o.k==="books"){s.books=Math.min(1,o.t/1.1);if(o.t>=1.6){goStage(s,2);return}}
  else if(o.k==="dawn"){s.dawn=Math.max(s.dawn,Math.min(1,.5+o.t/2.2));if(o.t>=.9&&!o.toll){o.toll=1;snd("bell")}if(o.t>=2.6)return"win"}}

PAINT.game({id:"leap",who:"kierkegaard",land:"l1",title:"The Leap",
  setup:["Stand at an edge long enough and you get dizzy. In The Concept of Anxiety I called that ‘the dizziness of freedom.’","You won’t see where you land before you jump. No one does. Gather your courage, and go."],
  how:"Tap when the bead is in the gold. Don’t wait too long.",
  goal:"Leap from ledge to ledge, across the fog, to the far light.",
  ctl:"Tap when the bead is in the gold; slide to lean left or right (A or Space to leap, arrows to lean).",
  stages:["The Edge","Either/Or","Over Deep Water"],
  lines:[null,"Two ways, both hidden. The crowd’s ledge is easy to see. That isn’t a reason.","Nothing holds still out here. Faith isn’t one leap. You make it again and again."],
  win:"You leapt without seeing. That’s the only way anyone really commits.",
  walk:["Take the ring. Choosing one life with your whole heart means letting another go.","Take the books. I wrote them under other names, so you would have to choose for yourself.","Take the bell. It’s cracked. Faith never was a crowd’s business."],
  fl:["You made it across.","You leapt more than you waited.","Every leap whole-hearted, and no one had to hold you back."],
  flNext:["Pick a side and stay with it.","Leap before the crowd comes."],
  pad:true,ab:true,bloomT:3.5,art:ART,
  init(s){Object.assign(s,{shorts:0,nudges:0,downs:0,waver:0,leaps:0,tolls:0,lastTap:-9,passI:-1,passTaps:0,pdx:0,seed:7919,fx:[]});setStage(s,0)},
  toStage(s,n){goStage(s,n)},
  step(s,dt,inp){if(s.won)return"win";s.stT+=dt;const cfg=ST[s.st],w=s.w;
    /* input: taps (press), the A key, B (step down), slides and arrows (lean), releases (Stage II) */
    for(const tp of inp.taps||[]){if(tp.y>THUMB)continue;
      if(s.st===1&&!s.onShelf&&ready(s)){const sy=s.shelfY-(P.cam?P.cam.y-H/2:0);if(tp.y>sy-50&&tp.y<sy+60&&tp.x>30&&tp.x<330){stepDown(s);continue}}
      press(s,tp)}
    if(inp.aTap)press(s,null);
    if(inp.bTap)stepDown(s);
    if(s.st===1){if(inp.down&&inp.drag){s.sl+=inp.drag.dx;if(Math.abs(s.sl)>=12){setLean(s,Math.sign(s.sl));s.sl=0;s.pend=null}}else if(!inp.down)s.sl=0;
      const dx=Math.sign(inp.dx||0);if(dx&&dx!==s.pdx)setLean(s,dx);s.pdx=dx;if(inp.lTap)setLean(s,-1);if(inp.rTap)setLean(s,1)}
    if(s.pend&&(inp.ups&&inp.ups.length||!inp.down))commit(s,s.pend.t,s.pend.q);
    stepAct(s,dt);
    /* the bead sweeps end to end; dizziness speeds it; the last leap slows it */
    if(ready(s)){const q0=s.q;s.q+=dt/cfg.sw*(1+.6*s.d)*(s.lastMode?.45:1);if((q0|0)!==(s.q|0)){snd("tick");s.glint=.25}
      if(!s.onShelf){s.onT+=dt;if(s.onT>cfg.gr)s.d=Math.min(1,s.d+.25*dt)}}
    s.glint=Math.max(0,s.glint-dt);
    if(s.st===0)stepCrowd(s,dt);else if(s.st===1)stepBooks(s,dt);else stepSea(s,dt);
    if(s.out){const r=stepOut(s,dt);if(r==="win"){s.won=true;return"win"}}},
  rate(s){return s.shorts<=1&&s.nudges===0&&s.downs===0&&s.waver<=1?3:s.shorts<=4&&s.downs<=1?2:1},
  /* auto: leans to alternate sides in Stage II, taps when the bead is well inside the gold, and any tap on the last leap */
  auto(s,inp){if(!ready(s))return;
    if(s.st===1&&!s.onShelf&&!s.leanSet){const v=s.autoLean||(s.ci%2?-1:1);if(v<0)inp.lTap=true;else inp.rTap=true;return}
    if(s.lastMode||(Math.abs(bead(s)-.5)<ST[s.st].gz*.35&&s.t-s.lastTap>.3))P.autoTap(inp,180,300)},

  /* ---------- view ---------- */
  build(s){const V={T:{},stg:null,bst:-1,pool:{}};s.V=V;
    V.scene=P.scene({land:"l1",layers:[{key:"far",depth:.15},{key:"mid",depth:.45},{key:"pa",depth:1},{key:"pb",depth:1,alpha:0},{key:"near",depth:1.35,y:-60}],fallback:{sky:["#1c1430","#4a2a44"]}});
    V.lay={};for(const L of V.scene.layers)V.lay[L.key]=L;
    V.grade=P.grade&&P.grade("l1");P.vignette&&P.vignette({strength:.42});V.bloom=P.bloom&&P.bloom({strength:.45});
    V.key=P.light({x:300,y:120,r:220,color:GOLD,intensity:.28,flicker:.3});
    V.rain=P.particles&&P.particles("rain",{x:-20,y:0,w:W+40,h:H,parent:P.over,rate:70});
    V.figs=new PIXI.Container();V.figs.zIndex=50;V.figs.sortableChildren=true;P.world.addChild(V.figs);
    const art=!!P.tex("walk");V.hero=P.frames({tex:"walk",cols:6,rows:4,count:24,fps:12,anchor:[.5,1],clips:{idle:[0,0],walk:[8,23]},style:{kind:"wanderer",height:90}},{x:s.w.x,y:s.w.y,scale:art?.45:1,parent:V.figs});
    if(P.tex("pose")){V.pose=P.frames({tex:"pose",cols:5,rows:1,count:5,anchor:[.5,.99],clips:{gather:[0,0],leap:[1,1],land:[2,2],hop:[3,3],nudged:[4,4]}},{x:s.w.x,y:s.w.y,scale:.45,parent:V.figs});V.pose.c.visible=false}
    V.hero.c.zIndex=V.pose?V.pose.c.zIndex=20:20;V.shadow=P.shadow&&P.shadow(V.hero.c,{w:46,h:11,alpha:.45});
    V.mk=new PIXI.Graphics();V.mk.zIndex=40;V.figs.addChild(V.mk);V.bead=P.light({r:22,color:0xFFE9B0,intensity:.8});V.glow=new PIXI.Graphics();V.glow.blendMode="add";P.fx.addChild(V.glow);
    V.dz=P.sprite(P.make("lp6-dz",128,128,(c,w)=>{const g=c.createRadialGradient(w/2,w/2,w*.28,w/2,w/2,w*.72);g.addColorStop(0,"rgba(110,74,168,0)");g.addColorStop(1,"rgba(110,74,168,.95)");c.fillStyle=g;c.fillRect(0,0,w,w)}),{x:W/2,y:H/2,w:W+40,h:H+40,parent:P.ui,alpha:0,z:-5});
    V.plate=P.sprite(P.tex("plate")||P.make("lp6-plate",90,195,paintPlate),{x:W/2,y:H/2,w:W,h:H,parent:P.ui,alpha:0,z:50});
    P.paperGrain&&P.paperGrain(.08);const cy=camY(s);Object.assign(P.cam,{x:W/2,tx:W/2,y:cy,ty:cy,k:3});if(P.wash)P.wash("in",{dur:.6})},
  view(s,t){const V=s.V;if(!V)return;const rm=P.rm||!!s.rm,w=s.w;
    if(V.bst!==s.st)buildStage(s,V);
    const k=Math.min(1,s.stT/.7);if(V.old){V.old.alpha=1-k;if(k>=1){V.old.destroy({children:true});V.old=null}}V.stg.alpha=V.old?k:1;
    if(V.lay.pb)V.lay.pb.node.alpha=s.st===2?(V.old?k:1):0;if(V.lay.pa)V.lay.pa.node.alpha=s.st===2?(V.old?1-k:0):1;
    P.camTo(W/2,camY(s));if(P.cam)P.cam.rot=rm?0:Math.sin(s.t*.9)*.035*s.d;
    /* the Wanderer: a pose from the pose sheet while acting, else walk frame 0 with breathing; no art = the code figure with squash */
    const pz=V.pose&&w.pose!=="idle";V.hero.c.visible=!pz;if(V.pose){V.pose.c.visible=pz;if(pz){V.pose.play(w.pose);V.pose.c.position.set(w.x,w.y);V.pose.face(w.face)}}
    V.hero.c.position.set(w.x,w.y);V.hero.face(w.face);if(w.sq&&!pz)V.hero.squash(w.sq);
    if(V.shadow)V.shadow.set({alpha:w.pose==="leap"?.12:.45});
    /* the marker: a half ring over the head, a gold zone in the middle, a bead that swings end to end */
    const g=V.mk;g.clear();const show=!w.a&&!s.out,cx=w.x,cy=w.y-104,r=40;
    if(show){const gz=ST[s.st].gz*s.goldK,b=bead(s),A=th=>Math.PI*(1+th);
      g.arc(cx,cy,r,Math.PI,2*Math.PI).stroke({width:8,color:LEAD,alpha:.85,cap:"round"});g.arc(cx,cy,r,Math.PI,2*Math.PI).stroke({width:4,color:0x56506A,alpha:.95,cap:"round"});
      if(gz>.005){g.arc(cx,cy,r,A(.5-gz/2),A(.5+gz/2)).stroke({width:6,color:GOLD,alpha:.95*s.goldK});}
      const bx=cx+r*Math.cos(A(b)),by=cy+r*Math.sin(A(b)),ing=inGold(s)&&!s.lastMode;
      g.circle(bx,by,6.5).fill({color:LEAD});g.circle(bx,by,4.6).fill({color:ing?0xFFF4D6:0xD9D2E8});
      V.bead.set({x:bx,y:by,intensity:(ing?.95:.45)+(s.glint>0&&!rm?.3:0),r:ing?30:20});
      for(const e of [0,1])g.circle(cx+(e?r:-r),cy,2.5).fill({color:GOLD,alpha:.5+(s.glint*2)})}
    else V.bead.set({intensity:0});
    V.dz.alpha=s.d*(rm?.42*(.65+.35*Math.sin(s.t*2.4)):.22);
    V.key.set({x:P.cam.x+130,y:P.cam.y-300,intensity:.28+.22*s.dawn,r:220+120*s.dawn});
    if(V.rain)V.rain.set({rate:70*(1-s.dawn)});
    for(const e of s.fx)fxEvent(V,e);s.fx.length=0;
    viewStage(s,V,t)},
  bloom(s,k,t){const V=s.V;if(!V)return;this.view(s,t);bloomView(s,V,k)},
  release(){}});

/* ---------- view helpers ---------- */
function camY(s){const fy=s.st===2&&s.ci>=6?HEAD[1]:s.w.y;return cl(fy-OFS[s.st],CAM[0],CAM[1])}
const scr=(x,y)=>({x:x-(P.cam?P.cam.x:W/2)+W/2,y:y-(P.cam?P.cam.y:H/2)+H/2});
function fxEvent(V,e){const p=scr(e[1],e[2]);if(!P.burst)return;
  if(e[0]==="gold"){P.burst(p.x,p.y-4,{preset:"sparks",n:16,color:GOLD});P.pulse(p.x,p.y-40,{color:GOLD,r:46,dur:.45})}
  else if(e[0]==="dust"){P.burst(p.x,p.y,{preset:"dust",n:8,color:0xB8AFC4})}
  else if(e[0]==="land"){P.burst(p.x,p.y,{preset:"dust",n:10,color:0xD8CBB0})}
  else if(e[0]==="nudge"){P.pulse(p.x,p.y-45,{color:GREY,r:50,dur:.6});P.burst(p.x,p.y-40,{preset:"dust",n:10,color:GREY})}}
/* atlas sprite (game size = rect / 2) or a code-painted stand-in */
function tex(V,n){if(V.T[n]!==undefined)return V.T[n];const r=R[n];let T=r?P.frameTex("atl",r):null;if(!T)T=fbTex(n);return V.T[n]=T}
function spr(V,n,o){const r=R[n]||[0,0,80,80],sc=o.sc||1;return P.sprite(tex(V,n),{x:o.x,y:o.y,ax:o.ax,ay:o.ay,w:r[2]/2*sc,h:r[3]/2*sc,parent:o.parent,z:o.z,alpha:o.alpha,tint:o.tint})}
function buildStage(s,V){if(V.old)V.old.destroy({children:true});V.old=V.stg;V.bst=s.st;const C=V.stg=new PIXI.Container();C.sortableChildren=true;C.zIndex=10;P.world.addChild(C);
  const O=V.o={};if(V.ext)for(const x of V.ext)try{x.destroy()}catch(e){}V.ext=[];
  if(s.st===0){O.led=S1.map((p,i)=>spr(V,i?"ledge-narrow":"ledge-wide",{x:p[0],y:p[1],ax:.5,ay:.12,parent:C,z:1}));
    O.ring=spr(V,"ring",{x:S1[4][0]+52,y:S1[4][1]-58,parent:C,z:30,sc:.9});O.ringL=P.light({r:30,color:GOLD,intensity:0});V.ext.push(O.ringL);
    O.crowd=person(V,"man",{x:0,y:0,parent:V.figs,tint:0xB4B3C0});O.crowd.c.visible=false}
  else if(s.st===1){O.led=[spr(V,"ledge-wide",{x:180,y:S2Y[0],ax:.5,ay:.12,parent:C,z:2})];O.cand=[];O.fog=[];
    for(let L=1;L<6;L++){O.cand[L]=S2X.map(x=>{const q=spr(V,"ledge-narrow",{x,y:S2Y[L],ax:.5,ay:.12,parent:C,z:2,alpha:0});q.bs=q.scale.x;return q});
      O.fog[L]=[-1,1].map(sd=>spr(V,"fog-strip",{x:180+sd*92,y:S2Y[L]-6,parent:C,z:6,sc:.47,alpha:.6}))}
    O.shelf=spr(V,"shelf",{x:180,y:s.shelfY,ax:.5,ay:.46,parent:C,z:3});O.lamps=[-1,1].map(sd=>{const l=P.light({r:46,color:0xFFC870,intensity:.5,flicker:.4});V.ext.push(l);return l});
    O.folk=[[208,1,"woman",0xC9C4CE],[243,-1,"man",0xB9BAC6],[284,1,"man",0xC4BFB8],[318,-1,"woman",0xBDB9C9]].map(f=>{const p=person(V,f[2],{x:f[0],y:s.shelfY,parent:V.figs,tint:f[3]});p.face(f[1]);p.dx=f[0];return p});
    O.books=["book-crimson","book-plum","book-slate"].map(n=>{const q=spr(V,n,{x:0,y:0,parent:V.figs,z:35,sc:.75});q.bs=q.scale.x;q.bt=q.scale.y;V.ext.push(q);return q});O.bookL=P.light({r:34,color:GOLD,intensity:0});O.sideL=P.light({r:60,color:0xFFE3A0,intensity:0});V.ext.push(O.bookL,O.sideL);
    O.lean=new PIXI.Graphics();O.lean.zIndex=36;C.addChild(O.lean)}
  else{O.stk=S3.map((p,i)=>spr(V,"sea-stack",{x:p[0],y:p[1],ax:.5,ay:.05,parent:C,z:9-i,sc:p[2]})); /* nearer stacks over farther ones */
    O.spl=[0,1,2,3].map(i=>spr(V,"splash-"+(i+1),{x:0,y:0,parent:C,z:5,alpha:0}));
    O.wisp=[1,2,3,4].map(i=>spr(V,"wisp-"+i,{x:0,y:0,parent:P.over,z:60,alpha:0,sc:.7,tint:0xB8B6C4}));V.ext.push(...O.wisp);
    O.gl=new PIXI.Graphics();O.gl.zIndex=61;P.over.addChild(O.gl);V.ext.push(O.gl);
    const nl=V.lay.near;O.bell=spr(V,"bell",{x:30,y:338,ax:.5,ay:.08,parent:nl?nl.c:C,z:5,sc:.45});V.ext.push(O.bell);
    O.k=thinker(V,{x:KX,y:KY,parent:V.figs});O.k.face(-1);O.bridge=new PIXI.Graphics();O.bridge.blendMode="add";O.bridge.zIndex=8;C.addChild(O.bridge);
    O.dawnL=P.light({x:360,y:-150,r:320,color:0xFFC98A,intensity:0});V.ext.push(O.dawnL);O.shafts=P.shafts&&P.shafts({x:330,y:-200,angle:24,count:4,length:700,width:70,color:GOLD,alpha:0});if(O.shafts)V.ext.push(O.shafts)}}
function person(V,key,o){const art=!!P.tex(key),h=P.frames({tex:key,cols:6,rows:2,count:12,fps:key==="man"?8.2:8.7,anchor:[.5,.99],clips:{idle:[0,0],walk:[0,11]},style:{kind:"thinker",height:85,palette:{cloak:"#9C9AAA",skin:"#D9CFC6",trim:"#77748A"}}},{x:o.x,y:o.y,scale:art?.45:1,parent:o.parent});
  if(art&&o.tint)h.set({tint:o.tint});h.play("idle");V.ext.push(h);return h}
function thinker(V,o){const art=!!P.tex("kidle");const h=P.frames({tex:"kidle",cols:6,rows:3,count:16,fps:5.1,anchor:[.5,.99],clips:{idle:[0,15]},style:{kind:"thinker",height:100,palette:{cloak:"#22202A",skin:"#E3CDB4",trim:"#4A3020"}}},{x:o.x,y:o.y,scale:art?.49:1,parent:o.parent});
  V.ext.push(h);if(P.tex("knod")){h.nod=P.frames({tex:"knod",cols:6,rows:2,count:12,fps:6.8,anchor:[.5,.99],clips:{nod:[0,11]},loop:false},{x:o.x,y:o.y,scale:.49,parent:o.parent});h.nod.c.visible=false;V.ext.push(h.nod)}return h}
function viewStage(s,V,t){const O=V.o,rm=P.rm||!!s.rm,w=s.w;
  if(s.st===0){const c=s.crowd,p=O.crowd;if(c&&p){const sp=S1[s.ci],k=c.t;p.c.visible=true;const away=k<.5?eo(k/.5):k<1.3?1:1-eio(cl((k-1.3)/.6,0,1));
      p.c.position.set(sp[0]+c.side*(58-28*away),sp[1]);p.set({alpha:Math.min(1,away*1.3)});p.face(-c.side);p.play(k<.5||k>1.3?"walk":"idle")}else if(p)p.c.visible=false;
    const rg=O.ring;if(s.out&&s.out.k==="ring"){const k=s.ring;const x0=S1[4][0]+52,y0=S1[4][1]-58;
      if(k<.6){rg.position.set(x0,y0);O.ringL.set({x:x0,y:y0,intensity:.4+.5*Math.sin(k/.6*Math.PI)})}
      else{const f=eio(cl((k-.6)/.8,0,1));rg.position.set(lerp(x0,w.x,f),lerp(y0,w.y-50,f)-(rm?0:30*Math.sin(Math.PI*f)));O.ringL.set({x:rg.x,y:rg.y,intensity:.8});rg.alpha=k>1.5?1-(k-1.5)/.3:1}}
    else{rg.alpha=s.ci>=2?.85:0;O.ringL.set({x:rg.x,y:rg.y,intensity:s.ci>=3?.22+.12*Math.sin(t/300):0})}}
  else if(s.st===1){const L1=s.ci+1;
    for(let L=1;L<6;L++){const cs=O.cand[L],fg=O.fog[L],ch=s.ch[L],f=s.form[L];
      for(let j=0;j<2;j++){const side=j?1:-1,mine=ch===side&&L<=s.ci+1&&f>0;const sp=cs[j];
        if(mine){sp.alpha=.2+.8*f;sp.scale.x=sp.bs*(.3+.7*f)}
        else{sp.scale.x=sp.bs;sp.alpha=L===L1?(s.leanSet&&s.lean===side&&!s.onShelf?.34:.16):L<=s.ci?.1:.06}
        const parted=ch===side&&L<=s.ci+1?f:0;fg[j].alpha=(L<=s.ci?.16:L===L1?.62:.36)*(1-parted*.85);fg[j].x=180+side*(92+parted*40)+(L%2?26:-26)+(rm?0:Math.sin(t/1400+L+j)*6)}}
    const sy=s.shelfY;O.shelf.y=sy;O.lamps[0].set({x:180-134,y:sy-44});O.lamps[1].set({x:180+134,y:sy-44});
    O.folk.forEach(p=>p.c.position.set(p.dx,sy-1));
    const bo=[[-60,-58],[0,-166],[60,-58]];O.books.forEach((b,i)=>{const lit=s.bk.i===i&&s.bk.t<1&&!s.out,bob=rm?0:Math.sin(s.t*1.6+i*2)*4;
      if(s.out&&s.out.k==="books"){const f=eio(s.books);b.position.set(lerp(w.x+bo[i][0],w.x+30,f),lerp(w.y+bo[i][1]+bob,w.y-8-i*7,f));b.rotation=f*(i-1)*.08;b.alpha=1}
      else{b.position.set(w.x+bo[i][0],w.y+bo[i][1]+bob);b.rotation=0;b.alpha=lit?1:.55;const m=lit?1.12:1;b.scale.set(b.bs*m,b.bt*m)}});
    const lb=O.books[s.bk.i],lit=s.bk.t<1&&!s.out&&s.ci<5;O.bookL.set({x:lb.x,y:lb.y,intensity:lit?.7:0});
    O.sideL.set({x:S2X[s.bk.side<0?0:1],y:S2Y[Math.min(5,L1)]-14,intensity:lit&&!s.onShelf?.55:0});
    const g=O.lean;g.clear();if(s.leanSet&&!s.onShelf&&!w.a&&!s.out){const dx=s.lean,x=w.x+dx*30,y=w.y-36;g.poly([x,y-8,x+dx*11,y,x,y+8]).fill({color:GOLD,alpha:.9});g.poly([x,y-8,x+dx*11,y,x,y+8]).stroke({width:2,color:LEAD})}}
  else{for(let i=0;i<6;i++){const st=O.stk[i];st.y=topY(s,i)}
    O.spl.forEach((sp,i)=>{const p=s.spl[i];if(!p){sp.alpha=0;return}const k=p.t/.8;sp.position.set(p.x,p.y-(rm?0:16*k));sp.alpha=1-k;sp.scale.set(.5*(.7+(rm?0:.6*k)))});
    const sw=s.bellSw;O.bell.rotation=rm?0:Math.sin(sw*14)*.32*sw;O.bell.tint=sw>.55?0xFFE2B0:0xFFFFFF;
    const g=O.gl;g.clear();const gu=s.gust;O.wisp.forEach((sp,i)=>{if(!gu){sp.alpha=0;return}const k=gu.t/1.8,yy=gu.y+i*20-30;
      if(rm){sp.position.set(70+i*70,yy);sp.alpha=.6*Math.sin(Math.PI*k)}else{sp.position.set(-70+k*520-i*46,yy+Math.sin(k*9+i)*8);sp.alpha=.75*Math.sin(Math.PI*k)}});
    if(gu&&!rm){const k=gu.t/1.8;for(let i=0;i<4;i++){const x0=-60+k*500-i*60,y=gu.y-40+i*22;g.moveTo(x0,y).lineTo(x0+70,y+3).stroke({width:2,color:0xC8C6D4,alpha:.45*Math.sin(Math.PI*k)})}}
    const bg=O.bridge;bg.clear();if(s.bridge>0&&s.st===2){const a={x0:S3[5][0],y0:topY(s,5),x1:HEAD[0],y1:HEAD[1],h:60},n=24;let px=a.x0,py=a.y0;
      for(let i=1;i<=n;i++){const k=i/n;if(k>s.bridge+.02)break;const e=eio(k),x=lerp(a.x0,a.x1,e),y=arcY(a,k);
        bg.moveTo(px,py+4).lineTo(x,y+4).stroke({width:10,color:0xFFD98A,alpha:.25,cap:"round"});bg.moveTo(px,py+4).lineTo(x,y+4).stroke({width:3.5,color:0xFFF4D6,alpha:.9,cap:"round"});px=x;py=y}}
    O.dawnL.set({intensity:.5*s.dawn});if(O.shafts)O.shafts.set({alpha:.12*s.dawn});
}}
/* bloom 3.5 s: the fog drains, every stack you used lights gold as a zigzag stair up to the headland, the ring rises, Kierkegaard nods.
   2 lanterns add light shafts, 3 add gold motes. In the last second the plate fades in and holds. */
function bloomView(s,V,k){const O=V.o,fl=s._fl||1,rm=P.rm||!!s.rm;if(s.st!==2||!O.stk)return;
  if(!V.bl){V.bl={g:new PIXI.Graphics(),ring:spr(V,"ring",{x:s.w.x,y:s.w.y-50,parent:V.figs,z:45,sc:.9}),lights:[0,1,2,3,4,5,6].map(()=>P.light({r:40,color:GOLD,intensity:0}))};
    V.bl.g.blendMode="add";V.bl.g.zIndex=9;V.stg.addChild(V.bl.g);
    if(fl>=2&&P.shafts)V.bl.sh=P.shafts({x:250,y:-220,angle:16,count:5,length:900,width:80,color:GOLD,alpha:0});
    if(fl>=3&&P.particles)V.bl.mo=P.particles("fireflies",{x:40,y:80,w:280,h:520,parent:P.fx,rate:9});
    if(O.k&&O.k.nod){O.k.c.visible=false;O.k.nod.c.visible=true;O.k.nod.face(-1);O.k.nod.play("nod",{restart:true})}}
  const B=V.bl,g=B.g;g.clear();
  const pts=s.path.filter(i=>i<=5).map(i=>({x:S3[i][0],y:topY(s,i)}));pts.push({x:HEAD[0],y:HEAD[1]});
  const lit=rm?pts.length:Math.min(pts.length,k/.6*pts.length);
  for(let i=0;i<pts.length;i++){const a=cl(lit-i,0,1);if(B.lights[i])B.lights[i].set({x:pts[i].x,y:pts[i].y,intensity:.7*a});
    if(i>0&&a>0){const p=pts[i-1],q=pts[i];g.moveTo(p.x,p.y).lineTo(lerp(p.x,q.x,a),lerp(p.y,q.y,a)).stroke({width:9,color:0xFFD98A,alpha:.3,cap:"round"});g.moveTo(p.x,p.y).lineTo(lerp(p.x,q.x,a),lerp(p.y,q.y,a)).stroke({width:3,color:0xFFF4D6,alpha:.95,cap:"round"})}}
  B.ring.position.set(s.w.x,s.w.y-50-(rm?40:90*eo(Math.min(1,k/.7))));B.ring.alpha=1;
  if(B.sh)B.sh.set({alpha:.2*Math.min(1,k*2)});
  V.plate.alpha=rm?1:cl((k-.714)/.286,0,1)}
/* code-painted stand-ins for each atlas sprite (used only when the art is missing) */
function fbTex(n){const r=R[n]||[0,0,80,80],w=r[2],h=r[3];return P.make("lp6-fb-"+n,w,h,(c)=>{
  const grd=(a,b)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,a);g.addColorStop(1,b);return g};
  if(/ledge/.test(n)){c.fillStyle=grd("#8a5a3a","#3a2418");c.fillRect(4,6,w-8,h*.3);c.fillStyle="#2a1810";c.fillRect(w*.2,h*.3,8,h*.6);c.fillRect(w*.75,h*.3,8,h*.6);c.fillStyle="rgba(255,220,170,.25)";c.fillRect(4,6,w-8,4)}
  else if(n==="shelf"){c.fillStyle=grd("#8a6a78","#3a2a3a");c.fillRect(6,h*.42,w-12,h*.42);c.fillStyle="#22161e";c.fillRect(30,h*.1,8,h*.34);c.fillRect(w-38,h*.1,8,h*.34);c.fillStyle="#FFD27A";c.fillRect(24,h*.06,20,16);c.fillRect(w-44,h*.06,20,16)}
  else if(n==="sea-stack"){c.fillStyle=grd("#7a5a6e","#2e2638");c.beginPath();c.moveTo(w*.18,4);c.lineTo(w*.86,10);c.lineTo(w*.92,h*.85);c.lineTo(w*.08,h*.88);c.closePath();c.fill();c.fillStyle="rgba(240,240,250,.8)";c.fillRect(0,h*.84,w,h*.16)}
  else if(/book/.test(n)){c.fillStyle=n==="book-crimson"?"#9a2a38":n==="book-plum"?"#6e2e52":"#44506a";c.fillRect(8,10,w-16,h-20);c.fillStyle="#E8D9B0";c.fillRect(w-20,14,6,h-28)}
  else if(n==="ring"){c.strokeStyle="#F5C66A";c.lineWidth=9;c.beginPath();c.arc(w/2,h/2,h*.32,0,7);c.stroke()}
  else if(n==="bell"){c.fillStyle="#5a3a1e";c.fillRect(8,6,w-16,16);c.fillStyle=grd("#8a6a3a","#3a2a18");c.beginPath();c.moveTo(w*.3,28);c.quadraticCurveTo(w*.18,h*.9,w*.08,h*.92);c.lineTo(w*.92,h*.92);c.quadraticCurveTo(w*.82,h*.9,w*.7,28);c.closePath();c.fill();c.strokeStyle="#1a100a";c.lineWidth=3;c.beginPath();c.moveTo(w*.38,40);c.lineTo(w*.32,h*.8);c.stroke()}
  else{const g=c.createRadialGradient(w/2,h/2,2,w/2,h/2,Math.max(w,h)/2);const col=/splash/.test(n)?"250,250,255":"220,216,232";g.addColorStop(0,`rgba(${col},.9)`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(0,0,w,h)}})}
function paintPlate(c,w,h){const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"#3a2a4a");g.addColorStop(.42,"#e8a860");g.addColorStop(.5,"#6a5a7a");g.addColorStop(1,"#1a1626");c.fillStyle=g;c.fillRect(0,0,w,h);
  c.strokeStyle="rgba(255,226,150,.9)";c.lineWidth=2;c.beginPath();c.moveTo(w*.3,h*.95);c.lineTo(w*.6,h*.82);c.lineTo(w*.38,h*.7);c.lineTo(w*.62,h*.58);c.stroke();c.fillStyle="#1a1020";c.fillRect(w*.47,h*.38,6,14)}
})();
