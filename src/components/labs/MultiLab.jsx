/* Chapter 2: predict flat prices from area and distance with two weights and a bias. */
import { useEffect, useState } from 'react';
import Icon from '../Icon.jsx';

// [area m², distance km, real price in thousand TND]; roughly price = 1.5·area − 8·distance + 60
const FLATS = [
  [60, 2, 135], [85, 5, 147], [110, 1, 216], [45, 8, 61], [130, 6, 205], [70, 3, 141], [95, 9, 128], [150, 2, 266],
];
const BAR_MAX = 300;

export default function MultiLab({ level, onSolved }) {
  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(0);
  const [b, setB] = useState(20);
  const pred = (area, dist) => w1 * area + w2 * dist + b;
  const mae = FLATS.reduce((s, [ar, d, p]) => s + Math.abs(pred(ar, d) - p), 0) / FLATS.length;
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
          price = <em>{w1.toFixed(2)}</em>·area {w2 < 0 ? '−' : '+'} <em>{Math.abs(w2).toFixed(2)}</em>·dist + <em>{b.toFixed(0)}</em>
        </div>
        {slider('w1', 'Weight of area (w₁)', w1, setW1, 0, 3, 0.01)}
        {slider('w2', 'Weight of distance (w₂)', w2, setW2, -20, 10, 0.1)}
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
        <div className="legend"><span><i style={{ background: '#5F6D32' }} />Real price</span><span><i style={{ background: '#A84F32' }} />Predicted</span></div>
        <svg className="plot" viewBox="0 0 540 330" role="img" aria-label={`Bar chart comparing real and predicted prices, average error ${mae.toFixed(1)}`} fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif">
          {[0, 100, 200, 300].map((v) => (
            <g key={v}>
              <line x1="50" x2="530" y1={270 - (v / BAR_MAX) * 240} y2={270 - (v / BAR_MAX) * 240} stroke="#E7D8BC" />
              <text x="42" y={274 - (v / BAR_MAX) * 240} textAnchor="end" fontSize="12" fill="#5E4C3D">{v}</text>
            </g>
          ))}
          {FLATS.map(([ar, d, p], i) => {
            const x = 62 + i * 58;
            const real = Math.max(0, Math.min(BAR_MAX, p));
            const guess = Math.max(0, Math.min(BAR_MAX, pred(ar, d)));
            return (
              <g key={i}>
                <rect x={x} y={270 - (real / BAR_MAX) * 240} width="20" height={(real / BAR_MAX) * 240} fill="#5F6D32" rx="3" />
                <rect x={x + 22} y={270 - (guess / BAR_MAX) * 240} width="20" height={(guess / BAR_MAX) * 240} fill="#A84F32" rx="3" />
                <text x={x + 21} y="288" textAnchor="middle" fontSize="11" fill="#2E2118">{ar}m²</text>
                <text x={x + 21} y="302" textAnchor="middle" fontSize="11" fill="#5E4C3D">{d} km</text>
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
