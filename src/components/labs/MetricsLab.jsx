/* Chapter 5: a spam filter. Pick the threshold and read accuracy, precision and the confusion matrix. */
import { useEffect, useState } from 'react';
import Icon from '../Icon.jsx';

// [spam score given by the model, really spam?]
const EMAILS = [
  [0.95, 1], [0.91, 1], [0.88, 1], [0.84, 1], [0.77, 1], [0.71, 1], [0.62, 1], [0.45, 1],
  [0.69, 0], [0.55, 0], [0.41, 0], [0.36, 0], [0.3, 0], [0.24, 0], [0.18, 0], [0.15, 0], [0.11, 0], [0.08, 0], [0.05, 0], [0.03, 0],
];
const pct = (v) => `${Math.round(v * 100)}%`;

export default function MetricsLab({ level, onSolved }) {
  const [t, setT] = useState(0.3);
  let tp = 0, fp = 0, tn = 0, fn = 0;
  EMAILS.forEach(([s, spam]) => {
    const flagged = s >= t;
    if (flagged && spam) tp++;
    else if (flagged) fp++;
    else if (spam) fn++;
    else tn++;
  });
  const accuracy = (tp + tn) / EMAILS.length;
  const precision = tp + fp ? tp / (tp + fp) : 0;
  const recall = tp / (tp + fn);
  const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;
  const metric = level.metric || 'accuracy';
  const value = { accuracy, precision, recall, f1 }[metric];
  const ok = value >= level.goal;
  useEffect(() => onSolved(ok), [ok, onSolved]);

  const goalText = metric === 'f1' ? `an F1 score of ${level.goal} or more` : `${metric} of ${pct(level.goal)}${level.goal < 1 ? ' or more' : ''}`;
  const extra = metric === 'recall' || metric === 'f1';

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">flag as spam if score ≥ <em>{t.toFixed(2)}</em></div>
        <div className="slider">
          <label htmlFor="th">Threshold <span className="mono">{t.toFixed(2)}</span></label>
          <input id="th" type="range" min="0" max="1" step="0.01" value={t} onChange={(e) => setT(+e.target.value)} />
        </div>
        <div className="stats" style={{ gridTemplateColumns: 'repeat(2,minmax(0,1fr))' }}>
          <div className="stat"><b className="mono">{pct(accuracy)}</b><span>Accuracy: right answers</span></div>
          <div className="stat"><b className="mono">{tp + fp ? pct(precision) : '–'}</b><span>Precision: flagged that really were spam</span></div>
          {extra && <div className="stat"><b className="mono">{pct(recall)}</b><span>Recall: spam that was caught</span></div>}
          {extra && <div className="stat"><b className="mono">{f1.toFixed(2)}</b><span>F1: balance of precision and recall</span></div>}
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p><b>Mini-exercise.</b> Find a threshold with {goalText}.</p>
          <span className={`chip ${ok ? 'good' : 'warn'}`} style={{ justifySelf: 'start' }}>{ok ? <><Icon name="check" /> Goal reached</> : 'Not yet: keep moving the threshold'}</span>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 12 }}>
        <h3>Twenty emails, sorted by spam score</h3>
        <svg className="plot" viewBox="0 0 540 150" role="img" aria-label={`Twenty emails on a score line with the threshold at ${t.toFixed(2)}`} fontFamily="'Atkinson Hyperlegible',Verdana,sans-serif">
          <line x1="20" x2="520" y1="90" y2="90" stroke="#2E2118" strokeWidth="2" />
          {[0, 0.25, 0.5, 0.75, 1].map((v) => <text key={v} x={20 + v * 500} y="112" textAnchor="middle" fontSize="12" fill="#5E4C3D">{v}</text>)}
          <rect x={20 + t * 500} y="20" width={500 - t * 500} height="70" fill="#F3D9C7" opacity=".6" />
          <line x1={20 + t * 500} x2={20 + t * 500} y1="14" y2="96" stroke="#A84F32" strokeWidth="3" />
          <text x={20 + t * 500 + 6} y="30" fontSize="12" fontWeight="700" fill="#7E3820">flagged</text>
          {EMAILS.map(([s, spam], i) => (
            <rect key={i} x={20 + s * 500 - 6} y={spam ? 48 : 68} width="12" height="14" rx="2" fill={spam ? '#A84F32' : '#5F6D32'} stroke="#FBF6EB" />
          ))}
          <text x="270" y="140" textAnchor="middle" fontSize="12" fill="#5E4C3D">Spam score given by the model</text>
        </svg>
        <div className="legend"><span><i style={{ background: '#A84F32' }} />Really spam</span><span><i style={{ background: '#5F6D32' }} />Real email</span></div>
        <div className="matrix" aria-label="Confusion matrix">
          <div className="h" />
          <div className="h">Flagged</div>
          <div className="h">Not flagged</div>
          <div className="h">Spam</div>
          <div className="good">{tp} caught</div>
          <div className="bad">{fn} missed</div>
          <div className="h">Real email</div>
          <div className="bad">{fp} wrongly flagged</div>
          <div className="good">{tn} let through</div>
        </div>
      </section>
    </div>
  );
}
