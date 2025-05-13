import { useState } from 'react';
import { useAuth } from './Authcontext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaArrowLeft, FaCheck } from 'react-icons/fa';
import axios from 'axios';

const UserChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    
    try {
      await axios.post('/api/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      }, { 
        withCredentials: true 
      });
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'relative'
      }}
    >
      <button
        onClick={() => navigate('/profile')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'none',
          border: 'none',
          color: '#4a5568',
          cursor: 'pointer',
          fontSize: '1rem',
          marginBottom: '2rem',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          transition: 'all 0.2s ease',
          ':hover': {
            backgroundColor: '#f7fafc'
          }
        }}
      >
        <FaArrowLeft /> Back to Profile
      </button>

      <div style={{
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <h1 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#2d3748',
          marginBottom: '2rem',
          fontSize: '1.8rem'
        }}>
          <FaLock /> Change Password
        </h1>

        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <label style={{
              fontSize: '1rem',
              color: '#4a5568',
              fontWeight: '500'
            }}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '5px',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                ':focus': {
                  outline: 'none',
                  borderColor: '#4299e1',
                  boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)'
                }
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <label style={{
              fontSize: '1rem',
              color: '#4a5568',
              fontWeight: '500'
            }}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '5px',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                ':focus': {
                  outline: 'none',
                  borderColor: '#4299e1',
                  boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)'
                }
              }}
            />
            <small style={{
              fontSize: '0.8rem',
              color: '#718096'
            }}>Password must be at least 8 characters</small>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <label style={{
              fontSize: '1rem',
              color: '#4a5568',
              fontWeight: '500'
            }}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '5px',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                ':focus': {
                  outline: 'none',
                  borderColor: '#4299e1',
                  boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.2)'
                }
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#fff5f5',
              color: '#e53e3e',
              borderRadius: '5px',
              border: '1px solid #fed7d7'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '1rem',
              backgroundColor: '#f0fff4',
              color: '#38a169',
              borderRadius: '5px',
              border: '1px solid #c6f6d5',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FaCheck /> Password updated successfully!
            </div>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            style={{
              padding: '1rem',
              backgroundColor: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              ':hover': {
                backgroundColor: '#3182ce'
              },
              ':disabled': {
                backgroundColor: '#a0aec0',
                cursor: 'not-allowed'
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default UserChangePassword;