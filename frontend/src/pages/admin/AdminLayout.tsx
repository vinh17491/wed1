import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '../../contexts';
import './AdminLayout.css';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { to: '/admin/profile', label: 'Profile', icon: '👤' },
  { to: '/admin/skills', label: 'Skills', icon: '⚡' },
  { to: '/admin/projects', label: 'Projects', icon: '🚀' },
  { to: '/admin/experience', label: 'Experience', icon: '💼' },
  { to: '/admin/analytics', label: 'Analytics', icon: '📈' },
  { to: '/admin/logs', label: 'Activity Logs', icon: '📋' },
  { to: '/admin/feedback', label: 'Feedback', icon: '💬' },
];

interface AdminLayoutProps { children: React.ReactNode; title: string; }

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <span>{'<GV Admin />'}</span>
          <div className="admin-sidebar__subtitle">Portfolio Management</div>
        </div>
        <nav className="admin-sidebar__nav">
          <div className="admin-sidebar__section-label">Main</div>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `admin-sidebar__item ${isActive ? 'admin-sidebar__item--active' : ''}`
              }
            >
              <span className="admin-sidebar__icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <button className="admin-sidebar__item" onClick={toggleTheme}>
            <span className="admin-sidebar__icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <a href="/" className="admin-sidebar__item" target="_blank">
            <span className="admin-sidebar__icon">🌐</span>
            View Site
          </a>
          <button className="admin-sidebar__item" onClick={handleLogout} style={{ color: 'var(--error)' }}>
            <span className="admin-sidebar__icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <h1 className="admin-topbar__title">{title}</h1>
          <div className="admin-topbar__actions">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
