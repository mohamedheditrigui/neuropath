/* Level 2 — A line from two points: pick two students, see the line through them (rise / run), judge it with the MSE. */
import { useEffect, useState } from 'react';
import { COLORS, Goal, Hint, Line, POINTS, Plot, makeScale, mseOf } from './shared.jsx';

const scale = makeScale();
const fmt = (v) => (Math.round(v * 100) / 100).toString();

export default function TwoPointsLab({ level, onSolved }) {
  const [picked, setPicked] = useState([]); // indexes into POINTS, at most 2
  const [tries, setTries] = useState(0);

  const pair = picked.length === 2 ? picked.map((i) => POINTS[i]).sort((p, q) => p[0] - q[0]) : null;
  const a = pair ? (pair[1][1] - pair[0][1]) / (pair[1][0] - pair[0][0]) : null;
  const b = pair ? pair[0][1] - a * pair[0][0] : null;
  const mse = pair ? mseOf(a, b) : null;
  const ok = pair !== null && mse < level.goal;
  useEffect(() => onSolved(ok), [ok, onSolved]);

  const toggle = (i) => {
    if (picked.includes(i)) return setPicked(picked.filter((j) => j !== i));
    const next = picked.length === 2 ? [i] : [...picked, i]; // a third click starts a new pair
    if (next.length === 2) {
      const [[x1, y1], [x2, y2]] = next.map((j) => POINTS[j]);
      const s = (y2 - y1) / (x2 - x1);
      if (mseOf(s, y1 - s * x1) >= level.goal) setTries((t) => t + 1);
    }
    setPicked(next);
  };
  const { X, Y } = scale;

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">
          {pair ? (
            <>
              y = <em>{fmt(a)}</em> x {b < 0 ? '−' : '+'} <em>{fmt(Math.abs(b))}</em>
            </>
          ) : (
            'Pick two points'
          )}
        </div>
        <div className="panel" style={{ display: 'grid', gap: 8 }}>
          {pair ? (
            <>
              <p>
                <b>Slope</b> a = rise / run = ({pair[1][1]} − {pair[0][1]}) / ({pair[1][0]} − {pair[0][0]}) ={' '}
                <b className="mono">{fmt(a)}</b>
              </p>
              <p>
                <b>Intercept</b> b = {pair[0][1]} − {fmt(a)} × {pair[0][0]} = <b className="mono">{fmt(b)}</b>
              </p>
            </>
          ) : (
            <p className="muted">
              Click (or Tab + Enter) two green points on the graph. The line through them is drawn.
            </p>
          )}
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Mini-exercise.</b> Two points always define a line, but not always a good one. Find a pair whose line has
            an MSE on <b>all ten</b> students below {level.goal}.
          </p>
          <div className="readout">
            <span>
              MSE <span className="mse">{pair ? mse.toFixed(2) : '—'}</span>
            </span>
            <Goal ok={ok} text={`Not yet: below ${level.goal}`} />
          </div>
          {tries > 0 && !ok && <p className="muted">Pairs tried: {tries}. Some pairs tilt the line too much.</p>}
          <Hint tries={tries}>
            Points far apart give a steadier slope. Try a pair that sits close to the middle of the cloud, such as the
            2-hour and 6-hour students.
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Choose two students</h3>
        <Plot
          scale={scale}
          xTicks={[0, 2, 4, 6, 8, 10]}
          yTicks={[0, 3, 6, 9, 12]}
          label="Ten points; pick two to draw the line through them"
        >
          {pair &&
            POINTS.map(([x, y]) => (
              <line
                key={`e${x}`}
                x1={X(x)}
                x2={X(x)}
                y1={Y(y)}
                y2={Y(scale.clipY(a * x + b))}
                stroke={COLORS.err}
                strokeWidth="2"
                strokeDasharray="4 3"
              />
            ))}
          {pair && (
            <>
              <line
                x1={X(pair[0][0])}
                x2={X(pair[1][0])}
                y1={Y(pair[0][1])}
                y2={Y(pair[0][1])}
                stroke={COLORS.ink}
                strokeDasharray="3 4"
              />
              <line
                x1={X(pair[1][0])}
                x2={X(pair[1][0])}
                y1={Y(pair[0][1])}
                y2={Y(pair[1][1])}
                stroke={COLORS.ink}
                strokeDasharray="3 4"
              />
              <text
                x={(X(pair[0][0]) + X(pair[1][0])) / 2}
                y={Y(pair[0][1]) + 18}
                textAnchor="middle"
                fontSize="13"
                fill={COLORS.ink}
              >
                run {pair[1][0] - pair[0][0]}
              </text>
              <Line scale={scale} a={a} b={b} />
            </>
          )}
          {POINTS.map(([x, y], i) => {
            const on = picked.includes(i);
            return (
              <circle
                key={x}
                cx={X(x)}
                cy={Y(y)}
                r={on ? 10 : 8}
                fill={on ? COLORS.line : COLORS.point}
                stroke="#FBF6EB"
                strokeWidth="2.5"
                role="button"
                tabIndex={0}
                aria-pressed={on}
                aria-label={`Student ${x} hours, score ${y}`}
                style={{ cursor: 'pointer' }}
                onClick={() => toggle(i)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle(i))}
              />
            );
          })}
        </Plot>
      </section>
    </div>
  );
}
