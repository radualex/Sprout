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
import { PlantCommonNameSuffix } from './PlantCommonNameSuffix';
import { CareStatValue } from './CareStatValue';
import { CareScheduleNotice } from './CareScheduleNotice';

// Helpers
import { CARE_META } from '@/js/helpers/care';
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
    const dangerButtonClasses = classNames(shared.btn, shared.danger);

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
                        {plant.commonName && plant.commonName !== plant.nickname && (
                            <PlantCommonNameSuffix plant={plant} />
                        )}
                    </div>
                </div>
            </header>

            <div className={styles.careStats}>
                {[CareKind.Water, CareKind.Fertilize, CareKind.Repot].map((kind) => {
                    const meta = CARE_META[kind];

                    return (
                        <div key={kind} className={styles.careStat}>
                            <div className={styles.emoji}>
                                <meta.icon size={22} />
                            </div>
                            <div className={styles.label}>
                                {meta.label}
                            </div>
                            <CareStatValue plant={plant} kind={kind} now={now} />
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
            {/* TODO: render helper */}
            {isEditing ? (
                <EditSchedule key={plant.id} plant={plant} onSave={handleSaveEdited} onCancel={handleCancelEdit} />
            ) : (
                <CareScheduleNotice plant={plant} onEdit={handleStartEdit} />
            )}

            <div style={DELETE_ROW_STYLE}>
                {/* TOODO: split subcomponents (This is common pattern in other components -> generic block needed) */}
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
