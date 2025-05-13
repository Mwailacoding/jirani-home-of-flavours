import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './Authcontext';
import { FaLock, FaUser, FaSpinner, FaArrowLeft } from 'react-icons/fa';

const AdminSignin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://hamilton06.pythonanywhere.com/api/admin_login',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Check for error message (even if status is 200)
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      // If no error, proceed with login
      if (response.data.message === "Login successful") {
        adminLogin(response.data.admin, response.data.token);
        navigate('/admin/dashboard');
      } else {
        throw new Error('Login failed. Please try again.');
      }
         // Verify session was set
    const sessionCheck = await axios.get('/api/check-auth');
    if (!sessionCheck.data.admin) {
      throw new Error('Session not established');
    }

    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '20px'
    }}>
      <div style={{
        position: 'relative',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '450px'
      }}>
        <button 
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaArrowLeft /> Back
        </button>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '24px' }}>
            Admin Portal
          </h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
            Sign in to access the admin dashboard
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            marginBottom: '20px',
            background: 'rgba(255, 77, 79, 0.1)',
            color: '#ff4d4f',
            borderRadius: '6px',
            border: '1px solid rgba(255, 77, 79, 0.2)',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
              <FaUser style={{ marginRight: '8px' }} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#555', fontSize: '14px' }}>
              <FaLock style={{ marginRight: '8px' }} />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '6px',
              border: 'none',
              background: 'linear-gradient(135deg, #FFA07A 0%, #FF6347 100%)',
              color: 'white',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 15px rgba(255, 99, 71, 0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner" /> Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          <p style={{ margin: '10px 0' }}>
            <button 
              onClick={() => navigate('/forgot-password')}
              style={{
                background: 'none',
                border: 'none',
                color: '#FF6347',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline'
              }}
            >
              Forgot password?
            </button>
          </p>
          <p style={{ margin: '10px 0' }}>
            Not an admin?{' '}
            <button 
              onClick={() => navigate('/signin')}
              style={{
                background: 'none',
                border: 'none',
                color: '#FF6347',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline'
              }}
            >
              User login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignin;