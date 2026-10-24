p="work_src/voice/player.js";s=open(p,encoding="utf-8").read()
b64=open("/tmp/claude-0/silent.b64").read().strip()
a='document.addEventListener("visibilitychange",()=>{if(document.hidden)VO.stop()});\n'
assert s.count(a)==1
add=('/* The iPhone lets an <audio> play later only if it first played inside a tap. On the first tap, play a short silent sound on it. */\n'
 'const VO_SILENT="data:audio/wav;base64,'+b64+'";\n'
 '["touchend","click","keydown"].forEach(ev=>document.addEventListener(ev,()=>{if(VO.unlocked)return;VO.unlocked=true;\n'
 '  try{const a=VO.audio();if(a.getAttribute("src"))return;a.src=VO_SILENT;const p=a.play();\n'
 '    const done=()=>{if(a.getAttribute("src")===VO_SILENT){try{a.pause()}catch(e){}a.removeAttribute("src");try{a.load()}catch(e){}}};if(p&&p.then)p.then(done,done);else done()}catch(e){}},{capture:true,passive:true}));\n'
 '/* Safari 17+: the voices follow the silent switch, like the other sounds. */\n'
 'try{if(navigator.audioSession)navigator.audioSession.type="ambient"}catch(e){}\n')
s=s.replace(a,a+add)
open(p,"w",encoding="utf-8").write(s)
p="work/index.html";s=open(p,encoding="utf-8").read()
a='If your iPhone’s silent switch is on, it stays quiet too.</p></div>\n'
assert s.count(a)==1
s=s.replace(a,a+'    <div class="sec"><p>The thinkers speak their lines aloud, and the words stay on the screen. Turn the voices off any time with <b>Voice</b> in the pause menu (or on a game’s pause card).</p></div>\n')
open(p,"w",encoding="utf-8").write(s)
print("ok")
