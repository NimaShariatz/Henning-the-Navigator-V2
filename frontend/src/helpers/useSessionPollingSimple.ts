import { useEffect, useRef } from 'react';
import { GetSessionVersion } from '../api/Session';

interface Options {
  username?: string;
  slug?: string;
  enabled: boolean; // false while the first load is in progress
  onChange: () => Promise<void>; // refetch everything
  intervalMs?: number;
}

// Checks the session version every few seconds and calls onChange when it differs.
export function useSessionPolling({
  username,
  slug,
  enabled,
  onChange,
  intervalMs = 3000,
}: Options) {
  // ref keeps the latest callback without restarting the interval
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    if (!enabled || !username || !slug) return;

    let lastVersion: number | null = null;

    const tick = async () => {
      try {
        const version = await GetSessionVersion(username, slug);
        if (lastVersion !== null && version !== lastVersion) {
          await onChangeRef.current();
        }
        lastVersion = version;
      } catch {
        // ignore errors and try again on the next tick
      }
    };

    tick(); // sets the baseline version
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [enabled, username, slug, intervalMs]);
}
