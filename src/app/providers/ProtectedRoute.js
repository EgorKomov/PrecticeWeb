import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { ENUM_LINK } from '../../shared/constants/link';

export const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  
  if (!token) {
    return <Navigate to={ENUM_LINK.MAIN} replace />;
  }
  
  return children;
};