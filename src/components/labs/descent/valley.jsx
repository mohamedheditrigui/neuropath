/* Chapter 3 shared pieces: the one-weight loss J(w) = (w − 3)² and its plot frame. */

export const loss = (w) => (w - 3) ** 2;
export const grad = (w) => 2 * (w - 3);
export const W_MIN = -2;
export const W_MAX = 8;
export const WX = (w) => 50 + ((w - W_MIN) / (W_MAX - W_MIN)) * 470;
export const LY = (l) => 280 - (Math.min(l, 26) / 26) * 250;
export const fromWX = (x) => W_MIN + ((x - 50) / 470) * (W_MAX - W_MIN);

export const curvePoints = () =>
  Array.from({ length: 101 }, (_, i) => {
    const w = W_MIN + (i / 100) * (W_MAX - W_MIN);
    return `${WX(w)},${LY(loss(w))}`;
  }).join(' ');

/* Axes for a loss-vs-weight plot; children are drawn on top. */
export function ValleyFrame({ label, svgRef, children, xLabel = 'Weight w' }) {
  return (
    <svg
      ref={svgRef}
      className="plot"
      viewBox="0 0 540 320"
      role="img"
      aria-label={label}
      fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif"
      style={{ touchAction: 'none' }}
    >
      <line x1="50" x2="520" y1="280" y2="280" stroke="#2E2118" strokeWidth="2" />
      <line x1="50" x2="50" y1="20" y2="280" stroke="#2E2118" strokeWidth="2" />
      {[-2, 0, 2, 4, 6, 8].map((v) => (
        <text key={v} x={WX(v)} y="298" textAnchor="middle" fontSize="12" fill="#5E4C3D">
          {v}
        </text>
      ))}
      {children}
      <text x="285" y="316" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2E2118">
        {xLabel}
      </text>
      <text x="58" y="16" fontSize="13" fontWeight="700" fill="#2E2118">
        Loss
      </text>
    </svg>
  );
}
