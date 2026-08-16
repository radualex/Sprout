'use client';

import classNames from 'classnames';
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Droplets } from 'lucide-react';

// Components
import { TaskRow } from '../../components/TaskRow';

// Helpers
import { allTasks, type CareTask } from '../../helpers/care';

// Hooks
import { useClock } from '../../hooks';

// Database
import { markCareDone } from '../../lib/db/actions';

// Styles
import shared from '../../scss/shared.module.scss';

// Types
import type { Plant } from '../../types';

interface Props extends React.ComponentProps<'div'> {
    plants: Plant[];
}

export const CareScreen: React.FunctionComponent<Props> = ({ plants, className, ...props }) => {
    const classes = classNames(shared.screen, className);
    const router = useRouter();

    useClock(); // re-render tick; tasks computed against fresh Date.now()

    const tasks = allTasks(plants);
    const due = tasks.filter((t) => {
        return t.daysUntil <= 0;
    });
    const upcoming = tasks.filter((t) => {
        return t.daysUntil > 0 && t.daysUntil <= 14;
    });

    const handleDone = useCallback(async (task: CareTask) => {
        await markCareDone(task.plant.id, task.kind);
        router.refresh();
    }, [router]);

    const handleSelect = useCallback((id: string) => {
        router.push(`/plants/${id}`);
    }, [router]);

    return (
        <div className={classes} {...props}>
            <header className={shared.appHeader}>
                <div>
                    <h1>Care</h1>
                    <div className={shared.sub}>
                        {due.length === 0 ? 'All plants are happy 🎉' : `${due.length} task${due.length === 1 ? ' needs' : 's need'} attention`}
                    </div>
                </div>
            </header>

            {plants.length === 0 ? (
                <div className={shared.empty}>
                    <div className={shared.big}>
                        <Droplets size={48} />
                    </div>
                    <h2>Nothing to do yet</h2>
                    <p>Add plants and their watering, fertilising and repotting tasks will show up here.</p>
                </div>
            ) : (
                <React.Fragment>
                    {due.length > 0 && (
                        <React.Fragment>
                            <div className={shared.sectionTitle}>Needs attention</div>
                            <div className={shared.taskList}>
                                {due.map((t) => {
                                    return (
                                        <TaskRow key={`${t.plant.id}-${t.kind}`} task={t} onDone={handleDone} onSelect={handleSelect} />
                                    );
                                })}
                            </div>
                        </React.Fragment>
                    )}

                    <div className={shared.sectionTitle}>Coming up</div>
                    {upcoming.length === 0 ? (
                        <div className={shared.notice}>Nothing due in the next two weeks.</div>
                    ) : (
                        <div className={shared.taskList}>
                            {upcoming.map((t) => {
                                return (
                                    <TaskRow key={`${t.plant.id}-${t.kind}`} task={t} onDone={handleDone} onSelect={handleSelect} />
                                );
                            })}
                        </div>
                    )}
                </React.Fragment>
            )}
        </div>
    );
};
