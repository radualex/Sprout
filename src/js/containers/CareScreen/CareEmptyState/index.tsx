import classNames from 'classnames';
import React from 'react';
import { Droplets } from 'lucide-react';

// Styles
import shared from '@/js/scss/shared.module.scss';

interface Props extends React.ComponentProps<'div'> {}

export const CareEmptyState: React.FunctionComponent<Props> = ({ className, ...props }) => {
    const classes = classNames(shared.empty, className);

    return (
        <div className={classes} {...props}>
            <div className={shared.big}>
                <Droplets size={48} />
            </div>
            <h2>
                Nothing to do yet
            </h2>
            <p>
                Add plants and their watering, fertilising and repotting tasks will show up here.
            </p>
        </div>
    );
};
