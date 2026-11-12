import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { usePlayer } from './context/PlayerContext.jsx';
import AppShell from './components/layout/AppShell.jsx';
import Loading from './components/layout/Loading.jsx';
import Landing from './pages/Landing.jsx';
import Auth from './pages/Auth.jsx';
import Roadmap from './pages/Roadmap.jsx';
import Chapter from './pages/Chapter.jsx';
import Lesson from './pages/Lesson.jsx';
import Quiz from './pages/Quiz.jsx';
import Project from './pages/Project.jsx';
import AvatarPage from './pages/AvatarPage.jsx';
import Profile from './pages/Profile.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import Help from './pages/Help.jsx';
import NotFound from './pages/NotFound.jsx';

/* Pages behind login: send visitors to /login and come back afterwards. */
function RequireAuth() {
  const { user, player, ready } = usePlayer();
  const location = useLocation();
  if (!ready) return <Loading />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (!player) return <Loading />;
  return <Outlet />;
}

/* Login and signup are pointless once signed in. */
function GuestOnly() {
  const { user, ready } = usePlayer();
  if (!ready) return <Loading />;
  return user ? <Navigate to="/roadmap" replace /> : <Outlet />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<Auth kind="login" />} />
        <Route path="/signup" element={<Auth kind="signup" />} />
      </Route>
      <Route path="/help" element={<Help />} />
      <Route element={<RequireAuth />}>
        <Route path="/roadmap" element={<AppShell raw><Roadmap /></AppShell>} />
        <Route element={<AppShell><Outlet /></AppShell>}>
          <Route path="/chapter/:id" element={<Chapter />} />
          <Route path="/lesson/:flat" element={<Lesson />} />
          <Route path="/quiz/:flat" element={<Quiz />} />
          <Route path="/project" element={<Navigate to="/project/1" replace />} />
          <Route path="/project/:step" element={<Project />} />
          <Route path="/avatar" element={<AvatarPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
