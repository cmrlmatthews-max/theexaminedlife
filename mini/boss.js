/* The Examined Life: the four boss rounds (Phase 25). Loaded after the page's main script (Phase 29). */
/* MINI_ART:BEGIN (written by tools/boss_mini_art.py: asset ids, atlas rects, traced geometry, pivots; boss rounds have no plate) */
MINI_ART.boss_b1={"atlas":"f14d560463ddea9aa67ed8efdcbca977","rects":{"void_swirl":[1,1,160,155],"wisp_0":[162,1,13,20],"light_kierkegaard":[176,1,13,16],"light_nietzsche":[190,1,16,16],"light_camus":[207,1,16,16],"light_sartre":[224,1,13,16],"light_beauvoir":[238,1,7,16],"light_frankl":[246,1,8,16],"light_fromm":[255,1,9,16],"wisp_1":[265,1,41,15]},"prects":{},"bg":["1ef5013b8340f39392a01afb522616d8"],"geo":{"dawn":{"y":85,"band":[80,86],"visible":[[0,43],[149,192]],"behind_void":[43,149]},"void":{"hood_top":[96,2],"face_center":[96,30],"face_r":14,"robe_base":[43,149,88]},"glimmer":[96,87],"plain":[12,96,180,236],"dark_band_from":240,"colors":{"light_kierkegaard":"#7A3E6E","light_nietzsche":"#B0283A","light_camus":"#D9A93A","light_sartre":"#E08A2E","light_beauvoir":"#E8A59A","light_frankl":"#F5C66A","light_fromm":"#5FBF5A"}},"lights":["light_kierkegaard","light_nietzsche","light_camus","light_sartre","light_beauvoir","light_frankl","light_fromm"]};
MINI_ART.boss_b2={"atlas":"7158ff59e413f1048e25acda6c61f4f5","rects":{"wheel":[1,1,294,300],"citadel":[296,1,48,45],"prize_mask":[345,1,16,20],"prize_laurel":[362,1,20,18],"prize_crown":[383,1,20,15],"prize_coins":[404,1,20,14]},"prects":{},"bg":["790da85e20e512853b93aa03dec65cd3"],"geo":{"hub":[96,160],"pool":{"center":[96,160],"rx":54,"ry":45},"face":{"center":[96,40],"box":[72,8,120,72]},"wheel":{"size_px":300,"draw_scale":1.0},"lanterns_painted":[[40,128],[146,120],[136,200]],"dark_band_from":240}};
MINI_ART.boss_b3={"atlas":"c98a86d3c2185c8d88ad7fad26b5d638","rects":{"spirit":[1,1,70,200],"arm":[72,1,120,53],"treasure_tablet":[193,1,20,19],"treasure_jewel":[214,1,20,17],"treasure_food":[235,1,20,16],"treasure_coins":[256,1,20,12]},"prects":{},"bg":["51a1666119c0beda52ffb9ba2e4408ab"],"geo":{"altar":{"center":[97,84],"box":[80,74,116,94]},"shrine_door":[74,50,118,74],"steps":[80,94,116,118],"lanterns":[[52,103],[142,112],[43,191],[144,190]],"lantern_bases":[[51,116],[143,138],[42,222],[145,222]],"spirit_feet":[96,120],"open_ground":[44,122,150,226],"slots_suggested":[[62,148],[86,148],[110,148],[134,148],[62,178],[86,178],[110,178],[134,178]],"slot_size":24,"dark_band_from":236},"pivots":{"spirit":{"size":[70,200],"shoulders":[[13,54],[56,54]],"belly":[43,80],"belly_r":18},"arm":{"size":[120,53],"pivot":[3,14]}}};
MINI_ART.boss_b4={"atlas":"980f77b671f73cf4d0fd43d236a7a39d","rects":{"engine":[1,1,203,200],"train_engine":[205,1,17,48],"lens_gold":[223,1,38,40],"lens_silver":[262,1,39,40],"lens_bronze":[302,1,38,40],"train_car":[341,1,19,34],"signal_lamp":[361,1,23,32],"bell":[385,1,28,32],"switch":[414,1,27,32],"engine_eyes":[442,1,48,20]},"prects":{},"bg":["65f5bcd2089597078da9d0a697dbf189"],"geo":{"tracks":{"main":[[96,320],[96,262],[96,215],[96,175],[96,128]],"branch_up_right":[[97,178],[110,162],[127,147],[150,135],[176,128]],"branch_down_right":[[103,178],[120,190],[136,208],[146,228],[150,244]],"siding":[[93,206],[78,220],[62,234],[46,250]]},"junction":[98,178],"siding_switch":[88,204],"buffer":{"box":[18,246,58,282],"center":[38,262]},"fog_line":128,"signal_post":{"base":[128,176],"arms":[128,88],"lamp":[118,108]},"lamps":[[56,172],[68,138],[154,150]],"engine_feet":[92,122],"lenses_suggested":[[52,228],[96,228],[140,228]],"third_ways_suggested":{"bell":[36,196],"signal_lamp":[118,108],"switch":[88,204]},"dark_band_from":246},"pivots":{"engine":{"size":[203,200],"eyes_center":[101,66]},"engine_eyes":{"size":[48,20],"pivot":[24,10]},"train":{}}};
/* MINI_ART:END */
/* ============ BOSS ROUNDS (Phase 25) ============
   One short round in each boss fight, right after the third challenge. They can't be lost, earn no artifact, and have no lanterns (addendum M3).
   MINI entries here carry boss:"<boss id>" and who:"<boss id>", so the card shows the boss's name and the words are narration.
   Each round combines two controls from its own land's games (addendum section 4), and ends with that land's biggest bloom. */
/* GAME:boss_b1:BEGIN */
/* ---- Phase 35B: Carry It Anyway, developed - Level I's boss round on the Void's plain ----
   Idea check: playing this, you feel seven small lights, one from each thinker you met, holding back the dark while you keep walking. You can never stop every wisp,
   the Void's pull is only beaten by moving, and the only thing that ends it is going on anyway. That is Level I's idea that meaning is carried onward by choosing to continue.
   Controls (two of Level I's): walk by pad or by dragging (Having or Being's drag), and tap a wisp to send a light (Sounding the Idols' tap).
   Walking north is walking up the plain: s.p (0..1) maps to the Wanderer's feet, y 228 -> 90 (the dawn band). Uninterrupted, the dawn is 55 s away (WALK). Standing still makes no progress.
   Wisps (s.wisps: x, y, dead, dying, ph) spawn at the robe and the horizon or the plain's side edges, drift toward the Wanderer's lantern swaying, and dart: slow = wisp_0, fast = wisp_1.
   The seven lights (s.lights, one per Level I thinker, in LEVELS[0].ph order; each its own icon and geo.colors color) orbit the lantern. Each blocks ONE wisp, then needs RECOV = 4 s (.cool).
   A tap on a wisp sends the nearest ready light; A, the wisp nearest you; a wisp that reaches you meets a ready light by itself. A wisp that gets through (no light ready) dims the lantern and slows you
   to 60% for 2 s (never stops you, never stacks, never knocks you back).
   I The Plain (p 0 - 1/3). II The Pull (1/3 - 2/3): the Void's face rises (void_swirl grows over the painted face), a pull on you (standing still slips you back, p never below 1/3; walking is 80% speed;
   violet strands) and on your lights (a light that has blocked is drawn out toward the Void and recovers only on frames where you walk; ready lights lean toward the face).
   III The Long Dark (2/3 - 1): the wisps come thick (twice Wave I's rate, often in pairs), the lights circle close (10 x 7), the pull ends, a gold-plum dawn line glows on the horizon (s.dawn > 0) and grows with p.
   Win: the Wanderer's feet reach the dawn line (p = 1). Never "end"; no lives; nothing is lost. Bloom: the seven lights flare into one star, the Void unravels into violet sparks, dawn breaks plum then gold. */
(function(){
  const ID="boss_b1";
  const px=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(hs(x),hs(y),w,h)};
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const ease=k=>k<=0?0:k>=1?1:k*k*(3-2*k);
  const dst=(a,b,c,d)=>Math.hypot(a-c,b-d);
  const AR=()=>MINI_ART[ID]||{},GEO=()=>AR().geo||{};
  const Y0=228,Y1=90,T1=1/3,T2=2/3,WALK=55,RECOV=4,FLY=.22,HITT=2,SLIP=2.5,XL=20,XR=172,FACE=[96,30],MAXW=16;
  const SAY1="The Void’s face rises and pulls at you. Keep walking.",SAY2="The wisps come thick. Hold your lights close. There’s a glow ahead.";
  const feet=p=>Y0-(Y0-Y1)*p;
  const lc=s=>({x:s.x+5,y:feet(s.p)-11});                       /* the Wanderer's lantern (it hangs at his right side) */
  /* ---- the lights ---- */
  function makeLights(){
    const names=AR().lights||[],ph=(typeof LEVELS!=="undefined"&&(LEVELS.find(v=>v.id==="l1")||{}).ph)||names.map(n=>n.slice(6));
    return ph.map((id,i)=>{const icon="light_"+id;return {i,id,icon,col:(GEO().colors||{})[icon]||"#F5C66A",a:i/ph.length*Math.PI*2,cool:0,fly:0,fx:0,fy:0,tx:0,ty:0,out:0,x:0,y:0,n:0}})}
  function orbitPos(s,l){const c=lc(s);let dy=Math.sin(l.a)*s.ry;if(s.st===1&&dy<0)dy*=1.5;return {x:c.x+Math.cos(l.a)*s.rx,y:c.y+dy}}   /* ready lights lean toward the face in Wave II */
  function lightPos(s,l){const o=orbitPos(s,l);if(!(l.out>0))return o;
    const dx=FACE[0]-o.x,dy=FACE[1]+10-o.y,d=Math.hypot(dx,dy)||1,m=Math.min(d*.5,44)*l.out;return {x:o.x+dx/d*m+(s.rm?0:Math.sin(s.gt*1.3+l.i)*2),y:o.y+dy/d*m}}
  function place(s){for(const l of s.lights){const q=lightPos(s,l);l.x=q.x;l.y=q.y}}
  function burst(s,x,y,col){
    if(s.rm){pAdd(s.P,{k:"glow",x,y,vx:0,vy:0,life:.7,col,s:9,a:.45});return}
    pSparks(s.P,x,y,10,col,52);pSparks(s.P,x,y,4,"#FFF1C8",30);pSparks(s.P,x,y,6,"#2A1840",26)}
  /* send the nearest ready light at a wisp (it flies there, and both vanish in sparks of its color); false when no light is ready */
  function send(s,w){
    let best=null,bd=1e9;for(const l of s.lights){if(l.cool>0)continue;const q=lightPos(s,l),d=dst(q.x,q.y,w.x,w.y);if(d<bd){bd=d;best=l}}
    if(!best)return false;const q=lightPos(s,best);
    best.cool=RECOV;best.fly=FLY;best.fx=q.x;best.fy=q.y;best.tx=w.x;best.ty=w.y;best.n++;
    w.dead=true;w.dying=0;w.wait=FLY;w.col=best.col;s.blocked++;sfx("light");return true}
  function hit(s,w){w.dead=true;w.dying=0;w.wait=0;s.dim=HITT;s.slow=HITT;s.hits++;sfx("dim");
    if(s.rm)pAdd(s.P,{k:"glow",x:w.x,y:w.y,vx:0,vy:0,life:.6,col:"rgba(40,20,70,.9)",s:10,a:.5});else pSparks(s.P,w.x,w.y,8,"#2A1840",30)}
  function spawn(s){
    const n=s.st===2&&Math.random()<.5?2:1;
    for(let i=0;i<n;i++){if(s.wisps.length>=MAXW)break;const L=lc(s);let x=0,y=0;
      for(let k=0;k<5;k++){if(Math.random()<.65){x=rnd(30,162);y=rnd(80,100)}else{x=Math.random()<.5?12:180;y=rnd(100,200)}if(dst(x,y,L.x,L.y)>45)break}
      s.wisps.push({x,y,vx:0,vy:0,sp:0,fast:false,dead:false,dying:0,ph:Math.random()*6,tr:[],tt:0});s.spawned++}
    s.spT=s.st===0?rnd(1.1,1.6):s.st===1?rnd(.9,1.3):rnd(.75,1.15)}
  /* ---- looks ---- */
  function flatBg(c,s){px(c,0,0,192,86,"#14101C");c.fillStyle="#241C32";c.beginPath();c.moveTo(43,88);c.lineTo(72,30);c.lineTo(96,6);c.lineTo(120,30);c.lineTo(149,88);c.fill();
    px(c,0,80,192,6,"#B8B0CC");px(c,0,86,192,154,"#3A3644");for(let i=0;i<40;i++)px(c,(i*53)%190,96+(i*37)%140,i%3?1:2,1,i%4?"#4A4654":"#2C2834");px(c,0,240,192,80,"#1E1A28")}
  function wispFb(c,w,a){const x=Math.round(w.x),y=Math.round(w.y);c.globalAlpha=a;px(c,x-4,y-4,9,1,"#5A4E6A");px(c,x-3,y-3,7,6,"#1A1424");px(c,x-4,y-1,9,3,"#1A1424");px(c,x-2,y+3,5,3,"#241A30");px(c,x-1,y+6,3,3,"#2E2440");px(c,x-2,y-1,1,1,"#9C90B8");px(c,x+1,y-1,1,1,"#9C90B8");c.globalAlpha=1}
  function wispDraw(c,s,w,t){
    const a=w.dead?Math.max(0,1-(w.wait>0?0:w.dying)/.4):1;if(a<=0)return;
    if(!s.rm&&w.tr)for(let i=0;i<w.tr.length;i++){const q=w.tr[i],k=(i+1)/w.tr.length;c.globalAlpha=.3*k*a;c.fillStyle="#150D20";c.beginPath();c.arc(q[0],q[1],1+k*2,0,7);c.fill()}
    c.globalAlpha=1;
    const bob=s.rm?0:Math.sin(t/300+(w.ph||0))*1.2;
    if(w.fast){const ang=Math.atan2(w.vy||0,w.vx||1),left=Math.cos(ang)<0;
      if(mPiece(c,ID,"wisp_1",w.x,w.y,{ax:.5,ay:.5,rot:left?ang-Math.PI:ang,flip:left,a,sm:true}))return}
    else if(mPiece(c,ID,"wisp_0",w.x,w.y+bob,{ax:.5,ay:.55,a}))return;
    wispFb(c,w,a)}
  function swirlDraw(c,s,t,a,sc,rot,rise){
    if(mPiece(c,ID,"void_swirl",FACE[0],FACE[1]-rise,{ax:.5,ay:.5,rot,sc,a,sm:true}))return;
    c.save();c.globalAlpha=a;c.translate(FACE[0],FACE[1]-rise);c.rotate(rot);c.strokeStyle="#8A5AD0";c.lineWidth=1.6;
    for(let j=0;j<3;j++){c.beginPath();for(let i=0;i<=24;i++){const u=i/24,r=(2+u*20*sc*2)*1,an=u*5+j*2.1;if(i)c.lineTo(Math.cos(an)*r,Math.sin(an)*r);else c.moveTo(0,0)}c.stroke()}c.restore()}
  function strand(c,x1,y1,x2,y2,ph,amp,al,col){
    const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;c.save();c.globalAlpha=al;c.strokeStyle=col;c.lineWidth=.8;c.beginPath();
    c.moveTo(x1,y1);c.bezierCurveTo(x1+dx*.3+nx*Math.sin(ph)*amp,y1+dy*.3+ny*Math.sin(ph)*amp,x1+dx*.7+nx*Math.sin(ph+2)*amp,y1+dy*.7+ny*Math.sin(ph+2)*amp,x2,y2);c.stroke();c.restore()}
  function strands(c,s,t){
    if(s.st!==1||s.sw<.3)return;const L=lc(s),k=clamp((s.sw-.3)/.7,0,1),ph=s.rm?0:t/800,rise=4*E.out(s.sw);
    for(let i=0;i<3;i++){const sx=FACE[0]+(i-1)*9,sy=FACE[1]+9-rise;strand(c,sx,sy,L.x+(i-1)*3,L.y-8,ph+i*1.9,5,(s.walking?.2:.5)*k,"#9A6AE0");strand(c,sx,sy,L.x+(i-1)*3,L.y-8,ph+i*1.9,5,(s.walking?.05:.16)*k,"#E0C8FF")}
    for(const l of s.lights)if(l.out>.2)strand(c,FACE[0],FACE[1]+6-rise,l.x,l.y,ph+l.i,3,.45*l.out*k,"#B58AE8")}
  function lightIcon(c,l,x,y,dim){
    const ok=mPiece(c,ID,l.icon,x,y,{ax:.5,ay:.5,sc:1.25,a:dim?.32:1});
    if(!ok){c.globalAlpha=dim?.35:1;c.fillStyle=l.col;c.beginPath();c.moveTo(x,y-3);c.lineTo(x+3,y);c.lineTo(x,y+3);c.lineTo(x-3,y);c.fill();c.fillStyle="#FFF";c.fillRect(x-.5,y-.5,1,1);c.globalAlpha=1;return}
    if(dim){const cv=mTint(ID,l.icon,"#5C586C",.8);if(cv)mCanvas(c,cv,x,y,{ax:.5,ay:.5,sc:1.25,a:.6})}}
  function lightDraw(c,s,l,t){
    const P=lightPos(s,l),ready=l.cool<=0;
    if(l.fly>0){const e=E.out(1-l.fly/FLY),x=lerp(l.fx,l.tx,e),y=lerp(l.fy,l.ty,e);
      c.save();c.globalAlpha=.85*(l.fly/FLY);c.strokeStyle=l.col;c.lineWidth=1.5;c.beginPath();c.moveTo(l.fx,l.fy);c.lineTo(x,y);c.stroke();c.restore();glow(c,x,y,11,l.col,.8);lightIcon(c,l,x,y,false)}
    if(ready){glow(c,P.x,P.y,9,l.col,.5+(s.rm?0:Math.sin(t/260+l.i)*.08));lightIcon(c,l,P.x,P.y,false)}
    else{lightIcon(c,l,P.x,P.y,true);c.save();c.strokeStyle="rgba(255,255,255,.16)";c.lineWidth=.8;c.beginPath();c.arc(P.x,P.y,6,0,7);c.stroke();c.restore();ring(c,P.x,P.y,6,1-l.cool/RECOV,l.col,1.1)}}
  function wanderer(c,s,t,y,lit){
    const x=s.x,f=s.walking&&!s.rm?Math.floor(t/170)%3:0;mShadow(c,x,y,15,.4);
    if(!mSpr(c,"wanderer_up_"+f,x-8,y-23)){px(c,x-5,y-18,10,17,"#2F7470");px(c,x-4,y-23,8,6,"#2F7470")}
    const L={x:x+5,y:y-11};glow(c,L.x,L.y,lit<.6?8:19,"#F5C66A",.55*lit)}
  function dawnLine(c,s,t){
    const d=s.dawn;if(!(d>0))return;const pl=s.rm?1:.9+.1*Math.sin(t/900);
    for(const q of [[0,43],[149,192]]){const g=c.createLinearGradient(0,78,0,88);g.addColorStop(0,"rgba(120,50,130,0)");g.addColorStop(.3,`rgba(150,64,138,${.8*d})`);g.addColorStop(.62,`rgba(255,190,96,${.95*d*pl})`);g.addColorStop(1,"rgba(255,224,150,0)");c.fillStyle=g;c.fillRect(q[0],78,q[1]-q[0],10)}
    glow(c,20,83,40,"rgba(255,180,100,.9)",.32*d*pl);glow(c,172,83,40,"rgba(255,180,100,.9)",.32*d*pl);glow(c,96,87,10+16*d,"rgba(255,226,150,.9)",.5*d)}
  function scene(s,c,t){ /* the plain: background, the Void's face, the dawn line, strands */
    if(!mBg(c,ID,0))flatBg(c,s);
    if(s.st>=1&&s.sw>0){const k=s.sw,e=E.out(k);swirlDraw(c,s,t,s.rm?k:Math.min(1,k*2),s.rm?.5:lerp(.12,.5,e),s.swA,4*e)}
    dawnLine(c,s,t);strands(c,s,t)}
  function lanternDim(c,s,L){if(s.dim>0){c.save();c.strokeStyle="rgba(20,10,30,.8)";c.lineWidth=1;c.beginPath();c.arc(L.x,L.y,5,0,7);c.stroke();c.restore()}}
  /* ---- the round ---- */
  MINI.boss_b1={
    who:"b1",boss:"b1",title:"Carry It Anyway",land:"l1",nofl:true,
    setup:["The Void pours itself across the plain. Walk through it."],
    how:"Walk with the pad, or drag with your finger. Tap a dark wisp, or press A, to send a light at it.",
    win:"You carried it anyway. The Void recoils.",
    walk:"You keep walking. That’s enough.",
    stages:["The Plain","The Pull","The Long Dark"],
    lines:[null,SAY1,SAY2],
    pad:true,ab:true,limit:0,long:false,bloomT:4.5,
    init(s){Object.assign(s,{st:0,stT:0,gt:0,x:96,p:0,walking:false,wisps:[],spT:1.2,spawned:0,blocked:0,hits:0,slow:0,dim:0,ig:false,P:pfx(),
      sw:0,swA:0,dawn:0,rx:17,ry:12,om:.9,pullT:0,_bm:0,_sh:0,lights:makeLights()});place(s)},
    toStage(s,n){this.init(s);if(n>=1){s.p=n/3;stageUp(s,n);s.rx=n>=2?10:17;s.ry=n>=2?7:12;s.om=n>=2?1.4:.9;place(s)}},
    step(s,dt,inp){
      inp=inp||{};s.gt+=dt;s.stT+=dt;
      if(!inp.down)s.ig=false;
      /* taps send a light at a wisp (a hit area of 16 units around it); A sends one at the wisp nearest you */
      for(const tp of inp.taps||[]){if(!tp||!isFinite(tp.x)||!isFinite(tp.y))continue;let best=null,bd=16;
        for(const w of s.wisps){if(w.dead)continue;const d=dst(w.x,w.y,tp.x,tp.y);if(d<bd){bd=d;best=w}}
        if(best){send(s,best);s.ig=true}}
      if(inp.aTap){const L=lc(s);let best=null,bd=1e9;for(const w of s.wisps){if(w.dead)continue;const d=dst(w.x,w.y,L.x,L.y);if(d<bd){bd=d;best=w}}if(best)send(s,best)}
      /* walking: pad (up, or sideways) or a finger down (x steers toward it, any drag walks forward) */
      let mx=inp.dx||0,moving=!!(inp.dx)||(inp.dy||0)<0;
      const d=inp.down&&isFinite(inp.down.x)&&isFinite(inp.down.y)&&!s.ig?inp.down:null;
      if(d){moving=true;const e=d.x-s.x;mx=Math.abs(e)<3?0:Math.sign(e)}
      s.x=clamp(s.x+mx*72*dt,XL,XR);s.walking=moving;
      const hurt=s.slow>0;s.slow=Math.max(0,s.slow-dt);s.dim=Math.max(0,s.dim-dt);
      const f=Math.min(hurt?.6:1,s.st===1?.8:1);          /* a hit: 60% (it never stacks); Wave II's pull: 80%; the slower of the two */
      if(moving)s.p=Math.min(1,s.p+dt/WALK*f);
      else if(s.st===1){s.p=Math.max(T1,s.p-SLIP/(Y0-Y1)*dt);s.pullT-=dt;if(s.pullT<=0&&s.p>T1){s.pullT=1.6;sfx("pull",1)}}   /* standing still slips you back, never below where the wave began */
      if(s.st===0&&s.p>=T1){stageUp(s);sfx("pull")}
      if(s.st===1&&s.p>=T2)stageUp(s);
      /* the Void's face rises in Wave II; the dawn line comes in Wave III */
      if(s.st>=1)s.sw=Math.min(1,s.sw+dt/2.5);s.swA+=dt*(s.rm?.1:.5);
      const dT=s.st>=2?.3+.7*clamp((s.p-T2)*3,0,1):0;s.dawn=s.rm?dT:s.dawn+clamp(dT-s.dawn,-dt*.5,dt*.5);
      /* the orbit: close and quick in Wave III */
      const kk=Math.min(1,dt*2.2),tx=s.st>=2?10:17,ty=s.st>=2?7:12,to=s.st>=2?1.4:.9;s.rx+=(tx-s.rx)*kk;s.ry+=(ty-s.ry)*kk;s.om+=(to-s.om)*kk;
      /* the lights: recovery (in Wave II only while you walk), drawn out toward the Void while they recover in Wave II */
      for(const l of s.lights){
        if(l.cool>0&&(s.st!==1||moving))l.cool=Math.max(0,l.cool-dt);
        l.fly=Math.max(0,l.fly-dt);
        const tg=s.st===1&&l.cool>0?E.out(Math.min(1,l.cool/RECOV)):0;l.out+=clamp(tg-l.out,-dt*(s.rm?.5:1.6),dt*(s.rm?.5:1.6));
        if(!s.rm)l.a+=dt*s.om}
      /* wisps */
      s.spT-=dt;if(s.spT<=0)spawn(s);
      const T=lc(s);
      for(const w of s.wisps){
        if(w.dead){if(w.wait>0){w.wait-=dt;if(w.wait<=0)burst(s,w.x,w.y,w.col||"#FFF1C8")}else w.dying+=dt;continue}
        const dx=T.x-w.x,dy=T.y-w.y,dd=Math.hypot(dx,dy)||1,ph=w.ph||0,surge=Math.max(0,Math.sin(s.gt*1.6+ph));
        const base=(21+s.st*3)*(1+1.2*surge)*(moving?1.12:1),sw=Math.sin(s.gt*2.1+ph*1.7)*11;
        w.vx=dx/dd*base-dy/dd*sw;w.vy=dy/dd*base+dx/dd*sw;w.sp=Math.hypot(w.vx,w.vy);w.fast=w.fast?w.sp>29:w.sp>35;
        w.x+=w.vx*dt;w.y+=w.vy*dt;
        w.tt=(w.tt||0)+dt;if(w.tt>.06){w.tt=0;(w.tr||(w.tr=[])).push([w.x,w.y]);if(w.tr.length>6)w.tr.shift()}
        if(dd<9&&!send(s,w))hit(s,w)}
      s.wisps=s.wisps.filter(w=>!w.dead||w.wait>0||w.dying<.4);
      place(s);pStep(s.P,dt,s.rm);
      if(s.p>=1)return "win"},
    draw(s,c,t){
      scene(s,c,t);
      if(s.dawn>0)grade(c,"#C07A6A",.1*s.dawn,"soft-light");
      s.wisps.forEach(w=>wispDraw(c,s,w,t));
      const L=lc(s);wanderer(c,s,t,feet(s.p),s.dim>0?.4:1);lanternDim(c,s,L);
      s.lights.forEach(l=>lightDraw(c,s,l,t));
      pDraw(c,s.P,ID);vignette(c,.12)},
    bloom(s,c,k,t){ /* the lights flare into one star, the Void unravels into violet sparks, and dawn breaks in plum and gold (Reduce Motion: k is always 1, a still of the last frame) */
      const rm=s.rm,e=ease(k);
      if(!s._bm){s._bm=1;s.P=pfx();s._bt=t;s._sh=0;sfx("dawn")}
      let db=(t-s._bt)/1000;s._bt=t;if(!(db>0&&db<.1))db=1/60;
      if(!mBg(c,ID,0))flatBg(c,s);
      /* the Void: a dark wash over the painted robe, then it fades as the swirl spins out and comes apart */
      const wash=rm?0:.55*ease(clamp(k/.2,0,1))*(1-ease(clamp((k-.4)/.5,0,1)));
      if(wash>0){c.save();c.globalAlpha=wash;c.fillStyle="#0A0614";c.beginPath();c.moveTo(96,2);c.lineTo(78,14);c.lineTo(68,32);c.lineTo(60,54);c.lineTo(50,76);c.lineTo(43,88);c.lineTo(149,88);c.lineTo(142,76);c.lineTo(132,54);c.lineTo(124,32);c.lineTo(114,14);c.closePath();c.fill();c.restore()}
      const sa=rm?0:1-ease(clamp((k-.2)/.5,0,1));
      if(sa>0)swirlDraw(c,s,t,sa,.5*(1+e*.9),s.swA+k*k*14,4+e*6);
      if(!rm){
        if(k>=.22&&!s._sh){s._sh=1;pSparks(s.P,FACE[0],FACE[1],26,"#B58AE8",70);pSparks(s.P,FACE[0],FACE[1],14,"#E0C8FF",50)}
        for(let i=0;i<48;i++){const age=clamp((k-.18)/.55-i/48*.3,0,1);if(age<=0||age>=1)continue;const r=8+age*age*95+(i%3)*3,an=i*2.399+age*6;
          c.globalAlpha=(1-age)*.9;c.fillStyle=i%3?"#B58AE8":"#E0C8FF";c.fillRect(hs(FACE[0]+Math.cos(an)*r),hs(FACE[1]+Math.sin(an)*r*.8),i%4?1.5:2,i%4?1.5:2)}
        c.globalAlpha=1}
      /* dawn: the plum sweep, then gold; light spreading along the horizon */
      const plum=rm?0:Math.sin(Math.PI*clamp((k-.1)/.55,0,1))*.4,gold=rm?.3:ease(clamp((k-.35)/.5,0,1))*.34,hl=rm?1:ease(clamp((k-.3)/.5,0,1));
      grade(c,"#8A3A7A",plum,"soft-light");grade(c,"#F2C070",gold,"soft-light");
      /* lead fix: the Void is gone. A dawn sky (plum above, gold at the horizon) fades in over the whole painted sky, robe and all */
      const sky=rm?1:ease(clamp((k-.38)/.45,0,1));
      if(sky>0){c.save();c.globalAlpha=.94*sky;const sg=c.createLinearGradient(0,0,0,89);sg.addColorStop(0,"#2A1838");sg.addColorStop(.45,"#6A2E5C");sg.addColorStop(.8,"#C86A5C");sg.addColorStop(1,"#F2B470");
        c.fillStyle=sg;c.fillRect(0,0,192,89);c.restore()}
      if(hl>0){c.save();c.globalCompositeOperation="lighter";const g=c.createLinearGradient(96-hl*104,0,96+hl*104,0);g.addColorStop(0,"rgba(255,200,110,0)");g.addColorStop(.5,`rgba(255,214,130,${.7*hl})`);g.addColorStop(1,"rgba(255,200,110,0)");
        c.fillStyle=g;c.fillRect(0,78,192,10);c.restore();
        c.save();c.translate(96,85);c.scale(2.6,.55);glow(c,0,0,60*hl,"rgba(255,214,140,.9)",.6*hl);c.restore();
        if(!rm)for(let j=-3;j<=3;j++)shaft(c,96,86,150,26,Math.PI+j*.21,"rgba(255,220,150,.9)",.13*hl)}
      /* the Wanderer stands at the dawn line; the seven lights rise from the orbit and flare into one star above him */
      const x=s.x,fy=Y1,sx=x+5,sy=fy-38;
      mShadow(c,x,fy,15,.4);if(!mSpr(c,"wanderer_up_0",x-8,fy-23)){px(c,x-5,fy-18,10,17,"#2F7470");px(c,x-4,fy-23,8,6,"#2F7470")}
      glow(c,x+5,fy-11,16+10*e,"#F5C66A",.5+.3*e);
      s.lights.forEach(l=>{const u=rm?1:ease(clamp(k*2.6-l.i*.04,0,1)),lx=lerp(l.x,sx,u)+(rm?0:Math.sin(u*Math.PI)*(l.i-3)*3),ly=lerp(l.y,sy,u)-(rm?0:Math.sin(u*Math.PI)*6),al=1-ease(clamp((u-.55)/.45,0,1));
        if(al>0){c.save();c.globalAlpha=al;glow(c,lx,ly,10,l.col,.8);lightIcon(c,l,lx,ly,false);c.restore()}});
      const st=rm?1:ease(clamp((k-.22)/.25,0,1));
      if(st>0){glow(c,sx,sy,14+22*st+(rm?0:Math.sin(t/300)*2),"#FFF6D0",.95*st);glow(c,sx,sy,30+30*st,"rgba(255,210,120,.9)",.35*st);
        c.save();c.translate(sx,sy);c.globalAlpha=st;c.fillStyle="#FFFFFF";c.fillRect(-1.5,-1.5,3,3);c.fillStyle="#FFF1C0";
        for(let j=0;j<4;j++){c.save();c.rotate(j*Math.PI/4+(rm?0:t/4000));c.fillRect(-1,-(j%2?9:15)*st,2,(j%2?18:30)*st);c.restore()}c.restore();
        if(!rm&&k<.9){ring(c,sx,sy,6+e*46,1,`rgba(255,236,170,${.5*(1-e)})`,1)}}
      if(!rm&&k>.35){for(let i=0;i<26;i++){const hh=(i*0.61803)%1,y=232-((k*70+hh*190)%190),xx=14+((i*47)%164);c.globalAlpha=.7*clamp(1-Math.abs(y-130)/110,0,1);c.fillStyle=i%2?"#FFE3A0":"#F5C66A";c.fillRect(hs(xx+Math.sin(k*3+i)*3),hs(y),1.5,1.5)}c.globalAlpha=1}
      pStep(s.P,db,rm);pDraw(c,s.P,ID);vignette(c,.12)},
    _t:{Y0,Y1,T1,T2,WALK,RECOV,SLIP,feet,lc,lightPos,orbitPos,send,hit,spawn,makeLights,place,FACE},   /* tests only */
    auto(s,inp){inp.dy=-1;                       /* walk up, and send a light at the wisp nearest you whenever one is ready */
      if(s.lights.some(l=>l.cool<=0)){const L=lc(s);let bd=1e9;for(const w of s.wisps){if(w.dead)continue;const d=dst(w.x,w.y,L.x,L.y);if(d<bd)bd=d}if(bd<85)inp.aTap=true}}
  };
})();
/* GAME:boss_b1:END */

/* GAME:boss_b2:BEGIN */
/* ---- Phase 35B: The Still Center, developed - Level II's boss round on Fortune's wheel ----
   Idea check: playing this, you feel Fortune's wheel throw you harder the farther out you stand, her prizes tug you outward when you touch them (harder when you close your hands on them),
   and the only calm is the center you keep, which becomes a citadel in the storm. That is the Stoic idea of a still center that spinning fortune can't move.
   Controls (two of Level II's): steer against the shoves (The Golden Mean's hold-to-steer, and Only What's Yours' move), and hold A to close your hands (Only What's Yours).
   The wheel (the painted bronze wheel, turned in code) is centred on the hub [96,160] (hub radius H = 14, rim R = 73); you can't leave it (clamped to R - 7). Its push on you (outward, plus a sideways part along the spin)
   is K (r - H) omega: it grows with your distance from the hub and with the wheel's speed, and inside the hub it is zero. Holding A (brace) cuts the push to 30% and your speed to 60%, but you catch what Fortune throws.
   Hub time (s.hub) counts toward the win (30 s in all): a ring fills around the hub, and a bar sits above y 250. The waves are by hub time:
   I The Turning (0-10 s): the wheel spins up (omega .6 -> 2). II Her Gifts (10-20 s): Fortune throws prizes from her face across the wheel (past within 25 of the hub). A prize that touches you tugs you outward
   (35 u/s for .5 s); if you are braced you catch it (it sticks to your hands, a gold flash) and the tug is strong (70 u/s for .7 s). III The Storm (20-30 s): the wheel's fastest (omega up to 3.2), rain, lightning glows,
   prizes faster, and the golden citadel rises around the hub (3 s): inside it (the hub) the push is zero, the rain stops, and prizes bounce off its walls and can't touch you.
   Never "end"; no lives; nothing is lost. Bloom: the wheel spins on without you, the storm parts, the citadel shines at the hub, and Fortune looks away behind a cloud. */
(function(){
  const ID="boss_b2";
  const px=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(hs(x),hs(y),w,h)};
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const ease=k=>k<=0?0:k>=1?1:k*k*(3-2*k);
  const dst=(a,b,c,d)=>Math.hypot(a-c,b-d);
  const hash=i=>{let h=(i*374761393+668265263)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967295};
  const HUB=[96,160],H=14,R=73,RC=R-7,K=.2,WALL=19,SPEED=54,WIN=30,FACE=[96,40],PR=["prize_coins","prize_laurel","prize_mask","prize_crown"];
  const SAY1="Fortune begins to throw her gifts. Reach for them, and they pull you off your center.",SAY2="The storm breaks over the wheel. A citadel rises at the hub.";
  /* ---- the Wanderer, with a 1-pixel dark outline and a soft shadow so he reads on the busy wheel ---- */
  const SIL={};
  function silC(img,r,key){let cv=SIL[key];if(!cv){cv=SIL[key]=document.createElement("canvas");cv.width=r[2];cv.height=r[3];const q=cv.getContext("2d");q.drawImage(img,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);q.globalCompositeOperation="source-in";q.fillStyle="#150E1C";q.fillRect(0,0,r[2],r[3])}return cv}
  function wanderer(c,x,y,f){
    const e=ATLAS_IMG.chars,A=ATLAS.chars,n="wanderer_down_"+f,r=A&&A.rects[n];mShadow(c,x,y+1,17,.5);
    if(!e||!e.ok||!r){px(c,x-5,y-12,10,15,"#2F7470");px(c,x-4,y-17,8,6,"#2F7470");return}
    const cv=silC(e.img,r,n);c.save();c.globalAlpha=.95;for(const q of [[-1,0],[1,0],[0,-1],[0,1]])c.drawImage(cv,hs(x-8)+q[0],hs(y-22)+q[1],r[2],r[3]);c.restore();mSpr(c,n,x-8,y-22)}
  /* ---- the rules ---- */
  const radius=s=>dst(s.x,s.y,HUB[0],HUB[1]);
  const omegaFor=(st,h)=>st===0?.6+1.4*clamp(h/10,0,1):st===1?2+.4*clamp((h-10)/10,0,1):2.4+.8*clamp((h-20)/10,0,1);
  const protectedS=s=>s.cit>=1&&radius(s)<H;
  function mkPrize(x,y,vx,vy,k){return {x,y,vx,vy,k:k==null?Math.floor(Math.random()*4):k,rot:Math.random()*6,age:0,hit:false,gone:false,stuck:0,in:false,bnc:false}}
  function throwPrize(s){
    const a=Math.random()*Math.PI*2,q=rnd(5,24),tx=HUB[0]+Math.cos(a)*q,ty=HUB[1]+Math.sin(a)*q,sx=FACE[0]+rnd(-5,5),sy=FACE[1]+rnd(-2,4);
    const d=dst(tx,ty,sx,sy),v=(76+s.st*8)*rnd(.92,1.08);s.prizes.push(mkPrize(sx,sy,(tx-sx)/d*v,(ty-sy)/d*v));s.thrown++;s.gl=.32}
  function burst(s,x,y,col,n){if(s.rm){pAdd(s.P,{k:"glow",x,y,vx:0,vy:0,life:.7,col,s:10,a:.4});return}pSparks(s.P,x,y,n||8,col,44)}
  function touch(s,p){
    const ex=s.x-HUB[0],ey=s.y-HUB[1],r=Math.hypot(ex,ey);let ox,oy;if(r>1e-6){ox=ex/r;oy=ey/r}else{const a=Math.atan2(p.vy||1,p.vx||0);ox=Math.cos(a);oy=Math.sin(a)}
    p.hit=true;
    if(s.brace){s.tug=s.tdur=.7;s.tdx=ox*70;s.tdy=oy*70;p.stuck=.45;s.caught++;s.flash=.3;sfx("snag");burst(s,s.x,s.y-8,"#F5C66A",10)}
    else{s.tug=s.tdur=.5;s.tdx=ox*35;s.tdy=oy*35;s.bumped++;sfx("pick");burst(s,s.x,s.y-8,"#BFE8E0",5)}}
  /* ---- looks ---- */
  function flatBg(c,s){c.fillStyle="#0C1230";c.fillRect(0,0,192,320);for(let i=0;i<70;i++)px(c,hash(i)*186,hash(i+90)*236,4+Math.floor(hash(i+5)*5),1,"#182250");
    c.fillStyle="#0A0E24";c.beginPath();c.arc(HUB[0],HUB[1],R+4,0,7);c.fill();c.fillStyle="#1B2244";c.beginPath();c.arc(HUB[0],HUB[1],R,0,7);c.fill();c.fillStyle="#0C1018";c.fillRect(0,240,192,80)}
  function wheelFb(c,ang){
    c.save();c.translate(HUB[0],HUB[1]);c.rotate(ang);c.strokeStyle="#B87F3A";c.lineWidth=3;c.beginPath();c.arc(0,0,R-2,0,7);c.stroke();c.lineWidth=2.5;
    for(let i=0;i<8;i++){c.save();c.rotate(i*Math.PI/4);c.beginPath();c.moveTo(H,0);c.lineTo(R-2,0);c.stroke();c.fillStyle="#5FA8B8";c.fillRect(R-12,-2,4,4);c.restore()}
    c.fillStyle="#22305A";c.beginPath();c.arc(0,0,H,0,7);c.fill();c.strokeStyle="#F5C66A";c.lineWidth=1;c.stroke();c.restore()}
  function wheelDraw(c,s,ang){if(!mPiece(c,ID,"wheel",HUB[0],HUB[1],{ax:.5,ay:.5,rot:ang,sm:true}))wheelFb(c,ang)}
  function prizeFb(c,k,x,y){x=Math.round(x);y=Math.round(y);
    if(k===0){c.fillStyle="#8A6208";c.beginPath();c.arc(x,y,3.5,0,7);c.fill();c.fillStyle="#F5C66A";c.beginPath();c.arc(x,y,2.5,0,7);c.fill()}
    else if(k===1){px(c,x-4,y,2,2,"#6A9E55");px(c,x-2,y-2,2,2,"#7FC46A");px(c,x+1,y-2,2,2,"#7FC46A");px(c,x+3,y,2,2,"#6A9E55");px(c,x-1,y+2,3,1,"#4F7E3E")}
    else if(k===2){px(c,x-3,y-4,7,8,"#E8DCC0");px(c,x-2,y-1,2,1,"#22305A");px(c,x+1,y-1,2,1,"#22305A");px(c,x-1,y+2,3,1,"#B8A890")}
    else{px(c,x-4,y,9,3,"#D9A93A");px(c,x-4,y-3,2,3,"#F5C66A");px(c,x,y-4,1,4,"#F5C66A");px(c,x+3,y-3,2,3,"#F5C66A")}}
  function prizeDraw(c,s,p,t){
    let x=p.x,y=p.y;if(p.stuck>0){x=s.x+9;y=s.y-10;glow(c,x,y,12,"#F5C66A",.7*Math.min(1,p.stuck/.2))}
    else{mShadow(c,x+3,y+10,9,.28);glow(c,x,y,10,"rgba(255,226,150,.9)",.38)}
    if(!mPiece(c,ID,PR[p.k],x,y,{ax:.5,ay:.5,rot:s.rm?0:p.rot,sc:1.2,sm:true}))prizeFb(c,p.k,x,y)}
  const CY=176;                                  /* where the citadel's foot stands, and the front-wall slice that stands in front of you when you are inside */
  function citadel(c,s,t,front){
    const e=E.out(s.cit);if(e<=0)return;const y=s.rm?CY:CY+(1-e)*32;
    if(!front)glow(c,HUB[0],HUB[1]-4,36+8*e,"rgba(255,200,110,.9)",.5*e);
    c.save();c.beginPath();if(front)c.rect(0,HUB[1]+4,192,CY-HUB[1]-4);else c.rect(0,0,192,CY);c.clip();c.globalAlpha=s.rm?e:1;
    const ok=mPiece(c,ID,"citadel",HUB[0],y,{ax:.5,ay:1,sc:1.6,sm:true});
    if(!ok){const h=Math.round(30*e);c.fillStyle="#D9A93A";c.fillRect(78,CY-h,36,h);c.fillStyle="#F2CF7A";c.fillRect(78,CY-h,36,1);for(const dx of [-20,10])c.fillRect(HUB[0]+dx,CY-h-5,10,h+5);c.fillStyle="#3A2A12";c.fillRect(91,CY-11,10,11)}
    c.restore()}
  function stormUnder(c,s,t){ /* cloud shadows racing over the sea */
    const k=s.rm?(s.st>=2?.6:0):s.storm;if(k<=0)return;const gt=s.rm?0:s.gt;
    for(let i=0;i<3;i++){const x=((gt*(26+i*13)+i*90)%320)-70,y=50+i*72;c.save();c.globalAlpha=(s.rm?.1:.2)*k;c.fillStyle="#050C18";c.beginPath();c.ellipse(x,y,56,22,-.2,0,7);c.fill();c.restore()}}
  function stormOver(c,s,t){ /* a darker grade, soft lightning glows away from the hub, and rain (none over the citadel) */
    const k=s.rm?(s.st>=2?.6:0):s.storm;if(k<=0)return;const gt=s.rm?0:s.gt;
    grade(c,"#04081A",.3*k);
    for(const g of s.lg){const u=g.t/g.dur,a=Math.pow(Math.sin(Math.PI*u),2)*(s.rm?.3:.55);glow(c,g.x,g.y,64,"rgba(170,235,250,.9)",a)}
    const hold=s.cit>=.5;c.save();c.strokeStyle="rgba(185,210,222,.5)";c.lineWidth=.6;c.globalAlpha=k*(s.rm?.5:1);c.beginPath();
    for(let i=0;i<64;i++){const sp=250+hash(i+7)*90,y=((gt*sp+hash(i+3)*340)%340)-12,x=hash(i)*230-14-y*.15;if(hold&&dst(x,y,HUB[0],HUB[1])<WALL+2)continue;c.moveTo(x,y);c.lineTo(x-1.8,y+7)}c.stroke();c.restore()}
  function hands(c,s,t){const x=s.x,y=s.y-9;
    if(s.brace){px(c,x-12,y-1,3,3,"#F5C66A");px(c,x+9,y-1,3,3,"#F5C66A");glow(c,x-11,y,6,"#F5C66A",.4);glow(c,x+10,y,6,"#F5C66A",.4)}
    else{px(c,x-12,y,3,1,"#BFE8E0");px(c,x-12,y+2,3,1,"#BFE8E0");px(c,x+9,y,3,1,"#BFE8E0");px(c,x+9,y+2,3,1,"#BFE8E0")}}
  /* ---- the round ---- */
  MINI.boss_b2={
    who:"b2",boss:"b2",title:"The Still Center",land:"l2",nofl:true,
    setup:["Fortune’s wheel turns under your feet. Find the one place it can’t move you."],
    how:"Move with the pad or your finger. Hold A to close your hands: you hold your ground, but you catch what Fortune throws.",
    win:"The wheel spins on without you. Fortune scowls.",
    walk:"You find your footing. Fortune looks away.",
    stages:["The Turning","Her Gifts","The Storm"],
    lines:[null,SAY1,SAY2],
    pad:true,ab:true,limit:0,long:false,bloomT:4.5,
    init(s){Object.assign(s,{mv:false,st:0,stT:0,gt:0,x:140,y:190,ang:0,om:.6,omLock:null,hub:0,prizes:[],pT:1,tug:0,tdur:.5,tdx:0,tdy:0,brace:false,pushV:0,thrown:0,caught:0,bumped:0,gl:0,flash:0,cit:0,storm:0,lg:[],lgT:1.5,stT2:0,P:pfx(),_bm:0})},
    toStage(s,n){this.init(s);if(n>=1){s.hub=n*10;stageUp(s,n);s.om=omegaFor(n,s.hub);s.pT=.8}},
    step(s,dt,inp){
      inp=inp||{};s.gt+=dt;s.stT+=dt;
      /* the wheel's speed follows hub time: it spins up in I, is quick in II, and is fastest in III */
      s.om=isFinite(s.omLock)&&s.omLock!=null?s.omLock:s.om+(omegaFor(s.st,s.hub)-s.om)*Math.min(1,dt*2);s.ang+=Math.min(s.om,s.rm?1:9)*dt;
      s.brace=!!inp.a;
      let mx=inp.dx||0,my=inp.dy||0;
      if(inp.down&&isFinite(inp.down.x)&&isFinite(inp.down.y)){const dx=inp.down.x-s.x,dy=inp.down.y-s.y,d=Math.hypot(dx,dy);if(d>2){mx=dx/d;my=dy/d}else{mx=0;my=0}}
      const ml=Math.hypot(mx,my);if(ml>1){mx/=ml;my/=ml}s.mv=ml>0;
      const spd=SPEED*(s.brace?.6:1),ex=s.x-HUB[0],ey=s.y-HUB[1],r=Math.hypot(ex,ey),ox=r>1e-6?ex/r:1,oy=r>1e-6?ey/r:0;
      const push=r>H?K*(r-H)*s.om:0,bf=s.brace?.3:1;s.pushV=push*bf;
      s.tug=Math.max(0,s.tug-dt);const tg=s.tdur>0?s.tug/s.tdur:0;
      s.x+=(mx*spd+(ox*push-oy*push*.5)*bf+s.tdx*tg)*dt;s.y+=(my*spd+(oy*push+ox*push*.5)*bf+s.tdy*tg)*dt;
      const fx=s.x-HUB[0],fy=s.y-HUB[1],fr=Math.hypot(fx,fy);if(fr>RC){s.x=HUB[0]+fx/fr*RC;s.y=HUB[1]+fy/fr*RC}
      if(radius(s)<H)s.hub+=dt;
      /* waves, by hub time */
      if(s.st===0&&s.hub>=10){stageUp(s);s.pT=.8}
      if(s.st===1&&s.hub>=20){stageUp(s);sfx("storm");sfx("citadel")}
      /* Fortune's prizes */
      s.gl=Math.max(0,s.gl-dt);s.flash=Math.max(0,s.flash-dt);
      if(s.st>=1){s.pT-=dt;if(s.pT<=0){throwPrize(s);s.pT=s.st===1?rnd(1.2,1.6):rnd(.8,1.1)}}
      for(const p of s.prizes){
        if(p.stuck>0){p.stuck-=dt;if(p.stuck<=0)p.gone=true;continue}
        p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=dt*2.4;
        const hr=dst(p.x,p.y,HUB[0],HUB[1]);if(hr<R+4)p.in=true;
        if(s.cit>=1&&hr<WALL&&!p.bnc){ /* the citadel's walls turn it back */
          const nx=(p.x-HUB[0])/(hr||1),ny=(p.y-HUB[1])/(hr||1),vn=p.vx*nx+p.vy*ny;
          if(vn<0){p.vx-=2*vn*nx;p.vy-=2*vn*ny}else{p.vx=nx*60;p.vy=ny*60}
          p.x=HUB[0]+nx*WALL;p.y=HUB[1]+ny*WALL;p.bnc=true;sfx("clink");burst(s,p.x,p.y,"#F5C66A",5)}
        if(!p.hit&&!protectedS(s)&&dst(p.x,p.y,s.x,s.y-6)<9)touch(s,p);
        if((p.in&&hr>R+10)||p.age>7)p.gone=true}
      s.prizes=s.prizes.filter(p=>!p.gone);
      /* the storm and the citadel (Wave III) */
      if(s.st>=2){s.storm=Math.min(1,s.storm+dt/2);s.cit=Math.min(1,s.cit+dt/3);
        s.lgT-=dt;if(s.lgT<=0){s.lgT=rnd(1.4,2.8);let x=0,y=0;for(let i=0;i<6;i++){x=rnd(10,182);y=rnd(30,230);if(dst(x,y,HUB[0],HUB[1])>62)break}s.lg.push({x,y,t:0,dur:s.rm?2.4:.55})}
        s.stT2-=dt;if(s.stT2<=0){s.stT2=5;sfx("storm")}}
      for(const g of s.lg)g.t+=dt;s.lg=s.lg.filter(g=>g.t<g.dur);
      pStep(s.P,dt,s.rm);
      if(s.hub>=WIN)return "win"},
    draw(s,c,t){
      if(!mBg(c,ID,0))flatBg(c,s);
      stormUnder(c,s,t);
      wheelDraw(c,s,s.ang);
      /* the hub: a glow and the ring that fills with hub time */
      const hk=clamp(s.hub/WIN,0,1),inH=radius(s)<H;
      glow(c,HUB[0],HUB[1],24,"rgba(255,224,150,.9)",inH?.32:.12);
      c.save();c.strokeStyle="rgba(255,255,255,.2)";c.lineWidth=2;c.beginPath();c.arc(HUB[0],HUB[1],H+6.5,0,7);c.stroke();c.restore();ring(c,HUB[0],HUB[1],H+6.5,hk,"#FFF1C8",2);
      citadel(c,s,t);
      wanderer(c,s.x,s.y,s.mv&&!s.rm?Math.floor(t/220)%3:0);hands(c,s,t);if(s.cit>0&&radius(s)<H+2)citadel(c,s,t,true);
      if(s.flash>0&&!s.rm)glow(c,s.x,s.y-8,22,"#F5C66A",s.flash/.3*.8);
      for(const p of s.prizes)prizeDraw(c,s,p,t);
      if(s.gl>0){const a=s.gl/.32;glow(c,FACE[0],FACE[1],16,"#FFF0B0",a*.9);c.save();c.globalAlpha=a;c.fillStyle="#FFF8D8";c.fillRect(FACE[0]-5,FACE[1]-.5,10,1);c.fillRect(FACE[0]-.5,FACE[1]-5,1,10);c.restore()}
      stormOver(c,s,t);pDraw(c,s.P,ID);
      meter(c,10,238,172,4,hk,"#D9A93A");vignette(c,.14)},
    bloom(s,c,k,t){ /* the wheel spins on without you, the storm parts, the citadel shines, and Fortune looks away (Reduce Motion: k is always 1, a still) */
      const rm=s.rm,e=ease(k);
      if(!s._bm){s._bm=1;s.P=pfx();s._bt=t;sfx("citadel")}
      let db=(t-s._bt)/1000;s._bt=t;if(!(db>0&&db<.1))db=1/60;
      if(!mBg(c,ID,0))flatBg(c,s);
      const ang=s.ang+(rm?0:4.5*(3.2*k-k*k));wheelDraw(c,s,ang);
      /* the storm parts from the center: a dark veil pulled back, the grade clears to gold-teal */
      const rr=e*250,g=c.createRadialGradient(HUB[0],HUB[1],rr,HUB[0],HUB[1],rr+90);g.addColorStop(0,"rgba(4,8,22,0)");g.addColorStop(1,`rgba(4,8,22,${.5*(1-e*.6)})`);
      if(e<1){c.fillStyle=g;c.fillRect(0,0,192,320)}
      grade(c,"#BFE8D0",.14*e,"soft-light");grade(c,"#F8E39A",.18*e,"soft-light");
      glow(c,HUB[0],HUB[1],60+90*e,"rgba(255,224,150,.9)",.28*e);
      for(let j=0;j<3;j++)ring(c,HUB[0],HUB[1],22+j*9+(rm?0:Math.sin(t/700+j)*1.5),1,`rgba(255,226,160,${.28*e/(j+1)})`,1);
      s.cit=1;citadel(c,s,t);glow(c,HUB[0],HUB[1]-8,26,"#FFF1C0",.4*e);
      wanderer(c,s.x,s.y,0);citadel(c,s,t,true);
      if(!rm)for(let i=0;i<30;i++){const hh=hash(i+11),a=hh*6.28,rr2=14+hash(i+40)*52,y=HUB[1]+Math.sin(a)*rr2*.8-((k*40+hh*60)%60),x=HUB[0]+Math.cos(a)*rr2;c.globalAlpha=.8*e*(1-((k*40+hh*60)%60)/60);c.fillStyle=i%2?"#FFE3A0":"#F5C66A";c.fillRect(hs(x),hs(y),1.5,1.5)}
      c.globalAlpha=1;
      /* Fortune looks away: a soft cloud wash drifts across her face */
      /* lead fix: the storm calms at the edges (a soft wash over the painted lightning) while the centre clears */
      const cw=c.createRadialGradient(HUB[0],HUB[1],70,HUB[0],HUB[1],190);cw.addColorStop(0,"rgba(120,170,170,0)");cw.addColorStop(1,`rgba(120,170,170,${.42*e})`);c.fillStyle=cw;c.fillRect(0,0,192,320);
      const fa=rm?1:ease(clamp((k-.3)/.5,0,1));
      if(fa>0){c.save();c.globalAlpha=fa;for(let j=0;j<7;j++){const cx=FACE[0]+(j-3)*10+(rm?0:(1-fa)*-30),cy=FACE[1]-6+(j%2)*14,gg=c.createRadialGradient(cx,cy,0,cx,cy,30);gg.addColorStop(0,"rgba(96,140,146,.97)");gg.addColorStop(.55,"rgba(96,140,146,.85)");gg.addColorStop(1,"rgba(96,140,146,0)");c.fillStyle=gg;c.fillRect(cx-30,cy-30,60,60)}c.restore()}
      pStep(s.P,db,rm);pDraw(c,s.P,ID);
      meter(c,10,238,172,4,1,"#F5C66A");vignette(c,.1)},
    _t:{HUB,H,R,RC,K,WALL,WIN,omegaFor,mkPrize,throwPrize,touch,radius,protectedS},   /* tests only */
    auto(s,inp){const dx=HUB[0]-s.x,dy=HUB[1]-s.y;inp.dx=clamp(dx/6,-1,1);inp.dy=clamp(dy/6,-1,1)}   /* head for the hub and stay there; never brace */
  };
  /* Phase 36-B: when the game closes the page calls release() to drop what the game cached from its art (held() counts it; the kit checks it is 0 after a close) */
  MINI[ID].release=function(){for(const k in SIL)delete SIL[k]};MINI[ID].held=function(){return Object.keys(SIL).length};
})();
/* GAME:boss_b2:END */

/* GAME:boss_b3:BEGIN */
/* ---- Phase 35C: Open Hands, developed - Level III's boss round in the Grasping Mind's bamboo shrine ----
   Idea check: playing this, you feel your hands filling faster than you can empty them, and the only thing that works is to keep opening them; the heavy things leave only when you are slow and steady.
   That is Level III's idea that letting go is the strength, and clinging is what fills the pack.
   Controls (two of Level III's): tap a treasure to set it down (Be Water and Tune the Lute's tap), and hold a heavy one slowly and steadily (The Tenzo's Kitchen's slow, steady hand); keys: left/right choose, Z set down, hold Z for a heavy one.
   The eight slots (geo.slots_suggested) are your hands: soft open cradles on the ground. The spirit's arms (the painted arm, turned about its shoulder; three a side) swing out, a hand hovers over a free slot's column, and the treasure falls
   from it into the slot (a short ease, a soft settle). Only a landed treasure can be set down. A LIGHT one (coins, jewel) goes with a tap; a HEAVY one (tablet, food: larger, a dark rope band, a slow wobble, dust) needs a slow steady press-and-hold of 1.2 s
   (the ring around the slot fills; moving faster than 110 units/s empties it with a clatter and the treasure stays). Each release becomes exactly one firefly that rises to the shrine and stays among the bamboo; the four stone lanterns brighten with done/25.
   When all eight slots are full, the arms, the drop timer and the falling run at 55% (the belly glows brighter, the mist thickens), but tapping and holding stay at full speed and a release always counts at once: nothing ever blocks you, there is no fail.
   I Full Hands (0-7 set down): light treasures only, one every ~2 s. II Heavy Things (8-16): one in three is heavy (never two in a row), every ~1.65 s. III Open (17-25): two arms at once every ~1.4 s (about 0.7 s a treasure), a third heavy.
   Win: 25 treasures set down. Never "end". Bloom: the arms fall open and fade, every treasure and the gathered fireflies rise in a swarm over the shrine, the spirit thins into mist from the feet up (the belly glow goes out last), the valley brightens. */
(function(){
  const ID="boss_b3";
  const px=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(hs(x),hs(y),w,h)};
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const ease=k=>k<=0?0:k>=1?1:k*k*(3-2*k);
  const dst=(a,b,c,d)=>Math.hypot(a-c,b-d);
  const hash=i=>{let h=(i*374761393+668265263)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967295};
  const AR=()=>MINI_ART[ID]||{},GEO=()=>AR().geo||{};
  const SL0=[[62,148],[86,148],[110,148],[134,148],[62,178],[86,178],[110,178],[134,178]],LT0=[[52,103],[142,112],[43,191],[144,190]];
  const slotXY=i=>(GEO().slots_suggested||SL0)[i],lanterns=()=>GEO().lanterns||LT0;
  const TRN=["treasure_coins","treasure_jewel","treasure_tablet","treasure_food"];
  const HOLD=1.2,LIM=110,FULL=.55,NEED=25,HOV=106,RT=.38,BT=.5,FALL=.42,WX=96,WY=214,AL=51,BELLY=[100,60];
  const SAY1="Some of these are heavy. Hold them slowly and steadily, and they let go.",SAY2="It gives faster than you can set down. Keep opening your hands.";
  const SH=[[85,47],[106.5,47]];                                  /* the spirit's shoulders: feet [96,120], the 35 x 100 piece, shoulders at [13,54] and [56,54] px */
  const ARMS=[{d:-1,sy:43,rest:[27,30]},{d:-1,sy:48,rest:[20,56]},{d:-1,sy:53,rest:[31,80]},{d:1,sy:43,rest:[165,30]},{d:1,sy:48,rest:[172,56]},{d:1,sy:53,rest:[161,80]}];
  const landed=(s,i)=>!!s.slots[i]&&s.slots[i].f>=1;
  const slotAt=(x,y)=>{let b=-1,bd=1e9;for(let i=0;i<8;i++){const q=slotXY(i),dx=Math.abs(x-q[0]),dy=Math.abs(y-q[1]);if(dx<=13&&dy<=13&&dx+dy<bd){bd=dx+dy;b=i}}return b};
  /* ---- the fireflies (one per release) ---- */
  function perch(n){const a=hash(n*3+1)*6.283,r=hash(n*5+2);let x=96+Math.cos(a)*(36+r*30)*1.1,y=Math.min(126,Math.max(26,72+Math.sin(a)*(18+r*28)));
    if(Math.abs(x-96)<24)x=96+(x<96?-1:1)*(24+hash(n+9)*10);return [x,y]}
  function addFF(s,x,y){const n=s.ffN++,p=perch(n);s.ff.push({x,y,x0:x,y0:y,a:0,ph:hash(n+7)*6.28,hx:p[0],hy:p[1],fd:0,n});
    for(const f of s.ff)if(s.ff.length>28&&!f.fd&&f!==s.ff[s.ff.length-1]){f.fd=.001;break}}
  /* ---- setting down ---- */
  function release(s,i){const v=s.slots[i];if(!v)return false;const q=slotXY(i);s.slots[i]=null;s.done++;addFF(s,q[0],q[1]-2);sfx("letgo");
    if(s.rm)pAdd(s.P,{k:"glow",x:q[0],y:q[1],vx:0,vy:0,life:.6,col:"#FFE9A8",s:9,a:.4});else{pSparks(s.P,q[0],q[1]-2,v.heavy?9:6,"#FFE9A8",v.heavy?36:28);pSparks(s.P,q[0],q[1]-2,3,"#9BE0B8",20)}
    if(s.st===0&&s.done>=8)stageUp(s);else if(s.st===1&&s.done>=17)stageUp(s);return true}
  function put(s,i,k){s.slots[i]={k,heavy:k>=2,f:1,x0:0,y0:0,set:0};return s.slots[i]}
  /* ---- the arms' drops ---- */
  function nextKind(s){if(!s.bag.length){const h=s.st>=1?1:0,b=[0,0,0];if(h)b[Math.floor(Math.random()*3)]=1;
      if(s.st===1&&s.lastH&&b[0])[b[0],b[1]]=[b[1],b[0]];s.bag=b}
    const heavy=s.bag.shift()===1;s.lastH=heavy;return heavy?2+Math.floor(Math.random()*2):Math.floor(Math.random()*2)}
  function startDrop(s){
    const res=new Set(s.arms.filter(a=>a.ph!=="i"&&a.slot>=0).map(a=>a.slot)),free=[];s.slots.forEach((v,i)=>{if(!v&&!res.has(i))free.push(i)});if(!free.length)return false;
    const i=free[Math.floor(Math.random()*free.length)],q=slotXY(i),want=q[0]<96?-1:1;
    const idle=s.arms.filter(a=>a.ph==="i");if(!idle.length)return false;
    const pool=[idle.filter(a=>a.d===want&&a.fr),idle.filter(a=>a.d===want),idle.filter(a=>a.fr),idle].find(l=>l.length),pick=pool[Math.floor(Math.random()*pool.length)];
    pick.ph="r";pick.u=0;pick.slot=i;pick.tx=q[0];pick.ty=HOV;pick.k=nextKind(s);return true}
  function land(s,v,i){v.f=1;v.set=.9;const q=slotXY(i);
    if(v.heavy){sfx("heavy");if(s.rm)pAdd(s.P,{k:"glow",x:q[0],y:q[1]+6,vx:0,vy:0,life:.7,col:"rgba(200,190,160,.9)",s:11,a:.3});else pDust(s.P,q[0],q[1]+7,8,"rgba(190,180,150,.7)")}else sfx("drop")}
  /* ---- looks ---- */
  const fogBlob=(c,x,y,rx,ry,a,col)=>{if(!(a>0))return;c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(-rx,-rx,rx*2,rx*2);c.restore()};
  const SPC=document.createElement("canvas");SPC.width=70;SPC.height=200;
  function flatBg(c,s){const g=c.createLinearGradient(0,0,0,240);g.addColorStop(0,"#1C3A3A");g.addColorStop(1,"#0C1A18");c.fillStyle=g;c.fillRect(0,0,192,240);px(c,0,236,192,84,"#08100E");
    c.fillStyle="#26382E";c.fillRect(70,30,52,64);c.fillStyle="#0E1816";c.fillRect(78,52,36,22);c.fillStyle="#34483A";c.fillRect(80,94,36,22);
    for(const q of lanterns()){px(c,q[0]-3,q[1]-4,6,8,"#3A4A3A");px(c,q[0]-2,q[1]-3,4,4,"#E0B050")}}
  function lanternGlow(c,s,k){const a=.16+.62*k,r=10+14*k;for(const q of lanterns())glow(c,q[0],q[1]-1,r,"rgba(255,214,120,.9)",a)}
  function cradle(c,x,y,foc,heavy,t,rm){c.save();c.translate(x,y+3);c.fillStyle="rgba(8,22,20,.36)";c.beginPath();c.ellipse(0,0,11,6.5,0,0,7);c.fill();
    c.strokeStyle=foc?`rgba(255,226,140,${rm?.9:.7+.25*Math.sin(t/200)})`:heavy?"rgba(214,176,96,.5)":"rgba(204,234,216,.34)";c.lineWidth=foc?1.4:1;c.beginPath();c.ellipse(0,0,11,6.5,0,0,7);c.stroke();
    c.fillStyle=foc?"rgba(255,236,170,.14)":"rgba(222,240,226,.1)";c.beginPath();c.ellipse(0,.4,7.4,4,0,0,7);c.fill();c.strokeStyle=foc?"rgba(255,236,170,.6)":"rgba(222,240,226,.26)";c.lineWidth=.9;c.beginPath();c.ellipse(0,.4,7.4,4,0,0,7);c.stroke();c.restore()}
  function itemDraw(c,s,v,i,t){const q=slotXY(i);let x=q[0],y=q[1]-1,w=0,sq=1;
    if(v.f<1){const f=v.f;x=lerp(v.x0,q[0],f);y=lerp(v.y0,q[1]-1,f*f)}
    else if(v.set>0){const u=v.set/.9;if(v.heavy){w=s.rm?0:Math.sin(u*16)*.09*u;y+=Math.sin(u*Math.PI)*.8}else{y-=s.rm?0:Math.sin(Math.min(1,u*1.4)*Math.PI)*2.2*u}}
    const sc=v.heavy?1.7:1.2,hold=s.grip===i||(s.kh&&s.foc===i&&s.grip<0)?s.hold:0;y-=hold*2;
    mShadow(c,x,q[1]+6,(v.heavy?17:12)*(v.f<1?.6+.4*v.f:1),.34);
    if(hold>0)glow(c,x,y,16,"rgba(255,226,150,.9)",.3+.3*hold);
    const nm=TRN[(v.k|0)%4];
    if(!mPiece(c,ID,nm,x,y,{ax:.5,ay:.5,rot:w,sc,sm:true})){c.fillStyle=v.heavy?"#8A8A6A":"#E0B040";c.beginPath();c.arc(x,y,v.heavy?7:4.5,0,7);c.fill()}
    if(v.heavy){c.save();c.translate(x,y);c.rotate(w);c.fillStyle="#1B1410";c.fillRect(-9,3.5,18,2.4);c.fillStyle="#5A4630";c.fillRect(-9,3.5,18,.7);c.strokeStyle="#1B1410";c.lineWidth=1.3;c.beginPath();c.moveTo(-7,3.5);c.lineTo(-3,-6);c.moveTo(7,3.5);c.lineTo(3,-6);c.stroke();c.fillStyle="#1B1410";c.fillRect(-2,-8.5,4,3);c.restore()}}
  function armDraw(c,a,al){const dx=a.hx-a.sx,dy=a.hy-a.sy,L=Math.hypot(dx,dy)||1,sc=clamp(L/AL,.55,1.55),ang=Math.atan2(dy,dx);
    if(!mPiece(c,ID,"arm",a.sx,a.sy,{ax:3/120,ay:14/53,rot:a.d<0?ang-Math.PI:ang,sc,flip:a.d<0,a:al,sm:true})){c.save();c.globalAlpha=al;c.strokeStyle="#1E3A3A";c.lineWidth=3;c.beginPath();c.moveTo(a.sx,a.sy);c.lineTo((a.sx+a.hx)/2,(a.sy+a.hy)/2+10);c.lineTo(a.hx,a.hy);c.stroke();c.restore()}}
  function spiritDraw(c,s,t,line){const bob=s.rm?0:Math.sin(t/900)*1,y=120+bob;
    if(line!=null&&line<132&&mArtOk(ID)){const o=SPC.getContext("2d");o.setTransform(2,0,0,2,0,0);o.globalCompositeOperation="source-over";o.clearRect(0,0,35,100);o.imageSmoothingEnabled=false;mPiece(o,ID,"spirit",0,0,{ax:0,ay:0});
      const l=line-20+bob;o.globalCompositeOperation="destination-in";const g=o.createLinearGradient(0,l-14,0,l);g.addColorStop(0,"rgba(0,0,0,1)");g.addColorStop(1,"rgba(0,0,0,0)");o.fillStyle=g;o.fillRect(0,0,35,100);o.globalCompositeOperation="source-over";
      c.drawImage(SPC,hs(78.5),hs(20+bob),35,100);return}
    if(!mPiece(c,ID,"spirit",96,y,{ax:.5,ay:1})){c.fillStyle="#122622";c.beginPath();c.ellipse(96,76,16,46,0,0,7);c.fill();c.fillStyle="#2E8A6A";c.beginPath();c.arc(BELLY[0],BELLY[1],8,0,7);c.fill()}}
  function wanderer(c,s,t){mShadow(c,WX,WY,15,.4);if(!mSpr(c,"wanderer_up_0",WX-8,WY-23)){px(c,WX-5,WY-18,10,17,"#2F7470");px(c,WX-4,WY-23,8,6,"#2F7470")}glow(c,WX+5,WY-11,17,"#F5C66A",.5)}
  function mist(c,s,t,k){if(!(k>0))return;const gt=s.rm?0:t/1000;for(let i=0;i<6;i++){const x=((i*53+gt*(5+i*1.6))%230)-20,y=118+i*18;fogBlob(c,x,y,60,16,.2*k,"150,190,180")}}
  function hudBar(c,k){meter(c,10,8,172,4,k,"#D9A93A")}
  /* ---- the round ---- */
  MINI.boss_b3={
    who:"b3",boss:"b3",title:"Open Hands",land:"l3",nofl:true,
    setup:["It fills your hands faster than you can empty them. Keep letting go."],
    how:"Tap a treasure to set it down. For a heavy one, press and hold, slowly and steadily. With keys: ← → to choose, Z to set down, hold Z for a heavy one.",
    win:"Its arms fall open. Fireflies drift up where the treasure was.",
    walk:"You set the last of it down. The mist thins.",
    stages:["Full Hands","Heavy Things","Open"],
    lines:[null,SAY1,SAY2],
    pad:true,ab:true,limit:0,long:false,bloomT:4.5,
    init(s){Object.assign(s,{st:0,stT:0,gt:0,slots:Array(8).fill(null),done:0,spT:.9,sp:1,full:false,ff:[],ffN:0,P:pfx(),grip:-1,hold:0,kh:false,foc:0,kb:false,pdx:0,bag:[],lastH:false,drops:0,hdrops:0,mist:0,fx:[],_bm:0,
      arms:ARMS.map((a,i)=>({i,d:a.d,sx:SH[a.d<0?0:1][0],sy:a.sy,rest:a.rest,fr:i%3!==0,ph:"i",u:0,hT:0,slot:-1,k:0,tx:0,ty:0,hx:a.rest[0],hy:a.rest[1]}))})},
    toStage(s,n){this.init(s);if(n>=1){s.done=n===1?8:17;stageUp(s,n)}},
    step(s,dt,inp){
      inp=inp||{};s.gt+=dt;s.stT+=dt;
      s.full=s.slots.every(v=>!!v);s.sp=s.full?FULL:1;s.mist+=clamp((s.full?1:0)-s.mist,-dt*.7,dt*.7);
      if(!inp.down)s.grip=-1;
      /* setting down: a tap sets a light one down at once; a tap on a heavy one grips it, and it lets go after a slow, steady hold of 1.2 s (faster than 110 units/s empties the ring) */
      for(const tp of inp.taps||[]){if(!tp||!isFinite(tp.x)||!isFinite(tp.y))continue;const i=slotAt(tp.x,tp.y);if(i>=0&&landed(s,i)){if(!s.slots[i].heavy)release(s,i);else{s.grip=i;s.hold=0;s.kb=false}}}
      if(s.grip>=0){const i=s.grip,d=inp.down;
        if(!landed(s,i)||!s.slots[i].heavy||!d||slotAt(d.x,d.y)!==i){s.grip=-1;s.hold=0}
        else{const sp=inp.drag?Math.hypot(inp.drag.dx||0,inp.drag.dy||0)/Math.max(dt,.001):0;
          if(sp>LIM){if(s.hold>.05){const q=slotXY(i);s.fx.push({x:q[0],y:q[1]-8,a:0});sfx("clatter")}s.hold=0}
          else{s.hold+=dt/HOLD;if(s.hold>=1){release(s,i);s.grip=-1;s.hold=0}}}}
      /* keys: left/right (and up/down) choose among the landed ones, Z sets down, hold Z for a heavy one */
      let mv=(inp.rTap?1:0)-(inp.lTap?1:0);const ed=inp.dx!==s.pdx?inp.dx:0;s.pdx=inp.dx;if(ed>0)mv=1;else if(ed<0)mv=-1;
      if(inp.taps&&inp.taps.length)s.kb=false;else if(mv||inp.uTap||inp.dTap||inp.aTap||inp.a)s.kb=true;
      if(mv){for(let n=1;n<=8;n++){const j=(s.foc+mv*n+16)%8;if(landed(s,j)){s.foc=j;s.hold=0;break}}}
      if(inp.uTap||inp.dTap){const r=inp.uTap?0:1;let b=-1,bd=1e9;for(let j=0;j<8;j++)if(landed(s,j)&&(j>3?1:0)===r){const d=Math.abs(slotXY(j)[0]-slotXY(s.foc)[0]);if(d<bd){bd=d;b=j}}if(b>=0){s.foc=b;s.hold=0}}
      if(!landed(s,s.foc)){for(let j=0;j<8;j++)if(landed(s,j)){s.foc=j;break}}
      if(inp.aTap&&landed(s,s.foc)&&!s.slots[s.foc].heavy)release(s,s.foc);
      if(s.grip<0){
        if(inp.a&&landed(s,s.foc)&&s.slots[s.foc].heavy){s.kh=true;s.hold+=dt/HOLD;if(s.hold>=1){release(s,s.foc);s.hold=0;s.kh=false}}
        else{s.kh=false;s.hold=Math.max(0,s.hold-dt*2)}}
      /* the drops: slower while every slot is full (the arms, the timer, the falling); your hands never are */
      s.spT-=dt*s.sp;
      if(s.spT<=0){let n=s.st>=2?2:1,got=0;for(let k=0;k<n;k++)if(startDrop(s))got++;
        if(got)s.spT=s.st===0?rnd(1.8,2.2):s.st===1?rnd(1.5,1.8):rnd(1.2,1.6);else s.spT=0}
      for(const a of s.arms){
        if(a.ph==="r"){a.u+=dt*s.sp/RT;if(a.u>=1){a.u=1;a.ph="h";a.hT=.22;const i=a.slot;a.slot=-1;
          s.slots[i]={k:a.k,heavy:a.k>=2,f:0,x0:a.hx,y0:a.hy,set:0};s.drops++;if(a.k>=2)s.hdrops++}}
        else if(a.ph==="h"){a.hT-=dt*s.sp;if(a.hT<=0)a.ph="b"}
        else if(a.ph==="b"){a.u-=dt*s.sp/BT;if(a.u<=0){a.u=0;a.ph="i"}}
        const sw=s.rm?0:1,ix=a.rest[0]+Math.sin(s.gt*.9+a.i*1.3)*3*sw,iy=a.rest[1]+Math.cos(s.gt*.7+a.i*.9)*2.2*sw,k=a.ph==="i"?0:ease(a.u);
        a.hx=a.ph==="h"||a.ph==="r"||a.ph==="b"?lerp(ix,a.tx||ix,k):ix;a.hy=a.ph!=="i"?lerp(iy,a.ty||iy,k):iy}
      s.slots.forEach((v,i)=>{if(v&&v.f<1){v.f=Math.min(1,v.f+dt*s.sp/(i>3?FALL+.12:FALL));if(v.f>=1)land(s,v,i)}else if(v&&v.set>0)v.set=Math.max(0,v.set-dt*s.sp)});
      for(const f of s.ff){f.a+=dt;if(f.fd)f.fd+=dt/1.5}s.ff=s.ff.filter(f=>f.fd<1);
      for(const f of s.fx)f.a+=dt;s.fx=s.fx.filter(f=>f.a<.5);
      pStep(s.P,dt,s.rm);
      if(s.done>=NEED)return "win"},
    draw(s,c,t){
      if(!mBg(c,ID,0))flatBg(c,s);
      const k=clamp(s.done/NEED,0,1);lanternGlow(c,s,k);grade(c,"#BFE8C8",.07*k,"soft-light");
      spiritDraw(c,s,t);const full=s.mist;
      glow(c,BELLY[0],BELLY[1],13+8*full+(s.rm?0:Math.sin(t/500)*1.2),"rgba(120,255,200,.9)",.2+.4*full);
      for(const a of s.arms)armDraw(c,a,1);
      mist(c,s,t,s.mist);
      s.slots.forEach((v,i)=>{const q=slotXY(i);cradle(c,q[0],q[1],s.kb&&s.foc===i&&landed(s,i),!!(v&&v.heavy),t,s.rm)});
      s.slots.forEach((v,i)=>{if(v)itemDraw(c,s,v,i,t)});
      const hi=s.grip>=0?s.grip:s.kh?s.foc:-1;
      if(hi>=0&&s.slots[hi]&&s.slots[hi].heavy){const q=slotXY(hi);c.save();c.strokeStyle="rgba(255,255,255,.2)";c.lineWidth=2;c.beginPath();c.arc(q[0],q[1]+1,14,0,7);c.stroke();c.restore();ring(c,q[0],q[1]+1,14,s.hold,"#FFF1C8",2)}
      for(const f of s.fx){const q=1-f.a/.5;c.globalAlpha=Math.max(0,q);for(let i=0;i<5;i++)px(c,f.x-8+i*4+(s.rm?0:Math.sin(f.a*20+i)*2),f.y-(s.rm?0:f.a*10),2,2,"#B8B8A8");c.globalAlpha=1}
      wanderer(c,s,t);
      for(const f of s.ff){const e=ease(f.a/1.8),x=f.a<1.8?lerp(f.x0,f.hx,e)+(s.rm?0:Math.sin(f.a*5+f.ph)*(1-e)*6):f.hx+(s.rm?0:Math.sin(t/1700+f.ph)*3),
        y=f.a<1.8?lerp(f.y0,f.hy,e)-Math.sin(Math.PI*e)*10:f.hy+(s.rm?0:Math.cos(t/1300+f.ph)*2.5),al=(1-Math.min(1,f.fd))*(s.rm?.9:.75+.25*Math.sin(t/400+f.ph*3));
        glow(c,x,y,9,"rgba(255,214,110,.9)",.75*al);c.globalAlpha=al;px(c,x-1,y-1,2,2,"#FFF4C4");c.globalAlpha=1}
      pDraw(c,s.P,ID);hudBar(c,k);vignette(c,.12)},
    bloom(s,c,k,t){ /* the arms fall open, the treasures and the fireflies rise over the shrine, the spirit thins into mist from its feet up, the valley brightens (Reduce Motion: k is always 1, a still of the last frame) */
      const rm=s.rm,e=ease(k);
      if(!s._bm){s._bm=1;s.P=pfx();s._bt=t;sfx("open_hands")}
      let db=(t-s._bt)/1000;s._bt=t;if(!(db>0&&db<.1))db=1/60;
      if(!mBg(c,ID,0))flatBg(c,s);
      lanternGlow(c,s,.62+.38*e);grade(c,"#BFE8C8",.07+.12*e,"soft-light");grade(c,"#F6DA8A",.2*e,"soft-light");
      /* the spirit thins into mist from the feet up; the belly glow goes out last */
      const u=rm?1:ease(clamp((k-.18)/.55,0,1));
      if(u<1){const line=132-u*(132-18);spiritDraw(c,s,t,u>0?line:null);
        const bg=1-ease(clamp((k-.5)/.3,0,1));glow(c,BELLY[0],BELLY[1],14+4*(1-bg),"rgba(120,255,200,.9)",.55*bg);
        if(!rm&&u>0&&u<1){for(let i=0;i<2;i++)pAdd(s.P,{k:"glow",x:rnd(80,112),y:line+rnd(-6,10),vx:rnd(-4,4),vy:-rnd(6,16),life:1.5,fin:.3,col:"rgba(150,205,190,.9)",s:8+rnd(0,6),a:.28})}}
      /* the arms swing down and outward, hands open, then fade */
      const ao=rm?1:ease(clamp(k/.3,0,1)),aa=1-(rm?1:ease(clamp((k-.22)/.3,0,1)));
      if(aa>0)for(const a of s.arms){const b={d:a.d,sx:a.sx,sy:a.sy,hx:lerp(a.hx,a.sx+a.d*52,ao),hy:lerp(a.hy,a.sy+44+a.i%3*8,ao)};armDraw(c,b,aa)}
      mist(c,s,t,.5*(1-e));
      for(let i=0;i<8;i++){const q=slotXY(i);cradle(c,q[0],q[1],false,false,t,rm)}
      wanderer(c,s,t);
      /* every remaining treasure and the gathered fireflies rise in a slow swarm and settle in an arch over the shrine */
      const its=[];s.slots.forEach((v,i)=>{if(v){const q=slotXY(i);its.push({x:q[0],y:q[1]-1,v})}});
      const n=s.ff.length+its.length,pts=[];for(const f of s.ff)pts.push({x:f.hx,y:f.hy,i:f.n,ph:f.ph});its.forEach((o,j)=>pts.push({x:o.x,y:o.y,i:60+j,ph:hash(j+70)*6.28,it:o}));
      pts.forEach((p,m)=>{const uu=(m+.5)/Math.max(1,n),an=Math.PI*(1+uu),rr=44+(hash(m*7+3)*8),fx=96+Math.cos(an)*rr*1.3,fy=84+Math.sin(an)*rr*.9+hash(m+4)*6,
        d=rm?1:ease(clamp((k-.12-hash(m+1)*.2)/.55,0,1)),x=lerp(p.x,fx,d)+(rm?0:Math.sin(d*Math.PI*2+p.ph)*10*(1-d)*d*2),y=lerp(p.y,fy,d)-(rm?0:Math.sin(d*Math.PI)*12);
        const tw=rm?.9:.75+.25*Math.sin(t/400+p.ph*3);
        if(p.it&&d<.6){c.globalAlpha=1-d/.6;const sc=p.it.v.heavy?1.7:1.2;mPiece(c,ID,TRN[(p.it.v.k|0)%4],x,y,{ax:.5,ay:.5,sc,sm:true});c.globalAlpha=1}
        glow(c,x,y,9,"rgba(255,214,110,.9)",(p.it?Math.min(1,d*1.6):1)*.75*tw);c.globalAlpha=(p.it?Math.min(1,d*1.6):1)*tw;px(c,x-.5,y-.5,1.5,1.5,"#FFF4C4");c.globalAlpha=1});
      /* the valley brightens: a gentle shaft from above */
      shaft(c,96,0,230,90,0,"rgba(255,240,190,.9)",.2*e);shaft(c,56,0,220,36,.2,"rgba(255,240,190,.9)",.12*e);shaft(c,136,0,220,36,-.2,"rgba(255,240,190,.9)",.12*e);glow(c,96,96,120,"rgba(255,232,170,.9)",.16*e);
      pStep(s.P,db,rm);pDraw(c,s.P,ID);hudBar(c,1);vignette(c,.1)},
    _t:{slotXY,slotAt,landed,put,release,startDrop,HOLD,LIM,FULL,NEED,HOV,perch,ARMS,TRN},   /* tests only */
    auto(s,inp){                       /* set every landed treasure down: tap the light ones, hold the heavy one */
      if(s.grip>=0){const q=slotXY(s.grip);inp.down={x:q[0],y:q[1]}}
      for(let i=0;i<8;i++){if(!landed(s,i)||s.slots[i].heavy)continue;const q=slotXY(i);inp.taps=[{x:q[0],y:q[1]}];inp.tap=inp.taps[0];return}
      if(s.grip<0)for(let i=0;i<8;i++){if(!landed(s,i))continue;const q=slotXY(i);inp.taps=[{x:q[0],y:q[1]}];inp.tap=inp.taps[0];inp.down={x:q[0],y:q[1]};return}}
  };
  /* Phase 36-B: when the game closes the page calls release() to drop what the game cached from its art (held() counts it; the kit checks it is 0 after a close) */
  MINI[ID].release=function(){SPC.width=70};MINI[ID].held=function(){return (()=>{const d=SPC.getContext("2d").getImageData(0,0,70,200).data;for(let i=3;i<d.length;i+=4)if(d[i])return 1;return 0})()};
})();
/* GAME:boss_b3:END */

/* GAME:boss_b4:BEGIN */
/* ---- Phase 35C: The Three Lenses, developed - Level IV's boss round at the Dilemma Engine's foggy junction ----
   Idea check: playing this, you feel the fog clear only when you look through outcomes, duties and care in turn, and a third way appears only after all three; the Engine's two tracks are never the only options.
   That is the ethics-toolkit idea that no single lens sees the whole choice, and a "two tracks" dilemma is seldom the only way.
   Controls (two of Level IV's): tap a lens (Speakers' Corner's and If Everyone Did It's tap), and drag the switch into place (The Web's drag); keys: arrows move a cursor, Z taps or picks up and puts down.
   The little train (train_engine and a train_car, front at the bottom) comes out of the fog down the main line toward the junction [98,178] (30 s from the fog line to its stop at y 170: a calm line at the top, no numbers, no alarm).
   The Engine offers two tracks on its two scale pans (the pans' centres, measured in the painted engine: left [32,138] px, right [173,137] px): the LEFT pan is straight on (a circle, teal), the RIGHT pan the right branch (a triangle, lavender); the same two shapes sit on the
   two tracks just past the junction. Each pan holds who or what waits at that end (small icons drawn in code). Fog (a drifting wash) hides them; a lens thins it and shows what it hid at the pans: gold = outcomes (coins counted out), silver = duties (a scroll with a check, or a broken seal),
   bronze = care (who is there, with a thread between them). Tapping a lens looks through it (it counts as seen after 0.7 s; a seen lens gets a small lit mark below it). The third way appears only after all three are seen (a tap or drag on its spot does nothing before):
   I a warning bell [36,196] (tap), II the signal lamp [118,108] (tap; a light pulse runs down the line), III the switch (start [156,196]; drag it onto the siding spot [88,204] within 18 units, or it slides back; then the engine goes on and the last car rolls onto the siding).
   If the train's 30 s run out it politely stops short of the junction (a soft brake, steam, the lamp blinking), backs into the fog and the scene repeats, the seen lenses kept. Nobody is ever on or near the tracks: people stand only on the pans.
   Never "end". Win: three scenes solved. Bloom: three beams meet in one white point, the Engine's gears grind to a stop, its eyes go dark, the fog clears, dawn rises over the junction. */
(function(){
  const ID="boss_b4";
  const px=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(hs(x),hs(y),w,h)};
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const ease=k=>k<=0?0:k>=1?1:k*k*(3-2*k);
  const dst=(a,b,c,d)=>Math.hypot(a-c,b-d);
  const hash=i=>{let h=(i*374761393+668265263)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967295};
  const AR=()=>MINI_ART[ID]||{},GEO=()=>AR().geo||{};
  const TRK0={main:[[96,320],[96,262],[96,215],[96,175],[96,128]],branch_up_right:[[97,178],[110,162],[127,147],[150,135],[176,128]],branch_down_right:[[103,178],[120,190],[136,208],[146,228],[150,244]],siding:[[93,206],[78,220],[62,234],[46,250]]};
  const tracks=()=>GEO().tracks||TRK0;
  const EF=[92,122],TL=[EF[0]-50.75,EF[1]-100];                                   /* the Engine: feet [92,122], drawn at scale 1 (101.5 x 100 units), so its top-left is TL */
  const PAN=[[32,138],[173,137]].map(p=>[TL[0]+p[0]/2,TL[1]+p[1]/2]);               /* the scale pans' centres, measured in the 203 x 200 px engine piece: [32,138] and [173,137] px -> about [57.3,91] and [127.8,90.5] units */
  const EYE=[TL[0]+50.5,TL[1]+33];                                                  /* the furnace-eye glow's centre, [101,66] px in the engine */
  const LENS=[[52,228],[96,228],[140,228]],BELL=[36,196],LAMP=[118,108],SWSPOT=[88,204],SWST=[156,196],JUNC=[98,178];
  const START=128,STOP=170,TRAVEL=30,SOLVET=[2.4,2.4,3.8],HIT=15,TH=16,DROP=18;
  const LC=["#E9B84A","#CBD3E6","#D18E58"],C1="#7FE3E0",C2="#C9A6FF";
  const L=["The train is late. The Engine says one stop gets its delivery, and the other goes without.","Two promises and one train. The Engine says one promise has to break.","Two groups wait for each other. The Engine says only one can be met."];
  const SOLVE=["The bell rings out. Both stops hear the train coming.","Word goes ahead down the line. The promise will be kept, a little late.","The last car rolls onto the siding. Both groups are met."];
  const SC=[{l:["stall","mill"],r:["clinic","gilligan"],gold:[5,2],duty:[0,1],care:0},{l:["letter","kant"],r:["parcel","aquinas"],gold:[3,3],duty:[1,1],care:1},{l:["hut","gilligan"],r:["hut2","kant"],gold:[4,4],duty:[1,1],care:2}];
  const EY=[1,.78,.52,.28];
  const CARP=[[96,120],[96,196],[93,206],[78,220],[70,226]];
  function plen(P){let d=0;for(let i=1;i<P.length;i++)d+=dst(P[i][0],P[i][1],P[i-1][0],P[i-1][1]);return d}
  function pat(P,d){for(let i=1;i<P.length;i++){const l=dst(P[i][0],P[i][1],P[i-1][0],P[i-1][1]);if(d<=l||i===P.length-1){const u=clamp(d/(l||1),0,1);return [lerp(P[i-1][0],P[i][0],u),lerp(P[i-1][1],P[i][1],u),Math.atan2(P[i][1]-P[i-1][1],P[i][0]-P[i-1][0])]}d-=l}return P[P.length-1].concat(0)}
  const CARL=plen(CARP);
  const fogBlob=(c,x,y,rx,ry,a,col)=>{if(!(a>0))return;c.save();c.translate(x,y);c.scale(1,ry/rx);const g=c.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);c.fillStyle=g;c.fillRect(-rx,-rx,rx*2,rx*2);c.restore()};
  /* ---- people: a map-scale sprite (1 sprite px = 1 unit) with a soft ground shadow and a 1-px dark outline ---- */
  const SIL={};
  function person(c,nm,x,y,fr){const name=nm+"_"+(fr||0),e=ATLAS_IMG.chars,A=ATLAS.chars,r=A&&A.rects[name];c.save();mShadow(c,x,y,13,.4);
    if(e&&e.ok&&r){let cv=SIL[name];if(!cv){cv=SIL[name]=document.createElement("canvas");cv.width=r[2];cv.height=r[3];const q=cv.getContext("2d");q.drawImage(e.img,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);q.globalCompositeOperation="source-in";q.fillStyle="#150E1C";q.fillRect(0,0,r[2],r[3])}
      for(const q of [[-1,0],[1,0],[0,-1],[0,1]])c.drawImage(cv,Math.round(x-8)+q[0],Math.round(y-24)+q[1],r[2],r[3])}
    if(!mSpr(c,name,x-8,y-24)){px(c,x-5,y-18,10,17,"#4A5A7A");px(c,x-3,y-23,6,6,"#D8B090")}c.restore()}
  /* ---- pan icons: who or what waits at each end (drawn in code) ---- */
  function icon(c,k,x,y){x=Math.round(x);y=Math.round(y);
    if(k==="stall"){for(let i=0;i<4;i++)px(c,x-6+i*3,y-10,3,3,i%2?"#F0E6D0":"#C0503A");px(c,x-6,y-7,1,7,"#6A4A2A");px(c,x+5,y-7,1,7,"#6A4A2A");px(c,x-6,y-3,12,3,"#9A7040");px(c,x-3,y-6,3,2,"#D8A860");px(c,x+1,y-6,3,2,"#D8A860")}
    else if(k==="clinic"){px(c,x-6,y-8,12,8,"#E8E0D0");c.fillStyle="#8A5A4A";c.beginPath();c.moveTo(x-8,y-8);c.lineTo(x,y-14);c.lineTo(x+8,y-8);c.fill();px(c,x-1,y-7,2,6,"#4FB070");px(c,x-3,y-5,6,2,"#4FB070")}
    else if(k==="letter"){px(c,x-6,y-8,12,8,"#F0E8D0");c.strokeStyle="#B8A880";c.lineWidth=.8;c.beginPath();c.moveTo(x-6,y-8);c.lineTo(x,y-3);c.lineTo(x+6,y-8);c.stroke();px(c,x-1,y-5,3,3,"#C0503A")}
    else if(k==="parcel"){px(c,x-6,y-8,12,8,"#B08050");px(c,x-1,y-8,2,8,"#E8688A");px(c,x-6,y-5,12,1.5,"#E8688A");px(c,x-3,y-10,3,2,"#E8688A");px(c,x+1,y-10,3,2,"#E8688A")}
    else{px(c,x-6,y-7,12,7,k==="hut"?"#6A7A9A":"#8A6A5A");c.fillStyle=k==="hut"?"#3E7A80":"#9A5A3A";c.beginPath();c.moveTo(x-8,y-7);c.lineTo(x,y-13);c.lineTo(x+8,y-7);c.fill();px(c,x-1.5,y-5,3,3,"#F5C66A")}}
  const heart=(c,x,y,col,sz)=>{const s=sz||1;x=Math.round(x);y=Math.round(y);c.fillStyle="#2A0E1A";c.fillRect(x-3.5*s,y-3*s,7*s,3*s+1);c.fillRect(x-2.5*s,y,5*s,2*s);c.fillStyle=col||"#F0709A";c.fillRect(x-3*s,y-2.5*s,2.5*s,2.5*s);c.fillRect(x+.5*s,y-2.5*s,2.5*s,2.5*s);c.fillRect(x-3*s,y,6*s,1.5*s);c.fillRect(x-2*s,y+1.5*s,4*s,1*s);c.fillRect(x-1*s,y+2.5*s,2*s,1*s)};
  const check=(c,x,y)=>{c.save();c.lineCap="round";c.lineJoin="round";c.strokeStyle="#0E2A18";c.lineWidth=3.4;c.beginPath();c.moveTo(x-3.5,y);c.lineTo(x-1,y+3);c.lineTo(x+4,y-3.5);c.stroke();c.strokeStyle="#7CE08A";c.lineWidth=1.8;c.stroke();c.restore()};
  function scroll(c,x,y,mark){x=Math.round(x);y=Math.round(y);px(c,x-5,y-6,11,12,"#2A1E12");px(c,x-4,y-5,9,10,"#EFE3C4");px(c,x-5,y-6,11,2,"#C8B07A");px(c,x-5,y+4,11,2,"#C8B07A");px(c,x-3,y-2,6,1,"#A89868");px(c,x-3,y+1,5,1,"#A89868");
    if(mark)check(c,x+1,y);else{c.fillStyle="#2A0E10";c.beginPath();c.arc(x+1,y+1,4.2,0,7);c.fill();c.fillStyle="#C0403A";c.beginPath();c.arc(x-.4,y+.8,2.8,Math.PI*.55,Math.PI*1.65);c.fill();c.beginPath();c.arc(x+2.4,y+1.4,2.6,Math.PI*1.6,Math.PI*2.65);c.fill();c.strokeStyle="#2A0E10";c.lineWidth=1;c.beginPath();c.moveTo(x+1,y-3);c.lineTo(x-.2,y);c.lineTo(x+2.2,y+1.6);c.lineTo(x+1,y+5);c.stroke()}}
  function coins(c,x,y,n){for(let i=0;i<n;i++){const cx=x-5+(i%3)*5,cy=y-Math.floor(i/3)*4.4;c.fillStyle="#3A2606";c.beginPath();c.arc(cx,cy,3,0,7);c.fill();c.fillStyle="#F2C440";c.beginPath();c.arc(cx,cy,2.2,0,7);c.fill();c.fillStyle="#FFE9A0";c.fillRect(cx-1,cy-1.4,1.2,1.2)}}
  /* a thread of hearts (or coins, or scroll marks) arching between the two pans: scene III's reveals connect both sides */
  function link(c,li,t,rm){const a=[PAN[0][0]+8,PAN[0][1]+13],b=[PAN[1][0]-8,PAN[1][1]+13],n=9;c.save();c.strokeStyle="rgba(12,6,20,.85)";c.lineWidth=3;c.beginPath();c.moveTo(a[0],a[1]);c.quadraticCurveTo(96,a[1]+26,b[0],b[1]);c.stroke();c.strokeStyle=LC[li];c.lineWidth=1.4;c.stroke();c.restore();
    for(let i=1;i<n;i++){const u=i/n,x=(1-u)*(1-u)*a[0]+2*(1-u)*u*96+u*u*b[0],y=(1-u)*(1-u)*a[1]+2*(1-u)*u*(a[1]+26)+u*u*b[1];
      if(li===0){c.fillStyle="#F2C440";c.beginPath();c.arc(x,y,1.7,0,7);c.fill()}else if(li===2){if(i%2)heart(c,x,y-1,"#F0709A",.7)}else if(i%2){c.fillStyle="#CBD3E6";c.fillRect(Math.round(x-1.5),Math.round(y-1.5),3,3)}}}
  /* ---- looks ---- */
  function flatBg(c,s){const g=c.createLinearGradient(0,0,0,246);g.addColorStop(0,"#1A2236");g.addColorStop(1,"#0E1220");c.fillStyle=g;c.fillRect(0,0,192,246);px(c,0,246,192,74,"#080A10");
    c.strokeStyle="#7A5A38";c.lineWidth=2;for(const k in tracks()){if(k==="branch_up_right")continue;c.beginPath();tracks()[k].forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke()}
    px(c,126,88,3,88,"#2A2630");for(const q of [[56,172],[68,138],[154,150],[118,108]])glow(c,q[0],q[1],7,"#F5C66A",.5)}
  function gear(c,x,y,r,ang,al){c.save();c.translate(x,y);c.rotate(ang);c.globalAlpha=al;const n=Math.max(8,Math.round(r*.85));
    c.fillStyle="rgba(150,105,30,.55)";c.beginPath();c.arc(0,0,r*.76,0,7);c.fill();c.strokeStyle="#E2B24E";c.lineWidth=Math.max(1,r*.14);c.beginPath();c.arc(0,0,r*.74,0,7);c.stroke();
    for(let i=0;i<n;i++){c.save();c.rotate(i*Math.PI*2/n);c.fillStyle="#E2B24E";c.fillRect(r*.7,-r*.1,r*.3,r*.2);c.restore()}
    c.strokeStyle="#5A3A12";c.lineWidth=Math.max(1,r*.12);for(let i=0;i<3;i++){c.save();c.rotate(i*Math.PI/3);c.beginPath();c.moveTo(-r*.7,0);c.lineTo(r*.7,0);c.stroke();c.restore()}
    c.fillStyle="#4A3010";c.beginPath();c.arc(0,0,r*.22,0,7);c.fill();c.fillStyle="#E2B24E";c.beginPath();c.arc(0,0,r*.1,0,7);c.fill();c.restore()}
  const GEARS=[[101,110,17,1],[123,129,6.5,-1],[56,120,6.5,-1],[64,36,8,-1]];
  function engine(c,s,t,gr,eyes,al){
    if(!mPiece(c,ID,"engine",EF[0],EF[1],{ax:.5,ay:1,a:al})){c.save();c.globalAlpha=al==null?1:al;px(c,60,40,64,76,"#6A4A22");px(c,64,26,56,22,"#A87A32");for(const p of PAN){c.fillStyle="#8A6420";c.beginPath();c.ellipse(p[0],p[1],15,5,0,0,7);c.fill()}px(c,74,52,12,8,"#201810");px(c,98,52,12,8,"#201810");c.restore()}
    for(const g of GEARS)gear(c,TL[0]+g[0]/2,TL[1]+g[1]/2,g[2],gr*g[3]+g[0]*.1,.9*(al==null?1:al));
    if(eyes>0&&!mPiece(c,ID,"engine_eyes",EYE[0],EYE[1],{ax:.5,ay:.5,a:eyes*(s.rm?.9:.85+.15*Math.sin(t/260))})){c.globalAlpha=eyes;px(c,EYE[0]-14,EYE[1]-3,8,6,"#F2872A");px(c,EYE[0]+7,EYE[1]-3,8,6,"#F2872A");c.globalAlpha=1}
    if(eyes>0)for(const dx of [-12,12])glow(c,EYE[0]+dx,EYE[1],9,"#FF6A20",.3*eyes)}
  /* the little train: engine and car, front at the bottom; it fades in below the fog line */
  function trainDraw(c,s,t){
    let fe,xe=96,car=null;
    if(!s.solved){fe=s.tp;car=[96,fe-34.5,0]}
    else{const sv=s.sv,u=ease(sv);
      if(s.st<2){fe=lerp(s.tp0,STOP,u);car=[96,fe-34.5,0]}
      else{const d0=s.tp0-34.5-120,dd=lerp(d0,CARL-6,u),p=pat(CARP,dd),p2=pat(CARP,dd+3);car=[p[0],p[1],Math.atan2(-(p2[0]-p[0]),p2[1]-p[1])];const own=lerp(s.tp0,246,ease(clamp(sv/.9,0,1)));fe=Math.max(own,p[1]<196?p[1]+34.5:0)}}
    const ye=fe-12,ae=clamp((ye-108)/20,0,1),ac=clamp((car[1]-108)/20,0,1);
    const bl=s.mode==="stop"&&!s.rm?(Math.floor(t/380)%2?.35:1):1;
    if(!mPiece(c,ID,"train_car",car[0],car[1],{ax:.5,ay:.5,rot:car[2],a:ac,sm:true})){c.globalAlpha=ac;px(c,car[0]-4,car[1]-8,9,16,"#6A4A30");c.globalAlpha=1}
    if(!mPiece(c,ID,"train_engine",xe,ye,{ax:.5,ay:.5,a:ae,sm:true})){c.globalAlpha=ae;px(c,xe-4,ye-12,9,24,"#3A3A48");px(c,xe-3,ye+8,7,4,"#B8862A");c.globalAlpha=1}
    glow(c,xe,fe+3,11,"#FFE9A8",.75*bl);
    if(!s.rm&&s.mode!=="back"&&(s.st<2||!s.solved)&&s.pf<=0){s.pf=.5;pAdd(s.P,{k:"glow",x:xe+1,y:ye-4,vx:rnd(-5,0),vy:-rnd(5,10),life:1.5,fin:.2,col:"rgba(215,220,235,.9)",s:3+rnd(0,2),a:.26*ae})}
    else if(s.rm&&ae>.5)glow(c,xe,ye-9,5,"rgba(215,220,235,.9)",.2*ae)}
  function fog(c,s,t){const f=s.fog,gt=s.rm?0:t/1000,a=f,F="168,180,208";
    for(const p of PAN){fogBlob(c,p[0],p[1]-2,42,30,.95*a,F);fogBlob(c,p[0],p[1]-2,30,22,.5*a,F)}
    for(let i=0;i<7;i++){const x=((i*47+gt*(4+i))%260)-34,y=62+i*13;fogBlob(c,x,y,52,12,.3*a,F)}
    fogBlob(c,96,150+Math.sin(gt*.4)*3,100,26,.5*a,F);fogBlob(c,70,176,60,18,.34*a,F);fogBlob(c,126,172,60,18,.34*a,F)}
  const SHAPE={c1:(c,x,y,r,col)=>{c.save();c.lineWidth=2.4;c.strokeStyle="#0C0814";c.beginPath();c.arc(x,y,r,0,7);c.stroke();c.strokeStyle=col;c.lineWidth=1.3;c.stroke();c.restore()},
    c2:(c,x,y,r,col)=>{c.save();c.lineJoin="round";c.lineWidth=2.6;c.strokeStyle="#0C0814";c.beginPath();c.moveTo(x,y-r);c.lineTo(x+r*.95,y+r*.7);c.lineTo(x-r*.95,y+r*.7);c.closePath();c.stroke();c.strokeStyle=col;c.lineWidth=1.3;c.stroke();c.restore()}};
  function marks(c,s,t,pans){ /* the two choices: a circle for straight on, a triangle for the right branch, on the pans and on the tracks just past the junction */
    const p=s.rm?1:.8+.2*Math.sin(t/500);
    for(const q of (pans?[[PAN[0][0],PAN[0][1]+5.5,"c1",C1],[PAN[1][0],PAN[1][1]+5.5,"c2",C2]]:[[96,191,"c1",C1],[122,191,"c2",C2]])){glow(c,q[0],q[1],9,q[3],.28*p);SHAPE[q[2]](c,q[0],q[1],4.2,q[3])}}
  function lens(c,s,i,t){const q=LENS[i],on=s.act===i,nm=["lens_gold","lens_silver","lens_bronze"][i];
    if(on)glow(c,q[0],q[1],26,LC[i],s.rm?.65:.55+.2*Math.sin(t/240));
    if(!mPiece(c,ID,nm,q[0],q[1],{ax:.5,ay:.5,sm:true})){c.fillStyle="#100B15";c.beginPath();c.arc(q[0],q[1],10,0,7);c.fill();c.fillStyle=LC[i];c.beginPath();c.arc(q[0],q[1],8.5,0,7);c.fill();c.fillStyle="#B8B0E0";c.beginPath();c.arc(q[0],q[1],6,0,7);c.fill()}
    const x=q[0],y=q[1]+16,seen=s.seen[i];c.save();c.translate(x,y);
    c.lineWidth=2.4;c.strokeStyle="#0C0814";c.fillStyle=seen?LC[i]:"rgba(30,24,44,.7)";
    if(i===0){c.rotate(Math.PI/4);c.beginPath();c.rect(-2.8,-2.8,5.6,5.6);c.stroke();c.fill()}
    else if(i===1){c.beginPath();c.rect(-3.2,-3.2,6.4,6.4);c.stroke();c.fill()}
    else{c.beginPath();c.moveTo(0,3.6);c.lineTo(-4,-.4);c.lineTo(-2.2,-3);c.lineTo(0,-1.4);c.lineTo(2.2,-3);c.lineTo(4,-.4);c.closePath();c.stroke();c.fill()}
    if(!seen){c.strokeStyle="rgba(230,224,250,.35)";c.lineWidth=.8;c.stroke()}c.restore();if(seen)glow(c,x,y,8,LC[i],.4)}
  /* what a lens reveals, at the pans (scene k) */
  function reveal(c,s,i,t){const k=s.st,D=SC[k];
    for(let j=0;j<2;j++){const p=PAN[j];
      if(i<2){c.save();c.translate(p[0],p[1]-(i?25:17));c.scale(1.3,1.3);if(i===0)coins(c,0,0,D.gold[j]);else scroll(c,0,0,D.duty[j]);c.restore()}
      else{person(c,D[j?"r":"l"][1],p[0],p[1]+1,s.rm?0:Math.floor(t/900)%2);heart(c,p[0],p[1]-30,"#F0709A",1);
        if(D.care===1){const hx=p[0]+(j?32:-32),hy=p[1]-2;c.save();c.strokeStyle="#F0709A";c.lineWidth=1;c.setLineDash([2,2]);c.beginPath();c.moveTo(p[0]+(j?8:-8),p[1]-11);c.lineTo(hx,hy-4);c.stroke();c.restore();icon(c,"hut",hx,hy+4);heart(c,hx,hy-14,"#F0709A",.8)}}}
    if(k===2)link(c,i,t,s.rm)}
  function third(c,s,t){const p=s.rm?.7:.55+.35*Math.sin(t/220);
    if(s.st===0){const sw=s.rm?0:Math.sin(t/180)*.12;glow(c,BELL[0],BELL[1],16+3*p,"#F5C66A",.5*p);if(!mPiece(c,ID,"bell",BELL[0],BELL[1],{ax:.5,ay:.5,rot:sw,sc:1.15,sm:true})){c.fillStyle="#D9A93A";c.beginPath();c.arc(BELL[0],BELL[1],6,Math.PI,0);c.fillRect(BELL[0]-6,BELL[1],12,3);c.fill()}}
    else if(s.st===1){glow(c,LAMP[0],LAMP[1],18+3*p,"#FFE9A0",.65*p+(s.solved?.4:0));if(!mPiece(c,ID,"signal_lamp",LAMP[0],LAMP[1],{ax:.5,ay:.5,sc:1.1,sm:true})){c.fillStyle="#F5C66A";c.fillRect(LAMP[0]-3,LAMP[1]-4,6,8)}}
    else{const sl=s.sl,x=sl?lerp(sl.x,SWST[0],ease(1-sl.t/.35)):s.ox,y=sl?lerp(sl.y,SWST[1],ease(1-sl.t/.35)):s.oy,near=!!s.hold&&dst(s.ox,s.oy,SWSPOT[0],SWSPOT[1])<=DROP;
      c.save();c.strokeStyle=near?"#9BE08A":"rgba(255,232,160,1)";c.lineWidth=1.8;c.setLineDash([2.5,2.5]);c.lineDashOffset=s.rm?0:-t/90;c.beginPath();c.arc(SWSPOT[0],SWSPOT[1],11,0,7);c.stroke();c.restore();glow(c,SWSPOT[0],SWSPOT[1],16,near?"#9BE08A":"#F5C66A",(near?.5:.28)*p+.1);
      glow(c,x,y,15,"#F5C66A",s.hold?.4:.4*p);if(!mPiece(c,ID,"switch",s.solved?SWSPOT[0]:x,s.solved?SWSPOT[1]:y,{ax:.5,ay:.5,sc:1.35,sm:true})){c.fillStyle="#6A6A7A";c.fillRect(x-5,y-3,10,6);c.fillStyle="#C0503A";c.fillRect(x-1,y-9,3,7)}}}
  /* the finishing touches while a scene is being solved */
  function solvedFx(c,s,t){const sv=s.sv,k=s.st;
    for(const p of PAN){const g=Math.sin(Math.min(1,sv*1.6)*Math.PI/2)*(s.rm?1:.88+.12*Math.sin(t/300));glow(c,p[0],p[1]-4,30,"#C4F59A",.7*g);glow(c,p[0],p[1]+2,16,"#FFF0B0",.35*g)}
    if(k===0){for(let i=0;i<3;i++){const u=clamp(sv*1.4-i*.18,0,1);if(u>0&&u<1)ring(c,BELL[0],BELL[1],6+u*34,1,`rgba(255,226,150,${.6*(1-u)})`,1.2)}
      for(const p of PAN){const u=ease(clamp(sv*1.5-.1,0,1));if(u>0&&u<1)glow(c,lerp(BELL[0],p[0],u),lerp(BELL[1],p[1]+4,u)-Math.sin(u*Math.PI)*14,7,"#FFE9A0",.8)}}
    else if(k===1){const P1=[[LAMP[0],LAMP[1]],[112,140],[JUNC[0],JUNC[1]-4]],P2=[[96,180],[96,246]],P3=[[JUNC[0]+4,JUNC[1]]].concat(tracks().branch_down_right.slice(1)),u=sv*2.2;
      [[P1,u],[P2,u-1],[P3,u-1]].forEach(([P,v])=>{if(v<=0)return;const L1=plen(P),d=Math.min(1,v)*L1;
        c.save();c.strokeStyle="rgba(255,236,170,.55)";c.lineWidth=1.6;c.beginPath();for(let q=0;q<=d;q+=3){const pp=pat(P,q);q?c.lineTo(pp[0],pp[1]):c.moveTo(pp[0],pp[1])}c.stroke();c.restore();
        for(let q=0;q<5;q++){const pp=pat(P,Math.max(0,d-q*5));glow(c,pp[0],pp[1],10-q*1.4,"#FFF0B0",.9-q*.15)}})}
  }
  /* ---- the round ---- */
  function resetScene(s,i){Object.assign(s,{st:i,seen:[false,false,false],act:-1,actT:0,solved:false,ok:0,sv:0,tt:0,mode:"run",modeT:0,tp:START,tp0:START,hold:null,ox:SWST[0],oy:SWST[1],sl:null,fxT:0,pf:0})}
  function solve(s){s.solved=true;s.ok=SOLVET[s.st];s.sv=0;s.tp0=s.tp;s.hold=null;s.act=-1;sfx(["bell","signal","click"][s.st]);if(MS&&MS.s===s)miniSay(SOLVE[s.st],0)}
  function drop(s){if(dst(s.ox,s.oy,SWSPOT[0],SWSPOT[1])<=DROP){s.ox=SWSPOT[0];s.oy=SWSPOT[1];solve(s)}else{s.sl={x:s.ox,y:s.oy,t:.35};s.ox=SWST[0];s.oy=SWST[1];sfx("nope")}s.hold=null}
  MINI.boss_b4={
    who:"b4",boss:"b4",title:"The Three Lenses",land:"l4",nofl:true,
    setup:["The Engine offers two tracks and calls it a choice. Look through every lens first."],
    how:"Tap each lens to look through it. Then a third way appears: tap it, or drag it into place. With keys: arrows to move, Z to tap or to pick up and put down.",
    win:"Three lenses, one clear view. The Engine’s gears grind and slow.",
    walk:"You look again, and a third way appears.",
    stages:["The Late Delivery","The Broken Promise","Waiting for Each Other"],
    lines:L,
    pad:true,ab:true,limit:0,long:false,bloomT:4.5,
    init(s){Object.assign(s,{stT:0,gt:0,done:0,fog:.85,cx:96,cy:150,kb:false,P:pfx(),_bm:0,_said:0,eyes:1,gr:0});resetScene(s,0)},
    toStage(s,n){this.init(s);if(n>=1){s.done=n;stageUp(s,n);resetScene(s,n);s.eyes=EY[n]}},
    step(s,dt,inp){
      inp=inp||{};s.gt+=dt;s.stT+=dt;s.pf-=dt;s.gr+=dt*(s.rm?.3:1.2);
      if(!s._said){s._said=1;if(s.st===0&&MS&&MS.s===s)miniSay(L[0],1500)}
      s.fog+=((s.act>=0?.16:s.solved?.3:.82+.04*s.st)-s.fog)*Math.min(1,dt*(s.rm?2:4));
      const eT=EY[Math.min(3,s.done+(s.solved?1:0))];s.eyes+=clamp(eT-s.eyes,-dt*.5,dt*.5);
      if(s.act>=0){s.actT+=dt;if(s.actT>=.7&&!s.seen[s.act]){s.seen[s.act]=true;sfx("lens")}}
      if(s.sl){s.sl.t-=dt;if(s.sl.t<=0)s.sl=null}
      pStep(s.P,dt,s.rm);
      if(s.solved){s.ok-=dt;s.sv=clamp(1-s.ok/SOLVET[s.st],0,1);s.fxT+=dt;
        if(s.ok<=0){s.done++;if(s.done>=3)return "win";stageUp(s);resetScene(s,s.st)}
        return}
      /* the train: 30 s from the fog line to its stop; if the time runs out it politely stops short of the junction, then backs into the fog and the scene repeats (the lenses already seen stay seen) */
      if(s.mode==="run"){s.tt+=dt;s.tp=START+(STOP-START)*clamp(s.tt/TRAVEL,0,1);if(s.tt>=TRAVEL){s.mode="stop";s.modeT=0;sfx("stop");s.pf=0}}
      else if(s.mode==="stop"){s.modeT+=dt;if(s.modeT>=2.4){s.mode="back";s.modeT=0}}
      else{s.modeT+=dt;s.tp=Math.max(START,s.tp-24*dt);if(s.tp<=START){s.mode="run";s.tt=0;s.tp=START}}
      /* taps: a lens, then (only once all three are seen) the third way */
      const mvx=inp.dx||0,mvy=inp.dy||0;if(mvx||mvy||inp.aTap)s.kb=true;s.cx=clamp(s.cx+mvx*90*dt,6,186);s.cy=clamp(s.cy+mvy*90*dt,20,236);
      const all=s.seen.every(Boolean),pts=(inp.taps||[]).slice();if(inp.aTap)pts.push({x:s.cx,y:s.cy,k:1});
      for(const p of pts){if(!p||!isFinite(p.x)||!isFinite(p.y))continue;
        const li=LENS.findIndex(q=>dst(p.x,p.y,q[0],q[1])<=HIT);
        if(li>=0){if(s.act===li)s.act=-1;else{s.act=li;s.actT=s.seen[li]?1:0}sfx("lens");continue}
        if(!all||s.solved)continue;
        if(s.st===0){if(dst(p.x,p.y,BELL[0],BELL[1])<=TH)solve(s)}
        else if(s.st===1){if(dst(p.x,p.y,LAMP[0],LAMP[1])<=TH)solve(s)}
        else if(!s.hold){if(dst(p.x,p.y,s.ox,s.oy)<=TH){s.hold={m:p.k?"k":"p"};s.sl=null;sfx("drag")}}
        else if(s.hold.m==="k"&&p.k)drop(s)}
      if(s.hold&&!s.solved){if(s.hold.m==="p"){if(inp.down){s.ox=inp.down.x;s.oy=inp.down.y}else drop(s)}else{s.ox=s.cx;s.oy=s.cy}}},
    draw(s,c,t){
      if(!mBg(c,ID,0))flatBg(c,s);
      for(const q of [[56,172],[68,138],[154,150]])glow(c,q[0],q[1],9,"#FFD890",.18);
      marks(c,s,t,false);
      engine(c,s,t,s.gr,s.eyes);
      if(!s.rm&&s.pf<=0){s.pf=.6;for(const q of [[111,25],[75,26]])pAdd(s.P,{k:"glow",x:q[0],y:q[1],vx:rnd(-3,4),vy:-rnd(8,14),life:1.9,fin:.3,col:"rgba(210,215,232,.9)",s:4+rnd(0,3),a:.22})}
      const D=SC[s.st];if(s.act!==2){icon(c,D.l[0],PAN[0][0],PAN[0][1]-2);icon(c,D.r[0],PAN[1][0],PAN[1][1]-2)}
      fog(c,s,t);trainDraw(c,s,t);
      if(s.act>=0){glow(c,PAN[0][0],PAN[0][1]-8,26,LC[s.act],.22);glow(c,PAN[1][0],PAN[1][1]-8,26,LC[s.act],.22);reveal(c,s,s.act,t)}
      marks(c,s,t,true);
      if(s.solved)solvedFx(c,s,t);
      pDraw(c,s.P,ID);
      if(s.seen.every(Boolean)&&(!s.solved||s.st>=1))third(c,s,t);
      for(let i=0;i<3;i++)lens(c,s,i,t);
      /* the train's approach: a thin calm line at the top (no numbers) */
      c.fillStyle="rgba(210,225,245,.2)";c.fillRect(10,9,172,1.5);c.fillStyle="rgba(150,205,240,.85)";c.fillRect(10,9,172*clamp(s.solved?1:s.tt/TRAVEL,0,1),1.5);glow(c,10+172*clamp(s.solved?1:s.tt/TRAVEL,0,1),9.7,4,"#BFE4FF",.5);
      if(s.kb){c.strokeStyle="rgba(8,5,14,.8)";c.lineWidth=2.6;for(const w of [[1,"#FFF1C8"]]){c.beginPath();c.moveTo(s.cx-5,s.cy);c.lineTo(s.cx+5,s.cy);c.moveTo(s.cx,s.cy-5);c.lineTo(s.cx,s.cy+5);c.stroke();c.strokeStyle=w[1];c.lineWidth=1}c.beginPath();c.moveTo(s.cx-5,s.cy);c.lineTo(s.cx+5,s.cy);c.moveTo(s.cx,s.cy-5);c.lineTo(s.cx,s.cy+5);c.stroke()}
      vignette(c,.12)},
    bloom(s,c,k,t){ /* three beams meet in one white point, the gears grind to a stop, the eyes go dark, the fog clears, dawn rises over the junction (Reduce Motion: k is always 1, a still of the last frame) */
      const rm=s.rm,e=ease(k);
      if(!s._bm){s._bm=1;s.P=pfx();s._bt=t;sfx("grind")}
      let db=(t-s._bt)/1000;s._bt=t;if(!(db>0&&db<.1))db=1/60;
      if(!mBg(c,ID,0))flatBg(c,s);
      const day=ease(clamp((k-.35)/.6,0,1)),plum=rm?0:Math.sin(Math.PI*clamp((k-.25)/.5,0,1))*.34;
      const gl=1-ease(clamp((k-.4)/.45,0,1));for(const q of [[56,172],[68,138],[154,150],[118,108]])glow(c,q[0],q[1],9,"#FFD890",.2*gl);
      /* the train at rest: the engine has rolled on down the main line (its lamp still glows below the lenses), the last car stands on the siding */
      trainDraw(c,Object.assign({},s,{solved:true,st:2,sv:1,tp0:168,mode:"run",pf:9}),t);
      /* the gears slow with small jerks and stop; the eyes go dark; the steam stops */
      const a0=s.gr,ang=a0+(rm?0:3.4*(k-k*k*.7)+Math.sin(k*38)*.1*(1-k)*(k<.75?1:0));
      engine(c,s,t,ang,rm?0:Math.max(0,s.eyes*(1-ease(clamp((k-.1)/.5,0,1)))));
      if(!rm&&k<.3)for(const q of [[111,25],[75,26]])if(Math.random()<.03)pAdd(s.P,{k:"glow",x:q[0],y:q[1],vx:rnd(-3,4),vy:-rnd(8,14),life:1.9,fin:.3,col:"rgba(210,215,232,.9)",s:4+rnd(0,3),a:.22*(1-k/.3)});
      const D=SC[2];icon(c,D.l[0],PAN[0][0],PAN[0][1]-1);icon(c,D.r[0],PAN[1][0],PAN[1][1]-1);
      /* the fog lifts away */
      const lift=rm?1:ease(clamp((k-.3)/.45,0,1));if(lift<1){fog(c,{fog:.7*(1-lift),rm:true},0)}
      for(const p of PAN)glow(c,p[0],p[1],26,"#BFEFA0",.28+.2*e);
      person(c,SC[2].l[1],PAN[0][0],PAN[0][1]+1,0);person(c,SC[2].r[1],PAN[1][0],PAN[1][1]+1,0);
      /* dawn: plum, then gold, from the horizon */
      grade(c,"#7A3A70",plum*.55,"soft-light");grade(c,"#F6C070",.34*day,"soft-light");
      c.save();c.globalCompositeOperation="lighter";const dg=c.createLinearGradient(0,40,0,250);dg.addColorStop(0,`rgba(120,60,110,${.18*day})`);dg.addColorStop(.5,`rgba(255,196,120,${.3*day})`);dg.addColorStop(1,"rgba(255,226,160,0)");c.fillStyle=dg;c.fillRect(0,0,192,250);c.restore();
      {const fl=c.createLinearGradient(0,196,0,262);fl.addColorStop(0,"rgba(8,6,14,0)");fl.addColorStop(1,"rgba(8,6,14,"+(.6*day)+")");c.fillStyle=fl;c.fillRect(0,196,192,124)}   /* the dawn fades out toward the dark ground, so it has no hard edge */
      fogBlob(c,96,130,140,40,.5*day,"255,206,140");for(let j=-3;j<=3;j++)shaft(c,96,126,170,24,Math.PI+j*.2,"rgba(255,224,160,.9)",.09*day);
      /* the three beams rise from the lenses and meet in one white point at the Engine's chest */
      const W=[TL[0]+50.5,TL[1]+55],bu=rm?1:ease(clamp(k/.4,0,1)),wh=rm?1:ease(clamp((k-.28)/.3,0,1)),hold=rm?.45:1-.55*ease(clamp((k-.7)/.3,0,1));
      for(let i=0;i<3;i++){const x1=LENS[i][0],y1=LENS[i][1]-8,x2=lerp(x1,W[0],bu),y2=lerp(y1,W[1],bu);
        c.save();c.globalCompositeOperation="lighter";c.lineCap="round";c.strokeStyle=LC[i];c.globalAlpha=.3*hold;c.lineWidth=7;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();c.globalAlpha=.8*hold;c.lineWidth=2.2;c.stroke();c.globalAlpha=.45*hold;c.strokeStyle="#FFFFFF";c.lineWidth=.7;c.stroke();c.restore();glow(c,x2,y2,10,LC[i],.6*hold)}
      if(wh>0){glow(c,W[0],W[1],18+22*wh,"#FFFFFF",.85*wh*hold+.15*wh);glow(c,W[0],W[1],40+20*wh,"rgba(255,230,160,.9)",.3*wh);c.save();c.translate(W[0],W[1]);c.fillStyle="#FFFFFF";c.globalAlpha=wh;c.fillRect(-1.6,-1.6,3.2,3.2);c.fillStyle="#FFF4D0";for(let j=0;j<4;j++){c.save();c.rotate(j*Math.PI/4+(rm?0:t/5000));c.fillRect(-1,-(j%2?8:14)*wh,2,(j%2?16:28)*wh);c.restore()}c.restore()}
      for(let i=0;i<3;i++){c.save();c.globalAlpha=1;lens(c,Object.assign({},s,{act:i,seen:[true,true,true],rm:true}),i,0);c.restore()}
      pStep(s.P,db,rm);pDraw(c,s.P,ID);vignette(c,.1)},
    _t:{TRAVEL,START,STOP,JUNC,LENS,BELL,LAMP,SWSPOT,SWST,PAN,EYE,SOLVET,SOLVE,HIT,TH,DROP,tracks,resetScene,SC},   /* tests only */
    auto(s,inp){
      if(s.solved)return;
      if(!s.seen.every(Boolean)){const i=s.seen.findIndex(v=>!v);if(s.act!==i){inp.taps=[{x:LENS[i][0],y:LENS[i][1]}];inp.tap=inp.taps[0]}return}
      if(s.st===0){inp.taps=[{x:BELL[0],y:BELL[1]}];inp.tap=inp.taps[0];return}
      if(s.st===1){inp.taps=[{x:LAMP[0],y:LAMP[1]}];inp.tap=inp.taps[0];return}
      if(!s.hold){inp.taps=[{x:s.ox,y:s.oy}];inp.tap=inp.taps[0];inp.down={x:s.ox,y:s.oy};return}
      const dx=SWSPOT[0]-s.ox,dy=SWSPOT[1]-s.oy,d=Math.hypot(dx,dy);
      if(d<4){inp.down=null;return}
      inp.down={x:s.ox+dx/d*Math.min(6,d),y:s.oy+dy/d*Math.min(6,d)}}
  };
  /* Phase 36-B: when the game closes the page calls release() to drop what the game cached from its art (held() counts it; the kit checks it is 0 after a close) */
  MINI[ID].release=function(){for(const k in SIL)delete SIL[k]};MINI[ID].held=function(){return Object.keys(SIL).length};
})();
/* GAME:boss_b4:END */
MINI_LOADED.boss=true;
