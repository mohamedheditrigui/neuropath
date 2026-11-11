import { Link } from 'react-router-dom';
import { CHAPTERS } from '../data/content.js';
import { usePlayer } from '../context/PlayerContext.jsx';
import { DEFAULT_AVATAR } from '../components/Avatar.jsx';
import GameMap from '../components/map/GameMap.jsx';
import Icon from '../components/Icon.jsx';
import PublicHeader from '../components/layout/PublicHeader.jsx';

export default function Landing() {
  const { user, player } = usePlayer();
  const start = user ? '/roadmap' : '/signup';
  return (
    <div className="page-scroll">
      <PublicHeader />
      <section className="hero">
        <div>
          <p className="eyebrow">Machine Learning for young engineers</p>
          <br />
          <h1>Learn Machine Learning one level at a time.</h1>
          <p className="lead">
            Climb a map of short, hands-on levels. Move sliders, watch the graph react, pass the quiz and unlock the next stretch of the path, all the way to your first trained model.
          </p>
          <div className="cta">
            <Link className="btn primary big" to={start}>
              {user ? 'Continue the climb' : 'Start the climb'} <Icon name="arrow" />
            </Link>
            {!user && <Link className="btn big" to="/login">I have an account</Link>}
          </div>
        </div>
        <div className="hero-map" aria-hidden="true">
          <GameMap progress={player ? player.progress : 4} interactive={false} avatar={player ? player.avatar : DEFAULT_AVATAR} />
        </div>
      </section>

      <section className="band">
        <p className="eyebrow">Why it works</p>
        <br />
        <h2>You learn by touching the math.</h2>
        <div className="grid-3">
          <div className="panel benefit">
            <Icon name="sliders" />
            <h3>Hands on from level one</h3>
            <p className="muted">Sliders and live graphs replace long derivations. You see what each parameter does the moment you move it.</p>
          </div>
          <div className="panel benefit">
            <Icon name="path" />
            <h3>Progress you can see</h3>
            <p className="muted">Every finished level gets a check on the map. XP, streaks and badges keep you coming back.</p>
          </div>
          <div className="panel benefit">
            <Icon name="model" />
            <h3>A real first model</h3>
            <p className="muted">The final chapter walks you through training a model from data to prediction, ready for your CV.</p>
          </div>
        </div>
      </section>

      <section className="band dark">
        <p className="eyebrow">How it works</p>
        <br />
        <h2>Three moves, repeated up the map.</h2>
        <div className="grid-3">
          <div>
            <span className="step-n">1</span>
            <h3>Open a level</h3>
            <p className="muted">Each chapter is a stretch of the path, and each tile is one short lesson.</p>
          </div>
          <div>
            <span className="step-n">2</span>
            <h3>Play with the idea</h3>
            <p className="muted">Adjust the sliders, read the graph and solve a mini-exercise.</p>
          </div>
          <div>
            <span className="step-n">3</span>
            <h3>Unlock the next tile</h3>
            <p className="muted">Finish the level, or pass its quiz to skip ahead. Your avatar jumps forward.</p>
          </div>
        </div>
        <div className="strip" style={{ color: 'var(--ink)' }}>
          {CHAPTERS.map((c) => <span key={c.id}>{c.name}</span>)}
        </div>
      </section>

      <section className="cta-band">
        <h2>Your first tile is waiting.</h2>
        <Link className="btn big" to={start}>{user ? 'Open my map' : 'Create my account'}</Link>
      </section>
      <footer className="foot">
        <span>NeuroPath. SUP&apos;COM web project by Mohamed Hedi Trigui and Youssef Jmail.</span>
        <span><Link to="/help">About and help</Link></span>
      </footer>
    </div>
  );
}
