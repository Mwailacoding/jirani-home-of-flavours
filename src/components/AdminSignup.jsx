import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMobile, FaLock, FaCheckCircle, FaUser, FaArrowLeft, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import './AdminSignup.css';
import { Link } from 'react-router-dom';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Form, 2: Payment
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [countdown, setCountdown] = useState(5);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '2547', // Prefilled with Kenya country code
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [receiptDetails, setReceiptDetails] = useState(null);
  const [adminId, setAdminId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone || formData.phone.length < 12) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerAdmin = async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://hamilton06.pythonanywhere.com/api/admin_signup', {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      setAdminId(response.data.admin_id);
      return response.data.admin_id;
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = error.response?.data?.error || 'Registration failed. Please try again.';
      setErrors({ form: errorMessage });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    setPaymentStatus('processing');
    setErrors({});
    
    try {
      const currentAdminId = adminId || await registerAdmin();
      
      const response = await axios.post('https://hamilton06.pythonanywhere.com/api/mpesapayment', {
        phone: formData.phone,
        amount: 1000,
        admin_id: currentAdminId
      });

      // Check for error message (even if status is 200)
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      // If no error, check for success message
      if (response.data.message === "Payment processed successfully") {
        setReceiptDetails({
          number: response.data.receipt_number,
          amount: 1000,
          phone: formData.phone
        });
        setPaymentStatus('completed');
        setTimeout(() => navigate('/admin/dashboard'), 3000);
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    } catch (error) {
      setPaymentStatus('failed');
      setErrors({
        payment: error.response?.data?.error || 
                error.message || 
                'Payment failed. Please try again.'
      });
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setPaymentStatus('pending');
      setCountdown(5);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="admin-signup-container">
      <button onClick={handleBack} className="back-button">
        <FaArrowLeft /> Back
      </button>

      {step === 1 && (
        <div className="registration-form">
          <h2>Admin Registration</h2>
          {errors.form && <div className="alert alert-danger">{errors.form}</div>}
          
          <div className="form-group">
            <label><FaUser /> Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'is-invalid' : ''}
              required
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>

          <div className="form-group">
            <label><FaUser /> Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'is-invalid' : ''}
              required
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label><FaMobile /> Phone (MPESA)</label>
            <div className={`phone-input ${errors.phone ? 'is-invalid' : ''}`}>
              <span className="prefix">+254</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone.replace('254', '')}
                onChange={(e) => {
                  if (/^\d{0,9}$/.test(e.target.value)) {
                    setFormData({...formData, phone: `254${e.target.value}`});
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                  }
                }}
                pattern="[0-9]{9}"
                required
              />
            </div>
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label><FaLock /> Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'is-invalid' : ''}
              required
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          <button 
            onClick={() => validateForm() && setStep(2)}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Processing...' : 'Continue to Payment'}
          </button>
          <div className="already-have-account">
            <p>Already have an account? <Link to="/admin/signin">Sign in</Link></p>
          </div>  
        </div>
      )}

      {step === 2 && (
        <div className="payment-section">
          <h2>Admin Verification Payment</h2>
          <p className="fee-amount">KSh 1,000 Registration Fee</p>
          
          {paymentStatus === 'pending' && (
            <>
              <div className="payment-instructions">
                <FaMobile className="icon" size={40} />
                <p>You will receive a simulated payment request for:</p>
                <p className="phone-number">+{formData.phone}</p>
                <p className="note">(Payment will auto-approve for demo purposes)</p>
              </div>
              
              <div className="payment-details">
                <div className="detail-row">
                  <span>Amount:</span>
                  <span>KSh 1,000.00</span>
                </div>
                <div className="detail-row">
                  <span>Paybill:</span>
                  <span>454367</span>
                </div>
                <div className="detail-row">
                  <span>Account:</span>
                  <span>ADMIN-REG</span>
                </div>
              </div>
              
              <button 
                onClick={handlePayment}
                className="pay-button"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Initiate Payment'}
              </button>
            </>
          )}

          {paymentStatus === 'processing' && (
            <div className="payment-processing">
              <FaSpinner className="spinner" size={30} />
              <p>Processing payment...</p>
              <p className="instruction">Simulating MPESA PIN entry</p>
            </div>
          )}

          {paymentStatus === 'completed' && (
            <div className="payment-success">
              <FaCheckCircle className="success-icon" size={50} />
              <h3>Payment Successful!</h3>
              {receiptDetails && (
                <div className="receipt-details">
                  <p><strong>Receipt:</strong> {receiptDetails.number}</p>
                  <p><strong>Amount:</strong> KSh {receiptDetails.amount.toFixed(2)}</p>
                  <p><strong>Phone:</strong> +{receiptDetails.phone}</p>
                </div>
              )}
              <p>Redirecting to admin dashboard...</p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="payment-failed">
              <div className="failure-header">
                <FaExclamationTriangle className="failure-icon" size={40} />
                <h3>Payment Failed</h3>
              </div>
              {errors.payment && <p className="error-message">{errors.payment}</p>}
              <p className="support-message">Please try again or contact support</p>
              
              <div className="retry-actions">
                <button 
                  onClick={handlePayment}
                  className="retry-button primary"
                >
                  Retry Payment
                </button>
                <button 
                  className="retry-button secondary"
                  onClick={() => window.location.href = 'jiranis home of flavours'}
                >
                  Contact Support
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSignup;