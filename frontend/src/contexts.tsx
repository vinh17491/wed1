import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';
interface ThemeContextType { theme: Theme; toggleTheme: () => void; }
const ThemeContext = createContext<ThemeContextType>({ theme: 'dark', toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

// Auth context
interface User {
  username: string;
  role: string;
}

interface AuthContextType { 
  isAdmin: boolean; 
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, username: string, role: string) => void; 
  logout: () => void; 
}

const AuthContext = createContext<AuthContextType>({ 
  isAdmin: false, 
  isAuthenticated: false,
  user: null,
  login: () => {}, 
  logout: () => {} 
});

/**
 * Safely parse user data from localStorage.
 * Returns null if data is missing, corrupt, or has wrong structure.
 */
const loadUserFromStorage = (): User | null => {
  try {
    const saved = localStorage.getItem('user');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    // Validate structure
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.username === 'string' &&
      typeof parsed.role === 'string'
    ) {
      return parsed as User;
    }
    // Corrupted data — clean up
    console.warn('[Auth] Invalid user data in localStorage, clearing.');
    localStorage.removeItem('user');
    return null;
  } catch (err) {
    console.error('[Auth] Failed to parse user from localStorage:', err);
    localStorage.removeItem('user');
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUserFromStorage);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

  const login = (token: string, username: string, role: string) => {
    if (!token || !username) {
      console.error('[Auth] login called with empty token or username');
      return;
    }
    const userData = { username, role };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ isAdmin, isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
