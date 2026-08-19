import React from 'react';

// Components
import { TaskRow } from '@/js/components/TaskRow';

// Helpers
import type { CareTask } from '@/js/helpers/care';

// Styles
import shared from '@/js/scss/shared.module.scss';

interface Props {
    title: string;
    tasks: CareTask[];
    onDone: (task: CareTask) => void | Promise<void>;
    onSelectPlant: (id: string) => void;
    emptyNotice?: string;
}

export const CareTaskSection: React.FunctionComponent<Props> = ({ title, tasks, onDone, onSelectPlant, emptyNotice }) => {
    const shouldShowTitle = tasks.length > 0 || Boolean(emptyNotice);

    const renderTitle = () => {
        return (
            <div className={shared.sectionTitle}>
                {title}
            </div>
        );
    };

    const renderEmptyNotice = () => {
        return (
            <div className={shared.notice}>
                {emptyNotice}
            </div>
        );
    };

    const renderTaskList = () => {
        return (
            <div className={shared.taskList}>
                {tasks.map((t) => {
                    return (
                        <TaskRow key={`${t.plant.id}-${t.kind}`} task={t} onDone={onDone} onSelect={onSelectPlant} />
                    );
                })}
            </div>
        );
    };

    const renderContent = () => {
        if (tasks.length === 0) {
            return emptyNotice && renderEmptyNotice();
        }

        return renderTaskList();
    };

    return (
        <React.Fragment>
            {shouldShowTitle && renderTitle()}
            {renderContent()}
        </React.Fragment>
    );
};
