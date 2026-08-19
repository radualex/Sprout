import React from 'react';
import classNames from 'classnames';

// Styles
import shared from '@/js/scss/shared.module.scss';

// Types
import type { Plant } from '@/js/types';

interface Props extends React.ComponentProps<'div'> {
    plants: Plant[];
}

export const PlantSubtitle: React.FunctionComponent<Props> = ({ plants, className, ...props }) => {
    const classes = classNames(shared.sub, className);

    const renderText = () => {
        return plants.length === 0 ? 'Your plant collection' : `${plants.length} plant${plants.length === 1 ? '' : 's'} in your care`;
    };

    return (
        <div className={classes} {...props}>
            {renderText()}
        </div>
    );
};
