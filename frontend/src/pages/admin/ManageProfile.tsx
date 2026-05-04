import { useState, useEffect } from 'react';
import { portfolioService } from '../../services/portfolio.service';
import AdminLayout from './AdminLayout';
import './AdminLayout.css';

export default function ManageProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    portfolioService.getProfile().then(data => {
      setProfile(data);
      setLoading(false);
    }).catch(() => {
      setFeedback({ type: 'error', message: 'Failed to load profile.' });
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (feedback) { const t = setTimeout(() => setFeedback(null), 4000); return () => clearTimeout(t); }
  }, [feedback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!profile?.fullName?.trim()) { setFeedback({ type: 'error', message: 'Full name is required.' }); return; }
    if (!profile?.email?.trim()) { setFeedback({ type: 'error', message: 'Email is required.' }); return; }
    // URL validation
    for (const f of ['gitHubUrl', 'linkedInUrl', 'websiteUrl', 'avatarUrl']) {
      const v = profile[f]?.trim();
      if (v && !v.startsWith('http://') && !v.startsWith('https://')) {
        setFeedback({ type: 'error', message: `${f} must start with http(s)://` }); return;
      }
    }
    setSaving(true);
    try {
      await portfolioService.updateProfile(profile);
      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
    } catch {
      setFeedback({ type: 'error', message: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((p: any) => ({ ...p, [name]: value }));
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

  if (loading) return <AdminLayout title="Manage Profile"><div className="loader"><div className="loader__spinner"></div></div></AdminLayout>;

  return (
    <AdminLayout title="Manage Profile">
      <FeedbackToast />
      <form className="card" onSubmit={handleSubmit} style={{ padding: 32, maxWidth: 800 }}>
        <div className="grid grid--2">
          <div className="form-group"><label>Full Name</label><input className="input" name="fullName" value={profile.fullName} onChange={handleChange} required /></div>
          <div className="form-group"><label>Professional Title</label><input className="input" name="title" value={profile.title} onChange={handleChange} required /></div>
        </div>
        <div className="form-group"><label>Bio (Short Description)</label><textarea className="input" name="bio" value={profile.bio} onChange={handleChange} required rows={4} /></div>
        <div className="grid grid--2">
          <div className="form-group"><label>Email Address</label><input className="input" name="email" value={profile.email} onChange={handleChange} required /></div>
          <div className="form-group"><label>Phone Number</label><input className="input" name="phone" value={profile.phone} onChange={handleChange} /></div>
          <div className="form-group"><label>Location</label><input className="input" name="location" value={profile.location} onChange={handleChange} /></div>
          <div className="form-group"><label>Avatar URL</label><input className="input" name="avatarUrl" value={profile.avatarUrl} onChange={handleChange} /></div>
        </div>
        <div className="grid grid--3" style={{ marginTop: 16 }}>
          <div className="form-group"><label>GitHub URL</label><input className="input" name="gitHubUrl" value={profile.gitHubUrl} onChange={handleChange} /></div>
          <div className="form-group"><label>LinkedIn URL</label><input className="input" name="linkedInUrl" value={profile.linkedInUrl} onChange={handleChange} /></div>
          <div className="form-group"><label>Website URL</label><input className="input" name="websiteUrl" value={profile.websiteUrl} onChange={handleChange} /></div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 24 }}>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
