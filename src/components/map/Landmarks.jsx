/* Large stone buildings that give each district a landmark, in the spirit of an old map:
   a stepped temple, a ruined arch, a fountain, a castle, obelisks, an observatory and a summit shrine.
   Every shape is drawn in isometric view from (x, y) = the centre of its base on the ground. */

const ISO = 0.586; // height/width ratio of an isometric diamond (HH / HW)
const STONE = ['#D4CFC5', '#ABA498', '#8E887D']; // top, left face, right face
const DARK_STONE = ['#8E887D', '#6E6455', '#5E5445'];
const ROOF = ['#B85A3A', '#A84F32', '#7E3820'];
const GOLD = ['#E0B659', '#C98F2B', '#97691A'];
const INK = '#2E2118';

/* A box: a diamond top of half-width hw, raised by h, with its two visible side faces. */
export function IsoBlock({ x, y, hw, h, c = STONE }) {
  const hh = hw * ISO;
  const t = y - h;
  return (
    <g>
      <polygon points={`${x - hw},${t} ${x},${t + hh} ${x},${y + hh} ${x - hw},${y}`} fill={c[1]} />
      <polygon points={`${x + hw},${t} ${x},${t + hh} ${x},${y + hh} ${x + hw},${y}`} fill={c[2]} />
      <polygon points={`${x},${t - hh} ${x + hw},${t} ${x},${t + hh} ${x - hw},${t}`} fill={c[0]} />
    </g>
  );
}

/* A round tower: a cylinder with a pointed roof (or battlements when roof is false). */
function Tower({ x, y, r, h, roof = true, c = STONE }) {
  const ry = r * ISO;
  const t = y - h;
  return (
    <g>
      <path d={`M${x - r} ${t}V${y}A${r} ${ry} 0 0 0 ${x + r} ${y}V${t}z`} fill={c[1]} />
      <path d={`M${x} ${t + ry}V${y + ry}A${r} ${ry} 0 0 0 ${x + r} ${y}V${t}A${r} ${ry} 0 0 1 ${x} ${t + ry}z`} fill={c[2]} />
      <ellipse cx={x} cy={t} rx={r} ry={ry} fill={c[0]} />
      {[-0.55, 0, 0.55].map((f) => <rect key={f} x={x + f * r - 2.5} y={y - h * 0.62} width="5" height="9" rx="2.5" fill={INK} opacity=".55" />)}
      {roof ? (
        <>
          <path d={`M${x - r - 3} ${t}L${x} ${t - r * 2.1}L${x} ${t + ry}z`} fill={ROOF[1]} />
          <path d={`M${x + r + 3} ${t}L${x} ${t - r * 2.1}L${x} ${t + ry}z`} fill={ROOF[2]} />
        </>
      ) : (
        [-0.7, -0.25, 0.25, 0.7].map((f) => <rect key={f} x={x + f * r - 3} y={t - 6 + Math.abs(f) * ry * 0.6} width="6" height="7" fill={c[1]} />)
      )}
    </g>
  );
}

/* Battlements along the two front edges of a block's top. */
function Crenels({ x, y, hw, h }) {
  const hh = hw * ISO;
  const t = y - h;
  const out = [];
  for (let i = 0; i <= 4; i++) {
    const f = i / 4;
    out.push(<rect key={`l${i}`} x={x - hw + f * hw - 3} y={t + f * hh - 7} width="6" height="7" fill={STONE[1]} />);
    out.push(<rect key={`r${i}`} x={x + f * hw - 3} y={t + hh - f * hh - 7} width="6" height="7" fill={STONE[2]} />);
  }
  return <g>{out}</g>;
}

const Shadow = ({ x, y, rx }) => <ellipse cx={x} cy={y + rx * ISO * 0.5} rx={rx} ry={rx * ISO} fill={INK} opacity=".22" />;

/* Stepped stone temple with front stairs and a small columned shrine on top. */
export function Temple({ x, y }) {
  return (
    <g>
      <Shadow x={x} y={y} rx={78} />
      <IsoBlock x={x} y={y} hw={70} h={16} />
      <IsoBlock x={x} y={y - 16} hw={52} h={16} />
      <IsoBlock x={x} y={y - 32} hw={34} h={14} />
      {/* stairs on the front-left face */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <polygon key={i} points={`${x - 26 + i * 2},${y + 18 - i * 8} ${x - 6 + i * 2},${y + 30 - i * 8} ${x - 6 + i * 2},${y + 34 - i * 8} ${x - 26 + i * 2},${y + 22 - i * 8}`} fill={i % 2 ? '#C9C3B8' : '#BDB6AA'} />
      ))}
      {/* shrine: four columns and a roof */}
      {[[-16, -6], [-4, 2], [4, -10], [16, -2]].map(([dx, dy]) => <rect key={dx} x={x + dx - 3} y={y - 46 + dy - 26} width="6" height="26" fill="#E7E2D8" />)}
      <IsoBlock x={x} y={y - 72} hw={24} h={6} c={DARK_STONE} />
      <polygon points={`${x - 24},${y - 78} ${x},${y - 100} ${x + 24},${y - 78} ${x},${y - 64}`} fill={ROOF[1]} />
      <polygon points={`${x},${y - 100} ${x + 24},${y - 78} ${x},${y - 64}`} fill={ROOF[2]} />
    </g>
  );
}

/* A ruined stone arch with fallen blocks, on the canyon rim. */
export function RuinedArch({ x, y }) {
  return (
    <g>
      <Shadow x={x} y={y} rx={46} />
      <IsoBlock x={x - 22} y={y + 6} hw={11} h={58} c={DARK_STONE} />
      <IsoBlock x={x + 22} y={y - 6} hw={11} h={46} c={DARK_STONE} />
      <polygon points={`${x - 36},${y - 52} ${x + 32},${y - 64} ${x + 34},${y - 54} ${x - 34},${y - 42}`} fill={DARK_STONE[0]} />
      <polygon points={`${x - 34},${y - 42} ${x + 34},${y - 54} ${x + 34},${y - 46} ${x - 34},${y - 34}`} fill={DARK_STONE[2]} />
      <IsoBlock x={x + 40} y={y + 14} hw={8} h={8} c={DARK_STONE} />
      <IsoBlock x={x - 44} y={y + 20} hw={6} h={6} c={DARK_STONE} />
    </g>
  );
}

/* A round stone fountain with water, for Sigmoid Springs. */
export function Fountain({ x, y }) {
  return (
    <g>
      <Shadow x={x} y={y} rx={44} />
      <path d={`M${x - 40} ${y - 10}V${y}A40 ${40 * ISO} 0 0 0 ${x + 40} ${y}V${y - 10}z`} fill={STONE[1]} />
      <ellipse cx={x} cy={y - 10} rx="40" ry={40 * ISO} fill={STONE[0]} />
      <ellipse cx={x} cy={y - 10} rx="32" ry={32 * ISO} fill="#5E8F8A" />
      <path d={`M${x - 18} ${y - 8}q6-4 12 0t12 0`} fill="none" stroke="#BFD0C8" strokeWidth="2" />
      <Tower x={x} y={y - 12} r={7} h={26} roof={false} />
      <path d={`M${x} ${y - 44}q-12 6-16 22M${x} ${y - 44}q12 6 16 22`} fill="none" stroke="#BFD0C8" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  );
}

/* A castle: a walled square keep, four round towers and a banner. */
export function Castle({ x, y }) {
  const hw = 46;
  const hh = hw * ISO;
  return (
    <g>
      <Shadow x={x} y={y} rx={86} />
      <Tower x={x} y={y - hh - 2} r={14} h={56} />
      <Tower x={x - hw} y={y - 2} r={14} h={52} />
      <IsoBlock x={x} y={y} hw={hw} h={34} />
      <Crenels x={x} y={y} hw={hw} h={34} />
      <IsoBlock x={x + 4} y={y - 34} hw={20} h={34} />
      <Crenels x={x + 4} y={y - 34} hw={20} h={34} />
      <path d={`M${x + 4} ${y - 80}v-30`} stroke={INK} strokeWidth="2.5" />
      <path d={`M${x + 4} ${y - 110}l22 6-22 7z`} fill={ROOF[1]} />
      {/* gate on the front-left wall, slanted like the wall */}
      <polygon points={`${x - hw / 2 - 8},${y + hh / 2 - 5} ${x - hw / 2 + 8},${y + hh / 2 + 4} ${x - hw / 2 + 8},${y + hh / 2 - 18} ${x - hw / 2},${y + hh / 2 - 26} ${x - hw / 2 - 8},${y + hh / 2 - 27}`} fill={INK} opacity=".7" />
      <Tower x={x + hw} y={y - 2} r={14} h={52} />
      <Tower x={x} y={y + hh - 2} r={14} h={48} />
    </g>
  );
}

/* A pair of obelisks with gold tips, like the spikes beside the charts in the reference map. */
export function Obelisks({ x, y }) {
  const one = (ox, oy, h, key) => (
    <g key={key}>
      <polygon points={`${ox - 9},${oy} ${ox},${oy + 5} ${ox},${oy - h} ${ox - 5},${oy - h + 6}`} fill={STONE[1]} />
      <polygon points={`${ox + 9},${oy} ${ox},${oy + 5} ${ox},${oy - h} ${ox + 5},${oy - h + 6}`} fill={STONE[2]} />
      <polygon points={`${ox - 5},${oy - h + 6} ${ox},${oy - h - 10} ${ox},${oy - h}`} fill={GOLD[1]} />
      <polygon points={`${ox + 5},${oy - h + 6} ${ox},${oy - h - 10} ${ox},${oy - h}`} fill={GOLD[2]} />
    </g>
  );
  return (
    <g>
      <Shadow x={x} y={y} rx={44} />
      <IsoBlock x={x} y={y} hw={40} h={6} c={DARK_STONE} />
      {one(x - 16, y - 8, 70, 'a')}
      {one(x + 18, y - 4, 56, 'b')}
    </g>
  );
}

/* A domed observatory tower: the place where models are measured. */
export function Observatory({ x, y }) {
  return (
    <g>
      <Shadow x={x} y={y} rx={46} />
      <IsoBlock x={x} y={y} hw={40} h={12} />
      <Tower x={x} y={y - 12} r={22} h={50} roof={false} />
      <path d={`M${x - 22} ${y - 62}a22 22 0 0 1 44 0z`} fill={GOLD[1]} />
      <path d={`M${x} ${y - 84}a22 22 0 0 1 22 22h-22z`} fill={GOLD[2]} />
      <rect x={x - 3} y={y - 82} width="7" height="18" fill={INK} opacity=".6" />
      <path d={`M${x + 2} ${y - 76}l22-16`} stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

/* The summit shrine on a golden plaza: the end of the climb. */
export function SummitShrine({ x, y }) {
  const tiles = [];
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      if (Math.abs(i) + Math.abs(j) > 3) continue;
      const tx = x + (i - j) * 15;
      const ty = y + (i + j) * 15 * ISO;
      tiles.push(<polygon key={`${i},${j}`} points={`${tx},${ty - 8.5} ${tx + 14},${ty} ${tx},${ty + 8.5} ${tx - 14},${ty}`} fill={(i + j) % 2 ? GOLD[0] : '#EBCB7E'} />);
    }
  }
  return (
    <g>
      <Shadow x={x} y={y} rx={80} />
      {tiles}
      <IsoBlock x={x} y={y - 4} hw={30} h={10} c={STONE} />
      {[[-18, 0], [-6, 7], [6, -7], [18, 0]].map(([dx, dy]) => <rect key={dx} x={x + dx - 3} y={y - 14 + dy - 30} width="6" height="30" fill="#E7E2D8" />)}
      <IsoBlock x={x} y={y - 44} hw={30} h={6} c={GOLD} />
      <polygon points={`${x - 30},${y - 50} ${x},${y - 76} ${x + 30},${y - 50} ${x},${y - 32}`} fill={GOLD[1]} />
      <polygon points={`${x},${y - 76} ${x + 30},${y - 50} ${x},${y - 32}`} fill={GOLD[2]} />
      <path d={`M${x} ${y - 76}v-14`} stroke={INK} strokeWidth="2" />
      <circle cx={x} cy={y - 92} r="4" fill={GOLD[0]} stroke={INK} strokeWidth="1.5" />
    </g>
  );
}

/* A small stone watchtower for the plains. */
export function Watchtower({ x, y }) {
  return (
    <g>
      <Shadow x={x} y={y} rx={30} />
      <Tower x={x} y={y} r={16} h={58} />
    </g>
  );
}
