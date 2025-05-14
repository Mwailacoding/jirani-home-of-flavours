import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/Authcontext';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Addgroceries from './components/Addgroceries';
import Getgroceries from './components/Getgroceries';
import Mpesapayment from './components/Mpesapayment';
import AboutUs from './components/Aboutus';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import OrderHistory from './components/OrderHistory';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Chat from './components/Chat';
import AdminDashboard from './components/AdminDashboard';
import AdminSignin from './components/AdminSignin';
import AdminSignup from './components/AdminSignup';
import AdminChangePassword from './components/AdminChangePassword';
import AdminSettings from './components/AdminSettings';
import UserProfile from './components/UserProfile';
import UserChangePassword from './components/UserChangePassword';
import { useEffect } from 'react';
import axios from 'axios';

// Set Axios global configuration
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://hamilton06.pythonanywhere.com';

// Enhanced ProtectedRoute component with loading state
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={adminOnly ? "/admin/signin" : "/signin"} state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header  py-3 text-white">
            <div className="container d-flex justify-content-between align-items-center">
              <h1 className="m-0">Jirani's Flavours of Home</h1>
              <UserProfile />
            </div>
          </header>
          
          <Navbar />
          
          <main className="container mt-4">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Getgroceries />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              
              {/* Admin authentication routes */}
              <Route path="/admin/signin" element={<AdminSignin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              
              {/* Admin protected routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute adminOnly>
                  <AdminSettings />
                </ProtectedRoute>
              } />
              <Route path="/admin/change-password" element={
                <ProtectedRoute adminOnly>
                  <AdminChangePassword />
                </ProtectedRoute>
              } />
              
              {/* User protected routes */}
              <Route path="/addgroceries" element={
                <ProtectedRoute adminOnly>
                  <Addgroceries />
                </ProtectedRoute>
              } />
              <Route path="/mpesapayment" element={
                <ProtectedRoute>
                  <Mpesapayment />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              } />
              <Route path="/change-password" element={
                <ProtectedRoute>
                  <UserChangePassword />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          {/* Chat component - conditionally rendered in the Chat component itself */}
          <Chat />
          
          <footer className="bg-dark text-white py-4 mt-5">
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <h5>Jirani's Flavours of Home</h5>
                  <p>Bringing authentic flavors to your doorstep</p>
                </div>
                <div className="col-md-6 text-md-end">
                  <p>&copy; {new Date().getFullYear()} All Rights Reserved</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;