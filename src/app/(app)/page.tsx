import type { Metadata } from 'next';

// Components
import PlantsScreen from '@/containers/PlantsScreen';

// Database
import { getPlantsForUser } from '@/lib/db/queries';

// Auth
import { requireUser } from '@/lib/auth/session';

export const metadata: Metadata = {
    title: 'My Plants',
    description: 'All your houseplants at a glance, with what needs care today.'
};

const PlantsPage = async () => {
    const session = await requireUser();
    const plants = await getPlantsForUser(session.user.id);

    return <PlantsScreen plants={plants} />;
};

export default PlantsPage;
