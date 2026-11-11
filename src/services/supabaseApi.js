/* Real backend on Supabase: Auth for accounts, PostgreSQL for players and messages.
   Tables and security rules are in supabase/schema.sql. */
import { createClient } from '@supabase/supabase-js';
import { newPlayer, weekXp } from './game.js';

const toRow = (p) => ({
  name: p.name,
  progress: p.progress,
  xp: p.xp,
  streak: p.streak,
  last_active: p.lastActive,
  active_days: p.activeDays,
  xp_log: p.xpLog,
  avatar: p.avatar,
  quiz_skips: p.quizSkips,
  week_xp: weekXp(p),
});
const fromRow = (r) => ({
  name: r.name,
  progress: r.progress,
  xp: r.xp,
  streak: r.streak,
  lastActive: r.last_active,
  activeDays: r.active_days || [],
  xpLog: r.xp_log || [],
  avatar: r.avatar,
  quizSkips: r.quiz_skips,
});
const userOf = (u) => u && { id: u.id, email: u.email, name: u.user_metadata?.name || u.email.split('@')[0] };
const check = ({ data, error }) => {
  if (error) throw new Error(error.message);
  return data;
};

export function makeSupabaseApi(url, anonKey) {
  const sb = createClient(url, anonKey);

  return {
    mode: 'supabase',

    async getSession() {
      const { data } = await sb.auth.getSession();
      return userOf(data.session?.user);
    },

    async signUp({ name, email, password }) {
      const data = check(await sb.auth.signUp({ email, password, options: { data: { name } } }));
      if (!data.session) throw new Error('Check your inbox to confirm your email, then log in.');
      return userOf(data.user);
    },

    async logIn({ email, password }) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message === 'Invalid login credentials' ? 'Wrong email or password.' : error.message);
      return userOf(data.user);
    },

    async logOut() {
      await sb.auth.signOut();
      return null;
    },

    async getPlayer(userId) {
      const row = check(await sb.from('players').select('*').eq('id', userId).maybeSingle());
      if (row) return fromRow(row);
      // First visit: create the row (the signup trigger usually does this already).
      const { data } = await sb.auth.getUser();
      const fresh = newPlayer(userOf(data.user).name);
      check(await sb.from('players').insert({ id: userId, ...toRow(fresh) }));
      return fresh;
    },

    async savePlayer(userId, player) {
      check(await sb.from('players').update(toRow(player)).eq('id', userId));
      return player;
    },

    async getLeaderboard() {
      const rows = check(await sb.from('players').select('id, name, xp, week_xp, avatar').order('xp', { ascending: false }).limit(50));
      return rows.map((r) => ({ id: r.id, name: r.name, xp: r.xp, weekXp: r.week_xp, avatar: r.avatar }));
    },

    async sendMessage(msg) {
      check(await sb.from('messages').insert(msg));
      return true;
    },
  };
}
