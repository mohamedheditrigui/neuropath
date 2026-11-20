/* Ch. 5, level 4 — Classifying a new point by hand: the lesson's example. Fill the squared distances
   from (3, 3) to five labelled points, then give the prediction for k = 3 and for k = 5. */
import { useEffect, useState } from 'react';
import { Choice, Goal, Hint, NumberCheck, isClose } from '../common.jsx';
import { Board, CLASSES, Dot, PX, PY, knn } from './data.jsx';

const Q = [3, 3];
const NAMED = [
  ['A', [1, 1, 'moss']],
  ['B', [2, 4, 'terracotta']],
  ['C', [4, 4, 'terracotta']],
  ['D', [5, 1, 'moss']],
  ['E', [3, 6, 'moss']],
];
const sq = (p) => (p[0] - Q[0]) ** 2 + (p[1] - Q[1]) ** 2;
const PTS = NAMED.map(([, p]) => p);
const K3 = knn(PTS, Q, 3).cls; // terracotta
const K5 = knn(PTS, Q, 5).cls; // moss

export default function HandLab({ onSolved }) {
  const [d, setD] = useState(() => NAMED.map(() => ''));
  const [p3, setP3] = useState(null);
  const [p5, setP5] = useState(null);
  const [tries, setTries] = useState(0);
  const distOk = NAMED.every(([, p], i) => isClose(d[i], sq(p)));
  const ok = distOk && p3 === K3 && p5 === K5;
  useEffect(() => onSolved(ok), [ok, onSolved]);
  const bump = () => setTries((t) => t + 1);
  const options = Object.entries(CLASSES).map(([k, c]) => [k, c.label]);

  return (
    <div className="lesson">
      <section className="lab">
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 1.</b> Squared distance from the new point ({Q.join(', ')}) to each point: (Δx)² + (Δy)². Squares
            keep the same order and skip the square roots.
          </p>
          <div className="num-grid">
            {NAMED.map(([name, p], i) => (
              <NumberCheck
                key={name}
                id={`d${name}`}
                label={`${name} (${p[0]}, ${p[1]})`}
                expected={sq(p)}
                value={d[i]}
                onChange={(v) => setD((old) => old.map((x, j) => (j === i ? v : x)))}
                onTry={bump}
              />
            ))}
          </div>
        </div>
        {distOk && (
          <div className="panel" style={{ display: 'grid', gap: 10 }}>
            <p>
              <b>Step 2.</b> Sort the distances and vote. (A and D tie at 8: either one, the vote is the same.)
            </p>
            <p style={{ fontWeight: 700 }}>Prediction with k = 3</p>
            <Choice
              label="Prediction with k = 3"
              options={options}
              answer={K3}
              value={p3}
              onPick={(v) => (setP3(v), v !== K3 && bump())}
            />
            <p style={{ fontWeight: 700 }}>Prediction with k = 5</p>
            <Choice
              label="Prediction with k = 5"
              options={options}
              answer={K5}
              value={p5}
              onPick={(v) => (setP5(v), v !== K5 && bump())}
            />
          </div>
        )}
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <Goal ok={ok} text={distOk ? 'Vote for k = 3 and k = 5' : 'Fill the five distances'} />
          <Hint tries={tries}>
            {distOk
              ? 'Closest: B and C (2), then A or D (8). With k = 5 everyone votes: count moss and terracotta.'
              : 'For B (2, 4): (2 − 3)² + (4 − 3)² = 1 + 1 = 2.'}
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Five known points and a new one</h3>
        <Board label="Five labelled points A to E and a new point at 3, 3">
          {distOk &&
            NAMED.map(([name, p]) => (
              <line
                key={`l${name}`}
                x1={PX(Q[0])}
                y1={PY(Q[1])}
                x2={PX(p[0])}
                y2={PY(p[1])}
                stroke="#2E2118"
                strokeDasharray="4 3"
              />
            ))}
          {NAMED.map(([name, p]) => (
            <g key={name}>
              <Dot p={p} r={11} />
              <text x={PX(p[0]) + 14} y={PY(p[1]) - 10} fontSize="15" fontWeight="700" fill="#2E2118">
                {name}
              </text>
            </g>
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
