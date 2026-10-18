import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

/**
 * Role-based page guard.
 * A user whose role does not match is redirected to their own dashboard.
 * (This is UI convenience only — the real permission check lives in Express
 *  middleware, so hiding buttons is never the security boundary.)
 */
export default function RoleRoute({ role, children }) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user && user.role !== role ? <Navigate to={`/${user.role}`} replace /> : children}
    </ProtectedRoute>
  );
}
