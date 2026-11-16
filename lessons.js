// ===== Learn lessons =====
const yt=(id,title,ch,len)=>`<div class="vid"><div class="vwrap"><iframe referrerpolicy="strict-origin-when-cross-origin" src="https://www.youtube-nocookie.com/embed/${id}?rel=0" title="${title}" allowfullscreen allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"></iframe></div><div class="vcap">▶ ${title} · ${ch} · ${len} · <a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">open on YouTube</a></div></div>`;
const LESSONS=[
{id:'L0',topic:'method',title:'0. How to "get the equations" (read this first)',body:L`
<p class="big">Physics problems feel impossible when you stare at them and try to remember a formula. Ms. Lee's tests don't work that way. You <b>build</b> the equation from one starting principle every time. There are only a few starting principles in this unit.</p>
<h3>Step A: Pick the principle from what they ask for</h3>
<table class="tbl"><tr><th>If the question asks for…</th><th>Start with</th><th>First thing you draw</th></tr>
<tr><td>a force (tension, normal, friction), acceleration, μ, an angle to hold something still</td><td><b>Newton's 2nd law</b>: \(\Sigma F = ma\) on each axis</td><td>Free body diagram (FBD)</td></tr>
<tr><td>anything moving in a circle (tension at the top, max speed on a curve, orbit speed)</td><td><b>Newton's 2nd law, radial</b>: \(\Sigma F_{\to\text{center}} = \dfrac{mv^2}{r}\)</td><td>FBD at that one point</td></tr>
<tr><td>a speed, height, distance, or spring compression, and there's NO time in the problem</td><td><b>Energy conservation</b>: \(K_i+U_i+W=K_f+U_f+\Delta E_{th}\)</td><td>Energy bar chart</td></tr>
<tr><td>how much work a force does</td><td><b>Definition of work</b>: \(W=\vec F\cdot\vec d\) or \(\int F\,dx\)</td><td>Picture of the force vs. displacement</td></tr>
<tr><td>a time, with constant force</td><td>Newton → a, then <b>kinematics</b></td><td>FBD</td></tr>
<tr><td>v(t) when the force depends on v (drag −bv)</td><td>Newton as a <b>differential equation</b> \(\Sigma F = m\frac{dv}{dt}\)</td><td>FBD</td></tr>
</table>
<h3>Step B: Write it the way Ms. Lee grades it</h3>
<div class="recipe"><ol>
<li><b>Principle:</b> write the starting equation in words/symbols (e.g. "Newton's 2nd law: ΣF<sub>y</sub> = ma<sub>y</sub>").</li>
<li><b>Constraint</b> (what MUST be true): e.g. "at rest so a = 0", "about to slip so f<sub>s</sub> = μ<sub>s</sub>N", "loses contact so N = 0", "starts from rest so K<sub>i</sub> = 0".</li>
<li><b>Assumptions</b> (simplifications): massless rope, frictionless pulley, no air resistance.</li>
<li><b>Derive with symbols only.</b> Replace each term with what it really is (e.g. \(f_k\to\mu_kN\), \(N\to mg\cos\theta\)). Solve for the unknown.</li>
<li><b>Plug in numbers LAST</b>, with units. Check: does the answer make sense? (sign, size, units)</li>
</ol></div>
<p class="note">Her Sept 18 lab announcement said it directly: <i>"Calculations should always begin with relevant principles or equations, required conditions (i.e. what must be true), and reasonable assumptions. Numbers should only be plugged in at the end."</i> Problem Set 14 also warned: <i>don't confuse constraints with assumptions.</i></p>
<h3>The one-sentence version</h3>
<p class="big">Draw the picture (FBD or bar chart). <b>Each arrow or each bar turns into one term</b> in the equation. Then solve.</p>
`},
{id:'L1',topic:'forces',title:'1. Free body diagrams: which forces are real?',body:L`
${yt('pA9Uc_rJNiA','5 Steps to Help Solve any Free Body Diagram Problem','Flipping Physics','4 min')}
<p class="big">An FBD shows the object as a dot or box with an arrow for every force acting ON it. Nothing else goes on it.</p>
<h3>The "touch test" (how to never miss a force)</h3>
<div class="recipe"><ol><li>Gravity: always draw \(mg\) straight down.</li><li>Look at everything <b>touching</b> the object. Each thing touching it gives a force: a surface gives a normal force (+ friction if rough), a rope gives tension, a spring gives a spring force, air gives drag.</li><li>Nothing touching it = no more forces. Done.</li></ol></div>
<table class="tbl"><tr><th>Force</th><th>Direction</th><th>Size</th></tr>
<tr><td>Gravity (weight)</td><td>straight down, always</td><td>\(mg\)</td></tr>
<tr><td>Normal \(N\)</td><td>perpendicular to (out of) the surface</td><td>whatever it needs to be. <b>Solve for it</b>, don't assume mg</td></tr>
<tr><td>Tension \(T\)</td><td>along the rope, away from the object (ropes only pull)</td><td>solve for it</td></tr>
<tr><td>Kinetic friction \(f_k\)</td><td>parallel to surface, opposite the sliding</td><td>\(\mu_kN\)</td></tr>
<tr><td>Static friction \(f_s\)</td><td>parallel to surface, opposite the way it WOULD slide</td><td>\(\le\mu_sN\) (equal only when about to slip)</td></tr>
<tr><td>Spring</td><td>back toward the natural length</td><td>\(kx\)</td></tr>
<tr><td>Drag</td><td>opposite the velocity</td><td>e.g. \(bv\)</td></tr></table>
<h3>NOT forces (never draw these)</h3>
<div class="trap"><ul><li><b>"ma"</b>: that's the RESULT of the forces.</li><li><b>"Centripetal force"</b>: that's the name for the net force toward the center. It is made of tension/gravity/normal/friction.</li><li><b>"Force of motion" / "inertia force"</b>: moving at constant velocity needs NO force (DQ15 #5: lowering a notebook at constant speed, your hand pushes UP).</li><li><b>"Centrifugal force"</b>: doesn't exist in our frame. You feel it because you want to go straight.</li><li><b>mg sinθ as an extra arrow</b>: that's a piece of gravity. Don't draw it twice.</li></ul></div>
<h3>Newton's 3rd law pairs</h3>
<p>"A pushes B" ↔ "B pushes A". Same size, opposite direction, same type, on <b>different objects</b>, so they never both appear on one FBD. The partner of your weight (Earth pulls you) is <b>you pull Earth</b>, not the normal force. Truck vs. car crash: equal forces, and the car accelerates more (a = F/m).</p>
<div class="ex"><b>Example:</b> a book at rest on a table. Forces: gravity mg (down), normal N from the table (up). Since a = 0, N = mg. <br>${fbdSVG([{deg:270,len:65,label:'mg',color:COL.g},{deg:90,len:65,label:'N',color:COL.N}])}</div>
`},
{id:'L2',topic:'forces',title:'2. FBD → equations (ΣF = ma on each axis)',body:L`
<p class="big">This is the part you said you're stuck on. It's the same 4 moves every time.</p>
<div class="recipe"><ol>
<li><b>Pick axes.</b> Put one axis ALONG the acceleration (direction of speeding up or turning). Pick + direction. On a flat floor: x horizontal, y vertical. On a ramp: tilt them (lesson 3). In a circle: one axis toward the center (lesson 5).</li>
<li><b>Break angled forces into components.</b> The side of the triangle <b>touching the angle</b> gets \(\cos\). The side across from it gets \(\sin\).</li>
<li><b>Write \(\Sigma F_x = ma_x\) and \(\Sigma F_y = ma_y\).</b> Go arrow by arrow: + if it points the + way, − if not. If the object doesn't accelerate along an axis, that side is 0.</li>
<li><b>Substitute</b> (\(f=\mu N\), the N you found from the other axis, etc.) and solve in symbols.</li></ol></div>
<div class="ex"><b>Worked example (like the Pivot lab / PS problems).</b> A \(10\text{ kg}\) box is pulled by a rope at \(30^\circ\) above horizontal with \(T=50\text{ N}\). \(\mu_k=0.20\). Find a.
<div class="row">${sceneFloorPull(30)} ${fbdSVG([{deg:270,len:75,label:'mg',color:COL.g},{deg:90,len:55,label:'N',color:COL.N},{deg:30,len:80,label:'T',color:COL.T},{deg:180,len:45,label:'fk',color:COL.f}])}</div>
<p><b>Components of T:</b> the angle touches the horizontal, so \(T_x = T\cos30^\circ\) and \(T_y=T\sin30^\circ\).</p>
${sol({principle:L`Newton's 2nd law on x and y`,constraint:L`No vertical acceleration (\(a_y=0\)); sliding so \(f_k=\mu_kN\)`,assume:'Massless rope',lines:[L`y:\ N+T\sin\theta-mg=0\ \Rightarrow\ N=mg-T\sin\theta`,L`x:\ T\cos\theta-\mu_kN=ma`,L`a=\dfrac{T\cos\theta-\mu_k(mg-T\sin\theta)}{m}`],plug:L`a=\dfrac{50\cos30^\circ-0.2(98-50\sin30^\circ)}{10}=\dfrac{43.3-14.6}{10}=2.87\text{ m/s}^2`,ans:L`2.87\text{ m/s}^2`})}
<p class="note">Notice N is NOT mg (it's 73 N, not 98 N). The rope lifts a little. This is the #1 mistake on tests.</p></div>
<h3>Sanity checks that catch mistakes</h3>
<ul><li>Set θ = 0 in your answer. Does it turn into the easy case? (Here: \(a=(T-\mu mg)/m\). ✓)</li><li>Units: N/kg = m/s². ✓</li><li>Sign: is a positive (speeding up the way you said)?</li></ul>
`},
{id:'L3',topic:'forces',title:'3. Inclines (ramps)',body:L`
${yt('eUpZ0yyFNyc','Introductory Kinetic Friction on an Incline Problem','Flipping Physics','7 min')}
<p class="big">On a ramp, <b>tilt your axes</b>: one along the slope (that's where it accelerates), one perpendicular to it. Then only gravity needs to be broken up.</p>
<div class="row">${sceneIncline(30)} ${fbdSVG([{deg:270,len:75,label:'mg',color:COL.g},{deg:120,len:60,label:'N',color:COL.N},{deg:30,len:45,label:'fk',color:COL.f}],{tilt:30})}</div>
<table class="tbl"><tr><th>Piece of gravity</th><th>Formula</th><th>Check at θ = 0 (flat)</th></tr>
<tr><td>along the slope (pulls it down the ramp)</td><td>\(mg\sin\theta\)</td><td>sin 0 = 0 ✓ (flat ground doesn't pull you sideways)</td></tr>
<tr><td>into the ramp</td><td>\(mg\cos\theta\)</td><td>cos 0 = 1 ✓ (all of gravity presses down)</td></tr></table>
<p>So perpendicular: \(N = mg\cos\theta\) (if nothing else pushes). Along: write ΣF = ma.</p>
<div class="ex"><b>Three classic results (derive them, don't memorize):</b>
<ul><li>Frictionless: \(mg\sin\theta=ma\Rightarrow a=g\sin\theta\)</li>
<li>Sliding down with friction: \(mg\sin\theta-\mu_kmg\cos\theta=ma\Rightarrow a=g(\sin\theta-\mu_k\cos\theta)\)</li>
<li>Just about to slip (static): \(\mu_smg\cos\theta=mg\sin\theta\Rightarrow\mu_s=\tan\theta\)</li></ul>
Mass cancels in all three!</div>
<div class="trap"><b>Traps:</b> N is not mg. Friction direction = opposite the sliding (moving UP the ramp, friction points DOWN). A cart shoved up a frictionless ramp has a = g sin θ <b>down the slope the whole time</b>, even at the top where v = 0 (DQ15 #41).</div>
`},
{id:'L4',topic:'forces',title:'4. Connected objects (pulleys, Atwood machines)',body:L`
${yt('a0KVxh8iPP4','AP Physics - Atwood Machines','Dan Fullerton (APlusPhysics)','6.5 min')}
<p class="big">Two ways, and Ms. Lee wants you to see both (Pivot Modified Atwood lab: "compare the two-block system vs. the one-block systems").</p>
<div class="row">${sceneTablePulley('m₂','m₁')} ${sceneAtwood('m₁','m₂')}</div>
<div class="recipe"><b>Method 1: system (fast way to get a).</b> Pretend the string is straight and both blocks are one object. Tension is <b>internal</b>, so it cancels.
\[a=\frac{\text{forces that drive it} - \text{forces that resist it}}{\text{total mass}}\]
<b>Method 2: one block at a time (needed for T).</b> Draw an FBD for each block, write ΣF = ma for each, and use the SAME a (the string doesn't stretch). Adding the equations makes T cancel, which gives Method 1 again.</div>
<table class="tbl"><tr><th>Setup</th><th>a</th><th>T</th></tr>
<tr><td>Atwood (two hanging, \(m_1\gt m_2\))</td><td>\(\dfrac{(m_1-m_2)g}{m_1+m_2}\)</td><td>\(\dfrac{2m_1m_2g}{m_1+m_2}\)</td></tr>
<tr><td>Table block \(m_2\) (μ<sub>k</sub>) + hanging \(m_1\)</td><td>\(\dfrac{(m_1-\mu_km_2)g}{m_1+m_2}\)</td><td>\(m_1(g-a)\)</td></tr>
<tr><td>Same, staying at rest</td><td>0</td><td>\(T=m_1g\); need \(\mu_s\ge m_1/m_2\)</td></tr></table>
<div class="trap"><b>Traps:</b> T ≠ weight of the hanging block unless a = 0 (it's LESS when it falls). The hanging block's a is less than g (DQ15 #34). A rope with mass hanging vertically: the top has more tension than the bottom (PS16 #1). A massless/horizontal rope has the same tension at both ends.</div>
`},
{id:'L5',topic:'circular',title:'5. Circular motion: ΣF toward center = mv²/r',body:L`
${yt('A2KGtarD4bI','Introductory Centripetal Force Problem - Car over a Hill','Flipping Physics','7.5 min')}
<p class="big">Anything moving in a circle is accelerating toward the center: \(a_c=\dfrac{v^2}{r}=\omega^2r\). So the <b>net force toward the center</b> must equal \(\dfrac{mv^2}{r}\).</p>
<div class="recipe"><ol><li>Draw the FBD at the ONE point they ask about (top, bottom, crest…). Real forces only. No centripetal arrow!</li><li>Toward the center = +.</li><li>\(\Sigma F_{\to c}=\dfrac{mv^2}{r}\). Forces pointing in are +, out are −.</li><li>If there's a "barely/maximum/minimum/without falling off" word, it's a <b>constraint</b>: set N = 0 or T = 0 or \(f_s=\mu_sN\).</li></ol></div>
<table class="tbl"><tr><th>Situation</th><th>Equation</th><th>Result</th></tr>
<tr><td>Bottom of a swing/vertical circle (PS13 #4)</td><td>\(T-mg=\frac{mv^2}{r}\)</td><td>T > mg</td></tr>
<tr><td>Top of a vertical circle (string)</td><td>\(T+mg=\frac{mv^2}{r}\)</td><td>min speed (T = 0): \(v=\sqrt{gr}\)</td></tr>
<tr><td>Crest of a hill (DQ15 #37-38)</td><td>\(mg-N=\frac{mv^2}{R}\)</td><td>N < mg; max speed \(\sqrt{gR}\)</td></tr>
<tr><td>Flat curve</td><td>\(f_s=\frac{mv^2}{r}\), \(f_s\le\mu_smg\)</td><td>\(v_{max}=\sqrt{\mu_sgr}\)</td></tr>
<tr><td>Banked curve, no friction</td><td>\(N\cos\theta=mg,\ N\sin\theta=\frac{mv^2}{r}\)</td><td>\(\tan\theta=\frac{v^2}{rg}\)</td></tr>
<tr><td>Conical pendulum / swing ride (PS13 #5, Pivot airplane)</td><td>\(T\cos\theta=mg,\ T\sin\theta=\frac{mv^2}{r}\), \(r=L\sin\theta\)</td><td>\(v=\sqrt{gL\sin\theta\tan\theta}\)</td></tr>
<tr><td>Orbit (PS13 #2)</td><td>\(\frac{GMm}{r^2}=\frac{mv^2}{r}\)</td><td>\(v=\sqrt{GM/r}\) (farther = slower)</td></tr>
<tr><td>Spinning space station (PS13 #3)</td><td>\(\omega^2r=g\)</td><td>\(r=g/\omega^2\), \(\omega=\frac{2\pi\cdot\text{rpm}}{60}\)</td></tr></table>
${yt('NfhGH68AVMs','Conical Pendulum Demonstration and Problem','Flipping Physics','9 min')}
<div class="ex"><b>Worked: PS13 #5 swing ride</b> (179 kg, 15 m cable, 60° from vertical).
<div class="row">${sceneConical(60)} ${fbdSVG([{deg:150,len:85,label:'T',color:COL.T},{deg:270,len:60,label:'mg',color:COL.g}],{accel:180})}</div>
${sol({principle:'Newton\'s 2nd law, vertical (a = 0) and horizontal (toward center)',constraint:L`Horizontal circle, \(r=L\sin\theta\)`,assume:'Massless cable, ignore pole radius',lines:[L`T\cos\theta=mg\Rightarrow T=\dfrac{mg}{\cos\theta}`,L`T\sin\theta=\dfrac{mv^2}{L\sin\theta}`,L`\tan\theta=\dfrac{v^2}{gL\sin\theta}\Rightarrow v=\sqrt{gL\sin\theta\tan\theta}`],plug:L`T=\dfrac{179(9.8)}{\cos60^\circ}=3510\text{ N},\quad v=\sqrt{9.8(15\sin60^\circ)\tan60^\circ}=14.9\text{ m/s}`,ans:L`T=3510\text{ N},\ v=14.9\text{ m/s}`})}
These match the answers printed on PS13.</div>
<div class="trap"><b>Traps:</b> At constant speed in a vertical circle, the ACCELERATION is the same size everywhere (v²/r). It's the TENSION that changes (DQ15 #4). The Moon doesn't crash because it's moving sideways fast enough to keep missing (DQ15 #11). "Flat earth" g = 9.8 only works near the surface; for orbits use GMm/r² (PS14 hint).</div>
`},
{id:'L6',topic:'drag',title:'6. Drag force −bv (the calculus part)',body:L`
${yt('na5oPHrHL5Q','How to Derive Velocity With Linear Drag | AP Physics C','The Physics Universe','5.5 min')}
<p class="big">When a force depends on v, acceleration is NOT constant, so kinematics equations are banned (DQ15 #28). Instead, write Newton's law with \(a=\dfrac{dv}{dt}\) and separate variables.</p>
<div class="recipe"><b>Separation of variables recipe</b><ol><li>FBD → \(\Sigma F = m\dfrac{dv}{dt}\)</li><li>Move every v (and dv) to one side and every t (and dt) to the other.</li><li>Integrate both sides with limits (\(v_0\to v\), \(0\to t\)).</li><li>Solve for v. Logs become exponentials.</li></ol></div>
<div class="ex"><b>Coasting car (PS14 #1):</b> only force is \(-bv\).
${sol({principle:L`\(\Sigma F=m\,dv/dt\)`,constraint:L`\(v(0)=v_0\)`,lines:[L`-bv=m\dfrac{dv}{dt}`,L`\int_{v_0}^v\dfrac{dv}{v}=-\dfrac bm\int_0^tdt`,L`\ln\dfrac{v}{v_0}=-\dfrac{bt}{m}\Rightarrow v=v_0e^{-bt/m}`],plug:L`v(10)=25e^{-(20)(10)/1500}=21.9\text{ m/s}`,ans:L`21.9\text{ m/s}`})}</div>
<div class="ex"><b>Falling with drag (coffee filters lab):</b> \(mg-bv=m\dfrac{dv}{dt}\).
<ul><li>Terminal velocity: speed stops changing, so \(dv/dt=0\Rightarrow v_T=\dfrac{mg}{b}\)</li><li>Full solution (from rest): \(v(t)=\dfrac{mg}{b}\left(1-e^{-bt/m}\right)\)</li><li>Graph: starts with slope g, then curves and flattens at \(v_T\).</li></ul></div>
`},
{id:'L7',topic:'work',title:'7. Work (and power)',body:L`
${yt('DZxXiaeiSEE','AP Physics C - Work','Dan Fullerton (APlusPhysics)','13 min')}
<p class="big">Work = how much a force helps or fights the motion: \(W=\vec F\cdot\Delta\vec r=Fd\cos\theta\), where θ is the angle between the force and the displacement.</p>
<table class="tbl"><tr><th>Angle</th><th>Work</th><th>Example</th></tr>
<tr><td>0° (same direction)</td><td>+Fd</td><td>pushing a cart forward</td></tr>
<tr><td>90°</td><td>0</td><td>normal force on a sliding box; tension in a pendulum; gravity on a horizontal move</td></tr>
<tr><td>180°</td><td>−Fd</td><td>kinetic friction; brakes</td></tr></table>
<h3>Variable force: integrate</h3>
<p>\(W=\displaystyle\int_{x_1}^{x_2}F(x)\,dx\) = <b>area under the F vs x graph</b>. Example (PS19 #5): \(F=bx^2\) from 0 to D gives \(W=\tfrac{bD^3}{3}\); from 0 to 2D gives \(\tfrac{b(2D)^3}{3}=8W\).</p>
<h3>Gravity's work only cares about height</h3>
<p>\(W_g=-mg\Delta y\). Any path, same answer (PS19 #4: three paths → same work). Full Ferris wheel turn → \(W_g=0\) (PS18 #1). Longer frictionless ramp → same work \(mgh\), just less force over more distance (PS18 #3).</p>
<h3>Power</h3><p>\(P=\dfrac{dW}{dt}\) (average \(W/t\)), and \(P=\vec F\cdot\vec v\). Units: watts = J/s.</p>
<div class="ex"><b>Worked (PS18 #4):</b> 16 N at 25° pushes a block 2.2 m on a frictionless table. \(W=Fd\cos\theta=(16)(2.2)\cos25^\circ=31.9\text{ J}\). (The block's 2.5 kg mass doesn't matter for this.)</div>
`},
{id:'L8',topic:'work',title:'8. Kinetic energy & the work-energy theorem',body:L`
${yt('MR8jQZLcHKM','Work and Kinetic Energy - Physics','The Organic Chemistry Tutor','13 min')}
<p class="big">\(K=\tfrac12mv^2\), and the <b>net</b> work on an object equals its change in kinetic energy: \(W_{net}=\Delta K\).</p>
<div class="ex"><b>PS18 #2:</b> cars of 1200 kg and 2000 kg both go 0 → 40 m/s. Extra work for B = \(\tfrac12(2000-1200)(40)^2=640{,}000\text{ J}\).</div>
<h3>Ratio questions (Energy Lab Exercises): the trick</h3>
<div class="recipe"><ol><li>Write the energy equation in symbols.</li><li>Solve for the thing they ask about.</li><li>Look at the POWER of the variable they change. Squared → ×4, square root → ×√2 ≈ 1.41, on the bottom → divide.</li></ol></div>
<table class="tbl"><tr><th>Question</th><th>Equation</th><th>Answer</th></tr>
<tr><td>Double speed at bottom of ramp → height?</td><td>\(h=v^2/2g\)</td><td>Quadruple</td></tr>
<tr><td>Double mass on ramp → speed?</td><td>\(v=\sqrt{2gh}\)</td><td>Same</td></tr>
<tr><td>Double pendulum height → speed?</td><td>\(v=\sqrt{2gh}\)</td><td>×1.41 (increase, not double)</td></tr>
<tr><td>Double initial speed with friction → stopping distance?</td><td>\(d=v^2/2\mu g\)</td><td>Quadruple</td></tr>
<tr><td>Spring pulled 2d → max speed?</td><td>\(v=d\sqrt{k/m}\)</td><td>Double</td></tr>
<tr><td>Double mass on spring → max speed?</td><td>\(v=d\sqrt{k/m}\)</td><td>×0.71 (decrease, not ½ or ¼)</td></tr>
<tr><td>2k spring → max speed?</td><td>\(v=d\sqrt{k/m}\)</td><td>×1.41</td></tr></table>
<p class="note">KE depends on the reference frame: someone moving with the object sees K = 0 (PS19 #2).</p>
`},
{id:'L9',topic:'energy',title:'9. Energy bar charts → the energy equation',body:L`
${yt('_8RohfPMklM','LOL diagrams | Work and energy','Khan Academy','15 min')}
<p class="big">The bar chart IS the equation. Every non-zero bar becomes one term:</p>
\[K_i+U_{g,i}+U_{s,i}+W_{ext}=K_f+U_{g,f}+U_{s,f}+\Delta E_{th}\]
<div class="recipe"><ol>
<li><b>Choose the system</b> (usually object + Earth + spring). Earth in the system → gravity is a \(U_g\) bar. Earth NOT in system → gravity is outside work W. Never both.</li>
<li><b>Pick the initial and final moments.</b> Pick moments where you know stuff (at rest, at the top, at max compression).</li>
<li><b>Fill in the bars:</b> moving? K. Height above your zero? \(U_g\). Spring stretched/compressed? \(U_s\). Friction sliding? \(\Delta E_{th}=f_kd\). Outside push/pull? W (can be negative).</li>
<li><b>Annotate</b> each bar with its formula: \(\tfrac12mv^2\), \(mgh\), \(\tfrac12kx^2\), \(\mu_kmgd\).</li>
<li><b>Make the two sides equal height</b> (total energy in = total out), then write the equation one bar at a time.</li></ol></div>
<div class="ex"><b>Worked (PS19 #1):</b> 0.20 kg ball dropped from 1.5 m; 0.60 J dissipated in the bounce. Max height after?
<div class="row">${sceneDrop()} ${barChart({Ug0:5,Ug1:3,Eth:2,lbl:{Ug0:'mgh',Ug1:'mgh_f',Eth:'0.60 J'}})}</div>
${sol({principle:'Conservation of energy (bar chart)',constraint:L`\(K_i=0\) (dropped from rest), \(K_f=0\) (at the top of the bounce)`,assume:'System: ball + Earth; no air resistance',lines:[L`mgh=mgh_f+\Delta E_{th}`,L`h_f=h-\dfrac{\Delta E_{th}}{mg}`],plug:L`h_f=1.5-\dfrac{0.60}{(0.20)(9.8)}=1.19\text{ m}`,ans:L`1.19\text{ m}`})}</div>
<div class="ex"><b>Worked (DQ17):</b> train car m at v stops in distance d. Bars: \(K_i\) and a NEGATIVE W bar of the same size.
${barChart({K0:4,W:-4,lbl:{K0:'½mv²',W:'−Fd'}})}
\[\tfrac12mv^2-Fd=0\ \Rightarrow\ F=\frac{mv^2}{2d}\]
Non-energy check: \(0=v^2-2ad\Rightarrow a=\frac{v^2}{2d}\), \(F=ma=\frac{mv^2}{2d}\) ✓</div>
<div class="trap"><b>When energy CAN'T do it:</b> energy gives speeds and positions, not forces like T or N. For "tension at the bottom of the swing", use energy to get v, then Newton at that point.</div>
`},
{id:'L10',topic:'springs',title:'10. Springs: F = −kx and U = ½kx²',body:L`
${yt('6MhaPzGxfV8','Springs and Hooke\'s Law','Dan Fullerton (APlusPhysics)','12 min')}
<p class="big">Spring force: \(F=-kx\) (x = stretch or compression from natural length; the minus means it pulls back). Stored energy: \(U_s=\tfrac12kx^2\).</p>
<h3>Where ½kx² comes from (PS19 #6)</h3>
<p>\(dU=-F\,dx=kx\,dx\Rightarrow U_s=\int_0^xkx\,dx=\tfrac12kx^2\). On an F vs x graph that's the triangle's area. The slope of F vs x is k (Spring Constant Challenge lab).</p>
<p>Example: k = 50 N/m, stretched 2 m: F = 100 N, U = 100 J. Compressed 2 m: same 100 N (other direction) and same 100 J.</p>
<h3>Hanging spring</h3><p>At rest: \(kx_0=mg\Rightarrow k=\dfrac{mg}{x_0}\). Pulled down d more and released: it oscillates about the rest position with \(v_{max}=d\sqrt{k/m}\).</p>
<div class="ex"><b>Block slides down a ramp into a spring (PS19 #3):</b>
<div class="row">${sceneIncline(30,{spring:true,pos:0.75})} ${barChart({Ug0:5,Us1:5,lbl:{Ug0:'mg(d+x)sinθ',Us1:'½kx²'}})}</div>
At max compression: \(mg(d+x)\sin\theta=\tfrac12kx^2\), a quadratic in x. <br><b>Is speed max when it first touches the spring?</b> No. Right after contact \(kx\) is tiny, so gravity's \(mg\sin\theta\) still wins and it keeps speeding up until \(kx=mg\sin\theta\).</div>
`},
{id:'L11',topic:'potential',title:'11. Potential energy graphs & F = −dU/dx',body:L`
${yt('qpiYSNLZ3Z0','Conservative Force and Potential Energy','Flipping Physics','8 min')}
<p class="big">For conservative forces (gravity, springs): \(\Delta U=-\int F\,dx\), so \(F_x=-\dfrac{dU}{dx}\). <b>The force points downhill on the U graph.</b></p>
<ul><li>Check: \(U=\tfrac12kx^2\Rightarrow F=-kx\) ✓. \(U=mgy\Rightarrow F=-mg\) ✓ (down).</li>
<li>Equilibrium: \(dU/dx=0\) (flat spot). Minimum = <b>stable</b>, maximum = <b>unstable</b>.</li>
<li>Chain rule shows up (Ms. Lee said to review it): e.g. \(U=A\cos(kx)\Rightarrow F=Ak\sin(kx)\); \(U=\dfrac{-GMm}{r}\Rightarrow F=-\dfrac{GMm}{r^2}\).</li></ul>
<div class="ex">${sceneUgraph(1,12)}<br>\(U=x^3-12x\): \(F=-(3x^2-12)\). Equilibrium at \(x=2\) (a minimum, so stable). At x = 1: F = +9 N (pushes right, downhill toward the valley).</div>
`},
{id:'L12',topic:'method',title:'12. Lab & graph FRQs (how Ms. Lee makes them harder)',body:L`
<p class="big">Lab FRQs always follow the same pattern: <b>derive the equation → linearize → graph → best-fit slope → use the slope's meaning</b>. Graph FRQs test whether you know what slopes and areas mean.</p>
<h3>A. Linearize: turn your equation into y = (slope)·x + b</h3>
<div class="recipe"><ol><li>Derive the relationship in symbols (from Newton or energy).</li><li>Put the thing you MEASURED that changes on the y-axis and the thing you CONTROLLED on the x-axis, transformed so the relationship is a straight line.</li><li>Everything left over that multiplies x is the slope. Write "slope = …" in symbols.</li><li>Solve the slope expression for the quantity they want.</li></ol></div>
<table class="tbl"><tr><th>Lab</th><th>Equation</th><th>Graph</th><th>Slope means</th></tr>
<tr><td>Spring constant (hanging masses)</td><td>\(mg=kx\)</td><td>mg vs x</td><td>k</td></tr>
<tr><td>Cart down a ramp (from rest)</td><td>\(v^2=2gh\)</td><td>v² vs h</td><td>2g</td></tr>
<tr><td>Spring launcher</td><td>\(v=x\sqrt{k/m}\)</td><td>v vs x</td><td>\(\sqrt{k/m}\)</td></tr>
<tr><td>Coffee filters, quadratic drag</td><td>\(nm_0g=cv_T^2\)</td><td>v_T² vs n</td><td>\(m_0g/c\)</td></tr>
<tr><td>Modified Atwood (total mass fixed)</td><td>\(a=\frac{g(1+\mu)}{M}m-\mu g\)</td><td>a vs m</td><td>slope \(g(1+\mu)/M\), intercept \(-\mu g\)</td></tr>
<tr><td>Conical pendulum</td><td>\(P^2=\frac{4\pi^2}{g}L\cos\theta\)</td><td>P² vs L cos θ</td><td>\(4\pi^2/g\)</td></tr>
<tr><td>Circle at constant v</td><td>\(F=mv^2\cdot\frac1r\)</td><td>F vs 1/r</td><td>\(mv^2\)</td></tr>
<tr><td>Force sensor at the top of a loop</td><td>\(N=\frac{2mg}{R}h-5mg\)</td><td>N vs h</td><td>\(2mg/R\)</td></tr></table>
<h3>B. Best-fit line rules (easy points people lose)</h3>
<ul><li>Label both axes WITH units, and use most of the grid (pick a good scale).</li><li>Draw ONE straight line that balances the points. Don't connect the dots, and don't force it through the origin unless the physics says so.</li><li>Find the slope with two points <b>on your line</b> that are far apart (not data points). Show \(\frac{\Delta y}{\Delta x}\) with units.</li><li>A non-zero intercept means something physical (friction, an offset, a measurement error). Say what!</li></ul>
<div class="ex"><b>Example (Spring Constant Challenge):</b> masses 0.05–0.25 kg stretch the spring 0.021–0.101 m.
${plotSVG({w:380,h:260,xr:[0,0.12],yr:[0,3],xs:0.02,ys:0.5,xl:'x (m)',yl:'mg (N)',pts:[[0.021,0.49],[0.039,0.98],[0.061,1.47],[0.079,1.96],[0.101,2.45]],fns:[{f:x=>24.47*x-0.003,color:'#2563eb'}]})}
Points on the line: (0.020, 0.486) and (0.100, 2.444) → slope \(=\frac{2.444-0.486}{0.100-0.020}=24.5\text{ N/m}=k\).</div>
<h3>C. Sketching graphs (v-t, x-t, K-x, F-x, U-x)</h3>
<div class="recipe"><ol><li>Mark the starting value and any value they give you (label it on the axis).</li><li>Slope tells the shape: slope of x-t = v, of v-t = a, of K-x = net force, of U-x = −F.</li><li>Constant force → straight line in v-t; force growing with x → K-x curves up; drag → exponential approach to an <b>asymptote</b> (draw it dashed and label it, e.g. \(v_T=mg/b\)).</li><li>Show where the graph is steepest/flattest, and where it peaks (where the slope = 0, e.g. max speed where F = 0).</li></ol></div>
<h3>D. "Justify" / paragraph answers</h3>
<p>Name the principle → say what changes and why (cause → effect) → give the answer. Use the equation you derived as evidence: "Since \(v=x\sqrt{k/m}\), doubling k multiplies v by \(\sqrt2\), so it does NOT double."</p>
<h3>E. "Why is the measured value different?"</h3>
<p>Name a specific cause, say which way it pushes the result, and connect it to energy or forces. Example: friction turns some energy into thermal energy (ΔE_th), so the measured speed is LOWER than predicted. Saying "human error" gets zero points.</p>
`},
];
const CHEAT=L`
<div class="cheat">
<div class="cc"><h4>Newton</h4>\(\Sigma\vec F=m\vec a\) per axis<br>\(f_k=\mu_kN,\ f_s\le\mu_sN\)<br>Incline: \(mg\sin\theta\) along, \(mg\cos\theta\) into<br>3rd law: equal & opposite, different objects</div>
<div class="cc"><h4>Circles</h4>\(\Sigma F_{\to c}=\dfrac{mv^2}{r}=m\omega^2r\)<br>\(v=\omega r,\ \omega=\dfrac{2\pi}{T}\)<br>Constraint words: barely / max / min → N = 0, T = 0, or f = μN<br>Orbit: \(v=\sqrt{GM/r}\)</div>
<div class="cc"><h4>Drag</h4>\(mg-bv=m\dfrac{dv}{dt}\)<br>\(v_T=\dfrac{mg}{b}\), \(v=v_T(1-e^{-bt/m})\)<br>Coast: \(v=v_0e^{-bt/m}\)</div>
<div class="cc"><h4>Work</h4>\(W=\vec F\cdot\vec d=Fd\cos\theta\)<br>\(W=\int F\,dx\) = area under F-x<br>\(W_g=-mg\Delta y\) (path doesn't matter)<br>\(P=\dfrac{dW}{dt}=\vec F\cdot\vec v\)</div>
<div class="cc"><h4>Energy</h4>\(K=\tfrac12mv^2,\ U_g=mgh,\ U_s=\tfrac12kx^2\)<br>\(K_i+U_i+W=K_f+U_f+\Delta E_{th}\)<br>\(\Delta E_{th}=f_kd\)<br>\(W_{net}=\Delta K\)</div>
<div class="cc"><h4>Springs & U(x)</h4>\(F=-kx\); slope of F-x = k<br>Hanging at rest: \(kx=mg\)<br>\(F=-\dfrac{dU}{dx}\); min U = stable</div>
</div>`;
