import React from 'react';
import classNames from 'classnames';

// Constants
import { EMPTY_COLLECTION_TEXT } from './constants';

// Styles
import styles from '../styles.module.scss';

// Types
import type { Plant } from '@/js/types';

interface Props extends React.ComponentProps<'div'> {
    plants: Plant[];
}

export const PlantSubtitle: React.FunctionComponent<Props> = ({ plants, className, ...props }) => {
    const classes = classNames(styles.sub, className);

    const renderText = () => {
        return plants.length === 0 ? EMPTY_COLLECTION_TEXT : `${plants.length} plant${plants.length === 1 ? '' : 's'} in your care`;
    };

    return (
        <div className={classes} {...props}>
            {renderText()}
        </div>
    );
};
