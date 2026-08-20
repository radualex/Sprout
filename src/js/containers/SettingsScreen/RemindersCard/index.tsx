import React from 'react';
import classNames from 'classnames';
import { Bell, Check, Lightbulb } from 'lucide-react';

// Constants
import { IPHONE_HINT_STYLE } from '../constants';
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import { Button } from '@/design-system/Button';

// Services
import { isNotificationsSupported } from '@/js/services/notifications';

// Styles
import styles from '../styles.module.scss';

interface Props {
    perm: NotificationPermission;
    onEnable: () => void;
    onTest: () => void;
}

export const RemindersCard: React.FunctionComponent<Props> = ({ perm, onEnable, onTest }) => {
    const warnNoticeClasses = classNames(styles.notice, styles.warn);
    const classes = styles.settingsCard;

    const renderUnsupported = () => {
        return (
            <div className={warnNoticeClasses}>
                Notifications aren't supported in this browser.
            </div>
        );
    };

    const renderEnabled = () => {
        return (
            <React.Fragment>
                <div className={styles.notice}>
                    <Check size={16} />
                    Notifications are enabled.
                </div>
                <Button variant={ButtonVariant.Secondary} block onClick={onTest}>
                    Send a test notification
                </Button>
            </React.Fragment>
        );
    };

    const renderBlocked = () => {
        return (
            <div className={warnNoticeClasses}>
                Notifications are blocked. Enable them for this site in your browser settings.
            </div>
        );
    };

    const renderPrompt = () => {
        return (
            <Button block onClick={onEnable}>
                Enable notifications
            </Button>
        );
    };

    const renderStatus = () => {
        if (!isNotificationsSupported()) {
            return renderUnsupported();
        }

        if (perm === 'granted') {
            return renderEnabled();
        }

        if (perm === 'denied' && Notification.permission === 'denied') {
            return renderBlocked();
        }

        return renderPrompt();
    };

    return (
        <div className={classes}>
            <h3>
                <Bell size={18} />
                Care reminders
            </h3>
            <p>
                Get a notification when a plant is due for watering, fertilising or repotting. Checks run
                when the app is open or in the background (installed app on Android/Chrome).
            </p>
            {renderStatus()}
            <p style={IPHONE_HINT_STYLE}>
                <Lightbulb size={16} />
                On iPhone, open this app in Safari, tap Share →
                <strong>
                    Add to Home Screen
                </strong>
                , then enable notifications from the installed app (iOS 16.4+).
            </p>
        </div>
    );
};
