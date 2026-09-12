'use client';

import React from 'react';
import classNames from 'classnames';
import { Plus } from 'lucide-react';

// Constants
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import Button from '@/design-system/Button';
import PlantGrid from './PlantGrid';
import PlantsEmptyState from './PlantsEmptyState';
import PlantSubtitle from './PlantSubtitle';

// Hooks
import { useClock } from '@/hooks';

// Styles
import styles from './styles.module.css';

// Types
import type { Plant } from '@/types';

export interface Props extends React.ComponentProps<'div'> {
    plants: Plant[];
}

const PlantsScreen: React.FunctionComponent<Props> = ({ plants, className, ...props }) => {
    useClock();

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

export default PlantsScreen;
