// ===== core helpers: rng, math, formatting, SVG drawings =====
const G = 9.8;
const L = String.raw;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function mkR(seed){const r=mulberry32(seed);return{
  f:r,
  int:(a,b)=>a+Math.floor(r()*(b-a+1)),
  pick:arr=>arr[Math.floor(r()*arr.length)],
  step:(a,b,s)=>{const n=Math.round((b-a)/s);return +(a+s*Math.floor(r()*(n+1))).toFixed(6)}
}}
const rad=d=>d*Math.PI/180, deg=r=>r*180/Math.PI;
const S=d=>Math.sin(rad(d)), C=d=>Math.cos(rad(d)), Tn=d=>Math.tan(rad(d));
// LaTeX-ready number (3 sig figs default)
function fmt(x,sig=3){
  if(!isFinite(x)) return '?';
  if(x===0) return '0';
  const ax=Math.abs(x);
  if(ax>=1e5||ax<1e-3){const e=Math.floor(Math.log10(ax));let m=+(x/10**e).toPrecision(sig);return `${m} \\times 10^{${e}}`;}
  return String(+x.toPrecision(sig));
}
// Lee-style worked solution block
function sol({principle,constraint,assume,lines,plug,ans,note}){
  return `<div class="sol">
  <div class="sl"><span class="tag t1">Principle</span> ${principle}</div>
  ${constraint?`<div class="sl"><span class="tag t2">Constraint</span> ${constraint}</div>`:''}
  ${assume?`<div class="sl"><span class="tag t3">Assumptions</span> ${assume}</div>`:''}
  <div class="sl"><span class="tag t4">Derivation (symbols first)</span>${lines.map(l=>`<div class="dl">\\[${l}\\]</div>`).join('')}</div>
  ${plug?`<div class="sl"><span class="tag t5">Plug in numbers LAST</span><div class="dl">\\[${plug}\\]</div></div>`:''}
  ${ans?`<div class="ansline">Answer: \\(${ans}\\)</div>`:''}
  ${note?`<div class="note">${note}</div>`:''}
  </div>`;
}

// ---------- SVG helpers ----------
function arrowDefs(){return `<defs>
<marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker>
</defs>`}
function arr(x1,y1,x2,y2,color='#e11d48',w=3){return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}" marker-end="url(#ah)"/>`}
function txt(x,y,s,size=14,color='currentColor',anchor='middle',extra=''){return `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}" font-family="Georgia,serif" font-style="italic" ${extra}>${s}</text>`}
const COL={g:'#2563eb',N:'#16a34a',T:'#d97706',f:'#dc2626',F:'#9333ea',s:'#0891b2',d:'#64748b'};
// Free body diagram: arrows [{deg,len,label,color}] from a dot/box at center
function fbdSVG(arrows,opts={}){
  const W=opts.w||240,H=opts.h||220,cx=W/2,cy=H/2;
  let s=`<svg class="fig fbd" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${arrowDefs()}`;
  if(opts.tilt!=null){ // dashed axes tilted for incline
    const t=opts.tilt;
    s+=`<g stroke="#94a3b8" stroke-dasharray="4 4" stroke-width="1"><line x1="${cx-95*C(t)}" y1="${cy+95*S(t)}" x2="${cx+95*C(t)}" y2="${cy-95*S(t)}"/><line x1="${cx-80*S(t)}" y1="${cy-80*C(t)}" x2="${cx+80*S(t)}" y2="${cy+80*C(t)}"/></g>`;
  }
  s+=`<rect x="${cx-16}" y="${cy-16}" width="32" height="32" rx="4" fill="#cbd5e1" stroke="#475569" ${opts.tilt!=null?`transform="rotate(${-opts.tilt} ${cx} ${cy})"`:''}/>`;
  for(const a of arrows){
    const len=a.len||70, r0=a.from||0, dx=a.dx||0;
    const x1=cx+dx+r0*Math.cos(rad(a.deg)), y1=cy-r0*Math.sin(rad(a.deg));
    const x2=cx+dx+len*Math.cos(rad(a.deg)), y2=cy-len*Math.sin(rad(a.deg));
    s+=arr(x1,y1,x2,y2,a.color||'#e11d48');
    const lx=cx+dx+(len+16)*Math.cos(rad(a.deg))+(a.lx||0), ly=cy-(len+16)*Math.sin(rad(a.deg))+5;
    s+=txt(lx,ly,a.label,15,a.color||'#e11d48');
  }
  if(opts.accel!=null){ // acceleration arrow off to the side
    const d=opts.accel; const ox=opts.accelPos?.[0]??W-30, oy=opts.accelPos?.[1]??28;
    s+=arr(ox-16*Math.cos(rad(d)),oy+16*Math.sin(rad(d)),ox+16*Math.cos(rad(d)),oy-16*Math.sin(rad(d)),'#64748b',2);
    s+=txt(ox-26,oy+5,'a',14,'#64748b');
  }
  return s+'</svg>';
}
// Scenes
function sceneFloorPull(th){
  return `<svg class="fig" viewBox="0 0 300 150" width="300" height="150">${arrowDefs()}
  <line x1="10" y1="120" x2="290" y2="120" stroke="#475569" stroke-width="2"/>
  ${Array.from({length:14},(_,i)=>`<line x1="${15+i*20}" y1="120" x2="${5+i*20}" y2="130" stroke="#94a3b8"/>`).join('')}
  <rect x="100" y="80" width="60" height="40" fill="#cbd5e1" stroke="#475569"/>
  ${arr(160,95,160+110*C(th),95-110*S(th),COL.T,3)}
  ${txt(160+118*C(th),95-112*S(th),'T',15,COL.T)}
  <path d="M190 95 A30 30 0 0 0 ${160+30*C(th)} ${95-30*S(th)}" fill="none" stroke="#64748b"/>
  ${txt(205,90,th+'°',13,'#334155','start','font-style="normal"')}
  ${arr(100,142,150,142,'#64748b',2)}${txt(160,146,'moves',11,'#64748b','start','font-style="normal"')}
  </svg>`;
}
function sceneIncline(th,opts={}){
  // ramp rises to the RIGHT; drawn at the true angle
  const W=320,H=190,y0=175;
  const base=Math.min(280,150/Tn(th)), hgt=base*Tn(th), x0=W-20-base;
  const A=[x0,y0],B=[x0+base,y0],Cc=[x0+base,y0-hgt];
  const ux=C(th), uy=-S(th); // unit vector up the slope (screen coords)
  const slen=base/C(th);
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${arrowDefs()}
  <polygon points="${A} ${B} ${Cc}" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
  <path d="M${x0+34} ${y0} A34 34 0 0 0 ${x0+34*ux} ${y0+34*uy}" fill="none" stroke="#64748b"/>
  ${txt(x0+40,y0-6,th+'°',13,'#334155','start','font-style="normal"')}`;
  const fr=opts.pos??0.62; const bx=x0+slen*fr*ux, by=y0+slen*fr*uy;
  s+=`<g transform="translate(${bx} ${by}) rotate(${-th})"><rect x="-18" y="-30" width="36" height="30" fill="#cbd5e1" stroke="#475569"/></g>`;
  if(opts.spring){
    s+=`<g transform="translate(${x0} ${y0}) rotate(${-th})"><rect x="0" y="-34" width="6" height="34" fill="#475569"/><polyline points="6,-14 14,-24 22,-4 30,-24 38,-4 46,-24 54,-4 62,-24 70,-14" fill="none" stroke="${COL.s}" stroke-width="2.5"/><rect x="70" y="-26" width="4" height="24" fill="${COL.s}"/></g>`;
  }
  if(opts.arrowDir){const d=opts.arrowDir==='down'?-1:1; const nx=S(th), ny=C(th); // normal offset (up-left)
    const ox=bx-nx*48, oy=by-ny*48; s+=arr(ox-d*22*ux,oy-d*22*uy,ox+d*22*ux,oy+d*22*uy,'#64748b',2)+txt(ox-nx*14,oy-ny*14,'v',13,'#64748b');}
  return s+'</svg>';
}
function sceneTablePulley(m2,m1){
  return `<svg class="fig" viewBox="0 0 300 190" width="300" height="190">
  <rect x="10" y="80" width="220" height="12" fill="#94a3b8"/><rect x="20" y="92" width="10" height="90" fill="#94a3b8"/><rect x="205" y="92" width="10" height="90" fill="#94a3b8"/>
  <rect x="70" y="40" width="60" height="40" fill="#cbd5e1" stroke="#475569"/>${txt(100,66,m2,14,'#0f172a','middle','font-style="normal"')}
  <line x1="130" y1="58" x2="240" y2="58" stroke="#334155" stroke-width="2"/>
  <circle cx="240" cy="72" r="14" fill="#fff" stroke="#334155" stroke-width="2"/><line x1="230" y1="82" x2="226" y2="92" stroke="#334155" stroke-width="3"/>
  <line x1="254" y1="72" x2="254" y2="130" stroke="#334155" stroke-width="2"/>
  <rect x="234" y="130" width="40" height="36" fill="#cbd5e1" stroke="#475569"/>${txt(254,153,m1,14,'#0f172a','middle','font-style="normal"')}
  </svg>`;
}
function sceneAtwood(m1,m2){
  return `<svg class="fig" viewBox="0 0 200 200" width="200" height="200">
  <rect x="60" y="5" width="80" height="8" fill="#94a3b8"/><line x1="100" y1="13" x2="100" y2="30" stroke="#334155" stroke-width="3"/>
  <circle cx="100" cy="45" r="26" fill="#fff" stroke="#334155" stroke-width="2"/>
  <line x1="74" y1="45" x2="74" y2="140" stroke="#334155" stroke-width="2"/><line x1="126" y1="45" x2="126" y2="100" stroke="#334155" stroke-width="2"/>
  <rect x="54" y="140" width="40" height="40" fill="#cbd5e1" stroke="#475569"/>${txt(74,165,m1,13,'#0f172a','middle','font-style="normal"')}
  <rect x="108" y="100" width="36" height="32" fill="#cbd5e1" stroke="#475569"/>${txt(126,121,m2,13,'#0f172a','middle','font-style="normal"')}
  </svg>`;
}
function sceneVertCircle(where){
  const y=where==='top'?30:170;
  return `<svg class="fig" viewBox="0 0 200 200" width="200" height="200">${arrowDefs()}
  <circle cx="100" cy="100" r="70" fill="none" stroke="#94a3b8" stroke-dasharray="5 5"/>
  <circle cx="100" cy="100" r="4" fill="#334155"/>
  <line x1="100" y1="100" x2="100" y2="${y}" stroke="#334155" stroke-width="2"/>
  <circle cx="100" cy="${y}" r="11" fill="#cbd5e1" stroke="#475569"/>
  ${txt(where==='top'?150:20,y===30?30:190,where==='top'?'top':'bottom',13,'#334155','start','font-style="normal"')}
  ${arr(where==='top'?75:125,y,where==='top'?45:155,y,'#64748b',2)}${txt(where==='top'?40:160,y-10,'v',13,'#64748b')}
  </svg>`;
}
function sceneHill(){
  return `<svg class="fig" viewBox="0 0 300 150" width="300" height="150">${arrowDefs()}
  <path d="M10 140 Q150 -40 290 140" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
  <rect x="128" y="34" width="44" height="18" rx="5" fill="#93c5fd" stroke="#1e3a8a"/><circle cx="138" cy="53" r="5" fill="#334155"/><circle cx="162" cy="53" r="5" fill="#334155"/>
  ${arr(180,40,225,40,'#64748b',2)}${txt(232,44,'v',13,'#64748b','start')}
  <line x1="150" y1="58" x2="150" y2="140" stroke="#94a3b8" stroke-dasharray="4 4"/>${txt(160,110,'R (to center)',12,'#64748b','start','font-style="normal"')}
  </svg>`;
}
function sceneConical(th){
  const Lp=110, px=110, py=20, bx=px+Lp*S(th), by=py+Lp*C(th);
  return `<svg class="fig" viewBox="0 0 260 190" width="260" height="190">
  <rect x="${px-4}" y="10" width="8" height="175" fill="#94a3b8"/>
  <ellipse cx="${px}" cy="${by}" rx="${Lp*S(th)}" ry="16" fill="none" stroke="#94a3b8" stroke-dasharray="5 5"/>
  <line x1="${px}" y1="${py}" x2="${bx}" y2="${by}" stroke="#334155" stroke-width="2"/>
  <line x1="${px}" y1="${py}" x2="${px}" y2="${py+60}" stroke="#64748b" stroke-dasharray="3 3"/>
  ${txt(px+14,py+48,th+'°',13,'#334155','start','font-style="normal"')}
  <rect x="${bx-12}" y="${by-8}" width="24" height="18" fill="#cbd5e1" stroke="#475569"/>
  ${txt((px+bx)/2+10,(py+by)/2,'L',14,'#334155','start')}
  </svg>`;
}
function sceneBank(th){
  return `<svg class="fig" viewBox="0 0 280 150" width="280" height="150">
  <polygon points="20,130 260,130 260,${130-240*Tn(th)}" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
  <g transform="translate(150 ${130-130*Tn(th)}) rotate(${-th})"><rect x="-26" y="-22" width="52" height="22" rx="5" fill="#93c5fd" stroke="#1e3a8a"/></g>
  ${txt(60,124,th+'°',13,'#334155','start','font-style="normal"')}
  ${txt(30,22,'center of the curve ←',12,'#64748b','start','font-style="normal"')}
  </svg>`;
}
function sceneSpring(){
  return `<svg class="fig" viewBox="0 0 300 110" width="300" height="110">
  <rect x="10" y="20" width="10" height="70" fill="#475569"/><line x1="10" y1="90" x2="290" y2="90" stroke="#475569" stroke-width="2"/>
  <polyline points="20,70 30,58 42,82 54,58 66,82 78,58 90,82 102,58 112,70" fill="none" stroke="${COL.s}" stroke-width="2.5"/>
  <rect x="112" y="50" width="44" height="40" fill="#cbd5e1" stroke="#475569"/>
  ${txt(200,60,'compressed by x, then let go',12,'#334155','start','font-style="normal"')}
  </svg>`;
}
function sceneDrop(){
  return `<svg class="fig" viewBox="0 0 200 170" width="200" height="170">${arrowDefs()}
  <line x1="10" y1="150" x2="190" y2="150" stroke="#475569" stroke-width="2"/>
  <circle cx="70" cy="30" r="10" fill="#f87171" stroke="#7f1d1d"/>
  <line x1="40" y1="30" x2="40" y2="150" stroke="#64748b" stroke-dasharray="3 3"/>${txt(30,95,'h',14,'#334155')}
  <circle cx="130" cy="62" r="10" fill="#fecaca" stroke="#7f1d1d" stroke-dasharray="3 2"/>
  <line x1="160" y1="62" x2="160" y2="150" stroke="#64748b" stroke-dasharray="3 3"/>${txt(172,110,'h_f ?',13,'#334155','start')}
  </svg>`;
}
function scenePendulum(th){
  const Lp=120,px=130,py=15,bx=px-Lp*S(th),by=py+Lp*C(th);
  return `<svg class="fig" viewBox="0 0 260 160" width="260" height="160">
  <rect x="${px-40}" y="8" width="80" height="7" fill="#94a3b8"/>
  <line x1="${px}" y1="${py}" x2="${px}" y2="${py+Lp}" stroke="#94a3b8" stroke-dasharray="4 4"/>
  <line x1="${px}" y1="${py}" x2="${bx}" y2="${by}" stroke="#334155" stroke-width="2"/>
  <circle cx="${bx}" cy="${by}" r="10" fill="#cbd5e1" stroke="#475569"/>
  <circle cx="${px}" cy="${py+Lp}" r="10" fill="none" stroke="#475569" stroke-dasharray="3 2"/>
  ${txt(px-18,py+40,th+'°',13,'#334155','end','font-style="normal"')}${txt(px+8,py+70,'L',14,'#334155','start')}
  </svg>`;
}
function sceneLoop(){
  return `<svg class="fig" viewBox="0 0 300 170" width="300" height="170">
  <path d="M10 20 Q40 150 150 150 L230 150" fill="none" stroke="#475569" stroke-width="3"/>
  <circle cx="230" cy="105" r="45" fill="none" stroke="#475569" stroke-width="3"/>
  <circle cx="16" cy="22" r="8" fill="#f87171"/>
  <line x1="5" y1="22" x2="5" y2="150" stroke="#64748b" stroke-dasharray="3 3"/>${txt(14,95,'h',14,'#334155','start')}
  <line x1="230" y1="105" x2="275" y2="105" stroke="#64748b"/>${txt(252,100,'R',13,'#334155')}
  </svg>`;
}
function sceneElevator(){
  return `<svg class="fig" viewBox="0 0 160 170" width="160" height="170">
  <rect x="30" y="10" width="100" height="150" fill="none" stroke="#475569" stroke-width="3"/><line x1="80" y1="0" x2="80" y2="10" stroke="#475569" stroke-width="3"/>
  <circle cx="80" cy="60" r="10" fill="#fcd34d" stroke="#92400e"/><line x1="80" y1="70" x2="80" y2="115" stroke="#92400e" stroke-width="4"/>
  <line x1="80" y1="115" x2="68" y2="140" stroke="#92400e" stroke-width="4"/><line x1="80" y1="115" x2="92" y2="140" stroke="#92400e" stroke-width="4"/>
  <rect x="55" y="140" width="50" height="10" fill="#64748b"/>${txt(80,166,'scale',11,'#334155','middle','font-style="normal"')}
  </svg>`;
}
function sceneUgraph(A,B){ // U(x) = A x^3 - B x sketch
  const xs=[];const W=260,H=160; const xmax=Math.sqrt(B/A)*1.6;
  let umin=1e9,umax=-1e9; for(let i=0;i<=60;i++){const x=xmax*i/60;const u=A*x**3-B*x;xs.push([x,u]);umin=Math.min(umin,u);umax=Math.max(umax,u);}
  const px=x=>30+(W-40)*x/xmax, py=u=>H-20-(H-40)*(u-umin)/(umax-umin);
  return `<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <line x1="30" y1="${py(0)}" x2="${W-5}" y2="${py(0)}" stroke="#94a3b8"/><line x1="30" y1="10" x2="30" y2="${H-10}" stroke="#94a3b8"/>
  <polyline points="${xs.map(([x,u])=>px(x)+','+py(u)).join(' ')}" fill="none" stroke="#7c3aed" stroke-width="2.5"/>
  ${txt(W-12,py(0)-6,'x',13)}${txt(42,20,'U(x)',13,'#7c3aed','start')}
  </svg>`;
}
// Energy bar chart. vals: {K0,Ug0,Us0,W,K1,Ug1,Us1,Eth} in "units" (integers ok)
function barChart(v,opts={}){
  const cols=[['K','K0','i'],['U<tspan font-size="10" dy="3">g</tspan>','Ug0','i'],['U<tspan font-size="10" dy="3">s</tspan>','Us0','i'],['W','W','w'],['K','K1','f'],['U<tspan font-size="10" dy="3">g</tspan>','Ug1','f'],['U<tspan font-size="10" dy="3">s</tspan>','Us1','f'],['ΔE<tspan font-size="10" dy="3">th</tspan>','Eth','f']];
  const W=420,H=200,base=120,unit=opts.unit||16,cw=36,gap=8,x0=20;
  const color={i:'#2563eb',w:'#9333ea',f:'#16a34a'};
  let s=`<svg class="fig bars" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <line x1="10" y1="${base}" x2="${W-10}" y2="${base}" stroke="#334155" stroke-width="2"/>`;
  cols.forEach(([lab,key,grp],i)=>{
    const x=x0+i*(cw+gap)+(i>=3?12:0)+(i>=4?12:0);
    const val=v[key]||0; const h=Math.abs(val)*unit;
    if(val) s+=`<rect x="${x}" y="${val>0?base-h:base}" width="${cw}" height="${h}" fill="${color[grp]}" opacity="0.8"/>`;
    s+=`<text x="${x+cw/2}" y="${base+(val<0?h+18:18)}" font-size="13" text-anchor="middle" font-family="Georgia,serif" font-style="italic">${lab}</text>`;
    if(v.lbl&&v.lbl[key]) s+=`<text x="${x+cw/2}" y="${val>0?base-h-5:base+h+32}" font-size="10" text-anchor="middle" fill="#334155">${v.lbl[key]}</text>`;
  });
  const sep1=x0+3*(cw+gap)+4, sep2=x0+4*(cw+gap)+18;
  s+=`<line x1="${sep1}" y1="20" x2="${sep1}" y2="${H-20}" stroke="#94a3b8" stroke-dasharray="3 3"/><line x1="${sep2}" y1="20" x2="${sep2}" y2="${H-20}" stroke="#94a3b8" stroke-dasharray="3 3"/>`;
  s+=`<text x="${x0+66}" y="16" font-size="12" text-anchor="middle" fill="#2563eb">Initial</text><text x="${sep1+ (sep2-sep1)/2}" y="16" font-size="12" text-anchor="middle" fill="#9333ea">+ Work</text><text x="${sep2+90}" y="16" font-size="12" text-anchor="middle" fill="#16a34a">= Final</text>`;
  return s+'</svg>';
}
