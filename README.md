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

- **14 pages:** landing, sign up, log in, roadmap, program, chapter, lesson, quiz, final project
  (6 steps), profile, avatar, leaderboard, help and a 404 page.
- **Program page (`/program`):** the full syllabus, public before sign-up: every chapter and level
  title with its key takeaway, a topic search, and the learner's status per level once signed in.
- **Course:** Linear Regression, Multiple Linear Regression, Gradient Descent, Logistic Regression,
  KNN, Evaluating Models, and a guided project: Build Your First Model.
- **Interactive lessons:**
  - every level has its own course (about 5 minutes): explanation, formulas, a worked example,
    a common mistake and a recap, followed by a mini-exercise and its own 3-question quiz
  - content checked against Google's Machine Learning Crash Course, the Stanford CS229 notes and
    the scikit-learn user guide (lesson data in `src/data/lessons/`)
  - every one of the 35 lesson levels has its own hands-on activity (`src/components/labs/`):
    drag points on a graph, pick neighbours, tune a model with sliders, or compute a step by hand
    (residuals, normal equations, gradient steps, confusion matrix…), with hints after a few tries
  - the level is completed once the activity's goal is reached
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

## 4. Optimisation and code quality (Objective 4)

- **Code splitting:** every page except the landing page is loaded on demand (`React.lazy`);
  React is in its own cached file, and the Supabase library is only downloaded when Supabase is
  configured. The app's own startup code went from 421 kB to 63 kB.
- **Loading states:** skeleton placeholders while a page loads, plus a short page transition.
- **Lighthouse** (production build, `npm run build` then `npm run preview`): 96 to 99 in
  Performance and 100 in Accessibility, Best Practices and SEO on the public pages.
- **Clean code:** `npm run lint` (ESLint, including React hooks rules) and `npm run format`
  (Prettier) both pass on the whole `src` folder.
