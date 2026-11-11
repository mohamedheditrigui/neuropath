import { Link } from 'react-router-dom';

export function LogoMark() {
  return (
    <svg viewBox="0 0 34 34" aria-hidden="true">
      <path d="M17 2l15 15-15 15L2 17z" fill="#A84F32" />
      <path d="M2 17l15 15 15-15v3L17 35 2 20z" fill="#7E3820" />
      <path d="M10 19l7-7 7 5" fill="none" stroke="#FBF6EB" strokeWidth="2" />
      <circle cx="10" cy="19" r="2.6" fill="#FBF6EB" />
      <circle cx="17" cy="12" r="2.6" fill="#FBF6EB" />
      <circle cx="24" cy="17" r="2.6" fill="#E7D8BC" />
    </svg>
  );
}

export default function Logo({ to = '/' }) {
  return (
    <Link className="logo" to={to}>
      <LogoMark />
      <span>NeuroPath</span>
    </Link>
  );
}
