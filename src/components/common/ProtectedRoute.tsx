import { Navigate } from 'react-router-dom';
import { decodeAccessToken } from '@/utils/jwt';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredDepartment?: 'MANAGEMENT' | 'LOGISTICS' | 'INVENTORY';
}

export default function ProtectedRoute({ children, requiredDepartment }: ProtectedRouteProps) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const payload = decodeAccessToken(token);

  if (!payload) {
    return <>{children}</>;
  }

  const userDepartment = payload?.department;

  if (requiredDepartment === 'MANAGEMENT' && userDepartment !== 'MANAGEMENT') {
    if (userDepartment === 'LOGISTICS') return <Navigate to="/logistics-home" replace />;
    if (userDepartment === 'INVENTORY') return <Navigate to="/inventory-home" replace />;
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
