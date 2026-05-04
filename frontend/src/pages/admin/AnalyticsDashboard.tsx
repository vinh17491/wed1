import { useState, useEffect } from 'react';
import { analyticsApi } from '../../api';
import AdminLayout from './AdminLayout';
import './AdminLayout.css';

export default function AnalyticsDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    const controller = new AbortController();
    loadLogs(controller.signal);
    return () => controller.abort();
  }, [page]);

  const loadLogs = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      // Assuming analyticsApi supports signal in axios config
      const res = await analyticsApi.getLogs(page, pageSize, { signal });
      setLogs(res.data.data);
      setTotal(res.data.total);
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      alert('Failed to load analytics logs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <AdminLayout title="Analytics Logs">
      <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Detailed raw visitor data and interaction points</p>
      
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Page Path</th>
                <th>Device</th>
                <th>IP Address</th>
                <th>Timestamp</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>Loading analytics...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>No visitor data found.</td></tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id}>
                    <td><code>{log.page}</code></td>
                    <td>
                      <span className="badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                        {log.deviceType}
                      </span>
                    </td>
                    <td><span style={{ fontSize: '0.85rem' }}>{log.ipAddress}</span></td>
                    <td><span style={{ fontSize: '0.85rem' }}>{formatDate(log.visitTime)}</span></td>
                    <td><span style={{ fontWeight: 600 }}>{log.duration}s</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination">
        <button className="pagination__btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Page {page} of {Math.ceil(total / pageSize) || 1}</span>
        <button className="pagination__btn" disabled={page * pageSize >= total} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </AdminLayout>
  );
}
