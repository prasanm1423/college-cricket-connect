
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    // You could show a loading spinner here
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};
