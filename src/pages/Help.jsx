/* About, searchable FAQ and a contact form. Works signed in (inside the app) or as a public page. */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { api } from '../services/api.js';
import AppShell from '../components/layout/AppShell.jsx';
import Loading from '../components/layout/Loading.jsx';
import PublicHeader from '../components/layout/PublicHeader.jsx';
import Icon from '../components/Icon.jsx';
import { Spinner } from '../components/ui.jsx';

const FAQ = [
  ['How do I unlock a level?', "Finish the level before it, or pass the locked level's quiz to skip ahead."],
  ['What happens if I fail a quiz?', 'Nothing is lost. Your score shows at once, you can review the lesson and try again as often as you like.'],
  ['How do I complete a lesson?', 'Each lesson has a mini-exercise. Reach its goal (for example an error below a target) and the Complete button turns on.'],
  ['Will my progress follow me?', 'Yes. Your account saves your XP, streak, badges and completed levels. With the Supabase backend you can continue on any device.'],
  ['How does the streak work?', 'Finish at least one level a day. Skip a day and the streak starts again from one.'],
  ['How do I unlock new accessories?', 'Some avatar accessories need XP: the explorer hat at 200 XP and the backpack at 500 XP.'],
  ['Do I need to install anything?', 'No. NeuroPath runs in your browser, on a computer or a phone.'],
  ['Do I need a math background?', 'Basic algebra is enough. The first level starts from what a prediction is.'],
];
const SUBJECTS = ['A question about a lesson', 'A bug or display problem', 'An idea for NeuroPath', 'Something else'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ContactForm() {
  const { user, player } = usePlayer();
  const toast = useToast();
  const empty = { name: player?.name || '', email: user?.email || '', subject: '', message: '' };
  const [form, setForm] = useState(empty);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const errors = {};
  if (form.name.trim().length < 2) errors.name = 'Enter your name.';
  if (!EMAIL.test(form.email.trim())) errors.email = 'Enter an email like you@school.tn.';
  if (!form.subject) errors.subject = 'Choose a subject.';
  if (form.message.trim().length < 10) errors.message = `Write at least 10 characters (${form.message.trim().length}/10).`;
  const bad = (k) => submitted && errors[k];
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError('');
    if (Object.keys(errors).length) return;
    setBusy(true);
    try {
      await api.sendMessage({ name: form.name.trim(), email: form.email.trim(), subject: form.subject, message: form.message.trim() });
      setSent(true);
      toast('Message sent. Thank you!', { icon: 'mail' });
      setForm({ ...empty, subject: '', message: '' });
      setSubmitted(false);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  return (
    <form className="panel" style={{ display: 'grid', gap: 14 }} onSubmit={onSubmit} noValidate>
      <h3>Contact the team</h3>
      {sent && <p className="form-ok" role="status">Message sent. Thank you for helping us improve NeuroPath.</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <label className="field">
        Name
        <input value={form.name} onChange={set('name')} className={bad('name') ? 'bad' : ''} aria-invalid={Boolean(bad('name'))} autoComplete="name" />
        {bad('name') && <small>{errors.name}</small>}
      </label>
      <label className="field">
        Email
        <input type="email" value={form.email} onChange={set('email')} className={bad('email') ? 'bad' : ''} aria-invalid={Boolean(bad('email'))} autoComplete="email" />
        {bad('email') && <small>{errors.email}</small>}
      </label>
      <label className="field">
        Subject
        <select value={form.subject} onChange={set('subject')} className={bad('subject') ? 'bad' : ''} aria-invalid={Boolean(bad('subject'))}>
          <option value="">Choose…</option>
          {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
        </select>
        {bad('subject') && <small>{errors.subject}</small>}
      </label>
      <label className="field">
        Message
        <textarea value={form.message} onChange={set('message')} className={bad('message') ? 'bad' : ''} aria-invalid={Boolean(bad('message'))} maxLength={1000} />
        {bad('message') && <small>{errors.message}</small>}
      </label>
      <button className="btn primary" type="submit" disabled={busy} style={{ justifySelf: 'start' }}>{busy && <Spinner />}Send message</button>
    </form>
  );
}

function HelpContent() {
  const { user } = usePlayer();
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const results = FAQ.filter(([a, b]) => !q || a.toLowerCase().includes(q) || b.toLowerCase().includes(q));

  return (
    <>
      <section className="ch-banner" style={{ background: 'var(--ochre-d)' }}>
        <p className="eyebrow">About NeuroPath</p>
        <h1>Machine Learning, learned by doing.</h1>
        <p>An interactive path for young engineering students, built as a SUP&apos;COM web project by Mohamed Hedi Trigui and Youssef Jmail.</p>
      </section>
      <div className="two">
        <section style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
          <h2>Help</h2>
          <label className="search">
            <Icon name="search" />
            <span className="sr-only">Search the help</span>
            <input type="search" placeholder="Search the help, e.g. streak" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <div>
            {results.map(([a, b], i) => (
              <details key={a} open={i === 0 && !q ? true : q ? true : undefined}>
                <summary>{a}</summary>
                <p>{b}</p>
              </details>
            ))}
            {results.length === 0 && <p className="empty panel">No answer matches “{query}”. Ask us with the form.</p>}
          </div>
        </section>
        <aside style={{ display: 'grid', gap: 20 }}>
          <div className="panel" style={{ display: 'grid', gap: 10 }}>
            <h3>New here?</h3>
            <p className="muted">Your map starts in the Scatter Plains with Linear Regression. Follow the next glowing tile.</p>
            <Link className="btn primary" to={user ? '/roadmap' : '/signup'}>{user ? 'Open my Roadmap' : 'Create my account'}</Link>
          </div>
          <ContactForm />
        </aside>
      </div>
    </>
  );
}

export default function Help() {
  const { user, player, ready } = usePlayer();
  if (!ready) return <Loading />;
  if (user && player) return <AppShell><HelpContent /></AppShell>;
  return (
    <div className="page-scroll">
      <PublicHeader />
      <div className="content"><HelpContent /></div>
    </div>
  );
}
