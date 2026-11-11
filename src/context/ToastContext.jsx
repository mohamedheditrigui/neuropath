/* Small notification system: toast('+40 XP', { icon: 'bolt' }) from anywhere. */
import { createContext, useCallback, useContext, useState } from 'react';
import Icon from '../components/Icon.jsx';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const toast = useCallback(
    (text, { icon = 'check', tone = 'good', ms = 3500 } = {}) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((list) => [...list.slice(-2), { id, text, icon, tone }]);
      setTimeout(() => dismiss(id), ms);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.tone}`}>
            <Icon name={t.icon} />
            <span>{t.text}</span>
            <button type="button" aria-label="Dismiss" onClick={() => dismiss(t.id)}>
              <Icon name="x" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
