import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import RoleRoute from './components/RoleRoute';
import ScrollToTop from './components/ScrollToTop';
import { SessionLoader } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';

/** Sends "/" to the right place: each user's own dashboard, or the login page. */
function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <SessionLoader />;
  return <Navigate to={user ? `/${user.role}` : '/login'} replace />;
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-border/70">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p className="inline-flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center overflow-hidden rounded bg-white p-px ring-1 ring-inset ring-black/10 dark:ring-white/10">
            <img src="/logo-192.png" alt="" aria-hidden="true" className="h-full w-full object-contain" />
          </span>
          © 2026 IARE Connect · All rights reserved
        </p>
        <p className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70">
          Powered by <span className="font-semibold text-brand-blue">IARE</span>
        </p>
        <p className="text-muted-foreground/80">Secure authentication · Role-based dashboards</p>
      </div>
    </footer>
  );
}

export default function App() {
  const location = useLocation();
  // The login page is a full-screen, standalone experience (wordmark + theme
  // toggle live inside it), so the shared Navbar/Footer are hidden there.
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Pages always open from the top — never from the previous page's offset */}
      <ScrollToTop />

      {/* Signature blueprint grid backdrop */}
      <div className="pointer-events-none fixed inset-0 blueprint-grid opacity-40" />

      <div className="relative flex min-h-screen flex-col">
        {!isLoginPage && <Navbar />}

        <main className="flex-1">
          <Routes>
            {/* Login page — public */}
            <Route path="/login" element={<LoginPage />} />

            {/* Admin dashboard — admin only */}
            <Route
              path="/admin"
              element={
                <RoleRoute role="admin">
                  <AdminDashboard />
                </RoleRoute>
              }
            />

            {/* Faculty dashboard — faculty only */}
            <Route
              path="/faculty"
              element={
                <RoleRoute role="faculty">
                  <FacultyDashboard />
                </RoleRoute>
              }
            />

            {/* Student dashboard — student only (profile + unique QR code) */}
            <Route
              path="/student"
              element={
                <RoleRoute role="student">
                  <StudentDashboard />
                </RoleRoute>
              }
            />

            <Route path="/" element={<HomeRedirect />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {!isLoginPage && <Footer />}
      </div>
    </div>
  );
}
