import { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import AdminLayout from './AdminLayout';
import './AdminLayout.css';

export default function ActivityLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 15;

  useEffect(() => {
    loadLogs();
  }, [page]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getLogs(page, pageSize);
      setLogs(res.data.data);
      setTotal(res.data.total);
    } catch {
      alert('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'CREATE': return 'var(--success)';
      case 'UPDATE': return 'var(--warning)';
      case 'DELETE': return 'var(--error)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <AdminLayout title="Activity Logs">
      <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>Track all administrative actions performed in the system</p>
      
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Entity</th>
                <th>Entity ID</th>
                <th>Timestamp</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>Loading logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>No activity logs found.</td></tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id}>
                    <td>
                      <span className="badge" style={{ borderColor: getActionColor(log.action), color: getActionColor(log.action), background: 'transparent' }}>
                        {log.action}
                      </span>
                    </td>
                    <td><span style={{ fontWeight: 600 }}>{log.entityName}</span></td>
                    <td><code>{log.entityId}</code></td>
                    <td><span style={{ fontSize: '0.85rem' }}>{formatDate(log.timestamp)}</span></td>
                    <td style={{ fontSize: '0.85rem' }}>{log.details}</td>
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
