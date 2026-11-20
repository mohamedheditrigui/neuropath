/* Ch. 5, level 3 — Measuring distance: compute a Euclidean and a Manhattan distance by hand,
   then switch the metric on the board and see the shape of the neighbourhood change. */
import { useEffect, useState } from 'react';
import { Choice, Goal, Hint, NumberCheck, isClose } from '../common.jsx';
import { Board, Dot, POINTS, PX, PY, euclid, knn, manhattan } from './data.jsx';

const A = [2, 1];
const B = [8, 9];
const Q = [5, 4.6];
const K = 5;

export default function DistanceLab({ onSolved }) {
  const [eu, setEu] = useState('');
  const [ma, setMa] = useState('');
  const [metric, setMetric] = useState('euclid');
  const [seen, setSeen] = useState(new Set(['euclid']));
  const [shape, setShape] = useState(null);
  const [tries, setTries] = useState(0);
  const inputsOk = isClose(eu, euclid(A, B)) && isClose(ma, manhattan(A, B));
  const ok = inputsOk && seen.size === 2 && shape === 'diamond';
  useEffect(() => onSolved(ok), [ok, onSolved]);

  const res = knn(POINTS, Q, K, metric === 'euclid' ? euclid : manhattan);
  const r = res.near[K - 1].d * 46;
  const choose = (m) => {
    setMetric(m);
    setSeen((s) => new Set([...s, m]));
  };

  return (
    <div className="lesson">
      <section className="lab">
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 1.</b> Compute the two distances between A = ({A.join(', ')}) and B = ({B.join(', ')}).
          </p>
          <div className="num-grid">
            <NumberCheck
              id="eu"
              label="Euclidean √(Δx² + Δy²)"
              expected={euclid(A, B)}
              value={eu}
              onChange={setEu}
              onTry={() => setTries((t) => t + 1)}
            />
            <NumberCheck
              id="ma"
              label="Manhattan |Δx| + |Δy|"
              expected={manhattan(A, B)}
              value={ma}
              onChange={setMa}
              onTry={() => setTries((t) => t + 1)}
            />
          </div>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 2.</b> Switch the metric and look at the {K} neighbours of the grey star and at the zone that
            contains them.
          </p>
          <div className="pick">
            {[
              ['euclid', 'Euclidean'],
              ['manhattan', 'Manhattan'],
            ].map(([m, label]) => (
              <button
                key={m}
                type="button"
                className={metric === m ? 'on' : ''}
                aria-pressed={metric === m}
                onClick={() => choose(m)}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mono" style={{ fontSize: '.9rem' }}>
            {res.near.map((n) => `(${n.p[0]}, ${n.p[1]}) ${n.d.toFixed(2)}`).join('  ·  ')}
          </p>
          {seen.size === 2 && (
            <>
              <p style={{ fontWeight: 700 }}>What shape holds every point within a Manhattan distance r?</p>
              <Choice
                label="Shape of a Manhattan neighbourhood"
                options={[
                  ['circle', 'A circle'],
                  ['diamond', 'A diamond'],
                  ['square', 'An upright square'],
                ]}
                answer="diamond"
                value={shape}
                onPick={(v) => {
                  setShape(v);
                  if (v !== 'diamond') setTries((t) => t + 1);
                }}
              />
            </>
          )}
          <Goal
            ok={ok}
            text={!inputsOk ? 'Compute both distances' : seen.size < 2 ? 'Try both metrics' : 'Name the shape'}
          />
          <Hint tries={tries}>
            Δx = 6 and Δy = 8. Euclidean: √(36 + 64). Manhattan: 6 + 8. On the board, the dashed zone shows the shape.
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>
          {metric === 'euclid' ? 'Euclidean' : 'Manhattan'} neighbourhood (k = {K})
        </h3>
        <Board label={`${K} nearest neighbours with the ${metric} distance`}>
          {metric === 'euclid' ? (
            <circle
              cx={PX(Q[0])}
              cy={PY(Q[1])}
              r={r}
              fill="#C98F2B"
              fillOpacity=".14"
              stroke="#C98F2B"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          ) : (
            <polygon
              points={`${PX(Q[0])},${PY(Q[1]) - r} ${PX(Q[0]) + r},${PY(Q[1])} ${PX(Q[0])},${PY(Q[1]) + r} ${PX(Q[0]) - r},${PY(Q[1])}`}
              fill="#C98F2B"
              fillOpacity=".14"
              stroke="#C98F2B"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
          )}
          {POINTS.map((p, i) => (
            <Dot key={i} p={p} ring={res.near.some((n) => n.i === i) ? '#2E2118' : undefined} />
          ))}
          <path
            d={`M${PX(Q[0])} ${PY(Q[1]) - 13} l4 9 l10 1 l-7 7 l2 10 l-9 -5 l-9 5 l2 -10 l-7 -7 l10 -1 z`}
            fill="#6E6455"
            stroke="#FBF6EB"
            strokeWidth="2"
          />
          {!inputsOk && (
            <g>
              <line x1={PX(A[0])} y1={PY(A[1])} x2={PX(B[0])} y2={PY(B[1])} stroke="#2E2118" strokeWidth="2" />
              <polyline
                points={`${PX(A[0])},${PY(A[1])} ${PX(B[0])},${PY(A[1])} ${PX(B[0])},${PY(B[1])}`}
                fill="none"
                stroke="#97691A"
                strokeWidth="2"
                strokeDasharray="5 4"
              />
              <text x={PX(A[0]) - 18} y={PY(A[1]) + 5} fontSize="14" fontWeight="700" fill="#2E2118">
                A
              </text>
              <text x={PX(B[0]) + 8} y={PY(B[1]) - 6} fontSize="14" fontWeight="700" fill="#2E2118">
                B
              </text>
            </g>
          )}
        </Board>
      </section>
    </div>
  );
}
