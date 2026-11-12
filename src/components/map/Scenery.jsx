/* Decorations for each biome. All drawn in SVG, no images. */
export function NeuronTree({ x, y, s }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="2" rx="24" ry="9" fill="#2E2118" opacity=".22" />
      <path d="M-4 2L-3-24L-14-36M3 2L3-26L14-34M0-20V-44" fill="none" stroke="#54392A" strokeWidth="5" strokeLinecap="round" />
      <circle cx="-15" cy="-38" r="14" fill="#454F22" />
      <circle cx="15" cy="-36" r="13" fill="#454F22" />
      <circle cx="0" cy="-52" r="16" fill="#5F6D32" />
      <circle cx="-5" cy="-57" r="7" fill="#76853F" />
      <circle cx="-18" cy="-42" r="5" fill="#5F6D32" />
      <circle cx="12" cy="-41" r="5" fill="#5F6D32" />
      <path d="M-15-38L0-52L15-36" fill="none" stroke="#E7D8BC" strokeWidth="1.3" opacity=".85" />
      <circle cx="-15" cy="-38" r="2.6" fill="#E7D8BC" />
      <circle cx="0" cy="-52" r="2.6" fill="#E7D8BC" />
      <circle cx="15" cy="-36" r="2.6" fill="#E7D8BC" />
    </g>
  );
}

export const Stones = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="-20" cy="10" rx="9" ry="6" fill="#6E6455" />
    <ellipse cx="-20" cy="8" rx="8" ry="4.5" fill="#B8AD9A" />
    <ellipse cx="-2" cy="-1" rx="7" ry="5" fill="#6E6455" />
    <ellipse cx="-2" cy="-3" rx="6" ry="3.6" fill="#B8AD9A" />
    <ellipse cx="17" cy="-9" rx="8" ry="5.5" fill="#6E6455" />
    <ellipse cx="17" cy="-11" rx="7" ry="4" fill="#CFC5B2" />
  </g>
);

export const Wheat = ({ x, y }) => (
  <g>
    {[-2, -1, 0, 1, 2].map((i) => (
      <g key={i}>
        <path d={`M${x + i * 8} ${y + 6 - Math.abs(i) * 3}v-20`} stroke="#7E5C14" strokeWidth="2.2" />
        <ellipse cx={x + i * 8} cy={y - 16 - Math.abs(i) * 3} rx="3" ry="6.5" fill="#E0B659" />
      </g>
    ))}
  </g>
);

export const Furrows = ({ x, y }) => (
  <g>
    {[-2, -1, 0, 1, 2].map((i) => (
      <path key={i} d={`M${x - 34 + i * 12} ${y + i * 7}L${x + 2 + i * 12} ${y - 21 + i * 7}`} stroke="#97691A" strokeWidth="3" opacity=".5" strokeLinecap="round" />
    ))}
  </g>
);

export const Boulder = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 8L-22-22L4-36L28-16L32 8L6 20z" fill="#7E5038" />
    <path d="M-22-22L4-36L28-16L4-8z" fill="#A67252" />
    <path d="M4-8L28-16L32 8L6 20z" fill="#6B4A33" />
  </g>
);

export const Hut = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="0" cy="12" rx="32" ry="11" fill="#2E2118" opacity=".2" />
    <path d="M-28-2L0 13V-13L-28-28z" fill="#D9C7A4" />
    <path d="M28-2L0 13V-13L28-28z" fill="#BFA982" />
    <path d="M-34-26L0-8L34-26L0-54z" fill="#A84F32" />
    <path d="M0-8L34-26L0-54z" fill="#7E3820" />
    <rect x="-18" y="-13" width="9" height="14" fill="#54392A" transform="skewY(27)" />
  </g>
);

export const Bars = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="0" cy="8" rx="34" ry="10" fill="#2E2118" opacity=".2" />
    <path d="M-30-10h14v18h-14z" fill="#6E6455" />
    <path d="M-30-10l7-4 7 4-7 4z" fill="#CFC5B2" />
    <path d="M-8-30H6V8H-8z" fill="#5E5445" />
    <path d="M-8-30l7-4 7 4-7 4z" fill="#CFC5B2" />
    <path d="M14-48h14V8H14z" fill="#6E6455" />
    <path d="M14-48l7-4 7 4-7 4z" fill="#CFC5B2" />
  </g>
);

export const Pine = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="3" rx="17" ry="6" fill="#2E2118" opacity=".22" />
    <rect x="-3" y="-10" width="6" height="13" fill="#54392A" />
    <path d="M-19-8L0-36L19-8z" fill="#454F22" />
    <path d="M-15-26L0-50L15-26z" fill="#5F6D32" />
    <path d="M-10-42L0-62L10-42z" fill="#76853F" />
  </g>
);

export function Cloud({ x, y, s }) {
  const c = (dx, dy, rx, ry, f, key) => <ellipse key={key} cx={x + dx * s} cy={y + dy * s} rx={rx * s} ry={ry * s} fill={f} />;
  return (
    <g>
      {c(0, 14, 96, 26, '#D8C9AE', 1)}
      {c(-50, 0, 52, 34, '#F5EDDD', 2)}
      {c(8, -14, 62, 44, '#FBF6EB', 3)}
      {c(56, 4, 48, 30, '#F5EDDD', 4)}
      {c(0, 12, 92, 22, '#F5EDDD', 5)}
    </g>
  );
}

/* ---------- Landmarks added for the district map ---------- */
export const HayBale = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="0" cy="6" rx="22" ry="7" fill="#2E2118" opacity=".2" />
    <path d="M-18 4V-10L0-18L18-10V4L0 12z" fill="#C9A24E" />
    <path d="M-18-10L0-18L18-10L0-2z" fill="#E0BC66" />
    <path d="M0-2V12" stroke="#97691A" strokeWidth="1.5" />
  </g>
);

/* A notice board with a falling loss curve, for the Descent Canyon. */
export const DescentSign = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-12 4V-30M12 4V-30" stroke="#54392A" strokeWidth="3" />
    <rect x="-20" y="-52" width="40" height="30" rx="3" fill="#FBF6EB" stroke="#54392A" strokeWidth="2.5" />
    <path d="M-14-46q8 18 14 18t12 0" fill="none" stroke="#A84F32" strokeWidth="2.5" />
    <path d="M10-31l4 3-5 2" fill="none" stroke="#A84F32" strokeWidth="2" />
  </g>
);

/* A board with the sigmoid S-curve, for Sigmoid Springs. */
export const SigmoidSign = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 4V-28" stroke="#54392A" strokeWidth="3" />
    <rect x="-20" y="-52" width="40" height="28" rx="3" fill="#FBF6EB" stroke="#54392A" strokeWidth="2.5" />
    <path d="M-15-29c10 0 8-18 15-18s5 0 15 0" fill="none" stroke="#4E7C78" strokeWidth="2.5" />
  </g>
);

export const Reeds = ({ x, y }) => (
  <g>
    {[-6, -2, 3, 7].map((d, i) => (
      <g key={i}>
        <path d={`M${x + d} ${y + 4}q${i % 2 ? 2 : -2} -12 ${i % 2 ? 1 : -1} -22`} stroke="#5F6D32" strokeWidth="2" fill="none" />
        <ellipse cx={x + d + (i % 2 ? 1 : -1)} cy={y - 18} rx="2" ry="5" fill="#6B4A33" />
      </g>
    ))}
  </g>
);

export const Bush = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="3" rx="16" ry="6" fill="#2E2118" opacity=".2" />
    <circle cx="-7" cy="-6" r="9" fill="#4F6B48" />
    <circle cx="7" cy="-7" r="10" fill="#5F7D55" />
    <circle cx="0" cy="-13" r="9" fill="#6E8C62" />
  </g>
);

/* Small isometric cubes: the KNN village's data points. */
function Cube({ x, y, c }) {
  const [top, left, right] = c;
  return (
    <g>
      <path d={`M${x} ${y - 16}l10 5-10 5-10-5z`} fill={top} />
      <path d={`M${x - 10} ${y - 11}l10 5v10l-10-5z`} fill={left} />
      <path d={`M${x + 10} ${y - 11}l-10 5v10l10-5z`} fill={right} />
    </g>
  );
}
const MOSS = ['#8FA05A', '#5F6D32', '#454F22'];
const TERRA = ['#D07A58', '#A84F32', '#7E3820'];
export const Cubes = ({ x, y, v }) => (
  <g>
    <ellipse cx={x} cy={y + 4} rx="26" ry="8" fill="#2E2118" opacity=".18" />
    <Cube x={x - 12} y={y} c={v < 0.5 ? MOSS : TERRA} />
    <Cube x={x + 10} y={y + 2} c={v < 0.5 ? MOSS : TERRA} />
    <Cube x={x - 1} y={y - 6} c={v < 0.25 || v > 0.75 ? TERRA : MOSS} />
  </g>
);

/* A half-dial gauge on a stone base, for the Measuring Ridge. */
export const Gauge = ({ x, y, v }) => {
  const a = Math.PI * (1 - (0.2 + v * 0.6));
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="6" rx="24" ry="8" fill="#2E2118" opacity=".2" />
      <path d="M-14 6V-6h28V6z" fill="#6E6455" />
      <path d="M-22-6a22 22 0 0 1 44 0z" fill="#FBF6EB" stroke="#5E5445" strokeWidth="3" />
      <path d="M-22-6a22 22 0 0 1 11-19" fill="none" stroke="#A84F32" strokeWidth="5" />
      <path d="M11-25a22 22 0 0 1 11 19" fill="none" stroke="#5F6D32" strokeWidth="5" />
      <path d={`M0-6L${Math.cos(a) * 16} ${-6 - Math.sin(a) * 16}`} stroke="#2E2118" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
};

/* A chart board on legs. */
export const ChartBoard = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-14 6L-10-30M14 6L10-30" stroke="#54392A" strokeWidth="3" />
    <rect x="-22" y="-58" width="44" height="32" rx="2" fill="#FBF6EB" stroke="#5E5445" strokeWidth="2.5" />
    <path d="M-16-32V-38M-9-32V-44M-2-32V-41M5-32V-50M12-32V-47" stroke="#C98F2B" strokeWidth="4" />
  </g>
);

export const SummitFlag = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="0" cy="4" rx="14" ry="5" fill="#2E2118" opacity=".25" />
    <path d="M0 4V-70" stroke="#2E2118" strokeWidth="4" strokeLinecap="round" />
    <path d="M0-70l34 10-34 12z" fill="#A84F32" />
    <path d="M14-58l2 5 5 0-4 3 2 5-5-3-5 3 2-5-4-3 5 0z" fill="#E0B659" />
  </g>
);
