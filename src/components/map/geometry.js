/* Layout of the isometric level map: where each tile, trail stone and chapter gate sits. */
import { CHAPTERS, firstOf } from '../../data/content.js';

export const W = 720; // map width in SVG units
export const HW = 58; // half width of a diamond tile
export const HH = 34; // half height of a diamond tile
export const DEPTH = 13; // thickness of a raised tile

// Deterministic pseudo-random number in [0, 1) so the scenery is the same on every visit.
export const hash = (a, b) => {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

/* The path zigzags left and right. Between chapters: a trail with a gate. */
export const NODES = (() => {
  const out = [];
  let off = 0;
  let dir = 1;
  const push = (o) => {
    out.push({ ...o, off, r: out.length });
    off += dir;
    if (Math.abs(off) === 2) dir = -dir;
  };
  CHAPTERS.forEach((c, ci) => {
    if (ci > 0) ['trail', 'trail', 'trail', 'gate', 'trail', 'trail'].forEach((type) => push({ type, ch: ci }));
    c.levels.forEach((_, li) => push({ type: 'level', ch: ci, flat: firstOf(ci) + li }));
  });
  return out;
})();

export const ROWS = NODES.length;
export const TOP_PAD = 220;
export const BOT_PAD = 190;
export const MAP_H = TOP_PAD + (ROWS - 1) * HH + BOT_PAD;
export const py = (r) => MAP_H - BOT_PAD - r * HH;
export const px = (k) => W / 2 + k * HW;
export const levelNode = (flat) => NODES.find((n) => n.type === 'level' && n.flat === flat);
export const dia = (x, y, hw, hh) => `${x},${y - hh} ${x + hw},${y} ${x},${y + hh} ${x - hw},${y}`;

/* Where the avatar stands on a given level tile. */
export const heroPos = (flat) => {
  const n = levelNode(flat);
  return { x: px(n.off), y: py(n.r) - DEPTH - 3 };
};
