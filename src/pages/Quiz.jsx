/* Three questions, one at a time, with instant feedback. 2 of 3 validates the level,
   and passing the quiz of a locked level skips ahead to it. */
import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { CHAPTERS, FLAT, levelPath, quizPassMark } from '../data/content.js';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Icon from '../components/Icon.jsx';
import { Bar, Crumb, Spinner } from '../components/ui.jsx';

export default function Quiz() {
  const { flat: param } = useParams();
  const { player, finishLevel } = usePlayer();
  const toast = useToast();
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [finished, setFinished] = useState(false);
  const [busy, setBusy] = useState(false);
  const nextBtn = useRef(null);

  useEffect(() => {
    if (picked !== null) nextBtn.current?.focus();
  }, [picked]);

  const flat = Number(param);
  const lv = FLAT[flat];
  if (!lv) return <Navigate to="/roadmap" replace />;
  const c = CHAPTERS[lv.ch];
  if (c.final) return <Navigate to={levelPath(flat)} replace />;
  const QUIZ = c.quiz;
  const skip = flat > player.progress;
  const q = QUIZ[i];

  const choose = (n) => {
    if (picked !== null) return;
    setPicked(n);
    if (n === q.a) setScore((s) => s + 1);
  };
  const next = () => {
    if (i + 1 < QUIZ.length) {
      setI(i + 1);
      setPicked(null);
    } else setFinished(true);
  };
  const restart = () => {
    setI(0);
    setScore(0);
    setPicked(null);
    setFinished(false);
  };
  const claim = async () => {
    setBusy(true);
    try {
      const r = await finishLevel(flat, { viaQuiz: true });
      if (r.gained) toast(skip ? `Skipped ahead! +${r.gained} XP` : `Quiz passed. +${r.gained} XP`, { icon: 'bolt' });
      navigate('/roadmap');
    } catch {
      toast('Could not save your progress. Try again.', { icon: 'x', tone: 'bad' });
      setBusy(false);
    }
  };

  const crumb = <Crumb parts={[['Roadmap', '/roadmap'], [c.name, `/chapter/${lv.ch}`], [`Quiz: ${lv.title}`]]} />;

  if (finished) {
    const passMark = quizPassMark(QUIZ.length);
    const pass = score >= passMark;
    const already = flat < player.progress;
    return (
      <>
        {crumb}
        <div className="quiz">
          <div className="panel" style={{ display: 'grid', gap: 14, justifyItems: 'center', textAlign: 'center', padding: 32 }}>
            <p className="eyebrow">{pass ? 'Quiz passed' : 'Quiz not passed'}</p>
            <div className="score-big">{score}/{QUIZ.length}</div>
            <p className="muted">
              {pass
                ? already ? 'Well done. You had already cleared this level, so no extra XP this time.' : 'Well done. The level unlocks and your avatar jumps forward.'
                : `You need ${passMark} out of ${QUIZ.length} to pass. Review the lesson and try again.`}
            </p>
            <div className="actions" style={{ justifyContent: 'center' }}>
              {pass ? (
                <button className="btn moss big" type="button" onClick={claim} disabled={busy}>{busy && <Spinner />}Back to the Roadmap</button>
              ) : (
                <>
                  {!skip && <Link className="btn primary big" to={`/lesson/${flat}`}>Review the lesson</Link>}
                  <button className="btn big" type="button" onClick={restart}>Try again</button>
                </>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {crumb}
      <div className="quiz">
        <div className="quiz-top">
          <Bar value={i} max={QUIZ.length} tone="moss" label={`Question ${i + 1} of ${QUIZ.length}`} />
          <span className="mono">{i + 1}/{QUIZ.length}</span>
          <span className="chip good" aria-label="Correct answers"><Icon name="check" /><span className="mono">{score}</span></span>
        </div>
        {skip && <p className="note">Skip-ahead quiz: pass it to unlock “{lv.title}”.</p>}
        <p className="eyebrow">{c.name}</p>
        <h2>{q.q}</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {q.o.map((t, n) => {
            const cls = picked === null ? '' : n === q.a ? 'right' : n === picked ? 'wrong' : '';
            return (
              <button key={t} className={`opt ${cls}`} type="button" disabled={picked !== null} onClick={() => choose(n)}>
                <span className="mark">{cls === 'right' ? <Icon name="check" /> : cls === 'wrong' ? <Icon name="x" /> : 'ABCD'[n]}</span>
                {t}
              </button>
            );
          })}
        </div>
        <div aria-live="polite" style={{ display: 'grid', gap: 12 }}>
          {picked !== null && (
            <>
              <div className={`feedback ${picked === q.a ? 'good' : 'bad'}`}>
                <Icon name={picked === q.a ? 'check' : 'x'} />
                <span><b>{picked === q.a ? 'Correct.' : 'Not quite.'}</b> {q.why}</span>
              </div>
              <button className="btn primary big" type="button" onClick={next} ref={nextBtn}>
                {i + 1 < QUIZ.length ? 'Next question' : 'See my score'} <Icon name="arrow" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
