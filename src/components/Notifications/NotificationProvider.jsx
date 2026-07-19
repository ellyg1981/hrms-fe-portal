import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import NotificationToast from './NotificationToast';
import { init, reset } from './notificationService';
import './Notifications.css';

export const NotificationContext = createContext(null);

const DEFAULT_DURATIONS = {
  success: 3000,
  info: 4000,
  warning: 5000,
  error: 7000,
  loading: 0,
};

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((options) => {
    const id = ++idRef.current;
    const type = options.type || 'info';
    const duration = options.duration ?? DEFAULT_DURATIONS[type];
    const toast = {
      id,
      type,
      message: options.message || '',
      title: options.title || '',
      duration,
      autoClose: options.autoClose !== false && duration > 0,
      createdAt: Date.now(),
    };
    setToasts((prev) => [...prev, toast]);
    return id;
  }, []);

  const update = useCallback((id, options) => {
    setToasts((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextType = options.type || t.type;
        const nextDuration = options.duration ?? DEFAULT_DURATIONS[nextType];
        return {
          ...t,
          ...options,
          type: nextType,
          duration: nextDuration,
          autoClose: options.autoClose !== false && nextDuration > 0,
        };
      })
    );
  }, []);

  const notify = useMemo(() => ({
    success: (message, options = {}) => add({ type: 'success', message, ...options }),
    error: (message, options = {}) => add({ type: 'error', message, ...options }),
    warning: (message, options = {}) => add({ type: 'warning', message, ...options }),
    info: (message, options = {}) => add({ type: 'info', message, ...options }),
    loading: (message = 'Loading...', options = {}) =>
      add({ type: 'loading', message, ...options, duration: options.duration ?? DEFAULT_DURATIONS.loading }),
    dismiss: remove,
    update,
    promise: async (promise, { loading: loadingMsg, success: successMsg, error: errorMsg } = {}) => {
      const id = add({
        type: 'loading',
        message: typeof loadingMsg === 'string' ? loadingMsg : loadingMsg?.message || 'Processing request...',
        duration: 0,
      });
      try {
        const result = await promise;
        const nextMessage =
          typeof successMsg === 'function' ? successMsg(result) :
          typeof successMsg === 'string' ? successMsg :
          successMsg?.message || 'Operation completed successfully';
        update(id, { type: 'success', message: nextMessage });
        return result;
      } catch (err) {
        const nextMessage =
          typeof errorMsg === 'function' ? errorMsg(err) :
          typeof errorMsg === 'string' ? errorMsg :
          errorMsg?.message || 'An unexpected error occurred. Please try again.';
        update(id, { type: 'error', message: nextMessage });
        throw err;
      }
    },
  }), [add, remove, update]);

  useEffect(() => {
    init(add, remove, update);
    return () => reset();
  }, [add, remove, update]);

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <div className="notification-container" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <NotificationToast key={toast.id} toast={toast} onRemove={remove} />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
