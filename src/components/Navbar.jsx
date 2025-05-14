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

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
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
              >
                <i className="fas fa-home me-1"></i> Home
              </Link>
            </li>

            <li className="nav-item">
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
              >
                <i className="fas fa-info-circle me-1"></i> About Us
              </Link>
            </li>

            {user && (
              <>
               
                

                <li className="nav-item">
                  <PaymentSuccess />
                </li>
              </>
            )}

            {!user && (
              <li className="nav-item">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                 
                    
                </motion.div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;