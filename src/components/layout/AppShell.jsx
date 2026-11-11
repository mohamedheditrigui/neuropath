/* Signed-in layout: dark bark menu on the left (bottom bar on phones) and the page on the right. */
import { useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext.jsx';
import Avatar from '../Avatar.jsx';
import Icon from '../Icon.jsx';
import Logo from '../Logo.jsx';

const NAV = [
  ['/roadmap', 'Roadmap', 'map'],
  ['/profile', 'Profile', 'user'],
  ['/avatar', 'Avatar', 'palette'],
  ['/leaderboard', 'Leaderboard', 'trophy'],
  ['/help', 'Help', 'help'],
];
// Lesson, chapter, quiz and project pages belong to the Roadmap section of the menu.
const SECTION = (path) => (/^\/(chapter|lesson|quiz|project)/.test(path) ? '/roadmap' : path);

export default function AppShell({ children, raw = false }) {
  const { user, player, logOut } = usePlayer();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const main = useRef(null);
  const active = SECTION(pathname);

  // New page: start at the top (the Roadmap scrolls its own map instead).
  useEffect(() => {
    if (main.current && !raw) main.current.scrollTop = 0;
  }, [pathname, raw]);

  const onLogOut = async () => {
    await logOut();
    navigate('/');
  };

  return (
    <div className="shell">
      <nav className="rail" aria-label="Main menu">
        <Logo to="/roadmap" />
        {NAV.map(([to, label, icon]) => (
          <NavLink key={to} to={to} className={`nav ${active === to ? 'on' : ''}`} aria-current={active === to ? 'page' : undefined}>
            <Icon name={icon} />
            <span>{label}</span>
          </NavLink>
        ))}
        <div className="spacer" />
        <div className="me">
          <Avatar avatar={player.avatar} />
          <div>
            <b>{player.name || user.name}</b>
            <br />
            <button type="button" className="linkish" onClick={onLogOut}>Log out</button>
          </div>
        </div>
      </nav>
      <main className="main" id="main" ref={main}>
        {raw ? (
          children
        ) : (
          <div className="content">
            {children}
            <footer className="app-foot">
              <span>NeuroPath, a SUP&apos;COM web project.</span>
              <Link to="/help">About and help</Link>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
}
