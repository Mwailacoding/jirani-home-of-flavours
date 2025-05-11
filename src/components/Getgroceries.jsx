import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Analytics } from "@vercel/analytics/react"
import { FiSearch, FiX, FiHeart, FiShoppingCart, FiEye, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaHeart, FaStar, FaRegStar, FaFacebookF, FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";
import FoodCarousel from "./FoodCarousel";
const Getgroceries = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [groceries, setGroceries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOption, setSortOption] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartQuantity, setCartQuantity] = useState({});
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const itemsPerPage = 8;

  // Load wishlist and cart from localStorage on component mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    const savedCart = localStorage.getItem('cart');
    const savedCartQuantity = localStorage.getItem('cartQuantity');
    const savedRecentlyViewed = localStorage.getItem('recentlyViewed');
    
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedCartQuantity) setCartQuantity(JSON.parse(savedCartQuantity));
    if (savedRecentlyViewed) setRecentlyViewed(JSON.parse(savedRecentlyViewed));
  }, []);

  // Save wishlist and cart to localStorage when they change
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartQuantity', JSON.stringify(cartQuantity));
  }, [cart, cartQuantity]);

  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const fetchGroceries = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://hamilton06.pythonanywhere.com/api/get_products_details");
      setGroceries(response.data);
      const maxPrice = Math.max(...response.data.map(item => item.price));
      setPriceRange([0, maxPrice]);
    } catch (error) {
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroceries();
  }, []);

  const image_path = "https://hamilton06.pythonanywhere.com/static/images/";

  // Categorize products
  const categories = {
    all: groceries,
    groceries: groceries.filter(item => item.category === "groceries"),
    freshFood: groceries.filter(item => item.category === "fresh food"),
    fastFood: groceries.filter(item => item.category === "fast food"),
    spices: groceries.filter(item => item.category === "spices and seasoning")
  };

  // Background images for each category
  const categoryBackgrounds = {
    groceries: "/grocery1.webp",
    freshFood: "/fresh.jpg",
    fastFood: "/food.jpg",
    spices: "/spice.jpg"
  };

  // Filter items based on filters
  const filteredItems = categories[selectedCategory]
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "newest":
        return new Date(b.created_at) - new Date(a.created_at);
      default:
        return 0;
    }
  });

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, priceRange, sortOption]);

  // Toggle wishlist
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
      // Add to recently viewed if not already there
      if (!recentlyViewed.includes(productId)) {
        setRecentlyViewed([productId, ...recentlyViewed].slice(0, 5));
      }
    }
  };

  // Quick view handler
  const openQuickView = (product) => {
    setQuickViewProduct(product);
    document.body.style.overflow = 'hidden';
    // Add to recently viewed
    if (!recentlyViewed.includes(product.id)) {
      setRecentlyViewed([product.id, ...recentlyViewed.filter(id => id !== product.id)].slice(0, 5));
    }
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
    document.body.style.overflow = 'auto';
  };

  // Add to cart handler
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      const newQuantity = (cartQuantity[product.id] || 1) + 1;
      setCartQuantity({ ...cartQuantity, [product.id]: newQuantity });
    } else {
      setCart([...cart, product]);
      setCartQuantity({ ...cartQuantity, [product.id]: 1 });
    }
    
    // Show notification
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.zIndex = '1000';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 13L9 17L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Added to cart: ${product.name}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    const newCartQuantity = { ...cartQuantity };
    delete newCartQuantity[productId];
    setCartQuantity(newCartQuantity);
  };

  // Update cart quantity
  const updateCartQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartQuantity({ ...cartQuantity, [productId]: quantity });
  };

  // Calculate total cart items
  const totalCartItems = Object.values(cartQuantity).reduce((sum, qty) => sum + qty, 0);

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => {
    return sum + (item.price * (cartQuantity[item.id] || 1));
  }, 0);

  // Get wishlist products
  const wishlistProducts = groceries.filter(item => wishlist.includes(item.id));

  // Get recently viewed products
  const recentlyViewedProducts = groceries.filter(item => recentlyViewed.includes(item.id));

  return (
    <div>
    <FoodCarousel />
      {/* Search Box with Floating Animation */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          maxWidth: '800px',
          margin: '2rem auto',
          padding: '0 15px'
        }}
      >
        <div style={{
          display: 'flex',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          borderRadius: '50px',
          overflow: 'hidden',
          background: 'linear-gradient(145deg, #ffffff, #f0f0f0)'
        }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: '1',
              padding: '15px 25px',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              backgroundColor: 'transparent',
              color: '#333'
            }}
          />
          {searchTerm && (
            <motion.button 
              onClick={() => setSearchTerm("")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                padding: '0 20px',
                border: 'none',
                backgroundColor: '#ff6b6b',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FiX size={18} />
            </motion.button>
          )}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '15px 30px',
              border: 'none',
              background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
            }}
          >
            <FiSearch style={{ marginRight: '8px' }} />
            Search
          </motion.button>
        </div>
      </motion.div>

      {/* Filter and Sort Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 30px',
        padding: '0 15px'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '20px',
          alignItems: 'center'
        }}>
          {/* Category Filter */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {['all', 'groceries', 'freshFood', 'fastFood', 'spices'].map(category => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ y: -2, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '50px',
                  border: 'none',
                  background: selectedCategory === category ? 
                    'linear-gradient(135deg, #4CAF50, #2E7D32)' : '#f0f0f0',
                  color: selectedCategory === category ? 'white' : '#333',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedCategory === category ? 
                    '0 4px 15px rgba(76, 175, 80, 0.3)' : '0 2px 5px rgba(0,0,0,0.05)',
                  textTransform: 'capitalize'
                }}
              >
                {category === 'all' ? 'All Products' : 
                 category === 'groceries' ? 'Groceries' : 
                 category === 'freshFood' ? 'Fresh Food' : 
                 category === 'fastFood' ? 'Fast Food' : 'Spices'}
              </motion.button>
            ))}
          </div>

          {/* Sort and Filter Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <motion.button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: '#fff',
                color: '#333',
                cursor: 'pointer',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M7 12H17M10 18H14" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Filters
            </motion.button>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: '#fff',
                color: '#333',
                cursor: 'pointer',
                fontWeight: '600',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '16px',
                paddingRight: '36px'
              }}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters Panel */}
        {isFilterOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: '20px',
              padding: '20px',
              backgroundColor: '#fff',
              borderRadius: '10px',
              boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}
          >
            <h4 style={{ marginBottom: '15px', color: '#4CAF50' }}>Price Range</h4>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Ksh {priceRange[0]}</span>
                <span>Ksh {priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                style={{ width: '100%', marginBottom: '10px' }}
              />
              <input
                type="range"
                min="0"
                max={priceRange[1]}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                style={{ width: '100%' }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <div style={{
        padding: '40px 15px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            textAlign: 'center',
            color: '#4CAF50',
            marginBottom: '40px',
            fontSize: '2.5rem',
            fontWeight: '800',
            position: 'relative',
            paddingBottom: '15px'
          }}
        >
          Our Premium Products
          <motion.span 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            style={{
              position: 'absolute',
              bottom: '0',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80px',
              height: '4px',
              backgroundColor: '#ff6b6b',
              borderRadius: '2px',
              transformOrigin: 'center'
            }}
          />
        </motion.h1>
        
        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '25px'
          }}>
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                  height: '400px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: '#f0f0f0',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite'
                  }} />
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{
                    height: '24px',
                    width: '80%',
                    backgroundColor: '#f0f0f0',
                    marginBottom: '15px',
                    borderRadius: '4px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite'
                    }} />
                  </div>
                  <div style={{
                    height: '16px',
                    width: '60%',
                    backgroundColor: '#f0f0f0',
                    marginBottom: '20px',
                    borderRadius: '4px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite'
                    }} />
                  </div>
                  <div style={{
                    height: '20px',
                    width: '40%',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 1.5s infinite'
                    }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : error ? (
          <div style={{
            backgroundColor: '#ffebee',
            color: '#d32f2f',
            padding: '20px',
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {error}
          </div>
        ) : selectedCategory === "all" ? (
          <>
            {/* Show all categories */}
            {['groceries', 'freshFood', 'fastFood', 'spices'].map(category => (
              <div key={category}>
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    position: 'relative',
                    margin: '60px 0 30px',
                    padding: '30px 0',
                    overflow: 'hidden',
                    borderRadius: '8px'
                  }}
                >
                  <img 
                    src={categoryBackgrounds[category]} 
                    alt={`${category} Background`} 
                    style={{
                      position: 'absolute',
                      top: '0',
                      left: '0',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: '0.6',
                      filter: 'blur(2px)'
                    }}
                  />
                  <motion.h2 
                    whileHover={{ scale: 1.02 }}
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      zIndex: '2',
                      background: 'linear-gradient(145deg, rgba(0,0,0,0.8), rgba(0,0,0,0.9))',
                      padding: '12px 40px',
                      borderRadius: '50px',
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      color: '#fff',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      border: '2px solid rgba(255, 107, 107, 0.3)',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                      margin: '0 auto',
                      textAlign: 'center',
                      cursor: 'default'
                    }}
                  >
                    {category === 'groceries' && 'Groceries & Staples'}
                    {category === 'freshFood' && 'Fresh Food'}
                    {category === 'fastFood' && 'Fast Food'}
                    {category === 'spices' && 'Spices & Seasoning'}
                  </motion.h2>
                </motion.div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '25px',
                  marginBottom: '50px'
                }}>
                  {categories[category]
                    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((item, index) => (
                      <ProductCard 
                        item={item} 
                        image_path={image_path} 
                        navigate={navigate} 
                        key={item.id}
                        index={index}
                        isWishlisted={wishlist.includes(item.id)}
                        onToggleWishlist={toggleWishlist}
                        onQuickView={openQuickView} // Pass the openQuickView function here
                        onAddToCart={addToCart}
                      />
                    ))}
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {/* Show selected category with pagination */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                position: 'relative',
                margin: '60px 0 30px',
                padding: '30px 0',
                overflow: 'hidden',
                borderRadius: '8px'
              }}
            >
              <img 
                src={categoryBackgrounds[selectedCategory]} 
                alt={`${selectedCategory} Background`} 
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: '0.6',
                  filter: 'blur(2px)'
                }}
              />
              <motion.h2 
                whileHover={{ scale: 1.02 }}
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  zIndex: '2',
                  background: 'linear-gradient(145deg, rgba(0,0,0,0.8), rgba(0,0,0,0.9))',
                  padding: '12px 40px',
                  borderRadius: '50px',
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  border: '2px solid rgba(255, 107, 107, 0.3)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                  margin: '0 auto',
                  textAlign: 'center',
                  cursor: 'default'
                }}
              >
                {selectedCategory === 'groceries' && 'Groceries & Staples'}
                {selectedCategory === 'freshFood' && 'Fresh Food'}
                {selectedCategory === 'fastFood' && 'Fast Food'}
                {selectedCategory === 'spices' && 'Spices & Seasoning'}
              </motion.h2>
            </motion.div>
            {currentItems.length > 0 ? (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '25px',
                  marginBottom: '50px'
                }}>
                  {currentItems.map((item, index) => (
                    <ProductCard 
                      item={item} 
                      image_path={image_path} 
                      navigate={navigate} 
                      key={item.id}
                      index={index}
                      isWishlisted={wishlist.includes(item.id)}
                      onToggleWishlist={toggleWishlist}
                      onQuickView={openQuickView} // Pass the openQuickView function here
                      onAddToCart={addToCart}
                    />
                  ))}
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '30px',
                    gap: '5px'
                  }}>
                    <motion.button 
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '10px 16px',
                        border: '1px solid #ddd',
                        backgroundColor: currentPage === 1 ? '#f5f5f5' : '#fff',
                        color: currentPage === 1 ? '#aaa' : '#333',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <FiChevronLeft size={18} />
                      Prev
                    </motion.button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                      <motion.button
                        key={number}
                        onClick={() => paginate(number)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          padding: '10px 16px',
                          border: '1px solid #ddd',
                          backgroundColor: currentPage === number ? '#4CAF50' : '#fff',
                          color: currentPage === number ? '#fff' : '#333',
                          cursor: 'pointer',
                          borderRadius: '8px',
                          transition: 'all 0.3s ease',
                          boxShadow: currentPage === number ? '0 4px 10px rgba(76, 175, 80, 0.3)' : 'none'
                        }}
                      >
                        {number}
                      </motion.button>
                    ))}
                    
                    <motion.button 
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: '10px 16px',
                        border: '1px solid #ddd',
                        backgroundColor: currentPage === totalPages ? '#f5f5f5' : '#fff',
                        color: currentPage === totalPages ? '#aaa' : '#333',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      Next
                      <FiChevronRight size={18} />
                    </motion.button>
                  </div>
                )}
              </>
            ) : (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '50px 0',
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                }}
              >
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '20px' }}>
                  <path d="M15 10L12 13M12 13L9 10M12 13V7M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <h4 style={{
                  color: '#666',
                  marginBottom: '20px',
                  fontSize: '1.5rem'
                }}>No products found matching your criteria</h4>
                <motion.button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setPriceRange([0, Math.max(...groceries.map(item => item.price))]);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '14px 30px',
                    background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 5px 15px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={closeQuickView}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              style={{
                backgroundColor: '#fff',
                borderRadius: '15px',
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closeQuickView}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  zIndex: 10,
                  color: '#ff6b6b'
                }}
              >
                <FiX size={24} />
              </button>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px',
                padding: '40px'
              }}>
                <div style={{
                  position: 'relative',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  height: '400px'
                }}>
                  <img 
                    src={image_path + quickViewProduct.foodphoto} 
                    alt={quickViewProduct.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <button
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                    style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    {wishlist.includes(quickViewProduct.id) ? (
                      <FaHeart color="#ff6b6b" size={20} />
                    ) : (
                      <FiHeart color="#333" size={20} />
                    )}
                  </button>
                </div>
                
                <div>
                  <h2 style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    marginBottom: '10px',
                    color: '#2c3e50'
                  }}>
                    {quickViewProduct.name}
                  </h2>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '20px',
                    gap: '5px'
                  }}>
                    {[...Array(5)].map((_, i) => (
                      i < 4 ? (
                        <FaStar key={i} color="#FFD700" size={16} />
                      ) : (
                        <FaRegStar key={i} color="#FFD700" size={16} />
                      )
                    ))}
                    <span style={{ marginLeft: '5px', color: '#7f8c8d' }}>(24 reviews)</span>
                  </div>
                  
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px'
                    }}>
                      <span style={{ color: '#7f8c8d' }}>Price:</span>
                      <span style={{
                        color: '#e74c3c',
                        fontSize: '1.5rem',
                        fontWeight: '700'
                      }}>Ksh {quickViewProduct.price}</span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px'
                    }}>
                      <span style={{ color: '#7f8c8d' }}>Category:</span>
                      <span style={{ fontWeight: '600' }}>{quickViewProduct.category}</span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px'
                    }}>
                      <span style={{ color: '#7f8c8d' }}>Weight:</span>
                      <span style={{ fontWeight: '600' }}>{quickViewProduct.weight}</span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px'
                    }}>
                      <span style={{ color: '#7f8c8d' }}>Unit:</span>
                      <span style={{ fontWeight: '600' }}>{quickViewProduct.unit}</span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ color: '#7f8c8d' }}>Stock:</span>
                      <span style={{
                        backgroundColor: quickViewProduct.stockquanitity > 0 ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)',
                        color: quickViewProduct.stockquanitity > 0 ? '#2ecc71' : '#e74c3c',
                        padding: '3px 10px',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>
                        {quickViewProduct.stockquanitity > 0 ? `${quickViewProduct.stockquanitity} available` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                  
                  <p style={{
                    color: '#7f8c8d',
                    marginBottom: '25px',
                    lineHeight: '1.6'
                  }}>
                   Jirani's Home of Flavours — Where freshness meets convenience. Discover quality groceries, vibrant produce, and rich culinary delights, all served with a warm neighborhood touch.
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    gap: '15px',
                    marginTop: '30px'
                  }}>
                    <motion.button
                      onClick={() => addToCart(quickViewProduct)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        flex: 1,
                        padding: '15px',
                        background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                      }}
                    >
                      <FiShoppingCart size={20} />
                      Add to Cart
                    </motion.button>
                    
                    <motion.button
                      onClick={() => {
                        addToCart(quickViewProduct);
                        closeQuickView();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        flex: 1,
                        padding: '15px',
                        backgroundColor: '#fff',
                        color: '#4CAF50',
                        border: '2px solid #4CAF50',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                      }}
                    >
                      Buy Now
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Preview Sidebar */}
      <motion.div 
        initial={{ x: 300 }}
        animate={{ x: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '350px',
          height: '100vh',
          backgroundColor: '#fff',
          boxShadow: '-5px 0 15px rgba(0,0,0,0.1)',
          zIndex: 999,
          padding: '20px',
          overflowY: 'auto',
          display: 'none'
        }}
        id="cart-sidebar"
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '15px',
          borderBottom: '1px solid #eee'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2c3e50' }}>
            Your Cart ({totalCartItems})
          </h3>
          <button 
            onClick={() => document.getElementById('cart-sidebar').style.display = 'none'}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#7f8c8d'
            }}
          >
            <FiX />
          </button>
        </div>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '20px' }}>
              <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 6H21" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h4 style={{ color: '#7f8c8d', marginBottom: '15px' }}>Your cart is empty</h4>
            <motion.button
              onClick={() => {
                document.getElementById('cart-sidebar').style.display = 'none';
                window.scrollTo({
                  top: document.getElementById("products-section").offsetTop - 100,
                  behavior: "smooth"
                });
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Start Shopping
            </motion.button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              {cart.map(item => (
                <div key={item.id} style={{
                  display: 'flex',
                  gap: '15px',
                  marginBottom: '15px',
                  paddingBottom: '15px',
                  borderBottom: '1px solid #f5f5f5'
                }}>
                  <img 
                    src={image_path + item.foodphoto} 
                    alt={item.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '5px',
                      color: '#2c3e50'
                    }}>
                      {item.name}
                    </h4>
                    <p style={{ 
                      fontSize: '0.9rem',
                      color: '#7f8c8d',
                      marginBottom: '10px'
                    }}>
                      Ksh {item.price} × {cartQuantity[item.id] || 1}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        <button
                          onClick={() => updateCartQuantity(item.id, (cartQuantity[item.id] || 1) - 1)}
                          style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: '#f5f5f5',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          -
                        </button>
                        <span style={{
                          width: '40px',
                          textAlign: 'center',
                          fontSize: '0.9rem'
                        }}>
                          {cartQuantity[item.id] || 1}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, (cartQuantity[item.id] || 1) + 1)}
                          style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: '#f5f5f5',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#ff6b6b',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <FiX size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              padding: '15px',
              backgroundColor: '#f9f9f9',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: '600' }}>Ksh {cartTotal.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span>Delivery:</span>
                <span style={{ fontWeight: '600' }}>Ksh {cart.length > 0 ? '200.00' : '0.00'}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '1.1rem',
                fontWeight: '700'
              }}>
                <span>Total:</span>
                <span>Ksh {(cart.length > 0 ? cartTotal + 200 : 0).toFixed(2)}</span>
              </div>
            </div>

            <motion.button
              onClick={() => {
                navigate('/Mpesapayment', { state: { groceries: cart, quantities: cartQuantity } });
                document.getElementById('cart-sidebar').style.display = 'none';
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem',
                marginBottom: '15px'
              }}
            >
              Proceed to Checkout
            </motion.button>

            <button
              onClick={() => {
                document.getElementById('cart-sidebar').style.display = 'none';
                window.scrollTo({
                  top: document.getElementById("products-section").offsetTop - 100,
                  behavior: "smooth"
                });
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                color: '#4CAF50',
                border: '2px solid #4CAF50',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              Continue Shopping
            </button>
          </>
        )}
      </motion.div>

      {/* Floating Action Buttons */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        zIndex: 100
      }}>
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 5px 15px rgba(76, 175, 80, 0.5)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 19V5M5 12L12 5L19 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
        
        <motion.button
          onClick={() => document.getElementById('cart-sidebar').style.display = 'block'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 5px 15px rgba(52, 152, 219, 0.5)',
            position: 'relative'
          }}
        >
          <FiShoppingCart size={20} />
          {totalCartItems > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: 'white',
              color: '#3498db',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              border: '2px solid #3498db'
            }}>
              {totalCartItems}
            </span>
          )}
        </motion.button>
        
        <motion.button
          onClick={() => setShowWishlist(!showWishlist)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 5px 15px rgba(255, 107, 107, 0.5)',
            position: 'relative'
          }}
        >
          <FaHeart size={20} />
          {wishlist.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              backgroundColor: 'white',
              color: '#ff6b6b',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              border: '2px solid #ff6b6b'
            }}>
              {wishlist.length}
            </span>
          )}
        </motion.button>
      </div>

      {/* Wishlist View */}
      {showWishlist && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowWishlist(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            style={{
              backgroundColor: '#fff',
              borderRadius: '15px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowWishlist(false)}
              style={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                zIndex: 10,
                color: '#ff6b6b'
              }}
            >
              <FiX size={24} />
            </button>
            
            <div style={{ padding: '40px' }}>
              <h2 style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                marginBottom: '30px',
                color: '#2c3e50',
                textAlign: 'center'
              }}>
                Your Wishlist ({wishlist.length})
              </h2>
              
              {wishlist.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '20px' }}>
                    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" stroke="#ff6b6b" strokeWidth="2" fill="none"/>
                  </svg>
                  <h4 style={{ color: '#7f8c8d', marginBottom: '20px' }}>Your wishlist is empty</h4>
                  <motion.button
                    onClick={() => {
                      setShowWishlist(false);
                      window.scrollTo({
                        top: document.getElementById("products-section").offsetTop - 100,
                        behavior: "smooth"
                      });
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Browse Products
                  </motion.button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '20px'
                }}>
                  {wishlistProducts.map(item => (
                    <div key={item.id} style={{
                      backgroundColor: '#fff',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                      position: 'relative'
                    }}>
                      <div style={{
                        height: '180px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <img 
                          src={image_path + item.foodphoto} 
                          alt={item.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <button
                          onClick={() => toggleWishlist(item.id)}
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                          }}
                        >
                          <FaHeart color="#ff6b6b" size={16} />
                        </button>
                      </div>
                      <div style={{ padding: '15px' }}>
                        <h4 style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          marginBottom: '5px',
                          color: '#2c3e50'
                        }}>
                          {item.name}
                        </h4>
                        <p style={{ 
                          color: '#e74c3c',
                          fontWeight: '700',
                          marginBottom: '10px'
                        }}>
                          Ksh {item.price}
                        </p>
                        <div style={{
                          display: 'flex',
                          gap: '10px'
                        }}>
                          <motion.button
                            onClick={() => openQuickView(item)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              flex: 1,
                              padding: '8px',
                              backgroundColor: '#f5f5f5',
                              color: '#333',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px'
                            }}
                          >
                            <FiEye size={14} /> View
                          </motion.button>
                          <motion.button
                            onClick={() => addToCart(item)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              flex: 1,
                              padding: '8px',
                              background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px'
                            }}
                          >
                            <FiShoppingCart size={14} /> Add
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Recently Viewed Section */}
      {recentlyViewedProducts.length > 0 && !showWishlist && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 15px 60px'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '30px',
            color: '#2c3e50',
            position: 'relative',
            paddingBottom: '10px'
          }}>
            Recently Viewed
            <span style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '60px',
              height: '3px',
              backgroundColor: '#4CAF50',
              borderRadius: '3px'
            }}></span>
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px'
          }}>
            {recentlyViewedProducts.map(item => (
              <div key={item.id} style={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  height: '150px',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={image_path + item.foodphoto} 
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                  />
                </div>
                <div style={{ padding: '15px' }}>
                  <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '5px',
                    color: '#2c3e50'
                  }}>
                    {item.name}
                  </h4>
                  <p style={{ 
                    color: '#e74c3c',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    marginBottom: '10px'
                  }}>
                    Ksh {item.price}
                  </p>
                  <button
                    onClick={() => addToCart(item)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        backgroundColor: '#2c3e50',
        color: '#fff',
        padding: '50px 0 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 15px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
            marginBottom: '40px'
          }}>
            <div>
              <h5 style={{
                color: '#4CAF50',
                marginBottom: '20px',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>FOOD & GROCERIES</h5>
              <p style={{
                color: '#ecf0f1',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                Your premium destination for all grocery needs. We deliver the freshest products straight to your doorstep.
              </p>
              <div style={{
                display: 'flex',
                gap: '15px'
              }}>
                <motion.a 
                  href="https://www.facebook.com" 
                  whileHover={{ y: -3 }}
                  style={{
                    color: '#fff',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#3b5998',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FaFacebookF />
                </motion.a>
                <motion.a 
                  href="https://x.com" 
                  whileHover={{ y: -3 }}
                  style={{
                    color: '#fff',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#1DA1F2',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FaTwitter />
                </motion.a>
                <motion.a 
                  href="https://www.instagram.com" 
                  whileHover={{ y: -3 }}
                  style={{
                    color: '#fff',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#E1306C',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FaInstagram />
                </motion.a>
                <motion.a 
                  href="https://www.tiktok.com/en/" 
                  whileHover={{ y: -3 }}
                  style={{
                    color: '#fff',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#000',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FaTiktok />
                </motion.a>
              </div>
            </div>
            <div>
              <h5 style={{
                color: '#4CAF50',
                marginBottom: '20px',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>Quick Links</h5>
              <ul style={{
                listStyle: 'none',
                padding: '0'
              }}>
                <li style={{ marginBottom: '10px' }}>
                  <motion.a 
                    href="/" 
                    whileHover={{ x: 5 }}
                    style={{
                      color: '#ecf0f1',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                      <path d="M9 18L15 12L9 6" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Home
                  </motion.a>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <motion.a 
                    href="/Aboutus" 
                    whileHover={{ x: 5 }}
                    style={{
                      color: '#ecf0f1',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                      <path d="M9 18L15 12L9 6" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    About Us
                  </motion.a>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <motion.a 
                    href="/Addgroceries" 
                    whileHover={{ x: 5 }}
                    style={{
                      color: '#ecf0f1',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                      <path d="M9 18L15 12L9 6" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Add Products
                  </motion.a>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <motion.a 
                    href="#" 
                    whileHover={{ x: 5 }}
                    style={{
                      color: '#ecf0f1',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                      <path d="M9 18L15 12L9 6" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Contact
                  </motion.a>
                </li>
              </ul>
            </div>
            <div>
              <h5 style={{
                color: '#4CAF50',
                marginBottom: '20px',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>Contact Info</h5>
              <ul style={{
                listStyle: 'none',
                padding: '0',
                color: '#ecf0f1'
              }}>
                <li style={{
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                    color: '#4CAF50',
                    marginRight: '10px',
                    flexShrink: 0
                  }}>
                    <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="#4CAF50" strokeWidth="2"/>
                    <path d="M12 14C7.58172 14 4 15.7909 4 18V20H20V18C20 15.7909 16.4183 14 12 14Z" stroke="#4CAF50" strokeWidth="2"/>
                  </svg>
                  <span>Nairobi, Kenya</span>
                </li>
                <li style={{
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                    color: '#4CAF50',
                    marginRight: '10px',
                    flexShrink: 0
                  }}>
                    <path d="M5 4H9L11 9L8 10C9.105 12.892 11.108 14.895 14 16L15 13L20 15V19C20 20.105 19.105 21 18 21C14.101 21 1 7.899 1 4C1 2.895 1.895 2 3 2H7C8.105 2 9 2.895 9 4C9 5.517 9.402 6.986 10 8" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>+254 769491949</span>
                </li>
                <li style={{
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                    color: '#4CAF50',
                    marginRight: '10px',
                    flexShrink: 0
                  }}>
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#4CAF50" strokeWidth="2"/>
                    <path d="M22 6L12 13L2 6" stroke="#4CAF50" strokeWidth="2"/>
                  </svg>
                  <span>jiranisflavoursofhome.com</span>
                </li>
              </ul>
            </div>
            <div>
              <h5 style={{
                color: '#4CAF50',
                marginBottom: '20px',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>Newsletter</h5>
              <p style={{
                color: '#ecf0f1',
                marginBottom: '20px',
                lineHeight: '1.6'
              }}>Subscribe for exclusive offers and updates.</p>
              <div style={{
                display: 'flex',
                marginBottom: '15px'
              }}>
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  style={{
                    flex: '1',
                    padding: '12px 15px',
                    border: 'none',
                    outline: 'none',
                    borderRadius: '4px 0 0 4px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '::placeholder': {
                      color: '#bdc3c7'
                    }
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '12px 15px',
                    background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0 4px 4px 0',
                    cursor: 'pointer'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.button>
              </div>
              <small style={{
                color: '#bdc3c7',
                fontSize: '0.8rem'
              }}>We'll never share your email with anyone else.</small>
            </div>
          </div>
          <hr style={{
            borderColor: 'rgba(255,255,255,0.1)',
            margin: '20px 0'
          }}/>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              marginBottom: '10px'
            }}>
              <p style={{
                color: '#ecf0f1',
                margin: '0',
                fontSize: '0.9rem'
              }}>
                &copy; {new Date().getFullYear()} Food & Groceries. All rights reserved.
              </p>
            </div>
            <div style={{
              marginBottom: '10px'
            }}>
              <p style={{
                color: '#ecf0f1',
                margin: '0',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center'
              }}>
                Crafted with <motion.span 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{
                    color: '#ff6b6b',
                    margin: '0 5px',
                    fontSize: '0.9rem'
                  }}
                >♥</motion.span> by Hamilton
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Global styles */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

const ProductCard = ({ item, image_path, navigate, index, isWishlisted, onToggleWishlist, onQuickView, onAddToCart }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ 
      y: -10,
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
    }}
    style={{
      backgroundColor: '#fff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}
  >
    {/* Product Labels */}
    {item.stockquanitity > 0 && item.stockquanitity < 10 && (
      <div style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        backgroundColor: '#ff6b6b',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '0.7rem',
        fontWeight: '600',
        zIndex: 2,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        Almost Gone!
      </div>
    )}
    
    {item.price < 100 && (
      <div style={{
        position: 'absolute',
        top: item.stockquanitity > 0 && item.stockquanitity < 10 ? '45px' : '15px',
        left: '15px',
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '0.7rem',
        fontWeight: '600',
        zIndex: 2,
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        Great Deal!
      </div>
    )}
    
    <div style={{
      height: '220px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <img 
        src={image_path + item.foodphoto} 
        alt={item.name} 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.5s ease'
        }}
      />
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 2
      }}>
        <motion.button
          onClick={() => onToggleWishlist(item.id)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.8)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          {isWishlisted ? (
            <FaHeart color="#ff6b6b" size={16} />
          ) : (
            <FiHeart color="#333" size={16} />
          )}
        </motion.button>
        
        <motion.button
          onClick={() => onQuickView(item)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            backgroundColor: 'rgba(255,255,255,0.8)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          <FiEye color="#333" size={16} />
        </motion.button>
      </div>
    </div>
    
    <div style={{
      padding: '20px',
      flex: '1',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h3 style={{
        color: '#2c3e50',
        marginBottom: '10px',
        fontSize: '1.2rem',
        fontWeight: '700'
      }}>{item.name}</h3>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px'
      }}>
        <span style={{
          backgroundColor: '#f1f1f1',
          color: '#333',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: '600'
        }}>{item.weight}</span>
        <span style={{
          backgroundColor: '#f1f1f1',
          color: '#333',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: '600'
        }}>{item.unit}</span>
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        gap: '3px'
      }}>
        {[...Array(5)].map((_, i) => (
          i < 4 ? (
            <FaStar key={i} color="#FFD700" size={12} />
          ) : (
            <FaRegStar key={i} color="#FFD700" size={12} />
          )
        ))}
        <span style={{ fontSize: '0.8rem', color: '#7f8c8d', marginLeft: '5px' }}>(24)</span>
      </div>
      
      <p style={{
        color: '#7f8c8d',
        fontSize: '0.9rem',
        marginBottom: '15px'
      }}>
        <small>Expires: {item.expiration_date}</small>
      </p>
      
      <div style={{
        marginTop: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span style={{
              color: '#e74c3c',
              fontSize: '1.3rem',
              fontWeight: '800',
              position: 'relative'
            }}>
              Ksh {item.price}
              {item.price < 100 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-25px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    fontSize: '0.6rem',
                    padding: '2px 5px',
                    borderRadius: '4px'
                  }}
                >
                  SALE
                </motion.span>
              )}
            </span>
          </motion.div>
          <span style={{
            backgroundColor: 'rgba(52, 152, 219, 0.2)',
            color: '#3498db',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: '600',
            border: '1px solid rgba(52, 152, 219, 0.5)'
          }}>
            Stock: {item.stockquanitity}
          </span>
        </div>
        
        <motion.button
          onClick={() => onAddToCart(item)}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 5px 15px rgba(76, 175, 80, 0.4)'
          }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <FiShoppingCart size={18} />
          Add to Cart
        </motion.button>
      </div>
    </div>
  </motion.div>
);

export default Getgroceries;