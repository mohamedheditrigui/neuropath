/* Chapter 1: fit y = a·x + b by hand and watch the mean squared error. */
import { useEffect, useState } from 'react';
import Icon from '../Icon.jsx';

const POINTS = [[1, 2.6], [2, 3.9], [3, 4.2], [4, 5.8], [5, 5.6], [6, 7.1], [7, 7.4], [8, 8.9], [9, 9.1], [10, 10.4]];
const X = (x) => 56 + (x / 11) * 460;
const Y = (y) => 318 - (y / 12) * 296;
const clip = (v) => Math.max(-1, Math.min(13, v));

export const mseOf = (a, b) => POINTS.reduce((s, [x, y]) => s + (a * x + b - y) ** 2, 0) / POINTS.length;

export default function LineLab({ level, onSolved }) {
  const [a, setA] = useState(0.2);
  const [b, setB] = useState(6.5);
  const [showErr, setShowErr] = useState(true);
  const mse = mseOf(a, b);
  const ok = mse < level.goal;
  useEffect(() => onSolved(ok), [ok, onSolved]);

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">
          y = <em>{a.toFixed(2)}</em> x {b < 0 ? '−' : '+'} <em>{Math.abs(b).toFixed(2)}</em>
        </div>
        <div className="slider">
          <label htmlFor="sa">Slope a <span className="mono">{a.toFixed(2)}</span></label>
          <input id="sa" type="range" min="-0.5" max="2" step="0.01" value={a} onChange={(e) => setA(+e.target.value)} />
        </div>
        <div className="slider">
          <label htmlFor="sb">Intercept b <span className="mono">{b.toFixed(2)}</span></label>
          <input id="sb" type="range" min="-2" max="10" step="0.01" value={b} onChange={(e) => setB(+e.target.value)} />
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p><b>Mini-exercise.</b> Move the sliders until the MSE drops below {level.goal}.</p>
          <div className="readout">
            <span>MSE <span className="mse">{mse.toFixed(2)}</span></span>
            <span className={`chip ${ok ? 'good' : 'warn'}`}>{ok ? <><Icon name="check" /> Goal reached</> : `Not yet: below ${level.goal}`}</span>
          </div>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <div className="readout">
          <h3>Hours studied and exam score</h3>
          <label className="toggle"><input type="checkbox" checked={showErr} onChange={(e) => setShowErr(e.target.checked)} />Show errors</label>
        </div>
        <svg className="plot" viewBox="0 0 540 372" role="img" aria-label={`Scatter plot of ten points with the line y = ${a.toFixed(2)}x + ${b.toFixed(2)}`} fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif">
          {[0, 2, 4, 6, 8, 10].map((i) => (
            <g key={`x${i}`}>
              <line x1={X(i)} x2={X(i)} y1="22" y2="318" stroke="#E7D8BC" />
              <text x={X(i)} y="338" textAnchor="middle" fontSize="13" fill="#5E4C3D">{i}</text>
            </g>
          ))}
          {[0, 3, 6, 9, 12].map((i) => (
            <g key={`y${i}`}>
              <line x1="56" x2="516" y1={Y(i)} y2={Y(i)} stroke="#E7D8BC" />
              <text x="46" y={Y(i) + 4} textAnchor="end" fontSize="13" fill="#5E4C3D">{i}</text>
            </g>
          ))}
          <line x1="56" x2="516" y1="318" y2="318" stroke="#2E2118" strokeWidth="2" />
          <line x1="56" x2="56" y1="22" y2="318" stroke="#2E2118" strokeWidth="2" />
          {showErr && POINTS.map(([x, y]) => (
            <line key={x} x1={X(x)} x2={X(x)} y1={Y(y)} y2={Y(clip(a * x + b))} stroke="#C98F2B" strokeWidth="2.5" strokeDasharray="4 3" />
          ))}
          <line x1={X(0)} y1={Y(clip(b))} x2={X(11)} y2={Y(clip(a * 11 + b))} stroke="#A84F32" strokeWidth="4" strokeLinecap="round" />
          {POINTS.map(([x, y]) => <circle key={x} cx={X(x)} cy={Y(y)} r="6.5" fill="#5F6D32" stroke="#FBF6EB" strokeWidth="2" />)}
          <text x="286" y="364" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2E2118">Hours studied (x)</text>
          <text x="62" y="16" fontSize="13" fontWeight="700" fill="#2E2118">Exam score (y)</text>
        </svg>
      </section>
    </div>
  );
}
