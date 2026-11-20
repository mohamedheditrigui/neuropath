/* Top bar of the public pages: logo, Program and About links, and log in / sign up (or "Open my map" when signed in). */
import { Link } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext.jsx';
import Logo from '../Logo.jsx';

export default function PublicHeader() {
  const { user } = usePlayer();
  return (
    <header className="pub-top">
      <Logo to="/" />
      <nav aria-label="Site">
        <Link className="link" to="/program">
          Program
        </Link>
        <Link className="link" to="/help">
          About
        </Link>
        {user ? (
          <Link className="btn primary" to="/roadmap">
            Open my map
          </Link>
        ) : (
          <>
            <Link className="link" to="/login">
              Log in
            </Link>
            <Link className="btn primary" to="/signup">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
