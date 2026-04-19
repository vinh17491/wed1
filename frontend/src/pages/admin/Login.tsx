import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { useAuth } from '../../contexts';
import './AdminLayout.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authApi.login({ username, password });
      login(res.data.data.token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <form className="card" onSubmit={handleSubmit} style={{ width: 400, padding: 32 }}>
        <h2 style={{ marginBottom: 8, textAlign: 'center' }}>Admin Login</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24, textAlign: 'center' }}>Enter your credentials to manage portfolio</p>
        
        {error && <div className="contact__success" style={{ color: 'var(--error)', background: 'rgba(239,68,68,0.1)', borderColor: 'var(--error)', marginBottom: 16 }}>{error}</div>}
        
        <div className="form-group">
          <label>Username</label>
          <input className="input" value={username} onChange={e => setUsername(e.target.value)} required placeholder="admin" />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
        </div>
        
        <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
          {loading ? 'Logging in...' : 'Sign In'}
        </button>
        
        <a href="/" style={{ display: 'block', textAlign: 'center', marginTop: 16, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Back to Website</a>
      </form>
    </div>
  );
}
