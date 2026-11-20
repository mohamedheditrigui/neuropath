/* Ch. 2, level 4 — Planes, not lines: the model seen from above as a coloured map (area × distance).
   Each flat is a dot coloured by its real price: when its colour matches the ground, the plane fits it.
   Also shows the matrix form ŷ = X·w for the first rows. */
import { useEffect, useState } from 'react';
import { Goal, Hint } from '../common.jsx';
import { FLATS, Slider, maeOf } from './data.jsx';

const AX = (a) => 50 + ((a - 40) / 120) * 470; // area 40–160
const DY = (d) => 290 - (d / 10) * 260; // distance 0–10
const MEAN = FLATS.reduce((s, r) => s + r[3], 0) / FLATS.length;
const MSE_MEAN = FLATS.reduce((s, r) => s + (r[3] - MEAN) ** 2, 0) / FLATS.length;

/* Price 0 → 300 mapped from sand to terracotta. */
function color(p) {
  const t = Math.max(0, Math.min(1, p / 300));
  const from = [231, 216, 188];
  const to = [126, 56, 32];
  return `rgb(${from.map((f, i) => Math.round(f + (to[i] - f) * t)).join(',')})`;
}

export default function PlaneLab({ level, onSolved }) {
  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(0);
  const [b, setB] = useState(40);
  const predict = (r) => w1 * r[0] + w2 * r[1] + b;
  const mae = maeOf(predict);
  const mse = FLATS.reduce((s, r) => s + (predict(r) - r[3]) ** 2, 0) / FLATS.length;
  const r2 = 1 - mse / MSE_MEAN;
  const ok = mae < level.goal;
  useEffect(() => onSolved(ok), [ok, onSolved]);

  const cells = [];
  for (let a = 40; a < 160; a += 5) for (let d = 0; d < 10; d += 0.5) cells.push([a, d]);
  // Contour lines of the plane: w1·a + w2·d + b = c, straight lines in this view.
  const contour = (c) => {
    if (Math.abs(w2) < 1e-6) return null;
    const dAt = (a) => (c - b - w1 * a) / w2;
    return [AX(40), DY(dAt(40)), AX(160), DY(dAt(160))];
  };

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">
          ŷ = <em>{w1.toFixed(2)}</em>·area {w2 < 0 ? '−' : '+'} <em>{Math.abs(w2).toFixed(1)}</em>·dist +{' '}
          <em>{b.toFixed(0)}</em>
        </div>
        <Slider id="pw1" label="w₁ (area)" value={w1} set={setW1} min="0" max="3" step="0.01" />
        <Slider id="pw2" label="w₂ (distance)" value={w2} set={setW2} min="-20" max="10" step="0.1" digits={1} />
        <Slider id="pb" label="b (bias)" value={b} set={setB} min="-50" max="150" step="1" digits={0} />
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Mini-exercise.</b> Tune the plane until every dot’s colour matches the ground under it: MAE below{' '}
            {level.goal}.
          </p>
          <div className="readout">
            <span>
              MAE <span className="mse">{mae.toFixed(1)}</span>
            </span>
            <span className="mono">R² = {r2.toFixed(3)}</span>
            <Goal ok={ok} text={`Not yet: below ${level.goal}`} />
          </div>
          <Hint>
            The colour should get darker to the right (bigger flats) and lighter upwards (further away): w₁ positive, w₂
            negative.
          </Hint>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 6 }}>
          <p>
            <b>Matrix form</b> ŷ = X·w with w = (b, w₁, w₂): each row of X is (1, area, distance).
          </p>
          <p className="mono" style={{ fontSize: '.9rem' }}>
            {FLATS.slice(0, 3).map((r) => (
              <span key={r[0]} style={{ display: 'block' }}>
                (1, {r[0]}, {r[1]})·({b.toFixed(0)}, {w1.toFixed(2)}, {w2.toFixed(1)}) = {predict(r).toFixed(0)} (real{' '}
                {r[3]})
              </span>
            ))}
            …
          </p>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>The plane seen from above</h3>
        <svg
          className="plot"
          viewBox="0 0 540 340"
          role="img"
          aria-label={`Map of predicted prices by area and distance, average error ${mae.toFixed(1)}`}
          fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif"
        >
          {cells.map(([a, d]) => (
            <rect
              key={`${a}-${d}`}
              x={AX(a)}
              y={DY(d + 0.5)}
              width={AX(a + 5) - AX(a) + 0.5}
              height={DY(d) - DY(d + 0.5) + 0.5}
              fill={color(w1 * (a + 2.5) + w2 * (d + 0.25) + b)}
            />
          ))}
          <clipPath id="plane-clip">
            <rect x={AX(40)} y={DY(10)} width={AX(160) - AX(40)} height={DY(0) - DY(10)} />
          </clipPath>
          <g clipPath="url(#plane-clip)">
            {[100, 200].map((c) => {
              const l = contour(c);
              return (
                l && (
                  <g key={c}>
                    <line
                      x1={l[0]}
                      y1={l[1]}
                      x2={l[2]}
                      y2={l[3]}
                      stroke="#2E2118"
                      strokeWidth="1.5"
                      strokeDasharray="6 5"
                    />
                  </g>
                )
              );
            })}
          </g>
          <rect
            x={AX(40)}
            y={DY(10)}
            width={AX(160) - AX(40)}
            height={DY(0) - DY(10)}
            fill="none"
            stroke="#2E2118"
            strokeWidth="2"
          />
          {FLATS.map((r) => (
            <g key={r[0]}>
              <circle cx={AX(r[0])} cy={DY(r[1])} r="12" fill={color(r[3])} stroke="#2E2118" strokeWidth="2.5" />
              <text x={AX(r[0])} y={DY(r[1]) - 17} textAnchor="middle" fontSize="12" fontWeight="700" fill="#2E2118">
                {r[3]}
              </text>
            </g>
          ))}
          {[40, 70, 100, 130, 160].map((a) => (
            <text key={a} x={AX(a)} y="308" textAnchor="middle" fontSize="12" fill="#5E4C3D">
              {a}
            </text>
          ))}
          {[0, 5, 10].map((d) => (
            <text key={d} x="42" y={DY(d) + 4} textAnchor="end" fontSize="12" fill="#5E4C3D">
              {d}
            </text>
          ))}
          <text x="285" y="330" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2E2118">
            Area (m²)
          </text>
          <text x="50" y="22" fontSize="13" fontWeight="700" fill="#2E2118">
            Distance (km)
          </text>
        </svg>
        <p className="muted">
          Dashed lines: where the plane predicts exactly 100 and 200. On a plane they are always straight and parallel.
        </p>
      </section>
    </div>
  );
}
