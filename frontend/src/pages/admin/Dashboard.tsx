import { useState, useEffect } from 'react';
import { analyticsApi, adminApi } from '../../api';
import AdminLayout from './AdminLayout';
import './AdminLayout.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [backupLoading, setBackupLoading] = useState(false);

  useEffect(() => {
    analyticsApi.getSummary().then(res => {
      setStats(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      const res = await adminApi.backup();
      alert(`Backup successful: ${res.data.message}`);
    } catch (err) {
      alert('Backup failed');
    } finally {
      setBackupLoading(false);
    }
  };

  if (loading) return <AdminLayout title="Dashboard"><div className="loader"><div className="loader__spinner"></div></div></AdminLayout>;

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid--3">
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon" style={{ background: 'rgba(124,58,237,0.1)', color: 'var(--accent-1)' }}>👁️</div>
          <div className="admin-stat-card__value">{stats?.totalVisits || 0}</div>
          <div className="admin-stat-card__label">Total Visits</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--success)' }}>👥</div>
          <div className="admin-stat-card__value">{stats?.uniqueIPs || 0}</div>
          <div className="admin-stat-card__label">Unique Visitors</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon" style={{ background: 'rgba(37,99,235,0.1)', color: 'var(--accent-2)' }}>📅</div>
          <div className="admin-stat-card__value">{stats?.todayVisits || 0}</div>
          <div className="admin-stat-card__label">Visits Today</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24, padding: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn--primary" onClick={handleBackup} disabled={backupLoading}>
            {backupLoading ? 'Backing up...' : '📦 Create System Backup'}
          </button>
          <a href="/" target="_blank" className="btn btn--outline">🌐 Preview Website</a>
        </div>
      </div>

      <div className="grid grid--2" style={{ marginTop: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Device Distribution</h3>
          {stats?.visitsByDevice && Object.entries(stats.visitsByDevice).map(([device, count]: any) => (
            <div key={device} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.9rem' }}>
                <span>{device}</span>
                <span>{count}</span>
              </div>
              <div className="skill-card__bar"><div className="skill-card__bar-fill" style={{ width: `${(count / stats.totalVisits) * 100}%` }}></div></div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Top Pages</h3>
          {stats?.visitsByPage && Object.entries(stats.visitsByPage).slice(0, 5).map(([page, count]: any) => (
            <div key={page} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.9rem' }}>{page}</span>
              <span style={{ fontWeight: 600 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
