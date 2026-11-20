/* Chapter 5 shared pieces: the two-class points, distances, a KNN vote and the board frame. */

export const CLASSES = {
  moss: { color: '#5F6D32', label: 'Moss' },
  terracotta: { color: '#A84F32', label: 'Terracotta' },
};
// [x, y, class] in a 0–10 square (same points as the drag activity of level 5's neighbour).
export const POINTS = [
  [1.5, 2, 'moss'],
  [2.2, 3.4, 'moss'],
  [3, 1.6, 'moss'],
  [1.2, 4.5, 'moss'],
  [3.6, 3, 'moss'],
  [2.6, 5.2, 'moss'],
  [4.4, 1.8, 'moss'],
  [5.2, 3.6, 'moss'],
  [6.4, 2.4, 'moss'],
  [6.2, 7.4, 'terracotta'],
  [7.4, 6.2, 'terracotta'],
  [8.2, 8, 'terracotta'],
  [5.6, 8.6, 'terracotta'],
  [8.8, 5.4, 'terracotta'],
  [7, 8.8, 'terracotta'],
  [4.6, 6.8, 'terracotta'],
  [3.4, 7.6, 'terracotta'],
  [5.6, 5.6, 'terracotta'],
  [4, 4.8, 'moss'],
];
export const PX = (v) => 30 + v * 46;
export const PY = (v) => 490 - v * 46;

export const euclid = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
export const manhattan = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

/* The k nearest points to q and the majority class among them. */
export function knn(points, q, k, dist = euclid) {
  const near = points
    .map((p, i) => ({ p, i, d: dist(p, q) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k);
  const moss = near.filter((n) => n.p[2] === 'moss').length;
  return { near, moss, terracotta: near.length - moss, cls: moss > near.length - moss ? 'moss' : 'terracotta' };
}

/* The 0–10 square with a light grid; children are drawn on top. */
export function Board({ label, svgRef, children, ...rest }) {
  return (
    <svg
      ref={svgRef}
      className="plot"
      viewBox="0 0 520 520"
      role="img"
      aria-label={label}
      fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif"
      style={{ touchAction: 'none' }}
      {...rest}
    >
      <rect x="30" y="30" width="460" height="460" fill="#FBF6EB" stroke="#E7D8BC" />
      {[0, 2, 4, 6, 8, 10].map((v) => (
        <g key={v}>
          <line x1={PX(v)} x2={PX(v)} y1="30" y2="490" stroke="#EFE5D2" />
          <line x1="30" x2="490" y1={PY(v)} y2={PY(v)} stroke="#EFE5D2" />
        </g>
      ))}
      {children}
    </svg>
  );
}

export function Dot({ p, r = 9, ring, ...rest }) {
  return (
    <circle
      cx={PX(p[0])}
      cy={PY(p[1])}
      r={r}
      fill={CLASSES[p[2]].color}
      stroke={ring || '#FBF6EB'}
      strokeWidth={ring ? 4 : 2}
      {...rest}
    />
  );
}
