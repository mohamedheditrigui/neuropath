/* Shared pieces for the chapter 1 activities: the dataset, the plot frame and error helpers.
   Generic activity helpers (goal chip, hints, number checks) live in ../common.jsx. */
export { Goal, Hint, NumberCheck, isClose, pointerSvgY } from '../common.jsx';

// Hours studied (x) and exam score out of 12 (y). Mean point: (5.5, 6.5).
export const POINTS = [
  [1, 2.6],
  [2, 3.9],
  [3, 4.2],
  [4, 5.8],
  [5, 5.6],
  [6, 7.1],
  [7, 7.4],
  [8, 8.9],
  [9, 9.1],
  [10, 10.4],
];
export const MEAN_X = POINTS.reduce((s, p) => s + p[0], 0) / POINTS.length;
export const MEAN_Y = POINTS.reduce((s, p) => s + p[1], 0) / POINTS.length;

export const mseOf = (a, b, pts = POINTS) => pts.reduce((s, [x, y]) => s + (a * x + b - y) ** 2, 0) / pts.length;
export const maeOf = (a, b, pts = POINTS) => pts.reduce((s, [x, y]) => s + Math.abs(a * x + b - y), 0) / pts.length;

/* Least squares: a = cov(x, y) / var(x), b = mean(y) − a·mean(x). */
export const BEST_A =
  POINTS.reduce((s, [x, y]) => s + (x - MEAN_X) * (y - MEAN_Y), 0) /
  POINTS.reduce((s, [x]) => s + (x - MEAN_X) ** 2, 0);
export const BEST_B = MEAN_Y - BEST_A * MEAN_X;
export const BEST_MSE = mseOf(BEST_A, BEST_B);

/* A plot frame: maps data coordinates to the SVG and draws the axes. */
export function makeScale({ xMax = 11, yMin = 0, yMax = 12 } = {}) {
  const X = (x) => 56 + (x / xMax) * 460;
  const Y = (y) => 318 - ((y - yMin) / (yMax - yMin)) * 296;
  const fromY = (sy) => yMin + ((318 - sy) / 296) * (yMax - yMin);
  const clipY = (v) => Math.max(yMin - 1, Math.min(yMax + 1, v));
  return { X, Y, fromY, clipY, xMax, yMin, yMax };
}

export const COLORS = {
  line: '#A84F32',
  point: '#5F6D32',
  err: '#C98F2B',
  ink: '#2E2118',
  grid: '#E7D8BC',
  soft: '#5E4C3D',
};

export function Plot({
  scale,
  xTicks,
  yTicks,
  xLabel = 'Hours studied (x)',
  yLabel = 'Exam score (y)',
  label,
  svgRef,
  children,
}) {
  const { X, Y, yMin, yMax } = scale;
  return (
    <svg
      ref={svgRef}
      className="plot"
      viewBox="0 0 540 372"
      role="img"
      aria-label={label}
      fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif"
      style={{ touchAction: 'none' }}
    >
      {xTicks.map((i) => (
        <g key={`x${i}`}>
          <line x1={X(i)} x2={X(i)} y1="22" y2="318" stroke={COLORS.grid} />
          <text x={X(i)} y="338" textAnchor="middle" fontSize="13" fill={COLORS.soft}>
            {i}
          </text>
        </g>
      ))}
      {yTicks.map((i) => (
        <g key={`y${i}`}>
          <line x1="56" x2="516" y1={Y(i)} y2={Y(i)} stroke={COLORS.grid} />
          <text x="46" y={Y(i) + 4} textAnchor="end" fontSize="13" fill={COLORS.soft}>
            {i}
          </text>
        </g>
      ))}
      <line x1="56" x2="516" y1={Y(Math.max(0, yMin))} y2={Y(Math.max(0, yMin))} stroke={COLORS.ink} strokeWidth="2" />
      <line x1={X(0)} x2={X(0)} y1={Y(yMax)} y2={Y(yMin)} stroke={COLORS.ink} strokeWidth="2" />
      {children}
      <text x="286" y="364" textAnchor="middle" fontSize="13" fontWeight="700" fill={COLORS.ink}>
        {xLabel}
      </text>
      <text x="62" y="16" fontSize="13" fontWeight="700" fill={COLORS.ink}>
        {yLabel}
      </text>
    </svg>
  );
}

/* A straight line y = a·x + b drawn across the whole plot. */
export function Line({ scale, a, b, color = COLORS.line, width = 4, dash }) {
  const { X, Y, clipY, xMax } = scale;
  return (
    <line
      x1={X(0)}
      y1={Y(clipY(b))}
      x2={X(xMax)}
      y2={Y(clipY(a * xMax + b))}
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dash}
      strokeLinecap="round"
    />
  );
}
