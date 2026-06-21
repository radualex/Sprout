import { useEffect, useState } from 'react';

/** Renders a Blob as an object URL, revoking on cleanup or change. */
export function useObjectUrl(blob?: Blob): string | null {
    const [url, setUrl] = useState<string | null>(null);
    useEffect(() => {
        if (!blob) return;
        const u = URL.createObjectURL(blob);
        setUrl(u);
        return () => {
            URL.revokeObjectURL(u);
            setUrl(null);
        };
    }, [blob]);
    return url;
}

/** Re-renders periodically so due/overdue states stay fresh while the app is open. */
export function useClock(intervalMs = 60_000): number {
    const [now, setNow] = useState(() => { return Date.now(); });
    useEffect(() => {
        const t = setInterval(() => { setNow(Date.now()); }, intervalMs);
        return () => { clearInterval(t); };
    }, [intervalMs]);
    return now;
}
