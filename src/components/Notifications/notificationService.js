/**
 * Imperative notification service.
 * Can be used outside React components (e.g. inside API clients or global error handlers).
 * The NotificationProvider initialises the service on mount.
 */

let addToast = null;
let removeToast = null;
let updateToast = null;

const DEFAULT_DURATIONS = {
  success: 3000,
  info: 4000,
  warning: 5000,
  error: 7000,
  loading: 0,
};

export function init(add, remove, update) {
  addToast = add;
  removeToast = remove;
  updateToast = update;
}

export function reset() {
  addToast = null;
  removeToast = null;
  updateToast = null;
}

function ensureInitialised() {
  if (!addToast || !updateToast || !removeToast) {
    // eslint-disable-next-line no-console
    console.warn('Notification service has not been initialised. Wrap your app in NotificationProvider.');
  }
}

function buildOptions(type, message, options = {}) {
  return {
    type,
    message,
    ...options,
    duration: options.duration ?? DEFAULT_DURATIONS[type],
  };
}

export const notificationService = {
  success(message, options) {
    ensureInitialised();
    return addToast ? addToast(buildOptions('success', message, options)) : null;
  },

  error(message, options) {
    ensureInitialised();
    return addToast ? addToast(buildOptions('error', message, options)) : null;
  },

  warning(message, options) {
    ensureInitialised();
    return addToast ? addToast(buildOptions('warning', message, options)) : null;
  },

  info(message, options) {
    ensureInitialised();
    return addToast ? addToast(buildOptions('info', message, options)) : null;
  },

  loading(message = 'Loading...', options = {}) {
    ensureInitialised();
    return addToast
      ? addToast(buildOptions('loading', message, { ...options, duration: options.duration ?? DEFAULT_DURATIONS.loading }))
      : null;
  },

  dismiss(id) {
    if (removeToast) removeToast(id);
  },

  update(id, options = {}) {
    if (updateToast) updateToast(id, options);
  },

  async promise(promise, { loading: loadingMsg, success: successMsg, error: errorMsg } = {}) {
    ensureInitialised();
    if (!addToast || !updateToast) return promise;

    const id = addToast({
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
      updateToast(id, { type: 'success', message: nextMessage });
      return result;
    } catch (err) {
      // 401/session-expiration errors are handled centrally by the AuthProvider.
      // Dismiss the loading toast without showing a duplicate error message.
      if (err?.silent || err?.code === 'UNAUTHORIZED') {
        if (removeToast) removeToast(id);
        throw err;
      }
      const nextMessage =
        typeof errorMsg === 'function' ? errorMsg(err) :
        typeof errorMsg === 'string' ? errorMsg :
        errorMsg?.message || 'An unexpected error occurred. Please try again.';
      updateToast(id, { type: 'error', message: nextMessage });
      throw err;
    }
  },
};

export default notificationService;
