'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Components
import { PlantPhoto } from '../../components/PlantPhoto';
import { EditSchedule } from '../../components/EditSchedule';

// Helpers
import { CARE_META, DAY_MS, formatDue, nextDue } from '../../helpers/care';
import { displayName } from '../../helpers/plant';

// Hooks
import { useClock } from '../../hooks';

// Lib
import { deletePlant, markCareDone, updatePlant } from '../../lib/actions/plants';

// Styles
import shared from '../../scss/shared.module.scss';
import styles from './styles.module.scss';

// Types
import type { CareKind, Plant } from '../../types';

interface Props extends React.ComponentProps<'div'> {
    plant: Plant;
}

export const PlantDetail: React.FunctionComponent<Props> = ({ plant, className, ...props }) => {
    const router = useRouter();
    const now = useClock();
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);

    async function markDone(kind: CareKind) {
        await markCareDone(plant.id, kind);
        router.refresh();
    }

    async function saveEdited(edited: Plant) {
        await updatePlant(edited.id, {
            nickname: edited.nickname,
            care: edited.care
        });
        setIsEditing(false);
        router.refresh();
    }

    async function remove() {
        await deletePlant(plant.id);
        router.push('/');
        router.refresh();
    }

    return (
        <div className={`${shared.screen} ${className ?? ''}`} {...props}>
            <Link href="/" className={styles.backBtn}>
                ← My Plants
            </Link>

            <PlantPhoto photo={plant.photo} alt={displayName(plant)} className={styles.detailHero} />

            <header className={shared.appHeader} style={{ paddingTop: 14 }}>
                <div>
                    <h1>{displayName(plant)}</h1>
                    <div className={shared.sub} style={{ fontStyle: 'italic' }}>
                        {plant.species}
                        {plant.commonName && plant.commonName !== plant.nickname ? ` · ${plant.commonName}` : ''}
                    </div>
                </div>
            </header>

            <div className={styles.careStats}>
                {(['water', 'fertilize', 'repot'] as CareKind[]).map((kind) => {
                    const due = nextDue(plant, kind);
                    const meta = CARE_META[kind];
                    const daysUntil = due === undefined ? undefined : Math.ceil((due - now) / DAY_MS);
                    const valueModule = daysUntil !== undefined && daysUntil < 0 ? styles.overdue : (daysUntil !== undefined && daysUntil <= 0 ? styles.due : '');
                    return (
                        <div key={kind} className={styles.careStat}>
                            <div className={styles.emoji}>{meta.emoji}</div>
                            <div className={styles.label}>{meta.label}</div>
                            <div className={`${styles.value} ${valueModule}`}>
                                {daysUntil === undefined ? '—' : formatDue(daysUntil)}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={shared.sectionTitle}>Log care</div>
            <div className={shared.taskList}>
                {(['water', 'fertilize', 'repot'] as CareKind[]).map((kind) => {
                    const meta = CARE_META[kind];
                    const last = plant.lastCare[kind];
                    const daysAgo = Math.floor((now - last) / DAY_MS);
                    return (
                        <div key={kind} className={shared.taskRow}>
                            <div className={shared.thumb}>{meta.emoji}</div>
                            <div className={shared.info}>
                                <div className={shared.title}>{meta.label}</div>
                                <div className={shared.when}>
                                    Last {meta.verb} {daysAgo === 0 ? 'today' : (daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`)}
                                </div>
                            </div>
                            <button type="button" className={shared.doneBtn} onClick={() => { void markDone(kind); }}>
                                ✓ {(meta.verb.at(0) ?? '').toUpperCase() + meta.verb.slice(1)} today
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className={shared.sectionTitle}>Schedule</div>
            {isEditing ? (
                <EditSchedule key={plant.id} plant={plant} onSave={saveEdited} onCancel={() => { setIsEditing(false); }} />
            ) : (
                <React.Fragment>
                    <div className={shared.notice}>
                        💧 every {plant.care.waterEveryDays} days ·{' '}
                        🌿 {plant.care.fertilizeEveryDays ? `every ${plant.care.fertilizeEveryDays} days` : 'never'} ·{' '}
                        🪴 {plant.care.repotEveryMonths ? `every ${plant.care.repotEveryMonths} months` : 'never'}
                    </div>
                    <button type="button" className={`${shared.btn} ${shared.secondary} ${shared.block}`} onClick={() => { setIsEditing(true); }}>
                        Edit schedule
                    </button>
                </React.Fragment>
            )}

            <div style={{ marginTop: 24, textAlign: 'center' }}>
                {isConfirmDelete ? (
                    <div className={shared.shutterRow}>
                        <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={() => { setIsConfirmDelete(false); }}>
                            Keep plant
                        </button>
                        <button type="button" className={shared.btn} style={{ background: 'var(--red)' }} onClick={() => { void remove(); }}>
                            Delete forever
                        </button>
                    </div>
                ) : (
                    <button type="button" className={`${shared.btn} ${shared.danger}`} onClick={() => { setIsConfirmDelete(true); }}>
                        Remove {displayName(plant)}
                    </button>
                )}
            </div>
        </div>
    );
};
