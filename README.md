# NeuroPath

**Learn Machine Learning one level at a time.**
SUP'COM web project, Objective 3: development and integration of the main features.
Team: Mohamed Hedi Trigui and Youssef Jmail, 2025/2026.

NeuroPath is a gamified learning path for young engineers. The learner climbs an isometric map of
**41 levels across 7 chapters**, from linear regression to a guided final project. Each level is a short
lesson with a hands-on lab; passing it or its quiz unlocks the next tile.

---

## 1. Choice of framework

| Layer | Choice | Why |
|---|---|---|
| Front-end framework | **React 19** with **Vite 7** | Reusable components: one tile, one lesson page and one quiz serve all 41 levels. Vite starts in under a second and rebuilds instantly. |
| Routing | **React Router 7** | Real URLs for every page (`/lesson/3`, `/chapter/2`, `/project/4`…), protected routes behind login. |
| Shared state | **React Context + Hooks** | XP, streak and progress live in one `PlayerContext`, so the Roadmap, Profile and Quiz always show the same numbers. No Redux needed at this size. |
| Styling | **Plain CSS with variables** | The Objective 2 graphic charter (earth palette, three typefaces, tile shape) is stored as CSS variables in `src/styles/global.css`. |
| Graphics | **SVG drawn by React components** | The map, the avatar and every chart are SVG, with no chart library: lighter and fully on-brand. |
| Backend | **Supabase** (Auth + PostgreSQL) **or a built-in mock API** | See section 4. |
| Hosting (planned) | **Netlify** | Static build deployed from Git; `public/_redirects` is already set for client-side routing. |

React was compared with Vue and Angular in Objective 2: it is the most documented, the best tooled
for our needs, and the right size for a two-person project.

Change from Objective 2: we planned Framer Motion for animations. In the end every animation (avatar
jump, cloud lift, pulsing tile, toasts) is done with CSS transitions and `requestAnimationFrame`,
so we dropped that dependency.

---

## 2. The course: 7 chapters, 41 levels

Each chapter is a district of the map with its own scenery, one interactive lab, and a quiz.
All content is in `src/data/content.js`.

| # | Chapter | District on the map | Levels | Lab |
|---|---|---|---|---|
| 1 | Linear Regression | Scatter Plains (meadow, neuron trees) | 6 | Fit a line with sliders, residuals, MSE, least squares |
| 2 | Multiple Linear Regression | Terraced Fields (crop strips, terraces) | 5 | Predict flat prices from area, distance and a one-hot "balcony" feature |
| 3 | Gradient Descent | Descent Canyon (the path runs at the bottom of a ravine) | 6 | Step down a loss valley; 2D contour map; mini-batch and SGD |
| 4 | Logistic Regression | Sigmoid Springs (an S-shaped river) | 6 | Cut-off, sigmoid, threshold, decision boundary, log loss, training |
| 5 | KNN | Neighbor Village (forest, huts, data cubes) | 5 | Drag a point and watch the k nearest vote; feature scaling |
| 6 | Evaluating Models | Measuring Ridge (stone plateaus, gauges, charts) | 7 | Spam-filter threshold: accuracy, precision, recall, F1; overfitting; cross-validation |
| 7 | Build Your First Model (guided project) | The Summit | 6 steps | Problem, explore and clean, split, train, evaluate against a baseline, predict and write a model card |

Every level has a short text, a "Remember" takeaway and a mini-exercise goal (for example "bring the
MSE under 0.5" or "pick the degree with the lowest test error"); the **Complete level** button only
turns on once the goal is reached. Each chapter quiz needs about two thirds right to pass
(2 of 3, 3 of 4), and passing the quiz of a locked level skips ahead to it.

**Sources used to check the content:** Google's
[Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course)
(linear regression, gradient descent and batch size, logistic regression and log loss,
classification metrics) and the scikit-learn user guide on
[cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html).

---

## 3. Features

### Pages (13 routes, 9 of them dynamic)
| Route | Page | What is dynamic |
|---|---|---|
| `/` | Landing | Shows the visitor's own map if signed in |
| `/signup`, `/login` | Authentication | Form validation, errors from the API, redirect back after login |
| `/roadmap` | Roadmap (central page) | District map built from the player's progress, level sheet, avatar jump and chapter-unlock animations, next-level dock |
| `/chapter/:id` | Chapter | Level list with status, **filter** (all / completed / to do) |
| `/lesson/:flat` | Lesson | The chapter's lab in the level's mode, exercise goal, saves progress |
| `/quiz/:flat` | Quiz | One question at a time, instant feedback, skip-ahead on locked levels |
| `/project/:step` | Final project (6 steps) | Each step is its own tile; choices (cleaning, split, trained model) are saved to the account |
| `/profile` | Profile | XP, rank, streak, this week's activity, 8 badges, completed levels, **editable name** |
| `/avatar` | Avatar | Colour and accessory, some unlocked by XP, saved to the account |
| `/leaderboard` | Leaderboard | Ranking from the API, **period filter** (week / all time), **search** by name |
| `/help` | About and help | **Searchable FAQ**, **contact form** sent to the API |
| `*` | 404 | Friendly not-found page |

### The map
Isometric SVG drawn by React (`src/components/map`): one district per chapter with raised ground,
canyon walls, water, and small landmarks (loss-curve signs, sigmoid signs, data cubes, gauges,
chart boards, the summit flag). Each district also has a large stone building beside the path
(`src/components/map/Landmarks.jsx`): a watchtower on the plains, a stepped temple in the fields,
a ruined arch on the canyon rim, a fountain at the springs, a castle in the village, obelisks and
a domed observatory on the ridge, and a shrine on a golden plaza at the summit. Level tiles are grey stone with a lock, green with a check when done, and
terracotta for the current one; stone stairs link the chapters. Clouds cover the districts more
than one chapter ahead and lift when a chapter opens.

### Game rules (`src/services/game.js`)
- Finishing a level gives 40 XP (a quiz that skips several levels also gives 40); every 200 XP is a new rank.
- The streak counts consecutive days with at least one finished level.
- Eight badges are computed from progress, streak and quiz skips.

### User interactions
Live form validation, loading spinners on every save, toast notifications (XP gained, saved,
errors), animated map, dialogs that close with Escape, filters and search.

### Accessibility and responsiveness
- Semantic HTML (`nav`, `main`, `header`, `section`, `aside`), breadcrumb, `aria-live` feedback.
- Every tile, button and draggable point works with the keyboard, with a visible ochre focus ring.
- Level state is never shown by colour alone: a check, a lock or a word always goes with it.
- Contrast of the charter pairs measured above WCAG AA (4.5:1) in Objective 2.
- Animations stop when the system asks for reduced motion.
- Phone, tablet and desktop: on phones the menu moves to a bottom bar.

---

## 4. Backend: Supabase or mock API

All pages talk to one object, `api` (`src/services/api.js`), which has two interchangeable
implementations with the same functions (`signUp`, `logIn`, `getPlayer`, `savePlayer`,
`getLeaderboard`, `sendMessage`…):

- **Mock API** (`src/services/mockApi.js`), used by default. It simulates a server: data is stored
  in the browser's `localStorage`, every call waits 250 ms like a network request, passwords are
  salted and hashed (SHA-256). Good for development and the demo, but data stays in that browser.
- **Supabase** (`src/services/supabaseApi.js`), used automatically when the keys are set. Accounts
  are handled by Supabase Auth; players and contact messages are stored in PostgreSQL with
  row-level security (each player can only change their own row).

### Switching to Supabase
1. Create a free project on [supabase.com](https://supabase.com).
2. In the dashboard, open **SQL Editor**, paste the content of `supabase/schema.sql` and run it.
   (Already ran an older version? The file includes the `alter table` line that adds the `project` column.)
3. Copy `.env.example` to `.env` and fill in the project URL and the `anon` public key
   (**Project Settings > API**).
4. Optional, for quick testing: **Authentication > Providers > Email**, turn off "Confirm email".
5. Restart `npm run dev`. The "Demo mode" note on the login page disappears.

---

## 5. Running the project

Requirements: [Node.js](https://nodejs.org) 20 or newer (tested with Node 26 and npm 11).

```bash
git clone https://github.com/mohamedheditrigui/neuropath.git
cd neuropath
npm install
npm run dev
```

Then open http://localhost:5173. Other commands:

```bash
npm run build     # production build in dist/
npm run preview   # serve the production build locally
```

To try it: create an account on `/signup` (any email format works in demo mode), open the glowing
tile, solve the mini-exercise and press **Complete level**.

### Working together
Create one branch per feature (`git checkout -b feature/my-change`), push it, and open a pull
request on GitHub; merge into `main` after the other person has looked at it.

---

## 6. Project structure

```
neuropath/
├── index.html                 Page shell, fonts
├── public/                    favicon, Netlify _redirects
├── supabase/schema.sql        Database tables, security rules, signup trigger
└── src/
    ├── main.jsx               Entry point: router + providers
    ├── App.jsx                Routes, protected routes
    ├── data/content.js        7 chapters, 41 levels, lesson texts, goals, quizzes
    ├── services/
    │   ├── api.js             Picks Supabase or the mock API
    │   ├── mockApi.js         Simulated API (localStorage)
    │   ├── supabaseApi.js     Real backend
    │   └── game.js            Game rules: XP, streak, unlocking, badges
    ├── context/
    │   ├── PlayerContext.jsx  Signed-in user and progress, shared by all pages
    │   └── ToastContext.jsx   Notifications
    ├── components/
    │   ├── map/               District map: geometry, scenery, Landmarks (castle, temple…), GameMap
    │   ├── labs/              Line, Multi, Descent, Logistic, Knn, Metrics, Overfit labs
    │   ├── layout/            App shell, public header, loading
    │   ├── Avatar.jsx, Icon.jsx, Logo.jsx, ui.jsx
    ├── pages/                 One file per page (Project.jsx holds the 6 project steps)
    └── styles/global.css      Charter tokens and all styles
```

---

## 7. Tests carried out

Checked by hand in the browser (Chrome) on the development server: sign-up validation and account
creation, completing a lesson (map animation, XP, streak), skip-ahead quiz with chapter unlock,
the district map from the plains to the summit, the new labs (least squares, contour map, decision
boundary, feature scaling, overfitting), the six project steps (training, saving, evaluation, model
card), profile, leaderboard filters and search, help search, contact form, and the phone layout
(375 px, no horizontal scroll). A script also checked that every lab goal can be reached (for example
the best log loss is 0.21 against a goal of 0.3, and cross-validation picks degree 2). The
production build (`npm run build`) passes.

Still to do before the final delivery: test on Firefox, Edge and Safari, test with the Supabase
backend, and test with students.

---

## 8. Dependencies

| Package | Role |
|---|---|
| `react`, `react-dom` | UI library |
| `react-router-dom` | Routing |
| `@supabase/supabase-js` | Supabase client (only used when keys are set) |
| `vite`, `@vitejs/plugin-react` | Dev server and build (dev only) |
