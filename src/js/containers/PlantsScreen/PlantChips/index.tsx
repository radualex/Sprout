import React from 'react';
import classNames from 'classnames';

// Helpers
import { allTasks, CARE_META, formatDue } from '@/js/helpers/care';

// Styles
import styles from '../styles.module.scss';

// Types
import type { Plant } from '@/js/types';

interface Props extends React.ComponentProps<'div'> {
    plant: Plant;
}

export const PlantChips: React.FunctionComponent<Props> = ({ plant, className, ...props }) => {
    const classes = classNames(styles.chips, className);
    const tasks = allTasks([plant]);
    const urgent = tasks.filter((t) => {
        return t.daysUntil <= 0;
    }).slice(0, 2);
    const next = tasks.at(0);
    const NextMeta = next ? CARE_META[next.kind] : undefined;

    const renderUrgentChips = () => {
        return urgent.map((t) => {
            const chipClasses = classNames(styles.chip, {
                [styles.overdue]: t.daysUntil < 0,
                [styles.due]: t.daysUntil >= 0
            });
            const TaskIcon = CARE_META[t.kind].icon;

            return (
                <span key={t.kind} className={chipClasses}>
                    <TaskIcon size={12} />
                    <span>
                        {formatDue(t.daysUntil)}
                    </span>
                </span>
            );
        });
    };

    const renderNextChip = () => {
        if (!NextMeta || !next) {
            return;
        }

        return (
            <span className={styles.chip}>
                <NextMeta.icon size={12} />
                <span>
                    {NextMeta.label}
                </span>
                <span>
                    {formatDue(next.daysUntil)}
                </span>
            </span>
        );
    };

    const renderContent = () => {
        if (urgent.length > 0) {
            return renderUrgentChips();
        }

        return NextMeta && next ? renderNextChip() : undefined;
    };

    return (
        <div className={classes} {...props}>
            {renderContent()}
        </div>
    );
};
