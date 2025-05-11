import { Link } from 'react-router-dom'; // If using React Router

const PaymentSuccess = () => {
    return (
        <div>
        <Link to="/orders" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#fff',
            backgroundColor: '#4f46e5',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            
            // Hover effects
            ':hover': {
              backgroundColor: '#4338ca',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)'
            },
            
            // Active/click effect
            ':active': {
              transform: 'translateY(0)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            },
            
            // Ripple effect animation
            '::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '5px',
              height: '5px',
              background: 'rgba(255, 255, 255, 0.5)',
              opacity: '0',
              borderRadius: '100%',
              transform: 'scale(1, 1) translate(-50%)',
              transformOrigin: '50% 50%'
            },
            
            // Ripple animation on click
            ':focus:not(:active)::after': {
              animation: 'ripple 1s ease-out'
            }
          }}>
            View Order History
          </button>
        </Link>
        
        {/* Add the ripple animation keyframes */}
        <style>
          {`
            @keyframes ripple {
              0% {
                transform: scale(0, 0);
                opacity: 1;
              }
              20% {
                transform: scale(25, 25);
                opacity: 1;
              }
              100% {
                opacity: 0;
                transform: scale(40, 40);
              }
            }
          `}
        </style>
      </div>
    );
};

export default PaymentSuccess;