'use client';

import classNames from 'classnames';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

// Constants
import { HEADER_STYLE, SUB_STYLE } from './constants';

// Components
import { PlantPhoto } from '@/js/components/PlantPhoto';
import { EditSchedule } from '@/js/components/EditSchedule';
import { CareLogRow } from '@/js/components/CareLogRow';
import { DeletePlantBlock } from './DeletePlantBlock';
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
import styles from './styles.module.scss';

// Types
import { CareKind, type Plant } from '@/js/types';

interface Props extends React.ComponentProps<'div'> {
    plant: Plant;
}

export const PlantDetail: React.FunctionComponent<Props> = ({ plant, className, ...props }) => {
    const classes = classNames(styles.root, styles.screen, className);

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

    const renderSchedule = () => {
        return isEditing ? <EditSchedule key={plant.id} plant={plant} onSave={handleSaveEdited} onCancel={handleCancelEdit} /> : <CareScheduleNotice plant={plant} onEdit={handleStartEdit} />;
    };

    return (
        <div className={classes} {...props}>
            <Link href="/" className={styles.backBtn}>
                <ArrowLeft size={16} />
                My Plants
            </Link>

            <PlantPhoto photo={plant.photo} alt={displayName(plant)} className={styles.detailHero} />

            <header className={styles.appHeader} style={HEADER_STYLE}>
                <div>
                    <h1>
                        {displayName(plant)}
                    </h1>
                    <div className={styles.sub} style={SUB_STYLE}>
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

            <div className={styles.sectionTitle}>
                Log care
            </div>
            <div className={styles.taskList}>
                {[CareKind.Water, CareKind.Fertilize, CareKind.Repot].map((kind) => {
                    return (
                        <CareLogRow key={kind} plant={plant} kind={kind} now={now} onDone={handleMarkDone} />
                    );
                })}
            </div>

            <div className={styles.sectionTitle}>
                Schedule
            </div>
            {renderSchedule()}

            <DeletePlantBlock plantName={displayName(plant)} isConfirming={isConfirmDelete} onKeep={handleKeepPlant} onRemove={handleRemove} onStartDelete={handleStartDelete} />
        </div>
    );
};
