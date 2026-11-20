/* Ch. 6, level 2 — Accuracy: count the confusion matrix by hand at threshold 0.5, compute the accuracy,
   then meet the lazy filter that flags nothing and still looks "accurate". */
import { useEffect, useState } from 'react';
import { Choice, Goal, Hint, NumberCheck, isClose } from '../common.jsx';
import { EmailStrip, confusion, pct } from './data.jsx';

const T = 0.5;
const C = confusion(T); // TP 7, FP 2, FN 1, TN 10, accuracy 0.85
const LAZY = confusion(2); // flags nothing

export default function ConfusionLab({ onSolved }) {
  const [v, setV] = useState({ tp: '', fp: '', fn: '', tn: '', acc: '' });
  const [lazy, setLazy] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [tries, setTries] = useState(0);
  const set = (k) => (x) => setV((o) => ({ ...o, [k]: x }));
  const bump = () => setTries((t) => t + 1);
  const countsOk = ['tp', 'fp', 'fn', 'tn'].every((k) => isClose(v[k], C[k]));
  const accOk = countsOk && isClose(v.acc, C.accuracy, 0.01);
  const ok = accOk && lazy && verdict === 'useless';
  useEffect(() => onSolved(ok), [ok, onSolved]);

  return (
    <div className="lesson">
      <section className="lab">
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Step 1.</b> The filter flags every email with a score ≥ {T}. Count the four boxes on the strip (outlined
            tiles are flagged).
          </p>
          <div className="confusion-inputs">
            <NumberCheck
              id="tp"
              label="TP: spam, flagged"
              expected={C.tp}
              value={v.tp}
              onChange={set('tp')}
              onTry={bump}
            />
            <NumberCheck
              id="fp"
              label="FP: normal, flagged"
              expected={C.fp}
              value={v.fp}
              onChange={set('fp')}
              onTry={bump}
            />
            <NumberCheck
              id="fn"
              label="FN: spam, missed"
              expected={C.fn}
              value={v.fn}
              onChange={set('fn')}
              onTry={bump}
            />
            <NumberCheck
              id="tn"
              label="TN: normal, left alone"
              expected={C.tn}
              value={v.tn}
              onChange={set('tn')}
              onTry={bump}
            />
          </div>
          {countsOk && (
            <NumberCheck
              id="acc"
              label="Accuracy = (TP + TN) / 20 (as 0.xx)"
              expected={C.accuracy}
              value={v.acc}
              onChange={set('acc')}
              onTry={bump}
            />
          )}
        </div>
        {accOk && (
          <div className="panel" style={{ display: 'grid', gap: 10 }}>
            <p>
              <b>Step 2.</b> Meet the lazy filter: it never flags anything.
            </p>
            <button type="button" className="btn" style={{ justifySelf: 'start' }} onClick={() => setLazy(true)}>
              Run the lazy filter
            </button>
            {lazy && (
              <>
                <p className="mono">
                  lazy filter: TP {LAZY.tp}, TN {LAZY.tn} → accuracy {pct(LAZY.accuracy)}
                </p>
                <p style={{ fontWeight: 700 }}>
                  It catches no spam at all, yet scores {pct(LAZY.accuracy)}. Is it a good filter?
                </p>
                <Choice
                  label="Is the lazy filter good?"
                  options={[
                    ['good', 'Yes, 60% is fine'],
                    ['useless', 'No, accuracy hides that it is useless'],
                  ]}
                  answer="useless"
                  value={verdict}
                  onPick={(x) => {
                    setVerdict(x);
                    if (x !== 'useless') bump();
                  }}
                />
              </>
            )}
          </div>
        )}
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <Goal
            ok={ok}
            text={!countsOk ? 'Count the four boxes' : !accOk ? 'Compute the accuracy' : 'Test the lazy filter'}
          />
          <Hint tries={tries}>
            Top row = real spam: outlined ones are TP, the others FN. Bottom row = normal emails: outlined ones are FP,
            the others TN. The four numbers add up to 20.
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>20 test emails by spam score</h3>
        <EmailStrip
          t={lazy && accOk ? 2 : T}
          label="Spam and normal emails placed by their spam score, with the threshold"
        />
        {countsOk && (
          <div className="matrix" aria-label="Confusion matrix">
            <div className="h" />
            <div className="h">Flagged</div>
            <div className="h">Not flagged</div>
            <div className="h">Spam</div>
            <div className="good">TP {C.tp}</div>
            <div className="bad">FN {C.fn}</div>
            <div className="h">Normal</div>
            <div className="bad">FP {C.fp}</div>
            <div className="good">TN {C.tn}</div>
          </div>
        )}
      </section>
    </div>
  );
}
