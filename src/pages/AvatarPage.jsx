/* Pick a colour and an accessory; some accessories are earned with XP. */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Avatar, { ACCESSORIES, AVATAR_COLORS } from '../components/Avatar.jsx';
import Icon from '../components/Icon.jsx';
import { PageTitle, Spinner } from '../components/ui.jsx';

export default function AvatarPage() {
  const { player, update } = usePlayer();
  const toast = useToast();
  const [cfg, setCfg] = useState(player.avatar);
  const [busy, setBusy] = useState(false);
  const changed = cfg.color !== player.avatar.color || cfg.acc !== player.avatar.acc;

  const save = async () => {
    setBusy(true);
    try {
      await update({ ...player, avatar: cfg });
      toast('Avatar saved. Your map now shows the new look.', { icon: 'palette' });
    } catch {
      toast('Could not save the avatar. Try again.', { icon: 'x', tone: 'bad' });
    }
    setBusy(false);
  };

  return (
    <>
      <PageTitle title="Avatar Customization" sub="This is who jumps from tile to tile on your map." />
      <div className="two">
        <div className="avatar-stage"><Avatar avatar={cfg} /></div>
        <section className="panel" style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gap: 10 }}>
            <h3>Color</h3>
            <div className="swatches">
              {AVATAR_COLORS.map(([c, name]) => (
                <button key={c} type="button" className={`swatch ${c === cfg.color ? 'on' : ''}`} style={{ background: c }} aria-label={name} aria-pressed={c === cfg.color} onClick={() => setCfg({ ...cfg, color: c })} />
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            <h3>Accessory</h3>
            <div className="acc">
              {ACCESSORIES.map(([a, name, need]) => {
                const locked = player.xp < need;
                return (
                  <button key={a} type="button" className={a === cfg.acc ? 'on' : ''} disabled={locked} aria-pressed={a === cfg.acc} onClick={() => setCfg({ ...cfg, acc: a })}>
                    <Avatar avatar={{ color: cfg.color, acc: a }} />
                    <span>{name}</span>
                    {locked && <small><Icon name="lock" /> {need} XP</small>}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="actions">
            <button className="btn primary big" type="button" onClick={save} disabled={!changed || busy}>{busy && <Spinner />}Save avatar</button>
            <Link className="btn big" to="/roadmap">Back to the map</Link>
          </div>
        </section>
      </div>
    </>
  );
}
