import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
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

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // The profile always comes from GET /api/profile/me — the backend decides
  // whose profile this is from the verified session, never from the frontend.
  const [profile, setProfile] = useState(null);
  const [state, setState] = useState({ loading: true, error: '' });
  const [qrDataUrl, setQrDataUrl] = useState('');

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

  // Each student's QR encodes ONLY their unique, non-sensitive studentQrId —
  // never a password and never an authentication token.
  useEffect(() => {
    if (!profile?.studentQrId) return;
    let cancelled = false;
    QRCode.toDataURL(profile.studentQrId, {
      width: 360,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#0b1220', light: '#ffffff' },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('');
      });
    return () => {
      cancelled = true;
    };
  }, [profile?.studentQrId]);

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
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-brand-teal/25 blur-3xl" />
        <div className="relative min-w-0">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/70">Student dashboard</span>
          <h1 className="mt-2 font-chakra text-2xl font-bold tracking-tight sm:text-3xl">
            Hello, {profile?.name || user?.name || 'there'}
          </h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80">
            <span className="font-mono">{profile?.rollNumber || user?.rollNumber}</span>
            <span className="text-white/40">•</span>
            <span className="font-mono">{profile?.email || user?.email}</span>
          </p>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Profile card */}
        <section className="animate-element animate-delay-150 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:col-span-3">
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
              <ProfileRow label="Roll number" value={profile?.rollNumber || '—'} mono />
              <ProfileRow label="Branch" value={profile?.branch || '—'} />
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/60 px-4 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Role</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-teal/15 px-3 py-1 text-[11px] font-semibold text-brand-teal">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                  Student
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

        {/* Unique QR code card */}
        <section className="animate-element animate-delay-250 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
                <path d="M14 14h3v3h-3z" />
                <path d="M20 14h.01" />
                <path d="M14 20h.01" />
                <path d="M20 20h.01" />
              </svg>
            </span>
            <div className="min-w-0">
              <h2 className="font-chakra text-base font-semibold tracking-tight">Your unique QR code</h2>
              <p className="truncate text-xs text-muted-foreground">One per student · generated from your QR ID</p>
            </div>
          </div>

          <div className="mt-5 flex flex-col items-center rounded-2xl border border-border bg-white p-5 shadow-inner dark:bg-white">
            {state.loading ? (
              <div className="h-56 w-56 animate-shimmer rounded-2xl" />
            ) : qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Unique QR code for ${profile?.name || 'student'} (${profile?.studentQrId})`}
                className="h-56 w-56 rounded-xl"
              />
            ) : (
              <div className="flex h-56 w-56 flex-col items-center justify-center gap-2 rounded-xl bg-muted/60 text-center">
                <p className="text-sm font-semibold">QR unavailable</p>
                <p className="px-4 text-xs text-muted-foreground">Your QR code could not be generated right now.</p>
              </div>
            )}
          </div>

          {profile?.studentQrId && (
            <div className="mt-4 rounded-2xl border border-border bg-background/60 px-4 py-3 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">QR ID</p>
              <p className="mt-1 font-mono text-sm font-semibold text-brand-blue">{profile.studentQrId}</p>
            </div>
          )}

          <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
            This QR contains only your unique student identifier — never your password or login token.
          </p>
        </section>
      </div>
    </div>
  );
}
