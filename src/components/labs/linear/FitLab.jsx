/* Level 5 — Fit the best line by hand: tune slope and intercept to lower the MSE.
   Optional pivot: lock the line on the mean point (x̄, ȳ), so only the slope is left to tune. */
import { useEffect, useState } from 'react';
import { COLORS, Goal, Hint, Line, MEAN_X, MEAN_Y, POINTS, Plot, makeScale, mseOf } from './shared.jsx';

const scale = makeScale();

export default function FitLab({ level, onSolved }) {
  const [a, setA] = useState(0.2);
  const [freeB, setFreeB] = useState(6.5);
  const [pivot, setPivot] = useState(false);
  const [showErr, setShowErr] = useState(true);
  const b = pivot ? MEAN_Y - a * MEAN_X : freeB;
  const mse = mseOf(a, b);
  const ok = mse <= level.goal;
  useEffect(() => onSolved(ok), [ok, onSolved]);
  const { X, Y } = scale;

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">
          y = <em>{a.toFixed(2)}</em> x {b < 0 ? '−' : '+'} <em>{Math.abs(b).toFixed(2)}</em>
        </div>
        <div className="slider">
          <label htmlFor="fa">
            Slope a <span className="mono">{a.toFixed(2)}</span>
          </label>
          <input
            id="fa"
            type="range"
            min="-0.5"
            max="2"
            step="0.01"
            value={a}
            onChange={(e) => setA(+e.target.value)}
          />
        </div>
        <div className="slider">
          <label htmlFor="fb">
            Intercept b <span className="mono">{b.toFixed(2)}</span>{' '}
            {pivot && <small className="muted">(set by the pivot)</small>}
          </label>
          <input
            id="fb"
            type="range"
            min="-2"
            max="10"
            step="0.01"
            value={b}
            disabled={pivot}
            onChange={(e) => setFreeB(+e.target.value)}
          />
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={pivot}
            onChange={(e) => {
              if (!e.target.checked) setFreeB(b); // keep the line where it is when unlocking
              setPivot(e.target.checked);
            }}
          />
          Pivot around the mean point (x̄, ȳ) = ({MEAN_X}, {MEAN_Y}): b = ȳ − a·x̄
        </label>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Mini-exercise.</b> Bring the MSE down to {level.goal} or less.
          </p>
          <div className="readout">
            <span>
              MSE <span className="mse">{mse.toFixed(2)}</span>
            </span>
            <Goal ok={ok} text={`Not yet: ${level.goal} or less`} />
          </div>
          <Hint>
            Turn on the pivot: the best line always passes through the mean point, so only the slope is left. Look at
            the dashed errors and balance them above and below the line.
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <div className="readout">
          <h3>Hours studied and exam score</h3>
          <label className="toggle">
            <input type="checkbox" checked={showErr} onChange={(e) => setShowErr(e.target.checked)} />
            Show errors
          </label>
        </div>
        <Plot
          scale={scale}
          xTicks={[0, 2, 4, 6, 8, 10]}
          yTicks={[0, 3, 6, 9, 12]}
          label={`Ten points with the line y = ${a.toFixed(2)}x + ${b.toFixed(2)}`}
        >
          {showErr &&
            POINTS.map(([x, y]) => (
              <line
                key={`e${x}`}
                x1={X(x)}
                x2={X(x)}
                y1={Y(y)}
                y2={Y(scale.clipY(a * x + b))}
                stroke={COLORS.err}
                strokeWidth="2.5"
                strokeDasharray="4 3"
              />
            ))}
          <Line scale={scale} a={a} b={b} />
          {POINTS.map(([x, y]) => (
            <circle key={x} cx={X(x)} cy={Y(y)} r="6.5" fill={COLORS.point} stroke="#FBF6EB" strokeWidth="2" />
          ))}
          {pivot && (
            <g aria-hidden="true">
              <line
                x1={X(MEAN_X) - 10}
                x2={X(MEAN_X) + 10}
                y1={Y(MEAN_Y)}
                y2={Y(MEAN_Y)}
                stroke={COLORS.ink}
                strokeWidth="3"
              />
              <line
                x1={X(MEAN_X)}
                x2={X(MEAN_X)}
                y1={Y(MEAN_Y) - 10}
                y2={Y(MEAN_Y) + 10}
                stroke={COLORS.ink}
                strokeWidth="3"
              />
              <text x={X(MEAN_X) + 12} y={Y(MEAN_Y) + 22} fontSize="13" fontWeight="700" fill={COLORS.ink}>
                (x̄, ȳ)
              </text>
            </g>
          )}
        </Plot>
      </section>
    </div>
  );
}
