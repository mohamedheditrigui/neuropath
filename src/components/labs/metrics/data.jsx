/* Chapter 6 shared pieces: 20 test emails with the spam score a filter gave them, the confusion
   counts for a threshold, and a strip that shows every email on the score axis. */

// [spam score given by the model, really spam? (1/0)] — 8 spam, 12 normal.
export const EMAILS = [
  [0.95, 1],
  [0.91, 1],
  [0.88, 1],
  [0.84, 1],
  [0.77, 1],
  [0.71, 1],
  [0.62, 1],
  [0.45, 1],
  [0.69, 0],
  [0.55, 0],
  [0.41, 0],
  [0.36, 0],
  [0.3, 0],
  [0.24, 0],
  [0.18, 0],
  [0.15, 0],
  [0.11, 0],
  [0.08, 0],
  [0.05, 0],
  [0.03, 0],
];

/* Confusion counts and metrics when every email with score ≥ t is flagged as spam. */
export function confusion(t) {
  let tp = 0;
  let fp = 0;
  let fn = 0;
  let tn = 0;
  EMAILS.forEach(([s, spam]) => {
    const flagged = s >= t;
    if (flagged && spam) tp++;
    else if (flagged) fp++;
    else if (spam) fn++;
    else tn++;
  });
  const precision = tp + fp ? tp / (tp + fp) : 1;
  const recall = tp / (tp + fn);
  const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
  return { tp, fp, fn, tn, accuracy: (tp + tn) / EMAILS.length, precision, recall, f1 };
}
export const pct = (v) => `${Math.round(v * 100)}%`;

const SX = (s) => 30 + s * 480;

/* Each email as a tile on a 0–1 score axis: spam on the top row, normal emails below. */
export function EmailStrip({ t, label }) {
  return (
    <svg
      className="plot"
      viewBox="0 0 540 190"
      role="img"
      aria-label={label}
      fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif"
    >
      {t !== undefined && t <= 1 && (
        <rect x={SX(t)} y="18" width={SX(1) - SX(t) + 12} height="132" fill="#A84F32" opacity=".1" />
      )}
      <text x="30" y="14" fontSize="12" fontWeight="700" fill="#A84F32">
        spam
      </text>
      <text x="30" y="104" fontSize="12" fontWeight="700" fill="#5F6D32">
        normal
      </text>
      {EMAILS.map(([s, spam], i) => {
        const flagged = t !== undefined && s >= t;
        return (
          <g key={i}>
            <rect
              x={SX(s) - 9}
              y={spam ? 36 : 112}
              width="18"
              height="14"
              rx="2"
              fill={spam ? '#A84F32' : '#5F6D32'}
              stroke={flagged ? '#2E2118' : '#FBF6EB'}
              strokeWidth={flagged ? 2.5 : 1.5}
            />
            <path
              d={`M${SX(s) - 8} ${(spam ? 36 : 112) + 1} l8 6 l8 -6`}
              fill="none"
              stroke="#FBF6EB"
              strokeWidth="1.2"
            />
          </g>
        );
      })}
      <line x1="30" x2="510" y1="160" y2="160" stroke="#2E2118" strokeWidth="2" />
      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <text key={v} x={SX(v)} y="178" textAnchor="middle" fontSize="12" fill="#5E4C3D">
          {v}
        </text>
      ))}
      {t !== undefined && t <= 1 && (
        <g>
          <line x1={SX(t)} x2={SX(t)} y1="18" y2="160" stroke="#2E2118" strokeWidth="2.5" strokeDasharray="6 4" />
          <text x={SX(t) + 6} y="30" fontSize="12" fontWeight="700" fill="#2E2118">
            flag ≥ {t.toFixed(2)}
          </text>
        </g>
      )}
    </svg>
  );
}

export function Threshold({ t, setT, id = 'thr' }) {
  return (
    <div className="slider">
      <label htmlFor={id}>
        Threshold <span className="mono">{t.toFixed(2)}</span>
      </label>
      <input id={id} type="range" min="0" max="1" step="0.01" value={t} onChange={(e) => setT(+e.target.value)} />
    </div>
  );
}
