'use client';

import Link from 'next/link';
import React from 'react';

// Components
import { PlantPhoto } from '../../components/PlantPhoto';

// Helpers
import { allTasks, CARE_META, formatDue } from '../../helpers/care';
import { displayName } from '../../helpers/plant';

// Hooks
import { useClock } from '../../hooks';

// Styles
import shared from '../../scss/shared.module.scss';
import styles from './styles.module.scss';

// Types
import type { Plant } from '../../types';

interface Props extends React.ComponentProps<'div'> {
    plants: Plant[];
}

export const PlantsScreen: React.FunctionComponent<Props> = ({ plants, className, ...props }) => {
    useClock(); // re-render tick; tasks computed against fresh Date.now()

    return (
        <div className={`${shared.screen} ${className ?? ''}`} {...props}>
            <header className={shared.appHeader}>
                <div>
                    <h1>Sprout</h1>
                    <div className={shared.sub}>
                        {plants.length === 0
                            ? 'Your plant collection'
                            : `${plants.length} plant${plants.length === 1 ? '' : 's'} in your care`}
                    </div>
                </div>
                <Link href="/identify" className={shared.btn}>
                    ＋ Add
                </Link>
            </header>

            {plants.length === 0 ? (
                <div className={shared.empty}>
                    <div className={shared.big}>🌱</div>
                    <h2>No plants yet</h2>
                    <p>
                        Point your camera at a plant to identify it and start tracking watering, fertilising
                        and repotting.
                    </p>
                    <Link href="/identify" className={shared.btn}>
                        📷 Identify your first plant
                    </Link>
                </div>
            ) : (
                <div className={styles.plantGrid}>
                    {plants.map((plant) => {
                        const tasks = allTasks([plant]);
                        const urgent = tasks.filter((t) => {
                            return t.daysUntil <= 0;
                        }).slice(0, 2);
                        const next = tasks.at(0);
                        return (
                            <Link key={plant.id} href={`/plants/${plant.id}`} className={styles.plantCard}>
                                <PlantPhoto photo={plant.photo} alt={displayName(plant)} className={styles.photo} />
                                <div className={styles.meta}>
                                    <div className={styles.name}>{displayName(plant)}</div>
                                    <div className={styles.species}>{plant.species}</div>
                                    <div className={styles.chips}>
                                        {urgent.length > 0 ? (
                                            urgent.map((t) => {
                                                return (
                                                    <span key={t.kind} className={`${styles.chip} ${t.daysUntil < 0 ? styles.overdue : styles.due}`}>
                                                        {CARE_META[t.kind].emoji} {formatDue(t.daysUntil)}
                                                    </span>
                                                );
                                            })
                                        ) : (next
                                            ? (
                                                    <span className={styles.chip}>
                                                        {CARE_META[next.kind].emoji} {CARE_META[next.kind].label}{' '}
                                                        {formatDue(next.daysUntil)}
                                                    </span>
                                                )
                                            : undefined)}
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
