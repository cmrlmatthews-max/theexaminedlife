/* The Examined Life: Level IV short games (the Clockwork City). Plan 5. Loaded after l1.js-l4.js (fx.js first, boss.js last).
   Source: work_src/s4/<id>.js, one file per game, assembled by tools/build_mini.py s4. Do not edit the GAME blocks here. */
/* MINI_ART:BEGIN */
/* written by tools/l4p5_mini_art.py (Phase 43A): asset ids, atlas rects, people rects and pivots, traced geometry (<who>_s) */
MINI_ART.aquinas_s={"atlas":"4c4b9c36d21387b192dbd832c511936b","people":"b1ee354f472928fb3e6ec257d3508d4a","rects":{"book_lectern":[1,1,128,128],"desk":[130,1,96,96],"book":[227,1,128,60],"sheet":[356,1,36,40],"scroll":[393,1,31,32],"lantern":[425,1,16,32],"ox":[442,1,40,31],"crumpled":[483,1,28,26],"quill":[512,1,21,24],"dart":[534,1,23,16]},"prects":{"aq_reach":[1,1,19,25],"aq_stand":[21,1,16,23],"aq_write_0":[38,1,21,23],"aq_write_1":[60,1,21,23],"alb_stand":[82,1,16,23],"alb_nod":[99,1,16,22],"cls0_chat_0":[116,1,14,20],"cls0_chat_1":[131,1,19,20],"cls0_watch":[151,1,14,20],"cls1_chat_0":[166,1,14,20],"cls1_chat_1":[181,1,19,20],"cls1_watch":[201,1,14,20],"cls2_chat_0":[216,1,14,20],"cls2_chat_1":[231,1,19,20],"cls2_watch":[251,1,14,20],"cls3_chat_0":[266,1,14,20],"cls3_chat_1":[281,1,19,20],"cls3_watch":[301,1,14,20],"yaq_write_0":[316,1,21,19],"yaq_write_1":[338,1,21,19],"yaq_still":[360,1,16,19]},"pivots":{"aq_stand":[8,23],"aq_reach":[8,25],"aq_write_0":[8,23],"aq_write_1":[8,23],"yaq_write_0":[8,19],"yaq_write_1":[8,19],"yaq_still":[8,19],"cls0_chat_0":[8,20],"cls0_chat_1":[8,20],"cls0_watch":[8,20],"cls1_chat_0":[8,20],"cls1_chat_1":[8,20],"cls1_watch":[8,20],"cls2_chat_0":[8,20],"cls2_chat_1":[12,20],"cls2_watch":[8,20],"cls3_chat_0":[8,20],"cls3_chat_1":[12,20],"cls3_watch":[8,20],"alb_stand":[8,23],"alb_nod":[8,22]},"bg":["7d3731a9dc7afe3d810e27d54fa30b6a"],"geo":{"gaps":[[21,20,30,48],[81,20,30,48],[141,20,30,48]],"gapCenters":[[36,44],[96,44],[156,44]],"windows":[[22,12,28,56],[82,12,28,56],[142,12,28,56]],"wallLamps":[[63,46],[127,46]],"backWall":[0,0,192,92],"benchesLeft":[[4,115,12,55],[4,175,12,55]],"benchesRight":[[176,115,12,55],[176,175,12,55]],"floor":[20,92,152,164],"floorPanel":[48,125,96,100],"darkBandFrom":268,"suggest":{"classmates":[[10,150],[10,206],[182,150],[182,206]],"lectern":[96,196],"aquinas":[96,178],"desk":[96,176],"albert":[128,180]},"note":"the three arches are the painted windows of the back wall; their centers are x 36 / 96 / 156 (brief 44 / 96 / 148), y 44 as briefed. Classmates sit on the painted side benches (x 10 and 182; brief x 26 and 166)."},"gaps":[[21,20,30,48],[81,20,30,48],[141,20,30,48]]};
MINI_ART.kant_s={"atlas":"2cfe2a8512c87f9de7de12b34b8bd8b5","people":"0e19f1dd75b4c245a92f354f519d0dcb","rects":{"compass":[1,1,119,120],"watch":[121,1,80,78],"church":[202,1,53,64],"castle":[256,1,56,56],"university":[313,1,56,53],"ship":[370,1,18,48],"bookshop":[389,1,46,48],"linden":[436,1,32,32],"clock":[469,1,28,28],"door_closed":[498,1,18,28],"door_open":[517,1,18,28],"knot":[536,1,24,9]},"prects":{"kant_hat":[1,1,16,26],"band0_0":[18,1,19,24],"band0_1":[38,1,19,24],"band1_0":[58,1,19,24],"band1_1":[78,1,19,24],"grd0_walk_0":[98,1,14,24],"grd0_walk_1":[113,1,14,24],"grd0_offer":[128,1,19,24],"grd1_walk_0":[148,1,14,24],"grd1_walk_1":[163,1,14,24],"grd1_offer":[178,1,19,24],"kant_up_1":[198,1,12,23],"kant_down_1":[211,1,12,23],"kant_stand":[224,1,12,22],"kant_walk_0":[237,1,12,22],"kant_walk_1":[250,1,12,22],"kant_up_0":[263,1,12,22],"kant_down_0":[276,1,12,22],"w_sit":[289,1,16,21],"nb_wave_0":[306,1,17,17],"nb_wave_1":[324,1,17,15]},"pivots":{"kant_stand":[6,22],"kant_walk_0":[6,22],"kant_walk_1":[6,22],"kant_up_0":[9,22],"kant_up_1":[4,23],"kant_down_0":[9,22],"kant_down_1":[4,23],"kant_hat":[6,26],"band0_0":[8,24],"band0_1":[8,24],"band1_0":[8,24],"band1_1":[8,24],"nb_wave_0":[8,17],"nb_wave_1":[8,15],"w_sit":[8,21],"grd0_walk_0":[10,24],"grd0_walk_1":[6,24],"grd0_offer":[8,24],"grd1_walk_0":[10,24],"grd1_walk_1":[6,24],"grd1_offer":[8,24]},"bg":["386df3d6bbaf55cc736ac50c0e41daf7"],"geo":{"walls":[[0,0,84,76],[108,0,84,76],[82,70,32,76],[0,128,10,50],[40,180,46,34],[40,222,46,40],[106,180,42,34],[106,222,42,40],[162,136,30,22],[158,240,34,22]],"water":[[0,96,10,32],[30,96,32,28],[62,96,66,4],[128,96,34,28],[184,96,8,32],[30,138,32,38],[62,162,26,14],[104,162,46,14],[128,138,22,24],[150,138,12,44],[162,158,30,82]],"bridges":{"leftQuay":[10,96,20,82],"leftBridge":[30,124,32,14],"rightBridge":[128,124,34,14],"rightQuay":[162,96,22,40],"southBridge":[88,162,16,14]},"island":[62,100,66,62],"landmarks":{"university":[44,82],"castle":[148,80],"church":[96,152],"bookshop":[22,156],"harbor":[155,205]},"icons":{"bookshop":[8,150],"note":"the university, castle, church, harbor and ships are painted; draw only their gold rings. The bookshop is not painted: draw kant-ss bookshop at icons.bookshop (over the small houses at the left edge)."},"loop":[38,175,96,218],"loopLap":202,"loopStart":[67,218],"walk":[[44,86],[20,86],[20,131],[72,131],[72,152],[96,152],[96,176],[36,176],[36,236]],"autoPath":[[67,218],[38,218],[38,176],[20,176],[20,156],[20,96],[20,86],[44,86],[20,86],[20,131],[70,131],[70,152],[96,152],[122,152],[122,131],[172,131],[172,88],[148,86],[172,88],[172,131],[122,131],[122,152],[96,152],[96,176],[96,218],[152,218],[155,205]],"streets":{"north":[0,78,192,18],"centerNorth":[86,0,20,80],"southBank":[10,174,152,6],"avenue":[86,176,20,86],"square":[80,205,30,17],"cross":[36,214,114,8],"leftLane":[36,176,4,86],"quayStreet":[148,182,14,80],"lindens":[0,178,36,80],"bottom":[0,262,192,10]},"darkBandFrom":274,"note":"kant-sbg: the river is a north channel (y 96-124) and a south channel (y 138-176) around the island (x 62-128, y 100-162); the north channel is crossed by the two stone quays at the edges, the south channel by the center bridge and the left quay. The walk route goes north to south and ends in the linden avenue."},"walk":[[44,86],[20,86],[20,131],[72,131],[72,152],[96,152],[96,176],[36,176],[36,236]],"walls":[[0,0,84,76],[108,0,84,76],[82,70,32,76],[0,128,10,50],[40,180,46,34],[40,222,46,40],[106,180,42,34],[106,222,42,40],[162,136,30,22],[158,240,34,22]]};
MINI_ART.mill_s={"atlas":"4cdcf060481ea0275a7d89daa502b9f7","people":"c271f08438f95dc5b7d0b6c37d85813d","rects":{"scroll":[1,1,120,53],"town_dark":[122,1,20,40],"town_lit":[143,1,20,40],"gear_0":[164,1,38,38],"gear_1":[203,1,38,38],"gear_2":[242,1,38,38],"gear_3":[281,1,38,38],"gear_5":[320,1,37,38],"gear_6":[358,1,38,38],"gear_7":[397,1,38,38],"gear_4":[436,1,37,37],"oilcan":[474,1,29,32],"book":[504,1,40,25],"flowers":[545,1,23,24],"lamp_off":[569,1,11,24],"lamp_on":[581,1,11,24],"cottage_dark":[593,1,19,24],"cottage_lit":[613,1,19,24]},"prects":{"lamp_light":[1,1,17,27],"mill_stand":[19,1,14,24],"lamp_walk_0":[34,1,17,24],"lamp_walk_1":[52,1,17,24],"mill_up":[70,1,14,21],"mill_read":[85,1,14,20]},"pivots":{"mill_read":[8,20],"mill_up":[8,21],"mill_stand":[8,24],"lamp_walk_0":[8,24],"lamp_walk_1":[8,24],"lamp_light":[8,27]},"bg":["cdd19a5d63128f4da7c0b9038574ed0a"],"geo":{"nodes":[[22,47],[57,47],[96,47],[135,47],[169,47],[22,87],[57,87],[96,87],[135,87],[169,87],[22,139],[57,139],[96,139],[135,139],[169,139],[22,172],[57,172],[96,172],[135,172],[169,172],[22,207],[57,207],[96,207],[135,207],[169,207],[22,246],[57,246],[96,246],[135,246],[169,246]],"nodeOrder":"row-major r0c0..r0c4, r1c0.., i.e. index = r*5 + c (c0-c4 = x, r0-r5 = y)","cols":[22,57,96,135,169],"rows":[47,87,139,172,207,246],"depot":[96,246],"square":[96,139],"hills":[0,0,192,40],"lake":[52,14,134,30],"town":[0,40,192,250],"note":"mill-sbg-sq: the town rows of the Gemini art (y 40-292) are squashed into y 40-250 so corner row r5 stays out of the pad zone. The plan's grid order 'c0r0...c4r5' is given here as cols/rows; nodes[] is row-major."},"nodes":[[22,47],[57,47],[96,47],[135,47],[169,47],[22,87],[57,87],[96,87],[135,87],[169,87],[22,139],[57,139],[96,139],[135,139],[169,139],[22,172],[57,172],[96,172],[135,172],[169,172],[22,207],[57,207],[96,207],[135,207],[169,207],[22,246],[57,246],[96,246],[135,246],[169,246]]};
MINI_ART.gilligan_s={"atlas":"d5aedf75b6eb1779a8106b7b90f68295","people":"e89bcfc8c12bf499313f8e9762184bfa","rects":{"measure":[1,1,140,312],"spool":[142,1,31,48],"book":[174,1,48,47],"tok_round":[223,1,44,44],"tok_square":[268,1,44,42],"lamp":[313,1,24,40],"notebook":[338,1,64,39],"paper":[403,1,40,36],"parcel":[444,1,40,36],"toolbox":[485,1,40,35],"firewood":[526,1,40,35],"tea":[567,1,40,29],"blanket":[608,1,40,23]},"prects":{"wv_book":[1,1,18,27],"wv_spool":[20,1,18,26],"vis5_walk_1":[39,1,18,25],"wv_stand":[58,1,14,24],"wv_hand":[73,1,19,24],"vis0_walk_0":[93,1,14,24],"vis0_walk_1":[108,1,14,24],"vis1_walk_0":[123,1,14,24],"vis1_walk_1":[138,1,14,24],"vis2_walk_0":[153,1,14,24],"vis2_walk_1":[168,1,14,24],"vis3_walk_0":[183,1,15,24],"vis3_walk_1":[199,1,15,24],"vis4_walk_0":[215,1,14,24],"vis4_walk_1":[230,1,14,24],"vis5_walk_0":[245,1,18,24],"tf0_talk_0":[264,1,14,20],"tf0_talk_1":[279,1,19,20],"tf1_talk_0":[299,1,18,20],"tf1_talk_1":[318,1,21,20],"tf2_talk_0":[340,1,14,20],"tf2_talk_1":[355,1,19,20],"tf3_talk_0":[375,1,14,20],"tf3_talk_1":[390,1,19,20]},"pivots":{"wv_stand":[7,24],"wv_book":[9,27],"wv_hand":[10,24],"wv_spool":[9,26],"tf0_talk_0":[8,20],"tf0_talk_1":[8,20],"tf1_talk_0":[10,20],"tf1_talk_1":[12,20],"tf2_talk_0":[8,20],"tf2_talk_1":[8,20],"tf3_talk_0":[8,20],"tf3_talk_1":[12,20],"vis0_walk_0":[10,24],"vis0_walk_1":[6,24],"vis1_walk_0":[10,24],"vis1_walk_1":[6,24],"vis2_walk_0":[10,24],"vis2_walk_1":[6,24],"vis3_walk_0":[10,24],"vis3_walk_1":[6,24],"vis4_walk_0":[10,24],"vis4_walk_1":[6,24],"vis5_walk_0":[12,24],"vis5_walk_1":[8,25]},"bg":["690f764981a5879118d5559a9ef2dc85"],"geo":{"loom":[66,32,62,80],"loomCenter":[96,72],"backWall":[0,0,192,98],"floor":[0,98,192,84],"tables":[[16,133],[176,133]],"tableTops":[[2,125,28,17],[162,125,30,17]],"chairs":{"left":[[16,116],[16,152]],"right":[[178,116],[178,152]]},"counterTop":[5,183,155,14],"counterFront":[5,197,155,16],"counterTopY":186,"shelves":[33,222,125,38],"shelfBays":[[33,222,31,38],[64,222,32,38],[96,222,31,38],[127,222,31,38]],"hangingLantern":[180,196],"darkBandFrom":264,"suggest":{"weaver":[96,220],"visitorStop":[96,176],"bubbles":[[60,134],[96,118],[132,134]],"spool":[150,160],"shelfY":236,"townsfolk":[[16,116],[16,152],[178,116],[178,152]],"measure":[61,36,70,170]},"note":"the counter runs across y 183-213 with the shelves behind it (nearer the viewer, y 222-260): the Weaver stands between them, facing up; visitors come down the open floor from the top left and stop above the counter (brief: Weaver (96,196), visitor (96,112)). The two tables are at the sides of the floor (y 133), not at the bottom (brief (26,280), (166,280)).","measure":{"rect":[61.0,43,70.0,156.0],"px":[140,312],"rungsTopDown":[65.5,87.5,109.5,131.5,154.0,175.5],"rungsBottomUp":[175.5,154.0,131.5,109.5,87.5,65.5],"dial":[77.5,114.5],"railsX":[95.5,116.5],"note":"measure drawn at 1:1 (2 px = 1 unit) with its top-left at rect[0..1]; rung 1 = rungsBottomUp[0]; the pointer pivots at dial"}}};
/* MINI_ART:END */
/* GAME:summa:BEGIN */
(function(){
/* Objection! (summa), Aquinas. Helper: none. */
{
const K="aquinas_s",DT=[1,5,9,12.5,16,19.5,23,26.5],SC=["#E0A040","#4A78C8","#C8607A"],SL=[[96,190],[74,186],[118,186]];
if(typeof SFX!=="undefined"&&!SFX.summa_catch){
  SFX.summa_catch=()=>aNoise(.09,{f:1900,to:900,q:1,v:.05,a:.01});
  SFX.summa_smooth=()=>aNoise(.22,{type:"highpass",f:2600,q:.6,v:.04,a:.05});
  SFX.summa_send=()=>aNoise(.18,{f:900,to:3200,q:2,v:.04,a:.02});
  SFX.summa_through=()=>{aTone(AN(12),.5,{v:.05,a:.005});aTone(AN(19),.4,{v:.025,at:.06})};
  SFX.summa_bounce=()=>aTone(AN(-12),.1,{type:"triangle",v:.07,lp:500,to:AN(-17)})}
const hy=Math.hypot,rng=a=>()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};
const shf=(R,a)=>a.sort(()=>R()-.5);
const gaps=()=>((MINI_ART[K]||{}).gaps||[[29,20,30,48],[81,20,30,48],[133,20,30,48]]).map(r=>[r[0]+r[2]/2,r[1]+r[3]/2,r]);
const qd=(d,p)=>{const u=1-p;return[u*u*d.x0+2*u*p*d.cx+p*p*96,u*u*d.y0+2*u*p*d.cy+p*p*180]};
const Q=s=>s.D.filter(d=>d.st==1||d.st==3).sort((a,b)=>a.o-b.o);
const rdy=s=>{const f=Q(s)[0];return f&&f.st==3&&f.u>=1&&!s.sc?f:null};
const pc=(c,n,x,y,w,h,col,o)=>mPiece(c,K,n,x,y,Object.assign({ax:.5,ay:.5},o))||(c.fillStyle=col,c.fillRect(hs(x-w/2),hs(y-h/2),w,h));
const pp=(c,n,x,y)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];mShadow(c,x,y,14,.35);if(!(r&&v&&mPerson(c,K,n,x,y,{ax:v[0]/r[2],ay:1}))){c.fillStyle="#E8E0D0";c.fillRect(x-6,y-22,12,22)}};
const seal=(c,i,x,y,z)=>{c.save();c.fillStyle=SC[i];c.strokeStyle="#100B15";c.lineWidth=1;c.beginPath();
  if(i<1)c.arc(x,y,z/2,0,7);else if(i<2){c.moveTo(x,y-z/2);c.lineTo(x+z/2,y+z/2);c.lineTo(x-z/2,y+z/2);c.closePath()}else c.rect(x-z/2,y-z/2,z,z);c.fill();c.stroke();c.restore()};
const back=c=>{if(!mBg(c,K,0)){c.fillStyle="#2A2845";c.fillRect(0,0,192,268);c.fillStyle="#0B0914";c.fillRect(0,268,192,52)}};
const lec=(c,cl)=>{c.save();if(cl){c.beginPath();c.rect(0,218,192,99);c.clip()}pc(c,"book_lectern",96,178.5,64,64,"#6B4A2E",{ay:0});c.restore()};
const grab=(s,d)=>{if(d.st==2)s.landed++;d.st=1;d.ft=0;d.fx=d.x;d.fy=d.y;d.o=++s.ao;s.rc=.4;sfx("summa_catch")};
const send=(s,g)=>{const f=rdy(s);if(f){s.sc={x:96,y:204,x0:96,y0:204,g,ok:s.gs[g]===f.seal,seal:f.seal,st:0,t:0};sfx("summa_send")}};
const scr=(c,x,y,sl)=>{pc(c,"scroll",x,y,15,16,"#E8D8A8");seal(c,sl,x,y,7)};
const nd=(L,x,y)=>L.sort((a,b)=>hy(a.x-x,a.y-y)-hy(b.x-x,b.y-y))[0];
const hitD=(a,b,x,y)=>Math.abs(a-x)<=13&&Math.abs(b-y)<=13;
const tap=(s,x,y)=>{const W=Q(s).length,c=nd(s.D.filter(d=>(d.st==0||d.st==2)&&hitD(d.x,d.y,x,y)),x,y);
  if(c){if(W<3)grab(s,c);return}
  const q=Q(s),m=q.find((d,i)=>d.st==3&&d.cr&&d.tp<2&&hitD(SL[i][0],SL[i][1],x,y));if(m){m.tp++;sfx("summa_smooth");return}
  const g=s.gp.findIndex(g=>Math.abs(x-g[0])<=18&&Math.abs(y-g[1])<=27);if(g>=0){send(s,g);return}
  if(Math.abs(x-96)<=44&&y>=165&&y<=240)s.sw={x,y}};
MINI.summa={
  who:"aquinas",land:"l4",title:"Objection!",short:true,art:K,stages:["Catch and Answer"],
  setup:["Every question I wrote begins with the strongest case against my answer.","So don’t dodge an objection. Catch it, open it, and answer it."],
  how:"Tap a dart to catch it. Then send your reply through the gap with the same seal.",
  win:"Eight objections, each heard in full and answered. That’s how a question earns its answer.",
  walk:"Leave the rest on the desk. They’ll keep until tomorrow.",
  pad:true,ab:true,bloomT:2,limit:60,
  fl:["Every objection answered.","Few replies went astray.","Each one caught, opened, and answered true."],
  flNext:["Match each reply to its seal before you send it.","Catch each dart while it is still in the air."],
  rate(s){const m=s.mis||0,l=s.landed||0;return m==0&&l<=1?3:m<=2?2:1},
  shotReady(s){return s.ans>=3&&!!rdy(s)},
  init(s){s.R=rng(s.seed!=null?s.seed:(Math.random()*4e9)|0);s.st=0;s.stT=0;
    Object.assign(s,{ck:0,n:0,D:[],ao:0,ans:0,mis:0,landed:0,sc:null,rg:[],hl:1,pd:0,sw:null,rc:0,wr:0,sh:1,go:null,gp:gaps()});
    s.sd=shf(s.R,[0,0,1,1,1,2,2,2]);s.gs=shf(s.R,[0,1,2])},
  step(s,dt,inp){s.ck+=dt;s.stT+=dt;
    for(;s.n<8&&s.ck>=DT[s.n];s.n++){const i=s.n,sd=i%2?1:-1,x0=sd>0?192:0,y0=70+70*s.R(),d={i,seal:s.sd[i],cr:i==2||i==4||i==6,x0,y0,cx:(x0+96)/2,cy:(y0+180)/2-40,sd,p:0,st:0,tp:0,u:0,o:0,ft:0,x:x0,y:y0};s.D.push(d)}
    const W=Q(s).length;
    for(const d of s.D){
      if(d.st==0){const p=d.p;d.p+=(W>=3?18:36)*dt/hy(2*((1-p)*(d.cx-d.x0)+p*(96-d.cx)),2*((1-p)*(d.cy-d.y0)+p*(180-d.cy))); /* constant speed along the curve */
        if(d.p>=1){const n=s.D.filter(e=>e.st==2&&e.sd==d.sd).length;d.st=2;d.x=96+d.sd*(36-8*n);d.y=236}else{const q=qd(d,d.p);d.x=q[0];d.y=q[1]}}
      else if(d.st==1){d.ft+=dt;if(d.ft>=.3)d.st=3}
      else if(d.st==3&&(!d.cr||d.tp>=2))d.u=Math.min(1,d.u+dt/.8)}
    const xs=inp.dx>.5?1:inp.dx<-.5?-1:0;s.hl=clamp(s.hl+(inp.rTap?1:0)-(inp.lTap?1:0)+(xs&&xs!==s.pd?xs:0),0,2);s.pd=xs;
    for(const p of inp.taps||[])tap(s,p.x,p.y);
    if(inp.bTap){const m=Q(s).find(d=>d.st==3&&d.cr&&d.tp<2);if(m){m.tp++;sfx("summa_smooth")}}
    if(inp.aTap){const a=nd(s.D.filter(d=>d.st==0&&hy(d.x-96,d.y-190)<=54),96,190);
      if(a&&W<3)grab(s,a);else if(rdy(s))send(s,s.hl);else{const f=s.D.find(d=>d.st==2&&hy(d.x-96,d.y-190)<=64);if(f&&W<3)grab(s,f)}}
    const u=(inp.ups||[])[0];if(u&&s.sw){const dx=u.x-s.sw.x,dy=u.y-s.sw.y;if(dy<-8&&hy(dx,dy)>=20){const a=Math.atan2(dx,-dy)*57.3;send(s,a<-18?0:a>18?2:1)}}
    if(u)s.sw=null;
    const c=s.sc;
    if(c){if(c.st==0){const G=s.gp[c.g],dx=G[0]-c.x,dy=44-c.y,l=hy(dx,dy),m=160*dt;
        if(c.ok&&l<=m){Q(s)[0].st=4;s.ans++;s.rg.push({g:c.g,t:0});s.wr=.7;s.sc=null;sfx("summa_through");
          if(s.ans%2==0&&s.ans<8){s.go=s.gs.slice();const k=1+(s.R()<.5?1:0);s.gs=s.go.map((_,i)=>s.go[(i+k)%3]);s.sh=0}}
        else if(!c.ok&&c.y<=70){c.st=1;c.t=0;c.bx=c.x;c.by=c.y;s.mis++;sfx("summa_bounce")}
        else{c.x+=dx/l*m;c.y+=dy/l*m}}
      else{c.t+=dt;c.x=lerp(c.bx,96,c.t/.5);c.y=lerp(c.by,204,c.t/.5);if(c.t>=.5)s.sc=null}}
    s.sh=Math.min(1,s.sh+dt/.8);s.rc-=dt;s.wr-=dt;s.rg.forEach(r=>r.t+=dt);s.rg=s.rg.filter(r=>r.t<.8);
    return s.ans>=8?"win":null},
  draw(s,c,t){const f=rdy(s),e=E.inOut(Math.min(1,s.sh)),q=Q(s);back(c);
    for(let j=0;j<3;j++){const a=s.go&&s.go.indexOf(j)>=0?s.gp[s.go.indexOf(j)]:null,b=s.gp[s.gs.indexOf(j)];
      if(!a||s.sh>=1)seal(c,j,b[0],44,14);else if(s.rm){c.globalAlpha=1-e;seal(c,j,a[0],44,14);c.globalAlpha=e;seal(c,j,b[0],44,14);c.globalAlpha=1}else seal(c,j,lerp(a[0],b[0],e),44,14)}
    s.gp.forEach((g,i)=>{c.strokeStyle=f&&s.hl==i?"#F5C66A":"rgba(245,198,106,.25)";c.lineWidth=1.5;c.strokeRect(g[2][0]+.5,g[2][1]+.5,g[2][2]-1,g[2][3]-1)});
    s.rg.forEach(r=>{c.globalAlpha=1-r.t/.8;ring(c,s.gp[r.g][0],44,4+r.t*22,1,"#F5C66A",1.5);c.globalAlpha=1});
    c.strokeStyle="rgba(255,233,184,.16)";c.lineWidth=1;c.beginPath();c.arc(96,190,54,0,7);c.stroke();
    pp(c,s.rc>0?"aq_reach":s.wr>0?"aq_write_"+(s.rm?0:(t/200|0)%2):"aq_stand",96,178);
    lec(c);c.fillStyle="#6B4E3A";for(let i=0;i<s.ans;i++)c.fillRect(i<4?68:100,201+3.5*(i%4),20,.8);
    pc(c,"lantern",130,192,8,16,"#C98A3A");glow(c,130,189,20,"#FFC860",.35);
    q.forEach((d,i)=>{let [x,y]=SL[i];if(d.st==1){const k=Math.min(1,d.ft/.3);x=lerp(d.fx,x,k);y=lerp(d.fy,y,k)}
      if(d.cr&&d.tp<2){pc(c,"sheet",x,y,12,13,"#EBD9AE",{a:d.tp*.4});pc(c,"crumpled",x,y,14,13,"#D8C9A0",{a:1-d.tp*.4})}
      else{const z=(i?1:1.6)*(.6+.4*d.u);pc(c,"sheet",x,y,18*z,20*z,"#EBD9AE",{sc:z});if(d.u>0)seal(c,d.seal,x,y,i?12:20*d.u)}});
    if(f)scr(c,96,208,f.seal);
    s.D.forEach(d=>{if(d.st==2)glow(c,d.x,d.y,10,"#FFE3A0",.6);if(d.st==0||d.st==2){
      if(d.cr)pc(c,"crumpled",d.x,d.y,14,13,"#D8C9A0");else{pc(c,"dart",d.x,d.y,11,8,"#EBD9AE",{flip:d.sd>0});seal(c,d.seal,d.x,d.y,5)}}});
    const r=s.sc;if(r){c.strokeStyle="rgba(245,198,106,.5)";c.lineWidth=1;c.beginPath();c.moveTo(r.x0,r.y0);c.lineTo(r.x,r.y);c.stroke();scr(c,r.x,r.y,r.seal)}},
  bloom(s,c,k,t){const e=E.out(Math.min(1,k/.6)),f=s._fl||1,gp=s.gp||gaps(),by=lerp(196,110,e),sc=lerp(1,1.4,e),lx=lerp(130,140,e),ly=lerp(192,106,e);
    back(c);pp(c,"aq_stand",96,178);lec(c,1);
    if(f>2)gp.forEach(g=>glow(c,g[0],44,28,"#F5C66A",.5*e));
    pc(c,"book",96,by,64*sc,30*sc,"#EBD9AE",{sc});
    const n=Math.min(8,Math.floor(8*clamp((k-.15)/.6,0,1)));c.fillStyle="#6B4E3A";
    for(let i=0;i<n;i++)c.fillRect(58,by-14+3.6*i,24+(i*7%5)*2,.9);for(let i=0;i<3;i++)c.fillRect(104,by-14+3.6*i,22-i*3,.9);
    c.fillStyle="rgba(255,243,208,.4)";c.fillRect(102,by-2,28,11);glow(c,lx,ly,40,"#FFE3A0",.35+.2*k);
    pc(c,"lantern",lx,ly,8*sc,16*sc,"#C98A3A",{sc});
    if(f>1)for(let i=0;i<8;i++){const u=clamp((k-.2-i*.06)/.4,0,1),g=gp[i%3];if(u>0&&u<1){const x=lerp(g[0],96+(i-4)*5,u),y=lerp(44,by,u);glow(c,x,y,5,"#F5C66A",.9);c.fillStyle="#FFE9A8";c.fillRect(hs(x),hs(y),1.5,1.5)}}},
  auto(s,inp){const q=Q(s),f=rdy(s),m=q.find(d=>d.st==3&&d.cr&&d.tp<2);let p=null;
    if(f)p=s.gp[s.gs.indexOf(f.seal)];else if(m)p=SL[q.indexOf(m)];
    else if(q.length<3){const d=s.D.find(d=>d.st==0&&d.x>=20&&d.x<=172)||s.D.find(d=>d.st==2);if(d)p=[d.x,d.y]}
    if(p){inp.taps=[{x:p[0],y:p[1]}];inp.tap=inp.taps[0]}}
};
}
})();
/* GAME:summa:END */
/* GAME:ox:BEGIN */
(function(){
/* The Quiet Ox (ox), Aquinas. Helper: mHold (the hold ring at the pen tip). */
{
const K="aquinas_s",CP=[[10,150],[10,206],[182,150],[182,206]],OD=[0,2,1,3];
if(typeof SFX!=="undefined"&&!SFX.ox_scratch){
  SFX.ox_scratch=()=>aNoise(.06,{type:"highpass",f:4200,q:.7,v:.025,a:.005});
  SFX.ox_line=()=>aTone(AN(7),.07,{type:"triangle",v:.04,lp:1500});
  SFX.ox_noise=()=>aNoise(1.4,{f:220,q:.8,v:.04,a:.3});
  SFX.ox_bellow=()=>{aTone(AN(-24),1.4,{type:"sawtooth",v:.05,a:.2,lp:420});aTone(AN(-17),1.2,{type:"triangle",v:.03,a:.25,at:.1})};
  GAP.ox_scratch=.13}
const rng=a=>()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};
const pc=(c,n,x,y,w,h,col,o)=>mPiece(c,K,n,x,y,Object.assign({ax:.5,ay:.5},o))||(c.fillStyle=col,c.fillRect(hs(x-w/2),hs(y-h/2),w,h));
const pp=(c,n,x,y)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];mShadow(c,x,y,14,.35);if(!(r&&v&&mPerson(c,K,n,x,y,{ax:v[0]/r[2],ay:1}))){c.fillStyle="#E8E0D0";c.fillRect(x-6,y-20,12,20)}};
const back=c=>{if(!mBg(c,K,0)){c.fillStyle="#2A2845";c.fillRect(0,0,192,268);c.fillStyle="#0B0914";c.fillRect(0,268,192,52)}grade(c,"#E9B872",.3)};
const pg=(c,n,w,a)=>{c.save();c.globalAlpha=a;c.fillStyle="#F1E4C0";c.fillRect(48,28,96,96);c.strokeStyle="#D9A93A";c.lineWidth=1;c.strokeRect(48.5,28.5,95,95);
  for(let i=0;i<6;i++){const y=42+14*i,l=i<n?96:i==n?w:0;c.fillStyle="#CDBA8C";c.fillRect(52,y,88,.5);if(l>1)wave(c,48,y-2,l,.8,l/4,i,1.4,"#3B2A2E",.9)}c.restore()};
const jag=(c,x,y,r,a)=>{c.save();c.globalAlpha=a;c.strokeStyle="#9A98A8";c.lineWidth=1;c.beginPath();for(let i=0;i<14;i++){const q=i/14*6.283,d=r*(i%2?1.12:.9);c[i?"lineTo":"moveTo"](x+Math.cos(q)*d,y+Math.sin(q)*d)}c.closePath();c.stroke();c.restore()};
MINI.ox={
  who:"aquinas",land:"l4",title:"The Quiet Ox",short:true,art:K,stages:["Quiet Pages"],
  setup:["The other students called me ‘the dumb ox,’ because I said so little.","The story goes that Albert, my teacher, said this ox would be heard throughout the world."],
  how:"Hold to write. At the margin, let go and hold again. Through the noise, keep holding.",
  win:"Two quiet pages. Steady work carries farther than noise.",
  walk:"Rest your hand. The page will wait for you.",
  pad:false,ab:true,bloomT:2,limit:80,
  fl:["Two pages, written.","Steady through most of the noise.","Steady through all of it."],
  flNext:["At the margin, wait for quiet before you lift the pen.","Keep holding while the noise passes."],
  rate(s){const r=s.rattled||0;return r==0?3:r<=2?2:1},
  shotReady(s){return s.L>=4&&s.nz.ph=="burst"},
  init(s){s.R=rng(s.seed!=null?s.seed:(Math.random()*4e9)|0);s.st=0;s.stT=0;
    Object.assign(s,{ck:0,L:0,x:0,mg:false,hold:false,rattled:0,rl:0,bl:2,wt:[],wp:0,pt:9,nz:{ph:"wait",t:3},H:mHold({dur:2.4}),_bf:0})},
  step(s,dt,inp){s.ck+=dt;s.stT+=dt;const hold=!!(inp.a||(inp.down&&inp.down.y<250)),n=s.nz;s.hold=hold;s.H.step(dt,inp,hold);s.pt+=dt;
    n.t-=dt;
    if(n.ph=="wait"){if(n.t<=0){n.ph="warn";n.t=.8}}else if(n.ph=="warn"&&n.t<=0){n.ph="burst";n.t=s.bl;s.rl=0;sfx("ox_noise")}
    if(n.ph=="burst"){if(!hold&&!s.rl){s.rl=1;s.rattled++} /* any lift in a burst: one rattled burst */
      if(n.t<=0){if(!s.rl){s.bl=Math.max(1.2,s.bl-.15);if(s.wp<2){s.wt.push(OD[s.wt.length%4]);s.wp++}}n.ph="wait";n.t=4.5+2*s.R()}}
    if(s.mg){if(!hold){s.mg=false;s.x=0;if(s.L%6==0&&s.L<12){s.pt=0;s.wp=0}}} /* let go at the margin: a line break (a new page after six) */
    else if(hold&&s.L<12){s.x=Math.min(96,s.x+40*dt);sfx("ox_scratch");if(s.x>=96){s.L++;s.mg=true;sfx("ox_line")}}
    return s.L>=12?"win":null},
  draw(s,c,t){const row=s.mg?(s.L-1)%6:s.L%6,py=42+14*row-2,px=48+s.x,nzz=s.nz.ph=="burst",wn=s.nz.ph=="warn",u=wn?1-s.nz.t/.8:0;back(c);
    CP.forEach((p,i)=>{const w=s.wt.includes(i);pp(c,"cls"+i+(w?"_watch":"_chat_"+(s.rm?0:(t/(nzz?150:450)|0)%2)),p[0],p[1]);
      const bx=p[0]+(i<2?14:-14),by=p[1]-26,g=(nzz?(s.rl?1.2:1)*(s.rm?1:.85+.15*Math.sin(t/120)):0)*9;
      if(nzz){c.fillStyle="rgba(190,188,200,.8)";c.beginPath();c.ellipse(bx,by,g,g*.7,0,0,7);c.fill();c.strokeStyle="#6C6A78";c.beginPath();c.moveTo(bx-g*.6,by);for(let k=1;k<5;k++)c.lineTo(bx-g*.6+k*g*.3,by+(k%2?-2:2));c.stroke();
        for(let k=0;k<2;k++)jag(c,p[0],p[1]-10,s.rm?30:((t/700+k*.5+i*.2)%1)*70,s.rm?.5:.7*(1-((t/700+k*.5+i*.2)%1)))}
      else if(wn)for(let k=0;k<Math.ceil(u*4);k++){c.strokeStyle="#8A8898";c.beginPath();c.moveTo(bx-4+k*3,by-3);c.lineTo(bx-2+k*3,by+2);c.stroke()}});
    pp(c,s.hold&&!s.mg?"yaq_write_"+(s.rm?0:(t/150|0)%2):"yaq_still",96,160);
    pc(c,"desk",96,176,48,48,"#6B4A2E");pc(c,"ox",124,166,20,16,"#8A8A92");
    const pn=Math.min(1,s.pt/.4);pg(c,s.mg?row+1:row,s.mg?0:s.x,1);
    if(s.pt<.4){c.save();c.translate(48,0);c.scale(s.rm?1:1-pn,1);c.translate(-48,0);pg(c,6,0,s.rm?1-pn:1);c.restore()}
    if(s.mg)glow(c,px,py,14,"#FFE3A0",.6+(s.rm?0:.2*Math.sin(t/150)));
    pc(c,"quill",px,py,10,12,"#EBD9AE",{ax:0,ay:1});if(s.hold)s.H.draw(c,px,py,6)},
  bloom(s,c,k,t){const f=s._fl||1,e=E.out(Math.min(1,k/.5)),ax=lerp(170,128,E.out(Math.min(1,k/.4)));if(k>.35&&!s._bf){s._bf=1;sfx("ox_bellow")}
    back(c);CP.forEach((p,i)=>pp(c,"cls"+i+(k>.15?"_watch":"_chat_0"),p[0],p[1]));pp(c,"yaq_still",96,160);pc(c,"desk",96,176,48,48,"#6B4A2E");pc(c,"ox",124,166,20,16,"#8A8A92");
    glow(c,124,166,22,"#FFD080",.8*e);
    for(let i=0;i<f;i++){const u=clamp((k-.25-i*.12)/.75,0,1);if(u>0){c.globalAlpha=.75*(1-.5*u);ring(c,96,92,20+u*130,1,"#F5C66A",2);c.globalAlpha=1}}
    [-1,1].forEach(d=>{c.save();c.translate(96+d*36*e,lerp(76,92,e));c.scale(lerp(1,.7,e),lerp(1,.7,e));c.translate(-96,-76);pg(c,6,0,1);c.restore()});
    pp(c,k>.45&&!s.rm&&(t/300|0)%2||k>=1?"alb_nod":"alb_stand",ax,180)},
  auto(s,inp){inp.a=!(s.mg&&s.nz.ph=="wait")}
};
}
})();
/* GAME:ox:END */
/* GAME:kantwalk:BEGIN */
(function(){
/* Kant’s Walk (Kant, short). Helper: none (a local metronome on s.T). Art key kant_s. Taps before T=2.5 (ready ticks) do nothing. */
{
const K="kant_s",N=48,WN=.3,G="#F5C66A",BD=[112,156],NW=[50,205],
FB=[[20,236],[20,180],[88,180],[88,96],[24,96],[24,56],[68,56]],DS=[[28,114],[64,124],[85,143],[82,196],[46,186],[46,238]];
const V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
V("kantwalk_tick",q=>aNoise(.03,{f:q?3400:2400,q:4,v:q?.035:.015,a:.002}));
V("kantwalk_step",()=>{aNoise(.05,{f:700,q:1.5,v:.03,a:.003});aTone(AN(-14),.05,{type:"triangle",v:.02,lp:500})});
V("kantwalk_set",()=>{aTone(AN(19),.5,{v:.05,a:.004});aTone(AN(26),.45,{v:.03,a:.004,at:.06})});
V("kantwalk_off",()=>{aNoise(.07,{f:260,q:1,v:.05,a:.003});aTone(AN(-9),.09,{type:"triangle",v:.04,lp:380})});
V("kantwalk_band",()=>{aNoise(.05,{f:180,q:2,v:.035,a:.003});aTone(AN(-12),.07,{v:.025,lp:260})});
const at=(s,d)=>{const P=s.R,m=s.cum;let i=1;while(i<P.length-1&&d>m[i])i++;const L=m[i]-m[i-1]||1,u=clamp((d-m[i-1])/L,0,1),a=P[i-1],b=P[i];
  return{x:a[0]+(b[0]-a[0])*u,y:a[1]+(b[1]-a[1])*u,dx:(b[0]-a[0])/L,dy:(b[1]-a[1])/L}};
const fig=(c,n,x,y,fl,col)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];mShadow(c,x,y,12,.35);
  if(r&&v&&mPerson(c,K,n,x,y,{ax:v[0]/r[2],ay:1,flip:fl}))return;c.fillStyle=col||"#6A5A4A";c.fillRect(x-3,y-12,6,12);c.fillStyle="#D8B890";c.fillRect(x-2,y-16,4,4)};
const hand=(c,x,y,a,l,col,w)=>{const r=a*Math.PI/180;c.strokeStyle=col;c.lineWidth=w;c.lineCap="round";c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.sin(r)*l,y-Math.cos(r)*l);c.stroke()};
const back=c=>{if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#2A3556");g.addColorStop(1,"#141A2E");c.fillStyle=g;c.fillRect(0,0,192,320)}grade(c,"#1E2A4A",.25)};
const door=(c,s,i,T,b)=>{const[x,y]=s.dr[i],cy=y-21,k=s.ck[i],m=8*(i+1);
  if(k&&k.ok)glow(c,x,y-7,b?22:16,"#FFD890",b?.8:.55);
  if(!mPiece(c,K,k&&k.ok?"door_open":"door_closed",x,y,{ax:.5,ay:1})){c.fillStyle=k&&k.ok?"#F5C66A":"#6A4A3A";c.fillRect(x-4.5,y-14,9,14)}
  if(!mPiece(c,K,"clock",x,cy,{ax:.5,ay:.5})){c.fillStyle="#EDE2C8";c.beginPath();c.arc(x,cy,6,0,7);c.fill()}
  const mn=k?m+k.d:0,p=k?E.out(clamp((T-k.t)/.6,0,1)):1,a=k?1:.35;c.globalAlpha=a;
  if(!k){c.fillStyle=G;const r=m*6*Math.PI/180;c.fillRect(x+Math.sin(r)*5-.5,cy-Math.cos(r)*5-.5,1.5,1.5)}
  hand(c,x,cy,k?lerp(0,720+mn*6,p):0,4.5,"#2A1E2A",.9);hand(c,x,cy,k?lerp(0,480+mn*.5,p):0,3,"#2A1E2A",1.2);c.globalAlpha=1;
  if(k&&!k.ok){c.fillStyle="rgba(90,90,100,.55)";c.beginPath();c.ellipse(x+3,cy+3,4,2,0,0,7);c.fill()}};
const watch=(c,s,x,y,sc,T)=>{if(!mPiece(c,K,"watch",x,y,{ax:.58,ay:.63,sc,sm:sc!==1})){c.fillStyle="#D9A93A";c.beginPath();c.arc(x,y,12*sc,0,7);c.fill();c.fillStyle="#EDE2C8";c.beginPath();c.arc(x,y,10*sc,0,7);c.fill()}
  const m=Math.floor(T),u=clamp((T-m)/.12,0,1);hand(c,x,y,(m+E.out(u))*6,9*sc,"#B03A2A",.9*sc);
  for(const r of s.rg){const q=r.t/.45;c.globalAlpha=(1-q)*(r.q?.8:.35);c.strokeStyle=G;c.lineWidth=1;c.beginPath();c.arc(x,y,12*sc+q*9,0,7);c.stroke()}c.globalAlpha=1;
  if(sc===1)for(let i=0;i<3;i++){c.fillStyle=T>=i?"rgba(245,198,106,.75)":"rgba(245,198,106,.2)";c.fillRect(x-8+i*8-1,y+22,2,2)}};
const scene=(c,s,T)=>{back(c);
  if(!mArtOk(K)){c.strokeStyle="#3A3A58";c.lineWidth=9;c.lineJoin="round";c.beginPath();s.R.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke()}
  for(let i=1;i<=N;i++){const p=s.sp[i];c.fillStyle=i<=s.n?"rgba(245,198,106,.85)":"rgba(245,198,106,.3)";c.fillRect(hs(p.x)-.5,hs(p.y)-.5,1.5,1.5)}
  mPiece(c,K,"linden",24,252,{ax:.5,ay:1});s.dr.forEach((p,i)=>door(c,s,i,T,0));
  if(s.mo[2]>0){const[x,y]=NW,w=Math.floor(T/.5)%2;c.globalAlpha=s.mo[2];c.fillStyle="#2A1E26";c.fillRect(x-10,y-20,20,20);c.fillStyle="rgba(217,169,58,.5)";c.fillRect(x-9,y-19,18,18);
    fig(c,"nb_wave_"+w,x,y,0,"#8A6A5A");const q=1+.2*Math.max(0,1-(T%.5)*8);c.save();c.translate(x-14,y-26);c.scale(q,q);c.fillStyle="#EDE2C8";c.beginPath();c.arc(0,0,5,0,7);c.fill();c.fillStyle="#8A5A32";c.fillRect(-2,-2,4,4);c.fillRect(2,-1,1.5,2);c.restore();c.globalAlpha=1}
  if(s.mo[0]>0){const w=Math.floor(T/.7)%2,ph=(T%.7)/.7;c.globalAlpha=s.mo[0];fig(c,"band0_"+w,BD[0]-6,BD[1],0,"#7A5A6A");fig(c,"band1_"+(1-w),BD[0]+7,BD[1]+1,1,"#5A6A7A");
    for(let i=0;i<2;i++)mText(c,i?"♫":"♪",BD[0]-4+i*10,BD[1]-30-Math.abs(Math.sin((ph+i*.5)*Math.PI))*7,8,G);c.globalAlpha=1}};
const kant=(c,s,T,hat)=>{const q=s.len*s.n/N,mv=s.d<q-.05,p=at(s,s.d),h=Math.abs(p.dx)>.5;
  fig(c,hat?"kant_hat":!mv?"kant_stand":h?"kant_walk_"+s.fr:(p.dy>0?"kant_down_":"kant_up_")+s.fr,p.x,p.y,h&&p.dx<0,"#2A2F4A")};
const lines=(c,s,x,y,a)=>{c.strokeStyle=G;c.lineWidth=.8;c.globalAlpha=a;s.dr.forEach((p,i)=>{if(!(s.ck[i]&&s.ck[i].ok))return;c.beginPath();c.moveTo(p[0],p[1]-21);c.lineTo(x,y);c.stroke()});c.globalAlpha=1};
MINI.kantwalk={who:"kant",land:"l4",title:"Kant’s Walk",short:true,art:K,stages:["The Afternoon Walk"],
  setup:["The story goes that my neighbors set their clocks by my afternoon walk.","Moods change, and so does the weather. A good rule keeps its beat."],
  how:"Tap once on each tick of the watch. One tick, one step.",win:"Six doors, six clocks. Rain or music, the rule held.",walk:"Let’s head home. The clocks can forgive one afternoon.",
  lines:[null],pad:false,ab:true,bloomT:2,limit:75,
  fl:["The walk is done.","Most clocks set true.","Every clock set true."],flNext:["Watch the pocket watch, not the band.","If you slip, skip a tick and fall back in step."],
  rate:s=>{const e=s.exact||0;return e>=6?3:e>=4?2:1},
  shotReady:s=>s.n>=36,
  init(s){const A=MINI_ART[K],R=(A&&A.geo&&A.geo.walk)||FB,cum=[0];for(let i=1;i<R.length;i++)cum.push(cum[i-1]+Math.hypot(R[i][0]-R[i-1][0],R[i][1]-R[i-1][1]));
    Object.assign(s,{st:0,stT:0,T:0,ld:.05,R,cum,len:cum[cum.length-1],n:0,d:0,fr:0,tk:0,exact:0,ck:[null,null,null,null,null,null],fin:null,fx:pfx(),rg:[],rp:[],mo:[0,0,0],b:[0,0,0],ch:0});
    s.sp=Array.from({length:N+1},(_,i)=>at(s,s.len*i/N));
    s.dr=s.sp.filter((_,i)=>i&&i%8===0).map((p,i)=>R===FB?[p.x-p.dy*10,p.y+p.dx*10]:DS[i]);s.d=0},
  step(s,dt,inp){s.ld=dt;const T=s.T+=dt;s.stT+=dt;pStep(s.fx,dt,s.rm);
    while(s.tk<=T+1e-9){const q=s.tk>=3?1:0;sfx("kantwalk_tick",q);s.rg.push({t:0,q});s.tk++}
    s.rg=s.rg.filter(r=>(r.t+=dt)<.45);s.rp=s.rp.filter(r=>(r.t+=dt)<1);
    let k=inp.aTap?1:0;for(const p of inp.taps||[])if(p.y<250)k++;
    while(k-->0&&s.n<N&&T>=2.5){s.n++;s.fr^=1;sfx("kantwalk_step");const p=s.sp[s.n];if(!s.rm)pDust(s.fx,p.x,p.y,2);
      if(s.n%8===0){const i=s.n/8-1,df=T-(2+s.n),ok=Math.abs(df)<=WN+1e-9;s.ck[i]={t:T,ok,d:ok?0:(df<0?-1:1)*Math.max(1,Math.round(Math.abs(df)))};
        if(ok){s.exact++;sfx("kantwalk_set");if(!s.rm)pSparks(s.fx,s.dr[i][0],s.dr[i][1]-14,8,G,36)}else sfx("kantwalk_off")}
      if(s.n===N)s.fin=T}
    s.d=Math.min(s.len*s.n/N,s.d+90*dt);
    const A=[s.n>=16&&s.n<24,s.n>=32&&s.n<40,s.n>=40&&s.n<44],b=[Math.floor(T/.7),Math.floor(T/1.4),Math.floor(T/.5)];
    A.forEach((a,i)=>s.mo[i]=clamp(s.mo[i]+(a?4:-4)*dt,0,1));
    if(A[0]&&b[0]!==s.b[0])sfx("kantwalk_band");
    if(A[1]){if(b[1]!==s.b[1]){const p=at(s,s.d);s.rp.push({t:0,x:p.x+(b[1]*13%20-10),y:p.y+2})}if(Math.random()<dt*40)pRain(s.fx,1,"rgba(190,200,230,.5)",-30)}
    s.b=b;return s.fin!=null&&T-s.fin>=1?"win":null},
  draw(s,c,t){const T=s.T;scene(c,s,T);for(const r of s.rp){c.strokeStyle="rgba(190,200,230,"+(.6*(1-r.t))+")";c.lineWidth=.7;c.beginPath();c.ellipse(r.x,r.y,2+r.t*9,1+r.t*4,0,0,7);c.stroke()}
    kant(c,s,T,0);pDraw(c,s.fx,K);watch(c,s,160,38,1,T)},
  bloom(s,c,k,t){const T=s.T,e=E.inOut(clamp(k/.6,0,1)),x=lerp(160,96,e),y=lerp(38,84,e);scene(c,s,T);
    s.dr.forEach((p,i)=>{const o=s.ck[i];glow(c,p[0],p[1]-7,o&&o.ok?24:14,"#FFD890",(o&&o.ok?.7:.3)*k)});
    kant(c,s,T,1);lines(c,s,x,y,clamp((k-.4)/.4,0,1));watch(c,{rg:[]},x,y,lerp(1,1.5,e),T);
    if(k>.5&&!s.ch){s.ch=1;sfx("kantwalk_set")}},
  auto(s,inp){const n=s.n+1;if(n<=N&&s.T+s.ld>=2+n)inp.aTap=true}
};
}
})();
/* GAME:kantwalk:END */
/* GAME:citymap:BEGIN */
(function(){
/* Dare to Know (Kant, short). Helper: none (steer). Art kant_s; geometry from its geo, else the brief's rectangles. */
{
const K="kant_s",G="#F5C66A",SP=32,V=22,R=2,PI=Math.PI,
FG={walls:[[48,24,32,64],[112,24,32,64],[8,216,48,32],[136,216,48,32],[16,160,32,24],[144,160,32,24]],water:[[0,112,32,48],[48,112,32,48],[112,112,32,48],[160,112,32,48]],
 landmarks:{university:[32,56],castle:[160,56],church:[96,128],bookshop:[28,200],harbor:[164,200]},loop:[64,168,128,232],loopStart:[96,232],icons:{bookshop:[17,188]},
 autoPath:[[96,232],[96,200],[28,200],[96,200],[96,100],[40,100],[40,56],[32,56],[40,100],[96,100],[152,100],[152,56],[160,56],[152,100],[96,100],[96,200],[164,200]]};
const V2=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
V2("citymap_cut",()=>{aNoise(.07,{f:2600,to:900,q:2,v:.04,a:.003})});
V2("citymap_stumble",()=>{aNoise(.1,{f:240,q:1,v:.06,a:.004});aTone(AN(-17),.12,{type:"triangle",v:.04,lp:300})});
V2("citymap_offer",()=>{aTone(AN(24),.35,{v:.025,a:.01});aTone(AN(31),.3,{v:.015,a:.01,at:.05})});
V2("citymap_place",()=>{aTone(AN(12),.35,{v:.05,a:.004});aTone(AN(19),.4,{v:.045,a:.004,at:.1})});
const geo=()=>{const A=MINI_ART[K];return A&&A.geo&&A.geo.walls?A.geo:FG};
const path=P=>{const m=[0];for(let i=1;i<P.length;i++)m.push(m[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));return{P,m,L:m[m.length-1]}};
const pat=(o,d)=>{d=((d%o.L)+o.L)%o.L;let i=1;while(i<o.P.length-1&&d>o.m[i])i++;const l=o.m[i]-o.m[i-1]||1,u=(d-o.m[i-1])/l,a=o.P[i-1],b=o.P[i];return{x:a[0]+(b[0]-a[0])*u,y:a[1]+(b[1]-a[1])*u,dx:(b[0]-a[0])/l,dy:(b[1]-a[1])/l}};
const blk=(s,x,y,h)=>{if(x-h<0||x+h>192||y-h<20||y+h>250)return true;for(const r of s.bl)if(x+h>r[0]&&x-h<r[0]+r[2]&&y+h>r[1]&&y-h<r[1]+r[3])return true;return false};
const nrm=(x,y)=>{const l=Math.hypot(x,y)||1;return[x/l,y/l]};
const fig=(c,n,x,y,fl,col)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];mShadow(c,x,y,12,.35);
  if(r&&v&&mPerson(c,K,n,x,y,{ax:v[0]/r[2],ay:1,flip:fl}))return;c.fillStyle=col;c.fillRect(x-3,y-12,6,12);c.fillStyle="#D8B890";c.fillRect(x-2,y-16,4,4)};
const wnd=(c,s,x,y,sit)=>{const[a,b]=nrm(s.hx,s.hy),d=Math.abs(a)>Math.abs(b)?(a>0?"right":"left"):(b>0?"down":"up"),mv=s.mv?1+((s.T*6|0)%2):0;
  if(sit&&mPerson(c,K,"w_sit",x,y,{ax:.5,ay:1})){mShadow(c,x,y,12,.35);return}mShadow(c,x,y,12,.35);
  if(!mSprO(c,"wanderer_"+d+"_"+mv,x-8,y-24)){c.fillStyle="#2F7470";c.fillRect(x-5,y-20,10,20);c.fillStyle="#E2BE98";c.fillRect(x-3,y-24,6,5)}};
const rop=(c,x1,y1,x2,y2,a)=>{c.globalAlpha=a;rope(c,x1,y1-7,x2-1,y2-6,3,"#C9A06A",.8);rope(c,x1+1,y1-6,x2+1,y2-6,3,"#C9A06A",.8);c.globalAlpha=1};
const knotP=s=>{const g=pat(s.lp,22*s.T+16),[a,b]=nrm(g.x-s.x,g.y-s.y);return[s.x+a*8,s.y-3+b*8]};
const scene=(c,s,T)=>{const g=geo();
  if(!mBg(c,K,0)){c.fillStyle="#6A5A3A";c.fillRect(0,0,192,320);c.fillStyle="#3A5A70";g.water.forEach(r=>c.fillRect(r[0],r[1],r[2],r[3]));c.fillStyle="#7A4A3A";g.walls.forEach(r=>c.fillRect(r[0],r[1],r[2],r[3]))}
  grade(c,"#C8A46A",.4);vignette(c,.35);
  const bk=g.icons.bookshop;mPiece(c,K,"bookshop",bk[0],bk[1],{});
  s.lmp.forEach((p,i)=>{const o=s.lm[i];c.strokeStyle=o?G:"rgba(245,198,106,.35)";c.lineWidth=o?1.5:.8;c.setLineDash(o?[]:[2,3]);c.beginPath();c.arc(p[0],p[1],14,0,7);c.stroke();c.setLineDash([])})};
const people=(c,s,T)=>{const g=pat(s.lp,22*T+16),f=g.dx<0,w=Math.floor(T*5)%2;
  fig(c,"grd0_walk_"+w,g.x,g.y,f,"#4A3A5A");
  if(s.tied||s.pull)rop(c,g.x,g.y,s.x,s.y,1);else if(s.dp&&s.dp.t<.8)rop(c,s.dp.gx,s.dp.gy,s.dp.x,s.dp.y+s.dp.t*6,1-s.dp.t/.8);
  if(s.of){const o=s.of;fig(c,"grd1_offer",o.x,o.y,s.x<o.x,"#4A3A5A");const p=.5+.5*Math.sin(T*7);glow(c,o.x+(s.x<o.x?-8:8),o.y-9,9+p*3,"#FFE9B8",.8);c.globalAlpha=1}
  if(s.tied){const k=knotP(s);glow(c,k[0],k[1],10+2*Math.sin(T*6),"#FFD890",.45);if(!mPiece(c,K,"knot",k[0],k[1],{ax:.5,ay:.5})){c.fillStyle="#D9A93A";c.fillRect(k[0]-3,k[1]-2,6,4)}}
  s.tr.forEach(p=>{c.fillStyle="rgba(245,198,106,"+(.5*(1-(T-p.t)/2))+")";c.fillRect(hs(p.x),hs(p.y),1,1)});
  wnd(c,s,s.x,s.y,s.sit>0)};
MINI.citymap={who:"kant",land:"l4",title:"Dare to Know",short:true,art:K,stages:["Without Strings"],
  setup:["I seldom traveled far from Königsberg. I still tried to think what any reasoning person could think.","In ‘What Is Enlightenment?’ I gave a motto: ‘Have courage to use your own understanding.’"],
  how:"Tap the knot or press B to cut the strings. Then steer your own way.",win:"You stumbled a few times, and then you walked alone. That’s how thinking for yourself begins.",walk:"Fold the map. The streets will be here tomorrow.",
  lines:[null],pad:true,ab:true,bloomT:2.2,limit:70,
  fl:["Five places found.","Mostly on your own feet.","Entirely on your own feet."],flNext:["When a guardian offers the string, walk on.","Cut the strings early. The stumbles teach you."],
  rate:s=>{const r=s.retied||0;return r===0&&s.cutT>=0&&s.cutT<(s.lap||9.2)?3:r<=1?2:1},
  shotReady:s=>s.ls>=1&&!!s.of&&s.of.t>.5,
  init(s){const g=geo(),lp=g.loop,st=g.loopStart,P=path([st,[lp[0],lp[3]],[lp[0],lp[1]],[lp[2],lp[1]],[lp[2],lp[3]],st]);
    Object.assign(s,{st:0,stT:0,T:0,ld:.05,bl:g.walls.concat(g.water),lp:P,lap:P.L/V,lmp:[g.landmarks.bookshop,g.landmarks.university,g.landmarks.church,g.landmarks.castle,g.landmarks.harbor],
      x:st[0],y:st[1],hx:-1,hy:0,mv:0,tied:1,pull:null,cutT:-1,w:1,sit:0,ls:0,retied:0,of:null,dp:null,lm:[0,0,0,0,0],fin:null,fx:pfx(),tr:[],ai:1});},
  step(s,dt,inp){s.ld=dt;const T=s.T+=dt;s.stT+=dt;pStep(s.fx,dt,s.rm);s.mv=0;
    if(s.dp)s.dp.t+=dt;s.tr=s.tr.filter(p=>T-p.t<2);
    if(s.of&&(s.of.t+=dt)>=4)s.of=null;
    if(s.tied){const p=pat(s.lp,V*T);s.x=p.x;s.y=p.y;s.hx=p.dx;s.hy=p.dy;s.mv=1;
      let cut=!!inp.bTap;const k=knotP(s);for(const q of inp.taps||[])if(Math.abs(q.x-k[0])<=12&&Math.abs(q.y-k[1])<=12)cut=true;
      if(cut){s.tied=0;if(s.cutT<0)s.cutT=T;const g=pat(s.lp,V*T+16);s.dp={t:0,gx:g.x,gy:g.y,x:s.x,y:s.y};sfx("citymap_cut")}}
    else if(s.pull){const q=s.pull,u=Math.min(1,(q.t+=dt)/.8),p=pat(s.lp,V*T),e=E.inOut(u);s.x=lerp(q.x,p.x,e);s.y=lerp(q.y,p.y,e);s.mv=1;s.hx=p.x-q.x;s.hy=p.y-q.y;if(u>=1){s.pull=null;s.tied=1}}
    else{
      if(s.of){const o=s.of;let rt=!!inp.aTap;for(const q of inp.taps||[])if(Math.abs(q.x-o.x)<=11&&Math.abs(q.y-o.y)<=11)rt=true;
        if(rt){s.retied++;s.pull={t:0,x:s.x,y:s.y};s.of=null;s.sit=0;sfx("citymap_offer")}}
      if(!s.pull){
      if(s.sit>0)s.sit-=dt;
      else{let dx=inp.dx||0,dy=inp.dy||0;if(!dx&&!dy&&inp.down){dx=inp.down.x-s.x;dy=inp.down.y-s.y;if(Math.hypot(dx,dy)<3)dx=dy=0}
        const m=Math.min(1,Math.hypot(dx,dy));
        if(m>0){const[a,b]=nrm(dx,dy),d=16*s.w*(Math.sin(2.3*T)+Math.sin(1.7*T)),vx=a*SP*m-b*d,vy=b*SP*m+a*d;s.hx=a;s.hy=b;s.mv=1;s.w=Math.max(.1,s.w-.015*dt);
          let hit=0,ox=0,oy=0;const nx=s.x+vx*dt,ny=s.y+vy*dt;
          if(blk(s,nx,s.y,R)){if(Math.abs(vx)>hit){hit=Math.abs(vx);ox=-Math.sign(vx);oy=0}}else s.x=nx;
          if(blk(s,s.x,ny,R)){if(Math.abs(vy)>hit){hit=Math.abs(vy);ox=0;oy=-Math.sign(vy)}}else s.y=ny;
          if(hit>12){s.sit=.6;s.ls++;s.w=Math.max(.1,s.w*.7);sfx("citymap_stumble");if(!s.rm)pDust(s.fx,s.x,s.y,7);let f=null;
            for(let k=0;k<=18&&!f;k++)for(const sg of k?[1,-1]:[1]){const an=Math.atan2(oy,ox)+sg*k*PI/18,px=s.x+Math.cos(an)*30,py=s.y+Math.sin(an)*30;if(!blk(s,px,py,6)){f=[px,py];break}}
            if(f){s.of={x:f[0],y:f[1],t:0};sfx("citymap_offer")}}
          if(s.T-(s.tr.length?s.tr[s.tr.length-1].t:-1)>.1)s.tr.push({x:s.x,y:s.y,t:T})}}}
      s.lmp.forEach((p,i)=>{if(!s.lm[i]&&!s.pull&&Math.hypot(s.x-p[0],s.y-p[1])<=14){s.lm[i]=T;sfx("citymap_place");if(!s.rm)pSparks(s.fx,p[0],p[1],10,G,34);if(s.lm.every(Boolean))s.fin=T}})}
    return s.fin!=null&&T-s.fin>=.5?"win":null},
  draw(s,c,t){const T=s.T;scene(c,s,T);people(c,s,T);pDraw(c,s.fx,K)},
  bloom(s,c,k,t){const g=geo(),L=s.lmp,e=E.inOut(clamp(k/.5,0,1)),n=[6,10,16][(s._fl||1)-1],o=E.out(clamp((k-.3)/.6,0,1));scene(c,s,s.T);
    c.strokeStyle=G;c.lineWidth=1;c.globalAlpha=.8;c.beginPath();[1,2,3,4,0,1].forEach((i,j)=>{const p=L[i];j?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])});c.setLineDash([e*400,400]);c.stroke();c.setLineDash([]);
    c.globalAlpha=.4*o;c.lineWidth=.7;for(let i=0;i<n;i++){const a=i*2*PI/n+.3;c.beginPath();c.moveTo(96,88);c.lineTo(96+Math.cos(a)*220*o,88+Math.sin(a)*220*o);c.stroke()}c.globalAlpha=1;
    const q=clamp((k-.45)/.4,0,1);if(!mPiece(c,K,"compass",96,88,{ax:.5,ay:.5,a:q})){c.globalAlpha=q;c.fillStyle="#D9A93A";c.beginPath();for(let i=0;i<8;i++){const a=i*PI/4,r=i%2?8:26;c.lineTo(96+Math.sin(a)*r,88-Math.cos(a)*r)}c.fill();c.globalAlpha=1}
    const u=g.landmarks.university;glow(c,u[0],u[1],14,"#FFD890",.5*q);if(q>0)mSprO(c,k>.75?"kant_1":"kant_0",u[0]-8,u[1]-22,{a:q})},
  auto(s,inp){const T=s.T+s.ld;if(s.tied){if(T>=1)inp.bTap=true;return}if(s.pull)return;const A=geo().autoPath.map(q=>q[1]===176&&q[0]<=38?[q[0]<30?20:33,184]:q[0]===38?[33,q[1]]:q);
    if(Math.hypot(A[s.ai][0]-s.x,A[s.ai][1]-s.y)<1.5&&s.ai<A.length-1)s.ai++;const a=A[s.ai-1],b=A[s.ai],[ux,uy]=nrm(b[0]-a[0],b[1]-a[1]),t=Math.min(Math.hypot(b[0]-a[0],b[1]-a[1]),(s.x-a[0])*ux+(s.y-a[1])*uy+10),[dx,dy]=nrm(a[0]+ux*t-s.x,a[1]+uy*t-s.y);inp.dx=dx;inp.dy=dy}
};
}
})();
/* GAME:citymap:END */
/* GAME:poems:BEGIN */
(function(){
{
/* Color Comes Back (Mill). Helper: mPath (geometry only; its d never moves back, so the pen is tracked here). Art mill_s. */
const K="mill_s",TOL=12,LIM=40,WIN=.25,FELT=24,RUSH=56;
const SG=[[[24,40],[60,56],[96,44],[132,64],[168,80]],[[168,80],[140,120],[96,108],[52,132],[24,160]],[[24,160],[56,196],[96,180],[136,210],[168,236]]],GP=[[168,80],[24,160],[168,236]];
const V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
V("poems_brush",()=>aNoise(.32,{f:1700,to:2500,q:.7,v:.013,a:.14}));
V("poems_rush",()=>aNoise(.04,{f:5200,q:3,v:.014}));
V("poems_gear",()=>{aTone(AN(14),.7,{v:.04,a:.008});aNoise(.05,{f:900,q:2,v:.03})});
let MC,MX,QC,QX;
const cv=()=>{if(MC)return;const m=()=>{const e=document.createElement("canvas");e.width=384;e.height=640;const x=e.getContext("2d");x.setTransform(2,0,0,2,0,0);return[e,x]};[MC,MX]=m();[QC,QX]=m()};
const pp=(c,n,x,y,o)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];return r&&v&&mPerson(c,K,n,x,y,Object.assign({ax:v[0]/r[2],ay:v[1]/r[3]},o))};
const scene=c=>{if(mBg(c,K,0))return true;let g=c.createLinearGradient(0,0,0,40);g.addColorStop(0,"#5E7CB0");g.addColorStop(1,"#E0A878");c.fillStyle=g;c.fillRect(0,0,192,40);
  c.fillStyle="#4C8A3A";c.fillRect(0,22,192,20);c.fillStyle="#3E7430";c.fillRect(0,30,192,12);c.fillStyle="#5D8DB8";c.beginPath();c.ellipse(93,22,40,7,0,0,7);c.fill();
  c.fillStyle="#6A5A66";c.fillRect(0,40,192,280);for(let y=44;y<246;y+=34)for(let x=8;x<184;x+=30){c.fillStyle=(x+y)%3?"#9A5A3A":"#3A4A7A";c.fillRect(x,y,22,24)}return false};
const gp=(s,g)=>{let j=0;while(j<2&&g>s.off[j+1])j++;return s.P[j].at(g-s.off[j])};
function ini(s){cv();MX.clearRect(0,0,192,320);const P=SG.map(p=>mPath({pts:p,tol:TOL})),off=[0],cm=[],cw=[],cs=[],cn=[];
  P.forEach((p,j)=>{off.push(off[j]+p.len);const n=Math.round(p.len/4);cn.push(n);for(let i=0;i<n;i++){cw.push(p.len/n);cm.push(off[j]+(i+.5)*p.len/n);cs.push(j)}});
  Object.assign(s,{P,off,cm,cw,cs,cn,N:cm.length,L:off[3],cl:cm.map(()=>0),cj:[0,0,0],col:0,cov:0,rushLen:0,seg:0,pen:null,act:false,arr:false,h:[],pc:0,gt:[-1,-1,-1],rk:null,bl:0,bj:0,up:0,fin:0,sb:-9,sr:-9,T:0,dirty:1,qo:false,qn:0,bb:0})}
function stain(s,i){const p=gp(s,s.cm[i]),g=MX.createRadialGradient(p.x,p.y,0,p.x,p.y,24);g.addColorStop(0,"rgba(0,0,0,.4)");g.addColorStop(.6,"rgba(0,0,0,.2)");g.addColorStop(1,"rgba(0,0,0,0)");MX.fillStyle=g;MX.fillRect(p.x-24,p.y-24,48,48);s.dirty=1}
function pace(s,dt,dd){s.h.push([dt,dd]);let T=0,D=0;for(const q of s.h){T+=q[0];D+=q[1]}while(s.h.length>1&&T-s.h[0][0]>=WIN){T-=s.h[0][0];D-=s.h[0][1];s.h.shift()}return D/Math.max(T,dt)}
function sweep(s,a,b,dt){const lo=Math.min(a,b),hi=Math.max(a,b),p=s.pc=pace(s,dt,hi-lo),ok=p<=LIM+1e-6;
  for(let i=0;i<s.N;i++){const m=s.cm[i];if(m<lo||m>hi)continue;const q=s.cl[i];
    if(ok){if(q<2){s.cl[i]=2;s.cj[s.cs[i]]++;s.col++;stain(s,i)}}else if(q<1){s.cl[i]=1;s.rushLen+=s.cw[i]}}
  s.cov=s.col/s.N;if(hi>lo){if(ok){if(s.T-s.sb>.35){s.sb=s.T;sfx("poems_brush")}}else if(s.T-s.sr>.12){s.sr=s.T;sfx("poems_rush")}}}
function proj(P,x,y,lo,hi){let b=null;for(const q of P.seg){if(q.d0>hi||q.d0+q.l<lo)continue;const vx=q.b[0]-q.a[0],vy=q.b[1]-q.a[1],k=clamp(((x-q.a[0])*vx+(y-q.a[1])*vy)/(vx*vx+vy*vy||1),0,1),d=clamp(q.d0+k*q.l,lo,hi),p=P.at(d),e=Math.hypot(p.x-x,p.y-y);if(!b||e<b.e)b={d,e}}return b}
function finger(s,x,y,end){let b=null;for(let j=0;j<=Math.min(s.seg,2);j++){let lo=0,hi=s.P[j].len;if(s.act){lo=Math.max(0,s.pen-24-s.off[j]);hi=Math.min(hi,s.pen+24-s.off[j]);if(lo>hi)continue}
    const r=proj(s.P[j],x,y,lo,hi);if(r&&(!b||r.e<b.e))b={e:r.e,g:s.off[j]+r.d}}return b&&b.e<=TOL?Math.min(b.g,end):null}
function gate(s){const j=s.seg;if(s.cj[j]*100>=60*s.cn[j]){s.gt[j]=0;s.seg++;s.up=1.3;sfx("poems_gear");if(s.seg>2)s.fin=.9}else{s.rk=[j,0];s.bl=1.8;s.bj=j;sfx("poems_rush")}}
const rate=s=>(s.cov||0)>=.95&&(s.rushLen||0)<=12?3:(s.cov||0)>=.85?2:1;
function rod(c,a){c.save();c.lineCap=c.lineJoin="round";c.beginPath();c.moveTo(24,40);for(const g of GP)c.lineTo(g[0],g[1]);
  if(a>0){c.globalCompositeOperation="lighter";c.globalAlpha=a*.3;c.strokeStyle="#FFB050";c.lineWidth=9;c.stroke();c.globalCompositeOperation="source-over";c.globalAlpha=1}
  c.strokeStyle="#4A2E12";c.lineWidth=4;c.stroke();c.strokeStyle="#C98E3A";c.lineWidth=3;c.stroke();c.strokeStyle="#F2D08A";c.lineWidth=1;c.stroke();c.restore()}
function gear(s,c,i,t,fr,rot){const g=GP[i];if(s.gt[i]>=0)glow(c,g[0],g[1],24,"#F5C66A",.5);
  if(mPiece(c,K,"gear_"+fr,g[0],g[1],{ax:.5,ay:.5,rot,a:s.gt[i]>=0?1:.8}))return;
  c.save();c.translate(g[0],g[1]);c.rotate(rot+fr*.098);c.fillStyle="#B07A32";c.beginPath();c.arc(0,0,8,0,7);c.fill();for(let k=0;k<8;k++){c.rotate(.785);c.fillRect(-1.5,-10,3,4)}c.restore()}
function top(s,c,t,bl){rod(c,bl);const cur=s.seg<3?s.seg:-1;
  c.save();c.lineCap="round";s.P.forEach((P,j)=>P.drawGuide(c,j===cur||bl>0?"rgba(245,198,106,.9)":"rgba(245,198,106,.3)"));
  for(let i=0;i<s.N;i++){const q=s.cl[i];if(!q)continue;const p=gp(s,s.cm[i]),h=q===2?2:1.2;c.strokeStyle=q===2?"#F5C66A":"#8E8E9A";c.lineWidth=q===2?2.5:1.5;c.beginPath();c.moveTo(p.x-p.tx*h,p.y-p.ty*h);c.lineTo(p.x+p.tx*h,p.y+p.ty*h);c.stroke();
    if(s.bl>0&&q<2&&s.cs[i]===s.bj){c.strokeStyle="rgba(255,255,255,"+(s.rm?.5:.35+.35*Math.sin(t/160))+")";c.lineWidth=1.5;c.stroke()}}
  c.restore();if(bl>0)for(const j of [0,1,2])for(let d=0;d<=s.P[j].len;d+=18){const p=s.P[j].at(d);glow(c,p.x,p.y,7,"#F5C66A",bl*.45)}
  if(!mPiece(c,K,"book",24,40,{ax:.5,ay:.5})){c.fillStyle="#E8DCC0";c.fillRect(14,34,20,12)}
  mShadow(c,20,62,10);if(!pp(c,s.up>0||s.fin>0||bl>0?"mill_up":"mill_read",20,62)){c.fillStyle="#5A4A6A";c.fillRect(16,50,8,12);c.fillStyle="#E0B890";c.beginPath();c.arc(20,47,3.5,0,7);c.fill()}
  for(let i=0;i<3;i++){const g=s.gt[i],tn=g>=0,r=s.rk&&s.rk[0]===i&&s.rk[1]<.45&&!s.rm?Math.sin(s.rk[1]*26)*.2*(1-s.rk[1]/.45):0;
    gear(s,c,i,t,tn&&!s.rm?Math.floor(bl>0?t/70:g<1.2?g*20:24+(g-1.2)*5)%8:0,r)}}
MINI.poems={who:"mill",land:"l4",title:"Color Comes Back",short:true,art:K,stages:["Color Comes Back"],
  setup:["At twenty, after years of nothing but study, everything went grey for me.","Arguments couldn’t fix it. Wordsworth’s poems began to."],
  how:"Trace the gold line slowly. Rush it, and the color won’t come.",
  win:"The gears still turn, and the hills have their color back. I needed both.",
  walk:"Keep the book. Read a little each day.",
  lines:[null],pad:true,ab:false,bloomT:2,limit:90,
  fl:["The gears turn again.","Most of the hills have their color.","Every hill in color, and no line rushed."],
  flNext:["Go back over grey stretches slowly.","Take the whole line at a felt pace, first time through."],
  rate,
  shotReady:s=>s.seg===1&&s.pen>s.off[1]+90,
  release(){MC=MX=QC=QX=null},
  init(s){ini(s);s.st=0;s.stT=0},
  step(s,dt,inp){s.T+=dt;s.stT+=dt;s.up=Math.max(0,s.up-dt);s.bl=Math.max(0,s.bl-dt);if(s.rk)s.rk[1]+=dt;s.gt=s.gt.map(g=>g>=0?g+dt:g);
    if(s.fin>0){s.fin-=dt;return s.fin<=0?"win":null}
    const end=s.off[Math.min(s.seg,2)+1],f=inp.down;let np=null;
    if(f){const g=finger(s,f.x,f.y,end);if(g==null)s.act=false;else if(!s.act){s.pen=g;s.act=true;s.h=[]}else np=g}
    else{const bk=inp.dx<-.3,fw=!bk&&(inp.dx>.3||Math.abs(inp.dy)>.3);if(bk||fw){if(!s.act)s.h=[];s.act=true;np=clamp((s.pen||0)+(inp.a?RUSH:FELT)*dt*(bk?-1:1),0,end)}else s.act=false}
    if(np!=null){sweep(s,s.pen==null?0:s.pen,np,dt);s.pen=np}
    if(s.pen!=null){if(s.pen>=end-.01){if(!s.arr){s.arr=true;gate(s)}}else if(s.pen<end-3)s.arr=false}
    return null},
  draw(s,c,t){cv();scene(c);gradeN(c,"grey",.9);grade(c,"#101018",.3);
    if(s.dirty||(!s.qo&&++s.qn%20===0)){s.dirty=0;QX.clearRect(0,0,192,320);QX.globalCompositeOperation="source-over";QX.drawImage(MC,0,0,192,320);QX.globalCompositeOperation="source-in";s.qo=scene(QX);QX.globalCompositeOperation="source-over"}
    c.drawImage(QC,0,0,192,320);top(s,c,t,0);
    if(s.pen!=null&&s.seg<3){const p=gp(s,s.pen),ok=!s.act||s.pc<=LIM+1e-6;glow(c,p.x,p.y,10,ok?"#FFE9B8":"#9A9AA6",.5);c.fillStyle=ok?"#FFF4C8":"#8E8E9A";if(ok){c.beginPath();c.arc(p.x,p.y,2.2,0,7);c.fill()}else c.fillRect(p.x-3,p.y-.7,6,1.4)}},
  bloom(s,c,k,t){cv();if(!s.P)ini(s);const n=rate(s),e=E.out(clamp(k/.8,0,1)),R=[95,120,150][n-1]*e;scene(c);gradeN(c,"grey",.9);grade(c,"#101018",.3);
    QX.clearRect(0,0,192,320);QX.globalCompositeOperation="source-over";QX.drawImage(MC,0,0,192,320);
    for(let d=0;d<=s.L;d+=24){const p=gp(s,d),g=QX.createRadialGradient(p.x,p.y,0,p.x,p.y,R+1);g.addColorStop(0,"rgba(0,0,0,1)");g.addColorStop(.65,"rgba(0,0,0,.85)");g.addColorStop(1,"rgba(0,0,0,0)");QX.fillStyle=g;QX.fillRect(p.x-R-1,p.y-R-1,2*R+2,2*R+2)}
    QX.globalCompositeOperation="source-in";scene(QX);QX.globalCompositeOperation="source-over";c.drawImage(QC,0,0,192,320);
    const nf=[8,14,20][n-1];for(let i=0;i<nf;i++){const p=gp(s,(i+.5)/nf*s.L),sg=i%2?7:-7,q=E.back(clamp((k-.2-.6*i/nf)/.2,0,1)),x=p.x-p.ty*sg,y=p.y+p.tx*sg;
      if(q>0&&!mPiece(c,K,"flowers",x,y,{ax:.5,ay:1,sc:q})){c.fillStyle="#F5D040";c.beginPath();c.arc(x,y-3,2.5*q,0,7);c.fill()}}
    const sg=Object.assign({},s,{gt:[1+k*3,1+k*3,1+k*3],rk:null,bl:0,up:1,fin:0,seg:3});top(sg,c,s.rm?0:t,e)},
  auto(s,inp){if(!s.fin)inp.dx=1}
};
}
})();
/* GAME:poems:END */
/* GAME:petition:BEGIN */
(function(){
{
/* The Lamplighter's Round (Mill). Helper: none (node taps). */
const K="mill_s",OIL=10,D0=27,SP=48,BEST=[27,22,23,24,19,18,17,22,21,20,15],OLD=[27,22,17,12,13,14,13,12,11,10,5];
const V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
V("petition_plan",()=>aNoise(.03,{f:3000,q:2,v:.03}));
V("petition_dry",()=>aTone(AN(-8),.16,{type:"triangle",v:.045,lp:700,to:AN(-12)}));
V("petition_look",()=>aNoise(.07,{f:260,q:2,v:.05,a:.01}));
V("petition_lamp",()=>{aTone(AN(-10),.4,{v:.05,a:.05,to:AN(-3)});aNoise(.25,{f:600,to:1400,v:.02,a:.06})});
const ST=[],SM=new Map;
for(let r=0;r<6;r++)for(let c=0;c<5;c++){const e=r*5+c,ed=(a,b,n,dk,h,tw)=>{SM.set(a*30+b,ST.length);ST.push({a,b,n,dk,h,tw})};
  if(c<4)ed(e,e+1,r===2?[1,2,2,1][c]:r===4?[4,3,3,4][c]:1,r===4,1,r===2);
  if(r<5){const o=c===0||c===4;ed(e,e+5,c===2?[1,2,2,2,2][r]:o&&r>1&&r<4?[0,0,3,4][r]:1,o&&r>1&&r<4,0,c===2)}}
const sid=(a,b)=>SM.get(Math.min(a,b)*30+Math.max(a,b));
const plan=rt=>{const u=new Set;for(let i=1;i<rt.length;i++)u.add(sid(rt[i-1],rt[i]));let t=0;u.forEach(i=>t+=ST[i].n);return t};
const pc=(c,n,x,y,o)=>mPiece(c,K,n,x,y,Object.assign({ax:.5,ay:1},o)),bx=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x-w/2,y-h,w,h)};
const pp=(c,n,x,y,o)=>mPerson(c,K,n,x,y,Object.assign({ax:.5,ay:1},o));
function ini(s){const A=MINI_ART[K],nd=A&&A.nodes&&A.nodes.length===30?A.nodes:[];if(!nd.length)for(const y of [100,128,156,184,212,240])for(const x of [24,60,96,132,168])nd.push([x,y]);
  const pm=ST.map(q=>[(nd[q.a][0]+nd[q.b][0])/2,(nd[q.a][1]+nd[q.b][1])/2]);
  Object.assign(s,{st:0,stT:0,T:0,nd,pm,rt:[D0],sn:ST.map(()=>0),ls:ST.map(()=>0),ph:0,wd:0,wl:0,lit:0,dry:0,fin:0,pd:[0,0]})}
const undo=s=>{if(s.rt.length>1){s.rt.pop();sfx("petition_plan")}};
function look(s,n){ST.forEach((q,i)=>{if(q.dk&&!s.sn[i]&&(q.a===n||q.b===n)){s.sn[i]=1;sfx("petition_look")}})}
function add(s,n){const e=s.rt[s.rt.length-1];if(sid(e,n)==null)return;if(s.rt.length>OIL){s.dry=1.3;sfx("petition_dry");return}s.rt.push(n);sfx("petition_plan");look(s,n)}
function pick(s,p){let b=null,bd=1e9;const t=(k,i,x,y)=>{if(Math.abs(p.x-x)<=11&&Math.abs(p.y-y)<=11){const d=Math.hypot(p.x-x,p.y-y);if(d<bd){bd=d;b={k,i}}}};
  s.nd.forEach((q,i)=>t(0,i,q[0],q[1]));ST.forEach((q,i)=>{if(q.dk&&!s.sn[i])t(1,i,s.pm[i][0],s.pm[i][1])});return b}
function light(s,i){if(s.ls[i])return;s.ls[i]=1;s.lit+=ST[i].n;s.sn[i]=1;s.lg=s.T;sfx("petition_lamp")}
const pl=(c,nd,r)=>r.forEach((n,i)=>i?c.lineTo(nd[n][0],nd[n][1]):c.moveTo(nd[n][0],nd[n][1]));
function dot(s,q,i,k){const a=s.nd[q.a],b=s.nd[q.b],t=(k+1)/(q.n+1),m=q.h?[0,3]:[-3,0];return [a[0]+(b[0]-a[0])*t+m[0],a[1]+(b[1]-a[1])*t+m[1]]}
function town(s,c,t,B){const nd=s.nd,rm=s.rm;c.save();c.lineCap="round";c.lineJoin="round";
  ST.forEach((q,i)=>{const a=nd[q.a],b=nd[q.b];c.strokeStyle=s.ls[i]?"rgba(255,210,122,.75)":"rgba(160,150,190,.3)";c.lineWidth=s.ls[i]?2:1.5;c.setLineDash(q.dk&&!s.sn[i]?[2,2]:[]);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke()});
  c.setLineDash([]);if(!s.ph){c.strokeStyle="rgba(255,233,184,.4)";c.lineWidth=1;c.setLineDash([3,3]);c.beginPath();pl(c,nd,OLD);c.stroke();c.setLineDash([])}
  if(s.rt.length>1&&!B){c.strokeStyle="rgba(245,198,106,.35)";c.lineWidth=5;c.beginPath();pl(c,nd,s.rt);c.stroke();c.strokeStyle="#F5C66A";c.lineWidth=2;c.stroke()}
  c.restore();
  ST.forEach((q,i)=>{const m=s.pm[i],L=s.ls[i],hx=m[0]+(q.h?0:8),hy=m[1]+(q.h?-3:9),lx=m[0]+(q.h?9:-6),ly=m[1]+(q.h?7:6);
    if(L)glow(c,m[0],m[1],B&&q.dk&&B>2?22:14,"#FFD27A",.28);
    const hs=q.tw||q.dk;if(hs)(q.tw?pc(c,L?"town_lit":"town_dark",hx,hy):pc(c,L?"cottage_lit":"cottage_dark",hx,hy))||bx(c,hx,hy,10,q.tw?20:12,L?"#B8762E":"#3A3A5A");
    pc(c,L?"lamp_on":"lamp_off",lx,ly)||bx(c,lx,ly,2,12,L?"#FFE9A8":"#5A5A6A");
    if(L&&hs){c.fillStyle="#FFE9A8";c.globalAlpha=rm?.9:.75+.25*Math.sin(t/200+i);for(let k=0;k<Math.min(q.n,4);k++)c.fillRect(hx-5+k*2.5,hy-(q.tw?12:7),2,4);c.globalAlpha=1}
    if(!q.dk||s.sn[i])for(let k=0;k<q.n;k++){const p=dot(s,q,i,k);c.fillStyle=L?"#FFD36A":"#A09080";c.fillRect(p[0]-1,p[1]-1,2,2)}
    else{c.strokeStyle="rgba(255,233,184,.5)";c.lineWidth=1;c.setLineDash([1.5,1.5]);c.beginPath();c.arc(m[0],m[1],5,0,7);c.stroke();c.setLineDash([])}})}
function drop(c,x,y,on){c.fillStyle=on?"#F5C66A":"rgba(80,70,90,.8)";c.beginPath();c.arc(x,y+1.5,2,0,7);c.moveTo(x-1.8,y+1);c.lineTo(x,y-3);c.lineTo(x+1.8,y+1);c.fill()}
function hud(s,c,t){const us=s.rt.length-1;c.fillStyle="rgba(16,11,21,.55)";c.fillRect(22,15,62,13);for(let i=0;i<OIL;i++)drop(c,26+5.6*i,22,i>=us);
  const tip=s.dry>0?-.6:0;pc(c,"oilcan",12,30,{rot:tip})||bx(c,12,28,12,10,"#9A7A3A");
  c.fillStyle="rgba(16,11,21,.6)";c.fillRect(80,6,38,17);c.fillStyle="#FFE9B8";c.beginPath();c.arc(88,11,2.2,0,7);c.fill();c.fillRect(85.5,13.5,5,6);mText(c,String(s.ph?s.lit:plan(s.rt)),104,15,10,"#FFE9B8");
  c.fillStyle=us&&!s.ph?"rgba(110,74,20,.85)":"rgba(16,11,21,.65)";c.fillRect(159,5,26,26);
  if(us&&!s.ph)glow(c,172,18,16,"#FFD27A",s.rm?.4:.3+.15*Math.sin(t/250));pc(c,us?"lamp_on":"lamp_off",172,25,{})||bx(c,172,25,2,12,"#FFE9A8")}
function back(c){if(!mBg(c,K,0)){c.fillStyle="#232C4A";c.fillRect(0,0,192,320)}grade(c,"#16213C",.45)}
const leg=(s,i)=>Math.hypot(s.nd[s.rt[i]][0]-s.nd[s.rt[i-1]][0],s.nd[s.rt[i]][1]-s.nd[s.rt[i-1]][1]);
function walker(s){let d=s.wd;for(let i=1;i<s.rt.length;i++){const a=s.nd[s.rt[i-1]],b=s.nd[s.rt[i]],l=leg(s,i);if(d<=l||i===s.rt.length-1){const k=Math.min(1,d/l);return[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,b[0]<a[0]]}d-=l}}
function paper(c,k){const cx=96,e=E.out(k);c.save();c.beginPath();c.rect(cx-60*e,30,120*e,60);c.clip();
  pc(c,"scroll",cx,86.5,{sc:2})||bx(c,cx,76,100,30,"#EAD9AE");c.restore()}
const rate=s=>s.lit>=26?3:s.lit>=23?2:1;
MINI.petition={who:"mill",land:"l4",title:"The Lamplighter’s Round",short:true,art:K,stages:["One Night’s Oil"],
  setup:["The old lamplighters lit the grand streets. The back lanes waited in the dark.","You have oil for one night. Each person counts for one, and no one for more."],
  how:"Tap the next corner to plan your round. Tap the lamp to light it.",
  win:"Every lit window counted the same. Widen who counts, and the sum grows.",
  walk:"Keep the oil can. There’s always another night to light.",
  lines:[null],pad:true,ab:true,bloomT:2.2,limit:60,
  fl:["One night’s round, lit.","Far more light than the old round.","Nearly every person the oil could reach."],
  flNext:["Look down the dark lanes. People live there too.","Every person counts the same. Plan for the most of them."],
  rate,_t:{ST,OLD,BEST,D0,OIL,plan},
  shotReady:s=>s.ph===1&&s.wd>150,
  init(s){ini(s)},
  step(s,dt,inp){s.T+=dt;s.stT+=dt;s.dry=Math.max(0,s.dry-dt);
    if(s.ph===2){s.fin-=dt;return s.fin<=0?"win":null}
    if(s.ph===1){s.wd+=SP*dt;let d=0;for(let i=1;i<s.rt.length;i++){const l=leg(s,i);if(s.wd>=d+l/2)light(s,sid(s.rt[i-1],s.rt[i]));d+=l}
      if(s.wd>=s.wl){s.ph=2;s.fin=.8}return null}
    let go=inp.aTap;
    for(const p of inp.taps||[]){if(Math.abs(p.x-172)<=13&&Math.abs(p.y-18)<=13){go=1;continue}const h=pick(s,p);if(!h)continue;
      if(h.k){s.sn[h.i]=1;sfx("petition_look")}else if(h.i===D0&&s.rt.length>1){s.rt=[D0];sfx("petition_plan")}else if(h.i===s.rt[s.rt.length-1])undo(s);else add(s,h.i)}
    const dx=inp.dx<-.5?-1:inp.dx>.5?1:0,dy=inp.dy<-.5?-1:inp.dy>.5?1:0,e=s.rt[s.rt.length-1],c=e%5,r=(e/5)|0,mv=(x,y)=>{if(c+x>=0&&c+x<5&&r+y>=0&&r+y<6)add(s,(r+y)*5+c+x)};
    if(inp.lTap||dx<0&&s.pd[0]>=0)mv(-1,0);else if(inp.rTap||dx>0&&s.pd[0]<=0)mv(1,0);else if(inp.uTap||dy<0&&s.pd[1]>=0)mv(0,-1);else if(inp.dTap||dy>0&&s.pd[1]<=0)mv(0,1);
    s.pd=[dx,dy];if(inp.bTap)undo(s);
    if(go&&s.rt.length>1){s.ph=1;s.wd=0;s.wl=0;for(let i=1;i<s.rt.length;i++)s.wl+=leg(s,i)}
    return null},
  draw(s,c,t){back(c);town(s,c,t,0);const ph=s.ph;mShadow(c,84,248,10);pp(c,"mill_stand",84,248)||bx(c,84,248,8,12,"#5A4A6A");pc(c,"oilcan",108,250,{});
    if(!ph){const e=s.rt[s.rt.length-1];c.strokeStyle="rgba(245,198,106,.55)";s.nd.forEach((p,n)=>{if(sid(e,n)!=null){c.beginPath();c.arc(p[0],p[1],3.5,0,7);c.stroke()}else if(n===e&&e!==D0)glow(c,p[0],p[1],9,"#F5C66A",.6)})}
    const w=ph===1?walker(s):s.nd[ph===2?s.rt[s.rt.length-1]:D0].concat(false),lt=s.T-s.lg<.35,fr=lt?"lamp_light":"lamp_walk_"+(ph===1?Math.floor(s.T*6)%2:0);
    mShadow(c,w[0],w[1],10);pp(c,fr,w[0],w[1],{flip:w[2]})||bx(c,w[0],w[1],6,12,"#2A2438");hud(s,c,t)},
  bloom(s,c,k,t){if(!s.nd)ini(s);back(c);const n=rate(s),pe=[];ST.forEach((q,i)=>{if(s.ls[i])for(let j=0;j<q.n;j++)pe.push(dot(s,q,i,j))});
    town(s,c,t,n);paper(c,Math.min(1,k/.3));
    pe.forEach((p,i)=>{const sx=54+(i%8)*12,sy=48+Math.floor(i/8%5)*7,u=clamp((k-.25-.55*i/pe.length)/.2,0,1);if(u<=0)return;
      if(u>=1){c.strokeStyle="#96641A";c.lineWidth=1;c.beginPath();c.moveTo(sx-4,sy);for(let j=1;j<=8;j++)c.lineTo(sx-4+j,sy+Math.sin(j*1.7+i)*1.6);c.stroke()}else{const x=lerp(p[0],sx,u),y=lerp(p[1],sy,u)-24*Math.sin(u*Math.PI);glow(c,x,y,5,"#F5C66A",.8);c.fillStyle="#FFE9B8";c.fillRect(x-1,y-1,2,2)}})},
  auto(s,inp){if(s.ph||s.T-s.aL<.25)return;s.aL=s.T;if(s.rt.length<BEST.length){const p=s.nd[BEST[s.rt.length]];inp.taps=[{x:p[0],y:p[1]}]}else inp.taps=[{x:172,y:18}]}
};
}
})();
/* GAME:petition:END */
/* GAME:different:BEGIN */
(function(){
/* Two Voices (Gilligan, short). Helper: mDrag. */
{
const K="gilligan_s",GO="#F5C66A",RY=[175.5,154,131.5,109.5,87.5,65.5],SX=[99,113,127,141],H=[5,5,4,6,4,6,5,5],SH=[0,1,0,1,1,0,1,0],TY=258,DL=[77.5,114.5],
TF=[[16,116,0],[16,152,0],[178,116,1],[178,152,1]],CD=["#100B15","#E0A24A","#C07A32"];
const ci=(c,x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,7);c.fill()},el=(c,y,rx,ry,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(96,y,rx,ry,0,0,7);c.fill()};
const V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
V("different_open",()=>{aNoise(.25,{f:900,to:2200,q:2,v:.03,a:.05});aTone(AN(7),.18,{v:.03,at:.08})});
V("different_place",()=>{aTone(AN(12),.6,{v:.07});aTone(AN(19),.8,{v:.04,at:.08})});
V("different_back",()=>{aNoise(.28,{f:500,to:200,v:.04});aTone(AN(-12),.25,{v:.04,lp:500,to:AN(-17)})});
V("different_pointer",()=>aTone(AN(10),.05,{type:"square",v:.02,lp:2400}));
const pp=(c,n,x,y,o)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];return r&&v&&mPerson(c,K,n,x,y,Object.assign({ax:v[0]/r[2],ay:v[1]/r[3]},o))};
const fig=(c,n,x,y,o)=>{if(!pp(c,n,x,y,o)){c.fillStyle="#6A5A8A";c.fillRect(x-4,y-14,8,14)}};
const back=c=>{if(!mBg(c,K,0)){c.fillStyle="#2A2640";c.fillRect(0,0,192,320)}grade(c,"#2A3F6A",.3)};
const meas=(c,a)=>{c.save();c.globalAlpha*=a;if(!mPiece(c,K,"measure",61,43)){c.fillStyle="#A8742E";c.fillRect(84,43,41,156);ci(c,DL[0],DL[1],14,"#E8DCB8")}
  RY.forEach((y,i)=>mText(c,i+1,55,y,8,"#FFE9B8"));c.restore()};
const tk=(c,t,x,y,sc,dim)=>{const n=t.sh?"tok_round":"tok_square",o={ax:.5,ay:.5,sc,sm:1};
  if(!mPiece(c,K,n,x,y,o)){c.fillStyle="#C89A4A";t.sh?ci(c,x,y,9*sc,"#B0793A"):c.fillRect(x-9*sc,y-9*sc,18*sc,18*sc)}
  if(dim>0&&!mCanvas(c,mTint(K,n,"#7C7C88",.85),x,y,Object.assign({a:dim},o))){c.save();c.globalAlpha=dim*.6;c.fillStyle="#7C7C88";c.fillRect(x-8*sc,y-8*sc,16*sc,16*sc);c.restore()}};
const link=(c,x,y,sh,u)=>{c.save();c.translate(x,y);c.scale(u,u);ci(c,0,0,sh?5.5:7,CD[0]);ci(c,0,0,sh?4:6,GO);
  if(sh)ci(c,0,0,1.6,CD[0]);else{c.strokeStyle=CD[0];c.lineWidth=2;c.setLineDash([2,2]);c.beginPath();c.arc(0,0,4.5,0,7);c.stroke();ci(c,0,0,1.5,CD[0])}c.restore()};
const chain=(c,t,k)=>{const n=t.v,xs=i=>96+(i-(n-1)/2)*17;c.fillStyle="rgba(16,11,21,.72)";c.fillRect(20,TY-10,152,20);c.fillStyle=GO;
  for(let i=1;i<n;i++)if(k*n>i)c.fillRect(xs(i-1),TY-.5,xs(i)-xs(i-1),1.5);for(let i=0;i<n;i++){const u=clamp(k*n-i,0,1);if(u>0)link(c,xs(i),TY,t.sh,u)}};
const ptr=(c,y)=>{c.save();c.strokeStyle=CD[0];c.lineWidth=3;c.beginPath();c.moveTo(DL[0],DL[1]);c.lineTo(100,y);c.stroke();c.strokeStyle=CD[1];c.lineWidth=1.5;c.stroke();ci(c,DL[0],DL[1],2.2,CD[1]);c.restore()};
const bub=(c,x,y)=>{c.fillStyle=CD[0];c.fillRect(x-9,y-8,18,15);c.fillStyle="#EAD9B4";c.fillRect(x-8,y-7,16,13);c.strokeStyle="#7A5A2A";c.lineWidth=1.5;c.beginPath();c.moveTo(x,y+4);c.lineTo(x,y-1);c.lineTo(x-4,y-5);c.moveTo(x,y-1);c.lineTo(x+4,y-5);c.stroke()};
const open=(s,p)=>{if(p.op>=0)return;p.op=0;p.ch=Array(p.v).fill(p.sh?"k":"g");sfx("different_open")};
const slide=(s,p,snd)=>{s.sl={p,x:p.x,y:p.y,t:0};s.ph="slide";s.D.pieces=[];s.kh=0;if(snd)sfx("different_back")};
const drop=(s,p,sp)=>{const D=s.D;
  if(!sp){if(!s.kh&&s.mx<5)open(s,p);return slide(s,p,0)}
  if(p.op<0&&!p.un){p.un=1;s.unopened++}
  if(sp.rg!==p.v){s.mis++;return slide(s,p,1)}
  p.pl=1;D.spots=D.spots.filter(q=>q!==sp);D.pieces=[];s.kh=0;s.pc++;s.cur=null;s.ph="gap";s.g=0;sfx("different_place");pSparks(s.P,sp.x,sp.y,10,GO,30);
  for(let i=0;i<p.v;i++)s.lk.push({x:96+(i-(p.v-1)/2)*17,y:TY,tx:sp.x,ty:sp.y,i,t:0})};
MINI.different={who:"gilligan",land:"l4",title:"Two Voices",short:true,art:K,stages:["Two Voices"],
  setup:["This old Measure was built mostly from studying boys and men.","Gilligan’s research found it misheard a different voice as a lesser one. Let’s listen properly."],
  how:"Tap an answer to open it. Drag it to the rung its reasoning reaches.",
  win:"Two voices, side by side, equally serious. That’s what her research asked us to hear.",
  walk:"Leave the Measure for now. Keep listening as you go.",
  lines:[null],pad:false,ab:false,bloomT:2.2,limit:90,
  fl:["Every answer placed.","The Measure rarely fooled you.","Every answer heard before it was placed."],
  flNext:["Open each answer and count its links.","Listen to every answer, even when the Measure seems right."],
  rate:s=>s.mis===0&&s.unopened===0?3:s.mis<=1?2:1,
  shotReady:s=>s.pc>=3&&s.ph==="tray"&&s.cur&&s.cur.op>=.4,
  init(s){Object.assign(s,{st:0,stT:0,T:0,q:0,pc:0,ph:"gap",g:.4,mis:0,unopened:0,read:0,py:190,ty:190,hl:0,kb:0,kh:0,P:pfx(),lk:[],sl:null,cur:null,au:null,mx:0,p0:null});
    s.tk=H.map((v,i)=>({id:i,i,v,sh:SH[i],x:96,y:292,x0:96,y0:292,w:22,h:22,op:-1}));
    s.D=mDrag({pieces:[],spots:RY.flatMap((y,r)=>SX.map((x,j)=>({id:r*4+j,x,y,r:14,rg:r+1}))),onDrop:(p,sp)=>drop(s,p,sp),back:false,snap:true})},
  step(s,dt,inp){const D=s.D,f=inp.down;s.T+=dt;s.stT+=dt;pStep(s.P,dt,s.rm);s.py+=(s.ty-s.py)*(s.rm?1:Math.min(1,dt*9));
    s.lk=s.lk.filter(q=>(q.t+=dt)<.8);s.tk.forEach(p=>{if(p.op>=0)p.op+=dt});
    if(s.ph==="gap"){s.g+=dt;if(s.g>=.8){if(s.q>=8)return"win";s.cur=s.tk[s.q++];s.cur.f=0;s.ph="fly"}return null}
    const p=s.cur;
    if(s.ph==="fly"){const k=Math.min(1,(p.f+=dt)/.6);p.x=lerp(p.i%2?176:16,96,E.out(k));p.y=lerp(133,292,k)-Math.sin(Math.PI*k)*24;
      if(k>=1){p.x=96;p.y=292;s.ph="tray";D.pieces=[p];s.read=p.sh?2:p.v;s.ty=RY[s.read-1];sfx("different_pointer")}return null}
    if(s.ph==="slide"){const q=s.sl,k=Math.min(1,(q.t+=dt)/.4);p.x=lerp(q.x,96,E.out(k));p.y=lerp(q.y,292,E.out(k));if(k>=1){s.ph="tray";D.pieces=[p]}return null}
    if(inp.uTap||inp.dTap||inp.aTap||inp.bTap)s.kb=1;if(inp.uTap)s.hl=Math.min(5,s.hl+1);if(inp.dTap)s.hl=Math.max(0,s.hl-1);
    let kd=0;if(inp.aTap&&!f){if(!D.held){if(p.op<0)open(s,p);else{D.held=p;D.touch=false;s.kh=1}}else if(s.kh)kd=1}
    if(inp.bTap&&s.kh&&D.held){D.held=null;slide(s,p,0);return null}
    if(s.kh&&D.held){const sp=D.spots.find(q=>q.rg===s.hl+1);p.x=sp?sp.x:96;p.y=sp?sp.y:RY[s.hl]}
    const was=D.held;D.step(dt,Object.assign({},inp,{dx:0,dy:0,aTap:!!kd}));
    if(!was&&D.held){s.kh=0;s.p0=f&&{x:f.x,y:f.y};s.mx=0}if(D.held&&f&&s.p0)s.mx=Math.max(s.mx,Math.hypot(f.x-s.p0.x,f.y-s.p0.y));return null},
  draw(s,c,t){const D=s.D,p=s.cur,rm=s.rm,hd=D.held&&p;back(c);
    TF.forEach(([x,y,fl],i)=>fig(c,"tf"+i+"_talk_"+(rm?0:(Math.floor(t/700)+i)%2),x,y,{flip:!!fl}));
    bub(c,16,86+(rm?0:Math.sin(t/500)));bub(c,176,86+(rm?0:Math.cos(t/500)));
    meas(c,1);ptr(c,s.py);
    if(s.kb&&s.ph==="tray"){c.strokeStyle=GO;c.lineWidth=1;c.strokeRect(59.5,RY[s.hl]-8.5,72,17)}
    if(hd)D.spots.forEach(q=>{c.strokeStyle=q===D.over?GO:"rgba(255,233,184,.3)";c.strokeRect(q.x-7.5,q.y-7.5,15,15)});
    for(const q of s.tk)if(q.pl)tk(c,q,q.x,q.y,.64,0);
    for(const q of s.lk){const u=clamp((q.t-q.i*.07)/.5,0,1);if(u>0&&u<1){c.fillStyle=GO;c.fillRect(lerp(q.x,q.tx,E.inOut(u))-1,lerp(q.y,q.ty,E.inOut(u))-1,2,2)}}
    el(c,295,30,9,CD[0]);el(c,293,28,8,"#B8803A");el(c,293,24,6,"#6B4A24");
    if(p&&s.ph!=="gap"){if(p.op>=0&&s.ph!=="fly")chain(c,p,clamp(p.op/.5,0,1));
      if(p.op<0&&s.ph==="tray"&&!hd){c.strokeStyle=GO;c.globalAlpha=rm?.7:.4+.3*Math.sin(t/200);c.beginPath();c.arc(96,292,16,0,7);c.stroke();c.globalAlpha=1}
      if(hd)mShadow(c,p.x,p.y+11,14,.4);tk(c,p,p.x,p.y,hd?1.15:1,p.sh&&s.ph!=="fly"?(p.op<0?1:clamp(1-p.op/.5,0,1)):0)}
    fig(c,"wv_stand",170,228);pDraw(c,s.P,K)},
  bloom(s,c,k,t){const q=(a,b)=>clamp((k-a)/(b-a),0,1),m=1-q(0,.3),sw=E.inOut(q(.15,.5)),br=E.inOut(q(.5,.85)),wa=q(.5,.9),bk=E.out(q(.6,1));back(c);
    if(m>0)meas(c,m);
    if(sw<1)RY.forEach(y=>{c.save();c.globalAlpha=1-sw;c.translate(94,y);c.rotate(-sw*1.57+Math.sin(k*40)*.05*(1-sw));c.fillStyle="#E0A24A";c.fillRect(0,-1.5,24,3);c.restore()});
    const st=(s.tk||[]).map(p=>{const a=p.pl?[p.x,p.y]:[SX[0],RY[p.v-1]],tx=p.sh?120:72;return [p,lerp(a[0],tx,sw),lerp(a[1],RY[p.v-1],sw)]});
    for(const o of [[CD[1],-24],[CD[2],24]]){c.strokeStyle=CD[0];c.lineWidth=4;c.beginPath();for(let y=52;y<=132;y+=3)c[y>52?"lineTo":"moveTo"](96+lerp(o[1],0,br)+(br*3.5*Math.sin(y/5))*(o[1]<0?1:-1),y);c.globalAlpha=sw;c.stroke();c.strokeStyle=o[0];c.lineWidth=2;c.stroke();c.globalAlpha=1}
    c.globalAlpha=1-br;for(const [p,x,y] of st)tk(c,p,x,y,.64,0);c.globalAlpha=1;
    glow(c,96,96,56,"#FFE3A0",.2*br);
    fig(c,"wv_stand",170,228,{a:1-wa});
    fig(c,"wv_book",96,176,{a:wa});if(!mPiece(c,K,"book",99,152-bk*6,{ax:.5,ay:1,a:wa})){c.fillStyle="#2A3F7A";c.fillRect(88,132,20,18)}},
  auto(s,inp){const p=s.cur,D=s.D;if(s.ph!=="tray"||!p)return;const a=s.au||(s.au={i:-1,m:0,t:0,p:s.T}),d=Math.min(.06,s.T-a.p)||.05;a.p=s.T;
    if(a.i!==p.i){a.i=p.i;a.m=0;a.t=s.T}
    if(a.m===0&&s.T-a.t>=.25){inp.down={x:p.x,y:p.y};a.m=1}
    else if(a.m===1){a.m=2;a.t=s.T}
    else if(a.m===2&&s.T-a.t>=.5&&p.op>=0){a.f={x:p.x,y:p.y};a.m=3;inp.down={x:p.x,y:p.y}}
    else if(a.m===4){a.m=2;a.t=s.T-1}
    else if(a.m===3){const sp=D.spots.find(q=>q.rg===p.v),f=a.f,dx=sp.x-f.x,dy=sp.y-f.y,L=Math.hypot(dx,dy),mv=160*d;
      if(!D.held){a.m=0;a.t=s.T;return}if(L<=mv){f.x=sp.x;f.y=sp.y;a.m=4}else{f.x+=dx/L*mv;f.y+=dy/L*mv}inp.down={x:f.x,y:f.y}}}
};
}
})();
/* GAME:different:END */
/* GAME:tellmore:BEGIN */
(function(){
/* Tell Me More (Gilligan, short). Helper: mPick. */
{
const K="gilligan_s",GO="#F5C66A",SXs=[18,44,70,96,122,148,174],SHY=236,SP=[150,160],NB=[26,30],BU=[[60,134],[96,118],[132,134]],IT=["toolbox","lamp","tea","paper","firewood","blanket","parcel"],
IC=["#8A5A2A","#E8B84A","#C8734A","#EDE3C8","#7A5232","#5A78B0","#A8855A"],WN=[16,44,72,120,148,176],
VS=[["coat","win",0],[1,"bed",1],["bread","table",2],[3,"env",3],[5,"stove",4],["hat","cover",5]].map(a=>({a:a[0],b:a[1],n:a[2]}));
const R=(c,col,x,y,w,h)=>{c.fillStyle=col;c.fillRect(x,y,w,h)},ci=(c,x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,7);c.fill()},L=(c,col,a)=>{c.strokeStyle=col;c.beginPath();for(let i=0;i<a.length;i+=2)c[i?"lineTo":"moveTo"](a[i],a[i+1])},
V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
V("tellmore_ask",()=>aNoise(.2,{f:1200,to:2400,q:4,v:.025,a:.04}));
V("tellmore_give",()=>aNoise(.25,{f:500,to:900,v:.04,a:.06}));
V("tellmore_met",()=>{aTone(AN(0),.7,{v:.05});aTone(AN(4),.7,{v:.04,at:.05});aTone(AN(7),.8,{v:.04,at:.1})});
V("tellmore_back",()=>aTone(AN(-12),.3,{v:.05,lp:500,to:AN(-14)}));
const pp=(c,n,x,y,o)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],v=A&&A.pivots&&A.pivots[n];return r&&v&&mPerson(c,K,n,x,y,Object.assign({ax:v[0]/r[2],ay:v[1]/r[3]},o))};
const fig=(c,n,x,y,o)=>{if(!pp(c,n,x,y,o)){R(c,"#6A5A8A",x-4,y-14,8,14)}};
const DM={};
const dim=(c,n,x,y,a)=>{let cv=DM[n];if(!cv){const g=(cv=document.createElement("canvas")).getContext("2d");cv.width=24;cv.height=28;g.imageSmoothingEnabled=false;
  if(!pp(g,n,12,26)){R(c,"#6A5A8A",x-4,y-14,8,14);return}g.globalCompositeOperation="source-atop";g.fillStyle="rgba(30,30,70,.34)";g.fillRect(0,0,24,28);DM[n]=cv}
  c.save();c.globalAlpha*=a;c.drawImage(cv,hs(x-12),hs(y-26));c.restore()};
const it=(c,i,x,y,sc,gd)=>{const n=IT[i],o={ax:.5,ay:.5,sc,sm:1};if(gd&&mCanvas(c,mTint(K,n,GO,.55),x,y,o))return;if(!mPiece(c,K,n,x,y,o))R(c,gd?GO:IC[i],x-7*sc,y-7*sc,14*sc,14*sc)};
const G={coat:c=>{R(c,"#6A4A8A",-4,-6,8,12);R(c,"#6A4A8A",-7,-5,3,9);R(c,"#6A4A8A",4,-5,3,9);R(c,"#EAD9B4",-1,-6,2,5)},
  hat:c=>{R(c,"#6A4A8A",-4,-4,8,7);R(c,"#6A4A8A",-7,2,14,2)},
  bread:c=>{c.fillStyle="#C8843A";c.beginPath();c.ellipse(0,0,7,4.5,0,0,7);c.fill();L(c,"#8A5420",[-3,-2,-1,1]);c.moveTo(0,-3);c.lineTo(2,0);c.moveTo(3,-2);c.lineTo(4,0);c.stroke()},
  win:c=>{R(c,"#5A4A3A",-6,-7,12,14);R(c,"#9AC0E0",-4.5,-5.5,9,11);L(c,"#2A2030",[-2,-5.5,1,-1,-1,1,2,5.5]);c.moveTo(-10,-3);c.lineTo(-7,-3);c.moveTo(-10,2);c.lineTo(-7,2);c.stroke()},
  bed:c=>{R(c,"#6A4A8A",-7,1,14,5);R(c,"#FFF6E0",-7,-2,4,3);ci(c,3,-4,3.5,"#E8D080");ci(c,4.6,-5,3,"#EAD9B4")},
  table:c=>{for(const q of [[-8,-1,10,3],[-7,2,2,5],[-1,2,2,5]])R(c,"#B07A3A",...q);for(const q of [[5,-6,2,12],[3,2,6,2]])R(c,"#4A5A8A",...q)},
  env:c=>{c.fillStyle="#5A7A5A";c.beginPath();c.moveTo(-8,7);c.lineTo(-3,1);c.lineTo(2,7);c.moveTo(0,7);c.lineTo(4,2);c.lineTo(8,7);c.fill();R(c,"#2A2030",-6,-7,10,7);R(c,"#FFF6E0",-5,-6,8,5);L(c,"#2A2030",[-5,-6,-1,-3,3,-6]);c.stroke()},
  stove:c=>{R(c,"#4A4A5A",-6,-3,12,9);R(c,"#2A2A34",-4,-1,8,5);R(c,"#4A4A5A",2,-7,3,4);c.strokeStyle="#7A9AC0";c.beginPath();c.arc(0,2,1.8,0,7);c.stroke()},
  cover:c=>{R(c,"#8A9AC0",-7,-1,14,5);c.strokeStyle="#FFF";c.beginPath();for(const x of [-4,0,4]){c.moveTo(x-1.5,-4);c.lineTo(x+1.5,-2);c.moveTo(x+1.5,-4);c.lineTo(x-1.5,-2)}c.stroke()}};
const ic=(c,k,x,y,gd)=>{if(typeof k==="number")return it(c,k,x,y,.8,gd);c.save();c.translate(x,y);G[k](c);c.restore()};
const back=c=>{if(!mBg(c,K,0)){R(c,"#2A2640",0,0,192,320)}grade(c,"#D89A4A",.2)};
const nb=(c,x,y,sc)=>{if(!mPiece(c,K,"notebook",x,y,{ax:.5,ay:.5,sc,sm:1}))R(c,"#EAD9B4",x-16*sc,y-10*sc,32*sc,20*sc)};
const ask=s=>{if(s.ph!=="at"||s.lay>=2)return;s.nt++;s.ra[++s.lay]=0;sfx("tellmore_ask")};
const give=(s,i)=>{if(s.ph!=="at")return;if(!s.nt&&!s.ua){s.ua=1;s.unasked++}const v=s.v,r=i===VS[v].n||i===6&&v===3;
  s.gi=i;s.gt=0;s.go=r?1:i===6?2:0;if(!s.go)s.wrong++;s.ph="give";sfx("tellmore_give")};
const done=s=>{s.met++;s.mi.push(VS[s.v].n);s.mt=1;s.th=0;sfx("tellmore_met");pSparks(s.P,96,160,8,GO,30)};
MINI.tellmore={who:"gilligan",land:"l4",title:"Tell Me More",short:true,art:K,stages:["Tell Me More"],
  setup:["People don’t always ask for what they need. Often they ask for what seems easiest to ask for.","Gilligan’s research grew from listening closely to real people. So listen first."],
  how:"Tap ‘Tell me more’ to hear the rest. Then choose what to bring.",
  win:"Every visitor heard. Listening changed what we brought.",
  walk:"Close the notebook for now. They’ll come back, and we’ll ask again.",
  lines:[null],pad:false,ab:true,bloomT:2,limit:90,
  fl:["Every visitor served.","Nearly every real need met.","Everyone heard, and every need met."],
  flNext:["Ask once more before you choose.","Ask even when the request seems clear."],
  rate:s=>s.met===6&&s.wrong===0&&s.unasked===0?3:s.met>=5?2:1,
  shotReady:s=>s.v>=3&&s.ph==="at"&&s.lay>=2&&s.ra[2]>.3,
  release(){for(const k in DM)delete DM[k]},
  init(s){Object.assign(s,{st:0,stT:0,T:0,v:0,ph:"in",vt:0,lay:-1,nt:0,ua:0,ra:[0,0,0],met:0,mi:[],mt:0,wrong:0,unasked:0,gi:0,gt:0,go:0,th:9,br:0,kb:0,au:null,P:pfx(),vs:VS});
    s.pk=mPick({items:SXs.map(x=>({x:x-12,y:SHY-12,w:24,h:24}))})},
  step(s,dt,inp){s.T+=dt;s.stT+=dt;pStep(s.P,dt,s.rm);s.th+=dt;s.ra=s.ra.map(a=>a+dt);const i=s.pk.step(dt,inp);
    if(inp.lTap||inp.rTap||inp.uTap||inp.dTap||inp.aTap||inp.bTap)s.kb=1;
    if(s.ph==="in"){if((s.vt+=dt)>=1.2){s.ph="at";s.lay=0;s.ra[0]=0}return null}
    if(s.ph==="at"){if(inp.bTap)ask(s);for(const t of inp.taps||[])if(Math.abs(t.x-SP[0])<=14&&Math.abs(t.y-SP[1])<=14)ask(s);if(i>=0)give(s,i);return null}
    const t=s.gt+=dt;
    if(s.ph==="give"){if(s.go&&t>=.5){if(s.go===1)done(s);s.ph="out";s.ot=0}
      else if(!s.go){if(t>=.8&&!s.bk){s.bk=1;sfx("tellmore_back")}if(t>=1.3){s.bk=0;s.ph="at"}}return null}
    if(s.ph==="out"){s.ot+=dt;s.br=s.mt?clamp(s.th/.5,0,1):0;if(s.ot>=1){s.v++;if(s.v>=6)return"win";Object.assign(s,{ph:"in",vt:0,lay:-1,nt:0,ua:0,ra:[0,0,0],br:0,mt:0})}}return null},
  draw(s,c,t){const rm=s.rm,v=Math.min(s.v,5),q=VS[v];back(c);
    const wk=s.ph==="in",u=wk?s.vt/1.2:1,x=lerp(24,96,u),y=lerp(100,176,u),a=s.ph==="out"?clamp(1-(s.ot-.4)/.6,0,1):1,n="vis"+v+"_walk_"+(wk&&!rm?Math.floor(t/200)%2:0);
    nb(c,NB[0],NB[1],1);s.mi.forEach((m,i)=>it(c,m,NB[0]-9+i%3*9,NB[1]-3+(i>2)*7,.3));
    for(let l=0;l<=s.lay;l++){const g=s.ra[l],e=l?clamp(g/.4,0,1):1,k=clamp((g-(l?.25:0))/.2,0,1);
      if(l&&g<1){c.globalAlpha=1-g;L(c,GO,[SP[0],SP[1],lerp(SP[0],BU[l][0],e),lerp(SP[1],BU[l][1],e)]);c.stroke();c.globalAlpha=1}
      c.globalAlpha=k;R(c,l>1?GO:"#100B15",BU[l][0]-13,BU[l][1]-13,26,26);R(c,"#EAD9B4",BU[l][0]-12,BU[l][1]-12,24,24);R(c,"#EAD9B4",BU[l][0]-1,BU[l][1]+13,3,3);
      ic(c,l?l>1?q.n:q.b:q.a,BU[l][0],BU[l][1],l>1);c.globalAlpha=1}
    c.save();c.globalAlpha=a;mShadow(c,x,y,12,.4);dim(c,n,x,y,1);if(s.ph==="out"||s.br>0){c.globalAlpha=a*s.br;fig(c,n,x,y)}c.restore();
    if(s.th<.9&&s.ph==="out"){c.globalAlpha=1-s.th/.9;L(c,GO,[96,160,lerp(96,NB[0],clamp(s.th/.5,0,1)),lerp(160,NB[1],clamp(s.th/.5,0,1))]);c.lineWidth=2;c.stroke();c.lineWidth=1;c.globalAlpha=1}
    if(s.ph==="at"&&s.lay<2){c.strokeStyle=GO;c.globalAlpha=rm?.7:.4+.3*Math.sin(t/200);c.beginPath();c.arc(SP[0],SP[1],13,0,7);c.stroke();c.globalAlpha=1}
    if(!mPiece(c,K,"spool",SP[0],SP[1],{ax:.5,ay:.5}))ci(c,SP[0],SP[1],8,GO);
    fig(c,s.ph==="give"&&s.gt<.5?"wv_hand":"wv_stand",96,220);
    const fl=(s.ph==="give"||s.ph==="out"&&s.go)&&s.gt>.1;SXs.forEach((x,i)=>{if(!(fl&&s.gi===i))it(c,i,x,SHY,1)});
    if(s.kb)s.pk.draw(c,(c,o,i,sel)=>{if(sel){c.strokeStyle=GO;c.strokeRect(o.x+.5,o.y+.5,o.w-1,o.h-1)}});
    if(fl){const g=s.gt,f=g<.5?E.inOut(g/.5):s.go||g<.8?1:1-E.inOut(clamp((g-.8)/.5,0,1));c.globalAlpha=a;it(c,s.gi,lerp(SXs[s.gi],96,f),lerp(SHY,184,f)-Math.sin(Math.PI*f)*8,1);c.globalAlpha=1}
    pDraw(c,s.P,K)},
  bloom(s,c,k,t){const e=E.inOut(clamp(k/.4,0,1)),x=lerp(NB[0],96,e),y=lerp(NB[1],90,e);back(c);
    WN.forEach((wx,i)=>{const p=clamp((k-.3-i*.06)/.3,0,1);if(p>0){L(c,GO,[96,78,lerp(96,wx,p),lerp(78,16,p)]);c.globalAlpha=.8;c.stroke();c.globalAlpha=1}R(c,"#100B15",wx-5,9,10,12);R(c,p>=1?"#FFD27A":"#4A4A5A",wx-4,10,8,10);if(p>=1)glow(c,wx,15,12,"#FFD27A",.5)});
    nb(c,x,y,lerp(1,1.6,e));s.mi.forEach((m,i)=>{c.globalAlpha=clamp((k-.2-i*.08)/.15,0,1);it(c,m,96+(i%3-1)*14,y+(i>2?3:-5),.4);c.globalAlpha=1})
    fig(c,"wv_spool",96,178);if(!mPiece(c,K,"spool",101,150,{ax:.5,ay:1,a:clamp((k-.5)/.3,0,1)}))ci(c,101,142,6,GO)},
  auto(s,inp){if(s.ph!=="at")return;const a=s.au||(s.au={v:-1});if(a.v!==s.v){a.v=s.v;a.t=s.T;a.n=0}const t=s.T-a.t,tp=(x,y)=>{inp.taps=[{x,y}];inp.tap=inp.taps[0]};
    if(a.n===0&&t>=.1){tp(SP[0],SP[1]);a.n=1}else if(a.n===1&&t>=.25){tp(SP[0],SP[1]);a.n=2}else if(a.n===2&&t>=.65){tp(SXs[VS[s.v].n],SHY);a.n=3}}
};
}
})();
/* GAME:tellmore:END */
MINI_LOADED.s4=true;
