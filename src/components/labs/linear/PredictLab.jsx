/* Level 1 — Be the model: guess a new student's score from the trend, then sort tasks into regression or classification. */
import { useEffect, useRef, useState } from 'react';
import { COLORS, Goal, Hint, MEAN_Y, POINTS, Plot, makeScale, pointerSvgY } from './shared.jsx';

const NEW_X = 5.5; // a new student, between the 5-hour and 6-hour ones
const TRUTH = MEAN_Y; // the trend (best line) passes through the mean point (5.5, 6.5)
const TOLERANCE = 0.6;
const CARDS = [
  { text: 'The price of a flat in TND', kind: 'regression' },
  { text: 'Will it rain tomorrow? (yes / no)', kind: 'classification' },
  { text: 'A student’s exam score out of 20', kind: 'regression' },
  { text: 'Is this email spam?', kind: 'classification' },
];
const scale = makeScale();

export default function PredictLab({ onSolved }) {
  const [guess, setGuess] = useState(2);
  const [moved, setMoved] = useState(false);
  const [answers, setAnswers] = useState({});
  const [wrong, setWrong] = useState(0);
  const svg = useRef(null);
  const drag = useRef(false);

  const guessOk = moved && Math.abs(guess - TRUTH) <= TOLERANCE;
  const cardsOk = CARDS.every((c, i) => answers[i] === c.kind);
  const ok = guessOk && cardsOk;
  useEffect(() => onSolved(ok), [ok, onSolved]);

  const setFromPointer = (e) => {
    const y = scale.fromY(pointerSvgY(e, svg.current));
    setGuess(Math.max(0, Math.min(12, Math.round(y * 10) / 10)));
    setMoved(true);
  };
  const answer = (i, kind) => {
    setAnswers((a) => ({ ...a, [i]: kind }));
    if (kind !== CARDS[i].kind) setWrong((w) => w + 1);
  };
  const { X, Y } = scale;

  return (
    <div className="lesson">
      <section className="lab">
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Part 1.</b> A new student studied <b>{NEW_X} hours</b>. Drag the orange marker (or use the slider) to
            your predicted score. Follow the trend of the other students.
          </p>
          <div className="slider">
            <label htmlFor="guess">
              Your prediction ŷ <span className="mono">{guess.toFixed(1)}</span>
            </label>
            <input
              id="guess"
              type="range"
              min="0"
              max="12"
              step="0.1"
              value={guess}
              onChange={(e) => {
                setGuess(+e.target.value);
                setMoved(true);
              }}
            />
          </div>
          <div className="readout">
            <span className="muted">Within ±{TOLERANCE} of the trend</span>
            <Goal ok={guessOk} text={moved ? 'Not on the trend yet' : 'Move the marker'} />
          </div>
        </div>
        <div className="panel" style={{ display: 'grid', gap: 10 }}>
          <p>
            <b>Part 2.</b> Regression (a number) or classification (a category)?
          </p>
          {CARDS.map((c, i) => (
            <div key={c.text} className="sort-card">
              <span>{c.text}</span>
              <div className="tabs" role="group" aria-label={c.text}>
                {['regression', 'classification'].map((kind) => {
                  const picked = answers[i] === kind;
                  return (
                    <button
                      key={kind}
                      type="button"
                      aria-pressed={picked}
                      className={picked ? (kind === c.kind ? 'right' : 'wrong') : ''}
                      onClick={() => answer(i, kind)}
                    >
                      {kind === 'regression' ? 'Regression' : 'Classification'}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <Goal ok={cardsOk} text={`${CARDS.filter((c, i) => answers[i] === c.kind).length}/4 sorted`} />
          <Hint tries={wrong}>
            Ask yourself: is the answer a number on a scale (regression) or one of a few labels, like yes/no
            (classification)?
          </Hint>
        </div>
        <Hint>
          The trend line passes through the middle of the cloud. Between 5 h (5.6) and 6 h (7.1), the middle is around
          6.5.
        </Hint>
      </section>
      <section className="panel" style={{ display: 'grid', gap: 10 }}>
        <h3>Hours studied and exam score</h3>
        <Plot
          scale={scale}
          svgRef={svg}
          xTicks={[0, 2, 4, 6, 8, 10]}
          yTicks={[0, 3, 6, 9, 12]}
          label={`Ten students and a new one at ${NEW_X} hours with a predicted score of ${guess.toFixed(1)}`}
        >
          {POINTS.map(([x, y]) => (
            <circle key={x} cx={X(x)} cy={Y(y)} r="6.5" fill={COLORS.point} stroke="#FBF6EB" strokeWidth="2" />
          ))}
          <line x1={X(NEW_X)} x2={X(NEW_X)} y1={Y(12)} y2={Y(0)} stroke={COLORS.err} strokeDasharray="5 5" />
          {guessOk && (
            <line
              x1={X(4)}
              x2={X(7)}
              y1={Y(TRUTH - 0.83 * 1.5)}
              y2={Y(TRUTH + 0.83 * 1.5)}
              stroke={COLORS.point}
              strokeWidth="3"
              strokeDasharray="8 6"
            />
          )}
          <circle
            cx={X(NEW_X)}
            cy={Y(guess)}
            r="11"
            fill={COLORS.line}
            stroke="#FBF6EB"
            strokeWidth="3"
            style={{ cursor: 'ns-resize' }}
            onPointerDown={(e) => {
              drag.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              setFromPointer(e);
            }}
            onPointerMove={(e) => drag.current && setFromPointer(e)}
            onPointerUp={() => (drag.current = false)}
          />
          <text x={X(NEW_X) + 16} y={Y(guess) + 5} fontSize="14" fontWeight="700" fill={COLORS.line}>
            ŷ = {guess.toFixed(1)}
          </text>
        </Plot>
      </section>
    </div>
  );
}
