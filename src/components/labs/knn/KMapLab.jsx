/* Ch. 5, level 2 — Choosing k: colour the whole map by the KNN prediction and change k.
   One mislabelled point creates an island at k = 1; a larger k smooths it away, and k = n predicts one class everywhere. */
import { useEffect, useMemo, useState } from 'react';
import { Choice, Goal, Hint } from '../common.jsx';
import { Board, Dot, POINTS, PX, PY, knn } from './data.jsx';

const NOISE = [7.6, 7, 'moss']; // a moss point sitting among terracotta ones: probably a labelling mistake
const DATA = [...POINTS, NOISE];
const K_VALUES = [1, 3, 5, 9, 15, DATA.length];
const STEP = 0.25;
// Solid light tints (not transparent colours), so overlapping cells do not draw dark seams.
const TINT = { moss: '#DDE3BE', terracotta: '#F3D9C7' };

export default function KMapLab({ onSolved }) {
  const [k, setK] = useState(1);
  const [seen, setSeen] = useState(new Set([1]));
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [tries, setTries] = useState(0);
  const cells = useMemo(() => {
    const out = [];
    for (let x = 0; x < 10; x += STEP)
      for (let y = 0; y < 10; y += STEP) out.push([x, y, knn(DATA, [x + STEP / 2, y + STEP / 2], k).cls]);
    return out;
  }, [k]);
  const ok = q1 === '3' && q2 === 'moss';
  useEffect(() => onSolved(ok), [ok, onSolved]);
  const pick = (v) => {
    setK(v);
    setSeen((s) => new Set([...s, v]));
  };
  const answer = (set, right) => (v) => {
    set(v);
    if (v !== right) setTries((t) => t + 1);
  };

  return (
    <div className="lesson">
      <section className="lab">
        <div style={{ display: 'grid', gap: 6 }}>
          <b>Number of neighbours k</b>
          <div className="pick">
            {K_VALUES.map((v) => (
              <button
                key={v}
                type="button"
                className={v === k ? 'on' : ''}
                aria-pressed={v === k}
                onClick={() => pick(v)}
              >
                k = {v}
                {v === DATA.length ? ' (all)' : ''}
              </button>
            ))}
          </div>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            The ground is coloured by what KNN would predict there. The circled moss point (top right) is probably a
            labelling mistake.
          </p>
          <p style={{ fontWeight: 700 }}>1. What is the smallest k that removes its moss island?</p>
          <Choice
            label="Smallest k without the island"
            options={[
              ['1', 'k = 1'],
              ['3', 'k = 3'],
              ['5', 'k = 5'],
              ['9', 'k = 9'],
            ]}
            answer="3"
            value={q1}
            onPick={answer(setQ1, '3')}
          />
          <p style={{ fontWeight: 700 }}>2. With k = {DATA.length} (every point votes), what does the map show?</p>
          <Choice
            label="Map with every point voting"
            options={[
              ['moss', 'All moss'],
              ['terracotta', 'All terracotta'],
              ['same', 'Same as k = 1'],
            ]}
            answer="moss"
            value={q2}
            onPick={answer(setQ2, 'moss')}
          />
          <p className="muted">
            Points: {DATA.filter((p) => p[2] === 'moss').length} moss,{' '}
            {DATA.filter((p) => p[2] === 'terracotta').length} terracotta. Values of k tried:{' '}
            {[...seen].sort((a, b) => a - b).join(', ')}.
          </p>
          <Goal ok={ok} text="Explore k, then answer both questions" />
          <Hint tries={tries}>
            Try each k and watch the top-right corner. For question 2, every point votes everywhere, so the class with
            more points always wins.
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Decision regions for k = {k}</h3>
        <Board label={`Map coloured by KNN prediction with k = ${k}`}>
          {cells.map(([x, y, cls]) => (
            <rect
              key={`${x}-${y}`}
              x={PX(x)}
              y={PY(y + STEP)}
              width={STEP * 46 + 0.5}
              height={STEP * 46 + 0.5}
              fill={TINT[cls]}
            />
          ))}
          {POINTS.map((p, i) => (
            <Dot key={i} p={p} />
          ))}
          <Dot p={NOISE} r={10} />
          <circle
            cx={PX(NOISE[0])}
            cy={PY(NOISE[1])}
            r="17"
            fill="none"
            stroke="#2E2118"
            strokeWidth="2"
            strokeDasharray="4 3"
          />
        </Board>
      </section>
    </div>
  );
}
