/* Final chapter: Build Your First Model, in six steps. Each step is one tile on the map (/project/1 … /project/6).
   The choices made along the way (cleaning, split, learning rate, trained model) are saved in player.project. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { CHAPTERS, FINAL_CHAPTER, PROJECT_START, XP_PER_LEVEL, levelPath } from '../data/content.js';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { stateOf } from '../services/game.js';
import { hash } from '../components/map/geometry.js';
import Icon from '../components/Icon.jsx';
import { Crumb, Spinner } from '../components/ui.jsx';

const CHAPTER = CHAPTERS[FINAL_CHAPTER];
const STEPS = CHAPTER.levels.length;

// Raw data: [student, hours studied, exam score out of 12]. Row 7 has no score; row 12 has a typo (85 for 8.5).
const RAW = [
  ['S01', 0.5, 1.9], ['S02', 1, 2.4], ['S03', 1.5, 3.4], ['S04', 2, 3.2], ['S05', 2.5, 4.4], ['S06', 3, 4.1], ['S07', 3.5, null], ['S08', 4, 5.6],
  ['S09', 4.5, 5.5], ['S10', 5, 6.4], ['S11', 5.5, 6.2], ['S12', 6, 85], ['S13', 7, 7.5], ['S14', 8, 8.6], ['S15', 9, 9.0], ['S16', 10, 10.1],
];
const SCORES_OK = RAW.filter((r) => r[2] !== null && r[2] <= 12).map((r) => r[2]);
const MEAN_SCORE = +(SCORES_OK.reduce((s, v) => s + v, 0) / SCORES_OK.length).toFixed(1);
function cleanData(fixMissing, fixTypo) {
  return RAW.map(([id, x, y]) => {
    if (y === null) return [id, x, fixMissing ? MEAN_SCORE : null];
    if (y > 12) return [id, x, fixTypo ? y / 10 : y];
    return [id, x, y];
  });
}
const CLEAN = cleanData(true, true).map((r) => [r[1], r[2]]);
const ORDER = CLEAN.map((d, i) => [hash(i, 7), d]).sort((a, b) => a[0] - b[0]).map((p) => p[1]); // fixed shuffle
const splitData = (share) => {
  const cut = Math.round((ORDER.length * share) / 100);
  return [ORDER.slice(0, cut), ORDER.slice(cut)];
};
const DEFAULTS = { cleaned: false, split: 75, lr: 0.5, w: null, b: null };
const EPOCHS = 150;
const RATES = [[0.05, 'Small step'], [0.5, 'Good step'], [1.0, 'Too big']];

const chip = (ok, msg) => (
  <span className={`chip ${ok ? 'good' : 'warn'}`} style={{ justifySelf: 'start' }}>{ok ? <><Icon name="check" /> Step goal reached</> : msg}</span>
);

/* ---------- Step 1: the problem ---------- */
const CHECKS = [
  { q: 'What does the model predict (the label)?', o: ['The exam score', 'The hours studied', 'The student ID'], a: 0 },
  { q: 'What does it use to predict it (the feature)?', o: ['The exam score', 'The hours studied', 'The student ID'], a: 1 },
];
function StepProblem({ onReady }) {
  const [answers, setAnswers] = useState([null, null]);
  const ok = answers.every((v, i) => v === CHECKS[i].a);
  useEffect(() => onReady(ok, {}), [ok, onReady]);
  return (
    <>
      <div className="panel" style={{ display: 'grid', gap: 8 }}>
        <h3>The brief</h3>
        <p>“We have the study hours and exam scores of 16 students from last year. We want a tool that predicts a student&apos;s score from how long they studied, so teachers can warn students early.”</p>
      </div>
      {CHECKS.map((c, qi) => (
        <fieldset key={c.q} className="panel" style={{ display: 'grid', gap: 8, border: '1.5px solid #DCCBA9' }}>
          <legend style={{ fontWeight: 700, padding: '0 6px' }}>{c.q}</legend>
          <div className="pick">
            {c.o.map((o, oi) => {
              const picked = answers[qi] === oi;
              return (
                <button key={o} type="button" className={picked ? 'on' : ''} aria-pressed={picked} onClick={() => setAnswers(answers.map((v, i) => (i === qi ? oi : v)))}>
                  {o}{picked && (oi === c.a ? ' ✓' : ' ✗')}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
      {chip(ok, 'Answer both questions correctly')}
    </>
  );
}

/* ---------- Step 2: explore and clean ---------- */
const DX = (x) => 50 + (x / 10.5) * 450;
const DY = (y) => 250 - (Math.min(y, 13) / 13) * 220;
function StepClean({ saved, onReady }) {
  const [fixMissing, setFixMissing] = useState(saved.cleaned);
  const [fixTypo, setFixTypo] = useState(saved.cleaned);
  const data = cleanData(fixMissing, fixTypo);
  const ok = fixMissing && fixTypo;
  useEffect(() => onReady(ok, { cleaned: ok }), [ok, onReady]);
  return (
    <>
      <div className="two">
        <div className="scroll-x">
          <table className="data">
            <thead><tr><th>Student</th><th>Hours</th><th>Score</th></tr></thead>
            <tbody>
              {data.map(([id, x, y]) => (
                <tr key={id} className={y === null || y > 12 ? 'me' : ''}>
                  <td>{id}</td><td>{x}</td><td>{y === null ? 'missing' : y}{y !== null && y > 12 ? ' (impossible: max is 12)' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
          <svg className="plot" viewBox="0 0 520 280" role="img" aria-label="Scatter plot of the raw data" fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif">
            <rect x="50" y="30" width="450" height="220" fill="#FBF6EB" />
            {data.filter((r) => r[2] !== null).map(([id, x, y]) => (
              <circle key={id} cx={DX(x)} cy={DY(y)} r="7" fill={y > 12 ? '#A84F32' : '#5F6D32'} stroke="#FBF6EB" strokeWidth="2" />
            ))}
            {data.some((r) => r[2] > 12) && <text x={DX(6) + 12} y={DY(13) + 14} fontSize="12" fontWeight="700" fill="#7E3820">score 85?!</text>}
            <text x="275" y="272" textAnchor="middle" fontSize="12" fill="#5E4C3D">Hours studied</text>
            <text x="50" y="22" fontSize="12" fontWeight="700" fill="#2E2118">Exam score</text>
          </svg>
          <div className="actions">
            <button className="btn" type="button" disabled={fixMissing} onClick={() => setFixMissing(true)}>Fill the missing score with the average ({MEAN_SCORE})</button>
            <button className="btn" type="button" disabled={fixTypo} onClick={() => setFixTypo(true)}>Fix the typo: 85 → 8.5</button>
          </div>
        </div>
      </div>
      {chip(ok, 'Fix the two problems in the data')}
    </>
  );
}

/* ---------- Step 3: split ---------- */
function StepSplit({ saved, onReady }) {
  const [split, setSplit] = useState(saved.split);
  const [train, test] = splitData(split);
  const ok = split >= 60 && split <= 85;
  useEffect(() => onReady(ok, { split }), [ok, split, onReady]);
  return (
    <>
      <div className="slider">
        <label htmlFor="sp">Training share <span className="mono">{split}%</span></label>
        <input id="sp" type="range" min="40" max="95" step="5" value={split} onChange={(e) => setSplit(+e.target.value)} />
      </div>
      <p className="muted">{train.length} rows to train, {test.length} rows to test. Too little training data and the model learns badly; too little test data and the score means little.</p>
      <div className="panel" style={{ display: 'flex', height: 34, padding: 0, overflow: 'hidden' }} aria-hidden="true">
        <div style={{ width: `${split}%`, background: '#5F6D32' }} />
        <div style={{ flex: 1, background: '#A84F32' }} />
      </div>
      <div className="legend"><span><i style={{ background: '#5F6D32' }} />Training set</span><span><i style={{ background: '#A84F32' }} />Test set</span></div>
      {chip(ok, 'Keep between 60% and 85% for training')}
    </>
  );
}

/* ---------- Step 4: train ---------- */
function LossPlot({ losses }) {
  if (!losses.length) return <p className="muted">Press Train to watch the loss fall.</p>;
  const max = Math.max(losses[0], 1);
  const pts = losses.map((l, i) => `${40 + (i / EPOCHS) * 460},${200 - Math.min(l / max, 1.05) * 170}`).join(' ');
  const last = losses[losses.length - 1];
  return (
    <svg className="plot" viewBox="0 0 520 232" role="img" aria-label="Training loss over epochs" fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif" style={{ maxWidth: 640 }}>
      <line x1="40" x2="500" y1="200" y2="200" stroke="#2E2118" strokeWidth="2" />
      <line x1="40" x2="40" y1="20" y2="200" stroke="#2E2118" strokeWidth="2" />
      <polyline points={pts} fill="none" stroke="#A84F32" strokeWidth="3.5" strokeLinejoin="round" />
      <text x="270" y="224" textAnchor="middle" fontSize="13" fill="#5E4C3D">Epochs (0 to {EPOCHS})</text>
      <text x="500" y="20" textAnchor="end" fontSize="14" fontWeight="700" fill="#2E2118">Loss: {Number.isFinite(last) && last < 1e6 ? last.toFixed(2) : 'exploded'}</text>
    </svg>
  );
}
function StepTrain({ saved, onReady }) {
  const [lr, setLr] = useState(saved.lr);
  const [losses, setLosses] = useState([]);
  const [model, setModel] = useState(saved.w !== null ? { w: saved.w, b: saved.b } : null);
  const [status, setStatus] = useState(saved.w !== null ? 'trained' : 'idle');
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const ok = status === 'trained';
  useEffect(() => onReady(ok, ok ? { lr, w: model.w, b: model.b } : {}), [ok, lr, model, onReady]);

  const train = () => {
    cancelAnimationFrame(raf.current);
    const [set] = splitData(saved.split);
    let w = 0;
    let b = 0;
    let e = 0;
    const hist = [];
    setStatus('training');
    const tick = () => {
      for (let s = 0; s < 3 && e < EPOCHS; s++, e++) {
        let gw = 0;
        let gb = 0;
        let loss = 0;
        set.forEach(([x, y]) => {
          const err = b + w * (x / 10) - y;
          loss += err * err;
          gw += 2 * err * (x / 10);
          gb += 2 * err;
        });
        w -= (lr * gw) / set.length;
        b -= (lr * gb) / set.length;
        hist.push(loss / set.length);
        if (!Number.isFinite(loss) || loss / set.length > 1e4) e = EPOCHS + 1;
      }
      setLosses([...hist]);
      if (e < EPOCHS) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      const blown = e > EPOCHS;
      setModel(blown ? null : { w, b });
      setStatus(blown ? 'blown' : 'trained');
    };
    raf.current = requestAnimationFrame(tick);
  };

  return (
    <>
      <p className="muted">The model is score = w × (hours ÷ 10) + b. Hours are divided by 10 so both numbers learn at a similar pace.</p>
      <div className="pick">
        {RATES.map(([v, t]) => (
          <button key={v} type="button" className={v === lr ? 'on' : ''} aria-pressed={v === lr} onClick={() => { setLr(v); setStatus('idle'); setLosses([]); setModel(null); }}>
            {t} <span className="mono">{v}</span>
          </button>
        ))}
      </div>
      <div className="actions">
        <button className="btn moss big" type="button" onClick={train} disabled={status === 'training'}>{status === 'training' && <Spinner />}Train</button>
      </div>
      <LossPlot losses={losses} />
      {status === 'blown' && <div className="feedback bad"><Icon name="x" /><span><b>The loss exploded.</b> This step is too big, so each update overshoots. Pick a smaller learning rate.</span></div>}
      {ok && <div className="feedback good"><Icon name="check" /><span><b>Trained.</b> Your model: score = {model.w.toFixed(2)} × (hours ÷ 10) + {model.b.toFixed(2)}.</span></div>}
      {chip(ok, 'Train a model that converges')}
    </>
  );
}

/* ---------- Step 5: evaluate ---------- */
function StepEvaluate({ saved, onReady }) {
  const [answer, setAnswer] = useState(null);
  const [train, test] = splitData(saved.split);
  const predict = (x) => saved.b + saved.w * (x / 10);
  const base = train.reduce((s, d) => s + d[1], 0) / train.length;
  const mae = test.reduce((s, [x, y]) => s + Math.abs(predict(x) - y), 0) / test.length;
  const baseMae = test.reduce((s, [, y]) => s + Math.abs(base - y), 0) / test.length;
  const mean = test.reduce((s, d) => s + d[1], 0) / test.length;
  const r2 = 1 - test.reduce((s, [x, y]) => s + (predict(x) - y) ** 2, 0) / test.reduce((s, d) => s + (d[1] - mean) ** 2, 0);
  const better = mae < baseMae;
  const ok = answer !== null && answer === better;
  useEffect(() => onReady(ok, {}), [ok, onReady]);
  return (
    <>
      <div className="stats">
        <div className="stat"><b className="mono">{mae.toFixed(2)}</b><span>Your model: average error (MAE)</span></div>
        <div className="stat"><b className="mono">{baseMae.toFixed(2)}</b><span>Baseline (always {base.toFixed(1)}): MAE</span></div>
        <div className="stat"><b className="mono">{r2.toFixed(2)}</b><span>R² on the test set (1 = perfect)</span></div>
        <div className="stat"><b className="mono">{test.length}</b><span>Test rows, never seen in training</span></div>
      </div>
      <div className="scroll-x">
        <table className="data">
          <thead><tr><th>Hours</th><th>Real score</th><th>Your model</th><th>Baseline</th></tr></thead>
          <tbody>{test.map(([x, y]) => <tr key={x}><td>{x}</td><td>{y}</td><td>{predict(x).toFixed(1)}</td><td>{base.toFixed(1)}</td></tr>)}</tbody>
        </table>
      </div>
      <fieldset className="panel" style={{ display: 'grid', gap: 8, border: '1.5px solid #DCCBA9' }}>
        <legend style={{ fontWeight: 700, padding: '0 6px' }}>Is your model better than the baseline?</legend>
        <div className="pick">
          {[[true, 'Yes, its error is lower'], [false, 'No, the baseline does as well or better']].map(([v, t]) => (
            <button key={t} type="button" className={answer === v ? 'on' : ''} aria-pressed={answer === v} onClick={() => setAnswer(v)}>{t}{answer === v && (v === better ? ' ✓' : ' ✗')}</button>
          ))}
        </div>
      </fieldset>
      {chip(ok, 'Compare the two errors and answer')}
    </>
  );
}

/* ---------- Step 6: predict and share ---------- */
function StepShare({ saved, player, onReady }) {
  const [hours, setHours] = useState(6);
  const [, test] = splitData(saved.split);
  const predict = (x) => saved.b + saved.w * (x / 10);
  const mae = test.reduce((s, [x, y]) => s + Math.abs(predict(x) - y), 0) / test.length;
  useEffect(() => onReady(true, {}), [onReady]);
  return (
    <>
      <div className="slider">
        <label htmlFor="hr">Hours studied <span className="mono">{hours}</span></label>
        <input id="hr" type="range" min="0" max="12" step="0.5" value={hours} onChange={(e) => setHours(+e.target.value)} />
      </div>
      <div className="formula">Predicted score: <em>{Math.max(0, Math.min(12, predict(hours))).toFixed(1)}</em> / 12</div>
      <article className="panel model-card" aria-label="Model card">
        <p className="eyebrow">Model card</p>
        <h3>Exam score predictor</h3>
        <dl>
          <dt>Built by</dt><dd>{player.name}, on NeuroPath</dd>
          <dt>Task</dt><dd>Predict an exam score (0–12) from hours studied</dd>
          <dt>Data</dt><dd>16 students; 1 missing score filled with the average, 1 typo corrected; {saved.split}% used for training</dd>
          <dt>Method</dt><dd>Linear regression trained with gradient descent ({EPOCHS} epochs, learning rate {saved.lr})</dd>
          <dt>Model</dt><dd className="mono">score = {saved.w.toFixed(2)} × hours/10 + {saved.b.toFixed(2)}</dd>
          <dt>Test error</dt><dd>About {mae.toFixed(1)} points on average</dd>
          <dt>Limits</dt><dd>Tiny dataset; ignores sleep, attendance and everything else; predictions above 12 hours are guesses.</dd>
        </dl>
      </article>
      {chip(true, '')}
    </>
  );
}

const STEP_VIEWS = [StepProblem, StepClean, StepSplit, StepTrain, StepEvaluate, StepShare];

export default function Project() {
  const { step: param } = useParams();
  const { player, finishLevel } = usePlayer();
  const toast = useToast();
  const navigate = useNavigate();
  const [ready, setReady] = useState({ ok: false, patch: {} });
  const [busy, setBusy] = useState(false);
  const onReady = useMemo(() => (ok, patch) => setReady((r) => (r.ok === ok && JSON.stringify(r.patch) === JSON.stringify(patch) ? r : { ok, patch })), []);

  const step = Number(param);
  if (!Number.isInteger(step) || step < 1 || step > STEPS) return <Navigate to={levelPath(PROJECT_START)} replace />;
  const flat = PROJECT_START + step - 1;
  const lv = CHAPTER.levels[step - 1];
  const st = stateOf(player.progress, flat);
  const saved = { ...DEFAULTS, ...(player.project || {}) };
  const crumb = <Crumb parts={[['Roadmap', '/roadmap'], [CHAPTER.name, `/chapter/${FINAL_CHAPTER}`], [`Step ${step}: ${lv.title}`]]} />;

  if (st === 'locked') {
    return (
      <>
        {crumb}
        <section className="panel" style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
          <p className="eyebrow">Locked</p>
          <h2>{step === 1 ? 'The summit is still in the clouds' : `Step ${step} is not open yet`}</h2>
          <p className="muted">{step === 1 ? 'Finish every level of the six chapters to open the final project.' : 'Finish the previous step first: each step builds on the one before.'}</p>
          {player.progress >= PROJECT_START && <Link className="btn primary" to={levelPath(player.progress)}>Go to my current step</Link>}
        </section>
      </>
    );
  }
  // Steps after training need a trained model; if it is missing (old save), send the learner back to training.
  if (step >= 5 && saved.w === null) {
    return (
      <>
        {crumb}
        <section className="panel" style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
          <h2>No trained model yet</h2>
          <p className="muted">Train your model in step 4 first.</p>
          <Link className="btn primary" to={levelPath(PROJECT_START + 3)}>Go to step 4</Link>
        </section>
      </>
    );
  }

  const View = STEP_VIEWS[step - 1];
  const complete = async () => {
    setBusy(true);
    try {
      const r = await finishLevel(flat, { patch: { project: { ...saved, ...ready.patch } } });
      if (r.gained) toast(step === STEPS ? `First model built! +${r.gained} XP` : `Step ${step} done. +${r.gained} XP`, { icon: step === STEPS ? 'model' : 'bolt' });
      else toast('Saved.', { icon: 'check' });
      navigate(r.gained ? '/roadmap' : step < STEPS ? levelPath(flat + 1) : '/profile');
    } catch {
      toast('Could not save your progress. Try again.', { icon: 'x', tone: 'bad' });
      setBusy(false);
    }
  };

  return (
    <>
      {crumb}
      <div className="seg" aria-label={`Step ${step} of ${STEPS}`}>
        {CHAPTER.levels.map((_, i) => <i key={i} className={i < step ? 'on' : ''} />)}
      </div>
      <div style={{ display: 'grid', gap: 10, maxWidth: '72ch' }}>
        <p className="eyebrow">Final project, step {step} of {STEPS}</p>
        <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>{lv.title}</h1>
        <p>{lv.text}</p>
        <p className="key"><b>Remember:</b> {lv.key}</p>
      </div>
      <section className="panel" style={{ display: 'grid', gap: 14 }}>
        <View key={step} saved={saved} player={player} onReady={onReady} />
      </section>
      <div className="actions">
        <button className="btn moss big" type="button" disabled={!ready.ok || busy} onClick={complete}>
          {busy && <Spinner />}
          {st === 'done' ? (step < STEPS ? 'Save and go to the next step' : 'Save') : step === STEPS ? `Finish the project (+${XP_PER_LEVEL} XP)` : `Complete step ${step} (+${XP_PER_LEVEL} XP)`}
        </button>
        <Link className="btn big" to="/roadmap">Back to the map</Link>
      </div>
    </>
  );
}
