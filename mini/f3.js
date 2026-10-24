/* The Examined Life: Level III full game (the Misty Valleys). Plan 5. Loaded after l1.js-l4.js (fx.js first, boss.js last).
   Source: work_src/f3/<id>.js, one file per game, assembled by tools/build_mini.py f3. Do not edit the GAME blocks here. */
/* MINI_ART:BEGIN */
/* written by tools/l3p5_mini_art.py (Phase 42A): asset ids, atlas rects, people rects and pivots, traced geometry (shared) */
MINI_ART.shared={"atlas":"67a7c81cd334d0d8ae878a5a6a39c935","people":"87538bf0bfce752d55af3cb48b70704c","rects":{"table":[1,1,176,100],"door_open":[178,1,31,64],"door_closed":[210,1,48,64],"tablet":[259,1,32,56],"brazier":[292,1,32,32],"incense":[325,1,24,32],"candles":[350,1,22,32],"lantern":[373,1,25,32],"teapot":[399,1,41,28],"tub":[441,1,32,28],"offer_tray":[474,1,64,25],"oranges":[539,1,32,21],"rice_heap":[572,1,24,21],"fish":[597,1,32,20],"dumplings":[630,1,28,19],"cushion":[659,1,32,18],"cushion_gold":[692,1,32,18],"bowl_full":[725,1,16,17],"tea_tray":[742,1,36,16],"bowl_empty":[779,1,16,14],"cup_full":[796,1,12,12],"cup_empty":[809,1,12,12]},"prects":{"gm_stand_0":[1,1,16,24],"gm_walk_0":[18,1,16,24],"gm_walk_1":[35,1,16,24],"gf_stand_0":[52,1,14,24],"gf_walk_0":[67,1,14,24],"gf_walk_1":[82,1,14,24],"fa_stand_0":[97,1,14,24],"fa_walk_0":[112,1,14,24],"fa_walk_1":[127,1,14,24],"mo_stand_0":[142,1,14,24],"mo_walk_0":[157,1,14,24],"mo_walk_1":[172,1,14,24],"gu_stand_0":[187,1,14,24],"gu_walk_0":[202,1,14,24],"gu_walk_1":[217,1,14,24],"con_idle_0":[232,1,14,24],"gm_stand_1":[247,1,16,23],"gf_stand_1":[264,1,14,23],"fa_stand_1":[279,1,14,23],"mo_stand_1":[294,1,14,23],"gu_stand_1":[309,1,14,23],"con_idle_1":[324,1,14,23],"con_nod":[339,1,14,23],"gm_bow":[354,1,16,21],"gf_bow":[371,1,14,21],"fa_bow":[386,1,14,21],"mo_bow":[401,1,14,21],"con_bow":[416,1,14,21],"ch_stand_0":[431,1,13,16],"ch_walk_0":[445,1,13,16],"ch_walk_1":[459,1,13,16],"ch_carry":[473,1,17,16],"gm_pour":[1,26,23,15],"ch_stand_1":[25,26,13,15],"gu_pour":[39,26,21,15],"face_neutral":[61,26,14,14],"face_shiver":[76,26,14,14],"face_squint":[91,26,14,14],"face_smile":[106,26,14,14],"gm_sf":[121,26,15,13],"gm_sb":[137,26,15,13],"gf_sf":[153,26,14,13],"gf_sb":[168,26,14,13],"fa_sf":[183,26,14,13],"fa_sb":[198,26,14,13],"mo_sf":[213,26,14,13],"mo_sb":[228,26,14,13],"ch_bow":[243,26,13,13],"gu_sf":[257,26,14,13],"gu_sb":[272,26,14,13],"w_sf":[287,26,14,13],"w_sb":[302,26,14,13],"w_wave":[317,26,16,13],"w_huddle":[334,26,14,12],"w_bow":[349,26,14,11],"ch_sf":[364,26,10,10],"ch_sb":[375,26,10,10]},"pivots":{"gm_stand_0":[10,24],"gm_stand_1":[10,23],"gm_walk_0":[6,24],"gm_walk_1":[6,24],"gm_sf":[8,13],"gm_sb":[8,13],"gm_bow":[10,21],"gm_pour":[8,15],"gf_stand_0":[8,24],"gf_stand_1":[8,23],"gf_walk_0":[8,24],"gf_walk_1":[8,24],"gf_sf":[7,13],"gf_sb":[7,13],"gf_bow":[8,21],"fa_stand_0":[8,24],"fa_stand_1":[8,23],"fa_walk_0":[8,24],"fa_walk_1":[8,24],"fa_sf":[7,13],"fa_sb":[7,13],"fa_bow":[8,21],"mo_stand_0":[8,24],"mo_stand_1":[8,23],"mo_walk_0":[8,24],"mo_walk_1":[8,24],"mo_sf":[7,13],"mo_sb":[7,13],"mo_bow":[8,21],"ch_stand_0":[8,16],"ch_stand_1":[8,15],"ch_walk_0":[8,16],"ch_walk_1":[8,16],"ch_sf":[5,10],"ch_sb":[5,10],"ch_bow":[8,13],"ch_carry":[8,16],"gu_stand_0":[8,24],"gu_stand_1":[8,23],"gu_walk_0":[8,24],"gu_walk_1":[8,24],"gu_sf":[7,13],"gu_sb":[7,13],"gu_pour":[7,15],"w_sf":[7,13],"w_sb":[7,13],"w_bow":[7,11],"w_huddle":[7,12],"w_wave":[9,13],"con_idle_0":[8,24],"con_idle_1":[8,23],"con_bow":[8,21],"con_nod":[8,23],"face_neutral":[7,14],"face_shiver":[7,14],"face_squint":[7,14],"face_smile":[7,14]},"bg":["d492c6031146db13f72351fcaca6546d","93432a735c509eafdf35c2d76ac74050"],"plate":"73d6ab9e66ee3cc31ac4cc0f22f12f79","geo":{"hall":{"crop":"centre","backWall":[0,0,192,60],"cabinetsLeft":[30,0,64,60],"screen":[68,6,142,62],"cabinetsRight":[146,0,192,60],"window":[12,62],"windowBox":[0,20,18,110],"lamp":[174,50],"lampBox":[166,40,182,98],"plumPot":[20,212],"plumBox":[0,150,58,226],"floor":[18,60,192,228],"door":[96,236],"doorFrame":[60,200,132,256],"doorOpening":[78,212,114,256],"wallBottom":[0,228,192,256],"darkBandFrom":256,"note":"the brief's places fit: table (96,128), seats, bench y 212, side table y 36 (in front of the cabinets), door (96,238), window (24,60), lamp (170,52)"},"altar":{"crop":"centre (after the band cut, see the handoff)","niche":[76,16,116,62],"nicheOpening":[82,22,110,56],"tabletBase":[96,56],"lanterns":[[48,42],[144,42]],"altar":[10,98,182,170],"altarTop":99,"altarFront":[96,104],"floor":[0,162,192,320],"floorFrom":162,"suggest":{"outlinesY":99,"outlinesX":[44,76,116,148],"incense":[96,102],"bowRows":[184,210,236],"rowX":[76,116],"tray":[96,200],"trayNote":"the empty tray fades out after the incense, before the bow line","confucius":[170,200]},"note":"the altar top is at y 99 (brief 90); the floor starts at y 162, so the brief's bow rows (136/164/192) would stand under the altar"}}};
/* MINI_ART:END */
/* GAME:shared:BEGIN */
(function(){
{ /* The Shared Table (Confucius). Plan 5, Phase 42B. Helper: mDrag (people, pots, offerings, brazier); the door is a tap. Art: MINI_ART.shared */
const ID="shared",LD="#100B15",TC=[96,128],IN=[96,102],WN=[24,60];
const SEAT=[[96,92],[54,104],[138,104],[54,152],[138,152],[96,164]],BEN=[28,55,82,110,137,164];
const CUP=SEAT.map(q=>{const d=Math.hypot(TC[0]-q[0],TC[1]-q[1]);return[q[0]+(TC[0]-q[0])/d*14,q[1]+(TC[1]-q[1])/d*14]}),BWL=CUP.map(q=>[q[0]+6,q[1]]);
const OX=[44,76,116,148],OY=99,OKN=["candles","tea_tray","rice_heap","oranges"],RS=[0,1,2,3,4,5].map(i=>[[76,116][i&1],[184,210,236][i>>1]]),WB=[[20,184],[44,184],[20,210],[44,210],[20,236],[44,236]];
const FAM=[[["gm",0],["gf",1],["fa",2],["mo",2],["ch",3],["w",4]],[["gu",0],["gm",0],["fa",1],["mo",1],["ch",2],["w",3]]];FAM[2]=FAM[0];
const GEN={gm:0,gf:0,fa:1,mo:1,ch:2,w:2},RET=[["gm","fa"],["gu"],[null,"ch"]],DEF={gm:0,gf:1,fa:2,mo:3,ch:4,w:5};
const COL={gm:"#8E3B5A",gf:"#4F7E3E",fa:"#3A5A8A",mo:"#A04030",ch:"#E0A030",gu:"#7A7A82",w:"#2F7470"};
const FB={table:[88,50,"#7A2A2A","e"],door_closed:[24,32,"#6A4A2A"],door_open:[16,32,"#6A4A2A"],tablet:[16,28,"#6A3A22"],brazier:[16,16,"#3A3030","e"],incense:[12,16,"#B08A3A"],candles:[11,16,"#C03030"],
  teapot:[20,14,"#8A4A2A","e"],tub:[16,14,"#B08A5A","e"],offer_tray:[96,30,"#6A4A2A"],oranges:[16,10,"#E08A2A","e"],rice_heap:[12,10,"#F0F0E0","e"],fish:[16,10,"#C8C0A8","e"],dumplings:[14,9,"#E8E0C8","e"],
  cushion:[16,9,"#4A6A6A","e"],cushion_gold:[16,9,"#D9A93A","e"],bowl_full:[8,8,"#F4F0E0","e"],bowl_empty:[8,7,"#C8A878","e"],tea_tray:[18,8,"#5A8A8A"],cup_full:[6,6,"#B8D0C0","e"],cup_empty:[6,6,"#5A8A7A","e"]};
if(typeof SFX!=="undefined"&&typeof aTone==="function"&&!SFX.shared_seat){Object.assign(SFX,{
  shared_seat:()=>aNoise(.14,{type:"lowpass",f:380,to:150,q:.5,a:.02,v:.07}),
  shared_pour:()=>aNoise(.5,{f:1800,to:3200,q:2,a:.1,v:.03}),
  shared_rice:()=>{aTone(AN(-12),.07,{type:"triangle",v:.06,lp:900});aNoise(.05,{f:900,q:2,v:.03})},
  shared_pass:()=>aNoise(.5,{f:500,to:900,q:.8,a:.15,v:.035}),
  shared_return:()=>{aTone(AN(7),.3,{type:"triangle",v:.05,lp:1800});aTone(AN(14),.4,{type:"triangle",v:.05,lp:1800,at:.16})},
  shared_door:()=>aNoise(.5,{f:260,to:420,q:.6,a:.12,v:.05}),
  shared_bow:()=>aTone(AN(-24),1.2,{v:.05,a:.2,lp:500})})}
let CARRY=null;
const A=()=>MINI_ART[ID],dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]),dur=(s,d)=>s.rm?Math.min(d,.4):d;
function rng(a){return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const shuf=(s,L)=>{L=L.slice();for(let i=L.length-1;i>0;i--){const j=(s.rng()*(i+1))|0,x=L[i];L[i]=L[j];L[j]=x}return L};
/* ---- movement: any object with x,y walks a list of legs ---- */
function go(p,x,y,d,pz,cb){p.tw={x0:p.x,y0:p.y,x1:x,y1:y,t:0,d:Math.max(d,.01),cb,pz:pz||"walk"};if(x<p.x-.5)p.fl=1;else if(x>p.x+.5)p.fl=0}
function seq(s,p,L,cb){const n=L.shift();if(!n){if(cb)cb();return}go(p,n[0],n[1],dur(s,n[2]),n[3],()=>seq(s,p,L,cb))}
function mv(p,dt){const w=p.tw;if(!w)return;w.t+=dt;const k=Math.min(1,w.t/w.d),e=E.inOut(k);p.x=lerp(w.x0,w.x1,e);p.y=lerp(w.y0,w.y1,e);if(k>=1){p.tw=null;if(w.cb)w.cb()}}
const mkO=(x,y,t,k)=>({t,k,x,y,hx:x,hy:y,w:24,h:24,tw:null});
/* ---- stages ---- */
function setup(s,n){CARRY={st:n,oo:s.oo,imp:s.imp,ret:s.ret,self:s.self,mem:s.mem};const z=()=>[0,0,0,0,0,0];
  Object.assign(s,{ph:n<2?"seat":"offer",pt:0,stT:0,fd:.7,sc:n<2?0:1,occ:z().map(()=>null),cup:z().map(()=>false),bwl:z().map(()=>false),nc:false,srv:null,sl:null,bw:0,dip:null,dcb:null,dg:false,dk:n===1?0:1,bf:false,lit:false,tr:1,ins:null,rw:null,rs:z().map(()=>null),pv:0,inc:null,
    tp:mkO(40,36,"pot","cup"),tb:mkO(72,36,"pot","bowl"),bz:mkO(162,104,"bz")});
  const od=shuf(s,[0,1,2,3,4,5]);
  s.ps=FAM[n].map((q,i)=>({id:q[0],tier:q[1],x:BEN[od[i]],y:212,hx:BEN[od[i]],hy:212,w:24,h:28,st:"bench",si:-1,tw:null,fl:0,ph:s.rng()*6,rt:false,rj:-1,bt:null}));
  s.of=n===2?shuf(s,OKN).map((k,i)=>{const o=mkO(60+i*24,196,"off",k);o.pl=null;return o}):[]}
function meal(s){s.sc=0;s.nc=true;s.ph="rice";s.pt=0;s.bw=0;s.pv=0;s.occ.fill(null);s.bwl.fill(false);
  for(const p of s.ps){p.si=s.mem[p.id];p.x=SEAT[p.si][0];p.y=SEAT[p.si][1];p.st="sit";p.tw=null;s.occ[p.si]=p}}
function fin(s){if(s.st<2){stageUp(s);setup(s,s.st);return null}return"win"}
/* ---- the rules ---- */
function place(s,p,i){const O=s.occ,fr=[0,1,2,3,4,5].filter(j=>!O[j]);
  if(i===0&&p.tier>0){const o=fr.filter(j=>j>0).sort((a,b)=>dist(SEAT[a],SEAT[0])-dist(SEAT[b],SEAT[0]))[0]; /* the seat of honor is for the eldest tier only */
    if(o!=null)i=o;else{const k=O.findIndex((q,j)=>j>0&&q&&q.tier===0);if(k>=0){const q=O[k];O[0]=q;O[k]=null;q.si=0;q.st="seq";go(q,SEAT[0][0],SEAT[0][1],dur(s,.4),"walk",()=>q.st="sit");i=k}}}
  O[i]=p;p.si=i;p.st="seq";const x=SEAT[i][0],y=SEAT[i][1];
  if(s.st===1&&p.id!=="w"&&((i>=4&&!s.dg)||(i===2&&!s.bf)))s.imp++; /* imposing: a seat that is uncomfortable now */
  const el=s.ps.find(r=>r.tier<p.tier&&(r.st==="bench"||r.rt));
  if(el){s.oo++;p.rt=true;p.bt=el;seq(s,p,[[x,y,.3,"walk"],[x,y,.15,"sit"],[x,y,.25,"bow"],[p.hx,p.hy,.3,"walk"]],()=>{O[i]=null;p.si=-1;p.rt=false;p.st="bench"})}
  else seq(s,p,[[x,y,.4,"walk"]],()=>{p.st="sit";sfx("shared_seat");if(!s.rm)pDust(s.P,x,y+(i>2?8:14),4,"rgba(210,190,160,.6)")})}
function pour(s,i,pot){const t=pot.k==="cup",F=t?s.cup:s.bwl,p=s.occ[i];let pass=-1;
  if(p.id==="w"){if(F.some((f,j)=>j!==i&&!f))s.self++} /* serving yourself before the others */
  else{for(let j=0;j<6;j++)if(!F[j]&&s.occ[j].tier<p.tier&&(pass<0||s.occ[j].tier<s.occ[pass].tier))pass=j;if(pass>=0)s.oo++} /* a higher cup is still empty: it is passed along */
  s.srv={k:pot.k,i,t:0,d:.8,pass,ret:0};sfx(t?"shared_pour":"shared_rice")}
function srvTick(s,dt){const v=s.srv,l=s.sl;
  if(l){l.t+=dt;if(l.t>=l.d){const F=l.k==="cup"?s.cup:s.bwl;F[l.a]=false;F[l.b]=true;s.sl=null}}
  if(!v)return;v.t+=dt;const pot=v.k==="cup"?s.tp:s.tb,T=(v.k==="cup"?CUP:BWL)[v.i];
  if(v.ret){const u=v.t/v.d,k=u<.22?E.inOut(u/.22):u>.78?E.inOut((1-u)/.22):1;pot.x=lerp(pot.hx,T[0]+9,k);pot.y=lerp(pot.hy,T[1]-9,k)}else{pot.x=T[0]+9;pot.y=T[1]-9}
  if(v.t>=v.d){s.srv=null;(v.k==="cup"?s.cup:s.bwl)[v.i]=true;
    if(v.ret){s.ret++;sfx("shared_return");pot.x=pot.hx;pot.y=pot.hy}else go(pot,pot.hx,pot.hy,dur(s,.25));
    if(v.pass>=0){s.sl={k:v.k,a:v.i,b:v.pass,t:0,d:dur(s,.9)};sfx("shared_pass")}}}
function flow(s,dt){const K=s.ph==="tea"?"cup":"bowl",F=K==="cup"?s.cup:s.bwl;if(s.srv||s.sl||s.tp.tw||s.tb.tw)return null;
  const wi=s.occ.findIndex(p=>p.id==="w");
  if(!F[wi]&&F.every((f,j)=>j===wi||f)){s.rw=RET[s.st][K==="cup"?0:1];s.srv={k:K,i:wi,t:0,d:1.6,pass:-1,ret:1};sfx(F===s.cup?"shared_pour":"shared_rice");return null} /* care comes back */
  if(F.every(Boolean)){s.pt+=dt;if(s.pt>=.5){s.pt=0;if(K==="cup"&&s.st===0)s.ph="rice";else s.ph="eat"}}
  return null}
function phase(s,dt){const ph=s.ph;if(s.dip!=null)return null;
  if(ph==="seat"){if(s.ps.every(p=>p.st==="sit")){if(s.st===0)for(const p of s.ps)s.mem[p.id]=p.si;s.ph="tea";s.pt=0}}
  else if(ph==="tea"||ph==="rice")return flow(s,dt);
  else if(ph==="eat"){s.pt+=dt;if(s.pt>=1.5)return fin(s)}
  else if(ph==="offer"){if(s.of.every(o=>o.pl!=null&&!o.tw)){s.inc=mkO(96,196,"inc","inc");s.ph="incense"}}
  else if(ph==="incense"){if(s.lit&&!s.inc.tw){s.ph="tray";s.pt=0}}
  else if(ph==="tray"){s.pt+=dt;s.tr=Math.max(0,1-s.pt/.6);if(s.pt>=.6){const od=shuf(s,[0,1,2,3,4,5]);
    s.ps.forEach((p,i)=>{p.hx=p.x=WB[od[i]][0];p.hy=p.y=WB[od[i]][1];p.st="bench";p.rj=-1;p.tw=null});s.pv=1;s.ph="line"}}
  else if(ph==="line"){if(s.ps.every(p=>p.st==="line"&&!p.tw)){s.ph="trade";s.pt=0}}
  else if(ph==="trade"){if(s.ps.some(p=>p.tw))return null; /* each one in a row ahead of their generation trades with an elder */
    const rw=p=>p.rj>>1,a=s.ps.find(p=>rw(p)<GEN[p.id]),q=a&&s.ps.filter(r=>GEN[r.id]<GEN[a.id]&&rw(r)>rw(a)).sort((x,y)=>Math.abs(rw(x)-GEN[a.id])-Math.abs(rw(y)-GEN[a.id]))[0];
    if(!q){s.ph="bow";s.pt=0;s.bw=1;sfx("shared_bow");return null}
    s.oo++;const ax=a.x,ay=a.y,ar=a.rj;go(a,q.x,q.y,dur(s,.8));go(q,ax,ay,dur(s,.8));a.rj=q.rj;q.rj=ar;s.rs[a.rj]=a;s.rs[q.rj]=q;sfx("shared_pass")}
  else if(ph==="bow"){s.pt+=dt;if(s.pt>=2){s.bw=0;s.dip=0;s.dcb=()=>meal(s);s.ph="wait"}}
  return null}
/* ---- input: touch and keys both go through mDrag; the door is a tap (or B on the cursor) ---- */
function lists(s){const P=[],S=[];if(s.dip!=null)return[P,S];const ok=o=>o&&!o.tw,ph=s.ph;
  if(s.st===1&&!s.bf&&ok(s.bz)){P.push(s.bz);S.push({id:"wn",x:WN[0],y:WN[1],r:18})}
  if(ph==="seat"||ph==="line"){for(const p of s.ps)if(p.st==="bench"&&ok(p))P.push(p);
    if(ph==="seat")s.occ.forEach((o,i)=>{if(!o)S.push({id:i,x:SEAT[i][0],y:SEAT[i][1],r:16})});else s.rs.forEach((o,i)=>{if(!o)S.push({id:i,x:RS[i][0],y:RS[i][1],r:16})})}
  else if((ph==="tea"||ph==="rice")&&!s.srv&&!s.sl&&!s.tp.tw&&!s.tb.tw){const t=ph==="tea",pot=t?s.tp:s.tb,F=t?s.cup:s.bwl,Q=t?CUP:BWL;P.push(pot);F.forEach((f,i)=>{if(!f)S.push({id:i,x:Q[i][0],y:Q[i][1],r:14})})}
  else if(ph==="offer"){for(const o of s.of)if(o.pl==null&&ok(o))P.push(o);OX.forEach((x,i)=>{if(!s.of.some(o=>o.pl===i))S.push({id:i,x,y:OY,r:14})})}
  else if(ph==="incense"&&!s.lit&&ok(s.inc)){P.push(s.inc);S.push({id:"in",x:IN[0],y:IN[1],r:14})}
  return[P,S]}
const hitD=(s,x,y)=>s.st===1&&!s.dg&&Math.abs(x-96)<=18&&y>=226&&y<=256;
function door(s){if(s.st!==1||s.dg)return;s.dg=true;sfx("shared_door")}
function drop(s,p,sp){const id=sp?sp.id:null,num=typeof id==="number",back=d=>go(p,p.hx,p.hy,dur(s,d||.35));
  if(p.tier!=null){if(num&&s.ph==="seat")place(s,p,id);else if(num&&s.ph==="line"){s.rs[id]=p;p.rj=id;p.st="line";go(p,RS[id][0],RS[id][1],dur(s,.25))}else back();return}
  if(p.t==="pot"){if(num&&!s.srv&&!s.sl)pour(s,id,p);else back(.25);return}
  if(p.t==="bz"){if(id==="wn"){s.bf=true;go(p,WN[0],WN[1],dur(s,.3),"")}else back();return}
  if(p.t==="off"){if(num&&OKN[id]===p.k){p.pl=id;go(p,OX[id],OY-6,dur(s,.25),"",()=>sfx("shared_seat"))}else back(.5);return}
  if(p.t==="inc"){if(id==="in"){s.lit=true;go(p,IN[0],IN[1]-6,dur(s,.25),"",()=>sfx("shared_seat"))}else back()}}
function input(s,dt,inp){const D=s.D,tch=!!(inp.down||inp.taps.length);
  if(tch)s.kb=false;else if(inp.dx||inp.dy||inp.aTap||inp.bTap)s.kb=true;
  const L=lists(s);D.pieces=L[0];D.spots=L[1];if(s.dip!=null&&D.held){D.held=null;D.touch=false}
  if(inp.bTap&&D.held&&!D.touch){const p=D.held;D.held=null;D.over=null;go(p,p.hx,p.hy,dur(s,.3))} /* B cancels a carry */
  else if(inp.bTap&&!D.held&&hitD(s,D.cur.x,D.cur.y))door(s);
  const ev=D.step(dt,inp);
  if(!ev&&!D.held)for(const q of inp.taps)if(hitD(s,q.x,q.y))door(s);
  s.ins=null;if(s.st===1&&D.held&&D.held.tier!=null&&D.over&&typeof D.over.id==="number"){const i=D.over.id;s.ins=i>=4&&!s.dg?"shiver":i===2&&!s.bf?"squint":"smile"} /* the self-test */
  if(ev)drop(s,ev.piece,ev.spot)}
/* ---- art helpers (every one has a code fallback) ---- */
function fb(c,n,x,y,o){const q=FB[n];if(!q)return;const w=q[0]*(o.sc||1),h=q[1]*(o.sc||1),X=x-(o.ax==null?.5:o.ax)*w,Y=y-(o.ay==null?.5:o.ay)*h;
  c.save();if(o.a!=null)c.globalAlpha=o.a;c.fillStyle=o.col||q[2];c.strokeStyle=LD;c.lineWidth=.8;c.beginPath();if(q[3]==="e")c.ellipse(X+w/2,Y+h/2,w/2,h/2,0,0,7);else c.rect(X,Y,w,h);c.fill();c.stroke();c.restore()}
const pcs=(c,n,x,y,o)=>{o=o||{};if(o.ax==null)o.ax=.5;if(o.ay==null)o.ay=.5;if(!mPiece(c,ID,n,x,y,o))fb(c,n,x,y,o)};
function sil(c,n,x,y,a){const cv=mTint(ID,n,"#F5C66A",1);if(!(cv&&mCanvas(c,cv,x,y,{ax:.5,ay:1,a})))fb(c,n,x,y,{ay:1,col:"#F5C66A",a})}
function pp(c,n,x,y,o){const a=A(),r=a&&a.prects&&a.prects[n],v=a&&a.pivots&&a.pivots[n];if(!r||!v)return false;o=o||{};o.ax=v[0]/r[2];o.ay=v[1]/r[3];return mPerson(c,ID,n,x,y,o)}
function blk(c,x,y,col,h,sit){c.fillStyle=LD;c.fillRect(x-6,y-h,12,h);c.fillRect(x-4,y-h-6,8,7);c.fillStyle=col;c.fillRect(x-5,y-h+1,10,h-2);c.fillStyle="#E8C8A0";c.fillRect(x-3,y-h-5,6,5)}
function bgH(c){if(mBg(c,ID,0))return;const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#3A2E26");g.addColorStop(1,"#1C2A26");c.fillStyle=g;c.fillRect(0,0,192,320);c.fillStyle="#2C4A40";c.fillRect(18,60,174,168);c.fillStyle="#4A3424";c.fillRect(0,0,192,60);c.fillStyle="#1A1410";c.fillRect(60,200,72,56);c.fillStyle="#22322E";c.fillRect(0,228,192,92)}
function bgA(c){if(mBg(c,ID,1))return;c.fillStyle="#1F3A38";c.fillRect(0,0,192,162);c.fillStyle="#0F1A1A";c.fillRect(82,22,28,34);c.fillStyle="#5A3A22";c.fillRect(10,98,172,6);c.fillRect(20,104,4,58);c.fillRect(168,104,4,58);c.fillStyle="#7A4A26";c.fillRect(0,162,192,158)}
const dis=(s,i)=>s.st!==1?null:i>=4&&!s.dg?"d":i===2&&!s.bf?"s":null;
function sitP(c,s,p,t){const i=p.si,q=SEAT[i],bk=i>2,x=q[0],y=bk?q[1]+2:q[1]+(i?14:13),w=p.id==="w",d=dis(s,i),ret=s.srv&&s.srv.ret&&p.id===s.rw;
  let n=p.id+(bk?"_sb":"_sf"),ox=0,oy=s.ph==="eat"&&!s.rm?Math.sin(t/220+p.ph)*.8:0;
  if(d&&!s.rm)ox=d==="d"?Math.sin(t/45)*.6:Math.sin(t/160)*.8;
  if(w&&d)n=d==="d"?"w_huddle":"w_wave";else if(ret&&(p.id==="gm"||p.id==="gu"))n=p.id+"_pour";
  const o=ret&&p.id!=="gm"&&p.id!=="gu"?-1:0;
  if(!pp(c,n,x+ox,y-oy+o))blk(c,x+ox,y-oy+o,COL[p.id],9,1)}
function fig(c,s,p,t,lf){const pz=p.tw?p.tw.pz:(s.bw&&p.st==="line"?"bow":"stand"),mvg=p.tw&&pz==="walk"&&Math.hypot(p.tw.x1-p.x,p.tw.y1-p.y)>.6,x=p.x,y=p.y+12;
  mShadow(c,x,y,12,lf?.2:.3);const fl=pz==="bow"&&p.bt?(p.bt.x<x?1:0):p.fl;
  if(p.id==="w"){c.save();c.translate(hs(x),hs(y));if(pz==="bow")c.scale(1,.88);
    const nm=mvg?"wanderer_"+(fl?"left":"right")+"_"+(1+((t/150)|0)%2):"wanderer_down_0";if(!mSprO(c,nm,-8,-24)){c.translate(-hs(x),-hs(y));blk(c,x,y,COL.w,18)}c.restore();return}
  const bw=pz==="bow"&&p.id!=="gu",n=p.id+"_"+(bw?"bow":mvg?"walk_"+(((t/160)|0)%2):"stand_"+(s.rm?0:((((t/700)+p.ph)|0)%2)));
  if(!pp(c,n,x,y,{flip:!!fl&&(mvg||bw)}))blk(c,x,y,COL[p.id],18)}
function con(c,s,x,y,t,pz){const n=pz==="bow"?"con_bow":pz==="nod"?"con_nod":"con_idle_"+(s.rm?0:((t/900)|0)%2);mShadow(c,x,y,12,.3);if(!pp(c,n,x,y,{}))blk(c,x,y,"#3A2A5A",18)}
function steam(c,x,y,t){c.save();c.strokeStyle="rgba(240,240,240,.45)";c.lineWidth=.7;c.beginPath();for(let k=0;k<=5;k++){const xx=x+Math.sin(t/300+k*.8)*1.3,yy=y-k*1.4;k?c.lineTo(xx,yy):c.moveTo(xx,yy)}c.stroke();c.restore()}
function items(c,s,t){const sl=s.sl;
  for(let i=0;i<6;i++){if(!s.nc){const sk=sl&&sl.k==="cup"&&(sl.a===i||sl.b===i);if(!sk){pcs(c,s.cup[i]?"cup_full":"cup_empty",CUP[i][0],CUP[i][1],{});if(s.cup[i]&&!s.rm)steam(c,CUP[i][0],CUP[i][1]-3,t)}}
    const sk=sl&&sl.k==="bowl"&&(sl.a===i||sl.b===i);if(!sk){pcs(c,s.bwl[i]?"bowl_full":"bowl_empty",BWL[i][0],BWL[i][1],{});if(s.bwl[i]&&!s.rm)steam(c,BWL[i][0],BWL[i][1]-4,t+500)}}
  if(sl){const u=E.inOut(Math.min(1,sl.t/sl.d)),Q=sl.k==="cup"?CUP:BWL,f=sl.k==="cup"?["cup_full","cup_empty"]:["bowl_full","bowl_empty"];
    [[sl.a,sl.b,f[0]],[sl.b,sl.a,f[1]]].forEach((q,j)=>pcs(c,q[2],lerp(Q[q[0]][0],Q[q[1]][0],u),lerp(Q[q[0]][1],Q[q[1]][1],u)-(j?3:10)*Math.sin(Math.PI*u),{}))}}
function pot(c,s,o,nm,t,held){const v=s.srv,mine=v&&((nm==="teapot")===(v.k==="cup")),tilt=mine&&v.t>.12&&v.t<v.d-.12?(nm==="teapot"?-.5:-.3):0;
  if(!o.tw&&!held&&!mine&&!s.srv&&!s.sl&&((nm==="teapot"&&s.ph==="tea")||(nm==="tub"&&s.ph==="rice")))glow(c,o.x,o.y,15,"#FFD27A",.3+.15*Math.sin(t/260));
  if(held)mShadow(c,o.x,o.y+9,14,.3);pcs(c,nm,o.x,o.y,{rot:tilt});
  if(mine&&tilt){const T=(v.k==="cup"?CUP:BWL)[v.i];c.save();c.strokeStyle=v.k==="cup"?"rgba(215,160,70,.85)":"rgba(246,242,225,.9)";c.lineWidth=1.2;c.setLineDash([2,1.5]);c.lineDashOffset=-t/60;c.beginPath();c.moveTo(o.x-8,o.y+1);c.lineTo(T[0],T[1]-1);c.stroke();c.restore()}}
function lite(c,s,t){const v=s.srv;if(!v||!v.ret)return;const u=v.t/v.d,a=Math.sin(Math.PI*clamp((u-.2)/.6,0,1)),r=s.occ.findIndex(p=>p&&p.id===s.rw);if(r<0||a<=0)return;
  const A1=CUP[r],B=(v.k==="cup"?CUP:BWL)[v.i];c.save();c.globalCompositeOperation="lighter";c.strokeStyle="rgba(255,205,120,"+(.45*a)+")";c.lineWidth=2;c.beginPath();c.moveTo(A1[0],A1[1]);c.lineTo(B[0],B[1]);c.stroke();c.restore();
  for(let i=0;i<7;i++){const k=((i/7+(s.rm?0:t/1100))%1);glow(c,lerp(A1[0],B[0],k),lerp(A1[1],B[1],k),5,"#FFD27A",.6*a)}glow(c,B[0],B[1],9,"#FFE9A8",.5*a)}
function brz(c,s,t){const b=s.bz,fx=s.bf,x0=fx?WN[0]:162,y0=fx?WN[1]-5:96;
  if(s.st!==1)return;if(s.D.held!==b){glow(c,b.x,b.y-2,11,"#FF7A3A",.3);pcs(c,"brazier",b.x,b.y,{})}
  c.save();for(let i=0;i<5;i++){const u=s.rm?(i+.5)/5:((t/1500+i/5)%1),x=fx?x0-u*28:x0-8-u*34,y=fx?y0-u*8:y0-u*10;c.globalAlpha=.8*(1-u);c.fillStyle="#A8A8B2";c.beginPath();c.arc(x,y,2.5+u*4,0,7);c.fill()}c.restore()}
function draft(c,s,t){if(s.st!==1||s.dg)return;c.save();c.strokeStyle="#EAF2F4";c.lineWidth=1;
  for(let i=0;i<9;i++){const u=s.rm?.5:((t/900+i*.37)%1),x=84+i*6+u*30,y=224-u*90;c.globalAlpha=.6*Math.sin(Math.PI*u);c.beginPath();c.moveTo(x,y);c.lineTo(x+3,y-8);c.stroke()}
  c.fillStyle="#A8C47A";for(let i=0;i<3;i++){const u=s.rm?(i+.5)/3:((t/1800+i/3)%1),x=88+i*14+u*50+Math.sin(u*9+i)*5,y=222-u*84;c.globalAlpha=.8*Math.sin(Math.PI*u);c.fillRect(hs(x),hs(y),3,2)}c.restore()}
const FACE={neutral:"#E8C8A0",shiver:"#C8D8E8",squint:"#D8C0A0",smile:"#F0D0A8"};
function inset(c,s){if(!s.ins)return;const k=s.ins;c.save();c.fillStyle="rgba(16,11,21,.8)";c.fillRect(3,19,30,30);c.strokeStyle="#D9A93A";c.lineWidth=1;c.strokeRect(3.5,19.5,29,29);c.beginPath();c.rect(4,20,28,28);c.clip();
  if(k==="smile")glow(c,18,34,18,"#FFD27A",.45);
  if(!mPerson(c,ID,"face_"+k,18,48,{ax:.5,ay:1,sc:2})){c.fillStyle=FACE[k];c.beginPath();c.arc(18,34,10,0,7);c.fill();c.fillStyle=LD;c.fillRect(13,31,3,k==="squint"?1:3);c.fillRect(20,31,3,k==="squint"?1:3);c.beginPath();c.strokeStyle=LD;c.lineWidth=1;
    if(k==="smile")c.arc(18,36,4,.2,2.9);else if(k==="shiver"){c.moveTo(13,40);c.lineTo(15,38);c.lineTo(17,40);c.lineTo(19,38);c.lineTo(21,40);c.lineTo(23,38)}else{c.moveTo(14,39);c.lineTo(22,39)}c.stroke()}
  c.strokeStyle="rgba(235,245,250,.8)";c.fillStyle="rgba(160,160,170,.7)";
  if(k==="shiver")for(let i=0;i<3;i++){c.beginPath();c.moveTo(6,26+i*7);c.lineTo(13,26+i*7);c.stroke()}
  else if(k==="squint")for(let i=0;i<3;i++){c.beginPath();c.arc(8+i*7,24+i*3,2.5,0,7);c.fill()}
  c.restore()}
function cush(c,i){pcs(c,i===0?"cushion_gold":"cushion",SEAT[i][0],SEAT[i][1]+(i<3?(i?9:8):3),{})}
function hall(c,s,t){const D=s.D,ps=s.ps,sat=p=>p.st==="sit"||(p.tw&&p.tw.pz==="sit");bgH(c);glow(c,172,52,32,"#FFD27A",.28);
  c.fillStyle="#4A2E1A";c.fillRect(26,44,64,3);
  if(s.st!==2||s.pv===0)con(c,s,170,88,t,s.ph==="eat"&&s.st===2&&s.pt<.9?"nod":"");
  for(let i=0;i<3;i++)cush(c,i);for(const p of ps)if(sat(p)&&p.si<3)sitP(c,s,p,t);
  pcs(c,"table",TC[0],TC[1],{});if(s.st===2){pcs(c,"fish",85,127,{});pcs(c,"dumplings",109,129,{})}
  items(c,s,t);for(let i=3;i<6;i++)cush(c,i);for(const p of ps)if(sat(p)&&p.si>2)sitP(c,s,p,t);
  const k=E.out(s.dk==null?1:s.dk);pcs(c,"door_open",96,238,{a:1-k});pcs(c,"door_closed",96+(1-k)*10,238,{a:k});
  brz(c,s,t);pot(c,s,s.tp,"teapot",t,D.held===s.tp);pot(c,s,s.tb,"tub",t,D.held===s.tb);draft(c,s,t);
  const st=ps.filter(p=>!sat(p)&&p!==D.held).sort((a,b)=>a.y-b.y);for(const p of st)fig(c,s,p,t,0);
  const r=s.srv&&s.srv.ret&&s.rw==="ch"&&s.occ.find(p=>p&&p.id==="ch");if(r)pp(c,"ch_carry",SEAT[r.si][0],SEAT[r.si][1]+10,{});
  lite(c,s,t);
  if(D.held){for(const sp of D.spots){ring(c,sp.x,sp.y,sp.r*.55,1,D.over===sp?"rgba(255,233,168,.95)":"rgba(245,198,106,.5)",1)}const h=D.held;if(h.tier!=null)fig(c,s,h,t,1);else if(h.t==="bz"){mShadow(c,h.x,h.y+9,14,.3);glow(c,h.x,h.y,11,"#FF7A3A",.3);pcs(c,"brazier",h.x,h.y-2,{})}}}
function altar(c,s,t){const D=s.D,tc=s.tr;bgA(c);glow(c,48,42,26,"#FF6A3A",.3);glow(c,144,42,26,"#FF6A3A",.3);pcs(c,"tablet",96,56,{ay:1});
  if(s.lit){c.save();c.strokeStyle="rgba(215,215,225,.55)";c.lineWidth=.8;c.beginPath();for(let i=0;i<=22;i++){const x=IN[0]+Math.sin(i*.5+(s.rm?0:t/500))*(1+i*.1),y=IN[1]-10-i*2.3;i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();c.restore()}
  if(s.ph==="offer"||s.ph==="incense"||s.ph==="tray")OX.forEach((x,i)=>{if(!s.of.some(o=>o.pl===i)){sil(c,OKN[i],x,OY+2,.4+(s.rm?0:.12*Math.sin(t/400+i)));glow(c,x,OY-4,12,"#F5C66A",.15)}});
  for(const o of s.of)if(o.pl!=null){pcs(c,o.k,o.x,o.y+8,{ay:1});glow(c,o.x,o.y,10,"#FFD27A",.15)}
  if(tc>0)pcs(c,"offer_tray",96,200,{sc:3,a:tc});
  for(const o of s.of)if(o.pl==null){const hd=D.held===o;if(hd)mShadow(c,o.x,o.y+9,14,.3);pcs(c,o.k,o.x,o.y+8,{ay:1,a:Math.max(tc,hd?1:0)})}
  const ic=s.inc;if(ic){if(D.held===ic)mShadow(c,ic.x,ic.y+9,12,.3);pcs(c,"incense",ic.x,ic.y+8,{ay:1});if(s.lit)glow(c,ic.x,ic.y-6,4,"#FF7A3A",.7)}
  if(s.ph==="offer"||s.ph==="incense"||s.ph==="tray"){if(s.ph==="offer"&&D.held)for(const sp of D.spots)ring(c,sp.x,sp.y,7,1,D.over===sp?"rgba(255,233,168,.95)":"rgba(245,198,106,.45)",1)}
  con(c,s,170,212,t,s.bw?"bow":"");
  if(s.pv){const L=s.ps.slice().sort((a,b)=>a.y-b.y);for(const p of L)if(p!==D.held)fig(c,s,p,t,0);if(D.held&&D.held.tier!=null){for(const sp of D.spots)ring(c,sp.x,sp.y,9,1,D.over===sp?"rgba(255,233,168,.95)":"rgba(245,198,106,.45)",1);fig(c,s,D.held,t,1)}}}
const G={
  who:"confucius",land:"l3",title:"The Shared Table",
  setup:["At my table, the eldest sits first and the guest is served first.","Serve yourself last. Then see what happens."],
  how:"Drag people to their seats and pour for them. Elders first.",
  win:"You put everyone before yourself, and they did the same for you. That’s ren.",
  walk:"Good manners take practice. Sit down and eat with us.",
  stages:["The Family Meal","A Guest Arrives","The New Year Offering"],
  lines:[null,"A guest has come. Before you give a seat away, ask if you’d want it.","Tonight we remember the ones who came before us. Then we eat together."],
  pad:true,ab:true,limit:150,long:false,bloomT:3.2,
  fl:["The table was set.","Elders first, and no one put where you wouldn’t sit.","Every time you served yourself last, someone served you."],
  flNext:["Seat and serve the eldest first.","Try each seat on yourself first, and let someone else serve you."],
  rate:s=>s.oo===0&&s.imp===0&&s.ret===4?3:s.oo<=2&&s.imp<=1?2:1,
  init(s){s.rng=rng(11);s.oo=s.imp=s.ret=s.self=0;s.mem=Object.assign({},DEF);s.P=pfx();s.D=mDrag({pieces:[],spots:[],snap:false,back:false,speed:90});s.kb=false;s.st=0;s.stT=0;
    if(!s.retry)CARRY=null;s.retry=0;setup(s,0)},
  toStage(s,n){G.init(s);if(n>0){s.st=n;if(CARRY&&CARRY.st===n)Object.assign(s,CARRY);else s.ret=[0,2,3][n];setup(s,n)}},
  step(s,dt,inp){s.stT+=dt;for(const o of s.ps.concat([s.tp,s.tb,s.bz,s.inc],s.of))if(o)mv(o,dt);
    if(s.fd>0)s.fd-=dt;if(s.dg&&s.dk<1)s.dk=Math.min(1,s.dk+dt/dur(s,.6));
    if(s.dip!=null){s.dip+=dt;if(s.dip>=.35&&s.dcb){const f=s.dcb;s.dcb=null;f()}if(s.dip>=.7)s.dip=null}
    srvTick(s,dt);input(s,dt,inp);const r=phase(s,dt);pStep(s.P,dt,s.rm);return r},
  auto(s,inp){if(s.dip!=null||s.t<(s.aN||0))return;const D=s.D,ph=s.ph,busy=s.srv||s.sl||s.tp.tw||s.tb.tw||(ph!=="seat"&&s.ps.some(p=>p.tw))||s.of.some(o=>o.tw)||(s.inc&&s.inc.tw)||s.bz.tw||D.held;if(busy)return;const nx=()=>{s.aN=s.t+.25};
    if(ph==="seat"){const b=s.ps.filter(p=>p.st==="bench").sort((a,b)=>a.tier-b.tier)[0];
      if(s.st===1&&b&&b.tier>0&&!(s.dg&&s.bf)){if(s.stT<2.2)return;if(!s.dg){door(s);return nx()}s.bz.x=WN[0];drop(s,s.bz,{id:"wn"});return nx()} /* tap the door, move the brazier, then seat */if(b){const i=[0,1,2,3,4,5].find(j=>!s.occ[j]);drop(s,b,{id:i});nx()}}
    else if(ph==="tea"||ph==="rice"){const t=ph==="tea",F=t?s.cup:s.bwl,L=s.occ.map((p,i)=>i).filter(i=>!F[i]&&s.occ[i].id!=="w").sort((a,b)=>s.occ[a].tier-s.occ[b].tier);if(L.length){drop(s,t?s.tp:s.tb,{id:L[0]});nx()}}
    else if(ph==="offer"){const o=s.of.find(q=>q.pl==null);if(o){drop(s,o,{id:OKN.indexOf(o.k)});nx()}}
    else if(ph==="incense"&&!s.lit){drop(s,s.inc,{id:"in"});nx()}
    else if(ph==="line"){const b=s.ps.find(p=>p.st==="bench");if(b){const j=[0,1].map(q=>GEN[b.id]*2+q).find(q=>!s.rs[q]);drop(s,b,{id:j});nx()}}},
  shotReady:s=>s.st===0?s.ph==="tea"&&s.cup.filter(Boolean).length>=2:s.st===1?!s.dg&&s.ps.filter(p=>p.st==="sit").length>=2:s.ph==="bow",
  draw(s,c,t){const D=s.D;if(s.sc)altar(c,s,t);else hall(c,s,t);pDraw(c,s.P,ID);inset(c,s);if(s.kb&&!D.held)D.drawCursor(c,"#F5C66A");vignette(c,.2);
    const f=Math.max(s.fd>0?s.fd/.7:0,s.dip!=null?1-Math.abs(s.dip-.35)/.35:0);if(f>0){c.save();c.globalAlpha=Math.min(1,f);c.fillStyle="#08050E";c.fillRect(0,0,192,320);c.restore()}},
  bloom(s,c,k,t){const L=s._fl||1,rm=s.rm,B=s._B||(s._B={rm,st:2,sc:0,nc:true,pv:0,ph:"x",dk:1,dg:true,bf:true,bw:0,srv:null,sl:null,pt:0,cup:[1,1,1,1,1,1],bwl:[1,1,1,1,1,1],D:{held:null,spots:[]},P:null,
      tp:mkO(40,36,"pot","cup"),tb:mkO(72,36,"pot","bowl"),bz:mkO(162,104,"bz"),occ:[],ps:Object.keys(DEF).map((id,i)=>({id,tier:i,si:DEF[id],st:"sit",x:0,y:0,ph:i,tw:null}))});
    B.rm=rm;hall(c,B,t);const RG=[0,2,4,5,3,1];
    if(rm)for(let i=0;i<6;i++)glow(c,BWL[i][0],BWL[i][1],12,"#FFD27A",.2*L);
    else{const u=clamp(k/.62,0,1)*6*L,h=Math.floor(Math.min(u,6*L-.001)),f=E.inOut(u-h),a=RG[h%6],b=RG[(h+1)%6],x=lerp(BWL[a][0],BWL[b][0],f),y=lerp(BWL[a][1],BWL[b][1],f)-6*Math.sin(Math.PI*f),e=1-clamp((k-.62)/.1,0,1);
      for(let j=0;j<6;j++)glow(c,BWL[RG[j]][0],BWL[RG[j]][1],10,"#FFD27A",.08+.1*(j===h%6?1:0));pcs(c,"bowl_full",x,y-4,{a:e});glow(c,x,y-4,15,"#FFE9A8",.8*e);glow(c,x,y-4,7,"#FFFFFF",.4*e)}
    const a1=rm?1:clamp((k-.6)/.3,0,1);if(a1>0){gradeN(c,"warm",.28*a1);glow(c,96,238,50,"#FFD27A",.3*a1);
      
      c.save();c.globalAlpha=a1;c.beginPath();c.rect(0,0,192,160);c.clip();bgA(c);pcs(c,"tablet",96,56,{ay:1});glow(c,96,40,32,"#F5C66A",.7*(rm?1:.85+.15*Math.sin(t/300)));glow(c,96,40,12,"#FFF1C8",.4);c.restore()}
    vignette(c,.25)}
};
MINI.shared=G;
}
})();
/* GAME:shared:END */
MINI_LOADED.f3=true;
