import React from 'react';

const PLACEHOLDER_SRC = 'data:image/svg+xml,'
    + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">'
        + '<text x="50%" y="50%" font-size="24" text-anchor="middle" dominant-baseline="central">🌱</text>'
        + '</svg>'
    );

interface Props extends Omit<React.ComponentProps<'img'>, 'alt'> {
    photo?: string;
    alt: string;
}

export const PlantPhoto: React.FunctionComponent<Props> = ({ photo, alt, className, ...props }) => {
    return <img className={className} src={photo ?? PLACEHOLDER_SRC} alt={alt} {...props} />;
};
