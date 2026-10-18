import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const VISIBLE_MS = 3400; // linger time before the exit animation starts
const EXIT_MS = 300; // exit animation duration

/**
 * Sleek capsule notification pinned to the bottom centre of the page.
 * Pops up, lingers, then slides back out and unmounts itself.
 *
 * Rendered through a portal into <body> so no transformed or blurred
 * ancestor (e.g. the sticky Navbar's backdrop blur) can capture it and
 * pull it away from the viewport centre.
 */
export default function Toast({ message, onDismiss }) {
  const [leaving, setLeaving] = useState(false);
  const dismissRef = useRef(onDismiss);

  useEffect(() => {
    dismissRef.current = onDismiss;
  });

  useEffect(() => {
    setLeaving(false); // fresh message → pop up again
    const exitTimer = setTimeout(() => setLeaving(true), VISIBLE_MS);
    const goneTimer = setTimeout(() => dismissRef.current?.(), VISIBLE_MS + EXIT_MS);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(goneTimer);
    };
  }, [message]);

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 z-[90] flex max-w-[min(92vw,44rem)] -translate-x-1/2 items-center gap-3 rounded-full border border-success/40 bg-card/95 py-3 pl-4 pr-5 shadow-[0_18px_44px_-14px_rgba(0,0,0,0.45)] backdrop-blur-xl ${
        leaving ? 'toast-out' : 'toast-in'
      }`}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <span className="min-w-0 truncate text-sm font-semibold">{message}</span>
    </div>,
    document.body
  );
}
