import styles from './styles.module.scss';
import { useCallback, useEffect, useState } from 'react';
import { dueTasks } from '../../helpers/care';
import { useClock } from '../../hooks';
import { deletePlant, getAllPlants, savePlant } from '../../services/db';
import type { Plant } from '../../types';
import { CareScreen } from '../CareScreen';
import { IdentifyScreen } from '../IdentifyScreen';
import { PlantDetail } from '../PlantDetail';
import { PlantsScreen } from '../PlantsScreen';
import { SettingsScreen } from '../SettingsScreen';
import { TABS } from './constants';
import type { Tab } from './types';

export default function App() {
    const [tab, setTab] = useState<Tab>('plants');
    const [plants, setPlants] = useState<Plant[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    useClock(); // periodic re-render so due counts stay fresh

    const refresh = useCallback(() => {
        getAllPlants().then((p) => { setPlants(p.sort((a, b) => { return b.acquiredAt - a.acquiredAt; })); });
    }, []);

    useEffect(refresh, [refresh]);

    const upsert = useCallback(
        async (plant: Plant) => {
            await savePlant(plant);
            refresh();
        },
        [refresh]
    );

    const remove = useCallback(
        async (id: string) => {
            await deletePlant(id);
            setSelectedId(null);
            refresh();
        },
        [refresh]
    );

    const dueCount = dueTasks(plants).length;
    const selected = plants.find((p) => { return p.id === selectedId; }) ?? null;

    return (
        <>
            {selected ? (
                <PlantDetail
                    plant={selected}
                    onBack={() => { setSelectedId(null); }}
                    onSave={upsert}
                    onDelete={remove}
                />
            ) : tab === 'plants'
                ? (
                        <PlantsScreen plants={plants} onSelect={setSelectedId} onAdd={() => { setTab('identify'); }} />
                    )
                : tab === 'identify'
                    ? (
                            <IdentifyScreen
                                onSaved={(plant) => {
                                    upsert(plant);
                                    setTab('plants');
                                    setSelectedId(plant.id);
                                }}
                            />
                        )
                    : tab === 'care'
                        ? (
                                <CareScreen plants={plants} onDone={upsert} onSelect={(id) => { setSelectedId(id); }} />
                            )
                        : (
                                <SettingsScreen plants={plants} onSeeded={refresh} />
                            )}

            <nav className={styles.bottomNav}>
                {TABS.map((t) => {
                    return (
                        <button
                            key={t.id}
                            type="button"
                            className={tab === t.id && !selected ? styles.active : ''}
                            onClick={() => {
                                setSelectedId(null);
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
