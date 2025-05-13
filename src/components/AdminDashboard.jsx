import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./Authcontext";
import { 
  FaBox, 
  FaChartPie, 
  FaExclamationTriangle, 
  FaHistory,
  FaMoneyBillWave,
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSignOutAlt,
  FaSpinner
} from "react-icons/fa";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    total_products: 0,
    products_by_category: [],
    low_stock_products: [],
    recent_products: [],
    avg_prices_by_category: []
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  useEffect(() => {
    if (!admin) {
      navigate("/admin/signin");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        
        const [statsRes, productsRes] = await Promise.all([
          axios.get("https://hamilton06.pythonanywhere.com/api/admin/dashboard", { 
            withCredentials: true 
          }),
          axios.get("https://hamilton06.pythonanywhere.com/api/get_products_details", { 
            withCredentials: true 
          })
        ]);
        
        setDashboardStats(statsRes.data.stats || {
          total_products: 0,
          products_by_category: [],
          low_stock_products: [],
          recent_products: [],
          avg_prices_by_category: []
        });
        
        setProducts(productsRes.data || []);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate("/admin/signin");
        } else {
          setError(err.response?.data?.error || "Failed to load dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [admin, navigate, logout]);

  const handleAddProduct = () => {
    navigate("/addgroceries");
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await axios.delete(
        `https://hamilton06.pythonanywhere.com/api/products/${productId}`,
        { withCredentials: true }
      );
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate("/admin/signin");
      } else {
        setError(err.response?.data?.error || "Failed to delete product");
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner size={32} className="text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError("")}
          ></button>
        </motion.div>
      )}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Admin Dashboard
        </motion.h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-outline-danger d-flex align-items-center"
          onClick={logout}
        >
          <FaSignOutAlt className="me-2" /> Logout
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <motion.div 
          className="col-md-3 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Total Products</h5>
                  <h2>{dashboardStats.total_products}</h2>
                </div>
                <FaBox size={40} />
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="col-md-3 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Categories</h5>
                  <h2>{dashboardStats.products_by_category.length}</h2>
                </div>
                <FaChartPie size={40} />
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="col-md-3 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card bg-warning text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Low Stock</h5>
                  <h2>{dashboardStats.low_stock_products.length}</h2>
                </div>
                <FaExclamationTriangle size={40} />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="col-md-3 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Avg Price</h5>
                  <h2>
                    KSh {(
                      dashboardStats.avg_prices_by_category.reduce(
                        (acc, curr) => acc + parseFloat(curr.avg_price), 
                        0
                      ) / (dashboardStats.avg_prices_by_category.length || 1)
                    ).toFixed(2)}
                  </h2>
                </div>
                <FaMoneyBillWave size={40} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Main Content */}
      <div className="row">
        {/* Products Table */}
        <motion.div 
          className="col-lg-8 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Products</h5>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary btn-sm d-flex align-items-center"
                onClick={handleAddProduct}
              >
                <FaPlus className="me-1" />
                Add Product
              </motion.button>
            </div>
            
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <motion.tr 
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.category}</td>
                        <td>KSh {Number(product.price).toFixed(2)}</td>
                        <td>{product.stockquanitity}</td>
                        <td>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleEditProduct(product.id)}
                          >
                            <FaEdit />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <FaTrash />
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Recent Products & Low Stock */}
        <motion.div 
          className="col-lg-4 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card h-100">
            <div className="card-header">
              <h5>Recent Products</h5>
            </div>
            
            <div className="card-body">
              {dashboardStats.recent_products.length > 0 ? (
                <div className="list-group">
                  {dashboardStats.recent_products.map(product => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">{product.name}</span>
                        <span className="badge bg-primary">
                          {product.category}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mt-2">
                        <small>Stock: {product.stockquanitity}</small>
                        <strong>KSh {Number(product.price).toFixed(2)}</strong>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No recent products</p>
              )}
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header bg-warning text-white">
              <h5>Low Stock Alert</h5>
            </div>
            
            <div className="card-body">
              {dashboardStats.low_stock_products.length > 0 ? (
                <div className="list-group">
                  {dashboardStats.low_stock_products.map(product => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="list-group-item list-group-item-warning"
                    >
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">{product.name}</span>
                        <span className="badge bg-danger">
                          {product.stockquanitity} left
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No low stock items</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;