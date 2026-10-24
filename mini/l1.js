/* The Examined Life: Level I mini-games (the Stormcliffs). Loaded after the page's main script (Phase 29).
   Phases 30-31 rebuilt all five in the lantern-lit diorama look: three stages each, art from MINI_ART, and a painted plate after the bloom.
   Source: work_src/l1/*.js, assembled by tools/build_l1.py. */
/* MINI_ART:BEGIN (written by tools/l1_mini_art.py: asset ids, atlas rects, map-scale people, and traced geometry in stage units) */
MINI_ART.sisyphus={"atlas":"95d6dadd1db67ec80d28629a714a9000","people":"573f7077bc333cc2bfef83dc8aadc1cf","rects":{"boulder_0":[1,1,105,105],"boulder_1":[107,1,105,105],"boulder_2":[213,1,105,105],"boulder_3":[319,1,105,105],"boulder_4":[425,1,105,105],"boulder_5":[531,1,105,105],"boulder_6":[637,1,105,105],"boulder_7":[743,1,105,105],"boulder_8":[849,1,105,105],"boulder_9":[1,107,105,105],"boulder_10":[107,107,105,105],"boulder_11":[213,107,105,105],"boulder_12":[319,107,105,105],"boulder_13":[425,107,105,105],"boulder_14":[531,107,105,105],"boulder_15":[637,107,105,105],"gold_0":[743,107,105,105],"gold_1":[849,107,105,105],"gold_2":[1,213,105,105],"gold_3":[107,213,105,105],"gold_4":[213,213,105,105],"gold_5":[319,213,105,105],"gold_6":[425,213,105,105],"gold_7":[531,213,105,105],"gold_8":[637,213,105,105],"gold_9":[743,213,105,105],"gold_10":[849,213,105,105],"gold_11":[1,319,105,105],"gold_12":[107,319,105,105],"gold_13":[213,319,105,105],"gold_14":[319,319,105,105],"gold_15":[425,319,105,105],"flower":[531,319,39,34],"gull_up":[571,319,28,34],"gull_stand":[600,319,39,30],"bud":[640,319,26,28],"boat":[667,319,32,28],"lantern_off":[700,319,19,28],"lantern_on":[720,319,19,28],"lizard":[740,319,38,26]},"prects":{"push_0":[1,1,19,24],"push_1":[21,1,19,24],"push_2":[41,1,19,24],"push_3":[61,1,19,24],"sit":[81,1,19,24],"friend_0":[101,1,16,24],"friend_1":[118,1,16,24]},"bg":["86d13cc5ed498408ebfc599debdbb363","df77de8c0c3f9217196e0fec1c1fc1a3"],"plate":"ad18bfd0045fecc1a19d77588240b0da","path":[[16,222],[24,190],[34,160],[46,134],[62,112],[82,94],[104,82]]};
MINI_ART.goalkeeper={"atlas":"8723505cd60f58218789a39a9cc933af","people":"ab98082506a1291f2c4e58386a7383ad","rects":{"striker_0":[1,1,103,112],"striker_1":[105,1,113,112],"striker_2":[219,1,113,112],"ball_0":[333,1,40,40],"ball_1":[374,1,40,40],"ball_2":[415,1,40,40],"ball_3":[456,1,40,40],"ball_4":[497,1,40,40],"ball_5":[538,1,40,40],"ball_6":[579,1,40,40],"ball_7":[620,1,40,40],"ball_8":[661,1,40,40],"ball_9":[702,1,40,40],"ball_10":[743,1,40,40],"ball_11":[784,1,40,40]},"prects":{"keep_set":[1,1,16,24],"keep_set1":[18,1,16,24],"keep_dl":[35,1,24,16],"keep_dr":[60,1,24,16],"keep_lie":[85,1,24,16],"kid0_0":[110,1,16,16],"kid0_1":[127,1,16,16],"kid0_2":[144,1,16,16],"kid1_0":[161,1,16,16],"kid1_1":[178,1,16,16],"kid1_2":[195,1,16,16],"kid2_0":[212,1,16,16],"kid2_1":[229,1,16,16],"kid2_2":[1,26,16,16]},"bg":["a56ec1576db369cf4e5572c62255730a"],"plate":"2ae172a4c4ee59c0f496f37acdd27753","goal":[66,133,90,49]};
MINI_ART.idols={"atlas":"6a3a288f526ab5886ef4a26a61429fda","rects":{"giant0":[1,1,105,236],"giant1":[107,1,108,236],"giant2":[216,1,114,236],"idol_wealth":[331,1,69,96],"idol_fame":[401,1,53,96],"idol_crowd":[455,1,49,96],"idol_duty":[505,1,49,96],"idol_clay":[555,1,67,96],"idol_self":[623,1,70,96],"giant0_2":[694,1,105,90],"giant1_2":[800,1,108,90],"giant2_2":[909,1,114,90],"idol_progress":[1,238,47,80],"giant0_1":[49,238,105,76],"giant1_1":[155,238,108,76],"giant2_1":[264,238,114,76],"giant0_0":[379,238,105,70],"giant1_0":[485,238,108,70],"giant2_0":[594,238,114,70],"idol_comfort":[709,238,92,58],"hammer_0":[802,238,55,55],"hammer_1":[858,238,55,55],"hammer_2":[914,238,55,55],"hammer_3":[1,319,55,55],"hammer_4":[57,319,55,55],"hammer_5":[113,319,55,55],"hammer_6":[169,319,55,55],"hammer_7":[225,319,55,55]},"prects":{},"bg":["f7d125f4c685a529a783a48f9036bc0d"],"plate":"d897cd892b998b5f1710654bdee394e3","plinths":[[32,178],[65,171],[98,174],[133,181],[169,187]]};
MINI_ART.having={"atlas":"91eef5e4560fcba69462c2397c14cada","people":"cb88f0b47ca89a00629fe2014f402052","rects":{"basket_2":[1,1,39,40],"basket_0":[41,1,33,34],"basket_1":[75,1,33,34],"frame":[109,1,40,32],"flower_open":[150,1,32,32],"flower_open_grey":[183,1,32,32],"trophy":[216,1,30,30],"paperlamp":[247,1,17,30],"paperlamp_grey":[265,1,17,30],"chest":[283,1,33,28],"flower_closed":[317,1,23,28],"coins":[341,1,34,26],"crown":[376,1,37,26],"gem":[414,1,32,26],"note_b":[447,1,21,24],"note_b_grey":[469,1,21,24],"note_a":[491,1,16,22],"note_c":[508,1,11,22]},"prects":{"elder_wait":[1,1,16,24],"elder_lit":[18,1,16,24],"stranger_wait":[35,1,16,24],"stranger_lit":[52,1,16,24],"dancer0_0":[69,1,16,24],"dancer0_1":[86,1,16,24],"dancer1_0":[103,1,16,24],"dancer1_1":[120,1,16,24],"dancer2_0":[137,1,16,24],"dancer2_1":[154,1,16,24],"dancer3_0":[171,1,16,24],"dancer3_1":[188,1,16,24],"child_wait":[205,1,16,16],"child_lit":[222,1,16,16]},"bg":["3334351c2387cd2c5a1e6940bef8c928","3e8f51734675768ea168e46eaa53863f","837ec0b5bc0b2fa38c081ad886bc0b16"],"plate":"7874ad547b617b93a52876421f813a07","gate":[[16,146],[33,145],[50,144]],"dance":[[78,152],[92,152],[112,150],[126,150]],"walk":234};
MINI_ART.cages={"atlas":"9d074ac8579afdc5fd0b96cfd1218c69","people":"0979c7af24a385c55c04fabd542b6a21","rects":{"gate":[1,1,119,118],"gate_l":[121,1,46,118],"gate_r":[168,1,43,118],"cage":[212,1,37,64],"cage_open":[250,1,59,64],"key_1":[310,1,26,32],"key":[337,1,12,30],"key_2":[350,1,32,26],"bird_0":[383,1,18,24],"bird_1":[402,1,29,22],"key_3":[432,1,30,12]},"prects":{"oldwoman_0":[1,1,16,24],"oldwoman_1":[18,1,16,24],"oldwoman_free":[35,1,16,24],"oldwoman_cheer":[52,1,16,24],"scholar_0":[69,1,16,24],"scholar_1":[86,1,16,24],"scholar_free":[103,1,16,24],"scholar_cheer":[120,1,16,24],"laborer_0":[137,1,16,24],"laborer_1":[154,1,16,24],"laborer_free":[171,1,16,24],"laborer_cheer":[188,1,16,24],"youngwoman_0":[205,1,16,24],"youngwoman_1":[222,1,16,24],"youngwoman_free":[239,1,16,24],"youngwoman_cheer":[1,26,16,24],"oldman_0":[18,26,16,24],"oldman_1":[35,26,16,24],"oldman_free":[52,26,16,24],"oldman_cheer":[69,26,16,24],"child_0":[86,26,16,16],"child_1":[103,26,16,16],"child_free":[120,26,16,16],"child_cheer":[137,26,16,16],"folk0_0":[1,53,16,24],"folk0_1":[18,53,16,24],"folk1_0":[35,53,16,24],"folk1_1":[52,53,16,24],"folk2_0":[69,53,16,24],"folk2_1":[86,53,16,24],"folk3_0":[103,53,16,24],"folk3_1":[120,53,16,24],"folk4_0":[137,53,16,24],"folk4_1":[154,53,16,24],"folk5_0":[171,53,16,24],"folk5_1":[188,53,16,24],"folk6_0":[205,53,16,16],"folk6_1":[222,53,16,16]},"bg":["a141baf63aac914e231b632cef7b975e"],"plate":"7e31436d0eba50cc9c2218cf546cb57e","ring":[[96,178],[140,194],[140,226],[96,242],[52,226],[52,194]],"you":[96,210],"plaza":[[44,180],[96,174],[148,180],[70,208],[122,208],[44,238],[148,238]],"chains":[[0,1],[1,2],[0,3],[1,3],[1,4],[2,4],[3,5],[4,6],[5,6]],"gate":[102,150,0.78]};
MINI_ART.idols.wanderer={"atlas":"3c7f936cb8b623f2d696b16d65eae74f","bg":"625ba6eea06d401edce5455f3130dc85","size":[224,420],"rects":{"head":[677,1,70,61],"handL":[638,1,38,86],"handR":[416,1,42,124],"shoulders":[748,1,144,50],"chest":[226,1,189,185],"base":[459,1,178,124],"statue":[1,1,224,420]},"frame":{"head":[73,0,70,61],"handL":[0,82,38,86],"handR":[182,16,42,124],"shoulders":[38,61,144,50],"chest":[21,111,189,185],"base":[20,296,178,124]},"center":{"head":[108,30],"handL":[19,125],"handR":[203,78],"shoulders":[110,86],"chest":[115,203],"base":[109,358]},"origin":[80,148],"note":"Phase 45A: Stage III statue shaped like the Wanderer. Pixels. frame = piece rect in the statue frame; draw at origin + frame offset. bg = Stage III backdrop (clearing y 190-560 px)."}; /* Phase 45B */
/* MINI_ART:END */
/* ---- Phase 30 (pilot): Sisyphus's Hill, developed — Camus's "A Chip of the Boulder" ----
   Idea check: playing this, you feel that the top was never the prize: the boulder always rolls back, and what grows is what you notice,
   most of all on the walk back down. That is Camus's idea that the struggle itself can be enough, and that the return down the hill is
   the hour of consciousness.
   Stages: I · Night (one climb; moments appear only while you push) → II · The Walk Down (the rollback is the point: the Wanderer walks
   down after the boulder, time slows, and richer moments appear only on the descent, each counting double) → III · Dawn (every moment
   noticed is a lantern planted along the path; the storm breaks; climb again, and at the top, with the smile meter full, the bloom).
   Rules kept from Phase 20: more than 8 pushes a second adds nothing; the boulder always rolls back at 92%.
   Phase 45B: the push is a circle. Draw circles with one finger anywhere on the lower half of the stage (y >= 160 units), either way round; every
   quarter turn (90 degrees) of the finger around the middle of its last 0.6 s of path is one push, and reversing starts the count again. On keys,
   press the arrow keys in turn around the circle (left, up, right, down, or the reverse); the next key in the cycle is a push, the same key twice
   or a key that skips one only shuffles. Moments fall from the top of the stage, slowly, in a set order at set x places for each stage; tap one to
   notice it (A, B, Z or Space notices the lowest one). A moment that reaches the bottom unnoticed fades and slips by. Stage III lanterns sit 1.5+ times wider apart.
   Pattern for later phases: MINI_ART.sisyphus (art + traced path), stages + lines, toStage, a full no-art fallback, plate after the bloom. */
(function(){
  const ID="sisyphus",GOAL=10,PUSH=.0075,TOP=.92,U0=.13,U1=.97,R=13,WALK=16,TSC=.7;
  const DEF_PATH=[[16,222],[24,190],[34,160],[46,134],[62,112],[82,94],[104,82]];
  const CAMUS={x:116,y:81};
  const FALL=30,BOT=262,TOPY=-10,CMAX=3,MOGAP=6.5,DGAP=2.2;      /* moments fall FALL units a second from TOPY to BOT; at most CMAX at once while climbing */
  const QT=Math.PI/2,MINS=3,TURNB=2.3,REV=.26,CIRCY=160;           /* a quarter turn is one push; the path is sampled every 3 units; the circle zone starts at y 160 */
  const LSP=.115,LPL=7;                                            /* lantern spacing along the path, and lanterns in one row (the old spacing was .067, 1.5x is .1005) */
  const KEYS=["L","U","R","D"];
  const px=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(hs(x),hs(y),w,h)};
  /* ---- the traced path, measured by arc length (u 0 = bottom-left, 1 = the summit plateau) ---- */
  let PT=null;
  function path(){const P=(MINI_ART[ID]&&MINI_ART[ID].path)||DEF_PATH;if(PT&&PT.src===P)return PT;const L=[0];
    for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));return PT={src:P,L,len:L[L.length-1]}}
  function at(u){const T=path(),P=T.src,d=clamp(u,0,1)*T.len;let i=1;while(i<P.length-1&&T.L[i]<d)i++;const k=clamp((d-T.L[i-1])/((T.L[i]-T.L[i-1])||1),0,1);
    return {x:lerp(P[i-1][0],P[i][0],k),y:lerp(P[i-1][1],P[i][1],k)}}
  const bU=p=>U0+p*(U1-U0);                        /* the boulder's place on the path for progress p (0..1) */
  const behind=u=>u-(R+9)/path().len;              /* the Wanderer stands just down-path of the boulder */
  const depth=u=>lerp(1,.82,u);                    /* things further up the hill are a little smaller */
  /* ---- moments: they fall from the top, in a set order at set x places for each stage (no random place or time) ---- */
  const SEQ_CLIMB=[[["flower",58],["sea",146],["flower",112],["sea",160],["flower",80],["sea",132],["flower",44],["sea",152]],0,
    [["sea",70],["flower",132],["sea",110],["flower",50],["sea",150],["flower",92],["sea",38],["flower",140]]];SEQ_CLIMB[1]=SEQ_CLIMB[0];
  const SEQ_DESC=[0,[["gull",50],["lizard",118],["friend",84]],[["friend",130],["gull",72],["lizard",40]]];SEQ_DESC[0]=SEQ_DESC[1];
  function spawn(s,k,x,desc){s.ms.push({k,desc,x,x0:x,y:TOPY,a:0,gone:false,got:false,ph:x*.37});s.spawned++;if(desc)s.descSpawned++;
    if(k==="sea"&&!s.rm)s.lt=1;sfx("moment")}
  const moPos=m=>({x:m.x,y:m.y});
  function lowest(s){let b=null;for(const m of s.ms)if(!m.gone&&m.y>2&&(!b||m.y>b.y))b=m;return b}
  function notice(s,m){if(!m||m.gone)return false;m.gone=true;m.got=true;m.a=0;const was=s.smile;s.got++;s.smile+=m.desc?2:1;if(m.desc)s.descSeen++;s.flash=.5;sfx("sisyphus_notice");
    if(was<GOAL&&s.smile>=GOAL){s.full=1.4;sfx("sisyphus_full")}
    if(!s.rm)pSparks(s.P,m.x,m.y,14,"#FFE9A8",38);else pMotes(s.P,4,"#FFE9A8",[m.x-6,m.y-6,12,12]);
    if(s.st===2)plant(s,.1);return true}
  function plant(s,delay){const i=s.lan.length,r=i<LPL?0:i<2*LPL-1?1:i<3*LPL-1?2:3,k=[i,i-LPL,i-(2*LPL-1),(i-(3*LPL-1))%LPL][r],od=k%2;
    /* row 0: seven lanterns zigzag across the path (off to the left, then off to the right), LSP of the path apart; row 1 between them, on the path; row 2 well out to the right; row 3 swaps row 0's sides */
    const off=[od?28:-8,10,od?56:52,od?-8:28][r],u=Math.min(.85,.08+(k+(r===1?.5:0))*LSP+(r===3?.03:0)),q=at(u),a=at(u-.02),b=at(u+.02),tx=b.x-a.x,ty=b.y-a.y,n=Math.hypot(tx,ty)||1;
    s.lan.push({x:clamp(q.x-ty/n*off,8,184),y:q.y+tx/n*off+2,u,t:-(delay||0)})}
    /* ---- pushing: a quarter turn of a circle drawn on the lower half is one push; arrow keys in turn are one push each ---- */
  function push(s){if(s.ph!=="climb")return;s.pushes=s.pushes.filter(t=>s.t-t<1);if(s.pushes.length>=8)return; /* mashing past 8 a second adds nothing */
    s.pushes.push(s.t);s.p=Math.min(.95,s.p+PUSH);s.lastPush=s.t;s.pf=(s.pf+1)%4;s.npush++;s.pk=1;if(s.st===2)s.hum=1;sfx("sisyphus_push");
    if(!s.rm){const q=at(bU(s.vp));pDust(s.P,q.x-4,q.y,2,"rgba(205,190,175,.7)")}}
  function keyPress(s,i){if(s.ph!=="climb")return;const d=s.lk<0?1:(i-s.lk+4)%4;s.lk=i;
    if(d===1||d===3)push(s);else{s.jig=.12;sfx("sisyphus_shuffle")}}
  /* The finger's turning is tracked as the turn of its path: for a circle the heading turns exactly as far as the finger sweeps round the circle's middle,
     and unlike a moving middle it has no lag at the start or at a reversal. A turn-back of about 130 degrees or more in one step starts the count again;
     a gentler change of the turning sense restarts it once the finger has swung 15 degrees back from its furthest sweep. */
  function circle(s,inp){const d=inp.down;
    if(s.ph!=="climb"||!d||d.y<CIRCY){s.lp=null;s.hd=null;s.sw=0;s.ex=0;return}
    s.fx=d.x;s.fy=d.y;s.fa=1;const l=s.lp;if(!l){s.lp={x:d.x,y:d.y};s.hd=null;s.sw=0;s.ex=0;return}
    const dx=d.x-l.x,dy=d.y-l.y;if(Math.hypot(dx,dy)<MINS)return;
    s.lp={x:d.x,y:d.y};const hd=Math.atan2(dy,dx);if(s.hd==null){s.hd=hd;return}
    let dh=hd-s.hd;while(dh>Math.PI)dh-=2*Math.PI;while(dh<-Math.PI)dh+=2*Math.PI;s.hd=hd;
    if(Math.abs(dh)>TURNB){s.sw=0;s.ex=0;return}
    s.sw+=dh;
    if(Math.abs(s.sw)>Math.abs(s.ex)&&(s.ex===0||Math.sign(s.sw)===Math.sign(s.ex)))s.ex=s.sw;
    else if(Math.abs(s.sw-s.ex)>=REV){s.sw-=s.ex;s.ex=s.sw}
    while(Math.abs(s.sw)>=QT){const sg=Math.sign(s.sw);s.sw-=sg*QT;s.ex-=sg*QT;push(s)}}
  function startDown(s){s.ph="down";s.rollT=0;s.rp=s.p;s.wu=behind(bU(s.p));s.dq=(SEQ_DESC[s.st===0?1:s.st]||SEQ_DESC[1]).map(q=>q.slice());s.dT=.9;s.climbs++;
    for(const m of s.ms)if(!m.gone){m.gone=true;m.a=0}
    s.sw=0;s.ex=0;s.lp=null;s.hd=null;sfx("roll");sfx("descent");
    if(s.st===2&&typeof miniTry==="function")miniTry()} /* a Stage III climb that rolls back without the bloom is a missed attempt (Walk on counts it) */
  function reachBottom(s){s.ph="climb";s.p=0;s.vp=0;s.lk=-1;s.lastPush=s.t;s.moT=3;s.ms=[];if(s.st===1){stageUp(s);startDawn(s)}}
  function startDawn(s){s.lan=[];for(let i=0;i<s.got;i++)plant(s,.35+i*.28)}
    /* ---- drawing ---- */
  function fallbackBg(c,s,dawn){const g=c.createLinearGradient(0,0,0,200);g.addColorStop(0,dawn>.5?"#5A3A5E":"#0E0B1A");g.addColorStop(1,dawn>.5?"#DE9A52":"#33264F");c.fillStyle=g;c.fillRect(0,0,192,320);
    c.fillStyle=dawn>.5?"#6A5A8A":"#1e2050";c.fillRect(120,120,72,90);
    const P=path().src;c.fillStyle="#3A2C3E";c.beginPath();c.moveTo(0,320);c.lineTo(0,P[0][1]);P.forEach(q=>c.lineTo(q[0]-6,q[1]));c.lineTo(126,78);c.lineTo(140,140);c.lineTo(150,320);c.closePath();c.fill();
    c.strokeStyle="#6E5A52";c.lineWidth=7;c.beginPath();P.forEach((q,i)=>i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1]));c.stroke();c.fillStyle="#120D18";c.fillRect(0,252,192,68)}
  function drawBg(c,s,dawn){const ok=mBg(c,ID,0);if(!ok){fallbackBg(c,s,dawn);return}if(dawn>0)mBg(c,ID,1,dawn)}
  function boulder(c,s,p,gold,a){const u=bU(p),q=at(u),sc=depth(u),dist=p*path().len*(U1-U0),f=((Math.floor(dist/(2*Math.PI*R/16))%16)+16)%16;
    const x=q.x+(s.jig>0?.5:0),y=q.y-R*sc+1;mShadow(c,q.x,q.y+1,20*sc,.45);
    glow(c,x,y,R*1.7*sc,"rgba(255,190,120,.85)",(.16+.3*s.hum+.22*(s.pk||0))*(a==null?1:a));
    const o={ax:.5,ay:.5,sc:sc*(2*R)/(52.5*.72),sm:true,a:a==null?1:a}; /* the boulder fills 72% of its 105-pixel frame */
    if(mPiece(c,ID,(gold?"gold_":"boulder_")+f,x,y,o))return;
    c.save();c.globalAlpha=o.a;c.fillStyle=gold?"#D9A93A":"#6E6576";c.beginPath();c.arc(x,y,R*sc,0,Math.PI*2);c.fill();c.strokeStyle=gold?"#FFF1B8":"#C0503A";c.lineWidth=1;
    c.beginPath();const r0=dist/R;for(let i=0;i<3;i++){const a0=r0+i*2.1;c.moveTo(x,y);c.lineTo(x+Math.cos(a0)*R*sc*.8,y+Math.sin(a0)*R*sc*.8)}c.stroke();c.restore()}
  function person(c,name,chars,x,y,o){if(mPerson(c,ID,name,x,y,o))return;if(chars&&mSprO(c,chars,x,y,o))return;px(c,x+3,y+2,10,20,"#2F7470");px(c,x+5,y,6,5,"#D8B090")}
  function wanderer(c,s,t){const q=at(s.ph==="down"?s.wu:behind(bU(s.vp)));mShadow(c,q.x,q.y,12,.4);
    if(s.ph==="down"){const f=s.rm?0:[1,0,2,0][Math.floor(t/190)%4];person(c,null,"wanderer_left_"+f,q.x-8,q.y-24);return}
    const f=s.t-s.lastPush<.3?s.pf:0;person(c,"push_"+f,"wanderer_right_"+(f%2?1:0),q.x-12,q.y-24)}
  function camus(c,t){mShadow(c,CAMUS.x,CAMUS.y,11,.35);if(!mSprO(c,"camus_"+(Math.floor(t/900)%2),CAMUS.x-8,CAMUS.y-24))px(c,CAMUS.x-5,CAMUS.y-22,10,20,"#9A8060")}
  function drawMoment(c,s,m,t){const x=m.x,y=m.y,rm=s.rm;
    const a=m.gone?Math.max(0,1-m.a/.45):Math.min(1,m.a/.3);if(a<=0)return;
    c.save();c.globalAlpha=a;glow(c,x,y,16,m.desc?"rgba(255,190,150,.9)":"rgba(255,220,140,.9)",m.gone?0:.28);
    if(!m.gone){const rot=rm?0:t/900,r=13+(rm?0:Math.sin(t/260));for(let i=0;i<8;i++){const an=rot+i*Math.PI/4;px(c,x+Math.cos(an)*r-1,y+Math.sin(an)*r-1,2,2,i%2?"#FFF1C8":m.desc?"#F2A58A":"#F5C66A")}
      if(m.desc)mText(c,"×2",x+15,y-12,8,"#FFE9B8")}
    const k=m.k,fl=rm?0:Math.floor(t/240)%2;
    if(k==="flower"){const o=rm?1:clamp((m.a-.3)/.9,0,1);if(o<1)mPiece(c,ID,"bud",x,y+3,{ax:.5,ay:.8,a:1-o});if(o>0&&!mPiece(c,ID,"flower",x,y+3,{ax:.5,ay:.8,sc:.55+.45*o,a:o,sm:true})){px(c,x-3,y-3,6,6,"#E8A0C0");px(c,x-1,y-1,2,2,"#F5C66A")}}
    else if(k==="sea"){glow(c,x,y-6,22,"rgba(200,190,255,.9)",.35);if(!mPiece(c,ID,"boat",x,y,{ax:.5,ay:.7})){px(c,x-6,y,12,3,"#4A3A30");px(c,x-1,y-9,1,9,"#C9BFD9");px(c,x,y-8,5,6,"#E6DACA")}}
    else if(k==="gull"){if(!mPiece(c,ID,fl?"gull_up":"gull_stand",x,y,{ax:.5,ay:.5,sc:fl?1:.8,sm:true})){px(c,x-4,y,9,1,"#F0EDE4");px(c,x-6,y-(fl?2:-1),3,1,"#F0EDE4");px(c,x+4,y-(fl?2:-1),3,1,"#F0EDE4")}}
    else if(k==="lizard"){if(!mPiece(c,ID,"lizard",x,y,{ax:.5,ay:.7})){px(c,x-7,y-2,14,5,"#706c76");px(c,x-4,y-4,8,2,"#6A9E55")}}
    else if(k==="friend"){person(c,"friend_"+fl,"",x-8,y-24);}
    c.restore()}
  function meter(c,s){const n=Math.min(GOAL,s.smile);px(c,4,4,26+GOAL*7,17,"#100B15");px(c,5,5,24+GOAL*7,15,"#1C1428");
    const fc=n>=GOAL?"#F5C66A":n>0?"#E0B055":"#8A7AAA";c.fillStyle=fc;c.beginPath();c.arc(13,12.5,5.5,0,Math.PI*2);c.fill();
    px(c,10.5,10,1,2,"#2A1A12");px(c,14.5,10,1,2,"#2A1A12");const w=n/GOAL;c.strokeStyle="#2A1A12";c.lineWidth=1;c.beginPath();c.arc(13,12.5+(w>.5?0:2),2.5,w>.2?.2*Math.PI:1.1*Math.PI,w>.2?.8*Math.PI:1.9*Math.PI);c.stroke();
    for(let i=0;i<GOAL;i++){const on=i<n,X=24+i*7,col=on?(s.flash>0&&i>=n-2&&!s.rm?"#FFF7D8":"#F5C66A"):"#3A3048";c.fillStyle=col;c.beginPath();c.arc(X+2.5,12.5,2.5,0,Math.PI*2);c.fill();if(on)px(c,X+1.5,11,1,1,"#FFF7D8")}
    if(s.full>0){c.save();c.globalAlpha=Math.min(1,s.full);c.strokeStyle="#FFF1B8";c.lineWidth=1.5;c.strokeRect(2.5,2.5,29+GOAL*7,20);c.restore()}} /* the full meter wears a gold frame for a moment */
  /* the circle guide: a faint dashed ring in the lower half with a turning arrow each way, four key marks (lit when that key is next), and a soft glow under the finger */
  const GX=96,GY=208,GR=24;
  function head(c,an,dir){const px0=GX+Math.cos(an)*GR,py0=GY+Math.sin(an)*GR,tx=-Math.sin(an)*dir,ty=Math.cos(an)*dir;
    c.beginPath();c.moveTo(px0+tx*4.5,py0+ty*4.5);c.lineTo(px0-tx*2-ty*3.5,py0-ty*2+tx*3.5);c.lineTo(px0-tx*2+ty*3.5,py0-ty*2-tx*3.5);c.closePath();c.fill()}
  function guide(c,s,t){
    if(s.ph==="climb"&&s.ga>.02){const a=s.ga,r=GR-2*Math.min(1,s.jig/.12);c.save();c.lineCap="round";
      c.globalAlpha=a*.5;c.strokeStyle="#F5C66A";c.fillStyle="#F5C66A";c.lineWidth=1.2;c.setLineDash([3,3]);c.beginPath();c.arc(GX,GY,r,0,Math.PI*2);c.stroke();c.setLineDash([]);
      head(c,-Math.PI/2,1);head(c,Math.PI/2,-1); /* a turning arrow each way: either direction counts */
      if(!s.rm){const an=t/650;glow(c,GX+Math.cos(an)*r,GY+Math.sin(an)*r,6,"rgba(255,226,150,.9)",.5*a)}
      const nx=s.lk<0?[0,1,2,3]:[(s.lk+1)%4,(s.lk+3)%4];
      for(let i=0;i<4;i++){const d=[[-1,0],[0,-1],[1,0],[0,1]][i],kx=GX+d[0]*(GR+8),ky=GY+d[1]*(GR+8),lit=nx.includes(i);
        c.globalAlpha=a*(lit?.75:.25);c.fillStyle=lit?"#F5C66A":"#9A8CBE";c.beginPath();c.moveTo(kx+d[0]*3,ky+d[1]*3);c.lineTo(kx-d[0]*2.5-d[1]*3,ky-d[1]*2.5+d[0]*3);c.lineTo(kx-d[0]*2.5+d[1]*3,ky-d[1]*2.5-d[0]*3);c.closePath();c.fill()}
      c.restore()}
    if(s.fa>.02)glow(c,s.fx,s.fy,15,"rgba(255,224,150,.9)",.4*s.fa)}
    function lanterns(c,s,t,bright){for(const L of s.lan){if(L.t<0)continue;const k=Math.min(1,L.t/.35),y=L.y-(s.rm?0:(1-E.out(k))*10);
      glow(c,L.x,y-9,11+4*bright,"rgba(255,196,110,.95)",.45*k*(1+bright));if(!mPiece(c,ID,"lantern_on",L.x,y,{ax:.5,ay:1,a:k})){px(c,L.x-2,y-9,4,7,"#F5C66A");px(c,L.x-.5,y-2,1,2,"#4A3A30")}}}
  function rain(s,dt,rate){if(s.rm||rate<=0)return;s.rainAcc=(s.rainAcc||0)+rate*dt;while(s.rainAcc>=1){s.rainAcc--;pRain(s.P,1,"rgba(180,175,220,.5)",-38)}}
  function lightning(c,s){if(s.lt>0&&!s.rm){c.save();c.globalCompositeOperation="lighter";const g=c.createLinearGradient(0,0,0,170);g.addColorStop(0,`rgba(150,140,220,${.28*s.lt})`);g.addColorStop(1,"rgba(0,0,0,0)");c.fillStyle=g;c.fillRect(0,0,192,170);c.restore()}}
  /* the sounds (visual cues: dust at the boulder, a scuff of the ring and boulder, sparkle, a fading moment, a gold frame on the meter) */
  if(typeof SFX!=="undefined"){
    SFX.sisyphus_push=()=>{aNoise(.15,{type:"bandpass",f:230,to:140,q:1.1,a:.025,v:.06});aTone(AN(-27),.13,{type:"triangle",v:.09,to:AN(-31),lp:420})};
    SFX.sisyphus_shuffle=()=>aNoise(.07,{type:"highpass",f:1800,to:1300,q:.6,a:.01,v:.035});
    SFX.sisyphus_notice=()=>{aTone(AN(24),.5,{type:"sine",v:.07,a:.004});aTone(AN(31),.7,{type:"sine",v:.045,a:.004,at:.07})};
    SFX.sisyphus_slip=()=>aTone(AN(14),.55,{type:"triangle",v:.055,to:AN(3),a:.02,lp:900});
    SFX.sisyphus_full=()=>aArp([12,16,19,24],.07,{d:.7,v:.045,lp:3000});
    SFX.sisyphus_finish=()=>{aArp([7,12,16,19,24,28],.09,{d:1.1,v:.045,lp:3400});aTone(AN(-12),1.6,{type:"triangle",v:.06,a:.25,lp:700})};
    if(typeof GAP!=="undefined"){GAP.sisyphus_push=.09;GAP.sisyphus_shuffle=.1;GAP.sisyphus_notice=.08;GAP.sisyphus_slip=.2;GAP.sisyphus_full=.5;GAP.sisyphus_finish=2}
  }
  MINI.sisyphus={
    who:"camus",title:"Sisyphus’s Hill",land:"l1",
    setup:["Help me with this. It rolls back down near the top. It always does.","Push anyway, and keep your eyes open on the way up."],
    how:"Draw circles to push. Tap the small things you notice.",
    goal:"Push the boulder up the hill, and notice the small things that fall.",
    ctl:"Circle a finger on the lower half to push; tap what falls (arrow keys in turn; Z notices).",
    win:"There. You’re smiling, and it’s rolling back down again. That’s the whole secret.",
    walk:"Take the chip anyway. The hill will still be here tomorrow.",
    stages:["Night","The Walk Down","Dawn"],
    lines:[null,"Walk down slowly. This is the part I like best.",null],
    pad:false,ab:true,limit:300,long:false,bloomT:4.2,
    fl:["Fill the smile meter","Let no more than two small things slip by","Notice every small thing, on the way up and the way down"],
    flNext:["Next time, try to catch more of the small things before they slip by.","Next time, try to catch every one, especially on the walk down."],
    rate:s=>s.missed===0?3:s.missed<=2?2:1,
    init(s){Object.assign(s,{st:0,stT:0,ph:"climb",p:0,vp:0,rp:0,rollT:0,wu:0,lk:-1,kd:-1,lp:null,hd:null,sw:0,ex:0,fx:96,fy:200,fa:0,ga:0,pk:0,full:0,ms:[],mqi:[0,0,0],lastPush:-9,pushes:[],pf:0,npush:0,jig:0,hum:0,smile:0,got:0,missed:0,descSeen:0,
      spawned:0,descSpawned:0,climbs:0,flash:0,moT:3,dq:[],dT:0,lan:[],lt:0,ltT:4,P:pfx()});s.wu=behind(bU(0))},
    toStage(s,n){this.init(s);if(n>=1){s.smile=n===1?2:7;s.got=n===1?2:5;s.descSeen=n===2?2:0;s.p=TOP;stageUp(s,1);startDown(s)}
      if(n>=2){s.p=0;s.ph="climb";s.wu=behind(bU(0));stageUp(s,2);startDawn(s)}},
    step(s,dt,inp){
      s.stT+=dt;s.jig=Math.max(0,s.jig-dt);s.pk=Math.max(0,s.pk-dt*5);s.full=Math.max(0,s.full-dt*(s.rm?.7:1.2));s.fa=Math.max(0,s.fa-dt*3);s.flash=Math.max(0,s.flash-dt);s.hum=Math.max(0,s.hum-dt*2.2);s.lt=Math.max(0,s.lt-dt*2);
      const down=s.ph==="down",tdt=down?dt*TSC:dt;
      // input: a tap on a falling moment notices it (A, B, Z or Space: the lowest one); a circle drawn low on the stage, or the arrow keys in turn, pushes
      for(const tp of inp.taps||[]){let b=null,bd=17;for(const m of s.ms){if(m.gone||m.y<2)continue;const dd=Math.hypot(tp.x-m.x,tp.y-m.y);if(dd<=bd){bd=dd;b=m}}if(b)notice(s,b)}
      if(inp.aTap||inp.bTap)notice(s,lowest(s));
      circle(s,inp);
      {const tp=[];if(inp.lTap)tp.push(0);if(inp.uTap)tp.push(1);if(inp.rTap)tp.push(2);if(inp.dTap)tp.push(3);
        const dn=inp.dx<-.5?0:inp.dy<-.5?1:inp.dx>.5?2:inp.dy>.5?3:-1;   /* a held direction (the pad, or a key held down) counts once, when it starts */
        const ks=tp.length?tp:dn>=0&&dn!==s.kd?[dn]:[];s.kd=dn;ks.forEach(k=>keyPress(s,k))}
      // the boulder
      if(s.ph==="climb"){if(s.t-s.lastPush>.8&&s.p>0)s.p=Math.max(0,s.p-.03*dt);
        if(s.p>=TOP){if(s.st===2&&s.smile>=GOAL&&s.descSeen>=2){s.vp=s.p;sfx("sisyphus_finish");return "win"}s.ph="wobble";s.wobT=0;sfx("wobble")}}
      else if(s.ph==="wobble"){s.wobT+=dt;if(s.wobT>=.6){if(s.st===0){startDown(s);stageUp(s)}else startDown(s)}}
      else if(down){s.rollT+=dt;const k=Math.min(1,s.rollT/2.2);s.p=s.rp*(1-k*k);s.vp=s.p;
        const goal=behind(bU(0));s.wu=Math.max(goal,s.wu-WALK*tdt/path().len);if(s.wu<=goal&&s.rollT>=2.2&&!s.ms.length&&!s.dq.length)reachBottom(s)}
      if(s.ph==="climb"||s.ph==="wobble")s.vp+=(s.p-s.vp)*Math.min(1,dt*14);
      // moments: while pushing on the climb; only the three richer ones on the walk down
      for(let i=s.ms.length-1;i>=0;i--){const m=s.ms[i];
        if(m.gone){m.a+=dt;if(!m.got)m.y+=14*dt;if(m.a>.5)s.ms.splice(i,1);continue}
        m.a+=tdt;m.y=TOPY+FALL*m.a;m.x=m.x0+(s.rm?0:Math.sin(m.a*1.4+m.ph)*5);
        if(m.y>=BOT){s.missed++;m.gone=true;m.a=0;sfx("sisyphus_slip")}} /* it reached the bottom: it slips by */
      if(down){s.dT-=tdt;if(s.dT<=0&&s.dq.length){const q=s.dq.shift();spawn(s,q[0],q[1],true);s.dT=DGAP}}
      else if(s.ph==="climb"&&s.t-s.lastPush<1.2){s.moT-=dt;if(s.moT<=0&&s.ms.filter(m=>!m.gone).length<CMAX){const S=SEQ_CLIMB[s.st]||SEQ_CLIMB[0],q=S[s.mqi[s.st]++%S.length];spawn(s,q[0],q[1],false);s.moT=MOGAP}}
      {const want=s.ph==="climb"&&(s.t-s.lastPush<1.6||(s.st===0&&s.t<9))?1:0;s.ga+=(want-s.ga)*Math.min(1,dt*5)}
      // storm, lightning, lanterns, particles
      if(s.st<2&&!s.rm){s.ltT-=dt;if(s.ltT<=0){s.lt=1;s.ltT=6.5}}
      for(const L of s.lan){const was=L.t;L.t+=dt;if(was<0&&L.t>=0)sfx("plant")}
      const dawn=s.st===2?Math.min(1,s.stT/30):0;rain(s,tdt,s.st===0?70:s.st===1?40:30*(1-dawn));
      pStep(s.P,tdt,s.rm)},
    draw(s,c,t){
      const dawn=s.st===2?Math.min(1,s.stT/30):0;
      drawBg(c,s,dawn);lightning(c,s);
      if(s.ph==="down")grade(c,"rgba(255,160,90,1)",.07);
      if(s.st===2){grade(c,"rgba(255,190,120,1)",.1*dawn,"soft-light");lanterns(c,s,t,dawn)}
      camus(c,t);
      if(s.ph==="down"){wanderer(c,s,t);boulder(c,s,s.p,false)}else{const wob=s.ph==="wobble"&&!s.rm?(Math.floor(s.wobT*28)%2?.004:-.004):0;boulder(c,s,s.vp+wob,false);wanderer(c,s,t)}
      for(const m of s.ms)drawMoment(c,s,m,t); /* moments sit in front, so nothing hides them */
      pDraw(c,s.P,ID);vignette(c,.35);meter(c,s);guide(c,s,t)},
    bloom(s,c,k,t){ /* the boulder rolls down one last time and turns gold; the rain stops, dawn floods the hill, the path lanterns glow in a line,
                       and the Wanderer sits against the boulder, smiling. More lanterns earned means more motes and a brighter dawn. */
      const fl=s._fl||1;if(s._b0==null){s._b0=s.vp||TOP;s.P=pfx();if(!s.lan.length)startDawn(s);s.lan.forEach(L=>L.t=Math.max(L.t,1))}
      const kr=s.rm?1:E.inOut(Math.min(1,k/.5)),p=lerp(s._b0,.1,kr),g=clamp((k-.25)/.3,0,1),sit=clamp((k-.5)/.2,0,1),bright=.4+.2*fl;
      drawBg(c,s,1);grade(c,"rgba(255,196,110,1)",(.08+.05*fl)*clamp(k/.6,0,1),"soft-light");
      lanterns(c,s,t,bright);camus(c,t);
      if(g<1)boulder(c,s,p,false,1-g);if(g>0)boulder(c,s,p,true,g);
      if(!s.rm&&!s._mot){s._mot=1;pMotes(s.P,8+fl*12,"#FFE9A8",[0,40,192,200])}
      if(sit<1&&!s.rm){const q=at(behind(bU(s._b0)));c.globalAlpha=1-sit;person(c,"push_0","wanderer_right_0",q.x-12,q.y-24);c.globalAlpha=1}
      if(sit>0){const q=at(bU(p));c.globalAlpha=sit;person(c,"sit","wanderer_down_0",q.x+R-6,q.y-23);c.globalAlpha=1}
      if(!s.rm){pStep(s.P,1/60,false);pDraw(c,s.P,ID)}else pDraw(c,s.P,ID);
      glow(c,96,40,120,"rgba(255,210,140,.9)",.12*fl*clamp(k/.7,0,1));s.smile=Math.max(s.smile,GOAL);meter(c,s)},
    _t:{GOAL,PUSH,TOP,bU,at}, /* tests only */
    shotReady:s=>s.ms.some(m=>!m.gone&&m.y>30&&m.a>.15), /* tests only: a good moment for a mid-play screenshot */
    auto(s,inp){if(s.ph==="climb"){const an=s.t*Math.PI*2*1.8;inp.down={x:GX+22*Math.cos(an),y:GY+22*Math.sin(an)}} /* a finger circling 1.8 times a second: about 7 pushes a second */
      for(const m of s.ms)if(!m.gone&&m.a>.3&&m.y>8){inp.taps=[{x:m.x,y:m.y}];inp.tap=inp.taps[0];break}}
  };
})();
/* ---- Phase 31B: Goalkeeper, developed — Camus's "A Goalkeeper's Glove" ----
   Idea check: playing this, you feel that you can't read the striker (the hints mislead as often as they help), so the only honest move
   is to commit fully to every shot and let the result be what it is. That is Camus's idea of revolt: meeting the absurd head-on without
   needing to win. (Camus played in goal as a young man in Algiers.)
   Stages: I · Penalties (5 shots, 1.4 s windups; the striker's tell matches the kick only about a third of the time) → II · The Storm
   (5 shots, 1.2 s; wind bends the ball and absurd things happen about 40% of the time) → III · Every Ball (6 shots, 0.9 s; the kids
   cheer every dive). Commit (lean + A, or a swipe, or a tap on a third of the goal) during the windup; a dive after the kick can still
   save, but isn't a commitment. Committing on fewer than half the shots of a stage repeats that stage (the only "try over").
   Lanterns count commitments, never saves.
   Phase 45B: the card says the point (choose a side before the kick); the first two shots of Stage I outline the three thirds of the goal
   with a hand mark; a windup bar (all shots) empties as the striker winds up; a gold check marks a commitment, a grey ring a late dive;
   a tap commits to the third of the goal it lands on (left, middle, right); every main action has a soft code-synth sound. */
(function(){
  const ID="goalkeeper",SHOTS=[5,5,6],WIND=[1.4,1.2,.9],FLY=[.6,.55,.48],GAPS=[1,1,.55];
  const px=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(hs(x),hs(y),w,h)};
  const G=()=>{const g=(MINI_ART[ID]&&MINI_ART[ID].goal)||[66,133,90,49];return {x0:g[0],top:g[1],x1:g[0]+g[2],gy:g[1]+g[3],w:g[2],h:g[3]}};
  const zoneX=z=>{const g=G();return [g.x0+19,(g.x0+g.x1)/2,g.x1-19][z]};
  /* ---- sounds (Phase 45B): soft, short, code synth; each has a visual cue (see the notes on each) ---- */
  if(typeof SFX!=="undefined"){
    SFX.goalkeeper_whistle=()=>{aTone(AN(19),.14,{v:.06,type:"sine",a:.01});aTone(AN(19),.26,{v:.06,type:"sine",at:.2,a:.01,to:AN(18)})}; /* the start of Stage I: the striker begins */
    SFX.goalkeeper_runup=()=>{[0,.2,.37,.5,.61].forEach((d,i)=>aNoise(.05,{type:"lowpass",f:260+i*60,v:.05,at:d,a:.005}))}; /* the run-up: the striker leans in */
    SFX.goalkeeper_kick=()=>{aTone(AN(-24),.14,{v:.11,to:AN(-31),type:"triangle",lp:500});aNoise(.16,{f:900,to:1800,q:.6,a:.03,v:.06})}; /* the kick: the striker’s leg, the ball flies */
    SFX.goalkeeper_commit=()=>{aTone(AN(-17),.2,{v:.11,type:"triangle",lp:520,to:AN(-19)});aTone(AN(-5),.08,{v:.04,type:"triangle",at:.02,lp:900})}; /* a firm low tone: the gold check mark */
    SFX.goalkeeper_late=()=>{aTone(AN(-3),.32,{v:.05,type:"sine",lp:420,to:AN(-8)});aNoise(.2,{f:500,to:300,q:.5,a:.04,v:.03})}; /* a soft grey tone: the grey ring */
    SFX.goalkeeper_goal=()=>{aNoise(.4,{f:2200,to:1000,q:.6,v:.06,a:.05});aTone(AN(-19),.5,{v:.05,type:"sine",lp:350,to:AN(-22),a:.05})}; /* a goal conceded: the net ripples, nothing harsh */
    SFX.goalkeeper_post=()=>{aTone(AN(17),.5,{v:.07,type:"triangle",lp:2400});aTone(AN(24),.35,{v:.03,at:.01})}; /* the ball strikes the post */
    SFX.goalkeeper_wind=()=>{aNoise(1.1,{type:"bandpass",f:360,to:840,q:.8,a:.45,v:.05});aNoise(1.1,{type:"bandpass",f:700,to:320,q:.7,a:.5,v:.025,at:.25})}; /* Stage II: the wind (rain slants, the ball bends) */
    SFX.goalkeeper_finish=()=>aArp([0,4,7,12,16],.09,{d:1.1,v:.05,lp:3200}); /* the finish: the gold dusk */
    if(typeof GAP!=="undefined"){GAP.goalkeeper_whistle=.3;GAP.goalkeeper_runup=.3;GAP.goalkeeper_kick=.1;GAP.goalkeeper_commit=.1;GAP.goalkeeper_late=.1;GAP.goalkeeper_goal=.3;GAP.goalkeeper_post=.3;GAP.goalkeeper_wind=.8;GAP.goalkeeper_finish=2}
  }
  const STRIKER={x:150,y:246},FOOT={x:134,y:240},KIDS=[[11,157],[25,156],[39,157]],CAMUS={x:171,y:186};
  let KEEP=null; /* commitments of the stages already played, so Try again (which restarts a stage) keeps the earlier ones */
  function newShot(s){s.zone=Math.floor(Math.random()*3);s.tell=Math.floor(Math.random()*3);  /* independent: the tell matches about a third of the time */
    s.ph="windup";s.phT=0;s.runSnd=0;s.mkT=0;s.commit=null;s.late=null;s.dive=null;s.diveT=0;s.res=null;s.absurd=null;s.final=s.zone;s.curve=0;
    if(s.st===1&&Math.random()<.4){const r=Math.random();s.absurd=r<.34?"post":r<.67?"gust":"gull"}
    if(s.st===1)s.curve=(Math.random()<.5?-1:1)*(6+Math.random()*8)}
  const commits=s=>s.cm.reduce((a,b)=>a+b,0);
  function commit(s,z){if(s.ph!=="windup"||s.commit!=null)return;s.commit=z;s.cm[s.st]++;s.lean=z;s.mkT=0;sfx("goalkeeper_commit")}
  function lateDive(s,z){if(s.ph!=="fly"||s.commit!=null||s.late!=null)return;s.late=z;s.dive=z;s.diveT=0;s.mkT=0;sfx("goalkeeper_late")}
  function kick(s){s.ph="fly";s.phT=0;if(s.commit!=null){s.dive=s.commit;s.diveT=0;sfx("dive")}sfx("goalkeeper_kick");if(s.absurd==="gust")sfx("goalkeeper_wind")
    if(s.absurd==="gull")s.final=(s.zone+1+Math.floor(Math.random()*2))%3;
    if(s.absurd==="post")s.final=1}
  function resolve(s){const g=G(),kz=s.dive;s.ph="after";s.phT=0;
    if(s.absurd==="gust"){s.res="wide";sfx("whiff")}
    else if(kz!=null&&kz===s.final&&s.absurd!=="post"){s.res="save";s.saves++;hitstop(s,.08);sfx("save_thump");const x=zoneX(kz);if(!s.rm)pSparks(s.P,x,g.gy-14,16,"#DDE6F0",46)}
    else{s.res="goal";s.ripple={x:zoneX(s.final),y:g.top+g.h*.55,t:0};if(s.absurd==="post")sfx("goalkeeper_post");sfx("goalkeeper_goal")}
    if(s.dive!=null&&!s.rm){const x=zoneX(s.dive);pDust(s.P,x,g.gy,10,"rgba(90,70,50,.8)")}
    if(s.commit!=null){s.tally++;sfx("chalk")}
    if((s.st===2&&s.dive!=null)||s.res==="save"){s.cheer=1.2;sfx("kids_cheer")}}
  function ballPos(s){const g=G();
    if(s.ph==="windup")return {x:FOOT.x,y:FOOT.y,sc:.55,r:0};
    const k=s.ph==="fly"?Math.min(1,s.phT/FLY[s.st]):1,e=E.out(k),tx=zoneX(s.zone),ty=g.top+g.h*(.35+.3*((s.shotI*7)%3)/2);
    let x=lerp(FOOT.x,tx,e)+Math.sin(Math.PI*k)*s.curve,y=lerp(FOOT.y,ty,e)-Math.sin(Math.PI*k)*18,sc=lerp(.55,.3,e);
    if(s.ph==="after"){const a=Math.min(1,s.phT/.6);
      if(s.res==="save"){x=tx+(tx-96)*a*.6;y=ty+a*a*30-a*14;sc=.3}
      else if(s.res==="wide"){x=tx+(tx<96?-1:1)*a*60+40*a;y=ty-a*20;sc=.3-.1*a}
      else{const fx=zoneX(s.final);x=lerp(tx,fx,Math.min(1,a*2));y=ty+a*(g.gy-ty-4)*.8;sc=.28}}
    else if(s.ph==="fly"&&s.absurd==="post"&&k>.8){const px0=tx<96?G().x0:tx>126?G().x1:tx;x=lerp(x,px0,(k-.8)*5)}
    return {x,y,sc,r:s.t*14}}
  /* ---- drawing ---- */
  function fallbackBg(c){const g=c.createLinearGradient(0,0,0,190);g.addColorStop(0,"#1C1430");g.addColorStop(1,"#5A3A5E");c.fillStyle=g;c.fillRect(0,0,192,190);
    c.fillStyle="#2F3A5A";c.fillRect(0,140,192,42);c.fillStyle="#2A3326";c.fillRect(0,182,192,138);c.fillStyle="#3A3A40";c.fillRect(0,150,46,32);
    const q=G();c.fillStyle="#6A4E36";c.fillRect(q.x0-3,q.top-3,4,q.h+3);c.fillRect(q.x1-1,q.top-3,4,q.h+3);c.fillRect(q.x0-3,q.top-3,q.w+6,4);c.fillStyle="#120D18";c.fillRect(0,252,192,68)}
  function net(c,s){const g=G(),R0=s.ripple,col="rgba(232,228,218,.28)";c.save();c.strokeStyle=col;c.lineWidth=.5;
    const off=(x,y)=>{if(!R0||s.rm)return 0;const d=Math.hypot(x-R0.x,y-R0.y),k=Math.max(0,1-R0.t/1.1);return Math.exp(-d/14)*Math.sin(R0.t*18-d*.35)*3*k};
    c.beginPath();for(let x=g.x0+4;x<g.x1-1;x+=6){for(let y=g.top+3;y<=g.gy;y+=3){const o=off(x,y);if(y===g.top+3)c.moveTo(x+o,y);else c.lineTo(x+o,y+o*.4)}}
    for(let y=g.top+5;y<g.gy;y+=6){for(let x=g.x0+2;x<=g.x1-2;x+=3){const o=off(x,y);if(x===g.x0+2)c.moveTo(x,y+o);else c.lineTo(x+o*.4,y+o)}}c.stroke();c.restore()}
  function tally(c,s,t){const g=G(),x=g.x0-2.5,glowOn=s._glowTally||0;
    for(let i=0;i<s.tally;i++){const grp=Math.floor(i/5),j=i%5,y=g.top+5+grp*9;c.strokeStyle=glowOn?"#FFF1C8":"rgba(240,236,226,.85)";c.lineWidth=.6;c.beginPath();
      if(j<4){c.moveTo(x-2,y+j*1.7);c.lineTo(x+2,y+j*1.7)}else{c.moveTo(x-2.5,y+6.5);c.lineTo(x+2.5,y-1)}c.stroke()}
    if(glowOn&&s.tally)glow(c,x,g.top+5+Math.floor((s.tally-1)/5)*4.5,14,"rgba(255,230,160,.9)",.4*glowOn)}
  function slate(c,t){px(c,5,165,24,14,"#1E1E24");px(c,6,166,22,12,"#2E3036");c.save();c.strokeStyle="rgba(220,220,220,.35)";c.lineWidth=.5;c.beginPath();
    for(let i=0;i<5;i++){const x=8+i*4;c.moveTo(x,169+((i*3)%4));c.quadraticCurveTo(x+2,172,x+1,176-(i%2))}c.stroke();c.fillStyle="rgba(200,200,210,.18)";c.fillRect(7,170,20,4);c.restore()} /* the rain keeps it smeared: never a clear number */
  function kids(c,s,t){KIDS.forEach(([x,y],i)=>{const ch=s.cheer>0&&!s.rm,f=ch?(Math.floor(t/140+i)%2):2;
    if(!mPerson(c,ID,`kid${i}_${f}`,x-8,y-16-(ch&&f===0?1:0))){px(c,x-4,y-12,8,12,["#C8A050","#B04A40","#4A70A0"][i]);px(c,x-3,y-15,6,4,"#D8B090")}})}
  function keeper(c,s,t){const g=G(),gy=g.gy;let x=zoneX(s.dive!=null?s.dive:s.lean!=null?s.lean:1),name="keep_set"+(Math.floor(t/500)%2?"1":""),y=gy-24,w=16,h=24;
    if(s.dive!=null){const k=s.rm?1:Math.min(1,s.diveT/.28),from=zoneX(s.lean!=null&&s.late!=null?s.lean:1);x=lerp(from,zoneX(s.dive),E.out(k));
      if(s.dive===1){name="keep_set";y=gy-24-Math.sin(Math.PI*Math.min(1,s.diveT/.5))*12}else{name=s.dive===0?"keep_dl":"keep_dr";w=24;h=16;y=gy-16-Math.sin(Math.PI*k)*8}}
    else if(s.commit!=null){x=lerp(zoneX(1),zoneX(s.commit),.25)}
    mShadow(c,x,gy,14,.4);if(!mPerson(c,ID,name,x-w/2,y)){px(c,x-w/2+2,y+2,w-4,h-4,"#2F7470");px(c,x-2,y,4,4,"#D8B090")}}
  function striker(c,s,t){const kickF=s.ph!=="windup"&&s.phT<.5&&s.ph==="fly",lean=s.ph==="windup"?Math.min(1,s.phT/(WIND[s.st]*.5)):0,tellA=s.ph==="windup"?clamp((s.phT/WIND[s.st]-.3)/.3,0,1):0;
    const nm=kickF?(s.zone===2?"striker_1":"striker_2"):"striker_0",rot=s.rm?0:(s.tell-1)*.06*tellA+(s.ph==="windup"?Math.sin(t/160)*.015:0);
    mShadow(c,STRIKER.x,STRIKER.y,40,.45);glow(c,STRIKER.x,STRIKER.y-30,34,"rgba(150,160,230,.9)",.12);
    if(!mPiece(c,ID,nm,STRIKER.x,STRIKER.y,{ax:.5,ay:1,rot,sm:true})){px(c,STRIKER.x-10,STRIKER.y-50,20,50,"#8A90B0");px(c,STRIKER.x-6,STRIKER.y-56,12,8,"#A8B0D0")}
    // the tell: a glance and a hip turn toward one third of the goal (it matches the kick only about a third of the time)
    if(tellA>0){const g=G(),tx=zoneX(s.tell);c.save();c.globalAlpha=tellA*.8;c.strokeStyle="rgba(200,210,255,.6)";c.setLineDash([1.5,2.5]);c.lineWidth=.6;c.beginPath();c.moveTo(STRIKER.x-6,STRIKER.y-46);c.lineTo(tx,g.top+g.h*.6);c.stroke();c.restore();
      glow(c,tx,g.top+g.h*.6,12,"rgba(190,200,255,.9)",.35*tellA)}}
  function camus(c,t){mShadow(c,CAMUS.x,CAMUS.y,11,.35);if(!mSprO(c,"camus_"+(Math.floor(t/900)%2),CAMUS.x-8,CAMUS.y-24))px(c,CAMUS.x-5,CAMUS.y-22,10,20,"#9A8060")}
  function hud(c,s){const n=SHOTS[s.st];px(c,4,4,10+n*9,12,"#100B15");for(let i=0;i<n;i++){const X=9+i*9,Y=10,done=i<s.shotI||(i===s.shotI&&s.ph==="after"),cm=s.hist[i];
      c.fillStyle=done?(cm?"#F5C66A":"#4A4066"):i===s.shotI?"#8A7AAA":"#241C38";c.beginPath();c.arc(X,Y,3,0,Math.PI*2);c.fill();if(done&&cm)px(c,X-1,Y-1,1,1,"#FFF7D8")}}
  function leanCue(c,s,t){if(s.ph!=="windup")return;const g=G(),z=s.commit!=null?s.commit:s.lean;if(z==null)return;const x=zoneX(z),a=s.commit!=null?.9:.35+.2*Math.sin(t/120);
    c.save();c.globalAlpha=a;c.strokeStyle=s.commit!=null?"#F5C66A":"rgba(245,198,106,.8)";c.lineWidth=1;c.strokeRect(x-12,g.top+4,24,g.h-6);c.restore()}
  /* ---- Phase 45B: the teaching guides and the commitment marks ---- */
  const teach=s=>s.st===0&&s.shotI<2;
  function hand(c,x,y,a){c.save();c.globalAlpha=a;c.translate(hs(x),hs(y));c.fillStyle="#F2D9B0";c.strokeStyle="#100B15";c.lineWidth=.6;
    c.beginPath();c.rect(-1,-7,2,8);c.fill();c.stroke();c.beginPath();c.rect(-3.2,0,6.4,5.4);c.fill();c.stroke();c.beginPath();c.rect(-5,1.2,1.8,3);c.fill();c.stroke();c.restore()}
  function guide(c,s,t){const g=G(),t3=g.w/3;
    if(s.ph==="windup"){ /* the windup bar: a band that empties while the striker winds up (information, not a timer that punishes) */
      const k=clamp(1-s.phT/WIND[s.st],0,1);c.save();c.fillStyle="rgba(16,11,21,.8)";c.fillRect(g.x0-1,g.gy+4,g.w+2,5);
      c.fillStyle=s.commit!=null?"rgba(245,198,106,.45)":"#F5C66A";c.fillRect(g.x0,g.gy+5,g.w*k,3);c.restore()}
    if(!teach(s)||s.ph!=="windup")return;
    const pulse=s.rm?.5:.5+.5*Math.sin(t/260);
    for(let i=0;i<3;i++){const on=s.commit===i,lean=s.commit==null&&s.lean===i;c.save();c.globalAlpha=on?.9:lean?.7:.28+.14*pulse;c.strokeStyle="#F5C66A";c.lineWidth=on?1.2:.8;
      c.strokeRect(g.x0+i*t3+1.5,g.top+2,t3-3,g.h-4);c.restore()}
    if(s.commit==null){const idx=s.rm?1:Math.floor(t/800)%3,ph=s.rm?0:(t%800)/800,x=g.x0+(idx+.5)*t3,y=g.top+g.h*.62-Math.sin(Math.min(1,ph*2)*Math.PI)*3;hand(c,x,y+4,.9);
      if(!s.rm&&ph>.22&&ph<.6){c.save();c.globalAlpha=.6*(1-(ph-.22)/.38);c.strokeStyle="#F5C66A";c.lineWidth=.8;c.beginPath();c.arc(hs(x),hs(y-2),2+(ph-.22)*18,0,6.3);c.stroke();c.restore()}}}
  function marks(c,s,t){const g=G(),t3=g.w/3;if(s.ph==="done")return;
    const gold=s.commit!=null,z=gold?s.commit:s.late;
    if(teach(s)&&typeof mText==="function"){ /* the caption of the first two shots */
      const msg=gold?"Committed":s.late!=null?"Late dive: doesn’t count":s.ph==="windup"?"Pick a side before the kick":"Choose before the kick";
      mText(c,msg,96,g.top-10,8,gold?"#F5C66A":s.ph==="windup"?"#FFE9B8":"#B8B4C4")}
    if(z==null)return;
    const x=g.x0+(z+.5)*t3,y=g.top+9,k=s.rm?1:Math.min(1,s.mkT/.18),sc=1+(1-E.out(k))*.8,a=s.ph==="after"?clamp(1-(s.phT-.5)/.4,0,1):1;
    c.save();c.globalAlpha=a;c.translate(hs(x),hs(y));c.scale(sc,sc);c.lineCap="round";c.lineJoin="round";
    c.fillStyle="rgba(16,11,21,.72)";c.beginPath();c.arc(0,0,5,0,6.3);c.fill();
    if(gold){c.strokeStyle="#F5C66A";c.lineWidth=.8;c.stroke();c.lineWidth=1.5;c.beginPath();c.moveTo(-2.4,.2);c.lineTo(-.7,2);c.lineTo(2.6,-2);c.stroke()}
    else{c.strokeStyle="rgba(168,168,180,.9)";c.lineWidth=.8;c.setLineDash([1.6,1.2]);c.stroke();c.setLineDash([]);c.lineWidth=1.2;c.beginPath();c.moveTo(-2.4,0);c.lineTo(2.4,0);c.stroke()}
    c.restore()}
  MINI.goalkeeper={
    who:"camus",title:"Goalkeeper",land:"l1",
    setup:["The idea was never a clean sheet. You’ll concede plenty; everyone does.","What matters is meeting every shot, honestly, whether you stop it or not."],
    how:"Choose a side before the kick: tap it, or lean and press A. Saves don’t count.",
    goal:"Choose a side before every kick. Saves don’t matter.",
    ctl:"Tap the left, middle, or right of the goal before the kick (or lean with ← → and press A).",
    again:"You waited to see where it would go. There’s nothing to see. Choose sooner.",
    win:"You didn’t stop them all. Nobody does. But you met every single one, and that’s the whole game.",
    walk:"Leave the gloves on the grass. The next shot doesn’t wait for anybody.",
    stages:["Penalties","The Storm","Every Ball"],
    lines:[null,"Now the wind has opinions too. Commit anyway.","No time to think. Good. Just meet them."],
    pad:true,ab:true,limit:300,long:false,bloomT:3.6,
    fl:["Face all sixteen shots","Commit on at least 14 of the 16","Commit on all 16 (saves never count)"],
    flNext:["Next time, try choosing before more of the kicks.","Next time, try committing to every single shot."],
    rate:s=>{const n=commits(s);return n>=16?3:n>=14?2:1},
    init(s){if(!s.retry)KEEP=null; /* Phase 36: Try again (s.retry) keeps the earlier stages' commitments */Object.assign(s,{st:0,stT:0,shotI:0,cm:[0,0,0],hist:[],tally:0,saves:0,lean:null,cheer:0,ripple:null,P:pfx(),hs:0,rainAcc:0});newShot(s)},
    toStage(s,n){const keep=KEEP;this.init(s);if(n>0){for(let i=0;i<n;i++){s.cm[i]=keep?keep[i]:SHOTS[i];s.tally+=s.cm[i]}KEEP=s.cm.slice();stageUp(s,n);newShot(s)}},
    step(s,dt,inp){
      if(s.hs>0){s.hs-=dt;return}
      s.stT+=dt;s.phT+=dt;s.cheer=Math.max(0,s.cheer-dt);if(s.dive!=null)s.diveT+=dt;if(s.ripple)s.ripple.t+=dt;s.mkT+=dt;
      if(s.sSnd!==s.st&&s.stT>(s.st?.5:.05)){s.sSnd=s.st;if(s.st===0)sfx("goalkeeper_whistle");else if(s.st===1)sfx("goalkeeper_wind")} /* the start of a stage */
      if(s.ph==="windup"&&!s.runSnd&&s.phT>.12){s.runSnd=1;sfx("goalkeeper_runup")}
      // lean with the pad or arrows; A commits to the lean. A swipe (left, right, up = center) or a tap on a third of the goal commits too.
      const dx=inp.dx||0;if(dx<-.3)s.lean=0;else if(dx>.3)s.lean=2;else if(inp.uTap||(inp.dy||0)<-.3)s.lean=1;
      let z=null;if(inp.aTap)z=s.lean!=null?s.lean:1;
      if(inp.swipe)z=inp.swipe==="left"?0:inp.swipe==="right"?2:inp.swipe==="up"?1:z;
      if(inp.tap&&!inp.swipe){const x=inp.tap.x,g3=G(),t3=g3.w/3;z=x<g3.x0+t3?0:x>g3.x0+2*t3?2:1} /* the thirds drawn on the goal */
      if(z!=null){if(s.ph==="windup")commit(s,z);else lateDive(s,z)}
      if(s.ph==="windup"&&s.phT>=WIND[s.st])kick(s);
      else if(s.ph==="fly"&&s.phT>=FLY[s.st])resolve(s);
      else if(s.ph==="after"&&s.phT>=GAPS[s.st]){s.hist[s.shotI]=s.commit!=null;s.shotI++;
        if(s.shotI>=SHOTS[s.st]){
          if(s.cm[s.st]*2<SHOTS[s.st]){s.ph="done";return "end"}   /* fewer than half committed: the stage repeats */
          KEEP=s.cm.slice();if(s.st===2){sfx("goalkeeper_finish");return "win"}stageUp(s);s.shotI=0;s.hist=[]}
        s.lean=null;newShot(s)}
      if(!s.rm){s.rainAcc+=(s.st===1?90:60)*dt;while(s.rainAcc>=1){s.rainAcc--;pRain(s.P,1,"rgba(180,175,220,.5)",s.st===1?-90:-40)}}
      pStep(s.P,dt,s.rm)},
    draw(s,c,t){
      if(!mBg(c,ID,0))fallbackBg(c);
      if(s.st===1)grade(c,"rgba(40,30,70,1)",.18);
      net(c,s);camus(c,t);slate(c,t);kids(c,s,t);keeper(c,s,t);tally(c,s,t);leanCue(c,s,t);guide(c,s,t);
      if(s.ph!=="done"){const b=ballPos(s);mShadow(c,b.x,s.ph==="windup"?FOOT.y+2:G().gy+ (s.ph==="fly"?0:1),10*b.sc,.3);
        if(!mPiece(c,ID,"ball_"+(((Math.floor(b.r)%12)+12)%12),b.x,b.y,{ax:.5,ay:.5,sc:b.sc*1.6,sm:true})){c.fillStyle="#EFE6D0";c.beginPath();c.arc(b.x,b.y,8*b.sc,0,Math.PI*2);c.fill()}
        if(s.absurd==="gull"&&s.ph==="fly"){const k=s.phT/FLY[s.st],gx=lerp(10,180,k),gy=G().top+10-Math.sin(k*9)*3;px(c,gx-3,gy,7,1,"#F0EDE4");px(c,gx-5,gy-1-(Math.floor(t/90)%2),3,1,"#F0EDE4");px(c,gx+3,gy-1-(Math.floor(t/90)%2),3,1,"#F0EDE4")}}
      striker(c,s,t);marks(c,s,t);pDraw(c,s.P,ID);vignette(c,.3);hud(c,s)},
    bloom(s,c,k,t){ /* the storm breaks into a gold dusk; the keeper lies in the mud laughing; the kids pour onto the pitch; the chalk tally glows */
      const fl=s._fl||1,g=G();if(!s._bl){s._bl=1;s.P=pfx();s.ph="done"}
      if(!mBg(c,ID,0))fallbackBg(c);grade(c,"rgba(255,180,90,1)",(.12+.05*fl)*Math.min(1,k/.5),"soft-light");glow(c,150,110,120,"rgba(255,190,110,.9)",(.15+.08*fl)*Math.min(1,k/.6));
      net(c,s);camus(c,t);slate(c,t);s._glowTally=Math.min(1,k/.4);tally(c,s,t);
      const lx=zoneX(1);mShadow(c,lx,g.gy,24,.4);if(!mPerson(c,ID,"keep_lie",lx-12,g.gy-15))px(c,lx-11,g.gy-8,22,8,"#2F7470");
      KIDS.forEach(([x,y],i)=>{const kk=s.rm?1:E.out(clamp((k-.15-i*.08)/.5,0,1)),tx=lx-24+i*20+(i===1?4:0),ty=g.gy+8+(i%2)*6,X=lerp(x,tx,kk),Y=lerp(y,ty,kk)-(s.rm?0:Math.abs(Math.sin(k*18+i))*3*(kk<1?1:.3));
        if(!mPerson(c,ID,`kid${i}_${Math.floor(t/160+i)%2}`,X-8,Y-16))px(c,X-4,Y-12,8,12,"#C8A050")});
      if(!s.rm&&!s._mot){s._mot=1;pMotes(s.P,10+fl*10,"#FFE3A0",[20,90,160,120])}pStep(s.P,s.rm?0:1/60,s.rm);pDraw(c,s.P,ID);vignette(c,.2)},
    _t:{newShot,SHOTS}, /* tests only */
    shotReady:s=>s.ph==="fly"&&s.phT>.15,
    auto(s,inp){if(s.ph==="windup"&&s.commit==null&&s.phT>.3){inp.dx=[-1,0,1][Math.floor(Math.random()*3)];inp.aTap=true}}
  };
})();
/* ---- Phase 31B: Sounding the Idols, developed — Nietzsche's "A Stone Hammer" ----
   Idea check: playing this, you feel that you have to listen before you strike: some grand-looking idols ring hollow and some plain ones
   ring true. That is Nietzsche's idea of sounding out idols with a hammer as with a tuning fork, and then building new values from what's left.
   Stages: I · Tap and Listen (five idols, two hollow) → II · The Gilded (five idols, three hollow, gilded; the plain clay idol always rings
   true; after each sounding, fog rolls in and two idols trade places) → III · The Eternal Idols (Phase 45B: one large statue shaped like the
   Wanderer, six pieces: head, handL, handR, shoulders, chest, base; each try 3 random pieces are true and 3 are hollow; when the 3 hollow
   pieces are gone the 3 true ones glow soft gold).
   A tap sounds an idol; a second tap within 1.5 s strikes it (or B strikes the one under the cursor). Hollow idols shatter; a true idol
   never breaks: the hammer bounces off with a clang, and that counts as a wrong strike. No timer, no try over.
   Deviation from plan 4: Stage II uses 5 plinths (3 hollow), not 6, because the backdrop has room for five. */
(function(){
  const ID="idols",WIN2=1.5,KINDS=["wealth","fame","comfort","crowd","duty","progress"],GRAND=["wealth","fame","progress","crowd"];
  /* Stage III statue (Phase 45B): six pieces, frames in the statue frame in pixels (2 px = 1 unit), origin in units; MINI_ART.idols.wanderer overrides these */
  const WP=["head","handL","handR","shoulders","chest","base"],WPIT={head:5,handL:9,handR:2,shoulders:0,chest:-4,base:-9}; /* pitch of a true piece's ring, in semitones */
  const WFR={head:[73,0,70,61],handL:[0,82,38,86],handR:[182,16,42,124],shoulders:[38,61,144,50],chest:[21,111,189,185],base:[20,296,178,124]},WORG=[40,74],WALK_X=26;
  const WA=()=>(MINI_ART[ID]&&MINI_ART[ID].wanderer)||null;
  const wor=()=>{const A=WA();return A&&A.origin?[A.origin[0]/2,A.origin[1]/2]:WORG};
  const wrect=n=>{const A=WA(),f=(A&&A.frame&&A.frame[n])||WFR[n],o=wor();return [o[0]+f[0]/2,o[1]+f[1]/2,f[2]/2,f[3]/2]}; /* x, y, w, h in units */
  let TW={}; /* gold copies of the pieces, built once the atlas has loaded; dropped in release() */
  const NIETZSCHE={x:180,y:240};
  const px=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(hs(x),hs(y),w,h)};
  const PL=()=>(MINI_ART[ID]&&MINI_ART[ID].plinths)||[[32,178],[65,171],[98,174],[133,181],[169,187]];
  const isz=k=>{const z=mPieceSize(ID,"idol_"+k);return z[0]?z:[28,44]};
  const isc=k=>{const z=isz(k);return Math.min(1,30/z[0],46/z[1])};
  /* ---- the sounds (visual cues: a ripple and dust, a bell ripple with a gold glow, falling shards, sparks and a red flash, fog, idols sliding, the cursor box, a gold glow) ---- */
  if(typeof SFX!=="undefined"){
    SFX.idols_true=p=>{const k=typeof p==="number"&&isFinite(p)?p:0;aTone(AN(12+k),1.6,{v:.1,a:.003});aTone(AN(24+k)*1.003,1.1,{v:.045});aTone(AN(31+k),.7,{v:.025,type:"triangle"});aNoise(.04,{type:"highpass",f:3500,v:.03})}; /* a clear bell */
    SFX.idols_hollow=()=>{aTone(AN(-19),.16,{v:.11,a:.002,to:AN(-26),lp:420});aNoise(.06,{type:"lowpass",f:600,v:.06,a:.002});aTone(97,.2,{type:"sawtooth",v:.035,lp:520,at:.025});aTone(103,.2,{type:"sawtooth",v:.035,lp:520,at:.025})}; /* a dull knock and a short buzz */
    SFX.idols_crash=()=>{aTone(AN(-22),.28,{v:.11,to:AN(-34),lp:380});aNoise(.4,{type:"bandpass",f:3200,to:900,q:.7,a:.004,v:.075});[34,29,25,31].forEach((n,i)=>aTone(AN(n),.1,{v:.035,type:"triangle",at:.03+i*.045,lp:5000}))};
    SFX.idols_clang=()=>{aTone(520,.55,{type:"square",v:.05,lp:2600,a:.002});aTone(790,.4,{type:"square",v:.035,lp:3000,a:.002});aTone(1330,.22,{type:"triangle",v:.04});aNoise(.05,{type:"highpass",f:2500,v:.07,a:.002});aTone(AN(-14),.12,{v:.1,to:AN(-20),lp:500})};
    SFX.idols_fog=()=>{aNoise(.7,{type:"bandpass",f:260,to:620,q:.7,a:.28,v:.07});aTone(AN(-17),.7,{v:.03,a:.25,to:AN(-14),lp:300})};
    SFX.idols_swap=()=>{aNoise(.18,{type:"lowpass",f:500,to:300,v:.06,a:.01});aTone(AN(-12),.1,{v:.05,type:"triangle",lp:900});aTone(AN(-8),.1,{v:.05,type:"triangle",lp:900,at:.09})};
    SFX.idols_stage=()=>{aTone(AN(7),.35,{v:.06,type:"triangle"});aTone(AN(14),.5,{v:.06,type:"triangle",at:.1})};
    SFX.idols_move=()=>aTone(AN(19),.05,{v:.025,type:"triangle",lp:2000});
    SFX.idols_finish=()=>{aArp([0,7,12,16,19,24],.1,{d:1.2,v:.05,lp:3800});aTone(AN(-12),1.8,{v:.04,a:.2,lp:500});aNoise(.9,{f:5000,to:3000,q:.4,a:.3,v:.012})};
    if(typeof GAP!=="undefined"){GAP.idols_true=.2;GAP.idols_hollow=.2;GAP.idols_crash=.15;GAP.idols_clang=.15;GAP.idols_fog=1;GAP.idols_swap=1;GAP.idols_stage=1;GAP.idols_move=.06;GAP.idols_finish=2}
  }
  /* ---- the idols ---- */
  function setIdols(s,kinds,hollow,gild){const P=PL();s.idols=kinds.map((k,i)=>({k,hollow:hollow.includes(i),gild:gild&&k!=="clay",slot:i,x:P[i][0],y:P[i][1],x0:P[i][0],broken:false,snd:-9,sounded:false,crackT:0}));s.cur=2}
  function stage0(s){const ks=shuffle(KINDS.concat(["clay"])).slice(0,5);setIdols(s,ks,shuffle([0,1,2,3,4]).slice(0,2),false)}
  function stage1(s){const grand=shuffle(GRAND.slice()),other=shuffle(["comfort","duty","self"]);
    const ks=shuffle([grand[0],grand[1],grand[2],other[0],"clay"]);const hollow=[];ks.forEach((k,i)=>{if(GRAND.includes(k))hollow.push(i)}); /* the three grandest ring hollow; one gilded idol and the plain clay one ring true */
    setIdols(s,ks,hollow,true)}
  function preW(){const A=WA();if(A){if(A.atlas)mImgE(A.atlas);if(A.bg)mImgE(A.bg)}}
  function stage2(s){preW();s.idols=[];const h=shuffle([0,1,2,3,4,5]).slice(0,3); /* 3 of the 6 pieces ring hollow, a new three each try */
    s.pcs=WP.map((n,i)=>({n,i,hollow:h.includes(i),broken:false,snd:-9,sounded:false,crackT:0}));s.cur=WP.indexOf("chest");s.wx=s.wtx=WALK_X;s.fin=0;s._finS=0}
  function targets(s){return s.st<2?s.idols.filter(o=>!o.broken):s.pcs.filter(o=>!o.broken)}
  const remaining=s=>targets(s).filter(o=>o.hollow).length;
  /* ---- sounding and striking ---- */
  function box(s,o){if(s.st<2){const z=isz(o.k),sc=isc(o.k);return [o.x-z[0]*sc/2-3,o.y-z[1]*sc-3,z[0]*sc+6,z[1]*sc+7]}
    const r=wrect(o.n),w=Math.max(r[2]+4,22),h=Math.max(r[3]+4,22),cx=r[0]+r[2]/2,cy=r[1]+r[3]/2;return [cx-w/2,cy-h/2,w,h]} /* a piece's tap box: its rect plus 2, at least 22 x 22 units */
  const mid=(s,o)=>{if(s.st<2){const b=box(s,o);return {x:b[0]+b[2]/2,y:b[1]+b[3]/2}}const r=wrect(o.n);return {x:r[0]+r[2]/2,y:r[1]+r[3]/2}};
  function hitPiece(s,x,y){let best=null,bd=9;for(const o of s.pcs){if(o.broken)continue;const b=box(s,o);if(x<b[0]-1||x>b[0]+b[2]+1||y<b[1]-1||y>b[1]+b[3]+1)continue;
      const d=Math.max(Math.abs(x-(b[0]+b[2]/2))/(b[2]/2),Math.abs(y-(b[1]+b[3]/2))/(b[3]/2));if(d<bd){bd=d;best=o}}return best} /* the boxes overlap a little: the nearest piece centre wins */
  function sound(s,o){o.snd=s.t;o.sounded=true;const m=mid(s,o);s.lastSound=s.t;
    if(o.hollow){s.waves.push({x:m.x,y:m.y-4,t:0,len:.55,w:18,jag:3,cyc:5,col:"rgba(190,186,200,.95)"});o.crackT=s.st===1?2.2:99;sfx("idols_hollow");pDust(s.P,m.x,m.y+6,6,"rgba(190,180,170,.7)")}
    else{s.waves.push({x:m.x,y:m.y-4,t:0,len:1.5,w:34,jag:0,cyc:3,col:"rgba(255,214,120,.95)",tr:1});sfx("idols_true",s.st===2?WPIT[o.n]:0)}
    s.hamT=0;s.ham="tap";if(s.st===1)s.swapAt=s.t+WIN2}
  function shatterW(s,o){const A=WA();if(!A||!A.rects||!A.rects[o.n])return;const r=A.rects[o.n],rc=wrect(o.n),cols=rc[2]*rc[3]>2000?4:3,w=r[2]/cols,h=r[3]/cols,mx=rc[0]+rc[2]/2,my=rc[1]+rc[3]/2,rm=s.rm; /* the piece breaks into falling chunks of its own picture */
    for(let i=0;i<cols;i++)for(let j=0;j<cols;j++){const cx=rc[0]+(i+.5)*w/2,cy=rc[1]+(j+.5)*h/2;
      pAdd(s.P,{k:"chunk",img:A.atlas,sx:r[0]+i*w,sy:r[1]+j*h,sw:w,sh:h,x:cx,y:cy,vx:(cx-mx)*(rm?0:2.2)+(Math.random()-.5)*10,vy:rm?30:-20-Math.random()*30,g:rm?0:260,vr:rm?0:(Math.random()-.5)*6,life:rm?.6:1.1,fade:true})}}
  function strike(s,o){const m=mid(s,o);s.hamT=0;s.ham="strike";if(!o.sounded)s.unsounded++;
    if(o.hollow){o.broken=true;hitstop(s,.05);sfx("idols_crash");shakeSet(s,2);
      if(s.st<2)shatter(s.P,ID,"idol_"+o.k,o.x,o.y-isz(o.k)[1]*isc(o.k)/2,12,s.rm);else shatterW(s,o);
      pDust(s.P,m.x,m.y+8,14,"rgba(200,190,180,.8)");s.rubble++}
    else{s.wrong++;hitstop(s,.09);sfx("idols_clang");pSparks(s.P,m.x,m.y,s.rm?4:12,"#FFE3A0",50);s.bad=.35}}
  function act(s,o,how){ /* how: "tap" (sound, or strike if sounded within 1.5 s), "a" (sound), "b" (strike) */
    if(!o||o.broken||s.fog>0)return;s.target=o;
    if(how==="b")strike(s,o);else if(how==="tap"&&s.t-o.snd<=WIN2&&s.t-o.snd>.12)strike(s,o);else if(s.t-s.lastSound>=.45)sound(s,o)} /* the hammer needs a breath between soundings */
  function doSwap(s){const live=s.idols.filter(o=>!o.broken);if(live.length<2)return;const a=s.target&&!s.target.broken&&Math.random()<.6?s.target:live[Math.floor(Math.random()*live.length)];
    let b;do{b=live[Math.floor(Math.random()*live.length)]}while(b===a);const P=PL(),sa=a.slot;a.slot=b.slot;b.slot=sa;a.x0=a.x;b.x0=b.x;s.fog=.6;s.swapped++;s._swS=0;sfx("idols_fog")}
  /* ---- drawing ---- */
  function fallbackBg(c,pl){const g=c.createLinearGradient(0,0,0,200);g.addColorStop(0,"#14101F");g.addColorStop(1,"#3A2436");c.fillStyle=g;c.fillRect(0,0,192,200);c.fillStyle="#2A2436";c.fillRect(0,196,192,124);
    if(pl!==false)PL().forEach(([x,y])=>{px(c,x-13,y,26,4,"#8A7A6A");px(c,x-10,y+4,20,30,"#6A5E56")});c.fillStyle="#120D18";c.fillRect(0,252,192,68)}
  function bgDraw(c,s){if(s.st===2){const A=WA(),e=A&&A.bg?mImgE(A.bg):null;if(e&&e.ok){c.drawImage(e.img,0,0,192,320);return}fallbackBg(c,false);return}if(!mBg(c,ID,0))fallbackBg(c)} /* Stage III has its own clearing, with no plinths */
  function drawIdol(c,s,o,t){const k=o.k,z=isz(k),sc=isc(k),x=o.x,y=o.y,a=o.broken?0:1;if(!a)return;
    const t2=s.t-o.snd;let ox=0;if(t2>=0&&t2<.35&&!s.rm)ox=Math.sin(t2*60)*(o.hollow?.8:.3);
    if(o.gild){const tc=mTint(ID,"idol_"+k,"#E6B040",.6);if(mCanvas(c,tc,x+ox,y,{ax:.5,ay:1,sc,sm:true})){const pulse=s.rm?.15:.12+.12*Math.sin(t/500+o.x*.1);mCanvas(c,tc,x+ox,y,{ax:.5,ay:1,sc,sm:true,comp:"lighter",a:pulse})}else fallbackIdol(c,x,y,o)}
    else if(!mPiece(c,ID,"idol_"+k,x+ox,y,{ax:.5,ay:1,sc,sm:true}))fallbackIdol(c,x,y,o);
    if(o.crackT>0&&o.hollow){c.save();c.globalAlpha=Math.min(1,o.crackT);c.strokeStyle="#100B15";c.lineWidth=.7;c.beginPath();const top=y-z[1]*sc;c.moveTo(x-2,top+6);c.lineTo(x+2,top+14);c.lineTo(x-1,top+22);c.lineTo(x+3,top+30);c.stroke();c.restore()}}
  function fallbackIdol(c,x,y,o){px(c,x-9,y-38,18,38,o.gild?"#C8A040":o.k==="clay"?"#A07858":"#8E8698");px(c,x-6,y-44,12,7,o.gild?"#E0C060":"#9E96A8")}
  function wTint(n){const A=WA();if(!A||!A.rects||!A.rects[n])return null;const e=mImgE(A.atlas);if(!e||!e.ok)return null;if(TW[n])return TW[n];const r=A.rects[n],cv=document.createElement("canvas");cv.width=r[2];cv.height=r[3];const g=cv.getContext("2d");
    g.drawImage(e.img,r[0],r[1],r[2],r[3],0,0,r[2],r[3]);g.globalCompositeOperation="source-atop";g.globalAlpha=.6;g.fillStyle="#F2C25A";g.fillRect(0,0,r[2],r[3]);return TW[n]=cv}
  function fallbackPiece(c,n,x,y,w,h,gl){const hx=hs(x),hy=hs(y),col={head:"#9A8E98",handL:"#A89CA4",handR:"#A89CA4",shoulders:"#A8989F",chest:"#9C8E96",base:"#8E8088"}[n];
    c.fillStyle=col;c.fillRect(hx,hy,w,h);c.fillStyle="rgba(16,11,21,.35)";c.fillRect(hx,hy+h-2,w,2);
    if(n==="head"){c.fillStyle="#2A2230";c.fillRect(hx+w*.3,hy+h*.35,w*.4,h*.4)}
    else if(n==="handL"){c.fillStyle="#F2B84A";c.fillRect(hx+w*.15,hy+h*.55,w*.7,h*.35)}
    else if(n==="handR"){c.fillStyle="#7A6A64";c.fillRect(hx+w*.55,hy,3,h)}
    else if(n==="chest"){c.fillStyle="rgba(16,11,21,.3)";c.fillRect(hx+w*.42,hy+4,w*.16,h-8)}
    else if(n==="base"){c.strokeStyle="rgba(16,11,21,.5)";c.lineWidth=.7;c.beginPath();c.moveTo(hx+w*.2,hy+h*.3);c.lineTo(hx+w*.4,hy+h*.55);c.lineTo(hx+w*.35,hy+h*.85);c.stroke()}
    if(gl){c.save();c.globalAlpha=gl*.6;c.fillStyle="#F2C25A";c.fillRect(hx,hy,w,h);c.restore()}}
  function drawStatue(c,s,t,al){const A=WA(),e=A&&A.atlas?mImgE(A.atlas):null,k=s.fin>0?clamp(s.fin/(s.rm?.5:1.4),0,1):0;
    if(al!=null&&al<1){c.save();c.globalAlpha=al}
    for(const o of s.pcs){if(o.broken)continue;const r=wrect(o.n),t2=s.t-o.snd,ox=t2>=0&&t2<.35&&!s.rm?Math.sin(t2*60)*(o.hollow?.8:.3):0,gl=!o.hollow?k:0;
      if(e&&e.ok&&A.rects&&A.rects[o.n]){const q=A.rects[o.n];mDraw(c,e.img,q,r[0]+ox,r[1],r[2],r[3]);if(gl>0){const tc=wTint(o.n);if(tc){mDraw(c,tc,[0,0,tc.width,tc.height],r[0]+ox,r[1],r[2],r[3],{a:gl*.38});mDraw(c,tc,[0,0,tc.width,tc.height],r[0]+ox,r[1],r[2],r[3],{comp:"lighter",a:gl*(s.rm?.06:.06+.05*Math.sin(t/260+o.i))})}}}
      else fallbackPiece(c,o.n,r[0]+ox,r[1],r[2],r[3],gl);
      if(gl>0)glow(c,r[0]+r[2]/2,r[1]+r[3]/2,Math.max(r[2],r[3])*.7,"rgba(255,205,120,.9)",.2*gl);
      if(o.crackT>0&&o.hollow){c.save();c.globalAlpha=Math.min(1,o.crackT);c.strokeStyle="#100B15";c.lineWidth=.8;const cx=r[0]+r[2]/2,cy=r[1]+r[3]/2;c.beginPath();c.moveTo(cx-3,cy-r[3]*.3);c.lineTo(cx+2,cy-r[3]*.08);c.lineTo(cx-2,cy+r[3]*.12);c.lineTo(cx+3,cy+r[3]*.3);c.stroke();c.restore()}}
    if(al!=null&&al<1)c.restore()}
  function wanderer(c,s,t){const x=s.wx,y=s.st<2?226:250;mShadow(c,x,y,12,.4);if(!mSprO(c,"wanderer_right_"+(Math.abs(s.wx-s.wtx)>1&&!s.rm?1+Math.floor(t/150)%2:0),x-8,y-24))px(c,x-5,y-22,10,20,"#2F7470");
    const k=s.rm?1:Math.min(1,s.hamT/(s.ham==="strike"?.28:.2));let f=7;if(s.ham==="tap")f=k<.5?0:1;else if(s.ham==="strike")f=k<.3?6:k<.6?0:k<.85?1:2;if(s.hamT>.6)f=7;
    if(!mPiece(c,ID,"hammer_"+f,x+7,y-13,{ax:.5,ay:.5,sc:.55,sm:true}))px(c,x+6,y-20,2,12,"#8A6A4A")}
  function cursor(c,s,t){const o=curTarget(s);if(!o)return;const b=box(s,o),m=mid(s,o),pulse=s.rm?1:.6+.4*Math.sin(t/160);
    c.save();c.globalAlpha=.5+.4*pulse;c.strokeStyle="#F5C66A";c.setLineDash([2,2]);c.lineWidth=.8;c.strokeRect(b[0],b[1],b[2],b[3]);c.restore();
    const armed=s.t-o.snd<=WIN2&&o.snd>0;if(armed){ring(c,m.x,b[1]-6,4,1-(s.t-o.snd)/WIN2,"#FFE9A8",1.2)}}
  function curTarget(s){if(s.st<2){return s.idols.find(o=>o.slot===s.cur&&!o.broken)||null}const o=s.pcs[s.cur];return o&&!o.broken?o:s.pcs.find(x=>!x.broken)||null}
  function moveCur(s,d){const c0=s.cur;if(s.st<2){const live=s.idols.filter(o=>!o.broken).map(o=>o.slot).sort((a,b)=>a-b);if(!live.length)return;let i=live.indexOf(s.cur);if(i<0)i=0;else i=(i+d+live.length)%live.length;s.cur=live[i]}
    else moveP(s,d,0);if(s.cur!==c0)sfx("idols_move")}
  function moveSec(s,d){if(s.st<2)return;const c0=s.cur;moveP(s,0,d);if(s.cur!==c0)sfx("idols_move")}
  function moveP(s,dx,dy){const cur=curTarget(s);if(!cur)return;const m=mid(s,cur);let best=null,bs=1e9,far=null,fs=1e9; /* the nearest live piece in that direction; none there: wrap to the far side */
    for(const o of s.pcs){if(o.broken||o===cur)continue;const q=mid(s,o),al=dx?(q.x-m.x)*dx:(q.y-m.y)*dy,ac=dx?Math.abs(q.y-m.y):Math.abs(q.x-m.x);
      if(al>2){const v=al+ac*1.2;if(v<bs){bs=v;best=o}}else{const v=al+ac*.01;if(v<fs){fs=v;far=o}}}
    const to=best||far;if(to)s.cur=to.i}
  function waves(c,s){for(const w of s.waves){const k=w.t/w.len,a=1-k;if(a<=0)continue;c.save();c.globalAlpha=a;
      if(w.tr){for(let r=0;r<2;r++){const rr=6+(k*24+r*10)%24;c.strokeStyle=w.col;c.lineWidth=.8;c.beginPath();c.ellipse(w.x,w.y,rr,rr*.55,0,0,Math.PI*2);c.stroke()}glow(c,w.x,w.y,20,"rgba(255,210,120,.9)",.35*a)}
      wave(c,w.x-w.w/2-k*6,w.y-26,w.w+k*12,w.tr?2.6:3.2,w.cyc,s.t*(w.tr?7:16),w.jag,w.col,w.tr?1:.9);c.restore()}}
  function hud(c,s){const n=remaining(s);px(c,4,4,14+Math.max(1,n)*8,12,"#100B15");c.fillStyle="#8E8698";for(let i=0;i<n;i++){c.beginPath();c.moveTo(12+i*8,7);c.lineTo(15+i*8,13);c.lineTo(9+i*8,13);c.closePath();c.fill();px(c,11.5+i*8,9,1,2,"#100B15")}}
  MINI.idols={
    who:"nietzsche",title:"Sounding the Idols",land:"l1",
    setup:["Philosophizing with a hammer isn’t smashing whatever’s in reach.","It’s tapping, listening, and striking only the one that already rings hollow."],
    how:"Tap an idol to hear it. Tap a hollow one again to break it. Leave the true ones.",
    goal:"Break every hollow idol, and leave the true ones standing.",
    ctl:"Tap an idol to sound it; tap it again to strike (arrow keys move, Z sounds, X strikes).",
    win:"Some rang true, some rang hollow. Now build something with what’s left.",
    walk:"Leave the hammer on the stone. The idols will still be ringing when you’re ready.",
    stages:["Tap and Listen","The Gilded","The Eternal Idols"],
    lines:[null,"Gold paint makes a thing look true. Listen anyway.","The oldest idols are the biggest. And yes, that one looks like you."],
    pad:true,ab:true,limit:300,long:false,bloomT:3.8,
    fl:["Break every hollow idol","Break them with at most 1 wrong strike","No wrong strikes, and every idol heard before it was struck"],
    flNext:["Next time, listen twice before you swing at a true one.","Next time, sound every idol before you strike it, and strike only the hollow."],
    rate:s=>s.wrong===0&&s.unsounded===0?3:s.wrong<=1?2:1,
    init(s){Object.assign(s,{st:0,stT:0,idols:[],pcs:[],fin:0,_finS:0,_sSt:-1,_swS:1,cur:2,wx:96,wtx:96,waves:[],P:pfx(),wrong:0,unsounded:0,rubble:0,fog:0,swapAt:0,swapped:0,ham:"",hamT:9,bad:0,target:null,lastSound:-9,next:0,hs:0,shk:0});stage0(s);s.wx=s.wtx=PL()[2][0]-10;preW()}, /* preW: the statue's own atlas and backdrop (MINI_ART.idols.wanderer) load with the game */
    release(){TW={}}, /* the gold copies of the statue pieces */
    toStage(s,n){this.init(s);if(n===1){stageUp(s,1);stage1(s)}else if(n===2){stageUp(s,2);stage2(s)}},
    step(s,dt,inp){
      if(s.hs>0){s.hs-=dt;return}
      s.stT+=dt;s.hamT+=dt;s.bad=Math.max(0,s.bad-dt);s.waves=s.waves.filter(w=>(w.t+=dt)<w.len);
      if(s._sSt!==s.st){s._sSt=s.st;sfx("idols_stage")} /* the start of each stage */
      for(const o of s.st<2?s.idols:s.pcs)if(o.crackT>0&&o.crackT<50)o.crackT=Math.max(0,o.crackT-dt);
      if(s.next>0){s.next-=dt;if(s.next<=0){s.next=0;if(s.st===0){stageUp(s);stage1(s)}else if(s.st===1){stageUp(s);stage2(s)}}pStep(s.P,dt,s.rm);return}
      // Stage II: after each sounding, fog rolls in and two idols trade places
      if(s.st===1&&s.swapAt&&s.t>=s.swapAt&&s.fog<=0){s.swapAt=0;doSwap(s)}
      if(s.fog>0){s.fog=Math.max(0,s.fog-dt);if(!s._swS&&s.fog<.3){s._swS=1;sfx("idols_swap")}const P=PL(),k=s.rm?1:E.inOut(1-s.fog/.6);for(const o of s.idols){const tx=P[o.slot][0];o.x=lerp(o.x0,tx,k);o.y=P[o.slot][1]}}
      else{
        if(inp.lTap||(inp.dx<-.5&&!s._dx))moveCur(s,-1);if(inp.rTap||(inp.dx>.5&&!s._dx))moveCur(s,1);if(inp.uTap||(inp.dy<-.5&&!s._dy))moveSec(s,-1);if(inp.dTap||(inp.dy>.5&&!s._dy))moveSec(s,1);
        for(const tp of inp.taps||[]){const T=s.st<2?targets(s).find(o=>{const b=box(s,o);return tp.x>=b[0]-2&&tp.x<=b[0]+b[2]+2&&tp.y>=b[1]-2&&tp.y<=b[1]+b[3]+2}):hitPiece(s,tp.x,tp.y);
          if(T){if(s.st<2)s.cur=T.slot;else s.cur=T.i;act(s,T,"tap");break}}
        if(inp.aTap)act(s,curTarget(s),"a");if(inp.bTap)act(s,curTarget(s),"b")}
      s._dx=Math.abs(inp.dx||0)>.5;s._dy=Math.abs(inp.dy||0)>.5;
      const o=curTarget(s);if(s.st===2)s.wtx=WALK_X;else if(o){const m=mid(s,o);s.wtx=clamp(m.x-12,10,170)}s.wx+=(s.wtx-s.wx)*Math.min(1,dt*(s.rm?60:9));
      pStep(s.P,dt,s.rm);
      if(remaining(s)===0&&s.fog<=0&&!s.next){if(s.st===2){ /* the three hollow pieces are gone: the three true ones glow soft gold, then the bloom */
          if(!s._finS){s._finS=1;sfx("idols_finish");if(!s.rm)pMotes(s.P,14,"#FFE3A0",[40,100,112,170])}s.fin+=dt;if(s.fin>=(s.rm?.9:2.2))return "win"}else{s.next=1.1;sfx("chime")}}},
    draw(s,c,t){c.save();shakeApply(c,s);
      bgDraw(c,s);if(s.st===1)grade(c,"rgba(40,30,60,1)",.12);
      if(s.st<2){const sorted=s.idols.slice().sort((a,b)=>a.y-b.y);sorted.forEach(o=>drawIdol(c,s,o,t))}else drawStatue(c,s,t);
      if(!mSprO(c,"nietzsche_"+(Math.floor(t/900)%2),NIETZSCHE.x-8,NIETZSCHE.y-24))px(c,NIETZSCHE.x-5,NIETZSCHE.y-22,10,20,"#2E2A26");
      cursor(c,s,t);wanderer(c,s,t);waves(c,s);pDraw(c,s.P,ID);
      if(s.fog>0){const k=Math.sin(Math.PI*(1-s.fog/.6));c.save();c.globalAlpha=(s.rm?.5:.75)*k;const g=c.createLinearGradient(0,110,0,230);g.addColorStop(0,"rgba(120,110,140,0)");g.addColorStop(.5,"rgba(150,140,170,1)");g.addColorStop(1,"rgba(120,110,140,0)");c.fillStyle=g;c.fillRect(0,100,192,140);c.restore()}
      if(s.bad>0&&!s.rm)grade(c,"rgba(160,60,40,1)",s.bad*.25);
      c.restore();vignette(c,.35);hud(c,s)},
    bloom(s,c,k,t){ /* the rubble rolls together into a new pillar, and a flame lights on top as dawn breaks over the ruins. More lanterns: more of the pillar glows. */
      const fl=s._fl||1;if(!s._bl){s._bl=1;s.P=pfx()}
      bgDraw(c,s);grade(c,"rgba(255,180,100,1)",(.1+.05*fl)*Math.min(1,k/.5),"soft-light");
      if(s.pcs&&s.pcs.length)drawStatue(c,s,t,1-.75*Math.min(1,k/.5)); /* the true pieces fade back so the new pillar reads in front */
      const n=10,bx=96,by=250,kk=s.rm?1:k;
      for(let i=0;i<n;i++){const ki=clamp((kk-i*.045)/.25,0,1);if(ki<=0)continue;const w=22-(i%3)*2+(i===0?6:0),h=7,y=by-(i+1)*h,x=bx-w/2+((i*5)%3-1),
          from={x:bx+(i%2?-70:70)*(1-i/n),y:by+10};const X=lerp(from.x,x,E.out(ki)),Y=lerp(from.y,y,E.out(ki));
        px(c,X,Y,w,h-1,["#8A7A74","#7A6A66","#94847C"][i%3]);px(c,X,Y,w,1,"#B0A098");if(i<fl*3+1&&ki>=1)glow(c,X+w/2,Y+3,10,"rgba(255,200,110,.9)",.25)}
      const f=clamp((kk-.62)/.2,0,1),top=by-n*7;if(f>0){glow(c,bx,top-6,26+fl*6,"rgba(255,190,90,.95)",.55*f);c.save();c.globalAlpha=f;
        for(let i=0;i<3;i++){const fh=10-i*3+(s.rm?0:Math.sin(t/90+i)*1.5);c.fillStyle=["#E0602A","#F5A03A","#FFE3A0"][i];c.beginPath();c.moveTo(bx-5+i*1.6,top);c.quadraticCurveTo(bx,top-fh*2,bx+5-i*1.6,top);c.fill()}c.restore()}
      if(!mSprO(c,"nietzsche_0",NIETZSCHE.x-8,NIETZSCHE.y-24))px(c,NIETZSCHE.x-5,NIETZSCHE.y-22,10,20,"#2E2A26");
      if(!s.rm&&!s._mot){s._mot=1;pMotes(s.P,8+fl*8,"#FFE3A0",[40,120,110,120])}pStep(s.P,s.rm?0:1/60,s.rm);pDraw(c,s.P,ID);vignette(c,.25)},
    _t:{targets,mid,box,WIN2}, /* tests only */
    shotReady:s=>s.waves.length>0&&s.waves[0].t>.15,
    auto(s,inp){if(s.fog>0||s.next>0||s.hs>0||s.fin>0)return;if((s._at=(s._at||0)+1)%6)return;
      const T=targets(s);const armed=T.find(o=>o.hollow&&o.sounded&&s.t-o.snd<=WIN2&&s.t-o.snd>.2);
      let o=armed||T.find(o=>!o.sounded)||T.find(o=>o.hollow);if(!o)return;const m=mid(s,o);inp.taps=[{x:m.x,y:m.y}];inp.tap=inp.taps[0]},
    _dbg:s=>({wrong:s.wrong,unsounded:s.unsounded,swapped:s.swapped})
  };
})();
/* ---- Phase 31C: Open Together, developed — Simone de Beauvoir's "A Ring of Cage Keys" ----
   Idea check: playing this, you feel that you can't free yourself alone: every key you turn moves other people's locks too, and the last
   gate only opens when everyone pulls together. That is de Beauvoir's idea that to will oneself free is also to will others free.
   Stages: I · The Ring (six cages around yours; a key toggles its cage and both neighbors; yours opens only when all six are open) →
   II · The Web of Chains (seven cages in the plaza; a key toggles its cage and every cage chained to it; freed people pick up golden threads)
   → III · The Great Gate (hold A and B together, or two fingers, to pull; letting go of either stalls it; every freed person pulls too).
   Puzzles start from all-open with random key turns applied, so they're always solvable; a faint hint glows after 20 s (15 s in II) without
   progress. No timer. Stage II's seven cages hold the town's own folk (map sprites); Stage I's six stay on as helpers.
   The plate is skipped for now (cages-plate to be regenerated), so the code bloom's last frame holds.
   Phase 45B (Cade's play note: "show which cages a key will toggle before the player presses it"): in Stages I and II a first tap SELECTS a cage
   and previews its key (gold rings on the selected cage and every cage the key will turn, a small lock mark on each showing the state it will
   become, thin gold lines along the chains); a second tap on the same cage turns the key; a tap on another cage moves the selection; a tap on bare
   ground clears it. Pad and keys: arrows move a cursor from cage to cage (the cursor's cage is always previewed), A turns. Previewing is free:
   turns are counted only when a key turns. Stage III is unchanged. The game now has its own sounds, each with a visual cue. */
(function(){
  const ID="cages",NAMES=["oldwoman","child","scholar","laborer","youngwoman","oldman"],FOLK=["crowd_a","crowd_b","crowd_c","crowd_a","crowd_b","crowd_c","crowd_a"];
  const px=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(hs(x),hs(y),w,h)};
  const AR=()=>MINI_ART[ID]||{};
  /* the sounds (visual cues: gold ring pops, shackle flips, door swings, sparks, gate glow, hand ring pulse) */
  if(typeof SFX!=="undefined"){
    SFX.cages_select=()=>{aTone(AN(19),.05,{type:"triangle",v:.08,lp:4200});aTone(AN(31),.03,{type:"sine",v:.04,at:.012});aNoise(.025,{f:5200,q:1,v:.03})};
    SFX.cages_clear=()=>aTone(AN(9),.07,{type:"sine",v:.04,to:AN(4),lp:2400});
    SFX.cages_turn=()=>{aTone(AN(-8),.16,{type:"triangle",v:.09,to:AN(-3),lp:900});aTone(1100,.03,{type:"square",v:.04,lp:2400,at:.2});aNoise(.04,{f:2400,v:.05,at:.2})};
    SFX.cages_chime=n=>{const st=[12,16,19,24];for(let i=0;i<Math.min(st.length,1+(n|0));i++)aTone(AN(st[i]),.5,{type:"sine",v:.06,at:i*.06})};
    SFX.cages_all=()=>aArp([12,16,19,24,28],.09,{d:.7,v:.05,lp:4000});
    SFX.cages_stage=()=>{aTone(AN(7),.3,{type:"sine",v:.05});aTone(AN(14),.4,{type:"sine",v:.05,at:.1})};
    SFX.cages_gate=p=>{const k=p||0;aTone(65+k*60,.55,{to:85+k*70,type:"triangle",v:.1,a:.1,lp:420+k*380});aNoise(.5,{type:"lowpass",f:280+k*400,v:.05,a:.1})};
    SFX.cages_slip=()=>aTone(AN(-14),.2,{type:"triangle",v:.07,to:AN(-19),lp:520});
    SFX.cages_finish=()=>{aTone(AN(-12),.9,{type:"triangle",v:.09,to:AN(0),a:.15,lp:900});aArp([12,19,24,28],.12,{d:.9,v:.05,lp:4200,at:.2})};
    if(typeof GAP!=="undefined"){GAP.cages_select=.06;GAP.cages_clear=.1;GAP.cages_turn=.2;GAP.cages_chime=.2;GAP.cages_all=.5;GAP.cages_stage=.5;GAP.cages_gate=.5;GAP.cages_slip=.8;GAP.cages_finish=1}
  }
  const RING=()=>AR().ring||[[96,178],[140,194],[140,226],[96,242],[52,226],[52,194]],YOU=()=>AR().you||[96,210];
  const PLAZA=()=>AR().plaza||[[44,180],[96,174],[148,180],[70,208],[122,208],[44,238],[148,238]];
  const CHAINS=()=>AR().chains||[[0,1],[1,2],[0,3],[1,3],[1,4],[2,4],[3,5],[4,6],[5,6]];
  const GATE=()=>AR().gate||[102,150,.78];
  const HELP=[[18,166],[34,160],[160,160],[176,166],[14,196],[178,196]]; /* where Stage I's freed six stand in the plaza */
  /* ---- the puzzle: toggle masks, and the fewest turns from any state (breadth-first search from all-open) ---- */
  function graph(n,edges){const m=[];for(let i=0;i<n;i++)m.push(1<<i);edges.forEach(([a,b])=>{m[a]|=1<<b;m[b]|=1<<a});
    const full=(1<<n)-1,dist=new Int8Array(1<<n).fill(-1),q=[full];dist[full]=0;
    while(q.length){const st=q.shift();for(const t of m){const nx=st^t;if(dist[nx]<0){dist[nx]=dist[st]+1;q.push(nx)}}}return {n,m,full,dist}}
  let G1=null,G2=null;
  const g1=()=>G1||(G1=graph(6,[0,1,2,3,4,5].map(i=>[i,(i+1)%6])));
  const g2=()=>{const E=CHAINS();if(!G2||G2.src!==E){G2=graph(7,E);G2.src=E}return G2};
  const gr=s=>s.st===0?g1():g2();
  function scramble(s,k){const G=gr(s);let st;do{st=G.full;const keys=shuffle([...Array(G.n).keys()]).slice(0,k);keys.forEach(i=>st^=G.m[i])}while(G.dist[st]<=0);return st}
  function bestKey(s){const G=gr(s),d=G.dist[s.mask];for(let i=0;i<G.n;i++)if(G.dist[s.mask^G.m[i]]===d-1)return i;return -1}
  function setup(s,n){s.st=n;s.turns=0;s.hintT=0;s.keyAnim=null;s.clear=0;
    if(n<2){const G=gr(s);s.mask=scramble(s,n===0?2:3);s.min=G.dist[s.mask];s.bestD=s.min;s.cur=0;s.sel=-1;s.ghost=null;s.selT=1}
    else{s.pull=0;s.oneT=s.oneT||0}}
  const isOpen=(s,i)=>!!(s.mask>>i&1);
  function turn(s,i){if(s.st>1||s.clear||s.keyAnim)return;const G=gr(s);if(i<0||i>=G.n)return;s.keyAnim={i,t:0};s.turns++;s.extra[s.st]=Math.max(0,s.turns-s.min);sfx("cages_turn")}
  function applyTurn(s,i){const G=gr(s),before=s.mask;s.mask^=G.m[i];if(G.m[i]!==1<<i)sfx("chain_rattle");let nOpen=0,nShut=0;
    for(let j=0;j<G.n;j++){const was=before>>j&1,now=s.mask>>j&1;if(was!==now){s.doors[s.st][j]={t:0,open:!!now};if(now)nOpen++;else nShut++}}
    if(nShut)sfx("bolt");if(nOpen&&s.mask!==G.full)sfx("cages_chime",nOpen);
    const d=G.dist[s.mask];if(d<s.bestD){s.bestD=d;s.hintT=0}
    s.extra[s.st]=Math.max(0,s.turns-s.min);
    if(s.mask===G.full){s.clear=1.8;sfx("cages_all");if(s.st===0)s.youOpen=0;if(!s.rm){const P=s.st===0?RING():PLAZA();P.forEach(q=>pSparks(s.P,q[0],q[1]-18,4,"#F5C66A",34))}}}
  /* ---- Phase 45B: see before you turn ---- */
  const pvIdx=s=>s.st>1?-1:s.keyAnim?s.keyAnim.i:s.sel>=0?s.sel:s.kb?s.cur:-1; /* the cage whose key is being previewed, or -1 */
  const DIRV={l:[-1,0],r:[1,0],u:[0,-1],d:[0,1]};
  function cursorMove(s,pos,d){const n=pos.length,f=pos[s.cur],v=DIRV[d];let best=-1,bs=1e9; /* the nearest cage in that direction; with none there, the next one around the ring */
    for(let i=0;i<n;i++){if(i===s.cur)continue;const dx=pos[i][0]-f[0],dy=pos[i][1]-f[1],al=dx*v[0]+dy*v[1],pe=Math.abs(dx*v[1]-dy*v[0]);
      if(al>2&&pe<=al*1.7){const sc=al+pe*.8;if(sc<bs){bs=sc;best=i}}}
    return best>=0?best:(s.cur+(d==="l"||d==="u"?n-1:1))%n}
  function tapCage(pos,tp){let bi=-1,bd=15;pos.forEach((p,i)=>{const d=Math.hypot(tp.x-p[0],(tp.y-(p[1]-15))*.6);if(d<bd){bd=d;bi=i}});return bi}
  /* a small padlock: k 0 shackle closed .. 1 shackle open (lifted and swung aside); sx squeezes it sideways for the flip when a key turns */
  function lockMark(c,x,y,k,col,sx){c.save();c.translate(hs(x),hs(y));c.scale(Math.max(.3,sx==null?1:sx),1);c.fillStyle="#100B15";c.beginPath();c.arc(0,0,6.5,0,6.3);c.fill();
    c.strokeStyle=col;c.lineWidth=1.2;c.beginPath();c.arc(0,0,6.5,0,6.3);c.stroke();
    c.lineCap="round";c.lineJoin="round";c.save();c.translate(-2.2,0);c.rotate(-k*.75);c.beginPath();c.moveTo(0,.5-k*1.5);c.lineTo(0,-2.6);c.arc(2.2,-2.6,2.2,Math.PI,0);c.lineTo(4.4,-2.6+(1-k)*3.1);c.stroke();c.restore();
    c.fillStyle=col;c.fillRect(-3.4,.4,6.8,4.4);c.fillStyle="#100B15";c.fillRect(-.5,1.6,1,1.8);c.restore()}
  /* the preview of one key: rings, gold lines along the chains, and a lock mark on every cage it will turn */
  function preview(c,s,pos,t,p,al,flip){if(p<0||al<=0||!pos[p])return;const G=gr(s),A=pos[p];s.pvLog=[];c.save();c.globalAlpha=al;
    c.lineCap="round";c.strokeStyle="rgba(245,198,106,.85)";c.lineWidth=.9;c.setLineDash([2,1.5]);if(!s.rm)c.lineDashOffset=-t/90;
    for(let j=0;j<G.n;j++)if(j!==p&&(G.m[p]>>j&1)){const B=pos[j];c.beginPath();c.moveTo(A[0],A[1]-18);c.lineTo(B[0],B[1]-18);c.stroke()}
    c.setLineDash([]);
    for(let j=0;j<G.n;j++)if(G.m[p]>>j&1){const q=pos[j],me=j===p,pop=me&&!s.rm?Math.max(0,1-s.selT/.25)*3:0;
      glow(c,q[0],q[1]-16,16+pop,"rgba(255,214,110,.9)",me?.2:.12);
      c.strokeStyle=me?"#F5C66A":"rgba(245,198,106,.85)";c.lineWidth=me?1.5:1;c.beginPath();c.ellipse(hs(q[0]),hs(q[1]-16),13+pop,20+pop,0,0,6.3);c.stroke();
      if(me){c.lineWidth=.7;c.beginPath();c.ellipse(hs(q[0]),hs(q[1]-16),10,17,0,0,6.3);c.stroke()}}
    for(let j=0;j<G.n;j++)if(G.m[p]>>j&1){const q=pos[j],to=isOpen(s,j)?0:1;s.pvLog.push([j,to]);lockMark(c,q[0]+10,q[1]-31,to,to?"#F5C66A":"#C9C0E8",flip>0?Math.abs(Math.cos(flip*Math.PI*2)):1)}
    c.restore()}
  function previewAll(c,s,pos,t){if(s.ghost)preview(c,s,pos,t,s.ghost.i,1-s.ghost.t/.25,0);
    s.pvLog=null;const a=s.keyAnim;preview(c,s,pos,t,pvIdx(s),1,a?(s.rm?(a.t>.18?1:0):clamp((a.t-.1)/.22,0,1)):0)}
  /* ---- drawing ---- */
  function fallbackBg(c){const g=c.createLinearGradient(0,0,0,170);g.addColorStop(0,"#161226");g.addColorStop(1,"#3A3450");c.fillStyle=g;c.fillRect(0,0,192,170);c.fillStyle="#3A3244";c.fillRect(0,150,192,170);
    c.fillStyle="#241E30";c.fillRect(70,70,64,84);c.fillStyle="#4A4466";c.fillRect(80,84,44,70);c.fillStyle="#120D18";c.fillRect(0,252,192,68)}
  function doorK(s,st,i){const d=s.doors[st][i];if(!d)return isOpen(s,i)?1:0;const k=s.rm?1:Math.min(1,d.t/.35);return d.open?k:1-k}
  function cage(c,x,y,k,glowOn,t){ /* k: 0 closed .. 1 open (the door swings) */
    if(glowOn){const g=s=>.25+.2*Math.sin(t/200);glow(c,x,y-16,20,"rgba(255,210,120,.9)",g())}
    mShadow(c,x,y,20,.4);glow(c,x,y-16,18,"rgba(170,160,220,.9)",.14);
    if(k<.5){if(!mPiece(c,ID,"cage",x,y,{ax:.5,ay:1})){c.strokeStyle="#6A6078";c.lineWidth=1;for(let i=0;i<5;i++){c.beginPath();c.moveTo(x-8+i*4,y-30);c.lineTo(x-8+i*4,y);c.stroke()}px(c,x-9,y-31,18,2,"#6A6078");px(c,x-9,y-1,18,2,"#6A6078")}}
    else if(!mPiece(c,ID,"cage_open",x-9.25,y,{ax:0,ay:1})){c.strokeStyle="#6A6078";c.lineWidth=1;for(let i=0;i<3;i++){c.beginPath();c.moveTo(x-8+i*4,y-30);c.lineTo(x-8+i*4,y);c.stroke()}px(c,x-9,y-31,18,2,"#6A6078");px(c,x+9,y-30,8,1,"#6A6078")}}
  function personIn(c,s,name,x,y,t,free,i){if(free){if(!mPerson(c,ID,name+"_free",x+5,y-24+(name==="child"?8:0)))px(c,x+8,y-20,8,18,"#8A7A9A");return}
    const f=s.rm?0:(Math.floor(t/700+i)%2);if(!mPerson(c,ID,name+"_"+f,x-8,y-26+(name==="child"?8:0)))px(c,x-4,y-22,8,18,"#6A5A7A")}
  function folk(c,j,x,y,f){if(!mPerson(c,ID,`folk${j}_${f}`,x-8,y-24+(j===6?8:0)))if(!mRect(c,"l1",FOLK[j],x-7,y-26))px(c,x-4,y-20,8,18,["#8A6A5A","#5A6A8A","#6A8A5A"][j%3])}
  function folkIn(c,s,j,x,y,t,free){folk(c,j,free?x+13:x,free?y:y-2,free||s.rm?0:(Math.floor(t/700+j)%2))}
  function key(c,s,x,y){const a=s.keyAnim;if(!a)return;const f=["key","key_1","key_2","key_3"][Math.min(3,Math.floor(a.t/.09))];glow(c,x,y,8,"rgba(255,220,140,.9)",.4);if(!mPiece(c,ID,f,x,y,{ax:.5,ay:.5,sm:true}))px(c,x-1,y-5,2,10,"#C8A060")}
  function thread(c,a,b,t,rm){rope(c,a[0],a[1],b[0],b[1],6+(rm?0:Math.sin(t/500)*1.5),"rgba(255,214,110,.9)",.8);glow(c,(a[0]+b[0])/2,(a[1]+b[1])/2+4,6,"rgba(255,214,110,.9)",.25)}
  function chains(c,s,pos,edges,t){c.save();c.setLineDash([1.5,1.2]);edges.forEach(([a,b])=>{const A=pos[a],B=pos[b];rope(c,A[0],A[1]-18,B[0],B[1]-18,7,"rgba(185,175,200,.95)",1.4)});c.restore()}
  function hint(c,s,pos,t){const lim=s.st===0?20:15;if(s.hintT<lim||s.clear)return;const i=bestKey(s);if(i<0)return;const p=pos[i];glow(c,p[0],p[1]-16,18,"rgba(255,230,150,.9)",.18+.1*(s.rm?1:Math.sin(t/300)));
    if(!mPiece(c,ID,"key",p[0]+10,p[1]-14,{ax:.5,ay:.5,a:.7}))px(c,p[0]+9,p[1]-19,2,10,"#C8A060")}
  function ring1(c,s,t){const R=RING(),Y=YOU();
    for(let i=0;i<6;i++){const [x,y]=R[i],j=(i+1)%6;if(isOpen(s,i)&&isOpen(s,j))thread(c,[R[i][0]+13,y-12],[R[j][0]+13,R[j][1]-12],t,s.rm)}
    chains(c,s,R,[0,1,2,3,4,5].map(i=>[i,(i+1)%6]),t);
    const order=[0,1,5,2,4,3];/* back to front */
    const drawOne=i=>{const [x,y]=R[i],k=doorK(s,0,i);if(k<.5)personIn(c,s,NAMES[i],x,y,t,false,i);cage(c,x,y,k,false,t);if(k>=.5)personIn(c,s,NAMES[i],x,y,t,true,i)};
    [0,1,5].forEach(drawOne);
    // your cage, in the middle: it opens only when all six are open
    const yk=s.youOpen==null?0:(s.rm?1:Math.min(1,s.youOpen/.35));if(yk<.5)mSprO(c,"wanderer_down_0",Y[0]-8,Y[1]-26);cage(c,Y[0],Y[1],yk,false,t);if(yk>=.5&&!mSprO(c,"wanderer_down_"+(s.rm?0:Math.floor(t/300)%3),Y[0]+5,Y[1]-24))px(c,Y[0]+8,Y[1]-20,8,18,"#2F7470");
    [2,4,3].forEach(drawOne);
    hint(c,s,R,t);previewAll(c,s,R,t);if(s.keyAnim)key(c,s,R[s.keyAnim.i][0]+8,R[s.keyAnim.i][1]-14)}
  function helpers(c,s,t,free){HELP.forEach(([x,y],i)=>{if(!mPerson(c,ID,NAMES[i]+"_free",x-8,y-24+(i===1?8:0)))px(c,x-4,y-20,8,18,"#8A7A9A")});
    c.save();if(pvIdx(s)>=0)c.globalAlpha=.3; /* while a key is previewed, the helpers' threads step back so the preview lines read clearly */
    for(let i=0;i<5;i++)thread(c,[HELP[i][0],HELP[i][1]-12],[HELP[i+1][0],HELP[i+1][1]-12],t,s.rm);c.restore()}
  function plaza(c,s,t){const P=PLAZA(),E=CHAINS();helpers(c,s,t);
    E.forEach(([a,b])=>{if(isOpen(s,a)&&isOpen(s,b))thread(c,[P[a][0]+13,P[a][1]-12],[P[b][0]+13,P[b][1]-12],t,s.rm)});
    chains(c,s,P,E,t);
    [0,1,2,3,4,5,6].sort((a,b)=>P[a][1]-P[b][1]).forEach(i=>{const [x,y]=P[i],k=doorK(s,1,i);if(k<.5)folkIn(c,s,i,x,y,t,false);cage(c,x,y,k,false,t);if(k>=.5)folkIn(c,s,i,x,y,t,true)});
    hint(c,s,P,t);previewAll(c,s,P,t);if(s.keyAnim)key(c,s,P[s.keyAnim.i][0]+8,P[s.keyAnim.i][1]-14)}
  const pullRate=n=>.03+.011*n; /* every freed person adds pulling strength */
  function crowdPos(){const out=[];for(let i=0;i<14;i++){const row=Math.floor(i/5),col=i%5;out.push([54+col*21+(row%2)*10,176+row*16])}return out}
  function gate(c,s,t,k,shake){const [gx,gy,sc]=GATE(),pull=k==null?s.pull:k,sh=shake&&!s.rm?(Math.random()-.5)*shake:0;
    glow(c,gx,gy-24,40,"rgba(200,190,255,.9)",.12+.25*pull);
    if(pull<.02){if(!mPiece(c,ID,"gate",gx+sh,gy,{ax:.5,ay:1,sc,sm:true})){px(c,gx-20,gy-40,40,40,"#2A2438");for(let i=0;i<8;i++)px(c,gx-18+i*5,gy-40,1,40,"#4A4058")}}
    else{const L=mPieceSize(ID,"gate_l"),o=pull*22*sc,sq=1-.55*pull;
      if(!mPiece(c,ID,"gate_l",gx-o+sh,gy,{ax:1,ay:1,sc,sm:true,rot:0})){px(c,gx-20-o,gy-40,20*sq,40,"#2A2438")}
      if(!mPiece(c,ID,"gate_r",gx+o+sh,gy,{ax:0,ay:1,sc,sm:true})){px(c,gx+o,gy-40,20*sq,40,"#2A2438")}}}
  function greatGate(c,s,t){const [gx,gy]=GATE(),pos=crowdPos(),on=s.pulling,np=s.pullers||14;
    gate(c,s,t,null,on?1.2:0);
    const arr=i=>i===13?1:s.rm?(np>i+1?1:0):clamp((s.stT-(i+1)*.35+.5)/.5,0,1); /* everyone gathers, one by one */
    pos.forEach((p,i)=>{if(i<13&&arr(i)>=1){rope(c,p[0],p[1]-14,gx+(p[0]<gx?-8:8),gy-20,on?1:5,on?"rgba(255,214,110,.95)":"rgba(255,214,110,.4)",on?.9:.6)}});
    pos.forEach((p0,i)=>{const lean=on&&!s.rm?1:0,a=arr(i);if(a<=0)return;const p=[p0[0],p0[1]+(1-a)*26];c.globalAlpha=a;if(i===13){if(!mSprO(c,"wanderer_up_"+(on&&!s.rm?1+Math.floor(t/200)%2:0),p[0]-8,p[1]-24+lean))px(c,p[0]-4,p[1]-20,8,18,"#2F7470")}
      else if(i<6){if(!mPerson(c,ID,NAMES[i]+"_"+(on?"cheer":"free"),p[0]-8,p[1]-24+lean+(i===1?8:0)))px(c,p[0]-4,p[1]-20,8,18,"#8A7A9A")}
      else folk(c,i-6,p[0],p[1]+lean,on&&!s.rm?Math.floor(t/250+i)%2:0);c.globalAlpha=1});
    meter(c,60,60,72,5,s.pull,"#D9A93A");
    // both hands: two glowing marks that light when A and B (or two fingers) are held
    [[78,"A",s.hA],[114,"B",s.hB]].forEach(([x,l,on2])=>{c.fillStyle=on2?"#F5C66A":"rgba(60,50,80,.8)";c.beginPath();c.arc(x,72,5,0,Math.PI*2);c.fill();mText(c,l,x,72.5,8,on2?"#2A1A12":"#B0A0C8");
      if(s.slip&&s.slip.h===l&&s.slip.t<.6){const k=s.slip.t/.6;c.save();c.globalAlpha=1-k;c.strokeStyle="#F5C66A";c.lineWidth=1;c.setLineDash([2,1.5]);c.beginPath();c.arc(x,72,6+(s.rm?3:k*9),0,Math.PI*2);c.stroke();c.restore()}})}
  function hud(c,s){if(s.st>1)return;const G=gr(s),n=G.n;px(c,4,4,8+n*8,12,"#100B15");for(let i=0;i<n;i++){c.fillStyle=isOpen(s,i)?"#F5C66A":"#3A3048";c.fillRect(8+i*8,7,5,6);if(!isOpen(s,i)){c.fillStyle="#100B15";c.fillRect(9+i*8,8,1,4);c.fillRect(11+i*8,8,1,4)}}}
  MINI.cages={
    who:"beauvoir",title:"Open Together",land:"l1",
    setup:["These cages open together or not at all.","Every key turns more than one lock. Try freeing only yourself, and see how far you get."],
    how:"Tap a cage to see which locks its key turns. Tap it again to turn the key.",
    goal:"Open every cage together, then pull the great gate with everyone.",
    ctl:"Tap a cage to preview its key, tap again to turn it. Hold A and B to pull (arrows, Z, X).",
    win:"All open, and yours last of all. No one is free alone.",
    walk:"Keep the keys. Someone else will need them.",
    stages:["The Ring","The Web of Chains","The Great Gate"],
    lines:[null,"Chains run between these. What you open, you open for all of them.","This one takes all of us. Hold A and B, and pull together."],
    pad:true,ab:true,limit:300,long:false,bloomT:4,
    fl:["Open the great gate","At most 3 extra turns, and 2 seconds of pulling one-handed","The fewest turns in both puzzles, and no one-handed pulling"],
    flNext:["Next time, tap a cage once to see which locks its key turns.","Next time, find the shortest way, and pull with both hands from the start."],
    rate:s=>{const ex=s.extra[0]+s.extra[1];return ex===0&&s.oneT===0?3:ex<=3&&s.oneT<=2?2:1},
    init(s){Object.assign(s,{st:0,stT:0,mask:0,min:0,turns:0,extra:[0,0],doors:[[],[]],cur:0,hintT:0,bestD:0,keyAnim:null,clear:0,youOpen:null,pull:0,oneT:0,pulling:false,hA:false,hB:false,P:pfx(),shk:0,next:0,sel:-1,kb:false,ghost:null,selT:1,snd:-1,slip:null,slipCd:0,oneRun:0,_pd:null});setup(s,0)},
    toStage(s,n){this.init(s);if(n>=1){stageUp(s,1);setup(s,1)}if(n>=2){stageUp(s,2);setup(s,2)}},
    step(s,dt,inp){
      s.stT+=dt;s.selT+=dt;s.slipCd=Math.max(0,s.slipCd-dt);if(s.ghost){s.ghost.t+=dt;if(s.ghost.t>=.25)s.ghost=null}if(s.slip){s.slip.t+=dt;if(s.slip.t>=.6)s.slip=null}
      if(s.snd!==s.st){s.snd=s.st;sfx("cages_stage")}
      if(s.st<2){const G=gr(s),pos=s.st===0?RING():PLAZA();s.hintT+=dt;
        s.doors[s.st].forEach(d=>{if(d)d.t+=dt});if(s.youOpen!=null)s.youOpen+=dt;
        if(s.keyAnim){s.keyAnim.t+=dt;if(s.keyAnim.t>=.36){const i=s.keyAnim.i;s.keyAnim=null;applyTurn(s,i)}}
        if(s.clear>0){s.clear-=dt;if(s.clear<=0){s.clear=0;stageUp(s);setup(s,s.st)}}
        else{ /* Phase 45B: a first tap selects and previews, a second tap on the same cage turns the key; arrows move the cursor (always previewed), A turns */
          let d=null;if(inp.lTap)d="l";else if(inp.rTap)d="r";else if(inp.uTap)d="u";else if(inp.dTap)d="d";
          const ex=inp.dx<0?"l":inp.dx>0?"r":inp.dy<0?"u":inp.dy>0?"d":null;if(!d&&ex&&ex!==s._pd)d=ex;s._pd=ex;
          if(d){s.kb=true;s.sel=-1;const nx=cursorMove(s,pos,d);if(nx!==s.cur){s.cur=nx;s.selT=0;s.ghost=null;sfx("cages_select")}}
          for(const tp of inp.taps||[]){const bi=tapCage(pos,tp);
            if(bi>=0){if(s.sel===bi){if(!s.keyAnim){s.cur=bi;s.sel=-1;turn(s,bi)}}
              else{s.sel=bi;s.cur=bi;s.kb=false;s.selT=0;s.ghost=null;sfx("cages_select")}}
            else if(pvIdx(s)>=0&&!s.keyAnim){s.ghost={i:pvIdx(s),t:0};s.sel=-1;s.kb=false;sfx("cages_clear")}
            break}
          if(inp.aTap){if(s.sel>=0){s.cur=s.sel;s.sel=-1;s.kb=true;turn(s,s.cur)}else if(s.kb)turn(s,s.cur);else{s.kb=true;s.selT=0;sfx("cages_select")}}}}
      else{ /* the great gate: hold A and B together (or two fingers anywhere) */
        const two=(inp.fingers||0)>=2,a=!!inp.a||two,b=!!inp.b||two;s.hA=a;s.hB=b;s.pulling=a&&b;
        s.pullers=Math.min(14,1+Math.floor(s.stT/.35)); /* everyone gathers at the gate, one by one: each adds strength */
        if(s.pulling){s.pull=Math.min(1,s.pull+pullRate(s.pullers)*dt);sfx("cages_gate",s.pull);if(!s.rm)shakeSet(s,.6);s.oneRun=0}
        else if(a||b){s.oneT+=dt;s.oneRun+=dt;if(s.oneRun>=.35&&!s.slipCd){s.slipCd=.9;s.slip={h:a?"B":"A",t:0};sfx("cages_slip")}}else s.oneRun=0;
        if(s.pull>=1){sfx("cages_finish");return "win"}}
      pStep(s.P,dt,s.rm)},
    draw(s,c,t){c.save();shakeApply(c,s);if(!mBg(c,ID,0))fallbackBg(c);
      if(s.st===0)ring1(c,s,t);else if(s.st===1)plaza(c,s,t);else greatGate(c,s,t);
      if(!mSprO(c,"beauvoir_"+(Math.floor(t/900)%2),168,s.st===2?196:140))px(c,172,s.st===2?200:144,10,20,"#1F1A24");
      pDraw(c,s.P,ID);c.restore();vignette(c,.35);hud(c,s)},
    bloom(s,c,k,t){ /* the gate swings wide, everyone steps through holding golden threads, and the cages burst into stained-glass birds. More lanterns: more birds. */
      const fl=s._fl||1,[gx,gy]=GATE();if(!mBg(c,ID,0))fallbackBg(c);grade(c,"rgba(255,200,140,1)",(.08+.04*fl)*Math.min(1,k/.5),"soft-light");
      gate(c,s,t,1,0);glow(c,gx,gy-30,50,"rgba(255,220,160,.9)",.3+.1*fl);
      const pos=crowdPos(),w=s.rm?.6:k;pos.forEach((p,i)=>{const kk=clamp((w-i*.025)/.6,0,1),x=lerp(p[0],gx+(p[0]-gx)*.2,kk),y=lerp(p[1],gy-6,kk),a=1-clamp((kk-.7)/.3,0,1);if(a<=0)return;c.globalAlpha=a;
        if(i===13)mSprO(c,"wanderer_up_0",x-8,y-24);else if(i<6)mPerson(c,ID,NAMES[i]+"_free",x-8,y-24+(i===1?8:0));else folk(c,i-6,x,y,0);c.globalAlpha=1;
        if(i<13&&a>0)rope(c,x,y-12,gx,gy-18,3,"rgba(255,214,110,.8)",.6)});
      const nb=6+fl*4;for(let i=0;i<nb;i++){const kk=s.rm?.7:clamp((k-.15-i*.03)/.8,0,1);if(kk<=0)continue;const sx=20+(i*41)%152,sy=250-(i%3)*18,x=sx+Math.sin(kk*4+i)*14,y=lerp(sy,20+(i*29)%80,kk);
        glow(c,x,y,7,"rgba(255,210,140,.9)",.35);if(!mPiece(c,ID,"bird_"+(s.rm?0:Math.floor(t/120+i)%2),x,y,{ax:.5,ay:.5,sc:.7,sm:true,flip:i%2===1}))px(c,x-3,y-2,6,4,"#E0A040")}
      vignette(c,.2)},
    _t:{g1,g2,pullRate,bestKey,pvIdx,cursorMove,pos:s=>s.st===0?RING():PLAZA()}, /* tests only */
    shotReady:s=>s.st<2?!!s.keyAnim:s.pull>.3,
    auto(s,inp){if(s.st===2){inp.a=true;inp.b=true;return}if(s.keyAnim||s.clear)return;if((s._at=(s._at||0)+1)%5)return;const i=bestKey(s);if(i<0)return;const p=(s.st===0?RING():PLAZA())[i];inp.taps=[{x:p[0],y:p[1]-15}];inp.tap=inp.taps[0]},
    _dbg:s=>({extra:s.extra,oneT:s.oneT,min:s.min})
  };
})();
MINI_LOADED.l1=true;
