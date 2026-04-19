import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Experience.css';

interface Experience {
  id: number; company: string; position: string; description: string;
  location: string; startDate: string; endDate?: string; isCurrent: boolean;
}

interface ExperienceProps { experiences: Experience[]; loading: boolean; }

export default function ExperienceSection({ experiences, loading }: ExperienceProps) {
  const { t } = useTranslation();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section className="section" id="experience">
      <div className="container">
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section__tag">{'// experience'}</span>
          <h2 className="section__title">{t('experience.title')}</h2>
          <p className="section__subtitle">{t('experience.subtitle')}</p>
        </motion.div>

        {loading ? (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 160, borderRadius: 20, marginBottom: 24 }} />
            ))}
          </div>
        ) : (
          <div className="experience__timeline">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                className="experience__item"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="experience__dot-wrapper">
                  <div className="experience__dot" />
                </div>
                <div className="experience__card">
                  <div className="experience__header">
                    <h3 className="experience__position">{exp.position}</h3>
                    <span className={`experience__badge ${exp.isCurrent ? 'experience__badge--current' : 'experience__badge--past'}`}>
                      {exp.isCurrent ? '🟢 ' + t('experience.present') : formatDate(exp.endDate!)}
                    </span>
                  </div>
                  <div className="experience__company">{exp.company}</div>
                  <div className="experience__meta">
                    <span>📅 {formatDate(exp.startDate)} — {exp.isCurrent ? t('experience.present') : exp.endDate ? formatDate(exp.endDate) : ''}</span>
                    {exp.location && <span>📍 {exp.location}</span>}
                  </div>
                  <p className="experience__description">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
