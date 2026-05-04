import { useState, useEffect } from 'react';
import { skillsApi } from '../../api';
import AdminLayout from './AdminLayout';
import './AdminLayout.css';

export default function ManageSkills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  // Auto-clear feedback
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const res = await skillsApi.getAll();
      setSkills(res.data.data);
    } catch {
      setFeedback({ type: 'error', message: 'Failed to load skills. Please refresh the page.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (isDeleting) return; // Prevent double-click
    if (!confirm('Are you sure you want to delete this skill?')) return;
    setIsDeleting(id);
    try {
      await skillsApi.delete(id);
      setFeedback({ type: 'success', message: 'Skill deleted successfully.' });
      loadSkills();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to delete skill.' });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (skill: any) => {
    setEditing({ ...skill });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditing({ name: '', category: 'Frontend', proficiencyLevel: 80, iconUrl: '', sortOrder: 0 });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double-click

    // Validation
    if (!editing.name?.trim()) {
      setFeedback({ type: 'error', message: 'Skill name is required.' });
      return;
    }
    if (editing.proficiencyLevel < 0 || editing.proficiencyLevel > 100) {
      setFeedback({ type: 'error', message: 'Proficiency must be between 0 and 100.' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editing.id) {
        await skillsApi.update(editing.id, editing);
      } else {
        await skillsApi.create(editing);
      }
      setFeedback({ type: 'success', message: `Skill ${editing.id ? 'updated' : 'created'} successfully.` });
      setShowModal(false);
      loadSkills();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to save skill. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout title="Manage Skills">
      {/* Feedback Toast */}
      {feedback && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999, padding: '12px 20px',
          borderRadius: 12, fontWeight: 600, fontSize: '0.9rem',
          background: feedback.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
          color: feedback.type === 'success' ? '#10b981' : '#ef4444',
          border: `1px solid ${feedback.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
          backdropFilter: 'blur(10px)', animation: 'fadeIn 0.3s ease'
        }}>
          {feedback.type === 'success' ? '✅' : '❌'} {feedback.message}
        </div>
      )}

      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>List of technical skills shown on your portfolio</p>
        <button className="btn btn--primary btn--sm" onClick={handleAddNew}>+ Add New Skill</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Proficiency</th>
                <th>Sort</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>Loading...</td></tr>
              ) : skills.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>No skills found. Click "Add New" to start.</td></tr>
              ) : (
                skills.map(s => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td><span className="badge">{s.category}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="skill-card__bar" style={{ width: 100 }}><div className="skill-card__bar-fill" style={{ width: `${s.proficiencyLevel}%` }}></div></div>
                        <span style={{ fontSize: '0.8rem' }}>{s.proficiencyLevel}%</span>
                      </div>
                    </td>
                    <td>{s.sortOrder}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn--icon btn--sm" onClick={() => handleEdit(s)}>✏️</button>
                        <button className="btn btn--icon btn--sm" style={{ color: 'var(--error)' }} onClick={() => handleDelete(s.id)} disabled={isDeleting === s.id}>
                          {isDeleting === s.id ? '⏳' : '🗑️'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal__header">
              <h2>{editing?.id ? 'Edit Skill' : 'Add New Skill'}</h2>
              <button className="btn btn--icon btn--sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal__body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Skill Name</label>
                  <input className="input" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} required />
                </div>
                <div className="grid grid--2">
                  <div className="form-group">
                    <label>Category</label>
                    <select className="input" value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Database">Database</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Tools">Tools</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Proficiency ({editing.proficiencyLevel}%)</label>
                    <input type="range" min="0" max="100" className="input" value={editing.proficiencyLevel} onChange={e => setEditing({ ...editing, proficiencyLevel: parseInt(e.target.value) })} />
                  </div>
                </div>
                <div className="grid grid--2">
                  <div className="form-group">
                    <label>Icon URL (Optional)</label>
                    <input className="input" value={editing.iconUrl} onChange={e => setEditing({ ...editing, iconUrl: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Sort Order</label>
                    <input type="number" className="input" value={editing.sortOrder} onChange={e => setEditing({ ...editing, sortOrder: parseInt(e.target.value) })} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                  <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
                    {isSubmitting ? '⏳ Saving...' : 'Save Skill'}
                  </button>
                  <button type="button" className="btn btn--outline" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
