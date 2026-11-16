// ===== Numeric problem generators (endless practice) =====
// Each gen(R) returns {stem, fig, steps:[...], final:{prompt,ans,unit}, solution}
// Steps: {kind:'multi', prompt, options:[{t,ok,why}], after} | {kind:'mc', prompt, choices:[{t,ok,why}], after}
const FORCE_DISTRACT = {
  motion:{t:L`A "force of motion" pushing it along`,ok:false,why:L`Not a real force. Every force needs a source: something touching the object, or gravity. Moving at a speed needs no force. Only changing speed or direction does.`},
  ma:{t:L`An \(ma\) arrow`,ok:false,why:L`\(ma\) is the result of all the forces added up. It never goes on an FBD.`},
  cent:{t:L`A separate "centripetal force" arrow`,ok:false,why:L`"Centripetal" just names the net force pointing to the center. It comes from real forces (tension, gravity, normal, friction). Drawing it as its own arrow double-counts.`},
  par:{t:L`A separate "\(mg\sin\theta\)" force down the ramp`,ok:false,why:L`\(mg\sin\theta\) is just part (a component) of gravity. If you draw gravity AND \(mg\sin\theta\), you counted gravity twice.`},
};
const GENS = [
// ---------------- FORCES ----------------
{id:'F1',topic:'forces',name:'Box pulled by an angled rope (friction)',gen(R){
  let m,F,th,mu,a;
  for(let i=0;i<80;i++){m=R.int(4,12);F=R.int(3,8)*10;th=R.pick([20,25,30,35,40]);mu=R.step(0.15,0.35,0.05);a=(F*C(th)-mu*(m*G-F*S(th)))/m;if(a>0.3&&F*S(th)<m*G)break;}
  const N=m*G-F*S(th);
  return {
  stem:L`A \(${m}\text{ kg}\) box is pulled to the right across a rough floor by a rope with tension \(T=${F}\text{ N}\) at \(${th}^\circ\) above horizontal. \(\mu_k=${mu}\). Find the box's acceleration.`,
  fig:sceneFloorPull(th),
  steps:[
   {kind:'multi',prompt:'Step 1 (draw the FBD): Which forces act ON the box?',options:[
     {t:L`Gravity \(mg\), down`,ok:true,why:'Earth pulls on everything that has mass.'},
     {t:L`Normal force \(N\) from the floor, up`,ok:true,why:'The floor touches the box and pushes perpendicular to the surface.'},
     {t:L`Tension \(T\), along the rope (${th}° up from horizontal)`,ok:true,why:'The rope touches the box and pulls along the rope.'},
     {t:L`Kinetic friction \(f_k\), to the left`,ok:true,why:'The floor is rough and the box slides, so kinetic friction points opposite the motion.'},
     FORCE_DISTRACT.motion, FORCE_DISTRACT.ma,
     {t:'Static friction',ok:false,why:'The box is sliding, so this is kinetic friction, not static.'}],
    after:fbdSVG([{deg:270,len:75,label:'mg',color:COL.g},{deg:90,len:55,label:'N',color:COL.N},{deg:th,len:80,label:'T',color:COL.T},{deg:180,len:45,label:'fk',color:COL.f}])},
   {kind:'mc',prompt:L`Step 2: The box doesn't move up or down, so \(\Sigma F_y=0\). What is \(N\)?`,choices:[
     {t:L`\(N = mg - T\sin\theta\)`,ok:true,why:L`Up forces = down forces: \(N + T\sin\theta = mg\). The rope lifts a little, so the floor pushes less.`},
     {t:L`\(N = mg\)`,ok:false,why:L`Only true if nothing else pushes up or down. Here the rope pulls partly UP (\(T\sin\theta\)), so the floor doesn't have to push as hard.`},
     {t:L`\(N = mg + T\sin\theta\)`,ok:false,why:L`That's for a push angled DOWN into the floor. This rope pulls up, so it takes load off the floor.`},
     {t:L`\(N = mg\cos\theta\)`,ok:false,why:L`\(mg\cos\theta\) is for a block ON an incline. The floor here is flat. The angle belongs to the rope, not the floor.`}]},
   {kind:'mc',prompt:L`Step 3: Write \(\Sigma F_x = ma\) (right = +).`,choices:[
     {t:L`\(T\cos\theta - \mu_k(mg - T\sin\theta) = ma\)`,ok:true,why:L`The forward part of the rope is \(T\cos\theta\). Friction is \(\mu_k N\), backward, using the \(N\) from Step 2.`},
     {t:L`\(T - \mu_k mg = ma\)`,ok:false,why:L`Two mistakes: only \(T\cos\theta\) points forward, and \(N\) isn't \(mg\) here.`},
     {t:L`\(T\cos\theta + \mu_k(mg - T\sin\theta) = ma\)`,ok:false,why:'Friction points backward (against the motion), so it gets a minus sign.'},
     {t:L`\(T\sin\theta - \mu_k N = ma\)`,ok:false,why:L`\(T\sin\theta\) is the VERTICAL part of the rope. For horizontal use \(\cos\) because the angle is measured from horizontal.`}]}],
  final:{prompt:L`Step 4: Solve for \(a\) and plug in (m/s²).`,ans:a,unit:'m/s²'},
  solution:sol({principle:L`Newton's 2nd law on each axis: \(\Sigma F_y = 0,\ \Sigma F_x = ma\)`,constraint:L`Box stays on the floor (\(N\gt 0\)) and slides, so \(f_k=\mu_k N\)`,assume:'Rope is massless. Friction is constant.',
    lines:[L`y:\ N + T\sin\theta - mg = 0 \Rightarrow N = mg - T\sin\theta`,L`x:\ T\cos\theta - \mu_k N = ma`,L`a = \dfrac{T\cos\theta - \mu_k\,(mg - T\sin\theta)}{m}`],
    plug:L`a=\dfrac{(${F})\cos ${th}^\circ - ${mu}\,[(${m})(9.8)-(${F})\sin ${th}^\circ]}{${m}} = ${fmt(a)}\ \text{m/s}^2`,ans:L`${fmt(a)}\ \text{m/s}^2`,
    note:L`(For reference: \(N = ${fmt(N)}\) N, which is not \(mg = ${fmt(m*G)}\) N.)`})};
}},
{id:'F2',topic:'forces',name:'Block sliding down a rough incline',gen(R){
  let th,mu;for(let i=0;i<50;i++){th=R.pick([25,30,35,40,45]);mu=R.step(0.1,0.4,0.05);if(Tn(th)>mu+0.12)break;}
  const m=R.int(2,9);const a=G*(S(th)-mu*C(th));
  return {stem:L`A \(${m}\text{ kg}\) block slides DOWN a \(${th}^\circ\) incline. \(\mu_k = ${mu}\). Find the magnitude of its acceleration.`,
  fig:sceneIncline(th,{arrowDir:'down'}),
  steps:[
   {kind:'multi',prompt:'Step 1 (FBD): Which forces act on the block?',options:[
     {t:L`Gravity \(mg\), straight down`,ok:true,why:'Gravity always points straight down, even on a ramp.'},
     {t:'Normal force, perpendicular to the ramp surface',ok:true,why:'Normal force is always perpendicular to the surface it comes from.'},
     {t:'Kinetic friction, UP the ramp',ok:true,why:'The block slides down, so friction points up the slope.'},
     {t:'Normal force, straight up',ok:false,why:'Normal force is perpendicular to the SURFACE. On a tilted ramp it tilts too.'},
     FORCE_DISTRACT.par, FORCE_DISTRACT.ma],
    after:fbdSVG([{deg:270,len:75,label:'mg',color:COL.g},{deg:90+th,len:60,label:'N',color:COL.N},{deg:th,len:45,label:'fk',color:COL.f}],{tilt:th})},
   {kind:'mc',prompt:L`Step 2: Tilt your axes along the ramp. What is the component of gravity pointing DOWN the slope?`,choices:[
     {t:L`\(mg\sin\theta\)`,ok:true,why:L`Check the extremes: at \(\theta = 0\) (flat) gravity doesn't pull you along, and \(\sin 0 = 0\). So it's sin.`},
     {t:L`\(mg\cos\theta\)`,ok:false,why:L`That's the part INTO the ramp. Check: at \(\theta=0\), \(\cos 0 = 1\) would mean full gravity pulls you sideways on flat ground. Not true.`},
     {t:L`\(mg\)`,ok:false,why:'Only part of gravity points along the slope. The rest presses into the ramp.'},
     {t:L`\(mg\tan\theta\)`,ok:false,why:'Components of a vector use sin and cos, not tan.'}]},
   {kind:'mc',prompt:L`Step 3: \(\Sigma F_\perp = 0\) gives \(N\). Then write \(\Sigma F_\parallel = ma\) (down slope = +).`,choices:[
     {t:L`\(mg\sin\theta - \mu_k mg\cos\theta = ma\)`,ok:true,why:L`\(N = mg\cos\theta\), so friction \(= \mu_k mg\cos\theta\), and it points up the slope (minus).`},
     {t:L`\(mg\sin\theta - \mu_k mg = ma\)`,ok:false,why:L`On a ramp \(N = mg\cos\theta\), not \(mg\). Friction uses \(N\).`},
     {t:L`\(mg\cos\theta - \mu_k mg\sin\theta = ma\)`,ok:false,why:'sin and cos are swapped. Down the slope is sin and into the ramp is cos.'},
     {t:L`\(mg\sin\theta + \mu_k mg\cos\theta = ma\)`,ok:false,why:'Friction fights the sliding. Sliding is down the slope, so friction points up (minus sign).'}]}],
  final:{prompt:'Step 4: Solve and plug in. Mass cancels! (m/s²)',ans:a,unit:'m/s²'},
  solution:sol({principle:L`Newton's 2nd law with tilted axes`,constraint:L`Block is sliding, so \(f_k = \mu_k N\). It slides only if \(\tan\theta \gt \mu_k\)`,assume:'Friction constant, no air resistance',
    lines:[L`\perp:\ N - mg\cos\theta = 0 \Rightarrow N = mg\cos\theta`,L`\parallel:\ mg\sin\theta - \mu_k mg\cos\theta = ma`,L`a = g(\sin\theta - \mu_k\cos\theta)`],
    plug:L`a = 9.8(\sin ${th}^\circ - ${mu}\cos ${th}^\circ) = ${fmt(a)}\ \text{m/s}^2`,ans:L`${fmt(a)}\ \text{m/s}^2`,note:L`The ${m} kg mass was a distractor. It cancels.`})};
}},
{id:'F3',topic:'forces',name:'Minimum μs to stay at rest on an incline',gen(R){
  const th=R.pick([12,15,18,20,22,25,28,32,35]);const mu=Tn(th);
  return {stem:L`A box sits at rest on a ramp tilted at \(${th}^\circ\). What is the MINIMUM coefficient of static friction that keeps it from sliding?`,
  fig:sceneIncline(th),
  steps:[
   {kind:'mc',prompt:'Step 1: Which way does static friction point?',choices:[
     {t:'Up the ramp',ok:true,why:'Without friction the box would slide down, so friction points up the ramp to stop it.'},
     {t:'Down the ramp',ok:false,why:'Friction opposes the way the box WOULD slide, which is down. So friction points up.'},
     {t:'Perpendicular to the ramp',ok:false,why:'That direction is the normal force. Friction is always parallel to the surface.'}]},
   {kind:'mc',prompt:L`Step 2: "Minimum \(\mu_s\)" means the box is JUST about to slip. What does that let you write?`,choices:[
     {t:L`\(f_s = \mu_s N\) (static friction at its max)`,ok:true,why:L`\(f_s \le \mu_s N\) in general. At the edge of slipping it equals the max.`},
     {t:L`\(f_s = 0\)`,ok:false,why:'If friction were zero the box would slide.'},
     {t:L`\(f_s = mg\)`,ok:false,why:'Friction only has to balance the down-slope part of gravity.'}]},
   {kind:'mc',prompt:'Step 3: Balance along the ramp:',choices:[
     {t:L`\(\mu_s mg\cos\theta = mg\sin\theta\)`,ok:true,why:L`Max friction \(\mu_s N = \mu_s mg\cos\theta\) balances the pull \(mg\sin\theta\).`},
     {t:L`\(\mu_s mg = mg\sin\theta\)`,ok:false,why:L`\(N = mg\cos\theta\) on a ramp, not \(mg\).`},
     {t:L`\(\mu_s mg\sin\theta = mg\cos\theta\)`,ok:false,why:'sin and cos are swapped.'}]}],
  final:{prompt:L`Step 4: \(\mu_{s,min} = \tan\theta\). Plug in (no units).`,ans:mu,unit:''},
  solution:sol({principle:L`Newton's 1st law (equilibrium): \(\Sigma F = 0\)`,constraint:L`On the verge of slipping: \(f_s = \mu_s N\)`,assume:'Box treated as a point',
    lines:[L`\perp:\ N = mg\cos\theta`,L`\parallel:\ f_s = mg\sin\theta`,L`\mu_s mg\cos\theta = mg\sin\theta \Rightarrow \mu_s = \tan\theta`],plug:L`\mu_s=\tan ${th}^\circ = ${fmt(mu)}`,ans:fmt(mu)})};
}},
{id:'F4',topic:'forces',name:'Cart shoved up a frictionless incline: time to return',gen(R){
  const v=R.pick([4,5,6,7,8,9,10]),th=R.pick([20,25,30,35,40]);const m=R.pick([1.5,2,3,4]);const t=2*v/(G*S(th));
  return {stem:L`A \(${m}\text{ kg}\) cart is shoved up a long, smooth (frictionless) \(${th}^\circ\) incline. Right after the shove it moves at \(${v}\text{ m/s}\) up the slope. How long until it comes back to where it started?`,
  fig:sceneIncline(th,{arrowDir:'up'}),
  steps:[
   {kind:'mc',prompt:'Step 1: What is the acceleration while it goes UP, and while it comes DOWN?',choices:[
     {t:L`Both are \(g\sin\theta\) pointing down the slope`,ok:true,why:L`The only force along the slope is \(mg\sin\theta\), always down-slope, whichever way the cart is moving. So the acceleration is constant and the kinematics equations work.`},
     {t:'Zero at the top, then it starts accelerating',ok:false,why:'At the top the velocity is zero, but gravity is still pulling. Zero velocity does not mean zero acceleration.'},
     {t:'Up-slope while going up, down-slope while coming down',ok:false,why:'Acceleration comes from force, and the force (gravity component) always points down-slope.'}]},
   {kind:'mc',prompt:L`Step 2: Up-slope = +. Returning to the start means \(\Delta x = 0\). Which equation?`,choices:[
     {t:L`\(0 = v_0 t - \tfrac{1}{2}g\sin\theta\, t^2\)`,ok:true,why:L`\(\Delta x = v_0t + \tfrac12 at^2\) with \(a = -g\sin\theta\).`},
     {t:L`\(0 = v_0 - g\sin\theta\, t\)`,ok:false,why:'This gives the time to reach the TOP (where v = 0). The full trip takes twice as long.'},
     {t:L`\(0 = v_0 t - \tfrac12 g t^2\)`,ok:false,why:L`Along a ramp the acceleration is \(g\sin\theta\), not \(g\).`}]}],
  final:{prompt:L`Step 3: \(t = \dfrac{2v_0}{g\sin\theta}\). Plug in (s).`,ans:t,unit:'s'},
  solution:sol({principle:'Newton\'s 2nd law, then constant-acceleration kinematics',constraint:'Constant acceleration (needed for kinematics). True since the only force along the slope is constant.',assume:'Frictionless, no air resistance',
    lines:[L`\Sigma F_\parallel = -mg\sin\theta = ma \Rightarrow a = -g\sin\theta`,L`\Delta x = v_0t + \tfrac12 a t^2 = 0`,L`t\,(v_0 - \tfrac12 g\sin\theta\,t)=0 \Rightarrow t = \dfrac{2v_0}{g\sin\theta}`],
    plug:L`t=\dfrac{2(${v})}{9.8\sin ${th}^\circ}=${fmt(t)}\text{ s}`,ans:L`${fmt(t)}\text{ s}`,note:'The mass cancels and does not matter.'})};
}},
{id:'F5',topic:'forces',name:'Modified Atwood: block on table + hanging block',gen(R){
  let m1,m2,mu;for(let i=0;i<50;i++){m1=R.int(1,6);m2=R.int(2,9);mu=R.step(0.1,0.4,0.05);if(m1>mu*m2+0.5)break;}
  const a=(m1-mu*m2)*G/(m1+m2), T=m1*(G-a);const askT=R.f()<0.5;
  return {stem:L`A \(${m2}\text{ kg}\) block on a table is tied by a string over a light pulley to a hanging \(${m1}\text{ kg}\) block. \(\mu_k = ${mu}\) between the table and block. Find ${askT?'the tension in the string':'the acceleration of the blocks'}.`,
  fig:sceneTablePulley(m2+' kg',m1+' kg'),
  steps:[
   {kind:'mc',prompt:L`Step 1: Treat both blocks as ONE system pulled along the string. What is the net force on the system?`,choices:[
     {t:L`\(m_1g - \mu_k m_2 g\)`,ok:true,why:'Weight of the hanging block pulls forward, and friction on the table block pulls back. Tension is internal, so it cancels.'},
     {t:L`\(m_1 g - T\)`,ok:false,why:'That is the net force on the hanging block alone. For the whole system, tension is internal and cancels.'},
     {t:L`\((m_1+m_2)g\)`,ok:false,why:L`The table block's weight is cancelled by the table's normal force, so it doesn't drive the motion.`},
     {t:L`\(m_1 g\)`,ok:false,why:'You forgot friction on the table block.'}]},
   {kind:'mc',prompt:'Step 2: What mass does that net force accelerate?',choices:[
     {t:L`\(m_1 + m_2\)`,ok:true,why:'Both blocks are tied together and speed up together.'},
     {t:L`\(m_1\)`,ok:false,why:'The table block also has to be accelerated.'},
     {t:L`\(m_2\)`,ok:false,why:'The hanging block also has to be accelerated.'}]},
   ...(askT?[{kind:'mc',prompt:L`Step 3: To get \(T\), use the HANGING block alone (down = +):`,choices:[
     {t:L`\(m_1 g - T = m_1 a\)`,ok:true,why:'Gravity down, tension up, and it accelerates down.'},
     {t:L`\(T = m_1 g\)`,ok:false,why:L`Only true if the block is NOT accelerating. Since it speeds up downward, \(T \lt m_1 g\).`},
     {t:L`\(T - m_1 g = m_1 a\)`,ok:false,why:'Signs flipped. The block accelerates DOWN, so the down force (gravity) must be bigger.'}]}]:[])],
  final:{prompt:askT?L`Solve for \(T\) (N).`:L`Solve for \(a\) (m/s²).`,ans:askT?T:a,unit:askT?'N':'m/s²'},
  solution:sol({principle:L`Newton's 2nd law on the system (and on one block for \(T\))`,constraint:'String doesn\'t stretch, so both blocks have the same |a|',assume:'Massless string and pulley, frictionless pulley',
    lines:[L`\text{System: } m_1 g - \mu_k m_2 g = (m_1+m_2)a`,L`a = \dfrac{(m_1 - \mu_k m_2)g}{m_1+m_2}`,...(askT?[L`\text{Hanging block: } m_1 g - T = m_1 a \Rightarrow T = m_1(g - a)`]:[])],
    plug:askT?L`a=\dfrac{(${m1}-${mu}\cdot ${m2})(9.8)}{${m1+m2}}=${fmt(a)},\quad T=${m1}(9.8-${fmt(a)})=${fmt(T)}\text{ N}`:L`a=\dfrac{(${m1}-${mu}\cdot${m2})(9.8)}{${m1}+${m2}}=${fmt(a)}\ \text{m/s}^2`,
    ans:askT?L`T=${fmt(T)}\text{ N}`:L`a=${fmt(a)}\ \text{m/s}^2`})};
}},
{id:'F6',topic:'forces',name:'Atwood machine (two hanging masses)',gen(R){
  let m1,m2;do{m1=R.int(2,9);m2=R.int(1,8);}while(m1<=m2);
  const a=(m1-m2)*G/(m1+m2),T=2*m1*m2*G/(m1+m2);const askT=R.f()<0.5;
  return {stem:L`Masses \(${m1}\text{ kg}\) and \(${m2}\text{ kg}\) hang on either side of a light, frictionless pulley. Find ${askT?'the string tension':'the acceleration'}.`,
  fig:sceneAtwood(m1+' kg',m2+' kg'),
  steps:[
   {kind:'mc',prompt:'Step 1: System approach (direction the heavy side falls = +). What is the net force?',choices:[
     {t:L`\(m_1 g - m_2 g\)`,ok:true,why:'The heavy side\'s weight pulls one way and the light side\'s weight the other. Tension is internal.'},
     {t:L`\(m_1 g + m_2 g\)`,ok:false,why:'The two weights fight each other around the pulley, so subtract.'},
     {t:L`\(m_1 g - T\)`,ok:false,why:'That\'s just one block.'}]},
   {kind:'mc',prompt:L`Step 2: Then \(a = \dfrac{\text{net force}}{\text{total mass}}\). For tension, use one block. For the heavy block:`,choices:[
     {t:L`\(m_1 g - T = m_1 a\)`,ok:true,why:'It accelerates down, so gravity minus tension = ma.'},
     {t:L`\(T = m_1 g\)`,ok:false,why:'Only if it were not accelerating.'},
     {t:L`\(T - m_1 g = m_1 a\)`,ok:false,why:'The heavy block accelerates DOWN, so this sign is backwards.'}]}],
  final:{prompt:askT?'Tension (N):':'Acceleration (m/s²):',ans:askT?T:a,unit:askT?'N':'m/s²'},
  solution:sol({principle:'Newton\'s 2nd law (system, then one block)',constraint:'Same |a| for both (inextensible string)',assume:'Massless string, massless frictionless pulley',
    lines:[L`(m_1 - m_2)g = (m_1+m_2)a \Rightarrow a=\dfrac{(m_1-m_2)g}{m_1+m_2}`,L`T = m_1(g-a) = \dfrac{2m_1m_2 g}{m_1+m_2}`],
    plug:askT?L`T=\dfrac{2(${m1})(${m2})(9.8)}{${m1+m2}}=${fmt(T)}\text{ N}`:L`a=\dfrac{(${m1}-${m2})(9.8)}{${m1+m2}}=${fmt(a)}\ \text{m/s}^2`,ans:askT?L`${fmt(T)}\text{ N}`:L`${fmt(a)}\ \text{m/s}^2`})};
}},
{id:'F7',topic:'forces',name:'Person on a scale in an elevator',gen(R){
  const m=R.int(50,90);let Sread;do{Sread=Math.round(m*G+R.int(-150,150));}while(Math.abs(Sread-m*G)<20);
  const a=Sread/m-G;
  return {stem:L`A \(${m}\text{ kg}\) person stands on a scale in an elevator. The scale reads \(${Sread}\text{ N}\). Find the elevator's acceleration (use + for UP, − for DOWN).`,
  fig:sceneElevator(),
  steps:[
   {kind:'mc',prompt:'Step 1: What does a scale actually measure?',choices:[
     {t:L`The normal force \(N\) it pushes up with`,ok:true,why:'A scale reads how hard it pushes on you, which is the normal force.'},
     {t:L`Your weight \(mg\), always`,ok:false,why:L`It only reads \(mg\) when \(a = 0\). If you accelerate, \(N \ne mg\).`},
     {t:'Your mass',ok:false,why:'Scales measure force (N). They are only labeled in kg assuming a = 0 on Earth.'}]},
   {kind:'mc',prompt:'Step 2: Newton\'s 2nd law (up = +):',choices:[
     {t:L`\(N - mg = ma\)`,ok:true,why:'Normal up minus weight down = ma.'},
     {t:L`\(mg - N = ma\)`,ok:false,why:'That uses down = +. It works too, but then the sign of your answer flips. We said up = +.'},
     {t:L`\(N = mg\)`,ok:false,why:'Only when not accelerating.'}]}],
  final:{prompt:L`Step 3: \(a = \dfrac{N}{m} - g\). Plug in (m/s², with sign).`,ans:a,unit:'m/s²'},
  solution:sol({principle:'Newton\'s 2nd law, vertical',assume:'Person moves with the elevator',
    lines:[L`N - mg = ma \Rightarrow a = \dfrac{N}{m} - g`],plug:L`a=\dfrac{${Sread}}{${m}}-9.8=${fmt(a)}\ \text{m/s}^2`,ans:L`${fmt(a)}\ \text{m/s}^2`,
    note:`${a<0?'Negative means the acceleration is DOWN':'Positive means the acceleration is UP'}. You can NOT tell which way the elevator is moving: ${a<0?'moving down and speeding up, OR moving up and slowing down':'moving up and speeding up, OR moving down and slowing down'}. (Daily Quiz 15 #26 tested this.)`})};
}},
{id:'F8',topic:'forces',name:'Minimum μs so connected blocks stay at rest',gen(R){
  let mh,mt;do{mh=R.pick([0.5,1,1.5,2,2.5,3]);mt=R.pick([2,3,4,5,6,8]);}while(mh>=mt);
  const mu=mh/mt;
  return {stem:L`A hanging block of mass \(${mh}\text{ kg}\) is tied over a frictionless pulley to a \(${mt}\text{ kg}\) block on a rough horizontal table. What is the MINIMUM \(\mu_s\) that lets both blocks stay at rest when released? (Like Problem Set 16 #3)`,
  fig:sceneTablePulley(mt+' kg',mh+' kg'),
  steps:[
   {kind:'mc',prompt:'Step 1: Hanging block at rest. What is T?',choices:[
     {t:L`\(T = m_h g\)`,ok:true,why:'At rest, a = 0, so tension exactly balances the weight.'},
     {t:L`\(T = m_t g\)`,ok:false,why:'Tension holds up the HANGING block, so it matches the hanging weight.'},
     {t:L`\(T = 0\)`,ok:false,why:'The string is holding the block up, so it has tension.'}]},
   {kind:'mc',prompt:'Step 2: Table block at rest, just about to slip:',choices:[
     {t:L`\(T = \mu_s m_t g\)`,ok:true,why:L`Max static friction \(\mu_s N = \mu_s m_t g\) balances the tension.`},
     {t:L`\(T = \mu_s m_h g\)`,ok:false,why:'Friction depends on the normal force on the TABLE block.'},
     {t:L`\(T = \mu_s (m_t+m_h) g\)`,ok:false,why:'The hanging block isn\'t pressing on the table.'}]}],
  final:{prompt:L`\(\mu_s = m_h/m_t\). Plug in:`,ans:mu,unit:''},
  solution:sol({principle:'Newton\'s 1st law (equilibrium) on each block',constraint:L`Verge of slipping: \(f_s = \mu_s N\)`,assume:'Massless string, frictionless pulley',
    lines:[L`\text{hanging: } T = m_h g`,L`\text{table: } f_s = T,\ N = m_t g`,L`\mu_s m_t g = m_h g \Rightarrow \mu_s = \dfrac{m_h}{m_t}`],plug:L`\mu_s=\dfrac{${mh}}{${mt}}=${fmt(mu)}`,ans:fmt(mu)})};
}},
{id:'F9',topic:'drag',name:'Coasting with drag R = −bv (calculus)',gen(R){
  const m=R.pick([800,1000,1200,1500,1800]),b=R.pick([10,15,20,25,30,40]),v0=R.pick([15,20,25,30]),t=R.pick([5,10,15,20,30]);
  const v=v0*Math.exp(-b*t/m);
  return {stem:L`A \(${m}\text{ kg}\) car's engine dies while moving at \(v_0=${v0}\text{ m/s}\). The only horizontal force is drag \(R=-bv\) with \(b=${b}\text{ kg/s}\). Find its speed at \(t=${t}\text{ s}\). (Like Problem Set 14 #1)`,
  steps:[
   {kind:'mc',prompt:'Step 1: Can you use v = v₀ + at?',choices:[
     {t:'No. The force depends on v, so a is NOT constant',ok:true,why:'Kinematics equations need constant acceleration. Here the car slows down less and less as v drops.'},
     {t:'Yes, if you use the average acceleration',ok:false,why:'That only works for constant acceleration. Here a changes every instant.'},
     {t:'Yes, kinematics always works',ok:false,why:'Daily Quiz 15 #28: kinematics only works when acceleration is constant.'}]},
   {kind:'mc',prompt:L`Step 2: Newton's 2nd law with \(a = \dfrac{dv}{dt}\):`,choices:[
     {t:L`\(-bv = m\dfrac{dv}{dt}\)`,ok:true,why:'Drag is the only horizontal force, so it equals m times dv/dt.'},
     {t:L`\(-bv = mv\)`,ok:false,why:'The right side has to be m·a, and a = dv/dt, not v.'},
     {t:L`\(mg - bv = m\dfrac{dv}{dt}\)`,ok:false,why:'That one is for FALLING with drag. Here the motion is horizontal, so gravity is balanced by the normal force.'}]},
   {kind:'mc',prompt:'Step 3: Separate variables (all v on one side, all t on the other) and integrate:',choices:[
     {t:L`\(\displaystyle\int_{v_0}^{v}\frac{dv}{v} = -\frac{b}{m}\int_0^t dt \Rightarrow \ln\frac{v}{v_0} = -\frac{b}{m}t\)`,ok:true,why:L`Divide by \(mv\) and multiply by \(dt\). Then \(\int dv/v = \ln v\).`},
     {t:L`\(\displaystyle\int v\,dv = -\frac{b}{m}\int dt\)`,ok:false,why:'You need dv/v, from dividing both sides by v.'},
     {t:L`\(v = v_0 - \dfrac{b}{m}t\)`,ok:false,why:'That treats the acceleration as constant. The integral gives a log, which becomes an exponential.'}]}],
  final:{prompt:L`Step 4: \(v = v_0 e^{-bt/m}\). Plug in (m/s).`,ans:v,unit:'m/s'},
  solution:sol({principle:L`Newton's 2nd law as a differential equation: \(\Sigma F = m\,\dfrac{dv}{dt}\)`,constraint:'Only drag acts horizontally',assume:'b constant, road flat',
    lines:[L`-bv = m\dfrac{dv}{dt}`,L`\dfrac{dv}{v} = -\dfrac{b}{m}dt`,L`\int_{v_0}^{v}\dfrac{dv}{v}=-\dfrac{b}{m}\int_0^t dt \Rightarrow \ln\dfrac{v}{v_0} = -\dfrac{b t}{m}`,L`v(t) = v_0 e^{-bt/m}`],
    plug:L`v=${v0}\,e^{-(${b})(${t})/${m}}=${fmt(v)}\text{ m/s}`,ans:L`${fmt(v)}\text{ m/s}`})};
}},
{id:'F10',topic:'drag',name:'Falling with drag −bv: terminal velocity / v(t)',gen(R){
  const m=R.pick([0.002,0.005,0.01,0.05,0.1]);const b=R.pick([0.002,0.004,0.005,0.01,0.02]);const vt=m*G/b;const tau=m/b;const t=+(tau*R.pick([0.5,1,1.5,2])).toPrecision(2);const v=vt*(1-Math.exp(-t/tau));
  const askT=R.f()<0.5;
  return {stem:L`An object of mass \(${m}\text{ kg}\) is dropped from rest. Air drag is \(F=-bv\) with \(b=${b}\text{ kg/s}\). Find ${askT?'its terminal speed':L`its speed at \(t=${t}\text{ s}\)`}. (Think Pivot: Falling Coffee Filters.)`,
  steps:[
   {kind:'mc',prompt:'Step 1: Newton\'s 2nd law (down = +):',choices:[
     {t:L`\(mg - bv = m\dfrac{dv}{dt}\)`,ok:true,why:'Gravity down, drag up (opposes motion).'},
     {t:L`\(mg + bv = m\dfrac{dv}{dt}\)`,ok:false,why:'Drag opposes motion. The object falls down, so drag points up.'},
     {t:L`\(-bv = m\dfrac{dv}{dt}\)`,ok:false,why:'You forgot gravity.'}]},
   {kind:'mc',prompt:'Step 2: Terminal velocity happens when…',choices:[
     {t:L`\(\dfrac{dv}{dt}=0\), so \(mg = bv_T\)`,ok:true,why:L`The speed stops changing when the forces balance, giving \(v_T = mg/b\).`},
     {t:L`\(v = 0\)`,ok:false,why:'That\'s the start, not the end.'},
     {t:'Gravity turns off',ok:false,why:'Gravity never turns off. Drag grows until it matches gravity.'}]}],
  final:{prompt:askT?L`\(v_T = mg/b\) (m/s):`:L`\(v(t)=\dfrac{mg}{b}\left(1-e^{-bt/m}\right)\) (m/s):`,ans:askT?vt:v,unit:'m/s'},
  solution:sol({principle:L`Newton's 2nd law: \(\Sigma F = m\,dv/dt\)`,constraint:L`Terminal: \(dv/dt = 0\)`,assume:'Drag linear in v, b constant',
    lines:[L`mg - bv = m\dfrac{dv}{dt}`,L`v_T:\ 0 = mg - bv_T \Rightarrow v_T=\dfrac{mg}{b}`,L`\int_0^v\dfrac{dv}{g-\frac{b}{m}v}=\int_0^t dt\ \Rightarrow\ v(t)=\dfrac{mg}{b}\left(1-e^{-bt/m}\right)`],
    plug:askT?L`v_T=\dfrac{(${m})(9.8)}{${b}}=${fmt(vt)}\text{ m/s}`:L`v=\dfrac{(${m})(9.8)}{${b}}\left(1-e^{-(${b})(${t})/${m}}\right)=${fmt(v)}\text{ m/s}`,ans:L`${fmt(askT?vt:v)}\text{ m/s}`})};
}},
// ---------------- CIRCULAR ----------------
{id:'C1',topic:'circular',name:'Vertical circle: tension at the BOTTOM',gen(R){
  const m=R.pick([0.5,1,2,500,1200,2100]),r=R.pick([0.8,1,1.5,5,10,15]),v=R.pick([3,4,5,6,7.6,8]);const T=m*G+m*v*v/r;
  return {stem:L`A \(${m}\text{ kg}\) ball on a \(${r}\text{ m}\) cable swings through the LOWEST point of a vertical circle at \(${v}\text{ m/s}\). Find the tension. (Like Problem Set 13 #4)`,
  fig:sceneVertCircle('bottom'),
  steps:[
   {kind:'multi',prompt:'Step 1 (FBD at the bottom): forces on the ball?',options:[
     {t:'Tension, UP toward the center',ok:true,why:'The cable pulls toward the pivot, which is up from the bottom.'},
     {t:L`Gravity \(mg\), down`,ok:true,why:'Always.'},FORCE_DISTRACT.cent,FORCE_DISTRACT.motion],
    after:fbdSVG([{deg:90,len:85,label:'T',color:COL.T},{deg:270,len:55,label:'mg',color:COL.g}],{accel:90})},
   {kind:'mc',prompt:'Step 2: Which way is the net force (and acceleration) at the bottom?',choices:[
     {t:'Up, toward the center',ok:true,why:'In circular motion the net force points to the center.'},
     {t:'Zero, because it is the lowest point',ok:false,why:'It is moving in a circle, so it accelerates toward the center.'},
     {t:'Down',ok:false,why:'The center is above the ball.'}]},
   {kind:'mc',prompt:L`Step 3: \(\Sigma F_{\text{toward center}} = \dfrac{mv^2}{r}\):`,choices:[
     {t:L`\(T - mg = \dfrac{mv^2}{r}\)`,ok:true,why:'Toward center (up) = +: T is +, gravity is −.'},
     {t:L`\(mg - T = \dfrac{mv^2}{r}\)`,ok:false,why:'That\'s the TOP of a hill. At the bottom of a swing the center is UP, so T is positive.'},
     {t:L`\(T = \dfrac{mv^2}{r}\)`,ok:false,why:'You forgot gravity.'}]}],
  final:{prompt:L`\(T = mg + \dfrac{mv^2}{r}\) (N):`,ans:T,unit:'N'},
  solution:sol({principle:L`Newton's 2nd law, radial: \(\Sigma F_{c} = \dfrac{mv^2}{r}\)`,constraint:'Moving in a circle of radius r',assume:'Massless cable, ball treated as a point',
    lines:[L`T - mg = \dfrac{mv^2}{r}`,L`T = mg + \dfrac{mv^2}{r}`],plug:L`T=(${m})(9.8)+\dfrac{(${m})(${v})^2}{${r}}=${fmt(T)}\text{ N}`,ans:L`${fmt(T)}\text{ N}`,note:L`T is BIGGER than mg at the bottom. That's why ropes snap at the bottom of a swing.`})};
}},
{id:'C2',topic:'circular',name:'Vertical circle: tension at the TOP',gen(R){
  const m=R.pick([0.2,0.5,1,1.5]),r=R.pick([0.5,0.8,1,1.2]);const vmin=Math.sqrt(G*r);const v=+(vmin*R.pick([1.3,1.5,1.8,2,2.5])).toFixed(1);const T=m*v*v/r-m*G;
  return {stem:L`A \(${m}\text{ kg}\) ball on a \(${r}\text{ m}\) string is whirled in a vertical circle. At the TOP it moves at \(${v}\text{ m/s}\). Find the tension at the top.`,
  fig:sceneVertCircle('top'),
  steps:[
   {kind:'multi',prompt:'Step 1 (FBD at the top): forces on the ball?',options:[
     {t:'Tension, DOWN toward the center',ok:true,why:'At the top, the string pulls down toward the pivot.'},
     {t:L`Gravity \(mg\), down`,ok:true,why:'Always down.'},
     {t:'Tension, up',ok:false,why:'A string can only pull toward the pivot, and at the top the pivot is below the ball.'},FORCE_DISTRACT.cent],
    after:fbdSVG([{deg:270,len:70,label:'T',color:COL.T,from:16,dx:-9,lx:-10},{deg:270,len:80,label:'mg',color:COL.g,from:16,dx:9,lx:12}],{accel:270,h:240})},
   {kind:'mc',prompt:L`Step 2: Toward center (down) = +:`,choices:[
     {t:L`\(T + mg = \dfrac{mv^2}{r}\)`,ok:true,why:'Both forces point toward the center at the top.'},
     {t:L`\(T - mg = \dfrac{mv^2}{r}\)`,ok:false,why:'That\'s the bottom. At the top, gravity also points to the center.'},
     {t:L`\(mg - T = \dfrac{mv^2}{r}\)`,ok:false,why:'Tension points toward the center (down), so it\'s + too.'}]}],
  final:{prompt:L`\(T = \dfrac{mv^2}{r} - mg\) (N):`,ans:T,unit:'N'},
  solution:sol({principle:L`Newton's 2nd law, radial`,constraint:L`String must stay taut: \(T\ge 0 \Rightarrow v \ge \sqrt{gr}\)`,assume:'Point mass, massless string',
    lines:[L`T + mg = \dfrac{mv^2}{r} \Rightarrow T = \dfrac{mv^2}{r} - mg`],plug:L`T=\dfrac{(${m})(${v})^2}{${r}}-(${m})(9.8)=${fmt(T)}\text{ N}`,ans:L`${fmt(T)}\text{ N}`,note:L`Minimum speed at the top (T = 0): \(v=\sqrt{gr}=${fmt(vmin)}\) m/s.`})};
}},
{id:'C3',topic:'circular',name:'Car over the crest of a hill',gen(R){
  const m=R.pick([900,1000,1200,1500,1800]),Rr=R.pick([20,30,40,50,60,80]);const vmax=Math.sqrt(G*Rr);const askMax=R.f()<0.4;const v=+(vmax*R.pick([0.4,0.5,0.6,0.7,0.8])).toFixed(1);const N=m*(G-v*v/Rr);
  return {stem:askMax?L`A car drives over the crest of a circular hill of radius \(${Rr}\text{ m}\). What is the MAXIMUM speed it can have at the crest without leaving the road? Include the constraint. (Daily Quiz 15 #38)`:L`A \(${m}\text{ kg}\) car drives over the crest of a circular hill (radius \(${Rr}\text{ m}\)) at \(${v}\text{ m/s}\). Find the normal force from the road at the top. (Daily Quiz 15 #37)`,
  fig:sceneHill(),
  steps:[
   {kind:'multi',prompt:'Step 1 (FBD at the crest):',options:[
     {t:L`Gravity \(mg\), down (toward center)`,ok:true,why:'The center of the hill circle is BELOW the car.'},
     {t:'Normal force, up (away from center)',ok:true,why:'The road pushes up on the car.'},FORCE_DISTRACT.cent,
     {t:'Engine force forward',ok:false,why:'Ignore it. It\'s horizontal and doesn\'t affect the vertical (radial) equation. Not part of this question.'}],
    after:fbdSVG([{deg:270,len:80,label:'mg',color:COL.g},{deg:90,len:50,label:'N',color:COL.N}],{accel:270})},
   {kind:'mc',prompt:L`Step 2: Toward center (DOWN) = +:`,choices:[
     {t:L`\(mg - N = \dfrac{mv^2}{R}\)`,ok:true,why:'Gravity points toward the center (+) and the normal force points away (−).'},
     {t:L`\(N - mg = \dfrac{mv^2}{R}\)`,ok:false,why:'That\'s the bottom of a valley/dip. On a crest the center is below you.'},
     {t:L`\(N = mg\)`,ok:false,why:'Classic mistake (the video shows it). The car is accelerating toward the center, so the forces do NOT balance.'}]},
   ...(askMax?[{kind:'mc',prompt:'Step 3: "Without losing contact" is the constraint. What does it mean mathematically?',choices:[
     {t:L`\(N \ge 0\). Max speed is when \(N = 0\)`,ok:true,why:'Losing contact means the road stops pushing. The edge case is N = 0.'},
     {t:L`\(N = mg\)`,ok:false,why:'That would mean no centripetal acceleration.'},
     {t:L`\(v = 0\)`,ok:false,why:'That\'s the minimum, not the maximum.'}]}]:[])],
  final:{prompt:askMax?L`\(v_{max} = \sqrt{gR}\) (m/s):`:L`\(N = mg - \dfrac{mv^2}{R}\) (N):`,ans:askMax?vmax:N,unit:askMax?'m/s':'N'},
  solution:sol({principle:L`Newton's 2nd law, radial`,constraint:askMax?L`Stays in contact: \(N\ge0\). At max speed, \(N=0\)`:'Car follows the circular crest',assume:'Car treated as a point',
    lines:askMax?[L`mg - N = \dfrac{mv^2}{R}`,L`N = 0:\ mg = \dfrac{mv_{max}^2}{R} \Rightarrow v_{max}=\sqrt{gR}`]:[L`mg - N = \dfrac{mv^2}{R}\Rightarrow N = m\left(g - \dfrac{v^2}{R}\right)`],
    plug:askMax?L`v_{max}=\sqrt{(9.8)(${Rr})}=${fmt(vmax)}\text{ m/s}`:L`N=${m}\left(9.8-\dfrac{${v}^2}{${Rr}}\right)=${fmt(N)}\text{ N}`,ans:askMax?L`${fmt(vmax)}\text{ m/s}`:L`${fmt(N)}\text{ N}`,note:askMax?'The mass cancels, so every car has the same max speed.':L`N is less than mg (${fmt(m*G)} N). That's the "stomach drop" feeling.`})};
}},
{id:'C4',topic:'circular',name:'Swing ride / conical pendulum',gen(R){
  const m=R.pick([60,100,150,179,200]),Lc=R.pick([5,8,10,12,15]),th=R.pick([30,40,45,50,60]);const T=m*G/C(th);const r=Lc*S(th);const v=Math.sqrt(G*r*Tn(th));const askT=R.f()<0.5;
  return {stem:L`A carnival swing: a chair + rider (\(${m}\text{ kg}\)) hangs from a \(${Lc}\text{ m}\) cable and moves in a horizontal circle with the cable at \(${th}^\circ\) from vertical. Find ${askT?'the cable tension':'the speed of the chair'}. (Problem Set 13 #5, Pivot Airplane on a String)`,
  fig:sceneConical(th),
  steps:[
   {kind:'multi',prompt:'Step 1 (FBD): forces on the chair?',options:[
     {t:'Tension along the cable (up and inward)',ok:true,why:'The cable pulls toward where it is attached.'},
     {t:L`Gravity \(mg\), down`,ok:true,why:'Always.'},FORCE_DISTRACT.cent,
     {t:'An outward "centrifugal" force',ok:false,why:'There is no outward force. You FEEL pushed out because your body wants to go straight (inertia).'}],
    after:fbdSVG([{deg:90+th,len:85,label:'T',color:COL.T},{deg:270,len:60,label:'mg',color:COL.g}],{accel:180})},
   {kind:'mc',prompt:'Step 2: Break T into parts (θ from VERTICAL). Vertical: no acceleration.',choices:[
     {t:L`\(T\cos\theta = mg\)`,ok:true,why:'The angle is from the vertical, so the vertical part is T cos θ.'},
     {t:L`\(T\sin\theta = mg\)`,ok:false,why:'Since θ is measured from the VERTICAL, the vertical part uses cos.'},
     {t:L`\(T = mg\)`,ok:false,why:'Only part of the tension holds the chair up, so T must be bigger than mg.'}]},
   {kind:'mc',prompt:L`Step 3: Horizontal (toward the center) and the radius:`,choices:[
     {t:L`\(T\sin\theta = \dfrac{mv^2}{r},\ \ r = L\sin\theta\)`,ok:true,why:'The inward part of T provides the centripetal force. The radius is the horizontal distance from the pole.'},
     {t:L`\(T\sin\theta = \dfrac{mv^2}{L}\)`,ok:false,why:'The circle\'s radius is the horizontal distance L sin θ, not the cable length.'},
     {t:L`\(T\cos\theta = \dfrac{mv^2}{r}\)`,ok:false,why:'Horizontal uses sin here, because θ is from the vertical.'}]}],
  final:{prompt:askT?L`\(T = \dfrac{mg}{\cos\theta}\) (N):`:L`Divide the two equations: \(\tan\theta = \dfrac{v^2}{rg}\Rightarrow v=\sqrt{gL\sin\theta\tan\theta}\) (m/s):`,ans:askT?T:v,unit:askT?'N':'m/s'},
  solution:sol({principle:'Newton\'s 2nd law on 2 axes (vertical: ΣF = 0; horizontal: ΣF = mv²/r)',constraint:'Horizontal circle of radius r = L sin θ',assume:'Massless cable, ignore pole radius',
    lines:[L`T\cos\theta = mg \Rightarrow T = \dfrac{mg}{\cos\theta}`,L`T\sin\theta = \dfrac{mv^2}{r}`,L`\div:\ \tan\theta = \dfrac{v^2}{rg}\Rightarrow v = \sqrt{g\,L\sin\theta\,\tan\theta}`],
    plug:askT?L`T=\dfrac{(${m})(9.8)}{\cos ${th}^\circ}=${fmt(T)}\text{ N}`:L`v=\sqrt{(9.8)(${Lc}\sin ${th}^\circ)(\tan ${th}^\circ)}=${fmt(v)}\text{ m/s}`,ans:askT?L`${fmt(T)}\text{ N}`:L`${fmt(v)}\text{ m/s}`})};
}},
{id:'C5',topic:'circular',name:'Banked curve (no friction): design angle',gen(R){
  const r=R.pick([50,80,100,150,200,300]),v=R.pick([12,15,18,20,25,30]);const th=deg(Math.atan(v*v/(r*G)));
  return {stem:L`A curve of radius \(${r}\text{ m}\) is banked so a car going \(${v}\text{ m/s}\) needs NO friction to make the turn. Find the bank angle.`,
  fig:sceneBank(20),
  steps:[
   {kind:'multi',prompt:'Step 1 (FBD): forces on the car (no friction)?',options:[
     {t:'Normal force, perpendicular to the tilted road',ok:true,why:'It tilts toward the center of the curve. That\'s the whole point of banking.'},
     {t:L`Gravity \(mg\), down`,ok:true,why:'Always.'},FORCE_DISTRACT.cent,{t:'Friction',ok:false,why:'The problem says no friction is needed.'}],
    after:fbdSVG([{deg:90+20,len:80,label:'N',color:COL.N},{deg:270,len:60,label:'mg',color:COL.g}],{accel:180})},
   {kind:'mc',prompt:L`Step 2: Use HORIZONTAL/VERTICAL axes (the acceleration is horizontal, toward the center). Which pair?`,choices:[
     {t:L`\(N\cos\theta = mg,\quad N\sin\theta = \dfrac{mv^2}{r}\)`,ok:true,why:'Vertical: balanced. Horizontal: the inward part of N is the centripetal force.'},
     {t:L`\(N = mg\cos\theta,\quad mg\sin\theta = \dfrac{mv^2}{r}\)`,ok:false,why:'That\'s the incline habit (tilted axes). For circular motion, put one axis along the acceleration, which here is horizontal.'},
     {t:L`\(N = mg,\quad N\sin\theta = \dfrac{mv^2}{r}\)`,ok:false,why:'Only part of N (N cos θ) holds the car up.'}]}],
  final:{prompt:L`Divide: \(\tan\theta = \dfrac{v^2}{rg}\). Angle in degrees:`,ans:th,unit:'°'},
  solution:sol({principle:'Newton\'s 2nd law, axes along/perpendicular to the acceleration (horizontal)',constraint:'No friction needed at this exact speed',assume:'Car as a point',
    lines:[L`N\cos\theta = mg`,L`N\sin\theta = \dfrac{mv^2}{r}`,L`\tan\theta = \dfrac{v^2}{rg}`],plug:L`\theta=\tan^{-1}\dfrac{${v}^2}{(${r})(9.8)}=${fmt(th)}^\circ`,ans:L`${fmt(th)}^\circ`})};
}},
{id:'C6',topic:'circular',name:'Flat curve: max speed with friction',gen(R){
  const mu=R.pick([0.3,0.4,0.5,0.6,0.7,0.8]),r=R.pick([20,30,40,50,75,100]);const v=Math.sqrt(mu*G*r);
  return {stem:L`A car rounds a FLAT curve of radius \(${r}\text{ m}\). \(\mu_s=${mu}\) between the tires and road. What is the max speed without skidding?`,
  steps:[
   {kind:'mc',prompt:'Step 1: What force pushes the car toward the center?',choices:[
     {t:'Static friction from the road, pointing toward the center',ok:true,why:'On a flat road, friction is the only sideways force. It is static because the tires don\'t slide sideways.'},
     {t:'Kinetic friction',ok:false,why:'The tires aren\'t skidding sideways (that\'s the goal), so it\'s static.'},
     {t:'Centripetal force from the engine',ok:false,why:'The engine pushes forward. The inward push comes from friction.'}]},
   {kind:'mc',prompt:L`Step 2: At max speed, friction is maxed out:`,choices:[
     {t:L`\(\mu_s mg = \dfrac{mv^2}{r}\)`,ok:true,why:L`\(f_{s,max}=\mu_s N=\mu_s mg\) on flat ground.`},
     {t:L`\(\mu_s mg = mv^2 r\)`,ok:false,why:L`Centripetal force is \(mv^2/r\) (divide by r).`},
     {t:L`\(\mu_s = \dfrac{v^2}{r}\)`,ok:false,why:'You lost the g. Units don\'t match (μ has no units).'}]}],
  final:{prompt:L`\(v_{max}=\sqrt{\mu_s g r}\) (m/s):`,ans:v,unit:'m/s'},
  solution:sol({principle:'Newton\'s 2nd law, radial',constraint:L`No skid: \(f_s\le\mu_s N\). Max speed when equal`,assume:'Flat road',
    lines:[L`N = mg`,L`\mu_s mg = \dfrac{mv^2}{r}\Rightarrow v_{max}=\sqrt{\mu_s g r}`],plug:L`v=\sqrt{(${mu})(9.8)(${r})}=${fmt(v)}\text{ m/s}`,ans:L`${fmt(v)}\text{ m/s}`})};
}},
{id:'C7',topic:'circular',name:'Satellite orbits: speed vs radius',gen(R){
  const v1=R.pick([1.2,1.5,1.7,2.0,2.4])*1e4,r1=R.pick([4.0,5.25,6.0,7.0])*1e6;let r2;do{r2=R.pick([3.0,5.0,8.6,9.0,12.0])*1e6;}while(r2===r1);const v2=v1*Math.sqrt(r1/r2);
  return {stem:L`A satellite orbits a planet in a circle of radius \(${fmt(r1)}\text{ m}\) at \(${fmt(v1)}\text{ m/s}\). A second satellite orbits the same planet at radius \(${fmt(r2)}\text{ m}\). Find its speed. (Problem Set 13 #2)`,
  steps:[
   {kind:'mc',prompt:'Step 1: What provides the centripetal force?',choices:[
     {t:L`Gravity: \(\dfrac{GMm}{r^2} = \dfrac{mv^2}{r}\)`,ok:true,why:'Gravity from the planet is the only force, and it points to the center.'},
     {t:L`\(mg = \dfrac{mv^2}{r}\) with g = 9.8`,ok:false,why:'9.8 is only at Earth\'s surface ("flat earth" model). Far away you need GMm/r².'},
     {t:'Thrust from the rocket',ok:false,why:'Satellites coast. Only gravity acts.'}]},
   {kind:'mc',prompt:'Step 2: Solve for v, then compare satellites (we don\'t know M):',choices:[
     {t:L`\(v=\sqrt{\dfrac{GM}{r}}\Rightarrow \dfrac{v_2}{v_1}=\sqrt{\dfrac{r_1}{r_2}}\)`,ok:true,why:'The unknown GM cancels in the ratio.'},
     {t:L`\(\dfrac{v_2}{v_1}=\dfrac{r_2}{r_1}\)`,ok:false,why:'Farther orbits are SLOWER, and speed goes as 1/√r.'},
     {t:L`\(\dfrac{v_2}{v_1}=\dfrac{r_1^2}{r_2^2}\)`,ok:false,why:'Solve GM/r = v² carefully. It\'s a square root, not squared.'}]}],
  final:{prompt:'Speed of satellite 2 (m/s):',ans:v2,unit:'m/s'},
  solution:sol({principle:L`Newton's 2nd law + universal gravitation`,constraint:'Circular orbit',assume:'Planet is a sphere, only gravity acts',
    lines:[L`\dfrac{GMm}{r^2}=\dfrac{mv^2}{r}\Rightarrow v=\sqrt{\dfrac{GM}{r}}`,L`v_2 = v_1\sqrt{\dfrac{r_1}{r_2}}`],plug:L`v_2=(${fmt(v1)})\sqrt{\dfrac{${fmt(r1)}}{${fmt(r2)}}}=${fmt(v2)}\text{ m/s}`,ans:L`${fmt(v2)}\text{ m/s}`})};
}},
{id:'C8',topic:'circular',name:'Rotating space station (artificial gravity)',gen(R){
  const n=R.pick([1,1.5,2,2.5,3,4]);const w=2*Math.PI*n/60;const r=G/(w*w);
  return {stem:L`A rotating space station spins at \(${n}\) revolutions per minute. How far from the axis must astronauts stand so that the centripetal acceleration at their feet equals \(g\)? (Problem Set 13 #3)`,
  steps:[
   {kind:'mc',prompt:'Step 1: Convert rev/min to ω (rad/s):',choices:[
     {t:L`\(\omega = \dfrac{2\pi n}{60}\)`,ok:true,why:'One revolution is 2π rad, and one minute is 60 s.'},
     {t:L`\(\omega = \dfrac{n}{60}\)`,ok:false,why:'That\'s rev/s. You need rad/s, so multiply by 2π.'},
     {t:L`\(\omega = 2\pi n\)`,ok:false,why:'That\'s rad per MINUTE. Divide by 60.'}]},
   {kind:'mc',prompt:'Step 2: Centripetal acceleration in terms of ω:',choices:[
     {t:L`\(a_c=\omega^2 r = g\)`,ok:true,why:L`Since \(v=\omega r\), \(v^2/r=\omega^2 r\).`},
     {t:L`\(a_c=\omega r\)`,ok:false,why:'ωr is the speed v, not the acceleration.'},
     {t:L`\(a_c=\omega^2/r\)`,ok:false,why:L`\(v^2/r = (\omega r)^2/r = \omega^2 r\).`}]}],
  final:{prompt:L`\(r = g/\omega^2\) (m):`,ans:r,unit:'m'},
  solution:sol({principle:'Centripetal acceleration (kinematics of circular motion)',constraint:L`\(a_c = g\)`,assume:'Uniform rotation',
    lines:[L`\omega=\dfrac{2\pi n}{60}`,L`\omega^2 r = g\Rightarrow r=\dfrac{g}{\omega^2}`],plug:L`\omega=${fmt(w)}\text{ rad/s},\ r=\dfrac{9.8}{${fmt(w)}^2}=${fmt(r)}\text{ m}`,ans:L`${fmt(r)}\text{ m}`,note:n===2?'Matches the PS13 answer of 223 m.':''})};
}},
// ---------------- ENERGY ----------------
{id:'E1',topic:'energy',name:'Ball bounce with energy dissipated',gen(R){
  let m,h,E;for(let i=0;i<50;i++){m=R.pick([0.1,0.15,0.2,0.25,0.3,0.5]);h=R.pick([1,1.2,1.5,2,2.5,3]);E=R.pick([0.1,0.2,0.3,0.4,0.6,0.8,1.0]);if(E<0.8*m*G*h)break;}
  const hf=h-E/(m*G);
  return {stem:L`A \(${m}\text{ kg}\) ball is dropped from rest \(${h}\text{ m}\) above the floor. During the bounce, \(${E}\text{ J}\) is dissipated. What maximum height does it reach after the bounce? (Problem Set 19 #1)`,
  fig:sceneDrop(),
  steps:[
   {kind:'mc',prompt:'Step 1: Choose the system:',choices:[
     {t:'Ball + Earth (so gravity is stored as Ug)',ok:true,why:'With Earth in the system, gravity shows up as a Ug bar instead of outside work. This is the usual choice.'},
     {t:'Ball only, but still draw a Ug bar',ok:false,why:'If Earth is NOT in the system, gravity is outside work (W bar), not Ug. Don\'t count gravity twice.'}]},
   {kind:'multi',prompt:'Step 2 (bar chart): Initial = dropped, Final = top of the bounce. Which bars are NOT zero?',options:[
     {t:L`\(U_g\) initial`,ok:true,why:'It starts high up.'},{t:L`\(K\) initial`,ok:false,why:'Dropped from REST, so K = 0.'},
     {t:L`\(U_g\) final`,ok:true,why:'It ends at some height.'},{t:L`\(K\) final`,ok:false,why:'At the max height it is momentarily at rest.'},
     {t:L`\(\Delta E_{th}\)`,ok:true,why:'The dissipated energy (heat/sound) goes here.'},{t:'W (outside work)',ok:false,why:'Nothing outside the ball+Earth system pushes on it.'}],
    after:barChart({Ug0:5,Ug1:3,Eth:2,lbl:{Ug0:'mgh',Ug1:'mgh_f',Eth:'0.60 J'}})},
   {kind:'mc',prompt:'Step 3: Each bar becomes a term. Which equation?',choices:[
     {t:L`\(mgh = mgh_f + E_{diss}\)`,ok:true,why:'Initial bars = final bars, one term per bar.'},
     {t:L`\(mgh + E_{diss} = mgh_f\)`,ok:false,why:'Dissipated energy LEAVES the useful energy. It\'s on the final side as ΔE_th.'},
     {t:L`\(mgh = \tfrac12 mv^2\)`,ok:false,why:'There is no K at the start or at the top.'}]}],
  final:{prompt:L`\(h_f = h - \dfrac{E_{diss}}{mg}\) (m):`,ans:hf,unit:'m'},
  solution:sol({principle:L`Conservation of energy (bar chart): \(K_i+U_i+W = K_f+U_f+\Delta E_{th}\)`,constraint:L`\(K_i=0\) (dropped from rest), \(K_f=0\) (top of bounce)`,assume:'System = ball + Earth, no air resistance',
    lines:[L`mgh = mgh_f + \Delta E_{th}`,L`h_f = h - \dfrac{\Delta E_{th}}{mg}`],plug:L`h_f=${h}-\dfrac{${E}}{(${m})(9.8)}=${fmt(hf)}\text{ m}`,ans:L`${fmt(hf)}\text{ m}`})};
}},
{id:'E2',topic:'energy',name:'Braking force to stop in distance d',gen(R){
  const m=R.pick([1000,1500,2000,5000,20000]),v=R.pick([10,15,20,25,30]),d=R.pick([20,40,50,80,100,150]);const F=m*v*v/(2*d);
  return {stem:L`A \(${m}\text{ kg}\) vehicle moving at \(${v}\text{ m/s}\) brakes to a stop in \(${d}\text{ m}\). What constant braking force is needed? (Daily Quiz 17)`,
  steps:[
   {kind:'multi',prompt:'Step 1 (bar chart, system = vehicle): Which bars are non-zero?',options:[
     {t:L`\(K\) initial`,ok:true,why:'It starts moving.'},{t:L`\(K\) final`,ok:false,why:'It stops.'},
     {t:'W (negative, done by the brake force)',ok:true,why:'The braking force points opposite the motion, so it does negative work. It takes energy out.'},
     {t:L`\(U_g\)`,ok:false,why:'The height doesn\'t change.'}],
    after:barChart({K0:4,W:-4,lbl:{K0:'½mv²',W:'−Fd'}})},
   {kind:'mc',prompt:'Step 2: Equation from the bars:',choices:[
     {t:L`\(\tfrac12 mv^2 - Fd = 0\)`,ok:true,why:L`\(K_i + W = K_f\) with \(W = -Fd\).`},
     {t:L`\(\tfrac12 mv^2 = Fd^2\)`,ok:false,why:'Work = force × distance, not distance squared.'},
     {t:L`\(mv = Fd\)`,ok:false,why:'mv is momentum, not energy.'}]}],
  final:{prompt:L`\(F=\dfrac{mv^2}{2d}\) (N):`,ans:F,unit:'N'},
  solution:sol({principle:L`Work-energy theorem: \(W_{net} = \Delta K\)`,constraint:L`\(v_f = 0\)`,assume:'Constant braking force, level road',
    lines:[L`\tfrac12 mv^2 + (-Fd) = 0`,L`F=\dfrac{mv^2}{2d}`,L`\text{Check with Newton: } v_f^2=v^2-2ad\Rightarrow a=\dfrac{v^2}{2d},\ F=ma=\dfrac{mv^2}{2d}\ \checkmark`],
    plug:L`F=\dfrac{(${m})(${v})^2}{2(${d})}=${fmt(F)}\text{ N}`,ans:L`${fmt(F)}\text{ N}`,note:'DQ17 asked for BOTH methods. Energy and kinematics give the same answer.'})};
}},
{id:'E3',topic:'energy',name:'Block slides down incline into a spring',gen(R){
  const m=R.pick([2,5,10,20]),d=R.pick([2,3,4,6]),th=R.pick([20,30,37,45]),k=R.pick([200,500,800,1000,2000]);
  const vh=Math.sqrt(2*G*d*S(th));const a=0.5*k,b=-m*G*S(th),c=-m*G*S(th)*d;const x=(-b+Math.sqrt(b*b-4*a*c))/(2*a);const askX=R.f()<0.5;
  return {stem:L`A \(${m}\text{ kg}\) block is released from rest and slides \(${d}\text{ m}\) down a frictionless \(${th}^\circ\) incline, then hits a spring (\(k=${k}\text{ N/m}\)). Find ${askX?'the maximum compression of the spring':'its speed just as it touches the spring'}. (Problem Set 19 #3)`,
  fig:sceneIncline(th,{spring:true,pos:0.75}),
  steps:[
   {kind:'multi',prompt:askX?'Step 1 (bar chart): Initial = release, Final = max compression. Non-zero bars?':'Step 1 (bar chart): Initial = release, Final = just touching the spring. Non-zero bars?',options:[
     {t:L`\(U_g\) initial`,ok:true,why:'It starts higher up the slope.'},{t:L`\(K\) initial`,ok:false,why:'Released from rest.'},
     {t:L`\(K\) final`,ok:!askX,why:askX?'At max compression it stops for an instant.':'It is moving when it hits the spring.'},
     {t:L`\(U_s\) final`,ok:askX,why:askX?'The spring is compressed, so it stores energy.':'The spring is not compressed yet.'},
     {t:L`\(\Delta E_{th}\)`,ok:false,why:'Frictionless.'}],
    after:askX?barChart({Ug0:5,Us1:5,lbl:{Ug0:'mg(d+x)sinθ',Us1:'½kx²'}}):barChart({Ug0:4,K1:4,lbl:{Ug0:'mgd sinθ',K1:'½mv²'}})},
   {kind:'mc',prompt:askX?'Step 2: How far does the block DROP vertically by max compression?':'Step 2: How far does the block drop vertically?',choices:askX?[
     {t:L`\((d+x)\sin\theta\)`,ok:true,why:'It slides d, then keeps going x more while squishing the spring. Vertical drop = slope distance × sin θ.'},
     {t:L`\(d\sin\theta\)`,ok:false,why:'It keeps sliding (and dropping) while it compresses the spring.'},
     {t:L`\(d+x\)`,ok:false,why:'That is the distance ALONG the slope. Height uses sin θ.'}]:[
     {t:L`\(d\sin\theta\)`,ok:true,why:'Opposite side = hypotenuse × sin θ.'},{t:L`\(d\)`,ok:false,why:'d is along the slope. You need the vertical drop.'},{t:L`\(d\cos\theta\)`,ok:false,why:'That\'s the horizontal distance.'}]}],
  final:{prompt:askX?L`Solve \(mg(d+x)\sin\theta=\tfrac12 kx^2\) (quadratic, take +root) (m):`:L`\(v=\sqrt{2gd\sin\theta}\) (m/s):`,ans:askX?x:vh,unit:askX?'m':'m/s'},
  solution:sol({principle:'Conservation of energy (bar chart)',constraint:askX?'At max compression v = 0':'Released from rest',assume:'Frictionless, ideal massless spring, system = block + Earth + spring',
    lines:askX?[L`mg(d+x)\sin\theta = \tfrac12 kx^2`,L`\tfrac12 kx^2 - (mg\sin\theta)x - mgd\sin\theta = 0`,L`x=\dfrac{mg\sin\theta+\sqrt{(mg\sin\theta)^2+2k\,mgd\sin\theta}}{k}`]:[L`mgd\sin\theta=\tfrac12 mv^2\Rightarrow v=\sqrt{2gd\sin\theta}`],
    plug:askX?L`x=\dfrac{${fmt(m*G*S(th))}+\sqrt{${fmt(m*G*S(th))}^2+2(${k})(${fmt(m*G*S(th))})(${d})}}{${k}}=${fmt(x)}\text{ m}`:L`v=\sqrt{2(9.8)(${d})\sin ${th}^\circ}=${fmt(vh)}\text{ m/s}`,ans:askX?L`${fmt(x)}\text{ m}`:L`${fmt(vh)}\text{ m/s}`,
    note:'Bonus (PS19 #3): the speed is NOT max at the instant it touches the spring. It keeps speeding up until the spring force kx equals mg sin θ.'})};
}},
{id:'E4',topic:'energy',name:'Spring launches a block (frictionless)',gen(R){
  const k=R.pick([100,200,400,500,800]),x=R.pick([0.05,0.1,0.15,0.2,0.3]),m=R.pick([0.2,0.5,1,2]);const v=x*Math.sqrt(k/m);
  return {stem:L`A \(${m}\text{ kg}\) block is pushed against a spring (\(k=${k}\text{ N/m}\)), compressing it \(${x}\text{ m}\), then released on a frictionless floor. Find its launch speed.`,
  fig:sceneSpring(),
  steps:[
   {kind:'multi',prompt:'Step 1 (bar chart): Initial = compressed at rest, Final = left the spring. Non-zero bars?',options:[
     {t:L`\(U_s\) initial`,ok:true,why:'The compressed spring stores ½kx².'},{t:L`\(K\) final`,ok:true,why:'Now it moves.'},{t:L`\(K\) initial`,ok:false,why:'Held at rest.'},{t:L`\(U_s\) final`,ok:false,why:'The spring is back to natural length.'},{t:L`\(\Delta E_{th}\)`,ok:false,why:'Frictionless.'}],
    after:barChart({Us0:4,K1:4,lbl:{Us0:'½kx²',K1:'½mv²'}})},
   {kind:'mc',prompt:'Step 2: Equation:',choices:[
     {t:L`\(\tfrac12 kx^2=\tfrac12 mv^2\)`,ok:true,why:'One term per bar.'},{t:L`\(kx=\tfrac12 mv^2\)`,ok:false,why:'kx is the spring FORCE. Spring ENERGY is ½kx².'},{t:L`\(kx = mv\)`,ok:false,why:'Force ≠ momentum. Use energies.'}]}],
  final:{prompt:L`\(v=x\sqrt{k/m}\) (m/s):`,ans:v,unit:'m/s'},
  solution:sol({principle:'Conservation of energy',assume:'Ideal massless spring, frictionless',lines:[L`\tfrac12kx^2=\tfrac12mv^2\Rightarrow v=x\sqrt{\dfrac{k}{m}}`],plug:L`v=${x}\sqrt{\dfrac{${k}}{${m}}}=${fmt(v)}\text{ m/s}`,ans:L`${fmt(v)}\text{ m/s}`})};
}},
{id:'E5',topic:'energy',name:'Spring launch, then friction stops it',gen(R){
  const k=R.pick([200,400,500,800,1000]),x=R.pick([0.1,0.15,0.2,0.25]),m=R.pick([0.5,1,2]),mu=R.pick([0.2,0.25,0.3,0.4,0.5]);const d=k*x*x/(2*mu*m*G);
  return {stem:L`A spring (\(k=${k}\text{ N/m}\)) compressed \(${x}\text{ m}\) launches a \(${m}\text{ kg}\) block onto a rough floor (\(\mu_k=${mu}\)). How far does the block slide before stopping? (Measure from release, ignore friction while it is on the spring.)`,
  steps:[
   {kind:'multi',prompt:'Step 1 (bar chart): Initial = compressed, Final = stopped. Non-zero bars?',options:[
     {t:L`\(U_s\) initial`,ok:true,why:'Stored spring energy.'},{t:L`\(\Delta E_{th}\)`,ok:true,why:'Friction turns all of it into thermal energy.'},{t:L`\(K\) final`,ok:false,why:'It stops.'},{t:L`\(K\) initial`,ok:false,why:'Starts at rest.'}],
    after:barChart({Us0:4,Eth:4,lbl:{Us0:'½kx²',Eth:'μmgd'}})},
   {kind:'mc',prompt:'Step 2: Thermal energy from friction is…',choices:[
     {t:L`\(\Delta E_{th}=f_k d=\mu_k mg\,d\)`,ok:true,why:'Friction force × sliding distance.'},{t:L`\(\mu_k d\)`,ok:false,why:'Need the friction FORCE μk·N = μk·mg.'},{t:L`\(\mu_k mg\,d^2\)`,ok:false,why:'Work is force × distance, not distance squared.'}]}],
  final:{prompt:L`\(d=\dfrac{kx^2}{2\mu_k mg}\) (m):`,ans:d,unit:'m'},
  solution:sol({principle:'Conservation of energy with friction',assume:'Friction only acts after launch (as stated)',lines:[L`\tfrac12 kx^2 = \mu_k mg\,d`,L`d=\dfrac{kx^2}{2\mu_k mg}`],plug:L`d=\dfrac{(${k})(${x})^2}{2(${mu})(${m})(9.8)}=${fmt(d)}\text{ m}`,ans:L`${fmt(d)}\text{ m}`})};
}},
{id:'E6',topic:'energy',name:'Pendulum: speed (and tension) at the bottom',gen(R){
  const Lp=R.pick([0.5,1,1.5,2,3]),th=R.pick([20,30,40,45,60]),m=R.pick([0.2,0.5,1,2]);const h=Lp*(1-C(th));const v=Math.sqrt(2*G*h);const T=m*G+m*v*v/Lp;const askT=R.f()<0.45;
  return {stem:L`A \(${m}\text{ kg}\) pendulum bob on a \(${Lp}\text{ m}\) string is pulled back to \(${th}^\circ\) from vertical and released from rest. Find ${askT?'the string tension at the lowest point':'its speed at the lowest point'}.`,
  fig:scenePendulum(th),
  steps:[
   {kind:'mc',prompt:'Step 1: How high above the lowest point does it start?',choices:[
     {t:L`\(h = L(1-\cos\theta)\)`,ok:true,why:L`The bob is \(L\cos\theta\) below the pivot at the start and \(L\) below at the bottom. The difference is \(L - L\cos\theta\).`},
     {t:L`\(h = L\sin\theta\)`,ok:false,why:'That\'s the horizontal distance from the vertical line.'},
     {t:L`\(h = L\cos\theta\)`,ok:false,why:'That\'s how far BELOW the pivot it starts, not how high above the bottom.'}]},
   {kind:'mc',prompt:'Step 2 (bar chart Ug → K):',choices:[
     {t:L`\(mgh=\tfrac12mv^2\)`,ok:true,why:'Tension does no work (it is perpendicular to the motion), so energy is conserved.'},
     {t:L`\(mgL = \tfrac12 mv^2\)`,ok:false,why:'Use the vertical drop h, not the string length.'},
     {t:L`\(mgh + W_T = \tfrac12mv^2\)`,ok:false,why:'Tension is always perpendicular to the path, so W_T = 0.'}]},
   ...(askT?[{kind:'mc',prompt:'Step 3: At the bottom (circular motion):',choices:[
     {t:L`\(T - mg = \dfrac{mv^2}{L}\)`,ok:true,why:'Center is up. Energy gives v, then Newton gives T.'},
     {t:L`\(T = mg\)`,ok:false,why:'It is moving in a circle, so T > mg at the bottom.'},
     {t:L`\(mg - T = \dfrac{mv^2}{L}\)`,ok:false,why:'Center is ABOVE the bob.'}]}]:[])],
  final:{prompt:askT?'Tension at bottom (N):':'Speed at bottom (m/s):',ans:askT?T:v,unit:askT?'N':'m/s'},
  solution:sol({principle:askT?'Energy conservation (to get v) + Newton\'s 2nd law radial (to get T)':'Conservation of energy',constraint:'Released from rest',assume:'No air resistance, massless string',
    lines:[L`h=L(1-\cos\theta)`,L`mgh=\tfrac12mv^2\Rightarrow v=\sqrt{2gL(1-\cos\theta)}`,...(askT?[L`T-mg=\dfrac{mv^2}{L}\Rightarrow T=mg(3-2\cos\theta)`]:[])],
    plug:askT?L`T=(${m})(9.8)(3-2\cos ${th}^\circ)=${fmt(T)}\text{ N}`:L`v=\sqrt{2(9.8)(${Lp})(1-\cos ${th}^\circ)}=${fmt(v)}\text{ m/s}`,ans:askT?L`${fmt(T)}\text{ N}`:L`${fmt(v)}\text{ m/s}`})};
}},
{id:'E7',topic:'work',name:'Work by an angled force',gen(R){
  const F=R.pick([10,12,16,20,25,40]),d=R.pick([1.5,2,2.2,3,4,5]),th=R.pick([15,20,25,30,37,45,60]);const W=F*d*C(th);
  return {stem:L`A block is pushed \(${d}\text{ m}\) along a frictionless horizontal table by a constant \(${F}\text{ N}\) force directed \(${th}^\circ\) from the horizontal. How much work does the force do? (Problem Set 18 #4)`,
  steps:[
   {kind:'mc',prompt:'Step 1: Which part of the force does work?',choices:[
     {t:L`Only the part PARALLEL to the displacement: \(F\cos\theta\)`,ok:true,why:L`Work = \(\vec F\cdot\vec d = Fd\cos\theta\). The vertical part does no work because the block doesn't move vertically.`},
     {t:L`The whole force \(F\)`,ok:false,why:'Only if F points exactly along the motion.'},
     {t:L`\(F\sin\theta\)`,ok:false,why:'That\'s the vertical part, which is perpendicular to the motion, so it does zero work.'}]}],
  final:{prompt:L`\(W = Fd\cos\theta\) (J):`,ans:W,unit:'J'},
  solution:sol({principle:L`Definition of work: \(W=\vec F\cdot\Delta\vec r = F\,d\cos\theta\)`,assume:'Constant force',lines:[L`W=Fd\cos\theta`],plug:L`W=(${F})(${d})\cos ${th}^\circ=${fmt(W)}\text{ J}`,ans:L`${fmt(W)}\text{ J}`,note:'The mass doesn\'t matter for the work done by THIS force.'})};
}},
{id:'E8',topic:'work',name:'Work by a variable force (integral)',gen(R){
  const n=R.pick([1,2,3]),b=R.pick([2,3,4,5,6,10]),D=R.pick([1,1.5,2,3]);const W=b*D**(n+1)/(n+1);
  return {stem:L`A force \(F(x)=${b}x^{${n}}\) (N, x in m) pushes an object along the x-axis from \(x=0\) to \(x=${D}\text{ m}\). How much work does it do? (Problem Set 19 #5)`,
  steps:[
   {kind:'mc',prompt:'Step 1: The force changes with x. How do you find the work?',choices:[
     {t:L`\(W=\displaystyle\int_0^{D}F(x)\,dx\) (area under F vs x)`,ok:true,why:'Add up F·dx over tiny steps, which is an integral.'},
     {t:L`\(W=F(D)\cdot D\)`,ok:false,why:'That uses the final force for the whole trip, but the force was smaller earlier.'},
     {t:L`\(W=\dfrac{dF}{dx}\)`,ok:false,why:'Work is the integral (area), not the derivative.'}]},
   {kind:'mc',prompt:'Step 2: Integrate:',choices:[
     {t:L`\(\displaystyle\int_0^D bx^{${n}}dx=\dfrac{bD^{${n+1}}}{${n+1}}\)`,ok:true,why:'Power rule: raise the power by 1 and divide by the new power.'},
     {t:L`\(${n}bD^{${n-1}}\)`,ok:false,why:'That\'s the derivative, not the integral.'},
     {t:L`\(bD^{${n+1}}\)`,ok:false,why:`You forgot to divide by ${n+1}.`}]}],
  final:{prompt:'Work (J):',ans:W,unit:'J'},
  solution:sol({principle:L`Work by a variable force: \(W=\int F\,dx\)`,lines:[L`W=\int_0^{D}bx^{${n}}\,dx=\dfrac{b\,D^{${n+1}}}{${n+1}}`],plug:L`W=\dfrac{(${b})(${D})^{${n+1}}}{${n+1}}=${fmt(W)}\text{ J}`,ans:L`${fmt(W)}\text{ J}`,note:L`PS19 #5 twist: going from 0 to 2D instead multiplies the work by \(2^{${n+1}}=${2**(n+1)}\).`})};
}},
{id:'E9',topic:'work',name:'Extra work to bring a heavier car up to speed',gen(R){
  const mA=R.pick([1000,1200,1400]),mB=mA+R.pick([400,600,800,1000]),v=R.pick([20,25,30,40]);const dW=0.5*(mB-mA)*v*v;
  return {stem:L`Cars A (\(${mA}\text{ kg}\)) and B (\(${mB}\text{ kg}\)) each start from rest and reach \(${v}\text{ m/s}\). How much MORE work is required for car B? (Problem Set 18 #2)`,
  steps:[{kind:'mc',prompt:'Step 1: Work-energy theorem says work needed =',choices:[
     {t:L`\(\Delta K = \tfrac12 mv^2 - 0\)`,ok:true,why:L`\(W_{net}=\Delta K\). Both start from rest.`},{t:L`\(mv\)`,ok:false,why:'That\'s momentum.'},{t:L`\(mgh\)`,ok:false,why:'No height change.'}]}],
  final:{prompt:L`\(\Delta W=\tfrac12(m_B-m_A)v^2\) (J):`,ans:dW,unit:'J'},
  solution:sol({principle:L`Work-energy theorem \(W_{net}=\Delta K\)`,constraint:'Both start from rest',lines:[L`W_A=\tfrac12m_Av^2,\ W_B=\tfrac12m_Bv^2`,L`\Delta W=\tfrac12(m_B-m_A)v^2`],plug:L`\Delta W=\tfrac12(${mB-mA})(${v})^2=${fmt(dW)}\text{ J}`,ans:L`${fmt(dW)}\text{ J}`})};
}},
{id:'E10',topic:'springs',name:'Spring force & stored energy',gen(R){
  const k=R.pick([50,100,150,200,400]),x=R.pick([0.1,0.2,0.5,1,2]);const F=k*x,U=0.5*k*x*x;const askU=R.f()<0.6;const comp=R.f()<0.5;
  return {stem:L`A spring with \(k=${k}\text{ N/m}\) is ${comp?'compressed':'stretched'} \(${x}\text{ m}\). Find ${askU?'the energy stored':'the magnitude of the spring force'}. (Problem Set 19 #6)`,
  steps:[{kind:'mc',prompt:askU?L`Step 1: Where does \(U_s=\tfrac12kx^2\) come from?`:'Step 1: Hooke\'s law:',choices:askU?[
     {t:L`\(U_s=\displaystyle\int_0^x kx\,dx=\tfrac12kx^2\) (area of the triangle under F vs x)`,ok:true,why:'The work to stretch it is stored as energy.'},
     {t:L`\(U_s=kx\cdot x = kx^2\)`,ok:false,why:'The force grows from 0 to kx, so the area is a TRIANGLE (½ base × height).'},
     {t:L`\(U_s=kx\)`,ok:false,why:'kx is the force, not the energy.'}]:[
     {t:L`\(|F|=kx\)`,ok:true,why:'The force is proportional to the stretch/compression.'},{t:L`\(F=\tfrac12kx^2\)`,ok:false,why:'That\'s the energy.'},{t:L`\(F=k/x\)`,ok:false,why:'A bigger stretch gives a BIGGER force.'}]}],
  final:{prompt:askU?'Energy (J):':'Force magnitude (N):',ans:askU?U:F,unit:askU?'J':'N'},
  solution:sol({principle:askU?L`\(U_s=\int_0^x kx\,dx=\tfrac12kx^2\)`:L`Hooke's law \(F=-kx\)`,lines:[askU?L`U_s=\tfrac12kx^2`:L`|F|=kx`],plug:askU?L`U=\tfrac12(${k})(${x})^2=${fmt(U)}\text{ J}`:L`F=(${k})(${x})=${fmt(F)}\text{ N}`,ans:askU?L`${fmt(U)}\text{ J}`:L`${fmt(F)}\text{ N}`,note:'Stretched or compressed by the same amount gives the same energy, because x² is positive either way. The force just points the other way.'})};
}},
{id:'E11',topic:'springs',name:'Spring constant from a hanging mass',gen(R){
  const m=R.pick([0.05,0.1,0.2,0.25,0.5,1]),x=R.pick([0.02,0.04,0.05,0.08,0.1,0.2]);const k=m*G/x;
  return {stem:L`Hanging a \(${m}\text{ kg}\) mass on a spring stretches it \(${x}\text{ m}\) and it hangs at rest. Find the spring constant. (Pivot: Spring Constant Challenge)`,
  steps:[{kind:'mc',prompt:'Step 1: At rest:',choices:[
     {t:L`\(kx=mg\)`,ok:true,why:'Spring force up balances gravity down.'},{t:L`\(\tfrac12kx^2=mgx\)`,ok:false,why:'Energy is not conserved like that while you slowly lower it (your hand does work). Use force balance at equilibrium.'},{t:L`\(k=mgx\)`,ok:false,why:'Solve kx = mg for k: divide by x.'}]},
   {kind:'mc',prompt:'Step 2: On a graph of F (vertical) vs x (horizontal), what does the slope mean?',choices:[
     {t:'The spring constant k',ok:true,why:'F = kx is a line through the origin with slope k.'},{t:'The stored energy',ok:false,why:'Energy is the AREA under F vs x, not the slope.'},{t:'The mass',ok:false,why:'For F vs a, the slope is mass. For F vs x it\'s k.'}]}],
  final:{prompt:L`\(k=mg/x\) (N/m):`,ans:k,unit:'N/m'},
  solution:sol({principle:'Newton\'s 1st law (equilibrium) + Hooke\'s law',constraint:'Hanging at rest',lines:[L`kx - mg = 0\Rightarrow k=\dfrac{mg}{x}`],plug:L`k=\dfrac{(${m})(9.8)}{${x}}=${fmt(k)}\text{ N/m}`,ans:L`${fmt(k)}\text{ N/m}`})};
}},
{id:'E12',topic:'energy',name:'Loop-the-loop: minimum release height',gen(R){
  const Rr=R.pick([0.2,0.3,0.5,1,2,5,10]);const h=2.5*Rr;
  return {stem:L`A small cart starts from rest at height \(h\) and rolls down a frictionless track into a vertical loop of radius \(${Rr}\text{ m}\). What is the minimum \(h\) so it makes it around the loop without falling off?`,
  fig:sceneLoop(),
  steps:[
   {kind:'mc',prompt:'Step 1 (Newton at the TOP of the loop): the minimum speed happens when…',choices:[
     {t:L`\(N=0\), so \(mg=\dfrac{mv^2}{R}\Rightarrow v^2=gR\)`,ok:true,why:'Just barely staying on the track means the track stops pushing. Gravity alone provides the centripetal force.'},
     {t:L`\(v=0\) at the top`,ok:false,why:'If v = 0 at the top, it falls off well before reaching it.'},
     {t:L`\(N=mg\)`,ok:false,why:'That isn\'t the edge case. The minimum is when N = 0.'}]},
   {kind:'mc',prompt:'Step 2 (Energy from start to top of loop, which is 2R high):',choices:[
     {t:L`\(mgh = mg(2R) + \tfrac12 m v^2\)`,ok:true,why:'Ug at the start = Ug at the top of the loop + K at the top.'},
     {t:L`\(mgh = mgR + \tfrac12mv^2\)`,ok:false,why:'The top of the loop is 2R above the bottom (a diameter).'},
     {t:L`\(mgh = mg(2R)\)`,ok:false,why:'It still needs some speed at the top (v² = gR).'}]}],
  final:{prompt:L`Plug \(v^2=gR\): \(h=\tfrac52R\) (m):`,ans:h,unit:'m'},
  solution:sol({principle:'Combine Newton (radial, at the top) + energy conservation',constraint:L`Stays on track: \(N\ge0\) at the top. Minimum when \(N=0\)`,assume:'Frictionless, cart is a point (no rolling energy)',
    lines:[L`mg=\dfrac{mv_{top}^2}{R}\Rightarrow v_{top}^2=gR`,L`mgh=mg(2R)+\tfrac12m(gR)`,L`h=2R+\tfrac12R=\tfrac52R`],plug:L`h=2.5(${Rr})=${fmt(h)}\text{ m}`,ans:L`${fmt(h)}\text{ m}`})};
}},
{id:'E13',topic:'potential',name:'Force from potential energy: F = −dU/dx',gen(R){
  const A=R.pick([1,2,3,4]),B=R.pick([6,9,12,27]),x0=R.pick([0.5,1,1.5,2,3]);const F=-(3*A*x0*x0-B);const xe=Math.sqrt(B/(3*A));const askEq=R.f()<0.4;
  return {stem:askEq?L`A particle's potential energy is \(U(x)=${A}x^3-${B}x\) (J, x in m). Where (x > 0) is the particle in equilibrium?`:L`A particle's potential energy is \(U(x)=${A}x^3-${B}x\) (J, x in m). What is the force on it at \(x=${x0}\text{ m}\)? (+ means toward +x)`,
  fig:sceneUgraph(A,B),
  steps:[
   {kind:'mc',prompt:'Step 1: How do you get force from U(x)?',choices:[
     {t:L`\(F_x=-\dfrac{dU}{dx}\)`,ok:true,why:'Force = negative slope of the U graph. Things get pushed "downhill" on the U graph.'},
     {t:L`\(F_x=\dfrac{dU}{dx}\)`,ok:false,why:'You missed the minus sign. Force points toward LOWER potential energy.'},
     {t:L`\(F_x=\displaystyle\int U\,dx\)`,ok:false,why:'That goes the wrong direction. U = −∫F dx, so F = −dU/dx.'}]},
   {kind:'mc',prompt:'Step 2: Differentiate:',choices:[
     {t:L`\(F_x=-(${3*A}x^2-${B})\)`,ok:true,why:L`\(\dfrac{d}{dx}(${A}x^3)=${3*A}x^2\) and \(\dfrac{d}{dx}(${B}x)=${B}\).`},
     {t:L`\(F_x=-(${A}x^2-${B})\)`,ok:false,why:'Bring the exponent down: d/dx(Ax³) = 3Ax².'},
     {t:L`\(F_x=${3*A}x^2-${B}\)`,ok:false,why:'Don\'t forget the minus sign in front.'}]}],
  final:{prompt:askEq?L`Equilibrium: \(F=0 \Rightarrow x=\sqrt{\dfrac{${B}}{${3*A}}}\) (m):`:L`Plug in \(x=${x0}\) (N, with sign):`,ans:askEq?xe:F,unit:askEq?'m':'N'},
  solution:sol({principle:L`Conservative force from potential: \(F_x=-\dfrac{dU}{dx}\) (chain-rule / derivative skills)`,constraint:askEq?'Equilibrium: F = 0 (slope of U = 0)':null,
    lines:[L`F_x=-\dfrac{d}{dx}(${A}x^3-${B}x)=-(${3*A}x^2-${B})`,...(askEq?[L`0=${3*A}x^2-${B}\Rightarrow x=\sqrt{${B}/${3*A}}`]:[])],plug:askEq?L`x=${fmt(xe)}\text{ m}`:L`F=-(${3*A}(${x0})^2-${B})=${fmt(F)}\text{ N}`,ans:askEq?L`${fmt(xe)}\text{ m}`:L`${fmt(F)}\text{ N}`,
    note:askEq?'This one is a minimum of U (the bottom of a valley), so it is STABLE equilibrium.':''})};
}},
{id:'E14',topic:'work',name:'Power',gen(R){
  const m=R.pick([800,1000,1200,1500]),v=R.pick([10,15,20,25]),t=R.pick([5,8,10,12]);const P=0.5*m*v*v/t;
  return {stem:L`A \(${m}\text{ kg}\) car speeds up from rest to \(${v}\text{ m/s}\) in \(${t}\text{ s}\) on a level road. What average power does the engine deliver (ignore friction/drag)?`,
  steps:[{kind:'mc',prompt:'Step 1: Power is…',choices:[
     {t:L`\(P=\dfrac{W}{t}\) (and instant: \(P=\dfrac{dW}{dt}=\vec F\cdot\vec v\))`,ok:true,why:'Power is the rate of doing work.'},{t:L`\(P=W\cdot t\)`,ok:false,why:'Rate means divide by time.'},{t:L`\(P=Fd\)`,ok:false,why:'That\'s work.'}]}],
  final:{prompt:L`\(P_{avg}=\dfrac{\tfrac12mv^2}{t}\) (W):`,ans:P,unit:'W'},
  solution:sol({principle:L`Work-energy theorem + \(P=W/t\)`,constraint:'Starts from rest',assume:'No friction or drag',lines:[L`W=\Delta K=\tfrac12mv^2`,L`P=\dfrac{\tfrac12mv^2}{t}`],plug:L`P=\dfrac{\tfrac12(${m})(${v})^2}{${t}}=${fmt(P)}\text{ W}`,ans:L`${fmt(P)}\text{ W}`})};
}},
// ---------------- HARD (multi-concept) ----------------
{id:'H1',topic:'forces',hard:true,name:'★ Block on a rough incline pulled up by a hanging mass',gen(R){
  let m1,m2,th,mu,a;for(let i=0;i<80;i++){m1=R.int(2,8);m2=R.int(2,9);th=R.pick([20,25,30,35]);mu=R.step(0.1,0.3,0.05);a=(m2*G-m1*G*S(th)-mu*m1*G*C(th))/(m1+m2);if(a>0.4)break;}
  const T=m2*(G-a);const askT=R.f()<0.5;
  return {stem:L`A \(${m1}\text{ kg}\) block sits on a \(${th}^\circ\) incline (\(\mu_k=${mu}\)). A string runs from it UP the slope, over a pulley at the top, to a hanging \(${m2}\text{ kg}\) mass, which falls. Find ${askT?'the string tension':'the acceleration'}.`,
  steps:[
   {kind:'multi',prompt:'Step 1: Forces on the INCLINE block (it slides UP the slope):',options:[
     {t:L`Gravity \(m_1g\) straight down`,ok:true,why:'Always.'},{t:'Normal force, perpendicular to the ramp',ok:true,why:'From the ramp surface.'},
     {t:'Tension, up the slope',ok:true,why:'The string pulls it toward the pulley.'},{t:'Kinetic friction, DOWN the slope',ok:true,why:'It slides up, so friction points down the slope.'},
     {t:'Kinetic friction, up the slope',ok:false,why:'Friction opposes the sliding, which is UP here.'},{t:L`The hanging weight \(m_2g\)`,ok:false,why:'That acts on the hanging mass. It reaches this block only through T.'}],
    after:fbdSVG([{deg:270,len:70,label:'m₁g',color:COL.g},{deg:90+th,len:55,label:'N',color:COL.N},{deg:th,len:75,label:'T',color:COL.T},{deg:180+th,len:40,label:'fk',color:COL.f}],{tilt:th})},
   {kind:'mc',prompt:'Step 2: System along the string (hanging mass falling = +). Net force?',choices:[
     {t:L`\(m_2g-m_1g\sin\theta-\mu_km_1g\cos\theta\)`,ok:true,why:'The hanging weight drives it. The down-slope part of m₁g and friction both resist.'},
     {t:L`\(m_2g-m_1g-\mu_km_1g\)`,ok:false,why:'On the incline only m₁g sinθ resists along the string, and N = m₁g cosθ.'},
     {t:L`\(m_2g-m_1g\sin\theta+\mu_km_1g\cos\theta\)`,ok:false,why:'Friction resists the motion, so it subtracts.'}]}],
  final:{prompt:askT?L`\(a\) from the system, then \(T=m_2(g-a)\) (N):`:L`\(a=\dfrac{m_2g-m_1g(\sin\theta+\mu_k\cos\theta)}{m_1+m_2}\) (m/s²):`,ans:askT?T:a,unit:askT?'N':'m/s²'},
  solution:sol({principle:'Newton\'s 2nd law (system, then one object)',constraint:'Same |a| for both; m₁ slides up so friction is down-slope',assume:'Massless string, frictionless pulley',
    lines:[L`(m_1+m_2)a=m_2g-m_1g\sin\theta-\mu_km_1g\cos\theta`,L`T=m_2(g-a)`],plug:L`a=\dfrac{${m2}(9.8)-${m1}(9.8)(\sin${th}^\circ+${mu}\cos${th}^\circ)}{${m1+m2}}=${fmt(a)},\ T=${fmt(T)}\text{ N}`,ans:askT?L`${fmt(T)}\text{ N}`:L`${fmt(a)}\ \text{m/s}^2`})};
}},
{id:'H2',topic:'forces',hard:true,name:'★ Stacked blocks: max force before slipping',gen(R){
  const m1=R.pick([0.5,1,1.5,2]),m2=R.pick([2,3,4,5]),mu=R.pick([0.3,0.4,0.5,0.6]);const F=(m1+m2)*mu*G;
  return {stem:L`Block 1 (\(${m1}\text{ kg}\)) rests on block 2 (\(${m2}\text{ kg}\)) on a frictionless floor. \(\mu_s=${mu}\) between the blocks. A horizontal force F pulls block 2. What is the MAXIMUM F so the blocks don't slip?`,
  steps:[
   {kind:'mc',prompt:'Step 1: What accelerates the TOP block?',choices:[
     {t:'Static friction from block 2, pointing forward',ok:true,why:'It\'s the only horizontal force on block 1, so it must point in the direction block 1 accelerates.'},
     {t:'The force F',ok:false,why:'F touches only block 2.'},
     {t:'Nothing; it just rides along',ok:false,why:'To speed up it needs a net force.'}]},
   {kind:'mc',prompt:'Step 2: The largest acceleration the top block can have:',choices:[
     {t:L`\(a_{max}=\mu_sg\)`,ok:true,why:L`\(\mu_sm_1g=m_1a\). Mass cancels.`},
     {t:L`\(a_{max}=\mu_s g\,\dfrac{m_1}{m_2}\)`,ok:false,why:'Apply Newton to block 1 alone: friction μₛm₁g = m₁a.'},
     {t:L`\(a_{max}=g\)`,ok:false,why:'Static friction is limited to μₛN.'}]},
   {kind:'mc',prompt:'Step 3: Then F for the whole system:',choices:[
     {t:L`\(F=(m_1+m_2)a_{max}\)`,ok:true,why:'Moving together, the system has total mass m₁+m₂ and F is the only external horizontal force.'},
     {t:L`\(F=m_2a_{max}\)`,ok:false,why:'F accelerates both blocks together.'},
     {t:L`\(F=\mu_sm_1g\)`,ok:false,why:'That\'s just the friction on block 1.'}]}],
  final:{prompt:L`\(F_{max}=(m_1+m_2)\mu_sg\) (N):`,ans:F,unit:'N'},
  solution:sol({principle:'Newton\'s 2nd law on the top block, then the system',constraint:L`Verge of slipping: \(f_s=\mu_sm_1g\)`,lines:[L`\mu_sm_1g=m_1a\Rightarrow a=\mu_sg`,L`F=(m_1+m_2)\mu_sg`],plug:L`F=(${m1+m2})(${mu})(9.8)=${fmt(F)}\text{ N}`,ans:L`${fmt(F)}\text{ N}`})};
}},
{id:'H3',topic:'circular',hard:true,name:'★ Banked curve WITH friction: max speed',gen(R){
  let th,mu;do{th=R.pick([10,15,20,25,30]);mu=R.pick([0.1,0.2,0.3,0.4,0.5]);}while(C(th)-mu*S(th)<=0.2);
  const r=R.pick([50,80,100,150,200]);const v=Math.sqrt(r*G*(S(th)+mu*C(th))/(C(th)-mu*S(th)));
  return {stem:L`A curve of radius \(${r}\text{ m}\) is banked at \(${th}^\circ\). \(\mu_s=${mu}\). What is the MAXIMUM speed a car can take the curve without sliding up/out?`,fig:sceneBank(th),
  steps:[
   {kind:'mc',prompt:'Step 1: At the max speed the car is about to slide OUT (up the bank). Which way does static friction point?',choices:[
     {t:'Down the slope (toward the inside)',ok:true,why:'Friction opposes the slipping, which would be up and out.'},
     {t:'Up the slope',ok:false,why:'That\'s for the MINIMUM speed (car about to slide down).'},
     {t:'There\'s no friction on a banked curve',ok:false,why:'Banking reduces the friction needed, but at max speed friction helps.'}]},
   {kind:'mc',prompt:'Step 2: Horizontal (toward center) and vertical equations:',choices:[
     {t:L`\(N\sin\theta+\mu_sN\cos\theta=\dfrac{mv^2}{r},\quad N\cos\theta-\mu_sN\sin\theta=mg\)`,ok:true,why:'The down-slope friction has an inward part (μN cosθ) and a downward part (μN sinθ).'},
     {t:L`\(N\sin\theta=\dfrac{mv^2}{r},\quad N\cos\theta=mg\)`,ok:false,why:'That\'s the no-friction design speed.'},
     {t:L`\(N\sin\theta+\mu_sN\cos\theta=\dfrac{mv^2}{r},\quad N\cos\theta+\mu_sN\sin\theta=mg\)`,ok:false,why:'Friction pointing down the slope has a DOWNWARD vertical part, so it subtracts from the vertical support.'}]}],
  final:{prompt:L`Divide: \(v^2=rg\,\dfrac{\sin\theta+\mu_s\cos\theta}{\cos\theta-\mu_s\sin\theta}\) (m/s):`,ans:v,unit:'m/s'},
  solution:sol({principle:'Newton\'s 2nd law, horizontal (radial) and vertical axes',constraint:L`About to slip outward: \(f_s=\mu_sN\) down the slope`,assume:'Car as a point',lines:[L`N(\sin\theta+\mu_s\cos\theta)=\dfrac{mv^2}{r}`,L`N(\cos\theta-\mu_s\sin\theta)=mg`,L`v=\sqrt{rg\,\dfrac{\sin\theta+\mu_s\cos\theta}{\cos\theta-\mu_s\sin\theta}}`],plug:L`v=${fmt(v)}\text{ m/s}`,ans:L`${fmt(v)}\text{ m/s}`})};
}},
{id:'H4',topic:'circular',hard:true,name:'★ Pendulum: tension at ANY angle on the swing',gen(R){
  const m=R.pick([0.2,0.5,1,2]),Lp=R.pick([0.5,1,1.5,2]),th0=R.pick([50,60,70,80]);const ph=R.pick([10,20,30,40].filter(p=>p<th0-5));
  const v2=2*G*Lp*(C(ph)-C(th0));const T=m*G*C(ph)+m*v2/Lp;
  return {stem:L`A \(${m}\text{ kg}\) bob on a \(${Lp}\text{ m}\) string is released from rest at \(${th0}^\circ\) from vertical. Find the tension when the string is at \(${ph}^\circ\) from vertical (on the way down).`,fig:scenePendulum(ph),
  steps:[
   {kind:'mc',prompt:'Step 1 (energy): speed at angle φ:',choices:[
     {t:L`\(v^2=2gL(\cos\varphi-\cos\theta_0)\)`,ok:true,why:L`Height dropped = \(L\cos\varphi-L\cos\theta_0\).`},
     {t:L`\(v^2=2gL(1-\cos\theta_0)\)`,ok:false,why:'That\'s the speed at the BOTTOM, not at φ.'},
     {t:L`\(v^2=2gL(\cos\theta_0-\cos\varphi)\)`,ok:false,why:'That\'s negative. Lower down means cos φ is bigger.'}]},
   {kind:'mc',prompt:'Step 2 (radial Newton at φ): the part of gravity along the string points AWAY from the center:',choices:[
     {t:L`\(T-mg\cos\varphi=\dfrac{mv^2}{L}\)`,ok:true,why:'Toward the pivot = +. T is +, and the string-direction part of gravity (mg cosφ) points away.'},
     {t:L`\(T-mg=\dfrac{mv^2}{L}\)`,ok:false,why:'Only at the bottom (φ = 0). Use the component along the string.'},
     {t:L`\(T-mg\sin\varphi=\dfrac{mv^2}{L}\)`,ok:false,why:'mg sinφ is the TANGENTIAL part (it speeds the bob up). The radial part is mg cosφ.'}]}],
  final:{prompt:L`\(T=mg(3\cos\varphi-2\cos\theta_0)\) (N):`,ans:T,unit:'N'},
  solution:sol({principle:'Energy conservation + Newton radial',constraint:'Released from rest at θ₀',assume:'Massless string, no air',lines:[L`v^2=2gL(\cos\varphi-\cos\theta_0)`,L`T-mg\cos\varphi=\dfrac{mv^2}{L}`,L`T=mg(3\cos\varphi-2\cos\theta_0)`],plug:L`T=(${m})(9.8)(3\cos${ph}^\circ-2\cos${th0}^\circ)=${fmt(T)}\text{ N}`,ans:L`${fmt(T)}\text{ N}`})};
}},
{id:'H5',topic:'energy',hard:true,name:'★ Spring launch up a rough incline: distance',gen(R){
  const m=R.pick([0.2,0.5,1]),k=R.pick([200,400,600,800]),x=R.pick([0.05,0.1,0.15]),th=R.pick([20,30,37]),mu=R.pick([0.1,0.2,0.3]);const s=k*x*x/(2*m*G*(S(th)+mu*C(th)));
  if(s<=x) return GENS.find(g=>g.id==='H5').gen(mkR(Math.floor(R.f()*1e9)));
  return {stem:L`A spring (\(k=${k}\text{ N/m}\)) at the bottom of a \(${th}^\circ\) incline is compressed \(${x}\text{ m}\) by a \(${m}\text{ kg}\) block and released. \(\mu_k=${mu}\) everywhere. How far up the slope (measured from the release point) does the block go?`,fig:sceneIncline(th,{spring:true,pos:0.2}),
  steps:[
   {kind:'multi',prompt:'Step 1: Bar chart from release to the highest point. Non-zero bars?',options:[
     {t:L`\(U_s\) initial`,ok:true,why:'Compressed spring.'},{t:L`\(U_g\) final`,ok:true,why:'It ends higher (Ug = 0 at release).'},{t:L`\(\Delta E_{th}\)`,ok:true,why:'Friction over the whole distance s.'},{t:L`\(K\) final`,ok:false,why:'At the highest point it stops.'},{t:L`\(U_s\) final`,ok:false,why:'It left the spring (s > x).'}],
    after:barChart({Us0:5,Ug1:3,Eth:2,lbl:{Us0:'½kx²',Ug1:'mgs sinθ',Eth:'μmg cosθ s'}})},
   {kind:'mc',prompt:'Step 2: Equation:',choices:[
     {t:L`\(\tfrac12kx^2=mgs\sin\theta+\mu_kmg\cos\theta\,s\)`,ok:true,why:'One term per bar.'},
     {t:L`\(\tfrac12kx^2=mgs\sin\theta\)`,ok:false,why:'You left out the friction bar.'},
     {t:L`\(\tfrac12kx^2=mgs\sin\theta+\mu_kmg\,s\)`,ok:false,why:'On a ramp N = mg cosθ.'}]}],
  final:{prompt:L`\(s=\dfrac{kx^2}{2mg(\sin\theta+\mu_k\cos\theta)}\) (m):`,ans:s,unit:'m'},
  solution:sol({principle:'Energy conservation with friction',constraint:'Starts and ends at rest',assume:'Ideal spring',lines:[L`\tfrac12kx^2=mgs(\sin\theta+\mu_k\cos\theta)`,L`s=\dfrac{kx^2}{2mg(\sin\theta+\mu_k\cos\theta)}`],plug:L`s=\dfrac{(${k})(${x})^2}{2(${m})(9.8)(\sin${th}^\circ+${mu}\cos${th}^\circ)}=${fmt(s)}\text{ m}`,ans:L`${fmt(s)}\text{ m}`})};
}},
{id:'H6',topic:'drag',hard:true,name:'★ Quadratic drag −cv² coasting (calculus)',gen(R){
  const m=R.pick([0.5,1,2,5]),c=R.pick([0.05,0.1,0.2,0.5]),v0=R.pick([10,20,30]),t=R.pick([1,2,5,10]);const v=v0/(1+c*v0*t/m);
  return {stem:L`A \(${m}\text{ kg}\) puck coasts on a horizontal surface with only air drag \(F=-cv^2\), \(c=${c}\text{ kg/m}\). It starts at \(${v0}\text{ m/s}\). Find its speed at \(t=${t}\text{ s}\).`,
  steps:[
   {kind:'mc',prompt:'Step 1: Separate variables in \(-cv^2=m\,dv/dt\):',choices:[
     {t:L`\(\displaystyle\int_{v_0}^{v}\frac{dv}{v^2}=-\frac cm\int_0^tdt\)`,ok:true,why:'Divide both sides by m v².'},
     {t:L`\(\displaystyle\int\frac{dv}{v}=-\frac cm\int dt\)`,ok:false,why:'That\'s for linear drag. Here it\'s v².'},
     {t:'Use v = v₀ + at',ok:false,why:'a is not constant.'}]},
   {kind:'mc',prompt:'Step 2: Integrate:',choices:[
     {t:L`\(\dfrac1v-\dfrac1{v_0}=\dfrac cmt\Rightarrow v=\dfrac{v_0}{1+cv_0t/m}\)`,ok:true,why:L`\(\int v^{-2}dv=-v^{-1}\).`},
     {t:L`\(v=v_0e^{-ct/m}\)`,ok:false,why:'That\'s the linear-drag answer.'},
     {t:L`\(\ln\dfrac{v}{v_0}=-\dfrac cm t\)`,ok:false,why:'The integral of 1/v² is −1/v, not ln v.'}]}],
  final:{prompt:L`\(v=\dfrac{v_0}{1+cv_0t/m}\) (m/s):`,ans:v,unit:'m/s'},
  solution:sol({principle:L`\(\Sigma F=m\,dv/dt\)`,constraint:L`\(v(0)=v_0\)`,lines:[L`-cv^2=m\dfrac{dv}{dt}`,L`\int_{v_0}^{v}v^{-2}dv=-\dfrac cm\int_0^tdt`,L`-\dfrac1v+\dfrac1{v_0}=-\dfrac cmt\Rightarrow v=\dfrac{v_0}{1+cv_0t/m}`],plug:L`v=\dfrac{${v0}}{1+(${c})(${v0})(${t})/${m}}=${fmt(v)}\text{ m/s}`,ans:L`${fmt(v)}\text{ m/s}`})};
}},
{id:'H7',topic:'work',hard:true,name:'★ Variable force + friction: final speed',gen(R){
  let m,b,D,mu,K;for(let i=0;i<50;i++){m=R.pick([1,2,3]);b=R.pick([2,3,4,6]);D=R.pick([2,3,4]);mu=R.pick([0.1,0.2,0.3]);K=b*D**3/3-mu*m*G*D;if(K>2)break;}
  const v=Math.sqrt(2*K/m);
  return {stem:L`A \(${m}\text{ kg}\) box starts at rest at \(x=0\) on a rough floor (\(\mu_k=${mu}\)). A horizontal force \(F(x)=${b}x^2\) (N) pushes it to \(x=${D}\text{ m}\). Find its speed there.`,
  steps:[
   {kind:'mc',prompt:'Step 1: Work done by F:',choices:[
     {t:L`\(W_F=\int_0^D bx^2dx=\tfrac{bD^3}{3}\)`,ok:true,why:'Variable force → integrate.'},{t:L`\(W_F=bD^2\cdot D\)`,ok:false,why:'That uses the final force for the whole distance.'},{t:L`\(W_F=2bD\)`,ok:false,why:'That\'s the derivative.'}]},
   {kind:'mc',prompt:'Step 2: Work-energy:',choices:[
     {t:L`\(\tfrac{bD^3}{3}-\mu_kmgD=\tfrac12mv^2\)`,ok:true,why:'Net work = ΔK. Friction does negative work μmgD.'},{t:L`\(\tfrac{bD^3}{3}=\tfrac12mv^2\)`,ok:false,why:'You forgot friction.'},{t:L`\(\tfrac{bD^3}{3}+\mu_kmgD=\tfrac12mv^2\)`,ok:false,why:'Friction takes energy away.'}]}],
  final:{prompt:'Speed at x = D (m/s):',ans:v,unit:'m/s'},
  solution:sol({principle:L`Work-energy theorem \(W_{net}=\Delta K\)`,constraint:'Starts at rest',lines:[L`\int_0^Dbx^2dx-\mu_kmgD=\tfrac12mv^2`,L`v=\sqrt{\dfrac{2}{m}\left(\dfrac{bD^3}{3}-\mu_kmgD\right)}`],plug:L`v=\sqrt{\dfrac{2}{${m}}\left(\dfrac{${b}(${D})^3}{3}-(${mu})(${m})(9.8)(${D})\right)}=${fmt(v)}\text{ m/s}`,ans:L`${fmt(v)}\text{ m/s}`})};
}},
];
const TOPICS = {forces:'Forces & FBDs',drag:'Drag (calculus)',circular:'Circular motion',work:'Work & power',energy:'Energy bar charts',springs:'Springs',potential:'U(x) & F = −dU/dx'};
