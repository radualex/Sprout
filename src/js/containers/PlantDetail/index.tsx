'use client';

import classNames from 'classnames';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

// Constants
import { DELETE_BUTTON_STYLE, DELETE_ROW_STYLE, HEADER_STYLE, SUB_STYLE } from './constants';

// Components
import { PlantPhoto } from '@/js/components/PlantPhoto';
import { EditSchedule } from '@/js/components/EditSchedule';
import { CareLogRow } from '@/js/components/CareLogRow';

// Helpers
import { CARE_META, DAY_MS, formatDue, nextDue } from '@/js/helpers/care';
import { displayName } from '@/js/helpers/plant';

// Hooks
import { useClock } from '@/js/hooks';

// Database
import { deletePlant, markCareDone, updatePlant } from '@/js/lib/db/actions';

// Styles
import shared from '@/js/scss/shared.module.scss';
import styles from './styles.module.scss';

// Types
import { CareKind, type Plant } from '@/js/types';

interface Props extends React.ComponentProps<'div'> {
    plant: Plant;
}

export const PlantDetail: React.FunctionComponent<Props> = ({ plant, className, ...props }) => {
    const classes = classNames(shared.screen, className);
    const secondaryButtonClasses = classNames(shared.btn, shared.secondary);
    const secondaryBlockButtonClasses = classNames(shared.btn, shared.secondary, shared.block);
    const dangerButtonClasses = classNames(shared.btn, shared.danger);

    const router = useRouter();
    const WaterIcon = CARE_META[CareKind.Water].icon;
    const FertilizeIcon = CARE_META[CareKind.Fertilize].icon;
    const RepotIcon = CARE_META[CareKind.Repot].icon;
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
        <div className={classes} {...props}>
            <Link href="/" className={styles.backBtn}>
                <ArrowLeft size={16} />
                My Plants
            </Link>

            <PlantPhoto photo={plant.photo} alt={displayName(plant)} className={styles.detailHero} />

            <header className={shared.appHeader} style={HEADER_STYLE}>
                <div>
                    <h1>
                        {displayName(plant)}
                    </h1>
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
                    const valueClasses = classNames(styles.value, {
                        [styles.overdue]: daysUntil !== undefined && daysUntil < 0,
                        [styles.due]: daysUntil !== undefined && daysUntil <= 0
                    });

                    return (
                        <div key={kind} className={styles.careStat}>
                            <div className={styles.emoji}>
                                <meta.icon size={22} />
                            </div>
                            <div className={styles.label}>
                                {meta.label}
                            </div>
                            <div className={valueClasses}>
                                {daysUntil === undefined ? '—' : formatDue(daysUntil)}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={shared.sectionTitle}>
                Log care
            </div>
            <div className={shared.taskList}>
                {[CareKind.Water, CareKind.Fertilize, CareKind.Repot].map((kind) => {
                    return (
                        <CareLogRow key={kind} plant={plant} kind={kind} now={now} onDone={handleMarkDone} />
                    );
                })}
            </div>

            <div className={shared.sectionTitle}>
                Schedule
            </div>
            {isEditing ? (
                <EditSchedule key={plant.id} plant={plant} onSave={handleSaveEdited} onCancel={handleCancelEdit} />
            ) : (
                <React.Fragment>
                    <div className={shared.notice}>
                        <WaterIcon size={14} />
                        <span>
                            {` every ${plant.care.waterEveryDays} days · `}
                        </span>
                        <FertilizeIcon size={14} />
                        <span>
                            {' '}
                            {plant.care.fertilizeEveryDays ? `every ${plant.care.fertilizeEveryDays} days` : 'never'}
                            {' · '}
                        </span>
                        <RepotIcon size={14} />
                        <span>
                            {' '}
                            {plant.care.repotEveryMonths ? `every ${plant.care.repotEveryMonths} months` : 'never'}
                        </span>
                    </div>
                    <button type="button" className={secondaryBlockButtonClasses} onClick={handleStartEdit}>
                        Edit schedule
                    </button>
                </React.Fragment>
            )}

            <div style={DELETE_ROW_STYLE}>
                {isConfirmDelete ? (
                    <div className={shared.shutterRow}>
                        <button type="button" className={secondaryButtonClasses} onClick={handleKeepPlant}>
                            Keep plant
                        </button>
                        <button type="button" className={shared.btn} style={DELETE_BUTTON_STYLE} onClick={handleRemove}>
                            Delete forever
                        </button>
                    </div>
                ) : (
                    <button type="button" className={dangerButtonClasses} onClick={handleStartDelete}>
                        {`Remove ${displayName(plant)}`}
                    </button>
                )}
            </div>
        </div>
    );
};
