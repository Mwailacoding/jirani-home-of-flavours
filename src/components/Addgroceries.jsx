import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

const Addgroceries = () => {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [category, setCategory] = useState("groceries")
    const [brand, setBrand] = useState("")
    const [weight, setWeight] = useState("")
    const [unit, setUnit] = useState("")
    const [expiration_date, setExpiration_date] = useState("")
    const [price, setPrice] = useState("")
    const [stockquanitity, setStockquanitity] = useState("")
    const [foodphoto, setFoodphoto] = useState(null)
    
    const [loading, setLoading] = useState("")
    const [error, setError] = useState("")
    const [isHovering, setIsHovering] = useState(false)
    const [isFocused, setIsFocused] = useState({})

    const productCategories = [
        "groceries",
        "fresh food",
        "fast food",
        "spices and seasoning"
    ]

    const submit = async (e) => {
        e.preventDefault()
        setLoading("Please wait, adding product...")

        try {
            const data = new FormData()
            data.append("name", name)
            data.append("category", category.toLowerCase()) 
            data.append("brand", brand)
            data.append("weight", weight)
            data.append("unit", unit)
            data.append("expiration_date", expiration_date)
            data.append("price", price)
            data.append("stockquanitity", stockquanitity)

            if (foodphoto) {
                data.append("foodphoto", foodphoto)
            }

            await axios.post(
                "https://hamilton06.pythonanywhere.com/api/add_products", 
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )

            setLoading("")
            // Add success animation before navigation
            setTimeout(() => navigate('/'), 1000)
            
        } catch (error) {
            setLoading("")
            setError(error.response?.data?.message || error.message)
            // Shake animation on error
            document.getElementById("form-container").classList.add("shake")
            setTimeout(() => {
                document.getElementById("form-container").classList.remove("shake")
            }, 500)
        }
    }

    // Floating animation for decorative elements
    useEffect(() => {
        const floatingElements = document.querySelectorAll('.floating-element')
        floatingElements.forEach((el, index) => {
            el.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite alternate`
        })
    }, [])

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #533d7b)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <style>
                {`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    100% { transform: translateY(-20px); }
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(100, 255, 218, 0.7); }
                    70% { box-shadow: 0 0 0 15px rgba(100, 255, 218, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(100, 255, 218, 0); }
                }
                @keyframes ripple {
                    0% { transform: scale(0.8); opacity: 1; }
                    100% { transform: scale(3); opacity: 0; }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
                .floating-element {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(5px);
                    z-index: 0;
                }
                `}
            </style>

            {/* Decorative floating elements */}
            <div className="floating-element" style={{
                width: '150px',
                height: '150px',
                top: '10%',
                left: '5%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)'
            }}></div>
            <div className="floating-element" style={{
                width: '80px',
                height: '80px',
                bottom: '15%',
                right: '8%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)'
            }}></div>
            <div className="floating-element" style={{
                width: '200px',
                height: '200px',
                bottom: '5%',
                left: '15%',
                background: 'radial-gradient(circle, rgba(100,255,218,0.1) 0%, rgba(100,255,218,0) 70%)'
            }}></div>

            <motion.div 
                id="form-container"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
                style={{
                    width: '100%',
                    maxWidth: '700px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px',
                    padding: '40px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    zIndex: 1,
                    overflow: 'hidden'
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                {/* Animated border effect */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ 
                        scale: isHovering ? 1.02 : 1,
                        opacity: isHovering ? 1 : 0.8
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '24px',
                        border: '2px solid transparent',
                        background: 'linear-gradient(45deg, #64ffda, #00b4d8, #7209b7) border-box',
                        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'destination-out',
                        maskComposite: 'exclude',
                        pointerEvents: 'none',
                        zIndex: -1
                    }}
                />

                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    style={{
                        textAlign: 'center',
                        marginBottom: '40px',
                        fontWeight: '700',
                        fontSize: '2.8rem',
                        background: 'linear-gradient(to right, #64ffda, #00b4d8, #7209b7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 2px 10px rgba(100, 255, 218, 0.3)',
                        position: 'relative'
                    }}
                >
                    ADD PRODUCT
                    <motion.span 
                        animate={{ 
                            scale: [1, 1.05, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            position: 'absolute',
                            bottom: '-10px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '100px',
                            height: '4px',
                            background: 'linear-gradient(to right, #64ffda, #7209b7)',
                            borderRadius: '2px',
                            filter: 'blur(1px)'
                        }}
                    />
                </motion.h1>
                
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                                textAlign: 'center',
                                color: '#64ffda',
                                margin: '20px 0',
                                fontWeight: '500',
                                padding: '15px',
                                background: 'rgba(100, 255, 218, 0.1)',
                                borderRadius: '10px',
                                border: '1px solid rgba(100, 255, 218, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '3px solid rgba(100, 255, 218, 0.3)',
                                    borderTopColor: '#64ffda',
                                    borderRadius: '50%'
                                }}
                            />
                            {loading}
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            style={{
                                textAlign: 'center',
                                color: '#ff6b6b',
                                margin: '20px 0',
                                fontWeight: '500',
                                padding: '15px',
                                background: 'rgba(255, 107, 107, 0.1)',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 107, 107, 0.2)'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    <div style={{ position: 'relative' }}>
                        <motion.label 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            style={{ 
                                display: 'block', 
                                marginBottom: '10px', 
                                fontWeight: '600',
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.95rem'
                            }}
                        >
                            Name
                        </motion.label>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            style={{ position: 'relative' }}
                        >
                            <input 
                                type="text" 
                                style={{
                                    width: '100%',
                                    padding: '16px 20px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    boxShadow: isFocused.name ? '0 0 0 2px rgba(100, 255, 218, 0.3)' : 'none'
                                }}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onFocus={() => setIsFocused(prev => ({ ...prev, name: true }))}
                                onBlur={() => setIsFocused(prev => ({ ...prev, name: false }))}
                                required
                            />
                            <motion.span 
                                animate={{ 
                                    width: isFocused.name ? '100%' : '0%',
                                    opacity: isFocused.name ? 1 : 0
                                }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    height: '2px',
                                    background: 'linear-gradient(to right, #64ffda, #00b4d8)',
                                    borderRadius: '2px'
                                }}
                            />
                        </motion.div>
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <motion.label 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            style={{ 
                                display: 'block', 
                                marginBottom: '10px', 
                                fontWeight: '600',
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.95rem'
                            }}
                        >
                            Category
                        </motion.label>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            style={{ position: 'relative' }}
                        >
                            <select 
                                style={{
                                    width: '100%',
                                    padding: '16px 20px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    appearance: 'none',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    boxShadow: isFocused.category ? '0 0 0 2px rgba(100, 255, 218, 0.3)' : 'none',
                                    cursor: 'pointer'
                                }}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                onFocus={() => setIsFocused(prev => ({ ...prev, category: true }))}
                                onBlur={() => setIsFocused(prev => ({ ...prev, category: false }))}
                                required
                            >
                                {productCategories.map((cat) => (
                                    <option 
                                        key={cat} 
                                        value={cat}
                                        style={{
                                            background: '#1a1a2e',
                                            color: '#fff'
                                        }}
                                    >
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <motion.div 
                                style={{
                                    position: 'absolute',
                                    right: '20px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none'
                                }}
                                animate={{ y: isFocused.category ? -2 : 0 }}
                                transition={{ type: 'spring', stiffness: 500 }}
                            >
                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                    <path d="M1 1L6 6L11 1" stroke="#64ffda" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </motion.div>
                            <motion.span 
                                animate={{ 
                                    width: isFocused.category ? '100%' : '0%',
                                    opacity: isFocused.category ? 1 : 0
                                }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    height: '2px',
                                    background: 'linear-gradient(to right, #64ffda, #00b4d8)',
                                    borderRadius: '2px'
                                }}
                            />
                        </motion.div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <motion.label 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                style={{ 
                                    display: 'block', 
                                    marginBottom: '10px', 
                                    fontWeight: '600',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '0.95rem'
                                }}
                            >
                                Brand
                            </motion.label>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.55 }}
                                style={{ position: 'relative' }}
                            >
                                <input 
                                    type="text" 
                                    style={{
                                        width: '100%',
                                        padding: '16px 20px',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        color: '#fff',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease',
                                        outline: 'none',
                                        boxShadow: isFocused.brand ? '0 0 0 2px rgba(100, 255, 218, 0.3)' : 'none'
                                    }}
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    onFocus={() => setIsFocused(prev => ({ ...prev, brand: true }))}
                                    onBlur={() => setIsFocused(prev => ({ ...prev, brand: false }))}
                                />
                                <motion.span 
                                    animate={{ 
                                        width: isFocused.brand ? '100%' : '0%',
                                        opacity: isFocused.brand ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        height: '2px',
                                        background: 'linear-gradient(to right, #64ffda, #00b4d8)',
                                        borderRadius: '2px'
                                    }}
                                />
                            </motion.div>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <motion.label 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                style={{ 
                                    display: 'block', 
                                    marginBottom: '10px', 
                                    fontWeight: '600',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '0.95rem'
                                }}
                            >
                                Weight
                            </motion.label>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.65 }}
                                style={{ position: 'relative' }}
                            >
                                <input 
                                    type="text" 
                                    style={{
                                        width: '100%',
                                        padding: '16px 20px',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        color: '#fff',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease',
                                        outline: 'none',
                                        boxShadow: isFocused.weight ? '0 0 0 2px rgba(100, 255, 218, 0.3)' : 'none'
                                    }}
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    onFocus={() => setIsFocused(prev => ({ ...prev, weight: true }))}
                                    onBlur={() => setIsFocused(prev => ({ ...prev, weight: false }))}
                                />
                                <motion.span 
                                    animate={{ 
                                        width: isFocused.weight ? '100%' : '0%',
                                        opacity: isFocused.weight ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        height: '2px',
                                        background: 'linear-gradient(to right, #64ffda, #00b4d8)',
                                        borderRadius: '2px'
                                    }}
                                />
                            </motion.div>
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <motion.label 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                style={{ 
                                    display: 'block', 
                                    marginBottom: '10px', 
                                    fontWeight: '600',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '0.95rem'
                                }}
                            >
                                Unit
                            </motion.label>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.75 }}
                                style={{ position: 'relative' }}
                            >
                                <input 
                                    type="number" 
                                    placeholder="Unit number" 
                                    style={{
                                        width: '100%',
                                        padding: '16px 20px',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        color: '#fff',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease',
                                        outline: 'none',
                                        boxShadow: isFocused.unit ? '0 0 0 2px rgba(100, 255, 218, 0.3)' : 'none'
                                    }}
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    onFocus={() => setIsFocused(prev => ({ ...prev, unit: true }))}
                                    onBlur={() => setIsFocused(prev => ({ ...prev, unit: false }))}
                                />
                                <motion.span 
                                    animate={{ 
                                        width: isFocused.unit ? '100%' : '0%',
                                        opacity: isFocused.unit ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        height: '2px',
                                        background: 'linear-gradient(to right, #64ffda, #00b4d8)',
                                        borderRadius: '2px'
                                    }}
                                />
                            </motion.div>
                        </div>
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <motion.label 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            style={{ 
                                display: 'block', 
                                marginBottom: '10px', 
                                fontWeight: '600',
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.95rem'
                            }}
                        >
                            Expiration Date
                        </motion.label>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.85 }}
                            style={{ position: 'relative' }}
                        >
                            <input 
                                type="date" 
                                style={{
                                    width: '100%',
                                    padding: '16px 20px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    background: 'rgba(0, 0, 0, 0.2)',
                                    color: '#fff',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    outline: 'none',
                                    boxShadow: isFocused.expiration_date ? '0 0 0 2px rgba(100, 255, 218, 0.3)' : 'none'
                                }}
                                value={expiration_date}
                                onChange={(e) => setExpiration_date(e.target.value)}
                                onFocus={() => setIsFocused(prev => ({ ...prev, expiration_date: true }))}
                                onBlur={() => setIsFocused(prev => ({ ...prev, expiration_date: false }))}
                            />
                            <motion.span 
                                animate={{ 
                                    width: isFocused.expiration_date ? '100%' : '0%',
                                    opacity: isFocused.expiration_date ? 1 : 0
                                }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    height: '2px',
                                    background: 'linear-gradient(to right, #64ffda, #00b4d8)',
                                    borderRadius: '2px'
                                }}
                            />
                        </motion.div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <motion.label 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                style={{ 
                                    display: 'block', 
                                    marginBottom: '10px', 
                                    fontWeight: '600',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '0.95rem'
                                }}
                            >
                                Price
                            </motion.label>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.95 }}
                                style={{ position: 'relative' }}
                            >
                                <input 
                                    type="number" 
                                    style={{
                                        width: '100%',
                                        padding: '16px 20px',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        color: '#fff',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease',
                                        outline: 'none',
                                        boxShadow: isFocused.price ? '0 0 0 2px rgba(100, 255, 218, 0.3)' : 'none'
                                    }}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    onFocus={() => setIsFocused(prev => ({ ...prev, price: true }))}
                                    onBlur={() => setIsFocused(prev => ({ ...prev, price: false }))}
                                    required
                                />
                                <motion.span 
                                    animate={{ 
                                        width: isFocused.price ? '100%' : '0%',
                                        opacity: isFocused.price ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        height: '2px',
                                        background: 'linear-gradient(to right, #64ffda, #00b4d8)',
                                        borderRadius: '2px'
                                    }}
                                />
                            </motion.div>
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <motion.label 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                style={{ 
                                    display: 'block', 
                                    marginBottom: '10px', 
                                    fontWeight: '600',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '0.95rem'
                                }}
                            >
                                Stock Quantity
                            </motion.label>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.05 }}
                                style={{ position: 'relative' }}
                            >
                                <input 
                                    type="number" 
                                    style={{
                                        width: '100%',
                                        padding: '16px 20px',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        color: '#fff',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease',
                                        outline: 'none',
                                        boxShadow: isFocused.stockquanitity ? '0 0 0 2px rgba(100, 255, 218, 0.3)' : 'none'
                                    }}
                                    value={stockquanitity}
                                    onChange={(e) => setStockquanitity(e.target.value)}
                                    onFocus={() => setIsFocused(prev => ({ ...prev, stockquanitity: true }))}
                                    onBlur={() => setIsFocused(prev => ({ ...prev, stockquanitity: false }))}
                                    required
                                />
                                <motion.span 
                                    animate={{ 
                                        width: isFocused.stockquanitity ? '100%' : '0%',
                                        opacity: isFocused.stockquanitity ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        height: '2px',
                                        background: 'linear-gradient(to right, #64ffda, #00b4d8)',
                                        borderRadius: '2px'
                                    }}
                                />
                            </motion.div>
                        </div>
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <motion.label 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 }}
                            style={{ 
                                display: 'block', 
                                marginBottom: '10px', 
                                fontWeight: '600',
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.95rem'
                            }}
                        >
                            Food Photo
                        </motion.label>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.15 }}
                            style={{ position: 'relative' }}
                        >
                            <div style={{
                                width: '100%',
                                padding: '16px 20px',
                                borderRadius: '12px',
                                border: '1px dashed rgba(255, 255, 255, 0.3)',
                                background: 'rgba(0, 0, 0, 0.2)',
                                color: '#fff',
                                fontSize: '1rem',
                                transition: 'all 0.3s ease',
                                outline: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                                boxShadow: isFocused.foodphoto ? '0 0 0 2px rgba(100, 255, 218, 0.3)' : 'none'
                            }}>
                                <input
                                    type="file"
                                    style={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '100%',
                                        top: 0,
                                        left: 0,
                                        opacity: 0,
                                        cursor: 'pointer'
                                    }}
                                    onChange={(e) => setFoodphoto(e.target.files[0])}
                                    onFocus={() => setIsFocused(prev => ({ ...prev, foodphoto: true }))}
                                    onBlur={() => setIsFocused(prev => ({ ...prev, foodphoto: false }))}
                                    required
                                />
                                {foodphoto ? (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64ffda">
                                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                            <polyline points="7 3 7 8 15 8"></polyline>
                                        </svg>
                                        {foodphoto.name}
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="17 8 12 3 7 8"></polyline>
                                            <line x1="12" y1="3" x2="12" y2="15"></line>
                                        </svg>
                                        Click to upload or drag and drop
                                    </motion.div>
                                )}
                            </div>
                            <motion.span 
                                animate={{ 
                                    width: isFocused.foodphoto ? '100%' : '0%',
                                    opacity: isFocused.foodphoto ? 1 : 0
                                }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    height: '2px',
                                    background: 'linear-gradient(to right, #64ffda, #00b4d8)',
                                    borderRadius: '2px'
                                }}
                            />
                        </motion.div>
                    </div>
                    
                    <motion.button 
                        type="submit" 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        whileHover={{ 
                            scale: 1.02,
                            boxShadow: '0 10px 25px -5px rgba(100, 255, 218, 0.4)'
                        }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            background: 'linear-gradient(45deg, #64ffda, #00b4d8)',
                            color: '#1a1a2e',
                            border: 'none',
                            padding: '18px',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            marginTop: '30px',
                            boxShadow: '0 8px 20px -5px rgba(100, 255, 218, 0.3)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <span style={{ position: 'relative', zIndex: 2 }}>
                            ADD PRODUCT
                        </span>
                        <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: isHovering ? 1 : 0 }}
                            transition={{ duration: 0.6 }}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: '300px',
                                height: '300px',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1
                            }}
                        />
                    </motion.button>
                </form>
            </motion.div>
        </div>
    )
}

export default Addgroceries