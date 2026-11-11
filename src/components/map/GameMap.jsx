/* The isometric level map: terrain, scenery, level tiles, chapter gates, clouds and the avatar.
   progress  = number of completed levels (tiles before it are done, the next one is "now")
   cloudsFor = level index whose chapter decides which clouds are still covering the map
   heroAt    = level index where the avatar stands (the Roadmap animates it with heroRef) */
import { memo, useMemo } from 'react';
import { CHAPTERS, FLAT, TOTAL } from '../../data/content.js';
import { AvatarParts } from '../Avatar.jsx';
import { Cloud, Decor } from './Scenery.jsx';
import { BOT_PAD, DEPTH, HH, HW, MAP_H, NODES, ROWS, TOP_PAD, W, dia, hash, heroPos, levelNode, px, py } from './geometry.js';

const BIOME = [
  ['#8C9458', '#7F8A4E'], ['#C2A35A', '#B6964E'], ['#B87B57', '#AB6F4C'],
  ['#9AA27A', '#8E9670'], ['#A39684', '#978A78'], ['#D8CDB6', '#CDC1A8'],
];
const POND = new Set(['3,5', '5,5', '4,4', '4,6']);
const SKIN = {
  done: ['#6F7E39', '#525D28', '#3D4620'],
  now: ['#B85A3A', '#7E3820', '#632B18'],
  locked: ['#B8AD9A', '#8B7E6C', '#756A5A'],
};
const STATE_WORD = { done: 'completed', now: 'current level', locked: 'locked' };

/* Ground tiles and scenery never change, so they are computed once. */
function buildGround() {
  const rowOff = new Map(NODES.map((n) => [n.r, n.off]));
  const biomeAt = (r) => NODES[Math.max(0, Math.min(ROWS - 1, r))].ch;
  const terrain = [];
  const decor = [];
  const rowMax = ROWS + Math.ceil(TOP_PAD / HH) + 2;
  for (let r = -Math.ceil(BOT_PAD / HH) - 2; r < rowMax; r++) {
    for (let k = -8; k <= 8; k++) {
      if ((((k + r) % 2) + 2) % 2 !== 0) continue;
      const x = px(k);
      const y = py(r);
      let ci = biomeAt(r);
      const look = biomeAt(r + 3);
      if (look !== ci && hash(k, r) < 0.4) ci = look; // soften the border between biomes
      const pond = POND.has(`${k},${r}`);
      const fill = pond ? '#6F8F86' : BIOME[ci][((k + r) / 2 + 40) % 2 === 0 ? 0 : 1];
      terrain.push(<polygon key={`t${k},${r}`} points={dia(x, y, HW, HH)} fill={fill} stroke={fill} strokeWidth=".7" />);
      if (pond) {
        terrain.push(<path key={`w${k},${r}`} d={`M${x - 16} ${y}q8-5 16 0t16 0`} fill="none" stroke="#BFD0C8" strokeWidth="2.2" strokeLinecap="round" />);
        continue;
      }
      let nearPath = false; // keep a clear corridor around the path
      for (let dr = -2; dr <= 2; dr++) {
        const o = rowOff.get(r + dr);
        if (o !== undefined && Math.abs(o - k) <= 1) nearPath = true;
      }
      if (!nearPath && hash(k + 17, r - 5) > 0.5) decor.push({ y, key: `d${k},${r}`, el: <Decor ci={ci} x={x} y={y} k={k} r={r} /> });
    }
  }
  return { terrain, decor };
}
const GROUND = buildGround();

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
      {state === 'now' && <polygon className="pulse" points={dia(x, y, hw, hh)} fill="none" stroke="#FBF6EB" strokeWidth="4" />}
      {state === 'done' && <path d={`M${x - 14} ${y}l9 9l19-19`} fill="none" stroke="#FBF6EB" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />}
      {state !== 'done' && final && (
        <>
          <path d={`M${x - 6} ${y + 11}V${y - 15}`} stroke="#2E2118" strokeWidth="3" strokeLinecap="round" />
          <path d={`M${x - 6} ${y - 15}l18 6l-18 6z`} fill={state === 'now' ? '#FBF6EB' : '#A84F32'} />
        </>
      )}
      {state === 'locked' && !final && (
        <>
          <rect x={x - 9} y={y - 3} width="18" height="13" rx="3" fill="#5E5445" />
          <path d={`M${x - 5.5} ${y - 3}v-4a5.5 5.5 0 0 1 11 0v4`} fill="none" stroke="#5E5445" strokeWidth="3" />
        </>
      )}
    </g>
  );
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

  // Tiles and decorations are depth-sorted together so nearer things overlap farther ones.
  const objects = useMemo(() => {
    const list = GROUND.decor.map((d) => ({ y: d.y, key: d.key, el: d.el }));
    NODES.forEach((n) => {
      const x = px(n.off);
      const y = py(n.r);
      if (n.type === 'level') {
        const state = n.flat < progress ? 'done' : n.flat === curFlat && progress < TOTAL ? 'now' : 'locked';
        list.push({ y: y - 1, key: `l${n.flat}`, el: <Tile n={n} state={state} interactive={interactive} onSelect={onSelectLevel} /> });
      } else {
        list.push({
          y: y - 1,
          key: `s${n.r}`,
          el: (
            <g>
              <polygon points={dia(x, y - 3, HW * 0.62, HH * 0.62)} fill="#7A5B40" />
              <polygon points={dia(x, y - 6, HW * 0.62, HH * 0.62)} fill="#9C7A58" />
            </g>
          ),
        });
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
      <g>{GROUND.terrain}</g>
      <g>{objects.map((o) => <g key={o.key}>{o.el}</g>)}</g>
      <g>
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
      <g id="hero" ref={heroRef} transform={`translate(${hero.x} ${hero.y})`}>
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
