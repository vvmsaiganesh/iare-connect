import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Full-page loader shown while the session is being verified. */
export function SessionLoader({ label = 'Securing your session…' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <span className="relative flex h-12 w-12 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-blue/25" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative h-6 w-6 animate-spin text-brand-blue"
          aria-hidden="true"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </span>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
    </div>
  );
}

/**
 * Protects authenticated pages.
 * While the session check is loading → loader.
 * If nobody is logged in → redirect to the login page.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <SessionLoader />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
