import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/Authcontext';
import Navbar from './components/Navbar';
import UserProfile from './components/UserProfile';
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
import { useAuth } from './components/Authcontext';
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <header className="App-header bg-k py-3">
            <div className="container d-flex justify-content-between align-items-center">
              <h1 className="m-0">Jirani's Flavours of Home</h1>
              <UserProfile />
            </div>
          </header>
          
          <Navbar />
          
          <main className="container mt-4">
            <Routes>
              {/* Public routes */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/" element={<Getgroceries />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              
              {/* Protected routes */}
              <Route path="/addgroceries" element={
                <ProtectedRoute>
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

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Chat />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;