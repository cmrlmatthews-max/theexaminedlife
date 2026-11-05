/* PAINT part 20: light, shadow, rim, shafts, bloom, grade, vignette, LANDS.
   Lights/shadows/shafts are batched sprites (one shared texture each, additive for light). Bloom + grade (LUT) + vignette
   share ONE filter on P.view (one composite pass, plus a half-res bright/blur pre-pass only while bloom is on).
   Reduce Motion (PAINT.rm): no flicker, no sway, no pulse. No art needed anywhere. */
(function(){
const P=window.PAINT;if(!P)return;
const clamp=P.clamp,hex=P.hex;
const rgb=c=>{const h=hex(c);return[(h>>16&255)/255,(h>>8&255)/255,(h&255)/255]};
let warned=false;const warn=m=>{if(!warned){warned=true;console.warn("[PAINT.light] "+m)}};

/* ---- land palettes: key colours (contract), cool ambient, warm key light, and the grade tone settings ---- */
P.LANDS={
  l1:{name:"Stormcliffs",key:[0x8E3B5A,0xB23A48,0x4A5568,0xF5C66A],ambient:0x1B2142,keyLight:0xF2B866,
      grade:{lift:.42,warm:.30,contrast:.30,sat:.84,exposure:.96,gamma:1.04,vig:.55,vigColor:0x07050E}},
  l2:{name:"Marble Coast",key:[0x2F7470,0xEDE6DA,0xA8743A,0xFFD79A],ambient:0x3C6A86,keyLight:0xFFD08C,
      grade:{lift:.26,warm:.42,contrast:.20,sat:1.04,exposure:1.04,gamma:.98,vig:.38,vigColor:0x10202E}},
  l3:{name:"Misty Valleys",key:[0x4F7E3E,0x15171A,0xE8C873,0xF3E4B2],ambient:0x7E9AA2,keyLight:0xEBCB7A,
      grade:{lift:.50,warm:.30,contrast:.14,sat:.80,exposure:1.04,gamma:1.0,vig:.34,vigColor:0x1B262B}},
  l4:{name:"Clockwork City",key:[0xA0612E,0xE0A040,0x1E2E55,0xFFC866],ambient:0x1C2C58,keyLight:0xE8A444,
      grade:{lift:.40,warm:.44,contrast:.32,sat:.96,exposure:.98,gamma:1.02,vig:.52,vigColor:0x080A18}}
};
const landOf=v=>typeof v==="string"?P.LANDS[v]:(v&&v.ambient!=null?v:null);

/* ---- shared per-session registries and one tick ---- */
const R={lights:new Set(),shadows:new Set(),shafts:new Set()};
function tick(dt,t){
  const rm=P.rm;
  for(const h of R.lights){const s=h.c;if(s.destroyed){R.lights.delete(h);continue}
    let m=1,sc=1;
    if(h.flick>0&&!rm){const p=h.ph,f=h.flick;m=1+f*(.09*Math.sin(t*7.1+p)+.06*Math.sin(t*13.7+p*2.3)+.05*Math.sin(t*23.9+p*3.1));sc=1+f*.025*Math.sin(t*9.3+p*1.7)}
    s.alpha=clamp(h.intensity*m,0,1);const k=h.r*2*sc/s.texture.width;s.scale.set(k)}
  for(const h of R.shadows){const s=h.c,T=h.target;
    if(s.destroyed){R.shadows.delete(h);continue}
    if(!T||T.destroyed){h.destroy();continue}
    const p=T.parent;
    if(p&&s.parent!==p){p.addChildAt(s,Math.max(0,p.getChildIndex(T)))}
    s.zIndex=(T.zIndex||0)-.01;
    const sx=Math.abs(T.scale.x),sy=Math.abs(T.scale.y);
    s.x=T.x;s.y=T.y+h.offsetY*sy;s.width=h.w*sx;s.height=h.h*sy;s.alpha=h.alpha*T.alpha;s.visible=T.visible}
  for(const h of R.shafts){const c=h.c;if(c.destroyed){R.shafts.delete(h);continue}
    const a=h.o.alpha;
    for(const s of h.list){
      const sw=rm?0:Math.sin(t*.35+s.ph);
      s.rotation=s.rot0+sw*.035;
      s.alpha=a*s.a0*(rm?1:1+.18*Math.sin(t*.5+s.ph*2.1))}}}
tick.dispose=()=>{R.lights.clear();R.shadows.clear();R.shafts.clear();S=null};
function ensure(){if(!P.ticks.includes(tick)){R.lights.clear();R.shadows.clear();R.shafts.clear();P.on(tick)}}

/* ---- generated textures ---- */
const lightTex=()=>P.radial("paint.light",128,[[0,"rgba(255,255,255,1)"],[.12,"rgba(255,255,255,.72)"],[.3,"rgba(255,255,255,.33)"],[.55,"rgba(255,255,255,.11)"],[.8,"rgba(255,255,255,.025)"],[1,"rgba(255,255,255,0)"]]);
const shadowTex=()=>P.radial("paint.shadow",64,[[0,"rgba(255,255,255,.95)"],[.45,"rgba(255,255,255,.55)"],[.8,"rgba(255,255,255,.14)"],[1,"rgba(255,255,255,0)"]]);
const shaftTex=()=>P.make("paint.shaft",64,256,(c,w,h)=>{
  const g=c.createLinearGradient(0,0,w,0);[[0,0],[.28,.35],[.5,1],[.72,.35],[1,0]].forEach(s=>g.addColorStop(s[0],"rgba(255,255,255,"+s[1]+")"));
  c.fillStyle=g;c.fillRect(0,0,w,h);c.globalCompositeOperation="destination-in";
  const v=c.createLinearGradient(0,0,0,h);[[0,.0],[.06,.8],[.35,.5],[.7,.16],[1,0]].forEach(s=>v.addColorStop(s[0],"rgba(0,0,0,"+s[1]+")"));
  c.fillStyle=v;c.fillRect(0,0,w,h)});

/* PAINT.light({x,y,r,color,intensity,flicker,parent}) -> {c,x,y,set(o),destroy()}; r = radius in units, intensity 0..1, flicker 0..1 (true = 1) */
P.light=function(o){
  o=o||{};ensure();
  const s=new PIXI.Sprite(lightTex());s.anchor.set(.5);s.blendMode="add";
  const h={c:s,r:60,intensity:.8,flick:0,ph:Math.random()*40,
    get x(){return s.x},set x(v){s.x=v},get y(){return s.y},set y(v){s.y=v},
    set(q){q=q||{};if(q.x!=null)s.x=q.x;if(q.y!=null)s.y=q.y;if(q.r!=null)h.r=q.r;if(q.color!=null)s.tint=hex(q.color);
      if(q.intensity!=null)h.intensity=q.intensity;if(q.flicker!=null)h.flick=q.flicker===true?1:+q.flicker||0;
      s.alpha=clamp(h.intensity,0,1);s.scale.set(h.r*2/s.texture.width);return h},
    destroy(){R.lights.delete(h);if(!s.destroyed)s.destroy()}};
  h.set(Object.assign({color:0xF5C66A},o));
  (o.parent||P.fx||P.world||P.root).addChild(s);R.lights.add(h);return h};

/* PAINT.shadow(target,{w,h,alpha,offsetY}) -> {c,set(o),destroy()}; w,h = ellipse size at target scale 1; offsetY below target origin (feet) */
P.shadow=function(target,o){
  o=o||{};ensure();
  const s=new PIXI.Sprite(shadowTex());s.anchor.set(.5);s.tint=0x06040E;
  const h={c:s,target,w:60,h:17,alpha:.4,offsetY:0,
    set(q){q=q||{};if(q.w!=null){h.w=q.w;if(q.h==null&&o.h==null)h.h=q.w*.28}if(q.h!=null)h.h=q.h;if(q.alpha!=null)h.alpha=q.alpha;if(q.offsetY!=null)h.offsetY=q.offsetY;if(q.color!=null)s.tint=hex(q.color);return h},
    destroy(){R.shadows.delete(h);if(!s.destroyed)s.destroy()}};
  h.set(o);
  const p=target&&target.parent;if(p)p.addChildAt(s,Math.max(0,p.getChildIndex(target)));
  R.shadows.add(h);return h};

/* ---- shader plumbing ---- */
const VERT=`in vec2 aPosition;out vec2 vTextureCoord;out vec2 vScreen;out vec2 vTexel;
uniform vec4 uInputSize;uniform vec4 uOutputFrame;uniform vec4 uOutputTexture;
vec4 filterVertexPosition(void){vec2 position=aPosition*uOutputFrame.zw+uOutputFrame.xy;
position.x=position.x*(2.0/uOutputTexture.x)-1.0;position.y=position.y*(2.0*uOutputTexture.z/uOutputTexture.y)-uOutputTexture.z;return vec4(position,0.0,1.0);}
void main(void){gl_Position=filterVertexPosition();vTextureCoord=aPosition*(uOutputFrame.zw*uInputSize.zw);vScreen=aPosition;vTexel=uInputSize.zw;}`;
const FRAG_POST=`precision highp float;
in vec2 vTextureCoord;in vec2 vScreen;in vec2 vTexel;out vec4 finalColor;
uniform sampler2D uTexture;uniform sampler2D uLut;uniform sampler2D uBloomTex;
uniform float uAmount;uniform float uLutOn;uniform float uBloom;uniform float uVig;uniform vec3 uVigColor;uniform vec2 uBloomScale;
vec3 lut(vec3 c){c=clamp(c,0.0,1.0);float b=c.b*15.0;float b0=floor(b);float b1=min(b0+1.0,15.0);float f=b-b0;float y=(c.g*15.0+0.5)/16.0;float rx=c.r*15.0+0.5;
vec3 a=texture(uLut,vec2((b0*16.0+rx)/256.0,y)).rgb;vec3 d=texture(uLut,vec2((b1*16.0+rx)/256.0,y)).rgb;return mix(a,d,f);}
void main(void){vec4 c=texture(uTexture,vTextureCoord);vec3 rgb=c.a>0.001?c.rgb/c.a:c.rgb;
if(uBloom>0.0){vec3 b=texture(uBloomTex,vTextureCoord*uBloomScale).rgb;rgb=1.0-(1.0-rgb)*(1.0-clamp(b*uBloom,0.0,1.0));}
if(uLutOn>0.5)rgb=mix(rgb,lut(rgb),uAmount);
vec2 q=(vScreen-0.5)*2.0;float d=length(q*vec2(0.82,0.9));float v=smoothstep(0.5,1.3,d);rgb=mix(rgb,uVigColor,v*uVig);
rgb+=(fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453)-0.5)/255.0;
finalColor=vec4(clamp(rgb,0.0,1.0)*c.a,c.a);}`;
const FRAG_BRIGHT=`precision highp float;
in vec2 vTextureCoord;out vec4 finalColor;uniform sampler2D uTexture;uniform float uThr;
void main(void){vec4 c=texture(uTexture,vTextureCoord);vec3 rgb=c.a>0.001?c.rgb/c.a:c.rgb;float l=max(rgb.r,max(rgb.g,rgb.b));float k=smoothstep(uThr,uThr+0.3,l);finalColor=vec4(rgb*k,1.0);}`;
const FRAG_RIM=`precision highp float;
in vec2 vTextureCoord;in vec2 vTexel;out vec4 finalColor;
uniform sampler2D uTexture;uniform vec3 uColor;uniform float uWidth;uniform float uAlpha;uniform vec2 uDir;
void main(void){vec4 c=texture(uTexture,vTextureCoord);if(c.a<0.002){finalColor=c;return;}
vec2 st=uDir*uWidth*vTexel;float o=0.0;
for(int i=1;i<=4;i++){o+=texture(uTexture,vTextureCoord+st*(float(i)*0.25)).a;}
o*=0.25;float rim=c.a*(1.0-o);rim=rim*rim*(3.0-2.0*rim);
finalColor=vec4(c.rgb+uColor*rim*uAlpha,c.a);}`;

let lastLog="";
/* compile + link test on the raw GL context so a bad shader falls back instead of throwing at render time */
function glOK(gp){
  try{const gl=P.app&&P.app.renderer&&P.app.renderer.gl;if(!gl)return true;
    const mk=(t,src)=>{const sh=gl.createShader(t);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){lastLog=gl.getShaderInfoLog(sh)||"compile error";gl.deleteShader(sh);return null}return sh};
    const v=mk(gl.VERTEX_SHADER,gp.vertex),f=mk(gl.FRAGMENT_SHADER,gp.fragment);if(!v||!f)return false;
    const pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);
    const ok=gl.getProgramParameter(pr,gl.LINK_STATUS);if(!ok)lastLog=gl.getProgramInfoLog(pr)||"link error";
    gl.deleteProgram(pr);gl.deleteShader(v);gl.deleteShader(f);return ok}catch(e){lastLog=String(e);return false}}
function mkFilter(name,frag,resources,opt){
  try{const gp=PIXI.GlProgram.from({vertex:VERT,fragment:frag,name});
    if(!glOK(gp)){warn(name+" shader failed ("+lastLog+"), using fallback");return null}
    return new PIXI.Filter(Object.assign({glProgram:gp,resources,resolution:"inherit",antialias:"inherit"},opt||{}))}
  catch(e){warn(name+" filter failed ("+e+"), using fallback");return null}}
const V=(n,a)=>({value:new Float32Array(a),type:n});

/* ---- the one post filter on P.view: bloom + LUT grade + vignette ---- */
const lutCanvas=document.createElement("canvas");lutCanvas.width=256;lutCanvas.height=16;
let lutTex=null;
const getLut=()=>lutTex||(lutTex=PIXI.Texture.from(lutCanvas));
const smooth=v=>v*v*(3-2*v),luma=c=>.2126*c[0]+.7152*c[1]+.0722*c[2];
/* tone function for a land: exposure/gamma, slight S-curve, desaturation, shadows lifted toward ambient, highlights warmed toward key light */
function toneOf(L){
  const g=L.grade||{},A=rgb(L.ambient),K=rgb(L.keyLight),ex=g.exposure||1,ga=g.gamma||1,ct=g.contrast!=null?g.contrast:.2,sa=g.sat!=null?g.sat:.9,li=g.lift||0,wa=g.warm||0;
  return(r,gg,b)=>{
    let c=[r,gg,b].map(v=>clamp(Math.pow(v,ga)*ex,0,1));
    c=c.map(v=>v+(smooth(v)-v)*ct);
    let l=luma(c);c=c.map(v=>l+(v-l)*sa);l=luma(c);
    const sh=Math.pow(1-clamp(l,0,1),2.2)*li;c=c.map((v,i)=>v+(A[i]*.75-v)*sh);
    const hl=Math.pow(clamp(l,0,1),1.6)*wa;c=c.map((v,i)=>v+(v*K[i]*1.4-v)*hl);
    return c.map(v=>clamp(v,0,1))}}
const matrixTone=m=>(r,g,b)=>[0,1,2].map(i=>clamp(m[i*5]*r+m[i*5+1]*g+m[i*5+2]*b+m[i*5+4],0,1));
function fillLut(tone){
  const ctx=lutCanvas.getContext("2d"),id=ctx.createImageData(256,16),d=id.data;
  for(let b=0;b<16;b++)for(let g=0;g<16;g++)for(let r=0;r<16;r++){
    const o=tone(r/15,g/15,b/15),i=(g*256+b*16+r)*4;d[i]=o[0]*255+.5;d[i+1]=o[1]*255+.5;d[i+2]=o[2]*255+.5;d[i+3]=255}
  ctx.putImageData(id,0,0);if(lutTex)lutTex.source.update()}

let S=null; /* per-session post state */
function post(){
  if(S&&S.view===P.view&&P.view&&!S.view.destroyed)return S;
  ensure();
  const st=S={view:P.view,filter:null,fallback:false,amount:1,lutOn:0,vig:0,vigColor:rgb(0x0E0B1A),bloom:{on:false,thr:.62,strength:.6,radius:10},users:{grade:false,vig:false,bloom:false},bright:null,blur:null,cm:null,sc:new Float32Array(2)};
  const u={uAmount:{value:1,type:"f32"},uLutOn:{value:0,type:"f32"},uBloom:{value:0,type:"f32"},uVig:{value:0,type:"f32"},uVigColor:V("vec3<f32>",[.05,.04,.08]),uBloomScale:V("vec2<f32>",[1,1])};
  const f=mkFilter("paint-post",FRAG_POST,{post:u,uLut:getLut().source,uBloomTex:PIXI.Texture.WHITE.source});
  if(f){
    st.filter=f;st.u=f.resources.post.uniforms;
    st.bright=mkFilter("paint-bright",FRAG_BRIGHT,{b:{uThr:{value:.62,type:"f32"}}});
    try{st.blur=new PIXI.BlurFilter({strength:10,quality:2,kernelSize:7})}catch(e){st.blur=null}
    st.bloomOK=!!(st.bright&&st.blur);
    const base=PIXI.Filter.prototype.apply;
    f.apply=function(fm,input,output,clear){
      const B=st.bloom,TP=PIXI.TexturePool;
      if(B.on&&B.strength>0&&st.bloomOK){
        const w=input.frame.width,h=input.frame.height,rs=input.source.resolution*.5;
        const t1=TP.getOptimalTexture(w,h,rs,false),t2=TP.getOptimalTexture(w,h,rs,false);
        st.bright.resources.b.uniforms.uThr=B.thr;st.bright.apply(fm,input,t1,true);
        st.blur.strength=B.radius;st.blur.apply(fm,t1,t2,true);
        const sc=st.u.uBloomScale;
        sc[0]=(t2.frame.width/t2.source.width)/(input.frame.width/input.source.width);
        sc[1]=(t2.frame.height/t2.source.height)/(input.frame.height/input.source.height);
        st.u.uBloom=B.strength;this.resources.uBloomTex=t2.source;
        base.call(this,fm,input,output,clear);
        TP.returnTexture(t1);TP.returnTexture(t2)}
      else{st.u.uBloom=0;base.call(this,fm,input,output,clear)}};
  }else{
    st.fallback=true;
    try{st.cm=new PIXI.ColorMatrixFilter();st.filter=st.cm}catch(e){st.filter=null}}
  return st}
/* fallback tint when the shader is unavailable: a ColorMatrixFilter built from the land key/ambient */
function fbMatrix(L){
  const g=L.grade||{},A=rgb(L.ambient),K=rgb(L.keyLight),m=[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0],mix=.18+(g.warm||0)*.2;
  for(let i=0;i<3;i++){m[i*6]=1-mix+mix*K[i]*1.25;m[i*5+4]=A[i]*(g.lift||0)*.3}
  return m}
function refresh(st){
  if(S!==st||!st.view||st.view.destroyed)return;
  const f=st.filter;if(!f)return;
  const on=st.users.grade||st.users.vig||st.users.bloom;
  const cur=st.view.filters?(Array.isArray(st.view.filters)?st.view.filters.slice():[st.view.filters]):[];
  const has=cur.indexOf(f)>=0;
  if(on&&!has){cur.push(f);st.view.filters=cur;st.view.filterArea=new PIXI.Rectangle(0,0,P.W,P.H)}
  else if(!on&&has){cur.splice(cur.indexOf(f),1);st.view.filters=cur}
  if(!st.fallback){const u=st.u;u.uAmount=st.amount;u.uLutOn=st.lutOn;u.uVig=st.vig;u.uVigColor.set(st.vigColor)}}
function setLut(st,arg){
  if(arg==null){st.lutOn=0;return}
  if(st.fallback){const L=landOf(arg);if(L&&st.cm){st.cm.matrix=fbMatrix(L)}else if(arg.matrix&&st.cm)st.cm.matrix=arg.matrix.slice(0,20);st.lutOn=1;return}
  const L=landOf(arg);
  if(L){fillLut(toneOf(L));st.lutOn=1;if(L.grade&&L.grade.vig!=null&&!st.users.vig){st.vig=L.grade.vig;st.vigColor=rgb(L.grade.vigColor!=null?L.grade.vigColor:0x0E0B1A)}return}
  if(arg.lut){const src=arg.lut.source||arg.lut,res=src&&src.resource;
    try{const cx=lutCanvas.getContext("2d");cx.clearRect(0,0,256,16);cx.drawImage(res,0,0,256,16);if(lutTex)lutTex.source.update();st.lutOn=1}
    catch(e){warn("LUT image not drawable, grade skipped");st.lutOn=0}return}
  if(arg.matrix){fillLut(matrixTone(arg.matrix));st.lutOn=1;return}
  warn("grade(): unknown land or lut");st.lutOn=0}

/* PAINT.grade(land | {lut:texture(256x16 strip), matrix:[20]}) -> {set(landOrLut), amount(0..1), destroy()} */
P.grade=function(arg){
  const st=post();st.users.grade=true;if(!st.fallback)getLut();
  const h={
    set(a){if(S!==st)return h;setLut(st,a);refresh(st);return h},
    amount(v){if(v===undefined)return st.amount;st.amount=clamp(v,0,1);if(st.fallback&&st.cm)st.cm.alpha=st.amount;refresh(st);return h},
    destroy(){st.users.grade=false;st.lutOn=0;refresh(st)}};
  h.set(arg==null?"l1":arg);return h};

/* PAINT.vignette({strength,color}) -> {set({strength,color}),destroy()}; folded into the grade pass */
P.vignette=function(o){
  const st=post();st.users.vig=true;
  const h={set(q){q=q||{};if(S!==st)return h;if(q.strength!=null)st.vig=clamp(q.strength,0,1);if(q.color!=null)st.vigColor=rgb(q.color);refresh(st);return h},
    destroy(){st.users.vig=false;st.vig=0;refresh(st)}};
  h.set(Object.assign({strength:.5,color:0x0E0B1A},o||{}));return h};

/* PAINT.bloom({threshold,strength,radius}) -> {setStrength(v),set(o),destroy()}; half-res bright-pass + blur added over the view; radius in units */
P.bloom=function(o){
  const st=post();o=o||{};st.users.bloom=true;const B=st.bloom;B.on=true;
  const h={set(q){q=q||{};if(S!==st)return h;if(q.threshold!=null)B.thr=q.threshold;if(q.strength!=null)B.strength=q.strength;if(q.radius!=null)B.radius=q.radius;refresh(st);return h},
    setStrength(v){return h.set({strength:v})},
    destroy(){B.on=false;st.users.bloom=false;refresh(st)}};
  h.set({threshold:o.threshold!=null?o.threshold:.62,strength:o.strength!=null?o.strength:.6,radius:o.radius!=null?o.radius:10});return h};

/* PAINT.rim(sprite,{color,width,alpha,dir}) -> {c,filter,set(o),destroy()}; dir = degrees toward the key light (0 right, -90 up, 180 left); width in units */
P.rim=function(target,o){
  o=o||{};
  const u={uColor:V("vec3<f32>",[1,.78,.42]),uWidth:{value:3,type:"f32"},uAlpha:{value:.8,type:"f32"},uDir:V("vec2<f32>",[-.7,-.7])};
  const f=mkFilter("paint-rim",FRAG_RIM,{rim:u});
  const h={c:target,filter:f,
    set(q){q=q||{};if(!f)return h;const un=f.resources.rim.uniforms;
      if(q.color!=null){const c=rgb(q.color);un.uColor.set(c)}
      if(q.width!=null){un.uWidth=q.width;f.padding=Math.ceil(q.width)+2}
      if(q.alpha!=null)un.uAlpha=q.alpha;
      if(q.dir!=null){let a=q.dir;if(typeof a==="object")a=Math.atan2(a.y,a.x);else a=a*Math.PI/180;un.uDir.set([Math.cos(a),Math.sin(a)])}
      return h},
    destroy(){if(!f||!target||target.destroyed)return;const cur=Array.isArray(target.filters)?target.filters.slice():target.filters?[target.filters]:[];
      const i=cur.indexOf(f);if(i>=0){cur.splice(i,1);target.filters=cur}}};
  if(f){h.set(Object.assign({color:P.LANDS.l1.keyLight,width:3,alpha:.8,dir:-135},o));
    const cur=Array.isArray(target.filters)?target.filters.slice():target.filters?[target.filters]:[];cur.push(f);target.filters=cur}
  return h};

/* PAINT.shafts({x,y,angle,count,length,width,color,alpha,parent}) -> {c,set({alpha,color}),destroy()}; angle = degrees from straight down (positive leans left), x,y = top origin; additive, slow sway */
P.shafts=function(o){
  o=Object.assign({x:260,y:-20,angle:18,count:5,length:620,width:70,color:0xF2C27A,alpha:.18},o||{});ensure();
  const c=new PIXI.Container(),r=P.rng(Math.round(o.x*7+o.angle*13+o.count)),tex=shaftTex();
  const h={c,o,list:[],
    set(q){q=q||{};if(q.alpha!=null)o.alpha=q.alpha;if(q.color!=null)for(const s of h.list)s.tint=hex(q.color);return h},
    destroy(){R.shafts.delete(h);if(!c.destroyed)c.destroy({children:true})}};
  const base=o.angle*Math.PI/180;
  for(let i=0;i<o.count;i++){
    const s=new PIXI.Sprite(tex);s.anchor.set(.5,0);s.blendMode="add";s.tint=hex(o.color);
    const wv=.55+r()*.9,spread=(i-(o.count-1)/2)*o.width*.85+(r()-.5)*o.width*.4;
    s.x=o.x+spread*Math.cos(base);s.y=o.y+spread*Math.sin(base);
    s.width=o.width*wv;s.height=o.length*(.7+r()*.4);
    s.rot0=base+(r()-.5)*.09+(i-(o.count-1)/2)*.03;s.rotation=s.rot0;s.a0=.45+r()*.55;s.ph=r()*6.28;s.alpha=o.alpha*s.a0;
    c.addChild(s);h.list.push(s)}
  (o.parent||P.fx||P.world||P.root).addChild(c);R.shafts.add(h);return h};
})();
