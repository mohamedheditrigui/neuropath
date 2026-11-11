import { Link } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext.jsx';

export default function NotFound() {
  const { user } = usePlayer();
  return (
    <div className="nf">
      <div className="score-big">404</div>
      <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)' }}>This path is not on the map.</h1>
      <p className="muted">The page you asked for does not exist or has moved.</p>
      <Link className="btn primary big" to={user ? '/roadmap' : '/'}>{user ? 'Back to my Roadmap' : 'Back to the home page'}</Link>
    </div>
  );
}
