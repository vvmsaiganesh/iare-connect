import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { adminApi } from '../api/admin.api';

/**
 * Admin confirmation dialog: resets a Faculty/Student account's password
 * to that account's EMAIL address — no typing needed, just confirm.
 * The new credential is displayed (and copyable) so the admin can share
 * it with the user out-of-band. Closes via onSuccess in the parent.
 */
export default function ResetPasswordModal({ target, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Close on Escape.
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Auto-clear the "copied" tick.
  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(newPassword);
      setCopied(true);
    } catch {
      // Clipboard unavailable (older browsers / insecure context) — the
      // email stays visible on screen for manual copying.
    }
  };

  // Mirrors the backend: the password IS the account's email, with the
  // roll-number part shown in capitals for students (26951A1278@iare.ac.in).
  // Passwords are case-insensitive — this is how it's presented/copied.
  const newPassword =
    target?.role === 'student' && target?.email?.includes('@')
      ? target.email.replace(/^[^@]+/, (local) => local.toUpperCase())
      : target?.email;

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      const data = await adminApi.resetPassword(target.id);
      onSuccess(data.message);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-password-title"
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="animate-element relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
              </svg>
            </span>
            <div className="min-w-0">
              <h2 id="reset-password-title" className="font-chakra text-base font-semibold tracking-tight">
                Reset password
              </h2>
              <p className="truncate text-xs text-muted-foreground">
                {target?.name} · {target?.role === 'student' ? target?.rollNumber : target?.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="mt-5 space-y-3">
          <p className="text-sm text-muted-foreground">
            This account's password will be replaced with its email address — nothing to type:
          </p>

          <button
            type="button"
            onClick={copyEmail}
            title="Copy the new password"
            className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3 text-left transition-colors hover:border-brand-teal/50"
          >
            <span className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                New password
              </span>
              <span className="block truncate font-mono text-sm font-semibold">{newPassword}</span>
            </span>
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-success" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand-teal" aria-hidden="true">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            )}
          </button>

          <p className="text-xs text-muted-foreground">
            Share it with the user out-of-band — they can change it afterwards from their account menu.
          </p>

          {error && (
            <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 animate-spin" aria-hidden="true">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Resetting…
              </>
            ) : (
              'Reset password'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
