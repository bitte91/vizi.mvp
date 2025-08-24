import { Navigate, Outlet } from 'react-router-dom';
import { useSupabase } from '../contexts/SupabaseContext';

const ProtectedRoute = () => {
  const { user, profile, loading } = useSupabase();

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile?.username) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
