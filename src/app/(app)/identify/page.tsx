import type { Metadata } from 'next';

// Components
import IdentifyScreen from '@/containers/IdentifyScreen';

export const metadata: Metadata = {
    title: 'Identify',
    description: 'Identify a plant species from a photo with PlantNet.'
};

const IdentifyPage = () => {
    return <IdentifyScreen />;
};

export default IdentifyPage;
