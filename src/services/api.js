/* The single entry point the pages use. Picks Supabase when keys are set in .env, otherwise the mock API.
   The Supabase client library is large (about 180 kB), so it is only downloaded when it is really used:
   in mock mode it never leaves the server. */
import { mockApi } from './mockApi.js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const useSupabase = Boolean(url && key);

const backend = useSupabase
  ? import('./supabaseApi.js').then((m) => m.makeSupabaseApi(url, key))
  : Promise.resolve(mockApi);

const METHODS = ['getSession', 'signUp', 'logIn', 'logOut', 'getPlayer', 'savePlayer', 'getLeaderboard', 'sendMessage'];

// Same functions as before; each one waits for the backend module, then forwards the call.
export const api = { mode: useSupabase ? 'supabase' : 'mock' };
METHODS.forEach((name) => {
  api[name] = async (...args) => (await backend)[name](...args);
});
