'use client';

import React, { useCallback } from 'react';
import { capitalize } from 'lodash-es';

// Helpers
import { CARE_META, DAY_MS } from '../../helpers/care';

// Styles
import shared from '../../scss/shared.module.scss';

// Types
import type { CareKind, Plant } from '../../types';

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

    return (
        <div className={shared.taskRow} {...props}>
            <div className={shared.thumb}>{meta.emoji}</div>
            <div className={shared.info}>
                <div className={shared.title}>{meta.label}</div>
                <div className={shared.when}>
                    Last {meta.verb} {daysAgo === 0 ? 'today' : (daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`)}
                </div>
            </div>
            <button type="button" className={shared.doneBtn} onClick={handleDone}>
                ✓ {capitalize(meta.verb)} today
            </button>
        </div>
    );
};
