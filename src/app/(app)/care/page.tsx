import type { Metadata } from 'next';

// Components
import CareScreen from '@/containers/CareScreen';

// Database
import { getPlantsForUser } from '@/lib/db/queries';

// Auth
import { requireUser } from '@/lib/auth/session';

export const metadata: Metadata = {
    title: 'Care',
    description: 'Everything due for watering, fertilising, and repotting.'
};

const CarePage = async () => {
    const session = await requireUser();
    const plants = await getPlantsForUser(session.user.id);

    return <CareScreen plants={plants} />;
};

export default CarePage;
