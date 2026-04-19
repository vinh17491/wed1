import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Skills.css';

interface Skill {
  id: number; name: string; category: string;
  proficiencyLevel: number; iconUrl: string; sortOrder: number;
}

interface SkillsProps { skills: Skill[]; loading: boolean; }

export default function Skills({ skills, loading }: SkillsProps) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(skills.map(s => s.category)))];
  const filtered = activeCategory === 'All' ? skills : skills.filter(s => s.category === activeCategory);

  const categoryIcons: Record<string, string> = {
    Frontend: '🎨', Backend: '⚙️', Database: '🗄️', DevOps: '🚀', Mobile: '📱', All: '✨'
  };

  return (
    <section className="section" id="skills">
      <div className="container">
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section__tag">{'// skills'}</span>
          <h2 className="section__title">{t('skills.title')}</h2>
          <p className="section__subtitle">{t('skills.subtitle')}</p>
        </motion.div>

        <div className="skills__categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`skills__category-btn ${activeCategory === cat ? 'skills__category-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {categoryIcons[cat] || '🔧'} {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="skills__grid">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 140, borderRadius: 12 }} />
            ))}
          </div>
        ) : (
          <div className="skills__grid">
            {filtered.map((skill, i) => (
              <motion.div
                key={skill.id}
                className="skill-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="skill-card__name">{skill.name}</div>
                <div className="skill-card__category">{skill.category}</div>
                <div className="skill-card__bar">
                  <div
                    className="skill-card__bar-fill"
                    style={{ width: `${skill.proficiencyLevel}%` }}
                  />
                </div>
                <div className="skill-card__level">{skill.proficiencyLevel}%</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
