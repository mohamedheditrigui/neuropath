/* Level 3 — Weight and bias: cover a dashed mystery line by tuning w (tilt) and b (height) separately, then use it to predict. */
import { useEffect, useState } from 'react';
import { COLORS, Goal, Hint, Line, NumberCheck, Plot, isClose, makeScale } from './shared.jsx';

const TARGET = { w: 0.6, b: 2.5 };
const ASK_X = 8;
const scale = makeScale();

export default function MatchLab({ onSolved }) {
  const [w, setW] = useState(1.5);
  const [b, setB] = useState(0);
  const [pred, setPred] = useState('');
  const [tries, setTries] = useState(0);

  const wOk = Math.abs(w - TARGET.w) <= 0.05;
  const bOk = Math.abs(b - TARGET.b) <= 0.25;
  const predOk = isClose(pred, TARGET.w * ASK_X + TARGET.b, 0.1);
  const ok = wOk && bOk && predOk;
  useEffect(() => onSolved(ok), [ok, onSolved]);
  const { X, Y } = scale;

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">
          ŷ = <em>{w.toFixed(2)}</em> x {b < 0 ? '−' : '+'} <em>{Math.abs(b).toFixed(2)}</em>
        </div>
        <div className="slider">
          <label htmlFor="mw">
            Weight w (tilt) <span className="mono">{w.toFixed(2)}</span>
          </label>
          <input
            id="mw"
            type="range"
            min="-0.5"
            max="2"
            step="0.05"
            value={w}
            onChange={(e) => setW(+e.target.value)}
          />
        </div>
        <div className="slider">
          <label htmlFor="mb">
            Bias b (height at x = 0) <span className="mono">{b.toFixed(2)}</span>
          </label>
          <input id="mb" type="range" min="-2" max="10" step="0.1" value={b} onChange={(e) => setB(+e.target.value)} />
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Part 1.</b> Cover the dashed mystery line. Notice that w only tilts your line and b only lifts it.
          </p>
          <div className="readout">
            <span className={`chip ${wOk ? 'good' : 'warn'}`}>
              weight {wOk ? '✓' : w > TARGET.w ? 'too steep' : 'too flat'}
            </span>
            <span className={`chip ${bOk ? 'good' : 'warn'}`}>
              bias {bOk ? '✓' : b > TARGET.b ? 'too high' : 'too low'}
            </span>
          </div>
          <p className="muted">
            Reading your line: each extra hour adds {w.toFixed(2)} points; at 0 hours it predicts {b.toFixed(2)}.
          </p>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Part 2.</b> Using the mystery line, what score does it predict for a student who studied {ASK_X} hours?
          </p>
          <NumberCheck
            id="pred8"
            label={`ŷ at x = ${ASK_X}`}
            expected={TARGET.w * ASK_X + TARGET.b}
            tolerance={0.1}
            value={pred}
            onChange={setPred}
            onTry={() => setTries((t) => t + 1)}
          />
          <Goal ok={ok} text={!(wOk && bOk) ? 'Match the line first' : 'Compute the prediction'} />
          <Hint tries={tries}>
            Once your line covers the mystery line, w and b are its weight and bias. Compute w × {ASK_X} + b.
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Find the mystery line</h3>
        <Plot
          scale={scale}
          xTicks={[0, 2, 4, 6, 8, 10]}
          yTicks={[0, 3, 6, 9, 12]}
          label={`Your line y = ${w.toFixed(2)}x + ${b.toFixed(2)} and a dashed target line`}
        >
          <Line scale={scale} a={TARGET.w} b={TARGET.b} color={COLORS.point} width={6} dash="10 8" />
          <Line scale={scale} a={w} b={b} />
          <circle cx={X(0)} cy={Y(scale.clipY(b))} r="7" fill={COLORS.line} stroke="#FBF6EB" strokeWidth="2" />
          <text x={X(0) + 12} y={Y(scale.clipY(b)) - 10} fontSize="13" fontWeight="700" fill={COLORS.line}>
            b
          </text>
          {wOk && bOk && (
            <g>
              <line
                x1={X(ASK_X)}
                x2={X(ASK_X)}
                y1={Y(0)}
                y2={Y(TARGET.w * ASK_X + TARGET.b)}
                stroke={COLORS.err}
                strokeDasharray="5 4"
                strokeWidth="2"
              />
              <text x={X(ASK_X) + 8} y={Y(1)} fontSize="13" fill={COLORS.ink}>
                x = {ASK_X}
              </text>
            </g>
          )}
        </Plot>
      </section>
    </div>
  );
}
