/* Shared state for the whole app: who is signed in and their game progress.
   XP, streak and progress therefore stay identical on the Roadmap, Profile and Quiz pages. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { completeLevel } from '../services/game.js';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [user, setUser] = useState(null);
  const [player, setPlayer] = useState(null);
  const [ready, setReady] = useState(false);
  // Set right after a level is completed, so the Roadmap can play the jump animation once.
  const [pendingJump, setPendingJump] = useState(null);

  const loadPlayer = useCallback(async (u) => {
    setUser(u);
    setPlayer(u ? await api.getPlayer(u.id) : null);
  }, []);

  useEffect(() => {
    api
      .getSession()
      .then(loadPlayer)
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, [loadPlayer]);

  const signUp = useCallback(async (form) => loadPlayer(await api.signUp(form)), [loadPlayer]);
  const logIn = useCallback(async (form) => loadPlayer(await api.logIn(form)), [loadPlayer]);
  const logOut = useCallback(async () => {
    await api.logOut();
    setUser(null);
    setPlayer(null);
  }, []);

  const update = useCallback(
    async (next) => {
      setPlayer(next); // optimistic: the UI updates at once
      await api.savePlayer(user.id, next);
      return next;
    },
    [user],
  );

  // opts.patch: extra fields saved together with the progress (used by the project steps).
  const finishLevel = useCallback(
    async (flat, opts = {}) => {
      const base = opts.patch ? { ...player, ...opts.patch } : player;
      const result = completeLevel(base, flat, opts);
      if (result.gained > 0) {
        setPendingJump({ from: result.from, to: result.to });
        await update(result.player);
      } else if (opts.patch) {
        await update(base);
      }
      return result;
    },
    [player, update],
  );

  const value = useMemo(
    () => ({ user, player, ready, signUp, logIn, logOut, update, finishLevel, pendingJump, clearJump: () => setPendingJump(null), mode: api.mode }),
    [user, player, ready, signUp, logIn, logOut, update, finishLevel, pendingJump],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export const usePlayer = () => useContext(PlayerContext);
