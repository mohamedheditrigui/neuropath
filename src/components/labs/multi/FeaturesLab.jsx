/* Ch. 2, level 1 — One feature is not enough: fit the price with area only (stuck around 19),
   then add the distance feature and watch the error fall. */
import { useEffect, useState } from 'react';
import { Goal, Hint } from '../common.jsx';
import { PriceBars, Slider, maeOf } from './data.jsx';

const AREA_ONLY_BEST = 19.1; // best MAE reachable with area alone (computed offline on these 8 flats)
const UNLOCK = 25; // get the area-only model this close before adding a feature

export default function FeaturesLab({ level, onSolved }) {
  const [w1, setW1] = useState(1);
  const [w2, setW2] = useState(0);
  const [b, setB] = useState(20);
  const [both, setBoth] = useState(false);
  const predict = (r) => w1 * r[0] + (both ? w2 * r[1] : 0) + b;
  const mae = maeOf(predict);
  const ok = both && mae < level.goal;
  useEffect(() => onSolved(ok), [ok, onSolved]);

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">
          price = <em>{w1.toFixed(2)}</em>·area
          {both && (
            <>
              {' '}
              {w2 < 0 ? '−' : '+'} <em>{Math.abs(w2).toFixed(1)}</em>·dist
            </>
          )}{' '}
          + <em>{b.toFixed(0)}</em>
        </div>
        <Slider id="fw1" label="Weight of area (w₁)" value={w1} set={setW1} min="0" max="3" step="0.01" />
        {both && (
          <Slider
            id="fw2"
            label="Weight of distance (w₂)"
            value={w2}
            set={setW2}
            min="-20"
            max="10"
            step="0.1"
            digits={1}
          />
        )}
        <Slider id="fb" label="Bias b" value={b} set={setB} min="-50" max="150" step="1" digits={0} />
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          {!both ? (
            <>
              <p>
                <b>Step 1.</b> Use <b>area only</b>. Bring the average error under {UNLOCK} thousand TND. Notice you
                cannot go much lower: two flats of similar size can have very different prices.
              </p>
              <div className="readout">
                <span>
                  MAE <span className="mse">{mae.toFixed(1)}</span>
                </span>
                <span className="muted">best possible with area only ≈ {AREA_ONLY_BEST}</span>
              </div>
              <button
                type="button"
                className="btn primary"
                style={{ justifySelf: 'start' }}
                disabled={mae >= UNLOCK}
                onClick={() => setBoth(true)}
              >
                Add the distance feature
              </button>
            </>
          ) : (
            <>
              <p>
                <b>Step 2.</b> Now the model also knows the distance to the centre. Bring the MAE under {level.goal}:
                far lower than area alone could ever reach.
              </p>
              <div className="readout">
                <span>
                  MAE <span className="mse">{mae.toFixed(1)}</span>
                </span>
                <Goal ok={ok} text={`Not yet: below ${level.goal}`} />
              </div>
            </>
          )}
          <Hint>
            {both
              ? 'Distance lowers the price, so its weight is negative: try about −8, then raise the bias until the bars line up.'
              : 'Start with w₁ near 1.8 and move the bias down to about −8.'}
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Eight flats: real price and your prediction</h3>
        <PriceBars predict={predict} label={`Real and predicted prices, average error ${mae.toFixed(1)}`} />
      </section>
    </div>
  );
}
