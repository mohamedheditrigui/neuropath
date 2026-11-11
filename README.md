# NeuroPath

**Learn Machine Learning one level at a time.**
SUP'COM web project, Objective 3: development and integration of the main features.
Team: Mohamed Hedi Trigui and Youssef Jmail, 2025/2026.

NeuroPath is a gamified learning path for young engineers. The learner climbs an isometric map of
22 levels across 6 chapters (Linear Regression, Multiple Linear Regression, Gradient Descent, KNN,
Model Performance Metrics, and a final project). Each level is a short lesson with a hands-on lab;
passing it or its quiz unlocks the next tile.

---

## 1. Choice of framework

| Layer | Choice | Why |
|---|---|---|
| Front-end framework | **React 19** with **Vite 7** | Reusable components: one tile, one lesson page and one quiz serve all 22 levels. Vite starts in under a second and rebuilds instantly. |
| Routing | **React Router 7** | Real URLs for every page (`/lesson/3`, `/chapter/2`…), protected routes behind login. |
| Shared state | **React Context + Hooks** | XP, streak and progress live in one `PlayerContext`, so the Roadmap, Profile and Quiz always show the same numbers. No Redux needed at this size. |
| Styling | **Plain CSS with variables** | The Objective 2 graphic charter (earth palette, three typefaces, tile shape) is stored as CSS variables in `src/styles/global.css`. |
| Graphics | **SVG drawn by React components** | The map, the avatar and every chart are SVG, with no chart library: lighter and fully on-brand. |
| Backend | **Supabase** (Auth + PostgreSQL) **or a built-in mock API** | See section 3. |
| Hosting (planned) | **Netlify** | Static build deployed from Git; `public/_redirects` is already set for client-side routing. |

React was compared with Vue and Angular in Objective 2: it is the most documented, the best tooled
for our needs, and the right size for a two-person project.

Change from Objective 2: we planned Framer Motion for animations. In the end every animation (avatar
jump, cloud lift, pulsing tile, toasts) is done with CSS transitions and `requestAnimationFrame`,
so we dropped that dependency.

---

## 2. Features

### Pages (13 routes, 9 of them dynamic)
| Route | Page | What is dynamic |
|---|---|---|
| `/` | Landing | Shows the visitor's own map if signed in |
| `/signup`, `/login` | Authentication | Form validation, errors from the API, redirect back after login |
| `/roadmap` | Roadmap (central page) | Map built from the player's progress, level sheet, avatar jump and chapter-unlock animations, next-level dock |
| `/chapter/:id` | Chapter | Level list with status, **filter** (all / completed / to do) |
| `/lesson/:flat` | Lesson | One interactive lab per chapter, exercise goal per level, saves progress |
| `/quiz/:flat` | Quiz | One question at a time, instant feedback, 2/3 to pass, skip-ahead on locked levels |
| `/project` | Build Your First Model | 4 steps: split the data, train with real gradient descent, test (MAE, R²), predict |
| `/profile` | Profile | XP, rank, streak, this week's activity, badges, completed levels, **editable name** |
| `/avatar` | Avatar | Colour and accessory, some accessories unlocked by XP, saved to the account |
| `/leaderboard` | Leaderboard | Ranking loaded from the API, **period filter** (week / all time), **search** by name |
| `/help` | About and help | **Searchable FAQ**, **contact form** sent to the API |
| `*` | 404 | Friendly not-found page |

### The five interactive labs
- **Linear regression**: drag slope and intercept, the line, the error segments and the MSE update live.
- **Multiple regression**: three sliders (two weights and a bias) predict flat prices; bar chart and MAE.
- **Gradient descent**: pick a learning rate, step down the loss valley, watch it converge or explode.
- **KNN**: drag a point (mouse, touch or arrow keys), choose k, see the neighbours vote.
- **Metrics**: move a spam filter's threshold; accuracy, precision and the confusion matrix update.

### Game rules (`src/services/game.js`)
- Finishing a level gives 40 XP; every 200 XP is a new rank.
- A level opens when the previous one is done, or by passing its quiz (skip ahead).
- The streak counts consecutive days with at least one finished level.
- Six badges are computed from progress, streak and quiz skips.

### User interactions
Live form validation, loading spinners on every save, toast notifications (XP gained, saved,
errors), animated map, dialogs that close with Escape, filters and search.

### Accessibility and responsiveness
- Semantic HTML (`nav`, `main`, `header`, `section`, `aside`), breadcrumb, `aria-live` feedback.
- Every tile and button works with the keyboard, with a visible ochre focus ring.
- Level state is never shown by colour alone: a check, a lock or a word always goes with it.
- Contrast of the charter pairs measured above WCAG AA (4.5:1) in Objective 2.
- Animations stop when the system asks for reduced motion.
- Phone, tablet and desktop: on phones the menu moves to a bottom bar.

---

## 3. Backend: Supabase or mock API

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
3. Copy `.env.example` to `.env` and fill in the project URL and the `anon` public key
   (**Project Settings > API**).
4. Optional, for quick testing: **Authentication > Providers > Email**, turn off "Confirm email".
5. Restart `npm run dev`. The "Demo mode" note on the login page disappears.

---

## 4. Running the project

Requirements: [Node.js](https://nodejs.org) 20 or newer (tested with Node 26 and npm 11).

```bash
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

---

## 5. Project structure

```
neuropath/
├── index.html                 Page shell, fonts
├── public/                    favicon, Netlify _redirects
├── supabase/schema.sql        Database tables, security rules, signup trigger
└── src/
    ├── main.jsx               Entry point: router + providers
    ├── App.jsx                Routes, protected routes
    ├── data/content.js        Chapters, levels, lesson texts, quizzes
    ├── services/
    │   ├── api.js             Picks Supabase or the mock API
    │   ├── mockApi.js         Simulated API (localStorage)
    │   ├── supabaseApi.js     Real backend
    │   └── game.js            Game rules: XP, streak, unlocking, badges
    ├── context/
    │   ├── PlayerContext.jsx  Signed-in user and progress, shared by all pages
    │   └── ToastContext.jsx   Notifications
    ├── components/
    │   ├── map/               Isometric map: geometry, scenery, GameMap
    │   ├── labs/              The five interactive labs
    │   ├── layout/            App shell, public header, loading
    │   ├── Avatar.jsx, Icon.jsx, Logo.jsx, ui.jsx
    ├── pages/                 One file per page
    └── styles/global.css      Charter tokens and all styles
```

---

## 6. Tests carried out

Checked by hand in the browser (Chrome) on the development server:
sign-up validation and account creation, completing a lesson (map animation, XP, streak),
skip-ahead quiz with chapter unlock, every lab, project training, profile, leaderboard filters
and search, help search, contact form validation and sending, and the phone layout (375 px, no
horizontal scroll). The production build (`npm run build`) passes.

Still to do before the final delivery: test on Firefox, Edge and Safari, test with the Supabase
backend, and test with students.

---

## 7. Dependencies

| Package | Role |
|---|---|
| `react`, `react-dom` | UI library |
| `react-router-dom` | Routing |
| `@supabase/supabase-js` | Supabase client (only used when keys are set) |
| `vite`, `@vitejs/plugin-react` | Dev server and build (dev only) |
