/* Ranking loaded from the API, with a period filter (this week / all time) and a name search. */
import { useEffect, useMemo, useState } from 'react';
import { usePlayer } from '../context/PlayerContext.jsx';
import { api } from '../services/api.js';
import { weekXp } from '../services/game.js';
import Avatar from '../components/Avatar.jsx';
import Icon from '../components/Icon.jsx';
import Loading from '../components/layout/Loading.jsx';
import { PageTitle } from '../components/ui.jsx';

const PERIODS = [['week', 'This week'], ['all', 'All time']];

export default function Leaderboard() {
  const { user, player } = usePlayer();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('week');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let alive = true;
    api
      .getLeaderboard()
      .then((list) => alive && setRows(list))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, []);

  const ranked = useMemo(() => {
    if (!rows) return [];
    // Always show the current player with their latest numbers.
    const me = { id: user.id, name: player.name, xp: player.xp, weekXp: weekXp(player), avatar: player.avatar, me: true };
    const list = [...rows.filter((r) => r.id !== user.id), me];
    const score = (r) => (period === 'week' ? r.weekXp : r.xp);
    return list.sort((a, b) => score(b) - score(a)).map((r, i) => ({ ...r, rank: i + 1, score: score(r) }));
  }, [rows, period, user, player]);

  const shown = ranked.filter((r) => r.name.toLowerCase().includes(query.trim().toLowerCase()));
  const podium = [ranked[1], ranked[0], ranked[2]].filter(Boolean);
  const hasSamples = rows?.some((r) => r.sample);

  return (
    <>
      <PageTitle title="Leaderboard" sub={hasSamples ? 'Ranked by XP. Names marked “sample” are demo learners.' : 'Ranked by XP.'} />
      {error && <p className="form-error" role="alert">Could not load the leaderboard: {error}</p>}
      {!rows && !error && <Loading label="Loading the ranking…" />}
      {rows && (
        <>
          <div className="toolbar">
            <div className="tabs" role="group" aria-label="Period">
              {PERIODS.map(([key, label]) => (
                <button key={key} type="button" aria-pressed={period === key} onClick={() => setPeriod(key)}>{label}</button>
              ))}
            </div>
            <label className="search">
              <Icon name="search" />
              <span className="sr-only">Search a learner</span>
              <input type="search" placeholder="Search a learner" value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
          </div>
          {podium.length === 3 && (
            <section className="panel">
              <div className="podium">
                {podium.map((r, i) => (
                  <div key={r.id} className={`col ${['p2', 'p1', 'p3'][i]}`}>
                    <Avatar avatar={r.avatar} />
                    <b>{r.me ? 'You' : r.name}</b>
                    <br />
                    <span className="mono">{r.score} XP</span>
                    <div className="step">{r.rank}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
          <section className="panel scroll-x">
            <table className="data">
              <thead><tr><th>Rank</th><th>Learner</th><th>{period === 'week' ? 'XP this week' : 'Total XP'}</th></tr></thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.id} className={r.me ? 'me' : ''}>
                    <td className="mono">{r.rank}</td>
                    <td>{r.name}{r.me && ' (you)'}{r.sample && <span className="muted"> · sample</span>}</td>
                    <td className="mono">{r.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shown.length === 0 && <p className="empty">No learner matches “{query}”.</p>}
          </section>
        </>
      )}
    </>
  );
}
