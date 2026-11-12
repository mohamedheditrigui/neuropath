# NeuroPath

**Learn Machine Learning one level at a time.**
SUP'COM web project, Objective 3. Team: Mohamed Hedi Trigui and Youssef Jmail, 2025/2026.

A gamified learning path for young engineers: 7 chapters and 41 levels on an isometric map,
from linear regression to a guided final project.

## 1. Choice of framework

**React 19 with Vite 7**, as chosen in Objective 2 (compared with Vue and Angular):

- **Reusable components:** one tile, one lesson page and one quiz serve all 41 levels.
- **React Router 7:** a real URL for each page, with pages behind login.
- **Shared state with React Context and Hooks:** XP, streak and progress are identical on every page.
- **Vite:** starts in under a second and rebuilds instantly.
- **Graphics:** the map, avatar and charts are SVG drawn by React. Styles are plain CSS with the
  Objective 2 charter as CSS variables.
- **Backend:** **Supabase** (accounts and a PostgreSQL database) when keys are provided, otherwise a
  **simulated API** that stores data in the browser. Both expose the same functions, so the pages
  don't change.

## 2. Features developed

- **13 pages:** landing, sign up, log in, roadmap, chapter, lesson, quiz, final project (6 steps),
  profile, avatar, leaderboard, help and a 404 page.
- **Course:** Linear Regression, Multiple Linear Regression, Gradient Descent, Logistic Regression,
  KNN, Evaluating Models, and a guided project: Build Your First Model.
- **Interactive lessons:**
  - every level has an explanation, a key takeaway and a mini-exercise
  - the learner moves sliders or drags points, and the graph reacts live
  - the level is completed once the goal is reached
- **Quizzes:** instant feedback; about two thirds correct to pass. Passing the quiz of a locked
  level skips ahead to it.
- **Roadmap:**
  - one district per chapter, with castles, a temple and other landmarks
  - completed tiles get a check, and the avatar jumps forward
  - clouds lift when a new chapter opens
- **Progress and motivation:** XP, ranks, daily streak, badges, a customisable avatar and a
  leaderboard.
- **Dynamic forms:**
  - sign up and log in with live validation
  - contact form
  - name editing
- **Filters and search:** chapter filter; leaderboard by week or all time; search in the
  leaderboard and in the help.
- **Notifications:** toast messages for XP gained, saves and errors.
- **Responsive and accessible:**
  - phone, tablet and desktop; on phones the menu moves to the bottom
  - keyboard navigation with a visible focus ring
  - contrast above WCAG AA
  - animations stop when the system asks for reduced motion

## 3. How to launch the project

Requirements: [Node.js](https://nodejs.org) 20 or newer.

```bash
git clone https://github.com/mohamedheditrigui/neuropath.git
cd neuropath
npm install
npm run dev
```

Open http://localhost:5173 and create an account. Without any configuration, the app runs on the
simulated API, and data is saved in the browser.

**Optional: use the Supabase backend**
1. Create a project on [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in its SQL Editor.
3. Copy `.env.example` to `.env` and fill in the project URL and anon key
   (Project Settings > API).
4. Restart `npm run dev`.

`npm run build` creates the production version in `dist/`.
