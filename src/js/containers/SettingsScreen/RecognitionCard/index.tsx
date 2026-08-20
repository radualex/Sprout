import React from 'react';
import { Camera, Check } from 'lucide-react';

// Constants
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import { Button } from '@/design-system/Button';

// Styles
import styles from '../styles.module.scss';

interface Props {
    apiKey: string;
    isKeySaved: boolean;
    onKeyChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSaveKey: () => void;
}

export const RecognitionCard: React.FunctionComponent<Props> = ({ apiKey, isKeySaved, onKeyChange, onSaveKey }) => {
    const classes = styles.settingsCard;

    return (
        <div className={classes}>
            <h3>
                <Camera size={18} />
                Plant recognition
            </h3>
            <p>
                Identification uses the free
                <a href="https://my.plantnet.org" target="_blank" rel="noreferrer">
                    PlantNet API
                </a>
                . Create an account, copy your API key, and paste it here to enable recognition.
            </p>
            <div className={styles.field}>
                <label htmlFor="settings-plantnet-key">
                    PlantNet API key
                </label>
                <input id="settings-plantnet-key" value={apiKey} onChange={onKeyChange} placeholder="2b10…" autoCapitalize="off" autoCorrect="off" />
            </div>
            <Button variant={ButtonVariant.Secondary} block onClick={onSaveKey}>
                {isKeySaved ? (
                    <React.Fragment>
                        <Check size={14} />
                        Saved
                    </React.Fragment>
                ) : 'Save key'}
            </Button>
        </div>
    );
};
