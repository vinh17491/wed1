import { useState, useEffect } from 'react';
import { feedbackApi } from '../../api';
import AdminLayout from './AdminLayout';
import './AdminLayout.css';

export default function ManageFeedback() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await feedbackApi.getAll();
      setFeedbacks(res.data.data);
    } catch {
      alert('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    try {
      await feedbackApi.delete(id);
      loadFeedbacks();
    } catch {
      alert('Failed to delete feedback');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', color: '#fbbf24' }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s}>{s <= rating ? '★' : '☆'}</span>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout title="Manage Feedback">
      <div style={{ marginBottom: 20 }}>
        <p style={{ color: 'var(--text-muted)' }}>Messages and ratings left by visitors to your portfolio.</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Visitor</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>Loading...</td></tr>
              ) : feedbacks.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>No feedback received yet.</td></tr>
              ) : (
                feedbacks.map(f => (
                  <tr key={f.id}>
                    <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {new Date(f.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{f.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.email}</div>
                    </td>
                    <td>{renderStars(f.rating)}</td>
                    <td style={{ maxWidth: '300px' }}>
                      <div style={{ fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {f.message}
                      </div>
                    </td>
                    <td>
                      <button className="btn btn--icon btn--sm" style={{ color: 'var(--error)' }} onClick={() => handleDelete(f.id)}>🗑️</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
