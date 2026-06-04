import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  element: React.ReactNode;
  role?: UserRole | UserRole[];
}

export default function ProtectedRoute({ element, role }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role) {
    const requiredRoles = Array.isArray(role) ? role : [role];
    if (user && !requiredRoles.includes(user.role)) {
      return <Navigate to="/login" replace />;
    }
  }

  return element;
}
