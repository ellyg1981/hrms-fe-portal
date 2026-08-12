import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import * as authApi from '../services/authApi';
import {
  SESSION_INACTIVITY_TIMEOUT,
  SESSION_WARNING_TIME,
} from '../config/api';
import { notificationService } from '../components/Notifications/notificationService';
import SessionTimeoutModal from '../components/SessionTimeoutModal/SessionTimeoutModal';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [roles, setRoles] = useState([]);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [warningSeconds, setWarningSeconds] = useState(0);

  const inactivityWarningTimer = useRef(null);
  const inactivityLogoutTimer = useRef(null);
  const hardExpiryWarningTimer = useRef(null);
  const hardExpiryTimer = useRef(null);
  const warningCountdown = useRef(null);

  /* ── Helpers ── */

  const clearTimers = useCallback(() => {
    [inactivityWarningTimer, inactivityLogoutTimer, hardExpiryWarningTimer, hardExpiryTimer].forEach(
      (ref) => {
        if (ref.current) {
          clearTimeout(ref.current);
          ref.current = null;
        }
      }
    );
    if (warningCountdown.current) {
      clearInterval(warningCountdown.current);
      warningCountdown.current = null;
    }
  }, []);

  const startWarningCountdown = useCallback(() => {
    setWarningSeconds(Math.floor(SESSION_WARNING_TIME / 1000));
    if (warningCountdown.current) clearInterval(warningCountdown.current);
    warningCountdown.current = setInterval(() => {
      setWarningSeconds((prev) => {
        if (prev <= 1) {
          if (warningCountdown.current) {
            clearInterval(warningCountdown.current);
            warningCountdown.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopWarningCountdown = useCallback(() => {
    if (warningCountdown.current) {
      clearInterval(warningCountdown.current);
      warningCountdown.current = null;
    }
    setShowWarning(false);
    setWarningSeconds(0);
  }, []);

  /* ── Session actions ── */

  const logout = useCallback(async ({ silent = false, redirect = false } = {}) => {
    clearTimers();
    stopWarningCountdown();
    if (!silent) {
      try {
        await authApi.logout();
      } catch (err) {
        // Even if the API call fails, the client session must be cleared.
      }
    } else {
      authApi.clearAuthStorage();
    }
    setUser(null);
    setPermissions(null);
    setRoles([]);
    setSessionExpiry(null);
    setIsAuthenticated(false);
    if (redirect) {
      window.location.replace('/login');
    }
  }, [clearTimers, stopWarningCountdown]);

  const resetInactivityTimer = useCallback(() => {
    if (!isAuthenticated) return;
    if (inactivityWarningTimer.current) clearTimeout(inactivityWarningTimer.current);
    if (inactivityLogoutTimer.current) clearTimeout(inactivityLogoutTimer.current);

    const warningAt = SESSION_INACTIVITY_TIMEOUT - SESSION_WARNING_TIME;
    const logoutAt = SESSION_INACTIVITY_TIMEOUT;

    inactivityWarningTimer.current = setTimeout(() => {
      setShowWarning(true);
      startWarningCountdown();
    }, warningAt);

    inactivityLogoutTimer.current = setTimeout(() => {
      stopWarningCountdown();
      notificationService.error('Your session has expired. Please log in again.');
      logout({ silent: true, redirect: true });
    }, logoutAt);
  }, [isAuthenticated, logout, startWarningCountdown, stopWarningCountdown]);

  const resetHardExpiryTimers = useCallback(() => {
    if (!isAuthenticated || !sessionExpiry) return;
    if (hardExpiryWarningTimer.current) clearTimeout(hardExpiryWarningTimer.current);
    if (hardExpiryTimer.current) clearTimeout(hardExpiryTimer.current);

    const now = Date.now();
    const timeToExpiry = sessionExpiry - now;

    if (timeToExpiry <= 0) {
      logout({ silent: true, redirect: true });
      return;
    }

    const warningAt = timeToExpiry - SESSION_WARNING_TIME;

    if (warningAt > 0) {
      hardExpiryWarningTimer.current = setTimeout(() => {
        setShowWarning(true);
        startWarningCountdown();
      }, warningAt);
    } else {
      setShowWarning(true);
      startWarningCountdown();
    }

    hardExpiryTimer.current = setTimeout(() => {
      stopWarningCountdown();
      notificationService.error('Your session has expired. Please log in again.');
      logout({ silent: true, redirect: true });
    }, timeToExpiry);
  }, [isAuthenticated, sessionExpiry, logout, startWarningCountdown, stopWarningCountdown]);

  /* ── Core auth actions ── */

  const login = useCallback(async (username, password, rememberMe = false) => {
    setIsLoading(true);
    try {
      const result = await authApi.login({ username, password, rememberMe });
      setUser(result.user);
      setPermissions(result.permissions);
      setRoles(result.user.roles || [result.user.role]);
      setSessionExpiry(result.expiresAt);
      setIsAuthenticated(true);
      return result.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await authApi.refreshSession();
      setSessionExpiry(result.expiresAt);
      stopWarningCountdown();
      resetInactivityTimer();
      resetHardExpiryTimers();
      notificationService.success('Session extended successfully.');
    } catch (err) {
      if (!err?.silent && err?.code !== 'UNAUTHORIZED') {
        notificationService.error(err.message || 'Unable to refresh session. Please log in again.');
      }
      await logout({ silent: true, redirect: true });
    } finally {
      setIsLoading(false);
    }
  }, [logout, resetInactivityTimer, resetHardExpiryTimers, stopWarningCountdown]);

  const can = useCallback(
    (module, action = 'view') => {
      if (!permissions) return false;
      const perms = permissions[module];
      return !!perms && !!perms[action];
    },
    [permissions]
  );

  const hasRole = useCallback(
    (role) => {
      if (!role || !roles?.length) return false;
      return roles.some((r) => String(r).toLowerCase() === String(role).toLowerCase());
    },
    [roles]
  );

  /* ── Initialization: restore session on app start ── */

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const session = await authApi.verifySession();
        if (mounted) {
          if (session) {
            setUser(session.user);
            setPermissions(session.permissions);
            setRoles(session.user?.roles || [session.user?.role]);
            setSessionExpiry(session.expiresAt);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        if (mounted) {
          authApi.clearAuthStorage();
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) setIsInitializing(false);
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  /* ── Global unauthorized listener (e.g. from API client) ── */

  useEffect(() => {
    function handle(e) {
      notificationService.error(e.detail?.message || 'Your session has expired. Please log in again.');
      logout({ silent: true, redirect: true });
    }
    window.addEventListener('hrms:unauthorized', handle);
    return () => window.removeEventListener('hrms:unauthorized', handle);
  }, [logout]);

  /* ── Inactivity tracking ── */

  useEffect(() => {
    if (!isAuthenticated) {
      clearTimers();
      return;
    }

    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'wheel', 'click'];
    const handleActivity = () => resetInactivityTimer();

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    resetInactivityTimer();
    resetHardExpiryTimers();

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, resetInactivityTimer, resetHardExpiryTimers, clearTimers]);

  /* ── Cleanup on unmount ── */

  useEffect(() => {
    return () => {
      clearTimers();
      stopWarningCountdown();
    };
  }, [clearTimers, stopWarningCountdown]);

  const value = {
    isInitializing,
    isLoading,
    isAuthenticated,
    user,
    permissions,
    roles,
    sessionExpiry,
    login,
    logout,
    refreshSession,
    can,
    hasRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {!isInitializing && isAuthenticated && (
        <SessionTimeoutModal
          isOpen={showWarning}
          onContinue={refreshSession}
          onLogout={() => logout({ silent: true, redirect: true })}
          timeLeftSeconds={warningSeconds}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
