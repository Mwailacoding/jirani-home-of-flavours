// AdminRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from './Authcontext';
export default function AdminRoute({ children }) {
  const { admin } = useAuth();
  
  if (!admin) {
    return <Navigate to="/admin/signin" replace />;
  }
  
  return children;
}