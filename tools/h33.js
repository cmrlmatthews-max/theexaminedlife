/* node harness for quick rule runs of the Level III games without a browser: node tools/h33.js <script.js> */
const vm=require("vm"),fs=require("fs");
global.MINI={};global.MINI_ART={};global.MINI_LOADED={};global.sfx=(...a)=>{(global.SFXLOG||(global.SFXLOG=[])).push(a)};
global.stageUp=(s,n)=>{s.st=n==null?(s.st||0)+1:n;s.stT=0};global.mImgE=()=>null;global.ATLAS_IMG={};global.ATLAS={};global.mSpr=()=>false;global.mRect=()=>false;
global.miniBlankInp=()=>({dx:0,dy:0,a:false,b:false,aTap:false,bTap:false,lTap:false,rTap:false,uTap:false,dTap:false,tap:null,taps:[],down:null,drag:null,swipe:null,fingers:0,pinch:1,ups:[]});
vm.runInThisContext(fs.readFileSync("work/mini/fx.js","utf8").replace(/MINI_LOADED\.fx=true;/,""));
vm.runInThisContext(fs.readFileSync("work/mini/l3.js","utf8"));
module.exports=global;
