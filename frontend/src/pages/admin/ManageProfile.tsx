import { useState, useEffect } from 'react';
import { portfolioService } from '../../services/portfolio.service';
import AdminLayout from './AdminLayout';
import './AdminLayout.css';

export default function ManageProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    portfolioService.getProfile().then(data => {
      setProfile(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await portfolioService.updateProfile(profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((p: any) => ({ ...p, [name]: value }));
  };

  if (loading) return <AdminLayout title="Manage Profile"><div className="loader"><div className="loader__spinner"></div></div></AdminLayout>;

  return (
    <AdminLayout title="Manage Profile">
      <form className="card" onSubmit={handleSubmit} style={{ padding: 32, maxWidth: 800 }}>
        <div className="grid grid--2">
          <div className="form-group">
            <label>Full Name</label>
            <input className="input" name="fullName" value={profile.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Professional Title</label>
            <input className="input" name="title" value={profile.title} onChange={handleChange} required />
          </div>
        </div>
        
        <div className="form-group">
          <label>Bio (Short Description)</label>
          <textarea className="input" name="bio" value={profile.bio} onChange={handleChange} required rows={4} />
        </div>

        <div className="grid grid--2">
          <div className="form-group">
            <label>Email Address</label>
            <input className="input" name="email" value={profile.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input className="input" name="phone" value={profile.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input className="input" name="location" value={profile.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Avatar URL</label>
            <input className="input" name="avatarUrl" value={profile.avatarUrl} onChange={handleChange} />
          </div>
        </div>

        <div className="grid grid--3" style={{ marginTop: 16 }}>
          <div className="form-group">
            <label>GitHub URL</label>
            <input className="input" name="gitHubUrl" value={profile.gitHubUrl} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input className="input" name="linkedInUrl" value={profile.linkedInUrl} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Website URL</label>
            <input className="input" name="websiteUrl" value={profile.websiteUrl} onChange={handleChange} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 24 }}>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
          {success && <span style={{ color: 'var(--success)', fontWeight: 600 }}>✅ Profile updated successfully!</span>}
        </div>
      </form>
    </AdminLayout>
  );
}
