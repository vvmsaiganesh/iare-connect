import { useEffect, useRef } from 'react';

/* ---------------------------------------------------------------------------
   LoginCinematic — a calm, minimalist 4-second motion play after sign-in:

     Beat 1  (0.0–1.4 s)  A developer with headphones sits at a Mac running
              IARE Connect. The frame holds; the screen breathes, steam drifts.
     Beat 2  (1.4–2.4 s)  The IARE Connect console — wordmark and two profile
              rows (counts only, no personal details).
     Beat 3  (2.4–4.0 s)  Welcome: the wordmark, "Welcome back" with the
              signed-in user's role, then ONE enlarged capsule showing only
              THAT user's own details, and Access granted. No other person's
              information appears anywhere.

   Three beats joined by pure opacity fades — no zooms, no pans, no cuts.
   A white progress bar fills along the bottom for the full 4 s.
   Click anywhere or press any key to skip; honours prefers-reduced-motion.
--------------------------------------------------------------------------- */

const TOTAL_MS = 4000;

/** First letters of the first two name words — initials avatar, no images. */
const initialsOf = (name) =>
  String(name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || '?';

/* Pseudo-QR module map (9×9) — corners mimic real finder squares. */
const QR_MODULES = [
  '111010111',
  '101000101',
  '111010111',
  '000011000',
  '110101011',
  '001011100',
  '111010111',
  '101001010',
  '111011101',
];

function MiniQr() {
  return (
    <div className="rounded-md bg-white p-1 shadow-lg shadow-black/40">
      <div className="grid h-[38px] w-[38px] grid-cols-9 grid-rows-9 gap-px">
        {QR_MODULES.flatMap((row, r) =>
          row.split('').map((cell, c) =>
            cell === '1' ? (
              <span key={`${r}-${c}`} className="rounded-[1px] bg-[#0b1526]" />
            ) : (
              <span key={`${r}-${c}`} />
            ),
          ),
        )}
      </div>
    </div>
  );
}

export default function LoginCinematic({ user, onDone }) {
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDoneRef.current();
  };

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return undefined;
    }
    const timer = setTimeout(finish, TOTAL_MS);
    const skip = () => finish();
    window.addEventListener('keydown', skip);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roleLabel = (user?.role || 'user').toUpperCase();
  const isStudent = user?.role === 'student';
  const rolePretty = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';
  const initials = initialsOf(user?.name);

  return (
    <div
      className="cin-root fixed inset-0 z-[100] select-none overflow-hidden bg-[#05080f] text-white"
      onPointerDown={finish}
      role="presentation"
    >
      {/* ============ beat 1 — the developer at his Mac ============ */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">
          <svg
            viewBox="0 0 1200 700"
            preserveAspectRatio="xMidYMid slice"
            className="h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="cinScreenGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#78B4E8" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#78B4E8" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="cinRoomGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#16304F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#05080f" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="cinDeskTop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1B2C4A" />
                <stop offset="100%" stopColor="#101C33" />
              </linearGradient>
            </defs>

            <rect width="1200" height="700" fill="#05080f" />
            <circle cx="760" cy="330" r="380" fill="url(#cinRoomGlow)" />
            <circle cx="800" cy="316" r="230" fill="url(#cinScreenGlow)" />

            {/* floor shadow */}
            <ellipse cx="600" cy="655" rx="430" ry="18" fill="#000" opacity="0.55" />

            {/* desk */}
            <rect x="120" y="530" width="960" height="20" rx="10" fill="url(#cinDeskTop)" />
            <rect x="120" y="530" width="960" height="3" rx="1.5" fill="#2C4A78" opacity="0.7" />
            <rect x="205" y="550" width="14" height="105" rx="4" fill="#0E1830" />
            <rect x="980" y="550" width="14" height="105" rx="4" fill="#0E1830" />

            {/* monitor */}
            <rect x="540" y="170" width="500" height="330" rx="18" fill="#0A1120" stroke="#22365A" strokeWidth="2" />
            <rect x="554" y="184" width="472" height="282" rx="10" fill="#0D1A2E" />
            {/* miniature IARE Connect on the screen */}
            <g className="cin-flicker">
              <rect x="572" y="200" width="17" height="17" rx="5" fill="#D2AE6D" />
              <text x="598" y="214" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="700" fill="#FFFFFF" opacity="0.92">IARE Connect</text>
              <rect x="572" y="230" width="436" height="1.5" fill="#1D2F4D" />
              <rect x="572" y="244" width="208" height="96" rx="9" fill="#101F36" stroke="#1E3454" />
              <rect x="798" y="244" width="208" height="96" rx="9" fill="#101F36" stroke="#1E3454" />
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <circle cx="590" cy={264 + i * 24} r="6" fill="#2B4A74" />
                  <rect x="604" y={260 + i * 24} width="116" height="5.5" rx="2.75" fill="#33507C" />
                  <circle cx="816" cy={264 + i * 24} r="6" fill="#2B4A74" />
                  <rect x="830" y={260 + i * 24} width="116" height="5.5" rx="2.75" fill="#33507C" />
                </g>
              ))}
              <rect x="572" y="358" width="92" height="22" rx="11" fill="#0F62AC" />
              <text x="586" y="373" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="600" fill="#FFFFFF">+ Faculty</text>
              <rect x="676" y="358" width="92" height="22" rx="11" fill="#2E8E9E" />
              <text x="688" y="373" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="600" fill="#FFFFFF">+ Student</text>
            </g>
            {/* stand */}
            <rect x="770" y="500" width="40" height="32" fill="#101C33" />
            <rect x="706" y="530" width="168" height="10" rx="5" fill="#16243F" />

            {/* chair */}
            <rect x="236" y="300" width="18" height="220" rx="9" fill="#101C33" />
            <rect x="246" y="452" width="92" height="14" rx="7" fill="#16243F" />

            {/* the developer — hoodie, facing the screen */}
            <path d="M300 460 C 296 380 320 318 374 312 C 424 306 452 358 456 430 L456 464 C 420 478 332 478 300 460 Z" fill="#1D4E89" />
            <path d="M430 384 C 470 404 496 452 520 486" stroke="#1D4E89" strokeWidth="26" strokeLinecap="round" fill="none" />
            <circle cx="524" cy="490" r="11" fill="#EFC098" />
            <rect x="366" y="294" width="30" height="28" rx="10" fill="#E0AE84" />
            <circle cx="384" cy="256" r="48" fill="#EFC098" />
            <path d="M334 262 C 330 208 438 204 436 258 C 428 234 344 236 334 262 Z" fill="#1F2A3D" />
            {/* headphones */}
            <path d="M328 258 C 334 198 436 196 442 254" stroke="#0F62AC" strokeWidth="9" fill="none" strokeLinecap="round" />
            <rect x="314" y="240" width="27" height="42" rx="13" fill="#0F62AC" stroke="#D2AE6D" strokeWidth="2" />
            <circle cx="327.5" cy="261" r="5.5" fill="#D2AE6D" opacity="0.85" />

            {/* keyboard + mug */}
            <rect x="470" y="500" width="180" height="12" rx="4" fill="#16243F" />
            <rect x="484" y="503" width="152" height="3" rx="1.5" fill="#2B4A74" opacity="0.7" />
            <rect x="672" y="502" width="30" height="28" rx="6" fill="#16243F" stroke="#2B4A74" strokeWidth="2" />
            <path d="M702 508 q10 6 0 14" stroke="#2B4A74" strokeWidth="3" fill="none" />
            <path d="M680 496 c -6 -8 6 -12 0 -22" stroke="#7FB2E8" strokeWidth="3" fill="none" strokeLinecap="round" className="cin-steam" />
            <path d="M690 498 c -5 -7 5 -10 0 -19" stroke="#7FB2E8" strokeWidth="3" fill="none" strokeLinecap="round" className="cin-steam" style={{ animationDelay: '-1.6s' }} />
          </svg>
        </div>

        {/* beat-1 caption */}
        <div className="absolute inset-x-0 bottom-[8vh] z-10 text-center">
          <span className="cin-rise inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-emerald-200/90" style={{ animationDelay: '350ms' }}>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
            Credentials verified
          </span>
        </div>
      </div>

      {/* ============ beat 2 — the console (0.0 → shown from 1.4 s) ============ */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center bg-[#05080f]"
        style={{ animation: 'cin-cut-in 0.5s cubic-bezier(0.22,1,0.36,1) 1400ms both' }}
      >
        <div className="cin-breathe pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/12 blur-[130px]" />
        <div className="relative w-[min(520px,84vw)] overflow-hidden rounded-2xl border border-white/10 bg-[#0B1526]/92 shadow-[0_50px_140px_-30px_rgba(0,0,0,0.9)]">
          {/* window bar */}
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            <span className="ml-3 rounded-md bg-black/30 px-3 py-1 font-mono text-[9px] text-white/45">connect.iare.ac.in</span>
          </div>

          {/* wordmark, top-left */}
          <div className="flex items-center gap-2.5 px-6 pt-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-gold to-[#A8823C] font-chakra text-sm font-bold text-brand-navy">I</span>
            <span className="font-chakra text-xl font-bold tracking-tight text-white">IARE Connect</span>
          </div>

          {/* the two profile lists — one calm row each, counts only (no personal details) */}
          <div className="space-y-3 px-6 pb-5 pt-5">
            <div className="cin-rise flex items-center gap-3.5 rounded-xl border border-brand-blue/25 bg-brand-blue/8 px-4 py-3.5" style={{ animationDelay: '1600ms' }}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue/20 ring-1 ring-brand-blue/40">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#8FC1EC]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-white">Faculty profiles</span>
                <span className="block truncate font-mono text-[9px] text-white/45">Name &amp; email address</span>
              </span>
              <span className="font-chakra text-lg font-bold text-white/80">6</span>
            </div>

            <div className="cin-rise flex items-center gap-3.5 rounded-xl border border-brand-teal/25 bg-brand-teal/8 px-4 py-3.5" style={{ animationDelay: '1800ms' }}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-teal/20 ring-1 ring-brand-teal/40">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#8FE0DE]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-white">Student profiles</span>
                <span className="block truncate font-mono text-[9px] text-white/45">Roll number &amp; QR ID</span>
              </span>
              <span className="font-chakra text-lg font-bold text-white/80">1</span>
            </div>
          </div>

          {/* caption */}
          <div className="border-t border-white/10 bg-black/25 px-6 py-3 text-center">
            <span className="cin-rise font-mono text-[10px] uppercase tracking-[0.24em] text-white/55" style={{ animationDelay: '1750ms' }}>
              Admin creates every Faculty &amp; Student account
            </span>
          </div>
        </div>
      </div>

      {/* ============ beat 3 — welcome, this user only (2.4 → 4.0 s) ============ */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center bg-[#05080f]"
        style={{ animation: 'cin-cut-in 0.5s cubic-bezier(0.22,1,0.36,1) 2400ms both' }}
      >
        <div className="cin-breathe pointer-events-none absolute h-[420px] w-[640px] rounded-full bg-brand-blue/12 blur-[130px]" />
        <div className="relative flex flex-col items-center gap-5">
          {/* logo + wordmark */}
          <div className="cin-rise flex items-center gap-3.5" style={{ animationDelay: '2500ms' }}>
            <img src="/iare-logo.png" alt="IARE" className="cin-float h-10 w-auto drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)]" />
            <div className="relative overflow-hidden">
              <span className="font-chakra text-3xl font-bold tracking-tight text-white">IARE Connect</span>
              <span className="cin-sheen pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/55 to-transparent" />
            </div>
          </div>

          {/* the login message — with this user's role */}
          <span className="cin-rise font-chakra text-sm text-white/75" style={{ animationDelay: '2700ms' }}>
            Welcome back{user?.name ? `, ${user.name}` : ''}
            <span className="ml-2 rounded-full bg-brand-blue/20 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-[#8FC1EC]">{roleLabel}</span>
          </span>

          {/* ONE enlarged capsule — only the signed-in user's own details */}
          <div className="cin-rise w-[min(400px,86vw)] rounded-2xl border border-white/12 bg-[#0D1A2E]/92 p-5 shadow-2xl shadow-black/40 backdrop-blur" style={{ animationDelay: '2850ms' }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3.5">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-chakra text-base font-bold ring-2 ring-brand-gold/50 ${
                    isStudent ? 'bg-brand-teal/25 text-[#8FE0DE]' : 'bg-brand-blue/25 text-[#8FC1EC]'
                  }`}
                >
                  {initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-semibold text-white">{user?.name || 'User'}</span>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] ${
                      isStudent ? 'bg-brand-teal/20 text-[#8FE0DE]' : 'bg-brand-blue/20 text-[#8FC1EC]'
                    }`}
                  >
                    {rolePretty}
                  </span>
                </span>
              </div>
              {isStudent && <MiniQr />}
            </div>
            <div className="mt-3.5 space-y-1.5 border-t border-white/10 pt-3 font-mono text-[10px]">
              <p className="truncate text-white/60">{user?.email || ''}</p>
              {isStudent && user?.rollNumber && <p className="text-brand-gold">{user.rollNumber}</p>}
              {isStudent && user?.branch && <p className="truncate text-white/45">{user.branch}</p>}
            </div>
          </div>

          {/* access granted */}
          <div className="cin-rise flex items-center gap-2.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2" style={{ animationDelay: '3150ms' }}>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400">
              <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 text-[#052E1C]" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-100">Access granted</span>
          </div>
        </div>
      </div>

      {/* film treatment — vignette and skip hint */}
      <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_140px_rgba(0,0,0,0.8)]" />
      <div className="absolute bottom-5 right-8 z-50 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
        Click anywhere to skip →
      </div>

      {/* progress bar — fills white across the full 4 s */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 h-[3px] bg-white/10">
        <div className="cin-progress h-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" style={{ width: '100%' }} />
      </div>
    </div>
  );
}
