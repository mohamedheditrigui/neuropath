/* Chapter 4: logistic regression on "did the student pass?".
   Modes: cut (a simple cut-off), sigmoid, threshold, boundary (two features), logloss, train. */
import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon.jsx';

const sigmoid = (z) => 1 / (1 + Math.exp(-z));
// [hours studied, passed 0/1]; one student passed with little study and one failed with more.
const STUDENTS = [[0.5, 0], [1.2, 0], [2.0, 0], [2.6, 0], [3.1, 0], [3.8, 1], [4.4, 0], [5.0, 1], [5.6, 1], [6.3, 1], [7.1, 1], [8.0, 1]];
// [hours studied, hours slept, passed]; roughly pass when studied + 0.8·slept ≥ 10, with one exception.
const STUDENTS_2D = [
  [2, 6, 0], [3, 8, 0], [4, 5, 0], [5, 7, 1], [6, 5, 1], [7, 8, 1], [8, 6, 1], [3.5, 9, 1], [5, 4.5, 0], [6.5, 4, 0], [9, 5, 1], [1, 8.5, 0], [4.5, 8, 1], [5.5, 6, 1], [7.5, 4.5, 0],
];
const PASS = '#5F6D32';
const FAIL = '#A84F32';

const accuracyOf = (predict) => STUDENTS.filter(([x, y]) => (predict(x) ? 1 : 0) === y).length / STUDENTS.length;
const logLossOf = (w, b) =>
  -STUDENTS.reduce((s, [x, y]) => {
    const p = Math.min(1 - 1e-9, Math.max(1e-9, sigmoid(w * x + b)));
    return s + (y ? Math.log(p) : Math.log(1 - p));
  }, 0) / STUDENTS.length;

const pct = (v) => `${Math.round(v * 100)}%`;
const chip = (ok, msg) => (
  <span className={`chip ${ok ? 'good' : 'warn'}`} style={{ justifySelf: 'start' }}>{ok ? <><Icon name="check" /> Goal reached</> : msg}</span>
);
function Slider({ id, label, value, set, min, max, step, digits = 2 }) {
  return (
    <div className="slider">
      <label htmlFor={id}>{label} <span className="mono">{value.toFixed(digits)}</span></label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(+e.target.value)} />
    </div>
  );
}

/* Hours on the x-axis, probability of passing on the y-axis. */
const PX = (x) => 50 + (x / 10) * 460;
const PY = (p) => 260 - p * 220;
function StudentPlot({ curve, cut, threshold, losses }) {
  const pts = curve ? Array.from({ length: 101 }, (_, i) => `${PX(i / 10)},${PY(curve(i / 10))}`).join(' ') : '';
  return (
    <svg className="plot" viewBox="0 0 540 310" role="img" aria-label="Students: hours studied against pass or fail" fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif">
      <rect x="50" y="40" width="460" height="220" fill="#FBF6EB" />
      {[0, 0.5, 1].map((p) => (
        <g key={p}>
          <line x1="50" x2="510" y1={PY(p)} y2={PY(p)} stroke="#E7D8BC" />
          <text x="42" y={PY(p) + 4} textAnchor="end" fontSize="12" fill="#5E4C3D">{p}</text>
        </g>
      ))}
      {[0, 2, 4, 6, 8, 10].map((x) => <text key={x} x={PX(x)} y="278" textAnchor="middle" fontSize="12" fill="#5E4C3D">{x}</text>)}
      {cut !== undefined && (
        <>
          <rect x={PX(cut)} y="40" width={510 - PX(cut)} height="220" fill="#DDE3BE" opacity=".5" />
          <line x1={PX(cut)} x2={PX(cut)} y1="34" y2="262" stroke="#2E2118" strokeWidth="3" />
          <text x={PX(cut) + 6} y="54" fontSize="12" fontWeight="700" fill="#454F22">predict pass</text>
        </>
      )}
      {threshold !== undefined && <line x1="50" x2="510" y1={PY(threshold)} y2={PY(threshold)} stroke="#2E2118" strokeWidth="2" strokeDasharray="7 5" />}
      {curve && <polyline points={pts} fill="none" stroke="#C98F2B" strokeWidth="4" />}
      {STUDENTS.map(([x, y], i) => (
        <g key={i}>
          {losses && <line x1={PX(x)} x2={PX(x)} y1={PY(y)} y2={PY(y) + (y ? 1 : -1) * Math.min(60, losses[i] * 30)} stroke="#A84F32" strokeWidth="5" opacity=".45" />}
          <circle cx={PX(x)} cy={PY(y)} r="8" fill={y ? PASS : FAIL} stroke="#FBF6EB" strokeWidth="2" />
        </g>
      ))}
      <text x="280" y="302" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2E2118">Hours studied</text>
      <text x="50" y="26" fontSize="13" fontWeight="700" fill="#2E2118">Probability of passing</text>
    </svg>
  );
}

const Legend = () => (
  <div className="legend">
    <span><i style={{ background: PASS }} />Passed</span>
    <span><i style={{ background: FAIL }} />Failed</span>
    <span><i style={{ background: '#C98F2B' }} />Model</span>
  </div>
);

function Layout({ formula, controls, exercise, plot, title }) {
  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">{formula}</div>
        {controls}
        <div className="panel" style={{ display: 'grid', gap: 10 }}>{exercise}</div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>{title}</h3>
        {plot}
      </section>
    </div>
  );
}

function Cut({ level, onSolved }) {
  const [t, setT] = useState(2);
  const acc = accuracyOf((x) => x >= t);
  const ok = acc >= level.goal;
  useEffect(() => onSolved(ok), [ok, onSolved]);
  return (
    <Layout
      formula={<>pass if hours ≥ <em>{t.toFixed(1)}</em></>}
      controls={<Slider id="cut" label="Cut-off (hours)" value={t} set={setT} min="0" max="10" step="0.1" digits={1} />}
      exercise={<><p><b>Mini-exercise.</b> Find a cut-off with an accuracy of {pct(level.goal)} or more.</p><div className="readout"><span>Accuracy <span className="mse">{pct(acc)}</span></span>{chip(ok, 'Not yet')}</div></>}
      title="Twelve students"
      plot={<><StudentPlot cut={t} /><Legend /></>}
    />
  );
}

function Curve({ level, onSolved, withThreshold, withLoss }) {
  const [w, setW] = useState(0.6);
  const [b, setB] = useState(-1);
  const [th, setTh] = useState(0.5);
  const p = (x) => sigmoid(w * x + b);
  const acc = accuracyOf((x) => p(x) >= th);
  const ll = logLossOf(w, b);
  let ok;
  let exercise;
  if (withLoss) {
    ok = ll < level.goal;
    exercise = <><p><b>Mini-exercise.</b> Bring the log loss under {level.goal}. The red bars show each student&apos;s loss.</p><div className="readout"><span>Log loss <span className="mse">{ll.toFixed(3)}</span></span>{chip(ok, `Not yet: below ${level.goal}`)}</div></>;
  } else if (withThreshold) {
    ok = acc >= level.goal;
    exercise = <><p><b>Mini-exercise.</b> Reach an accuracy of {pct(level.goal)} or more.</p><div className="readout"><span>Accuracy <span className="mse">{pct(acc)}</span></span>{chip(ok, 'Not yet')}</div></>;
  } else {
    ok = p(2) < level.goal.low && p(7) > level.goal.high;
    exercise = (
      <>
        <p><b>Mini-exercise.</b> Shape the curve so a student who studied 2 hours gets a probability under {level.goal.low}, and one who studied 7 hours gets more than {level.goal.high}.</p>
        <div className="readout"><span className="mono">p(2 h) = {p(2).toFixed(2)}</span><span className="mono">p(7 h) = {p(7).toFixed(2)}</span></div>
        {chip(ok, 'Not yet')}
      </>
    );
  }
  useEffect(() => onSolved(ok), [ok, onSolved]);
  const losses = withLoss ? STUDENTS.map(([x, y]) => -Math.log(Math.max(1e-9, y ? p(x) : 1 - p(x)))) : undefined;
  return (
    <Layout
      formula={<>p = σ(<em>{w.toFixed(2)}</em>·x {b < 0 ? '−' : '+'} <em>{Math.abs(b).toFixed(1)}</em>)</>}
      controls={
        <>
          <Slider id="lw" label="Weight w (steepness)" value={w} set={setW} min="0" max="4" step="0.05" />
          <Slider id="lb" label="Bias b (shift)" value={b} set={setB} min="-20" max="0" step="0.1" digits={1} />
          {withThreshold && <Slider id="lt" label="Threshold" value={th} set={setTh} min="0.05" max="0.95" step="0.05" />}
        </>
      }
      exercise={exercise}
      title="The sigmoid over the students"
      plot={<><StudentPlot curve={p} threshold={withThreshold ? th : undefined} losses={losses} /><Legend /></>}
    />
  );
}

function Boundary({ level, onSolved }) {
  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(0);
  const [b, setB] = useState(-5);
  const score = (x1, x2) => w1 * x1 + w2 * x2 + b;
  const acc = STUDENTS_2D.filter(([x1, x2, y]) => (score(x1, x2) >= 0 ? 1 : 0) === y).length / STUDENTS_2D.length;
  const ok = acc >= level.goal;
  useEffect(() => onSolved(ok), [ok, onSolved]);
  const BX = (x) => 50 + (x / 10) * 460;
  const BY = (y) => 270 - ((y - 3) / 7) * 240;
  // Boundary: w1·x1 + w2·x2 + b = 0, drawn across the plot.
  let line = null;
  if (Math.abs(w2) > 1e-6) line = [[0, -(b) / w2], [10, -(w1 * 10 + b) / w2]];
  else if (Math.abs(w1) > 1e-6) line = [[-b / w1, 3], [-b / w1, 10]];
  return (
    <Layout
      formula={<>pass if <em>{w1.toFixed(2)}</em>·studied + <em>{w2.toFixed(2)}</em>·slept {b < 0 ? '−' : '+'} <em>{Math.abs(b).toFixed(1)}</em> ≥ 0</>}
      controls={
        <>
          <Slider id="b1" label="Weight of hours studied (w₁)" value={w1} set={setW1} min="0" max="3" step="0.05" />
          <Slider id="b2" label="Weight of hours slept (w₂)" value={w2} set={setW2} min="0" max="3" step="0.05" />
          <Slider id="b0" label="Bias b" value={b} set={setB} min="-30" max="0" step="0.5" digits={1} />
        </>
      }
      exercise={<><p><b>Mini-exercise.</b> Tilt and move the boundary to reach an accuracy of {pct(level.goal)} or more.</p><div className="readout"><span>Accuracy <span className="mse">{pct(acc)}</span></span>{chip(ok, 'Not yet')}</div></>}
      title="Studied and slept: the decision boundary"
      plot={
        <>
          <svg className="plot" viewBox="0 0 540 310" role="img" aria-label="Students by hours studied and slept, with the decision boundary" fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif">
            <defs><clipPath id="bclip"><rect x="50" y="30" width="460" height="240" /></clipPath></defs>
            <rect x="50" y="30" width="460" height="240" fill="#FBF6EB" />
            {[0, 2, 4, 6, 8, 10].map((x) => <text key={x} x={BX(x)} y="288" textAnchor="middle" fontSize="12" fill="#5E4C3D">{x}</text>)}
            {[4, 6, 8, 10].map((y) => <text key={y} x="42" y={BY(y) + 4} textAnchor="end" fontSize="12" fill="#5E4C3D">{y}</text>)}
            {line && <line x1={BX(line[0][0])} y1={BY(line[0][1])} x2={BX(line[1][0])} y2={BY(line[1][1])} stroke="#2E2118" strokeWidth="3" clipPath="url(#bclip)" />}
            {STUDENTS_2D.map(([x1, x2, y], i) => {
              const right = (score(x1, x2) >= 0 ? 1 : 0) === y;
              return <circle key={i} cx={BX(x1)} cy={BY(x2)} r="8" fill={y ? PASS : FAIL} stroke={right ? '#FBF6EB' : '#2E2118'} strokeWidth={right ? 2 : 3} />;
            })}
            <text x="280" y="306" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2E2118">Hours studied</text>
            <text x="50" y="22" fontSize="13" fontWeight="700" fill="#2E2118">Hours slept</text>
          </svg>
          <div className="legend"><span><i style={{ background: PASS }} />Passed</span><span><i style={{ background: FAIL }} />Failed</span><span>Dark ring = misclassified</span></div>
        </>
      }
    />
  );
}

const RATES = [[0.005, 'Small'], [0.5, 'Good'], [5, 'Big']];
const EPOCHS = 400;
function Train({ level, onSolved }) {
  const [lr, setLr] = useState(0.5);
  const [model, setModel] = useState(null);
  const [hist, setHist] = useState([]);
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const ll = model ? logLossOf(model.w, model.b) : null;
  const done = hist.length >= EPOCHS;
  const ok = done && ll < level.goal;
  useEffect(() => onSolved(ok), [ok, onSolved]);

  const train = () => {
    cancelAnimationFrame(raf.current);
    // Train on centred hours (x − 5) so both parameters learn at a similar pace.
    let w = 0;
    let c = 0;
    let e = 0;
    const h = [];
    const tick = () => {
      for (let s = 0; s < 8 && e < EPOCHS; s++, e++) {
        let gw = 0;
        let gc = 0;
        STUDENTS.forEach(([x, y]) => {
          const err = sigmoid(w * (x - 5) + c) - y;
          gw += err * (x - 5);
          gc += err;
        });
        w -= (lr * gw) / STUDENTS.length;
        c -= (lr * gc) / STUDENTS.length;
        h.push(logLossOf(w, c - 5 * w));
      }
      setHist([...h]);
      setModel({ w, b: c - 5 * w });
      if (e < EPOCHS) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const maxL = Math.max(...hist.slice(0, 1), 0.8);
  return (
    <Layout
      formula={<>minimise log loss with gradient descent</>}
      controls={
        <>
          <div className="pick">
            {RATES.map(([v, t]) => (
              <button key={v} type="button" className={v === lr ? 'on' : ''} aria-pressed={v === lr} onClick={() => { setLr(v); setHist([]); setModel(null); }}>{t} step <span className="mono">{v}</span></button>
            ))}
          </div>
          <div className="actions"><button className="btn moss big" type="button" onClick={train}>Train {EPOCHS} epochs</button></div>
          {hist.length > 0 && (
            <svg className="plot" viewBox="0 0 520 160" role="img" aria-label="Log loss over training epochs" fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif">
              <line x1="40" x2="500" y1="130" y2="130" stroke="#2E2118" strokeWidth="2" />
              <line x1="40" x2="40" y1="10" y2="130" stroke="#2E2118" strokeWidth="2" />
              <polyline points={hist.map((l, i) => `${40 + (i / EPOCHS) * 460},${130 - Math.min(l / maxL, 1) * 115}`).join(' ')} fill="none" stroke="#A84F32" strokeWidth="3" />
              <text x="270" y="152" textAnchor="middle" fontSize="12" fill="#5E4C3D">Epochs</text>
            </svg>
          )}
        </>
      }
      exercise={<><p><b>Mini-exercise.</b> Train until the log loss is under {level.goal}.</p><div className="readout"><span>Log loss <span className="mse">{ll === null ? '–' : ll.toFixed(3)}</span></span>{chip(ok, done ? 'Not low enough: try another step size' : 'Press Train')}</div></>}
      title="The curve the model learned"
      plot={<><StudentPlot curve={model ? (x) => sigmoid(model.w * x + model.b) : undefined} threshold={0.5} /><Legend /></>}
    />
  );
}

export default function LogisticLab({ level, onSolved }) {
  switch (level.mode) {
    case 'cut': return <Cut level={level} onSolved={onSolved} />;
    case 'sigmoid': return <Curve level={level} onSolved={onSolved} />;
    case 'threshold': return <Curve level={level} onSolved={onSolved} withThreshold />;
    case 'boundary': return <Boundary level={level} onSolved={onSolved} />;
    case 'logloss': return <Curve level={level} onSolved={onSolved} withLoss />;
    default: return <Train level={level} onSolved={onSolved} />;
  }
}
