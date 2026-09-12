import React from 'react';

// Constants
import { PLACEHOLDER_SRC } from './constants';

export interface Props extends Omit<React.ComponentProps<'img'>, 'alt'> {
    photo?: string;
    alt: string;
}

const PlantPhoto: React.FunctionComponent<Props> = ({ photo, alt, className, ...props }) => {
    return <img className={className} src={photo ?? PLACEHOLDER_SRC} alt={alt} {...props} />;
};

export default PlantPhoto;
