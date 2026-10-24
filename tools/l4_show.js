/* Design-time: print a Two Lights puzzle as ASCII. node tools/l4_show.js '<json candidate>' */
const W=7,H=8,ALT=[3,7],G={at:[3,0],dir:[0,1]},S={at:[0,4],dir:[1,0]};
function trace(e,mir,panes){let[c,r]=e.at,[dx,dy]=e.dir,tint=null,np=0;const cells=[];for(let n=0;n<60;n++){if(c<0||c>=W||r<0||r>=H)return{altar:false,tint,np,cells};cells.push(c+","+r);if(c===3&&r===7)return{altar:true,tint,np,cells};const k=c+","+r;if(panes[k]){tint=panes[k];np++}const m=mir[k];if(m){if(m==="/"){const t=dx;dx=-dy;dy=-t}else{const t=dx;dx=dy;dy=t}}c+=dx;r+=dy}return{altar:false,tint,np,cells}}
const x=JSON.parse(process.argv[2]),n=x.mirs.length;
for(const [nm,st] of [["start",x.start],...x.sols.map(s=>["sol",s])]){const v=parseInt(st,2),mir={};x.mirs.forEach((q,i)=>mir[q[0]+","+q[1]]=(v>>i&1)?"\\":"/");
 const g=trace(G,mir,x.panes),s=trace(S,mir,x.panes);console.log(nm,st,"gold",g.altar,g.tint,"silver",s.altar,s.tint);
 for(let r=0;r<H;r++){let l="";for(let c=0;c<W;c++){const k=c+","+r;let ch=" . ";const ig=g.cells.includes(k),is=s.cells.includes(k);if(ig&&is)ch="+";else if(ig)ch="g";else if(is)ch="s";else ch=".";
  if(k in mir)ch=mir[k];if(x.panes[k])ch=x.panes[k][0].toUpperCase()+(ch=="."?"":"");if(k=="3,7")ch="@";l+=ch.padEnd(2)+" "}console.log("  "+l)}}
