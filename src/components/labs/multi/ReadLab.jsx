/* Ch. 2, level 2 — Reading coefficients: play "what if" with one flat, see how each weight contributes,
   then answer three questions by reading the model. */
import { useEffect, useState } from 'react';
import { Choice, Goal, Hint, NumberCheck, isClose } from '../common.jsx';
import { TRUE_MODEL } from './data.jsx';

const { w1, w2, b } = TRUE_MODEL;
const price = (area, dist) => w1 * area + w2 * dist + b;
const FLAT_A = [100, 6];
const FLAT_B = [80, 1];

export default function ReadLab({ onSolved }) {
  const [area, setArea] = useState(80);
  const [dist, setDist] = useState(4);
  const [log, setLog] = useState([]);
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState(null);
  const [tries, setTries] = useState(0);

  const change = (dArea, dDist) => {
    const before = price(area, dist);
    const na = Math.max(30, Math.min(150, area + dArea));
    const nd = Math.max(0, Math.min(15, dist + dDist));
    setArea(na);
    setDist(nd);
    const label = dArea ? `${dArea > 0 ? '+' : '−'}10 m²` : `${dDist > 0 ? '+' : '−'}1 km`;
    const delta = price(na, nd) - before;
    if (delta !== 0) setLog((l) => [`${label} → price ${delta > 0 ? '+' : '−'}${Math.abs(delta)}`, ...l].slice(0, 4));
  };
  const ok = isClose(q1, 10 * w1) && isClose(q2, w2) && q3 === 'B';
  useEffect(() => onSolved(ok), [ok, onSolved]);

  const parts = [
    ['Bias', b, '#6B4A33'],
    [`Area: ${w1} × ${area}`, w1 * area, '#5F6D32'],
    [`Distance: ${w2} × ${dist}`, w2 * dist, '#A84F32'],
  ];
  const total = price(area, dist);
  const SX = (v) => 20 + (v / 300) * 480;
  let run = 0;

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">
          price = <em>1.5</em>·area − <em>8</em>·dist + <em>60</em>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>What if?</b> Change the flat and watch the price move.
          </p>
          <div className="actions">
            <button type="button" className="btn" onClick={() => change(-10, 0)}>
              −10 m²
            </button>
            <button type="button" className="btn" onClick={() => change(10, 0)}>
              +10 m²
            </button>
            <button type="button" className="btn" onClick={() => change(0, -1)}>
              −1 km
            </button>
            <button type="button" className="btn" onClick={() => change(0, 1)}>
              +1 km
            </button>
          </div>
          <p className="mono" aria-live="polite">
            {area} m², {dist} km → {total} thousand TND
          </p>
          {log.length > 0 && (
            <ul className="lb-list muted">
              {log.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <NumberCheck
            id="rq1"
            label="1. Area grows by 10 m² (same distance). Price change?"
            expected={10 * w1}
            value={q1}
            onChange={setQ1}
            onTry={() => setTries((t) => t + 1)}
          />
          <NumberCheck
            id="rq2"
            label="2. One more km from the centre (same area). Price change?"
            expected={w2}
            value={q2}
            onChange={setQ2}
            onTry={() => setTries((t) => t + 1)}
          />
          <p style={{ fontWeight: 700 }}>
            3. Which flat is more expensive? A: {FLAT_A[0]} m², {FLAT_A[1]} km — B: {FLAT_B[0]} m², {FLAT_B[1]} km
          </p>
          <Choice
            label="Which flat is more expensive?"
            options={[
              ['A', 'Flat A'],
              ['B', 'Flat B'],
            ]}
            answer="B"
            value={q3}
            onPick={(v) => {
              setQ3(v);
              if (v !== 'B') setTries((t) => t + 1);
            }}
          />
          <Goal ok={ok} text="Answer the three questions" />
          <Hint tries={tries}>
            A weight is the change for one unit: 10 m² × 1.5. For question 3, compute both prices: A = 1.5×100 − 8×6 +
            60, B = 1.5×80 − 8×1 + 60.
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Where the price comes from</h3>
        <svg
          className="plot"
          viewBox="0 0 540 250"
          role="img"
          aria-label={`Price of ${total}: bias ${b}, area ${w1 * area}, distance ${w2 * dist}`}
          fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif"
        >
          {parts.map(([label, v, color], i) => {
            const start = run;
            run += v;
            const x1 = SX(Math.min(start, run));
            const width = Math.abs(SX(run) - SX(start));
            return (
              <g key={label}>
                <rect x={x1} y={30 + i * 52} width={Math.max(2, width)} height="34" rx="4" fill={color} />
                <text x={SX(Math.max(start, run)) + 8} y={52 + i * 52} fontSize="13" fill="#2E2118">
                  {label} = {v > 0 ? '+' : ''}
                  {v}
                </text>
              </g>
            );
          })}
          <rect x={SX(0)} y="190" width={SX(total) - SX(0)} height="34" rx="4" fill="#2E2118" />
          <text x={SX(total) + 8} y="212" fontSize="14" fontWeight="700" fill="#2E2118">
            Price = {total}
          </text>
          <line x1={SX(0)} x2={SX(0)} y1="20" y2="232" stroke="#2E2118" strokeWidth="2" />
        </svg>
        <p className="muted">Each bar starts where the previous one ended: a negative weight pulls the total back.</p>
      </section>
    </div>
  );
}
