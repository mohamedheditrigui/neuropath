/* Ch. 2, level 3 — Feature scaling: min–max scale two values by hand, then race gradient descent
   on raw features against scaled features (200 steps each, largest stable learning rate). */
import { useEffect, useState } from 'react';
import { Choice, Goal, Hint, NumberCheck, isClose } from '../common.jsx';
import { FLATS } from './data.jsx';

const A_MIN = 45;
const A_MAX = 150;
const D_MIN = 1;
const D_MAX = 9;
const STEPS = 200;

/* Batch gradient descent on the MSE; returns the MAE after every step. */
function train(rows, lr) {
  const y = FLATS.map((r) => r[3]);
  let w = rows[0].map(() => 0);
  const curve = [];
  for (let s = 0; s <= STEPS; s++) {
    const err = rows.map((r, i) => r.reduce((a, v, j) => a + v * w[j], 0) - y[i]);
    curve.push(err.reduce((a, e) => a + Math.abs(e), 0) / rows.length);
    const grad = w.map((_, j) => (2 * rows.reduce((a, r, i) => a + r[j] * err[i], 0)) / rows.length);
    w = w.map((v, j) => v - lr * grad[j]);
  }
  return curve;
}
const RAW = {
  lr: 0.0001,
  curve: train(
    FLATS.map((r) => [1, r[0], r[1]]),
    0.0001,
  ),
}; // 0.00015 already diverges
const SCALED = {
  lr: 0.5,
  curve: train(
    FLATS.map((r) => [1, (r[0] - A_MIN) / (A_MAX - A_MIN), (r[1] - D_MIN) / (D_MAX - D_MIN)]),
    0.5,
  ),
};
const SX = (s) => 50 + (s / STEPS) * 470;
const SY = (v) => 270 - (Math.min(v, 160) / 160) * 240;

export default function ScaleLab({ onSolved }) {
  const [area, setArea] = useState('');
  const [dist, setDist] = useState('');
  const [ran, setRan] = useState({ raw: false, scaled: false });
  const [pick, setPick] = useState(null);
  const [tries, setTries] = useState(0);
  const inputsOk =
    isClose(area, (100 - A_MIN) / (A_MAX - A_MIN), 0.01) && isClose(dist, (5 - D_MIN) / (D_MAX - D_MIN), 0.01);
  const ok = inputsOk && ran.raw && ran.scaled && pick === 'scaled';
  useEffect(() => onSolved(ok), [ok, onSolved]);
  const bump = () => setTries((t) => t + 1);
  const path = (curve) => curve.map((v, s) => `${SX(s)},${SY(v)}`).join(' ');

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">x′ = (x − min) / (max − min)</div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 1.</b> Areas range from {A_MIN} to {A_MAX} m², distances from {D_MIN} to {D_MAX} km. Scale them to
            0–1 (2 decimals).
          </p>
          <div className="num-grid">
            <NumberCheck
              id="sa"
              label="100 m² →"
              expected={(100 - A_MIN) / (A_MAX - A_MIN)}
              value={area}
              onChange={setArea}
              onTry={bump}
            />
            <NumberCheck
              id="sd"
              label="5 km →"
              expected={(5 - D_MIN) / (D_MAX - D_MIN)}
              value={dist}
              onChange={setDist}
              onTry={bump}
            />
          </div>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 2.</b> Train the same model with gradient descent for {STEPS} steps, once on raw features and once
            on scaled ones. Each run uses the largest learning rate that does not explode.
          </p>
          <div className="actions">
            <button type="button" className="btn" onClick={() => setRan((r) => ({ ...r, raw: true }))}>
              Train on raw features
            </button>
            <button type="button" className="btn moss" onClick={() => setRan((r) => ({ ...r, scaled: true }))}>
              Train on scaled features
            </button>
          </div>
          {ran.raw && (
            <p className="mono">
              raw (η = {RAW.lr}): MAE after {STEPS} steps = {RAW.curve[STEPS].toFixed(1)}
            </p>
          )}
          {ran.scaled && (
            <p className="mono">
              scaled (η = {SCALED.lr}): MAE after {STEPS} steps = {SCALED.curve[STEPS].toFixed(1)}
            </p>
          )}
          {ran.raw && ran.scaled && (
            <>
              <p style={{ fontWeight: 700 }}>Which run reached a good model?</p>
              <Choice
                label="Which run reached a good model?"
                options={[
                  ['raw', 'Raw features'],
                  ['scaled', 'Scaled features'],
                ]}
                answer="scaled"
                value={pick}
                onPick={(v) => {
                  setPick(v);
                  if (v !== 'scaled') bump();
                }}
              />
            </>
          )}
          <Goal
            ok={ok}
            text={
              !inputsOk ? 'Scale the two values' : !(ran.raw && ran.scaled) ? 'Run both trainings' : 'Compare the runs'
            }
          />
          <Hint tries={tries}>
            (100 − 45) / (150 − 45) = 55 / 105. Raw areas are ~100 while distances are ~5, so one learning rate cannot
            suit both weights.
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Average error during training</h3>
        <svg
          className="plot"
          viewBox="0 0 540 310"
          role="img"
          aria-label="Average error against training steps for raw and scaled features"
          fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif"
        >
          {[0, 40, 80, 120, 160].map((v) => (
            <g key={v}>
              <line x1="50" x2="520" y1={SY(v)} y2={SY(v)} stroke="#E7D8BC" />
              <text x="42" y={SY(v) + 4} textAnchor="end" fontSize="12" fill="#5E4C3D">
                {v}
              </text>
            </g>
          ))}
          {[0, 50, 100, 150, 200].map((s) => (
            <text key={s} x={SX(s)} y="290" textAnchor="middle" fontSize="12" fill="#5E4C3D">
              {s}
            </text>
          ))}
          <line x1="50" x2="520" y1="270" y2="270" stroke="#2E2118" strokeWidth="2" />
          {ran.raw && <polyline points={path(RAW.curve)} fill="none" stroke="#A84F32" strokeWidth="3" />}
          {ran.scaled && <polyline points={path(SCALED.curve)} fill="none" stroke="#5F6D32" strokeWidth="3" />}
          <text x="285" y="306" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2E2118">
            Training steps
          </text>
          <text x="50" y="18" fontSize="13" fontWeight="700" fill="#2E2118">
            MAE (thousand TND)
          </text>
        </svg>
        <div className="legend">
          <span>
            <i style={{ background: '#A84F32' }} />
            Raw features
          </span>
          <span>
            <i style={{ background: '#5F6D32' }} />
            Scaled features
          </span>
        </div>
      </section>
    </div>
  );
}
