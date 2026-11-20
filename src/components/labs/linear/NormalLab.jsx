/* Level 6 — Least squares by hand: build AᵀA and Aᵀb for four points (example from the INDP2 course
   "Moindres carrés et régression linéaire"), solve the normal equations, and see the best line t = 2 + 4s. */
import { useEffect, useState } from 'react';
import Icon from '../../Icon.jsx';
import { COLORS, Goal, Hint, Line, NumberCheck, Plot, isClose, makeScale } from './shared.jsx';

const PTS = [
  [0, 1],
  [1, 9],
  [3, 9],
  [4, 21],
];
const n = PTS.length;
const S = PTS.reduce((s, [x]) => s + x, 0); // Σs = 8
const SS = PTS.reduce((s, [x]) => s + x * x, 0); // Σs² = 26
const T = PTS.reduce((s, [, y]) => s + y, 0); // Σt = 40
const ST = PTS.reduce((s, [x, y]) => s + x * y, 0); // Σs·t = 120
const DET = n * SS - S * S; // 40
const ALPHA = (SS * T - S * ST) / DET; // 2
const BETA = (n * ST - S * T) / DET; // 4
const SSE = PTS.reduce((s, [x, y]) => s + (y - ALPHA - BETA * x) ** 2, 0); // 44
const scale = makeScale({ xMax: 5, yMax: 24 });

export default function NormalLab({ onSolved }) {
  const [v, setV] = useState({ n: '', s: '', ss: '', t: '', st: '', alpha: '', beta: '' });
  const [tries, setTries] = useState(0);
  const set = (k) => (val) => setV((o) => ({ ...o, [k]: val }));
  const bump = () => setTries((t) => t + 1);

  const step1 = isClose(v.n, n) && isClose(v.s, S) && isClose(v.ss, SS);
  const step2 = step1 && isClose(v.t, T) && isClose(v.st, ST);
  const step3 = step2 && isClose(v.alpha, ALPHA, 0.01) && isClose(v.beta, BETA, 0.01);
  useEffect(() => onSolved(step3), [step3, onSolved]);
  const { X, Y } = scale;

  return (
    <div className="lesson">
      <section className="lab">
        <div className="panel" style={{ display: 'grid', gap: 6 }}>
          <p>
            Find the line t = α + β·s closest to the points (0, 1), (1, 9), (3, 9), (4, 21). Each row of A is (1, sᵢ),
            and b holds the tᵢ.
          </p>
          <div className="formula">AᵀA · (α, β) = Aᵀb</div>
        </div>
        <fieldset className="panel step-box">
          <legend>
            <b>Step 1.</b> AᵀA = [[n, Σs], [Σs, Σs²]] {step1 && <Icon name="check" />}
          </legend>
          <div className="num-grid">
            <NumberCheck id="nn" label="n" expected={n} value={v.n} onChange={set('n')} onTry={bump} />
            <NumberCheck id="ns" label="Σs" expected={S} value={v.s} onChange={set('s')} onTry={bump} />
            <NumberCheck id="nss" label="Σs²" expected={SS} value={v.ss} onChange={set('ss')} onTry={bump} />
          </div>
        </fieldset>
        {step1 && (
          <fieldset className="panel step-box">
            <legend>
              <b>Step 2.</b> Aᵀb = (Σt, Σs·t) {step2 && <Icon name="check" />}
            </legend>
            <div className="num-grid">
              <NumberCheck id="nt" label="Σt" expected={T} value={v.t} onChange={set('t')} onTry={bump} />
              <NumberCheck id="nst" label="Σs·t" expected={ST} value={v.st} onChange={set('st')} onTry={bump} />
            </div>
          </fieldset>
        )}
        {step2 && (
          <fieldset className="panel step-box">
            <legend>
              <b>Step 3.</b> Solve the 2 × 2 system {step3 && <Icon name="check" />}
            </legend>
            <p className="mono" style={{ fontSize: '.95rem' }}>
              {n}α + {S}β = {T}
              <br />
              {S}α + {SS}β = {ST}
              <br />
              det = {n}×{SS} − {S}² = {DET}
            </p>
            <div className="num-grid">
              <NumberCheck
                id="na"
                label="α (intercept)"
                expected={ALPHA}
                value={v.alpha}
                onChange={set('alpha')}
                onTry={bump}
              />
              <NumberCheck
                id="nb"
                label="β (slope)"
                expected={BETA}
                value={v.beta}
                onChange={set('beta')}
                onTry={bump}
              />
            </div>
          </fieldset>
        )}
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <Goal ok={step3} text={step2 ? 'Solve for α and β' : step1 ? 'Now build Aᵀb' : 'Start with AᵀA'} />
          {step3 && (
            <p>
              Best line:{' '}
              <b>
                t = {ALPHA} + {BETA}s
              </b>
              . Sum of squared residuals = 1 + 9 + 25 + 9 = <b>{SSE}</b>: no other line does better.
            </p>
          )}
          <Hint tries={tries}>
            {!step1
              ? 'n is the number of points. Σs = 0 + 1 + 3 + 4. Σs² = 0 + 1 + 9 + 16.'
              : !step2
                ? 'Σt = 1 + 9 + 9 + 21. Σs·t = 0×1 + 1×9 + 3×9 + 4×21.'
                : 'From the first equation, α = (40 − 8β) / 4 = 10 − 2β. Substitute it in the second: 8(10 − 2β) + 26β = 120.'}
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Four points, one best line</h3>
        <Plot
          scale={scale}
          xTicks={[0, 1, 2, 3, 4, 5]}
          yTicks={[0, 6, 12, 18, 24]}
          xLabel="s"
          yLabel="t"
          label={step3 ? 'Four points and the least-squares line t = 2 + 4s' : 'Four points'}
        >
          {step3 &&
            PTS.map(([x, y]) => (
              <line
                key={`e${x}`}
                x1={X(x)}
                x2={X(x)}
                y1={Y(y)}
                y2={Y(ALPHA + BETA * x)}
                stroke={COLORS.err}
                strokeWidth="2.5"
                strokeDasharray="4 3"
              />
            ))}
          {step3 && <Line scale={scale} a={BETA} b={ALPHA} />}
          {PTS.map(([x, y]) => (
            <g key={x}>
              <circle cx={X(x)} cy={Y(y)} r="7" fill={COLORS.point} stroke="#FBF6EB" strokeWidth="2" />
              <text x={X(x) + 10} y={Y(y) - 8} fontSize="12" fill={COLORS.soft}>
                ({x}, {y})
              </text>
            </g>
          ))}
        </Plot>
      </section>
    </div>
  );
}
