import React from 'react';

const PLACEHOLDER_SRC = 'data:image/svg+xml,'
    + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2e5d3f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
        + '<path d="M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"/>'
        + '<path d="M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"/>'
        + '<path d="M5 21h14"/>'
        + '</svg>'
    );

interface Props extends Omit<React.ComponentProps<'img'>, 'alt'> {
    photo?: string;
    alt: string;
}

export const PlantPhoto: React.FunctionComponent<Props> = ({ photo, alt, className, ...props }) => {
    return <img className={className} src={photo ?? PLACEHOLDER_SRC} alt={alt} {...props} />;
};
