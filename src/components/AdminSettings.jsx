import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './Authcontext';
import './AdminSettings.css'; // Assuming you have a CSS file for styles
import { 
  FaSave, FaBell, FaChartLine, FaUsers, 
  FaBoxes, FaShieldAlt, FaCog, FaLock 
} from 'react-icons/fa';
import axios from 'axios';


const AdminSettings = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    lowStockThreshold: 10,
    salesReportFrequency: 'weekly'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
    } else {
      fetchAdminSettings();
    }
  }, [admin, navigate]);

  const fetchAdminSettings = async () => {
    try {
      const response = await axios.get('/api/admin/settings', { 
        withCredentials: true 
      });
      setSettings(response.data);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err.response?.data?.error || 'Failed to load settings');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await axios.post('/api/admin/settings', settings, { 
        withCredentials: true 
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="admin-settings-container"
    >
      <div className="settings-header">
        <h1><FaCog /> Admin Settings</h1>
      </div>

      <div className="settings-grid">
        {/* Sidebar Navigation */}
        <div className="settings-sidebar">
          <nav>
            <button onClick={() => navigate('/admin/dashboard')}>
              <FaChartLine /> Dashboard
            </button>
            <button onClick={() => navigate('/admin/products')}>
              <FaBoxes /> Products
            </button>
            <button onClick={() => navigate('/admin/users')}>
              <FaUsers /> Users
            </button>
            <button className="active">
              <FaCog /> Settings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="settings-content">
          <form onSubmit={handleSubmit}>
            <section className="settings-section">
              <h2><FaBell /> Notification Settings</h2>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                  />
                  Receive email notifications
                </label>
              </div>
            </section>

            <section className="settings-section">
              <h2>Inventory Settings</h2>
              <div className="form-group">
                <label>Low stock threshold</label>
                <input
                  type="number"
                  name="lowStockThreshold"
                  value={settings.lowStockThreshold}
                  onChange={handleChange}
                  min="1"
                />
              </div>
            </section>

            <section className="settings-section">
              <h2>Reporting</h2>
              <div className="form-group">
                <label>Sales report frequency</label>
                <select
                  name="salesReportFrequency"
                  value={settings.salesReportFrequency}
                  onChange={handleChange}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </section>

            <section className="settings-section">
              <h2><FaShieldAlt /> Security</h2>
              <button 
                type="button"
                onClick={() => navigate('/admin/change-password')}
                className="secondary-btn"
              >
                <FaLock /> Change Password
              </button>
            </section>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                Settings saved successfully!
              </div>
            )}

            <div className="form-actions">
              <motion.button
                type="submit"
                disabled={loading}
                className="primary-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaSave /> {loading ? 'Saving...' : 'Save Settings'}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSettings;