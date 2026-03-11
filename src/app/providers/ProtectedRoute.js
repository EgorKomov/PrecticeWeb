import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ENUM_LINK } from '../../app/routes/routesConfig';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to={ENUM_LINK.MAIN} replace />;
  }
  
  return children;
};