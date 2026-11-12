/* The isometric level map, drawn as one district per chapter:
   Scatter Plains (meadow), Terraced Fields, Descent Canyon (the path runs at the bottom of a ravine),
   Sigmoid Springs (an S-shaped river), Neighbor Village (forest and data cubes),
   Measuring Ridge (stone plateaus, gauges and charts) and The Summit.
   progress  = number of completed levels (tiles before it are done, the next one is "now")
   cloudsFor = level index whose chapter decides which clouds still cover the map
   heroAt    = level index where the avatar stands (the Roadmap animates it through heroRef) */
import { memo, useMemo } from 'react';
import { CHAPTERS, FLAT, TOTAL } from '../../data/content.js';
import { AvatarParts } from '../Avatar.jsx';
import {
  Boulder, Bush, ChartBoard, Cloud, Cubes, DescentSign, Furrows, Gauge, HayBale, Hut, NeuronTree, Pine, Reeds,
  SigmoidSign, Stones, SummitFlag, Wheat, Bars,
} from './Scenery.jsx';
import { Castle, Fountain, Obelisks, Observatory, RuinedArch, SummitShrine, Temple, Watchtower } from './Landmarks.jsx';
import { BOT_PAD, DEPTH, HH, HW, MAP_H, NODES, ROWS, TOP_PAD, W, dia, hash, heroPos, levelNode, px, py } from './geometry.js';

/* Ground colours per district: [light, dark, cliff left face, cliff right face]. */
const GROUND = [
  ['#8C9458', '#7F8A4E', '#5E6638', '#4B522C'], // Scatter Plains
  ['#C9A85A', '#B99743', '#8E6E2C', '#735823'], // Terraced Fields
  ['#B9714E', '#A8613F', '#7E4530', '#653524'], // Descent Canyon
  ['#9DB08A', '#91A47E', '#6A7C5C', '#57684A'], // Sigmoid Springs
  ['#7F9A5E', '#738E54', '#566E3E', '#455933'], // Neighbor Village
  ['#B3ADA2', '#A59F94', '#7C766C', '#655F56'], // Measuring Ridge
  ['#D8C9A8', '#CDBE9C', '#A8977A', '#8E7E63'], // The Summit
];
const FIELD_GREEN = ['#9AA05C', '#8D9350'];
const CANYON_FLOOR = ['#8E5238', '#83492F'];
const WATER = '#5E8F8A';
const SKIN = {
  done: ['#6F7E39', '#525D28', '#3D4620'],
  now: ['#B85A3A', '#7E3820', '#632B18'],
  locked: ['#D4CFC5', '#ABA498', '#8E887D'],
};
const STATE_WORD = { done: 'completed', now: 'current level', locked: 'locked' };

const rowOff = new Map(NODES.map((n) => [n.r, n.off]));
const zoneAt = (r) => NODES[Math.max(0, Math.min(ROWS - 1, r))].ch;
/* Horizontal distance from a ground cell to the path, looking one row up and down. */
const pathDistance = (k, r) => {
  let d = 99;
  for (let dr = -1; dr <= 1; dr++) {
    const o = rowOff.get(r + dr);
    if (o !== undefined) d = Math.min(d, Math.abs(o - k));
  }
  if (d === 99) d = Math.abs(k); // rows above and below the path
  return d;
};
/* The S-shaped river of Sigmoid Springs: its centre column for each row of the district. */
const springRows = NODES.filter((n) => n.ch === 3).map((n) => n.r);
const SPRING_MID = springRows.length ? (springRows[0] + springRows[springRows.length - 1]) / 2 : 0;
const riverCentre = (r) => 5 * Math.tanh((r - SPRING_MID) / 3);

/* Height and colours of one ground cell. */
function groundCell(k, r) {
  let zone = zoneAt(r);
  const ahead = zoneAt(r + 3);
  if (ahead !== zone && hash(k, r) < 0.35) zone = ahead; // ragged border between districts
  const d = pathDistance(k, r);
  const alt = ((k + r) / 2 + 40) % 2 === 0 ? 0 : 1;
  let [top, , left, right] = GROUND[zone];
  top = GROUND[zone][alt];
  let h = 0;
  let water = false;
  if (zone === 0 && ['3,5', '5,5', '4,4', '4,6'].includes(`${k},${r}`)) water = true;
  if (zone === 1) {
    if (Math.floor((k - r + 40) / 3) % 2 === 0) top = FIELD_GREEN[alt]; // alternating crop strips
    if (d >= 2) h = (Math.floor((k + 20) / 3) % 2) * 9; // low terraces
  }
  if (zone === 2) {
    if (d <= 1) top = CANYON_FLOOR[alt];
    else h = Math.min(56, (d - 1) * 19); // canyon walls rise away from the path
  }
  if (zone === 3 && Math.abs(k - riverCentre(r)) < 0.9) water = true;
  if (zone === 5 && d >= 2) h = [0, 12, 24][Math.floor(hash(Math.floor((k + 20) / 3), Math.floor((r + 20) / 3)) * 3)];
  if (zone === 6 && d >= 2) h = 8;
  if (water) {
    top = WATER;
    h = 0;
  }
  return { zone, h, top, left, right, water, d };
}

/* One decoration for a ground cell, chosen by district. */
function pickDecor(zone, x, y, k, r) {
  const v = hash(k + 3, r + 11);
  const s = 0.85 + v * 0.45;
  switch (zone) {
    case 0: return v < 0.72 ? <NeuronTree x={x} y={y} s={s} /> : <Stones x={x} y={y} />;
    case 1: return v < 0.4 ? <Wheat x={x} y={y} /> : v < 0.7 ? <Furrows x={x} y={y} /> : v < 0.9 ? <HayBale x={x} y={y} /> : <NeuronTree x={x} y={y} s={0.85} />;
    case 2: return v < 0.6 ? <Boulder x={x} y={y} s={s * 0.8} /> : v < 0.8 ? <DescentSign x={x} y={y} /> : <Stones x={x} y={y} />;
    case 3: return v < 0.45 ? <Reeds x={x} y={y} /> : v < 0.8 ? <Bush x={x} y={y} s={s * 0.9} /> : <SigmoidSign x={x} y={y} />;
    case 4: return v < 0.4 ? <Pine x={x} y={y} s={s} /> : v < 0.65 ? <Cubes x={x} y={y} v={hash(k, r)} /> : v < 0.85 ? <Hut x={x} y={y} /> : <NeuronTree x={x} y={y} s={0.9} />;
    case 5: return v < 0.35 ? <Bars x={x} y={y} /> : v < 0.6 ? <Gauge x={x} y={y} v={hash(r, k)} /> : v < 0.8 ? <ChartBoard x={x} y={y} /> : <Stones x={x} y={y} />;
    default: return <Pine x={x} y={y} s={s * 0.9} />;
  }
}

/* One big landmark per district (two on the ridge), set beside the path at a share of the chapter.
   [chapter, where along the chapter (0–1), building, side flip] */
const LANDMARK_SPECS = [
  [0, 0.5, Watchtower, false],
  [1, 0.5, Temple, false],
  [2, 0.45, RuinedArch, false],
  [3, 0.5, Fountain, false],
  [4, 0.5, Castle, false],
  [5, 0.25, Obelisks, false],
  [5, 0.8, Observatory, true],
  [6, 0.55, SummitShrine, false],
];
const FOOTPRINT = 2; // cells kept clear around a landmark, in each direction
const LANDMARKS = LANDMARK_SPECS.map(([ci, at, Building, flip], i) => {
  const levels = NODES.filter((n) => n.type === 'level' && n.ch === ci);
  const node = levels[Math.min(levels.length - 1, Math.floor(at * levels.length))];
  let side = node.off >= 0 ? -1 : 1;
  if (flip) side = -side;
  // Four columns beside the path, and never past column ±5 so the building stays inside the map.
  let k = Math.max(-5, Math.min(5, node.off + side * 4));
  if ((((k + node.r) % 2) + 2) % 2 !== 0) k += Math.abs(k + side) <= 5 ? side : -side;
  return { key: `lm${i}`, k, r: node.r, h: groundCell(k, node.r).h, Building };
});
/* Ground cells under a landmark: flat at the landmark's height, no water, no decoration. */
const RESERVED = new Map();
LANDMARKS.forEach((m) => {
  for (let dk = -FOOTPRINT; dk <= FOOTPRINT; dk++) for (let dr = -FOOTPRINT; dr <= FOOTPRINT; dr++) RESERVED.set(`${m.k + dk},${m.r + dr}`, m.h);
});

/* Ground and scenery never change, so they are built once and depth-sorted with the tiles later. */
const STATIC_LAYER = (() => {
  const out = [];
  LANDMARKS.forEach(({ key, k, r, h, Building }) => out.push({ y: py(r) + 0.5, key, el: <Building x={px(k)} y={py(r) - h} /> }));
  const rowMax = ROWS + Math.ceil(TOP_PAD / HH) + 2;
  for (let r = -Math.ceil(BOT_PAD / HH) - 2; r < rowMax; r++) {
    for (let k = -8; k <= 8; k++) {
      if ((((k + r) % 2) + 2) % 2 !== 0) continue;
      const x = px(k);
      const y = py(r);
      const c = groundCell(k, r);
      const reserved = RESERVED.has(`${k},${r}`) && c.d >= 2;
      if (reserved) {
        c.h = RESERVED.get(`${k},${r}`);
        if (c.water) {
          c.water = false;
          c.top = GROUND[c.zone][0];
        }
      }
      const top = y - c.h;
      out.push({
        y,
        key: `g${k},${r}`,
        el: (
          <g>
            {c.h > 0 && (
              <>
                <polygon points={`${x - HW},${top} ${x},${top + HH} ${x},${y + HH} ${x - HW},${y}`} fill={c.left} />
                <polygon points={`${x + HW},${top} ${x},${top + HH} ${x},${y + HH} ${x + HW},${y}`} fill={c.right} />
              </>
            )}
            <polygon points={dia(x, top, HW, HH)} fill={c.top} stroke={c.top} strokeWidth=".7" />
            {c.water && <path d={`M${x - 16} ${top}q8-5 16 0t16 0`} fill="none" stroke="#BFD0C8" strokeWidth="2.2" strokeLinecap="round" />}
          </g>
        ),
      });
      // Keep the path corridor clear; decorate about half of the other cells.
      const nearPath = c.d <= 1 && Math.abs(r) < ROWS + 3 && r > -3;
      if (!c.water && !nearPath && !reserved && hash(k + 17, r - 5) > 0.5) out.push({ y: y + 0.01, key: `d${k},${r}`, el: pickDecor(c.zone, x, top, k, r) });
    }
  }
  // The summit flag, above the last tile.
  const last = NODES[NODES.length - 1];
  out.push({ y: py(last.r + 3), key: 'flag', el: <SummitFlag x={px(last.off + (last.off > 0 ? -1 : 1))} y={py(last.r + 3)} /> });
  return out;
})();

function Tile({ n, state, interactive, onSelect }) {
  const x = px(n.off);
  const y = py(n.r) - DEPTH;
  const hw = HW * 0.92;
  const hh = HH * 0.92;
  const skin = SKIN[state];
  const lv = FLAT[n.flat];
  const final = CHAPTERS[lv.ch].final;
  const act = () => onSelect && onSelect(n.flat);
  const a11y = interactive
    ? {
        className: 'tile',
        role: 'button',
        tabIndex: 0,
        'aria-label': `${lv.title}, ${STATE_WORD[state]}`,
        onClick: act,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            act();
          }
        },
      }
    : {};
  return (
    <g {...a11y}>
      <polygon points={`${x - hw},${y} ${x},${y + hh} ${x},${y + hh + DEPTH} ${x - hw},${y + DEPTH}`} fill={skin[1]} />
      <polygon points={`${x + hw},${y} ${x},${y + hh} ${x},${y + hh + DEPTH} ${x + hw},${y + DEPTH}`} fill={skin[2]} />
      <polygon className="top" points={dia(x, y, hw, hh)} fill={skin[0]} />
      {state === 'locked' && <polygon points={dia(x, y, hw * 0.78, hh * 0.78)} fill="none" stroke="#BDB6AA" strokeWidth="1.5" />}
      {state === 'now' && <polygon className="pulse" points={dia(x, y, hw, hh)} fill="none" stroke="#FBF6EB" strokeWidth="4" />}
      {state === 'done' && <path d={`M${x - 14} ${y}l9 9l19-19`} fill="none" stroke="#FBF6EB" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />}
      {state !== 'done' && final && lv.lv === CHAPTERS[lv.ch].levels.length - 1 && (
        <>
          <path d={`M${x - 6} ${y + 11}V${y - 15}`} stroke="#2E2118" strokeWidth="3" strokeLinecap="round" />
          <path d={`M${x - 6} ${y - 15}l18 6l-18 6z`} fill={state === 'now' ? '#FBF6EB' : '#A84F32'} />
        </>
      )}
      {state === 'locked' && !(final && lv.lv === CHAPTERS[lv.ch].levels.length - 1) && (
        <>
          <rect x={x - 8} y={y - 3} width="16" height="12" rx="3" fill="#6E6455" />
          <path d={`M${x - 5} ${y - 3}v-4a5 5 0 0 1 10 0v4`} fill="none" stroke="#6E6455" strokeWidth="2.8" />
        </>
      )}
    </g>
  );
}

/* Stone stairs between chapters, instead of plain trail stones. */
function Stairs({ x, y }) {
  const step = (dy, s, key) => (
    <g key={key}>
      <polygon points={`${x - HW * s},${y + dy} ${x},${y + dy + HH * s} ${x},${y + dy + HH * s + 6} ${x - HW * s},${y + dy + 6}`} fill="#8E887D" />
      <polygon points={`${x + HW * s},${y + dy} ${x},${y + dy + HH * s} ${x},${y + dy + HH * s + 6} ${x + HW * s},${y + dy + 6}`} fill="#7C766C" />
      <polygon points={dia(x, y + dy, HW * s, HH * s)} fill="#C9C3B8" />
    </g>
  );
  return <g>{[step(4, 0.62, 'a'), step(-4, 0.5, 'b')]}</g>;
}

function Gate({ ci, x, y, interactive, onOpen }) {
  const c = CHAPTERS[ci];
  const t1 = c.final ? 'FINAL CHAPTER' : `CHAPTER ${ci + 1}`;
  const w = Math.max(c.name.length * 9.6, t1.length * 7.5) + 36;
  const a11y = interactive
    ? {
        className: 'gate',
        role: 'link',
        tabIndex: 0,
        'aria-label': `Open chapter: ${c.name}`,
        onClick: () => onOpen(ci),
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen(ci);
          }
        },
      }
    : {};
  return (
    <g {...a11y}>
      <rect x={x - w / 2} y={y - 19} width={w} height="53" rx="10" fill="#7E5C44" />
      <rect x={x - w / 2} y={y - 25} width={w} height="53" rx="10" fill="#2E2118" />
      <text x={x} y={y - 6} textAnchor="middle" fontSize="11.5" fontWeight="700" letterSpacing="1.2" fill="#D9A98A">{t1}</text>
      <text x={x} y={y + 15} textAnchor="middle" fontSize="17" fontWeight="700" fill="#FBF6EB">{c.name}</text>
    </g>
  );
}

function Bubble({ flat }) {
  const n = levelNode(flat);
  const x = px(n.off);
  const y = py(n.r);
  const lv = FLAT[flat];
  const left = n.off >= 0;
  const bw = Math.max(150, lv.title.length * 7.6 + 28);
  const bh = 60;
  const bx = left ? x - bw - 38 : x + 38;
  const by = y - 100;
  const tail = left
    ? `${bx + bw - 2},${by + 22} ${bx + bw + 16},${by + 38} ${bx + bw - 2},${by + 42}`
    : `${bx + 2},${by + 22} ${bx - 16},${by + 38} ${bx + 2},${by + 42}`;
  return (
    <g pointerEvents="none">
      <rect x={bx} y={by + 4} width={bw} height={bh} rx="12" fill="#2E2118" />
      <rect x={bx} y={by} width={bw} height={bh} rx="12" fill="#FBF6EB" />
      <polygon points={tail} fill="#FBF6EB" />
      <text x={bx + 14} y={by + 24} fontSize="13" fontWeight="700" fill="#A84F32">Next stop</text>
      <text x={bx + 14} y={by + 44} fontSize="14.5" fontWeight="700" fill="#2E2118">{lv.title}</text>
    </g>
  );
}

/* Clouds sit over chapters 3 and up; they never change shape, only lift. */
const CLOUD_ROWS = NODES.filter((n) => n.ch >= 2 && n.r % 2 === 0).map((n) => ({
  key: n.r,
  ch: n.ch,
  drift: hash(n.r, 9) > 0.5,
  puffs: [-250, -70, 110, 290].map((dx, i) => {
    const v = hash(n.r, i);
    return { x: W / 2 + dx + (v - 0.5) * 70, y: py(n.r) + (v - 0.5) * 22, s: 0.82 + v * 0.45 };
  }),
}));

function GameMap({ progress, heroAt, cloudsFor, interactive = true, avatar, heroRef, onSelectLevel, onOpenChapter }) {
  const curFlat = Math.min(progress, TOTAL - 1);
  const heroFlat = heroAt === undefined ? curFlat : Math.min(heroAt, TOTAL - 1);
  const cloudFrom = FLAT[Math.min(cloudsFor === undefined ? progress : cloudsFor, TOTAL - 1)].ch + 2;
  const hero = heroPos(heroFlat);

  // Ground, scenery, stairs and tiles are depth-sorted together so nearer things overlap farther ones.
  const objects = useMemo(() => {
    const list = [...STATIC_LAYER];
    NODES.forEach((n) => {
      const y = py(n.r);
      if (n.type === 'level') {
        const state = n.flat < progress ? 'done' : n.flat === curFlat && progress < TOTAL ? 'now' : 'locked';
        list.push({ y: y + 0.02, key: `l${n.flat}`, clickable: true, el: <Tile n={n} state={state} interactive={interactive} onSelect={onSelectLevel} /> });
      } else {
        list.push({ y: y + 0.02, key: `s${n.r}`, el: <Stairs x={px(n.off)} y={y - 4} /> });
      }
    });
    return list.sort((a, b) => a.y - b.y);
  }, [progress, curFlat, interactive, onSelectLevel]);

  return (
    <svg
      className="map"
      viewBox={`0 0 ${W} ${MAP_H}`}
      xmlns="http://www.w3.org/2000/svg"
      role={interactive ? 'group' : undefined}
      aria-label={interactive ? 'Level map' : undefined}
      aria-hidden={interactive ? undefined : 'true'}
      fontFamily="'Bricolage Grotesque','Trebuchet MS',sans-serif"
    >
      <g>{objects.map((o) => <g key={o.key} pointerEvents={o.clickable ? undefined : 'none'}>{o.el}</g>)}</g>
      {/* Clouds and the avatar are decoration: clicks pass through them to the tiles below. */}
      <g pointerEvents="none">
        {CLOUD_ROWS.map((row) => (
          <g key={row.key} className={`cloud ${row.ch < cloudFrom ? 'gone' : ''}`}>
            <g className={row.drift ? 'drift' : ''}>
              {row.puffs.map((p, i) => <Cloud key={i} x={p.x} y={p.y} s={p.s} />)}
            </g>
          </g>
        ))}
        {[0, 1, 2, 3, 4].map((i) => <Cloud key={`sky${i}`} x={40 + i * 160} y={58 + hash(i, 2) * 40} s={1.1} />)}
      </g>
      <g>
        <Gate ci={0} x={W / 2} y={py(0) + 92} interactive={interactive} onOpen={onOpenChapter} />
        {NODES.filter((n) => n.type === 'gate').map((n) => (
          <Gate key={n.r} ci={n.ch} x={W / 2} y={py(n.r) - 6} interactive={interactive} onOpen={onOpenChapter} />
        ))}
      </g>
      <g id="hero" ref={heroRef} pointerEvents="none" transform={`translate(${hero.x} ${hero.y})`}>
        <g className="bob">
          <g transform="scale(1.15)">
            <AvatarParts color={avatar.color} acc={avatar.acc} />
          </g>
        </g>
      </g>
      {interactive && progress < TOTAL && <Bubble flat={curFlat} />}
    </svg>
  );
}

export default memo(GameMap);
