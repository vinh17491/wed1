import { useState, useEffect, useRef } from 'react';
import { analyticsApi, adminApi } from '../../api';
import AdminLayout from './AdminLayout';
import './AdminLayout.css';

interface DashboardStats {
  totalVisits: number;
  uniqueIPs: number;
  todayVisits: number;
  visitsByDevice?: Record<string, number>;
  visitsByPage?: Record<string, number>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backupLoading, setBackupLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    analyticsApi.getSummary().then(res => {
      if (!isMounted.current) return;
      setStats(res.data.data);
      setLoading(false);
    }).catch(() => {
      if (!isMounted.current) return;
      setError('Failed to load analytics data.');
      setLoading(false);
    });
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (feedback) { const t = setTimeout(() => setFeedback(null), 4000); return () => clearTimeout(t); }
  }, [feedback]);

  const handleBackup = async () => {
    if (backupLoading) return;
    setBackupLoading(true);
    try {
      const res = await adminApi.backup();
      setFeedback({ type: 'success', message: `Backup successful: ${res.data.message}` });
    } catch {
      setFeedback({ type: 'error', message: 'Backup failed. Please try again.' });
    } finally {
      setBackupLoading(false);
    }
  };

  if (loading) return <AdminLayout title="Dashboard"><div className="loader"><div className="loader__spinner"></div></div></AdminLayout>;

  if (error) return (
    <AdminLayout title="Dashboard">
      <div className="card" style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--error)', marginBottom: 16 }}>❌ {error}</p>
        <button className="btn btn--primary" onClick={() => window.location.reload()}>🔄 Retry</button>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Dashboard">
      {feedback && (
        <div style={{ position:'fixed',top:24,right:24,zIndex:9999,padding:'12px 20px',borderRadius:12,fontWeight:600,fontSize:'0.9rem',
          background:feedback.type==='success'?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)',
          color:feedback.type==='success'?'#10b981':'#ef4444',
          border:`1px solid ${feedback.type==='success'?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.3)'}`,
          backdropFilter:'blur(10px)' }}>
          {feedback.type==='success'?'✅':'❌'} {feedback.message}
        </div>
      )}

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
            {backupLoading ? '⏳ Backing up...' : '📦 Create System Backup'}
          </button>
          <a href="/" target="_blank" className="btn btn--outline">🌐 Preview Website</a>
        </div>
      </div>

      <div className="grid grid--2" style={{ marginTop: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Device Distribution</h3>
          {stats?.visitsByDevice && Object.entries(stats.visitsByDevice).map(([device, count]) => (
            <div key={device} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.9rem' }}>
                <span>{device}</span><span>{count}</span>
              </div>
              <div className="skill-card__bar"><div className="skill-card__bar-fill" style={{ width: `${stats.totalVisits > 0 ? (count / stats.totalVisits) * 100 : 0}%` }}></div></div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Top Pages</h3>
          {stats?.visitsByPage && Object.entries(stats.visitsByPage).slice(0, 5).map(([page, count]) => (
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
