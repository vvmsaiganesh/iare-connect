import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../api/profile.api';
import { useAuth } from '../context/AuthContext';

function ProfileRow({ label, value, mono = false }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/60 px-4 py-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      <span className={`min-w-0 break-words text-right text-sm font-semibold ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );
}

export default function FacultyDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // The profile always comes from GET /api/profile/me — the backend decides
  // whose profile this is from the verified session, never from the frontend.
  const [profile, setProfile] = useState(null);
  const [state, setState] = useState({ loading: true, error: '' });

  const loadProfile = useCallback(async () => {
    setState({ loading: true, error: '' });
    try {
      const data = await profileApi.getProfile();
      setProfile(data.profile);
      setState({ loading: false, error: '' });
    } catch (err) {
      setState({ loading: false, error: err.message || 'Failed to load your profile.' });
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Greeting hero */}
      <section className="animate-element relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-navy via-brand-blue to-brand-navy p-6 text-white shadow-xl sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-brand-gold/25 blur-3xl" />
        <div className="relative min-w-0">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/70">Faculty dashboard</span>
          <h1 className="mt-2 font-chakra text-2xl font-bold tracking-tight sm:text-3xl">
            Hello, {profile?.name || user?.name || 'there'}
          </h1>
          <p className="mt-1.5 font-mono text-sm text-white/80">{profile?.email || user?.email}</p>
        </div>
      </section>

      {/* Profile card */}
      <section className="animate-element animate-delay-150 mt-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <div className="min-w-0">
            <h2 className="font-chakra text-base font-semibold tracking-tight">Your profile</h2>
            <p className="truncate text-xs text-muted-foreground">Created by the Admin · visible only to you</p>
          </div>
        </div>

        {state.loading ? (
          <div className="mt-5 space-y-3">
            <div className="h-12 w-full animate-shimmer rounded-2xl" />
            <div className="h-12 w-full animate-shimmer rounded-2xl" />
            <div className="h-12 w-full animate-shimmer rounded-2xl" />
          </div>
        ) : state.error ? (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border p-4 border-destructive/30 bg-destructive/10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-destructive">Could not load your profile</p>
              <p className="mt-0.5 text-xs text-destructive/90">{state.error}</p>
              <button
                type="button"
                onClick={loadProfile}
                className="mt-2 text-xs font-semibold text-destructive underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            <ProfileRow label="Name" value={profile?.name || '—'} />
            <ProfileRow label="Email" value={profile?.email || '—'} mono />
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/60 px-4 py-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Role</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-blue/10 px-3 py-1 text-[11px] font-semibold text-brand-blue">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                </svg>
                Faculty
              </span>
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-border pt-5">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 py-3 text-sm font-semibold text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground active:scale-[0.99] sm:w-auto sm:px-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            </svg>
            Log out
          </button>
        </div>
      </section>
    </div>
  );
}
