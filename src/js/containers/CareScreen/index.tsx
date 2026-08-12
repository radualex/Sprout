// Components
import { TaskRow } from '../../components/TaskRow';

// Helpers
import { allTasks, type CareTask } from '../../helpers/care';

// Hooks
import { useClock } from '../../hooks';

// Styles
import shared from '../../scss/shared.module.scss';

// Types
import type { Plant } from '../../types';

interface Props {
    plants: Plant[];
    onDone: (plant: Plant) => void;
    onSelect: (id: string) => void;
}

export function CareScreen({ plants, onDone, onSelect }: Props) {
    useClock(); // re-render tick; tasks computed against fresh Date.now()
    const tasks = allTasks(plants);
    const due = tasks.filter((t) => {
        return t.daysUntil <= 0;
    });
    const upcoming = tasks.filter((t) => {
        return t.daysUntil > 0 && t.daysUntil <= 14;
    });

    function markDone(task: CareTask) {
        const updated: Plant = {
            ...task.plant,
            lastCare: { ...task.plant.lastCare,
                [task.kind]: Date.now() }
        };
        onDone(updated);
    }

    return (
        <div className={shared.screen}>
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
                    <div className={shared.big}>💧</div>
                    <h2>Nothing to do yet</h2>
                    <p>Add plants and their watering, fertilising and repotting tasks will show up here.</p>
                </div>
            ) : (
                <>
                    {due.length > 0 && (
                        <>
                            <div className={shared.sectionTitle}>Needs attention</div>
                            <div className={shared.taskList}>
                                {due.map((t) => {
                                    return (
                                        <TaskRow key={`${t.plant.id}-${t.kind}`} task={t} onDone={markDone} onSelect={onSelect} />
                                    );
                                })}
                            </div>
                        </>
                    )}

                    <div className={shared.sectionTitle}>Coming up</div>
                    {upcoming.length === 0 ? (
                        <div className={shared.notice}>Nothing due in the next two weeks.</div>
                    ) : (
                        <div className={shared.taskList}>
                            {upcoming.map((t) => {
                                return (
                                    <TaskRow key={`${t.plant.id}-${t.kind}`} task={t} onDone={markDone} onSelect={onSelect} />
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
