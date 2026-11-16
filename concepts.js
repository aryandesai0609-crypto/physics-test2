// ===== Concept checks (each wrong choice explains WHY it's wrong) =====
const RATIO=['Remain the same','Increase, but not double','Double','Quadruple','Be one-half','Be one-fourth','Decrease, but not by ½ or ¼'];
function ratioQ(id,topic,q,correctIdx,whyRight,src){
  const whyWrong=[ 'Write the equation and see what the variable depends on. It does change here.',
   'Check the power: if the answer goes as the square of the variable, doubling gives ×4. If it\'s linear, ×2.',
   'Look at the exponent. A square root or a square changes the factor.',
   'That would need a squared relationship.',
   'Doubling something on top makes the answer BIGGER, not smaller (check where the variable is).',
   'That would need the variable squared on the bottom.',
   'Check whether the variable is on the top or the bottom of the equation.'];
  return {id,topic,src,q,choices:RATIO.map((t,i)=>({t,ok:i===correctIdx,why:i===correctIdx?whyRight:whyWrong[i]}))};
}
const CONCEPTS=[
// ---- Energy Lab Exercises (ratio reasoning) ----
ratioQ('R1','energy','A cart is released from rest on a frictionless incline. To DOUBLE its speed at the bottom, the release height should…',3,L`\(mgh=\tfrac12mv^2\Rightarrow v=\sqrt{2gh}\), so \(h\propto v^2\). Double v means 4× h.`,'Energy Lab #1'),
ratioQ('R2','energy','Same frictionless incline. If the cart\'s MASS is doubled, its speed at the bottom will…',0,L`\(mgh=\tfrac12mv^2\): m cancels. \(v=\sqrt{2gh}\) has no m.`,'Energy Lab #2'),
ratioQ('R3','energy','A pendulum is released from height h above its lowest point. If h is doubled, the speed at the lowest point will…',1,L`\(v=\sqrt{2gh}\). Doubling h multiplies v by \(\sqrt2\approx1.41\): increases, but not double.`,'Energy Lab #3'),
ratioQ('R4','energy','A rough cart given speed v slides to rest. If given 2v instead, the stopping distance will…',3,L`\(\tfrac12mv^2=\mu mg\,d\Rightarrow d\propto v^2\). 2v gives 4d.`,'Energy Lab #4'),
ratioQ('R5','springs','A mass on a hanging spring is pulled down d from rest position and released. If pulled down 2d instead, its MAX speed would…',2,L`\(\tfrac12kd^2=\tfrac12mv_{max}^2\Rightarrow v_{max}=d\sqrt{k/m}\). Linear in d, so it doubles.`,'Energy Lab #5'),
ratioQ('R6','springs','Same spring setup, pulled down d. If the MASS is doubled, the max speed would…',6,L`\(v_{max}=d\sqrt{k/m}\). Doubling m multiplies v by \(1/\sqrt2\approx0.71\): decreases, but not by ½ or ¼.`,'Energy Lab #6'),
ratioQ('R7','springs','Same setup, pulled down d. With a spring of constant 2k instead, the max speed will…',1,L`\(v_{max}=d\sqrt{k/m}\). 2k gives ×\(\sqrt2\): increases, but not double.`,'Energy Lab #7'),
// ---- Work / energy conceptual (PS18, PS19) ----
{id:'W1',topic:'work',src:'PS18 #1',q:'A person rides a Ferris wheel through one complete turn. The NET work done by gravity on the person is…',choices:[
 {t:'Zero',ok:true,why:L`Gravity's work only depends on the change in height: \(W_g=-mg\Delta y\). One full turn ends at the same height, so \(\Delta y=0\).`},
 {t:'Positive',ok:false,why:'Gravity does + work on the way down and − work on the way up. They cancel over the full loop.'},
 {t:'Negative',ok:false,why:'Same height start and finish, so the up and down parts cancel.'}]},
{id:'W2',topic:'work',src:'PS18 #3',q:'A man claims less WORK is needed to load a fridge onto a truck if he uses a LONGER (frictionless) ramp. Is he right?',choices:[
 {t:'No. The work is the same (mgh); a longer ramp just needs less force over more distance',ok:true,why:L`Work against gravity = \(mgh\) no matter the path. Longer ramp: force \(mg\sin\theta\) is smaller but the distance \(L\) is bigger, and \(mg\sin\theta\cdot L = mgh\).`},
 {t:'Yes, because the force is smaller',ok:false,why:'Smaller force, but over a longer distance. Force × distance stays the same.'},
 {t:'No. A longer ramp needs MORE work',ok:false,why:'Frictionless means no extra losses. It\'s the same mgh.'}]},
{id:'W3',topic:'work',src:'PS19 #4',q:'A baseball is lifted from the same start to the same end point along three different paths (straight up, a diagonal, a curvy path). Along which path does Earth\'s gravity do the most work?',choices:[
 {t:'Same for all three',ok:true,why:L`Gravity is conservative: \(W_g=-mg\Delta y\) depends only on the start and end heights, not the path.`},
 {t:'The longest (curvy) path',ok:false,why:'Extra sideways distance doesn\'t count, because gravity is vertical. Only the change in height matters.'},
 {t:'Straight up',ok:false,why:'Same Δy as the others, so the same work.'}]},
{id:'W4',topic:'energy',src:'PS19 #2',q:'An object moves right at v₀ relative to the ground. Observer 1 is at rest, Observer 2 moves right at v₀, Observer 3 moves DOWN at v₀. Who measures the greatest kinetic energy?',choices:[
 {t:'Observer 3',ok:true,why:L`Relative to Observer 3, the object moves right at v₀ AND up at v₀, so its speed is \(\sqrt2v_0\) and \(K=\tfrac12m(2v_0^2)=mv_0^2\). That's the biggest.`},
 {t:'Observer 1',ok:false,why:L`Observer 1 sees \(\tfrac12mv_0^2\). Observer 3 sees more because the relative speed is \(\sqrt2v_0\).`},
 {t:'Observer 2',ok:false,why:'Observer 2 moves along with it and sees speed 0, so K = 0.'},
 {t:'All the same',ok:false,why:'Kinetic energy depends on the reference frame, because speed does.'}]},
{id:'W5',topic:'energy',src:'PS19 #3',q:'A block slides down a frictionless incline and hits a spring. Is its speed maximum at the instant it first touches the spring?',choices:[
 {t:L`No. It keeps speeding up until the spring force \(kx\) equals \(mg\sin\theta\)`,ok:true,why:L`Right after contact, the spring force is tiny (\(x\approx0\)), so the net force is still down the slope and it keeps speeding up. Max speed is where the net force = 0.`},
 {t:'Yes, the spring starts slowing it immediately',ok:false,why:L`The spring force starts at zero (\(F=kx\), \(x=0\)). Gravity's \(mg\sin\theta\) still wins at first.`},
 {t:'No, max speed is at max compression',ok:false,why:'At max compression the speed is ZERO.'}]},
{id:'W6',topic:'work',src:'Work signs',q:'A box slides down a rough incline. Which forces do NEGATIVE work on it?',choices:[
 {t:'Only kinetic friction',ok:true,why:'Friction points opposite the motion (cos 180° = −1). Gravity has a component along the motion (+ work). Normal force is perpendicular (0 work).'},
 {t:'Friction and the normal force',ok:false,why:'The normal force is perpendicular to the motion, so cos 90° = 0 and it does zero work.'},
 {t:'Gravity and friction',ok:false,why:'Going DOWN, gravity does + work (it helps the motion).'}]},
{id:'W7',topic:'work',src:'Graphs',q:'On a graph of Force (y-axis) vs position x (x-axis), the AREA under the curve is…',choices:[
 {t:'The work done',ok:true,why:L`\(W=\int F\,dx\) is the area under the F vs x graph.`},
 {t:'The power',ok:false,why:'Power is work per time. There\'s no time on this graph.'},
 {t:'The spring constant',ok:false,why:'k is the SLOPE of F vs x for a spring.'},
 {t:'The impulse',ok:false,why:'Impulse is the area under F vs TIME.'}]},
{id:'W8',topic:'work',src:'PS19 #5',q:L`\(F(x)=bx^2\) does work \(W\) moving an object from \(x=0\) to \(x=D\). How much work from \(x=0\) to \(x=2D\)?`,choices:[
 {t:'8W',ok:true,why:L`\(W=\int_0^D bx^2dx=\tfrac{b D^3}{3}\). Replace D with 2D: \((2D)^3=8D^3\), so 8W.`},
 {t:'2W',ok:false,why:'The force grows with x, so the work grows faster than the distance.'},
 {t:'4W',ok:false,why:'Integrating x² gives x³, not x², so the factor is 2³ = 8.'}]},
{id:'W9',topic:'energy',src:'Systems',q:'You choose the system = ball ONLY (Earth not included). How does gravity show up in the energy bar chart?',choices:[
 {t:'As outside Work (W bar), not as Ug',ok:true,why:'Potential energy belongs to a PAIR of interacting objects. If Earth is outside the system, gravity is an external force doing work.'},
 {t:'As a Ug bar',ok:false,why:'Ug only exists if BOTH the ball and Earth are inside the system.'},
 {t:'Both Ug and W',ok:false,why:'That counts gravity twice.'}]},
{id:'W10',topic:'potential',src:'U graphs',q:'On a graph of U(x), a particle is at a point where the graph slopes DOWNWARD to the right. Which way is the force?',choices:[
 {t:'+x (to the right, downhill)',ok:true,why:L`\(F=-dU/dx\). The slope is negative, so F is positive. Force always points "downhill" on a U graph.`},
 {t:'−x (to the left)',ok:false,why:'You dropped the minus sign in F = −dU/dx.'},
 {t:'Zero',ok:false,why:'Only where the slope is zero (a flat spot) is F = 0.'}]},
{id:'W11',topic:'potential',src:'Equilibrium',q:'At a MINIMUM (bottom of a valley) on a U(x) graph, the equilibrium is…',choices:[
 {t:'Stable',ok:true,why:'Nudge it either way and the force pushes it back downhill toward the bottom.'},
 {t:'Unstable',ok:false,why:'Unstable is at a MAXIMUM (top of a hill), where a nudge sends it away.'},
 {t:'Not an equilibrium',ok:false,why:'Slope = 0 there, so F = 0. It is an equilibrium.'}]},
// ---- Forces conceptual (DQ15 etc.) ----
{id:'N1',topic:'forces',src:'DQ15 #13-14',q:'A huge semi-truck collides head-on with a tiny car. During the impact…',choices:[
 {t:'Equal forces on each; the car accelerates more',ok:true,why:L`Newton's 3rd law: the forces are equal and opposite. \(a=F/m\), so the small mass gets the big acceleration.`},
 {t:'The truck exerts more force; the car accelerates more',ok:false,why:'3rd law pairs are ALWAYS equal in size, no matter the masses.'},
 {t:'Equal forces and equal accelerations',ok:false,why:'Equal forces, but a = F/m differs.'}]},
{id:'N2',topic:'forces',src:'DQ15 #5',q:'You lower a notebook from the desk to the floor at CONSTANT speed. Which way is the force your hand applies?',choices:[
 {t:'Up',ok:true,why:'Constant velocity means a = 0, so the net force is 0. Your hand must push UP to balance gravity, even though it is moving down.'},
 {t:'Down',ok:false,why:'If you pushed down AND gravity pulled down, it would speed up.'},
 {t:'No force needed',ok:false,why:'Without your hand it would accelerate down at g.'}]},
{id:'N3',topic:'forces',src:'DQ15 #6',q:'μ between a sled and snow is 0.10. A person (mass m) sits on the sled. The new coefficient of friction is…',choices:[
 {t:'Still 0.10',ok:true,why:'μ depends on the two SURFACES only. The friction FORCE goes up (bigger N), but μ doesn\'t change.'},
 {t:'0.20',ok:false,why:'Doubling the weight doubles the friction force, not μ.'},
 {t:'0.05',ok:false,why:'μ is a property of the materials.'}]},
{id:'N4',topic:'forces',src:'DQ15 #26',q:'An 80 kg man stands on a scale in an elevator. The scale reads 750 N. Which way is he moving?',choices:[
 {t:'Can\'t tell. We only know the acceleration is DOWN',ok:true,why:L`\(mg=784\text{ N}\gt750\text{ N}\), so the net force is down and a is down. He could be moving down and speeding up OR moving up and slowing down.`},
 {t:'Down',ok:false,why:'Acceleration down ≠ moving down. He could be moving up and slowing down.'},
 {t:'Up',ok:false,why:'The net force is down, so if he is moving up he must be slowing. We can\'t know the direction of motion.'}]},
{id:'N5',topic:'forces',src:'DQ15 #23',q:'A bungee jumper falls (slowing down). What is the Newton\'s 3rd law partner of the jumper\'s WEIGHT?',choices:[
 {t:'The jumper\'s gravitational pull on the Earth (upward)',ok:true,why:'Weight = Earth pulls jumper. The partner swaps the objects: jumper pulls Earth. Same type of force (gravity).'},
 {t:'The rope\'s tension on the jumper',ok:false,why:'That acts on the SAME object (jumper) and is a different type of force. 3rd law pairs act on DIFFERENT objects.'},
 {t:'The normal force',ok:false,why:'There\'s no normal force here, and 3rd law pairs are the same type of force.'}]},
{id:'N6',topic:'forces',src:'DQ15 #15-17',q:'You throw a ball up and to the right. AFTER it leaves your hand (no air resistance), what is its acceleration while it rises?',choices:[
 {t:'g, straight down',ok:true,why:'After release, the only force is gravity, so a = g downward the whole flight (up, top, and down).'},
 {t:'Up and to the right, along the velocity',ok:false,why:'Velocity and acceleration are different things. No force pushes it forward after it leaves your hand.'},
 {t:'Zero at the top',ok:false,why:'At the top v_y = 0, but gravity still acts, so a = g.'}]},
{id:'N7',topic:'forces',src:'DQ15 #34',q:'A cart (m₁) on a frictionless table is tied over a pulley to a hanging mass. Is the acceleration of m₁ greater than, less than, or equal to g?',choices:[
 {t:'Less than g',ok:true,why:L`\(a=\dfrac{m_2g}{m_1+m_2}\lt g\). The hanging weight has to accelerate BOTH masses.`},
 {t:'Equal to g',ok:false,why:'Only if m₁ = 0. The string tension holds the hanging mass back.'},
 {t:'Greater than g',ok:false,why:'Gravity on the hanging mass is the only driving force, and it moves more mass than itself.'}]},
{id:'N8',topic:'forces',src:'DQ15 #18',q:'Net force (y-axis) is plotted vs acceleration (x-axis) for one object. The slope means…',choices:[
 {t:'The mass',ok:true,why:L`\(F=ma\) is a line through the origin with slope m.`},{t:'The weight',ok:false,why:'Weight is mg, a force, not the slope.'},{t:'1/mass',ok:false,why:'That would be a vs F (axes swapped).'}]},
{id:'N9',topic:'circular',src:'DQ15 #22',q:'At constant speed v, net force (y) is plotted vs 1/r (x) for circles of different radius. The slope means…',choices:[
 {t:L`\(mv^2\)`,ok:true,why:L`\(F=mv^2\cdot\frac1r\), so the slope is \(mv^2\).`},{t:L`\(mv^2/r\)`,ok:false,why:'That\'s F itself. The slope is the coefficient of 1/r.'},{t:'m',ok:false,why:'That\'s for F vs a.'}]},
{id:'N10',topic:'circular',src:'DQ15 #4',q:'An object on a string is whirled in a VERTICAL circle at CONSTANT speed. Where is the magnitude of its acceleration largest?',choices:[
 {t:'Same everywhere',ok:true,why:L`At constant speed, \(a_c=v^2/r\) is the same everywhere. (The TENSION changes, but the acceleration doesn't.)`},
 {t:'At the bottom',ok:false,why:'The TENSION is biggest at the bottom, but at constant speed v²/r is the same everywhere.'},
 {t:'At the top',ok:false,why:'Tension is smallest there, but a = v²/r is unchanged.'}]},
{id:'N11',topic:'circular',src:'DQ15 #11',q:'The Moon is pulled toward Earth by gravity. Why doesn\'t it crash into Earth?',choices:[
 {t:'It IS falling, but it moves sideways fast enough that it keeps missing',ok:true,why:'Gravity bends its sideways motion into a circle. With no sideways speed it would fall straight in.'},
 {t:'Gravity is balanced by an outward centrifugal force',ok:false,why:'There is no outward force. The net force (gravity) points inward. That\'s why it curves.'},
 {t:'Gravity is too weak that far away',ok:false,why:'Gravity is strong enough to keep it in orbit. That IS the centripetal force.'}]},
{id:'N12',topic:'circular',src:'FBD rules',q:'On a free body diagram of a car going around a flat curve, you should draw…',choices:[
 {t:'Gravity, normal force, and static friction pointing toward the center',ok:true,why:'Friction IS the centripetal force here. Draw real forces only.'},
 {t:'Gravity, normal force, friction, and a centripetal force',ok:false,why:'"Centripetal" is the NET force, not an extra one. Here it is friction.'},
 {t:'Gravity, normal force, and an outward centrifugal force',ok:false,why:'There is no outward force in an inertial frame.'}]},
{id:'N13',topic:'forces',src:'DQ15 #44',q:'True or false: an object with negative acceleration must be slowing down.',choices:[
 {t:'False',ok:true,why:'If the velocity is ALSO negative, the object is speeding up in the − direction. Slowing down means a and v have OPPOSITE signs.'},
 {t:'True',ok:false,why:'Negative just means "points in the − direction." Moving in − and accelerating in − means speeding up.'}]},
{id:'N14',topic:'forces',src:'DQ15 #28',q:'When are the kinematics equations (like v² = v₀² + 2aΔx) valid?',choices:[
 {t:'Only when acceleration is constant',ok:true,why:'They are derived assuming constant a. With drag (−bv) or springs (−kx), the acceleration changes, so use calculus or energy instead.'},
 {t:'Always',ok:false,why:'Not for springs, drag, or circular motion.'},
 {t:'Only when velocity is constant',ok:false,why:'Then you wouldn\'t need them: x = vt.'}]},
{id:'N15',topic:'forces',src:'DQ15 #25',q:'Two blocks stacked (or side by side) move together at CONSTANT speed to the right on a floor. What is the net force on each block?',choices:[
 {t:'Zero on each',ok:true,why:'Constant velocity means a = 0, so ΣF = 0 for EACH block.'},
 {t:'To the right',ok:false,why:'Moving right ≠ net force right. Constant speed means the forces are balanced.'},
 {t:'Depends on the masses',ok:false,why:'Any mass at constant velocity has zero net force.'}]},
{id:'N16',topic:'forces',src:'PS16 #1',q:'A rope WITH MASS hangs from the ceiling holding a block at rest. Is the tension at the top of the rope equal to the tension at the bottom?',choices:[
 {t:'No. The top has more tension (it also holds the rope\'s weight)',ok:true,why:'The top of the rope holds up the block AND all the rope below it. The bottom only holds the block. (If the rope is horizontal, gravity doesn\'t pull along it, so the tension is the same at both ends.)'},
 {t:'Yes, tension is always the same everywhere in a rope',ok:false,why:'Only for a massless rope (or a rope with no force along its length besides the ends).'},
 {t:'No. The bottom has more tension',ok:false,why:'The top supports more weight below it.'}]},
{id:'N17',topic:'circular',src:'Hill crest',q:'A car goes over the top of a hill at speed v. Compared to mg, the normal force is…',choices:[
 {t:'Less than mg',ok:true,why:L`\(mg-N=\dfrac{mv^2}{R}\Rightarrow N=mg-\dfrac{mv^2}{R}\). (You feel lighter.)`},
 {t:'Equal to mg',ok:false,why:'Only if v = 0.'},{t:'Greater than mg',ok:false,why:'That\'s at the bottom of a dip.'}]},
{id:'N18',topic:'drag',src:'Coffee filters',q:'A coffee filter falls with drag F = −bv. Its speed vs time graph…',choices:[
 {t:'Starts steep (slope g) and levels off at v_T = mg/b',ok:true,why:'At first v ≈ 0, so drag ≈ 0 and a ≈ g. As v grows, drag grows until it equals mg.'},
 {t:'Is a straight line with slope g',ok:false,why:'That\'s free fall with no drag.'},
 {t:'Rises then falls back to zero',ok:false,why:'Drag can only cancel gravity, not reverse it.'}]},
{id:'N19',topic:'forces',src:'PS14 #2 style',q:L`A student says: "On an incline, the normal force is \(mg\) because the block isn't moving into the ramp." What's the error?`,choices:[
 {t:L`Only the perpendicular part of gravity (\(mg\cos\theta\)) presses into the ramp, so N = mg cos θ`,ok:true,why:'The student is right that a⊥ = 0, but balancing the perpendicular forces gives N = mg cos θ.'},
 {t:'No error',ok:false,why:'N = mg only on a flat surface with no other vertical forces.'},
 {t:L`N should be \(mg\sin\theta\)`,ok:false,why:'sin is the part along the slope.'}]},
{id:'N20',topic:'energy',src:'Choosing a method',q:'A problem gives a starting speed and height and asks for the speed at a later height. It doesn\'t mention time. The fastest method is…',choices:[
 {t:'Energy conservation (bar chart)',ok:true,why:'Energy connects speeds and positions without time or directions. Perfect when the path is curvy or the force changes.'},
 {t:'Newton\'s 2nd law + kinematics',ok:false,why:'That works only if a is constant and the path is simple. Energy is easier.'},
 {t:'You can\'t solve without time',ok:false,why:'Energy doesn\'t need time.'}]},
{id:'N21',topic:'energy',src:'Choosing a method',q:'A problem asks for the TENSION in a string or the NORMAL FORCE at some point. You must use…',choices:[
 {t:'Newton\'s 2nd law (an FBD) at that point. You can use energy first to get v',ok:true,why:'Energy never gives you forces like T or N directly. Get v from energy, then plug it into ΣF = mv²/r.'},
 {t:'Energy only',ok:false,why:'Tension and normal force do no work in many cases, so they never show up in the energy equation.'},
 {t:'Kinematics only',ok:false,why:'Kinematics doesn\'t involve forces at all.'}]},
];

// ===== Derivation drills (Ms. Lee style: symbols only, "in terms of given variables") =====
const DERIVS=[
{id:'D1',topic:'energy',title:'DQ 17: Train brakes (two ways)',q:L`A train car of mass \(m\) moving at speed \(v\). What force must the brakes exert to stop it in a distance \(d\)? (a) Start with an energy bar chart. (b) Start with non-energy principles.`,
 steps:[
  {prompt:'(a) Bar chart, system = train car. Which equation comes from the bars?',choices:[{t:L`\(\tfrac12mv^2 - Fd = 0\)`,ok:true,why:'K initial + (negative work by brakes) = 0 final K.'},{t:L`\(\tfrac12mv^2 = mgd\)`,ok:false,why:'No height change, so no Ug.'},{t:L`\(\tfrac12mv^2 + Fd = 0\)`,ok:false,why:'The brake force opposes motion, so its work is NEGATIVE.'}]},
  {prompt:'(b) Non-energy: which principles?',choices:[{t:L`Kinematics \(v_f^2=v^2+2a\Delta x\) to get a, then \(F=ma\)`,ok:true,why:'The force is constant, so a is constant and kinematics is allowed.'},{t:L`\(F=mv\)`,ok:false,why:'That\'s not a principle (mv is momentum).'},{t:L`\(F=\dfrac{mv^2}{d}\) (centripetal)`,ok:false,why:'Nothing is going in a circle.'}]},
  {prompt:'Final expression:',choices:[{t:L`\(F=\dfrac{mv^2}{2d}\)`,ok:true,why:'Both methods agree.'},{t:L`\(F=\dfrac{mv^2}{d}\)`,ok:false,why:'Missing the ½.'},{t:L`\(F=\dfrac{mv}{2d}\)`,ok:false,why:'Units: kg·m/s ÷ m is not a force. Check that v is squared.'}]}],
 solution:sol({principle:L`(a) \(K_i+W=K_f\)  (b) Newton's 2nd law + kinematics`,constraint:L`\(v_f=0\) after distance \(d\)`,assume:'Constant braking force, level track',lines:[L`\text{(a) }\tfrac12mv^2-Fd=0\Rightarrow F=\dfrac{mv^2}{2d}`,L`\text{(b) }0=v^2-2ad\Rightarrow a=\dfrac{v^2}{2d},\quad F=ma=\dfrac{mv^2}{2d}`],ans:L`F=\dfrac{mv^2}{2d}`})},
{id:'D2',topic:'forces',title:'Modified Atwood with friction',q:L`Block \(m_2\) on a table (coefficient \(\mu_k\)) is connected over a light pulley to hanging block \(m_1\). Derive the acceleration and tension.`,
 steps:[
  {prompt:'Table block (toward pulley = +):',choices:[{t:L`\(T-\mu_k m_2 g = m_2 a\)`,ok:true,why:'Tension pulls toward the pulley and friction pulls back.'},{t:L`\(T = m_2 a\)`,ok:false,why:'You forgot friction.'},{t:L`\(m_2 g - T = m_2a\)`,ok:false,why:'The table block\'s weight is vertical and balanced by N.'}]},
  {prompt:'Hanging block (down = +):',choices:[{t:L`\(m_1 g - T = m_1 a\)`,ok:true,why:'Gravity down, tension up.'},{t:L`\(T-m_1g=m_1a\)`,ok:false,why:'It accelerates DOWN.'},{t:L`\(T=m_1g\)`,ok:false,why:'Only if a = 0.'}]},
  {prompt:'Add the two equations (T cancels):',choices:[{t:L`\(a=\dfrac{(m_1-\mu_k m_2)g}{m_1+m_2}\)`,ok:true,why:'Adding eliminates T. This is the same as the system approach.'},{t:L`\(a=\dfrac{m_1g}{m_2}\)`,ok:false,why:'Both masses accelerate, so divide by the total.'},{t:L`\(a=\dfrac{(m_1+\mu_km_2)g}{m_1+m_2}\)`,ok:false,why:'Friction slows it, so subtract.'}]}],
 solution:sol({principle:'Newton\'s 2nd law on each block',constraint:'Same |a| for both blocks (inextensible string)',assume:'Massless string/pulley',lines:[L`T-\mu_km_2g=m_2a`,L`m_1g-T=m_1a`,L`a=\dfrac{(m_1-\mu_km_2)g}{m_1+m_2},\quad T=m_1(g-a)=\dfrac{m_1m_2g(1+\mu_k)}{m_1+m_2}`],ans:L`a=\dfrac{(m_1-\mu_km_2)g}{m_1+m_2}`})},
{id:'D3',topic:'circular',title:'Max speed over a hill (constraint!)',q:L`A car of mass \(m\) drives over a hill crest of radius \(R\). Derive the maximum speed without losing contact. Include the constraint.`,
 steps:[
  {prompt:'Radial equation at the crest:',choices:[{t:L`\(mg-N=\dfrac{mv^2}{R}\)`,ok:true,why:'Center is below, so gravity is + and N is −.'},{t:L`\(N-mg=\dfrac{mv^2}{R}\)`,ok:false,why:'That\'s a dip.'},{t:L`\(N=mg\)`,ok:false,why:'It\'s accelerating toward the center.'}]},
  {prompt:'Constraint:',choices:[{t:L`\(N\ge0\); at max speed \(N=0\)`,ok:true,why:'Losing contact means N would have to be negative, which a road can\'t do (it can\'t pull).'},{t:L`\(v\ge0\)`,ok:false,why:'That\'s always true, so it doesn\'t limit anything.'},{t:L`\(N=mg\)`,ok:false,why:'Not a limit.'}]},
  {prompt:'Result:',choices:[{t:L`\(v_{max}=\sqrt{gR}\)`,ok:true,why:'m cancels.'},{t:L`\(v_{max}=gR\)`,ok:false,why:'Units: gR is m²/s². Take the square root.'},{t:L`\(v_{max}=\sqrt{2gR}\)`,ok:false,why:'No 2, since this is not an energy drop.'}]}],
 solution:sol({principle:'Newton\'s 2nd law, radial',constraint:L`Contact: \(N\ge0\)`,assume:'Car as a point',lines:[L`mg-N=\dfrac{mv^2}{R}`,L`N=0:\ v_{max}=\sqrt{gR}`],ans:L`v_{max}=\sqrt{gR}`})},
{id:'D4',topic:'circular',title:'Conical pendulum speed',q:L`A mass on a string of length \(L\) moves in a horizontal circle with the string at angle \(\theta\) from vertical. Derive its speed.`,
 steps:[
  {prompt:'Vertical and horizontal equations:',choices:[{t:L`\(T\cos\theta=mg,\ \ T\sin\theta=\dfrac{mv^2}{L\sin\theta}\)`,ok:true,why:'θ is from the vertical, and r = L sin θ.'},{t:L`\(T\sin\theta=mg,\ T\cos\theta=\dfrac{mv^2}{L}\)`,ok:false,why:'sin/cos are swapped, and the radius isn\'t L.'},{t:L`\(T=mg,\ T=\dfrac{mv^2}{r}\)`,ok:false,why:'You need components.'}]},
  {prompt:'Divide horizontal by vertical:',choices:[{t:L`\(\tan\theta=\dfrac{v^2}{gL\sin\theta}\Rightarrow v=\sqrt{gL\sin\theta\tan\theta}\)`,ok:true,why:'T and m cancel.'},{t:L`\(v=\sqrt{gL\tan\theta}\)`,ok:false,why:'Forgot r = L sin θ.'},{t:L`\(v=\sqrt{gL}\)`,ok:false,why:'The angle matters.'}]}],
 solution:sol({principle:'Newton\'s 2nd law on 2 axes',constraint:L`r=L\sin\theta`,assume:'Massless string',lines:[L`T\cos\theta=mg`,L`T\sin\theta=\dfrac{mv^2}{L\sin\theta}`,L`v=\sqrt{gL\sin\theta\tan\theta}`],ans:L`v=\sqrt{gL\sin\theta\tan\theta}`})},
{id:'D5',topic:'drag',title:'Falling with drag −bv: v(t)',q:L`An object of mass \(m\) is dropped from rest; drag is \(-bv\). Derive \(v(t)\) and the terminal velocity.`,
 steps:[
  {prompt:'Newton\'s 2nd law (down +):',choices:[{t:L`\(mg-bv=m\dfrac{dv}{dt}\)`,ok:true,why:'Gravity down, drag up.'},{t:L`\(mg+bv=m\dfrac{dv}{dt}\)`,ok:false,why:'Drag opposes the motion.'},{t:L`\(mg-bv=0\) always`,ok:false,why:'That\'s only true at terminal velocity.'}]},
  {prompt:'Separate variables:',choices:[{t:L`\(\displaystyle\int_0^v\frac{dv}{g-\frac bm v}=\int_0^t dt\)`,ok:true,why:L`Divide by \(m\) and by \((g-\tfrac bm v)\).`},{t:L`\(\displaystyle\int (g-\tfrac bmv)dv=\int dt\)`,ok:false,why:'Divide by that term, don\'t multiply.'},{t:'Use v = gt',ok:false,why:'a is not constant.'}]},
  {prompt:'Integrate (u-sub: u = g − (b/m)v):',choices:[{t:L`\(v=\dfrac{mg}{b}\left(1-e^{-bt/m}\right),\ v_T=\dfrac{mg}{b}\)`,ok:true,why:L`\(-\frac mb\ln\frac{g-\frac bmv}{g}=t\). Solve for v. As t→∞ the exponential → 0.`},{t:L`\(v=\dfrac{mg}{b}e^{-bt/m}\)`,ok:false,why:'That starts at mg/b, but it starts from REST (v = 0 at t = 0).'},{t:L`\(v=gt-\dfrac{b}{m}t\)`,ok:false,why:'Not how it integrates.'}]}],
 solution:sol({principle:L`\(\Sigma F=m\,dv/dt\)`,constraint:L`\(v(0)=0\)`,assume:'Linear drag',lines:[L`mg-bv=m\dfrac{dv}{dt}`,L`\int_0^v\dfrac{dv}{g-\frac bmv}=\int_0^t dt\Rightarrow -\dfrac mb\ln\left(1-\dfrac{bv}{mg}\right)=t`,L`v(t)=\dfrac{mg}{b}\left(1-e^{-bt/m}\right),\quad v_T=\dfrac{mg}{b}`],ans:L`v(t)=\tfrac{mg}{b}(1-e^{-bt/m})`})},
{id:'D6',topic:'springs',title:'Derive spring energy ½kx²',q:L`The spring force is \(F=-kx\). Write a differential relation between spring energy and force, and solve it to get \(U_s(x)\). (Problem Set 19 #6)`,
 steps:[
  {prompt:'Relation:',choices:[{t:L`\(dU = -F\,dx = kx\,dx\)`,ok:true,why:L`The work YOU do stretching it (\(kx\,dx\)) is stored. Equivalently \(F=-dU/dx\).`},{t:L`\(dU = F\,dt\)`,ok:false,why:'Energy uses dx, not dt.'},{t:L`\(dU = kx\)`,ok:false,why:'You need the dx.'}]},
  {prompt:'Integrate from 0 to x:',choices:[{t:L`\(U_s=\tfrac12kx^2\)`,ok:true,why:L`\(\int_0^x kx\,dx=\tfrac12kx^2\)`},{t:L`\(U_s=kx^2\)`,ok:false,why:'The power rule gives ½.'},{t:L`\(U_s=\tfrac12kx\)`,ok:false,why:'x has to be squared.'}]}],
 solution:sol({principle:L`\(F=-\dfrac{dU}{dx}\)`,lines:[L`dU=-F\,dx=kx\,dx`,L`U_s=\int_0^x kx\,dx=\tfrac12kx^2`],note:L`Example: k = 50 N/m stretched 2 m: F = 100 N, U = 100 J. Compressed 2 m: F = 100 N (opposite direction), U = 100 J.`,ans:L`U_s=\tfrac12kx^2`})},
{id:'D7',topic:'energy',title:'Loop-the-loop minimum height',q:L`Derive the minimum release height \(h\) (from rest, frictionless) to make it around a loop of radius \(R\).`,
 steps:[
  {prompt:'At the top (minimum case):',choices:[{t:L`\(mg=\dfrac{mv^2}{R}\) (N = 0)`,ok:true,why:'Gravity alone provides the centripetal force.'},{t:L`\(v=0\)`,ok:false,why:'It would fall off before reaching the top.'},{t:L`\(N=mg\)`,ok:false,why:'Not the minimum case.'}]},
  {prompt:'Energy start → top:',choices:[{t:L`\(mgh=mg(2R)+\tfrac12mv^2\)`,ok:true,why:'Top of the loop is 2R high.'},{t:L`\(mgh=\tfrac12mv^2\)`,ok:false,why:'The top of the loop is still 2R off the ground.'},{t:L`\(mgh=mgR+\tfrac12mv^2\)`,ok:false,why:'It\'s 2R, not R.'}]},
  {prompt:'Result:',choices:[{t:L`\(h=\tfrac52R\)`,ok:true,why:'2R + ½R.'},{t:L`\(h=2R\)`,ok:false,why:'It needs speed at the top too.'},{t:L`\(h=3R\)`,ok:false,why:'Recheck: ½v² = ½gR, so it adds R/2, not R.'}]}],
 solution:sol({principle:'Newton (radial) + energy conservation',constraint:L`\(N\ge0\) at the top`,assume:'Frictionless, point mass',lines:[L`v_{top}^2=gR`,L`mgh=2mgR+\tfrac12mgR`,L`h=\tfrac52R`],ans:L`h=\tfrac52R`})},
{id:'D8',topic:'forces',title:'Minimum μs for blocks to stay at rest',q:L`Hanging mass \(m_h\) is tied over a pulley to block \(m_t\) on a rough table. Derive the minimum \(\mu_s\) so nothing moves. (PS16 #3)`,
 steps:[
  {prompt:'Equations:',choices:[{t:L`\(T=m_hg,\ \ T=\mu_s m_t g\)`,ok:true,why:'Equilibrium for each block, with friction at its max.'},{t:L`\(T=m_tg\)`,ok:false,why:'Tension holds up the HANGING mass.'},{t:L`\(m_hg-T=m_ha\)`,ok:false,why:'Nothing moves, so a = 0.'}]},
  {prompt:'Result:',choices:[{t:L`\(\mu_s=\dfrac{m_h}{m_t}\)`,ok:true,why:'g cancels.'},{t:L`\(\mu_s=\dfrac{m_t}{m_h}\)`,ok:false,why:'Upside down. A heavier hanging mass needs MORE friction.'},{t:L`\(\mu_s=\dfrac{m_h}{m_h+m_t}\)`,ok:false,why:'Only the table block presses on the table.'}]}],
 solution:sol({principle:'Equilibrium',constraint:L`\(f_s=\mu_sN\) at the verge of slipping`,lines:[L`T=m_hg`,L`\mu_sm_tg=T`,L`\mu_s=\dfrac{m_h}{m_t}`],note:'PS16 numbers: 1.0 kg hanging, 2.0 kg table gives μs = 0.50.',ans:L`\mu_s=m_h/m_t`})},
{id:'D9',topic:'circular',title:'Icy banked curve (PS13 #1)',q:L`Design a banked curve: with ice (\(\mu_s=0.08\)), a car at REST must not slide down, and a car going less than 60 km/h must not skid outward. Find the bank angle and minimum radius.`,
 steps:[
  {prompt:'Car at rest on the bank (same as a box on an incline):',choices:[{t:L`\(\tan\theta\le\mu_s\Rightarrow\theta=\tan^{-1}(0.08)=4.57^\circ\)`,ok:true,why:'Same as F3: at rest on a slope, friction holds it if tan θ ≤ μs. Use the steepest allowed angle.'},{t:L`\(\theta=0\)`,ok:false,why:'Allowed, but the steepest angle helps the moving car and gives the smallest radius.'},{t:L`\(\sin\theta=\mu_s\)`,ok:false,why:'It\'s tan, from μs·mg cos θ = mg sin θ.'}]},
  {prompt:'At 60 km/h (16.7 m/s), about to skid OUT, friction points down the slope. Equations (horizontal axis toward center):',choices:[
   {t:L`\(N\sin\theta+\mu_sN\cos\theta=\dfrac{mv^2}{r},\ \ N\cos\theta-\mu_sN\sin\theta=mg\)`,ok:true,why:'Friction down-slope has an inward part (μN cos θ) and a downward part (μN sin θ).'},
   {t:L`\(N\sin\theta=\dfrac{mv^2}{r},\ N\cos\theta=mg\)`,ok:false,why:'That ignores friction.'},
   {t:L`\(N\sin\theta-\mu_sN\cos\theta=\dfrac{mv^2}{r}\)`,ok:false,why:'Skidding OUT means friction points IN (down the slope), so it ADDS to the centripetal force.'}]}],
 solution:sol({principle:'Newton\'s 1st law (at rest) and 2nd law (moving, radial)',constraint:L`At rest: \(\tan\theta\le\mu_s\). Moving: \(f_s=\mu_sN\) at the limit`,assume:'v = 60 km/h = 16.7 m/s',
  lines:[L`\theta=\tan^{-1}(0.08)=4.57^\circ`,L`\dfrac{v^2}{rg}=\dfrac{\sin\theta+\mu_s\cos\theta}{\cos\theta-\mu_s\sin\theta}`,L`r=\dfrac{v^2(\cos\theta-\mu_s\sin\theta)}{g(\sin\theta+\mu_s\cos\theta)}`],plug:L`r=\dfrac{(16.7)^2(0.9968-0.0064)}{9.8(0.0797+0.0797)}\approx 176\text{ m}`,ans:L`\theta\approx4.6^\circ,\ r\approx176\text{ m}`})},
{id:'D10',topic:'drag',title:'Coasting car with R = −bv (PS14 #1)',q:L`A car moving at \(v_0\) loses engine power; the only horizontal force is \(R=-bv\). Derive \(v(t)\).`,
 steps:[
  {prompt:'Set up:',choices:[{t:L`\(-bv=m\dfrac{dv}{dt}\)`,ok:true,why:'Only drag acts horizontally.'},{t:L`\(-bv=ma\) with constant a`,ok:false,why:'a changes as v changes.'},{t:L`\(mg-bv=m\dfrac{dv}{dt}\)`,ok:false,why:'That\'s for vertical falling.'}]},
  {prompt:'Separate and integrate:',choices:[{t:L`\(\ln\dfrac{v}{v_0}=-\dfrac{b}{m}t\Rightarrow v=v_0e^{-bt/m}\)`,ok:true,why:'∫dv/v = ln v.'},{t:L`\(v=v_0-\dfrac bmt\)`,ok:false,why:'That would mean constant deceleration.'},{t:L`\(v=v_0e^{bt/m}\)`,ok:false,why:'That would mean speeding up forever. Check the sign.'}]}],
 solution:sol({principle:L`\(\Sigma F=m\,dv/dt\)`,constraint:L`\(v(0)=v_0\)`,lines:[L`-bv=m\dfrac{dv}{dt}`,L`\int_{v_0}^{v}\dfrac{dv}{v}=-\dfrac bm\int_0^tdt`,L`v=v_0e^{-bt/m}`],plug:L`\text{PS14: } v(10)=25e^{-20(10)/1500}=21.9\text{ m/s}`,ans:L`v=v_0e^{-bt/m}`})},
];
