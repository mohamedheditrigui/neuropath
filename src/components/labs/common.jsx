/* Building blocks shared by every chapter's activities: goal chip, hints, checked number fields,
   answer buttons and pointer helpers for draggable SVG elements. */
import { useEffect, useState } from 'react';
import Icon from '../Icon.jsx';

/* Converts a pointer event to the SVG's own y coordinate (works at any zoom or screen size). */
export function pointerSvgY(e, svg) {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse()).y;
}

/* Status chip: green when the goal is reached. */
export function Goal({ ok, text }) {
  return (
    <span className={`chip ${ok ? 'good' : 'warn'}`}>
      {ok ? (
        <>
          <Icon name="check" /> Goal reached
        </>
      ) : (
        text
      )}
    </span>
  );
}

/* Hints appear after a few wrong tries, or after 40 seconds on the activity. */
export function Hint({ tries = 0, children }) {
  const [late, setLate] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLate(true), 40000);
    return () => clearTimeout(t);
  }, []);
  if (!late && tries < 2) return null;
  return open ? (
    <p className="lb-note go" role="note">
      <b>Hint.</b> {children}
    </p>
  ) : (
    <button type="button" className="btn ghost" style={{ justifySelf: 'start' }} onClick={() => setOpen(true)}>
      Show a hint
    </button>
  );
}

/* A small number field checked against an expected value. */
export function NumberCheck({ id, label, expected, tolerance = 0.01, value, onChange, onTry }) {
  const n = Number(String(value).replace(',', '.'));
  const filled = value !== '' && Number.isFinite(n);
  const ok = filled && Math.abs(n - expected) <= tolerance;
  return (
    <label className="field num-check" htmlFor={id}>
      <span>{label}</span>
      <span className="num-row">
        <input
          id={id}
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => filled && !ok && onTry?.()}
          className={filled && !ok ? 'bad' : ''}
          aria-invalid={filled && !ok}
        />
        {filled && (ok ? <Icon name="check" /> : <Icon name="x" />)}
      </span>
    </label>
  );
}
export const isClose = (value, expected, tolerance = 0.01) => {
  const n = Number(String(value).replace(',', '.'));
  return value !== '' && Number.isFinite(n) && Math.abs(n - expected) <= tolerance;
};

/* A row of answer buttons: the picked one turns green (right) or red (wrong). */
export function Choice({ label, options, answer, value, onPick, disabled }) {
  return (
    <div className="tabs choice" role="group" aria-label={label}>
      {options.map(([key, text]) => {
        const picked = value === key;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={picked}
            className={picked ? (key === answer ? 'right' : 'wrong') : ''}
            onClick={() => onPick(key)}
            disabled={disabled}
          >
            {text}
          </button>
        );
      })}
    </div>
  );
}

/* Converts a pointer event to the SVG's own (x, y) coordinates. */
export function pointerSvg(e, svg) {
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const m = pt.matrixTransform(svg.getScreenCTM().inverse());
  return { x: m.x, y: m.y };
}
