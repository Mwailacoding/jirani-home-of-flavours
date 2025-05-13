import { useState, useEffect } from 'react';
import { useAuth } from './Authcontext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLock, FaArrowLeft, FaCheck, FaEye, FaEyeSlash, FaKey } from 'react-icons/fa';
import { RiShieldKeyholeLine } from 'react-icons/ri';
import axios from 'axios';
import PasswordStrengthBar from 'react-password-strength-bar';

const AdminChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { admin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) setError('');
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisible(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    
    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (passwordStrength < 3) {
      setError("Password is too weak. Please choose a stronger password.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validatePassword()) return;

    setLoading(true);
    
    try {
      await axios.post('/api/admin/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/admin/settings');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          (err.response?.status === 401 ? 'Current password is incorrect' : 
                          'Failed to update password. Please try again.');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #f9fafb 0%, #f3f4f6 100%)',
        padding: '3rem 1rem',
      }}
    >
      <div style={{
        maxWidth: '28rem',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '2rem' }}>
          <motion.button
            onClick={() => navigate('/admin/settings')}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#4f46e5',
              transition: 'color 0.2s',
              marginBottom: '1.5rem'
            }}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaArrowLeft style={{ marginRight: '0.5rem' }} /> Back to Settings
          </motion.button>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              style={{
                backgroundColor: '#e0e7ff',
                padding: '1rem',
                borderRadius: '9999px',
                marginBottom: '1rem'
              }}
            >
              <RiShieldKeyholeLine style={{ color: '#4f46e5', fontSize: '1.5rem' }} />
            </motion.div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center'
            }}>
              <FaLock style={{ marginRight: '0.5rem' }} /> Change Password
            </h1>
            <p style={{ color: '#4b5563', marginTop: '0.5rem' }}>Secure your account with a new password</p>
          </div>

          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={passwordVisible.current ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.5)',
                      transition: 'all 0.2s'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      paddingRight: '0.75rem',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#6b7280',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {passwordVisible.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={passwordVisible.new ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.5)',
                      transition: 'all 0.2s'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      paddingRight: '0.75rem',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#6b7280',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {passwordVisible.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <PasswordStrengthBar 
                  password={formData.newPassword} 
                  onChangeScore={(score) => setPasswordStrength(score)}
                  style={{ marginTop: '0.5rem' }}
                />
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginTop: '0.5rem'
                }}>
                  <p>Password must contain:</p>
                  <ul style={{
                    listStyleType: 'disc',
                    paddingLeft: '1.25rem',
                    marginTop: '0.25rem'
                  }}>
                    <li style={formData.newPassword.length >= 8 ? { color: '#10b981' } : {}}>
                      At least 8 characters
                    </li>
                    <li style={/[A-Z]/.test(formData.newPassword) ? { color: '#10b981' } : {}}>
                      At least one uppercase letter
                    </li>
                    <li style={/[0-9]/.test(formData.newPassword) ? { color: '#10b981' } : {}}>
                      At least one number
                    </li>
                    <li style={/[^A-Za-z0-9]/.test(formData.newPassword) ? { color: '#10b981' } : {}}>
                      At least one special character
                    </li>
                  </ul>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={passwordVisible.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      boxShadow: '0 0 0 2px rgba(79, 70, 229, 0.5)',
                      transition: 'all 0.2s'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '0',
                      paddingRight: '0.75rem',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#6b7280',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {passwordVisible.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#fef2f2',
                    color: '#b91c1c',
                    borderRadius: '0.5rem',
                    border: '1px solid #fecaca',
                    fontSize: '0.875rem'
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#ecfdf5',
                    color: '#047857',
                    borderRadius: '0.5rem',
                    border: '1px solid #a7f3d0',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <FaCheck style={{ marginRight: '0.5rem' }} /> Password updated successfully!
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'white',
                backgroundColor: loading ? '#818cf8' : '#4f46e5',
                outline: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <>
                  <svg 
                    style={{ 
                      animation: 'spin 1s linear infinite',
                      marginRight: '0.75rem',
                      height: '1.25rem',
                      width: '1.25rem'
                    }} 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <FaKey style={{ marginRight: '0.5rem' }} /> Update Password
                </>
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminChangePassword;