import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light';
interface ThemeContextType { theme: Theme; toggleTheme: () => void; }
const ThemeContext = createContext<ThemeContextType>({ theme: 'dark', toggleTheme: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) return saved;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));

  const login = (token: string, username: string, role: string) => {
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
