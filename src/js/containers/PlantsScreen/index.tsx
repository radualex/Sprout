'use client';

import Link from 'next/link';
import React from 'react';
import classNames from 'classnames';
import { Camera, Plus, Sprout } from 'lucide-react';

// Components
import { PlantPhoto } from '@/js/components/PlantPhoto';

// Helpers
import { allTasks, CARE_META, formatDue } from '@/js/helpers/care';
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
                        {plants.length === 0
                            ? 'Your plant collection'
                            : `${plants.length} plant${plants.length === 1 ? '' : 's'} in your care`}
                    </div>
                </div>
                <Link href="/identify" className={shared.btn}>
                    <Plus size={16} />
                    <span>
                        Add
                    </span>
                </Link>
            </header>

            {plants.length === 0 ? (
                <div className={shared.empty}>
                    <div className={shared.big}>
                        <Sprout size={48} />
                    </div>
                    <h2>
                        No plants yet
                    </h2>
                    <p>
                        Point your camera at a plant to identify it and start tracking watering, fertilising
                        and repotting.
                    </p>
                    <Link href="/identify" className={shared.btn}>
                        <Camera size={16} />
                        <span>
                            Identify your first plant
                        </span>
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
                        const NextMeta = next ? CARE_META[next.kind] : undefined;

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
                                        {urgent.length > 0 ? (
                                            urgent.map((t) => {
                                                const chipClasses = classNames(styles.chip, {
                                                    [styles.overdue]: t.daysUntil < 0,
                                                    [styles.due]: t.daysUntil >= 0
                                                });
                                                const TaskIcon = CARE_META[t.kind].icon;

                                                return (
                                                    <span key={t.kind} className={chipClasses}>
                                                        <TaskIcon size={12} />
                                                        <span>
                                                            {` ${formatDue(t.daysUntil)}`}
                                                        </span>
                                                    </span>
                                                );
                                            })
                                        ) : (NextMeta && next
                                            ? (
                                                    <span className={styles.chip}>
                                                        <NextMeta.icon size={12} />
                                                        <span>
                                                            {` ${NextMeta.label} `}
                                                        </span>
                                                        <span>
                                                            {formatDue(next.daysUntil)}
                                                        </span>
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
