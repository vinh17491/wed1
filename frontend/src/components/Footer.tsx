import { useTranslation } from 'react-i18next';
import './Footer.css';

export default function Footer({ name }: { name?: string }) {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <span className="footer__logo">{'<GV />'}</span>
        <p className="footer__copy">© {new Date().getFullYear()} {name || 'Gia Vinh'}. {t('footer.rights')}</p>
        <div className="footer__links">
          <a href="/feedback" className="footer__link">Feedback</a>
          <a href="/sitemap.xml" className="footer__link">Sitemap</a>
          <a href="/admin" className="footer__link">Admin</a>
        </div>
      </div>
    </footer>
  );
}
