/* Chapter 3: gradient descent.
   Default mode: one weight, loss(w) = (w − 3)².
   '2d':  two weights, loss = (w₁ − 3)² + 4·(w₂ − 1)², drawn as a contour map.
   'sgd': the gradient is estimated from a random batch of 1, 4 or all 16 examples. */
import { useEffect, useState } from 'react';
import Icon from '../Icon.jsx';

const goalChip = (ok, msg) => (
  <span className={`chip ${ok ? 'good' : 'warn'}`} style={{ justifySelf: 'start' }}>
    {ok ? <><Icon name="check" /> Goal reached</> : msg}
  </span>
);

function Controls({ lr, setLr, min, max, step, onStep, onRun, onReset, disabled }) {
  return (
    <>
      <div className="slider">
        <label htmlFor="lr">Learning rate <span className="mono">{lr.toFixed(2)}</span></label>
        <input id="lr" type="range" min={min} max={max} step={step} value={lr} onChange={(e) => { setLr(+e.target.value); onReset(); }} />
      </div>
      <div className="actions">
        <button className="btn primary" type="button" onClick={onStep} disabled={disabled}>Step</button>
        <button className="btn" type="button" onClick={onRun} disabled={disabled}>10 steps</button>
        <button className="btn ghost" type="button" onClick={onReset}>Reset</button>
      </div>
    </>
  );
}

/* ---------- One weight ---------- */
const loss1 = (w) => (w - 3) ** 2;
const WX = (w) => 50 + ((w + 2) / 10) * 470; // w from −2 to 8
const LY = (l) => 280 - (Math.min(l, 26) / 26) * 250;

function ValleyPlot({ path, lossOf }) {
  const w = path[path.length - 1];
  const curve = Array.from({ length: 101 }, (_, i) => {
    const x = -2 + i / 10;
    return `${WX(x)},${LY(loss1(x))}`;
  }).join(' ');
  const visible = path.filter((p) => p >= -2 && p <= 8);
  const inside = Number.isFinite(w) && w >= -2 && w <= 8;
  return (
    <svg className="plot" viewBox="0 0 540 320" role="img" aria-label={`Loss curve with the current weight at ${Number.isFinite(w) ? w.toFixed(2) : 'off the chart'}`} fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif">
      <line x1="50" x2="520" y1="280" y2="280" stroke="#2E2118" strokeWidth="2" />
      <line x1="50" x2="50" y1="20" y2="280" stroke="#2E2118" strokeWidth="2" />
      {[-2, 0, 2, 4, 6, 8].map((v) => <text key={v} x={WX(v)} y="298" textAnchor="middle" fontSize="12" fill="#5E4C3D">{v}</text>)}
      <polyline points={curve} fill="none" stroke="#6B4A33" strokeWidth="3.5" />
      <line x1={WX(3)} x2={WX(3)} y1="270" y2="280" stroke="#5F6D32" strokeWidth="3" />
      {visible.length > 1 && <polyline points={visible.map((p) => `${WX(p)},${LY(lossOf(p))}`).join(' ')} fill="none" stroke="#C98F2B" strokeWidth="2" strokeDasharray="5 4" />}
      {visible.slice(0, -1).map((p, i) => <circle key={i} cx={WX(p)} cy={LY(lossOf(p))} r="4" fill="#C98F2B" />)}
      {inside && <circle cx={WX(w)} cy={LY(lossOf(w)) - 9} r="9" fill="#A84F32" stroke="#FBF6EB" strokeWidth="2.5" />}
      <text x="285" y="316" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2E2118">Weight w (the best value is 3)</text>
      <text x="58" y="16" fontSize="13" fontWeight="700" fill="#2E2118">Loss</text>
    </svg>
  );
}

function OneWeight({ level, onSolved }) {
  const [lr, setLr] = useState(0.1);
  const [path, setPath] = useState([-1]);
  const w = path[path.length - 1];
  const steps = path.length - 1;
  const l = loss1(w);
  const exploded = !Number.isFinite(l) || Math.abs(w) > 1e3;
  const withinSteps = !level.maxSteps || steps <= level.maxSteps;
  const ok = !exploded && l < level.goal && withinSteps;
  useEffect(() => onSolved(ok), [ok, onSolved]);
  const next = (p) => p - lr * 2 * (p - 3);
  const step = () => setPath((p) => [...p, next(p[p.length - 1])]);
  const run = () => setPath((p) => { const o = [...p]; for (let i = 0; i < 10; i++) o.push(next(o[o.length - 1])); return o; });

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">w ← w − <em>{lr.toFixed(2)}</em> × gradient</div>
        <Controls lr={lr} setLr={setLr} min="0.01" max="1.1" step="0.01" onStep={step} onRun={run} onReset={() => setPath([-1])} disabled={exploded} />
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p><b>Mini-exercise.</b> Reach a loss under {level.goal}{level.maxSteps ? ` in ${level.maxSteps} steps or fewer` : ''}.</p>
          <div className="readout">
            <span>Loss <span className="mse">{exploded ? '∞' : l.toFixed(3)}</span></span>
            <span className="mono">step {steps}, w = {exploded ? '?' : w.toFixed(3)}</span>
          </div>
          {goalChip(ok, exploded ? 'The loss exploded: lower the learning rate' : !withinSteps ? 'Too many steps: reset and try a bigger rate' : `Not yet: below ${level.goal}`)}
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>The loss valley</h3>
        <ValleyPlot path={path} lossOf={loss1} />
      </section>
    </div>
  );
}

/* ---------- Two weights ---------- */
const loss2 = ([a, b]) => (a - 3) ** 2 + 4 * (b - 1) ** 2;
const CX = (a) => 40 + ((a + 2) / 8) * 460; // w₁ from −2 to 6
const CY = (b) => 300 - ((b + 1) / 4) * 270; // w₂ from −1 to 3

function TwoWeights({ level, onSolved }) {
  const START = [-1, 2.6];
  const [lr, setLr] = useState(0.1);
  const [path, setPath] = useState([START]);
  const p = path[path.length - 1];
  const steps = path.length - 1;
  const l = loss2(p);
  const exploded = !Number.isFinite(l) || l > 1e4;
  const withinSteps = steps <= level.maxSteps;
  const ok = !exploded && l < level.goal && withinSteps;
  useEffect(() => onSolved(ok), [ok, onSolved]);
  const next = ([a, b]) => [a - lr * 2 * (a - 3), b - lr * 8 * (b - 1)];
  const step = () => setPath((q) => [...q, next(q[q.length - 1])]);
  const run = () => setPath((q) => { const o = [...q]; for (let i = 0; i < 10; i++) o.push(next(o[o.length - 1])); return o; });
  const clip = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">(w₁, w₂) ← (w₁, w₂) − <em>{lr.toFixed(2)}</em> × gradient</div>
        <Controls lr={lr} setLr={setLr} min="0.01" max="0.3" step="0.01" onStep={step} onRun={run} onReset={() => setPath([START])} disabled={exploded} />
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p><b>Mini-exercise.</b> Reach the centre of the bowl (loss under {level.goal}) in {level.maxSteps} steps or fewer.</p>
          <div className="readout">
            <span>Loss <span className="mse">{exploded ? '∞' : l.toFixed(3)}</span></span>
            <span className="mono">step {steps}</span>
          </div>
          <p className="mono">w₁ = {exploded ? '?' : p[0].toFixed(2)}, w₂ = {exploded ? '?' : p[1].toFixed(2)}</p>
          {goalChip(ok, exploded ? 'Diverged: the path zigzags out of the bowl. Lower the rate.' : !withinSteps ? 'Too many steps: reset and try a bigger rate' : `Not yet: below ${level.goal}`)}
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>The loss bowl, seen from above</h3>
        <svg className="plot" viewBox="0 0 540 330" role="img" aria-label="Contour map of the loss with the descent path" fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif">
          <rect x="40" y="30" width="460" height="270" fill="#FBF6EB" />
          {[0.25, 1, 2.5, 5, 9, 16, 25].map((c, i) => (
            <ellipse key={c} cx={CX(3)} cy={CY(1)} rx={(Math.sqrt(c) / 8) * 460} ry={(Math.sqrt(c / 4) / 4) * 270} fill={i === 0 ? '#DDE3BE' : 'none'} stroke="#B8AD9A" strokeWidth="1.5" />
          ))}
          <polyline points={path.map(([a, b]) => `${CX(clip(a, -2, 6))},${CY(clip(b, -1, 3))}`).join(' ')} fill="none" stroke="#C98F2B" strokeWidth="2.5" />
          {path.slice(0, -1).map(([a, b], i) => <circle key={i} cx={CX(clip(a, -2, 6))} cy={CY(clip(b, -1, 3))} r="3.5" fill="#C98F2B" />)}
          {!exploded && <circle cx={CX(clip(p[0], -2, 6))} cy={CY(clip(p[1], -1, 3))} r="8" fill="#A84F32" stroke="#FBF6EB" strokeWidth="2.5" />}
          <circle cx={CX(3)} cy={CY(1)} r="4" fill="#5F6D32" />
          <text x="270" y="324" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2E2118">Weight w₁</text>
          <text x="46" y="22" fontSize="13" fontWeight="700" fill="#2E2118">Weight w₂</text>
        </svg>
      </section>
    </div>
  );
}

/* ---------- Mini-batch / SGD ---------- */
// 16 examples whose best estimate is their mean, 3. The batch gradient is 2·(w − mean of the batch).
const SAMPLES = [2.1, 3.8, 2.6, 3.4, 1.9, 4.1, 2.9, 3.2, 2.4, 3.6, 3.1, 2.8, 4.0, 2.2, 3.3, 2.6];
const MEAN = SAMPLES.reduce((s, v) => s + v, 0) / SAMPLES.length;
const BATCHES = [1, 4, 16];

function MiniBatch({ level, onSolved }) {
  const [batch, setBatch] = useState(1);
  const [lr, setLr] = useState(0.1);
  const [path, setPath] = useState([-1]);
  const [seen, setSeen] = useState(0);
  const w = path[path.length - 1];
  const excess = (v) => (v - MEAN) ** 2;
  const l = excess(w);
  const ok = l < level.goal && batch <= level.maxBatch && path.length > 1;
  useEffect(() => onSolved(ok), [ok, onSolved]);

  const draw = () => {
    if (batch === SAMPLES.length) return MEAN;
    let s = 0;
    for (let i = 0; i < batch; i++) s += SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
    return s / batch;
  };
  const advance = (n) => {
    setPath((p) => {
      const o = [...p];
      for (let i = 0; i < n; i++) {
        const cur = o[o.length - 1];
        o.push(cur - lr * 2 * (cur - draw()));
      }
      return o;
    });
    setSeen((s) => s + n * batch);
  };
  const reset = () => { setPath([-1]); setSeen(0); };

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">gradient from a batch of <em>{batch}</em> example{batch > 1 ? 's' : ''}</div>
        <div style={{ display: 'grid', gap: 6 }}>
          <b>Batch size</b>
          <div className="pick">
            {BATCHES.map((b) => (
              <button key={b} type="button" className={b === batch ? 'on' : ''} aria-pressed={b === batch} onClick={() => { setBatch(b); reset(); }}>
                {b === 1 ? 'SGD (1)' : b === 16 ? 'Full batch (16)' : `Mini-batch (${b})`}
              </button>
            ))}
          </div>
        </div>
        <Controls lr={lr} setLr={setLr} min="0.02" max="0.5" step="0.01" onStep={() => advance(1)} onRun={() => advance(10)} onReset={reset} />
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p><b>Mini-exercise.</b> With a batch of {level.maxBatch} or fewer, get the loss under {level.goal}.</p>
          <div className="readout">
            <span>Loss <span className="mse">{l.toFixed(3)}</span></span>
            <span className="mono">{path.length - 1} steps, {seen} examples read</span>
          </div>
          {goalChip(ok, batch > level.maxBatch ? `Full batch works, but use a batch of ${level.maxBatch} or fewer here` : `Not yet: below ${level.goal}`)}
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Noisy steps down the valley</h3>
        <ValleyPlot path={path} lossOf={(v) => excess(v) + 0.0001} />
        <p className="muted">The full batch walks smoothly. Small batches wobble around the bottom, but each step reads far fewer examples.</p>
      </section>
    </div>
  );
}

export default function DescentLab(props) {
  if (props.level.mode === '2d') return <TwoWeights {...props} />;
  if (props.level.mode === 'sgd') return <MiniBatch {...props} />;
  return <OneWeight {...props} />;
}
