/* Simulated REST-like API, stored in the browser's localStorage.
   Used when no Supabase keys are configured. Same functions and shapes as supabaseApi.js.
   Passwords are salted and hashed with SHA-256 before storage; this is a demo backend,
   not a replacement for a real authentication server. */
import { newPlayer, weekXp } from './game.js';

const KEY = 'neuropath-db-v1';
const LATENCY = 250; // ms, so loading states are visible like with a real server

const SAMPLE_LEARNERS = [
  ['Amal B.', 620, 210, '#5F6D32', 'hat'],
  ['Karim S.', 540, 160, '#C98F2B', 'glasses'],
  ['Sarra M.', 480, 240, '#6B4A33', 'scarf'],
  ['Nour T.', 310, 80, '#7C9A92', 'none'],
  ['Omar H.', 275, 120, '#A84F32', 'glasses'],
  ['Ines K.', 190, 40, '#5F6D32', 'scarf'],
];

const wait = (v) => new Promise((res) => setTimeout(() => res(v), LATENCY));
const fail = (msg) => new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), LATENCY));

function load() {
  try {
    const db = JSON.parse(localStorage.getItem(KEY));
    if (db && db.users) return db;
  } catch {
    /* storage blocked or corrupted: start fresh */
  }
  return { users: {}, players: {}, messages: [], session: null };
}
function save(db) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* storage full or blocked: the session still works until reload */
  }
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
const publicUser = (u) => ({ id: u.id, email: u.email, name: u.name });

export const mockApi = {
  mode: 'mock',

  async getSession() {
    const db = load();
    const u = db.session && Object.values(db.users).find((x) => x.id === db.session);
    return wait(u ? publicUser(u) : null);
  },

  async signUp({ name, email, password }) {
    const db = load();
    const key = email.trim().toLowerCase();
    if (db.users[key]) return fail('An account with this email already exists. Log in instead.');
    const salt = crypto.randomUUID();
    const user = { id: crypto.randomUUID(), email: key, name: name.trim(), salt, hash: await hashPassword(password, salt) };
    db.users[key] = user;
    db.players[user.id] = newPlayer(user.name);
    db.session = user.id;
    save(db);
    return wait(publicUser(user));
  },

  async logIn({ email, password }) {
    const db = load();
    const user = db.users[email.trim().toLowerCase()];
    if (!user || (await hashPassword(password, user.salt)) !== user.hash) return fail('Wrong email or password.');
    db.session = user.id;
    save(db);
    return wait(publicUser(user));
  },

  async logOut() {
    const db = load();
    db.session = null;
    save(db);
    return wait(null);
  },

  async getPlayer(userId) {
    const db = load();
    if (!db.players[userId]) return fail('Profile not found.');
    return wait(db.players[userId]);
  },

  async savePlayer(userId, player) {
    const db = load();
    db.players[userId] = player;
    save(db);
    return wait(player);
  },

  async getLeaderboard() {
    const db = load();
    const samples = SAMPLE_LEARNERS.map(([name, xp, week, color, acc], i) => ({ id: `sample-${i}`, name, xp, weekXp: week, avatar: { color, acc }, sample: true }));
    const real = Object.entries(db.players).map(([id, p]) => ({ id, name: p.name, xp: p.xp, weekXp: weekXp(p), avatar: p.avatar }));
    return wait([...samples, ...real]);
  },

  async sendMessage(msg) {
    const db = load();
    db.messages.push({ ...msg, id: crypto.randomUUID(), at: new Date().toISOString() });
    save(db);
    return wait(true);
  },
};
