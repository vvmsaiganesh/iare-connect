import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import FormInput from './FormInput';
import { authApi } from '../api/auth.api';

const MIN_PASSWORD_LENGTH = 8;

/**
 * Modal used by the Navbar account dropdown to let a Faculty or Student
 * member change their own password (current + new). The admin cannot use
 * this — the admin password is fixed by the assignment.
 *
 * Portalled into <body>: the sticky Navbar uses a backdrop blur, which
 * makes it the containing block for fixed-position children and would
 * stop the dialog from landing centred on screen.
 *
 * On success it hands the message back via onSuccess — the parent closes
 * this dialog and pops the bottom capsule toast.
 */
export default function ChangePasswordModal({ user, onClose, onSuccess }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Close on Escape.
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (key) => (event) => setForm({ ...form, [key]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!form.current) nextErrors.current = 'Enter your current password.';
    if (form.next.length < MIN_PASSWORD_LENGTH) {
      nextErrors.next = `Must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (form.confirm !== form.next) nextErrors.confirm = 'Passwords do not match.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setError('');
    try {
      const data = await authApi.changePassword(form.current, form.next);
      onSuccess?.(data.message);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
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
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
              </svg>
            </span>
            <div className="min-w-0">
              <h2 id="change-password-title" className="font-chakra text-base font-semibold tracking-tight">
                Change password
              </h2>
              <p className="truncate text-xs text-muted-foreground">
                {user?.name} · {user?.role}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          <FormInput
            label="Current password"
            id="change-current-password"
            type="password"
            value={form.current}
            onChange={set('current')}
            error={errors.current}
            autoComplete="current-password"
            required
          />
          <FormInput
            label="New password"
            id="change-new-password"
            type="password"
            value={form.next}
            onChange={set('next')}
            error={errors.next}
            placeholder={`Minimum ${MIN_PASSWORD_LENGTH} characters`}
            autoComplete="new-password"
            required
          />
          <FormInput
            label="Confirm new password"
            id="change-confirm-password"
            type="password"
            value={form.confirm}
            onChange={set('confirm')}
            error={errors.confirm}
            autoComplete="new-password"
            required
          />

          {error && (
            <div
              role="alert"
              className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-border px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 animate-spin" aria-hidden="true">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Saving…
                </>
              ) : (
                'Change password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
