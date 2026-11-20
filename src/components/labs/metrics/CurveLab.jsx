/* Ch. 6, level 5 — The precision–recall trade-off: every threshold is one point on the precision–recall curve.
   Read where the extremes sit, then pick the threshold with the best balance (F1). */
import { useEffect, useState } from 'react';
import { Choice, Goal, Hint } from '../common.jsx';
import { EMAILS, Threshold, confusion, pct } from './data.jsx';

// One point per distinct threshold (each email score), from strict to loose.
const CURVE = [...new Set(EMAILS.map((e) => e[0]))].sort((a, b) => b - a).map((t) => ({ t, ...confusion(t) }));
const RX = (r) => 60 + r * 440;
const PY = (p) => 280 - p * 250;

export default function CurveLab({ level, onSolved }) {
  const [t, setT] = useState(0.3);
  const [q, setQ] = useState(null);
  const [tries, setTries] = useState(0);
  const c = confusion(t);
  const f1Ok = c.f1 >= level.goal;
  const ok = f1Ok && q === 'tl';
  useEffect(() => onSolved(ok), [ok, onSolved]);

  return (
    <div className="lesson">
      <section className="lab">
        <Threshold t={t} setT={setT} />
        <div className="readout">
          <span className="mono">
            precision {pct(c.precision)} · recall {pct(c.recall)}
          </span>
          <span className="mono">F1 {c.f1.toFixed(3)}</span>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p style={{ fontWeight: 700 }}>1. Push the threshold close to 1. Where does the point go?</p>
          <Choice
            label="Where is a very strict threshold on the curve?"
            options={[
              ['tl', 'Top-left: high precision, low recall'],
              ['br', 'Bottom-right: low precision, high recall'],
              ['tr', 'Top-right: both high'],
            ]}
            answer="tl"
            value={q}
            onPick={(v) => {
              setQ(v);
              if (v !== 'tl') setTries((x) => x + 1);
            }}
          />
          <p style={{ fontWeight: 700 }}>
            2. Find a threshold with an F1 score of {level.goal} or more: the best balance for this filter.
          </p>
          <Goal ok={ok} text={q !== 'tl' ? 'Answer question 1' : `F1 not yet ${level.goal}`} />
          <Hint tries={tries}>
            A strict filter flags only the surest emails: few false alarms, many misses. For F1, look for the point
            closest to the top-right corner.
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Precision–recall curve</h3>
        <svg
          className="plot"
          viewBox="0 0 540 320"
          role="img"
          aria-label={`Precision-recall curve; current point precision ${pct(c.precision)}, recall ${pct(c.recall)}`}
          fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif"
        >
          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <g key={v}>
              <line x1="60" x2="500" y1={PY(v)} y2={PY(v)} stroke="#E7D8BC" />
              <line x1={RX(v)} x2={RX(v)} y1="30" y2="280" stroke="#E7D8BC" />
              <text x="52" y={PY(v) + 4} textAnchor="end" fontSize="12" fill="#5E4C3D">
                {v}
              </text>
              <text x={RX(v)} y="298" textAnchor="middle" fontSize="12" fill="#5E4C3D">
                {v}
              </text>
            </g>
          ))}
          <polyline
            points={CURVE.map((p) => `${RX(p.recall)},${PY(p.precision)}`).join(' ')}
            fill="none"
            stroke="#6B4A33"
            strokeWidth="3"
          />
          {CURVE.map((p) => (
            <circle key={p.t} cx={RX(p.recall)} cy={PY(p.precision)} r="4" fill="#6B4A33" />
          ))}
          <circle
            cx={RX(c.recall)}
            cy={PY(c.precision)}
            r="11"
            fill={f1Ok ? '#5F6D32' : '#A84F32'}
            stroke="#FBF6EB"
            strokeWidth="3"
          />
          <text x="280" y="316" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2E2118">
            Recall
          </text>
          <text x="60" y="22" fontSize="13" fontWeight="700" fill="#2E2118">
            Precision
          </text>
        </svg>
        <p className="muted">
          Every dot is one threshold. Moving the slider slides the big dot along the curve: you can trade precision for
          recall, never get both for free.
        </p>
      </section>
    </div>
  );
}
