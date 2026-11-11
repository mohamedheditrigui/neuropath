/* The central page: the climbing map, the next-level dock and the chapter list. */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CHAPTERS, FLAT, TOTAL, XP_PER_LEVEL, chapterLabel } from '../data/content.js';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { chapterDone, currentChapter, liveStreak, stateOf } from '../services/game.js';
import GameMap from '../components/map/GameMap.jsx';
import { MAP_H, heroPos, levelNode, py } from '../components/map/geometry.js';
import Icon from '../components/Icon.jsx';
import { Bar } from '../components/ui.jsx';

const reducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Dock({ shown, xp, streak }) {
  const finished = shown >= TOTAL;
  const cur = FLAT[Math.min(shown, TOTAL - 1)];
  const done = chapterDone(shown, cur.ch);
  const total = CHAPTERS[cur.ch].levels.length;
  const goal = finished ? '/profile' : CHAPTERS[cur.ch].final ? '/project' : `/lesson/${cur.flat}`;
  return (
    <div className="dock">
      <div className="dock-top">
        <span className="count xp"><Icon name="bolt" /><span className="mono">{xp}</span>&nbsp;XP</span>
        <span className="count"><Icon name="flame" /><span className="mono">{streak}</span>&nbsp;{streak === 1 ? 'day' : 'days'}</span>
        <Bar value={done} max={total} label={`${done} of ${total} levels done in this chapter`} />
        <span className="mono" style={{ whiteSpace: 'nowrap' }}>{done}/{total}</span>
      </div>
      <div className="dock-btns">
        <Link className="btn" to={`/chapter/${cur.ch}`} aria-label="Open the chapter's level list"><Icon name="list" /></Link>
        <Link className="btn moss big" to={goal}><span className="label">{finished ? 'See your progress' : `Continue: ${cur.title}`}</span></Link>
      </div>
    </div>
  );
}

function LevelSheet({ flat, progress, onClose }) {
  const lv = FLAT[flat];
  const st = stateOf(progress, flat);
  const final = CHAPTERS[lv.ch].final;
  const prev = FLAT[Math.min(progress, TOTAL - 1)].title;
  const closeBtn = useRef(null);
  useEffect(() => closeBtn.current?.focus(), [flat]);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="sheet" role="dialog" aria-label={lv.title}>
      <button className="x" type="button" aria-label="Close" onClick={onClose} ref={closeBtn}><Icon name="x" /></button>
      <p className="eyebrow">{final ? 'Final chapter' : `Chapter ${lv.ch + 1}, level ${lv.lv + 1}`}</p>
      <h3>{lv.title}</h3>
      {st === 'done' && (
        <>
          <p className="muted"><Icon name="check" /> Completed. Replay it any time.</p>
          <div className="row">
            <Link className="btn moss" to={final ? '/project' : `/lesson/${flat}`}>Replay {final ? 'project' : 'lesson'}</Link>
            <Link className="btn" to={`/chapter/${lv.ch}`}>Chapter page</Link>
          </div>
        </>
      )}
      {st === 'now' && (
        <>
          <p className="muted">{final ? 'Train a model from data to prediction, step by step.' : `Your next level. Earn ${XP_PER_LEVEL} XP.`}</p>
          <div className="row">
            {final ? <Link className="btn primary" to="/project">Start the project</Link> : (
              <>
                <Link className="btn primary" to={`/lesson/${flat}`}>Start lesson</Link>
                <Link className="btn" to={`/quiz/${flat}`}>Take the quiz</Link>
              </>
            )}
          </div>
        </>
      )}
      {st === 'locked' && (
        <>
          <p className="muted"><Icon name="lock" /> Locked. Finish “{prev}” first{final ? '.' : ", or pass this level's quiz to skip ahead."}</p>
          <div className="row">
            {!final && <Link className="btn primary" to={`/quiz/${flat}`}>Take the quiz</Link>}
            <button className="btn" type="button" onClick={onClose}>Not now</button>
          </div>
        </>
      )}
    </div>
  );
}

function UnlockCard({ ci, onClose }) {
  const c = CHAPTERS[ci];
  const ok = useRef(null);
  useEffect(() => ok.current?.focus(), []);
  return (
    <div className="unlock" role="dialog" aria-label="Chapter unlocked">
      <div className="card">
        <svg width="90" height="90" viewBox="0 0 90 90" aria-hidden="true">
          <path d="M45 6l39 39-39 39L6 45z" fill="#C98F2B" />
          <path d="M45 18l27 27-27 27-27-27z" fill="#FBF6EB" />
          <path d="M34 45l8 8 15-16" fill="none" stroke="#5F6D32" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="eyebrow">{chapterLabel(ci)} unlocked</p>
        <h2>{c.name}</h2>
        <p className="muted">The clouds lift over {c.zone}.</p>
        <button className="btn primary" type="button" onClick={onClose} ref={ok}>Keep climbing</button>
      </div>
    </div>
  );
}

export default function Roadmap() {
  const { player, pendingJump, clearJump } = usePlayer();
  const toast = useToast();
  const navigate = useNavigate();
  const jump = useRef(pendingJump); // read once: the animation plays a single time
  const [view, setView] = useState(() =>
    jump.current ? { progress: jump.current.from, heroAt: jump.current.from, cloudsFor: jump.current.from } : { progress: player.progress },
  );
  const [sheet, setSheet] = useState(null);
  const [unlocked, setUnlocked] = useState(null);
  const scene = useRef(null);
  const hero = useRef(null);

  const scrollToLevel = useCallback((flat, smooth) => {
    const el = scene.current;
    const svg = el && el.querySelector('svg.map');
    if (!svg) return;
    const k = svg.getBoundingClientRect().height / MAP_H;
    el.scrollTo({ top: py(levelNode(flat).r) * k - el.clientHeight * 0.62, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  useLayoutEffect(() => scrollToLevel(Math.min(view.progress, TOTAL - 1), false), []); // eslint-disable-line react-hooks/exhaustive-deps

  // The jump: tiles update, the avatar hops along an arc, then the clouds lift if a chapter opened.
  useEffect(() => {
    const j = jump.current;
    if (!j) return undefined;
    clearJump();
    let raf;
    const target = Math.min(j.to, TOTAL - 1);
    const finish = () => {
      jump.current = null;
      setView({ progress: j.to });
      scrollToLevel(target, true);
      if (FLAT[target].ch > FLAT[Math.min(j.from, TOTAL - 1)].ch) setUnlocked(FLAT[target].ch);
    };
    const timer = setTimeout(() => {
      setView({ progress: j.to, heroAt: j.from, cloudsFor: j.from });
      scrollToLevel(target, true);
      if (reducedMotion() || !hero.current) return finish();
      const a = heroPos(Math.min(j.from, TOTAL - 1));
      const b = heroPos(target);
      const t0 = performance.now();
      const frame = (now) => {
        const t = Math.min(1, (now - t0) / 750);
        const e = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        const arc = -Math.sin(t * Math.PI) * 74;
        hero.current?.setAttribute('transform', `translate(${a.x + (b.x - a.x) * e} ${a.y + (b.y - a.y) * e + arc})`);
        if (t < 1) raf = requestAnimationFrame(frame);
        else finish();
      };
      raf = requestAnimationFrame(frame);
      return undefined;
    }, 600);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [clearJump, scrollToLevel]);

  // Progress changed elsewhere (another tab, a sync): follow it.
  useEffect(() => {
    if (!jump.current) setView({ progress: player.progress });
  }, [player.progress]);

  const onSelectLevel = useCallback((flat) => setSheet(flat), []);
  const onOpenChapter = useCallback((ci) => navigate(`/chapter/${ci}`), [navigate]);

  const shown = view.progress;
  const cur = FLAT[Math.min(shown, TOTAL - 1)];
  const curChapter = CHAPTERS[cur.ch];
  const streak = liveStreak(player);
  const nowCh = currentChapter(player.progress);
  const playedToday = player.lastActive === new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (shown >= TOTAL && !jump.current) toast('Summit reached. You trained your first model!', { icon: 'star' });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="road">
      <div className="road-col">
        <header className="road-head">
          <div>
            <h1>Roadmap</h1>
            <div className="where">{chapterLabel(cur.ch)}: {curChapter.name}</div>
          </div>
          <Link className="btn" to={`/chapter/${cur.ch}`}>Chapter page</Link>
        </header>
        <div className="scene" ref={scene}>
          <GameMap
            progress={view.progress}
            heroAt={view.heroAt}
            cloudsFor={view.cloudsFor}
            avatar={player.avatar}
            heroRef={hero}
            onSelectLevel={onSelectLevel}
            onOpenChapter={onOpenChapter}
          />
        </div>
        {sheet !== null && <LevelSheet flat={sheet} progress={player.progress} onClose={() => setSheet(null)} />}
        {unlocked !== null && <UnlockCard ci={unlocked} onClose={() => setUnlocked(null)} />}
        <Dock shown={shown} xp={player.xp} streak={streak} />
      </div>
      <aside className="road-side" aria-label="Chapters">
        <p className="eyebrow">Your path</p>
        {CHAPTERS.map((ch, i) => {
          const done = chapterDone(player.progress, i);
          const total = ch.levels.length;
          const st = done === total ? 'done' : nowCh === i ? 'now' : '';
          return (
            <Link key={ch.id} className={`ch-row ${st}`} to={`/chapter/${i}`}>
              <span className="gem">{st === 'done' ? <Icon name="check" /> : ch.final ? <Icon name="star" /> : i + 1}</span>
              <span>
                <b>{ch.name}</b>
                <small>{done} of {total} levels</small>
                <Bar value={done} max={total} tone="moss" label={`${ch.name}: ${done} of ${total}`} style={{ display: 'block' }} />
              </span>
            </Link>
          );
        })}
        <div className="panel" style={{ display: 'grid', gap: 8 }}>
          <h3>Today&apos;s goal</h3>
          <p className="muted">
            {playedToday ? `Done for today. Your streak is ${streak} ${streak === 1 ? 'day' : 'days'}.` : streak > 0 ? `Finish one level to keep your ${streak}-day streak.` : 'Finish one level to start a streak.'}
          </p>
          <Bar value={playedToday ? 1 : 0} max={1} label="Today's goal" />
        </div>
      </aside>
    </div>
  );
}
