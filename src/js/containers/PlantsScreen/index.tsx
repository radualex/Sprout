'use client';

import Link from 'next/link';
import React from 'react';
import classNames from 'classnames';
import { Plus } from 'lucide-react';

// Components
import { PlantPhoto } from '@/js/components/PlantPhoto';
import { PlantSubtitle } from './PlantSubtitle';
import { PlantChips } from './PlantChips';
import { PlantsEmptyState } from './PlantsEmptyState';

// Helpers
import { displayName } from '@/js/helpers/plant';

// Hooks
import { useClock } from '@/js/hooks';

// Styles
import shared from '@/js/scss/shared.module.scss';
import styles from './styles.module.scss';

// Types
import type { Plant } from '@/js/types';

interface Props extends React.ComponentProps<'div'> {
    plants: Plant[];
}

export const PlantsScreen: React.FunctionComponent<Props> = ({ plants, className, ...props }) => {
    useClock(); // re-render tick; tasks computed against fresh Date.now()

    const classes = classNames(shared.screen, className);

    return (
        <div className={classes} {...props}>
            <header className={shared.appHeader}>
                <div>
                    <h1>
                        Sprout
                    </h1>
                    <div className={shared.sub}>
                        <PlantSubtitle plants={plants} />
                    </div>
                </div>
                <Link href="/identify" className={shared.btn}>
                    <Plus size={16} />
                    <span>
                        Add
                    </span>
                </Link>
            </header>
            {/* TODO: Split 2nd into subcomponent -> render helper needed here */}
            {plants.length === 0 ? (
                <PlantsEmptyState />
            ) : (
                <div className={styles.plantGrid}>
                    {plants.map((plant) => {
                        return (
                            <Link key={plant.id} href={`/plants/${plant.id}`} className={styles.plantCard}>
                                <PlantPhoto photo={plant.photo} alt={displayName(plant)} className={styles.photo} />
                                <div className={styles.meta}>
                                    <div className={styles.name}>
                                        {displayName(plant)}
                                    </div>
                                    <div className={styles.species}>
                                        {plant.species}
                                    </div>
                                    <div className={styles.chips}>
                                        <PlantChips plant={plant} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
