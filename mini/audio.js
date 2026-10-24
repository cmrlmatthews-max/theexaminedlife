/* The Examined Life: quiet music and soft footsteps (Phase 45B). Loaded after the page's main script.
   Music: one short theme for each land, written in code, very quiet, looping. It plays only while you walk the lands
   (the world screen), never inside a mini-game, a story page, or a video. It rides on the land's background bed,
   so a voice line ducks it and the Sound switch stops it.
   Footsteps: one soft step every second walk frame, a different surface for each land.
   If this file does not load, the game runs as before, with no music and no steps. */
(function(){
if(typeof AMB==="undefined"||typeof aTone!=="function")return;
/* Each theme: a chord loop (root and two upper notes, in semitones from A4) and a melody line
   (one entry per beat: semitones from A4, or null for a rest). Beat = 0.75 s (80 beats a minute). Four beats per chord. */
const THEMES={
  l1:{ /* Stormcliffs: D minor, slow and dark (Dm, Bb, F, C) */
    wave:"triangle",lp:1500,
    chords:[[-19,-7,-4],[-23,-7,-3],[-16,-4,0],[-21,-5,-2],[-19,-7,-4],[-23,-7,-3],[-21,-9,-5],[-19,-7,-4]],
    mel:[5,null,3,null, 0,null,null,null, 5,8,7,null, 3,null,null,null, 0,null,3,5, 7,null,5,null, 3,null,0,null, -2,null,null,null]},
  l2:{ /* Marble Coast: A major, open and bright (A, D, E, F#m) */
    wave:"sine",lp:2200,
    chords:[[-24,-8,-5],[-19,-3,0],[-17,-1,2],[-15,-3,0],[-24,-8,-5],[-19,-3,0],[-22,-8,-3],[-17,-1,2]],
    mel:[7,null,11,null, 12,null,null,null, 14,null,12,11, 9,null,null,null, 7,null,4,null, 7,9,11,null, 12,null,11,null, 7,null,null,null]},
  l3:{ /* Misty Valleys: G pentatonic, sparse (G, Em, C, D) */
    wave:"sine",lp:1800,
    chords:[[-26,-10,-7],[-29,-10,-5],[-21,-5,-2],[-19,-7,-3],[-26,-10,-7],[-29,-10,-5],[-21,-5,-2],[-26,-10,-7]],
    mel:[10,null,null,7, null,null,5,null, 7,null,null,null, 2,null,null,null, 10,null,12,null, 10,null,7,null, 5,null,null,2, null,null,null,null]},
  l4:{ /* Clockwork City: C mixolydian, steady (C, F, Bb, C) */
    wave:"triangle",lp:1700,
    chords:[[-21,-5,-2],[-16,-4,0],[-23,-7,-3],[-21,-5,-2],[-21,-5,-2],[-16,-4,0],[-23,-7,-3],[-21,-5,-2]],
    mel:[3,7,10,7, 3,null,null,null, 8,7,5,null, 3,null,null,null, 1,3,5,3, 1,null,null,null, 3,null,-2,null, 3,null,null,null]}
};
const BEAT=.75,MUSIC_V=.55; /* music level against the bed it rides on */
const onWorld=()=>typeof screen!=="undefined"&&screen==="world"&&!document.hidden;
function music(A,key){const T=THEMES[key];if(!T||!AU.ctx)return;const c=AU.ctx,bus=c.createGain();bus.gain.value=0;bus.connect(A.g);
  let nx=c.currentTime+.6,i=0;const L=T.mel.length;
  const pump=()=>{try{const want=onWorld()?MUSIC_V:0;bus.gain.setTargetAtTime(want,c.currentTime,want?1.2:.3);
      if(!want){nx=Math.max(nx,c.currentTime+.4);return} /* off the world screen: hold the place in the tune, schedule nothing */
      while(nx<c.currentTime+1.4){const at=nx-c.currentTime,b=i%L;
        if(b%4===0){const ch=T.chords[(b/4|0)%T.chords.length];ch.forEach((s,j)=>aTone(AN(s),BEAT*4.2,{type:j?"sine":T.wave,v:j?.035:.05,a:.9,at,lp:T.lp,bus}))}
        const m=T.mel[b];if(m!=null)aTone(AN(m),BEAT*1.6,{type:T.wave,v:.045,a:.03,at,lp:T.lp,bus});
        i++;nx+=BEAT}}catch(e){}};
  pump();A.timers.push(setInterval(pump,250));A.stops.push(()=>{try{bus.disconnect()}catch(e){}})}
for(const k of ["l1","l2","l3","l4"]){const orig=AMB[k];if(typeof orig!=="function")continue;
  AMB[k]=A=>{orig(A);music(A,k)}}
/* Footsteps */
const STEP={
  l1:()=>{aNoise(.07,{type:"lowpass",f:700,to:380,q:.8,v:.05,a:.004});aNoise(.05,{f:2600,q:1.5,v:.008,a:.003,at:.01})}, /* wet stone */
  l2:()=>{aNoise(.05,{f:1600,to:1100,q:1.6,v:.035,a:.003});aTone(AN(-14),.04,{v:.012,type:"triangle",lp:900,a:.002})}, /* marble */
  l3:()=>aNoise(.09,{type:"lowpass",f:520,to:300,q:.6,v:.045,a:.012}), /* earth and grass */
  l4:()=>{aNoise(.05,{f:1200,to:800,q:1.4,v:.035,a:.003});aTone(AN(-2),.03,{v:.008,type:"triangle",a:.002,at:.005})} /* cobbles */
};
let lastStep=-1,lastT=0;
window.stepSound=function(walk){try{const n=Math.floor(walk/2);if(n===lastStep)return;lastStep=n; /* the walk animation is its visual cue */
  const k=typeof CUR!=="undefined"&&CUR&&CUR.id;if(!k||!STEP[k]||!auOK())return;const now=AU.ctx.currentTime;if(now-lastT<.15)return;lastT=now;STEP[k]()}catch(e){}};
window.STEP_SOUNDS=STEP;
window.MUSIC_LOADED=true;
})();
