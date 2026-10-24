/* The Examined Life: Level III mini-games (the Misty Valleys). Loaded after the page's main script (Phase 29). */
/* MINI_ART:BEGIN (written by tools/l3_mini_art.py: asset ids, atlas rects, map-scale people, the vina rig and lamps, water geometry) */
MINI_ART.lute={"atlas":"e2dc6831e20731f68f6dbaeab1a0d902","rects":{"vina":[1,1,300,107],"bell":[302,1,24,32],"peg1":[327,1,19,20],"lamp_off":[347,1,12,20],"lamp_on":[360,1,12,20],"peg2":[373,1,18,19],"peg0":[392,1,16,18],"bird_0":[409,1,11,16],"bird_1":[421,1,12,9],"petal_1":[434,1,8,7],"petal_2":[443,1,8,7],"petal_0":[452,1,8,5]},"prects":{},"bg":["8f3bf244f9b50fac9b280b680c486fab"],"plate":"397639c91f6d8531150b0442d757405a","vina":{"size":[300,107],"rotated_deg_clockwise":73.2,"pegs":{"peg0":{"at":[245,16],"size":[16,18],"pivot":[10.2,18.6]},"peg1":{"at":[224,15],"size":[19,20],"pivot":[11.2,19.6]},"peg2":{"at":[201,16],"size":[18,19],"pivot":[10.7,18.9]}},"strings":[[[227.3,35.3],[44.4,31.1]],[[227.3,40.3],[44.4,40.3]],[[227.3,45.3],[44.4,49.5]]]},"lamps":[[17,235,"painted"],[177,218,"painted"],[100,222,"draw"],[83,201,"painted"],[152,199,"painted"]]};
MINI_ART.water={"atlas":"a02d207eb503b25c7041b7a1b0f698ca","rects":{"boulder":[1,1,72,66],"buffalo_0":[74,1,85,48],"buffalo_1":[160,1,97,48],"soil":[258,1,36,36],"stone":[295,1,36,36],"bedrock":[332,1,36,36],"clay_0":[369,1,36,36],"clay_1":[406,1,36,36],"clay_2":[443,1,36,36],"terrace_0":[480,1,36,36],"terrace_1":[517,1,36,36],"terrace_2":[554,1,36,36],"terrace_3":[591,1,36,36],"spring":[628,1,36,36],"sprout":[665,1,12,16],"seed":[678,1,11,14]},"prects":{},"bg":["7b32751393c64247dfb63cf39f9d3e05"],"plate":"0fac414b32e6cdf29335edb531396649","geo":{"tile_px":36,"spring":[102,73],"slope":[30,88,150,250],"buffalo":[164,240]}};
MINI_ART.kitchen={"atlas":"25c8b09ec227cc20540c6d3387dcaf9e","people":"622bb58c2af93acf0ab3ed3c5a2ee930","rects":{"drying_tray":[1,1,96,67],"rice_bowl":[98,1,69,64],"board":[168,1,40,56],"tray":[209,1,128,56],"greens":[338,1,38,40],"knife":[377,1,8,40],"ladle":[386,1,40,40],"sieve":[427,1,56,38],"dish_rice":[484,1,28,24],"dish_soup":[513,1,27,24],"dish_tea":[541,1,18,24],"dish_pickles":[560,1,28,21],"dish_greens":[589,1,28,21],"mush_fresh":[618,1,20,19],"mush_dried":[639,1,15,13]},"prects":{"tenzo_0":[1,1,20,24],"tenzo_1":[22,1,18,24],"dogen_bow":[41,1,16,24],"dogen_0":[58,1,16,24]},"bg":["162d664c222963abf76c12c02d8f18e7","53cb83542b755e64f3fd73b622b57bf2","eb2b3c5667b7793e11227b72dc09aeab"],"plate":"abeb9d774688a04d63f10d21f5d741b2"};
MINI_ART.butterfly={"atlas":"f8356844259294e6985a3cd23a7dc062","rects":{"tree":[1,1,108,120],"bridge_2":[110,1,51,37],"bridge_0":[162,1,48,36],"bridge_1":[211,1,50,36],"gust_0":[262,1,28,32],"gust_1":[291,1,36,28],"lilypads":[328,1,48,27],"lever_up":[377,1,20,24],"lever_down":[398,1,20,24],"fish_1":[419,1,11,15],"bfly_closed":[431,1,9,12],"bfly_open":[441,1,16,11],"fish_0":[458,1,16,8]},"prects":{},"bg":[],"plate":"2367ec19af957e654095e882a250b16e"};
/* MINI_ART:END */
/* GAME:lute:BEGIN */
/* ---- Phase 33B: Tune the Lute, developed — the Buddha's "A Carved Wheel" ----
   Idea check: playing this, you feel that forcing the peg overshoots and slackening lets the note sag, so only gentle, steady effort settles it.
   That is the Buddha's advice to Soṇa: effort, like a vīṇā string, should be neither too tight nor too loose.
   Source: Aṅguttara Nikāya 6.55 (Soṇa and the lute). The instrument is a vīṇā.
   Stages: I · One String (only the middle string is live) → II · Three Strings (all three, out of tune; tightening one pulls on the others) →
   III · The Answer (the strings stay tuned; a bird sings a phrase of 5 notes and a lamp kindles along the river for each right note you answer).
   Layout: the vīṇā lies across the middle (x 21-171, y 122-176); three sound lanes above it (y 40-117), one per string, are that string's tap target.
   State: s.T[k] tension 0-100, s.c[k] the hidden clean-note centre (the zone is c +- ZH), s.set[k] set, s.hold[k] seconds in tune, s.sel the string under the peg,
   s.m the peg's momentum (tension per second; it keeps turning after you let go), s.amp[k]/s.age[k] the last pluck, s.outT seconds far from the note (Stages I-II),
   s.phrase (5 strings), s.ph wait|sing|answer|again|done, s.prog right notes so far, s.tries wrong notes (each restarts the phrase), s.lamp[k] 0..1 (the river lamps).
   Peg: a drag (or held up/down) moves the tension; the gain grows with speed (1 + speed/GK), and the peg carries momentum (decay D), so a fast flick sails past the note.
   Controls: drag up/down (or hold up/down, which speeds up the longer you hold) to turn; tap a lane (or A, with left/right to choose) to pluck. */
(function(){
  const ID="lute";
  const AR=()=>MINI_ART[ID]||{};
  const VX=21,VY=122,VW=150;                              /* the vina, at native detail */
  const LX=24,LW=138,LT=[40,66,92],LHT=25;                /* the three sound lanes */
  const ZH=4,HOLD=2,K=.3;                                 /* clean zone half-width, seconds in tune to set a string, how much one string pulls on the others */
  const G0=.5,GK=150,GMAX=6,FOLLOW=14,D=10,DRIFT=.4;      /* peg: tension per unit of drag at rest, speed that doubles it, max gain, how quickly momentum follows the finger, momentum decay per second, slow slackening */
  const KS0=18,KS1=70,KRAMP=1.4;                          /* a held up/down key turns like a finger moving KS0 units/s, rising to KS1 over KRAMP seconds */
  const NT=.72,PH=5;                                      /* seconds between the bird's notes; notes in the phrase */
  const px=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(hs(x),hs(y),w,h)};
  const LAMPS=()=>AR().lamps||[[17,235,"painted"],[177,218,"painted"],[100,222,"draw"],[83,201,"painted"],[152,199,"painted"]];
  const VIN=()=>AR().vina||{pegs:{peg0:{at:[245,16],size:[16,18],pivot:[10.2,18.6]},peg1:{at:[224,15],size:[19,20],pivot:[11.2,19.6]},peg2:{at:[201,16],size:[18,19],pivot:[10.7,18.9]}},
    strings:[[[227.3,35.3],[44.4,31.1]],[[227.3,40.3],[44.4,40.3]],[[227.3,45.3],[44.4,49.5]]]};
  const STR=k=>VIN().strings[k].map(p=>[VX+p[0]/2,VY+p[1]/2]);
  const pegAt=k=>{const g=VIN().pegs["peg"+k];return {x:VX+(g.at[0]+g.pivot[0])/2,y:VY+(g.at[1]+g.pivot[1])/2,ax:g.pivot[0]/g.size[0],ay:g.pivot[1]/g.size[1]}};
  const pitch=T=>-9+T*.24;                                /* semitones from A4: a tighter string sings higher */
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const gain=sp=>Math.min(GMAX,1+Math.max(0,sp)/GK);
  const live=(s,k)=>s.st===0?k===1:true;
  const far=(s,k)=>Math.abs(s.T[k]-s.c[k])>ZH+12;
  const inTune=(s,k)=>Math.abs(s.T[k]-s.c[k])<=ZH;
  const laneOf=y=>{const k=Math.floor((y-LT[0])/(LT[1]-LT[0]));return y>=LT[0]&&y<LT[2]+LHT&&k>=0&&k<3?k:-1};
  /* ---- the rules ---- */
  function centres(){let c;do{c=[rnd(25,75),rnd(25,75),rnd(25,75)]}while(Math.abs(c[0]-c[1])<15||Math.abs(c[0]-c[2])<15||Math.abs(c[1]-c[2])<15);return c}
  function outOfTune(c){const side=Math.random()<.5?1:-1;let d=rnd(18,42),t=c+side*d;if(t<4||t>96){d=rnd(18,34);t=c-side*d}return Math.max(2,Math.min(98,t))}
  function setupStage(s,n){s.m=0;s.kh=0;s.adv=0;s.hint=n===0?9:0;
    if(n===0){s.sel=1;s.T=[50,outOfTune(s.c[1]),50]}
    else if(n===1){s.sel=0;s.T=s.c.map(outOfTune)}
    else{s.sel=1;s.T=s.c.slice();s.set=[true,true,true];s.hold=[ZH,ZH,ZH].map(()=>HOLD);s.phrase=genPhrase();s.ph="wait";s.pt=0;s.prog=0;s.lamp=[0,0,0,0,0];s.birdOpen=0}
    if(n<2){s.set=[false,false,false];s.hold=[0,0,0]}}
  function genPhrase(){const a=[0,1,2];for(let i=2;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
    const p=a.slice();while(p.length<PH){const k=Math.floor(Math.random()*3);if(!(p.length>=2&&p[p.length-1]===k&&p[p.length-2]===k))p.push(k)}
    for(let i=p.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[p[i],p[j]]=[p[j],p[i]]}
    for(let i=2;i<p.length;i++)if(p[i]===p[i-1]&&p[i]===p[i-2])p[i]=(p[i]+1)%3;return p}
  function pluck(s,k,mute){const T=s.T[k],sour=Math.min(1,Math.max(0,(Math.abs(T-s.c[k])-ZH)/24));s.amp[k]=mute?.5:1;s.age[k]=0;
    if(mute)sfx("pluck_muted",pitch(T));else sfx("pluck",pitch(T),sour)}
  function pulse(s,k){s.pulse[k]=1}
  function noteFx(s,k){const x=176,y=76;pulse(s,k);
    for(let i=0;i<2;i++)s.notes.push({x:x-2+Math.random()*4,y:y-6,vx:-4-Math.random()*8,vy:-9-Math.random()*5,t:0,life:1.8,k,ph:Math.random()*9})}
  function selectK(s,k){if(s.st===0||k===s.sel)return;s.sel=k;s.m=0;s.kh=0}
  function answer(s,k){ /* Stage III: one pluck against the phrase */
    if(s.ph!=="answer"){pluck(s,k,false);return}
    if(s.phrase[s.prog]===k){pluck(s,k,false);s.lamp[s.prog]=Math.max(s.lamp[s.prog],.01);sfx("kindle");s.kin=s.prog;s.prog++;
      if(s.prog>=PH){s.ph="done";s.pt=0}}
    else{pluck(s,k,true);s.tries++;s.ph="again";s.pt=0;s.prog=0}}
  function replayNow(s){s.ph="sing";s.pt=0;s.prog=0;s.nk=0}
  function replay(s){if(s.st===2&&s.ph!=="sing"&&s.ph!=="done")replayNow(s)}
  /* ---- drawing ---- */
  const SIL={};
  function outlined(c,name,x,y){const e=ATLAS_IMG.chars,A=ATLAS.chars;if(!e||!e.ok||!A||!A.rects[name])return mSpr(c,name,x,y);
    const r=A.rects[name];let cv=SIL[name];if(!cv){cv=SIL[name]=document.createElement("canvas");cv.width=r[2];cv.height=r[3];const q=cv.getContext("2d");q.drawImage(e.img,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);q.globalCompositeOperation="source-in";q.fillStyle="#150E1C";q.fillRect(0,0,r[2],r[3])}
    c.save();c.globalAlpha=.9;for(const o of [[-1,0],[1,0],[0,-1],[0,1]])c.drawImage(cv,x+o[0],y+o[1]);c.restore();return mSpr(c,name,x,y)}
  function fallbackBg(c){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#26354A");g.addColorStop(.5,"#8A9A94");g.addColorStop(1,"#1C3038");c.fillStyle=g;c.fillRect(0,0,192,320);
    c.fillStyle="#2A3A2A";c.fillRect(0,0,70,100);c.fillStyle="#5A5C54";c.fillRect(24,186,50,28);c.fillStyle="#2E4A52";c.fillRect(0,224,192,96)}
  function drawBg(c){if(!mBg(c,ID,0))fallbackBg(c)}
  function lampDraw(c,s,k,t){const L=LAMPS()[k],b=s.lamp?s.lamp[k]:0,x=L[0],y=L[1];
    if(L[2]==="draw"){if(!mPiece(c,ID,b>.3?"lamp_on":"lamp_off",x,y+6,{ax:.5,ay:1,sc:2})){px(c,x-5,y-14,10,20,"#6A6A70")}}
    if(b>0){const fl=s.rm?1:.9+.1*Math.sin(t/170+k*2);glow(c,x,y,32+8*b,"rgba(255,176,80,.95)",.85*b*fl);glow(c,x,y,7,"rgba(255,236,170,1)",.7*b);px(c,x-1,y-1.5,2,3,"rgba(255,226,150,"+Math.min(1,b*1.3)+")")}}
  const COL=["#F5C66A","#F2A5B8","#8FE0D0"];
  function laneDraw(c,s,k,t){const x=LX,y=LT[k],w=LW,h=LHT,mid=y+h/2,on=live(s,k),sel=k===s.sel,done=s.set[k]&&s.st<2,pu=s.pulse[k],tune=inTune(s,k);
    c.save();c.globalAlpha=on?1:.55;
    c.fillStyle=done?"rgba(52,36,10,.78)":"rgba(10,8,24,.74)";c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,4);else c.rect(x,y,w,h);c.fill();
    if(pu>0){c.fillStyle="rgba(255,230,160,"+(.3*pu)+")";c.fill()}
    c.strokeStyle=done||s.st===2?"rgba(245,198,106,.9)":sel&&on?"rgba(255,236,180,.95)":"rgba(150,140,190,.45)";c.lineWidth=sel&&on?1.4:.8;c.stroke();
    // the lotus mark: k+1 dots, and a ring that fills while the string is held in tune
    for(let i=0;i<=k;i++){c.fillStyle=done?"#F5C66A":on?"#CFC6E8":"#6A6480";c.beginPath();c.arc(x+7+i*4.2,y+5.2,1.35,0,7);c.fill()}
    if(s.st<2&&on){const hk=s.hold[k]/HOLD;if(done)ring(c,x+9,mid+4,5.2,1,"#F5C66A",1.3);else if(hk>0)ring(c,x+9,mid+4,5.2,hk,"#FFE9A8",1.3);else ring(c,x+9,mid+4,5.2,1,"rgba(150,140,190,.35)",.6)}
    // the wave
    const a=Math.pow(Math.max(0,1-s.age[k]/2),1.2),A=9.5*a,x0=x+18,w0=w-24;
    if(A<.25||!on){c.strokeStyle="rgba(120,112,150,.55)";c.lineWidth=1;c.beginPath();c.moveTo(x0,mid);c.lineTo(x0+w0,mid);c.stroke()}
    else{const d=s.T[k]-s.c[k],dev=Math.max(0,Math.abs(d)-ZH),q=Math.min(1,dev/14),loose=d<0,ph=s.rm?k:s.age[k]*(tune||s.st===2?9:loose?5:34)+k;
      const cyc=tune||s.st===2?3:loose?2.2:3+6*q,col=tune||s.st===2?"#F5C66A":loose?"#8EA6C4":"#F0963C";
      c.strokeStyle=col;c.lineWidth=tune||s.st===2?1.5:1.1;c.beginPath();const n=Math.round(w0/1.5);
      for(let i=0;i<=n;i++){const u=i/n,env=Math.sin(Math.PI*u);let yy=mid+Math.sin(u*cyc*6.283+ph)*A*env*(loose?.6:1);
        if(!tune&&s.st<2){if(loose){yy+=env*(1.5+3.5*q)*(.5+.5*a)+((Math.sin(i*12.9898+(s.rm?0:Math.floor(t/70))*3.1)*43758.5453)%1)*(1.5+3*q)*env*a}
          else yy+=Math.sin(i*2.7+ph*3)*(.4+1.1*q)*env*a}
        i?c.lineTo(x0+u*w0,yy):c.moveTo(x0,yy)}c.stroke()}
    if(done||s.st===2)glow(c,x+w/2,mid,60,"rgba(255,210,110,.9)",.12+.08*(s.rm?0:Math.sin(t/400+k)));
    c.restore()}
  function vinaDraw(c,s,t){
    const art=mPiece(c,ID,"vina",VX,VY);
    if(!art){c.fillStyle="#D8C4A0";c.beginPath();c.ellipse(VX+30,VY+27,30,25,0,0,7);c.fill();c.fillStyle="#7A4A2A";c.fillRect(VX+48,VY+24,95,10);c.fillRect(VX+138,VY+22,10,18);
      c.strokeStyle="#EADBB8";c.lineWidth=.6;for(let k=0;k<3;k++){const S=STR(k);c.beginPath();c.moveTo(S[0][0],S[0][1]);c.lineTo(S[1][0],S[1][1]);c.stroke()}}
    for(let k=0;k<3;k++){const S=STR(k),a=Math.pow(Math.max(0,1-s.age[k]/2),1.2);
      if(a>.05){const sh=s.rm?0:Math.sin(t/38+k*2)*a;c.strokeStyle="rgba(255,238,196,.75)";c.lineWidth=.7;c.beginPath();const n=24;
        for(let i=0;i<=n;i++){const u=i/n,xx=lerp(S[1][0],S[0][0],u),yy=lerp(S[1][1],S[0][1],u)+Math.sin(u*Math.PI)*(s.rm?.5*a:sh);i?c.lineTo(xx,yy):c.moveTo(xx,yy)}c.stroke()}
      const g=s.glw[k];if(g>.02){glow(c,(S[0][0]+S[1][0])/2,(S[0][1]+S[1][1])/2,52,"rgba(255,206,110,.9)",.24*g);c.strokeStyle="rgba(255,226,150,"+(.55*g)+")";c.lineWidth=.8;c.beginPath();c.moveTo(S[1][0],S[1][1]);c.lineTo(S[0][0],S[0][1]);c.stroke()}}
    for(let k=0;k<3;k++){const p=pegAt(k),ang=s.T[k]*.045+(k===s.sel&&!s.rm?clamp(s.m*.004,-.3,.3):0);
      if(!mPiece(c,ID,"peg"+k,p.x,p.y,{ax:p.ax,ay:p.ay,rot:ang,sm:true})){c.save();c.translate(p.x,p.y);c.rotate(ang);c.fillStyle="#6A4430";c.fillRect(-3,-9,6,9);c.restore()}
      if(k===s.sel&&s.st<2)glow(c,p.x,p.y-4,9,"rgba(255,226,150,.9)",.5)}}
  function birdDraw(c,s,t){if(s.st<2)return;const x=176,y=84,open=s.birdOpen>0;
    c.fillStyle="#3A2A1A";c.fillRect(x-9,y,17,1.5);
    if(!mPiece(c,ID,open?"bird_0":"bird_1",x,y,{ax:.5,ay:1,sc:2.5})){c.fillStyle="#B8864A";c.beginPath();c.ellipse(x,y-5,5,4,0,0,7);c.fill()}
    if(s.ph==="answer"&&s.prog===0&&!s.rm)glow(c,x,y-6,10,"rgba(255,226,150,.9)",.18+.1*Math.sin(t/300))}
  function notesDraw(c,s){for(const n of s.notes){const a=1-n.t/n.life;if(a<=0)continue;c.save();c.globalAlpha=Math.min(1,a*1.4);c.fillStyle=COL[n.k];c.strokeStyle=COL[n.k];c.lineWidth=.8;
      c.beginPath();if(n.k===1){c.moveTo(n.x-2,n.y);c.lineTo(n.x,n.y-1.5);c.lineTo(n.x+2,n.y);c.lineTo(n.x,n.y+1.5);c.closePath()}else if(n.k===2)c.rect(n.x-1.5,n.y-1.5,3,3);else c.arc(n.x,n.y,1.7,0,7);c.fill();
      c.beginPath();c.moveTo(n.x+1.6,n.y);c.lineTo(n.x+1.6,n.y-5);c.stroke();c.restore()}}
  function buddhaDraw(c,s,t){mShadow(c,50,213,22,.4);const f="buddha_"+(s.rm?0:Math.floor(t/900)%2);if(!outlined(c,f,42,190)){px(c,42,190,16,24,"#E8862E")}}
  /* an on-canvas hint: 9-unit text on a dark rounded pill, wrapped to two lines, below the Buddha's lamps and clear of the lanes and the vina (bottom edge at y 250) */
  function pill(c,txt,cx_,bottom,maxw,a){c.save();c.font='9px "IM Fell English SC",Georgia,serif';const words=txt.split(" "),ls=[];let cur="";
    for(const w of words){const n=cur?cur+" "+w:w;if(cur&&c.measureText(n).width>maxw){ls.push(cur);cur=w}else cur=n}ls.push(cur);
    const w=Math.max(...ls.map(l=>c.measureText(l).width))+12,h=ls.length*10+4,x=cx_-w/2,y=bottom-h;c.restore();
    c.save();c.globalAlpha=a==null?1:a;c.fillStyle="rgba(14,10,24,.8)";c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,5);else c.rect(x,y,w,h);c.fill();c.strokeStyle="rgba(245,198,106,.4)";c.lineWidth=.8;c.stroke();
    ls.forEach((l,i)=>mText(c,l,cx_,y+2+10*i+5,9,"#FFE9B8"));c.restore()}
  function hud(c,s,t){if(s.st===0&&s.hint>0)pill(c,"Drag up or down to turn the peg",144,250,84,Math.min(1,s.hint/1.5));
    else if(s.st===2&&s.ph==="answer"&&s.prog===0&&s.tries===0)pill(c,"Pluck what you heard",144,250,84)}
  MINI.lute={
    who:"buddha",title:"Tune the Lute",land:"l3",
    setup:["Before I woke up, I tried living too loose, and then too tight. Neither worked.","Tune this string, and you’ll hear what I learned."],
    how:"Turn the peg gently. Pluck to listen. Forcing it only overshoots.",
    win:"Not too tight, not too loose. The whole path, in one note.",
    walk:"Keep the wheel. It turns slowly, the way practice does.",
    stages:["One String","Three Strings","The Answer"],
    lines:[null,"Each string pulls on the others. Tune the whole instrument.","Listen. The valley is singing. Answer it."],
    pad:true,ab:true,limit:0,long:false,bloomT:3.4,
    fl:["Tune all 3 strings","Spend under 18 seconds far from the note","Spend under 6 seconds far from the note, and answer the bird the first time"],
    flNext:["Next time, try turning the peg straight toward the note instead of overshooting.","Next time, try never wandering far from any note, and answer the bird’s phrase on the first try."],
    rate:s=>s.outT<6&&s.tries===0?3:s.outT<18?2:1,
    init(s){const c=centres();Object.assign(s,{st:0,stT:0,c,T:[50,50,50],set:[false,false,false],hold:[0,0,0],sel:1,m:0,kh:0,adv:0,hint:9,amp:[0,0,0],age:[9,9,9],pulse:[0,0,0],glw:[0,0,0],outT:0,tries:0,
        phrase:[],ph:"",pt:0,prog:0,nk:0,kin:-1,lamp:[0,0,0,0,0],birdOpen:0,notes:[],pdx:0,P:pfx(),dt:.05,sp:0,kd:0,kl:0});setupStage(s,0)},
    toStage(s,n){this.init(s);if(n>=1){s.st=n;stageUp(s,n);setupStage(s,n)}},
    step(s,dt,inp){
      s.dt=dt;s.stT+=dt;s.hint=Math.max(0,s.hint-dt);
      // ---- taps: a lane plucks its string (and picks it); the bird replays the phrase; a peg picks its string
      for(const tp of inp.taps||[]){const k=laneOf(tp.y);
        if(k>=0&&tp.x>=LX-4&&tp.x<=LX+LW+4){if(live(s,k)){selectK(s,k);if(s.st===2)answer(s,k);else pluck(s,k,false)}}
        else if(s.st===2&&Math.hypot(tp.x-176,tp.y-78)<=14)replay(s);
        else if(s.st<2)for(let j=0;j<3;j++){const p=pegAt(j);if(live(s,j)&&Math.hypot(tp.x-p.x,tp.y-p.y)<=10)selectK(s,j)}}
      // ---- keys and pad: left/right choose, A plucks the chosen string
      const dx=inp.dx||0,mv=inp.lTap?-1:inp.rTap?1:(dx!==0&&s.pdx===0?Math.sign(dx):0);s.pdx=dx;
      if(mv&&s.st>0)selectK(s,(s.sel+mv+3)%3);
      if(inp.aTap&&live(s,s.sel)){if(s.st===2)answer(s,s.sel);else pluck(s,s.sel,false)}
      // ---- the peg: a drag or a held key moves the tension; faster means more tension per unit, and the peg keeps turning when you let go
      let dIn=0;const T0=s.T[s.sel];
      if(inp.drag&&typeof inp.drag.dy==="number")dIn+=-inp.drag.dy;
      const dyk=inp.dy||0;
      if(dyk&&!dIn){s.kd=-Math.sign(dyk);s.kh=s.kd===s.kl?s.kh+dt:0;s.kl=s.kd;dIn=s.kd*(KS0+(KS1-KS0)*Math.min(1,s.kh/KRAMP))*dt}else{s.kh=0;s.kl=0}
      s.sp+=(Math.abs(dIn)/dt-s.sp)*Math.min(1,dt*12);
      if(s.st===2){s.m=0}
      else if(dIn!==0){const cmd=G0*gain(s.sp)*dIn/dt;s.m+=(cmd-s.m)*Math.min(1,dt*FOLLOW)}
      else{s.m*=Math.exp(-D*dt);if(Math.abs(s.m)<.05)s.m=0}
      if(s.m!==0){const k=s.sel,T=s.T[k],nT=clamp(T+s.m*dt,0,100),d=nT-T;s.T[k]=nT;if(nT!==T+s.m*dt)s.m=0;
        if(s.st===1&&d!==0)for(let j=0;j<3;j++)if(j!==k)s.T[j]=clamp(s.T[j]-K*d,0,100)}
      // ---- the slow slackening: a string you aren't turning loses a little tension (set strings hold)
      if(s.st<2)for(let k=0;k<3;k++)if(live(s,k)&&!s.set[k]&&!(k===s.sel&&(dIn!==0||Math.abs(s.m)>.5)))s.T[k]=Math.max(0,s.T[k]-DRIFT*dt);
      // ---- far from the note: the string under the peg, not yet set
      if(s.st<2&&live(s,s.sel)&&!s.set[s.sel]&&far(s,s.sel))s.outT+=dt;
      // ---- in tune for 2 seconds sets a string; coupling that knocks a set string out of tune un-sets it
      if(s.st<2)for(let k=0;k<3;k++){if(!live(s,k))continue;
        if(inTune(s,k)){if(!s.set[k]){s.hold[k]+=dt;if(s.hold[k]>=HOLD){s.set[k]=true;s.hold[k]=HOLD;sfx("chime");pulse(s,k);s.age[k]=Math.min(s.age[k],.4)}}}
        else{s.hold[k]=0;s.set[k]=false}}
      for(let k=0;k<3;k++){s.age[k]+=dt;s.pulse[k]=Math.max(0,s.pulse[k]-dt*(s.rm?1.2:1.6));s.glw[k]+=((s.set[k]?1:0)-s.glw[k])*Math.min(1,dt*3)}
      // ---- Stages I and II end when the strings are set (II: all three at once)
      if(s.st<2){const done=s.st===0?s.set[1]:s.set[0]&&s.set[1]&&s.set[2];s.adv=done?s.adv+dt:0;if(s.adv>=.9){stageUp(s);setupStage(s,s.st)}}
      // ---- Stage III: the bird sings, you answer
      else{s.pt+=dt;s.birdOpen=Math.max(0,s.birdOpen-dt);
        if(s.ph==="wait"&&s.pt>=1.4)replayNow(s);
        else if(s.ph==="sing"){const i=s.nk;if(i<PH&&s.pt>=i*NT){const k=s.phrase[i];sfx("bird_phrase",pitch(s.c[k])+12);noteFx(s,k);s.birdOpen=.4;s.nk++}
          if(s.nk>=PH&&s.pt>=PH*NT+.5){s.ph="answer";s.pt=0}}
        else if(s.ph==="again"){for(let i=0;i<5;i++)s.lamp[i]=Math.max(0,s.lamp[i]-dt*.5);if(s.pt>=1.3)replayNow(s)}
        else if(s.ph==="done"&&s.pt>=1.2)return "win";
        for(let i=0;i<5;i++)if(i<s.prog)s.lamp[i]=Math.min(1,s.lamp[i]+dt*1.5);
        if(s.ph==="sing"||s.ph==="wait")for(let i=0;i<5;i++)s.lamp[i]=Math.max(0,s.lamp[i]-dt*.6)}
      for(const n of s.notes){n.t+=dt;n.x+=n.vx*dt+(s.rm?0:Math.sin(n.t*4+n.ph)*.15);n.y+=n.vy*dt}s.notes=s.notes.filter(n=>n.t<n.life);
      pStep(s.P,dt,s.rm)},
    draw(s,c,t){drawBg(c);grade(c,"rgba(14,10,34,1)",.16);
      for(let k=0;k<5;k++)lampDraw(c,s,k,t);
      buddhaDraw(c,s,t);vinaDraw(c,s,t);for(let k=0;k<3;k++)laneDraw(c,s,k,t);
      birdDraw(c,s,t);notesDraw(c,s);pDraw(c,s.P,ID);vignette(c,.22);hud(c,s,t)},
    bloom(s,c,k,t){ /* one clear note rings out and ripples across the valley in golden rings; lotus petals drift; the river lamps glow in a line. More lanterns, more light. */
      const fl=s._fl||1;if(!s._bm){s._bm=1;s.P=pfx();s._bp=0}
      drawBg(c);grade(c,"rgba(255,200,130,1)",(.08+.04*fl)*clamp(k/.6,0,1),"soft-light");
      const L=LAMPS();for(let i=0;i<5;i++){const a=s.rm?1:E.out(clamp((k-.12*i)/.4,0,1)),x=L[i][0],y=L[i][1];if(L[i][2]==="draw")mPiece(c,ID,"lamp_on",x,y+6,{ax:.5,ay:1,sc:2,a:a});
        glow(c,x,y,26+4*fl,"rgba(255,176,80,.95)",.55*a);glow(c,x,y,7,"rgba(255,236,170,1)",.7*a)}
      const nr=2+fl;for(let i=0;i<nr;i++){const u=s.rm?.55+i*.12:((k*1.1-i*.2)%1+1)%1;if(u<=0||u>=1)continue;const r=6+u*120;
        c.save();c.globalAlpha=(1-u)*.7*clamp(k/.15,0,1);c.strokeStyle="#FFE2A0";c.lineWidth=1.3-u;c.beginPath();c.ellipse(100,236,r,r*.24,0,0,7);c.stroke();c.restore()}
      glow(c,100,236,40,"rgba(255,226,150,.95)",(.28+.08*fl)*clamp(k/.3,0,1)*(s.rm?1:.85+.15*Math.sin(t/260)));
      const want=Math.floor((5+3*fl)*clamp((k-.1)/.4,0,1));
      if(!s.rm){while(s._bp<want){s._bp++;pAdd(s.P,{k:"piece",name:"petal_"+(s._bp%3),x:rnd(20,180),y:rnd(-10,60),vx:rnd(-3,3),vy:rnd(7,13),life:rnd(6,9),fin:.8,wob:1.4,ph:rnd(0,9),r:rnd(0,6),vr:rnd(-.4,.4),sc:1.6})}pStep(s.P,1/60,false)}
      else if(!s.P.list.length)for(let i=0;i<6+fl*2;i++)pAdd(s.P,{k:"piece",name:"petal_"+(i%3),x:rnd(20,180),y:rnd(40,200),vx:0,vy:0,life:99,fade:false,r:rnd(0,6),sc:1.6});
      pDraw(c,s.P,ID);vignette(c,.22)},
    _t:{ZH,HOLD,K,G0,GK,D,DRIFT,NT,PH,gain,pitch,setupStage,genPhrase,laneOf,LT,LX,LW,LHT,pluck,pegAt,centres,inTune,far},   /* tests only */
    shotReady:s=>s.st<2?s.amp[s.sel]>.35&&!s.set[s.sel]:s.ph==="answer"||(s.ph==="sing"&&s.nk>=2),   /* tests only */
    auto(s,inp){ /* tests only: a patient player. Turns toward the note and lets go early so the momentum carries it in; plucks to listen. */
      const dt=s.dt||.05;
      if(s.st===2){if(s.ph==="answer"&&!(s._at>0)){const k=s.phrase[s.prog];inp.taps=[{x:90,y:LT[k]+12}];inp.tap=inp.taps[0];s._at=.45}s._at=Math.max(0,(s._at||0)-dt);return}
      let k=s.sel;if(s.st===1&&s.set[k]){let b=-1,e=-1;for(let j=0;j<3;j++){const d=Math.abs(s.T[j]-s.c[j]);if(!s.set[j]&&d>e){e=d;b=j}}
        if(b>=0){if(s.m===0){inp.taps=[{x:90,y:LT[b]+12}];inp.tap=inp.taps[0]}return}return}
      const pr=s.T[k]+s.m/D,err=s.c[k]-pr;
      if(Math.abs(err)>1.6)inp.dy=err>0?-1:1;
      s._pk=(s._pk||0)-dt;if(s._pk<=0&&Math.abs(s.T[k]-s.c[k])<14){inp.aTap=true;s._pk=1}}
  };
  /* Phase 36-B: when the game closes the page calls release() to drop what the game cached from its art (held() counts it; the kit checks it is 0 after a close) */
  MINI[ID].release=function(){for(const k in SIL)delete SIL[k]};MINI[ID].held=function(){return Object.keys(SIL).length};
})();
/* GAME:lute:END */

/* GAME:water:BEGIN */
/* ---- Phase 33B: Be Water, developed — Laozi's "A River Stone, Worn Smooth" ----
   Idea check: playing this, you feel that forcing the bedrock gets you nowhere, while one small opening and a little patience let the water find its own way.
   That is Laozi's idea that the soft and yielding overcomes the hard.
   Stages: I · The Terraces (the stream goes around a bedrock shelf, a loose stone gates the next terrace, a clay plug wears through while you wait) →
   II · Carried (a seed floats on the water; one field is bare earth that greens only when the seed takes root; you can't carry the seed, only open the way) →
   III · The Gorge (a great boulder dams the gorge; the water pools behind it, rises level by level to the side channel you opened, and flows around).
   The grid: 7 columns x 9 rows of 18-unit cells, origin (39,64): the spring cell (column 3, row 0) sits on the painted pool at (102,73), the whole grid on the open slope above y 226.
   Tiles: . soil (open) · o loose stone (tap to lift: becomes soil) · # bedrock (a tap only clanks, and nothing moves) · c soft clay (wears away by itself after 4 s of water resting against it)
   · T dry terrace (a goal) · B bare field (Stage II: greens only when the seed roots) · X boulder (2 x 2, solid) · S the spring.
   The water (every .4 s of sim time): a wet cell wets the open cell below it. It wets its open left and right neighbours only if it is SUPPORTED: standing on solid ground or a terrace (a floor layer: it
   spills over lips), or standing on a pool row that is already full (wet from wall to wall, resting on solid ground or on a full row below it: a stacked layer). So pools rise level by level, a falling
   stream stays a thin stream, and the bottom row drains (it never spreads, and nothing stacks on it). Water never moves up. Terraces and the bare field count as level ground.
   The seed (Stage II): each tick, if the water advances out of the seed's cell (down first, then sideways: toward a side that drops further, else the way it was heading), it rides into the new cell; else it rests.
   Resting on the bare field, it roots.
   State: s.grid[y][x], s.wet, s.ct (seconds of water against each clay cell), s.C (full pool rows), s.seed {x,y,root,dir}, s.simT/s.acc (sim clock), s.sp (sim speed, up to 2.5 while B is held),
   s.bedrockTaps (all three stages), s.tg (terrace growth 0..1), s.adv (a beat after a stage is watered). Controls: tap a stone to lift it; the pad moves a cursor and A acts; hold B (or press and hold the spring) to wait. */
(function(){
  const ID="water";
  const AR=()=>MINI_ART[ID]||{};
  const COLS=7,ROWS=9,CS=18,GX=39,GY=64;
  const TICK=.4,CLAYT=4,SPMAX=2.5,SPK=2.2,REACH=13;
  const GRN=1.5;                                           /* seconds for a terrace to go from dry to lush */
  const px=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(hs(x),hs(y),w,h)};
  const PZ=[
    ["...S...",   /* I: the stream goes around the shelf, the stone gates the second terrace, the clay the third */
     ".######",
     "T......",
     "####o##",
     ".......",
     ".....T.",
     "#c#####",
     ".T.....",
     "......."],
    ["###S###",   /* II: a clay under the spring (time to open the way first), a landing, two stones: the one right below leads to a pocket, the one at the end to the bare field */
     "###c###",
     ".......",
     "###o##o",
     ".....#.",
     ".....#.",
     "..T..#.",
     "######B",
     "......#"],
    ["###S###",   /* III: the boulder dams the gorge; a channel of stones beside the pool; the lower valley below */
     ".o....#",
     ".o....#",
     ".o....#",
     ".##XX##",
     ".##XX##",
     ".......",
     "TTTTT..",
     "......."]];
  const solid=ch=>ch==="o"||ch==="#"||ch==="c"||ch==="X";
  const open=ch=>!solid(ch);
  const level=ch=>ch==="T"||ch==="B";
  const cx=x=>GX+x*CS+CS/2,cy=y=>GY+y*CS+CS/2;
  /* ---- the sim ---- */
  function loadPuzzle(s,n){const g=PZ[n].map(r=>r.split(""));let src=[3,0];g.forEach((r,y)=>r.forEach((ch,x)=>{if(ch==="S"){src=[x,y];g[y][x]="."}}));
    const M=f=>g.map(r=>r.map(f));
    Object.assign(s,{grid:g,wet:M(()=>false),ct:M(()=>0),C:M(()=>false),tg:M(()=>0),nick:M(()=>0),src,simT:0,acc:0,sp:1,adv:0,lifts:[],fl:[],seed:n===1?{x:src[0],y:src[1],root:false,dir:1,px:cx(src[0]),py:cy(src[1]),rt:0,idle:0}:null,
      lastWet:0,nT:0,hint:"",idle:0,lifted:0,tp:0,cur:s.cur||{x:3,y:2,rst:false},cOn:!!s.cOn,bump:M(()=>0),rootT:0});
    s.wet[src[1]][src[0]]=true;g.forEach(r=>r.forEach(ch=>{if(ch==="T")s.nT++}));s.nT=g.reduce((n,r)=>n+r.filter(ch=>ch==="T").length,0)}
  function spreaders(s){const g=s.grid,W=s.wet,C=g.map(r=>r.map(()=>false)),SP=g.map(r=>r.map(()=>false));
    for(let y=ROWS-1;y>=0;y--){let x=0;while(x<COLS){if(!W[y][x]){x++;continue}const a=x;while(x<COLS&&W[y][x])x++;const b=x-1;
        let ok=y<ROWS-1&&(a===0||solid(g[y][a-1]))&&(b===COLS-1||solid(g[y][b+1]));
        if(ok)for(let q=a;q<=b;q++){const bl=g[y+1][q];if(!(solid(bl)||level(bl)||(W[y+1][q]&&C[y+1][q]))){ok=false;break}}
        for(let q=a;q<=b;q++)C[y][q]=ok}}
    for(let y=0;y<ROWS-1;y++)for(let x=0;x<COLS;x++)if(W[y][x]){const bl=g[y+1][x];SP[y][x]=level(g[y][x])||solid(bl)||level(bl)||(W[y+1][x]&&C[y+1][x])}
    s.C=C;return SP}
  /* one tick of sim time: the clay wears, the water advances, the seed rides. Returns how many cells became wet. */
  function tick(s){const g=s.grid,W=s.wet;
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(g[y][x]==="c"){const t=(y>0&&W[y-1][x])||(y<ROWS-1&&W[y+1][x])||(x>0&&W[y][x-1])||(x<COLS-1&&W[y][x+1]);
      if(t){s.ct[y][x]+=TICK;if(s.ct[y][x]>=CLAYT-1e-9){g[y][x]=".";s.fl.push({x,y,t:0,k:"clay"})}}}
    const SP=spreaders(s),N=W.map(r=>r.slice());
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(W[y][x]){
      if(y<ROWS-1&&open(g[y+1][x]))N[y+1][x]=true;
      if(SP[y][x])for(const nx of [x-1,x+1])if(nx>=0&&nx<COLS&&open(g[y][nx]))N[y][nx]=true}
    const sd=s.seed;let moved=false;
    if(sd&&!sd.root){const x=sd.x,y=sd.y;
      if(y<ROWS-1&&open(g[y+1][x])&&!W[y+1][x]){sd.y++;moved=true}
      else if(SP[y][x]){const c=[];for(const nx of [x+sd.dir,x-sd.dir])if(nx>=0&&nx<COLS&&open(g[y][nx])&&!W[y][nx])c.push(nx);
        if(c.length){let nx=c[0];if(c.length>1){const dn=c.filter(q=>y<ROWS-1&&open(g[y+1][q])&&!W[y+1][q]);if(dn.length===1)nx=dn[0]}sd.dir=Math.sign(nx-x);sd.x=nx;moved=true}}
      sd.moved=moved;
      if(!moved&&g[sd.y][sd.x]==="B"){sd.root=true;s.rootT=0;sfx("sprout")}}
    let n=0;for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(N[y][x]&&!W[y][x]){n++;if(g[y][x]==="T"){s.tg[y][x]=.001;sfx("sprout")}}
    s.wet=N;s.lastWet=n;if(n)sfx("trickle");return n}
  const wetTerr=s=>{let n=0;s.grid.forEach((r,y)=>r.forEach((ch,x)=>{if(ch==="T"&&s.wet[y][x])n++}));return n};
  const allDone=s=>wetTerr(s)>=s.nT&&(s.st!==1||(s.seed&&s.seed.root));
  /* ---- the player's hands ---- */
  function nearest(s,px_,py_){let b=null,bd=REACH+1e-9;s.grid.forEach((r,y)=>r.forEach((ch,x)=>{if(ch==="o"||ch==="#"){const d=Math.hypot(cx(x)-px_,cy(y)-py_);if(d<=bd){bd=d;b=[x,y]}}}));return b}
  function actOn(s,x,y){const ch=s.grid[y]&&s.grid[y][x];
    if(ch==="o"){s.grid[y][x]=".";s.lifts.push({x,y,t:0});s.lifted++;sfx("lift");if(!s.rm)pDust(s.P,cx(x),cy(y)+4,5,"rgba(190,170,130,.7)")}
    else if(ch==="#"){s.bedrockTaps++;s.nick[y][x]++;s.bump[y][x]=1;sfx("clank")}}
  /* ---- drawing ---- */
  function fallbackBg(c){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#9AB0A8");g.addColorStop(.3,"#CFC9A0");g.addColorStop(1,"#2E4A3A");c.fillStyle=g;c.fillRect(0,0,192,320);
    c.fillStyle="#3E5E40";c.fillRect(0,100,34,160);c.fillRect(158,100,34,160);c.fillStyle="#5A86A0";c.fillRect(84,50,38,26)}
  function drawBg(c){if(!mBg(c,ID,0))fallbackBg(c)}
  const FB={soil:"#8A6A44",stone:"#8A8478",bedrock:"#4A4A58",clay_0:"#B8603C",clay_1:"#B06A48",clay_2:"#A07858",terrace_0:"#C8B48A",terrace_1:"#A8B070",terrace_2:"#7AA848",terrace_3:"#4E9A38",spring:"#4A9AD0"};
  function tile(c,n,x,y){if(mPiece(c,ID,n,x,y))return;px(c,x,y,CS,CS,FB[n]||"#888");if(n==="stone"||n==="bedrock"){c.fillStyle=n==="stone"?"#B0AA9A":"#5E5E70";c.beginPath();c.ellipse(x+9,y+9,6,5,0,0,7);c.fill()}}
  function clayName(t){return t<CLAYT/3?"clay_0":t<2*CLAYT/3?"clay_1":"clay_2"}
  function furrows(c,x,y,g){px(c,x,y,CS,CS,"#7A5A38");c.fillStyle="#5A4026";for(let i=0;i<4;i++)c.fillRect(x+1,y+2+i*4.2,CS-2,1.4);c.fillStyle="#9A7A50";for(let i=0;i<4;i++)c.fillRect(x+1,y+3.4+i*4.2,CS-2,.8)}
  function cellDraw(c,s,x,y,t){const ch=s.grid[y][x],X=GX+x*CS,Y=GY+y*CS;
    if(ch==="T"){const g=s.tg[y][x],k=g<=0?0:Math.min(3,Math.floor(g*3.999)+0);tile(c,"terrace_"+k,X,Y)}
    else if(ch==="B"){const sd=s.seed,g=sd&&sd.root?clamp(s.rootT/GRN,0,1):0;if(g<=0)furrows(c,X,Y);else{furrows(c,X,Y);c.save();c.globalAlpha=g;tile(c,"terrace_3",X,Y);c.restore()}}
    else if(ch==="c")tile(c,clayName(s.ct[y][x]),X,Y);
    else if(ch==="o"){tile(c,"soil",X,Y);tile(c,"stone",X,Y);
      // a dashed rim: this one can be lifted
      c.save();c.strokeStyle="rgba(245,226,170,"+(s.rm?.8:.65+.25*Math.sin(t/420+x))+")";c.lineWidth=1.1;c.setLineDash([2.4,2.4]);c.strokeRect(X+1,Y+1,CS-2,CS-2);c.restore()}
    else if(ch==="#"){const b=s.bump[y][x],ox=X-(s.rm?0:Math.sin(b*40)*b*.6),v=(x*7+y*13)%5;tile(c,"bedrock",ox,Y);
      c.fillStyle=v<2?"rgba(255,255,255,"+(.04+v*.04)+")":"rgba(6,4,12,"+((v-2)*.08+.04)+")";c.fillRect(ox,Y,CS,CS);   // slight shading variation from block to block
      c.strokeStyle="rgba(8,6,16,.42)";c.lineWidth=1;c.strokeRect(ox+.5,Y+.5,CS-1,CS-1)}   // a soft 1-unit grout
    else tile(c,x===s.src[0]&&y===s.src[1]?"spring":"soil",X,Y);
    if(ch==="#"&&s.nick[y][x]>0){ // the spade's nicks: a small spade in the corner, one more notch each tap
      c.save();const sx=X+CS-6,sy=Y+2;c.globalAlpha=.55+.45*Math.min(1,s.bump[y][x]);c.fillStyle="#D9C9A0";c.fillRect(sx+1.2,sy,1.2,4);c.beginPath();c.moveTo(sx-1,sy+4);c.lineTo(sx+4.2,sy+4);c.lineTo(sx+1.8,sy+8);c.closePath();c.fill();
      c.strokeStyle="#2A2230";c.lineWidth=.6;for(let i=0;i<Math.min(4,s.nick[y][x]);i++){c.beginPath();c.moveTo(sx+4.2-i*1.4,sy+4);c.lineTo(sx+3.4-i*1.4,sy+5.4);c.stroke()}c.restore()}}
  /* the water is one body: every wet open cell goes into a single path (so there are no seams and no doubled alpha), tinted teal-blue and see-through (the soil or terrace shows below),
     with a lighter rim and a soft halo on the outer edges, a few light streaks drifting with the flow, foam where a stream lands, and a calm bright line on the surface of a pool. No per-frame pixel reads. */
  function waterDraw(c,s,t){const W=s.wet,g=s.grid,wet=(x,y)=>x>=0&&y>=0&&x<COLS&&y<ROWS&&W[y][x]&&!solid(g[y][x]);
    const tgOf=(x,y)=>{const ch=g[y][x];return ch==="T"?Math.min(1,s.tg[y][x]):ch==="B"&&s.seed&&s.seed.root?1:0};
    // 1. the body: two passes (open soil, then terraces that are greening, which let more of their green through)
    for(let pass=0;pass<2;pass++){c.beginPath();let any=false;
      for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){if(!wet(x,y))continue;const k=tgOf(x,y);if((pass===0)===(k<.5)){c.rect(GX+x*CS,GY+y*CS,CS,CS);any=true}}
      if(any){c.fillStyle=pass===0?"rgba(52,146,186,.58)":"rgba(52,146,186,.3)";c.fill()}}
    // 2. the edges: a 1-unit lighter rim inside, a soft halo outside, only where the neighbour isn't water
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){if(!wet(x,y))continue;const X=GX+x*CS,Y=GY+y*CS;
      const sides=[[0,-1,X,Y,CS,1,X,Y-2,CS,2],[0,1,X,Y+CS-1,CS,1,X,Y+CS,CS,2],[-1,0,X,Y,1,CS,X-2,Y,2,CS],[1,0,X+CS-1,Y,1,CS,X+CS,Y,2,CS]];
      for(const q of sides){if(wet(x+q[0],y+q[1]))continue;c.fillStyle="rgba(190,232,242,.34)";c.fillRect(q[2],q[3],q[4],q[5]);c.fillStyle="rgba(44,128,160,.14)";c.fillRect(q[6],q[7],q[8],q[9])}}
    // 3. the shimmer: soft streaks that drift with the flow (down where it falls, along where it spreads); held still under Reduce Motion
    c.save();c.fillStyle="rgba(220,246,252,.5)";
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){if(!wet(x,y))continue;const X=GX+x*CS,Y=GY+y*CS,fall=y>0&&wet(x,y-1)&&!s.C[y-1][x],h=x*7+y*13;
      for(let i=0;i<2;i++){const ph=(h+i*5)%9/9,sp=s.rm?0:t/(2600+i*700);
        if(fall){const yy=((ph+sp)%1)*(CS+6)-3;const y0=Math.max(0,yy),y1=Math.min(CS,yy+6);if(y1>y0)c.fillRect(X+3.5+i*7+(h%3),Y+y0,1.2,y1-y0)}
        else{const xx=((ph+sp*(i?.7:1))%1)*(CS+8)-4;const x0=Math.max(0,xx),x1=Math.min(CS,xx+5+i*2);if(x1>x0)c.fillRect(X+x0,Y+4+i*7+(h%3),x1-x0,1)}}}
    c.restore();
    // 4. foam where a stream lands, spray under a falling one, and a calm, lighter surface on a pool
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){if(!wet(x,y))continue;const X=GX+x*CS,Y=GY+y*CS;
      if(y>0&&!wet(x,y-1)&&s.C[y][x]){c.fillStyle="rgba(240,250,252,.8)";c.fillRect(X,Y,CS,1.2);c.fillStyle="rgba(240,250,252,.16)";c.fillRect(X,Y+1.2,CS,3)}
      if(y>0&&wet(x,y-1)&&!s.C[y-1][x]&&(y===ROWS-1||solid(g[y+1][x])||level(g[y+1][x])||!wet(x,y+1)||s.C[y][x])){c.fillStyle="rgba(255,255,255,.75)";for(let i=0;i<5;i++){const fx=X+2.5+i*3+(s.rm?0:Math.sin(t/160+i*2.1)*.9),fy=Y+(i%2?.4:1.6)+(s.rm?0:Math.abs(Math.sin(t/190+i))*1.2);c.fillRect(hs(fx),fy,1.4,1.4)}}
      else if(y<ROWS-1&&open(g[y+1][x])&&(y===0||!wet(x,y-1)||!s.C[y-1][x])&&!wet(x,y+1)){c.fillStyle="rgba(240,250,252,.4)";for(let i=0;i<3;i++)c.fillRect(X+5+i*3.5,Y+CS-1+((s.rm?0:t/90+i*4)%7),.9,3)}}}
  function seedDraw(c,s,t){const sd=s.seed;if(!sd)return;const bob=s.rm||sd.root?0:Math.sin(t/330)*.9;
    if(sd.root){const k=clamp(s.rootT/GRN,0,1);if(!mPiece(c,ID,"sprout",sd.px,sd.py+6,{ax:.5,ay:1,sc:1+.9*k,a:.35+.65*Math.min(1,k*3)})){px(c,sd.px-1,sd.py-6+(1-k)*6,2,8,"#4E9A38")}return}
    glow(c,sd.px,sd.py,15,"rgba(255,226,150,.9)",.42);
    if(!mPiece(c,ID,"seed",sd.px,sd.py+bob,{ax:.5,ay:.5,sc:2.1,rot:s.rm?0:Math.sin(t/500)*.18,sm:true})){c.fillStyle="#8A5A2A";c.beginPath();c.ellipse(sd.px,sd.py+bob,4,5,0,0,7);c.fill()}}
  function liftDraw(c,s){for(const l of s.lifts){const k=l.t/.45;if(k>=1)continue;c.save();c.globalAlpha=1-k;tile(c,"stone",GX+l.x*CS,GY+l.y*CS-(s.rm?0:E.out(k)*7));c.restore()}}
  function laozi(c,s,t){const x=26,y=84;mShadow(c,x,y,16,.35);const f="laozi_"+(s.rm?0:Math.floor(t/1000)%2);
    const e=ATLAS_IMG.chars,A=ATLAS.chars;if(e&&e.ok&&A&&A.rects[f]){const r=A.rects[f];let cv=SIL[f];if(!cv){cv=SIL[f]=document.createElement("canvas");cv.width=r[2];cv.height=r[3];const q=cv.getContext("2d");q.drawImage(e.img,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);q.globalCompositeOperation="source-in";q.fillStyle="#150E1C";q.fillRect(0,0,r[2],r[3])}
      c.save();c.globalAlpha=.9;for(const o of [[-1,0],[1,0],[0,-1],[0,1]])c.drawImage(cv,x-8+o[0],y-24+o[1]);c.restore()}
    if(!mSpr(c,f,x-8,y-24))px(c,x-8,y-24,16,24,"#EDEADF")}
  const SIL={};
  function buffaloDraw(c,s,t){const flick=!s.rm&&(t/1000%5.6)>5.2;const nm=flick?"buffalo_1":"buffalo_0",x=184,y=248;
    mShadow(c,x-20,y,40,.3);if(!mPiece(c,ID,nm,x,y,{ax:1,ay:1})){px(c,x-40,y-20,40,18,"#6A5A4A")}}
  function mist(c,s,t){const sp=s.sp||1,o=s.rm?0:(t/1000*3*sp);c.save();for(let i=0;i<3;i++){const X=((o*(1+i*.4)+i*70)%260)-40,Y=100+i*55;const g=c.createRadialGradient(X,Y,0,X,Y,46);g.addColorStop(0,"rgba(235,240,235,.16)");g.addColorStop(1,"rgba(235,240,235,0)");c.fillStyle=g;c.fillRect(X-46,Y-30,92,60)}c.restore()}
  const stuck=s=>!!(s.seed&&!s.seed.root&&s.seed.idle>9);
  function resetIcon(c,s,t){const x=176,y=50,on=s.cur.rst&&s.cOn;
    if(stuck(s)){ // the seed has rested unrooted for 9 s: the Reset icon glows and a slow ring spreads from it (shape and motion, not only colour)
      const ph=s.rm?.35:(t/1700)%1;glow(c,x,y,24+(s.rm?0:3*Math.sin(t/330)),"rgba(255,226,150,.95)",s.rm?.4:.3+.14*Math.sin(t/330));
      c.save();c.strokeStyle="rgba(255,233,168,"+(.75*(1-ph))+")";c.lineWidth=1.4;c.beginPath();c.arc(x,y,13+ph*11,0,7);c.stroke();c.restore()}
    c.save();c.fillStyle="rgba(24,18,32,.66)";c.beginPath();c.arc(x,y,12,0,7);c.fill();c.strokeStyle=on||stuck(s)?"#FFE9A8":"rgba(245,198,106,.85)";c.lineWidth=on||stuck(s)?1.6:1;c.stroke();
    c.strokeStyle="#F5E3B8";c.lineWidth=1.4;c.beginPath();c.arc(x,y,5.2,-2.4,2.9);c.stroke();c.fillStyle="#F5E3B8";c.beginPath();c.moveTo(x+4,y-6.8);c.lineTo(x+7.4,y-3);c.lineTo(x+2,y-2.6);c.closePath();c.fill();c.restore()}
  /* an on-canvas hint: 9-unit text on a dark rounded pill, wrapped to two lines, sitting just under the grid (its bottom edge at y 250) */
  function pill(c,txt,cx_,bottom,maxw,a){c.save();c.font='9px "IM Fell English SC",Georgia,serif';const words=txt.split(" "),ls=[];let cur="";
    for(const w of words){const n=cur?cur+" "+w:w;if(cur&&c.measureText(n).width>maxw){ls.push(cur);cur=w}else cur=n}ls.push(cur);
    const w=Math.max(...ls.map(l=>c.measureText(l).width))+12,h=ls.length*10+4,x=cx_-w/2,y=bottom-h;c.restore();
    c.save();c.globalAlpha=a==null?1:a;c.fillStyle="rgba(14,10,24,.8)";c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,5);else c.rect(x,y,w,h);c.fill();c.strokeStyle="rgba(245,198,106,.4)";c.lineWidth=.8;c.stroke();
    ls.forEach((l,i)=>mText(c,l,cx_,y+2+10*i+5,9,"#FFE9B8"));c.restore()}
  function hud(c,s,t){const h=s.hintNow;if(h)pill(c,h,96,250,168);
    // the sim speed's visual twin: a thin gold line under the grid grows with the speed-up
    const k=(s.sp-1)/(SPMAX-1);if(k>.02)px(c,GX,GY+ROWS*CS+1.5,Math.round(CS*COLS*k),1.2,"rgba(245,198,106,.8)")}
  MINI.water={
    who:"laozi",title:"Be Water",land:"l3",
    setup:["Water never argues with a rock. It goes around, or it waits, and it wins anyway.","Help it along. Don’t push."],
    how:"Tap loose stones to lift them. Leave the bedrock alone. Hold B to wait.",
    win:"You hardly did anything. That’s the best praise I know.",
    walk:"Take the stone. The river spent a hundred years on it.",
    stages:["The Terraces","Carried","The Gorge"],
    lines:[null,"The water can carry what you can’t. Just open the way.","Even that boulder. Give the water somewhere to go, and wait."],
    pad:true,ab:true,limit:0,long:false,bloomT:3.4,
    fl:["Water all three fields","Chip the bedrock no more than twice","Never touch the bedrock"],
    flNext:["Next time, try lifting stones, or waiting, instead of chipping the bedrock.","Next time, try never touching the bedrock at all."],
    rate:s=>s.bedrockTaps===0?3:s.bedrockTaps<=2?2:1,
    init(s){Object.assign(s,{st:0,stT:0,bedrockTaps:0,cur:{x:3,y:2,rst:false},cOn:false,moveT:0,t0:0,P:pfx(),dt:.05,mx:0,my:0,wob:0,hintNow:""});loadPuzzle(s,0)},
    toStage(s,n){this.init(s);if(n>=1){s.st=n;stageUp(s,n);loadPuzzle(s,n)}},
    step(s,dt,inp){
      s.dt=dt;s.stT+=dt;s.moveT=Math.max(0,s.moveT-dt);
      // ---- the hands: the reset icon, a tap on a stone (or bedrock), the pad's cursor
      for(const tp of inp.taps||[]){s.cOn=false;
        if(Math.hypot(tp.x-176,tp.y-50)<=14){loadPuzzle(s,s.st);continue}
        const b=nearest(s,tp.x,tp.y);if(b)actOn(s,b[0],b[1])}
      const dx=Math.abs(inp.dx||0)>.3?Math.sign(inp.dx):0,dy=Math.abs(inp.dy||0)>.3?Math.sign(inp.dy):0;
      if((dx||dy)&&s.moveT<=0){s.cOn=true;const q=s.cur;
        if(q.rst){if(dy>0)q.rst=false;else if(dx<0)q.rst=false}
        else if(dy<0&&q.y===0)q.rst=true;
        else{q.x=clamp(q.x+dx,0,COLS-1);q.y=clamp(q.y+dy,0,ROWS-1)}s.moveT=.16}
      if(inp.aTap){s.cOn=true;if(s.cur.rst)loadPuzzle(s,s.st);else actOn(s,s.cur.x,s.cur.y)}
      // ---- waiting: hold B, or press and hold the spring: the sim eases up to 2.5x
      const dn=inp.down&&typeof inp.down.x==="number"?inp.down:null,onSp=!!dn&&Math.hypot(dn.x-cx(s.src[0]),dn.y-cy(s.src[1]))<=13;
      const want=inp.b||onSp?SPMAX:1;s.sp+=(want-s.sp)*Math.min(1,dt*SPK);
      // ---- the sim clock
      s.acc+=dt*s.sp;s.simT+=dt*s.sp;let guard=0;while(s.acc>=TICK-1e-9&&guard++<8){s.acc-=TICK;tick(s)}
      // ---- the seed drifts to its cell; the terraces green; the clay shows its wear
      const sd=s.seed;if(sd){const tx=cx(sd.x),ty=cy(sd.y),k=Math.min(1,dt*(s.rm?20:7));sd.px+=(tx-sd.px)*k;sd.py+=(ty-sd.py)*k;if(sd.root)s.rootT+=dt;
        sd.idle=sd.moved||sd.root?0:sd.idle+dt;if(sd.moved)sd.idle=0}
      for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){if(s.tg[y][x]>0&&s.tg[y][x]<1)s.tg[y][x]=Math.min(1,s.tg[y][x]+dt/GRN);if(s.bump[y][x]>0)s.bump[y][x]=Math.max(0,s.bump[y][x]-dt*2)}
      for(const l of s.lifts)l.t+=dt;s.lifts=s.lifts.filter(l=>l.t<.45);for(const f of s.fl)f.t+=dt;s.fl=s.fl.filter(f=>f.t<.6);
      // ---- a hint, only when something is waiting
      let h="";if(s.st===0&&!s.lifted&&s.stT>5)h="Tap a loose stone to lift it.";
      else if(s.grid.some((r,y)=>r.some((ch,x)=>ch==="c"&&s.ct[y][x]>0&&s.ct[y][x]<CLAYT)))h="Clay wears away by itself. Hold B to wait.";
      else if(stuck(s))h="The seed waits where the water stopped. Reset to try another way.";
      s.hintNow=h;
      // ---- a stage is done when every field is watered (Stage II: and the seed has rooted); a beat to see the green, then on
      if(allDone(s)){s.adv+=dt;if(s.adv>=1.7){if(s.st>=2)return "win";stageUp(s);loadPuzzle(s,s.st)}}else s.adv=0;
      pStep(s.P,dt,s.rm)},
    draw(s,c,t){drawBg(c);grade(c,"rgba(40,30,60,1)",.06);
      c.fillStyle="rgba(30,22,16,.35)";c.fillRect(GX-1.5,GY-1.5,COLS*CS+3,ROWS*CS+3);
      for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){if(s.grid[y][x]!=="X")cellDraw(c,s,x,y,t)}
      waterDraw(c,s,t);
      // the boulder (Stage III): one 2 x 2 piece, solid
      for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)if(s.grid[y][x]==="X"&&s.grid[y-1]&&s.grid[y-1][x]!=="X"&&s.grid[y][x-1]!=="X"){const X=GX+x*CS,Y=GY+y*CS;tile(c,"soil",X,Y);tile(c,"soil",X+CS,Y);tile(c,"soil",X,Y+CS);tile(c,"soil",X+CS,Y+CS);
        if(!mPiece(c,ID,"boulder",X,Y+2*CS,{ax:0,ay:1})){c.fillStyle="#5A7A4A";c.beginPath();c.ellipse(X+CS,Y+CS,CS-1,CS-2,0,0,7);c.fill()}}
      liftDraw(c,s);seedDraw(c,s,t);
      if(s.cOn&&!s.cur.rst){const q=s.cur,X=GX+q.x*CS,Y=GY+q.y*CS;c.strokeStyle="#FFE9A8";c.lineWidth=1.4;c.strokeRect(X+.7,Y+.7,CS-1.4,CS-1.4)}
      laozi(c,s,t);buffaloDraw(c,s,t);mist(c,s,t);pDraw(c,s.P,ID);vignette(c,.22);resetIcon(c,s,t);hud(c,s,t)},
    bloom(s,c,k,t){ /* the water reaches the last field, the terraces fill with green rice (swaying gently), and the river runs smooth around a worn stone. More lanterns, more green. */
      const fl=s._fl||1;if(!s._bm){s._bm=1;s.P=pfx();s._bp=0}
      drawBg(c);const gr=s.rm?1:E.out(clamp(k/.5,0,1));grade(c,"rgba(255,226,150,1)",(.06+.03*fl)*gr,"soft-light");
      // the river: a smooth ribbon down the slope around a worn stone
      c.save();c.globalAlpha=gr;const rv=[[102,66],[104,100],[92,128],[84,160],[96,196],[110,226],[112,252]];
      for(let w=0;w<2;w++){c.strokeStyle=w?"rgba(210,236,255,.55)":"rgba(70,140,190,.8)";c.lineWidth=w?2:9;c.lineCap="round";c.beginPath();rv.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke()}
      c.fillStyle="#8F8A80";c.beginPath();c.ellipse(90,158,8,5.5,.3,0,7);c.fill();c.fillStyle="rgba(255,255,255,.3)";c.beginPath();c.ellipse(88,156,4,2,.3,0,7);c.fill();c.restore();
      // the rice: terrace_3 tiles along both sides, swaying
      const n=2+fl*2;for(let i=0;i<n;i++){const a=E.out(clamp((k-.1-i*.07)/.4,0,1));if(a<=0)continue;for(const sd of [-1,1]){const X=sd<0?34+i*3:136-i*3,Y=100+i*30,sw=s.rm?0:Math.sin(t/700+i+sd)*.8;
        c.save();c.globalAlpha=a;for(let q=0;q<2;q++)tile(c,"terrace_3",X+q*CS+sw,Y);c.restore()}}
      for(let i=0;i<2+fl;i++){const a=gr;c.save();c.globalAlpha=a;tile(c,"terrace_3",GX+i*CS,GY+7*CS);c.restore()}
      if(!s.rm){const want=Math.floor((5+4*fl)*clamp((k-.1)/.4,0,1));while(s._bp<want){s._bp++;pAdd(s.P,{x:rnd(30,170),y:rnd(120,240),vx:rnd(-3,3),vy:-rnd(5,10),life:rnd(2.4,3.6),fin:.5,col:"#DFF6C0",s:1.2,wob:2,ph:rnd(0,9)})}pStep(s.P,1/60,false)}
      else if(!s.P.list.length)for(let i=0;i<8+fl*3;i++)pAdd(s.P,{x:rnd(30,170),y:rnd(110,240),vx:0,vy:0,life:99,fade:false,col:"#DFF6C0",s:1.2});
      glow(c,96,150,100,"rgba(190,240,170,.9)",(.12+.05*fl)*gr);pDraw(c,s.P,ID);vignette(c,.22)},
    _t:{clayName,PZ,COLS,ROWS,CS,GX,GY,TICK,CLAYT,SPMAX,REACH,tick,loadPuzzle,spreaders,nearest,actOn,wetTerr,allDone,cx,cy,solid,open,level},   /* tests only */
    shotReady:s=>s.lastWet>0&&!allDone(s)&&s.stT>1,   /* tests only */
    auto(s,inp){ /* tests only: a patient player. Lifts the stones that open the way, never touches the bedrock, and holds B to wait. */
      const lift=(x,y)=>{if(s.grid[y][x]==="o"){inp.taps=[{x:cx(x),y:cy(y)}];inp.tap=inp.taps[0];return true}return false};
      if(s.st===0)lift(4,3);
      else if(s.st===1){if(!lift(6,3)&&s.seed&&s.seed.root)lift(3,3)}
      else if(s.st===2)lift(1,3);
      inp.b=true}
  };
  function rnd(a,b){return a+Math.random()*(b-a)}
  /* Phase 36-B: when the game closes the page calls release() to drop what the game cached from its art (held() counts it; the kit checks it is 0 after a close) */
  MINI[ID].release=function(){for(const k in SIL)delete SIL[k]};MINI[ID].held=function(){return Object.keys(SIL).length};
})();
/* GAME:water:END */

/* GAME:kitchen:BEGIN */
/* ---- Phase 33C: The Tenzo's Kitchen, developed — Dōgen's "A Cook's Ladle and Drying Mushrooms" (no lanterns) ----
   Idea check: playing this, you feel that slow, steady attention to plain work is its own reward: rushing spills things, and there's no score to chase.
   That is Dōgen's idea, from his instructions for the cook (Tenzo Kyōkun), that this work is the practice itself, not a delay before it.
   Stages: I · Dawn: The Rice (stir in slow circles until Attention is full, then sift: tap each bit of grit, gently) →
   II · Noon: The Mushrooms (the sun-baked courtyard; lay six mushrooms on the drying tray, one at a time, while the old tenzo works and speaks) →
   III · Evening: The Meal (chop the greens with slow strokes down the guide lines, then set five bowls on the tray, each in its place). Dōgen bows.
   The rule, everywhere: a hand moving faster than FAST units/s spills, flips, cuts crooked or slides back. Nothing is ever lost for good, there is no timer and no score.
   Stir: a steady speed between SLOW and FAST fills Attention (faster fills nothing and splashes a few grains out of the bowl). Sift: a tap less than CALM seconds after the last one is hurried:
   it lifts rice with the grit, and both fall back in. Lay, set: a drag above FAST flips the mushroom (or slides the bowl) back. Chop: a stroke above FAST, or wandering more than WOB off its line, cuts a crooked piece that doesn't count.
   Controls: drag (or hold the pad, which always moves at a steady pace); tap grit (or move the pad's cursor and press A). pad:true, long:true, no lanterns (nofl).
   State: s.st stage, s.ph sub-step (stir|sift · lay · chop|bowls|done), s.att Attention 0..1, s.spill grains splashed out, s.grit[], s.mush[], s.cuts[], s.dish[], s.said (the old tenzo's lines, in order). */
(function(){
  const ID="kitchen";
  const FAST=120,SLOW=12,CALM=.6,WOB=5;                   /* units/s above which a hand is rushing; below which stirring does nothing; seconds a tap needs after the last one; how far a stroke may wander off its line */
  const ATT=.105,PADV=46,GRAB=12,SNAP=13;                 /* Attention per second of steady stirring; the pad's steady pace; how near a finger must be to pick something up, and to set it down */
  const BOWL={x:82,y:186,r:28},SIEVE={x:92,y:184,rx:34,ry:19};
  const BASKET={x:42,y:206},TRAY2={x:120,y:188};          /* Stage II: the basket and the drying tray */
  const SLOTS=[[98,178],[120,176],[142,178],[100,200],[122,202],[144,200]];
  const BOARD={x:86,y:178},CUTX=[66,76,86,96,106],CUT0=160,CUTL=36;   /* Stage III: the board and the five guide lines (x, top, length) */
  const TRAY3={x:100,y:206};
  const DISHES=["dish_rice","dish_soup","dish_pickles","dish_greens","dish_tea"];
  const HOME=[[30,138],[58,140],[86,138],[118,140],[170,150]];         /* where each bowl waits */
  const PLACE=[[82,198],[104,198],[126,198],[92,216],[116,216]];      /* each bowl's place on the tray */
  const TENZO=["Other people are not me.","If not now, when?"],TNAME="The old tenzo";
  const px=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(hs(x),hs(y),w,h)};
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const d2=(ax,ay,bx,by)=>Math.hypot(ax-bx,ay-by);
  const say=(s,txt,who)=>{s.said.push(txt);if(typeof miniSay==="function")miniSay(txt,0,who)};
  /* ---- the hand: a finger (inp.down) or the pad's steady cursor; speed is smoothed over about a tenth of a second ---- */
  function hand(s,inp,dt){const h=s.h;h.tap=false;h.up=false;h.mv=false;
    if(inp.down){const x=inp.down.x,y=inp.down.y;if(h.on&&!h.pad){const v=d2(x,y,h.x,h.y)/dt;h.sp+=(v-h.sp)*Math.min(1,dt*12)}else h.sp=0;h.x=x;h.y=y;h.on=true;h.pad=false}
    else{if(h.on&&!h.pad){h.up=true;h.on=false}
      const dx=inp.dx||0,dy=inp.dy||0;
      if(dx||dy){const n=Math.hypot(dx,dy);if(!h.pad){h.x=s.cx;h.y=s.cy}h.x=clamp(h.x+dx/n*PADV*dt,8,184);h.y=clamp(h.y+dy/n*PADV*dt,40,248);h.sp=PADV;h.on=true;h.pad=true;h.mv=true}
      else if(h.pad)h.sp=0;   /* an idle pad keeps its cursor, and whatever it carries */
      else h.sp*=Math.exp(-dt*8)}
    if(h.on){s.cx=h.x;s.cy=h.y}
    const tp=(inp.taps||[])[0];
    if(tp){h.tap=true;h.tapAt={x:tp.x,y:tp.y}}else if(inp.aTap){h.tap=true;h.tapAt={x:s.cx,y:s.cy}}
    return h}
  /* ---- Stage I: the rice ---- */
  function newGrit(){const g=[];let n=0;while(g.length<5&&n++<400){const a=rnd(0,6.283),r=Math.sqrt(rnd(.05,.8));const x=SIEVE.x+Math.cos(a)*SIEVE.rx*r,y=SIEVE.y+Math.sin(a)*SIEVE.ry*r;
      if(g.every(q=>d2(q.x,q.y,x,y)>=18))g.push({x,y,out:false,hop:0,ox:0,oy:0})}return g}
  function stir(s,h,dt){
    if(h.pad){if(!h.mv){s.steady*=Math.exp(-dt*3);s.la=null;return}s.pa=(s.pa||0)+dt*PADV/18;h.x=BOWL.x+Math.cos(s.pa)*18;h.y=BOWL.y-3+Math.sin(s.pa)*13;s.cx=h.x;s.cy=h.y}  /* holding the pad stirs at one steady pace */
    else if(!(h.on&&d2(h.x,h.y,BOWL.x,BOWL.y)<BOWL.r+6)){s.steady*=Math.exp(-dt*3);s.la=null;return}
    const a=Math.atan2(h.y-BOWL.y,h.x-BOWL.x);if(s.la!=null){let da=a-s.la;while(da>Math.PI)da-=6.283;while(da<-Math.PI)da+=6.283;s.swirl+=da;s.wv+=(da/dt-s.wv)*Math.min(1,dt*6)}s.la=a;
    const v=h.pad?PADV:h.sp;s.spL+=(v-s.spL)*Math.min(1,dt*1.6);
    if(v>FAST){s.splashT+=dt;s.att=Math.max(0,s.att-dt*.03);s.steady=0;if(s.splashT>=.12){s.splashT=0;splash(s,h.x,h.y)}if(!s.splashed){s.splashed=1;s.hint2=5}}
    else if(v>=SLOW){const steady=clamp(1-Math.abs(v-s.spL)/(s.spL+12),0,1);s.steady=steady;s.att=Math.min(1,s.att+dt*ATT*(.45+.55*steady));
      s.stirT+=dt;if(s.stirT>=.55){s.stirT=0;sfx("stir")}}}
  function splash(s,x,y){const n=2+Math.floor(Math.random()*2);s.spill+=n;sfx("splash");
    for(let i=0;i<n;i++){const a=Math.atan2(y-BOWL.y,x-BOWL.x)+rnd(-.6,.6),v=rnd(30,55);pAdd(s.P,{k:"grain",x:BOWL.x+Math.cos(a)*BOWL.r*.9,y:BOWL.y+Math.sin(a)*BOWL.r*.6-6,vx:Math.cos(a)*v,vy:-rnd(30,50),g:160,life:.9,col:"#F2EAD2",s:1.2,land:BOWL.y+rnd(14,30)})}
    for(let i=0;i<3;i++)pAdd(s.P,{x:x+rnd(-4,4),y:y-2,vx:rnd(-20,20),vy:-rnd(20,40),g:120,life:.5,col:"rgba(190,220,240,.8)",s:1})}
  function sift(s,h){if(!h.tap)return;const p=h.tapAt,now=s.t,hurried=now-s.lastTap<CALM;s.lastTap=now;
    if(d2(p.x,p.y,SIEVE.x,SIEVE.y)>SIEVE.rx+12)return;
    let best=null,bd=11;for(const g of s.grit)if(!g.out&&!g.hop){const d=d2(p.x,p.y,g.x,g.y);if(d<bd){bd=d;best=g}}
    if(hurried){s.hurried++;s.hint3=4;for(let i=0;i<5;i++)pAdd(s.P,{k:"grain",x:p.x+rnd(-4,4),y:p.y,vx:rnd(-12,12),vy:-rnd(26,44),g:150,life:.6,col:"#F2EAD2",s:1.1,land:p.y+rnd(-2,3)});
      if(best){best.hop=.6;best.ox=best.x;best.oy=best.y;let x,y,n=0;do{const a=rnd(0,6.283),r=Math.sqrt(rnd(.05,.8));x=SIEVE.x+Math.cos(a)*SIEVE.rx*r;y=SIEVE.y+Math.sin(a)*SIEVE.ry*r}while(n++<40&&s.grit.some(q=>q!==best&&!q.out&&d2(q.x,q.y,x,y)<18));best.nx=x;best.ny=y}
      sfx("tap");return}
    if(best){best.out=true;best.fly=0;best.ox=best.x;best.oy=best.y;sfx("grit")}
    else for(let i=0;i<2;i++)pAdd(s.P,{x:p.x+rnd(-3,3),y:p.y,vx:rnd(-6,6),vy:-rnd(4,10),g:40,life:.35,col:"#F2EAD2",s:1})}
  /* ---- carrying a thing (a mushroom, a bowl): pick it up near the hand, rushing sends it back ---- */
  function carry(s,h,list,dt,fits,onSet){
    if(!s.held){if(h.on&&(h.pad||!s.wasOn)){let best=null,bd=GRAB;for(const m of list)if(!m.done&&!m.back){const d=d2(h.x,h.y,m.x,m.y);if(d<bd){bd=d;best=m}}
        if(best){s.held=best;best.hx=best.x;best.hy=best.y;sfx("pick")}}}
    if(s.held){const m=s.held;
      if(!h.on&&!h.up){s.held=null;m.back=1;return}
      m.x=h.x;m.y=h.y;
      if(h.sp>FAST&&!h.pad){s.held=null;m.back=1;m.flip=1;s.rushed++;sfx("drop");s.hint3=4;return}  /* rushing: it flips (or slides) back home */
      const t=fits(m);
      if(t&&(h.pad?d2(m.x,m.y,t[0],t[1])<5:h.up)){m.x=t[0];m.y=t[1];m.done=true;s.held=null;onSet(m);return}
      if(h.up){s.held=null;m.back=1}}}
  function homeward(list,dt){for(const m of list)if(m.back){m.back=Math.max(0,m.back-dt*1.6);m.x=lerp(m.x,m.home[0],Math.min(1,dt*7));m.y=lerp(m.y,m.home[1],Math.min(1,dt*7));
      if(m.back<=0||d2(m.x,m.y,m.home[0],m.home[1])<.6){m.back=0;m.flip=0;m.x=m.home[0];m.y=m.home[1]}}}
  function nearestFree(list,x,y,r){let best=null,bd=r;for(const p of list)if(!p.full){const d=d2(x,y,p.x,p.y);if(d<bd){bd=d;best=p}}return best}
  /* ---- Stage III: chopping ---- */
  function chop(s,h,dt){
    if(!s.stroke){let best=-1;
      if(h.pad&&h.mv&&s.inp.dy>0){let bd=99;for(let i=0;i<5;i++)if(!s.cuts[i].done&&Math.abs(h.x-CUTX[i])<bd){bd=Math.abs(h.x-CUTX[i]);best=i}  /* the pad: left/right chooses, holding down strokes the nearest line */
        if(best>=0){h.x=CUTX[best];h.y=CUT0;s.cx=h.x;s.cy=h.y}}
      else if(h.on&&!h.pad&&!s.wasOn){let bd=9;for(let i=0;i<5;i++)if(!s.cuts[i].done){const d=Math.abs(h.x-CUTX[i]);if(d<bd&&h.y>=CUT0-12&&h.y<=CUT0+CUTL*.5){bd=d;best=i}}}
      if(best>=0)s.stroke={i:best,x0:h.x,max:0,wob:0}}
    if(s.stroke){const st=s.stroke,c=s.cuts[st.i];
      if(!h.on){s.stroke=null;c.k=0;return}
      if(h.pad){h.x=st.x0;s.cx=h.x}
      const prog=(h.y-CUT0)/CUTL;st.wob=Math.max(st.wob,Math.abs(h.x-st.x0));st.max=Math.max(st.max,prog);c.k=clamp(st.max,0,1);
      if((h.sp>FAST&&!h.pad)||st.wob>WOB){s.stroke=null;c.k=0;s.crooked++;s.hint3=4;sfx("chop",1);   /* rushed or wandering: a crooked piece falls aside, and the line stays uncut */
        pAdd(s.P,{k:"sliver",x:CUTX[st.i]+rnd(-2,2),y:CUT0+CUTL*rnd(.3,.7),vx:rnd(14,26),vy:-rnd(6,14),g:90,life:1.4,r:rnd(-1,1),vr:rnd(-4,4),col:"#6FA048"});return}
      if(st.max>=1){c.done=true;c.fall=0;s.stroke=null;sfx("chop")}}}
  /* ---- drawing ---- */
  const SIL={};
  function silCanvas(img,r,key){let cv=SIL[key];if(!cv){cv=SIL[key]=document.createElement("canvas");cv.width=r[2];cv.height=r[3];const q=cv.getContext("2d");q.drawImage(img,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);q.globalCompositeOperation="source-in";q.fillStyle="#150E1C";q.fillRect(0,0,r[2],r[3])}return cv}
  function person(c,name,x,y,o){ /* a map-scale person from this game's people sheet, with a 1-pixel dark outline (A8) */
    const A=MINI_ART[ID],r=A&&A.prects&&A.prects[name],e=A&&mImgE(A.people);if(!r||!e||!e.ok)return false;const cv=silCanvas(e.img,r,"p"+name);
    c.save();c.globalAlpha=.9;for(const q of [[-1,0],[1,0],[0,-1],[0,1]])c.drawImage(cv,hs(x)+q[0],hs(y)+q[1],r[2],r[3]);c.restore();return mPerson(c,ID,name,x,y,o)}
  function sprO(c,name,x,y){const e=ATLAS_IMG.chars,A=ATLAS.chars;if(!e||!e.ok||!A||!A.rects[name])return mSpr(c,name,x,y);const r=A.rects[name],cv=silCanvas(e.img,r,"c"+name);
    c.save();c.globalAlpha=.9;for(const q of [[-1,0],[1,0],[0,-1],[0,1]])c.drawImage(cv,x+q[0],y+q[1]);c.restore();return mSpr(c,name,x,y)}
  function dogen(c,s,t,x,y,bow){mShadow(c,x+8,y+24,18,.4);
    if(bow&&person(c,"dogen_bow",x,y))return;if(!sprO(c,"dogen_"+(s.rm?0:Math.floor(t/900)%2),x,y))px(c,x+3,y+4,10,20,"#1E1A1A")}
  function tenzo(c,s,t){const x=150,y=144,sp=s.tenzoT>0;mShadow(c,x+10,y+24,20,.4);
    const bob=s.rm||sp?0:Math.round(Math.sin(t/700)*.5*2)/2;
    if(!person(c,sp?"tenzo_1":"tenzo_0",x,y+bob))px(c,x+3,y+6,14,18,"#5A5244")}
  function pill(c,txt,cx_,bottom,maxw,a){c.save();c.font='9px "IM Fell English SC",Georgia,serif';const words=txt.split(" "),ls=[];let cur="";
    for(const w of words){const n=cur?cur+" "+w:w;if(cur&&c.measureText(n).width>maxw){ls.push(cur);cur=w}else cur=n}ls.push(cur);
    const w=Math.max(...ls.map(l=>c.measureText(l).width))+12,h=ls.length*10+4,x=cx_-w/2,y=bottom-h;c.restore();
    c.save();c.globalAlpha=a==null?1:a;c.fillStyle="rgba(14,10,24,.8)";c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,5);else c.rect(x,y,w,h);c.fill();c.strokeStyle="rgba(245,198,106,.4)";c.lineWidth=.8;c.stroke();
    ls.forEach((l,i)=>mText(c,l,cx_,y+2+10*i+5,9,"#FFE9B8"));c.restore()}
  function fallbackBg(c,n){const g=c.createLinearGradient(0,0,0,320);const T=[["#3A3426","#6A5A40","#24201A"],["#8A7A4A","#E8D49A","#4A4030"],["#22283A","#4A4258","#16141E"]][n];
    g.addColorStop(0,T[0]);g.addColorStop(.6,T[1]);g.addColorStop(1,T[2]);c.fillStyle=g;c.fillRect(0,0,192,320);c.fillStyle="rgba(0,0,0,.25)";c.fillRect(144,0,16,320)}
  function drawBg(c,s,n,a){if(!mBg(c,ID,n,a))fallbackBg(c,n)}
  function piece(c,name,x,y,o,fb){if(!mPiece(c,ID,name,x,y,o)&&fb)fb()}
  function riceGrains(c,cx,cy,rx,ry,seed,a){c.save();c.globalAlpha=a==null?1:a;let q=seed;const r=()=>{q=(q*16807)%2147483647;return q/2147483647};
    for(let i=0;i<120;i++){const an=r()*6.283,rr=Math.sqrt(r());const x=cx+Math.cos(an)*rx*rr,y=cy+Math.sin(an)*ry*rr;c.fillStyle=r()<.5?"#F4EEDC":"#DCD2B4";c.fillRect(hs(x),hs(y),1,.5)}c.restore()}
  function stage1(c,s,t){
    const sw=s.ph==="sift",k=s.phK;          /* k: 0..1 crossfade from the bowl to the sieve */
    if(!sw||k<1){c.save();c.globalAlpha=sw?1-k:1;
      piece(c,"rice_bowl",BOWL.x,BOWL.y,{ax:.5,ay:.5,sc:2},()=>{c.fillStyle="#7A5230";c.beginPath();c.ellipse(BOWL.x,BOWL.y,34,30,0,0,7);c.fill();c.fillStyle="#BFD2D8";c.beginPath();c.ellipse(BOWL.x,BOWL.y-2,26,20,0,0,7);c.fill()});
      // the water swirls with your stirring: arcs that turn with s.swirl, brighter while you stir steadily
      const sp=clamp(Math.abs(s.wv)/4,0,1);c.save();c.beginPath();c.ellipse(BOWL.x,BOWL.y-3,25,19,0,0,7);c.clip();
      for(let i=0;i<3;i++){const r=6+i*6.5,a0=s.swirl*(1.2-i*.25)+i*2.1;c.strokeStyle="rgba(235,248,255,"+(.18+.32*sp)+")";c.lineWidth=.9;c.beginPath();c.ellipse(BOWL.x,BOWL.y-3,r*1.2,r*.85,0,a0,a0+1.4+sp);c.stroke()}
      c.restore();
      if(!sw){const a=s.la==null?0:s.la;const lx=BOWL.x+Math.cos(a)*14,ly=BOWL.y-3+Math.sin(a)*10;piece(c,"ladle",lx,ly,{ax:.3,ay:.75,sc:1.6,rot:-.5+Math.sin(a)*.15,sm:true},()=>px(c,lx-2,ly-12,4,14,"#8A5A30"))}
      c.restore()}
    if(sw){c.save();c.globalAlpha=k;
      piece(c,"sieve",SIEVE.x,SIEVE.y,{ax:.5,ay:.5,sc:3.2,sm:true},()=>{c.fillStyle="#A07A48";c.beginPath();c.ellipse(SIEVE.x,SIEVE.y,45,30,0,0,7);c.fill()});
      c.fillStyle="rgba(236,226,196,.92)";c.beginPath();c.ellipse(SIEVE.x,SIEVE.y,SIEVE.rx+2,SIEVE.ry+2,0,0,7);c.fill();
      riceGrains(c,SIEVE.x,SIEVE.y,SIEVE.rx,SIEVE.ry,77);
      for(const g of s.grit){if(g.out){if(g.fly<1){const u=E.out(g.fly);const x=lerp(g.ox,150,u),y=lerp(g.oy,214,u)-Math.sin(Math.PI*u)*22;px(c,x-1,y-.75,2,1.5,"#3A3028")}continue}
        let x=g.x,y=g.y;if(g.hop>0){const u=1-g.hop/.6;x=lerp(g.ox,g.nx,u);y=lerp(g.oy,g.ny,u)-Math.sin(Math.PI*u)*14}
        px(c,x-1,y-.75,2,1.5,"#3A3028");px(c,x-.5,y-.75,1,.5,"#5A4A3C");
        if(!s.rm&&((t/1000+g.x*.07)%4.2)<.35)glow(c,x,y,4,"rgba(255,240,200,.9)",.5)}
      // the little dish of lifted grit
      c.fillStyle="rgba(30,22,16,.8)";c.beginPath();c.ellipse(150,216,9,3.5,0,0,7);c.fill();c.fillStyle="#8A7A60";c.beginPath();c.ellipse(150,215,8,3,0,0,7);c.fill();
      const n=s.grit.filter(g=>g.out&&g.fly>=1).length;for(let i=0;i<n;i++)px(c,146+i*2,214+(i%2)*.5,1.5,1,"#3A3028");
      c.restore()}
    // grains splashed onto the floor stay where they fell
    for(const g of s.floor)px(c,g[0],g[1],1,.5,"#E8E0C8")}
  function stage2(c,s,t){
    piece(c,"drying_tray",TRAY2.x,TRAY2.y,{ax:.5,ay:.5,sc:2},()=>{c.fillStyle="#C9A060";c.beginPath();c.ellipse(TRAY2.x,TRAY2.y,48,33,0,0,7);c.fill()});
    for(const p of s.slots){if(!p.full){c.save();c.globalAlpha=.35+(s.rm?0:.15*Math.sin(t/500+p.x));c.strokeStyle="#FFE9A8";c.lineWidth=.7;c.beginPath();c.ellipse(p.x,p.y,6,4,0,0,7);c.stroke();c.restore()}}
    piece(c,"sieve",BASKET.x,BASKET.y,{ax:.5,ay:.5,sc:2,sm:true},()=>{c.fillStyle="#8A6A3A";c.beginPath();c.ellipse(BASKET.x,BASKET.y,28,18,0,0,7);c.fill()});
    const order=s.mush.slice().sort((a,b)=>(a===s.held)-(b===s.held)||a.y-b.y);
    for(const m of order){const dk=m.dry;const fl=m.flip?Math.sin(Math.PI*E.inOut(1-m.back))*3.14:0;const lift=m===s.held?2:0;
      if(m===s.held)mShadow(c,m.x,m.y+6,12,.3);
      if(dk<1)piece(c,"mush_fresh",m.x,m.y-lift,{ax:.5,ay:.5,sc:1.6,sm:true,a:1-dk,rot:fl},()=>{c.fillStyle="#B07A50";c.beginPath();c.ellipse(m.x,m.y-lift-2,7,4,0,0,7);c.fill();px(c,m.x-1.5,m.y-lift,3,4,"#E8D8B8")});
      if(dk>0)piece(c,"mush_dried",m.x,m.y,{ax:.5,ay:.5,sc:1.6,sm:true,a:dk},()=>{c.fillStyle="#6A4A30";c.beginPath();c.ellipse(m.x,m.y,5,3.5,0,0,7);c.fill()})}}
  function stage3(c,s,t){
    // the board and the greens, cut into five pieces along the guide lines
    const ba=s.ph==="chop"?1:s.ph==="chopdone"?1-s.phK:0;
    if(ba>0)piece(c,"board",BOARD.x,BOARD.y,{ax:.5,ay:.5,sc:2.4,rot:Math.PI/2,sm:true,a:ba},()=>{c.save();c.globalAlpha=ba;px(c,BOARD.x-34,BOARD.y-24,68,48,"#B07A48");c.restore()});
    const segs=[[50,CUTX[0]],[CUTX[0],CUTX[1]],[CUTX[1],CUTX[2]],[CUTX[2],CUTX[3]],[CUTX[3],CUTX[4]],[CUTX[4],124]];
    for(let i=0;i<6;i++){const sg=segs[i],cut=i<5?s.cuts[i].done:s.cuts[4].done;const fall=i<5?s.cuts[i].fall:s.cuts[4].fall;
      const dx=cut?E.out(clamp(fall,0,1))*(4+i*1.5):0,dy=cut?E.out(clamp(fall,0,1))*(3+(i%2)*2):0;
      if(s.ph!=="chop"&&s.ph!=="chopdone")continue;
      c.save();c.globalAlpha=ba;c.beginPath();c.rect(sg[0]+dx,CUT0-14,sg[1]-sg[0],CUTL+28);c.clip();
      if(!mPiece(c,ID,"greens",86+dx,CUT0+CUTL/2+dy,{ax:.5,ay:.5,sc:2.3,rot:Math.PI/4+.08,sm:true})){c.fillStyle="#5E9A40";c.fillRect(sg[0]+dx,CUT0+4+dy,sg[1]-sg[0],CUTL-8)}c.restore()}
    if(s.ph==="chop"){for(let i=0;i<5;i++){const cu=s.cuts[i];if(cu.done)continue;const x=CUTX[i];c.save();c.globalAlpha=.75+(s.rm?0:.2*Math.sin(t/420+i));c.setLineDash([2.5,1.5]);c.strokeStyle="#FFF6DC";c.lineWidth=.8;c.shadowColor="rgba(0,0,0,.6)";c.shadowBlur=1;
        c.beginPath();c.moveTo(x,CUT0-3);c.lineTo(x,CUT0+CUTL+3);c.stroke();c.restore();if(cu.k>0){c.strokeStyle="rgba(255,233,168,.95)";c.lineWidth=.9;c.beginPath();c.moveTo(x,CUT0);c.lineTo(x,CUT0+CUTL*cu.k);c.stroke()}}
      const kx=s.stroke?CUTX[s.stroke.i]:s.cx,ky=s.stroke?CUT0+CUTL*s.cuts[s.stroke.i].k:s.cy;
      piece(c,"knife",kx,ky,{ax:.5,ay:1,sc:1.4,sm:true},()=>px(c,kx-1,ky-18,2,18,"#C8D0D8"))}
    // the tray and the five bowls
    if(s.ph==="bowls"||s.ph==="done"||s.ph==="chopdone"){const a=s.ph==="chopdone"?s.phK:1;c.save();c.globalAlpha=a;
      piece(c,"tray",TRAY3.x,TRAY3.y,{ax:.5,ay:.5,sc:1.6,sm:true},()=>px(c,TRAY3.x-50,TRAY3.y-22,100,44,"#5A3420"));
      for(let i=0;i<5;i++){const d=s.dish[i];if(!d.done){const tc=mTint(ID,DISHES[i],"#FFE9C8",1);if(!mCanvas(c,tc,PLACE[i][0],PLACE[i][1],{ax:.5,ay:.6,sc:1.5,a:.22+(s.rm?0:.08*Math.sin(t/500+i)),sm:true})){c.fillStyle="rgba(0,0,0,.3)";c.beginPath();c.ellipse(PLACE[i][0],PLACE[i][1],8,5,0,0,7);c.fill()}}}
      const order=s.dish.slice().sort((a,b)=>(a===s.held)-(b===s.held)||a.y-b.y);
      for(const d of order){const wob=d.back&&!s.rm?Math.sin(d.back*30)*.12:0;if(d===s.held)mShadow(c,d.x,d.y+8,16,.3);
        piece(c,DISHES[d.i],d.x,d.y-(d===s.held?2:0),{ax:.5,ay:.6,sc:1.5,sm:true,rot:wob},()=>{c.fillStyle=["#222","#8A1A1A","#C8A040","#4A7A30","#9A9A80"][d.i];c.beginPath();c.ellipse(d.x,d.y,9,6,0,0,7);c.fill()});
        if(d.done&&d.gl>0)glow(c,d.x,d.y,16,"rgba(255,214,140,.9)",.45*d.gl)}
      c.restore()}
    if(s.ph!=="done"){piece(c,"ladle",164,224,{ax:.5,ay:.5,sc:1.4,rot:.9,sm:true})}}
  function steam(s,x,y,n,w){if(s.rm)return;for(let i=0;i<n;i++)pAdd(s.P,{k:"glow",x:x+rnd(-w,w),y,vx:rnd(-2,2),vy:-rnd(5,9),life:rnd(1.8,2.6),fin:.5,col:"rgba(235,235,245,.6)",s:rnd(3,5),wob:1.5,ph:rnd(0,9),a:.35})}
  function lightLayer(c,s,t){
    if(s.st===0){shaft(c,72,82,190,46,.42,"rgba(255,226,170,.9)",.1+(s.rm?0:.02*Math.sin(t/1800)));glow(c,34,58,22,"rgba(255,200,120,.9)",.35);glow(c,94,86,18,"rgba(255,200,120,.9)",.3)}
    else if(s.st===1){const sh=s.rm?0:Math.sin(t/4000)*8;shaft(c,150+sh,0,260,70,.35,"rgba(255,236,170,.9)",.14);shaft(c,110+sh,0,250,40,.3,"rgba(255,236,170,.9)",.08);
      if(!s.rm){c.save();c.globalAlpha=.07;c.strokeStyle="#FFF6D8";c.lineWidth=1;for(let i=0;i<3;i++){const y=150+i*26+Math.sin(t/900+i)*2;c.beginPath();for(let x=0;x<=192;x+=4){const yy=y+Math.sin(x/9+t/260+i*2)*1.2;x?c.lineTo(x,yy):c.moveTo(x,yy)}c.stroke()}c.restore()}}
    else{glow(c,34,58,30,"rgba(255,180,90,.95)",.5);glow(c,94,86,24,"rgba(255,180,90,.95)",.42);glow(c,100,206,60,"rgba(255,190,110,.8)",.12)}}
  function hud(c,s,t){
    if(s.st===0){if(s.ph==="stir"){meter(c,52,236,88,4,s.att,"#D9A93A");mText(c,"Attention",96,229,8,"#FFE9B8");
        if(s.hint2>0)pill(c,"Too fast splashes the rice. Slower fills Attention.",96,150,150,Math.min(1,s.hint2));
        else if(s.att<.12&&s.stT>.5)pill(c,"Stir in slow circles",96,146,120)}
      else{if(s.hint3>0)pill(c,"One gentle tap at a time",96,150,140,Math.min(1,s.hint3));else if(s.grit.filter(g=>g.out).length===0)pill(c,"Tap each bit of grit, gently",96,150,140)}}
    else if(s.st===1){if(s.hint3>0)pill(c,"Slowly, or it flips back",96,246,140,Math.min(1,s.hint3));else if(s.laid===0&&!s.held)pill(c,"Lay each mushroom on the tray",96,246,140)}
    else{if(s.ph==="chop"){if(s.hint3>0)pill(c,"A rushed or crooked cut doesn’t count",96,246,150,Math.min(1,s.hint3));else if(s.cuts.every(x=>!x.done))pill(c,"Slow strokes down the lines",96,246,140)}
      else if(s.ph==="bowls"){if(s.hint3>0)pill(c,"Slowly, or it slides back",96,246,140,Math.min(1,s.hint3));else if(s.dish.every(d=>!d.done))pill(c,"Set each bowl in its place",96,246,140)}}
    if(s.h.pad&&s.st===0&&s.ph==="sift"){c.strokeStyle="rgba(255,233,168,.9)";c.lineWidth=.8;c.beginPath();c.arc(s.cx,s.cy,5,0,7);c.stroke()}}
  /* ---- stages ---- */
  function setup(s,n){s.st=n;s.stT=0;s.held=null;s.stroke=null;s.hint2=0;s.hint3=0;s.phK=0;s.adv=0;s.cx=96;s.cy=200;Object.assign(s.h,{on:false,pad:false,sp:0});
    if(n===0){s.ph="stir";s.att=0;s.spL=0;s.steady=0;s.la=null;s.wv=0;s.grit=newGrit();s.lastTap=-9}
    else if(n===1){s.ph="lay";s.laid=0;s.tenzoT=0;s.said=[];s.slots=SLOTS.map(p=>({x:p[0],y:p[1],full:false}));
      s.mush=Array.from({length:6},(_,i)=>{const h=[BASKET.x-15+(i%3)*15,BASKET.y-5+Math.floor(i/3)*9];return {x:h[0],y:h[1],home:h,done:false,back:0,flip:0,dry:0}})}
    else{s.ph="chop";s.cuts=CUTX.map(()=>({done:false,k:0,fall:0}));s.dish=DISHES.map((n,i)=>({i,x:HOME[i][0],y:HOME[i][1],home:HOME[i],done:false,back:0,gl:0}))}}
  MINI.kitchen={
    who:"dogen",title:"The Tenzo’s Kitchen",land:"l3",
    setup:["An old cook in China once taught me that this work is the practice, not a delay before it.","Slowly now. There’s nowhere else to be."],
    how:"Drag slowly and steadily. Rushing spills things.",
    win:"It’s only rice and greens. It’s also everything.",
    walk:"Take the ladle. Use it tomorrow, the same way.",
    stages:["Dawn: The Rice","Noon: The Mushrooms","Evening: The Meal"],
    lines:[null,null,"Evening already. Set each bowl down as if it mattered. It does."],
    pad:true,ab:false,limit:0,long:true,bloomT:3.2,nofl:true,
    init(s){Object.assign(s,{st:0,stT:0,h:{x:96,y:200,sp:0,on:false,pad:false},cx:96,cy:200,P:pfx(),spill:0,floor:[],hurried:0,rushed:0,crooked:0,said:[],tenzoT:0,swirl:0,stirT:0,splashT:0,dt:.05,wasOn:false,bowT:0});setup(s,0)},
    toStage(s,n){this.init(s);if(n>=1){stageUp(s,n);setup(s,n)}},
    step(s,dt,inp){s.dt=dt;s.stT+=dt;s.inp=inp;const h=hand(s,inp,dt);
      s.hint2=Math.max(0,s.hint2-dt);s.hint3=Math.max(0,s.hint3-dt);s.tenzoT=Math.max(0,s.tenzoT-dt);
      if(s.st===0){
        if(s.ph==="stir"){stir(s,h,dt);if(s.att>=1){s.ph="sift";s.phK=0;sfx("chime")}}
        else{s.phK=Math.min(1,s.phK+dt*1.4);if(s.phK>=1)sift(s,h);
          for(const g of s.grit){if(g.hop>0){g.hop=Math.max(0,g.hop-dt);if(!g.hop){g.x=g.nx;g.y=g.ny}}if(g.out&&g.fly<1)g.fly=Math.min(1,g.fly+dt*1.8)}
          if(s.grit.every(g=>g.out&&g.fly>=1)){s.adv+=dt;if(s.adv>=.9){stageUp(s);setup(s,1)}}}
        if(!s.rm&&Math.random()<dt*3)steam(s,38,140,1,6)}
      else if(s.st===1){
        carry(s,h,s.mush,dt,m=>{const p=nearestFree(s.slots,m.x,m.y,SNAP);return p?[p.x,p.y]:null},m=>{const p=nearestFree(s.slots,m.x,m.y,1);if(p)p.full=true;s.laid++;sfx("lay");
          if(s.laid===2){s.tenzoT=3.5;say(s,TENZO[0],TNAME)}else if(s.laid===4){s.tenzoT=3.5;say(s,TENZO[1],TNAME)}});   /* he pauses, hand raised, to answer */
        homeward(s.mush,dt);for(const m of s.mush)if(m.done)m.dry=Math.min(1,m.dry+dt/7);
        if(s.laid>=6){s.adv+=dt;if(s.adv>=1.4){stageUp(s);setup(s,2)}}}
      else{
        if(s.ph==="chop"){chop(s,h,dt);for(const c of s.cuts)if(c.done)c.fall=Math.min(1,c.fall+dt*2);if(s.cuts.every(c=>c.done&&c.fall>=1)){s.ph="chopdone";s.phK=0}}
        else if(s.ph==="chopdone"){s.phK=Math.min(1,s.phK+dt*1.2);if(s.phK>=1){s.ph="bowls";s.held=null}}
        else if(s.ph==="bowls"){carry(s,h,s.dish,dt,d=>d2(d.x,d.y,PLACE[d.i][0],PLACE[d.i][1])<SNAP?PLACE[d.i]:null,d=>{d.gl=1;sfx("bowl");if(d.i===1||d.i===4)steam(s,d.x,d.y-6,3,3)});
          homeward(s.dish,dt);if(s.dish.every(d=>d.done)){s.ph="done";s.bowT=0;sfx("chime")}}
        else if(s.ph==="done"){s.bowT+=dt;if(s.bowT>=2)return "win"}
        for(const d of s.dish)if(d.gl>0)d.gl=Math.max(0,d.gl-dt*.6);
        if(!s.rm&&Math.random()<dt*2.5){steam(s,38,140,1,6);for(const d of s.dish)if(d.done&&(d.i===1||d.i===4||d.i===0))steam(s,d.x,d.y-6,1,2)}}
      s.wasOn=h.on&&!h.pad;
      // grains that land on the floor stay
      for(const p of s.P.list)if(p.k==="grain"&&p.vy>0&&p.y>=p.land){p.t=p.life;if(s.floor.length<80)s.floor.push([hs(p.x),hs(p.land)])}
      pStep(s.P,dt,s.rm)},
    draw(s,c,t){drawBg(c,s,s.st);
      if(s.st===0)stage1(c,s,t);else if(s.st===1)stage2(c,s,t);else stage3(c,s,t);
      if(s.st===0)dogen(c,s,t,14,220);else if(s.st===1){dogen(c,s,t,22,146);tenzo(c,s,t)}else dogen(c,s,t,162,212,s.ph==="done");
      for(const p of s.P.list){const k=p.t/p.life,a=(1-k);if(p.k==="grain"){c.globalAlpha=1;px(c,p.x,p.y,p.s,p.s*.5,p.col)}else if(p.k==="sliver"){c.save();c.globalAlpha=a;c.translate(p.x,p.y);c.rotate(p.r||0);c.fillStyle=p.col;c.beginPath();c.moveTo(-3,-2);c.lineTo(3,-1);c.lineTo(1,2);c.closePath();c.fill();c.restore()}}
      c.globalAlpha=1;pDraw(c,{list:s.P.list.filter(p=>p.k!=="grain"&&p.k!=="sliver")},ID);
      lightLayer(c,s,t);vignette(c,.2);hud(c,s,t)},
    bloom(s,c,k,t){ /* the meal steams quietly in the evening light, the kitchen settles, and the ladle rests on the tray */
      if(!s._bm){s._bm=1;s.P=pfx();if(!s.dish)s.dish=DISHES.map((n,i)=>({i,home:HOME[i],back:0,gl:0}));for(const d of s.dish){d.done=true;d.x=PLACE[d.i][0];d.y=PLACE[d.i][1]}}
      drawBg(c,s,2);grade(c,"rgba(20,12,30,1)",.18*clamp(k/.7,0,1));
      piece(c,"tray",TRAY3.x,TRAY3.y,{ax:.5,ay:.5,sc:1.6,sm:true},()=>px(c,TRAY3.x-50,TRAY3.y-22,100,44,"#5A3420"));
      for(const d of s.dish)piece(c,DISHES[d.i],d.x,d.y,{ax:.5,ay:.6,sc:1.5,sm:true});
      const la=s.rm?1:E.out(clamp((k-.15)/.5,0,1));piece(c,"ladle",lerp(164,128,la),lerp(224,214,la),{ax:.5,ay:.5,sc:1.4,rot:lerp(.9,.25,la),sm:true});
      dogen(c,s,t,162,212,true);
      if(!s.rm){if(Math.random()<.5)for(const i of [0,1,4]){const d=s.dish[i];steam(s,d.x,d.y-6,1,2)}pStep(s.P,1/60,false)}
      else if(!s.P.list.length)for(const i of [0,1,4]){const d=s.dish[i];for(let j=0;j<3;j++)pAdd(s.P,{k:"glow",x:d.x+rnd(-2,2),y:d.y-10-j*7,vx:0,vy:0,life:99,fade:false,col:"rgba(235,235,245,.6)",s:4,a:.3})}
      pDraw(c,s.P,ID);
      glow(c,34,58,30,"rgba(255,180,90,.95)",.5);glow(c,94,86,24,"rgba(255,180,90,.95)",.42);glow(c,TRAY3.x,TRAY3.y,58,"rgba(255,200,120,.9)",.22*clamp(k/.4,0,1));vignette(c,.24+.1*k)},
    _t:{FAST,SLOW,CALM,WOB,ATT,BOWL,SIEVE,SLOTS,CUTX,CUT0,CUTL,PLACE,HOME,DISHES,TENZO,setup,bgOf:s=>s.st},   /* tests only */
    shotReady:s=>s.st===0?s.ph==="sift"&&s.phK>=1&&s.grit.filter(g=>g.out).length>=2:s.st===1?s.laid>=3&&!!s.held:s.ph==="bowls"&&s.dish.filter(d=>d.done).length>=2&&!!s.held,   /* tests only */
    auto(s,inp){ /* tests only: a patient cook. Stirs at a steady 48 units/s, taps grit a second apart, carries things at 55 units/s. */
      const dt=s.dt||.05,at=(x,y)=>{inp.down={x,y}},go=(tx,ty,v)=>{const p=s._ap||{x:s.h.x,y:s.h.y},dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy),st=Math.min(d,v*dt);const q={x:p.x+(d?dx/d*st:0),y:p.y+(d?dy/d*st:0)};s._ap=q;at(q.x,q.y);return d<=v*dt+.01};
      if(s._ast!==s.st+s.ph){s._ast=s.st+s.ph;s._ap=null;s._aw=0;s._ag=null}
      s._aw=Math.max(0,(s._aw||0)-dt);
      if(s.st===0){if(s.ph==="stir"){s._aa=(s._aa||0)+dt*48/18;at(BOWL.x+Math.cos(s._aa)*18,BOWL.y-3+Math.sin(s._aa)*13)}
        else if(s.phK>=1&&!s._aw){const g=s.grit.find(g=>!g.out&&!g.hop);if(g){inp.taps=[{x:g.x,y:g.y}];inp.tap=inp.taps[0];s._aw=1}}return}
      if(s.st===1||(s.st===2&&s.ph==="bowls")){if(s._aw)return;const list=s.st===1?s.mush:s.dish;
        if(!s.held){const m=list.find(m=>!m.done&&!m.back);if(!m)return;if(s._ag!=="press"){s._ag="press";s._ap={x:m.x,y:m.y};return}at(m.x,m.y);s._ag="wait";return}
        const m=s.held,tg=s.st===1?(()=>{const p=s.slots.find(p=>!p.full);return p?[p.x,p.y]:[m.x,m.y]})():PLACE[m.i];
        if(go(tg[0],tg[1],55)){s._ag=null;s._aw=.15;inp.down=null}return}
      if(s.st===2&&s.ph==="chop"){if(s._aw)return;const i=s.cuts.findIndex(c=>!c.done);if(i<0)return;
        if(!s.stroke&&!s._ag){s._ap={x:CUTX[i],y:CUT0};at(CUTX[i],CUT0);s._ag="cut";return}
        if(go(CUTX[i],CUT0+CUTL+2,40)){s._ag=null;s._aw=.3;inp.down=null}}}
  };
  /* Phase 36-B: when the game closes the page calls release() to drop what the game cached from its art (held() counts it; the kit checks it is 0 after a close) */
  MINI[ID].release=function(){for(const k in SIL)delete SIL[k]};MINI[ID].held=function(){return Object.keys(SIL).length};
})();
/* GAME:kitchen:END */

/* GAME:butterfly:BEGIN */
/* ---- Phase 33C: Butterfly Dream, developed — Zhuangzi's "A Butterfly" ----
   Idea check: playing this, you feel that each form sees its own world, both equally real, and that the way through needs both, so you hold "who you really are" a little more loosely.
   That is Zhuangzi's butterfly dream (Zhuangzi ch. 2), and his delight in how things change into one another.
   Stages: I · Two Worlds (a hedge only the butterfly clears, a lever only the Wanderer pulls, a river crossed on a flower bridge that exists only in the dream) →
   II · Wind and Stone (fly over the gap, become the Wanderer in mid-air to drop onto the stone and pull its lever; the wind terrace pushes butterflies back, stones don't care) →
     II, room 2: the same room mirrored left to right, its terrace reaching into the gap as a stone pier under the wind; drop onto the pier in mid-air too, and walk it through the wind →
   III · The River Hao (a third form, the fish, swims under the plank bridge and through the water gate into the old tree's garden; at the tree a card asks which one was dreaming, and both answers win).
   Rooms: 12 x 15 cells of 16 units from y OY, drawn with the Level III tileset at 2x. The bottom 70 units stay clear for the pad and A/B.
   Cells: # wall (blocks all) · . grass · h low hedge (butterfly flies over) · ~ water (fish only) · f flower bridge (dream world: butterfly; otherwise water) · B plank bridge (Wanderer's world: walk over; fish swims under)
   · _ gap (butterfly flies over) · o stone in the gap · L lever (Wanderer, A) · G gate (opened by the room's lever) · W water gate (fish, once the lever is pulled) · T exit / the old tree.
   Worlds: the Wanderer's is ink and jade (planks, levers); the butterfly's is gold and rose (flower bridges, open sky over hedges, gust spirits); the fish's is clear water and dim land.
   Switching (B): Wanderer -> butterfly -> (fish, only in III and only at the water) -> Wanderer. A switch is refused, gently, where the new form couldn't be (the Wanderer over the open gap).
   A ripple spreads the new world out from you (a crossfade with Reduce Motion). Wind: gust areas push the butterfly back; s.gustT counts seconds blown (lanterns: under 3 s, or never). */
(function(){
  const ID="butterfly";
  const TS=16,OY=6,NC=12,NR=15,R=4,SPD={wanderer:52,butterfly:56,fish:62},GUSTV=44,RIPT=.7;
  const ROOMS=[
    {map:["########TT##","#....~~....#","#....ff....#","#....~~....#","#....~~....#","##GG########","#..........#","#...L......#","#..........#","#..........#","#hhhhhhhhhh#","#..........#","#..........#","#..........#","############"],
     start:[2,13],gust:[[6,9,9,11]],arch:[8,0]},
    {map:["####TT######","#..........#","#..........#","#hhhhhhhhhh#","#####GG#####","#..........#","#..........#","#..........#","#..........#","#__________#","#____oL____#","#__________#","#..........#","#..........#","############"],
     start:[2,13],gust:[[1,5,10,7]],arch:[4,0],next:3},
    {map:["############","#..........#","#....TT....#","#...~~~~...#","#...~~~~...#","######W#####","#.....~~...#","#.....~~...#","#.....~~.L.#","#.....BB...#","#.....~~...#","#hhhhh~~...#","#.....~~...#","#.....~~...#","############"],
     start:[2,13],gust:[[3,10,5,12]],tree:[96,52]},
    {map:["######TT####","#..........#","#hhhhhhhhhh#","#####GG#####","#..........#","#..........#","#_oo_______#","#_oo_______#","#_oo_______#","#__________#","#____Lo____#","#__________#","#..........#","#..........#","############"],
     start:[9,13],gust:[[1,4,10,7]],arch:[6,0]}];   /* II, room 2 (Phase 42B) */
  const STG=[0,1,2,1],RI=s=>s.r2&&s.st===1?3:s.st,XFT=.5;   /* the stage of each room; the room you are in; the move into room 2 (s) */
  const WET="~fBW";
  const DECOR=[[["rock_small",30,104],["stone_lantern_tall",150,92],["pot",152,200],["bush",160,232],["rock",20,152]],
    [["stone_lantern_tall",20,8],["rock_pile",150,28],["rock",30,212],["bush",160,196],["rock_small",150,124]],
    [["stone_lantern_tall",26,10],["lotus",86,62],["lotus",110,74],["rock_small",150,100],["bamboo",148,186],["rock",28,140]],
    [["stone_lantern_tall",154,2],["rock_pile",17,28],["rock",147,212],["bush",17,196],["rock_small",162,78]]];
  const cx=c=>c*TS+8,cy=r=>OY+r*TS+8;
  const px=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(hs(x),hs(y),w,h)};
  const rnd=(a,b)=>a+Math.random()*(b-a);
  const cell=(s,x,y)=>{const gx=Math.floor(x/TS),gy=Math.floor((y-OY)/TS);if(gx<0||gx>=NC||gy<0||gy>=NR)return "#";return ROOMS[RI(s)].map[gy][gx]};
  /* ---- the rules: what each form can pass ---- */
  function pass(form,ch,s){
    if(form==="fish")return ch==="~"||ch==="f"||ch==="B"||(ch==="W"&&s.lever);
    if(ch==="."||ch==="T"||ch==="L"||ch==="o")return true;
    if(ch==="G")return !!s.lever;
    if(form==="wanderer")return ch==="B";
    return ch==="h"||ch==="_"||ch==="f"}   /* the butterfly */
  function canStand(s,form,x,y){const r=form==="fish"?3:R;for(const o of [[-r,-r],[r,-r],[-r,r],[r,r]])if(!pass(form,cell(s,x+o[0],y+o[1]),s))return false;return true}
  function gustAt(s,x,y){const gx=Math.floor(x/TS),gy=Math.floor((y-OY)/TS);for(const g of ROOMS[RI(s)].gust||[])if(gx>=g[0]&&gx<=g[2]&&gy>=g[1]&&gy<=g[3])return true;return false}
  function nearWater(s,x,y,rad){let best=null,bd=rad;for(let gy=0;gy<NR;gy++)for(let gx=0;gx<NC;gx++){const ch=ROOMS[RI(s)].map[gy][gx];if(!pass("fish",ch,s))continue;const d=Math.hypot(cx(gx)-x,cy(gy)-y);if(d<bd){bd=d;best=[cx(gx),cy(gy)]}}return best}
  function nearLand(s,x,y,rad){let best=null,bd=rad;for(let gy=0;gy<NR;gy++)for(let gx=0;gx<NC;gx++){const p=[cx(gx),cy(gy)];const d=Math.hypot(p[0]-x,p[1]-y);if(d<bd&&canStand(s,"wanderer",p[0],p[1])){bd=d;best=p}}return best}
  const NEXT={wanderer:"butterfly",butterfly:"fish",fish:"wanderer"};
  function onIsland(s,x,y){const m=ROOMS[RI(s)].map,gx=Math.floor(x/TS),gy=Math.floor((y-OY)/TS);if(!m[gy]||!"oL".includes(m[gy][gx]))return false;return [[1,0],[-1,0],[0,1],[0,-1]].some(o=>(m[gy+o[1]]||"")[gx+o[0]]==="_")}
  function swap(s){const from=s.form;let to=NEXT[from],at=[s.x,s.y];
    if(to==="fish"){const w=s.st===2?nearWater(s,s.x,s.y,22):null;if(w)at=w;else to="wanderer"}   /* the fish only in III, and only at the water */
    if(to==="wanderer"&&from==="fish"){const l=nearLand(s,s.x,s.y,26);if(!l){refuse(s);return false}at=l}
    else if(!canStand(s,to,at[0],at[1])){refuse(s);return false}
    s.form=to;s.switches++;if(to==="fish")s.fishUsed=true;
    if(from==="butterfly"&&to==="wanderer"&&onIsland(s,s.x,s.y)){s.drop=.35;s.midair++}   /* switched in mid-air over the gap: the Wanderer drops onto the stone */
    s.rip={x:s.x,y:s.y,k:0,from:WORLD[from],to:WORLD[to]};
    if(to==="fish"||from==="fish"){splash(s,at[0],at[1]);sfx("splash")}
    s.x=at[0];s.y=at[1];sfx(SWS[to]);s.hintSw=0;return true}
  function refuse(s){s.nope=.5;s.refused++;sfx("nope")}
  const WORLD={wanderer:"w",butterfly:"b",fish:"f"};
  const SWS={wanderer:"switch_walk",butterfly:"switch_fly",fish:"switch_swim"};   /* a soft shimmer for each form */
  function splash(s,x,y){for(let i=0;i<10;i++){const a=rnd(-2.8,-.3),v=rnd(14,30);pAdd(s.P,{x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:70,life:.6,col:"rgba(200,236,255,.9)",s:1})}}
  /* ---- drawing the rooms: the tile layer is cached per room and world ---- */
  const H=(a,b)=>((a*73856093)^(b*19349663))>>>0;
  function waterTile(m,gx,gy){const w=(x,y)=>x<0||x>=NC||y<0||y>=NR||WET.includes(m[y][x])||m[y][x]==="#";const n=!w(gx,gy-1),so=!w(gx,gy+1),we=!w(gx-1,gy),e=!w(gx+1,gy);
    return n&&we?"water_nw":n&&e?"water_ne":so&&we?"water_sw":so&&e?"water_se":n?"water_n":so?"water_s":we?"water_w":e?"water_e":"water_c"}
  function tiles(c,st,world){const m=ROOMS[st].map,ok=mOk("l3");
    for(let gy=0;gy<NR;gy++)for(let gx=0;gx<NC;gx++){const ch=m[gy][gx],X=gx*TS,Y=OY+gy*TS,hh=H(gx,gy+st*31);
      const grass=()=>{if(!ok||!mTile(c,"l3",(hh%11===0?"flowers_":hh%7===0?"tuft_":"grass_")+(hh%3),X,Y))px(c,X,Y,16,16,"#2E4A26")};
      if(ch==="#"){const below=gy<NR-1?m[gy+1][gx]:"#";if(!ok||!mTile(c,"l3",below==="#"||gy===NR-1?"high_c":"wallm_m",X,Y))px(c,X,Y,16,16,below==="#"?"#24331E":"#3A3448");continue}
      if(WET.includes(ch)){if(!ok||!mTile(c,"l3",waterTile(m,gx,gy),X,Y))px(c,X,Y,16,16,"#28526A");continue}
      if(ch==="_"){const up=gy>0?m[gy-1][gx]:"#";px(c,X,Y,16,16,"#08060E");if(up==="o"||up==="L"){if(!ok||!mTile(c,"l3","wall_m",X,Y-4))px(c,X,Y,16,9,"#4A4656");c.fillStyle="rgba(8,6,14,.9)";c.fillRect(X,Y+10,16,6)}
        else if(up!=="_"){if(!ok||!mTile(c,"l3","wallb_m",X,Y))px(c,X,Y,16,8,"#2A2436")}
        if(!(H(gx,gy)%3)){c.fillStyle="rgba(150,140,190,.08)";c.fillRect(X+2,Y+8+(H(gx,gy)%5),12,2)}continue}
      if(ch==="o"||(ch==="L"&&gy<NR-1&&"_".includes(m[gy+1][gx]))){px(c,X,Y,16,16,"#08060E");if(!ok||!mTile(c,"l3","pave_c",X,Y))px(c,X+1,Y+1,14,14,"#8A8890");continue}
      grass();
      if(ch==="h"){c.fillStyle="rgba(0,0,0,.3)";c.fillRect(X,Y+11,16,4);
        for(const o of [[-4,-1],[4,1]]){if(!ok||!mRect(c,"l3","bush",X+o[0]+1,Y+o[1]))px(c,X+o[0]+2,Y+2+o[1],12,12,"#2E5A2A")}
        if(world==="b"){for(let i=0;i<6;i++){const q=H(gx*7+i,gy);c.fillStyle=["#F6B0C8","#FFE0A0","#F890B0"][q%3];c.fillRect(X+1+(q%14),Y+2+((q>>>4)%9),1.5,1.5)}}}
      if(ch==="T"&&ROOMS[st].arch){if(!ok||!mTile(c,"l3","pave_c",X,Y))px(c,X,Y,16,16,"#6A6870")}}
    if(ok){const D=DECOR[st]||[];for(const d of D)mRect(c,"l3",d[0],d[1],d[2]);
      for(let gy=1;gy<NR-1;gy+=2)for(const gx of [0,NC-1]){if(m[gy][gx]==="#"){const q=H(gx,gy+st);mRect(c,"l3",q%2?"tree_round":"tree_alt",gx===0?-12:NC*TS-20,OY+gy*TS-10)}}}
    // the world's colour: the Wanderer's ink and jade, the dream's gold and rose, the fish's clear water
    c.save();
    if(world==="w"){c.globalCompositeOperation="multiply";c.fillStyle="rgba(176,206,190,1)";c.globalAlpha=.42;c.fillRect(0,0,192,320);c.globalCompositeOperation="source-over";c.fillStyle="#08140F";c.globalAlpha=.12;c.fillRect(0,0,192,320)}
    else if(world==="b"){const g=c.createLinearGradient(0,0,0,250);g.addColorStop(0,"#FFB24A");g.addColorStop(.55,"#FF9C8C");g.addColorStop(1,"#FF78B4");c.globalCompositeOperation="overlay";c.fillStyle=g;c.globalAlpha=.8;c.fillRect(0,0,192,320);
      c.globalCompositeOperation="lighter";c.fillStyle="#2E160C";c.globalAlpha=.4;c.fillRect(0,0,192,320);
      c.globalCompositeOperation="source-over";c.globalAlpha=1;const m3=ROOMS[st].map;for(let i=0;i<70;i++){const q=H(i*13,st*7+3),gx=q%NC,gy=(q>>>5)%NR;if(m3[gy][gx]!=="."&&m3[gy][gx]!=="h")continue;   /* the dream's petals and pollen */
        c.fillStyle=["rgba(255,214,150,.85)","rgba(255,170,205,.85)","rgba(255,240,210,.7)"][q%3];c.fillRect(gx*TS+((q>>>9)%15),OY+gy*TS+((q>>>13)%15),1,1)}}
    else{const m2=ROOMS[st].map;c.fillStyle="#040C16";c.globalAlpha=.55;for(let gy=0;gy<NR;gy++)for(let gx=0;gx<NC;gx++)if(!WET.includes(m2[gy][gx]))c.fillRect(gx*TS,OY+gy*TS,16,16);
      c.globalCompositeOperation="screen";c.fillStyle="#1C6A7A";c.globalAlpha=.4;for(let gy=0;gy<NR;gy++)for(let gx=0;gx<NC;gx++)if(WET.includes(m2[gy][gx]))c.fillRect(gx*TS,OY+gy*TS,16,16)}
    c.restore()}
  const CACHE={};
  function tileLayer(c,s,world){const ri=RI(s),k=ri+world;if(!mOk("l3")){tiles(c,ri,world);return}
    let cv=CACHE[k];if(!cv){for(const q in CACHE)if(STG[+q[0]]!==s.st)delete CACHE[q];cv=CACHE[k]=document.createElement("canvas");cv.width=384;cv.height=640;const q=cv.getContext("2d");q.imageSmoothingEnabled=false;q.setTransform(2,0,0,2,0,0);tiles(q,ri,world)}
    c.drawImage(cv,0,0,192,320)}
  function worldObjs(c,s,t,world){const m=ROOMS[RI(s)].map,P=s;
    for(let gy=0;gy<NR;gy++)for(let gx=0;gx<NC;gx++){const ch=m[gy][gx],X=gx*TS,Y=OY+gy*TS;
      if(ch==="B"&&world==="w"){if(!mTile(c,"l3","bridge_h",X,Y))px(c,X,Y+2,16,12,"#8A6A40")}
      else if(ch==="B"&&world==="f"){c.save();c.globalAlpha=.45;if(!mTile(c,"l3","bridge_h",X,Y))px(c,X,Y+2,16,12,"#8A6A40");c.restore()}}
    // flower bridges: only in the dream; they open as the butterfly comes near and glow under it
    if(world==="b"){const fb=flowerBridges(RI(s));for(const b of fb){const d=s.form==="butterfly"?Math.hypot(s.x-b[0],s.y-b[1]):99,on=d<18,near=d<46;
      if(!mPiece(c,ID,on?"bridge_2":near?"bridge_1":"bridge_0",b[0],b[1]+2,{ax:.5,ay:.5,sc:1.4,sm:true})){px(c,b[0]-16,b[1]-5,32,10,"#E8A0C0")}
      if(on||near)glow(c,b[0],b[1],22,"rgba(255,200,220,.9)",on?.4:.18)}}
    // the wind: streaks in every world, gust spirits only in the dream
    for(const g of ROOMS[RI(s)].gust||[]){const x0=g[0]*TS,y0=OY+g[1]*TS,w=(g[2]-g[0]+1)*TS,h=(g[3]-g[1]+1)*TS;
      if(!s.rm){c.save();c.strokeStyle=world==="b"?"rgba(255,240,250,.55)":"rgba(220,235,230,.22)";c.lineWidth=.6;
        for(let i=0;i<6;i++){const q=H(i,g[0]),u=((t/900+(q%100)/100)%1),xx=x0+(q%w),yy=y0+u*h;c.beginPath();c.moveTo(xx,yy-6);c.lineTo(xx+Math.sin(t/300+i)*1.5,yy);c.stroke()}c.restore()}
      if(world==="b"){for(let i=0;i<2;i++){const u=s.rm?.3+i*.4:((t/2600+i*.5)%1),xx=x0+w*(.25+.5*i)+(s.rm?0:Math.sin(t/700+i)*6),yy=y0+u*h;
        mPiece(c,ID,"gust_"+(s.rm?0:Math.floor(t/260+i)%2),xx,yy,{ax:.5,ay:.5,sc:1,a:s.rm?.6:Math.sin(Math.PI*u)*.8})}}}
    if(s.st===2&&(world==="f"||world==="b"||world==="w")){mPiece(c,ID,"lilypads",72,74,{ax:.5,ay:.5,sc:.9,a:world==="f"?1:.85});mPiece(c,ID,"lilypads",104,174,{ax:.5,ay:.5,sc:.6,a:world==="f"?1:.8})}}
  function flowerBridges(st){const m=ROOMS[st].map,out=[];for(let gy=0;gy<NR;gy++){let a=-1;for(let gx=0;gx<=NC;gx++){const f=gx<NC&&m[gy][gx]==="f";if(f&&a<0)a=gx;if(!f&&a>=0){out.push([(a+gx)*TS/2,cy(gy)]);a=-1}}}return out}
  function drawWorld(c,s,t,world){tileLayer(c,s,world);worldObjs(c,s,t,world)}
  function common(c,s,t){const m=ROOMS[RI(s)].map,Rm=ROOMS[RI(s)];
    for(let gy=0;gy<NR;gy++)for(let gx=0;gx<NC;gx++){const ch=m[gy][gx],X=gx*TS,Y=OY+gy*TS;
      if(ch==="G"){if(!s.lever){if(!mTile(c,"l3","fence_h",X,Y))px(c,X,Y+6,16,4,"#6A4A30");px(c,X,Y+4,16,1.5,"#5A3A24");px(c,X,Y+10,16,1.5,"#5A3A24")}else{const L=gx>0&&m[gy][gx-1]!=="G";if(L)mTile(c,"l3","fence_post",X-4,Y)||px(c,X,Y+2,2,12,"#5A3A24");else mTile(c,"l3","fence_post",X+4,Y)||px(c,X+14,Y+2,2,12,"#5A3A24")}}
      if(ch==="L"){mShadow(c,X+8,Y+14,10,.35);if(!mPiece(c,ID,s.lever?"lever_down":"lever_up",X+8,Y+14,{ax:.5,ay:1,sc:1.3,sm:true})){px(c,X+7,Y+2,2,10,s.lever?"#F5C66A":"#5A5468")}
        if(!s.lever&&s.form==="wanderer"&&Math.hypot(s.x-X-8,s.y-Y-8)<18)glow(c,X+8,Y+6,10,"rgba(255,226,150,.9)",.35+(s.rm?0:.15*Math.sin(t/250)))}
      if(ch==="W"){px(c,X-2,Y,20,5,"#4A4450");px(c,X-2,Y,20,1.5,"#6A6470");const up=s.lever?(s.wgK||0):0;for(let i=0;i<4;i++)px(c,X+1.5+i*4,Y+5,1.2,Math.max(1,10*(1-up)),"#2A2630");
        if(s.lever&&up<1&&!s.rm)glow(c,X+8,Y+8,10,"rgba(160,230,255,.9)",.2)}}
    if(Rm.arch){const X=Rm.arch[0]*TS-4,Y=OY-12;if(!mRect(c,"l3","arch",X,Y))px(c,X+4,Y+4,32,6,"#6A5A4A");glow(c,X+20,OY+8,18,"rgba(255,226,150,.9)",.25)}
    if(Rm.tree){const T=Rm.tree;glow(c,T[0],T[1]-26,40,"rgba(255,226,170,.9)",.18);mShadow(c,T[0],T[1],40,.35);
      if(!mPiece(c,ID,"tree",T[0],T[1],{ax:.5,ay:1,sc:.9,sm:true})){if(!mRect(c,"l3","butterflytree_"+(s.rm?0:Math.floor(t/260)%3),T[0]-35,T[1]-66))px(c,T[0]-24,T[1]-50,48,50,"#2A4A22")}
      mShadow(c,140,48,14,.35);if(!sprO(c,"zhuangzi_"+(s.rm?0:Math.floor(t/900)%2),132,26))px(c,135,28,10,20,"#8FAE86")}}
  const SIL={};
  function sprO(c,name,x,y){const e=ATLAS_IMG.chars,A=ATLAS.chars;if(!e||!e.ok||!A||!A.rects[name])return mSpr(c,name,x,y);const r=A.rects[name];let cv=SIL[name];
    if(!cv){cv=SIL[name]=document.createElement("canvas");cv.width=r[2];cv.height=r[3];const q=cv.getContext("2d");q.drawImage(e.img,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);q.globalCompositeOperation="source-in";q.fillStyle="#150E1C";q.fillRect(0,0,r[2],r[3])}
    c.save();c.globalAlpha=.9;for(const o of [[-1,0],[1,0],[0,-1],[0,1]])c.drawImage(cv,x+o[0],y+o[1]);c.restore();return mSpr(c,name,x,y)}
  function butterflySprite(c,x,y,t,rm,a,sc){const fl=rm?1:.25+.75*Math.abs(Math.sin(t/110));c.save();c.globalAlpha=a==null?1:a;c.translate(x,y);c.scale(fl,1);
    if(!mPiece(c,ID,"bfly_open",0,0,{ax:.5,ay:.5,sc:sc||1.6,sm:true})){c.fillStyle="#F5C66A";c.fillRect(-6,-3,5,5);c.fillRect(1,-3,5,5)}c.restore();px(c,x-.5,y-2,1,4,"#2A1A22")}
  function playerDraw(c,s,t){const x=s.x,y=s.y,f=s.form;
    if(f==="wanderer"){const d=s.drop>0?E.in(s.drop/.35)*10:0;mShadow(c,x,y+2,11-d*.4,.4);const fr=s.rm?0:(s.moving?Math.floor(t/150)%3:0);
      if(!sprO(c,"wanderer_"+s.dir+"_"+fr,hs(x-8),hs(y-20-d)))px(c,x-5,y-16-d,10,17,"#2F7470")}
    else if(f==="butterfly"){const hov=s.rm?0:Math.sin(t/260)*1.5;mShadow(c,x,y+4,7,.28);glow(c,x,y-7+hov,16,"rgba(255,226,160,.9)",.5);butterflySprite(c,x,y-7+hov,t,s.rm,1,2.4)}
    else{const under=cell(s,x,y)==="B";const ang=Math.atan2(s.fy||0,s.fx||1);c.save();c.globalAlpha=under?.45:1;
      glow(c,x,y,9,"rgba(255,200,120,.9)",under?.1:.25);if(!mPiece(c,ID,"fish_0",x,y,{ax:.5,ay:.5,sc:1.6,rot:ang,flip:Math.cos(ang)<0&&false,sm:true}))px(c,x-5,y-2,10,4,"#E8A040");c.restore();
      if(!s.rm&&Math.random()<.08)pAdd(s.P,{x:x-Math.cos(ang)*5,y:y-Math.sin(ang)*5,vx:0,vy:-3,life:.6,col:"rgba(220,245,255,.7)",s:.8})}
    if(s.nope>0){c.save();c.globalAlpha=s.nope*1.6;c.strokeStyle="#FFE9B8";c.lineWidth=.8;c.beginPath();c.arc(x,y-6,6+(1-s.nope/.5)*4,0,7);c.stroke();c.restore()}}
  function mist(c,s,t){if(s.rm)return;for(let i=0;i<5;i++){const sp=i<3?6:11,xx=((t/1000*sp+i*61)%260)-34,yy=OY+30+i*44+Math.sin(t/3000+i)*6;glow(c,xx,yy,26+i*4,"rgba(220,226,240,.9)",.06)}}
  function pill(c,txt,cx_,bottom,maxw,a){c.save();c.font='9px "IM Fell English SC",Georgia,serif';const words=txt.split(" "),ls=[];let cur="";
    for(const w of words){const n=cur?cur+" "+w:w;if(cur&&c.measureText(n).width>maxw){ls.push(cur);cur=w}else cur=n}ls.push(cur);
    const w=Math.max(...ls.map(l=>c.measureText(l).width))+12,h=ls.length*10+4,x=cx_-w/2,y=bottom-h;c.restore();
    c.save();c.globalAlpha=a==null?1:a;c.fillStyle="rgba(14,10,24,.82)";c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,5);else c.rect(x,y,w,h);c.fill();c.strokeStyle="rgba(245,198,106,.4)";c.lineWidth=.8;c.stroke();
    ls.forEach((l,i)=>mText(c,l,cx_,y+2+10*i+5,9,"#FFE9B8"));c.restore();return [x,y,w,h]}
  /* the card at the old tree: two answers, A and B, and both are true */
  const Q="Were you the Wanderer dreaming of a butterfly, or a butterfly dreaming of the Wanderer?";
  const ANS=[[18,150,74,26,"wanderer","A · The Wanderer"],[100,150,74,26,"butterfly","B · The butterfly"]];
  function cardDraw(c,s,t){const k=s.rm?1:E.out(clamp(s.askT/.5,0,1));c.save();c.globalAlpha=k;c.fillStyle="rgba(10,8,20,.55)";c.fillRect(0,0,192,320);
    c.fillStyle="rgba(20,14,32,.94)";c.beginPath();if(c.roundRect)c.roundRect(10,78,172,108,8);else c.rect(10,78,172,108);c.fill();c.strokeStyle="#D9A93A";c.lineWidth=1;c.stroke();
    c.font='9px "IM Fell English SC",Georgia,serif';const words=Q.split(" "),ls=[];let cur="";for(const w of words){const n=cur?cur+" "+w:w;if(cur&&c.measureText(n).width>150){ls.push(cur);cur=w}else cur=n}ls.push(cur);
    ls.forEach((l,i)=>mText(c,l,96,94+11*i,9,"#FFE9B8"));
    for(const a of ANS){const on=s.answer===a[4];c.fillStyle=on?"rgba(217,169,58,.5)":"rgba(60,44,80,.9)";c.beginPath();if(c.roundRect)c.roundRect(a[0],a[1],a[2],a[3],6);else c.rect(a[0],a[1],a[2],a[3]);c.fill();
      c.strokeStyle="#F5C66A";c.lineWidth=.8;c.stroke();mText(c,a[5],a[0]+a[2]/2,a[1]+a[3]/2,8,"#FFF1C8")}
    c.restore()}
  function hints(c,s,t){let h=null;const b=s.bump;
    if(s.asking||s.adv>0||s.xf)return;
    if(s.st===0&&s.switches===0&&s.stT>1.2)h="B changes who you are";
    else if(s.form==="wanderer"&&b.h>.35)h="Only the butterfly clears the hedge";
    else if(s.form==="butterfly"&&s.nearLever&&!s.lever)h="Only the Wanderer can pull a lever";
    else if(s.form==="wanderer"&&s.nearLever&&!s.lever)h="Press A to pull the lever";
    else if(s.st===0&&s.form==="butterfly"&&b["~"]>.35)h="The butterfly crosses water on flowers";
    else if(s.st===0&&s.form==="wanderer"&&b["~"]>.5)h="In the dream, flowers bridge the water";
    else if(s.st===1&&s.form==="wanderer"&&b._>.35)h="Fly over. Become the Wanderer on the stone";
    else if(s.st===1&&s.form==="butterfly"&&s.refused>s._ref0&&s.nope>0)h="The Wanderer needs a stone to land on";
    else if(s.st===2&&s.form!=="fish"&&!s.fishUsed&&s.lever&&nearWater(s,s.x,s.y,22))h="At the water, B becomes a fish";
    else if(s.st===2&&s.form==="fish"&&!s.lever&&b.W>.3)h="The water gate is shut";
    else if(s.st===2&&s.form==="fish"&&s.lever&&s.stT-s.fishT<4)h="Swim under the bridge, through the gate";
    if(h)pill(c,h,96,246,170)}
  /* ---- stages ---- */
  function setup(s,n,r2){s.st=n;s.r2=!!r2;s.xf=null;const Rm=ROOMS[RI(s)];s.stT=0;s.x=cx(Rm.start[0]);s.y=cy(Rm.start[1]);s.form="wanderer";s.lever=false;s.wgK=0;s.adv=0;s.drop=0;s.rip=null;s.asking=false;s.askT=0;s.answer=null;s.bump={};s.dir="up";s._ref0=s.refused;s.fishT=0;s.nearLever=false}
  function scene(c,s,t,fl){
      const cur=WORLD[s.form];
      if(s.rip){const k=s.rip.k;if(s.rm){drawWorld(c,s,t,s.rip.from);c.save();c.globalAlpha=E.inOut(k);drawWorld(c,s,t,s.rip.to);c.restore()}
        else{drawWorld(c,s,t,s.rip.from);const r=E.out(k)*230;c.save();c.beginPath();c.arc(s.rip.x,s.rip.y,r,0,7);c.clip();drawWorld(c,s,t,s.rip.to);c.restore();
          c.save();c.globalAlpha=(1-k)*.8;c.strokeStyle=s.rip.to==="b"?"#FFD0E0":s.rip.to==="f"?"#A8E8FF":"#C8E8D0";c.lineWidth=1.2;c.beginPath();c.arc(s.rip.x,s.rip.y,r,0,7);c.stroke();c.restore()}}
      else drawWorld(c,s,t,cur);
      if(fl)floor(c);
      common(c,s,t);playerDraw(c,s,t)}
  function floor(c){const g=c.createLinearGradient(0,OY+NR*TS,0,320);g.addColorStop(0,"#12201A");g.addColorStop(1,"#0C0A14");c.fillStyle=g;c.fillRect(0,OY+NR*TS,192,320)}   /* the floor below the room */
  function oldRoom(c,s,t){const r2=s.r2,lv=s.lever;s.r2=s.xf.from===3;s.lever=true;drawWorld(c,s,t,s.xf.w);common(c,s,t);s.r2=r2;s.lever=lv}   /* the room you just left, its lever pulled */
  MINI.butterfly={
    who:"zhuangzi",title:"Butterfly Dream",land:"l3",
    setup:["Close your eyes. Open them.","Which one of you is walking?"],
    how:"Move with the pad. B changes who you are.",
    win:"Either answer is fine. Just hold it a little more loosely.",
    walk:"Take the butterfly with you. Gently.",
    stages:["Two Worlds","Wind and Stone","The River Hao"],
    lines:[null,"The wind loves butterflies. Stones don’t care about them at all.","A friend once asked how I could know the fish were happy. Go and see."],
    pad:true,ab:true,limit:0,long:true,bloomT:3.4,
    fl:["Reach the old tree","Spend under 3 seconds blown by the wind","Never once get blown by the wind"],
    flNext:["Next time, try crossing the windy terrace as the Wanderer, and only becoming the butterfly again past the wind.","Next time, try never being the butterfly where the wind blows."],
    rate:s=>(s.gustT||0)<.05?3:(s.gustT||0)<3?2:1,
    init(s){Object.assign(s,{st:0,stT:0,gustT:0,switches:0,refused:0,midair:0,fishUsed:false,P:pfx(),nope:0,moving:false,dt:.05,fx:1,fy:0});setup(s,0)},
    toStage(s,n){this.init(s);if(n>=1){stageUp(s,n);setup(s,n)}},
    step(s,dt,inp){s.dt=dt;s.stT+=dt;s.nope=Math.max(0,s.nope-dt);s.drop=Math.max(0,s.drop-dt);
      if(s.rip){s.rip.k+=dt/RIPT;if(s.rip.k>=1)s.rip=null}
      if(s.lever&&s.wgK<1)s.wgK=Math.min(1,s.wgK+dt*1.5);
      if(s.xf){s.xf.k+=dt/XFT;if(s.xf.k>=1)s.xf=null;pStep(s.P,dt,s.rm);return}
      if(s.adv>0){s.adv+=dt;if(s.adv>=.8){stageUp(s);setup(s,s.st)}pStep(s.P,dt,s.rm);return}
      if(s.asking){s.askT+=dt;if(s.answer){s.ansT+=dt;if(s.ansT>=.6)return "win";pStep(s.P,dt,s.rm);return}
        let pick=null;if(s.askT>.4){if(inp.aTap)pick="wanderer";else if(inp.bTap)pick="butterfly";
          for(const tp of inp.taps||[])for(const a of ANS)if(tp.x>=a[0]-4&&tp.x<=a[0]+a[2]+4&&tp.y>=a[1]-4&&tp.y<=a[1]+a[3]+4)pick=a[4]}
        if(pick){s.answer=pick;s.ansT=0;sfx("chime")}pStep(s.P,dt,s.rm);return}
      if(inp.bTap)swap(s);
      // A: the lever (the Wanderer, standing at it), or a tap on the lever itself
      const Lc=leverCell(s);s.nearLever=!!Lc&&Math.hypot(s.x-cx(Lc[0]),s.y-cy(Lc[1]))<18;
      let pull=inp.aTap;for(const tp of inp.taps||[])if(Lc&&Math.hypot(tp.x-cx(Lc[0]),tp.y-cy(Lc[1]))<14)pull=true;
      if(pull&&s.nearLever&&!s.lever&&s.form==="wanderer"){s.lever=true;sfx("lever");pSparks(s.P,cx(Lc[0]),cy(Lc[1])-4,8,"#F5C66A",30)}
      // moving
      const mx=clamp(inp.dx||0,-1,1),my=clamp(inp.dy||0,-1,1),n=Math.hypot(mx,my)||1,v=SPD[s.form]*(s.drop>0?0:1);
      if(mx)s.dir=mx<0?"left":"right";else if(my)s.dir=my<0?"up":"down";s.moving=!!(mx||my);
      if(s.moving){s.fx=mx/n;s.fy=my/n}
      const inGust=s.form==="butterfly"&&gustAt(s,s.x,s.y);if(inGust){s.gustT+=dt;if(!s.rm&&Math.random()<dt*6)pAdd(s.P,{k:"line",x:s.x+rnd(-8,8),y:s.y-10,vx:0,vy:60,life:.4,col:"rgba(255,245,250,.6)",w:.5})}
      const wob=s.form==="butterfly"&&!s.rm?Math.sin(s.stT*7)*6:0;
      const vx=mx/n*v+(s.form==="butterfly"&&s.moving?wob*.3:0),vy=my/n*v+(inGust?GUSTV:0);
      const nx=clamp(s.x+vx*dt,4,188);if(canStand(s,s.form,nx,s.y))s.x=nx;else if(mx)bump(s,nx,s.y,dt);
      const ny=clamp(s.y+vy*dt,OY+4,OY+NR*TS-4);if(canStand(s,s.form,s.x,ny))s.y=ny;else if(my)bump(s,s.x,ny,dt);
      for(const k in s.bump)if(!s._bumped||!s._bumped[k])s.bump[k]=Math.max(0,s.bump[k]-dt*.5);s._bumped=null;
      if(s.form==="fish"&&!s.fishT)s.fishT=s.stT;
      // reaching the exit, or the old tree
      const here=cell(s,s.x,s.y-(s.form==="butterfly"?2:0));
      if(here==="T"&&s.form!=="fish"){if(s.st<2){const nx=ROOMS[RI(s)].next;if(nx){const from=RI(s),w=WORLD[s.form];setup(s,s.st,true);s.xf={from,k:0,w};sfx("open")}else{s.adv=.001;sfx("open")}}else{s.asking=true;s.askT=0;sfx("bloom")}}
      if(!s.rm&&Math.random()<dt*.8)pFireflies(s.P,rnd(10,180),rnd(OY+20,OY+220),1,6);
      pStep(s.P,dt,s.rm)},
    draw(s,c,t){c.fillStyle="#0C0A14";c.fillRect(0,0,192,320);
      if(s.xf){const k=E.inOut(clamp(s.xf.k,0,1)),Hh=OY+NR*TS;c.save();c.beginPath();c.rect(0,0,192,Hh);c.clip();   /* into room 2: the rooms slide down (a crossfade with Reduce Motion) */
        if(s.rm){scene(c,s,t);c.globalAlpha=1-k;oldRoom(c,s,t)}else{c.translate(0,hs(k*Hh));oldRoom(c,s,t);c.translate(0,-Hh);scene(c,s,t)}c.restore();floor(c)}
      else scene(c,s,t,1);
      pDraw(c,s.P,ID);mist(c,s,t);vignette(c,.2);
      if(s.asking)cardDraw(c,s,t);else hints(c,s,t)},
    bloom(s,c,k,t){ /* the old tree bursts into luminous butterflies, a fish leaps, and the two worlds' colours blend into one */
      const fl=s._fl||1;if(!s._bm){s._bm=1;s.P=pfx();s._bp=0;if(s.st!==2)setup(s,2);s.form="wanderer";s.asking=false;s.x=cx(5);s.y=cy(2)+4;s.dir="up"}
      drawWorld(c,s,t,"w");c.save();c.globalAlpha=(s.rm?.5:.5+.3*Math.sin(t/700))*clamp(k/.4,0,1);drawWorld(c,s,t,"b");c.restore();
      common(c,s,t);const T=ROOMS[2].tree;glow(c,T[0],T[1]-28,60,"rgba(255,220,160,.95)",(.3+.1*fl)*clamp(k/.3,0,1));
      // the fish leaps from the pond
      const u=s.rm?.5:clamp((k-.2)/.5,0,1);if(u>0&&u<1||s.rm){const fx=lerp(70,116,u),fy=78-Math.sin(Math.PI*u)*26;mPiece(c,ID,"fish_1",fx,fy,{ax:.5,ay:.5,sc:1.8,rot:lerp(-.9,.9,u),sm:true});if(!s.rm&&u>.95)splash(s,116,78)}
      const want=Math.floor((8+6*fl)*clamp(k/.6,0,1));
      if(!s.rm){while(s._bp<want){s._bp++;const a=rnd(0,6.283);pAdd(s.P,{k:"bf",x:T[0]+rnd(-18,18),y:T[1]-rnd(20,46),vx:Math.cos(a)*rnd(8,22),vy:-rnd(8,20),life:rnd(2.4,3.6),fin:.3,ph:rnd(0,9),wob:2})}pStep(s.P,1/60,false)}
      else if(!s.P.list.length)for(let i=0;i<8+fl*3;i++)pAdd(s.P,{k:"bf",x:T[0]+rnd(-50,50),y:T[1]-rnd(10,60),vx:0,vy:0,life:99,fade:false,ph:i});
      for(const p of s.P.list){if(p.k!=="bf")continue;const a=p.fade===false?1:Math.min(1,p.t/.3)*(1-Math.max(0,(p.t/p.life-.7)/.3));glow(c,p.x,p.y,7,"rgba(255,226,160,.9)",.4*a);butterflySprite(c,p.x,p.y,t+p.ph*300,s.rm,a,1.3)}
      pDraw(c,{list:s.P.list.filter(p=>p.k!=="bf")},ID);
      sprO(c,"wanderer_up_0",hs(s.x-8),hs(s.y-20));vignette(c,.22)},
    _t:{ROOMS,RI,STG,pass,canStand,swap,setup,cell,cx,cy,gustAt,nearWater,nearLand,flowerBridges,WORLD,ANS,TS,OY,GUSTV},   /* tests only */
    shotReady:s=>s.st===0?s.form==="butterfly"&&s.y<cy(4):s.st===1?s.lever&&s.form==="wanderer"&&cell(s,s.x,s.y)!=="o"&&s.y<cy(8):s.form==="fish"&&s.y<cy(9),   /* tests only */
    auto(s,inp){ /* tests only: a calm traveller who never flies where the wind blows */
      if(s.asking){if(s.askT>.5&&!s.answer)inp.aTap=true;return}
      const ri=RI(s),P=PLAN[ri];if(s._ast!==ri){s._ast=ri;s._wi=0;s._aw=0}
      s._aw=Math.max(0,s._aw-(s.dt||.05));if(s._aw>0)return;
      const w=P[s._wi];if(!w)return;
      if(w.sw){if(s.form===w.sw){s._wi++;return}inp.bTap=true;s._aw=.25;return}
      if(w.a){inp.aTap=true;s._wi++;s._aw=.2;return}
      const dx=w.x-s.x,dy=w.y-s.y,d=Math.hypot(dx,dy);if(d<2.5){s._wi++;return}inp.dx=dx/d;inp.dy=dy/d}
  };
  function leverCell(s){const m=ROOMS[RI(s)].map;for(let gy=0;gy<NR;gy++){const gx=m[gy].indexOf("L");if(gx>=0)return [gx,gy]}return null}
  function bump(s,x,y,dt){const ch=cell(s,x,y);s.bump[ch]=(s.bump[ch]||0)+dt*1.5;(s._bumped||(s._bumped={}))[ch]=1}
  const W_=(c,r)=>({x:cx(c),y:cy(r)});
  const PLAN=[
    [W_(2,11),{sw:"butterfly"},W_(2,9),{sw:"wanderer"},{x:cx(4),y:cy(8)},W_(4,7),{a:1},{x:48,y:cy(7)},{x:48,y:cy(4)},W_(4,2),{sw:"butterfly"},W_(7,2),{x:144,y:cy(1)},{x:144,y:cy(0)}],
    [{x:96,y:cy(12)},{sw:"butterfly"},{x:96,y:cy(10)},{sw:"wanderer"},{x:104,y:cy(10)},{a:1},{sw:"butterfly"},{x:96,y:cy(8)},{sw:"wanderer"},{x:96,y:cy(4)},{sw:"butterfly"},{x:96,y:cy(2)},{x:80,y:cy(1)},{x:80,y:cy(0)}],
    [W_(2,12),{sw:"butterfly"},W_(2,10),{sw:"wanderer"},{x:cx(5),y:cy(10)},{x:cx(5),y:cy(9)},{x:cx(9),y:cy(9)},W_(9,8),{a:1},W_(8,8),W_(8,7),{sw:"butterfly"},{sw:"fish"},{x:cx(7),y:cy(6)},{x:cx(6),y:cy(6)},{x:cx(6),y:cy(4)},{x:cx(6),y:cy(3)},{sw:"wanderer"},{x:96,y:cy(2)}],
    [{x:96,y:cy(12)},{sw:"butterfly"},{x:96,y:cy(10)},{sw:"wanderer"},{x:88,y:cy(10)},{a:1},{sw:"butterfly"},{x:48,y:cy(8)+2},{sw:"wanderer"},{x:48,y:cy(5)},{x:96,y:cy(5)},{x:96,y:cy(3)},{sw:"butterfly"},{x:96,y:cy(1)},{x:112,y:cy(1)},{x:112,y:cy(0)}]];   /* II, room 2: two drops in mid-air, never blown */
  /* Phase 36-B: when the game closes the page calls release() to drop what the game cached from its art (held() counts it; the kit checks it is 0 after a close) */
  MINI[ID].release=function(){for(const k in CACHE)delete CACHE[k];for(const k in SIL)delete SIL[k]};MINI[ID].held=function(){return Object.keys(CACHE).length+Object.keys(SIL).length};
})();
/* GAME:butterfly:END */

MINI_LOADED.l3=true;
