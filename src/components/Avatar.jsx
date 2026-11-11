/* The player's avatar: a small neuron with dendrites, a colour and one accessory. */

export const AVATAR_COLORS = [
  ['#A84F32', 'Terracotta'],
  ['#5F6D32', 'Moss'],
  ['#C98F2B', 'Ochre'],
  ['#6B4A33', 'Soil'],
  ['#7C9A92', 'River'],
];

// [id, label, XP needed to unlock]
export const ACCESSORIES = [
  ['none', 'None', 0],
  ['scarf', 'Scarf', 0],
  ['glasses', 'Glasses', 0],
  ['hat', 'Explorer hat', 200],
  ['pack', 'Backpack', 500],
];

export const DEFAULT_AVATAR = { color: '#A84F32', acc: 'scarf' };

function lighten(hex) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (v) => Math.round(v + (255 - v) * 0.32);
  return `rgb(${mix(n >> 16)},${mix((n >> 8) & 255)},${mix(n & 255)})`;
}

/* The drawing itself, in a coordinate system centred on the avatar's feet. Reused inside the map. */
export function AvatarParts({ color, acc }) {
  return (
    <>
      {acc === 'pack' && (
        <>
          <rect x="-23" y="-33" width="14" height="24" rx="5" fill="#6B4A33" />
          <rect x="-23" y="-24" width="10" height="3" fill="#2E2118" opacity=".5" />
        </>
      )}
      <ellipse cx="0" cy="0" rx="17" ry="5" fill="#2E2118" opacity=".28" />
      <rect x="-11" y="-6" width="9" height="7" rx="3.5" fill="#2E2118" />
      <rect x="2" y="-6" width="9" height="7" rx="3.5" fill="#2E2118" />
      {acc !== 'hat' && (
        <>
          <path d="M-9-35L-15-50M0-37V-55M9-35L15-50" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="-15" cy="-51" r="3.6" fill="#C98F2B" />
          <circle cx="0" cy="-56" r="3.6" fill="#C98F2B" />
          <circle cx="15" cy="-51" r="3.6" fill="#C98F2B" />
        </>
      )}
      <rect x="-17" y="-38" width="34" height="35" rx="15" fill={color} />
      <ellipse cx="0" cy="-13" rx="10" ry="8" fill={lighten(color)} />
      <circle cx="-6.5" cy="-26" r="5" fill="#FBF6EB" />
      <circle cx="6.5" cy="-26" r="5" fill="#FBF6EB" />
      <circle cx="-5.5" cy="-25.5" r="2.4" fill="#2E2118" />
      <circle cx="7.5" cy="-25.5" r="2.4" fill="#2E2118" />
      <path d="M-4-18q4 3.5 8 0" fill="none" stroke="#2E2118" strokeWidth="1.8" strokeLinecap="round" />
      {acc === 'hat' && (
        <>
          <ellipse cx="0" cy="-36" rx="23" ry="5" fill="#6B4A33" />
          <path d="M-13-37c0-16 26-16 26 0z" fill="#8A6A4A" />
          <rect x="-13" y="-41" width="26" height="4" fill="#2E2118" opacity=".55" />
        </>
      )}
      {acc === 'scarf' && (
        <>
          <rect x="-16" y="-12" width="32" height="7" rx="3.5" fill="#E7D8BC" />
          <rect x="6" y="-10" width="7" height="14" rx="2.5" fill="#E7D8BC" />
          <path d="M8-1h3" stroke="#C98F2B" strokeWidth="1.5" />
        </>
      )}
      {acc === 'glasses' && (
        <g fill="none" stroke="#2E2118" strokeWidth="1.8">
          <circle cx="-6.5" cy="-26" r="6.2" />
          <circle cx="6.5" cy="-26" r="6.2" />
          <path d="M-.3-26h.6" />
        </g>
      )}
    </>
  );
}

export default function Avatar({ avatar = DEFAULT_AVATAR, ...rest }) {
  return (
    <svg viewBox="-28 -62 56 70" aria-hidden="true" {...rest}>
      <AvatarParts color={avatar.color} acc={avatar.acc} />
    </svg>
  );
}
