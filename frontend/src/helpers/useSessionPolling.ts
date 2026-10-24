import { useEffect, useRef } from 'react';
import axios from 'axios';
import { GetSessionVersion } from '../api/Session';

interface Options {
  username?: string; // Identify the session. The hook does nothing if either is missing.
  slug?: string; // Identify the session. The hook does nothing if either is missing.
  enabled: boolean; // false while the first load is in progress
  onChange: () => Promise<void>; // 	Async refetch of all session data, called when the version differs from the last one seen.
  onGone: () => void; // 	Called on a 404, meaning the session was deleted. Polling then stops.
  isBusy?: () => boolean; // 	Return true while the user has a write in flight. That tick is skipped, so a refetch can't overwrite optimistic state.
  activeMs?: number; // idleAfterMs	Defaults are 3 s, 15 s, and about 2 min of no pointer or key input.
  idleMs?: number;
  idleAfterMs?: number;
}

// No requests while the tab is hidden, and an immediate check when it returns.
// A 3s interval while the user is active and 15s after about 2 minutes of inactivity.
// A small random jitter.
// Polling stops if the session is deleted.

export function useSessionPolling({
  username,
  slug,
  enabled,
  onChange,
  onGone,
  isBusy,
  activeMs = 3000,
  idleMs = 15000,
  idleAfterMs = 120000,
}: Options) {
  // refs keep the latest callbacks without restarting the loop when they change identity
  const onChangeRef = useRef(onChange);
  const onGoneRef = useRef(onGone);
  const isBusyRef = useRef(isBusy);
  useEffect(() => {
    onChangeRef.current = onChange;
    onGoneRef.current = onGone;
    isBusyRef.current = isBusy;
  });

  useEffect(() => {
    if (!enabled || !username || !slug) return;

    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastVersion: number | null = null;
    let lastActivity = Date.now();

    const markActive = () => {
      lastActivity = Date.now();
    };

    const schedule = () => {
      const idle = Date.now() - lastActivity > idleAfterMs;
      timer = setTimeout(
        tick,
        (idle ? idleMs : activeMs) + Math.random() * 500,
      ); // jitter
    };
    let running = false;
    const tick = async () => {
      if (stopped || running) return;
      running = true;
      try {
        if (document.visibilityState === 'visible' && !isBusyRef.current?.()) {
          try {
            const v = await GetSessionVersion(username, slug);
            if (stopped) return;
            if (lastVersion !== null && v !== lastVersion)
              await onChangeRef.current();
            lastVersion = v;
          } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
              onGoneRef.current();
              return;
            }
          }
        }
      } finally {
        running = false;
      }
      if (!stopped) schedule();
    };

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        clearTimeout(timer);
        tick();
      }
    };

    window.addEventListener('pointerdown', markActive);
    window.addEventListener('keydown', markActive);
    document.addEventListener('visibilitychange', onVisibility);
    tick();

    return () => {
      stopped = true;
      clearTimeout(timer);
      window.removeEventListener('pointerdown', markActive);
      window.removeEventListener('keydown', markActive);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled, username, slug, activeMs, idleMs, idleAfterMs]);
}
