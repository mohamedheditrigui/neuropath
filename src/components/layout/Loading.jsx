/* Loading states: a full-screen spinner (first load, session check) and a page skeleton
   (shown inside the app layout while a page's code is downloaded, so the menu stays put). */
export default function Loading({ label = 'Loading your map…' }) {
  return (
    <div className="loading" role="status">
      <span className="spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="skeleton" role="status" aria-label="Loading the page">
      <div className="sk sk-banner" />
      <div className="sk sk-line" style={{ width: '60%' }} />
      <div className="sk-grid">
        <div className="sk sk-card" />
        <div className="sk sk-card" />
        <div className="sk sk-card" />
      </div>
    </div>
  );
}
