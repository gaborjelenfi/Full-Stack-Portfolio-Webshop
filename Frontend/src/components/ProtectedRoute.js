import { Navigate } from 'react-router-dom';
import useAdminStore from '../Store/adminStore';
import useCustomerStore from '../Store/customerStore';

export const ProtectedRoute = ({ children }) => {
  const isAuth = useCustomerStore(state => state.isAuth);
  if (!isAuth) return <Navigate to="/login" />;
  return children;
};

export const RouteDenied = ({ children }) => {
  const isRouteAccess = useCustomerStore(state => state.isRouteAccess);
  if (!isRouteAccess) return <Navigate to="/" />;
  return children;
};

export const RouteForAdmin = ({ children }) => {
  const isAdminAuth = useAdminStore(state => state.isAdminAuth);
  if (!isAdminAuth) return <Navigate to="/admin/" />;
  return children;
};
