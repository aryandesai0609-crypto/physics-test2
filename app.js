// ===== App =====
const $=s=>document.querySelector(s);
const KEY='apc_test2_v1';
const LS=(()=>{try{const t='__t';localStorage.setItem(t,'1');localStorage.removeItem(t);return localStorage;}catch(e){const m={};return{getItem:k=>m[k]??null,setItem:(k,v)=>{m[k]=String(v)},removeItem:k=>{delete m[k]}};}})();
let ST0={};try{ST0=JSON.parse(LS.getItem(KEY)||'{}')}catch(e){}
const ST=Object.assign({lessons:{},stats:{},mistakes:[],tests:[],plan:{},fl:{},flMiss:{}},ST0);
const save=()=>{try{LS.setItem(KEY,JSON.stringify(ST))}catch(e){}};
function math(el){ if(window.renderMathInElement) renderMathInElement(el,{delimiters:[{left:'\\[',right:'\\]',display:true},{left:'\\(',right:'\\)',display:false}],throwOnError:false}); }
function shuffle(a,r=Math.random){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const GEN_BY=Object.fromEntries(GENS.map(g=>[g.id,g])), CON_BY=Object.fromEntries(CONCEPTS.map(c=>[c.id,c])), DER_BY=Object.fromEntries(DERIVS.map(d=>[d.id,d]));
function parseNum(s){
  if(s==null) return NaN; s=String(s).trim().replace(/,/g,'').replace(/−/g,'-').replace(/\s+/g,'');
  s=s.replace(/[a-zA-Z°/²³]+$/,m=>/^e/i.test(m)?m:''); // strip trailing units
  let m=s.match(/^([-+]?\d*\.?\d+)(?:[x×*]10\^?\(?([-+]?\d+)\)?)$/); if(m) return parseFloat(m[1])*10**parseInt(m[2]);
  const v=Number(s); return v;
}
function numOK(user,ans){const u=parseNum(user);if(!isFinite(u))return false;if(Math.abs(ans)<0.05)return Math.abs(u-ans)<=0.02;return Math.abs(u-ans)<=0.02*Math.abs(ans)+1e-9;}
function rec(topic,ok){const s=ST.stats[topic]||(ST.stats[topic]={n:0,c:0});s.n++;if(ok)s.c++;save();renderProgress();}
function addMistake(item){const k=JSON.stringify(item);if(!ST.mistakes.some(m=>JSON.stringify(m.item)===k)){ST.mistakes.push({item,at:Date.now()});save();}}
function dropMistake(item){const k=JSON.stringify(item);ST.mistakes=ST.mistakes.filter(m=>JSON.stringify(m.item)!==k);save();}
function topicOf(item){return item.type==='gen'?GEN_BY[item.gid].topic:item.type==='concept'?CON_BY[item.cid].topic:DER_BY[item.did].topic;}

// ---------- Tabs ----------
function show(tab){document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t.dataset.t===tab));document.querySelectorAll('.pane').forEach(p=>p.hidden=p.id!=='p-'+tab);if(tab==='mistakes')renderMistakes();if(tab==='learn'&&!$('#lessonView').innerHTML)openLesson(LESSONS[0].id);if(tab==='practice'&&!$('#practiceHost').innerHTML)nextPractice();if(tab==='basics'&&!$('#bHost').innerHTML)bShow('flash');if(tab==='home')renderPlan();if(tab==='frq')renderFRQList();window.scrollTo(0,0);}
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>show(t.dataset.t));

// ---------- Countdown ----------
function tick(){const t=new Date('2026-11-18T08:00:00-08:00')-new Date();const el=$('#count');if(t<=0){el.textContent='Test day. You got this.';return;}const d=Math.floor(t/864e5),h=Math.floor(t%864e5/36e5),m=Math.floor(t%36e5/6e4);el.textContent=`${d}d ${h}h ${m}m until Wed Nov 18`;}
tick();setInterval(tick,30000);

// ---------- Learn ----------
function renderLessonList(){$('#lessonList').innerHTML=LESSONS.map(l=>`<button class="li ${ST.lessons[l.id]?'done':''}" data-id="${l.id}">${ST.lessons[l.id]?'✓ ':''}${l.title}</button>`).join('');document.querySelectorAll('#lessonList .li').forEach(b=>b.onclick=()=>openLesson(b.dataset.id));}
function openLesson(id){const i=LESSONS.findIndex(l=>l.id===id),l=LESSONS[i];const v=$('#lessonView');
  v.innerHTML=`<h2>${l.title}</h2>${l.body}<div class="lnav">${i>0?`<button class="btn ghost" id="prevL">← ${LESSONS[i-1].title.split('.')[0]}</button>`:''}<button class="btn ${ST.lessons[id]?'ghost':''}" id="doneL">${ST.lessons[id]?'✓ Marked done':'Mark lesson done'}</button>${l.topic!=='method'?`<button class="btn ghost" id="pracL">Practice this topic →</button>`:''}${i<LESSONS.length-1?`<button class="btn ghost" id="nextL">Next →</button>`:''}</div>`;
  math(v);document.querySelectorAll('#lessonList .li').forEach(b=>b.classList.toggle('cur',b.dataset.id===id));
  $('#doneL').onclick=()=>{ST.lessons[id]=!ST.lessons[id];save();renderLessonList();openLesson(id);renderProgress();};
  if($('#prevL'))$('#prevL').onclick=()=>openLesson(LESSONS[i-1].id);if($('#nextL'))$('#nextL').onclick=()=>openLesson(LESSONS[i+1].id);
  if($('#pracL'))$('#pracL').onclick=()=>{setTopics([l.topic]);show('practice');nextPractice();};
  v.scrollIntoView({block:'start'});}

// ---------- Item rendering (shared by practice / mistakes) ----------
// opts: {guided:bool, onDone(ok)}
function renderItem(host,item,opts={}){
  host.innerHTML='';const box=document.createElement('div');box.className='card item';host.appendChild(box);
  let firstTryOk=true;
  const finish=(ok)=>{rec(topicOf(item),ok);if(!ok)addMistake(item);else if(opts.fromMistakes)dropMistake(item);opts.onDone&&opts.onDone(ok);};
  if(item.type==='concept'){
    const c=CON_BY[item.cid];
    box.innerHTML=`<div class="meta">${TOPICS[c.topic]} · concept check${c.src?` · from ${c.src}`:''}</div><div class="stem">${c.q}</div><div class="choices"></div><div class="fb"></div>`;
    mcInto(box.querySelector('.choices'),c.choices,(ok,ch)=>{box.querySelector('.fb').innerHTML=fbHTML(ok,ch.why,c.choices);math(box);finish(ok);},true);
    math(box);return;
  }
  if(item.type==='deriv'){
    const d=DER_BY[item.did];
    box.innerHTML=`<div class="meta">${TOPICS[d.topic]} · derivation (symbols only)</div><h3>${d.title}</h3><div class="stem">${d.q}</div><div class="steps"></div>`;
    const stepsEl=box.querySelector('.steps');let k=0;
    const runStep=()=>{if(k>=d.steps.length){const s=document.createElement('div');s.innerHTML=`<h4>Full write-up (how to show it on the test)</h4>${d.solution}`;stepsEl.appendChild(s);math(s);finish(firstTryOk);return;}
      const st=d.steps[k];const s=document.createElement('div');s.className='step';s.innerHTML=`<div class="sp">${st.prompt}</div><div class="choices"></div><div class="fb"></div>`;stepsEl.appendChild(s);
      mcInto(s.querySelector('.choices'),st.choices,(ok,ch)=>{if(!ok)firstTryOk=false;s.querySelector('.fb').innerHTML=fbHTML(ok,ch.why,st.choices);math(s);k++;runStep();},true);math(s);};
    runStep();math(box);return;
  }
  // generated numeric
  const g=GEN_BY[item.gid];const p=g.gen(mkR(item.seed));const guided=opts.guided!==false;
  box.innerHTML=`<div class="meta">${TOPICS[g.topic]} · ${g.name}</div><div class="stem">${p.stem}</div>${p.fig?`<div class="figwrap">${p.fig}</div>`:''}<div class="steps"></div>`;
  const stepsEl=box.querySelector('.steps');let k=0;const steps=guided?p.steps:[];
  const runFinal=()=>{const s=document.createElement('div');s.className='step final';s.innerHTML=`<div class="sp">${guided?p.final.prompt:'Your answer'+(p.final.unit?` (${p.final.unit})`:'')+':'}</div><div class="numrow"><input class="num" inputmode="decimal" placeholder="e.g. 2.87 or 2.9e4"><button class="btn chk">Check</button><button class="btn ghost giveup">Show me</button></div><div class="fb"></div>`;stepsEl.appendChild(s);math(s);
    const inp=s.querySelector('.num');inp.focus({preventScroll:true});let tries=0;
    const done=(ok,shown)=>{s.querySelector('.numrow').querySelectorAll('button,input').forEach(e=>e.disabled=true);
      s.querySelector('.fb').innerHTML=`<div class="${ok?'good':'bad'}">${ok?'✓ Correct!':shown?'Here\'s the answer:':'✗ Not quite.'} Answer: <b>\\(${fmt(p.final.ans)}\\)</b> ${p.final.unit}</div><h4>Full worked solution</h4>${p.solution}`;math(s);finish(ok&&firstTryOk);};
    s.querySelector('.chk').onclick=()=>{const v=inp.value;if(!isFinite(parseNum(v))){s.querySelector('.fb').innerHTML='<div class="warn">Type a number (you can use 2.9e4 for 2.9 × 10⁴).</div>';return;}
      if(numOK(v,p.final.ans)) done(true); else {tries++;firstTryOk=false; if(tries>=2) done(false); else s.querySelector('.fb').innerHTML=`<div class="bad">✗ Not quite. Check signs, sin vs cos, and that your calculator is in DEGREES. One more try.</div>`;}};
    inp.onkeydown=e=>{if(e.key==='Enter')s.querySelector('.chk').click();};
    s.querySelector('.giveup').onclick=()=>{firstTryOk=false;done(false,true);};};
  const runStep=()=>{if(k>=steps.length){runFinal();return;}const st=steps[k];const s=document.createElement('div');s.className='step';s.innerHTML=`<div class="sp">${st.prompt}</div><div class="choices"></div><div class="fb"></div>`;stepsEl.appendChild(s);
    const next=()=>{if(st.after){const a=document.createElement('div');a.className='after';a.innerHTML=`<div class="meta">Here's the correct picture:</div>${st.after}`;s.appendChild(a);}k++;runStep();};
    if(st.kind==='multi') multiInto(s.querySelector('.choices'),st.options,(ok)=>{if(!ok)firstTryOk=false;math(s);next();});
    else mcInto(s.querySelector('.choices'),st.choices,(ok,ch)=>{if(!ok)firstTryOk=false;s.querySelector('.fb').innerHTML=fbHTML(ok,ch.why,st.choices);math(s);next();},true);
    math(s);};
  runStep();math(box);
}
function fbHTML(ok,why,choices){const right=choices.find(c=>c.ok);return `<div class="${ok?'good':'bad'}">${ok?'✓ ':'✗ '}${why}</div>${ok?'':`<div class="good small">Correct: ${right.t}. ${right.why}</div>`}`;}
// single-answer MC: one click locks it in; shows the reason for every option
function mcInto(el,choices,cb){const ch=shuffle(choices);el.innerHTML=ch.map((c,i)=>`<button class="ch" data-i="${i}">${c.t}</button>`).join('');
  el.querySelectorAll('.ch').forEach(b=>b.onclick=()=>{const c=ch[+b.dataset.i];el.querySelectorAll('.ch').forEach((x,j)=>{x.disabled=true;if(ch[j].ok)x.classList.add('right');});if(!c.ok)b.classList.add('wrong');cb(c.ok,c);});math(el);}
function multiInto(el,options,cb){const op=shuffle(options);el.innerHTML=op.map((c,i)=>`<label class="ch mc"><input type="checkbox" data-i="${i}"> <span>${c.t}</span></label>`).join('')+`<button class="btn chkm">Check my FBD/bars</button>`;
  el.querySelector('.chkm').onclick=()=>{let all=true;el.querySelectorAll('input').forEach(inp=>{const c=op[+inp.dataset.i];const picked=inp.checked;const good=picked===c.ok;if(!good)all=false;const lab=inp.closest('label');lab.classList.add(c.ok?'right':'nope');if(!good)lab.classList.add('wrong');inp.disabled=true;lab.insertAdjacentHTML('beforeend',`<div class="why ${good?'':'miss'}">${good?'':(picked?'You picked this, but: ':'You missed this one: ')}${c.why}</div>`);});
    el.querySelector('.chkm').remove();el.insertAdjacentHTML('beforeend',`<div class="${all?'good':'bad'}">${all?'✓ Perfect.':'✗ Not all right. Read the notes in red above.'}</div>`);math(el);cb(all);};math(el);}

// ---------- Practice ----------
function setTopics(list){document.querySelectorAll('#topicPick input').forEach(i=>i.checked=list.includes(i.value));}
function chosenTopics(){return [...document.querySelectorAll('#topicPick input:checked')].map(i=>i.value);}
$('#topicPick').innerHTML=Object.entries(TOPICS).map(([k,v])=>`<label class="pill"><input type="checkbox" value="${k}" checked> ${v}</label>`).join('')+`<button class="btn ghost small" id="allT">All</button>`;
$('#allT').onclick=()=>setTopics(Object.keys(TOPICS));
let lastKey='';
function pickItem(){
  const tops=chosenTopics();const kind=$('#kind').value;const pool=[];
  if(kind==='mix'||kind==='gen'||kind==='hard') GENS.filter(g=>tops.includes(g.topic)&&(kind!=='hard'||g.hard)).forEach(g=>pool.push(()=>({type:'gen',gid:g.id,seed:(Math.random()*1e9)|0}))); 
  if(kind==='mix'||kind==='concept') CONCEPTS.filter(c=>tops.includes(c.topic)).forEach(c=>pool.push(()=>({type:'concept',cid:c.id})));
  if(kind==='mix'||kind==='deriv') DERIVS.filter(d=>tops.includes(d.topic)).forEach(d=>pool.push(()=>({type:'deriv',did:d.id})));
  if(!pool.length) return null;
  let it,tries=0;do{it=pool[Math.floor(Math.random()*pool.length)]();tries++;}while(tries<10&&pool.length>1&&(it.gid||it.cid||it.did)===lastKey);
  lastKey=it.gid||it.cid||it.did;return it;
}
function nextPractice(){const it=pickItem();const host=$('#practiceHost');if(!it){host.innerHTML='<div class="card">Pick at least one topic that has this kind of question.</div>';return;}
  renderItem(host,it,{guided:$('#mode').value==='guided',onDone:()=>{$('#nextP').classList.add('pulse');}});$('#nextP').classList.remove('pulse');}
$('#nextP').onclick=()=>{nextPractice();$('#practiceHost').scrollIntoView({block:'start'});};
$('#mode').onchange=nextPractice;$('#kind').onchange=nextPractice;

// ---------- Exam sim (90 min: Section I + Section II FRQs) ----------
let TEST=null,timerId=null;
const FRQ_BY=Object.fromEntries(FRQS.map(q=>[q.id,q]));
function buildTest(){const r=Math.random;const items=[];
  const hard=shuffle(GENS.filter(g=>g.hard),r).slice(0,3);hard.forEach(g=>items.push({type:'gen',gid:g.id,seed:(r()*1e9)|0}));
  const used=new Set(hard.map(g=>g.id));
  for(const t of shuffle(['forces','circular','energy','work','springs','drag','potential'],r).slice(0,5)){const g=shuffle(GENS.filter(x=>!x.hard&&x.topic===t&&!used.has(x.id)),r)[0];if(g){used.add(g.id);items.push({type:'gen',gid:g.id,seed:(r()*1e9)|0});}}
  shuffle(CONCEPTS,r).slice(0,4).forEach(c=>items.push({type:'concept',cid:c.id}));
  const sec1=shuffle(items,r);
  const f1=shuffle(FRQS,r);const fr=[f1[0]];const f2=f1.find(q=>q.topic!==f1[0].topic);fr.push(f2||f1[1]);
  return sec1.concat(fr.map(q=>({type:'frq',fid:q.id})));}
$('#startTest').onclick=()=>{const mins=+$('#tmins').value||90;TEST={items:buildTest(),i:0,ans:[],end:Date.now()+mins*60000,mins};$('#testSetup').hidden=true;$('#testRun').hidden=false;$('#testResult').hidden=true;
  clearInterval(timerId);timerId=setInterval(()=>{const left=TEST.end-Date.now();if(left<=0){clearInterval(timerId);finishTest(true);return;}const m=Math.floor(left/6e4),s=Math.floor(left%6e4/1000);$('#timer').textContent=`${m}:${String(s).padStart(2,'0')}`;$('#timer').classList.toggle('low',left<10*60000);},500);renderTestQ();};
function renderTestQ(){const it=TEST.items[TEST.i];const host=$('#testQ');const n1=TEST.items.filter(x=>x.type!=='frq').length;
  $('#tprog').textContent=it.type==='frq'?`Section II · FRQ ${TEST.i-n1+1} of ${TEST.items.length-n1}`:`Section I · Question ${TEST.i+1} of ${n1}`;
  let html='',getAns;
  if(it.type==='gen'){const g=GEN_BY[it.gid];const p=g.gen(mkR(it.seed));it._p=p;html=`<div class="meta">${TOPICS[g.topic]}${g.hard?' · ★ hard':''}</div><div class="stem">${p.stem}</div>${p.fig?`<div class="figwrap">${p.fig}</div>`:''}<div class="numrow"><input class="num" id="tAns" placeholder="answer${p.final.unit?' in '+p.final.unit:''}"> <span>${p.final.unit}</span></div><div class="note small">Do it on paper first: principle → constraint → derive in symbols → plug in. g = 9.8 m/s².</div>`;getAns=()=>$('#tAns').value;}
  else if(it.type==='concept'){const c=CON_BY[it.cid];it._ch=shuffle(c.choices);html=`<div class="meta">${TOPICS[c.topic]} · concept</div><div class="stem">${c.q}</div><div class="choices">${it._ch.map((x,i)=>`<label class="ch mc"><input type="radio" name="tq" value="${i}"> <span>${x.t}</span></label>`).join('')}</div>`;getAns=()=>{const r=document.querySelector('input[name=tq]:checked');return r?+r.value:null;};}
  else if(it.type==='frq'){const q=FRQ_BY[it.fid];html=`<div class="meta">Free response · 15 points · aim for ~20 min</div><h3>${q.title}</h3><div class="stem">${q.stem}</div>${q.parts.map(p=>`<div class="fpart"><div class="sp">${p.q} <span class="pts">[${p.pts} pt${p.pts>1?'s':''}]</span></div>${p.fig||''}</div>`).join('')}<div class="note">Write everything on paper. You'll grade yourself with the official-style rubric at the end.</div>`;getAns=()=>'done';}
  host.innerHTML=`<div class="card">${html}<div class="lnav"><button class="btn" id="lockIn">${it.type==='frq'?'I\'m done with this FRQ → next':'Lock in &amp; next →'}</button><span class="note small">No going back after you lock in (like the real test).</span></div></div>`;math(host);window.scrollTo(0,0);
  if($('#tAns'))$('#tAns').onkeydown=e=>{if(e.key==='Enter')$('#lockIn').click();};
  $('#lockIn').onclick=()=>{const a=getAns();if(a===null||a===''){if(!confirm('Leave this one blank?'))return;}TEST.ans[TEST.i]=a;TEST.i++;if(TEST.i>=TEST.items.length)finishTest(false);else renderTestQ();};}
function finishTest(timeUp){clearInterval(timerId);$('#testRun').hidden=true;const res=$('#testResult');res.hidden=false;let score=0,n1=0;const rows=[],frqRows=[];
  TEST.items.forEach((it,i)=>{const a=TEST.ans[i];let ok=false,body='';
    if(it.type==='frq'){frqRows.push(it.fid);return;}
    n1++;
    if(it.type==='gen'){const p=it._p||GEN_BY[it.gid].gen(mkR(it.seed));ok=a!=null&&a!==''&&numOK(a,p.final.ans);body=`<div class="stem">${p.stem}</div>${p.fig?`<div class="figwrap">${p.fig}</div>`:''}<div>Your answer: <b>${a==null||a===''?'(blank)':String(a).replace(/</g,'&lt;')}</b> · Correct: <b>\\(${fmt(p.final.ans)}\\)</b> ${p.final.unit}</div>${p.solution}`;}
    else {const src=CON_BY[it.cid];const chs=it._ch||src.choices;const pick=a==null?null:chs[a];ok=!!(pick&&pick.ok);const right=chs.find(c=>c.ok);
      body=`<div class="stem">${src.q}</div><div>Your answer: <b>${pick?pick.t:'(blank)'}</b>${pick&&!pick.ok?`<div class="bad small">Why that's wrong: ${pick.why}</div>`:''}</div><div class="good small">Correct: ${right.t}. ${right.why}</div>`;}
    if(ok)score++;else addMistake({type:it.type,gid:it.gid,seed:it.seed,cid:it.cid});rec(topicOf(it),ok);
    rows.push(`<details class="card rev ${ok?'okr':'badr'}" ${ok?'':'open'}><summary>${ok?'✓':'✗'} Q${i+1} · ${TOPICS[topicOf(it)]}</summary>${body}</details>`);});
  const pct=Math.round(100*score/n1);ST.tests.push({at:Date.now(),score,n:n1});save();
  res.innerHTML=`<div class="card"><h2>${timeUp?'Time\'s up! ':''}Section I: ${score}/${n1} (${pct}%)</h2><p>Section II: grade your FRQs below with the rubric (tick each point you earned). Missed Section I questions were saved to <b>Mistakes</b>.</p><div id="frqTotal" class="big"></div><button class="btn" id="again">Take another exam sim</button> <button class="btn ghost" id="toMist">Go to Mistakes</button></div>
  <h2>Section II: FRQs (self-grade)</h2><div id="frqGrade"></div><h2>Section I review</h2>${rows.join('')}`;
  const fg=$('#frqGrade');const totals={};
  frqRows.forEach(fid=>{const d=document.createElement('div');fg.appendChild(d);renderFRQ(d,FRQ_BY[fid],{reveal:true,onScore:(s)=>{totals[fid]=s;const t=Object.values(totals).reduce((a,b)=>a+b,0);$('#frqTotal').innerHTML=`Section II self-score: <b>${t}/${frqRows.length*15}</b>`;}});});
  $('#frqTotal').innerHTML=`Section II self-score: <b>0/${frqRows.length*15}</b>`;
  math(res);window.scrollTo(0,0);
  $('#again').onclick=()=>{$('#testSetup').hidden=false;res.hidden=true;};$('#toMist').onclick=()=>show('mistakes');renderProgress();}
$('#quitTest').onclick=()=>{if(confirm('End the test now and grade it?'))finishTest(false);};

// ---------- FRQ rendering (practice + grading) ----------
function renderFRQ(host,q,opts={}){
  const best=(ST.frq||{})[q.id];
  host.innerHTML=`<div class="card frq"><div class="meta">${TOPICS[q.topic]||''} · 15 points${best!=null?` · your best: ${best}/15`:''}</div><h3>${q.title}</h3><div class="stem">${q.stem}</div>
  ${q.parts.map((p,i)=>`<div class="fpart" data-i="${i}"><div class="sp">${p.q} <span class="pts">[${p.pts} pt${p.pts>1?'s':''}]</span></div>${p.fig||''}
   <button class="btn ghost small reveal">Show answer + rubric</button><div class="fsol" hidden><div class="solbox">${p.sol}</div><div class="rub"><b>Rubric: tick each point you earned</b>${p.rub.map((r,j)=>`<label class="rpt"><input type="checkbox" data-p="${i}" data-j="${j}"> ${r} <span class="pts">(1 pt)</span></label>`).join('')}</div></div></div>`).join('')}
  <div class="fscore big">Score: <b>0</b>/15</div></div>`;
  const upd=()=>{const s=host.querySelectorAll('.rub input:checked').length;host.querySelector('.fscore b').textContent=s;ST.frq=ST.frq||{};if(ST.frq[q.id]==null||s>ST.frq[q.id]){ST.frq[q.id]=s;save();}opts.onScore&&opts.onScore(s);};
  host.querySelectorAll('.reveal').forEach(b=>b.onclick=()=>{const f=b.nextElementSibling;f.hidden=!f.hidden;b.textContent=f.hidden?'Show answer + rubric':'Hide answer';});
  host.querySelectorAll('.rub input').forEach(c=>c.onchange=upd);
  if(opts.reveal)host.querySelectorAll('.reveal').forEach(b=>b.click());
  math(host);
}
function renderFRQList(){const l=$('#frqList');l.innerHTML=FRQS.map(q=>{const b=(ST.frq||{})[q.id];return `<button class="li" data-id="${q.id}">${q.title}${b!=null?` <span class="pts">· best ${b}/15</span>`:''}</button>`;}).join('');
  l.querySelectorAll('.li').forEach(b=>b.onclick=()=>{l.querySelectorAll('.li').forEach(x=>x.classList.toggle('cur',x===b));renderFRQ($('#frqView'),FRQ_BY[b.dataset.id]);$('#frqView').scrollIntoView({block:'start'});});}

// ---------- BASICS ----------
ST.basics=ST.basics||{facts:{},method:{n:0,c:0},tf:{n:0,c:0},fbd:{n:0,c:0},bars:{n:0,c:0}};
function bRec(k,ok){const s=ST.basics[k];s.n++;if(ok)s.c++;save();bStats();}
function bStats(){const b=ST.basics;const fl=ST.fl||{};const fc=(typeof FCARDS!=='undefined'?FCARDS:[]).filter(c=>c.sec!=='X');const got=fc.filter(c=>fl[c.id]===1).length;const miss=fc.filter(c=>(ST.flMiss||{})[c.id]).length;$('#bStats').innerHTML=`Flashcards A–F: <b>${got}/${fc.length}</b> got it${miss?` (${miss} to review)`:''} · Basics Quiz best: <b>${b.quizBest==null?'not taken':b.quizBest+'/20'}</b> · Which principle: <b>${b.method.c}/${b.method.n}</b> · True/False: <b>${b.tf.c}/${b.tf.n}</b> · FBD builder: <b>${b.fbd.c}/${b.fbd.n}</b> · Bar charts: <b>${b.bars.c}/${b.bars.n}</b>`;}
function bShow(k){document.querySelectorAll('.bsub').forEach(b=>b.classList.toggle('on',b.dataset.k===k));FQ=null;({facts:flashMenu,flash:flashMenu,quiz:bQuiz,method:bMethod,tf:bTF,fbd:bFBD,bars:bBars})[k]();}
document.querySelectorAll('.bsub').forEach(b=>b.onclick=()=>bShow(b.dataset.k));
function bFacts(){const h=$('#bHost');const groups=[...new Set(FACTS.map(f=>f[0]))];const onlyUnsure=h.dataset.unsure==='1';
  h.innerHTML=`<div class="card"><p>Read the question, say the answer out loud (or write it), THEN click to check. Mark each one. Goal: all ${FACTS.length} marked "I knew it."</p><button class="btn ghost small" id="fx">${onlyUnsure?'Show all':'Show only the ones I don\'t know yet'}</button> <button class="btn ghost small" id="fopen">Reveal all (reading mode)</button></div>`+
  groups.map(g=>`<h3>${g}</h3><div class="fgrid">${FACTS.map((f,i)=>[f,i]).filter(([f,i])=>f[0]===g&&(!onlyUnsure||ST.basics.facts[i]!==1)).map(([f,i])=>`<div class="fcard ${ST.basics.facts[i]===1?'known':ST.basics.facts[i]===0?'unsure':''}" data-i="${i}"><div class="fq">${f[1]}</div><div class="fa" hidden>${f[2]}<div class="fbtns"><button class="btn small" data-v="1">I knew it ✓</button><button class="btn small ghost" data-v="0">Didn't know ✗</button></div></div><button class="btn ghost small fshow">Show answer</button></div>`).join('')}</div>`).join('');
  h.querySelector('#fx').onclick=()=>{h.dataset.unsure=onlyUnsure?'0':'1';bFacts();};
  h.querySelector('#fopen').onclick=()=>h.querySelectorAll('.fcard').forEach(c=>{c.querySelector('.fa').hidden=false;c.querySelector('.fshow').hidden=true;});
  h.querySelectorAll('.fcard').forEach(c=>{c.querySelector('.fshow').onclick=()=>{c.querySelector('.fa').hidden=false;c.querySelector('.fshow').hidden=true;};
    c.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{ST.basics.facts[c.dataset.i]=+b.dataset.v;save();c.classList.toggle('known',b.dataset.v==='1');c.classList.toggle('unsure',b.dataset.v==='0');bStats();});});
  math(h);}
let mLast=-1,tLast=-1,fLast=-1,bLast=-1;
const pickIdx=(n,last)=>{let i;do{i=Math.floor(Math.random()*n);}while(n>1&&i===last);return i;};
function bMethod(){const h=$('#bHost');const i=mLast=pickIdx(METHOD_Q.length,mLast);const [q,ans,why]=METHOD_Q[i];
  h.innerHTML=`<div class="card"><div class="meta">Which principle do you START with?</div><div class="stem">${q}</div><div class="choices">${METHOD_OPTS.map(o=>`<button class="ch" data-k="${o.k}">${o.t}</button>`).join('')}</div><div class="fb"></div><button class="btn" id="bNext">Next →</button></div>`;
  h.querySelectorAll('.ch').forEach(b=>b.onclick=()=>{const ok=b.dataset.k===ans;h.querySelectorAll('.ch').forEach(x=>{x.disabled=true;if(x.dataset.k===ans)x.classList.add('right');});if(!ok)b.classList.add('wrong');h.querySelector('.fb').innerHTML=`<div class="${ok?'good':'bad'}">${ok?'✓ ':'✗ Best start: '+METHOD_OPTS.find(o=>o.k===ans).t+'. '}${why}</div>`;bRec('method',ok);});
  $('#bNext').onclick=bMethod;}
function bTF(){const h=$('#bHost');const i=tLast=pickIdx(TF.length,tLast);const [q,ans,why]=TF[i];
  h.innerHTML=`<div class="card"><div class="meta">True or false?</div><div class="stem">${q}</div><div class="row"><button class="btn tfb" data-v="1">True</button><button class="btn tfb" data-v="0">False</button></div><div class="fb"></div><button class="btn ghost" id="bNext">Next →</button></div>`;
  h.querySelectorAll('.tfb').forEach(b=>b.onclick=()=>{const ok=(b.dataset.v==='1')===ans;h.querySelectorAll('.tfb').forEach(x=>x.disabled=true);h.querySelector('.fb').innerHTML=`<div class="${ok?'good':'bad'}">${ok?'✓':'✗'} ${ans?'TRUE':'FALSE'}. ${why}</div>`;bRec('tf',ok);});
  $('#bNext').onclick=bTF;}
function bFBD(){const h=$('#bHost');const i=fLast=pickIdx(FBD_S.length,fLast);const s=FBD_S[i];
  h.innerHTML=`<div class="card"><div class="meta">FBD builder: for each possible force, choose its direction or "not acting"</div><div class="stem"><b>${s.title}</b></div>
  <table class="tbl fbdt">${shuffle(s.forces).map(f=>`<tr data-n="${f.n}"><td>${f.n}</td><td><select><option value="">choose…</option>${shuffle(f.opts).map(o=>`<option>${o}</option>`).join('')}</select></td><td class="fwhy"></td></tr>`).join('')}</table>
  <button class="btn" id="fchk">Check my FBD</button><div class="fb"></div><button class="btn ghost" id="bNext">Next scenario →</button></div>`;
  $('#fchk').onclick=()=>{let all=true;h.querySelectorAll('.fbdt tr').forEach(tr=>{const f=s.forces.find(x=>x.n===tr.dataset.n);const v=tr.querySelector('select').value;const ok=v===f.ok;if(!ok)all=false;tr.classList.add(ok?'okrow':'badrow');tr.querySelector('.fwhy').innerHTML=`${ok?'✓':'✗ Answer: <b>'+f.ok+'</b>.'} ${f.why}`;tr.querySelector('select').disabled=true;});
    const arrows=s.forces.filter(f=>f.ok!==NOT).map(f=>({len:70,...f.arrow}));
    h.querySelector('.fb').innerHTML=`<div class="${all?'good':'bad'}">${all?'✓ Perfect FBD!':'✗ Not quite. Fix the red rows in your head.'} Here is the correct diagram:</div>${fbdSVG(arrows,{tilt:s.tilt,h:s.h})}`;$('#fchk').remove();bRec('fbd',all);};
  $('#bNext').onclick=bFBD;}
function bBars(){const h=$('#bHost');const i=bLast=pickIdx(BAR_S.length,bLast);const s=BAR_S[i];
  h.innerHTML=`<div class="card"><div class="meta">Energy bar chart builder: which bars are NOT zero?</div><div class="stem"><b>${s.title}</b><br><span class="small">System: ${s.sys}</span></div>
  <div class="bgrid">${BAR_KEYS.map(([k,n])=>`<label class="bk"><span>${n}</span><select data-k="${k}">${k==='W'?'<option value="0">0</option><option value="+">+ (adds energy)</option><option value="-">− (removes energy)</option>':'<option value="0">0</option><option value="1">not zero</option>'}</select></label>`).join('')}</div>
  <button class="btn" id="bchk">Check my bar chart</button><div class="fb"></div><button class="btn ghost" id="bNext">Next scenario →</button></div>`;
  $('#bchk').onclick=()=>{let all=true;const wrong=[];h.querySelectorAll('.bgrid select').forEach(sel=>{const k=sel.dataset.k;const val=s.v[k]||0;const want=k==='W'?(val>0?'+':val<0?'-':'0'):(val?'1':'0');const ok=sel.value===want;if(!ok){all=false;wrong.push(BAR_KEYS.find(b=>b[0]===k)[1]);}sel.closest('.bk').classList.add(ok?'okrow':'badrow');sel.disabled=true;});
    h.querySelector('.fb').innerHTML=`<div class="${all?'good':'bad'}">${all?'✓ Perfect!':'✗ Check: '+wrong.join(', ')+'.'} ${s.why}</div>${barChart(s.v)}<div>Equation (one term per bar): \\[${s.eq}\\]</div>`;math(h);$('#bchk').remove();bRec('bars',all);};
  $('#bNext').onclick=bBars;}

// ---------- Mistakes ----------
function itemLabel(it){if(it.type==='gen')return GEN_BY[it.gid].name;if(it.type==='concept'){const q=CON_BY[it.cid].q.replace(/\\\(|\\\)/g,'').replace(/…$/,'');return q.length>90?q.slice(0,90)+'…':q;}return DER_BY[it.did].title;}
function renderMistakes(){const list=$('#mList');if(!ST.mistakes.length){list.innerHTML='<div class="card">No mistakes saved yet. Anything you miss in Practice or a Test shows up here.</div>';$('#mHost').innerHTML='';return;}
  list.innerHTML=`<div class="card"><b>${ST.mistakes.length}</b> saved. Get one right and it leaves the list. <button class="btn small" id="mAll">Retry all (shuffled)</button></div>`+ST.mistakes.map((m,i)=>`<div class="mrow"><span class="tagt">${TOPICS[topicOf(m.item)]}</span> ${itemLabel(m.item)} <button class="btn small" data-i="${i}" data-a="same">Retry</button>${m.item.type==='gen'?`<button class="btn small ghost" data-i="${i}" data-a="new">New numbers</button>`:''}<button class="btn small ghost" data-i="${i}" data-a="del">✕</button></div>`).join('');
  math(list);
  list.querySelectorAll('button[data-a]').forEach(b=>b.onclick=()=>{const m=ST.mistakes[+b.dataset.i];if(b.dataset.a==='del'){ST.mistakes.splice(+b.dataset.i,1);save();renderMistakes();return;}
    let it=m.item;if(b.dataset.a==='new'){dropMistake(it);it={...it,seed:(Math.random()*1e9)|0};}
    renderItem($('#mHost'),it,{guided:true,fromMistakes:true,onDone:()=>setTimeout(()=>{const keep=$('#mHost').innerHTML;renderMistakes();$('#mHost').innerHTML=keep;math($('#mHost'));},50)});$('#mHost').scrollIntoView({block:'start'});});
  if($('#mAll'))$('#mAll').onclick=()=>{const q=shuffle(ST.mistakes.map(m=>m.item));let j=0;const go=()=>{if(j>=q.length){renderMistakes();return;}renderItem($('#mHost'),q[j],{guided:true,fromMistakes:true,onDone:()=>{const b=document.createElement('button');b.className='btn';b.textContent=j<q.length-1?'Next mistake →':'Done';b.onclick=()=>{j++;go();};$('#mHost').appendChild(b);}});$('#mHost').scrollIntoView({block:'start'});};go();};
}

// ---------- Progress ----------
function renderProgress(){const done=LESSONS.filter(l=>ST.lessons[l.id]).length;
  const rows=Object.entries(TOPICS).map(([k,v])=>{const s=ST.stats[k]||{n:0,c:0};const p=s.n?Math.round(100*s.c/s.n):0;return `<div class="prow"><span>${v}</span><div class="bar"><div style="width:${p}%;background:${p>=80?'#16a34a':p>=60?'#d97706':'#dc2626'}"></div></div><span class="small">${s.n?`${s.c}/${s.n} (${p}%)`:'not started'}</span></div>`;}).join('');
  const lt=ST.tests[ST.tests.length-1];
  $('#progress').innerHTML=`<div><b>Lessons:</b> ${done}/${LESSONS.length} done</div>${rows}<div class="small">${lt?`Last test: ${lt.score}/${lt.n}`:'No test taken yet'} · Mistakes saved: ${ST.mistakes.length}</div><button class="btn ghost small" id="reset">Reset all progress</button>`;
  $('#reset').onclick=()=>{if(confirm('Erase all progress on this device?')){LS.removeItem(KEY);location.reload();}};}

// ---------- init ----------
bStats();renderLessonList();$('#cheatHost').innerHTML=CHEAT;math($('#cheatHost'));renderProgress();math($('#p-home'));
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{show(b.dataset.go);if(b.dataset.lesson)openLesson(b.dataset.lesson);if(b.dataset.go==='practice'&&!$('#practiceHost').innerHTML)nextPractice();});
show('home');


// ================= PLAN (Home) =================
ST.plan=ST.plan||{};ST.fl=ST.fl||{};ST.basics.quizBest=ST.basics.quizBest??null;
function goAct(a){
  if(a.yt){window.open('https://www.youtube.com/watch?v='+a.yt,'_blank','noopener');return;}
  if(a.lesson){show('learn');openLesson(a.lesson);return;}
  if(a.basics){show('basics');bShow(a.basics);return;}
  if(a.flash){show('basics');bShow('flash');startFlash(a.flash==='missed'?'missed':a.flash.split(''));return;}
  if(a.practice){show('practice');setTopics(a.practice.topics);$('#mode').value=a.practice.mode;$('#kind').value=a.practice.kind;nextPractice();return;}
  if(a.frq){show('frq');renderFRQList();$('#frqList').querySelectorAll('.li').forEach(x=>x.classList.toggle('cur',x.dataset.id===a.frq));renderFRQ($('#frqView'),FRQ_BY[a.frq]);return;}
  if(a.tab){show(a.tab);}
}
function renderPlan(){
  const host=$('#planHost');let total=0,done=0;
  host.innerHTML=PLAN.map((d,di)=>{const nd=d.blocks.filter(b=>ST.plan[b.id]).length;total+=d.blocks.length;done+=nd;
    return `<div class="card day"><h2>${d.day} <span class="small mut">${nd}/${d.blocks.length} done</span></h2><p class="note">${d.goal}</p>
    ${d.blocks.map(b=>`<div class="pblock ${ST.plan[b.id]?'pdone':''}" id="pb-${b.id}">
      <label class="pchk"><input type="checkbox" data-id="${b.id}" ${ST.plan[b.id]?'checked':''}> <b>${b.title}</b> <span class="ptime">${b.time}</span></label>
      <ol class="phow">${b.how.map(h=>`<li>${h}</li>`).join('')}</ol>
      ${b.acts.length?`<div class="pacts">${b.acts.map((a,ai)=>`<button class="btn small ${a.yt?'ghost yt':''}" data-b="${b.id}" data-a="${ai}">${a.t}</button>`).join('')}</div>`:''}
      <div class="pdonewhen">Done when: ${b.done}</div></div>`).join('')}</div>`;}).join('');
  $('#planBar').style.width=Math.round(100*done/total)+'%';$('#planPct').textContent=`${done}/${total} steps done`;
  host.querySelectorAll('.pchk input').forEach(c=>c.onchange=()=>{ST.plan[c.dataset.id]=c.checked;save();renderPlan();});
  host.querySelectorAll('.pacts button').forEach(btn=>btn.onclick=()=>{const b=PLAN.flatMap(d=>d.blocks).find(x=>x.id===btn.dataset.b);goAct(b.acts[+btn.dataset.a]);});
}
function nextStep(){const b=PLAN.flatMap(d=>d.blocks).find(x=>!ST.plan[x.id]);if(!b){alert('Every step is done. Go get some sleep and crush the test!');return;}
  show('home');const el=document.getElementById('pb-'+b.id);el.scrollIntoView({block:'center',behavior:'smooth'});el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),2000);}

// ================= FOCUS TIMER =================
const FT={left:25*60,mode:'focus',run:false,id:null};
function ftDraw(){const m=Math.floor(FT.left/60),s=FT.left%60;$('#ftTime').textContent=`${FT.mode==='focus'?'Focus':'Break'} ${m}:${String(s).padStart(2,'0')}`;$('#ftBtn').textContent=FT.run?'Pause':'Start';$('#ftBox').classList.toggle('brk',FT.mode==='break');}
function ftBeep(){try{const c=new (window.AudioContext||window.webkitAudioContext)();[0,0.3,0.6].forEach(t=>{const o=c.createOscillator();o.frequency.value=880;o.connect(c.destination);o.start(c.currentTime+t);o.stop(c.currentTime+t+0.15);});}catch(e){}}
function ftTick(){if(!FT.run)return;FT.left--;if(FT.left<=0){ftBeep();if(FT.mode==='focus'){FT.mode='break';FT.left=5*60;}else{FT.mode='focus';FT.left=25*60;FT.run=false;clearInterval(FT.id);}}ftDraw();}
$('#ftBtn').onclick=()=>{FT.run=!FT.run;clearInterval(FT.id);if(FT.run)FT.id=setInterval(ftTick,1000);ftDraw();};
$('#ftReset').onclick=()=>{FT.run=false;clearInterval(FT.id);FT.mode='focus';FT.left=25*60;ftDraw();};

// ================= FLASHCARDS =================
var FCARDS=FLASH.map((c,i)=>({id:'f'+i,sec:c[0],q:c[1],a:c[2]})).concat(FACTS.map((f,i)=>({id:'x'+i,sec:'X',q:f[1],a:f[2]})));
var FQ=null;
function flashMenu(){const h=$('#bHost');const secs=Object.keys(FLASH_SECTIONS);const missed=FCARDS.filter(c=>ST.flMiss[c.id]).length;
  h.innerHTML=`<div class="card"><h3>Flashcards</h3><p>Read the question. <b>Say the answer out loud</b> (or write it). THEN flip. Be honest: if you weren't sure, hit <b>Again</b>. "Again" cards come back until you get them.</p>
  <div class="fsecs">${secs.map(k=>{const cs=FCARDS.filter(c=>c.sec===k);const got=cs.filter(c=>ST.fl[c.id]===1).length;return `<label class="pill"><input type="checkbox" value="${k}" ${k!=='X'?'checked':''}> ${FLASH_SECTIONS[k]} <span class="small mut">${got}/${cs.length}</span></label>`;}).join('')}</div>
  <div class="row" style="margin-top:10px"><button class="btn" id="fsStart">Start selected</button><button class="btn ghost" id="fsMissed" ${missed?'':'disabled'}>Missed only (${missed})</button><button class="btn ghost" id="fsList">List view (read all)</button></div></div><div id="fcHost"></div>`;
  const sel=()=>[...h.querySelectorAll('.fsecs input:checked')].map(i=>i.value);
  $('#fsStart').onclick=()=>startFlash(sel());$('#fsMissed').onclick=()=>startFlash('missed');
  $('#fsList').onclick=()=>{const s=sel();$('#fcHost').innerHTML=s.map(k=>`<div class="card"><h3>${FLASH_SECTIONS[k]}</h3><table class="tbl">${FCARDS.filter(c=>c.sec===k).map(c=>`<tr><td><b>${c.q}</b></td><td>${c.a}</td></tr>`).join('')}</table></div>`).join('');math($('#fcHost'));};}
function startFlash(secs){if($('#bHost .fsecs')==null)flashMenu();
  const cards=secs==='missed'?FCARDS.filter(c=>ST.flMiss[c.id]):FCARDS.filter(c=>secs.includes(c.sec));
  if(!cards.length){$('#fcHost').innerHTML=`<div class="card">${secs==='missed'?'No missed cards right now. If you haven\'t done the flashcards yet, pick sections above and press "Start selected".':'No cards in those sections.'}</div>`;return;}
  FQ={q:shuffle(cards),got:0,again:0,flip:false,n:cards.length,missedThisRound:new Set()};drawCard();$('#fcHost').scrollIntoView({block:'start'});}
function drawCard(){const host=$('#fcHost');if(!FQ)return;
  if(!FQ.q.length){const m=FQ.missedThisRound.size;host.innerHTML=`<div class="card fcard2 donecard"><h2>Round done!</h2><p>${FQ.n} cards. ${m?`You had to repeat ${m} of them, and they're saved under "Missed only".`:'You got every card on the first try!'}</p><button class="btn" id="fcAgain">Run missed only</button> <button class="btn ghost" id="fcMenu">Back to sections</button></div>`;
    $('#fcAgain').onclick=()=>startFlash('missed');$('#fcMenu').onclick=()=>{FQ=null;flashMenu();};bStats();return;}
  const c=FQ.q[0];
  host.innerHTML=`<div class="card fcard2"><div class="meta">${FLASH_SECTIONS[c.sec]} · ${FQ.q.length} left · ✓ ${FQ.got} · ↻ ${FQ.again}</div>
  <div class="fcq">${c.q}</div>${FQ.flip?`<div class="fca">${c.a}</div><div class="row"><button class="btn good-b" id="fcGot">Got it ✓ <span class="small">(1)</span></button><button class="btn bad-b" id="fcAg">Again ✗ <span class="small">(2)</span></button></div>`:`<button class="btn" id="fcFlip">Show answer <span class="small">(space)</span></button>`}
  <div class="small mut" style="margin-top:8px">Keyboard: space = flip, 1 = got it, 2 = again</div></div>`;math(host);
  if(FQ.flip){$('#fcGot').onclick=()=>fcMark(true);$('#fcAg').onclick=()=>fcMark(false);}else $('#fcFlip').onclick=()=>{FQ.flip=true;drawCard();};}
function fcMark(ok){const c=FQ.q.shift();FQ.flip=false;if(ok){FQ.got++;ST.fl[c.id]=1;if(!FQ.missedThisRound.has(c.id))delete ST.flMiss[c.id];}else{FQ.again++;ST.fl[c.id]=0;ST.flMiss[c.id]=true;FQ.missedThisRound.add(c.id);FQ.q.push(c);}save();drawCard();bStats();}
document.addEventListener('keydown',e=>{if(!FQ||!$('#fcHost')||$('#p-basics').hidden||!document.querySelector('.fcard2:not(.donecard)'))return;if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT')return;
  if((e.key===' '||e.key==='Enter')&&!FQ.flip){e.preventDefault();FQ.flip=true;drawCard();}else if(FQ.flip&&e.key==='1')fcMark(true);else if(FQ.flip&&e.key==='2')fcMark(false);});

// ================= BASICS QUIZ =================
var BQ=null;
function buildBQ(){const qs=[];
  shuffle(TF).slice(0,9).forEach(([q,ans,why])=>qs.push({kind:'tf',q,ch:[{t:'True',ok:ans},{t:'False',ok:!ans}],why}));
  shuffle(METHOD_Q).slice(0,6).forEach(([q,ans,why])=>qs.push({kind:'method',q:'Which principle do you START with? '+q,ch:METHOD_OPTS.map(o=>({t:o.t,ok:o.k===ans})),why}));
  const pool=[];FBD_S.forEach(s=>s.forces.forEach(f=>pool.push({s,f})));
  shuffle(pool).slice(0,5).forEach(({s,f})=>qs.push({kind:'fbd',q:`FBD: <b>${s.title}</b><br>The force "${f.n}": which direction (or not acting)?`,ch:f.opts.map(o=>({t:o,ok:o===f.ok})),why:f.why}));
  return shuffle(qs);}
function bQuiz(){BQ={qs:buildBQ(),i:0,score:0,missed:[]};drawBQ();}
function drawBQ(){const h=$('#bHost');
  if(BQ.i>=BQ.qs.length){const best=Math.max(ST.basics.quizBest??0,BQ.score);ST.basics.quizBest=best;save();bStats();
    h.innerHTML=`<div class="card"><h2>Basics Quiz: ${BQ.score}/${BQ.qs.length}</h2><p>${BQ.score>=16?'Solid! You\'re ready for topic practice.':'Under 16: redo the flashcards you marked "Again", then retake this quiz.'}</p>${BQ.missed.length?`<h3>What you missed</h3>${BQ.missed.map(m=>`<div class="mrow"><div><div>${m.q}</div><div class="good small">Answer: ${m.ans}. ${m.why}</div></div></div>`).join('')}`:''}<button class="btn" id="bqAgain">Take a new quiz</button> <button class="btn ghost" id="bqFlash">Flashcards: missed only</button></div>`;
    $('#bqAgain').onclick=bQuiz;$('#bqFlash').onclick=()=>{bShow('flash');startFlash('missed');};return;}
  const q=BQ.qs[BQ.i];const ch=q.kind==='tf'?q.ch:shuffle(q.ch);
  h.innerHTML=`<div class="card"><div class="meta">Basics Quiz · question ${BQ.i+1} of ${BQ.qs.length} · score ${BQ.score}</div><div class="stem">${q.q}</div><div class="choices">${ch.map((c,i)=>`<button class="ch" data-i="${i}">${c.t}</button>`).join('')}</div><div class="fb"></div></div>`;
  h.querySelectorAll('.ch').forEach(b=>b.onclick=()=>{const c=ch[+b.dataset.i];const right=ch.find(x=>x.ok);h.querySelectorAll('.ch').forEach((x,j)=>{x.disabled=true;if(ch[j].ok)x.classList.add('right');});
    if(c.ok)BQ.score++;else{b.classList.add('wrong');BQ.missed.push({q:q.q,ans:right.t,why:q.why});}
    h.querySelector('.fb').innerHTML=`<div class="${c.ok?'good':'bad'}">${c.ok?'✓ ':'✗ Answer: '+right.t+'. '}${q.why}</div><button class="btn" id="bqNext">${BQ.i+1<BQ.qs.length?'Next →':'See my score'}</button>`;
    $('#bqNext').onclick=()=>{BQ.i++;drawBQ();};});}
$('#nextStepBtn').onclick=nextStep;renderPlan();ftDraw();

bStats();
