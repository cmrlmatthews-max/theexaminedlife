/* paint_demo — the Phase 47 test game for the PAINT toolkit. It is not in the Journal, the world, or the gallery.
   Open it from the console or the kit: paintStub("paint_demo",{hidden:true,who:"kierkegaard",land:"l1",title:"Paint Demo"});startMini("paint_demo")
   It uses each toolkit part: scene + camera (10), light + grade (20), particles + glass + banner + wash (30), actor (40), input helpers (50).
   Rules: Stage I — tap the three drifting lights. Stage II — hold A (or press and hold the screen) to fill the lantern, three times.
   Stage III — drag the last light into the lantern. Lanterns: fewer misses = more lanterns (mashing is a miss). */
(function(){const P=window.PAINT,W=360,H=780;
const ORB=[[90,330],[270,390],[180,250]];
PAINT.game({id:"paint_demo",who:"kierkegaard",land:"l1",title:"Paint Demo",hidden:true,
  setup:["A test of the painted look."],how:"Tap the lights, hold to fill the lantern, then drag the last light home.",
  goal:"Bring the three lights home to the lantern.",ctl:"Tap, hold, and drag. On a keyboard: arrows to move, Z to tap or hold.",
  stages:["Gather","Fill","Home"],lines:["","Now hold, and let it fill.","Bring the last one home."],
  win:["The lantern is lit."],walk:["Walk on."],art:{wanderer:"722a3398001272ffef27395bfcc9f0e9.webp"}, /* the Phase 47 test sheet: 24 frames, 119 x 200 px, from a Gemini video */
  init(s){s.st=0;s.stT=0;s.miss=0;s.taps=0;s.got=[0,0,0];s.fill=0;s.fills=0;s.lit=0;s.carry=null;s.ox=300;s.oy=600;s.done=false;
    s.hold=P.hold({dur:1.1});s.drag=P.drag({pieces:[{x:300,y:600,w:44,h:44}],spots:[{x:180,y:560,r:40}]})},
  toStage(s,n){s.st=n;s.stT=0;if(n>=1)s.got=[1,1,1];if(n>=2)s.fills=3},
  step(s,dt,inp){s.stT+=dt;
    if(s.st===0){for(const tp of inp.taps){s.taps++;let hit=false;ORB.forEach((o,i)=>{const p=orbPos(o,i,s.t);if(!s.got[i]&&Math.hypot(tp.x-p.x,tp.y-p.y)<44){s.got[i]=1;hit=true;fxHit(p.x,p.y)}});if(!hit)s.miss++}
      if(inp.aTap){const i=s.got.indexOf(0);if(i>=0){s.got[i]=1;const p=orbPos(ORB[i],i,s.t);fxHit(p.x,p.y)}}
      if(s.got.every(Boolean))stageUp(s);return}
    if(s.st===1){const ev=s.hold.step(dt,inp);if(ev==="full"){s.fills++;s.hold.k=0;s.hold.full=false;fxHit(180,560);if(s.fills>=3){stageUp(s)}}
      else if(ev==="release"&&s.hold.k<.98){s.miss+=s.hold.k<.15?0:1;s.hold.k=0}return}
    if(s.st===2){const r=s.drag.step(dt,inp);if(r&&r.spot){s.done=true;fxHit(180,560);return "win"}
      if(r&&!r.spot)s.miss++}},
  auto(s,inp){if(s.st===0){const i=s.got.indexOf(0);if(i>=0&&Math.floor(s.t*4)%2===0){const p=orbPos(ORB[i],i,s.t);P.autoTap(inp,p.x,p.y)}}
    else if(s.st===1){inp.a=true}
    else if(s.st===2){s.ak=(s.ak||0)+1/40;P.autoDrag(inp,{x:300,y:600},{x:180,y:560},s.ak>1.05?1.2:Math.min(1,s.ak))}},
  rate(s){return s.miss<=1?3:s.miss<=4?2:1},
  build(s){const V={};s.V=V;
    V.scene=P.scene({land:"l1",layers:[{key:"far",depth:0},{key:"mid",depth:.45},{key:"ground",depth:1},{key:"near",depth:1.35},{key:"mist",depth:1.6,drift:6,alpha:.5}]});
    V.grade=P.grade&&P.grade("l1");P.vignette&&P.vignette({strength:.45});V.bloom=P.bloom&&P.bloom({strength:.6});
    V.hero=P.actor?P.actor({kind:"frames",tex:"wanderer",cols:6,rows:4,count:24,fps:12,anchor:[.5,1],clips:{idle:[0,0],walk:[8,23]}},{x:110,y:620,scale:.45,parent:P.world}):null;
    if(V.hero){V.hero.play&&V.hero.play("walk");P.shadow&&P.shadow(V.hero.c,{w:60,h:14})}
    V.lantern=P.light({x:180,y:560,r:70,color:0xF5C66A,intensity:.35,flicker:.5});
    V.lanternBody=P.sprite(P.radial("demo-lamp",64,[[0,"rgba(255,236,190,1)"],[.4,"rgba(245,198,106,.9)"],[1,"rgba(160,90,40,0)"]]),{x:180,y:560,w:30,h:38,parent:P.world,z:5});
    V.orbs=ORB.map((o,i)=>({glow:P.light({x:o[0],y:o[1],r:46,color:0xFFE3A0,intensity:.8,flicker:.3}),core:P.sprite(P.radial("demo-core",32),{x:o[0],y:o[1],w:16,h:16,tint:0xFFF4D6,blend:"add",parent:P.fx})}));
    V.carry=P.light({x:300,y:600,r:46,color:0xFFE3A0,intensity:0,flicker:.3});
    V.rain=P.particles&&P.particles("rain",{x:0,y:0,w:W,h:H,parent:P.over});V.motes=P.particles&&P.particles("fireflies",{x:20,y:300,w:320,h:360,parent:P.fx,rate:4});
    V.shafts=P.shafts&&P.shafts({x:260,y:0,angle:18,count:4,length:620,width:60,color:0xF5C66A,alpha:.12});
    V.ring=s.hold.view?s.hold.view(P.ui,{x:180,y:680,r:28}):null;
    P.paperGrain&&P.paperGrain(.1);P.camTo(W/2,H/2,1);
    if(P.wash)P.wash("in",{dur:.6})},
  view(s,t){const V=s.V;if(!V)return;const k=s.t;
    V.orbs.forEach((o,i)=>{const p=orbPos(ORB[i],i,k),on=s.st===0&&!s.got[i];o.glow.set({x:p.x,y:p.y,intensity:on?.8:0});o.core.position.set(p.x,p.y);o.core.alpha=on?1:0});
    V.lantern.set({intensity:.25+.2*s.fills+.25*(s.st===1?s.hold.k:0)+(s.done?.5:0)});
    const d=s.drag.pieces[0];V.carry.set({x:d.x,y:d.y,intensity:s.st===2&&!s.done?.9:0});
    if(V.ring&&V.ring.update)V.ring.update();if(V.ring&&V.ring.c)V.ring.c.visible=s.st===1;
    if(V.hero&&V.hero.c){const tx=110+s.st*30;V.hero.c.x+=(tx-V.hero.c.x)*.05}
    P.camTo(W/2+(s.st===2?(d.x-180)*.15:0),H/2,s.st===1?1+.04*s.hold.k:1)},
  bloom(s,k,t){const V=s.V;if(!V)return;this.view(s,t);V.lantern.set({intensity:1+k*1.5,r:70+k*260});if(V.bloom&&V.bloom.setStrength)V.bloom.setStrength(.6+k*1.2)},
  release(){}});
function orbPos(o,i,k){return{x:o[0]+Math.sin(k*.9+i*2.1)*26,y:o[1]+Math.cos(k*.7+i*1.3)*18}}
function fxHit(x,y){if(P.burst)P.burst(x,y,{preset:"sparks",n:18,color:0xF5C66A});if(P.pulse)P.pulse(x,y,{color:0xF5C66A,r:60,dur:.5});if(window.sfx)try{sfx("tap")}catch(e){}}
})();
