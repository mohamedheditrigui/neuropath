/* Small building blocks used across pages. */
import { Link } from 'react-router-dom';

export function Crumb({ parts }) {
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      {parts.map(([label, to], i) => (
        <span key={label}>
          {i > 0 && ' / '}
          {to ? <Link to={to}>{label}</Link> : <span aria-current="page">{label}</span>}
        </span>
      ))}
    </nav>
  );
}

export function Bar({ value, max, tone = '', label, style }) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className={`bar ${tone}`} role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={label} style={style}>
      <i style={{ width: `${pct}%` }} />
    </div>
  );
}

export function PageTitle({ title, sub, eyebrow }) {
  return (
    <div>
      {eyebrow && <p className="eyebrow" style={{ marginBottom: 10 }}>{eyebrow}</p>}
      <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>{title}</h1>
      {sub && <p className="muted" style={{ marginTop: 6 }}>{sub}</p>}
    </div>
  );
}

export function Spinner() {
  return <span className="spin" aria-hidden="true" />;
}
