/* Plan 6: the painted games (engine "paint"). Metadata only: each game's code is in mini/g/<id>.js and loads when the game opens.
   A stub here replaces an old game of the same id. Phase 49B adds "leap"; Phases 50–54 add the rest. */
(function(){const LIST={
};for(const id in LIST)paintStub(id,LIST[id])})();
/* Test link (Phase 47): add ?paintdemo to the game's address to open the Paint Demo from the title screen. It returns to the title. */
if(/[?&]paintdemo\b/.test(location.search))addEventListener("load",()=>{paintStub("paint_demo",{hidden:true,who:"kierkegaard",land:"l1",title:"Paint Demo"});startMini("paint_demo",{replay:true});
  const w=setInterval(()=>{if(typeof MS!=="undefined"&&MS&&MS.id==="paint_demo"){MS.from="title";clearInterval(w)}},100);setTimeout(()=>clearInterval(w),20000)});
