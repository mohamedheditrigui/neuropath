/* Decorations for each biome. All drawn in SVG, no images. */
import { hash } from './geometry.js';

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

const Stones = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="-20" cy="10" rx="9" ry="6" fill="#6E6455" />
    <ellipse cx="-20" cy="8" rx="8" ry="4.5" fill="#B8AD9A" />
    <ellipse cx="-2" cy="-1" rx="7" ry="5" fill="#6E6455" />
    <ellipse cx="-2" cy="-3" rx="6" ry="3.6" fill="#B8AD9A" />
    <ellipse cx="17" cy="-9" rx="8" ry="5.5" fill="#6E6455" />
    <ellipse cx="17" cy="-11" rx="7" ry="4" fill="#CFC5B2" />
  </g>
);

const Wheat = ({ x, y }) => (
  <g>
    {[-2, -1, 0, 1, 2].map((i) => (
      <g key={i}>
        <path d={`M${x + i * 8} ${y + 6 - Math.abs(i) * 3}v-20`} stroke="#7E5C14" strokeWidth="2.2" />
        <ellipse cx={x + i * 8} cy={y - 16 - Math.abs(i) * 3} rx="3" ry="6.5" fill="#E0B659" />
      </g>
    ))}
  </g>
);

const Furrows = ({ x, y }) => (
  <g>
    {[-2, -1, 0, 1, 2].map((i) => (
      <path key={i} d={`M${x - 34 + i * 12} ${y + i * 7}L${x + 2 + i * 12} ${y - 21 + i * 7}`} stroke="#97691A" strokeWidth="3" opacity=".5" strokeLinecap="round" />
    ))}
  </g>
);

const Boulder = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 8L-22-22L4-36L28-16L32 8L6 20z" fill="#7E5038" />
    <path d="M-22-22L4-36L28-16L4-8z" fill="#A67252" />
    <path d="M4-8L28-16L32 8L6 20z" fill="#6B4A33" />
  </g>
);

const Hut = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="0" cy="12" rx="32" ry="11" fill="#2E2118" opacity=".2" />
    <path d="M-28-2L0 13V-13L-28-28z" fill="#D9C7A4" />
    <path d="M28-2L0 13V-13L28-28z" fill="#BFA982" />
    <path d="M-34-26L0-8L34-26L0-54z" fill="#A84F32" />
    <path d="M0-8L34-26L0-54z" fill="#7E3820" />
    <rect x="-18" y="-13" width="9" height="14" fill="#54392A" transform="skewY(27)" />
  </g>
);

const Bars = ({ x, y }) => (
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

const Pine = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="3" rx="17" ry="6" fill="#2E2118" opacity=".22" />
    <rect x="-3" y="-10" width="6" height="13" fill="#54392A" />
    <path d="M-19-8L0-36L19-8z" fill="#454F22" />
    <path d="M-15-26L0-50L15-26z" fill="#5F6D32" />
    <path d="M-10-42L0-62L10-42z" fill="#76853F" />
  </g>
);

/* Picks one decoration for a ground tile, depending on the chapter's biome. */
export function Decor({ ci, x, y, k, r }) {
  const v = hash(k + 3, r + 11);
  const s = 0.85 + v * 0.45;
  if (ci === 0) return v < 0.72 ? <NeuronTree x={x} y={y} s={s} /> : <Stones x={x} y={y} />;
  if (ci === 1) return v < 0.5 ? <Wheat x={x} y={y} /> : v < 0.86 ? <Furrows x={x} y={y} /> : <NeuronTree x={x} y={y} s={0.9} />;
  if (ci === 2) return v < 0.75 ? <Boulder x={x} y={y} s={s} /> : <NeuronTree x={x} y={y} s={0.85} />;
  if (ci === 3) return v < 0.55 ? <Hut x={x} y={y} /> : <Pine x={x} y={y} s={s} />;
  if (ci === 4) return v < 0.6 ? <Bars x={x} y={y} /> : <Stones x={x} y={y} />;
  return <Pine x={x} y={y} s={s * 0.9} />;
}

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
