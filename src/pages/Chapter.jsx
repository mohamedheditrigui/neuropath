/* One chapter: its banner and the list of levels, with a filter by status. */
import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { CHAPTERS, FLAT, XP_PER_LEVEL, chapterLabel, levelPath } from '../data/content.js';
import { usePlayer } from '../context/PlayerContext.jsx';
import { chapterDone, stateOf } from '../services/game.js';
import Icon from '../components/Icon.jsx';
import { Bar, Crumb } from '../components/ui.jsx';

const FILTERS = [['all', 'All'], ['done', 'Completed'], ['open', 'To do']];
const WORD = { done: 'Completed', now: 'Your next level', locked: 'Locked' };

export default function Chapter() {
  const { id } = useParams();
  const { player } = usePlayer();
  const [filter, setFilter] = useState('all');
  const ci = Number(id);
  const c = CHAPTERS[ci];
  if (!c) return <Navigate to="/roadmap" replace />;

  const done = chapterDone(player.progress, ci);
  const total = c.levels.length;
  const levels = FLAT.filter((l) => l.ch === ci)
    .map((l) => ({ ...l, st: stateOf(player.progress, l.flat) }))
    .filter((l) => filter === 'all' || (filter === 'done' ? l.st === 'done' : l.st !== 'done'));

  const action = (l) => {
    const go = levelPath(l.flat);
    if (l.st === 'done') return <Link className="btn" to={go}>Replay</Link>;
    if (l.st === 'now') return <Link className="btn primary" to={go}>Start <Icon name="arrow" /></Link>;
    if (c.final) return <span className="muted"><Icon name="lock" /> Locked</span>;
    return <Link className="btn" to={`/quiz/${l.flat}`}>Quiz to unlock</Link>;
  };

  return (
    <>
      <Crumb parts={[['Roadmap', '/roadmap'], [c.name]]} />
      <section className="ch-banner" style={{ background: c.color }}>
        <p className="eyebrow">{chapterLabel(ci)} in {c.zone}</p>
        <h1>{c.name}</h1>
        <p>{c.summary}</p>
        <p>{done} of {total} levels completed</p>
        <Bar value={done} max={total} label={`${done} of ${total} levels completed`} style={{ flex: 'none', background: 'rgba(251,246,235,.3)', boxShadow: 'none' }} tone="paper" />
      </section>
      <div className="two">
        <section className="level-list" aria-label="Levels">
          {total > 1 && (
            <div className="toolbar">
              <div className="tabs" role="group" aria-label="Filter levels">
                {FILTERS.map(([key, label]) => (
                  <button key={key} type="button" aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}</button>
                ))}
              </div>
            </div>
          )}
          {levels.length === 0 && <p className="empty panel">{filter === 'done' ? 'Nothing completed here yet. Your first check mark is one lesson away.' : 'Every level here is done. On to the next chapter!'}</p>}
          {levels.map((l) => (
            <div key={l.flat} className={`level ${l.st}`}>
              <span className="gem">{l.st === 'done' ? <Icon name="check" /> : l.st === 'locked' ? <Icon name="lock" /> : l.lv + 1}</span>
              <div>
                <b>{l.title}</b>
                <br />
                <small>{WORD[l.st]}, {XP_PER_LEVEL} XP</small>
              </div>
              {action(l)}
            </div>
          ))}
        </section>
        <aside className="panel" style={{ display: 'grid', gap: 10 }}>
          <h3>How levels unlock</h3>
          <p className="muted">A level opens when you finish the one before it. In a hurry? Pass a locked level&apos;s quiz to jump straight there.</p>
          <div className="actions">
            {ci > 0 && <Link className="btn" to={`/chapter/${ci - 1}`}>Previous chapter</Link>}
            {ci < CHAPTERS.length - 1 && <Link className="btn" to={`/chapter/${ci + 1}`}>Next chapter</Link>}
          </div>
          <Link className="btn ghost" to="/roadmap">Back to the map</Link>
        </aside>
      </div>
    </>
  );
}
