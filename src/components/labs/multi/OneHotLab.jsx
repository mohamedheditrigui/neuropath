/* Ch. 2, level 5 — Yes/no features: fill a one-hot table for neighbourhoods,
   then learn the weight of a 0/1 "balcony" feature with the other weights fixed. */
import { useEffect, useState } from 'react';
import { Goal, Hint } from '../common.jsx';
import { FLATS_BALCONY, PriceBars, Slider, TRUE_MODEL, maeOf } from './data.jsx';

const ZONES = ['Lac', 'Marsa', 'Ariana'];
const ROWS = [
  ['Flat 1', 'Marsa'],
  ['Flat 2', 'Lac'],
  ['Flat 3', 'Ariana'],
  ['Flat 4', 'Marsa'],
];

export default function OneHotLab({ level, onSolved }) {
  const [cells, setCells] = useState(() => ROWS.map(() => ZONES.map(() => 0)));
  const [w3, setW3] = useState(0);
  const [checked, setChecked] = useState(0);

  const tableOk = ROWS.every(([, zone], i) => ZONES.every((z, j) => cells[i][j] === (z === zone ? 1 : 0)));
  const predict = (r) => TRUE_MODEL.w1 * r[0] + TRUE_MODEL.w2 * r[1] + w3 * r[2] + TRUE_MODEL.b;
  const mae = maeOf(predict, FLATS_BALCONY);
  const balconyOk = mae < level.goal;
  const ok = tableOk && balconyOk;
  useEffect(() => onSolved(ok), [ok, onSolved]);

  const flip = (i, j) =>
    setCells((c) => c.map((row, ri) => (ri === i ? row.map((v, cj) => (cj === j ? 1 - v : v)) : row)));
  const wrongRows = ROWS.filter(([, zone], i) => !ZONES.every((z, j) => cells[i][j] === (z === zone ? 1 : 0))).length;

  return (
    <div className="lesson">
      <section className="lab">
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 1.</b> One-hot encode the neighbourhood: click a cell to switch it between 0 and 1.
          </p>
          <div className="table-scroll">
            <table className="mini-table onehot">
              <thead>
                <tr>
                  <th>Flat</th>
                  <th>Zone</th>
                  {ZONES.map((z) => (
                    <th key={z}>is_{z}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([name, zone], i) => (
                  <tr key={name}>
                    <th>{name}</th>
                    <td>{zone}</td>
                    {ZONES.map((z, j) => (
                      <td key={z}>
                        <button
                          type="button"
                          className={`cell ${cells[i][j] ? 'on' : ''}`}
                          aria-label={`${name}, is_${z}: ${cells[i][j]}`}
                          onClick={() => flip(i, j)}
                        >
                          {cells[i][j]}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="readout">
            <button type="button" className="btn ghost" onClick={() => setChecked((c) => c + 1)}>
              Check the table
            </button>
            {checked > 0 && <Goal ok={tableOk} text={`${wrongRows} row${wrongRows === 1 ? '' : 's'} to fix`} />}
          </div>
          <Hint tries={checked}>
            Each row has exactly one 1: in the column of its own zone. Every other cell stays 0.
          </Hint>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 2.</b> Some flats have a balcony (★, balcony = 1). Area, distance and bias are already learned. Find
            the balcony weight: the extra price when balcony = 1. Bring the MAE under {level.goal}.
          </p>
          <div className="formula">
            price = 1.5·area − 8·dist + <em>{w3.toFixed(0)}</em>·balcony + 60
          </div>
          <Slider
            id="w3"
            label="Weight of balcony (w₃)"
            value={w3}
            set={setW3}
            min="-20"
            max="60"
            step="1"
            digits={0}
          />
          <div className="readout">
            <span>
              MAE <span className="mse">{mae.toFixed(1)}</span>
            </span>
            <Goal ok={balconyOk} text={`Not yet: below ${level.goal}`} />
          </div>
          <Hint>
            Look at the ★ flats: how far below the green bars are the orange ones when w₃ = 0? That gap is the balcony’s
            value.
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Flats with and without a balcony</h3>
        <PriceBars
          data={FLATS_BALCONY}
          predict={predict}
          stars
          label={`Real and predicted prices with balcony weight ${w3}, average error ${mae.toFixed(1)}`}
        />
      </section>
    </div>
  );
}
