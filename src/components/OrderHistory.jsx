import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './Authcontext'; // Assuming you have auth context
import './OrderHistory.css'; // Assuming you have some CSS for styling

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.email) {
        throw new Error('Please log in to view your orders');
      }

      const response = await axios.get(
        'https://hamilton06.pythonanywhere.com/api/user_orders',
        { params: { email: user.email } }
      );

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid data format received');
      }

      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.email]);

  if (loading) {
    return <div className="loading-spinner">Loading your orders...</div>;
  }

  if (error) {
    return (
      <div className="error-alert">
        <p>{error}</p>
        <button onClick={fetchOrders}>Try Again</button>
      </div>
    );
  }

  if (orders.length === 0) {
    return <div className="empty-message">You haven't placed any orders yet.</div>;
  }

  return (
    <div className="order-history-container">
      <h2>Your Order History</h2>
      
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span>Order #{order.id}</span>
              <span>{new Date(order.order_date).toLocaleDateString()}</span>
              <span className={`status-badge ${order.status}`}>
                {order.status}
              </span>
            </div>
            
            <div className="order-body">
              <div className="order-summary">
                <div>Total: KSh {order.total_amount.toFixed(2)}</div>
                <div>Payment: {order.payment_method}</div>
                {order.transaction_id && (
                  <div>Transaction: {order.transaction_id}</div>
                )}
              </div>
              
              <div className="order-items">
                <h4>Items:</h4>
                <ul>
                  {order.items.map(item => (
                    <li key={item.product_id}>
                      <span>{item.quantity}x {item.name}</span>
                      <span>KSh {(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;