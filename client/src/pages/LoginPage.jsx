import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RoleOrbitArt from '../components/RoleOrbitArt';
import LoginCinematic from '../components/LoginCinematic';

/* ---------------------------------------------------------------------------
   Inline icons — drawn on the standard 24×24 grid (no icon dependency)
--------------------------------------------------------------------------- */
const SVG = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

function ShieldIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...SVG} className={className}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CapIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...SVG} className={className}>
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  );
}

function IdIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...SVG} className={className}>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <circle cx="8" cy="11.5" r="2" />
      <path d="M5 16.5c.8-1.3 1.9-2 3-2s2.2.7 3 2" />
      <path d="M14 10.5h4" />
      <path d="M14 14.5h4" />
    </svg>
  );
}

function QrIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...SVG} className={className}>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
      <path d="M14 14h3v3h-3z" />
      <path d="M21 14v.01" />
      <path d="M14 21v.01" />
      <path d="M21 21h-3v-3" />
    </svg>
  );
}

function MailIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...SVG} className={className}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...SVG} className={className}>
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function KeyIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...SVG} className={className}>
      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
      <circle cx="16.5" cy="7.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function EyeIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...SVG} className={className}>
      {/* the whole eye squashes toward its bottom edge to "blink" (see .eye-toggle) */}
      <g className="eye-blink">
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
        {/* eyelashes — evenly spaced along the lid, fade in on hover (see .eye-toggle) */}
        <g className="eye-lashes" strokeWidth="1.6" strokeLinecap="round">
          <path d="M4.1 9.45 Q2.9 8.2 1.7 6.9" />
          <path d="M8 6.81 Q7.6 5 6.9 3.4" />
          <path d="M12 6 L12 2.4" />
          <path d="M16 6.81 Q16.4 5 17.1 3.4" />
          <path d="M19.9 9.45 Q21.1 8.2 22.3 6.9" />
        </g>
      </g>
    </svg>
  );
}

function EyeOffIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...SVG} className={className}>
      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

function ArrowIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...SVG} className={className}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function SunIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...SVG} className={className}>
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
  );
}

function MoonIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...SVG} className={className}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function CheckIcon({ className = 'h-4 w-4' }) {
  return (
    <svg {...SVG} className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   Role configuration — the selected button only personalises the form;
   the backend always decides which dashboard the user really reaches.
--------------------------------------------------------------------------- */
const ROLES = [
  {
    id: 'admin',
    label: 'Admin',
    eyebrow: 'Admin console',
    icon: ShieldIcon,
    dot: 'bg-brand-blue',
    iconTone: 'text-brand-blue',
    sub: 'Sign in to create Faculty and Student accounts and manage every registered user from one console.',
    placeholder: 'admin@iare.ac.in',
    hint: 'Use the password assigned to the Admin account.',
    submit: 'Sign in as Admin',
    button: 'bg-brand-blue text-white shadow-brand-blue/25',
  },
  {
    id: 'faculty',
    label: 'Faculty',
    eyebrow: 'Faculty portal',
    icon: CapIcon,
    dot: 'bg-brand-gold',
    iconTone: 'text-brand-gold',
    sub: 'Sign in to view the secure profile the Admin created for you — your details stay private to you.',
    placeholder: 'faculty@iare.ac.in',
    hint: 'Initial password set by the Admin — by default, your email address.',
    submit: 'Sign in as Faculty',
    button: 'bg-brand-gold text-brand-navy shadow-brand-gold/30',
  },
  {
    id: 'student',
    label: 'Student',
    eyebrow: 'Student portal',
    icon: IdIcon,
    dot: 'bg-brand-teal',
    iconTone: 'text-brand-teal',
    sub: 'Sign in to view your profile and your unique student QR identity.',
    placeholder: 'student@iare.ac.in',
    hint: 'Initial password set by the Admin — by default, your roll number.',
    submit: 'Sign in as Student',
    button: 'bg-brand-teal text-brand-navy shadow-brand-teal/30',
  },
];

/** Trust ribbon — three quick facts under the headline. */
const RIBBON = [
  { Icon: ShieldIcon, value: 'Secure Access', label: 'Protected sessions' },
  { Icon: KeyIcon, value: 'Admin-Managed', label: 'Admin created profiles' },
  { Icon: QrIcon, value: 'Unique', label: 'Student QR ID' },
];

/**
 * Capability capsules — real features from the assignment spec (complements
 * the left ribbon, which already covers sessions, admin-created profiles
 * and the student QR ID). Glass sheen sweeps across on hover.
 */
const CHIPS = [
  { Icon: ShieldIcon, label: 'Role-Based Dashboards' },
  { Icon: LockIcon, label: 'Personalised Profile Access' },
  { Icon: CheckIcon, label: 'Admin Verified Profiles' },
];

export default function LoginPage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [activeRole, setActiveRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cinematicUser, setCinematicUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Light/dark toggle — same storage key the Navbar uses, kept in sync via effect.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const role = ROLES.find((option) => option.id === activeRole);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
  };

  const selectRole = (roleId) => {
    setActiveRole(roleId);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are both required.');
      return;
    }

    setSubmitting(true);
    try {
      // `role.id` is the active sign-in tab — the backend only accepts an
      // account whose role matches the tab it is signed in from.
      const data = await login(email.trim(), password, role.id);
      // Play the sign-in cinematic first, then land on the dashboard.
      // Navigation still happens as a *push* (in finishCinematic) so the
      // browser Back button returns here to the login page.
      setCinematicUser(data.user);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  // Called when the cinematic ends (or is skipped) — now push to the dashboard.
  const finishCinematic = () => {
    const target = `/${cinematicUser.role}`;
    setCinematicUser(null);
    navigate(target);
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-hidden lg:flex-row">
      {/* ambient background — blueprint grid + soft brand glows */}
      <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-60" />
      <div className="pointer-events-none absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-brand-blue/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-[340px] w-[340px] rounded-full bg-brand-teal/10 blur-[120px]" />

      {/* ---------------- left: form column ---------------- */}
      <section className="relative z-10 flex flex-1 flex-col overflow-y-auto px-5 py-10 sm:px-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            {/* wordmark + theme toggle */}
            <div className="mb-8 flex items-center justify-between gap-4">
              <span className="group inline-block cursor-default leading-tight">
                <span className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-lg shadow-brand-blue/20 ring-1 ring-black/5 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_16px_32px_-8px_rgba(15,98,172,0.55)] dark:ring-white/10">
                    <img src="/logo-192.png" alt="" className="h-full w-full object-contain" />
                  </span>
                  <span className="block font-chakra text-2xl font-bold tracking-tight transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 sm:text-3xl">
                    IARE <span className="text-brand-teal transition-colors duration-300 group-hover:text-brand-gold">Connect</span>
                  </span>
                </span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  The Digital Identity of IARE
                </span>
                {/* grows to full width on hover */}
                <span className="mt-1.5 block h-0.5 w-10 origin-left rounded-full bg-gradient-to-r from-brand-blue via-brand-teal to-brand-gold transition-all duration-500 group-hover:w-full" />
              </span>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle color theme"
                className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-rotate-12 hover:scale-105 hover:border-brand-teal/60 hover:text-foreground hover:shadow-[0_12px_26px_-10px_rgba(85,188,182,0.5)]"
              >
                <span className="transition-transform duration-300 group-hover:scale-110">
                  {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {/* headline */}
              <div className="space-y-3">
                <p className="animate-element animate-delay-100 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  <span className={`h-1.5 w-1.5 rounded-full ${role.dot}`} />
                  {role.eyebrow}
                </p>
                <h1 className="animate-element animate-delay-150 font-chakra text-4xl font-bold leading-tight tracking-tight md:text-[2.6rem]">
                  Welcome to <span className="text-gradient">IARE Connect</span>
                </h1>
                <p className="animate-element animate-delay-200 text-sm leading-relaxed text-muted-foreground">{role.sub}</p>
              </div>

              {/* trust ribbon — aligned with the form column; hover effects stay inside the card */}
              <div className="animate-element animate-delay-250 grid grid-cols-3 gap-2">
                {RIBBON.map((item) => (
                  <div
                    key={item.value}
                    className="group relative flex flex-col justify-center gap-1 overflow-hidden rounded-2xl border border-border bg-card/75 px-2.5 py-3 backdrop-blur transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-brand-blue/55 hover:bg-card hover:shadow-[0_10px_24px_-12px_rgba(15,98,172,0.35)]"
                  >
                    {/* soft light sweeps across the card on hover */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -translate-x-[140%] bg-gradient-to-r from-transparent via-brand-blue/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[140%]"
                    />
                    <span className="relative flex h-4 w-4 items-center justify-center text-brand-blue transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
                      <item.Icon className="h-4 w-4" />
                    </span>
                    <span className="relative font-chakra text-sm font-bold leading-tight tracking-tight transition-colors duration-300 group-hover:text-brand-blue sm:whitespace-nowrap">
                      {item.value}
                    </span>
                    {item.label && (
                      <span className="relative font-mono text-[8px] uppercase tracking-[0.05em] text-muted-foreground sm:whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* role switcher — segmented control */}
              <div
                role="tablist"
                aria-label="Login type"
                className="animate-element animate-delay-300 grid grid-cols-3 gap-1 rounded-2xl border border-border bg-muted/60 p-1"
              >
                {ROLES.map((option) => {
                  const active = option.id === activeRole;
                  return (
                    <button
                      key={option.id}
                      role="tab"
                      aria-selected={active}
                      type="button"
                      onClick={() => selectRole(option.id)}
                      className={`group inline-flex items-center justify-center gap-2 rounded-xl px-2 py-3 text-xs font-semibold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:scale-[0.97] sm:text-sm ${
                        active
                          ? 'bg-card text-foreground shadow-[0_10px_24px_-10px_rgba(11,18,32,0.35)] ring-1 ring-black/5 dark:ring-white/10'
                          : 'text-muted-foreground hover:bg-card/70 hover:text-foreground hover:shadow-[0_8px_18px_-12px_rgba(11,18,32,0.3)]'
                      }`}
                    >
                      <span
                        className={`transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 ${active ? option.iconTone : ''}`}
                      >
                        <option.icon className="h-4 w-4" />
                      </span>
                      <span className="truncate">{option.label}</span>
                      {active && <span className={`hidden h-1.5 w-1.5 rounded-full sm:block ${option.dot}`} />}
                    </button>
                  );
                })}
              </div>

              {/* already signed in (e.g. browser Back returned here from a
                  dashboard) — offer a way forward instead of a redirect loop */}
              {user && (
                <div className="animate-element space-y-4 rounded-2xl border border-success/30 bg-success/10 p-5" role="status">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success">
                      <ShieldIcon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">You are already signed in</p>
                      <p className="mt-0.5 break-words text-xs text-muted-foreground">
                        {user.name} · {user.role === 'student' ? user.rollNumber : user.email} · {user.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => navigate(`/${user.role}`)}
                      className="group inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:brightness-[1.08] hover:shadow-xl active:scale-[0.99]"
                    >
                      Go to my dashboard
                      <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await logout();
                        setEmail('');
                        setPassword('');
                        setError('');
                      }}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-destructive/40 hover:text-destructive hover:shadow-[0_12px_26px_-14px_rgba(220,38,38,0.4)] active:scale-[0.99]"
                    >
                      <svg {...SVG} className="h-4 w-4">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <path d="m16 17 5-5-5-5" />
                        <path d="M21 12H9" />
                      </svg>
                      Log out
                    </button>
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Signing in again below with different credentials will switch to that account.
                  </p>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="animate-element animate-delay-400">
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground/80">
                    Email address
                  </label>
                  <div className="group flex items-center gap-3 rounded-2xl border border-border bg-card px-4 shadow-sm shadow-black/5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-brand-blue/55 hover:shadow-[0_10px_22px_-14px_rgba(15,98,172,0.40)] focus-within:border-brand-blue/70 focus-within:shadow-[0_12px_26px_-14px_rgba(15,98,172,0.45)] focus-within:ring-4 focus-within:ring-brand-blue/15">
                    <MailIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-focus-within:scale-110 group-focus-within:text-brand-blue" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={role.placeholder}
                      autoComplete="email"
                      required
                      className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground/70"
                    />
                  </div>
                </div>

                <div className="animate-element animate-delay-500">
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground/80">
                    Password
                  </label>
                  <div className="group flex items-center gap-3 rounded-2xl border border-border bg-card px-4 shadow-sm shadow-black/5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-brand-blue/55 hover:shadow-[0_10px_22px_-14px_rgba(15,98,172,0.40)] focus-within:border-brand-blue/70 focus-within:shadow-[0_12px_26px_-14px_rgba(15,98,172,0.45)] focus-within:ring-4 focus-within:ring-brand-blue/15">
                    <LockIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-focus-within:scale-110 group-focus-within:text-brand-blue" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-muted-foreground/70"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="eye-toggle shrink-0 rounded-lg p-1 text-muted-foreground transition-all duration-200 hover:scale-110 hover:text-foreground"
                    >
                      {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">{role.hint}</p>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="animate-element rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className={`animate-element animate-delay-600 group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl py-4 text-sm font-semibold shadow-lg transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:brightness-[1.08] hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 ${role.button}`}
                >
                  {/* glass sheen sweeps across on hover */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -translate-x-[140%] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[140%]"
                  />
                  {submitting ? (
                    <>
                      <svg {...SVG} className="h-4 w-4 animate-spin">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Verifying credentials…
                    </>
                  ) : (
                    <>
                      <role.icon className="h-4 w-4" />
                      {role.submit}
                      <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <p className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
            Powered by IARE
          </span>
          <span aria-hidden="true">·</span>
          <span>© 2026 IARE · All rights reserved</span>
        </p>
      </section>

      {/* ---------------- right: prism-orbit panel (lg and up) ---------------- */}
      <section className="relative z-10 hidden p-4 lg:flex lg:flex-1">
        <div className="animate-slide-right animate-delay-200 relative flex flex-1 flex-col overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/15">
          {/* blurred campus photo under a brand gradient */}
          <img
            src="/campus.jpg"
            alt="IARE campus"
            className="absolute inset-0 h-full w-full scale-110 object-cover blur-[3px]"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/90 via-brand-blue/60 to-brand-navy/85" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* drifting aurora blobs */}
          <div className="animate-aurora pointer-events-none absolute -left-16 top-1/4 h-72 w-72 rounded-full bg-brand-teal/35 blur-3xl" />
          <div
            className="animate-aurora pointer-events-none absolute -right-14 bottom-16 h-80 w-80 rounded-full bg-brand-gold/30 blur-3xl"
            style={{ animationDelay: '-7s' }}
          />

          {/* one slow diagonal light sweep — quiet-luxury polish */}
          <div className="panel-sheen pointer-events-none absolute -left-[30%] top-0 h-full w-[26%] bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl" />

          {/* a few soft motes drifting upward */}
          {[
            { left: '16%', bottom: '10%', size: 7, delay: '0s' },
            { left: '72%', bottom: '22%', size: 5, delay: '-7s' },
            { left: '46%', bottom: '4%', size: 9, delay: '-14s' },
          ].map((mote) => (
            <span
              key={`${mote.left}-${mote.bottom}`}
              className="animate-mote pointer-events-none absolute rounded-full bg-white/60 blur-[2px]"
              style={{ left: mote.left, bottom: mote.bottom, width: mote.size, height: mote.size, animationDelay: mote.delay }}
            />
          ))}

          {/* gold corner brackets */}
          <span className="pointer-events-none absolute left-5 top-5 h-9 w-9 rounded-tl-2xl border-l-2 border-t-2 border-brand-gold/70" />
          <span className="pointer-events-none absolute right-5 top-5 h-9 w-9 rounded-tr-2xl border-r-2 border-t-2 border-brand-gold/70" />
          <span className="pointer-events-none absolute bottom-5 left-5 h-9 w-9 rounded-bl-2xl border-b-2 border-l-2 border-brand-gold/70" />
          <span className="pointer-events-none absolute bottom-5 right-5 h-9 w-9 rounded-br-2xl border-b-2 border-r-2 border-brand-gold/70" />

          <div className="relative z-10 flex h-full flex-col p-9">
            {/* top row — live pill + logo mark */}
            <div className="flex items-center justify-between">
              <span className="group inline-flex cursor-default items-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[11px] font-semibold text-white backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-white/65 hover:bg-white/20 hover:shadow-[0_14px_30px_-12px_rgba(0,0,0,0.55)]">
                {/* verified tick badge with a soft pulse */}
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <span className="absolute inline-flex h-4 w-4 animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.55)]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-2.5 w-2.5 text-white"
                      aria-hidden="true"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                </span>
                Verified Institutional Access
              </span>
              <ShieldIcon className="h-6 w-6 text-brand-gold" />
            </div>

            {/* the prism-gyroscope animation: Admin · Faculty · Student */}
            <div className="flex min-h-0 flex-1 items-center justify-center py-6">
              <RoleOrbitArt className="mx-auto h-auto w-full max-w-lg text-white/90" />
            </div>

            {/* the IARE logo — true colours with a feathered glow, sitting at the
                bottom of the panel exactly as the Bus EnRoute portal places it */}
            <div className="mt-7 flex flex-col items-center gap-6">
              <div className="group relative flex cursor-default items-center justify-center">
                <div className="pointer-events-none absolute h-40 w-[30rem] max-w-full rounded-full bg-white/80 opacity-90 blur-[64px] transition-opacity duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute h-28 w-[20rem] max-w-full rounded-full bg-white/90 opacity-90 blur-[36px] transition-opacity duration-500 group-hover:opacity-100" />
                <img
                  src="/iare-logo.png"
                  alt="IARE"
                  className="relative h-20 w-auto drop-shadow-[0_6px_18px_rgba(8,12,21,0.35)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:scale-105 sm:h-24"
                />
              </div>

              {/* capability capsules — always a single row from 1360px up;
                  glass sheen sweeps on hover */}
              <div className="flex flex-wrap items-center justify-center gap-3 whitespace-nowrap text-[10px] min-[1360px]:flex-nowrap 2xl:text-[11.5px] min-[1760px]:text-[13px]">
                {CHIPS.map((chip) => (
                  <span
                    key={chip.label}
                    className="group relative inline-flex cursor-default select-none items-center gap-2 overflow-hidden rounded-full border border-white/25 bg-gradient-to-b from-white/15 to-white/5 py-1.5 pl-1.5 pr-3 font-semibold text-white shadow-lg shadow-black/25 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:scale-[1.03] hover:border-white/70 hover:from-white/25 hover:to-white/10 hover:shadow-[0_16px_34px_-8px_rgba(210,174,109,0.5)] 2xl:gap-2.5 2xl:pr-4"
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 -translate-x-[140%] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[140%] group-hover:opacity-100"
                    />
                    <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold ring-1 ring-brand-gold/40 transition-transform duration-300 group-hover:scale-110 2xl:h-7 2xl:w-7">
                      <chip.Icon className="h-3 2xl:h-3.5" />
                    </span>
                    <span className="relative">{chip.label}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* sign-in cinematic — plays once after successful authentication */}
      {cinematicUser && (
        <LoginCinematic user={cinematicUser} onDone={finishCinematic} />
      )}
    </div>
  );
}
