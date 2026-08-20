'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';

// Constants
import type { ButtonVariant } from '@/design-system/Button/constants';

// Components
import { Button } from '@/design-system/Button';

interface Action {
    key: string;
    label: string;
    icon?: LucideIcon;
    variant: ButtonVariant;
    onClick: () => void;
    disabled?: boolean;
}

interface Props {
    actions: Action[];
}

const renderAction = (action: Action) => {
    return (
        <Button key={action.key} variant={action.variant} grow onClick={action.onClick} disabled={action.disabled} icon={action.icon}>
            {action.label}
        </Button>
    );
};

export const ShutterActions: React.FunctionComponent<Props> = ({ actions }) => {
    return (
        <React.Fragment>
            {actions.map((action) => {
                return renderAction(action);
            })}
        </React.Fragment>
    );
};
