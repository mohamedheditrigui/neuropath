/* Rounded-stroke icon set from the NeuroPath charter. Usage: <Icon name="check" /> */
const PATHS = {
  map: <><path d="M12 21l-8-4.5 8-4.5 8 4.5z" /><path d="M12 12L7 9.2 12 6.5l5 2.7z" /><circle cx="12" cy="3.2" r="1.2" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21c1-4.2 4-6.2 7.5-6.2s6.5 2 7.5 6.2" /></>,
  palette: <><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-.5-1.5-.5-2.5 1-2 2.5-2h2c1.7 0 3-1.2 3-3 0-4.5-4-8.5-9-8.5z" /><circle cx="7.5" cy="11" r="1" /><circle cx="11" cy="7" r="1" /><circle cx="16" cy="8.5" r="1" /></>,
  trophy: <path d="M8 4h8v6a4 4 0 0 1-8 0zM8 6H4c0 3 1.5 5 4 5.5M16 6h4c0 3-1.5 5-4 5.5M12 14v4M8 21h8M9.5 18h5" />,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.3 9.3a2.8 2.8 0 1 1 4 2.6c-.9.5-1.3 1-1.3 2M12 17.2v.1" /></>,
  flame: <path d="M12 3c.6 3.5 5.5 5.5 5.5 11a5.5 5.5 0 0 1-11 0c0-2.2 1-3.7 2.2-4.8.2 1.6 1 2.5 1.8 2.8C10.3 9 10.5 5.5 12 3z" />,
  bolt: <path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z" />,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  list: <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r=".8" /><circle cx="4.5" cy="12" r=".8" /><circle cx="4.5" cy="18" r=".8" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  sliders: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>,
  path: <><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7" /></>,
  model: <><circle cx="5" cy="6" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><path d="M7 6.7l3.3 4M7 17.3l3.3-4M14 12h3" /></>,
  star: <path d="M12 3l2.7 5.8 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3.1 1.2-6.2L3 9.6l6.3-.8z" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 6.5l8.5 6.5 8.5-6.5" /></>,
  logout: <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h10" />,
};

export default function Icon({ name, className = 'icon', ...rest }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {PATHS[name]}
    </svg>
  );
}
