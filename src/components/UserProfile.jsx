import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { 
  FaUser, FaSignOutAlt, FaLock, FaUserShield, 
  FaEdit, FaCog, FaPhone, FaMapMarkerAlt, 
  FaSave, FaCamera, FaCheck, FaChevronDown,
  FaMoon, FaSun, FaPalette
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from './Authcontext';

// Theme variables
const THEME = {
  light: {
    primary: '#FF6347',
    secondary: '#6c5ce7',
    background: '#ffffff',
    text: '#333333',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    border: 'rgba(0, 0, 0, 0.1)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    gradient: 'linear-gradient(135deg, #FFA07A 0%, #FF6347 100%)',
  },
  dark: {
    primary: '#FF8C69',
    secondary: '#a29bfe',
    background: '#1a1a2e',
    text: '#f1f1f1',
    cardBg: 'rgba(26, 26, 46, 0.9)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    gradient: 'linear-gradient(135deg, #FF8C69 0%, #e84393 100%)',
  }
};

function UserProfile() {
  const { user, admin, isAdmin, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [theme, setTheme] = useState('light');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Set theme colors
  const colors = THEME[theme];

  useEffect(() => {
    if (user || admin) {
      const currentUser = user || admin;
      setFormData({
        username: currentUser.username || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || ''
      });
      if (currentUser.customer_photo || currentUser.photo) {
        setPhotoPreview(`/uploads/${currentUser.customer_photo || currentUser.photo}`);
      }
    }
  }, [user, admin]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsThemeMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      
      if (e.target.photo?.files[0]) {
        formDataToSend.append('photo', e.target.photo.files[0]);
      }

      const response = await axios.put('/api/profile', formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      updateUser(response.data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user && !admin) {
    return (
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {/* Theme toggle button */}
        <motion.button
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: colors.cardBg,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: colors.shadow,
            color: colors.text
          }}
          onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPalette />
        </motion.button>

        {/* Theme menu */}
        <AnimatePresence>
          {isThemeMenuOpen && (
            <motion.div
              style={{
                position: 'absolute',
                top: '60px',
                right: '0',
                background: colors.cardBg,
                borderRadius: '12px',
                padding: '12px',
                boxShadow: colors.shadow,
                border: `1px solid ${colors.border}`,
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <motion.button
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: theme === 'light' ? colors.primary : 'transparent',
                  color: theme === 'light' ? 'white' : colors.text,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  width: '100%'
                }}
                onClick={() => setTheme('light')}
                whileHover={{ backgroundColor: colors.primary, color: 'white' }}
              >
                <FaSun /> Light
              </motion.button>
              <motion.button
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: theme === 'dark' ? colors.primary : 'transparent',
                  color: theme === 'dark' ? 'white' : colors.text,
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  width: '100%'
                }}
                onClick={() => setTheme('dark')}
                whileHover={{ backgroundColor: colors.primary, color: 'white' }}
              >
                <FaMoon /> Dark
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          style={{
            padding: '12px 24px',
            borderRadius: '30px',
            border: 'none',
            background: colors.gradient,
            color: 'white',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: `0 4px 15px ${colors.primary}30`,
            fontSize: '14px',
            position: 'relative',
            overflow: 'hidden'
          }}
          onClick={() => navigate('/signin')}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: `0 6px 20px ${colors.primary}40`
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span style={{ position: 'relative', zIndex: 2 }}>
            <FaUser /> Sign In
          </span>
          <motion.span
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '30px',
              scale: 0
            }}
            animate={{ scale: isDropdownOpen ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
        
        <motion.button
          style={{
            padding: '12px 24px',
            borderRadius: '30px',
            border: `2px solid ${colors.primary}`,
            background: 'transparent',
            color: colors.primary,
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
            position: 'relative',
            overflow: 'hidden'
          }}
          onClick={() => navigate('/signup')}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: `${colors.primary}20`,
            boxShadow: `0 4px 15px ${colors.primary}20`
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span style={{ position: 'relative', zIndex: 2 }}>
            <FaUser /> Sign up
          </span>
        </motion.button>
        
        <motion.button
          style={{
            padding: '12px 24px',
            borderRadius: '30px',
            border: `2px solid ${colors.secondary}`,
            background: 'transparent',
            color: colors.secondary,
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          onClick={() => navigate('/admin/signup')}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: `${colors.secondary}10`,
            boxShadow: `0 4px 15px ${colors.secondary}20`
          }}
          whileTap={{ scale: 0.95 }}
        >
          <FaUserShield /> Admin
        </motion.button>
      </div>
    );
  }

  const currentUser = user || admin;
  const isUserProfile = !!user;

  const getInitials = () => {
    if (currentUser.username) {
      return currentUser.username.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    if (currentUser.email) {
      return currentUser.email.substring(0, 2).toUpperCase();
    }
    return '??';
  };

  if (editMode && isUserProfile) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="user-profile-container"
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem',
          background: colors.cardBg,
          borderRadius: '20px',
          boxShadow: colors.shadow,
          border: `1px solid ${colors.border}`,
          backdropFilter: 'blur(10px)',
          color: colors.text
        }}
      >
        <div className="profile-header" style={{ marginBottom: '2rem' }}>
          <motion.h1 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              margin: 0,
              color: colors.primary
            }}
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            <FaUser /> Edit Profile
          </motion.h1>
        </div>

        <div className="profile-content" style={{ display: 'flex', gap: '2rem' }}>
          <div className="profile-picture-section" style={{ flex: '0 0 200px' }}>
            <motion.div 
              className="profile-picture-container"
              style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: `3px solid ${colors.primary}`,
                boxShadow: `0 5px 15px ${colors.primary}30`,
                marginBottom: '1rem',
                position: 'relative'
              }}
              whileHover={{ scale: 1.02 }}
            >
              {photoPreview ? (
                <img 
                  src={photoPreview} 
                  alt="Profile" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div 
                  style={{
                    width: '100%',
                    height: '100%',
                    background: colors.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '48px'
                  }}
                >
                  {getInitials()}
                </div>
              )}
            </motion.div>
            
            <div className="photo-upload">
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
              <motion.label 
                htmlFor="photo" 
                style={{
                  display: 'inline-block',
                  padding: '10px 15px',
                  background: colors.primary,
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  fontWeight: '500',
                  fontSize: '14px',
                  boxShadow: `0 4px 10px ${colors.primary}30`
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaCamera /> Change Photo
              </motion.label>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ flex: 1 }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: colors.text
              }}>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  background: colors.cardBg,
                  color: colors.text,
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 2px 5px ${colors.border}`
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: colors.text
              }}>
                Email
              </label>
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                background: `${colors.background}20`,
                color: `${colors.text}80`,
                fontSize: '16px'
              }}>
                {currentUser.email || 'Not provided'}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px', 
                fontWeight: '500',
                color: colors.text
              }}>
                <FaPhone /> Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  background: colors.cardBg,
                  color: colors.text,
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 2px 5px ${colors.border}`
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px', 
                fontWeight: '500',
                color: colors.text
              }}>
                <FaMapMarkerAlt /> Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  background: colors.cardBg,
                  color: colors.text,
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 2px 5px ${colors.border}`,
                  resize: 'vertical',
                  minHeight: '100px'
                }}
              />
            </div>

            {error && (
              <motion.div
                style={{
                  padding: '12px',
                  marginBottom: '1rem',
                  background: '#ffebee',
                  color: '#c62828',
                  borderRadius: '8px',
                  borderLeft: '4px solid #c62828'
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                style={{
                  padding: '12px',
                  marginBottom: '1rem',
                  background: '#e8f5e9',
                  color: '#2e7d32',
                  borderRadius: '8px',
                  borderLeft: '4px solid #2e7d32',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FaCheck /> Profile updated successfully!
              </motion.div>
            )}

            <div style={{ 
              display: 'flex', 
              gap: '12px',
              marginTop: '2rem',
              justifyContent: 'flex-end'
            }}>
              <motion.button
                type="button"
                onClick={() => navigate('/change-password')}
                style={{
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.primary}`,
                  background: 'transparent',
                  color: colors.primary,
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
                whileHover={{ 
                  background: `${colors.primary}10`
                }}
                whileTap={{ scale: 0.98 }}
              >
                <FaLock /> Change Password
              </motion.button>

              <motion.button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    username: currentUser.username || '',
                    email: currentUser.email || '',
                    phone: currentUser.phone || '',
                    address: currentUser.address || ''
                  });
                  setPhotoPreview(currentUser.customer_photo ? `/uploads/${currentUser.customer_photo}` : '');
                }}
                style={{
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: `1px solid ${colors.border}`,
                  background: 'transparent',
                  color: colors.text,
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                whileHover={{ 
                  background: `${colors.border}`
                }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: colors.gradient,
                  color: 'white',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: `0 4px 15px ${colors.primary}40`
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{ position: 'relative', zIndex: 2 }}>
                  <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                </span>
                {loading && (
                  <motion.span
                    style={{
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      height: '3px',
                      background: 'rgba(255,255,255,0.5)',
                      borderRadius: '8px'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Theme toggle button */}
      <motion.button
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: colors.cardBg,
          border: `1px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: colors.shadow,
          color: colors.text,
          marginRight: '12px'
        }}
        onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaPalette />
      </motion.button>

      {/* Theme menu */}
      <AnimatePresence>
        {isThemeMenuOpen && (
          <motion.div
            style={{
              position: 'absolute',
              top: '60px',
              right: '0',
              background: colors.cardBg,
              borderRadius: '12px',
              padding: '12px',
              boxShadow: colors.shadow,
              border: `1px solid ${colors.border}`,
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <motion.button
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: theme === 'light' ? colors.primary : 'transparent',
                color: theme === 'light' ? 'white' : colors.text,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                width: '100%'
              }}
              onClick={() => setTheme('light')}
              whileHover={{ backgroundColor: colors.primary, color: 'white' }}
            >
              <FaSun /> Light
            </motion.button>
            <motion.button
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: theme === 'dark' ? colors.primary : 'transparent',
                color: theme === 'dark' ? 'white' : colors.text,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                width: '100%'
              }}
              onClick={() => setTheme('dark')}
              whileHover={{ backgroundColor: colors.primary, color: 'white' }}
            >
              <FaMoon /> Dark
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          borderRadius: '50px',
          background: `${colors.cardBg}`,
          backdropFilter: 'blur(8px)',
          boxShadow: colors.shadow,
          border: `1px solid ${colors.border}`,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        whileHover={{ 
          backgroundColor: `${colors.primary}10`,
          boxShadow: `0 6px 25px ${colors.primary}20`
        }}
      >
        {currentUser.photo || currentUser.customer_photo ? (
          <motion.div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: `2px solid ${colors.primary}`,
              boxShadow: `0 3px 10px ${colors.primary}20`,
              position: 'relative'
            }}
            whileHover={{ rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <img 
              src={`/uploads/${currentUser.photo || currentUser.customer_photo}`} 
              alt="Profile" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </motion.div>
        ) : (
          <motion.div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: colors.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '14px',
              border: `2px solid ${colors.primary}`,
              boxShadow: `0 3px 10px ${colors.primary}20`
            }}
            whileHover={{ rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            {getInitials()}
          </motion.div>
        )}
        
        <motion.span
          style={{
            color: colors.text,
            fontWeight: '600',
            fontSize: '14px',
            position: 'relative'
          }}
          animate={{
            x: isDropdownOpen ? 0 : -5,
            textShadow: isDropdownOpen ? `0 0 10px ${colors.primary}40` : 'none'
          }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {currentUser.username || currentUser.email?.split('@')[0] || 'User'}
        </motion.span>

        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text
          }}
          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown size={12} />
        </motion.div>

        {/* Active indicator */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50px',
            scale: 0
          }}
          animate={{ scale: isDropdownOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',
              right: 0,
              background: colors.cardBg,
              borderRadius: '16px',
              boxShadow: colors.shadow,
              padding: '16px',
              width: '320px',
              zIndex: 1000,
              border: `1px solid ${colors.border}`,
              backdropFilter: 'blur(12px)',
              overflow: 'hidden'
            }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Profile header with 3D effect */}
            <motion.div 
              style={{ 
                background: colors.gradient,
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '16px',
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
              whileHover={{ rotateY: 5 }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                marginBottom: '12px',
                transform: 'translateZ(20px)'
              }}>
                {currentUser.photo || currentUser.customer_photo ? (
                  <motion.div 
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: `3px solid rgba(255,255,255,0.3)`,
                      boxShadow: `0 5px 15px rgba(0,0,0,0.2)`,
                      flexShrink: 0
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img 
                      src={`/uploads/${currentUser.photo || currentUser.customer_photo}`} 
                      alt="Profile" 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div 
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '20px',
                      border: `3px solid rgba(255,255,255,0.3)`,
                      boxShadow: `0 5px 15px rgba(0,0,0,0.2)`,
                      flexShrink: 0
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {getInitials()}
                  </motion.div>
                )}
                <div style={{ transform: 'translateZ(20px)' }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    color: 'white',
                    fontSize: '16px',
                    textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }}>
                    {currentUser.username || currentUser.email?.split('@')[0] || 'User'}
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: 'rgba(255,255,255,0.9)',
                    marginTop: '4px',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }}>
                    {currentUser.email || 'No email provided'}
                  </div>
                </div>
              </div>

              {isUserProfile && (
                <motion.div 
                  style={{ 
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '12px',
                    backdropFilter: 'blur(5px)'
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {currentUser.phone && (
                    <div style={{ 
                      fontSize: '14px', 
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FaPhone />
                      {currentUser.phone}
                    </div>
                  )}
                  {currentUser.address && (
                    <div style={{ 
                      fontSize: '14px', 
                      color: 'rgba(255,255,255,0.9)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}>
                      <FaMapMarkerAlt style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{currentUser.address}</span>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>

            <div style={{ 
              borderTop: `1px solid ${colors.border}`, 
              paddingTop: '12px',
              maxHeight: '300px',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: `${colors.primary} ${colors.border}`
            }}>
              {/* Custom scrollbar */}
              <style>
                {`
                  ::-webkit-scrollbar {
                    width: 6px;
                  }
                  ::-webkit-scrollbar-track {
                    background: ${colors.border};
                    border-radius: 10px;
                  }
                  ::-webkit-scrollbar-thumb {
                    background: ${colors.primary};
                    border-radius: 10px;
                  }
                  ::-webkit-scrollbar-thumb:hover {
                    background: ${colors.primary}90;
                  }
                `}
              </style>

              {isUserProfile && (
                <>
                  <motion.button
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      color: colors.text,
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
                      setEditMode(true);
                    }}
                    whileHover={{ 
                      backgroundColor: `${colors.primary}10`,
                      color: colors.primary,
                      paddingLeft: '15px'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: `${colors.primary}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.primary
                    }}>
                      <FaEdit size={12} />
                    </div>
                    Edit Profile
                  </motion.button>

                  <motion.button
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'transparent',
                      color: colors.text,
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
                      navigate('/profile');
                    }}
                    whileHover={{ 
                      backgroundColor: `${colors.primary}10`,
                      color: colors.primary,
                      paddingLeft: '15px'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: `${colors.primary}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: colors.primary
                    }}>
                      <FaUser size={12} />
                    </div>
                    View Profile
                  </motion.button>
                </>
              )}

              <motion.button
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: colors.text,
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
                  navigate(isUserProfile ? '/change-password' : '/admin/change-password');
                }}
                whileHover={{ 
                  backgroundColor: `${colors.primary}10`,
                  color: colors.primary,
                  paddingLeft: '15px'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: `${colors.primary}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: colors.primary
                }}>
                  <FaLock size={12} />
                </div>
                Change Password
              </motion.button>

              {!isUserProfile && (
                <motion.button
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    color: colors.text,
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
                    navigate('/admin/settings');
                  }}
                  whileHover={{ 
                    backgroundColor: `${colors.secondary}10`,
                    color: colors.secondary,
                    paddingLeft: '15px'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: `${colors.secondary}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.secondary
                  }}>
                    <FaCog size={12} />
                  </div>
                  Admin Settings
                </motion.button>
              )}

              <div style={{ 
                height: '1px', 
                background: colors.border, 
                margin: '12px 0',
                opacity: 0.5
              }}></div>

              <motion.button
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: '#ff4d4f',
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
                  logout();
                  navigate('/');
                  setIsDropdownOpen(false);
                }}
                whileHover={{ 
                  backgroundColor: 'rgba(255,77,79,0.1)',
                  paddingLeft: '15px'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: 'rgba(255,77,79,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ff4d4f'
                }}>
                  <FaSignOutAlt size={12} />
                </div>
                Log Out
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserProfile;