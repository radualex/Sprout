import { useEffect, useState } from 'react';

/** Renders a Blob as an object URL, revoking on cleanup or change. */
export const useObjectUrl = (blob?: Blob): string | undefined => {
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
};
