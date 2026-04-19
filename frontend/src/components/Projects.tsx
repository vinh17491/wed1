import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Projects.css';

interface Project {
  id: number; title: string; description: string; techStack: string;
  imageUrl: string; gitHubUrl: string; liveUrl: string;
  isFeatured: boolean; sortOrder: number; startDate: string; endDate?: string;
}

interface ProjectsProps { projects: Project[]; loading: boolean; }

export default function Projects({ projects, loading }: ProjectsProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  const filtered = filter === 'featured' ? projects.filter(p => p.isFeatured) : projects;

  return (
    <section className="section" id="projects">
      <div className="container">
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section__tag">{'// projects'}</span>
          <h2 className="section__title">{t('projects.title')}</h2>
          <p className="section__subtitle">{t('projects.subtitle')}</p>
        </motion.div>

        <div className="projects__filter">
          <button
            className={`projects__filter-btn ${filter === 'all' ? 'projects__filter-btn--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            {t('projects.all')} ({projects.length})
          </button>
          <button
            className={`projects__filter-btn ${filter === 'featured' ? 'projects__filter-btn--active' : ''}`}
            onClick={() => setFilter('featured')}
          >
            ⭐ {t('projects.featured')} ({projects.filter(p => p.isFeatured).length})
          </button>
        </div>

        {loading ? (
          <div className="projects__grid">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 420, borderRadius: 20 }} />
            ))}
          </div>
        ) : (
          <div className="projects__grid">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="project-card__image">
                  <div className="project-card__image-placeholder">🚀</div>
                  {project.isFeatured && (
                    <span className="project-card__featured">⭐ Featured</span>
                  )}
                  <div className="project-card__overlay">
                    {project.gitHubUrl && (
                      <a href={project.gitHubUrl} target="_blank" rel="noopener noreferrer" className="btn btn--sm btn--outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
                        {t('projects.view_code')}
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn--sm btn--primary">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        {t('projects.view_live')}
                      </a>
                    )}
                  </div>
                </div>
                <div className="project-card__body">
                  <h3 className="project-card__title">{project.title}</h3>
                  <p className="project-card__description">{project.description}</p>
                  <div className="project-card__tech">
                    {project.techStack.split(',').map(tech => (
                      <span key={tech.trim()} className="project-card__tech-tag">{tech.trim()}</span>
                    ))}
                  </div>
                  <div className="project-card__links">
                    {project.gitHubUrl && (
                      <a href={project.gitHubUrl} target="_blank" rel="noopener noreferrer" className="btn btn--outline btn--sm">
                        GitHub
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--sm">
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
