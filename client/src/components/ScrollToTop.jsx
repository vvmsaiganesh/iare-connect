import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Every page opens from the top.
 *
 * Browsers keep the previous page's scroll offset across client-side
 * navigations — so after signing in from a scrolled login page, a dashboard
 * could appear to open halfway down (or even from its very bottom foot when
 * the new page is shorter). Reset the window to the top on every route
 * change, and take scroll restoration away from the browser so Back
 * navigation and refreshes behave the same predictable way.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  // Browser-native scroll restoration races our reset on history traversal;
  // switching it to manual keeps "always open from the top" authoritative.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Layout effect: reset before the new page paints, so there is never a
  // one-frame glimpse of the inherited scroll position. Fires for the initial
  // mount (refresh) and for every navigation — including admin tab changes.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  return null;
}
