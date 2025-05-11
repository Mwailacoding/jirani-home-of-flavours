import { Link } from 'react-router-dom';
import { useAuth } from './Authcontext';
import { motion } from 'framer-motion';
import PaymentSuccess from './OrderButton';

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      boxShadow: '0 4px 18px rgba(0, 0, 0, 0.3)',
      padding: '0.8rem 0'
    }}>
      <div className="container">
        <Link className="navbar-brand" to="/" style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          background: 'linear-gradient(to right, #00dbde, #fc00ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          JIRANI'S HOME OF FLAVOURS
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav ms-auto align-items-center">
            <Link
              className="nav-link mx-2 position-relative"
              to="/"
              style={{
                fontSize: '1.1rem',
                fontWeight: '500',
                color: '#f8f9fa',
                transition: 'all 0.3s ease',
                padding: '0.5rem 1rem',
                borderRadius: '4px'
              }}
              activeStyle={{
                color: '#fff',
                background: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <i className="fas fa-home me-1"></i> Home
            </Link>

            <Link
              className="nav-link mx-2 position-relative"
              to="/aboutus"
              style={{
                fontSize: '1.1rem',
                fontWeight: '500',
                color: '#f8f9fa',
                transition: 'all 0.3s ease',
                padding: '0.5rem 1rem',
                borderRadius: '4px'
              }}
              activeStyle={{
                color: '#fff',
                background: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <i className="fas fa-info-circle me-1"></i> About Us
            </Link>

            {user && (
              <>
                <Link
                  className="nav-link mx-2 position-relative"
                  to="/addgroceries"
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '500',
                    color: '#f8f9fa',
                    transition: 'all 0.3s ease',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px'
                  }}
                  activeStyle={{
                    color: '#fff',
                    background: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <i className="fas fa-plus-circle me-1"></i> Add Products
                </Link>

               

                {/* Add the Order Status Button here, conditionally if needed */}
                <PaymentSuccess />
              </>
            )}

            {user ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
               
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  className="nav-link btn rounded-pill px-4 ms-3 position-relative overflow-hidden"
                  to="/addgroceries"
                  style={{
                    fontWeight: '500',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    color: 'white'
                  }}
                >
                  <i className="fas fa-cart-plus me-1"></i> ADD GROCERIES
                  <motion.span
                    className="position-absolute top-0 left-0 w-full h-full bg-white opacity-0"
                    style={{ borderRadius: '50px' }}
                    whileHover={{ opacity: 0.2 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;