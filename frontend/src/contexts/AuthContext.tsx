import React, { createContext, useContext, useState, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, setAccessToken } from '../api';

type User = { id: number; email: string; username: string } | null;

type AuthContextType = {
  user: User;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  async function login(email: string, password: string) {
    const data = await apiLogin(email, password);
    setAccessToken(data.access_token);
    // optionally fetch /users/me
    setUser({ id: data.user?.id || 0, email, username: data.user?.username || '' });
  }

  async function register(username: string, email: string, password: string) {
    await apiRegister(username, email, password);
  }

  async function logout() {
    setUser(null);
    setAccessToken(null);
    await apiLogout();
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
