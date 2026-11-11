export default function Loading({ label = 'Loading your map…' }) {
  return (
    <div className="loading" role="status">
      <span className="spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
