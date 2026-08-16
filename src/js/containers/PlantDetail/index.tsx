'use client';

import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

// Constants
import { DELETE_BUTTON_STYLE, DELETE_ROW_STYLE, HEADER_STYLE, SUB_STYLE } from './constants';

// Components
import { PlantPhoto } from '../../components/PlantPhoto';
import { EditSchedule } from '../../components/EditSchedule';
import { CareLogRow } from '../../components/CareLogRow';

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
import { CareKind, type Plant } from '../../types';

interface Props extends React.ComponentProps<'div'> {
    plant: Plant;
}

export const PlantDetail: React.FunctionComponent<Props> = ({ plant, className, ...props }) => {
    const router = useRouter();
    const now = useClock();
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);

    const handleMarkDone = useCallback(async (kind: CareKind) => {
        await markCareDone(plant.id, kind);

        router.refresh();
    }, [plant, router]);

    const handleSaveEdited = useCallback(async (edited: Plant) => {
        await updatePlant(edited.id, {
            nickname: edited.nickname,
            care: edited.care
        });

        setIsEditing(false);
        router.refresh();
    }, [router]);

    const handleRemove = useCallback(async () => {
        await deletePlant(plant.id);

        router.push('/');
        router.refresh();
    }, [plant, router]);

    const handleStartEdit = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleCancelEdit = useCallback(() => {
        setIsEditing(false);
    }, []);

    const handleStartDelete = useCallback(() => {
        setIsConfirmDelete(true);
    }, []);

    const handleKeepPlant = useCallback(() => {
        setIsConfirmDelete(false);
    }, []);

    return (
        <div className={`${shared.screen} ${className ?? ''}`} {...props}>
            <Link href="/" className={styles.backBtn}>
                ← My Plants
            </Link>

            <PlantPhoto photo={plant.photo} alt={displayName(plant)} className={styles.detailHero} />

            <header className={shared.appHeader} style={HEADER_STYLE}>
                <div>
                    <h1>{displayName(plant)}</h1>
                    <div className={shared.sub} style={SUB_STYLE}>
                        {plant.species}
                        {plant.commonName && plant.commonName !== plant.nickname ? ` · ${plant.commonName}` : ''}
                    </div>
                </div>
            </header>

            <div className={styles.careStats}>
                {[CareKind.Water, CareKind.Fertilize, CareKind.Repot].map((kind) => {
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
                {[CareKind.Water, CareKind.Fertilize, CareKind.Repot].map((kind) => {
                    return (
                        <CareLogRow key={kind} plant={plant} kind={kind} now={now} onDone={handleMarkDone} />
                    );
                })}
            </div>

            <div className={shared.sectionTitle}>Schedule</div>
            {isEditing ? (
                <EditSchedule key={plant.id} plant={plant} onSave={handleSaveEdited} onCancel={handleCancelEdit} />
            ) : (
                <React.Fragment>
                    <div className={shared.notice}>
                        💧 every {plant.care.waterEveryDays} days ·{' '}
                        🌿 {plant.care.fertilizeEveryDays ? `every ${plant.care.fertilizeEveryDays} days` : 'never'} ·{' '}
                        🪴 {plant.care.repotEveryMonths ? `every ${plant.care.repotEveryMonths} months` : 'never'}
                    </div>
                    <button type="button" className={`${shared.btn} ${shared.secondary} ${shared.block}`} onClick={handleStartEdit}>
                        Edit schedule
                    </button>
                </React.Fragment>
            )}

            <div style={DELETE_ROW_STYLE}>
                {isConfirmDelete ? (
                    <div className={shared.shutterRow}>
                        <button type="button" className={`${shared.btn} ${shared.secondary}`} onClick={handleKeepPlant}>
                            Keep plant
                        </button>
                        <button type="button" className={shared.btn} style={DELETE_BUTTON_STYLE} onClick={handleRemove}>
                            Delete forever
                        </button>
                    </div>
                ) : (
                    <button type="button" className={`${shared.btn} ${shared.danger}`} onClick={handleStartDelete}>
                        Remove {displayName(plant)}
                    </button>
                )}
            </div>
        </div>
    );
};
