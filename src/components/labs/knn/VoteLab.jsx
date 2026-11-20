/* Ch. 5, level 1 — Be the KNN: pick by eye the 3 points closest to the new one, check them,
   then cast the majority vote yourself. */
import { useEffect, useState } from 'react';
import { Choice, Goal, Hint } from '../common.jsx';
import { Board, CLASSES, Dot, POINTS, PX, PY, knn } from './data.jsx';

const Q = [4.6, 4.4];
const K = 3;
const TRUTH = knn(POINTS, Q, K);
const TRUE_SET = new Set(TRUTH.near.map((n) => n.i));

export default function VoteLab({ onSolved }) {
  const [picked, setPicked] = useState([]);
  const [checked, setChecked] = useState(false);
  const [vote, setVote] = useState(null);
  const [tries, setTries] = useState(0);
  const setOk = checked && picked.length === K && picked.every((i) => TRUE_SET.has(i));
  const ok = setOk && vote === TRUTH.cls;
  useEffect(() => onSolved(ok), [ok, onSolved]);

  const toggle = (i) => {
    setChecked(false);
    setPicked((p) => (p.includes(i) ? p.filter((j) => j !== i) : p.length < K ? [...p, i] : p));
  };
  const check = () => {
    setChecked(true);
    if (!picked.every((i) => TRUE_SET.has(i))) setTries((t) => t + 1);
  };
  const radius = TRUTH.near[K - 1].d;

  return (
    <div className="lesson">
      <section className="lab">
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 1.</b> The grey star is a new point. Click the <b>{K} points closest</b> to it (by eye), then check.
          </p>
          <div className="readout">
            <span className="mono">
              {picked.length}/{K} selected
            </span>
            <button type="button" className="btn primary" disabled={picked.length !== K} onClick={check}>
              Check my neighbours
            </button>
          </div>
          {checked && (
            <Goal
              ok={setOk}
              text={`${picked.filter((i) => TRUE_SET.has(i)).length}/${K} are true nearest neighbours`}
            />
          )}
        </div>
        {setOk && (
          <div className="panel" style={{ display: 'grid', gap: 10 }}>
            <p>
              <b>Step 2.</b> Your neighbours vote: {TRUTH.moss} moss, {TRUTH.terracotta} terracotta. What does KNN
              predict?
            </p>
            <Choice
              label="KNN prediction"
              options={Object.entries(CLASSES).map(([k, c]) => [k, c.label])}
              answer={TRUTH.cls}
              value={vote}
              onPick={(v) => {
                setVote(v);
                if (v !== TRUTH.cls) setTries((t) => t + 1);
              }}
            />
            <Goal ok={ok} text="Cast the vote" />
          </div>
        )}
        <Hint tries={tries}>
          Imagine a circle growing around the star: the first {K} points it touches are the neighbours. Then the class
          with more of them wins.
        </Hint>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Who are the neighbours?</h3>
        <Board label={`New point at ${Q.join(', ')}; ${picked.length} neighbours selected`}>
          {setOk && (
            <circle
              cx={PX(Q[0])}
              cy={PY(Q[1])}
              r={radius * 46}
              fill="#C98F2B"
              fillOpacity=".12"
              stroke="#C98F2B"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          )}
          {picked.map((i) => (
            <line
              key={i}
              x1={PX(Q[0])}
              y1={PY(Q[1])}
              x2={PX(POINTS[i][0])}
              y2={PY(POINTS[i][1])}
              stroke="#2E2118"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          ))}
          {POINTS.map((p, i) => (
            <Dot
              key={i}
              p={p}
              r={picked.includes(i) ? 12 : 9}
              ring={picked.includes(i) ? '#2E2118' : undefined}
              role="button"
              tabIndex={0}
              aria-pressed={picked.includes(i)}
              aria-label={`${CLASSES[p[2]].label} point at ${p[0]}, ${p[1]}`}
              style={{ cursor: 'pointer' }}
              onClick={() => toggle(i)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle(i))}
            />
          ))}
          <path
            d={`M${PX(Q[0])} ${PY(Q[1]) - 13} l4 9 l10 1 l-7 7 l2 10 l-9 -5 l-9 5 l2 -10 l-7 -7 l10 -1 z`}
            fill="#6E6455"
            stroke="#FBF6EB"
            strokeWidth="2"
          />
        </Board>
      </section>
    </div>
  );
}
