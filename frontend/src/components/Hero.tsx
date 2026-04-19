import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import TextScramble from './TextScramble';
import './Hero.css';

interface Profile {
  fullName: string; title: string; bio: string;
  avatarUrl: string; gitHubUrl: string; linkedInUrl: string;
}

interface HeroProps { profile: Profile | null; loading: boolean; }

export default function Hero({ profile, loading }: HeroProps) {
  const { t } = useTranslation();
  const initials = profile?.fullName?.split(' ').map(n => n[0]).join('') || 'GV';

  if (loading) {
    return (
      <section className="hero">
        <div className="container">
          <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 24, width: 160, marginBottom: 24 }} />
              <div className="skeleton" style={{ height: 64, width: '80%', marginBottom: 16 }} />
              <div className="skeleton" style={{ height: 32, width: '60%', marginBottom: 24 }} />
              <div className="skeleton" style={{ height: 80, width: '100%', marginBottom: 40 }} />
              <div style={{ display: 'flex', gap: 16 }}>
                <div className="skeleton" style={{ height: 48, width: 160, borderRadius: 12 }} />
                <div className="skeleton" style={{ height: 48, width: 160, borderRadius: 12 }} />
              </div>
            </div>
            <div className="skeleton" style={{ width: 380, height: 380, borderRadius: '50%', flexShrink: 0 }} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero noise-bg" id="home">
      <div className="hero__bg">
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
      </div>
      <div className="container">
        <div className="hero__grid">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="hero__tag glass">
              <span className="hero__tag-dot" />
              {t('hero.status')}
            </div>
            <p className="hero__greeting">{t('hero.greeting')}</p>
            <h1 className="hero__name">
              {profile?.fullName ? <TextScramble text={profile.fullName} duration={1200} /> : 'Quách Gia Vinh'}
            </h1>
            <p className="hero__role">
              <span className="gradient-text text-glow">{profile?.title || t('hero.role')}</span>
            </p>
            <p className="hero__description">{profile?.bio}</p>
            <div className="hero__actions">
              <a href="#projects" className="btn btn--primary" onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}>
                {t('hero.cta_work')}
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <a href="#contact" className="btn btn--outline" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
                {t('hero.cta_contact')}
              </a>
            </div>
            <div className="hero__stats">
              <div>
                <div className="hero__stat-value">3+</div>
                <div className="hero__stat-label">{t('hero.exp_label')}</div>
              </div>
              <div>
                <div className="hero__stat-value">20+</div>
                <div className="hero__stat-label">{t('hero.projects_label')}</div>
              </div>
              <div>
                <div className="hero__stat-value">10+</div>
                <div className="hero__stat-label">{t('hero.tech_label')}</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="hero__avatar-wrapper glass">
              <div className="hero__avatar-ring">
                <div className="hero__avatar-ring-inner" />
              </div>
              <div className="hero__avatar-placeholder">{initials}</div>
              <motion.div 
                className="hero__floating-badge hero__floating-badge--1 glass"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {t('hero.badge_1')}
              </motion.div>
              <motion.div 
                className="hero__floating-badge hero__floating-badge--2 glass"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                {t('hero.badge_2')}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="hero__scroll">
        <span>{t('hero.scroll')}</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
}
