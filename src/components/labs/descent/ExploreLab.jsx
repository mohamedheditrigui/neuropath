/* Ch. 3, level 1 — The loss landscape in the fog: the curve is hidden. Probe the loss at a few weights,
   read the slope at each probe, and plant a flag at the bottom of the valley. */
import { useEffect, useRef, useState } from 'react';
import { Goal, Hint, pointerSvg } from '../common.jsx';
import { LY, ValleyFrame, WX, curvePoints, fromWX, grad, loss } from './valley.jsx';

const MIN_PROBES = 4;
const TOLERANCE = 0.25;

export default function ExploreLab({ onSolved }) {
  const [w, setW] = useState(-1);
  const [probes, setProbes] = useState([]);
  const [flag, setFlag] = useState(null);
  const svg = useRef(null);
  const drag = useRef(false);

  const ok = probes.length >= MIN_PROBES && flag !== null && Math.abs(flag - 3) <= TOLERANCE;
  useEffect(() => onSolved(ok), [ok, onSolved]);
  const probe = () => setProbes((p) => [...p, w]);
  const move = (e) => {
    if (!drag.current) return;
    const { x } = pointerSvg(e, svg.current);
    setW(Math.max(-2, Math.min(8, Math.round(fromWX(x) * 10) / 10)));
  };
  const last = probes[probes.length - 1];
  const sorted = [...probes].sort((a, b) => a - b);

  return (
    <div className="lesson">
      <section className="lab">
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            The landscape is hidden in fog. Move the explorer (drag it or use the slider), press <b>Probe</b> to measure
            the loss there, then plant your flag where you think the bottom is.
          </p>
          <div className="slider">
            <label htmlFor="ew">
              Explorer at w = <span className="mono">{w.toFixed(1)}</span>
            </label>
            <input id="ew" type="range" min="-2" max="8" step="0.1" value={w} onChange={(e) => setW(+e.target.value)} />
          </div>
          <div className="actions">
            <button type="button" className="btn primary" onClick={probe}>
              Probe here
            </button>
            <button type="button" className="btn moss" onClick={() => setFlag(w)} disabled={probes.length < MIN_PROBES}>
              Plant the flag here
            </button>
          </div>
          {probes.length < MIN_PROBES && (
            <p className="muted">
              Probe at least {MIN_PROBES} places before planting the flag ({probes.length}/{MIN_PROBES}).
            </p>
          )}
          {last !== undefined && (
            <p className="mono" aria-live="polite">
              loss({last.toFixed(1)}) = {loss(last).toFixed(2)}, slope {grad(last).toFixed(1)} → downhill is to the{' '}
              {grad(last) > 0 ? 'left' : grad(last) < 0 ? 'right' : '… nowhere: flat!'}
            </p>
          )}
          <div className="readout">
            <span className="muted">{flag === null ? 'No flag yet' : `Flag at w = ${flag.toFixed(1)}`}</span>
            <Goal ok={ok} text={flag === null ? 'Plant the flag at the bottom' : 'Not the bottom yet'} />
          </div>
          <Hint tries={flag !== null && !ok ? 2 : 0}>
            Follow the slope: if it is negative, the bottom is to the right; if positive, to the left. The bottom is
            where the slope is 0.
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>What you have discovered</h3>
        <ValleyFrame label={`Hidden loss curve with ${probes.length} probes`} svgRef={svg}>
          <rect x="50" y="20" width="470" height="260" fill="#E7D8BC" opacity=".45" />
          {ok && <polyline points={curvePoints()} fill="none" stroke="#6B4A33" strokeWidth="3" opacity=".7" />}
          {sorted.length > 1 && (
            <polyline
              points={sorted.map((p) => `${WX(p)},${LY(loss(p))}`).join(' ')}
              fill="none"
              stroke="#C98F2B"
              strokeWidth="2"
              strokeDasharray="5 4"
            />
          )}
          {probes.map((p, i) => (
            <circle key={i} cx={WX(p)} cy={LY(loss(p))} r="6" fill="#5F6D32" stroke="#FBF6EB" strokeWidth="2" />
          ))}
          {last !== undefined && (
            <line
              x1={WX(last - 0.6)}
              x2={WX(last + 0.6)}
              y1={LY(loss(last) - 0.6 * grad(last))}
              y2={LY(loss(last) + 0.6 * grad(last))}
              stroke="#2E2118"
              strokeWidth="2.5"
            />
          )}
          {flag !== null && (
            <g>
              <line x1={WX(flag)} x2={WX(flag)} y1="280" y2="236" stroke="#2E2118" strokeWidth="3" />
              <path d={`M${WX(flag)} 236 l22 8 l-22 8 z`} fill="#A84F32" />
            </g>
          )}
          <g
            style={{ cursor: 'ew-resize' }}
            onPointerDown={(e) => {
              drag.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={move}
            onPointerUp={() => (drag.current = false)}
          >
            <line x1={WX(w)} x2={WX(w)} y1="28" y2="280" stroke="#A84F32" strokeWidth="2" strokeDasharray="3 4" />
            <circle cx={WX(w)} cy="268" r="11" fill="#A84F32" stroke="#FBF6EB" strokeWidth="3" />
          </g>
        </ValleyFrame>
        <p className="muted">
          Green dots: probes. Black segment: the slope at your last probe. The real curve appears once you find the
          bottom.
        </p>
      </section>
    </div>
  );
}
