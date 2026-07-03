import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const DEMO_USERS = [
  { username: 'steven.mzena', password: 'Uhamiaji@123', name: 'Steven Mzena', role: 'staff', email: 'steven.mzena@immigration.go.tz' },
  { username: 'goodluck.msuya', password: 'Uhamiaji@123', name: 'Goodluck Msuya', role: 'staff', email: 'goodluck.msuya@immigration.go.tz' },
  { username: 'john.mkosamali', password: 'Uhamiaji@123', name: 'John Mkosamali', role: 'staff', email: 'john.mkosamali@immigration.go.tz' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const local = localStorage.getItem('hrms_user');
    if (local) return JSON.parse(local);
    const session = sessionStorage.getItem('hrms_user_session');
    if (session) return JSON.parse(session);
    return null;
  });

  const login = (username, password, rememberMe = false) => {
    const found = DEMO_USERS.find(u => u.username === username);
    if (!found || found.password !== password) {
      throw new Error('Invalid username or password');
    }
    const userData = { name: found.name, username: found.username, email: found.email, role: found.role };
    setUser(userData);
    if (rememberMe) {
      localStorage.setItem('hrms_user', JSON.stringify(userData));
      sessionStorage.removeItem('hrms_user_session');
    } else {
      sessionStorage.setItem('hrms_user_session', JSON.stringify(userData));
      localStorage.removeItem('hrms_user');
    }
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrms_user');
    sessionStorage.removeItem('hrms_user_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
