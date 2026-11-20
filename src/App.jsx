import { Suspense, lazy } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { usePlayer } from './context/PlayerContext.jsx';
import AppShell from './components/layout/AppShell.jsx';
import Loading from './components/layout/Loading.jsx';
import Landing from './pages/Landing.jsx';

/* Code splitting: the landing page ships in the main bundle (first thing a visitor sees);
   every other page is its own file, downloaded the first time it is opened. */
const Auth = lazy(() => import('./pages/Auth.jsx'));
const Roadmap = lazy(() => import('./pages/Roadmap.jsx'));
const Chapter = lazy(() => import('./pages/Chapter.jsx'));
const Lesson = lazy(() => import('./pages/Lesson.jsx'));
const Quiz = lazy(() => import('./pages/Quiz.jsx'));
const Project = lazy(() => import('./pages/Project.jsx'));
const AvatarPage = lazy(() => import('./pages/AvatarPage.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Leaderboard = lazy(() => import('./pages/Leaderboard.jsx'));
const Help = lazy(() => import('./pages/Help.jsx'));
const Program = lazy(() => import('./pages/Program.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

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
    <Suspense fallback={<Loading label="Loading…" />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<Auth kind="login" />} />
          <Route path="/signup" element={<Auth kind="signup" />} />
        </Route>
        <Route path="/help" element={<Help />} />
        <Route path="/program" element={<Program />} />
        <Route element={<RequireAuth />}>
          <Route
            path="/roadmap"
            element={
              <AppShell raw>
                <Roadmap />
              </AppShell>
            }
          />
          <Route
            element={
              <AppShell>
                <Outlet />
              </AppShell>
            }
          >
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
    </Suspense>
  );
}
