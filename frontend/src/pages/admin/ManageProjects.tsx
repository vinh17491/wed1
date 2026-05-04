import { useState, useEffect } from 'react';
import { projectsApi } from '../../api';
import AdminLayout from './AdminLayout';
import './AdminLayout.css';

export default function ManageProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => { loadProjects(); }, []);
  useEffect(() => {
    if (feedback) { const t = setTimeout(() => setFeedback(null), 4000); return () => clearTimeout(t); }
  }, [feedback]);

  const loadProjects = async () => {
    setLoading(true);
    try { const res = await projectsApi.getAll(); setProjects(res.data.data); }
    catch { setFeedback({ type: 'error', message: 'Failed to load projects.' }); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (isDeleting) return;
    if (!confirm('Delete this project?')) return;
    setIsDeleting(id);
    try { await projectsApi.delete(id); setFeedback({ type: 'success', message: 'Project deleted.' }); loadProjects(); }
    catch { setFeedback({ type: 'error', message: 'Failed to delete.' }); }
    finally { setIsDeleting(null); }
  };

  const handleEdit = (p: any) => { setEditing({ ...p }); setShowModal(true); };
  const handleAddNew = () => {
    setEditing({ title: '', description: '', techStack: '', imageUrl: '', gitHubUrl: '', liveUrl: '', isFeatured: false, sortOrder: 0, startDate: new Date().toISOString(), endDate: null });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!editing.title?.trim()) { setFeedback({ type: 'error', message: 'Title is required.' }); return; }
    // URL validation
    for (const f of ['gitHubUrl', 'liveUrl', 'imageUrl']) {
      const v = editing[f]?.trim();
      if (v && !v.startsWith('http://') && !v.startsWith('https://')) {
        setFeedback({ type: 'error', message: `${f} must start with http(s)://` }); return;
      }
    }
    setIsSubmitting(true);
    try {
      if (editing.id) { await projectsApi.update(editing.id, editing); }
      else { await projectsApi.create(editing); }
      setFeedback({ type: 'success', message: `Project ${editing.id ? 'updated' : 'created'}.` });
      setShowModal(false); loadProjects();
    } catch { setFeedback({ type: 'error', message: 'Failed to save project.' }); }
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
    <AdminLayout title="Manage Projects">
      <FeedbackToast />
      <div style={{ marginBottom:20,display:'flex',justifyContent:'space-between',alignItems:'center' }}>
        <p style={{ color:'var(--text-muted)' }}>Showcase your best work with detailed information</p>
        <button className="btn btn--primary btn--sm" onClick={handleAddNew}>+ Add New Project</button>
      </div>
      <div className="card" style={{ padding:0,overflow:'hidden' }}>
        <div className="table-wrapper">
          <table className="table">
            <thead><tr><th>Project</th><th>Tech Stack</th><th>Featured</th><th>Sort</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign:'center',padding:40 }}>Loading...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign:'center',padding:40 }}>No projects found.</td></tr>
              ) : projects.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                      <div style={{ width:48,height:32,borderRadius:4,background:'var(--bg-secondary)',overflow:'hidden' }}>
                        {p.imageUrl ? <img src={p.imageUrl} alt={p.title} style={{ width:'100%',height:'100%',objectFit:'cover' }} /> : <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center' }}>🚀</div>}
                      </div>
                      <div style={{ fontWeight:600 }}>{p.title}</div>
                    </div>
                  </td>
                  <td><div className="flex gap-1 flex-wrap">{(p.techStack || '').split(',').filter(Boolean).slice(0,3).map((t:string) => <span key={t} className="badge text-[0.7rem]">{t.trim()}</span>)}</div></td>
                  <td>{p.isFeatured ? '✅ Yes' : '❌ No'}</td>
                  <td>{p.sortOrder}</td>
                  <td>
                    <div style={{ display:'flex',gap:8 }}>
                      <button className="btn btn--icon btn--sm" onClick={() => handleEdit(p)}>✏️</button>
                      <button className="btn btn--icon btn--sm" style={{ color:'var(--error)' }} onClick={() => handleDelete(p.id)} disabled={isDeleting===p.id}>{isDeleting===p.id?'⏳':'🗑️'}</button>
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
            <h2>{editing?.id ? 'Edit Project' : 'Add New Project'}</h2>
            <button className="btn btn--icon btn--sm" onClick={() => setShowModal(false)}>✕</button>
          </div>
          <div className="modal__body">
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Project Title</label><input className="input" value={editing.title} onChange={e => setEditing({...editing,title:e.target.value})} required /></div>
              <div className="form-group"><label>Description</label><textarea className="input" value={editing.description} onChange={e => setEditing({...editing,description:e.target.value})} required rows={4} /></div>
              <div className="grid grid--2">
                <div className="form-group"><label>Tech Stack (Comma Separated)</label><input className="input" value={editing.techStack} onChange={e => setEditing({...editing,techStack:e.target.value})} placeholder="React, Node.js, SQL" required /></div>
                <div className="form-group"><label>Image URL</label><input className="input" value={editing.imageUrl} onChange={e => setEditing({...editing,imageUrl:e.target.value})} /></div>
              </div>
              <div className="grid grid--2">
                <div className="form-group"><label>GitHub URL</label><input className="input" value={editing.gitHubUrl} onChange={e => setEditing({...editing,gitHubUrl:e.target.value})} /></div>
                <div className="form-group"><label>Live URL</label><input className="input" value={editing.liveUrl} onChange={e => setEditing({...editing,liveUrl:e.target.value})} /></div>
              </div>
              <div className="grid grid--3">
                <div className="form-group"><label>Featured</label><div style={{ display:'flex',alignItems:'center',height:44 }}><input type="checkbox" checked={editing.isFeatured} onChange={e => setEditing({...editing,isFeatured:e.target.checked})} /></div></div>
                <div className="form-group"><label>Sort Order</label><input type="number" className="input" value={editing.sortOrder} onChange={e => setEditing({...editing,sortOrder:parseInt(e.target.value)})} /></div>
                <div className="form-group"><label>Start Date</label><input type="date" className="input" value={(editing.startDate||'').split('T')[0]} onChange={e => setEditing({...editing,startDate:e.target.value})} /></div>
              </div>
              <div style={{ display:'flex',gap:12,marginTop:12 }}>
                <button type="submit" className="btn btn--primary" disabled={isSubmitting}>{isSubmitting?'⏳ Saving...':'Save Project'}</button>
                <button type="button" className="btn btn--outline" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div></div>
      )}
    </AdminLayout>
  );
}
