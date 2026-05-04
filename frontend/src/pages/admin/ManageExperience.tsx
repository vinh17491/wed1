import { useState, useEffect } from 'react';
import { experienceApi } from '../../api';
import AdminLayout from './AdminLayout';
import './AdminLayout.css';

export default function ManageExperience() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => { loadExperiences(); }, []);
  useEffect(() => {
    if (feedback) { const t = setTimeout(() => setFeedback(null), 4000); return () => clearTimeout(t); }
  }, [feedback]);

  const loadExperiences = async () => {
    setLoading(true);
    try { const res = await experienceApi.getAll(); setExperiences(res.data.data); }
    catch { setFeedback({ type: 'error', message: 'Failed to load experiences.' }); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (isDeleting) return;
    if (!confirm('Delete this experience?')) return;
    setIsDeleting(id);
    try { await experienceApi.delete(id); setFeedback({ type: 'success', message: 'Experience deleted.' }); loadExperiences(); }
    catch { setFeedback({ type: 'error', message: 'Failed to delete.' }); }
    finally { setIsDeleting(null); }
  };

  const handleEdit = (exp: any) => { setEditing({ ...exp }); setShowModal(true); };
  const handleAddNew = () => {
    setEditing({ company: '', position: '', description: '', location: '', companyLogoUrl: '', startDate: new Date().toISOString(), endDate: null, isCurrent: false, sortOrder: 0 });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!editing.company?.trim()) { setFeedback({ type: 'error', message: 'Company name is required.' }); return; }
    if (!editing.position?.trim()) { setFeedback({ type: 'error', message: 'Position is required.' }); return; }
    if (!editing.startDate) { setFeedback({ type: 'error', message: 'Start date is required.' }); return; }

    setIsSubmitting(true);
    try {
      if (editing.id) { await experienceApi.update(editing.id, editing); }
      else { await experienceApi.create(editing); }
      setFeedback({ type: 'success', message: `Experience ${editing.id ? 'updated' : 'created'}.` });
      setShowModal(false); loadExperiences();
    } catch { setFeedback({ type: 'error', message: 'Failed to save experience.' }); }
    finally { setIsSubmitting(false); }
  };

  const FeedbackToast = () => feedback ? (
    <div style={{ position:'fixed',top:24,right:24,zIndex:9999,padding:'12px 20px',borderRadius:12,fontWeight:600,fontSize:'0.9rem',
      background:feedback.type==='success'?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)',
      color:feedback.type==='success'?'#10b981':'#ef4444',
      border:`1px solid ${feedback.type==='success'?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'}`,
      backdropFilter:'blur(10px)' }}>
      {feedback.type==='success'?'✅':'❌'} {feedback.message}
    </div>
  ) : null;

  return (
    <AdminLayout title="Manage Experience">
      <FeedbackToast />
      <div style={{ marginBottom:20,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <p style={{ color:'var(--text-muted)' }}>Document your professional journey and career milestones</p>
        <button className="btn btn--primary btn--sm" onClick={handleAddNew}>+ Add New Experience</button>
      </div>
      <div className="card" style={{ padding:0,overflow:'hidden' }}>
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Company & Position</th><th>Location</th><th>Period</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ textAlign:'center',padding:40 }}>Loading...</td></tr>
              ) : experiences.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign:'center',padding:40 }}>No experience logs found.</td></tr>
              ) : experiences.map(exp => (
                <tr key={exp.id}>
                  <td>
                    <div style={{ fontWeight:700,color:'var(--text-primary)' }}>{exp.position}</div>
                    <div style={{ fontSize:'0.85rem',color:'var(--accent-1)' }}>{exp.company}</div>
                  </td>
                  <td>{exp.location}</td>
                  <td>
                    <span className="badge" style={{ background:'var(--bg-secondary)',color:'var(--text-secondary)' }}>
                      {new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}
                    </span>
                  </td>
                  <td>
                    <div style={{ display:'flex',gap:8 }}>
                      <button className="btn btn--icon btn--sm" onClick={() => handleEdit(exp)}>✏️</button>
                      <button className="btn btn--icon btn--sm" style={{ color:'var(--error)' }} onClick={() => handleDelete(exp.id)} disabled={isDeleting===exp.id}>{isDeleting===exp.id?'⏳':'🗑️'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay"><div className="modal">
          <div className="modal__header">
            <h2>{editing?.id ? 'Edit Experience' : 'Add New Experience'}</h2>
            <button className="btn btn--icon btn--sm" onClick={() => setShowModal(false)}>✕</button>
          </div>
          <div className="modal__body">
            <form onSubmit={handleSubmit}>
              <div className="grid grid--2">
                <div className="form-group"><label>Company Name</label><input className="input" value={editing.company} onChange={v => setEditing({...editing,company:v.target.value})} required /></div>
                <div className="form-group"><label>Position / Role</label><input className="input" value={editing.position} onChange={v => setEditing({...editing,position:v.target.value})} required /></div>
              </div>
              <div className="form-group"><label>Description</label><textarea className="input" value={editing.description} onChange={v => setEditing({...editing,description:v.target.value})} required rows={4} /></div>
              <div className="grid grid--2">
                <div className="form-group"><label>Location</label><input className="input" value={editing.location} onChange={v => setEditing({...editing,location:v.target.value})} /></div>
                <div className="form-group"><label>Sort Order</label><input type="number" className="input" value={editing.sortOrder} onChange={v => setEditing({...editing,sortOrder:parseInt(v.target.value)})} /></div>
              </div>
              <div className="grid grid--3">
                <div className="form-group"><label>Start Date</label><input type="date" className="input" value={(editing.startDate||'').split('T')[0]} onChange={v => setEditing({...editing,startDate:v.target.value})} required /></div>
                <div className="form-group"><label>End Date</label><input type="date" className="input" disabled={editing.isCurrent} value={editing.endDate ? (editing.endDate||'').split('T')[0] : ''} onChange={v => setEditing({...editing,endDate:v.target.value})} /></div>
                <div className="form-group"><label>I currently work here</label><div style={{ display:'flex',alignItems:'center',height:44 }}><input type="checkbox" checked={editing.isCurrent} onChange={v => setEditing({...editing,isCurrent:v.target.checked,endDate:v.target.checked?null:editing.endDate})} /></div></div>
              </div>
              <div style={{ display:'flex',gap:12,marginTop:12 }}>
                <button type="submit" className="btn btn--primary" disabled={isSubmitting}>{isSubmitting?'⏳ Saving...':'Save Experience'}</button>
                <button type="button" className="btn btn--outline" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div></div>
      )}
    </AdminLayout>
  );
}
