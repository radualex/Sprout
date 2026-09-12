'use client';

import React from 'react';

// Components
import Button from '@/design-system/Button';

// Types
import type { Action } from './types';

export interface Props {
    actions: Action[];
}

const renderAction = (action: Action) => {
    return (
        <Button key={action.key} variant={action.variant} grow onClick={action.onClick} disabled={action.disabled} icon={action.icon}>
            {action.label}
        </Button>
    );
};

const ShutterActions: React.FunctionComponent<Props> = ({ actions }) => {
    return (
        <React.Fragment>
            {actions.map((action) => {
                return renderAction(action);
            })}
        </React.Fragment>
    );
};

export default ShutterActions;
