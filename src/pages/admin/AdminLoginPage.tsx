import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('admin@wedding.com');
    setPassword('admin123');
    setLoading(true);
    try {
      await login('admin@wedding.com', 'admin123');
      navigate('/admin');
    } catch (err) {
      console.error('Demo login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white p-3" style={{ background: 'linear-gradient(135deg, #1A0B13 0%, #2A101D 100%)' }}>
      <div className="card border-0 shadow-lg p-4 p-md-5 text-dark rounded-4 max-w-md w-100" style={{ background: '#FFFFFF' }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-25 text-warning mb-2">
            <Sparkles size={36} />
          </div>
          <h3 className="font-heading gold-text-gradient fw-bold mb-1">Wedding Organizer Portal</h3>
          <p className="text-muted small">Sign in to customize and publish your wedding invitation</p>
        </div>

        {error && (
          <div className="alert alert-danger small py-2 text-center rounded-3 mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold small text-muted">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><Mail size={16} /></span>
              <input
                type="email"
                className="form-control"
                placeholder="admin@wedding.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small text-muted">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light"><Lock size={16} /></span>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-warning w-100 py-2.5 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 mb-3"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="text-center border-top pt-3">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="btn btn-outline-secondary btn-sm rounded-pill w-100 fw-medium"
          >
            Instant Demo Login (1-Click)
          </button>
        </div>
      </div>
    </div>
  );
};
