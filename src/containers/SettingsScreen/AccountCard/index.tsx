import React from 'react';
import { User } from 'lucide-react';

// Constants
import { NO_MARGIN_STYLE } from '../constants';
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import Button from '@/design-system/Button';

// Styles
import styles from '../styles.module.css';

// Types
import type { SettingsUser } from '../types';

export interface Props {
    user: SettingsUser;
    onSignOut: () => void;
}

const AccountCard: React.FunctionComponent<Props> = ({ user, onSignOut }) => {
    const classes = styles.settingsCard;

    return (
        <div className={classes}>
            <h2>
                <User size="1.125rem" aria-hidden />
                Account
            </h2>
            <p className={styles.accountLine} style={NO_MARGIN_STYLE}>
                Signed in as
                <strong>
                    {user.name}
                </strong>
                <span>
                    {user.email}
                </span>
            </p>
            <Button variant={ButtonVariant.Secondary} block onClick={onSignOut}>
                Sign out
            </Button>
        </div>
    );
};

export default AccountCard;
