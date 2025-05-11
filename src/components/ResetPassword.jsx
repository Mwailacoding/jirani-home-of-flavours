import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiLock, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [validToken, setValidToken] = useState(false);

    useEffect(() => {
        // Verify token when component mounts
        const verifyToken = async () => {
            try {
                // For testing, we'll accept any token that starts with "mock-token-"
                if (token.startsWith('mock-token-') || token === localStorage.getItem('mockResetToken')) {
                    setValidToken(true);
                } else {
                    throw new Error('Invalid token');
                }
                
                // In a real app, you would use this:
                // await axios.get(
                //     `https://hamilton06.pythonanywhere.com/api/verify-token?token=${token}`
                // );
                // setValidToken(true);
            } catch (err) {
                setError('Invalid or expired token');
            }
        };
        
        verifyToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            // Simulate API response
            const response = { data: { message: 'Password has been reset successfully!' } };
            
            // In a real app, you would use this:
            // const response = await axios.post(
            //     'https://hamilton06.pythonanywhere.com/api/reset-password',
            //     { token, password },
            //     {
            //         headers: {
            //             'Content-Type': 'application/json'
            //         }
            //     }
            // );
            
            setMessage(response.data.message);
            // Clear the mock token from storage
            localStorage.removeItem('mockResetToken');
            setTimeout(() => navigate('/signin'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (!validToken && error) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Invalid Token</h2>
                    <p className="auth-error">{error}</p>
                    <Link to="/forgotpassword" className="auth-link">
                        Request new reset link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <motion.div 
                className="auth-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2>Create New Password</h2>
                <p>Enter your new password below</p>
                
                {error && <div className="auth-error">{error}</div>}
                {message && (
                    <div className="auth-message">
                        <FiCheck /> {message}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <FiLock className="input-icon" />
                        <input
                            type="password"
                            placeholder="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="8"
                        />
                    </div>
                    
                    <div className="input-group">
                        <FiLock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" disabled={loading}>
                        {loading ? 'Updating...' : 'Reset Password'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;