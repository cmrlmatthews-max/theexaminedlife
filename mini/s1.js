/* The Examined Life: Level I short games (the Stormcliffs). Plan 5. Loaded after l1.js-l4.js (fx.js first, boss.js last).
   Source: work_src/s1/<id>.js, one file per game, assembled by tools/build_mini.py s1. Do not edit the GAME blocks here. */
/* MINI_ART:BEGIN */
/* written by tools/l1p5_mini_art.py (Phase 40A): asset ids, atlas rects, people rects and pivots, traced geometry (<who>_s) */
MINI_ART.kierkegaard_s={"atlas":"e55c4e7a67b603112c68becc1ff7bd8f","people":"5620440b07a7cc41f22cb6b636c372e1","rects":{"door_open":[1,1,65,79],"door_shut":[67,1,55,72],"bell":[123,1,52,64],"bell_cracked":[176,1,54,64],"mask_a":[231,1,41,48],"mask_e":[273,1,41,48],"mask_r":[315,1,41,48],"book_a":[357,1,43,48],"book_e":[401,1,43,48],"book_r":[445,1,43,48],"note_r":[489,1,27,28],"stone":[517,1,24,24],"note_e":[542,1,24,19],"note_a":[567,1,24,18]},"prects":{"cr_look_ochre":[1,1,13,24],"cr_look_teal":[15,1,13,24],"cr_look_rose":[29,1,13,24],"cr_look_green":[43,1,13,24],"cr_walk_0":[57,1,13,23],"cr_walk_1":[71,1,13,23]},"pivots":{"cr_walk_0":[7,23],"cr_walk_1":[7,23],"cr_look_ochre":[7,24],"cr_look_teal":[7,24],"cr_look_rose":[7,24],"cr_look_green":[7,24]},"bg":["26aed30cb1a380278bd6a6ced7ea8761"],"geo":{"door":[96,70],"doorBox":[88,62,104,78],"doorWindow":[96,56],"bell":[166,36],"street":[36,80,156,320],"streetTopBox":[36,80,156,90],"houseEdges":{"left":"x 0-36 (houses jut to x 40 at y 120-210)","right":"x 156-192"},"lamps":[[38,132],[150,132],[40,218],[150,218]],"alleys":"none painted; draw the brief alleys as dark openings in the house fronts","darkBandFrom":270}};
MINI_ART.nietzsche_s={"atlas":"f383735898fd745c45ee85b6c19c1784","people":"32f1b889f0459facd4e4cae59907e6fb","rects":{"tablet":[1,1,160,106],"eagle_b":[162,1,43,64],"page":[206,1,38,40],"eagle_a":[245,1,64,39],"serpent":[310,1,40,39],"v_flame":[351,1,28,28],"v_peak":[380,1,28,28],"v_music":[409,1,28,28],"v_seed":[438,1,28,28],"v_sun":[467,1,28,28],"v_cups":[496,1,28,28],"v_wave":[525,1,28,28],"v_ribbon":[554,1,28,28],"wisp":[583,1,32,19],"rock":[616,1,28,17],"glint":[645,1,15,16],"hat":[661,1,24,13]},"prects":{"w_lift":[1,1,19,33],"w_hop":[21,1,17,28],"w_run_1":[39,1,14,27],"w_run_3":[54,1,14,27],"w_trip":[69,1,26,26],"w_stagger":[96,1,23,26],"w_run_0":[120,1,19,25],"w_run_2":[140,1,21,25],"w_glide":[162,1,32,25]},"pivots":{"w_lift":[9,33],"w_run_0":[9,25],"w_run_1":[7,27],"w_run_2":[9,25],"w_run_3":[7,27],"w_hop":[8,28],"w_trip":[12,26],"w_stagger":[13,26],"w_glide":[14,25]},"bg":["a18cba4ec02738c75c0355721fbbdc9f"],"geo":{"horizonY":96,"plateau":[8,165,190,250],"plateauCenter":[100,208],"boulder":[24,170],"suggestTrack":{"c":[96,208],"rx":64,"ry":30},"darkBandFrom":252}};
MINI_ART.camus_s={"atlas":"6fcf3f924a784c8ca4fa41ce0bf32d26","people":"dfce97fd60990e6123cc63a36708c3c4","rects":{"notebook":[1,1,96,63],"kite":[98,1,34,56],"gull_b":[133,1,31,32],"gull_a":[165,1,32,29],"reel":[198,1,16,24],"sk_sun":[215,1,23,24],"sk_fig":[239,1,23,24],"sk_column":[263,1,23,24],"sk_ball":[287,1,24,23],"sk_boat":[312,1,24,19],"sk_wave":[337,1,24,17]},"prects":{"w_reel_pull":[1,1,16,24],"w_reel_give":[18,1,17,24]},"pivots":{"w_reel_pull":[8,24],"w_reel_give":[9,24]},"bg":["38672ab0019f0486dd6591883ef7f370"],"geo":{"horizonY":160,"sun":[149,145],"ruins":[0,112,92,170],"sand":[0,175,192,265],"skyOpen":[0,0,192,150],"darkBandFrom":265}};
MINI_ART.sartre_s={"atlas":"6a16cc86639bd6c996fc65ca8624ddf3","people":"d0ad730f27be44e631a8f3ad5d94d502","rects":{"desk":[1,1,96,88],"cafe_door":[98,1,45,80],"table":[144,1,64,53],"bust":[209,1,20,40],"medal":[230,1,20,36],"prize_box":[251,1,29,36],"sash":[281,1,24,32],"book":[306,1,31,28],"laurel":[338,1,32,27],"pages":[371,1,28,24],"letter":[400,1,28,19],"plate_name":[429,1,36,14],"tray":[466,1,40,10],"cup":[507,1,12,9],"pen":[520,1,28,5]},"prects":{"wt_down_0":[1,1,16,24],"wt_down_1":[18,1,16,24],"wt_down_2":[35,1,16,24],"wt_up_0":[52,1,16,24],"wt_up_1":[69,1,16,24],"wt_up_2":[86,1,16,24],"wt_left_0":[103,1,16,24],"wt_left_1":[120,1,16,24],"wt_left_2":[137,1,16,24],"wt_right_0":[154,1,16,24],"wt_right_1":[171,1,16,24],"wt_right_2":[188,1,16,24],"wt_serve":[205,1,22,24],"ow_down_0":[228,1,16,24],"ow_down_1":[1,26,16,24],"ow_down_2":[18,26,16,24],"ow_up_0":[35,26,16,24],"ow_up_1":[52,26,16,24],"ow_up_2":[69,26,16,24],"ow_left_0":[86,26,16,24],"ow_left_1":[103,26,16,24],"ow_left_2":[120,26,16,24],"ow_right_0":[137,26,16,24],"ow_right_1":[154,26,16,24],"ow_right_2":[171,26,16,24],"ow_serve":[188,26,22,24],"ow_spin_0":[211,26,26,24],"ow_spin_1":[1,51,26,24],"ow_bow":[28,51,16,24],"w_write_0":[45,51,16,24],"w_write_1":[62,51,16,24],"bronze_1":[79,51,16,24],"bronze_2":[96,51,16,24],"bronze_3":[113,51,16,24],"bronze_4":[130,51,16,24],"official_stand":[147,51,16,24],"official_bow":[164,51,24,24],"guest0_wait":[189,51,16,18],"guest0_cheer":[206,51,16,18],"guest1_wait":[223,51,16,18],"guest1_cheer":[1,76,16,18],"guest2_wait":[18,76,16,18],"guest2_cheer":[35,76,16,18],"guest3_wait":[52,76,16,18],"guest3_cheer":[69,76,16,18],"guest4_wait":[86,76,16,18],"guest4_cheer":[103,76,16,18],"guest5_wait":[120,76,16,18],"guest5_cheer":[137,76,16,18]},"pivots":{"wt_down_0":[8,24],"wt_down_1":[8,24],"wt_down_2":[8,24],"wt_up_0":[8,24],"wt_up_1":[8,24],"wt_up_2":[8,24],"wt_left_0":[8,24],"wt_left_1":[8,24],"wt_left_2":[8,24],"wt_right_0":[8,24],"wt_right_1":[8,24],"wt_right_2":[8,24],"wt_serve":[8,24],"ow_down_0":[8,24],"ow_down_1":[8,24],"ow_down_2":[8,24],"ow_up_0":[8,24],"ow_up_1":[8,24],"ow_up_2":[8,24],"ow_left_0":[8,24],"ow_left_1":[8,24],"ow_left_2":[8,24],"ow_right_0":[8,24],"ow_right_1":[8,24],"ow_right_2":[8,24],"ow_serve":[8,24],"ow_spin_0":[13,24],"ow_spin_1":[13,24],"ow_bow":[8,24],"guest0_wait":[8,18],"guest0_cheer":[8,18],"guest1_wait":[8,18],"guest1_cheer":[8,18],"guest2_wait":[8,18],"guest2_cheer":[8,18],"guest3_wait":[8,18],"guest3_cheer":[8,18],"guest4_wait":[8,18],"guest4_cheer":[8,18],"guest5_wait":[8,18],"guest5_cheer":[8,18],"w_write_0":[8,24],"w_write_1":[8,24],"bronze_1":[8,24],"bronze_2":[8,24],"bronze_3":[8,24],"bronze_4":[8,24],"official_stand":[8,24],"official_bow":[15,24]},"bg":["c507dbdd44250346c9d2591e87414e39"],"geo":{"backBar":[16,0,192,34],"counter":[16,34,192,48],"lowCounter":[62,62,192,82],"floorOpen":[16,84,192,250],"floorLeftOpen":[16,48,62,84],"windowStrip":[0,0,16,320],"lamps":[[18,68],[16,128],[16,196]],"tileRowPx":16,"darkBandFrom":250}};
MINI_ART.beauvoir_s={"atlas":"680bc6fd33f5cf24dae0456344c35a52","people":"522cd4880a627e34a70f736bfa5d80f7","rects":{"school":[1,1,48,51],"workshop":[50,1,48,44],"waystone":[99,1,34,40],"rosary":[134,1,40,39],"lamp_off":[175,1,15,32],"lamp_on":[191,1,17,32],"shore":[209,1,48,30],"tag":[258,1,120,28],"tag_torn":[379,1,126,28],"t_brush":[506,1,27,28],"t_plane":[534,1,27,28],"t_book":[562,1,27,28],"t_peak":[590,1,27,28],"t_flask":[618,1,27,28],"t_violin":[646,1,27,28],"t_hammer":[674,1,27,28],"t_scope":[702,1,27,28]},"prects":{"yw_walk_0":[1,1,16,24],"yw_walk_1":[18,1,16,24],"yw_walk_2":[35,1,16,24],"yw_walk_3":[52,1,16,24],"yw_lift":[69,1,21,24],"tooler_wait":[91,1,16,24],"tooler_wave":[108,1,16,24],"tooler_walk_0":[125,1,16,24],"tooler_walk_1":[142,1,16,24],"netman_wait":[159,1,16,24],"netman_wave":[176,1,16,24],"netman_walk_0":[193,1,16,24],"netman_walk_1":[210,1,16,24],"w_kneel_set":[1,26,30,19],"child_wait":[32,26,16,16],"child_wave":[49,26,16,16],"child_walk_0":[66,26,16,16],"child_walk_1":[83,26,16,16]},"pivots":{"yw_walk_0":[8,24],"yw_walk_1":[8,24],"yw_walk_2":[8,24],"yw_walk_3":[8,24],"yw_lift":[8,24],"child_wait":[8,16],"child_wave":[8,16],"child_walk_0":[8,16],"child_walk_1":[8,16],"tooler_wait":[8,24],"tooler_wave":[8,24],"tooler_walk_0":[8,24],"tooler_walk_1":[8,24],"netman_wait":[8,24],"netman_wave":[8,24],"netman_walk_0":[8,24],"netman_walk_1":[8,24],"w_kneel_set":[14,19]},"bg":["055ce48b44e00a8ae7e93e3b65341bfc"],"geo":{"sea":[0,0,192,35],"meadow":[0,35,192,105],"waystones":[[62,92],[148,103],[124,98]],"lane":{"centerX":96,"y300":[40,150],"y200":[72,120],"y120":[86,108]},"windowsLeft":[[20,145],[28,185],[36,220]],"windowsRight":[[162,135],[158,175],[166,215]]}};
MINI_ART.fromm_s={"atlas":"279687299267d1486d98f24537389429","people":"186391a62a84da461f65b688fbb82eea","rects":{"urn":[1,1,68,64],"r3":[70,1,56,58],"r2":[127,1,41,51],"r_droop":[169,1,52,50],"r1":[222,1,40,48],"shade":[263,1,32,31],"letter":[296,1,40,31],"bell":[337,1,19,28],"stool":[357,1,24,25],"shears":[382,1,23,24],"can":[406,1,28,22],"inkstone":[435,1,24,21],"r0":[460,1,24,20],"sparrow":[485,1,16,13],"leaf_dead":[502,1,12,12],"leaf_maple":[515,1,12,11],"brush":[528,1,40,5]},"prects":{"w_water":[1,1,21,24],"w_prune":[23,1,21,24],"w_sit":[45,1,20,23]},"pivots":{"w_sit":[11,23],"w_water":[13,24],"w_prune":[13,24]},"bg":["85dc6d93dbbd1ada2d8d1a3a2d4d1aec"],"geo":{"bed":[31,145,93,185],"bedSoil":[62,158],"table":[136,150,181,180],"stool":[156,182],"lanterns":[[30,130],[104,125],[160,60],[160,210]],"gravel":[50,185,180,235],"wallTop":80}};
/* MINI_ART:END */
/* GAME:voices:BEGIN */
(function(){
/* Phase 40B/45B: Three Voices (Kierkegaard). Helpers: mLanes, mPick. Idea: three voices pull at you; none tells you which book to sign. */
{
const K="kierkegaard_s",XS=[48,96,144],HY=214,SP=45.5,TR=174/SP,MUSIC=41,STOP=37,WIN=.15,WINR=.12,NM=["a","e","r"];
const COL=["#C2415A","#6F8FBF","#F5C66A"],LAB=["pleasure","duty","faith"];
if(typeof SFX!=="undefined"){
SFX.voices_spark=()=>aTone(AN(16),.13,{v:.07,type:"triangle"});
SFX.voices_stone=()=>{aTone(AN(-12),.14,{v:.11,type:"triangle",lp:700,to:AN(-17)});aNoise(.05,{f:700,q:1.2,v:.06})};
SFX.voices_deep=()=>{aTone(AN(-17),1.4,{v:.12,a:.02,lp:600});aTone(AN(-5),1,{v:.04,at:.02})};
SFX.voices_sign=()=>aNoise(.35,{type:"highpass",f:3000,to:5000,q:.6,v:.05,a:.05});
SFX.voices_miss=()=>{aTone(AN(-19),.06,{v:.07,lp:400,to:AN(-24)});aNoise(.03,{type:"lowpass",f:500,v:.04})};
SFX.voices_open=()=>aArp([16,-12,-17],.35,{d:.5,v:.06,lp:1800});
SFX.voices_end=()=>[-12,-8,-5].forEach(n=>aTone(AN(n),1.2,{v:.05,a:.06,lp:900}));
if(typeof GAP!=="undefined")GAP.voices_miss=.15;
}
const bg=c=>{if(mBg(c,K,0))gradeN(c,"night",.6);else{const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#171B38");g.addColorStop(1,"#2B2140");c.fillStyle=g;c.fillRect(0,0,192,320)}};
const mask=(c,i,x,y,a)=>{if(mPiece(c,K,"mask_"+NM[i],x,y,{ax:.5,ay:.5,a}))return;c.save();c.globalAlpha=a;c.fillStyle=COL[i];c.strokeStyle="#100B15";c.beginPath();c.ellipse(x,y,10,12,0,0,7);c.fill();c.stroke();
c.fillStyle="#100B15";c.fillRect(x-6,y-4,4,2);c.fillRect(x+2,y-4,4,2);c.fillRect(x-4,y+(i?5:4),8,1.5);c.restore()};
const note=(c,i,x,y,a)=>{glow(c,x,y,10,i===2?"#FFE9A8":i?"#FFC870":"#FF9A8A",.45*a);if(mPiece(c,K,"note_"+NM[i],x,y,{ax:.5,ay:.5,a}))return;c.save();c.globalAlpha=a;c.fillStyle=COL[i];c.strokeStyle="#100B15";c.beginPath();
if(i===0){c.ellipse(x-3,y,3.5,5,0,0,7);c.fill();c.beginPath();c.ellipse(x+3,y,3.5,5,0,0,7);c.fill()}
else if(i===1){c.rect(x-4,y-1,8,5);c.fill();c.stroke();c.fillStyle="#FFE9A8";c.fillRect(x-1,y-5,2,4)}
else{c.moveTo(x,y-7);c.lineTo(x+2,y-2);c.lineTo(x+7,y);c.lineTo(x+2,y+2);c.lineTo(x,y+7);c.lineTo(x-2,y+2);c.lineTo(x-7,y);c.lineTo(x-2,y-2);c.closePath();c.fill()}c.restore()};
const book=(c,i,x,y,a,sc)=>{if(mPiece(c,K,"book_"+NM[i],x,y,{ax:.5,ay:.5,a,sc:sc||1.4,sm:true}))return;c.save();c.globalAlpha=a;c.fillStyle=COL[i];c.strokeStyle="#100B15";c.fillRect(x-15,y-20,30,40);c.strokeRect(x-14.5,y-19.5,29,39);c.fillStyle="rgba(0,0,0,.25)";c.fillRect(x-15,y-20,4,40);c.restore()};
const alpha=(s,no)=>{const tl=no.t-s.L.t;if(no.miss)return Math.max(0,1-(s.L.t-no.t)/.3);if(no.lane===2)return tl>.8?0:Math.min(1,(.8-tl)/.25);return Math.min(1,(TR-tl)/.15)};
const sp=(s,lane,ts)=>{const n=s.L.add(lane,ts+TR,lane);n.i=s.cnt[lane]++;s.seq.push({lane,t:n.t});return n};
function ivA(s){if(!s.bag.length){for(let j=0;j<8;j++)s.bag.push(.75+.55*(j+Math.random())/8);s.bag.sort(()=>Math.random()-.5)}return s.bag.pop()}
const lit=(s,i)=>{if(s.ph)return 0;const t=s.stT-.35*i;return clamp(Math.min(t/.3,(3.3-t)/.4),0,1)};
function base(s,c,a){bg(c);XS.forEach((x,i)=>{c.save();c.fillStyle=COL[i];c.globalAlpha=(.16+.34*lit(s,i))*a;c.fillRect(x-18,40,36,190);c.globalAlpha=a;c.strokeStyle="#100B15";c.lineWidth=1.5;c.strokeRect(x-18,40,36,190);c.restore()})}
const sinks=(s,c,col,a)=>{for(let k=0;k<s.stones;k++)if(!mPiece(c,K,"stone",96,228-8*k,{ax:.5,ay:1,a}))(c.save(),c.globalAlpha=a,c.fillStyle=col,c.fillRect(90,221-8*k,12,7),c.restore())};
MINI.voices={who:"kierkegaard",land:"l1",title:"Three Voices",short:true,art:K,stages:["Three Voices"],
setup:["I wrote under other names, so each voice could speak for itself.","Listen to all three. I won’t tell you which one is right."],
how:"Tap a lane as its note reaches the gold line.",goal:"Catch pleasure, duty and faith on the gold line, then choose a book.",
ctl:"Tap a lane as its note arrives; tap a book to choose (arrow keys, then A).",win:"You chose a book, and nobody chose it for you. That’s the point.",
walk:"Take the books. Read them as if no one were looking over your shoulder.",lines:[null],pad:true,ab:false,bloomT:2,limit:90,
fl:["You chose a book.","You listened to all three voices.","You heard every voice clearly, deep note and all."],flNext:["Try each lane before the music ends.","Meet the deep note right at the line."],
rate(s){const h=s.hitsA+s.hitsE+s.hitsR;if(s.hitsA>=6&&s.hitsE>=8&&s.hitsR>=3&&h/Math.max(1,h+s.miss)>=.75)return 3;return s.hitsA>=4&&s.hitsE>=4&&s.hitsR>=1?2:1},
_alpha:alpha,
init(s){s.st=0;s.stT=0;s.ph=0;s.L=mLanes({xs:XS,hitY:HY,speed:SP,win:WIN});s.P=pfx();s.stones=0;s.hitsA=s.hitsE=s.hitsR=s.miss=0;s.seq=[];s.cnt=[0,0,0];s.bag=[];s.op=0;
s.nA=.5;s.nE=1;s.nR=4;s.gw=0;s.fx=[0,0,0];s.bad=[0,0,0];s.q=[0,0,0];s.cT=0;s.pick=-1;s.K=null;s.sel=0},
step(s,dt,inp){s.stT+=dt;const L=s.L,dx=inp.dx||0,dy=inp.dy||0,ax=Math.abs(dx),ay=Math.abs(dy),pd=[dx<-.5&&ax>=ay,dy<-.5&&ay>ax,dx>.5&&ax>=ay];
const ed=[inp.lTap||(pd[0]&&!s.q[0]),inp.uTap||(pd[1]&&!s.q[1]),inp.rTap||(pd[2]&&!s.q[2])];s.q=pd;pStep(s.P,dt,s.rm);if(s.gw>0)s.gw=Math.max(0,s.gw-dt);
for(let i=0;i<3;i++){s.fx[i]=Math.max(0,s.fx[i]-dt);s.bad[i]=Math.max(0,s.bad[i]-dt)}
if(s.ph===0){if(!s.op){s.op=1;sfx("voices_open")}const q={lTap:ed[0],uTap:ed[1],rTap:ed[2],aTap:inp.aTap,taps:(inp.taps||[]).filter(p=>p.y>=34&&p.y<=250&&XS.some(x=>Math.abs(p.x-x)<=18))};
const r=L.step(dt,q);
while(s.nA<=L.t&&s.nA<=STOP){sp(s,0,s.nA);s.nA+=ivA(s)}
while(s.nE<=L.t&&s.nE<=STOP){sp(s,1,s.nE);s.nE+=1.4}
while(s.nR<=L.t&&s.nR<=STOP){sp(s,2,s.nR);s.nR+=6}
for(const h of r.hits){const ln=h.lane,x=XS[ln];
if(ln===2&&Math.abs(h.err)>WINR){h.note.hit=false;s.miss++;s.bad[2]=.25;sfx("voices_miss");continue}
s.fx[ln]=.3;
if(ln===0){s.hitsA++;pSparks(s.P,x,HY,s.rm?4:12,"#FFD27A",45);for(const p of s.P.list)p.life=Math.min(p.life,.4);sfx("voices_spark")}
else if(ln===1){s.hitsE++;s.stones=Math.min(10,s.stones+1);sfx("voices_stone")}
else{s.hitsR++;s.gw=2;sfx("voices_deep")}}
for(const w of r.wrong){s.miss++;sfx("voices_miss");if(w>=0)s.bad[w]=.25}
for(const m of r.misses)if(m.lane){s.bad[m.lane]=.25;sfx("voices_miss")}
if(L.t>=MUSIC+.2){sfx("voices_end");if(typeof miniTry=="function"&&MINI.voices.rate(s)<2)miniTry();s.ph=1;s.cT=0;s.K=mPick({items:XS.map(x=>({x:x-15,y:100,w:30,h:40})),sel:0})}
return null}
s.cT+=dt;const ok=s.cT>.8;if(ed[0])s.K.sel=0;if(ed[1])s.K.sel=1;if(ed[2])s.K.sel=2;
const i=s.K.step(dt,{taps:ok?inp.taps:[],aTap:ok&&inp.aTap});if(i>=0){s.pick=i;s.ph=2;sfx("voices_sign");return "win"}return null},
draw(s,c,t){const fade=s.ph?Math.max(0,1-s.cT/.6):1;base(s,c,fade);
if(s.ph===0||fade>0){c.save();c.globalAlpha=fade;sinks(s,c,"#D9A93A",.6);
for(const no of s.L.notes){if(no.hit)continue;const y=s.L.yOf(no),a=alpha(s,no);if(a>0&&y>=34&&y<=262)note(c,no.lane,XS[no.lane],y,a*fade)}
c.restore();
const fg=c.createLinearGradient(0,40,0,190);fg.addColorStop(0,"rgba(8,6,20,.85)");fg.addColorStop(.7,"rgba(8,6,20,.6)");fg.addColorStop(1,"rgba(8,6,20,0)");c.save();c.globalAlpha=fade;c.fillStyle=fg;c.fillRect(126,40,36,150);
c.fillStyle="rgba(245,198,106,.34)";c.fillRect(29,HY-7,134,14);c.strokeStyle="#100B15";c.lineWidth=1.5;c.strokeRect(29,HY-7,134,14);c.fillStyle="#F5C66A";c.fillRect(30,HY-1,132,2);c.restore();
XS.forEach((x,i)=>{if(s.fx[i]>0){const f=s.fx[i]/.3,r=s.rm?12:8+14*(1-f);glow(c,x,HY,18,COL[i],s.fx[i]*1.4*fade);c.save();c.fillStyle=c.strokeStyle=COL[i];c.lineWidth=2;c.globalAlpha=fade*f*(s.rm?.2:.4);c.fillRect(x-18,40,36,190);c.globalAlpha=fade*f;c.beginPath();
if(i===0)c.arc(x,HY,r,0,7);else if(i===1)c.rect(x-r,HY-r,2*r,2*r);else{c.moveTo(x,HY-r);c.lineTo(x+r,HY);c.lineTo(x,HY+r);c.lineTo(x-r,HY);c.closePath()}c.stroke();c.restore()}if(s.bad[i]>0){c.fillStyle=`rgba(10,6,16,${s.bad[i]*1.6*fade})`;c.fillRect(x-18,40,36,190)}
mText(c,["←","↑","→"][i],x,240,10,"rgba(255,233,184,"+.7*fade+")")})}
pDraw(c,s.P,K);
XS.forEach((x,i)=>{const y=s.ph?26+58*E.out(Math.min(1,s.cT/.8)):26;const bump=s.fx[i]>0&&!s.rm?-1.5:0;mask(c,i,x,y+bump,1);const l=lit(s,i);if(l>0)mText(c,LAB[i],x,6,9,"rgba(255,233,184,"+l+")")});
if(s.gw>0){const e=Math.min(1,(2-s.gw)/.5,s.gw/.8);glow(c,96,160,230,"#F5C66A",.35*Math.max(0,e))}
if(s.ph){const a=Math.min(1,s.cT/.6);c.save();c.globalAlpha=a;s.K.items.forEach((it,i)=>{const sel=s.K.sel===i,y=120+(sel&&!s.rm?Math.sin(t/260)*1.2:0);if(sel)glow(c,XS[i],120,26,COL[i],.5);book(c,i,XS[i],y,1)});c.restore();
const it=s.K.items[s.K.sel];c.save();c.strokeStyle="#F5C66A";c.lineWidth=1.5;c.strokeRect(it.x-2,it.y-2,it.w+4,it.h+4);c.restore()}},
bloom(s,c,k,t){const fl=s._fl||MINI.voices.rate(s),p=Math.max(0,s.pick),X=XS[p];base(s,c,0);sinks(s,c,"#F5C66A",.25+.2*fl);
if(s.hitsR>0)glow(c,96,150,230,"#F5C66A",.2+.05*fl);
const fa=1-E.out(Math.min(1,k/.35));XS.forEach((x,i)=>{if(i!==p&&fa>0){book(c,i,x,120,fa);mask(c,i,x,84,fa)}});
mask(c,p,X,84-100*E.in(Math.min(1,k/.4)),1-Math.min(1,k/.4));
const r=E.inOut(clamp((k-.15)/.4,0,1)),bx=lerp(X,96,r),by=lerp(120,90,r),o=clamp((k-.5)/.15,0,1);
book(c,p,bx,by,1-o);
if(o>0){c.save();c.globalAlpha=o;glow(c,96,90,44,"#F5C66A",.25);c.fillStyle=COL[p];c.fillRect(66,72,60,36);c.fillStyle="#EFE0B8";c.fillRect(68,74,27,32);c.fillRect(97,74,27,32);c.fillStyle="rgba(60,40,30,.35)";c.fillRect(95,74,2,32);
for(let j=0;j<5;j++)c.fillRect(71,79+j*5,20,1);c.restore();
const u=clamp((k-.6)/.4,0,1),n=Math.round(u*24);c.save();c.strokeStyle="#D9A93A";c.lineWidth=1.2;c.shadowColor="#F5C66A";c.shadowBlur=4;c.beginPath();
for(let j=0;j<=n;j++){const q=j/24,x=100+q*20,y=98+Math.sin(q*14)*3*(1-q*.5);j?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();c.restore();
if(u>0&&u<1){const q=u,lx=100+q*20,ly=98+Math.sin(q*14)*3*(1-q*.5);glow(c,lx,ly-6,9,"#FFE9A8",.7);c.fillStyle="#100B15";c.fillRect(lx-2,ly-8,4,5);c.fillStyle="#F5C66A";c.fillRect(lx-1,ly-7,2,3)}}
c.save();for(let j=0;j<4+fl*3;j++){const an=j*2.4,rr=16+34*E.out(k)+j*3,a=Math.sin(Math.PI*Math.min(1,k*1.05))*.8;if(a>0){c.fillStyle=`rgba(255,226,150,${a})`;c.fillRect(hs(96+Math.cos(an)*rr),hs(90+Math.sin(an)*rr*.7),1.5,1.5)}}c.restore()},
auto(s,inp){if(s.ph===0){for(const no of s.L.notes){if(no.hit||no.miss)continue;if(no.lane===0&&no.i%2)continue;const e=no.t-s.L.t;if(e<=.02&&e>-.1){if(no.lane===0)inp.lTap=true;else if(no.lane===1)inp.uTap=true;else inp.rTap=true}}}
else if(s.ph===1&&s.cT>5)inp.aTap=true}
};
}
})();
/* GAME:voices:END */
/* GAME:crowd:BEGIN */
(function(){
/* Phase 40B/45B: Against the Crowd (Kierkegaard), a short game. Helper: mFlow. Idea: the grey crowd carries you away from your own door; only a personal choice reaches it. 45B: wider street, lit door and arrow, three bell waves, safe side alleys. */
{
const AC=[[0,0],[0,-1],[-1,-1],[1,-1],[-1,0],[1,0],[0,1],[-1,1],[1,1]],K="kierkegaard_s",SL=[42,60,78,96,114,132,150],SPD=22,LK=["ochre","teal","rose","green"],
  WV=[{n:2,g:1.2,v:0},{n:3,g:.8,v:2},{n:3,g:.7,v:5}], /* the 3 waves: figures per row, seconds between rows, extra speed */
  WY=[225,175], /* wave 2 and 3 start when you climb past these lines */
  AL=[[14,30,126,148],[165,181,156,178]]; /* the two side alleys (safe places) */
if(typeof SFX!=="undefined"){
  SFX.crowd_toll=()=>{aTone(AN(-24),1.8,{v:.11,a:.02,lp:520});aTone(AN(-12),1.3,{v:.035,a:.02})};
  SFX.crowd_wave=()=>{aTone(AN(-24),2.2,{v:.11,a:.02,lp:520});aTone(AN(-17),2,{v:.07,a:.03,lp:560,at:.45});aTone(AN(-12),1.4,{v:.035,a:.02,at:.45})};
  SFX.crowd_bump=()=>{aNoise(.09,{type:"lowpass",f:260,q:.7,v:.08,a:.01});aTone(AN(-22),.1,{v:.1,type:"triangle"})};
  SFX.crowd_crack=()=>{aTone(210,.4,{type:"square",v:.05,lp:700,to:140});aNoise(.06,{f:1200,q:2,v:.07})};
  SFX.crowd_hush=()=>{aNoise(.5,{type:"lowpass",f:900,to:220,q:.6,v:.05,a:.12})};
  SFX.crowd_step=()=>{aNoise(.04,{type:"lowpass",f:420,q:.7,v:.04,a:.004})};
  SFX.crowd_fin=()=>{aArp([0,4,7,12],.11,{d:.7,v:.06,lp:2400})};
  if(typeof GAP!=="undefined"){GAP.crowd_toll=.3;GAP.crowd_bump=.2;GAP.crowd_crack=.5;GAP.crowd_wave=.5;GAP.crowd_hush=.3;GAP.crowd_step=.2;GAP.crowd_fin=1}
}
const bl=y=>y>=105&&y<=185,br=y=>y>=143&&y<=185, /* the painted street bulges out on each side here */
  inA=(x,y)=>AL.findIndex(a=>x>=a[0]&&x<=a[1]&&y>=a[2]&&y<=a[3]),
  inR=(x,y)=>(x>=(bl(y)?30:35)&&x<=(br(y)?165:157)&&y>=78&&y<=246)||(x>=82&&x<=110&&y>=58&&y<78)||inA(x,y)>=0;
const rnd=s=>{s.sd=(s.sd*16807)%2147483647;return s.sd/2147483647};
function row(s,off){const w=WV[s.w],E=[],c=SL.map((_,i)=>i).filter(i=>!s.pe||s.pe.some(p=>Math.abs(p-i)===1)); /* each row has a gap beside the last row's gap, so there is always a way through */
  E.push(c[Math.floor(rnd(s)*c.length)]);while(E.length<SL.length-w.n){const i=Math.floor(rnd(s)*SL.length);if(E.indexOf(i)<0)E.push(i)}
  s.pe=E;SL.forEach((x,i)=>{if(E.indexOf(i)<0)s.F.spawn({x,y:20+off,lc:rnd(s)<.5?Math.floor(rnd(s)*4):-1,ph:Math.floor(rnd(s)*2)})})}
function adv(s,dt,sg){const w=WV[s.w];s.F.speed=SPD+w.v+(sg?10:0);s.F.step(dt);s.rowT-=dt;while(s.rowT<=0){row(s,-s.rowT*s.F.speed);s.rowT+=w.g}}
const dark=(c,x,y,w,h)=>{c.save();c.fillStyle="#0B0710";c.strokeStyle="#100B15";c.beginPath();c.moveTo(x,y+h);c.lineTo(x,y+4);c.quadraticCurveTo(x+w/2,y-3,x+w,y+4);c.lineTo(x+w,y+h);c.closePath();c.fill();c.stroke();c.restore()};
function fig(c,s,f,lk){const a=clamp((f.y-62)/22,0,1)*clamp((290-f.y)/20,0,1);if(a<=0)return;const up=lk&&f.lc>=0;mShadow(c,f.x,f.y,10,.3*a);
  if(mPerson(c,K,up?"cr_look_"+LK[f.lc]:"cr_walk_"+((Math.floor(f.y/6)+f.ph)&1),f.x,f.y,{ax:7/13,ay:1,a}))return;
  c.save();c.globalAlpha=a;c.fillStyle=up?["#C9962E","#3FA8A0","#C9607E","#5C9A58"][f.lc]:"#6C6C78";c.fillRect(f.x-5,f.y-14,10,14);c.fillStyle="#1A1620";c.fillRect(f.x-3,f.y-18,6,5);c.restore()}
function man(c,s,t){const x=s.x+(s.ln>0&&!s.rm?1.5:0),y=s.y;mShadow(c,x,y,12,.4);const mv=s.mv&&!s.rm?1+(Math.floor(t/160)&1):0;
  if(!mSprO(c,"wanderer_"+s.fd+"_"+mv,x-8,y-24)){c.fillStyle="#2F7470";c.fillRect(x-5,y-20,10,20);c.fillStyle="#E2BE98";c.fillRect(x-3,y-24,6,5)}}
function scene(s,c,t,bl){const fin=bl!=null,lk=fin?1:s.lk||0,op=fin||s.dop,cr=fin||s.cr;
  if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#2A2640");g.addColorStop(.3,"#4A3646");g.addColorStop(1,"#241A2E");c.fillStyle=g;c.fillRect(0,0,192,320);
    c.fillStyle="#5A4A5C";c.beginPath();c.moveTo(80,80);c.lineTo(112,80);c.lineTo(160,320);c.lineTo(32,320);c.fill();c.fillStyle="#3A2438";c.fillRect(0,100,36,220);c.fillRect(156,100,36,220)}
  const fl=s.rm?0:Math.sin(t/230);[[38,132],[150,132],[40,218],[150,218]].forEach(p=>glow(c,p[0],p[1],20,"#FFA850",.3+.05*fl));
  AL.forEach((a,i)=>{dark(c,a[0],a[2],a[1]-a[0],a[3]-a[2]);const w=fin||i!==s.ai?0:s.al||0; /* the alley floor lightens while you stand in it */
    const g=c.createLinearGradient(0,a[2]+4,0,a[3]);g.addColorStop(0,"rgba(255,220,150,0)");g.addColorStop(1,`rgba(255,220,150,${.04+.3*w})`);c.save();c.fillStyle=g;c.fillRect(a[0],a[2]+4,a[1]-a[0],a[3]-a[2]-4);c.restore();glow(c,(a[0]+a[1])/2,a[3]-3,14,"#FFD890",.32*w)});
  c.save();c.fillStyle="#1A1322";c.beginPath();c.moveTo(162,48);c.lineTo(162,32);c.quadraticCurveTo(172,19,182,32);c.lineTo(182,48);c.closePath();c.fill();c.restore();
  const ph=1-s.tk/2.4,ang=s.rm||fin||s.cr?0:(s.rg>0?.55:.4)*Math.cos(Math.PI*2*ph),bp=cr?"bell_cracked":"bell";
  if(!mPiece(c,K,bp,172,23,{ax:.5,ay:0,sc:.62,rot:ang,sm:true})){c.fillStyle=cr?"#7A5230":"#A8743A";c.beginPath();c.moveTo(166,42);c.quadraticCurveTo(166,26,172,26);c.quadraticCurveTo(178,26,178,42);c.fill()}
  if(s.sg>0&&s.rm)glow(c,172,34,16,"#FFD890",s.sg*2);
  const hn=fin?0:clamp((s.hint||0)/.7,0,1);
  if(!fin){if(s.rg>0){const u=1-s.rg/1.2;c.save();c.strokeStyle=`rgba(255,214,140,${.55*(1-u)})`;c.lineWidth=1.5;c.beginPath();c.arc(172,32,s.rm?20:5+u*34,0,6.3);c.stroke();c.restore();glow(c,172,32,24,"#FFD890",.4*(1-u))}
    [163,172,181].forEach((x,i)=>{c.fillStyle=i<=s.w?"#F5C66A":"rgba(255,233,184,.28)";c.fillRect(x-2,52,4,4)})} /* three pips: which wave */
  glow(c,96,80,16+10*hn,"#FFD890",op?.7:.25+.05*fl+.6*hn);if(hn>0)glow(c,96,96,34,"#FFD890",.22*hn);
  if(!mPiece(c,K,op?"door_open":"door_shut",96,88,{ax:op?.4:.5,ay:1,sc:.55,sm:true})){c.fillStyle=op?"#FFE3A0":"#6A4630";c.fillRect(89,70,14,18)}
  const L=s.F.list.slice().sort((a,b)=>a.y-b.y);let dr=false;
  for(const f of L){if(!dr&&f.y>s.y){man(c,s,t);dr=true}fig(c,s,f,lk)}if(!dr)man(c,s,t);
  const ha=hn*clamp((3.3-(s.hint||0))/.4,0,1);
  if(ha>0){const by=104+(s.rm?0:2.5*Math.sin(t/180));c.save();c.globalAlpha=ha;c.fillStyle="#F5C66A";c.strokeStyle="#100B15";c.lineWidth=1; /* the gold arrow to your door */
    c.beginPath();c.moveTo(96,by-9);c.lineTo(103,by);c.lineTo(98.5,by);c.lineTo(98.5,by+9);c.lineTo(93.5,by+9);c.lineTo(93.5,by);c.lineTo(89,by);c.closePath();c.fill();c.stroke();c.restore()}
  pDraw(c,s.P,K);
  if(fin){const e=E.out(bl),n=MINI.crowd.rate(s);shaft(c,96,88,230,120,0,"rgba(255,214,140,.6)",(.3+.1*n)*e);glow(c,96,82,50*e,"#FFE3A0",.5*e);
    c.save();for(let j=0;j<8+n*6;j++){const x=46+((j*37)%104),y=250-((bl*60+j*29)%190)*(1);c.fillStyle=`rgba(255,226,150,${.7*Math.sin(Math.PI*((y-60)/190))*e})`;c.fillRect(hs(x+Math.sin(j+bl*3)*3),hs(y),1.5,1.5)}c.restore()}}
MINI.crowd={who:"kierkegaard",land:"l1",title:"Against the Crowd",short:true,art:K,stages:["Against the Crowd"],
  setup:["Everyone walks the same way here, in step with the bell. It’s the easiest thing in the world.","Your door is the other way."],
  how:"Walk up to your door. Wait in a side alley while the crowd passes.",goal:"Reach your own door at the top, against the flow of the crowd.",ctl:"Drag to walk; step into a side alley to let the crowd pass (arrow keys to walk).",win:"Your own door. Faith, for me, could never be a habit you simply inherit.",
  walk:"Take the bell. I never stopped loving the faith. I couldn’t bear to see it worn smooth by habit.",lines:[null],pad:true,ab:false,bloomT:2,limit:150,
  fl:["You reached your own door.","You slipped through the crowd.","You found your own way, almost untouched."],flNext:["Rest in a side alley; the crowd can’t touch you there.","Wait in an alley until the next gap opens."],
  rate:s=>s.bumps<=1?3:s.bumps<=4?2:1,
  init(s){s.st=0;s.stT=0;s.x=96;s.y=246;s.fd="up";s.mv=false;s.bumps=0;s.bT=0;s.pu=0;s.ln=0;s.tk=.8;s.tn=0;s.w=0;s.pe=null;s.rg=0;s.hint=4.8;s.ia=-1;s.ai=0;s.al=0;s.fs=0;s.fo=0;s.sg=0;s.cr=0;s.dop=0;s.lk=0;s.fin=null;s.sd=s.seed||(Math.random()*1e9|0)+1;
    s.P=pfx();s.F=mFlow({dir:[0,1],speed:SPD,bounds:[-40,-40,272,330]});s.rowT=0;for(let i=0;i<110;i++)adv(s,.05,false)},
  step(s,dt,inp){s.stT+=dt;pStep(s.P,dt,s.rm);s.ln=Math.max(0,s.ln-dt);
    if(s.fin!=null){s.fin+=dt;s.lk=Math.min(1,s.fin/.8);if(s.fin>=.5){s.dop=1;if(!s.fo){s.fo=1;sfx("crowd_fin")}}return s.fin>=1.1?"win":null}
    const tw=s.y<=WY[1]||s.stT>=32?2:s.y<=WY[0]||s.stT>=16?1:0; /* a wave starts when you pass its line (or after a while) and the bell tolls */
    s.tk-=dt;if(tw>s.w&&s.tk>.3)s.tk=.3;if(s.tk<=0){s.tk+=2.4;s.sg=.3;if(s.tn++===0||tw>s.w){s.w=tw;s.rg=1.2;sfx("crowd_wave")}else sfx("crowd_toll")}
    s.sg=Math.max(0,s.sg-dt);s.rg=Math.max(0,s.rg-dt);s.hint=Math.max(0,s.hint-dt);adv(s,dt,s.sg>0);
    let vx=inp.dx||0,vy=inp.dy||0;const f=inp.down;if(f){vx=f.x-s.x;vy=f.y-s.y;if(Math.hypot(vx,vy)<=2)vx=vy=0}
    const l=Math.hypot(vx,vy);if(l>1){vx/=l;vy/=l}s.mv=!!(vx||vy);
    if(s.mv){const nx=s.x+vx*36*dt,ny=s.y+vy*(vy>0?60:28)*dt;if(inR(nx,ny)){s.x=nx;s.y=ny}else if(inR(nx,s.y))s.x=nx;else if(inR(s.x,ny))s.y=ny;
      s.fd=Math.abs(vx)>Math.abs(vy)?(vx<0?"left":"right"):vy<0?"up":"down"}
    else if(s.ia<0)s.y=Math.min(246,s.y+14*dt);
    s.fs-=dt;if(s.mv&&s.fs<=0){s.fs=.3;sfx("crowd_step")}
    const ia=inA(s.x,s.y);if(ia>=0&&s.ia<0){sfx("crowd_hush");if(!s.rm)pFireflies(s.P,s.x,s.y-6,2,8)}s.ia=ia;if(ia>=0)s.ai=ia;s.al+=((ia>=0?1:0)-s.al)*Math.min(1,dt*8);
    if(s.pu>0){const d=Math.min(s.pu,32*dt);if(inR(s.x,Math.min(246,s.y+d))){s.y=Math.min(246,s.y+d);s.pu-=d}else s.pu=0}
    s.bT=Math.max(0,s.bT-dt);
    if(!s.bT&&s.ia<0)for(const g of s.F.list)if(Math.hypot(g.x-s.x,g.y-s.y)<=9){s.bumps++;s.pu+=8;s.bT=.6;s.ln=.25;sfx("crowd_bump");if(s.bumps%3===0&&typeof miniTry==="function")miniTry();pDust(s.P,s.x,s.y,s.rm?2:6);break}
    if(s.y<=78&&Math.abs(s.x-96)<=14){s.fin=0;s.cr=1;s.fd="up";s.mv=false;sfx("crowd_crack")}
    return null},
  draw(s,c,t){scene(s,c,t,null)},
  bloom(s,c,k,t){scene(s,c,t,k)},
  auto(s,inp){if(s.fin!=null)return;let best=-1e9,ba=AC[0];const sp=s.F.speed*.1,H=9,M=10; /* looks 1.3 s ahead for each of 9 moves; picks the one that gets furthest up without touching a figure (an alley is safe) */
    for(const a of AC){let x=s.x,y=s.y,v=a[0],w=a[1],hit=0;const l=Math.hypot(v,w);if(l>1){v/=l;w/=l}
      for(let i=1;i<=H&&!hit;i++){if(v||w){const nx=x+v*3.6,ny=y+w*(w>0?6:2.8);if(inR(nx,ny)){x=nx;y=ny}else if(inR(nx,y))x=nx;else if(inR(x,ny))y=ny}else if(inA(x,y)<0)y=Math.min(246,y+1.4);
        if(inA(x,y)<0)for(const f of s.F.list)if(Math.hypot(f.x-x,f.y+sp*i-y)<=M){hit=i;break}}
      const sc=hit?hit-1000:s.y-y-Math.abs(x-96)*.02+(w<0?.5:0);if(sc>best){best=sc;ba=a}}
    inp.dx=ba[0];inp.dy=ba[1]}
};
}
})();
/* GAME:crowd:END */
/* GAME:tornpage:BEGIN */
(function(){
{ /* New Tablets (Nietzsche, "A Torn Page"). Helper: mDrag. Art: MINI_ART.nietzsche_s. */
 const A="nietzsche_s",GD="#F5C66A",LD="#100B15",TAU=6.2832,
 SK=[[72,188],[96,188],[120,188],[72,206],[96,206],[120,206]],
 NM=["v_flame","v_peak","v_music","v_seed","v_sun","v_cups","v_wave","v_ribbon"],REST=[[152,212],[168,204]];
 if(typeof SFX!=="undefined"&&!SFX.tornpage_pick){
  SFX.tornpage_pick=()=>{aTone(AN(5),.06,{type:"triangle",v:.1,lp:1800});aNoise(.03,{f:1800,q:1,v:.04})};
  SFX.tornpage_set=()=>{aTone(AN(12),.7,{v:.09,type:"triangle"});aTone(AN(19),.9,{v:.06,at:.07})};
  SFX.tornpage_grey=()=>{aNoise(.35,{type:"lowpass",f:700,to:250,q:.5,a:.05,v:.08});aTone(AN(-12),.3,{v:.07,type:"triangle",lp:500,to:AN(-16)})};
  SFX.tornpage_page=()=>aNoise(.5,{f:500,to:1800,q:.5,a:.25,v:.05});
  SFX.tornpage_miss=()=>{aTone(AN(-5),.12,{v:.06,type:"triangle",lp:700,to:AN(-10)});aNoise(.06,{type:"lowpass",f:500,v:.04})};
  SFX.tornpage_rise=()=>{aTone(AN(7),1.2,{v:.06,type:"triangle",a:.3,to:AN(19)});aTone(AN(19),1,{v:.04,at:.3,a:.3})};
 }
 const snd=n=>{if(typeof sfx==="function")sfx(n)};
 const tr=()=>{if(typeof miniTry==="function")miniTry()};
 const R=s=>(s.rs=(s.rs*16807)%2147483647)/2147483647;
 const dir=(s,p,v)=>{const a=R(s)*TAU,m=v||8+R(s)*6;p.vx=Math.cos(a)*m;p.vy=Math.sin(a)*m};
 const bnc=(p,x0,x1,y0,y1)=>{if(p.x<x0&&p.vx<0||p.x>x1&&p.vx>0)p.vx=-p.vx;if(p.y<y0&&p.vy<0||p.y>y1&&p.vy>0)p.vy=-p.vy};
 const segd=(w,a,b)=>{const vx=b[0]-a.x,vy=b[1]-a.y,k=clamp(((w.x-a.x)*vx+(w.y-a.y)*vy)/(vx*vx+vy*vy||1),0,1);return Math.hypot(w.x-a.x-k*vx,w.y-a.y-k*vy)};
 const drop=(s,p,sp)=>{
  if(!sp){s.misdrop++;p.st=0;dir(s,p);snd("tornpage_miss");pSparks(s.P,p.x,p.y,4,"#8A8896",18);return}
  p.st=1;p.fixed=true;s.sock[sp.id]=p.id;s.D.spots=s.D.spots.filter(q=>q!==sp);s.filled++;
  const k=1-s.filled/6;s.desat=.7*k;s.fogA=.8*k;s.horA=1-k;
  pSparks(s.P,sp.x,sp.y,10,GD,34);s.ring.push({x:sp.x,y:sp.y,t:0});snd("tornpage_set");if(s.filled>=6)s.won=1};
 const stone=(c,p,x,y,o)=>{o=o||{};const gold=p.st===1,grey=p.st===2,q={ax:.5,ay:.5,rot:o.rot,sm:1,a:o.a,sc:o.sc};
  if(mCanvas(c,gold||grey?mTint(A,p.n,gold?GD:"#7C7C88",gold?.5:.78):null,x,y,q)||mPiece(c,A,p.n,x,y,q))return;
  c.save();c.globalAlpha=o.a==null?1:o.a;c.fillStyle=grey?"#7C7C88":gold?GD:"hsl("+p.id*45+",55%,60%)";c.strokeStyle=LD;c.beginPath();c.arc(x,y,6.5*(o.sc||1),0,TAU);c.fill();c.stroke();c.restore()};
 const wanderer=(c,x,y,up)=>{mShadow(c,x,y,12,.4);
  if(!(up?mPerson(c,A,"w_lift",x,y,{ax:9/19,ay:1}):mSprO(c,"wanderer_down_0",x-8,y-24))){c.fillStyle="#2F7470";c.fillRect(x-5,y-20,10,20)}
  glow(c,up?x:x+7,up?y-34:y-9,up?16:10,"#FFD27A",up?.8:.55)};
 const wisp=(c,w,a)=>{if(mPiece(c,A,"wisp",w.x,w.y,{ax:.5,ay:.5,a:a*.9,flip:w.vx<0}))return;c.save();c.globalAlpha=a*.7;c.fillStyle="#B8B2C6";c.beginPath();c.ellipse(w.x,w.y,8,4.5,0,0,TAU);c.fill();c.restore()};
 const back=c=>{if(mBg(c,A,0))return;const g=c.createLinearGradient(0,0,0,160);g.addColorStop(0,"#5B3A5C");g.addColorStop(1,"#E9B46E");c.fillStyle=g;c.fillRect(0,0,192,166);c.fillStyle="#7E8F62";c.fillRect(8,165,182,85);c.fillStyle="#2B1F28";c.fillRect(0,250,192,70)};
 const tablet=(c,gk)=>{
  if(!mPiece(c,A,"tablet",96,202,{ax:.5,ay:.5})){c.fillStyle="#BDB19C";c.fillRect(56,175,80,53);c.fillStyle="#6B6256";for(const q of SK){c.beginPath();c.arc(q[0],q[1],8,0,TAU);c.fill()}}
  glow(c,96,200,52,"rgba(255,206,120,.9)",gk)};
 const page=(s,c)=>{const u=s.tt/1.5;if(u>=1)return;const x=s.rm?96:-20+232*u,y=s.rm?100:70+u*50+Math.sin(u*10)*14;
  if(!mPiece(c,A,"page",x,y,{ax:.5,ay:.5,rot:s.rm?0:Math.sin(u*12)*.8,sm:1,a:s.rm?1-u:1})){c.fillStyle="#EFE3C4";c.fillRect(x-8,y-10,16,20)}};
 const T={
  who:"nietzsche",land:"l1",title:"New Tablets",short:true,art:"nietzsche_s",stages:["New Tablets"],
  setup:["The old horizon’s been wiped away. Nothing is up or down anymore.","Don’t just drift. Catch what you love, and set it in stone."],
  how:"Drag a stone onto the tablet. Keep it clear of the grey.",
  goal:"Set six stones in the tablet, and keep them clear of the grey wisps.",ctl:"Drag a stone onto a socket (arrow keys move the hand, Z lifts and sets down).",
  win:"There’s your horizon. You made it, so make it worth living by.",
  walk:"Keep the page. I wrote it as a warning, not a celebration.",
  lines:[null],pad:false,ab:false,bloomT:2,limit:60,
  fl:["You set new tablets.","Little grey got into your hands.","Clean placements, and no grey at all."],
  flNext:["Carry stones around the grey wisps.","Drop each stone right on a socket."],
  shotReady:s=>s.filled>=4,
  rate:s=>s.greyed===0&&s.misdrop===0?3:s.greyed<=1&&s.misdrop<=3?2:1,
  init(s){
   Object.assign(s,{W:192,H:320,st:0,stT:0,tt:0,rs:1+Math.floor(Math.random()*2e9),filled:0,misdrop:0,greyed:0,won:0,kb:0,au:null,desat:.7,fogA:.8,horA:0,dv:.7,sock:[-1,-1,-1,-1,-1,-1],P:pfx(),ring:[]});
   s.stones=NM.map((n,i)=>{const p={id:i,n,x:18+R(s)*156,y:48+R(s)*124,w:30,h:30,st:0,g:0,rot:R(s)*6,vr:(R(s)-.5)*.9};dir(s,p);return p});
   s.wisps=[0,1,2,3].map(()=>{const w={x:10+R(s)*172,y:44+R(s)*140};dir(s,w,10);return w});
   s.D=mDrag({pieces:s.stones,spots:SK.map((q,i)=>({id:i,x:q[0],y:q[1],r:10})),onDrop:(p,sp)=>drop(s,p,sp),speed:50,back:false,snap:true})},
  step(s,dt,inp){
   const D=s.D,h=D.held;s.tt+=dt;s.stT+=dt;if(inp.dx||inp.dy||inp.aTap)s.kb=1;
   for(const p of s.stones){if(p.st===1||p===h)continue;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;bnc(p,12,180,40,180);if(p.st===2&&(p.g-=dt)<=0)p.st=0}
   for(const w of s.wisps){let vx=w.vx,vy=w.vy;if(h){const dx=h.x-w.x,dy=h.y-w.y,d=Math.hypot(dx,dy);if(d<50&&d>.01){vx=dx/d*16;vy=dy/d*16}}
    w.x+=vx*dt;w.y+=vy*dt;bnc(w,0,192,36,196)}
   s.dv+=(s.desat-s.dv)*(s.rm?1:Math.min(1,dt*3));
   s.ring=s.ring.filter(r=>(r.t+=dt)<.6);pStep(s.P,dt,s.rm);
   if(!s.pg){s.pg=1;snd("tornpage_page")}
   if(s.tt<1.5)return null; /* the opening: the page blows by */
   if(s.won)return "win";
   /* a stone is picked only within 13 units of the finger or the cursor, and never while grey */
   const q=!h&&!D._was&&inp.down?inp.down:inp.aTap?{x:clamp(D.cur.x+inp.dx*D.speed*dt,0,192),y:clamp(D.cur.y+inp.dy*D.speed*dt,0,320)}:null;
   for(const p of s.stones)p.fixed=p.st!==0||!q||Math.hypot(p.x-q.x,p.y-q.y)>13;
   D.step(dt,inp);
   const p=D.held;if(p&&!h){snd("tornpage_pick");pSparks(s.P,p.x,p.y,4,"#FFE9B8",20)}
   if(p)for(const w of s.wisps)if(Math.hypot(w.x-p.x,w.y-p.y)<10){
    s.greyed++;tr();D.held=null;D.touch=false;D.over=null;p.st=2;p.g=1;p.fixed=true;dir(s,p);snd("tornpage_grey");pSparks(s.P,p.x,p.y,8,"#8A8896",24);break}
   return s.won?"win":null},
  draw(s,c){
   const D=s.D,hd=s.dv/.7;back(c);
   if(hd>0){const g=c.createLinearGradient(0,78,0,116);g.addColorStop(0,"rgba(190,184,204,0)");g.addColorStop(.5,"rgb(190,184,204)");g.addColorStop(1,"rgba(190,184,204,0)");c.save();c.globalAlpha=hd*.8;c.fillStyle=g;c.fillRect(0,78,192,38);c.restore()}
   gradeN(c,"grey",s.dv);
   c.save();c.globalAlpha=1-hd;c.fillStyle=GD;c.fillRect(0,95.5,192,1);c.restore();glow(c,96,96,70,"rgba(255,200,100,.8)",(1-hd)*.35);
   for(const w of s.wisps)wisp(c,w,1);
   tablet(c,0);
   for(const p of s.stones)if(p.st===1)stone(c,p,p.x,p.y);
   for(const r of s.ring)ring(c,r.x,r.y,4+r.t*14,1-r.t/.6,GD,1.2);
   if(D.over)ring(c,D.over.x,D.over.y,9,1,GD,1.5);
   for(const p of s.stones){if(p.st===1)continue;const hl=p===D.held;if(hl)mShadow(c,p.x,p.y+11,12,.4);stone(c,p,p.x,hl?p.y-3:p.y,{rot:hl?0:p.rot,sc:hl?1.15:1,a:p.st===2?.8:1})}
   wanderer(c,36,230,false);pDraw(c,s.P,A);page(s,c);vignette(c,.25*hd);
   if(s.kb&&s.tt>1.5)D.drawCursor(c,GD)},
  bloom(s,c,k){
   if(k>=.15&&!s.bb){s.bb=1;snd("tornpage_rise")}
   c.save();c.translate(0,-40*E.inOut(clamp(k/.5,0,1))); /* the camera eases up so the tablet and the sun sit in the top half */
   c.fillStyle="#2B1F28";c.fillRect(0,318,192,60);c.save();c.translate(0,640);c.scale(1,-1);mBg(c,A,0);c.restore();back(c);
   const sun=E.out(clamp((k-.15)/.6,0,1));
   c.fillStyle=GD;c.fillRect(0,95.5,192,1+sun);glow(c,96,96,60+sun*50,"rgba(255,206,110,.95)",.35+.5*sun);
   c.save();c.beginPath();c.rect(0,0,192,96);c.clip();c.fillStyle="#FFE7A6";c.beginPath();c.arc(96,98-sun*9,12*sun,0,TAU);c.fill();c.restore();
   shaft(c,96,96,150,70,Math.PI,"rgba(255,210,120,.7)",.12*sun);
   tablet(c,.3+.3*E.sine(k));
   for(const p of s.stones)if(p.st===1){const u=clamp(k*2.4-s.sock.indexOf(p.id)*.22,0,1),pl=Math.sin(Math.PI*u);
    glow(c,p.x,p.y,10+pl*8,"rgba(255,200,90,.95)",.4+.5*pl);stone(c,p,p.x,p.y,{sc:1+.2*pl})}
   const q=E.out(clamp(k/.35,0,1)),sp=s.stones.filter(p=>p.st!==1);
   sp.forEach((p,i)=>{p.st=0;stone(c,p,lerp(p.x,REST[i%2][0],q),lerp(p.y,REST[i%2][1],q),{rot:p.rot*(1-q)})});
   const wa=1-clamp(k*3,0,1);if(wa>0)for(const w of s.wisps)wisp(c,w,wa);
   wanderer(c,36,230,k>.3);c.restore();vignette(c,.12)},
  auto(s,inp){
   if(s.tt<1.5||s.won)return;const D=s.D,a=s.au||(s.au={m:0,pt:s.t}),dt=Math.min(.06,s.t-a.pt)||.05;a.pt=s.t;
   if(a.m===1&&!D.held){a.m=0;return} /* knocked loose: lift the finger for a frame, then choose again */
   if(a.m===0){let best=null,bd=1e9;const em=SK.filter((q,i)=>s.sock[i]<0);
    for(const p of s.stones){if(p.st||!em.length)continue;let q=em[0],qd=1e9;for(const z of em){const d=Math.hypot(z[0]-p.x,z[1]-p.y);if(d<qd){qd=d;q=z}}
     if(qd<bd&&!s.wisps.some(w=>segd(w,p,q)<20)){bd=qd;best=p;a.sk=q}}
    if(best){a.m=1;a.rel=0;a.f={x:best.x,y:best.y};inp.down={x:a.f.x,y:a.f.y}}}
   else if(a.rel){a.m=0;a.rel=0}
   else{const f=a.f,q=a.sk,d=Math.hypot(q[0]-f.x,q[1]-f.y),m=80*dt; /* carry at 80 u/s, lift on the socket */
    if(d<=m){f.x=q[0];f.y=q[1];a.rel=1}else{f.x+=(q[0]-f.x)/d*m;f.y+=(q[1]-f.y)/d*m}inp.down={x:f.x,y:f.y}}}
 };
 MINI.tornpage=T;
}
})();
/* GAME:tornpage:END */
/* GAME:oncemore:BEGIN */
(function(){
{ /* Once More! (Nietzsche, "An Eagle Feather"). Helper: mPick. Art: MINI_ART.nietzsche_s. */
 const A="nietzsche_s",GD="#F5C66A",LD="#100B15",CX=96,CY=208,RX=64,RY=30,LAP=12,TAU=6.2832,
 EV=[["rockA",2.0],["glintA",3.6],["rockB",5.0],["gust",7.0],["rockC",9.0],["glintB",10.4]], /* every lap is exactly this, by lap time */
 HOPS=[1.70,3.35,4.70,6.85,8.70,10.15];
 if(typeof SFX!=="undefined"&&!SFX.oncemore_hop){
  SFX.oncemore_hop=()=>{aTone(AN(10),.07,{type:"triangle",v:.07,lp:2400,to:AN(14)});aNoise(.04,{type:"lowpass",f:700,v:.04})};
  SFX.oncemore_glint=()=>{aTone(AN(30),.25,{v:.07,a:.003});aTone(AN(37),.18,{v:.03,at:.03})};
  SFX.oncemore_gust=()=>aNoise(.7,{f:350,to:1500,q:.5,a:.3,v:.07});
  SFX.oncemore_ride=()=>aArp([3,7,10,15],.1,{d:.9,v:.07,type:"sine"});
  SFX.oncemore_again=()=>aNoise(.45,{f:1800,to:500,q:.6,a:.05,v:.05});
  SFX.oncemore_go=()=>aTone(AN(-2),.22,{v:.05,type:"triangle",lp:1200,to:AN(5)});
  SFX.oncemore_trip=()=>{aNoise(.1,{type:"lowpass",f:600,to:250,v:.07});aTone(AN(-10),.14,{v:.06,type:"triangle",lp:500,to:AN(-15)})};
  SFX.oncemore_tick=()=>aTone(AN(8),.05,{v:.05,type:"triangle"});
  SFX.oncemore_feather=()=>{aTone(AN(17),.8,{v:.06,a:.15});aTone(AN(24),.9,{v:.04,at:.2,a:.15})};
 }
 const snd=n=>{if(typeof sfx==="function")sfx(n)};
 const tr=()=>{if(typeof miniTry==="function")miniTry()};
 const ang=t=>Math.PI/2+TAU*t/LAP,pos=t=>[CX+RX*Math.cos(ang(t)),CY+RY*Math.sin(ang(t))],eag=t=>[96+82*Math.cos(ang(t+1.2)),170+26*Math.sin(ang(t+1.2))];
 const inWin=(s,a,b)=>s.hops.some(h=>h>=a-1e-9&&h<=b+1e-9),sm=u=>E.inOut(clamp(u,0,1));
 const newLap=s=>{Object.assign(s,{lapT:0,hops:[],hopT:-9,fi:0,stumbles:0,glints:0,rode:false,g:0,tripT:-9,blown:false,g0:-9,gh:-9,gl:{},ai:0,go:0,mode:"run"});s.lapSeq=++s.laps};
 const air=s=>s.lapT-s.hopT<.5||(s.rode&&s.lapT>=s.g0&&s.lapT<8.2);
 const height=s=>{const t=s.lapT,u=(t-s.hopT)/.5,hp=u>=0&&u<1?40*u*(1-u):0;
  return s.rode&&t>=s.gh&&t<8.2?Math.max(hp,14*sm(Math.min((t-s.gh)/.5,(8.2-t)/.2))):hp};
 const fire=(s,i)=>{const e=EV[i],p=pos(e[1]),y=e[0][0]==="g"&&e[0]!=="gust"?p[1]-12:p[1],R2=v=>Math.round(v*100)/100;
  s.log.push({lap:s.lapSeq,k:e[0],t:e[1],x:R2(p[0]),y:R2(y)});
  if(e[0]==="gust"){s.g=1;snd("oncemore_gust")}
  else if(e[0][0]==="r"){if(!inWin(s,e[1]-.45,e[1]-.05)){s.stumbles++;s.tripT=e[1];snd("oncemore_trip")}}
  else if(inWin(s,e[1]-.37,e[1]-.13)){s.glints++;s.gl[e[0]]=1;snd("oncemore_glint");pSparks(s.P,p[0],y,10,"#FFF0B8",30)}};
 const runner=(c,s)=>{
  const p=pos(s.lapT),h=height(s),t=s.lapT,gl=s.rode&&t>=s.g0&&t<8.2,flip=p[1]>CY&&s.mode==="run",x=p[0],y=p[1],idle=s.mode!=="run",bl=s.blown&&t>=7.15&&t<11.5;
  const nm=gl?"w_glide":h>0?"w_hop":t-s.tripT<.5?"w_trip":!s.rode&&s.blown&&t>=7.15&&t<7.75?"w_stagger":"w_run_"+(s.rm?0:Math.floor(t*8)%4),M=MINI_ART[A],r=M.prects[nm];
  mShadow(c,x,y,12,.4*(1-h/30));
  if(!(idle?mSprO(c,"wanderer_down_0",x-8,y-24):mPerson(c,A,nm,x,y-h,{ax:M.pivots[nm][0]/r[2],ay:1,flip}))){c.fillStyle="#2F7470";c.fillRect(x-5,y-h-20,10,20)}
  glow(c,x+(flip?-6:6),y-h-(idle?9:12),9,"#FFD27A",.45);
  const top=y-h-(idle?24:r[3])+1,u=(t-7.15)/4.35,o=Math.sin(Math.PI*u);
  mPiece(c,A,"hat",bl?x-24*o*(1-u*.2):x,bl?top-30*o+12*u*o:top,{ax:.5,ay:.5,rot:bl?Math.sin(t*9)*.6:0,sm:1})};
 const track=(c,gold,spin)=>{
  c.save();c.strokeStyle="rgba(235,220,185,.22)";c.lineWidth=7;c.beginPath();c.ellipse(CX,CY,RX,RY,0,0,TAU);c.stroke();c.strokeStyle=LD;c.lineWidth=.5;
  for(let i=0;i<40;i++){const a=i/40*TAU+spin,x=CX+RX*Math.cos(a),y=CY+RY*Math.sin(a),w=i%3?5:7;
   for(const[col,al]of[["#8E8A94",1],[GD,gold]])if(al>0){c.globalAlpha=al;c.fillStyle=col;c.beginPath();c.ellipse(x,y,w/2,w*.3,0,0,TAU);c.fill();if(al===1)c.stroke()}}
  c.restore()};
 const eagle=(c,x,y,fl,fr)=>{if(!mPiece(c,A,fr?"eagle_a":"eagle_b",x,y,{ax:.5,ay:.5,flip:fl})){c.fillStyle="#3A3446";c.fillRect(x-14,y-2,28,4)}};
 const back=c=>{if(mBg(c,A,0))return;const g=c.createLinearGradient(0,0,0,160);g.addColorStop(0,"#5B3A5C");g.addColorStop(1,"#E9B46E");c.fillStyle=g;c.fillRect(0,0,192,250);c.fillStyle="#7E8F62";c.fillRect(8,165,182,85)};
 const gate=(c,g)=>{if(!mPiece(c,A,"serpent",96,232,{ax:.5,ay:.5})){c.strokeStyle="#B89A3A";c.lineWidth=2.5;c.beginPath();c.arc(96,232,9,0,TAU);c.stroke()}glow(c,96,232,24,"rgba(255,206,110,.9)",g)};
 const rain=(s,c)=>{const b=s.mode==="run"?sm((s.lapT-6.2)/.8)*(s.lapT<7?1:1-sm((s.lapT-7.4)/.8)):0,tm=s.rm?s.tt*.2:s.tt;
  c.save();c.strokeStyle="rgba(190,180,215,.5)";c.lineWidth=.5;c.beginPath();
  for(let i=0;i<26;i++){const x=(i*37.3)%200-4,y=(tm*170+i*53.7)%340-12;c.moveTo(x,y);c.lineTo(x-1-14*b,y+8)}c.stroke();c.restore()};
 const arrow=(c,x,y,r,a)=>{c.save();c.translate(x,y);c.rotate(a);c.strokeStyle="#2A2A36";c.fillStyle="#2A2A36";c.lineWidth=1.5;c.beginPath();c.arc(0,0,r,0,TAU*.8);c.stroke();
  c.beginPath();c.moveTo(r+3,0);c.lineTo(r-3,0);c.lineTo(r,-5);c.fill();c.restore()};
 const T={
  who:"nietzsche",land:"l1",title:"Once More!",short:true,art:"nietzsche_s",stages:["Once More!"],
  setup:["Suppose this little run came back forever, every rock and every gust exactly the same.","In The Gay Science I called that thought the greatest weight. Could you want it anyway?"],
  how:"Tap to hop. When the lap ends, choose.",
  goal:"Hop the rocks and catch the glints, then choose ‘Once more!’",ctl:"Tap to hop; at the lap’s end tap your choice (Z hops; arrows and Z choose).",
  win:"‘Was that life? Well then! Once more!’ That’s from Zarathustra. Now it’s yours.",
  walk:"Take the feather. My eagle flew in circles too.",
  lines:[null],pad:false,ab:true,bloomT:2.2,limit:90,
  fl:["You said ‘Once more!’","A run you’d gladly live again.","A perfect run, and you rode the gust."],
  flNext:["Learn the rocks. They never change.","Hop just as the gust hits."],
  shotReady:s=>s.mode==="run"&&s.lapT>=7.3&&s.lapT<7.7,
  rate:s=>{const f=s.fin||{stumbles:9,glints:0,rode:false};return f.stumbles===0&&f.glints===2&&f.rode?3:f.stumbles<=1?2:1},
  init(s){Object.assign(s,{W:192,H:320,st:0,stT:0,tt:0,laps:0,log:[],P:pfx(),fin:null,pt:0,ag:0});newLap(s);
   s.K=mPick({items:[{x:26,y:198,w:60,h:40},{x:106,y:198,w:60,h:40}],sel:1})},
  step(s,dt,inp){
   s.tt+=dt;s.stT+=dt;pStep(s.P,dt,s.rm);
   if(s.mode==="run"){
    if(!s.go){s.go=1;snd("oncemore_go");pSparks(s.P,CX,232,6,"#FFE9B8",24)}
    s.lapT=Math.min(LAP,s.lapT+dt);
    if((inp.aTap||inp.taps.length)&&!air(s)){s.hopT=s.lapT;s.hops.push(s.lapT);snd("oncemore_hop");const p=pos(s.lapT);pDust(s.P,p[0],p[1],5)}
    while(s.fi<EV.length&&s.lapT>=EV[s.fi][1])fire(s,s.fi++);
    if(s.g===1){ /* the gust: a hop that starts in [6.80, 7.15] rides it; otherwise it takes the hat */
     if(inWin(s,6.8,7.15)&&s.lapT>=7){s.rode=true;s.gh=s.hops.find(h=>h>=6.8&&h<=7.15);s.g0=Math.max(7,s.gh);s.g=2;snd("oncemore_ride");const p=pos(s.lapT);pSparks(s.P,p[0],p[1]-14,10,"#FFE9B8",30)}
     else if(s.lapT>=7.15){s.blown=true;s.g=2}}
    if(s.lapT>=LAP){s.fin={stumbles:s.stumbles,glints:s.glints,rode:s.rode};s.mode="pick";s.pt=0;s.K.sel=1}}
   else if(s.mode==="pick"){
    s.pt+=dt;const o=s.K.sel,r=s.K.step(dt,inp);if(r<0&&s.K.sel!==o)snd("oncemore_tick");
    if(s.pt>.5&&r===1)return "win";
    if(s.pt>.5&&r===0){s.mode="again";s.ag=0;snd("oncemore_again");tr()}else if(s.pt>=6){tr();newLap(s)}}
   else if((s.ag+=dt)>=.9)newLap(s);
   return null},
  draw(s,c){
   back(c);track(c,0,0);gate(c,0);const lt=s.mode==="run"?s.lapT:LAP;
   EV.forEach((e,i)=>{const p=pos(e[1]),k=e[0];
    if(k[0]==="r"){if(!mPiece(c,A,"rock",p[0],p[1]+2,{ax:.5,ay:1})){c.fillStyle="#7A7680";c.fillRect(p[0]-7,p[1]-8,14,10)}}
    else if(k!=="gust"&&!s.gl[k]&&lt<e[1]+.25){const y=p[1]-12+(s.rm?0:Math.sin(s.tt*4+i));glow(c,p[0],y,8,"rgba(255,235,170,.9)",.5);
     if(!mPiece(c,A,"glint",p[0],y,{ax:.5,ay:.5})){c.fillStyle="#FFF0B8";c.fillRect(p[0]-2,y-2,4,4)}}});
   const ep=eag(lt);
   if(s.mode==="run"&&s.lapT>=6.2&&s.lapT<7)for(let i=0;i<2;i++){const u=(s.tt*2+i*.5)%1;ring(c,ep[0]+(ep[0]<96?-6:6),ep[1]-2,4+u*10,1-u,"#FFE9B8",1)}
   runner(c,s);eagle(c,ep[0],ep[1],ep[1]>170,s.rm||Math.floor(s.tt*5)%2===0);rain(s,c);pDraw(c,s.P,A);
   if(s.mode!=="run"){grade(c,"#0A0710",.35);
    s.K.draw(c,(c,it,i,sel)=>{c.save();c.fillStyle=i?"rgba(245,198,106,"+(sel?.95:.75)+")":"rgba(150,150,162,"+(sel?.95:.75)+")";c.strokeStyle=sel?"#FFF3C8":LD;c.lineWidth=sel?1.5:1;
     c.fillRect(it.x,it.y,it.w,it.h);c.strokeRect(it.x+.5,it.y+.5,it.w-1,it.h-1);c.restore();
     if(!i)arrow(c,it.x+30,it.y+14,6,s.mode==="again"?s.ag*7:0);
     mText(c,i?"Once more!":"Enough",it.x+30,it.y+31,9,i?"#2A1A08":"#1A1A22")})}
   vignette(c,.25)},
  bloom(s,c,k){
   c.save();c.translate(0,-50*sm(k/.3)); /* camera eases up: ring, Wanderer, feather in the top half */
   c.fillStyle="#2B1F28";c.fillRect(0,318,192,60);c.save();c.translate(0,640);c.scale(1,-1);mBg(c,A,0);c.restore();back(c);
   const g=E.out(clamp(k*3,0,1)),u=clamp((k-.1)/.8,0,1),v=1-u,f=clamp((k-.5)/.45,0,1);
   track(c,g,k*TAU);gate(c,.3+.4*Math.sin(k*9)**2);mShadow(c,96,178,12,.4);
   if(!mSprO(c,"wanderer_down_0",88,154)){c.fillStyle="#2F7470";c.fillRect(91,158,10,20)}
   eagle(c,v*v*180+2*v*u*50+u*u*200,v*v*90+2*v*u*170+u*u*60,u<.5,u>.3&&u<.7||Math.floor(k*10)%2===0);
   if(f>0){if(!s.bb){s.bb=1;snd("oncemore_feather")}const fx=lerp(120,100,E.out(f))+Math.sin(f*7)*5*(1-f),fy=lerp(110,150,E.out(f));glow(c,fx+16,fy+16,26,"rgba(255,215,120,.95)",.7*f);
    if(!mArtIcon(c,"feather",fx,fy,2,{rim:LD})){c.strokeStyle=GD;c.lineWidth=1.5;c.beginPath();c.moveTo(fx,fy+20);c.quadraticCurveTo(fx+14,fy+8,fx+20,fy);c.stroke()}}
   if(T.rate(s)>=3)for(let i=0;i<8;i++){const a=(i/8+k)*TAU,x=CX+RX*Math.cos(a),y=CY+RY*Math.sin(a);glow(c,x,y,7,"rgba(255,240,180,.9)",.6*g);
    if(!mPiece(c,A,"glint",x,y-4,{ax:.5,ay:.5,a:g})){c.fillStyle="#FFF0B8";c.fillRect(x-1.5,y-5.5,3,3)}}
   c.restore();vignette(c,.12)},
  auto(s,inp){
   if(s.mode==="run"){if(s.ai<HOPS.length&&s.lapT>=HOPS[s.ai]){inp.aTap=true;s.ai++}}
   else if(s.mode==="pick"&&s.pt>.55){inp.taps=[{x:136,y:218}];inp.tap=inp.taps[0]}}
 };
 MINI.oncemore=T;
}
})();
/* GAME:oncemore:END */
/* GAME:absurd:BEGIN */
(function(){
{
/* The Kite (absurd). Camus, "A Weathered Notebook". Toolkit helper: none (own input; uses rope, wave, glow, gradeN, pfx). */
const K="camus_s",N=["sk_sun","sk_wave","sk_fig","sk_column","sk_ball","sk_boat"];
const T={HOLD:.9,LOSE:.7,WIND:1.2,LO:.35,HI:.75,RISE:12,SLK:14,TGT:8,DIVE:20,DIVE_T:.6,MAXH:180,GOAL:30,SK:5,LIFT:.5,GY:232};
const SEA=[[92,162],[192,162],[192,238],[148,226],[100,212],[62,196],[92,170]];
if(typeof SFX!=="undefined"&&!SFX.absurd_pull){ /* four soft voices, each with its visual cue (string, dark line, sketch, kite on sand) */
  SFX.absurd_pull=()=>{aNoise(.16,{f:700,to:1500,q:3,v:.045,a:.03});aTone(AN(-5),.12,{type:"triangle",v:.03,lp:900,to:AN(-3)})};
  SFX.absurd_gust=()=>aNoise(.8,{f:300,to:1400,q:.5,a:.35,v:.09});
  SFX.absurd_sketch=()=>{aNoise(.12,{type:"highpass",f:3800,q:.7,v:.045,a:.01});aNoise(.1,{f:4600,q:.8,v:.03,at:.1})};
  SFX.absurd_land=()=>{aNoise(.14,{f:1100,to:500,q:.5,v:.06,a:.02});aTone(AN(-12),.14,{v:.05,lp:500,to:AN(-17)})};
  SFX.absurd_lift=()=>{aNoise(.4,{f:500,to:1400,q:.6,a:.15,v:.05});aTone(AN(0),.3,{v:.04,type:"triangle",to:AN(7),lp:1500})}; /* the kite leaves the sand */
  SFX.absurd_fin=()=>aArp([0,4,7,12],.09,{d:.7,v:.05,lp:3000}); /* the notebook opens in the bloom */
  GAP.absurd_pull=.35;GAP.absurd_land=.3}
function rng(a){return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function pick(s){s.tgt=.1+.9*s.R();s.tgtIn=1.5+2*s.R();if(s.tg.length<300)s.tg.push(s.tgt)}
function land(s){sfx("absurd_land");if(typeof miniTry==="function")miniTry();pDust(s.P,s.kx,T.GY+4,6)}
function seaPath(c){c.beginPath();SEA.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath()}
function sketch(c,i,x,y,sc,a){if(!(a>0))return;if(!mPiece(c,K,N[i],x,y,{sc,a})){c.save();c.globalAlpha=a;c.fillStyle="#EBD9AE";c.fillRect(x,y,12*sc,12*sc);c.strokeStyle="#7A5A44";c.lineWidth=sc*.6;c.beginPath();c.arc(x+6*sc,y+6*sc,(1.5+i*.6)*sc,0,7);c.stroke();c.restore()}}
function back(s,c,h,t,f){ /* the beach: art or plain shapes, then sun and sea glitter that grow with the kite's height */
  if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,175);g.addColorStop(0,"#6d8fb8");g.addColorStop(1,"#f4cf86");c.fillStyle=g;c.fillRect(0,0,192,175);
    c.fillStyle="#DCBC8C";c.fillRect(0,175,192,90);c.fillStyle="#6B4A44";c.fillRect(0,265,192,55);c.fillStyle="#3C5A82";seaPath(c);c.fill();c.fillStyle="#FFD98A";c.beginPath();c.arc(149,145,16,Math.PI,0);c.fill()}
  const k=h/T.MAXH,n=4+Math.floor(k*12)+(f||1)*2,q=s.rm?0:Math.floor(t/380);c.save();c.fillStyle="#FFE9B8";
  for(let i=0;i<n;i++){const u=Math.sin((i+1)*91.7+q*7.3)*.5+.5,v=Math.sin((i+1)*37.1+q*3.1)*.5+.5;c.globalAlpha=.35+.5*k;c.fillRect(hs(118+u*66),hs(163+v*11),1.5,.8)}c.restore();
  glow(c,149,145,34+k*28,"#FFC860",.1+.34*k+.05*(f||1))}
function person(c,s,pull){const A=pull?"w_reel_pull":"w_reel_give";mShadow(c,40,236,14,.35);
  if(!mPerson(c,K,A,40,236,{ax:pull?.5:.53,ay:1})){c.fillStyle="#2F7470";c.fillRect(33,218,14,18);c.fillStyle="#F5C66A";c.fillRect(36,222,8,6)}
  if(!mPiece(c,K,"reel",pull?43:44,229,{ax:.5,ay:.5})){c.fillStyle="#8A6A48";c.fillRect(40,224,8,10)}}
function kite(c,s,h,x,tight,t){const y=T.GY-h,ft=s.rm?0:Math.sin(t/230)*.5,tl=1.25*Math.max(0,1-h/16),
  rot=(tight?(s.rm?.2:.262*Math.sin(t/55)):ft*.08)+tl,col=s.tau<T.LO?"#9A93A0":tight?"#FFF1C8":"#F5C66A";
  const hx=s.hold?43:44;rope(c,hx,226,x,y+8,(1-s.tau)*20,col,tight?1.4:1);
  if(!mPiece(c,K,"kite",x,y,{ax:.5,ay:.5,rot,sm:true})){c.save();c.translate(x,y);c.rotate(rot);c.fillStyle="#EBD9AE";c.beginPath();c.moveTo(0,-14);c.lineTo(8,-3);c.lineTo(0,12);c.lineTo(-8,-3);c.fill();c.restore()}}
function gauge(c,s){const y=v=>236-40*v,col=s.tau<T.LO?"#9A93A0":s.tau>T.HI?"#FFF1C8":"#F5C66A";c.fillStyle="rgba(16,11,21,.7)";c.fillRect(11,195,6,42);
  c.fillStyle="rgba(245,198,106,.4)";c.fillRect(12,y(T.HI),4,40*(T.HI-T.LO));c.fillStyle=col;c.beginPath();c.moveTo(18,y(s.tau));c.lineTo(23,y(s.tau)-3);c.lineTo(23,y(s.tau)+3);c.fill()}
function book(c,s){if(!mPiece(c,K,"notebook",140,4)){c.fillStyle="#EBD9AE";c.fillRect(140,4,48,31);c.strokeStyle="#2A3A66";c.strokeRect(140,4,48,31)}
  for(let i=0;i<s.sk;i++){const p=s.rm?1:Math.min(1,s.popT[i]/.4),x=145+14*(i%3),y=8+12*((i/3)|0);sketch(c,i,x,y,1,p);if(!s.rm&&p<1)glow(c,x+6,y+6,10,"#F5C66A",.5*(1-p))}}
function wind(s,c){if(s.tele<0)return;const p=Math.min(1,s.tele/.8);c.save();seaPath(c);c.clip();c.globalAlpha=s.rm?.55*p:.6;
  wave(c,86,s.rm?190:162+p*60,110,1.2,7,s.rm?0:s.ck*3,0,"#1B1530",1.6);c.restore()}
MINI.absurd={
  who:"camus",land:"l1",title:"The Kite",short:true,art:K,stages:["The Kite"],
  setup:["I grew up poor in Algiers, rich in sun and sea.","We ask the world for meaning. It never answers. Fly anyway."],
  how:"Hold to pull the string. Let go to give it line.",
  goal:"Fly the kite for 30 seconds, keeping the line neither slack nor tight.",ctl:"Hold anywhere to pull the string; let go to give it line (hold Z).",
  win:"It never answered you. You kept the line taut and flew anyway. That’s the whole trick.",
  walk:"Take the notebook. Fill it with what the sun shows you.",
  lines:[null],pad:false,ab:true,bloomT:2.2,limit:90,
  fl:["The kite flew.","You kept the line alive.","Taut and high the whole time, never grounded."],
  flNext:["Give it line when the wind gusts.","Pull gently when the string goes slack."],
  rate(s){const r=s.flightT>0?s.aliveT/s.flightT:0;return r>=.85&&s.landed===0?3:r>=.7?2:1},
  init(s){s.R=rng(s.seed!=null?s.seed:(Math.random()*4e9)|0);s.st=0;s.stT=0;
    Object.assign(s,{h:0,tau:0,w:.5,gIn:5+3*s.R(),gust:0,tele:-1,liftT:0,tightT:0,launched:false,aliveT:0,flightT:0,landed:0,sk:0,hold:false,was:false,
      lock:null,gl:[],tg:[],tl:[],P:pfx(),kx:110,creak:0,ck:0,popT:[0,0,0,0,0,0]});pick(s)},
  step(s,dt,inp){s.ck+=dt;
    s.tgtIn-=dt;if(s.tgtIn<=0)pick(s); /* the wind: a new random target every 1.5-3.5 s, eased at 1.2/s; no pattern */
    s.gIn-=dt;if(s.gIn<=.8&&s.tele<0&&s.gust<=0){s.tele=0;sfx("absurd_gust");if(s.tl.length<300)s.tl.push(s.ck)}
    if(s.tele>=0)s.tele+=dt;
    if(s.gIn<=0){s.gust=.8;s.gIn=5+3*s.R();s.tele=-1;if(s.gl.length<300)s.gl.push(s.ck)}
    if(s.gust>0){s.gust-=dt;s.w=1}else s.w+=clamp(s.tgt-s.w,-T.WIND*dt,T.WIND*dt);
    const on=!!(inp.a||inp.down);s.hold=on;s.creak-=dt;if(on&&!s.was&&s.creak<=0){sfx("absurd_pull");s.creak=.4}s.was=on;
    s.tau=clamp(s.tau+((on?T.HOLD:-T.LOSE)+(s.w-.45)*T.WIND)*dt,0,1);if(s.lock!=null)s.tau=s.lock; /* lock: kit tests only */
    const al=s.tau>=T.LO&&s.tau<=T.HI;if(s.launched)s.flightT+=dt;
    if(s.h<=0){s.h=0;s.tightT=0;if(al){s.liftT+=dt;if(s.liftT>=T.LIFT){s.liftT=0;s.launched=true;s.h=T.RISE*dt;sfx("absurd_lift");pDust(s.P,s.kx,T.GY+4,5)}}else s.liftT=0}
    else{if(al){s.h+=T.RISE*dt;s.aliveT+=dt;s.tightT=0}
      else if(s.tau<T.LO){s.h-=T.SLK*dt;s.tightT=0}
      else{s.tightT=s.tau>=1?s.tightT+dt:0;s.h-=(s.tightT>=T.DIVE_T?T.DIVE:T.TGT)*dt}
      if(s.h>=T.MAXH)s.h=T.MAXH;
      if(s.h<=0){s.h=0;s.liftT=0;if(s.launched)s.landed++;land(s)}}
    const tx=110+30*clamp((s.w-.55)/.45,-1,1)*Math.min(1,s.h/40);s.kx+=(tx-s.kx)*Math.min(1,dt*2.5);
    const n=Math.min(6,Math.floor(s.aliveT/T.SK+1e-9));while(s.sk<n){s.popT[s.sk]=0;s.sk++;sfx("absurd_sketch")}
    for(let i=0;i<s.sk;i++)s.popT[i]+=dt;pStep(s.P,dt,s.rm);
    return s.aliveT>=T.GOAL?"win":null},
  draw(s,c,t){back(s,c,s.h,t,1);wind(s,c);person(c,s,s.hold);
    kite(c,s,s.h,s.kx+(s.rm?0:Math.sin(t/420)*Math.min(2,s.h/30)),s.h>0&&s.tau>T.HI,t);gauge(c,s);book(c,s);pDraw(c,s.P,K)},
  bloom(s,c,k,t){const f=s._fl||1,h=lerp(s.h,T.MAXH,E.out(Math.min(1,k*3)));back(s,c,T.MAXH*Math.min(1,k*3),t,f);person(c,s,true);
    s.tau=.55;s.hold=true;kite(c,s,h,lerp(s.kx,110,E.out(Math.min(1,k*3))),false,t);
    const g=Math.floor(t/180)%2,gx=lerp(-20,170,E.out(Math.min(1,k/.9)));
    [[gx,70],[gx-14,56]].forEach((p,i)=>{if(!mPiece(c,K,(s.rm?0:(g+i)%2)?"gull_b":"gull_a",p[0],p[1],{ax:.5,ay:.5})){c.fillStyle="#fff";c.fillRect(p[0]-6,p[1],12,2)}});
    const o=E.out(Math.min(1,Math.max(0,(k-.12)/.4)));
    if(o>0){if(!s.bb){s.bb=1;sfx("absurd_fin")}c.save();c.beginPath();c.rect(96-48*o,70,96*o,80);c.clip();
      if(!mPiece(c,K,"notebook",96,110,{ax:.5,ay:.5,sc:2})){c.fillStyle="#EBD9AE";c.fillRect(48,78,96,63)}c.restore()}
    for(let i=0;i<6;i++)sketch(c,i,84+(i%3-1)*26,82+((i/3)|0)*28,2,s.rm?1:clamp((k-.35-i*.07)/.1,0,1));
    gradeN(c,"warm",.2*k)},
  auto(s,inp){if(s.tau<.5)inp.a=true}
};
}
})();
/* GAME:absurd:END */
/* GAME:excuses:BEGIN */
(function(){
{
  const K="sartre_s",TB=[[50,96],[142,96],[96,136],[46,176],[146,176],[96,216]],ST=TB.map(p=>[p[0],p[1]+12]);
  const RT=[[30,54],[26,86],ST[0],ST[1],ST[2],ST[3],ST[4],ST[5],[24,200],[24,70]]; /* the perfect waiter's route: counter, T1..T6 (indices 2..7), back */
  const st=(a,b)=>ST.slice(a,b).map((p,i)=>[p[0],p[1],1,a+i]),AU=[[30,57,0],[26,86,0],...st(0,3),[24,100,0],[28,53,2],...st(3,6)];
  const dr=(x,y)=>Math.abs(x)>Math.abs(y)?(x<0?"left":"right"):(y<0?"up":"down"),fr=d=>[0,1,0,2][Math.floor(d/6)%4],z6=()=>[0,0,0,0,0,0];
  let CV=null;
  if(typeof SFX!=="undefined"){
    SFX.excuses_serve=()=>{aTone(AN(27),.22,{v:.06,lp:3500,a:.002});aTone(AN(34),.3,{v:.035,at:.04,a:.002})};
    SFX.excuses_spill=()=>{aNoise(.3,{f:1500,to:600,q:.7,v:.1});aTone(AN(-2),.12,{v:.04,to:AN(-9)})};
    SFX.excuses_role=()=>aArp([31,33,35],.11,{d:.08,v:.04,lp:4000});
    SFX.excuses_free=()=>aArp([19,15,12],.07,{d:.5,v:.05});
    SFX.excuses_done=()=>aArp([24,28,31,36],.08,{d:.6,v:.045,lp:4000}); /* the full tray lifts in the bloom */
  }
  const pp=(c,n,x,y,o)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n];if(!r)return false;const p=A.pivots[n]||[r[2]/2,r[3]];return mPerson(c,K,n,x,y,Object.assign({ax:p[0]/r[2],ay:p[1]/r[3]},o))};
  const body=(c,x,y,col)=>{mShadow(c,x,y,10);c.fillStyle=col;c.fillRect(x-4,y-14,8,12);c.fillRect(x-3,y-20,6,6)};
  const dsat=(c,x,y,d,f)=>{if(d<.02||!CV)return f(c,x,y);const g=CV.getContext("2d");g.clearRect(0,0,40,40);g.imageSmoothingEnabled=false;f(g,20,32);
    g.globalCompositeOperation="saturation";g.globalAlpha=d;g.fillStyle="#808080";g.fillRect(0,0,40,40);g.globalAlpha=1;g.globalCompositeOperation="destination-in";f(g,20,32);g.globalCompositeOperation="source-over";c.drawImage(CV,hs(x-20),hs(y-32))};
  const serve=(s,i,role)=>{if(s.sv[i])return;s.sv[i]=1;s.n++;s.fly.push({i,t:0,sx:s.x,sy:s.y-12});s.gl[i]=.8;s.sT=.4;if(!role)s.cups--;sfx("excuses_serve");if(s.n>=6)s.wt=.6};
  const free=s=>{s.role=false;s.sd=.7;s.hold=0;s.dr=0;s.ov=0;const o=s.o,l=Math.hypot(o.vx,o.vy),nx=l?-o.vy/l:1,ny=l?o.vx/l:0;
    for(const q of[1,-1]){const x=o.x+nx*12*q,y=o.y+ny*12*q;if(!blk(x,y)){s.x=x;s.y=y;break}}s.vx=s.vy=0;sfx("excuses_free")};
  const blk=(x,y)=>x<24||x>184||y<52||y>246||(x>=58&&y>62&&y<83);
  const strings=(c,s,a)=>{if(a<=0)return;const sg=s.role?1:2+(1-a)*14,col=`rgba(236,228,255,${.75*a})`,x=s.x,y=s.y;
    rope(c,x-18,0,x,y-25,sg,col,.5);rope(c,x,0,x-8,y-12,sg,col,.5);rope(c,x+18,0,x+8,y-12,sg,col,.5)};
  const tray=(c,x,y,th,n)=>{c.save();c.translate(hs(x),hs(y-11));c.rotate(th*25*Math.PI/180);
    if(!mPiece(c,K,"tray",0,0,{ax:.5,ay:.5})){c.fillStyle="#bcbcc8";c.fillRect(-10,-2,20,3)}
    for(let i=0;i<n;i++)mPiece(c,K,"cup",-6+i*6,-2.5,{ax:.5,ay:1});c.restore()};
  const rd=(s,c,t,k)=>{const bl=k!=null,o=s.o,cp=(x,y,o)=>mPiece(c,K,"cup",x,y,Object.assign({ax:.5,ay:1},o));
    if(!mBg(c,K,0)){c.fillStyle="#2a1c1f";c.fillRect(0,0,192,320);c.fillStyle="#463634";c.fillRect(16,84,176,166);c.fillStyle="#6a4430";c.fillRect(62,62,130,20)}
    const lw=.3+.5*(k||0);[68,128,196].forEach(y=>glow(c,24,y,38,"rgba(255,190,100,.9)",lw));if(bl)gradeN(c,"warm",.25*k);
    let px=s.x,py=s.y;if(bl){const e=E.inOut(Math.min(1,k/.7));px=lerp(s.x,96,e);py=lerp(s.y,58,e)}
    const D=[];
    TB.forEach((p,i)=>D.push([p[1]+10,()=>{const [x,y]=p,sv=bl||s.sv[i];
      if(!pp(c,"guest"+i+(sv?"_cheer":"_wait"),x,y+2)){mShadow(c,x,y+2,10);c.fillStyle=sv?"#d8b080":"#a07850";c.fillRect(x-4,y-12,8,12)}
      if(!mPiece(c,K,"table",x,y,{ax:.5,ay:.5})){c.fillStyle="#d8d4d0";c.fillRect(x-12,y-6,24,10)}
      const f=s.fly.find(q=>q.i===i);
      if(sv&&!bl&&(!f||f.t>=1))cp(x-3,y-1);
      else if(f&&f.t<1&&!bl){const e=f.t;cp(lerp(f.sx,x-3,e),lerp(f.sy,y-1,e)-Math.sin(e*Math.PI)*10)}
      if(bl)cp(x+4,y-18-8*E.out(k),{a:Math.min(1,k*2)});
      else if(!sv){c.fillStyle="#fffbeb";c.fillRect(x-7,y-31,14,11);c.fillRect(x-1,y-20,2,2);cp(x,y-23)}
      if(s.gl[i]>0&&!bl)glow(c,x,y-6,22,"rgba(255,220,130,.9)",s.gl[i])}]));
    D.push([py,()=>{const d=bl?0:s.des,w=Math.hypot(s.vx,s.vy),dir=s.dr2||"down",f=w>3&&!bl?fr(s.wk):0;
      dsat(c,px,py,d,(g,x,y)=>{if(!pp(g,s.sT>0&&!bl?"wt_serve":`wt_${dir}_${f}`,x,y))body(g,x,y,"#2f7470")});
      if(!bl||k<.6)tray(c,px,py,bl?0:s.th,bl?3:s.cups)}]);
    const oa=bl?.7*(1-k):(s.rm?.7:.6+.15*Math.sin(t/160));
    if(oa>.01)D.push([o.y,()=>{const e=1-o.w,nm=o.w>0?(e<.6?"ow_spin_"+(Math.floor(e/.15)%2):"ow_bow"):`ow_${o.dir}_${fr(o.d)}`;
      if(!pp(c,nm,o.x,o.y,{a:oa})){c.strokeStyle="#fff";c.strokeRect(o.x-5,o.y-20,10,20)}}]);
    D.sort((a,b)=>a[0]-b[0]);D.forEach(d=>d[1]());
    s.sp.forEach(q=>cp(q.x,q.y,{a:1-q.t}));pDraw(c,s.P,K);
    if(!bl){strings(c,s,s.role?s.sa:s.sd>0?s.sd/.7:0);if(s.rf>0)ring(c,s.x,s.y-30,5,s.rf/.5,"#F5C66A",1.5)}
    else if(s.sa>0)strings(c,s,1-k);
    if(bl&&k>=.6){tray(c,96,56,0,3);if(!s.bb){s.bb=1;sfx("excuses_done")}}};
  MINI.excuses={who:"sartre",land:"l1",title:"Playing the Waiter",short:true,art:K,stages:["Playing the Waiter"],
    setup:["That waiter’s every move is a little too perfect. He’s playing at being a waiter.","It’s comfortable to become a role. It’s also a way to hide from your freedom."],
    how:"Move smoothly to keep the tray level. Stop by a table to serve.",
    goal:"Serve all six tables, and don’t get pulled into the perfect waiter’s routine.",ctl:"Drag to walk with the tray; stop by a table to serve it (arrow keys to walk).",
    win:"You served every table, and you did it as yourself. The job didn’t do it for you.",
    walk:"Take the tray. Carry it, but don’t pretend it carries you.",
    lines:[null],pad:true,ab:false,bloomT:2,limit:90,
    fl:["Every table served.","Mostly as yourself.","All as yourself, with a steady tray."],flNext:["Step out of the outline.","Never turn around at full speed."],
    rate:s=>s.roleT===0&&s.spills<=1?3:s.roleT<=10&&s.spills<=3?2:1,
    init(s){CV=CV||document.createElement("canvas");CV.width=CV.height=40;
      Object.assign(s,{st:0,stT:0,x:96,y:62,vx:0,vy:0,th:0,cups:3,rg:[],spills:0,sv:z6(),n:0,nt:z6(),gl:z6(),fly:[],sp:[],sT:0,rf:0,wk:0,dr2:"down",
        role:false,roleT:0,ov:0,hold:0,dr:0,des:0,sa:0,sd:0,wt:0,P:pfx(),au:0,
        o:{x:RT[0][0],y:RT[0][1],i:1,w:0,tb:-1,vx:0,vy:0,dir:"down",d:0}})},
    shotReady(s){return s.n>=3},
    step(s,dt,inp){s.stT+=dt;const o=s.o;
      if(o.w>0){const was=o.w;o.w-=dt;o.vx=o.vy=0;if(was>.5&&o.w<=.5&&s.role)serve(s,o.tb,1);if(o.w<=0){o.w=0;o.i=(o.i+1)%RT.length}}
      else{const p=RT[o.i],dx=p[0]-o.x,dy=p[1]-o.y,d=Math.hypot(dx,dy),m=30*dt;
        if(d<=m){o.x=p[0];o.y=p[1];o.vx=o.vy=0;if(o.i>=2&&o.i<=7){o.w=1;o.tb=o.i-2}else o.i=(o.i+1)%RT.length}
        else{o.x+=dx/d*m;o.y+=dy/d*m;o.vx=dx/d*30;o.vy=dy/d*30;o.d+=m;o.dir=dr(dx,dy)}}
      if(s.role){s.roleT+=dt;s.th=0;s.cups=3;const k=Math.min(1,dt*10);s.x+=(o.x-s.x)*k;s.y+=(o.y-s.y)*k;s.vx=o.vx;s.vy=o.vy;
        s.sa=Math.min(1,s.sa+dt*2);s.des=Math.min(.8,s.des+.25*dt);s.dr2=o.dir;
        s.hold=(inp.dx||inp.dy)?s.hold+dt:0;if(inp.down&&inp.drag)s.dr+=Math.hypot(inp.drag.dx||0,inp.drag.dy||0);if(!inp.down)s.dr=0;
        if(s.hold>=.6||s.dr>=20)free(s)}
      else{
        let tx=0,ty=0;
        if(inp.dx||inp.dy){tx=inp.dx*42;ty=inp.dy*42;const m=Math.hypot(tx,ty);if(m>42){tx*=42/m;ty*=42/m}}
        else if(inp.down){const dx=inp.down.x-s.x,dy=inp.down.y-s.y,d=Math.hypot(dx,dy),q=clamp((d-3)/18,0,1);if(d>0){tx=dx/d*q*42;ty=dy/d*q*42}}
        const dvx=tx-s.vx,dvy=ty-s.vy,dl=Math.hypot(dvx,dvy),mm=160*dt;let nvx=tx,nvy=ty;if(dl>mm){nvx=s.vx+dvx/dl*mm;nvy=s.vy+dvy/dl*mm}
        const ax=(nvx-s.vx)/dt;s.vx=nvx;s.vy=nvy;
        s.th+=(-.012*ax-3*s.th)*dt;
        let nx=s.x+s.vx*dt,ny=s.y;if(blk(nx,ny)){nx=s.x;s.vx=0}ny=s.y+s.vy*dt;if(blk(nx,ny)){ny=s.y;s.vy=0}
        const w=Math.hypot(s.vx,s.vy);s.wk+=w*dt;s.x=nx;s.y=ny;if(w>3)s.dr2=dr(s.vx,s.vy);
        if(Math.abs(s.th)>=.5){if(s.cups>0){s.spills++;s.cups--;s.rg.push(1);s.sp.push({x:s.x+(s.th>0?9:-9),y:s.y-8,vx:s.th>0?20:-20,vy:-25,t:0});
            pSparks(s.P,s.x+(s.th>0?8:-8),s.y-10,8,"#7a4a2a",30);sfx("excuses_spill");s.th=0}else s.th=Math.sign(s.th)*.5}
        for(let i=0;i<6;i++){if(s.sv[i])continue;if(Math.hypot(s.x-TB[i][0],s.y-TB[i][1])<=14&&w<6&&s.cups>0){s.nt[i]+=dt;if(s.nt[i]>=.3)serve(s,i,0)}else s.nt[i]=0}
        if(s.y<56&&s.cups<3){s.rf+=dt;if(s.rf>=.5){s.cups=3;s.rg=[];s.rf=0;sfx("clink")}}else s.rf=0;
        s.sa=Math.max(0,s.sa-dt*2);s.sd=Math.max(0,s.sd-dt);s.des=Math.max(0,s.des-.4*dt);
        if(Math.hypot(s.x-o.x,s.y-o.y)<10){s.ov+=dt;if(s.ov>=.5){s.role=true;s.sa=0;s.sd=0;s.hold=0;s.dr=0;s.cups=3;s.th=0;sfx("excuses_role");if(typeof miniTry==="function")miniTry()}}else s.ov=0}
      s.rg=s.rg.map(v=>v-dt).filter(v=>{if(v<=0){s.cups=Math.min(3,s.cups+1);return false}return true});
      s.fly.forEach(f=>f.t=Math.min(1,f.t+dt/.35));s.sp.forEach(q=>{q.t+=dt*1.5;q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=120*dt});s.sp=s.sp.filter(q=>q.t<1);
      for(let i=0;i<6;i++)s.gl[i]=Math.max(0,s.gl[i]-dt*1.3);s.sT=Math.max(0,s.sT-dt);
      pStep(s.P,dt,s.rm);
      if(s.wt>0){s.wt-=dt;if(s.wt<=0)return"win"}return null},
    draw(s,c,t){rd(s,c,t,null)},
    bloom(s,c,k,t){rd(s,c,t,k)},
    auto(s,inp){while(s.au<AU.length&&AU[s.au][2]===1&&s.sv[AU[s.au][3]])s.au++;if(s.au>=AU.length)return;
      const n=AU[s.au],dx=n[0]-s.x,dy=n[1]-s.y,d=Math.hypot(dx,dy),ox=s.x-s.o.x,oy=s.y-s.o.y,od=Math.hypot(ox,oy),v=Math.min(30,d*5)/42;
      if(d<4&&(n[2]===0||n[2]===2&&s.cups===3)){s.au++;return}
      if(od<14){inp.dx=ox/od*.7;inp.dy=oy/od*.7;return}
      if(od>=22&&d>1){inp.dx=dx/d*v;inp.dy=dy/d*v}}
  };
}
})();
/* GAME:excuses:END */
/* GAME:medal:BEGIN */
(function(){
{
  /* No, Thank You. Toolkit helpers: none (own input). Art: sartre_s. */
  const K="sartre_s",DK=[48,190],DR=[160,110],OF=[138,130],WR=[80,207];
  const HP=[2,5,8,10,13,15],HN=["laurel","sash","bust","plate_name","medal","prize_box"],WK=["pages","letter","book","pages","letter","pen","pages","book","letter","cup"];
  const ITEMS=[];{let h=0,w=0;for(let i=0;i<16;i++)ITEMS.push(HP.includes(i)?HN[h++]:WK[w++])}
  if(typeof SFX!=="undefined"){
    SFX.medal_keep=()=>{aNoise(.16,{f:2400,to:900,q:.5,a:.03,v:.05});aTone(AN(3),.1,{v:.04,type:"triangle",at:.1})};
    SFX.medal_return=()=>{aTone(AN(24),.5,{v:.06,a:.004});aTone(AN(31),.45,{v:.035,at:.12,a:.004})};
    SFX.medal_bronze=()=>{aTone(AN(-17),.9,{v:.08,type:"triangle",lp:520,a:.12});aTone(AN(-10),.7,{v:.03,at:.1,a:.1,lp:700})};
    SFX.medal_arrive=()=>aNoise(.09,{type:"highpass",f:2500,q:.5,v:.03,a:.01}); /* a thing appears at the top */
    SFX.medal_sign=()=>{aNoise(.7,{type:"highpass",f:3200,q:.6,a:.1,v:.03});aTone(AN(15),.8,{v:.04,at:.5,a:.02})}; /* the pen signs in the bloom */
    SFX.medal_default=()=>{aTone(AN(10),.07,{v:.05,type:"triangle"});aNoise(.04,{f:3000,q:2,v:.025})};
  }
  const pc=(c,n,x,y,o)=>mPiece(c,K,n,x,y,o);
  const pp=(c,n,x,y,o)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n];if(!r)return false;const p=A.pivots[n]||[r[2]/2,r[3]];return mPerson(c,K,n,x,y,Object.assign({ax:p[0]/r[2],ay:p[1]/r[3]},o))};
  const item=(c,k,x,y,sc,h)=>{x=hs(x);y=hs(y);if(h)glow(c,x,y,18,"rgba(255,205,110,.9)",.45);
    if(!pc(c,k,x,y,{ax:.5,ay:.5,sc})){c.fillStyle=h?"#e0b040":"#e8e2d0";c.fillRect(x-7,y-5,14,10)}};
  const done=(s,f)=>{if(f.m==="s"){s.ob=.6;if(f.h)s.rh.push(f.k);sfx("medal_return")}
    else if(f.h){s.hk.push(f.k);s.bronze=Math.min(4,s.bronze+1);sfx("medal_bronze")}else{s.pg++;if(f.d)s.mk.push([34+s.mk.length*7%36,196])}};
  const go=(s,a)=>{const it=s.it;s.fl.push({k:it.k,h:it.h,m:a===2?"s":"k",d:a===3,x:it.x,y:it.y,f:0});s.it=null;s.gap=.4;s.i++;
    if(a===2){if(!it.h)s.workSent++}else{if(it.h){s.honorsKept++;if(typeof miniTry==="function")miniTry()}if(a===3){s.defaults++;sfx("medal_default")}else sfx("medal_keep")}};
  const rd=(s,c,t,k)=>{const bl=k!=null,e=bl?E.out(k):0;c.fillStyle="#0a0710";c.fillRect(0,0,192,320);c.save();c.translate(0,-30*e);
    if(!mBg(c,K,0)){c.fillStyle="#2a1c1f";c.fillRect(0,0,192,320);c.fillStyle="#463634";c.fillRect(16,84,176,166)}
    gradeN(c,"warm",.3);
    if(!pc(c,"cafe_door",DR[0],DR[1],{ax:.5,ay:.5})){c.fillStyle="#5a3a2a";c.fillRect(149,90,22,40)}
    let ox=OF[0],oa=1;if(bl){const u=Math.min(1,k/.5);ox=lerp(OF[0],DR[0],E.inOut(u));oa=k<.55?1:Math.max(0,1-(k-.55)/.2)}
    if(oa>0){const nm=s.ob>0&&!bl?"official_bow":"official_stand";if(!pp(c,nm,ox,OF[1],{a:oa})){c.fillStyle="#808088";c.fillRect(ox-4,OF[1]-20,8,20)}
      if(bl)s.rh.forEach((n,i)=>pc(c,n,ox-8+i*3,OF[1]-22-i*2,{ax:.5,ay:1,a:oa}))}
    if(!pc(c,"desk",DK[0],DK[1],{ax:.5,ay:.5})){c.fillStyle="#6a4430";c.fillRect(24,174,48,36)}
    glow(c,36,177,bl?20+22*k:20,"rgba(255,215,140,.9)",bl?.25+.5*k:.25);
    for(let i=0;i<Math.min(6,s.pg+1);i++)pc(c,"pages",52,186-i*1.5,{ax:.5,ay:.5});
    c.strokeStyle="#1a1530";c.lineWidth=.6;s.mk.forEach(m=>{c.beginPath();c.moveTo(m[0],m[1]);c.quadraticCurveTo(m[0]+2,m[1]-3,m[0]+4,m[1]);c.stroke()});
    s.hk.forEach((n,i)=>pc(c,n,30+i*8,180,{ax:.5,ay:.5}));
    if(bl&&k>.3){if(!s.bb){s.bb=1;sfx("medal_sign")}const u=Math.min(1,(k-.3)/.6);c.beginPath();c.moveTo(46,187);for(let i=1;i<=12*u;i++)c.lineTo(46+i*1.2,187-Math.sin(i*1.3)*1.5);c.stroke()}
    const bz=bl?s.bz*Math.max(0,1-k*1.4):s.bz;if(bz>3.5){c.fillStyle="#6c645a";c.fillRect(WR[0]-11,WR[1]-3,22,7);c.fillStyle="#8c8478";c.fillRect(WR[0]-11,WR[1]-3,22,1.5)}
    const fr=Math.floor(s.wk/.45)%2;mShadow(c,WR[0],WR[1],12);if(!pp(c,"w_write_"+fr,WR[0],WR[1])){c.fillStyle="#2f7470";c.fillRect(WR[0]-4,WR[1]-18,8,18)}
    const n=Math.floor(bz);if(n>=1)pp(c,"bronze_"+Math.min(4,n),WR[0],WR[1]);if(n<4&&bz-n>.02)pp(c,"bronze_"+(n+1),WR[0],WR[1],{a:bz-n});
    const it=s.it;if(it&&!bl)item(c,it.k,it.x,it.y,2,it.h);
    s.fl.forEach(f=>{const u=E.out(f.f),tx=f.m==="s"?OF[0]:48,ty=f.m==="s"?OF[1]-18:184;item(c,f.k,lerp(f.x,tx,u),lerp(f.y,ty,u),Math.max(1,2-u),f.h)});
    c.restore()};
  MINI.medal={who:"sartre",land:"l1",title:"No, Thank You",short:true,art:K,stages:["No, Thank You"],
    setup:["In 1964 they offered me the Nobel Prize. I said no.","I had always refused official honors. A writer shouldn’t let himself become an institution."],
    how:"Tap the desk to keep a thing. Tap the door to send it back.",
    goal:"Keep the work on your desk, and send every honor back through the door.",ctl:"Tap the desk to keep it, or the door to send it back (left arrow keeps, right sends).",
    win:"Still just a man at a desk, signing his own name. That’s all I wanted.",
    walk:"Take the medal I didn’t keep. And never tell yourself you had no choice.",
    lines:[null],pad:false,ab:false,bloomT:2,limit:90,
    fl:["You stayed a writer.","You kept few honors.","No honors, and every choice your own."],flNext:["Send the honors back through the door.","Choose before a thing lands."],
    rate:s=>s.honorsKept===0&&s.defaults===0&&s.workSent<=1?3:s.honorsKept<=2?2:1,
    init(s){Object.assign(s,{st:0,stT:0,i:0,it:null,gap:.5,fl:[],hk:[],mk:[],rh:[],pg:0,honorsKept:0,defaults:0,workSent:0,bronze:0,bz:0,ob:0,wk:0,wt:-1})},
    shotReady(s){return s.i>=7},
    step(s,dt,inp){s.stT+=dt;s.bz+=Math.sign(s.bronze-s.bz)*Math.min(Math.abs(s.bronze-s.bz),dt*.8);s.ob=Math.max(0,s.ob-dt);s.wk+=dt*(s.bronze>=4?0:s.bronze>=2?.5:1);
      s.fl.forEach(f=>{f.f=Math.min(1,f.f+dt/.4);if(f.f>=1)done(s,f)});s.fl=s.fl.filter(f=>f.f<1);
      const it=s.it;
      if(!it){if(s.i<16){s.gap-=dt;if(s.gap<=0){s.it={k:ITEMS[s.i],h:HP.includes(s.i),t:0,x:96,y:40};sfx("medal_arrive")}}else if(!s.fl.length){if(s.wt<0)s.wt=.3;s.wt-=dt;if(s.wt<=0)return"win"}}
      else{it.t+=dt;it.y=40+130*it.t/3;it.x=96+(s.rm?0:Math.sin(it.t*2.2)*3);let a=inp.lTap?1:inp.rTap?2:0;
        for(const p of inp.taps||[])a=Math.hypot(p.x-DK[0],p.y-DK[1])<Math.hypot(p.x-DR[0],p.y-DR[1])?1:2;
        if(it.y>=170)go(s,3);else if(a)go(s,a)}
      return null},
    draw(s,c,t){rd(s,c,t,null)},
    bloom(s,c,k,t){rd(s,c,t,k)},
    auto(s,inp){const it=s.it;if(it&&it.t>=.6){if(it.h)inp.rTap=true;else inp.lTap=true}}
  };
}
})();
/* GAME:medal:END */
/* GAME:becoming:BEGIN */
(function(){
{ /* becoming: de Beauvoir, "A Worn Copy of The Second Sex". Helpers used: none (own swipe tracker, own homing labels). */
const K="beauvoir_s",WORDS=["too loud","be pleasing","not for girls","sit still","smile more","don’t climb","too clever","stay small"],
 TAL=["t_brush","t_plane","t_book","t_peak","t_flask","t_violin","t_hammer","t_scope"],
 T={x:96,y0:250,y1:70,v:4.5,n:16,gap:2.4,first:1,fly:34,turn:Math.PI/2,sw:18,swT:.25,reach:16,cd:.6,hit:9};
if(typeof SFX==="object"&&!SFX.becoming_stick)Object.assign(SFX,{
 becoming_stick:()=>{aNoise(.09,{type:"lowpass",f:700,to:300,q:.7,v:.14,a:.004});aTone(AN(-14),.12,{v:.08,type:"triangle",lp:500,to:AN(-18)})},
 becoming_tear:()=>{aNoise(.2,{f:3800,to:1800,q:.7,v:.1,a:.005});aNoise(.08,{f:5200,q:.8,v:.06,at:.05})},
 becoming_talent:()=>{aTone(AN(12),.5,{v:.07,type:"triangle"});aTone(AN(19),.6,{v:.06,at:.08,type:"triangle"});aTone(AN(24),.7,{v:.04,at:.16})},
 becoming_label:()=>aNoise(.2,{f:600,to:1400,q:.8,a:.06,v:.04}), /* a label flies in with a glow */
 becoming_rise:()=>aArp([12,16,19,24],.1,{d:.9,v:.05,lp:3500})}); /* the bloom */
const slot=k=>{const m=Math.ceil(k/2),u=.5+(k%2?-m:m)/16.5;return{x:12+u*168,y:60-30*Math.sin(Math.PI*u)}};
const her=s=>({x:T.x,y:s.y-10});
/* a stuck label hangs on her at its own slot; a flying one is at L.x,L.y */
const pos=(s,L)=>{if(!L.st)return{x:L.x,y:L.y,w:60,h:14,rot:0,sc:1};const n=L.slot;return{x:T.x+(n%2?1:-1)*(26+(n%3)*5),y:s.y-4-((n*5)%20),w:42,h:10,rot:n%2?.12:-.12,sc:.7}}
const dRect=(p,x,y)=>{const dx=Math.max(Math.abs(x-p.x)-p.w/2,0),dy=Math.max(Math.abs(y-p.y)-p.h/2,0);return Math.hypot(dx,dy)}
const near=(s,x,y)=>{let b=null,bd=T.reach+1e-6;for(const L of s.lab){const d=dRect(pos(s,L),x,y);if(d<=bd){bd=d;b=L}}return b}
const nearHer=(s)=>{const h=her(s);let b=null,bd=1e9;for(const L of s.lab)if(!L.st){const d=Math.hypot(L.x-h.x,L.y-h.y);if(d<bd){bd=d;b=L}}
  if(!b)for(const L of s.lab)if(L.st&&(!b||L.slot>b.slot))b=L;return b}
const reslot=(s)=>{let n=0;for(const L of s.lab)if(L.st)L.slot=n++}
const tear=(s,L)=>{const p=pos(s,L);s.lab.splice(s.lab.indexOf(L),1);if(L.st){s.stuck--;reslot(s)}
  s.rip.push({x:p.x,y:p.y,vx:(p.x<96?-1:1)*26,vy:-18,r:0,vr:(p.x<96?-1:1)*2.2,t:0});
  for(let i=0;i<5;i++)pAdd(s.P,{x:p.x+(Math.random()-.5)*20,y:p.y,vx:(Math.random()-.5)*50,vy:-10-Math.random()*20,g:40,life:.7,col:"#EADFBE",s:1.5});
  s.tal.push({k:s.tal.length,x0:p.x,y0:p.y,t:0});s.torn++;sfx("becoming_tear");sfx("becoming_talent")}
const swipe=(s,inp)=>{if(inp.taps&&inp.taps.length){const q=inp.taps[0];s.sw={x:q.x,y:q.y,t:s.c}}
  const w=s.sw;if(!w)return null;const u=inp.ups||[],p=inp.down||(u.length?u[u.length-1]:null);
  if(p&&Math.hypot(p.x-w.x,p.y-w.y)>=T.sw&&s.c-w.t<T.swT+1e-6){s.sw=null;return{x:w.x,y:w.y}}
  if(s.c-w.t>=T.swT||(!inp.down&&!u.length&&w.t<s.c))s.sw=null;return null}
const person=(c,n,x,y,sc,fl)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],pv=A&&A.pivots&&A.pivots[n];
  return r&&pv&&mPerson(c,K,n,x,y,{ax:pv[0]/r[2],ay:pv[1]/r[3],sc,flip:fl})}
const girl=(c,s,x,y,sc,pose)=>{mShadow(c,x,y,12*sc,.4);
  const f=pose||"yw_walk_"+(Math.floor(s.wt)&3);if(person(c,f,x,y,sc))return;
  c.save();c.translate(hs(x),hs(y));c.scale(sc,sc);c.fillStyle="#100B15";c.fillRect(-5,-24,10,24);c.fillStyle="#6B4F5E";c.fillRect(-4,-14,8,13);c.fillStyle="#8A6A5A";c.fillRect(-4,-23,8,8);
  c.fillStyle="#2A1A22";c.fillRect(-4,-24,8,4);c.fillStyle="#5A3A4A";c.fillRect(-4,-10,8,9);c.restore()}
const tag=(c,x,y,rot,sc,word,torn)=>{c.save();c.translate(hs(x),hs(y));if(rot)c.rotate(rot);if(sc!==1)c.scale(sc,sc);
  if(!mPiece(c,K,torn?"tag_torn":"tag",0,0,{ax:.5,ay:.5})){c.fillStyle="#E8DAB8";c.fillRect(-30,-7,60,14);c.strokeStyle="#100B15";c.strokeRect(-29.5,-6.5,59,13);c.fillStyle="#7A4A5A";c.fillRect(-20,-1,8,2)}
  if(word){c.font='8px "IM Fell English SC",Georgia,serif';c.textAlign="center";c.textBaseline="middle";c.fillStyle="#3A2230";const w=c.measureText(word).width,k=Math.min(1,33/w);c.save();c.translate(10,.5);c.scale(k,1);c.fillText(word,0,0);c.restore()}
  c.restore()}
const edge=y=>{const a=[[100,90,104],[120,86,108],[200,72,120],[300,40,150],[330,30,162]];for(let i=1;i<a.length;i++)if(y<=a[i][0]){const k=(y-a[i-1][0])/(a[i][0]-a[i-1][0]);return[lerp(a[i-1][1],a[i][1],k),lerp(a[i-1][2],a[i][2],k)]}return[30,162]};
const back=(c,s)=>{if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#C98F9A");g.addColorStop(.3,"#5A3A55");g.addColorStop(1,"#241626");c.fillStyle=g;c.fillRect(0,0,192,320);
  c.fillStyle="#3A2A3E";c.beginPath();c.moveTo(30,330);c.lineTo(86,100);c.lineTo(106,100);c.lineTo(162,330);c.fill();c.fillStyle="#4A2E44";c.fillRect(0,110,50,210);c.fillRect(142,110,50,210)}}
const walls=(c,s)=>{const L=s.stuck*2;if(!L)return;c.save();c.fillStyle="rgba(46,26,50,.6)";c.strokeStyle="rgba(16,11,21,.7)";
  for(const side of[0,1]){c.beginPath();for(let y=100;y<=324;y+=12){const e=edge(y),l=Math.min(L*(y-70)/250,14),x=side?e[1]-l:e[0]+l;y===100?c.moveTo(x,y):c.lineTo(x,y)}
    for(let y=324;y>=100;y-=12){const e=edge(y);c.lineTo(side?e[1]:e[0],y)}c.closePath();c.fill();c.stroke()}c.restore()}
const arc=c=>{c.save();c.strokeStyle="rgba(255,214,110,.35)";c.lineWidth=1.5;c.beginPath();for(let i=0;i<=24;i++){const u=i/24,x=12+u*168,y=60-30*Math.sin(Math.PI*u);i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();c.restore()}
const emb=(c,name,x,y,a)=>{glow(c,x,y,13,"rgba(255,214,110,.8)",a==null?.7:a);if(!mPiece(c,K,name,x,y,{ax:.5,ay:.5,a})){c.save();c.globalAlpha=a==null?1:a;c.fillStyle="#D9A93A";c.strokeStyle="#100B15";c.beginPath();c.arc(hs(x),hs(y),6,0,7);c.fill();c.stroke();c.restore()}}
MINI.becoming={who:"beauvoir",land:"l1",title:"Becoming",short:true,art:K,stages:["Becoming"],
 setup:["No one is born knowing to be quiet, pleasing, and small. It’s taught.","In The Second Sex I wrote, ‘One is not born, but rather becomes, a woman.’"],
 how:"Swipe the labels away before they stick.",goal:"Tear off the flying labels before they stick, and help her walk on.",ctl:"Swipe across a flying label to tear it off (Z tears the nearest one).",win:"Look at everything she can become. None of it was written on those labels.",walk:"Take the book. Read the labels people hand you before you wear them.",
 pad:false,ab:true,bloomT:2.2,limit:90,shotReady:s=>s.c>=14,
 fl:["She walked on.","Few labels stuck.","Almost nothing stuck to her."],flNext:["Flick labels while they’re still flying.","Watch both sides of the lane."],
 rate:s=>s.stuck<=1?3:s.stuck<=3?2:1,
 init(s){Object.assign(s,{st:0,stT:0,c:0,y:T.y0,spd:T.v,k:1,stuck:0,torn:0,lab:[],tal:[],rip:[],P:pfx(),sp:0,cd:0,wt:0,sw:null,au:null,fx:[]})},
 step(s,dt,inp){s.c+=dt;s.cd=Math.max(0,s.cd-dt);
  while(s.sp<T.n&&s.c>=T.first+s.sp*T.gap){const i=s.sp++,side=i%2?1:-1,x=side<0?28:164,y=Math.max(40,s.y-40+((i*37)%61)-30);
   s.lab.push({x,y,a:side<0?0:Math.PI,i,age:0,st:0,w:WORDS[i%8]});s.fx.push({x,y,t:0});sfx("becoming_label")}
  const q=swipe(s,inp);if(q){const L=near(s,q.x,q.y);if(L)tear(s,L)}
  if(inp.aTap&&s.cd<=0){const L=nearHer(s);if(L){s.cd=T.cd;tear(s,L)}}
  const h=her(s);
  for(const L of s.lab.slice()){L.age+=dt;if(L.st)continue;const ta=Math.atan2(h.y-L.y,h.x-L.x);let da=((ta-L.a+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI;
   L.a+=clamp(da,-T.turn*dt,T.turn*dt);L.x+=Math.cos(L.a)*T.fly*dt;L.y+=Math.sin(L.a)*T.fly*dt;
   if(Math.hypot(L.x-h.x,L.y-h.y)<T.hit){L.st=1;L.slot=s.stuck++;sfx("becoming_stick");if(typeof miniTry==="function")miniTry();pDust(s.P,h.x,s.y-8,4,"rgba(235,225,200,.8)")}}
  s.spd=T.v*Math.max(.3,1-.2*s.stuck);s.k=1-.04*s.stuck;s.y-=s.spd*dt;s.wt+=dt*6*s.spd/T.v;s.stT+=dt;
  for(const r of s.rip){r.t+=dt;r.x+=r.vx*dt;r.y+=r.vy*dt;r.vy+=40*dt;r.r+=r.vr*dt}s.rip=s.rip.filter(r=>r.t<.8);
  for(const e of s.tal)e.t+=dt;for(const f of s.fx)f.t+=dt;s.fx=s.fx.filter(f=>f.t<.6);pStep(s.P,dt,s.rm);
  if(s.y<=T.y1){s.y=T.y1;s.lab=[];return"win"}return null},
 draw(s,c,t){back(c,s);for(const f of s.fx)glow(c,f.x,f.y,16,"rgba(255,200,110,.8)",1-f.t/.6);
  if(s.tal.length)arc(c);for(const e of s.tal){const p=slot(e.k),u=E.out(Math.min(1,e.t/.9));emb(c,TAL[e.k%8],lerp(e.x0,p.x,u),lerp(e.y0,p.y,u)+(s.rm||u<1?0:Math.sin(s.c*2+e.k)*.8),.35+.65*u)}
  walls(c,s);girl(c,s,T.x,s.y,s.k);
  const nh=nearHer(s);
  for(const L of s.lab){const p=pos(s,L);tag(c,p.x,p.y,L.st?p.rot:Math.sin(L.a)*.3*(Math.cos(L.a)<0?-1:1),p.sc,L.st?"":L.w)}
  if(nh&&!nh.st){c.save();c.strokeStyle="rgba(255,233,184,.6)";c.lineWidth=1;c.strokeRect(hs(nh.x-33),hs(nh.y-9),66,18);c.restore()}
  for(const r of s.rip){c.globalAlpha=Math.max(0,1-r.t/.8);tag(c,r.x,r.y,r.r,1,"",true);c.globalAlpha=1}
  pDraw(c,s.P,K);vignette(c,.25)},
 bloom(s,c,k,t){if(!s.bb){s.bb=1;sfx("becoming_rise")}back(c,s);const n=s.tal.length,kk=s.rm?1:k,R=Math.min(34,14+2.2*n),w=E.inOut(clamp((kk-.45)/.55,0,1)),sp=(1-E.out(clamp(kk/.9,0,1)))*Math.PI*3;
  glow(c,96,60,24+kk*26,"rgba(255,214,110,.45)",.4+.6*kk);
  const wk=clamp((kk-.62)/.38,0,1),py=70-8*E.sine(wk);
  girl(c,{wt:kk*8},96,py,1-.1*wk,kk<.25?"yw_walk_0":kk<.62?"yw_lift":null);
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2+sp,r=lerp(20,R,w);emb(c,TAL[i%8],96+Math.cos(a)*r,60+Math.sin(a)*r*.9,.85)}
  if(!s.rm)for(let i=0;i<8;i++){const a=i*.8+kk*3;glow(c,96+Math.cos(a)*30,60+Math.sin(a)*30,5,"rgba(255,233,160,.8)",.5)}vignette(c,.2)},
 auto(s,inp){if(s.au){const p=s.au;inp.down={x:p.x+22,y:p.y};s.au=null;return}
  for(const L of s.lab)if(!L.st&&L.age>=.3){s.au={x:L.x,y:L.y};inp.taps=[{x:L.x,y:L.y}];inp.tap=inp.taps[0];inp.down={x:L.x,y:L.y};L.age=-99;return}},
 _t:{pos}};
}
})();
/* GAME:becoming:END */
/* GAME:rosary:BEGIN */
(function(){
{ /* rosary: de Beauvoir, "A Rosary, Set Aside". Helpers used: none (own tap-spot input, own traveler routing). */
const K="beauvoir_s",SP=[[96,206],[60,184],[132,184],[96,160],[48,138],[144,138],[96,116],[40,92],[152,92],[96,76],[64,60],[128,60]],
 ST=[96,244],DS=[[30,48],[96,36],[166,50]],COL=["#F5C66A","#5FC9C0","#E87A9A"],WHO=["child","tooler","netman"],BLD=["school","workshop","shore"],
 N=8,LINK=48,SPD=18,OPEN=2,WAY=[24,236];
if(typeof SFX==="object"&&!SFX.rosary_lamp)Object.assign(SFX,{
 rosary_lamp:()=>{aNoise(.18,{f:1800,to:900,q:.6,a:.03,v:.05});aTone(AN(15),.4,{v:.05,type:"triangle",lp:2400})},
 rosary_unlamp:()=>{aNoise(.14,{type:"lowpass",f:900,to:300,q:.6,a:.01,v:.07})},
 rosary_arrive:()=>{aTone(AN(7),.5,{v:.07,type:"triangle"});aTone(AN(14),.8,{v:.07,type:"triangle",at:.16})},
 rosary_nope:()=>{aTone(AN(-8),.14,{v:.06,type:"triangle",lp:700});aNoise(.08,{type:"lowpass",f:500,v:.04})}, /* no lamps left: the lamp row shakes */
 rosary_set:()=>{aTone(AN(0),.5,{v:.05,type:"triangle",lp:1500});aNoise(.15,{f:900,to:500,v:.04})}, /* the rosary is set down */
 rosary_all:()=>aArp([7,12,16,19,24],.09,{d:.9,v:.05,lp:3500})}); /* the bloom */
const P=i=>i===0?ST:i<=12?SP[i-1]:DS[i-13];
const lit=(L,k,i)=>i===0||i===13+k||(i>=1&&i<=12&&!!L[i-1]);
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
/* Dijkstra from node f over the points lit for traveler k: the start, the lit spots, and that traveler's own place (never another's) */
const route=(L,k,f)=>{const d=Array(16).fill(1e9),pv=Array(16).fill(-1),dn=[];d[f]=0;
 for(;;){let u=-1;for(let i=0;i<16;i++)if(!dn[i]&&d[i]<1e9&&(u<0||d[i]<d[u]))u=i;if(u<0)break;dn[u]=1;
  for(let v=0;v<16;v++)if(!dn[v]&&lit(L,k,v)){const w=dist(P(u),P(v));if(w<=LINK&&d[u]+w<d[v]){d[v]=d[u]+w;pv[v]=u}}}
 return{d,pv}};
const reach=(L,k)=>route(L,k,0).d[13+k]<1e9;
const plan=(s,t)=>{const r=route(s.L,t.k,t.node);if(r.d[0]>=1e9&&t.node!==0){t.nxt=0;return}
 let b=t.node,bd=dist(P(b),DS[t.k]);if(r.d[13+t.k]<1e9)b=13+t.k;else for(let i=0;i<16;i++)if(r.d[i]<1e9&&i!==13+t.k&&dist(P(i),DS[t.k])<bd-1e-9){bd=dist(P(i),DS[t.k]);b=i}
 if(b===t.node){t.nxt=-1;return}while(r.pv[b]!==t.node)b=r.pv[b];t.nxt=b};
const tstep=(s,t,dt)=>{t.age+=dt;if(t.arr)return;t.chk-=dt;
 if(t.nxt>=0&&!lit(s.L,t.k,t.nxt))t.nxt=lit(s.L,t.k,t.node)?t.node:0;
 if(t.nxt<0&&t.chk<=0){t.chk=.5;plan(s,t)}
 if(t.nxt>=0){const q=P(t.nxt),dx=q[0]-t.x,dy=q[1]-t.y,d=Math.hypot(dx,dy),m=SPD*dt;t.mv=1;
  if(d<=m){t.x=q[0];t.y=q[1];t.node=t.nxt;t.nxt=-1;if(t.node===13+t.k){t.arr=1;t.mv=0;s.win[t.k]=1;sfx("rosary_arrive");pSparks(s.P,t.x,t.y-12,10,COL[t.k],30);
     if(s.tr.every(u=>u.arr)){s.hold=.8;s.litAtEnd=s.n}}else plan(s,t)}else{t.x+=dx/d*m;t.y+=dy/d*m}}else t.mv=0};
const toggle=(s,i)=>{const q=SP[i];if(s.L[i]){s.L[i]=0;s.n--;s.removals++;sfx("rosary_unlamp");pDust(s.P,q[0],q[1],4,"rgba(200,190,210,.6)")}
 else if(s.n<N){s.L[i]=1;s.n++;sfx("rosary_lamp");pSparks(s.P,q[0],q[1]-6,8,"#F5C66A",24)}else{s.nope=.5;sfx("rosary_nope");if(typeof miniTry==="function")miniTry()}};
const jump=(s,dx,dy)=>{const c=SP[s.cur];let b=-1,bs=1e9;SP.forEach((q,i)=>{const ax=(q[0]-c[0])*dx+(q[1]-c[1])*dy,pp=Math.abs((q[0]-c[0])*dy-(q[1]-c[1])*dx);
  if(i!==s.cur&&ax>0&&ax>=pp*.5){const sc=Math.hypot(q[0]-c[0],q[1]-c[1])*(1+pp/ax);if(sc<bs){bs=sc;b=i}}});if(b>=0)s.cur=b};
const pc=(c,n,x,y,ax,ay,w,h,col,a)=>{if(!mPiece(c,K,n,x,y,{ax,ay,a})){c.save();c.globalAlpha=a==null?1:a;c.fillStyle=col;c.strokeStyle="#100B15";c.fillRect(hs(x-ax*w),hs(y-ay*h),w,h);c.strokeRect(hs(x-ax*w)+.5,hs(y-ay*h)+.5,w-1,h-1);c.restore()}};
const pe=(c,n,x,y,w,h,col,a)=>{const A=MINI_ART[K],r=A&&A.prects&&A.prects[n],pv=A&&A.pivots&&A.pivots[n];mShadow(c,x,y,10,.4);
 if(r&&pv&&mPerson(c,K,n,x,y,{ax:pv[0]/r[2],ay:pv[1]/r[3],a}))return;c.save();c.globalAlpha=a==null?1:a;c.fillStyle="#100B15";c.fillRect(hs(x-w/2-1),hs(y-h-1),w+2,h+2);c.fillStyle=col;c.fillRect(hs(x-w/2),hs(y-h),w,h);c.restore()};
const mark=(c,k,x,y,r)=>{c.save();c.fillStyle=COL[k];c.strokeStyle="#100B15";c.lineWidth=1;c.beginPath();
 if(k===0)c.arc(x,y,r,0,7);else if(k===1)c.rect(x-r,y-r,r*2,r*2);else{c.moveTo(x,y-r-1);c.lineTo(x+r+1,y);c.lineTo(x,y+r+1);c.lineTo(x-r-1,y);c.closePath()}c.fill();c.stroke();c.restore()};
const link=(c,a,b,col,w,al)=>{c.save();c.globalCompositeOperation="lighter";c.lineCap="round";c.strokeStyle=col;c.globalAlpha=.16*al;c.lineWidth=w*2.6;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();c.globalAlpha=.75*al;c.lineWidth=w;c.stroke();c.restore()};
const scene=(c,s,bl,t)=>{
 if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#7A5A8A");g.addColorStop(.35,"#3A2A4E");g.addColorStop(1,"#1A1226");c.fillStyle=g;c.fillRect(0,0,192,320)}
 grade(c,"#2E3E78",.4);
 const pts=[[0,ST]];SP.forEach((q,i)=>{if(s.L[i])pts.push([i+1,q])});
 for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++)if(dist(pts[i][1],pts[j][1])<=LINK)link(c,pts[i][1],pts[j][1],"#F5C66A",1.2+bl*2.4,.7+bl*.3);
 DS.forEach((d,k)=>pts.forEach(p=>{if(p[0]>0&&dist(p[1],d)<=LINK)link(c,p[1],d,COL[k],1+bl*2,.4+bl*.5)}));
 SP.forEach((q,i)=>{c.save();c.strokeStyle="rgba(255,233,184,.22)";c.beginPath();c.arc(q[0],q[1],12,0,7);c.stroke();c.restore();
  if(s.L[i]){glow(c,q[0],q[1]-6,17,"rgba(255,200,110,.8)",.8);pc(c,"lamp_on",q[0],q[1]+8,.5,1,8.5,16,"#F5C66A")}else pc(c,"lamp_off",q[0],q[1]+8,.5,1,7.5,16,"#5A4A5A",.85)});
 DS.forEach((d,k)=>{const w=s.win[k]||bl>0;pc(c,BLD[k],d[0],d[1]-2,.5,1,24,k===0?25.5:k===1?22:15,w?COL[k]:"#4A3A4A");
  if(w)glow(c,d[0],d[1]-12,24,"rgba(255,200,110,.85)",.6+bl*.3);if(!s.win[k])mark(c,k,d[0],d[1]+6,3)});
 pc(c,"waystone",WAY[0],WAY[1],.5,1,17,20,"#6A6A62");
 const o=s.c/OPEN,ru=clamp((s.c-.5)/1,0,1),rx=lerp(40,WAY[0],E.inOut(ru)),ry=lerp(234,226,E.inOut(ru))-Math.sin(ru*Math.PI)*6;
 glow(c,WAY[0],218,20,"rgba(255,214,150,.7)",(.15+.35*clamp(s.c-1,0,1))*(1+(s.rm?0:.15*Math.sin(s.c*2))));
 pc(c,"rosary",rx,ry,.5,1,20,19.5,"#4A2A1A",clamp((s.c-.2)/.3,0,1));
 if(s.c<OPEN)pe(c,"w_kneel_set",46,244,12,9,"#8A7A9A",clamp(1-(s.c-1.6)/.4,0,1));
 const L=s.tr.slice().sort((a,b)=>a.y-b.y);
 for(const q of L){const w=q.arr?(bl>0||Math.floor(q.age*2.5)%2?"wave":"wait"):q.mv?"walk_"+(Math.floor(q.age*6)&1):"wait";
  pe(c,WHO[q.k]+"_"+w,q.x,q.y,7,q.k?14:10,COL[q.k]);if(!q.arr)mark(c,q.k,q.x,q.y-(q.k?30:22),2)}
 pDraw(c,s.P,K);
 if(s.kb&&bl===0){const q=SP[s.cur];c.save();c.strokeStyle="#FFE9B8";c.lineWidth=1;c.setLineDash([2,2]);c.beginPath();c.arc(q[0],q[1],14,0,7);c.stroke();c.restore()}
 vignette(c,.22)};
MINI.rosary={who:"beauvoir",land:"l1",title:"By Our Own Lamps",short:true,art:K,stages:["By Our Own Lamps"],
 setup:["I was raised a devout Catholic. At about fourteen, I found I no longer believed.","I set the beads down gently. After that, we had to find the way by our own lights."],
 how:"Tap a spot to light a lamp. Each traveler needs a way to their own place.",goal:"Light up to eight lamps so each traveler can reach their own place.",ctl:"Tap a spot to light or put out a lamp (arrow keys pick a spot, Z lights it).",win:"Everyone reached their own place, and the light was shared. No rule handed us that. We chose it.",walk:"Keep the rosary safe. It’s part of how I grew up.",
 pad:false,ab:false,bloomT:2.2,limit:60,
 fl:["Everyone reached their own place.","The light was well shared.","The fewest lamps: one shared way, branching."],flNext:["Share lamps where paths overlap.","Try one trunk that branches."],
 rate:s=>s.litAtEnd<=6?3:s.litAtEnd<=7?2:1,
 init(s){Object.assign(s,{st:0,stT:0,c:0,L:Array(12).fill(0),n:0,removals:0,litAtEnd:0,hold:0,cur:0,kb:0,nope:0,win:[0,0,0],P:pfx(),au:0,
  tr:[0,1,2].map(k=>({k,x:ST[0]+(k-1)*14,y:ST[1],node:0,nxt:-1,chk:.5,age:k*.3,arr:0,mv:0}))})},
 step(s,dt,inp){s.c+=dt;if(!s.sd0&&s.c>=.3){s.sd0=1;sfx("rosary_set")}s.stT+=dt;s.nope=Math.max(0,s.nope-dt);pStep(s.P,dt,s.rm);
  if(s.hold>0){s.hold-=dt;s.tr.forEach(t=>t.age+=dt);return s.hold<=0?"win":null}
  if(s.c>=OPEN){for(const tp of inp.taps||[]){let b=-1,bd=12.01;SP.forEach((q,i)=>{const d=Math.hypot(q[0]-tp.x,q[1]-tp.y);if(d<bd){bd=d;b=i}});if(b>=0){s.cur=b;toggle(s,b)}}
   const m=[[inp.lTap,-1,0],[inp.rTap,1,0],[inp.uTap,0,-1],[inp.dTap,0,1]];for(const[f,dx,dy]of m)if(f){s.kb=1;jump(s,dx,dy)}
   if(inp.aTap){s.kb=1;toggle(s,s.cur)}
   s.tr.forEach(t=>tstep(s,t,dt))}else s.tr.forEach(t=>t.age+=dt);
  return null},
 draw(s,c,t){scene(c,s,0,t);
  const sh=s.nope>0&&!s.rm?Math.sin(s.nope*60)*1.5:0;for(let i=0;i<N;i++)pc(c,i<N-s.n?"lamp_on":"lamp_off",10+i*10+sh,21,.5,1,i<N-s.n?8.5:7.5,16,i<N-s.n?"#F5C66A":"#5A4A5A",i<N-s.n?1:.5);
  if(s.nope>0){c.save();c.strokeStyle="rgba(255,233,184,"+s.nope*1.6+")";c.lineWidth=1;c.strokeRect(2.5,3.5,86,19);c.restore()}},
 bloom(s,c,k,t){if(!s.bb){s.bb=1;sfx("rosary_all")}scene(c,s,s.rm?1:E.out(Math.min(1,k*1.6)),t)},
 auto(s,inp){const o=[1,4,7,10,11,12];if(s.c>=OPEN+s.au*.5&&s.au<o.length){const q=SP[o[s.au++]-1];inp.taps=[{x:q[0],y:q[1]}];inp.tap=inp.taps[0]}},
 _t:{SP,ST,DS,reach,route,N}};
}
})();
/* GAME:rosary:END */
/* GAME:rose:BEGIN */
(function(){
/* The Well-Tended Rose (Fromm, short). Helper: mPick (taps; keys read here). Art key fromm_s. */
{
  const K="fromm_s",KINDS=["water","shade","prune"],ICON=["can","shade","shears","stool"];
  const T={tend:1.8,need:5,gap:1,know:10,sit:1.5,icon:1.5,B:[62,170],BUD:[62,148],URN:[156,150],TY:226,TX:[36,72,108,144],W:[84,197]};
  const V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
  V("rose_tend",()=>{aNoise(.3,{f:2400,to:1300,q:.5,v:.05,a:.06});aTone(AN(24),.25,{v:.03,at:.06})});
  V("rose_flood",()=>{aNoise(.7,{f:600,to:220,q:.6,v:.13,a:.05});aTone(AN(-12),.5,{v:.09,type:"triangle",lp:420})});
  V("rose_close",()=>aTone(900,.05,{type:"triangle",v:.07,lp:1800}));
  V("rose_sign",()=>{aTone(AN(14),.2,{v:.05,a:.01});aTone(AN(21),.2,{v:.03,at:.05})}); /* a sign appears on the rose */
  V("rose_miss",()=>aTone(AN(-2),.4,{v:.05,type:"triangle",lp:800,to:AN(-7)})); /* the sign fades unanswered */
  V("rose_bloom",()=>aArp([12,16,19,24,28],.1,{d:1,v:.05,lp:3500})); /* the bloom */
  V("rose_sit",()=>{aNoise(.9,{f:700,to:480,q:.8,a:.35,v:.04});aTone(AN(3),1,{v:.04,a:.3})});
  const tr=()=>{if(typeof miniTry==="function")miniTry()};
  const px=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(hs(x),hs(y),w,h)};
  const hit=(p,x,y,w,h)=>Math.abs(p.x-x)<=w/2&&Math.abs(p.y-y)<=h/2;
  const nm=g=>g<3?"r0":g<6?"r1":g<10?"r2":"r3";
  function back(c){if(mBg(c,K,0))return;const g=c.createLinearGradient(0,0,0,150);g.addColorStop(0,"#5A2A4E");g.addColorStop(1,"#E8A860");c.fillStyle=g;c.fillRect(0,0,192,150);
    px(c,0,80,192,70,"#4A3A44");px(c,0,150,192,170,"#6A6470");px(c,31,145,62,40,"#4A3020");px(c,136,150,45,30,"#5A4A50");px(c,150,166,14,14,"#8A6A40")}
  function bush(c,s,x,y,pale){const g=s.g,wet=s.flood>0||s.drp>0,lean=!wet&&s.need&&s.need.k==="water"?-.17:0,n=wet?"r_droop":nm(g);
    if(pale&&mCanvas(c,mTint(K,n,"#EDE6B8",.5),x,y,{ax:.5,ay:1,rot:lean}))return;
    if(mPiece(c,K,n,x,y,{ax:.5,ay:1,rot:lean}))return;
    const h=wet?10:g<3?8:g<6?18:g<10?24:28;c.save();c.translate(x,y);c.rotate(wet?.5:lean);px(c,-1,-h,2,h,"#3F6A40");px(c,-6,-h*.6,5,3,"#4F8A4E");
    if(g>=3)px(c,-2,-h-3,g<6?3:5,g<6?3:5,g<6?"#6AA060":"#E0608A");c.restore()}
  function icon(c,k,x,y){c.save();c.fillStyle="rgba(255,244,214,.96)";c.strokeStyle="#100B15";c.lineWidth=1;c.beginPath();c.arc(x,y,9,0,7);c.fill();c.stroke();
    c.lineWidth=1.5;
    if(k==="water"){c.fillStyle="#3E86C8";c.beginPath();c.moveTo(x,y-6);c.quadraticCurveTo(x+6,y+1,x,y+5);c.quadraticCurveTo(x-6,y+1,x,y-6);c.fill()}
    else if(k==="shade"){c.fillStyle="#E8A020";c.strokeStyle="#E8A020";c.beginPath();c.arc(x,y,3,0,7);c.fill();for(let i=0;i<4;i++){const a=i*1.571;c.beginPath();c.moveTo(x+Math.cos(a)*4.5,y+Math.sin(a)*4.5);c.lineTo(x+Math.cos(a)*7,y+Math.sin(a)*7);c.stroke()}}
    else{c.strokeStyle="#3A3A44";c.beginPath();c.moveTo(x-5,y-5);c.lineTo(x+5,y+5);c.moveTo(x+5,y-5);c.lineTo(x-5,y+5);c.stroke()}
    c.restore()}
  function wand(c,s,pose){const [x,y]=T.W,A=MINI_ART[K]||{},n="w_"+pose,r=(A.prects||{})[n],pv=(A.pivots||{})[n];mShadow(c,x,y,14,.4);
    if(pose&&r&&pv&&mPerson(c,K,n,x,y,{ax:pv[0]/r[2],ay:1})){if(pose!=="sit")mPiece(c,K,pose==="water"?"can":"shears",x-10,y-12,{ax:.5,ay:.5,rot:pose==="water"?-.5:0});return}
    if(!pose&&mSprO(c,"wanderer_left_0",x-8,y-24))return;px(c,x-5,y-(pose==="sit"?14:22),10,pose==="sit"?14:22,"#2F7470")}
  function scene(s,c,t,k){back(c);const n=s.need,sg=s.sg,[bx,by]=T.B,wet=s.flood>0;
    if(sg&&sg.k==="shade"){glow(c,24,44,34,"#FFF2B0",.8*sg.a);c.save();c.globalAlpha=sg.a;c.fillStyle="#FFF6C8";c.beginPath();c.arc(24,44,8,0,7);c.fill();c.restore()}
    if(sg&&sg.k==="water"){c.save();c.globalAlpha=.5*sg.a;c.fillStyle="#2A160C";c.beginPath();c.ellipse(62,167,27,12,0,0,7);c.fill();c.globalAlpha=sg.a;c.strokeStyle="#0E0806";
      c.beginPath();[[44,164,52,168,50,172],[62,160,60,167,66,171]].forEach(q=>{c.moveTo(q[0],q[1]);c.lineTo(q[2],q[3]);c.lineTo(q[4],q[5])});c.stroke();c.restore()}
    if(s.gl>0){c.save();c.globalAlpha=Math.min(1,s.gl)*.5;c.fillStyle="#BCD2E6";c.beginPath();c.ellipse(62,167,26,11,0,0,7);c.fill();c.restore()}
    if(s.g===9&&!wet)glow(c,bx,156,20,"#FFC0D8",.35);
    bush(c,s,bx,by,sg&&sg.k==="shade"&&sg.a>.5);
    if(sg&&sg.k==="prune"){mPiece(c,K,"leaf_dead",bx+8,by-12,{ax:.5,ay:.5,a:sg.a})||px(c,bx+6,by-14,5,4,"#7A5A30")}
    if(s.td&&s.td.k==="shade")mPiece(c,K,"shade",46,148,{ax:.5,ay:.5,sc:1.3});
    if(wet){const a=Math.min(1,(5-s.flood)/.6)*Math.min(1,s.flood/1);c.save();c.globalAlpha=.55*a;c.fillStyle="#4A86C0";c.fillRect(31,145,62,40);c.globalAlpha=a;wave(c,33,165,58,1.2,4,t/300,0,"#CFE6FA",1);c.restore()}
    if(s.cl>0){c.save();c.strokeStyle="#6AA060";c.lineWidth=1.5;c.beginPath();c.arc(T.BUD[0],T.BUD[1],2+8*s.cl/.8,0,7);c.stroke();c.restore()}
    wand(c,s,s.sit>0?"sit":s.td&&s.td.t<1.4&&s.td.k!=="shade"?s.td.k:k);
    if(!mPiece(c,K,"urn",T.URN[0],T.URN[1],{ax:.5,ay:.5})){px(c,142,138,28,26,"#D9A93A");px(c,146,134,20,5,"#F5C66A")}
    return n}
  MINI.rose={who:"fromm",land:"l1",title:"The Well-Tended Rose",short:true,art:K,stages:["The Well-Tended Rose"],
    setup:["Love isn’t something you fall into. It’s an art, and you practice it.","Watch the rose. Give it what it needs, not what impresses."],
    how:"Read the rose’s signs. Tap the tool it needs.",goal:"Give the rose just what it needs, ten times, until it blooms.",ctl:"Tap the tool it needs, or the stool to sit and learn its signs (arrow keys).",win:"It bloomed because you kept showing up. Love works the same way.",walk:"Take the rose. Tend something every day.",
    pad:false,ab:false,bloomT:2,limit:90,
    fl:["The rose bloomed.","No grand gestures, just care.","Patient, gentle, attentive care."],flNext:["Leave the golden urn alone.","Sit with the rose to learn its signs."],
    rate:s=>s.floods===0&&s.pries===0&&s.wrong+s.over<=1&&s.missed<=1?3:s.floods===0&&s.missed<=3?2:1,
    shotReady:s=>s.g>=4&&!!s.need&&s.need.icon,
    init(s){Object.assign(s,{st:0,stT:0,T:0,g:0,wrong:0,missed:0,over:0,floods:0,pries:0,need:null,gap:T.gap,last:"",sit:0,know:0,flood:0,drp:0,gl:0,cl:0,lo:-99,td:null,sg:null,nope:[],P:pfx(),
      K:mPick({items:T.TX.map(x=>({x:x-15,y:T.TY,w:30,h:28}))})})},
    step(s,dt,inp){s.T+=dt;s.stT+=dt;s.know=Math.max(0,s.know-dt);s.flood=Math.max(0,s.flood-dt);s.drp-=dt;s.gl-=dt;s.cl-=dt;
      if(s.sit>0){s.sit-=dt;if(s.sit<=0){s.sit=0;s.know=T.know}}
      if(s.td){s.td.t+=dt;if(s.td.t>T.tend)s.td=null}
      if(s.sg&&!s.need){s.sg.a-=dt*s.sg.d;if(s.sg.a<=0)s.sg=null}
      s.nope=s.nope.filter(n=>(n.t-=dt)>0);pStep(s.P,dt,s.rm);
      if(!(s.flood>0)){const n=s.need;
        if(n){n.t+=dt;if(s.know>0||n.t>=T.icon)n.icon=true;if(n.t>=T.need){s.missed++;sfx("rose_miss");tr();s.sg.d=.8;s.need=null;s.gap=T.gap}}
        else{s.gap-=dt;if(s.gap<=0){let k;do{k=KINDS[Math.random()*3|0]}while(k===s.last);s.last=k;s.need={k,t:0,icon:s.know>0};s.sg={k,a:1,d:0};sfx("rose_sign")}}}
      const acts=[];if(inp.lTap)acts.push(0);if(inp.uTap)acts.push(1);if(inp.rTap)acts.push(2);if(inp.dTap)acts.push(3);if(inp.bTap)acts.push("u");if(inp.aTap)acts.push("b");
      const fz=s.sit>0||s.flood>0;s.K.items.forEach(it=>it.off=fz);
      for(const tp of inp.taps||[]){const i=s.K.step(dt,{taps:[tp]});if(i>=0)acts.push(i);else if(hit(tp,T.URN[0],T.URN[1],24,32))acts.push("u");else if(hit(tp,T.BUD[0],T.BUD[1],22,22))acts.push("b")}
      for(const a of acts){
        if(a==="u"){if(s.flood>0)continue;s.flood=5;s.g=Math.max(0,s.g-2);s.floods++;tr();sfx("rose_flood");continue}
        if(a==="b"){if(s.g>=3){s.g--;s.pries++;tr();s.cl=.8;sfx("rose_close")}continue}
        if(fz)continue;if(a===3){s.sit=T.sit;sfx("rose_sit");continue}
        const k=KINDS[a],n=s.need;
        if(n&&n.k===k){s.g++;s.need=null;s.sg.d=3;s.td={k,t:0};s.gap=T.gap+T.tend;sfx("rose_tend");pSparks(s.P,T.B[0],150,10,"#FFE9A8",30);if(s.g>=10)return"win";continue}
        if(k==="water"){s.over++;s.gl=4;sfx("splash");if(s.T-s.lo<=8){s.drp=3;s.g=Math.max(0,s.g-1);s.lo=-99;tr()}else s.lo=s.T}
        else{s.wrong++;sfx("nope");s.nope.push({i:a,t:.45})}}
      return null},
    draw(s,c,t){scene(s,c,t);const n=s.need;if(n&&n.icon&&s.flood<=0)icon(c,n.k,62,124);
      for(let i=0;i<10;i++){c.fillStyle=i<s.g?"#F5C66A":"rgba(16,11,21,.55)";c.beginPath();c.arc(56+i*8.9,214,2.5,0,7);c.fill()}
      s.K.draw(c,(c,it,i,sel)=>{const x=it.x,y=it.y,off=s.sit>0;c.save();c.globalAlpha=off?.4:1;c.fillStyle="rgba(16,11,21,.65)";c.fillRect(x,y,30,28);c.strokeStyle=sel&&!off?"#F5C66A":"rgba(255,233,184,.4)";c.lineWidth=1;c.strokeRect(x+.5,y+.5,29,27);
        if(!mPiece(c,K,ICON[i],x+15,y+14,{ax:.5,ay:.5,sc:1.5}))px(c,x+9,y+8,12,12,"#B8A890");
        if(i===3&&s.know>0)ring(c,x+15,y+14,17,s.know/T.know,"#F5C66A",1.5);
        if(s.nope.some(q=>q.i===i)){c.strokeStyle="#E04050";c.lineWidth=2;c.beginPath();c.moveTo(x+6,y+5);c.lineTo(x+24,y+23);c.moveTo(x+24,y+5);c.lineTo(x+6,y+23);c.stroke()}c.restore()});
      glow(c,T.URN[0],T.URN[1],26,"#FFD36A",.3+(s.rm?0:.1*Math.sin(t/500)));
      pDraw(c,s.P,K)},
    bloom(s,c,k,t){if(!s.bb){s.bb=1;sfx("rose_bloom")}const e=E.inOut(Math.min(1,k/.6));c.fillStyle="#1B1420";c.fillRect(0,0,192,320);c.save();c.translate(0,-30*e);
      const o={g:10,flood:0,drp:0,need:null,sg:null,gl:0,know:0,cl:0,td:null,sit:1,rm:s.rm};scene(o,c,t,"sit");
      glow(c,62,150,34,"#FFC890",.45*k);
      for(let i=0;i<7;i++){const u=clamp(k*1.3-i*.04,0,1);c.globalAlpha=Math.min(1,u*(1-u)*3.2);c.fillStyle=i%2?"#F7A8C4":"#FFD0DC";c.beginPath();c.ellipse(62+Math.sin(i*2.3+u*3)*(8+u*14),150-u*(26+(i*7)%22),2.2,1.3,u*4+i,0,7);c.fill()}
      c.globalAlpha=1;c.restore()},
    auto(s,inp){if(s.sit<=0&&(s.aS==null||s.T-s.aS>=10)){inp.dTap=true;s.aS=s.T;return}
      const n=s.need;if(n&&n.icon&&s.sit<=0){if(s.aN!==n){s.aN=n;s.aT=s.T}if(s.T-s.aT>=.2)inp[["lTap","uTap","rTap"][KINDS.indexOf(n.k)]]=true}}
  };
}
})();
/* GAME:rose:END */
/* GAME:zenletter:BEGIN */
(function(){
/* Fully Awake (Fromm, short). Helper: mPath (guide ring only; the stroke is tracked here). Art key fromm_s. */
{
  const K="fromm_s",C=[96,128],R=50,TOL=12,D=Math.PI/180,TAU=Math.PI*2,BELL=[160,40],OPEN=1,DRY=.6,LIFT=1.4;
  const V=(n,f)=>{if(typeof SFX!=="undefined"&&!SFX[n])SFX[n]=f};
  V("zenletter_bell",()=>{aTone(1320,1.3,{v:.07,a:.003});aTone(3170,.6,{v:.02})});
  V("zenletter_ink",()=>aNoise(.14,{f:3200,q:.6,v:.02,a:.03}));
  V("zenletter_dry",()=>aNoise(.1,{f:5200,to:3600,q:2,v:.012}));
  V("zenletter_done",()=>aTone(AN(12),.5,{v:.04,type:"triangle"})); /* a circle is closed and dries */
  V("zenletter_wipe",()=>aNoise(.25,{f:1500,to:600,q:.5,a:.02,v:.03})); /* a stroke fades away */
  V("zenletter_blot",()=>aTone(AN(-12),.2,{v:.04,lp:500})); /* ink pools into a blot */
  V("zenletter_lift",()=>{aTone(AN(10),.9,{v:.04,to:AN(22),a:.2});aNoise(.6,{type:"highpass",f:4000,v:.015,a:.2})});
  const wrap=a=>{while(a>Math.PI)a-=TAU;while(a<-Math.PI)a+=TAU;return a};
  const pt=a=>[C[0]+Math.cos(a)*R,C[1]+Math.sin(a)*R];
  const PTS=[];for(let i=0;i<=48;i++)PTS.push(pt(-Math.PI/2+i/48*TAU));
  const blank=()=>({m:[],b:[]});
  const snd=(s,n)=>{if(s.T-(s[n]||-9)>.25){s[n]=s.T;sfx(n==="sI"?"zenletter_ink":"zenletter_dry")}};
  const mark=(s,a0,a1,k,w)=>{const m=s.cur.m,l=m[m.length-1];if(l&&l.k===k&&l.w===w&&l.a1===a0)l.a1=a1;else m.push({a0,a1,k,w})};
  function ringBell(s,first){s.bell=true;s.nb++;s.rip.push({t:0});sfx("zenletter_bell");if(first)s.dT=0}
  function spawn(s){const e=Math.random()*4|0,u=Math.random(),k=["leaf_maple","sparrow","glint"][Math.random()*3|0],tx=C[0]+(Math.random()-.5)*80,ty=C[1]+(Math.random()-.5)*80;
    const x=e===0?21:e===1?171:21+u*150,y=e===2?53:e===3?203:53+u*150,l=Math.hypot(tx-x,ty-y)||1;s.dis.push({k,x,y,vx:(tx-x)/l*20,vy:(ty-y)/l*20,ph:u*6})}
  function end(s){const st=s.str;s.str=null;if(!st)return null;
    if(!s.bell||st.sw<300){s.clr.push({m:s.cur,t:0});sfx("zenletter_wipe");if(typeof miniTry==="function")miniTry();s.cur=blank();if(s.bell)ringBell(s,false);return null}
    s.cn++;sfx("zenletter_done");s.done.push(s.cur);s.fin=s.cur;s.cur=blank();s.ph=2;s.fT=0;return s.cn>=3?"win":null}
  function paper(c,s,x,y,sc,a){c.save();c.globalAlpha=a;c.translate(x,y);c.scale(sc,sc);c.fillStyle="rgba(5,3,10,.4)";c.fillRect(-73,-72,150,150);c.fillStyle="#F2E8D5";c.fillRect(-75,-75,150,150);
    c.fillStyle="rgba(150,125,95,.35)";for(const f of s.fl)c.fillRect(f[0],f[1],f[2],.5);c.strokeStyle="rgba(150,125,95,.5)";c.lineWidth=1;c.strokeRect(-74.5,-74.5,149,149);c.restore()}
  function letter(c,x,y,a){if(mPiece(c,K,"letter",x,y,{ax:.5,ay:.5,sc:2,a}))return;c.save();c.globalAlpha=a;c.fillStyle="#E8DCC0";c.fillRect(x-20,y-15,40,30);c.fillStyle="#B0282E";c.beginPath();c.arc(x,y,5,0,7);c.fill();c.restore()}
  function marks(c,m,a,wet,dx,dy,col){c.save();c.translate(dx||0,dy||0);c.globalAlpha=a;c.lineCap="round";
    for(const q of m.m){c.beginPath();c.arc(C[0],C[1],R,q.a0,q.a1,q.a1<q.a0);if(q.k){c.strokeStyle=col||"rgba(110,100,92,.6)";c.lineWidth=1;c.setLineDash([1,2])}else{c.strokeStyle=col||(wet?"#3A2E52":"#1A1222");c.lineWidth=q.w;c.setLineDash([])}c.stroke()}
    c.setLineDash([]);c.fillStyle=col||"#1A1222";for(const b of m.b){c.beginPath();c.arc(b.x,b.y,b.r,0,7);c.fill()}c.restore()}
  function back(c){if(!mBg(c,K,0)){const g=c.createLinearGradient(0,0,0,320);g.addColorStop(0,"#3A2440");g.addColorStop(1,"#1C1430");c.fillStyle=g;c.fillRect(0,0,192,320);c.fillStyle="#4A3A44";c.fillRect(0,80,192,70)}
    grade(c,"#0A0710",.5);if(!mPiece(c,K,"inkstone",164,292,{ax:.5,ay:.5})){c.fillStyle="#2A2630";c.fillRect(156,286,16,10)}}
  function bell(c,s,t){const r=s.rip[s.rip.length-1],sw=r&&!s.rm?Math.sin(r.t*18)*.25*Math.max(0,1-r.t/1):0;
    c.strokeStyle="#6A5A40";c.lineWidth=1;c.beginPath();c.moveTo(BELL[0],26);c.lineTo(BELL[0],BELL[1]);c.stroke();
    if(!mPiece(c,K,"bell",BELL[0],BELL[1],{ax:.5,ay:0,rot:sw})){c.fillStyle="#C08A3A";c.beginPath();c.moveTo(BELL[0]-3,BELL[1]);c.lineTo(BELL[0]+3,BELL[1]);c.lineTo(BELL[0]+6,BELL[1]+12);c.lineTo(BELL[0]-6,BELL[1]+12);c.fill()}
    for(const q of s.rip){const k=q.t/1.4;c.save();c.strokeStyle="#FFE9B8";c.globalAlpha=1-k;c.lineWidth=1.2;c.beginPath();c.arc(BELL[0],BELL[1]+8,4+k*40,0,7);c.stroke();c.restore();if(q.t<.5)glow(c,BELL[0],BELL[1]+8,22,"#FFE3A0",.5*(1-q.t*2))}}
  function dis(c,s,d,t){const r=s.rm?0:t/900+d.ph;
    if(d.k==="glint"){const a=.6+(s.rm?.3:.4*Math.sin(t/160+d.ph));glow(c,d.x,d.y,8,"#FFE9A8",a);c.fillStyle="#FFF4C0";c.fillRect(d.x-4,d.y-.5,8,1);c.fillRect(d.x-.5,d.y-4,1,8);return}
    if(mPiece(c,K,d.k,d.x,d.y,{ax:.5,ay:.5,rot:d.k==="leaf_maple"?r:0}))return;
    c.fillStyle=d.k==="sparrow"?"#8A6A48":"#C0501E";c.beginPath();c.ellipse(d.x,d.y,d.k==="sparrow"?7:5,d.k==="sparrow"?4:3.5,r,0,7);c.fill()}
  MINI.zenletter={who:"fromm",land:"l1",title:"Fully Awake",short:true,art:K,stages:["Fully Awake"],
    setup:["I learned a great deal from Zen, and from my work with D. T. Suzuki.","Draw one circle, with all of you here for it."],
    how:"Wait for the bell. Then draw the circle in one calm stroke.",goal:"Wait for the bell, then draw one calm circle; do it three times.",ctl:"After the bell, drag around the ring at an even pace (hold Z to draw).",win:"Three circles, none perfect, every one awake. That’s the whole lesson.",walk:"Keep the letter. Some things only make sense when you’re fully awake.",
    lines:[null],pad:false,ab:false,bloomT:2,limit:70,
    fl:["Three circles drawn.","Mostly calm strokes.","Fully awake, every stroke."],flNext:["Wait for the bell.","Keep an even pace, and let the leaves pass."],
    rate:s=>s.gapDeg<=15&&s.blots===0&&s.early===0&&s.chased===0?3:s.gapDeg<=60&&s.blots<=2?2:1,
    shotReady:s=>s.cn>=1&&!!s.str&&s.str.sw>150,
    init(s){const f=[];for(let i=0;i<50;i++)f.push([-72+(i*37.7%144),-72+(i*53.3%144),2+i%4]);
      Object.assign(s,{st:0,stT:0,T:0,ph:0,op:0,cn:0,cT:0,bell:false,nb:0,rip:[],cur:blank(),fin:null,str:null,pd:false,ef:false,gapDeg:0,inkDeg:0,blots:0,early:0,chased:0,dis:[],dT:0,lifts:[],clr:[],done:[],fT:0,bb:0,fl:f,P:mPath({pts:PTS,tol:TOL})})},
    step(s,dt,inp){s.T+=dt;s.stT+=dt;const was=s.pd;s.pd=!!(inp.down||inp.a);
      s.rip=s.rip.filter(r=>(r.t+=dt)<1.4);s.clr=s.clr.filter(q=>(q.t+=dt)<.4);s.lifts=s.lifts.filter(q=>(q.t+=dt)<LIFT);
      s.dis=s.dis.filter(d=>{d.x+=d.vx*dt;d.y+=d.vy*dt;return d.x>9&&d.x<183&&d.y>41&&d.y<215});
      if(s.ph===0){s.op=Math.min(1,s.op+dt/OPEN);if(s.op>=1){s.ph=1;s.cT=0}return null}
      if(s.ph===2){s.fT+=dt;if(s.fT>=DRY){s.ph=3;s.fT=0;s.lifts.push({m:s.fin,t:0});s.fin=null;sfx("zenletter_lift")}return null}
      if(s.ph===3){s.fT+=dt;if(s.fT>=LIFT){s.ph=1;s.cT=0;s.bell=false;s.ef=false;s.dT=0}return null}
      s.cT+=dt;if(!s.bell&&s.cT>=1.5)ringBell(s,true);
      if(s.bell){s.dT+=dt;if(s.dT>=2){s.dT-=2;spawn(s)}}
      const f=inp.down,src=f?1:inp.a?2:0;let st=s.str,r;
      if(st&&src!==st.src){if(r=end(s))return r;st=null}
      if(!st){if(src&&!was&&(src===2||Math.abs(Math.hypot(f.x-C[0],f.y-C[1])-R)<=TOL)){const a=src===1?Math.atan2(f.y-C[1],f.x-C[0]):-Math.PI/2;
          s.str={src,a,u:a,h:[[s.T,a]],sw:0,still:0,bl:false,bo:null};if(!s.bell&&!s.ef){s.ef=true;s.early++}}return null}
      let a=st.a;
      if(src===1){const d=Math.hypot(f.x-C[0],f.y-C[1]);if(Math.abs(d-R)>TOL){if(s.dis.some(q=>Math.hypot(q.x-f.x,q.y-f.y)<=20))s.chased++;return end(s)}a=Math.atan2(f.y-C[1],f.x-C[0])}
      else a=st.a+75*D*dt;
      const d=wrap(a-st.a),a0=st.a;st.a=a;st.u+=d;st.h.push([s.T,st.u]);while(st.h.length>1&&st.h[1][0]<=s.T-.15)st.h.shift();
      const e=st.h[0],w=s.T-e[0]>1e-6?(st.u-e[1])/(s.T-e[0])/D:0,aw=Math.abs(w),dd=Math.abs(d)/D;
      if(!s.bell){if(dd>0){mark(s,a0,a0+d,1,1);snd(s,"sD")}return null}
      st.sw+=dd;if(aw>=10){st.still=0;st.bl=false}
      if(aw>110){s.gapDeg+=dd;mark(s,a0,a0+d,1,1);snd(s,"sD")}
      else if(aw>=50){s.inkDeg+=dd;mark(s,a0,a0+d,0,Math.round((5-2*(aw-50)/60)*2)/2);snd(s,"sI")}
      else if(aw<10){st.still+=dt;if(st.still>=.6){if(!st.bl){st.bl=true;s.blots++;sfx("zenletter_blot");const p=pt(a);st.bo={x:p[0],y:p[1],r:1.5};s.cur.b.push(st.bo)}st.bo.r=Math.min(6,st.bo.r+dt*2.5)}}
      return null},
    draw(s,c,t){back(c);const o=E.out(s.op);
      if(s.op<1){paper(c,s,96,128,s.rm?1:.15+.85*o,o);letter(c,96,128,1-o);bell(c,s,t);return}
      paper(c,s,96,128,1,1);s.P.drawGuide(c,s.bell&&s.ph===1?"#B8801E":"rgba(140,115,85,.55)");
      for(const q of s.clr)marks(c,q.m,.8*(1-q.t/.4),false);
      for(const q of s.lifts)marks(c,q.m,1-q.t/LIFT,false,0,s.rm?0:-q.t/LIFT*30);
      if(s.fin)marks(c,s.fin,1,s.fT<DRY*.6);marks(c,s.cur,1,true);
      for(const d of s.dis)dis(c,s,d,t);bell(c,s,t);
      if(s.str){const p=pt(s.str.a);if(!mPiece(c,K,"brush",p[0],p[1],{ax:.04,ay:.5,rot:-.9})){c.strokeStyle="#6A4A2A";c.lineWidth=2;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+10,p[1]-14);c.stroke()}}},
    bloom(s,c,k,t){back(c);if(k>=.3&&!s.bb){s.bb=1;sfx("zenletter_bell")}
      const e=E.inOut(Math.min(1,k/.35)),f=clamp((k-.45)/.45,0,1),dy=-28*e;
      paper(c,s,96,128+dy,1-.86*E.inOut(f),1-f);
      const off=[[-2,1],[1.5,-1.5],[.5,2]];
      glow(c,96,100,72,"#F5C66A",.5*Math.min(1,k*1.6));
      (s.done.length?s.done:[blank(),blank(),blank()]).forEach((m,i)=>{if(!m.m.length&&!m.b.length)m={m:[{a0:-Math.PI/2,a1:Math.PI*1.5,k:0,w:3}],b:[]};marks(c,m,i===2?.9-.5*e:.45*e+.1,false,off[i][0],dy+off[i][1],"#E8B84A")});
      letter(c,96,100,f);bell(c,{rip:[],rm:s.rm},t);const rk=clamp((k-.3)/.45,0,1);if(rk>0&&rk<1){c.strokeStyle="#FFE9B8";c.globalAlpha=1-rk;c.lineWidth=1.2;c.beginPath();c.arc(BELL[0],BELL[1]+8,4+rk*40,0,7);c.stroke();c.globalAlpha=1}},
    auto(s,inp){if(s.ph===1&&s.bell){if(s.aS==null)s.aS=s.T;if(s.T-s.aS<4.5)inp.a=true}else s.aS=null}
  };
}
})();
/* GAME:zenletter:END */
MINI_LOADED.s1=true;
