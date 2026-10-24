/* The Examined Life: Level III short games (the Misty Valleys). Plan 5. Loaded after l1.js-l4.js (fx.js first, boss.js last).
   Source: work_src/s3/<id>.js, one file per game, assembled by tools/build_mini.py s3. Do not edit the GAME blocks here. */
/* MINI_ART:BEGIN */
/* written by tools/l3p5_mini_art.py (Phase 42A): asset ids, atlas rects, people rects and pivots, traced geometry (<who>_s) */
MINI_ART.buddha_s={"atlas":"996155408ef547927aea0b469317a893","people":"894be1f8ec166930c669870e20463bb7","rects":{"gate_grand":[1,1,66,64],"house_humble":[68,1,48,56],"house_fine":[117,1,48,56],"house_shut":[166,1,48,56],"boat":[215,1,30,28],"leaf":[246,1,20,24],"bowl_full":[267,1,24,21],"bowl_empty":[292,1,24,20],"o_riceball":[317,1,12,12],"o_fruit":[330,1,16,12],"o_cake":[347,1,12,11],"o_banana":[360,1,12,9],"o_greens":[373,1,12,9],"o_honey":[386,1,12,9],"petal":[399,1,8,8]},"prects":{"vil0_stand":[1,1,14,24],"vil0_offer":[16,1,18,24],"vil1_stand":[35,1,14,24],"vil1_offer":[50,1,18,24],"host_stand":[69,1,14,24],"host_offer":[84,1,18,24],"wb_walk_0":[103,1,15,24],"wb_walk_1":[119,1,15,24],"wb_hold":[135,1,19,24],"wb_stand":[155,1,15,24],"wb_bow":[171,1,15,22],"vil0_bow":[187,1,14,21],"vil1_bow":[202,1,14,21],"host_bow":[217,1,14,21],"monk0_sit":[232,1,14,20],"monk0_pour":[247,1,20,20],"monk1_sit":[268,1,14,20],"monk1_pour":[283,1,20,20],"monk2_sit":[304,1,14,20],"monk2_pour":[319,1,20,20],"bud_sit":[340,1,14,19],"bud_sit_1":[355,1,14,18]},"pivots":{"bud_sit":[8,19],"bud_sit_1":[8,18],"vil0_stand":[8,24],"vil0_offer":[8,24],"vil0_bow":[8,21],"vil1_stand":[8,24],"vil1_offer":[8,24],"vil1_bow":[8,21],"host_stand":[8,24],"host_offer":[8,24],"host_bow":[8,21],"wb_walk_0":[5,24],"wb_walk_1":[10,24],"wb_hold":[8,24],"wb_bow":[8,22],"wb_stand":[8,24],"monk0_sit":[8,20],"monk0_pour":[8,20],"monk1_sit":[8,20],"monk1_pour":[8,20],"monk2_sit":[8,20],"monk2_pour":[8,20]},"bg":["313f6f9a7f28a06c6d172aeedd9324e2"],"geo":{"crop":"centre","tree":[40,0,152,64],"seat":[96,88],"seatBox":[84,84,110,94],"island":[40,76,152,104],"stream":[[150,92],[128,104],[104,112],[84,124],[80,138],[96,148],[118,160],[125,176],[118,188],[100,200],[88,214],[88,232],[88,256],[88,300]],"streamWidth":44,"path":[[60,108],[46,132],[44,160],[40,190],[30,220],[26,260]],"villageRoofs":[[10,44],[182,40]],"rocksLeft":[0,160,40,240],"suggest":{"buddha":[96,86],"leafRest":[104,114],"grove":[70,92],"grandGate":[150,58]},"darkBandFrom":250,"note":"the tree fills the top (y 0-64); the stream starts at the pond ring right of the island (y ~92), not at y 22"},"stream":[[150,92],[128,104],[104,112],[84,124],[80,138],[96,148],[118,160],[125,176],[118,188],[100,200],[88,214],[88,232],[88,256],[88,300]]};
MINI_ART.laozi_s={"atlas":"442b2b8510abbf72df4be6e5959dec25","people":"c526976b848fa541209225f58418f986","rects":{"wheel_solid":[1,1,55,64],"wheel_axle":[57,1,60,64],"hut_closed":[118,1,64,59],"hut_open":[183,1,64,59],"buf_left":[248,1,24,56],"buf_right":[273,1,24,56],"slip":[298,1,8,56],"buf_mid":[307,1,20,51],"bowl":[328,1,64,48],"clay":[393,1,64,47],"bundle":[458,1,48,35],"bell":[507,1,8,10]},"prects":{"yin_stand":[1,1,14,26],"yin_hold":[16,1,19,26],"yin_bow":[36,1,14,24],"lao_write_0":[51,1,18,20],"lao_write_1":[70,1,18,20],"lao_sit":[89,1,14,20],"lao_ride_0":[104,1,14,18],"lao_ride_1":[119,1,15,18]},"pivots":{"lao_write_0":[8,20],"lao_write_1":[8,20],"lao_sit":[8,20],"lao_ride_0":[7,18],"lao_ride_1":[7,18],"yin_stand":[8,26],"yin_bow":[8,24],"yin_hold":[8,26]},"bg":["46f830e82f1951234757fd668af54987"],"geo":{"crop":"centre","gateTower":[72,30,120,88],"gate":[96,80],"gateOpening":[90,70,103,84],"road":[[96,300],[96,256],[97,240],[104,224],[117,208],[126,196],[116,184],[98,172],[72,164],[56,156],[49,148],[50,140],[62,130],[76,125],[90,118],[94,104],[96,88]],"roadWidth":20,"gatehouse":[146,136,192,200],"writingTable":[166,182],"stoneLantern":[112,88],"postLantern":[84,92],"pineLeft":[16,156,76,236],"pineRight":[112,100,168,150],"suggest":{"laozi":[160,196],"yinxi":[180,186],"bundle":[176,100]},"darkBandFrom":252,"note":"the road is about 18-24 units wide (brief 30)"},"road":[[96,300],[96,256],[97,240],[104,224],[117,208],[126,196],[116,184],[98,172],[72,164],[56,156],[49,148],[50,140],[62,130],[76,125],[90,118],[94,104],[96,88]]};
MINI_ART.zhuangzi_s={"atlas":"542a85ba9bc669d9ce8e9f401a836bfe","people":"687f00402158764899a4078a2a988718","rects":{"ox_scroll":[1,1,320,240],"pot":[322,1,57,64],"knife":[380,1,11,40],"em_blossom":[392,1,18,20],"em_maple":[411,1,17,20],"em_pine":[429,1,19,20],"em_lotus":[449,1,20,16],"cicada":[470,1,9,12],"maple":[480,1,10,10],"petal":[491,1,8,8],"snow":[500,1,7,8]},"prects":{"ding_stand":[1,1,14,24],"ding_knife":[16,1,20,24],"ding_bow":[37,1,14,21],"zz_drum_up":[52,1,16,19],"zz_drum_down":[69,1,19,19],"zz_relax":[89,1,15,19]},"pivots":{"zz_drum_up":[8,19],"zz_drum_down":[8,19],"zz_relax":[8,19],"ding_stand":[8,24],"ding_knife":[8,24],"ding_bow":[8,21]},"bg":["0f5f8e74b0720218ee7378bcab195592"],"geo":{"crop":"centre","pavilion":[32,30,160,148],"pavilionFloor":[50,100,144,148],"table":[96,124],"tableBox":[70,114,122,136],"steps":[96,154],"ground":[0,158,150,250],"pond":[150,112,192,260],"bridge":[176,200],"willow":[0,0,70,130],"lanterns":[[40,106],[150,106],[18,160],[176,86],[148,236]],"scroll":[96,130],"scrollBox":[16,70,176,190],"seams":{"neck":[[72,96],[70,110],[62,126]],"shoulder":[[74,100],[80,116],[78,136]],"back":[[78,102],[96,104],[116,104],[132,106]],"hip":[[132,106],[126,122],[128,138]],"foreleg":[[78,136],[76,150],[76,168]],"hindleg":[[128,138],[124,152],[128,168]]},"knots":[[74,99],[78,136],[132,106],[128,138]],"knotR":8,"seamsLocal":{"neck":[[56,26],[54,40],[46,56]],"shoulder":[[58,30],[64,46],[62,66]],"back":[[62,32],[80,34],[100,34],[116,36]],"hip":[[116,36],[110,52],[112,68]],"foreleg":[[62,66],[60,80],[60,98]],"hindleg":[[112,68],[108,82],[112,98]]},"knotsLocal":[[58,29],[62,66],[116,36],[112,68]],"suggest":{"cookDing":[24,176],"zhuangzi":[64,178],"pot":[104,172],"emblems":[96,54]},"darkBandFrom":252},"seams":{"neck":[[72,96],[70,110],[62,126]],"shoulder":[[74,100],[80,116],[78,136]],"back":[[78,102],[96,104],[116,104],[132,106]],"hip":[[132,106],[126,122],[128,138]],"foreleg":[[78,136],[76,150],[76,168]],"hindleg":[[128,138],[124,152],[128,168]]},"knots":[[74,99],[78,136],[132,106],[128,138]]};
MINI_ART.confucius_s={"atlas":"d127fdece887e6e6cc180f6744ecccbf","people":"ae8a50a0de3e79d7317f0a4f581d4c02","rects":{"zither":[1,1,192,85],"slip":[194,1,7,56],"table":[202,1,64,36],"bundle":[267,1,48,33],"chime":[316,1,20,24],"inkstone":[337,1,24,19],"petal":[362,1,8,7],"flute":[371,1,32,3]},"prects":{"stu0_stand":[1,1,14,24],"stu1_stand":[16,1,14,24],"stu2_stand":[31,1,15,24],"stu3_stand":[47,1,14,24],"stu4_stand":[62,1,14,24],"stu5_stand":[77,1,14,24],"stu6_stand":[92,1,15,24],"stu7_stand":[108,1,14,24],"stu0_bow":[123,1,14,21],"stu1_bow":[138,1,14,21],"stu2_bow":[153,1,15,21],"stu3_bow":[169,1,14,21],"stu4_bow":[184,1,14,21],"stu5_bow":[199,1,14,21],"stu6_bow":[214,1,15,21],"stu7_bow":[230,1,14,21],"stu0_sit":[245,1,14,20],"stu1_sit":[260,1,14,20],"stu2_sit":[275,1,14,20],"stu3_sit":[290,1,14,20],"stu4_sit":[305,1,14,20],"stu5_sit":[320,1,14,20],"stu6_sit":[335,1,14,20],"stu7_sit":[350,1,14,20],"flute_0":[365,1,17,20],"flute_1":[383,1,17,20],"chime_up":[401,1,16,20],"chime_down":[418,1,18,20],"wz_up":[437,1,18,15],"wz_pluck":[456,1,18,15],"wz_sit":[475,1,15,15]},"pivots":{"stu0_sit":[8,20],"stu0_stand":[8,24],"stu0_bow":[8,21],"stu1_sit":[8,20],"stu1_stand":[8,24],"stu1_bow":[8,21],"stu2_sit":[8,20],"stu2_stand":[8,24],"stu2_bow":[8,21],"stu3_sit":[8,20],"stu3_stand":[8,24],"stu3_bow":[8,21],"stu4_sit":[8,20],"stu4_stand":[8,24],"stu4_bow":[8,21],"stu5_sit":[8,20],"stu5_stand":[8,24],"stu5_bow":[8,21],"stu6_sit":[8,20],"stu6_stand":[8,24],"stu6_bow":[8,21],"stu7_sit":[8,20],"stu7_stand":[8,24],"stu7_bow":[8,21],"flute_0":[8,20],"flute_1":[8,20],"chime_up":[10,20],"chime_down":[12,20],"wz_up":[8,15],"wz_pluck":[8,15],"wz_sit":[8,15]},"bg":["f9350ec346f437e932dc95fc22741c40"],"geo":{"crop":"centre","veranda":[0,0,192,84],"verandaEdge":80,"steps":[96,84],"lanterns":[[32,30],[74,30],[117,30],[159,30]],"verandaTables":[[46,60],[96,60],[144,60]],"apricot":[0,30,56,110],"courtyard":[4,90,158,222],"buildingRight":[158,100,192,222],"sideLantern":[160,130],"plants":[[156,92],[164,180],[186,200]],"darkBandFrom":224,"note":"the brief's places fit: students rows y 104/156 at x 36-156, slip table (96,214), zither (96,206)"}};
MINI_ART.dogen_s={"atlas":"46b22ae9cec19d8f8390913429d7c178","people":"2295f3a370e26b87f0b7c9eeb382ab35","rects":{"ship":[1,1,53,64],"incense":[55,1,25,40],"gate":[81,1,56,39],"cushion":[138,1,40,31],"chime":[179,1,14,28],"sparrow_fly":[194,1,14,16],"stone":[209,1,24,16],"stone_lit":[234,1,24,16],"sandals":[259,1,20,14],"sparrow_sit":[280,1,14,11],"maple":[295,1,10,9]},"prects":{"ww_up_0":[1,1,15,24],"ww_down_0":[17,1,15,24],"ww_up_1":[33,1,15,24],"ww_down_1":[49,1,15,24],"ww_stand":[65,1,15,24],"wm_breath":[81,1,18,19],"wm_still":[100,1,18,18],"wm_turn":[119,1,18,18]},"pivots":{"wm_still":[9,18],"wm_breath":[9,19],"wm_turn":[9,18],"ww_up_0":[5,24],"ww_down_0":[5,24],"ww_up_1":[10,24],"ww_down_1":[10,24],"ww_stand":[8,24]},"bg":["b63e7f8897db0a1c056abb72c4588e43"],"geo":{"crop":"centre","roof":[0,0,192,18],"view":[0,18,192,150],"harbor":[100,62],"mountainPath":[[100,68],[96,90],[106,112],[120,136]],"railing":[0,148,192,170],"railTop":150,"lanterns":[[28,140],[164,140]],"floor":[0,170,192,320],"floorFrom":170,"suggest":{"cushion":[96,196],"incense":[132,198],"sitZone":[140,270]},"note":"dogen-sbg v3: the railing is at y 148-170 and the floor starts at y 170, so the brief's cushion (96,176) sits on the floor edge"}};
/* MINI_ART:END */
/* GAME:bodhi:BEGIN */
(function(){
{
/* The Mindful Stream (bodhi). The Buddha, "A Bodhi Leaf". Helper: mFlow (boats on the stream; mPath only for positions). Art key buddha_s. */
const K="buddha_s",SP=14,JG=18,GR=.35,N=16,FB=[[96,22],[84,70],[106,120],[88,170],[100,222],[96,248]],COL=["#4A5468","#D9A93A","#B5473A","#7A5A3A","#A8406A","#7A4FA0"];
const V=(n,f,g)=>{if(typeof SFX!=="undefined"&&!SFX[n]){SFX[n]=f;if(g)GAP[n]=g}};
V("bodhi_name",()=>{aTone(1568,1,{v:.05,a:.004});aTone(3136,.5,{v:.012})},.1);
V("bodhi_jam",()=>aTone(AN(-24),.6,{v:.05,a:.15,lp:300}),.5);
V("bodhi_petal",()=>{aNoise(.14,{f:1800,to:900,q:.8,v:.03,a:.02});aTone(AN(12),.1,{v:.015,to:AN(16)})},.15);
const pos=(s,d)=>{if(d>=0)return s.PL.at(d);const q=s.PL.at(0);return{x:q.x+q.tx*d,y:q.y+q.ty*d}};
const inZ=b=>b.y>=60&&b.y<=230;
const nameIt=(s,b)=>{if(b&&!b.nm&&!b.gone&&inZ(b)){b.nm=1;s.named++;sfx("bodhi_name");s.rp.push({x:b.x,y:b.y,t:0});pSparks(s.P,b.x,b.y,s.rm?2:6,"#FFE9A8",22)}};
const hit=(s,x,y)=>{let r=null,m=1e9;for(const b of s.F.list){const dx=Math.abs(x-b.x),dy=Math.abs(y-b.y),k=dx+dy+(b.nm?99:0);if(dx<=14&&dy<=12&&k<m){m=k;r=b}}return r};
const low=s=>{let r=null;for(const b of s.F.list)if(!b.nm&&inZ(b)&&(!r||b.y>r.y))r=b;return r};
const per=(c,n,x,y,o)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],p=A&&A.pivots&&A.pivots[n];return !!(r&&p&&mPerson(c,K,n,x,y,Object.assign({ax:p[0]/r[2],ay:1},o)))};
const water=(c,s,w,col,a)=>{c.save();c.globalAlpha=a;c.strokeStyle=col;c.lineWidth=w;c.lineJoin=c.lineCap="round";c.beginPath();s.PL.pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();c.restore()};
function ico(c,k,x,y,col){c.save();c.translate(x,y);c.fillStyle=c.strokeStyle=col;c.lineWidth=1;c.beginPath();
  if(k===0){c.arc(-1.5,.5,2,0,7);c.arc(1.5,.5,2.2,0,7);c.arc(0,-1,2,0,7);c.fill()}
  else if(k===1){c.arc(0,0,2.8,0,7);c.stroke();c.fillRect(-.5,-1.5,1,3)}
  else if(k===2){for(let i=0;i<10;i++){const a=i*.628-1.57,r=i%2?1.4:3.2;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath();c.fill()}
  else if(k===3){c.moveTo(-2.5,-3);c.lineTo(2.5,-3);c.lineTo(-2.5,3);c.lineTo(2.5,3);c.closePath();c.stroke()}
  else if(k===4){c.moveTo(0,3);c.bezierCurveTo(-5,-.5,-2.5,-4,0,-1.5);c.bezierCurveTo(2.5,-4,5,-.5,0,3);c.stroke()}
  else{c.moveTo(-3,2.5);c.lineTo(-3,-1.5);c.lineTo(-1.5,.5);c.lineTo(0,-2.5);c.lineTo(1.5,.5);c.lineTo(3,-1.5);c.lineTo(3,2.5);c.closePath();c.fill()}
  c.restore()}
function back(c,s){const P=s&&s.PL;if(!mBg(c,K,0)){c.fillStyle="#6E8F6A";c.fillRect(0,0,192,320);c.fillStyle="#3E5E3E";c.beginPath();c.arc(96,34,42,0,7);c.fill();
    if(P)water(c,s,44,"#8FB7C4",1);c.fillStyle="#9A9A9A";c.fillRect(84,84,24,8)}}
function bud(c,s,t){const n=!s.rm&&((t/1800)|0)%2?"bud_sit_1":"bud_sit";mShadow(c,96,86,16,.3);
  if(!per(c,n,96,86)){c.fillStyle="#100B15";c.fillRect(89,66,14,20);c.fillStyle="#D9A93A";c.fillRect(90,70,12,15);c.fillStyle="#E8C8A0";c.fillRect(93,63,6,6)}}
function leaf(c,x,y,r,a){c.save();c.globalAlpha=a;if(!mPiece(c,K,"leaf",x,y,{ax:.5,ay:.5,rot:r,sm:true})){c.translate(x,y);c.rotate(r);c.fillStyle="#4F7E3E";c.beginPath();c.moveTo(0,6);c.bezierCurveTo(-9,-1,-4,-8,0,-3);c.bezierCurveTo(4,-8,9,-1,0,6);c.fill()}c.restore()}
function boat(c,s,b){const x=b.x,y=b.y+(s.rm||b.stop?0:Math.sin(s.ck*2+b.i)*.5),h=s.hold===b,pr=s.pr;
  if(b.nm)glow(c,x,y-3,14,"#FFD070",.35);mShadow(c,x,y+6,13,.25);
  if(!mPiece(c,K,"boat",x,y,{ax:.5,ay:.5})){c.fillStyle="#F2EEDC";c.strokeStyle="#100B15";c.beginPath();c.moveTo(x-8,y);c.lineTo(x+8,y);c.lineTo(x+4,y+5);c.lineTo(x-4,y+5);c.closePath();c.fill();c.stroke();c.fillRect(x-4,y-8,8,8)}
  if(b.nm)glow(c,x,y-3,6,"#FFE9A8",.3);ico(c,b.ic,x,y-3,b.nm?"#FFE9A8":COL[b.ic]);
  c.save();if(b.nm){c.strokeStyle="rgba(245,198,106,.85)";c.beginPath();c.ellipse(x,y,12,9,0,0,7);c.stroke()}
  if(h){c.strokeStyle="#241A30";c.lineWidth=1.5;c.strokeRect(x-11,y-9,22,17)}c.restore();
  if(pr&&pr.b===b&&!pr.g)ring(c,x,y-14,3,pr.t/GR,"#FFE9A8",1)}
MINI.bodhi={
  who:"buddha",land:"l3",title:"The Mindful Stream",short:true,art:K,stages:["The Mindful Stream"],
  setup:["Thoughts come down the stream like little paper boats.","See each one, name it kindly, and let the water carry it."],
  how:"Tap a boat once to name it. Don’t hold on.",
  win:"The stream is clear. Nothing was pushed away, and nothing was kept.",
  walk:"That’s all right. The stream will still be here tomorrow.",
  lines:[null],pad:false,ab:true,bloomT:2.2,limit:90,
  fl:["The stream ran on.","You named most of them, and held on only briefly.","You saw each thought and let every one go."],
  flNext:["Tap each boat once, then let it float.","Don’t hold any boat at all."],
  rate:s=>(s.named|0)>=15&&!s.grabs?3:(s.named|0)>=12&&(s.grabT||0)<3?2:1,
  shotReady:s=>s.named>=4,
  init(s){const A=MINI_ART[K],ST=((A&&A.stream)||FB).slice();ST.push([ST[ST.length-1][0],335]);const PL=mPath({pts:ST});let y240=0;while(y240<PL.len&&PL.at(y240).y<240)y240+=.5;
    const T=[0];for(let i=1;i<N;i++)T.push(T[i-1]+(i%4===0?2.2:3));
    Object.assign(s,{T,st:0,stT:0,ck:0,cl:0,n:0,named:0,grabs:0,grabT:0,gone:0,hold:null,pr:null,dk:0,rt:0,rp:[],pl:[],P:pfx(),PL,y240,
      F:mFlow({path:ST,speed:SP,onExit:()=>s.gone++})})},
  step(s,dt,inp){s.stT+=dt;s.ck+=dt;s.cl+=dt;const F=s.F;
    while(s.n<N&&s.cl>=s.T[s.n]){F.spawn({d:0,i:s.n,ic:s.n%6});s.n++}
    const tp=inp.tap||(inp.taps||[])[0];
    if(!s.pr){let b=null,k=0;if(tp){b=hit(s,tp.x,tp.y);k=inp.down?1:0}else if(inp.aTap){b=low(s);k=inp.a?2:0}
      if(b){if(k)s.pr={b,t:0,k};else nameIt(s,b)}}
    else{const p=s.pr;if(p.k===1?inp.down:inp.a){p.t+=dt;if(p.g)s.grabT+=dt;else if(p.t>=GR&&!p.b.gone){p.g=1;s.hold=p.b;s.grabs++;s.grabT+=p.t}}
      else{if(!p.g)nameIt(s,p.b);s.hold=null;s.pr=null}}
    const L=F.list.slice().sort((a,b)=>b.d-a.d);let ah=null;
    for(const b of L){b.stop=b===s.hold||!!(ah&&ah.stop&&ah.d-b.d<=JG+.01);ah=b}
    F.step(dt);ah=null;
    for(const b of L){if(ah&&ah.stop&&b.d>ah.d-JG){b.d=ah.d-JG;b.stop=true}ah=b}
    for(const b of F.list.slice()){const q=pos(s,b.d);b.x=q.x;b.y=q.y;
      if(b.nm&&b.d>=s.y240){F.remove(b);b.gone=1;s.gone++;sfx("bodhi_petal");for(let i=0;i<3&&s.pl.length<60;i++)s.pl.push({x:b.x+(i-1)*3,y:b.y,vx:(i-1)*5,vy:6+i*2,r:i*2,t:0})}}
    const j=!!s.hold;s.dk=clamp(s.dk+(j?1:-1)*dt*3,0,1);if(j)sfx("bodhi_jam");else s.rt+=dt;
    s.rp=s.rp.filter(r=>(r.t+=dt)<.8);s.pl=s.pl.filter(p=>{p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;return p.t<1.8});pStep(s.P,dt,s.rm);
    return s.gone>=N?"win":null},
  draw(s,c,t){back(c,s);c.save();c.strokeStyle="rgba(255,255,255,.3)";for(let i=0;i<9;i++){const q=s.PL.at((i*37+s.rt*5)%(s.PL.len-30));c.beginPath();c.ellipse(q.x+((i*7)%11-5),q.y,4+i%3,1.3,0,0,7);c.stroke()}c.restore();
    grade(c,"#100B15",.3*s.dk);
    bud(c,s,t);const bs=s.F.list.slice().sort((a,b)=>a.y-b.y),lw=low(s);
    for(const b of bs)if(b.x<200)boat(c,s,b);
    if(lw&&!s.pr){c.fillStyle="rgba(255,233,168,.8)";c.beginPath();c.moveTo(lw.x-3,lw.y-20);c.lineTo(lw.x+3,lw.y-20);c.lineTo(lw.x,lw.y-16);c.fill()}
    for(const r of s.rp){const k=r.t/.8;c.save();c.globalAlpha=1-k;c.strokeStyle="#F5C66A";c.beginPath();c.ellipse(r.x,r.y,8+14*k,6+9*k,0,0,7);c.stroke();c.restore()}
    for(const p of s.pl){const a=1-p.t/1.8;if(!mPiece(c,K,"petal",p.x,p.y,{ax:.5,ay:.5,rot:p.r+p.t,a})){c.globalAlpha=a;c.fillStyle="#F4B6C8";c.fillRect(p.x-2,p.y-1,4,2);c.globalAlpha=1}}
    pDraw(c,s.P,K)},
  bloom(s,c,k,t){const f=s._fl||MINI.bodhi.rate(s),u=E.out(clamp(k/.55,0,1)),x=104-8*(1-u)+(s.rm?0:Math.sin(k*9)*3*(1-u)),y=64+50*u;
    back(c,s);bud(c,s,t);gradeN(c,"day",.3*k);glow(c,104,114,26+8*f,"#FFD890",.25*k);
    for(let j=0;j<f;j++){const r=(7+7*j)*E.out(clamp((k-.45-.05*j)/.45,0,1));if(r>0){c.save();c.globalAlpha=.9-.15*j;c.strokeStyle="#F5C66A";c.lineWidth=1.2;c.beginPath();c.ellipse(104,114,r,r*.55,0,0,7);c.stroke();c.restore()}}
    leaf(c,x,y,.4*(1-u)+(u>=1?.15:0),1);gradeN(c,"warm",(.08+.04*f)*k)},
  auto(s,inp){for(const b of s.F.list)if(!b.nm&&b.d>=12&&inZ(b)){inp.tap={x:b.x,y:b.y};inp.taps=[inp.tap];break}}
};
}
})();
/* GAME:bodhi:END */
/* GAME:alms:BEGIN */
(function(){
{
/* The Alms Round (alms). The Buddha. Helper: mPick (the fork only). */
const K="buddha_s",LN=[[96,246],[80,214],[104,180],[84,146],[106,112],[90,80],[96,60]],DY=[232,212,194,174,154,136,118,100,84],KD=[0,0,1,0,1,0,1,1,0],
HN=["o_riceball","o_banana","o_greens"],FN=["o_cake","o_honey","o_fruit"],GV=[44,92],GT=[150,58],WG=[64,114],MK=[[22,96],[30,108],[58,110]];
const V=(n,f,g)=>{if(typeof SFX!=="undefined"&&!SFX[n]){SFX[n]=f;if(g)GAP[n]=g}};
V("alms_receive",()=>{aNoise(.25,{f:2200,to:1200,q:.7,v:.04,a:.02});aTone(AN(14),.3,{v:.03,a:.01})},.2);
V("alms_bow",()=>aTone(2093,.5,{v:.03,a:.004}),.2);
V("alms_step",()=>aNoise(.06,{f:600,q:.8,v:.02,a:.01}),.12);
const rng=a=>()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};
const near=(p,b,r)=>p&&Math.abs(p.x-b[0])<=r&&Math.abs(p.y-b[1])<=r;
const pc=(c,n,x,y,o)=>{if(!mPiece(c,K,n,x,y,Object.assign({ax:.5,ay:.5},o))){const z=mPieceSize(K,n),m=(o&&o.sc)||1;c.fillStyle="#9A8060";c.fillRect(x-z[0]*m/2,y-z[1]*m/2,z[0]*m,z[1]*m)}};
const pp=(c,n,x,y,fl)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n]||[0,0,14,24],p=A&&A.pivots&&A.pivots[n]||[7,24];mShadow(c,x,y,12,.3);
  if(!mPerson(c,K,n,x,y,{ax:p[0]/r[2],ay:1,flip:fl<0})){c.fillStyle="#6E4A5A";c.fillRect(x-6,y-r[3],12,r[3]);c.fillStyle="#E8C8A0";c.fillRect(x-3,y-r[3]-4,6,5)}};
const band=(c,pts,w)=>{c.save();c.lineJoin=c.lineCap="round";c.strokeStyle="#8A7350";for(const[k,a]of[[0,.25],[4,.5],[8,1]]){c.globalAlpha=a;c.lineWidth=w-k;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke()}c.restore()};
const rg=(c,x,y,r,n,f,g,d)=>{c.save();c.lineWidth=3;if(d){c.fillStyle="rgba(16,11,21,.6)";c.beginPath();c.arc(x,y,r+3,0,7);c.fill()}g=g==null?.12:g;
  for(let i=0;i<5;i++){const a=-1.5708+i*1.2566+g/2;c.strokeStyle=i<n?(f>0&&i===n-1?"#FFF8E0":"#F5C66A"):"#4A3E56";c.beginPath();c.arc(x,y,r,a,a+1.2566-g);c.stroke()}c.restore()};
const arrow=(c,x,y,a,sel)=>{c.save();c.translate(x,y);c.fillStyle="rgba(16,11,21,.65)";c.beginPath();c.arc(0,0,11,0,7);c.fill();c.rotate(a);c.fillStyle=sel?"#FFE9A8":"#F5C66A";c.strokeStyle="#100B15";c.beginPath();c.moveTo(-5,-6);c.lineTo(6,0);c.lineTo(-5,6);c.lineTo(-2,0);c.closePath();c.fill();c.stroke();c.restore()};
const pl=(p,u)=>{let L=0,l=[];for(let i=1;i<p.length;i++){l.push(Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]));L+=l[i-1]}let d=u*L,i=0;while(i<l.length-1&&d>l[i]){d-=l[i];i++}const k=l[i]?Math.min(1,d/l[i]):1;return[lerp(p[i][0],p[i+1][0],k),lerp(p[i][1],p[i+1][1],k),L]};
function bk(c,s){if(!mBg(c,K,0)){c.fillStyle="#5E7A58";c.fillRect(0,0,192,320);c.fillStyle="#3E5E3E";c.beginPath();c.arc(96,34,42,0,7);c.fill()}gradeN(c,"warm",.35)}
function grove(c,s,pour){pp(c,"bud_sit",GV[0],GV[1],1);MK.forEach((m,i)=>pp(c,"monk"+i+(pour?"_pour":"_sit"),m[0],m[1],1))}
function bird(c,x,y,fly,t){c.fillStyle="#7A5A44";c.beginPath();c.ellipse(x,y,4.5,3,0,0,7);c.fill();c.fillRect(x+3,y-4,4,4);c.fillStyle="#E8B040";c.fillRect(x+7,y-3,2,1);c.fillStyle="#5A4030";c.fillRect(x-1,y-3-(fly&&(t/80|0)%2)*3,4,2)}
MINI.alms={
  who:"buddha",land:"l3",title:"The Alms Round",short:true,art:K,stages:["The Alms Round"],
  setup:["Each morning we walk with an empty bowl and take what is given.","Plain or sweet, it feeds you just the same."],
  how:"Press A to hold out your bowl, or B to walk on.",
  win:"A full bowl, and no more. That’s enough for today.",
  walk:"Come and eat. There’s always enough to share.",
  lines:[null],pad:false,ab:true,bloomT:2,limit:90,
  fl:["You came back with a bowl.","You took nearly every door as it came, and stopped at enough.","You took whatever came, door by door, and stopped at enough."],
  flNext:["Every door fills the bowl the same.","When the bowl is full, go home."],
  rate:s=>s.more?1:!s.skip?3:s.skip<=1?2:1,
  shotReady:s=>s.di>=4,
  init(s){const R=rng(s.seed!=null?s.seed:(Math.random()*4e9)|0),LP=mPath({pts:LN}),at=y=>{let d=0;while(LP.at(d).y>y&&d<LP.len)d+=.25;return d};
    const dr=DY.map((y,i)=>{const d=at(y),q=LP.at(d),k=KD[i];return{i,k,d,y:q.y,lx:q.x,sd:i%2?-1:1,of:(k?FN:HN)[R()*3|0]}});
    const sp=[...Array(70)].map(()=>{const q=LP.at(R()*LP.len),o=(R()*2-1)*17;return[q.x-q.ty*o,q.y+q.tx*o,R()<.5]});
    const sh=[202,144].map(y=>[LP.at(at(y)).x+50,y]);
    Object.assign(s,{st:0,stT:0,ck:0,pt:0,ph:"walk",d:0,di:0,bowl:0,skip:0,more:0,shared:0,fx:0,sd:1,x:96,y:254,fr:"wb_walk_0",fl:1,LP,dr,sp,sh,P:pfx(),
      K:mPick({items:[{x:56,y:46,w:24,h:24},{x:108,y:46,w:24,h:24}]})})},
  step(s,dt,inp){s.stT+=dt;s.ck+=dt;s.pt+=dt;pStep(s.P,dt,s.rm);s.fx=Math.max(0,s.fx-dt);
    const ph=s.ph,D=s.dr[s.di],LP=s.LP,q=LP.at(s.d),tp=inp.tap||(inp.taps||[])[0],go=p=>{s.ph=p;s.pt=0},
      mv=(x,y,fr,fl)=>{s.x=x;s.y=y;s.fr=fr;s.fl=fl},
      wk=()=>{const w=(s.ck/.3|0)%2;if(w!==s.w){s.w=w;sfx("alms_step")}return"wb_walk_"+w},
      gain=()=>{s.bowl++;s.fx=s.rm?0:.5;sfx("alms_receive");pSparks(s.P,s.x,s.y-16,s.rm?2:6,"#FFE9A8",20)},
      ar=LP.at(Math.min(LP.len,s.d+30));
    if(ph==="walk"){const t=D?D.d:LP.len;s.d=Math.min(t,s.d+8*dt);const w=LP.at(s.d);mv(w.x,w.y+8,wk(),1);
      if(s.d>=t){if(D)go("out");else if(s.bowl>=5)go("pick");else{s.shared=1;go("grove")}}}
    else if(ph==="out"){mv(q.x,q.y+8,"wb_stand",D.sd);s.sd=D.sd;if(s.pt>=.4){go(s.bowl>=5?"full":"ask");if(s.ph==="full")sfx("alms_bow")}}
    else if(ph==="ask"){mv(q.x,q.y+8,"wb_stand",D.sd);s.bb=[q.x-D.sd*22,q.y-4];
      if(inp.aTap||near(tp,s.bb,12)){s.got=0;go("recv")}else if(inp.bTap||near(tp,[ar.x,ar.y],12)){s.skip++;sfx("alms_bow");go("pass")}}
    else if(ph==="recv"){mv(q.x,q.y+8,s.pt<.6?"wb_hold":"wb_bow",D.sd);if(s.pt>=.6&&!s.got){s.got=1;gain();sfx("alms_bow")}if(s.pt>=1.2){s.di++;go("walk")}}
    else if(ph==="pass"||ph==="full"){mv(q.x,q.y+8,"wb_bow",D.sd);if(s.pt>=.5){s.di++;go("walk")}}
    else if(ph==="pick"){mv(q.x,q.y+8,"wb_stand",1);const i=s.K.step(dt,inp);if(i===0)go("grove");else if(i===1){s.more=1;go("gate")}}
    else if(ph==="gate"){const u=Math.min(1,s.pt/4);mv(lerp(96,GT[0]-14,u),lerp(68,GT[1]+18,u),wk(),1);if(u>=1)go("host")}
    else if(ph==="host"){mv(GT[0]-14,GT[1]+18,s.pt<1.2?"wb_stand":"wb_bow",1);if(s.pt>=2.2)go("back")}
    else if(ph==="back"||ph==="grove"){const p=ph==="back"?[[GT[0]-14,GT[1]+18],[96,68],WG]:[[96,68],WG],u=Math.min(1,s.pt/(ph==="back"?6:pl(p,0)[2]/8)),w=pl(p,u);mv(w[0],w[1],wk(),w[0]<s.x?-1:1);
      if(u>=1){s.b0=s.bowl;go(s.bowl<5?"pour":"done")}}
    else if(ph==="pour"){mv(WG[0],WG[1],"wb_hold",-1);const n=Math.min(5,s.b0+Math.floor(s.pt/2*(5-s.b0)));while(s.bowl<n)gain();if(s.pt>=2){while(s.bowl<5)gain();go("done")}}
    else{mv(WG[0],WG[1],"wb_stand",-1);if(s.pt>=.8)return"win"}
    return null},
  draw(s,c,t){bk(c,s);const ph=s.ph,D=s.dr[s.di],LP=s.LP,dw=ph==="out"||ph==="ask"||ph==="recv"||ph==="pass"||ph==="full";
    band(c,LN,40);band(c,[LN[6],GV],24);band(c,[LN[6],GT],24);c.save();for(const p of s.sp){c.fillStyle=p[2]?"#6E5A3C":"#A89068";c.fillRect(hs(p[0]),hs(p[1]),1,1)}c.restore();
    s.sh.forEach(p=>pc(c,"house_shut",p[0],p[1]));
    s.dr.forEach(d=>{const x=d.lx+d.sd*26;pc(c,d.k?"house_fine":"house_humble",x,d.y);glow(c,x+8,d.y,10,"#FFB45A",.35)});
    pc(c,"gate_grand",GT[0],GT[1]);
    grove(c,s,ph==="pour");
    if(ph==="host"||ph==="back"||ph==="gate"&&s.pt>3)pp(c,s.ph==="host"&&s.pt>=1.2?"host_bow":ph==="host"?"host_offer":"host_stand",GT[0]+2,GT[1]+18,-1);
    if(ph==="host"&&s.pt<1.2){c.fillStyle="#6B4A38";c.fillRect(GT[0]-7,GT[1]+7,14,3);pc(c,"o_cake",GT[0]-3,GT[1]+4);pc(c,"o_fruit",GT[0]+3,GT[1]+4)}
    if(ph==="host"&&s.pt>=1.2&&!s.rm)glow(c,GT[0]-6,GT[1]-2,10,"#FFE9A8",.4);
    if(dw){const p=s.pt,vx=lerp(D.lx+D.sd*26,D.lx+D.sd*17,ph==="out"?Math.min(1,p/.4):1),vy=D.y+8,o=ph==="recv"?(p<.6?"offer":"bow"):ph==="full"?(p<.2?"stand":"bow"):ph==="out"?"stand":"offer";
      pp(c,"vil"+D.i%2+"_"+o,vx,vy,-D.sd);
      if(ph!=="out"&&ph!=="full"&&!(ph==="recv"&&p>=.6)){const k=ph==="recv"?p/.6:0;pc(c,D.of,lerp(vx-D.sd*5,s.x+D.sd*9,k),lerp(vy-30,s.y-12,k),{sc:1.5-.5*k})}}
    pp(c,s.fr,s.x,s.y,s.fl);
    if(dw||ph==="walk"){const bx=s.x-s.sd*22,by=s.y-12;rg(c,bx,by,10,s.bowl,s.fx,.12,1);pc(c,s.bowl>=5?"bowl_full":"bowl_empty",bx,by)}
    if(ph==="ask"){const a=Math.atan2(LP.at(s.d+4).y-LP.at(s.d).y,LP.at(s.d+4).x-LP.at(s.d).x),ar=LP.at(Math.min(LP.len,s.d+30));arrow(c,ar.x,ar.y,a,0)}
    if(ph==="pick")s.K.draw(c,(c,it,i,sel)=>{arrow(c,it.x+12,it.y+12,i?0:Math.PI,sel);if(sel){c.strokeStyle="#FFE9A8";c.strokeRect(it.x+.5,it.y+.5,23,23)}});
    rg(c,17,17,9,s.bowl,s.fx,.12,1);pDraw(c,s.P,K)},
  bloom(s,c,k,t){const f=s._fl||MINI.alms.rate(s),u=E.out(k),bx=70,by=134;bk(c,s);grove(c,s);pp(c,"wb_stand",98,122,-1);
    glow(c,bx,by,(26+8*f)*u,"#FFD890",.45*u);rg(c,bx,by,17,5,0,.14*(1-u));pc(c,"bowl_full",bx,by,{sc:2});
    c.fillStyle="#FFF1C8";for(let i=0;i<14;i++){const v=s.rm?(i/14)*k:((t/2200+i/14)%1)*k;c.globalAlpha=(1-v)*u;c.fillRect(hs(lerp(bx,96,v)+Math.sin(i*5+v*6)*5),hs(by-8-v*(by-48)),1.5,1.5)}c.globalAlpha=1;
    for(let i=0;i<f;i++){const w=E.out(clamp((k-.3-.15*i)/.4,0,1)),tx=[48,92,70][i],ty=[142,142,152][i];bird(c,lerp(200,tx,w),lerp(30,ty,w),w<1,t)}
    gradeN(c,"warm",.1*k)},
  auto(s,inp){if(s.ph==="ask"||s.ph==="pick")inp.aTap=true}
};
}
})();
/* GAME:alms:END */
/* GAME:slips:BEGIN */
(function(){
/* The Empty Middle (slips, Laozi). Helper: none (own drag input). Art key laozi_s. */
{
const K="laozi_s",C=[96,128],O=[["wheel_solid","wheel_axle"],["clay","bowl"],["hut_closed","hut_open"]],MX=[10,24,14],ND=[8,18,10],AS=[1,.5,.8],HY=[0,-4,14],SW=[.5,.9,.6],BU=[176,100];
const V=(n,f,g)=>{if(typeof SFX!=="undefined"&&!SFX[n]){SFX[n]=f;if(g)GAP[n]=g}};
V("slips_open",()=>aNoise(.2,{f:520,to:260,q:1.5,v:.03,a:.05}),.14);
V("slips_add",()=>{aNoise(.07,{f:900,q:.8,v:.04});aTone(AN(-14),.09,{type:"triangle",v:.04,lp:500})});
V("slips_works",()=>{aTone(AN(12),.5,{v:.05});aTone(AN(19),.45,{v:.03,at:.08})});
V("slips_bump",()=>aTone(AN(-17),.14,{v:.06,lp:300,to:AN(-22)}));
V("slips_bind",()=>aNoise(.35,{f:2200,to:4200,q:2,v:.03,a:.1}));
const per=(c,n,x,y,f)=>{const A=MINI_ART[K],p=A&&A.pivots&&A.pivots[n];if(!(p&&mPerson(c,K,n,x-p[0],y-p[1]))){c.fillStyle=f;c.fillRect(x-4,y-14,8,14)}};
const ell=(c,x,y,a,b,f)=>{c.fillStyle=f;c.beginPath();c.ellipse(x,y,a,b,0,0,7);c.fill()};
function slip(c,x,y,r,a){if(!mPiece(c,K,"slip",x,y,{ax:.5,ay:.5,rot:r,a})){c.fillStyle="#C8B070";c.fillRect(x-2,y-14,4,28)}}
function back(c){if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#3A3050");g.addColorStop(1,"#1C2A28");c.fillStyle=g;c.fillRect(0,0,192,320);c.fillStyle="#4A4A44";c.fillRect(146,136,46,64)}
  gradeN(c,"dusk",.3);c.fillStyle="rgba(16,11,21,.4)";c.beginPath();c.roundRect?c.roundRect(21,68,150,120,10):c.rect(21,68,150,120);c.fill()}
function fxd(c,s,i,T,ok,g){const X=C[0],Y=C[1];
  if(i===0){if(ok&&T>.5)return;const e=E.out(Math.min(1,T/.5));let x=X+58*(1-e);if(!ok)x=X+58-(54-s.rv)*e+(s.rm?0:8*clamp((T-.5)/.25,0,1));
    c.globalAlpha=ok?1:1-clamp((T-.9)/.3,0,1);ell(c,x,Y,8,8,"#6A4A2A");c.strokeStyle="#C09A5A";c.stroke();c.globalAlpha=1}
  else if(i===1){if(T<1.2){c.strokeStyle="#8A6A48";c.lineWidth=2;c.beginPath();c.moveTo(X+46,Y-44);c.lineTo(X+10,Y-18);c.stroke();c.fillStyle="#9CCBE8";if(T>.2&&T<1)for(let j=0;j<5;j++)c.fillRect(X+8,Y-18+(T*50+j*6)%30,1.5,3)}
    if(ok&&T>.3)ell(c,X,Y-6,Math.min(16,(T-.3)*20),6,"rgba(140,195,230,.75)");
    else if(!ok){for(let j=0;j<6;j++){const u=T-.3-j*.08;if(u>0&&u<.6)ell(c,X+8+u*40,Y-8+u*u*70,1.5,2,"#9CCBE8")}ell(c,X+34,Y+18,10*clamp((T-.8)*2,0,1),3,"rgba(140,195,230,.6)")}}
  else if(ok){if(T>.6){glow(c,X+11*g,Y+16*g,34,"#FFD890",.5*clamp((T-.6)*2,0,1));const q=s.rm?0:Math.sin(T*9)*2,x=X-15*g,y=Y+10*g;c.fillStyle="#C84A3A";c.beginPath();c.moveTo(x-3,y-4);c.lineTo(x+3,y-4);c.lineTo(x+3+q,y+5);c.lineTo(x-3+q,y+5);c.fill()}}
  else{const a=1-clamp((T-.8)/.4,0,1);glow(c,X-46,Y+8,20,"#FFD890",.5*a);c.fillStyle="#FFD890";c.globalAlpha=a*.6;for(let j=0;j<3;j++)c.fillRect(X-62,Y+4+j*4,26*clamp(T*2,0,1),1);c.globalAlpha=1}}
function obj(c,s,t){const i=s.n,f=s.fx,T=f?f.t:0,ok=f&&f.ok,sw=ok&&T>SW[i],g=1+Math.min(.3,.06*s.ga),X=C[0],Y=C[1];let x=X,y=Y,rot=0,k=1;
  if(ok){if(i===0&&sw&&!s.rm){const o=20*Math.sin(Math.PI*clamp((T-.6)/1.1,0,1));x+=o;rot=o/30}if(T>2.4)k=Math.max(0,1-(T-2.4)/.7)}
  if(k>0&&T<3.1){const nm=O[i][sw?1:0],tc=s.ga&&mTint(K,nm,"#F5C66A",Math.min(5,s.ga)*.07),o={ax:.5,ay:.5,sc:2*g*k,rot,a:s.ph?1:Math.min(1,s.pt/.7)};
    if(!(tc?mCanvas(c,tc,x,y,o):mPiece(c,K,nm,x,y,o)))ell(c,x,y,30*g*k,22*g*k,["#8A5A32","#7A7480","#B09A70"][i]);
    if(!sw&&s.rv>.2)ell(c,X,Y+HY[i],s.rv,s.rv*AS[i],"#0A0710")}
  if(f)fxd(c,s,i,T,ok,g);if(ok&&T>2.4&&T<3.7){const e=E.inOut(clamp((T-3.1)/.6,0,1));slip(c,lerp(X,BU[0],e),lerp(Y,BU[1]-4+s.sl*4,e),Math.PI/2*e)}}
function bundle(c,s,t){const n=s.sl,b=s.ph===5?clamp(s.pt/.8,0,1):s.ph>5?1:0;
  if(s.ph>5){const e=E.inOut(clamp(s.pt/.7,0,1));if(s.pt<1)mPiece(c,K,"bundle",lerp(BU[0],172,e),lerp(BU[1],176,e),{ax:.5,ay:.5,sc:1.25});return}
  for(let j=0;j<n;j++)slip(c,BU[0],BU[1]-4+j*4,Math.PI/2);
  if(b>0){c.strokeStyle="#7A5A32";c.lineWidth=1.5;c.beginPath();c.moveTo(BU[0]-4,BU[1]-8);c.lineTo(BU[0]-4,BU[1]-8+20*b);c.stroke()}}
function ink(c,i,x,y,k,r){c.save();c.globalAlpha=k;c.fillStyle="#F2E8D5";c.fillRect(x-9,y-9,18,18);c.strokeStyle="#1A1222";c.lineWidth=1;c.beginPath();
  if(i===0){c.arc(x,y,6,0,7);for(let j=0;j<4;j++){c.moveTo(x,y);c.lineTo(x+6*Math.cos(r+j*1.57),y+6*Math.sin(r+j*1.57))}}else if(i===1){c.arc(x,y-1,6,0,Math.PI);c.moveTo(x-6,y-1);c.lineTo(x+6,y-1)}else{c.moveTo(x-6,y+6);c.lineTo(x-6,y-1);c.lineTo(x,y-6);c.lineTo(x+6,y-1);c.lineTo(x+6,y+6);c.closePath()}
  c.stroke();if(i===1)ell(c,x,y+2,3,1,"#9CCBE8");if(i===2)ell(c,x,y+2,2,2.5,"#F5C66A");c.restore()}
function grow(s,v){s.r=Math.min(MX[s.n],s.r+v);s.tch=true;sfx("slips_open")}
function add(s){s.adds++;s.ga++;s.tch=true;sfx("slips_add")}
MINI.slips={who:"laozi",land:"l3",title:"The Empty Middle",short:true,art:K,stages:["The Empty Middle"],
  setup:["The story goes that a gatekeeper asked me to write before I left.","So here is the simplest thing I know."],
  how:"Drag out from the middle to open it. Then let go and see.",win:"The hub, the bowl, the room. The empty part is what makes them useful.",walk:"Fewer words are better anyway. Go on through the gate.",
  lines:[null],pad:true,ab:false,bloomT:2,limit:70,
  fl:["The three slips were written.","You added almost nothing.","You added nothing, and each thing worked the first time."],flNext:["Adding more never helps.","Open the middle wide enough, then let go."],
  rate:s=>s.adds===0&&s.fails===0?3:s.adds<=2?2:1,
  shotReady:s=>s.n===1&&s.ph===1&&s.r>=10,
  init(s){Object.assign(s,{st:0,stT:0,T:0,n:0,ph:0,pt:0,r:0,rv:0,ga:0,adds:0,fails:0,tch:false,idle:0,str:null,kd:false,fx:null,sl:0,aS:null})},
  step(s,dt,inp){s.T+=dt;s.stT+=dt;s.pt+=dt;const f=s.fx;s.rv+=(s.r-s.rv)*Math.min(1,dt*10);
    if(f){f.t+=dt;if(!f.p&&f.t>=.45){f.p=1;sfx(f.ok?"slips_works":"slips_bump")}if(!f.ok&&f.t>1.2)s.fx=null}
    if(s.ph===0){if(s.pt>=.7){s.ph=1;s.pt=0}return null}
    if(s.ph===2){if(s.pt>=3.7){s.sl++;s.fx=null;s.pt=0;if(++s.n>2){s.ph=5;sfx("slips_bind")}else{s.ph=0;s.r=s.rv=s.ga=0;s.tch=false}}return null}
    if(s.ph===5){if(s.pt>=.8){s.ph=6;s.pt=0}return null}
    if(s.ph===6)return s.pt>=1.5?"win":null;
    const d=inp.down,dy=inp.dy||0;let act=!!d;
    if(d){const q=Math.hypot(d.x-C[0],d.y-C[1]);if(!s.str)s.str={m:q,d0:q,k:q<=16?1:q>36?2:0,c:0};const t=s.str;
      if(t.k===1&&q>t.m){grow(s,(q-t.m)/2);t.m=q}else if(t.k===2){t.m=Math.min(t.m,q);if(!t.c&&t.d0-t.m>=12){t.c=1;add(s)}}}else s.str=null;
    if(dy<-.5){act=true;grow(s,12*dt)}
    const dn=dy>.5;if(inp.dTap||(dn&&!s.kd)){act=true;add(s)}s.kd=dn;
    if(act)s.idle=0;else if(s.tch&&(s.idle+=dt)>=.8){const ok=s.r>=ND[s.n];s.tch=false;s.fx={t:0,ok};if(ok){s.ph=2;s.pt=0}else s.fails++}
    return null},
  draw(s,c,t){back(c);bundle(c,s,t);const w=s.ph<6?"lao_write_"+(s.rm?0:Math.floor(s.T*1.5)%2):"lao_sit";per(c,w,160,196,"#D8D0C0");
    per(c,s.ph===6?(s.pt<.7?"yin_bow":"yin_hold"):"yin_stand",180,186,"#4A4A7A");
    if(s.ph<5){obj(c,s,t);if(s.ph===1&&!s.tch&&!s.adds){c.save();c.strokeStyle="rgba(255,233,184,.6)";c.setLineDash([2,3]);c.beginPath();c.arc(C[0],C[1]+HY[s.n],16,0,7);c.stroke();c.restore()}}},
  bloom(s,c,k,t){back(c);const L=s._fl||1,e=E.inOut(clamp(k/.5,0,1));
    for(let j=0;j<3;j++)slip(c,96,176+(j-1)*10*(1-e),Math.PI/2,1-e);
    mPiece(c,K,"bundle",96,176,{ax:.5,ay:.5,sc:2,a:e});glow(c,96,70,60,"#FFE3A0",.4*k);
    for(let i=0;i<3;i++){const o=i<L?E.inOut(k):0;c.fillStyle=`rgba(225,220,235,${.4*(1-.85*o)})`;c.beginPath();c.ellipse(96+(i%2?1:-1)*o*(30+i*10),84+i*4,44-i*4,9,0,0,7);c.fill()}
    for(let i=0;i<3;i++)ink(c,i,[70,96,122][i],52+(i%2)*-8,clamp((k-.4-i*.12)/.2,0,1),s.rm?0:k*6)},
  auto(s,inp){if(s.ph!==1){s.aS=null;return}if(s.aS==null)s.aS=s.T;const u=s.T-s.aS;if(u<.7)inp.down={x:96+u/.7*(MX[s.n]*2+4),y:128}}
};
}
})();
/* GAME:slips:END */
/* GAME:buffalo:BEGIN */
(function(){
/* The Buffalo Ride (buffalo, Laozi). Helper: none (own sway and nudge). Art key laozi_s. */
{
const K="laozi_s",D=Math.PI/180,TAU=Math.PI*2,FB=[[96,248],[64,214],[110,176],[70,138],[118,100],[84,66],[96,40]];
const V=(n,f,g)=>{if(typeof SFX!=="undefined"&&!SFX[n]){SFX[n]=f;if(g)GAP[n]=g}};
V("buffalo_step",()=>aTone(AN(-19),.07,{type:"triangle",v:.03,lp:350}),.2);
V("buffalo_bell",()=>aTone(1568,.7,{v:.035,a:.003}),.5);
V("buffalo_turn",()=>aNoise(.2,{f:900,to:2200,q:1.5,v:.03,a:.06}));
V("buffalo_balk",()=>{aNoise(.25,{f:260,to:150,q:1.2,v:.07,a:.04});aTone(AN(-10),.18,{type:"square",v:.02,lp:600})},.3);
const wr=a=>{while(a>Math.PI)a-=TAU;while(a<-Math.PI)a+=TAU;return a};
function near(R,x,y){let b=1e9,u=0,L=0;for(let i=1;i<R.length;i++){const a=R[i-1],e=R[i],dx=e[0]-a[0],dy=e[1]-a[1],l=Math.hypot(dx,dy)||1,t=clamp(((x-a[0])*dx+(y-a[1])*dy)/(l*l),0,1),d=Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);if(d<b){b=d;u=L+t*l}L+=l}return[b,u]}
function at(R,u){for(let i=1;i<R.length;i++){const a=R[i-1],e=R[i],l=Math.hypot(e[0]-a[0],e[1]-a[1])||1;if(u<=l||i===R.length-1){const t=clamp(u/l,0,1);return[a[0]+(e[0]-a[0])*t,a[1]+(e[1]-a[1])*t]}u-=l}}
function start(R){for(let i=1;i<R.length;i++){const a=R[i-1],e=R[i];if(a[1]>=248&&e[1]<=248){const t=(a[1]-248)/(a[1]-e[1]||1);return[a[0]+(e[0]-a[0])*t,248,Math.atan2(a[0]-e[0],a[1]-e[1])]}}return[R[0][0],R[0][1],0]}
function nudge(s,sd){if(sd===(Math.cos(s.phi)>0?1:-1)&&Math.abs(Math.sin(s.phi))<.85){s.th+=sd*24*D;sfx("buffalo_turn")}else{s.pl=1.2;s.balk++;s.sh=1.2;sfx("buffalo_balk")}}
function press(s,dt,inp){let cur=0,tc=0;const p=s.pr;
  if(inp.down){tc=1;cur=p&&p.tc?p.sd:inp.down.y<250?(inp.down.x<96?1:-1):0}else cur=inp.dx<-.5?1:inp.dx>.5?-1:0;
  if(p&&(cur!==p.sd||tc!==p.tc)){if(p.t<.4)nudge(s,p.sd);s.pr=null}
  if(!s.pr&&cur&&s.pl<=0)s.pr={sd:cur,t:0,tc};
  const r=s.pr;if(r&&(r.t+=dt)>=.4){s.yank++;s.pl=2;s.pr=null;sfx("buffalo_balk")}}
function back(c,s){const R=s.R;if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#5A5A62");g.addColorStop(1,"#1C2A28");c.fillStyle=g;c.fillRect(0,0,192,320);
    c.strokeStyle="#8A7550";c.lineWidth=20;c.lineJoin="round";c.beginPath();R.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke();c.fillStyle="#3A3A44";c.fillRect(72,30,48,58);c.fillStyle="#0A0710";c.fillRect(90,70,13,18)}}
function mist(c,k,L,x){for(let i=0;i<3;i++){const o=i<L?k:0;c.fillStyle=`rgba(225,220,235,${.4*(1-.85*o)})`;c.beginPath();c.ellipse(x-o*(50+i*20)+(i-1)*12,76+i*5,44-i*4,10+i*2,0,0,7);c.fill()}}
function cow(c,s,x,y,h,t,dip){const sp=Math.sin(s.phi),f=sp>.33?"buf_left":sp<-.33?"buf_right":"buf_mid",rm=s.rm,bob=rm||!s.v?0:Math.floor(s.lg/3)%2,jit=!rm&&s.sh>0?Math.sin(t/45)*.1:0;
  mShadow(c,x,y+9,16,.35);
  if(!mPiece(c,K,f,x,y+bob*.5,{ax:.5,ay:.5,rot:-h+jit+(bob?.03:-.03)*(s.v?1:0)})){c.save();c.translate(x,y);c.rotate(-h);c.fillStyle="#8A8A94";c.beginPath();c.ellipse(0,2,6,12,0,0,7);c.fill();c.beginPath();c.arc(0,-12-dip,4,0,7);c.fill();c.restore()}
  const rp=!rm&&Math.floor(t/700)%2?"lao_ride_1":"lao_ride_0",A=MINI_ART[K],pv=A&&A.pivots&&A.pivots[rp];
  if(!(pv&&mPerson(c,K,rp,x-pv[0],y+10-pv[1]))){c.fillStyle="#D8D0C0";c.fillRect(x-4,y-8,8,12)}
  const fx=-Math.sin(h),fy=-Math.cos(h),bx=x+fx*13-Math.cos(h)*sp*3,by=y+fy*13+Math.sin(h)*sp*3;
  if(!mPiece(c,K,"bell",bx,by,{ax:.5,ay:.3,rot:sp*.5})){c.fillStyle="#C08A3A";c.fillRect(bx-2,by-1,4,5)}}
MINI.buffalo={who:"laozi",land:"l3",title:"The Buffalo Ride",short:true,art:K,stages:["The Buffalo Ride"],
  setup:["The story goes that I rode west on a water buffalo and was never seen again.","Let’s see if you can guide one without a fight."],
  how:"Tap left or right to nudge, just as its head turns. Never pull.",win:"See? We got here, and no one was pushed.",walk:"The buffalo knows the way. Ride along with it.",
  lines:[null],pad:true,ab:false,bloomT:2,limit:110,
  fl:["You reached the gate.","You nudged more than you pulled.","You never pulled once, and the road bent with you."],flNext:["Nudge just as its head turns that way.","Never hold the reins."],
  rate:s=>s.yank===0&&s.balk<=1&&s.off<4?3:s.balk+s.yank<=3?2:1,
  shotReady:s=>s.y<185,
  init(s){const A=MINI_ART[K],R=A&&A.road||FB,g=A&&A.geo&&A.geo.gate||[96,40],p=start(R);
    Object.assign(s,{st:0,stT:0,T:0,R,g,x:p[0],y:p[1],h:p[2],th:p[2],phi:0,pl:0,v:6,balk:0,yank:0,off:0,pr:null,sh:0,bn:0,lg:0,aN:null,aL:-9,bb:0})},
  step(s,dt,inp){s.T+=dt;s.stT+=dt;s.phi+=TAU/3.2*dt;const bn=Math.floor((s.phi+Math.PI/2)/Math.PI);if(bn!==s.bn){s.bn=bn;sfx("buffalo_bell")}
    s.sh=Math.max(0,s.sh-dt);if(s.pl>0){s.pl-=dt;s.pr=null}else press(s,dt,inp);
    const dh=s.th-s.h,m=40*D*dt;s.h+=Math.abs(dh)<=m?dh:Math.sign(dh)*m;
    const on=near(s.R,s.x,s.y)[0]<=15;if(!on)s.off+=dt;s.v=s.pl>0?0:on?6:3;
    if(s.v){const o=Math.floor(s.lg/3);s.lg+=s.v*dt;if(Math.floor(s.lg/3)!==o)sfx("buffalo_step");s.x=clamp(s.x-Math.sin(s.h)*s.v*dt,8,184);s.y=clamp(s.y-Math.cos(s.h)*s.v*dt,24,296)}
    return Math.hypot(s.x-s.g[0],s.y-s.g[1])<12?"win":null},
  draw(s,c,t){back(c,s);const rm=s.rm,cs=Math.cos(s.phi),a=.25+.5*Math.abs(cs),d=cs>0?1:-1,ax=s.x-d*17,off=near(s.R,s.x,s.y)[0]>15&&!rm&&Math.floor(t/400)%2;
    cow(c,s,s.x,s.y,s.h,t,off?2:0);
    if(!s.pl){c.save();c.strokeStyle="#FFE3A0";c.lineWidth=1.2;for(let i=0;i<2;i++){c.globalAlpha=a*(1-i*.4);const x=ax-d*i*3;c.beginPath();c.moveTo(x+d*3,s.y-10);c.lineTo(x,s.y-6);c.lineTo(x+d*3,s.y-2);c.stroke()}c.restore();glow(c,ax,s.y-6,9,"#FFE3A0",.3*a)}},
  bloom(s,c,k,t){back(c,s);const L=s._fl||1,e=E.out(Math.min(1,k*2));if(k>=.3&&!s.bb){s.bb=1;sfx("buffalo_bell")}
    glow(c,44,70,20+56*k,"#FFD27A",.5*k*(.5+.17*L));mist(c,E.inOut(k),L,96);
    const sp=s.phi;s.phi=0;s.v=0;cow(c,s,s.x,s.y,s.h*(1-e),t,3*e);s.phi=sp;
    const rk=clamp((k-.3)/.5,0,1);if(rk>0&&rk<1){c.strokeStyle="#FFE9B8";c.globalAlpha=1-rk;c.lineWidth=1.2;c.beginPath();c.arc(s.x,s.y-11,3+rk*26,0,7);c.stroke();c.globalAlpha=1}},
  auto(s,inp){if(s.aN&&s.T-s.aN.t<.12){inp.dx=-s.aN.sd;return}s.aN=null;
    const q=near(s.R,s.x,s.y),e=wr(Math.atan2(-(at(s.R,q[1]+26)[0]-s.x),-(at(s.R,q[1]+26)[1]-s.y))-s.th),sd=e>0?1:-1;
    if(Math.abs(e)>12*D&&s.pl<=0&&s.T-s.aL>.3&&Math.cos(s.phi)*sd>0&&Math.abs(Math.sin(s.phi))<.6){s.aN={t:s.T,sd};s.aL=s.T;inp.dx=-sd}}
};
}
})();
/* GAME:buffalo:END */
/* GAME:ding:BEGIN */
(function(){
/* Following the Gaps (Zhuangzi, short). Helper: mPath, one per seam. Art key zhuangzi_s. */
{
const K="zhuangzi_s",GO="#F5C66A",NM=["neck","shoulder","back","hip","foreleg","hindleg"],PI=Math.PI,
DS=[[[72,96],[70,110],[62,126]],[[74,100],[80,116],[78,136]],[[78,102],[96,104],[116,104],[132,106]],[[132,106],[126,122],[128,138]],[[78,136],[76,150],[76,168]],[[128,138],[124,152],[128,168]]],
DK=[[74,99],[78,136],[132,106],[128,138]],
OX=[[62,100],[78,96],[100,98],[132,100],[142,112],[142,140],[136,152],[130,168],[122,168],[124,148],[110,140],[96,142],[80,140],[78,168],[70,168],[72,148],[62,126],[48,130],[44,116],[50,104],[62,100]];
const V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
V("ding_glide",()=>aNoise(.2,{f:3800,to:5400,q:.8,v:.012,a:.06}));
V("ding_nick",()=>{aTone(AN(-17),.09,{type:"triangle",v:.07,lp:500,to:AN(-22)});aNoise(.06,{f:900,q:1.5,v:.03})});
V("ding_seam",()=>[0,7].forEach((n,i)=>aTone(AN(n+12),.9,{v:.04,a:.01,at:i*.08})));
/* distance from (x,y) to the part of a seam a finger may count on (the window mPath uses) */
const ne=(P,x,y)=>{const lo=Math.max(0,P.d-6),hi=Math.min(P.len,P.d+24);let m=1e9;for(const g of P.seg){if(g.d0>hi||g.d0+g.l<lo)continue;const a=g.b[0]-g.a[0],b=g.b[1]-g.a[1],q=P.at(clamp(g.d0+clamp(((x-g.a[0])*a+(y-g.a[1])*b)/(a*a+b*b||1),0,1)*g.l,lo,hi));m=Math.min(m,Math.hypot(q.x-x,q.y-y))}return m};
const nick=(s,x,y)=>{if(s.T-s.nT<.3)return;s.nT=s.T;s.nicks++;s.bl.push({x,y,t:0});if(s.bl.length>14)s.bl.shift();sfx("ding_nick")};
const fig=(c,n,x,y)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];mShadow(c,x,y,12,.35);if(r&&v&&mPerson(c,K,n,x,y,{ax:v[0]/r[2],ay:v[1]/r[3]}))return;c.fillStyle="#100B15";c.fillRect(x-5,y-18,10,18);c.fillStyle="#E8E0D0";c.fillRect(x-4,y-17,8,14)};
const back=c=>{if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#2C4636");g.addColorStop(1,"#142018");c.fillStyle=g;c.fillRect(0,0,192,320);c.fillStyle="#6A4A2A";c.fillRect(70,114,52,22)}gradeN(c,"warm",.25);glow(c,96,118,64,"#FFD890",.16)};
const scroll=(c,a)=>{if(mPiece(c,K,"ox_scroll",96,130,{ax:.5,ay:.5})){if(a<1){c.fillStyle="rgba(222,230,205,"+.8*(1-a)+")";c.fillRect(28,78,138,106)}return}
  c.fillStyle="#DDE5CB";c.fillRect(20,72,152,116);c.strokeStyle="rgba(26,18,34,"+a+")";c.lineWidth=1.4;c.beginPath();OX.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke()};
const knife=(c,x,y,a,rot,sc,ay)=>{if(mPiece(c,K,"knife",x,y,{ax:.5,ay,rot,sc,a}))return;c.save();c.globalAlpha=a;c.translate(x,y);c.rotate(rot);c.scale(sc,sc);c.fillStyle="#C8D0D8";c.fillRect(-3,-13,6,13);c.fillStyle="#6A4A2A";c.fillRect(-1,0,2,8);c.restore()};
const line=(c,pts,col,w)=>{c.strokeStyle=col;c.lineWidth=w;c.lineCap="round";c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke()};
MINI.ding={who:"zhuangzi",land:"l3",title:"Following the Gaps",short:true,art:K,stages:["Following the Gaps"],
  setup:["Cook Ding used one knife for nineteen years, and it never went dull.","He never hacked. He found the spaces that were already there."],
  how:"Drag along the gold lines. Slow down where they meet.",win:"Still sharp. You didn’t force a thing. You followed.",walk:"Even Ding had a first day. Put the knife down and walk with me.",
  lines:[null],pad:true,ab:true,bloomT:2,limit:90,
  fl:["You found every gap.","You hardly forced the blade.","Not one nick. The knife is as sharp as new."],flNext:["Stay on the gold lines.","Slow down where the lines meet."],
  rate:s=>s.nicks===0?3:s.nicks<=3?2:1,
  shotReady:s=>s.n>=2&&!!s.f,
  init(s){const A=MINI_ART[K],S=A&&A.seams;Object.assign(s,{st:0,stT:0,T:0,nicks:0,nT:-9,n:0,wt:-1,cur:-1,f:0,h:[],sp:0,gd:0,bl:[],fx:pfx(),kx:72,ky:96,ld:.05,
    kn:A&&A.knots||DK,P:NM.map((n,i)=>mPath({pts:S&&S[n]||DS[i],tol:5})),dn:NM.map(()=>0)})},
  step(s,dt,inp){const T=s.T+=dt;s.stT+=dt;s.ld=dt;pStep(s.fx,dt,s.rm);for(const b of s.bl)b.t+=dt;
    if(s.wt>=0){s.wt+=dt;return s.wt>=.8?"win":null}
    let f=inp.down;
    if(f){s.kx=f.x;s.ky=f.y}else{const m=Math.hypot(inp.dx,inp.dy);if(m>0){const q=40*dt/Math.max(1,m);s.kx=clamp(s.kx+inp.dx*q,6,186);s.ky=clamp(s.ky+inp.dy*q,60,248)}if(inp.a)f={x:s.kx,y:s.ky}}
    if(!f){s.cur=-1;s.h=[];s.sp=0;s.f=0;return null}
    s.f=1;s.h.push([T,f.x,f.y]);while(s.h.length>1&&s.h[1][0]<=T-.12)s.h.shift();
    const q=s.h[0],el=T-q[0];if(el>.04)s.sp=Math.hypot(f.x-q[1],f.y-q[2])/el;
    const ik=s.kn.some(k=>Math.hypot(f.x-k[0],f.y-k[1])<=8),tol=ik?3:5,go=j=>{const P=s.P[j];P.tol=tol;return P.step(dt,{down:f,dx:0,dy:0,a:false})};
    let c=s.cur,r=c>=0?go(c):null;
    if(c<0||r.off){let b=-1,be=1e9;s.P.forEach((P,j)=>{if(j!==c&&!s.dn[j]){const e=ne(P,f.x,f.y);if(e<=tol&&e<be){be=e;b=j}}});
      if(b>=0){c=s.cur=b;r=go(b)}else{if(c>=0)nick(s,f.x,f.y);return null}}
    if(ik&&s.sp>25)nick(s,f.x,f.y);
    if(r.pace>2){s.gd+=r.pace*dt;if(s.gd>7){s.gd=0;sfx("ding_glide")}if(!s.rm)pAdd(s.fx,{x:f.x,y:f.y,vx:(Math.random()-.5)*8,vy:-4,life:.5,col:GO,s:1})}
    if(r.u>=.92){const P=s.P[c];s.dn[c]=T;P.d=P.len;s.cur=-1;s.n++;sfx("ding_seam");if(!s.rm)pSparks(s.fx,f.x,f.y,8,GO,30);if(s.n>=6)s.wt=0}
    return null},
  draw(s,c,t){const T=s.T;back(c);scroll(c,1);
    for(const b of s.bl){c.fillStyle="rgba(18,11,24,.85)";c.beginPath();c.arc(b.x,b.y,Math.min(2.6,1+b.t*9),0,7);c.fill()}
    c.save();c.setLineDash([1.5,2.5]);c.strokeStyle="rgba(255,233,184,.55)";c.lineWidth=.8;for(const k of s.kn){c.beginPath();c.arc(k[0],k[1],8,0,7);c.stroke()}c.restore();
    s.P.forEach((P,i)=>{const d=s.dn[i];
      if(d){const k=Math.min(1,(T-d)/.8);for(const u of [.25,.5,.75]){const p=P.at(P.len*u);glow(c,p.x,p.y,14,GO,.5-.3*k)}P.drawDone(c,GO)}
      else{P.drawGuide(c,"rgba(245,198,106,.85)");P.drawDone(c,GO);if(P.d<1){const p=P.pts[0];glow(c,p[0],p[1],6,GO,s.rm?.5:.55+.35*Math.sin(T*6))}}});
    fig(c,s.f?"ding_knife":"ding_stand",24,176);
    if(s.f)glow(c,s.kx,s.ky,7,GO,.5);knife(c,s.kx,s.ky,s.f?1:.55,-.5,1,.65);
    knife(c,24,14,1,PI/2,1.6,.5);c.fillStyle="#2A1E32";for(let i=0;i<Math.min(9,s.nicks);i++)c.fillRect(11+i*3,9,1.5,2);
    pDraw(c,s.fx,K)},
  bloom(s,c,k,t){const fl=s._fl||1,e=E.out(clamp(k/.5,0,1)),g=clamp((k-.25)/.6,0,1),T=s.rm?0:t/1000;back(c);scroll(c,1-e);
    NM.forEach((n,i)=>{const A=MINI_ART[K],p=(A&&A.seams&&A.seams[n])||DS[i];glow(c,p[1][0],p[1][1],16,GO,.4*e*(.7+.3*Math.sin(T*4+i)));line(c,p,GO,2.5)});
    if(g>0)for(let i=0;i<5;i++)wave(c,26,92+i*18,140*g,3+i%2*2,1.5+i*.3,T*2+i,0,"rgba(26,18,34,"+.5*g+")",1+i%2);
    knife(c,96,224,1,PI/2,2,.5);
    for(let i=0;i<fl;i++){const p=clamp((k-.3-i*.18)/.3,0,1);if(p<=0)continue;const x=p<1?72+48*p:76+40*(i+1)/(fl+1);glow(c,x,224,10,"#FFFFFF",.8);c.fillStyle="#FFF4D0";c.fillRect(x-5,223.5,10,1);c.fillRect(x-.5,219,1,10)}
    fig(c,k>.6?"ding_bow":"ding_stand",24,176)},
  auto(s,inp){const i=s.dn.indexOf(0);if(i<0)return;if(s.ai!==i){s.ai=i;s.ad=0;return}
    s.ad=Math.min(s.P[i].len,s.ad+20*s.ld);const q=s.P[i].at(s.ad);inp.down={x:q.x,y:q.y}}
};
}
})();
/* GAME:ding:END */
/* GAME:claypot:BEGIN */
(function(){
/* The Turning Seasons (Zhuangzi, short). Helper: none (a beat clock). Art key zhuangzi_s. 42B (Cade): window ±0.09 s; misses (toks) count only in lanterns. */
{
const K="zhuangzi_s",PI=Math.PI,IV=[.75,.55,.9,1.2],B0=3.6,TAIL=.8,WIN=.09,PX=104,RY=144,H=[73,166],
PN=["petal","","maple","snow"],EM=["em_blossom","em_lotus","em_maple","em_pine"],
TN=[["#E8A8C0","soft-light"],["#E8E070","overlay"],["#E8963A","overlay"],["#CFE4F8","soft-light"]];
const V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
V("claypot_dong",q=>{const f=AN(-2-2.5*(q||0));aTone(f,.7,{v:.09,a:.004,lp:900,to:f*.9});aTone(f*2,.3,{type:"triangle",v:.025,lp:1600})});
V("claypot_tok",()=>aNoise(.07,{f:1400,q:1.2,v:.04,a:.004}));
V("claypot_turn",()=>[12,16,19,24].forEach((n,i)=>aTone(AN(n),1.1,{v:.025,a:.01,at:i*.07})));
const pc=(c,n,x,y,o,col,r)=>{if(mPiece(c,K,n,x,y,Object.assign({ax:.5,ay:.5},o)))return;c.save();c.globalAlpha=o&&o.a!=null?o.a:1;c.fillStyle=col||"#F2A8C0";c.beginPath();c.arc(x,y,r||3,0,7);c.fill();c.restore()};
const fig=(c,n,x,y)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];mShadow(c,x,y,16,.35);if(r&&v&&mPerson(c,K,n,x,y,{ax:v[0]/r[2],ay:v[1]/r[3]}))return;c.fillStyle="#3A5A3A";c.fillRect(x-6,y-14,12,14);c.fillStyle="#D8B890";c.fillRect(x-3,y-19,6,6)};
const tint=(c,q,a)=>grade(c,TN[q][0],a,TN[q][1]);
const back=(c,q,p)=>{if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#3A5A4A");g.addColorStop(1,"#16241C");c.fillStyle=g;c.fillRect(0,0,192,320)}
  if(p==null)tint(c,q,.4);else{tint(c,(q+3)%4,.4*(1-p));tint(c,q,.4*p)}};
const pot=(c,dy)=>{if(mPiece(c,K,"pot",PX,172+dy,{ax:.5,ay:1}))return;c.fillStyle="#9A5A32";c.beginPath();c.ellipse(PX,158+dy,15,16,0,0,7);c.fill()};
const ring=(c,s,T)=>{const e=s.cn?E.inOut(clamp((T-s.rt)/.9,0,1)):0,a=-PI/2*(s.cn?s.cn-1+e:0);c.fillStyle="rgba(16,11,21,.5)";c.beginPath();c.arc(96,54,36,0,7);c.fill();
  EM.forEach((n,i)=>{const t=a-PI/2+i*PI/2,x=96+Math.cos(t)*26,y=54+Math.sin(t)*26,top=Math.abs(Math.sin(t)+1)<.2;if(top)glow(c,x,y,13,"#FFE3A0",.5);pc(c,n,x,y,{a:top?1:.7,sc:1.5},"#C8B070",5)})};
const obj=(c,s,b,k,T)=>{const iv=IV[b.q],u=(T-b.t)/iv+1;if(u<0||u>1+.5/iv)return;const w=Math.min(1,u),y=84+(RY-84)*w,x=PX+((k*37%11)-5)*.8+Math.sin(u*6+k)*(b.q===3?2:b.q===2?4:3),a=u>1?1-(u-1)*iv/.5:Math.min(1,u*5),r=s.rm?0:u*3;
  if(b.q===1){c.save();c.globalAlpha=a;c.strokeStyle="#D8E87A";c.lineWidth=1.2;c.beginPath();c.arc(PX,RY,30-22*w,0,7);c.stroke();c.restore();pc(c,"cicada",PX+12,RY-5+(u>1&&u<1.2?-1:0),{a:1},"#7A9A3A",3)}
  else pc(c,PN[b.q],x,y,{rot:r,a},b.q===2?"#D86A22":b.q===3?"#EAF4FF":"#F2A8C0",b.q===2?4:3);
  if(b.h&&u>1&&u<1.5)glow(c,PX,RY,12,"#FFD890",.6*(1-(u-1)*iv/.3))};
const lift=(s,T)=>s.hd?Math.min(1,s.hT/.25):s.dl;
MINI.claypot={who:"zhuangzi",land:"l3",title:"The Turning Seasons",short:true,art:K,stages:["The Turning Seasons"],
  setup:["Spring turns to summer, summer to autumn, autumn to winter.","Nothing stays the same. So let’s drum along with it."],
  how:"Lift the mallet, and let it fall on the beat. When the season turns, follow the new one.",win:"Round and round, and here’s spring again. Everything changes, and that’s all right.",walk:"The seasons will keep turning. You can join in any time.",
  lines:[null],pad:false,ab:true,bloomT:2.2,limit:90,
  fl:["The year went round.","You kept time through most of the year.","Each time the season turned, you turned with it."],flNext:["Watch the petals, leaves, and snow land.","When the ring turns, let go of the old beat."],
  rate:s=>{const k=s.tok||0;return s.hits>=35&&s.turn>=10&&k<=4?3:s.hits>=26&&s.turn>=6&&k<=10?2:1},
  shotReady:s=>s.cn>=2&&s.T-s.rt<.4,
  init(s){const bt=[];let t=B0;for(let k=0;k<44;k++){const q=k<40?k/10|0:0;if(k)t+=IV[q];bt.push({t,q,tn:k>=10&&k%10<3,h:0})}
    Object.assign(s,{st:0,stT:0,T:0,hits:0,turn:0,tok:0,bt,cn:0,rt:-9,ch:[],hd:0,hT:0,dl:0,sk:0,rp:[],fx:pfx(),ld:.05})},
  step(s,dt,inp){const T=s.T+=dt;s.stT+=dt;s.ld=dt;pStep(s.fx,dt,s.rm);s.rp=s.rp.filter(r=>(r.t+=dt)<.8);s.sk=Math.max(0,s.sk-dt);
    while(s.cn<4&&T>=s.bt[s.cn*10+9].t){s.cn++;s.rt=T;s.ch.push(T);sfx("claypot_turn")}
    const d=!!(inp.a||(inp.down&&(s.hd||inp.down.y<250)));
    if(d){if(!s.hd)s.hT=0;s.hd=1;s.hT+=dt;s.dl=Math.min(1,s.hT/.25)}
    else{if(s.hd){s.hd=0;s.sk=.15;let j=-1,e=9;s.bt.forEach((b,i)=>{const x=Math.abs(b.t-T);if(!b.h&&x<=WIN+1e-9&&x<e){e=x;j=i}});
      if(j>=0){const b=s.bt[j];b.h=1;s.hits++;if(b.tn)s.turn++;sfx("claypot_dong",b.q);s.rp.push({t:0});
        if(!s.rm){for(let i=0;i<5;i++)pAdd(s.fx,{k:"piece",name:PN[b.q]||"petal",x:PX,y:RY,vx:(i-2)*16,vy:-30-i%2*14,g:90,life:.8,r:i,vr:3,sc:1});pSparks(s.fx,PX,RY,4,"#FFD890",30)}}
      else{s.tok++;sfx("claypot_tok");if(!s.rm)pDust(s.fx,PX+8,RY+6,5)}}
      s.dl=Math.max(0,s.dl-dt*10)}
    return T>=s.bt[43].t+TAIL?"win":null},
  draw(s,c,t){const T=s.T,q=s.cn%4,e=s.cn?clamp((T-s.rt)/.9,0,1):1;back(c,q,s.cn?E.inOut(e):null);
    const l=lift(s,T),a=-.9*l,hx=H[0]+Math.cos(a)*15,hy=H[1]+Math.sin(a)*15;
    glow(c,PX,RY+10,34,"#FFE3A0",.12);fig(c,T<s.bt[0].t-IV[0]?"zz_relax":l>.2?"zz_drum_up":"zz_drum_down",64,178);
    pot(c,s.sk>.1?1:0);s.bt.forEach((b,k)=>obj(c,s,b,k,T));
    c.strokeStyle="#6A4A2A";c.lineWidth=1.5;c.lineCap="round";c.beginPath();c.moveTo(H[0],H[1]);c.lineTo(hx,hy);c.stroke();c.fillStyle="#C9A06A";c.beginPath();c.arc(hx,hy,2.2,0,7);c.fill();
    for(const r of s.rp){c.strokeStyle="rgba(255,216,144,"+(1-r.t/.8)+")";c.lineWidth=1.2;c.beginPath();c.ellipse(PX,RY+12,6+r.t*60,3+r.t*28,0,0,7);c.stroke()}
    ring(c,s,T);pDraw(c,s.fx,K)},
  bloom(s,c,k,t){const fl=s._fl||1,T=s.rm?0:t/1000,o=E.inOut(clamp((k-.1)/.7,0,1)),z=clamp((k-.8)/.2,0,1);back(c,0);
    glow(c,PX,RY+10,40*(.5+.5*Math.min(1,k*2)),"#FFE3A0",.5*Math.min(1,k*2));fig(c,"zz_relax",64,178);pot(c,0);
    for(let i=0;i<4;i++){const g=-PI/2+i*PI/2+2*PI*fl*o,r=40-14*o,x=PX+Math.cos(g)*r,y=RY+8+Math.sin(g)*r*.7;
      pc(c,["em_blossom","em_lotus","maple","snow"][i],x,y,{a:1-z,sc:i>1?2:1},"#F2A8C0",4);pc(c,"em_blossom",x,y,{a:z},"#F2A8C0",4)}
    ring(c,{cn:0,rt:0},0)}
  ,
  auto(s,inp){const T=s.T+s.ld,k=s.bt.findIndex(b=>!b.h&&b.t+WIN>T);if(k<0)return;const b=s.bt[k].t-s.ld/2;if(T>=b-.3&&T<b)inp.a=true}
};
}
})();
/* GAME:claypot:END */
/* GAME:analects:BEGIN */
(function(){
/* Phase 42B: What We Remember (Confucius), short. Helper: mPick (taps; keys read here). Idea: the book comes together only from what many remember, and a second pass makes it stick. */
{
const K="confucius_s",XS=[36,76,116,156],YS=[104,156],INK="#3A2418",CL=["#8E3B5A","#2F7470","#A0612E","#4F7E3E","#5A6FA0","#B0555A","#7A6A90","#C2963A"];
const V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
V("analects_bubble",()=>aNoise(.14,{type:"highpass",f:2600,to:4200,q:.6,v:.04,a:.02}));
V("analects_match",()=>{aNoise(.18,{f:1800,to:900,q:1.2,v:.05,a:.03});aTone(AN(19),.7,{v:.05,type:"triangle",at:.08});aTone(AN(24),.6,{v:.03,at:.14})});
V("analects_miss",()=>aNoise(.25,{f:2200,to:600,q:.6,v:.04,a:.02}));
const sp=i=>[XS[i%4],YS[i>>2]];
function pic(c,k,x,y,side,sc){c.save();c.translate(x,y);if(sc)c.scale(sc,sc);if(side>=0){c.beginPath();c.rect(side?0:-36,-15,36,30);c.clip()}
  c.strokeStyle=c.fillStyle=INK;c.lineWidth=1.4;c.lineCap="round";
  const L=(a,b,d,e)=>{c.beginPath();c.moveTo(a,b);c.lineTo(d,e);c.stroke()},A=(a,b,r,f)=>{c.beginPath();c.arc(a,b,r,f?0:3.14,f===1?7:f?3.14:6.28);f===1?c.fill():c.stroke()},
    M=(a,b,l)=>{A(a+l,b-8,3,1);c.beginPath();c.moveTo(a+l*.6,b-4);c.lineTo(a-5,b+11);c.lineTo(a+5,b+11);c.fill()};
  if(k===0){M(-22,0,0);c.strokeRect(-17,0,12,6);L(-15,3,-7,3);M(20,0,0);L(12,1,6,10);L(3,12,10,12);L(3,14,8,14)}
  else if(k===1){c.beginPath();c.moveTo(-32,15);c.quadraticCurveTo(-6,8,-16,-6);c.moveTo(-18,15);c.quadraticCurveTo(4,9,-8,-6);c.stroke();A(-26,-9,7);A(-6,-11,5);M(16,0,0);L(24,-12,24,12);A(9,3,2.5,1)}
  else if(k===2){M(-18,0,3);A(-4,3,4,2);L(-12,1,-8,4);M(18,0,-3);L(11,1,5,4)}
  else{M(-16,0,0);L(-8,0,-8,13);L(-8,0,-5,-1);M(18,2,-5)}
  c.restore()}
function bub(c,x,y,h,a){c.save();c.globalAlpha=a;c.fillStyle="#EFE0B8";c.strokeStyle=INK;c.lineWidth=1;c.fillRect(x-18,y-15,36,30);c.strokeRect(x-17.5,y-14.5,35,29);c.restore();pic(c,h>>1,x+(h&1?-18:18),y,h&1,0)}
function pair(c,x,y,sc,a,b){c.save();c.translate(x,y);c.scale(sc,sc);bub(c,-18,0,a,1);bub(c,18,0,b,1);c.restore()}
function stu(c,j,x,y,p){mShadow(c,x,y+10,13,.3);const n=p==="stand"?24:p==="bow"?21:20;
  if(mPerson(c,K,"stu"+j+"_"+p,x,y+10,{ax:.55,ay:1}))return;c.fillStyle=CL[j];c.fillRect(x-5,y+10-n*.55,10,n*.55);c.fillStyle="#E8C79C";c.fillRect(x-3,y+10-n+(p==="bow"?3:0),6,6)}
function back(c,rm){if(mBg(c,K,0))gradeN(c,"dawn",.2);else{const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#EAD9B2");g.addColorStop(1,"#B9A47C");c.fillStyle=g;c.fillRect(0,0,192,320);c.fillStyle="#CDB88E";c.fillRect(4,90,154,132)}}
function tbl(c){if(!mPiece(c,K,"table",96,214,{ax:.5,ay:.5})){c.fillStyle="#6B4A30";c.fillRect(80,205,32,18)}}
function slip(c,x,y,r,lv){glow(c,x+r*14,y-14,10+8*lv,"#FFE9A8",.15+.5*lv);if(mPiece(c,K,"slip",x,y,{ax:.5,ay:1,rot:r}))return;c.save();c.translate(x,y);c.rotate(r);c.fillStyle="#D8BE80";c.fillRect(-1.75,-28,3.5,28);c.restore()}
function bundle(c,x,y,sc){if(!mPiece(c,K,"bundle",x,y,{ax:.5,ay:.5,sc})){c.fillStyle="#C9A867";c.fillRect(x-12*sc,y-7*sc,24*sc,14*sc)}}
function tap(s,i){const j=s.who[i];if(s.bu.some(b=>b.seat===i))return;const b={seat:i,j,t:0,d:s.rd?1:1.6},p=s.pend;s.bu.push(b);sfx("analects_bubble");
  if(!p){s.pend=b;return}
  const ha=s.h[p.j],hb=s.h[j];s.pend=null;
  if(ha>>1===hb>>1){const q=s.sl[ha>>1]||(s.sl[ha>>1]={pv:0,lv:0,ar:0});q.pv=q.lv;q.lv=s.rd?1:.45;q.ar=1.35;s.n++;s.fd[ha>>1]=1;
    s.jn.push({a:ha,b:hb,pa:bp(p),pb:bp(b),t:0});s.bu=s.bu.filter(x=>x!==p&&x!==b);s.K.items[p.seat].off=s.K.items[i].off=true;sfx("analects_match")}
  else{s.miss++;if(s.rd)s.miss2++;for(const x of[p,b])x.d=Math.min(x.d,x.t+1);sfx("analects_miss")}}
const bp=b=>{const q=sp(b.seat);return[q[0],q[1]-32]};
MINI.analects={who:"confucius",land:"l3",title:"What We Remember",short:true,art:K,stages:["What We Remember"],
  setup:["I wrote very little. My students wrote down what they remembered.","Each of them kept a piece. Help them put the pieces together."],
  how:"Tap two students. If their memories fit, they become one saying.",win:"Learn something, then go over it again. Isn’t that a quiet joy?",
  walk:"Go on. What you learned will come back when you need it.",lines:[null],pad:true,ab:true,bloomT:2,limit:90,
  fl:["The book was gathered.","You remembered most of what you heard.","The second time through, you knew it by heart."],
  flNext:["Remember who said what.","The review is easier if you watched closely the first time."],
  rate(s){const m=s.miss||0,m2=s.miss2||0;return m<=5&&m2<=1?3:m<=9?2:1},
  shotReady(s){return s.n>=2&&!!s.pend},
  init(s){const sf=a=>{for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]]}return a};
    Object.assign(s,{st:0,stT:0,rd:0,miss:0,miss2:0,n:0,sel:0,kb:false,q:[0,0,0,0],ph:0,sh:0,bu:[],jn:[],sl:[],fd:[],pend:null,fin:-1,old:null,aT:0,h:sf([0,1,2,3,4,5,6,7]),who:[0,1,2,3,4,5,6,7],
      K:mPick({items:[0,1,2,3,4,5,6,7].map(i=>{const q=sp(i);return{x:q[0]-14,y:q[1]-16,w:28,h:32}})})})},
  step(s,dt,inp){s.stT+=dt;const K_=s.K;
    for(const b of s.bu)b.t+=dt;s.bu=s.bu.filter(b=>b.t<b.d+.1);if(s.pend&&!s.bu.includes(s.pend))s.pend=null;
    for(const q of s.sl)if(q&&q.ar>0)q.ar-=dt;
    for(const j of s.jn)j.t+=dt;s.jn=s.jn.filter(j=>j.t<1.35);
    if(s.ph===1){s.sh+=dt;if(s.sh>=1.7){s.ph=0;s.rd=1;s.n=0;s.fd=[];s.old=null;K_.items.forEach(it=>it.off=false);s.aT=s.t+.5}return null}
    if(s.fin>=0){s.fin+=dt;return s.fin>.45?"win":null}
    const pd=[inp.dx<-.5,inp.dx>.5,inp.dy<-.5,inp.dy>.5],e=pd.map((v,i)=>v&&!s.q[i]);s.q=pd;
    const l=inp.lTap||e[0],r=inp.rTap||e[1],u=inp.uTap||e[2],d=inp.dTap||e[3];
    if(l||r||u||d){s.kb=true;let c=K_.sel%4,w=K_.sel>>2;if(l)c=(c+3)%4;if(r)c=(c+1)%4;if(u||d)w^=1;K_.sel=w*4+c}
    const i=K_.step(dt,{taps:inp.taps,aTap:inp.aTap});if(i>=0){if(inp.aTap)s.kb=true;tap(s,i)}
    if(s.n===4&&!s.jn.length){if(s.rd){s.fin=0}else{s.ph=1;s.sh=0;s.bu=[];s.pend=null;s.old=s.who.slice();let w;do{w=s.who.slice().sort(()=>Math.random()-.5)}while(w.some((v,k)=>v===s.old[k]));s.who=w}}
    return null},
  draw(s,c,t){back(c);tbl(c);const ps=s.sl.map((q,k)=>[q,k]).filter(([q])=>q&&(q.ar<=0||q.pv>0));
    ps.forEach(([q,k])=>{const lv=q.ar>0?q.pv:q.lv;slip(c,96+(k-1.5)*5,207,(k-1.5)*.12,lv+(q.ar<=0&&q.ar>-.5?(.5+q.ar)*1:0))});bundle(c,96,210,1);
    const P=[];for(let j=0;j<8;j++){const a=sp(s.old?s.old.indexOf(j):s.who.indexOf(j)),b=sp(s.who.indexOf(j)),u=s.old?E.inOut(clamp((s.sh-.4)/1,0,1)):1;
      P.push([j,lerp(a[0],b[0],u),lerp(a[1],b[1],u)])}
    P.sort((p,q)=>p[2]-q[2]);const mv=s.ph===1&&s.sh<1.45;
    for(const[j,x,y]of P)stu(c,j,x,y,mv?"stand":!s.ph&&s.K.items[s.who.indexOf(j)].off?"bow":"sit");
    if(s.kb&&!s.ph){const q=sp(s.K.sel);c.save();c.strokeStyle="#F5C66A";c.lineWidth=1.5;c.beginPath();c.ellipse(q[0],q[1],16,18,0,0,7);c.stroke();c.restore()}
    for(const b of s.bu){const q=bp(b),a=Math.min(1,(b.d+.1-b.t)/.1),y0=sp(b.seat)[1];c.save();c.fillStyle="#EFE0B8";c.globalAlpha=a;c.beginPath();c.arc(q[0],y0-17,1.5,0,7);c.arc(q[0],y0-21,2.2,0,7);c.fill();c.restore();bub(c,q[0],q[1],s.h[b.j],a)}
    for(const j of s.jn){const mx=(j.pa[0]+j.pb[0])/2,my=(j.pa[1]+j.pb[1])/2,lo=j.a&1?j.b:j.a,hi=j.a&1?j.a:j.b,la=j.a&1?j.pb:j.pa,ha=j.a&1?j.pa:j.pb;
      if(j.t<.55){const u=E.inOut(Math.min(1,j.t/.35)),x1=lerp(la[0],mx-18,u),y1=lerp(la[1],my,u),x2=lerp(ha[0],mx+18,u),y2=lerp(ha[1],my,u);bub(c,x1,y1,lo,1);bub(c,x2,y2,hi,1);if(j.t>.3)glow(c,mx,my,48,"#FFE9A8",Math.min(.6,(j.t-.3)*3))}
      else{const u=E.inOut(Math.min(1,(j.t-.55)/.8));glow(c,lerp(mx,96,u),lerp(my,200,u),40*(1-.6*u),"#FFE9A8",.5);pair(c,lerp(mx,96,u),lerp(my,200,u),1-.75*u,lo,hi)}}},
  bloom(s,c,k,t){const fl=s._fl||MINI.analects.rate(s),L=[0,.35,.65,1][fl],sx=-40+280*clamp((k-.1)/.55,0,1),r=E.inOut(clamp((k-.5)/.35,0,1));
    back(c);tbl(c);
    for(let q=0;q<4;q++){const x=24+48*q;glow(c,x,96,34,"#FFE9A8",sx>=x-40?L*(.5+.5*Math.max(0,1-Math.abs(sx-x)/40)):0);pair(c,x,96,.5,2*q,2*q+1)}
    for(let i=0;i<8;i++){const x=lerp(96+(i-3.5)*7,96+(i-3.5)*1.2,r),a=1-r*.8;c.save();c.globalAlpha=a;slip(c,x,190,0,0);c.restore()}
    if(k>.3){const w=Math.min(1,(k-.3)/.2)*(30-26*r);c.save();c.strokeStyle="#7A3E2A";c.lineWidth=1.5;for(const y of[172,184]){c.beginPath();c.moveTo(96-w,y);c.lineTo(96+w,y);c.stroke()}c.restore()}
    if(r>.4){c.save();c.globalAlpha=Math.min(1,(r-.4)/.5);bundle(c,96,176,1.6);glow(c,96,176,34,"#FFE9A8",.2+.1*fl);c.restore()}
    for(let j=0;j<14;j++){const x=(j*53)%200-4+Math.sin(k*9+j)*8,y=((k*260+j*37)%300)-10;if(!mPiece(c,K,"petal",x,y,{ax:.5,ay:.5,rot:k*5+j})){c.fillStyle="#F2C9D0";c.fillRect(x,y,3,2)}}},
  auto(s,inp){if(s.ph||s.fin>=0||s.n>3||s.t<s.aT)return;const seat=h=>s.who.indexOf(s.h.indexOf(h)),tp=i=>{const q=sp(i);inp.tap={x:q[0],y:q[1]};inp.taps=[inp.tap]};
    if(s.pend){tp(seat(s.h[s.pend.j]^1));s.aT=s.t+2.7}else{let k=0;while(s.fd[k])k++;tp(seat(2*k));s.aT=s.t+.8}}
};
}
})();
/* GAME:analects:END */
/* GAME:zither:BEGIN */
(function(){
/* Phase 42B: Play in Harmony (Confucius), short. Helper: mLanes. Idea: music is best when you listen first and fit your notes into the others' rests. */
{
const K="confucius_s",XS=[56,96,136],HY=190,SP=60,BT=60/84,PH=8*BT,T0=2.5,TE=T0+6*PH,WN=.18,LN=[[32,30],[74,30],[117,30],[159,30]];
const FL=[[0,0],[2,0],[4,1],[6,0]],CH=[[1,2],[3,2],[5,1],[7,2]],MY=[[1,1],[3,1],[4,2],[5,0],[7,1]];
const V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
V("zither_pluck",(i,m)=>aTone(AN([-5,0,4][i]||0),m?.15:.8,{type:"triangle",v:m?.014:.07,lp:m?420:2600}));
V("zither_flute",()=>{aTone(AN(14),.55,{v:.04,a:.07,lp:2400});aNoise(.25,{f:3200,q:2,v:.008,a:.06})});
V("zither_stone",()=>{aTone(AN(7),.6,{type:"triangle",v:.05,lp:3200});aTone(AN(19),.3,{v:.012})});
V("zither_clash",()=>{aNoise(.28,{f:320,to:190,q:2,v:.07,a:.02});aTone(AN(-10),.2,{type:"sawtooth",v:.025,lp:300})});
const ink="#100B15";
function back(c){if(mBg(c,K,0))gradeN(c,"dusk",.4);else{const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#2B2140");g.addColorStop(1,"#6B4A44");c.fillStyle=g;c.fillRect(0,0,192,320);c.fillStyle="#4A3A44";c.fillRect(4,90,154,132)}}
function lant(c,a){LN.forEach((p,i)=>glow(c,p[0],p[1],a[i]>0?14+16*a[i]:16,"#FFC870",a[i]>0?.2+.5*a[i]:.3))}
function ppl(c,n,x,y,col){mShadow(c,x,y,13,.3);if(mPerson(c,K,n,x,y,{ax:.47,ay:1}))return;c.fillStyle=col;c.fillRect(x-5,y-12,10,12);c.fillStyle="#E8C79C";c.fillRect(x-3,y-18,6,6)}
function zith(c){if(!mPiece(c,K,"zither",96,206,{ax:.5,ay:.5})){c.fillStyle="#5A3024";c.fillRect(48,194,96,24);c.fillStyle="#E8DCC0";for(let i=0;i<3;i++)c.fillRect(52,200+i*7,88,1)}}
function cast(s,c,fr){ppl(c,"flute_"+(s.fT>0?1:0),24,160,"#2F7470");if(!mPiece(c,K,"flute",31,149,{ax:.5,ay:.5,rot:-.35})){c.fillStyle="#8AA060";c.fillRect(27,148,14,1.5)}
  ppl(c,s.cT>0?"chime_down":"chime_up",168,160,"#A0612E");if(!mPiece(c,K,"chime",154,142,{ax:.5,ay:0})){c.fillStyle="#6FB59A";c.fillRect(150,142,8,10)}
  ppl(c,fr,96,200,"#C2963A");zith(c)}
function note(c,o,x,y,a,sh){c.save();c.globalAlpha=a;c.strokeStyle=ink;c.lineWidth=1;if(sh){c.strokeStyle="#fff";c.lineWidth=1.5}
  if(o.w){c.fillStyle="#D9A93A";c.fillRect(x-4.5,y-4.5,9,9);c.strokeRect(x-4.5,y-4.5,9,9);c.fillStyle="#F2D690";c.fillRect(x-2.5,y-2.5,3,3)}
  else{c.fillStyle="#5FBF98";c.beginPath();c.arc(x,y,4.5,0,7);c.fill();c.stroke();c.fillStyle="#BFF0D8";c.fillRect(x-2,y-2,2,2)}c.restore()}
const ph=s=>Math.floor((s.L.t-T0+BT/2)/PH);
MINI.zither={who:"confucius",land:"l3",title:"Play in Harmony",short:true,art:K,stages:["Play in Harmony"],
  setup:["When someone sang well, I’d ask them to sing it again, and then join in.","Listen first. Then find where your notes belong."],
  how:"Tap a lane when your note reaches the line. Leave the others’ notes alone.",win:"Three players and one song. That’s harmony, not a solo.",
  walk:"Music takes practice. Come back and play with us again.",lines:[null],pad:true,ab:false,bloomT:2,limit:60,
  fl:["The song was played.","You found most of your notes in the rests.","You listened first and played only in harmony."],
  flNext:["Play only where the others rest.","Listen to the whole first phrase before you join."],
  rate(s){const h=s.harm||0,b=(s.clash||0)+(s.solo||0);return h>=22&&b<=2&&!s.early?3:h>=17&&b<=6?2:1},
  shotReady(s){return s.harm>=3},
  init(s){const L=mLanes({xs:XS,hitY:HY,speed:SP,win:WN,keys:["l","d","r"]});s.ot=[];
    for(let p=0;p<6;p++){for(const[b,l]of FL)s.ot.push({lane:l,t:T0+p*PH+b*BT,w:0});for(const[b,l]of CH)s.ot.push({lane:l,t:T0+p*PH+b*BT,w:1});
      if(p)for(const[b,l]of MY)L.add(l,T0+p*PH+b*BT,2).p=p}
    Object.assign(s,{st:0,stT:0,L,harm:0,clash:0,solo:0,early:0,fx:[],wv:null,shv:0,shN:[],fT:0,cT:0,pT:0,q:[0,0,0],end:-1,sh:0})},
  step(s,dt,inp){s.stT+=dt;const L=s.L,dx=inp.dx||0,dy=inp.dy||0,ax=Math.abs(dx),ay=Math.abs(dy),pd=[dx<-.5&&ax>=ay,dy>.5&&ay>ax,dx>.5&&ax>=ay];
    const ed=[inp.lTap||(pd[0]&&!s.q[0]),inp.dTap||(pd[1]&&!s.q[1]),inp.rTap||(pd[2]&&!s.q[2])];s.q=pd;
    for(const k of["fT","cT","pT","shv"])s[k]=Math.max(0,s[k]-dt);for(const f of s.fx)f.t+=dt;s.fx=s.fx.filter(f=>f.t<.7);if(s.wv){s.wv.t+=dt;if(s.wv.t>.7)s.wv=null}
    const r=L.step(dt,{lTap:ed[0],dTap:ed[1],rTap:ed[2],taps:(inp.taps||[]).filter(p=>p.y<250)});
    for(const o of s.ot)if(!o.done&&L.t>=o.t){o.done=1;o.f=.3;if(o.w){s.cT=.2;sfx("zither_stone")}else{s.fT=.2;sfx("zither_flute")}}
    for(const o of s.ot)if(o.f>0)o.f-=dt;
    if(L.t>=TE){if(s.end<0){s.end=0;sfx("zither_pluck",1);sfx("zither_flute");sfx("zither_stone");s.pT=.3;for(const x of XS)s.fx.push({t:0,x,y:HY,x2:x,y2:HY})}s.end+=dt;return s.end>1.2?"win":null}
    for(const h of r.hits){const ln=h.lane,x=XS[ln];let n=null,bd=9;for(const o of s.ot){const d=Math.abs(o.t-L.t);if(d<bd){bd=d;n=o}}
      s.harm++;s.pT=.18;s.wv={k:"h",t:0,l:ln};s.fx.push({t:0,x,y:HY,x2:XS[n.lane],y2:HY-(n.t-L.t)*SP});sfx("zither_pluck",ln)}
    for(const ln of r.wrong){if(ln<0)continue;s.pT=.18;
      if(L.t<T0+PH-BT/2){s.early++;s.fx.push({t:.35,x:XS[ln],y:HY,m:1});sfx("zither_pluck",ln,1)}
      else if(s.ot.some(o=>o.lane===ln&&Math.abs(o.t-L.t)<=WN)){s.clash++;s.wv={k:"c",t:0,l:ln};sfx("zither_clash")}
      else{s.solo++;s.wv={k:"s",t:0,l:ln};s.shv=.5;s.shN=[0,1].map(w=>s.ot.find(o=>o.w===w&&o.t>L.t));sfx("zither_pluck",ln)}}
    return null},
  draw(s,c,t){const L=s.L,P=ph(s);back(c);lant(c,[0,0,0,0]);
    XS.forEach(x=>{c.fillStyle="rgba(16,11,21,.35)";c.fillRect(x-18,40,36,150);c.strokeStyle="rgba(255,233,184,.25)";c.strokeRect(x-17.5,40.5,35,149);mText(c,["←","↓","→"][XS.indexOf(x)],x,236,10,"rgba(255,233,184,.7)")});
    for(const o of s.ot){const y=HY-(o.t-L.t)*SP;if(y>=34&&y<=HY+4&&!o.done){const sh=s.shv>0&&s.shN.includes(o);note(c,o,XS[o.lane]+(sh&&!s.rm?Math.sin(t/20)*1.4:0),y,Math.min(1,(y-34)/10),sh&&s.rm)}
      if(o.f>0)ring(c,XS[o.lane],HY,5+10*(.3-o.f)/.3*3,1,"rgba"+(o.w?"(217,169,58,":"(95,191,152,")+o.f/.3+")",1.5)}
    for(const n of L.notes){const a=n.p<=2?1:n.p===3?.2:0;if(!(a>0)||n.hit||n.miss)continue;const y=L.yOf(n);if(y<34||y>HY+4)continue;c.save();c.globalAlpha=a*Math.min(1,(y-34)/10);c.strokeStyle="#F5C66A";c.lineWidth=1.5;c.beginPath();c.moveTo(XS[n.lane],y-6);c.lineTo(XS[n.lane]+6,y);c.lineTo(XS[n.lane],y+6);c.lineTo(XS[n.lane]-6,y);c.closePath();c.stroke();c.restore()}
    c.fillStyle="#100B15";c.fillRect(38,HY-1,116,3);c.fillStyle="#D9A93A";c.fillRect(38,HY,116,1.5);
    cast(s,c,P<1?"wz_sit":s.pT>0?"wz_pluck":"wz_up");
    for(const f of s.fx){if(f.m){ring(c,f.x,f.y,6+8*(.7-f.t)/.35,1,"rgba(160,160,170,.6)",1);continue}const k=f.t/.7;ring(c,f.x,f.y,6+8*k,1,"rgba(245,198,106,"+(1-k)+")",1.5);c.save();c.strokeStyle="rgba(245,198,106,"+(1-k)*.8+")";c.lineWidth=1;c.beginPath();c.moveTo(f.x,f.y);c.lineTo(f.x2,f.y2);c.stroke();c.restore()}
    if(s.wv){const w=s.wv,a=1-w.t/.7;for(let i=0;i<3;i++){if(w.k==="h")wave(c,52,200+i*7,88,3*a,2,w.t*18,0,"rgba(245,198,106,"+a+")",1.5);else if(w.k==="c")wave(c,52,200+i*7,88,2.5*a,5,w.t*30,3,"rgba(150,150,158,"+a+")",1.2);else if(i===w.l)wave(c,52,200+i*7,88,2*a,3,w.t*20,0,"rgba(255,255,255,"+a+")",.7)}}
    for(let i=0;i<6;i++){c.fillStyle=i===P?"#F5C66A":"rgba(255,233,184,.35)";c.fillRect(66+i*12,12,i===P?6:4,i===P?6:4)}
    if(P<1)mText(c,"Listen",96,26,9,"#FFE9B8");else if(P<3)mText(c,"Join",96,26,9,"#F5C66A")},
  bloom(s,c,k,t){const fl=s._fl||MINI.zither.rate(s),u=E.inOut(clamp(k/.8,0,1));back(c);lant(c,LN.map((p,i)=>clamp((k-.2-i*.15)/.15,0,1)*(.5+.25*fl)));
    cast(s,c,"wz_pluck");for(let i=0;i<3;i++)wave(c,28,120+(i-1)*16*(1-u),136,7+i,2,i*2.1*(1-u)+k*6,0,i===1?"#FFE9A8":"#F5C66A",1.6);
    glow(c,96,120,70,"#F5C66A",.1+.25*u)},
  auto(s,inp){for(const n of s.L.notes){if(n.hit||n.miss)continue;const e=n.t-s.L.t;if(e<=.02&&e>-.1){if(n.lane===0)inp.lTap=true;else if(n.lane===1)inp.dTap=true;else inp.rTap=true}}}
};
}
})();
/* GAME:zither:END */
/* GAME:sitting:BEGIN */
(function(){
{
/* Just Sitting (Dogen, "A Meditation Cushion"). Helper: mHold (the incense is its dwell meter). Art key dogen_s. */
const K="dogen_s",SIT=45,AT=[4,8,13,17,22,27,31,36,40],KD="swfcswfsw",PI=Math.PI;
const V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
V("sitting_ember",()=>aNoise(.07,{type:"highpass",f:4200,q:.7,v:.014,a:.01}));
V("sitting_chase",()=>{aNoise(.14,{f:2800,to:1500,q:1.5,v:.035,a:.01});aTone(AN(16),.1,{v:.012,to:AN(21)})});
V("sitting_settle",()=>aTone(AN(2),.9,{v:.04,a:.05,lp:1400}));
V("sitting_bell",()=>{aTone(660,2.4,{v:.07,a:.004});aTone(1580,1.2,{v:.02,a:.004})});
const pp=(c,n,x,y,o)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];return r&&v&&mPerson(c,K,n,x,y,Object.assign({ax:v[0]/r[2],ay:v[1]/r[3]},o))};
const back=c=>{if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,170);g.addColorStop(0,"#C9A7A0");g.addColorStop(1,"#E8D3B0");c.fillStyle=g;c.fillRect(0,0,192,170);
  c.fillStyle="#7A5A44";c.fillRect(0,148,192,3);c.fillRect(0,166,192,4);c.fillStyle="#5A4030";c.fillRect(0,170,192,150)}};
function inc(c,k,on,t,rm){const L=Math.max(1.5,11*(1-k)),ty=199-L;c.save();c.beginPath();c.rect(110,198.5,44,30);c.clip();
  if(!mPiece(c,K,"incense",132,198,{ax:.5,ay:.5})){c.fillStyle="#2A2030";c.beginPath();c.ellipse(132,203,9,5,0,0,7);c.fill()}c.restore();
  if(k<1){c.fillStyle="#6A4A3A";c.fillRect(131.5,ty,1,L);const e=on?.85+(rm?0:.15*Math.sin(t/90)):.25;glow(c,132,ty,on?8:4,"#FF8A3A",e);c.fillStyle=on?"#FFD27A":"#B0583A";c.fillRect(131.5,ty-.5,1,1);
    c.strokeStyle="rgba(235,230,240,"+(on?.5:.18)+")";c.lineWidth=.7;c.beginPath();for(let i=0;i<=16;i++){const x=132+(rm?0:Math.sin(i*.5+t/500)*1.6*i/16),y=ty-i*2;i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke()}}
function wand(c,s,t,f,fl){if(!pp(c,f,96,199,{flip:fl})){c.fillStyle="#2F6A64";c.fillRect(88,186,16,13);c.fillStyle="#C9A27A";c.beginPath();c.arc(96,182,4.5,0,7);c.fill()}}
function seat(c,s,t,f,fl){mShadow(c,96,204,26,.3);if(!mPiece(c,K,"cushion",96,196,{ax:.5,ay:.5})){c.fillStyle="#17121C";c.beginPath();c.ellipse(96,197,11,7,0,0,7);c.fill()}wand(c,s,t,f,fl)}
function chime(c,rm,t,a){const w=rm?0:Math.sin(t/260)*.14;c.save();c.globalAlpha=a;c.strokeStyle="#6A5A40";c.lineWidth=.6;c.beginPath();c.moveTo(142,130);c.lineTo(142,146);c.stroke();
  if(!mPiece(c,K,"chime",142,146,{ax:.5,ay:0,rot:w})){c.fillStyle="#B07A3A";c.fillRect(139,146,6,12)}
  if(!rm&&a>.5){c.strokeStyle="#FFE9B8";c.globalAlpha=a*.4;c.beginPath();c.arc(142,154,5+(t/90)%6,.3,PI-.3);c.stroke()}c.restore()}
function icon(c,i,x,y){c.strokeStyle="#2A2036";c.lineWidth=.9;c.beginPath();if(i===0){c.arc(x,y-1,3,0,PI);c.moveTo(x-3,y-1);c.lineTo(x+3,y-1)}else if(i===1){c.rect(x-3,y-2,6,4);c.moveTo(x-3,y-2);c.lineTo(x,y+.5);c.lineTo(x+3,y-2)}else{c.arc(x,y,3,0,7);c.rect(x-.7,y-.7,1.4,1.4)}c.stroke()}
function vdraw(c,s,v,t){const a=v.al;if(!(a>0))return;const x=v.x,y=v.y,w=s.rm?0:t/1000;c.save();c.globalAlpha=a;
  if(v.k==="s"){glow(c,x,y-3,9,"#FFE3A0",.2);const fl=v.vx<0||(v.st===0&&Math.cos(v.a+v.t*.55)>0),r=v.st===2?mPiece(c,K,"sparrow_sit",x,y,{ax:.5,ay:1,flip:fl}):mPiece(c,K,"sparrow_fly",x,y,{ax:.5,ay:.5,flip:fl});
    if(!r){c.fillStyle="#8A6A48";c.beginPath();c.ellipse(x,y-2,5,3.5,0,0,7);c.fill()}}
  else if(v.k==="w"){glow(c,x,y,14,"#EEF0FF",.45);c.fillStyle="rgba(240,240,252,.62)";c.beginPath();c.arc(x,y,6.5+Math.sin(w*3+v.a),0,7);c.fill();icon(c,v.ic,x,y)}
  else if(v.k==="f"){glow(c,x,y,9,"#FFD66E",.55+(s.rm?0:.3*Math.sin(w*7+v.a)));c.fillStyle="#FFF4C0";c.fillRect(x-.5,y-.5,1.5,1.5);
    if(v.fast)for(let i=1;i<4;i++)glow(c,x-v.vx*i*.02,y-v.vy*i*.02,5,"#FFD66E",.3/i)}
  else{glow(c,x,y,8,"#FFB46A",.2);if(!mPiece(c,K,"maple",x,y,{ax:.5,ay:.5,rot:s.rm?0:w*2+v.a})){c.fillStyle="#C0501E";c.fillRect(x-2,y-2,4,4)}}
  c.restore()}
function mkv(n){return {k:KD[n],n,a:n*2.1%6.28,x:96,y:184,st:0,t:0,al:0,ic:n%3,vx:0,vy:0,fast:0}}
function spot(v){return v.k==="s"?[v.n===4?68:124,150]:v.k==="f"?[v.n===2?104:90,191]:v.k==="c"?[120,210]:[v.x,v.y]}
function vstep(s,v,dt){v.t+=dt;
  if(v.st===0){v.al=Math.min(1,v.t/.6);const q=v.a+v.t*.55;v.x=96+34*Math.cos(q);v.y=184+22*Math.sin(q)+(s.rm?0:Math.sin(v.t*2.3)*1.5);if(v.t>=3.5){v.st=1;v.t=0;v.fx=v.x;v.fy=v.y;v.tg=spot(v)}}
  else if(v.st===1){const k=E.out(Math.min(1,v.t/.7));v.x=lerp(v.fx,v.tg[0],k);v.y=lerp(v.fy,v.tg[1],k);if(v.t>=.7){v.st=2;v.t=0;s.settled++;sfx("sitting_settle")}}
  else if(v.st===2){if(v.k==="w")v.al=Math.max(0,1-v.t/2);if(v.t>=2){v.st=3;v.t=0;v.vx=v.k==="s"?(v.x<96?-35:35):v.k==="c"?30:0;v.vy=v.k==="s"?-30:v.k==="f"?-18:-4}}
  else{v.x+=v.vx*dt;v.y+=v.vy*dt;v.al=Math.max(0,v.al-dt*(v.fast?2.2:1))}}
function chase(s,v){v.st=3;v.t=0;v.fast=1;const d=Math.hypot(v.x-96,v.y-186)||1,sp=v.k==="f"?160:v.k==="w"?0:105;v.vx=(v.x-96)/d*sp;v.vy=(v.y-186)/d*sp-20;
  if(v.k==="w"){v.al=0;for(let i=0;i<8;i++)pAdd(s.P,{x:v.x,y:v.y,vx:(Math.random()-.5)*70,vy:(Math.random()-.5)*70,drag:.92,life:.6,col:"#E8E6F4",s:1.5})}
  s.chase++;s.turn=.9;s.tx=v.x;sfx("sitting_chase")}
const hit=(v,p)=>Math.abs(p.x-v.x)<=14&&Math.abs(p.y-v.y)<=14||v.k==="c"&&Math.abs(p.x-142)<=14&&Math.abs(p.y-153)<=14;
MINI.sitting={who:"dogen",land:"l3",title:"Just Sitting",short:true,art:K,stages:["Just Sitting"],
  setup:["Sit down. There’s nothing to get and nowhere to go.","Things will pass by. Let them."],
  how:"Hold to sit. If you chase something, just sit again.",
  win:"The incense burned down. You were here the whole time.",
  walk:"Sitting doesn’t have to be perfect. Come back and sit again.",
  lines:[null],pad:true,ab:true,bloomT:2,limit:90,
  fl:["The incense burned down.","You let almost everything pass.","You just sat, and everything came and went by itself."],
  flNext:["Let things come to you.","Stay on the cushion the whole time."],
  rate:s=>s.chase===0&&s.up<3?3:s.chase<=1?2:1,
  shotReady:s=>s.sit>12&&s.vis.some(v=>v.st<3),
  init(s){Object.assign(s,{st:0,stT:0,T:0,sit:0,chase:0,settled:0,up:0,began:false,on:false,vis:[],nx:0,turn:0,tx:96,em:0,pd:false,bb:0,P:pfx(),H:mHold({dur:SIT})})},
  step(s,dt,inp){s.T+=dt;s.stT+=dt;const on=!!(inp.a||(inp.down&&inp.down.y>=120&&inp.down.y<=250));
    if(on&&!s.on){s.began=true;s.em=0;sfx("sitting_ember")}s.on=on;if(s.began&&!on)s.up+=dt;
    const k0=s.H.k,ev=s.H.step(dt,inp,on);if(ev==="release")s.H.k=k0; /* a lift pauses the incense; it keeps its place */
    s.sit=s.H.k*SIT;if(on&&(s.em+=dt)>4.5){s.em=0;sfx("sitting_ember")}
    while(s.nx<9&&s.sit>=AT[s.nx])s.vis.push(mkv(s.nx++));
    for(const p of inp.taps||[]){const v=s.vis.find(v=>v.st<3&&hit(v,p));if(v)chase(s,v)}
    const pd=!!(inp.dx||inp.dy||inp.lTap||inp.rTap||inp.uTap||inp.dTap);
    if((pd&&!s.pd)||inp.bTap){let b=null,bd=1e9;for(const v of s.vis)if(v.st<3){const d=Math.hypot(v.x-96,v.y-186);if(d<bd){bd=d;b=v}}if(b)chase(s,b)}
    s.pd=pd;s.vis.forEach(v=>vstep(s,v,dt));s.vis=s.vis.filter(v=>v.st<3||v.al>0);s.turn=Math.max(0,s.turn-dt);pStep(s.P,dt,s.rm);
    return ev==="full"?"win":null},
  draw(s,c,t){back(c);if(s.vis.some(v=>v.k==="c"&&v.st<3))chime(c,s.rm,t,1);inc(c,s.H.k,s.on,t,s.rm);
    if(s.on)glow(c,96,186,34,"#FFD9A0",.12);else{c.save();c.strokeStyle="#F5C66A";c.globalAlpha=.25+(s.rm?0:.15*Math.sin(t/400));c.lineWidth=1;c.beginPath();c.ellipse(96,198,17,10,0,0,7);c.stroke();c.restore()}
    const tn=s.turn>0;seat(c,s,t,tn?"wm_turn":(!s.rm&&Math.floor(t/2200)%2?"wm_breath":"wm_still"),tn&&s.tx<96);
    for(const v of s.vis)vdraw(c,s,v,t);pDraw(c,s.P,K)},
  bloom(s,c,k,t){const f=s._fl||1,a=E.out(Math.min(1,k*2.5));back(c);if(k>.02&&!s.bb){s.bb=1;sfx("sitting_bell")}
    inc(c,1,false,t,s.rm);c.fillStyle="rgba(150,140,150,.7)";for(let i=0;i<4;i++){const q=clamp(k*2.2-i*.15,0,1);if(q>0&&q<1)c.fillRect(131+i*.7,193+q*5,1,1)}
    c.save();c.strokeStyle="rgba(240,236,244,"+.55*Math.min(1,k*3)+")";c.lineWidth=.8;c.beginPath();c.moveTo(132,198);c.lineTo(132,198-170*E.out(k));c.stroke();c.restore();
    seat(c,s,t,"wm_still",false);c.save();c.globalAlpha=a;
    vdraw(c,s,{k:"s",st:2,al:1,x:124,y:150,vx:0,a:0,t:0},t);if(f>1)vdraw(c,s,{k:"f",al:1,x:104,y:191,a:1,vx:0,vy:0},t);if(f>2)vdraw(c,s,{k:"c",al:1,x:120,y:210,a:2,t:0},t);c.restore();
    glow(c,96,186,60,"#FFD9A0",.12*k);gradeN(c,"warm",.14*k)},
  auto(s,inp){inp.a=true}
};
}
})();
/* GAME:sitting:END */
/* GAME:sandal:BEGIN */
(function(){
{
/* Each Step (Dogen, "A Straw Sandal"). Helper: none (a step and a settle timer). Art key dogen_s. */
const K="dogen_s",MOVE=.35,SETL=.7,FOG=1.5,GATE=14,PI=Math.PI;
const PT=[[40,236],[30,196],[58,160],[36,120],[64,84],[96,52],[128,84],[156,120],[134,160],[162,196],[152,236]],ST=[];
{const sg=[];let L=0;for(let i=0;i<10;i++){const d=Math.hypot(PT[i+1][0]-PT[i][0],PT[i+1][1]-PT[i][1]);sg.push(d);L+=d}
 for(let n=0;n<30;n++){let d=n/29*L,i=0;while(i<9&&d>sg[i]){d-=sg[i];i++}const u=d/sg[i];ST.push([PT[i][0]+(PT[i+1][0]-PT[i][0])*u,PT[i][1]+(PT[i+1][1]-PT[i][1])*u])}}
const V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
V("sandal_step",()=>aNoise(.09,{f:1800,to:900,q:.8,v:.03,a:.01}));
V("sandal_settle",()=>aTone(AN(-10),.9,{v:.05,a:.03,lp:900}));
V("sandal_fog",()=>aNoise(.7,{f:260,to:520,q:.6,v:.05,a:.25}));
V("sandal_bell",()=>{aTone(520,2.2,{v:.07,a:.004});aTone(1250,1.1,{v:.02,a:.004})});
const pp=(c,n,x,y,o)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];return r&&v&&mPerson(c,K,n,x,y,Object.assign({ax:v[0]/r[2],ay:v[1]/r[3]},o))};
const back=c=>{if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#7E8CA8");g.addColorStop(.5,"#B8B2A8");g.addColorStop(1,"#6A5A48");c.fillStyle=g;c.fillRect(0,0,192,320)}grade(c,"#ECE8EE",.45)};
const wpos=s=>{const m=s.mv,t=ST[s.i];if(!m)return t;const k=E.inOut(Math.min(1,m.t/MOVE));return[lerp(m.fx,t[0],k),lerp(m.fy,t[1],k)]};
function arrive(s){s.mv=null;const i=s.i;if(i>0&&s.lit[i]===1)sfx("sandal_settle");if(i===GATE){sfx("sandal_bell");s.gb=0}if(i===29)s.fin=0}
function go(s){if(s.i>=29||s.fin>=0)return;const T=s.T,p=wpos(s),hu=T<s.free;if(s.mv)arrive(s);
  const i=++s.i;s.mv={t:0,fx:p[0],fy:p[1]};s.free=T+MOVE+SETL;s.lit[i]=hu?.5:1;s.litT[i]=T+MOVE;sfx("sandal_step");
  if(hu){s.hurry++;for(let j=i+1;j<=Math.min(29,i+3);j++)s.fogU[j]=T+FOG;sfx("sandal_fog")}}
const hid=(s,i)=>s.fogU[i]>s.T&&i>s.i;
function stone(c,s,i){const x=ST[i][0],y=ST[i][1];if(hid(s,i)){glow(c,x,y,13,"#ECE8EE",.8);return}
  if(!mPiece(c,K,"stone",x,y,{ax:.5,ay:.5})){c.fillStyle="#7A7880";c.beginPath();c.ellipse(x,y,6,4,0,0,7);c.fill()}
  const L=s.lit[i],q=clamp((s.T-s.litT[i])/SETL,0,1),r=E.out(q),a=L*r;if(!(a>0))return;
  if(!mPiece(c,K,"stone_lit",x,y,{ax:.5,ay:.5,a})){c.save();c.globalAlpha=a;c.fillStyle="#F5C66A";c.beginPath();c.ellipse(x,y,6,4,0,0,7);c.fill();c.restore()}
  glow(c,x,y,10,L===1?"#FFC860":"#EEF0FF",.35*a);
  if(L===1){c.save();c.globalAlpha=r*.9;c.fillStyle="#FFE9A8";c.beginPath();c.ellipse(x-2,y,1.1,1.8,0,0,7);c.ellipse(x+2,y-.5,1.1,1.8,0,0,7);c.fill();c.restore()}
  if(q<1){c.save();c.strokeStyle=L===1?"#FFD98A":"#F2F2FF";c.globalAlpha=(1-q)*(L===1?.9:.5);c.lineWidth=1;c.beginPath();c.ellipse(x,y,s.rm?10:3+9*q,s.rm?6:2+6*q,0,0,7);c.stroke();c.restore()}}
function ship(c,x,fl){if(!mPiece(c,K,"ship",x,244,{ax:.5,ay:1,flip:fl})){c.fillStyle="#6A4A30";c.fillRect(x-12,232,24,10);c.fillStyle="#E8DCC0";c.fillRect(x-1,214,10,18)}}
function gate(c,s,t){if(!mPiece(c,K,"gate",96,44,{ax:.5,ay:.5})){c.fillStyle="#B0482E";c.fillRect(82,34,28,4);c.fillRect(85,38,3,15);c.fillRect(104,38,3,15)}
  if(s.gb>=0&&s.gb<1.4){const q=s.gb/1.4;glow(c,96,44,28,"#FFE3A0",.5*(1-q));if(!s.rm){c.save();c.strokeStyle="#FFE9B8";c.globalAlpha=1-q;c.lineWidth=1.2;c.beginPath();c.arc(96,44,6+q*34,0,7);c.stroke();c.restore()}}}
function walker(s,c,t){const p=wpos(s),m=s.mv,d=s.i<=GATE?"up":"down";
  mShadow(c,p[0],p[1]+2,12,.3);if(!pp(c,m?`ww_${d}_${Math.floor(m.t/.12)%2}`:"ww_stand",p[0],p[1]+2)){c.fillStyle="#2F6A64";c.fillRect(p[0]-4,p[1]-14,8,15);c.fillStyle="#C9A27A";c.fillRect(p[0]-2.5,p[1]-18,5,5)}}
MINI.sandal={who:"dogen",land:"l3",title:"Each Step",short:true,art:K,stages:["Each Step"],
  setup:["I sailed to China in 1223 and came home in 1227.","The walking was the teaching, one step at a time."],
  how:"Swipe up to step. Let each step land before the next.",
  win:"Every step was the whole journey. Look how they all still glow.",
  walk:"You don’t have to finish the road today. Each step already counts.",
  lines:[null],pad:true,ab:true,bloomT:2.2,limit:90,
  fl:["You walked the whole road.","Almost every step was whole.","Every step was complete."],
  flNext:["Let each stone glow before the next step.","Hurrying only brings the fog."],
  rate:s=>s.hurry===0?3:s.hurry<=3?2:1,
  shotReady:s=>s.i>=17,
  init(s){const lit=Array(30).fill(0),lt=Array(30).fill(9e9);lit[0]=1;lt[0]=-9;
    Object.assign(s,{st:0,stT:0,T:0,i:0,mv:null,lit,litT:lt,fogU:Array(30).fill(-1),hurry:0,free:0,gb:-1,fin:-1,pu:false,sy:null,sd:false,aL:0})},
  step(s,dt,inp){s.T+=dt;s.stT+=dt;if(s.gb>=0)s.gb+=dt;
    const u=inp.dy<-.5||!!inp.uTap,f=inp.down;let st=!!inp.aTap||(u&&!s.pu);s.pu=u;
    if(f){if(s.sy==null)s.sy=f.y;else if(!s.sd&&s.sy-f.y>=18){s.sd=true;st=true}}
    else{if(!s.sd&&inp.swipe==="up")st=true;s.sy=null;s.sd=false}
    if(st)go(s);
    if(s.mv&&(s.mv.t+=dt)>=MOVE)arrive(s);
    if(s.fin>=0){s.fin+=dt;if(s.fin>=1)return"win"}
    return null},
  draw(s,c,t){back(c);let fl=0;for(const q of s.fogU)fl=Math.max(fl,q-s.T);grade(c,"#ECE8EE",.14*clamp(fl/.5,0,1));
    ship(c,24,false);ship(c,168,true);for(let i=0;i<30;i++)stone(c,s,i);gate(c,s,t);
    if(s.fin>=0&&!mPiece(c,K,"sandals",ST[29][0],ST[29][1]-1,{ax:.5,ay:.5,a:Math.min(1,s.fin/.4)})){c.fillStyle="#C8A060";c.fillRect(ST[29][0]-4,ST[29][1]-3,8,3)}
    walker(s,c,t);
    if(s.i===0&&!s.mv){c.save();c.strokeStyle="#FFE9B8";c.globalAlpha=.35+(s.rm?.2:.3*Math.sin(t/300));c.lineWidth=1.2;c.beginPath();c.moveTo(34,222);c.lineTo(40,216);c.lineTo(46,222);c.stroke();c.restore()}},
  bloom(s,c,k,t){const f=s._fl||1,a=.55+.45*Math.pow(Math.sin(PI*(f-.5)*k),2)*1,e=Math.min(1,k*3);back(c);ship(c,24,false);ship(c,168,true);
    for(let i=0;i<30;i++){if(!mPiece(c,K,"stone",ST[i][0],ST[i][1],{ax:.5,ay:.5})){c.fillStyle="#7A7880";c.beginPath();c.ellipse(ST[i][0],ST[i][1],6,4,0,0,7);c.fill()}}
    c.save();c.lineCap="round";c.lineWidth=1.6;for(let i=0;i<29;i++){const L=Math.min(s.lit[i]||0,s.lit[i+1]||0)||.5;c.strokeStyle=L===1?"#FFD98A":"#F2F2FF";c.globalAlpha=a*e*.8;c.beginPath();c.moveTo(ST[i][0],ST[i][1]);c.lineTo(ST[i+1][0],ST[i+1][1]);c.stroke()}c.restore();
    for(let i=0;i<30;i++){const L=s.lit[i]||.5,x=ST[i][0],y=ST[i][1];if(!mPiece(c,K,"stone_lit",x,y,{ax:.5,ay:.5,a:L*e})){c.save();c.globalAlpha=L*e;c.fillStyle="#F5C66A";c.beginPath();c.ellipse(x,y,6,4,0,0,7);c.fill();c.restore()}
      glow(c,x,y,9+6*a,L===1?"#FFC860":"#EEF0FF",.5*a*e)}
    gate(c,{gb:-1},t);glow(c,96,44,22+10*a,"#FFE3A0",.4*a*e);mPiece(c,K,"sandals",ST[29][0],ST[29][1]-1,{ax:.5,ay:.5});gradeN(c,"warm",.12*k)},
  auto(s,inp){if(s.T-s.aL>=1.1){s.aL=s.T;inp.aTap=true}}
};
}
})();
/* GAME:sandal:END */
MINI_LOADED.s3=true;
