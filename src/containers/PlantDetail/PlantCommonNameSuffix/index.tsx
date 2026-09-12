import React from 'react';

// Types
import type { Plant } from '@/types';

export interface Props extends React.ComponentProps<'span'> {
    plant: Plant;
}

const PlantCommonNameSuffix: React.FunctionComponent<Props> = ({ plant, className, ...props }) => {
    return (
        <span className={className} {...props}>
            {plant.commonName}
        </span>
    );
};

export default PlantCommonNameSuffix;
