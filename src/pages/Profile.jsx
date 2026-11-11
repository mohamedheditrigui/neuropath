/* XP, rank, streak, badges and completed levels, in one place. Name can be edited. */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CHAPTERS, TOTAL, XP_PER_RANK } from '../data/content.js';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { badges, chapterDone, liveStreak, rank } from '../services/game.js';
import Avatar from '../components/Avatar.jsx';
import Icon from '../components/Icon.jsx';
import { Bar } from '../components/ui.jsx';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* The 7 dates of the current week, Monday first. */
function thisWeek() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function NameEditor() {
  const { player, update } = usePlayer();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(player.name);
  const valid = name.trim().length >= 2 && name.trim().length <= 30;

  const save = async (e) => {
    e.preventDefault();
    if (!valid) return;
    await update({ ...player, name: name.trim() });
    toast('Name updated.', { icon: 'user' });
    setEditing(false);
  };

  if (!editing) {
    return (
      <div style={{ flex: 1, minWidth: 200 }}>
        <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>{player.name}</h1>
        <p className="muted">Level {rank(player.xp)} climber · <button type="button" className="linkish" onClick={() => setEditing(true)}>Edit name</button></p>
      </div>
    );
  }
  return (
    <form onSubmit={save} style={{ flex: 1, minWidth: 200, display: 'grid', gap: 8 }} noValidate>
      <label className="field">
        Display name
        <input value={name} onChange={(e) => setName(e.target.value)} className={valid ? '' : 'bad'} autoFocus maxLength={40} />
        {!valid && <small>Use 2 to 30 characters.</small>}
      </label>
      <div className="actions">
        <button className="btn primary" type="submit" disabled={!valid}>Save</button>
        <button className="btn" type="button" onClick={() => { setName(player.name); setEditing(false); }}>Cancel</button>
      </div>
    </form>
  );
}

export default function Profile() {
  const { player } = usePlayer();
  const lvl = rank(player.xp);
  const into = player.xp % XP_PER_RANK;
  const streak = liveStreak(player);
  const week = thisWeek();
  const active = new Set(player.activeDays || []);
  const list = badges(player);

  return (
    <>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <Avatar avatar={player.avatar} style={{ width: 92, height: 112 }} />
        <NameEditor />
        <Link className="btn" to="/avatar">Edit avatar</Link>
      </div>
      <div className="stats">
        <div className="stat"><b className="mono">{player.xp}</b><span>Total XP</span></div>
        <div className="stat"><b className="mono">{lvl}</b><span>Level</span></div>
        <div className="stat"><b className="mono">{streak}</b><span>Day streak</span></div>
        <div className="stat"><b className="mono">{player.progress}/{TOTAL}</b><span>Levels completed</span></div>
      </div>
      <div className="panel" style={{ display: 'grid', gap: 8 }}>
        <div className="readout"><h3>To level {lvl + 1}</h3><span className="mono">{into}/{XP_PER_RANK} XP</span></div>
        <Bar value={into} max={XP_PER_RANK} label={`${into} of ${XP_PER_RANK} XP to the next level`} />
      </div>
      <div className="two">
        <section className="panel" style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
          <h3>Badges <span className="muted mono" style={{ fontSize: '.9rem' }}>{list.filter((b) => b.earned).length}/{list.length}</span></h3>
          <div className="badges">
            {list.map((b) => (
              <div key={b.id} className={`badge ${b.earned ? '' : 'locked'}`}>
                <Icon name={b.icon} />
                {b.title}
                <small>{b.earned ? 'Earned' : b.need}</small>
              </div>
            ))}
          </div>
        </section>
        <div style={{ display: 'grid', gap: 20 }}>
          <section className="panel" style={{ display: 'grid', gap: 12 }}>
            <h3>This week</h3>
            <div className="week">
              {week.map((d, i) => (
                <div key={d} className={active.has(d) ? 'on' : ''}>
                  <i>{active.has(d) && <Icon name="flame" />}</i>
                  {DAYS[i]}
                </div>
              ))}
            </div>
          </section>
          <section className="panel" style={{ display: 'grid', gap: 10 }}>
            <h3>Completed levels</h3>
            {CHAPTERS.map((c, i) => {
              const done = chapterDone(player.progress, i);
              return (
                <div key={c.id}>
                  <div className="readout"><Link to={`/chapter/${i}`} style={{ fontWeight: 400, color: 'inherit' }}>{c.name}</Link><span className="mono">{done}/{c.levels.length}</span></div>
                  <Bar value={done} max={c.levels.length} tone="moss" label={`${c.name}: ${done} of ${c.levels.length}`} />
                </div>
              );
            })}
          </section>
        </div>
      </div>
    </>
  );
}
