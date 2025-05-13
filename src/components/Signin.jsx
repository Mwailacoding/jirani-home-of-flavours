import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./Authcontext";
import { FiMail, FiLock, FiArrowRight, FiUserPlus, FiKey } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Signin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Floating particles effect
    useEffect(() => {
        const particles = [];
        const colors = ["#6c63ff", "#ff6584", "#48bb78", "#f6ad55"];
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement("div");
            particle.style.position = "absolute";
            particle.style.width = `${Math.random() * 10 + 5}px`;
            particle.style.height = particle.style.width;
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.borderRadius = "50%";
            particle.style.opacity = "0.5";
            particle.style.zIndex = "1";
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.left = `${Math.random() * 100}%`;
            
            document.querySelector(".particles-container").appendChild(particle);
            particles.push(particle);
            
            // Animate particles
            const duration = Math.random() * 20 + 10;
            particle.style.animation = `float ${duration}s linear infinite`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
        }
        
        return () => {
            particles.forEach(p => p.remove());
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        try {
            const formPayload = new URLSearchParams();
            formPayload.append("email", formData.email);
            formPayload.append("password", formData.password);

            const response = await axios.post(
                "https://hamilton06.pythonanywhere.com/api/signin",
                formPayload,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    timeout: 10000000
                }
            );

            if (response.data.message === "Login successful" && response.data.user) {
                login(response.data.user);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                
                setTimeout(() => {
                    const redirectTo = location.state?.from?.pathname || "/";
                    navigate(redirectTo, { replace: true });
                }, 1000);
            } else {
                setError(response.data.error || "Invalid credentials");
            }
        } catch (err) {
            console.error("Login error:", err);
            
            if (err.response) {
                if (err.response.status === 401) {
                    setError("Invalid email or password");
                } else if (err.response.status === 404) {
                    setError("User not found");
                } else {
                    setError(err.response.data?.error || "Server error occurred");
                }
            } else if (err.request) {
                setError("Network error. Please check your connection.");
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signin-container">
            <div className="particles-container"></div>
            
            <motion.div 
                className="auth-card"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="card-header">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Welcome Back
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        Sign in to access your account
                    </motion.p>
                </div>
                
                <AnimatePresence>
                    {error && (
                        <motion.div 
                            className="alert"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="alert-content">
                                <div className="alert-icon">!</div>
                                {error}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit}>
                    <motion.div 
                        className={`form-group ${activeField === "email" ? "active" : ""}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <label htmlFor="email">
                            <FiMail className="input-icon" />
                            <span>Email address</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setActiveField("email")}
                            onBlur={() => setActiveField(null)}
                            required
                            disabled={loading}
                        />
                        <div className="input-highlight"></div>
                    </motion.div>

                    <motion.div 
                        className={`form-group ${activeField === "password" ? "active" : ""}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <label htmlFor="password">
                            <FiLock className="input-icon" />
                            <span>Password</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            onFocus={() => setActiveField("password")}
                            onBlur={() => setActiveField(null)}
                            required
                            disabled={loading}
                        />
                        <div className="input-highlight"></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        <button
                            type="submit"
                            className={`auth-button ${isHovered ? "hover-effect" : ""}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In <FiArrowRight className="button-icon" />
                                </>
                            )}
                        </button>
                    </motion.div>

                    <motion.div 
                        className="auth-footer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                    >
                        <p>
                            <Link to="/signup">
                                <FiUserPlus className="link-icon" /> Create an account
                            </Link>
                        </p>
                        <p>
            Admin user?{' '}
            <button 
              className="btn btn-link p-0" 
              onClick={() => navigate('/admin/signin')}
            >
              Admin login
            </button>
          </p>
                        <p>
                        <Link to="/forgot-password" className="auth-link">
    <FiKey className="link-icon" /> Forgot password?
</Link>
                        </p>
                    </motion.div>
                </form>
            </motion.div>

            <style jsx global>{`
                @keyframes float {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 0.5;
                    }
                    50% {
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateY(-100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `}</style>

            <style jsx>{`
                .signin-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    font-family: 'Poppins', sans-serif;
                    position: relative;
                    overflow: hidden;
                    padding: 2rem;
                }
                
                .particles-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    z-index: 1;
                }
                
                .auth-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(15px);
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
                    padding: 2.5rem;
                    width: 100%;
                    max-width: 450px;
                    position: relative;
                    z-index: 2;
                    transition: all 0.5s ease;
                }
                
                .auth-card:hover {
                    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.3);
                    transform: translateY(-5px);
                }
                
                .card-header {
                    margin-bottom: 2rem;
                    text-align: center;
                }
                
                .card-header h2 {
                    font-weight: 700;
                    color: white;
                    margin-bottom: 0.5rem;
                    font-size: 2rem;
                    background: linear-gradient(90deg, #6c63ff, #ff6584);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                
                .card-header p {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 1rem;
                }
                
                .form-group {
                    position: relative;
                    margin-bottom: 2rem;
                }
                
                .form-group label {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.8rem;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.95rem;
                }
                
                .input-icon {
                    margin-right: 0.75rem;
                    color: #6c63ff;
                    font-size: 1.2rem;
                }
                
                input {
                    width: 100%;
                    padding: 1rem 1rem 1rem 3rem;
                    border: none;
                    border-radius: 10px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: 1px solid transparent;
                }
                
                input:focus {
                    outline: none;
                    border-color: #6c63ff;
                    background: rgba(108, 99, 255, 0.1);
                }
                
                .input-highlight {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 2px;
                    width: 0;
                    background: linear-gradient(90deg, #6c63ff, #ff6584);
                    transition: all 0.4s ease;
                }
                
                .form-group.active .input-highlight {
                    width: 100%;
                }
                
                .auth-button {
                    width: 100%;
                    padding: 1.1rem;
                    background: linear-gradient(90deg, #6c63ff, #ff6584);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.4s ease;
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }
                
                .auth-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(108, 99, 255, 0.3);
                }
                
                .auth-button.hover-effect::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: 0.5s;
                }
                
                .auth-button.hover-effect:hover::before {
                    left: 100%;
                }
                
                .button-icon {
                    margin-left: 0.5rem;
                    transition: all 0.3s ease;
                }
                
                .auth-button:hover .button-icon {
                    transform: translateX(5px);
                }
                
                .spinner {
                    display: inline-block;
                    width: 1rem;
                    height: 1rem;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                    margin-right: 0.75rem;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .auth-footer {
                    margin-top: 1.5rem;
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.6);
                    text-align: center;
                }
                
                .auth-footer a {
                    color: rgba(255, 255, 255, 0.8);
                    text-decoration: none;
                    font-weight: 500;
                    display: inline-flex;
                    align-items: center;
                    transition: all 0.3s ease;
                }
                
                .auth-footer a:hover {
                    color: white;
                }
                
                .link-icon {
                    margin-right: 0.5rem;
                }
                
                .alert {
                    background: rgba(245, 101, 101, 0.1);
                    color: #ff6b6b;
                    border-radius: 10px;
                    margin-bottom: 1.5rem;
                    overflow: hidden;
                    border: 1px solid rgba(245, 101, 101, 0.2);
                }
                
                .alert-content {
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                }
                
                .alert-icon {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: #ff6b6b;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    margin-right: 0.75rem;
                    flex-shrink: 0;
                }
                
                @media (max-width: 576px) {
                    .auth-card {
                        padding: 1.5rem;
                    }
                    
                    .card-header h2 {
                        font-size: 1.8rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default Signin;