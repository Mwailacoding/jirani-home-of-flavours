import { useAuth } from './Authcontext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div style={{ display: 'flex', gap: '12px' }}>
        <motion.button
          style={{
            padding: '10px 24px',
            borderRadius: '30px',
            border: 'none',
            background: 'linear-gradient(135deg, #FFA07A 0%, #FF6347 100%)',
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(255, 99, 71, 0.3)',
            fontSize: '14px'
          }}
          onClick={() => navigate('/signin')}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: '0 6px 20px rgba(255, 99, 71, 0.4)',
            background: 'linear-gradient(135deg, #FF8C69 0%, #FF4500 100%)'
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Sign In
          <motion.span
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
              opacity: 0
            }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
        
        <motion.button
          style={{
            padding: '10px 24px',
            borderRadius: '30px',
            border: '2px solid #FF6347',
            background: 'transparent',
            color: '#FF6347',
            fontWeight: '600',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            fontSize: '14px'
          }}
          onClick={() => navigate('/signup')}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: 'rgba(255, 99, 71, 0.1)',
            boxShadow: '0 4px 15px rgba(255, 99, 71, 0.2)'
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Sign Up
          <motion.span
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255,99,71,0.2) 0%, rgba(255,255,255,0) 100%)',
              opacity: 0
            }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      </div>
    );
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ text: "New passwords don't match", type: 'error' });
      return;
    }

    try {
      const response = await fetch('/api/change_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: 'Password changed successfully!', type: 'success' });
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setMessage({ text: '', type: '' });
        }, 1500);
      } else {
        setMessage({ text: data.error || 'Failed to change password', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <motion.div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '8px 16px',
          borderRadius: '50px',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.25)',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        whileHover={{ 
          backgroundColor: 'rgba(255,255,255,0.25)',
          boxShadow: '0 6px 25px rgba(0,0,0,0.15)'
        }}
      >
        {user.customer_photo ? (
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
          }}>
            <img 
              src={`/static/images/${user.customer_photo}`} 
              alt="Profile" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        ) : (
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFA07A 0%, #FF6347 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
          }}>
            {user.username 
              ? user.username.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
              : user.email.substring(0, 2).toUpperCase()}
          </div>
        )}
        
        <motion.div 
          style={{
            color: 'white',
            fontWeight: '600',
            position: 'relative',
            padding: '4px 0',
            fontSize: '15px'
          }}
          animate={{
            x: isDropdownOpen ? 0 : -5,
            textShadow: isDropdownOpen ? '0 0 10px rgba(255,255,255,0.6)' : 'none'
          }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {user.username || user.email.split('@')[0]}
          {isDropdownOpen && (
            <motion.span
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '2px',
                background: 'white',
                transformOrigin: 'left center'
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '12px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              padding: '18px',
              width: '280px',
              zIndex: 1000,
              border: '1px solid rgba(0,0,0,0.05)'
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div style={{ marginBottom: '18px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                marginBottom: '12px'
              }}>
                {user.customer_photo ? (
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid rgba(255,99,71,0.3)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}>
                    <img 
                      src={`/static/images/${user.customer_photo}`} 
                      alt="Profile" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FFA07A 0%, #FF6347 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    border: '2px solid rgba(255,99,71,0.3)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}>
                    {user.username 
                      ? user.username.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                      : user.email.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: '#333',
                    fontSize: '16px'
                  }}>
                    {user.username || user.email.split('@')[0]}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: '#666',
                    marginTop: '3px'
                  }}>
                    {user.email}
                  </div>
                </div>
              </div>

              <div style={{ 
                background: 'rgba(255,99,71,0.08)',
                borderRadius: '8px',
                padding: '12px',
                marginTop: '10px'
              }}>
                {user.phone && (
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#555',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6347">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    {user.phone}
                  </div>
                )}

                {user.address && (
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#555',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6347">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {user.address}
                  </div>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '12px' }}>
              <motion.button
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: '#555',
                  fontWeight: '500',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsPasswordModalOpen(true);
                }}
                whileHover={{ 
                  backgroundColor: 'rgba(255,99,71,0.1)',
                  color: '#FF6347'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Change Password
              </motion.button>

              <motion.button
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: '#555',
                  fontWeight: '500',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '8px',
                  fontSize: '14px',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  logout();
                  navigate('/');
                  setIsDropdownOpen(false);
                }}
                whileHover={{ 
                  backgroundColor: 'rgba(255,99,71,0.1)',
                  color: '#FF6347'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Log Out
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Change Modal */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '25px',
                width: '90%',
                maxWidth: '420px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                border: '1px solid rgba(0,0,0,0.05)'
              }}
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFA07A 0%, #FF6347 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  boxShadow: '0 4px 10px rgba(255,99,71,0.3)'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <h3 style={{ 
                  margin: 0, 
                  color: '#333',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  Change Password
                </h3>
              </div>
              
              {message.text && (
                <motion.div
                  style={{
                    padding: '12px',
                    marginBottom: '20px',
                    borderRadius: '8px',
                    background: message.type === 'error' ? 'rgba(255,99,71,0.1)' : 'rgba(46,125,50,0.1)',
                    color: message.type === 'error' ? '#FF6347' : '#2e7d32',
                    border: `1px solid ${message.type === 'error' ? 'rgba(255,99,71,0.2)' : 'rgba(46,125,50,0.2)'}`,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    {message.type === 'error' ? (
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    ) : (
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    )}
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  {message.text}
                </motion.div>
              )}

              <div style={{ marginBottom: '18px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px'
                }}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  placeholder="Enter current password"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FF6347';
                    e.target.style.boxShadow = '0 0 0 2px rgba(255,99,71,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ddd';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px'
                }}>
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  placeholder="Enter new password"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FF6347';
                    e.target.style.boxShadow = '0 0 0 2px rgba(255,99,71,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ddd';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '25px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#555',
                  fontSize: '14px'
                }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  placeholder="Confirm new password"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#FF6347';
                    e.target.style.boxShadow = '0 0 0 2px rgba(255,99,71,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ddd';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <motion.button
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    background: 'transparent',
                    color: '#555',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setMessage({ text: '', type: '' });
                  }}
                  whileHover={{ 
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    borderColor: '#999'
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #FFA07A 0%, #FF6347 100%)',
                    color: 'white',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontSize: '14px',
                    boxShadow: '0 4px 15px rgba(255,99,71,0.3)'
                  }}
                  onClick={handlePasswordChange}
                  whileHover={{ 
                    background: 'linear-gradient(135deg, #FF8C69 0%, #FF4500 100%)',
                    boxShadow: '0 6px 20px rgba(255,99,71,0.4)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Change Password
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserProfile;