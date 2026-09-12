import React from 'react';
import { User } from 'lucide-react';

// Constants
import { NO_MARGIN_STYLE } from '../constants';
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import { Button } from '@/design-system/Button';

// Styles
import styles from '../styles.module.scss';

interface Props {
    user: {
        name: string;
        email: string;
    };
    onSignOut: () => void;
}

export const AccountCard: React.FunctionComponent<Props> = ({ user, onSignOut }) => {
    const classes = styles.settingsCard;

    return (
        <div className={classes}>
            <h3>
                <User size={18} />
                Account
            </h3>
            <p style={NO_MARGIN_STYLE}>
                <span>
                    {`Signed in as `}
                </span>
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
