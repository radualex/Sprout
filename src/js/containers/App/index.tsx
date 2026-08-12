import { useCallback, useEffect, useState } from 'react';

// Constants
import { TABS } from './constants';

// Components
import { CareScreen } from '../CareScreen';
import { IdentifyScreen } from '../IdentifyScreen';
import { PlantDetail } from '../PlantDetail';
import { PlantsScreen } from '../PlantsScreen';
import { SettingsScreen } from '../SettingsScreen';

// Helpers
import { dueTasks } from '../../helpers/care';

// Hooks
import { useClock } from '../../hooks';

// Services
import { deletePlant, getAllPlants, savePlant } from '../../services/db';

// Styles
import styles from './styles.module.scss';

// Types
import type { Plant } from '../../types';
import type { Tab } from './types';

export default function App() {
    const [tab, setTab] = useState<Tab>('plants');
    const [plants, setPlants] = useState<Plant[]>([]);
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
    useClock(); // periodic re-render so due counts stay fresh

    const refresh = useCallback(async () => {
        const p = await getAllPlants();
        setPlants(p.toSorted((a, b) => {
            return b.acquiredAt - a.acquiredAt;
        }));
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    const upsert = useCallback(
        async (plant: Plant) => {
            await savePlant(plant);
            await refresh();
        },
        [refresh]
    );

    const remove = useCallback(
        async (id: string) => {
            await deletePlant(id);
            setSelectedId(undefined);
            await refresh();
        },
        [refresh]
    );

    const dueCount = dueTasks(plants).length;
    const selected = plants.find((p) => {
        return p.id === selectedId;
    });

    function renderScreen() {
        if (selected) {
            return (
                <PlantDetail
                    plant={selected}
                    onBack={() => {
                        setSelectedId(undefined);
                    }}
                    onSave={upsert}
                    onDelete={remove}
                />
            );
        }
        if (tab === 'plants') {
            return (
                <PlantsScreen
                    plants={plants}
                    onSelect={setSelectedId}
                    onAdd={() => {
                        setTab('identify');
                    }}
                />
            );
        }
        if (tab === 'identify') {
            return (
                <IdentifyScreen
                    onSaved={(plant) => {
                        void upsert(plant);
                        setTab('plants');
                        setSelectedId(plant.id);
                    }}
                />
            );
        }
        if (tab === 'care') {
            return (
                <CareScreen
                    plants={plants}
                    onDone={upsert}
                    onSelect={(id) => {
                        setSelectedId(id);
                    }}
                />
            );
        }
        return <SettingsScreen plants={plants} onSeeded={refresh} />;
    }

    return (
        <>
            {renderScreen()}

            <nav className={styles.bottomNav}>
                {TABS.map((t) => {
                    return (
                        <button
                            key={t.id}
                            type="button"
                            className={tab === t.id && !selected ? styles.active : ''}
                            onClick={() => {
                                setSelectedId(undefined);
                                setTab(t.id);
                            }}
                        >
                            <span className={styles.icon}>{t.icon}</span>
                            {t.label}
                            {t.id === 'care' && dueCount > 0 && <span className={styles.badge}>{dueCount}</span>}
                        </button>
                    );
                })}
            </nav>
        </>
    );
}
