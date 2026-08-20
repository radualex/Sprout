import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';

// Components
import { PlantPhoto } from '@/js/components/PlantPhoto';
import { PlantChips } from '../PlantChips';

// Helpers
import { displayName } from '@/js/helpers/plant';

// Styles
import styles from '../styles.module.scss';

// Types
import type { Plant } from '@/js/types';

interface Props extends React.ComponentProps<'div'> {
    plants: Plant[];
}

export const PlantGrid: React.FunctionComponent<Props> = ({ plants, className, ...props }) => {
    const classes = classNames(styles.plantGrid, className);

    return (
        <div className={classes} {...props}>
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
    );
};
