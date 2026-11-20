/* Ch. 6, level 3 — Precision: compute it by hand at threshold 0.5, then find the LOWEST threshold
   that still gives 100% precision (no normal email in the spam folder, as much spam as possible caught). */
import { useEffect, useState } from 'react';
import { Goal, Hint, NumberCheck, isClose } from '../common.jsx';
import { EmailStrip, Threshold, confusion, pct } from './data.jsx';

const HAND_T = 0.5;
const HAND = confusion(HAND_T); // 7 / 9
const BEST_T = 0.71; // the highest normal email scores 0.69; the next spam is 0.71

export default function PrecisionLab({ onSolved }) {
  const [p, setP] = useState('');
  const [t, setT] = useState(0.3);
  const [tries, setTries] = useState(0);
  const c = confusion(t);
  const handOk = isClose(p, HAND.precision, 0.01);
  const pureOk = c.precision === 1 && t <= BEST_T;
  const ok = handOk && pureOk;
  useEffect(() => onSolved(ok), [ok, onSolved]);

  return (
    <div className="lesson">
      <section className="lab">
        <div className="formula">precision = TP / (TP + FP)</div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 1.</b> At threshold {HAND_T}, the filter flags {HAND.tp + HAND.fp} emails and {HAND.tp} of them are
            spam. Compute the precision (2 decimals).
          </p>
          <NumberCheck
            id="prec"
            label="precision at 0.5"
            expected={HAND.precision}
            value={p}
            onChange={setP}
            onTry={() => setTries((x) => x + 1)}
          />
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 2.</b> Your users hate losing real emails. Find the <b>lowest</b> threshold with a precision of
            100%: no false alarm, but as many spam caught as possible.
          </p>
          <Threshold t={t} setT={setT} />
          <div className="readout">
            <span className="mono">
              flagged {c.tp + c.fp} · spam caught {c.tp}/8 · precision {pct(c.precision)}
            </span>
          </div>
          <Goal
            ok={ok}
            text={
              !handOk
                ? 'Compute the precision first'
                : c.precision < 1
                  ? 'A normal email is still flagged'
                  : 'You can go lower and still be at 100%'
            }
          />
          <Hint tries={tries}>
            7 spam out of 9 flagged: 7 ÷ 9. For step 2, find the normal email with the highest score: the threshold must
            sit just above it.
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Flagged emails (outlined)</h3>
        <EmailStrip t={t} label={`Emails by spam score, threshold ${t.toFixed(2)}, precision ${pct(c.precision)}`} />
        <p className="muted">Every outlined green tile is a real email sent to the spam folder: a false positive.</p>
      </section>
    </div>
  );
}
