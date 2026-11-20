/* Ch. 3, level 2 — Taking a step by hand: fill the gradient-descent table (η = 0.1, start w = 0)
   for three iterations; each correct row adds a step to the valley plot. */
import { useEffect, useState } from 'react';
import { Goal, Hint, NumberCheck, isClose } from '../common.jsx';
import { LY, ValleyFrame, WX, curvePoints, grad, loss } from './valley.jsx';

const ETA = 0.1;
const START = 0;
const ROWS = 3;
// The exact path: 0 → 0.6 → 1.08 → 1.464
const PATH = [START];
for (let i = 0; i < ROWS; i++) PATH.push(PATH[i] - ETA * grad(PATH[i]));

export default function ManualStepLab({ onSolved }) {
  const [vals, setVals] = useState(() => Array.from({ length: ROWS }, () => ({ g: '', w: '' })));
  const [tries, setTries] = useState(0);
  const set = (i, k) => (v) => setVals((old) => old.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  const rowOk = (i) => isClose(vals[i].g, grad(PATH[i]), 0.01) && isClose(vals[i].w, PATH[i + 1], 0.01);
  let done = 0;
  while (done < ROWS && rowOk(done)) done++;
  const ok = done === ROWS;
  useEffect(() => onSolved(ok), [ok, onSolved]);
  const shown = PATH.slice(0, done + 1);

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">
          w ← w − <em>{ETA}</em> × J′(w), J′(w) = 2(w − 3)
        </div>
        <div className="panel" style={{ display: 'grid', gap: 12 }}>
          <p>Fill in each row. A new row opens when the previous one is correct.</p>
          {PATH.slice(0, ROWS).map((w, i) =>
            i > done ? null : (
              <fieldset key={i} className="step-box">
                <legend>
                  <b>Step {i + 1}</b>: w = {Number(w.toFixed(3))}
                </legend>
                <div className="num-grid">
                  <NumberCheck
                    id={`g${i}`}
                    label="J′(w)"
                    expected={grad(w)}
                    value={vals[i].g}
                    onChange={set(i, 'g')}
                    onTry={() => setTries((t) => t + 1)}
                  />
                  <NumberCheck
                    id={`w${i}`}
                    label="new w"
                    expected={PATH[i + 1]}
                    value={vals[i].w}
                    onChange={set(i, 'w')}
                    onTry={() => setTries((t) => t + 1)}
                  />
                </div>
              </fieldset>
            ),
          )}
          <Goal ok={ok} text={`${done}/${ROWS} steps done`} />
          {ok && <p>Each step closed 20% of the gap to 3, and the steps get shorter as the slope flattens.</p>}
          <Hint tries={tries}>
            At w = {Number(PATH[Math.min(done, ROWS - 1)].toFixed(3))}: J′ = 2 × (
            {Number(PATH[Math.min(done, ROWS - 1)].toFixed(3))} − 3). Then new w = w − 0.1 × J′ (minus a negative number
            moves right).
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Your steps down the valley</h3>
        <ValleyFrame label={`Loss curve with ${done} manual steps`}>
          <polyline points={curvePoints()} fill="none" stroke="#6B4A33" strokeWidth="3.5" />
          {shown.length > 1 && (
            <polyline
              points={shown.map((p) => `${WX(p)},${LY(loss(p))}`).join(' ')}
              fill="none"
              stroke="#C98F2B"
              strokeWidth="2"
              strokeDasharray="5 4"
            />
          )}
          {shown.map((p, i) => (
            <g key={i}>
              <circle
                cx={WX(p)}
                cy={LY(loss(p))}
                r={i === shown.length - 1 ? 9 : 5}
                fill={i === shown.length - 1 ? '#A84F32' : '#C98F2B'}
                stroke="#FBF6EB"
                strokeWidth="2"
              />
              <text x={WX(p)} y={LY(loss(p)) - 14} textAnchor="middle" fontSize="12" fill="#2E2118">
                w{i}
              </text>
            </g>
          ))}
          <line x1={WX(3)} x2={WX(3)} y1="270" y2="280" stroke="#5F6D32" strokeWidth="3" />
        </ValleyFrame>
      </section>
    </div>
  );
}
