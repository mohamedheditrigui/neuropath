/* Ch. 6, level 1 — Train and test: set an honest split of 20 emails, then judge four real-life
   practices as honest or leaky. */
import { useEffect, useState } from 'react';
import { Choice, Goal, Hint } from '../common.jsx';
import { EMAILS } from './data.jsx';

const CASES = [
  {
    text: 'Compute the mean and standard deviation on the whole dataset, scale, then split into train and test.',
    answer: 'leak',
  },
  {
    text: 'Split first, compute the scaling on the training set, and apply the same numbers to the test set.',
    answer: 'honest',
  },
  { text: 'Try 20 thresholds and keep the one with the best score on the test set.', answer: 'leak' },
  { text: 'Stock returns: train on 2015–2023 and test on 2024–2025.', answer: 'honest' },
];

export default function SplitLab({ onSolved }) {
  const [share, setShare] = useState(0.5);
  const [answers, setAnswers] = useState({});
  const [tries, setTries] = useState(0);
  const nTest = Math.round(share * EMAILS.length);
  const splitOk = share >= 0.2 && share <= 0.3;
  const casesOk = CASES.every((c, i) => answers[i] === c.answer);
  const ok = splitOk && casesOk;
  useEffect(() => onSolved(ok), [ok, onSolved]);
  // Test emails are spread evenly through the list, so both sets contain spam and normal emails.
  const testSet = new Set(Array.from({ length: nTest }, (_, j) => Math.floor((j * EMAILS.length) / nTest)));
  const isTest = (i) => testSet.has(i);

  return (
    <div className="lesson">
      <section className="lab">
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Part 1.</b> Choose how many of the 20 emails to lock away as the test set. Aim for the usual 20–30%.
          </p>
          <div className="slider">
            <label htmlFor="share">
              Test share <span className="mono">{Math.round(share * 100)}%</span>
            </label>
            <input
              id="share"
              type="range"
              min="0"
              max="0.6"
              step="0.05"
              value={share}
              onChange={(e) => setShare(+e.target.value)}
            />
          </div>
          <div className="readout">
            <span className="mono">
              train {EMAILS.length - nTest} · test {nTest}
            </span>
            <Goal ok={splitOk} text={share < 0.2 ? 'Test set too small to trust' : 'Too little left to learn from'} />
          </div>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Part 2.</b> Honest evaluation, or data leakage?
          </p>
          {CASES.map((c, i) => (
            <div key={i} style={{ display: 'grid', gap: 6 }}>
              <span>{c.text}</span>
              <Choice
                label={c.text}
                options={[
                  ['honest', 'Honest'],
                  ['leak', 'Leak'],
                ]}
                answer={c.answer}
                value={answers[i]}
                onPick={(v) => {
                  setAnswers((a) => ({ ...a, [i]: v }));
                  if (v !== c.answer) setTries((t) => t + 1);
                }}
              />
            </div>
          ))}
          <Goal ok={ok} text={`${CASES.filter((c, i) => answers[i] === c.answer).length}/4 judged`} />
          <Hint tries={tries}>
            Ask: did any information from the test data (its values, its scores, its future) influence a choice made
            before the final grade?
          </Hint>
        </div>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Your split</h3>
        <div
          className="email-grid"
          role="img"
          aria-label={`${EMAILS.length - nTest} training emails and ${nTest} test emails`}
        >
          {EMAILS.map(([, spam], i) => (
            <span key={i} className={`email ${isTest(i) ? 'test' : 'train'}`}>
              {spam ? 'spam' : 'mail'}
            </span>
          ))}
        </div>
        <div className="legend">
          <span>
            <i style={{ background: '#5F6D32' }} />
            Training: the model learns from these
          </span>
          <span>
            <i style={{ background: '#2E2118' }} />
            Test: locked away until the end
          </span>
        </div>
      </section>
    </div>
  );
}
