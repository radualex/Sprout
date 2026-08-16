// Components
import { PlantsScreen } from '@/js/containers/PlantsScreen';

// Database
import { getPlantsForUser } from '@/js/lib/db/queries';

// Auth
import { requireUser } from '@/js/lib/auth/session';

const PlantsPage = async () => {
    const session = await requireUser();
    const plants = await getPlantsForUser(session.user.id);

    return <PlantsScreen plants={plants} />;
};

export default PlantsPage;
