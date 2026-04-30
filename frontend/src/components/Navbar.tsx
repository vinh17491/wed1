import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme, useAuth } from '../contexts';
import i18n from '../i18n';
import './Navbar.css';

export default function Navbar() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState(i18n.language);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(prev => prev !== isScrolled ? isScrolled : prev);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLang = () => {
    const next = lang === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('language', next);
    setLang(next);
  };

  const links = [
    { href: '/', label: t('nav.home') },
    { href: '/feedback', label: 'Feedback' },
    { href: '/memes', label: t('nav.memes') },
  ];

  if (isAdmin) {
    links.push({ href: '/admin', label: 'Admin' });
  }

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.includes('#') && location.pathname === '/') {
      const id = href.split('#')[1];
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(href);
    }
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">
          <Link to="/" className="navbar__logo">{'<GV />'}</Link>
          <ul className="navbar__links">
            {links.map(link => (
              <li key={link.href}>
                <button
                  className={`navbar__link ${location.pathname === link.href ? 'navbar__link--active' : ''}`}
                  onClick={() => handleNavClick(link.href)}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="navbar__actions">
            <button className="navbar__lang-btn" onClick={toggleLang}>
              {lang === 'en' ? 'VI' : 'EN'}
            </button>
            <button className="navbar__theme-btn" onClick={toggleTheme}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-blue-400 text-sm font-bold hidden md:block">{user?.username}</span>
                <button 
                  onClick={logout}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1 rounded-lg text-sm font-bold transition-all"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
              >
                Đăng nhập
              </Link>
            )}

            <button
              className="navbar__menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>
      <div className={`navbar__mobile ${mobileOpen ? 'navbar__mobile--open' : ''}`}>
        {links.map(link => (
          <button
            key={link.href}
            className="navbar__mobile-link"
            onClick={() => handleNavClick(link.href)}
          >
            {link.label}
          </button>
        ))}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
          <button className="navbar__lang-btn" onClick={toggleLang}>{lang === 'en' ? 'Tiếng Việt' : 'English'}</button>
          <button className="navbar__theme-btn" onClick={toggleTheme}>{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</button>
          {!isAuthenticated ? (
             <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold w-full text-center">Đăng nhập</Link>
          ) : (
             <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold w-full text-center">Đăng xuất ({user?.username})</button>
          )}
        </div>
      </div>
    </>
  );
}
