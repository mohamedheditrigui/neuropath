/* Renders a lesson written as a list of blocks (see src/data/lessons/README in index.js).
   Block types: p (paragraph), h (sub-heading), f (formula), ex (worked example),
   list (bullets), warn (common mistake), go (going further). */
import { Fragment } from 'react';

// Tiny inline markup: **bold** and `code`.
function Inline({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**')) return <b key={i}>{part.slice(2, -2)}</b>;
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Block({ block }) {
  const [type, a, b] = block;
  switch (type) {
    case 'h':
      return <h2 className="lb-h">{a}</h2>;
    case 'f':
      return (
        <figure className="lb-f">
          <div className="formula">{a}</div>
          {b && (
            <figcaption>
              <Inline text={b} />
            </figcaption>
          )}
        </figure>
      );
    case 'ex':
      return (
        <section className="lb-ex">
          <p className="eyebrow">Worked example</p>
          <h3>{a}</h3>
          <ol>
            {b.map((step, i) => (
              <li key={i}>
                <Inline text={step} />
              </li>
            ))}
          </ol>
        </section>
      );
    case 'list':
      return (
        <ul className="lb-list">
          {a.map((item, i) => (
            <li key={i}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );
    case 'warn':
      return (
        <p className="lb-note warn">
          <b>Common mistake.</b> <Inline text={a} />
        </p>
      );
    case 'go':
      return (
        <p className="lb-note go">
          <b>Going further.</b> <Inline text={a} />
        </p>
      );
    default:
      return (
        <p>
          <Inline text={a} />
        </p>
      );
  }
}

export default function LessonBody({ blocks }) {
  return (
    <div className="lesson-body">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

export function Recap({ items }) {
  return (
    <section className="panel lb-recap">
      <h2 className="lb-h">In short</h2>
      <ul className="lb-list">
        {items.map((item, i) => (
          <li key={i}>
            <Inline text={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
