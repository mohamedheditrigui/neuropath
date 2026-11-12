/* A lesson: short explanation, the chapter's interactive lab and the "Complete level" button. */
import { useCallback, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { CHAPTERS, FLAT, XP_PER_LEVEL, levelPath } from '../data/content.js';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { stateOf } from '../services/game.js';
import LineLab from '../components/labs/LineLab.jsx';
import MultiLab from '../components/labs/MultiLab.jsx';
import DescentLab from '../components/labs/DescentLab.jsx';
import KnnLab from '../components/labs/KnnLab.jsx';
import MetricsLab from '../components/labs/MetricsLab.jsx';
import LogisticLab from '../components/labs/LogisticLab.jsx';
import OverfitLab from '../components/labs/OverfitLab.jsx';
import Icon from '../components/Icon.jsx';
import { Crumb, Spinner } from '../components/ui.jsx';

const LABS = { line: LineLab, multi: MultiLab, descent: DescentLab, logistic: LogisticLab, knn: KnnLab, metrics: MetricsLab, overfit: OverfitLab };

export default function Lesson() {
  const { flat: param } = useParams();
  const { player, finishLevel } = usePlayer();
  const toast = useToast();
  const navigate = useNavigate();
  const [solved, setSolved] = useState(false);
  const [busy, setBusy] = useState(false);
  const onSolved = useCallback((v) => setSolved(v), []);

  const flat = Number(param);
  const lv = FLAT[flat];
  if (!lv) return <Navigate to="/roadmap" replace />;
  const c = CHAPTERS[lv.ch];
  if (c.final) return <Navigate to={levelPath(flat)} replace />;
  const st = stateOf(player.progress, flat);
  if (st === 'locked') {
    return (
      <>
        <Crumb parts={[['Roadmap', '/roadmap'], [c.name, `/chapter/${lv.ch}`], [lv.title]]} />
        <section className="panel" style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
          <p className="eyebrow">Locked level</p>
          <h2>{lv.title}</h2>
          <p className="muted">Finish “{FLAT[player.progress].title}” first, or pass this level&apos;s quiz to skip ahead.</p>
          <div className="actions">
            <Link className="btn primary" to={`/quiz/${flat}`}>Take the quiz</Link>
            <Link className="btn" to={levelPath(player.progress)}>Go to my next level</Link>
          </div>
        </section>
      </>
    );
  }

  const Lab = LABS[lv.lab || c.lab]; // a level may use another lab than its chapter
  const steps = c.levels.length;

  const complete = async () => {
    setBusy(true);
    try {
      const r = await finishLevel(flat);
      if (r.gained) toast(`Level complete. +${r.gained} XP`, { icon: 'bolt' });
      navigate('/roadmap');
    } catch {
      toast('Could not save your progress. Check your connection and try again.', { icon: 'x', tone: 'bad' });
      setBusy(false);
    }
  };

  return (
    <>
      <Crumb parts={[['Roadmap', '/roadmap'], [c.name, `/chapter/${lv.ch}`], [lv.title]]} />
      <div className="seg" aria-label={`Level ${lv.lv + 1} of ${steps}`}>
        {c.levels.map((_, i) => <i key={i} className={i <= lv.lv ? 'on' : ''} />)}
      </div>
      <div style={{ display: 'grid', gap: 10, maxWidth: '72ch' }}>
        <p className="eyebrow">Chapter {lv.ch + 1}, level {lv.lv + 1}</p>
        <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>{lv.title}</h1>
        <p>{lv.text}</p>
        {lv.key && <p className="key"><b>Remember:</b> {lv.key}</p>}
      </div>
      {/* key: a fresh lab for every level, so sliders reset */}
      <Lab key={flat} level={lv} onSolved={onSolved} />
      <div className="actions">
        {st === 'done' ? (
          <Link className="btn moss big" to="/roadmap"><Icon name="check" /> Completed: back to the map</Link>
        ) : (
          <button className="btn moss big" type="button" disabled={!solved || busy} onClick={complete}>
            {busy && <Spinner />}Complete level (+{XP_PER_LEVEL} XP)
          </button>
        )}
        <Link className="btn big" to={`/quiz/${flat}`}>Take the quiz</Link>
        {flat + 1 < FLAT.length && FLAT[flat + 1].ch === lv.ch && st === 'done' && (
          <Link className="btn big" to={`/lesson/${flat + 1}`}>Next level <Icon name="arrow" /></Link>
        )}
      </div>
      {st !== 'done' && !solved && <p className="muted">Reach the exercise goal to unlock the Complete button, or prove you know it with the quiz.</p>}
    </>
  );
}
