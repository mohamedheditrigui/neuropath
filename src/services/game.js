/* Game rules, kept free of React and of storage so both APIs share them. */
import { CHAPTERS, FLAT, TOTAL, XP_PER_LEVEL, XP_PER_RANK, firstOf } from '../data/content.js';
import { DEFAULT_AVATAR } from '../components/Avatar.jsx';

export const today = () => new Date().toISOString().slice(0, 10);
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

export function newPlayer(name) {
  return {
    name,
    progress: 0,
    xp: 0,
    streak: 0,
    lastActive: null,
    activeDays: [],
    xpLog: [],
    avatar: { ...DEFAULT_AVATAR },
    quizSkips: 0,
    project: null, // the final project's saved choices: { cleaned, split, lr, w, b }
  };
}

export const rank = (xp) => 1 + Math.floor(xp / XP_PER_RANK);
export const stateOf = (progress, flat) => (flat < progress ? 'done' : flat === progress ? 'now' : 'locked');
export const chapterDone = (progress, ci) => FLAT.filter((l) => l.ch === ci && l.flat < progress).length;
export const currentChapter = (progress) => FLAT[Math.min(progress, TOTAL - 1)].ch;

/* The streak counts consecutive days with at least one finished level. */
export function streakAfterActivity(player, day = today()) {
  if (player.lastActive === day) return player.streak;
  if (player.lastActive && daysBetween(player.lastActive, day) === 1) return player.streak + 1;
  return 1;
}

/* Shown streak: a streak is lost if the player skipped yesterday. */
export function liveStreak(player, day = today()) {
  if (!player.lastActive) return 0;
  return daysBetween(player.lastActive, day) <= 1 ? player.streak : 0;
}

export const weekXp = (player, day = today()) =>
  (player.xpLog || []).filter((e) => daysBetween(e.date, day) < 7).reduce((s, e) => s + e.xp, 0);

/* Finishing a level (by the lesson, the quiz or the project).
   Replaying a done level gives nothing; a skip-ahead quiz unlocks up to that level. */
export function completeLevel(player, flat, { viaQuiz = false } = {}) {
  if (flat < player.progress) return { player, gained: 0, from: player.progress, to: player.progress };
  const from = player.progress;
  const to = Math.min(flat + 1, TOTAL);
  const day = today();
  const skipped = flat > from;
  const gained = XP_PER_LEVEL; // one level's worth, even when a quiz skips several levels
  const log = [...(player.xpLog || []), { date: day, xp: gained }].slice(-60);
  const next = {
    ...player,
    progress: to,
    xp: player.xp + gained,
    streak: streakAfterActivity(player, day),
    lastActive: day,
    activeDays: Array.from(new Set([...(player.activeDays || []), day])).slice(-30),
    xpLog: log,
    quizSkips: player.quizSkips + (viaQuiz && skipped ? 1 : 0),
  };
  return { player: next, gained, from, to, newChapter: FLAT[Math.min(to, TOTAL - 1)].ch > FLAT[Math.min(from, TOTAL - 1)].ch };
}

export function badges(player) {
  const p = player.progress;
  return [
    { id: 'first', title: 'First Line', need: 'Finish level 1', earned: p >= 1, icon: 'path' },
    { id: 'streak', title: 'Five-Day Streak', need: 'Learn 5 days running', earned: player.streak >= 5, icon: 'flame' },
    { id: 'ch1', title: 'Curve Tamer', need: 'Clear chapter 1', earned: p >= firstOf(1), icon: 'sliders' },
    { id: 'skip', title: 'Quiz Skipper', need: 'Skip ahead with a quiz', earned: player.quizSkips > 0, icon: 'bolt' },
    { id: 'sigmoid', title: 'Yes or No', need: 'Clear Logistic Regression', earned: p >= firstOf(4), icon: 'star' },
    { id: 'knn', title: 'Neighbor', need: 'Clear the KNN chapter', earned: p >= firstOf(5), icon: 'user' },
    { id: 'judge', title: 'Fair Judge', need: 'Clear Evaluating Models', earned: p >= firstOf(6), icon: 'trophy' },
    { id: 'model', title: 'First Model', need: 'Finish the project', earned: p >= TOTAL, icon: 'model' },
  ];
}

export const chapterCount = CHAPTERS.length;
