/* The single entry point the pages use. Picks Supabase when keys are set in .env, otherwise the mock API. */
import { mockApi } from './mockApi.js';
import { makeSupabaseApi } from './supabaseApi.js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const api = url && key ? makeSupabaseApi(url, key) : mockApi;
