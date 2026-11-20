/* Ch. 3, level 4 — Knowing when to stop: run gradient descent (η = 0.1, start w = 0) with the rule
   "stop when |J′(w)| < ε" for four tolerances, read the pattern, and respect an iteration budget. */
import { useEffect, useState } from 'react';
import { Choice, Goal, Hint, NumberCheck, isClose } from '../common.jsx';
import { grad } from './valley.jsx';

const ETA = 0.1;
const TOLS = [1e-1, 1e-2, 1e-3, 1e-4];
const BUDGET = 40;
const stepsFor = (eps) => {
  let w = 0;
  let k = 0;
  while (Math.abs(grad(w)) >= eps) {
    w -= ETA * grad(w);
    k++;
  }
  return k;
};
const NEEDED = TOLS.map(stepsFor); // 19, 29, 39, 50
const MAX_STEP = 55;
const SX = (s) => 60 + (s / MAX_STEP) * 460;
const SY = (lg) => 40 + ((1 - lg) / 6) * 230; // log10 |J′| from 1 down to −5
const fmt = (e) => `10${['⁻¹', '⁻²', '⁻³', '⁻⁴'][TOLS.indexOf(e)]}`;

export default function StopLab({ onSolved }) {
  const [done, setDone] = useState([]);
  const [perDigit, setPerDigit] = useState('');
  const [budget, setBudget] = useState(null);
  const [tries, setTries] = useState(0);
  const allRun = done.length === TOLS.length;
  const ok = allRun && isClose(perDigit, 10, 1) && budget === 'e4';
  useEffect(() => onSolved(ok), [ok, onSolved]);

  const curve = Array.from({ length: MAX_STEP + 1 }, (_, k) => {
    const g = Math.abs(grad(0)) * (1 - 2 * ETA) ** k;
    return `${SX(k)},${SY(Math.log10(g))}`;
  }).join(' ');

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">stop when |J′(w)| &lt; ε</div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 1.</b> Run gradient descent (η = {ETA}, start w = 0) with each tolerance.
          </p>
          <div className="actions">
            {TOLS.map((e) => (
              <button
                key={e}
                type="button"
                className={`btn ${done.includes(e) ? 'moss' : ''}`}
                onClick={() => setDone((d) => (d.includes(e) ? d : [...d, e]))}
              >
                ε = {fmt(e)}
              </button>
            ))}
          </div>
          <table className="mini-table">
            <thead>
              <tr>
                <th>Tolerance ε</th>
                <th>Steps needed</th>
              </tr>
            </thead>
            <tbody>
              {TOLS.map((e, i) => (
                <tr key={e}>
                  <th>{fmt(e)}</th>
                  <td className="mono">{done.includes(e) ? NEEDED[i] : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {allRun && (
          <div className="panel" style={{ display: 'grid', gap: 10 }}>
            <p>
              <b>Step 2.</b> Read your table.
            </p>
            <NumberCheck
              id="perdigit"
              label="About how many extra steps for each extra digit of precision?"
              expected={10}
              tolerance={1}
              value={perDigit}
              onChange={setPerDigit}
              onTry={() => setTries((t) => t + 1)}
            />
            <p style={{ fontWeight: 700 }}>
              Your training has a budget of {BUDGET} iterations. Which tolerance can it not reach?
            </p>
            <Choice
              label="Which tolerance is out of budget?"
              options={TOLS.map((e, i) => [`e${i + 1}`, `ε = ${fmt(e)}`])}
              answer="e4"
              value={budget}
              onPick={(v) => {
                setBudget(v);
                if (v !== 'e4') setTries((t) => t + 1);
              }}
            />
          </div>
        )}
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <Goal ok={ok} text={allRun ? 'Answer the two questions' : `Run all four tolerances (${done.length}/4)`} />
          <Hint tries={tries}>
            Compare consecutive rows: 19 → 29 → 39 → 50. For the budget, find the first row above {BUDGET}.
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Size of the gradient at each step (log scale)</h3>
        <svg
          className="plot"
          viewBox="0 0 540 320"
          role="img"
          aria-label="Gradient size against steps on a logarithmic scale: a straight line"
          fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif"
        >
          {[1, 0, -1, -2, -3, -4, -5].map((lg) => (
            <g key={lg}>
              <line x1="60" x2="520" y1={SY(lg)} y2={SY(lg)} stroke="#E7D8BC" />
              <text x="52" y={SY(lg) + 4} textAnchor="end" fontSize="12" fill="#5E4C3D">
                {lg === 0 ? '1' : lg === 1 ? '10' : `10^${lg}`}
              </text>
            </g>
          ))}
          {[0, 10, 20, 30, 40, 50].map((s) => (
            <text key={s} x={SX(s)} y="290" textAnchor="middle" fontSize="12" fill="#5E4C3D">
              {s}
            </text>
          ))}
          <line
            x1={SX(BUDGET)}
            x2={SX(BUDGET)}
            y1="30"
            y2="270"
            stroke="#A84F32"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <text x={SX(BUDGET) + 6} y="34" fontSize="12" fill="#A84F32">
            budget
          </text>
          <polyline points={curve} fill="none" stroke="#6B4A33" strokeWidth="3" />
          {done.map((e) => {
            const k = NEEDED[TOLS.indexOf(e)];
            return (
              <g key={e}>
                <line
                  x1="60"
                  x2={SX(k)}
                  y1={SY(Math.log10(e))}
                  y2={SY(Math.log10(e))}
                  stroke="#5F6D32"
                  strokeDasharray="4 4"
                />
                <circle cx={SX(k)} cy={SY(Math.log10(e))} r="7" fill="#5F6D32" stroke="#FBF6EB" strokeWidth="2" />
              </g>
            );
          })}
          <text x="290" y="310" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2E2118">
            Step
          </text>
        </svg>
        <p className="muted">
          On a log scale the gradient shrinks along a straight line: the same number of steps buys each new digit
          (linear convergence).
        </p>
      </section>
    </div>
  );
}
