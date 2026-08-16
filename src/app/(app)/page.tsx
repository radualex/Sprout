// Components
import { PlantsScreen } from '@/js/containers/PlantsScreen';

// Lib
import { getPlantsForUser } from '@/js/lib/queries/plants';
import { requireUser } from '@/js/lib/session';

const PlantsPage = async () => {
    const session = await requireUser();
    const plants = await getPlantsForUser(session.user.id);

    return <PlantsScreen plants={plants} />;
};

export default PlantsPage;
