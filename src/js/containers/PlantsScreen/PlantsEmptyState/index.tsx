import React from 'react';
import classNames from 'classnames';

import Link from 'next/link';
import { Camera, Sprout } from 'lucide-react';

// Styles
import shared from '@/js/scss/shared.module.scss';

interface Props extends React.ComponentProps<'div'> {}

export const PlantsEmptyState: React.FunctionComponent<Props> = ({ className, ...props }) => {
    const classes = classNames(shared.empty, className);

    return (
        <div className={classes} {...props}>
            <div className={shared.big}>
                <Sprout size={48} />
            </div>
            <h2>No plants yet</h2>
            <p>
                Point your camera at a plant to identify it and start tracking watering, fertilising
                and repotting.
            </p>
            <Link href="/identify" className={shared.btn}>
                <Camera size={16} />
                <span>Identify your first plant</span>
            </Link>
        </div>
    );
};
