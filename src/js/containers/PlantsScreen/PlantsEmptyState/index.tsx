import React from 'react';
import classNames from 'classnames';

import { Camera, Sprout } from 'lucide-react';

// Constants
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import { Button } from '@/design-system/Button';

// Styles
import styles from '../styles.module.scss';

interface Props extends React.ComponentProps<'div'> {}

export const PlantsEmptyState: React.FunctionComponent<Props> = ({ className, ...props }) => {
    const classes = classNames(styles.empty, className);

    return (
        <div className={classes} {...props}>
            <div className={styles.big}>
                <Sprout size={48} />
            </div>
            <h2>No plants yet</h2>
            <p>
                Point your camera at a plant to identify it and start tracking watering, fertilising
                and repotting.
            </p>
            <Button variant={ButtonVariant.Link} href="/identify" icon={Camera}>
                Identify your first plant
            </Button>
        </div>
    );
};
