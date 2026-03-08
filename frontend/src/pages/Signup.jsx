import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice';
import './Auth.css';

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [formError, setFormError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
    return () => dispatch(clearError());
  }, [isAuthenticated]); // eslint-disable-line

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setFormError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    dispatch(register({ username: form.username, email: form.email, password: form.password }));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🎬 CineVerse</div>
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join CineVerse and start exploring!</p>

        {(error || formError) && <div className="auth-error">{formError || error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="moviefan123"
              minLength={3}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
