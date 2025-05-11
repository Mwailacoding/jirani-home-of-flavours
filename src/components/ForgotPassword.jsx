import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMail, FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #f5f7fa, #e4e8f0, #f0f4f9, #e9edf2);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 10s ease infinite;
  padding: 2rem;
`;

const AuthCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
  width: 100%;
  max-width: 480px;
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #667eea, #764ba2, #6B8DD6, #8E37D7);
    background-size: 300% 100%;
    animation: ${gradientAnimation} 8s ease infinite;
  }
`;

const AuthTitle = styled.h2`
  color: #2d3748;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const AuthSubtitle = styled.p`
  color: #718096;
  font-size: 0.95rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  
  &:focus-within {
    transform: translateY(-2px);
  }
`;

const InputIcon = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  z-index: 1;
`;

const InputField = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #edf2f7;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: #f8fafc;
  color: #4a5568;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    background-color: white;
  }
  
  &::placeholder {
    color: #cbd5e0;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: linear-gradient(135deg, #5a6fd1 0%, #6a4195 100%);
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(102, 126, 234, 0.25);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%, -50%);
    transform-origin: 50% 50%;
  }
  
  &:focus:not(:active)::after {
    animation: ripple 1s ease-out;
  }
  
  @keyframes ripple {
    0% {
      transform: scale(0, 0);
      opacity: 0.5;
    }
    100% {
      transform: scale(20, 20);
      opacity: 0;
    }
  }
`;

const AuthFooter = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #718096;
  font-size: 0.9rem;
  
  a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
    
    &:hover {
      color: #5a6fd1;
      text-decoration: underline;
    }
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: #5a6fd1;
    transform: translateX(-3px);
  }
`;

const StatusMessage = styled(motion.div)`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  
  &.error {
    background-color: #fff5f5;
    color: #e53e3e;
    border: 1px solid #fed7d7;
  }
  
  &.success {
    background-color: #f0fff4;
    color: #38a169;
    border: 1px solid #c6f6d5;
  }
`;

const TestResetButton = styled.button`
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: linear-gradient(135deg, #3d9e6d 0%, #2f855a 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.25);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const PasswordCriteria = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  border: 1px solid #edf2f7;
  
  h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #4a5568;
  }
  
  ul {
    margin: 0;
    padding-left: 1.25rem;
    font-size: 0.85rem;
    color: #718096;
  }
  
  li {
    margin-bottom: 0.25rem;
  }
`;

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setResendDisabled(false);
        }
    }, [resendTimer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Generate a mock token for testing
            const mockToken = `mock-token-${Math.random().toString(36).substring(2, 15)}`;
            
            setMessage(`Password reset link has been sent to ${email}. For testing, you can use the button below to simulate the reset process.`);
            setEmailSent(true);
            
            // Store the token in localStorage so we can use it in the ResetPassword component
            localStorage.setItem('mockResetToken', mockToken);
            
            // Start resend timer (60 seconds)
            setResendDisabled(true);
            setResendTimer(60);
            
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset link. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendDisabled) return;
        
        setLoading(true);
        setError('');
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage(`New reset link has been sent to ${email}`);
            
            // Reset resend timer
            setResendDisabled(true);
            setResendTimer(60);
            
        } catch (err) {
            setError('Failed to resend email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContainer>
            <AuthCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <BackButton onClick={() => navigate(-1)}>
                    <FiArrowLeft /> Back
                </BackButton>
                
                <AuthTitle>Forgot Password</AuthTitle>
                <AuthSubtitle>
                    {emailSent 
                        ? "Check your email for the reset link" 
                        : "Enter your email to receive a password reset link"}
                </AuthSubtitle>
                
                <AnimatePresence>
                    {error && (
                        <StatusMessage
                            className="error"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <FiAlertCircle size={20} />
                            {error}
                        </StatusMessage>
                    )}
                    
                    {message && (
                        <StatusMessage
                            className="success"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <FiCheckCircle size={20} />
                            <div>
                                {message}
                                <TestResetButton 
                                    onClick={() => navigate(`/resetpassword/${localStorage.getItem('mockResetToken')}`)}
                                >
                                    Test Password Reset
                                </TestResetButton>
                                {emailSent && (
                                    <div style={{ marginTop: '1rem', fontSize: '0.85rem' }}>
                                        Didn't receive the email?{' '}
                                        <button 
                                            onClick={handleResend}
                                            disabled={resendDisabled}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: resendDisabled ? '#a0aec0' : '#667eea',
                                                textDecoration: 'underline',
                                                cursor: resendDisabled ? 'not-allowed' : 'pointer',
                                                padding: 0,
                                                fontWeight: 600
                                            }}
                                        >
                                            {resendDisabled ? `Resend in ${resendTimer}s` : 'Resend now'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </StatusMessage>
                    )}
                </AnimatePresence>
                
                {!emailSent && (
                    <form onSubmit={handleSubmit}>
                        <InputGroup>
                            <InputIcon>
                                <FiMail size={18} />
                            </InputIcon>
                            <InputField
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </InputGroup>
                        
                        <SubmitButton type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner"></span> Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </SubmitButton>
                    </form>
                )}
                
                <PasswordCriteria>
                    <h4>Password requirements:</h4>
                    <ul>
                        <li>Minimum 8 characters</li>
                        <li>At least one uppercase letter</li>
                        <li>At least one number or special character</li>
                    </ul>
                </PasswordCriteria>
                
                <AuthFooter>
                    Remember your password? <a href="/signin">Sign in</a>
                </AuthFooter>
            </AuthCard>
        </AuthContainer>
    );
};

export default ForgotPassword;