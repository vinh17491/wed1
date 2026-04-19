import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts';
import i18n from '../i18n';
import './Navbar.css';

export default function Navbar() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState(i18n.language);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
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
    { href: '/#about', label: t('nav.about') },
    { href: '/#skills', label: t('nav.skills') },
    { href: '/#projects', label: t('nav.projects') },
    { href: '/#experience', label: t('nav.experience') },
    { href: '/#contact', label: t('nav.contact') },
    { href: '/memes', label: t('nav.memes') },
  ];

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.includes('#')) {
      const id = href.split('#')[1];
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
                <a
                  href={link.href}
                  className={`navbar__link ${location.pathname === link.href ? 'navbar__link--active' : ''}`}
                  onClick={() => handleNavClick(link.href)}
                >
                  {link.label}
                </a>
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
          <a
            key={link.href}
            href={link.href}
            className="navbar__mobile-link"
            onClick={() => handleNavClick(link.href)}
          >
            {link.label}
          </a>
        ))}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button className="navbar__lang-btn" onClick={toggleLang}>{lang === 'en' ? 'Tiếng Việt' : 'English'}</button>
          <button className="navbar__theme-btn" onClick={toggleTheme}>{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</button>
        </div>
      </div>
    </>
  );
}
