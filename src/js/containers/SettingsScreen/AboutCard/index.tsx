import React from 'react';
import { Info } from 'lucide-react';

// Constants
import { NO_MARGIN_STYLE } from '../constants';

// Styles
import styles from '../styles.module.scss';

interface Props {
    plantCount: number;
}

export const AboutCard: React.FunctionComponent<Props> = ({ plantCount }) => {
    const classes = styles.settingsCard;

    return (
        <div className={classes}>
            <h3>
                <Info size={18} />
                About
            </h3>
            <p style={NO_MARGIN_STYLE}>
                {`Sprout — ${plantCount} plant${plantCount === 1 ? '' : 's'} tracked. Your plants are synced to your account and available on any device. Install via your browser's "Add to Home Screen" for the full app experience.`}
            </p>
        </div>
    );
};
