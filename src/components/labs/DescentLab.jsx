/* Chapter 3: gradient descent on loss(w) = (w − 3)², one step at a time. */
import { useEffect, useState } from 'react';
import Icon from '../Icon.jsx';

const loss = (w) => (w - 3) ** 2;
const grad = (w) => 2 * (w - 3);
const START = -1;
const WX = (w) => 50 + ((w + 2) / 10) * 470; // w from −2 to 8
const LY = (l) => 280 - Math.min(l, 26) / 26 * 250;

export default function DescentLab({ level, onSolved }) {
  const [lr, setLr] = useState(0.1);
  const [path, setPath] = useState([START]);
  const w = path[path.length - 1];
  const steps = path.length - 1;
  const l = loss(w);
  const exploded = !Number.isFinite(l) || Math.abs(w) > 1e3;
  const withinSteps = !level.maxSteps || steps <= level.maxSteps;
  const ok = !exploded && l < level.goal && withinSteps;
  useEffect(() => onSolved(ok), [ok, onSolved]);

  const step = () => setPath((p) => [...p, p[p.length - 1] - lr * grad(p[p.length - 1])]);
  const run = () => setPath((p) => {
    const out = [...p];
    for (let i = 0; i < 10; i++) out.push(out[out.length - 1] - lr * grad(out[out.length - 1]));
    return out;
  });
  const reset = () => setPath([START]);

  const curve = Array.from({ length: 101 }, (_, i) => {
    const x = -2 + i / 10;
    return `${WX(x)},${LY(loss(x))}`;
  }).join(' ');
  const visible = path.filter((p) => p >= -2 && p <= 8);

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">w ← w − <em>{lr.toFixed(2)}</em> × gradient</div>
        <div className="slider">
          <label htmlFor="lr">Learning rate <span className="mono">{lr.toFixed(2)}</span></label>
          <input id="lr" type="range" min="0.01" max="1.1" step="0.01" value={lr} onChange={(e) => { setLr(+e.target.value); reset(); }} />
        </div>
        <div className="actions">
          <button className="btn primary" type="button" onClick={step} disabled={exploded}>Step</button>
          <button className="btn" type="button" onClick={run} disabled={exploded}>10 steps</button>
          <button className="btn ghost" type="button" onClick={reset}>Reset</button>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Mini-exercise.</b> Reach a loss under {level.goal}
            {level.maxSteps ? ` in ${level.maxSteps} steps or fewer` : ''}.
          </p>
          <div className="readout">
            <span>Loss <span className="mse">{exploded ? '∞' : l.toFixed(3)}</span></span>
            <span className="mono">step {steps}, w = {exploded ? '?' : w.toFixed(3)}</span>
          </div>
          <span className={`chip ${ok ? 'good' : 'warn'}`} style={{ justifySelf: 'start' }}>
            {ok ? <><Icon name="check" /> Goal reached</> : exploded ? 'The loss exploded: lower the learning rate' : !withinSteps ? 'Too many steps: reset and try a bigger rate' : `Not yet: below ${level.goal}`}
          </span>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>The loss valley</h3>
        <svg className="plot" viewBox="0 0 540 320" role="img" aria-label={`Loss curve with the current weight at ${w.toFixed(2)}`} fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif">
          <line x1="50" x2="520" y1="280" y2="280" stroke="#2E2118" strokeWidth="2" />
          <line x1="50" x2="50" y1="20" y2="280" stroke="#2E2118" strokeWidth="2" />
          {[-2, 0, 2, 4, 6, 8].map((v) => <text key={v} x={WX(v)} y="298" textAnchor="middle" fontSize="12" fill="#5E4C3D">{v}</text>)}
          <polyline points={curve} fill="none" stroke="#6B4A33" strokeWidth="3.5" />
          <line x1={WX(3)} x2={WX(3)} y1="270" y2="280" stroke="#5F6D32" strokeWidth="3" />
          {visible.length > 1 && <polyline points={visible.map((p) => `${WX(p)},${LY(loss(p))}`).join(' ')} fill="none" stroke="#C98F2B" strokeWidth="2" strokeDasharray="5 4" />}
          {visible.slice(0, -1).map((p, i) => <circle key={i} cx={WX(p)} cy={LY(loss(p))} r="4" fill="#C98F2B" />)}
          {!exploded && w >= -2 && w <= 8 && <circle cx={WX(w)} cy={LY(l) - 9} r="9" fill="#A84F32" stroke="#FBF6EB" strokeWidth="2.5" />}
          <text x="285" y="316" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2E2118">Weight w (the best value is 3)</text>
          <text x="58" y="16" fontSize="13" fontWeight="700" fill="#2E2118">Loss</text>
        </svg>
      </section>
    </div>
  );
}
