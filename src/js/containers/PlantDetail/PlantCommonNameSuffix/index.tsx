import React from 'react';

// Types
import type { Plant } from '@/js/types';

interface Props extends React.ComponentProps<'span'> {
    plant: Plant;
}

export const PlantCommonNameSuffix: React.FunctionComponent<Props> = ({ plant, className, ...props }) => {
    return (
        <span className={className} {...props}>
            {plant.commonName}
        </span>
    );
};
