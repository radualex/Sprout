import { useCallback, useEffect, useState } from 'react';

// Services
import { getPlantNetKey, setPlantNetKey } from '@/services/identify';

export interface PlantNetKeyState {
    key: string;
    setKey: (key: string) => void;
    saveKey: () => void;
}

export const usePlantNetKey = (): PlantNetKeyState => {
    const [key, setKey] = useState('');

    useEffect(() => {
        setKey(getPlantNetKey());
    }, []);

    const saveKey = useCallback(() => {
        setPlantNetKey(key);
    }, [key]);

    return {
        key,
        setKey,
        saveKey
    };
};
