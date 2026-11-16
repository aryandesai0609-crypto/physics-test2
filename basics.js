// ===== BASICS: the base knowledge to know cold =====
// 1) Must-know facts (flashcards)
const FACTS=[
['Free fall & kinematics','What does "free fall" mean?',L`<b>Only gravity acts.</b> So \(a = g = 9.8\text{ m/s}^2\) DOWN the whole time: going up, at the top, and coming down. Mass doesn't matter (no air resistance).`],
['Free fall & kinematics','A ball is tossed straight up. At the very top, what are v and a?',L`\(v = 0\) for an instant, but \(a = g\) down (still). Zero velocity ≠ zero acceleration.`],
['Free fall & kinematics','Projectile (no air): horizontal and vertical acceleration?',L`\(a_x = 0\) (so \(v_x\) is constant), \(a_y = -g\). Treat x and y separately; time is the link.`],
['Free fall & kinematics','When can you use the "big 4" kinematics equations?',L`ONLY when acceleration is <b>constant</b>.<br>\(v=v_0+at\), \(\Delta x=v_0t+\tfrac12at^2\), \(v^2=v_0^2+2a\Delta x\), \(\Delta x=\tfrac{v_0+v}{2}t\).<br>NOT for drag (−bv), springs (−kx), or anything where the force changes. Use calculus or energy then.`],
['Free fall & kinematics','How do you get velocity and acceleration from x(t)? And go backwards?',L`\(v=\dfrac{dx}{dt}\), \(a=\dfrac{dv}{dt}\). Backwards: \(v=v_0+\int a\,dt\), \(x=x_0+\int v\,dt\). Useful trick: \(a = v\dfrac{dv}{dx}\).`],
['Free fall & kinematics','Is "negative acceleration" the same as slowing down?',L`No. Slowing down = a and v have <b>opposite signs</b>. Negative a with negative v means speeding up.`],
['Forces','Equilibrium means…',L`\(a = 0\) so \(\Sigma\vec F = 0\). That's at rest <b>or</b> moving at constant velocity.`],
['Forces','Something moves at constant velocity. What is the net force?',L`Zero. You do NOT need a force to keep moving (Newton's 1st law). Forces change motion.`],
['Forces','When is the normal force equal to mg?',L`Only on a flat surface, with no other vertical forces (no angled pulls/pushes), and no vertical acceleration. Otherwise <b>solve for N</b> from \(\Sigma F_\perp\). Incline: \(N=mg\cos\theta\). Elevator accelerating up: \(N=m(g+a)\).`],
['Forces','When does the tension in a hanging rope equal mg?',L`Only when the hanging object has \(a=0\). Accelerating down → \(T\lt mg\). Accelerating up → \(T\gt mg\).`],
['Forces','What does a bathroom scale read?',L`The normal force N ("apparent weight"), not mg. Free fall → N = 0 → "weightless."`],
['Forces','Newton\'s 3rd law pair: 4 rules',L`Same size, opposite direction, <b>same type</b> of force, acting on <b>different objects</b>. So both are never on the same FBD. Weight's partner = the object pulling Earth up.`],
['Forces','Massless rope over a massless, frictionless pulley: tension?',L`The same on both sides. (A rope WITH mass hanging vertically: more tension at the top.)`],
['Friction','Static vs kinetic friction',L`<b>Kinetic</b> (sliding): \(f_k = \mu_k N\) always. <b>Static</b> (not sliding): \(f_s \le \mu_s N\). It's only as big as needed. It equals \(\mu_s N\) ONLY at the verge of slipping ("just about to slide", "maximum", "minimum μ").`],
['Friction','Which way does friction point?',L`Parallel to the surface, opposite the sliding (kinetic) or opposite the way it WOULD slide (static). It can point forward! (Walking, a car tire, the top block of a stack being dragged along.)`],
['Friction','Does μ change if you add mass?',L`No. μ depends only on the two surfaces. The friction FORCE changes because N changes.`],
['Circular motion','In uniform circular motion, what is constant and what is changing?',L`Speed is constant. Velocity (its direction) changes, so there IS acceleration: \(a_c=\dfrac{v^2}{r}=\omega^2 r\), pointing toward the center.`],
['Circular motion','What is the "centripetal force"?',L`Not a new force! It's the <b>net</b> force toward the center, made of real forces (tension, gravity, normal, friction). Never draw it on an FBD.`],
['Circular motion','What words mean you need a constraint in a circle problem?',L`"Barely makes it / doesn't lose contact / minimum speed at the top" → \(N=0\) or \(T=0\). "Max speed without skidding" → \(f_s=\mu_sN\).`],
['Circular motion','Is there an outward "centrifugal" force?',L`No. You feel pushed out because your body wants to keep going straight (inertia). The net force points IN.`],
['Circular motion','Why doesn\'t an orbiting satellite fall?',L`It IS falling (free fall, only gravity), but it moves sideways fast enough that it keeps missing. \(v=\sqrt{GM/r}\).`],
['Energy','When is mechanical energy (K + U) conserved?',L`When only conservative forces (gravity, springs) do work. No friction, no drag, no outside push/pull. Otherwise add the W bar and ΔE_th.`],
['Energy','When is the work done by a force zero?',L`When the force is perpendicular to the motion (normal force on a flat slide, tension in a pendulum, centripetal force), or the object doesn't move.`],
['Energy','Work-energy theorem',L`\(W_{net} = \Delta K\). Always true (it's Newton's 2nd law in energy form).`],
['Energy','Where is Ug = 0?',L`Wherever YOU choose. Only changes in U matter. Pick the lowest point to make things easy, and say where it is.`],
['Energy','Gravity\'s work along a curvy path?',L`\(W_g = -mg\Delta y\). Only the height change matters (gravity is conservative).`],
['Energy','Thermal energy from friction?',L`\(\Delta E_{th} = f_k \cdot d\) (friction force × sliding distance). Always positive. It goes on the FINAL side of the bar chart.`],
['Energy','When do you use energy instead of Newton?',L`When they ask for a speed, height, distance, or compression, and there's no time and no force asked. Energy can't give you T or N; for those, get v from energy, then use Newton.`],
['Springs','Hooke\'s law and spring energy',L`\(F=-kx\) (x from NATURAL length, minus = pulls back). \(U_s=\tfrac12kx^2\) (always ≥ 0; same for stretch or compression).`],
['Springs','Where is a mass on a spring moving fastest?',L`At the equilibrium position, where the net force = 0 (hanging: where \(kx=mg\), not where the spring is unstretched).`],
['Springs','Block slides down a ramp into a spring. Is the speed max when it first touches?',L`No. It keeps speeding up until \(kx = mg\sin\theta\) (net force zero).`],
['Graphs','x-t graph: slope = ?   v-t graph: slope = ?  area = ?',L`x-t slope = <b>velocity</b>. v-t slope = <b>acceleration</b>, area = <b>displacement</b>. a-t area = <b>Δv</b>.`],
['Graphs','F-x graph: area = ?   slope (spring) = ?',L`Area = <b>work</b>. Slope of spring F vs x = <b>k</b>.`],
['Graphs','U-x graph: how do you get the force? Equilibrium?',L`\(F=-\dfrac{dU}{dx}\) (force points downhill). Flat spot = equilibrium. Valley = stable, hill = unstable.`],
['Graphs','F vs a graph slope? F vs 1/r (constant v) slope?',L`F vs a: slope = m. F vs 1/r: slope = \(mv^2\).`],
['Drag','Terminal velocity means…',L`Net force = 0, so the speed stops changing. Linear drag: \(mg=bv_T\Rightarrow v_T=mg/b\). Quadratic: \(mg=cv_T^2\).`],
['Drag','How do you solve a problem with F = −bv?',L`Newton as a differential equation: \(\Sigma F = m\dfrac{dv}{dt}\). Separate variables (v's with dv, t's with dt), integrate with limits, solve. You get exponentials.`],
['Lab & FRQ skills','How do you "linearize" data?',L`Rearrange the equation into \(y = (\text{slope})\,x + b\). Whatever multiplies your x-variable is the slope. Example: \(P=2\pi\sqrt{L/g}\Rightarrow P^2=\tfrac{4\pi^2}{g}L\): graph \(P^2\) vs \(L\), slope = \(4\pi^2/g\).`],
['Lab & FRQ skills','How do you use a best-fit line?',L`Draw ONE straight line through the trend (not dot to dot). Find the slope with two points ON THE LINE that are far apart (not data points). Then use the slope's meaning to get the quantity.`],
['Lab & FRQ skills','Constraint vs assumption (Ms. Lee)',L`<b>Constraint</b> = something that MUST be true for the situation (at rest → a = 0; about to slip → \(f_s=\mu_sN\); loses contact → N = 0). <b>Assumption</b> = a simplification you choose (massless rope, no air resistance).`],
['Lab & FRQ skills','"Derive an expression" means…',L`Start from a principle (ΣF = ma, energy, ...), substitute, and solve in SYMBOLS using only the given variables and fundamental constants (g, G). Numbers only at the end, if at all.`],
['Lab & FRQ skills','Paragraph / "justify" answers need…',L`The principle you used, what is changing and why (cause → effect), and a direct answer. Equations in the paragraph are OK but you must explain them in words.`],
['Units','Units to know',L`N = kg·m/s². J = N·m. W = J/s. k in N/m. b (linear drag) in kg/s. c (quadratic drag) in kg/m. ω in rad/s.`],
];

// 2) Which principle do I start with?
const METHOD_OPTS=[
 {k:'newton',t:'Newton\'s 2nd law (FBD, ΣF = ma)'},
 {k:'radial',t:'Newton radial (ΣF toward center = mv²/r)'},
 {k:'energy',t:'Energy conservation (bar chart)'},
 {k:'kin',t:'Kinematics (constant a)'},
 {k:'calc',t:'Newton + calculus (separate variables)'},
 {k:'work',t:'Work definition (F·d or ∫F dx)'},
 {k:'combo',t:'Energy to get v, THEN Newton radial'},
];
const METHOD_Q=[
 ['A block is pulled by a rope at an angle across a rough floor. Find the acceleration.','newton','They ask for acceleration → forces → Newton. Draw the FBD; N isn\'t mg.'],
 ['A cart starts from rest at the top of a curvy frictionless track 3 m high. Find its speed at the bottom.','energy','Speed + height, no time, curvy path → energy. Newton would be a nightmare on a curvy track.'],
 ['A pendulum is released from 40°. Find the TENSION at the lowest point.','combo','Tension is a force, so you need Newton (radial) at the bottom. But you need v there first → energy.'],
 ['A ball is thrown straight up at 12 m/s. How long until it lands?','kin','Free fall: constant a = g, and they ask for TIME → kinematics.'],
 ['A boat\'s engine cuts off; water drag is −bv. Find v(t).','calc','The force depends on v, so a is not constant → separate variables and integrate.'],
 ['A car rounds a flat curve. What is the max speed before it skids?','radial','Circle + "max speed without skidding" → radial Newton with f_s = μ_s N.'],
 ['Find the minimum μs that keeps a box from sliding on a 25° ramp.','newton','Equilibrium (a = 0) + verge of slipping → Newton with f_s = μ_s N.'],
 ['A force F(x) = 3x² pushes a box from x = 0 to 2 m. How much work?','work','Variable force → W = ∫F dx.'],
 ['A spring (k known) compressed by x launches a block. How fast does it leave?','energy','Spring + speed → energy (½kx² = ½mv²). Kinematics is banned: the spring force isn\'t constant.'],
 ['A block slides down a rough incline from rest. How far until it reaches 5 m/s?','energy','Distance + speed with friction → energy with ΔE_th = μ_k mg cosθ d. (Newton + kinematics also works because a is constant, but energy is quicker.)'],
 ['Find the tension in the string of an Atwood machine.','newton','Tension is a force → FBD of each block, ΣF = ma.'],
 ['A satellite orbits at radius r. Find its speed.','radial','Circle: gravity is the centripetal force: GMm/r² = mv²/r.'],
 ['A train moving at v stops in distance d. Find the braking force.','energy','Force × distance + speed change → work-energy (½mv² = Fd). (Kinematics + Newton also works because a is constant.)'],
 ['A dropped coffee filter falls with drag −bv. Find its terminal speed.','newton','Terminal = net force zero → mg = bv_T. No calculus needed for v_T alone (you need calculus for v(t)).'],
 ['A car goes over a hill crest at speed v. Find the normal force.','radial','Circle at that instant → mg − N = mv²/R.'],
 ['A roller coaster starts at height h and goes around a loop. Find the minimum h.','combo','Newton at the top (N = 0 → v² = gR), then energy from the start to the top.'],
 ['A box is pushed 3 m by a 20 N force at 30° below horizontal. How much work does the push do?','work','W = Fd cos θ.'],
 ['A projectile is launched at 20 m/s at 35°. How far does it go?','kin','Projectile = free fall with constant a. Split into x and y.'],
];

// 3) True or false quick-fire (with the reason)
const TF=[
 ['A ball thrown upward has zero acceleration at the top.',false,'At the top v = 0, but gravity still acts: a = g down.'],
 ['An object moving at constant velocity has zero net force.',true,'a = 0 → ΣF = 0.'],
 ['The normal force always equals mg.',false,'Only on a flat surface with no other vertical forces and no vertical acceleration.'],
 ['Static friction always equals μs N.',false,'It\'s ≤ μs N. It equals μs N only when the object is about to slip.'],
 ['Centripetal force should be drawn on an FBD as its own arrow.',false,'It\'s the net force toward the center, made of real forces.'],
 ['In free fall, a heavier object falls with a bigger acceleration.',false,'All objects: a = g (no air resistance).'],
 ['The normal force does zero work on a box sliding on a flat floor.',true,'N is perpendicular to the motion.'],
 ['Kinetic friction always does negative work on the object sliding.',true,'It points opposite the sliding direction (relative to the surface it slides on).'],
 ['The kinematics equations work for a mass on a spring.',false,'The spring force changes with x, so a is not constant.'],
 ['Gravity does the same work on a ball no matter which path it takes between two heights.',true,'W_g = −mgΔy (conservative).'],
 ['Doubling the speed doubles the kinetic energy.',false,'K ∝ v²: double speed → 4× K.'],
 ['A mass on a hanging spring moves fastest where the spring is unstretched.',false,'Fastest at equilibrium where kx = mg (spring stretched).'],
 ['In a vertical circle at constant speed, the tension is largest at the bottom.',true,'T − mg = mv²/r at the bottom, so T = mg + mv²/r (largest).'],
 ['If the net work on an object is zero, its speed doesn\'t change.',true,'W_net = ΔK = 0.'],
 ['Newton\'s 3rd law pairs can cancel each other on an FBD.',false,'They act on DIFFERENT objects, so they never appear on the same FBD.'],
 ['A satellite in orbit is weightless because there\'s no gravity in space.',false,'Gravity is strong there; it\'s in free fall (N = 0).'],
 ['On an incline, the component of gravity along the slope is mg sin θ.',true,'Check θ = 0 → 0 along a flat surface. ✓'],
 ['The slope of a velocity-time graph is displacement.',false,'Slope = acceleration; AREA = displacement.'],
 ['Terminal velocity happens when drag equals weight.',true,'Net force = 0 → constant velocity.'],
 ['A car turning at constant speed has zero acceleration.',false,'Its direction changes, so there\'s centripetal acceleration.'],
 ['Mechanical energy is conserved when friction acts.',false,'Friction turns mechanical energy into thermal energy.'],
 ['A scale in an elevator accelerating downward reads less than mg.',true,'N = m(g − a) < mg.'],
 ['F = −dU/dx means the force points toward lower potential energy.',true,'Force points "downhill" on the U graph.'],
 ['Tension in a massless rope over a frictionless massless pulley is the same on both sides.',true,'That\'s why we use one T for both blocks.'],
 ['In a projectile, the horizontal velocity changes because of gravity.',false,'Gravity is vertical; v_x stays constant.'],
];

// 4) FBD builder scenarios. Each force: name, options (direction strings), correct option, why, arrow (for drawing: {deg,label,color,len})
const NOT='not acting';
const FBD_S=[
 {title:'Ball thrown straight up, while it is RISING (no air resistance)',draw:{},forces:[
  {n:'Gravity',opts:['down','up',NOT],ok:'down',why:'Always down.',arrow:{deg:270,label:'mg',color:COL.g}},
  {n:'Force from the throw',opts:['up','down',NOT],ok:NOT,why:'The hand is no longer touching it. Moving up doesn\'t need an upward force. This is free fall.'},
  {n:'Air resistance',opts:['down','up',NOT],ok:NOT,why:'The problem says to ignore air.'}]},
 {title:'Box pushed to the RIGHT across a rough floor at CONSTANT speed (horizontal push)',forces:[
  {n:'Gravity',opts:['down','up',NOT],ok:'down',why:'Always.',arrow:{deg:270,label:'mg',color:COL.g}},
  {n:'Normal force',opts:['up','down',NOT],ok:'up',why:'The floor pushes up (perpendicular to the floor).',arrow:{deg:90,label:'N',color:COL.N}},
  {n:'Your push',opts:['right','left',NOT],ok:'right',why:'Your hand touches it and pushes right.',arrow:{deg:0,label:'F',color:COL.F}},
  {n:'Kinetic friction',opts:['right','left',NOT],ok:'left',why:'Opposite the sliding. Constant speed means it equals your push.',arrow:{deg:180,label:'fk',color:COL.f}},
  {n:'Net force',opts:['right','left',NOT],ok:NOT,why:'Constant velocity → net force = 0, and the net force is never drawn anyway.'}]},
 {title:'Block sliding UP a rough incline (after a shove), still moving up',tilt:30,forces:[
  {n:'Gravity',opts:['straight down','down the slope',NOT],ok:'straight down',why:'Gravity is always straight down. mg sin θ is just its component.',arrow:{deg:270,label:'mg',color:COL.g}},
  {n:'Normal force',opts:['perpendicular out of the ramp','straight up',NOT],ok:'perpendicular out of the ramp',why:'Normal = perpendicular to the surface.',arrow:{deg:120,label:'N',color:COL.N}},
  {n:'Kinetic friction',opts:['up the slope','down the slope',NOT],ok:'down the slope',why:'It slides UP, so friction points DOWN the slope.',arrow:{deg:210,label:'fk',color:COL.f}},
  {n:'Force from the shove',opts:['up the slope',NOT],ok:NOT,why:'The shove is over; nothing is touching it there. (Same idea as the thrown ball.)'}]},
 {title:'Block at REST on a rough incline',tilt:30,forces:[
  {n:'Gravity',opts:['straight down','down the slope',NOT],ok:'straight down',why:'Always straight down.',arrow:{deg:270,label:'mg',color:COL.g}},
  {n:'Normal force',opts:['perpendicular out of the ramp','straight up',NOT],ok:'perpendicular out of the ramp',why:'Perpendicular to the surface.',arrow:{deg:120,label:'N',color:COL.N}},
  {n:'Static friction',opts:['up the slope','down the slope',NOT],ok:'up the slope',why:'It would slide down without friction, so static friction points up the slope.',arrow:{deg:30,label:'fs',color:COL.f}}]},
 {title:'Person in an elevator that is speeding up while going UP',forces:[
  {n:'Gravity',opts:['down','up',NOT],ok:'down',why:'Always.',arrow:{deg:270,label:'mg',color:COL.g,len:55}},
  {n:'Normal force from floor',opts:['up','down',NOT],ok:'up',why:'The floor pushes up. Since a is up, N > mg (draw it longer).',arrow:{deg:90,label:'N',color:COL.N,len:80}},
  {n:'Tension in the elevator cable',opts:['up',NOT],ok:NOT,why:'The cable pulls on the ELEVATOR, not on the person. Only things touching the person count.'}]},
 {title:'Car at the top of a hill (crest), moving right',forces:[
  {n:'Gravity',opts:['down','up',NOT],ok:'down',why:'Always.',arrow:{deg:270,label:'mg',color:COL.g,len:75}},
  {n:'Normal force',opts:['up','down',NOT],ok:'up',why:'The road pushes up. N < mg here, because the net force points down toward the center.',arrow:{deg:90,label:'N',color:COL.N,len:50}},
  {n:'Centripetal force',opts:['down',NOT],ok:NOT,why:'Not a separate force. Here it is (mg − N).'}]},
 {title:'Ball on a string at the TOP of a vertical circle',forces:[
  {n:'Gravity',opts:['down','up',NOT],ok:'down',why:'Always.',arrow:{deg:270,label:'mg',color:COL.g,len:80,dx:9,from:16}},
  {n:'Tension',opts:['down (toward center)','up',NOT],ok:'down (toward center)',why:'A string pulls toward the pivot, which is BELOW the ball at the top.',arrow:{deg:270,label:'T',color:COL.T,len:62,dx:-9,from:16}},
  {n:'Outward centrifugal force',opts:['up',NOT],ok:NOT,why:'Doesn\'t exist in our frame.'}],h:240},
 {title:'Conical pendulum (mass circling horizontally, string at angle from vertical)',forces:[
  {n:'Gravity',opts:['down',NOT],ok:'down',why:'Always.',arrow:{deg:270,label:'mg',color:COL.g}},
  {n:'Tension',opts:['along the string (up and toward the center)','straight up','toward the center (horizontal)',NOT],ok:'along the string (up and toward the center)',why:'Tension is along the string. Its vertical part holds the weight; its horizontal part is the centripetal force.',arrow:{deg:120,label:'T',color:COL.T,len:85}},
  {n:'Centripetal force',opts:['toward the center',NOT],ok:NOT,why:'That is the horizontal component of T, not a separate force.'}]},
 {title:'Car going around a FLAT curve at constant speed (center is to the left)',forces:[
  {n:'Gravity',opts:['down',NOT],ok:'down',why:'Always.',arrow:{deg:270,label:'mg',color:COL.g}},
  {n:'Normal force',opts:['up',NOT],ok:'up',why:'Flat road pushes up.',arrow:{deg:90,label:'N',color:COL.N}},
  {n:'Static friction',opts:['left (toward center)','right (outward)',NOT],ok:'left (toward center)',why:'Friction is the ONLY sideways force, so it must point toward the center. Static, because the tires don\'t slide sideways.',arrow:{deg:180,label:'fs',color:COL.f}}]},
 {title:'Mass hanging at rest from a vertical spring',forces:[
  {n:'Gravity',opts:['down','up',NOT],ok:'down',why:'Always.',arrow:{deg:270,label:'mg',color:COL.g}},
  {n:'Spring force',opts:['up','down',NOT],ok:'up',why:'The spring is stretched, so it pulls back up: kx = mg at rest.',arrow:{deg:90,label:'kx',color:COL.s}}]},
 {title:'Coffee filter falling at TERMINAL speed',forces:[
  {n:'Gravity',opts:['down','up',NOT],ok:'down',why:'Always.',arrow:{deg:270,label:'mg',color:COL.g}},
  {n:'Air drag',opts:['up','down',NOT],ok:'up',why:'Drag opposes the motion (falling down → drag up). At terminal speed, drag = mg.',arrow:{deg:90,label:'bv',color:COL.f}}]},
 {title:'TOP block of a stack. The bottom block is pulled right and both speed up together.',forces:[
  {n:'Gravity',opts:['down',NOT],ok:'down',why:'Always.',arrow:{deg:270,label:'m₁g',color:COL.g}},
  {n:'Normal force from bottom block',opts:['up','down',NOT],ok:'up',why:'The bottom block pushes up on the top block.',arrow:{deg:90,label:'N',color:COL.N}},
  {n:'Static friction from bottom block',opts:['right','left',NOT],ok:'right',why:'The top block speeds up to the RIGHT and friction is the only horizontal force on it, so friction points right!',arrow:{deg:0,label:'fs',color:COL.f}},
  {n:'The pulling force F',opts:['right',NOT],ok:NOT,why:'F pulls the BOTTOM block. It doesn\'t touch the top block.'}]},
 {title:'Satellite in circular orbit around Earth',forces:[
  {n:'Gravity from Earth',opts:['toward Earth (center)','away from Earth',NOT],ok:'toward Earth (center)',why:'Gravity is the centripetal force.',arrow:{deg:270,label:'GMm/r²',color:COL.g}},
  {n:'Thrust/forward force',opts:['forward',NOT],ok:NOT,why:'Satellites coast. Moving sideways needs no force.'}]},
 {title:'Block on a frictionless table pulled by a string over a pulley (to a hanging mass)',forces:[
  {n:'Gravity',opts:['down',NOT],ok:'down',why:'Always.',arrow:{deg:270,label:'mg',color:COL.g}},
  {n:'Normal force',opts:['up',NOT],ok:'up',why:'Table pushes up.',arrow:{deg:90,label:'N',color:COL.N}},
  {n:'Tension',opts:['toward the pulley (right)','down',NOT],ok:'toward the pulley (right)',why:'The string attached to THIS block is horizontal.',arrow:{deg:0,label:'T',color:COL.T}},
  {n:'Weight of the hanging mass',opts:['down','right',NOT],ok:NOT,why:'That acts on the OTHER block. It reaches this block only through T (and T < hanging weight when accelerating).'}]},
];

// 5) Energy bar chart builder. bars: K0,Ug0,Us0,W,K1,Ug1,Us1,Eth : value (0 none, + positive, - negative for W). vals for drawing.
const BAR_KEYS=[['K0','K initial'],['Ug0','Ug initial'],['Us0','Us initial'],['W','W (outside work)'],['K1','K final'],['Ug1','Ug final'],['Us1','Us final'],['Eth','ΔE thermal']];
const BAR_S=[
 {title:'Cart released from rest at the top of a frictionless ramp → bottom of the ramp.',sys:'cart + Earth; Ug = 0 at the bottom',v:{Ug0:4,K1:4},eq:L`mgh=\tfrac12mv^2`,why:'Starts at rest (no K) and high (Ug). At the bottom Ug = 0 (our zero), so it\'s all K.'},
 {title:'Ball dropped from rest → top of its first bounce (some energy lost in the bounce).',sys:'ball + Earth; Ug = 0 at the floor',v:{Ug0:5,Ug1:3,Eth:2},eq:L`mgh=mgh_f+\Delta E_{th}`,why:'At the top of the bounce K = 0 again. The missing energy became thermal/sound.'},
 {title:'Compressed spring launches a block on a frictionless floor → block has left the spring.',sys:'block + spring',v:{Us0:4,K1:4},eq:L`\tfrac12kx^2=\tfrac12mv^2`,why:'All the spring energy becomes kinetic.'},
 {title:'You push a box from rest across a ROUGH floor; it\'s now moving.',sys:'box + floor (you are OUTSIDE the system)',v:{W:5,K1:2,Eth:3},eq:L`W_{push}=\tfrac12mv^2+\mu_kmgd`,why:'You add energy (positive W). Part becomes K, part becomes thermal from friction.'},
 {title:'A train brakes from speed v to a stop.',sys:'train only (the brake force is OUTSIDE work)',v:{K0:4,W:-4},eq:L`\tfrac12mv^2-Fd=0`,why:'The brakes do negative work equal to the starting K. (If you put the brakes INSIDE the system, it\'d be ΔE_th instead. Either is fine; say which!)'},
 {title:'Block slides from rest down a ROUGH incline to the bottom.',sys:'block + Earth + ramp; Ug = 0 at the bottom',v:{Ug0:5,K1:3,Eth:2},eq:L`mgh=\tfrac12mv^2+\mu_kmg\cos\theta\,d`,why:'Ug turns into K and thermal energy.'},
 {title:'Block released from rest slides down a frictionless incline, hits a spring → max compression.',sys:'block + Earth + spring; Ug = 0 at the max-compression point',v:{Ug0:5,Us1:5},eq:L`mg(d+x)\sin\theta=\tfrac12kx^2`,why:'At max compression K = 0. All the Ug went into the spring.'},
 {title:'Pendulum released from rest at an angle → lowest point.',sys:'bob + Earth; Ug = 0 at the bottom',v:{Ug0:3,K1:3},eq:L`mgL(1-\cos\theta)=\tfrac12mv^2`,why:'Tension does no work (perpendicular), so no W bar.'},
 {title:'Mass on a VERTICAL spring is pulled down and released → it passes through its equilibrium (resting) position.',sys:'mass + spring + Earth; Ug = 0 at the release point',v:{Us0:6,K1:2,Ug1:2,Us1:2},eq:L`\tfrac12k(x_0+d)^2=\tfrac12mv^2+mgd+\tfrac12kx_0^2`,why:'Tricky! At equilibrium the spring is STILL stretched (kx₀ = mg), so Us final ≠ 0. And it has risen, so Ug final > 0.'},
 {title:'An elevator cable lifts a person at CONSTANT speed from the ground floor to the 3rd floor.',sys:'person + Earth (the floor pushing is OUTSIDE work)',v:{K0:2,W:3,K1:2,Ug1:3},eq:L`\tfrac12mv^2+W=\tfrac12mv^2+mgh\Rightarrow W=mgh`,why:'Same K before and after (constant speed). The outside work goes into Ug.'},
 {title:'A spring launches a ball straight UP from rest → the ball\'s highest point.',sys:'ball + spring + Earth; Ug = 0 at the launch point',v:{Us0:4,Ug1:4},eq:L`\tfrac12kx^2=mgh_{max}`,why:'At the highest point K = 0.'},
 {title:'A ball is thrown up from the ground → a point HALFWAY to its max height.',sys:'ball + Earth; Ug = 0 at the ground',v:{K0:4,K1:2,Ug1:2},eq:L`\tfrac12mv_0^2=\tfrac12mv^2+mgh`,why:'Halfway up in height means half the energy is Ug and half is still K.'},
];
