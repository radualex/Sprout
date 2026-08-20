'use client';

import React, { useCallback } from 'react';
import { capitalize } from 'lodash-es';
import { Check } from 'lucide-react';

// Constants
import { ButtonSize, ButtonVariant } from '@/design-system/Button/constants';

// Components
import { Button } from '@/design-system/Button';

// Helpers
import { formatDaysAgo } from './helpers';
import { CARE_META, DAY_MS } from '@/js/helpers/care';

// Styles
import styles from './styles.module.scss';

// Types
import type { CareKind, Plant } from '@/js/types';

interface Props extends React.ComponentProps<'div'> {
    plant: Plant;
    kind: CareKind;
    now: number;
    onDone: (kind: CareKind) => void;
}

export const CareLogRow: React.FunctionComponent<Props> = ({ plant, kind, now, onDone, ...props }) => {
    const meta = CARE_META[kind];
    const last = plant.lastCare[kind];
    const daysAgo = Math.floor((now - last) / DAY_MS);

    const handleDone = useCallback(() => {
        onDone(kind);
    }, [onDone, kind]);

    const rootClasses = styles.taskRow;

    return (
        <div className={rootClasses} {...props}>
            <div className={styles.thumb}>
                <meta.icon size={18} />
            </div>
            <div className={styles.info}>
                <div className={styles.title}>
                    {meta.label}
                </div>
                <div className={styles.when}>
                    {`Last ${meta.verb} ${formatDaysAgo(daysAgo)}`}
                </div>
            </div>
            <Button variant={ButtonVariant.Soft} size={ButtonSize.Sm} onClick={handleDone} icon={Check}>
                {`${capitalize(meta.verb)} today`}
            </Button>
        </div>
    );
};
