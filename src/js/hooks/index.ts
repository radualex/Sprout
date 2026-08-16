import { useEffect, useState } from 'react';

/** Renders a Blob as an object URL, revoking on cleanup or change. */
export function useObjectUrl(blob?: Blob): string | undefined {
    const [url, setUrl] = useState<string | undefined>(undefined);
    useEffect(() => {
        if (!blob) {
            return;
        }

        const objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
            setUrl(undefined);
        };
    }, [blob]);

    return url;
}

/** Re-renders periodically so due/overdue states stay fresh while the app is open. */
export function useClock(intervalMs = 60_000): number {
    const [now, setNow] = useState(() => {
        return Date.now();
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now());
        }, intervalMs);

        return () => {
            clearInterval(interval);
        };
    }, [intervalMs]);

    return now;
}
