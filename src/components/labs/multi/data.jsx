/* Chapter 2 data and the price bar chart shared by its activities. */

// [area m², distance km, balcony 0/1, real price in thousand TND]. Rule behind them: 1.5·area − 8·distance + 60.
export const FLATS = [
  [60, 2, 0, 135],
  [85, 5, 0, 147],
  [110, 1, 0, 216],
  [45, 8, 0, 61],
  [130, 6, 0, 205],
  [70, 3, 0, 141],
  [95, 9, 0, 128],
  [150, 2, 0, 266],
];
// Same flats, some with a balcony worth about 30 more.
export const FLATS_BALCONY = [
  [60, 2, 1, 166],
  [85, 5, 0, 147],
  [110, 1, 1, 246],
  [45, 8, 0, 61],
  [130, 6, 1, 236],
  [70, 3, 0, 141],
  [95, 9, 1, 158],
  [150, 2, 0, 266],
];
export const TRUE_MODEL = { w1: 1.5, w2: -8, b: 60 };

export const maeOf = (predict, data = FLATS) => data.reduce((s, r) => s + Math.abs(predict(r) - r[3]), 0) / data.length;

const BAR_MAX = 300;
const H = (v) => (Math.max(0, Math.min(BAR_MAX, v)) / BAR_MAX) * 240;

/* Real (green) and predicted (orange) price for each flat. */
export function PriceBars({ data = FLATS, predict, stars = false, label }) {
  return (
    <>
      <div className="legend">
        <span>
          <i style={{ background: '#5F6D32' }} />
          Real price
        </span>
        <span>
          <i style={{ background: '#A84F32' }} />
          Predicted
        </span>
        {stars && <span>★ = has a balcony</span>}
      </div>
      <svg
        className="plot"
        viewBox="0 0 540 330"
        role="img"
        aria-label={label}
        fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif"
      >
        {[0, 100, 200, 300].map((v) => (
          <g key={v}>
            <line x1="50" x2="530" y1={270 - H(v)} y2={270 - H(v)} stroke="#E7D8BC" />
            <text x="42" y={274 - H(v)} textAnchor="end" fontSize="12" fill="#5E4C3D">
              {v}
            </text>
          </g>
        ))}
        {data.map((r, i) => {
          const x = 62 + i * 58;
          const guess = predict(r);
          return (
            <g key={i}>
              <rect x={x} y={270 - H(r[3])} width="20" height={H(r[3])} fill="#5F6D32" rx="3" />
              <rect x={x + 22} y={270 - H(guess)} width="20" height={H(guess)} fill="#A84F32" rx="3" />
              <text x={x + 21} y="288" textAnchor="middle" fontSize="11" fill="#2E2118">
                {r[0]}m²
              </text>
              <text x={x + 21} y="302" textAnchor="middle" fontSize="11" fill="#5E4C3D">
                {r[1]} km
              </text>
              {stars && r[2] === 1 && (
                <text x={x + 21} y="318" textAnchor="middle" fontSize="13" fill="#97691A">
                  ★
                </text>
              )}
            </g>
          );
        })}
        <line x1="50" x2="530" y1="270" y2="270" stroke="#2E2118" strokeWidth="2" />
        <text x="50" y="22" fontSize="13" fontWeight="700" fill="#2E2118">
          Price (thousand TND)
        </text>
      </svg>
    </>
  );
}

/* A labelled range input. */
export function Slider({ id, label, value, set, min, max, step, digits = 2, disabled }) {
  return (
    <div className="slider">
      <label htmlFor={id}>
        {label} <span className="mono">{value.toFixed(digits)}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => set(+e.target.value)}
      />
    </div>
  );
}
