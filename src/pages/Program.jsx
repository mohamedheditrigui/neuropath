/* The course program (syllabus): every chapter and level title, readable before signing up.
   Works as a public page and inside the app; signed-in players also see their status per level. */
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CHAPTERS, FLAT, TOTAL, XP_PER_LEVEL, chapterLabel, levelPath } from '../data/content.js';
import { usePlayer } from '../context/PlayerContext.jsx';
import { chapterDone, stateOf } from '../services/game.js';
import AppShell from '../components/layout/AppShell.jsx';
import Loading from '../components/layout/Loading.jsx';
import PublicHeader from '../components/layout/PublicHeader.jsx';
import Icon from '../components/Icon.jsx';
import { Bar } from '../components/ui.jsx';

// Name of the interactive lab each chapter uses (see src/components/labs).
const LAB_NAMES = {
  line: 'Line fitting lab',
  multi: 'Multi-feature lab',
  descent: 'Gradient descent lab',
  logistic: 'Sigmoid lab',
  knn: 'Nearest neighbours lab',
  metrics: 'Confusion matrix lab',
};
const QUIZ_TOTAL = CHAPTERS.reduce((n, c) => n + c.quiz.length, 0);
const WORD = { done: 'Completed', now: 'Your next level', locked: 'Locked' };

function ProgramContent() {
  const { player } = usePlayer();
  const progress = player ? player.progress : null;
  const [query, setQuery] = useState('');
  // Every chapter starts open so the whole program is visible at once.
  const [open, setOpen] = useState(() => new Set(CHAPTERS.map((c) => c.id)));
  const q = query.trim().toLowerCase();
  const { hash } = useLocation();

  // Links like /program#chapter-3 (from the landing page) land on that chapter.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
  }, [hash]);
  const jump = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const chapters = CHAPTERS.map((c) => {
    const levels = FLAT.filter((l) => l.ch === c.id);
    const hit = (l) => !q || l.title.toLowerCase().includes(q) || (l.key || '').toLowerCase().includes(q);
    const chapterHit = q && (c.name.toLowerCase().includes(q) || c.zone.toLowerCase().includes(q));
    return { ...c, all: levels, shown: chapterHit ? levels : levels.filter(hit) };
  }).filter((c) => c.shown.length > 0);

  const toggle = (id) =>
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const allOpen = chapters.every((c) => open.has(c.id));
  const setAll = () => setOpen(allOpen ? new Set() : new Set(CHAPTERS.map((c) => c.id)));

  return (
    <>
      <section className="ch-banner" style={{ backgroundColor: 'var(--moss-d)' }}>
        <p className="eyebrow">The program</p>
        <h1>Everything you will learn, level by level.</h1>
        <p>
          From your first straight line to a trained model you can explain. Each level is a short lesson with an
          interactive lab, and every chapter ends with a quiz.
        </p>
        <dl className="prog-facts">
          <div>
            <dt>Chapters</dt>
            <dd>{CHAPTERS.length}</dd>
          </div>
          <div>
            <dt>Levels</dt>
            <dd>{TOTAL}</dd>
          </div>
          <div>
            <dt>Quiz questions</dt>
            <dd>{QUIZ_TOTAL}</dd>
          </div>
          <div>
            <dt>XP to earn</dt>
            <dd>{TOTAL * XP_PER_LEVEL}</dd>
          </div>
        </dl>
      </section>

      <div className="toolbar prog-tools">
        <label className="search">
          <Icon name="search" />
          <span className="sr-only">Search the program</span>
          <input
            type="search"
            placeholder="Find a topic, e.g. sigmoid"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <button type="button" className="btn ghost" onClick={setAll}>
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <nav className="prog-jump" aria-label="Chapters">
        {CHAPTERS.map((c) => (
          <a
            key={c.id}
            href={`#chapter-${c.id}`}
            onClick={(e) => jump(e, `chapter-${c.id}`)}
            style={{ '--c': c.color }}
          >
            {c.final ? 'Final' : c.id + 1}. {c.name}
          </a>
        ))}
      </nav>

      {chapters.length === 0 && <p className="empty panel">No chapter or level matches “{query}”.</p>}

      <ol className="prog-list">
        {chapters.map((c) => {
          const isOpen = open.has(c.id) || Boolean(q);
          const done = progress === null ? null : chapterDone(progress, c.id);
          const bodyId = `chapter-${c.id}-levels`;
          return (
            <li key={c.id} id={`chapter-${c.id}`} className="prog-ch" style={{ '--c': c.color }}>
              {/* Accordion pattern: the chapter heading wraps the button that opens it. */}
              <h2 className="prog-h">
                <button
                  type="button"
                  className="prog-head"
                  aria-expanded={isOpen}
                  aria-controls={bodyId}
                  onClick={() => toggle(c.id)}
                >
                  <span className="prog-num" aria-hidden="true">
                    {c.final ? <Icon name="star" /> : c.id + 1}
                  </span>
                  <span className="prog-title">
                    <small className="eyebrow">
                      {chapterLabel(c.id)} · {c.zone}
                    </small>
                    <b>{c.name}</b>
                    <span className="muted">{c.summary}</span>
                  </span>
                  <span className="prog-meta">
                    <span>
                      {c.all.length} {c.final ? 'steps' : 'levels'}
                    </span>
                    <span>{c.final ? 'Guided project' : `${LAB_NAMES[c.lab]} · ${c.quiz.length}-question quiz`}</span>
                  </span>
                  <span className={`prog-chev ${isOpen ? 'up' : ''}`} aria-hidden="true">
                    <Icon name="arrow" />
                  </span>
                </button>
              </h2>
              {done !== null && (
                <Bar
                  value={done}
                  max={c.all.length}
                  label={`${c.name}: ${done} of ${c.all.length} completed`}
                  style={{ margin: '0 18px' }}
                />
              )}
              {isOpen && (
                <ol className="prog-levels" id={bodyId}>
                  {c.shown.map((l) => {
                    const st = progress === null ? null : stateOf(progress, l.flat);
                    return (
                      <li key={l.flat} className={st || ''}>
                        <span className="gem" aria-hidden="true">
                          {st === 'done' ? <Icon name="check" /> : st === 'locked' ? <Icon name="lock" /> : l.lv + 1}
                        </span>
                        <div>
                          <b>{l.title}</b>
                          {l.key && <p className="muted">{l.key}</p>}
                          {st && <small className="sr-only">{WORD[st]}</small>}
                        </div>
                        {st && st !== 'locked' && (
                          <Link
                            className={`btn ${st === 'now' ? 'primary' : ''}`}
                            to={levelPath(l.flat)}
                            aria-label={`${st === 'now' ? 'Start' : 'Replay'} ${l.title}`}
                          >
                            {st === 'now' ? 'Start' : 'Replay'}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ol>
              )}
            </li>
          );
        })}
      </ol>

      <section className="panel prog-cta">
        <div>
          <h2 className="prog-cta-title">{player ? 'Keep climbing.' : 'Ready for level one?'}</h2>
          <p className="muted">
            {player
              ? 'Your next glowing tile is waiting on the map.'
              : 'Create a free account and start with “What is a prediction?”.'}
          </p>
        </div>
        <Link className="btn primary" to={player ? '/roadmap' : '/signup'}>
          {player ? 'Open my map' : 'Start the climb'} <Icon name="arrow" />
        </Link>
      </section>
    </>
  );
}

export default function Program() {
  const { user, player, ready } = usePlayer();
  if (!ready) return <Loading />;
  if (user && player)
    return (
      <AppShell>
        <ProgramContent />
      </AppShell>
    );
  return (
    <div className="page-scroll">
      <PublicHeader />
      <div className="content">
        <ProgramContent />
      </div>
    </div>
  );
}
