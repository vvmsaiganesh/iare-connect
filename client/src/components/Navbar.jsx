import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';
import Toast from './Toast';

const ROLE_LABELS = {
  admin: 'Admin portal',
  faculty: 'Faculty portal',
  student: 'Student portal',
};

/** Two-letter initials avatar — profile images are intentionally not used. */
function InitialsAvatar({ name }) {
  const initials = String(name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-teal/15 font-chakra text-[11px] font-bold text-brand-teal ring-1 ring-inset ring-black/5 dark:ring-white/10">
      {initials || '?'}
    </span>
  );
}

/**
 * Sticky top navigation: IARE Connect branding, role-aware tagline,
 * light/dark toggle and logout. Shown on every page.
 */
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [menuOpen, setMenuOpen] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close the account dropdown on outside click or Escape.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onPointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const tagline = user
    ? `${ROLE_LABELS[user.role] || 'Portal'} · ${user.role === 'student' ? user.rollNumber : user.email}`
    : 'Secure sign-in · Role-based access';

  // The brand always returns to the user's own home page (their dashboard
  // when signed in, the login page otherwise). If we are already exactly
  // there, `replace` avoids stacking a duplicate history entry, so the
  // Back button never gets stuck on two identical pages.
  const location = useLocation();
  const homeTarget = user ? `/${user.role}` : '/login';
  const alreadyHome = `${location.pathname}${location.search}` === homeTarget;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to={homeTarget} replace={alreadyHome} className="group flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-0.5 shadow-lg shadow-brand-blue/25 ring-1 ring-inset ring-black/5 dark:ring-white/10">
            <img src="/logo-192.png" alt="IARE Connect logo" className="h-full w-full object-contain" />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="flex flex-col items-start">
              <span className="block font-chakra text-lg font-bold tracking-tight transition-all duration-300 group-hover:tracking-wide sm:text-xl">
                IARE <span className="text-brand-teal">Connect</span>
              </span>
              <span
                aria-hidden="true"
                className="mt-1 h-[2.5px] w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand-teal via-brand-gold to-brand-teal transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
            </span>
            <span className="mt-0.5 block truncate font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 group-hover:text-brand-teal/90">
              {tagline}
            </span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {user && (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                title={`${user.name} · ${user.role}`}
                className="flex h-10 items-center gap-2 rounded-xl border border-border bg-card py-1 pl-1 pr-2.5 transition-colors hover:border-brand-teal/40 sm:pr-3"
              >
                <InitialsAvatar name={user.name} />
                <span className="hidden min-w-0 text-left sm:block">
                  <span className="block max-w-[200px] truncate text-sm font-semibold leading-tight">{user.name}</span>
                  <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {user.role}
                  </span>
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  aria-label="Account menu"
                  className="animate-element absolute right-0 top-[calc(100%+8px)] w-64 rounded-2xl border border-border bg-card p-1.5 shadow-xl"
                >
                  <div className="px-3 py-2.5">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate font-mono text-[11px] text-muted-foreground">
                      {user.role === 'student' ? user.rollNumber : user.email}
                    </p>
                  </div>
                  <div className="mx-2 my-1 h-px bg-border" />

                  {user.role !== 'admin' && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        setChangingPassword(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-brand-teal" aria-hidden="true">
                        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                      </svg>
                      Change password
                    </button>
                  )}

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                      <path d="m16 17 5-5-5-5" />
                      <path d="M21 12H9" />
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    </svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            aria-label="Toggle color theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-brand-teal/40 hover:text-foreground"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
              </svg>
            )}
          </button>

          {user && changingPassword && (
            <ChangePasswordModal
              user={user}
              onClose={() => setChangingPassword(false)}
              onSuccess={(message) => {
                setChangingPassword(false);
                setToast(message);
              }}
            />
          )}

          {/* Sleek bottom-capsule confirmation after a password change */}
          {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
        </div>
      </div>
    </header>
  );
}
