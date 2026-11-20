/* Ch. 6, level 4 — Recall and F1: compute both by hand at threshold 0.6, then catch every spam
   and see what it costs in precision. */
import { useEffect, useState } from 'react';
import { Choice, Goal, Hint, NumberCheck, isClose } from '../common.jsx';
import { EmailStrip, Threshold, confusion, pct } from './data.jsx';

const HAND_T = 0.6;
const HAND = confusion(HAND_T); // TP 7, FP 1, FN 1 → recall 0.875, F1 0.875

export default function RecallLab({ onSolved }) {
  const [r, setR] = useState('');
  const [f, setF] = useState('');
  const [t, setT] = useState(0.8);
  const [cost, setCost] = useState(null);
  const [tries, setTries] = useState(0);
  const bump = () => setTries((x) => x + 1);
  const c = confusion(t);
  const handOk = isClose(r, HAND.recall, 0.01) && isClose(f, HAND.f1, 0.01);
  const allCaught = c.recall === 1;
  const ok = handOk && allCaught && cost === 'precision';
  useEffect(() => onSolved(ok), [ok, onSolved]);

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">recall = TP / (TP + FN)</div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 1.</b> At threshold {HAND_T}: TP = {HAND.tp}, FP = {HAND.fp}, FN = {HAND.fn}. Compute the recall,
            then F1 = 2·P·R / (P + R) with precision P = {HAND.precision.toFixed(3)}.
          </p>
          <div className="num-grid">
            <NumberCheck id="rec" label="recall" expected={HAND.recall} value={r} onChange={setR} onTry={bump} />
            <NumberCheck id="f1" label="F1" expected={HAND.f1} value={f} onChange={setF} onTry={bump} />
          </div>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 2.</b> Now catch <b>every</b> spam email (recall = 100%).
          </p>
          <Threshold t={t} setT={setT} />
          <div className="readout">
            <span className="mono">
              recall {pct(c.recall)} · precision {pct(c.precision)} · F1 {c.f1.toFixed(2)}
            </span>
          </div>
          {allCaught && (
            <>
              <p style={{ fontWeight: 700 }}>All spam caught. What did it cost?</p>
              <Choice
                label="Cost of catching every spam"
                options={[
                  ['nothing', 'Nothing'],
                  ['precision', 'More false alarms: precision fell'],
                  ['recall', 'Recall fell'],
                ]}
                answer="precision"
                value={cost}
                onPick={(v) => {
                  setCost(v);
                  if (v !== 'precision') bump();
                }}
              />
            </>
          )}
          <Goal
            ok={ok}
            text={!handOk ? 'Compute recall and F1' : !allCaught ? 'Some spam still gets through' : 'What did it cost?'}
          />
          <Hint tries={tries}>
            Recall = 7 ÷ (7 + 1). With P = R, F1 = P. For step 2, find the spam email with the lowest score.
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Spam caught (outlined red tiles)</h3>
        <EmailStrip t={t} label={`Emails by spam score, threshold ${t.toFixed(2)}, recall ${pct(c.recall)}`} />
        <p className="muted">Every red tile left of the line is a spam that slipped through: a false negative.</p>
      </section>
    </div>
  );
}
