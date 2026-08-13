import React from 'react';

// Hooks
import { useObjectUrl } from '../../hooks';

const PLACEHOLDER_SRC = 'data:image/svg+xml,'
    + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">'
        + '<text x="50%" y="50%" font-size="24" text-anchor="middle" dominant-baseline="central">🌱</text>'
        + '</svg>'
    );

interface Props extends Omit<React.ComponentProps<'img'>, 'alt'> {
    photo?: Blob | string;
    alt: string;
}

export const PlantPhoto: React.FunctionComponent<Props> = ({ photo, alt, className, ...props }) => {
    const blobUrl = useObjectUrl(photo instanceof Blob ? photo : undefined);
    const url = typeof photo === 'string' ? photo : (blobUrl ?? PLACEHOLDER_SRC);
    return <img className={className} src={url} alt={alt} {...props} />;
};
