'use client';

import React from 'react';
import classNames from 'classnames';
import { Plus } from 'lucide-react';

// Constants
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import { Button } from '@/design-system/Button';
import { PlantGrid } from './PlantGrid';
import { PlantsEmptyState } from './PlantsEmptyState';
import { PlantSubtitle } from './PlantSubtitle';

// Hooks
import { useClock } from '@/js/hooks';

// Styles
import styles from './styles.module.scss';

// Types
import type { Plant } from '@/js/types';

interface Props extends React.ComponentProps<'div'> {
    plants: Plant[];
}

export const PlantsScreen: React.FunctionComponent<Props> = ({ plants, className, ...props }) => {
    useClock(); // re-render tick; tasks computed against fresh Date.now()

    const classes = classNames(styles.screen, className);

    const renderContent = () => {
        if (plants.length === 0) {
            return <PlantsEmptyState />;
        }

        return <PlantGrid plants={plants} />;
    };

    return (
        <div className={classes} {...props}>
            <header className={styles.appHeader}>
                <div>
                    <h1>
                        Sprout
                    </h1>
                    <div className={styles.sub}>
                        <PlantSubtitle plants={plants} />
                    </div>
                </div>
                <Button variant={ButtonVariant.Link} href="/identify" icon={Plus}>
                    Add
                </Button>
            </header>
            {renderContent()}
        </div>
    );
};
