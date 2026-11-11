/* Sign up and log in share one form with live validation. */
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { DEFAULT_AVATAR } from '../components/Avatar.jsx';
import GameMap from '../components/map/GameMap.jsx';
import Logo from '../components/Logo.jsx';
import { Spinner } from '../components/ui.jsx';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(kind, f) {
  const e = {};
  if (kind === 'signup' && f.name.trim().length < 2) e.name = 'Enter your first name (2 letters or more).';
  if (!EMAIL.test(f.email.trim())) e.email = 'Enter an email like you@school.tn.';
  if (f.password.length < 8) e.password = 'Use at least 8 characters.';
  if (kind === 'signup' && f.confirm !== f.password) e.confirm = 'The two passwords do not match.';
  return e;
}

export default function Auth({ kind }) {
  const up = kind === 'signup';
  const { signUp, logIn, mode } = usePlayer();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState('');

  const errors = validate(kind, form);
  const show = (k) => (submitted || touched[k]) && errors[k];
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const blur = (k) => () => setTouched({ ...touched, [k]: true });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError('');
    if (Object.keys(errors).length) return;
    setBusy(true);
    try {
      if (up) {
        await signUp({ name: form.name.trim(), email: form.email.trim(), password: form.password });
        toast(`Welcome, ${form.name.trim()}! Your first tile is glowing.`, { icon: 'star' });
      } else {
        await logIn({ email: form.email.trim(), password: form.password });
        toast('Welcome back. Pick up where you left off.', { icon: 'map' });
      }
      navigate(location.state?.from || '/roadmap', { replace: true });
    } catch (err) {
      setServerError(err.message);
      setBusy(false);
    }
  };

  const field = (k, label, props) => (
    <label className="field">
      {label}
      <input
        {...props}
        value={form[k]}
        onChange={set(k)}
        onBlur={blur(k)}
        className={show(k) ? 'bad' : ''}
        aria-invalid={Boolean(show(k))}
        aria-describedby={show(k) ? `${k}-err` : undefined}
      />
      {show(k) && <small id={`${k}-err`}>{errors[k]}</small>}
    </label>
  );

  return (
    <div className="auth">
      <div className="auth-form">
        <Logo />
        <form onSubmit={onSubmit} noValidate>
          <div>
            <h2>{up ? 'Create your account' : 'Welcome back'}</h2>
            <p className="muted" style={{ marginTop: 6 }}>{up ? 'Your progress follows you on any device.' : 'Pick up where you left off.'}</p>
          </div>
          {serverError && <p className="form-error" role="alert">{serverError}</p>}
          {up && field('name', 'Name', { autoComplete: 'given-name', placeholder: 'Your first name' })}
          {field('email', 'Email', { type: 'email', autoComplete: 'email', placeholder: 'you@school.tn' })}
          {field('password', 'Password', { type: 'password', autoComplete: up ? 'new-password' : 'current-password', placeholder: 'At least 8 characters' })}
          {up && field('confirm', 'Confirm password', { type: 'password', autoComplete: 'new-password', placeholder: 'Type it again' })}
          <button className="btn primary big wide" type="submit" disabled={busy}>
            {busy && <Spinner />}
            {up ? 'Create account' : 'Log in'}
          </button>
          <p>{up ? <>Already climbing? <Link to="/login">Log in</Link></> : <>New here? <Link to="/signup">Create an account</Link></>}</p>
          {mode === 'mock' && <p className="note">Demo mode: your account is stored in this browser only.</p>}
        </form>
      </div>
      <div className="auth-art" aria-hidden="true">
        <GameMap progress={4} interactive={false} avatar={DEFAULT_AVATAR} />
      </div>
    </div>
  );
}
