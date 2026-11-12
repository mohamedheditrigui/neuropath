/* Chapter 4: k-nearest neighbours. Drag the new point (or use the arrow keys) and pick k. */
import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon.jsx';

const CLASSES = { moss: { color: '#5F6D32', label: 'Moss' }, terracotta: { color: '#A84F32', label: 'Terracotta' } };
// [x, y, class] in a 0–10 square
const POINTS = [
  [1.5, 2, 'moss'], [2.2, 3.4, 'moss'], [3, 1.6, 'moss'], [1.2, 4.5, 'moss'], [3.6, 3, 'moss'], [2.6, 5.2, 'moss'], [4.4, 1.8, 'moss'], [5.2, 3.6, 'moss'], [6.4, 2.4, 'moss'],
  [6.2, 7.4, 'terracotta'], [7.4, 6.2, 'terracotta'], [8.2, 8, 'terracotta'], [5.6, 8.6, 'terracotta'], [8.8, 5.4, 'terracotta'], [7, 8.8, 'terracotta'], [4.6, 6.8, 'terracotta'], [3.4, 7.6, 'terracotta'],
  [5.6, 5.6, 'terracotta'], [4, 4.8, 'moss'],
];
const PX = (v) => 30 + v * 46;
const PY = (v) => 490 - v * 46;
const K_CHOICES = [1, 3, 5, 7];

function DragLab({ level, onSolved }) {
  const task = level.task;
  const [q, setQ] = useState({ x: 5, y: 5 });
  const [k, setK] = useState(task.k[0] === 1 ? 3 : 1);
  const svg = useRef(null);
  const dragging = useRef(false);

  const near = POINTS.map((p) => ({ p, d: Math.hypot(p[0] - q.x, p[1] - q.y) })).sort((a, b) => a.d - b.d).slice(0, k);
  const votes = { moss: 0, terracotta: 0 };
  near.forEach((n) => { votes[n.p[2]] += 1; });
  const predicted = votes.moss > votes.terracotta ? 'moss' : 'terracotta';
  const radius = near[near.length - 1].d;
  const ok = predicted === task.cls && task.k.includes(k) && (!task.unanimous || votes[predicted] === k);
  useEffect(() => onSolved(ok), [ok, onSolved]);

  const move = (e) => {
    if (!dragging.current || !svg.current) return;
    const pt = svg.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const m = pt.matrixTransform(svg.current.getScreenCTM().inverse());
    setQ({ x: Math.max(0, Math.min(10, (m.x - 30) / 46)), y: Math.max(0, Math.min(10, (490 - m.y) / 46)) });
  };
  const onKey = (e) => {
    const d = { ArrowLeft: [-0.25, 0], ArrowRight: [0.25, 0], ArrowUp: [0, 0.25], ArrowDown: [0, -0.25] }[e.key];
    if (!d) return;
    e.preventDefault();
    setQ((p) => ({ x: Math.max(0, Math.min(10, p.x + d[0])), y: Math.max(0, Math.min(10, p.y + d[1])) }));
  };

  const kText = task.k.length > 1 ? `k = ${task.k.join(' or ')}` : `k = ${task.k[0]}`;

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">prediction = majority of the <em>{k}</em> nearest</div>
        <div style={{ display: 'grid', gap: 6 }}>
          <b>Number of neighbours k</b>
          <div className="pick">
            {K_CHOICES.map((v) => (
              <button key={v} type="button" className={v === k ? 'on' : ''} aria-pressed={v === k} onClick={() => setK(v)}>k = {v}</button>
            ))}
          </div>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Mini-exercise.</b> With {kText}, make the model predict <b>{CLASSES[task.cls].label}</b>
            {task.unanimous ? ', with every neighbour agreeing' : ''}.
          </p>
          <div className="readout">
            <span>Votes: <b style={{ color: CLASSES.moss.color }}>{votes.moss} moss</b>, <b style={{ color: CLASSES.terracotta.color }}>{votes.terracotta} terracotta</b></span>
            <span className={`chip ${ok ? 'good' : 'warn'}`}>{ok ? <><Icon name="check" /> Goal reached</> : `Prediction: ${CLASSES[predicted].label}`}</span>
          </div>
        </div>
        <p className="muted">Drag the grey point, or focus it and use the arrow keys.</p>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Two kinds of points</h3>
        <svg
          ref={svg}
          className="plot"
          viewBox="0 0 520 520"
          role="img"
          aria-label={`New point at ${q.x.toFixed(1)}, ${q.y.toFixed(1)}; predicted ${CLASSES[predicted].label}`}
          onPointerMove={move}
          onPointerUp={() => { dragging.current = false; }}
          onPointerLeave={() => { dragging.current = false; }}
          style={{ touchAction: 'none' }}
        >
          <rect x="30" y="30" width="460" height="460" fill="#FBF6EB" stroke="#E7D8BC" />
          <circle cx={PX(q.x)} cy={PY(q.y)} r={radius * 46} fill="#C98F2B" fillOpacity=".12" stroke="#C98F2B" strokeWidth="2" strokeDasharray="6 4" />
          {near.map((n, i) => <line key={i} x1={PX(q.x)} y1={PY(q.y)} x2={PX(n.p[0])} y2={PY(n.p[1])} stroke="#C98F2B" strokeWidth="2" />)}
          {POINTS.map(([x, y, c], i) => <circle key={i} cx={PX(x)} cy={PY(y)} r="9" fill={CLASSES[c].color} stroke="#FBF6EB" strokeWidth="2" />)}
          <g
            className="drag"
            tabIndex={0}
            role="slider"
            aria-label="New point position"
            aria-valuetext={`x ${q.x.toFixed(1)}, y ${q.y.toFixed(1)}`}
            onPointerDown={(e) => { dragging.current = true; e.currentTarget.ownerSVGElement.setPointerCapture?.(e.pointerId); }}
            onKeyDown={onKey}
          >
            <circle cx={PX(q.x)} cy={PY(q.y)} r="22" fill="transparent" />
            <circle cx={PX(q.x)} cy={PY(q.y)} r="12" fill="#6E6455" stroke="#2E2118" strokeWidth="3" />
          </g>
        </svg>
        <div className="legend">
          <span><i style={{ background: CLASSES.moss.color }} />Moss</span>
          <span><i style={{ background: CLASSES.terracotta.color }} />Terracotta</span>
          <span><i style={{ background: '#6E6455' }} />New point</span>
        </div>
      </section>
    </div>
  );
}

/* ---------- Scaling matters: income (TND) and age live on very different ranges ---------- */
// [age, yearly income in TND, class]: younger learners are moss, older ones terracotta.
const PEOPLE = [
  [22, 30000, 'moss'], [24, 70000, 'moss'], [27, 45000, 'moss'], [29, 60000, 'moss'], [23, 85000, 'moss'], [31, 40000, 'moss'],
  [50, 51000, 'terracotta'], [55, 53500, 'terracotta'], [45, 49000, 'terracotta'], [58, 75000, 'terracotta'], [48, 30000, 'terracotta'], [52, 62000, 'terracotta'],
];
const QUERY = [25, 52000];
const AGE = [20, 60];
const INCOME = [0, 100000];
const SX = (age) => 40 + ((age - AGE[0]) / (AGE[1] - AGE[0])) * 440;
const SY = (inc) => 300 - ((inc - INCOME[0]) / (INCOME[1] - INCOME[0])) * 260;

function ScaleLab({ level, onSolved }) {
  const task = level.task;
  const [scaled, setScaled] = useState(false);
  const k = task.k[0];
  const dist = ([a, i]) => {
    const da = scaled ? (a - QUERY[0]) / (AGE[1] - AGE[0]) : a - QUERY[0];
    const di = scaled ? (i - QUERY[1]) / (INCOME[1] - INCOME[0]) : i - QUERY[1];
    return Math.hypot(da, di);
  };
  const near = PEOPLE.map((p) => ({ p, d: dist(p) })).sort((x, y) => x.d - y.d).slice(0, k);
  const votes = { moss: 0, terracotta: 0 };
  near.forEach((n) => { votes[n.p[2]] += 1; });
  const predicted = votes.moss > votes.terracotta ? 'moss' : 'terracotta';
  const ok = predicted === task.cls;
  useEffect(() => onSolved(ok), [ok, onSolved]);

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">distance = √(Δage² + Δincome²)</div>
        <label className="toggle"><input type="checkbox" checked={scaled} onChange={(e) => setScaled(e.target.checked)} />Scale both features to 0–1 first</label>
        <div className="panel" style={{ display: 'grid', gap: 8 }}>
          <p className="mono" style={{ whiteSpace: 'pre-line' }}>{near.map((n, i) => `#${i + 1}: age ${n.p[0]}, ${n.p[1].toLocaleString('en')} TND`).join('\n')}</p>
          <p className="muted">The new learner is 25 years old and earns 52 000 TND. They are moss, like the other young learners.</p>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p><b>Mini-exercise.</b> With k = {k}, make the model predict <b>{CLASSES[task.cls].label}</b>.</p>
          <div className="readout">
            <span>Votes: <b style={{ color: CLASSES.moss.color }}>{votes.moss} moss</b>, <b style={{ color: CLASSES.terracotta.color }}>{votes.terracotta} terracotta</b></span>
            <span className={`chip ${ok ? 'good' : 'warn'}`}>{ok ? <><Icon name="check" /> Goal reached</> : `Prediction: ${CLASSES[predicted].label}`}</span>
          </div>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Age and income</h3>
        <svg className="plot" viewBox="0 0 520 340" role="img" aria-label={`Learners by age and income; the ${k} nearest are linked`} fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif">
          <rect x="40" y="40" width="440" height="260" fill="#FBF6EB" stroke="#E7D8BC" />
          {[20, 30, 40, 50, 60].map((a) => <text key={a} x={SX(a)} y="318" textAnchor="middle" fontSize="12" fill="#5E4C3D">{a}</text>)}
          {[0, 50000, 100000].map((v) => <text key={v} x="36" y={SY(v) + 4} textAnchor="end" fontSize="11" fill="#5E4C3D">{v / 1000}k</text>)}
          {near.map((n, i) => <line key={i} x1={SX(QUERY[0])} y1={SY(QUERY[1])} x2={SX(n.p[0])} y2={SY(n.p[1])} stroke="#C98F2B" strokeWidth="2.5" />)}
          {PEOPLE.map(([a, inc, c], i) => <circle key={i} cx={SX(a)} cy={SY(inc)} r="9" fill={CLASSES[c].color} stroke="#FBF6EB" strokeWidth="2" />)}
          <circle cx={SX(QUERY[0])} cy={SY(QUERY[1])} r="12" fill="#6E6455" stroke="#2E2118" strokeWidth="3" />
          <text x="260" y="336" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2E2118">Age (years)</text>
          <text x="40" y="30" fontSize="13" fontWeight="700" fill="#2E2118">Income (TND per year)</text>
        </svg>
        <p className="muted">{scaled ? 'Scaled: one year of age and 2 500 TND now weigh about the same, so age counts.' : 'Not scaled: 1 TND of income counts as much as 1 year of age, so income swamps age.'}</p>
      </section>
    </div>
  );
}

export default function KnnLab(props) {
  return props.level.mode === 'scale' ? <ScaleLab {...props} /> : <DragLab {...props} />;
}
