/* Final chapter: build a first model in four guided steps. The training is real gradient descent. */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROJECT_FLAT } from '../data/content.js';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { hash } from '../components/map/geometry.js';
import Icon from '../components/Icon.jsx';
import { Crumb, PageTitle, Spinner } from '../components/ui.jsx';

// 16 students: [hours studied, exam score out of 12]
const DATA = [[0.5, 1.9], [1, 2.4], [1.5, 3.4], [2, 3.2], [2.5, 4.4], [3, 4.1], [3.5, 5.2], [4, 5.6], [4.5, 5.5], [5, 6.4], [5.5, 6.2], [6, 7.3], [7, 7.5], [8, 8.6], [9, 9.0], [10, 10.1]];
// A fixed shuffle so the train/test split is the same on every visit.
const ORDER = DATA.map((d, i) => [hash(i, 7), d]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
const NAMES = ['Data', 'Train', 'Test', 'Predict'];
const EPOCHS = 150;
const RATES = [[0.05, 'Small step'], [0.5, 'Good step'], [1.0, 'Too big']];

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

export default function Project() {
  const { player, finishLevel } = usePlayer();
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [split, setSplit] = useState(75);
  const [lr, setLr] = useState(0.5);
  const [model, setModel] = useState({ w: 0, b: 0 });
  const [losses, setLosses] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | training | trained | blown
  const [hours, setHours] = useState(6);
  const [busy, setBusy] = useState(false);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  if (player.progress < PROJECT_FLAT) {
    return (
      <>
        <Crumb parts={[['Roadmap', '/roadmap'], ['Build Your First Model']]} />
        <section className="panel" style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
          <p className="eyebrow">Locked</p>
          <h2>The summit is still in the clouds</h2>
          <p className="muted">Finish every level of the five chapters to open the final project.</p>
        </section>
      </>
    );
  }

  const cut = Math.round((ORDER.length * split) / 100);
  const trainSet = ORDER.slice(0, cut);
  const testSet = ORDER.slice(cut);
  const predict = (x) => model.b + model.w * (x / 10);
  const trained = status === 'trained';

  const train = () => {
    cancelAnimationFrame(raf.current);
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
        trainSet.forEach(([x, y]) => {
          const err = b + w * (x / 10) - y;
          loss += err * err;
          gw += 2 * err * (x / 10);
          gb += 2 * err;
        });
        w -= (lr * gw) / trainSet.length;
        b -= (lr * gb) / trainSet.length;
        hist.push(loss / trainSet.length);
        if (!Number.isFinite(loss) || loss / trainSet.length > 1e4) e = EPOCHS + 1;
      }
      setLosses([...hist]);
      if (e < EPOCHS) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      const blown = e > EPOCHS;
      setModel({ w, b });
      setStatus(blown ? 'blown' : 'trained');
    };
    raf.current = requestAnimationFrame(tick);
  };

  const finish = async () => {
    setBusy(true);
    try {
      const r = await finishLevel(PROJECT_FLAT);
      toast(r.gained ? `First model built! +${r.gained} XP` : 'Project replayed. Nice model!', { icon: 'model' });
      navigate(r.gained ? '/roadmap' : '/profile');
    } catch {
      toast('Could not save your progress. Try again.', { icon: 'x', tone: 'bad' });
      setBusy(false);
    }
  };

  const canOpen = (i) => i <= step || (trained && i >= 2);
  const next = (label, enabled = true) => (
    <div className="actions">
      <button className="btn primary big" type="button" disabled={!enabled} onClick={() => setStep(step + 1)}>{label} <Icon name="arrow" /></button>
    </div>
  );

  let body;
  if (step === 0) {
    body = (
      <>
        <h2>Look at the data, then split it</h2>
        <p className="muted">16 students: hours studied and exam score. The model learns on the training part and is judged on the part it never saw.</p>
        <div className="two">
          <div className="scroll-x">
            <table className="data">
              <thead><tr><th>Hours</th><th>Score</th></tr></thead>
              <tbody>
                {DATA.slice(0, 6).map((d) => <tr key={d[0]}><td>{d[0]}</td><td>{d[1]}</td></tr>)}
                <tr><td colSpan="2" className="muted">and 10 more rows</td></tr>
              </tbody>
            </table>
          </div>
          <div className="slider">
            <label htmlFor="sp">Training share <span className="mono">{split}%</span></label>
            <input id="sp" type="range" min="50" max="90" step="5" value={split} onChange={(e) => { setSplit(+e.target.value); setStatus('idle'); setLosses([]); }} />
            <p className="muted">{trainSet.length} rows to train, {testSet.length} rows to test.</p>
          </div>
        </div>
        {next('Go to training')}
      </>
    );
  } else if (step === 1) {
    body = (
      <>
        <h2>Train with gradient descent</h2>
        <p className="muted">Pick a learning rate, then train for {EPOCHS} epochs.</p>
        <div className="pick">
          {RATES.map(([v, t]) => (
            <button key={v} type="button" className={v === lr ? 'on' : ''} aria-pressed={v === lr} onClick={() => { setLr(v); setStatus('idle'); setLosses([]); }}>
              {t} <span className="mono">{v}</span>
            </button>
          ))}
        </div>
        <div className="actions">
          <button className="btn moss big" type="button" onClick={train} disabled={status === 'training'}>{status === 'training' && <Spinner />}Train</button>
        </div>
        <LossPlot losses={losses} />
        {status === 'blown' && <div className="feedback bad"><Icon name="x" /><span><b>The loss exploded.</b> This step is too big, so each update overshoots. Pick a smaller learning rate.</span></div>}
        {trained && <div className="feedback good"><Icon name="check" /><span><b>Training finished.</b> Your model: score = {model.w.toFixed(2)} × (hours ÷ 10) + {model.b.toFixed(2)}.</span></div>}
        {next('Test the model', trained)}
      </>
    );
  } else if (step === 2) {
    const mae = testSet.reduce((s, [x, y]) => s + Math.abs(predict(x) - y), 0) / testSet.length;
    const mean = testSet.reduce((s, d) => s + d[1], 0) / testSet.length;
    const ssr = testSet.reduce((s, [x, y]) => s + (predict(x) - y) ** 2, 0);
    const sst = testSet.reduce((s, d) => s + (d[1] - mean) ** 2, 0);
    body = (
      <>
        <h2>Test on data it never saw</h2>
        <div className="stats" style={{ gridTemplateColumns: 'repeat(2,minmax(0,1fr))' }}>
          <div className="stat"><b className="mono">{mae.toFixed(2)}</b><span>Mean absolute error, in exam points</span></div>
          <div className="stat"><b className="mono">{(1 - ssr / sst).toFixed(2)}</b><span>R² score, where 1 is a perfect fit</span></div>
        </div>
        <div className="scroll-x">
          <table className="data">
            <thead><tr><th>Hours</th><th>Real score</th><th>Predicted</th></tr></thead>
            <tbody>{testSet.map(([x, y]) => <tr key={x}><td>{x}</td><td>{y}</td><td>{predict(x).toFixed(1)}</td></tr>)}</tbody>
          </table>
        </div>
        {next('Make a prediction')}
      </>
    );
  } else {
    body = (
      <>
        <h2>Use your model</h2>
        <div className="slider">
          <label htmlFor="hr">Hours studied <span className="mono">{hours}</span></label>
          <input id="hr" type="range" min="0" max="12" step="0.5" value={hours} onChange={(e) => setHours(+e.target.value)} />
        </div>
        <div className="formula">Predicted score: <em>{predict(hours).toFixed(1)}</em></div>
        <div className="actions">
          <button className="btn moss big" type="button" onClick={finish} disabled={busy}>{busy && <Spinner />}Finish the project</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Crumb parts={[['Roadmap', '/roadmap'], ['Build Your First Model']]} />
      <PageTitle eyebrow="Final chapter" title="Build Your First Model" />
      <div className="steps" role="group" aria-label="Project steps">
        {NAMES.map((t, i) => (
          <button key={t} type="button" className={i === step ? 'on' : i < step ? 'done' : ''} disabled={!canOpen(i)} aria-current={i === step ? 'step' : undefined} onClick={() => setStep(i)}>
            <span className="mono">{i < step ? '✓' : i + 1}</span>
            {t}
          </button>
        ))}
      </div>
      <section className="panel" style={{ display: 'grid', gap: 14 }}>{body}</section>
    </>
  );
}
