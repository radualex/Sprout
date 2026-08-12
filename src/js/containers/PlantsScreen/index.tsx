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

interface Props {
    plants: Plant[];
    onSelect: (id: string) => void;
    onAdd: () => void;
}

export function PlantsScreen({ plants, onSelect, onAdd }: Props) {
    useClock(); // re-render tick; tasks computed against fresh Date.now()

    return (
        <div className={shared.screen}>
            <header className={shared.appHeader}>
                <div>
                    <h1>Sprout</h1>
                    <div className={shared.sub}>
                        {plants.length === 0
                            ? 'Your plant collection'
                            : `${plants.length} plant${plants.length === 1 ? '' : 's'} in your care`}
                    </div>
                </div>
                <button type="button" className={shared.btn} onClick={onAdd}>
                    ＋ Add
                </button>
            </header>

            {plants.length === 0 ? (
                <div className={shared.empty}>
                    <div className={shared.big}>🌱</div>
                    <h2>No plants yet</h2>
                    <p>
                        Point your camera at a plant to identify it and start tracking watering, fertilising
                        and repotting.
                    </p>
                    <button type="button" className={shared.btn} onClick={onAdd}>
                        📷 Identify your first plant
                    </button>
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
                            <button key={plant.id} type="button" className={styles.plantCard} onClick={() => { onSelect(plant.id); }}>
                                <PlantPhoto plant={plant} className={styles.photo} />
                                <div className={styles.meta}>
                                    <div className={styles.name}>{displayName(plant)}</div>
                                    <div className={styles.species}>{plant.species}</div>
                                    <div className={styles.chips}>
                                        {urgent.length > 0 ? (
                                            urgent.map((t) => {
                                                return (
                                                    <span
                                                        key={t.kind}
                                                        className={`${styles.chip} ${t.daysUntil < 0 ? styles.overdue : styles.due}`}
                                                    >
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
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
