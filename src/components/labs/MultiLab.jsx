/* Chapter 2: predict flat prices from area and distance (and, in the last level, a yes/no balcony feature). */
import { useEffect, useState } from 'react';
import Icon from '../Icon.jsx';

// [area m², distance km, balcony 0/1, real price in thousand TND]
// Without balcony: roughly price = 1.5·area − 8·distance + 60
const FLATS = [
  [60, 2, 0, 135], [85, 5, 0, 147], [110, 1, 0, 216], [45, 8, 0, 61], [130, 6, 0, 205], [70, 3, 0, 141], [95, 9, 0, 128], [150, 2, 0, 266],
];
// With balcony: the same rule plus about 30 when there is a balcony
const FLATS_BALCONY = [
  [60, 2, 1, 166], [85, 5, 0, 147], [110, 1, 1, 246], [45, 8, 0, 61], [130, 6, 1, 236], [70, 3, 0, 141], [95, 9, 1, 158], [150, 2, 0, 266],
];
const BAR_MAX = 300;

export default function MultiLab({ level, onSolved }) {
  const balconyMode = level.mode === 'balcony';
  const data = balconyMode ? FLATS_BALCONY : FLATS;
  const [w1, setW1] = useState(balconyMode ? 1.5 : 1);
  const [w2, setW2] = useState(balconyMode ? -8 : 0);
  const [w3, setW3] = useState(0);
  const [b, setB] = useState(balconyMode ? 60 : 20);
  const pred = (area, dist, balc) => w1 * area + w2 * dist + w3 * balc + b;
  const mae = data.reduce((s, [ar, d, bc, p]) => s + Math.abs(pred(ar, d, bc) - p), 0) / data.length;
  const ok = mae < level.goal;
  useEffect(() => onSolved(ok), [ok, onSolved]);

  const slider = (id, label, value, set, min, max, step) => (
    <div className="slider">
      <label htmlFor={id}>{label} <span className="mono">{value.toFixed(2)}</span></label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(+e.target.value)} />
    </div>
  );

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">
          price = <em>{w1.toFixed(2)}</em>·area {w2 < 0 ? '−' : '+'} <em>{Math.abs(w2).toFixed(1)}</em>·dist
          {balconyMode && <> + <em>{w3.toFixed(0)}</em>·balcony</>} + <em>{b.toFixed(0)}</em>
        </div>
        {slider('w1', 'Weight of area (w₁)', w1, setW1, 0, 3, 0.01)}
        {slider('w2', 'Weight of distance (w₂)', w2, setW2, -20, 10, 0.1)}
        {balconyMode && slider('w3', 'Weight of balcony (w₃)', w3, setW3, -20, 60, 1)}
        {slider('b0', 'Bias b', b, setB, -50, 150, 1)}
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p><b>Mini-exercise.</b> Bring the average error (MAE) under {level.goal} thousand TND.</p>
          <div className="readout">
            <span>MAE <span className="mse">{mae.toFixed(1)}</span></span>
            <span className={`chip ${ok ? 'good' : 'warn'}`}>{ok ? <><Icon name="check" /> Goal reached</> : `Not yet: below ${level.goal}`}</span>
          </div>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Eight flats: real price and your prediction</h3>
        <div className="legend">
          <span><i style={{ background: '#5F6D32' }} />Real price</span>
          <span><i style={{ background: '#A84F32' }} />Predicted</span>
          {balconyMode && <span>★ = has a balcony</span>}
        </div>
        <svg className="plot" viewBox="0 0 540 330" role="img" aria-label={`Bar chart comparing real and predicted prices, average error ${mae.toFixed(1)}`} fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif">
          {[0, 100, 200, 300].map((v) => (
            <g key={v}>
              <line x1="50" x2="530" y1={270 - (v / BAR_MAX) * 240} y2={270 - (v / BAR_MAX) * 240} stroke="#E7D8BC" />
              <text x="42" y={274 - (v / BAR_MAX) * 240} textAnchor="end" fontSize="12" fill="#5E4C3D">{v}</text>
            </g>
          ))}
          {data.map(([ar, d, bc, p], i) => {
            const x = 62 + i * 58;
            const real = Math.max(0, Math.min(BAR_MAX, p));
            const guess = Math.max(0, Math.min(BAR_MAX, pred(ar, d, bc)));
            return (
              <g key={i}>
                <rect x={x} y={270 - (real / BAR_MAX) * 240} width="20" height={(real / BAR_MAX) * 240} fill="#5F6D32" rx="3" />
                <rect x={x + 22} y={270 - (guess / BAR_MAX) * 240} width="20" height={(guess / BAR_MAX) * 240} fill="#A84F32" rx="3" />
                <text x={x + 21} y="288" textAnchor="middle" fontSize="11" fill="#2E2118">{ar}m²</text>
                <text x={x + 21} y="302" textAnchor="middle" fontSize="11" fill="#5E4C3D">{d} km</text>
                {balconyMode && bc === 1 && <text x={x + 21} y="318" textAnchor="middle" fontSize="13" fill="#97691A">★</text>}
              </g>
            );
          })}
          <line x1="50" x2="530" y1="270" y2="270" stroke="#2E2118" strokeWidth="2" />
          <text x="50" y="22" fontSize="13" fontWeight="700" fill="#2E2118">Price (thousand TND)</text>
        </svg>
      </section>
    </div>
  );
}
