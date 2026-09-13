import React, { useId } from 'react';
import { Camera, Check } from 'lucide-react';

// Constants
import { ButtonVariant } from '@/design-system/Button/constants';

// Components
import Button from '@/design-system/Button';

// Styles
import styles from '../styles.module.css';

export interface Props {
    apiKey: string;
    isKeySaved: boolean;
    onKeyChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSaveKey: () => void;
}

const RecognitionCard: React.FunctionComponent<Props> = ({ apiKey, isKeySaved, onKeyChange, onSaveKey }) => {
    const classes = styles.settingsCard;
    const keyId = useId();

    return (
        <div className={classes}>
            <h2>
                <Camera size="1.125rem" aria-hidden />
                Plant recognition
            </h2>
            <p>
                Identification uses the free
                <a href="https://my.plantnet.org" target="_blank" rel="noreferrer">
                    PlantNet API
                </a>
                . Create an account, copy your API key, and paste it here to enable recognition.
            </p>
            <div className={styles.field}>
                <label htmlFor={keyId}>
                    PlantNet API key
                </label>
                <input id={keyId} value={apiKey} onChange={onKeyChange} placeholder="2b10…" autoCapitalize="off" autoCorrect="off" autoComplete="off" spellCheck={false} />
            </div>
            <Button variant={ButtonVariant.Secondary} block onClick={onSaveKey}>
                {isKeySaved ? (
                    <React.Fragment>
                        <Check size="0.875rem" aria-hidden />
                        Saved
                    </React.Fragment>
                ) : 'Save key'}
            </Button>
        </div>
    );
};

export default RecognitionCard;
