import React from 'react';

// Components
import TaskRow from '@/components/TaskRow';

// Helpers
import type { CareTask } from '@/helpers/care';

// Styles
import styles from './styles.module.css';

export interface Props {
    title: string;
    tasks: CareTask[];
    onDone: (task: CareTask) => void | Promise<void>;
    onSelectPlant: (id: string) => void;
    emptyNotice?: string;
}

const CareTaskSection: React.FunctionComponent<Props> = ({ title, tasks, onDone, onSelectPlant, emptyNotice }) => {
    const shouldShowTitle = tasks.length > 0 || Boolean(emptyNotice);

    const renderTitle = () => {
        return (
            <h2 className={styles.sectionTitle}>
                {title}
            </h2>
        );
    };

    const renderEmptyNotice = () => {
        return (
            <div className={styles.notice}>
                {emptyNotice}
            </div>
        );
    };

    const renderTaskList = () => {
        return (
            <ul className={styles.taskList}>
                {tasks.map((task) => {
                    return (
                        <li key={`${task.plant.id}-${task.kind}`}>
                            <TaskRow task={task} onDone={onDone} onSelect={onSelectPlant} />
                        </li>
                    );
                })}
            </ul>
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

export default CareTaskSection;
