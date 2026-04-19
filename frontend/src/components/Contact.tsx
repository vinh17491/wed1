import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Contact.css';

interface Profile { email: string; phone: string; location: string; }

export default function Contact({ profile }: { profile: Profile | null }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section className="section" id="contact">
      <div className="container">
        <motion.div
          className="section__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section__tag">{'// contact'}</span>
          <h2 className="section__title">{t('contact.title')}</h2>
          <p className="section__subtitle">{t('contact.subtitle')}</p>
        </motion.div>

        <div className="contact__grid">
          <motion.div
            className="contact__info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>Let's work together</h3>
            <p>I'm always open to discussing product design, engineering projects or opportunities to be part of an ambitious vision.</p>
            <div className="contact__info-items">
              {profile?.email && (
                <div className="contact__info-item">
                  <div className="contact__info-icon">📧</div>
                  <div className="contact__info-text">
                    <label>Email</label>
                    <span>{profile.email}</span>
                  </div>
                </div>
              )}
              {profile?.phone && (
                <div className="contact__info-item">
                  <div className="contact__info-icon">📱</div>
                  <div className="contact__info-text">
                    <label>Phone</label>
                    <span>{profile.phone}</span>
                  </div>
                </div>
              )}
              {profile?.location && (
                <div className="contact__info-item">
                  <div className="contact__info-icon">📍</div>
                  <div className="contact__info-text">
                    <label>Location</label>
                    <span>{profile.location}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form className="contact__form" onSubmit={handleSubmit}>
              <h3>Send me a message</h3>
              <div className="contact__form-row">
                <div className="form-group">
                  <label>{t('contact.name')}</label>
                  <input
                    id="contact-name"
                    className="input"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('contact.email')}</label>
                  <input
                    id="contact-email"
                    type="email"
                    className="input"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input
                  id="contact-subject"
                  className="input"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  placeholder="Project Inquiry"
                />
              </div>
              <div className="form-group">
                <label>{t('contact.message')}</label>
                <textarea
                  id="contact-message"
                  className="input"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell me about your project..."
                  required
                  rows={5}
                />
              </div>
              <button id="contact-submit" type="submit" className="btn btn--primary" disabled={sending}>
                {sending ? (
                  <><div className="loader__spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Sending...</>
                ) : t('contact.send')}
              </button>
              {sent && (
                <div className="contact__success">
                  ✅ {t('contact.success')} I'll get back to you soon!
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
