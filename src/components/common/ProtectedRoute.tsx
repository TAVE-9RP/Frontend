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
  const userDepartment = payload?.department;

  // MANAGEMENT가 필요한 라우트인데 사용자가 MANAGEMENT가 아닌 경우
  if (requiredDepartment === 'MANAGEMENT' && userDepartment !== 'MANAGEMENT') {
    // department에 따라 적절한 홈으로 리다이렉트
    if (userDepartment === 'LOGISTICS') {
      return <Navigate to="/logistics-home" replace />;
    } else if (userDepartment === 'INVENTORY') {
      return <Navigate to="/inventory-home" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
