// ===== App =====
const $=s=>document.querySelector(s);
const KEY='apc_test2_v1';
const LS=(()=>{try{const t='__t';localStorage.setItem(t,'1');localStorage.removeItem(t);return localStorage;}catch(e){const m={};return{getItem:k=>m[k]??null,setItem:(k,v)=>{m[k]=String(v)},removeItem:k=>{delete m[k]}};}})();
let ST0={};try{ST0=JSON.parse(LS.getItem(KEY)||'{}')}catch(e){}
const ST=Object.assign({lessons:{},stats:{},mistakes:[],tests:[]},ST0);
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
function show(tab){document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t.dataset.t===tab));document.querySelectorAll('.pane').forEach(p=>p.hidden=p.id!=='p-'+tab);if(tab==='mistakes')renderMistakes();if(tab==='learn'&&!$('#lessonView').innerHTML)openLesson(LESSONS[0].id);if(tab==='practice'&&!$('#practiceHost').innerHTML)nextPractice();window.scrollTo(0,0);}
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
  if(kind==='mix'||kind==='gen') GENS.filter(g=>tops.includes(g.topic)).forEach(g=>pool.push(()=>({type:'gen',gid:g.id,seed:(Math.random()*1e9)|0}))); 
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

// ---------- Test ----------
let TEST=null,timerId=null;
function buildTest(){const r=Math.random;const gens=shuffle(GENS,r);const items=[];
  const byTopic=t=>gens.filter(g=>g.topic===t);
  // balanced: forces 3, circular 2, drag 1, energy/work/springs 4, potential 1
  const plan=[['forces',3],['circular',2],['drag',1],['energy',2],['work',1],['springs',1],['potential',1]];
  for(const [t,n] of plan) byTopic(t).slice(0,n).forEach(g=>items.push({type:'gen',gid:g.id,seed:(r()*1e9)|0}));
  shuffle(CONCEPTS,r).slice(0,6).forEach(c=>items.push({type:'concept',cid:c.id}));
  shuffle(DERIVS,r).slice(0,2).forEach(d=>items.push({type:'deriv',did:d.id}));
  return shuffle(items,r);}
$('#startTest').onclick=()=>{const mins=+$('#tmins').value||45;TEST={items:buildTest(),i:0,ans:[],end:Date.now()+mins*60000,mins};$('#testSetup').hidden=true;$('#testRun').hidden=false;$('#testResult').hidden=true;
  clearInterval(timerId);timerId=setInterval(()=>{const left=TEST.end-Date.now();if(left<=0){clearInterval(timerId);finishTest(true);return;}const m=Math.floor(left/6e4),s=Math.floor(left%6e4/1000);$('#timer').textContent=`${m}:${String(s).padStart(2,'0')}`;$('#timer').classList.toggle('low',left<5*60000);},500);renderTestQ();};
function renderTestQ(){const it=TEST.items[TEST.i];const host=$('#testQ');$('#tprog').textContent=`Question ${TEST.i+1} of ${TEST.items.length}`;
  let html='',getAns;
  if(it.type==='gen'){const g=GEN_BY[it.gid];const p=g.gen(mkR(it.seed));it._p=p;html=`<div class="meta">${TOPICS[g.topic]}</div><div class="stem">${p.stem}</div>${p.fig?`<div class="figwrap">${p.fig}</div>`:''}<div class="numrow"><input class="num" id="tAns" placeholder="answer${p.final.unit?' in '+p.final.unit:''}"> <span>${p.final.unit}</span></div><div class="note small">Do it on paper first: principle → constraint → derive in symbols → plug in. Use g = 9.8 m/s².</div>`;getAns=()=>$('#tAns').value;}
  else if(it.type==='concept'){const c=CON_BY[it.cid];it._ch=shuffle(c.choices);html=`<div class="meta">${TOPICS[c.topic]} · concept</div><div class="stem">${c.q}</div><div class="choices">${it._ch.map((x,i)=>`<label class="ch mc"><input type="radio" name="tq" value="${i}"> <span>${x.t}</span></label>`).join('')}</div>`;getAns=()=>{const r=document.querySelector('input[name=tq]:checked');return r?+r.value:null;};}
  else {const d=DER_BY[it.did];const last=d.steps[d.steps.length-1];it._ch=shuffle(last.choices);html=`<div class="meta">${TOPICS[d.topic]} · derivation</div><div class="stem">${d.q}</div><div class="sp">Derive it on paper, then pick the final result:</div><div class="choices">${it._ch.map((x,i)=>`<label class="ch mc"><input type="radio" name="tq" value="${i}"> <span>${x.t}</span></label>`).join('')}</div>`;getAns=()=>{const r=document.querySelector('input[name=tq]:checked');return r?+r.value:null;};}
  host.innerHTML=`<div class="card">${html}<div class="lnav"><button class="btn" id="lockIn">Lock in &amp; next →</button><span class="note small">No going back after you lock in (like the real test).</span></div></div>`;math(host);
  if($('#tAns'))$('#tAns').onkeydown=e=>{if(e.key==='Enter')$('#lockIn').click();};
  $('#lockIn').onclick=()=>{const a=getAns();if(a===null||a===''){if(!confirm('Leave this one blank?'))return;}TEST.ans[TEST.i]=a;TEST.i++;if(TEST.i>=TEST.items.length)finishTest(false);else renderTestQ();};}
function finishTest(timeUp){clearInterval(timerId);$('#testRun').hidden=true;const res=$('#testResult');res.hidden=false;let score=0;const rows=[];
  TEST.items.forEach((it,i)=>{const a=TEST.ans[i];let ok=false,body='';
    if(it.type==='gen'){const p=it._p||GEN_BY[it.gid].gen(mkR(it.seed));ok=a!=null&&a!==''&&numOK(a,p.final.ans);body=`<div class="stem">${p.stem}</div>${p.fig?`<div class="figwrap">${p.fig}</div>`:''}<div>Your answer: <b>${a==null||a===''?'(blank)':String(a).replace(/</g,'&lt;')}</b> · Correct: <b>\\(${fmt(p.final.ans)}\\)</b> ${p.final.unit}</div>${p.solution}`;}
    else {const isC=it.type==='concept';const src=isC?CON_BY[it.cid]:DER_BY[it.did];const chs=it._ch;const pick=a==null?null:chs[a];ok=!!(pick&&pick.ok);const right=chs.find(c=>c.ok);
      body=`<div class="stem">${isC?src.q:src.q}</div><div>Your answer: <b>${pick?pick.t:'(blank)'}</b>${pick&&!pick.ok?`<div class="bad small">Why that's wrong: ${pick.why}</div>`:''}</div><div class="good small">Correct: ${right.t}. ${right.why}</div>${isC?'':src.solution}`;}
    if(ok)score++;else addMistake({type:it.type,gid:it.gid,seed:it.seed,cid:it.cid,did:it.did});rec(topicOf(it),ok);
    rows.push(`<details class="card rev ${ok?'okr':'badr'}" ${ok?'':'open'}><summary>${ok?'✓':'✗'} Q${i+1} · ${TOPICS[topicOf(it)]}</summary>${body}</details>`);});
  const pct=Math.round(100*score/TEST.items.length);ST.tests.push({at:Date.now(),score,n:TEST.items.length});save();
  res.innerHTML=`<div class="card"><h2>${timeUp?'Time\'s up! ':''}Score: ${score}/${TEST.items.length} (${pct}%)</h2><p>Every missed question was saved to <b>Mistakes</b>. Wrong answers are opened below with the reason and full work.</p><button class="btn" id="again">Take another test (new numbers)</button> <button class="btn ghost" id="toMist">Go to Mistakes</button></div>${rows.join('')}`;math(res);
  $('#again').onclick=()=>{$('#testSetup').hidden=false;res.hidden=true;};$('#toMist').onclick=()=>show('mistakes');renderProgress();}
$('#quitTest').onclick=()=>{if(confirm('End the test now and grade it?'))finishTest(false);};

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
renderLessonList();$('#cheatHost').innerHTML=CHEAT;math($('#cheatHost'));renderProgress();math($('#p-home'));
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{show(b.dataset.go);if(b.dataset.lesson)openLesson(b.dataset.lesson);if(b.dataset.go==='practice'&&!$('#practiceHost').innerHTML)nextPractice();});
show('home');
