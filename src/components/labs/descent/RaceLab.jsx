/* Ch. 3, level 3 — Learning-rate race: four runners start at w = −1 with different learning rates.
   Name each one's behaviour, then find your own rate that reaches the bottom in 5 steps. */
import { useEffect, useState } from 'react';
import { Choice, Goal, Hint } from '../common.jsx';
import { grad, loss } from './valley.jsx';

const START = -1;
const STEPS = 12;
const RUNNERS = [
  { eta: 0.02, color: '#6E6455', answer: 'slow' },
  { eta: 0.2, color: '#5F6D32', answer: 'good' },
  { eta: 0.5, color: '#97691A', answer: 'jump' },
  { eta: 1.02, color: '#A84F32', answer: 'diverge' },
];
const KINDS = [
  ['slow', 'Too slow'],
  ['good', 'Smooth descent'],
  ['jump', 'Lands in one step'],
  ['diverge', 'Bounces and grows'],
];
const run = (eta, steps) => {
  const ws = [START];
  for (let i = 0; i < steps; i++) ws.push(ws[i] - eta * grad(ws[i]));
  return ws.map(loss);
};
const SX = (s) => 50 + (s / STEPS) * 470;
const SY = (l) => 270 - (Math.min(l, 26) / 26) * 240;
const OWN_STEPS = 5;
const OWN_GOAL = 0.01;

export default function RaceLab({ onSolved }) {
  const [labels, setLabels] = useState({});
  const [eta, setEta] = useState(0.1);
  const [ran, setRan] = useState(false);
  const [tries, setTries] = useState(0);
  const own = run(eta, OWN_STEPS);
  const ownOk = ran && own[OWN_STEPS] < OWN_GOAL;
  const labelsOk = RUNNERS.every((r, i) => labels[i] === r.answer);
  const ok = labelsOk && ownOk;
  useEffect(() => onSolved(ok), [ok, onSolved]);
  const line = (ls) => ls.map((l, s) => `${SX(s)},${SY(l)}`).join(' ');

  return (
    <div className="lesson">
      <section className="lab">
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Part 1.</b> Four runners, same valley J(w) = (w − 3)², different learning rates. Name what each one does.
          </p>
          {RUNNERS.map((r, i) => (
            <div key={r.eta} className="sort-card">
              <span>
                <i className="dot" style={{ background: r.color }} /> η = {r.eta}
              </span>
              <Choice
                label={`Behaviour of learning rate ${r.eta}`}
                options={KINDS}
                answer={r.answer}
                value={labels[i]}
                onPick={(v) => {
                  setLabels((l) => ({ ...l, [i]: v }));
                  if (v !== r.answer) setTries((t) => t + 1);
                }}
              />
            </div>
          ))}
          <Goal ok={labelsOk} text={`${RUNNERS.filter((r, i) => labels[i] === r.answer).length}/4 named`} />
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Part 2.</b> Pick your own rate: reach a loss under {OWN_GOAL} in only {OWN_STEPS} steps.
          </p>
          <div className="slider">
            <label htmlFor="own">
              Your learning rate <span className="mono">{eta.toFixed(2)}</span>
            </label>
            <input
              id="own"
              type="range"
              min="0.01"
              max="1.1"
              step="0.01"
              value={eta}
              onChange={(e) => {
                setEta(+e.target.value);
                setRan(false);
              }}
            />
          </div>
          <button type="button" className="btn primary" style={{ justifySelf: 'start' }} onClick={() => setRan(true)}>
            Run {OWN_STEPS} steps
          </button>
          {ran && (
            <p className="mono">
              loss after {OWN_STEPS} steps = {own[OWN_STEPS] > 1e6 ? '∞' : own[OWN_STEPS].toFixed(4)}
            </p>
          )}
          <Goal
            ok={ok}
            text={!labelsOk ? 'Name the four runners' : `Not yet: under ${OWN_GOAL} in ${OWN_STEPS} steps`}
          />
          <Hint tries={tries}>
            Each step multiplies the gap to 3 by (1 − 2η). A factor near 0 is fastest; above 1 in size, the gap grows.
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Loss after each step</h3>
        <svg
          className="plot"
          viewBox="0 0 540 310"
          role="img"
          aria-label="Loss against steps for four learning rates"
          fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif"
        >
          {[0, 8, 16, 24].map((v) => (
            <g key={v}>
              <line x1="50" x2="520" y1={SY(v)} y2={SY(v)} stroke="#E7D8BC" />
              <text x="42" y={SY(v) + 4} textAnchor="end" fontSize="12" fill="#5E4C3D">
                {v}
              </text>
            </g>
          ))}
          {[0, 3, 6, 9, 12].map((s) => (
            <text key={s} x={SX(s)} y="290" textAnchor="middle" fontSize="12" fill="#5E4C3D">
              {s}
            </text>
          ))}
          <line x1="50" x2="520" y1="270" y2="270" stroke="#2E2118" strokeWidth="2" />
          {RUNNERS.map((r) => (
            <polyline key={r.eta} points={line(run(r.eta, STEPS))} fill="none" stroke={r.color} strokeWidth="3" />
          ))}
          {ran && <polyline points={line(own)} fill="none" stroke="#2E2118" strokeWidth="3" strokeDasharray="6 4" />}
          <text x="285" y="306" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2E2118">
            Step
          </text>
          <text x="50" y="22" fontSize="13" fontWeight="700" fill="#2E2118">
            Loss
          </text>
        </svg>
        <div className="legend">
          {RUNNERS.map((r) => (
            <span key={r.eta}>
              <i style={{ background: r.color }} />η = {r.eta}
            </span>
          ))}
          {ran && <span>- - your rate</span>}
        </div>
      </section>
    </div>
  );
}
