import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./Authcontext";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaCheck, FaArrowRight } from "react-icons/fa";
import { FiUpload } from "react-icons/fi";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        phone: "",
        address: "",
        customer_photo: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isMounted, setIsMounted] = useState(false);

    // Floating particles state
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        setIsMounted(true);
        
        // Generate floating particles
        const particlesArray = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 5 + 3,
            speed: Math.random() * 0.5 + 0.2,
            delay: Math.random() * 5,
            opacity: Math.random() * 0.5 + 0.1
        }));
        setParticles(particlesArray);

        return () => setIsMounted(false);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                customer_photo: file
            }));
        }
    };

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 2));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) data.append(key, value);
            });

            const response = await axios.post(
                "https://hamilton06.pythonanywhere.com/api/signup", 
                data
            );

            login({
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
            });
            
            setSuccess(true);
            setTimeout(() => {
                navigate("/");
            }, 2000);
            
        } catch (error) {
            setError(error.response?.data?.message || "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    const buttonVariants = {
        hover: {
            scale: 1.03,
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
            transition: {
                duration: 0.3
            }
        },
        tap: {
            scale: 0.98
        }
    };

    const stepVariants = {
        enter: { x: 50, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -50, opacity: 0 }
    };

    const successVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { 
            scale: 1, 
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    const inputFocusVariants = {
        focus: {
            borderColor: "rgba(78, 84, 200, 0.7)",
            boxShadow: "0 0 0 0.2rem rgba(78, 84, 200, 0.25)",
            transition: { duration: 0.3 }
        }
    };

    return (
        <div className="row justify-content-center mt-4 min-vh-100 align-items-center position-relative overflow-hidden">
            {/* Floating particles background */}
            {particles.map(particle => (
                <motion.div
                    key={particle.id}
                    initial={{ 
                        x: `${particle.x}%`,
                        y: `${particle.y}%`,
                        opacity: 0
                    }}
                    animate={{
                        y: [`${particle.y}%`, `${particle.y + 10}%`, `${particle.y}%`],
                        opacity: [0, particle.opacity, 0],
                        x: [`${particle.x}%`, `${particle.x + (Math.random() * 10 - 5)}%`, `${particle.x}%`]
                    }}
                    transition={{
                        duration: 10 + Math.random() * 20,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: particle.delay
                    }}
                    style={{
                        width: `${particle.size}px`,
                        height: `${particle.size}px`,
                        background: "rgba(255,255,255,0.3)",
                        borderRadius: "50%",
                        position: "absolute",
                        filter: "blur(1px)"
                    }}
                />
            ))}

            {/* Glowing orb decorator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 2 }}
                style={{
                    position: "absolute",
                    width: "300px",
                    height: "300px",
                    background: "radial-gradient(circle, rgba(78,84,200,0.8) 0%, rgba(143,148,251,0) 70%)",
                    borderRadius: "50%",
                    top: "-100px",
                    left: "-100px",
                    filter: "blur(20px)"
                }}
            />
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 2, delay: 0.5 }}
                style={{
                    position: "absolute",
                    width: "400px",
                    height: "400px",
                    background: "radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)",
                    borderRadius: "50%",
                    bottom: "-150px",
                    right: "-150px",
                    filter: "blur(30px)"
                }}
            />

            <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="card shadow col-md-6 p-4 bg-dark position-relative overflow-hidden border-0"
                style={{
                    background: "rgba(15, 15, 35, 0.8)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 25px 45px rgba(0, 0, 0, 0.2)",
                    zIndex: 1
                }}
            >
                {/* Progress steps indicator */}
                <motion.div 
                    className="d-flex justify-content-center mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {[0, 1, 2].map((step) => (
                        <div key={step} className="d-flex align-items-center">
                            <motion.div
                                animate={{
                                    backgroundColor: currentStep >= step ? "#4e54c8" : "rgba(255,255,255,0.1)",
                                    scale: currentStep === step ? 1.2 : 1
                                }}
                                transition={{ type: "spring", stiffness: 500 }}
                                style={{
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "50%",
                                    margin: "0 10px"
                                }}
                            />
                            {step < 2 && (
                                <motion.div
                                    animate={{
                                        backgroundColor: currentStep > step ? "#4e54c8" : "rgba(255,255,255,0.1)",
                                        width: currentStep > step ? "40px" : "20px"
                                    }}
                                    transition={{ duration: 0.5 }}
                                    style={{
                                        height: "2px",
                                        borderRadius: "2px"
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </motion.div>

                <motion.h1 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-center p-4 text-white"
                    style={{ 
                        textShadow: "0 0 15px rgba(78, 84, 200, 0.7)",
                        fontWeight: 700,
                        letterSpacing: "1px",
                        background: "linear-gradient(90deg, #fff, #8f94fb)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent"
                    }}
                >
                    JOIN OUR COMMUNITY
                </motion.h1>

                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            key="success"
                            variants={successVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-center py-5"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="d-flex justify-content-center mb-4"
                            >
                                <div style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    background: "rgba(46, 213, 115, 0.2)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <FaCheck style={{
                                        fontSize: "40px",
                                        color: "#2ed573"
                                    }} />
                                </div>
                            </motion.div>
                            <h3 className="text-white mb-3">Account Created Successfully!</h3>
                            <p className="text-muted">Redirecting you to your dashboard...</p>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2, delay: 0.5 }}
                                style={{
                                    height: "4px",
                                    background: "linear-gradient(90deg, #4e54c8, #8f94fb)",
                                    borderRadius: "2px",
                                    marginTop: "20px"
                                }}
                            />
                        </motion.div>
                    ) : (
                        <motion.form 
                            key="form"
                            onSubmit={submit} 
                            className="text-white"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <AnimatePresence mode="wait">
                                {currentStep === 0 && (
                                    <motion.div
                                        key="step1"
                                        variants={stepVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.div variants={itemVariants} className="mb-4 position-relative">
                                            <div className="input-icon">
                                                <FaUser />
                                            </div>
                                            <motion.input 
                                                type="text" 
                                                name="username"
                                                placeholder="hamilton" 
                                                className="form-control mb-3 ps-5 bg-transparent text-white border-light" 
                                                onChange={handleChange}
                                                value={formData.username}
                                                required
                                                style={{
                                                    border: "1px solid rgba(255,255,255,0.2)",
                                                    transition: "all 0.3s ease",
                                                    height: "50px"
                                                }}
                                                whileFocus="focus"
                                                variants={inputFocusVariants}
                                            />
                                            <motion.div 
                                                className="placeholder-hint text-muted small ps-5"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                Choose a unique username (letters, numbers, underscores)
                                            </motion.div>
                                        </motion.div>
                                        
                                        <motion.div variants={itemVariants} className="mb-4 position-relative">
                                            <div className="input-icon">
                                                <FaLock />
                                            </div>
                                            <motion.input 
                                                type="password"
                                                name="password"
                                                placeholder="••••••••"
                                                className="form-control mb-3 ps-5 bg-transparent text-white border-light"  
                                                onChange={handleChange}
                                                value={formData.password}
                                                required
                                                style={{
                                                    border: "1px solid rgba(255,255,255,0.2)",
                                                    transition: "all 0.3s ease",
                                                    height: "50px"
                                                }}
                                                whileFocus="focus"
                                                variants={inputFocusVariants}
                                            />
                                            <motion.div 
                                                className="placeholder-hint text-muted small ps-5"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                At least 8 characters with numbers and symbols
                                            </motion.div>
                                        </motion.div>
                                        
                                        <motion.div variants={itemVariants} className="mb-4 position-relative">
                                            <div className="input-icon">
                                                <FaEnvelope />
                                            </div>
                                            <motion.input 
                                                type="email"
                                                name="email"
                                                placeholder="your.email@example.com"
                                                className="form-control mb-3 ps-5 bg-transparent text-white border-light"
                                                onChange={handleChange}
                                                value={formData.email}
                                                required
                                                style={{
                                                    border: "1px solid rgba(255,255,255,0.2)",
                                                    transition: "all 0.3s ease",
                                                    height: "50px"
                                                }}
                                                whileFocus="focus"
                                                variants={inputFocusVariants}
                                            />
                                            <motion.div 
                                                className="placeholder-hint text-muted small ps-5"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.7 }}
                                            >
                                                We'll never share your email with anyone else
                                            </motion.div>
                                        </motion.div>
                                        
                                        <motion.div className="d-flex justify-content-end">
                                            <motion.button
                                                type="button"
                                                onClick={nextStep}
                                                className="btn btn-primary"
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                style={{
                                                    background: "linear-gradient(45deg, #4e54c8, #8f94fb)",
                                                    border: "none",
                                                    padding: "10px 25px",
                                                    borderRadius: "30px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px"
                                                }}
                                            >
                                                Next <FaArrowRight />
                                            </motion.button>
                                        </motion.div>
                                    </motion.div>
                                )}

                                {currentStep === 1 && (
                                    <motion.div
                                        key="step2"
                                        variants={stepVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.div variants={itemVariants} className="mb-4 position-relative">
                                            <div className="input-icon">
                                                <FaPhone />
                                            </div>
                                            <motion.input 
                                                type="tel"
                                                name="phone"
                                                placeholder="+254712345678"
                                                className="form-control mb-3 ps-5 bg-transparent text-white border-light"
                                                onChange={handleChange}
                                                value={formData.phone}
                                                style={{
                                                    border: "1px solid rgba(255,255,255,0.2)",
                                                    transition: "all 0.3s ease",
                                                    height: "50px"
                                                }}
                                                whileFocus="focus"
                                                variants={inputFocusVariants}
                                            />
                                            <motion.div 
                                                className="placeholder-hint text-muted small ps-5"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                Kenyan format (+254 followed by 9 digits)
                                            </motion.div>
                                        </motion.div>
                                        
                                        <motion.div variants={itemVariants} className="mb-4 position-relative">
                                            <div className="input-icon">
                                                <FaMapMarkerAlt />
                                            </div>
                                            <motion.input 
                                                type="text"
                                                name="address"
                                                placeholder="123 Main St, Nairobi, Kenya"
                                                className="form-control mb-3 ps-5 bg-transparent text-white border-light"  
                                                onChange={handleChange}
                                                value={formData.address}
                                                style={{
                                                    border: "1px solid rgba(255,255,255,0.2)",
                                                    transition: "all 0.3s ease",
                                                    height: "50px"
                                                }}
                                                whileFocus="focus"
                                                variants={inputFocusVariants}
                                            />
                                            <motion.div 
                                                className="placeholder-hint text-muted small ps-5"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                Optional - for faster checkout
                                            </motion.div>
                                        </motion.div>

                                        <motion.div variants={itemVariants} className="mb-4">
                                            <label className="form-label d-flex align-items-center gap-2">
                                                <FaCamera /> Profile Photo (Optional)
                                            </label>
                                            <div className="file-upload-wrapper">
                                                <input 
                                                    type="file"
                                                    id="file-upload"
                                                    className="form-control bg-transparent text-white border-light d-none" 
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                />
                                                <motion.label 
                                                    htmlFor="file-upload" 
                                                    className="d-flex flex-column align-items-center justify-content-center p-4 border-dashed rounded"
                                                    style={{
                                                        border: "2px dashed rgba(255,255,255,0.3)",
                                                        cursor: "pointer",
                                                        transition: "all 0.3s ease",
                                                        minHeight: "120px",
                                                        background: "rgba(255,255,255,0.05)"
                                                    }}
                                                    whileHover={{ 
                                                        borderColor: "rgba(78, 84, 200, 0.7)",
                                                        background: "rgba(78, 84, 200, 0.1)"
                                                    }}
                                                >
                                                    <FiUpload size={24} className="mb-2" />
                                                    <span className="text-center">
                                                        {formData.customer_photo 
                                                            ? formData.customer_photo.name 
                                                            : "Click to upload profile photo (JPEG/PNG)"}
                                                    </span>
                                                    {formData.customer_photo && (
                                                        <motion.div 
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="mt-2 text-success d-flex align-items-center gap-1"
                                                        >
                                                            <FaCheck /> Selected
                                                        </motion.div>
                                                    )}
                                                </motion.label>
                                            </div>
                                        </motion.div>
                                        
                                        <div className="d-flex justify-content-between">
                                            <motion.button
                                                type="button"
                                                onClick={prevStep}
                                                className="btn btn-outline-light"
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                style={{
                                                    padding: "10px 25px",
                                                    borderRadius: "30px"
                                                }}
                                            >
                                                Back
                                            </motion.button>
                                            <motion.button
                                                type="button"
                                                onClick={nextStep}
                                                className="btn btn-primary"
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                style={{
                                                    background: "linear-gradient(45deg, #4e54c8, #8f94fb)",
                                                    border: "none",
                                                    padding: "10px 25px",
                                                    borderRadius: "30px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px"
                                                }}
                                            >
                                                Next <FaArrowRight />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div
                                        key="step3"
                                        variants={stepVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.3 }}
                                    >
                                        <motion.div 
                                            className="text-center mb-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <h4 className="text-white mb-3">Review Your Information</h4>
                                            <div className="review-info bg-dark p-3 rounded mb-4">
                                                <div className="d-flex justify-content-between py-2 border-bottom border-secondary">
                                                    <span className="text-muted">Username:</span>
                                                    <span>{formData.username || <span className="text-muted">Not provided</span>}</span>
                                                </div>
                                                <div className="d-flex justify-content-between py-2 border-bottom border-secondary">
                                                    <span className="text-muted">Email:</span>
                                                    <span>{formData.email || <span className="text-muted">Not provided</span>}</span>
                                                </div>
                                                <div className="d-flex justify-content-between py-2 border-bottom border-secondary">
                                                    <span className="text-muted">Phone:</span>
                                                    <span>{formData.phone || <span className="text-muted">Not provided</span>}</span>
                                                </div>
                                                <div className="d-flex justify-content-between py-2">
                                                    <span className="text-muted">Address:</span>
                                                    <span>{formData.address || <span className="text-muted">Not provided</span>}</span>
                                                </div>
                                            </div>
                                        </motion.div>

                                        {error && (
                                            <motion.div 
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="alert alert-danger"
                                            >
                                                {error}
                                            </motion.div>
                                        )}

                                        <div className="d-flex justify-content-between">
                                            <motion.button
                                                type="button"
                                                onClick={prevStep}
                                                className="btn btn-outline-light"
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                style={{
                                                    padding: "10px 25px",
                                                    borderRadius: "30px"
                                                }}
                                            >
                                                Back
                                            </motion.button>
                                            <motion.button 
                                                type="submit" 
                                                className="btn btn-primary py-2 px-4"
                                                disabled={loading}
                                                variants={buttonVariants}
                                                whileHover="hover"
                                                whileTap="tap"
                                                style={{
                                                    background: "linear-gradient(45deg, #4e54c8, #8f94fb)",
                                                    border: "none",
                                                    borderRadius: "30px",
                                                    position: "relative",
                                                    overflow: "hidden",
                                                    minWidth: "150px"
                                                }}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                                                        <span role="status">Creating Account...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        Complete Sign Up
                                                        <motion.span
                                                            initial={{ x: "-100%" }}
                                                            animate={{ x: "100%" }}
                                                            transition={{
                                                                duration: 1.5,
                                                                repeat: Infinity,
                                                                ease: "linear"
                                                            }}
                                                            style={{
                                                                position: "absolute",
                                                                top: 0,
                                                                left: 0,
                                                                width: "100%",
                                                                height: "100%",
                                                                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                                                                transform: "skewX(-20deg)"
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            
                            <motion.p 
                                className="text-center mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                style={{
                                    color: "rgba(255,255,255,0.7)"
                                }}
                            >
                                Already have an account?{' '}
                                <Link 
                                    to='/signin' 
                                    className="text-gradient"
                                    style={{
                                        background: "linear-gradient(90deg, #8f94fb, #4e54c8)",
                                        WebkitBackgroundClip: "text",
                                        backgroundClip: "text",
                                        color: "transparent",
                                        fontWeight: 600,
                                        textDecoration: "none",
                                        position: "relative"
                                    }}
                                >
                                    Sign in
                                    <motion.span 
                                        style={{
                                            position: "absolute",
                                            bottom: "-2px",
                                            left: 0,
                                            width: "100%",
                                            height: "2px",
                                            background: "linear-gradient(90deg, #8f94fb, #4e54c8)",
                                            transformOrigin: "left"
                                        }}
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </Link>
                            </motion.p>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>

            <style>{`
                @keyframes shine {
                    0% { transform: translateX(-100%) rotate(30deg); }
                    20% { transform: translateX(100%) rotate(30deg); }
                    100% { transform: translateX(100%) rotate(30deg); }
                }
                
                .input-icon {
                    position: absolute;
                    left: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255,255,255,0.5);
                    z-index: 2;
                }
                
                .file-upload-wrapper:hover {
                    border-color: rgba(78, 84, 200, 0.7) !important;
                    background: rgba(78, 84, 200, 0.1) !important;
                }
                
                .review-info {
                    border: 1px solid rgba(255,255,255,0.1);
                    box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
                }
                
                .border-dashed {
                    border-style: dashed !important;
                }
                
                .placeholder-hint {
                    margin-top: -0.5rem;
                    margin-bottom: 1rem;
                }
                
                input::placeholder {
                    color: rgba(255,255,255,0.4) !important;
                }
                
                .input-icon svg {
                    width: 16px;
                    height: 16px;
                }
            `}</style>
        </div>
    );
};

export default Signup;