/* Level 4 — Residuals, MAE and MSE: compute one residual by hand, then drag one student into an outlier
   and compare how fast the MSE and the MAE grow. */
import { useEffect, useRef, useState } from 'react';
import {
  COLORS,
  Goal,
  Hint,
  Line,
  NumberCheck,
  POINTS,
  Plot,
  isClose,
  maeOf,
  makeScale,
  mseOf,
  pointerSvgY,
} from './shared.jsx';

const A = 0.83; // a fixed, good line (close to the least-squares one)
const B = 1.95;
const HAND = 2; // index of the 3-hour student, whose residual is computed by hand
const DRAG = 7; // index of the 8-hour student, who can be dragged
const scale = makeScale();
const START_MSE = mseOf(A, B);
const START_MAE = maeOf(A, B);

export default function ResidualLab({ onSolved }) {
  const [res, setRes] = useState('');
  const [dragY, setDragY] = useState(POINTS[DRAG][1]);
  const [which, setWhich] = useState(null);
  const [tries, setTries] = useState(0);
  const svg = useRef(null);
  const drag = useRef(false);

  const pts = POINTS.map((p, i) => (i === DRAG ? [p[0], dragY] : p));
  const mse = mseOf(A, B, pts);
  const mae = maeOf(A, B, pts);
  const [hx, hy] = POINTS[HAND];
  const resOk = isClose(res, hy - (A * hx + B), 0.02);
  const outlierOk = mse >= 3 * START_MSE;
  const whichOk = which === 'mse';
  const ok = resOk && outlierOk && whichOk;
  useEffect(() => onSolved(ok), [ok, onSolved]);

  const setFromPointer = (e) => {
    const y = scale.fromY(pointerSvgY(e, svg.current));
    setDragY(Math.max(0, Math.min(12, Math.round(y * 10) / 10)));
  };
  const pick = (k) => {
    setWhich(k);
    if (k !== 'mse') setTries((t) => t + 1);
  };
  const { X, Y } = scale;

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">
          ŷ = <em>{A}</em> x + <em>{B}</em>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 1.</b> The {hx}-hour student scored {hy}. Compute the residual e = y − ŷ for this student (2
            decimals).
          </p>
          <NumberCheck
            id="res3"
            label={`e for x = ${hx}`}
            expected={hy - (A * hx + B)}
            tolerance={0.02}
            value={res}
            onChange={setRes}
            onTry={() => setTries((t) => t + 1)}
          />
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 2.</b> Drag the orange student (8 hours) up or down until the MSE is at least <b>3 times</b> its
            starting value.
          </p>
          <div className="slider">
            <label htmlFor="out">
              Score of the 8-hour student <span className="mono">{dragY.toFixed(1)}</span>
            </label>
            <input
              id="out"
              type="range"
              min="0"
              max="12"
              step="0.1"
              value={dragY}
              onChange={(e) => setDragY(+e.target.value)}
            />
          </div>
          <table className="mini-table">
            <thead>
              <tr>
                <th />
                <th>Start</th>
                <th>Now</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>MAE</th>
                <td className="mono">{START_MAE.toFixed(3)}</td>
                <td className="mono">{mae.toFixed(3)}</td>
                <td className="mono">×{(mae / START_MAE).toFixed(1)}</td>
              </tr>
              <tr>
                <th>MSE</th>
                <td className="mono">{START_MSE.toFixed(3)}</td>
                <td className="mono">{mse.toFixed(3)}</td>
                <td className="mono">×{(mse / START_MSE).toFixed(1)}</td>
              </tr>
            </tbody>
          </table>
          <Goal ok={outlierOk} text="MSE not yet ×3" />
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 3.</b> One outlier appeared. Which error measure reacted much more strongly?
          </p>
          <div className="tabs" role="group" aria-label="Which measure reacted more?">
            {[
              ['mae', 'MAE'],
              ['mse', 'MSE'],
            ].map(([k, label]) => (
              <button
                key={k}
                type="button"
                aria-pressed={which === k}
                className={which === k ? (k === 'mse' ? 'right' : 'wrong') : ''}
                onClick={() => pick(k)}
                disabled={!outlierOk}
              >
                {label}
              </button>
            ))}
          </div>
          <Goal ok={ok} text="Finish the three steps" />
          <Hint tries={tries}>
            ŷ = {A} × {hx} + {B} = {(A * hx + B).toFixed(2)}, so e = {hy} − {(A * hx + B).toFixed(2)}. For step 3,
            compare the "Growth" column: squaring makes one big gap count a lot.
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Residuals of a fixed line</h3>
        <Plot
          scale={scale}
          svgRef={svg}
          xTicks={[0, 2, 4, 6, 8, 10]}
          yTicks={[0, 3, 6, 9, 12]}
          label={`Fixed line and residuals; MSE ${mse.toFixed(2)}, MAE ${mae.toFixed(2)}`}
        >
          {pts.map(([x, y], i) => (
            <line
              key={`e${x}`}
              x1={X(x)}
              x2={X(x)}
              y1={Y(y)}
              y2={Y(A * x + B)}
              stroke={i === HAND ? COLORS.line : COLORS.err}
              strokeWidth={i === HAND ? 3.5 : 2.5}
              strokeDasharray="4 3"
            />
          ))}
          <Line scale={scale} a={A} b={B} color={COLORS.ink} width={3} />
          {pts.map(([x, y], i) =>
            i === DRAG ? null : (
              <circle
                key={x}
                cx={X(x)}
                cy={Y(y)}
                r={i === HAND ? 8 : 6.5}
                fill={COLORS.point}
                stroke="#FBF6EB"
                strokeWidth="2"
              />
            ),
          )}
          <text x={X(hx) + 10} y={Y(hy) + 18} fontSize="13" fontWeight="700" fill={COLORS.line}>
            e = ?
          </text>
          <circle
            cx={X(8)}
            cy={Y(dragY)}
            r="11"
            fill={COLORS.line}
            stroke="#FBF6EB"
            strokeWidth="3"
            style={{ cursor: 'ns-resize' }}
            onPointerDown={(e) => {
              drag.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              setFromPointer(e);
            }}
            onPointerMove={(e) => drag.current && setFromPointer(e)}
            onPointerUp={() => (drag.current = false)}
          />
        </Plot>
      </section>
    </div>
  );
}
