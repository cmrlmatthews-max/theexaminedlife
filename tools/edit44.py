import sys
p="work/index.html";s=open(p,encoding="utf-8").read()
E=[
# 1 switch state + shims
('let SND_ON=true;try{SND_ON=localStorage.getItem("examined-life-sound")!=="0"}catch(e){}\n',
 'let SND_ON=true;try{SND_ON=localStorage.getItem("examined-life-sound")!=="0"}catch(e){}\n'
 '/* Phase 44B-3: Voice On/Off, saved on this device only (never in P). The clips and the player live in mini/voice.js; if it does not load, these do nothing. */\n'
 'let VOICE_ON=true;try{VOICE_ON=localStorage.getItem("examined-life-voice")!=="0"}catch(e){}\n'
 'function setVoice(on){VOICE_ON=!!on;try{localStorage.setItem("examined-life-voice",VOICE_ON?"1":"0")}catch(e){}if(!VOICE_ON)voStop()}\n'
 'function voSay(t,who,more){try{if(window.VO)VO.say(t,who,more)}catch(e){}}\n'
 'function voKey(k){try{if(window.VO)VO.sayKey(k)}catch(e){}}\n'
 'function voStop(){try{if(window.VO)VO.stop()}catch(e){}}\n'),
# 2 sound off silences voice
('function setSound(on){SND_ON=!!on;try{localStorage.setItem("examined-life-sound",SND_ON?"1":"0")}catch(e){}',
 'function setSound(on){SND_ON=!!on;try{localStorage.setItem("examined-life-sound",SND_ON?"1":"0")}catch(e){}if(!SND_ON)voStop();'),
# 3 a screen change stops the voice
('function show(id){["title"','function show(id){voStop();["title"'),
# 4 talk lines
('  $("#dCont").style.visibility="hidden";\n  typeText(tx,parts);\n}',
 '  $("#dCont").style.visibility="hidden";\n  typeText(tx,parts);\n  voSay(s.text,TK.id,s.lesson?[s.lesson]:null); /* Phase 44B-3: on the same tap that shows the line */\n}'),
# 5 story pages
('    v.play().catch(()=>{});return;\n  }','    voStop();v.play().catch(()=>{});return;\n  }'),
('$("#storyText").textContent=p.text;$("#storyHint").textContent=p.hint||"Tap to continue";',
 '$("#storyText").textContent=p.text;$("#storyHint").textContent=p.hint||"Tap to continue";voSay(p.text,"narrator");'),
# 6 credits
('  show("credits");if(!still)startCredits();','  show("credits");if(!still)startCredits();voKey("credits.0");'),
# 7 signs
('$("#signText").textContent=lines[0];$("#signbox").classList.remove("hide")}',
 '$("#signText").textContent=lines[0];$("#signbox").classList.remove("hide");voSay(lines[0])}'),
('$("#signText").textContent=signState.lines[signState.i]}','$("#signText").textContent=signState.lines[signState.i];voSay(signState.lines[signState.i])}'),
('function closeSign(){signState=null;','function closeSign(){signState=null;voStop();'),
# 8 mini lines during play
('void el.offsetWidth;el.classList.remove("hide");clearTimeout(miniSay.h);',
 'void el.offsetWidth;el.classList.remove("hide");voSay(txt,MS.g.who);clearTimeout(miniSay.h);'),
('function miniSayClear(){clearTimeout(miniSay.t);clearTimeout(miniSay.h);','function miniSayClear(){clearTimeout(miniSay.t);clearTimeout(miniSay.h);voStop();'),
# 9 mini cards
('  const g=MS.g,m=MS.mode,who=esc(speakerName(g.who))',
 '  {const g=MS.g,m=MS.mode,vt=m==="setup"?(MS.i<g.setup.length?g.setup[MS.i]:g.how):m==="over"?(g.again||"Once more?"):m==="walked"?g.walk:m==="result"?g.win:m==="pause"?"":null;if(vt!==null)voSay(vt,g.who)} /* Phase 44B-3 */\n  const g=MS.g,m=MS.mode,who=esc(speakerName(g.who))'),
# 10 switches
('<button class="reply soft" data-act="sound">Sound: ${SND_ON?"On":"Off"}</button>',
 '<button class="reply soft" data-act="sound">Sound: ${SND_ON?"On":"Off"}</button><button class="reply soft" data-act="voice">Voice: ${VOICE_ON?"On":"Off"}</button>'),
('<button class="btn" data-act="sound">Sound: ${SND_ON?"On":"Off"}</button>',
 '<button class="btn" data-act="sound">Sound: ${SND_ON?"On":"Off"}</button><button class="btn" data-act="voice">Voice: ${VOICE_ON?"On":"Off"}</button>'),
('  else if(a==="sound"){setSound(!SND_ON);if(screen==="panel")renderPanel();else if(screen==="mini")miniCard()}\n',
 '  else if(a==="sound"){setSound(!SND_ON);if(screen==="panel")renderPanel();else if(screen==="mini")miniCard()}\n'
 '  else if(a==="voice"){setVoice(!VOICE_ON);if(screen==="panel")renderPanel();else if(screen==="mini")miniCard()}\n'),
# 11 script
('<script src="mini/boss.js"></script>','<script src="mini/boss.js"></script>\n<script src="mini/voice.js"></script>'),
]
for a,b in E:
    n=s.count(a)
    if n!=1: sys.exit(f"count {n} for: {a[:70]!r}")
    s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("ok",len(s.encode()))
